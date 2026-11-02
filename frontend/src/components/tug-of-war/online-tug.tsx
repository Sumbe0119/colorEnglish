// frontend/src/components/tug-of-war/online-tug.tsx
// Онлайн горим: өрөө үүсгэх / код эсвэл жагсаалтаас нэгдэх, яг 2 тоглогч (улаан vs цэнхэр).
// Сервер эрх мэдэлтэй: хариултыг шалгаж олсны байрлалыг (pos) хөдөлгөнө; client нь room:state-ээр
// байрлал, оноо, өрсөлдөгчийн асуулт / сонголтыг авч харуулна. Асуултын санг хост client илгээнэ.
// Socket протокол backend/src/tug-of-war-тэй ижил — өөрчлөхгүй.
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { Copy, Crown, Flag, LogOut, Plus, RefreshCw, Trophy, Users, Wifi, WifiOff, X } from 'lucide-react';
import {
  BOT_LEVELS,
  DIFFICULTY_LABELS,
  DURATIONS,
  formatClock,
  loadPrefs,
  pickQuestions,
  savePrefs,
  TEAM_INFO,
  tugScore,
  type Difficulty,
  type Duration,
  type Team,
  type TugQuestion,
} from '@/lib/tug-of-war';
import {
  createTugOfWarSocket,
  emitAck,
  refreshAccessToken,
  type AnswerResult,
  type OpenRoomSummary,
  type RoomState,
  type RoomStatePayload,
} from '@/lib/tug-of-war-socket';
import { sfx, unlockAudio } from '@/lib/type-rush-sfx';
import { toast } from '@/store/toast-store';
import { LeaderboardPanel } from '@/components/games/leaderboard';
import { Choice, GameButton, ModeSwitch, MuteButton, Overlay, SectionLabel, Stat, type Mode } from '@/components/type-rush/game-ui';
import { QuestionCard, type CardFeedback } from './question-card';
import { TugScene, type TugSceneHandle } from './tug-scene';

type Conn = 'connecting' | 'online' | 'offline';
const RESULTS_DELAY_MS = 1600;
const OPP_FEEDBACK_MS = 900;

export function OnlineTug({
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
  onFinale: () => void;
}) {
  const socketRef = useRef<Socket | null>(null);
  const [conn, setConn] = useState<Conn>('connecting');
  const [connError, setConnError] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [openRooms, setOpenRooms] = useState<OpenRoomSummary[]>([]);
  const [joinCode, setJoinCode] = useState('');
  const [createTeam, setCreateTeam] = useState<Team>('red');
  const [createDifficulty, setCreateDifficulty] = useState<Difficulty>('easy');
  const [createDuration, setCreateDuration] = useState<Duration>(180);
  const [busy, setBusy] = useState(false);

  // Тоглолтын локал төлөв
  const [myQIndex, setMyQIndex] = useState<number | null>(null);
  const [myFb, setMyFb] = useState<CardFeedback>(null);
  const [locked, setLocked] = useState(false);
  const [oppView, setOppView] = useState<{ q: TugQuestion | null; fb: CardFeedback }>({ q: null, fb: null });
  const [showResults, setShowResults] = useState(false);
  const [lbRefresh, setLbRefresh] = useState(0);

  const sceneRef = useRef<TugSceneHandle>(null);
  const offsetRef = useRef(0);
  const roomRef = useRef<RoomState | null>(null);
  const gameKeyRef = useRef('');
  const prevPosRef = useRef(0);
  const prevOppIdxRef = useRef<number | null>(null);
  const oppTimerRef = useRef<number | null>(null);
  const myTimerRef = useRef<number | null>(null);
  const countStepRef = useRef<number | 'GO' | null>(null);
  const lastUrgentSecRef = useRef(-1);
  const finishedKeyRef = useRef('');
  roomRef.current = room;

  const me = room?.players.find((p) => p.userId === userId) ?? null;
  const opp = room?.players.find((p) => p.userId !== userId) ?? null;
  const isHost = room?.hostUserId === userId;
  const inGame = !!room && room.status !== 'lobby';
  const playing = room?.status === 'playing';
  const questions = room?.questions ?? null;
  const myTeam: Team = me?.team ?? 'red';
  const oppTeam: Team = myTeam === 'red' ? 'blue' : 'red';
  const myQ = questions && myQIndex != null ? questions[myQIndex % questions.length] : null;

  useEffect(() => {
    const p = loadPrefs();
    setCreateTeam(p.team);
    setCreateDifficulty(p.difficulty);
    setCreateDuration(p.duration);
  }, []);

  // ---------- Socket ----------
  useEffect(() => {
    const socket = createTugOfWarSocket();
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
    socket.connect();

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      if (oppTimerRef.current) window.clearTimeout(oppTimerRef.current);
      if (myTimerRef.current) window.clearTimeout(myTimerRef.current);
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

  // ---------- Шинэ тоглолт эхлэхэд локал төлөвийг бэлтгэнэ ----------
  useEffect(() => {
    if (!room || room.status === 'lobby' || room.startAt == null) {
      gameKeyRef.current = '';
      setMyQIndex(null);
      setMyFb(null);
      setLocked(false);
      setOppView({ q: null, fb: null });
      setShowResults(false);
      prevOppIdxRef.current = null;
      countStepRef.current = null;
      sceneRef.current?.resetPos(0);
      sceneRef.current?.clearFinish();
      sceneRef.current?.countdown(null);
      return;
    }
    const key = `${room.code}:${room.startAt}`;
    if (gameKeyRef.current === key) return;
    gameKeyRef.current = key;
    finishedKeyRef.current = '';
    prevPosRef.current = room.pos;
    lastUrgentSecRef.current = -1;
    const mine = room.players.find((p) => p.userId === userId);
    const other = room.players.find((p) => p.userId !== userId);
    setMyQIndex(mine?.qIndex ?? 0);
    setMyFb(null);
    setLocked(false);
    prevOppIdxRef.current = other?.qIndex ?? null;
    setOppView({ q: room.questions && other ? room.questions[other.qIndex % room.questions.length] : null, fb: null });
    setShowResults(false);
    sceneRef.current?.resetPos(room.pos);
    sceneRef.current?.clearFinish();
    sceneRef.current?.setHud({ timerText: formatClock(room.durationSec * 1000), fraction: 1, urgent: false });
  }, [room, userId]);

  // ---------- Олсны байрлал (сервер → scene), татах анимаци ----------
  useEffect(() => {
    if (!room || room.status === 'lobby') return;
    const prev = prevPosRef.current;
    if (room.pos !== prev) {
      sceneRef.current?.setPos(room.pos);
      sceneRef.current?.pull(room.pos < prev ? 'red' : 'blue');
      prevPosRef.current = room.pos;
    }
  }, [room]);

  // ---------- HUD нэр / оноо ----------
  useEffect(() => {
    if (!room) return;
    const red = room.players.find((p) => p.team === 'red');
    const blue = room.players.find((p) => p.team === 'blue');
    sceneRef.current?.setHud({
      redName: red?.name ?? '—',
      blueName: blue?.name ?? '—',
      redScore: red?.correct ?? 0,
      blueScore: blue?.correct ?? 0,
      myTeam: me?.team ?? null,
    });
  }, [room, me?.team]);

  // ---------- Өрсөлдөгчийн карт: хариултын дараа түр feedback харуулаад шинэ асуулт ----------
  useEffect(() => {
    if (!room || !room.questions || !opp || room.status === 'lobby') return;
    const qs = room.questions;
    const prevIdx = prevOppIdxRef.current;
    if (prevIdx == null) {
      prevOppIdxRef.current = opp.qIndex;
      setOppView({ q: qs[opp.qIndex % qs.length], fb: null });
      return;
    }
    if (opp.qIndex === prevIdx) return;
    prevOppIdxRef.current = opp.qIndex;
    const prevQ = qs[prevIdx % qs.length];
    const fb: CardFeedback = opp.lastOption != null && opp.lastResult ? { option: opp.lastOption, correct: opp.lastResult === 'correct', answer: prevQ.answer } : null;
    setOppView({ q: prevQ, fb });
    if (opp.lastResult === 'wrong') sceneRef.current?.stumble(opp.team);
    if (oppTimerRef.current) window.clearTimeout(oppTimerRef.current);
    const nextIdx = opp.qIndex;
    oppTimerRef.current = window.setTimeout(() => {
      const r = roomRef.current;
      if (!r?.questions) return;
      setOppView({ q: r.questions[nextIdx % r.questions.length], fb: null });
    }, OPP_FEEDBACK_MS);
  }, [room, opp]);

  // ---------- Countdown + цаг ----------
  useEffect(() => {
    if (!room || room.status === 'lobby' || room.startAt == null || room.endAt == null) return;
    if (room.status === 'finished') return;
    const total = room.durationSec * 1000;
    const id = window.setInterval(() => {
      const now = Date.now() + offsetRef.current;
      const toStart = room.startAt! - now;
      if (toStart > 0) {
        const step = Math.min(3, Math.ceil(toStart / 1000));
        if (countStepRef.current !== step) {
          countStepRef.current = step;
          sceneRef.current?.countdown(step);
          sfx.count();
        }
        return;
      }
      if (countStepRef.current !== 'GO') {
        countStepRef.current = 'GO';
        sceneRef.current?.countdown('GO');
        sfx.go();
      }
      const remain = room.endAt! - now;
      const sec = Math.ceil(remain / 1000);
      const urgent = remain <= 10_000;
      sceneRef.current?.setHud({ timerText: formatClock(remain), fraction: remain / total, urgent });
      if (urgent && sec > 0 && sec !== lastUrgentSecRef.current) {
        lastUrgentSecRef.current = sec;
        sfx.urgent();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [room]);

  // ---------- Дуусах ----------
  useEffect(() => {
    if (!room || room.status !== 'finished' || !room.winner) return;
    const key = `${room.code}:${room.startAt}`;
    if (finishedKeyRef.current === key) return;
    finishedKeyRef.current = key;
    sceneRef.current?.countdown(null);
    sceneRef.current?.setHud({ urgent: false });
    sceneRef.current?.finish(room.winner);
    const mine = room.players.find((p) => p.userId === userId);
    if (mine && room.winner === mine.team) {
      sfx.win();
      onFinale();
    } else if (room.winner === 'draw') sfx.finish();
    else sfx.timeout();
    const t = window.setTimeout(() => {
      setShowResults(true);
      setLbRefresh((k) => k + 1);
    }, RESULTS_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [room, userId, onFinale]);

  // ---------- Үйлдлүүд ----------
  const onPick = useCallback(
    async (option: number) => {
      const r = roomRef.current;
      if (!r || r.status !== 'playing' || locked || myQIndex == null || !r.questions) return;
      unlockAudio();
      setLocked(true);
      const res = await call<AnswerResult>('game:answer', { qIndex: myQIndex, option });
      if (!res) {
        setLocked(false);
        return;
      }
      setMyFb({ option, correct: res.correct, answer: res.answer });
      if (res.correct) sfx.boost();
      else {
        sfx.boom();
        sceneRef.current?.stumble(myTeam);
      }
      if (myTimerRef.current) window.clearTimeout(myTimerRef.current);
      myTimerRef.current = window.setTimeout(() => {
        setMyQIndex(res.nextIndex);
        setMyFb(null);
        setLocked(false);
      }, res.lockedMs);
    },
    [call, locked, myQIndex, myTeam],
  );

  const createRoom = useCallback(async () => {
    unlockAudio();
    savePrefs({ team: createTeam, difficulty: createDifficulty, duration: createDuration });
    await call<RoomState>('room:create', { team: createTeam, difficulty: createDifficulty, durationSec: createDuration });
  }, [call, createDifficulty, createDuration, createTeam]);

  const joinRoom = useCallback(
    async (code: string) => {
      unlockAudio();
      const c = code.trim().toUpperCase();
      if (!c) return;
      const r = await call<RoomState>('room:join', { code: c });
      if (r) setJoinCode('');
    },
    [call],
  );

  const leaveRoom = useCallback(async () => {
    await call<null>('room:leave');
    setRoom(null);
  }, [call]);

  const startGame = useCallback(async () => {
    const r = roomRef.current;
    if (!r) return;
    unlockAudio();
    await call<RoomState>('room:start', { questions: pickQuestions(r.difficulty) });
  }, [call]);

  const copyCode = useCallback(async () => {
    if (!room) return;
    try {
      await navigator.clipboard.writeText(room.code);
      toast.success('Код хуулагдлаа');
    } catch {
      toast.info(`Код: ${room.code}`);
    }
  }, [room]);

  // ---------- Үр дүн ----------
  const result = useMemo(() => {
    if (!room || room.status !== 'finished' || !room.winner || !me) return null;
    const won = room.winner === me.team;
    return { won, draw: room.winner === 'draw', score: tugScore(me.correct, won, room.difficulty) };
  }, [room, me]);

  const connBadge = (
    <span className={`inline-flex items-center gap-1 text-[11px] ${conn === 'online' ? 'text-success' : conn === 'offline' ? 'text-danger' : 'text-mist-400'}`}>
      {conn === 'online' ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      {conn === 'online' ? 'Онлайн' : conn === 'offline' ? 'Холболтгүй' : 'Холбогдож байна…'}
    </span>
  );

  const myCard = (
    <QuestionCard
      team={myTeam}
      name={me?.name ?? playerName}
      tag="ТА"
      question={myQ}
      interactive
      disabled={!playing || locked}
      feedback={myFb}
      correctCount={me?.correct ?? 0}
      onPick={(o) => void onPick(o)}
      className={myTeam === 'red' ? 'sm:order-1' : 'sm:order-2'}
    />
  );
  const oppCard = (
    <QuestionCard
      team={oppTeam}
      name={opp?.name ?? '—'}
      tag="ӨРСӨЛДӨГЧ"
      question={oppView.q}
      interactive={false}
      feedback={oppView.fb}
      thinking={playing && !oppView.fb}
      correctCount={opp?.correct ?? 0}
      className={myTeam === 'red' ? 'sm:order-2' : 'sm:order-1'}
    />
  );

  return (
    <>
      <div className="relative min-h-[150px] flex-1">
        <TugScene ref={sceneRef} running={!!playing} showHud={inGame} />

        {/* ── Өрөө олох / үүсгэх ── */}
        {!room && (
          <Overlay size="lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Color English · Game</p>
              <ModeSwitch mode={mode} onMode={onMode} />
            </div>
            <h1 className="mt-2 text-center font-display text-3xl font-bold tracking-wide text-mist-50 sm:text-4xl">ОЛС ТАТАХ · ОНЛАЙН</h1>
            <p className="mt-2 flex items-center justify-center gap-2 text-center text-sm text-mist-300">Найзтайгаа 1 vs 1 олс тат. {connBadge}</p>
            {connError && <p className="mt-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-center text-xs text-danger">{connError}</p>}

            <div className="mt-4 rounded-xl border border-ink-600/70 bg-ink-800/50 p-3">
              <SectionLabel>Өрөө үүсгэх</SectionLabel>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(['red', 'blue'] as Team[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCreateTeam(t)}
                    aria-pressed={createTeam === t}
                    className={`rounded-xl border-2 px-3 py-2 text-left text-sm font-semibold text-mist-50 transition-colors ${createTeam === t ? 'bg-ink-800' : 'border-ink-600/80 bg-ink-800/50 hover:border-ink-500'}`}
                    style={createTeam === t ? { borderColor: TEAM_INFO[t].color } : undefined}
                  >
                    <span className="mr-2 inline-block h-3 w-3 rounded-full align-middle" style={{ background: TEAM_INFO[t].color }} />
                    {TEAM_INFO[t].label}
                  </button>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {BOT_LEVELS.map((b) => (
                  <Choice key={b.level} active={createDifficulty === b.level} onClick={() => setCreateDifficulty(b.level)} className="text-center">
                    <span className="text-xs font-semibold">{b.label}</span>
                  </Choice>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {DURATIONS.map((d) => (
                  <Choice key={d.value} active={createDuration === d.value} onClick={() => setCreateDuration(d.value)} className="text-center">
                    <span className="text-xs font-semibold">{d.label}</span>
                  </Choice>
                ))}
              </div>
              <GameButton onClick={() => void createRoom()} disabled={busy || conn !== 'online'} className="mt-3 w-full">
                <Plus className="h-4 w-4" /> Өрөө үүсгэх
              </GameButton>
            </div>

            <div className="mt-3 rounded-xl border border-ink-600/70 bg-ink-800/50 p-3">
              <SectionLabel>Кодоор нэгдэх</SectionLabel>
              <form
                className="mt-2 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void joinRoom(joinCode);
                }}
              >
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 5))}
                  placeholder="ABC12"
                  className="h-11 min-w-0 flex-1 rounded-xl border border-ink-600 bg-ink-950 px-3 font-mono text-base uppercase tracking-[0.3em] text-mist-50 outline-none focus:border-brand"
                  autoComplete="off"
                  spellCheck={false}
                />
                <GameButton type="submit" disabled={busy || conn !== 'online' || joinCode.trim().length < 5} tone="ghost">
                  Нэгдэх
                </GameButton>
              </form>
            </div>

            <div className="mt-3 rounded-xl border border-ink-600/70 bg-ink-800/50 p-3">
              <div className="flex items-center justify-between">
                <SectionLabel>Нээлттэй өрөөнүүд</SectionLabel>
                <button type="button" onClick={() => void call<OpenRoomSummary[]>('rooms:list').then((l) => l && setOpenRooms(l))} className="text-mist-400 hover:text-mist-50" aria-label="Шинэчлэх">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
              {openRooms.length === 0 ? (
                <p className="mt-2 text-xs text-mist-500">Одоогоор нээлттэй өрөө алга. Өөрөө үүсгээд кодоо найздаа илгээ.</p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {openRooms.map((r) => (
                    <li key={r.code} className="flex items-center gap-2 rounded-lg border border-ink-600/60 bg-ink-900/60 px-2.5 py-1.5 text-xs">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAM_INFO[r.hostTeam].color }} />
                      <span className="font-semibold text-mist-50">{r.hostName}</span>
                      <span className="text-mist-500">
                        {DIFFICULTY_LABELS[r.difficulty]} · {formatClock(r.durationSec * 1000)} · <span className="font-mono">{r.code}</span>
                      </span>
                      <GameButton onClick={() => void joinRoom(r.code)} disabled={busy} tone="ghost" className="ml-auto px-3 py-1 text-xs">
                        Нэгдэх
                      </GameButton>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-3 flex justify-center">
              <MuteButton />
            </div>
            <LeaderboardPanel scope="TUG_OF_WAR" limit={5} compact refreshKey={lbRefresh} className="mt-3" />
          </Overlay>
        )}

        {/* ── Lobby ── */}
        {room && room.status === 'lobby' && (
          <Overlay size="lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
                <Users className="h-3.5 w-3.5" /> Өрөө
              </p>
              {connBadge}
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="font-mono text-3xl font-bold tracking-[0.35em] text-mist-50">{room.code}</span>
              <button type="button" onClick={() => void copyCode()} className="rounded-lg border border-ink-600/80 p-2 text-mist-400 hover:text-mist-50" aria-label="Код хуулах">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-center text-xs text-mist-400">Кодыг найздаа илгээ — тэр нэгдэхэд тоглолт эхэлнэ.</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {(['red', 'blue'] as Team[]).map((t) => {
                const p = room.players.find((x) => x.team === t);
                const mineHere = p?.userId === userId;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={busy || mineHere}
                    onClick={() => void call<RoomState>('room:pickTeam', { team: t })}
                    className={`rounded-xl border-2 px-3 py-3 text-left transition-colors ${mineHere ? 'bg-ink-800' : 'border-ink-600/80 bg-ink-800/50 hover:border-ink-500'}`}
                    style={mineHere ? { borderColor: TEAM_INFO[t].color, boxShadow: `0 0 0 3px ${TEAM_INFO[t].color}33` } : undefined}
                    title={mineHere ? 'Таны баг' : 'Энэ багт орох'}
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-mist-50">
                      <span className="h-3 w-3 rounded-full" style={{ background: TEAM_INFO[t].color }} />
                      {TEAM_INFO[t].label}
                    </span>
                    <span className="mt-1 flex items-center gap-1 text-xs text-mist-300">
                      {p ? (
                        <>
                          {p.isHost && <Crown className="h-3 w-3 text-modifier" />}
                          {p.name}
                          {mineHere && <span className="text-brand"> (та)</span>}
                        </>
                      ) : (
                        <span className="text-mist-500">хүлээж байна…</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <SectionLabel>Хүндрэл {isHost ? '' : '(эзэн сонгоно)'}</SectionLabel>
              <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                {BOT_LEVELS.map((b) => (
                  <Choice key={b.level} active={room.difficulty === b.level} disabled={!isHost || busy} onClick={() => void call<RoomState>('room:setup', { difficulty: b.level })} className="text-center">
                    <span className="text-xs font-semibold">{b.label}</span>
                  </Choice>
                ))}
              </div>
              <SectionLabel>
                <span className="mt-3 block">Хугацаа</span>
              </SectionLabel>
              <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                {DURATIONS.map((d) => (
                  <Choice key={d.value} active={room.durationSec === d.value} disabled={!isHost || busy} onClick={() => void call<RoomState>('room:setup', { durationSec: d.value })} className="text-center">
                    <span className="text-xs font-semibold">{d.label}</span>
                  </Choice>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {isHost ? (
                <GameButton onClick={() => void startGame()} disabled={busy || room.players.length < 2} autoFocus>
                  <Flag className="h-4 w-4" /> {room.players.length < 2 ? 'Өрсөлдөгч хүлээж байна…' : 'ЭХЛЭХ'}
                </GameButton>
              ) : (
                <p className="text-sm text-mist-300">Эзэн тоглолтыг эхлүүлэхийг хүлээж байна…</p>
              )}
              <GameButton onClick={() => void leaveRoom()} tone="ghost" disabled={busy}>
                <LogOut className="h-4 w-4" /> Гарах
              </GameButton>
              <MuteButton compact />
            </div>
          </Overlay>
        )}

        {/* ── Үр дүн ── */}
        {room && room.status === 'finished' && showResults && result && (
          <Overlay tone={result.won ? 'success' : result.draw ? 'brand' : 'danger'} size="lg">
            <div className="flex items-center justify-center gap-3">
              {result.won ? <Trophy className="h-7 w-7 text-modifier" /> : <Flag className="h-7 w-7 text-mist-300" />}
              <h2 className={`font-display text-3xl font-bold tracking-[0.12em] sm:text-4xl ${result.won ? 'text-success' : result.draw ? 'text-modifier' : 'text-danger'}`}>
                {result.won ? 'ТА ХОЖЛОО!' : result.draw ? 'ТЭНЦЭЭ' : 'ХОЖИГДЛОО'}
              </h2>
            </div>
            <p className="mt-2 text-center text-sm text-mist-300">
              {room.reason === 'forfeit'
                ? 'Өрсөлдөгч тоглолтыг орхилоо.'
                : room.reason === 'line'
                  ? `Тууз ${room.winner === 'red' ? 'улаан' : 'цэнхэр'} шугамыг давлаа.`
                  : result.draw
                    ? 'Хугацаа дуусахад тууз яг голд байлаа.'
                    : `Хугацаа дууслаа — тууз ${room.winner === 'red' ? 'улаан' : 'цэнхэр'} талд байлаа.`}
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <Stat label="Оноо" value={String(result.score)} />
              <Stat label="Таны зөв" value={String(me?.correct ?? 0)} tone="text-success" />
              <Stat label="Таны буруу" value={String(me?.wrong ?? 0)} tone="text-danger" />
              <Stat label={opp?.name ?? 'Өрсөлдөгч'} value={String(opp?.correct ?? 0)} tone="text-mist-300" />
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {isHost ? (
                <GameButton onClick={() => void call<RoomState>('room:again')} disabled={busy} autoFocus>
                  <RefreshCw className="h-4 w-4" /> Дахин тоглох
                </GameButton>
              ) : (
                <p className="text-sm text-mist-300">Эзэн дахин эхлүүлэхийг хүлээж байна…</p>
              )}
              <GameButton onClick={() => void leaveRoom()} tone="ghost" disabled={busy}>
                <LogOut className="h-4 w-4" /> Гарах
              </GameButton>
            </div>
            <LeaderboardPanel scope="TUG_OF_WAR" limit={5} compact refreshKey={lbRefresh} className="mt-4" />
          </Overlay>
        )}
      </div>

      {/* ── Консол: хоёр карт ── */}
      {inGame && (
        <div className="ce-scroll max-h-[60%] shrink-0 overflow-y-auto border-t-2 border-ink-600/80 bg-ink-900/95 px-2 py-2 backdrop-blur sm:max-h-none sm:overflow-visible sm:px-4 sm:py-3">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-mist-400">
            <span>
              Өрөө <span className="font-mono text-mist-200">{room!.code}</span> · {DIFFICULTY_LABELS[room!.difficulty]} · {formatClock(room!.durationSec * 1000)}
            </span>
            <div className="flex items-center gap-1.5">
              {connBadge}
              <MuteButton compact />
              <button
                type="button"
                onClick={() => void leaveRoom()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-600/80 bg-ink-900/80 text-mist-400 transition-colors hover:border-danger/60 hover:text-danger"
                aria-label="Гарах"
                title="Гарах (тоглолтын дундуур гарвал хожигдоно)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Утсанд: өөрийн карт дээр, өрсөлдөгчийнх доор. Өргөн дэлгэцэд: улаан зүүн, цэнхэр баруун. */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
            {myCard}
            {oppCard}
          </div>
        </div>
      )}
    </>
  );
}
