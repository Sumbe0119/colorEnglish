// frontend/src/app/draw-guess/page.tsx
'use client';

import { Palette } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { DrawGuessGame } from '@/components/draw-guess/draw-guess-game';

export default function DrawGuessPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
          <Palette className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-mist-50">Зурж таах</h1>
          <p className="mt-1 text-sm text-mist-400">
            Найзуудтайгаа бөөнөөрөө тоглоно. Ээлжийн тоглогч 3 үгнээс нэгийг сонгож 40 секундэд зурна, бусад нь
            англи үгийг таана. 10 секунд тутамд нэг үсэг тип болно. Түрүүлж таасан хүн хамгийн их оноо авна.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <DrawGuessGame userId={user?.id ?? ''} />
      </div>
    </div>
  );
}
