// frontend/src/app/placement-test/page.tsx
// Түвшин тогтоох тест — нэвтрэх шаардлагагүй. Урсгал: intro → quiz → locked (төлбөр) → result.
'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ChevronRight, ClipboardCheck, Clock3, ListChecks, Lock, PlayCircle, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlacementHeader } from '@/components/placement/placement-header';
import { PlacementQuiz } from '@/components/placement/placement-quiz';
import { PlacementPaywall } from '@/components/placement/placement-paywall';
import { PlacementResult } from '@/components/placement/placement-result';
import { formatMnt } from '@/lib/billing-services';
import { getApiErrorMessage } from '@/lib/api-error';
import {
  clearPlacementDraft,
  clearPlacementSession,
  getPlacementAttempt,
  getPlacementQuestions,
  isNotFoundError,
  loadPlacementDraft,
  loadPlacementSession,
  savePlacementSession,
  submitPlacement,
  type PlacementAttempt,
  type PlacementDraft,
  type PlacementQuestionSet,
  type PlacementSession,
} from '@/lib/placement-services';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/store/toast-store';

type View = 'loading' | 'intro' | 'quiz' | 'submitting' | 'locked' | 'result' | 'error';

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function PlacementTestPage() {
  const user = useAuthStore((s) => s.user);
  const [view, setView] = useState<View>('loading');
  const [questionSet, setQuestionSet] = useState<PlacementQuestionSet | null>(null);
  const [attempt, setAttempt] = useState<PlacementAttempt | null>(null);
  const [session, setSession] = useState<PlacementSession | null>(null);
  const [draft, setDraft] = useState<PlacementDraft | null>(null);
  const [resumeDraft, setResumeDraft] = useState<PlacementDraft | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setView('loading');
    setError(null);
    try {
      const qs = await getPlacementQuestions();
      setQuestionSet(qs);

      // Өмнө илгээсэн оролдлого байвал — төлсөн бол үр дүн, үгүй бол төлбөрийн алхам
      const saved = loadPlacementSession();
      if (saved) {
        try {
          const a = await getPlacementAttempt(saved.id, saved.token);
          setSession(saved);
          setAttempt(a);
          setView(a.status === 'UNLOCKED' ? 'result' : 'locked');
          return;
        } catch (err) {
          if (isNotFoundError(err)) {
            clearPlacementSession();
          } else {
            setError(getApiErrorMessage(err, 'Өмнөх тестийн мэдээлэл ачаалж чадсангүй'));
            setView('error');
            return;
          }
        }
      }

      const d = loadPlacementDraft();
      if (d && d.version === qs.version && Object.keys(d.answers).length > 0) setDraft(d);
      else if (d) clearPlacementDraft();
      setView('intro');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Тестийн асуултууд ачаалж чадсангүй'));
      setView('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const startQuiz = (resume: boolean) => {
    if (resume && draft) {
      setResumeDraft(draft);
    } else {
      clearPlacementDraft();
      setDraft(null);
      setResumeDraft(null);
    }
    setView('quiz');
  };

  const exitQuiz = () => {
    const d = loadPlacementDraft();
    setDraft(d && Object.keys(d.answers).length > 0 ? d : null);
    setView('intro');
  };

  const handleFinish = async (answers: Record<string, number>, durationSec: number) => {
    setView('submitting');
    try {
      const res = await submitPlacement(answers, durationSec);
      const { token, ...rest } = res;
      const s: PlacementSession = { id: res.id, token, createdAt: res.createdAt };
      savePlacementSession(s);
      clearPlacementDraft();
      setDraft(null);
      setResumeDraft(null);
      setSession(s);
      setAttempt(rest);
      setView('locked');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Хариулт илгээхэд алдаа гарлаа. Дахин оролдоно уу.'));
      // Хариултууд draft-д хадгалагдсан тул үргэлжлүүлнэ
      setResumeDraft(loadPlacementDraft());
      setView('quiz');
    }
  };

  const handleUnlocked = (a: PlacementAttempt) => {
    setAttempt(a);
    setView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    clearPlacementSession();
    clearPlacementDraft();
    setSession(null);
    setAttempt(null);
    setDraft(null);
    setResumeDraft(null);
    setView('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const price = questionSet ? formatMnt(questionSet.priceMnt) : attempt ? formatMnt(attempt.priceMnt) : '3,000₮';
  const count = questionSet?.questionCount ?? 40;
  const minutes = questionSet?.estimatedMinutes ?? 15;
  const draftAnswered = draft ? Object.keys(draft.answers).length : 0;

  return (
    <div className="min-h-screen">
      <PlacementHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-6 sm:px-6 sm:pt-10">
        <AnimatePresence mode="wait">
          {view === 'loading' && (
            <div key="loading" className="flex justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            </div>
          )}

          {view === 'error' && (
            <motion.div key="error" {...fade} className="ce-panel flex flex-col items-center px-6 py-12 text-center">
              <AlertCircle className="h-8 w-8 text-danger" />
              <p className="mt-4 text-sm text-mist-300">{error ?? 'Мэдээлэл ачаалж чадсангүй.'}</p>
              <Button className="mt-6 gap-2" onClick={() => void load()}>
                <RotateCcw className="h-4 w-4" /> Дахин оролдох
              </Button>
            </motion.div>
          )}

          {view === 'intro' && questionSet && (
            <motion.div key="intro" {...fade} className="space-y-5">
              <div className="ce-panel p-6 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15">
                  <ClipboardCheck className="h-6 w-6 text-brand" />
                </div>
                <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-brand">Түвшин тогтоох тест</p>
                <h1 className="mt-2 font-display text-2xl font-semibold leading-tight text-mist-50 sm:text-3xl">
                  Англи хэлний түвшингээ {minutes} минутад тогтоо
                </h1>


                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: ListChecks, title: `${count} асуулт`, desc: '5 түвшин × 8 асуулт, сонголттой' },
                    { icon: Clock3, title: `${minutes} орчим минут`, desc: 'Хугацааны хязгааргүй, зогсоож болно' },
                    { icon: ShieldCheck, title: 'Нэвтрэх шаардлагагүй', desc: 'Хариулт энэ төхөөрөмж дээр хадгалагдана' },
                    { icon: Lock, title: `Үр дүн — ${price}`, desc: 'QPay-ээр төлөөд шууд нээнэ' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <li key={title} className="flex items-start gap-3 rounded-xl border border-ink-600/70 bg-ink-800/60 p-3.5">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <div>
                        <p className="text-sm font-medium text-mist-50">{title}</p>
                        <p className="mt-0.5 text-xs leading-5 text-mist-400">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {draft ? (
                    <>
                      <Button className="flex-1 gap-2" onClick={() => startQuiz(true)}>
                        <PlayCircle className="h-4 w-4" /> Үргэлжлүүлэх ({draftAnswered}/{count})
                      </Button>
                      <Button variant="secondary" className="flex-1 gap-2" onClick={() => startQuiz(false)}>
                        <RotateCcw className="h-4 w-4" /> Шинээр эхлэх
                      </Button>
                    </>
                  ) : (
                    <Button className="flex-1 gap-2" onClick={() => startQuiz(false)}>
                      Тест эхлүүлэх <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="mt-4 text-xs leading-5 text-mist-500">
                  Үр дүнд: түвшин (A1–C1), оноо, түвшин ба чадвар тус бүрийн задаргаа, асуулт бүрийн зөв хариулт, монгол
                  тайлбар, суралцах зөвлөмж багтана.
                </p>
              </div>

              <p className="px-1 text-center text-xs text-mist-500">
                Тест өгөлгүй шууд суралцаж эхлэх үү?{' '}
                <Link href={user ? '/reading' : '/register'} className="font-medium text-brand hover:text-brand-hover">
                  {user ? 'Хичээл рүү' : 'Бүртгүүлэх'}
                </Link>
              </p>
            </motion.div>
          )}

          {(view === 'quiz' || view === 'submitting') && questionSet && (
            <motion.div key="quiz" {...fade} className="relative">
              <PlacementQuiz
                questions={questionSet.questions}
                version={questionSet.version}
                initialDraft={resumeDraft}
                onFinish={(answers, durationSec) => void handleFinish(answers, durationSec)}
                onExit={exitQuiz}
              />
              {view === 'submitting' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-ink-950/70 backdrop-blur-[2px]">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                  <p className="text-sm text-mist-200">Хариултыг дүгнэж байна…</p>
                </div>
              )}
            </motion.div>
          )}

          {view === 'locked' && attempt && session && (
            <motion.div key="locked" {...fade}>
              <PlacementPaywall
                attempt={attempt}
                session={session}
                onAttemptChange={setAttempt}
                onUnlocked={handleUnlocked}
                onRestart={handleRestart}
              />
            </motion.div>
          )}

          {view === 'result' && attempt?.result && (
            <motion.div key="result" {...fade}>
              <PlacementResult result={attempt.result} isLoggedIn={Boolean(user)} onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
