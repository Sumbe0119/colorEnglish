'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Box, Layers, Plus, X } from 'lucide-react';
import { createUnit, createModule, createLesson } from '@/lib/admin-services';
import { getApiErrorMessage } from '@/lib/api-error';
import { ModuleType } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const MODULE_TYPES: { value: ModuleType; label: string }[] = [
  { value: 'GRAMMAR', label: 'Дүрэм (Grammar)' },
  { value: 'READING', label: 'Уншлага (Reading)' },
  { value: 'DICTATION_QUIZ', label: 'Диктант (Dictation)' },
  { value: 'SHADOWING', label: 'Shadowing' },
  { value: 'SPEAKING', label: 'Яриа (Speaking)' },
  { value: 'WRITING', label: 'Бичих (Writing)' },
  { value: 'SENTENCE_SORT', label: 'Өгүүлбэр эрэмбэлэх' },
  { value: 'VOCABULARY', label: 'Үгийн сан' },
];

const fieldClass =
  'w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-mist-50 placeholder:text-mist-400 focus:border-brand focus:outline-none';

function FormShell({
  title,
  icon: Icon,
  onClose,
  children,
}: {
  title: string;
  icon: typeof Plus;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-brand/40 bg-ink-800 p-4 shadow-lg shadow-brand/5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-brand" />
          <p className="text-sm font-semibold text-mist-100">{title}</p>
        </div>
        <button type="button" onClick={onClose} className="text-mist-400 hover:text-mist-50">
          <X className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
}

export function CreateUnitForm({
  levelId,
  levelCode,
  nextOrder,
  onCreated,
  defaultOpen = false,
}: {
  levelId: string;
  levelCode: string;
  nextOrder: number;
  onCreated: () => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(String(nextOrder));
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOrder(String(nextOrder));
  }, [nextOrder]);

  const reset = () => {
    setTitle('');
    setOrder(String(nextOrder));
    setDescription('');
    setIsPublished(false);
    setError(null);
    setOpen(false);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createUnit({
        levelId,
        title,
        order: Number(order),
        description: description || undefined,
        isPublished,
      });
      onCreated();
      reset();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unit үүсгэхэд алдаа гарлаа'));
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <Button type="button" variant="secondary" onClick={() => setOpen(true)} className="text-xs py-2">
        <Plus className="h-3.5 w-3.5" /> Unit нэмэх ({levelCode})
      </Button>
    );
  }

  return (
    <FormShell title={`${levelCode} — Шинэ Unit`} icon={Layers} onClose={reset}>
      <form onSubmit={onSubmit} className="space-y-3">
        {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p>}
        <Input label="Гарчиг" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="Дараалал" type="number" min={1} value={order} onChange={(e) => setOrder(e.target.value)} required />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-mist-200">Тайлбар</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className={fieldClass}
            placeholder="Заавал биш..."
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-mist-300">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Нийтлэх
        </label>
        <Button type="submit" isLoading={saving} className="w-full">
          Unit үүсгэх
        </Button>
      </form>
    </FormShell>
  );
}

export function CreateModuleForm({
  unitId,
  unitTitle,
  nextOrder,
  onCreated,
  defaultOpen = false,
}: {
  unitId: string;
  unitTitle: string;
  nextOrder: number;
  onCreated: () => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [type, setType] = useState<ModuleType>('GRAMMAR');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(String(nextOrder));
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOrder(String(nextOrder));
  }, [nextOrder]);

  const reset = () => {
    setType('GRAMMAR');
    setCode('');
    setTitle('');
    setOrder(String(nextOrder));
    setDescription('');
    setError(null);
    setOpen(false);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createModule({
        unitId,
        type,
        code,
        title,
        order: Number(order),
        description: description || undefined,
      });
      onCreated();
      reset();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Модуль үүсгэхэд алдаа гарлаа'));
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <Button type="button" variant="secondary" onClick={() => setOpen(true)} className="text-xs py-2">
        <Plus className="h-3.5 w-3.5" /> Модуль нэмэх
      </Button>
    );
  }

  return (
    <FormShell title={`${unitTitle} — Шинэ модуль`} icon={Box} onClose={reset}>
      <form onSubmit={onSubmit} className="space-y-3">
        {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p>}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-mist-200">Төрөл</label>
          <select value={type} onChange={(e) => setType(e.target.value as ModuleType)} className={fieldClass} required>
            {MODULE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <Input label="Код (жишээ: 001)" value={code} onChange={(e) => setCode(e.target.value)} required />
        <Input label="Гарчиг" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="Дараалал" type="number" min={1} value={order} onChange={(e) => setOrder(e.target.value)} required />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-mist-200">Тайлбар</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className={fieldClass}
            placeholder="Заавал биш..."
          />
        </div>
        <Button type="submit" isLoading={saving} className="w-full">
          Модуль үүсгэх
        </Button>
      </form>
    </FormShell>
  );
}

export function CreateLessonForm({
  moduleId,
  moduleTitle,
  nextOrder,
  onCreated,
  defaultOpen = false,
}: {
  moduleId: string;
  moduleTitle: string;
  nextOrder: number;
  onCreated: () => void;
  defaultOpen?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(String(nextOrder));
  const [contentText, setContentText] = useState('');
  const [estimatedMins, setEstimatedMins] = useState('10');
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOrder(String(nextOrder));
  }, [nextOrder]);

  const reset = () => {
    setTitle('');
    setOrder(String(nextOrder));
    setContentText('');
    setEstimatedMins('10');
    setIsPublished(false);
    setError(null);
    setOpen(false);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const lesson = await createLesson({
        moduleId,
        title,
        order: Number(order),
        estimatedMins: Number(estimatedMins),
        isPublished,
        content: contentText ? { body: contentText } : undefined,
      });
      onCreated();
      reset();
      router.push(`/admin/lessons/${lesson.id}`);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Хичээл үүсгэхэд алдаа гарлаа'));
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)} className="w-full text-xs py-2">
        <Plus className="h-3.5 w-3.5" /> Хичээл нэмэх
      </Button>
    );
  }

  return (
    <FormShell title={`${moduleTitle} — Шинэ хичээл`} icon={BookOpen} onClose={reset}>
      <form onSubmit={onSubmit} className="space-y-3">
        {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p>}
        <Input label="Гарчиг" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="Дараалал" type="number" min={1} value={order} onChange={(e) => setOrder(e.target.value)} required />
        <Input
          label="Тооцоолсон минут"
          type="number"
          min={1}
          value={estimatedMins}
          onChange={(e) => setEstimatedMins(e.target.value)}
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-mist-200">Агуулга (текст)</label>
          <textarea
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            rows={3}
            className={fieldClass}
            placeholder="Хичээлийн тайлбар, дүрэм..."
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-mist-300">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Нийтлэх
        </label>
        <Button type="submit" isLoading={saving} className="w-full">
          Хичээл үүсгэх
        </Button>
      </form>
    </FormShell>
  );
}
