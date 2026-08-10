'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { createReadingStory, autoTranslateStory } from '@/lib/reading-services';
import { getApiErrorMessage } from '@/lib/api-error';
import { LEVEL_CODES, LevelCode, formatLevelCode } from '@/types/api';
import { FormError, FormField, selectClass, textareaClass } from '@/components/admin/admin-form-fields';
import { CoverUploadField } from '@/components/admin/cover-upload-field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/store/toast-store';

export default function NewStoryPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [levelCode, setLevelCode] = useState<LevelCode>('A1');
  const [isPublished, setIsPublished] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const story = await createReadingStory({
        title,
        body,
        levelCode,
        isPublished,
        coverUrl: coverUrl.trim() || undefined,
        description: description.trim() || undefined,
        author: author.trim() || undefined,
      });
      if (autoTranslate) {
        await autoTranslateStory(story.id);
      }
      toast.success('Өгүүллэг үүслээ');
      router.push(`/admin/stories/${story.id}`);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Өгүүллэг үүсгэхэд алдаа гарлаа');
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-sm text-mist-400 hover:text-mist-50">
        ← Буцах
      </Link>

      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15">
          <BookOpen className="h-6 w-6 text-brand" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">Шинэ өгүүллэг</h1>
          <p className="mt-1 text-sm text-mist-400">Текст оруулаад автоматаар орчуулах боломжтой</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-ink-700 bg-ink-900 p-6">
        {error && <FormError message={error} />}

        <Input label="Гарчиг" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input
          label="Зохиогч"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="ColorEnglish"
        />
        <CoverUploadField value={coverUrl} onChange={setCoverUrl} onError={setError} />
        <FormField label="Зохиолын тухай">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={textareaClass}
            placeholder="Богино тайлбар…"
          />
        </FormField>
        <FormField label="Түвшин">
          <select value={levelCode} onChange={(e) => setLevelCode(e.target.value as LevelCode)} className={selectClass}>
            {LEVEL_CODES.map((c) => (
              <option key={c} value={c}>{formatLevelCode(c)}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Эхний бүлэг (англи)" required hint="Chapter 1 болно — дараа нь бүлэг нэмнэ">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className={textareaClass}
            required
            placeholder="Tom is a young boy. He lives in a small town..."
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-mist-300">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Нийтлэх
        </label>
        <label className="flex items-center gap-2 text-sm text-mist-300">
          <input type="checkbox" checked={autoTranslate} onChange={(e) => setAutoTranslate(e.target.checked)} />
          Үүсгэсний дараа автоматаар орчуулах
        </label>
        <Button type="submit" isLoading={saving} className="w-full">
          Өгүүллэг үүсгэх
        </Button>
      </form>
    </div>
  );
}
