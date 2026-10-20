// frontend/src/components/games/leaderboard.tsx
// Тоглоомын leaderboard самбар — тоглоом тус бүрийн (эсвэл бүх тоглоомын нийлбэр) шилдэг оноогоор эрэмбэлсэн
// хэрэглэгчид. Тоглоомын эхлэх/дуусах дэлгэц дээр (compact) болон /leaderboard хуудсанд (бүтэн) ашиглана.
'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, Loader2, RefreshCw, Trophy } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { getApiErrorMessage } from '@/lib/api-error';
import { fetchLeaderboard, GAME_LABELS, type GameKind, type LeaderboardResult, type LeaderboardScope } from '@/lib/games-services';

const MEDALS = ['🥇', '🥈', '🥉'];
const AVATAR_COLORS = ['#4F8CFF', '#FF9A6B', '#3DDC97', '#FFD166', '#C58CFF', '#FF6B7A', '#6EA8FF'];

function avatarColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function useLeaderboard(scope: LeaderboardScope, limit: number, refreshKey = 0) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [data, setData] = useState<LeaderboardResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      setData(await fetchLeaderboard(scope, limit));
      setStatus('ready');
    } catch (e) {
      setError(getApiErrorMessage(e, 'Leaderboard ачаалж чадсангүй'));
      setStatus('error');
    }
  }, [scope, limit]);
  useEffect(() => {
    void load();
  }, [load, refreshKey]);
  return { status, data, error, reload: load };
}

export function Avatar({ name, userId, url, size = 32 }: { name: string; userId: string; url: string | null; size?: number }) {
  const initial = (name.trim().charAt(0) || '?').toUpperCase();
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold text-ink-950"
      style={{ width: size, height: size, background: avatarColor(userId), fontSize: size * 0.45 }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export function LeaderboardPanel({
  scope = 'ALL',
  limit = 10,
  compact = false,
  title,
  refreshKey = 0,
  showLink = true,
  className = '',
}: {
  scope?: LeaderboardScope;
  limit?: number;
  /** Жижиг хувилбар — тоглоомын overlay дотор */
  compact?: boolean;
  title?: string;
  /** Өөрчлөгдөхөд дахин ачаална (оноо илгээсний дараа) */
  refreshKey?: number;
  showLink?: boolean;
  className?: string;
}) {
  const userId = useAuthStore((s) => s.user?.id ?? '');
  const { status, data, error, reload } = useLeaderboard(scope, limit, refreshKey);
  const unit = scope === 'ALL' ? 'оноо' : GAME_LABELS[scope].unit;
  const heading = title ?? (scope === 'ALL' ? 'Нийт leaderboard' : `${GAME_LABELS[scope].title} — шилдгүүд`);
  const inList = data?.entries.some((e) => e.userId === userId) ?? false;

  return (
    <section className={`rounded-2xl border border-ink-600/80 bg-ink-900/90 ${compact ? 'p-3' : 'p-4 sm:p-5'} ${className}`} aria-label={heading}>
      <header className="flex items-center gap-2">
        <Trophy className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-modifier`} />
        <h3 className={`font-display font-semibold text-mist-50 ${compact ? 'text-sm' : 'text-base'}`}>{heading}</h3>
        {data && <span className="text-[11px] text-mist-500">· {data.total} тоглогч</span>}
        <button
          type="button"
          onClick={() => void reload()}
          className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-lg text-mist-500 transition-colors hover:bg-ink-800 hover:text-mist-50"
          aria-label="Шинэчлэх"
          title="Шинэчлэх"
        >
          {status === 'loading' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
        </button>
      </header>

      {status === 'error' && (
        <p className="mt-3 text-xs text-danger">
          {error}{' '}
          <button type="button" onClick={() => void reload()} className="underline">
            дахин оролдох
          </button>
        </p>
      )}
      {status === 'loading' && !data && <p className="mt-3 text-xs text-mist-500">Ачаалж байна...</p>}
      {data && data.entries.length === 0 && <p className="mt-3 text-xs text-mist-500">Оноо бүртгэгдээгүй байна — анхны тоглогч нь та болоорой!</p>}

      {data && data.entries.length > 0 && (
        <ol className={`mt-2 ${compact ? 'space-y-0.5' : 'space-y-1'}`}>
          {data.entries.map((e) => {
            const me = e.userId === userId;
            return (
              <li
                key={e.userId}
                className={`flex items-center gap-2.5 rounded-xl px-2 ${compact ? 'py-1' : 'py-1.5'} ${
                  me ? 'bg-brand/15 ring-1 ring-brand/40' : e.rank <= 3 ? 'bg-ink-800/60' : ''
                }`}
              >
                <span className={`w-7 shrink-0 text-center font-mono ${e.rank <= 3 ? 'text-base' : 'text-xs text-mist-500'}`}>
                  {e.rank <= 3 ? MEDALS[e.rank - 1] : e.rank}
                </span>
                <Avatar name={e.name} userId={e.userId} url={e.avatarUrl} size={compact ? 26 : 32} />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate ${compact ? 'text-xs' : 'text-sm'} ${me ? 'font-semibold text-brand' : 'text-mist-100'}`}>
                    {e.name}
                    {me && <span className="ml-1 text-[10px] text-mist-400">(та)</span>}
                    {e.rank === 1 && <Crown className="ml-1 inline h-3.5 w-3.5 text-modifier" />}
                  </span>
                  {!compact && scope === 'ALL' && e.perGame && (
                    <span className="mt-0.5 flex flex-wrap gap-1">
                      {(Object.keys(e.perGame) as GameKind[]).map((g) => (
                        <span key={g} className="rounded-md bg-ink-800 px-1.5 py-0.5 text-[10px] text-mist-400">
                          {GAME_LABELS[g].short}: <span className="font-mono text-mist-200">{e.perGame?.[g]}</span>
                        </span>
                      ))}
                    </span>
                  )}
                  {!compact && scope !== 'ALL' && <span className="block text-[10px] text-mist-500">{e.plays} тоглолт</span>}
                </span>
                <span className={`shrink-0 font-mono font-semibold ${compact ? 'text-xs' : 'text-sm'} ${me ? 'text-brand' : 'text-modifier'}`}>
                  {e.score} <span className="text-[10px] font-normal text-mist-500">{unit}</span>
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {data?.me && !inList && (
        <p className="mt-2 rounded-xl border border-dashed border-brand/40 bg-brand/10 px-3 py-1.5 text-xs text-mist-200">
          Таны байр: <span className="font-mono font-semibold text-brand">#{data.me.rank}</span> · {data.me.score} {unit}
        </p>
      )}
      {data && !data.me && userId && <p className="mt-2 text-[11px] text-mist-500">Та энэ тоглоомд оноо аваагүй байна.</p>}

      {showLink && (
        <Link href="/leaderboard" className="mt-2 inline-block text-[11px] text-mist-400 underline-offset-2 hover:text-brand hover:underline">
          Бүх leaderboard →
        </Link>
      )}
    </section>
  );
}
