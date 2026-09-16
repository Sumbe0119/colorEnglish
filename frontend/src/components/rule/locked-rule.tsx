// frontend/src/components/rule/locked-rule.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Lock, Sparkles, Target } from 'lucide-react';
import type { GrammarRule } from '@/lib/grammar/types';
import type { RuleProgress } from '@/lib/grammar/progress';

type Props = {
  rule: GrammarRule;
  index: number;
  state?: RuleProgress;
  prevRule?: GrammarRule;
  prevCanOpen: boolean;
  freeRuleCount: number;
  passPercent: number;
  onOpenPrev?: () => void;
  onPracticePrev?: () => void;
};

/** Түгжээтэй хичээл — агуулгыг харуулахгүй, яагаад түгжээтэй, яаж нээхийг тайлбарлана. */
export function LockedRule({
  rule,
  index,
  state,
  prevRule,
  prevCanOpen,
  freeRuleCount,
  passPercent,
  onOpenPrev,
  onPracticePrev,
}: Props) {
  const needsVip = Boolean(state?.requiresVip);
  const needsPrevPass = !state?.unlocked;
  const prevNeeded = prevRule ? Math.ceil((prevRule.quiz.length * passPercent) / 100) : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="ce-panel relative overflow-hidden p-6 sm:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[88px] font-bold leading-none text-ink-700/40 sm:text-[160px]"
      >
        {String(rule.id).padStart(2, '0')}
      </span>

      <div className="relative">
        <span className="text-xs uppercase tracking-[0.18em] text-mist-400">Дүрэм {index + 1}</span>
        <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-mist-50 sm:text-3xl">{rule.title}</h2>
        <p className="mt-1.5 text-sm font-medium text-brand">{rule.titleMn}</p>

        <div className="mt-6 flex items-start gap-4 rounded-2xl border border-ink-600 bg-ink-900/70 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
            {needsVip ? <Crown className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </span>
          <div className="min-w-0 space-y-2">
            <p className="font-display text-base font-semibold text-mist-50">
              {needsVip ? 'Энэ хичээл VIP эрхээр нээгдэнэ' : 'Хичээл түгжээтэй байна'}
            </p>
            {needsVip && (
              <p className="text-sm leading-6 text-mist-400">
                Эхний {freeRuleCount} хичээл үнэгүй. VIP эрх авснаар үлдсэн хичээлүүдийг дарааллаар нь үзэх боломжтой.
              </p>
            )}
            {needsPrevPass && prevRule && (
              <p className="text-sm leading-6 text-mist-400">
                {needsVip ? 'Мөн өмнөх ' : 'Өмнөх '}
                <span className="font-medium text-mist-200">«{prevRule.title}»</span> хичээлийг үзээд шалгалтад нь{' '}
                {prevRule.quiz.length}-аас дор хаяж {prevNeeded} зөв хариулж тэнцсэний дараа энэ хичээл нээгдэнэ.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {needsVip && (
            <Link
              href="/billing"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-colors hover:bg-brand-hover"
            >
              <Sparkles className="h-4 w-4" /> VIP авах
            </Link>
          )}
          {needsPrevPass && prevCanOpen && onPracticePrev && (
            <button
              type="button"
              onClick={onPracticePrev}
              className={
                needsVip
                  ? 'inline-flex items-center gap-2 rounded-xl border border-ink-500 bg-ink-800 px-5 py-2.5 text-sm text-mist-100 transition-colors hover:border-brand/40 hover:bg-ink-700'
                  : 'inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-colors hover:bg-brand-hover'
              }
            >
              <Target className="h-4 w-4" /> Өмнөх хичээлийн шалгалт өгөх
            </button>
          )}
          {onOpenPrev && (
            <button
              type="button"
              onClick={onOpenPrev}
              className="inline-flex items-center gap-2 rounded-xl border border-ink-500 bg-ink-800 px-5 py-2.5 text-sm text-mist-100 transition-colors hover:border-brand/40 hover:bg-ink-700"
            >
              <ArrowLeft className="h-4 w-4" /> Өмнөх хичээл рүү
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
