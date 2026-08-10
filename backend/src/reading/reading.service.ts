import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TranslationService } from '../translation/translation.service';
import {
  CreateReadingChapterDto,
  CreateReadingStoryDto,
  CreateReadingWordDto,
  SaveUserReadingWordDto,
  UpdateReadingChapterDto,
  UpdateReadingStoryDto,
  UpdateReadingWordDto,
} from './reading.dto';
import {
  extractOccurrencesFromBody,
  findOccurrencesOfPhrase,
  normalizePhrase,
} from './reading-lexicon';

const storyInclude = {
  chapters: {
    orderBy: { order: 'asc' as const },
    include: {
      words: { orderBy: { startOffset: 'asc' as const } },
      _count: { select: { words: true } },
    },
  },
  _count: { select: { words: true, chapters: true } },
} satisfies Prisma.ReadingStoryInclude;

function normalizeWord(word: string) {
  return normalizePhrase(word);
}

function estimateMinutes(text: string) {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 180));
}

function isProSubscription(
  plan?: string | null,
  status?: SubscriptionStatus | null,
  expiresAt?: Date | null,
) {
  if (!plan || plan === 'FREE') return false;
  if (status !== SubscriptionStatus.ACTIVE && status !== SubscriptionStatus.TRIAL) return false;
  if (expiresAt && expiresAt.getTime() < Date.now()) return false;
  return true;
}

@Injectable()
export class ReadingService {
  constructor(
    private prisma: PrismaService,
    private translation: TranslationService,
  ) {}

  private async syncStoryBody(storyId: string) {
    const chapters = await this.prisma.readingChapter.findMany({
      where: { storyId },
      orderBy: { order: 'asc' },
      select: { body: true },
    });
    const body = chapters.map((c) => c.body).join('\n\n');
    await this.prisma.readingStory.update({
      where: { id: storyId },
      data: { body },
    });
    return body;
  }

  async listPublished() {
    return this.prisma.readingStory.findMany({
      where: { isPublished: true },
      orderBy: [{ levelCode: 'asc' }, { order: 'asc' }],
      select: {
        id: true,
        title: true,
        levelCode: true,
        order: true,
        coverUrl: true,
        description: true,
        author: true,
        _count: { select: { words: true, chapters: true } },
      },
    });
  }

  async listAll() {
    return this.prisma.readingStory.findMany({
      orderBy: [{ levelCode: 'asc' }, { order: 'asc' }],
      include: {
        chapters: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
            isFree: true,
            _count: { select: { words: true } },
          },
        },
        _count: { select: { words: true, chapters: true } },
      },
    });
  }

  async getPublished(id: string, userId: string) {
    const access = await this.getAccess(userId);
    const entry = access.stories.find((s) => s.id === id);
    if (!entry) throw new NotFoundException('Өгүүллэг олдсонгүй');
    if (!entry.canOpen) {
      throw new ForbiddenException({
        message: 'Өмнөх өгүүллэгийн цээжлэх тоглоом дуусгана уу',
        locked: false,
        gamesBlocked: entry.gamesBlocked,
        practiceStoryId: entry.practiceStoryId,
      });
    }

    const story = await this.prisma.readingStory.findFirst({
      where: { id, isPublished: true },
      include: storyInclude,
    });
    if (!story) throw new NotFoundException('Өгүүллэг олдсонгүй');

    const chapterBodies = story.chapters.map((c) => c.body).join('\n\n');
    return {
      ...story,
      chapters: story.chapters.map((ch) => ({
        ...ch,
        canRead: access.isPro || ch.isFree,
      })),
      isPro: access.isPro,
      stats: {
        chapters: story.chapters.length,
        words: story._count.words,
        minutes: estimateMinutes(chapterBodies),
      },
    };
  }

  async saveUserWord(userId: string, dto: SaveUserReadingWordDto) {
    const story = await this.prisma.readingStory.findFirst({
      where: { id: dto.storyId, isPublished: true },
      select: { id: true },
    });
    if (!story) throw new NotFoundException('Өгүүллэг олдсонгүй');

    const word = normalizeWord(dto.word);
    if (!word) throw new BadRequestException('Үг хоосон байна');

    const existing = await this.prisma.userReadingWord.findUnique({
      where: {
        userId_storyId_word: { userId, storyId: dto.storyId, word },
      },
    });
    if (existing) {
      return { created: false, alreadyExists: true, word: existing };
    }

    const created = await this.prisma.userReadingWord.create({
      data: {
        userId,
        storyId: dto.storyId,
        word,
        meaningMn: dto.meaningMn.trim(),
        readingWordId: dto.readingWordId ?? null,
      },
    });
    return { created: true, alreadyExists: false, word: created };
  }

  async listMyWords(userId: string, storyId?: string) {
    return this.prisma.userReadingWord.findMany({
      where: { userId, ...(storyId ? { storyId } : {}) },
      orderBy: { createdAt: 'desc' },
      include: {
        story: { select: { id: true, title: true, levelCode: true } },
      },
    });
  }

  async deleteMyWord(userId: string, id: string) {
    const word = await this.prisma.userReadingWord.findFirst({
      where: { id, userId },
    });
    if (!word) throw new NotFoundException('Үг олдсонгүй');
    await this.prisma.userReadingWord.delete({ where: { id } });
    return { ok: true };
  }

  async getAccess(userId: string) {
    const stories = await this.prisma.readingStory.findMany({
      where: { isPublished: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        title: true,
        levelCode: true,
        order: true,
        coverUrl: true,
        description: true,
        author: true,
        _count: { select: { words: true, chapters: true } },
        chapters: {
          orderBy: { order: 'asc' },
          select: { id: true, title: true, order: true, isFree: true },
        },
      },
    });

    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    let isPro = isProSubscription(sub?.plan, sub?.status, sub?.expiresAt);
    if (
      sub &&
      !isPro &&
      sub.plan !== 'FREE' &&
      sub.status === SubscriptionStatus.ACTIVE &&
      sub.expiresAt &&
      sub.expiresAt.getTime() < Date.now()
    ) {
      await this.prisma.subscription.update({
        where: { userId },
        data: { status: SubscriptionStatus.EXPIRED, plan: 'FREE' },
      });
    }

    const progress = await this.prisma.userStoryProgress.findMany({ where: { userId } });
    const progressByStory = new Map(progress.map((p) => [p.storyId, p]));

    const wordGroups = await this.prisma.userReadingWord.groupBy({
      by: ['storyId'],
      where: { userId },
      _count: { _all: true },
    });
    const wordsByStory = new Map(wordGroups.map((g) => [g.storyId, g._count._all]));

    const storyAccess = stories.map((story, index) => {
      const freeChapterCount = story.chapters.filter((c) => c.isFree).length;
      const lockedChapterCount = story.chapters.length - freeChapterCount;
      // Өгүүллэг overview үргэлж нээлттэй; зөвхөн chapter түвшинд цоож
      const free = !isPro && freeChapterCount > 0;
      const locked = !isPro && lockedChapterCount > 0;
      const prev = index > 0 ? stories[index - 1] : null;
      let gamesBlocked = false;
      let practiceStoryId: string | null = null;

      if (prev) {
        const prevWords = wordsByStory.get(prev.id) ?? 0;
        if (prevWords >= 1) {
          const prevProg = progressByStory.get(prev.id);
          if (!(prevProg?.quizPassed && prevProg?.racePassed)) {
            gamesBlocked = true;
            practiceStoryId = prev.id;
          }
        }
      }

      const prog = progressByStory.get(story.id);
      const { chapters: chapterRows, ...storyMeta } = story;
      return {
        ...storyMeta,
        free,
        locked,
        gamesBlocked,
        practiceStoryId,
        canOpen: !gamesBlocked,
        quizPassed: prog?.quizPassed ?? false,
        racePassed: prog?.racePassed ?? false,
        wordsSaved: wordsByStory.get(story.id) ?? 0,
        nextStoryId: index < stories.length - 1 ? stories[index + 1].id : null,
        freeChapterCount,
        lockedChapterCount,
        chapters: chapterRows.map((ch) => ({
          id: ch.id,
          title: ch.title,
          order: ch.order,
          isFree: ch.isFree,
          canRead: isPro || ch.isFree,
        })),
      };
    });

    return {
      plan: sub?.plan ?? 'FREE',
      status: sub?.status ?? SubscriptionStatus.ACTIVE,
      isPro,
      stories: storyAccess,
    };
  }

  async completeQuiz(userId: string, storyId: string) {
    await this.ensurePublishedStory(storyId);
    const words = await this.prisma.userReadingWord.count({ where: { userId, storyId } });
    if (words === 0) {
      throw new BadRequestException('Энэ өгүүллэгт хадгалсан шинэ үг байхгүй');
    }

    return this.prisma.userStoryProgress.upsert({
      where: { userId_storyId: { userId, storyId } },
      create: { userId, storyId, quizPassed: true },
      update: { quizPassed: true },
    });
  }

  async completeRace(userId: string, storyId: string) {
    await this.ensurePublishedStory(storyId);
    const words = await this.prisma.userReadingWord.count({ where: { userId, storyId } });
    if (words === 0) {
      throw new BadRequestException('Энэ өгүүллэгт хадгалсан шинэ үг байхгүй');
    }

    const progress = await this.prisma.userStoryProgress.upsert({
      where: { userId_storyId: { userId, storyId } },
      create: { userId, storyId, racePassed: true },
      update: { racePassed: true },
    });

    if (progress.quizPassed && progress.racePassed && !progress.completedAt) {
      return this.prisma.userStoryProgress.update({
        where: { id: progress.id },
        data: { completedAt: new Date() },
      });
    }
    return progress;
  }

  private async ensurePublishedStory(id: string) {
    const story = await this.prisma.readingStory.findFirst({
      where: { id, isPublished: true },
    });
    if (!story) throw new NotFoundException('Өгүүллэг олдсонгүй');
    return story;
  }

  async getById(id: string) {
    const story = await this.prisma.readingStory.findUnique({
      where: { id },
      include: storyInclude,
    });
    if (!story) throw new NotFoundException('Өгүүллэг олдсонгүй');
    return story;
  }

  async createStory(dto: CreateReadingStoryDto) {
    const last = await this.prisma.readingStory.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const story = await this.prisma.readingStory.create({
      data: {
        title: dto.title,
        body: dto.body,
        coverUrl: dto.coverUrl,
        description: dto.description,
        author: dto.author,
        levelCode: dto.levelCode ?? 'A1',
        order: dto.order ?? (last?.order ?? 0) + 1,
        isPublished: dto.isPublished ?? false,
        chapters: {
          create: {
            title: 'Chapter 1',
            body: dto.body,
            order: 1,
          },
        },
      },
    });
    return this.getById(story.id);
  }

  async updateStory(id: string, dto: UpdateReadingStoryDto) {
    await this.ensureStory(id);
    await this.prisma.readingStory.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.coverUrl !== undefined && { coverUrl: dto.coverUrl }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.author !== undefined && { author: dto.author }),
        ...(dto.levelCode !== undefined && { levelCode: dto.levelCode }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
      },
    });
    return this.getById(id);
  }

  async deleteStory(id: string) {
    await this.ensureStory(id);
    return this.prisma.readingStory.delete({ where: { id } });
  }

  async createChapter(storyId: string, dto: CreateReadingChapterDto) {
    await this.ensureStory(storyId);

    let order = dto.order;
    if (order === undefined) {
      const last = await this.prisma.readingChapter.findFirst({
        where: { storyId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = (last?.order ?? 0) + 1;
    }

    const chapter = await this.prisma.readingChapter.create({
      data: {
        storyId,
        title: dto.title,
        body: dto.body,
        order,
      },
      include: {
        words: { orderBy: { startOffset: 'asc' } },
        _count: { select: { words: true } },
      },
    });
    await this.syncStoryBody(storyId);
    return chapter;
  }

  async updateChapter(chapterId: string, dto: UpdateReadingChapterDto) {
    const chapter = await this.prisma.readingChapter.findUnique({ where: { id: chapterId } });
    if (!chapter) throw new NotFoundException('Бүлэг олдсонгүй');

    const updated = await this.prisma.readingChapter.update({
      where: { id: chapterId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.body !== undefined && { body: dto.body }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.isFree !== undefined && { isFree: dto.isFree }),
      },
    });

    if (dto.body !== undefined) {
      await this.pruneInvalidAnnotations(chapterId, dto.body);
      await this.syncStoryBody(chapter.storyId);
    } else if (dto.order !== undefined) {
      await this.syncStoryBody(chapter.storyId);
    }

    return this.prisma.readingChapter.findUniqueOrThrow({
      where: { id: updated.id },
      include: {
        words: { orderBy: { startOffset: 'asc' } },
        _count: { select: { words: true } },
      },
    });
  }

  async deleteChapter(chapterId: string) {
    const chapter = await this.prisma.readingChapter.findUnique({ where: { id: chapterId } });
    if (!chapter) throw new NotFoundException('Бүлэг олдсонгүй');

    const count = await this.prisma.readingChapter.count({ where: { storyId: chapter.storyId } });
    if (count <= 1) {
      throw new BadRequestException('Сүүлийн бүлгийг устгах боломжгүй');
    }

    await this.prisma.readingChapter.delete({ where: { id: chapterId } });

    const remaining = await this.prisma.readingChapter.findMany({
      where: { storyId: chapter.storyId },
      orderBy: { order: 'asc' },
      select: { id: true },
    });
    for (let i = 0; i < remaining.length; i++) {
      await this.prisma.readingChapter.update({
        where: { id: remaining[i].id },
        data: { order: i + 1 },
      });
    }

    await this.syncStoryBody(chapter.storyId);
    return { ok: true };
  }

  async addWord(storyId: string, dto: CreateReadingWordDto) {
    const story = await this.prisma.readingStory.findUnique({
      where: { id: storyId },
      select: { id: true, excludedWords: true },
    });
    if (!story) throw new NotFoundException('Өгүүллэг олдсонгүй');

    let chapter = dto.chapterId
      ? await this.prisma.readingChapter.findFirst({
          where: { id: dto.chapterId, storyId },
          include: { words: true },
        })
      : await this.prisma.readingChapter.findFirst({
          where: { storyId },
          orderBy: { order: 'asc' },
          include: { words: true },
        });

    if (!chapter) throw new NotFoundException('Бүлэг олдсонгүй');

    const wordKey = normalizeWord(dto.word);
    let startOffset = dto.startOffset;
    let endOffset = dto.endOffset;
    let contextSentence = '';

    if (startOffset === undefined || endOffset === undefined) {
      const used = new Set(chapter.words.map((w) => `${w.startOffset}:${w.endOffset}`));
      const match = findOccurrencesOfPhrase(chapter.body, wordKey).find(
        (o) => !used.has(`${o.startOffset}:${o.endOffset}`),
      );
      if (!match) {
        throw new BadRequestException(
          `"${wordKey}" текстэд олдсонгүй эсвэл бүх тохиолдолд орчуулга аль хэдийн байна`,
        );
      }
      startOffset = match.startOffset;
      endOffset = match.endOffset;
      contextSentence = match.contextSentence;
    } else {
      const slice = chapter.body.slice(startOffset, endOffset);
      if (!slice) throw new BadRequestException('Буруу offset');
      contextSentence =
        findOccurrencesOfPhrase(chapter.body, wordKey).find(
          (o) => o.startOffset === startOffset && o.endOffset === endOffset,
        )?.contextSentence ?? slice;
    }

    const excludedWords = (story.excludedWords ?? []).filter(
      (w) => w !== `${startOffset}:${endOffset}` && w !== wordKey,
    );

    const created = await this.prisma.readingWord.create({
      data: {
        storyId,
        chapterId: chapter.id,
        word: wordKey,
        meaningMn: dto.meaningMn,
        startOffset,
        endOffset,
        contextSentence,
      },
    });

    if (excludedWords.length !== (story.excludedWords ?? []).length) {
      await this.prisma.readingStory.update({
        where: { id: storyId },
        data: { excludedWords },
      });
    }

    return created;
  }

  async updateWord(id: string, dto: UpdateReadingWordDto) {
    const existing = await this.prisma.readingWord.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Үг олдсонгүй');

    return this.prisma.readingWord.update({
      where: { id },
      data: {
        ...(dto.word !== undefined && { word: normalizeWord(dto.word) }),
        ...(dto.meaningMn !== undefined && { meaningMn: dto.meaningMn }),
      },
    });
  }

  async deleteWord(id: string) {
    const word = await this.prisma.readingWord.findUnique({ where: { id } });
    if (!word) throw new NotFoundException('Үг олдсонгүй');

    const exclusionKey = `${word.startOffset}:${word.endOffset}`;
    const story = await this.prisma.readingStory.findUnique({
      where: { id: word.storyId },
      select: { excludedWords: true },
    });
    const excludedWords = [...new Set([...(story?.excludedWords ?? []), exclusionKey])];

    await this.prisma.readingWord.delete({ where: { id } });
    await this.prisma.readingStory.update({
      where: { id: word.storyId },
      data: { excludedWords },
    });
  }

  async translateText(text: string, context?: string) {
    const phrase = normalizeWord(text);
    const meaningMn = await this.translation.translateEnToMn(phrase, context);
    return { word: phrase, meaningMn };
  }

  async autoTranslateStory(storyId: string, overwrite = false) {
    await this.ensureStory(storyId);
    const chapters = await this.prisma.readingChapter.findMany({
      where: { storyId },
      orderBy: { order: 'asc' },
      select: { id: true },
    });

    let added = 0;
    let skipped = 0;
    let total = 0;

    for (const chapter of chapters) {
      const result = await this.autoTranslateChapter(chapter.id, overwrite);
      added += result.added;
      skipped += result.skipped;
      total += result.total;
    }

    return {
      added,
      skipped,
      total,
      story: await this.getById(storyId),
    };
  }

  async autoTranslateChapter(chapterId: string, overwrite = false) {
    const chapter = await this.prisma.readingChapter.findUnique({
      where: { id: chapterId },
      include: {
        words: { orderBy: { startOffset: 'asc' } },
        story: { select: { id: true, excludedWords: true } },
      },
    });
    if (!chapter) throw new NotFoundException('Бүлэг олдсонгүй');

    const storyId = chapter.storyId;
    const occurrences = extractOccurrencesFromBody(chapter.body);
    const excluded = overwrite
      ? new Set<string>()
      : new Set(chapter.story.excludedWords ?? []);

    const existingBySpan = new Map<string, (typeof chapter.words)[number]>();
    for (const w of chapter.words) {
      existingBySpan.set(`${w.startOffset}:${w.endOffset}`, w);
    }

    await this.pruneInvalidAnnotations(chapterId, chapter.body);
    const refreshedWords = await this.prisma.readingWord.findMany({
      where: { chapterId },
      orderBy: { startOffset: 'asc' },
    });
    for (const key of [...existingBySpan.keys()]) {
      if (!refreshedWords.some((w) => `${w.startOffset}:${w.endOffset}` === key)) {
        existingBySpan.delete(key);
      }
    }
    for (const w of refreshedWords) {
      existingBySpan.set(`${w.startOffset}:${w.endOffset}`, w);
    }

    if (overwrite) {
      await this.prisma.readingStory.update({
        where: { id: storyId },
        data: { excludedWords: [] },
      });
    }

    let added = 0;
    let skipped = 0;
    const meaningCache = new Map<string, string>();

    for (const occ of occurrences) {
      const spanKey = `${occ.startOffset}:${occ.endOffset}`;
      if (excluded.has(spanKey) || excluded.has(occ.word)) {
        skipped += 1;
        continue;
      }

      const existing = existingBySpan.get(spanKey);
      if (existing && !overwrite) {
        skipped += 1;
        continue;
      }

      const cacheKey = `${occ.word}||${occ.contextSentence}`;
      let meaningMn = meaningCache.get(cacheKey);
      if (!meaningMn) {
        meaningMn = await this.translation.translateEnToMn(occ.word, occ.contextSentence);
        meaningCache.set(cacheKey, meaningMn);
        await sleep(200);
      }

      if (existing) {
        await this.prisma.readingWord.update({
          where: { id: existing.id },
          data: {
            word: occ.word,
            meaningMn,
            contextSentence: occ.contextSentence,
          },
        });
      } else {
        const created = await this.prisma.readingWord.create({
          data: {
            storyId,
            chapterId,
            word: occ.word,
            meaningMn,
            startOffset: occ.startOffset,
            endOffset: occ.endOffset,
            contextSentence: occ.contextSentence,
          },
        });
        existingBySpan.set(spanKey, created);
        added += 1;
      }
    }

    const updatedChapter = await this.prisma.readingChapter.findUniqueOrThrow({
      where: { id: chapterId },
      include: {
        words: { orderBy: { startOffset: 'asc' } },
        _count: { select: { words: true } },
      },
    });

    return {
      added,
      skipped,
      total: occurrences.length,
      chapter: updatedChapter,
    };
  }

  private async pruneInvalidAnnotations(chapterId: string, body: string) {
    const valid = new Set(
      extractOccurrencesFromBody(body).map((o) => `${o.startOffset}:${o.endOffset}`),
    );
    const words = await this.prisma.readingWord.findMany({ where: { chapterId } });
    const stale = words.filter((w) => {
      const key = `${w.startOffset}:${w.endOffset}`;
      if (!valid.has(key)) return true;
      const slice = body.slice(w.startOffset, w.endOffset).toLowerCase().replace(/\s+/g, ' ');
      return normalizePhrase(slice) !== w.word;
    });
    if (stale.length > 0) {
      await this.prisma.readingWord.deleteMany({
        where: { id: { in: stale.map((w) => w.id) } },
      });
    }
  }

  private async ensureStory(id: string) {
    const story = await this.prisma.readingStory.findUnique({ where: { id } });
    if (!story) throw new NotFoundException('Өгүүллэг олдсонгүй');
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
