/** MBTI зан чанарын тест — хариулт бүр нь сонгосон сонголтын үсэг (E/I, S/N, T/F, J/P) */
export const MBTI_LETTERS = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'] as const;
export type MbtiLetter = (typeof MBTI_LETTERS)[number];

export const MBTI_DIMENSIONS: [MbtiLetter, MbtiLetter][] = [
  ['E', 'I'],
  ['S', 'N'],
  ['T', 'F'],
  ['J', 'P'],
];

/** Хэмжээс бүрийн асуултын тоо — frontend-ийн MBTI_QUESTIONS-тэй таарах ёстой */
export const MBTI_QUESTIONS_PER_DIMENSION = 5;
export const MBTI_QUESTION_COUNT = MBTI_QUESTIONS_PER_DIMENSION * MBTI_DIMENSIONS.length;

/** Үсэг бүрийн хувь (0-100); хос үсгийн нийлбэр 100 */
export type MbtiScores = Record<MbtiLetter, number>;

export function isMbtiLetter(v: unknown): v is MbtiLetter {
  return typeof v === 'string' && (MBTI_LETTERS as readonly string[]).includes(v);
}

/**
 * Хэмжээс бүрд яг MBTI_QUESTIONS_PER_DIMENSION хариулт байх ёстой.
 * Тэнцсэн тохиолдолд хэмжээсийн эхний үсгийг (E, S, T, J) сонгоно — сондгой тоотой тул тэнцэхгүй.
 */
export function computeMbti(answers: MbtiLetter[]): { type: string; scores: MbtiScores } | null {
  const counts = Object.fromEntries(MBTI_LETTERS.map((l) => [l, 0])) as MbtiScores;
  for (const a of answers) counts[a] += 1;

  const scores = {} as MbtiScores;
  let type = '';
  for (const [a, b] of MBTI_DIMENSIONS) {
    const total = counts[a] + counts[b];
    if (total !== MBTI_QUESTIONS_PER_DIMENSION) return null;
    scores[a] = Math.round((counts[a] / total) * 100);
    scores[b] = 100 - scores[a];
    type += counts[a] >= counts[b] ? a : b;
  }
  return { type, scores };
}
