// frontend/src/lib/tug-of-war-socket.ts
// "Олс татах" онлайн горимын Socket.IO client + backend-тэй ижил төрлүүд (backend/src/tug-of-war/tug-of-war.types.ts).
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '@/lib/api';
import { socketBaseUrl } from '@/lib/type-rush-socket';
import type { Difficulty, Team, TugQuestion } from '@/lib/tug-of-war';

export { emitAck, refreshAccessToken, type Ack } from '@/lib/type-rush-socket';

export type RoomStatus = 'lobby' | 'countdown' | 'playing' | 'finished';
export type FinishReason = 'line' | 'time' | 'forfeit';

export interface RoomPlayerState {
  userId: string;
  name: string;
  team: Team;
  isHost: boolean;
  connected: boolean;
  qIndex: number;
  correct: number;
  wrong: number;
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
  questions: TugQuestion[] | null;
  pos: number;
  startAt: number | null;
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

export interface AnswerResult {
  correct: boolean;
  answer: number;
  pos: number;
  nextIndex: number;
  lockedMs: number;
}

export interface RoomStatePayload {
  room: RoomState;
  serverNow: number;
}

export function createTugOfWarSocket(): Socket {
  return io(`${socketBaseUrl()}/tug-of-war`, {
    path: '/api/socket.io',
    auth: (cb) => cb({ token: getAccessToken() ?? '' }),
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 6,
    reconnectionDelay: 800,
    autoConnect: false,
  });
}
