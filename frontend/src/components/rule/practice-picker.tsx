// frontend/src/components/rule/practice-picker.tsx
'use client';

import { Check, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GrammarRule } from '@/lib/grammar/types';
import { isMastered, type GrammarProgress } from '@/lib/grammar/progress';

/** Шалгалтын төрлөө сонгох дэлгэц: хурдан / бүрэн / дүрэм бүрээр. */
export function PracticePicker({
  rules,
  progress,
  onQuick,
  onFull,
  onRule,
}: {
  rules: GrammarRule[];
  progress: GrammarProgress;
  onQuick: () => void;
  onFull: () => void;
  onRule: (ruleId: number) => void;
}) {
  const totalQuestions = rules.reduce((n, r) => n + r.quiz.length, 0);
  const masteredCount = rules.filter((r) => isMastered(progress[r.id])).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={onQuick}
          className="group ce-panel flex items-start gap-4 p-5 text-left transition-colors hover:border-brand/50 hover:bg-brand/[0.06]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-modifier/15 text-modifier">
            <Zap className="h-6 w-6" />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-base font-semibold text-mist-50">Хурдан шалгалт</span>
            <span className="mt-1 block text-sm text-mist-400">
              {rules.length} асуулт — дүрэм бүрээс санамсаргүй нэг. Аль дүрмээ мартсанаа 3 минутад мэдээрэй.
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onFull}
          className="group ce-panel flex items-start gap-4 p-5 text-left transition-colors hover:border-brand/50 hover:bg-brand/[0.06]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <Trophy className="h-6 w-6" />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-base font-semibold text-mist-50">Бүрэн шалгалт</span>
            <span className="mt-1 block text-sm text-mist-400">
              Бүх {totalQuestions} асуулт. Дүрэм бүрийн үр дүн явцад бүртгэгдэнэ.
            </span>
          </span>
        </button>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-sm font-semibold text-mist-50">Дүрэм бүрээр</h3>
          <span className="text-xs text-mist-400">
            <span className="font-semibold text-success">{masteredCount}</span> / {rules.length} эзэмшсэн
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rules.map((rule, i) => {
            const p = progress[rule.id];
            const mastered = isMastered(p);
            return (
              <button
                key={rule.id}
                type="button"
                onClick={() => onRule(rule.id)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors',
                  mastered
                    ? 'border-success/30 bg-success/[0.06] hover:border-success/50'
                    : 'border-ink-700 bg-ink-900/60 hover:border-brand/40 hover:bg-ink-800',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold',
                    mastered ? 'bg-success/20 text-success' : 'bg-ink-800 text-mist-400',
                  )}
                >
                  {mastered ? <Check className="h-4 w-4" /> : String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm text-mist-100">{rule.title}</span>
                  <span className="block truncate text-[11px] text-mist-500">{rule.titleMn}</span>
                </span>
                <span className={cn('shrink-0 font-mono text-xs', mastered ? 'text-success' : 'text-mist-500')}>
                  {p && p.total > 0 ? `${p.best}/${p.total}` : `${rule.quiz.length} асуулт`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
