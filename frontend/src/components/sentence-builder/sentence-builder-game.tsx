// frontend/src/components/sentence-builder/sentence-builder-game.tsx
// "Өгүүлбэр бүтээх" — бүтэн хуудас 2D тоглоом. Canvas дүрслэл (GameScene) дэлгэцийг дүүргэж,
// доор нь тоглоомын консол (утга, оролт, товч), дээр нь эхлэх / game over / ялалтын давхарга.
// Өгүүлбэрийн бүх үг холигдож тэнгэрт хөвнө (a / the / to орсон); тоглогч зөв дарааллаар бичнэ.
// Раунд бүр 5 → 8 үг болж хүндэрнэ, цаг нь үгийн тоогоор уртасна.
// Цаг дуусвал тавцан хагарч робот унана → GAME OVER. 10 тавцан давбал туг → ЯЛАЛТ.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check,
  Flame,
  Lightbulb,
  MousePointerClick,
  Play,
  RotateCcw,
  Skull,
  Timer,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  answerHint,
  exampleSentence,
  isCorrectAnswer,
  loadBest,
  MAX_WORDS,
  MIN_WORDS,
  normalizeSentence,
  pickRoundPuzzles,
  POINTS_WITH_TIP,
  ROUNDS_PER_GAME,
  roundSeconds,
  saveBestIfBetter,
  scoreFor,
  SECONDS_PER_EXTRA_WORD,
  shuffledWords,
  wordCount,
  type BestScore,
  type SentencePuzzle,
} from '@/lib/sentence-builder';
import { isMuted, setMuted, sfx, unlockAudio } from '@/lib/sentence-builder-sfx';
import { Fireworks } from './fireworks';
import { GameScene, type SceneStatus } from './game-scene';

type Phase = 'idle' | 'playing' | 'over' | 'won';
/** Нэг раундын төлөв: бичиж байна / зөв */
type RoundState = 'typing' | 'correct';

type RoundLog = {
  puzzle: SentencePuzzle;
  state: 'correct' | 'fall';
  points: number;
  usedTip: boolean;
  answer: string;
};

/** Зөв хариулсны дараа дараагийн тавцан руу автоматаар үсрэх хүртэлх хугацаа */
const AUTO_NEXT_MS = 2200;
/** Робот унаж дууссаны дараа game over дэлгэц гарах хугацаа */
const GAME_OVER_DELAY_MS = 1900;
const PREVIEW_WORDS = ['to', 'went', 'I', 'yesterday', 'work'];

const STYLES = `
@keyframes sb-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-7px); }
  40% { transform: translateX(7px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}
.sb-shake { animation: sb-shake 0.4s ease-in-out; }
@keyframes sb-pop {
  0% { transform: scale(0.6); opacity: 0; }
  60% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.sb-pop { animation: sb-pop 0.45s cubic-bezier(.2,.9,.3,1.3) forwards; }
@keyframes sb-rise {
  0% { transform: translateY(18px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.sb-rise { animation: sb-rise 0.5s cubic-bezier(.2,.9,.3,1.1) forwards; }
@keyframes sb-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.sb-blink { animation: sb-blink 1.1s ease-in-out infinite; }
@keyframes sb-glitch {
  0%, 100% { text-shadow: 3px 0 #FF6B7A, -3px 0 #4F8CFF; }
  50% { text-shadow: -3px 0 #FF6B7A, 3px 0 #4F8CFF; }
}
.sb-glitch { animation: sb-glitch 0.9s steps(2) infinite; }
`;

export function SentenceBuilderGame({ playerName }: { playerName: string }) {
  const [burst, setBurst] = useState(0);
  const celebrate = useCallback(() => setBurst((b) => b + 1), []);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Fireworks burst={burst} />
      <SentenceBuilderInner playerName={playerName} onFinale={celebrate} />
    </>
  );
}

function MuteButton({ compact = false }: { compact?: boolean }) {
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
          sfx.tip();
        }
      }}
      className={`inline-flex items-center gap-1 rounded-lg border border-ink-600/80 bg-ink-900/80 text-xs text-mist-400 transition-colors hover:border-ink-500 hover:text-mist-50 ${
        compact ? 'h-9 w-9 justify-center' : 'px-3 py-1.5'
      }`}
      aria-label={muted ? 'Дуу нээх' : 'Дуу хаах'}
      title={muted ? 'Дуу нээх' : 'Дуу хаах'}
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      {!compact && (muted ? 'Дуугүй' : 'Дуутай')}
    </button>
  );
}

/** Тоглоомын товч — пиксел маягийн хүрээ, сүүдэртэй */
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

function SentenceBuilderInner({ playerName, onFinale }: { playerName: string; onFinale: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [puzzles, setPuzzles] = useState<SentencePuzzle[]>([]);
  const [idx, setIdx] = useState(0);
  const [words, setWords] = useState<string[]>(PREVIEW_WORDS);
  const [roundState, setRoundState] = useState<RoundState>('typing');
  const [usedTip, setUsedTip] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [wrongMsg, setWrongMsg] = useState<string | null>(null);
  const [roundMs, setRoundMs] = useState(30000);
  const [remainMs, setRemainMs] = useState(30000);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const [log, setLog] = useState<RoundLog[]>([]);
  const [best, setBest] = useState<BestScore | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [overlayReady, setOverlayReady] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const startAtRef = useRef(0);
  const roundMsRef = useRef(30000);
  const roundStateRef = useRef<RoundState>('typing');
  const usedTipRef = useRef(false);
  const streakRef = useRef(0);
  const lastTickSecRef = useRef(0);
  const autoNextRef = useRef<number | null>(null);
  roundStateRef.current = roundState;
  usedTipRef.current = usedTip;

  const puzzle = puzzles[idx] ?? null;
  const fraction = Math.max(0, Math.min(1, remainMs / roundMs));
  const remainSec = Math.ceil(remainMs / 1000);
  const urgent = phase === 'playing' && roundState === 'typing' && remainMs <= 5000;
  const passed = log.filter((r) => r.state === 'correct').length;
  const sceneStatus: SceneStatus = phase === 'over' ? 'fall' : phase === 'won' ? 'win' : roundState;

  useEffect(() => {
    setBest(loadBest());
  }, []);

  const clearAutoNext = () => {
    if (autoNextRef.current != null) {
      window.clearTimeout(autoNextRef.current);
      autoNextRef.current = null;
    }
  };

  const beginRound = useCallback((list: SentencePuzzle[], i: number) => {
    clearAutoNext();
    const pz = list[i];
    const ms = roundSeconds(pz) * 1000;
    setIdx(i);
    setWords(shuffledWords(pz));
    setRoundState('typing');
    roundStateRef.current = 'typing';
    // Оролт uncontrolled: DOM утгыг шууд цэвэрлэнэ (controlled байх үед 50мс таймерын
    // re-render Android IME-ийн бичилтийг тасалж, «a», «the» мэт богино үг алга болдог байсан).
    if (inputRef.current) inputRef.current.value = '';
    setUsedTip(false);
    usedTipRef.current = false;
    setWrongMsg(null);
    setLastPoints(0);
    setRoundMs(ms);
    roundMsRef.current = ms;
    setRemainMs(ms);
    lastTickSecRef.current = Math.ceil(ms / 1000);
    startAtRef.current = performance.now();
    window.setTimeout(() => inputRef.current?.focus(), 30);
  }, []);

  const startGame = useCallback(() => {
    unlockAudio();
    const list = pickRoundPuzzles(ROUNDS_PER_GAME);
    setPuzzles(list);
    setScore(0);
    setStreak(0);
    streakRef.current = 0;
    setBestStreak(0);
    setLog([]);
    setIsNewBest(false);
    setOverlayReady(true);
    setPhase('playing');
    beginRound(list, 0);
  }, [beginRound]);

  const finishGame = useCallback(
    (finalLog: RoundLog[], finalScore: number, won: boolean) => {
      clearAutoNext();
      const correct = finalLog.filter((r) => r.state === 'correct').length;
      setIsNewBest(saveBestIfBetter({ score: finalScore, correct }));
      setBest(loadBest());
      if (won) {
        setPhase('won');
        setOverlayReady(false);
        sfx.fanfare();
        onFinale();
      } else {
        setPhase('over');
        setOverlayReady(false);
        sfx.gameOver();
      }
    },
    [onFinale],
  );

  // Game over / ялалтын давхарга анимацийн дараа гарна
  useEffect(() => {
    if (phase !== 'over' && phase !== 'won') return;
    const id = window.setTimeout(() => setOverlayReady(true), phase === 'over' ? GAME_OVER_DELAY_MS : 1400);
    return () => window.clearTimeout(id);
  }, [phase]);

  const goNext = useCallback(() => {
    clearAutoNext();
    const nextIdx = idx + 1;
    if (nextIdx >= puzzles.length) {
      finishGame(log, score, true);
      return;
    }
    beginRound(puzzles, nextIdx);
  }, [beginRound, finishGame, idx, log, puzzles, score]);

  /** Зөв хариулсан → бүртгэл нэмээд хэсэг хугацааны дараа дараагийн тавцан руу үсэрнэ. */
  const settleCorrect = useCallback(
    (points: number, answer: string) => {
      if (!puzzle) return;
      setRoundState('correct');
      roundStateRef.current = 'correct';
      setLastPoints(points);
      setLog((prev) => [...prev, { puzzle, state: 'correct', points, usedTip: usedTipRef.current, answer }]);
      setScore((s) => s + points);
      streakRef.current += 1;
      setStreak(streakRef.current);
      setBestStreak((b) => Math.max(b, streakRef.current));
      sfx.correct();
    },
    [puzzle],
  );

  /** Цаг дууссан → робот унана, тоглоом дуусна. */
  const fail = useCallback(() => {
    if (!puzzle) return;
    const finalLog: RoundLog[] = [...log, { puzzle, state: 'fall', points: 0, usedTip: usedTipRef.current, answer: inputRef.current?.value ?? '' }];
    setLog(finalLog);
    streakRef.current = 0;
    setStreak(0);
    setRemainMs(0);
    sfx.timeout();
    finishGame(finalLog, score, false);
  }, [finishGame, log, puzzle, score]);

  // Таймер: 50мс тутамд үлдсэн хугацааг шинэчилнэ; сүүлийн 5 секундэд тик дуугарна; 0 болоход унана.
  useEffect(() => {
    if (phase !== 'playing' || roundState !== 'typing') return;
    const id = window.setInterval(() => {
      const remain = Math.max(0, roundMsRef.current - (performance.now() - startAtRef.current));
      setRemainMs(remain);
      const sec = Math.ceil(remain / 1000);
      if (sec !== lastTickSecRef.current) {
        lastTickSecRef.current = sec;
        if (sec <= 5 && sec > 0) sfx.tick();
      }
      if (remain <= 0) {
        window.clearInterval(id);
        fail();
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [phase, roundState, fail]);

  // Зөв хариулсны дараа автоматаар дараагийнх руу
  useEffect(() => {
    if (phase !== 'playing' || roundState !== 'correct') return;
    autoNextRef.current = window.setTimeout(goNext, AUTO_NEXT_MS);
    return clearAutoNext;
  }, [phase, roundState, goNext]);

  const submit = useCallback(() => {
    if (!puzzle || roundStateRef.current !== 'typing') return;
    const value = inputRef.current?.value.trim() ?? '';
    if (!value) {
      inputRef.current?.focus();
      return;
    }
    if (isCorrectAnswer(puzzle, value)) {
      const remain = Math.max(0, roundMsRef.current - (performance.now() - startAtRef.current));
      settleCorrect(scoreFor(puzzle, remain, usedTipRef.current), value);
    } else {
      setShaking(true);
      setWrongMsg(answerHint(puzzle, value));
      sfx.wrong();
      inputRef.current?.focus();
    }
  }, [puzzle, settleCorrect]);

  const showTip = useCallback(() => {
    if (roundStateRef.current !== 'typing') return;
    setUsedTip(true);
    usedTipRef.current = true;
    sfx.tip();
    inputRef.current?.focus();
  }, []);

  /** Canvas дээрх үгийн блок дарахад: шинэ үг нэмэх, ашигласан үгийг буцаах. */
  const onWordTap = useCallback((word: string, used: boolean, pointerType: string) => {
    const el = inputRef.current;
    if (!el) return;
    const tokens = el.value.split(/\s+/).filter(Boolean);
    if (used) {
      const n = normalizeSentence(word);
      for (let i = tokens.length - 1; i >= 0; i--) {
        if (normalizeSentence(tokens[i]) === n) {
          tokens.splice(i, 1);
          break;
        }
      }
      el.value = tokens.join(' ');
    } else {
      tokens.push(word);
      el.value = tokens.join(' ');
      sfx.tick();
    }
    setWrongMsg(null);
    // Гар утсан дээр гар (keyboard) гарч ирэхгүйн тулд зөвхөн хулганы үед фокуслоно
    if (pointerType === 'mouse') el.focus();
  }, []);

  const getTyped = useCallback(() => inputRef.current?.value ?? '', []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (roundState === 'typing') submit();
    else goNext();
  };

  const quit = () => {
    clearAutoNext();
    setPhase('idle');
    setWords(PREVIEW_WORDS);
    setIdx(0);
    setLog([]);
    setRoundState('typing');
  };

  const playing = phase === 'playing';
  const resolved = roundState !== 'typing';
  const correctCount = log.filter((r) => r.state === 'correct').length;
  const failed = log.find((r) => r.state === 'fall') ?? null;

  return (
    <div className="relative flex h-[calc(100dvh-6rem-300px)] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-ink-600/80 bg-ink-950 shadow-card md:h-[calc(100dvh-8.5rem-300px)] lg:h-[calc(100dvh-5rem-300px)]">
      {/* ── Тоглоомын дэлгэц ── */}
      <div className="relative min-h-0 flex-1">
        <GameScene
          total={ROUNDS_PER_GAME}
          idx={phase === 'idle' ? 0 : Math.min(idx, ROUNDS_PER_GAME - 1)}
          passed={phase === 'idle' ? 0 : passed}
          status={phase === 'idle' ? 'typing' : sceneStatus}
          fraction={playing ? fraction : phase === 'over' ? 0 : 1}
          remainSec={playing ? remainSec : phase === 'over' ? 0 : 30}
          words={phase === 'idle' ? PREVIEW_WORDS : words}
          streak={streak}
          score={score}
          lastPoints={lastPoints}
          playing={phase !== 'idle'}
          getTyped={getTyped}
          onWordTap={onWordTap}
        />

        {/* ── Эхлэх дэлгэц ── */}
        {phase === 'idle' && (
          <Overlay>
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Color English · Game</p>
            <h1 className="mt-2 text-center font-display text-3xl font-bold tracking-wide text-mist-50 sm:text-4xl">ӨГҮҮЛБЭР БҮТЭЭХ</h1>
            <p className="mt-3 text-center text-sm text-mist-300">
              Бэлэн үү, <span className="font-semibold text-mist-50">{playerName}</span>? Робот баатраа {ROUNDS_PER_GAME} тавцан дамжуулж туг
              руу хүргэ.
            </p>

            <div className="mt-5 grid gap-2 text-xs text-mist-300 sm:grid-cols-2">
              <Rule icon={<MousePointerClick className="h-3.5 w-3.5 text-subject" />}>
                Өгүүлбэрийн <b className="text-mist-50">бүх үг</b> (a, the, to орсон) холигдож тэнгэрт хөвнө. Зөв дарааллаар бич, эсвэл блок
                дээр дарж нэм.
              </Rule>
              <Rule icon={<Flame className="h-3.5 w-3.5 text-verb" />}>
                Тавцан ахих тусам хүндэрнэ: {MIN_WORDS} үгээс эхлээд {MAX_WORDS} үг хүртэл. Нэмэлт үг бүрт +{SECONDS_PER_EXTRA_WORD} секунд.
              </Rule>
              <Rule icon={<Skull className="h-3.5 w-3.5 text-danger" />}>
                Цаг дуусвал тавцан хагарч робот унана — <b className="text-danger">GAME OVER</b>. Амь нэг л бий!
              </Rule>
              <Rule icon={<Lightbulb className="h-3.5 w-3.5 text-warning" />}>
                Гацвал Tip дарж жишээг хар (тэр раунд {POINTS_WITH_TIP} оноо). Хурдан бол урамшуулал нэмэгдэнэ.
              </Rule>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <GameButton onClick={startGame} autoFocus className="px-8 py-3 text-base">
                <Play className="h-5 w-5" /> ТОГЛОХ
              </GameButton>
              <MuteButton />
            </div>
            {best && (
              <p className="mt-4 inline-flex w-full items-center justify-center gap-1.5 text-xs text-modifier">
                <Trophy className="h-3.5 w-3.5" />
                Шилдэг: {best.score} оноо · {best.correct}/{ROUNDS_PER_GAME} тавцан
              </p>
            )}
          </Overlay>
        )}

        {/* ── GAME OVER ── */}
        {phase === 'over' && overlayReady && (
          <Overlay tone="danger">
            <div className="flex items-center justify-center gap-3">
              <Skull className="h-7 w-7 text-danger" />
              <h2 className="sb-glitch font-display text-3xl font-bold tracking-[0.15em] text-danger sm:text-4xl">GAME OVER</h2>
              <Skull className="h-7 w-7 text-danger" />
            </div>
            <p className="mt-2 text-center text-sm text-mist-300">Робот {idx + 1}-р тавцангаас унав. Цаг дуусахаас өмнө өгүүлбэрээ бүтээгээрэй!</p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Stat label="Оноо" value={String(score)} tone="text-mist-50" />
              <Stat label="Тавцан" value={`${correctCount}/${ROUNDS_PER_GAME}`} tone="text-success" />
              <Stat label="Combo" value={`${bestStreak}x`} tone="text-verb" />
            </div>
            {isNewBest && (
              <p className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-modifier">
                <Trophy className="h-3.5 w-3.5" /> Шинэ рекорд!
              </p>
            )}

            {failed && (
              <div className="mt-4 rounded-xl border border-danger/40 bg-danger/10 px-3 py-2.5 text-sm">
                <p className="text-[11px] uppercase tracking-wider text-danger">Зөв хариулт байсан</p>
                <p className="mt-0.5 font-mono text-mist-50">{exampleSentence(failed.puzzle)}</p>
                <p className="mt-0.5 text-xs text-mist-400">{failed.puzzle.mn}</p>
                {failed.answer.trim() && (
                  <p className="mt-1 text-xs text-mist-400">
                    Таны бичсэн: <span className="font-mono text-danger">{failed.answer}</span>
                  </p>
                )}
              </div>
            )}

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <GameButton onClick={startGame} autoFocus>
                <RotateCcw className="h-4 w-4" /> Дахин тоглох
              </GameButton>
              <GameButton onClick={quit} tone="ghost">
                Эхлэл рүү
              </GameButton>
            </div>
          </Overlay>
        )}

        {/* ── ЯЛАЛТ ── */}
        {phase === 'won' && overlayReady && (
          <Overlay tone="success" wide>
            <div className="flex items-center justify-center gap-3">
              <Trophy className="h-7 w-7 text-modifier" />
              <h2 className="font-display text-3xl font-bold tracking-[0.12em] text-success sm:text-4xl">ТУГАНД ХҮРЛЭЭ!</h2>
            </div>
            <p className="mt-2 text-center text-sm text-mist-300">Баяр хүргэе, {playerName}! {ROUNDS_PER_GAME} тавцанг бүгдийг давлаа.</p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Stat label="Оноо" value={String(score)} tone="text-mist-50" />
              <Stat label="Тавцан" value={`${correctCount}/${ROUNDS_PER_GAME}`} tone="text-success" />
              <Stat label="Combo" value={`${bestStreak}x`} tone="text-verb" />
            </div>
            {isNewBest && (
              <p className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-modifier">
                <Trophy className="h-3.5 w-3.5" /> Шинэ рекорд!
              </p>
            )}

            <div className="ce-scroll mt-4 max-h-44 overflow-y-auto rounded-xl border border-ink-600/80">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-ink-800 text-left text-[10px] uppercase tracking-wider text-mist-500">
                  <tr>
                    <th className="px-2 py-1.5">#</th>
                    <th className="px-2 py-1.5">Өгүүлбэр</th>
                    <th className="px-2 py-1.5 text-right">Оноо</th>
                  </tr>
                </thead>
                <tbody>
                  {log.map((r, i) => (
                    <tr key={i} className="border-t border-ink-600/60">
                      <td className="px-2 py-1.5 text-mist-500">{i + 1}</td>
                      <td className="px-2 py-1.5 font-mono text-mist-100">
                        {exampleSentence(r.puzzle)}
                        {r.usedTip && <span className="ml-1 text-[10px] text-warning">(tip)</span>}
                      </td>
                      <td className="px-2 py-1.5 text-right font-semibold text-success">+{r.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <GameButton onClick={startGame} autoFocus>
                <RotateCcw className="h-4 w-4" /> Дахин тоглох
              </GameButton>
              <GameButton onClick={quit} tone="ghost">
                Эхлэл рүү
              </GameButton>
            </div>
          </Overlay>
        )}
      </div>

      {/* ── Консол (доод самбар) ── */}
      {playing && puzzle && (
        <div
          className="shrink-0 border-t-2 bg-ink-900/95 px-3 py-3 backdrop-blur sm:px-5"
          style={{ borderTopColor: resolved ? '#3DDC97' : urgent ? '#FF6B7A' : 'rgba(79,140,255,0.6)' }}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="flex min-w-[220px] flex-1 items-center gap-2 text-sm text-mist-100">
              <span className="shrink-0 rounded-md bg-brand/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">Утга</span>
              <span>{puzzle.mn}</span>
            </p>
            <div className="ml-auto flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-mist-500">
                <Timer className="h-3 w-3" /> {wordCount(puzzle)} үг · {roundSeconds(puzzle)}с
              </span>
              <MuteButton compact />
              <button
                type="button"
                onClick={quit}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-600/80 bg-ink-900/80 text-mist-400 transition-colors hover:border-danger/60 hover:text-danger"
                aria-label="Болих"
                title="Болих"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-stretch gap-2">
            <div className={`min-w-0 flex-1 ${shaking ? 'sb-shake' : ''}`} onAnimationEnd={() => setShaking(false)}>
              <input
                ref={inputRef}
                type="text"
                defaultValue=""
                onChange={() => {
                  if (wrongMsg) setWrongMsg(null);
                }}
                onKeyDown={onKeyDown}
                disabled={resolved}
                autoComplete="off"
                autoCapitalize="sentences"
                spellCheck={false}
                placeholder="Үгсийг зөв дарааллаар бич..."
                className={`h-11 w-full rounded-xl border-2 bg-ink-950 px-3 font-mono text-base text-mist-50 outline-none transition-colors placeholder:text-mist-500 disabled:opacity-70 sm:h-12 sm:px-4 sm:text-lg ${
                  roundState === 'correct'
                    ? 'border-success'
                    : wrongMsg
                      ? 'border-danger'
                      : urgent
                        ? 'border-danger/70 focus:border-danger'
                        : 'border-ink-600 focus:border-brand'
                }`}
              />
            </div>
            {resolved ? (
              <GameButton onClick={goNext} className="shrink-0">
                {idx + 1 >= puzzles.length ? 'Туг!' : 'Үсрэх'} <Play className="h-4 w-4" />
              </GameButton>
            ) : (
              <>
                <GameButton onClick={submit} className="shrink-0 px-4">
                  <Check className="h-4 w-4" /> <span className="hidden sm:inline">Шалгах</span>
                </GameButton>
                <GameButton onClick={showTip} tone="warning" disabled={usedTip} className="shrink-0 px-3">
                  <Lightbulb className="h-4 w-4" /> <span className="hidden sm:inline">Tip</span>
                </GameButton>
              </>
            )}
          </div>

          <div className="mt-2 min-h-[20px] text-xs">
            {wrongMsg && !resolved && <p className="sb-pop text-danger">{wrongMsg}</p>}
            {!wrongMsg && usedTip && roundState === 'typing' && (
              <p className="sb-pop inline-flex flex-wrap items-center gap-1.5 text-warning">
                <Lightbulb className="h-3.5 w-3.5" /> Жишээ: <span className="font-mono text-mist-50">{exampleSentence(puzzle)}</span>
              </p>
            )}
            {roundState === 'correct' && (
              <p className="sb-pop inline-flex flex-wrap items-center gap-1.5 text-success">
                <Check className="h-3.5 w-3.5" /> Зөв! +{lastPoints} оноо{usedTip ? ' (Tip)' : ''}
                {streak >= 2 && <span className="text-verb"> · {streak}x combo</span>}
                <span className="text-mist-500"> · Робот дараагийн тавцан руу үсэрч байна...</span>
              </p>
            )}
            {!wrongMsg && !usedTip && roundState === 'typing' && (
              <p className="text-mist-500">Enter дарж шалгана · Блок дээр дарж үг нэмнэ, дахин дарвал хасна</p>
            )}
          </div>
          {/* Дэлгэц уншигчид зориулж үгсийг текстээр давтана */}
          <p className="sr-only">Үгс: {words.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

function Overlay({ children, tone = 'brand', wide = false }: { children: React.ReactNode; tone?: 'brand' | 'danger' | 'success'; wide?: boolean }) {
  const border = tone === 'danger' ? 'border-danger/50' : tone === 'success' ? 'border-success/50' : 'border-brand/40';
  const glow =
    tone === 'danger'
      ? 'shadow-[0_0_0_4px_rgba(255,107,122,0.12),0_24px_60px_rgba(0,0,0,0.6)]'
      : tone === 'success'
        ? 'shadow-[0_0_0_4px_rgba(61,220,151,0.12),0_24px_60px_rgba(0,0,0,0.6)]'
        : 'shadow-[0_0_0_4px_rgba(79,140,255,0.12),0_24px_60px_rgba(0,0,0,0.6)]';
  return (
    <div className="ce-scroll absolute inset-0 flex items-center justify-center overflow-y-auto bg-ink-950/45 p-3 backdrop-blur-[2px] sm:p-6">
      <div className={`sb-rise w-full ${wide ? 'max-w-xl' : 'max-w-md'} rounded-2xl border-2 ${border} bg-ink-900/95 p-5 ${glow} sm:p-7`}>{children}</div>
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

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-ink-600/70 bg-ink-800/70 px-2 py-2">
      <p className="text-[10px] uppercase tracking-wider text-mist-500">{label}</p>
      <p className={`mt-0.5 font-display text-xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
