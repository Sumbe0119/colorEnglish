// frontend/src/lib/grammar/c1/index.ts
// C1 түвшний 15 дүрэм — дараалал нь заах дараалал.
import type { GrammarRule, QuizQuestion } from '../types';
import { c1Rule01 } from './rule-01';
import { c1Rule02 } from './rule-02';
import { c1Rule03 } from './rule-03';
import { c1Rule04 } from './rule-04';
import { c1Rule05 } from './rule-05';
import { c1Rule06 } from './rule-06';
import { c1Rule07 } from './rule-07';
import { c1Rule08 } from './rule-08';
import { c1Rule09 } from './rule-09';
import { c1Rule10 } from './rule-10';
import { c1Rule11 } from './rule-11';
import { c1Rule12 } from './rule-12';
import { c1Rule13 } from './rule-13';
import { c1Rule14 } from './rule-14';
import { c1Rule15 } from './rule-15';

export const C1_RULES: GrammarRule[] = [
  c1Rule01,
  c1Rule02,
  c1Rule03,
  c1Rule04,
  c1Rule05,
  c1Rule06,
  c1Rule07,
  c1Rule08,
  c1Rule09,
  c1Rule10,
  c1Rule11,
  c1Rule12,
  c1Rule13,
  c1Rule14,
  c1Rule15,
];

export const C1_QUIZ: QuizQuestion[] = C1_RULES.flatMap((rule) => rule.quiz);

export const C1_RULES_BY_ID: ReadonlyMap<number, GrammarRule> = new Map(
  C1_RULES.map((rule) => [rule.id, rule]),
);

export function getC1Rule(id: number): GrammarRule | undefined {
  return C1_RULES_BY_ID.get(id);
}
