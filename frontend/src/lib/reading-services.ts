// frontend/src/lib/reading-services.ts
import { api } from '@/lib/api';
import { LevelCode } from '@/types/api';

export interface ReadingWord {
  id: string;
  word: string;
  meaningMn: string;
  startOffset: number;
  endOffset: number;
  contextSentence?: string;
  chapterId?: string;
  storyId?: string;
}

export interface ReadingChapter {
  id: string;
  storyId: string;
  title: string;
  body: string;
  order: number;
  /** Админ unlock хийсэн үнэгүй бүлэг */
  isFree?: boolean;
  /** Одоогийн хэрэглэгч уншиж чадах эсэх (VIP || isFree) */
  canRead?: boolean;
  words: ReadingWord[];
  _count?: { words: number };
}

export interface ReadingStoryStats {
  chapters: number;
  words: number;
  minutes: number;
}

export interface ReadingStorySummary {
  id: string;
  title: string;
  levelCode: LevelCode;
  order: number;
  isPublished?: boolean;
  coverUrl?: string | null;
  description?: string | null;
  author?: string | null;
  _count: { words: number; chapters?: number };
}

export interface ReadingStory extends ReadingStorySummary {
  body: string;
  words: ReadingWord[];
  chapters: ReadingChapter[];
  stats?: ReadingStoryStats;
  isPro?: boolean;
}

export async function getReadingStories() {
  const { data } = await api.get<ReadingStorySummary[]>('/reading/stories');
  return data;
}

export async function getReadingStory(id: string) {
  const { data } = await api.get<ReadingStory>(`/reading/stories/${id}`);
  return data;
}

export async function getAdminReadingStories() {
  const { data } = await api.get<ReadingStorySummary[]>('/admin/reading/stories');
  return data;
}

export async function getAdminReadingStory(id: string) {
  const { data } = await api.get<ReadingStory>(`/admin/reading/stories/${id}`);
  return data;
}

export async function createReadingStory(payload: {
  title: string;
  body: string;
  coverUrl?: string;
  description?: string;
  author?: string;
  levelCode?: LevelCode;
  order?: number;
  isPublished?: boolean;
}) {
  const { data } = await api.post<ReadingStory>('/admin/reading/stories', payload);
  return data;
}

export async function updateReadingStory(
  id: string,
  payload: Partial<{
    title: string;
    coverUrl: string | null;
    description: string | null;
    author: string | null;
    levelCode: LevelCode;
    order: number;
    isPublished: boolean;
  }>,
) {
  const { data } = await api.patch<ReadingStory>(`/admin/reading/stories/${id}`, payload);
  return data;
}

export async function deleteReadingStory(id: string) {
  await api.delete(`/admin/reading/stories/${id}`);
}

export async function createReadingChapter(
  storyId: string,
  payload: { title: string; body: string; order?: number },
) {
  const { data } = await api.post<ReadingChapter>(
    `/admin/reading/stories/${storyId}/chapters`,
    payload,
  );
  return data;
}

export async function updateReadingChapter(
  id: string,
  payload: Partial<{ title: string; body: string; order: number; isFree: boolean }>,
) {
  const { data } = await api.patch<ReadingChapter>(`/admin/reading/chapters/${id}`, payload);
  return data;
}

export async function deleteReadingChapter(id: string) {
  await api.delete(`/admin/reading/chapters/${id}`);
}

export async function addReadingWord(
  storyId: string,
  payload: {
    word: string;
    meaningMn: string;
    chapterId?: string;
    startOffset?: number;
    endOffset?: number;
  },
) {
  const { data } = await api.post(`/admin/reading/stories/${storyId}/words`, payload);
  return data;
}

export async function updateReadingWord(
  id: string,
  payload: Partial<{ word: string; meaningMn: string }>,
) {
  const { data } = await api.patch<ReadingWord>(`/admin/reading/words/${id}`, payload);
  return data;
}

export async function deleteReadingWord(id: string) {
  await api.delete(`/admin/reading/words/${id}`);
}

export async function translateWord(q: string, context?: string) {
  const { data } = await api.get<{ word: string; meaningMn: string }>('/reading/translate', {
    params: { q, ...(context ? { context } : {}) },
  });
  return data;
}

export async function autoTranslateStory(id: string, overwrite = false) {
  const { data } = await api.post<{
    added: number;
    skipped: number;
    total: number;
    story: ReadingStory;
  }>(`/admin/reading/stories/${id}/auto-translate`, null, {
    params: overwrite ? { overwrite: 'true' } : undefined,
  });
  return data;
}

export async function autoTranslateChapter(id: string, overwrite = false) {
  const { data } = await api.post<{
    added: number;
    skipped: number;
    total: number;
    chapter: ReadingChapter;
  }>(`/admin/reading/chapters/${id}/auto-translate`, null, {
    params: overwrite ? { overwrite: 'true' } : undefined,
  });
  return data;
}

export interface UserReadingWord {
  id: string;
  userId: string;
  storyId: string;
  readingWordId: string | null;
  word: string;
  meaningMn: string;
  createdAt: string;
  story?: {
    id: string;
    title: string;
    levelCode: LevelCode;
  };
}

export interface ReadingStoryAccess {
  id: string;
  title: string;
  levelCode: LevelCode;
  order: number;
  _count: { words: number };
  free: boolean;
  locked: boolean;
  gamesBlocked: boolean;
  practiceStoryId: string | null;
  canOpen: boolean;
  quizPassed: boolean;
  racePassed: boolean;
  wordsSaved: number;
  nextStoryId: string | null;
  freeChapterCount?: number;
  lockedChapterCount?: number;
  chapters?: Array<{
    id: string;
    title: string;
    order: number;
    isFree: boolean;
    canRead: boolean;
  }>;
}

export interface ReadingAccess {
  plan: string;
  status: string;
  isPro: boolean;
  stories: ReadingStoryAccess[];
}

export async function getReadingAccess() {
  const { data } = await api.get<ReadingAccess>('/reading/access');
  return data;
}

export async function saveReadingWord(payload: {
  word: string;
  meaningMn: string;
  storyId: string;
  readingWordId?: string;
}) {
  const { data } = await api.post<{
    created: boolean;
    alreadyExists: boolean;
    word: UserReadingWord;
  }>('/reading/words/save', payload);
  return data;
}

export async function getMyReadingWords(storyId?: string) {
  const { data } = await api.get<UserReadingWord[]>('/reading/words/mine', {
    params: storyId ? { storyId } : undefined,
  });
  return data;
}

export async function deleteMyReadingWord(id: string) {
  await api.delete(`/reading/words/${id}`);
}

export async function completeReadingQuiz(storyId: string) {
  const { data } = await api.post(`/reading/stories/${storyId}/quiz/complete`);
  return data;
}

export async function completeReadingRace(storyId: string) {
  const { data } = await api.post(`/reading/stories/${storyId}/race/complete`);
  return data;
}

export async function upgradeSubscriptionMock() {
  const { data } = await api.post('/subscriptions/upgrade-mock');
  return data;
}

/** Relative `/api/uploads/...` or absolute URL → browser-usable src */
export function resolveMediaUrl(url?: string | null) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('/')) return trimmed;
  return `/${trimmed}`;
}

export async function uploadReadingCover(file: File) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<{ url: string; filename: string }>(
    '/admin/reading/upload-cover',
    form,
    {
      // Important: omit Content-Type so axios sets multipart boundary
      headers: { 'Content-Type': undefined as unknown as string },
      maxBodyLength: 6 * 1024 * 1024,
      maxContentLength: 6 * 1024 * 1024,
      transformRequest: [
        (body, headers) => {
          if (body instanceof FormData && headers) {
            delete (headers as Record<string, unknown>)['Content-Type'];
          }
          return body;
        },
      ],
    },
  );
  return data;
}
