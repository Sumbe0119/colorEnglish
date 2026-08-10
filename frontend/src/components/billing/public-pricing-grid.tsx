// frontend/src/components/billing/public-pricing-grid.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { formatMnt, getPricingPlans, type PricingPlan } from '@/lib/billing-services';
import { Button } from '@/components/ui/button';

function formatDuration(days: number) {
  if (days % 30 === 0) {
    const months = days / 30;
    return `${months} сар`;
  }
  return `${days} хоног`;
}

export function PublicPricingGrid({
  ctaHref = '/register',
  ctaLabel = 'Сонгох',
  highlightIndex = 1,
}: {
  ctaHref?: string;
  ctaLabel?: string;
  /** 0-based; default 2 дахь багцыг онцлох */
  highlightIndex?: number;
}) {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPricingPlans();
        if (!cancelled) setPlans(data);
      } catch {
        if (!cancelled) setError('Багцын мэдээлэл ачаалж чадсангүй');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-sm text-mist-400">{error}</p>;
  }

  if (plans.length === 0) {
    return (
      <p className="text-center text-sm text-mist-400">
        Идэвхтэй багц байхгүй. Admin → Төлбөрийн багц хэсгээс тохируулна уу.
      </p>
    );
  }

  return (
    <div
      className={`grid gap-6 ${
        plans.length === 1
          ? 'md:grid-cols-1 max-w-md mx-auto'
          : plans.length === 2
            ? 'md:grid-cols-2'
            : 'md:grid-cols-3'
      }`}
    >
      {plans.map((plan, index) => {
        const highlight = index === highlightIndex || (plans.length === 1 && index === 0);
        return (
          <div
            key={plan.id}
            className={`rounded-2xl border p-7 ${
              highlight ? 'border-brand bg-brand/5' : 'border-ink-700 bg-ink-800'
            }`}
          >
            {highlight && (
              <p className="mb-4 inline-block rounded-full bg-brand/20 px-3 py-1 text-xs font-medium text-brand">
                Санал болгох
              </p>
            )}
            <h3 className="mb-1 font-display text-xl font-semibold text-mist-50">{plan.name}</h3>
            {plan.discountPercent > 0 && (
              <p className="text-sm text-mist-500 line-through">{formatMnt(plan.priceMnt)}</p>
            )}
            <p className="mb-1 font-display text-3xl font-semibold text-mist-50">
              {formatMnt(plan.amountMnt)}
            </p>
            <p className="mb-1 text-xs text-mist-400">{formatDuration(plan.durationDays)}</p>
            {plan.discountPercent > 0 && (
              <p className="mb-2 text-xs font-medium text-emerald-400">
                −{plan.discountPercent}% хямдрал
              </p>
            )}
            {plan.description && (
              <p className="mt-3 text-sm leading-relaxed text-mist-300">{plan.description}</p>
            )}
            <ul className="mb-8 mt-4 space-y-2">
              <li className="flex items-start gap-2 text-sm text-mist-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                Бүх өгүүллэг нээлттэй
              </li>
              <li className="flex items-start gap-2 text-sm text-mist-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {plan.durationDays} хоног VIP
              </li>
            </ul>
            <Link
              href={ctaHref}
              className={`block rounded-xl px-5 py-3 text-center text-sm font-semibold transition-colors ${
                highlight
                  ? 'bg-brand text-ink-950 hover:bg-brand-hover'
                  : 'border border-ink-600 text-mist-200 hover:bg-ink-700'
              }`}
            >
              {ctaLabel}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

/** pricing-section.tsx-д ашиглах товчтой хувилбар */
export function PublicPricingSectionCards() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getPricingPlans()
      .then((data) => {
        if (!cancelled) setPlans(data);
      })
      .catch(() => {
        if (!cancelled) setPlans([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {plans.map((plan, index) => {
        const highlighted = index === 1 || plans.length === 1;
        return (
          <div
            key={plan.id}
            className={`rounded-2xl border p-6 ${
              highlighted ? 'border-brand bg-brand-muted/20' : 'border-ink-700 bg-ink-950'
            }`}
          >
            <h3 className="font-display text-lg font-medium text-mist-50">{plan.name}</h3>
            <p className="mt-3">
              <span className="font-display text-3xl font-semibold text-mist-50">
                {formatMnt(plan.amountMnt)}
              </span>
              <span className="text-sm text-mist-400"> / {plan.durationDays} хоног</span>
            </p>
            {plan.description && (
              <p className="mt-3 text-sm text-mist-400">{plan.description}</p>
            )}
            <Link href="/register" className="mt-6 block">
              <Button variant={highlighted ? 'primary' : 'secondary'} className="w-full">
                Сонгох
              </Button>
            </Link>
          </div>
        );
      })}
      {plans.length === 0 && (
        <p className="col-span-full text-center text-sm text-mist-400">Идэвхтэй багц байхгүй.</p>
      )}
    </div>
  );
}
