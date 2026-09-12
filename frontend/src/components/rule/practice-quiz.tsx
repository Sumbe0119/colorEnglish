// frontend/src/components/rule/practice-quiz.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Check, Lightbulb, RotateCcw, Trophy, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GrammarRule, QuizKind, QuizQuestion } from '@/lib/grammar/types';
import { scoreByRule, shuffle } from '@/lib/grammar/quiz-utils';
import { SpeakButton } from '@/components/rule/colored-sentence';

const KIND_LABEL: Record<QuizKind, string> = {
  fill: 'Нөхөж бич',
  correct: 'Зөвийг ол',
  translate: 'Англиар хэл',
};

const KIND_PROMPT: Record<QuizKind, string> = {
  fill: 'Хоосон зайд аль үг тохирох вэ?',
  correct: 'Дөрвөөс зөв өгүүлбэрийг сонгоорой.',
  translate: 'Энэ өгүүлбэрийг англиар яаж хэлэх вэ?',
};

type Props = {
  questions: QuizQuestion[];
  title: string;
  subtitle?: string;
  rulesById: ReadonlyMap<number, GrammarRule>;
  onFinish: (answers: Record<string, string>) => void;
  onRestart: () => void;
  onExit: () => void;
  onStudy: (ruleId: number) => void;
};

export function PracticeQuiz({ questions, title, subtitle, rulesById, onFinish, onRestart, onExit, onStudy }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  // Сонголтуудыг нэг удаа холино — асуулт бүрт зөв хариулт өөр байрлалд.
  const shuffled = useMemo(
    () => questions.map((q) => ({ ...q, options: shuffle(q.options) })),
    [questions],
  );
  const question = shuffled[index];
  const isLast = index === shuffled.length - 1;
  const correctCount = shuffled.reduce((n, q) => n + (answers[q.id] === q.answer ? 1 : 0), 0);
  const progress = finished ? 100 : (index / shuffled.length) * 100;

  const choose = (option: string) => {
    if (selected || !question) return;
    setSelected(option);
    setAnswers((prev) => ({ ...prev, [question.id]: option }));
  };

  const next = () => {
    if (!selected) return;
    if (isLast) {
      setFinished(true);
      onFinish(answers);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setHintOpen(false);
  };

  // Гар: 1–4 / A–D сонгох, Enter дараагийнх руу.
  useEffect(() => {
    if (finished || !question) return;
    const handler = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (event.key === 'Enter') {
        if (selected) next();
        return;
      }
      const digit = /^[1-4]$/.test(event.key) ? Number(event.key) - 1 : /^[a-dA-D]$/.test(event.key) ? event.key.toUpperCase().charCodeAt(0) - 65 : -1;
      if (digit >= 0 && question.options[digit] !== undefined) choose(question.options[digit]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, question, selected, index]);

  if (!question) {
    return (
      <div className="ce-panel p-8 text-center text-sm text-mist-400">
        Асуулт олдсонгүй.
        <button type="button" onClick={onExit} className="ml-2 text-brand hover:underline">
          Буцах
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <QuizResult
        questions={shuffled}
        answers={answers}
        rulesById={rulesById}
        title={title}
        onRestart={onRestart}
        onExit={onExit}
        onStudy={onStudy}
      />
    );
  }

  const rule = rulesById.get(question.ruleId);
  const isCorrect = selected === question.answer;
  const correctSentence = question.kind === 'fill' ? question.question.replace('___', question.answer) : question.answer;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Толгой + явц */}
      <div className="mb-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 text-xs text-mist-400 transition-colors hover:text-mist-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Шалгалтын жагсаалт
          </button>
          <span className="text-xs text-mist-400">
            Асуулт <span className="font-semibold text-mist-100">{index + 1}</span> / {shuffled.length}
            <span className="ml-3 text-success">{correctCount} зөв</span>
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-ink-700">
          <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="ce-panel p-5 sm:p-6 md:p-8"
        >
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-mist-500">
                {title}
                {subtitle && <span className="normal-case tracking-normal"> · {subtitle}</span>}
              </p>
              <p className="mt-1 truncate font-display text-sm text-brand">{rule?.title ?? ''}</p>
            </div>
            <span className="rounded-full border border-ink-600 bg-ink-800 px-3 py-1 text-[11px] font-medium text-mist-300">
              {KIND_LABEL[question.kind]}
            </span>
          </div>

          <p className="text-xs text-mist-400">{KIND_PROMPT[question.kind]}</p>
          <h2 className="mb-7 mt-2 font-display text-xl font-semibold leading-8 text-mist-50 md:text-2xl">
            {question.kind === 'fill' ? (
              <FillBlank question={question.question} filled={selected} correct={selected ? isCorrect : null} />
            ) : (
              <span lang={question.kind === 'translate' ? 'mn' : undefined}>{question.question}</span>
            )}
          </h2>

          <div className={cn('grid gap-3', question.kind === 'fill' ? 'sm:grid-cols-2' : 'grid-cols-1')}>
            {question.options.map((option, i) => {
              const state = !selected
                ? 'idle'
                : option === question.answer
                  ? 'correct'
                  : option === selected
                    ? 'wrong'
                    : 'dim';
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => choose(option)}
                  disabled={!!selected}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-200',
                    state === 'idle' && 'border-ink-600 bg-ink-900 text-mist-100 hover:border-brand/40 hover:bg-ink-800',
                    state === 'correct' && 'border-success/50 bg-success/10 text-success',
                    state === 'wrong' && 'border-danger/50 bg-danger/10 text-danger',
                    state === 'dim' && 'border-ink-700 bg-ink-900/60 text-mist-500 opacity-60',
                  )}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-current font-mono text-xs opacity-60">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span lang="en" className="flex-1 font-display">
                    {option}
                  </span>
                  {state === 'correct' && <Check className="h-4 w-4 shrink-0" />}
                  {state === 'wrong' && <X className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Сануулга */}
          {!selected && question.hint && (
            <div className="mt-5">
              {hintOpen ? (
                <p className="flex items-start gap-2 rounded-lg border border-modifier/30 bg-modifier/10 px-3 py-2 text-xs leading-5 text-mist-100">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-modifier" />
                  {question.hint}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setHintOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-mist-400 transition-colors hover:text-modifier"
                >
                  <Lightbulb className="h-3.5 w-3.5" /> Сануулга харах
                </button>
              )}
            </div>
          )}

          {/* Тайлбар */}
          {selected && (
            <div
              className={cn(
                'mt-6 rounded-xl border p-4',
                isCorrect ? 'border-success/40 bg-success/10' : 'border-danger/40 bg-danger/10',
              )}
            >
              <div className="mb-1.5 flex items-center gap-2">
                {isCorrect ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-danger" />}
                <strong className="text-sm text-mist-50">{isCorrect ? 'Зөв!' : 'Буруу — тайлбарыг уншаарай'}</strong>
              </div>
              <p className="text-sm leading-6 text-mist-200">{question.explanation}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-mist-400">Зөв хэлбэр:</span>
                <span lang="en" className="font-display font-medium text-success">
                  {correctSentence}
                </span>
                <SpeakButton text={correctSentence} className="border-success/30 text-success/80" />
              </div>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between gap-3">
            <span className="hidden text-[11px] text-mist-500 sm:block">1–4 товчоор сонгож, Enter-ээр үргэлжлүүлж болно</span>
            <button
              type="button"
              onClick={next}
              disabled={!selected}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
            >
              {isLast ? 'Үр дүн харах' : 'Дараагийн асуулт'} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** "She ___ my sister." — хоосон зайг тодруулж, сонгосон хариултаар бөглөнө. */
function FillBlank({ question, filled, correct }: { question: string; filled: string | null; correct: boolean | null }) {
  const [before, after = ''] = question.split('___');
  return (
    <span lang="en">
      {before}
      <span
        className={cn(
          'mx-1 inline-block min-w-[3.5ch] rounded-md border-b-2 px-1.5 text-center align-baseline',
          correct === null && 'border-brand text-brand',
          correct === true && 'border-success text-success',
          correct === false && 'border-danger text-danger line-through decoration-2',
        )}
      >
        {filled ?? '   '}
      </span>
      {after}
    </span>
  );
}

function QuizResult({
  questions,
  answers,
  rulesById,
  title,
  onRestart,
  onExit,
  onStudy,
}: {
  questions: QuizQuestion[];
  answers: Record<string, string>;
  rulesById: ReadonlyMap<number, GrammarRule>;
  title: string;
  onRestart: () => void;
  onExit: () => void;
  onStudy: (ruleId: number) => void;
}) {
  const total = questions.length;
  const correct = questions.filter((q) => answers[q.id] === q.answer).length;
  const percentage = total ? Math.round((correct / total) * 100) : 0;
  const byRule = scoreByRule(questions, answers);
  const weak = byRule.filter((s) => s.correct < s.total);

  const verdict =
    percentage === 100
      ? { title: 'Төгс!', body: 'Бүх асуултад зөв хариуллаа. Энэ дүрэм баттай суужээ.' }
      : percentage >= 80
        ? { title: 'Маш сайн.', body: 'Ганц хоёр цэгийг дахин хараад бүрэн эзэмшээрэй.' }
        : percentage >= 60
          ? { title: 'Сайн байна.', body: 'Алдсан дүрмүүдээ дахин нэг уншаад шалгалтаа давтаарай.' }
          : { title: 'Дахин давтах хэрэгтэй.', body: 'Эхлээд дүрмийн жишээ, түгээмэл алдааг уншаад дахин оролдоорой.' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-3xl"
    >
      <div className="ce-panel p-6 text-center sm:p-8 md:p-10">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand">
          <Trophy className="h-4 w-4" /> {title} — дууслаа
        </span>

        <div className="my-7">
          <div className="font-display text-6xl font-semibold tracking-tight text-mist-50">
            {percentage}
            <span className="text-2xl text-mist-500">%</span>
          </div>
          <p className="mt-3 text-sm text-mist-400">
            {total} асуултаас <span className="font-semibold text-success">{correct}</span> зөв хариуллаа.
          </p>
        </div>

        <div className="mx-auto max-w-md rounded-xl border border-ink-600 bg-ink-800/60 p-5">
          <p className="font-display font-medium text-mist-50">{verdict.title}</p>
          <p className="mt-2 text-sm leading-6 text-mist-400">{verdict.body}</p>
        </div>

        {weak.length > 0 && (
          <div className="mx-auto mt-6 max-w-md text-left">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-mist-400">Дахин үзэх дүрэм</p>
            <div className="space-y-2">
              {weak.map((s) => {
                const rule = rulesById.get(s.ruleId);
                if (!rule) return null;
                return (
                  <button
                    key={s.ruleId}
                    type="button"
                    onClick={() => onStudy(s.ruleId)}
                    className="flex w-full items-center gap-3 rounded-lg border border-ink-700 bg-ink-900/60 px-3 py-2.5 text-left transition-colors hover:border-brand/40 hover:bg-ink-800"
                  >
                    <BookOpen className="h-4 w-4 shrink-0 text-brand" />
                    <span className="min-w-0 flex-1 truncate font-display text-sm text-mist-100">{rule.title}</span>
                    <span className="shrink-0 text-xs text-danger">
                      {s.correct}/{s.total}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 space-y-2 text-left">
          {questions.map((q, i) => {
            const user = answers[q.id];
            const ok = user === q.answer;
            const rule = rulesById.get(q.ruleId);
            return (
              <div key={q.id} className="flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-3">
                {ok ? <Check className="h-4 w-4 shrink-0 text-success" /> : <X className="h-4 w-4 shrink-0 text-danger" />}
                <span className="font-mono text-xs text-mist-500">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-mist-200">{rule?.title ?? ''}</span>
                <span lang="en" className={cn('max-w-[45%] truncate font-display text-xs', ok ? 'text-success' : 'text-danger')}>
                  {user || '—'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 rounded-xl border border-ink-500 bg-ink-800 px-5 py-2.5 text-sm text-mist-100 transition-colors hover:border-brand/40 hover:bg-ink-700"
          >
            <ArrowLeft className="h-4 w-4" /> Шалгалтын жагсаалт
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-colors hover:bg-brand-hover"
          >
            <RotateCcw className="h-4 w-4" /> Дахин өгөх
          </button>
        </div>
      </div>
    </motion.div>
  );
}
