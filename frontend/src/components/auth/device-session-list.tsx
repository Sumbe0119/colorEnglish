'use client';

import type { ReactNode } from 'react';
import { Laptop, Monitor, Smartphone, Tablet } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DeviceSessionRow {
  id: string;
  deviceName: string | null;
  deviceType: string | null;
  ipAddress: string | null;
  lastSeenAt: string;
  createdAt: string;
  isActiveNow: boolean;
  isCurrent?: boolean;
}

export function DeviceIcon({ type, className }: { type: string | null; className?: string }) {
  const cls = cn('h-5 w-5', className);
  if (type === 'phone') return <Smartphone className={cls} />;
  if (type === 'tablet') return <Tablet className={cls} />;
  if (type === 'desktop') return <Laptop className={cls} />;
  return <Monitor className={cls} />;
}

/** "5 минутын өмнө", "3 цагийн өмнө", "2 хоногийн өмнө" */
export function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60_000);
  if (min < 1) return 'дөнгөж сая';
  if (min < 60) return `${min} минутын өмнө`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `${hours} цагийн өмнө`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} хоногийн өмнө`;
  return new Date(iso).toLocaleDateString('mn-MN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function DeviceSessionList({
  sessions,
  renderAction,
  onSelect,
  selectedIds,
  emptyText = 'Нэвтэрсэн төхөөрөмж алга.',
  className,
}: {
  sessions: DeviceSessionRow[];
  /** Мөр бүрийн баруун талд харуулах товч */
  renderAction?: (s: DeviceSessionRow) => ReactNode;
  /** Өгвөл мөрүүд сонгогддог (checkbox) болно */
  onSelect?: (id: string) => void;
  selectedIds?: Set<string>;
  emptyText?: string;
  className?: string;
}) {
  if (sessions.length === 0) {
    return <p className={cn('text-sm text-mist-500', className)}>{emptyText}</p>;
  }

  return (
    <ul className={cn('divide-y divide-ink-700/60 overflow-hidden rounded-2xl border border-ink-700/60', className)}>
      {sessions.map((s) => {
        const selectable = !!onSelect;
        const selected = selectedIds?.has(s.id) ?? false;
        const Row: 'li' | 'label' = selectable ? 'label' : 'li';
        return (
          <Row
            key={s.id}
            className={cn(
              'flex items-center gap-3 bg-ink-900/60 px-4 py-3',
              selectable && 'cursor-pointer hover:bg-ink-800/60',
              selected && 'bg-brand/10',
            )}
          >
            {selectable && (
              <input
                type="checkbox"
                className="h-4 w-4 shrink-0 accent-brand"
                checked={selected}
                onChange={() => onSelect?.(s.id)}
              />
            )}
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
                s.isCurrent ? 'border-brand/40 bg-brand/15 text-brand' : 'border-ink-700 bg-ink-800 text-mist-300',
              )}
            >
              <DeviceIcon type={s.deviceType} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-medium text-mist-50">{s.deviceName ?? 'Үл мэдэгдэх төхөөрөмж'}</span>
                {s.isCurrent && (
                  <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                    Энэ төхөөрөмж
                  </span>
                )}
                {!s.isCurrent && s.isActiveNow && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Идэвхтэй
                  </span>
                )}
              </div>
              <div className="mt-0.5 truncate text-xs text-mist-500">
                Сүүлд: {formatRelative(s.lastSeenAt)}
                {s.ipAddress ? ` · ${s.ipAddress}` : ''}
              </div>
            </div>
            {renderAction && <div className="shrink-0">{renderAction(s)}</div>}
          </Row>
        );
      })}
    </ul>
  );
}
