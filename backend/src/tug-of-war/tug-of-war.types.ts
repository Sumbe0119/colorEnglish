// backend/src/tug-of-war/tug-of-war.types.ts
// "Олс татах" онлайн өрөөний төрлүүд. Frontend-ийн lib/tug-of-war-socket.ts-тэй ижил бүтэцтэй.
// Дүрмийн тогтмолууд frontend/src/lib/tug-of-war.ts-тэй яг ижил байх ёстой.

export type Team = 'red' | 'blue';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type RoomStatus = 'lobby' | 'countdown' | 'playing' | 'finished';
export type FinishReason = 'line' | 'time' | 'forfeit';

export const TEAMS: Team[] = ['red', 'blue'];
export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
export const DURATIONS = [180, 300, 480, 600];
export const MAX_PLAYERS = 2;
export const COUNTDOWN_MS = 3200;
export const PULL_STEP = 0.12;
export const WRONG_LOCK_MS = 1200;
export const CORRECT_LOCK_MS = 450;
export const MIN_QUESTIONS = 10;
export const MAX_QUESTIONS = 120;
export const POINTS_PER_CORRECT = 10;
export const WIN_BONUS: Record<Difficulty, number> = { easy: 20, medium: 40, hard: 60, expert: 80 };

export interface TugQuestion {
  text: string;
  options: string[];
  answer: number;
  mn: string;
}

export interface RoomPlayerState {
  userId: string;
  name: string;
  team: Team;
  isHost: boolean;
  connected: boolean;
  /** Одоо харж буй асуултын индекс (questions массивт). */
  qIndex: number;
  correct: number;
  wrong: number;
  /** Сүүлийн хариултын үр дүн (эсрэг талын картад харуулна). */
  lastResult: 'correct' | 'wrong' | null;
  lastOption: number | null;
}

export interface RoomState {
  code: string;
  status: RoomStatus;
  hostUserId: string;
  difficulty: Difficulty;
  durationSec: number;
  players: RoomPlayerState[];
  /** Lobby-д null; тоглолт эхлэхэд бүх асуулт (эсрэг талын картыг харуулахад хэрэгтэй). */
  questions: TugQuestion[] | null;
  /** Олсны туузны байрлал: -1 улаан шугам … +1 цэнхэр шугам. */
  pos: number;
  /** Серверийн epoch мс — GO болох мөч. */
  startAt: number | null;
  /** Серверийн epoch мс — хугацаа дуусах мөч. */
  endAt: number | null;
  winner: Team | 'draw' | null;
  reason: FinishReason | null;
  createdAt: number;
}

export interface OpenRoomSummary {
  code: string;
  hostName: string;
  hostTeam: Team;
  difficulty: Difficulty;
  durationSec: number;
  playerCount: number;
  maxPlayers: number;
}

export interface SocketUser {
  id: string;
  name: string;
}

export interface AnswerResult {
  correct: boolean;
  answer: number;
  pos: number;
  nextIndex: number;
  lockedMs: number;
}
