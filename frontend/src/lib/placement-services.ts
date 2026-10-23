// frontend/src/lib/placement-services.ts
// Түвшин тогтоох тест — нэвтрэхгүй өгч, үр дүнг QPay төлбөрөөр нээнэ.
// Оролдлогын эзэмшлийг localStorage дахь нууц түлхүүрээр (X-Placement-Token) нотолно.
import { api } from '@/lib/api';
import type { QpayBankUrl } from '@/lib/billing-services';
import type { LevelCode } from '@/types/api';

export type PlacementBand = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type PlacementSkill = 'GRAMMAR' | 'VOCABULARY' | 'READING';
export type PlacementLevelKey = 'PRE_A1' | 'A1' | 'A2' | 'B1' | 'B1_PLUS' | 'B2' | 'B2_PLUS' | 'C1';

export const PLACEMENT_BANDS: PlacementBand[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export const PLACEMENT_BAND_LABELS: Record<PlacementBand, { short: string; title: string }> = {
  A1: { short: 'A1', title: 'Анхан шат' },
  A2: { short: 'A2', title: 'Анхан дэвшсэн' },
  B1: { short: 'B1', title: 'Дунд шат' },
  B2: { short: 'B2', title: 'Дунд ахисан' },
  C1: { short: 'C1', title: 'Ахисан шат' },
};

export const PLACEMENT_SKILL_LABELS: Record<PlacementSkill, string> = {
  GRAMMAR: 'Дүрэм',
  VOCABULARY: 'Үгийн сан',
  READING: 'Унших',
};

export type PlacementQuestion = {
  id: string;
  band: PlacementBand;
  skill: PlacementSkill;
  /** Унших даалгаврын богино эх */
  passage?: string;
  /** "___" — хоосон зай */
  prompt: string;
  options: string[];
};

export type PlacementConfig = {
  version: number;
  priceMnt: number;
  questionCount: number;
  estimatedMinutes: number;
  qpayReady: boolean;
};

export type PlacementQuestionSet = PlacementConfig & { questions: PlacementQuestion[] };

export type PlacementPaymentStatus = 'PENDING' | 'PAID' | 'CANCELED' | 'EXPIRED' | 'FAILED';

export type PlacementPayment = {
  status: PlacementPaymentStatus;
  amountMnt: number;
  hasInvoice: boolean;
  senderInvoiceNo: string | null;
  payerPhone: string | null;
  paidAt: string | null;
  qrImage: string | null;
  qrText: string | null;
  shortUrl: string | null;
  urls: QpayBankUrl[];
  qpayReady: boolean;
};

export type PlacementBandResult = { band: PlacementBand; correct: number; total: number; passed: boolean };
export type PlacementSkillResult = { skill: PlacementSkill; correct: number; total: number; percent: number };

export type PlacementReviewItem = {
  id: string;
  band: PlacementBand;
  skill: PlacementSkill;
  passage?: string;
  prompt: string;
  options: string[];
  correct: number;
  chosen: number | null;
  isCorrect: boolean;
  explanation: string;
};

export type PlacementResult = {
  level: LevelCode;
  levelKey: PlacementLevelKey;
  /** "B1" / "B1+" */
  short: string;
  title: string;
  cefr: string;
  description: string;
  recommendations: string[];
  startHref: string;
  startLabel: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  bands: PlacementBandResult[];
  skills: PlacementSkillResult[];
  review: PlacementReviewItem[];
  durationSec: number | null;
  completedAt: string;
  paidAt: string | null;
};

export type PlacementAttempt = {
  id: string;
  status: 'LOCKED' | 'UNLOCKED';
  createdAt: string;
  totalQuestions: number;
  answeredCount: number | null;
  durationSec: number | null;
  priceMnt: number;
  payment: PlacementPayment;
  result: PlacementResult | null;
};

export type PlacementSubmitResponse = PlacementAttempt & { token: string };
export type PlacementCheckResponse = PlacementAttempt & { activated: boolean; alreadyPaid: boolean };

const TOKEN_HEADER = 'X-Placement-Token';

function tokenHeaders(token: string) {
  return { headers: { [TOKEN_HEADER]: token } };
}

export async function getPlacementConfig() {
  const { data } = await api.get<PlacementConfig>('/placement-test/config');
  return data;
}

export async function getPlacementQuestions() {
  const { data } = await api.get<PlacementQuestionSet>('/placement-test/questions');
  return data;
}

/** answers: questionId → сонгосон индекс. Хариу түгжээтэй ирнэ; token-ийг хадгална */
export async function submitPlacement(answers: Record<string, number>, durationSec?: number) {
  const { data } = await api.post<PlacementSubmitResponse>('/placement-test/attempts', {
    answers: Object.entries(answers).map(([questionId, choice]) => ({ questionId, choice })),
    ...(durationSec != null ? { durationSec: Math.max(0, Math.round(durationSec)) } : {}),
  });
  return data;
}

export async function getPlacementAttempt(id: string, token: string) {
  const { data } = await api.get<PlacementAttempt>(`/placement-test/attempts/${id}`, tokenHeaders(token));
  return data;
}

export async function payPlacement(id: string, token: string, phone: string) {
  const { data } = await api.post<PlacementAttempt>(
    `/placement-test/attempts/${id}/pay`,
    { phone: phone.replace(/\D/g, '') },
    tokenHeaders(token),
  );
  return data;
}

export async function checkPlacement(id: string, token: string) {
  const { data } = await api.post<PlacementCheckResponse>(
    `/placement-test/attempts/${id}/check`,
    {},
    tokenHeaders(token),
  );
  return data;
}

export function isNotFoundError(err: unknown) {
  return (err as { response?: { status?: number } })?.response?.status === 404;
}

// ───────────── Төхөөрөмж дээрх хадгалалт ─────────────

const SESSION_KEY = 'ce_placement_session';
const DRAFT_KEY = 'ce_placement_draft';
/** billing-panel-тэй ижил түлхүүр — төлбөрийн утас нэг л удаа оруулна */
export const PAY_PHONE_STORAGE_KEY = 'ce_pay_phone';

/** Илгээсэн оролдлого + нууц түлхүүр — үр дүнг дахин нээхэд (төлсөн бол дахин төлөхгүй) */
export type PlacementSession = { id: string; token: string; createdAt: string };

/** Дуусаагүй тестийн хариултууд — хуудас дахин ачаалахад үргэлжлүүлнэ */
export type PlacementDraft = {
  version: number;
  answers: Record<string, number>;
  index: number;
  elapsedSec: number;
  updatedAt: string;
};

function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown | null) {
  if (typeof window === 'undefined') return;
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore (private mode / quota)
  }
}

export function loadPlacementSession(): PlacementSession | null {
  const s = readJson<PlacementSession>(SESSION_KEY);
  return s && typeof s.id === 'string' && typeof s.token === 'string' ? s : null;
}
export function savePlacementSession(session: PlacementSession) {
  writeJson(SESSION_KEY, session);
}
export function clearPlacementSession() {
  writeJson(SESSION_KEY, null);
}

export function loadPlacementDraft(): PlacementDraft | null {
  const d = readJson<PlacementDraft>(DRAFT_KEY);
  return d && typeof d.version === 'number' && d.answers && typeof d.answers === 'object' ? d : null;
}
export function savePlacementDraft(draft: PlacementDraft) {
  writeJson(DRAFT_KEY, draft);
}
export function clearPlacementDraft() {
  writeJson(DRAFT_KEY, null);
}

export function readStoredPayPhone() {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(PAY_PHONE_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}
export function storePayPhone(phone: string) {
  try {
    localStorage.setItem(PAY_PHONE_STORAGE_KEY, phone);
  } catch {
    // ignore
  }
}

export function formatDuration(sec: number | null | undefined) {
  if (sec == null || !Number.isFinite(sec)) return '—';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ───────────── Админ ─────────────

export type AdminPlacementStatus = 'PAID' | 'PENDING' | 'UNPAID' | 'EXPIRED' | 'FAILED' | 'CANCELED';

export type AdminPlacementRow = {
  id: string;
  createdAt: string;
  paidAt: string | null;
  payerPhone: string | null;
  user: { id: string; email: string; phone: string | null; displayName: string } | null;
  level: LevelCode;
  levelKey: PlacementLevelKey;
  levelShort: string;
  levelTitle: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  durationSec: number | null;
  amountMnt: number;
  status: AdminPlacementStatus;
  senderInvoiceNo: string | null;
  qpayInvoiceId: string | null;
  qpayPaymentId: string | null;
  activationSource: string | null;
  adminNote: string | null;
  qpayCheckedAt: string | null;
};

export type AdminPlacementQuery = {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: 'all' | AdminPlacementStatus;
};

export type AdminPlacementPage = {
  items: AdminPlacementRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: {
    totalAttempts: number;
    paidCount: number;
    paidRevenueMnt: number;
    pendingCount: number;
    todayCount: number;
    todayRevenueMnt: number;
    priceMnt: number;
  };
};

export async function getAdminPlacementAttempts(query: AdminPlacementQuery = {}) {
  const params: Record<string, string | number> = {};
  if (query.page) params.page = query.page;
  if (query.pageSize) params.pageSize = query.pageSize;
  if (query.q?.trim()) params.q = query.q.trim();
  if (query.status && query.status !== 'all') params.status = query.status;
  const { data } = await api.get<AdminPlacementPage>('/placement-test/admin/attempts', { params });
  return data;
}

export async function recheckAdminPlacement(id: string) {
  const { data } = await api.post<{ id: string; status: PlacementPaymentStatus; activated: boolean; alreadyPaid: boolean }>(
    `/placement-test/admin/attempts/${id}/recheck`,
  );
  return data;
}

export async function confirmAdminPlacement(id: string, note?: string) {
  const { data } = await api.post<{ id: string; status: PlacementPaymentStatus; activated: boolean; alreadyPaid: boolean }>(
    `/placement-test/admin/attempts/${id}/confirm`,
    note?.trim() ? { note: note.trim() } : {},
  );
  return data;
}
