// backend/src/tug-of-war/tug-of-war.gateway.ts
// Socket.IO gateway: /tug-of-war namespace, path /api/socket.io.
// Холболт бүр JWT access token (handshake.auth.token) + төхөөрөмжийн session шалгалт давна (type-rush-тэй ижил).
import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameKind, Role } from '@prisma/client';
import { Namespace, Socket } from 'socket.io';
import { GamesService } from '../games/games.service';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { RoomError, TugOfWarService } from './tug-of-war.service';
import { AnswerResult, Difficulty, RoomState, SocketUser, Team } from './tug-of-war.types';

type Ack<T> = { ok: true; data: T } | { ok: false; code: string; message: string };

interface AuthedSocket extends Socket {
  data: { user: SocketUser };
}

@WebSocketGateway({
  namespace: '/tug-of-war',
  path: '/api/socket.io',
  cors: { origin: true, credentials: true },
})
export class TugOfWarGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(TugOfWarGateway.name);
  private sweepTimer: NodeJS.Timeout | null = null;

  @WebSocketServer()
  server!: Namespace;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly sessions: SessionsService,
    private readonly prisma: PrismaService,
    private readonly rooms: TugOfWarService,
    private readonly games: GamesService,
  ) {}

  onModuleInit() {
    this.rooms.onRoomChanged = (room) => {
      this.emitRoom(room);
      if (room.status === 'finished') this.emitOpenRooms();
    };
    this.rooms.onPlayerFinished = (i) =>
      this.games.recordQuietly(i.userId, GameKind.TUG_OF_WAR, i.score, {
        mode: 'online',
        code: i.code,
        difficulty: i.difficulty,
        team: i.team,
        won: i.won,
        draw: i.draw,
        correct: i.correct,
        wrong: i.wrong,
        durationSec: i.durationSec,
        reason: i.reason,
      });
    this.sweepTimer = setInterval(() => {
      const removed = this.rooms.sweep();
      if (removed.length) this.emitOpenRooms();
    }, 60_000);
  }

  onModuleDestroy() {
    if (this.sweepTimer) clearInterval(this.sweepTimer);
  }

  afterInit(server: Namespace) {
    server.use(async (socket, next) => {
      try {
        const user = await this.authenticate(socket);
        (socket as AuthedSocket).data.user = user;
        next();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'UNAUTHORIZED';
        next(new Error(message === 'UNAUTHORIZED' ? 'UNAUTHORIZED' : `UNAUTHORIZED:${message}`));
      }
    });
  }

  handleConnection(client: AuthedSocket) {
    const user = client.data.user;
    const room = this.rooms.getRoomByUser(user.id);
    if (room) {
      try {
        const rejoined = this.rooms.joinRoom(user, client.id, room.code);
        void client.join(rejoined.code);
        client.emit('room:state', this.withServerNow(rejoined));
      } catch {
        /* өрөө алга болсон */
      }
    }
    client.emit('rooms:open', this.rooms.listOpen());
  }

  handleDisconnect(client: AuthedSocket) {
    const user = client.data?.user;
    if (!user) return;
    const { room, code } = this.rooms.leaveRoom(user.id, client.id);
    if (room) this.emitRoom(room);
    else if (code) this.server.to(code).emit('room:closed', { code });
    this.emitOpenRooms();
  }

  // ---------- Өрөө ----------

  @SubscribeMessage('rooms:list')
  onList(): Ack<ReturnType<TugOfWarService['listOpen']>> {
    return { ok: true, data: this.rooms.listOpen() };
  }

  @SubscribeMessage('room:create')
  async onCreate(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() body: { difficulty?: Difficulty; durationSec?: number; team?: Team },
  ): Promise<Ack<RoomState>> {
    return this.guard(async () => {
      await this.leaveCurrent(client);
      const room = this.rooms.createRoom(client.data.user, client.id, body ?? {});
      await client.join(room.code);
      this.emitRoom(room);
      this.emitOpenRooms();
      return room;
    });
  }

  @SubscribeMessage('room:join')
  async onJoin(@ConnectedSocket() client: AuthedSocket, @MessageBody() body: { code?: string }): Promise<Ack<RoomState>> {
    return this.guard(async () => {
      const current = this.rooms.getRoomByUser(client.data.user.id);
      if (current && current.code !== (body?.code ?? '').trim().toUpperCase()) await this.leaveCurrent(client);
      const room = this.rooms.joinRoom(client.data.user, client.id, body?.code ?? '');
      await client.join(room.code);
      this.emitRoom(room);
      this.emitOpenRooms();
      return room;
    });
  }

  @SubscribeMessage('room:leave')
  async onLeave(@ConnectedSocket() client: AuthedSocket): Promise<Ack<null>> {
    return this.guard(async () => {
      await this.leaveCurrent(client);
      this.emitOpenRooms();
      return null;
    });
  }

  @SubscribeMessage('room:pickTeam')
  onPickTeam(@ConnectedSocket() client: AuthedSocket, @MessageBody() body: { team: Team }): Ack<RoomState> {
    return this.guardSync(() => {
      const room = this.rooms.pickTeam(client.data.user.id, body?.team);
      this.emitRoom(room);
      this.emitOpenRooms();
      return room;
    });
  }

  @SubscribeMessage('room:setup')
  onSetup(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() body: { difficulty?: Difficulty; durationSec?: number },
  ): Ack<RoomState> {
    return this.guardSync(() => {
      const room = this.rooms.setup(client.data.user.id, body ?? {});
      this.emitRoom(room);
      this.emitOpenRooms();
      return room;
    });
  }

  @SubscribeMessage('room:start')
  onStart(@ConnectedSocket() client: AuthedSocket, @MessageBody() body: { questions: unknown }): Ack<RoomState> {
    return this.guardSync(() => {
      const room = this.rooms.start(client.data.user.id, body?.questions);
      this.emitRoom(room);
      this.emitOpenRooms();
      return room;
    });
  }

  @SubscribeMessage('room:again')
  onAgain(@ConnectedSocket() client: AuthedSocket): Ack<RoomState> {
    return this.guardSync(() => {
      const room = this.rooms.again(client.data.user.id);
      this.emitRoom(room);
      this.emitOpenRooms();
      return room;
    });
  }

  // ---------- Тоглолт ----------

  @SubscribeMessage('game:answer')
  onAnswer(@ConnectedSocket() client: AuthedSocket, @MessageBody() body: { qIndex: number; option: number }): Ack<AnswerResult> {
    return this.guardSync(() => {
      const { result, room } = this.rooms.answer(client.data.user.id, Number(body?.qIndex), Number(body?.option));
      this.emitRoom(room);
      if (room.status === 'finished') this.emitOpenRooms();
      return result;
    });
  }

  // ---------- Туслах ----------

  private async authenticate(socket: Socket): Promise<SocketUser> {
    const auth = socket.handshake.auth as { token?: string } | undefined;
    const header = socket.handshake.headers.authorization;
    const token = auth?.token ?? (header?.startsWith('Bearer ') ? header.slice(7) : undefined);
    if (!token) throw new Error('UNAUTHORIZED');

    const secret = this.config.get<string>('JWT_ACCESS_SECRET');
    const payload = await this.jwt.verifyAsync<JwtPayload>(token, { secret });
    if (!payload?.sub || !payload.sid) throw new Error('UNAUTHORIZED');
    await this.sessions.assertActive(payload.sid, payload.sub, payload.role as Role);

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, firstName: true, email: true, isActive: true },
    });
    if (!user || !user.isActive) throw new Error('UNAUTHORIZED');
    const name = user.firstName?.trim() || user.email.split('@')[0];
    return { id: user.id, name };
  }

  private async leaveCurrent(client: AuthedSocket) {
    const { room, code } = this.rooms.leaveRoom(client.data.user.id);
    if (code) await client.leave(code);
    if (room) this.emitRoom(room);
    else if (code) this.server.to(code).emit('room:closed', { code });
  }

  private emitRoom(room: RoomState) {
    this.server.to(room.code).emit('room:state', this.withServerNow(room));
  }

  private emitOpenRooms() {
    this.server.emit('rooms:open', this.rooms.listOpen());
  }

  private withServerNow(room: RoomState) {
    return { room, serverNow: Date.now() };
  }

  private async guard<T>(fn: () => Promise<T>): Promise<Ack<T>> {
    try {
      return { ok: true, data: await fn() };
    } catch (err) {
      return this.toAckError(err);
    }
  }

  private guardSync<T>(fn: () => T): Ack<T> {
    try {
      return { ok: true, data: fn() };
    } catch (err) {
      return this.toAckError(err);
    }
  }

  private toAckError(err: unknown): Ack<never> {
    if (err instanceof RoomError) return { ok: false, code: err.code, message: err.message };
    this.logger.error(err instanceof Error ? err.stack ?? err.message : String(err));
    return { ok: false, code: 'INTERNAL', message: 'Алдаа гарлаа, дахин оролдоно уу' };
  }
}
