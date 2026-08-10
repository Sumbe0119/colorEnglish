// frontend/src/components/reading/lane-race-game.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Press_Start_2P } from 'next/font/google';
import { UserReadingWord } from '@/lib/reading-services';
import { speakEnglishWord } from '@/components/reading/reading-utils';

const pixel = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const FALLBACK = ['байх', 'явдаг', 'том', 'жижиг', 'хурдан', 'удаан', 'сайхан', 'муу'];
const TIMER_MS = 5000;
const LANES = 3;

/** Trauma-lane palette */
const C = {
  purple: '#9B7BC4',
  purpleDeep: '#6B4F8C',
  purpleDark: '#4A3566',
  teal: '#3DB8A8',
  tealSoft: '#5ECFC0',
  green: '#6BCF6B',
  road: '#5A5A5A',
  roadDark: '#3D3D3D',
  ink: '#1A1224',
  white: '#FFFFFF',
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildLaneMeanings(correct: string, pool: string[]): string[] {
  const others = shuffle(
    [...new Set([...pool, ...FALLBACK])].filter(
      (m) => m.toLowerCase() !== correct.toLowerCase(),
    ),
  ).slice(0, 2);
  while (others.length < 2) others.push(`сонголт ${others.length + 1}`);
  return shuffle([correct, ...others]);
}

type Phase = 'ready' | 'racing' | 'paused' | 'won' | 'lost' | 'done';

function AmbulanceSprite({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 32 44"
      className="drop-shadow-md"
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      {/* body */}
      <rect x="6" y="10" width="20" height="28" fill="#F5F5F5" />
      <rect x="8" y="4" width="16" height="8" fill="#F5F5F5" />
      {/* windshield */}
      <rect x="10" y="6" width="12" height="5" fill="#7EC8E3" />
      {/* red cross */}
      <rect x="14" y="18" width="4" height="12" fill="#E53935" />
      <rect x="10" y="22" width="12" height="4" fill="#E53935" />
      {/* lights */}
      <rect x="10" y="2" width="5" height="3" fill="#E53935" />
      <rect x="17" y="2" width="5" height="3" fill="#42A5F5" />
      {/* wheels */}
      <rect x="4" y="14" width="3" height="6" fill="#222" />
      <rect x="25" y="14" width="3" height="6" fill="#222" />
      <rect x="4" y="28" width="3" height="6" fill="#222" />
      <rect x="25" y="28" width="3" height="6" fill="#222" />
      {/* bumper */}
      <rect x="8" y="38" width="16" height="3" fill="#CFCFCF" />
    </svg>
  );
}

export function LaneRaceGame({
  words,
  onComplete,
}: {
  words: UserReadingWord[];
  onComplete: () => void | Promise<void>;
}) {
  const meanings = useMemo(() => words.map((w) => w.meaningMn), [words]);
  const [index, setIndex] = useState(0);
  const [lane, setLane] = useState(1);
  const [phase, setPhase] = useState<Phase>('ready');
  const [progress, setProgress] = useState(0);
  const [laneLabels, setLaneLabels] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const pausedAtRef = useRef(0);
  const elapsedBeforePauseRef = useRef(0);
  const laneRef = useRef(1);
  const labelsRef = useRef<string[]>([]);
  const phaseRef = useRef<Phase>('ready');
  const startRoundRef = useRef<(wordIndex: number) => void>(() => {});

  const current = words[index];

  const stopLoop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const startRound = useCallback(
    (wordIndex: number) => {
      const word = words[wordIndex];
      if (!word) return;
      const labels = buildLaneMeanings(word.meaningMn, meanings);
      setLaneLabels(labels);
      labelsRef.current = labels;
      setLane(1);
      laneRef.current = 1;
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      setPhase('racing');
      phaseRef.current = 'racing';
      speakEnglishWord(word.word);
      startRef.current = performance.now();

      const settle = () => {
        const chosen = labelsRef.current[laneRef.current];
        if (chosen === word.meaningMn) {
          setPhase('won');
          phaseRef.current = 'won';
          setScore((s) => s + 1);
          const next = wordIndex + 1;
          if (next >= words.length) {
            setPhase('done');
            phaseRef.current = 'done';
            setSubmitting(true);
            void Promise.resolve(onComplete()).finally(() => setSubmitting(false));
          } else {
            setTimeout(() => {
              setIndex(next);
              startRoundRef.current(next);
            }, 700);
          }
        } else {
          setPhase('lost');
          phaseRef.current = 'lost';
        }
      };

      const tick = (now: number) => {
        if (phaseRef.current !== 'racing') return;
        const elapsed = elapsedBeforePauseRef.current + (now - startRef.current);
        const p = Math.min(1, elapsed / TIMER_MS);
        setProgress(p);
        if (p >= 1) {
          stopLoop();
          settle();
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      stopLoop();
      rafRef.current = requestAnimationFrame(tick);
    },
    [meanings, onComplete, words],
  );

  startRoundRef.current = startRound;

  const resumeRacing = useCallback(() => {
    const word = words[index];
    if (!word) return;
    setPhase('racing');
    phaseRef.current = 'racing';
    startRef.current = performance.now();

    const settle = () => {
      const chosen = labelsRef.current[laneRef.current];
      if (chosen === word.meaningMn) {
        setPhase('won');
        phaseRef.current = 'won';
        setScore((s) => s + 1);
        const next = index + 1;
        if (next >= words.length) {
          setPhase('done');
          phaseRef.current = 'done';
          setSubmitting(true);
          void Promise.resolve(onComplete()).finally(() => setSubmitting(false));
        } else {
          setTimeout(() => {
            setIndex(next);
            startRoundRef.current(next);
          }, 700);
        }
      } else {
        setPhase('lost');
        phaseRef.current = 'lost';
      }
    };

    const tick = (now: number) => {
      if (phaseRef.current !== 'racing') return;
      const elapsed = elapsedBeforePauseRef.current + (now - startRef.current);
      const p = Math.min(1, elapsed / TIMER_MS);
      setProgress(p);
      if (p >= 1) {
        stopLoop();
        settle();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    stopLoop();
    rafRef.current = requestAnimationFrame(tick);
  }, [index, onComplete, words]);

  const togglePause = () => {
    if (phase === 'racing') {
      stopLoop();
      pausedAtRef.current = performance.now();
      elapsedBeforePauseRef.current += pausedAtRef.current - startRef.current;
      setPhase('paused');
      phaseRef.current = 'paused';
      return;
    }
    if (phase === 'paused') {
      resumeRacing();
    }
  };

  useEffect(() => () => stopLoop(), []);

  useEffect(() => {
    laneRef.current = lane;
  }, [lane]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== 'racing' && phase !== 'paused') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setLane((l) => Math.max(0, l - 1));
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setLane((l) => Math.min(LANES - 1, l + 1));
      }
      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index]);

  if (!current) return null;

  /** Ambulance travels from ~8% to ~62% (just above barriers) */
  const ambulanceTop = `${8 + progress * 54}%`;
  const secsLeft = Math.max(0, Math.ceil((1 - progress) * 5));
  const showTrack = phase !== 'ready';

  return (
    <div
      className={`${pixel.className} mx-auto w-full max-w-md overflow-hidden border-4 shadow-xl`}
      style={{
        borderColor: C.purpleDeep,
        background: C.purple,
        imageRendering: 'pixelated',
      }}
    >
      {/* Header */}
      <div
        className="relative flex items-center justify-center px-3 py-3"
        style={{ background: C.purple }}
      >
        <h2
          className="text-center text-[13px] leading-tight tracking-wide text-white sm:text-[15px]"
          style={{ textShadow: '2px 2px 0 #4A3566' }}
        >
          ҮГИЙН ЛЭЙН
        </h2>
        {(phase === 'racing' || phase === 'paused') && (
          <button
            type="button"
            onClick={togglePause}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center border-2 border-white/80 bg-white/20 text-white"
            title={phase === 'paused' ? 'Үргэлжлүүлэх' : 'Түр зогсоох'}
            aria-label="Pause"
          >
            {phase === 'paused' ? (
              <span className="text-[10px]">▶</span>
            ) : (
              <span className="flex gap-0.5">
                <span className="h-3 w-1 bg-white" />
                <span className="h-3 w-1 bg-white" />
              </span>
            )}
          </button>
        )}
      </div>

      {/* Segmented progress */}
      <div className="flex gap-0.5 px-2 pb-2" style={{ background: C.purple }}>
        {words.map((_, i) => (
          <div
            key={i}
            className="h-2 flex-1"
            style={{
              background:
                i < score ? C.white : i === index && phase !== 'ready' ? C.tealSoft : C.purpleDark,
            }}
          />
        ))}
      </div>

      {/* Status banner */}
      <div
        className="mx-2 mb-2 px-2 py-1.5 text-center text-[9px] leading-snug sm:text-[10px]"
        style={{
          background: phase === 'lost' ? '#E57373' : phase === 'won' || phase === 'done' ? C.green : C.green,
          color: C.ink,
        }}
      >
        {phase === 'ready' && 'AMBULANCE READY'}
        {phase === 'racing' && `DRIVE · ${secsLeft}s`}
        {phase === 'paused' && 'PAUSED'}
        {phase === 'won' && 'CLEAR!'}
        {phase === 'lost' && 'CRASH!'}
        {phase === 'done' && (submitting ? 'SAVING…' : 'ALL CLEAR!')}
      </div>

      {/* Target word card */}
      <div className="mx-2 mb-2 border-4 bg-white px-3 py-3 text-center" style={{ borderColor: C.purpleDeep }}>
        <p
          className="break-all text-lg uppercase leading-tight sm:text-xl"
          style={{ color: C.purpleDeep }}
        >
          {current.word}
        </p>
        <p
          className="mt-2 font-sans text-[11px] font-semibold leading-snug tracking-wide"
          style={{ color: C.purpleDark, fontFamily: 'system-ui, sans-serif' }}
        >
          АНГЛИ ҮГЭНД ТААРАХ ЗӨВ МОНГОЛ LANE-ИЙГ СОНГО
        </p>
      </div>

      {phase === 'ready' && (
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={() => startRound(index)}
            className="w-full border-4 py-4 text-xs text-white transition-transform active:scale-[0.98]"
            style={{ background: C.purpleDeep, borderColor: C.purpleDark }}
          >
            ЭХЛЭХ
          </button>
        </div>
      )}

      {showTrack && (
        <>
          {/* Road */}
          <div
            className="relative mx-2 overflow-hidden border-x-4"
            style={{
              height: 340,
              background: C.roadDark,
              borderColor: C.purpleDark,
            }}
          >
            {/* scrolling dashes */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  to bottom,
                  transparent 0,
                  transparent 14px,
                  #fff 14px,
                  #fff 22px
                )`,
                backgroundSize: '100% 36px',
                backgroundPosition: `0 ${-progress * 180}px`,
                maskImage:
                  'linear-gradient(to right, transparent 0, transparent calc(33.33% - 1px), #000 calc(33.33% - 1px), #000 calc(33.33% + 1px), transparent calc(33.33% + 1px), transparent calc(66.66% - 1px), #000 calc(66.66% - 1px), #000 calc(66.66% + 1px), transparent calc(66.66% + 1px))',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0, transparent calc(33.33% - 1px), #000 calc(33.33% - 1px), #000 calc(33.33% + 1px), transparent calc(33.33% + 1px), transparent calc(66.66% - 1px), #000 calc(66.66% - 1px), #000 calc(66.66% + 1px), transparent calc(66.66% + 1px))',
              }}
            />

            <div className="absolute inset-0 grid grid-cols-3">
              {laneLabels.map((label, i) => {
                const active = lane === i;
                return (
                  <button
                    key={`${label}-${i}`}
                    type="button"
                    disabled={phase !== 'racing' && phase !== 'paused'}
                    onClick={() => setLane(i)}
                    className="relative border-r last:border-r-0"
                    style={{
                      background: active ? 'rgba(61, 184, 168, 0.45)' : C.road,
                      borderColor: 'rgba(255,255,255,0.25)',
                    }}
                  >
                    {/* Barrier with Mongolian meaning — fixed near bottom */}
                    <span
                      className="absolute inset-x-1 z-20 flex min-h-[44px] items-center justify-center border-2 px-1 py-1 text-center font-sans text-[11px] font-bold leading-tight text-white sm:text-xs"
                      style={{
                        bottom: '12%',
                        background: '#111',
                        borderColor: active ? C.teal : '#000',
                        boxShadow: active ? `0 3px 0 ${C.teal}` : 'none',
                        fontFamily: 'system-ui, sans-serif',
                      }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Ambulance */}
            <div
              className="pointer-events-none absolute z-30 -translate-x-1/2 transition-[left] duration-100"
              style={{
                left: `${(lane + 0.5) * (100 / 3)}%`,
                top: ambulanceTop,
              }}
            >
              <AmbulanceSprite size={52} />
            </div>

            {phase === 'paused' && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50">
                <button
                  type="button"
                  onClick={togglePause}
                  className="border-4 px-6 py-3 text-[10px] text-white"
                  style={{ background: C.purpleDeep, borderColor: C.white }}
                >
                  ҮРГЭЛЖЛҮҮЛЭХ
                </button>
              </div>
            )}

            {phase === 'lost' && (
              <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-black/55 px-4">
                <p className="text-center text-[10px] text-white">БУРУУ ЛЭЙН!</p>
                <button
                  type="button"
                  onClick={() => startRound(index)}
                  className="border-4 px-5 py-3 text-[10px] text-white"
                  style={{ background: C.purpleDeep, borderColor: C.white }}
                >
                  ДАХИН
                </button>
              </div>
            )}
          </div>

          {/* Left / Right controls */}
          <div className="grid grid-cols-2 gap-2 p-2" style={{ background: C.purple }}>
            <button
              type="button"
              disabled={phase !== 'racing'}
              onClick={() => setLane((l) => Math.max(0, l - 1))}
              className="flex flex-col items-center gap-1 border-4 py-3 text-[11px] text-white disabled:opacity-50"
              style={{ background: C.purpleDeep, borderColor: C.purpleDark }}
            >
              <span className="text-lg leading-none">◆</span>
              <span className="font-sans text-xs font-bold" style={{ fontFamily: 'system-ui' }}>
                ЗҮҮН
              </span>
            </button>
            <button
              type="button"
              disabled={phase !== 'racing'}
              onClick={() => setLane((l) => Math.min(LANES - 1, l + 1))}
              className="flex flex-col items-center gap-1 border-4 py-3 text-[11px] text-white disabled:opacity-50"
              style={{ background: C.purpleDeep, borderColor: C.purpleDark }}
            >
              <span className="text-lg leading-none">◆</span>
              <span className="font-sans text-xs font-bold" style={{ fontFamily: 'system-ui' }}>
                БАРУУН
              </span>
            </button>
          </div>
        </>
      )}

      {/* Score footer */}
      <div
        className="border-t-4 bg-white px-3 py-2 text-center text-[10px]"
        style={{ borderColor: C.purpleDeep, color: C.purpleDark }}
      >
        ОНОО {score}/{words.length}
      </div>
    </div>
  );
}
