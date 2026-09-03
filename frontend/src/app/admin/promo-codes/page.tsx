'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Percent, Plus, Trash2, Users } from 'lucide-react';
import {
  createAdminPromoCode,
  deleteAdminPromoCode,
  DiscountCodeAdmin,
  formatMnt,
  getAdminPromoCodes,
  updateAdminPromoCode,
} from '@/lib/billing-services';
import { getApiErrorMessage } from '@/lib/api-error';
import { toast } from '@/store/toast-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

type FormState = {
  code: string;
  discountPercent: string;
  expiresAt: string;
  maxUses: string;
  onePerUser: boolean;
  note: string;
  isActive: boolean;
};

const emptyForm = (): FormState => ({
  code: '',
  discountPercent: '20',
  expiresAt: '',
  maxUses: '',
  onePerUser: true,
  note: '',
  isActive: true,
});

function formatDate(iso: string | null) {
  if (!iso) return 'Хугацаагүй';
  return new Date(iso).toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** type="date" утгыг тухайн өдрийн 00:00:00 (локл) ISO болгоно */
function dateOnlyToMidnightIso(dateOnly: string) {
  const [y, m, d] = dateOnly.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0).toISOString();
}

export default function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<DiscountCodeAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DiscountCodeAdmin | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCodes(await getAdminPromoCodes());
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Кодын жагсаалт татахад алдаа'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAdminPromoCode({
        code: form.code.trim(),
        discountPercent: Number(form.discountPercent),
        expiresAt: form.expiresAt ? dateOnlyToMidnightIso(form.expiresAt) : null,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        onePerUser: form.onePerUser,
        isActive: form.isActive,
        note: form.note.trim() || null,
      });
      toast.success('Хөнгөлөлтийн код үүслээ');
      setForm(emptyForm());
      setFormOpen(false);
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Үүсгэхэд алдаа'));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (row: DiscountCodeAdmin) => {
    try {
      await updateAdminPromoCode(row.id, { isActive: !row.isActive });
      toast.success(row.isActive ? 'Код идэвхгүй болгосон' : 'Код идэвхжүүлсэн');
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Шинэчлэхэд алдаа'));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAdminPromoCode(deleteTarget.id);
      toast.success('Код устгасан / идэвхгүй болгосон');
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Устгахад алдаа'));
    } finally {
      setDeleting(false);
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
            <Percent className="h-5 w-5 text-brand" />
            Хөнгөлөлтийн код
          </h2>
          <p className="mt-1 text-sm text-mist-400">
            Код үүсгэж хямдрал %, хугацаа тохируулна. Хэрэглэгчийн ашиглалтыг энд харна.
          </p>
        </div>
        <Button type="button" onClick={() => setFormOpen((v) => !v)}>
          <Plus className="h-4 w-4" /> Шинэ код
        </Button>
      </div>

      {formOpen && (
        <form onSubmit={handleCreate} className="ce-panel space-y-4 p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Код"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="SAVE20"
              required
            />
            <Input
              label="Хямдрал %"
              type="number"
              min={1}
              max={100}
              value={form.discountPercent}
              onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))}
              required
            />
            <Input
              label="Дуусах өдөр (тухайн өдрийн 00:00 хүртэл)"
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
            />
            <Input
              label="Max ашиглалт (хоосон = хязгааргүй)"
              type="number"
              min={1}
              value={form.maxUses}
              onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
            />
            <Input
              label="Тэмдэглэл"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Facebook кампанит..."
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-mist-300">
            <input
              type="checkbox"
              checked={form.onePerUser}
              onChange={(e) => setForm((f) => ({ ...f, onePerUser: e.target.checked }))}
              className="rounded border-ink-600"
            />
            Нэг хэрэглэгч нэг удаа
          </label>
          <div className="flex gap-2">
            <Button type="submit" isLoading={saving}>
              Үүсгэх
            </Button>
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>
              Болих
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {codes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink-600 p-8 text-center text-sm text-mist-400">
            Одоогоор код байхгүй.
          </p>
        ) : (
          codes.map((row) => (
            <div key={row.id} className="ce-panel overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-3 p-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-lg font-semibold text-brand">{row.code}</span>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
                      −{row.discountPercent}%
                    </span>
                    {!row.isActive && (
                      <span className="rounded-full bg-ink-700 px-2 py-0.5 text-xs text-mist-400">
                        Идэвхгүй
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-mist-500">
                    Дуусах: {row.expiresAt ? `${formatDate(row.expiresAt)} 00:00` : 'Хугацаагүй'}
                    {row.maxUses != null ? ` · max ${row.maxUses}` : ' · хязгааргүй'}
                    {row.onePerUser ? ' · 1/user' : ''}
                  </p>
                  {row.note && <p className="mt-1 text-xs text-mist-400">{row.note}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-lg bg-brand/10 px-2.5 py-1 text-brand">
                    <Users className="mr-1 inline h-3.5 w-3.5" />
                    {row.stats.uniqueUsers} хэрэглэгч
                  </span>
                  <span className="rounded-lg bg-ink-800 px-2.5 py-1 text-mist-300">
                    {row.stats.paidCount} төлсөн
                  </span>
                  <span className="rounded-lg bg-ink-800 px-2.5 py-1 text-mist-300">
                    {formatMnt(row.stats.totalRevenueMnt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-ink-700 px-4 py-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-8 px-3 text-xs"
                  onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                >
                  {expandedId === row.id ? 'Нуух' : 'Хэрэглэгчид харах'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-8 px-3 text-xs"
                  onClick={() => void toggleActive(row)}
                >
                  {row.isActive ? 'Идэвхгүй болгох' : 'Идэвхжүүлэх'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 px-3 text-xs text-red-300"
                  onClick={() => setDeleteTarget(row)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {expandedId === row.id && (
                <div className="border-t border-ink-700 bg-ink-950/40 px-4 py-3">
                  {row.recentUsers.length === 0 ? (
                    <p className="text-xs text-mist-500">Төлсөн хэрэглэгч байхгүй.</p>
                  ) : (
                    <ul className="space-y-2">
                      {row.recentUsers.map((u) => (
                        <li
                          key={u.paymentId}
                          className="flex flex-wrap items-center justify-between gap-2 text-sm"
                        >
                          <div>
                            <p className="text-mist-100">{u.displayName}</p>
                            <p className="text-xs text-mist-500">{u.email}</p>
                          </div>
                          <div className="text-right text-xs text-mist-400">
                            <p>{formatMnt(u.amountMnt)}</p>
                            <p>{u.paidAt ? formatDate(u.paidAt) : '—'}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Код устгах уу?"
        description={
          deleteTarget
            ? `${deleteTarget.code} — төлбөрийн түүхтэй бол зөвхөн идэвхгүй болгоно.`
            : undefined
        }
        confirmLabel="Устгах"
        isLoading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  );
}
