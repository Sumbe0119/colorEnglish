import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LearningStyle } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { OnboardingDto } from './onboarding.dto';
import { computeLearningStyle, LEARNING_STYLE_QUESTION_COUNT } from './learning-style';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async completeOnboarding(userId: string, dto: OnboardingDto) {
    const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile олдсонгүй');

    // Onboarding-ийг дахин бөглөсөн (жишээ нь зочноор судалгаа бөглөөд нэвтэрсэн) хэрэглэгчийн
    // сурч буй түвшин, ахицыг өөрийн үнэлгээгээр дарахгүй — зөвхөн сонголтуудыг шинэчилнэ
    const alreadyOnboarded = profile.onboardingCompleted;
    const currentLevel = alreadyOnboarded ? profile.currentLevel : (dto.selfAssessedLevel ?? 'A1');
    const learningStyle = dto.learningStyleAnswers?.length
      ? computeLearningStyle(dto.learningStyleAnswers)
      : null;
    const updated = await this.prisma.studentProfile.update({
      where: { userId },
      data: {
        interests: dto.interests ?? [],
        selfAssessedLevel: dto.selfAssessedLevel,
        currentLevel,
        dailyGoalMinutes: dto.dailyGoalMinutes ?? 30,
        motivationNote: dto.motivationNote,
        ...(learningStyle && {
          dominantLearningStyle: learningStyle.dominant,
          learningStyleScores: learningStyle.scores,
          learningStyleCompletedAt:
            dto.learningStyleAnswers!.length >= LEARNING_STYLE_QUESTION_COUNT ? new Date() : null,
        }),
        onboardingCompleted: true,
        onboardingCompletedAt: alreadyOnboarded ? (profile.onboardingCompletedAt ?? new Date()) : new Date(),
      },
    });

    const level = alreadyOnboarded
      ? null
      : await this.prisma.level.findUnique({ where: { code: currentLevel } });
    if (level) {
      await this.prisma.enrollment.upsert({
        where: { userId_levelId: { userId, levelId: level.id } },
        update: {},
        create: { userId, levelId: level.id },
      });
    }

    return updated;
  }

  /** Судалгааг бүрэн бөглөсөн үед л хадгална — дутуу хариулт хүлээж авахгүй */
  async submitLearningStyle(userId: string, answers: LearningStyle[]) {
    if (answers.length < LEARNING_STYLE_QUESTION_COUNT) {
      throw new BadRequestException(
        `Бүх ${LEARNING_STYLE_QUESTION_COUNT} асуултад хариулна уу`,
      );
    }
    const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile олдсонгүй');

    const { scores, dominant } = computeLearningStyle(answers);
    return this.prisma.studentProfile.update({
      where: { userId },
      data: {
        dominantLearningStyle: dominant,
        learningStyleScores: scores,
        learningStyleCompletedAt: new Date(),
      },
    });
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
      include: { user: { select: { email: true, firstName: true, lastName: true, avatarUrl: true } } },
    });
    if (!profile) throw new NotFoundException('Profile олдсонгүй');
    return profile;
  }
}
