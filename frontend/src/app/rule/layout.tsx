// frontend/src/app/rule/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { AppShell } from '@/components/layout/app-shell';
import { VipGate } from '@/components/billing/vip-gate';

export default function RuleLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.push('/login?next=/rule');
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
      <VipGate
        title="Дүрмийн хэсэг VIP багцад багтана"
        description="VIP багцаа аваад бүх дүрэм, жишээ, шалгалтын дасгалыг бүрэн ашиглаарай."
      >
        {children}
      </VipGate>
    </AppShell>
  );
}
