// frontend/src/lib/listening-services.ts
// "Сонсох" тоглоомын API: клипүүд, үгийн тайлбар, оролдлого, админ CRUD.
import { api } from './api';
import type { SubmitScoreResult } from './games-services';

export type ListeningLevel = 'A1' | 'A2' | 'B1' | 'B1_PLUS' | 'B2' | 'B2_PLUS' | 'C1' | 'C2';

export interface Segment {
  start: number;
  end: number;
  text: string;
}

export interface ClipSummary {
  id: string;
  title: string;
  description: string | null;
  youtubeId: string;
  startSec: number;
  endSec: number;
  levelCode: ListeningLevel;
  wordTotal: number;
  wordDone: number;
}

export interface CandidateWord {
  word: string;
  count: number;
}

export interface ClipDetail {
  id: string;
  title: string;
  description: string | null;
  youtubeId: string;
  startSec: number;
  endSec: number;
  levelCode: ListeningLevel;
  segments: Segment[];
  words: CandidateWord[];
  mastered: string[];
  attempts: { word: string; correct: boolean; expected: number; clicked: number; createdAt: string }[];
}

export interface WordInfo {
  word: string;
  ipa: string | null;
  pos: string[];
  meaningMn: string;
  definitionEn: string;
  forms: string;
  grammarMn: string;
  examples: { en: string; mn: string }[];
  collocations: string[];
  synonyms: string[];
  level: string | null;
  inContextMn: string | null;
}

export interface AttemptResult {
  word: string;
  expected: number;
  clicked: number;
  correct: boolean;
  score: number;
  game: SubmitScoreResult | null;
}

export async function fetchClips() {
  const { data } = await api.get<ClipSummary[]>('/listening/clips');
  return data;
}

export async function fetchClip(id: string) {
  const { data } = await api.get<ClipDetail>(`/listening/clips/${id}`);
  return data;
}

export async function fetchWordInfo(word: string, context?: string) {
  const { data } = await api.get<{ info: WordInfo; source: string }>(`/listening/words/${encodeURIComponent(word)}`, {
    params: context ? { context } : undefined,
  });
  return data;
}

export async function submitAttempt(payload: { clipId: string; word: string; clicked: number; clickTimes?: number[] }) {
  const { data } = await api.post<AttemptResult>('/listening/attempts', payload);
  return data;
}

// ── Админ ──

export interface AdminClip {
  id: string;
  title: string;
  description: string | null;
  youtubeId: string;
  startSec: number;
  endSec: number;
  levelCode: ListeningLevel;
  isPublished: boolean;
  order: number;
  segmentCount: number;
  words: CandidateWord[];
  attempts: number;
  createdAt: string;
}

export async function getAdminClips() {
  const { data } = await api.get<AdminClip[]>('/listening/admin/clips');
  return data;
}

export async function createAdminClip(payload: {
  youtube: string;
  startSec: number;
  endSec: number;
  title?: string;
  description?: string;
  levelCode?: ListeningLevel;
  isPublished?: boolean;
}) {
  const { data } = await api.post<AdminClip>('/listening/admin/clips', payload);
  return data;
}

export async function updateAdminClip(
  id: string,
  payload: Partial<{ title: string; description: string; levelCode: ListeningLevel; isPublished: boolean; order: number; startSec: number; endSec: number }>,
) {
  const { data } = await api.patch<AdminClip>(`/listening/admin/clips/${id}`, payload);
  return data;
}

export async function refetchAdminClip(id: string) {
  const { data } = await api.post<AdminClip>(`/listening/admin/clips/${id}/refetch`);
  return data;
}

export async function deleteAdminClip(id: string) {
  await api.delete(`/listening/admin/clips/${id}`);
}

export async function getAdminAiStatus() {
  const { data } = await api.get<{ ai: boolean }>('/listening/admin/ai-status');
  return data;
}

export async function warmWordInfos() {
  const { data } = await api.post<{ generated: number; skipped: number; failed: number; busy: boolean }>('/listening/admin/words/warm');
  return data;
}

export async function regenerateWordInfo(word: string) {
  const { data } = await api.post<{ info: WordInfo; source: string }>(`/listening/admin/words/${encodeURIComponent(word)}/regenerate`);
  return data;
}
