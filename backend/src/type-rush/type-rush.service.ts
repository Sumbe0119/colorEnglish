// backend/src/type-rush/type-rush.service.ts
// Онлайн уралдааны өрөөнүүд — санах ойд хадгална (нэг backend instance).
import { Injectable, Logger } from '@nestjs/common';
import {
  BotProfile,
  COUNTDOWN_MS,
  MAX_PLAYERS,
  MAX_TEXT_LEN,
  MIN_TEXT_LEN,
  OpenRoomSummary,
  RACE_LEVELS,
  RACE_TIMEOUT_MS,
  RaceLevel,
  RoomPlayerState,
  RoomState,
  RoomStatus,
  SocketUser,
} from './type-rush.types';

export class RoomError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

interface Player {
  userId: string;
  name: string;
  socketId: string;
  lane: number | null;
  progress: number;
  finishMs: number | null;
  wpm: number | null;
  connected: boolean;
}

interface Room {
  code: string;
  level: RaceLevel;
  status: RoomStatus;
  hostUserId: string;
  players: Map<string, Player>;
  text: string | null;
  startAt: number | null;
  bots: BotProfile[];
  createdAt: number;
  timers: NodeJS.Timeout[];
}

const BOT_NAMES = ['Бат', 'Сараа', 'Тэмүүлэн', 'Номин', 'Анар', 'Хулан', 'Ганаа', 'Долгор', 'Мишээл', 'Отгоо'];
const BOT_WPM: Record<RaceLevel, [number, number]> = { A1: [14, 30], A2: [20, 38], B1: [26, 46] };
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
/** Ботын хурдны долгион — frontend lib/type-rush.ts-ийн botCharsAt-тай яг ижил байх ёстой. */
const WAVE_FREQ = 0.9;
const WAVE_AMP = 0.1;

export function botCharsAt(bot: { wpm: number; delay: number; phase: number }, elapsedMs: number): number {
  const t = Math.max(0, (elapsedMs - bot.delay) / 1000);
  const cps = (bot.wpm * 5) / 60;
  const wave = (WAVE_AMP / WAVE_FREQ) * (Math.cos(bot.phase) - Math.cos(WAVE_FREQ * t + bot.phase));
  return cps * (t + wave);
}

function botFinishMs(bot: { wpm: number; delay: number; phase: number }, totalChars: number): number {
  // Хаалттай томьёо байхгүй тул 20мс алхамаар симуляц хийнэ
  for (let t = 0; t <= RACE_TIMEOUT_MS; t += 20) {
    if (botCharsAt(bot, t) >= totalChars) return t;
  }
  return RACE_TIMEOUT_MS;
}

function computeWpm(chars: number, ms: number): number {
  if (ms <= 0) return 0;
  return Math.round(chars / 5 / (ms / 60000));
}

@Injectable()
export class TypeRushService {
  private readonly logger = new Logger(TypeRushService.name);
  private rooms = new Map<string, Room>();
  /** userId → room code */
  private byUser = new Map<string, string>();
  /** Өрөөний төлөв өөрчлөгдөхөд gateway-д мэдэгдэх callback (timer-ээр өөрчлөгдөх үед). */
  onRoomChanged: ((room: RoomState) => void) | null = null;

  // ---------- Өрөө үүсгэх / нэгдэх / гарах ----------

  createRoom(user: SocketUser, socketId: string, level: RaceLevel): RoomState {
    this.leaveRoom(user.id, socketId);
    const code = this.generateCode();
    const room: Room = {
      code,
      level: RACE_LEVELS.includes(level) ? level : 'A1',
      status: 'lobby',
      hostUserId: user.id,
      players: new Map(),
      text: null,
      startAt: null,
      bots: [],
      createdAt: Date.now(),
      timers: [],
    };
    room.players.set(user.id, this.newPlayer(user, socketId, 0));
    this.rooms.set(code, room);
    this.byUser.set(user.id, code);
    return this.toState(room);
  }

  joinRoom(user: SocketUser, socketId: string, rawCode: string): RoomState {
    const code = (rawCode ?? '').trim().toUpperCase();
    const room = this.rooms.get(code);
    if (!room) throw new RoomError('NOT_FOUND', 'Ийм кодтой өрөө олдсонгүй');

    const existing = room.players.get(user.id);
    if (existing) {
      // Дахин холбогдож байна (шинэ таб, сүлжээ тасарсан)
      existing.socketId = socketId;
      existing.connected = true;
      this.byUser.set(user.id, code);
      return this.toState(room);
    }

    if (room.status !== 'lobby') throw new RoomError('IN_PROGRESS', 'Энэ өрөөнд уралдаан явагдаж байна');
    if (room.players.size >= MAX_PLAYERS) throw new RoomError('FULL', 'Өрөө дүүрсэн байна (5 тоглогч)');

    this.leaveRoom(user.id, socketId);
    room.players.set(user.id, this.newPlayer(user, socketId, this.firstFreeLane(room)));
    this.byUser.set(user.id, code);
    return this.toState(room);
  }

  /**
   * Хэрэглэгчийг өрөөнөөс гаргана. socketId өгвөл зөвхөн тэр socket-ийн тоглогч бол гаргана
   * (өөр табаар дахин холбогдсон бол хуучин socket салахад гаргахгүй).
   * Буцаах: өөрчлөгдсөн өрөө (устгагдсан бол null) болон өрөөний код.
   */
  leaveRoom(userId: string, socketId?: string): { room: RoomState | null; code: string | null } {
    const code = this.byUser.get(userId);
    if (!code) return { room: null, code: null };
    const room = this.rooms.get(code);
    if (!room) {
      this.byUser.delete(userId);
      return { room: null, code: null };
    }
    const player = room.players.get(userId);
    if (!player) {
      this.byUser.delete(userId);
      return { room: null, code };
    }
    if (socketId && player.socketId !== socketId) return { room: this.toState(room), code };

    if (room.status === 'racing' || room.status === 'countdown') {
      // Уралдааны дундуур гарвал байраа алдана, бусад нь үргэлжлүүлнэ
      player.connected = false;
      this.byUser.delete(userId);
      this.maybeFinish(room);
      if (![...room.players.values()].some((p) => p.connected)) {
        this.destroyRoom(room);
        return { room: null, code };
      }
    } else {
      room.players.delete(userId);
      this.byUser.delete(userId);
      if (room.players.size === 0) {
        this.destroyRoom(room);
        return { room: null, code };
      }
    }

    if (room.hostUserId === userId) {
      const next = [...room.players.values()].find((p) => p.connected) ?? [...room.players.values()][0];
      if (next) room.hostUserId = next.userId;
    }
    return { room: this.toState(room), code };
  }

  pickLane(userId: string, lane: number): RoomState {
    const { room, player } = this.requirePlayer(userId);
    if (room.status !== 'lobby') throw new RoomError('IN_PROGRESS', 'Уралдаан эхэлсэн үед машин солихгүй');
    if (!Number.isInteger(lane) || lane < 0 || lane >= MAX_PLAYERS) throw new RoomError('BAD_LANE', 'Буруу зам');
    const taken = [...room.players.values()].some((p) => p.userId !== userId && p.lane === lane);
    if (taken) throw new RoomError('LANE_TAKEN', 'Энэ машиныг өөр тоглогч сонгосон байна');
    player.lane = lane;
    return this.toState(room);
  }

  setLevel(userId: string, level: RaceLevel): RoomState {
    const { room } = this.requireHost(userId);
    if (room.status !== 'lobby') throw new RoomError('IN_PROGRESS', 'Уралдаан эхэлсэн үед түвшин солихгүй');
    if (!RACE_LEVELS.includes(level)) throw new RoomError('BAD_LEVEL', 'Буруу түвшин');
    room.level = level;
    return this.toState(room);
  }

  // ---------- Уралдаан ----------

  start(userId: string, rawText: string): RoomState {
    const { room } = this.requireHost(userId);
    if (room.status !== 'lobby' && room.status !== 'finished') {
      throw new RoomError('IN_PROGRESS', 'Уралдаан аль хэдийн эхэлсэн');
    }
    const text = (rawText ?? '').replace(/\s+/g, ' ').trim();
    if (text.length < MIN_TEXT_LEN || text.length > MAX_TEXT_LEN) {
      throw new RoomError('BAD_TEXT', 'Өгүүлбэрийн урт буруу');
    }

    // Салсан тоглогчдыг цэвэрлэнэ, зам аваагүй хүнд зам өгнө
    for (const [id, p] of room.players) {
      if (!p.connected) {
        room.players.delete(id);
        continue;
      }
      p.progress = 0;
      p.finishMs = null;
      p.wpm = null;
    }
    for (const p of room.players.values()) {
      if (p.lane == null) p.lane = this.firstFreeLane(room);
    }

    room.text = text;
    room.bots = this.buildBots(room, text.length);
    room.startAt = Date.now() + COUNTDOWN_MS;
    room.status = 'countdown';
    this.clearTimers(room);

    room.timers.push(
      setTimeout(() => {
        if (room.status !== 'countdown') return;
        room.status = 'racing';
        this.onRoomChanged?.(this.toState(room));
      }, COUNTDOWN_MS),
    );
    room.timers.push(
      setTimeout(() => {
        if (room.status !== 'racing' && room.status !== 'countdown') return;
        room.status = 'finished';
        this.onRoomChanged?.(this.toState(room));
      }, COUNTDOWN_MS + RACE_TIMEOUT_MS),
    );

    return this.toState(room);
  }

  /** Тоглогчийн явц (0..1). Буцаах: өрөөний код + явц, эсвэл null. */
  progress(userId: string, raw: number): { code: string; progress: number } | null {
    const code = this.byUser.get(userId);
    const room = code ? this.rooms.get(code) : undefined;
    const player = room?.players.get(userId);
    if (!room || !player || room.status !== 'racing' || player.finishMs != null) return null;
    const p = Math.min(1, Math.max(0, Number(raw) || 0));
    if (p < player.progress) return null;
    player.progress = p;
    return { code: room.code, progress: p };
  }

  finish(userId: string, clientMs: number): RoomState {
    const { room, player } = this.requirePlayer(userId);
    if (room.status !== 'racing' || room.startAt == null || !room.text) {
      throw new RoomError('NOT_RACING', 'Уралдаан явагдаагүй байна');
    }
    if (player.finishMs != null) return this.toState(room);

    const serverMs = Date.now() - room.startAt;
    const ms = Number.isFinite(clientMs) && clientMs > 0 && Math.abs(clientMs - serverMs) <= 1500 ? clientMs : serverMs;
    // Хэт хурдан (> 250 WPM) бол серверийн хугацааг ашиглана
    const minMs = (room.text.length / 5 / 250) * 60000;
    player.finishMs = Math.max(ms, minMs);
    player.progress = 1;
    player.wpm = computeWpm(room.text.length, player.finishMs);
    this.maybeFinish(room);
    return this.toState(room);
  }

  again(userId: string): RoomState {
    const { room } = this.requireHost(userId);
    if (room.status === 'racing' || room.status === 'countdown') {
      throw new RoomError('IN_PROGRESS', 'Уралдаан дуусаагүй байна');
    }
    this.clearTimers(room);
    for (const [id, p] of room.players) {
      if (!p.connected) {
        room.players.delete(id);
        continue;
      }
      p.progress = 0;
      p.finishMs = null;
      p.wpm = null;
    }
    room.status = 'lobby';
    room.text = null;
    room.startAt = null;
    room.bots = [];
    return this.toState(room);
  }

  // ---------- Унших ----------

  getRoomByUser(userId: string): RoomState | null {
    const code = this.byUser.get(userId);
    const room = code ? this.rooms.get(code) : undefined;
    return room ? this.toState(room) : null;
  }

  listOpen(): OpenRoomSummary[] {
    const out: OpenRoomSummary[] = [];
    for (const room of this.rooms.values()) {
      if (room.status !== 'lobby' || room.players.size >= MAX_PLAYERS) continue;
      const host = room.players.get(room.hostUserId);
      out.push({
        code: room.code,
        level: room.level,
        hostName: host?.name ?? '—',
        playerCount: room.players.size,
        maxPlayers: MAX_PLAYERS,
      });
    }
    return out.sort((a, b) => b.playerCount - a.playerCount).slice(0, 20);
  }

  /** Хоосон, хуучирсан өрөөнүүдийг цэвэрлэнэ (gateway нь interval-аар дуудна). */
  sweep(): string[] {
    const removed: string[] = [];
    const now = Date.now();
    for (const room of this.rooms.values()) {
      const anyConnected = [...room.players.values()].some((p) => p.connected);
      const stale = now - room.createdAt > 6 * 60 * 60 * 1000;
      if (!anyConnected || stale) {
        this.destroyRoom(room);
        removed.push(room.code);
      }
    }
    return removed;
  }

  // ---------- Туслах ----------

  private newPlayer(user: SocketUser, socketId: string, lane: number | null): Player {
    return {
      userId: user.id,
      name: user.name,
      socketId,
      lane,
      progress: 0,
      finishMs: null,
      wpm: null,
      connected: true,
    };
  }

  private firstFreeLane(room: Room): number | null {
    const taken = new Set([...room.players.values()].map((p) => p.lane));
    for (let i = 0; i < MAX_PLAYERS; i++) if (!taken.has(i)) return i;
    return null;
  }

  private buildBots(room: Room, totalChars: number): BotProfile[] {
    const taken = new Set([...room.players.values()].map((p) => p.lane));
    const freeLanes: number[] = [];
    for (let i = 0; i < MAX_PLAYERS; i++) if (!taken.has(i)) freeLanes.push(i);
    if (freeLanes.length === 0) return [];

    const [min, max] = BOT_WPM[room.level];
    const names = [...BOT_NAMES].sort(() => Math.random() - 0.5);
    return freeLanes.map((lane, i) => {
      const t = (i + 0.5) / freeLanes.length;
      const base = {
        wpm: Math.max(8, Math.round(min + (max - min) * t + (Math.random() * 6 - 3))),
        delay: 200 + Math.random() * 500,
        phase: Math.random() * Math.PI * 2,
      };
      return { lane, name: names[i % names.length], ...base, finishMs: botFinishMs(base, totalChars) };
    });
  }

  private maybeFinish(room: Room) {
    if (room.status !== 'racing') return;
    const humans = [...room.players.values()].filter((p) => p.connected);
    if (humans.length > 0 && humans.every((p) => p.finishMs != null)) {
      room.status = 'finished';
      this.clearTimers(room);
    }
  }

  private requirePlayer(userId: string): { room: Room; player: Player } {
    const code = this.byUser.get(userId);
    const room = code ? this.rooms.get(code) : undefined;
    const player = room?.players.get(userId);
    if (!room || !player) throw new RoomError('NO_ROOM', 'Та ямар ч өрөөнд байхгүй байна');
    return { room, player };
  }

  private requireHost(userId: string): { room: Room; player: Player } {
    const ctx = this.requirePlayer(userId);
    if (ctx.room.hostUserId !== userId) throw new RoomError('NOT_HOST', 'Зөвхөн өрөөний эзэн үүнийг хийнэ');
    return ctx;
  }

  private generateCode(): string {
    for (let attempt = 0; attempt < 50; attempt++) {
      let code = '';
      for (let i = 0; i < 5; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
      if (!this.rooms.has(code)) return code;
    }
    throw new RoomError('NO_CODE', 'Өрөөний код үүсгэж чадсангүй');
  }

  private clearTimers(room: Room) {
    room.timers.forEach((t) => clearTimeout(t));
    room.timers = [];
  }

  private destroyRoom(room: Room) {
    this.clearTimers(room);
    for (const p of room.players.values()) {
      if (this.byUser.get(p.userId) === room.code) this.byUser.delete(p.userId);
    }
    this.rooms.delete(room.code);
    this.logger.debug(`Өрөө устлаа: ${room.code}`);
  }

  private toState(room: Room): RoomState {
    const players: RoomPlayerState[] = [...room.players.values()].map((p) => ({
      userId: p.userId,
      name: p.name,
      lane: p.lane,
      isHost: p.userId === room.hostUserId,
      progress: p.progress,
      finishMs: p.finishMs,
      wpm: p.wpm,
      connected: p.connected,
    }));
    return {
      code: room.code,
      level: room.level,
      status: room.status,
      hostUserId: room.hostUserId,
      maxPlayers: MAX_PLAYERS,
      players,
      text: room.status === 'lobby' ? null : room.text,
      startAt: room.startAt,
      bots: room.bots,
      createdAt: room.createdAt,
    };
  }
}
