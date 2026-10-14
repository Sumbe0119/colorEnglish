// frontend/src/components/draw-guess/draw-guess-game.tsx
// Зураг таах тоглоом: өрөө үүсгэх / нэгдэх → lobby → ээлж бүрт нэг хүн 3 үгнээс сонгож зурна, бусад нь таана.
// 40 сек, 10 сек тутамд нэг үсэг тип болно. Бүх тоглогч 3 удаа зурсны дараа оноогоор ялагч тодорно.
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { Copy, Crown, Lightbulb, LogOut, Palette, Pencil, Plus, RefreshCw, Timer, Trophy, Users, Wifi, WifiOff } from 'lucide-react';
import {
  createDrawGuessSocket,
  emitAck,
  HINT_EVERY_SECONDS,
  MIN_PLAYERS,
  refreshAccessToken,
  TURN_SECONDS,
  type DrawOp,
  type FeedEvent,
  type GuessResult,
  type OpenRoomSummary,
  type RoomState,
  type RoomStatePayload,
  type TurnSecret,
} from '@/lib/draw-guess-socket';
import { toast } from '@/store/toast-store';
import { DrawCanvas, type CanvasHandle } from './draw-canvas';
import { GuessFeed, type FeedItem } from './guess-feed';
import { PlayersStrip, Scoreboard } from './scoreboard';

type Conn = 'connecting' | 'online' | 'offline';

const MAX_FEED = 120;

export function DrawGuessGame({ userId }: { userId: string }) {
  const socketRef = useRef<Socket | null>(null);
  const canvasRef = useRef<CanvasHandle>(null);
  /** Энэ ээлжийн бүх зураас — самбар дараа нь mount болоход replay хийнэ. */
  const opsRef = useRef<DrawOp[]>([]);
  const offsetRef = useRef(0);
  const turnKeyRef = useRef(0);
  const feedSeq = useRef(0);

  const [conn, setConn] = useState<Conn>('connecting');
  const [connError, setConnError] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [openRooms, setOpenRooms] = useState<OpenRoomSummary[]>([]);
  const [joinCode, setJoinCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [secret, setSecret] = useState<TurnSecret | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [now, setNow] = useState(() => Date.now());

  const me = room?.players.find((p) => p.userId === userId) ?? null;
  const isHost = room?.hostUserId === userId;
  const isDrawer = !!room && room.drawerUserId === userId;
  const drawer = room?.players.find((p) => p.userId === room.drawerUserId) ?? null;
  const inGame = !!room && room.status !== 'lobby' && room.status !== 'finished';
  const liveSecret = secret && room && secret.turnKey === room.turnKey ? secret : null;

  const pushFeed = useCallback((item: Omit<FeedItem, 'id'>) => {
    setFeed((prev) => [...prev.slice(-MAX_FEED), { ...item, id: `l-${++feedSeq.current}` }]);
  }, []);

  // ---------- Самбарын op-ууд (buffer + canvas) ----------
  const applyOp = useCallback((op: DrawOp) => {
    const buf = opsRef.current;
    const last = buf[buf.length - 1];
    if (last && last.id === op.id && op.tool !== 'fill') last.points.push(...op.points);
    else buf.push({ ...op, points: [...op.points] });
    canvasRef.current?.apply(op);
  }, []);
  const undoOp = useCallback((id: string) => {
    opsRef.current = opsRef.current.filter((o) => o.id !== id);
    canvasRef.current?.undo(id);
  }, []);
  const clearOps = useCallback(() => {
    opsRef.current = [];
    canvasRef.current?.clear();
  }, []);

  // ---------- Socket ----------
  useEffect(() => {
    const socket = createDrawGuessSocket();
    socketRef.current = socket;
    let refreshed = false;

    socket.on('connect', () => {
      setConn('online');
      setConnError(null);
    });
    socket.on('disconnect', () => setConn('offline'));
    socket.on('connect_error', (err: Error) => {
      const msg = err?.message ?? '';
      if (msg.startsWith('UNAUTHORIZED') && !refreshed) {
        refreshed = true;
        void refreshAccessToken().then((ok) => {
          if (ok) socket.connect();
          else {
            setConn('offline');
            setConnError('Нэвтрэлт баталгаажсангүй. Дахин нэвтэрнэ үү.');
          }
        });
        return;
      }
      setConn('offline');
      setConnError(msg.startsWith('UNAUTHORIZED') ? 'Нэвтрэлт баталгаажсангүй. Дахин нэвтэрнэ үү.' : 'Сервертэй холбогдож чадсангүй.');
    });
    socket.on('room:state', ({ room: next, serverNow }: RoomStatePayload) => {
      offsetRef.current = serverNow - Date.now();
      setRoom(next);
    });
    socket.on('room:closed', () => {
      setRoom(null);
      setSecret(null);
      toast.info('Өрөө хаагдлаа');
    });
    socket.on('rooms:open', (list: OpenRoomSummary[]) => setOpenRooms(list));
    socket.on('turn:secret', (s: TurnSecret) => setSecret(s));
    socket.on('feed:event', (ev: FeedEvent) => {
      if (ev.kind === 'guess' && ev.userId === userId) return; // өөрийн буруу таалтыг локал нэмсэн
      pushFeed({ kind: ev.kind, name: ev.name, text: ev.text, mine: ev.userId === userId });
    });
    socket.on('draw:op', (op: DrawOp) => applyOp(op));
    socket.on('draw:undo', ({ id }: { id: string }) => undoOp(id));
    socket.on('draw:clear', () => clearOps());
    socket.on('draw:sync', ({ ops }: { ops: DrawOp[]; turnKey: number }) => {
      opsRef.current = ops.map((o) => ({ ...o, points: [...o.points] }));
      canvasRef.current?.replay(opsRef.current);
    });
    socket.connect();

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, applyOp, undoOp, clearOps, pushFeed]);

  // Шинэ ээлж → самбар цэвэрлэх, системийн мэдээ
  useEffect(() => {
    if (!room) {
      turnKeyRef.current = 0;
      setFeed([]);
      return;
    }
    if (room.status === 'lobby') {
      turnKeyRef.current = 0;
      return;
    }
    if (room.turnKey !== turnKeyRef.current) {
      turnKeyRef.current = room.turnKey;
      clearOps();
      if (room.status === 'choosing' && drawer) {
        pushFeed({
          kind: 'system',
          name: null,
          text: `Ээлж ${room.turn}/${room.totalTurns} · ${drawer.userId === userId ? 'Та' : drawer.name} зурна`,
          mine: false,
        });
      }
    }
  }, [room, drawer, userId, clearOps, pushFeed]);

  // Самбар mount болоход хуримтлагдсан зураасыг сэргээнэ
  useEffect(() => {
    if (inGame && opsRef.current.length) canvasRef.current?.replay(opsRef.current);
  }, [inGame]);

  // Цагийн tick
  useEffect(() => {
    if (!inGame) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [inGame]);

  const call = useCallback(async <T,>(event: string, payload?: unknown): Promise<T | null> => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      toast.error('Сервертэй холбогдоогүй байна');
      return null;
    }
    setBusy(true);
    try {
      const ack = await emitAck<T>(socket, event, payload);
      if (!ack.ok) {
        toast.error(ack.message);
        return null;
      }
      return ack.data;
    } finally {
      setBusy(false);
    }
  }, []);

  // ---------- Үйлдлүүд ----------
  const createRoom = () => void call<RoomState>('room:create').then((r) => r && setRoom(r));
  const joinRoom = (code: string) => {
    const c = code.trim().toUpperCase();
    if (c.length < 4) return toast.error('Өрөөний кодоо оруулна уу');
    void call<RoomState>('room:join', { code: c }).then((r) => r && setRoom(r));
  };
  const leaveRoom = () =>
    void call<null>('room:leave').then(() => {
      setRoom(null);
      setSecret(null);
    });
  const startGame = () => void call<RoomState>('room:start');
  const again = () => void call<RoomState>('room:again');
  const chooseWord = (index: number) => void call<RoomState>('turn:choose', { index });
  const copyCode = () => {
    if (!room) return;
    navigator.clipboard?.writeText(room.code).then(
      () => toast.success('Код хуулагдлаа'),
      () => toast.error('Хуулж чадсангүй'),
    );
  };

  const onGuess = async (text: string) => {
    const socket = socketRef.current;
    if (!socket?.connected) {
      toast.error('Сервертэй холбогдоогүй байна');
      return;
    }
    const ack = await emitAck<GuessResult>(socket, 'turn:guess', { text });
    if (!ack.ok) {
      toast.error(ack.message);
      return;
    }
    if (ack.data.correct) {
      pushFeed({ kind: 'mine-correct', name: null, text: `Зөв таалаа! +${ack.data.points} оноо`, mine: true });
    } else {
      pushFeed({ kind: 'guess', name: me?.name ?? 'Та', text: text.toLowerCase().trim(), mine: true });
      if (ack.data.close) pushFeed({ kind: 'close', name: null, text: 'Ойрхон байна! Нэг үсгээр зөрж байна.', mine: true });
    }
  };

  const sendOp = useCallback((op: DrawOp) => {
    // Өөрийн зураасыг buffer-т хадгална (reconnect / replay-д)
    const buf = opsRef.current;
    const last = buf[buf.length - 1];
    if (last && last.id === op.id && op.tool !== 'fill') last.points.push(...op.points);
    else buf.push({ ...op, points: [...op.points] });
    socketRef.current?.emit('draw:op', { op });
  }, []);
  const sendUndo = useCallback(() => {
    opsRef.current.pop();
    socketRef.current?.emit('draw:undo');
  }, []);
  const sendClear = useCallback(() => {
    opsRef.current = [];
    socketRef.current?.emit('draw:clear');
  }, []);

  // ---------- Тооцоолол ----------
  const serverNow = now + offsetRef.current;
  const remaining = room?.turnEndAt ? Math.max(0, Math.ceil((room.turnEndAt - serverNow) / 1000)) : null;
  const chooseRemaining = room?.chooseEndAt ? Math.max(0, Math.ceil((room.chooseEndAt - serverNow) / 1000)) : null;
  const nextHintIn = useMemo(() => {
    if (remaining == null) return null;
    const elapsed = TURN_SECONDS - remaining;
    const nextAt = (Math.floor(elapsed / HINT_EVERY_SECONDS) + 1) * HINT_EVERY_SECONDS;
    if (nextAt >= TURN_SECONDS) return null;
    return nextAt - elapsed;
  }, [remaining]);

  const sortedPlayers = room ? [...room.players].sort((a, b) => b.score - a.score) : [];

  // ---------- Render ----------
  const connBadge = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${
        conn === 'online' ? 'border-success/30 bg-success/10 text-success' : 'border-ink-600/80 bg-ink-900 text-mist-400'
      }`}
    >
      {conn === 'online' ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      {conn === 'online' ? 'Холбогдсон' : conn === 'connecting' ? 'Холбогдож байна…' : 'Холболтгүй'}
    </span>
  );

  // ----- Өрөөнд ороогүй -----
  if (!room) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {connBadge}
          {connError && <span className="text-xs text-danger">{connError}</span>}
          {conn === 'offline' && (
            <button
              type="button"
              onClick={() => socketRef.current?.connect()}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 px-3 py-1.5 text-xs text-mist-200 hover:bg-ink-800"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Дахин холбогдох
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-4 shadow-card sm:p-5">
            <h3 className="font-display text-base font-semibold text-mist-50">Шинэ өрөө үүсгэх</h3>
            <p className="mt-1 text-xs text-mist-400">
              Код гарч ирнэ, найзууддаа илгээгээд 2–8 хүн тоглоно. Хүн бүр 3 удаа зурна.
            </p>
            <button
              type="button"
              disabled={busy || conn !== 'online'}
              onClick={createRoom}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Өрөө үүсгэх
            </button>
          </div>

          <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-4 shadow-card sm:p-5">
            <h3 className="font-display text-base font-semibold text-mist-50">Кодоор нэгдэх</h3>
            <p className="mt-1 text-xs text-mist-400">Найзынхаа илгээсэн 5 оронтой кодыг оруул.</p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                joinRoom(joinCode);
              }}
            >
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5))}
                placeholder="ABC12"
                className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-2.5 font-mono text-lg uppercase tracking-[0.3em] text-mist-50 outline-none focus:border-brand"
              />
              <button
                type="submit"
                disabled={busy || conn !== 'online'}
                className="shrink-0 rounded-xl border border-brand/50 bg-brand/15 px-4 py-2.5 text-sm font-semibold text-mist-50 hover:bg-brand/25 disabled:opacity-50"
              >
                Нэгдэх
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-4 shadow-card sm:p-5">
          <div className="flex items-center justify-between">
            <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold text-mist-50">
              <Users className="h-4 w-4 text-brand" /> Нээлттэй өрөөнүүд
            </h3>
            <button
              type="button"
              onClick={() =>
                socketRef.current?.emit('rooms:list', {}, (ack: { ok: boolean; data?: OpenRoomSummary[] }) => ack?.ok && ack.data && setOpenRooms(ack.data))
              }
              className="inline-flex items-center gap-1.5 text-xs text-mist-400 hover:text-mist-100"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Шинэчлэх
            </button>
          </div>
          {openRooms.length === 0 ? (
            <p className="mt-3 text-sm text-mist-500">Одоогоор хүлээж буй өрөө алга. Шинээр үүсгээд найзаа урь.</p>
          ) : (
            <ul className="mt-3 divide-y divide-ink-600/60">
              {openRooms.map((r) => (
                <li key={r.code} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5">
                  <span className="font-mono text-base tracking-widest text-mist-50">{r.code}</span>
                  <span className="text-xs text-mist-400">{r.hostName}</span>
                  <span className="ml-auto text-xs text-mist-400">
                    {r.playerCount}/{r.maxPlayers}
                  </span>
                  <button
                    type="button"
                    disabled={busy || conn !== 'online'}
                    onClick={() => joinRoom(r.code)}
                    className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
                  >
                    Нэгдэх
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-ink-600/80 bg-ink-900/60 p-4 text-xs text-mist-400 sm:p-5">
          <p className="font-medium text-mist-200">Дүрэм</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Ээлжийн тоглогч B1 ба түүнээс дээш түвшний 3 үгнээс нэгийг сонгож 40 секундэд зурна, бусад нь англиар таана.</li>
            <li>10 секунд тутамд үгний нэг үсэг тип болж нээгдэнэ. Үсгийн тоо эхнээсээ харагдана.</li>
            <li>Түрүүлж таасан хүн 100 оноо, дараагийнх 80, 60… гэж буурна. Зурсан хүн таасан хүн бүрээс +10.</li>
            <li>Бүх тоглогч 3 удаа зурсны дараа хамгийн их оноотой нь ялна.</li>
          </ul>
        </div>
      </div>
    );
  }

  // ----- Lobby -----
  if (room.status === 'lobby') {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {connBadge}
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 text-xs text-mist-300">
            Өрөөний код
            <span className="font-mono text-sm tracking-[0.3em] text-mist-50">{room.code}</span>
            <button type="button" onClick={copyCode} className="text-mist-400 hover:text-mist-50" aria-label="Код хуулах">
              <Copy className="h-3.5 w-3.5" />
            </button>
          </span>
          <span className="rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 text-xs text-mist-300">
            {room.players.length}/{room.maxPlayers} тоглогч
          </span>
          <button
            type="button"
            onClick={leaveRoom}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-ink-600 px-3 py-1.5 text-xs text-mist-300 hover:bg-ink-800"
          >
            <LogOut className="h-3.5 w-3.5" /> Гарах
          </button>
        </div>

        <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-4 shadow-card sm:p-6">
          <h2 className="font-display text-lg font-semibold text-mist-50">Тоглогчдыг хүлээж байна</h2>
          <p className="mt-1 text-sm text-mist-400">
            Дор хаяж {MIN_PLAYERS} тоглогч хэрэгтэй. Хүн бүр {room.totalRounds} удаа зурна.
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {room.players.map((p) => (
              <li
                key={p.userId}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                  p.userId === userId ? 'border-brand/50 bg-brand/10' : 'border-ink-600/80 bg-ink-800/60'
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-700 text-sm font-semibold text-mist-100">
                  {p.name.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm text-mist-50">
                    {p.name}
                    {p.userId === userId && <span className="text-mist-500"> (та)</span>}
                  </p>
                  {p.isHost && (
                    <p className="inline-flex items-center gap-1 text-[11px] text-modifier">
                      <Crown className="h-3 w-3" /> эзэн
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-mist-500">40 сек / ээлж · 10 сек тутамд нэг үсэг тип · оноо: 100, 80, 60…</p>
            {isHost ? (
              <button
                type="button"
                disabled={busy || conn !== 'online' || room.players.length < MIN_PLAYERS}
                onClick={startGame}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
              >
                <Palette className="h-4 w-4" /> Тоглоом эхлэх
              </button>
            ) : (
              <p className="text-sm text-mist-400">
                Өрөөний эзэн <span className="text-mist-100">{room.players.find((p) => p.isHost)?.name}</span> эхлүүлэхийг хүлээж байна…
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----- Дууссан -----
  if (room.status === 'finished') {
    const winner = sortedPlayers[0];
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {connBadge}
          <span className="rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 font-mono tracking-[0.25em] text-mist-200">{room.code}</span>
        </div>
        <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-5 shadow-card sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-modifier/15 text-modifier">
              <Trophy className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-mist-500">Тоглоом дууслаа</p>
              <h2 className="font-display text-xl font-semibold text-mist-50">
                Ялагч: {winner ? winner.name : '—'}
                {winner?.userId === userId && <span className="text-success"> — та!</span>}
              </h2>
              {winner && <p className="text-sm text-mist-400">{winner.score} оноо</p>}
            </div>
          </div>

          <ol className="mt-5 divide-y divide-ink-600/60 rounded-xl border border-ink-600/80">
            {sortedPlayers.map((p, i) => (
              <li key={p.userId} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${p.userId === userId ? 'bg-brand/10' : ''}`}>
                <span className={`w-6 font-mono text-sm ${i === 0 ? 'text-modifier' : i === 1 ? 'text-mist-200' : i === 2 ? 'text-[#c97c4f]' : 'text-mist-500'}`}>
                  {i + 1}.
                </span>
                <span className="flex-1 text-mist-100">
                  {p.name}
                  {p.userId === userId && <span className="text-mist-500"> (та)</span>}
                  {!p.connected && <span className="text-mist-500"> · салсан</span>}
                </span>
                <span className="font-mono font-semibold text-mist-50">{p.score}</span>
              </li>
            ))}
          </ol>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            {isHost && (
              <button
                type="button"
                disabled={busy}
                onClick={again}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" /> Дахин тоглох (lobby)
              </button>
            )}
            <button
              type="button"
              onClick={leaveRoom}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-600 px-5 py-3 text-sm font-medium text-mist-200 hover:bg-ink-800"
            >
              <LogOut className="h-4 w-4" /> Өрөөнөөс гарах
            </button>
          </div>
          {!isHost && <p className="mt-3 text-xs text-mist-500">Өрөөний эзэн дахин эхлүүлэхийг хүлээж байна.</p>}
        </div>
      </div>
    );
  }

  // ----- Тоглоом (choosing / drawing / reveal) -----
  const canGuess = room.status === 'drawing' && !isDrawer && me?.guessedAt == null && conn === 'online';
  const disabledNote = isDrawer
    ? 'Та зурж байна'
    : me?.guessedAt != null
      ? 'Та зөв таалаа — бусдыг хүлээ'
      : room.status === 'choosing'
        ? 'Үг сонгохыг хүлээж байна…'
        : room.status === 'reveal'
          ? 'Ээлж дууслаа'
          : 'Холбогдоогүй';

  let overlay: React.ReactNode = null;
  if (room.status === 'choosing') {
    overlay = (
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-y-auto bg-ink-950/70 p-2 backdrop-blur-[2px] sm:p-4">
        {isDrawer ? (
          <div className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-ink-600/80 bg-ink-900 p-3 shadow-card sm:p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-mist-500 sm:text-xs">Таны ээлж — зурах үгээ сонго</p>
            <p className="mt-0.5 text-[11px] text-mist-400 sm:mt-1 sm:text-xs">{chooseRemaining ?? 0} секундийн дараа эхнийх нь автоматаар сонгогдоно.</p>
            <div className="mt-2 grid gap-1.5 sm:mt-4 sm:gap-2">
              {(liveSecret?.options ?? []).map((w, i) => (
                <button
                  key={w.word}
                  type="button"
                  disabled={busy}
                  onClick={() => chooseWord(i)}
                  className="flex items-center justify-between gap-3 rounded-xl border border-ink-600/80 bg-ink-800/60 px-3 py-2 text-left hover:border-brand hover:bg-brand/10 disabled:opacity-50 sm:px-4 sm:py-3"
                >
                  <span className="font-display text-base font-semibold text-mist-50 sm:text-lg">{w.word}</span>
                  <span className="truncate text-xs text-mist-400 sm:text-sm">{w.meaning}</span>
                </button>
              ))}
              {!liveSecret?.options && <p className="text-sm text-mist-400">Үгнүүдийг ачаалж байна…</p>}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Pencil className="mx-auto h-6 w-6 text-brand sm:h-8 sm:w-8" />
            <p className="mt-2 font-display text-base font-semibold text-mist-50 sm:text-lg">{drawer?.name ?? '…'} үг сонгож байна</p>
            <p className="text-sm text-mist-400">{chooseRemaining ?? 0} сек</p>
          </div>
        )}
      </div>
    );
  } else if (room.status === 'reveal') {
    const guessed = room.players.filter((p) => p.guessedAt != null).sort((a, b) => (a.guessedAt ?? 0) - (b.guessedAt ?? 0));
    overlay = (
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-y-auto bg-ink-950/70 p-2 backdrop-blur-[2px] sm:p-4">
        <div className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-ink-600/80 bg-ink-900 p-3 text-center shadow-card sm:p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-mist-500 sm:text-xs">Үг нь</p>
          <p className="mt-0.5 font-display text-2xl font-bold text-mist-50 sm:mt-1 sm:text-3xl">{room.revealedWord?.word ?? '—'}</p>
          <p className="text-xs text-mist-400 sm:text-sm">{room.revealedWord?.meaning}</p>
          <div className="mt-2 space-y-1 text-xs sm:mt-4 sm:text-sm">
            {guessed.length === 0 ? (
              <p className="text-mist-500">Хэн ч таасангүй</p>
            ) : (
              guessed.map((p, i) => (
                <p key={p.userId} className="flex items-center justify-between rounded-lg bg-success/10 px-3 py-1.5 text-success">
                  <span>
                    {i + 1}. {p.name}
                  </span>
                  <span className="font-mono">+{p.turnPoints}</span>
                </p>
              ))
            )}
            {drawer && drawer.turnPoints > 0 && (
              <p className="flex items-center justify-between rounded-lg bg-brand/10 px-3 py-1.5 text-brand">
                <span className="inline-flex items-center gap-1">
                  <Pencil className="h-3.5 w-3.5" /> {drawer.name} (зурсан)
                </span>
                <span className="font-mono">+{drawer.turnPoints}</span>
              </p>
            )}
          </div>
          <p className="mt-3 text-xs text-mist-500">Дараагийн ээлж удахгүй…</p>
        </div>
      </div>
    );
  }

  const wordBar = (() => {
    if (room.status === 'drawing' && isDrawer) {
      return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[11px] uppercase tracking-wider text-mist-500 sm:text-xs">Таны үг</span>
          <span className="font-display text-xl font-bold text-mist-50 sm:text-2xl">{liveSecret?.word?.word ?? '…'}</span>
          <span className="text-xs text-mist-400 sm:text-sm">{liveSecret?.word?.meaning}</span>
          <span className="ml-auto hidden text-xs text-mist-500 sm:inline">Бусдад харагдахгүй — зур!</span>
        </div>
      );
    }
    if (room.status === 'drawing' && room.masked) {
      const chars = [...room.masked];
      const letterCount = chars.filter((c) => c !== ' ').length;
      return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:gap-x-4 sm:gap-y-2">
          <div className="flex flex-wrap items-end gap-0.5 sm:gap-1">
            {chars.map((ch, i) =>
              ch === ' ' ? (
                <span key={i} className="w-2 sm:w-3" />
              ) : (
                <span
                  key={i}
                  className={`flex h-7 w-5 items-center justify-center rounded-md border-b-2 font-mono text-base font-semibold sm:h-9 sm:w-7 sm:text-xl ${
                    ch === '_' ? 'border-ink-500 text-mist-500' : 'border-brand bg-brand/15 text-mist-50'
                  }`}
                >
                  {ch === '_' ? '·' : ch}
                </span>
              ),
            )}
          </div>
          <span className="text-[11px] text-mist-500 sm:text-xs">{letterCount} үсэг</span>
          {nextHintIn != null && me?.guessedAt == null && (
            <span className="inline-flex items-center gap-1 text-[11px] text-modifier sm:text-xs">
              <Lightbulb className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Дараагийн </span>тип {nextHintIn} сек
            </span>
          )}
        </div>
      );
    }
    if (room.status === 'choosing') {
      return <p className="text-sm text-mist-400">{isDrawer ? 'Зурах үгээ сонго' : `${drawer?.name ?? '…'} үг сонгож байна…`}</p>;
    }
    return (
      <p className="text-sm text-mist-300">
        Үг: <span className="font-semibold text-mist-50">{room.revealedWord?.word}</span>
        {room.revealedWord?.meaning && <span className="text-mist-500"> — {room.revealedWord.meaning}</span>}
      </p>
    );
  })();

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Толгой — утсан дээр зөвхөн чухал pill-үүд: тойрог/ээлж, цаг, гарах. Холболт тасарвал л badge гарна. */}
      <div className="flex items-center gap-1.5 text-xs sm:gap-2">
        <span className={conn === 'online' ? 'hidden sm:inline-flex' : 'inline-flex'}>{connBadge}</span>
        <span className="hidden rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 font-mono tracking-[0.25em] text-mist-200 sm:inline">
          {room.code}
        </span>
        <span className="rounded-full border border-ink-600/80 bg-ink-900 px-2.5 py-1.5 text-mist-300 sm:px-3">
          <span className="sm:hidden">
            Т {room.round}/{room.totalRounds} · Э {room.turn}/{room.totalTurns}
          </span>
          <span className="hidden sm:inline">
            Тойрог {room.round}/{room.totalRounds} · Ээлж {room.turn}/{room.totalTurns}
          </span>
        </span>
        <span
          className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-sm font-semibold ${
            remaining != null && remaining <= 10 ? 'border-danger/40 bg-danger/10 text-danger' : 'border-ink-600/80 bg-ink-900 text-mist-100'
          }`}
        >
          <Timer className="h-3.5 w-3.5 text-brand" />
          {remaining != null ? `${remaining} сек` : room.status === 'choosing' ? `${chooseRemaining ?? 0} сек` : '—'}
        </span>
        <button
          type="button"
          onClick={leaveRoom}
          aria-label="Гарах"
          className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 px-2.5 py-1.5 text-mist-300 hover:bg-ink-800 sm:px-3"
        >
          <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Гарах</span>
        </button>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
        {/* Оноо: утсан дээр хэвтээ chip мөр, том дэлгэцэд зүүн талын хүснэгт */}
        <div className="order-1 lg:hidden">
          <PlayersStrip players={room.players} drawerUserId={room.drawerUserId} userId={userId} />
        </div>
        <div className="hidden lg:order-1 lg:block">
          <Scoreboard players={room.players} drawerUserId={room.drawerUserId} userId={userId} showTurnPoints={room.status !== 'choosing'} />
        </div>

        <div className="order-2 space-y-2 sm:space-y-3">
          <div className="rounded-2xl border border-ink-600/80 bg-ink-900 px-3 py-2 shadow-card sm:px-4 sm:py-3">{wordBar}</div>
          <DrawCanvas
            ref={canvasRef}
            canDraw={isDrawer && room.status === 'drawing'}
            onOp={sendOp}
            onUndo={sendUndo}
            onClear={sendClear}
            overlay={overlay}
          />
        </div>

        <div className="order-3 h-[300px] sm:h-[380px] lg:h-[560px]">
          <GuessFeed items={feed} canGuess={canGuess} disabledNote={disabledNote} onGuess={onGuess} />
        </div>
      </div>
    </div>
  );
}
