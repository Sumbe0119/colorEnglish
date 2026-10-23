// backend/src/placement-test/placement-test.service.ts
// Түвшин тогтоох тест: нэвтрэхгүй өгнө → хариулт серверт дүгнэгдэж хадгалагдана →
// үр дүнг QPay төлбөр (анхдагч 5000₮) төлсний дараа л нээж харуулна.
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PaymentStatus, PlacementTest, Prisma } from '@prisma/client';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { QpayService } from '../subscriptions/qpay.service';
import {
  buildReview,
  PLACEMENT_BANK_VERSION,
  PLACEMENT_LEVELS,
  PLACEMENT_QUESTIONS,
  PlacementBandResult,
  PlacementLevelKey,
  PlacementSkillResult,
  publicQuestions,
  scorePlacement,
} from './placement-test.bank';
import {
  AdminConfirmPlacementDto,
  ListAdminPlacementQueryDto,
  PayPlacementDto,
  SubmitPlacementDto,
} from './placement-test.dto';

/** Үр дүн нээх үнэ — env PLACEMENT_TEST_PRICE_MNT-ээр өөрчилж болно */
const DEFAULT_PRICE_MNT = 5000;
const ESTIMATED_MINUTES = 15;

/** Pending төлбөрүүдийг QPay-аас дахин шалгах давтамж */
const SWEEP_INTERVAL_MS = 2 * 60 * 1000;
/** Оролдлого үүссэнээс хойш энэ хугацаанд л QPay-аас шалгана; хуучин invoice EXPIRED болно (зочин дахин invoice авч болно) */
const PENDING_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SWEEP_BATCH = 20;

export type PlacementActivationSource =
  | 'QPAY_CALLBACK'
  | 'USER_CHECK'
  | 'SWEEP'
  | 'ADMIN_RECHECK'
  | 'ADMIN_MANUAL';

type StoredBreakdown = {
  bands?: PlacementBandResult[];
  skills?: PlacementSkillResult[];
  answeredCount?: number;
};

type QpayBankUrl = { name: string; description?: string; logo?: string; link: string };

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function parseBankUrls(raw: Prisma.JsonValue | null): QpayBankUrl[] {
  if (!Array.isArray(raw)) return [];
  const out: QpayBankUrl[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    const row = item as Record<string, unknown>;
    if (typeof row.link !== 'string' || !row.link) continue;
    out.push({
      name: typeof row.name === 'string' ? row.name : 'Банк',
      link: row.link,
      ...(typeof row.description === 'string' ? { description: row.description } : {}),
      ...(typeof row.logo === 'string' ? { logo: row.logo } : {}),
    });
  }
  return out;
}

@Injectable()
export class PlacementTestService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PlacementTestService.name);
  private sweepTimer: NodeJS.Timeout | null = null;
  private sweeping = false;
  private readonly knownQuestionIds = new Set(PLACEMENT_QUESTIONS.map((q) => q.id));

  constructor(
    private prisma: PrismaService,
    private qpay: QpayService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    this.sweepTimer = setInterval(() => void this.sweepPending(), SWEEP_INTERVAL_MS);
    this.sweepTimer.unref?.();
    setTimeout(() => void this.sweepPending(), 25_000).unref?.();
  }

  onModuleDestroy() {
    if (this.sweepTimer) clearInterval(this.sweepTimer);
    this.sweepTimer = null;
  }

  // ───────────── Тохиргоо / асуултууд ─────────────

  get priceMnt(): number {
    const raw = Number(this.config.get<string>('PLACEMENT_TEST_PRICE_MNT'));
    return Number.isFinite(raw) && raw >= 100 ? Math.round(raw) : DEFAULT_PRICE_MNT;
  }

  getConfig() {
    return {
      version: PLACEMENT_BANK_VERSION,
      priceMnt: this.priceMnt,
      questionCount: PLACEMENT_QUESTIONS.length,
      estimatedMinutes: ESTIMATED_MINUTES,
      qpayReady: this.qpay.isConfigured(),
    };
  }

  getQuestions() {
    return { ...this.getConfig(), questions: publicQuestions() };
  }

  /** Нэвтэрсэн байвал userId (заавал биш) — буруу/хуучирсан токен бол зочин гэж үзнэ */
  async resolveOptionalUserId(authHeader?: string): Promise<string | null> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7).trim();
    if (!token) return null;
    try {
      const payload = this.jwt.verify<{ sub?: string }>(token, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      });
      if (!payload?.sub) return null;
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true },
      });
      return user?.id ?? null;
    } catch {
      return null;
    }
  }

  // ───────────── Зочны урсгал ─────────────

  /** Хариултыг дүгнэж хадгална; үр дүнг буцаахгүй (төлбөрөөр нээгдэнэ), зөвхөн нууц түлхүүр өгнө */
  async submit(dto: SubmitPlacementDto, userId: string | null) {
    const answers: Record<string, number> = {};
    for (const a of dto.answers) {
      if (this.knownQuestionIds.has(a.questionId)) answers[a.questionId] = a.choice;
    }
    const score = scorePlacement(answers);
    if (score.answeredCount === 0) {
      throw new BadRequestException('Хүчинтэй хариулт олдсонгүй');
    }

    const token = randomBytes(24).toString('base64url');
    const created = await this.prisma.placementTest.create({
      data: {
        tokenHash: hashToken(token),
        userId,
        bankVersion: PLACEMENT_BANK_VERSION,
        answers,
        totalQuestions: score.totalQuestions,
        correctCount: score.correctCount,
        scorePercent: score.scorePercent,
        level: score.level,
        levelKey: score.levelKey,
        breakdown: {
          bands: score.bands,
          skills: score.skills,
          answeredCount: score.answeredCount,
        } as unknown as Prisma.InputJsonValue,
        durationSec: dto.durationSec ?? null,
        amountMnt: this.priceMnt,
      },
    });

    this.logger.log(
      `Placement attempt ${created.id} submitted (${score.correctCount}/${score.totalQuestions}, ${score.levelKey})${userId ? ` by ${userId}` : ''}`,
    );
    return { ...this.toView(created), token };
  }

  /** Эзэмшлийг нууц түлхүүрээр нотолно — олдохгүй/буруу бол ялгалгүй 404 (ID таах оролдлогоос сэргийлнэ) */
  private async loadOwned(id: string, token: string | undefined) {
    if (!token || token.length < 16 || token.length > 128) {
      throw new NotFoundException('Тест олдсонгүй');
    }
    const row = await this.prisma.placementTest.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Тест олдсонгүй');
    const expected = Buffer.from(row.tokenHash, 'hex');
    const actual = Buffer.from(hashToken(token), 'hex');
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      throw new NotFoundException('Тест олдсонгүй');
    }
    return row;
  }

  async getForOwner(id: string, token: string | undefined) {
    const row = await this.loadOwned(id, token);
    return this.toView(row);
  }

  /** QPay invoice үүсгэнэ (идэвхтэй invoice байвал дахин үүсгэхгүй, утсыг л шинэчилнэ) */
  async pay(id: string, token: string | undefined, dto: PayPlacementDto) {
    let row = await this.loadOwned(id, token);
    if (row.paymentStatus === PaymentStatus.PAID) return this.toView(row);

    const phone = dto.phone.trim();

    if (row.qpayInvoiceId && row.paymentStatus === PaymentStatus.PENDING) {
      if (row.payerPhone !== phone) {
        row = await this.prisma.placementTest.update({
          where: { id: row.id },
          data: { payerPhone: phone },
        });
      }
      return this.toView(row);
    }

    const senderInvoiceNo = `CET-${Date.now()}-${row.id.slice(-6)}`;
    // Гүйлгээний утга — админ банкны хуулгаас утсаар таньж тулгана
    const invoice = await this.qpay.createInvoice({
      senderInvoiceNo,
      amount: row.amountMnt,
      description: `COLORENGLISH TEST ${phone}`,
      callbackUrl: this.qpayCallbackUrl(row.id),
    });

    const updated = await this.prisma.placementTest.update({
      where: { id: row.id },
      data: {
        paymentStatus: PaymentStatus.PENDING,
        senderInvoiceNo,
        payerPhone: phone,
        qpayInvoiceId: invoice.invoice_id,
        qpayPaymentId: null,
        qrImage: invoice.qr_image ?? null,
        qrText: invoice.qr_text ?? null,
        shortUrl: invoice.qPay_shortUrl ?? null,
        urlsJson: invoice.urls ?? undefined,
        qpayCheckedAt: null,
      },
    });
    this.logger.log(`Placement attempt ${row.id}: QPay invoice ${invoice.invoice_id} created (${row.amountMnt}₮)`);
    return this.toView(updated);
  }

  /** Зочин "Төлбөр шалгах" дарахад / polling */
  async check(id: string, token: string | undefined) {
    const row = await this.loadOwned(id, token);
    const res = await this.checkAndUnlock(row.id, 'USER_CHECK');
    return { ...this.toView(res.row), activated: res.activated, alreadyPaid: res.alreadyPaid };
  }

  /** QPay-аас төлөвийг шалгаж, төлөгдсөн бол үр дүнг нээнэ */
  async checkAndUnlock(
    id: string,
    source: PlacementActivationSource,
  ): Promise<{ row: PlacementTest; activated: boolean; alreadyPaid: boolean }> {
    const row = await this.prisma.placementTest.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Тест олдсонгүй');
    if (row.paymentStatus === PaymentStatus.PAID) {
      return { row, activated: false, alreadyPaid: true };
    }
    if (!row.qpayInvoiceId) {
      throw new BadRequestException('QPay invoice үүсээгүй байна');
    }

    const check = await this.qpay.checkInvoice(row.qpayInvoiceId);
    const paidRows = (check.rows ?? []).filter(
      (r) => String(r.payment_status || '').toUpperCase() === 'PAID',
    );
    const paid = paidRows.length > 0 || (check.count ?? 0) > 0;

    if (!paid) {
      const touched = await this.prisma.placementTest.update({
        where: { id: row.id },
        data: { qpayCheckedAt: new Date() },
      });
      return { row: touched, activated: false, alreadyPaid: false };
    }

    const qpayPaymentId = paidRows[0]?.payment_id ?? check.rows?.[0]?.payment_id ?? null;
    const unlocked = await this.markPaid(row.id, qpayPaymentId, source);
    this.logger.log(
      `Placement attempt ${row.id} (${row.senderInvoiceNo}) unlocked via ${source}, qpay=${qpayPaymentId ?? '-'}`,
    );
    return { row: unlocked, activated: true, alreadyPaid: false };
  }

  /** QPay callback — attempt_id query-оор ирнэ (invoice_id-гаар ч олно) */
  async handleQpayCallback(attemptId?: string, invoiceId?: string) {
    let id = attemptId;
    if (!id && invoiceId) {
      const found = await this.prisma.placementTest.findFirst({
        where: { qpayInvoiceId: invoiceId },
        select: { id: true },
      });
      id = found?.id;
    }
    if (!id) {
      this.logger.warn('Placement QPay callback without attempt id');
      return { ok: false };
    }
    try {
      await this.checkAndUnlock(id, 'QPAY_CALLBACK');
      return { ok: true };
    } catch (err) {
      this.logger.error(`Placement QPay callback failed for ${id}`, err as Error);
      return { ok: false };
    }
  }

  /** Callback ирээгүй / зочин цонхоо хаасан үед ч төлбөрийг автоматаар нээнэ */
  async sweepPending() {
    if (this.sweeping || !this.qpay.isConfigured()) return;
    this.sweeping = true;
    try {
      const now = Date.now();
      const cutoff = new Date(now - PENDING_TTL_MS);

      // createdAt-д тулгуурлана (updatedAt шалгалт бүрт шинэчлэгддэг тул хэзээ ч хуучрахгүй байх байсан)
      const expired = await this.prisma.placementTest.updateMany({
        where: {
          paymentStatus: PaymentStatus.PENDING,
          qpayInvoiceId: { not: null },
          createdAt: { lt: cutoff },
        },
        data: { paymentStatus: PaymentStatus.EXPIRED },
      });
      if (expired.count > 0) {
        this.logger.log(`Placement sweep: ${expired.count} invoice(s) expired (older than 7 days)`);
      }

      const pending = await this.prisma.placementTest.findMany({
        where: {
          paymentStatus: PaymentStatus.PENDING,
          qpayInvoiceId: { not: null },
          OR: [{ qpayCheckedAt: null }, { qpayCheckedAt: { lt: new Date(now - 60_000) } }],
        },
        orderBy: [{ qpayCheckedAt: { sort: 'asc', nulls: 'first' } }, { createdAt: 'asc' }],
        take: SWEEP_BATCH,
        select: { id: true },
      });

      let unlocked = 0;
      for (const p of pending) {
        try {
          const res = await this.checkAndUnlock(p.id, 'SWEEP');
          if (res.activated) unlocked += 1;
        } catch (err) {
          this.logger.warn(`Placement sweep: check failed for ${p.id}: ${(err as Error).message}`);
        }
      }
      if (unlocked > 0) {
        this.logger.log(`Placement sweep: ${unlocked}/${pending.length} attempt(s) unlocked`);
      }
    } catch (err) {
      this.logger.error('Placement sweep failed', err as Error);
    } finally {
      this.sweeping = false;
    }
  }

  // ───────────── Админ ─────────────

  async adminList(query: ListAdminPlacementQueryDto = {}) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    const and: Prisma.PlacementTestWhereInput[] = [];
    const q = query.q?.trim();
    if (q) {
      and.push({
        OR: [
          { payerPhone: { contains: q } },
          { senderInvoiceNo: { contains: q, mode: 'insensitive' } },
          { qpayInvoiceId: { contains: q, mode: 'insensitive' } },
          { qpayPaymentId: { contains: q, mode: 'insensitive' } },
          { user: { email: { contains: q, mode: 'insensitive' } } },
          { user: { phone: { contains: q } } },
        ],
      });
    }
    switch (query.status) {
      case undefined:
      case 'all':
        break;
      case 'PENDING':
        and.push({ paymentStatus: PaymentStatus.PENDING, qpayInvoiceId: { not: null } });
        break;
      case 'UNPAID':
        and.push({ paymentStatus: PaymentStatus.PENDING, qpayInvoiceId: null });
        break;
      default:
        and.push({ paymentStatus: query.status as PaymentStatus });
    }
    const where: Prisma.PlacementTestWhereInput = and.length ? { AND: and } : {};

    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const [rows, total, totalAttempts, paidAgg, pendingCount, paidToday] = await Promise.all([
      this.prisma.placementTest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } },
        },
      }),
      this.prisma.placementTest.count({ where }),
      this.prisma.placementTest.count(),
      this.prisma.placementTest.aggregate({
        where: { paymentStatus: PaymentStatus.PAID },
        _sum: { amountMnt: true },
        _count: { _all: true },
      }),
      this.prisma.placementTest.count({
        where: { paymentStatus: PaymentStatus.PENDING, qpayInvoiceId: { not: null } },
      }),
      this.prisma.placementTest.aggregate({
        where: { paymentStatus: PaymentStatus.PAID, paidAt: { gte: todayStart } },
        _sum: { amountMnt: true },
        _count: { _all: true },
      }),
    ]);

    const items = rows.map((r) => {
      const info = PLACEMENT_LEVELS[r.levelKey as PlacementLevelKey] ?? PLACEMENT_LEVELS.A1;
      const status =
        r.paymentStatus === PaymentStatus.PENDING && !r.qpayInvoiceId ? 'UNPAID' : r.paymentStatus;
      return {
        id: r.id,
        createdAt: r.createdAt,
        paidAt: r.paidAt,
        payerPhone: r.payerPhone,
        user: r.user
          ? {
              id: r.user.id,
              email: r.user.email,
              phone: r.user.phone,
              displayName:
                [r.user.firstName, r.user.lastName].filter(Boolean).join(' ').trim() ||
                r.user.email.split('@')[0],
            }
          : null,
        level: r.level,
        levelKey: r.levelKey,
        levelShort: info.short,
        levelTitle: info.title,
        scorePercent: r.scorePercent,
        correctCount: r.correctCount,
        totalQuestions: r.totalQuestions,
        durationSec: r.durationSec,
        amountMnt: r.amountMnt,
        status,
        senderInvoiceNo: r.senderInvoiceNo,
        qpayInvoiceId: r.qpayInvoiceId,
        qpayPaymentId: r.qpayPaymentId,
        activationSource: r.activationSource,
        adminNote: r.adminNote,
        qpayCheckedAt: r.qpayCheckedAt,
      };
    });

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      stats: {
        totalAttempts,
        paidCount: paidAgg._count._all,
        paidRevenueMnt: paidAgg._sum.amountMnt ?? 0,
        pendingCount,
        todayCount: paidToday._count._all,
        todayRevenueMnt: paidToday._sum.amountMnt ?? 0,
        priceMnt: this.priceMnt,
      },
    };
  }

  /** Админ: QPay-аас дахин шалгаж нээх */
  async adminRecheck(id: string) {
    const res = await this.checkAndUnlock(id, 'ADMIN_RECHECK');
    return { id: res.row.id, status: res.row.paymentStatus, activated: res.activated, alreadyPaid: res.alreadyPaid };
  }

  /** Админ: банкны хуулгаар баталгаажсан төлбөрийг гараар PAID болгож үр дүн нээх */
  async adminConfirm(id: string, dto: AdminConfirmPlacementDto = {}) {
    const row = await this.prisma.placementTest.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Тест олдсонгүй');
    if (row.paymentStatus === PaymentStatus.PAID) {
      return { id: row.id, status: row.paymentStatus, activated: false, alreadyPaid: true };
    }
    const unlocked = await this.markPaid(row.id, row.qpayPaymentId, 'ADMIN_MANUAL', dto.note?.trim() || null);
    this.logger.log(`Placement attempt ${row.id} manually confirmed by admin`);
    return { id: unlocked.id, status: unlocked.paymentStatus, activated: true, alreadyPaid: false };
  }

  // ───────────── Туслах ─────────────

  private async markPaid(
    id: string,
    qpayPaymentId: string | null,
    source: PlacementActivationSource,
    adminNote: string | null = null,
  ) {
    const now = new Date();
    return this.prisma.placementTest.update({
      where: { id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paidAt: now,
        qpayPaymentId,
        activationSource: source,
        qpayCheckedAt: now,
        ...(adminNote ? { adminNote } : {}),
      },
    });
  }

  /**
   * Public backend URL — callback үүсгэхэд. BACKEND_PUBLIC_URL "/api"-аар төгссөн ч
   * "/api/api/..." давхардуулахгүй (subscriptions.service-тэй ижил логик).
   */
  private publicApiBase() {
    const raw =
      this.config.get<string>('BACKEND_PUBLIC_URL') ||
      `http://localhost:${this.config.get('PORT') ?? 8080}`;
    return raw.trim().replace(/\/+$/, '').replace(/\/api$/i, '');
  }

  private qpayCallbackUrl(attemptId: string) {
    return `${this.publicApiBase()}/api/placement-test/qpay-callback?attempt_id=${attemptId}`;
  }

  /** Зочинд харуулах хэлбэр — үр дүн зөвхөн PAID үед */
  toView(row: PlacementTest) {
    const unlocked = row.paymentStatus === PaymentStatus.PAID;
    const breakdown = (row.breakdown ?? null) as StoredBreakdown | null;
    return {
      id: row.id,
      status: unlocked ? ('UNLOCKED' as const) : ('LOCKED' as const),
      createdAt: row.createdAt,
      totalQuestions: row.totalQuestions,
      answeredCount: breakdown?.answeredCount ?? null,
      durationSec: row.durationSec,
      priceMnt: row.amountMnt,
      payment: {
        status: row.paymentStatus,
        amountMnt: row.amountMnt,
        hasInvoice: Boolean(row.qpayInvoiceId),
        senderInvoiceNo: row.senderInvoiceNo,
        payerPhone: row.payerPhone,
        paidAt: row.paidAt,
        qrImage: unlocked ? null : row.qrImage,
        qrText: unlocked ? null : row.qrText,
        shortUrl: unlocked ? null : row.shortUrl,
        urls: unlocked ? [] : parseBankUrls(row.urlsJson),
        qpayReady: this.qpay.isConfigured(),
      },
      result: unlocked ? this.buildResult(row) : null,
    };
  }

  private buildResult(row: PlacementTest) {
    const answers = (row.answers ?? {}) as Record<string, number>;
    const info = PLACEMENT_LEVELS[row.levelKey as PlacementLevelKey] ?? PLACEMENT_LEVELS.A1;
    const stored = (row.breakdown ?? null) as StoredBreakdown | null;
    // Хадгалсан задаргаа байхгүй (хуучин мөр) бол дахин тооцно
    const recomputed = stored?.bands && stored?.skills ? null : scorePlacement(answers);
    return {
      level: row.level,
      levelKey: row.levelKey,
      short: info.short,
      title: info.title,
      cefr: info.cefr,
      description: info.description,
      recommendations: info.recommendations,
      startHref: info.startHref,
      startLabel: info.startLabel,
      scorePercent: row.scorePercent,
      correctCount: row.correctCount,
      totalQuestions: row.totalQuestions,
      bands: stored?.bands ?? recomputed!.bands,
      skills: stored?.skills ?? recomputed!.skills,
      // Асуултын сан өөрчлөгдсөн бол хуучин оролдлогын асуулт бүрийн задаргааг харуулахгүй
      review: row.bankVersion === PLACEMENT_BANK_VERSION ? buildReview(answers) : [],
      durationSec: row.durationSec,
      completedAt: row.createdAt,
      paidAt: row.paidAt,
    };
  }
}
