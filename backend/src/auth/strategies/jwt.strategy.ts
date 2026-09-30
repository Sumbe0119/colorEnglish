import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { SessionsService } from '../../sessions/sessions.service';

export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string;
  /** Төхөөрөмжийн session id — хүсэлт бүрд хүчинтэй эсэхийг шалгана */
  sid?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private sessions: SessionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET')!,
    });
  }

  async validate(payload: JwtPayload) {
    // sid-гүй хуучин token → refresh хийлгэнэ (хуучин refresh token session-гүй тул дахин нэвтэрнэ)
    if (!payload.sid) throw new UnauthorizedException('Дахин нэвтэрнэ үү');
    // Хасагдсан session бол 401 SESSION_REVOKED, зэрэг идэвхтэй лимит хэтэрвэл 409 SESSION_ACTIVE_LIMIT
    await this.sessions.assertActive(payload.sid, payload.sub, payload.role as Role);
    // request.user дотор хадгалагдана
    return { userId: payload.sub, email: payload.email, role: payload.role, sessionId: payload.sid };
  }
}
