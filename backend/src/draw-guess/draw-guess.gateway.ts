// backend/src/draw-guess/draw-guess.gateway.ts
// Socket.IO gateway: /draw-guess namespace, path /api/socket.io.
// Холболт бүр JWT access token (handshake.auth.token) + төхөөрөмжийн session шалгалт давна.
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
import { Role } from '@prisma/client';
import { Namespace, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { DrawGuessService, RoomError } from './draw-guess.service';
import { FeedEvent, GuessResult, RoomState, SocketUser } from './draw-guess.types';

type Ack<T> = { ok: true; data: T } | { ok: false; code: string; message: string };

interface AuthedSocket extends Socket {
  data: { user: SocketUser };
}

@WebSocketGateway({
  namespace: '/draw-guess',
  path: '/api/socket.io',
  cors: { origin: true, credentials: true },
})
export class DrawGuessGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(DrawGuessGateway.name);
  private sweepTimer: NodeJS.Timeout | null = null;
  private seq = 0;

  @WebSocketServer()
  server!: Namespace;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly sessions: SessionsService,
    private readonly prisma: PrismaService,
    private readonly rooms: DrawGuessService,
  ) {}

  onModuleInit() {
    this.rooms.onRoomChanged = (room) => {
      this.emitRoom(room);
      if (room.status === 'lobby' || room.status === 'finished') this.emitOpenRooms();
    };
    this.rooms.onFeed = (code, event) => this.server.to(code).emit('feed:event', event);
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
    // Хуучин өрөөндөө дахин холбогдож байвал буцааж оруулна (зураг, нууц үгтэй нь)
    const room = this.rooms.getRoomByUser(user.id);
    if (room) {
      try {
        const rejoined = this.rooms.joinRoom(user, client.id, room.code);
        void client.join(rejoined.code);
        client.emit('room:state', this.withServerNow(rejoined));
        client.emit('draw:sync', { ops: this.rooms.getOps(rejoined.code), turnKey: rejoined.turnKey });
        this.emitSecret(rejoined.code);
        client.to(rejoined.code).emit('room:state', this.withServerNow(rejoined));
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
  onList(): Ack<ReturnType<DrawGuessService['listOpen']>> {
    return { ok: true, data: this.rooms.listOpen() };
  }

  @SubscribeMessage('room:create')
  async onCreate(@ConnectedSocket() client: AuthedSocket): Promise<Ack<RoomState>> {
    return this.guard(async () => {
      await this.leaveCurrent(client);
      const room = this.rooms.createRoom(client.data.user, client.id);
      await client.join(room.code);
      this.emitRoom(room);
      this.emitOpenRooms();
      return room;
    });
  }

  @SubscribeMessage('room:join')
  async onJoin(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() body: { code?: string },
  ): Promise<Ack<RoomState>> {
    return this.guard(async () => {
      const target = (body?.code ?? '').trim().toUpperCase();
      const current = this.rooms.getRoomByUser(client.data.user.id);
      if (current && current.code !== target) await this.leaveCurrent(client);
      const room = this.rooms.joinRoom(client.data.user, client.id, target);
      await client.join(room.code);
      this.emitRoom(room);
      if (room.status !== 'lobby') {
        client.emit('draw:sync', { ops: this.rooms.getOps(room.code), turnKey: room.turnKey });
      }
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

  @SubscribeMessage('room:start')
  onStart(@ConnectedSocket() client: AuthedSocket): Ack<RoomState> {
    return this.guardSync(() => {
      const room = this.rooms.start(client.data.user.id);
      this.server.to(room.code).emit('draw:clear');
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

  // ---------- Ээлж ----------

  @SubscribeMessage('turn:choose')
  onChoose(@ConnectedSocket() client: AuthedSocket, @MessageBody() body: { index: number }): Ack<RoomState> {
    return this.guardSync(() => {
      const room = this.rooms.choose(client.data.user.id, Number(body?.index));
      this.emitRoom(room);
      return room;
    });
  }

  @SubscribeMessage('turn:guess')
  onGuess(@ConnectedSocket() client: AuthedSocket, @MessageBody() body: { text: string }): Ack<GuessResult> {
    return this.guardSync(() => {
      const user = client.data.user;
      const res = this.rooms.guess(user.id, String(body?.text ?? ''));
      const event: FeedEvent = {
        id: `f-${Date.now()}-${++this.seq}`,
        kind: res.correct ? 'correct' : 'guess',
        userId: user.id,
        name: res.name,
        // Зөв үгийг урсгалд харуулахгүй
        text: res.correct ? '' : res.text,
        at: Date.now(),
      };
      this.server.to(res.code).emit('feed:event', event);
      if (res.correct) {
        const room = this.rooms.getRoomByUser(user.id);
        if (room) this.emitRoom(room);
      }
      return { correct: res.correct, points: res.points, close: res.close };
    });
  }

  // ---------- Зурах (ack-гүй, хурдан) ----------

  @SubscribeMessage('draw:op')
  onDraw(@ConnectedSocket() client: AuthedSocket, @MessageBody() body: { op: unknown }) {
    const res = this.rooms.draw(client.data.user.id, body?.op);
    if (!res) return;
    client.to(res.code).emit('draw:op', res.op);
  }

  @SubscribeMessage('draw:undo')
  onUndo(@ConnectedSocket() client: AuthedSocket) {
    const res = this.rooms.undo(client.data.user.id);
    if (!res) return;
    client.to(res.code).emit('draw:undo', { id: res.id });
  }

  @SubscribeMessage('draw:clear')
  onClear(@ConnectedSocket() client: AuthedSocket) {
    const code = this.rooms.clear(client.data.user.id);
    if (!code) return;
    client.to(code).emit('draw:clear');
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
    this.emitSecret(room.code);
  }

  /** Зурж буй тоглогчид л үг/сонголтыг илгээнэ. */
  private emitSecret(code: string) {
    const s = this.rooms.secretFor(code);
    if (s) this.server.to(s.socketId).emit('turn:secret', s.secret);
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
