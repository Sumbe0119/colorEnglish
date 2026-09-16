// frontend/src/components/rule/use-grammar-progress.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchGrammarProgress,
  markGrammarRuleViewed,
  submitGrammarQuiz,
  type GrammarLevel,
  type GrammarLevelProgress,
  type GrammarQuizResult,
} from '@/lib/grammar/progress';

type Status = 'loading' | 'ready' | 'error';

/**
 * DB дэх явц зөвхөн өсдөг (үзсэн, тэнцсэн, нээгдсэн нь буцахгүй; шилдэг оноо буурахгүй) тул
 * хоцорч ирсэн хариу шинэ төлөвийг дарахгүйн тулд хоёрыг нэгтгэнэ. VIP төлөв хамгийн сүүлийн хариунаас.
 */
function mergeProgress(prev: GrammarLevelProgress | null, next: GrammarLevelProgress): GrammarLevelProgress {
  if (!prev) return next;
  const rules = { ...next.rules };
  for (const [id, n] of Object.entries(next.rules)) {
    const p = prev.rules[Number(id)];
    if (!p) continue;
    const unlocked = p.unlocked || n.unlocked;
    const prevBetter = p.total > 0 && (n.total === 0 || p.best * n.total > n.best * p.total);
    rules[Number(id)] = {
      ...n,
      viewed: p.viewed || n.viewed,
      passed: p.passed || n.passed,
      attempts: Math.max(p.attempts, n.attempts),
      best: prevBetter ? p.best : n.best,
      total: prevBetter ? p.total : n.total,
      unlocked,
      canOpen: unlocked && !n.requiresVip,
    };
  }
  return { ...next, rules };
}

/** Тухайн түвшний дүрмийн явц, түгжээг backend-ээс ачаалж, үйлдэл бүрийг DB-д хадгална. */
export function useGrammarProgress(level: GrammarLevel) {
  const [data, setData] = useState<GrammarLevelProgress | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  // Нэг хичээлийг давхар "үзсэн" гэж илгээхгүй
  const viewRequests = useRef(new Set<number>());

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setData(await fetchGrammarProgress(level));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [level]);

  useEffect(() => {
    viewRequests.current.clear();
    void load();
  }, [load]);

  const markViewed = useCallback(
    (ruleId: number) => {
      const rule = data?.rules[ruleId];
      if (!rule?.canOpen || rule.viewed || viewRequests.current.has(ruleId)) return;
      viewRequests.current.add(ruleId);
      markGrammarRuleViewed(level, ruleId)
        .then((next) => setData((prev) => mergeProgress(prev, next)))
        .catch(() => {
          // Дараагийн удаа нээхэд дахин оролдоно
          viewRequests.current.delete(ruleId);
        });
    },
    [data, level],
  );

  /** Шалгалтын оноог хадгална; алдаа гарвал throw хийнэ (дуудагч дахин оролдуулна) */
  const recordQuiz = useCallback(
    async (results: GrammarQuizResult[]) => {
      const outcome = await submitGrammarQuiz(level, results);
      setData((prev) => mergeProgress(prev, outcome.progress));
      return outcome;
    },
    [level],
  );

  return {
    progress: data?.rules ?? {},
    meta: data,
    status,
    reload: load,
    markViewed,
    recordQuiz,
  };
}
