// frontend/src/components/type-rush/solo-race.tsx
// Ганцаарчилсан горим: тоглогч + 4 бот. Ботын байрлал кадр бүрт DOM дээр шууд шинэчлэгдэнэ.
// Цагийн хязгаар (15/30/60/120 сек) болон өөрийн өгүүлбэрийг энд сонгоно.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Flag, Keyboard, Pencil, RotateCcw, Shuffle, Timer, Trophy, Zap } from 'lucide-react';
import {
  BOT_NAMES,
  BotProfile,
  botCharsAt,
  buildBotProfiles,
  buildRaceText,
  computeWpm,
  CUSTOM_TEXT_MAX,
  CUSTOM_TEXT_MIN,
  getTimeLimitOption,
  LANES,
  loadBest,
  loadCustomText,
  RACE_CARS,
  RACE_LEVELS,
  RaceLevel,
  sanitizeCustomText,
  saveBestIfBetter,
  saveCustomText,
  TIME_LIMITS,
  TimeLimit,
  validateCustomText,
  type BestRecord,
} from '@/lib/type-rush';
import { CarSprite } from './car-sprite';
import { RaceTrack, type TrackHandle, type TrackLane } from './race-track';
import { ResultsPanel, formatSeconds, type StandingRow } from './results-panel';
import { TypingPanel } from './typing-panel';
import { useTypingRace } from './use-typing-race';

type Phase = 'select' | 'countdown' | 'racing' | 'finished';

type Bot = BotProfile & {
  lane: number;
  name: string;
  finishedAt: number | null;
  lastPuffAt: number;
  puffEvery: number;
};

function pickBotNames(count: number): string[] {
  const names = [...BOT_NAMES];
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }
  return names.slice(0, count);
}

export function SoloRace({ playerName }: { playerName: string }) {
  const [phase, setPhase] = useState<Phase>('select');
  const [level, setLevel] = useState<RaceLevel>('A1');
  const [limit, setLimit] = useState<TimeLimit>(0);
  const [carIdx, setCarIdx] = useState(1);
  const [text, setText] = useState('');
  const [bots, setBots] = useState<Bot[]>([]);
  const [countdown, setCountdown] = useState<number | 'GO'>(3);
  const [finishMs, setFinishMs] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [liveWpm, setLiveWpm] = useState(0);
  const [best, setBest] = useState<BestRecord | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  // Өөрийн өгүүлбэр
  const [useCustom, setUseCustom] = useState(false);
  const [customRaw, setCustomRaw] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);
  const [customRace, setCustomRace] = useState(false);

  const trackRef = useRef<TrackHandle>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const startPerfRef = useRef(0);
  const textRef = useRef('');
  const botsRef = useRef<Bot[]>([]);
  const correctRef = useRef(0);
  const phaseRef = useRef<Phase>('select');
  const carIdxRef = useRef(carIdx);
  const limitMsRef = useRef(0);
  const timedOutRef = useRef(false);
  /** Уралдаан дууссан (бариа хүрсэн эсвэл цаг дууссан) — phaseRef re-render хүлээдэг тул шууд тэмдэглэнэ. */
  const doneRef = useRef(false);
  const customRaceRef = useRef(false);
  phaseRef.current = phase;
  carIdxRef.current = carIdx;
  limitMsRef.current = limit * 1000;
  customRaceRef.current = customRace;

  const limitCfg = getTimeLimitOption(limit);
  const hasLimit = limit > 0;

  useEffect(() => {
    setCustomRaw(loadCustomText());
  }, []);

  useEffect(() => {
    setBest(loadBest(level, limit));
  }, [level, limit]);

  const finishRace = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    const ms = performance.now() - startPerfRef.current;
    const lane = carIdxRef.current;
    setFinishMs(ms);
    setPhase('finished');
    if (timerRef.current) timerRef.current.textContent = formatSeconds(ms);
    trackRef.current?.setProgress(lane, 1);
    trackRef.current?.emitPuffs(lane, 4, 16);
    const wpm = computeWpm(textRef.current.length, ms);
    setLiveWpm(wpm);
    // Өөрийн өгүүлбэрээр уралдсан бол рекордод тооцохгүй (текстийн урт өөр өөр).
    setIsNewBest(!customRaceRef.current && saveBestIfBetter(level, { ms, wpm }, limit));
    setBest(loadBest(level, limit));
  }, [level, limit]);

  /** Цаг дуусав: уралдааныг тэр мөчид зогсооно. */
  const timeUp = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    timedOutRef.current = true;
    const ms = limitMsRef.current;
    setTimedOut(true);
    setPhase('finished');
    setUrgent(false);
    if (timerRef.current) timerRef.current.textContent = '0.00';
    if (barRef.current) barRef.current.style.width = '0%';
    setLiveWpm(computeWpm(correctRef.current, ms));
  }, []);

  const typing = useTypingRace({
    text,
    active: phase === 'racing',
    onProgress: (correct, total) => {
      correctRef.current = correct;
      trackRef.current?.setProgress(carIdxRef.current, total ? correct / total : 0);
    },
    onWord: (cps) => {
      // ≥ 6 тэмдэгт/сек (~72 WPM) их утаа, ≥ 3.5 дунд, бусад нь бага
      const count = cps >= 6 ? 5 : cps >= 3.5 ? 3 : 2;
      const size = cps >= 6 ? 18 : cps >= 3.5 ? 14 : 11;
      trackRef.current?.emitPuffs(carIdxRef.current, count, size);
      if (cps >= 3.5) trackRef.current?.boost(carIdxRef.current);
    },
    onFinish: finishRace,
  });

  const startRace = useCallback(() => {
    let nextText: string;
    if (useCustom) {
      const check = validateCustomText(customRaw);
      if (!check.ok) {
        setCustomError(check.error ?? 'Өгүүлбэр буруу байна.');
        return;
      }
      nextText = check.text;
      saveCustomText(customRaw);
      setCustomError(null);
    } else {
      nextText = buildRaceText(level, textRef.current, limit);
    }

    const profiles = buildBotProfiles(level, LANES - 1);
    const names = pickBotNames(LANES - 1);
    const lanes = Array.from({ length: LANES }, (_, i) => i).filter((i) => i !== carIdx);
    const nextBots: Bot[] = lanes.map((lane, i) => ({
      ...profiles[i],
      lane,
      name: names[i],
      finishedAt: null,
      lastPuffAt: 0,
      puffEvery: 900 + Math.random() * 800,
    }));
    textRef.current = nextText;
    botsRef.current = nextBots;
    correctRef.current = 0;
    timedOutRef.current = false;
    doneRef.current = false;
    setText(nextText);
    setBots(nextBots);
    setFinishMs(null);
    setTimedOut(false);
    setUrgent(false);
    setIsNewBest(false);
    setLiveWpm(0);
    setCustomRace(useCustom);
    setCountdown(3);
    setPhase('countdown');
  }, [carIdx, customRaw, level, limit, useCustom]);

  // Countdown: зам mount болсны дараа байрлалыг тэглэнэ, 3 → 2 → 1 → GO
  useEffect(() => {
    if (phase !== 'countdown') return;
    trackRef.current?.resetAll();
    if (timerRef.current) timerRef.current.textContent = limitMsRef.current > 0 ? (limitMsRef.current / 1000).toFixed(2) : '0.00';
    if (barRef.current) barRef.current.style.width = '100%';
    inputRef.current?.focus();
    const timers = [
      window.setTimeout(() => setCountdown(2), 800),
      window.setTimeout(() => setCountdown(1), 1600),
      window.setTimeout(() => setCountdown('GO'), 2400),
      window.setTimeout(() => {
        startPerfRef.current = performance.now();
        typing.markStart();
        setPhase('racing');
      }, 2700),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase === 'racing') inputRef.current?.focus();
  }, [phase]);

  // rAF: цаг, WPM, ботууд — React re-render биш, шууд DOM
  useEffect(() => {
    if (phase !== 'racing' && phase !== 'finished') return;
    let active = true;
    let raf = 0;
    let lastWpmAt = 0;

    const loop = (t: number) => {
      if (!active) return;
      const elapsed = t - startPerfRef.current;
      const track = trackRef.current;
      const total = Math.max(1, textRef.current.length);
      const limitMs = limitMsRef.current;

      if (phaseRef.current === 'racing' && !doneRef.current) {
        if (limitMs > 0) {
          const remain = Math.max(0, limitMs - elapsed);
          if (timerRef.current) timerRef.current.textContent = formatSeconds(remain);
          if (barRef.current) barRef.current.style.width = `${Math.max(0, (remain / limitMs) * 100)}%`;
          if (remain <= 0) {
            timeUp();
            active = false;
            return;
          }
        } else if (timerRef.current) {
          timerRef.current.textContent = formatSeconds(Math.max(0, elapsed));
        }
        if (t - lastWpmAt > 250) {
          lastWpmAt = t;
          setLiveWpm(computeWpm(correctRef.current, elapsed));
          if (limitMs > 0) {
            const danger = limitMs - elapsed <= 5000;
            setUrgent((prev) => (prev === danger ? prev : danger));
          }
        }
      }

      let changed = false;
      for (const bot of botsRef.current) {
        if (bot.finishedAt != null) continue;
        const chars = botCharsAt(bot, elapsed);
        track?.setProgress(bot.lane, Math.min(1, chars / total));
        if (chars >= total) {
          bot.finishedAt = elapsed;
          changed = true;
          track?.emitPuffs(bot.lane, 2, 14);
          continue;
        }
        if (elapsed > bot.delay && t - bot.lastPuffAt > bot.puffEvery) {
          bot.lastPuffAt = t;
          bot.puffEvery = 900 + Math.random() * 900;
          track?.emitPuffs(bot.lane, 1, 10);
        }
      }
      if (changed) setBots([...botsRef.current]);

      const allDone = botsRef.current.every((b) => b.finishedAt != null);
      if ((phaseRef.current === 'finished' && allDone) || elapsed > 240_000) {
        active = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      active = false;
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const playerCar = RACE_CARS[carIdx];
  const levelCfg = RACE_LEVELS.find((l) => l.code === level) ?? RACE_LEVELS[0];
  const customPreview = sanitizeCustomText(customRaw);
  /** Өөрийн өгүүлбэрийг заасан хугацаанд бичихэд шаардагдах WPM (5 тэмдэгт = 1 үг). */
  const requiredWpm = hasLimit ? Math.round((customPreview.length / 5) / (limit / 60)) : 0;

  const trackLanes: TrackLane[] = Array.from({ length: LANES }, (_, lane) => {
    if (lane === carIdx) return { name: playerName, tag: 'ТА', isPlayer: true };
    const bot = bots.find((b) => b.lane === lane);
    return { name: bot?.name ?? '', tag: bot ? 'БОТ' : '', isPlayer: false, sub: bot ? `${bot.wpm} wpm` : undefined };
  });

  const rank = finishMs == null ? 1 : 1 + bots.filter((b) => b.finishedAt != null && b.finishedAt < finishMs).length;
  const standings: StandingRow[] = [
    {
      lane: carIdx,
      name: playerName,
      isPlayer: true,
      time: finishMs,
      wpm: finishMs != null ? computeWpm(text.length, finishMs) : timedOut ? liveWpm : null,
      note: timedOut ? 'цаг дууссан' : undefined,
      failed: timedOut,
    },
    ...bots.map((b) => ({
      lane: b.lane,
      name: b.name,
      isPlayer: false,
      time: b.finishedAt,
      wpm: b.wpm,
      tag: 'БОТ',
      failed: timedOut && b.finishedAt == null,
    })),
  ];

  if (phase === 'select') {
    return (
      <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-4 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold text-mist-50">Машинаа сонго</h2>
            <p className="mt-1 text-sm text-mist-400">5 зам, 5 машин. Таны машин сонгосон замдаа уралдана, бусад 4 нь бот.</p>
          </div>
          {best && (
            <div className="rounded-xl border border-modifier/30 bg-modifier/10 px-3 py-2 text-xs text-modifier">
              <span className="inline-flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5" />
                {levelCfg.code} · {limitCfg.label} шилдэг: {formatSeconds(best.ms)} сек · {best.wpm} WPM
              </span>
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
          {RACE_CARS.map((car, i) => {
            const active = i === carIdx;
            return (
              <button
                key={car.id}
                type="button"
                onClick={() => setCarIdx(i)}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all sm:gap-3 sm:p-4 ${
                  active ? 'border-brand bg-brand/10 shadow-glow' : 'border-ink-600/80 bg-ink-800/60 hover:border-ink-500 hover:bg-ink-800'
                }`}
                aria-pressed={active}
              >
                <CarSprite color={car.color} dark={car.dark} width={64} className="max-w-full" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-mist-50">{car.name}</p>
                  <p className="text-[11px] uppercase tracking-wider text-mist-500">{car.nick}</p>
                </div>
                <span className="text-[11px] text-mist-500">{i + 1}-р зам</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-mist-500">Түвшин</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {RACE_LEVELS.map((l) => {
              const active = l.code === level;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLevel(l.code)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-left transition-colors sm:flex-none sm:px-4 ${
                    active ? 'border-brand bg-brand/15 text-mist-50' : 'border-ink-600/80 bg-ink-800/60 text-mist-300 hover:border-ink-500'
                  }`}
                >
                  <span className="block text-sm font-medium">{l.label}</span>
                  <span className="block text-[11px] text-mist-400">{useCustom ? 'Ботын хурд' : l.hint}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-mist-500">Цагийн хязгаар</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {TIME_LIMITS.map((opt) => {
              const active = opt.value === limit;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLimit(opt.value)}
                  className={`rounded-xl border px-3 py-2 text-left transition-colors sm:px-4 ${
                    active ? 'border-brand bg-brand/15 text-mist-50' : 'border-ink-600/80 bg-ink-800/60 text-mist-300 hover:border-ink-500'
                  }`}
                  aria-pressed={active}
                >
                  <span className="block text-sm font-medium">{opt.label}</span>
                  <span className="block text-[11px] text-mist-400">{opt.hint}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-mist-500">
            {hasLimit
              ? `Өгүүлбэрээ ${limit} секундэд бичиж дуусгах ёстой. Цаг дуусвал уралдаан тасална.`
              : 'Хугацааны хязгаар байхгүй — өгүүлбэрээ дуусталаа бич.'}
          </p>
        </div>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-mist-500">Өгүүлбэр</p>
          <div className="mt-2 inline-flex w-full rounded-xl border border-ink-600/80 bg-ink-900 p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => setUseCustom(false)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors sm:flex-none sm:px-4 ${
                !useCustom ? 'bg-brand text-white' : 'text-mist-300 hover:text-mist-50'
              }`}
              aria-pressed={!useCustom}
            >
              <Shuffle className="h-4 w-4" /> Сангаас
            </button>
            <button
              type="button"
              onClick={() => setUseCustom(true)}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors sm:flex-none sm:px-4 ${
                useCustom ? 'bg-brand text-white' : 'text-mist-300 hover:text-mist-50'
              }`}
              aria-pressed={useCustom}
            >
              <Pencil className="h-4 w-4" /> Өөрийн өгүүлбэр
            </button>
          </div>

          {useCustom ? (
            <div className="mt-3">
              <textarea
                value={customRaw}
                onChange={(e) => {
                  setCustomRaw(e.target.value.slice(0, CUSTOM_TEXT_MAX + 40));
                  if (customError) setCustomError(null);
                }}
                rows={3}
                placeholder="Бичих өгүүлбэрээ энд оруул. Жишээ: The quick brown fox jumps over the lazy dog."
                className={`w-full resize-y rounded-xl border bg-ink-800 px-3 py-2.5 font-mono text-sm leading-6 text-mist-50 outline-none transition-colors placeholder:text-mist-500 sm:px-4 sm:py-3 ${
                  customError ? 'border-danger focus:border-danger' : 'border-ink-600 focus:border-brand'
                }`}
              />
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className={customError ? 'text-danger' : 'text-mist-500'}>
                  {customError ?? `${CUSTOM_TEXT_MIN}–${CUSTOM_TEXT_MAX} тэмдэгт. Мөр дамжилт, давхар зай автоматаар цэвэрлэгдэнэ.`}
                </span>
                <span className={`font-mono ${customPreview.length > CUSTOM_TEXT_MAX ? 'text-danger' : 'text-mist-500'}`}>
                  {customPreview.length}/{CUSTOM_TEXT_MAX}
                </span>
              </div>
              {hasLimit && requiredWpm > 60 && (
                <p className="mt-1.5 text-[11px] text-modifier">
                  Энэ өгүүлбэрийг {limit} секундэд бичихэд ~{requiredWpm} WPM шаардана. Цагаа нэмэх эсвэл өгүүлбэрээ багасгах нь зөв.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-mist-500">
              {levelCfg.code} түвшний дүрмийн сангаас санамсаргүй өгүүлбэр гарна
              {hasLimit ? ' (цагт тохирсон урттай).' : '.'}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ul className="space-y-1 text-xs text-mist-400">
            <li className="flex items-center gap-2">
              <Keyboard className="h-3.5 w-3.5 shrink-0 text-brand" /> Өгүүлбэрийг яг хэвээр нь бич — зөв тэмдэгт бүрт машин урагшилна.
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 shrink-0 text-modifier" /> Үг бүр дуусахад утаа гарна, хурдан бичвэл утаа илүү их.
            </li>
            <li className="flex items-center gap-2">
              <Flag className="h-3.5 w-3.5 shrink-0 text-success" /> Бариа дээр хүрэхэд зарцуулсан секунд, WPM, байр харагдана.
            </li>
          </ul>
          <button
            type="button"
            onClick={startRace}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            <Flag className="h-4 w-4" />
            Уралдаан эхлэх
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex min-w-0 items-center gap-2 rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 text-mist-200">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: playerCar.color }} />
          <span className="truncate">
            {playerCar.name} · {carIdx + 1}-р зам
          </span>
        </span>
        <span className="rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 text-mist-300">
          {customRace ? 'Өөрийн өгүүлбэр' : levelCfg.label}
        </span>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono ${
            urgent ? 'border-danger bg-danger/10 text-danger' : 'border-ink-600/80 bg-ink-900 text-mist-100'
          }`}
        >
          <Timer className={`h-3.5 w-3.5 ${urgent ? 'text-danger' : 'text-brand'}`} />
          <span ref={timerRef}>0.00</span> сек{hasLimit ? ' үлдсэн' : ''}
        </span>
        <span className="shrink-0 rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 font-mono text-mist-100">{liveWpm} WPM</span>
        <span className="shrink-0 rounded-full border border-ink-600/80 bg-ink-900 px-3 py-1.5 font-mono text-mist-100">
          {typing.accuracy}%
        </span>
      </div>

      {hasLimit && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-800" aria-hidden>
          <div
            ref={barRef}
            className={`h-full rounded-full transition-colors ${urgent ? 'bg-danger' : 'bg-brand'}`}
            style={{ width: '100%' }}
          />
        </div>
      )}

      <RaceTrack
        ref={trackRef}
        lanes={trackLanes}
        running={phase === 'racing'}
        onClick={() => phase !== 'finished' && inputRef.current?.focus()}
        overlay={
          phase === 'countdown' ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink-950/55 backdrop-blur-[1px]">
              <span
                key={String(countdown)}
                className={`tr-count font-display text-6xl font-bold sm:text-7xl ${countdown === 'GO' ? 'text-success' : 'text-mist-50'}`}
                style={{ textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {countdown === 'GO' ? 'GO!' : countdown}
              </span>
            </div>
          ) : null
        }
      />

      {phase !== 'finished' && (
        <TypingPanel
          text={text}
          typed={typing.typed}
          correctLen={typing.correctLen}
          hasError={typing.hasError}
          active={phase === 'racing'}
          inputRef={inputRef}
          onChange={typing.handleChange}
        />
      )}

      {phase === 'finished' && (finishMs != null || timedOut) && (
        <ResultsPanel
          finishMs={finishMs ?? limit * 1000}
          rank={rank}
          wpm={finishMs != null ? computeWpm(text.length, finishMs) : liveWpm}
          accuracy={typing.accuracy}
          chars={finishMs != null ? text.length : typing.correctLen}
          totalChars={text.length}
          timedOut={timedOut}
          isNewBest={isNewBest}
          standings={standings}
          footnote={
            customRace ? 'Өөрийн өгүүлбэрээр уралдсан тул рекордод тооцогдоогүй.' : undefined
          }
          actions={
            <>
              <button
                type="button"
                onClick={startRace}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-hover"
              >
                <RotateCcw className="h-4 w-4" /> Дахин уралдах
              </button>
              <button
                type="button"
                onClick={() => setPhase('select')}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-600 px-5 py-3 text-sm font-medium text-mist-200 hover:bg-ink-800"
              >
                Тохиргоо солих
              </button>
            </>
          }
        />
      )}
    </div>
  );
}
