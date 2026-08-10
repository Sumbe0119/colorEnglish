import { BookOpen, CreditCard, Plus, Users } from 'lucide-react';

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
    href: '/admin/users',
    label: 'Хэрэглэгчид',
    shortLabel: 'Хэрэглэгч',
    icon: Users,
    isActive: (pathname: string) => pathname.startsWith('/admin/users'),
  },
] as const;
