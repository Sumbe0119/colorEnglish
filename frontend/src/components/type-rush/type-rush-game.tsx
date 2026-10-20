// frontend/src/components/type-rush/type-rush-game.tsx
// "Бичих уралдаан" — бүтэн хуудас 2D тоглоом. Canvas дүрслэл (RaceScene) дэлгэцийг дүүргэж,
// доор нь бичих консол, дээр нь сонголт / lobby / үр дүнгийн давхарга.
// Горим (ганцаараа ботуудтай / онлайн найзуудтай) давхарга дотроос солигдоно.
'use client';

import { useCallback, useState } from 'react';
import { Fireworks } from '@/components/sentence-builder/fireworks';
import { TR_STYLES, type Mode } from './game-ui';
import { SoloRace } from './solo-race';
import { OnlineRace } from './online-race';

export function TypeRushGame({ playerName, userId }: { playerName: string; userId: string }) {
  const [mode, setMode] = useState<Mode>('solo');
  const [burst, setBurst] = useState(0);
  const celebrate = useCallback(() => setBurst((b) => b + 1), []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TR_STYLES }} />
      <Fireworks burst={burst} />
      {/* Өндөр — дэлгэцийн өндрийн 70% (h-[70dvh]); доод хязгаар 480px, дээд хязгаар нь header + padding хассан viewport */}
      <div className="relative flex h-[70dvh] max-h-[calc(100dvh-6rem)] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-ink-600/80 bg-ink-950 shadow-card md:max-h-[calc(100dvh-8.5rem)] lg:max-h-[calc(100dvh-5rem)]">
        {mode === 'solo' ? (
          <SoloRace playerName={playerName} mode={mode} onMode={setMode} onFinale={celebrate} />
        ) : (
          <OnlineRace playerName={playerName} userId={userId} mode={mode} onMode={setMode} onFinale={celebrate} />
        )}
      </div>
    </>
  );
}
