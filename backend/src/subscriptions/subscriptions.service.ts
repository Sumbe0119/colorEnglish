// backend/src/subscriptions/subscriptions.service.ts
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PaymentStatus,
  PricingPlan,
  Prisma,
  SubscriptionStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
import { QpayService } from './qpay.service';
import {
  AdminConfirmPaymentDto,
  CreatePaymentDto,
  CreatePricingPlanDto,
  UpdatePricingPlanDto,
  CreateDiscountCodeDto,
  UpdateDiscountCodeDto,
  ListAdminPaymentsQueryDto,
  ValidatePromoDto,
} from './dto/billing.dto';

const FREE_PLAN = 'FREE';

/** Payment.activationSource утгууд */
export type ActivationSource = 'QPAY_CALLBACK' | 'USER_CHECK' | 'SWEEP' | 'ADMIN_RECHECK' | 'ADMIN_MANUAL';

/** Pending төлбөрүүдийг QPay-аас дахин шалгах давтамж */
const SWEEP_INTERVAL_MS = 2 * 60 * 1000;
/** Үүссэнээс хойш энэ хугацаанд л QPay-аас дахин шалгана; хуучин нь EXPIRED болно */
const PENDING_TTL_MS = 7 * 24 * 60 * 60 * 1000;
/** Нэг sweep-д хамгийн ихдээ шалгах төлбөрийн тоо (QPay API-г ачаалахгүй) */
const SWEEP_BATCH = 30;

function finalAmount(priceMnt: number, discountPercent: number) {
  const d = Math.min(100, Math.max(0, discountPercent));
  return Math.max(100, Math.round(priceMnt * (1 - d / 100)));
}

function mapPlanPublic(plan: PricingPlan) {
  const amountMnt = finalAmount(plan.priceMnt, plan.discountPercent);
  return {
    id: plan.id,
    code: plan.code,
    name: plan.name,
    description: plan.description,
    priceMnt: plan.priceMnt,
    discountPercent: plan.discountPercent,
    amountMnt,
    durationDays: plan.durationDays,
    isActive: plan.isActive,
    sortOrder: plan.sortOrder,
  };
}

@Injectable()
export class SubscriptionsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SubscriptionsService.name);
  private sweepTimer: NodeJS.Timeout | null = null;
  private sweeping = false;

  constructor(
    private prisma: PrismaService,
    private qpay: QpayService,
    private config: ConfigService,
    private sessions: SessionsService,
  ) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    // Хэрэглэгч QR цонхоо хаасан / callback ирээгүй үед ч төлбөрийг автоматаар идэвхжүүлнэ
    this.sweepTimer = setInterval(() => void this.sweepPendingPayments(), SWEEP_INTERVAL_MS);
    this.sweepTimer.unref?.();
    setTimeout(() => void this.sweepPendingPayments(), 15_000).unref?.();
  }

  onModuleDestroy() {
    if (this.sweepTimer) clearInterval(this.sweepTimer);
    this.sweepTimer = null;
  }

  /**
   * Public backend URL — callback үүсгэхэд хэрэглэнэ.
   * BACKEND_PUBLIC_URL нь "/api"-аар төгссөн ч (жишээ: http://colorenglish.mn/api)
   * "/api/api/..." давхардуулахгүй.
   */
  private publicApiBase() {
    const raw =
      this.config.get<string>('BACKEND_PUBLIC_URL') ||
      `http://localhost:${this.config.get('PORT') ?? 8080}`;
    return raw.trim().replace(/\/+$/, '').replace(/\/api$/i, '');
  }

  private qpayCallbackUrl(paymentId: string) {
    return `${this.publicApiBase()}/api/subscriptions/payments/qpay-callback?payment_id=${paymentId}`;
  }

  /** Ensure VIP not past expiresAt */
  async resolveActiveSubscription(userId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!sub) return null;

    if (
      sub.plan !== FREE_PLAN &&
      sub.status === SubscriptionStatus.ACTIVE &&
      sub.expiresAt &&
      sub.expiresAt.getTime() < Date.now()
    ) {
      const expired = await this.prisma.subscription.update({
        where: { userId },
        data: { status: SubscriptionStatus.EXPIRED, plan: FREE_PLAN },
      });
      // VIP дууссан → FREE лимит рүү буцаж, илүү төхөөрөмжүүдийг хаана
      const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
      if (user) await this.sessions.enforceLimit(user).catch(() => undefined);
      return expired;
    }
    return sub;
  }

  isPro(sub: { plan: string; status: SubscriptionStatus; expiresAt: Date | null } | null) {
    if (!sub) return false;
    if (sub.plan === FREE_PLAN) return false;
    if (sub.status !== SubscriptionStatus.ACTIVE && sub.status !== SubscriptionStatus.TRIAL) {
      return false;
    }
    if (sub.expiresAt && sub.expiresAt.getTime() < Date.now()) return false;
    return true;
  }

  async getMine(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    const staffBypass = user?.role === 'ADMIN' || user?.role === 'EDITOR';

    const sub = await this.resolveActiveSubscription(userId);
    if (!sub) throw new NotFoundException('Subscription олдсонгүй');
    const isPro = staffBypass || this.isPro(sub);
    const daysLeft =
      isPro && !staffBypass && sub.expiresAt
        ? Math.max(0, Math.ceil((sub.expiresAt.getTime() - Date.now()) / 86_400_000))
        : null;

    return {
      ...sub,
      isPro,
      daysLeft,
      staffAccess: staffBypass,
      qpayReady: this.qpay.isConfigured(),
    };
  }

  async listPublicPlans() {
    await this.ensureVipPlans();
    const plans = await this.prisma.pricingPlan.findMany({
      where: {
        isActive: true,
        code: { not: FREE_PLAN },
      },
      orderBy: { sortOrder: 'asc' },
    });
    return plans.map(mapPlanPublic);
  }

  async listAdminPlans() {
    await this.ensureVipPlans();
    const plans = await this.prisma.pricingPlan.findMany({
      where: { code: { not: FREE_PLAN } },
      orderBy: { sortOrder: 'asc' },
    });
    return plans.map(mapPlanPublic);
  }

  /**
   * VIP 1/3/6 багц байхгүй үед л үүсгэнэ.
   * Үнэ/нэр/хугацааг дараа нь зөвхөн admin засварлана — дахин overwrite хийхгүй.
   */
  async ensureVipPlans() {
    const vipDefaults = [
      {
        code: 'VIP_1_MONTH',
        name: 'VIP 1 сар',
        description: 'Бүх өгүүллэг + тоглоом — 30 хоног',
        priceMnt: 19900,
        discountPercent: 0,
        durationDays: 30,
        sortOrder: 1,
      },
      {
        code: 'VIP_3_MONTHS',
        name: 'VIP 3 сар',
        description: 'Бүх өгүүллэг + тоглоом — 90 хоног',
        priceMnt: 49900,
        discountPercent: 0,
        durationDays: 90,
        sortOrder: 2,
      },
      {
        code: 'VIP_6_MONTHS',
        name: 'VIP 6 сар',
        description: 'Бүх өгүүллэг + тоглоом — 180 хоног',
        priceMnt: 89900,
        discountPercent: 0,
        durationDays: 180,
        sortOrder: 3,
      },
    ] as const;

    for (const plan of vipDefaults) {
      const existing = await this.prisma.pricingPlan.findUnique({
        where: { code: plan.code },
      });
      if (!existing) {
        await this.prisma.pricingPlan.create({
          data: { ...plan, isActive: true },
        });
      }
    }

    // Хуучин Pro багцуудыг публик жагсаалтаас хасна (legacy)
    await this.prisma.pricingPlan.updateMany({
      where: {
        code: { in: ['PRO_MONTHLY', 'PRO_YEARLY'] },
        isActive: true,
      },
      data: { isActive: false },
    });
  }

  /** @deprecated — use ensureVipPlans */
  async ensureDefaultPlans() {
    await this.ensureVipPlans();
  }

  async updatePlan(id: string, dto: UpdatePricingPlanDto) {
    const existing = await this.prisma.pricingPlan.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Багц олдсонгүй');
    if (existing.code === FREE_PLAN) {
      throw new BadRequestException('FREE багцыг засах боломжгүй');
    }
    const updated = await this.prisma.pricingPlan.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.priceMnt !== undefined ? { priceMnt: dto.priceMnt } : {}),
        ...(dto.discountPercent !== undefined ? { discountPercent: dto.discountPercent } : {}),
        ...(dto.durationDays !== undefined ? { durationDays: dto.durationDays } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });
    return mapPlanPublic(updated);
  }

  async createPlan(dto: CreatePricingPlanDto) {
    const code = dto.code.trim().toUpperCase();
    if (code === FREE_PLAN) {
      throw new BadRequestException('FREE багц үүсгэх боломжгүй');
    }
    const exists = await this.prisma.pricingPlan.findUnique({ where: { code } });
    if (exists) {
      throw new BadRequestException(`"${code}" код аль хэдийн байна`);
    }
    const maxOrder = await this.prisma.pricingPlan.aggregate({ _max: { sortOrder: true } });
    const created = await this.prisma.pricingPlan.create({
      data: {
        code,
        name: dto.name,
        description: dto.description,
        priceMnt: dto.priceMnt,
        discountPercent: dto.discountPercent ?? 0,
        durationDays: dto.durationDays,
        isActive: dto.isActive ?? true,
        sortOrder: dto.sortOrder ?? (maxOrder._max.sortOrder ?? 0) + 1,
      },
    });
    return mapPlanPublic(created);
  }

  async deletePlan(id: string) {
    const existing = await this.prisma.pricingPlan.findUnique({
      where: { id },
      include: { _count: { select: { payments: true } } },
    });
    if (!existing) throw new NotFoundException('Багц олдсонгүй');
    if (existing.code === FREE_PLAN) {
      throw new BadRequestException('FREE багцыг устгах боломжгүй');
    }

    if (existing._count.payments > 0) {
      // Төлбөрийн түүхтэй бол зөвхөн идэвхгүй болгоно
      const updated = await this.prisma.pricingPlan.update({
        where: { id },
        data: { isActive: false },
      });
      return { ...mapPlanPublic(updated), softDeleted: true as const };
    }

    await this.prisma.pricingPlan.delete({ where: { id } });
    return { id, softDeleted: false as const };
  }

  async createPayment(userId: string, dto: CreatePaymentDto) {
    const plan = await this.prisma.pricingPlan.findUnique({ where: { id: dto.planId } });
    if (!plan || !plan.isActive || plan.code === FREE_PLAN) {
      throw new BadRequestException('Багц олдсонгүй эсвэл идэвхгүй');
    }

    let promoDiscountPercent = 0;
    let promoCodeId: string | null = null;
    let promoCodeValue: string | null = null;

    if (dto.promoCode?.trim()) {
      const promo = await this.resolvePromoCode(dto.promoCode.trim(), userId);
      promoDiscountPercent = promo.discountPercent;
      promoCodeId = promo.id;
      promoCodeValue = promo.code;
    }

    const totalDiscount = Math.min(100, plan.discountPercent + promoDiscountPercent);
    const amountMnt = finalAmount(plan.priceMnt, totalDiscount);
    const phone = dto.phone.trim();
    const senderInvoiceNo = `CE-${Date.now()}-${userId.slice(-6)}`;
    // Гүйлгээний утга: "COLORENGLISH <утас>" — админ банкны хуулгаас утсаар таньж тулгана
    const invoiceDescription = `COLORENGLISH ${phone}`;

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        planId: plan.id,
        planCode: plan.code,
        amountMnt,
        listPriceMnt: plan.priceMnt,
        discountPercent: plan.discountPercent,
        promoDiscountPercent,
        promoCodeId,
        promoCodeValue,
        durationDays: plan.durationDays,
        status: PaymentStatus.PENDING,
        senderInvoiceNo,
        payerPhone: phone,
      },
    });

    // Дараагийн төлбөрт автоматаар бөглөх + админ хайлтад
    await this.prisma.user
      .update({ where: { id: userId }, data: { phone } })
      .catch(() => undefined);

    try {
      const invoice = await this.qpay.createInvoice({
        senderInvoiceNo,
        amount: amountMnt,
        description: invoiceDescription,
        callbackUrl: this.qpayCallbackUrl(payment.id),
      });

      return this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          qpayInvoiceId: invoice.invoice_id,
          qrImage: invoice.qr_image ?? null,
          qrText: invoice.qr_text ?? null,
          shortUrl: invoice.qPay_shortUrl ?? null,
          urlsJson: invoice.urls ?? undefined,
        },
        include: { plan: true },
      });
    } catch (err) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });
      throw err;
    }
  }

  /** Промо код шалгах — UI preview */
  async validatePromo(userId: string, dto: ValidatePromoDto) {
    const promo = await this.resolvePromoCode(dto.code.trim(), userId);
    let planPreview: {
      planId: string;
      planName: string;
      listPriceMnt: number;
      planDiscountPercent: number;
      amountMnt: number;
      totalDiscountPercent: number;
    } | null = null;

    if (dto.planId) {
      const plan = await this.prisma.pricingPlan.findUnique({ where: { id: dto.planId } });
      if (plan && plan.isActive && plan.code !== FREE_PLAN) {
        const totalDiscount = Math.min(100, plan.discountPercent + promo.discountPercent);
        planPreview = {
          planId: plan.id,
          planName: plan.name,
          listPriceMnt: plan.priceMnt,
          planDiscountPercent: plan.discountPercent,
          amountMnt: finalAmount(plan.priceMnt, totalDiscount),
          totalDiscountPercent: totalDiscount,
        };
      }
    }

    return {
      valid: true,
      code: promo.code,
      discountPercent: promo.discountPercent,
      expiresAt: promo.expiresAt,
      planPreview,
    };
  }

  private async resolvePromoCode(rawCode: string, userId: string) {
    const code = rawCode.toUpperCase();
    const promo = await this.prisma.discountCode.findUnique({ where: { code } });
    if (!promo || !promo.isActive) {
      throw new BadRequestException('Хөнгөлөлтийн код буруу эсвэл идэвхгүй');
    }
    const now = Date.now();
    if (promo.startsAt.getTime() > now) {
      throw new BadRequestException('Энэ код хараахан хүчинтэй болоогүй байна');
    }
    if (promo.expiresAt && promo.expiresAt.getTime() < now) {
      throw new BadRequestException('Хөнгөлөлтийн кодын хугацаа дууссан');
    }

    const usedStatuses: PaymentStatus[] = [PaymentStatus.PAID, PaymentStatus.PENDING];
    const totalUses = await this.prisma.payment.count({
      where: {
        promoCodeId: promo.id,
        status: { in: usedStatuses },
      },
    });
    if (promo.maxUses != null && totalUses >= promo.maxUses) {
      throw new BadRequestException('Хөнгөлөлтийн кодын хязгаар дүүрсэн');
    }

    if (promo.onePerUser) {
      const userPaid = await this.prisma.payment.count({
        where: {
          promoCodeId: promo.id,
          userId,
          status: PaymentStatus.PAID,
        },
      });
      if (userPaid > 0) {
        throw new BadRequestException('Та энэ кодыг аль хэдийн ашигласан байна');
      }
    }

    return promo;
  }

  async listDiscountCodes() {
    const codes = await this.prisma.discountCode.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        payments: {
          where: { status: { in: [PaymentStatus.PAID, PaymentStatus.PENDING] } },
          select: {
            id: true,
            status: true,
            amountMnt: true,
            userId: true,
            paidAt: true,
            createdAt: true,
            user: { select: { email: true, firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return codes.map((c) => {
      const paid = c.payments.filter((p) => p.status === PaymentStatus.PAID);
      const pending = c.payments.filter((p) => p.status === PaymentStatus.PENDING);
      const uniqueUsers = new Set(paid.map((p) => p.userId)).size;
      return {
        id: c.id,
        code: c.code,
        discountPercent: c.discountPercent,
        startsAt: c.startsAt,
        expiresAt: c.expiresAt,
        maxUses: c.maxUses,
        onePerUser: c.onePerUser,
        isActive: c.isActive,
        note: c.note,
        createdAt: c.createdAt,
        stats: {
          paidCount: paid.length,
          pendingCount: pending.length,
          uniqueUsers,
          totalRevenueMnt: paid.reduce((s, p) => s + p.amountMnt, 0),
        },
        recentUsers: paid.slice(0, 20).map((p) => ({
          paymentId: p.id,
          userId: p.userId,
          email: p.user.email,
          displayName:
            [p.user.firstName, p.user.lastName].filter(Boolean).join(' ').trim() ||
            p.user.email.split('@')[0],
          amountMnt: p.amountMnt,
          paidAt: p.paidAt,
        })),
      };
    });
  }

  private parseDayStart(value: string | null | undefined): Date | null {
    if (!value) return null;
    // YYYY-MM-DD → тухайн өдрийн 00:00:00 (UTC биш, огнооны өдөр)
    const dayOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
    if (dayOnly) {
      const y = Number(dayOnly[1]);
      const m = Number(dayOnly[2]);
      const d = Number(dayOnly[3]);
      return new Date(y, m - 1, d, 0, 0, 0, 0);
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  }

  async createDiscountCode(dto: CreateDiscountCodeDto) {
    const code = dto.code.trim().toUpperCase();
    const existing = await this.prisma.discountCode.findUnique({ where: { code } });
    if (existing) throw new BadRequestException('Энэ код аль хэдийн байна');

    return this.prisma.discountCode.create({
      data: {
        code,
        discountPercent: dto.discountPercent,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : new Date(),
        expiresAt: this.parseDayStart(dto.expiresAt ?? null),
        maxUses: dto.maxUses ?? null,
        onePerUser: dto.onePerUser ?? true,
        isActive: dto.isActive ?? true,
        note: dto.note ?? null,
      },
    });
  }

  async updateDiscountCode(id: string, dto: UpdateDiscountCodeDto) {
    const existing = await this.prisma.discountCode.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Код олдсонгүй');

    return this.prisma.discountCode.update({
      where: { id },
      data: {
        ...(dto.discountPercent != null ? { discountPercent: dto.discountPercent } : {}),
        ...(dto.startsAt != null ? { startsAt: new Date(dto.startsAt) } : {}),
        ...(dto.expiresAt !== undefined
          ? { expiresAt: this.parseDayStart(dto.expiresAt) }
          : {}),
        ...(dto.maxUses !== undefined ? { maxUses: dto.maxUses } : {}),
        ...(dto.onePerUser != null ? { onePerUser: dto.onePerUser } : {}),
        ...(dto.isActive != null ? { isActive: dto.isActive } : {}),
        ...(dto.note !== undefined ? { note: dto.note } : {}),
      },
    });
  }

  async deleteDiscountCode(id: string) {
    const existing = await this.prisma.discountCode.findUnique({
      where: { id },
      include: { _count: { select: { payments: true } } },
    });
    if (!existing) throw new NotFoundException('Код олдсонгүй');

    if (existing._count.payments > 0) {
      return this.prisma.discountCode.update({
        where: { id },
        data: { isActive: false },
      });
    }

    await this.prisma.discountCode.delete({ where: { id } });
    return { id, deleted: true };
  }

  async listMyPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        plan: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async getPayment(userId: string, paymentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, userId },
      include: { plan: true },
    });
    if (!payment) throw new NotFoundException('Төлбөр олдсонгүй');
    return payment;
  }

  /**
   * QPay-аас төлбөрийн төлөвийг шалгаж, төлөгдсөн бол VIP идэвхжүүлнэ.
   * PENDING-ээс гадна EXPIRED/FAILED/CANCELED төлбөрийг ч шалгана — хэрэглэгч хожуу төлсөн,
   * эсвэл sweeper EXPIRED болгосны дараа админ дахин шалгах тохиолдолд.
   */
  async checkAndActivate(paymentId: string, userId?: string, source: ActivationSource = 'USER_CHECK') {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { plan: true },
    });
    if (!payment) throw new NotFoundException('Төлбөр олдсонгүй');
    if (userId && payment.userId !== userId) {
      throw new NotFoundException('Төлбөр олдсонгүй');
    }

    if (payment.status === PaymentStatus.PAID) {
      return { payment, activated: false, alreadyPaid: true };
    }

    if (!payment.qpayInvoiceId) {
      throw new BadRequestException('QPay invoice үүсээгүй');
    }

    const check = await this.qpay.checkInvoice(payment.qpayInvoiceId);
    const paidRows = (check.rows ?? []).filter(
      (r) => String(r.payment_status || '').toUpperCase() === 'PAID',
    );
    const paid = paidRows.length > 0 || (check.count ?? 0) > 0;

    if (!paid) {
      const touched = await this.prisma.payment.update({
        where: { id: payment.id },
        data: { qpayCheckedAt: new Date() },
        include: { plan: true },
      });
      return { payment: touched, activated: false, alreadyPaid: false };
    }

    const qpayPaymentId = paidRows[0]?.payment_id ?? check.rows?.[0]?.payment_id ?? null;
    const activated = await this.activatePaidPayment(payment.id, qpayPaymentId, source);
    this.logger.log(
      `Payment ${payment.id} (${payment.senderInvoiceNo}) activated via ${source}, qpay=${qpayPaymentId ?? '-'}`,
    );
    return { payment: activated, activated: true, alreadyPaid: false };
  }

  /** QPay callback — paymentId query-оор ирнэ */
  async handleQpayCallback(paymentId?: string, invoiceId?: string) {
    let id = paymentId;
    if (!id && invoiceId) {
      const found = await this.prisma.payment.findFirst({
        where: { qpayInvoiceId: invoiceId },
        select: { id: true },
      });
      id = found?.id;
    }
    if (!id) {
      this.logger.warn('QPay callback without paymentId');
      return { ok: false };
    }
    try {
      await this.checkAndActivate(id, undefined, 'QPAY_CALLBACK');
      return { ok: true };
    } catch (err) {
      this.logger.error(`QPay callback failed for ${id}`, err as Error);
      return { ok: false };
    }
  }

  /**
   * Pending төлбөрүүдийг QPay-аас давтан шалгана (callback ирээгүй / хэрэглэгч цонхоо хаасан үед).
   * 7 хоногоос хуучин PENDING-ийг EXPIRED болгоно (админ дахин шалгаж болно).
   */
  async sweepPendingPayments() {
    if (this.sweeping || !this.qpay.isConfigured()) return;
    this.sweeping = true;
    try {
      const now = Date.now();
      const cutoff = new Date(now - PENDING_TTL_MS);

      const expired = await this.prisma.payment.updateMany({
        where: { status: PaymentStatus.PENDING, createdAt: { lt: cutoff } },
        data: { status: PaymentStatus.EXPIRED },
      });
      if (expired.count > 0) {
        this.logger.log(`Pending sweep: ${expired.count} payment(s) expired (older than 7 days)`);
      }

      const pending = await this.prisma.payment.findMany({
        where: {
          status: PaymentStatus.PENDING,
          qpayInvoiceId: { not: null },
          createdAt: { gte: cutoff },
          // Сүүлийн 1 минутад шалгагдсан бол алгасна (хэрэглэгчийн polling давхцахгүй)
          OR: [{ qpayCheckedAt: null }, { qpayCheckedAt: { lt: new Date(now - 60_000) } }],
        },
        orderBy: [{ qpayCheckedAt: { sort: 'asc', nulls: 'first' } }, { createdAt: 'asc' }],
        take: SWEEP_BATCH,
        select: { id: true },
      });

      let activated = 0;
      for (const p of pending) {
        try {
          const res = await this.checkAndActivate(p.id, undefined, 'SWEEP');
          if (res.activated) activated += 1;
        } catch (err) {
          this.logger.warn(`Pending sweep: check failed for ${p.id}: ${(err as Error).message}`);
        }
      }
      if (activated > 0) {
        this.logger.log(`Pending sweep: ${activated}/${pending.length} payment(s) activated`);
      }
    } catch (err) {
      this.logger.error('Pending sweep failed', err as Error);
    } finally {
      this.sweeping = false;
    }
  }

  // ───────────── Админ: төлбөрийн жагсаалт / шалгах / гараар баталгаажуулах ─────────────

  async listAdminPayments(query: ListAdminPaymentsQueryDto = {}) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    const and: Prisma.PaymentWhereInput[] = [];
    const q = query.q?.trim();
    if (q) {
      and.push({
        OR: [
          { payerPhone: { contains: q } },
          { senderInvoiceNo: { contains: q, mode: 'insensitive' } },
          { qpayInvoiceId: { contains: q, mode: 'insensitive' } },
          { qpayPaymentId: { contains: q, mode: 'insensitive' } },
          { promoCodeValue: { contains: q, mode: 'insensitive' } },
          { user: { email: { contains: q, mode: 'insensitive' } } },
          { user: { firstName: { contains: q, mode: 'insensitive' } } },
          { user: { lastName: { contains: q, mode: 'insensitive' } } },
          { user: { phone: { contains: q } } },
        ],
      });
    }
    if (query.status && query.status !== 'all') {
      and.push({ status: query.status as PaymentStatus });
    }
    const where: Prisma.PaymentWhereInput = and.length ? { AND: and } : {};

    const [rows, total, paidAgg, pendingCount, paidToday] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          plan: { select: { id: true, code: true, name: true } },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              subscription: { select: { plan: true, status: true, expiresAt: true } },
            },
          },
        },
      }),
      this.prisma.payment.count({ where }),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.PAID },
        _sum: { amountMnt: true },
        _count: { _all: true },
      }),
      this.prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
      this.prisma.payment.aggregate({
        where: {
          status: PaymentStatus.PAID,
          paidAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        _sum: { amountMnt: true },
        _count: { _all: true },
      }),
    ]);

    const now = Date.now();
    const items = rows.map((p) => {
      const sub = p.user.subscription;
      const userIsPro =
        !!sub &&
        sub.plan !== FREE_PLAN &&
        (sub.status === SubscriptionStatus.ACTIVE || sub.status === SubscriptionStatus.TRIAL) &&
        (!sub.expiresAt || sub.expiresAt.getTime() > now);
      return {
        id: p.id,
        status: p.status,
        amountMnt: p.amountMnt,
        listPriceMnt: p.listPriceMnt,
        discountPercent: p.discountPercent,
        promoDiscountPercent: p.promoDiscountPercent,
        promoCodeValue: p.promoCodeValue,
        durationDays: p.durationDays,
        planCode: p.planCode,
        planName: p.plan?.name ?? p.planCode,
        senderInvoiceNo: p.senderInvoiceNo,
        qpayInvoiceId: p.qpayInvoiceId,
        qpayPaymentId: p.qpayPaymentId,
        payerPhone: p.payerPhone,
        activationSource: p.activationSource,
        adminNote: p.adminNote,
        qpayCheckedAt: p.qpayCheckedAt,
        paidAt: p.paidAt,
        subscriptionEnds: p.subscriptionEnds,
        createdAt: p.createdAt,
        user: {
          id: p.user.id,
          email: p.user.email,
          phone: p.user.phone,
          displayName:
            [p.user.firstName, p.user.lastName].filter(Boolean).join(' ').trim() ||
            p.user.email.split('@')[0],
          isPro: userIsPro,
          subscriptionExpiresAt: sub?.expiresAt ?? null,
        },
        /** Төлсөн хэрнээ VIP биш — анхаарах мөр */
        attention: p.status === PaymentStatus.PAID && !userIsPro,
      };
    });

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      stats: {
        paidCount: paidAgg._count._all,
        paidRevenueMnt: paidAgg._sum.amountMnt ?? 0,
        pendingCount,
        todayCount: paidToday._count._all,
        todayRevenueMnt: paidToday._sum.amountMnt ?? 0,
      },
    };
  }

  /** Админ: QPay-аас дахин шалгаж идэвхжүүлэх */
  async adminRecheckPayment(paymentId: string) {
    return this.checkAndActivate(paymentId, undefined, 'ADMIN_RECHECK');
  }

  /** Админ: банкны хуулгаар баталгаажсан төлбөрийг гараар PAID болгож VIP нээх */
  async adminConfirmPayment(paymentId: string, dto: AdminConfirmPaymentDto = {}) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Төлбөр олдсонгүй');
    if (payment.status === PaymentStatus.PAID) {
      return { payment, activated: false, alreadyPaid: true };
    }
    const activated = await this.activatePaidPayment(
      payment.id,
      payment.qpayPaymentId,
      'ADMIN_MANUAL',
      dto.note?.trim() || null,
    );
    this.logger.log(`Payment ${payment.id} (${payment.senderInvoiceNo}) manually confirmed by admin`);
    return { payment: activated, activated: true, alreadyPaid: false };
  }

  private async activatePaidPayment(
    paymentId: string,
    qpayPaymentId: string | null,
    source: ActivationSource,
    adminNote: string | null = null,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { id: paymentId } });
      if (!payment) throw new NotFoundException('Төлбөр олдсонгүй');
      if (payment.status === PaymentStatus.PAID) return payment;

      const now = new Date();
      const current = await tx.subscription.findUnique({ where: { userId: payment.userId } });
      const base =
        current &&
        this.isPro(current) &&
        current.expiresAt &&
        current.expiresAt.getTime() > now.getTime()
          ? current.expiresAt
          : now;

      const ends = new Date(base);
      ends.setDate(ends.getDate() + payment.durationDays);

      await tx.subscription.upsert({
        where: { userId: payment.userId },
        create: {
          userId: payment.userId,
          plan: payment.planCode,
          status: SubscriptionStatus.ACTIVE,
          startedAt: now,
          expiresAt: ends,
          autoRenew: false,
        },
        update: {
          plan: payment.planCode,
          status: SubscriptionStatus.ACTIVE,
          startedAt: now,
          expiresAt: ends,
          autoRenew: false,
        },
      });

      return tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.PAID,
          paidAt: now,
          qpayPaymentId,
          subscriptionEnds: ends,
          activationSource: source,
          qpayCheckedAt: now,
          ...(adminNote ? { adminNote } : {}),
        },
        include: { plan: true },
      });
    });
  }

  /** @deprecated — mock only for local without QPay */
  async upgradeMock(userId: string) {
    if (process.env.NODE_ENV === 'production') {
      throw new BadRequestException('Mock upgrade production дээр унтраасан');
    }
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 30);

    return this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan: 'VIP_1_MONTH',
        status: SubscriptionStatus.ACTIVE,
        startedAt: now,
        expiresAt,
        autoRenew: false,
      },
      update: {
        plan: 'VIP_1_MONTH',
        status: SubscriptionStatus.ACTIVE,
        startedAt: now,
        expiresAt,
        autoRenew: false,
      },
    });
  }
}
