'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { ComingSoonPage } from '@/components/coming-soon/coming-soon-page';

/** Нэвтрээгүй үед зөвшөөрөх path-ууд */
const PUBLIC_PATHS = ['/login', '/forgot-password'];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function GuestGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) return null;

  if (!user && !isPublicPath(pathname)) {
    return <ComingSoonPage />;
  }

  return <>{children}</>;
}
