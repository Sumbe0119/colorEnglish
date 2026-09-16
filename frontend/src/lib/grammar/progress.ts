// frontend/src/lib/grammar/progress.ts
// Дүрмийн явц DB-д хадгалагдана (backend/src/grammar). Эхний хичээлүүд үнэгүй; бусад нь VIP
// бөгөөд өмнөх хичээлийн шалгалтад тэнцсэний дараа нээгдэнэ — түгжээг backend тооцоолно.
import { api } from '@/lib/api';

export type GrammarLevel = 'a1' | 'a2' | 'b1';

export type RuleProgress = {
  /** Дүрмийн дэлгэрэнгүйг нээж үзсэн эсэх */
  viewed: boolean;
  /** Тухайн дүрмийн шалгалтын шилдэг оноо (зөв тоо) */
  best: number;
  /** Шилдэг оноог авах үеийн нийт асуулт */
  total: number;
  attempts: number;
  /** Шалгалтад тэнцсэн (дараагийн хичээлийг нээнэ) */
  passed: boolean;
  /** Эхний үнэгүй хичээл эсвэл өмнөх хичээлдээ тэнцсэн */
  unlocked: boolean;
  /** VIP эрх шаардлагатай ба хэрэглэгч VIP биш */
  requiresVip: boolean;
  /** Одоо үзэж, шалгалт өгч болох эсэх */
  canOpen: boolean;
};

export type GrammarProgress = Record<number, RuleProgress>;

type ApiRuleState = {
  ruleId: number;
  viewed: boolean;
  bestCorrect: number;
  bestTotal: number;
  attempts: number;
  passed: boolean;
  unlocked: boolean;
  requiresVip: boolean;
  canOpen: boolean;
};

type ApiLevelProgress = {
  level: GrammarLevel;
  isPro: boolean;
  staffAccess: boolean;
  freeRuleCount: number;
  passPercent: number;
  rules: ApiRuleState[];
};

export type GrammarLevelProgress = {
  isPro: boolean;
  staffAccess: boolean;
  freeRuleCount: number;
  passPercent: number;
  rules: GrammarProgress;
};

export type GrammarQuizResult = { ruleId: number; correct: number; total: number };

export type GrammarQuizOutcome = {
  progress: GrammarLevelProgress;
  newlyPassed: number[];
  newlyUnlocked: number[];
};

function toLevelProgress(data: ApiLevelProgress): GrammarLevelProgress {
  const rules: GrammarProgress = {};
  for (const r of data.rules) {
    rules[r.ruleId] = {
      viewed: r.viewed,
      best: r.bestCorrect,
      total: r.bestTotal,
      attempts: r.attempts,
      passed: r.passed,
      unlocked: r.unlocked,
      requiresVip: r.requiresVip,
      canOpen: r.canOpen,
    };
  }
  return {
    isPro: data.isPro,
    staffAccess: data.staffAccess,
    freeRuleCount: data.freeRuleCount,
    passPercent: data.passPercent,
    rules,
  };
}

export async function fetchGrammarProgress(level: GrammarLevel) {
  const { data } = await api.get<ApiLevelProgress>(`/grammar/${level}/progress`);
  return toLevelProgress(data);
}

export async function markGrammarRuleViewed(level: GrammarLevel, ruleId: number) {
  const { data } = await api.post<ApiLevelProgress>(`/grammar/${level}/rules/${ruleId}/view`);
  return toLevelProgress(data);
}

export async function submitGrammarQuiz(
  level: GrammarLevel,
  results: GrammarQuizResult[],
): Promise<GrammarQuizOutcome> {
  const { data } = await api.post<{ progress: ApiLevelProgress; newlyPassed: number[]; newlyUnlocked: number[] }>(
    `/grammar/${level}/quiz`,
    { results },
  );
  return { progress: toLevelProgress(data.progress), newlyPassed: data.newlyPassed, newlyUnlocked: data.newlyUnlocked };
}

/** Бүх асуултад зөв хариулсан */
export function isMastered(p: RuleProgress | undefined): boolean {
  return !!p && p.total > 0 && p.best === p.total;
}
