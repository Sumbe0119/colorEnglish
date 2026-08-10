'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ADMIN_BROWSE_NAV, ADMIN_CREATE_NAV, ADMIN_MANAGE_NAV } from '@/components/admin/admin-nav';

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const BrowseIcon = ADMIN_BROWSE_NAV.icon;
  const isAdmin = role === 'ADMIN';

  return (
    <aside className="hidden w-[255px] shrink-0 flex-col border-r border-ink-600/80 bg-ink-900/95 lg:flex">
      <div className="border-b border-ink-700 p-5">
        <Link href="/dashboard" className="mb-4 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand font-display text-sm font-bold text-ink-950">
            C
          </span>
          <span className="font-display text-base font-semibold">
            Color<span className="text-brand">English</span>
          </span>
        </Link>
        <div>
          <h1 className="font-display text-lg font-semibold">Admin</h1>
          <p className="text-xs text-mist-400">Reading контент</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <Link
          href={ADMIN_BROWSE_NAV.href}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
            ADMIN_BROWSE_NAV.isActive(pathname)
              ? 'bg-brand/10 text-brand'
              : 'text-mist-300 hover:bg-ink-700'
          }`}
        >
          <BrowseIcon className="h-4 w-4" />
          {ADMIN_BROWSE_NAV.label}
        </Link>
        {ADMIN_CREATE_NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              pathname === href ? 'bg-brand/10 text-brand' : 'text-mist-300 hover:bg-ink-700'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}

        {isAdmin && (
          <>
            <div className="px-3 pb-1 pt-4 text-[10px] font-medium uppercase tracking-wider text-mist-500">
              Төлбөр
            </div>
            {ADMIN_MANAGE_NAV.map(({ href, label, icon: Icon, isActive }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isActive(pathname) ? 'bg-brand/10 text-brand' : 'text-mist-300 hover:bg-ink-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="space-y-2 border-t border-ink-700 p-4">
        <Link
          href="/reading"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-mist-400 hover:bg-ink-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Reading харах
        </Link>
        <span className="inline-block rounded-lg bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
          {role}
        </span>
      </div>
    </aside>
  );
}
