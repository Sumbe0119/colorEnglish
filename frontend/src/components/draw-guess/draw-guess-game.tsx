// frontend/src/components/draw-guess/draw-guess-game.tsx
// Зураг таах тоглоом — socket container. Өрөө үүсгэх / нэгдэх → lobby → ээлж бүрт нэг хүн 3 үгнээс сонгож зурна,
// бусад нь таана. 40 сек, 10 сек тутамд нэг үсэг тип болно. Бүх тоглогч 3 удаа зурсны дараа оноогоор ялагч тодорно.
// Socket протокол, самбарын op buffer/replay, серверийн цагийн зөрүү, 250мс tick энд; дүрслэл нь DrawGuessStage.
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import {
  createDrawGuessSocket,
  emitAck,
  HINT_EVERY_SECONDS,
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
import type { CanvasHandle } from './draw-canvas';
import { DrawGuessStage } from './draw-guess-stage';
import type { FeedItem } from './guess-feed';
import type { Conn } from './studio-scene';

const MAX_FEED = 120;

export function DrawGuessGame({ userId, playerName }: { userId: string; playerName: string }) {
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
  const [busy, setBusy] = useState(false);
  const [secret, setSecret] = useState<TurnSecret | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [now, setNow] = useState(() => Date.now());

  const me = room?.players.find((p) => p.userId === userId) ?? null;
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
  const createRoom = useCallback(() => void call<RoomState>('room:create').then((r) => r && setRoom(r)), [call]);
  const joinRoom = useCallback(
    (code: string) => {
      const c = code.trim().toUpperCase();
      if (c.length < 4) return toast.error('Өрөөний кодоо оруулна уу');
      void call<RoomState>('room:join', { code: c }).then((r) => r && setRoom(r));
    },
    [call],
  );
  const leaveRoom = useCallback(
    () =>
      void call<null>('room:leave').then(() => {
        setRoom(null);
        setSecret(null);
      }),
    [call],
  );
  const startGame = useCallback(() => void call<RoomState>('room:start'), [call]);
  const again = useCallback(() => void call<RoomState>('room:again'), [call]);
  const chooseWord = useCallback((index: number) => void call<RoomState>('turn:choose', { index }), [call]);
  const refreshRooms = useCallback(() => {
    socketRef.current?.emit('rooms:list', {}, (ack: { ok: boolean; data?: OpenRoomSummary[] }) => ack?.ok && ack.data && setOpenRooms(ack.data));
  }, []);
  const reconnect = useCallback(() => socketRef.current?.connect(), []);
  const copyCode = useCallback(() => {
    if (!room) return;
    navigator.clipboard?.writeText(room.code).then(
      () => toast.success('Код хуулагдлаа'),
      () => toast.error('Хуулж чадсангүй'),
    );
  }, [room]);

  const onGuess = useCallback(
    async (text: string): Promise<GuessResult | null> => {
      const socket = socketRef.current;
      if (!socket?.connected) {
        toast.error('Сервертэй холбогдоогүй байна');
        return null;
      }
      const ack = await emitAck<GuessResult>(socket, 'turn:guess', { text });
      if (!ack.ok) {
        toast.error(ack.message);
        return null;
      }
      if (ack.data.correct) {
        pushFeed({ kind: 'mine-correct', name: null, text: `Зөв таалаа! +${ack.data.points} оноо`, mine: true });
      } else {
        pushFeed({ kind: 'guess', name: me?.name ?? 'Та', text: text.toLowerCase().trim(), mine: true });
        if (ack.data.close) pushFeed({ kind: 'close', name: null, text: 'Ойрхон байна! Нэг үсгээр зөрж байна.', mine: true });
      }
      return ack.data;
    },
    [me?.name, pushFeed],
  );

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

  return (
    <DrawGuessStage
      userId={userId}
      playerName={playerName}
      conn={conn}
      connError={connError}
      room={room}
      openRooms={openRooms}
      busy={busy}
      secret={liveSecret}
      feed={feed}
      remaining={remaining}
      chooseRemaining={chooseRemaining}
      nextHintIn={nextHintIn}
      canvasRef={canvasRef}
      onCreateRoom={createRoom}
      onJoinRoom={joinRoom}
      onLeaveRoom={leaveRoom}
      onStartGame={startGame}
      onAgain={again}
      onChooseWord={chooseWord}
      onRefreshRooms={refreshRooms}
      onReconnect={reconnect}
      onCopyCode={copyCode}
      onGuess={onGuess}
      onOp={sendOp}
      onUndo={sendUndo}
      onClear={sendClear}
    />
  );
}
