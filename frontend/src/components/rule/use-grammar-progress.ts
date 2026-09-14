// frontend/src/components/rule/use-grammar-progress.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  loadProgress,
  markViewed as markViewedIn,
  recordQuiz as recordQuizIn,
  saveProgress,
  type GrammarLevel,
  type GrammarProgress,
} from '@/lib/grammar/progress';

/** Тухайн түвшний дүрмийн явцыг localStorage-той синк хийж хадгална. */
export function useGrammarProgress(level: GrammarLevel) {
  const [progress, setProgress] = useState<GrammarProgress>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress(level));
    setReady(true);
  }, [level]);

  useEffect(() => {
    if (ready) saveProgress(level, progress);
  }, [level, progress, ready]);

  const markViewed = useCallback((ruleId: number) => {
    setProgress((prev) => markViewedIn(prev, ruleId));
  }, []);

  const recordQuiz = useCallback((ruleId: number, correct: number, total: number) => {
    setProgress((prev) => recordQuizIn(prev, ruleId, correct, total));
  }, []);

  return { progress, ready, markViewed, recordQuiz };
}
