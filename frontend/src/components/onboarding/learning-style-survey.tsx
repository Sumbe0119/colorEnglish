'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LEARNING_STYLE_QUESTIONS, type LearningStyle } from '@/lib/learning-style';

type Props = {
  /** Өмнөх хариултууд (буцаж ирэхэд хадгалагдана) */
  answers: (LearningStyle | null)[];
  onAnswersChange: (answers: (LearningStyle | null)[]) => void;
  /** Сүүлийн асуултад хариулсны дараа дуудагдана — бүх хариулт бөглөгдсөн байна */
  onComplete: (answers: LearningStyle[]) => void;
  /** Эхний асуулт дээр "Буцах" дарахад */
  onBackAtStart?: () => void;
  initialIndex?: number;
  title?: string;
  subtitle?: string;
};

export function emptyLearningStyleAnswers(): (LearningStyle | null)[] {
  return LEARNING_STYLE_QUESTIONS.map(() => null);
}

export function LearningStyleSurvey({
  answers,
  onAnswersChange,
  onComplete,
  onBackAtStart,
  initialIndex = 0,
  title = 'Та хэрхэн сурах дуртай вэ?',
  subtitle = 'Зөв, буруу хариулт байхгүй. Өөрт хамгийн ойр сонголтоо сонгоорой',
}: Props) {
  const [qIndex, setQIndex] = useState(initialIndex);
  const total = LEARNING_STYLE_QUESTIONS.length;
  const q = LEARNING_STYLE_QUESTIONS[qIndex];
  const current = answers[qIndex];

  function answer(style: LearningStyle) {
    const wasEmpty = answers[qIndex] === null;
    const next = answers.map((a, i) => (i === qIndex ? style : a));
    onAnswersChange(next);

    // Дараагийн хариулаагүй асуулт руу шилжинэ; сүүлийн хоосон асуултыг бөглөхөд дуусгана
    const firstEmpty = next.findIndex((a) => a === null);
    if (firstEmpty === -1) {
      // Өмнө нь хариулсан асуултаа засаж байгаа бол судалгаанаас гаргахгүй — бусад хариултаа ч засах боломжтой
      if (wasEmpty) onComplete(next as LearningStyle[]);
      else if (qIndex < total - 1) setQIndex(qIndex + 1);
      return;
    }
    const nextEmptyAfter = next.findIndex((a, i) => i > qIndex && a === null);
    setQIndex(nextEmptyAfter !== -1 ? nextEmptyAfter : firstEmpty);
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold text-mist-50">{title}</h1>
      <p className="mb-6 text-sm text-mist-400">{subtitle}</p>

      <div className="mb-5 flex items-center justify-between text-xs text-mist-400">
        <span>
          Асуулт {qIndex + 1} / {total}
        </span>
        <div className="flex gap-1">
          {LEARNING_STYLE_QUESTIONS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Асуулт ${i + 1}`}
              disabled={!answers[i] && i !== qIndex}
              onClick={() => setQIndex(i)}
              className={cn(
                'h-1.5 w-4 rounded-full transition-colors',
                i === qIndex ? 'bg-brand' : answers[i] ? 'bg-success' : 'bg-ink-700',
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <p className="mb-4 text-base font-medium text-mist-50">{q.text}</p>
          <div className="space-y-2.5">
            {q.options.map((o) => {
              const selected = current === o.style;
              return (
                <button
                  key={o.style}
                  type="button"
                  onClick={() => answer(o.style)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-200',
                    selected
                      ? 'border-brand bg-brand/10 text-mist-50'
                      : 'border-ink-600 bg-ink-800 text-mist-200 hover:border-ink-500',
                  )}
                >
                  <span className="flex-1">{o.text}</span>
                  {selected && <Check className="h-4 w-4 shrink-0 text-brand" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex gap-3">
        {(qIndex > 0 || onBackAtStart) && (
          <Button
            variant="secondary"
            onClick={() => (qIndex > 0 ? setQIndex(qIndex - 1) : onBackAtStart?.())}
            className="flex-1"
          >
            Буцах
          </Button>
        )}
        {current && qIndex < total - 1 && (
          <Button variant="secondary" onClick={() => setQIndex(qIndex + 1)} className="flex-1 gap-2">
            Дараах <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
