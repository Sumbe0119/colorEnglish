import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateLessonDto,
  CreateLevelDto,
  CreateModuleDto,
  CreateQuestionDto,
  CreateUnitDto,
  CreateVocabDto,
  UpdateLessonDto,
  UpdateQuestionDto,
  UpdateUnitDto,
} from './admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getCurriculumTree() {
    return this.prisma.level.findMany({
      orderBy: { order: 'asc' },
      include: {
        units: {
          orderBy: { order: 'asc' },
          include: {
            modules: {
              orderBy: { order: 'asc' },
              include: {
                _count: { select: { lessons: true } },
                lessons: {
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    title: true,
                    order: true,
                    isPublished: true,
                    estimatedMins: true,
                    _count: { select: { questions: true, vocabItems: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async createLevel(dto: CreateLevelDto) {
    const conflict = await this.prisma.level.findFirst({
      where: { OR: [{ code: dto.code }, { order: dto.order }] },
    });
    if (conflict) {
      if (conflict.code === dto.code) {
        throw new ConflictException(`${dto.code} level аль хэдийн байна`);
      }
      throw new ConflictException(`${dto.order} дараалал аль хэдийн ашиглагдаж байна`);
    }
    return this.prisma.level.create({
      data: {
        code: dto.code,
        title: dto.title,
        description: dto.description,
        order: dto.order,
        isPublished: dto.isPublished ?? true,
      },
    });
  }

  async createUnit(dto: CreateUnitDto) {
    return this.prisma.unit.create({
      data: {
        levelId: dto.levelId,
        title: dto.title,
        description: dto.description,
        order: dto.order,
        isPublished: dto.isPublished ?? false,
      },
    });
  }

  async updateUnit(id: string, dto: UpdateUnitDto) {
    await this.ensureUnit(id);
    return this.prisma.unit.update({ where: { id }, data: dto });
  }

  async deleteUnit(id: string) {
    await this.ensureUnit(id);
    return this.prisma.unit.delete({ where: { id } });
  }

  async createModule(dto: CreateModuleDto) {
    return this.prisma.lessonModule.create({ data: dto });
  }

  async createLesson(dto: CreateLessonDto) {
    await this.ensureModule(dto.moduleId);
    return this.prisma.lesson.create({
      data: {
        moduleId: dto.moduleId,
        title: dto.title,
        order: dto.order,
        content: (dto.content as Prisma.InputJsonValue) ?? undefined,
        audioUrl: dto.audioUrl,
        videoUrl: dto.videoUrl,
        estimatedMins: dto.estimatedMins ?? 10,
        isPublished: dto.isPublished ?? false,
      },
    });
  }

  async getLesson(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          include: {
            unit: { include: { level: true } },
          },
        },
        questions: { orderBy: { order: 'asc' } },
        vocabItems: true,
      },
    });
    if (!lesson) throw new NotFoundException('Хичээл олдсонгүй');
    return lesson;
  }

  async updateLesson(id: string, dto: UpdateLessonDto) {
    await this.ensureLesson(id);
    const { content, ...rest } = dto;
    return this.prisma.lesson.update({
      where: { id },
      data: {
        ...rest,
        ...(content !== undefined && { content: content as Prisma.InputJsonValue }),
      },
    });
  }

  async deleteLesson(id: string) {
    await this.ensureLesson(id);
    return this.prisma.lesson.delete({ where: { id } });
  }

  async createQuestion(lessonId: string, dto: CreateQuestionDto) {
    await this.ensureLesson(lessonId);
    return this.prisma.question.create({
      data: {
        lessonId,
        type: dto.type,
        order: dto.order,
        prompt: dto.prompt,
        options: (dto.options as Prisma.InputJsonValue) ?? undefined,
        correctAnswer: dto.correctAnswer as Prisma.InputJsonValue,
        explanation: dto.explanation,
        audioUrl: dto.audioUrl,
        hint: dto.hint,
      },
    });
  }

  async updateQuestion(id: string, dto: UpdateQuestionDto) {
    await this.ensureQuestion(id);
    return this.prisma.question.update({
      where: { id },
      data: {
        type: dto.type,
        order: dto.order,
        prompt: dto.prompt,
        explanation: dto.explanation,
        audioUrl: dto.audioUrl,
        hint: dto.hint,
        ...(dto.correctAnswer !== undefined && {
          correctAnswer: dto.correctAnswer as Prisma.InputJsonValue,
        }),
        ...(dto.options !== undefined && { options: dto.options as Prisma.InputJsonValue }),
      },
    });
  }

  async deleteQuestion(id: string) {
    await this.ensureQuestion(id);
    return this.prisma.question.delete({ where: { id } });
  }

  async createVocab(lessonId: string, dto: CreateVocabDto) {
    await this.ensureLesson(lessonId);
    return this.prisma.vocabularyItem.create({
      data: { lessonId, ...dto },
    });
  }

  async deleteVocab(id: string) {
    return this.prisma.vocabularyItem.delete({ where: { id } });
  }

  private async ensureUnit(id: string) {
    const u = await this.prisma.unit.findUnique({ where: { id } });
    if (!u) throw new NotFoundException('Unit олдсонгүй');
  }

  private async ensureModule(id: string) {
    const m = await this.prisma.lessonModule.findUnique({ where: { id } });
    if (!m) throw new NotFoundException('Модуль олдсонгүй');
  }

  private async ensureLesson(id: string) {
    const l = await this.prisma.lesson.findUnique({ where: { id } });
    if (!l) throw new NotFoundException('Хичээл олдсонгүй');
  }

  private async ensureQuestion(id: string) {
    const q = await this.prisma.question.findUnique({ where: { id } });
    if (!q) throw new NotFoundException('Асуулт олдсонгүй');
  }

  /** Админ: хэрэглэгчид + багц / үлдсэн хоног */
  async listUsersWithBilling() {
    const [users, pricingPlans] = await Promise.all([
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true,
          subscription: {
            select: {
              plan: true,
              status: true,
              startedAt: true,
              expiresAt: true,
              autoRenew: true,
            },
          },
          payments: {
            where: { status: 'PAID' },
            orderBy: { paidAt: 'desc' },
            take: 1,
            select: {
              id: true,
              amountMnt: true,
              paidAt: true,
              durationDays: true,
              plan: { select: { name: true, code: true } },
            },
          },
        },
      }),
      this.prisma.pricingPlan.findMany({
        select: { code: true, name: true },
      }),
    ]);

    const planNameByCode = Object.fromEntries(pricingPlans.map((p) => [p.code, p.name]));
    const now = Date.now();

    return users.map((u) => {
      const sub = u.subscription;
      const lastPaid = u.payments[0] ?? null;
      const expiresAt = sub?.expiresAt ?? null;
      const expiredByDate = expiresAt ? expiresAt.getTime() < now : false;
      const plan = expiredByDate ? 'FREE' : (sub?.plan ?? 'FREE');
      const status = expiredByDate ? 'EXPIRED' : (sub?.status ?? 'ACTIVE');
      const isPro =
        plan !== 'FREE' &&
        (status === 'ACTIVE' || status === 'TRIAL') &&
        (!expiresAt || expiresAt.getTime() >= now);
      const daysLeft =
        isPro && expiresAt
          ? Math.max(0, Math.ceil((expiresAt.getTime() - now) / (1000 * 60 * 60 * 24)))
          : null;
      const planName =
        lastPaid?.plan?.name ??
        planNameByCode[plan] ??
        (plan === 'FREE' ? 'Үнэгүй' : plan);

      return {
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        displayName:
          [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.email.split('@')[0],
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        plan,
        planName,
        status,
        isPro,
        daysLeft,
        expiresAt,
        startedAt: sub?.startedAt ?? null,
        lastPayment: lastPaid
          ? {
              id: lastPaid.id,
              amountMnt: lastPaid.amountMnt,
              paidAt: lastPaid.paidAt,
              durationDays: lastPaid.durationDays,
              planName: lastPaid.plan.name,
              planCode: lastPaid.plan.code,
            }
          : null,
      };
    });
  }
}
