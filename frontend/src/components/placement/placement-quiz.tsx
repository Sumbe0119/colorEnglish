// frontend/src/components/placement/placement-quiz.tsx
'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpenText, Check, Clock3, Flag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';
import {
  formatDuration,
  PLACEMENT_SKILL_LABELS,
  savePlacementDraft,
  type PlacementDraft,
  type PlacementQuestion,
} from '@/lib/placement-services';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

type Props = {
  questions: PlacementQuestion[];
  version: number;
  /** Үргэлжлүүлэх үед өмнөх хариултууд */
  initialDraft?: PlacementDraft | null;
  onFinish: (answers: Record<string, number>, durationSec: number) => void;
  /** Тестээс гарах — хариулт төхөөрөмж дээр хадгалагдсан хэвээр үлдэнэ */
  onExit: () => void;
};

/** "___"-ийг тодруулсан хоосон зай болгон харуулна */
function PromptText({ text }: { text: string }) {
  const parts = text.split('___');
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="mx-1 inline-block min-w-[3.5rem] border-b-2 border-brand/70 align-baseline text-brand" aria-label="хоосон зай">
              &nbsp;
            </span>
          )}
        </Fragment>
      ))}
    </>
  );
}

export function PlacementQuiz({ questions, version, initialDraft, onFinish, onExit }: Props) {
  const total = questions.length;
  const [index, setIndex] = useState(() =>
    initialDraft ? Math.min(Math.max(0, initialDraft.index), total - 1) : 0,
  );
  const [answers, setAnswers] = useState<Record<string, number>>(() => initialDraft?.answers ?? {});
  const [confirmFinish, setConfirmFinish] = useState(false);
  const startedAtRef = useRef(Date.now() - (initialDraft?.elapsedSec ?? 0) * 1000);
  const [elapsedSec, setElapsedSec] = useState(initialDraft?.elapsedSec ?? 0);

  const question = questions[index];
  const chosen = question ? answers[question.id] : undefined;
  const answeredCount = useMemo(
    () => questions.reduce((n, q) => n + (answers[q.id] !== undefined ? 1 : 0), 0),
    [answers, questions],
  );
  const isLast = index === total - 1;

  // Хугацаа
  useEffect(() => {
    const t = window.setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  // Хариулт / байрлал өөрчлөгдөх бүрт төхөөрөмж дээр хадгална
  useEffect(() => {
    savePlacementDraft({
      version,
      answers,
      index,
      elapsedSec: Math.floor((Date.now() - startedAtRef.current) / 1000),
      updatedAt: new Date().toISOString(),
    });
  }, [answers, index, version]);

  const choose = useCallback(
    (optionIndex: number) => {
      if (!question) return;
      setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
    },
    [question],
  );

  const finish = useCallback(() => {
    onFinish(answers, Math.floor((Date.now() - startedAtRef.current) / 1000));
  }, [answers, onFinish]);

  const goNext = useCallback(() => {
    if (isLast) {
      if (answeredCount < total) setConfirmFinish(true);
      else finish();
      return;
    }
    setIndex((i) => Math.min(total - 1, i + 1));
  }, [isLast, answeredCount, total, finish]);

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));

  // Гар: 1–4 / A–D сонгох, Enter → дараах, ←/→ шилжих
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (confirmFinish) return;
      if (event.key === 'Enter') {
        if (chosen !== undefined) goNext();
        return;
      }
      if (event.key === 'ArrowRight') {
        if (!isLast) setIndex((i) => Math.min(total - 1, i + 1));
        return;
      }
      if (event.key === 'ArrowLeft') {
        setIndex((i) => Math.max(0, i - 1));
        return;
      }
      const digit = /^[1-6]$/.test(event.key)
        ? Number(event.key) - 1
        : /^[a-fA-F]$/.test(event.key)
          ? event.key.toUpperCase().charCodeAt(0) - 65
          : -1;
      if (digit >= 0 && question && question.options[digit] !== undefined) choose(digit);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [chosen, choose, confirmFinish, goNext, isLast, question, total]);

  if (!question) return null;

  const progress = (answeredCount / total) * 100;

  return (
    <div className="ce-panel p-5 sm:p-8">
      {/* Толгой: явц + хугацаа + гарах */}
      <div className="mb-5 flex items-center justify-between gap-3 text-xs text-mist-400">
        <span className="font-medium text-mist-200">
          Асуулт {index + 1} <span className="text-mist-500">/ {total}</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 tabular-nums" title="Зарцуулсан хугацаа">
            <Clock3 className="h-3.5 w-3.5" /> {formatDuration(elapsedSec)}
          </span>
          <button
            type="button"
            onClick={onExit}
            className="rounded-lg p-1.5 text-mist-400 transition-colors hover:bg-ink-800 hover:text-mist-50"
            aria-label="Тестээс түр гарах"
            title="Түр гарах — хариулт хадгалагдана"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-ink-800">
        <motion.div
          className="h-full rounded-full bg-brand"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
        >
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-ink-600 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-mist-400">
            {question.skill === 'READING' && <BookOpenText className="h-3 w-3" />}
            {PLACEMENT_SKILL_LABELS[question.skill]}
          </p>

          {question.passage && (
            <div className="mb-4 rounded-xl border border-ink-600 bg-ink-800/70 p-4">
              <p className="mb-1.5 text-[11px] uppercase tracking-wider text-mist-500">Эхийг уншаад асуултад хариулна уу</p>
              <p className="font-display text-sm leading-7 text-mist-100 sm:text-[15px]">{question.passage}</p>
            </div>
          )}

          <p className="mb-5 font-display text-lg leading-relaxed text-mist-50 sm:text-xl">
            <PromptText text={question.prompt} />
          </p>

          <div className="space-y-2.5" role="radiogroup" aria-label="Хариултын сонголтууд">
            {question.options.map((opt, i) => {
              const selected = chosen === i;
              return (
                <button
                  key={`${question.id}-${i}`}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => choose(i)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-150 sm:text-[15px]',
                    selected
                      ? 'border-brand bg-brand/10 text-mist-50 shadow-glow'
                      : 'border-ink-600 bg-ink-800 text-mist-200 hover:border-ink-500 hover:bg-ink-700/80',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-xs',
                      selected ? 'border-brand bg-brand text-ink-950' : 'border-ink-500 text-mist-400',
                    )}
                  >
                    {LETTERS[i] ?? i + 1}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {selected && <Check className="h-4 w-4 shrink-0 text-brand" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center gap-3">
        <Button variant="secondary" onClick={goPrev} disabled={index === 0} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Буцах
        </Button>
        <div className="flex-1" />
        {isLast ? (
          <Button onClick={goNext} className="gap-2">
            <Flag className="h-4 w-4" /> Дуусгах
          </Button>
        ) : (
          <Button variant={chosen === undefined ? 'secondary' : 'primary'} onClick={goNext} className="gap-2">
            {chosen === undefined ? 'Алгасах' : 'Дараах'} <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="mt-3 text-center text-[11px] text-mist-500">
        {answeredCount}/{total} хариулсан · гар дээр 1–4 эсвэл A–D дарж сонгоно
      </p>

      <ConfirmDialog
        open={confirmFinish}
        title="Тестийг дуусгах уу?"
        description={`${total - answeredCount} асуулт хариулаагүй байна. Хариулаагүй асуулт буруу гэж тооцогдоно. Дуусгах уу, эсвэл буцаж хариулах уу?`}
        confirmLabel="Дуусгах"
        cancelLabel="Буцаж хариулах"
        onConfirm={() => {
          setConfirmFinish(false);
          finish();
        }}
        onCancel={() => {
          setConfirmFinish(false);
          const firstEmpty = questions.findIndex((q) => answers[q.id] === undefined);
          if (firstEmpty !== -1) setIndex(firstEmpty);
        }}
      />
    </div>
  );
}
