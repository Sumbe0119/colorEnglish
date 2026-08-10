// frontend/src/lib/onboarding-labels.ts
import type { LevelCode } from '@/types/api';

export type GoalInterest =
  | 'TRAVEL'
  | 'WORK_CAREER'
  | 'EXAM_IELTS_TOEFL'
  | 'STUDY_ABROAD'
  | 'DAILY_CONVERSATION'
  | 'MOVIES_SERIES'
  | 'BUSINESS'
  | 'OTHER';

export const GOAL_LABELS: Record<GoalInterest, { label: string; desc: string }> = {
  TRAVEL: { label: 'Аялал', desc: 'Гадаадад аялахад' },
  WORK_CAREER: { label: 'Ажил, карьер', desc: 'Ажлын орчинд' },
  EXAM_IELTS_TOEFL: { label: 'IELTS / TOEFL', desc: 'Шалгалтанд бэлдэх' },
  DAILY_CONVERSATION: { label: 'Өдөр тутмын яриа', desc: 'Чөлөөтэй харилцах' },
  MOVIES_SERIES: { label: 'Кино, цуврал', desc: 'Subtitle гаргахгүйгээр' },
  STUDY_ABROAD: { label: 'Гадаадад суралцах', desc: 'Их сургуульд элсэх' },
  BUSINESS: { label: 'Бизнес', desc: 'Мэргэжлийн анги' },
  OTHER: { label: 'Бусад', desc: 'Өөр зорилгоор' },
};

export const LEVEL_LABELS: Partial<Record<LevelCode, { label: string; desc: string }>> = {
  A1: { label: 'A1 — Анхан шат', desc: 'Англи хэлийг ойлгодоггүй / зүгээр л эхэлж байна' },
  A2: { label: 'A2 — Дунд анхан', desc: 'Зарим үг мэддэг, энгийн өгүүлбэр зохиож чаддаг' },
  B1: { label: 'B1 — Дунд шат', desc: 'Өдөр тутмын ярианд хэсэгчлэн оролцож чаддаг' },
  B1_PLUS: { label: 'B1+ — Дунд дэвшсэн', desc: 'Нилээд чөлөөтэй ярьдаг, дүрмийн алдаа гарна' },
  B2: { label: 'B2 — Ахисан дунд', desc: 'Ихэнх нөхцөлд чөлөөтэй харилцаж чаддаг' },
};

export function formatGoalInterest(id: string) {
  return GOAL_LABELS[id as GoalInterest]?.label ?? id;
}

export function formatSelfAssessedLevel(code: string | null | undefined) {
  if (!code) return 'Тодорхойлоогүй';
  return LEVEL_LABELS[code as LevelCode]?.label ?? code.replace('_', '+');
}
