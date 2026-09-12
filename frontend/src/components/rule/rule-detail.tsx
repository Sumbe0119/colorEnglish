// frontend/src/components/rule/rule-detail.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Languages,
  Layers,
  Lightbulb,
  ListChecks,
  MessageCircle,
  Play,
  Quote,
  Sparkles,
  Square,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DialogueLine, GrammarRule } from '@/lib/grammar/types';
import { isMastered, type RuleProgress } from '@/lib/grammar/progress';
import { stripMarkup } from '@/lib/grammar/markup';
import { speakEnglish, stopSpeech } from '@/components/reading/reading-utils';
import {
  claimSpeech,
  ColoredSentence,
  ExampleRow,
  isSpeechOwner,
  releaseSpeech,
  SpeakButton,
} from '@/components/rule/colored-sentence';
import { StructureChips } from '@/components/rule/structure-chips';
import { Section } from '@/components/rule/section';

type Props = {
  rule: GrammarRule;
  index: number;
  total: number;
  showMn: boolean;
  progress?: RuleProgress;
  prevTitle?: string;
  nextTitle?: string;
  onPrev?: () => void;
  onNext?: () => void;
  onPractice: (ruleId: number) => void;
};

export function RuleDetail({
  rule,
  index,
  total,
  showMn,
  progress,
  prevTitle,
  nextTitle,
  onPrev,
  onNext,
  onPractice,
}: Props) {
  const number = String(rule.id).padStart(2, '0');
  const mastered = isMastered(progress);
  const separator = rule.structure.includes('+') ? '+' : '·';

  return (
    <motion.article
      key={rule.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="space-y-4"
    >
      {/* ── Толгой ─────────────────────────────────────────────── */}
      <header className="ce-panel relative overflow-hidden p-6 sm:p-8">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[120px] font-bold leading-none text-ink-700/40 sm:text-[160px]"
        >
          {number}
        </span>

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-brand/40 bg-brand/15 px-2 font-mono text-xs font-semibold text-brand">
              {number}
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-mist-400">
              Дүрэм {index + 1} / {total}
            </span>
            {mastered && (
              <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
                <CheckCircle2 className="h-3 w-3" /> Эзэмшсэн
              </span>
            )}
          </div>

          <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-mist-50 sm:text-3xl">
            {rule.title}
          </h2>
          <p className="mt-1.5 text-sm font-medium text-brand">{rule.titleMn}</p>

          <p className="mt-5 max-w-2xl font-display text-base leading-7 text-mist-100">{rule.hook}</p>

          <div className="mt-5 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3.5">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
              Товчхондоо
            </span>
            <p className="text-sm leading-6 text-mist-50">{rule.summary}</p>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-mist-300">{rule.description}</p>
        </div>
      </header>

      {/* ── Бүтэц + Санах арга ─────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
        <div className="ce-panel p-5">
          <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-mist-400">
            Үндсэн бүтэц
          </span>
          <StructureChips parts={rule.structureParts} separator={separator} />
          <code className="mt-3 block text-xs leading-5 text-mist-500">{rule.structure}</code>
        </div>

        <div className="ce-panel border-modifier/30 p-5">
          <span className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-modifier">
            <Lightbulb className="h-3.5 w-3.5" /> Санах арга
          </span>
          <p className="text-sm leading-6 text-mist-100">{rule.tip}</p>
        </div>
      </div>

      {/* ── Жишээ ──────────────────────────────────────────────── */}
      <Section icon={Quote} title="Жишээ өгүүлбэр" subtitle="Өнгө бүр өгүүлбэрийн нэг гишүүнийг заана">
        <div className="grid gap-2 sm:grid-cols-2">
          {rule.examples.map((example) => (
            <ExampleRow key={example.en} example={example} showMn={showMn} size="lg" />
          ))}
        </div>
      </Section>

      {/* ── Монгол хэлтэй харьцуулбал ──────────────────────────── */}
      <Section
        icon={Languages}
        title={rule.mongolianContrast.title}
        subtitle="Монгол хүний хамгийн их андуурдаг цэгүүд"
        tone="brand"
      >
        <ol className="space-y-3">
          {rule.mongolianContrast.points.map((point, i) => (
            <li key={point} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 font-mono text-[11px] font-semibold text-brand">
                {i + 1}
              </span>
              <p className="text-sm leading-6 text-mist-100">{point}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Хэзээ хэрэглэх вэ ──────────────────────────────────── */}
      <Section icon={ListChecks} title="Хэзээ хэрэглэх вэ?" subtitle={`${rule.useCases.length} тохиолдол`}>
        <div className="grid gap-3 md:grid-cols-2">
          {rule.useCases.map((useCase, i) => (
            <div key={useCase.title} className="ce-panel-muted p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink-700 font-mono text-[11px] font-semibold text-mist-200">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="font-display text-sm font-semibold text-mist-50">{useCase.title}</h4>
                  <p className="mt-1 text-xs leading-5 text-mist-400">{useCase.description}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                {useCase.examples.map((example) => (
                  <ExampleRow key={example.en} example={example} showMn={showMn} size="sm" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Хэлбэрүүд ──────────────────────────────────────────── */}
      <Section icon={Layers} title="Өгүүлбэрийн хэлбэрүүд" subtitle="Батлах, үгүйсгэх, асуух — бүгд нэг дор">
        <div className="space-y-3">
          {rule.forms.map((form) => (
            <div key={`${form.label}-${form.structure}`} className="ce-panel-muted p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md border border-brand/40 bg-brand/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
                  {form.label}
                </span>
                <code className="text-xs leading-5 text-mist-200">{form.structure}</code>
              </div>
              <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {form.examples.map((example) => (
                  <ExampleRow key={example.en} example={example} showMn={showMn} size="sm" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {rule.signalWords && rule.signalWords.length > 0 && (
          <div className="mt-4 border-t border-ink-700 pt-4">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-mist-400">
              Дохио үгс — эдгээрийг харвал энэ дүрмийг сана
            </span>
            <div className="flex flex-wrap gap-2">
              {rule.signalWords.map((word) => (
                <span
                  key={word}
                  className="rounded-full border border-modifier/40 bg-modifier/10 px-3 py-1 font-display text-xs text-modifier"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ── Яриа ───────────────────────────────────────────────── */}
      <DialogueSection lines={rule.dialogue} showMn={showMn} />

      {/* ── Анхаарах зүйлс ─────────────────────────────────────── */}
      <Section icon={Sparkles} title="Анхаарах зүйлс" subtitle="Жижиг боловч чухал нарийн ширийн">
        <ul className="space-y-2.5">
          {rule.notes.map((note) => (
            <li key={note} className="flex gap-3 text-sm leading-6 text-mist-200">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Түгээмэл алдаа ─────────────────────────────────────── */}
      <Section icon={AlertTriangle} title="Түгээмэл алдаа" subtitle="Ингэж бүү хэл — ингэж хэл" tone="danger">
        <div className="space-y-3">
          {rule.commonMistakes.map((mistake) => (
            <div key={mistake.wrong} className="ce-panel-muted border-danger/20 p-4">
              <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 font-display text-sm text-danger">
                  <span aria-hidden className="font-mono">×</span>
                  <span lang="en">{mistake.wrong}</span>
                </div>
                <ArrowRight className="hidden h-4 w-4 text-mist-500 sm:block" />
                <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 font-display text-sm text-success">
                  <span aria-hidden className="font-mono">✓</span>
                  <span lang="en" className="flex-1">
                    {mistake.correct}
                  </span>
                  <SpeakButton text={mistake.correct} className="border-success/30 text-success/80" />
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-mist-300">{mistake.explanation}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Шалгах CTA ─────────────────────────────────────────── */}
      <div className="ce-panel flex flex-wrap items-center justify-between gap-4 border-brand/30 p-5">
        <div>
          <p className="font-display text-sm font-semibold text-mist-50">Энэ дүрмийг ойлгосон уу?</p>
          <p className="mt-1 text-xs text-mist-400">
            {rule.quiz.length} асуулттай богино шалгалтаар бататгаарай.
            {progress && progress.total > 0 && (
              <span className="ml-2 text-mist-300">
                Шилдэг: {progress.best}/{progress.total}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onPractice(rule.id)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-colors hover:bg-brand-hover"
        >
          Өөрийгөө шалгах <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── Өмнөх / Дараагийн ──────────────────────────────────── */}
      <nav className="flex items-stretch justify-between gap-3" aria-label="Дүрэм хооронд шилжих">
        <button
          type="button"
          onClick={onPrev}
          disabled={!onPrev}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-ink-700 bg-ink-900/60 px-4 py-3 text-left transition-colors hover:border-ink-600 hover:bg-ink-800 disabled:invisible"
        >
          <ChevronLeft className="h-4 w-4 shrink-0 text-mist-500" />
          <span className="min-w-0">
            <span className="block text-[10px] uppercase tracking-[0.15em] text-mist-500">Өмнөх</span>
            <span className="block truncate font-display text-sm text-mist-200">{prevTitle}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!onNext}
          className="flex min-w-0 flex-1 items-center justify-end gap-2 rounded-xl border border-ink-700 bg-ink-900/60 px-4 py-3 text-right transition-colors hover:border-ink-600 hover:bg-ink-800 disabled:invisible"
        >
          <span className="min-w-0">
            <span className="block text-[10px] uppercase tracking-[0.15em] text-mist-500">Дараагийн</span>
            <span className="block truncate font-display text-sm text-mist-200">{nextTitle}</span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-mist-500" />
        </button>
      </nav>
    </motion.article>
  );
}

/** Бяцхан яриа — bubble хэлбэрээр, мөр мөрөөр эсвэл бүгдийг дараалуулж сонсох боломжтой. */
function DialogueSection({ lines, showMn }: { lines: DialogueLine[]; showMn: boolean }) {
  const [current, setCurrent] = useState<number | null>(null);
  const cancelled = useRef(false);
  const linesRef = useRef(lines);
  linesRef.current = lines;

  // Тогтвортой reset — өөр товч дуугарахад claimSpeech энэ функцийг дуудна.
  const reset = useRef(() => {
    cancelled.current = true;
    setCurrent(null);
  }).current;

  useEffect(() => {
    return () => {
      cancelled.current = true;
      if (isSpeechOwner(reset)) {
        releaseSpeech(reset);
        stopSpeech();
      }
    };
  }, [reset]);

  const playFrom = (i: number) => {
    if (cancelled.current) return;
    if (i >= linesRef.current.length) {
      releaseSpeech(reset);
      setCurrent(null);
      return;
    }
    setCurrent(i);
    void speakEnglish(stripMarkup(linesRef.current[i].en), {
      onEnd: () => {
        if (cancelled.current) return;
        window.setTimeout(() => playFrom(i + 1), 380);
      },
      onError: () => {
        if (cancelled.current) return;
        releaseSpeech(reset);
        setCurrent(null);
      },
    });
  };

  const playAll = () => {
    if (current !== null) {
      stopSpeech();
      releaseSpeech(reset);
      reset();
      return;
    }
    cancelled.current = false;
    claimSpeech(reset);
    playFrom(0);
  };

  const firstSpeaker = lines[0]?.speaker;

  return (
    <Section
      icon={MessageCircle}
      title="Амьд яриа"
      subtitle="Дүрэм бодит ярианд хэрхэн сонсогдох вэ"
      action={
        <button
          type="button"
          onClick={playAll}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
            current !== null
              ? 'border-brand/50 bg-brand/15 text-brand'
              : 'border-ink-600 bg-ink-800 text-mist-300 hover:border-brand/40 hover:text-brand',
          )}
        >
          {current !== null ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {current !== null ? 'Зогсоох' : 'Бүгдийг сонсох'}
        </button>
      }
    >
      <div className="space-y-2.5">
        {lines.map((line, i) => {
          const left = line.speaker === firstSpeaker;
          const active = current === i;
          return (
            <div key={`${line.speaker}-${i}`} className={cn('flex', left ? 'justify-start' : 'justify-end')}>
              <div
                className={cn(
                  'group max-w-[92%] rounded-2xl border px-4 py-3 transition-colors sm:max-w-[80%]',
                  left ? 'rounded-tl-md' : 'rounded-tr-md',
                  active
                    ? 'border-brand/50 bg-brand/15'
                    : left
                      ? 'border-ink-700 bg-ink-800/80'
                      : 'border-brand/20 bg-brand/[0.07]',
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className={cn('text-[10px] font-semibold uppercase tracking-[0.15em]', left ? 'text-mist-400' : 'text-brand')}>
                    {line.speaker}
                  </span>
                  <SpeakButton text={line.en} className="h-6 w-6 opacity-50 focus-visible:opacity-100 group-hover:opacity-100" />
                </div>
                <ColoredSentence en={line.en} className="text-sm leading-6 sm:text-base sm:leading-7" />
                {showMn && <p className="mt-1 text-xs leading-5 text-mist-400">{line.mn}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
