// backend/src/games/games.service.ts
// Тоглоомын оноо бүртгэх, leaderboard эрэмбэлэх, "Өгүүлбэр бүтээх"-ийн эзэмшсэн өгүүлбэрийг хадгалах.
// Leaderboard = хэрэглэгч бүрийн тоглоом тус бүрийн ШИЛДЭГ оноо (game_bests); "ALL" = бүх тоглоомын шилдэг онооны нийлбэр.
import { Injectable, Logger } from '@nestjs/common';
import { GameKind, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { LeaderboardScope } from './games.dto';

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  avatarUrl: string | null;
  score: number;
  plays: number;
  /** Тоглоом тус бүрийн шилдэг оноо (зөвхөн ALL үед) */
  perGame?: Partial<Record<GameKind, number>>;
};

export type LeaderboardResult = {
  game: LeaderboardScope;
  total: number;
  entries: LeaderboardEntry[];
  /** Нэвтэрсэн хэрэглэгчийн байр (оноогүй бол null) */
  me: { rank: number; score: number; plays: number } | null;
};

export type SubmitScoreResult = {
  game: GameKind;
  score: number;
  best: number;
  isNewBest: boolean;
  rank: number;
  plays: number;
};

const DEFAULT_LIMIT = 50;

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(private prisma: PrismaService) {}

  /** Нэг тоглолтын оноог бүртгээд шилдэг оноог шинэчилнэ; буцаахдаа тухайн тоглоомын байрыг хэлнэ. */
  async submitScore(userId: string, game: GameKind, score: number, meta?: Record<string, unknown>): Promise<SubmitScoreResult> {
    const s = Math.max(0, Math.round(score));
    const best = await this.prisma.$transaction(async (tx) => {
      await tx.gameScore.create({ data: { userId, game, score: s, meta: (meta ?? undefined) as Prisma.InputJsonValue | undefined } });
      const prev = await tx.gameBest.findUnique({ where: { userId_game: { userId, game } } });
      if (!prev) {
        const created = await tx.gameBest.create({ data: { userId, game, bestScore: s, totalScore: s, plays: 1, bestAt: new Date() } });
        return { row: created, isNewBest: true };
      }
      const isNewBest = s > prev.bestScore;
      const updated = await tx.gameBest.update({
        where: { id: prev.id },
        data: {
          plays: { increment: 1 },
          totalScore: { increment: s },
          ...(isNewBest ? { bestScore: s, bestAt: new Date() } : {}),
        },
      });
      return { row: updated, isNewBest };
    });
    const rank = await this.rankOf(game, best.row.bestScore, best.row.bestAt);
    return { game, score: s, best: best.row.bestScore, isNewBest: best.isNewBest, rank, plays: best.row.plays };
  }

  /** Сервер талаас (socket тоглоомууд) оноо бүртгэх — алдаа гарвал лог бичээд үргэлжлүүлнэ. */
  recordQuietly(userId: string, game: GameKind, score: number, meta?: Record<string, unknown>) {
    this.submitScore(userId, game, score, meta).catch((e) => this.logger.warn(`score record failed (${game}, ${userId}): ${String(e)}`));
  }

  async leaderboard(scope: LeaderboardScope, userId: string | null, limit = DEFAULT_LIMIT): Promise<LeaderboardResult> {
    if (scope === 'ALL') return this.overallLeaderboard(userId, limit);
    const game = scope;
    const [rows, total] = await Promise.all([
      this.prisma.gameBest.findMany({
        where: { game, bestScore: { gt: 0 } },
        orderBy: [{ bestScore: 'desc' }, { bestAt: 'asc' }],
        take: limit,
        include: { user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } } },
      }),
      this.prisma.gameBest.count({ where: { game, bestScore: { gt: 0 } } }),
    ]);
    const entries: LeaderboardEntry[] = rows.map((r, i) => ({
      rank: i + 1,
      userId: r.userId,
      name: displayName(r.user),
      avatarUrl: r.user.avatarUrl,
      score: r.bestScore,
      plays: r.plays,
    }));
    let me: LeaderboardResult['me'] = null;
    if (userId) {
      const mine = await this.prisma.gameBest.findUnique({ where: { userId_game: { userId, game } } });
      if (mine && mine.bestScore > 0) me = { rank: await this.rankOf(game, mine.bestScore, mine.bestAt), score: mine.bestScore, plays: mine.plays };
    }
    return { game, total, entries, me };
  }

  /** Бүх тоглоомын шилдэг онооны нийлбэрээр */
  private async overallLeaderboard(userId: string | null, limit: number): Promise<LeaderboardResult> {
    const rows = await this.prisma.gameBest.findMany({ where: { bestScore: { gt: 0 } }, select: { userId: true, game: true, bestScore: true, plays: true, bestAt: true } });
    const byUser = new Map<string, { score: number; plays: number; firstAt: number; perGame: Partial<Record<GameKind, number>> }>();
    for (const r of rows) {
      const cur = byUser.get(r.userId) ?? { score: 0, plays: 0, firstAt: Infinity, perGame: {} };
      cur.score += r.bestScore;
      cur.plays += r.plays;
      cur.firstAt = Math.min(cur.firstAt, r.bestAt.getTime());
      cur.perGame[r.game] = r.bestScore;
      byUser.set(r.userId, cur);
    }
    const sorted = [...byUser.entries()].sort((a, b) => b[1].score - a[1].score || a[1].firstAt - b[1].firstAt);
    const top = sorted.slice(0, limit);
    const users = await this.prisma.user.findMany({
      where: { id: { in: top.map(([id]) => id) } },
      select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));
    const entries: LeaderboardEntry[] = top.map(([id, v], i) => {
      const u = userMap.get(id);
      return { rank: i + 1, userId: id, name: u ? displayName(u) : 'Хэрэглэгч', avatarUrl: u?.avatarUrl ?? null, score: v.score, plays: v.plays, perGame: v.perGame };
    });
    let me: LeaderboardResult['me'] = null;
    if (userId) {
      const idx = sorted.findIndex(([id]) => id === userId);
      if (idx >= 0) me = { rank: idx + 1, score: sorted[idx][1].score, plays: sorted[idx][1].plays };
    }
    return { game: 'ALL', total: sorted.length, entries, me };
  }

  /** Тухайн оноотой хэрэглэгчийн байр: өөрөөс илүү оноотой (эсвэл ижил оноог эрт авсан) хүний тоо + 1 */
  private async rankOf(game: GameKind, bestScore: number, bestAt: Date): Promise<number> {
    const ahead = await this.prisma.gameBest.count({
      where: { game, OR: [{ bestScore: { gt: bestScore } }, { bestScore, bestAt: { lt: bestAt } }] },
    });
    return ahead + 1;
  }

  // ───────── Өгүүлбэр бүтээх: эзэмшсэн өгүүлбэрүүд ─────────

  async getSentenceMastery(userId: string): Promise<{ keys: string[]; byLevel: Record<number, number> }> {
    const rows = await this.prisma.sentenceMastery.findMany({ where: { userId }, select: { sentenceKey: true, level: true } });
    const byLevel: Record<number, number> = {};
    for (const r of rows) byLevel[r.level] = (byLevel[r.level] ?? 0) + 1;
    return { keys: rows.map((r) => r.sentenceKey), byLevel };
  }

  async addSentenceMastery(userId: string, items: { key: string; level?: number }[]): Promise<{ added: number; total: number }> {
    const data = items
      .map((it) => ({ userId, sentenceKey: it.key.trim().toLowerCase(), level: it.level ?? 0 }))
      .filter((it) => it.sentenceKey.length > 0);
    const res = data.length ? await this.prisma.sentenceMastery.createMany({ data, skipDuplicates: true }) : { count: 0 };
    const total = await this.prisma.sentenceMastery.count({ where: { userId } });
    return { added: res.count, total };
  }

  async resetSentenceMastery(userId: string): Promise<{ removed: number }> {
    const res = await this.prisma.sentenceMastery.deleteMany({ where: { userId } });
    return { removed: res.count };
  }
}

function displayName(u: { firstName: string | null; lastName: string | null; email: string }): string {
  const first = u.firstName?.trim();
  const last = u.lastName?.trim();
  if (first && last) return `${first} ${last.charAt(0)}.`;
  if (first) return first;
  return u.email.split('@')[0];
}
