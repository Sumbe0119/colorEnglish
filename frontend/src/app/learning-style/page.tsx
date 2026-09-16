'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, BrainCircuit, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeNextPath } from '@/lib/safe-next';
import { getProfile, submitLearningStyle, type StudentProfile } from '@/lib/services';
import {
  LEARNING_STYLE_QUESTIONS,
  parseLearningStyleScores,
  type LearningStyle,
} from '@/lib/learning-style';
import { LearningStyleResult } from '@/components/onboarding/learning-style-result';
import {
  emptyLearningStyleAnswers,
  LearningStyleSurvey,
} from '@/components/onboarding/learning-style-survey';

type View = 'loading' | 'intro' | 'survey' | 'result' | 'error';

function LearningStylePageInner() {
  const router = useRouter();
  const next = safeNextPath(useSearchParams().get('next')) ?? '/reading';

  const [view, setView] = useState<View>('loading');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [answers, setAnswers] = useState<(LearningStyle | null)[]>(emptyLearningStyleAnswers);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((p) => {
        if (cancelled) return;
        setProfile(p);
        setView(p.learningStyleCompletedAt && p.dominantLearningStyle ? 'result' : 'intro');
      })
      .catch(() => !cancelled && setView('error'));
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleComplete(all: LearningStyle[]) {
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await submitLearningStyle(all);
      setProfile((p) => (p ? { ...p, ...updated } : p));
      setView('result');
    } catch {
      setSaveError('Хадгалахад алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setSaving(false);
    }
  }

  const scores = parseLearningStyleScores(profile?.learningStyleScores);
  const hadPartial = Boolean(profile?.dominantLearningStyle && !profile.learningStyleCompletedAt);

  return (
    <div className="mx-auto max-w-2xl pb-12">
      <AnimatePresence mode="wait">
        {view === 'loading' && (
          <div key="loading" className="flex justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        )}

        {view === 'error' && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ce-panel flex flex-col items-center px-6 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <p className="mt-4 text-sm text-mist-300">Мэдээлэл ачаалж чадсангүй.</p>
            <Button className="mt-6 gap-2" onClick={() => window.location.reload()}>
              <RotateCcw className="h-4 w-4" /> Дахин оролдох
            </Button>
          </motion.div>
        )}

        {view === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="ce-panel p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15">
              <BrainCircuit className="h-6 w-6 text-brand" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-semibold text-mist-50">
              {hadPartial ? 'Суралцах арга барил тодорхойлох ажил дутуу байна' : 'Суралцах арга барилаа тодорхойлоорой'}
            </h1>
            <p className="mt-2 text-sm leading-6 text-mist-300">
              {hadPartial
                ? 'Таны суралцах арга барил бүрэн тодорхойлогдоогүй тул үр дүн нь найдвартай бус байна. Дахин тодорхойлоод танд тохирсон зөвлөмжийг аваарай.'
                : 'Та хэрхэн хамгийн сайн суралцдагийг мэдвэл хичээлээ илүү үр дүнтэй зохион байгуулж чадна.'}
            </p>
            <ul className="mt-5 space-y-2 text-sm text-mist-400">
              <li>• {LEARNING_STYLE_QUESTIONS.length} богино асуулт, 5 орчим минут</li>
              <li>• Үр дүнг диаграмаар харуулна</li>
              <li>• Танд тохирох суралцах зөвлөмж өгнө</li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1 gap-2" onClick={() => setView('survey')}>
                Суралцах арга барил тодорхойлох <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => router.push(next)}>
                Дараа тодорхойлох
              </Button>
            </div>
          </motion.div>
        )}

        {view === 'survey' && (
          <motion.div key="survey" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="ce-panel p-6 sm:p-8">
            <LearningStyleSurvey
              answers={answers}
              onAnswersChange={setAnswers}
              onComplete={handleComplete}
              onBackAtStart={() => setView(profile?.learningStyleCompletedAt ? 'result' : 'intro')}
            />
            {saving && <p className="mt-4 text-center text-xs text-mist-400">Хадгалж байна…</p>}
            {saveError && (
              <div className="mt-4 flex flex-col items-center gap-3 text-sm text-red-400">
                {saveError}
                <Button variant="secondary" isLoading={saving} onClick={() => handleComplete(answers as LearningStyle[])}>
                  Дахин хадгалах
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {view === 'result' && scores && profile?.dominantLearningStyle && (
          <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="ce-panel p-6 sm:p-8">
            <h1 className="mb-1 font-display text-2xl font-semibold text-mist-50">Таны суралцах арга барил</h1>
            <p className="mb-6 text-sm text-mist-400">Таны хариултад тулгуурлан танд тохирох зөвлөмжийг бэлдлээ</p>

            <LearningStyleResult scores={scores} dominant={profile.dominantLearningStyle} />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                className="flex-1 gap-2"
                onClick={() => {
                  setAnswers(emptyLearningStyleAnswers());
                  setView('survey');
                }}
              >
                <RotateCcw className="h-4 w-4" /> Дахин тодорхойлох
              </Button>
              <Button className="flex-1 gap-2" onClick={() => router.push(next)}>
                Үргэлжлүүлэх <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LearningStylePage() {
  return (
    <Suspense fallback={null}>
      <LearningStylePageInner />
    </Suspense>
  );
}
