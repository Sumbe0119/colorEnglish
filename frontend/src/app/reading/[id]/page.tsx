// frontend/src/app/reading/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  BookMarked,
  BookOpen,
  ChevronRight,
  Clock,
  Gamepad2,
  Languages,
  Lock,
} from 'lucide-react';
import {
  getMyReadingWords,
  getReadingAccess,
  getReadingStory,
  ReadingStory,
  resolveMediaUrl,
} from '@/lib/reading-services';
import { useAuthStore } from '@/store/auth-store';
import { formatLevelCode } from '@/types/api';

export default function ReadingStoryOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [story, setStory] = useState<ReadingStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [gateError, setGateError] = useState<{
    message: string;
    practiceStoryId?: string | null;
    locked?: boolean;
  } | null>(null);
  const [nextStoryId, setNextStoryId] = useState<string | null>(null);
  const [wordsSaved, setWordsSaved] = useState(0);
  const [gamesDone, setGamesDone] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace(`/login?next=/reading/${id}`);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setGateError(null);

    (async () => {
      try {
        const access = await getReadingAccess();
        if (cancelled) return;
        const entry = access.stories.find((x) => x.id === id);
        if (!entry) {
          setStory(null);
          return;
        }
        if (!entry.canOpen) {
          setGateError({
            message: 'Өмнөх өгүүллэгийн цээжлэх тоглоом дуусгана уу',
            practiceStoryId: entry.practiceStoryId,
            locked: false,
          });
          return;
        }

        const [s, mine] = await Promise.all([
          getReadingStory(id),
          getMyReadingWords(id),
        ]);
        if (cancelled) return;
        setStory(s);
        setNextStoryId(entry.nextStoryId);
        setWordsSaved(mine.length);
        setGamesDone(entry.quizPassed && entry.racePassed);
        setIsPro(access.isPro);
      } catch {
        if (!cancelled) setStory(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, isHydrated, router, user]);

  if (!isHydrated || loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (gateError) {
    return (
      <div className="py-20 text-center">
        <p className="text-mist-200">{gateError.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {gateError.practiceStoryId && (
            <Link
              href={`/reading/${gateError.practiceStoryId}/practice`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-ink-950"
            >
              <Gamepad2 className="h-4 w-4" /> Цээжлэх тоглоом
            </Link>
          )}
          {gateError.locked && (
            <Link
              href="/billing"
              className="inline-flex items-center gap-2 rounded-xl border border-brand/40 px-4 py-2 text-sm text-brand"
            >
              VIP нээх / төлбөр
            </Link>
          )}
          <Link href="/reading" className="text-sm text-mist-400 hover:underline">
            ← Буцах
          </Link>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="py-20 text-center">
        <p className="text-mist-400">Өгүүллэг олдсонгүй</p>
        <Link href="/reading" className="mt-4 inline-block text-sm text-brand hover:underline">
          ← Буцах
        </Link>
      </div>
    );
  }

  const chapters = [...(story.chapters ?? [])].sort((a, b) => a.order - b.order);
  const readableChapters = chapters.filter((ch) => ch.canRead ?? (isPro || ch.isFree));
  const firstChapter = readableChapters[0] ?? null;
  const stats = story.stats ?? {
    chapters: chapters.length,
    words: story._count?.words ?? story.words?.length ?? 0,
    minutes: 1,
  };
  const cover = resolveMediaUrl(story.coverUrl);

  return (
    <div className="relative -mx-4 pb-24 sm:-mx-2 sm:pb-6 md:mx-0 md:pb-0">
      {/* Compact hero */}
      <div className="relative grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-4 py-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-5 sm:py-5">
        {/* Cover — fixed 3:4 ratio */}
        <div className="group relative aspect-[3/4] w-full self-start overflow-hidden rounded-2xl border border-white/15 bg-ink-800 shadow-[0_14px_35px_-16px_rgba(0,0,0,0.9)]">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={story.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand/30 via-ink-900 to-ink-950 p-3 text-center">
              <BookOpen className="h-7 w-7 text-brand sm:h-9 sm:w-9" />

              <p className="line-clamp-4 font-display text-[10px] font-semibold leading-4 text-mist-100 sm:text-xs sm:leading-5">
                {story.title}
              </p>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/75 to-transparent" />

          <span className="absolute bottom-2 left-2 inline-flex rounded-full border border-white/10 bg-brand px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-ink-950 shadow-lg sm:bottom-2.5 sm:left-2.5 sm:px-2.5 sm:py-1 sm:text-[9px]">
            {formatLevelCode(story.levelCode)}
          </span>
        </div>

        {/* Story information */}
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-brand/80 sm:text-[10px]">
            Унших зохиол
          </p>

          <h1 className="mt-1.5 line-clamp-2 font-display text-lg font-semibold leading-tight text-mist-50 sm:text-2xl">
            {story.title}
          </h1>

          {story.author && (
            <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[11px] text-mist-400 sm:text-xs">
              <span className="shrink-0 text-mist-600">Зохиолч</span>
              <span className="text-mist-600">·</span>
              <span className="truncate">{story.author}</span>
            </p>
          )}

          {/* Stats */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 sm:gap-2">
            <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-sky-500/15 bg-sky-500/10 px-2 py-1.5 sm:flex-row sm:items-center sm:gap-2 sm:rounded-xl sm:px-2.5 sm:py-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sky-500/15 text-sky-400 sm:h-7 sm:w-7 sm:rounded-lg">
                <BookMarked className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-mist-100 sm:text-xs">
                  {stats.chapters}
                </p>
                <p className="truncate text-[8px] text-mist-500 sm:text-[10px]">
                  бүлэг
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-violet-500/15 bg-violet-500/10 px-2 py-1.5 sm:flex-row sm:items-center sm:gap-2 sm:rounded-xl sm:px-2.5 sm:py-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-300 sm:h-7 sm:w-7 sm:rounded-lg">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-mist-100 sm:text-xs">
                  ~{stats.minutes}
                </p>
                <p className="truncate text-[8px] text-mist-500 sm:text-[10px]">
                  минут
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-emerald-500/15 bg-emerald-500/10 px-2 py-1.5 sm:flex-row sm:items-center sm:gap-2 sm:rounded-xl sm:px-2.5 sm:py-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400 sm:h-7 sm:w-7 sm:rounded-lg">
                <Languages className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-mist-100 sm:text-xs">
                  {stats.words}
                </p>
                <p className="truncate text-[8px] text-mist-500 sm:text-[10px]">
                  шинэ үг
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-3 border-t border-ink-700/70 pt-3">
            <h2 className="font-display text-xs font-semibold text-mist-50 sm:text-sm">
              Зохиолын тухай
            </h2>

            <p className="mt-1 line-clamp-3 text-[11px] leading-5 text-mist-400 sm:text-xs sm:leading-5">
              {story.description?.trim() ||
                'Энэ өгүүллэгийн дэлгэрэнгүй тайлбар одоогоор байхгүй.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-4 sm:mx-0">
        {/* Description */}


        {/* Chapters */}
        {chapters.length > 0 && (
          <section className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-base font-semibold text-mist-50">
                Бүлгүүд
              </h2>

              <span className="rounded-full bg-ink-800 px-2 py-0.5 text-[11px] text-mist-400">
                {chapters.length}
              </span>
            </div>

            {!isPro && (
              <p className="mt-1 text-[11px] leading-4 text-mist-500">
                Цоожтой бүлэгт VIP эрх шаардлагатай.
              </p>
            )}

            <ul className="mt-2.5 space-y-2">
              {chapters.map((ch) => {
                const canRead = ch.canRead ?? (isPro || !!ch.isFree);
                const wordCount = ch._count?.words ?? ch.words?.length ?? 0;

                if (canRead) {
                  return (
                    <li key={ch.id}>
                      <Link
                        href={`/reading/${story.id}/read/${ch.id}`}
                        className="group flex min-w-0 items-center gap-3 rounded-xl border border-ink-700 bg-ink-900 px-3 py-2.5 transition hover:border-brand/40 hover:bg-ink-800 active:bg-ink-800"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 font-display text-xs font-semibold text-brand">
                          {ch.order}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="truncate text-sm font-medium text-mist-100">
                              {ch.title}
                            </span>

                            {ch.isFree && !isPro && (
                              <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400">
                                Үнэгүй
                              </span>
                            )}
                          </span>

                          <span className="mt-0.5 block text-[11px] text-mist-500">
                            {wordCount} үг
                          </span>
                        </span>

                        <ChevronRight className="h-4 w-4 shrink-0 text-mist-600 transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={ch.id}>
                    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-ink-700 bg-ink-900/60 px-3 py-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-800 font-display text-xs font-semibold text-mist-500">
                        {ch.order}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-mist-300">
                          {ch.title}
                        </span>

                        <span className="mt-0.5 block text-[11px] text-mist-500">
                          {wordCount} үг
                        </span>
                      </span>

                      <Link
                        href="/billing"
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand/15 px-2.5 py-1.5 text-[11px] font-medium text-brand transition hover:bg-brand/25"
                      >
                        <Lock className="h-3 w-3" />
                        VIP
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Desktop CTA */}
        <div className="mt-5 hidden sm:block">
          {firstChapter ? (
            <Link
              href={`/reading/${story.id}/read/${firstChapter.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand/80 py-3 text-sm font-semibold text-ink-950 shadow-md shadow-brand/15 transition hover:brightness-110"
            >
              <BookOpen className="h-4 w-4" />
              Уншиж эхлэх
            </Link>
          ) : chapters.length > 0 ? (
            <Link
              href="/billing"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-ink-950"
            >
              <Lock className="h-4 w-4" />
              VIP нээж унших
            </Link>
          ) : (
            <p className="rounded-xl border border-dashed border-ink-600 p-3 text-center text-xs text-mist-400">
              Бүлэг хараахан нэмээгүй байна.
            </p>
          )}
        </div>

        {/* Practice alert */}
        {wordsSaved > 0 && nextStoryId && !gamesDone && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
              <Gamepad2 className="h-4 w-4 text-amber-300" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-mist-50">
                Дараагийн өгүүллэг нээх
              </p>

              <p className="mt-0.5 truncate text-[11px] text-mist-400">
                Хадгалсан {wordsSaved} үгээр тоглоом тоглоно уу
              </p>
            </div>

            <Link
              href={`/reading/${story.id}/practice`}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-ink-950"
            >
              Эхлэх
            </Link>
          </div>
        )}

        {gamesDone && nextStoryId && (
          <div className="mt-4 text-center">
            <Link
              href={`/reading/${nextStoryId}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline"
            >
              Дараагийн өгүүллэг
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Mobile sticky CTA */}
      {firstChapter ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-700/80 bg-ink-950/95 px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md sm:hidden">
          <Link
            href={`/reading/${story.id}/read/${firstChapter.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 py-3 text-sm font-semibold text-black shadow-lg shadow-orange-500/20 transition active:scale-[0.98]"
          >
            <BookOpen className="h-4 w-4" />
            Уншиж эхлэх
          </Link>
        </div>
      ) : chapters.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-700/80 bg-ink-950/95 px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md sm:hidden">
          <Link
            href="/billing"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-ink-950 transition active:scale-[0.98]"
          >
            <Lock className="h-4 w-4" />
            VIP нээж унших
          </Link>
        </div>
      ) : null}
    </div>
  );
}
