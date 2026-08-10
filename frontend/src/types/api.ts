export type LevelCode = 'A1' | 'A2' | 'B1' | 'B1_PLUS' | 'B2' | 'B2_PLUS' | 'C1' | 'C2';

export const LEVEL_CODES: LevelCode[] = ['A1', 'A2', 'B1', 'B1_PLUS', 'B2', 'B2_PLUS', 'C1', 'C2'];

export function formatLevelCode(code: LevelCode) {
  return code.replace('_', '+');
}

export type ModuleType =
  | 'GRAMMAR'
  | 'READING'
  | 'DICTATION_QUIZ'
  | 'SHADOWING'
  | 'SPEAKING'
  | 'WRITING'
  | 'SENTENCE_SORT'
  | 'VOCABULARY';

export interface DashboardData {
  profile: {
    currentLevel: LevelCode;
    dailyGoalMinutes: number;
    onboardingCompleted: boolean;
  } | null;
  streak: { currentStreak: number; longestStreak: number } | null;
  enrollment: { progressPercent: number; level: { code: LevelCode; title: string } } | null;
  subscription: { plan: string; status: string } | null;
  stats: {
    lessonsCompleted: number;
    lessonsInProgress: number;
    totalStudyMinutes: number;
    averageScore: number;
    vocabularyLearned: number;
  };
  currentLevel: {
    code: LevelCode;
    title: string;
    units: Array<{
      id: string;
      title: string;
      modules: Array<{
        id: string;
        type: ModuleType;
        code: string;
        title: string;
        description: string | null;
      }>;
    }>;
  } | null;
  progressPercent: number;
}

export interface LessonModule {
  id: string;
  type: ModuleType;
  code: string;
  title: string;
  description: string | null;
  unit: { id: string; title: string; level: { code: LevelCode; title: string } };
  _count: { lessons: number };
}

export const MODULE_TYPE_SLUG: Record<ModuleType, string> = {
  GRAMMAR: 'grammar',
  READING: 'reading',
  DICTATION_QUIZ: 'dictation',
  SHADOWING: 'shadowing',
  SPEAKING: 'speaking',
  WRITING: 'writing',
  SENTENCE_SORT: 'sort',
  VOCABULARY: 'vocabulary',
};

export const SLUG_TO_MODULE_TYPE: Record<string, ModuleType> = Object.fromEntries(
  Object.entries(MODULE_TYPE_SLUG).map(([k, v]) => [v, k as ModuleType]),
);
