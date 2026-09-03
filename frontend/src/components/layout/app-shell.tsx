// frontend/src/components/layout/app-shell.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Library, LogOut, Menu, Settings, UserRound, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { logout } from '@/lib/services';
import { SubscriptionStatusBar } from '@/components/layout/subscription-status-bar';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearSession } = useAuthStore();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await logout().catch(() => null);
      clearSession();
      setLogoutOpen(false);
      router.push('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  const isStories =
    pathname === '/reading' ||
    (pathname.startsWith('/reading/') && !pathname.startsWith('/reading/words'));
  const isMyWords = pathname.startsWith('/reading/words');
  const isProfile = pathname.startsWith('/profile');
  const isAdmin = pathname.startsWith('/admin');
  const isImmersiveReader = /\/reading\/[^/]+\/read\//.test(pathname);
  const isStoryOverview = /^\/reading\/[^/]+$/.test(pathname);

  return (
    <div className="flex h-dvh overflow-hidden font-body text-mist-50">
      {/* Sidebar — viewport өндөртэй, контент scroll-оос тусдаа */}
      <aside className="ce-scroll hidden h-full w-[255px] shrink-0 flex-col overflow-y-auto border-r border-ink-600/80 bg-ink-900/90 backdrop-blur-sm lg:flex">
        <div className="shrink-0 border-b border-ink-600/80 p-5">
          <Link href="/dashboard" className="relative block h-8 w-[150px]">
            <Image
              src="/logo/logo.png"
              alt="Color English"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>
          <p className="mt-3 text-xs text-mist-400">Reading — унших дадлага</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <Link
            href="/reading"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isStories
                ? 'bg-brand/20 text-brand shadow-glow'
                : 'text-mist-300 hover:bg-ink-800 hover:text-mist-50'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Өгүүллэгүүд
          </Link>
          <Link
            href="/reading/words"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isMyWords
                ? 'bg-brand/20 text-brand shadow-glow'
                : 'text-mist-300 hover:bg-ink-800 hover:text-mist-50'
            }`}
          >
            <Library className="h-4 w-4" />
            Цээжилсэн үгс
          </Link>
          <Link
            href="/profile"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isProfile
                ? 'bg-brand/20 text-brand shadow-glow'
                : 'text-mist-300 hover:bg-ink-800 hover:text-mist-50'
            }`}
          >
            <UserRound className="h-4 w-4" />
            Профайл
          </Link>
          {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
            <Link
              href="/admin"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isAdmin
                  ? 'bg-brand/20 text-brand shadow-glow'
                  : 'text-mist-300 hover:bg-ink-800 hover:text-mist-50'
              }`}
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="mt-auto shrink-0 border-t border-ink-600/80 p-4">
          {user && (
            <Link href="/profile" className="mb-3 block rounded-lg p-1 hover:bg-ink-800/80">
              <p className="truncate text-sm font-medium text-mist-100">
                {user.firstName ?? 'Хэрэглэгч'}
              </p>
              <p className="truncate text-xs text-mist-400">{user.email}</p>
            </Link>
          )}
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-mist-400 hover:bg-ink-800 hover:text-mist-50"
          >
            <LogOut className="h-4 w-4" /> Гарах
          </button>
        </div>
      </aside>

      {/* Баруун багана — header бэхлэгдсэн, зөвхөн main scroll хийнэ */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {!isImmersiveReader && (
          <div className="shrink-0 border-b border-ink-600/80 bg-ink-900/95 backdrop-blur-md">
            <header className="flex items-center gap-3 px-4 py-3 lg:hidden">
              {isStoryOverview ? (
                <Link
                  href="/reading"
                  className="inline-flex min-w-0 items-center gap-2 text-sm text-mist-400 hover:text-mist-50"
                >
                  <ArrowLeft className="h-4 w-4 shrink-0" />
                  <span className="truncate">Бүх өгүүллэг</span>
                </Link>
              ) : (
                <div className="relative h-7 w-[130px]">
                  <Image
                    src="/logo/logo.png"
                    alt="Color English"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="ml-auto rounded-lg p-1.5 text-mist-300 hover:bg-ink-800 hover:text-mist-50"
                aria-label="Цэс нээх"
              >
                <Menu className="h-5 w-5" />
              </button>
            </header>

            {isStoryOverview && (
              <div className="hidden border-b border-ink-600/60 px-4 py-2.5 sm:px-6 md:px-10 lg:block lg:px-10">
                <div className="mx-auto max-w-6xl">
                  <Link
                    href="/reading"
                    className="inline-flex items-center gap-2 text-sm text-mist-400 hover:text-mist-50"
                  >
                    <ArrowLeft className="h-4 w-4" /> Бүх өгүүллэг
                  </Link>
                </div>
              </div>
            )}

            <SubscriptionStatusBar />
          </div>
        )}

        <main
          className={`ce-scroll min-h-0 flex-1 overflow-y-auto ${
            isImmersiveReader ? 'p-0 md:p-10' : 'p-4 sm:p-6 md:p-10'
          }`}
        >
          <div className={`mx-auto ${isImmersiveReader ? 'max-w-none md:max-w-6xl' : 'max-w-6xl'}`}>
            {children}
          </div>
        </main>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[90] flex justify-end bg-ink-950/75 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="flex h-full w-[80%] max-w-[300px] flex-col bg-ink-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-ink-600/80 p-4">
              <div className="relative h-7 w-[130px]">
                <Image
                  src="/logo/logo.png"
                  alt="Color English"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-mist-400 hover:bg-ink-800 hover:text-mist-50"
                aria-label="Хаах"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              <Link
                href="/reading"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isStories
                    ? 'bg-brand/20 text-brand shadow-glow'
                    : 'text-mist-300 hover:bg-ink-800 hover:text-mist-50'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Өгүүллэгүүд
              </Link>
              <Link
                href="/reading/words"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isMyWords
                    ? 'bg-brand/20 text-brand shadow-glow'
                    : 'text-mist-300 hover:bg-ink-800 hover:text-mist-50'
                }`}
              >
                <Library className="h-4 w-4" />
                Цээжилсэн үгс
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isProfile
                    ? 'bg-brand/20 text-brand shadow-glow'
                    : 'text-mist-300 hover:bg-ink-800 hover:text-mist-50'
                }`}
              >
                <UserRound className="h-4 w-4" />
                Профайл
              </Link>
              {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    isAdmin
                      ? 'bg-brand/20 text-brand shadow-glow'
                      : 'text-mist-300 hover:bg-ink-800 hover:text-mist-50'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>

            <div className="mt-auto shrink-0 border-t border-ink-600/80 p-4">
              {user && (
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mb-3 block rounded-lg p-1 hover:bg-ink-800/80"
                >
                  <p className="truncate text-sm font-medium text-mist-100">
                    {user.firstName ?? 'Хэрэглэгч'}
                  </p>
                  <p className="truncate text-xs text-mist-400">{user.email}</p>
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLogoutOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-mist-400 hover:bg-ink-800 hover:text-mist-50"
              >
                <LogOut className="h-4 w-4" /> Гарах
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={logoutOpen}
        title="Системээс гарах уу?"
        description="Та одоо гарахдаа итгэлтэй байна уу? Дахин нэвтрэхийн тулд email, нууц үгээ оруулна."
        confirmLabel="Гарах"
        cancelLabel="Болих"
        isLoading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={() => {
          if (!loggingOut) setLogoutOpen(false);
        }}
      />
    </div>
  );
}
