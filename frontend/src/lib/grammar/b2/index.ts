// frontend/src/lib/grammar/b2/index.ts
// B2 түвшний 15 дүрэм — дараалал нь заах дараалал.
import type { GrammarRule, QuizQuestion } from '../types';
import { b2Rule01 } from './rule-01';
import { b2Rule02 } from './rule-02';
import { b2Rule03 } from './rule-03';
import { b2Rule04 } from './rule-04';
import { b2Rule05 } from './rule-05';
import { b2Rule06 } from './rule-06';
import { b2Rule07 } from './rule-07';
import { b2Rule08 } from './rule-08';
import { b2Rule09 } from './rule-09';
import { b2Rule10 } from './rule-10';
import { b2Rule11 } from './rule-11';
import { b2Rule12 } from './rule-12';
import { b2Rule13 } from './rule-13';
import { b2Rule14 } from './rule-14';
import { b2Rule15 } from './rule-15';

export const B2_RULES: GrammarRule[] = [
  b2Rule01,
  b2Rule02,
  b2Rule03,
  b2Rule04,
  b2Rule05,
  b2Rule06,
  b2Rule07,
  b2Rule08,
  b2Rule09,
  b2Rule10,
  b2Rule11,
  b2Rule12,
  b2Rule13,
  b2Rule14,
  b2Rule15,
];

export const B2_QUIZ: QuizQuestion[] = B2_RULES.flatMap((rule) => rule.quiz);

export const B2_RULES_BY_ID: ReadonlyMap<number, GrammarRule> = new Map(
  B2_RULES.map((rule) => [rule.id, rule]),
);

export function getB2Rule(id: number): GrammarRule | undefined {
  return B2_RULES_BY_ID.get(id);
}
