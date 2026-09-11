// frontend/src/components/billing/vip-gate.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, Sparkles } from 'lucide-react';
import { getSubscriptionMe } from '@/lib/billing-services';

/**
 * Контентыг зөвхөн VIP (эсвэл админ/эдитор) хэрэглэгчид харуулна.
 * VIP биш бол контентыг огт render хийлгүй VIP авах саналыг харуулна.
 */
export function VipGate({
  children,
  title = 'Энэ хэсэг VIP багцад багтана',
  description = 'VIP багцаа аваад дүрэм, дасгал, бүх контентыг бүрэн ашиглаарай.',
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSubscriptionMe()
      .then((sub) => {
        if (!cancelled) setAllowed(Boolean(sub.isPro || sub.staffAccess));
      })
      .catch(() => {
        if (!cancelled) setAllowed(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (allowed === null) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-brand/30 bg-ink-900 p-8 text-center shadow-card">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/15 text-brand">
          <Lock className="h-6 w-6" />
        </span>
        <h2 className="font-display text-xl font-semibold text-mist-50">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-mist-400">{description}</p>
        <Link
          href="/billing"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
        >
          <Sparkles className="h-4 w-4" />
          VIP авах
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
