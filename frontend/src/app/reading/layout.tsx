'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { AppShell } from '@/components/layout/app-shell';
import {
  ReadingLockProvider,
  useReadingLock,
} from '@/components/reading/reading-lock';

/**
 * Хаалтын хугацаанд өгүүллэгийн дэд хуудсууд (/reading/[id], read, practice)
 * руу шууд URL-аар орохыг зогсоож, жагсаалт дээр анхааруулга харуулна.
 */
function ReadingLockGuard({ children }: { children: React.ReactNode }) {
  const { locked, showNotice } = useReadingLock();
  const pathname = usePathname();
  const router = useRouter();

  const isStoryRoute =
    pathname.startsWith('/reading/') && !pathname.startsWith('/reading/words');

  useEffect(() => {
    if (!locked || !isStoryRoute) return;
    showNotice();
    router.replace('/reading');
  }, [locked, isStoryRoute, showNotice, router]);

  if (locked && isStoryRoute) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function ReadingLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.push('/login');
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <AppShell>
      <ReadingLockProvider>
        <ReadingLockGuard>{children}</ReadingLockGuard>
      </ReadingLockProvider>
    </AppShell>
  );
}
