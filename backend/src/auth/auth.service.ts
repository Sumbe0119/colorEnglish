import {
  Injectable,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { randomUUID, randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { LoginReplaceDto } from './dto/login-replace.dto';
import { SessionsService } from '../sessions/sessions.service';
import { Role } from '@prisma/client';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/** Нэвтрэх хүсэлтийн төхөөрөмжийн мэдээлэл (controller-оос ирнэ). */
export interface ClientMeta {
  deviceId?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
}

const REPLACE_TICKET_PURPOSE = 'session-replace';
const REPLACE_TICKET_TTL = '5m';

const RESET_CODE_TTL_MS = 10 * 60 * 1000;
const RESET_REQUEST_COOLDOWN_MS = 60 * 1000;
const RESET_MAX_ATTEMPTS = 5;

const VERIFY_CODE_TTL_MS = 10 * 60 * 1000;
const VERIFY_REQUEST_COOLDOWN_MS = 60 * 1000;
const VERIFY_MAX_ATTEMPTS = 5;
/** Frontend энэ кодоор "баталгаажуулах хуудас руу шилжүүлэх" гэдгийг таньдаг. */
export const EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private email: EmailService,
    private sessions: SessionsService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Энэ и-мэйл хаягаар бүртгэл аль хэдийн үүссэн байна');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        profile: { create: {} },
        streak: { create: {} },
        subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
      },
      include: { profile: true },
    });

    // Token өгөхгүй — эхлээд и-мэйлээ баталгаажуулна.
    await this.sendVerificationCode(user.id, user.email);
    return { requiresVerification: true as const, email: user.email };
  }

  /** Бүртгүүлсний дараа и-мэйлээр ирсэн 6 оронтой кодыг шалгаад нэвтрүүлнэ. */
  async verifyEmail(dto: VerifyEmailDto, meta: ClientMeta = {}) {
    const invalidMessage = 'Код буруу эсвэл хугацаа дууссан байна';
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true },
    });
    if (!user) throw new UnauthorizedException(invalidMessage);
    // Аль хэдийн баталгаажсан бол код шалгалт алгасч token олгож болохгүй (зөвхөн и-мэйлээр бусдын бүртгэлд нэвтрэх боломж) — /auth/login ашиглана
    if (user.isEmailVerified) throw new UnauthorizedException(invalidMessage);

    const record = await this.prisma.emailVerificationCode.findFirst({
      where: { userId: user.id, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException(invalidMessage);
    }
    if (record.attempts >= VERIFY_MAX_ATTEMPTS) {
      throw new UnauthorizedException('Хэт олон буруу оролдлого хийсэн байна, шинэ код хүснэ үү');
    }

    const valid = await argon2.verify(record.codeHash, dto.code);
    if (!valid) {
      await this.prisma.emailVerificationCode.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException(invalidMessage);
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true, lastLoginAt: new Date() },
      }),
      this.prisma.emailVerificationCode.update({
        where: { id: record.id },
        data: { consumedAt: new Date() },
      }),
    ]);
    user.isEmailVerified = true;

    if (!user.isActive) throw new UnauthorizedException('Таны бүртгэл идэвхгүй болсон байна');

    // Шинэ бүртгэл — өөр session байхгүй тул лимит хэтрэхгүй
    const tokens = await this.startSession(user, meta);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  /** Кодыг дахин илгээх (1 минутын cooldown). И-мэйл бүртгэлтэй эсэхийг задруулахгүй. */
  async resendVerification(dto: ResendVerificationDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (user && user.isActive && !user.isEmailVerified) {
      await this.sendVerificationCode(user.id, user.email);
    }
    return { success: true };
  }

  private async sendVerificationCode(userId: string, email: string) {
    const recent = await this.prisma.emailVerificationCode.findFirst({
      where: {
        userId,
        consumedAt: null,
        createdAt: { gt: new Date(Date.now() - VERIFY_REQUEST_COOLDOWN_MS) },
      },
    });
    if (recent) return;

    await this.prisma.emailVerificationCode.updateMany({
      where: { userId, consumedAt: null },
      data: { consumedAt: new Date() },
    });

    const code = randomInt(100000, 1000000).toString();
    const codeHash = await argon2.hash(code);
    await this.prisma.emailVerificationCode.create({
      data: { userId, codeHash, expiresAt: new Date(Date.now() + VERIFY_CODE_TTL_MS) },
    });

    await this.email.sendEmailVerificationCode(email, code).catch((err) => {
      this.logger.error(`Баталгаажуулах и-мэйл илгээхэд алдаа гарлаа: ${email}`, err as Error);
    });
  }

  async login(dto: LoginDto, meta: ClientMeta = {}) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true },
    });
    if (!user) throw new UnauthorizedException('И-мэйл эсвэл нууц үг буруу байна');

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException('И-мэйл эсвэл нууц үг буруу байна');

    if (!user.isActive) throw new UnauthorizedException('Таны бүртгэл идэвхгүй болсон байна');

    if (!user.isEmailVerified) {
      // Нууц үг зөв тул шинэ код илгээж, frontend-ийг баталгаажуулах хуудас руу чиглүүлнэ.
      await this.sendVerificationCode(user.id, user.email);
      throw new ForbiddenException({
        statusCode: 403,
        code: EMAIL_NOT_VERIFIED,
        message: 'И-мэйл хаягаа баталгаажуулаагүй байна. И-мэйлээр ирсэн кодоо оруулна уу.',
        email: user.email,
      });
    }

    // Төхөөрөмжийн лимит дүүрсэн бол 409 SESSION_LIMIT_REACHED шидэгдэнэ.
    // Нууц үг зөв тул frontend-д "хаах төхөөрөмжөө сонго" ticket өгнө.
    let tokens: TokenPair;
    try {
      tokens = await this.startSession(user, meta);
    } catch (err) {
      throw await this.attachReplaceTicket(err, user.id, meta);
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return { user: this.sanitizeUser(user), ...tokens };
  }

  /**
   * Лимит дүүрсэн үед: сонгосон session-үүдийг хааж, нэвтрэлтийг үргэлжлүүлнэ.
   * Ticket нь login дээр нууц үг зөв шалгагдсаныг 5 минутын турш батална.
   */
  async loginReplace(dto: LoginReplaceDto, meta: ClientMeta = {}) {
    const expired = 'Хугацаа дууссан байна, дахин нэвтэрнэ үү';
    let payload: { sub: string; purpose: string; deviceId: string };
    try {
      payload = await this.jwt.verifyAsync(dto.ticket, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      });
    } catch {
      throw new UnauthorizedException(expired);
    }
    if (payload.purpose !== REPLACE_TICKET_PURPOSE) throw new UnauthorizedException(expired);

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { profile: true },
    });
    if (!user || !user.isActive || !user.isEmailVerified) throw new UnauthorizedException(expired);

    await this.sessions.revokeMany(user.id, dto.revokeSessionIds ?? []);

    const nextMeta = { ...meta, deviceId: payload.deviceId };
    let tokens: TokenPair;
    try {
      tokens = await this.startSession(user, nextMeta);
    } catch (err) {
      throw await this.attachReplaceTicket(err, user.id, nextMeta);
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refresh(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true, session: true },
    });

    if (
      !stored ||
      stored.revoked ||
      stored.expiresAt < new Date() ||
      !stored.session ||
      stored.session.revokedAt
    ) {
      throw new UnauthorizedException('Refresh token хүчингүй байна, дахин нэвтэрнэ үү');
    }
    if (!stored.user.isActive) {
      throw new UnauthorizedException('Таны бүртгэл идэвхгүй болсон байна');
    }

    await this.prisma.$transaction([
      this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } }),
      this.prisma.userSession.update({
        where: { id: stored.session.id },
        data: { lastSeenAt: new Date() },
      }),
    ]);

    const limits = await this.sessions.getLimits(stored.user);
    const tokens = await this.issueTokenPair(stored.user, stored.session.id, limits.refreshDays);
    return { user: this.sanitizeUser(stored.user), ...tokens };
  }

  async logout(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      select: { id: true, userId: true, sessionId: true },
    });
    if (!stored) return { success: true };
    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });
    // Тухайн төхөөрөмжийн session-ийг бүхэлд нь хаана (бусад төхөөрөмж хэвээр)
    if (stored.sessionId) await this.sessions.revoke(stored.userId, stored.sessionId);
    return { success: true };
  }

  async getMe(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          streak: true,
          subscription: true,
        },
      });
      if (!user) throw new UnauthorizedException('Хэрэглэгч олдсонгүй');
      return this.sanitizeUser(user);
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      // Хуучин SubscriptionPlan enum / schema mismatch үед бүрэн 500 болохгүй
      this.logger.error(`getMe include subscription failed for ${userId}`, err as Error);
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          streak: true,
        },
      });
      if (!user) throw new UnauthorizedException('Хэрэглэгч олдсонгүй');
      return this.sanitizeUser({ ...user, subscription: null });
    }
  }

  async requestPasswordReset(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    // Хэрэглэгч байхгүй/идэвхгүй байсан ч и-мэйл бүртгэлтэй эсэхийг мэдэгдэхгүйн тулд ижил хариу буцаана
    if (user && user.isActive) {
      const recent = await this.prisma.passwordResetCode.findFirst({
        where: {
          userId: user.id,
          consumedAt: null,
          createdAt: { gt: new Date(Date.now() - RESET_REQUEST_COOLDOWN_MS) },
        },
      });

      if (!recent) {
        await this.prisma.passwordResetCode.updateMany({
          where: { userId: user.id, consumedAt: null },
          data: { consumedAt: new Date() },
        });

        const code = randomInt(100000, 1000000).toString();
        const codeHash = await argon2.hash(code);
        await this.prisma.passwordResetCode.create({
          data: {
            userId: user.id,
            codeHash,
            expiresAt: new Date(Date.now() + RESET_CODE_TTL_MS),
          },
        });

        await this.email.sendPasswordResetCode(user.email, code).catch((err) => {
          this.logger.error(`Нууц үг сэргээх и-мэйл илгээхэд алдаа гарлаа: ${user.email}`, err as Error);
        });
      }
    }

    return { success: true };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const invalidMessage = 'Код буруу эсвэл хугацаа дууссан байна';
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException(invalidMessage);

    const record = await this.prisma.passwordResetCode.findFirst({
      where: { userId: user.id, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException(invalidMessage);
    }
    if (record.attempts >= RESET_MAX_ATTEMPTS) {
      throw new UnauthorizedException('Хэт олон буруу оролдлого хийсэн байна, шинэ код хүснэ үү');
    }

    const valid = await argon2.verify(record.codeHash, dto.code);
    if (!valid) {
      await this.prisma.passwordResetCode.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException(invalidMessage);
    }

    const passwordHash = await argon2.hash(dto.newPassword);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
      this.prisma.passwordResetCode.update({
        where: { id: record.id },
        data: { consumedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: user.id, revoked: false },
        data: { revoked: true },
      }),
    ]);
    // Нууц үг солигдсон тул бүх төхөөрөмжөөс гаргана
    await this.sessions.revokeAll(user.id);

    return { success: true };
  }

  /** Session нээж (лимит шалгаж) token хос олгоно. */
  private async startSession(
    user: { id: string; email: string; role: Role },
    meta: ClientMeta,
  ): Promise<TokenPair> {
    const deviceId = meta.deviceId?.trim() || randomUUID();
    const { session, limits } = await this.sessions.openSession(user, deviceId, {
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    });
    return this.issueTokenPair(user, session.id, limits.refreshDays);
  }

  /** SESSION_LIMIT_REACHED алдаанд 5 минутын ticket хавсаргана; бусад алдааг өөрчлөхгүй. */
  private async attachReplaceTicket(err: unknown, userId: string, meta: ClientMeta) {
    if (!(err instanceof ConflictException)) return err;
    const body = err.getResponse();
    if (typeof body !== 'object' || (body as { code?: string }).code !== 'SESSION_LIMIT_REACHED') {
      return err;
    }
    const deviceId = meta.deviceId?.trim() || randomUUID();
    const ticket = await this.jwt.signAsync(
      { sub: userId, purpose: REPLACE_TICKET_PURPOSE, deviceId },
      { secret: this.config.get<string>('JWT_ACCESS_SECRET'), expiresIn: REPLACE_TICKET_TTL },
    );
    return new ConflictException({ ...(body as object), ticket });
  }

  private async issueTokenPair(
    user: { id: string; email: string; role: Role },
    sessionId: string,
    refreshDays: number,
  ): Promise<TokenPair> {
    const secret = this.config.get<string>('JWT_ACCESS_SECRET');
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET тохируулаагүй байна (.env.prod / .env.local)');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, sid: sessionId };

    const accessToken = await this.jwt.signAsync(payload, {
      secret,
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES') ?? '15m',
    });

    const refreshTokenValue = randomUUID() + randomUUID();
    const expiresAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        sessionId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken: refreshTokenValue };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
