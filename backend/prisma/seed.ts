import { PrismaClient, LevelCode, ModuleType } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

// 8 түвшин: A1 -> C2 хүртэлх дараалал (даалгаварт A1-B2 гэсэн ч бүтэц C2 хүртэл өргөтгөх боломжтой)
const LEVELS: { code: LevelCode; title: string; description: string; order: number }[] = [
  { code: 'A1', title: 'A1 — Анхан шат', description: 'Хамгийн анхан шатны үг хэллэг, энгийн өгүүлбэр', order: 1 },
  { code: 'A2', title: 'A2 — Анхан шат дэвшсэн', description: 'Өдөр тутмын энгийн харилцаа', order: 2 },
  { code: 'B1', title: 'B1 — Дунд шат', description: 'Бие даан санаагаа илэрхийлэх чадвар', order: 3 },
  { code: 'B1_PLUS', title: 'B1+ — Дунд шат дэвшсэн', description: 'Илүү нарийн бүтэцтэй өгүүлбэр', order: 4 },
  { code: 'B2', title: 'B2 — Дунд ахисан шат', description: 'Чөлөөтэй харилцах, нарийвчилсан санаа илэрхийлэх', order: 5 },
  { code: 'B2_PLUS', title: 'B2+ — Дунд ахисан шат дэвшсэн', description: 'Мэргэжлийн орчинд ойртсон хэллэг', order: 6 },
  { code: 'C1', title: 'C1 — Ахисан шат', description: 'Нарийн төвөгтэй сэдвээр чөлөөтэй ярих', order: 7 },
  { code: 'C2', title: 'C2 — Мэргэшсэн шат', description: 'Төрөлх хэлтэй ойролцоо түвшин', order: 8 },
];

// 8 модулийн тогтмол тодорхойлолт (бүх Unit-д давтагдана)
const MODULES: { type: ModuleType; code: string; title: string; description: string; order: number }[] = [
  {
    type: 'GRAMMAR',
    code: '001',
    title: 'Дүрэм',
    description: 'Яг таны түвшинд тохирсон, амьдрал дээр шууд хэрэглэгдэх практик хичээлүүд.',
    order: 1,
  },
  {
    type: 'READING',
    code: '002',
    title: 'Унших',
    description: 'Цаг үеийн бодит мэдээнүүдийг хэрхэн зөв бүтцээр нь ойлгож, уншиж сурах алхамчилсан унших дасгалууд.',
    order: 2,
  },
  {
    type: 'DICTATION_QUIZ',
    code: '003',
    title: 'Dictation & Quiz',
    description: 'Цээж бичиг хийн чихээ онгойлгох дасгалууд.',
    order: 3,
  },
  {
    type: 'SHADOWING',
    code: '004',
    title: 'Shadowing',
    description: '"Friends" цувралын дүрүүдийн яриаг шууд даган дуурайж, дуудлага, өргөлтөө үр дүнтэйгээр сайжруулна.',
    order: 4,
  },
  {
    type: 'SPEAKING',
    code: '005',
    title: 'Ярих',
    description: 'Хиймэл оюун ухаантай харилцан ярьж алдаагаа тухай бүртээ засуулж, улам илүү зоригтой ярьдаг болно.',
    order: 5,
  },
  {
    type: 'WRITING',
    code: '006',
    title: 'Бичих',
    description: 'Таны бичсэнийг мэргэжлийн багш мэт нягтлан шалгаж, хэллэг болон дүрмийн алдааг нь засч, илүү дээр хувилбаруудыг санал болгоно.',
    order: 6,
  },
  {
    type: 'SENTENCE_SORT',
    code: '007',
    title: 'Sentence Sort',
    description: 'Үгсийг зөв дараалалд оруулж, англи өгүүлбэрийн бүтцийг тоглоом тоглонгоо эзэмшинэ.',
    order: 7,
  },
  {
    type: 'VOCABULARY',
    code: '008',
    title: 'Үгийн сан',
    description: 'Шинэ үгсийг зүгээр цээжлээд өнгөрөх биш, өгүүлбэр болон утга санааны уялдаагаар нь ойлгож тогтооно.',
    order: 8,
  },
];

async function main() {
  console.log('🌱 Seeding ColorEnglish database...');

  for (const levelData of LEVELS) {
    const level = await prisma.level.upsert({
      where: { code: levelData.code },
      update: {},
      create: levelData,
    });

    // Түвшин бүрт нэг танилцуулга Unit үүсгээд, дотор нь 8 модулийг байрлуулна
    const unit = await prisma.unit.upsert({
      where: { levelId_order: { levelId: level.id, order: 1 } },
      update: {},
      create: {
        levelId: level.id,
        title: `${level.code} - Эхний бүлэг`,
        description: `${level.title} түвшний эхний хичээлийн бүлэг`,
        order: 1,
      },
    });

    for (const moduleData of MODULES) {
      await prisma.lessonModule.upsert({
        where: { unitId_type: { unitId: unit.id, type: moduleData.type } },
        update: {},
        create: {
          unitId: unit.id,
          type: moduleData.type,
          code: moduleData.code,
          title: moduleData.title,
          description: moduleData.description,
          order: moduleData.order,
        },
      });
    }

    // Unit бүрт нэг шалгалт (placeholder) үүсгэнэ
    await prisma.exam.upsert({
      where: { unitId: unit.id },
      update: {},
      create: {
        unitId: unit.id,
        title: `${level.code} — Түвшин дэвших шалгалт`,
        passScore: 80,
        timeLimitMin: 20,
      },
    });

    console.log(`✅ ${level.code} түвшин — 8 модультайгаар бэлэн боллоо`);
  }

  // Admin хэрэглэгч (контент удирдах)
  const adminEmail = 'admin@colorenglish.mn';
  const adminPassword = 'Admin123!';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: await argon2.hash(adminPassword),
        firstName: 'Admin',
        role: 'ADMIN',
        isEmailVerified: true,
        profile: { create: { onboardingCompleted: true, currentLevel: 'A1' } },
        streak: { create: {} },
        subscription: { create: { plan: 'VIP_6_MONTHS', status: 'ACTIVE' } },
      },
    });
    console.log(`👤 Admin: ${adminEmail} / ${adminPassword}`);
  }

  const sampleBody =
    'Tom is a young boy. He lives in a small town with his family. Every morning, Tom walks to school with his friends. He likes reading books and playing football after class.';

  const sampleGlosses: Record<string, string> = {
    tom: 'Том (нэр)',
    boy: 'хүү',
    lives: 'амьдардаг',
    small: 'жижиг',
    town: 'хот, балгас',
    family: 'гэр бүл',
    morning: 'өглөө',
    walks: 'алхдаг',
    school: 'сургууль',
    friends: 'найзууд',
    likes: 'дуртай',
    reading: 'унших',
    books: 'номнууд',
    playing: 'тоглох',
    football: 'хөлбөмбөг',
  };

  function findFirstOccurrence(body: string, word: string) {
    const re = new RegExp(`\\b${word}\\b`, 'i');
    const m = re.exec(body);
    if (!m) return null;
    const start = m.index;
    const end = start + m[0].length;
    return { startOffset: start, endOffset: end, contextSentence: body };
  }

  const existingStory = await prisma.readingStory.findFirst({ where: { title: "Tom's Morning" } });
  if (!existingStory) {
    const words = Object.entries(sampleGlosses)
      .map(([word, meaningMn]) => {
        const occ = findFirstOccurrence(sampleBody, word);
        if (!occ) return null;
        return {
          word,
          meaningMn,
          startOffset: occ.startOffset,
          endOffset: occ.endOffset,
          contextSentence: occ.contextSentence,
        };
      })
      .filter(Boolean) as Array<{
      word: string;
      meaningMn: string;
      startOffset: number;
      endOffset: number;
      contextSentence: string;
    }>;

    const story = await prisma.readingStory.create({
      data: {
        title: "Tom's Morning",
        body: sampleBody,
        description: 'A short A1 story about Tom’s morning routine.',
        author: 'ColorEnglish',
        levelCode: 'A1',
        order: 1,
        isPublished: true,
        chapters: {
          create: {
            title: 'Chapter 1',
            body: sampleBody,
            order: 1,
          },
        },
      },
      include: { chapters: true },
    });

    const chapterId = story.chapters[0]?.id;
    if (chapterId && words.length > 0) {
      await prisma.readingWord.createMany({
        data: words.map((w) => ({
          ...w,
          storyId: story.id,
          chapterId,
        })),
      });
    }
    console.log(`📖 Sample reading story: ${story.title}`);
  }

  console.log('🎉 Seed дууслаа!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
