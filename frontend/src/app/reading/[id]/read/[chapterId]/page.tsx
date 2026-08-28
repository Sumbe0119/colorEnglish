// frontend/src/app/reading/[id]/read/[chapterId]/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Layers,
  Lock,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import {
  getReadingAccess,
  getReadingStory,
  ReadingChapter,
  ReadingStory,
  ReadingWord,
} from '@/lib/reading-services';
import { ReadingPassage } from '@/components/reading/reading-passage';
import { StorySpeechControls } from '@/components/reading/story-speech-controls';
import {
  findNextSentenceStart,
  findPrevSentenceStart,
  speakEnglish,
  splitBodyIntoPages,
  stopSpeech,
  VoiceGender,
} from '@/components/reading/reading-utils';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/store/toast-store';

function collectWordStarts(body: string): number[] {
  const starts: number[] = [];
  const re = /[a-zA-Z]+(?:'[a-zA-Z]+)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) starts.push(m.index);
  return starts;
}

function snapToWordStart(body: string, charIndex: number): number {
  if (charIndex <= 0) return 0;
  if (charIndex >= body.length) return body.length;
  const starts = collectWordStarts(body);
  for (let i = starts.length - 1; i >= 0; i--) {
    if (starts[i] <= charIndex) return starts[i];
  }
  return starts[0] ?? 0;
}

function shiftWords(words: ReadingWord[], pageStart: number, pageEnd: number): ReadingWord[] {
  return words
    .filter(
      (w) =>
        typeof w.startOffset === 'number' &&
        typeof w.endOffset === 'number' &&
        w.startOffset >= pageStart &&
        w.startOffset < pageEnd,
    )
    .map((w) => ({
      ...w,
      startOffset: (w.startOffset as number) - pageStart,
      endOffset: Math.min(w.endOffset as number, pageEnd) - pageStart,
    }));
}

export default function ReadingChapterPage() {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const [story, setStory] = useState<ReadingStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState<VoiceGender>('female');
  const [rate, setRate] = useState(0.85);
  const [playing, setPlaying] = useState(false);
  const [speechChar, setSpeechChar] = useState(-1);
  const [resumeAt, setResumeAt] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const speechCharRef = useRef(-1);
  const resumeBaseRef = useRef(0);
  const intentionalStopRef = useRef(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace(`/login?next=/reading/${id}/read/${chapterId}`);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const access = await getReadingAccess();
        if (cancelled) return;
        const entry = access.stories.find((x) => x.id === id);
        if (!entry?.canOpen) {
          router.replace(`/reading/${id}`);
          return;
        }
        const chapterAccess = entry.chapters?.find((c) => c.id === chapterId);
        if (chapterAccess && !chapterAccess.canRead) {
          router.replace(`/reading/${id}`);
          return;
        }
        const s = await getReadingStory(id);
        if (cancelled) return;
        const ch = s.chapters?.find((c) => c.id === chapterId);
        if (ch && ch.canRead === false) {
          router.replace(`/reading/${id}`);
          return;
        }
        setStory(s);
      } catch {
        if (!cancelled) setStory(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chapterId, id, isHydrated, router, user]);

  useEffect(() => {
    return () => {
      intentionalStopRef.current = true;
      if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
      stopSpeech();
    };
  }, []);

  const chapters = useMemo(
    () => [...(story?.chapters ?? [])].sort((a, b) => a.order - b.order),
    [story],
  );

  const chapter: ReadingChapter | undefined = chapters.find((c) => c.id === chapterId);
  const chapterIndex = chapters.findIndex((c) => c.id === chapterId);
  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex >= 0 && chapterIndex < chapters.length - 1
      ? chapters[chapterIndex + 1]
      : null;
  const nextChapterLocked = nextChapter?.canRead === false;

  const handleNextChapterClick = () => {
    toast.info('Бүлэг түгжээтэй байна. VIP эрх авна уу.');
  };

  const pages = useMemo(
    () => splitBodyIntoPages(chapter?.body ?? '', 420),
    [chapter?.body],
  );

  const safePageIndex = Math.min(pageIndex, Math.max(0, pages.length - 1));
  const currentPage = pages[safePageIndex] ?? { start: 0, end: 0, text: '' };

  useEffect(() => {
    intentionalStopRef.current = true;
    if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
    stopSpeech();
    setPlaying(false);
    setResumeAt(0);
    setSpeechChar(-1);
    speechCharRef.current = -1;
    setPageIndex(0);
    setSheetOpen(false);
  }, [chapterId]);

  // Auto-advance page while speaking
  useEffect(() => {
    if (!playing || speechChar < 0 || pages.length === 0) return;
    const idx = pages.findIndex((p) => speechChar >= p.start && speechChar < p.end);
    if (idx >= 0 && idx !== pageIndex) setPageIndex(idx);
  }, [playing, speechChar, pages, pageIndex]);

  const clearFallback = () => {
    if (fallbackTimerRef.current) {
      clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  };

  const updateSpeechChar = (absoluteIndex: number) => {
    speechCharRef.current = absoluteIndex;
    setSpeechChar(absoluteIndex);
  };

  const pauseKeepingPosition = () => {
    intentionalStopRef.current = true;
    clearFallback();
    const pos = snapToWordStart(chapter?.body ?? '', Math.max(0, speechCharRef.current));
    setResumeAt(pos);
    updateSpeechChar(pos);
    stopSpeech();
    setPlaying(false);
  };

  const resetToStart = () => {
    intentionalStopRef.current = true;
    clearFallback();
    stopSpeech();
    setPlaying(false);
    setResumeAt(0);
    updateSpeechChar(-1);
    setPageIndex(0);
  };

  const startFrom = (fromChar: number) => {
    if (!chapter) return;
    const body = chapter.body;
    const start = snapToWordStart(body, fromChar);
    if (start >= body.length) {
      resetToStart();
      return;
    }

    const remaining = body.slice(start);
    // ElevenLabs тэмдэгтийн хязгаар — өгүүлбэрийн төгсгөлөөр таслана
    let toSpeak = remaining;
    if (toSpeak.length > 2500) {
      const cut = toSpeak.slice(0, 2500);
      const lastStop = Math.max(
        cut.lastIndexOf('. '),
        cut.lastIndexOf('! '),
        cut.lastIndexOf('? '),
        cut.lastIndexOf('.\n'),
      );
      toSpeak = lastStop > 200 ? cut.slice(0, lastStop + 1) : cut;
    }

    const wordStartsAbs = collectWordStarts(body).filter((s) => s >= start);

    intentionalStopRef.current = false;
    resumeBaseRef.current = start;
    setResumeAt(start);
    setPlaying(true);
    updateSpeechChar(start);

    let boundarySeen = false;
    let fallbackIdx = 0;

    clearFallback();
    const msPerWord = Math.max(180, 320 / rate);
    fallbackTimerRef.current = setInterval(() => {
      if (boundarySeen) {
        clearFallback();
        return;
      }
      fallbackIdx += 1;
      if (fallbackIdx >= wordStartsAbs.length) {
        clearFallback();
        return;
      }
      updateSpeechChar(wordStartsAbs[fallbackIdx]);
    }, msPerWord);

    speakEnglish(toSpeak, {
      gender,
      rate,
      onBoundary: (charIndex) => {
        boundarySeen = true;
        clearFallback();
        updateSpeechChar(resumeBaseRef.current + charIndex);
      },
      onEnd: () => {
        if (intentionalStopRef.current) return;
        clearFallback();
        const spokenEnd = resumeBaseRef.current + toSpeak.length;
        if (spokenEnd < body.length) {
          // Үлдсэн хэсгийг үргэлжлүүлнэ
          setResumeAt(spokenEnd);
          updateSpeechChar(spokenEnd);
          setTimeout(() => {
            if (!intentionalStopRef.current) startFrom(spokenEnd);
          }, 120);
          return;
        }
        setPlaying(false);
        setResumeAt(0);
        updateSpeechChar(body.length);
        setTimeout(() => {
          if (!intentionalStopRef.current) updateSpeechChar(-1);
        }, 800);
      },
      onError: () => {
        if (intentionalStopRef.current) return;
        clearFallback();
        setPlaying(false);
      },
    });
  };

  const skipSentence = (dir: -1 | 1) => {
    if (!chapter) return;
    const body = chapter.body;
    const base = Math.max(0, speechCharRef.current >= 0 ? speechCharRef.current : resumeAt);
    const next =
      dir === 1 ? findNextSentenceStart(body, base + 1) : findPrevSentenceStart(body, base);
    const snapped = snapToWordStart(body, next);
    if (playing) {
      intentionalStopRef.current = true;
      clearFallback();
      stopSpeech();
      setTimeout(() => startFrom(snapped), 40);
    } else {
      setResumeAt(snapped);
      updateSpeechChar(snapped);
      const idx = pages.findIndex((p) => snapped >= p.start && snapped < p.end);
      if (idx >= 0) setPageIndex(idx);
    }
  };

  const goPage = (dir: -1 | 1) => {
    setPageIndex((i) => Math.min(pages.length - 1, Math.max(0, i + dir)));
  };

  if (!isHydrated || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!story || !chapter) {
    return (
      <div className="py-20 text-center">
        <p className="text-mist-400">Бүлэг олдсонгүй</p>
        <Link href={`/reading/${id}`} className="mt-4 inline-block text-sm text-brand hover:underline">
          ← Overview
        </Link>
      </div>
    );
  }

  const canResume = !playing && resumeAt > 0 && resumeAt < chapter.body.length;
  const pageWords = shiftWords(chapter.words ?? [], currentPage.start, currentPage.end);
  const localSpeechChar =
    speechChar < 0 ? -1 : Math.max(-1, Math.min(currentPage.end, speechChar) - currentPage.start);
  const speechOnThisPage =
    speechChar >= 0 && speechChar >= currentPage.start && speechChar < currentPage.end;

  const passage = (
    <ReadingPassage
      body={currentPage.text}
      words={pageWords}
      storyId={story.id}
      tone="immersive"
      speechHighlight={{
        active: (playing || speechChar >= 0) && (speechOnThisPage || speechChar >= currentPage.end),
        charIndex:
          speechChar >= currentPage.end
            ? currentPage.text.length
            : speechOnThisPage
              ? localSpeechChar
              : -1,
      }}
    />
  );

  return (
    <>
      {/* —— Mobile immersive reader —— */}
      <div className="relative flex min-h-[100dvh] flex-col bg-black text-sky-300 md:hidden">
        <div className="flex items-center gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <Link
            href={`/reading/${id}`}
            className="rounded-full p-2 text-sky-400/80 hover:bg-white/5 hover:text-sky-200"
            aria-label="Буцах"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] uppercase tracking-wider text-sky-500/70">
              Бүлэг {chapter.order}
            </p>
            <h1 className="truncate font-body text-base font-medium text-sky-300">
              {chapter.title}
            </h1>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto px-5 pb-36 pt-4"
          onTouchStart={(e) => {
            touchStartX.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current;
            touchStartX.current = null;
            if (start == null) return;
            const dx = (e.changedTouches[0]?.clientX ?? start) - start;
            if (Math.abs(dx) < 56) return;
            if (dx < 0) goPage(1);
            else goPage(-1);
          }}
        >
          {passage}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8">
          <p className="pointer-events-auto text-sm font-medium text-white/90">
            {safePageIndex + 1} / {pages.length}
          </p>

          <div className="pointer-events-auto w-[min(calc(100vw-1.5rem),24rem)] rounded-[1.75rem] border border-white/10 bg-neutral-950/90 p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-2">
              {/* Playback controls */}
              <div className="flex min-w-0 items-center gap-1">
                <button
                  type="button"
                  onClick={resetToStart}
                  className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  aria-label="Эхнээс"
                  title="Эхнээс"
                >
                  <RotateCcw className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-45" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (playing) {
                      pauseKeepingPosition();
                    } else {
                      startFrom(resumeAt > 0 ? resumeAt : currentPage.start);
                    }
                  }}
                  className="relative mx-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-neutral-950 shadow-[0_8px_24px_-6px_rgba(249,115,22,0.7)] transition-all duration-200 hover:scale-105 hover:shadow-[0_10px_30px_-6px_rgba(249,115,22,0.85)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                  aria-label={playing ? 'Түр зогсоох' : 'Унших'}
                  title={playing ? 'Түр зогсоох' : 'Унших'}
                >
                  <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity hover:opacity-100" />

                  {playing ? (
                    <Pause className="relative h-6 w-6 fill-current" />
                  ) : (
                    <Play className="relative h-6 w-6 fill-current translate-x-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => skipSentence(1)}
                  className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  aria-label="Дараагийн өгүүлбэр"
                  title="Дараагийн өгүүлбэр"
                >
                  <RotateCw className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                </button>
              </div>

              <div className="h-8 w-px shrink-0 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

              {/* Additional controls */}
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/reading/${id}/practice`}
                  className="group flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  aria-label="Дасгал ажиллах"
                  title="Дасгал ажиллах"
                >
                  <Layers className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSheetOpen((open) => !open)}
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${sheetOpen
                      ? 'bg-white/15 text-white'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  aria-label={sheetOpen ? 'Тохиргоог хаах' : 'Тохиргоог нээх'}
                  aria-expanded={sheetOpen}
                  title={sheetOpen ? 'Тохиргоог хаах' : 'Тохиргоог нээх'}
                >
                  {sheetOpen ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronUp className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {sheetOpen && (
          <div className="absolute inset-x-0 bottom-[5.5rem] z-20 px-4 pb-[env(safe-area-inset-bottom)]">
            <div className="rounded-2xl border border-white/10 bg-[#1c1c1f]/98 p-4 shadow-xl backdrop-blur-md">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-white">Уншигч</p>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="text-xs text-white/50"
                >
                  Хаах
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['female', 'male'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    disabled={playing}
                    onClick={() => setGender(g)}
                    className={`rounded-lg px-3 py-1.5 text-sm ${gender === g
                        ? 'bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/40'
                        : 'bg-white/5 text-white/70'
                      }`}
                  >
                    {g === 'female' ? 'Эмэгтэй' : 'Эрэгтэй'}
                  </button>
                ))}
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm text-white/70">
                Хурд
                <select
                  value={rate}
                  disabled={playing}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-white"
                >
                  <option value={0.7}>Удаан</option>
                  <option value={0.85}>Энгийн</option>
                  <option value={1}>Хурдан</option>
                  <option value={1.15}>Маш хурдан</option>
                </select>
              </label>
              <div className="mt-4 flex justify-between gap-2 border-t border-white/10 pt-3">
                {prevChapter ? (
                  <Link
                    href={`/reading/${id}/read/${prevChapter.id}`}
                    className="inline-flex items-center gap-1 text-xs text-sky-400"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Өмнөх бүлэг
                  </Link>
                ) : (
                  <span />
                )}
                {nextChapter ? (
                  nextChapterLocked ? (
                    <button
                      type="button"
                      onClick={handleNextChapterClick}
                      className="inline-flex items-center gap-1 text-xs text-sky-400"
                    >
                      Next Chapter <Lock className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <Link
                      href={`/reading/${id}/read/${nextChapter.id}`}
                      className="inline-flex items-center gap-1 text-xs text-sky-400"
                    >
                      Next Chapter <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )
                ) : (
                  <Link href={`/reading/${id}`} className="text-xs text-sky-400">
                    Overview →
                  </Link>
                )}
              </div>
              {canResume && !playing && (
                <p className="mt-2 text-center text-[11px] text-white/40">
                  Үргэлжлүүлэх байрлал хадгалагдсан
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* —— Desktop / tablet —— */}
      <div className="hidden md:block">
        <Link
          href={`/reading/${id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-mist-400 hover:text-mist-50"
        >
          <ArrowLeft className="h-4 w-4" /> {story.title}
        </Link>

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-mist-500">
              Бүлэг {chapter.order} / {chapters.length}
            </p>
            <h1 className="mt-1 font-display text-xl font-semibold text-mist-50 md:text-2xl">
              {chapter.title}
            </h1>
          </div>
          <div className="flex gap-2">
            {prevChapter ? (
              <Link
                href={`/reading/${id}/read/${prevChapter.id}`}
                className="inline-flex items-center gap-1 rounded-lg border border-ink-600 px-3 py-1.5 text-xs text-mist-300 hover:border-brand/40"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Өмнөх
              </Link>
            ) : null}
            {nextChapter ? (
              nextChapterLocked ? (
                <button
                  type="button"
                  onClick={handleNextChapterClick}
                  className="inline-flex items-center gap-1 rounded-lg border border-ink-600 px-3 py-1.5 text-xs text-mist-300 hover:border-brand/40"
                >
                  Дараах <Lock className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Link
                  href={`/reading/${id}/read/${nextChapter.id}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-ink-600 px-3 py-1.5 text-xs text-mist-300 hover:border-brand/40"
                >
                  Дараах <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )
            ) : null}
          </div>
        </div>

        <StorySpeechControls
          playing={playing}
          canResume={canResume}
          gender={gender}
          rate={rate}
          onGenderChange={setGender}
          onRateChange={setRate}
          onPlay={() => {
            if (playing) pauseKeepingPosition();
            else startFrom(resumeAt > 0 ? resumeAt : 0);
          }}
          onStop={pauseKeepingPosition}
          onRestart={resetToStart}
        />

        <div className="rounded-2xl border border-ink-700 bg-ink-900 p-6 md:p-8">
          <ReadingPassage
            body={chapter.body}
            words={chapter.words ?? []}
            storyId={story.id}
            speechHighlight={{
              active: playing || speechChar >= 0,
              charIndex: speechChar,
            }}
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          {prevChapter ? (
            <Link
              href={`/reading/${id}/read/${prevChapter.id}`}
              className="inline-flex items-center gap-2 text-sm text-mist-400 hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4" /> {prevChapter.title}
            </Link>
          ) : (
            <span />
          )}
          {nextChapter ? (
            nextChapterLocked ? (
              <button
                type="button"
                onClick={handleNextChapterClick}
                className="inline-flex items-center gap-2 text-sm text-brand hover:underline"
              >
                {nextChapter.title} <Lock className="h-4 w-4" />
              </button>
            ) : (
              <Link
                href={`/reading/${id}/read/${nextChapter.id}`}
                className="inline-flex items-center gap-2 text-sm text-brand hover:underline"
              >
                {nextChapter.title} <ChevronRight className="h-4 w-4" />
              </Link>
            )
          ) : (
            <Link
              href={`/reading/${id}`}
              className="inline-flex items-center gap-2 text-sm text-brand hover:underline"
            >
              Overview рүү <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
