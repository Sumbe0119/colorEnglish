import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitLessonDto } from './progress.dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const [profile, streak, enrollment, lessonProgress, vocabLearned, subscription] =
      await Promise.all([
        this.prisma.studentProfile.findUnique({ where: { userId } }),
        this.prisma.studyStreak.findUnique({ where: { userId } }),
        this.prisma.enrollment.findFirst({
          where: { userId, completedAt: null },
          include: { level: true },
          orderBy: { startedAt: 'desc' },
        }),
        this.prisma.lessonProgress.findMany({
          where: { userId },
          select: { status: true, score: true, timeSpentSec: true, completedAt: true },
        }),
        this.prisma.vocabularyProgress.count({ where: { userId, masteryLevel: { gt: 0 } } }),
        this.prisma.subscription.findUnique({ where: { userId } }),
      ]);

    const completed = lessonProgress.filter((p) => p.status === 'PASSED').length;
    const totalTimeSec = lessonProgress.reduce((s, p) => s + p.timeSpentSec, 0);
    const avgScore =
      lessonProgress.filter((p) => p.score != null).reduce((s, p) => s + (p.score ?? 0), 0) /
        (lessonProgress.filter((p) => p.score != null).length || 1);

    const currentLevelCode = profile?.currentLevel ?? 'A1';
    const level = await this.prisma.level.findUnique({
      where: { code: currentLevelCode },
      include: {
        units: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          take: 1,
          include: {
            modules: {
              where: { isPublished: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    return {
      profile,
      streak,
      enrollment,
      subscription,
      stats: {
        lessonsCompleted: completed,
        lessonsInProgress: lessonProgress.filter((p) => p.status === 'IN_PROGRESS').length,
        totalStudyMinutes: Math.round(totalTimeSec / 60),
        averageScore: Math.round(avgScore),
        vocabularyLearned: vocabLearned,
      },
      currentLevel: level,
      progressPercent: enrollment?.progressPercent ?? 0,
    };
  }

  async enroll(userId: string, levelId?: string) {
    let targetLevelId = levelId;
    if (!targetLevelId) {
      const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
      const level = await this.prisma.level.findUnique({
        where: { code: profile?.currentLevel ?? 'A1' },
      });
      if (!level) throw new NotFoundException('Түвшин олдсонгүй');
      targetLevelId = level.id;
    }

    return this.prisma.enrollment.upsert({
      where: { userId_levelId: { userId, levelId: targetLevelId } },
      update: {},
      create: { userId, levelId: targetLevelId },
      include: { level: true },
    });
  }

  async getEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: { level: true },
      orderBy: { startedAt: 'desc' },
    });
  }

  async startLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Хичээл олдсонгүй');

    return this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { attemptsCount: { increment: 1 } },
      create: { userId, lessonId, status: 'IN_PROGRESS', attemptsCount: 1 },
    });
  }

  async submitLesson(userId: string, lessonId: string, dto: SubmitLessonDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { questions: true },
    });
    if (!lesson) throw new NotFoundException('Хичээл олдсонгүй');
    if (!dto.answers.length) throw new BadRequestException('Хариулт оруулна уу');

    const questionMap = new Map(lesson.questions.map((q) => [q.id, q]));
    let correctCount = 0;
    const results: Array<{
      questionId: string;
      isCorrect: boolean;
      explanation?: string;
      correctAnswer?: unknown;
    }> = [];

    for (const ans of dto.answers) {
      const question = questionMap.get(ans.questionId);
      if (!question) continue;
      const isCorrect = JSON.stringify(ans.userAnswer) === JSON.stringify(question.correctAnswer);
      if (isCorrect) correctCount++;
      results.push({
        questionId: ans.questionId,
        isCorrect,
        explanation: isCorrect ? undefined : question.explanation,
        correctAnswer: isCorrect ? undefined : question.correctAnswer,
      });
    }

    const score = Math.round((correctCount / lesson.questions.length) * 100);
    const passed = score >= 70;

    const progress = await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        status: passed ? 'PASSED' : 'FAILED',
        score,
        attemptsCount: { increment: 1 },
        completedAt: passed ? new Date() : undefined,
      },
      create: {
        userId,
        lessonId,
        status: passed ? 'PASSED' : 'FAILED',
        score,
        attemptsCount: 1,
        completedAt: passed ? new Date() : undefined,
      },
    });

    await this.prisma.questionAnswer.createMany({
      data: results.map((r) => {
        const q = questionMap.get(r.questionId)!;
        return {
          progressId: progress.id,
          questionId: r.questionId,
          userAnswer: dto.answers.find((a) => a.questionId === r.questionId)!.userAnswer as object,
          isCorrect: r.isCorrect,
          shownExplanation: r.explanation ?? null,
        };
      }),
    });

    await this.touchStreak(userId);

    return { score, passed, results, progress };
  }

  async getLessonProgress(userId: string, lessonId: string) {
    return this.prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
      include: { answers: { include: { question: { select: { prompt: true, type: true } } } } },
    });
  }

  private async touchStreak(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const streak = await this.prisma.studyStreak.findUnique({ where: { userId } });
    if (!streak) return;

    const last = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;
    if (last) last.setHours(0, 0, 0, 0);

    if (last?.getTime() === today.getTime()) return;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const continued = last?.getTime() === yesterday.getTime();
    const newStreak = continued ? streak.currentStreak + 1 : 1;

    await this.prisma.studyStreak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(streak.longestStreak, newStreak),
        lastActiveDate: new Date(),
        totalActiveDays: { increment: 1 },
      },
    });
  }
}
