'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminMobileNav } from '@/components/admin/admin-mobile-nav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (user.role !== 'ADMIN' && user.role !== 'EDITOR') return null;

  return (
    <div className="flex h-dvh overflow-hidden font-body text-mist-50">
      <AdminSidebar role={user.role} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminMobileNav role={user.role} />
        <main className="ce-scroll min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
