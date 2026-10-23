// frontend/src/app/admin/placement-tests/page.tsx
// Админ: түвшин тогтоох тестийн оролдлогууд + төлбөр (QPay дахин шалгах / гараар баталгаажуулах)
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BadgeCheck, ChevronLeft, ChevronRight, ClipboardCheck, RefreshCw, Search, X } from 'lucide-react';
import {
  confirmAdminPlacement,
  formatDuration,
  getAdminPlacementAttempts,
  recheckAdminPlacement,
  type AdminPlacementPage as AdminPlacementPageData,
  type AdminPlacementQuery,
  type AdminPlacementRow,
} from '@/lib/placement-services';
import { formatMnt } from '@/lib/billing-services';
import { getApiErrorMessage } from '@/lib/api-error';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from '@/store/toast-store';

const PAGE_SIZES = [20, 50, 100] as const;
const SEARCH_DEBOUNCE_MS = 350;

type StatusFilter = NonNullable<AdminPlacementQuery['status']>;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Бүх төлөв' },
  { value: 'PAID', label: 'Төлсөн' },
  { value: 'PENDING', label: 'Хүлээгдэж буй (invoice-тэй)' },
  { value: 'UNPAID', label: 'Төлбөр эхлээгүй' },
  { value: 'EXPIRED', label: 'Хугацаа дууссан' },
  { value: 'FAILED', label: 'Амжилтгүй' },
  { value: 'CANCELED', label: 'Цуцлагдсан' },
];

function statusLabel(status: AdminPlacementRow['status']) {
  switch (status) {
    case 'PAID':
      return 'Төлсөн';
    case 'PENDING':
      return 'Хүлээгдэж буй';
    case 'UNPAID':
      return 'Төлбөр эхлээгүй';
    case 'EXPIRED':
      return 'Хугацаа дууссан';
    case 'FAILED':
      return 'Амжилтгүй';
    case 'CANCELED':
      return 'Цуцлагдсан';
    default:
      return status;
  }
}

function statusClass(status: AdminPlacementRow['status']) {
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

export default function AdminPlacementTestsPage() {
  const [data, setData] = useState<AdminPlacementPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(20);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<AdminPlacementRow | null>(null);
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
      getAdminPlacementAttempts({ page, pageSize, q: debouncedQuery, status })
        .then((res) => {
          if (id !== requestId.current) return;
          setData(res);
        })
        .catch((err) => {
          if (id !== requestId.current) return;
          setError(getApiErrorMessage(err, 'Жагсаалт татахад алдаа гарлаа'));
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

  const handleRecheck = async (row: AdminPlacementRow) => {
    setBusyId(row.id);
    try {
      const res = await recheckAdminPlacement(row.id);
      if (res.activated) toast.success(`${row.payerPhone ?? row.id}: QPay дээр төлөгдсөн — үр дүн нээгдлээ`);
      else if (res.alreadyPaid) toast.info('Энэ төлбөр аль хэдийн төлөгдсөн байна');
      else toast.info('QPay дээр төлбөр бүртгэгдээгүй байна');
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
      await confirmAdminPlacement(confirmTarget.id, 'Банкны хуулгаар админ баталгаажуулав');
      toast.success(`${confirmTarget.payerPhone ?? confirmTarget.id}: төлбөр баталгаажиж үр дүн нээгдлээ`);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <ClipboardCheck className="h-5 w-5 text-brand" />
            Түвшин тогтоох тест
          </h2>
          <p className="mt-1 text-sm text-mist-400">
            Зочны оролдлого бүр, түвшин, QPay төлбөр. Гүйлгээний утга:{' '}
            <span className="font-mono text-mist-300">COLORENGLISH TEST &lt;утас&gt;</span>
            {data && <> · үр дүн нээх үнэ: <span className="text-mist-200">{formatMnt(data.stats.priceMnt)}</span></>}
          </p>
        </div>
        <Button type="button" variant="secondary" className="h-9 gap-1.5 px-3 py-1.5 text-xs" onClick={() => load()}>
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} /> Шинэчлэх
        </Button>
      </div>

      {data && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Нийт оролдлого" value={String(data.stats.totalAttempts)} hint="тест дуусгасан зочид" />
          <StatCard label="Төлсөн" value={formatMnt(data.stats.paidRevenueMnt)} hint={`${data.stats.paidCount} үр дүн нээсэн`} />
          <StatCard label="Өнөөдөр" value={formatMnt(data.stats.todayRevenueMnt)} hint={`${data.stats.todayCount} төлбөр`} />
          <StatCard
            label="Хүлээгдэж буй"
            value={String(data.stats.pendingCount)}
            hint="invoice үүссэн, 2 мин тутам шалгана"
            tone={data.stats.pendingCount > 0 ? 'warn' : undefined}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Утас, invoice, и-мэйл…"
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

      {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

      <div className={cn('overflow-x-auto rounded-2xl border border-ink-600/80 transition-opacity', loading && 'opacity-60')}>
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-ink-700 bg-ink-900/80 text-xs uppercase tracking-wide text-mist-500">
            <tr>
              <th className="px-4 py-3 font-medium">Огноо</th>
              <th className="px-4 py-3 font-medium">Утас / хэрэглэгч</th>
              <th className="px-4 py-3 font-medium">Түвшин</th>
              <th className="px-4 py-3 font-medium">Оноо</th>
              <th className="px-4 py-3 font-medium">Дүн</th>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Төлөв</th>
              <th className="px-4 py-3 font-medium">Үйлдэл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700/80">
            {!data && loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-14">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-mist-400">
                  Оролдлого олдсонгүй
                </td>
              </tr>
            ) : (
              items.map((r) => {
                const src = sourceLabel(r.activationSource);
                const canAct = r.status !== 'PAID';
                return (
                  <tr key={r.id} className="bg-ink-900/40 hover:bg-ink-800/50">
                    <td className="px-4 py-3 text-xs text-mist-300">
                      <div>{formatDateTime(r.createdAt)}</div>
                      {r.paidAt && <div className="text-mist-500">төлсөн: {formatDateTime(r.paidAt)}</div>}
                      <div className="text-mist-600">хугацаа: {formatDuration(r.durationSec)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-mono text-mist-100">{r.payerPhone ?? r.user?.phone ?? '—'}</div>
                      {r.user ? (
                        <div className="text-xs text-mist-500">
                          {r.user.displayName} · {r.user.email}
                        </div>
                      ) : (
                        <div className="text-xs text-mist-600">зочин</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2">
                        <span className="rounded-lg bg-brand/15 px-2 py-0.5 font-display text-sm font-semibold text-brand">{r.levelShort}</span>
                        <span className="text-xs text-mist-400">{r.levelTitle}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-mist-100">
                      {r.correctCount}/{r.totalQuestions}
                      <span className="ml-1 text-xs text-mist-500">({r.scorePercent}%)</span>
                    </td>
                    <td className="px-4 py-3 text-mist-100">{formatMnt(r.amountMnt)}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-mist-300">
                      <div title="sender_invoice_no">{r.senderInvoiceNo ?? '—'}</div>
                      {r.qpayPaymentId && (
                        <div className="text-mist-500" title="QPay payment_id">
                          qpay: {r.qpayPaymentId}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2.5 py-0.5 text-xs', statusClass(r.status))}>{statusLabel(r.status)}</span>
                      {src && <div className="mt-1 text-[11px] text-mist-500">{src}</div>}
                      {r.status === 'PENDING' && r.qpayCheckedAt && (
                        <div className="mt-0.5 text-[11px] text-mist-600">шалгасан: {formatDateTime(r.qpayCheckedAt)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {canAct ? (
                        <div className="flex items-center gap-1.5">
                          {r.qpayInvoiceId && (
                            <Button
                              type="button"
                              variant="secondary"
                              className="h-8 gap-1 px-2.5 py-1 text-xs"
                              title="QPay-аас дахин шалгах"
                              isLoading={busyId === r.id}
                              disabled={busyId !== null}
                              onClick={() => void handleRecheck(r)}
                            >
                              <RefreshCw className="h-3.5 w-3.5" /> QPay
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 gap-1 px-2 py-1 text-xs"
                            title="Банкны хуулгаар баталгаажуулж үр дүн нээх"
                            disabled={busyId !== null}
                            onClick={() => setConfirmTarget(r)}
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
            ? `Утас: ${confirmTarget.payerPhone ?? '—'} — ${formatMnt(confirmTarget.amountMnt)}, түвшин ${confirmTarget.levelShort}. Invoice: ${
                confirmTarget.senderInvoiceNo ?? 'үүсээгүй'
              }. Банкны хуулга дээр энэ гүйлгээ орсон эсэхийг шалгасан бол PAID болгож зочинд үр дүнг нээнэ.`
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

function StatCard({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: 'warn' | 'danger' }) {
  return (
    <div
      className={cn(
        'rounded-2xl border px-4 py-3',
        tone === 'danger' ? 'border-red-500/30 bg-red-500/5' : tone === 'warn' ? 'border-amber-500/30 bg-amber-500/5' : 'border-ink-600/80 bg-ink-900/40',
      )}
    >
      <p className="text-xs uppercase tracking-wide text-mist-500">{label}</p>
      <p className={cn('mt-1 font-display text-xl font-semibold', tone === 'danger' ? 'text-red-300' : tone === 'warn' ? 'text-amber-200' : 'text-mist-50')}>
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
