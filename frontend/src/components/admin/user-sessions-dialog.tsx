'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LogOut, X } from 'lucide-react';
import {
  AdminUserSession,
  getAdminUserSessions,
  revokeAdminUserSession,
  revokeAllAdminUserSessions,
} from '@/lib/admin-services';
import { Button } from '@/components/ui/button';
import { DeviceSessionList } from '@/components/auth/device-session-list';
import { toast } from '@/store/toast-store';

/** Админ: хэрэглэгчийн нэвтэрсэн төхөөрөмжүүдийг харах, хүчээр гаргах. */
export function UserSessionsDialog({
  user,
  onClose,
}: {
  user: { id: string; email: string; displayName: string } | null;
  onClose: () => void;
}) {
  const [sessions, setSessions] = useState<AdminUserSession[]>([]);
  const [limits, setLimits] = useState<{ maxDevices: number; maxActive: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getAdminUserSessions(user.id);
      setSessions(data.sessions);
      setLimits(data.limits);
    } catch {
      toast.error('Төхөөрөмжийн жагсаалт татахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!user) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [user, onClose]);

  if (!user || typeof document === 'undefined') return null;

  const revokeOne = async (id: string) => {
    setBusy(id);
    try {
      await revokeAdminUserSession(user.id, id);
      toast.success('Төхөөрөмжөөс гаргалаа');
      await load();
    } catch {
      toast.error('Гаргахад алдаа гарлаа');
    } finally {
      setBusy(null);
    }
  };

  const revokeAll = async () => {
    setBusy('all');
    try {
      const res = await revokeAllAdminUserSessions(user.id);
      toast.success(`${res.revoked} төхөөрөмжөөс гаргалаа`);
      await load();
    } catch {
      toast.error('Гаргахад алдаа гарлаа');
    } finally {
      setBusy(null);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-ink-600 bg-ink-900 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold text-mist-50">Нэвтэрсэн төхөөрөмжүүд</h3>
            <p className="mt-0.5 truncate text-xs text-mist-400">
              {user.displayName} · {user.email}
              {limits ? ` · лимит ${limits.maxDevices} / зэрэг ${limits.maxActive}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-mist-400 hover:bg-ink-800 hover:text-mist-100"
            aria-label="Хаах"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          {loading && sessions.length === 0 ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-14 rounded-xl bg-ink-800/70" />
              <div className="h-14 rounded-xl bg-ink-800/50" />
            </div>
          ) : (
            <DeviceSessionList
              sessions={sessions}
              renderAction={(s) => (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 px-2.5 text-xs"
                  isLoading={busy === s.id}
                  disabled={busy !== null}
                  onClick={() => void revokeOne(s.id)}
                >
                  Гаргах
                </Button>
              )}
            />
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy !== null}>
            Хаах
          </Button>
          <Button
            type="button"
            className="gap-1.5"
            isLoading={busy === 'all'}
            disabled={busy !== null || sessions.length === 0}
            onClick={() => void revokeAll()}
          >
            <LogOut className="h-3.5 w-3.5" />
            Бүх төхөөрөмжөөс гаргах
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
