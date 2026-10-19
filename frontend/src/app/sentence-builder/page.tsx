// frontend/src/app/sentence-builder/page.tsx
'use client';

import { Puzzle } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { SentenceBuilderGame } from '@/components/sentence-builder/sentence-builder-game';

export default function SentenceBuilderPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
          <Puzzle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-mist-50">Өгүүлбэр бүтээх</h1>
          <p className="mt-1 text-sm text-mist-400">
            Санамсаргүй 3 үг өгнө. Та тэдгээрээр хялбар, зөв англи өгүүлбэр бүтээж 30 секундэд бич.
            Зөв бол салют буудна, чадахгүй бол Tip товчоор жишээ өгүүлбэр харна. Бүртгүүлсэн бүх хэрэглэгчид үнэгүй.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <SentenceBuilderGame playerName={user?.firstName?.trim() || 'Та'} />
      </div>
    </div>
  );
}
