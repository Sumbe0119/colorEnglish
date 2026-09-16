"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Plane,
  Coffee,
  Tv,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Check,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api-error";
import { completeOnboarding } from "@/lib/services";
import { useAuthStore } from "@/store/auth-store";
import type { LevelCode } from "@/types/api";
import { LEARNING_STYLE_QUESTIONS, type LearningStyle } from "@/lib/learning-style";
import {
  clearOnboardingDraft,
  consumeOnboardingHandoff,
  isOnboardingDraftComplete,
  loadOnboardingDraft,
  markOnboardingHandoff,
  saveOnboardingDraft,
  type OnboardingDraft,
  type OnboardingStep,
} from "@/lib/onboarding-draft";
import { emptyLearningStyleAnswers, LearningStyleSurvey } from "@/components/onboarding/learning-style-survey";
import { RegisterForm } from "@/components/auth/register-form";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

type Goal = { id: string; label: string; icon: React.ReactNode; desc: string };
type Level = { code: LevelCode; label: string; desc: string; emoji: string };
type SubmitPayload = {
  interests: string[];
  selfAssessedLevel: LevelCode;
  dailyGoalMinutes: number;
  learningStyleAnswers: LearningStyle[];
};

const GOALS: Goal[] = [
  { id: "TRAVEL", label: "Аялал", icon: <Plane className="h-5 w-5" />, desc: "Гадаадад аялахад" },
  { id: "WORK_CAREER", label: "Ажил, карьер", icon: <Briefcase className="h-5 w-5" />, desc: "Ажлын орчинд" },
  { id: "EXAM_IELTS_TOEFL", label: "IELTS / TOEFL", icon: <GraduationCap className="h-5 w-5" />, desc: "Шалгалтанд бэлдэх" },
  { id: "DAILY_CONVERSATION", label: "Өдөр тутмын яриа", icon: <Coffee className="h-5 w-5" />, desc: "Чөлөөтэй харилцах" },
  { id: "MOVIES_SERIES", label: "Кино, цуврал", icon: <Tv className="h-5 w-5" />, desc: "Subtitle гаргахгүйгээр" },
  { id: "STUDY_ABROAD", label: "Гадаадад суралцах", icon: <BookOpen className="h-5 w-5" />, desc: "Их сургуульд элсэх" },
  { id: "BUSINESS", label: "Бизнес", icon: <TrendingUp className="h-5 w-5" />, desc: "Мэргэжлийн анги" },
  { id: "OTHER", label: "Бусад", icon: <Sparkles className="h-5 w-5" />, desc: "Өөр зорилгоор" },
];

const LEVELS: Level[] = [
  { code: "A1", label: "A1 — Анхан шат", emoji: "🌱", desc: "Англи хэлийг ойлгодоггүй / зүгээр л эхэлж байна" },
  { code: "A2", label: "A2 — Дунд анхан", emoji: "🌿", desc: "Зарим үг мэддэг, энгийн өгүүлбэр зохиож чаддаг" },
  { code: "B1", label: "B1 — Дунд шат", emoji: "🌳", desc: "Өдөр тутмын ярианд хэсэгчлэн оролцож чаддаг" },
  { code: "B1_PLUS", label: "B1+ — Дунд дэвшсэн", emoji: "🎯", desc: "Нилээд чөлөөтэй ярьдаг, дүрмийн алдаа гарна" },
  { code: "B2", label: "B2 — Ахисан дунд", emoji: "🚀", desc: "Ихэнх нөхцөлд чөлөөтэй харилцаж чаддаг" },
];

const STEP_LABELS: Record<OnboardingStep, string> = {
  goals: "Зорилго",
  level: "Түвшин",
  time: "Хугацаа",
  survey: "Арга барил",
  register: "Бүртгэл",
  result: "Үр дүн",
};

const ALL_STEPS: OnboardingStep[] = ["goals", "level", "time", "survey", "register", "result"];

/** Хадгалсан draft-аас үргэлжлүүлэх алхам — өмнөх алхмууд бөглөгдөөгүй бол тэр рүү буцаана */
function resumeStep(draft: OnboardingDraft, loggedIn: boolean): OnboardingStep {
  if (draft.interests.length === 0) return "goals";
  if (!draft.selfAssessedLevel) return "level";
  if (draft.step === "goals" || draft.step === "level" || draft.step === "time") return draft.step;
  if (!isOnboardingDraftComplete(draft) || loggedIn) return "survey";
  return "register";
}

function lastSurveyIndex(answers: (LearningStyle | null)[]) {
  const firstEmpty = answers.findIndex((a) => a === null);
  return firstEmpty === -1 ? LEARNING_STYLE_QUESTIONS.length - 1 : firstEmpty;
}

export default function OnboardingPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  // Эхлэхдээ нэвтрээгүй байсан бол судалгааны дараа бүртгэлийн алхам харуулна.
  // Бүртгүүлсний дараа ч алхмын жагсаалт өөрчлөгдөхгүй байхаар mount үеийн утгыг барина.
  const [needsAuth] = useState(() => !useAuthStore.getState().user);

  const [step, setStep] = useState<OnboardingStep>("goals");
  const [goals, setGoals] = useState<string[]>([]);
  const [level, setLevel] = useState<LevelCode | "">("");
  const [dailyMins, setDailyMins] = useState(30);
  const [answers, setAnswers] = useState<(LearningStyle | null)[]>(emptyLearningStyleAnswers);
  const [surveyStartIndex, setSurveyStartIndex] = useState(0);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  /** Хариулт хэрэглэгчийн профайлд хадгалагдсан эсэх */
  const [saved, setSaved] = useState(false);
  const [restored, setRestored] = useState(false);
  const restoreStarted = useRef(false);

  const answered = useMemo(() => answers.filter((a): a is LearningStyle => a !== null), [answers]);
  const surveyComplete = answered.length === LEARNING_STYLE_QUESTIONS.length;

  const steps = needsAuth ? ALL_STEPS : ALL_STEPS.filter((s) => s !== "register");
  const stepIndex = Math.max(0, steps.indexOf(step));
  const showSavePanel = step !== "result" && (saving || saveError !== null);

  function toggleGoal(id: string) {
    setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));
  }

  /** Хариултыг нэвтэрсэн хэрэглэгч дээр хадгалаад, "Үр дүн харах" (профайл руу) алхамд шилжинэ */
  async function submit(payload: SubmitPayload) {
    setSaving(true);
    setSaveError(null);
    try {
      await completeOnboarding(payload);
      clearOnboardingDraft();
      setSaved(true);
      setStep("result");
    } catch (err) {
      setSaveError(getApiErrorMessage(err, "Үр дүнг хадгалахад алдаа гарлаа. Дахин оролдоно уу."));
    } finally {
      setSaving(false);
    }
  }

  /** `all` — судалгааны onComplete-ээс ирсэн хариулт (setAnswers хараахан render болоогүй байж болно) */
  function currentPayload(all: LearningStyle[] = answered): SubmitPayload | null {
    if (!level || goals.length === 0 || all.length !== LEARNING_STYLE_QUESTIONS.length) return null;
    return {
      interests: goals,
      selfAssessedLevel: level,
      dailyGoalMinutes: dailyMins,
      learningStyleAnswers: all,
    };
  }

  function submitCurrent(all?: LearningStyle[]) {
    const payload = currentPayload(all);
    if (payload) void submit(payload);
  }

  function handleSurveyComplete(all: LearningStyle[]) {
    // Нэвтэрсэн бол шууд хадгална, үгүй бол үр дүнг харахын тулд бүртгүүлэх алхам руу
    if (user) {
      submitCurrent(all);
    } else {
      markOnboardingHandoff();
      setStep("register");
    }
  }

  function backToSurvey() {
    setSaveError(null);
    setSurveyStartIndex(LEARNING_STYLE_QUESTIONS.length - 1);
    setStep("survey");
  }

  // Бүртгүүлэх/нэвтрэхээс өмнө бөглөсөн хариултыг сэргээнэ
  useEffect(() => {
    if (restoreStarted.current) return;
    restoreStarted.current = true;

    const draft = loadOnboardingDraft();
    // Энэ таб дээр бүртгэлийн алхамаас нэвтрэх/баталгаажуулах руу гарсан эсвэл тэр и-мэйлээр бүртгүүлсэн бол
    // зочноор бөглөсөн хариулт энэ хэрэглэгчийнх гэж үзнэ
    const handoff = consumeOnboardingHandoff();
    const emailMatches = Boolean(
      user && draft?.pendingEmail && draft.pendingEmail.toLowerCase() === user.email.toLowerCase(),
    );
    const usable =
      draft &&
      (user
        ? draft.ownerId === user.id || (draft.ownerId === null && (handoff || emailMatches))
        : draft.ownerId === null);

    if (draft && !usable) {
      // Өөр хүний (эсвэл нотлох баримтгүй зочны) хариултыг энэ хэрэглэгч дээр ашиглахгүй
      clearOnboardingDraft();
    } else if (draft) {
      setGoals(draft.interests);
      setLevel(draft.selfAssessedLevel);
      setDailyMins(draft.dailyGoalMinutes);
      setAnswers(draft.learningStyleAnswers);
      setSurveyStartIndex(lastSurveyIndex(draft.learningStyleAnswers));

      if (user && draft.ownerId === null && draft.step === "register" && isOnboardingDraftComplete(draft) && draft.selfAssessedLevel) {
        // Судалгаагаа бөглөөд нэвтэрсэн / и-мэйлээ баталгаажуулсан — хариултыг тухайн хэрэглэгч дээр хадгална
        setStep("survey");
        void submit({
          interests: draft.interests,
          selfAssessedLevel: draft.selfAssessedLevel,
          dailyGoalMinutes: draft.dailyGoalMinutes,
          learningStyleAnswers: draft.learningStyleAnswers as LearningStyle[],
        });
      } else {
        const resume = resumeStep(draft, Boolean(user));
        if (!user && resume === "register") {
          markOnboardingHandoff();
          setRegisteredEmail(draft.pendingEmail);
        }
        setStep(resume);
      }
    }
    setRestored(true);
    // Зөвхөн mount үед нэг удаа сэргээнэ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Хуудас refresh хийсэн, бүртгүүлэхээр гарсан ч хариулт алдагдахгүй
  useEffect(() => {
    // Профайлд хадгалагдсаны дараа ("Буцах" дарсан ч) дахин draft үүсгэхгүй
    if (!restored || step === "result" || saved) return;
    if (goals.length === 0 && !level && answers.every((a) => a === null)) return;
    saveOnboardingDraft({
      interests: goals,
      selfAssessedLevel: level,
      dailyGoalMinutes: dailyMins,
      learningStyleAnswers: answers,
      step,
      ownerId: user?.id ?? null,
      pendingEmail: registeredEmail,
    });
  }, [restored, step, saved, goals, level, dailyMins, answers, user, registeredEmail]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Logo */}
      <div className="p-8">
        <Link href="/" className="relative block h-9 w-[160px]">
          <Image src="/logo/logo.png" alt="Color English" fill className="object-contain object-left" priority />
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-xl">
          {/* Progress */}
          <div className="mb-10">
            <div className="mb-4 hidden justify-between sm:flex">
              {steps.map((s, i) => (
                <span
                  key={s}
                  className={cn("text-xs font-medium", i === stepIndex ? "text-brand" : i < stepIndex ? "text-success" : "text-mist-400")}
                >
                  {i < stepIndex ? "✓ " : ""}
                  {STEP_LABELS[s]}
                </span>
              ))}
            </div>
            <div className="mb-4 flex justify-between text-xs font-medium sm:hidden">
              <span className="text-brand">{STEP_LABELS[steps[stepIndex]]}</span>
              <span className="text-mist-400">
                {stepIndex + 1} / {steps.length}
              </span>
            </div>
            <div className="h-1 rounded-full bg-ink-700">
              <motion.div
                className="h-1 rounded-full bg-brand"
                animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Хариултыг хэрэглэгч дээр хадгалж байна / алдаа */}
            {showSavePanel && (
              <motion.div key="saving" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {saving ? (
                  <div className="flex flex-col items-center py-16 text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                    <p className="mt-5 text-sm text-mist-300">Үр дүнг тань бэлдэж, профайлд хадгалж байна…</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center rounded-2xl border border-danger/30 bg-danger/10 px-6 py-10 text-center">
                    <AlertCircle className="h-8 w-8 text-danger" />
                    <p className="mt-4 text-sm text-mist-200">{saveError}</p>
                    <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
                      <Button variant="secondary" onClick={backToSurvey} className="flex-1">
                        Буцах
                      </Button>
                      <Button onClick={() => submitCurrent()} disabled={!currentPayload()} className="flex-1 gap-2">
                        <RotateCcw className="h-4 w-4" /> Дахин оролдох
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step: Goals */}
            {!showSavePanel && step === "goals" && (
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
                          "flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200",
                          selected
                            ? "border-brand bg-brand/10 text-mist-50"
                            : "border-ink-600 bg-ink-800 text-mist-200 hover:border-ink-500",
                        )}
                      >
                        <span className={cn("mt-0.5 shrink-0", selected ? "text-brand" : "text-mist-400")}>{g.icon}</span>
                        <div>
                          <p className="text-sm font-medium">{g.label}</p>
                          <p className="text-xs text-mist-400">{g.desc}</p>
                        </div>
                        {selected && <Check className="ml-auto h-4 w-4 shrink-0 text-brand" />}
                      </button>
                    );
                  })}
                </div>
                <Button className="mt-8 w-full gap-2" disabled={goals.length === 0} onClick={() => setStep("level")}>
                  Үргэлжлүүлэх <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Step: Level */}
            {!showSavePanel && step === "level" && (
              <motion.div key="level" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="mb-1 font-display text-2xl font-semibold text-mist-50">Одоогийн түвшингөө тодорхойл</h1>
                <p className="mb-7 text-sm text-mist-400">Санаа зовох хэрэггүй — дараа нь шалгалтаар дахин тогтооно</p>
                <div className="space-y-3">
                  {LEVELS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLevel(l.code)}
                      className={cn(
                        "flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-200",
                        level === l.code ? "border-brand bg-brand/10" : "border-ink-600 bg-ink-800 hover:border-ink-500",
                      )}
                    >
                      <span className="text-2xl">{l.emoji}</span>
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium", level === l.code ? "text-mist-50" : "text-mist-200")}>{l.label}</p>
                        <p className="text-xs text-mist-400">{l.desc}</p>
                      </div>
                      {level === l.code && <Check className="h-4 w-4 text-brand" />}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex gap-3">
                  <Button variant="secondary" onClick={() => setStep("goals")} className="flex-1">
                    Буцах
                  </Button>
                  <Button disabled={!level} onClick={() => setStep("time")} className="flex-1 gap-2">
                    Үргэлжлүүлэх <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step: Daily goal */}
            {!showSavePanel && step === "time" && (
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
                    type="range"
                    min={10}
                    max={90}
                    step={5}
                    value={dailyMins}
                    onChange={(e) => setDailyMins(Number(e.target.value))}
                    className="w-full accent-brand"
                  />
                  <div className="flex w-full justify-between text-xs text-mist-400">
                    <span>10 мин</span>
                    <span>30 мин</span>
                    <span>60 мин</span>
                    <span>90 мин</span>
                  </div>
                </div>

                <div className="mt-10 rounded-xl border border-ink-600 bg-ink-800 px-5 py-4 text-sm text-mist-300">
                  {dailyMins <= 20
                    ? "🌱 Жижиг алхам — тогтвортой байх нь хамгийн чухал"
                    : dailyMins <= 40
                      ? "🎯 Хамгийн тохиромжтой ачаалал"
                      : "🚀 Хурдан ахих — анхаарлаа сарниулахгүй байгаарай"}
                </div>

                <div className="mt-8 flex gap-3">
                  <Button variant="secondary" onClick={() => setStep("level")} className="flex-1">
                    Буцах
                  </Button>
                  <Button
                    onClick={() => {
                      setSurveyStartIndex(
                        Math.max(
                          0,
                          answers.findIndex((a) => a === null),
                        ),
                      );
                      setStep("survey");
                    }}
                    className="flex-1 gap-2"
                  >
                    Үргэлжлүүлэх <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step: Learning style survey */}
            {!showSavePanel && step === "survey" && (
              <motion.div key="style" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <LearningStyleSurvey
                  answers={answers}
                  onAnswersChange={setAnswers}
                  onComplete={handleSurveyComplete}
                  onBackAtStart={() => setStep("time")}
                  initialIndex={surveyStartIndex}
                />
                {/* Бүх асуултад хариулсан хэрэглэгч буцаж ирээд хариултаа өөрчлөхгүйгээр үргэлжлүүлэх */}
                {surveyComplete && (
                  <Button onClick={() => handleSurveyComplete(answered)} className="mt-3 w-full gap-2">
                    Үргэлжлүүлэх <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            )}

            {/* Step: Register — үр дүнгээ харахын тулд бүртгүүлнэ */}
            {!showSavePanel && step === "register" && (
              <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {user ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <h1 className="font-display text-2xl font-semibold text-mist-50">Бүртгэл тань үүслээ</h1>
                    <p className="mt-2 text-sm text-mist-400">Хариултуудаа профайлдаа хадгалаад үр дүнгээ хараарай</p>
                    <Button onClick={() => submitCurrent()} disabled={!currentPayload()} className="mt-8 w-full gap-2">
                      Хариултаа хадгалах <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto w-full max-w-sm">
                      {registeredEmail ? (
                        // VerifyEmailForm нь useSearchParams ашигладаг
                        <Suspense fallback={null}>
                          <VerifyEmailForm
                            email={registeredEmail}
                            onVerified={() => submitCurrent()}
                            onBack={() => setRegisteredEmail(null)}
                          />
                        </Suspense>
                      ) : (
                        <>
                          <RegisterForm
                            title="Бүртгүүлэх"
                            subtitle="Та 2 минутын дотор бүртгэлээ үүсгээд өөрийн суралцах арга барилаа хараарай."
                            onRegistered={setRegisteredEmail}
                          />
                          <p className="mt-4 text-center text-sm text-mist-400">
                            Бүртгэлтэй юу?{" "}
                            <Link href="/login?next=/onboarding" className="text-brand hover:text-brand-hover">
                              Нэвтрэх
                            </Link>
                          </p>
                        </>
                      )}

                      <Button variant="ghost" onClick={backToSurvey} className="mt-4 w-full">
                        Хариултаа өөрчлөх
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Step: Result — хариулт хэрэглэгч дээр хадгалагдсан; үр дүнг профайлаас харна */}
            {step === "result" && saved && (
              <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15">
                    <CheckCircle2 className="h-7 w-7 text-success" />
                  </span>
                  <h1 className="mt-5 font-display text-2xl font-semibold text-mist-50">Суралцах арга барил тань тодорхойлогдлоо</h1>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-mist-400">
                    Хариултууд тань профайлд хадгалагдлаа. Үр дүн болон танд тохирох зөвлөмжийг профайл хэсгээс хараарай.
                  </p>
                  <Button onClick={() => router.push("/profile#learning-style")} className="mt-8 w-full gap-2">
                    Үр дүн харах <ChevronRight className="h-4 w-4" />
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
