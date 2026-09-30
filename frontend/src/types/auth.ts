export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  role: 'STUDENT' | 'ADMIN' | 'EDITOR';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RegisterResponse {
  requiresVerification: true;
  email: string;
}

/** Backend 403 + code=EMAIL_NOT_VERIFIED буцаахад login → /verify-email руу шилжүүлнэ. */
export const EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED';

/** 409: төхөөрөмжийн лимит дүүрсэн — хаах төхөөрөмжөө сонгоод /auth/login/replace дуудна. */
export const SESSION_LIMIT_REACHED = 'SESSION_LIMIT_REACHED';
/** 409: бүртгэл өөр төхөөрөмж дээр зэрэг ашиглагдаж байна. */
export const SESSION_ACTIVE_LIMIT = 'SESSION_ACTIVE_LIMIT';
/** 401: энэ төхөөрөмжийн session хаагдсан. */
export const SESSION_REVOKED = 'SESSION_REVOKED';

export interface SessionLimits {
  maxDevices: number;
  maxActive: number;
  refreshDays: number;
}

export interface DeviceSession {
  id: string;
  deviceName: string | null;
  deviceType: 'phone' | 'tablet' | 'desktop' | 'unknown' | string | null;
  ipAddress: string | null;
  lastSeenAt: string;
  createdAt: string;
  isActiveNow: boolean;
  isCurrent?: boolean;
}

/** 409 SESSION_LIMIT_REACHED хариуны body */
export interface SessionLimitError {
  code: typeof SESSION_LIMIT_REACHED;
  message: string;
  limits: SessionLimits;
  sessions: DeviceSession[];
  ticket: string;
}
