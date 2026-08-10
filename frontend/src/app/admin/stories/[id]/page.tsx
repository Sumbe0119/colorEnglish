// frontend/src/app/admin/stories/[id]/page.tsx
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Languages, Lock, Plus, Trash2, Unlock } from 'lucide-react';
import {
  addReadingWord,
  autoTranslateChapter,
  createReadingChapter,
  deleteReadingChapter,
  deleteReadingStory,
  deleteReadingWord,
  getAdminReadingStory,
  updateReadingChapter,
  updateReadingStory,
  ReadingChapter,
  ReadingStory,
} from '@/lib/reading-services';
import { getApiErrorMessage } from '@/lib/api-error';
import { ReadingPassage } from '@/components/reading/reading-passage';
import { ReadingWordEditor } from '@/components/admin/reading-word-editor';
import { FormError, FormField, textareaClass } from '@/components/admin/admin-form-fields';
import { CoverUploadField } from '@/components/admin/cover-upload-field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/store/toast-store';

export default function EditStoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [story, setStory] = useState<ReadingStory | null>(null);
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterBody, setChapterBody] = useState('');
  const [word, setWord] = useState('');
  const [meaningMn, setMeaningMn] = useState('');
  const [startOffset, setStartOffset] = useState<number | null>(null);
  const [endOffset, setEndOffset] = useState<number | null>(null);
  const [contextHint, setContextHint] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingChapter, setSavingChapter] = useState(false);
  const [adding, setAdding] = useState(false);
  const [translating, setTranslating] = useState(false);
  const meaningRef = useRef<HTMLInputElement>(null);

  const chapters = [...(story?.chapters ?? [])].sort((a, b) => a.order - b.order);
  const activeChapter: ReadingChapter | undefined = chapters.find((c) => c.id === activeChapterId);

  const selectChapter = (ch: ReadingChapter) => {
    setActiveChapterId(ch.id);
    setChapterTitle(ch.title);
    setChapterBody(ch.body);
    clearWordForm();
  };

  const load = async () => {
    try {
      const data = await getAdminReadingStory(id);
      setStory(data);
      setTitle(data.title);
      setCoverUrl(data.coverUrl ?? '');
      setDescription(data.description ?? '');
      setAuthor(data.author ?? '');
      setIsPublished(data.isPublished ?? false);
      const sorted = [...(data.chapters ?? [])].sort((a, b) => a.order - b.order);
      setActiveChapterId((prev) => {
        const keep = (prev && sorted.find((c) => c.id === prev)) || sorted[0];
        if (keep) {
          setChapterTitle(keep.title);
          setChapterBody(keep.body);
          return keep.id;
        }
        setChapterTitle('');
        setChapterBody('');
        return null;
      });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Өгүүллэг ачаалахад алдаа гарлаа'));
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const clearWordForm = () => {
    setWord('');
    setMeaningMn('');
    setStartOffset(null);
    setEndOffset(null);
    setContextHint('');
  };

  const saveMeta = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateReadingStory(id, {
        title,
        coverUrl: coverUrl.trim() || null,
        description: description.trim() || null,
        author: author.trim() || null,
        isPublished,
      });
      toast.success('Өгүүллэг хадгаллаа');
      await load();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Хадгалахад алдаа гарлаа');
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const saveChapter = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeChapterId) return;
    setSavingChapter(true);
    setError(null);
    try {
      await updateReadingChapter(activeChapterId, {
        title: chapterTitle.trim(),
        body: chapterBody,
      });
      toast.success('Бүлэг хадгаллаа');
      await load();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Бүлэг хадгалахад алдаа гарлаа');
      setError(msg);
      toast.error(msg);
    } finally {
      setSavingChapter(false);
    }
  };

  const addChapter = async () => {
    setError(null);
    try {
      const nextOrder = (chapters[chapters.length - 1]?.order ?? 0) + 1;
      const ch = await createReadingChapter(id, {
        title: `Chapter ${nextOrder}`,
        body: 'New chapter text…',
        order: nextOrder,
      });
      await load();
      setActiveChapterId(ch.id);
      setChapterTitle(ch.title);
      setChapterBody(ch.body);
      toast.success('Бүлэг нэмэгдлээ');
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Бүлэг нэмэхэд алдаа гарлаа');
      setError(msg);
      toast.error(msg);
    }
  };

  const removeChapter = async () => {
    if (!activeChapterId) return;
    if (!confirm('Энэ бүлгийг устгах уу?')) return;
    setError(null);
    try {
      await deleteReadingChapter(activeChapterId);
      setActiveChapterId(null);
      toast.success('Бүлэг устгалаа');
      await load();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Бүлэг устгахад алдаа гарлаа');
      setError(msg);
      toast.error(msg);
    }
  };

  const runAutoTranslate = async (overwrite = false) => {
    if (!activeChapterId) return;
    setTranslating(true);
    setError(null);
    try {
      await autoTranslateChapter(activeChapterId, overwrite);
      toast.success('Автомат орчуулга дууслаа');
      await load();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Автомат орчуулга амжилтгүй боллоо');
      setError(msg);
      toast.error(msg);
    } finally {
      setTranslating(false);
    }
  };

  const addWord = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeChapterId) return;
    setError(null);
    setAdding(true);
    try {
      await addReadingWord(id, {
        word: word.trim(),
        meaningMn: meaningMn.trim(),
        chapterId: activeChapterId,
        ...(startOffset !== null && endOffset !== null
          ? { startOffset, endOffset }
          : {}),
      });
      clearWordForm();
      toast.success('Үг нэмэгдлээ');
      await load();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Үг нэмэхэд алдаа гарлаа');
      setError(msg);
      toast.error(msg);
    } finally {
      setAdding(false);
    }
  };

  const removeWord = async (wordId: string) => {
    setError(null);
    try {
      await deleteReadingWord(wordId);
      toast.success('Үг устгалаа');
      await load();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Үг устгахад алдаа гарлаа');
      setError(msg);
      toast.error(msg);
    }
  };

  const handleWordUpdate = (updated: ReadingStory['words'][number]) => {
    setStory((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        chapters: prev.chapters.map((ch) =>
          ch.id === activeChapterId
            ? {
                ...ch,
                words: ch.words.map((w) => (w.id === updated.id ? { ...w, ...updated } : w)),
              }
            : ch,
        ),
      };
    });
  };

  const removeStory = async () => {
    if (!confirm('Энэ өгүүллэгийг устгах уу?')) return;
    try {
      await deleteReadingStory(id);
      toast.success('Өгүүллэг устгалаа');
      router.push('/admin');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Өгүүллэг устгахад алдаа гарлаа'));
    }
  };

  if (!story) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  const chapterWords = activeChapter?.words ?? [];

  return (
    <div className="space-y-10">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-mist-400 hover:text-mist-50">
        ← Буцах
      </Link>

      {error && <FormError message={error} />}

      <section className="rounded-2xl border border-ink-700 bg-ink-900 p-6">
        <h2 className="mb-4 font-display text-lg font-semibold">Өгүүллэгийн мэдээлэл</h2>
        <form onSubmit={saveMeta} className="max-w-2xl space-y-4">
          <Input label="Гарчиг" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input
            label="Зохиогч"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="ColorEnglish"
          />
          <CoverUploadField
            value={coverUrl}
            onChange={setCoverUrl}
            onError={setError}
          />
          <FormField label="Зохиолын тухай">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={textareaClass}
              placeholder="Богино тайлбар…"
            />
          </FormField>
          <label className="flex items-center gap-2 text-sm text-mist-300">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            Нийтлэх
          </label>
          <div className="flex gap-3">
            <Button type="submit" isLoading={saving}>
              Хадгалах
            </Button>
            <Button type="button" variant="ghost" onClick={removeStory} className="text-danger">
              <Trash2 className="h-4 w-4" /> Устгах
            </Button>
            {isPublished && (
              <Link
                href={`/reading/${id}`}
                className="ml-auto self-center text-sm text-brand hover:underline"
              >
                Overview харах →
              </Link>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-ink-700 bg-ink-900 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Бүлгүүд ({chapters.length})</h2>
          <Button type="button" variant="secondary" onClick={addChapter}>
            <Plus className="h-4 w-4" /> Бүлэг нэмэх
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => selectChapter(ch)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
                ch.id === activeChapterId
                  ? 'bg-brand text-ink-950'
                  : 'bg-ink-800 text-mist-300 hover:bg-ink-700'
              }`}
            >
              {ch.isFree ? (
                <Unlock className="h-3 w-3" />
              ) : (
                <Lock className="h-3 w-3 opacity-70" />
              )}
              {ch.order}. {ch.title}
            </button>
          ))}
        </div>

        {activeChapter ? (
          <form onSubmit={saveChapter} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-700 bg-ink-800/60 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-mist-100">
                  {activeChapter.isFree ? 'Үнэгүй нээлттэй' : 'Цоожтой (VIP шаардлагатай)'}
                </p>
                <p className="mt-0.5 text-xs text-mist-500">
                  Default бүгд цоожтой. Unlock хийвэл төлбөргүй уншиж болно.
                </p>
              </div>
              <Button
                type="button"
                variant={activeChapter.isFree ? 'secondary' : 'primary'}
                onClick={async () => {
                  try {
                    const updated = await updateReadingChapter(activeChapter.id, {
                      isFree: !activeChapter.isFree,
                    });
                    setStory((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        chapters: prev.chapters.map((c) =>
                          c.id === updated.id ? { ...c, isFree: updated.isFree } : c,
                        ),
                      };
                    });
                    toast.success(
                      updated.isFree ? 'Бүлгийн цоож тайллаа' : 'Бүлгийг цоожиллоо',
                    );
                  } catch (err: unknown) {
                    toast.error(getApiErrorMessage(err, 'Цоож солиход алдаа гарлаа'));
                  }
                }}
              >
                {activeChapter.isFree ? (
                  <>
                    <Lock className="h-4 w-4" /> Цоожлох
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4" /> Цоож тайлах
                  </>
                )}
              </Button>
            </div>
            <Input
              label="Бүлгийн гарчиг"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              required
            />
            <FormField label="Бүлгийн текст">
              <textarea
                value={chapterBody}
                onChange={(e) => setChapterBody(e.target.value)}
                rows={8}
                className={textareaClass}
                required
              />
            </FormField>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" isLoading={savingChapter}>
                Бүлэг хадгалах
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={removeChapter}
                className="text-danger"
                disabled={chapters.length <= 1}
              >
                <Trash2 className="h-4 w-4" /> Бүлэг устгах
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-mist-400">Бүлэг сонгоно уу эсвэл шинээр нэмнэ үү.</p>
        )}
      </section>

      {activeChapter && (
        <>
          <section className="rounded-2xl border border-ink-700 bg-ink-900 p-6">
            <h2 className="mb-2 font-display text-lg font-semibold">Текстээс үг сонгох</h2>
            <p className="mb-4 text-sm text-mist-400">
              Идэвхтэй бүлэг: <strong className="text-mist-200">{activeChapter.title}</strong>
            </p>
            <ReadingPassage
              key={`${activeChapter.id}-${chapterWords.map((w) => w.id).join('-')}`}
              body={chapterBody}
              words={chapterWords}
              interactive="all"
              onSelectToken={(token) => {
                setWord(token.word);
                setStartOffset(token.startOffset);
                setEndOffset(token.endOffset);
                setContextHint(token.contextSentence);
                setMeaningMn('');
                setError(null);
                setTimeout(() => meaningRef.current?.focus(), 0);
              }}
            />
          </section>

          <section className="rounded-2xl border border-ink-700 bg-ink-900 p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">
                Үгийн орчуулга ({chapterWords.length})
              </h2>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  isLoading={translating}
                  onClick={() => runAutoTranslate(false)}
                >
                  <Languages className="h-4 w-4" /> Автоматаар орчуулах
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={translating}
                  onClick={() => runAutoTranslate(true)}
                  className="text-mist-400"
                >
                  Дахин орчуулах
                </Button>
              </div>
            </div>

            <form
              onSubmit={addWord}
              className="mb-6 grid gap-3 rounded-xl border border-dashed border-ink-600 p-4 sm:grid-cols-2"
            >
              <Input
                label="Англи үг / хэллэг"
                value={word}
                onChange={(e) => {
                  setWord(e.target.value);
                  setStartOffset(null);
                  setEndOffset(null);
                  setContextHint('');
                }}
                required
              />
              <Input
                ref={meaningRef}
                label="Монгол орчуулга"
                value={meaningMn}
                onChange={(e) => setMeaningMn(e.target.value)}
                required
              />
              {contextHint && (
                <p className="rounded-lg bg-ink-800 px-3 py-2 text-xs text-mist-400 sm:col-span-2">
                  Сонгосон өгүүлбэр: <span className="text-mist-200">{contextHint}</span>
                </p>
              )}
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" variant="secondary" isLoading={adding}>
                  <Plus className="h-4 w-4" /> Нэмэх
                </Button>
                {(word || meaningMn) && (
                  <Button type="button" variant="ghost" onClick={clearWordForm}>
                    Цэвэрлэх
                  </Button>
                )}
              </div>
            </form>

            <div className="grid gap-3 sm:grid-cols-2">
              {chapterWords.map((w) => (
                <ReadingWordEditor
                  key={w.id}
                  item={w}
                  onUpdate={handleWordUpdate}
                  onDelete={removeWord}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
