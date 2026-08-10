import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  async getByLesson(lessonId: string, userId: string) {
    const items = await this.prisma.vocabularyItem.findMany({
      where: { lessonId },
      include: {
        progress: { where: { userId }, take: 1 },
      },
    });
    return items.map(({ progress, ...item }) => ({
      ...item,
      userProgress: progress[0] ?? null,
    }));
  }

  async getReviewQueue(userId: string) {
    return this.prisma.vocabularyProgress.findMany({
      where: {
        userId,
        OR: [{ nextReviewAt: { lte: new Date() } }, { nextReviewAt: null }],
      },
      include: { vocabItem: true },
      orderBy: { nextReviewAt: 'asc' },
      take: 20,
    });
  }

  async reviewWord(userId: string, vocabId: string, correct: boolean) {
    const item = await this.prisma.vocabularyItem.findUnique({ where: { id: vocabId } });
    if (!item) throw new NotFoundException('Үг олдсонгүй');

    const existing = await this.prisma.vocabularyProgress.findUnique({
      where: { userId_vocabId: { userId, vocabId } },
    });

    const masteryLevel = Math.min(5, Math.max(0, (existing?.masteryLevel ?? 0) + (correct ? 1 : -1)));
    const daysUntilReview = [1, 2, 4, 7, 14, 30][masteryLevel] ?? 1;
    const nextReviewAt = new Date(Date.now() + daysUntilReview * 24 * 60 * 60 * 1000);

    return this.prisma.vocabularyProgress.upsert({
      where: { userId_vocabId: { userId, vocabId } },
      update: { masteryLevel, nextReviewAt, lastReviewedAt: new Date() },
      create: { userId, vocabId, masteryLevel, nextReviewAt, lastReviewedAt: new Date() },
    });
  }

  async getAllProgress(userId: string) {
    return this.prisma.vocabularyProgress.findMany({
      where: { userId },
      include: { vocabItem: true },
      orderBy: { masteryLevel: 'desc' },
    });
  }
}
