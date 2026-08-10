// frontend/src/components/ui/toaster.tsx
'use client';

import { X } from 'lucide-react';
import { useToastStore } from '@/store/toast-store';

const kindClass: Record<string, string> = {
  success: 'border-success/50 bg-success/15 text-success',
  error: 'border-danger/50 bg-danger/15 text-danger',
  info: 'border-brand/50 bg-brand/20 text-brand',
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(100%-2rem,22rem)] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-sm ${kindClass[t.kind]}`}
          role="status"
        >
          <p className="min-w-0 flex-1 leading-snug">{t.message}</p>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="shrink-0 rounded-md p-0.5 opacity-70 hover:opacity-100"
            aria-label="Хаах"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
