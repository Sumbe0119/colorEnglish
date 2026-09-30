import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService, ClientMeta } from './auth.service';
import { LoginReplaceDto } from './dto/login-replace.dto';
import { SessionsService } from '../sessions/sessions.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Role } from '@prisma/client';

const REFRESH_COOKIE = 'refresh_token';
const REFRESH_COOKIE_MAX_AGE_MS =
  Number(process.env.JWT_REFRESH_EXPIRES_DAYS ?? 30) * 24 * 60 * 60 * 1000;

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: REFRESH_COOKIE_MAX_AGE_MS,
};

/** Хүсэлтээс төхөөрөмжийн мэдээлэл (deviceId body-оос, UA/IP header-ээс). */
function clientMeta(req: Request, deviceId?: string): ClientMeta {
  const forwarded = req.headers['x-forwarded-for'];
  const forwardedIp = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim();
  return {
    deviceId,
    userAgent: req.headers['user-agent']?.slice(0, 512) ?? null,
    ipAddress: forwardedIp || req.ip || null,
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessions: SessionsService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // Token өгөхгүй — и-мэйл баталгаажуулсны дараа /auth/verify-email нэвтрүүлнэ.
    return this.authService.register(dto);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.verifyEmail(
      dto,
      clientMeta(req, dto.deviceId),
    );
    res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTS);
    return { user, accessToken };
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.login(
      dto,
      clientMeta(req, dto.deviceId),
    );
    res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTS);
    return { user, accessToken };
  }

  /** Төхөөрөмжийн лимит дүүрсэн үед сонгосон төхөөрөмжүүдээс гаргаад нэвтрэх. */
  @Public()
  @Post('login/replace')
  @HttpCode(HttpStatus.OK)
  async loginReplace(
    @Body() dto: LoginReplaceDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.loginReplace(
      dto,
      clientMeta(req),
    );
    res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTS);
    return { user, accessToken };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
      // passthrough: true үед res.json() буцааж болохгүй — Nest Response-ийг дахин serialize хийнэ
      throw new UnauthorizedException('Refresh token олдсонгүй');
    }
    const { user, accessToken, refreshToken } = await this.authService.refresh(token);
    res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTS);
    return { user, accessToken };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (token) await this.authService.logout(token);
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    return { success: true };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser('userId') userId: string) {
    const user = await this.authService.getMe(userId);
    return { user };
  }

  // ---------- Нэвтэрсэн төхөөрөмжүүд ----------

  @Get('sessions')
  async listSessions(
    @CurrentUser('userId') userId: string,
    @CurrentUser('sessionId') sessionId: string,
    @CurrentUser('role') role: Role,
  ) {
    const [sessions, limits] = await Promise.all([
      this.sessions.list(userId, sessionId),
      this.sessions.getLimits({ id: userId, role }),
    ]);
    return { sessions, limits };
  }

  /** Бусад бүх төхөөрөмжөөс гарах (одоогийнх хэвээр). */
  @Post('sessions/revoke-others')
  @HttpCode(HttpStatus.OK)
  async revokeOtherSessions(
    @CurrentUser('userId') userId: string,
    @CurrentUser('sessionId') sessionId: string,
  ) {
    const revoked = await this.sessions.revokeOthers(userId, sessionId);
    return { revoked };
  }

  /** Тодорхой төхөөрөмжөөс гаргах. Одоогийн session-ийг хаавал frontend logout хийнэ. */
  @Delete('sessions/:id')
  async revokeSession(
    @CurrentUser('userId') userId: string,
    @CurrentUser('sessionId') sessionId: string,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ok = await this.sessions.revoke(userId, id);
    if (!ok) throw new NotFoundException('Төхөөрөмж олдсонгүй');
    const isCurrent = id === sessionId;
    if (isCurrent) res.clearCookie(REFRESH_COOKIE, { path: '/' });
    return { success: true, isCurrent };
  }
}
