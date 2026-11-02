// frontend/src/app/tug-of-war/page.tsx
// Хуудас бүхэлдээ 2D тоглоом — гарчиг, тайлбар нь тоглоомын эхлэх дэлгэц дотор.
'use client';

import { useAuthStore } from '@/store/auth-store';
import { TugOfWarGame } from '@/components/tug-of-war/tug-of-war-game';

export default function TugOfWarPage() {
  const user = useAuthStore((s) => s.user);
  return <TugOfWarGame playerName={user?.firstName?.trim() || 'Та'} userId={user?.id ?? ''} />;
}
