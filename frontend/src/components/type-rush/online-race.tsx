// frontend/src/components/type-rush/online-race.tsx
// Онлайн горим: өрөө үүсгэх / код эсвэл жагсаалтаас нэгдэх, 5 хүртэл тоглогч, хоосон замд бот.
// Серверийн цагаар зэрэг эхэлж, бусдын явцыг socket-оор аваад гөлгөр (lerp) хөдөлгөнө.
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { Copy, Crown, Flag, LogOut, Plus, RefreshCw, Timer, Users, Wifi, WifiOff } from 'lucide-react';
import { botCharsAt, buildRaceText, computeWpm, LANES, RACE_CARS, RACE_LEVELS, RaceLevel } from '@/lib/type-rush';
import {
  createTypeRushSocket,
  emitAck,
  refreshAccessToken,
  type OpenRoomSummary,
  type RoomState,
  type RoomStatePayload,
} from '@/lib/type-rush-socket';
import { toast } from '@/store/toast-store';
import { CarSprite } from './car-sprite';
import { RaceTrack, type TrackHandle, type TrackLane } from './race-track';
import { ResultsPanel, formatSeconds, type StandingRow } from './results-panel';
import { TypingPanel } from './typing-panel';
import { useTypingRace } from './use-typing-race';

type Conn = 'connecting' | 'online' | 'offline';

const PROGRESS_EMIT_MS = 80;

export function OnlineRace({ playerName, userId }: { playerName: string; userId: string }) {
  const socketRef = useRef<Socket | null>(null);
  const [conn, setConn] = useState<Conn>('connecting');
  const [connError, setConnError] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [openRooms, setOpenRooms] = useState<OpenRoomSummary[]>([]);
  const [joinCode, setJoinCode] = useState('');
  const [createLevel, setCreateLevel] = useState<RaceLevel>('A1');
  const [busy, setBusy] = useState(false);

  // Уралдааны локал төлөв
  const [goReached, setGoReached] = useState(false);
  const [goFlash, setGoFlash] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [localFinishMs, setLocalFinishMs] = useState<number | null>(null);
  const [liveWpm, setLiveWpm] = useState(0);
  const [, setTick] = useState(0);

  const roomRef = useRef<RoomState | null>(null);
  const offsetRef = useRef(0);
  const startPerfRef = useRef(0);
  const raceKeyRef = useRef('');
  const trackRef = useRef<TrackHandle>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const targetsRef = useRef<Map<string, number>>(new Map());
  const displayRef = useRef<Map<string, number>>(new Map());
  const arrivedRef = useRef<Set<string>>(new Set());
  const botPuffRef = useRef<Map<number, number>>(new Map());
  const lastEmitRef = useRef(0);
  const correctRef = useRef(0);
  const myLaneRef = useRef<number | null>(null);
  const localFinishRef = useRef<number | null>(null);

  roomRef.current = room;
  localFinishRef.current = localFinishMs;

  const me = room?.players.find((p) => p.userId === userId) ?? null;
  const myLane = me?.lane ?? null;
  myLaneRef.current = myLane;
  const isHost = room?.hostUserId === userId;
  const text = room?.text ?? '';
  const inRace = !!room && room.status !== 'lobby';
  const myFinishMs = localFinishMs ?? me?.finishMs ?? null;

  // ---------- Socket ----------
  useEffect(() => {
    const socket = createTypeRushSocket();
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
      toast.info('Өрөө хаагдлаа');
    });
    socket.on('rooms:open', (list: OpenRoomSummary[]) => setOpenRooms(list));
    socket.on('race:positions', ({ userId: uid, progress }: { userId: string; progress: number }) => {
      const prev = targetsRef.current.get(uid) ?? 0;
      if (progress > prev) targetsRef.current.set(uid, progress);
    });
    socket.connect();

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

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

  // ---------- Бичих ----------
  const emitProgress = useCallback((p: number, force = false) => {
    const socket = socketRef.current;
    if (!socket?.connected) return;
    const now = performance.now();
    if (!force && now - lastEmitRef.current < PROGRESS_EMIT_MS) return;
    lastEmitRef.current = now;
    socket.emit('race:progress', { progress: p });
  }, []);

  const onFinish = useCallback(() => {
    const ms = performance.now() - startPerfRef.current;
    setLocalFinishMs(ms);
    if (timerRef.current) timerRef.current.textContent = formatSeconds(ms);
    const lane = myLaneRef.current;
    if (lane != null) {
      trackRef.current?.setProgress(lane, 1);
      trackRef.current?.emitPuffs(lane, 4, 16);
    }
    const socket = socketRef.current;
    if (socket?.connected) {
      void emitAck<RoomState>(socket, 'race:finish', { ms }).then((ack) => {
        if (!ack.ok) toast.error(ack.message);
      });
    }
  }, []);

  const typing = useTypingRace({
    text,
    active: inRace && goReached && myLane != null && myFinishMs == null && room?.status !== 'finished',
    onProgress: (correct, total) => {
      correctRef.current = correct;
      const p = total ? correct / total : 0;
      const lane = myLaneRef.current;
      if (lane != null) trackRef.current?.setProgress(lane, p);
      emitProgress(p);
    },
    onWord: (cps, correct) => {
      const lane = myLaneRef.current;
      if (lane != null) {
        const count = cps >= 6 ? 5 : cps >= 3.5 ? 3 : 2;
        const size = cps >= 6 ? 18 : cps >= 3.5 ? 14 : 11;
        trackRef.current?.emitPuffs(lane, count, size);
        if (cps >= 3.5) trackRef.current?.boost(lane);
      }
      emitProgress(text.length ? correct / text.length : 0, true);
    },
    onFinish,
  });
  const typingRef = useRef(typing);
  typingRef.current = typing;

  // ---------- Шинэ уралдаан эхлэхэд локал төлөвийг бэлтгэнэ ----------
  useEffect(() => {
    if (!room || room.status === 'lobby' || room.startAt == null) {
      raceKeyRef.current = '';
      setGoReached(false);
      setLocalFinishMs(null);
      return;
    }
    const key = `${room.code}:${room.startAt}`;
    if (raceKeyRef.current === key) return;
    raceKeyRef.current = key;

    const localStartEpoch = room.startAt - offsetRef.current;
    startPerfRef.current = performance.now() + (localStartEpoch - Date.now());
    targetsRef.current = new Map();
    displayRef.current = new Map();
    arrivedRef.current = new Set();
    botPuffRef.current = new Map();
    correctRef.current = 0;
    lastEmitRef.current = 0;
    setLocalFinishMs(null);
    setGoReached(false);
    setGoFlash(false);
    setLiveWpm(0);
    setCountdown(3);
    trackRef.current?.resetAll();
    typingRef.current.reset();
    if (timerRef.current) timerRef.current.textContent = '0.00';
    inputRef.current?.focus();
  }, [room]);

  // Countdown → GO (локал цагаар, серверийн startAt-д тааруулсан)
  useEffect(() => {
    if (!inRace || goReached) return;
    const id = window.setInterval(() => {
      const remaining = startPerfRef.current - performance.now();
      if (remaining <= 0) {
        window.clearInterval(id);
        typingRef.current.markStart();
        setGoReached(true);
        setGoFlash(true);
        window.setTimeout(() => setGoFlash(false), 450);
        inputRef.current?.focus();
      } else {
        setCountdown(Math.max(1, Math.ceil(remaining / 1000)));
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [inRace, goReached]);

  // ---------- rAF: цаг, ботууд, өрсөлдөгчид ----------
  useEffect(() => {
    if (!inRace) return;
    let active = true;
    let raf = 0;
    let lastWpmAt = 0;
    let lastTickAt = 0;

    const loop = (t: number) => {
      if (!active) return;
      const r = roomRef.current;
      const track = trackRef.current;
      const elapsed = t - startPerfRef.current;
      if (r && track && elapsed >= 0) {
        const total = Math.max(1, (r.text ?? '').length);

        if (localFinishRef.current == null && r.status !== 'finished' && timerRef.current) {
          timerRef.current.textContent = formatSeconds(elapsed);
        }
        if (localFinishRef.current == null && t - lastWpmAt > 250) {
          lastWpmAt = t;
          setLiveWpm(computeWpm(correctRef.current, elapsed));
        }
        if (t - lastTickAt > 200) {
          lastTickAt = t;
          setTick((v) => v + 1);
        }

        for (const bot of r.bots) {
          const key = `bot:${bot.lane}`;
          if (arrivedRef.current.has(key)) continue;
          if (elapsed >= bot.finishMs) {
            track.setProgress(bot.lane, 1);
            arrivedRef.current.add(key);
            track.emitPuffs(bot.lane, 2, 14);
            continue;
          }
          track.setProgress(bot.lane, Math.min(1, botCharsAt(bot, elapsed) / total));
          const nextPuff = botPuffRef.current.get(bot.lane) ?? 0;
          if (elapsed > bot.delay && t > nextPuff) {
            botPuffRef.current.set(bot.lane, t + 900 + Math.random() * 900);
            track.emitPuffs(bot.lane, 1, 10);
          }
        }

        for (const p of r.players) {
          if (p.userId === userId || p.lane == null) continue;
          const target = Math.max(targetsRef.current.get(p.userId) ?? 0, p.progress, p.finishMs != null ? 1 : 0);
          let disp = displayRef.current.get(p.userId) ?? 0;
          disp += (target - disp) * 0.18;
          if (Math.abs(target - disp) < 0.002) disp = target;
          displayRef.current.set(p.userId, disp);
          track.setProgress(p.lane, disp);
          if (disp >= 1 && !arrivedRef.current.has(p.userId)) {
            arrivedRef.current.add(p.userId);
            track.emitPuffs(p.lane, 3, 14);
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      active = false;
      cancelAnimationFrame(raf);
    };
  }, [inRace, userId]);

  // ---------- Үйлдлүүд ----------
  const createRoom = () => void call<RoomState>('room:create', { level: createLevel }).then((r) => r && setRoom(r));
  const joinRoom = (code: string) => {
    const c = code.trim().toUpperCase();
    if (c.length < 4) return toast.error('Өрөөний кодоо оруулна уу');
    void call<RoomState>('room:join', { code: c }).then((r) => r && setRoom(r));
  };
  const leaveRoom = () => void call<null>('room:leave').then(() => setRoom(null));
  const pickLane = (lane: number) => void call<RoomState>('room:pickLane', { lane });
  const setLevel = (level: RaceLevel) => void call<RoomState>('room:setLevel', { level });
  const startRace = () => {
    if (!room) return;
    void call<RoomState>('room:start', { text: buildRaceText(room.level) });
  };
  const again = () => void call<RoomState>('room:again');
  const copyCode = () => {
    if (!room) return;
    navigator.clipboard?.writeText(room.code).then(
      () => toast.success('Код хуулагдлаа'),
      () => toast.error('Хуулж чадсангүй'),
    );
  };

  // ---------- Тооцоолол ----------
  const elapsedNow = inRace ? performance.now() - startPerfRef.current : 0;

  const trackLanes: TrackLane[] = useMemo(() => {
    return Array.from({ length: LANES }, (_, lane) => {
      const human = room?.players.find((p) => p.lane === lane);
      if (human) {
        const mine = human.userId === userId;
        return {
          name: human.name,
          tag: mine ? 'ТА' : 'ТОГЛОГЧ',
          isPlayer: mine,
          sub: !human.connected ? 'салсан' : human.isHost ? 'эзэн' : undefined,
        };
      }
      const bot = room?.bots.find((b) => b.lane === lane);
      if (bot) return { name: bot.name, tag: 'БОТ', isPlayer: false, sub: `${bot.wpm} wpm` };
      return { name: room?.status === 'lobby' ? 'хоосон' : '', tag: '', isPlayer: false, dim: true };
    });
  }, [room, userId]);

  const standings: StandingRow[] = room
    ? [
        ...room.players
          .filter((p) => p.lane != null)
          .map((p) => {
            const mine = p.userId === userId;
            const time = mine ? myFinishMs : p.finishMs;
            return {
              lane: p.lane as number,
              name: p.name,
              isPlayer: mine,
              time,
              wpm: time != null ? computeWpm(text.length, time) : null,
              tag: 'ТОГЛОГЧ',
              note: !p.connected ? 'салсан' : undefined,
            };
          }),
        ...room.bots.map((b) => ({
          lane: b.lane,
          name: b.name,
          isPlayer: false,
          time: elapsedNow >= b.finishMs ? b.finishMs : null,
          wpm: b.wpm,
          tag: 'БОТ',
        })),
      ]
    : [];

  const myRank =
    myFinishMs == null ? 1 : 1 + standings.filter((s) => !s.isPlayer && s.time != null && s.time < myFinishMs).length;

  const levelLabel = (code: RaceLevel) => RACE_LEVELS.find((l) => l.code === code)?.label ?? code;

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
          <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-5 shadow-card">
            <h3 className="font-display text-base font-semibold text-mist-50">Шинэ өрөө үүсгэх</h3>
            <p className="mt-1 text-xs text-mist-400">Код гарч ирнэ, найзууддаа илгээгээд 5 хүртэл хүн уралдана. Хоосон замд бот орно.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {RACE_LEVELS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setCreateLevel(l.code)}
                  className={`rounded-lg border px-3 py-1.5 text-xs ${
                    createLevel === l.code ? 'border-brand bg-brand/15 text-mist-50' : 'border-ink-600/80 text-mist-300 hover:border-ink-500'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={busy || conn !== 'online'}
              onClick={createRoom}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Өрөө үүсгэх
            </button>
          </div>

          <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-5 shadow-card">
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

        <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold text-mist-50">
              <Users className="h-4 w-4 text-brand" /> Нээлттэй өрөөнүүд
            </h3>
            <button
              type="button"
              onClick={() => socketRef.current?.emit('rooms:list', {}, (ack: { ok: boolean; data?: OpenRoomSummary[] }) => ack?.ok && ack.data && setOpenRooms(ack.data))}
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
                <li key={r.code} className="flex items-center gap-3 py-2.5">
                  <span className="font-mono text-base tracking-widest text-mist-50">{r.code}</span>
                  <span className="text-xs text-mist-400">{r.hostName}</span>
                  <span className="rounded bg-ink-800 px-2 py-0.5 text-[11px] text-mist-300">{levelLabel(r.level)}</span>
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
      </div>
    );
  }

  // ----- Өрөөний lobby -----
  if (room.status === 'lobby') {
    const takenBy = (lane: number) => room.players.find((p) => p.lane === lane);
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
          <span className="rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 text-xs text-mist-300">{levelLabel(room.level)}</span>
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

        <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-5 shadow-card sm:p-6">
          <h2 className="font-display text-lg font-semibold text-mist-50">Машинаа сонго</h2>
          <p className="mt-1 text-sm text-mist-400">Тоглогч бүр өөр машинтай. Сонгогдоогүй замд бот уралдана.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {RACE_CARS.map((car, lane) => {
              const owner = takenBy(lane);
              const mine = owner?.userId === userId;
              const disabled = !!owner && !mine;
              return (
                <button
                  key={car.id}
                  type="button"
                  disabled={disabled || busy}
                  onClick={() => !mine && pickLane(lane)}
                  className={`flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all ${
                    mine
                      ? 'border-brand bg-brand/10 shadow-glow'
                      : disabled
                        ? 'cursor-not-allowed border-ink-600/60 bg-ink-800/40 opacity-70'
                        : 'border-ink-600/80 bg-ink-800/60 hover:border-ink-500 hover:bg-ink-800'
                  }`}
                >
                  <CarSprite color={car.color} dark={car.dark} width={72} />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-mist-50">{car.name}</p>
                    <p className="text-[11px] uppercase tracking-wider text-mist-500">{car.nick}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[11px] ${owner ? 'text-mist-200' : 'text-mist-500'}`}>
                    {owner?.isHost && <Crown className="h-3 w-3 text-modifier" />}
                    {owner ? (mine ? 'Та' : owner.name) : 'бот'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-mist-500">Тоглогчид</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {room.players.map((p) => (
                  <li
                    key={p.userId}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-600/80 bg-ink-800/60 px-3 py-1 text-xs text-mist-200"
                  >
                    {p.lane != null && <span className="h-2 w-2 rounded-full" style={{ background: RACE_CARS[p.lane].color }} />}
                    {p.isHost && <Crown className="h-3 w-3 text-modifier" />}
                    {p.name}
                    {p.userId === userId && <span className="text-mist-500">(та)</span>}
                  </li>
                ))}
              </ul>
            </div>

            {isHost ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-1.5">
                  {RACE_LEVELS.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      disabled={busy}
                      onClick={() => setLevel(l.code)}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs ${
                        room.level === l.code ? 'border-brand bg-brand/15 text-mist-50' : 'border-ink-600/80 text-mist-300 hover:border-ink-500'
                      }`}
                    >
                      {l.code}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={busy || conn !== 'online'}
                  onClick={startRace}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
                >
                  <Flag className="h-4 w-4" /> Уралдаан эхлэх
                </button>
              </div>
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

  // ----- Уралдаан (countdown / racing / finished) -----
  const showOverlay = !goReached || goFlash;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {connBadge}
        <span className="rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 font-mono tracking-[0.25em] text-mist-200">{room.code}</span>
        <span className="rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 text-mist-300">{levelLabel(room.level)}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 font-mono text-mist-100">
          <Timer className="h-3.5 w-3.5 text-brand" />
          <span ref={timerRef}>0.00</span> сек
        </span>
        <span className="rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 font-mono text-mist-100">{liveWpm} WPM</span>
        <span className="rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 font-mono text-mist-100">{typing.accuracy}%</span>
      </div>

      <RaceTrack
        ref={trackRef}
        lanes={trackLanes}
        running={goReached && room.status !== 'finished'}
        onClick={() => myFinishMs == null && inputRef.current?.focus()}
        overlay={
          showOverlay ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink-950/55 backdrop-blur-[1px]">
              <span
                key={goReached ? 'go' : countdown}
                className={`tr-count font-display text-6xl font-bold sm:text-7xl ${goReached ? 'text-success' : 'text-mist-50'}`}
                style={{ textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {goReached ? 'GO!' : countdown}
              </span>
            </div>
          ) : null
        }
      />

      {myLane == null && (
        <p className="rounded-xl border border-ink-600/80 bg-ink-900 px-4 py-3 text-sm text-mist-400">
          Та энэ уралдаанд оролцоогүй байна. Дараагийн уралдаанд машинаа сонгоорой.
        </p>
      )}

      {myLane != null && myFinishMs == null && room.status !== 'finished' && (
        <TypingPanel
          text={text}
          typed={typing.typed}
          correctLen={typing.correctLen}
          hasError={typing.hasError}
          active={goReached}
          inputRef={inputRef}
          onChange={typing.handleChange}
        />
      )}

      {(myFinishMs != null || room.status === 'finished') && (
        <ResultsPanel
          finishMs={myFinishMs ?? 0}
          rank={myRank}
          wpm={myFinishMs != null ? computeWpm(text.length, myFinishMs) : 0}
          accuracy={typing.accuracy}
          chars={text.length}
          standings={standings}
          footnote={
            room.status !== 'finished'
              ? 'Бусад тоглогч бариа хүрэхийг хүлээж байна…'
              : isHost
                ? 'Бүгд дууслаа. Дахин эхлүүлж болно.'
                : 'Өрөөний эзэн дахин эхлүүлэхийг хүлээж байна.'
          }
          actions={
            <>
              {isHost && (
                <button
                  type="button"
                  disabled={busy || room.status !== 'finished'}
                  onClick={again}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" /> Дахин уралдах (lobby)
                </button>
              )}
              <button
                type="button"
                onClick={leaveRoom}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-600 px-5 py-3 text-sm font-medium text-mist-200 hover:bg-ink-800"
              >
                <LogOut className="h-4 w-4" /> Өрөөнөөс гарах
              </button>
            </>
          }
        />
      )}
    </div>
  );
}
