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
