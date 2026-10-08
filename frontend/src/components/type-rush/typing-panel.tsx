// frontend/src/components/type-rush/typing-panel.tsx
'use client';

import type { RefObject } from 'react';

export function TypingPanel({
  text,
  typed,
  correctLen,
  hasError,
  active,
  inputRef,
  onChange,
  placeholder,
}: {
  text: string;
  typed: string;
  correctLen: number;
  hasError: boolean;
  active: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  const block = (e: React.SyntheticEvent) => e.preventDefault();

  return (
    <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-4 shadow-card sm:p-5">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-mist-500">Энэ өгүүлбэрийг бич</p>
      <p className="font-mono text-base leading-8 tracking-wide sm:text-lg" aria-label={text}>
        {text.split('').map((ch, i) => {
          let cls = 'text-mist-500';
          if (i < correctLen) cls = 'text-success';
          else if (i < typed.length) cls = 'rounded-sm bg-danger/35 text-danger';
          const isCaret = i === typed.length && active;
          return (
            <span key={i} className={`${cls} ${isCaret ? 'tr-caret border-b-2 border-brand' : ''}`}>
              {ch === ' ' ? ' ' : ch}
            </span>
          );
        })}
      </p>
      <input
        ref={inputRef}
        value={typed}
        onChange={onChange}
        onPaste={block}
        onDrop={block}
        readOnly={!active}
        placeholder={placeholder ?? (active ? 'Энд бич…' : 'Бэлэн үү… GO гэмэгц бич')}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`mt-4 w-full rounded-xl border bg-ink-800 px-4 py-3 font-mono text-base text-mist-50 outline-none transition-colors placeholder:text-mist-500 read-only:opacity-70 ${
          hasError ? 'border-danger focus:border-danger' : 'border-ink-600 focus:border-brand'
        }`}
      />
      <p className="mt-2 text-[11px] text-mist-500">
        {hasError
          ? 'Алдаа — Backspace дараад засаарай. Машин зөв бичтэл хөдлөхгүй.'
          : 'Хуулж буулгах боломжгүй. Үг бүр дуусахад утаа гарна, хурдан бичвэл илүү их.'}
      </p>
    </div>
  );
}
