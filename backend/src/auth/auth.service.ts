import {
  Injectable,
  ConflictException,
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

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const RESET_CODE_TTL_MS = 10 * 60 * 1000;
const RESET_REQUEST_COOLDOWN_MS = 60 * 1000;
const RESET_MAX_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private email: EmailService,
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

    const tokens = await this.issueTokenPair(user.id, user.email, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true },
    });
    if (!user) throw new UnauthorizedException('И-мэйл эсвэл нууц үг буруу байна');

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException('И-мэйл эсвэл нууц үг буруу байна');

    if (!user.isActive) throw new UnauthorizedException('Таны бүртгэл идэвхгүй болсон байна');

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const tokens = await this.issueTokenPair(user.id, user.email, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refresh(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token хүчингүй байна, дахин нэвтэрнэ үү');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    const tokens = await this.issueTokenPair(stored.user.id, stored.user.email, stored.user.role);
    return { user: this.sanitizeUser(stored.user), ...tokens };
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
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

    return { success: true };
  }

  private async issueTokenPair(userId: string, email: string, role: string): Promise<TokenPair> {
    const secret = this.config.get<string>('JWT_ACCESS_SECRET');
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET тохируулаагүй байна (.env.prod / .env.local)');
    }

    const payload = { sub: userId, email, role };

    const accessToken = await this.jwt.signAsync(payload, {
      secret,
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES') ?? '15m',
    });

    const refreshTokenValue = randomUUID() + randomUUID();
    const refreshExpiresDays = Number(this.config.get<string>('JWT_REFRESH_EXPIRES_DAYS') ?? 30);
    const expiresAt = new Date(Date.now() + refreshExpiresDays * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId,
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
