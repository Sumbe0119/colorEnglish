// frontend/src/components/type-rush/results-panel.tsx
// Уралдааны үр дүн — давхарга (Overlay) дотор харагдана: хугацаа, байр, WPM / нарийвчлал / тэмдэгт,
// бүх уралдагчийн жагсаалт, товчнууд.
'use client';

import type { ReactNode } from 'react';
import { Flag, TimerOff, Trophy, Zap } from 'lucide-react';
import { RACE_CARS } from '@/lib/type-rush';
import { Stat } from './game-ui';

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
  /** Уралдаан дууссан ч бариа хүрээгүй (цаг дууссан) — 'явж байна' гэж харуулахгүй. */
  failed?: boolean;
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

function rankTone(rank: number) {
  return rank === 1 ? 'text-modifier' : rank === 2 ? 'text-mist-100' : rank === 3 ? 'text-verb' : 'text-mist-300';
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
  timedOut,
  totalChars,
  playerName,
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
  /** Цаг дуусаад өгүүлбэр дуусгаж чадаагүй. */
  timedOut?: boolean;
  /** Өгүүлбэрийн бүтэн урт — timedOut үед хэр явсныг харуулахад. */
  totalChars?: number;
  playerName?: string;
}) {
  const rows = sortStandings(standings);
  const donePct = timedOut && totalChars ? Math.round((chars / totalChars) * 100) : 100;
  return (
    <div>
      <div className="flex items-center justify-center gap-3">
        {timedOut ? <TimerOff className="h-7 w-7 text-danger" /> : <Trophy className={`h-7 w-7 ${rankTone(rank)}`} />}
        <h2 className={`font-display text-2xl font-bold tracking-[0.12em] sm:text-3xl ${timedOut ? 'text-danger' : rankTone(rank)}`}>
          {timedOut ? 'ЦАГ ДУУСЛАА' : `${rank}-Р БАЙР`}
        </h2>
      </div>
      <p className="mt-2 text-center text-sm text-mist-300">
        {timedOut
          ? `Өгүүлбэрийн ${donePct}%-ийг бичсэн. Дараагийн удаа цагаа нэмэх эсвэл хурдаа ахиулаарай.`
          : rank === 1
            ? `Баяр хүргэе${playerName ? `, ${playerName}` : ''}! Та бүгдээс түрүүлж бариа хүрлээ.`
            : `${formatSeconds(finishMs)} секундэд бариа хүрлээ.`}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
        <Stat label={timedOut ? 'Хугацаа' : 'Секунд'} value={formatSeconds(finishMs)} tone={timedOut ? 'text-danger' : 'text-mist-50'} />
        <Stat label="WPM" value={String(wpm)} tone="text-brand" />
        <Stat label="Нарийвчлал" value={`${accuracy}%`} tone={accuracy >= 95 ? 'text-success' : accuracy >= 85 ? 'text-modifier' : 'text-danger'} />
        <Stat label="Тэмдэгт" value={timedOut && totalChars ? `${chars}/${totalChars}` : String(chars)} />
      </div>
      {isNewBest && !timedOut && (
        <p className="tr-pop mt-3 inline-flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-modifier">
          <Zap className="h-3.5 w-3.5" /> Шинэ рекорд!
        </p>
      )}

      <div className="ce-scroll mt-4 max-h-44 overflow-y-auto rounded-xl border border-ink-600/80">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-ink-800 text-left text-[10px] uppercase tracking-wider text-mist-500">
            <tr>
              <th className="px-2 py-1.5">#</th>
              <th className="px-2 py-1.5">Уралдагч</th>
              <th className="px-2 py-1.5 text-right">Сек</th>
              <th className="px-2 py-1.5 text-right">WPM</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={`${row.lane}-${row.name}`} className={`border-t border-ink-600/60 ${row.isPlayer ? 'bg-brand/10' : ''}`}>
                <td className={`px-2 py-1.5 font-mono ${row.time == null ? 'text-mist-500' : rankTone(i + 1)}`}>{row.time == null ? '—' : i + 1}</td>
                <td className="px-2 py-1.5">
                  <span className="inline-flex flex-wrap items-center gap-1.5">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: RACE_CARS[row.lane]?.color ?? '#999' }} />
                    <span className={row.isPlayer ? 'font-semibold text-mist-50' : 'text-mist-200'}>{row.name}</span>
                    {row.isPlayer && <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] text-white">ТА</span>}
                    {!row.isPlayer && row.tag && <span className="rounded bg-ink-700 px-1.5 py-0.5 text-[10px] text-mist-300">{row.tag}</span>}
                    {row.note && <span className="text-[11px] text-mist-500">{row.note}</span>}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-right font-mono text-mist-100">
                  {row.time == null ? (
                    row.failed ? (
                      <span className="text-mist-500">дуусгаагүй</span>
                    ) : (
                      <span className="tr-blink inline-flex items-center gap-1 text-mist-400">
                        <Flag className="h-3 w-3" /> явж байна
                      </span>
                    )
                  ) : (
                    formatSeconds(row.time)
                  )}
                </td>
                <td className="px-2 py-1.5 text-right font-mono text-mist-300">{row.wpm ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footnote && <div className="mt-3 text-center text-xs text-mist-400">{footnote}</div>}

      <div className="mt-4 flex flex-wrap justify-center gap-2">{actions}</div>
    </div>
  );
}
