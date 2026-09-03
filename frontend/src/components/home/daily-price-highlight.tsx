'use client';

import { useEffect, useState } from 'react';
import { formatMnt, getPricingPlans, type PricingPlan } from '@/lib/billing-services';

const FALLBACK_DAYS = 21;
const FALLBACK_PER_DAY = 1666;
const HIGHLIGHT_DAYS = 11;

function pickFeaturedPlan(plans: PricingPlan[]) {
  const twentyOne = plans.find((p) => p.durationDays === 21);
  if (twentyOne) return twentyOne;
  return plans[0] ?? null;
}

export function DailyPriceHighlight() {
  const [perDay, setPerDay] = useState(FALLBACK_PER_DAY);
  const [days, setDays] = useState(FALLBACK_DAYS);

  useEffect(() => {
    let cancelled = false;
    getPricingPlans()
      .then((plans) => {
        if (cancelled) return;
        const plan = pickFeaturedPlan(plans);
        if (!plan || plan.durationDays <= 0) return;
        setDays(plan.durationDays);
        setPerDay(Math.round(plan.amountMnt / plan.durationDays));
      })
      .catch(() => {
        /* fallback values */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const segments = Math.min(Math.max(days, 1), 31);

  return (
    <div className="mb-12 rounded-2xl border border-ink-700 bg-ink-900/80 p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist-500">
            Өдөрт ногдох нь
          </p>
          <p className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="font-display text-4xl font-semibold tracking-tight text-brand md:text-5xl">
              {formatMnt(perDay)}
            </span>
            <span className="text-sm text-mist-400">/ өдөр</span>
          </p>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-mist-300 md:text-right md:text-base">
          Аяга сүүтэй цайны үнээр {days} хоногийн турш хувийн багштайгаа хэлний бэрхшээлээсээ
          гараарай.
        </p>
      </div>

      <div className="mt-8 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${segments}, minmax(0, 1fr))` }}>
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className={`h-3 rounded-sm md:h-3.5 ${
              i < HIGHLIGHT_DAYS ? 'bg-brand' : 'bg-brand/45'
            }`}
          />
        ))}
      </div>

      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mist-500">
        {days} хоног • {days} өдрийн хөтөлбөр
      </p>
    </div>
  );
}
