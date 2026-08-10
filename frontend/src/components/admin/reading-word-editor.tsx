'use client';

import { useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { ReadingWord, updateReadingWord } from '@/lib/reading-services';
import { getApiErrorMessage } from '@/lib/api-error';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/store/toast-store';

type WordKind = 'article' | 'phrasal' | 'word';

function getWordKind(word: string): WordKind {
  if (['a', 'an', 'the'].includes(word)) return 'article';
  if (word.includes(' ')) return 'phrasal';
  return 'word';
}

const KIND_LABEL: Record<WordKind, string> = {
  article: 'Article',
  phrasal: 'Phrasal verb',
  word: 'Үг',
};

const KIND_STYLE: Record<WordKind, string> = {
  article: 'bg-violet-500/15 text-violet-300',
  phrasal: 'bg-amber-500/15 text-amber-300',
  word: 'bg-brand/15 text-brand',
};

export function ReadingWordEditor({
  item,
  onUpdate,
  onDelete,
}: {
  item: ReadingWord;
  onUpdate: (word: ReadingWord) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [meaningMn, setMeaningMn] = useState(item.meaningMn);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const kind = getWordKind(item.word);

  const startEdit = () => {
    setMeaningMn(item.meaningMn);
    setError(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setMeaningMn(item.meaningMn);
    setError(null);
    setEditing(false);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateReadingWord(item.id, { meaningMn: meaningMn.trim() });
      onUpdate(updated);
      setEditing(false);
      toast.success('Орчуулга хадгаллаа');
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Хадгалахад алдаа гарлаа');
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="col-span-full rounded-xl border border-brand/30 bg-ink-800 p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${KIND_STYLE[kind]}`}>
            {KIND_LABEL[kind]}
          </span>
          <strong className="text-brand">{item.word}</strong>
          <span className="text-xs text-mist-500">Засварлаж байна</span>
        </div>
        {item.contextSentence && (
          <p className="mb-3 rounded-lg bg-ink-900/80 px-3 py-2 text-xs text-mist-400">
            Өгүүлбэр: <span className="text-mist-200">{item.contextSentence}</span>
          </p>
        )}
        <Input
          label="Монгол орчуулга (энэ өгүүлбэрт)"
          value={meaningMn}
          onChange={(e) => setMeaningMn(e.target.value)}
          placeholder="энэ контекст дахь утга"
          required
        />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        <div className="mt-3 flex gap-2">
          <Button type="button" isLoading={saving} onClick={save}>
            <Check className="h-4 w-4" /> Хадгалах
          </Button>
          <Button type="button" variant="ghost" onClick={cancelEdit} disabled={saving}>
            <X className="h-4 w-4" /> Болих
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-ink-700 bg-ink-800 px-4 py-3 text-sm">
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${KIND_STYLE[kind]}`}>
            {KIND_LABEL[kind]}
          </span>
          <strong className="text-brand">{item.word}</strong>
        </div>
        {item.contextSentence && (
          <p className="line-clamp-2 text-xs text-mist-500">
            …{item.contextSentence}…
          </p>
        )}
        <p className="text-mist-200">{item.meaningMn}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={startEdit}
          className="rounded-lg p-1.5 text-mist-400 hover:bg-ink-700 hover:text-mist-50"
          title="Засах"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="rounded-lg p-1.5 text-danger hover:bg-ink-700 hover:opacity-80"
          title="Устгах"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
