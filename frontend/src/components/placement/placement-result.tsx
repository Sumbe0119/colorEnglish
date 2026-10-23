// frontend/src/components/placement/placement-result.tsx
// Төлбөр төлөгдсөний дараах үр дүн: түвшин, оноо, түвшин/чадварын задаргаа, зөвлөмж, асуулт бүрийн тайлбар.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Clock3, Lightbulb, RotateCcw, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';
import {
  formatDuration,
  PLACEMENT_BAND_LABELS,
  PLACEMENT_BANDS,
  PLACEMENT_SKILL_LABELS,
  type PlacementBand,
  type PlacementResult as PlacementResultData,
  type PlacementReviewItem,
} from '@/lib/placement-services';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

type Props = {
  result: PlacementResultData;
  isLoggedIn: boolean;
  onRestart: () => void;
};

/** Тогтоосон түвшинд аль "band" (A1…C1) харгалзахыг олно — шатыг тодруулахад */
function bandOfLevel(levelKey: PlacementResultData['levelKey']): PlacementBand {
  switch (levelKey) {
    case 'PRE_A1':
    case 'A1':
      return 'A1';
    case 'A2':
      return 'A2';
    case 'B1':
    case 'B1_PLUS':
      return 'B1';
    case 'B2':
    case 'B2_PLUS':
      return 'B2';
    default:
      return 'C1';
  }
}

export function PlacementResult({ result, isLoggedIn, onRestart }: Props) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [confirmRestartOpen, setConfirmRestartOpen] = useState(false);
  const currentBand = bandOfLevel(result.levelKey);
  const bandByKey = new Map(result.bands.map((b) => [b.band, b]));
  const startHref = isLoggedIn ? result.startHref : `/register?next=${encodeURIComponent(result.startHref)}`;

  return (
    <div className="space-y-5">
      {/* Түвшин */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ce-panel overflow-hidden">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand">Таны англи хэлний түвшин</p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-brand/40 bg-brand/15 font-display text-4xl font-semibold text-brand shadow-glow sm:h-28 sm:w-28 sm:text-5xl">
              {result.short}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl font-semibold text-mist-50 sm:text-3xl">
                {result.short} — {result.title}
              </h1>
              <p className="mt-1 text-sm text-mist-400">{result.cefr}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-ink-600 bg-ink-800 px-3 py-1.5 text-mist-200">
                  Оноо: <span className="font-semibold text-mist-50">{result.correctCount}/{result.totalQuestions}</span>{' '}
                  <span className="text-mist-400">({result.scorePercent}%)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-800 px-3 py-1.5 text-mist-200 tabular-nums">
                  <Clock3 className="h-3.5 w-3.5 text-brand" /> {formatDuration(result.durationSec)}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-mist-200">{result.description}</p>
        </div>
      </motion.div>

      {/* Түвшний шат + чадварууд */}
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="ce-panel p-6"
        >
          <h2 className="font-display text-base font-semibold text-mist-50">Түвшин тус бүрийн үр дүн</h2>
          <p className="mt-1 text-xs text-mist-400">Түвшин бүрт 8 асуулт · 5 ба түүнээс дээш зөв бол тэнцсэн гэж үзнэ</p>
          <ul className="mt-5 space-y-3">
            {PLACEMENT_BANDS.map((band) => {
              const b = bandByKey.get(band) ?? { band, correct: 0, total: 8, passed: false };
              const isCurrent = band === currentBand;
              return (
                <li
                  key={band}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-3.5 py-3',
                    isCurrent ? 'border-brand/50 bg-brand/5' : 'border-ink-700 bg-ink-800/50',
                  )}
                >
                  <div className="w-24 shrink-0">
                    <p className={cn('font-display text-sm font-semibold', isCurrent ? 'text-brand' : 'text-mist-100')}>
                      {PLACEMENT_BAND_LABELS[band].short}
                    </p>
                    <p className="text-[11px] text-mist-500">{PLACEMENT_BAND_LABELS[band].title}</p>
                  </div>
                  <div className="flex flex-1 flex-wrap gap-1.5" aria-label={`${b.correct} / ${b.total} зөв`}>
                    {Array.from({ length: b.total }, (_, i) => (
                      <span
                        key={i}
                        className={cn(
                          'h-2.5 w-5 rounded-sm',
                          i < b.correct ? (b.passed ? 'bg-brand' : 'bg-brand/60') : 'bg-ink-600',
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex w-16 shrink-0 items-center justify-end gap-1.5 text-xs tabular-nums text-mist-300">
                    {b.correct}/{b.total}
                    {b.passed ? <Check className="h-3.5 w-3.5 text-success" /> : <X className="h-3.5 w-3.5 text-mist-600" />}
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="ce-panel p-6"
        >
          <h2 className="font-display text-base font-semibold text-mist-50">Чадвар тус бүрээр</h2>
          <p className="mt-1 text-xs text-mist-400">Аль чадварт түлхүү анхаарах вэ</p>
          <ul className="mt-5 space-y-4">
            {result.skills.map((s) => (
              <li key={s.skill}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-mist-200">{PLACEMENT_SKILL_LABELS[s.skill]}</span>
                  <span className="tabular-nums text-mist-300">
                    {s.correct}/{s.total} · <span className="font-semibold text-mist-50">{s.percent}%</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-800">
                  <motion.div
                    className={cn('h-full rounded-full', s.percent >= 60 ? 'bg-success' : s.percent >= 40 ? 'bg-warning' : 'bg-danger')}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(s.percent, 2)}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl border border-ink-600/70 bg-ink-800/60 p-3.5 text-xs leading-5 text-mist-400">
            <span className="text-success">■</span> 60%+ сайн · <span className="text-warning">■</span> 40–59% дунд ·{' '}
            <span className="text-danger">■</span> 40%-иас доош анхаарах
          </div>
        </motion.section>
      </div>

      {/* Зөвлөмж + CTA */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="ce-panel border-brand/25 bg-brand/5 p-6 sm:p-8"
      >
        <h2 className="flex items-center gap-2 font-display text-base font-semibold text-mist-50">
          <Lightbulb className="h-4 w-4 text-brand" /> Таны дараагийн алхам
        </h2>
        <ul className="mt-4 space-y-2.5">
          {result.recommendations.map((r) => (
            <li key={r} className="flex gap-2.5 text-sm leading-6 text-mist-200">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {r}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={startHref} className="flex-1">
            <Button className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              {isLoggedIn ? result.startLabel : 'Бүртгүүлж суралцаж эхлэх'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          {!isLoggedIn && (
            <Link href={`/login?next=${encodeURIComponent(result.startHref)}`} className="flex-1">
              <Button variant="secondary" className="w-full">
                Бүртгэлтэй — нэвтрэх
              </Button>
            </Link>
          )}
        </div>
      </motion.section>

      {/* Асуулт бүрийн задаргаа */}
      {result.review.length > 0 && (
        <section className="ce-panel">
          <button
            type="button"
            onClick={() => setReviewOpen((o) => !o)}
            aria-expanded={reviewOpen}
            className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left"
          >
            <div>
              <h2 className="font-display text-base font-semibold text-mist-50">Асуулт бүрийн задаргаа</h2>
              <p className="mt-0.5 text-xs text-mist-400">
                {result.review.length} асуулт · зөв хариулт, тайлбар · {result.review.filter((r) => !r.isCorrect).length} алдаа
              </p>
            </div>
            <ChevronDown className={cn('h-5 w-5 shrink-0 text-mist-400 transition-transform', reviewOpen && 'rotate-180')} />
          </button>
          {reviewOpen && (
            <div className="space-y-6 border-t border-ink-700 px-6 py-6">
              {PLACEMENT_BANDS.map((band) => {
                const items = result.review.filter((r) => r.band === band);
                if (items.length === 0) return null;
                return (
                  <div key={band}>
                    <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-mist-500">
                      {PLACEMENT_BAND_LABELS[band].short} · {PLACEMENT_BAND_LABELS[band].title}
                    </p>
                    <ol className="space-y-3">
                      {items.map((item, i) => (
                        <ReviewCard key={item.id} item={item} number={i + 1} />
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      <div className="flex flex-col items-start justify-between gap-3 px-1 text-xs text-mist-500 sm:flex-row sm:items-center">
        <p>Үр дүн энэ төхөөрөмж дээр хадгалагдсан — энэ хуудсыг дахин нээхэд төлбөр шаардахгүй.</p>
        <button
          type="button"
          onClick={() => setConfirmRestartOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-mist-400 transition-colors hover:bg-ink-800 hover:text-mist-50"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Дахин тест өгөх
        </button>
      </div>

      <ConfirmDialog
        open={confirmRestartOpen}
        title="Дахин тест өгөх үү?"
        description="Одоогийн үр дүн энэ төхөөрөмжөөс хасагдана. Шинэ тестийн үр дүнг нээхэд төлбөрийг дахин төлнө."
        confirmLabel="Тийм, дахин өгөх"
        cancelLabel="Болих"
        confirmVariant="secondary"
        onConfirm={() => {
          setConfirmRestartOpen(false);
          onRestart();
        }}
        onCancel={() => setConfirmRestartOpen(false)}
      />
    </div>
  );
}

function ReviewCard({ item, number }: { item: PlacementReviewItem; number: number }) {
  return (
    <li
      className={cn(
        'rounded-xl border p-4',
        item.isCorrect ? 'border-ink-700 bg-ink-800/40' : 'border-danger/30 bg-danger/5',
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
            item.isCorrect ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger',
          )}
        >
          {item.isCorrect ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wider text-mist-500">
            {number}. {PLACEMENT_SKILL_LABELS[item.skill]}
          </p>
          {item.passage && <p className="mt-2 rounded-lg bg-ink-900/70 p-3 text-xs leading-6 text-mist-300">{item.passage}</p>}
          <p className="mt-2 font-display text-sm leading-6 text-mist-50">{item.prompt}</p>
          <ul className="mt-2.5 space-y-1.5">
            {item.options.map((opt, i) => {
              const isCorrect = i === item.correct;
              const isChosen = i === item.chosen;
              return (
                <li
                  key={i}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm',
                    isCorrect
                      ? 'border-success/40 bg-success/10 text-mist-50'
                      : isChosen
                        ? 'border-danger/40 bg-danger/10 text-mist-100 line-through decoration-danger/60'
                        : 'border-transparent text-mist-400',
                  )}
                >
                  <span className="w-4 font-mono text-xs text-mist-500">{LETTERS[i] ?? i + 1}</span>
                  <span className="flex-1">{opt}</span>
                  {isCorrect && <span className="text-[11px] font-medium text-success">зөв</span>}
                  {isChosen && !isCorrect && <span className="text-[11px] font-medium text-danger">таны сонголт</span>}
                </li>
              );
            })}
          </ul>
          {item.chosen === null && <p className="mt-2 text-xs text-mist-500">Хариулаагүй</p>}
          <p className="mt-3 flex gap-2 text-xs leading-6 text-mist-300">
            <Lightbulb className="mt-1 h-3.5 w-3.5 shrink-0 text-brand" />
            <span>{item.explanation}</span>
          </p>
        </div>
      </div>
    </li>
  );
}
