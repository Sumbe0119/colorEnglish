'use client';

import Image from 'next/image';


export function ComingSoonPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[280px] w-[420px] rounded-full bg-verb/5 blur-[100px]" />
      </div>
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="relative mb-8 h-24 w-24 md:h-28 md:w-28">
          <Image
            src="/logo/mobile-logo.png"
            alt="Color English"
            fill
            className="object-contain"
            priority
          />
        </div>

        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-medium text-brand">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
          Coming soon
        </p>

        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-mist-50 md:text-6xl">
          Тун удахгүй
        </h1>

      </main>

      <footer className="relative z-10 border-t border-ink-700 px-6 py-8 text-center text-xs text-mist-500">
        © {new Date().getFullYear()} ColorEnglish
      </footer>
    </div>
  );
}
