'use client';

import { Lightbulb, Sparkles } from 'lucide-react';
import {
  LEARNING_STYLE_FEATURES,
  LEARNING_STYLE_LABELS,
  LEARNING_STYLE_TIPS,
  rankLearningStyles,
  type LearningStyle,
  type LearningStyleScores,
} from '@/lib/learning-style';
import { LearningStyleChart } from './learning-style-chart';
import { cn } from '@/lib/utils';

type Props = {
  scores: LearningStyleScores;
  dominant: LearningStyle;
  compact?: boolean;
  className?: string;
};

/** Диаграм + давамгайлах арга барил + зөвлөмж */
export function LearningStyleResult({ scores, dominant, compact = false, className }: Props) {
  const ranked = rankLearningStyles(scores);
  const secondary = ranked[1];
  const isBalanced = scores[ranked[0]] - scores[secondary] <= 12;
  const info = LEARNING_STYLE_LABELS[dominant];
  const tips = compact ? LEARNING_STYLE_TIPS[dominant].slice(0, 2) : LEARNING_STYLE_TIPS[dominant];

  return (
    <div className={cn('space-y-5', className)}>
      <div className={cn('grid gap-5', !compact && 'lg:grid-cols-[360px_1fr] lg:items-center')}>
        <div className="mx-auto w-full max-w-[360px]">
          <LearningStyleChart scores={scores} size={compact ? 220 : 260} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{info.emoji}</span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-brand">
                Таны давамгай арга барил
              </p>
              <h3 className="font-display text-lg font-semibold text-mist-50">{info.label}</h3>
            </div>
          </div>
          <p className="text-sm leading-6 text-mist-300">{info.desc}</p>
          {isBalanced && (
            <p className="text-xs leading-5 text-mist-400">
              {LEARNING_STYLE_LABELS[secondary].short} арга барил ч мөн адил хүчтэй тул
              хоёуланг нь хослуулбал илүү үр дүнтэй.
            </p>
          )}

          <ul className="space-y-1.5">
            {ranked.map((s) => (
              <li key={s} className="flex items-center gap-2 text-xs">
                <span className="w-24 shrink-0 text-mist-400">{LEARNING_STYLE_LABELS[s].short}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-800">
                  <span
                    className={cn('block h-full rounded-full', s === dominant ? 'bg-brand' : 'bg-mist-500/60')}
                    style={{ width: `${Math.max(scores[s], 3)}%` }}
                  />
                </span>
                <span className="w-9 text-right tabular-nums text-mist-300">{scores[s]}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-mist-50">
          <Lightbulb className="h-4 w-4 text-brand" />
          Илүү үр дүнтэй суралцахын тулд
        </div>
        <ul className="space-y-1.5">
          {tips.map((t) => (
            <li key={t} className="flex gap-2 text-sm leading-6 text-mist-300">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-mist-400">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
          {LEARNING_STYLE_FEATURES[dominant]}
        </p>
      </div>
    </div>
  );
}
