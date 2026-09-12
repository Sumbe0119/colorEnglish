// frontend/src/lib/grammar/a1/index.ts
// A1 түвшний 15 дүрэм — дараалал нь заах дараалал.
import type { GrammarRule, QuizQuestion } from '../types';
import { rule01 } from './rule-01';
import { rule02 } from './rule-02';
import { rule03 } from './rule-03';
import { rule04 } from './rule-04';
import { rule05 } from './rule-05';
import { rule06 } from './rule-06';
import { rule07 } from './rule-07';
import { rule08 } from './rule-08';
import { rule09 } from './rule-09';
import { rule10 } from './rule-10';
import { rule11 } from './rule-11';
import { rule12 } from './rule-12';
import { rule13 } from './rule-13';
import { rule14 } from './rule-14';
import { rule15 } from './rule-15';

export const A1_RULES: GrammarRule[] = [
  rule01,
  rule02,
  rule03,
  rule04,
  rule05,
  rule06,
  rule07,
  rule08,
  rule09,
  rule10,
  rule11,
  rule12,
  rule13,
  rule14,
  rule15,
];

export const A1_QUIZ: QuizQuestion[] = A1_RULES.flatMap((rule) => rule.quiz);

export const A1_RULES_BY_ID: ReadonlyMap<number, GrammarRule> = new Map(
  A1_RULES.map((rule) => [rule.id, rule]),
);

export function getA1Rule(id: number): GrammarRule | undefined {
  return A1_RULES_BY_ID.get(id);
}
