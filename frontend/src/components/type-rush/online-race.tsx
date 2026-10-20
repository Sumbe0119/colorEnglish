// frontend/src/components/type-rush/online-race.tsx
// Онлайн горим: өрөө үүсгэх / код эсвэл жагсаалтаас нэгдэх, 5 хүртэл тоглогч, хоосон замд бот.
// Серверийн цагаар зэрэг эхэлж, бусдын явцыг socket-оор аваад гөлгөр (lerp) хөдөлгөнө.
// Бүтэн дэлгэцийн canvas уралдаан (RaceScene) дээр өрөө / lobby / үр дүнгийн давхарга, доор нь бичих консол.
// Socket протокол (үйл явдал, payload, хугацаа) backend/src/type-rush-тэй ижил — өөрчлөхгүй.
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { Copy, Crown, Flag, LogOut, Plus, RefreshCw, Trophy, Users, Wifi, WifiOff } from 'lucide-react';
import { botCharsAt, buildRaceText, computeWpm, LANES, RACE_CARS, RACE_LEVELS, RaceLevel } from '@/lib/type-rush';
import {
  createTypeRushSocket,
  emitAck,
  refreshAccessToken,
  type OpenRoomSummary,
  type RoomState,
  type RoomStatePayload,
} from '@/lib/type-rush-socket';
import { sfx, unlockAudio } from '@/lib/type-rush-sfx';
import { toast } from '@/store/toast-store';
import { Choice, GameButton, ModeSwitch, MuteButton, Overlay, SectionLabel, type Mode } from './game-ui';
import { CarIcon, RaceScene, type CountdownStep, type RaceSceneHandle, type SceneLane } from './race-scene';
import { ResultsPanel, formatSeconds, type StandingRow } from './results-panel';
import { LeaderboardPanel } from '@/components/games/leaderboard';
import { TypingPanel } from './typing-panel';
import { useTypingRace } from './use-typing-race';

type Conn = 'connecting' | 'online' | 'offline';

const PROGRESS_EMIT_MS = 80;
/** Бариа хүрсний дараа үр дүнгийн давхарга гарах хүртэлх хугацаа (баярын анимаци харагдана) */
const RESULTS_DELAY_MS = 1500;

export function OnlineRace({
  playerName,
  userId,
  mode,
  onMode,
  onFinale,
}: {
  playerName: string;
  userId: string;
  mode: Mode;
  onMode: (m: Mode) => void;
  /** 1-р байр — бүтэн дэлгэцийн салют */
  onFinale: () => void;
}) {
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
  const [localFinishMs, setLocalFinishMs] = useState<number | null>(null);
  const [liveWpm, setLiveWpm] = useState(0);
  const [resultsReady, setResultsReady] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [, setTick] = useState(0);

  const roomRef = useRef<RoomState | null>(null);
  const offsetRef = useRef(0);
  const startPerfRef = useRef(0);
  const raceKeyRef = useRef('');
  const sceneRef = useRef<RaceSceneHandle>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const targetsRef = useRef<Map<string, number>>(new Map());
  const displayRef = useRef<Map<string, number>>(new Map());
  const arrivedRef = useRef<Set<string>>(new Set());
  const botPuffRef = useRef<Map<number, number>>(new Map());
  const lastEmitRef = useRef(0);
  const correctRef = useRef(0);
  const myLaneRef = useRef<number | null>(null);
  const localFinishRef = useRef<number | null>(null);
  const countStepRef = useRef<CountdownStep>(null);

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

  /** Бариа хүрэх мөчид бусдаас хэдэн нь түрүүлснийг локал байдлаар тооцно (scene-ийн popup-д) */
  const localRank = useCallback((ms: number) => {
    const r = roomRef.current;
    if (!r) return 1;
    let ahead = 0;
    for (const p of r.players) if (p.userId !== userId && p.lane != null && p.finishMs != null && p.finishMs < ms) ahead++;
    for (const b of r.bots) if (b.finishMs < ms) ahead++;
    return 1 + ahead;
  }, [userId]);

  const onFinish = useCallback(() => {
    const ms = performance.now() - startPerfRef.current;
    setLocalFinishMs(ms);
    const lane = myLaneRef.current;
    const scene = sceneRef.current;
    scene?.setHud({ timerText: formatSeconds(ms), position: null });
    if (lane != null) {
      scene?.setProgress(lane, 1);
      scene?.emitPuffs(lane, 4, 16);
      const place = localRank(ms);
      scene?.celebrate(lane, place);
      if (place === 1) {
        sfx.win();
        onFinale();
      } else sfx.finish();
    }
    const socket = socketRef.current;
    if (socket?.connected) {
      void emitAck<RoomState>(socket, 'race:finish', { ms }).then((ack) => {
        if (!ack.ok) toast.error(ack.message);
      });
    }
  }, [localRank, onFinale]);

  const typing = useTypingRace({
    text,
    active: inRace && goReached && myLane != null && myFinishMs == null && room?.status !== 'finished',
    onProgress: (correct, total) => {
      correctRef.current = correct;
      const p = total ? correct / total : 0;
      const lane = myLaneRef.current;
      if (lane != null) sceneRef.current?.setProgress(lane, p);
      emitProgress(p);
    },
    onWord: (cps, correct) => {
      const lane = myLaneRef.current;
      if (lane != null) {
        const count = cps >= 6 ? 5 : cps >= 3.5 ? 3 : 2;
        const size = cps >= 6 ? 18 : cps >= 3.5 ? 14 : 11;
        sceneRef.current?.emitPuffs(lane, count, size);
        if (cps >= 3.5) sceneRef.current?.boost(lane);
        else sfx.tick();
      }
      emitProgress(text.length ? correct / text.length : 0, true);
    },
    onFinish,
  });
  const typingRef = useRef(typing);
  typingRef.current = typing;

  // Нарийвчлал React state → HUD
  useEffect(() => {
    sceneRef.current?.setHud({ accuracy: typing.accuracy });
  }, [typing.accuracy]);

  // ---------- Шинэ уралдаан эхлэхэд локал төлөвийг бэлтгэнэ ----------
  useEffect(() => {
    if (!room || room.status === 'lobby' || room.startAt == null) {
      raceKeyRef.current = '';
      setGoReached(false);
      setLocalFinishMs(null);
      setResultsReady(false);
      setShowResults(false);
      countStepRef.current = null;
      sceneRef.current?.resetAll();
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
    countStepRef.current = null;
    setLocalFinishMs(null);
    setGoReached(false);
    setLiveWpm(0);
    setResultsReady(false);
    setShowResults(false);
    const scene = sceneRef.current;
    scene?.resetAll();
    scene?.setHud({
      timerText: '0.00',
      timerLabel: 'СЕКУНД',
      fraction: null,
      wpm: 0,
      accuracy: 100,
      urgent: false,
      position: null,
      levelLabel: room.level,
    });
    typingRef.current.reset();
    unlockAudio();
    inputRef.current?.focus();
  }, [room]);

  // Countdown → GO (локал цагаар, серверийн startAt-д тааруулсан); canvas дээр 3-2-1-GO
  useEffect(() => {
    if (!inRace || goReached) return;
    const id = window.setInterval(() => {
      const remaining = startPerfRef.current - performance.now();
      if (remaining <= 0) {
        window.clearInterval(id);
        typingRef.current.markStart();
        setGoReached(true);
        countStepRef.current = 'GO';
        sceneRef.current?.countdown('GO');
        sfx.go();
        sfx.rev();
        inputRef.current?.focus();
      } else {
        const step = Math.min(3, Math.max(1, Math.ceil(remaining / 1000)));
        if (step !== countStepRef.current) {
          countStepRef.current = step;
          sceneRef.current?.countdown(step);
          sfx.count();
        }
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [inRace, goReached]);

  useEffect(() => {
    if (goReached) inputRef.current?.focus();
  }, [goReached]);

  // Үр дүн: өрөө дууссан бол (баярын анимацийн дараа) давхарга гарна
  useEffect(() => {
    if (localFinishMs == null) return;
    const id = window.setTimeout(() => setResultsReady(true), RESULTS_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [localFinishMs]);
  useEffect(() => {
    if (room?.status === 'finished' && (localFinishMs == null || resultsReady)) setShowResults(true);
  }, [room?.status, localFinishMs, resultsReady]);

  // ---------- rAF: цаг, ботууд, өрсөлдөгчид ----------
  useEffect(() => {
    if (!inRace) return;
    let active = true;
    let raf = 0;
    let lastWpmAt = 0;
    let lastTickAt = 0;

    const loop = () => {
      if (!active) return;
      // rAF-ийн timestamp performance.now()-оос зөрж болох тул startPerfRef-тэй ижил цагийн эх үүсвэр хэрэглэнэ
      const t = performance.now();
      const r = roomRef.current;
      const scene = sceneRef.current;
      const elapsed = t - startPerfRef.current;
      if (r && scene && elapsed >= 0) {
        const total = Math.max(1, (r.text ?? '').length);

        if (localFinishRef.current == null && r.status !== 'finished') {
          scene.setHud({ timerText: formatSeconds(elapsed) });
        }
        if (localFinishRef.current == null && t - lastWpmAt > 250) {
          lastWpmAt = t;
          const wpm = computeWpm(correctRef.current, elapsed);
          setLiveWpm(wpm);
          scene.setHud({ wpm });
        }
        if (t - lastTickAt > 200) {
          lastTickAt = t;
          setTick((v) => v + 1);
        }

        for (const bot of r.bots) {
          const key = `bot:${bot.lane}`;
          if (arrivedRef.current.has(key)) continue;
          if (elapsed >= bot.finishMs) {
            scene.setProgress(bot.lane, 1);
            arrivedRef.current.add(key);
            scene.emitPuffs(bot.lane, 2, 14);
            if (localFinishRef.current == null) sfx.rivalFinish();
            continue;
          }
          scene.setProgress(bot.lane, Math.min(1, botCharsAt(bot, elapsed) / total));
          const nextPuff = botPuffRef.current.get(bot.lane) ?? 0;
          if (elapsed > bot.delay && t > nextPuff) {
            botPuffRef.current.set(bot.lane, t + 900 + Math.random() * 900);
            scene.emitPuffs(bot.lane, 1, 10);
          }
        }

        for (const p of r.players) {
          if (p.userId === userId || p.lane == null) continue;
          const target = Math.max(targetsRef.current.get(p.userId) ?? 0, p.progress, p.finishMs != null ? 1 : 0);
          let disp = displayRef.current.get(p.userId) ?? 0;
          disp += (target - disp) * 0.18;
          if (Math.abs(target - disp) < 0.002) disp = target;
          displayRef.current.set(p.userId, disp);
          scene.setProgress(p.lane, disp);
          if (disp >= 1 && !arrivedRef.current.has(p.userId)) {
            arrivedRef.current.add(p.userId);
            scene.emitPuffs(p.lane, 3, 14);
            if (localFinishRef.current == null) sfx.rivalFinish();
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
  const createRoom = () => {
    unlockAudio();
    void call<RoomState>('room:create', { level: createLevel }).then((r) => r && setRoom(r));
  };
  const joinRoom = (code: string) => {
    unlockAudio();
    const c = code.trim().toUpperCase();
    if (c.length < 4) return toast.error('Өрөөний кодоо оруулна уу');
    void call<RoomState>('room:join', { code: c }).then((r) => r && setRoom(r));
  };
  const leaveRoom = () => void call<null>('room:leave').then(() => setRoom(null));
  const pickLane = (lane: number) => {
    sfx.ui();
    void call<RoomState>('room:pickLane', { lane });
  };
  const setLevel = (level: RaceLevel) => void call<RoomState>('room:setLevel', { level });
  const startRace = () => {
    if (!room) return;
    unlockAudio();
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

  const sceneLanes: SceneLane[] = useMemo(() => {
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
      if (!room) return { name: 'Бот', tag: 'БОТ', isPlayer: false };
      return { name: '', tag: '', isPlayer: false, dim: true };
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] ${
        conn === 'online' ? 'border-success/30 bg-success/10 text-success' : 'border-ink-600/80 bg-ink-900 text-mist-400'
      }`}
    >
      {conn === 'online' ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      {conn === 'online' ? 'Холбогдсон' : conn === 'connecting' ? 'Холбогдож байна…' : 'Холболтгүй'}
    </span>
  );

  const canType = inRace && myLane != null && myFinishMs == null && room?.status !== 'finished';
  const waitingOthers = inRace && myFinishMs != null && room?.status !== 'finished';
  const levelForScene: RaceLevel = room?.level ?? createLevel;

  return (
    <>
      {/* ── Тоглоомын дэлгэц ── */}
      <div className="relative min-h-0 flex-1">
        <RaceScene
          ref={sceneRef}
          lanes={sceneLanes}
          playerLane={myLane}
          running={!!room && room.status === 'racing' && goReached}
          level={levelForScene}
          showHud={inRace}
          preview={!inRace}
          onTap={() => canType && inputRef.current?.focus()}
        />

        {/* ── Өрөө сонгох ── */}
        {!room && (
          <Overlay size="lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ModeSwitch mode={mode} onMode={onMode} />
              <MuteButton />
            </div>
            <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Color English · Game</p>
            <h1 className="mt-1 text-center font-display text-2xl font-bold tracking-wide text-mist-50 sm:text-3xl">ОНЛАЙН УРАЛДААН</h1>
            <p className="mt-2 text-center text-sm text-mist-300">
              Найзуудтайгаа нэг өрөөнд орж 5 хүртэл хүн зэрэг уралдана. Хоосон замд бот орно.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {connBadge}
              {connError && <span className="text-xs text-danger">{connError}</span>}
              {conn === 'offline' && (
                <button
                  type="button"
                  onClick={() => socketRef.current?.connect()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 px-2.5 py-1 text-[11px] text-mist-200 hover:bg-ink-800"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Дахин холбогдох
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-ink-600/70 bg-ink-800/50 p-3">
                <SectionLabel>Шинэ өрөө үүсгэх</SectionLabel>
                <div className="mt-2 flex gap-1.5">
                  {RACE_LEVELS.map((l) => (
                    <Choice key={l.code} active={createLevel === l.code} onClick={() => setCreateLevel(l.code)} className="min-w-0 flex-1 px-2 py-1.5">
                      <span className="block truncate text-xs font-medium">{l.label}</span>
                    </Choice>
                  ))}
                </div>
                <GameButton onClick={createRoom} disabled={busy || conn !== 'online'} className="mt-3 w-full">
                  <Plus className="h-4 w-4" /> Өрөө үүсгэх
                </GameButton>
              </div>

              <div className="rounded-xl border border-ink-600/70 bg-ink-800/50 p-3">
                <SectionLabel>Кодоор нэгдэх</SectionLabel>
                <p className="mt-1 text-[11px] text-mist-500">Найзынхаа илгээсэн 5 оронтой код.</p>
                <form
                  className="mt-2 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    joinRoom(joinCode);
                  }}
                >
                  <input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5))}
                    placeholder="ABC12"
                    className="h-11 w-full min-w-0 rounded-xl border-2 border-ink-600 bg-ink-950 px-3 font-mono text-lg uppercase tracking-[0.3em] text-mist-50 outline-none focus:border-brand"
                  />
                  <GameButton type="submit" tone="ghost" disabled={busy || conn !== 'online'} className="shrink-0 px-4">
                    Нэгдэх
                  </GameButton>
                </form>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-ink-600/70 bg-ink-800/50 p-3">
              <div className="flex items-center justify-between">
                <SectionLabel>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-brand" /> Нээлттэй өрөөнүүд
                  </span>
                </SectionLabel>
                <button
                  type="button"
                  onClick={() =>
                    socketRef.current?.emit('rooms:list', {}, (ack: { ok: boolean; data?: OpenRoomSummary[] }) => ack?.ok && ack.data && setOpenRooms(ack.data))
                  }
                  className="inline-flex items-center gap-1.5 text-[11px] text-mist-400 hover:text-mist-100"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Шинэчлэх
                </button>
              </div>
              {openRooms.length === 0 ? (
                <p className="mt-2 text-xs text-mist-500">Одоогоор хүлээж буй өрөө алга. Шинээр үүсгээд найзаа урь.</p>
              ) : (
                <ul className="ce-scroll mt-2 max-h-36 divide-y divide-ink-600/60 overflow-y-auto">
                  {openRooms.map((r) => (
                    <li key={r.code} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2">
                      <span className="font-mono text-sm tracking-widest text-mist-50">{r.code}</span>
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
          </Overlay>
        )}

        {/* ── Lobby: машин сонгох, тоглогчид, эхлүүлэх ── */}
        {room && room.status === 'lobby' && (
          <Overlay size="xl" align="top">
            <div className="flex flex-wrap items-center gap-2">
              {connBadge}
              <span className="inline-flex items-center gap-2 rounded-full border border-ink-600/80 bg-ink-950/70 px-2.5 py-1 text-[11px] text-mist-300">
                Код
                <span className="font-mono text-sm tracking-[0.3em] text-mist-50">{room.code}</span>
                <button type="button" onClick={copyCode} className="text-mist-400 hover:text-mist-50" aria-label="Код хуулах">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </span>
              <span className="rounded-full border border-ink-600/80 bg-ink-950/70 px-2.5 py-1 text-[11px] text-mist-300">{levelLabel(room.level)}</span>
              <span className="rounded-full border border-ink-600/80 bg-ink-950/70 px-2.5 py-1 text-[11px] text-mist-300">
                {room.players.length}/{room.maxPlayers} тоглогч
              </span>
              <div className="ml-auto flex items-center gap-2">
                <MuteButton compact />
                <button
                  type="button"
                  onClick={leaveRoom}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-ink-600/80 bg-ink-900/80 px-3 text-xs text-mist-300 transition-colors hover:border-danger/60 hover:text-danger"
                >
                  <LogOut className="h-3.5 w-3.5" /> Гарах
                </button>
              </div>
            </div>

            <h2 className="mt-4 font-display text-lg font-semibold text-mist-50">Машинаа сонго</h2>
            <p className="mt-0.5 text-xs text-mist-400">Тоглогч бүр өөр машинтай. Сонгогдоогүй замд бот уралдана.</p>
            <div className="mt-3 grid grid-cols-5 gap-1.5 sm:gap-2">
              {RACE_CARS.map((car, lane) => {
                const owner = room.players.find((p) => p.lane === lane);
                const mine = owner?.userId === userId;
                const disabled = !!owner && !mine;
                return (
                  <button
                    key={car.id}
                    type="button"
                    disabled={disabled || busy}
                    onClick={() => !mine && pickLane(lane)}
                    className={`flex min-w-0 flex-col items-center gap-1 rounded-xl border px-1 py-2 transition-all sm:gap-2 sm:p-3 ${
                      mine
                        ? 'border-brand bg-brand/10 shadow-glow'
                        : disabled
                          ? 'cursor-not-allowed border-ink-600/60 bg-ink-800/40 opacity-70'
                          : 'border-ink-600/80 bg-ink-800/60 hover:border-ink-500 hover:bg-ink-800'
                    }`}
                  >
                    <CarIcon color={car.color} dark={car.dark} width={56} className="max-w-full" />
                    <span className="w-full truncate text-center text-[11px] font-semibold text-mist-50 sm:text-sm">{car.name}</span>
                    <span className={`inline-flex max-w-full items-center gap-1 text-[10px] ${owner ? 'text-mist-200' : 'text-mist-500'}`}>
                      {owner?.isHost && <Crown className="h-3 w-3 shrink-0 text-modifier" />}
                      <span className="truncate">{owner ? (mine ? 'Та' : owner.name) : 'бот'}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="min-w-0">
                <SectionLabel>Тоглогчид</SectionLabel>
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
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex gap-1.5">
                    {RACE_LEVELS.map((l) => (
                      <Choice key={l.code} active={room.level === l.code} onClick={() => setLevel(l.code)} disabled={busy} className="px-2.5 py-1.5">
                        <span className="text-xs">{l.code}</span>
                      </Choice>
                    ))}
                  </div>
                  <GameButton onClick={startRace} disabled={busy || conn !== 'online'} className="px-6 py-3">
                    <Flag className="h-4 w-4" /> Уралдаан эхлэх
                  </GameButton>
                </div>
              ) : (
                <p className="tr-blink text-sm text-mist-400">
                  Өрөөний эзэн <span className="text-mist-100">{room.players.find((p) => p.isHost)?.name}</span> эхлүүлэхийг хүлээж байна…
                </p>
              )}
            </div>
          </Overlay>
        )}

        {/* ── Үр дүн ── */}
        {room && inRace && showResults && (
          <Overlay size="lg" tone={myFinishMs != null && myRank === 1 ? 'success' : 'brand'}>
            {myLane == null || myFinishMs == null ? (
              <div>
                <div className="flex items-center justify-center gap-3">
                  <Trophy className="h-7 w-7 text-modifier" />
                  <h2 className="font-display text-2xl font-bold tracking-[0.12em] text-mist-50 sm:text-3xl">УРАЛДААН ДУУСЛАА</h2>
                </div>
                <p className="mt-2 text-center text-sm text-mist-300">
                  {myLane == null ? 'Та энэ уралдаанд оролцоогүй. Дараагийнхад машинаа сонгоорой.' : 'Та бариа хүрч амжсангүй.'}
                </p>
                <ResultsPanel
                  finishMs={0}
                  rank={myRank}
                  wpm={0}
                  accuracy={typing.accuracy}
                  chars={typing.correctLen}
                  totalChars={text.length}
                  timedOut={myLane != null}
                  standings={standings}
                  footnote={isHost ? 'Бүгд дууслаа. Дахин эхлүүлж болно.' : 'Өрөөний эзэн дахин эхлүүлэхийг хүлээж байна.'}
                  actions={
                    <>
                      {isHost && (
                        <GameButton onClick={again} disabled={busy || room.status !== 'finished'} autoFocus>
                          <RefreshCw className="h-4 w-4" /> Дахин уралдах
                        </GameButton>
                      )}
                      <GameButton onClick={leaveRoom} tone="ghost">
                        <LogOut className="h-4 w-4" /> Өрөөнөөс гарах
                      </GameButton>
                    </>
                  }
                />
              </div>
            ) : (
              <ResultsPanel
                finishMs={myFinishMs}
                rank={myRank}
                wpm={computeWpm(text.length, myFinishMs)}
                accuracy={typing.accuracy}
                chars={text.length}
                standings={standings}
                playerName={playerName}
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
                      <GameButton onClick={again} disabled={busy || room.status !== 'finished'} autoFocus>
                        <RefreshCw className="h-4 w-4" /> Дахин уралдах
                      </GameButton>
                    )}
                    {room.status !== 'finished' && (
                      <GameButton onClick={() => setShowResults(false)} tone="ghost">
                        Уралдааныг үзэх
                      </GameButton>
                    )}
                    <GameButton onClick={leaveRoom} tone="ghost">
                      <LogOut className="h-4 w-4" /> Өрөөнөөс гарах
                    </GameButton>
                  </>
                }
              />
            )}
            {/* Онлайн уралдааны WPM-ийг сервер өөрөө leaderboard-д бүртгэнэ; дууссан үед шинэчилж харуулна */}
            {room.status === 'finished' && <LeaderboardPanel scope="TYPE_RUSH" limit={5} compact refreshKey={1} className="mt-4" />}
          </Overlay>
        )}
      </div>

      {/* ── Консол (доод самбар) ── */}
      {inRace && (
        <div
          className="shrink-0 border-t-2 bg-ink-900/95 px-3 py-2.5 backdrop-blur sm:px-5 sm:py-3"
          style={{ borderTopColor: myFinishMs != null ? 'rgba(61,220,151,0.7)' : goReached ? 'rgba(61,220,151,0.7)' : 'rgba(79,140,255,0.6)' }}
        >
          <div className="flex items-center gap-2">
            <span className="shrink-0 rounded-md bg-brand/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
              {myFinishMs != null ? 'Бариа' : goReached ? 'Бич!' : 'Бэлэн үү'}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] text-mist-500">
              <span className="font-mono tracking-[0.2em] text-mist-300">{room.code}</span>
              <span className="truncate">· {levelLabel(room.level)}</span>
            </span>
            {connBadge}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <MuteButton compact />
              <button
                type="button"
                onClick={leaveRoom}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-600/80 bg-ink-900/80 text-mist-400 transition-colors hover:border-danger/60 hover:text-danger"
                aria-label="Өрөөнөөс гарах"
                title="Өрөөнөөс гарах"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {myLane == null && (
            <p className="mt-2 rounded-xl border border-ink-600/70 bg-ink-950/70 px-3 py-2.5 text-sm text-mist-400">
              Та энэ уралдаанд оролцоогүй байна. Дараагийн уралдаанд машинаа сонгоорой.
            </p>
          )}

          {canType && (
            <div className="mt-2">
              <TypingPanel
                text={text}
                typed={typing.typed}
                correctLen={typing.correctLen}
                hasError={typing.hasError}
                active={goReached}
                inputRef={inputRef}
                onChange={typing.handleChange}
              />
            </div>
          )}

          {waitingOthers && myFinishMs != null && (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-success/40 bg-success/10 px-3 py-2.5 text-sm">
              <span className="inline-flex items-center gap-1.5 font-semibold text-success">
                <Trophy className="h-4 w-4" /> {myRank}-р байр
              </span>
              <span className="font-mono text-mist-100">{formatSeconds(myFinishMs)} сек</span>
              <span className="font-mono text-mist-300">{computeWpm(text.length, myFinishMs)} WPM</span>
              <span className="tr-blink text-xs text-mist-400">Бусад тоглогч бариа хүрэхийг хүлээж байна…</span>
              {!showResults && (
                <button type="button" onClick={() => setShowResults(true)} className="ml-auto text-xs text-brand hover:underline">
                  Үр дүн харах
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
