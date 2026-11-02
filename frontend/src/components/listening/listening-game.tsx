// frontend/src/components/listening/listening-game.tsx
// "Сонсох" тоглоом — нэг клип. Урсгал: 1–4 үг сонгох → үгийн тайлбар харах → видео тоглуулж, аль үгийг сонссоноо
// тухайн үгийн товчоор дарах → видео дуусахад үг бүрийн "нийт хэдэн удаа хэлэгдсэн / хэдэн удаа дарсан"-ыг харуулах →
// бүгд таарвал баяр хүргэж дараагийн үгс рүү; таараагүй бол CC (хадмал) дээр үг бүрийг өөрийн өнгөөр, хаана алдсаныг харуулна.
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Captions, Check, ChevronRight, Ear, Headphones, Loader2, Pause, Play, RotateCcw, Shuffle, Trophy, X } from 'lucide-react';
import { fetchClip, submitAttempt, type AttemptResult, type ClipDetail } from '@/lib/listening-services';
import { formatTime, LEVEL_LABELS, matchClicks, MAX_WORDS, occurrencesOf, tokenize, WORD_COLORS, type WordOutcome } from '@/lib/listening';
import { getApiErrorMessage } from '@/lib/api-error';
import { sfx, unlockAudio } from '@/lib/type-rush-sfx';
import { Fireworks } from '@/components/sentence-builder/fireworks';
import { TR_STYLES } from '@/components/type-rush/game-ui';
import { YoutubePlayer, type PlayerStatus, type YoutubePlayerHandle } from './youtube-player';
import { WordInfoPanel } from './word-info-panel';
import { TranscriptView } from './transcript-view';

type Phase = 'pick' | 'ready' | 'playing' | 'result';

type Outcome = {
  words: WordOutcome[];
  allCorrect: boolean;
  submits: (AttemptResult | null)[];
  submitError: string | null;
};

export function ListeningGame({ clipId }: { clipId: string }) {
  const [clip, setClip] = useState<ClipDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('pick');
  /** Сонгосон үгс (1..MAX_WORDS, дарааллаар — өнгө нь WORD_COLORS) */
  const [words, setWords] = useState<string[]>([]);
  /** Тайлбар нь харагдаж буй үг */
  const [infoWord, setInfoWord] = useState<string | null>(null);
  const [clickCounts, setClickCounts] = useState<number[]>([]);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [showCC, setShowCC] = useState(false);
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<PlayerStatus>('loading');
  const [currentTime, setCurrentTime] = useState(0);
  const [pulse, setPulse] = useState<number[]>([]);
  const [burst, setBurst] = useState(0);

  const playerRef = useRef<YoutubePlayerHandle>(null);
  const phaseRef = useRef<Phase>('pick');
  /** Үг бүрийн дарсан мөчүүд (видеоны сек) */
  const clicksRef = useRef<number[][]>([]);
  const wordsRef = useRef<string[]>([]);
  phaseRef.current = phase;
  wordsRef.current = words;

  useEffect(() => {
    let cancelled = false;
    fetchClip(clipId)
      .then((c) => {
        if (cancelled) return;
        setClip(c);
        setMastered(new Set(c.mastered));
      })
      .catch((err) => !cancelled && setLoadError(getApiErrorMessage(err, 'Клип ачаалж чадсангүй')));
    return () => {
      cancelled = true;
    };
  }, [clipId]);

  const segments = useMemo(() => clip?.segments ?? [], [clip]);
  const unmastered = useMemo(() => (clip ? clip.words.filter((w) => !mastered.has(w.word)) : []), [clip, mastered]);
  /** Тайлбарын контекст өгүүлбэр — тухайн үг эхлээд хэлэгдсэн мөр */
  const contextOf = useCallback((w: string) => segments.find((s) => tokenize(s.text).includes(w))?.text, [segments]);

  // ---------- Үг сонгох ----------
  const toggleWord = useCallback((w: string) => {
    unlockAudio();
    setWords((prev) => {
      if (prev.includes(w)) return prev.filter((x) => x !== w);
      if (prev.length >= MAX_WORDS) {
        sfx.boom();
        return prev;
      }
      return [...prev, w];
    });
    setInfoWord(w);
  }, []);

  const randomPick = useCallback(() => {
    unlockAudio();
    const pool = [...unmastered];
    const out: string[] = [];
    while (out.length < Math.min(3, pool.length)) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0].word);
    setWords(out);
    setInfoWord(out[0] ?? null);
  }, [unmastered]);

  const resetRound = useCallback(() => {
    clicksRef.current = wordsRef.current.map(() => []);
    setClickCounts(wordsRef.current.map(() => 0));
    setPulse(wordsRef.current.map(() => 0));
    setOutcome(null);
    setShowCC(false);
  }, []);

  const goReady = useCallback(() => {
    if (!words.length) return;
    unlockAudio();
    resetRound();
    setInfoWord(words[0]);
    setPhase('ready');
    playerRef.current?.pause();
  }, [resetRound, words]);

  const startListening = useCallback(() => {
    unlockAudio();
    resetRound();
    setPhase('playing');
    playerRef.current?.restart();
  }, [resetRound]);

  const heard = useCallback((i: number) => {
    if (phaseRef.current !== 'playing' || i < 0 || i >= wordsRef.current.length) return;
    const t = playerRef.current?.currentTime() ?? 0;
    clicksRef.current[i] = [...(clicksRef.current[i] ?? []), t];
    setClickCounts(clicksRef.current.map((c) => c.length));
    setPulse((p) => p.map((v, j) => (j === i ? v + 1 : v)));
    sfx.tick();
  }, []);

  const finish = useCallback(() => {
    const c = clip;
    const ws = wordsRef.current;
    if (!c || !ws.length) return;
    const results: WordOutcome[] = ws.map((w, i) => {
      const clickTimes = clicksRef.current[i] ?? [];
      const match = matchClicks(occurrencesOf(c.segments, w), clickTimes);
      return { word: w, expected: match.hits.length, clicked: clickTimes.length, correct: clickTimes.length === match.hits.length, match };
    });
    const allCorrect = results.every((r) => r.correct);
    setPhase('result');
    setOutcome({ words: results, allCorrect, submits: results.map(() => null), submitError: null });
    if (allCorrect) {
      sfx.win();
      setBurst((b) => b + 1);
    } else {
      sfx.boom();
      setShowCC(true);
    }
    const newly = results.filter((r) => r.correct).map((r) => r.word);
    if (newly.length) setMastered((prev) => new Set([...prev, ...newly]));
    Promise.all(
      results.map((r, i) =>
        submitAttempt({
          clipId: c.id,
          word: r.word,
          clicked: r.clicked,
          clickTimes: (clicksRef.current[i] ?? []).map((t) => Math.round(t * 10) / 10),
        }).catch(() => null),
      ),
    ).then((subs) =>
      setOutcome((o) =>
        o ? { ...o, submits: subs, submitError: subs.some((s) => s == null) ? 'Зарим үр дүнг серверт хадгалж чадсангүй' : null } : o,
      ),
    );
  }, [clip]);

  const onStatus = useCallback(
    (s: PlayerStatus) => {
      setStatus(s);
      if (s === 'ended' && phaseRef.current === 'playing') finish();
    },
    [finish],
  );

  // Гар: 1–4 тоо = тухайн үг; Space = эхний үг (ганц үгтэй үед хялбар)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'playing') return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        heard(0);
        return;
      }
      const n = Number(e.key);
      if (n >= 1 && n <= MAX_WORDS) {
        e.preventDefault();
        heard(n - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [heard]);

  const nextWords = useCallback(() => {
    const count = Math.max(1, words.length);
    const pool = unmastered.filter((w) => !words.includes(w.word));
    const next = (pool.length ? pool : unmastered).slice(0, count).map((w) => w.word);
    if (!next.length) {
      setPhase('pick');
      return;
    }
    setWords(next);
    wordsRef.current = next;
    resetRound();
    setInfoWord(next[0]);
    setPhase('ready');
    playerRef.current?.pause();
  }, [resetRound, unmastered, words]);

  // ---------- Render ----------
  if (loadError) {
    return (
      <div className="rounded-2xl border border-danger/40 bg-danger/10 p-6 text-center text-sm text-danger">
        {loadError}
        <div className="mt-3">
          <Link href="/listening" className="text-brand hover:underline">
            ← Клипүүд рүү буцах
          </Link>
        </div>
      </div>
    );
  }
  if (!clip) {
    return (
      <div className="flex items-center justify-center py-20 text-mist-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Ачаалж байна…
      </div>
    );
  }

  const inGame = phase === 'playing';
  const allDone = clip.words.length > 0 && unmastered.length === 0;
  const colorOf = (i: number) => WORD_COLORS[i % WORD_COLORS.length];

  /** Сонгосон үгсийн чип (ready / result / тайлбарын таб) */
  const wordChips = (onPick?: (w: string) => void) => (
    <div className="flex flex-wrap justify-center gap-1.5">
      {words.map((w, i) => (
        <button
          key={w}
          type="button"
          onClick={() => onPick?.(w)}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm font-semibold transition-colors ${
            infoWord === w ? 'bg-ink-800' : 'bg-ink-900/60'
          }`}
          style={{ borderColor: `${colorOf(i)}99`, color: colorOf(i) }}
        >
          <span className="font-mono text-[10px] opacity-70">{i + 1}</span>
          {w}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: TR_STYLES }} />
      <Fireworks burst={burst} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href="/listening" className="inline-flex items-center gap-1.5 text-sm text-mist-400 hover:text-mist-50">
          <ArrowLeft className="h-4 w-4" /> Бүх клип
        </Link>
        <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-[11px] font-semibold text-brand">{LEVEL_LABELS[clip.levelCode] ?? clip.levelCode}</span>
      </div>
      <h1 className="mt-2 font-display text-2xl font-semibold text-mist-50">{clip.title}</h1>
      {clip.description && <p className="mt-1 text-sm text-mist-400">{clip.description}</p>}
      <p className="mt-1 text-xs text-mist-500">
        {formatTime(clip.startSec)} – {formatTime(clip.endSec)} · {clip.words.length} үг · эзэмшсэн {mastered.size}/{clip.words.length}
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* ── Зүүн: видео + удирдлага ── */}
        <div>
          <YoutubePlayer ref={playerRef} videoId={clip.youtubeId} startSec={clip.startSec} endSec={clip.endSec} onStatus={onStatus} onTime={setCurrentTime} />

          <div className="mt-3 rounded-2xl border border-ink-600/80 bg-ink-900/80 p-3 sm:p-4">
            {phase === 'pick' && (
              <div className="text-center">
                <p className="text-sm text-mist-300">
                  <Headphones className="mr-1.5 inline h-4 w-4 text-brand" />
                  Баруун талаас 1–{MAX_WORDS} үг сонго. Видео тоглох үед аль үгийг сонссоноо тэр үгийн товчоор дар.
                </p>
                {words.length > 0 && <div className="mt-3">{wordChips(setInfoWord)}</div>}
                <button
                  type="button"
                  onClick={goReady}
                  disabled={!words.length}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white shadow-[0_4px_0_#2A5BB8] transition-all hover:bg-brand-hover active:translate-y-[2px] active:shadow-[0_2px_0_#2A5BB8] disabled:opacity-40"
                >
                  <ChevronRight className="h-5 w-5" /> {words.length ? `Үргэлжлүүлэх (${words.length} үг)` : 'Үг сонгоно уу'}
                </button>
              </div>
            )}

            {phase === 'ready' && (
              <div className="text-center">
                <p className="text-sm text-mist-300">Сонсох үгс:</p>
                <div className="mt-2">{wordChips(setInfoWord)}</div>
                <p className="mt-2 text-xs text-mist-500">
                  Видео эхлэхэд аль үгийг сонссоноо тэр үгийн товчоор дар (гар дээр 1–{Math.max(1, words.length)}{words.length === 1 ? ' эсвэл Space' : ''}).
                </p>
                <button
                  type="button"
                  onClick={startListening}
                  disabled={status === 'loading' || status === 'error'}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white shadow-[0_4px_0_#2A5BB8] transition-all hover:bg-brand-hover active:translate-y-[2px] active:shadow-[0_2px_0_#2A5BB8] disabled:opacity-50"
                >
                  <Play className="h-5 w-5" /> {status === 'loading' ? 'Видео ачаалж байна…' : 'Эхлэх'}
                </button>
                {status === 'error' && <p className="mt-2 text-xs text-danger">Видео ачаалж чадсангүй (embed хориотой байж магадгүй).</p>}
              </div>
            )}

            {inGame && (
              <div className="flex flex-col items-center">
                <div className="flex w-full items-center justify-between text-xs text-mist-400">
                  <span className="font-mono">
                    {formatTime(currentTime)} / {formatTime(clip.endSec)}
                  </span>
                  <span>Сонссон үгээ дар</span>
                  <button
                    type="button"
                    onClick={() => (status === 'playing' ? playerRef.current?.pause() : playerRef.current?.play())}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-ink-600/80 text-mist-300 hover:text-mist-50"
                    aria-label={status === 'playing' ? 'Түр зогсоох' : 'Үргэлжлүүлэх'}
                  >
                    {status === 'playing' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-800">
                  <div
                    className="h-full bg-brand transition-[width] duration-200"
                    style={{ width: `${Math.min(100, Math.max(0, ((currentTime - clip.startSec) / Math.max(1, clip.endSec - clip.startSec)) * 100))}%` }}
                  />
                </div>
                {/* Үг бүрт нэг том товч */}
                <div className={`mt-4 grid w-full gap-2 sm:gap-3 ${words.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {words.map((w, i) => (
                    <button
                      key={`${w}-${pulse[i] ?? 0}`}
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        heard(i);
                      }}
                      className={`tr-pop flex select-none flex-col items-center justify-center rounded-2xl border-2 py-4 transition-transform active:scale-95 ${
                        words.length === 1 ? 'mx-auto h-36 w-36 rounded-full sm:h-40 sm:w-40' : 'min-h-[5.5rem]'
                      }`}
                      style={{ borderColor: `${colorOf(i)}B3`, background: `${colorOf(i)}1F`, color: colorOf(i) }}
                      aria-label={`${w} сонслоо`}
                    >
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider opacity-80">
                        <Ear className="h-4 w-4" /> {i + 1}
                      </span>
                      <span className="font-display text-lg font-bold">{w}</span>
                      <span className="font-mono text-2xl font-bold">{clickCounts[i] ?? 0}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-mist-500">Гар: 1–{words.length} тоо · видео дуустал сонс</p>
                <button type="button" onClick={() => finish()} className="mt-1 text-[11px] text-mist-500 underline-offset-2 hover:text-danger hover:underline">
                  Эрт дуусгах
                </button>
              </div>
            )}

            {phase === 'result' && outcome && (
              <div className="text-center">
                <div className="mb-2 flex items-center justify-between text-xs text-mist-400">
                  <span className="font-mono">
                    {formatTime(currentTime)} / {formatTime(clip.endSec)}
                  </span>
                  <button
                    type="button"
                    onClick={() => (status === 'playing' ? playerRef.current?.pause() : playerRef.current?.play())}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-ink-600/80 px-2.5 py-1 text-mist-300 hover:text-mist-50"
                  >
                    {status === 'playing' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    {status === 'playing' ? 'Зогсоох' : 'Видео үзэх'}
                  </button>
                </div>
                {outcome.allCorrect ? (
                  <p className="inline-flex items-center gap-2 font-display text-2xl font-bold text-success">
                    <Trophy className="h-6 w-6 text-modifier" /> Баяр хүргэе! Бүгд зөв
                  </p>
                ) : (
                  <p className="inline-flex items-center gap-2 font-display text-2xl font-bold text-danger">
                    <X className="h-6 w-6" /> {outcome.words.filter((w) => w.correct).length}/{outcome.words.length} үг таарлаа
                  </p>
                )}

                {/* Үг бүрийн үр дүн */}
                <ul className="mx-auto mt-3 max-w-md space-y-1.5 text-left">
                  {outcome.words.map((r, i) => (
                    <li
                      key={r.word}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${r.correct ? 'border-success/40 bg-success/10' : 'border-danger/40 bg-danger/10'}`}
                    >
                      <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: colorOf(i) }} />
                      <button type="button" onClick={() => setInfoWord(r.word)} className="min-w-0 flex-1 truncate text-left font-semibold text-mist-50 hover:underline">
                        {r.word}
                      </button>
                      <span className="text-xs text-mist-300">
                        хэлэгдсэн <span className="font-bold text-mist-50">{r.expected}</span> · дарсан <span className="font-bold text-mist-50">{r.clicked}</span>
                      </span>
                      {r.correct ? <Check className="h-4 w-4 shrink-0 text-success" /> : <X className="h-4 w-4 shrink-0 text-danger" />}
                      {outcome.submits[i] && outcome.submits[i]!.score > 0 && <span className="text-xs text-modifier">+{outcome.submits[i]!.score}</span>}
                    </li>
                  ))}
                </ul>
                {outcome.submitError && <p className="mt-1 text-xs text-danger">{outcome.submitError}</p>}

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {outcome.allCorrect && !allDone && (
                    <button
                      type="button"
                      onClick={nextWords}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_0_#2A5BB8] hover:bg-brand-hover active:translate-y-[2px]"
                    >
                      Дараагийн үгс <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                  {outcome.allCorrect && allDone && (
                    <Link href="/listening" className="inline-flex items-center gap-2 rounded-xl bg-success px-5 py-2.5 text-sm font-semibold text-ink-950">
                      <Trophy className="h-4 w-4" /> Бүх үгийг эзэмшлээ · Өөр клип
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={startListening}
                    className="inline-flex items-center gap-2 rounded-xl border border-ink-500 bg-ink-800 px-4 py-2.5 text-sm font-semibold text-mist-200 hover:bg-ink-700"
                  >
                    <RotateCcw className="h-4 w-4" /> Дахин оролдох
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCC((v) => !v)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                      showCC ? 'border-brand bg-brand/15 text-brand' : 'border-ink-500 bg-ink-800 text-mist-200 hover:bg-ink-700'
                    }`}
                  >
                    <Captions className="h-4 w-4" /> {showCC ? 'CC нуух' : 'CC харах'}
                  </button>
                  <button type="button" onClick={() => setPhase('pick')} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-mist-400 hover:text-mist-50">
                    Өөр үг
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CC — хадмал дээр үг бүр өөрийн өнгөөр, хаана алдсан */}
          {phase === 'result' && showCC && outcome && (
            <div className="mt-3">
              <p className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-mist-500">
                <span>
                  <Check className="inline h-3 w-3 text-success" /> сонссон
                </span>
                <span>
                  <X className="inline h-3 w-3 text-danger" /> алдсан
                </span>
                <span>Мөр дээр дарвал тэр хэсгийг дахин сонсоно.</span>
              </p>
              <TranscriptView segments={segments} outcomes={outcome.words} currentTime={currentTime} onSeek={(s) => playerRef.current?.seek(s, true)} />
            </div>
          )}
        </div>

        {/* ── Баруун: үг сонгох / үгийн тайлбар ── */}
        <div className="space-y-3">
          {phase === 'pick' && (
            <div className="rounded-2xl border border-ink-600/80 bg-ink-900/80 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mist-500">Олон давтагдсан үгс</p>
                {unmastered.length > 0 && (
                  <button type="button" onClick={randomPick} className="inline-flex items-center gap-1 text-xs text-brand hover:underline">
                    <Shuffle className="h-3.5 w-3.5" /> Санамсаргүй 3
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-mist-500">
                {MAX_WORDS} хүртэл үг сонгож зэрэг сонсож болно. Хэдэн удаа хэлэгдсэнийг сонсож тоол — тоо нь дууссаны дараа харагдана.
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {clip.words.map((w) => {
                  const done = mastered.has(w.word);
                  const sel = words.indexOf(w.word);
                  return (
                    <li key={w.word}>
                      <button
                        type="button"
                        onClick={() => toggleWord(w.word)}
                        aria-pressed={sel >= 0}
                        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors ${
                          sel >= 0 ? 'bg-ink-800' : done ? 'border-success/40 bg-success/5 hover:bg-success/10' : 'border-ink-600/80 bg-ink-800/60 hover:border-brand/60 hover:bg-ink-800'
                        }`}
                        style={sel >= 0 ? { borderColor: colorOf(sel), boxShadow: `0 0 0 2px ${colorOf(sel)}40` } : undefined}
                      >
                        <span className="flex items-center gap-2">
                          {sel >= 0 && (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-ink-950" style={{ background: colorOf(sel) }}>
                              {sel + 1}
                            </span>
                          )}
                          <span className={`font-semibold ${done ? 'text-success' : 'text-mist-50'}`}>{w.word}</span>
                        </span>
                        {done ? (
                          <span className="inline-flex items-center gap-1 text-xs text-success">
                            <Check className="h-3.5 w-3.5" /> {w.count}×
                          </span>
                        ) : (
                          <span className="font-mono text-xs text-mist-500">?×</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {allDone && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-success">
                  <Trophy className="h-4 w-4 text-modifier" /> Энэ клипийн бүх үгийг эзэмшсэн!
                </p>
              )}
            </div>
          )}

          {infoWord && (phase !== 'pick' || words.includes(infoWord)) && (
            <>
              {phase !== 'pick' && words.length > 1 && (
                <div className="rounded-2xl border border-ink-600/80 bg-ink-900/60 p-2">
                  <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-mist-500">Тайлбар харах үг</p>
                  {wordChips(setInfoWord)}
                </div>
              )}
              <WordInfoPanel word={infoWord} context={contextOf(infoWord)} compact={inGame} />
              {phase === 'ready' && (
                <button type="button" onClick={() => setPhase('pick')} className="text-xs text-brand hover:underline">
                  ← Үгсээ өөрчлөх
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
