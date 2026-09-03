import axios from 'axios';

const TOKEN_KEY = 'ce_access_token';

// Browser → Next.js /api rewrite (stable in dev). SSR → backend URL directly.
const API_BASE =
  typeof window !== 'undefined'
    ? '/api'
    : `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

function readStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  const fromLocal = localStorage.getItem(TOKEN_KEY);
  if (fromLocal) return fromLocal;
  // Хуучин sessionStorage → localStorage шилжүүлэлт
  const fromSession = sessionStorage.getItem(TOKEN_KEY);
  if (fromSession) {
    localStorage.setItem(TOKEN_KEY, fromSession);
    sessionStorage.removeItem(TOKEN_KEY);
    return fromSession;
  }
  return null;
}

let accessToken: string | null = readStoredToken();

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    }
  }
}

export function getAccessToken() {
  return accessToken;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const url: string = original?.url ?? '';

    if (
      url.includes('/auth/refresh') ||
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: () => resolve(api(original)),
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.accessToken);
        pendingQueue.forEach(({ resolve }) => resolve(undefined));
        pendingQueue = [];
        return api(original);
      } catch (refreshError) {
        setAccessToken(null);
        pendingQueue.forEach(({ reject }) => reject(refreshError));
        pendingQueue = [];
        if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          if (
            !path.startsWith('/login') &&
            !path.startsWith('/forgot-password') &&
            path !== '/'
          ) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);
