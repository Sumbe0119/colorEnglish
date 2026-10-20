// frontend/src/app/leaderboard/page.tsx
// Бүх тоглоомын leaderboard — нийт (шилдэг онооны нийлбэр) болон тоглоом тус бүрээр
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { LeaderboardPanel } from '@/components/games/leaderboard';
import { GAME_LABELS, type GameKind, type LeaderboardScope } from '@/lib/games-services';

const TABS: { scope: LeaderboardScope; label: string }[] = [
  { scope: 'ALL', label: 'Нийт' },
  ...(Object.keys(GAME_LABELS) as GameKind[]).map((g) => ({ scope: g as LeaderboardScope, label: GAME_LABELS[g].title })),
];

export default function LeaderboardPage() {
  const [scope, setScope] = useState<LeaderboardScope>('ALL');
  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-modifier/15 text-modifier">
          <Trophy className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-mist-50">Leaderboard</h1>
          <p className="mt-1 text-sm text-mist-400">
            Тоглоом бүрийн шилдэг оноогоор эрэмбэлнэ. «Нийт» — гурван тоглоомын шилдэг онооны нийлбэр. Өгүүлбэр бүтээх, зураг таах —
            оноо; бичих уралдаан — WPM.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Тоглоом">
        {TABS.map((t) => (
          <button
            key={t.scope}
            type="button"
            role="tab"
            aria-selected={scope === t.scope}
            onClick={() => setScope(t.scope)}
            className={`rounded-xl border px-3.5 py-1.5 text-sm transition-colors ${
              scope === t.scope ? 'border-brand/60 bg-brand/15 text-brand' : 'border-ink-600/80 bg-ink-900 text-mist-300 hover:border-ink-500 hover:text-mist-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <LeaderboardPanel key={scope} scope={scope} limit={50} showLink={false} className="mt-4" />

      {scope !== 'ALL' && (
        <Link href={GAME_LABELS[scope].href} className="mt-4 inline-block text-sm text-brand hover:underline">
          {GAME_LABELS[scope].title} тоглох →
        </Link>
      )}
    </div>
  );
}
