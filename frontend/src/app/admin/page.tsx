'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Pencil, Plus } from 'lucide-react';
import { getAdminReadingStories, ReadingStorySummary } from '@/lib/reading-services';
import { formatLevelCode } from '@/types/api';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const [stories, setStories] = useState<ReadingStorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    getAdminReadingStories()
      .then(setStories)
      .catch(() => {
        setStories([]);
        setLoadError(
          'Reading API олдсонгүй (404). Backend-ийг дахин асаана уу: cd backend && npm run dev',
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Reading өгүүллэг</h2>
          <p className="mt-1 text-sm text-mist-400">Жижиг өгүүллэг + үг бүрийн монгол орчуулга</p>
        </div>
        <Link href="/admin/stories/new">
          <Button>
            <Plus className="h-4 w-4" /> Шинэ өгүүллэг
          </Button>
        </Link>
      </div>

      {loadError && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          {loadError}
        </div>
      )}

      {!loadError && stories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-600 p-10 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-mist-500" />
          <p className="text-mist-400">Өгүүллэг байхгүй</p>
          <Link href="/admin/stories/new" className="mt-4 inline-block">
            <Button variant="secondary">Эхний өгүүллэг үүсгэх</Button>
          </Link>
        </div>
      ) : !loadError ? (
        <div className="space-y-3">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/admin/stories/${story.id}`}
              className="flex items-center gap-4 rounded-xl border border-ink-700 bg-ink-900 p-4 transition-colors hover:border-brand/30 hover:bg-ink-800"
            >
              <BookOpen className="h-5 w-5 shrink-0 text-brand" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-mist-50">{story.title}</p>
                <p className="text-xs text-mist-400">
                  {formatLevelCode(story.levelCode)} · {story._count.words} үг
                  {!story.isPublished && <span className="ml-2 text-verb">(ноорог)</span>}
                </p>
              </div>
              <Pencil className="h-4 w-4 text-mist-500" />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
