// frontend/src/app/admin/users/page.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MailCheck, MailX, Search, Sparkles, Users, X } from 'lucide-react';
import {
  AdminUserBilling,
  AdminUsersPage as AdminUsersPageData,
  AdminUsersQuery,
  getAdminUsers,
  grantAdminUserVipMonth,
} from '@/lib/admin-services';
import { formatMnt } from '@/lib/billing-services';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from '@/store/toast-store';

const PAGE_SIZES = [10, 20, 50] as const;
const SEARCH_DEBOUNCE_MS = 350;

type PlanFilter = NonNullable<AdminUsersQuery['plan']>;
type RoleFilter = NonNullable<AdminUsersQuery['role']> | 'all';
type VerifiedFilter = NonNullable<AdminUsersQuery['verified']>;

const PLAN_OPTIONS: { value: PlanFilter; label: string }[] = [
  { value: 'all', label: 'Бүх багц' },
  { value: 'pro', label: 'VIP' },
  { value: 'free', label: 'Үнэгүй' },
];

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'Бүх роль' },
  { value: 'STUDENT', label: 'Сурагч' },
  { value: 'EDITOR', label: 'Эдитор' },
  { value: 'ADMIN', label: 'Админ' },
];

const VERIFIED_OPTIONS: { value: VerifiedFilter; label: string }[] = [
  { value: 'all', label: 'И-мэйл: бүгд' },
  { value: 'verified', label: 'Баталгаажсан' },
  { value: 'unverified', label: 'Баталгаажаагүй' },
];

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminUsersPage() {
  const [data, setData] = useState<AdminUsersPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [plan, setPlan] = useState<PlanFilter>('all');
  const [role, setRole] = useState<RoleFilter>('all');
  const [verified, setVerified] = useState<VerifiedFilter>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(20);

  const [grantTarget, setGrantTarget] = useState<AdminUserBilling | null>(null);
  const [granting, setGranting] = useState(false);
  const requestId = useRef(0);

  // Хайлтыг debounce хийж, шүүлтүүр солигдоход 1-р хуудас руу буцаана.
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, plan, role, verified, pageSize]);

  const load = useCallback(() => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    getAdminUsers({
      page,
      pageSize,
      q: debouncedQuery,
      plan,
      role: role === 'all' ? undefined : role,
      verified,
    })
      .then((res) => {
        if (id !== requestId.current) return; // хоцорсон хариуг үл тоох
        setData(res);
      })
      .catch(() => {
        if (id !== requestId.current) return;
        setError('Хэрэглэгчдийн жагсаалт татахад алдаа гарлаа');
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }, [page, pageSize, debouncedQuery, plan, role, verified]);

  useEffect(() => {
    load();
  }, [load]);

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

  const hasFilters = query !== '' || plan !== 'all' || role !== 'all' || verified !== 'all';
  const resetFilters = () => {
    setQuery('');
    setPlan('all');
    setRole('all');
    setVerified('all');
  };

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
            <Users className="h-5 w-5 text-brand" />
            Хэрэглэгчид
          </h2>
          <p className="mt-1 text-sm text-mist-400">
            Нэр, багц, үлдсэн хоног
            {data && (
              <>
                {' '}
                · нийт {data.stats.total} · VIP {data.stats.pro}
              </>
            )}
          </p>
        </div>
      </div>

      {/* ── Хайлт + шүүлтүүр ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Нэр, имэйл…"
            className="py-2 pl-9 text-sm"
          />
        </div>
        <FilterSelect value={plan} options={PLAN_OPTIONS} onChange={setPlan} />
        <FilterSelect value={role} options={ROLE_OPTIONS} onChange={setRole} />
        <FilterSelect value={verified} options={VERIFIED_OPTIONS} onChange={setVerified} />
        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs text-mist-400 transition-colors hover:bg-ink-800 hover:text-mist-50"
          >
            <X className="h-3.5 w-3.5" /> Цэвэрлэх
          </button>
        )}
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* ── Хүснэгт ──────────────────────────────────────────── */}
      <div className={cn('overflow-x-auto rounded-2xl border border-ink-600/80 transition-opacity', loading && 'opacity-60')}>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-ink-700 bg-ink-900/80 text-xs uppercase tracking-wide text-mist-500">
            <tr>
              <th className="px-4 py-3 font-medium">Хэрэглэгч</th>
              <th className="px-4 py-3 font-medium">Багц</th>
              <th className="px-4 py-3 font-medium">Үлдсэн</th>
              <th className="px-4 py-3 font-medium">Дуусах</th>
              <th className="px-4 py-3 font-medium">Сүүлийн төлбөр</th>
              <th className="px-4 py-3 font-medium">Роль</th>
              <th className="px-4 py-3 font-medium">Бүртгүүлсэн</th>
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
                  Хэрэглэгч олдсонгүй
                </td>
              </tr>
            ) : (
              items.map((u) => (
                <tr key={u.id} className="bg-ink-900/40 hover:bg-ink-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium text-mist-50">
                      {u.displayName}
                      {u.isEmailVerified ? (
                        <MailCheck className="h-3.5 w-3.5 text-success" aria-label="И-мэйл баталгаажсан" />
                      ) : (
                        <MailX className="h-3.5 w-3.5 text-mist-500" aria-label="И-мэйл баталгаажаагүй" />
                      )}
                    </div>
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
                  <td className="px-4 py-3 text-xs text-mist-400">{formatDate(u.createdAt)}</td>
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

      {/* ── Хуудаслалт ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-mist-400">
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
          {pageNumbers(page, totalPages).map((n, i) =>
            n === null ? (
              <span key={`gap-${i}`} className="px-1.5 text-mist-500">
                …
              </span>
            ) : (
              <PageButton key={n} active={n === page} disabled={loading} onClick={() => setPage(n)}>
                {n}
              </PageButton>
            ),
          )}
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

/** 1 … 4 5 [6] 7 8 … 20 хэлбэрийн хуудасны дугаарууд; null = "…" */
function pageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push(null);
    out.push(sorted[i]);
  }
  return out;
}

function PageButton({
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        active
          ? 'border-brand/50 bg-brand/15 text-brand'
          : 'border-ink-600 bg-ink-800 text-mist-200 hover:border-brand/40 hover:text-mist-50',
        className,
      )}
      {...props}
    />
  );
}

function FilterSelect<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={cn(
        'rounded-xl border bg-ink-800 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40',
        value === 'all' ? 'border-ink-500 text-mist-300' : 'border-brand/50 text-brand',
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
