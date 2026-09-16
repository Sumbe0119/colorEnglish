'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ADMIN_BROWSE_NAV, ADMIN_CREATE_NAV, ADMIN_MANAGE_NAV } from '@/components/admin/admin-nav';

const linkClass = (active: boolean) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
    active ? 'bg-brand/10 text-brand' : 'text-mist-300 hover:bg-ink-700 hover:text-mist-50'
  }`;

/** Sidebar болон mobile drawer-т хуваалцах admin цэс */
export function AdminNavLinks({ role, onNavigate }: { role: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const BrowseIcon = ADMIN_BROWSE_NAV.icon;

  return (
    <>
      <Link href={ADMIN_BROWSE_NAV.href} onClick={onNavigate} className={linkClass(ADMIN_BROWSE_NAV.isActive(pathname))}>
        <BrowseIcon className="h-4 w-4" />
        {ADMIN_BROWSE_NAV.label}
      </Link>
      {ADMIN_CREATE_NAV.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} onClick={onNavigate} className={linkClass(pathname === href)}>
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}

      {role === 'ADMIN' && (
        <>
          <div className="px-3 pb-1 pt-4 text-[10px] font-medium uppercase tracking-wider text-mist-500">Төлбөр</div>
          {ADMIN_MANAGE_NAV.map(({ href, label, icon: Icon, isActive }) => (
            <Link key={href} href={href} onClick={onNavigate} className={linkClass(isActive(pathname))}>
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </>
      )}
    </>
  );
}

/** Admin хэсгээс хэрэглэгчийн (суралцагчийн) хэсэг рүү буцах */
export function AdminBackToAppLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/reading"
      onClick={onNavigate}
      className="flex items-center gap-2 rounded-xl border border-ink-600 px-3 py-2.5 text-sm text-mist-200 transition-colors hover:border-brand/40 hover:bg-ink-800 hover:text-mist-50"
    >
      <ArrowLeft className="h-4 w-4" />
      Хэрэглэгчийн хэсэг рүү буцах
    </Link>
  );
}

/** Одоогийн admin хуудасны нэр (mobile header-т) */
export function useAdminNavTitle() {
  const pathname = usePathname();
  if (ADMIN_BROWSE_NAV.isActive(pathname)) return ADMIN_BROWSE_NAV.label;
  const create = ADMIN_CREATE_NAV.find((item) => item.href === pathname);
  if (create) return create.label;
  const manage = ADMIN_MANAGE_NAV.find((item) => item.isActive(pathname));
  return manage?.label ?? null;
}
