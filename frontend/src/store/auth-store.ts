import { create } from 'zustand';
import { User } from '@/types/auth';
import { setAccessToken, getAccessToken } from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isHydrated: boolean;
  setSession: (user: User, accessToken: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isHydrated: false,
  setSession: (user, accessToken) => {
    setAccessToken(accessToken);
    set({ user, isHydrated: true });
  },
  clearSession: () => {
    setAccessToken(null);
    set({ user: null, isHydrated: true });
  },
}));

// SSR-д localStorage байхгүй тул client дээр token байвал хурдан hydrate
if (typeof window !== 'undefined' && getAccessToken()) {
  useAuthStore.setState({ isLoading: true });
}
