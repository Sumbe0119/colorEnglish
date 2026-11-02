// backend/src/tug-of-war/tug-of-war.service.ts
// "Олс татах" онлайн өрөөнүүд — санах ойд хадгална (нэг backend instance).
// Сервер нь эрх мэдэлтэй: асуултын зөв хариултыг шалгаж, олсны байрлалыг хөдөлгөж, хугацаа/шугамаар дуусгана.
// Асуултуудыг хост client тоглолт эхлэхдээ илгээнэ (frontend-ийн сангаас) — сервер зөвхөн хадгалж шалгана.
import { Injectable, Logger } from '@nestjs/common';
import {
  AnswerResult,
  CORRECT_LOCK_MS,
  COUNTDOWN_MS,
  DIFFICULTIES,
  DURATIONS,
  Difficulty,
  FinishReason,
  MAX_PLAYERS,
  MAX_QUESTIONS,
  MIN_QUESTIONS,
  OpenRoomSummary,
  POINTS_PER_CORRECT,
  PULL_STEP,
  RoomPlayerState,
  RoomState,
  RoomStatus,
  SocketUser,
  Team,
  TugQuestion,
  WIN_BONUS,
  WRONG_LOCK_MS,
} from './tug-of-war.types';

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
  team: Team;
  connected: boolean;
  qIndex: number;
  correct: number;
  wrong: number;
  lastResult: 'correct' | 'wrong' | null;
  lastOption: number | null;
  /** Энэ мөч хүртэл хариулт хүлээж авахгүй (epoch мс). */
  lockedUntil: number;
  /** Энэ тоглолтод оноо бүртгэсэн эсэх. */
  recorded: boolean;
}

interface Room {
  code: string;
  status: RoomStatus;
  hostUserId: string;
  difficulty: Difficulty;
  durationSec: number;
  players: Map<string, Player>;
  questions: TugQuestion[] | null;
  pos: number;
  startAt: number | null;
  endAt: number | null;
  winner: Team | 'draw' | null;
  reason: FinishReason | null;
  createdAt: number;
  timers: NodeJS.Timeout[];
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export interface FinishedPlayerInfo {
  userId: string;
  code: string;
  difficulty: Difficulty;
  team: Team;
  won: boolean;
  draw: boolean;
  correct: number;
  wrong: number;
  score: number;
  durationSec: number;
  reason: FinishReason;
}

@Injectable()
export class TugOfWarService {
  private readonly logger = new Logger(TugOfWarService.name);
  private rooms = new Map<string, Room>();
  /** userId → room code */
  private byUser = new Map<string, string>();
  /** Таймераар төлөв өөрчлөгдөхөд gateway-д мэдэгдэх callback. */
  onRoomChanged: ((room: RoomState) => void) | null = null;
  /** Тоглолт дуусахад хүн тоглогч бүрийн оноог бүртгэх (gateway → GamesService). */
  onPlayerFinished: ((info: FinishedPlayerInfo) => void) | null = null;

  // ---------- Өрөө ----------

  createRoom(user: SocketUser, socketId: string, opts: { difficulty?: Difficulty; durationSec?: number; team?: Team }): RoomState {
    this.leaveRoom(user.id, socketId);
    const code = this.generateCode();
    const room: Room = {
      code,
      status: 'lobby',
      hostUserId: user.id,
      difficulty: DIFFICULTIES.includes(opts.difficulty as Difficulty) ? (opts.difficulty as Difficulty) : 'easy',
      durationSec: DURATIONS.includes(Number(opts.durationSec)) ? Number(opts.durationSec) : 180,
      players: new Map(),
      questions: null,
      pos: 0,
      startAt: null,
      endAt: null,
      winner: null,
      reason: null,
      createdAt: Date.now(),
      timers: [],
    };
    const team: Team = opts.team === 'blue' ? 'blue' : 'red';
    room.players.set(user.id, this.newPlayer(user, socketId, team));
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
      existing.socketId = socketId;
      existing.connected = true;
      this.byUser.set(user.id, code);
      return this.toState(room);
    }

    if (room.status !== 'lobby') throw new RoomError('IN_PROGRESS', 'Энэ өрөөнд тоглолт явагдаж байна');
    if (room.players.size >= MAX_PLAYERS) throw new RoomError('FULL', 'Өрөө дүүрсэн байна (2 тоглогч)');

    this.leaveRoom(user.id, socketId);
    const taken = new Set([...room.players.values()].map((p) => p.team));
    const team: Team = taken.has('red') ? 'blue' : 'red';
    room.players.set(user.id, this.newPlayer(user, socketId, team));
    this.byUser.set(user.id, code);
    return this.toState(room);
  }

  /**
   * Хэрэглэгчийг өрөөнөөс гаргана. socketId өгвөл зөвхөн тэр socket-ийн тоглогч бол гаргана.
   * Тоглолтын дундуур гарвал эсрэг баг шууд хожно (forfeit).
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

    if (room.status === 'playing' || room.status === 'countdown') {
      player.connected = false;
      this.byUser.delete(userId);
      const opponent = [...room.players.values()].find((p) => p.userId !== userId && p.connected);
      if (opponent) {
        this.finish(room, opponent.team, 'forfeit');
      } else {
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

  pickTeam(userId: string, team: Team): RoomState {
    const { room, player } = this.requirePlayer(userId);
    if (room.status !== 'lobby') throw new RoomError('IN_PROGRESS', 'Тоглолт эхэлсэн үед баг солихгүй');
    if (team !== 'red' && team !== 'blue') throw new RoomError('BAD_TEAM', 'Буруу баг');
    const other = [...room.players.values()].find((p) => p.userId !== userId);
    if (other && other.team === team) {
      // Хоёулаа солилцоно
      other.team = player.team;
    }
    player.team = team;
    return this.toState(room);
  }

  setup(userId: string, opts: { difficulty?: Difficulty; durationSec?: number }): RoomState {
    const { room } = this.requireHost(userId);
    if (room.status !== 'lobby') throw new RoomError('IN_PROGRESS', 'Тоглолт эхэлсэн үед тохиргоо солихгүй');
    if (opts.difficulty !== undefined) {
      if (!DIFFICULTIES.includes(opts.difficulty)) throw new RoomError('BAD_LEVEL', 'Буруу хүндрэл');
      room.difficulty = opts.difficulty;
    }
    if (opts.durationSec !== undefined) {
      const d = Number(opts.durationSec);
      if (!DURATIONS.includes(d)) throw new RoomError('BAD_DURATION', 'Буруу хугацаа');
      room.durationSec = d;
    }
    return this.toState(room);
  }

  // ---------- Тоглолт ----------

  start(userId: string, rawQuestions: unknown): RoomState {
    const { room } = this.requireHost(userId);
    if (room.status !== 'lobby' && room.status !== 'finished') throw new RoomError('IN_PROGRESS', 'Тоглолт аль хэдийн эхэлсэн');
    const connected = [...room.players.values()].filter((p) => p.connected);
    if (connected.length < MAX_PLAYERS) throw new RoomError('NEED_PLAYERS', 'Хоёр тоглогч хэрэгтэй');
    if (connected[0].team === connected[1].team) throw new RoomError('SAME_TEAM', 'Хоёр тоглогч өөр багт байх ёстой');

    const questions = this.sanitizeQuestions(rawQuestions);

    for (const [id, p] of room.players) {
      if (!p.connected) {
        room.players.delete(id);
        continue;
      }
      p.correct = 0;
      p.wrong = 0;
      p.lastResult = null;
      p.lastOption = null;
      p.lockedUntil = 0;
      p.recorded = false;
    }
    // Хоёр тоглогч өөр асуултаас эхэлнэ (ижил асуулт зэрэг гарахгүй)
    const half = Math.floor(questions.length / 2);
    for (const p of room.players.values()) p.qIndex = p.team === 'red' ? 0 : half;

    room.questions = questions;
    room.pos = 0;
    room.winner = null;
    room.reason = null;
    room.startAt = Date.now() + COUNTDOWN_MS;
    room.endAt = room.startAt + room.durationSec * 1000;
    room.status = 'countdown';
    this.clearTimers(room);

    room.timers.push(
      setTimeout(() => {
        if (room.status !== 'countdown') return;
        room.status = 'playing';
        this.onRoomChanged?.(this.toState(room));
      }, COUNTDOWN_MS),
    );
    room.timers.push(
      setTimeout(() => {
        if (room.status !== 'playing' && room.status !== 'countdown') return;
        const w = Math.abs(room.pos) < 1e-6 ? 'draw' : room.pos < 0 ? 'red' : 'blue';
        this.finish(room, w, 'time');
        this.onRoomChanged?.(this.toState(room));
      }, COUNTDOWN_MS + room.durationSec * 1000),
    );

    return this.toState(room);
  }

  /** Тоглогчийн хариулт. Зөв бол олсыг түүний тал руу татна. */
  answer(userId: string, qIndex: number, option: number): { result: AnswerResult; room: RoomState } {
    const { room, player } = this.requirePlayer(userId);
    if (room.status !== 'playing' || !room.questions) throw new RoomError('NOT_PLAYING', 'Тоглолт явагдаагүй байна');
    const now = Date.now();
    if (now < player.lockedUntil) throw new RoomError('LOCKED', 'Түр хүлээнэ үү');
    if (!Number.isInteger(qIndex) || qIndex !== player.qIndex) throw new RoomError('STALE', 'Асуулт солигдсон байна');
    const q = room.questions[player.qIndex % room.questions.length];
    if (!Number.isInteger(option) || option < 0 || option >= q.options.length) throw new RoomError('BAD_OPTION', 'Буруу сонголт');

    const correct = option === q.answer;
    player.lastResult = correct ? 'correct' : 'wrong';
    player.lastOption = option;
    if (correct) {
      player.correct += 1;
      const sign = player.team === 'red' ? -1 : 1;
      room.pos = Math.max(-1, Math.min(1, room.pos + sign * PULL_STEP));
    } else {
      player.wrong += 1;
    }
    const lockedMs = correct ? CORRECT_LOCK_MS : WRONG_LOCK_MS;
    player.lockedUntil = now + lockedMs;
    player.qIndex = (player.qIndex + 1) % room.questions.length;

    if (room.pos <= -1 + 1e-9) this.finish(room, 'red', 'line');
    else if (room.pos >= 1 - 1e-9) this.finish(room, 'blue', 'line');

    return {
      result: { correct, answer: q.answer, pos: room.pos, nextIndex: player.qIndex, lockedMs },
      room: this.toState(room),
    };
  }

  again(userId: string): RoomState {
    const { room } = this.requireHost(userId);
    if (room.status === 'playing' || room.status === 'countdown') throw new RoomError('IN_PROGRESS', 'Тоглолт дуусаагүй байна');
    this.clearTimers(room);
    for (const [id, p] of room.players) {
      if (!p.connected) {
        room.players.delete(id);
        continue;
      }
      p.qIndex = 0;
      p.correct = 0;
      p.wrong = 0;
      p.lastResult = null;
      p.lastOption = null;
      p.lockedUntil = 0;
      p.recorded = false;
    }
    room.status = 'lobby';
    room.questions = null;
    room.pos = 0;
    room.startAt = null;
    room.endAt = null;
    room.winner = null;
    room.reason = null;
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
        hostName: host?.name ?? '—',
        hostTeam: host?.team ?? 'red',
        difficulty: room.difficulty,
        durationSec: room.durationSec,
        playerCount: room.players.size,
        maxPlayers: MAX_PLAYERS,
      });
    }
    return out.sort((a, b) => b.playerCount - a.playerCount).slice(0, 20);
  }

  /** Хоосон, хуучирсан өрөөнүүдийг цэвэрлэнэ. */
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

  private finish(room: Room, winner: Team | 'draw', reason: FinishReason) {
    if (room.status === 'finished') return;
    room.status = 'finished';
    room.winner = winner;
    room.reason = reason;
    this.clearTimers(room);
    for (const p of room.players.values()) {
      if (p.recorded || !p.connected) continue;
      p.recorded = true;
      const won = winner === p.team;
      const score = p.correct * POINTS_PER_CORRECT + (won ? WIN_BONUS[room.difficulty] : 0);
      this.onPlayerFinished?.({
        userId: p.userId,
        code: room.code,
        difficulty: room.difficulty,
        team: p.team,
        won,
        draw: winner === 'draw',
        correct: p.correct,
        wrong: p.wrong,
        score,
        durationSec: room.durationSec,
        reason,
      });
    }
  }

  private sanitizeQuestions(raw: unknown): TugQuestion[] {
    if (!Array.isArray(raw)) throw new RoomError('BAD_QUESTIONS', 'Асуултууд буруу байна');
    const out: TugQuestion[] = [];
    for (const item of raw.slice(0, MAX_QUESTIONS)) {
      if (!item || typeof item !== 'object') continue;
      const q = item as Partial<TugQuestion>;
      if (typeof q.text !== 'string' || !Array.isArray(q.options) || q.options.length !== 4) continue;
      if (!q.options.every((o) => typeof o === 'string' && o.length <= 60)) continue;
      if (!Number.isInteger(q.answer) || (q.answer as number) < 0 || (q.answer as number) > 3) continue;
      out.push({
        text: q.text.slice(0, 200),
        options: q.options.map((o) => String(o)),
        answer: q.answer as number,
        mn: typeof q.mn === 'string' ? q.mn.slice(0, 200) : '',
      });
    }
    if (out.length < MIN_QUESTIONS) throw new RoomError('BAD_QUESTIONS', 'Асуулт хэт цөөн байна');
    return out;
  }

  private newPlayer(user: SocketUser, socketId: string, team: Team): Player {
    return {
      userId: user.id,
      name: user.name,
      socketId,
      team,
      connected: true,
      qIndex: 0,
      correct: 0,
      wrong: 0,
      lastResult: null,
      lastOption: null,
      lockedUntil: 0,
      recorded: false,
    };
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
      team: p.team,
      isHost: p.userId === room.hostUserId,
      connected: p.connected,
      qIndex: p.qIndex,
      correct: p.correct,
      wrong: p.wrong,
      lastResult: p.lastResult,
      lastOption: p.lastOption,
    }));
    return {
      code: room.code,
      status: room.status,
      hostUserId: room.hostUserId,
      difficulty: room.difficulty,
      durationSec: room.durationSec,
      players,
      questions: room.status === 'lobby' ? null : room.questions,
      pos: room.pos,
      startAt: room.startAt,
      endAt: room.endAt,
      winner: room.winner,
      reason: room.reason,
      createdAt: room.createdAt,
    };
  }
}
