import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWritingSubmissionDto } from './writing.dto';

@Injectable()
export class WritingService {
  constructor(private prisma: PrismaService) {}

  async listSubmissions(userId: string) {
    return this.prisma.writingSubmission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSubmission(userId: string, dto: CreateWritingSubmissionDto) {
    // AI placeholder grading
    const feedback = {
      grammarErrors: [],
      styleSuggestions: ['Try varying sentence length for better flow.'],
      betterAlternatives: [],
    };

    return this.prisma.writingSubmission.create({
      data: {
        userId,
        prompt: dto.prompt,
        originalText: dto.originalText,
        correctedText: dto.originalText,
        feedback,
        overallScore: 75,
        status: 'PASSED',
        reviewedAt: new Date(),
      },
    });
  }

  async getSubmission(userId: string, id: string) {
    const submission = await this.prisma.writingSubmission.findFirst({
      where: { id, userId },
    });
    if (!submission) throw new NotFoundException('Бичгийн даалгавар олдсонгүй');
    return submission;
  }
}
