// frontend/src/app/billing/page.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BillingPanel } from '@/components/billing/billing-panel';

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/profile"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-mist-400 hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" /> Профайл руу
        </Link>
        <h1 className="font-display text-2xl font-semibold text-mist-50">Багц авах</h1>
        <p className="mt-2 text-sm text-mist-400">
          QPay-ээр төлж VIP нээнэ. Хугацаа дуусахад автоматаар Free болно.
        </p>
      </div>

      <BillingPanel compact />
    </div>
  );
}
