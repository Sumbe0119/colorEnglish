// frontend/src/app/admin/pricing/page.tsx
'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CreditCard, Pencil, Plus, Trash2, X } from 'lucide-react';
import {
  createAdminPricingPlan,
  deleteAdminPricingPlan,
  formatMnt,
  getAdminPricingPlans,
  PricingPlan,
  updateAdminPricingPlan,
} from '@/lib/billing-services';
import { getApiErrorMessage } from '@/lib/api-error';
import { toast } from '@/store/toast-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

type PlanForm = {
  code: string;
  name: string;
  description: string;
  priceMnt: string;
  discountPercent: string;
  durationDays: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyForm = (): PlanForm => ({
  code: '',
  name: '',
  description: '',
  priceMnt: '19900',
  discountPercent: '0',
  durationDays: '30',
  sortOrder: '',
  isActive: true,
});

function planToForm(p: PricingPlan): PlanForm {
  return {
    code: p.code,
    name: p.name,
    description: p.description ?? '',
    priceMnt: String(p.priceMnt),
    discountPercent: String(p.discountPercent),
    durationDays: String(p.durationDays),
    sortOrder: String(p.sortOrder),
    isActive: p.isActive,
  };
}

function previewAmount(price: string, discount: string) {
  return Math.max(
    100,
    Math.round(Number(price || 0) * (1 - Number(discount || 0) / 100)),
  );
}

function formatDuration(days: number) {
  if (days % 30 === 0) return `${days / 30} сар`;
  return `${days} хоног`;
}

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | null>(null);
  const [editPlan, setEditPlan] = useState<PricingPlan | null>(null);
  const [form, setForm] = useState<PlanForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PricingPlan | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminPricingPlans();
      setPlans(data);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Үнийн жагсаалт ачаалж чадсангүй'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const closeDialog = useCallback((force = false) => {
    if (saving && !force) return;
    setDialogMode(null);
    setEditPlan(null);
    setForm(emptyForm());
  }, [saving]);

  useEffect(() => {
    if (!dialogMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) closeDialog();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [dialogMode, saving, closeDialog]);

  const openCreate = () => {
    setEditPlan(null);
    setForm(emptyForm());
    setDialogMode('create');
  };

  const openEdit = (plan: PricingPlan) => {
    setEditPlan(plan);
    setForm(planToForm(plan));
    setDialogMode('edit');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (dialogMode === 'create') {
        const created = await createAdminPricingPlan({
          code: form.code.trim().toUpperCase(),
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          priceMnt: Number(form.priceMnt),
          discountPercent: Number(form.discountPercent || 0),
          durationDays: Number(form.durationDays),
          sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
          isActive: form.isActive,
        });
        setPlans((prev) => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder));
        toast.success('Шинэ багц үүслээ');
      } else if (dialogMode === 'edit' && editPlan) {
        const updated = await updateAdminPricingPlan(editPlan.id, {
          name: form.name.trim(),
          description: form.description.trim() || null,
          priceMnt: Number(form.priceMnt),
          discountPercent: Number(form.discountPercent),
          durationDays: Number(form.durationDays),
          sortOrder: Number(form.sortOrder || 0),
          isActive: form.isActive,
        });
        setPlans((prev) =>
          prev
            .map((p) => (p.id === editPlan.id ? updated : p))
            .sort((a, b) => a.sortOrder - b.sortOrder),
        );
        toast.success('Багц хадгаллаа');
      }
      closeDialog(true);
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          dialogMode === 'create' ? 'Үүсгэхэд алдаа гарлаа' : 'Хадгалахад алдаа гарлаа',
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteAdminPricingPlan(deleteTarget.id);
      if (res.softDeleted) {
        setPlans((prev) =>
          prev.map((p) => (p.id === deleteTarget.id ? { ...p, isActive: false } : p)),
        );
        toast.success('Төлбөрийн түүхтэй тул идэвхгүй болголоо');
      } else {
        setPlans((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        toast.success('Багц устгалаа');
      }
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Устгахад алдаа гарлаа'));
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
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/admin" className="text-sm text-mist-400 hover:text-mist-50">
            ← Admin
          </Link>
          <h1 className="mt-2 flex items-center gap-2 font-display text-2xl font-semibold">
            <CreditCard className="h-6 w-6 text-brand" />
            Төлбөрийн багц
          </h1>
          <p className="mt-1 text-sm text-mist-400">
            Багцыг хараад Edit дарж засна. Идэвхтэй багцууд `/billing` болон нүүр хуудсанд
            гарна.
          </p>
        </div>
        <Button type="button" onClick={openCreate} className="shrink-0 py-2.5">
          <Plus className="h-4 w-4" /> Шинэ багц
        </Button>
      </div>

      {plans.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink-600 px-5 py-16 text-center text-sm text-mist-400">
          Багц байхгүй. «Шинэ багц» дарж нэмнэ үү.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-5 ${
                plan.isActive
                  ? 'border-ink-700 bg-ink-900'
                  : 'border-ink-700/50 bg-ink-950/50 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium uppercase tracking-wide text-mist-500">
                    {plan.code}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-semibold text-mist-50">
                    {plan.name}
                  </h2>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    plan.isActive
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-amber-500/15 text-amber-200'
                  }`}
                >
                  {plan.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
                </span>
              </div>

              <div className="mt-4">
                {plan.discountPercent > 0 && (
                  <p className="text-sm text-mist-500 line-through">
                    {formatMnt(plan.priceMnt)}
                  </p>
                )}
                <p className="font-display text-2xl font-semibold text-brand">
                  {formatMnt(plan.amountMnt)}
                </p>
                <p className="mt-1 text-xs text-mist-400">
                  {formatDuration(plan.durationDays)}
                  {plan.discountPercent > 0 && (
                    <span className="text-emerald-400"> · −{plan.discountPercent}%</span>
                  )}
                  <span className="text-mist-500"> · эрэмбэ {plan.sortOrder}</span>
                </p>
              </div>

              {plan.description ? (
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-mist-400">
                  {plan.description}
                </p>
              ) : (
                <p className="mt-3 flex-1 text-sm text-mist-600">Тайлбар байхгүй</p>
              )}

              <div className="mt-5 flex gap-2 border-t border-ink-700/80 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 py-2"
                  onClick={() => openEdit(plan)}
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(plan)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-danger/30 px-3 py-2 text-xs text-danger hover:bg-danger/10"
                  aria-label="Устгах"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Create / Edit dialog */}
      {dialogMode && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink-950/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => closeDialog()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pricing-form-title"
        >
          <div
            className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-ink-600 bg-ink-900 shadow-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-ink-700 bg-ink-900/95 px-5 py-4 backdrop-blur">
              <div>
                <h2
                  id="pricing-form-title"
                  className="font-display text-lg font-semibold text-mist-50"
                >
                  {dialogMode === 'create' ? 'Шинэ багц' : 'Багц засах'}
                </h2>
                {dialogMode === 'edit' && editPlan && (
                  <p className="mt-0.5 text-xs text-mist-500">{editPlan.code}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => closeDialog()}
                disabled={saving}
                className="rounded-lg p-1.5 text-mist-400 hover:bg-ink-800 hover:text-mist-50 disabled:opacity-50"
                aria-label="Хаах"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              {dialogMode === 'create' && (
                <Input
                  label="Код (жишээ: VIP_1_MONTH)"
                  value={form.code}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                  }
                  placeholder="VIP_1_MONTH"
                  required
                />
              )}
              <Input
                label="Нэр"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="VIP 1 сар"
                required
              />
              <Input
                label="Тайлбар"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Үнэ (₮)"
                  type="number"
                  min={100}
                  value={form.priceMnt}
                  onChange={(e) => setForm((f) => ({ ...f, priceMnt: e.target.value }))}
                  required
                />
                <Input
                  label="Хямдрал (%)"
                  type="number"
                  min={0}
                  max={100}
                  value={form.discountPercent}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, discountPercent: e.target.value }))
                  }
                />
                <Input
                  label="Хугацаа (хоног)"
                  type="number"
                  min={1}
                  value={form.durationDays}
                  onChange={(e) => setForm((f) => ({ ...f, durationDays: e.target.value }))}
                  required
                />
                <Input
                  label="Эрэмбэ"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                  placeholder={dialogMode === 'create' ? 'автомат' : undefined}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-700 bg-ink-950/40 px-4 py-3">
                <label className="flex items-center gap-2 text-sm text-mist-300">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  />
                  Идэвхтэй
                </label>
                <p className="text-sm text-mist-300">
                  Төлөх:{' '}
                  <span className="font-semibold text-brand">
                    {formatMnt(previewAmount(form.priceMnt, form.discountPercent))}
                  </span>
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 py-2.5"
                  onClick={() => closeDialog()}
                  disabled={saving}
                >
                  Болих
                </Button>
                <Button type="submit" className="flex-1 py-2.5" isLoading={saving}>
                  {dialogMode === 'create' ? 'Үүсгэх' : 'Хадгалах'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Багц устгах уу?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" (${deleteTarget.code}) устгах гэж байна. Төлбөрийн түүхтэй бол зөвхөн идэвхгүй болно.`
            : undefined
        }
        confirmLabel="Устгах"
        cancelLabel="Болих"
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
