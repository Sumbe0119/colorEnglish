// frontend/src/lib/teacher-services.ts
// Багшаар ажиллах хүсэлт (CV) — нүүр хуудасны footer-оос нэвтрэхгүй илгээнэ, админ хянана.
import { api } from '@/lib/api';

export type TeacherApplicationStatus = 'NEW' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';

export const TEACHER_STATUS_LABELS: Record<TeacherApplicationStatus, string> = {
  NEW: 'Шинэ',
  REVIEWED: 'Хянасан',
  ACCEPTED: 'Зөвшөөрсөн',
  REJECTED: 'Татгалзсан',
};

export const TEACHER_STATUSES: TeacherApplicationStatus[] = ['NEW', 'REVIEWED', 'ACCEPTED', 'REJECTED'];

export type TeacherEducation = { school: string; major?: string; period?: string };
export type TeacherExperience = { company: string; position?: string; period?: string; description?: string };
export type TeacherAward = { title: string; year?: string };
export type TeacherOtherLanguage = { language: string; level: string };

/** Бусад гадаад хэлний түвшний сонголтууд (form-д select) */
export const LANGUAGE_LEVELS = ['Муу', 'Дунд', 'Сайн', 'Бүрэн эзэмшсэн'] as const;

export type TeacherLanguageScore = { test: string; score: string; year?: string };

/** Илгээх payload — backend CreateTeacherApplicationDto-той ижил */
export type TeacherApplicationInput = {
  lastName: string;
  firstName: string;
  phone: string;
  email?: string;
  contactName?: string;
  contactPhone: string;
  /** YYYY-MM-DD */
  birthDate: string;
  /** uploadTeacherPhoto()-оос ирсэн url */
  photoUrl: string;
  aboutMe: string;
  otherLanguages: TeacherOtherLanguage[];
  instagram?: string;
  facebook?: string;
  educations: TeacherEducation[];
  experiences: TeacherExperience[];
  awards: TeacherAward[];
  hasLanguageScore: boolean;
  languageScores: TeacherLanguageScore[];
  hobbies: string;
  fiveYearGoals: string;
  contentInterest: boolean;
  contentReason: string;
  note?: string;
};

export type TeacherApplicationSubmitResponse = { id: string; createdAt: string };

export async function uploadTeacherPhoto(file: File) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<{ url: string; filename: string }>('/teacher-applications/photo', form, {
    // Content-Type-ийг axios өөрөө multipart boundary-тай тавина
    headers: { 'Content-Type': undefined as unknown as string },
    maxBodyLength: 6 * 1024 * 1024,
    maxContentLength: 6 * 1024 * 1024,
    transformRequest: [
      (body, headers) => {
        if (body instanceof FormData && headers) {
          delete (headers as Record<string, unknown>)['Content-Type'];
        }
        return body;
      },
    ],
  });
  return data;
}

export async function submitTeacherApplication(input: TeacherApplicationInput) {
  const { data } = await api.post<TeacherApplicationSubmitResponse>('/teacher-applications', input);
  return data;
}

// ───────────── Админ ─────────────

export type AdminTeacherApplication = {
  id: string;
  lastName: string;
  firstName: string;
  fullName: string;
  phone: string;
  email: string | null;
  contactName: string | null;
  contactPhone: string;
  /** YYYY-MM-DD */
  birthDate: string;
  age: number;
  photoUrl: string;
  /** Хуучин хүсэлтэд null */
  aboutMe: string | null;
  otherLanguages: TeacherOtherLanguage[];
  instagram: string | null;
  facebook: string | null;
  educations: TeacherEducation[];
  experiences: TeacherExperience[];
  awards: TeacherAward[];
  hasLanguageScore: boolean;
  languageScores: TeacherLanguageScore[];
  /** Хуучин нэг талбартай хүсэлтүүдэд л утгатай */
  legacyEducation: string | null;
  legacyExperience: string | null;
  hobbies: string;
  fiveYearGoals: string;
  contentInterest: boolean;
  contentReason: string;
  note: string | null;
  status: TeacherApplicationStatus;
  adminNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminTeacherApplicationsQuery = {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: 'all' | TeacherApplicationStatus;
};

export type AdminTeacherApplicationsPage = {
  items: AdminTeacherApplication[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: { total: number; newCount: number; todayCount: number; acceptedCount: number };
};

export async function getAdminTeacherApplications(query: AdminTeacherApplicationsQuery = {}) {
  const params: Record<string, string | number> = {};
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;
  if (query.q?.trim()) params.q = query.q.trim();
  if (query.status && query.status !== 'all') params.status = query.status;
  const { data } = await api.get<AdminTeacherApplicationsPage>('/admin/teacher-applications', { params });
  return data;
}

export async function getAdminTeacherApplication(id: string) {
  const { data } = await api.get<AdminTeacherApplication>(`/admin/teacher-applications/${id}`);
  return data;
}

export async function updateAdminTeacherApplication(
  id: string,
  patch: { status?: TeacherApplicationStatus; adminNote?: string | null },
) {
  const { data } = await api.patch<AdminTeacherApplication>(`/admin/teacher-applications/${id}`, patch);
  return data;
}

export async function deleteAdminTeacherApplication(id: string) {
  const { data } = await api.delete<{ id: string; deleted: boolean }>(`/admin/teacher-applications/${id}`);
  return data;
}

/** YYYY-MM-DD → "1995.03.12" */
export function formatBirthDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${y}.${m}.${d}` : iso;
}

// ───────────── Серверийн алдааг ойлгомжтой болгох ─────────────

const FIELD_LABELS: Record<string, string> = {
  lastName: 'Овог',
  firstName: 'Нэр',
  phone: 'Утасны дугаар',
  email: 'И-мэйл',
  instagram: 'Instagram',
  facebook: 'Facebook',
  contactName: 'Холбоо барих хүний нэр',
  contactPhone: 'Холбоо барих хүний дугаар',
  birthDate: 'Төрсөн огноо',
  photoUrl: 'Цээж зураг',
  aboutMe: 'Өөрийн тухай',
  otherLanguages: 'Бусад гадаад хэл',
  educations: 'Боловсрол',
  experiences: 'Ажлын туршлага',
  awards: 'Гавьяа, шагнал',
  hasLanguageScore: 'Хэлний оноо байгаа эсэх',
  languageScores: 'Хэлний оноо',
  hobbies: 'Хобби',
  fiveYearGoals: 'Ойрын 5 жилийн зорилго',
  contentInterest: 'Контент хийх сонирхол',
  contentReason: 'Контентын шалтгаан',
  note: 'Нэмэлт мэдээлэл',
};

const SUB_LABELS: Record<string, string> = {
  school: 'сургууль',
  major: 'мэргэжил',
  period: 'хугацаа',
  company: 'байгууллага',
  position: 'албан тушаал',
  description: 'хийсэн ажил',
  title: 'нэр',
  year: 'он',
  test: 'шалгалт',
  score: 'оноо',
  language: 'хэл',
  level: 'түвшин',
};

/** class-validator-ийн англи мессежийг (нэг мөр) монгол болгоно. Монгол мессеж хэвээр үлдэнэ. */
function translateOne(raw: string): string {
  if (/[А-Яа-яӨөҮү]/.test(raw)) return raw;
  const m = /^([\w.]+)\s+(.*)$/.exec(raw);
  if (!m) return raw;
  const parts = m[1].split('.');
  const root = FIELD_LABELS[parts[0]] ?? parts[0];
  const row = parts[1] !== undefined && /^\d+$/.test(parts[1]) ? ` (${Number(parts[1]) + 1}-р мөр` : '';
  const sub = parts.length > 2 ? SUB_LABELS[parts[2]] ?? parts[2] : '';
  const label = row ? `${root}${row}${sub ? `, ${sub}` : ''})` : root;
  const rest = m[2];
  const max = /shorter than or equal to (\d+)/.exec(rest);
  if (max) return `${label}: ${max[1]} тэмдэгтээс хэтрэхгүй байх ёстой`;
  if (/should not be empty|must be a string|must be longer|must contain at least/.test(rest)) return `${label}: бөглөнө үү`;
  return `${label}: буруу утгатай байна`;
}

/** Илгээх үед серверээс ирсэн алдаанаас хэрэглэгчид харуулах мөрүүдийг гаргана. */
export function getTeacherApplicationErrors(err: unknown, fallback: string): string[] {
  const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  const list = Array.isArray(message) ? message : typeof message === 'string' ? [message] : [];
  if (list.length === 0) return [fallback];

  // "property X should not exist" — сервер хуучин хувилбартай (шинэчлэгдээгүй) гэсэн үг
  if (list.some((m) => /should not exist/.test(m))) {
    return ['Сервер шинэчлэгдээгүй байна. Түр хүлээгээд дахин оролдоно уу, үргэлжилбэл админд мэдэгдэнэ үү.'];
  }
  return Array.from(new Set(list.map(translateOne)));
}
