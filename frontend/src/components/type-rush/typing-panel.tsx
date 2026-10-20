// frontend/src/components/type-rush/typing-panel.tsx
// Бичих консол (дэлгэцийн доод хэсэг). Өгүүлбэрийг тэмдэгт бүрээр өнгөлнө (зөв / алдаа / курсор),
// доор нь жинхэнэ <input> — гар утсан дээр гар (keyboard) гарч ирэхэд оролт DOM-д байх ёстой.
// Урт өгүүлбэр ч мөр дамжиж (whitespace-pre-wrap) дэлгэцнээс гарахгүй, курсор харагдах хэсгээс гарвал скролл болно.
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
  urgent = false,
}: {
  text: string;
  typed: string;
  correctLen: number;
  hasError: boolean;
  active: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** Цаг дуусах дөхсөн — хүрээ улаан */
  urgent?: boolean;
}) {
  const block = (e: React.SyntheticEvent) => e.preventDefault();
  const caretRef = useRef<HTMLSpanElement>(null);

  // Курсор харагдах хүрээнээс гарвал тэр хэсэг руу гүйлгэнэ.
  useEffect(() => {
    if (!active) return;
    caretRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [typed.length, active]);

  const border = hasError
    ? 'border-danger focus:border-danger'
    : urgent
      ? 'border-danger/70 focus:border-danger'
      : active
        ? 'border-ink-600 focus:border-brand'
        : 'border-ink-600/70';

  return (
    <div>
      <div className="ce-scroll max-h-[22vh] overflow-y-auto overscroll-contain rounded-xl border border-ink-600/60 bg-ink-950/70 px-3 py-2 sm:max-h-[26vh] sm:px-4">
        <p
          className="whitespace-pre-wrap break-words font-mono text-sm leading-7 tracking-wide sm:text-base sm:leading-8 md:text-lg"
          aria-label={text}
        >
          {text.split('').map((ch, i) => {
            let cls = 'text-mist-400';
            if (i < correctLen) cls = 'text-success';
            else if (i < typed.length) cls = 'rounded-sm bg-danger/35 text-danger';
            const isCaret = i === typed.length && active;
            return (
              <span key={i} ref={isCaret ? caretRef : undefined} className={`${cls} ${isCaret ? 'tr-caret border-b-2 border-brand' : ''}`}>
                {ch}
              </span>
            );
          })}
          {/* Текстийн төгсгөлд курсор */}
          {active && typed.length >= text.length && (
            <span ref={caretRef} className="tr-caret border-b-2 border-brand">
              &nbsp;
            </span>
          )}
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
        enterKeyHint="go"
        className={`mt-2 h-11 w-full rounded-xl border-2 bg-ink-950 px-3 font-mono text-base text-mist-50 outline-none transition-colors placeholder:text-mist-500 read-only:opacity-70 sm:h-12 sm:px-4 sm:text-lg ${border}`}
      />
      <p className="mt-1.5 min-h-[16px] text-[11px] leading-4 text-mist-500">
        {hasError ? (
          <span className="tr-pop inline-block text-danger">Алдаа — Backspace дараад засаарай. Машин зөв бичтэл хөдлөхгүй.</span>
        ) : active ? (
          'Хуулж буулгах боломжгүй. Үг бүр дуусахад утаа гарна, хурдан бичвэл нитро асна.'
        ) : (
          'Гэрэл ногоон болмогц бичиж эхэл.'
        )}
      </p>
    </div>
  );
}
