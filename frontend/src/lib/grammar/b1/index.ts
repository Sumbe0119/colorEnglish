// frontend/src/lib/grammar/b1/index.ts
// B1 түвшний 15 дүрэм — дараалал нь заах дараалал.
import type { GrammarRule, QuizQuestion } from '../types';
import { b1Rule01 } from './rule-01';
import { b1Rule02 } from './rule-02';
import { b1Rule03 } from './rule-03';
import { b1Rule04 } from './rule-04';
import { b1Rule05 } from './rule-05';
import { b1Rule06 } from './rule-06';
import { b1Rule07 } from './rule-07';
import { b1Rule08 } from './rule-08';
import { b1Rule09 } from './rule-09';
import { b1Rule10 } from './rule-10';
import { b1Rule11 } from './rule-11';
import { b1Rule12 } from './rule-12';
import { b1Rule13 } from './rule-13';
import { b1Rule14 } from './rule-14';
import { b1Rule15 } from './rule-15';

export const B1_RULES: GrammarRule[] = [
  b1Rule01,
  b1Rule02,
  b1Rule03,
  b1Rule04,
  b1Rule05,
  b1Rule06,
  b1Rule07,
  b1Rule08,
  b1Rule09,
  b1Rule10,
  b1Rule11,
  b1Rule12,
  b1Rule13,
  b1Rule14,
  b1Rule15,
];

export const B1_QUIZ: QuizQuestion[] = B1_RULES.flatMap((rule) => rule.quiz);

export const B1_RULES_BY_ID: ReadonlyMap<number, GrammarRule> = new Map(
  B1_RULES.map((rule) => [rule.id, rule]),
);

export function getB1Rule(id: number): GrammarRule | undefined {
  return B1_RULES_BY_ID.get(id);
}
