// backend/src/type-rush/type-rush.types.ts
// Type Rush онлайн уралдааны өрөөний төрлүүд. Frontend-ийн lib/type-rush-socket.ts-тэй ижил бүтэцтэй.

export type RaceLevel = 'A1' | 'A2' | 'B1';
export type RoomStatus = 'lobby' | 'countdown' | 'racing' | 'finished';

export const RACE_LEVELS: RaceLevel[] = ['A1', 'A2', 'B1'];
export const MAX_PLAYERS = 5;
export const COUNTDOWN_MS = 3200;
/** Уралдаан хамгийн ихдээ ийм хугацаанд дуусна — дараа нь автоматаар finished болно. */
export const RACE_TIMEOUT_MS = 180_000;
export const MIN_TEXT_LEN = 10;
export const MAX_TEXT_LEN = 320;

export interface BotProfile {
  lane: number;
  name: string;
  wpm: number;
  /** GO-гийн дараа хөдөлж эхлэх хоцролт (мс). */
  delay: number;
  /** Хурдны долгионы фаз. */
  phase: number;
  /** Урьдчилан тооцсон бариа хүрэх хугацаа (мс). */
  finishMs: number;
}

export interface RoomPlayerState {
  userId: string;
  name: string;
  lane: number | null;
  isHost: boolean;
  /** 0..1 */
  progress: number;
  finishMs: number | null;
  wpm: number | null;
  connected: boolean;
}

export interface RoomState {
  code: string;
  level: RaceLevel;
  status: RoomStatus;
  hostUserId: string;
  maxPlayers: number;
  players: RoomPlayerState[];
  text: string | null;
  /** Серверийн epoch мс — GO болох мөч. */
  startAt: number | null;
  bots: BotProfile[];
  createdAt: number;
}

export interface OpenRoomSummary {
  code: string;
  level: RaceLevel;
  hostName: string;
  playerCount: number;
  maxPlayers: number;
}

export interface SocketUser {
  id: string;
  name: string;
}
