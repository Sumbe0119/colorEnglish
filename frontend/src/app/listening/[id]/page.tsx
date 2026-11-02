// frontend/src/app/listening/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { ListeningGame } from '@/components/listening/listening-game';

export default function ListeningClipPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';
  if (!id) return null;
  return <ListeningGame clipId={id} />;
}
