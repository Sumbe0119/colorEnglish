// frontend/src/components/home/pricing-section.tsx
import { PublicPricingSectionCards } from '@/components/billing/public-pricing-grid';

export function PricingSection() {
  return (
    <section className="bg-ink-900 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mist-400">Үнэ</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-mist-50">
          Эхлээд үнэгүй, дараа нь шийд
        </h2>
        <PublicPricingSectionCards />
      </div>
    </section>
  );
}
