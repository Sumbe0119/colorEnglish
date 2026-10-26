// frontend/src/app/admin/teacher-applications/page.tsx
// Админ: footer-оос ирсэн багшийн CV-үүд — жагсаалт, хайлт, төлөвөөр шүүх, дэлгэрэнгүй
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, GraduationCap, RefreshCw, Search, X } from 'lucide-react';
import {
  getAdminTeacherApplications,
  TEACHER_STATUS_LABELS,
  TEACHER_STATUSES,
  type AdminTeacherApplication,
  type AdminTeacherApplicationsPage,
  type AdminTeacherApplicationsQuery,
} from '@/lib/teacher-services';
import { getApiErrorMessage } from '@/lib/api-error';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TeacherApplicationDialog, formatDateTime, teacherStatusClass } from '@/components/admin/teacher-application-dialog';

const PAGE_SIZES = [20, 50, 100] as const;
const SEARCH_DEBOUNCE_MS = 350;

type StatusFilter = NonNullable<AdminTeacherApplicationsQuery['status']>;

export default function AdminTeacherApplicationsPage() {
  const [data, setData] = useState<AdminTeacherApplicationsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(20);

  const [selected, setSelected] = useState<AdminTeacherApplication | null>(null);
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
      getAdminTeacherApplications({ page, pageSize, q: debouncedQuery, status })
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

  const handleUpdated = (next: AdminTeacherApplication) => {
    setSelected(next);
    setData((prev) => (prev ? { ...prev, items: prev.items.map((i) => (i.id === next.id ? next : i)) } : prev));
    load(true);
  };

  const handleDeleted = (id: string) => {
    setSelected(null);
    setData((prev) => (prev ? { ...prev, items: prev.items.filter((i) => i.id !== id), total: Math.max(0, prev.total - 1) } : prev));
    load(true);
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
            <GraduationCap className="h-5 w-5 text-brand" />
            Багшийн CV
          </h2>
          <p className="mt-1 text-sm text-mist-400">
            Нүүр хуудасны footer → <span className="text-mist-300">Багшаар CV илгээх</span> (/teacher-cv) формоор ирсэн хүсэлтүүд.
            Мөр дээр дарж дэлгэрэнгүйг харж, төлөв/тэмдэглэл засна.
          </p>
        </div>
        <Button type="button" variant="secondary" className="h-9 gap-1.5 px-3 py-1.5 text-xs" onClick={() => load()}>
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} /> Шинэчлэх
        </Button>
      </div>

      {data && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Нийт CV" value={String(data.stats.total)} hint="илгээсэн бүх хүсэлт" />
          <StatCard
            label="Шинэ"
            value={String(data.stats.newCount)}
            hint="хараахан хянаагүй"
            tone={data.stats.newCount > 0 ? 'warn' : undefined}
          />
          <StatCard label="Өнөөдөр" value={String(data.stats.todayCount)} hint="өнөөдөр ирсэн" />
          <StatCard label="Зөвшөөрсөн" value={String(data.stats.acceptedCount)} hint="багт нэгдэх" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Нэр, утас, и-мэйл…"
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
          <option value="all">Бүх төлөв</option>
          {TEACHER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {TEACHER_STATUS_LABELS[s]}
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
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-ink-700 bg-ink-900/80 text-xs uppercase tracking-wide text-mist-500">
            <tr>
              <th className="px-4 py-3 font-medium">Огноо</th>
              <th className="px-4 py-3 font-medium">Нэр</th>
              <th className="px-4 py-3 font-medium">Утас / и-мэйл</th>
              <th className="px-4 py-3 font-medium">Холбоо барих</th>
              <th className="px-4 py-3 font-medium">Контент</th>
              <th className="px-4 py-3 font-medium">Төлөв</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700/80">
            {!data && loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-14">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-mist-400">
                  {hasFilters ? 'Шүүлтүүрт тохирох CV олдсонгүй' : 'Одоогоор ирсэн CV байхгүй'}
                </td>
              </tr>
            ) : (
              items.map((r) => (
                <tr
                  key={r.id}
                  className="cursor-pointer bg-ink-900/40 hover:bg-ink-800/50"
                  onClick={() => setSelected(r)}
                >
                  <td className="px-4 py-3 text-xs text-mist-300">
                    <div>{formatDateTime(r.createdAt)}</div>
                    {r.reviewedAt && <div className="text-mist-500">хянасан: {formatDateTime(r.reviewedAt)}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-ink-600 bg-ink-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.photoUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-mist-50">{r.fullName}</div>
                        <div className="text-xs text-mist-500">{r.age} нас</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-mist-100">{r.phone}</div>
                    {r.email && <div className="truncate text-xs text-mist-500">{r.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="font-mono text-mist-200">{r.contactPhone}</div>
                    {r.contactName && <div className="text-mist-500">{r.contactName}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs',
                        r.contentInterest ? 'bg-emerald-500/15 text-emerald-300' : 'bg-ink-700 text-mist-400',
                      )}
                    >
                      {r.contentInterest ? 'Тийм' : 'Үгүй'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs', teacherStatusClass(r.status))}>
                      {TEACHER_STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 gap-1 px-2 py-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(r);
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" /> Харах
                    </Button>
                  </td>
                </tr>
              ))
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

      <TeacherApplicationDialog
        application={selected}
        onClose={() => setSelected(null)}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
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
