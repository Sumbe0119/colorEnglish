// frontend/src/components/rule/colored-sentence.tsx
'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Square, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PART_HINT, PART_LABEL, PART_ORDER, stripMarkup, tokenize } from '@/lib/grammar/markup';
import type { Example, SentencePart } from '@/lib/grammar/types';
import { speakEnglish, stopSpeech } from '@/components/reading/reading-utils';

export const PART_TEXT_CLASS: Record<SentencePart, string> = {
  subject: 'text-subject',
  verb: 'text-verb',
  object: 'text-object',
  modifier: 'text-modifier',
};

export const PART_DOT_CLASS: Record<SentencePart, string> = {
  subject: 'bg-subject',
  verb: 'bg-verb',
  object: 'bg-object',
  modifier: 'bg-modifier',
};

export const PART_CHIP_CLASS: Record<SentencePart | 'plain', string> = {
  subject: 'border-subject/40 bg-subject/10 text-subject',
  verb: 'border-verb/40 bg-verb/10 text-verb',
  object: 'border-object/40 bg-object/10 text-object',
  modifier: 'border-modifier/40 bg-modifier/10 text-modifier',
  plain: 'border-ink-600 bg-ink-800 text-mist-200',
};

/**
 * Хуудсан дээр нэг удаад нэг л зүйл дуугарна. Шинэ уншилт эхлэхэд өмнөх
 * товч/тоглуулагчийн "тоглож байна" төлөвийг буцаана (audio.pause() нь onended
 * дуудахгүй тул ингэж хийхгүй бол өмнөх товч гацна).
 */
let activeReset: (() => void) | null = null;

export function claimSpeech(reset: () => void) {
  if (activeReset && activeReset !== reset) activeReset();
  activeReset = reset;
}

export function releaseSpeech(reset: () => void) {
  if (activeReset === reset) activeReset = null;
}

export function isSpeechOwner(reset: () => void) {
  return activeReset === reset;
}

/** Markup-тай англи өгүүлбэрийг гишүүн бүрээр нь өнгөөр ялгаж харуулна. */
export function ColoredSentence({
  en,
  colored = true,
  className,
}: {
  en: string;
  colored?: boolean;
  className?: string;
}) {
  const tokens = tokenize(en);
  return (
    <span className={cn('font-display', className)} lang="en">
      {tokens.map((token, i) => (
        <span
          key={i}
          className={cn(token.part && colored ? PART_TEXT_CLASS[token.part] : 'text-mist-100')}
        >
          {token.text}
        </span>
      ))}
    </span>
  );
}

/** Англи өгүүлбэрийг уншуулах товч (ElevenLabs → browser TTS fallback). */
export function SpeakButton({
  text,
  className,
  label = 'Сонсох',
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [playing, setPlaying] = useState(false);
  // Компонент бүрт тогтвортой (identity хадгалагдсан) reset функц — claim/release харьцуулалтад хэрэгтэй.
  const reset = useRef(() => setPlaying(false)).current;
  // Хуучин уншилтын onEnd/onError шинэ уншилтыг унтраахгүй байх токен.
  const run = useRef(0);

  useEffect(() => {
    return () => {
      // Компонент устахад өөрийнх нь уншилт явж байвал зогсооно.
      if (isSpeechOwner(reset)) {
        releaseSpeech(reset);
        stopSpeech();
      }
    };
  }, [reset]);

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    run.current += 1;
    if (playing) {
      stopSpeech();
      releaseSpeech(reset);
      setPlaying(false);
      return;
    }
    const id = run.current;
    claimSpeech(reset);
    setPlaying(true);
    const finish = () => {
      if (run.current !== id) return;
      releaseSpeech(reset);
      reset();
    };
    void speakEnglish(stripMarkup(text), { onEnd: finish, onError: finish });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? 'Зогсоох' : label}
      title={playing ? 'Зогсоох' : label}
      className={cn(
        'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors',
        playing
          ? 'border-brand/50 bg-brand/15 text-brand'
          : 'border-ink-600 bg-ink-800/70 text-mist-400 hover:border-brand/40 hover:text-brand',
        className,
      )}
    >
      {playing ? <Square className="h-3 w-3" /> : <Volume2 className="h-3.5 w-3.5" />}
    </button>
  );
}

/** Жишээний мөр: өнгөт өгүүлбэр + монгол орчуулга + сонсох товч. */
export function ExampleRow({
  example,
  showMn,
  colored = true,
  size = 'md',
  className,
}: {
  example: Example;
  showMn: boolean;
  colored?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group flex items-start gap-3 rounded-xl border border-ink-700/70 bg-ink-900/70 transition-colors hover:border-ink-600',
        size === 'sm' ? 'px-3 py-2' : 'px-3.5 py-3',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <ColoredSentence
          en={example.en}
          colored={colored}
          className={cn(
            size === 'lg' && 'text-base leading-7 sm:text-lg',
            size === 'md' && 'text-sm leading-6',
            size === 'sm' && 'text-[13px] leading-5',
          )}
        />
        {showMn && (
          <p
            className={cn(
              'text-mist-400',
              size === 'sm' ? 'mt-0.5 text-[11px] leading-4' : 'mt-1 text-xs leading-5',
            )}
          >
            {example.mn}
          </p>
        )}
      </div>
      <SpeakButton
        text={example.en}
        className={cn('opacity-50 focus-visible:opacity-100 group-hover:opacity-100', size === 'lg' ? 'mt-1' : 'mt-0.5')}
      />
    </div>
  );
}

/** Өнгөт системийн тайлбар — 4 гишүүн. */
export function PartLegend({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {PART_ORDER.map((part) => (
        <span
          key={part}
          title={PART_HINT[part]}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800/60 text-mist-300',
            compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
          )}
        >
          <span className={cn('h-2 w-2 rounded-full', PART_DOT_CLASS[part])} />
          {PART_LABEL[part]}
        </span>
      ))}
    </div>
  );
}
