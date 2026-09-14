// frontend/src/lib/grammar/a2/index.ts
// A2 түвшний 16 дүрэм — дараалал нь заах дараалал.
import type { GrammarRule, QuizQuestion } from '../types';
import { a2Rule01 } from './rule-01';
import { a2Rule02 } from './rule-02';
import { a2Rule03 } from './rule-03';
import { a2Rule04 } from './rule-04';
import { a2Rule05 } from './rule-05';
import { a2Rule06 } from './rule-06';
import { a2Rule07 } from './rule-07';
import { a2Rule08 } from './rule-08';
import { a2Rule09 } from './rule-09';
import { a2Rule10 } from './rule-10';
import { a2Rule11 } from './rule-11';
import { a2Rule12 } from './rule-12';
import { a2Rule13 } from './rule-13';
import { a2Rule14 } from './rule-14';
import { a2Rule15 } from './rule-15';
import { a2Rule16 } from './rule-16';

export const A2_RULES: GrammarRule[] = [
  a2Rule01,
  a2Rule02,
  a2Rule03,
  a2Rule04,
  a2Rule05,
  a2Rule06,
  a2Rule07,
  a2Rule08,
  a2Rule09,
  a2Rule10,
  a2Rule11,
  a2Rule12,
  a2Rule13,
  a2Rule14,
  a2Rule15,
  a2Rule16,
];

export const A2_QUIZ: QuizQuestion[] = A2_RULES.flatMap((rule) => rule.quiz);

export const A2_RULES_BY_ID: ReadonlyMap<number, GrammarRule> = new Map(
  A2_RULES.map((rule) => [rule.id, rule]),
);

export function getA2Rule(id: number): GrammarRule | undefined {
  return A2_RULES_BY_ID.get(id);
}
