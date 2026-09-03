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
  promoDiscountPercent?: number;
  promoCodeValue?: string | null;
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

export type PromoValidateResult = {
  valid: true;
  code: string;
  discountPercent: number;
  expiresAt: string | null;
  planPreview: {
    planId: string;
    planName: string;
    listPriceMnt: number;
    planDiscountPercent: number;
    amountMnt: number;
    totalDiscountPercent: number;
  } | null;
};

export type DiscountCodeAdmin = {
  id: string;
  code: string;
  discountPercent: number;
  startsAt: string;
  expiresAt: string | null;
  maxUses: number | null;
  onePerUser: boolean;
  isActive: boolean;
  note: string | null;
  createdAt: string;
  stats: {
    paidCount: number;
    pendingCount: number;
    uniqueUsers: number;
    totalRevenueMnt: number;
  };
  recentUsers: {
    paymentId: string;
    userId: string;
    email: string;
    displayName: string;
    amountMnt: number;
    paidAt: string | null;
  }[];
};

export async function getSubscriptionMe() {
  const { data } = await api.get<SubscriptionMe>('/subscriptions/me');
  return data;
}

export async function getPricingPlans() {
  const { data } = await api.get<PricingPlan[]>('/subscriptions/plans');
  return data;
}

export async function createPayment(planId: string, promoCode?: string) {
  const { data } = await api.post<PaymentRecord>('/subscriptions/payments', {
    planId,
    ...(promoCode?.trim() ? { promoCode: promoCode.trim() } : {}),
  });
  return data;
}

export async function validatePromoCode(code: string, planId?: string) {
  const { data } = await api.post<PromoValidateResult>('/subscriptions/promo/validate', {
    code,
    ...(planId ? { planId } : {}),
  });
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

export async function getAdminPromoCodes() {
  const { data } = await api.get<DiscountCodeAdmin[]>('/subscriptions/admin/promo-codes');
  return data;
}

export async function createAdminPromoCode(payload: {
  code: string;
  discountPercent: number;
  startsAt?: string;
  expiresAt?: string | null;
  maxUses?: number | null;
  onePerUser?: boolean;
  isActive?: boolean;
  note?: string | null;
}) {
  const { data } = await api.post('/subscriptions/admin/promo-codes', payload);
  return data;
}

export async function updateAdminPromoCode(
  id: string,
  payload: Partial<{
    discountPercent: number;
    startsAt: string;
    expiresAt: string | null;
    maxUses: number | null;
    onePerUser: boolean;
    isActive: boolean;
    note: string | null;
  }>,
) {
  const { data } = await api.put(`/subscriptions/admin/promo-codes/${id}`, payload);
  return data;
}

export async function deleteAdminPromoCode(id: string) {
  const { data } = await api.delete(`/subscriptions/admin/promo-codes/${id}`);
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
