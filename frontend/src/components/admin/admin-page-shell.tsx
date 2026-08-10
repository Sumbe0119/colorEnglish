import Link from 'next/link';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { ADMIN_CREATE_STEPS } from '@/components/admin/admin-nav';

export function AdminPageShell({
  step,
  title,
  description,
  icon: Icon,
  children,
}: {
  step?: number;
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-mist-400 hover:text-mist-50"
      >
        <ArrowLeft className="h-4 w-4" /> Сургалтын бүтэц
      </Link>

      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15">
          <Icon className="h-6 w-6 text-brand" />
        </div>
        <div>
          {step !== undefined && (
            <span className="mb-1 inline-block rounded-full bg-brand/20 px-2.5 py-0.5 text-xs font-medium text-brand">
              Алхам {step} / {ADMIN_CREATE_STEPS}
            </span>
          )}
          <h1 className="font-display text-2xl font-semibold text-mist-50">{title}</h1>
          <p className="mt-1 text-sm text-mist-400">{description}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-ink-600 bg-ink-900/95 p-6 shadow-card md:p-8">{children}</div>
    </div>
  );
}
