'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { restoreSession } from '@/lib/services';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, clearSession, isLoading } = useAuthStore();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      useAuthStore.setState({ isLoading: true });
      const session = await restoreSession();
      if (cancelled) return;
      if (session) {
        setSession(session.user, session.accessToken);
      } else {
        clearSession();
      }
      useAuthStore.setState({ isLoading: false, isHydrated: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [setSession, clearSession]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
