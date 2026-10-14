// backend/src/draw-guess/draw-guess.types.ts
// Зурж таах тоглоомын өрөөний төрлүүд. Frontend-ийн lib/draw-guess-socket.ts-тэй ижил бүтэцтэй.

export type RoomStatus = 'lobby' | 'choosing' | 'drawing' | 'reveal' | 'finished';
export type DrawTool = 'pen' | 'eraser' | 'fill';

export const MAX_PLAYERS = 8;
export const MIN_PLAYERS = 2;
/** Бүх тоглогч хэдэн удаа зурах вэ. */
export const ROUNDS = 3;
export const WORD_OPTIONS = 3;
/** Үг сонгох хугацаа — дуусвал эхний үгийг автоматаар сонгоно. */
export const CHOOSE_MS = 15_000;
/** Нэг ээлжийн зурах/таах хугацаа. */
export const TURN_MS = 40_000;
/** Ийм давтамжтайгаар үгний нэг үсгийг тип болгон нээнэ. */
export const HINT_EVERY_MS = 10_000;
/** Ээлж дууссаны дараа үгийг харуулах хугацаа. */
export const REVEAL_MS = 5_000;
/** Нэг ээлжинд хадгалах зураасны дээд тоо. */
export const MAX_OPS = 800;
export const MAX_POINTS_PER_OP = 4000;
/** Зурсан тоглогч зөв таасан хүн бүрээс авах оноо. */
export const DRAWER_POINTS_PER_GUESS = 10;
export const MAX_GUESS_LEN = 40;

/** Зөв таасан дарааллаар авах оноо: 1-р → 100, дараа нь буурна. */
export function pointsForRank(rank: number): number {
  return Math.max(20, 100 - 20 * (rank - 1));
}

export interface WordEntry {
  word: string;
  meaning: string;
}

/**
 * Зураасны нэг хэсэг. Координатууд 0..1 (самбарын өргөн/өндөрт харьцуулсан), [x0,y0,x1,y1,...].
 * Ижил id-тай op дараалан ирвэл нэг зураасны үргэлжлэл гэж үзээд цэгүүдийг залгана.
 */
export interface DrawOp {
  id: string;
  tool: DrawTool;
  color: string;
  size: number;
  points: number[];
}

export interface RoomPlayerState {
  userId: string;
  name: string;
  isHost: boolean;
  score: number;
  connected: boolean;
  /** Энэ ээлжинд зөв таасан мөч (серверийн epoch мс). */
  guessedAt: number | null;
  /** Энэ ээлжинд авсан оноо (тааснаар эсвэл зурснаар). */
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
  /** 1-ээс эхлэх нийт ээлжийн дугаар. */
  turn: number;
  totalTurns: number;
  /** Ээлж бүрт нэмэгдэнэ — client самбараа цэвэрлэх түлхүүр. */
  turnKey: number;
  drawerUserId: string | null;
  /** Таагчдад харагдах үг: нээгдсэн үсэг эсвэл "_" (зай хэвээр). */
  masked: string | null;
  /** Ээлж дууссаны дараа (reveal) болон тоглоом дууссаны дараа бүх хүнд харагдах үг. */
  revealedWord: WordEntry | null;
  chooseEndAt: number | null;
  turnStartAt: number | null;
  turnEndAt: number | null;
  createdAt: number;
}

/** Зөвхөн зурж буй тоглогч руу илгээнэ. */
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
  /** Буруу ч нэг үсгээр л зөрсөн. */
  close: boolean;
}

export interface OpenRoomSummary {
  code: string;
  hostName: string;
  playerCount: number;
  maxPlayers: number;
}

export interface SocketUser {
  id: string;
  name: string;
}
