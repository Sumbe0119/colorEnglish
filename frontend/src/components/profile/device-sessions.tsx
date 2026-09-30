'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, MonitorSmartphone, RotateCcw } from 'lucide-react';
import { getSessions, revokeOtherSessions, revokeSession } from '@/lib/services';
import type { DeviceSession, SessionLimits } from '@/types/auth';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DeviceSessionList } from '@/components/auth/device-session-list';
import { toast } from '@/store/toast-store';

/** Профайл дээрх "Нэвтэрсэн төхөөрөмжүүд" хэсэг. */
export function DeviceSessions() {
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [limits, setLimits] = useState<SessionLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState<DeviceSession | null>(null);
  const [othersOpen, setOthersOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessions();
      setSessions(data.sessions);
      setLimits(data.limits);
    } catch {
      setError('Төхөөрөмжийн жагсаалт татахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleRevoke = async () => {
    if (!target) return;
    setBusy(true);
    try {
      const res = await revokeSession(target.id);
      if (res.isCurrent) {
        clearSession();
        router.push('/login');
        return;
      }
      toast.success(`${target.deviceName ?? 'Төхөөрөмж'}-өөс гаргалаа`);
      setTarget(null);
      await load();
    } catch {
      toast.error('Гаргахад алдаа гарлаа');
    } finally {
      setBusy(false);
    }
  };

  const handleRevokeOthers = async () => {
    setBusy(true);
    try {
      const res = await revokeOtherSessions();
      toast.success(res.revoked > 0 ? `${res.revoked} төхөөрөмжөөс гаргалаа` : 'Өөр төхөөрөмж байхгүй байна');
      setOthersOpen(false);
      await load();
    } catch {
      toast.error('Гаргахад алдаа гарлаа');
    } finally {
      setBusy(false);
    }
  };

  const others = sessions.filter((s) => !s.isCurrent);

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold text-mist-50">Нэвтэрсэн төхөөрөмжүүд</h2>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-mist-400">
            <MonitorSmartphone className="h-3.5 w-3.5" />
            {limits
              ? `${sessions.length} / ${limits.maxDevices} төхөөрөмж · зэрэг ${limits.maxActive} хүртэл ашиглана`
              : 'Бүртгэлдээ нэвтэрсэн төхөөрөмжүүдээ удирдана'}
          </div>
        </div>
        {others.length > 0 && (
          <Button
            type="button"
            variant="secondary"
            className="h-9 gap-1.5 px-3 text-xs"
            onClick={() => setOthersOpen(true)}
          >
            <LogOut className="h-3.5 w-3.5" />
            Бусад бүх төхөөрөмжөөс гарах
          </Button>
        )}
      </div>

      <div className="rounded-3xl border border-ink-700/60 bg-ink-900/70 p-4 sm:p-5">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-14 rounded-xl bg-ink-800/70" />
            <div className="h-14 rounded-xl bg-ink-800/50" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-between gap-3 text-sm text-mist-400">
            <span>{error}</span>
            <button type="button" onClick={() => void load()} className="inline-flex items-center gap-1 text-brand">
              <RotateCcw className="h-3.5 w-3.5" /> Дахин
            </button>
          </div>
        ) : (
          <DeviceSessionList
            sessions={sessions}
            renderAction={(s) => (
              <Button
                type="button"
                variant="ghost"
                className="h-8 px-2.5 text-xs"
                onClick={() => setTarget(s)}
              >
                Гарах
              </Button>
            )}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!target}
        title={target?.isCurrent ? 'Энэ төхөөрөмжөөс гарах уу?' : 'Төхөөрөмжөөс гаргах уу?'}
        description={
          target
            ? target.isCurrent
              ? 'Та одоо ашиглаж буй төхөөрөмжөөсөө гарна. Дахин нэвтрэх шаардлагатай болно.'
              : `${target.deviceName ?? 'Энэ төхөөрөмж'} дээрх нэвтрэлт хаагдаж, тэндээс дахин нэвтрэх шаардлагатай болно.`
            : undefined
        }
        confirmLabel="Гарах"
        isLoading={busy}
        onConfirm={handleRevoke}
        onCancel={() => setTarget(null)}
      />

      <ConfirmDialog
        open={othersOpen}
        title="Бусад бүх төхөөрөмжөөс гарах уу?"
        description={`Одоогийн төхөөрөмжөөс бусад ${others.length} төхөөрөмж дээрх нэвтрэлт хаагдана.`}
        confirmLabel="Бүгдээс гарах"
        isLoading={busy}
        onConfirm={handleRevokeOthers}
        onCancel={() => setOthersOpen(false)}
      />
    </section>
  );
}
