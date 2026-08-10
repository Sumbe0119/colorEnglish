'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Briefcase, GraduationCap, Plane, Coffee,
  Tv, TrendingUp, Sparkles, ChevronRight, Check
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Goal = { id: string; label: string; icon: React.ReactNode; desc: string };
type Level = { code: string; label: string; desc: string; emoji: string };

const GOALS: Goal[] = [
  { id: 'TRAVEL', label: 'Аялал', icon: <Plane className="h-5 w-5" />, desc: 'Гадаадад аялахад' },
  { id: 'WORK_CAREER', label: 'Ажил, карьер', icon: <Briefcase className="h-5 w-5" />, desc: 'Ажлын орчинд' },
  { id: 'EXAM_IELTS_TOEFL', label: 'IELTS / TOEFL', icon: <GraduationCap className="h-5 w-5" />, desc: 'Шалгалтанд бэлдэх' },
  { id: 'DAILY_CONVERSATION', label: 'Өдөр тутмын яриа', icon: <Coffee className="h-5 w-5" />, desc: 'Чөлөөтэй харилцах' },
  { id: 'MOVIES_SERIES', label: 'Кино, цуврал', icon: <Tv className="h-5 w-5" />, desc: 'Subtitle гаргахгүйгээр' },
  { id: 'STUDY_ABROAD', label: 'Гадаадад суралцах', icon: <BookOpen className="h-5 w-5" />, desc: 'Их сургуульд элсэх' },
  { id: 'BUSINESS', label: 'Бизнес', icon: <TrendingUp className="h-5 w-5" />, desc: 'Мэргэжлийн анги' },
  { id: 'OTHER', label: 'Бусад', icon: <Sparkles className="h-5 w-5" />, desc: 'Өөр зорилгоор' },
];

const LEVELS: Level[] = [
  { code: 'A1', label: 'A1 — Анхан шат', emoji: '🌱', desc: 'Англи хэлийг ойлгодоггүй / зүгээр л эхэлж байна' },
  { code: 'A2', label: 'A2 — Дунд анхан', emoji: '🌿', desc: 'Зарим үг мэддэг, энгийн өгүүлбэр зохиож чаддаг' },
  { code: 'B1', label: 'B1 — Дунд шат', emoji: '🌳', desc: 'Өдөр тутмын ярианд хэсэгчлэн оролцож чаддаг' },
  { code: 'B1_PLUS', label: 'B1+ — Дунд дэвшсэн', emoji: '🎯', desc: 'Нилээд чөлөөтэй ярьдаг, дүрмийн алдаа гарна' },
  { code: 'B2', label: 'B2 — Ахисан дунд', emoji: '🚀', desc: 'Ихэнх нөхцөлд чөлөөтэй харилцаж чаддаг' },
];

const STEPS = ['Зорилго', 'Түвшин', 'Хугацаа'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const [level, setLevel] = useState<string>('');
  const [dailyMins, setDailyMins] = useState(30);
  const [saving, setSaving] = useState(false);

  function toggleGoal(id: string) {
    setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));
  }

  async function finish() {
    setSaving(true);
    try {
      await api.post('/profile/onboarding', {
        interests: goals,
        selfAssessedLevel: level,
        dailyGoalMinutes: dailyMins,
      });
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Logo */}
      <div className="p-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-ink-950 font-display font-bold text-sm">C</span>
          <span className="font-display text-lg font-semibold text-mist-50">Color<span className="text-brand">English</span></span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-xl">
          {/* Progress */}
          <div className="mb-10">
            <div className="mb-4 flex justify-between">
              {STEPS.map((s, i) => (
                <span key={s} className={cn('text-xs font-medium', i === step ? 'text-brand' : i < step ? 'text-success' : 'text-mist-400')}>
                  {i < step ? '✓ ' : ''}{s}
                </span>
              ))}
            </div>
            <div className="h-1 rounded-full bg-ink-700">
              <motion.div
                className="h-1 rounded-full bg-brand"
                animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 0: Goals */}
            {step === 0 && (
              <motion.div key="goals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="mb-1 font-display text-2xl font-semibold text-mist-50">Яагаад сурах гэж байна вэ?</h1>
                <p className="mb-7 text-sm text-mist-400">Хэд хэдэн зорилго сонгож болно</p>
                <div className="grid grid-cols-2 gap-3">
                  {GOALS.map((g) => {
                    const selected = goals.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleGoal(g.id)}
                        className={cn(
                          'flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200',
                          selected ? 'border-brand bg-brand/10 text-mist-50' : 'border-ink-600 bg-ink-800 text-mist-200 hover:border-ink-500',
                        )}
                      >
                        <span className={cn('mt-0.5 shrink-0', selected ? 'text-brand' : 'text-mist-400')}>{g.icon}</span>
                        <div>
                          <p className="text-sm font-medium">{g.label}</p>
                          <p className="text-xs text-mist-400">{g.desc}</p>
                        </div>
                        {selected && <Check className="ml-auto h-4 w-4 shrink-0 text-brand" />}
                      </button>
                    );
                  })}
                </div>
                <Button
                  className="mt-8 w-full gap-2"
                  disabled={goals.length === 0}
                  onClick={() => setStep(1)}
                >
                  Үргэлжлүүлэх <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Step 1: Level */}
            {step === 1 && (
              <motion.div key="level" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="mb-1 font-display text-2xl font-semibold text-mist-50">Одоогийн түвшингөө тодорхойл</h1>
                <p className="mb-7 text-sm text-mist-400">Санаа зовох хэрэггүй — дараа нь шалгалтаар дахин тогтооно</p>
                <div className="space-y-3">
                  {LEVELS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLevel(l.code)}
                      className={cn(
                        'flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-200',
                        level === l.code ? 'border-brand bg-brand/10' : 'border-ink-600 bg-ink-800 hover:border-ink-500',
                      )}
                    >
                      <span className="text-2xl">{l.emoji}</span>
                      <div className="flex-1">
                        <p className={cn('text-sm font-medium', level === l.code ? 'text-mist-50' : 'text-mist-200')}>{l.label}</p>
                        <p className="text-xs text-mist-400">{l.desc}</p>
                      </div>
                      {level === l.code && <Check className="h-4 w-4 text-brand" />}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(0)} className="flex-1">Буцах</Button>
                  <Button disabled={!level} onClick={() => setStep(2)} className="flex-1 gap-2">
                    Үргэлжлүүлэх <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Daily goal */}
            {step === 2 && (
              <motion.div key="time" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="mb-1 font-display text-2xl font-semibold text-mist-50">Өдөрт хэдэн минут зориулах вэ?</h1>
                <p className="mb-10 text-sm text-mist-400">Тогтвортой байх нь хамгийн чухал — өдөрт 30 минут хангалттай</p>
                <div className="flex flex-col items-center gap-6">
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-brand/20 bg-ink-800">
                    <div className="text-center">
                      <p className="font-display text-4xl font-semibold text-brand">{dailyMins}</p>
                      <p className="text-xs text-mist-400">минут</p>
                    </div>
                  </div>
                  <input
                    type="range" min={10} max={90} step={5} value={dailyMins}
                    onChange={(e) => setDailyMins(Number(e.target.value))}
                    className="w-full accent-brand"
                  />
                  <div className="flex w-full justify-between text-xs text-mist-400">
                    <span>10 мин</span><span>30 мин</span><span>60 мин</span><span>90 мин</span>
                  </div>
                </div>

                <div className="mt-10 rounded-xl border border-ink-600 bg-ink-800 px-5 py-4 text-sm text-mist-300">
                  {dailyMins <= 20 ? '🌱 Жижиг алхам — тогтвортой байх нь хамгийн чухал' :
                   dailyMins <= 40 ? '🎯 Хамгийн тохиромжтой ачаалал' :
                   '🚀 Хурдан ахих — анхаарлаа сарниулахгүй байгаарай'}
                </div>

                <div className="mt-8 flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Буцах</Button>
                  <Button onClick={finish} isLoading={saving} className="flex-1">
                    Эхлэх 🎉
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
