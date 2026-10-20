// frontend/src/app/draw-guess/page.tsx
// Хуудас бүхэлдээ 2D тоглоом — гарчиг, дүрэм нь тоглоомын эхлэх давхарга дотор.
'use client';

import { useAuthStore } from '@/store/auth-store';
import { DrawGuessGame } from '@/components/draw-guess/draw-guess-game';

export default function DrawGuessPage() {
  const user = useAuthStore((s) => s.user);
  return <DrawGuessGame userId={user?.id ?? ''} playerName={user?.firstName?.trim() || 'Та'} />;
}
