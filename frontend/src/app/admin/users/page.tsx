// frontend/src/app/admin/users/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Sparkles, Users } from 'lucide-react';
import {
  AdminUserBilling,
  getAdminUsers,
  grantAdminUserVipMonth,
} from '@/lib/admin-services';
import { formatMnt } from '@/lib/billing-services';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from '@/store/toast-store';

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserBilling[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [grantTarget, setGrantTarget] = useState<AdminUserBilling | null>(null);
  const [granting, setGranting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getAdminUsers()
      .then(setUsers)
      .catch(() => {
        setUsers([]);
        setError('Хэрэглэгчдийн жагсаалт татахад алдаа гарлаа');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.displayName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.planName.toLowerCase().includes(q) ||
        u.plan.toLowerCase().includes(q),
    );
  }, [users, query]);

  const proCount = users.filter((u) => u.isPro).length;

  const handleGrantConfirm = async () => {
    if (!grantTarget) return;
    setGranting(true);
    try {
      const result = await grantAdminUserVipMonth(grantTarget.id, 30);
      toast.success(
        result.extended
          ? `${grantTarget.displayName}-д +30 хоног нэмэгдлээ`
          : `${grantTarget.displayName}-д 1 сарын VIP олголоо`,
      );
      setGrantTarget(null);
      load();
    } catch {
      toast.error('Сарын эрх олгоход алдаа гарлаа');
    } finally {
      setGranting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Users className="h-5 w-5 text-brand" />
            Хэрэглэгчид
          </h2>
          <p className="mt-1 text-sm text-mist-400">
            Нэр, багц, үлдсэн хоног · нийт {users.length} · VIP {proCount}
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Нэр, имэйл, багц…"
            className="pl-9"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-ink-600/80">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-ink-700 bg-ink-900/80 text-xs uppercase tracking-wide text-mist-500">
            <tr>
              <th className="px-4 py-3 font-medium">Хэрэглэгч</th>
              <th className="px-4 py-3 font-medium">Багц</th>
              <th className="px-4 py-3 font-medium">Үлдсэн</th>
              <th className="px-4 py-3 font-medium">Дуусах</th>
              <th className="px-4 py-3 font-medium">Сүүлийн төлбөр</th>
              <th className="px-4 py-3 font-medium">Роль</th>
              <th className="px-4 py-3 font-medium">Үйлдэл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700/80">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-mist-400">
                  Хэрэглэгч олдсонгүй
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="bg-ink-900/40 hover:bg-ink-800/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-mist-50">{u.displayName}</div>
                    <div className="text-xs text-mist-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-mist-100">{u.planName}</div>
                    <div className="text-xs text-mist-500">{u.plan}</div>
                  </td>
                  <td className="px-4 py-3">
                    {u.isPro && u.daysLeft != null ? (
                      <span className="rounded-md bg-brand/15 px-2 py-0.5 text-xs font-medium text-brand">
                        {u.daysLeft} хоног
                      </span>
                    ) : (
                      <span className="text-mist-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-mist-300">{formatDate(u.expiresAt)}</td>
                  <td className="px-4 py-3">
                    {u.lastPayment ? (
                      <div>
                        <div className="text-mist-100">{formatMnt(u.lastPayment.amountMnt)}</div>
                        <div className="text-xs text-mist-500">
                          {u.lastPayment.planName} · {formatDate(u.lastPayment.paidAt)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-mist-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-mist-400">{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-8 gap-1.5 px-2.5 py-1 text-xs"
                      onClick={() => setGrantTarget(u)}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-brand" />
                      +1 сар
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!grantTarget}
        title="Баталгаажуулах"
        description={
          grantTarget
            ? grantTarget.isPro
              ? `${grantTarget.displayName} (${grantTarget.email})-ийн одоогийн VIP дээр +30 хоног (1 сар) нэмэх үү?`
              : `${grantTarget.displayName} (${grantTarget.email})-д 30 хоногийн (1 сар) VIP эрх олгох уу?`
            : undefined
        }
        confirmLabel="Тийм, олгох"
        cancelLabel="Болих"
        isLoading={granting}
        onConfirm={() => void handleGrantConfirm()}
        onCancel={() => {
          if (!granting) setGrantTarget(null);
        }}
      />
    </div>
  );
}
