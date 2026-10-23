// backend/src/placement-test/placement-test.bank.ts
// Түвшин тогтоох тестийн асуултын сан + дүгнэх логик (цэвэр функцүүд, DB-гүй).
// Зөв хариулт, тайлбар зөвхөн сервер талд байна — төлбөр төлөгдсөний дараа л клиент рүү явна.
import { LevelCode } from '@prisma/client';

/** Асуултын сангийн хувилбар — асуулт нэмэх/солих бүрт нэмэгдүүлнэ */
export const PLACEMENT_BANK_VERSION = 1;

export type PlacementBand = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type PlacementSkill = 'GRAMMAR' | 'VOCABULARY' | 'READING';

export const PLACEMENT_BANDS: PlacementBand[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const PLACEMENT_SKILLS: PlacementSkill[] = ['GRAMMAR', 'VOCABULARY', 'READING'];

export type PlacementQuestion = {
  id: string;
  band: PlacementBand;
  skill: PlacementSkill;
  /** Унших даалгаврын богино эх (зөвхөн READING) */
  passage?: string;
  /** Асуулт / нөхөх өгүүлбэр ("___" — хоосон зай) */
  prompt: string;
  options: string[];
  /** Зөв хариултын индекс (options дотор) */
  answer: number;
  /** Монгол тайлбар — төлбөрийн дараа харуулна */
  explanation: string;
};

/** Клиент рүү явах хэлбэр — зөв хариулт, тайлбаргүй */
export type PlacementQuestionPublic = Omit<PlacementQuestion, 'answer' | 'explanation'>;

/** Нэг түвшинд 8 асуулт: 4 дүрэм, 3 үгийн сан, 1 унших */
export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // ───────────── A1 ─────────────
  {
    id: 'a1-01',
    band: 'A1',
    skill: 'GRAMMAR',
    prompt: 'I ___ a student.',
    options: ['am', 'is', 'are', 'be'],
    answer: 0,
    explanation: '"I" төлөөний үгтэй "be" үйл үг одоо цагт "am" хэлбэртэй байна: I am, you are, he/she/it is.',
  },
  {
    id: 'a1-02',
    band: 'A1',
    skill: 'GRAMMAR',
    prompt: 'She ___ from Mongolia.',
    options: ['are', 'is', 'am', 'be'],
    answer: 1,
    explanation: 'Ганц тооны 3-р бие (he, she, it) "is" авна: She is from Mongolia.',
  },
  {
    id: 'a1-03',
    band: 'A1',
    skill: 'GRAMMAR',
    prompt: '___ you like coffee?',
    options: ['Is', 'Are', 'Do', 'Does'],
    answer: 2,
    explanation: 'Present Simple-ийн асуултыг "do/does" туслах үйл үгээр үүсгэнэ. "You"-тэй "do": Do you like coffee?',
  },
  {
    id: 'a1-04',
    band: 'A1',
    skill: 'GRAMMAR',
    prompt: 'There ___ two cats on the sofa.',
    options: ['is', 'am', 'be', 'are'],
    answer: 3,
    explanation: '"Two cats" олон тоо тул "there are" хэрэглэнэ. Ганц тоонд "there is" байна.',
  },
  {
    id: 'a1-05',
    band: 'A1',
    skill: 'VOCABULARY',
    prompt: 'The opposite of "big" is ___.',
    options: ['tall', 'small', 'old', 'long'],
    answer: 1,
    explanation: '"Big" (том) үгийн эсрэг утгатай үг нь "small" (жижиг).',
  },
  {
    id: 'a1-06',
    band: 'A1',
    skill: 'VOCABULARY',
    prompt: "My mother's sister is my ___.",
    options: ['uncle', 'brother', 'aunt', 'son'],
    answer: 2,
    explanation: 'Ээжийн эгч/дүү нь "aunt" (нагац эгч). "Uncle" нь нагац/авга ах, "brother" ах/дүү, "son" хүү.',
  },
  {
    id: 'a1-07',
    band: 'A1',
    skill: 'VOCABULARY',
    prompt: "Can you ___ the door, please? It's cold.",
    options: ['close', 'open', 'go', 'eat'],
    answer: 0,
    explanation: 'Хүйтэн байгаа тул хаалгыг "close" (хаах) гэж хүснэ. "Open" нээх гэсэн утгатай.',
  },
  {
    id: 'a1-08',
    band: 'A1',
    skill: 'READING',
    passage:
      'Tom is a doctor. He works in a big hospital in London. He gets up at six o\'clock and goes to work by bus. He likes his job very much.',
    prompt: 'How does Tom go to work?',
    options: ['By car', 'By bus', 'By train', 'On foot'],
    answer: 1,
    explanation: 'Эхэд "goes to work by bus" гэж байна — Том ажилдаа автобусаар явдаг.',
  },

  // ───────────── A2 ─────────────
  {
    id: 'a2-01',
    band: 'A2',
    skill: 'GRAMMAR',
    prompt: 'Yesterday I ___ to the cinema with my friends.',
    options: ['go', 'gone', 'went', 'going'],
    answer: 2,
    explanation: '"Yesterday" өнгөрсөн цагийг заана. "Go"-ийн Past Simple хэлбэр нь "went".',
  },
  {
    id: 'a2-02',
    band: 'A2',
    skill: 'GRAMMAR',
    prompt: 'She is ___ than her brother.',
    options: ['taller', 'tall', 'tallest', 'more tall'],
    answer: 0,
    explanation: 'Харьцуулсан зэрэг: нэг үетэй тэмдэг нэрд "-er" залгана — tall → taller. "Than"-ийн өмнө харьцуулсан зэрэг ирнэ.',
  },
  {
    id: 'a2-03',
    band: 'A2',
    skill: 'GRAMMAR',
    prompt: 'I ___ TV when the phone rang.',
    options: ['watch', 'watched', 'am watching', 'was watching'],
    answer: 3,
    explanation: 'Өнгөрсөнд үргэлжилж байсан үйлдлийг өөр үйлдэл тасалсан → Past Continuous: "I was watching TV when the phone rang."',
  },
  {
    id: 'a2-04',
    band: 'A2',
    skill: 'GRAMMAR',
    prompt: "You ___ wear a seatbelt in the car. It's the law.",
    options: ['might', 'must', 'can', 'would'],
    answer: 1,
    explanation: 'Хууль, заавал биелүүлэх үүргийг "must" илэрхийлнэ. "Might" магадлал, "can" боломж заана.',
  },
  {
    id: 'a2-05',
    band: 'A2',
    skill: 'VOCABULARY',
    prompt: "I'm ___ because I didn't sleep last night.",
    options: ['hungry', 'angry', 'tired', 'bored'],
    answer: 2,
    explanation: 'Унтаагүй учраас "tired" (ядарсан). Hungry — өлссөн, angry — уурласан, bored — уйдсан.',
  },
  {
    id: 'a2-06',
    band: 'A2',
    skill: 'VOCABULARY',
    prompt: 'We ___ a great time at the party.',
    options: ['had', 'made', 'did', 'took'],
    answer: 0,
    explanation: '"Have a good/great time" — сайхан цагийг өнгөрөөх гэсэн тогтсон хэллэг. Өнгөрсөн цагт "had".',
  },
  {
    id: 'a2-07',
    band: 'A2',
    skill: 'VOCABULARY',
    prompt: 'He ___ the bus, so he was late for work.',
    options: ['lost', 'failed', 'left', 'missed'],
    answer: 3,
    explanation: 'Автобус, галт тэрэгнээс хоцрохыг "miss" гэнэ: miss the bus. "Lose" нь алдах, гээх утгатай.',
  },
  {
    id: 'a2-08',
    band: 'A2',
    skill: 'READING',
    passage:
      "Dear Anna, Thank you for your email. I'd love to come to your birthday party on Saturday, but I have to work until 6 p.m. Is it OK if I arrive a little late, around 7? I'll bring a cake. See you soon, Maria.",
    prompt: 'Why will Maria be late?',
    options: ['She is making a cake', 'She has to work', "She doesn't like parties", 'She lives far away'],
    answer: 1,
    explanation: '"I have to work until 6 p.m." — Мариа 6 цаг хүртэл ажиллах ёстой учраас хоцорно.',
  },

  // ───────────── B1 ─────────────
  {
    id: 'b1-01',
    band: 'B1',
    skill: 'GRAMMAR',
    prompt: "I've lived in Ulaanbaatar ___ 2015.",
    options: ['for', 'since', 'from', 'during'],
    answer: 1,
    explanation: 'Present Perfect-тэй эхлэх цэгийг (он, сар, өдөр) "since", үргэлжилсэн хугацааг (3 жил) "for" заана.',
  },
  {
    id: 'b1-02',
    band: 'B1',
    skill: 'GRAMMAR',
    prompt: 'If it rains tomorrow, we ___ at home.',
    options: ['stayed', 'would stay', 'stay', 'will stay'],
    answer: 3,
    explanation: 'Нэгдүгээр нөхцөлт өгүүлбэр (бодит ирээдүй): If + Present Simple, үндсэн өгүүлбэрт "will + V".',
  },
  {
    id: 'b1-03',
    band: 'B1',
    skill: 'GRAMMAR',
    prompt: 'This bridge ___ in 1932.',
    options: ['was built', 'built', 'has built', 'is building'],
    answer: 0,
    explanation: 'Гүүрийг хэн нэгэн барьсан (үйлийн эзэн чухал биш) → Past Simple Passive: was/were + V3.',
  },
  {
    id: 'b1-04',
    band: 'B1',
    skill: 'GRAMMAR',
    prompt: 'She asked me where ___.',
    options: ['did I live', 'do I live', 'I lived', 'I live'],
    answer: 2,
    explanation: 'Шууд бус асуултад асуултын дараалал байхгүй (did байхгүй), цаг нэг шат ухарна: "Where do you live?" → asked where I lived.',
  },
  {
    id: 'b1-05',
    band: 'B1',
    skill: 'VOCABULARY',
    prompt: 'I need to ___ my English before the interview.',
    options: ['give up', 'look up', 'brush up', 'put up'],
    answer: 2,
    explanation: '"Brush up (on)" — мартагдсан мэдлэгээ сэргээх. Give up — болих, look up — үг хайх, put up — байрлуулах/тэвчих.',
  },
  {
    id: 'b1-06',
    band: 'B1',
    skill: 'VOCABULARY',
    prompt: 'The meeting was ___ because the manager was ill.',
    options: ['put off', 'put on', 'put out', 'put up'],
    answer: 0,
    explanation: '"Put off" — хойшлуулах. Put on — өмсөх, put out — унтраах, put up — өлгөх/байрлуулах.',
  },
  {
    id: 'b1-07',
    band: 'B1',
    skill: 'VOCABULARY',
    prompt: "She's a very ___ person — she always arrives on time.",
    options: ['patient', 'polite', 'proud', 'punctual'],
    answer: 3,
    explanation: 'Цагаа барьдаг хүнийг "punctual" гэнэ. Patient — тэвчээртэй, polite — эелдэг, proud — бардам.',
  },
  {
    id: 'b1-08',
    band: 'B1',
    skill: 'READING',
    passage:
      'Many people think that learning a language is only about memorising words and grammar rules. However, research shows that regular exposure — listening to podcasts, watching films, or reading simple books — is just as important. Learners who spend even twenty minutes a day with real English tend to improve faster than those who only study textbooks.',
    prompt: 'What is the main idea of the text?',
    options: [
      'Grammar rules are not important',
      'Regular contact with real English matters as much as studying rules',
      'Textbooks are the best way to learn',
      'Podcasts are better than films',
    ],
    answer: 1,
    explanation: 'Эхийн гол санаа: үг, дүрэм цээжлэхээс гадна бодит англи хэлтэй тогтмол харьцах нь мөн адил чухал.',
  },

  // ───────────── B2 ─────────────
  {
    id: 'b2-01',
    band: 'B2',
    skill: 'GRAMMAR',
    prompt: 'By the time we arrived, the film ___.',
    options: ['already started', 'has already started', 'had already started', 'was already starting'],
    answer: 2,
    explanation: 'Өнгөрсөн дэх өөр үйлдлээс өмнө болж дууссан үйлдэл → Past Perfect: had + V3.',
  },
  {
    id: 'b2-02',
    band: 'B2',
    skill: 'GRAMMAR',
    prompt: 'I wish I ___ more time to travel.',
    options: ['have', 'had', 'would have', 'will have'],
    answer: 1,
    explanation: 'Одоогийн бодит бус хүслийг "wish + Past Simple" илэрхийлнэ: I wish I had more time.',
  },
  {
    id: 'b2-03',
    band: 'B2',
    skill: 'GRAMMAR',
    prompt: '___ he was tired, he kept on working.',
    options: ['Despite', 'However', 'Because', 'Although'],
    answer: 3,
    explanation: '"Although" + бүтэн өгүүлбэр (he was tired). "Despite"-ийн дараа нэр үг/-ing ирнэ (despite being tired).',
  },
  {
    id: 'b2-04',
    band: 'B2',
    skill: 'GRAMMAR',
    prompt: "You ___ have told me earlier — now it's too late.",
    options: ['should', 'must', 'can', 'would'],
    answer: 0,
    explanation: '"Should have + V3" — өнгөрсөнд хийх ёстой байсан ч хийгээгүй үйлдлийг шүүмжлэхэд хэрэглэнэ.',
  },
  {
    id: 'b2-05',
    band: 'B2',
    skill: 'VOCABULARY',
    prompt: 'The company ___ a new product last month.',
    options: ['raised', 'launched', 'entered', 'grew'],
    answer: 1,
    explanation: 'Шинэ бүтээгдэхүүн зах зээлд гаргахыг "launch a product" гэнэ.',
  },
  {
    id: 'b2-06',
    band: 'B2',
    skill: 'VOCABULARY',
    prompt: 'His explanation was so ___ that nobody understood it.',
    options: ['clear', 'brief', 'vague', 'obvious'],
    answer: 2,
    explanation: 'Хэн ч ойлгоогүй тул тайлбар "vague" (тодорхойгүй, бүрхэг) байсан. Clear, obvious — тодорхой.',
  },
  {
    id: 'b2-07',
    band: 'B2',
    skill: 'VOCABULARY',
    prompt: 'She ___ the job offer because the salary was too low.',
    options: ['turned down', 'turned up', 'turned over', 'turned into'],
    answer: 0,
    explanation: '"Turn down" — татгалзах. Turn up — гарч ирэх, turn over — эргүүлэх, turn into — болж хувирах.',
  },
  {
    id: 'b2-08',
    band: 'B2',
    skill: 'READING',
    passage:
      'Remote work has transformed the modern office. While some employers worry that productivity suffers when staff work from home, several large studies have found the opposite: employees often work longer hours and report higher job satisfaction. Nevertheless, critics point out that informal conversations — the kind that spark new ideas — are harder to replicate online.',
    prompt: 'What concern about remote work does the text mention?',
    options: [
      'Employees work fewer hours',
      'Job satisfaction decreases',
      'Spontaneous idea-sharing is harder online',
      'Offices are becoming too expensive',
    ],
    answer: 2,
    explanation: 'Сүүлийн өгүүлбэрт: шинэ санаа төрүүлдэг албан бус яриаг онлайнаар давтахад хэцүү гэж шүүмжилдэг.',
  },

  // ───────────── C1 ─────────────
  {
    id: 'c1-01',
    band: 'C1',
    skill: 'GRAMMAR',
    prompt: '___ had I sat down than the phone rang.',
    options: ['Hardly', 'No sooner', 'Scarcely', 'Barely'],
    answer: 1,
    explanation: '"Than"-тай хослодог нь зөвхөн "No sooner ... than". Hardly/Scarcely/Barely нь "when"-тэй явна.',
  },
  {
    id: 'c1-02',
    band: 'C1',
    skill: 'GRAMMAR',
    prompt: "It's high time the government ___ action on climate change.",
    options: ['takes', 'will take', 'took', 'has taken'],
    answer: 2,
    explanation: '"It\'s (high) time + Past Simple" — одоо хийх цаг нь болсон гэсэн утгатай тогтсон бүтэц.',
  },
  {
    id: 'c1-03',
    band: 'C1',
    skill: 'GRAMMAR',
    prompt: 'Not only ___ the exam, but she also got the highest mark.',
    options: ['she passed', 'did she pass', 'she did pass', 'passed she'],
    answer: 1,
    explanation: 'Өгүүлбэрийн эхэнд "Not only" ирэхэд урвуу дараалал (inversion) үүснэ: Not only did she pass...',
  },
  {
    id: 'c1-04',
    band: 'C1',
    skill: 'GRAMMAR',
    prompt: '___ the weather, the event would have been a great success.',
    options: ['Despite', 'Unless', 'Provided', 'But for'],
    answer: 3,
    explanation: '"But for + нэр үг" = if it had not been for (… байгаагүй бол). Гуравдугаар нөхцөлт утгатай.',
  },
  {
    id: 'c1-05',
    band: 'C1',
    skill: 'VOCABULARY',
    prompt: "The minister's speech was deliberately ___, avoiding any firm commitments.",
    options: ['explicit', 'ambiguous', 'candid', 'concise'],
    answer: 1,
    explanation: 'Тодорхой амлалтаас зайлсхийсэн → "ambiguous" (хоёрдмол утгатай). Explicit, candid — ил тод, шулуун.',
  },
  {
    id: 'c1-06',
    band: 'C1',
    skill: 'VOCABULARY',
    prompt: 'After years of neglect, the old theatre has been ___ to its former glory.',
    options: ['restored', 'resumed', 'retained', 'reinforced'],
    answer: 0,
    explanation: '"Restore (something) to its former glory" — хуучин сүр жавхлангаа сэргээн засварлах гэсэн тогтсон хэллэг.',
  },
  {
    id: 'c1-07',
    band: 'C1',
    skill: 'VOCABULARY',
    prompt: 'The evidence against him was purely ___; nobody had actually seen him there.',
    options: ['substantial', 'conclusive', 'circumstantial', 'tangible'],
    answer: 2,
    explanation: '"Circumstantial evidence" — шууд бус, нөхцөл байдлын нотолгоо. Conclusive — эцсийн, tangible — биет.',
  },
  {
    id: 'c1-08',
    band: 'C1',
    skill: 'READING',
    passage:
      'The notion that we use only ten percent of our brains is a persistent myth. Brain imaging has repeatedly demonstrated that virtually every region is active at some point during a typical day, and even simple tasks recruit networks distributed across the whole organ. The myth endures, perhaps, because it flatters us with the promise of vast untapped potential.',
    prompt: 'According to the text, why does the myth persist?',
    options: [
      'Brain imaging has confirmed it',
      "It appeals to people's hope of hidden potential",
      'Scientists disagree about it',
      'Simple tasks use little of the brain',
    ],
    answer: 1,
    explanation: 'Сүүлийн өгүүлбэр: домог нь "ашиглаагүй асар их нөөц" гэсэн амлалтаар биднийг магтдаг тул оршсоор байна.',
  },
];

// ──────────────────────────────────────────────
// Дүгнэх логик
// ──────────────────────────────────────────────

/** Нэг түвшний 8 асуултаас "тэнцсэн" гэж үзэх доод босго */
const PASS_CORRECT = 5;
/** "Бараг тэнцсэн" — дараагийн түвшин тэнцсэн бол алгасахыг зөвшөөрнө; "+" түвшин тогтооход ч хэрэглэнэ */
const NEAR_CORRECT = 4;

export type PlacementLevelKey = 'PRE_A1' | 'A1' | 'A2' | 'B1' | 'B1_PLUS' | 'B2' | 'B2_PLUS' | 'C1';

export type PlacementLevelInfo = {
  key: PlacementLevelKey;
  code: LevelCode;
  /** "B1" / "B1+" */
  short: string;
  /** Монгол нэр */
  title: string;
  /** CEFR англи нэр */
  cefr: string;
  description: string;
  recommendations: string[];
  /** ColorEnglish дээр эхлэх хичээлийн зам */
  startHref: string;
  startLabel: string;
};

export const PLACEMENT_LEVELS: Record<PlacementLevelKey, PlacementLevelInfo> = {
  PRE_A1: {
    key: 'PRE_A1',
    code: 'A1',
    short: 'A1',
    title: 'Эхлэгч',
    cefr: 'Starter / Pre-A1',
    description:
      'Та англи хэлийг дөнгөж эхэлж байна. "Be" үйл үг, энгийн мэндчилгээ, өдөр тутмын хамгийн түгээмэл үгсээс эхлэх нь зөв. Санаа зоволтгүй — хүн бүр яг эндээс эхэлдэг.',
    recommendations: [
      'A1 түвшний дүрмийн хичээлийг эхнээс нь дарааллаар үзээрэй: be үйл үг, Present Simple, there is/are.',
      'Өдөр бүр 10 минут хамгийн богино өгүүллэгийг уншиж, мэдэхгүй үг бүр дээр дарж орчуулгыг нь хараарай.',
      '"Өгүүлбэр бүтээх" тоглоомоор үгийн дарааллыг гараараа эвлүүлж дасгалжуулаарай.',
    ],
    startHref: '/rule',
    startLabel: 'A1 дүрмийн хичээлээс эхлэх',
  },
  A1: {
    key: 'A1',
    code: 'A1',
    short: 'A1',
    title: 'Анхан шат',
    cefr: 'Beginner',
    description:
      'Та өөрийгөө танилцуулж, энгийн асуулт асууж, хариулж чадна. Өнгөрсөн цаг, харьцуулсан зэрэг зэрэг A2-ын бүтцүүд дээр алдаа гарч байна.',
    recommendations: [
      'A1 дүрмийг давтаад A2 түвшний хичээл рүү ороорой: Past Simple, харьцуулсан зэрэг, can/must.',
      'A1–A2 түвшний өгүүллэгүүдийг уншиж, өгүүлбэрийн эзэн–үйл үг–тусагдахууны өнгөний кодыг анзаараарай.',
      '"Бичих уралдаан" тоглоомоор түгээмэл үгсийг хурдан танин бичих дадал суулгаарай.',
    ],
    startHref: '/rule',
    startLabel: 'A1 дүрмээ бататгаад A2 руу',
  },
  A2: {
    key: 'A2',
    code: 'A2',
    short: 'A2',
    title: 'Анхан шат дэвшсэн',
    cefr: 'Elementary',
    description:
      'Өдөр тутмын танил нөхцөлд энгийн өгүүлбэрээр харилцаж чадна. Present Perfect, нөхцөлт өгүүлбэр, passive зэрэг B1-ийн бүтцийг хараахан тогтвортой хэрэглэхгүй байна.',
    recommendations: [
      'A2 түвшний дүрмийн хичээлүүдийг гүйцээж, B1-ийн Present Perfect, нөхцөлт өгүүлбэр, Passive руу шилжээрэй.',
      'A2–B1 түвшний өгүүллэгийг өдөрт нэг бүлэг уншиж, шинэ үгсээ "Цээжилсэн үгс" рүү нэмээрэй.',
      'Унших, сонсохоо хослуулаарай: өгүүллэгийг дуу хоолойгоор сонсоод давтан уншина.',
    ],
    startHref: '/rule/a2',
    startLabel: 'A2 дүрмийн хичээлээс эхлэх',
  },
  B1: {
    key: 'B1',
    code: 'B1',
    short: 'B1',
    title: 'Дунд шат',
    cefr: 'Intermediate',
    description:
      'Танил сэдвээр бие даан санаагаа илэрхийлж, холбоотой эх уншиж ойлгож чадна. Past Perfect, wish, холбоос үг зэрэг B2-ын нарийн бүтцүүд дээр алдаа гарч байна.',
    recommendations: [
      'B1 түвшний дүрмийн хичээлийг гүйцээж, Past Perfect, wish/if only, although/despite зэрэг B2 бүтцүүдийг давтаарай.',
      'B1 түвшний бүрэн хэмжээний өгүүллэгүүдийг хадмалгүй уншиж, phrasal verb-үүдийг тэмдэглэж аваарай.',
      'Үгийн санг контекстоор нь сурахыг хичээгээрэй — нэг үгийг 3 өөр өгүүлбэрт хэрэглэж бичиж үзээрэй.',
    ],
    startHref: '/rule/b1',
    startLabel: 'B1 дүрмийн хичээлээс эхлэх',
  },
  B1_PLUS: {
    key: 'B1_PLUS',
    code: 'B1_PLUS',
    short: 'B1+',
    title: 'Дунд шат дэвшсэн',
    cefr: 'Intermediate+',
    description:
      'B1-ийн бүтцийг тогтвортой хэрэглэж, B2-ын зарим бүтцийг аль хэдийн мэдэрч байна. Нарийн утгын ялгаа, тогтсон хэллэг, phrasal verb дээр түлхүү ажиллах шаардлагатай.',
    recommendations: [
      'B1 дүрмийн сүүлийн хичээлүүдийг гүйцээгээд B2-ын хичээл рүү шууд ороорой.',
      'B1–B2 түвшний өгүүллэгийг хурдтай уншиж, таамаглан ойлгох чадвараа сорьоорой.',
      'Унших эхээс үг биш хэллэг (collocation) түүж цээжлээрэй: launch a product, turn down an offer.',
    ],
    startHref: '/rule/b1',
    startLabel: 'B1 дүрмээ гүйцээгээд B2 руу',
  },
  B2: {
    key: 'B2',
    code: 'B2',
    short: 'B2',
    title: 'Дунд ахисан шат',
    cefr: 'Upper-Intermediate',
    description:
      'Ихэнх нөхцөлд чөлөөтэй харилцаж, нарийн төвөгтэй эх уншиж ойлгоно. Урвуу дараалал (inversion), албан хэллэг, нарийн утгын ялгаатай үгс зэрэг C1-ийн зүйлс дээр алдаа гарч байна.',
    recommendations: [
      'ColorEnglish-ийн B2 түвшний өгүүллэг, дүрмийн хичээлүүд танд яг тохирно — эндээс эхлээрэй.',
      'Уншихдаа хадмал орчуулгыг аль болох хаалттай байлгаж, зөвхөн шаардлагатай үг дээр дараарай.',
      'Inversion, cleft sentence, албан бичгийн хэллэгийг зориуд ажиглаж, өөрийн бичвэрт хэрэглэж үзээрэй.',
    ],
    startHref: '/reading',
    startLabel: 'B2 түвшний өгүүллэгээс эхлэх',
  },
  B2_PLUS: {
    key: 'B2_PLUS',
    code: 'B2_PLUS',
    short: 'B2+',
    title: 'Дунд ахисан шат дэвшсэн',
    cefr: 'Upper-Intermediate+',
    description:
      'B2-ын бүтцийг чөлөөтэй хэрэглэж, C1-ийн олон бүтцийг таньж байна. Академик болон мэргэжлийн үгийн сан, нарийн утгын ялгааг гүнзгийрүүлэх шат.',
    recommendations: [
      'B2 түвшний хамгийн урт өгүүллэгүүдийг хадмалгүй уншиж, мэдэхгүй үгээ контекстоос таах дадал суулгаарай.',
      'Ярих, бичих модулиудад С1-ийн холбоос үг, албан хэллэгийг зориуд ашиглаарай.',
      'Эх хэлээр нь подкаст, нийтлэл уншиж өдөр бүр 20 минут "бодит англи хэлтэй" харьцаарай.',
    ],
    startHref: '/reading',
    startLabel: 'B2 түвшний өгүүллэгээс эхлэх',
  },
  C1: {
    key: 'C1',
    code: 'C1',
    short: 'C1',
    title: 'Ахисан шат',
    cefr: 'Advanced',
    description:
      'Та нарийн төвөгтэй эхийг далд утгатай нь ойлгож, бүтэц, үгийн сангийн хувьд чөлөөтэй байна. ColorEnglish-ийн контент A1–B2 түвшинд зориулагдсан тул танд арай хялбар санагдаж магадгүй.',
    recommendations: [
      'Хэлний мэдрэмжээ хадгалахын тулд өдөр бүр эх хэлээр нь ном, нийтлэл уншиж, подкаст сонсоорой.',
      'ColorEnglish-ийн B2 түвшний өгүүллэг, тоглоомуудыг хурд, нарийвчлалын дасгал болгон ашиглаж болно.',
      'Хэрэв IELTS/TOEFL зорилготой бол академик бичгийн бүтэц, эссэний загвар дээр түлхүү ажиллаарай.',
    ],
    startHref: '/reading',
    startLabel: 'Өгүүллэгүүдийг үзэх',
  },
};

export type PlacementBandResult = {
  band: PlacementBand;
  correct: number;
  total: number;
  passed: boolean;
};

export type PlacementSkillResult = {
  skill: PlacementSkill;
  correct: number;
  total: number;
  percent: number;
};

export type PlacementScore = {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  scorePercent: number;
  levelKey: PlacementLevelKey;
  level: LevelCode;
  bands: PlacementBandResult[];
  skills: PlacementSkillResult[];
};

/** Клиент рүү явах асуултууд — зөв хариулт, тайлбаргүй */
export function publicQuestions(): PlacementQuestionPublic[] {
  return PLACEMENT_QUESTIONS.map(({ id, band, skill, passage, prompt, options }) => ({
    id,
    band,
    skill,
    ...(passage ? { passage } : {}),
    prompt,
    options,
  }));
}

/**
 * Хариултуудыг (questionId → сонгосон индекс) дүгнэнэ.
 * Хариулаагүй / буруу индекстэй асуулт буруу гэж тооцогдоно.
 */
export function scorePlacement(answers: Record<string, number>): PlacementScore {
  const bandStats = new Map<PlacementBand, { correct: number; total: number }>(
    PLACEMENT_BANDS.map((b) => [b, { correct: 0, total: 0 }]),
  );
  const skillStats = new Map<PlacementSkill, { correct: number; total: number }>(
    PLACEMENT_SKILLS.map((s) => [s, { correct: 0, total: 0 }]),
  );

  let correctCount = 0;
  let answeredCount = 0;

  for (const q of PLACEMENT_QUESTIONS) {
    const chosen = answers[q.id];
    const answered = Number.isInteger(chosen) && chosen >= 0 && chosen < q.options.length;
    if (answered) answeredCount += 1;
    const isCorrect = answered && chosen === q.answer;

    const b = bandStats.get(q.band)!;
    const s = skillStats.get(q.skill)!;
    b.total += 1;
    s.total += 1;
    if (isCorrect) {
      b.correct += 1;
      s.correct += 1;
      correctCount += 1;
    }
  }

  const bandCorrect = PLACEMENT_BANDS.map((b) => bandStats.get(b)!.correct);
  const levelKey = determineLevelKey(bandCorrect);
  const totalQuestions = PLACEMENT_QUESTIONS.length;

  return {
    totalQuestions,
    answeredCount,
    correctCount,
    scorePercent: Math.round((correctCount / totalQuestions) * 100),
    levelKey,
    level: PLACEMENT_LEVELS[levelKey].code,
    bands: PLACEMENT_BANDS.map((band) => {
      const st = bandStats.get(band)!;
      return { band, correct: st.correct, total: st.total, passed: st.correct >= PASS_CORRECT };
    }),
    skills: PLACEMENT_SKILLS.map((skill) => {
      const st = skillStats.get(skill)!;
      return {
        skill,
        correct: st.correct,
        total: st.total,
        percent: st.total ? Math.round((st.correct / st.total) * 100) : 0,
      };
    }),
  };
}

/**
 * Түвшин тус бүрийн зөв хариултын тооноос (A1 → C1 дарааллаар) түвшин тогтооно.
 * - Дараалан тэнцсэн (≥5/8) хамгийн өндөр түвшин нь үндсэн түвшин.
 * - 4/8 авсан түвшнийг дараагийнх нь тэнцсэн бол "тэнцсэн" гэж үзнэ (нэг удаагийн гулсалт).
 * - B1/B2 тогтоогдоод дараагийн түвшинд ≥4/8 бол "+" нэмнэ.
 * - A1 ч тэнцээгүй бол PRE_A1 (эхлэгч).
 */
export function determineLevelKey(bandCorrect: number[]): PlacementLevelKey {
  let reached = -1;
  for (let i = 0; i < PLACEMENT_BANDS.length; i++) {
    const c = bandCorrect[i] ?? 0;
    if (c >= PASS_CORRECT) {
      reached = i;
      continue;
    }
    const nextPassed = i + 1 < PLACEMENT_BANDS.length && (bandCorrect[i + 1] ?? 0) >= PASS_CORRECT;
    if (c >= NEAR_CORRECT && nextPassed) {
      reached = i;
      continue;
    }
    break;
  }

  if (reached === -1) return 'PRE_A1';

  const base = PLACEMENT_BANDS[reached];
  const next = bandCorrect[reached + 1] ?? 0;
  if (base === 'B1' && next >= NEAR_CORRECT) return 'B1_PLUS';
  if (base === 'B2' && next >= NEAR_CORRECT) return 'B2_PLUS';
  return base;
}

export type PlacementReviewItem = {
  id: string;
  band: PlacementBand;
  skill: PlacementSkill;
  passage?: string;
  prompt: string;
  options: string[];
  correct: number;
  chosen: number | null;
  isCorrect: boolean;
  explanation: string;
};

/** Төлбөрийн дараа харуулах асуулт бүрийн задаргаа */
export function buildReview(answers: Record<string, number>): PlacementReviewItem[] {
  return PLACEMENT_QUESTIONS.map((q) => {
    const raw = answers[q.id];
    const chosen = Number.isInteger(raw) && raw >= 0 && raw < q.options.length ? raw : null;
    return {
      id: q.id,
      band: q.band,
      skill: q.skill,
      ...(q.passage ? { passage: q.passage } : {}),
      prompt: q.prompt,
      options: q.options,
      correct: q.answer,
      chosen,
      isCorrect: chosen === q.answer,
      explanation: q.explanation,
    };
  });
}
