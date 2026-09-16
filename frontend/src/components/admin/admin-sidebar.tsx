'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AdminBackToAppLink, AdminNavLinks } from '@/components/admin/admin-nav-links';

export function AdminSidebar({ role }: { role: string }) {
  return (
    <aside className="hidden w-[255px] shrink-0 flex-col border-r border-ink-600/80 bg-ink-900/95 lg:flex">
      <div className="border-b border-ink-700 p-5">
        <Link href="/dashboard" className="relative mb-4 block h-8 w-[150px]">
          <Image
            src="/logo/logo.png"
            alt="Color English"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>
        <div>
          <h1 className="font-display text-lg font-semibold">Admin</h1>
          <p className="text-xs text-mist-400">Reading контент</p>
        </div>
      </div>

      <nav className="ce-scroll flex-1 space-y-1 overflow-y-auto p-3">
        <AdminNavLinks role={role} />
      </nav>

      <div className="space-y-3 border-t border-ink-700 p-4">
        <AdminBackToAppLink />
        <span className="inline-block rounded-lg bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
          {role}
        </span>
      </div>
    </aside>
  );
}
