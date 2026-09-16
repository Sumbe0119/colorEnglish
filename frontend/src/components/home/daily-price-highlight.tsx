"use client";

import { useEffect, useState } from "react";
import { formatMnt, getPricingPlans, type PricingPlan } from "@/lib/billing-services";

/** Өдөрт ногдох үнийг 1 сарын (30 хоног) багцын үнээс тооцно */
const MONTH_DAYS = 30;
const HIGHLIGHT_DAYS = 11;

/** 30 хоногийн багц; байхгүй бол хамгийн богино хугацаатай багц */
function pickMonthlyPlan(plans: PricingPlan[]) {
  const valid = plans.filter((p) => p.durationDays > 0 && p.amountMnt > 0);
  return (
    valid.find((p) => p.durationDays === MONTH_DAYS) ??
    [...valid].sort((a, b) => a.durationDays - b.durationDays)[0] ??
    null
  );
}

export function DailyPriceHighlight() {
  const [perDay, setPerDay] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPricingPlans()
      .then((plans) => {
        if (cancelled) return;
        const plan = pickMonthlyPlan(plans);
        if (!plan) {
          setFailed(true);
          return;
        }
        // 30 хоногийн дүн рүү хөрвүүлээд 30-д хуваана; бутархайгүй бүхэл төгрөг
        const monthlyAmount = (plan.amountMnt / plan.durationDays) * MONTH_DAYS;
        setPerDay(Math.round(monthlyAmount / MONTH_DAYS));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Статик үнэ харуулахгүй — багцын мэдээлэл ирээгүй бол хэсгийг нууна
  if (failed) return null;

  return (
    <div className="mb-12 rounded-2xl border border-ink-700 bg-ink-900/80 p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist-500">Өдөрт ногдох нь</p>
          <p className="mt-2 flex flex-wrap items-baseline gap-2">
            {perDay === null ? (
              <span className="inline-block h-10 w-32 animate-pulse rounded-lg bg-ink-700 md:h-12" aria-label="Үнэ ачаалж байна" />
            ) : (
              <span className="font-display text-4xl font-semibold tracking-tight text-brand md:text-5xl">{formatMnt(perDay)}</span>
            )}
            <span className="text-sm text-mist-400">/ өдөр</span>
          </p>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-mist-300 md:text-right md:text-base">
          Өөрийн боловосролд оруулсан өрөнгө оруулалт тань ирээдүйд 1000Х үржигдэн ирэх болно.
        </p>
      </div>

      <div className="mt-8 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${MONTH_DAYS}, minmax(0, 1fr))` }}>
        {Array.from({ length: MONTH_DAYS }, (_, i) => (
          <div key={i} className={`h-3 rounded-sm md:h-3.5 ${i < HIGHLIGHT_DAYS ? "bg-brand" : "bg-brand/45"}`} />
        ))}
      </div>

      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mist-500">
        {MONTH_DAYS} хоног • {MONTH_DAYS} өдрийн хөтөлбөр
      </p>
    </div>
  );
}
