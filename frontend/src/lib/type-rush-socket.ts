// frontend/src/lib/type-rush-socket.ts
// Тоглоом — онлайн уралдааны Socket.IO client + backend-тэй ижил төрлүүд (backend/src/type-rush/type-rush.types.ts).
import { io, Socket } from 'socket.io-client';
import { api, getAccessToken, setAccessToken } from '@/lib/api';
import type { RaceLevel } from '@/lib/type-rush';

export type RoomStatus = 'lobby' | 'countdown' | 'racing' | 'finished';

export interface NetBot {
  lane: number;
  name: string;
  wpm: number;
  delay: number;
  phase: number;
  finishMs: number;
}

export interface RoomPlayerState {
  userId: string;
  name: string;
  lane: number | null;
  isHost: boolean;
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
  startAt: number | null;
  bots: NetBot[];
  createdAt: number;
}

export interface OpenRoomSummary {
  code: string;
  level: RaceLevel;
  hostName: string;
  playerCount: number;
  maxPlayers: number;
}

export type Ack<T> = { ok: true; data: T } | { ok: false; code: string; message: string };

export interface RoomStatePayload {
  room: RoomState;
  serverNow: number;
}

function isLocalHost(host: string) {
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

/**
 * Socket серверийн үндсэн URL.
 * NEXT_PUBLIC_SOCKET_URL → NEXT_PUBLIC_API_URL → хуудасны origin.
 * Prod дээр API URL нь localhost (серверийн дотоод) бол браузер хүрэхгүй тул origin-ийг ашиглана
 * (reverse proxy /api/socket.io-г backend руу дамжуулах ёстой).
 */
export function socketBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return apiUrl ?? 'http://localhost:8080';
  if (apiUrl) {
    try {
      const apiHost = new URL(apiUrl).hostname;
      if (!isLocalHost(apiHost) || isLocalHost(window.location.hostname)) return apiUrl.replace(/\/$/, '');
    } catch {
      /* буруу URL — origin руу унана */
    }
  }
  return window.location.origin;
}

export function createTypeRushSocket(): Socket {
  return io(`${socketBaseUrl()}/type-rush`, {
    path: '/api/socket.io',
    // Функц хэлбэрээр өгвөл дахин холбогдох бүрт шинэ token авна
    auth: (cb) => cb({ token: getAccessToken() ?? '' }),
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 6,
    reconnectionDelay: 800,
    autoConnect: false,
  });
}

/** Access token дууссан бол refresh хийгээд true буцаана. */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const { data } = await api.post('/auth/refresh');
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function emitAck<T>(socket: Socket, event: string, payload?: unknown, timeoutMs = 8000): Promise<Ack<T>> {
  return new Promise((resolve) => {
    let settled = false;
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok: false, code: 'TIMEOUT', message: 'Сервер хариу өгсөнгүй' });
    }, timeoutMs);
    socket.emit(event, payload ?? {}, (ack: Ack<T> | undefined) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(ack ?? { ok: false, code: 'NO_ACK', message: 'Сервер хариу өгсөнгүй' });
    });
  });
}
