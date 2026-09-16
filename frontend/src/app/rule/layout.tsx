// frontend/src/app/rule/layout.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { AppShell } from '@/components/layout/app-shell';

export default function RuleLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.push(`/login?next=${encodeURIComponent(pathname || '/rule')}`);
  }, [user, isLoading, router, pathname]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  // Эхний хичээлүүд үнэгүй тул бүх хэсгийг VIP-ээр хаахгүй — хичээл бүрийн түгжээг GrammarLevelPage шийднэ
  return <AppShell>{children}</AppShell>;
}
