// frontend/src/components/sentence-builder/sentence-builder-game.tsx
// "Өгүүлбэр бүтээх" — бүтэн хуудас 2D тоглоом. Canvas дүрслэл (GameScene) дэлгэцийг дүүргэж,
// доор нь тоглоомын консол (утга, оролт, товч), дээр нь эхлэх / game over / ялалтын давхарга.
// Өгүүлбэрийн бүх үг холигдож тэнгэрт хөвнө (a / the / to орсон); монгол утга нь блокуудын дээр бичигдэнэ.
// Тоглогч блок дээр дарж доод хэсгийн хоосон нүднүүдэд зөв дарааллаар оруулна (гар шаардлагагүй);
// хүсвэл «Гараар бичих» товчоор текст оролт нээж бичиж болно.
// Раунд бүр 5 → 8 үг болж хүндэрнэ, цаг нь үгийн тоогоор уртасна (үг бүрт +3с).
// Цаг дуусвал тавцан хагарч робот унана → GAME OVER. 10 тавцан давбал туг → ЯЛАЛТ.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check,
  Flame,
  Keyboard,
  LayoutGrid,
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
  LEVEL_COUNT,
  levelInfo,
  loadBest,
  loadMasteredLocal,
  masteryByLevel,
  normalizeSentence,
  pickRoundPuzzles,
  POINTS_WITH_TIP,
  puzzleKey,
  ROUNDS_PER_GAME,
  roundSeconds,
  saveBestIfBetter,
  saveMasteredLocal,
  scoreFor,
  SENTENCE_PUZZLES,
  shuffledWords,
  wordCount,
  type BestScore,
  type SentencePuzzle,
} from '@/lib/sentence-builder';
import { isMuted, setMuted, sfx, unlockAudio } from '@/lib/sentence-builder-sfx';
import { addSentenceMastery, fetchSentenceMastery, resetSentenceMastery, submitGameScore, type SubmitScoreResult } from '@/lib/games-services';
import { LeaderboardPanel } from '@/components/games/leaderboard';
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
  /** Tip-гүй, буруу оролдлогогүй зөв хариулсан → эзэмшсэн, дахин харуулахгүй */
  clean: boolean;
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
  /** Доод хэсгийн нүднүүдэд оруулсан үгс (дарааллаараа) — блок горимын хариулт */
  const [chosen, setChosen] = useState<string[]>([]);
  /** true бол текст оролт нээгдэж, тоглогч гараар бичнэ */
  const [manual, setManual] = useState(false);
  /** Эзэмшсэн өгүүлбэрийн тоо (эхлэх дэлгэц) */
  const [masteredCount, setMasteredCount] = useState(0);
  /** Серверт бүртгэгдсэн оноо: байр, шинэ рекорд эсэх */
  const [serverResult, setServerResult] = useState<SubmitScoreResult | null>(null);
  /** Оноо илгээсний дараа leaderboard-ийг дахин ачаалах түлхүүр */
  const [lbRefresh, setLbRefresh] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const chosenRef = useRef<string[]>([]);
  const manualRef = useRef(false);
  const autoCheckRef = useRef<number | null>(null);
  /** Эзэмшсэн өгүүлбэрүүдийн түлхүүр (localStorage + сервер нэгтгэсэн) */
  const masteredRef = useRef<Set<string>>(new Set());
  /** Энэ раундад буруу хариулсан тоо — 0 бол "асуудалгүй" */
  const wrongAttemptsRef = useRef(0);
  manualRef.current = manual;
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
    // Эзэмшсэн өгүүлбэрүүд: эхлээд localStorage, дараа нь серверийнхтэй нэгтгэнэ
    const local = loadMasteredLocal();
    masteredRef.current = local;
    setMasteredCount(local.size);
    let cancelled = false;
    fetchSentenceMastery()
      .then((res) => {
        if (cancelled) return;
        const merged = new Set([...local, ...res.keys]);
        masteredRef.current = merged;
        saveMasteredLocal(merged);
        setMasteredCount(merged.size);
        // Серверт байхгүй локал түлхүүрүүдийг илгээнэ (өөр төхөөрөмж дээр ч алгасагдана)
        const missing = [...local].filter((k) => !res.keys.includes(k));
        if (missing.length) {
          void addSentenceMastery(missing.slice(0, 50).map((key) => ({ key }))).catch(() => undefined);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  /** Асуудалгүй зөв хариулсан өгүүлбэрийг эзэмшсэнд тооцно (локал + сервер). */
  const markMastered = useCallback((pz: SentencePuzzle) => {
    const key = puzzleKey(pz);
    if (masteredRef.current.has(key)) return;
    const next = new Set(masteredRef.current);
    next.add(key);
    masteredRef.current = next;
    saveMasteredLocal(next);
    setMasteredCount(next.size);
    void addSentenceMastery([{ key, level: pz.level ?? 0 }]).catch(() => undefined);
  }, []);

  /** Эзэмшсэн өгүүлбэрүүдийг цэвэрлэж бүх өгүүлбэрийг дахин харуулна. */
  const resetMastered = useCallback(async () => {
    masteredRef.current = new Set();
    saveMasteredLocal(masteredRef.current);
    setMasteredCount(0);
    await resetSentenceMastery().catch(() => undefined);
  }, []);

  const clearAutoNext = () => {
    if (autoNextRef.current != null) {
      window.clearTimeout(autoNextRef.current);
      autoNextRef.current = null;
    }
  };
  const clearAutoCheck = () => {
    if (autoCheckRef.current != null) {
      window.clearTimeout(autoCheckRef.current);
      autoCheckRef.current = null;
    }
  };

  /** Нүднүүдийн үгсийг state + ref хоёуланд нь бичнэ (ref-ийг таймер/canvas шууд уншина). */
  const setChosenBoth = useCallback((next: string[]) => {
    chosenRef.current = next;
    setChosen(next);
  }, []);

  /** Одоогийн хариулт: гараар бичих горимд оролтын утга, бусад үед нүднүүдэд оруулсан үгс. */
  const currentAnswer = useCallback(() => (manualRef.current ? (inputRef.current?.value ?? '') : chosenRef.current.join(' ')), []);

  const beginRound = useCallback(
    (list: SentencePuzzle[], i: number) => {
      clearAutoNext();
      clearAutoCheck();
      const pz = list[i];
      const ms = roundSeconds(pz) * 1000;
      setIdx(i);
      setWords(shuffledWords(pz));
      setRoundState('typing');
      roundStateRef.current = 'typing';
      wrongAttemptsRef.current = 0;
      setChosenBoth([]);
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
      if (manualRef.current) window.setTimeout(() => inputRef.current?.focus(), 30);
    },
    [setChosenBoth],
  );

  const startGame = useCallback(() => {
    unlockAudio();
    const list = pickRoundPuzzles(ROUNDS_PER_GAME, masteredRef.current);
    setPuzzles(list);
    setScore(0);
    setStreak(0);
    streakRef.current = 0;
    setBestStreak(0);
    setLog([]);
    setIsNewBest(false);
    setServerResult(null);
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
      // Leaderboard: оноог серверт бүртгэнэ (амжилтгүй бол чимээгүй — тоглоом үргэлжилнэ)
      submitGameScore('SENTENCE_BUILDER', finalScore, {
        correct,
        won,
        clean: finalLog.filter((r) => r.clean).length,
        maxLevel: finalLog.filter((r) => r.state === 'correct').length,
      })
        .then((res) => {
          setServerResult(res);
          setLbRefresh((k) => k + 1);
        })
        .catch(() => undefined);
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
      const clean = !usedTipRef.current && wrongAttemptsRef.current === 0;
      if (clean) markMastered(puzzle);
      setLog((prev) => [...prev, { puzzle, state: 'correct', points, usedTip: usedTipRef.current, answer, clean }]);
      setScore((s) => s + points);
      streakRef.current += 1;
      setStreak(streakRef.current);
      setBestStreak((b) => Math.max(b, streakRef.current));
      sfx.correct();
    },
    [markMastered, puzzle],
  );

  /** Цаг дууссан → робот унана, тоглоом дуусна. */
  const fail = useCallback(() => {
    if (!puzzle) return;
    clearAutoCheck();
    const finalLog: RoundLog[] = [...log, { puzzle, state: 'fall', points: 0, usedTip: usedTipRef.current, answer: currentAnswer(), clean: false }];
    setLog(finalLog);
    streakRef.current = 0;
    setStreak(0);
    setRemainMs(0);
    sfx.timeout();
    finishGame(finalLog, score, false);
  }, [currentAnswer, finishGame, log, puzzle, score]);

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
    clearAutoCheck();
    const value = currentAnswer().trim();
    if (!value) {
      if (manualRef.current) inputRef.current?.focus();
      return;
    }
    if (isCorrectAnswer(puzzle, value)) {
      const remain = Math.max(0, roundMsRef.current - (performance.now() - startAtRef.current));
      settleCorrect(scoreFor(puzzle, remain, usedTipRef.current), value);
    } else {
      wrongAttemptsRef.current += 1;
      setShaking(true);
      setWrongMsg(answerHint(puzzle, value));
      sfx.wrong();
      if (manualRef.current) inputRef.current?.focus();
    }
  }, [currentAnswer, puzzle, settleCorrect]);

  const showTip = useCallback(() => {
    if (roundStateRef.current !== 'typing') return;
    setUsedTip(true);
    usedTipRef.current = true;
    sfx.tip();
    if (manualRef.current) inputRef.current?.focus();
  }, []);

  /**
   * Canvas дээрх үгийн блок дарахад: шинэ үг нэмэх, ашигласан үгийг буцаах.
   * Блок горимд доод хэсгийн нүднүүдэд ордог; бүх нүд дүүрвэл автоматаар шалгана.
   * Гараар бичих горимд текст оролт руу бичигдэнэ.
   */
  const onWordTap = useCallback(
    (word: string, used: boolean, pointerType: string) => {
      if (roundStateRef.current !== 'typing') return;
      if (!manualRef.current) {
        const list = [...chosenRef.current];
        if (used) {
          const n = normalizeSentence(word);
          for (let i = list.length - 1; i >= 0; i--) {
            if (normalizeSentence(list[i]) === n) {
              list.splice(i, 1);
              break;
            }
          }
        } else {
          list.push(word);
          sfx.tick();
        }
        setChosenBoth(list);
        setWrongMsg(null);
        clearAutoCheck();
        if (!used && puzzle && list.length >= wordCount(puzzle)) {
          // Сүүлийн нүд дүүрсэн — нүд зурагдсаны дараа шалгана (хэрэв тэр хооронд өөрчлөгдөөгүй бол)
          autoCheckRef.current = window.setTimeout(() => {
            autoCheckRef.current = null;
            if (chosenRef.current === list) submit();
          }, 180);
        }
        return;
      }
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
    },
    [puzzle, setChosenBoth, submit],
  );

  /** Доод хэсгийн нүдэн дээр дарахад тэр үгийг хасна (блок дахин идэвхжинэ). */
  const removeSlot = useCallback(
    (i: number) => {
      if (roundStateRef.current !== 'typing') return;
      clearAutoCheck();
      setChosenBoth(chosenRef.current.filter((_, k) => k !== i));
      setWrongMsg(null);
    },
    [setChosenBoth],
  );

  /** «Гараар бичих» ↔ «Блокоор» горим солих; бичсэн/оруулсан үгсийг хооронд нь шилжүүлнэ. */
  const toggleManual = useCallback(() => {
    if (roundStateRef.current !== 'typing') return;
    clearAutoCheck();
    setWrongMsg(null);
    if (manualRef.current) {
      // Гараар бичсэн үгсээс блокт байгаа үгсийг нүднүүд рүү буцаана
      const avail = [...words];
      const list: string[] = [];
      for (const tok of (inputRef.current?.value ?? '').split(/\s+/).filter(Boolean)) {
        const n = normalizeSentence(tok);
        const k = avail.findIndex((w) => normalizeSentence(w) === n);
        if (k >= 0) {
          list.push(avail[k]);
          avail.splice(k, 1);
        }
      }
      setChosenBoth(list);
      manualRef.current = false;
      setManual(false);
    } else {
      manualRef.current = true;
      setManual(true);
      // Оролт mount болсны дараа фокуслоно (defaultValue-д нүднүүдийн үгс орно)
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [setChosenBoth, words]);

  const getTyped = currentAnswer;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (roundState === 'typing') submit();
    else goNext();
  };

  const quit = () => {
    clearAutoNext();
    clearAutoCheck();
    setChosenBoth([]);
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
          meaning={playing && puzzle ? puzzle.mn : undefined}
          streak={streak}
          score={score}
          lastPoints={lastPoints}
          playing={phase !== 'idle'}
          getTyped={getTyped}
          onWordTap={onWordTap}
        />

        {/* ── Эхлэх дэлгэц ── */}
        {phase === 'idle' && (
          <Overlay wide>
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Color English · Game</p>
            <h1 className="mt-2 text-center font-display text-3xl font-bold tracking-wide text-mist-50 sm:text-4xl">ӨГҮҮЛБЭР БҮТЭЭХ</h1>
            <p className="mt-3 text-center text-sm text-mist-300">
              Бэлэн үү, <span className="font-semibold text-mist-50">{playerName}</span>? Роботоо {ROUNDS_PER_GAME} тавцан давуул.
            </p>

            {/* Дүрэм — богино, нэг мөрт */}
            <div className="mt-4 grid gap-1.5 text-xs text-mist-300 sm:grid-cols-2">
              <Rule icon={<MousePointerClick className="h-3.5 w-3.5 text-subject" />}>Үгсийг зөв дарааллаар дарж өгүүлбэр бүтээ.</Rule>
              <Rule icon={<Flame className="h-3.5 w-3.5 text-verb" />}>Тавцан бүр нэг level (1–{LEVEL_COUNT}) — улам хүндэрнэ.</Rule>
              <Rule icon={<Skull className="h-3.5 w-3.5 text-danger" />}>Цаг дуусвал робот унана. Tip = {POINTS_WITH_TIP} оноо.</Rule>
              <Rule icon={<Check className="h-3.5 w-3.5 text-success" />}>Алдаагүй бүтээсэн өгүүлбэр дахин ирэхгүй.</Rule>
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

            {/* Эзэмшсэн өгүүлбэрийн явц — level бүрээр */}
            <div className="mt-4 rounded-xl border border-ink-600/70 bg-ink-800/50 px-3 py-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold uppercase tracking-wider text-mist-400">Эзэмшсэн өгүүлбэр</span>
                <span className="font-mono text-mist-200">
                  {masteredCount}/{SENTENCE_PUZZLES.length}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-10 gap-1" aria-label="Level бүрийн явц">
                {masteryByLevel(masteredRef.current).map((lv) => {
                  const k = lv.total ? lv.done / lv.total : 0;
                  return (
                    <div key={lv.level} className="text-center" title={`Level ${lv.level}: ${lv.done}/${lv.total}`}>
                      <div className="h-7 w-full overflow-hidden rounded-md bg-ink-900">
                        <div className="w-full bg-success/70" style={{ height: `${Math.round(k * 100)}%`, marginTop: `${Math.round((1 - k) * 100)}%` }} />
                      </div>
                      <span className="text-[9px] text-mist-500">{lv.level}</span>
                    </div>
                  );
                })}
              </div>
              {masteredCount > 0 && (
                <button type="button" onClick={() => void resetMastered()} className="mt-1.5 text-[10px] text-mist-500 underline-offset-2 hover:text-danger hover:underline">
                  Эзэмшсэнийг цэвэрлэж бүх өгүүлбэрийг дахин харуулах
                </button>
              )}
            </div>

            <LeaderboardPanel scope="SENTENCE_BUILDER" limit={5} compact refreshKey={lbRefresh} className="mt-3" />
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
            <p className="mt-2 text-center text-sm text-mist-300">
              Робот level {idx + 1}-ийн тавцангаас унав. Цаг дуусахаас өмнө өгүүлбэрээ бүтээгээрэй!
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Stat label="Оноо" value={String(score)} tone="text-mist-50" />
              <Stat label="Level" value={`${correctCount}/${ROUNDS_PER_GAME}`} tone="text-success" />
              <Stat label="Combo" value={`${bestStreak}x`} tone="text-verb" />
            </div>
            {isNewBest && (
              <p className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-modifier">
                <Trophy className="h-3.5 w-3.5" /> Шинэ рекорд!
              </p>
            )}
            {serverResult && (
              <p className="mt-2 text-center text-xs text-mist-300">
                Leaderboard: <span className="font-mono font-semibold text-brand">#{serverResult.rank}</span> · шилдэг {serverResult.best} оноо ·{' '}
                {serverResult.plays} тоглолт
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
            <LeaderboardPanel scope="SENTENCE_BUILDER" limit={5} compact refreshKey={lbRefresh} className="mt-4" />
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
              <Stat label="Level" value={`${correctCount}/${ROUNDS_PER_GAME}`} tone="text-success" />
              <Stat label="Combo" value={`${bestStreak}x`} tone="text-verb" />
            </div>
            {isNewBest && (
              <p className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-modifier">
                <Trophy className="h-3.5 w-3.5" /> Шинэ рекорд!
              </p>
            )}
            {serverResult && (
              <p className="mt-2 text-center text-xs text-mist-300">
                Leaderboard: <span className="font-mono font-semibold text-brand">#{serverResult.rank}</span> · шилдэг {serverResult.best} оноо ·{' '}
                {serverResult.plays} тоглолт
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
                        {r.clean && <span className="ml-1 text-[10px] text-success">✓ эзэмшсэн</span>}
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
            <LeaderboardPanel scope="SENTENCE_BUILDER" limit={5} compact refreshKey={lbRefresh} className="mt-4" />
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
            <p className="flex items-center gap-2 text-xs text-mist-400">
              <span className="shrink-0 rounded-md bg-brand/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                Level {idx + 1}
              </span>
              <span className="hidden text-[11px] text-mist-300 sm:inline" title={levelInfo(idx + 1).grammar}>
                {levelInfo(idx + 1).title}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-mist-500">
                <Timer className="h-3 w-3" /> {wordCount(puzzle)} үг · {roundSeconds(puzzle)}с{manual ? ' · гараар' : ''}
              </span>
            </p>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={toggleManual}
                disabled={resolved}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors disabled:opacity-50 ${
                  manual
                    ? 'border-brand/60 bg-brand/15 text-brand hover:bg-brand/25'
                    : 'border-ink-600/80 bg-ink-900/80 text-mist-400 hover:border-ink-500 hover:text-mist-50'
                }`}
                aria-pressed={manual}
                title={manual ? 'Блок дарж оруулах горим руу буцах' : 'Гараар бичих'}
              >
                {manual ? <LayoutGrid className="h-4 w-4" /> : <Keyboard className="h-4 w-4" />}
                <span className="hidden sm:inline">{manual ? 'Блокоор' : 'Гараар бичих'}</span>
              </button>
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

          {/* Жижиг дэлгэцэд нүднүүд бүтэн мөр эзэлж, товчнууд доор нь орно; sm-ээс дээш нэг мөрөнд */}
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <div className={`min-w-0 flex-1 ${shaking ? 'sb-shake' : ''}`} onAnimationEnd={() => setShaking(false)}>
              {manual ? (
                <input
                  ref={inputRef}
                  type="text"
                  defaultValue={chosen.join(' ')}
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
              ) : (
                <SlotRow
                  count={wordCount(puzzle)}
                  chosen={chosen}
                  onRemove={removeSlot}
                  disabled={resolved}
                  tone={roundState === 'correct' ? 'success' : wrongMsg ? 'danger' : urgent ? 'urgent' : 'normal'}
                />
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              {resolved ? (
                <GameButton onClick={goNext} className="flex-1 sm:flex-none">
                  {idx + 1 >= puzzles.length ? 'Туг!' : 'Үсрэх'} <Play className="h-4 w-4" />
                </GameButton>
              ) : (
                <>
                  <GameButton onClick={submit} className="flex-1 px-4 sm:flex-none">
                    <Check className="h-4 w-4" /> Шалгах
                  </GameButton>
                  <GameButton onClick={showTip} tone="warning" disabled={usedTip} className="px-3">
                    <Lightbulb className="h-4 w-4" /> Tip
                  </GameButton>
                </>
              )}
            </div>
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
              <p className="text-mist-500">
                {manual
                  ? 'Enter дарж шалгана · Блок дээр дарвал үг нэмэгдэнэ, дахин дарвал хасагдана'
                  : 'Үгийн блок дээр дарж нүдэнд зөв дарааллаар оруул · Нүдэн дээр дарвал хасна · Дүүрвэл шууд шалгана'}
              </p>
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
    // m-auto: контент өндөр болоход дээд хэсэг нь тасрахгүй (flex items-center-ийн оронд margin-аар голлуулна)
    <div className="ce-scroll absolute inset-0 flex overflow-y-auto bg-ink-950/45 p-3 backdrop-blur-[2px] sm:p-6">
      <div className={`sb-rise m-auto w-full ${wide ? 'max-w-xl' : 'max-w-md'} rounded-2xl border-2 ${border} bg-ink-900/95 p-5 ${glow} sm:p-7`}>{children}</div>
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

/**
 * Өгүүлбэрийн хоосон нүднүүд (доод хэсэг). Тоглогчийн дарсан үгс дарааллаараа нүд дүүргэнэ;
 * дүүрсэн нүдэн дээр дарвал тэр үг хасагдана. Дараагийн хоосон нүд анивчина.
 */
function SlotRow({
  count,
  chosen,
  onRemove,
  disabled,
  tone,
}: {
  count: number;
  chosen: string[];
  onRemove: (i: number) => void;
  disabled: boolean;
  tone: 'normal' | 'urgent' | 'danger' | 'success';
}) {
  const border =
    tone === 'success' ? 'border-success' : tone === 'danger' ? 'border-danger' : tone === 'urgent' ? 'border-danger/70' : 'border-ink-600';
  return (
    <div
      role="list"
      aria-label="Өгүүлбэрийн нүднүүд"
      className={`flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-xl border-2 bg-ink-950 px-2 py-1.5 transition-colors sm:min-h-[48px] ${border}`}
    >
      {Array.from({ length: count }, (_, i) => {
        const word = chosen[i];
        if (word != null) {
          return (
            <button
              key={`${i}-${word}`}
              type="button"
              role="listitem"
              onClick={() => onRemove(i)}
              disabled={disabled}
              title="Хасах"
              aria-label={`${word} — хасах`}
              className={`sb-pop inline-flex h-8 items-center rounded-lg border px-2.5 font-mono text-sm transition-colors disabled:cursor-default ${
                tone === 'success'
                  ? 'border-success/70 bg-success/15 text-mist-50'
                  : 'border-subject bg-subject-dim text-mist-50 hover:border-danger hover:bg-danger/15'
              }`}
            >
              {word}
            </button>
          );
        }
        const next = i === chosen.length && !disabled;
        return (
          <span
            key={i}
            role="listitem"
            aria-label={`${i + 1}-р нүд хоосон`}
            className={`inline-flex h-8 min-w-[46px] items-center justify-center rounded-lg border border-dashed text-[10px] font-semibold ${
              next ? 'sb-blink border-brand text-brand' : 'border-ink-500 text-mist-500'
            }`}
          >
            {i + 1}
          </span>
        );
      })}
    </div>
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
