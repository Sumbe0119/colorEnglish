// frontend/src/app/leaderboard/layout.tsx
// Leaderboard — зөвхөн нэвтэрсэн хэрэглэгч (VIP шаардлагагүй)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { AppShell } from '@/components/layout/app-shell';

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.push('/login?next=/leaderboard');
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
