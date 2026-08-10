import axios from 'axios';

const TOKEN_KEY = 'ce_access_token';

// Browser → Next.js /api rewrite (stable in dev). SSR → backend URL directly.
const API_BASE =
  typeof window !== 'undefined'
    ? '/api'
    : `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

let accessToken: string | null =
  typeof window !== 'undefined' ? sessionStorage.getItem(TOKEN_KEY) : null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== 'undefined') {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
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
let pendingQueue: Array<() => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const url: string = original?.url ?? '';

    if (url.includes('/auth/refresh') || url.includes('/auth/login') || url.includes('/auth/register')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push(() => resolve(api(original)));
        });
      }

      isRefreshing = true;
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.accessToken);
        pendingQueue.forEach((cb) => cb());
        pendingQueue = [];
        return api(original);
      } catch (refreshError) {
        setAccessToken(null);
        const path = window.location.pathname;
        if (!path.startsWith('/login') && !path.startsWith('/register') && path !== '/') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);
