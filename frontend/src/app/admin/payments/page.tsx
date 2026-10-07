// frontend/src/app/admin/payments/page.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Receipt,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import {
  AdminPaymentRow,
  AdminPaymentsPage as AdminPaymentsPageData,
  AdminPaymentsQuery,
  confirmAdminPayment,
  formatMnt,
  getAdminPayments,
  recheckAdminPayment,
} from '@/lib/billing-services';
import { getApiErrorMessage } from '@/lib/api-error';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from '@/store/toast-store';

const PAGE_SIZES = [20, 50, 100] as const;
const SEARCH_DEBOUNCE_MS = 350;

type StatusFilter = NonNullable<AdminPaymentsQuery['status']>;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Бүх төлөв' },
  { value: 'PAID', label: 'Төлсөн' },
  { value: 'PENDING', label: 'Хүлээгдэж буй' },
  { value: 'EXPIRED', label: 'Хугацаа дууссан' },
  { value: 'FAILED', label: 'Амжилтгүй' },
  { value: 'CANCELED', label: 'Цуцлагдсан' },
];

function statusLabel(status: AdminPaymentRow['status']) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
}

function statusClass(status: AdminPaymentRow['status']) {
  switch (status) {
    case 'PAID':
      return 'bg-emerald-500/15 text-emerald-300';
    case 'PENDING':
      return 'bg-amber-500/15 text-amber-200';
    case 'FAILED':
      return 'bg-red-500/15 text-red-300';
    default:
      return 'bg-ink-700 text-mist-400';
  }
}

function sourceLabel(source: string | null) {
  switch (source) {
    case 'QPAY_CALLBACK':
      return 'QPay callback';
    case 'USER_CHECK':
      return 'Хэрэглэгч шалгасан';
    case 'SWEEP':
      return 'Автомат шалгалт';
    case 'ADMIN_RECHECK':
      return 'Админ QPay шалгалт';
    case 'ADMIN_MANUAL':
      return 'Админ гараар';
    default:
      return null;
  }
}

function formatDateTime(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('mn-MN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('mn-MN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminPaymentsPage() {
  const [data, setData] = useState<AdminPaymentsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(20);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<AdminPaymentRow | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, status, pageSize]);

  const load = useCallback(
    (silent = false) => {
      const id = ++requestId.current;
      if (!silent) setLoading(true);
      setError(null);
      getAdminPayments({ page, pageSize, q: debouncedQuery, status })
        .then((res) => {
          if (id !== requestId.current) return;
          setData(res);
        })
        .catch((err) => {
          if (id !== requestId.current) return;
          setError(getApiErrorMessage(err, 'Төлбөрийн жагсаалт татахад алдаа гарлаа'));
        })
        .finally(() => {
          if (id === requestId.current) setLoading(false);
        });
    },
    [page, pageSize, debouncedQuery, status],
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleRecheck = async (row: AdminPaymentRow) => {
    setBusyId(row.id);
    try {
      const res = await recheckAdminPayment(row.id);
      if (res.activated) {
        toast.success(`${row.user.displayName}: QPay дээр төлөгдсөн — VIP идэвхжлээ`);
      } else if (res.alreadyPaid) {
        toast.info('Энэ төлбөр аль хэдийн төлөгдсөн байна');
      } else {
        toast.info('QPay дээр төлбөр бүртгэгдээгүй байна');
      }
      load(true);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'QPay шалгалт амжилтгүй'));
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirm = async () => {
    if (!confirmTarget) return;
    setBusyId(confirmTarget.id);
    try {
      await confirmAdminPayment(confirmTarget.id, 'Банкны хуулгаар админ баталгаажуулав');
      toast.success(`${confirmTarget.user.displayName}: төлбөр баталгаажиж VIP идэвхжлээ`);
      setConfirmTarget(null);
      load(true);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Баталгаажуулахад алдаа гарлаа'));
    } finally {
      setBusyId(null);
    }
  };

  const hasFilters = query !== '' || status !== 'all';
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const attentionCount = items.filter((p) => p.attention).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Receipt className="h-5 w-5 text-brand" />
            Төлбөрийн түүх
          </h2>
          <p className="mt-1 text-sm text-mist-400">
            QPay гүйлгээ бүр — утас, invoice дугаар, төлөв. Гүйлгээний утга:{' '}
            <span className="font-mono text-mist-300">COLORENGLISH &lt;утас&gt;</span>
          </p>
        </div>
        <Button type="button" variant="secondary" className="h-9 gap-1.5 px-3 py-1.5 text-xs" onClick={() => load()}>
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} /> Шинэчлэх
        </Button>
      </div>

      {/* ── Статистик ────────────────────────────────────────── */}
      {data && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Нийт төлсөн" value={formatMnt(data.stats.paidRevenueMnt)} hint={`${data.stats.paidCount} гүйлгээ`} />
          <StatCard label="Өнөөдөр" value={formatMnt(data.stats.todayRevenueMnt)} hint={`${data.stats.todayCount} гүйлгээ`} />
          <StatCard
            label="Хүлээгдэж буй"
            value={String(data.stats.pendingCount)}
            hint="2 мин тутам QPay-аас автоматаар шалгана"
            tone={data.stats.pendingCount > 0 ? 'warn' : undefined}
          />
          <StatCard
            label="Анхаарах"
            value={String(attentionCount)}
            hint="Төлсөн ч VIP идэвхгүй (энэ хуудсанд)"
            tone={attentionCount > 0 ? 'danger' : undefined}
          />
        </div>
      )}

      {/* ── Хайлт + шүүлтүүр ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Утас, имэйл, нэр, invoice…"
            className="py-2 pl-9 text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className={cn(
            'rounded-xl border bg-ink-800 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40',
            status === 'all' ? 'border-ink-500 text-mist-300' : 'border-brand/50 text-brand',
          )}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setStatus('all');
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs text-mist-400 transition-colors hover:bg-ink-800 hover:text-mist-50"
          >
            <X className="h-3.5 w-3.5" /> Цэвэрлэх
          </button>
        )}
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      {/* ── Хүснэгт ──────────────────────────────────────────── */}
      <div className={cn('overflow-x-auto rounded-2xl border border-ink-600/80 transition-opacity', loading && 'opacity-60')}>
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-ink-700 bg-ink-900/80 text-xs uppercase tracking-wide text-mist-500">
            <tr>
              <th className="px-4 py-3 font-medium">Огноо</th>
              <th className="px-4 py-3 font-medium">Хэрэглэгч</th>
              <th className="px-4 py-3 font-medium">Утас</th>
              <th className="px-4 py-3 font-medium">Багц</th>
              <th className="px-4 py-3 font-medium">Дүн</th>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Төлөв</th>
              <th className="px-4 py-3 font-medium">VIP</th>
              <th className="px-4 py-3 font-medium">Үйлдэл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700/80">
            {!data && loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-14">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-mist-400">
                  Төлбөр олдсонгүй
                </td>
              </tr>
            ) : (
              items.map((p) => {
                const src = sourceLabel(p.activationSource);
                const canAct = p.status !== 'PAID';
                return (
                  <tr
                    key={p.id}
                    className={cn('bg-ink-900/40 hover:bg-ink-800/50', p.attention && 'bg-red-500/5 hover:bg-red-500/10')}
                  >
                    <td className="px-4 py-3 text-xs text-mist-300">
                      <div>{formatDateTime(p.createdAt)}</div>
                      {p.paidAt && <div className="text-mist-500">төлсөн: {formatDateTime(p.paidAt)}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-mist-50">{p.user.displayName}</div>
                      <div className="text-xs text-mist-500">{p.user.email}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-mist-100">{p.payerPhone ?? p.user.phone ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="text-mist-100">{p.planName}</div>
                      <div className="text-xs text-mist-500">{p.durationDays} хоног</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-mist-100">{formatMnt(p.amountMnt)}</div>
                      {(p.discountPercent > 0 || p.promoDiscountPercent > 0) && (
                        <div className="text-xs text-mist-500">
                          <span className="line-through">{formatMnt(p.listPriceMnt)}</span>
                          {p.promoCodeValue && ` · ${p.promoCodeValue} −${p.promoDiscountPercent}%`}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-mist-300">
                      <div title="sender_invoice_no">{p.senderInvoiceNo}</div>
                      {p.qpayPaymentId && (
                        <div className="text-mist-500" title="QPay payment_id">
                          qpay: {p.qpayPaymentId}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2.5 py-0.5 text-xs', statusClass(p.status))}>
                        {statusLabel(p.status)}
                      </span>
                      {src && <div className="mt-1 text-[11px] text-mist-500">{src}</div>}
                      {p.status === 'PENDING' && p.qpayCheckedAt && (
                        <div className="mt-0.5 text-[11px] text-mist-600">шалгасан: {formatDateTime(p.qpayCheckedAt)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {p.attention ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-300">
                          <AlertTriangle className="h-3 w-3" /> VIP биш
                        </span>
                      ) : p.user.isPro ? (
                        <div>
                          <span className="rounded-md bg-brand/15 px-2 py-0.5 text-xs font-medium text-brand">VIP</span>
                          <div className="mt-1 text-[11px] text-mist-500">{formatDate(p.user.subscriptionExpiresAt)} хүртэл</div>
                        </div>
                      ) : (
                        <span className="text-xs text-mist-500">Үнэгүй</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {canAct ? (
                        <div className="flex items-center gap-1.5">
                          {p.qpayInvoiceId && (
                            <Button
                              type="button"
                              variant="secondary"
                              className="h-8 gap-1 px-2.5 py-1 text-xs"
                              title="QPay-аас дахин шалгах"
                              isLoading={busyId === p.id}
                              disabled={busyId !== null}
                              onClick={() => void handleRecheck(p)}
                            >
                              <RefreshCw className="h-3.5 w-3.5" /> QPay
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 gap-1 px-2 py-1 text-xs"
                            title="Банкны хуулгаар баталгаажуулж VIP нээх"
                            disabled={busyId !== null}
                            onClick={() => setConfirmTarget(p)}
                          >
                            <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" /> Гараар
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-mist-600">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Хуудаслалт ───────────────────────────────────────── */}
      <div className="flex flex-col gap-3 text-xs text-mist-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span>
            {total === 0 ? '0' : `${from}–${to}`} / {total}
          </span>
          <label className="flex items-center gap-1.5">
            <span>Хуудсанд</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value) as (typeof PAGE_SIZES)[number])}
              className="rounded-lg border border-ink-600 bg-ink-800 px-2 py-1 text-xs text-mist-100 focus:border-brand focus:outline-none"
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex items-center gap-1">
          <PageButton disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))} aria-label="Өмнөх хуудас">
            <ChevronLeft className="h-4 w-4" />
          </PageButton>
          <span className="px-2 tabular-nums">
            {page} / {totalPages}
          </span>
          <PageButton
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Дараагийн хуудас"
          >
            <ChevronRight className="h-4 w-4" />
          </PageButton>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Төлбөрийг гараар баталгаажуулах уу?"
        description={
          confirmTarget
            ? `${confirmTarget.user.displayName} (${confirmTarget.payerPhone ?? confirmTarget.user.email}) — ${formatMnt(
                confirmTarget.amountMnt,
              )}, ${confirmTarget.planName}. Invoice: ${confirmTarget.senderInvoiceNo}. Банкны хуулга дээр энэ гүйлгээ орсон эсэхийг шалгасан бол PAID болгож ${confirmTarget.durationDays} хоногийн VIP нээнэ.`
            : undefined
        }
        confirmLabel="Тийм, баталгаажуулах"
        cancelLabel="Болих"
        isLoading={busyId === confirmTarget?.id}
        onConfirm={() => void handleConfirm()}
        onCancel={() => {
          if (busyId === null) setConfirmTarget(null);
        }}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'warn' | 'danger';
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border px-4 py-3',
        tone === 'danger'
          ? 'border-red-500/30 bg-red-500/5'
          : tone === 'warn'
            ? 'border-amber-500/30 bg-amber-500/5'
            : 'border-ink-600/80 bg-ink-900/40',
      )}
    >
      <p className="text-xs uppercase tracking-wide text-mist-500">{label}</p>
      <p
        className={cn(
          'mt-1 font-display text-xl font-semibold',
          tone === 'danger' ? 'text-red-300' : tone === 'warn' ? 'text-amber-200' : 'text-mist-50',
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-mist-500">{hint}</p>}
    </div>
  );
}

function PageButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-ink-600 bg-ink-800 px-2 text-xs text-mist-200 transition-colors hover:border-brand/40 hover:text-mist-50 disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    />
  );
}
