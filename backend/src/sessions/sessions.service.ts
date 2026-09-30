import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role, SubscriptionStatus, UserSession } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/** Frontend эдгээр кодоор "төхөөрөмж сонгох" UI-г харуулна. */
export const SESSION_LIMIT_REACHED = 'SESSION_LIMIT_REACHED';
export const SESSION_ACTIVE_LIMIT = 'SESSION_ACTIVE_LIMIT';
export const SESSION_REVOKED = 'SESSION_REVOKED';

/** Сүүлийн N минутад хүсэлт илгээсэн session-ийг "зэрэг идэвхтэй" гэж тоолно. */
const ACTIVE_WINDOW_MS = 5 * 60 * 1000;
/** lastSeenAt-ийг хүсэлт бүрд биш, минут тутам шинэчилнэ. */
const TOUCH_INTERVAL_MS = 60 * 1000;
/** Session хүчинтэй эсэхийг DB-ээс дахин шалгах хугацаа (хасалт хамгийн ихдээ ийм хугацаагаар хоцорно). */
const CACHE_TTL_MS = 30 * 1000;
/** Ийм хугацаанд идэвхгүй session-ийг автоматаар хаана. */
const IDLE_EXPIRE_DAYS = 30;

export interface SessionLimits {
  /** Хадгалах (нэвтэрсэн) төхөөрөмжийн дээд тоо */
  maxDevices: number;
  /** Зэрэг ашиглаж болох төхөөрөмжийн дээд тоо */
  maxActive: number;
  /** Refresh token хугацаа (хоног) */
  refreshDays: number;
}

export interface SessionSummary {
  id: string;
  deviceName: string | null;
  deviceType: string | null;
  ipAddress: string | null;
  lastSeenAt: Date;
  createdAt: Date;
  isActiveNow: boolean;
}

interface CacheEntry {
  checkedAt: number;
  valid: boolean;
  userId: string;
  lastSeenAt: number;
}

type LimitUser = { id: string; role: Role };

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);
  private readonly cache = new Map<string, CacheEntry>();

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  // ---------- Лимит ----------

  private envNum(key: string, fallback: number) {
    const raw = this.config.get<string>(key);
    const n = Number(raw);
    return raw !== undefined && Number.isFinite(n) && n > 0 ? n : fallback;
  }

  private async isPro(userId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!sub || sub.plan === 'FREE') return false;
    if (sub.status !== SubscriptionStatus.ACTIVE && sub.status !== SubscriptionStatus.TRIAL) return false;
    if (sub.expiresAt && sub.expiresAt.getTime() < Date.now()) return false;
    return true;
  }

  /** Эрх болон багцаас хамаарсан лимит. .env-ээс SESSION_MAX_DEVICES_VIP гэх мэтээр дарж болно. */
  async getLimits(user: LimitUser): Promise<SessionLimits> {
    if (user.role === Role.ADMIN) {
      return {
        maxDevices: this.envNum('SESSION_MAX_DEVICES_ADMIN', 2),
        maxActive: this.envNum('SESSION_MAX_ACTIVE_ADMIN', 2),
        refreshDays: this.envNum('SESSION_REFRESH_DAYS_ADMIN', 7),
      };
    }
    if (user.role === Role.EDITOR) {
      return {
        maxDevices: this.envNum('SESSION_MAX_DEVICES_EDITOR', 2),
        maxActive: this.envNum('SESSION_MAX_ACTIVE_EDITOR', 2),
        refreshDays: this.envNum('SESSION_REFRESH_DAYS_EDITOR', 14),
      };
    }
    const refreshDays = this.envNum('JWT_REFRESH_EXPIRES_DAYS', 30);
    if (await this.isPro(user.id)) {
      return {
        maxDevices: this.envNum('SESSION_MAX_DEVICES_VIP', 3),
        maxActive: this.envNum('SESSION_MAX_ACTIVE_VIP', 2),
        refreshDays,
      };
    }
    return {
      maxDevices: this.envNum('SESSION_MAX_DEVICES_FREE', 1),
      maxActive: this.envNum('SESSION_MAX_ACTIVE_FREE', 1),
      refreshDays,
    };
  }

  // ---------- Төхөөрөмж таних ----------

  describeDevice(userAgent?: string | null): { deviceName: string; deviceType: string } {
    const ua = userAgent ?? '';
    let os = 'Үл мэдэгдэх';
    let deviceType = 'unknown';
    if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && /Mobile/i.test(ua))) {
      os = 'iPad';
      deviceType = 'tablet';
    } else if (/iPhone|iPod/i.test(ua)) {
      os = 'iPhone';
      deviceType = 'phone';
    } else if (/Android/i.test(ua)) {
      os = 'Android';
      deviceType = /Mobile/i.test(ua) ? 'phone' : 'tablet';
    } else if (/Windows/i.test(ua)) {
      os = 'Windows';
      deviceType = 'desktop';
    } else if (/Macintosh|Mac OS/i.test(ua)) {
      os = 'Mac';
      deviceType = 'desktop';
    } else if (/CrOS/i.test(ua)) {
      os = 'ChromeOS';
      deviceType = 'desktop';
    } else if (/Linux/i.test(ua)) {
      os = 'Linux';
      deviceType = 'desktop';
    }

    let browser = 'Browser';
    if (/Edg\//i.test(ua)) browser = 'Edge';
    else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera';
    else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet';
    else if (/Firefox\//i.test(ua)) browser = 'Firefox';
    else if (/Chrome\/|CriOS/i.test(ua)) browser = 'Chrome';
    else if (/Safari\//i.test(ua)) browser = 'Safari';

    return { deviceName: `${os} · ${browser}`, deviceType };
  }

  // ---------- Нэвтрэх ----------

  /**
   * Нэвтрэх үед session олгоно. Тухайн deviceId-тай идэвхтэй session байвал дахин ашиглана,
   * лимит дүүрсэн бол 409 + SESSION_LIMIT_REACHED шидэж, frontend хаах төхөөрөмжөө сонгуулна.
   */
  async openSession(
    user: LimitUser,
    deviceId: string,
    meta: { userAgent?: string | null; ipAddress?: string | null },
  ): Promise<{ session: UserSession; limits: SessionLimits }> {
    const limits = await this.getLimits(user);
    const now = new Date();
    const { deviceName, deviceType } = this.describeDevice(meta.userAgent);

    await this.expireIdle(user.id);

    const existing = await this.prisma.userSession.findUnique({
      where: { userId_deviceId: { userId: user.id, deviceId } },
    });

    if (existing && !existing.revokedAt) {
      const session = await this.prisma.userSession.update({
        where: { id: existing.id },
        data: {
          lastSeenAt: now,
          userAgent: meta.userAgent ?? null,
          ipAddress: meta.ipAddress ?? null,
          deviceName,
          deviceType,
        },
      });
      this.cache.delete(session.id);
      return { session, limits };
    }

    const others = await this.prisma.userSession.findMany({
      where: { userId: user.id, revokedAt: null },
      orderBy: { lastSeenAt: 'desc' },
    });

    const activeNow = others.filter((s) => s.lastSeenAt.getTime() > now.getTime() - ACTIVE_WINDOW_MS);
    if (others.length >= limits.maxDevices || activeNow.length >= limits.maxActive) {
      throw new ConflictException({
        statusCode: 409,
        code: SESSION_LIMIT_REACHED,
        message:
          others.length >= limits.maxDevices
            ? `Та хамгийн ихдээ ${limits.maxDevices} төхөөрөмжөөс нэвтрэх боломжтой. Үргэлжлүүлэхийн тулд өмнөх төхөөрөмжөөсөө гарна уу.`
            : `Одоогоор ${activeNow.length} төхөөрөмж зэрэг ашиглагдаж байна (дээд тал нь ${limits.maxActive}). Нэгээс нь гарна уу.`,
        limits,
        sessions: others.map((s) => this.toSummary(s, now)),
      });
    }

    const session = await this.prisma.userSession.upsert({
      where: { userId_deviceId: { userId: user.id, deviceId } },
      create: {
        userId: user.id,
        deviceId,
        deviceName,
        deviceType,
        userAgent: meta.userAgent ?? null,
        ipAddress: meta.ipAddress ?? null,
        lastSeenAt: now,
      },
      update: {
        revokedAt: null,
        createdAt: now,
        lastSeenAt: now,
        deviceName,
        deviceType,
        userAgent: meta.userAgent ?? null,
        ipAddress: meta.ipAddress ?? null,
      },
    });
    this.cache.delete(session.id);
    return { session, limits };
  }

  // ---------- Хүсэлт бүрд шалгах (JwtStrategy) ----------

  /**
   * Access token-ий session хүчинтэй эсэхийг шалгаад lastSeenAt-ийг шинэчилнэ.
   * Идэвхгүй байснаа дахин идэвхжих үед "зэрэг идэвхтэй" лимитийг шалгана.
   */
  async assertActive(sessionId: string, userId: string, role: Role): Promise<void> {
    const nowMs = Date.now();
    const cached = this.cache.get(sessionId);
    if (cached && nowMs - cached.checkedAt < CACHE_TTL_MS) {
      if (!cached.valid) throw this.revokedError();
      if (nowMs - cached.lastSeenAt > TOUCH_INTERVAL_MS) {
        cached.lastSeenAt = nowMs;
        void this.prisma.userSession
          .update({ where: { id: sessionId }, data: { lastSeenAt: new Date(nowMs) } })
          .catch(() => undefined);
      }
      return;
    }

    const session = await this.prisma.userSession.findUnique({ where: { id: sessionId } });
    const valid = !!session && !session.revokedAt && session.userId === userId;
    if (!valid || !session) {
      this.cache.set(sessionId, { checkedAt: nowMs, valid: false, userId, lastSeenAt: 0 });
      throw this.revokedError();
    }

    const wasIdle = nowMs - session.lastSeenAt.getTime() > ACTIVE_WINDOW_MS;
    if (wasIdle) {
      // Дахин идэвхжиж байна — бусад төхөөрөмж хэтэрхий олон ашиглагдаж байвал зогсооно
      const limits = await this.getLimits({ id: userId, role });
      const activeOthers = await this.prisma.userSession.findMany({
        where: {
          userId,
          revokedAt: null,
          id: { not: sessionId },
          lastSeenAt: { gt: new Date(nowMs - ACTIVE_WINDOW_MS) },
        },
        orderBy: { lastSeenAt: 'desc' },
      });
      if (activeOthers.length >= limits.maxActive) {
        throw new ConflictException({
          statusCode: 409,
          code: SESSION_ACTIVE_LIMIT,
          message: `Таны бүртгэл өөр төхөөрөмж дээр ашиглагдаж байна (дээд тал нь ${limits.maxActive} зэрэг). Нөгөө төхөөрөмжөө хаах эсвэл хэдэн минут хүлээнэ үү.`,
          limits,
          sessions: activeOthers.map((s) => this.toSummary(s, new Date(nowMs))),
        });
      }
    }

    if (nowMs - session.lastSeenAt.getTime() > TOUCH_INTERVAL_MS) {
      await this.prisma.userSession.update({
        where: { id: sessionId },
        data: { lastSeenAt: new Date(nowMs) },
      });
    }
    this.cache.set(sessionId, { checkedAt: nowMs, valid: true, userId, lastSeenAt: nowMs });
  }

  private revokedError() {
    return new UnauthorizedException({
      statusCode: 401,
      code: SESSION_REVOKED,
      message: 'Энэ төхөөрөмжийн нэвтрэлт дууссан байна. Дахин нэвтэрнэ үү.',
    });
  }

  // ---------- Жагсаалт / хаах ----------

  async list(userId: string, currentSessionId?: string) {
    await this.expireIdle(userId);
    const now = new Date();
    const sessions = await this.prisma.userSession.findMany({
      where: { userId, revokedAt: null },
      orderBy: { lastSeenAt: 'desc' },
    });
    return sessions.map((s) => ({ ...this.toSummary(s, now), isCurrent: s.id === currentSessionId }));
  }

  async revoke(userId: string, sessionId: string) {
    return (await this.revokeMany(userId, [sessionId])) > 0;
  }

  async revokeMany(userId: string, sessionIds: string[]) {
    if (sessionIds.length === 0) return 0;
    const targets = await this.prisma.userSession.findMany({
      where: { id: { in: sessionIds }, userId, revokedAt: null },
      select: { id: true },
    });
    const ids = targets.map((t) => t.id);
    if (ids.length === 0) return 0;
    await this.prisma.userSession.updateMany({
      where: { id: { in: ids } },
      data: { revokedAt: new Date() },
    });
    await this.revokeTokensOf(ids);
    return ids.length;
  }

  async revokeOthers(userId: string, currentSessionId: string) {
    const targets = await this.prisma.userSession.findMany({
      where: { userId, revokedAt: null, id: { not: currentSessionId } },
      select: { id: true },
    });
    return this.revokeMany(
      userId,
      targets.map((t) => t.id),
    );
  }

  /** Нууц үг солих, бүртгэл идэвхгүй болгох, admin хүчээр гаргах үед. */
  async revokeAll(userId: string) {
    const targets = await this.prisma.userSession.findMany({
      where: { userId, revokedAt: null },
      select: { id: true },
    });
    return this.revokeMany(
      userId,
      targets.map((t) => t.id),
    );
  }

  /** Багц дуусах гэх мэтээр лимит багасахад хамгийн хуучин session-үүдийг хаана. */
  async enforceLimit(user: LimitUser) {
    const limits = await this.getLimits(user);
    const sessions = await this.prisma.userSession.findMany({
      where: { userId: user.id, revokedAt: null },
      orderBy: { lastSeenAt: 'desc' },
      select: { id: true },
    });
    const extra = sessions.slice(limits.maxDevices).map((s) => s.id);
    if (extra.length > 0) {
      this.logger.log(`Лимит хэтэрсэн ${extra.length} session хаав (user ${user.id})`);
      await this.revokeMany(user.id, extra);
    }
  }

  private async revokeTokensOf(sessionIds: string[]) {
    sessionIds.forEach((id) => this.cache.delete(id));
    await this.prisma.refreshToken.updateMany({
      where: { sessionId: { in: sessionIds }, revoked: false },
      data: { revoked: true },
    });
  }

  private async expireIdle(userId: string) {
    const cutoff = new Date(Date.now() - IDLE_EXPIRE_DAYS * 24 * 60 * 60 * 1000);
    const stale = await this.prisma.userSession.findMany({
      where: { userId, revokedAt: null, lastSeenAt: { lt: cutoff } },
      select: { id: true },
    });
    if (stale.length > 0)
      await this.revokeMany(
        userId,
        stale.map((s) => s.id),
      );
  }

  private toSummary(s: UserSession, now: Date): SessionSummary {
    return {
      id: s.id,
      deviceName: s.deviceName,
      deviceType: s.deviceType,
      ipAddress: s.ipAddress,
      lastSeenAt: s.lastSeenAt,
      createdAt: s.createdAt,
      isActiveNow: s.lastSeenAt.getTime() > now.getTime() - ACTIVE_WINDOW_MS,
    };
  }
}
