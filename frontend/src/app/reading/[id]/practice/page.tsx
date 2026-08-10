// frontend/src/app/reading/[id]/practice/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Gamepad2 } from 'lucide-react';
import { MiniQuiz } from '@/components/reading/mini-quiz';
import { LaneRaceGame } from '@/components/reading/lane-race-game';
import {
  completeReadingQuiz,
  completeReadingRace,
  getMyReadingWords,
  getReadingAccess,
  UserReadingWord,
} from '@/lib/reading-services';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/store/toast-store';

type Step = 'quiz' | 'race' | 'done';
type GameMode = 'quiz' | 'race' | 'both';

function parseGame(raw: string | null): GameMode {
  if (raw === 'quiz' || raw === 'race' || raw === 'both') return raw;
  return 'both';
}

function PracticeInner() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const replay = searchParams.get('replay') === '1';
  const game = parseGame(searchParams.get('game'));
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const [words, setWords] = useState<UserReadingWord[]>([]);
  const [step, setStep] = useState<Step>('quiz');
  const [nextStoryId, setNextStoryId] = useState<string | null>(null);
  const [storyTitle, setStoryTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alreadyCleared, setAlreadyCleared] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      const q = new URLSearchParams({ replay: replay ? '1' : '', game });
      q.forEach((v, k) => {
        if (!v) q.delete(k);
      });
      const qs = q.toString();
      router.replace(
        `/login?next=${encodeURIComponent(`/reading/${id}/practice${qs ? `?${qs}` : ''}`)}`,
      );
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const [mine, access] = await Promise.all([
          getMyReadingWords(id),
          getReadingAccess(),
        ]);
        if (cancelled) return;

        const story = access.stories.find((s) => s.id === id);
        setStoryTitle(story?.title ?? 'Өгүүллэг');
        setNextStoryId(story?.nextStoryId ?? null);
        setWords(mine);

        const cleared = !!(story?.quizPassed && story?.racePassed);
        setAlreadyCleared(cleared);

        if (mine.length === 0) {
          setStep('done');
        } else if (replay) {
          setStep(game === 'race' ? 'race' : 'quiz');
        } else if (cleared) {
          setStep('done');
        } else if (story?.quizPassed) {
          setStep('race');
        } else {
          setStep('quiz');
        }
      } catch {
        if (!cancelled) setError('Ачаалж чадсангүй');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [game, id, isHydrated, replay, router, user]);

  const handleQuizDone = async () => {
    try {
      await completeReadingQuiz(id);
      toast.success('Quiz амжилттай!');
      if (game === 'quiz') {
        setAlreadyCleared(true);
        setStep('done');
      } else {
        setStep('race');
      }
    } catch {
      toast.error('Quiz хадгалахад алдаа гарлаа');
    }
  };

  const handleRaceDone = async () => {
    try {
      await completeReadingRace(id);
      toast.success('Race амжилттай!');
      setAlreadyCleared(true);
      setStep('done');
    } catch {
      toast.error('Race хадгалахад алдаа гарлаа');
    }
  };

  if (!isHydrated || loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-danger">{error}</p>
        <Link href="/reading/words" className="mt-4 inline-block text-sm text-brand hover:underline">
          ← Цээжилсэн үгс
        </Link>
      </div>
    );
  }

  const stepHint =
    step === 'quiz'
      ? game === 'quiz'
        ? 'Mini-quiz'
        : 'Алхам 1: Mini-quiz'
      : step === 'race'
        ? game === 'race'
          ? 'Lane race'
          : 'Алхам 2: Эгнээний уралдаан'
        : replay || alreadyCleared
          ? 'Амжилттай! Үгсээ бататгалаа.'
          : 'Амжилттай! Дараагийн өгүүллэг нээгдлээ.';

  return (
    <div>
      <Link
        href={replay ? '/reading/words' : '/reading'}
        className="mb-6 inline-flex items-center gap-2 text-sm text-mist-400 hover:text-mist-50"
      >
        <ArrowLeft className="h-4 w-4" />
        {replay ? 'Цээжилсэн үгс' : 'Бүх өгүүллэг'}
      </Link>

      <p className="text-xs uppercase tracking-wide text-mist-500">
        {replay ? 'Бататгах тоглоом' : 'Цээжлэх тоглоом'}
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-mist-50">{storyTitle}</h1>
      <p className="mt-2 text-sm text-mist-400">{stepHint}</p>

      <div className={`mt-8 ${step === 'race' ? '' : 'rounded-2xl border border-ink-700 bg-ink-900 p-6 md:p-8'}`}>
        {words.length === 0 && step === 'done' && (
          <div className="rounded-2xl border border-ink-700 bg-ink-900 p-6 text-center text-mist-400 md:p-8">
            Энэ өгүүллэгт хадгалсан шинэ үг байхгүй — шууд үргэлжлүүлж болно.
          </div>
        )}

        {step === 'quiz' && words.length > 0 && (
          <MiniQuiz key={`quiz-${id}-${playKey}`} words={words} onComplete={handleQuizDone} />
        )}

        {step === 'race' && words.length > 0 && (
          <LaneRaceGame key={`race-${id}-${playKey}`} words={words} onComplete={handleRaceDone} />
        )}

        {step === 'done' && (
          <div className="space-y-4 rounded-2xl border border-ink-700 bg-ink-900 p-6 text-center md:p-8">
            <p className="text-mist-200">
              {words.length > 0 ? 'Тоглоомыг амжилттай давлаа.' : 'Үргэлжлүүлэхэд бэлэн.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {words.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setPlayKey((k) => k + 1);
                    setStep(game === 'race' ? 'race' : 'quiz');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-brand/40 px-5 py-2.5 text-sm font-medium text-brand hover:bg-brand/10"
                >
                  <Gamepad2 className="h-4 w-4" /> Дахин бататгах
                </button>
              )}
              {nextStoryId && !replay ? (
                <Link
                  href={`/reading/${nextStoryId}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-brand/90"
                >
                  Дараагийн өгүүллэг <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/reading/words"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-brand/90"
                >
                  Цээжилсэн үгс рүү
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReadingPracticePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      }
    >
      <PracticeInner />
    </Suspense>
  );
}
