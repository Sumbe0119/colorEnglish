// frontend/src/app/reading/words/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Car, Gamepad2, ListChecks, Trash2, Volume2, X } from 'lucide-react';
import {
  deleteMyReadingWord,
  getMyReadingWords,
  UserReadingWord,
} from '@/lib/reading-services';
import { speakEnglishWord } from '@/components/reading/reading-utils';
import { toast } from '@/store/toast-store';
import { formatLevelCode, LevelCode } from '@/types/api';

type StoryGroup = {
  storyId: string;
  title: string;
  levelCode?: LevelCode;
  words: UserReadingWord[];
};

type GameChoice = 'quiz' | 'race' | 'both';

export default function MyReadingWordsPage() {
  const router = useRouter();
  const [words, setWords] = useState<UserReadingWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pickerGroup, setPickerGroup] = useState<StoryGroup | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyReadingWords();
      setWords(data);
    } catch {
      setError('Үгсийг ачаалж чадсангүй');
      setWords([]);
      toast.error('Үгсийг ачаалж чадсангүй');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const groups = useMemo(() => {
    const map = new Map<string, StoryGroup>();
    for (const w of words) {
      const key = w.storyId;
      const existing = map.get(key);
      if (existing) {
        existing.words.push(w);
      } else {
        map.set(key, {
          storyId: w.storyId,
          title: w.story?.title ?? 'Өгүүллэг',
          levelCode: w.story?.levelCode,
          words: [w],
        });
      }
    }
    return [...map.values()];
  }, [words]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMyReadingWord(id);
      setWords((prev) => prev.filter((w) => w.id !== id));
      toast.success('Үг устгалаа');
    } catch {
      toast.error('Устгахад алдаа гарлаа');
    } finally {
      setDeletingId(null);
    }
  };

  const startGame = (storyId: string, game: GameChoice) => {
    setPickerGroup(null);
    router.push(`/reading/${storyId}/practice?replay=1&game=${game}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-mist-50">Цээжилсэн үгс</h1>
      <p className="mt-2 text-sm text-mist-400">
        Уншихдаа «Шинэ үг» дарж хадгалсан үгс энд харагдана. Нийт {words.length} үг. Өгүүллэг
        бүрийн дэргэд бататгах тоглоом тоглож болно.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {words.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-ink-600 p-8 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-mist-500" />
          <p className="text-mist-400">Одоогоор хадгалсан үг байхгүй.</p>
          <Link href="/reading" className="mt-4 inline-block text-sm text-brand hover:underline">
            Өгүүллэг унших →
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {groups.map((group) => (
            <section key={group.storyId}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-semibold text-mist-50">{group.title}</h2>
                  <p className="mt-0.5 text-xs text-mist-500">
                    {group.levelCode ? `${formatLevelCode(group.levelCode)} · ` : ''}
                    {group.words.length} үг
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPickerGroup(group)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-ink-950 hover:bg-brand/90"
                  >
                    <Gamepad2 className="h-3.5 w-3.5" />
                    Бататгах тоглоом
                  </button>
                  <Link
                    href={`/reading/${group.storyId}`}
                    className="rounded-xl border border-ink-600 px-3 py-2 text-xs text-mist-300 hover:border-brand/40 hover:text-brand"
                  >
                    Өгүүллэг
                  </Link>
                </div>
              </div>

              <ul className="space-y-2">
                {group.words.map((w) => (
                  <li
                    key={w.id}
                    className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-900 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-brand">{w.word}</p>
                      <p className="mt-0.5 text-sm text-mist-300">{w.meaningMn}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakEnglishWord(w.word)}
                      className="rounded-lg p-2 text-mist-400 hover:bg-ink-800 hover:text-mist-50"
                      title="Дуудлага"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === w.id}
                      onClick={() => handleDelete(w.id)}
                      className="rounded-lg p-2 text-mist-400 hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                      title="Устгах"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {pickerGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm"
          onClick={() => setPickerGroup(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-ink-600 bg-ink-900 p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-mist-500">Бататгах тоглоом</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-mist-50">
                  {pickerGroup.title}
                </h3>
                <p className="mt-1 text-xs text-mist-400">
                  {pickerGroup.words.length} үг · аль тоглоом тоглох вэ?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPickerGroup(null)}
                className="rounded-lg p-1.5 text-mist-400 hover:bg-ink-800 hover:text-mist-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => startGame(pickerGroup.storyId, 'quiz')}
                className="flex w-full items-center gap-3 rounded-xl border border-ink-600 bg-ink-800/60 px-4 py-3 text-left transition-colors hover:border-brand/40 hover:bg-ink-800"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <ListChecks className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-mist-50">Mini-quiz</span>
                  <span className="block text-xs text-mist-400">Англи үг → монгол сонголт</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => startGame(pickerGroup.storyId, 'race')}
                className="flex w-full items-center gap-3 rounded-xl border border-ink-600 bg-ink-800/60 px-4 py-3 text-left transition-colors hover:border-brand/40 hover:bg-ink-800"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                  <Car className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-mist-50">Lane race</span>
                  <span className="block text-xs text-mist-400">3 эгнээний машины тоглоом</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => startGame(pickerGroup.storyId, 'both')}
                className="flex w-full items-center gap-3 rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-left transition-colors hover:bg-brand/20"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-ink-950">
                  <Gamepad2 className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-mist-50">Хоёулаа</span>
                  <span className="block text-xs text-mist-400">Quiz → Race дараалан</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
