// frontend/src/lib/grammar/progress.ts
// Дүрмийн явцыг localStorage-д хадгална (уншсан дүрэм, шалгалтын шилдэг оноо).

export type RuleProgress = {
  /** Дүрмийн дэлгэрэнгүйг нээж үзсэн эсэх */
  viewed: boolean;
  /** Тухайн дүрмийн шалгалтын шилдэг оноо (зөв тоо) */
  best: number;
  /** Тухайн дүрмийн шалгалтын нийт асуулт (шилдэг оноог авах үеийн) */
  total: number;
};

export type GrammarProgress = Record<number, RuleProgress>;

const KEY = 'ce:a1-grammar:progress:v1';

function canUseStorage() {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

export function loadProgress(): GrammarProgress {
  if (!canUseStorage()) return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as GrammarProgress;
  } catch {
    return {};
  }
}

export function saveProgress(progress: GrammarProgress) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // quota / private mode — явц хадгалагдахгүй ч хуудас ажиллана
  }
}

export function markViewed(progress: GrammarProgress, ruleId: number): GrammarProgress {
  const prev = progress[ruleId] ?? { viewed: false, best: 0, total: 0 };
  if (prev.viewed) return progress;
  return { ...progress, [ruleId]: { ...prev, viewed: true } };
}

export function recordQuiz(
  progress: GrammarProgress,
  ruleId: number,
  correct: number,
  total: number,
): GrammarProgress {
  const prev = progress[ruleId] ?? { viewed: false, best: 0, total: 0 };
  const prevRatio = prev.total ? prev.best / prev.total : -1;
  const ratio = total ? correct / total : 0;
  if (ratio <= prevRatio) return progress;
  return { ...progress, [ruleId]: { ...prev, best: correct, total } };
}

export function isMastered(p: RuleProgress | undefined): boolean {
  return !!p && p.total > 0 && p.best === p.total;
}
