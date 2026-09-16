'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { AdminBackToAppLink, AdminNavLinks, useAdminNavTitle } from '@/components/admin/admin-nav-links';

/** lg-ээс доош: header + баруун талаас гарч ирэх drawer цэс */
export function AdminMobileNav({ role }: { role: string }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const title = useAdminNavTitle();
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Хуудас солигдоход хаана
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Esc дарахад хаах, нээгдэхэд хаах товч дээр focus
  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="flex shrink-0 items-center gap-3 border-b border-ink-600/80 bg-ink-900/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <Link href="/admin" className="relative h-7 w-[110px] shrink-0">
          <Image src="/logo/logo.png" alt="Color English" fill className="object-contain object-left" />
        </Link>
        <div className="min-w-0 flex-1 border-l border-ink-600/80 pl-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-mist-500">Admin</p>
          {title && <p className="truncate text-sm font-medium text-mist-100">{title}</p>}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg p-1.5 text-mist-300 hover:bg-ink-800 hover:text-mist-50"
          aria-label="Цэс нээх"
          aria-expanded={open}
          aria-controls="admin-mobile-drawer"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="admin-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] flex justify-end bg-ink-950/75 backdrop-blur-sm lg:hidden"
            onClick={close}
          >
            <motion.div
              id="admin-mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Admin цэс"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="flex h-full w-[80%] max-w-[300px] flex-col bg-ink-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-ink-600/80 p-4">
                <div>
                  <p className="font-display text-base font-semibold text-mist-50">Admin</p>
                  <p className="text-xs text-mist-400">Reading контент</p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={close}
                  className="rounded-lg p-1.5 text-mist-400 hover:bg-ink-800 hover:text-mist-50"
                  aria-label="Хаах"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="ce-scroll flex-1 space-y-1 overflow-y-auto p-3">
                <AdminNavLinks role={role} onNavigate={close} />
              </nav>

              <div className="shrink-0 space-y-3 border-t border-ink-600/80 p-4">
                <AdminBackToAppLink onNavigate={close} />
                <div className="flex items-center gap-2 px-1">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-mist-100">{user?.firstName ?? 'Хэрэглэгч'}</p>
                    <p className="truncate text-xs text-mist-400">{user?.email}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">{role}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
