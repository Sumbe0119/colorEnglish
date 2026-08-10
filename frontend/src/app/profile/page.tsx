'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Mail,
  RotateCcw,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react';

import { formatLevelCode } from '@/types/api';
import { getProfile, type StudentProfile } from '@/lib/services';
import { getSubscriptionMe, type SubscriptionMe } from '@/lib/billing-services';
import {
  formatGoalInterest,
  formatSelfAssessedLevel,
  GOAL_LABELS,
  type GoalInterest,
} from '@/lib/onboarding-labels';

function formatDate(iso: string | null) {
  if (!iso) return null;

  try {
    return new Intl.DateTimeFormat('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-8 pb-10">
      <div className="space-y-3">
        <div className="h-8 w-36 rounded-lg bg-ink-700/70" />
        <div className="h-4 w-72 max-w-full rounded bg-ink-800" />
      </div>

      <div className="rounded-3xl border border-ink-700/60 bg-ink-900/70 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="h-24 w-24 rounded-3xl bg-ink-700/70" />

          <div className="flex-1 space-y-3">
            <div className="h-7 w-48 rounded-lg bg-ink-700/70" />
            <div className="h-4 w-64 max-w-full rounded bg-ink-800" />
            <div className="h-7 w-28 rounded-full bg-ink-800" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-48 rounded-2xl bg-ink-900/70 md:col-span-2" />
        <div className="h-36 rounded-2xl bg-ink-900/70" />
        <div className="h-36 rounded-2xl bg-ink-900/70" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [data, sub] = await Promise.all([
          getProfile(),
          getSubscriptionMe().catch(() => null),
        ]);

        if (!cancelled) {
          setProfile(data);
          setSubscription(sub);
        }
      } catch {
        if (!cancelled) {
          setError('Профайл ачаалж чадсангүй');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-xl py-16">
        <div className="ce-panel flex flex-col items-center rounded-3xl px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>

          <h1 className="mt-5 font-display text-xl font-semibold text-mist-50">
            Профайл ачаалахад алдаа гарлаа
          </h1>

          <p className="mt-2 max-w-sm text-sm leading-6 text-mist-400">
            {error ?? 'Хэрэглэгчийн профайл олдсонгүй.'}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-hover"
          >
            <RotateCcw className="h-4 w-4" />
            Дахин оролдох
          </button>
        </div>
      </div>
    );
  }

  const displayName =
    [profile.user.firstName, profile.user.lastName]
      .filter(Boolean)
      .join(' ')
      .trim() || 'Хэрэглэгч';

  const initial = (
    profile.user.firstName?.trim()?.[0] ??
    profile.user.email?.[0] ??
    '?'
  ).toUpperCase();

  const completedAt = formatDate(profile.onboardingCompletedAt);

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      {/* Page heading */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-brand">
            <UserRound className="h-3.5 w-3.5" />
            Хувийн мэдээлэл
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-mist-50">
            Миний профайл
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-mist-400">
            Бүртгэлийн мэдээлэл, сурах зорилго болон хичээлийн тохиргоогоо
            нэг дороос харна.
          </p>
        </div>
      </header>

      {/* Profile hero */}
      <section className="relative overflow-hidden rounded-3xl border border-ink-700/70 bg-ink-900 shadow-2xl shadow-black/10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/15 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Profile */}
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="relative shrink-0">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-brand/30 bg-brand/15 font-display text-xl font-semibold text-brand shadow-md shadow-brand/10 sm:h-20 sm:w-20 sm:text-2xl">
                  {profile.user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.user.avatarUrl}
                      alt={`${displayName}-ийн профайл зураг`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>

                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink-900 bg-emerald-500 sm:h-6 sm:w-6">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h2 className="max-w-full truncate font-display text-lg font-semibold text-mist-50 sm:text-xl">
                    {displayName}
                  </h2>

                  <span className="inline-flex shrink-0 items-center rounded-full border border-brand/25 bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                    {formatLevelCode(profile.currentLevel)}
                  </span>
                </div>

                <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-xs text-mist-400 sm:text-sm">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{profile.user.email}</span>
                </div>

                <div className="mt-2">
                  {subscription?.isPro ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand">
                        <Sparkles className="h-3 w-3" />
                        VIP эрхтэй
                      </div>

                      {subscription.expiresAt && (
                        <span className="text-[11px] text-mist-400">
                          {formatDate(subscription.expiresAt)}
                          {subscription.daysLeft != null && (
                            <span className="text-brand">
                              {' '}
                              · {subscription.daysLeft} хоног
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/billing"
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-200 transition hover:bg-amber-500/20"
                    >
                      <AlertCircle className="h-3 w-3" />
                      VIP эрхгүй · Багц авах
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 lg:min-w-[360px]">
              <div className="min-w-0 rounded-xl border border-ink-700/70 bg-ink-950/30 px-3 py-2.5">
                <p className="truncate text-[10px] text-mist-500">
                  Түвшин
                </p>
                <p className="mt-1 truncate font-display text-base font-semibold text-mist-50">
                  {formatLevelCode(profile.currentLevel)}
                </p>
              </div>

              <div className="min-w-0 rounded-xl border border-ink-700/70 bg-ink-950/30 px-3 py-2.5">
                <p className="truncate text-[10px] text-mist-500">
                  Өдрийн зорилго
                </p>
                <p className="mt-1 font-display text-base font-semibold text-mist-50">
                  {profile.dailyGoalMinutes}
                  <span className="ml-1 text-xs font-normal text-mist-400">
                    мин
                  </span>
                </p>
              </div>

              <div className="min-w-0 rounded-xl border border-ink-700/70 bg-ink-950/30 px-3 py-2.5">
                <p className="truncate text-[10px] text-mist-500">
                  Зорилго
                </p>
                <p className="mt-1 font-display text-base font-semibold text-mist-50">
                  {profile.interests.length}
                  <span className="ml-1 text-xs font-normal text-mist-400">
                    сонголт
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding */}
      <section className="space-y-3">
  {/* Header */}
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <h2 className="font-display text-lg font-semibold text-mist-50">
        Суралцах тохиргоо
      </h2>

      <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-mist-400">
        {completedAt && profile.onboardingCompleted && (
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
        )}

        <span className="truncate">
          {profile.onboardingCompleted
            ? completedAt
              ? `${completedAt}-нд бөглөсөн`
              : 'Onboarding судалгаа бөглөсөн'
            : 'Судалгааг бөглөснөөр хичээл танд илүү тохирно'}
        </span>
      </div>
    </div>

    {!profile.onboardingCompleted && (
      <Link
        href="/onboarding"
        className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-lg bg-brand px-3 py-2 text-xs font-medium text-white transition hover:bg-brand-hover sm:self-auto"
      >
        Судалгаа бөглөх
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    )}
  </div>

  {!profile.onboardingCompleted ? (
    /* Onboarding empty state */
    <div className="relative overflow-hidden rounded-2xl border border-brand/20 bg-brand/5 p-4">
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15">
          <Sparkles className="h-5 w-5 text-brand" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-sm font-semibold text-mist-50">
            Хичээлээ өөртөө тохируулаарай
          </h3>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-mist-400">
            Зорилго, түвшин болон өдөр бүр хичээллэх хугацаагаа сонгож,
            тохирсон хөтөлбөр аваарай.
          </p>
        </div>

        <Link
          href="/onboarding"
          className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg border border-brand/30 bg-brand/10 px-3 py-2 text-xs font-medium text-brand transition hover:bg-brand/20"
        >
          Эхлэх
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  ) : (
    <div className="grid gap-3 lg:grid-cols-12">
      {/* Goals */}
      <article className="ce-panel rounded-2xl p-4 lg:col-span-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10">
              <Target className="h-4 w-4 text-brand" />
            </div>

            <div className="min-w-0">
              <h3 className="font-display text-sm font-semibold text-mist-50">
                Сурах зорилго
              </h3>

              <p className="truncate text-[11px] text-mist-500">
                Англи хэлийг сурах үндсэн зорилго
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-ink-800 px-2 py-0.5 text-[11px] text-mist-400">
            {profile.interests.length}
          </span>
        </div>

        <div className="mt-3">
          {profile.interests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink-600 px-3 py-4 text-center">
              <p className="text-xs text-mist-400">
                Сурах зорилго сонгоогүй байна.
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {profile.interests.map((id) => {
                const meta = GOAL_LABELS[id as GoalInterest];

                return (
                  <div
                    key={id}
                    className="rounded-xl border border-ink-700/70 bg-ink-900/50 p-3 transition hover:border-brand/30 hover:bg-brand/5"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-mist-100">
                          {formatGoalInterest(id)}
                        </p>

                        {meta?.desc && (
                          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-mist-500">
                            {meta.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </article>

      {/* Level and daily goal */}
      <div className="grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
        <article className="ce-panel rounded-2xl p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
              <GraduationCap className="h-4 w-4 text-violet-300" />
            </div>

            <div className="min-w-0">
              <h3 className="font-display text-sm font-semibold text-mist-50">
                Өөрийн үнэлгээ
              </h3>

              <p className="text-[11px] text-mist-500">
                Анх сонгосон түвшин
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-lg font-semibold text-mist-50">
              {formatSelfAssessedLevel(profile.selfAssessedLevel)}
            </p>

            {profile.placementLevel && (
              <div className="flex items-center gap-2 rounded-lg bg-ink-900/60 px-2.5 py-1.5">
                <span className="text-[10px] text-mist-400">
                  Шалгалт
                </span>

                <span className="rounded-md bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                  {formatLevelCode(profile.placementLevel)}
                </span>
              </div>
            )}
          </div>
        </article>

        <article className="ce-panel rounded-2xl p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10">
              <Clock className="h-4 w-4 text-sky-300" />
            </div>

            <div>
              <h3 className="font-display text-sm font-semibold text-mist-50">
                Өдрийн зорилго
              </h3>

              <p className="text-[11px] text-mist-500">
                Өдөр бүр хичээллэх хугацаа
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="flex items-end gap-1.5">
              <span className="font-display text-2xl font-semibold tracking-tight text-mist-50">
                {profile.dailyGoalMinutes}
              </span>

              <span className="pb-0.5 text-xs text-mist-400">
                минут
              </span>
            </div>

            <span className="text-[10px] text-mist-500">
              / 60 минут
            </span>
          </div>

          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ink-800">
            <div
              className="h-full rounded-full bg-brand transition-all"
              style={{
                width: `${Math.min(
                  Math.max((profile.dailyGoalMinutes / 60) * 100, 8),
                  100,
                )}%`,
              }}
            />
          </div>
        </article>
      </div>

      {/* Motivation */}
      {profile.motivationNote && (
        <article className="relative overflow-hidden rounded-2xl border border-brand/15 bg-gradient-to-br from-brand/10 to-ink-900 p-4 lg:col-span-12">
          <Sparkles className="absolute -right-2 -top-2 h-16 w-16 text-brand/5" />

          <div className="relative flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/15">
              <Sparkles className="h-4 w-4 text-brand" />
            </div>

            <div className="min-w-0">
              <h3 className="font-display text-sm font-semibold text-mist-50">
                Миний зорилго
              </h3>

              <p className="mt-1.5 line-clamp-3 whitespace-pre-wrap text-xs leading-5 text-mist-300">
                {profile.motivationNote}
              </p>
            </div>
          </div>
        </article>
      )}
    </div>
  )}
</section>
    </div>
  );
}