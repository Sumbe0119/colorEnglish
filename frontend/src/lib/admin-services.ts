import { api } from '@/lib/api';
import { LevelCode, ModuleType } from '@/types/api';

export interface AdminLesson {
  id: string;
  title: string;
  order: number;
  isPublished: boolean;
  estimatedMins: number;
  content?: unknown;
  audioUrl?: string | null;
  videoUrl?: string | null;
  module: {
    id: string;
    type: ModuleType;
    title: string;
    unit: { title: string; level: { code: LevelCode; title: string } };
  };
  questions: Array<{
    id: string;
    type: string;
    order: number;
    prompt: string;
    options?: unknown;
    correctAnswer: unknown;
    explanation: string;
    hint?: string | null;
  }>;
  vocabItems: Array<{
    id: string;
    word: string;
    meaningMn: string;
    exampleSentence: string;
  }>;
}

export interface AdminCurriculumLevel {
  id: string;
  code: LevelCode;
  title: string;
  order: number;
  units: Array<{
    id: string;
    title: string;
    order: number;
    isPublished: boolean;
    modules: Array<{
      id: string;
      type: ModuleType;
      code: string;
      title: string;
      lessons: Array<{
        id: string;
        title: string;
        order: number;
        isPublished: boolean;
        _count: { questions: number; vocabItems: number };
      }>;
    }>;
  }>;
}

export async function getAdminCurriculum() {
  const { data } = await api.get<AdminCurriculumLevel[]>('/admin/curriculum');
  return data;
}

export async function createLevel(payload: {
  code: LevelCode;
  title: string;
  order: number;
  description?: string;
  isPublished?: boolean;
}) {
  const { data } = await api.post('/admin/levels', payload);
  return data;
}

export async function createLesson(payload: {
  moduleId: string;
  title: string;
  order: number;
  content?: Record<string, unknown>;
  estimatedMins?: number;
  isPublished?: boolean;
}) {
  const { data } = await api.post('/admin/lessons', payload);
  return data;
}

export async function getAdminLesson(id: string) {
  const { data } = await api.get<AdminLesson>(`/admin/lessons/${id}`);
  return data;
}

export async function updateLesson(
  id: string,
  payload: Partial<{
    title: string;
    order: number;
    content: Record<string, unknown>;
    estimatedMins: number;
    isPublished: boolean;
    audioUrl: string;
    videoUrl: string;
  }>,
) {
  const { data } = await api.patch(`/admin/lessons/${id}`, payload);
  return data;
}

export async function deleteLesson(id: string) {
  await api.delete(`/admin/lessons/${id}`);
}

export async function createQuestion(
  lessonId: string,
  payload: {
    type: string;
    order: number;
    prompt: string;
    correctAnswer: unknown;
    explanation: string;
    options?: unknown;
    hint?: string;
  },
) {
  const { data } = await api.post(`/admin/lessons/${lessonId}/questions`, payload);
  return data;
}

export async function deleteQuestion(id: string) {
  await api.delete(`/admin/questions/${id}`);
}

export async function createUnit(payload: {
  levelId: string;
  title: string;
  order: number;
  description?: string;
  isPublished?: boolean;
}) {
  const { data } = await api.post('/admin/units', payload);
  return data;
}

export async function createModule(payload: {
  unitId: string;
  type: ModuleType;
  code: string;
  title: string;
  order: number;
  description?: string;
}) {
  const { data } = await api.post('/admin/modules', payload);
  return data;
}

export async function createVocab(
  lessonId: string,
  payload: { word: string; meaningMn: string; exampleSentence: string },
) {
  const { data } = await api.post(`/admin/lessons/${lessonId}/vocabulary`, payload);
  return data;
}

export type AdminUserBilling = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  plan: string;
  planName: string;
  status: string;
  isPro: boolean;
  daysLeft: number | null;
  expiresAt: string | null;
  startedAt: string | null;
  lastPayment: {
    id: string;
    amountMnt: number;
    paidAt: string | null;
    durationDays: number;
    planName: string;
    planCode: string;
  } | null;
};

export async function getAdminUsers() {
  const { data } = await api.get<AdminUserBilling[]>('/admin/users');
  return data;
}

export async function grantAdminUserVipMonth(userId: string, durationDays = 30) {
  const { data } = await api.post<{
    userId: string;
    email: string;
    plan: string;
    planName: string;
    status: string;
    expiresAt: string;
    durationDays: number;
    extended: boolean;
  }>(`/admin/users/${userId}/grant-month`, { durationDays });
  return data;
}
