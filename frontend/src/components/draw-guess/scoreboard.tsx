// frontend/src/components/draw-guess/scoreboard.tsx
// Тоглогчдын жагсаалт: lobby-ийн chip-үүд (робот өнгөтэй) ба дууссан дэлгэцийн эрэмбэлсэн оноо.
// Тоглоомын явцад оноо нь canvas дүрслэл дээр роботуудын дээр зурагдана (studio-scene.tsx).
'use client';

import { Crown, Pencil, WifiOff } from 'lucide-react';
import type { RoomPlayerState } from '@/lib/draw-guess-socket';
import { PLAYER_COLORS } from './studio-scene';

/** Тоглогчийн робот өнгө — өрөөнд орсон дараалал (room.players индекс) */
export function playerColor(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

/** Lobby — тоглогч бүр өөрийн өнгөтэй chip */
export function PlayerChips({ players, userId }: { players: RoomPlayerState[]; userId: string }) {
  return (
    <ul className="flex flex-wrap justify-center gap-2">
      {players.map((p, i) => {
        const mine = p.userId === userId;
        const color = playerColor(i);
        return (
          <li
            key={p.userId}
            className={`inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-sm ${
              mine ? 'border-mist-50/60 bg-ink-800' : 'border-ink-600/80 bg-ink-800/60'
            } ${!p.connected ? 'opacity-50' : ''}`}
            style={{ boxShadow: `inset 3px 0 0 ${color}` }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold text-ink-950" style={{ background: color }}>
              {p.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="max-w-[120px] truncate text-mist-50">
              {p.name}
              {mine && <span className="text-mist-500"> (та)</span>}
            </span>
            {p.isHost && <Crown className="h-3.5 w-3.5 text-modifier" aria-label="эзэн" />}
            {!p.connected && <WifiOff className="h-3.5 w-3.5 text-mist-500" aria-label="салсан" />}
          </li>
        );
      })}
    </ul>
  );
}

interface ScoreboardProps {
  players: RoomPlayerState[];
  drawerUserId: string | null;
  userId: string;
  /** Ээлжийн оноог (+N) харуулах эсэх. */
  showTurnPoints: boolean;
}

/** Эрэмбэлсэн оноо — дууссан дэлгэц / оноо самбар */
export function Scoreboard({ players, drawerUserId, userId, showTurnPoints }: ScoreboardProps) {
  const sorted = players
    .map((p, i) => ({ p, color: playerColor(i) }))
    .sort((a, b) => b.p.score - a.p.score || a.p.name.localeCompare(b.p.name));
  const rankTone = ['text-modifier', 'text-mist-200', 'text-[#c97c4f]'];
  return (
    <ol className="divide-y divide-ink-600/60 overflow-hidden rounded-xl border border-ink-600/80">
      {sorted.map(({ p, color }, i) => {
        const mine = p.userId === userId;
        return (
          <li
            key={p.userId}
            className={`flex items-center gap-2.5 px-3 py-2 text-sm ${mine ? 'bg-brand/10' : 'bg-ink-800/40'} ${!p.connected ? 'opacity-50' : ''}`}
          >
            <span className={`w-5 shrink-0 text-center font-mono text-xs font-bold ${rankTone[i] ?? 'text-mist-500'}`}>{i + 1}</span>
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-ink-950"
              style={{ background: color }}
            >
              {p.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 truncate text-mist-100">
              {p.name}
              {mine && <span className="text-mist-500"> (та)</span>}
              {p.isHost && <Crown className="ml-1 inline h-3 w-3 text-modifier" />}
              {p.userId === drawerUserId && <Pencil className="ml-1 inline h-3 w-3 text-brand" />}
              {!p.connected && <span className="text-mist-500"> · салсан</span>}
            </span>
            {showTurnPoints && p.turnPoints > 0 && <span className="font-mono text-[11px] text-success">+{p.turnPoints}</span>}
            <span className="font-mono text-sm font-semibold text-mist-50">{p.score}</span>
          </li>
        );
      })}
    </ol>
  );
}
