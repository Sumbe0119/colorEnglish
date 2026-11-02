// frontend/src/components/tug-of-war/question-card.tsx
// Нэг тоглогчийн нөхөж бичих асуултын карт: өгүүлбэр (хоосон зайтай) + 4 сонголт.
// Өөрийн карт бол дарж хариулна; эсрэг талын карт бол зөвхөн харуулна (ботын / өрсөлдөгчийн сонголт гэрэлтэнэ).
'use client';

import { Check, X } from 'lucide-react';
import { splitBlank, TEAM_INFO, type Team, type TugQuestion } from '@/lib/tug-of-war';

export type CardFeedback = {
  /** Сонгосон сонголт */
  option: number;
  correct: boolean;
  /** Зөв хариултын индекс (буруу үед гэрэлтүүлнэ) */
  answer: number;
} | null;

export function QuestionCard({
  team,
  name,
  tag,
  question,
  interactive,
  disabled,
  feedback,
  thinking,
  correctCount,
  onPick,
  className = '',
}: {
  team: Team;
  name: string;
  /** 'ТА' | 'БОТ' | 'ӨРСӨЛДӨГЧ' */
  tag: string;
  question: TugQuestion | null;
  /** Тоглогч өөрөө дарж хариулах карт */
  interactive: boolean;
  disabled?: boolean;
  feedback: CardFeedback;
  /** Эсрэг тал бодож байна (жижиг анимаци) */
  thinking?: boolean;
  correctCount: number;
  onPick?: (option: number) => void;
  className?: string;
}) {
  const info = TEAM_INFO[team];
  const [before, after] = question ? splitBlank(question.text) : ['', ''];
  const filled = feedback ? question?.options[feedback.option] : null;

  return (
    <div
      className={`flex min-w-0 flex-col rounded-xl border-2 bg-ink-900/90 p-2 sm:p-3 ${className}`}
      style={{ borderColor: `${info.color}66`, boxShadow: `inset 0 0 0 1px ${info.color}22` }}
    >
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: info.color }} />
        <span className="truncate text-xs font-semibold text-mist-50">{name}</span>
        <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ background: `${info.color}26`, color: info.light }}>
          {tag}
        </span>
        <span className="ml-auto shrink-0 font-mono text-[11px] text-mist-400" title="Зөв хариулт">
          <Check className="mr-0.5 inline h-3 w-3 text-success" />
          {correctCount}
        </span>
      </div>

      <p className="mt-1.5 break-words text-sm leading-snug text-mist-50 sm:mt-2 sm:min-h-[2.5rem] sm:text-base">
        {question ? (
          <>
            {before}
            <span
              className={`mx-0.5 inline-block min-w-[3.5ch] rounded border-b-2 px-1 text-center font-semibold ${
                feedback ? (feedback.correct ? 'border-success text-success' : 'border-danger text-danger line-through') : 'border-mist-400 text-transparent'
              }`}
            >
              {filled ?? '___'}
            </span>
            {after}
          </>
        ) : (
          <span className="text-mist-500">…</span>
        )}
      </p>
      {question?.mn && <p className={`mt-0.5 break-words text-[11px] leading-snug text-mist-500 ${interactive ? '' : 'hidden sm:block'}`}>{question.mn}</p>}

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {(question?.options ?? ['', '', '', '']).map((opt, i) => {
          const isPicked = feedback?.option === i;
          const isAnswer = feedback != null && feedback.answer === i;
          let cls = 'border-ink-600/80 bg-ink-800/70 text-mist-200';
          if (feedback) {
            if (isPicked && feedback.correct) cls = 'border-success bg-success/20 text-success';
            else if (isPicked && !feedback.correct) cls = 'border-danger bg-danger/20 text-danger';
            else if (isAnswer) cls = 'border-success/70 bg-success/10 text-success';
            else cls = 'border-ink-600/50 bg-ink-800/40 text-mist-500';
          } else if (interactive && !disabled) {
            cls += ' hover:border-mist-400 hover:bg-ink-700 active:translate-y-[1px]';
          }
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive || disabled || !question || feedback != null}
              onClick={() => onPick?.(i)}
              className={`relative flex min-h-[2rem] items-center justify-center sm:min-h-[2.25rem] rounded-lg border px-1.5 py-1 text-center text-xs font-medium transition-colors disabled:cursor-default sm:text-sm ${cls} ${
                !interactive ? 'cursor-default' : ''
              }`}
            >
              <span className="break-words leading-tight">{opt || ' '}</span>
              {isPicked && feedback && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink-950">
                  {feedback.correct ? <Check className="h-3 w-3 text-success" /> : <X className="h-3 w-3 text-danger" />}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!interactive && (
        <p className="mt-1.5 h-3 text-[10px] text-mist-500">
          {thinking && !feedback ? (
            <span className="tr-blink">бодож байна…</span>
          ) : feedback ? (
            feedback.correct ? (
              <span className="text-success">зөв хариуллаа — олс татлаа!</span>
            ) : (
              <span className="text-danger">буруу хариуллаа</span>
            )
          ) : null}
        </p>
      )}
    </div>
  );
}
