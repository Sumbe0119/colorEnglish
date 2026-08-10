import { Injectable, NotFoundException } from '@nestjs/common';
import { LevelCode, ModuleType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurriculumService {
  constructor(private prisma: PrismaService) {}

  async getLevels() {
    return this.prisma.level.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      include: { _count: { select: { units: true } } },
    });
  }

  async getLevelByCode(code: LevelCode) {
    const level = await this.prisma.level.findUnique({
      where: { code },
      include: {
        units: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          include: {
            modules: {
              where: { isPublished: true },
              orderBy: { order: 'asc' },
              include: { _count: { select: { lessons: true } } },
            },
            exam: { select: { id: true, title: true, passScore: true, timeLimitMin: true } },
          },
        },
      },
    });
    if (!level) throw new NotFoundException('Түвшин олдсонгүй');
    return level;
  }

  async getUnit(unitId: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id: unitId },
      include: {
        level: { select: { id: true, code: true, title: true } },
        modules: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          include: { _count: { select: { lessons: true } } },
        },
        exam: { select: { id: true, title: true, passScore: true, timeLimitMin: true } },
      },
    });
    if (!unit) throw new NotFoundException('Unit олдсонгүй');
    return unit;
  }

  async getModule(moduleId: string) {
    const mod = await this.prisma.lessonModule.findUnique({
      where: { id: moduleId },
      include: {
        unit: {
          select: {
            id: true,
            title: true,
            level: { select: { id: true, code: true, title: true } },
          },
        },
        lessons: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
            estimatedMins: true,
            audioUrl: true,
            videoUrl: true,
          },
        },
      },
    });
    if (!mod) throw new NotFoundException('Модуль олдсонгүй');
    return mod;
  }

  async getModulesByType(type: ModuleType, levelCode?: LevelCode) {
    return this.prisma.lessonModule.findMany({
      where: {
        type,
        isPublished: true,
        ...(levelCode && { unit: { level: { code: levelCode } } }),
      },
      orderBy: [{ unit: { level: { order: 'asc' } } }, { order: 'asc' }],
      include: {
        unit: {
          select: {
            id: true,
            title: true,
            level: { select: { code: true, title: true } },
          },
        },
        _count: { select: { lessons: true } },
      },
    });
  }

  async getLesson(lessonId: string, userId?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          select: {
            id: true,
            type: true,
            title: true,
            unit: { select: { id: true, title: true, level: { select: { code: true } } } },
          },
        },
        questions: { orderBy: { order: 'asc' } },
        vocabItems: true,
        progress: userId ? { where: { userId }, take: 1 } : false,
      },
    });
    if (!lesson) throw new NotFoundException('Хичээл олдсонгүй');

    const { questions, ...rest } = lesson;
    return {
      ...rest,
      questions: questions.map(({ correctAnswer: _ca, ...q }) => q),
      userProgress: lesson.progress?.[0] ?? null,
    };
  }
}
