// frontend/src/app/type-rush/page.tsx
'use client';

import { Car } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { TypeRushGame } from '@/components/type-rush/type-rush-game';

export default function TypeRushPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
          <Car className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-mist-50">Type Rush — бичих уралдаан</h1>
          <p className="mt-1 text-sm text-mist-400">
            5 зам дээр машинууд уралдана. Англи өгүүлбэрийг хурдан, зөв бичих тусам таны машин урагшилна.
            Бүртгүүлсэн бүх хэрэглэгчид үнэгүй.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <TypeRushGame playerName={user?.firstName?.trim() || 'Та'} userId={user?.id ?? ''} />
      </div>
    </div>
  );
}
