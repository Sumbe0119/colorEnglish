// frontend/src/components/layout/subscription-status-bar.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Sparkles } from 'lucide-react';
import { getSubscriptionMe, type SubscriptionMe } from '@/lib/billing-services';

export function SubscriptionStatusBar() {
  const pathname = usePathname();
  const [sub, setSub] = useState<SubscriptionMe | null>(null);

  useEffect(() => {
    if (pathname.startsWith('/billing')) return;
    let cancelled = false;
    getSubscriptionMe()
      .then((data) => {
        if (!cancelled) setSub(data);
      })
      .catch(() => {
        if (!cancelled) setSub(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (pathname.startsWith('/billing') || !sub) return null;

  return (
    <div className="border-t border-ink-600/60 lg:border-t-0">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:px-6 md:px-10 lg:px-10">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-mist-500">
            Одоогийн төлөв
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="font-display text-sm font-semibold text-mist-50">
              {sub.isPro ? 'VIP идэвхтэй' : 'Free'}
            </p>
            {sub.isPro && sub.expiresAt && (
              <p className="text-xs text-mist-300">
                Дуусах: {new Date(sub.expiresAt).toLocaleString('mn-MN')}
                {sub.daysLeft != null && (
                  <span className="text-brand"> · {sub.daysLeft} хоног үлдсэн</span>
                )}
              </p>
            )}
            {!sub.isPro && (
              <p className="text-xs text-mist-400">Эхний 3 өгүүллэг үнэгүй · бусад нь VIP</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {sub.isPro ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow-glow ring-1 ring-brand/40">
              <Sparkles className="h-3.5 w-3.5" /> VIP
            </span>
          ) : (
            <Link
              href="/billing"
              className="inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand hover:bg-brand/20"
            >
              Багц авах
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
