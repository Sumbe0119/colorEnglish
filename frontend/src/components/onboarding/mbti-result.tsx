'use client';

import { Lightbulb } from 'lucide-react';
import {
  MBTI_DIMENSIONS,
  MBTI_LETTER_LABELS,
  MBTI_LETTER_TIPS,
  MBTI_TYPES,
  type MbtiLetter,
  type MbtiScores,
} from '@/lib/mbti';
import { cn } from '@/lib/utils';

type Props = {
  type: string;
  scores: MbtiScores;
  compact?: boolean;
  className?: string;
};

/** MBTI төрөл + 4 хэмжээсийн хувь + англи хэл сурах зөвлөмж */
export function MbtiResult({ type, scores, compact = false, className }: Props) {
  const info = MBTI_TYPES[type] ?? { name: type, emoji: '🧩', desc: '' };
  const letters = type.split('') as MbtiLetter[];
  const tips = (compact ? letters.slice(0, 2) : letters).map((l) => MBTI_LETTER_TIPS[l]).filter(Boolean);

  return (
    <div className={cn('space-y-5', className)}>
      <div className={cn('grid gap-5', !compact && 'lg:grid-cols-[minmax(0,280px)_1fr] lg:items-start')}>
        {/* Төрөл */}
        <div className="rounded-2xl border border-brand/25 bg-gradient-to-br from-brand/15 to-ink-900 p-5 text-center">
          <span className="text-4xl">{info.emoji}</span>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {letters.map((l, i) => (
              <span
                key={`${l}-${i}`}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/40 bg-brand/15 font-display text-xl font-bold text-brand"
              >
                {l}
              </span>
            ))}
          </div>
          <h3 className="mt-3 font-display text-lg font-semibold text-mist-50">{info.name}</h3>
          {info.desc && <p className="mt-1.5 text-sm leading-6 text-mist-300">{info.desc}</p>}
        </div>

        {/* Хэмжээсүүд */}
        <ul className="space-y-3.5">
          {MBTI_DIMENSIONS.map((d) => {
            const [a, b] = d.letters;
            const pa = scores[a] ?? 0;
            const dominant = pa >= 50 ? a : b;
            return (
              <li key={d.key}>
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-mist-500">{d.title}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className={cn('w-24 shrink-0 truncate sm:w-28', dominant === a ? 'font-semibold text-mist-50' : 'text-mist-400')}>
                    {MBTI_LETTER_LABELS[a]}
                  </span>
                  <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-ink-800">
                    <span
                      className={cn('absolute inset-y-0 rounded-full', dominant === a ? 'left-0 bg-brand' : 'right-0 bg-brand')}
                      style={{ width: `${Math.max(scores[dominant] ?? 0, 4)}%` }}
                    />
                  </span>
                  <span className={cn('w-24 shrink-0 truncate text-right sm:w-28', dominant === b ? 'font-semibold text-mist-50' : 'text-mist-400')}>
                    {MBTI_LETTER_LABELS[b]}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-[11px] tabular-nums text-mist-500">
                  <span>{pa}%</span>
                  <span>{scores[b] ?? 0}%</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-mist-50">
          <Lightbulb className="h-4 w-4 text-brand" />
          Таны зан чанарт тохирсон сурах зөвлөмж
        </div>
        <ul className="space-y-1.5">
          {tips.map((t) => (
            <li key={t} className="flex gap-2 text-sm leading-6 text-mist-300">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
