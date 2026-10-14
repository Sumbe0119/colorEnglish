// frontend/src/lib/draw-guess-socket.ts
// Зураг таах тоглоомын Socket.IO client + backend-тэй ижил төрлүүд (backend/src/draw-guess/draw-guess.types.ts).
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '@/lib/api';
import { socketBaseUrl } from '@/lib/type-rush-socket';

export { emitAck, refreshAccessToken } from '@/lib/type-rush-socket';
export type { Ack } from '@/lib/type-rush-socket';

export type RoomStatus = 'lobby' | 'choosing' | 'drawing' | 'reveal' | 'finished';
export type DrawTool = 'pen' | 'eraser' | 'fill';

export const TURN_SECONDS = 40;
export const HINT_EVERY_SECONDS = 10;
export const MIN_PLAYERS = 2;

export interface WordEntry {
  word: string;
  meaning: string;
}

export interface DrawOp {
  id: string;
  tool: DrawTool;
  color: string;
  size: number;
  /** [x0,y0,x1,y1,...] — 0..1 харьцаа. */
  points: number[];
}

export interface RoomPlayerState {
  userId: string;
  name: string;
  isHost: boolean;
  score: number;
  connected: boolean;
  guessedAt: number | null;
  turnPoints: number;
}

export interface RoomState {
  code: string;
  status: RoomStatus;
  hostUserId: string;
  maxPlayers: number;
  players: RoomPlayerState[];
  round: number;
  totalRounds: number;
  turn: number;
  totalTurns: number;
  turnKey: number;
  drawerUserId: string | null;
  masked: string | null;
  revealedWord: WordEntry | null;
  chooseEndAt: number | null;
  turnStartAt: number | null;
  turnEndAt: number | null;
  createdAt: number;
}

export interface TurnSecret {
  turnKey: number;
  options: WordEntry[] | null;
  word: WordEntry | null;
}

export interface FeedEvent {
  id: string;
  kind: 'guess' | 'correct' | 'system';
  userId: string | null;
  name: string | null;
  text: string;
  at: number;
}

export interface GuessResult {
  correct: boolean;
  points: number;
  close: boolean;
}

export interface OpenRoomSummary {
  code: string;
  hostName: string;
  playerCount: number;
  maxPlayers: number;
}

export interface RoomStatePayload {
  room: RoomState;
  serverNow: number;
}

export function createDrawGuessSocket(): Socket {
  return io(`${socketBaseUrl()}/draw-guess`, {
    path: '/api/socket.io',
    auth: (cb) => cb({ token: getAccessToken() ?? '' }),
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 6,
    reconnectionDelay: 800,
    autoConnect: false,
  });
}
