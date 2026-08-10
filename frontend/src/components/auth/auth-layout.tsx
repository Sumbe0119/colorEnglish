import Link from 'next/link';
import { SentenceShowcase } from './sentence-showcase';

export function AuthLayout({
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: {
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Зүүн тал — brand showcase, том дэлгэцэнд л харагдана */}
      <div className="relative hidden w-1/2 overflow-hidden border-r border-ink-700 bg-ink-950/70 lg:block">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(124,158,255,0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(95,217,164,0.12), transparent 45%)',
          }}
        />
        <div className="relative z-10 flex h-full flex-col">
          <div className="px-12 pt-10">
            <Link href="/" className="font-display text-xl font-semibold tracking-tight text-mist-50">
              Color<span className="text-brand">English</span>
            </Link>
          </div>
          <div className="flex-1">
            <SentenceShowcase />
          </div>
          <div className="px-12 pb-10 text-xs text-mist-400">
            21 хоног · 8 төрлийн дадлага · A1–C2 · AI багш 24/7
          </div>
        </div>
      </div>

      {/* Баруун тал — форм */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="mb-10 lg:hidden">
          <Link href="/" className="font-display text-xl font-semibold tracking-tight text-mist-50">
            Color<span className="text-brand">English</span>
          </Link>
        </div>

        <div className="w-full max-w-sm">{children}</div>

        <p className="mt-8 text-center text-sm text-mist-400">
          {footerText}{' '}
          <Link href={footerLinkHref} className="font-medium text-brand hover:text-brand-hover">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
