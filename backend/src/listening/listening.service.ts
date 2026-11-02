// backend/src/listening/listening.service.ts
// Сонсох тоглоом: клипүүд (YouTube + transcript), хэрэглэгчийн оролдлого / явц, админ CRUD.
import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { GameKind, LevelCode, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GamesService } from '../games/games.service';
import { CreateClipDto, SubmitAttemptDto, UpdateClipDto } from './listening.dto';
import { candidateWords, countOf, fetchTranscript, parseYoutubeId, Segment, sliceSegments, countWords, tokenize } from './transcript';
import { WordInfoService } from './word-info.service';

/** Оноо: зөв бол суурь + давтамж бүрт; буруу бол 0 */
const BASE_POINTS = 25;
const POINTS_PER_OCCURRENCE = 5;
/** Сервер асаад хэдэн секундийн дараа дутуу үгийн тайлбаруудыг арын горимд бэлтгэх */
const WARM_ON_BOOT_DELAY_MS = 15_000;

@Injectable()
export class ListeningService implements OnModuleInit {
  private readonly logger = new Logger(ListeningService.name);
  private warming = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly games: GamesService,
    private readonly words: WordInfoService,
  ) {}

  /** Сервер асахад (AI тохируулсан бол) бүх нийтэлсэн клипийн үгийн тайлбарыг нэг удаа урьдчилан бэлтгэнэ. */
  onModuleInit() {
    if (!this.words.isAiConfigured()) return;
    setTimeout(() => void this.warmAll().catch((e) => this.logger.warn(`warm on boot failed: ${String(e)}`)), WARM_ON_BOOT_DELAY_MS).unref();
  }

  /** Бүх нийтэлсэн клипийн санал болгох үгсийн тайлбарыг бэлтгэнэ (аль хэдийн байгааг алгасна). */
  async warmAll() {
    if (this.warming) return { generated: 0, skipped: 0, failed: 0, busy: true };
    this.warming = true;
    try {
      const clips = await this.prisma.listeningClip.findMany({ where: { isPublished: true }, select: { segments: true, wordCounts: true } });
      const items = clips.flatMap((c) => this.warmItems(c.segments as unknown as Segment[], c.wordCounts as Record<string, number>));
      const r = await this.words.warmMany(items);
      if (r.generated || r.failed) this.logger.log(`word infos warmed: +${r.generated}, skipped ${r.skipped}, failed ${r.failed}`);
      return { ...r, busy: false };
    } finally {
      this.warming = false;
    }
  }

  /** Нэг клипийн үгсийг арын горимд бэлтгэнэ (клип нэмэх / transcript шинэчлэх үед). */
  private warmClip(segments: Segment[], wordCounts: Record<string, number>) {
    if (!this.words.isAiConfigured()) return;
    void this.words.warmMany(this.warmItems(segments, wordCounts)).catch((e) => this.logger.warn(`warm clip failed: ${String(e)}`));
  }

  /** Үг + контекст өгүүлбэр (эхний хэлэгдсэн мөр) */
  private warmItems(segments: Segment[], wordCounts: Record<string, number>) {
    return candidateWords(wordCounts).map(({ word }) => ({
      word,
      context: segments.find((s) => tokenize(s.text).includes(word))?.text,
    }));
  }

  // ---------- Хэрэглэгч ----------

  async listPublished(userId: string) {
    const [clips, attempts] = await Promise.all([
      this.prisma.listeningClip.findMany({
        where: { isPublished: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        select: { id: true, title: true, description: true, youtubeId: true, startSec: true, endSec: true, levelCode: true, wordCounts: true },
      }),
      this.prisma.listeningAttempt.findMany({ where: { userId, correct: true }, select: { clipId: true, word: true }, distinct: ['clipId', 'word'] }),
    ]);
    const mastered = new Map<string, Set<string>>();
    for (const a of attempts) {
      if (!mastered.has(a.clipId)) mastered.set(a.clipId, new Set());
      mastered.get(a.clipId)!.add(a.word);
    }
    return clips.map((c) => {
      const words = candidateWords(c.wordCounts as Record<string, number>);
      const done = words.filter((w) => mastered.get(c.id)?.has(w.word)).length;
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        youtubeId: c.youtubeId,
        startSec: c.startSec,
        endSec: c.endSec,
        levelCode: c.levelCode,
        wordTotal: words.length,
        wordDone: done,
      };
    });
  }

  async getClip(id: string, userId: string) {
    const clip = await this.prisma.listeningClip.findFirst({ where: { id, isPublished: true } });
    if (!clip) throw new NotFoundException('Клип олдсонгүй');
    const attempts = await this.prisma.listeningAttempt.findMany({
      where: { userId, clipId: id },
      orderBy: { createdAt: 'desc' },
      select: { word: true, correct: true, expected: true, clicked: true, createdAt: true },
    });
    const mastered = [...new Set(attempts.filter((a) => a.correct).map((a) => a.word))];
    return {
      id: clip.id,
      title: clip.title,
      description: clip.description,
      youtubeId: clip.youtubeId,
      startSec: clip.startSec,
      endSec: clip.endSec,
      levelCode: clip.levelCode,
      segments: clip.segments as unknown as Segment[],
      words: candidateWords(clip.wordCounts as Record<string, number>),
      mastered,
      attempts: attempts.slice(0, 50),
    };
  }

  async submitAttempt(userId: string, dto: SubmitAttemptDto) {
    const clip = await this.prisma.listeningClip.findFirst({ where: { id: dto.clipId, isPublished: true } });
    if (!clip) throw new NotFoundException('Клип олдсонгүй');
    const word = dto.word.trim().toLowerCase();
    const expected = countOf(clip.segments as unknown as Segment[], word);
    if (expected === 0) throw new BadRequestException('Энэ үг клипт байхгүй');
    const correct = dto.clicked === expected;
    const score = correct ? BASE_POINTS + POINTS_PER_OCCURRENCE * expected : 0;
    await this.prisma.listeningAttempt.create({ data: { userId, clipId: clip.id, word, expected, clicked: dto.clicked, correct } });
    const game = score > 0 ? await this.games.submitScore(userId, GameKind.LISTENING, score, { clipId: clip.id, word, expected, clicked: dto.clicked }) : null;
    return { word, expected, clicked: dto.clicked, correct, score, game };
  }

  async progress(userId: string) {
    const rows = await this.prisma.listeningAttempt.groupBy({
      by: ['clipId', 'word'],
      where: { userId, correct: true },
      _count: { _all: true },
    });
    const byClip: Record<string, string[]> = {};
    for (const r of rows) (byClip[r.clipId] ??= []).push(r.word);
    return { byClip };
  }

  // ---------- Админ ----------

  async adminList() {
    const clips = await this.prisma.listeningClip.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      include: { _count: { select: { attempts: true } } },
    });
    return clips.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      youtubeId: c.youtubeId,
      startSec: c.startSec,
      endSec: c.endSec,
      levelCode: c.levelCode,
      isPublished: c.isPublished,
      order: c.order,
      segmentCount: (c.segments as unknown as Segment[]).length,
      words: candidateWords(c.wordCounts as Record<string, number>),
      attempts: c._count.attempts,
      createdAt: c.createdAt,
    }));
  }

  async adminCreate(dto: CreateClipDto) {
    const youtubeId = parseYoutubeId(dto.youtube);
    if (!youtubeId) throw new BadRequestException('YouTube холбоос буруу байна');
    if (dto.endSec <= dto.startSec + 5) throw new BadRequestException('Дуусах цаг эхлэх цагаас дор хаяж 5 секундээр их байх ёстой');
    const { segments, wordCounts } = await this.buildTranscript(youtubeId, dto.startSec, dto.endSec);
    const last = await this.prisma.listeningClip.findFirst({ orderBy: { order: 'desc' }, select: { order: true } });
    this.warmClip(segments, wordCounts);
    return this.prisma.listeningClip.create({
      data: {
        title: dto.title?.trim() || `Клип ${youtubeId}`,
        description: dto.description?.trim() || null,
        youtubeId,
        startSec: dto.startSec,
        endSec: dto.endSec,
        levelCode: dto.levelCode ?? LevelCode.A2,
        isPublished: dto.isPublished ?? true,
        order: (last?.order ?? 0) + 1,
        segments: segments as unknown as Prisma.InputJsonValue,
        wordCounts: wordCounts as Prisma.InputJsonValue,
      },
    });
  }

  async adminUpdate(id: string, dto: UpdateClipDto) {
    const clip = await this.prisma.listeningClip.findUnique({ where: { id } });
    if (!clip) throw new NotFoundException('Клип олдсонгүй');
    const startSec = dto.startSec ?? clip.startSec;
    const endSec = dto.endSec ?? clip.endSec;
    if (endSec <= startSec + 5) throw new BadRequestException('Дуусах цаг эхлэх цагаас дор хаяж 5 секундээр их байх ёстой');
    const timeChanged = startSec !== clip.startSec || endSec !== clip.endSec;
    const transcript = timeChanged ? await this.buildTranscript(clip.youtubeId, startSec, endSec) : null;
    if (transcript) this.warmClip(transcript.segments, transcript.wordCounts);
    return this.prisma.listeningClip.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.description !== undefined ? { description: dto.description.trim() || null } : {}),
        ...(dto.levelCode !== undefined ? { levelCode: dto.levelCode } : {}),
        ...(dto.isPublished !== undefined ? { isPublished: dto.isPublished } : {}),
        ...(dto.order !== undefined ? { order: dto.order } : {}),
        startSec,
        endSec,
        ...(transcript
          ? { segments: transcript.segments as unknown as Prisma.InputJsonValue, wordCounts: transcript.wordCounts as Prisma.InputJsonValue }
          : {}),
      },
    });
  }

  async adminRefetch(id: string) {
    const clip = await this.prisma.listeningClip.findUnique({ where: { id } });
    if (!clip) throw new NotFoundException('Клип олдсонгүй');
    const t = await this.buildTranscript(clip.youtubeId, clip.startSec, clip.endSec);
    this.warmClip(t.segments, t.wordCounts);
    return this.prisma.listeningClip.update({
      where: { id },
      data: { segments: t.segments as unknown as Prisma.InputJsonValue, wordCounts: t.wordCounts as Prisma.InputJsonValue },
    });
  }

  async adminDelete(id: string) {
    await this.prisma.listeningClip.delete({ where: { id } }).catch(() => {
      throw new NotFoundException('Клип олдсонгүй');
    });
    return { ok: true };
  }

  /** Transcript татаж клипийн хүрээгээр тайраад үгийн давтамж тоолно */
  async buildTranscript(youtubeId: string, startSec: number, endSec: number) {
    let all: Segment[];
    try {
      all = await fetchTranscript(youtubeId);
    } catch (err) {
      this.logger.warn(`transcript fetch failed for ${youtubeId}: ${err instanceof Error ? err.message : String(err)}`);
      throw new BadRequestException('Энэ видеоны transcript (хадмал) татаж чадсангүй. Англи хадмалтай видео сонгоно уу.');
    }
    const segments = sliceSegments(all, startSec, endSec);
    if (segments.length < 3) throw new BadRequestException('Сонгосон хугацаанд хадмал олдсонгүй (хэт богино эсвэл хадмалгүй хэсэг)');
    const wordCounts = countWords(segments);
    if (candidateWords(wordCounts).length === 0) throw new BadRequestException('Энэ хэсэгт давтагдах үг цөөн байна — урт хэсэг сонгоно уу');
    return { segments, wordCounts };
  }
}
