import { LevelCode } from '@prisma/client';

/** URL-д ирэх түвшин (frontend-ийн GrammarLevel) → DB-ийн LevelCode */
export const GRAMMAR_LEVELS = {
  a1: LevelCode.A1,
  a2: LevelCode.A2,
  b1: LevelCode.B1,
} as const;

export type GrammarLevelSlug = keyof typeof GRAMMAR_LEVELS;

/**
 * Түвшин бүрийн дүрмийн тоо. Дүрмийн id нь заах дарааллаар 1..N байна.
 * frontend/src/lib/grammar/{a1,a2,b1}/index.ts-ийн дүрмийн жагсаалттай таарах ёстой —
 * шинэ дүрэм нэмбэл энд ч шинэчилнэ.
 */
export const GRAMMAR_RULE_COUNTS: Record<GrammarLevelSlug, number> = {
  a1: 15,
  a2: 16,
  b1: 15,
};

/** VIP биш хэрэглэгчид нээлттэй, дарааллын түгжээгүй эхний хичээлүүд */
export const GRAMMAR_FREE_RULES = 3;

/** Шалгалтад тэнцэх доод хувь (4 асуултаас 3 зөв = 75%) */
export const GRAMMAR_PASS_PERCENT = 75;

/** Бүхэл тоогоор харьцуулна — хөвөгч таслалын алдаагүй */
export function isPassingScore(correct: number, total: number) {
  return total > 0 && correct * 100 >= total * GRAMMAR_PASS_PERCENT;
}

export function parseGrammarLevel(raw: string): GrammarLevelSlug | null {
  const slug = raw?.toLowerCase();
  return slug && Object.prototype.hasOwnProperty.call(GRAMMAR_LEVELS, slug)
    ? (slug as GrammarLevelSlug)
    : null;
}
