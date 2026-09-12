// frontend/src/components/rule/rule-nav.tsx
'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GrammarRule } from '@/lib/grammar/types';
import { isMastered, type GrammarProgress } from '@/lib/grammar/progress';

/** Дүрмийн жагсаалт — desktop дээр босоо хажуугийн цэс, mobile дээр хэвтээ гүйлгэдэг чипүүд. */
export function RuleNav({
  rules,
  activeId,
  progress,
  onSelect,
  className,
}: {
  rules: GrammarRule[];
  activeId: number;
  progress: GrammarProgress;
  onSelect: (ruleId: number) => void;
  className?: string;
}) {
  return (
    <nav
      aria-label="Дүрмийн жагсаалт"
      className={cn(
        'scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0',
        className,
      )}
    >
      {rules.map((rule, i) => {
        const p = progress[rule.id];
        const active = rule.id === activeId;
        const mastered = isMastered(p);
        return (
          <button
            key={rule.id}
            type="button"
            onClick={() => onSelect(rule.id)}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors lg:shrink',
              active
                ? 'border-brand/50 bg-brand/15 text-mist-50 shadow-glow'
                : 'border-ink-700/80 bg-ink-900/60 text-mist-300 hover:border-ink-600 hover:bg-ink-800 hover:text-mist-50',
            )}
          >
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-semibold',
                active
                  ? 'bg-brand text-white'
                  : mastered
                    ? 'bg-success/20 text-success'
                    : p?.viewed
                      ? 'bg-ink-700 text-mist-200'
                      : 'bg-ink-800 text-mist-500',
              )}
            >
              {mastered && !active ? <Check className="h-3.5 w-3.5" /> : String(i + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0 max-w-[190px] lg:max-w-none">
              <span className="block truncate font-display text-sm">{rule.title}</span>
              <span className="hidden truncate text-[11px] text-mist-500 lg:block">{rule.titleMn}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
