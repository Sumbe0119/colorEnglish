'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, ArrowRight, Car, Palette, Puzzle, Trophy } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { AppShell } from '@/components/layout/app-shell';

export default function DashboardPage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.push('/login');
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <AppShell>
      <div>
        <h1 className="font-display text-2xl font-semibold text-mist-50">
          Сайн байна уу, {user.firstName ?? 'суралцагч'} 👋
        </h1>
        <p className="mt-2 text-sm text-mist-400">
          ColorEnglish Reading — жижиг өгүүллэг уншиж, үг бүрийн орчуулгыг сураарай.
        </p>

        <Link
          href="/reading"
          className="mt-8 group flex items-center gap-5 rounded-2xl border border-verb/30 bg-verb/5 p-6 transition-colors hover:border-verb/50 hover:bg-verb/10"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-verb/15 text-verb">
            <BookOpen className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-semibold text-mist-50">Унших өгүүллэг</p>
            <p className="mt-1 text-sm text-mist-400">
              Үг дээр дарж монгол орчуулга харах, voice-оор англи дуудлага сонсох
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-mist-500 group-hover:text-brand" />
        </Link>

        <Link
          href="/type-rush"
          className="mt-4 group flex items-center gap-5 rounded-2xl border border-brand/30 bg-brand/5 p-6 transition-colors hover:border-brand/50 hover:bg-brand/10"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <Car className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-semibold text-mist-50">Тоглоом — бичих уралдаан</p>
            <p className="mt-1 text-sm text-mist-400">
              5 замтай машины уралдаан: англи өгүүлбэрийг хурдан бичих тусам таны машин түрүүлнэ. Бүх хэрэглэгчид үнэгүй.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-mist-500 group-hover:text-brand" />
        </Link>

        <Link
          href="/draw-guess"
          className="mt-4 group flex items-center gap-5 rounded-2xl border border-brand/30 bg-brand/5 p-6 transition-colors hover:border-brand/50 hover:bg-brand/10"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <Palette className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-semibold text-mist-50">Тоглоом — зураг таах</p>
            <p className="mt-1 text-sm text-mist-400">
              Найзуудтайгаа бөөнөөрөө: нэг нь англи үгийг зурна, бусад нь таана. 40 сек, 10 сек тутамд үсгийн тип, түрүүлж таасан нь их оноо авна.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-mist-500 group-hover:text-brand" />
        </Link>

        <Link
          href="/sentence-builder"
          className="mt-4 group flex items-center gap-5 rounded-2xl border border-brand/30 bg-brand/5 p-6 transition-colors hover:border-brand/50 hover:bg-brand/10"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <Puzzle className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-semibold text-mist-50">Тоглоом — өгүүлбэр бүтээх</p>
            <p className="mt-1 text-sm text-mist-400">
              Холигдсон үгсээс англи өгүүлбэр бүтээж роботоо 10 тавцан (1–10 level) давуул. Цаг дуусвал тавцан хагарна; зөв бүтээсэн
              өгүүлбэр дахин ирэхгүй.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-mist-500 group-hover:text-brand" />
        </Link>

        <Link
          href="/leaderboard"
          className="mt-4 group flex items-center gap-5 rounded-2xl border border-modifier/30 bg-modifier/5 p-6 transition-colors hover:border-modifier/50 hover:bg-modifier/10"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-modifier/15 text-modifier">
            <Trophy className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-semibold text-mist-50">Leaderboard</p>
            <p className="mt-1 text-sm text-mist-400">Гурван тоглоомын шилдэг оноогоор хэрэглэгчдийн эрэмбэ. Та хэддүгээрт байна?</p>
          </div>
          <ArrowRight className="h-5 w-5 text-mist-500 group-hover:text-modifier" />
        </Link>
      </div>
    </AppShell>
  );
}
