import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { GrammarQuizResultDto } from './grammar.dto';
import {
  GRAMMAR_FREE_RULES,
  GRAMMAR_LEVELS,
  GRAMMAR_PASS_PERCENT,
  GRAMMAR_RULE_COUNTS,
  isPassingScore,
  type GrammarLevelSlug,
} from './grammar-curriculum';

type GrammarAccess = { isPro: boolean; staffAccess: boolean };

export type GrammarRuleState = {
  ruleId: number;
  viewed: boolean;
  bestCorrect: number;
  bestTotal: number;
  attempts: number;
  passed: boolean;
  /** Эхний үнэгүй хичээл эсвэл өмнөх хичээлийн шалгалтад тэнцсэн */
  unlocked: boolean;
  /** VIP шаардлагатай ба хэрэглэгч VIP биш */
  requiresVip: boolean;
  /** Одоо үзэж, шалгалт өгч болох эсэх */
  canOpen: boolean;
};

export type GrammarLevelProgress = {
  level: GrammarLevelSlug;
  isPro: boolean;
  staffAccess: boolean;
  freeRuleCount: number;
  passPercent: number;
  rules: GrammarRuleState[];
};

@Injectable()
export class GrammarService {
  constructor(
    private prisma: PrismaService,
    private subscriptions: SubscriptionsService,
  ) {}

  getProgress(userId: string, level: GrammarLevelSlug) {
    return this.access(userId).then((access) => this.buildProgress(userId, level, access));
  }

  /** Хичээлийг нээж үзсэнийг тэмдэглэнэ (анх үзсэн огноо л хадгална) */
  async markViewed(userId: string, level: GrammarLevelSlug, ruleId: number) {
    this.assertRuleId(level, ruleId);
    const access = await this.access(userId);
    const before = await this.buildProgress(userId, level, access);
    this.assertCanOpen(before, [ruleId]);

    const levelCode = GRAMMAR_LEVELS[level];
    // Зэрэг ирсэн хүсэлтэд unique зөрчил гаргахгүйн тулд skipDuplicates
    await this.prisma.grammarRuleProgress.createMany({
      data: [{ userId, level: levelCode, ruleId }],
      skipDuplicates: true,
    });
    await this.prisma.grammarRuleProgress.updateMany({
      where: { userId, level: levelCode, ruleId, viewedAt: null },
      data: { viewedAt: new Date() },
    });

    return this.buildProgress(userId, level, access);
  }

  /** Шалгалтын оноог хадгалж, тэнцсэн бол дараагийн хичээлийг нээнэ */
  async submitQuiz(userId: string, level: GrammarLevelSlug, results: GrammarQuizResultDto[]) {
    const ruleIds = results.map((r) => r.ruleId);
    if (new Set(ruleIds).size !== ruleIds.length) {
      throw new BadRequestException('Нэг дүрэм давхардсан байна');
    }
    for (const r of results) {
      this.assertRuleId(level, r.ruleId);
      if (r.correct > r.total) throw new BadRequestException('Зөв хариулт нийт асуултаас их байж болохгүй');
    }

    const access = await this.access(userId);
    const before = await this.buildProgress(userId, level, access);
    // Түгжээтэй хичээлийн оноогоор дараагийн хичээлүүдийг нээлгэхгүй
    this.assertCanOpen(before, ruleIds);

    const levelCode = GRAMMAR_LEVELS[level];
    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      await tx.grammarRuleProgress.createMany({
        data: ruleIds.map((ruleId) => ({ userId, level: levelCode, ruleId })),
        skipDuplicates: true,
      });

      for (const r of results) {
        const passed = isPassingScore(r.correct, r.total);
        const where = { userId_level_ruleId: { userId, level: levelCode, ruleId: r.ruleId } };

        await tx.grammarQuizAttempt.create({
          data: { userId, level: levelCode, ruleId: r.ruleId, correct: r.correct, total: r.total, passed },
        });

        const row = await tx.grammarRuleProgress.findUnique({ where });
        const better = !row?.bestTotal || r.correct * row.bestTotal > row.bestCorrect * r.total;
        await tx.grammarRuleProgress.update({
          where,
          data: {
            attempts: { increment: 1 },
            ...(better && { bestCorrect: r.correct, bestTotal: r.total }),
          },
        });

        if (passed) {
          await tx.grammarRuleProgress.updateMany({
            where: { userId, level: levelCode, ruleId: r.ruleId, passedAt: null },
            data: { passedAt: now },
          });
        }
      }
    });

    const progress = await this.buildProgress(userId, level, access);
    const wasPassed = new Set(before.rules.filter((r) => r.passed).map((r) => r.ruleId));
    const wasUnlocked = new Set(before.rules.filter((r) => r.unlocked).map((r) => r.ruleId));

    return {
      progress,
      newlyPassed: progress.rules.filter((r) => r.passed && !wasPassed.has(r.ruleId)).map((r) => r.ruleId),
      newlyUnlocked: progress.rules.filter((r) => r.unlocked && !wasUnlocked.has(r.ruleId)).map((r) => r.ruleId),
    };
  }

  private async access(userId: string): Promise<GrammarAccess> {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const staffAccess = user?.role === 'ADMIN' || user?.role === 'EDITOR';
    if (staffAccess) return { isPro: true, staffAccess };
    const sub = await this.subscriptions.resolveActiveSubscription(userId);
    return { isPro: this.subscriptions.isPro(sub), staffAccess };
  }

  private async buildProgress(
    userId: string,
    level: GrammarLevelSlug,
    access: GrammarAccess,
  ): Promise<GrammarLevelProgress> {
    const rows = await this.prisma.grammarRuleProgress.findMany({
      where: { userId, level: GRAMMAR_LEVELS[level] },
    });
    const byRule = new Map(rows.map((row) => [row.ruleId, row]));

    const rules: GrammarRuleState[] = [];
    for (let ruleId = 1; ruleId <= GRAMMAR_RULE_COUNTS[level]; ruleId++) {
      const row = byRule.get(ruleId);
      const free = ruleId <= GRAMMAR_FREE_RULES;
      // N-р хичээл (N-1)-р хичээлийн шалгалтад тэнцэхэд нээгдэнэ; админ/эдитор бүгдийг үзнэ
      const unlocked = access.staffAccess || free || Boolean(byRule.get(ruleId - 1)?.passedAt);
      const requiresVip = !free && !access.isPro;
      rules.push({
        ruleId,
        viewed: Boolean(row?.viewedAt),
        bestCorrect: row?.bestCorrect ?? 0,
        bestTotal: row?.bestTotal ?? 0,
        attempts: row?.attempts ?? 0,
        passed: Boolean(row?.passedAt),
        unlocked,
        requiresVip,
        canOpen: unlocked && !requiresVip,
      });
    }

    return {
      level,
      isPro: access.isPro,
      staffAccess: access.staffAccess,
      freeRuleCount: GRAMMAR_FREE_RULES,
      passPercent: GRAMMAR_PASS_PERCENT,
      rules,
    };
  }

  private assertRuleId(level: GrammarLevelSlug, ruleId: number) {
    if (!Number.isInteger(ruleId) || ruleId < 1 || ruleId > GRAMMAR_RULE_COUNTS[level]) {
      throw new BadRequestException('Дүрэм олдсонгүй');
    }
  }

  private assertCanOpen(progress: GrammarLevelProgress, ruleIds: number[]) {
    for (const ruleId of ruleIds) {
      const rule = progress.rules[ruleId - 1];
      if (rule?.canOpen) continue;
      throw new ForbiddenException(
        rule?.requiresVip
          ? 'Энэ хичээл VIP эрхээр нээгдэнэ'
          : 'Өмнөх хичээлийн шалгалтад тэнцсэний дараа энэ хичээл нээгдэнэ',
      );
    }
  }
}
