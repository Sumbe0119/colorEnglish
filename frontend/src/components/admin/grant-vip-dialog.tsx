// frontend/src/components/admin/grant-vip-dialog.tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/** Бэлэн сонголт: хоногийн тоо */
const PRESETS: { days: number; label: string }[] = [
  { days: 7, label: '7 хоног' },
  { days: 14, label: '14 хоног' },
  { days: 30, label: '1 сар' },
  { days: 90, label: '3 сар' },
  { days: 180, label: '6 сар' },
  { days: 365, label: '1 жил' },
];

const MIN_DAYS = 1;
const MAX_DAYS = 3650;

function formatDate(d: Date) {
  return d.toLocaleDateString('mn-MN', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Админ: хэрэглэгчид VIP олгох / сунгах — 1 сараас гадна дурын хоног сонгоно.
 * Идэвхтэй VIP-тэй бол дуусах өдөр дээр нэмэгдэнэ, үгүй бол өнөөдрөөс эхэлнэ.
 */
export function GrantVipDialog({
  user,
  isLoading = false,
  onConfirm,
  onClose,
}: {
  user: { displayName: string; email: string; isPro: boolean; expiresAt: string | null } | null;
  isLoading?: boolean;
  onConfirm: (durationDays: number) => void;
  onClose: () => void;
}) {
  const [days, setDays] = useState(30);
  const [custom, setCustom] = useState('');

  // Шинэ хэрэглэгч сонгоход 1 сар руу буцаана
  useEffect(() => {
    if (user) {
      setDays(30);
      setCustom('');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [user, isLoading, onClose]);

  if (!user || typeof document === 'undefined') return null;

  const isPreset = PRESETS.some((p) => p.days === days);
  const valid = Number.isInteger(days) && days >= MIN_DAYS && days <= MAX_DAYS;

  const baseDate =
    user.isPro && user.expiresAt && new Date(user.expiresAt).getTime() > Date.now()
      ? new Date(user.expiresAt)
      : new Date();
  const newEnd = new Date(baseDate);
  if (valid) newEnd.setDate(newEnd.getDate() + days);

  const onCustomChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setCustom(digits);
    if (digits) setDays(Number(digits));
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!isLoading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="grant-vip-title"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-ink-600 bg-ink-900 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="grant-vip-title" className="flex items-center gap-2 font-display text-lg font-semibold text-mist-50">
              <Sparkles className="h-4 w-4 text-brand" />
              VIP {user.isPro ? 'сунгах' : 'олгох'}
            </h2>
            <p className="mt-0.5 truncate text-xs text-mist-400">
              {user.displayName} · {user.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-mist-400 hover:bg-ink-800 hover:text-mist-50 disabled:opacity-50"
            aria-label="Хаах"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-mist-500">Хугацаа</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.days}
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setDays(p.days);
                  setCustom('');
                }}
                className={cn(
                  'rounded-xl border px-3 py-2 text-sm transition-colors',
                  days === p.days && !custom
                    ? 'border-brand/60 bg-brand/15 text-brand'
                    : 'border-ink-600 bg-ink-800 text-mist-200 hover:border-brand/40 hover:text-mist-50',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-end gap-2">
            <div className="flex-1">
              <Input
                label="Өөр хоног"
                inputMode="numeric"
                placeholder="Жишээ: 45"
                value={custom}
                onChange={(e) => onCustomChange(e.target.value)}
                disabled={isLoading}
                className="py-2 text-sm"
                error={
                  custom && !valid ? `${MIN_DAYS}–${MAX_DAYS} хоногийн хооронд байх ёстой` : undefined
                }
              />
            </div>
            <span className="pb-2.5 text-sm text-mist-400">хоног</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-ink-700 bg-ink-800/60 px-3 py-2.5 text-xs text-mist-300">
          {user.isPro && user.expiresAt ? (
            <>
              Одоогийн VIP {formatDate(new Date(user.expiresAt))} хүртэл. Дээр нь{' '}
              <span className="font-medium text-mist-50">+{valid ? days : '…'} хоног</span> нэмэгдэнэ
            </>
          ) : (
            <>
              Өнөөдрөөс <span className="font-medium text-mist-50">{valid ? days : '…'} хоног</span> VIP
              нээгдэнэ
            </>
          )}
          {valid && (
            <>
              {' '}
              → дуусах: <span className="font-medium text-brand">{formatDate(newEnd)}</span>
            </>
          )}
        </div>

        <div className="mt-5 flex gap-3">
          <Button type="button" variant="secondary" className="flex-1 py-2.5" onClick={onClose} disabled={isLoading}>
            Болих
          </Button>
          <Button
            type="button"
            className="flex-1 py-2.5"
            isLoading={isLoading}
            disabled={!valid}
            onClick={() => onConfirm(days)}
          >
            {isPreset && !custom
              ? `${PRESETS.find((p) => p.days === days)?.label} олгох`
              : valid
                ? `${days} хоног олгох`
                : 'Олгох'}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
