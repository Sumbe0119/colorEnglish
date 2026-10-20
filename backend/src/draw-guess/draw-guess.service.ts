// backend/src/draw-guess/draw-guess.service.ts
// Зураг таах тоглоомын өрөөнүүд — санах ойд хадгална (нэг backend instance).
// Урсгал: lobby → (choosing → drawing → reveal) × (тоглогч бүр × ROUNDS) → finished.
import { Injectable, Logger } from '@nestjs/common';
import {
  CHOOSE_MS,
  DRAWER_POINTS_PER_GUESS,
  DrawOp,
  FeedEvent,
  GuessResult,
  HINT_EVERY_MS,
  MAX_GUESS_LEN,
  MAX_OPS,
  MAX_PLAYERS,
  MAX_POINTS_PER_OP,
  MIN_PLAYERS,
  OpenRoomSummary,
  pointsForRank,
  REVEAL_MS,
  ROUNDS,
  RoomPlayerState,
  RoomState,
  RoomStatus,
  SocketUser,
  TURN_MS,
  TurnSecret,
  WORD_OPTIONS,
  WordEntry,
} from './draw-guess.types';
import { pickWords } from './draw-guess.words';

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
  connected: boolean;
  score: number;
  guessedAt: number | null;
  turnPoints: number;
}

interface Room {
  code: string;
  status: RoomStatus;
  hostUserId: string;
  players: Map<string, Player>;
  /** Тоглоом эхлэхэд тогтоосон зурах дараалал (userId). */
  order: string[];
  /** Энэ тойрогт зураагүй үлдсэн тоглогчид. */
  queue: string[];
  round: number;
  turn: number;
  turnKey: number;
  drawerUserId: string | null;
  options: WordEntry[] | null;
  word: WordEntry | null;
  /** Нээгдсэн үсгийн индексүүд. */
  revealed: Set<number>;
  revealedWord: WordEntry | null;
  usedWords: Set<string>;
  guessCount: number;
  ops: DrawOp[];
  chooseEndAt: number | null;
  turnStartAt: number | null;
  turnEndAt: number | null;
  createdAt: number;
  timers: NodeJS.Timeout[];
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const HEX_COLOR = /^#[0-9a-f]{6}$/i;
/** Үсэг мөн үү — зай, зураас зэрэг тусгай тэмдэгт нуугдахгүй, тип болохгүй. */
const isLetter = (ch: string) => /[a-z]/i.test(ch);

function normalizeGuess(s: string): string {
  return (s ?? '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Нэг үсгээр зөрсөн (орлуулсан / дутуу / илүү) бол true. */
function isClose(a: string, b: string): boolean {
  if (a === b) return false;
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length) {
    let diff = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
    return diff === 1;
  }
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  let i = 0;
  let j = 0;
  let skipped = false;
  while (i < short.length && j < long.length) {
    if (short[i] === long[j]) {
      i++;
      j++;
    } else {
      if (skipped) return false;
      skipped = true;
      j++;
    }
  }
  return true;
}

@Injectable()
export class DrawGuessService {
  private readonly logger = new Logger(DrawGuessService.name);
  private rooms = new Map<string, Room>();
  /** userId → room code */
  private byUser = new Map<string, string>();
  private seq = 0;

  /** Timer-ээр төлөв өөрчлөгдөхөд gateway-д мэдэгдэнэ. */
  onRoomChanged: ((room: RoomState) => void) | null = null;
  /** Тоглоом дуусахад (эцсийн оноотой төлөв) — gateway оноог leaderboard-д бүртгэнэ */
  onGameFinished: ((room: RoomState) => void) | null = null;
  /** Системийн мэдээ (feed) илгээх. */
  onFeed: ((code: string, event: FeedEvent) => void) | null = null;

  // ---------- Өрөө үүсгэх / нэгдэх / гарах ----------

  createRoom(user: SocketUser, socketId: string): RoomState {
    this.leaveRoom(user.id);
    const code = this.generateCode();
    const room: Room = {
      code,
      status: 'lobby',
      hostUserId: user.id,
      players: new Map(),
      order: [],
      queue: [],
      round: 0,
      turn: 0,
      turnKey: 0,
      drawerUserId: null,
      options: null,
      word: null,
      revealed: new Set(),
      revealedWord: null,
      usedWords: new Set(),
      guessCount: 0,
      ops: [],
      chooseEndAt: null,
      turnStartAt: null,
      turnEndAt: null,
      createdAt: Date.now(),
      timers: [],
    };
    room.players.set(user.id, this.newPlayer(user, socketId));
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

    if (room.status !== 'lobby') throw new RoomError('IN_PROGRESS', 'Энэ өрөөнд тоглоом явагдаж байна');
    if (room.players.size >= MAX_PLAYERS) throw new RoomError('FULL', `Өрөө дүүрсэн байна (${MAX_PLAYERS} тоглогч)`);

    this.leaveRoom(user.id);
    room.players.set(user.id, this.newPlayer(user, socketId));
    this.byUser.set(user.id, code);
    return this.toState(room);
  }

  /**
   * socketId өгвөл холболт тасарсан гэж үзнэ: тоглоомын дундуур бол тоглогчийг хадгалж connected=false болгоно
   * (дахин холбогдож болно). socketId өгөхгүй бол (room:leave) бүрмөсөн гаргана.
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

    const inGame = room.status !== 'lobby' && room.status !== 'finished';
    if (inGame && socketId) {
      player.connected = false;
    } else {
      room.players.delete(userId);
      this.byUser.delete(userId);
    }

    if (![...room.players.values()].some((p) => p.connected)) {
      this.destroyRoom(room);
      return { room: null, code };
    }

    if (room.hostUserId === userId) {
      const next = [...room.players.values()].find((p) => p.connected) ?? [...room.players.values()][0];
      if (next) room.hostUserId = next.userId;
    }

    if (inGame) {
      const connected = [...room.players.values()].filter((p) => p.connected);
      if (connected.length < MIN_PLAYERS) {
        this.feed(room, 'Тоглогч хүрэлцэхгүй болсон тул тоглоом дууслаа');
        this.finishGame(room);
      } else if (room.drawerUserId === userId && (room.status === 'choosing' || room.status === 'drawing')) {
        this.feed(room, `${player.name} гарсан тул ээлж дууслаа`);
        this.endTurn(room);
      } else if (room.status === 'drawing') {
        this.maybeEndTurnAllGuessed(room);
      }
    }
    return { room: this.toState(room), code };
  }

  // ---------- Тоглоом ----------

  start(userId: string): RoomState {
    const { room } = this.requireHost(userId);
    if (room.status !== 'lobby' && room.status !== 'finished') {
      throw new RoomError('IN_PROGRESS', 'Тоглоом аль хэдийн эхэлсэн');
    }
    for (const [id, p] of room.players) {
      if (!p.connected) {
        room.players.delete(id);
        this.byUser.delete(id);
        continue;
      }
      p.score = 0;
      p.guessedAt = null;
      p.turnPoints = 0;
    }
    if (room.players.size < MIN_PLAYERS) {
      throw new RoomError('NOT_ENOUGH', `Дор хаяж ${MIN_PLAYERS} тоглогч хэрэгтэй`);
    }
    room.order = this.shuffle([...room.players.keys()]);
    room.queue = [];
    room.round = 0;
    room.turn = 0;
    room.usedWords = new Set();
    room.revealedWord = null;
    this.nextTurn(room);
    return this.toState(room);
  }

  choose(userId: string, index: number): RoomState {
    const { room } = this.requirePlayer(userId);
    if (room.status !== 'choosing' || room.drawerUserId !== userId) {
      throw new RoomError('NOT_CHOOSING', 'Одоо үг сонгох ээлж биш');
    }
    this.applyChoice(room, Number(index));
    return this.toState(room);
  }

  guess(userId: string, rawText: string): GuessResult & { code: string; name: string; text: string } {
    const { room, player } = this.requirePlayer(userId);
    if (room.status !== 'drawing' || !room.word) throw new RoomError('NOT_DRAWING', 'Одоо таах үе биш');
    if (room.drawerUserId === userId) throw new RoomError('IS_DRAWER', 'Зурж буй хүн таахгүй');
    if (player.guessedAt != null) throw new RoomError('ALREADY', 'Та аль хэдийн зөв таасан');

    const text = normalizeGuess(rawText).slice(0, MAX_GUESS_LEN);
    if (!text) throw new RoomError('EMPTY', 'Үгээ бичнэ үү');
    const base = { code: room.code, name: player.name, text };

    const target = normalizeGuess(room.word.word);
    if (text === target) {
      room.guessCount += 1;
      const points = pointsForRank(room.guessCount);
      player.guessedAt = Date.now();
      player.turnPoints += points;
      player.score += points;
      const drawer = room.drawerUserId ? room.players.get(room.drawerUserId) : undefined;
      if (drawer) {
        drawer.turnPoints += DRAWER_POINTS_PER_GUESS;
        drawer.score += DRAWER_POINTS_PER_GUESS;
      }
      this.maybeEndTurnAllGuessed(room);
      return { ...base, correct: true, points, close: false };
    }
    return { ...base, correct: false, points: 0, close: isClose(text, target) };
  }

  again(userId: string): RoomState {
    const { room } = this.requireHost(userId);
    if (room.status !== 'finished' && room.status !== 'lobby') {
      throw new RoomError('IN_PROGRESS', 'Тоглоом дуусаагүй байна');
    }
    this.clearTimers(room);
    for (const [id, p] of room.players) {
      if (!p.connected) {
        room.players.delete(id);
        this.byUser.delete(id);
        continue;
      }
      p.score = 0;
      p.guessedAt = null;
      p.turnPoints = 0;
    }
    room.status = 'lobby';
    room.round = 0;
    room.turn = 0;
    room.drawerUserId = null;
    room.options = null;
    room.word = null;
    room.revealed = new Set();
    room.revealedWord = null;
    room.ops = [];
    room.chooseEndAt = null;
    room.turnStartAt = null;
    room.turnEndAt = null;
    return this.toState(room);
  }

  // ---------- Зурах ----------

  /** Зураасны хэсгийг хадгална. Буцаах: өрөөний код (бусдад дамжуулах) эсвэл null. */
  draw(userId: string, raw: unknown): { code: string; op: DrawOp } | null {
    const code = this.byUser.get(userId);
    const room = code ? this.rooms.get(code) : undefined;
    if (!room || room.status !== 'drawing' || room.drawerUserId !== userId) return null;

    const op = this.sanitizeOp(raw);
    if (!op) return null;

    const last = room.ops[room.ops.length - 1];
    if (last && last.id === op.id && last.tool !== 'fill') {
      if (last.points.length + op.points.length > MAX_POINTS_PER_OP) return null;
      last.points.push(...op.points);
    } else {
      if (room.ops.length >= MAX_OPS) return null;
      room.ops.push({ ...op, points: [...op.points] });
    }
    return { code: room.code, op };
  }

  undo(userId: string): { code: string; id: string } | null {
    const code = this.byUser.get(userId);
    const room = code ? this.rooms.get(code) : undefined;
    if (!room || room.status !== 'drawing' || room.drawerUserId !== userId) return null;
    const last = room.ops.pop();
    if (!last) return null;
    return { code: room.code, id: last.id };
  }

  clear(userId: string): string | null {
    const code = this.byUser.get(userId);
    const room = code ? this.rooms.get(code) : undefined;
    if (!room || room.status !== 'drawing' || room.drawerUserId !== userId) return null;
    room.ops = [];
    return room.code;
  }

  // ---------- Унших ----------

  getRoomByUser(userId: string): RoomState | null {
    const code = this.byUser.get(userId);
    const room = code ? this.rooms.get(code) : undefined;
    return room ? this.toState(room) : null;
  }

  getOps(code: string): DrawOp[] {
    return this.rooms.get(code)?.ops ?? [];
  }

  /** Зурж буй тоглогчид илгээх нууц мэдээлэл (үг, сонголтууд). */
  secretFor(code: string): { socketId: string; secret: TurnSecret } | null {
    const room = this.rooms.get(code);
    if (!room || !room.drawerUserId) return null;
    const drawer = room.players.get(room.drawerUserId);
    if (!drawer || !drawer.connected) return null;
    if (room.status !== 'choosing' && room.status !== 'drawing') return null;
    return {
      socketId: drawer.socketId,
      secret: {
        turnKey: room.turnKey,
        options: room.status === 'choosing' ? room.options : null,
        word: room.status === 'drawing' ? room.word : null,
      },
    };
  }

  listOpen(): OpenRoomSummary[] {
    const out: OpenRoomSummary[] = [];
    for (const room of this.rooms.values()) {
      if (room.status !== 'lobby' || room.players.size >= MAX_PLAYERS) continue;
      const host = room.players.get(room.hostUserId);
      out.push({
        code: room.code,
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

  // ---------- Ээлжийн урсгал ----------

  private nextTurn(room: Room) {
    this.clearTimers(room);
    // Салсан тоглогчдыг дарааллаас хасна
    room.order = room.order.filter((id) => room.players.get(id)?.connected);
    room.queue = room.queue.filter((id) => room.players.get(id)?.connected);
    if (room.order.length < MIN_PLAYERS) {
      this.finishGame(room);
      return;
    }
    if (room.queue.length === 0) {
      room.round += 1;
      if (room.round > ROUNDS) {
        this.finishGame(room);
        return;
      }
      room.queue = [...room.order];
    }

    const drawerId = room.queue.shift()!;
    room.turn += 1;
    room.turnKey += 1;
    room.status = 'choosing';
    room.drawerUserId = drawerId;
    room.options = pickWords(WORD_OPTIONS, room.usedWords);
    room.word = null;
    room.revealed = new Set();
    room.revealedWord = null;
    room.guessCount = 0;
    room.ops = [];
    room.chooseEndAt = Date.now() + CHOOSE_MS;
    room.turnStartAt = null;
    room.turnEndAt = null;
    for (const p of room.players.values()) {
      p.guessedAt = null;
      p.turnPoints = 0;
    }

    room.timers.push(
      setTimeout(() => {
        if (room.status !== 'choosing') return;
        this.applyChoice(room, 0);
        this.onRoomChanged?.(this.toState(room));
      }, CHOOSE_MS),
    );
    this.onRoomChanged?.(this.toState(room));
  }

  private applyChoice(room: Room, index: number) {
    const options = room.options ?? [];
    const idx = Number.isInteger(index) && index >= 0 && index < options.length ? index : 0;
    const word = options[idx];
    if (!word) {
      this.endTurn(room);
      return;
    }
    this.clearTimers(room);
    room.word = word;
    room.usedWords.add(word.word);
    room.options = null;
    room.status = 'drawing';
    room.chooseEndAt = null;
    room.turnStartAt = Date.now();
    room.turnEndAt = room.turnStartAt + TURN_MS;

    const letters = [...word.word].filter((ch) => isLetter(ch)).length;
    const maxHints = Math.max(0, letters - 1);
    for (let i = 1; i * HINT_EVERY_MS < TURN_MS && i <= maxHints; i++) {
      room.timers.push(
        setTimeout(() => {
          if (room.status !== 'drawing') return;
          this.revealHint(room);
          this.onRoomChanged?.(this.toState(room));
        }, i * HINT_EVERY_MS),
      );
    }
    room.timers.push(
      setTimeout(() => {
        if (room.status !== 'drawing') return;
        this.feed(room, 'Хугацаа дууслаа');
        this.endTurn(room);
      }, TURN_MS),
    );
  }

  private revealHint(room: Room) {
    if (!room.word) return;
    const chars = [...room.word.word];
    const hidden: number[] = [];
    chars.forEach((ch, i) => {
      if (isLetter(ch) && !room.revealed.has(i)) hidden.push(i);
    });
    // Үгийг бүхэлд нь нээхгүй — дор хаяж нэг үсэг нуугдсан хэвээр байна
    if (hidden.length <= 1) return;
    room.revealed.add(hidden[Math.floor(Math.random() * hidden.length)]);
  }

  private maybeEndTurnAllGuessed(room: Room) {
    if (room.status !== 'drawing') return;
    const guessers = [...room.players.values()].filter((p) => p.connected && p.userId !== room.drawerUserId);
    if (guessers.length > 0 && guessers.every((p) => p.guessedAt != null)) {
      this.feed(room, 'Бүгд таалаа!');
      this.endTurn(room);
    }
  }

  private endTurn(room: Room) {
    this.clearTimers(room);
    room.status = 'reveal';
    room.revealedWord = room.word ?? room.options?.[0] ?? null;
    room.options = null;
    room.chooseEndAt = null;
    room.turnEndAt = null;
    room.timers.push(setTimeout(() => this.nextTurn(room), REVEAL_MS));
    this.onRoomChanged?.(this.toState(room));
  }

  private finishGame(room: Room) {
    this.clearTimers(room);
    room.status = 'finished';
    room.drawerUserId = null;
    room.options = null;
    room.word = null;
    room.chooseEndAt = null;
    room.turnStartAt = null;
    room.turnEndAt = null;
    const state = this.toState(room);
    this.onRoomChanged?.(state);
    this.onGameFinished?.(state);
  }

  private feed(room: Room, text: string) {
    this.onFeed?.(room.code, {
      id: `s-${Date.now()}-${++this.seq}`,
      kind: 'system',
      userId: null,
      name: null,
      text,
      at: Date.now(),
    });
  }

  // ---------- Туслах ----------

  private sanitizeOp(raw: unknown): DrawOp | null {
    if (!raw || typeof raw !== 'object') return null;
    const r = raw as Record<string, unknown>;
    const id = typeof r.id === 'string' ? r.id.slice(0, 24) : '';
    const tool = r.tool;
    const color = typeof r.color === 'string' && HEX_COLOR.test(r.color) ? r.color.toLowerCase() : null;
    const size = Number(r.size);
    const points = Array.isArray(r.points) ? r.points : null;
    if (!id || (tool !== 'pen' && tool !== 'eraser' && tool !== 'fill') || !color || !points) return null;
    if (points.length === 0 || points.length % 2 !== 0 || points.length > 400) return null;
    if (tool === 'fill' && points.length !== 2) return null;
    if (!Number.isFinite(size) || size < 1 || size > 60) return null;
    const clean: number[] = [];
    for (const v of points) {
      const n = Number(v);
      if (!Number.isFinite(n)) return null;
      clean.push(Math.min(1, Math.max(0, Math.round(n * 1000) / 1000)));
    }
    return { id, tool, color, size: Math.round(size), points: clean };
  }

  private newPlayer(user: SocketUser, socketId: string): Player {
    return { userId: user.id, name: user.name, socketId, connected: true, score: 0, guessedAt: null, turnPoints: 0 };
  }

  private shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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

  private masked(room: Room): string | null {
    if (room.status !== 'drawing' || !room.word) return null;
    return [...room.word.word].map((ch, i) => (!isLetter(ch) ? ch : room.revealed.has(i) ? ch : '_')).join('');
  }

  private toState(room: Room): RoomState {
    const players: RoomPlayerState[] = [...room.players.values()].map((p) => ({
      userId: p.userId,
      name: p.name,
      isHost: p.userId === room.hostUserId,
      score: p.score,
      connected: p.connected,
      guessedAt: p.guessedAt,
      turnPoints: p.turnPoints,
    }));
    const activeCount = room.order.length || room.players.size;
    return {
      code: room.code,
      status: room.status,
      hostUserId: room.hostUserId,
      maxPlayers: MAX_PLAYERS,
      players,
      round: room.round,
      totalRounds: ROUNDS,
      turn: room.turn,
      totalTurns: ROUNDS * activeCount,
      turnKey: room.turnKey,
      drawerUserId: room.drawerUserId,
      masked: this.masked(room),
      revealedWord: room.status === 'reveal' || room.status === 'finished' ? room.revealedWord : null,
      chooseEndAt: room.chooseEndAt,
      turnStartAt: room.turnStartAt,
      turnEndAt: room.turnEndAt,
      createdAt: room.createdAt,
    };
  }
}
