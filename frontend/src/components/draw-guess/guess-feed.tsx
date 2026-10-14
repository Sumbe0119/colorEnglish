// frontend/src/components/draw-guess/guess-feed.tsx
// Баруун талын урсгал: бусдын таасан үгс, зөв таасан мэдэгдэл, системийн мэдээ + таах input.
'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Send } from 'lucide-react';

export type FeedItem = {
  id: string;
  kind: 'guess' | 'correct' | 'system' | 'close' | 'mine-correct';
  name: string | null;
  text: string;
  mine: boolean;
};

interface Props {
  items: FeedItem[];
  /** Input идэвхтэй эсэх. */
  canGuess: boolean;
  /** Input идэвхгүй үед тайлбар. */
  disabledNote: string;
  onGuess: (text: string) => Promise<void> | void;
}

export function GuessFeed({ items, canGuess, disabledNote, onGuess }: Props) {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [items.length]);

  useEffect(() => {
    if (canGuess) inputRef.current?.focus();
  }, [canGuess]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text || !canGuess || sending) return;
    setSending(true);
    try {
      await onGuess(text);
      setValue('');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-2xl border border-ink-600/80 bg-ink-900 shadow-card lg:min-h-0">
      <div className="border-b border-ink-600/80 px-4 py-2.5">
        <p className="text-xs font-medium uppercase tracking-wider text-mist-500">Таалтууд</p>
      </div>
      <div ref={listRef} className="ce-scroll flex-1 space-y-1.5 overflow-y-auto px-3 py-3">
        {items.length === 0 && <p className="text-xs text-mist-500">Таасан үгнүүд энд урсана…</p>}
        {items.map((it) => (
          <FeedRow key={it.id} item={it} />
        ))}
      </div>
      <form onSubmit={submit} className="border-t border-ink-600/80 p-2.5">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, 40))}
            disabled={!canGuess}
            placeholder={canGuess ? 'Англи үгээ бич…' : disabledNote}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full rounded-xl border border-ink-600 bg-ink-800 px-3 py-2.5 text-sm text-mist-50 outline-none placeholder:text-mist-500 focus:border-brand disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!canGuess || sending || !value.trim()}
            aria-label="Илгээх"
            className="shrink-0 rounded-xl bg-brand px-3 text-white hover:bg-brand-hover disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  if (item.kind === 'system') {
    return <p className="rounded-lg bg-ink-800/60 px-2.5 py-1.5 text-center text-[11px] text-mist-400">{item.text}</p>;
  }
  if (item.kind === 'close') {
    return <p className="rounded-lg border border-modifier/30 bg-modifier/10 px-2.5 py-1.5 text-xs text-modifier">{item.text}</p>;
  }
  if (item.kind === 'mine-correct') {
    return (
      <p className="inline-flex w-full items-center gap-1.5 rounded-lg border border-success/40 bg-success/15 px-2.5 py-1.5 text-xs font-semibold text-success">
        <Check className="h-3.5 w-3.5" /> {item.text}
      </p>
    );
  }
  if (item.kind === 'correct') {
    return (
      <p className="inline-flex w-full items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1.5 text-xs text-success">
        <Check className="h-3.5 w-3.5" />
        <span className="font-semibold">{item.name}</span> зөв таалаа!
      </p>
    );
  }
  return (
    <p className={`rounded-lg px-2.5 py-1.5 text-xs ${item.mine ? 'bg-brand/10 text-mist-100' : 'bg-ink-800/60 text-mist-200'}`}>
      <span className={`font-semibold ${item.mine ? 'text-brand' : 'text-mist-300'}`}>{item.name}</span>
      <span className="text-mist-500">: </span>
      {item.text}
    </p>
  );
}
