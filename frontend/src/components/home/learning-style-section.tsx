"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BrainCircuit, CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { submitLearningStyle } from "@/lib/services";
import {
  computeLearningStyle,
  LEARNING_STYLES,
  LEARNING_STYLE_LABELS,
  LEARNING_STYLE_QUESTIONS,
  LEARNING_STYLE_TIPS,
  type LearningStyle,
  type LearningStyleScores,
} from "@/lib/learning-style";
import { LearningStyleChart } from "@/components/onboarding/learning-style-chart";
import { LearningStyleResult } from "@/components/onboarding/learning-style-result";
import { emptyLearningStyleAnswers, LearningStyleSurvey } from "@/components/onboarding/learning-style-survey";
import { cn } from "@/lib/utils";

/** Нүүр хуудсанд харуулах жишээ үр дүн (8 асуултын бодит боломжит оноо) */
const SAMPLE_SCORES: Record<LearningStyle, LearningStyleScores> = {
  VISUAL: { VISUAL: 50, AUDITORY: 13, READING_WRITING: 25, KINESTHETIC: 13 },
  AUDITORY: { VISUAL: 13, AUDITORY: 63, READING_WRITING: 13, KINESTHETIC: 13 },
  READING_WRITING: { VISUAL: 25, AUDITORY: 0, READING_WRITING: 50, KINESTHETIC: 25 },
  KINESTHETIC: { VISUAL: 13, AUDITORY: 25, READING_WRITING: 0, KINESTHETIC: 63 },
};

type SurveyView = "intro" | "survey" | "result";

export function LearningStyleSection() {
  const user = useAuthStore((s) => s.user);

  const [sample, setSample] = useState<LearningStyle>("VISUAL");
  const [view, setView] = useState<SurveyView>("intro");
  const [answers, setAnswers] = useState<(LearningStyle | null)[]>(emptyLearningStyleAnswers);
  const [result, setResult] = useState<{ scores: LearningStyleScores; dominant: LearningStyle } | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleComplete(all: LearningStyle[]) {
    setResult(computeLearningStyle(all));
    setView("result");
    if (!user) return;
    setSaveState("saving");
    try {
      await submitLearningStyle(all);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function restart() {
    setAnswers(emptyLearningStyleAnswers());
    setResult(null);
    setSaveState("idle");
    setView("survey");
  }

  const sampleInfo = LEARNING_STYLE_LABELS[sample];

  return (
    <section id="learning-style" className="border-t border-ink-700 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs uppercase tracking-widest text-brand">Суралцах арга барил</p>
        <h2 className="mb-4 font-display text-3xl font-semibold text-mist-50">Та ямар аргаар хамгийн сайн сурдаг вэ?</h2>
        <p className="mb-12 max-w-2xl text-mist-300">
          Хүн бүр өөр өөрөөр суралцдаг. Харах, сонсох, унших-бичих, үйлдлээр туршиж үзэх гэсэн 4 арга барилаас аль нь танд илүү хөгжсөнийг
          мэдвэл хичээлээ хамаагүй үр дүнтэй зохион байгуулна.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Жишээ график */}
          <div className="rounded-2xl border border-ink-700 bg-ink-800 p-6">
            <p className="mb-1 text-xs uppercase tracking-widest text-mist-500">Жишээ үр дүн</p>
            <h3 className="mb-4 font-display text-lg font-semibold text-mist-50">Тодорхойлсны дараа ийм график гарна</h3>

            <div role="tablist" aria-label="Жишээ арга барил" className="mb-4 flex flex-wrap gap-2">
              {LEARNING_STYLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  aria-selected={sample === s}
                  onClick={() => setSample(s)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    sample === s
                      ? "border-brand bg-brand/15 text-brand"
                      : "border-ink-600 text-mist-300 hover:border-ink-500 hover:text-mist-50",
                  )}
                >
                  {LEARNING_STYLE_LABELS[s].emoji} {LEARNING_STYLE_LABELS[s].short}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={sample}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mx-auto w-full max-w-[360px]">
                  <LearningStyleChart scores={SAMPLE_SCORES[sample]} />
                </div>

                <div className="mt-4">
                  <p className="font-display text-base font-semibold text-mist-50">
                    {sampleInfo.emoji} {sampleInfo.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-mist-300">{sampleInfo.desc}</p>
                </div>

                <div className="mt-4 rounded-xl border border-brand/20 bg-brand/5 p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-mist-50">
                    <Lightbulb className="h-4 w-4 text-brand" /> Ийм хүнд өгөх зөвлөмж
                  </p>
                  <ul className="space-y-1.5">
                    {LEARNING_STYLE_TIPS[sample].slice(0, 3).map((t) => (
                      <li key={t} className="flex gap-2 text-sm leading-6 text-mist-300">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Суралцах арга барил тодорхойлох */}
          <div className="rounded-2xl border border-ink-700 bg-ink-800 p-6">
            <AnimatePresence mode="wait">
              {view === "intro" && (
                <motion.div key="intro" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15">
                    <BrainCircuit className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-mist-50">
                    5 минут зарцуулаад суралцах арга барилаа тодорхойл
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-mist-300">
                    {LEARNING_STYLE_QUESTIONS.length} богино асуултад хариулаад өөрийн графикийг харж, танд тохирох суралцах зөвлөмж
                    аваарай.{" "}
                    {user
                      ? "Үр дүн таны профайлд хадгалагдана."
                      : "Эхлээд судалгаагаа бөглөөд, бүртгүүлснээр үр дүн тань профайлд хадгалагдана."}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {LEARNING_STYLES.map((s) => (
                      <div key={s} className="rounded-xl border border-ink-600 bg-ink-900/60 p-3">
                        <p className="text-xl">{LEARNING_STYLE_LABELS[s].emoji}</p>
                        <p className="mt-1 text-sm font-medium text-mist-100">{LEARNING_STYLE_LABELS[s].short}</p>
                      </div>
                    ))}
                  </div>

                  {user ? (
                    <button
                      type="button"
                      onClick={() => setView("survey")}
                      className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-hover"
                    >
                      Суралцах арга барил тодорхойлох <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/onboarding"
                        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-hover"
                      >
                        Суралцах арга барил тодорхойлох <ArrowRight className="h-4 w-4" />
                      </Link>
                    </>
                  )}
                </motion.div>
              )}

              {view === "survey" && (
                <motion.div key="survey" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <LearningStyleSurvey
                    answers={answers}
                    onAnswersChange={setAnswers}
                    onComplete={handleComplete}
                    onBackAtStart={() => setView("intro")}
                  />
                </motion.div>
              )}

              {view === "result" && result && (
                <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <h3 className="mb-4 font-display text-xl font-semibold text-mist-50">Таны суралцах арга барил</h3>
                  <LearningStyleResult scores={result.scores} dominant={result.dominant} compact />

                  {user && (
                    <p className={cn("mt-5 flex items-center gap-2 text-sm", saveState === "error" ? "text-red-400" : "text-mist-300")}>
                      {saveState === "saved" && <CheckCircle2 className="h-4 w-4 text-success" />}
                      {saveState === "saving" && "Профайлд хадгалж байна…"}
                      {saveState === "saved" && "Үр дүн таны профайлд хадгалагдлаа"}
                      {saveState === "error" && "Хадгалж чадсангүй. Профайлаас дахин тодорхойлно уу."}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={restart}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm text-mist-300 transition-colors hover:bg-ink-700 hover:text-mist-50"
                  >
                    <RotateCcw className="h-4 w-4" /> Дахин тодорхойлох
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
