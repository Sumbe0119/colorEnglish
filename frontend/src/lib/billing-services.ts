// frontend/src/lib/billing-services.ts
import { api } from '@/lib/api';

export type SubscriptionPlanCode = string;

export type PricingPlan = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  priceMnt: number;
  discountPercent: number;
  amountMnt: number;
  durationDays: number;
  isActive: boolean;
  sortOrder: number;
};

export type SubscriptionMe = {
  id: string;
  userId: string;
  plan: SubscriptionPlanCode;
  status: string;
  startedAt: string;
  expiresAt: string | null;
  autoRenew: boolean;
  isPro: boolean;
  daysLeft: number | null;
  /** ADMIN / EDITOR — VIP төлбөргүйгээр бүх контент нээлттэй */
  staffAccess?: boolean;
  qpayReady: boolean;
};

export type QpayBankUrl = {
  name: string;
  description?: string;
  logo?: string;
  link: string;
};

export type PaymentRecord = {
  id: string;
  userId: string;
  planId: string;
  planCode: SubscriptionPlanCode;
  amountMnt: number;
  listPriceMnt: number;
  discountPercent: number;
  durationDays: number;
  status: 'PENDING' | 'PAID' | 'CANCELED' | 'EXPIRED' | 'FAILED';
  senderInvoiceNo: string;
  qpayInvoiceId: string | null;
  qpayPaymentId: string | null;
  qrImage: string | null;
  qrText: string | null;
  shortUrl: string | null;
  urlsJson: QpayBankUrl[] | unknown | null;
  paidAt: string | null;
  subscriptionEnds: string | null;
  createdAt: string;
  plan?: { id: string; name: string; code: SubscriptionPlanCode };
};

export async function getSubscriptionMe() {
  const { data } = await api.get<SubscriptionMe>('/subscriptions/me');
  return data;
}

export async function getPricingPlans() {
  const { data } = await api.get<PricingPlan[]>('/subscriptions/plans');
  return data;
}

export async function createPayment(planId: string) {
  const { data } = await api.post<PaymentRecord>('/subscriptions/payments', { planId });
  return data;
}

export async function listMyPayments() {
  const { data } = await api.get<PaymentRecord[]>('/subscriptions/payments');
  return data;
}

export async function getPayment(id: string) {
  const { data } = await api.get<PaymentRecord>(`/subscriptions/payments/${id}`);
  return data;
}

export async function checkPayment(id: string) {
  const { data } = await api.post<{
    payment: PaymentRecord;
    activated: boolean;
    alreadyPaid: boolean;
  }>(`/subscriptions/payments/${id}/check`);
  return data;
}

export async function getAdminPricingPlans() {
  const { data } = await api.get<PricingPlan[]>('/subscriptions/admin/plans');
  return data;
}

export async function createAdminPricingPlan(payload: {
  code: string;
  name: string;
  description?: string;
  priceMnt: number;
  discountPercent?: number;
  durationDays: number;
  isActive?: boolean;
  sortOrder?: number;
}) {
  const { data } = await api.post<PricingPlan>('/subscriptions/admin/plans', payload);
  return data;
}

export async function updateAdminPricingPlan(
  id: string,
  payload: Partial<{
    name: string;
    description: string | null;
    priceMnt: number;
    discountPercent: number;
    durationDays: number;
    isActive: boolean;
    sortOrder: number;
  }>,
) {
  const { data } = await api.put<PricingPlan>(`/subscriptions/admin/plans/${id}`, payload);
  return data;
}

export async function deleteAdminPricingPlan(id: string) {
  const { data } = await api.delete<{
    id?: string;
    softDeleted: boolean;
    code?: string;
    name?: string;
  }>(`/subscriptions/admin/plans/${id}`);
  return data;
}

export function formatMnt(amount: number) {
  return `${amount.toLocaleString('mn-MN')}₮`;
}

export function qrImageSrc(qrImage?: string | null) {
  if (!qrImage) return null;
  if (qrImage.startsWith('data:')) return qrImage;
  return `data:image/png;base64,${qrImage}`;
}

/** Prisma Json / API response-аас банкны deeplink жагсаалт гаргана */
export function parseQpayBankUrls(raw: unknown): QpayBankUrl[] {
  if (!raw) return [];
  let value: unknown = raw;
  if (typeof raw === 'string') {
    try {
      value = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(value)) return [];

  const result: QpayBankUrl[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const link = typeof row.link === 'string' ? row.link : '';
    if (!link) continue;
    const name = typeof row.name === 'string' ? row.name : 'Банк';
    result.push({
      name,
      link,
      ...(typeof row.description === 'string' ? { description: row.description } : {}),
      ...(typeof row.logo === 'string' ? { logo: row.logo } : {}),
    });
  }
  return result;
}

/** Утасны банкны апп deeplink нээх (custom scheme + https) */
export function openQpayDeeplink(link: string) {
  if (typeof window === 'undefined') return;
  window.location.href = link;
}
