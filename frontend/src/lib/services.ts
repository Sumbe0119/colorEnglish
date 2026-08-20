import { api, setAccessToken } from '@/lib/api';
import { AuthResponse, User } from '@/types/auth';
import { DashboardData, LessonModule, LevelCode, ModuleType } from '@/types/api';

let restorePromise: Promise<AuthResponse | null> | null = null;

export async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function register(firstName: string, email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/register', { firstName, email, password });
  return data;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function requestPasswordReset(email: string) {
  const { data } = await api.post<{ success: boolean }>('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  const { data } = await api.post<{ success: boolean }>('/auth/reset-password', {
    email,
    code,
    newPassword,
  });
  return data;
}

export async function restoreSession() {
  if (restorePromise) return restorePromise;

  restorePromise = (async () => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('ce_access_token') : null;
    if (stored) {
      setAccessToken(stored);
      try {
        const user = await getMe();
        return { user, accessToken: stored };
      } catch {
        // access token хүчингүй — refresh cookie оролдоно
      }
    }

    try {
      const { data } = await api.post<AuthResponse>('/auth/refresh');
      setAccessToken(data.accessToken);
      return data;
    } catch {
      setAccessToken(null);
      return null;
    }
  })();

  try {
    return await restorePromise;
  } finally {
    restorePromise = null;
  }
}

export async function getMe() {
  const { data } = await api.get<{ user: User & { profile?: { onboardingCompleted: boolean } } }>(
    '/auth/me',
  );
  return data.user;
}

export async function completeOnboarding(payload: {
  interests: string[];
  selfAssessedLevel: LevelCode;
  dailyGoalMinutes: number;
}) {
  const { data } = await api.post('/profile/onboarding', payload);
  return data;
}

export interface StudentProfile {
  id: string;
  userId: string;
  selfAssessedLevel: LevelCode | null;
  placementLevel: LevelCode | null;
  currentLevel: LevelCode;
  interests: string[];
  dailyGoalMinutes: number;
  motivationNote: string | null;
  onboardingCompleted: boolean;
  onboardingCompletedAt: string | null;
  user: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
}

export async function getProfile() {
  const { data } = await api.get<StudentProfile>('/profile');
  return data;
}

export async function getDashboard() {
  const { data } = await api.get<DashboardData>('/progress/dashboard');
  return data;
}

export async function getLevels() {
  const { data } = await api.get('/curriculum/levels');
  return data;
}

export async function getLevel(code: LevelCode) {
  const { data } = await api.get(`/curriculum/levels/${code}`);
  return data;
}

export async function getModulesByType(type: ModuleType, level?: LevelCode) {
  const { data } = await api.get<LessonModule[]>('/curriculum/modules', {
    params: { type, level },
  });
  return data;
}

export async function getModule(moduleId: string) {
  const { data } = await api.get(`/curriculum/modules/${moduleId}`);
  return data;
}

export async function getLesson(lessonId: string) {
  const { data } = await api.get(`/curriculum/lessons/${lessonId}`);
  return data;
}

export async function startLesson(lessonId: string) {
  const { data } = await api.post(`/progress/lessons/${lessonId}/start`);
  return data;
}

export async function submitLesson(
  lessonId: string,
  answers: Array<{ questionId: string; userAnswer: unknown }>,
) {
  const { data } = await api.post(`/progress/lessons/${lessonId}/submit`, { answers });
  return data;
}

export async function getExamByUnit(unitId: string) {
  const { data } = await api.get(`/exams/by-unit/${unitId}`);
  return data;
}

export async function getSpeakingSessions() {
  const { data } = await api.get('/speaking/sessions');
  return data;
}

export async function createSpeakingSession(topic: string, levelCode: LevelCode) {
  const { data } = await api.post('/speaking/sessions', { topic, levelCode });
  return data;
}

export async function getWritingSubmissions() {
  const { data } = await api.get('/writing/submissions');
  return data;
}

export async function submitWriting(prompt: string, originalText: string) {
  const { data } = await api.post('/writing/submissions', { prompt, originalText });
  return data;
}

export async function getVocabularyReview() {
  const { data } = await api.get('/vocabulary/review');
  return data;
}

export async function getNotifications() {
  const { data } = await api.get('/notifications');
  return data;
}

export async function getSubscription() {
  const { data } = await api.get('/subscriptions/me');
  return data;
}
