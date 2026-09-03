// frontend/src/components/ui/confirm-dialog.tsx
'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Тийм',
  cancelLabel = 'Болих',
  confirmVariant = 'primary',
  isLoading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onCancel();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, isLoading, onCancel]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!isLoading) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-ink-600 bg-ink-900 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="confirm-dialog-title"
              className="font-display text-lg font-semibold text-mist-50"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm leading-relaxed text-mist-400">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-mist-400 hover:bg-ink-800 hover:text-mist-50 disabled:opacity-50"
            aria-label="Хаах"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1 py-2.5"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            className="flex-1 py-2.5"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
