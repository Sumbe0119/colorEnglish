// Нэвтрээгүй хэрэглэгч onboarding-ийн судалгааг бөглөөд бүртгүүлж/нэвтэрч байх хооронд
// хариултыг алдахгүйн тулд localStorage-д түр хадгална. Хэрэглэгч дээр хадгалагдмагц устгана.
import { LEARNING_STYLES, LEARNING_STYLE_QUESTIONS, type LearningStyle } from '@/lib/learning-style';
import { GOAL_LABELS } from '@/lib/onboarding-labels';
import { LEVEL_CODES, type LevelCode } from '@/types/api';

const DRAFT_KEY = 'ce:onboarding-draft';
/** Энэ таб дээр судалгаа дуусч бүртгэлийн алхамд хүрсэн эсэх (нэвтрэх/баталгаажуулах хуудас руу гарч буцаж ирэхэд) */
const HANDOFF_KEY = 'ce:onboarding-handoff';
/** Хуучин draft-ийг (жишээ нь нэг компьютер ашигладаг өөр хүнийх) удаан хадгалахгүй */
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

export type OnboardingStep = 'goals' | 'level' | 'time' | 'survey' | 'register' | 'result';

const RESUMABLE_STEPS: OnboardingStep[] = ['goals', 'level', 'time', 'survey', 'register'];

export type OnboardingDraft = {
  interests: string[];
  selfAssessedLevel: LevelCode | '';
  dailyGoalMinutes: number;
  learningStyleAnswers: (LearningStyle | null)[];
  step: OnboardingStep;
  /** Нэвтэрсэн үед хадгалсан бол тухайн хэрэглэгчийн id; зочноор бөглөсөн бол null */
  ownerId: string | null;
  /** Onboarding дотор бүртгүүлсэн (кодоо хараахан оруулаагүй) и-мэйл */
  pendingEmail: string | null;
  savedAt: number;
};

type DraftContent = Omit<OnboardingDraft, 'savedAt'>;

export function loadOnboardingDraft(): OnboardingDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Partial<OnboardingDraft>;

    if (typeof d.savedAt !== 'number' || Date.now() - d.savedAt > DRAFT_TTL_MS) {
      clearOnboardingDraft();
      return null;
    }

    // Гараар өөрчилсөн / хуучин хувилбарын утга backend-ийн enum шалгалтад унахаас сэргийлнэ
    const answers = Array.isArray(d.learningStyleAnswers) ? d.learningStyleAnswers : [];
    const minutes = Number(d.dailyGoalMinutes);
    return {
      interests: Array.isArray(d.interests) ? d.interests.filter((x) => typeof x === 'string' && Object.keys(GOAL_LABELS).includes(x)) : [],
      selfAssessedLevel: LEVEL_CODES.includes(d.selfAssessedLevel as LevelCode) ? (d.selfAssessedLevel as LevelCode) : '',
      dailyGoalMinutes: Number.isInteger(minutes) && minutes >= 10 && minutes <= 90 ? minutes : 30,
      // Асуултын тоо өөрчлөгдсөн ч эвдрэхгүй — одоогийн асуулт бүрд тааруулна
      learningStyleAnswers: LEARNING_STYLE_QUESTIONS.map((_, i) =>
        LEARNING_STYLES.includes(answers[i] as LearningStyle) ? (answers[i] as LearningStyle) : null,
      ),
      step: RESUMABLE_STEPS.includes(d.step as OnboardingStep) ? (d.step as OnboardingStep) : 'goals',
      ownerId: typeof d.ownerId === 'string' ? d.ownerId : null,
      pendingEmail: typeof d.pendingEmail === 'string' ? d.pendingEmail : null,
      savedAt: d.savedAt,
    };
  } catch {
    return null;
  }
}

export function saveOnboardingDraft(draft: DraftContent) {
  try {
    // Агуулга өөрчлөгдөөгүй бол savedAt-ийг шинэчлэхгүй — хуудас нээх бүрт TTL сунгагдахгүй
    const existing = loadOnboardingDraft();
    if (existing) {
      const { savedAt: _savedAt, ...existingContent } = existing;
      if (JSON.stringify(existingContent) === JSON.stringify(draft)) return;
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch {
    /* storage боломжгүй бол зөвхөн санах ойд үлдэнэ */
  }
}

export function clearOnboardingDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

/** Бүх алхам, бүх асуулт бөглөгдсөн эсэх — зөвхөн ийм draft-ийг хэрэглэгч дээр хадгална */
export function isOnboardingDraftComplete(draft: OnboardingDraft | null): draft is OnboardingDraft {
  return Boolean(
    draft &&
      draft.interests.length > 0 &&
      draft.selfAssessedLevel &&
      draft.learningStyleAnswers.every((a) => a !== null),
  );
}

export function markOnboardingHandoff() {
  try {
    sessionStorage.setItem(HANDOFF_KEY, '1');
  } catch {
    /* ignore */
  }
}

/** Тэмдгийг уншаад устгана — нэг удаа л ашиглагдана */
export function consumeOnboardingHandoff(): boolean {
  try {
    const marked = sessionStorage.getItem(HANDOFF_KEY) === '1';
    sessionStorage.removeItem(HANDOFF_KEY);
    return marked;
  } catch {
    return false;
  }
}
