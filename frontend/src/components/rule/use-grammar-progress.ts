// frontend/src/components/rule/use-grammar-progress.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  loadProgress,
  markViewed as markViewedIn,
  recordQuiz as recordQuizIn,
  saveProgress,
  type GrammarProgress,
} from '@/lib/grammar/progress';

/** Дүрмийн явцыг localStorage-той синк хийж хадгална. */
export function useGrammarProgress() {
  const [progress, setProgress] = useState<GrammarProgress>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveProgress(progress);
  }, [progress, ready]);

  const markViewed = useCallback((ruleId: number) => {
    setProgress((prev) => markViewedIn(prev, ruleId));
  }, []);

  const recordQuiz = useCallback((ruleId: number, correct: number, total: number) => {
    setProgress((prev) => recordQuizIn(prev, ruleId, correct, total));
  }, []);

  return { progress, ready, markViewed, recordQuiz };
}
