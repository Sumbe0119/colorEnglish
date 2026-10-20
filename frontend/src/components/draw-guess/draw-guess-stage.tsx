// frontend/src/components/draw-guess/draw-guess-stage.tsx
// "Зураг таах" — бүтэн хуудасны 2D дүрслэл (presentational). Socket-той холбоогүй: өрөөний төлөв,
// урсгал, цагийн утгуудыг props-оор авч, үйлдлүүдийг callback-аар буцаана (draw-guess-game.tsx дуудна;
// mock өгөгдлөөр preview хийж болно).
// Дээд хэсэг: canvas студи (StudioScene) — easel-ийн байранд 800×600 зурах самбар (DrawCanvas) DOM-оор давхарлагдана.
// Доод хэсэг: консол (зурагчийн хэрэгсэл / утсан дээр таах input + урсгал), том дэлгэцэд баруун багана = урсгал.
// Lobby, дууссан дэлгэц — sentence-builder маягийн Overlay; үг сонгох / илчлэлт — самбар дээрх давхарга.
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Crown,
  Lightbulb,
  LogOut,
  Palette,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Timer,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  HINT_EVERY_SECONDS,
  MIN_PLAYERS,
  TURN_SECONDS,
  type DrawOp,
  type GuessResult,
  type OpenRoomSummary,
  type RoomState,
  type TurnSecret,
} from '@/lib/draw-guess-socket';
import { isMuted, setMuted, sfx, unlockAudio } from '@/lib/draw-guess-sfx';
import { Fireworks } from '@/components/sentence-builder/fireworks';
import { DrawCanvas, type CanvasHandle } from './draw-canvas';
import { GuessFeed, type FeedItem } from './guess-feed';
import { PlayerChips, Scoreboard } from './scoreboard';
import { LeaderboardPanel } from '@/components/games/leaderboard';
import { StudioScene, type Conn, type SceneLayout, type ScenePlayer } from './studio-scene';

/** Үг сонгох хугацаа (backend CHOOSE_MS) — цагийн тойргийн хувьд */
const CHOOSE_SECONDS = 15;
/** Подиум босож дууссаны дараа дууссан давхарга гарах хугацаа */
const FINISHED_OVERLAY_DELAY_MS = 1400;

export type DrawGuessStageProps = {
  userId: string;
  playerName: string;
  conn: Conn;
  connError: string | null;
  room: RoomState | null;
  openRooms: OpenRoomSummary[];
  busy: boolean;
  /** Энэ ээлжийн нууц (turnKey таарсан) */
  secret: TurnSecret | null;
  feed: FeedItem[];
  /** Ээлжийн үлдсэн секунд (серверийн цагаар) */
  remaining: number | null;
  /** Үг сонгох үлдсэн секунд */
  chooseRemaining: number | null;
  nextHintIn: number | null;
  canvasRef: React.Ref<CanvasHandle>;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
  onLeaveRoom: () => void;
  onStartGame: () => void;
  onAgain: () => void;
  onChooseWord: (index: number) => void;
  onRefreshRooms: () => void;
  onReconnect: () => void;
  onCopyCode: () => void;
  onGuess: (text: string) => Promise<GuessResult | null>;
  onOp: (op: DrawOp) => void;
  onUndo: () => void;
  onClear: () => void;
};

const STYLES = `
@keyframes dg-rise {
  0% { transform: translateY(18px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.dg-rise { animation: dg-rise 0.5s cubic-bezier(.2,.9,.3,1.1) forwards; }
@keyframes dg-pop {
  0% { transform: scale(0.6); opacity: 0; }
  60% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.dg-pop { animation: dg-pop 0.45s cubic-bezier(.2,.9,.3,1.3) forwards; }
@keyframes dg-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.dg-blink { animation: dg-blink 1.1s ease-in-out infinite; }
`;

export function DrawGuessStage(props: DrawGuessStageProps) {
  const { userId, playerName, conn, connError, room, openRooms, busy, secret, feed, remaining, chooseRemaining, nextHintIn, canvasRef } = props;
  const [joinCode, setJoinCode] = useState('');
  const [layout, setLayout] = useState<SceneLayout | null>(null);
  const [toolbarHost, setToolbarHost] = useState<HTMLElement | null>(null);
  const [finishedReady, setFinishedReady] = useState(false);
  const [burst, setBurst] = useState(0);

  const me = room?.players.find((p) => p.userId === userId) ?? null;
  const isHost = room?.hostUserId === userId;
  const isDrawer = !!room && room.drawerUserId === userId;
  const drawer = room?.players.find((p) => p.userId === room.drawerUserId) ?? null;
  const status = room?.status ?? 'lobby';
  const inGame = !!room && status !== 'lobby' && status !== 'finished';
  const drawing = status === 'drawing';
  const urgent = drawing && remaining != null && remaining <= 10;

  // Самбарын DOM байрлал — scene өөрийн хэмжээгээ хэмжээд easel-ийн rect-ийг буцаана (нэг эх үүсвэр)
  const board = layout?.board ?? null;

  // Дууссан: подиум босож, салют буусны дараа давхарга гарна
  useEffect(() => {
    if (status !== 'finished') {
      setFinishedReady(false);
      return;
    }
    setBurst((b) => b + 1);
    const id = window.setTimeout(() => setFinishedReady(true), FINISHED_OVERLAY_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [status]);

  const scenePlayers = useMemo<ScenePlayer[]>(() => {
    if (!room) {
      return [{ userId, name: playerName, score: 0, turnPoints: 0, isHost: false, connected: true, guessed: false, colorIdx: 0 }];
    }
    return room.players.map((p, i) => ({
      userId: p.userId,
      name: p.name,
      score: p.score,
      turnPoints: p.turnPoints,
      isHost: p.isHost,
      connected: p.connected,
      guessed: p.guessedAt != null,
      colorIdx: i,
    }));
  }, [room, userId, playerName]);

  const fraction =
    status === 'drawing' && remaining != null
      ? Math.max(0, Math.min(1, remaining / TURN_SECONDS))
      : status === 'choosing' && chooseRemaining != null
        ? Math.max(0, Math.min(1, chooseRemaining / CHOOSE_SECONDS))
        : 1;
  const remainSec = status === 'drawing' ? remaining : status === 'choosing' ? chooseRemaining : null;

  const guess = useCallback(
    async (text: string) => {
      const res = await props.onGuess(text);
      if (!res) return;
      if (res.correct) sfx.correct();
      else if (res.close) sfx.close();
      else sfx.wrong();
    },
    [props],
  );

  const withAudio = (fn: () => void) => () => {
    unlockAudio();
    sfx.tap();
    fn();
  };

  const canGuess = drawing && !isDrawer && me?.guessedAt == null && conn === 'online';
  const disabledNote = isDrawer
    ? 'Та зурж байна'
    : me?.guessedAt != null
      ? 'Та зөв таалаа — бусдыг хүлээ'
      : status === 'choosing'
        ? 'Үг сонгохыг хүлээж байна…'
        : status === 'reveal'
          ? 'Ээлж дууслаа'
          : 'Холбогдоогүй';

  // ── Самбар дээрх давхарга: үг сонгох / илчлэлт ──
  let boardOverlay: React.ReactNode = null;
  if (room && status === 'choosing') {
    boardOverlay = (
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-y-auto bg-ink-950/75 p-2 backdrop-blur-[2px] sm:p-4">
        {isDrawer ? (
          <div className="dg-rise max-h-full w-full max-w-md overflow-y-auto rounded-2xl border-2 border-brand/40 bg-ink-900/95 p-3 shadow-[0_0_0_4px_rgba(79,140,255,0.12),0_24px_60px_rgba(0,0,0,0.6)] sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">Таны ээлж — зурах үгээ сонго</p>
            <p className="mt-0.5 text-[11px] text-mist-400 sm:text-xs">
              <span className="font-mono text-mist-50">{chooseRemaining ?? 0}</span> секундийн дараа эхнийх нь автоматаар сонгогдоно.
            </p>
            <div className="mt-2 grid gap-1.5 sm:mt-3 sm:gap-2">
              {(secret?.options ?? []).map((w, i) => (
                <button
                  key={w.word}
                  type="button"
                  disabled={busy}
                  onClick={withAudio(() => props.onChooseWord(i))}
                  className="flex items-center justify-between gap-3 rounded-xl border border-ink-500 bg-ink-800 px-3 py-2 text-left shadow-[0_4px_0_#0C1220] transition-all hover:border-brand hover:bg-brand/10 active:translate-y-[2px] active:shadow-[0_2px_0_#0C1220] disabled:opacity-50 sm:px-4 sm:py-2.5"
                >
                  <span className="font-display text-base font-bold text-mist-50 sm:text-lg">{w.word}</span>
                  <span className="truncate text-xs text-mist-400 sm:text-sm">{w.meaning}</span>
                </button>
              ))}
              {!secret?.options && <p className="text-sm text-mist-400">Үгнүүдийг ачаалж байна…</p>}
            </div>
          </div>
        ) : (
          <div className="dg-pop text-center">
            <Pencil className="mx-auto h-6 w-6 text-brand sm:h-8 sm:w-8" />
            <p className="mt-2 font-display text-base font-bold text-mist-50 sm:text-lg">{drawer?.name ?? '…'} үг сонгож байна</p>
            <p className="font-mono text-sm text-mist-400">{chooseRemaining ?? 0} сек</p>
          </div>
        )}
      </div>
    );
  } else if (room && status === 'reveal') {
    const guessed = room.players.filter((p) => p.guessedAt != null).sort((a, b) => (a.guessedAt ?? 0) - (b.guessedAt ?? 0));
    boardOverlay = (
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-y-auto bg-ink-950/70 p-2 backdrop-blur-[2px] sm:p-4">
        <div className="dg-rise max-h-full w-full max-w-sm overflow-y-auto rounded-2xl border-2 border-modifier/50 bg-ink-900/95 p-3 text-center shadow-[0_0_0_4px_rgba(255,209,102,0.12),0_24px_60px_rgba(0,0,0,0.6)] sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-modifier">Үг нь</p>
          <p className="mt-0.5 font-display text-2xl font-bold text-mist-50 sm:text-3xl">{room.revealedWord?.word ?? '—'}</p>
          <p className="text-xs text-mist-400 sm:text-sm">{room.revealedWord?.meaning}</p>
          <div className="mt-2 space-y-1 text-xs sm:mt-3 sm:text-sm">
            {guessed.length === 0 ? (
              <p className="text-mist-500">Хэн ч таасангүй</p>
            ) : (
              guessed.map((p, i) => (
                <p key={p.userId} className="flex items-center justify-between rounded-lg bg-success/10 px-3 py-1 text-success">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" /> {i + 1}. {p.userId === userId ? 'Та' : p.name}
                  </span>
                  <span className="font-mono">+{p.turnPoints}</span>
                </p>
              ))
            )}
            {drawer && drawer.turnPoints > 0 && (
              <p className="flex items-center justify-between rounded-lg bg-brand/10 px-3 py-1 text-brand">
                <span className="inline-flex items-center gap-1.5">
                  <Pencil className="h-3.5 w-3.5" /> {drawer.userId === userId ? 'Та' : drawer.name} (зурсан)
                </span>
                <span className="font-mono">+{drawer.turnPoints}</span>
              </p>
            )}
          </div>
          <p className="dg-blink mt-2 text-[11px] text-mist-500">Дараагийн ээлж удахгүй…</p>
        </div>
      </div>
    );
  }

  const connBadge = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
        conn === 'online' ? 'border-success/30 bg-success/10 text-success' : conn === 'connecting' ? 'border-modifier/30 bg-modifier/10 text-modifier' : 'border-danger/40 bg-danger/10 text-danger'
      }`}
    >
      {conn === 'online' ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      {conn === 'online' ? 'Холбогдсон' : conn === 'connecting' ? 'Холбогдож байна…' : 'Холболтгүй'}
    </span>
  );

  const sortedPlayers = room ? [...room.players].sort((a, b) => b.score - a.score) : [];
  const winner = sortedPlayers[0] ?? null;
  const consoleBorder = status === 'reveal' ? '#FFD166' : urgent ? '#FF6B7A' : me?.guessedAt != null ? '#3DDC97' : 'rgba(79,140,255,0.6)';

  return (
    <div className="relative flex h-[calc(100dvh-6rem)] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-ink-600/80 bg-ink-950 shadow-card md:h-[calc(100dvh-8.5rem)] lg:h-[calc(100dvh-5rem)]">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Fireworks burst={burst} />

      <div className="flex min-h-0 flex-1">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/* ── Студи (canvas) + самбар ── */}
          <div className="relative min-h-0 flex-1">
            <StudioScene
              inRoom={!!room}
              status={status}
              players={scenePlayers}
              drawerUserId={room?.drawerUserId ?? null}
              meUserId={userId}
              round={room?.round ?? 0}
              totalRounds={room?.totalRounds ?? 0}
              turn={room?.turn ?? 0}
              totalTurns={room?.totalTurns ?? 0}
              remainSec={remainSec}
              fraction={fraction}
              masked={room?.masked ?? null}
              secret={isDrawer ? (secret?.word ?? null) : null}
              revealed={room?.revealedWord ?? null}
              nextHintIn={nextHintIn}
              roomCode={room?.code ?? null}
              conn={conn}
              hasBoard={inGame}
              onLayout={setLayout}
            />

            {inGame && board && (
              <div className="absolute" style={{ left: board.x, top: board.y, width: board.w, height: board.h }}>
                <DrawCanvas
                  ref={canvasRef}
                  canDraw={isDrawer && drawing}
                  onOp={props.onOp}
                  onUndo={props.onUndo}
                  onClear={props.onClear}
                  overlay={boardOverlay}
                  toolbarHost={toolbarHost}
                  frameClassName="rounded-[4px]"
                  toolbarExtra={
                    <div className="flex items-center gap-1">
                      <MuteButton compact small />
                      <LeaveButton onClick={props.onLeaveRoom} small />
                    </div>
                  }
                />
              </div>
            )}

            {room && conn === 'offline' && (
              <button
                type="button"
                onClick={props.onReconnect}
                className="dg-pop absolute right-3 top-14 inline-flex items-center gap-1.5 rounded-full border border-danger/50 bg-ink-900/95 px-3 py-1.5 text-xs text-danger hover:bg-danger/10"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Дахин холбогдох
              </button>
            )}

            {/* ── Өрөөнд ороогүй ── */}
            {!room && (
              <Overlay wide>
                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Color English · Multiplayer</p>
                <h1 className="mt-2 text-center font-display text-3xl font-bold tracking-wide text-mist-50 sm:text-4xl">ЗУРАГ ТААХ</h1>
                <p className="mt-2 text-center text-sm text-mist-300">
                  Сайн уу, <span className="font-semibold text-mist-50">{playerName}</span>! Найзуудтайгаа ээлжлэн зурж, таа.
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {connBadge}
                  {connError && <span className="text-xs text-danger">{connError}</span>}
                  {conn === 'offline' && (
                    <button
                      type="button"
                      onClick={props.onReconnect}
                      className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 px-3 py-1 text-xs text-mist-200 hover:bg-ink-800"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Дахин холбогдох
                    </button>
                  )}
                  <MuteButton compact />
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="flex flex-col rounded-xl border border-ink-600/70 bg-ink-800/60 p-3">
                    <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-mist-50">
                      <Plus className="h-4 w-4 text-brand" /> Шинэ өрөө үүсгэх
                    </p>
                    <p className="mt-1 flex-1 text-xs text-mist-400">2–8 хүн, кодоо найзууддаа илгээ.</p>
                    <GameButton onClick={withAudio(props.onCreateRoom)} disabled={busy || conn !== 'online'} className="mt-3 w-full">
                      <Palette className="h-4 w-4" /> Өрөө үүсгэх
                    </GameButton>
                  </div>
                  <form
                    className="flex flex-col rounded-xl border border-ink-600/70 bg-ink-800/60 p-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      unlockAudio();
                      props.onJoinRoom(joinCode);
                    }}
                  >
                    <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-mist-50">
                      <Users className="h-4 w-4 text-success" /> Кодоор нэгдэх
                    </p>
                    <p className="mt-1 text-xs text-mist-400">5 оронтой код оруул.</p>
                    <div className="mt-3 flex gap-2">
                      <input
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5))}
                        placeholder="ABC12"
                        aria-label="Өрөөний код"
                        className="h-11 w-full min-w-0 rounded-xl border-2 border-ink-600 bg-ink-950 px-3 font-mono text-base uppercase tracking-[0.3em] text-mist-50 outline-none focus:border-brand"
                      />
                      <GameButton onClick={() => props.onJoinRoom(joinCode)} tone="ghost" disabled={busy || conn !== 'online'} className="px-4">
                        Нэгдэх
                      </GameButton>
                    </div>
                  </form>
                </div>

                <div className="mt-3 rounded-xl border border-ink-600/70 bg-ink-800/60 p-3">
                  <div className="flex items-center justify-between">
                    <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-mist-50">
                      <Users className="h-4 w-4 text-brand" /> Нээлттэй өрөөнүүд
                    </p>
                    <button type="button" onClick={props.onRefreshRooms} className="inline-flex items-center gap-1 text-xs text-mist-400 hover:text-mist-100">
                      <RefreshCw className="h-3.5 w-3.5" /> Шинэчлэх
                    </button>
                  </div>
                  {openRooms.length === 0 ? (
                    <p className="mt-2 text-xs text-mist-500">Нээлттэй өрөө алга.</p>
                  ) : (
                    <ul className="ce-scroll mt-2 max-h-32 divide-y divide-ink-600/60 overflow-y-auto">
                      {openRooms.map((r) => (
                        <li key={r.code} className="flex items-center gap-3 py-2 text-xs">
                          <span className="font-mono text-sm tracking-widest text-mist-50">{r.code}</span>
                          <span className="min-w-0 flex-1 truncate text-mist-400">{r.hostName}</span>
                          <span className="text-mist-400">
                            {r.playerCount}/{r.maxPlayers}
                          </span>
                          <button
                            type="button"
                            disabled={busy || conn !== 'online'}
                            onClick={withAudio(() => props.onJoinRoom(r.code))}
                            className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-[0_3px_0_#2A5BB8] hover:bg-brand-hover active:translate-y-[1px] active:shadow-[0_2px_0_#2A5BB8] disabled:opacity-50"
                          >
                            Нэгдэх
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Дүрэм — богино */}
                <div className="mt-3 grid gap-1.5 text-xs text-mist-300 sm:grid-cols-2">
                  <Rule icon={<Pencil className="h-3.5 w-3.5 text-brand" />}>Нэг нь {TURN_SECONDS} сек зурна, бусад нь англиар таана.</Rule>
                  <Rule icon={<Lightbulb className="h-3.5 w-3.5 text-modifier" />}>{HINT_EVERY_SECONDS} сек тутамд нэг үсэг нээгдэнэ.</Rule>
                  <Rule icon={<Trophy className="h-3.5 w-3.5 text-success" />}>Түрүүлж таасан нь их оноо, зурагч +10.</Rule>
                  <Rule icon={<Crown className="h-3.5 w-3.5 text-modifier" />}>Хүн бүр 3 удаа зурна — хамгийн их оноотой нь ялна.</Rule>
                </div>
                {/* Тоглоом бүрийн эцсийн оноог сервер leaderboard-д бүртгэнэ */}
                <LeaderboardPanel scope="DRAW_GUESS" limit={5} compact className="mt-4" />
              </Overlay>
            )}

            {/* ── Lobby ── */}
            {room && status === 'lobby' && (
              <Overlay wide>
                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Өрөөний код</p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="font-display text-3xl font-bold tracking-[0.35em] text-mist-50 sm:text-4xl">{room.code}</span>
                  <button
                    type="button"
                    onClick={props.onCopyCode}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-600/80 bg-ink-900/80 text-mist-400 hover:border-ink-500 hover:text-mist-50"
                    aria-label="Код хуулах"
                    title="Код хуулах"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-center text-sm text-mist-300">
                  Тоглогчдыг хүлээж байна · <span className="font-semibold text-mist-50">{room.players.length}/{room.maxPlayers}</span> · дор хаяж{' '}
                  {MIN_PLAYERS} хүн
                </p>
                <div className="mt-4">
                  <PlayerChips players={room.players} userId={userId} />
                </div>
                <p className="mt-4 inline-flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-mist-500">
                  <span className="inline-flex items-center gap-1">
                    <Timer className="h-3 w-3" /> {TURN_SECONDS} сек / ээлж
                  </span>
                  <span>{HINT_EVERY_SECONDS} сек тутамд нэг үсэг тип</span>
                  <span>хүн бүр {room.totalRounds} удаа зурна</span>
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {isHost ? (
                    <GameButton onClick={withAudio(props.onStartGame)} disabled={busy || conn !== 'online' || room.players.length < MIN_PLAYERS} autoFocus className="px-8 py-3 text-base">
                      <Play className="h-5 w-5" /> ТОГЛОХ
                    </GameButton>
                  ) : (
                    <p className="dg-blink text-sm text-mist-400">
                      Эзэн <span className="text-mist-100">{room.players.find((p) => p.isHost)?.name}</span> эхлүүлэхийг хүлээж байна…
                    </p>
                  )}
                  <GameButton onClick={props.onLeaveRoom} tone="ghost" disabled={busy}>
                    <LogOut className="h-4 w-4" /> Гарах
                  </GameButton>
                  <MuteButton compact />
                </div>
                {isHost && room.players.length < MIN_PLAYERS && (
                  <p className="mt-3 text-center text-xs text-mist-500">Кодоо найздаа илгээ — дор хаяж {MIN_PLAYERS} хүн болоход эхлүүлж болно.</p>
                )}
                <div className="mt-3 flex justify-center">{connBadge}</div>
              </Overlay>
            )}

            {/* ── Дууссан ── */}
            {room && status === 'finished' && finishedReady && (
              <Overlay tone="success" wide align="top">
                <div className="flex items-center justify-center gap-3">
                  <Trophy className="h-6 w-6 text-modifier" />
                  <h2 className="font-display text-2xl font-bold tracking-[0.12em] text-success sm:text-3xl">ТОГЛООМ ДУУСЛАА</h2>
                </div>
                <p className="mt-1 text-center text-sm text-mist-300">
                  Ялагч: <span className="font-semibold text-modifier">{winner ? winner.name : '—'}</span>
                  {winner?.userId === userId && <span className="text-success"> — та!</span>}
                  {winner && <span className="text-mist-500"> · {winner.score} оноо</span>}
                </p>
                <div className="ce-scroll mt-3 max-h-40 overflow-y-auto">
                  <Scoreboard players={room.players} drawerUserId={null} userId={userId} showTurnPoints={false} />
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {isHost && (
                    <GameButton onClick={withAudio(props.onAgain)} disabled={busy} autoFocus>
                      <RefreshCw className="h-4 w-4" /> Дахин тоглох
                    </GameButton>
                  )}
                  <GameButton onClick={props.onLeaveRoom} tone="ghost" disabled={busy}>
                    <LogOut className="h-4 w-4" /> Өрөөнөөс гарах
                  </GameButton>
                </div>
                {!isHost && <p className="mt-2 text-center text-xs text-mist-500">Өрөөний эзэн дахин эхлүүлэхийг хүлээж байна.</p>}
                <LeaderboardPanel scope="DRAW_GUESS" limit={5} compact refreshKey={1} className="mt-4" />
              </Overlay>
            )}
          </div>

          {/* ── Консол (доод самбар) ── */}
          {inGame && (
            <div className="shrink-0 border-t-2 bg-ink-900/95 px-2 py-2 backdrop-blur sm:px-3" style={{ borderTopColor: consoleBorder }}>
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  {isDrawer && drawing && <div ref={setToolbarHost} />}
                  <div className={`lg:hidden ${isDrawer && drawing ? 'mt-2' : ''}`}>
                    <GuessFeed items={feed} canGuess={canGuess} disabledNote={disabledNote} onGuess={guess} variant="console" urgent={urgent} showInput={!isDrawer} />
                  </div>
                  {!(isDrawer && drawing) && (
                    <p className="hidden pt-2 text-xs text-mist-500 lg:block">
                      {isDrawer
                        ? status === 'choosing'
                          ? 'Самбар дээрээс зурах үгээ сонго.'
                          : 'Ээлж дууслаа — дараагийн зурагч удахгүй.'
                        : me?.guessedAt != null
                          ? 'Та зөв таалаа — бусдыг хүлээ.'
                          : status === 'drawing'
                            ? 'Зургийг хараад англи үгийг баруун талд бич. Нэг үсгээр зөрвөл «ойрхон» гэж хэлнэ.'
                            : status === 'choosing'
                              ? `${drawer?.name ?? '…'} үг сонгож байна…`
                              : 'Ээлж дууслаа.'}
                    </p>
                  )}
                </div>
                {/* Зурагч зурж байх үед дуу/гарах товч хэрэгслийн самбарын төгсгөлд (toolbarExtra) орно */}
                {!(isDrawer && drawing) && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <MuteButton compact />
                    <LeaveButton onClick={props.onLeaveRoom} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Баруун багана: урсгал (том дэлгэц) ── */}
        {inGame && (
          <aside className="hidden w-[300px] shrink-0 border-l border-ink-600/80 bg-ink-900/95 lg:flex lg:flex-col">
            <GuessFeed items={feed} canGuess={canGuess} disabledNote={disabledNote} onGuess={guess} variant="panel" urgent={urgent} />
          </aside>
        )}
      </div>
    </div>
  );
}

function LeaveButton({ onClick, small = false }: { onClick: () => void; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg border border-ink-600/80 bg-ink-900/80 text-mist-400 transition-colors hover:border-danger/60 hover:text-danger ${
        small ? 'h-8 w-8' : 'h-9 w-9'
      }`}
      aria-label="Гарах"
      title="Өрөөнөөс гарах"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}

function MuteButton({ compact = false, small = false }: { compact?: boolean; small?: boolean }) {
  const [muted, setMutedState] = useState(false);
  useEffect(() => setMutedState(isMuted()), []);
  return (
    <button
      type="button"
      onClick={() => {
        const next = !muted;
        setMuted(next);
        setMutedState(next);
        if (!next) {
          unlockAudio();
          sfx.tap();
        }
      }}
      className={`inline-flex items-center gap-1 rounded-lg border border-ink-600/80 bg-ink-900/80 text-xs text-mist-400 transition-colors hover:border-ink-500 hover:text-mist-50 ${
        compact ? (small ? 'h-8 w-8 justify-center' : 'h-9 w-9 justify-center') : 'px-3 py-1.5'
      }`}
      aria-label={muted ? 'Дуу нээх' : 'Дуу хаах'}
      title={muted ? 'Дуу нээх' : 'Дуу хаах'}
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      {!compact && (muted ? 'Дуугүй' : 'Дуутай')}
    </button>
  );
}

/** Тоглоомын товч — пиксел маягийн хүрээ, сүүдэртэй (sentence-builder-тэй ижил) */
function GameButton({
  children,
  onClick,
  tone = 'brand',
  className = '',
  disabled,
  autoFocus,
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: 'brand' | 'ghost' | 'warning' | 'danger';
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  const tones = {
    brand: 'bg-brand text-white shadow-[0_4px_0_#2A5BB8] hover:bg-brand-hover active:translate-y-[2px] active:shadow-[0_2px_0_#2A5BB8]',
    ghost: 'border border-ink-500 bg-ink-800 text-mist-200 shadow-[0_4px_0_#0C1220] hover:border-ink-500 hover:bg-ink-700 active:translate-y-[2px] active:shadow-[0_2px_0_#0C1220]',
    warning: 'border border-warning/50 bg-warning/10 text-warning shadow-[0_4px_0_rgba(255,176,32,0.25)] hover:bg-warning/20 active:translate-y-[2px] active:shadow-none',
    danger: 'bg-danger text-ink-950 shadow-[0_4px_0_#B03A48] hover:brightness-110 active:translate-y-[2px] active:shadow-[0_2px_0_#B03A48]',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-default disabled:opacity-50 disabled:active:translate-y-0 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

function Overlay({
  children,
  tone = 'brand',
  wide = false,
  align = 'center',
}: {
  children: React.ReactNode;
  tone?: 'brand' | 'danger' | 'success';
  wide?: boolean;
  align?: 'center' | 'top';
}) {
  const border = tone === 'danger' ? 'border-danger/50' : tone === 'success' ? 'border-success/50' : 'border-brand/40';
  const glow =
    tone === 'danger'
      ? 'shadow-[0_0_0_4px_rgba(255,107,122,0.12),0_24px_60px_rgba(0,0,0,0.6)]'
      : tone === 'success'
        ? 'shadow-[0_0_0_4px_rgba(61,220,151,0.12),0_24px_60px_rgba(0,0,0,0.6)]'
        : 'shadow-[0_0_0_4px_rgba(79,140,255,0.12),0_24px_60px_rgba(0,0,0,0.6)]';
  return (
    <div
      className={`ce-scroll absolute inset-0 flex justify-center overflow-y-auto p-3 sm:p-6 ${
        align === 'top' ? 'items-start bg-transparent pt-14 sm:pt-16' : 'items-center bg-ink-950/45 backdrop-blur-[2px]'
      }`}
    >
      <div className={`dg-rise w-full ${wide ? 'max-w-xl' : 'max-w-md'} rounded-2xl border-2 ${border} bg-ink-900/95 p-4 ${glow} sm:p-6`}>{children}</div>
    </div>
  );
}

function Rule({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-ink-600/60 bg-ink-800/60 px-2.5 py-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>{children}</span>
    </p>
  );
}
