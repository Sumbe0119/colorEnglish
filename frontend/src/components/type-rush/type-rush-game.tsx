// frontend/src/components/type-rush/type-rush-game.tsx
// Type Rush root: горим сонгох (ганцаараа ботуудтай / онлайн найзуудтай).
'use client';

import { useState } from 'react';
import { Bot, Users } from 'lucide-react';
import { TYPE_RUSH_STYLES } from './race-track';
import { SoloRace } from './solo-race';
import { OnlineRace } from './online-race';

type Mode = 'solo' | 'online';

export function TypeRushGame({ playerName, userId }: { playerName: string; userId: string }) {
  const [mode, setMode] = useState<Mode>('solo');

  return (
    <div className="space-y-5">
      <style dangerouslySetInnerHTML={{ __html: TYPE_RUSH_STYLES }} />

      <div className="inline-flex rounded-xl border border-ink-600/80 bg-ink-900 p-1">
        <button
          type="button"
          onClick={() => setMode('solo')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${
            mode === 'solo' ? 'bg-brand text-white' : 'text-mist-300 hover:text-mist-50'
          }`}
        >
          <Bot className="h-4 w-4" /> Ганцаараа
        </button>
        <button
          type="button"
          onClick={() => setMode('online')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${
            mode === 'online' ? 'bg-brand text-white' : 'text-mist-300 hover:text-mist-50'
          }`}
        >
          <Users className="h-4 w-4" /> Онлайн найзуудтай
        </button>
      </div>

      {mode === 'solo' ? <SoloRace playerName={playerName} /> : <OnlineRace playerName={playerName} userId={userId} />}
    </div>
  );
}
