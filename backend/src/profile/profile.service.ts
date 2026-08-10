import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnboardingDto } from './onboarding.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async completeOnboarding(userId: string, dto: OnboardingDto) {
    const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile олдсонгүй');

    const currentLevel = dto.selfAssessedLevel ?? 'A1';
    const updated = await this.prisma.studentProfile.update({
      where: { userId },
      data: {
        interests: dto.interests ?? [],
        selfAssessedLevel: dto.selfAssessedLevel,
        currentLevel,
        dailyGoalMinutes: dto.dailyGoalMinutes ?? 30,
        motivationNote: dto.motivationNote,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
      },
    });

    const level = await this.prisma.level.findUnique({ where: { code: currentLevel } });
    if (level) {
      await this.prisma.enrollment.upsert({
        where: { userId_levelId: { userId, levelId: level.id } },
        update: {},
        create: { userId, levelId: level.id },
      });
    }

    return updated;
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
