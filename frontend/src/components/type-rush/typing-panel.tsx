// frontend/src/components/type-rush/typing-panel.tsx
// Бичих самбар. Урт өгүүлбэр ч мөр дамжиж (whitespace-pre-wrap) дэлгэцнээс гарахгүй,
// курсор харагдах хэсгээс гарвал автоматаар скролл болно.
'use client';

import { useEffect, useRef, type RefObject } from 'react';

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
  const caretRef = useRef<HTMLSpanElement>(null);

  // Курсор харагдах хүрээнээс гарвал тэр хэсэг руу гүйлгэнэ.
  useEffect(() => {
    if (!active) return;
    caretRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [typed.length, active]);

  return (
    <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-3 shadow-card sm:p-5">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-mist-500 sm:mb-3 sm:text-xs">
        Энэ өгүүлбэрийг бич
      </p>
      <div className="max-h-[34vh] overflow-y-auto overscroll-contain pr-1 sm:max-h-[40vh]">
        <p
          className="whitespace-pre-wrap break-words font-mono text-sm leading-7 tracking-wide sm:text-base sm:leading-8 md:text-lg"
          aria-label={text}
        >
          {text.split('').map((ch, i) => {
            let cls = 'text-mist-500';
            if (i < correctLen) cls = 'text-success';
            else if (i < typed.length) cls = 'rounded-sm bg-danger/35 text-danger';
            const isCaret = i === typed.length && active;
            return (
              <span
                key={i}
                ref={isCaret ? caretRef : undefined}
                className={`${cls} ${isCaret ? 'tr-caret border-b-2 border-brand' : ''}`}
              >
                {ch}
              </span>
            );
          })}
          {/* Текстийн төгсгөлд курсор */}
          {active && typed.length >= text.length && <span ref={caretRef} className="tr-caret border-b-2 border-brand">&nbsp;</span>}
        </p>
      </div>
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
        className={`mt-3 w-full rounded-xl border bg-ink-800 px-3 py-2.5 font-mono text-sm text-mist-50 outline-none transition-colors placeholder:text-mist-500 read-only:opacity-70 sm:mt-4 sm:px-4 sm:py-3 sm:text-base ${
          hasError ? 'border-danger focus:border-danger' : 'border-ink-600 focus:border-brand'
        }`}
      />
      <p className="mt-2 text-[11px] leading-4 text-mist-500">
        {hasError
          ? 'Алдаа — Backspace дараад засаарай. Машин зөв бичтэл хөдлөхгүй.'
          : 'Хуулж буулгах боломжгүй. Үг бүр дуусахад утаа гарна, хурдан бичвэл илүү их.'}
      </p>
    </div>
  );
}
