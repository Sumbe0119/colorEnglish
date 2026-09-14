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
