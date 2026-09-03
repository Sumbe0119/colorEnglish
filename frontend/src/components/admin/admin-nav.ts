import { BookOpen, CreditCard, Percent, Plus, Users } from 'lucide-react';

export const ADMIN_BROWSE_NAV = {
  href: '/admin',
  label: 'Өгүүллэгүүд',
  icon: BookOpen,
  isActive: (pathname: string) =>
    pathname === '/admin' || /^\/admin\/stories\/(?!new)[^/]+$/.test(pathname),
} as const;

export const ADMIN_CREATE_NAV = [
  {
    href: '/admin/stories/new',
    label: 'Шинэ өгүүллэг',
    shortLabel: 'Шинэ',
    icon: Plus,
    description: 'Өгүүллэг + үгийн орчуулга нэмэх',
  },
] as const;

export const ADMIN_CREATE_STEPS = ADMIN_CREATE_NAV.length;

/** Зөвхөн ADMIN рольд харагдах — төлбөр / хэрэглэгч */
export const ADMIN_MANAGE_NAV = [
  {
    href: '/admin/pricing',
    label: 'Төлбөрийн багц',
    shortLabel: 'Төлбөр',
    icon: CreditCard,
    isActive: (pathname: string) => pathname.startsWith('/admin/pricing'),
  },
  {
    href: '/admin/promo-codes',
    label: 'Хөнгөлөлтийн код',
    shortLabel: 'Промо',
    icon: Percent,
    isActive: (pathname: string) => pathname.startsWith('/admin/promo-codes'),
  },
  {
    href: '/admin/users',
    label: 'Хэрэглэгчид',
    shortLabel: 'Хэрэглэгч',
    icon: Users,
    isActive: (pathname: string) => pathname.startsWith('/admin/users'),
  },
] as const;
