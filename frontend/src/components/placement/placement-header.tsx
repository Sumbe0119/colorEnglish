// frontend/src/components/placement/placement-header.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

/** Нэвтрэхгүй хуудасны толгой — нүүр хуудастай ижил хэв маяг */
export function PlacementHeader() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="relative block h-8 w-[140px] sm:h-9 sm:w-[160px]">
          <Image src="/logo/logo.png" alt="Color English" fill className="object-contain object-left" priority />
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5">
          <span className="hidden text-xs uppercase tracking-widest text-mist-500 md:inline">Түвшин тогтоох тест</span>
          {user ? (
            <Link
              href="/reading"
              className="inline-flex items-center gap-1.5 rounded-xl border border-ink-600 px-3 py-2 text-sm text-mist-200 transition-colors hover:border-brand/40 hover:text-mist-50"
            >
              <LayoutDashboard className="h-4 w-4" /> Хичээл рүү
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm text-mist-300 transition-colors hover:text-mist-50">
                Нэвтрэх
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-hover"
              >
                Бүртгүүлэх <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
