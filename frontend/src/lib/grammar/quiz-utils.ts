// frontend/src/lib/grammar/quiz-utils.ts
import type { GrammarRule, QuizQuestion } from './types';

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Дүрэм бүрээс санамсаргүй нэг асуулт — хурдан шалгалт. */
export function pickQuickSet(rules: GrammarRule[]): QuizQuestion[] {
  return rules
    .map((rule) => shuffle(rule.quiz)[0])
    .filter((q): q is QuizQuestion => Boolean(q));
}

/** Бүх дүрмийн бүх асуулт, дүрмийн дарааллаар (дүрэм доторх асуултууд холилдоно). */
export function buildFullSet(rules: GrammarRule[]): QuizQuestion[] {
  return rules.flatMap((rule) => shuffle(rule.quiz));
}

export type RuleScore = { ruleId: number; correct: number; total: number };

/** Хариултуудыг дүрэм бүрээр нь нэгтгэнэ. */
export function scoreByRule(questions: QuizQuestion[], answers: Record<string, string>): RuleScore[] {
  const map = new Map<number, RuleScore>();
  for (const q of questions) {
    const entry = map.get(q.ruleId) ?? { ruleId: q.ruleId, correct: 0, total: 0 };
    entry.total += 1;
    if (answers[q.id] === q.answer) entry.correct += 1;
    map.set(q.ruleId, entry);
  }
  return [...map.values()];
}
