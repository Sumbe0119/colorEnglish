// frontend/src/components/sentence-builder/sentence-builder-game.tsx
// "Өгүүлбэр бүтээх" тоглоом: 3 түлхүүр үг + монгол утга → бүтэн англи өгүүлбэр бич.
// Раунд бүр 30 сек. 2D дүрслэл (GameScene): робот баатар тавцангаас тавцан руу үсэрч бариа руу явна.
// Цаг багасах тусам таймер ногооноос улаан руу шилжиж, дэлгэцийн ирмэг улайна.
// Зөв бол салют буудна, чадахгүй бол Tip товч жишээ өгүүлбэр харуулна. Дуу чимээ WebAudio-оор.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  Flame,
  Lightbulb,
  PartyPopper,
  Play,
  RotateCcw,
  Timer,
  TimerOff,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  exampleSentence,
  isCorrectAnswer,
  loadBest,
  pickRoundPuzzles,
  POINTS_CORRECT,
  POINTS_WITH_TIP,
  ROUND_SECONDS,
  ROUNDS_PER_GAME,
  saveBestIfBetter,
  scoreFor,
  shuffledWords,
  type BestScore,
  type SentencePuzzle,
} from '@/lib/sentence-builder';
import { isMuted, setMuted, sfx, unlockAudio } from '@/lib/sentence-builder-sfx';
import { Fireworks } from './fireworks';
import { GameScene, type PlatformResult } from './game-scene';

type Phase = 'idle' | 'playing' | 'finished';
/** Нэг раундын төлөв: бичиж байна / зөв / цаг дууссан */
type RoundState = 'typing' | 'correct' | 'timeout';

type RoundLog = {
  puzzle: SentencePuzzle;
  state: Exclude<RoundState, 'typing'>;
  points: number;
  usedTip: boolean;
  answer: string;
};

const ROUND_MS = ROUND_SECONDS * 1000;
/** Зөв/цаг дууссаны дараа дараагийн раунд руу автоматаар шилжих хугацаа */
const AUTO_NEXT_MS = 2600;
const PREVIEW_WORDS = ['work', 'I', 'went'];

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

function MuteButton() {
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
      className="inline-flex items-center gap-1 rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 text-xs text-mist-400 transition-colors hover:text-mist-50"
      aria-label={muted ? 'Дуу нээх' : 'Дуу хаах'}
      title={muted ? 'Дуу нээх' : 'Дуу хаах'}
    >
      {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
      {muted ? 'Дуугүй' : 'Дуутай'}
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
  const [remainMs, setRemainMs] = useState(ROUND_MS);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const [log, setLog] = useState<RoundLog[]>([]);
  const [best, setBest] = useState<BestScore | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const startAtRef = useRef(0);
  const roundStateRef = useRef<RoundState>('typing');
  const usedTipRef = useRef(false);
  const streakRef = useRef(0);
  const lastTickSecRef = useRef(0);
  const autoNextRef = useRef<number | null>(null);
  roundStateRef.current = roundState;
  usedTipRef.current = usedTip;

  const puzzle = puzzles[idx] ?? null;
  const fraction = remainMs / ROUND_MS;
  const remainSec = Math.ceil(remainMs / 1000);
  const urgent = roundState === 'typing' && remainMs <= 5000;
  const results: PlatformResult[] = log.map((r) => r.state);

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
    setIdx(i);
    setWords(shuffledWords(list[i]));
    setRoundState('typing');
    roundStateRef.current = 'typing';
    // Оролт uncontrolled: DOM утгыг шууд цэвэрлэнэ (controlled байх үед 50мс таймерын
    // re-render Android IME-ийн бичилтийг тасалж, «a», «the» мэт богино үг алга болдог байсан).
    if (inputRef.current) inputRef.current.value = '';
    setUsedTip(false);
    usedTipRef.current = false;
    setWrongMsg(null);
    setLastPoints(0);
    setRemainMs(ROUND_MS);
    lastTickSecRef.current = ROUND_SECONDS;
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
    setPhase('playing');
    beginRound(list, 0);
  }, [beginRound]);

  const finishGame = useCallback(
    (finalLog: RoundLog[], finalScore: number) => {
      clearAutoNext();
      const correct = finalLog.filter((r) => r.state === 'correct').length;
      setIsNewBest(saveBestIfBetter({ score: finalScore, correct }));
      setBest(loadBest());
      setPhase('finished');
      if (correct >= Math.ceil(finalLog.length / 2)) {
        sfx.fanfare();
        onFinale();
      }
    },
    [onFinale],
  );

  const goNext = useCallback(() => {
    clearAutoNext();
    const nextIdx = idx + 1;
    if (nextIdx >= puzzles.length) {
      finishGame(log, score);
      return;
    }
    beginRound(puzzles, nextIdx);
  }, [beginRound, finishGame, idx, log, puzzles, score]);

  /** Раунд дууссан (зөв/цаг дууссан) → бүртгэл нэмээд хэсэг хугацааны дараа автоматаар дараагийн раунд. */
  const settleRound = useCallback(
    (state: Exclude<RoundState, 'typing'>, points: number, answer: string) => {
      if (!puzzle) return;
      setRoundState(state);
      roundStateRef.current = state;
      setLastPoints(points);
      setLog((prev) => [...prev, { puzzle, state, points, usedTip: usedTipRef.current, answer }]);
      if (state === 'correct') {
        setScore((s) => s + points);
        streakRef.current += 1;
        setStreak(streakRef.current);
        setBestStreak((b) => Math.max(b, streakRef.current));
        sfx.correct();
      } else {
        streakRef.current = 0;
        setStreak(0);
        sfx.timeout();
      }
    },
    [puzzle],
  );

  // Таймер: 50мс тутамд үлдсэн хугацааг шинэчилнэ; сүүлийн 5 секундэд тик дуугарна; 0 болоход цаг дууссан.
  useEffect(() => {
    if (phase !== 'playing' || roundState !== 'typing') return;
    const id = window.setInterval(() => {
      const remain = Math.max(0, ROUND_MS - (performance.now() - startAtRef.current));
      setRemainMs(remain);
      const sec = Math.ceil(remain / 1000);
      if (sec !== lastTickSecRef.current) {
        lastTickSecRef.current = sec;
        if (sec <= 5 && sec > 0) sfx.tick();
      }
      if (remain <= 0) {
        window.clearInterval(id);
        settleRound('timeout', 0, '');
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [phase, roundState, settleRound]);

  // Раунд шийдэгдсэний дараа автоматаар дараагийнх руу
  useEffect(() => {
    if (phase !== 'playing' || roundState === 'typing') return;
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
      const remain = Math.max(0, ROUND_MS - (performance.now() - startAtRef.current));
      settleRound('correct', scoreFor(remain, usedTipRef.current), value);
    } else {
      setShaking(true);
      setWrongMsg('Буруу байна. Үгсийн дараалал, to / a / the зэрэг жижиг үгсээ шалгаад дахин оролд.');
      sfx.wrong();
      inputRef.current?.focus();
    }
  }, [puzzle, settleRound]);

  const showTip = useCallback(() => {
    if (roundStateRef.current !== 'typing') return;
    setUsedTip(true);
    usedTipRef.current = true;
    sfx.tip();
    inputRef.current?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (roundState === 'typing') submit();
    else goNext();
  };

  // ───────────────────────── Эхлэх дэлгэц ─────────────────────────
  if (phase === 'idle') {
    return (
      <div className="space-y-4">
        <GameScene
          total={ROUNDS_PER_GAME}
          idx={0}
          results={[]}
          status="typing"
          fraction={1}
          remainSec={ROUND_SECONDS}
          words={PREVIEW_WORDS}
          streak={0}
          lastPoints={0}
          playing={false}
        />
        <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-4 shadow-card sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-display text-lg font-semibold text-mist-50">Бэлэн үү, {playerName}?</h2>
              <p className="mt-1 text-sm text-mist-400">
                Робот баатраа {ROUNDS_PER_GAME} тавцан дамжуулж туг руу хүргэ. Тавцан бүр нэг өгүүлбэр, {ROUND_SECONDS} секунд.
                Тэнгэрт хөвөх 3 үгээр бүтэн өгүүлбэрээ бич.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {best && (
                <div className="rounded-xl border border-modifier/30 bg-modifier/10 px-3 py-2 text-xs text-modifier">
                  <span className="inline-flex items-center gap-1.5">
                    <Trophy className="h-3.5 w-3.5" />
                    Шилдэг: {best.score} оноо · {best.correct}/{ROUNDS_PER_GAME} зөв
                  </span>
                </div>
              )}
              <MuteButton />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-ink-600/80 bg-ink-800/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-mist-500">Жишээ</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {PREVIEW_WORDS.map((w) => (
                <span key={w} className="rounded-lg border border-subject/40 bg-subject/10 px-3 py-1.5 font-mono text-sm font-semibold text-subject">
                  {w}
                </span>
              ))}
              <ArrowRight className="h-4 w-4 text-mist-500" />
              <span className="font-mono text-sm text-mist-50">I went to work.</span>
            </div>
            <p className="mt-2 text-xs text-mist-400">Монгол утга нь хамт харагдана: «Би ажилдаа явсан.»</p>
          </div>

          <div className="mt-5 grid gap-2 text-xs text-mist-400 sm:grid-cols-2">
            <p className="flex items-start gap-2">
              <Timer className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              Цаг багасах тусам таймер ногооноос улаан болж дэлгэц улайна. Хурдан хариулбал урамшууллын оноо нэмэгдэнэ.
            </p>
            <p className="flex items-start gap-2">
              <PartyPopper className="mt-0.5 h-3.5 w-3.5 shrink-0 text-modifier" />
              Зөв бол салют буудаж баатар дараагийн тавцан руу үсэрнэ. Дараалан зөв бол combo.
            </p>
            <p className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
              Чадахгүй бол Tip товч дарж жишээ өгүүлбэрийг хар. Tip ашигласан раунд {POINTS_WITH_TIP} оноо (ердийн {POINTS_CORRECT}+).
            </p>
            <p className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
              Том/жижиг үсэг, цэг таслал хамаагүй. Enter дарж хариулна.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={startGame}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              <Play className="h-4 w-4" />
              Тоглоом эхлэх
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────── Дүн ─────────────────────────
  if (phase === 'finished') {
    const correct = log.filter((r) => r.state === 'correct').length;
    return (
      <div className="space-y-4">
        <GameScene
          total={ROUNDS_PER_GAME}
          idx={ROUNDS_PER_GAME - 1}
          results={results}
          status={correct >= Math.ceil(log.length / 2) ? 'correct' : 'typing'}
          fraction={1}
          remainSec={0}
          words={[]}
          streak={0}
          lastPoints={score}
          playing={false}
        />
        <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-4 shadow-card sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-mist-500">Нийт оноо</p>
              <p className="mt-1 font-display text-5xl font-bold text-mist-50">
                {score}
                <span className="ml-2 text-lg font-medium text-mist-400">оноо</span>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-sm font-semibold text-success">
                  <Check className="h-4 w-4" />
                  {correct}/{log.length} зөв
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-verb/15 px-3 py-1 text-sm font-semibold text-verb">
                  <Flame className="h-4 w-4" />
                  Хамгийн урт combo: {bestStreak}
                </span>
                {isNewBest && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-modifier/15 px-3 py-1 text-sm font-semibold text-modifier">
                    <Trophy className="h-4 w-4" />
                    Шинэ рекорд!
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={startGame}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                <RotateCcw className="h-4 w-4" /> Дахин тоглох
              </button>
              <button
                type="button"
                onClick={() => setPhase('idle')}
                className="inline-flex items-center gap-2 rounded-xl border border-ink-600/80 bg-ink-800 px-5 py-2.5 text-sm text-mist-200 transition-colors hover:border-ink-500"
              >
                Эхлэл рүү
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-ink-600/80">
            <table className="w-full text-sm">
              <thead className="bg-ink-800/80 text-left text-[11px] uppercase tracking-wider text-mist-500">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Өгөгдсөн үгс</th>
                  <th className="px-3 py-2">Таны хариулт</th>
                  <th className="hidden px-3 py-2 sm:table-cell">Жишээ</th>
                  <th className="px-3 py-2 text-right">Оноо</th>
                </tr>
              </thead>
              <tbody>
                {log.map((r, i) => (
                  <tr key={i} className="border-t border-ink-600/60">
                    <td className="px-3 py-2 text-mist-500">{i + 1}</td>
                    <td className="px-3 py-2 font-mono text-xs text-subject">{r.puzzle.words.join(' · ')}</td>
                    <td className="px-3 py-2">
                      {r.state === 'correct' ? (
                        <span className="inline-flex items-center gap-1.5 text-success">
                          <Check className="h-3.5 w-3.5" /> {r.answer}
                          {r.usedTip && <span className="text-[10px] text-warning">(tip)</span>}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-danger">
                          <TimerOff className="h-3.5 w-3.5" /> цаг дууссан
                        </span>
                      )}
                    </td>
                    <td className="hidden px-3 py-2 font-mono text-xs text-mist-300 sm:table-cell">{exampleSentence(r.puzzle)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-mist-50">+{r.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────── Тоглож байна ─────────────────────────
  if (!puzzle) return null;
  const resolved = roundState !== 'typing';

  return (
    <div className="space-y-4">
      {/* Дээд мөр: оноо, combo, дуу, болих */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 text-mist-200">
          Оноо: <span className="font-semibold text-mist-50">{score}</span>
        </span>
        {streak >= 2 && (
          <span className="inline-flex items-center gap-1 rounded-full border border-verb/40 bg-verb/10 px-3 py-1.5 text-verb">
            <Flame className="h-3.5 w-3.5" /> {streak}x combo
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <MuteButton />
          <button
            type="button"
            onClick={() => {
              clearAutoNext();
              setPhase('idle');
            }}
            className="inline-flex items-center gap-1 rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 text-mist-400 transition-colors hover:text-mist-50"
          >
            <X className="h-3.5 w-3.5" /> Болих
          </button>
        </div>
      </div>

      <GameScene
        total={puzzles.length}
        idx={idx}
        results={results}
        status={roundState}
        fraction={fraction}
        remainSec={remainSec}
        words={words}
        streak={streak}
        lastPoints={lastPoints}
        playing
      />
      {/* Дэлгэц уншигчид зориулж үгсийг текстээр давтана */}
      <p className="sr-only">Үгс: {words.join(', ')}</p>

      <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-4 shadow-card sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-mist-500">Тэнгэрт хөвөх 3 үгээр өгүүлбэр бүтээ</p>
          <p className="font-mono text-xs text-subject">{words.join(' · ')}</p>
        </div>
        <p className="mt-2 text-sm text-mist-300">
          <span className="text-mist-500">Утга:</span> {puzzle.mn}
        </p>

        {/* Оролт */}
        <div className="mt-4">
          <div className={shaking ? 'sb-shake' : ''} onAnimationEnd={() => setShaking(false)}>
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
              placeholder="Өгүүлбэрээ энд бич..."
              className={`w-full rounded-xl border bg-ink-800 px-4 py-3 font-mono text-base text-mist-50 outline-none transition-colors placeholder:text-mist-500 disabled:opacity-70 sm:text-lg ${
                roundState === 'correct'
                  ? 'border-success'
                  : roundState === 'timeout' || wrongMsg
                    ? 'border-danger'
                    : urgent
                      ? 'border-danger/70 focus:border-danger'
                      : 'border-ink-600 focus:border-brand'
              }`}
            />
          </div>
          {wrongMsg && !resolved && <p className="mt-2 text-xs text-danger">{wrongMsg}</p>}

          {usedTip && roundState === 'typing' && (
            <div className="sb-pop mt-3 flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 px-3 py-2.5 text-sm">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <div>
                <p className="text-xs text-warning">Жишээ өгүүлбэр</p>
                <p className="font-mono text-mist-50">{exampleSentence(puzzle)}</p>
              </div>
            </div>
          )}

          {roundState === 'correct' && (
            <div className="sb-pop mt-3 flex items-center gap-3 rounded-xl border border-success/40 bg-success/10 px-4 py-3">
              <PartyPopper className="h-6 w-6 shrink-0 text-success" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-semibold text-success">Баяр хүргэе, зөв байна! 🎉</p>
                <p className="text-xs text-mist-300">
                  +{lastPoints} оноо{usedTip ? ' (Tip ашигласан)' : ''} · Жишээ: <span className="font-mono">{exampleSentence(puzzle)}</span>
                </p>
              </div>
            </div>
          )}

          {roundState === 'timeout' && (
            <div className="sb-pop mt-3 flex items-center gap-3 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3">
              <TimerOff className="h-6 w-6 shrink-0 text-danger" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-semibold text-danger">Цаг дууслаа</p>
                <p className="text-xs text-mist-300">
                  Зөв хариулт: <span className="font-mono text-mist-50">{exampleSentence(puzzle)}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Товчнууд */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {resolved ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              {idx + 1 >= puzzles.length ? 'Дүн харах' : 'Дараагийнх'} <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={submit}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                <Check className="h-4 w-4" /> Шалгах
              </button>
              <button
                type="button"
                onClick={showTip}
                disabled={usedTip}
                className="inline-flex items-center gap-2 rounded-xl border border-warning/50 bg-warning/10 px-4 py-2.5 text-sm font-medium text-warning transition-colors hover:bg-warning/20 disabled:cursor-default disabled:opacity-60"
              >
                <Lightbulb className="h-4 w-4" /> Tip
              </button>
              <span className="text-[11px] text-mist-500">Enter дарж шалгана. Tip авбал {POINTS_WITH_TIP} оноо.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
