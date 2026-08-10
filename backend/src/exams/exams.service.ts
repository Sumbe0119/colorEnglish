import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitExamDto } from './exams.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async getByUnit(unitId: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { unitId },
      include: {
        questions: { orderBy: { order: 'asc' } },
        unit: { select: { title: true, level: { select: { code: true, title: true } } } },
      },
    });
    if (!exam) throw new NotFoundException('Шалгалт олдсонгүй');

    const { questions, ...rest } = exam;
    return {
      ...rest,
      questions: questions.map(({ correctAnswer: _ca, ...q }) => q),
    };
  }

  async startAttempt(userId: string, examId: string) {
    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Шалгалт олдсонгүй');

    return this.prisma.examAttempt.create({
      data: { userId, examId, status: 'IN_PROGRESS' },
    });
  }

  async submitAttempt(userId: string, attemptId: string, dto: SubmitExamDto) {
    const attempt = await this.prisma.examAttempt.findFirst({
      where: { id: attemptId, userId, status: 'IN_PROGRESS' },
      include: { exam: { include: { questions: true } } },
    });
    if (!attempt) throw new NotFoundException('Оролдлого олдсонгүй');
    if (!dto.answers.length) throw new BadRequestException('Хариулт оруулна уу');

    const qMap = new Map(attempt.exam.questions.map((q) => [q.id, q]));
    let correct = 0;
    const results = [];

    for (const ans of dto.answers) {
      const q = qMap.get(ans.examQuestionId);
      if (!q) continue;
      const isCorrect = JSON.stringify(ans.userAnswer) === JSON.stringify(q.correctAnswer);
      if (isCorrect) correct++;
      results.push({
        attemptId,
        examQuestionId: ans.examQuestionId,
        userAnswer: ans.userAnswer as object,
        isCorrect,
        explanationShown: isCorrect ? 'Зөв!' : q.explanation,
      });
    }

    const scorePercent = Math.round((correct / attempt.exam.questions.length) * 100);
    const passed = scorePercent >= attempt.exam.passScore;

    await this.prisma.examResult.createMany({ data: results });

    const updated = await this.prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        status: passed ? 'PASSED' : 'FAILED',
        scorePercent,
        finishedAt: new Date(),
      },
    });

    return {
      attempt: updated,
      passed,
      scorePercent,
      results: results.map((r) => ({
        examQuestionId: r.examQuestionId,
        isCorrect: r.isCorrect,
        explanation: r.explanationShown,
        correctAnswer: r.isCorrect ? undefined : qMap.get(r.examQuestionId)?.correctAnswer,
      })),
    };
  }

  async getAttempts(userId: string, examId?: string) {
    return this.prisma.examAttempt.findMany({
      where: { userId, ...(examId && { examId }) },
      include: { exam: { select: { title: true, passScore: true } } },
      orderBy: { startedAt: 'desc' },
    });
  }
}
