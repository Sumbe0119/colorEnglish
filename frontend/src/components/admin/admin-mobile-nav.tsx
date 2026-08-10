'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_BROWSE_NAV, ADMIN_CREATE_NAV, ADMIN_MANAGE_NAV } from '@/components/admin/admin-nav';

export function AdminMobileNav({ role }: { role: string }) {
  const pathname = usePathname();
  const BrowseIcon = ADMIN_BROWSE_NAV.icon;
  const isAdmin = role === 'ADMIN';
  const manageItems = isAdmin ? ADMIN_MANAGE_NAV : [];

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-ink-600/80 bg-ink-900/95 px-3 py-2 lg:hidden">
      <Link
        href={ADMIN_BROWSE_NAV.href}
        className={`flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm ${
          ADMIN_BROWSE_NAV.isActive(pathname) ? 'bg-brand/10 text-brand' : 'text-mist-400'
        }`}
      >
        <BrowseIcon className="h-4 w-4" />
        Жагсаалт
      </Link>
      {ADMIN_CREATE_NAV.map(({ href, shortLabel, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm ${
            pathname === href ? 'bg-brand/10 text-brand' : 'text-mist-400'
          }`}
        >
          <Icon className="h-4 w-4" />
          {shortLabel}
        </Link>
      ))}
      {manageItems.map(({ href, shortLabel, icon: Icon, isActive }) => (
        <Link
          key={href}
          href={href}
          className={`flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm ${
            isActive(pathname) ? 'bg-brand/10 text-brand' : 'text-mist-400'
          }`}
        >
          <Icon className="h-4 w-4" />
          {shortLabel}
        </Link>
      ))}
    </nav>
  );
}
