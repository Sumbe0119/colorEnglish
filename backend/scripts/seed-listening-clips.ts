// backend/scripts/seed-listening-clips.ts
// Сонсох тоглоомын эхний клипүүдийг нэмнэ: YouTube-ээс transcript татаж, давтагдах үг хамгийн олонтой
// ~100 секундийн хэсгийг автоматаар сонгоно. Аль хэдийн байгаа (youtubeId) клипийг алгасна.
//
// Ажиллуулах:
//   cd backend
//   npx dotenv -e .env.local -- npx ts-node -P tsconfig.json scripts/seed-listening-clips.ts
import { LevelCode, Prisma, PrismaClient } from '@prisma/client';
import { candidateWords, countWords, fetchTranscript, Segment, sliceSegments } from '../src/listening/transcript';

const prisma = new PrismaClient();

const CANDIDATES: { id: string; level: LevelCode; description: string }[] = [
  { id: '8S0FDjFBj8o', level: LevelCode.B1, description: 'TED илтгэл: сонсох чадвараа хэрхэн сайжруулах тухай.' },
  { id: 'arj7oStGLkU', level: LevelCode.B1, description: 'TED илтгэл: хойшлуулагч хүний тархинд юу болдог вэ.' },
  { id: 'UF8uR6Z6KLc', level: LevelCode.B1, description: 'Steve Jobs-ийн Стэнфордын төгсөлтийн үг (2005).' },
  { id: 'H14bBuluwB8', level: LevelCode.B1, description: 'TED илтгэл: амжилтын түлхүүр — тууштай зан (grit).' },
  { id: 'u4ZoJKF_VuA', level: LevelCode.B2, description: 'TED илтгэл: агуу манлайлагчид хэрхэн урам өгдөг вэ.' },
  { id: 'Ks-_Mh1QhMc', level: LevelCode.B2, description: 'TED илтгэл: биеийн хэлэмж таныг хэрхэн өөрчилдөг вэ.' },
  { id: 'c0KYU2j0TM4', level: LevelCode.A2, description: 'TED илтгэл: 30 хоног шинэ зүйл туршиж үзэх.' },
  { id: 'iCvmsMzlF7o', level: LevelCode.B2, description: 'TED илтгэл: эмзэг байдлын хүч.' },
];

const WINDOW_SEC = 100;

async function fetchTitle(id: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string };
    return data.title ?? null;
  } catch {
    return null;
  }
}

/** Давтагдах үг хамгийн олонтой цонхыг сонгоно (эхний 20 секундийг алгасна — танилцуулга) */
function bestWindow(all: Segment[]): { start: number; end: number; score: number } | null {
  let best: { start: number; end: number; score: number } | null = null;
  for (const s of all) {
    if (s.start < 20) continue;
    const start = Math.floor(s.start);
    const end = start + WINDOW_SEC;
    const segs = sliceSegments(all, start, end);
    if (segs.length < 8) continue;
    const words = candidateWords(countWords(segs));
    const score = words.reduce((a, w) => a + Math.min(w.count, 8), 0) + words.filter((w) => w.count >= 3).length * 3;
    if (!best || score > best.score) best = { start, end, score };
  }
  return best;
}

async function main() {
  let order = (await prisma.listeningClip.findFirst({ orderBy: { order: 'desc' } }))?.order ?? 0;
  for (const c of CANDIDATES) {
    const exists = await prisma.listeningClip.findFirst({ where: { youtubeId: c.id } });
    if (exists) {
      console.log(`skip (exists): ${c.id}`);
      continue;
    }
    const title = await fetchTitle(c.id);
    if (!title) {
      console.log(`skip (no oEmbed title / video missing): ${c.id}`);
      continue;
    }
    let all: Segment[];
    try {
      all = await fetchTranscript(c.id);
    } catch (err) {
      console.log(`skip (no transcript): ${c.id} — ${err instanceof Error ? err.message : err}`);
      continue;
    }
    const win = bestWindow(all);
    if (!win) {
      console.log(`skip (no good window): ${c.id}`);
      continue;
    }
    const segments = sliceSegments(all, win.start, win.end);
    const wordCounts = countWords(segments);
    const words = candidateWords(wordCounts);
    order += 1;
    await prisma.listeningClip.create({
      data: {
        title,
        description: c.description,
        youtubeId: c.id,
        startSec: win.start,
        endSec: win.end,
        levelCode: c.level,
        isPublished: true,
        order,
        segments: segments as unknown as Prisma.InputJsonValue,
        wordCounts: wordCounts as Prisma.InputJsonValue,
      },
    });
    console.log(`added: ${title} [${c.id}] ${win.start}-${win.end}s, ${segments.length} lines, words: ${words.map((w) => `${w.word}×${w.count}`).join(', ')}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
