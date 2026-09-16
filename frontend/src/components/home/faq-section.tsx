'use client';

import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FaqItem = { q: string; a: string };

type Props = {
  items: FaqItem[];
  id?: string;
  eyebrow?: string;
  title?: string;
  /** Анх нээлттэй байх асуултын индекс; null бол бүгд хаалттай */
  defaultOpen?: number | null;
};

/** Нэг удаад нэг асуулт нээгддэг accordion. Хаалттай хариулт ч HTML-д үлддэг (SEO). */
export function FaqSection({
  items,
  id,
  eyebrow = 'Асуулт хариулт',
  title = 'Түгээмэл асуулт',
  defaultOpen = 0,
}: Props) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <section id={id} className="border-t border-ink-700 bg-ink-900 px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 text-xs uppercase tracking-widest text-brand">{eyebrow}</p>
        <h2 className="mb-12 font-display text-3xl font-semibold text-mist-50">{title}</h2>

        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            const buttonId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;

            return (
              <div
                key={item.q}
                className={cn(
                  'rounded-xl border transition-colors duration-200',
                  isOpen ? 'border-brand/40 bg-ink-800' : 'border-ink-700 bg-ink-800/50 hover:border-ink-600 hover:bg-ink-800',
                )}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 sm:px-6 sm:py-5"
                  >
                    <span
                      className={cn(
                        'flex-1 font-display text-base font-semibold transition-colors',
                        isOpen ? 'text-mist-50' : 'text-mist-100',
                      )}
                    >
                      {item.q}
                    </span>
                    {/* Нээгдэхэд "+" 45° эргэж "×" болно */}
                    <span
                      aria-hidden
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 motion-reduce:transition-none',
                        isOpen ? 'rotate-45 border-brand/50 bg-brand/15 text-brand' : 'border-ink-600 text-mist-400',
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>

                {/* grid-rows 0fr → 1fr: өндрийг хэмжихгүйгээр зөөлөн нээгдэнэ */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p
                      className={cn(
                        'px-5 pb-5 text-sm leading-relaxed text-mist-300 transition-opacity duration-300 motion-reduce:transition-none sm:px-6',
                        isOpen ? 'opacity-100' : 'opacity-0',
                      )}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
