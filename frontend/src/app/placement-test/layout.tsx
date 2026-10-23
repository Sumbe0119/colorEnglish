import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Англи хэлний түвшин тогтоох тест — ColorEnglish',
  description:
    'Нэвтрэхгүйгээр 40 асуулттай англи хэлний түвшин тогтоох тест өгөөд A1-ээс C1 хүртэлх түвшингээ, чадвар тус бүрийн задаргаа, суралцах зөвлөмжөө аваарай.',
};

export default function PlacementTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
