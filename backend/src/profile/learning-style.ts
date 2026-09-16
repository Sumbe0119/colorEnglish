import { LearningStyle } from '@prisma/client';

export const LEARNING_STYLES: LearningStyle[] = [
  'VISUAL',
  'AUDITORY',
  'READING_WRITING',
  'KINESTHETIC',
];

/** Судалгааны асуултын тоо — frontend-ийн LEARNING_STYLE_QUESTIONS-тэй таарах ёстой */
export const LEARNING_STYLE_QUESTION_COUNT = 8;

export type LearningStyleScores = Record<LearningStyle, number>;

/**
 * Судалгааны хариулт бүр нь сонгосон сонголтын арга барил.
 * Арга барил тус бүрийн хувийг (0-100) болон давамгайлах арга барилыг тооцно.
 */
export function computeLearningStyle(answers: LearningStyle[]): {
  scores: LearningStyleScores;
  dominant: LearningStyle;
} {
  const counts = Object.fromEntries(LEARNING_STYLES.map((s) => [s, 0])) as LearningStyleScores;
  for (const a of answers) counts[a] += 1;

  const total = answers.length || 1;
  const scores = Object.fromEntries(
    LEARNING_STYLES.map((s) => [s, Math.round((counts[s] / total) * 100)]),
  ) as LearningStyleScores;

  // Тэнцсэн тохиолдолд LEARNING_STYLES дарааллын эхнийхийг авна
  const dominant = LEARNING_STYLES.reduce((best, s) => (scores[s] > scores[best] ? s : best));
  return { scores, dominant };
}
