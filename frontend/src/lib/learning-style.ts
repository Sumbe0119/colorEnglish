// Суралцах арга барилын судалгаа (VARK загвар)
export type LearningStyle = 'VISUAL' | 'AUDITORY' | 'READING_WRITING' | 'KINESTHETIC';

export const LEARNING_STYLES: LearningStyle[] = ['VISUAL', 'AUDITORY', 'READING_WRITING', 'KINESTHETIC'];

export type LearningStyleScores = Record<LearningStyle, number>;

export const LEARNING_STYLE_LABELS: Record<
  LearningStyle,
  { label: string; short: string; emoji: string; desc: string }
> = {
  VISUAL: {
    label: 'Харааны суралцагч',
    short: 'Харааны',
    emoji: '👁️',
    desc: 'Зураг, диаграм, өнгө, видео зэрэг харагдах зүйлээр хамгийн сайн тогтооно.',
  },
  AUDITORY: {
    label: 'Сонсголын суралцагч',
    short: 'Сонсголын',
    emoji: '🎧',
    desc: 'Сонсох, давтан хэлэх, ярилцах замаар хамгийн сайн ойлгоно.',
  },
  READING_WRITING: {
    label: 'Унших, бичих суралцагч',
    short: 'Унших/бичих',
    emoji: '📝',
    desc: 'Унших, тэмдэглэл хөтлөх, жагсаалт бичих замаар хамгийн сайн тогтооно.',
  },
  KINESTHETIC: {
    label: 'Үйлдлийн суралцагч',
    short: 'Үйлдлийн',
    emoji: '🎯',
    desc: 'Бодит нөхцөлд хэрэглэж, туршиж, дүрд тоглож үзсэнээр хамгийн сайн сурна.',
  },
};

export type LearningStyleQuestion = {
  id: string;
  text: string;
  options: { style: LearningStyle; text: string }[];
};

export const LEARNING_STYLE_QUESTIONS: LearningStyleQuestion[] = [
  {
    id: 'new-word',
    text: 'Шинэ англи үг тогтоохдоо та хамгийн түрүүнд юу хийх вэ?',
    options: [
      { style: 'VISUAL', text: 'Зураг, өнгөөр холбож санана' },
      { style: 'AUDITORY', text: 'Чангаар хэд хэд давтан хэлнэ' },
      { style: 'READING_WRITING', text: 'Дэвтэртээ бичиж, орчуулгыг нь тэмдэглэнэ' },
      { style: 'KINESTHETIC', text: 'Өгүүлбэрт хэрэглэж, яриандаа шууд ашиглана' },
    ],
  },
  {
    id: 'grammar',
    text: 'Дүрмийн шинэ сэдвийг хэрхэн хамгийн сайн ойлгодог вэ?',
    options: [
      { style: 'VISUAL', text: 'Хүснэгт, схем, өнгөөр ялгасан тайлбар' },
      { style: 'AUDITORY', text: 'Багшийн тайлбарыг сонсох, видео лекц' },
      { style: 'READING_WRITING', text: 'Дүрмийн тайлбарыг уншиж, жишээ бичих' },
      { style: 'KINESTHETIC', text: 'Дасгал бодож, алдаагаа зассаар ойлгох' },
    ],
  },
  {
    id: 'free-time',
    text: 'Чөлөөт цагаараа англи хэлтэй хэрхэн харьцах дуртай вэ?',
    options: [
      { style: 'VISUAL', text: 'Хадмал орчуулгатай кино, инфографик үзэх' },
      { style: 'AUDITORY', text: 'Подкаст, дуу сонсох' },
      { style: 'READING_WRITING', text: 'Ном, нийтлэл, блог унших' },
      { style: 'KINESTHETIC', text: 'Гадаад хүнтэй ярих, тоглоом тоглох' },
    ],
  },
  {
    id: 'directions',
    text: 'Танихгүй газар зам асуухад аль нь хамгийн ойлгомжтой вэ?',
    options: [
      { style: 'VISUAL', text: 'Газрын зураг харах' },
      { style: 'AUDITORY', text: 'Хэн нэгнээс амаар асуух' },
      { style: 'READING_WRITING', text: 'Бичсэн заавар унших' },
      { style: 'KINESTHETIC', text: 'Өөрөө явж туршиж олох' },
    ],
  },
  {
    id: 'remember',
    text: 'Хичээл дээр үзсэн зүйлээ дараа нь хэрхэн санадаг вэ?',
    options: [
      { style: 'VISUAL', text: 'Самбар, слайд дээрх зураг харагдаж байдаг' },
      { style: 'AUDITORY', text: 'Багшийн хэлсэн үг, аялга санагддаг' },
      { style: 'READING_WRITING', text: 'Тэмдэглэлээ дахин уншиж санадаг' },
      { style: 'KINESTHETIC', text: 'Дасгал хийхдээ юу болсныг санадаг' },
    ],
  },
  {
    id: 'device',
    text: 'Шинэ апп, төхөөрөмж хэрэглэж сурахдаа та…',
    options: [
      { style: 'VISUAL', text: 'Дэлгэцийн зураг, видео заавар үзнэ' },
      { style: 'AUDITORY', text: 'Хэн нэгнээр тайлбарлуулна' },
      { style: 'READING_WRITING', text: 'Гарын авлагыг уншина' },
      { style: 'KINESTHETIC', text: 'Шууд дарж туршина' },
    ],
  },
  {
    id: 'pronounce',
    text: 'Үгийн дуудлагыг хэрхэн сурах нь танд илүү үр дүнтэй вэ?',
    options: [
      { style: 'VISUAL', text: 'Амны хөдөлгөөн, галиг бичлэгийг харах' },
      { style: 'AUDITORY', text: 'Олон дахин сонсож дуурайх' },
      { style: 'READING_WRITING', text: 'Дуудлагын дүрмийг уншиж тэмдэглэх' },
      { style: 'KINESTHETIC', text: 'Бичлэг хийж, өөрийгөө сонсож засах' },
    ],
  },
  {
    id: 'exam',
    text: 'Шалгалтад бэлдэхдээ юуг хамгийн түрүүнд хийдэг вэ?',
    options: [
      { style: 'VISUAL', text: 'Mind map, өнгөт карт хийнэ' },
      { style: 'AUDITORY', text: 'Сэдвээ хэн нэгэнд тайлбарлаж ярина' },
      { style: 'READING_WRITING', text: 'Хураангуй бичиж, дахин уншина' },
      { style: 'KINESTHETIC', text: 'Хуучин шалгалтын даалгавар бодно' },
    ],
  },
];

export function computeLearningStyle(answers: LearningStyle[]): {
  scores: LearningStyleScores;
  dominant: LearningStyle;
} {
  const counts = Object.fromEntries(LEARNING_STYLES.map((s) => [s, 0])) as LearningStyleScores;
  for (const a of answers) counts[a] += 1;
  const total = answers.length || 1;
  const scores = Object.fromEntries(
    LEARNING_STYLES.map((s) => [s, Math.round((counts[s] / total) * 100)]),
  ) as LearningStyleScores;
  const dominant = LEARNING_STYLES.reduce((best, s) => (scores[s] > scores[best] ? s : best));
  return { scores, dominant };
}

/** Оноог их→бага дарааллаар буцаана */
export function rankLearningStyles(scores: LearningStyleScores): LearningStyle[] {
  return [...LEARNING_STYLES].sort((a, b) => scores[b] - scores[a]);
}

/** API-аас ирсэн JSON-ийг баталгаажуулж LearningStyleScores болгоно */
export function parseLearningStyleScores(raw: unknown): LearningStyleScores | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const scores = {} as LearningStyleScores;
  for (const s of LEARNING_STYLES) {
    const v = obj[s];
    scores[s] = typeof v === 'number' && Number.isFinite(v) ? v : 0;
  }
  return scores;
}

export const LEARNING_STYLE_TIPS: Record<LearningStyle, string[]> = {
  VISUAL: [
    'Шинэ үгийг зурагтай flashcard болгож, өнгөөр ангилж тогтоо.',
    'Дүрмийг хүснэгт, схем хэлбэрээр өөрөө зурж дахин бүтээ.',
    'Кино, цувралыг англи хадмалтай үзэж, үг өгүүлбэрийг харж тогтоо.',
    'Тэмдэглэлдээ өнгөт тодруулагч, тэмдэг, mind map ашигла.',
  ],
  AUDITORY: [
    'Хичээлийн аудио, подкастыг өдөр бүр сонсож, дуурайн давт.',
    'Уншсан текстээ чангаар уншиж, өөрийгөө бичлэгээр сонс.',
    'Дүрмийн тайлбарыг хэн нэгэнд амаар тайлбарлаж үз.',
    'Англи дууны үгийг сонсож, дагаж дуул.',
  ],
  READING_WRITING: [
    'Хичээл бүрийн дараа өөрийн үгээр товч хураангуй бич.',
    'Шинэ үг бүрийг өгүүлбэрт оруулж бичиж тогтоо.',
    'Өдөр бүр богино нийтлэл, түүх уншиж, мэдэхгүй үгээ жагсаа.',
    'Англиар өдрийн тэмдэглэл хөтөл.',
  ],
  KINESTHETIC: [
    'Сурсан зүйлээ тэр даруй ярианд, чатад хэрэглэж үз.',
    'Хичээлийг богино хэсгүүдэд хувааж, завсарлагатай сур.',
    'Дүрд тоглох, дасгал бодох зэрэг идэвхтэй даалгаварт төвлөр.',
    'Ярианы дасгалыг өдөр бүр хийж, алдаанаасаа сур.',
  ],
};

/** Платформын аль хэсгийг хамгийн түрүүнд ашиглавал тохиромжтой вэ */
export const LEARNING_STYLE_FEATURES: Record<LearningStyle, string> = {
  VISUAL: 'Видео хичээл, зурагтай үгийн сан, дүрмийн хүснэгтээс эхэл.',
  AUDITORY: 'Уншлагын аудио, дуудлагын дасгалаас эхэл.',
  READING_WRITING: 'Уншлагын түүх, дүрмийн тайлбар, бичих даалгавраас эхэл.',
  KINESTHETIC: 'Ярианы дасгал, интерактив тест, дүрмийн дасгалаас эхэл.',
};
