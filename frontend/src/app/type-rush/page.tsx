// frontend/src/app/type-rush/page.tsx
// Хуудас бүхэлдээ 2D тоглоом — гарчиг, тайлбар нь тоглоомын эхлэх дэлгэц дотор.
'use client';

import { useAuthStore } from '@/store/auth-store';
import { TypeRushGame } from '@/components/type-rush/type-rush-game';

export default function TypeRushPage() {
  const user = useAuthStore((s) => s.user);
  return <TypeRushGame playerName={user?.firstName?.trim() || 'Та'} userId={user?.id ?? ''} />;
}
