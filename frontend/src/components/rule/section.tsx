// frontend/src/components/rule/section.tsx
'use client';

import type { ComponentType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'default' | 'brand' | 'danger' | 'warning';

const TONE_ICON: Record<Tone, string> = {
  default: 'border-ink-600 bg-ink-800 text-mist-300',
  brand: 'border-brand/40 bg-brand/15 text-brand',
  danger: 'border-danger/40 bg-danger/10 text-danger',
  warning: 'border-modifier/40 bg-modifier/10 text-modifier',
};

const TONE_PANEL: Record<Tone, string> = {
  default: '',
  brand: 'border-brand/30 bg-brand/[0.06]',
  danger: 'border-danger/25',
  warning: 'border-modifier/30',
};

/** Дүрмийн дэлгэрэнгүйн нэг хэсэг — гарчиг, дүрс, агуулга. */
export function Section({
  icon: Icon,
  title,
  subtitle,
  tone = 'default',
  children,
  className,
  action,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn('ce-panel p-5 sm:p-6', TONE_PANEL[tone], className)}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border',
            TONE_ICON[tone],
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold text-mist-50">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-mist-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
