// frontend/src/components/type-rush/solo-race.tsx
// Ганцаарчилсан горим: тоглогч + 4 бот. Бүтэн дэлгэцийн canvas уралдаан (RaceScene) дээр
// сонголт / үр дүнгийн давхарга, доор нь бичих консол. Ботын байрлал, цаг, HUD-ийг rAF кадр бүрт
// scene-ийн imperative handle-аар шууд шинэчилнэ (React re-render биш).
// Цагийн хязгаар (15/30/60/120 сек) болон өөрийн өгүүлбэрийг энд сонгоно.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Flag, Keyboard, Pencil, Play, RotateCcw, Shuffle, Timer, Trophy, X, Zap } from 'lucide-react';
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
import { sfx, unlockAudio } from '@/lib/type-rush-sfx';
import { submitGameScore, type SubmitScoreResult } from '@/lib/games-services';
import { LeaderboardPanel } from '@/components/games/leaderboard';
import { Choice, GameButton, ModeSwitch, MuteButton, Overlay, Rule, SectionLabel, type Mode } from './game-ui';
import { CarIcon, RaceScene, type RaceSceneHandle, type SceneLane } from './race-scene';
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

/** Бариа хүрсний дараа үр дүнгийн давхарга гарах хүртэлх хугацаа (баярын анимаци харагдана) */
const RESULTS_DELAY_MS = 1500;

function pickBotNames(count: number): string[] {
  const names = [...BOT_NAMES];
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }
  return names.slice(0, count);
}

export function SoloRace({
  playerName,
  mode,
  onMode,
  onFinale,
}: {
  playerName: string;
  mode: Mode;
  onMode: (m: Mode) => void;
  /** 1-р байр — бүтэн дэлгэцийн салют */
  onFinale: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('select');
  const [level, setLevel] = useState<RaceLevel>('A1');
  const [limit, setLimit] = useState<TimeLimit>(0);
  const [carIdx, setCarIdx] = useState(1);
  const [text, setText] = useState('');
  const [bots, setBots] = useState<Bot[]>([]);
  const [finishMs, setFinishMs] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [liveWpm, setLiveWpm] = useState(0);
  const [best, setBest] = useState<BestRecord | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  /** Leaderboard-д бүртгэгдсэн үр дүн (байр, шилдэг WPM) */
  const [serverResult, setServerResult] = useState<SubmitScoreResult | null>(null);
  const [lbRefresh, setLbRefresh] = useState(0);
  const [rank, setRank] = useState(1);
  const [resultsReady, setResultsReady] = useState(false);

  // Өөрийн өгүүлбэр
  const [useCustom, setUseCustom] = useState(false);
  const [customRaw, setCustomRaw] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);
  const [customRace, setCustomRace] = useState(false);

  const sceneRef = useRef<RaceSceneHandle>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
  const levelCfg = RACE_LEVELS.find((l) => l.code === level) ?? RACE_LEVELS[0];

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
    const place = 1 + botsRef.current.filter((b) => b.finishedAt != null && b.finishedAt < ms).length;
    setFinishMs(ms);
    setRank(place);
    setPhase('finished');
    setUrgent(false);
    const scene = sceneRef.current;
    scene?.setProgress(lane, 1);
    scene?.emitPuffs(lane, 4, 16);
    scene?.setHud({ timerText: formatSeconds(ms), urgent: false, position: place });
    scene?.celebrate(lane, place);
    if (place === 1) {
      sfx.win();
      onFinale();
    } else sfx.finish();
    const wpm = computeWpm(textRef.current.length, ms);
    setLiveWpm(wpm);
    // Өөрийн өгүүлбэрээр уралдсан бол рекордод тооцохгүй (текстийн урт өөр өөр).
    setIsNewBest(!customRaceRef.current && saveBestIfBetter(level, { ms, wpm }, limit));
    setBest(loadBest(level, limit));
    // Leaderboard: WPM-ийг серверт бүртгэнэ (өөрийн текстээр уралдсан бол тооцохгүй; алдаа бол чимээгүй)
    setServerResult(null);
    if (!customRaceRef.current) {
      submitGameScore('TYPE_RUSH', wpm, { mode: 'solo', level, limit, ms: Math.round(ms), rank: place })
        .then((res) => {
          setServerResult(res);
          setLbRefresh((k) => k + 1);
        })
        .catch(() => undefined);
    }
  }, [level, limit, onFinale]);

  /** Цаг дуусав: уралдааныг тэр мөчид зогсооно. */
  const timeUp = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    timedOutRef.current = true;
    const ms = limitMsRef.current;
    setTimedOut(true);
    setPhase('finished');
    setUrgent(false);
    sceneRef.current?.setHud({ timerText: '0.00', fraction: 0, urgent: false });
    sceneRef.current?.timeUp();
    sfx.timeout();
    setLiveWpm(computeWpm(correctRef.current, ms));
  }, []);

  const typing = useTypingRace({
    text,
    active: phase === 'racing',
    onProgress: (correct, total) => {
      correctRef.current = correct;
      sceneRef.current?.setProgress(carIdxRef.current, total ? correct / total : 0);
    },
    onWord: (cps) => {
      // ≥ 6 тэмдэгт/сек (~72 WPM) их утаа, ≥ 3.5 дунд, бусад нь бага
      const count = cps >= 6 ? 5 : cps >= 3.5 ? 3 : 2;
      const size = cps >= 6 ? 18 : cps >= 3.5 ? 14 : 11;
      sceneRef.current?.emitPuffs(carIdxRef.current, count, size);
      if (cps >= 3.5) sceneRef.current?.boost(carIdxRef.current);
      else sfx.tick();
    },
    onFinish: finishRace,
  });

  // Нарийвчлал React state → HUD
  useEffect(() => {
    sceneRef.current?.setHud({ accuracy: typing.accuracy });
  }, [typing.accuracy]);

  const startRace = useCallback(() => {
    unlockAudio();
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
    setRank(1);
    setResultsReady(false);
    setCustomRace(useCustom);
    setPhase('countdown');
  }, [carIdx, customRaw, level, limit, useCustom]);

  /** Уралдааныг болиод сонголт руу буцна */
  const quit = useCallback(() => {
    doneRef.current = true;
    setPhase('select');
    setUrgent(false);
    sceneRef.current?.resetAll();
    sfx.ui();
  }, []);

  // Сонголтын дэлгэцэд машинууд гараан дээр
  useEffect(() => {
    if (phase === 'select') sceneRef.current?.resetAll();
  }, [phase]);

  // Countdown: байрлалыг тэглэнэ, 3 → 2 → 1 → GO (canvas дээр), дараа нь racing
  useEffect(() => {
    if (phase !== 'countdown') return;
    const scene = sceneRef.current;
    scene?.resetAll();
    scene?.setHud({
      timerText: limitMsRef.current > 0 ? (limitMsRef.current / 1000).toFixed(2) : '0.00',
      timerLabel: limitMsRef.current > 0 ? 'ҮЛДСЭН' : 'СЕКУНД',
      fraction: limitMsRef.current > 0 ? 1 : null,
      wpm: 0,
      accuracy: 100,
      urgent: false,
      position: null,
      levelLabel: customRaceRef.current ? 'ӨӨРИЙН' : level,
    });
    scene?.countdown(3);
    sfx.count();
    inputRef.current?.focus();
    const timers = [
      window.setTimeout(() => {
        scene?.countdown(2);
        sfx.count();
      }, 800),
      window.setTimeout(() => {
        scene?.countdown(1);
        sfx.count();
      }, 1600),
      window.setTimeout(() => {
        scene?.countdown('GO');
        sfx.go();
        sfx.rev();
      }, 2400),
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

  // Үр дүнгийн давхарга — баярын анимацийн дараа
  useEffect(() => {
    if (phase !== 'finished') return;
    const id = window.setTimeout(() => setResultsReady(true), RESULTS_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  // rAF: цаг, WPM, ботууд — React re-render биш, шууд scene handle
  useEffect(() => {
    if (phase !== 'racing' && phase !== 'finished') return;
    let active = true;
    let raf = 0;
    let lastWpmAt = 0;
    let lastTickSec = -1;

    const loop = () => {
      if (!active) return;
      // rAF-ийн timestamp performance.now()-оос зөрж болох тул startPerfRef-тэй ижил цагийн эх үүсвэр хэрэглэнэ
      const t = performance.now();
      const elapsed = t - startPerfRef.current;
      const scene = sceneRef.current;
      const total = Math.max(1, textRef.current.length);
      const limitMs = limitMsRef.current;

      if (phaseRef.current === 'racing' && !doneRef.current) {
        if (limitMs > 0) {
          const remain = Math.max(0, limitMs - elapsed);
          scene?.setHud({ timerText: formatSeconds(remain), fraction: remain / limitMs });
          const sec = Math.ceil(remain / 1000);
          if (sec <= 5 && sec > 0 && sec !== lastTickSec) {
            lastTickSec = sec;
            sfx.urgent();
          }
          if (remain <= 0) {
            timeUp();
            active = false;
            return;
          }
        } else {
          scene?.setHud({ timerText: formatSeconds(Math.max(0, elapsed)) });
        }
        if (t - lastWpmAt > 250) {
          lastWpmAt = t;
          const wpm = computeWpm(correctRef.current, elapsed);
          setLiveWpm(wpm);
          scene?.setHud({ wpm });
          if (limitMs > 0) {
            const danger = limitMs - elapsed <= 5000;
            scene?.setHud({ urgent: danger });
            setUrgent((prev) => (prev === danger ? prev : danger));
          }
        }
      }

      let changed = false;
      for (const bot of botsRef.current) {
        if (bot.finishedAt != null) continue;
        const chars = botCharsAt(bot, elapsed);
        scene?.setProgress(bot.lane, Math.min(1, chars / total));
        if (chars >= total) {
          bot.finishedAt = elapsed;
          changed = true;
          scene?.emitPuffs(bot.lane, 2, 14);
          if (!doneRef.current) sfx.rivalFinish();
          continue;
        }
        if (elapsed > bot.delay && t - bot.lastPuffAt > bot.puffEvery) {
          bot.lastPuffAt = t;
          bot.puffEvery = 900 + Math.random() * 900;
          scene?.emitPuffs(bot.lane, 1, 10);
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
  const customPreview = sanitizeCustomText(customRaw);
  /** Өөрийн өгүүлбэрийг заасан хугацаанд бичихэд шаардагдах WPM (5 тэмдэгт = 1 үг). */
  const requiredWpm = hasLimit ? Math.round((customPreview.length / 5) / (limit / 60)) : 0;

  const sceneLanes: SceneLane[] = Array.from({ length: LANES }, (_, lane) => {
    if (lane === carIdx) return { name: playerName, tag: 'ТА', isPlayer: true };
    const bot = bots.find((b) => b.lane === lane);
    if (phase === 'select' || !bot) return { name: 'Бот', tag: 'БОТ', isPlayer: false };
    return { name: bot.name, tag: 'БОТ', isPlayer: false, sub: `${bot.wpm} wpm` };
  });

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

  const inRace = phase === 'countdown' || phase === 'racing';

  return (
    <>
      {/* ── Тоглоомын дэлгэц ── */}
      <div className="relative min-h-0 flex-1">
        <RaceScene
          ref={sceneRef}
          lanes={sceneLanes}
          playerLane={carIdx}
          running={phase === 'racing'}
          level={level}
          showHud={phase !== 'select'}
          preview={phase === 'select'}
          onTap={() => inRace && inputRef.current?.focus()}
        />

        {/* ── Сонголтын дэлгэц ── */}
        {phase === 'select' && (
          <Overlay size="xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ModeSwitch mode={mode} onMode={onMode} />
              <MuteButton />
            </div>
            <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Color English · Game</p>
            <h1 className="mt-1 text-center font-display text-3xl font-bold tracking-wide text-mist-50 sm:text-4xl">БИЧИХ УРАЛДААН</h1>
            <p className="mt-2 text-center text-sm text-mist-300">
              Бэлэн үү, <span className="font-semibold text-mist-50">{playerName}</span>? Хурдан, зөв бич — машин урагшилна.
            </p>

            <div className="mt-5">
              <SectionLabel>Машинаа сонго</SectionLabel>
              <div className="mt-2 grid grid-cols-5 gap-1.5 sm:gap-2">
                {RACE_CARS.map((car, i) => {
                  const active = i === carIdx;
                  return (
                    <button
                      key={car.id}
                      type="button"
                      onClick={() => {
                        setCarIdx(i);
                        sfx.ui();
                      }}
                      className={`flex min-w-0 flex-col items-center gap-1 rounded-xl border px-1 py-2 transition-all sm:gap-2 sm:p-3 ${
                        active ? 'border-brand bg-brand/10 shadow-glow' : 'border-ink-600/80 bg-ink-800/60 hover:border-ink-500 hover:bg-ink-800'
                      }`}
                      aria-pressed={active}
                    >
                      <CarIcon color={car.color} dark={car.dark} width={56} className="max-w-full" />
                      <span className="w-full truncate text-center text-[11px] font-semibold text-mist-50 sm:text-sm">{car.name}</span>
                      <span className="hidden text-[10px] uppercase tracking-wider text-mist-500 sm:block">{car.nick}</span>
                      <span className="text-[10px] text-mist-500">{i + 1}-р зам</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <SectionLabel>Түвшин</SectionLabel>
                <div className="mt-2 flex gap-2">
                  {RACE_LEVELS.map((l) => (
                    <Choice key={l.code} active={l.code === level} onClick={() => setLevel(l.code)} className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{l.label}</span>
                      <span className="block truncate text-[11px] text-mist-400">{useCustom ? 'Ботын хурд' : l.hint}</span>
                    </Choice>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>Цагийн хязгаар</SectionLabel>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {TIME_LIMITS.map((opt) => (
                    <Choice key={opt.value} active={opt.value === limit} onClick={() => setLimit(opt.value)} className="px-2">
                      <span className="block truncate text-sm font-medium">{opt.value === 0 ? '∞' : `${opt.value}с`}</span>
                      <span className="block truncate text-[10px] text-mist-400">{opt.hint}</span>
                    </Choice>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] text-mist-500">
                  {hasLimit ? `${limit} секундэд дуусгах ёстой. Цаг дуусвал уралдаан тасална.` : 'Хугацааны хязгааргүй — өгүүлбэрээ дуустал бич.'}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-2">
                <SectionLabel>Өгүүлбэр</SectionLabel>
                <div className="inline-flex rounded-lg border border-ink-600/80 bg-ink-950/70 p-0.5">
                  <button
                    type="button"
                    onClick={() => setUseCustom(false)}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
                      !useCustom ? 'bg-brand text-white' : 'text-mist-300 hover:text-mist-50'
                    }`}
                    aria-pressed={!useCustom}
                  >
                    <Shuffle className="h-3.5 w-3.5" /> Сангаас
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseCustom(true)}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
                      useCustom ? 'bg-brand text-white' : 'text-mist-300 hover:text-mist-50'
                    }`}
                    aria-pressed={useCustom}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Өөрийн
                  </button>
                </div>
              </div>
              {useCustom ? (
                <div className="mt-2">
                  <textarea
                    value={customRaw}
                    onChange={(e) => {
                      setCustomRaw(e.target.value.slice(0, CUSTOM_TEXT_MAX + 40));
                      if (customError) setCustomError(null);
                    }}
                    rows={2}
                    placeholder="Бичих өгүүлбэрээ энд оруул. Жишээ: The quick brown fox jumps over the lazy dog."
                    className={`w-full resize-y rounded-xl border bg-ink-950 px-3 py-2 font-mono text-sm leading-6 text-mist-50 outline-none transition-colors placeholder:text-mist-500 ${
                      customError ? 'border-danger focus:border-danger' : 'border-ink-600 focus:border-brand'
                    }`}
                  />
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className={customError ? 'text-danger' : 'text-mist-500'}>{customError ?? `${CUSTOM_TEXT_MIN}–${CUSTOM_TEXT_MAX} тэмдэгт.`}</span>
                    <span className={`font-mono ${customPreview.length > CUSTOM_TEXT_MAX ? 'text-danger' : 'text-mist-500'}`}>
                      {customPreview.length}/{CUSTOM_TEXT_MAX}
                    </span>
                  </div>
                  {hasLimit && requiredWpm > 60 && (
                    <p className="mt-1 text-[11px] text-modifier">{limit} секундэд ~{requiredWpm} WPM шаардана — цагаа нэм.</p>
                  )}
                </div>
              ) : (
                <p className="mt-1.5 text-[11px] text-mist-500">{levelCfg.code} түвшний санамсаргүй өгүүлбэр.</p>
              )}
            </div>

            {/* Дүрэм — богино */}
            <div className="mt-4 grid gap-1.5 text-xs text-mist-300 sm:grid-cols-3">
              <Rule icon={<Keyboard className="h-3.5 w-3.5 text-brand" />}>Өгүүлбэрийг яг хэвээр нь бич.</Rule>
              <Rule icon={<Zap className="h-3.5 w-3.5 text-modifier" />}>Хурдан бичвэл нитро асна.</Rule>
              <Rule icon={<Flag className="h-3.5 w-3.5 text-success" />}>Бариа: секунд, WPM, байр.</Rule>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <GameButton onClick={startRace} autoFocus className="px-8 py-3 text-base">
                <Play className="h-5 w-5" /> УРАЛДААН ЭХЛЭХ
              </GameButton>
            </div>
            {best && (
              <p className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-xs text-modifier">
                <Trophy className="h-3.5 w-3.5" />
                {levelCfg.code} · {limitCfg.label} шилдэг: {formatSeconds(best.ms)} сек · {best.wpm} WPM
              </p>
            )}
            <LeaderboardPanel scope="TYPE_RUSH" limit={5} compact refreshKey={lbRefresh} className="mt-4" />
          </Overlay>
        )}

        {/* ── Үр дүн ── */}
        {phase === 'finished' && resultsReady && (finishMs != null || timedOut) && (
          <Overlay size="lg" tone={timedOut ? 'danger' : rank === 1 ? 'success' : 'brand'}>
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
              playerName={playerName}
              footnote={customRace ? 'Өөрийн өгүүлбэрээр уралдсан тул рекордод тооцогдоогүй.' : undefined}
              actions={
                <>
                  <GameButton onClick={startRace} autoFocus>
                    <RotateCcw className="h-4 w-4" /> Дахин уралдах
                  </GameButton>
                  <GameButton onClick={quit} tone="ghost">
                    Тохиргоо солих
                  </GameButton>
                </>
              }
            />
            {serverResult && (
              <p className="mt-3 text-center text-xs text-mist-300">
                Leaderboard: <span className="font-mono font-semibold text-brand">#{serverResult.rank}</span> · шилдэг {serverResult.best} WPM ·{' '}
                {serverResult.plays} уралдаан
              </p>
            )}
            <LeaderboardPanel scope="TYPE_RUSH" limit={5} compact refreshKey={lbRefresh} className="mt-4" />
          </Overlay>
        )}
      </div>

      {/* ── Консол (доод самбар) ── */}
      {inRace && (
        <div
          className="shrink-0 border-t-2 bg-ink-900/95 px-3 py-2.5 backdrop-blur sm:px-5 sm:py-3"
          style={{ borderTopColor: urgent ? '#FF6B7A' : phase === 'racing' ? 'rgba(61,220,151,0.7)' : 'rgba(79,140,255,0.6)' }}
        >
          <div className="flex items-center gap-2">
            <span className="shrink-0 rounded-md bg-brand/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
              {phase === 'racing' ? 'Бич!' : 'Бэлэн үү'}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] text-mist-500">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: playerCar.color }} />
              <span className="truncate">
                {playerCar.name} · {customRace ? 'Өөрийн өгүүлбэр' : levelCfg.label}
              </span>
              {hasLimit && (
                <span className="inline-flex shrink-0 items-center gap-1">
                  <Timer className="h-3 w-3" /> {limit}с
                </span>
              )}
            </span>
            <div className="ml-auto flex shrink-0 items-center gap-2">
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
          <div className="mt-2">
            <TypingPanel
              text={text}
              typed={typing.typed}
              correctLen={typing.correctLen}
              hasError={typing.hasError}
              active={phase === 'racing'}
              inputRef={inputRef}
              onChange={typing.handleChange}
              urgent={urgent}
            />
          </div>
        </div>
      )}
    </>
  );
}
