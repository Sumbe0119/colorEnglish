// frontend/src/components/type-rush/results-panel.tsx
'use client';

import type { ReactNode } from 'react';
import { Trophy, Zap } from 'lucide-react';
import { RACE_CARS } from '@/lib/type-rush';

export type StandingRow = {
  lane: number;
  name: string;
  isPlayer: boolean;
  /** null = одоогоор бариа хүрээгүй */
  time: number | null;
  wpm: number | null;
  /** 'БОТ' | 'ТОГЛОГЧ' гэх мэт */
  tag?: string;
  note?: string;
};

export function formatSeconds(ms: number): string {
  return (ms / 1000).toFixed(2);
}

export function sortStandings(rows: StandingRow[]): StandingRow[] {
  return [...rows].sort((a, b) => {
    if (a.time == null && b.time == null) return a.lane - b.lane;
    if (a.time == null) return 1;
    if (b.time == null) return -1;
    return a.time - b.time;
  });
}

export function ResultsPanel({
  finishMs,
  rank,
  wpm,
  accuracy,
  chars,
  isNewBest,
  standings,
  actions,
  footnote,
}: {
  finishMs: number;
  rank: number;
  wpm: number;
  accuracy: number;
  chars: number;
  isNewBest?: boolean;
  standings: StandingRow[];
  actions: ReactNode;
  footnote?: ReactNode;
}) {
  const rows = sortStandings(standings);
  return (
    <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-mist-500">Зарцуулсан хугацаа</p>
          <p className="mt-1 font-display text-5xl font-bold text-mist-50">
            {formatSeconds(finishMs)}
            <span className="ml-2 text-xl font-medium text-mist-400">сек</span>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                rank === 1
                  ? 'bg-modifier/20 text-modifier'
                  : rank === 2
                    ? 'bg-mist-200/20 text-mist-100'
                    : rank === 3
                      ? 'bg-verb/20 text-verb'
                      : 'bg-ink-700 text-mist-300'
              }`}
            >
              <Trophy className="h-4 w-4" />
              {rank}-р байр
            </span>
            {isNewBest && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/20 px-3 py-1 text-sm font-semibold text-success">
                <Zap className="h-4 w-4" /> Шинэ рекорд!
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-ink-600/80 bg-ink-800/60 px-3 py-3">
            <p className="font-mono text-2xl font-semibold text-mist-50">{wpm}</p>
            <p className="text-[11px] uppercase tracking-wider text-mist-500">WPM</p>
          </div>
          <div className="rounded-xl border border-ink-600/80 bg-ink-800/60 px-3 py-3">
            <p className="font-mono text-2xl font-semibold text-mist-50">{accuracy}%</p>
            <p className="text-[11px] uppercase tracking-wider text-mist-500">Нарийвчлал</p>
          </div>
          <div className="rounded-xl border border-ink-600/80 bg-ink-800/60 px-3 py-3">
            <p className="font-mono text-2xl font-semibold text-mist-50">{chars}</p>
            <p className="text-[11px] uppercase tracking-wider text-mist-500">Тэмдэгт</p>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-ink-600/80">
        <table className="w-full text-sm">
          <thead className="bg-ink-800/80 text-left text-[11px] uppercase tracking-wider text-mist-500">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Уралдагч</th>
              <th className="px-3 py-2 text-right">Хугацаа</th>
              <th className="px-3 py-2 text-right">WPM</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={`${row.lane}-${row.name}`} className={`border-t border-ink-600/60 ${row.isPlayer ? 'bg-brand/10' : ''}`}>
                <td className="px-3 py-2 font-mono text-mist-300">{row.time == null ? '—' : i + 1}</td>
                <td className="px-3 py-2">
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: RACE_CARS[row.lane]?.color ?? '#999' }} />
                    <span className={row.isPlayer ? 'font-semibold text-mist-50' : 'text-mist-200'}>{row.name}</span>
                    {row.isPlayer && <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] text-white">ТА</span>}
                    {!row.isPlayer && row.tag && (
                      <span className="rounded bg-ink-700 px-1.5 py-0.5 text-[10px] text-mist-300">{row.tag}</span>
                    )}
                    {row.note && <span className="text-[11px] text-mist-500">{row.note}</span>}
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-mono text-mist-100">
                  {row.time == null ? 'явж байна…' : `${formatSeconds(row.time)} сек`}
                </td>
                <td className="px-3 py-2 text-right font-mono text-mist-300">{row.wpm ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footnote && <div className="mt-3 text-xs text-mist-400">{footnote}</div>}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">{actions}</div>
    </div>
  );
}
