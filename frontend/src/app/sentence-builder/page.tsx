// frontend/src/app/sentence-builder/page.tsx
// Хуудас бүхэлдээ 2D тоглоом — гарчиг, тайлбар нь тоглоомын эхлэх дэлгэц дотор.
'use client';

import { useAuthStore } from '@/store/auth-store';
import { SentenceBuilderGame } from '@/components/sentence-builder/sentence-builder-game';

export default function SentenceBuilderPage() {
  const user = useAuthStore((s) => s.user);
  return <SentenceBuilderGame playerName={user?.firstName?.trim() || 'Та'} />;
}
