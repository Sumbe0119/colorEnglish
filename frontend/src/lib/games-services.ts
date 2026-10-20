// frontend/src/lib/games-services.ts
// Тоглоомын оноо бүртгэх, leaderboard авах, "Өгүүлбэр бүтээх"-ийн эзэмшсэн өгүүлбэрүүдийг хадгалах API.
import { api } from './api';

export type GameKind = 'SENTENCE_BUILDER' | 'TYPE_RUSH' | 'DRAW_GUESS';
export type LeaderboardScope = 'ALL' | GameKind;

export const GAME_LABELS: Record<GameKind, { title: string; short: string; unit: string; href: string }> = {
  SENTENCE_BUILDER: { title: 'Өгүүлбэр бүтээх', short: 'Өгүүлбэр', unit: 'оноо', href: '/sentence-builder' },
  TYPE_RUSH: { title: 'Бичих уралдаан', short: 'Уралдаан', unit: 'WPM', href: '/type-rush' },
  DRAW_GUESS: { title: 'Зураг таах', short: 'Зураг', unit: 'оноо', href: '/draw-guess' },
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  avatarUrl: string | null;
  score: number;
  plays: number;
  perGame?: Partial<Record<GameKind, number>>;
};

export type LeaderboardResult = {
  game: LeaderboardScope;
  total: number;
  entries: LeaderboardEntry[];
  me: { rank: number; score: number; plays: number } | null;
};

export type SubmitScoreResult = {
  game: GameKind;
  score: number;
  best: number;
  isNewBest: boolean;
  rank: number;
  plays: number;
};

export async function submitGameScore(game: GameKind, score: number, meta?: Record<string, unknown>) {
  const { data } = await api.post<SubmitScoreResult>('/games/scores', { game, score, meta });
  return data;
}

export async function fetchLeaderboard(game: LeaderboardScope = 'ALL', limit = 50) {
  const { data } = await api.get<LeaderboardResult>('/games/leaderboard', { params: { game, limit } });
  return data;
}

export async function fetchSentenceMastery() {
  const { data } = await api.get<{ keys: string[]; byLevel: Record<string, number> }>('/games/sentence-mastery');
  return data;
}

export async function addSentenceMastery(items: { key: string; level?: number }[]) {
  const { data } = await api.post<{ added: number; total: number }>('/games/sentence-mastery', { items });
  return data;
}

export async function resetSentenceMastery() {
  const { data } = await api.delete<{ removed: number }>('/games/sentence-mastery');
  return data;
}
