// frontend/src/components/reading/mini-quiz.tsx
'use client';

import { useMemo, useState } from 'react';
import { UserReadingWord } from '@/lib/reading-services';
import { speakEnglishWord } from '@/components/reading/reading-utils';

const FALLBACK_DISTRACTORS = [
  'байх',
  'явдаг',
  'том',
  'жижиг',
  'хурдан',
  'удаан',
  'сайхан',
  'муу',
  'хүн',
  'байшин',
  'нохой',
  'муур',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChoices(correct: string, pool: string[]): string[] {
  const distractors = shuffle(
    [...new Set([...pool, ...FALLBACK_DISTRACTORS])].filter(
      (m) => m.toLowerCase() !== correct.toLowerCase(),
    ),
  ).slice(0, 3);
  while (distractors.length < 3) {
    distractors.push(`сонголт ${distractors.length + 1}`);
  }
  return shuffle([correct, ...distractors]);
}

export function MiniQuiz({
  words,
  onComplete,
}: {
  words: UserReadingWord[];
  onComplete: () => void | Promise<void>;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const meanings = useMemo(() => words.map((w) => w.meaningMn), [words]);
  const current = words[index];
  const choices = useMemo(
    () => (current ? buildChoices(current.meaningMn, meanings) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current?.id, index],
  );

  if (!current) return null;

  const handlePick = async (choice: string) => {
    if (selected || submitting) return;
    setSelected(choice);
    if (choice === current.meaningMn) {
      setWrong(false);
      speakEnglishWord(current.word);
      const next = index + 1;
      if (next >= words.length) {
        setSubmitting(true);
        try {
          await onComplete();
        } finally {
          setSubmitting(false);
        }
      } else {
        setTimeout(() => {
          setIndex(next);
          setSelected(null);
        }, 450);
      }
    } else {
      setWrong(true);
      setTimeout(() => {
        setSelected(null);
        setWrong(false);
      }, 700);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <p className="text-xs text-mist-500">
        Асуулт {index + 1} / {words.length}
      </p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-mist-50">
        «{current.word}» гэж юу гэсэн үг вэ?
      </h2>
      <p className="mt-1 text-sm text-mist-400">Зөв монгол орчуулгыг сонгоно уу</p>

      <div className="mt-6 grid gap-2">
        {choices.map((choice) => {
          const isCorrect = selected === choice && choice === current.meaningMn;
          const isWrongPick = selected === choice && choice !== current.meaningMn;
          return (
            <button
              key={choice}
              type="button"
              disabled={!!selected || submitting}
              onClick={() => handlePick(choice)}
              className={
                isCorrect
                  ? 'rounded-xl border border-emerald-500/50 bg-emerald-500/15 px-4 py-3 text-left text-sm text-emerald-300'
                  : isWrongPick
                    ? 'rounded-xl border border-danger/50 bg-danger/15 px-4 py-3 text-left text-sm text-danger'
                    : 'rounded-xl border border-ink-600 bg-ink-900 px-4 py-3 text-left text-sm text-mist-100 hover:border-brand/40 hover:bg-ink-800'
              }
            >
              {choice}
            </button>
          );
        })}
      </div>

      {wrong && (
        <p className="mt-4 text-center text-sm text-danger">Буруу — дахин оролдоорой</p>
      )}
      {submitting && (
        <p className="mt-4 text-center text-sm text-mist-400">Хадгалж байна…</p>
      )}
    </div>
  );
}
