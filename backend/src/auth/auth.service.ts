import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
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
