// frontend/src/components/tug-of-war/tug-of-war-game.tsx
// "Олс татах" — бүтэн хуудас 2D тоглоом. Canvas дүрслэл (TugScene) дэлгэцийг дүүргэж, доор нь хоёр багийн
// асуултын карт, дээр нь сонголт / lobby / үр дүнгийн давхарга. Горим (ганцаараа боттой / онлайн 1v1)
// давхарга дотроос солигдоно. Нийтлэг UI-г type-rush/game-ui-аас дахин ашиглана.
'use client';

import { useCallback, useState } from 'react';
import { Fireworks } from '@/components/sentence-builder/fireworks';
import { TR_STYLES, type Mode } from '@/components/type-rush/game-ui';
import { SoloTug } from './solo-tug';
import { OnlineTug } from './online-tug';

export function TugOfWarGame({ playerName, userId }: { playerName: string; userId: string }) {
  const [mode, setMode] = useState<Mode>('solo');
  const [burst, setBurst] = useState(0);
  const celebrate = useCallback(() => setBurst((b) => b + 1), []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TR_STYLES }} />
      <Fireworks burst={burst} />
      <div className="relative flex h-[70dvh] max-h-[calc(100dvh-6rem)] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-ink-600/80 bg-ink-950 shadow-card md:max-h-[calc(100dvh-8.5rem)] lg:max-h-[calc(100dvh-5rem)]">
        {mode === 'solo' ? (
          <SoloTug playerName={playerName} mode={mode} onMode={setMode} onFinale={celebrate} />
        ) : (
          <OnlineTug playerName={playerName} userId={userId} mode={mode} onMode={setMode} onFinale={celebrate} />
        )}
      </div>
    </>
  );
}
