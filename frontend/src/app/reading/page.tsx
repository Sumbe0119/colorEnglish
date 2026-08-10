// frontend/src/app/reading/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Gamepad2, Lock, Sparkles } from 'lucide-react';
import {
  getReadingAccess,
  getReadingStories,
  ReadingStoryAccess,
  ReadingStorySummary,
  resolveMediaUrl,
} from '@/lib/reading-services';
import { useAuthStore } from '@/store/auth-store';
import { formatLevelCode } from '@/types/api';

export default function ReadingListPage() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [stories, setStories] = useState<ReadingStorySummary[]>([]);
  const [accessMap, setAccessMap] = useState<Map<string, ReadingStoryAccess>>(new Map());
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await getReadingStories();
      setStories(list);

      if (user) {
        const access = await getReadingAccess();
        setIsPro(access.isPro);
        setAccessMap(new Map(access.stories.map((s) => [s.id, s])));
      } else {
        setIsPro(false);
        const map = new Map<string, ReadingStoryAccess>();
        list.forEach((s) => {
          map.set(s.id, {
            id: s.id,
            title: s.title,
            levelCode: s.levelCode,
            order: s.order,
            _count: s._count,
            free: false,
            locked: true,
            gamesBlocked: false,
            practiceStoryId: null,
            canOpen: true,
            quizPassed: false,
            racePassed: false,
            wordsSaved: 0,
            nextStoryId: null,
          });
        });
        setAccessMap(map);
      }
    } catch {
      setStories([]);
      setLoadError('Reading API олдсонгүй. Backend-ийг дахин асаана уу.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isHydrated) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, user?.id]);

  if (loading || !isHydrated) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-mist-50 md:text-3xl">
            Унших өгүүллэг
          </h1>
          <p className="mt-2 text-sm text-mist-400">
            Өгүүллэг нээлттэй. Бүлэг бүрийг VIP эсвэл админ unlock-оор уншина.
          </p>
        </div>
        {!isPro && (
          <Link
            href={user ? '/billing' : '/login?next=/billing'}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
          >
            <Sparkles className="h-4 w-4" />
            VIP нээх
          </Link>
        )}
        {isPro && (
          <Link
            href="/billing"
            className="rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-brand hover:bg-brand/25"
          >
            VIP идэвхтэй
          </Link>
        )}
      </div>

      {loadError && (
        <div className="mt-6 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          {loadError}
        </div>
      )}

      {!loadError && stories.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-ink-600 p-8 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-mist-500" />
          <p className="text-mist-400">Одоогоор нийтлэгдсэн өгүүллэг байхгүй.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 lg:gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {stories.map((story) => {
            const access = accessMap.get(story.id);
            const gamesBlocked = access?.gamesBlocked ?? false;
            const hasLockedChapters = access?.locked ?? (!isPro && !!user);
            const free = access?.free ?? false;
            const cover = resolveMediaUrl(story.coverUrl);
            const chapters = story._count.chapters;
            const words = story._count.words;
            const href = !user
              ? `/login?next=/reading/${story.id}`
              : gamesBlocked && access?.practiceStoryId
                ? `/reading/${access.practiceStoryId}/practice`
                : `/reading/${story.id}`;

            return (
              <Link
                key={story.id}
                href={href}
                className={`group flex flex-col overflow-hidden rounded-2xl border bg-ink-900 shadow-card transition-all hover:-translate-y-0.5 ${
                  gamesBlocked
                    ? 'border-amber-500/40 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/10'
                    : 'border-ink-600 hover:border-brand/50 hover:shadow-lg hover:shadow-brand/10'
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-800">
                  {cover ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cover}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 h-full w-full object-cover blur-xl"
                      />
                      <div className="absolute inset-0 bg-ink-950/40" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cover}
                        alt={story.title}
                        className="relative z-10 h-full w-full object-contain transition-transform duration-300"
                      />
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand/20 via-ink-800 to-ink-950 p-4">
                      <BookOpen className="h-8 w-8 text-brand/70" />
                      <p className="line-clamp-2 text-center font-display text-sm font-semibold text-mist-200">
                        {story.title}
                      </p>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/3 bg-gradient-to-t from-ink-950/90 to-transparent" />
                  <span className="absolute left-3 top-3 z-20 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    {formatLevelCode(story.levelCode)}
                  </span>
                  {gamesBlocked && (
                    <span className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/90 text-ink-950">
                      <Gamepad2 className="h-4 w-4" />
                    </span>
                  )}
                  {!gamesBlocked && hasLockedChapters && (
                    <span
                      className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/80 text-mist-200"
                      title="Зарим бүлэг цоожтой"
                    >
                      <Lock className="h-4 w-4" />
                    </span>
                  )}
                  {free && (
                    <span className="absolute bottom-3 left-3 z-20 rounded-full bg-success/90 px-2 py-0.5 text-[10px] font-semibold text-ink-950">
                      Үнэгүй бүлэг
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h2 className="line-clamp-2 font-display text-base font-semibold leading-snug text-mist-50">
                    {story.title}
                  </h2>
                  {story.author && (
                    <p className="mt-1 truncate text-xs text-mist-400">{story.author}</p>
                  )}
                  <p className="mt-2 text-xs text-mist-400">
                    {chapters != null ? `${chapters} бүлэг` : null}
                    {chapters != null ? ' · ' : ''}
                    {words} үг
                  </p>
                  {story.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-mist-400">
                      {story.description}
                    </p>
                  )}
                </div>

                <div
                  className={`border-t p-3 ${
                    gamesBlocked ? 'border-amber-500/20' : 'border-ink-600'
                  }`}
                >
                  {gamesBlocked ? (
                    <span className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500/15 py-2.5 text-xs font-semibold text-amber-300">
                      <Gamepad2 className="h-3.5 w-3.5" /> Цээжлэх тоглоом
                    </span>
                  ) : (
                    <span className="flex w-full items-center justify-center rounded-xl bg-brand/15 py-2.5 text-xs font-semibold text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                      Унших
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
