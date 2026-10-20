// frontend/src/components/draw-guess/guess-feed.tsx
// Таалтын урсгал: бусдын таасан үгс, зөв таасан мэдэгдэл, системийн мэдээ + таах input.
// variant='panel' — том дэлгэцийн баруун багана (жагсаалт дээр, input доор);
// variant='console' — утасны доод консол (input үргэлж харагдана, жагсаалт нь богино).
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
  variant?: 'panel' | 'console';
  /** Сүүлийн 10 секунд — input улаан хүрээтэй */
  urgent?: boolean;
  /** false бол input-гүй (зурагчийн утасны консол — зөвхөн урсгал) */
  showInput?: boolean;
}

export function GuessFeed({ items, canGuess, disabledNote, onGuess, variant = 'panel', urgent = false, showInput = true }: Props) {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [items.length]);

  useEffect(() => {
    // Харагдаж буй instance л фокус авна (panel/console хоёул DOM-д байж болно)
    const el = inputRef.current;
    if (canGuess && el && el.offsetParent !== null) el.focus();
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

  const console_ = variant === 'console';

  const form = (
    <form onSubmit={submit} className={console_ ? 'shrink-0' : 'shrink-0 border-t border-ink-600/80 p-2.5'}>
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
          // text-base: iOS Safari 16px-ээс бага input дээр focus хийхэд zoom хийдэг
          className={`h-11 w-full rounded-xl border-2 bg-ink-950 px-3 font-mono text-base text-mist-50 outline-none transition-colors placeholder:text-mist-500 disabled:opacity-60 sm:text-sm ${
            canGuess ? (urgent ? 'border-danger/70 focus:border-danger' : 'border-ink-600 focus:border-brand') : 'border-ink-700'
          }`}
        />
        <button
          type="submit"
          disabled={!canGuess || sending || !value.trim()}
          aria-label="Илгээх"
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-brand px-3.5 text-sm font-semibold text-white shadow-[0_4px_0_#2A5BB8] transition-all hover:bg-brand-hover active:translate-y-[2px] active:shadow-[0_2px_0_#2A5BB8] disabled:opacity-50 disabled:active:translate-y-0 sm:px-4"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Таах</span>
        </button>
      </div>
    </form>
  );

  const list = (
    <div
      ref={listRef}
      className={`ce-scroll min-h-0 flex-1 space-y-1 overflow-y-auto ${console_ ? (showInput ? 'mt-2 max-h-[88px] pr-1' : 'max-h-[64px] pr-1') : 'px-3 py-2.5'}`}
    >
      {items.length === 0 && <p className="text-xs text-mist-500">Таасан үгнүүд энд урсана…</p>}
      {items.map((it) => (
        <FeedRow key={it.id} item={it} />
      ))}
    </div>
  );

  if (console_) {
    return (
      <div className="flex flex-col">
        {showInput && form}
        {list}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-ink-600/80 px-4 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">Таалтууд</p>
      </div>
      {list}
      {form}
    </div>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  if (item.kind === 'system') {
    return <p className="rounded-lg bg-ink-800/60 px-2.5 py-1 text-center text-[11px] text-mist-400">{item.text}</p>;
  }
  if (item.kind === 'close') {
    return <p className="rounded-lg border border-modifier/30 bg-modifier/10 px-2.5 py-1 text-xs text-modifier">{item.text}</p>;
  }
  if (item.kind === 'mine-correct') {
    return (
      <p className="inline-flex w-full items-center gap-1.5 rounded-lg border border-success/40 bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
        <Check className="h-3.5 w-3.5" /> {item.text}
      </p>
    );
  }
  if (item.kind === 'correct') {
    return (
      <p className="inline-flex w-full items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1 text-xs text-success">
        <Check className="h-3.5 w-3.5" />
        <span className="font-semibold">{item.name}</span> зөв таалаа!
      </p>
    );
  }
  return (
    <p className={`rounded-lg px-2.5 py-1 text-xs ${item.mine ? 'bg-brand/10 text-mist-100' : 'bg-ink-800/60 text-mist-200'}`}>
      <span className={`font-semibold ${item.mine ? 'text-brand' : 'text-mist-300'}`}>{item.name}</span>
      <span className="text-mist-500">: </span>
      {item.text}
    </p>
  );
}
