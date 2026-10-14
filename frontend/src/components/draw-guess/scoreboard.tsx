// frontend/src/components/draw-guess/scoreboard.tsx
// Тоглогчдын оноо: зурж буй хүн, зөв таасан тэмдэг, холболт.
'use client';

import { Check, Crown, Pencil } from 'lucide-react';
import type { RoomPlayerState } from '@/lib/draw-guess-socket';

interface Props {
  players: RoomPlayerState[];
  drawerUserId: string | null;
  userId: string;
  /** Ээлжийн оноог (+N) харуулах эсэх. */
  showTurnPoints: boolean;
}

/** Утсан дээрх хураангуй хувилбар — хэвтээ гүйлгэдэг chip-үүд. */
export function PlayersStrip({ players, drawerUserId, userId }: Omit<Props, 'showTurnPoints'>) {
  const sorted = [...players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return (
    <div className="ce-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
      {sorted.map((p) => {
        const mine = p.userId === userId;
        const drawing = p.userId === drawerUserId;
        const guessed = p.guessedAt != null;
        return (
          <div
            key={p.userId}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-xs ${
              guessed
                ? 'border-success/40 bg-success/10'
                : drawing
                  ? 'border-brand/50 bg-brand/10'
                  : mine
                    ? 'border-ink-500 bg-ink-800'
                    : 'border-ink-600/80 bg-ink-900'
            } ${!p.connected ? 'opacity-50' : ''}`}
          >
            {drawing ? (
              <Pencil className="h-3 w-3 text-brand" />
            ) : guessed ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink-700 text-[10px] font-semibold text-mist-200">
                {p.name.slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className={`max-w-[72px] truncate ${mine ? 'text-brand' : 'text-mist-200'}`}>{mine ? 'Та' : p.name}</span>
            <span className="font-mono font-semibold text-mist-50">{p.score}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Scoreboard({ players, drawerUserId, userId, showTurnPoints }: Props) {
  const sorted = [...players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return (
    <div className="rounded-2xl border border-ink-600/80 bg-ink-900 shadow-card">
      <div className="border-b border-ink-600/80 px-4 py-2.5">
        <p className="text-xs font-medium uppercase tracking-wider text-mist-500">Оноо</p>
      </div>
      <ul className="divide-y divide-ink-600/60">
        {sorted.map((p, i) => {
          const mine = p.userId === userId;
          const drawing = p.userId === drawerUserId;
          const guessed = p.guessedAt != null;
          return (
            <li
              key={p.userId}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm ${
                guessed ? 'bg-success/10' : drawing ? 'bg-brand/10' : ''
              } ${!p.connected ? 'opacity-50' : ''}`}
            >
              <span className="w-5 shrink-0 text-center font-mono text-xs text-mist-500">{i + 1}</span>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                  mine ? 'bg-brand/25 text-brand' : 'bg-ink-700 text-mist-200'
                }`}
              >
                {p.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-mist-100">
                  {p.name}
                  {mine && <span className="text-mist-500"> (та)</span>}
                </p>
                <p className="flex items-center gap-1 text-[11px] text-mist-500">
                  {p.isHost && <Crown className="h-3 w-3 text-modifier" />}
                  {drawing && (
                    <span className="inline-flex items-center gap-0.5 text-brand">
                      <Pencil className="h-3 w-3" /> зурж байна
                    </span>
                  )}
                  {!p.connected && <span>салсан</span>}
                </p>
              </div>
              {guessed && <Check className="h-4 w-4 shrink-0 text-success" />}
              <div className="shrink-0 text-right">
                <p className="font-mono text-sm font-semibold text-mist-50">{p.score}</p>
                {showTurnPoints && p.turnPoints > 0 && <p className="font-mono text-[11px] text-success">+{p.turnPoints}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
