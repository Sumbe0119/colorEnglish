// MBTI зан чанарын тест — хариулт бүр нь сонгосон сонголтын үсэг
export const MBTI_LETTERS = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'] as const;
export type MbtiLetter = (typeof MBTI_LETTERS)[number];

/** Үсэг бүрийн хувь (0-100); хос үсгийн нийлбэр 100 */
export type MbtiScores = Record<MbtiLetter, number>;

export type MbtiDimension = {
  key: 'EI' | 'SN' | 'TF' | 'JP';
  letters: [MbtiLetter, MbtiLetter];
  title: string;
  labels: Record<string, string>;
};

export const MBTI_DIMENSIONS: MbtiDimension[] = [
  { key: 'EI', letters: ['E', 'I'], title: 'Эрч хүчээ хаанаас авдаг вэ', labels: { E: 'Гадагш чиглэсэн', I: 'Дотогш чиглэсэн' } },
  { key: 'SN', letters: ['S', 'N'], title: 'Мэдээллийг хэрхэн хүлээж авдаг вэ', labels: { S: 'Мэдрэхүйн', N: 'Зөн совингийн' } },
  { key: 'TF', letters: ['T', 'F'], title: 'Шийдвэрээ хэрхэн гаргадаг вэ', labels: { T: 'Логикийн', F: 'Мэдрэмжийн' } },
  { key: 'JP', letters: ['J', 'P'], title: 'Амьдралаа хэрхэн зохион байгуулдаг вэ', labels: { J: 'Төлөвлөгч', P: 'Уян хатан' } },
];

export const MBTI_LETTER_LABELS: Record<MbtiLetter, string> = {
  E: 'Экстраверт',
  I: 'Интроверт',
  S: 'Мэдрэхүйн',
  N: 'Зөн совингийн',
  T: 'Логикийн',
  F: 'Мэдрэмжийн',
  J: 'Төлөвлөгч',
  P: 'Уян хатан',
};

export type MbtiQuestion = {
  id: string;
  text: string;
  options: [{ letter: MbtiLetter; text: string }, { letter: MbtiLetter; text: string }];
};

/** Хэмжээс бүрд 5 асуулт (сондгой тул тэнцэхгүй). Backend-ийн MBTI_QUESTION_COUNT = 20-той таарна. */
export const MBTI_QUESTIONS: MbtiQuestion[] = [
  // E / I
  {
    id: 'ei-1',
    text: 'Шинэ хүмүүстэй танилцах үед та ихэвчлэн:',
    options: [
      { letter: 'E', text: 'Өөрөө яриа эхлүүлдэг' },
      { letter: 'I', text: 'Нөгөө хүн эхлүүлэхийг хүлээж, ажигладаг' },
    ],
  },
  {
    id: 'ei-2',
    text: 'Урт өдрийн дараа та хэрхэн эрч хүчээ сэргээдэг вэ?',
    options: [
      { letter: 'E', text: 'Найзуудтайгаа уулзаж, ярилцаж' },
      { letter: 'I', text: 'Ганцаараа чимээгүй орчинд амарч' },
    ],
  },
  {
    id: 'ei-3',
    text: 'Англиар ярих дасгал хийхдээ танд юу илүү таалагддаг вэ?',
    options: [
      { letter: 'E', text: 'Бүлгээр, олон хүнтэй ярилцах' },
      { letter: 'I', text: 'Ганцаараа эсвэл нэг хүнтэй дасгал хийх' },
    ],
  },
  {
    id: 'ei-4',
    text: 'Бодлоо хэрхэн боловсруулдаг вэ?',
    options: [
      { letter: 'E', text: 'Ярьж байх явцдаа бодол минь тодорхой болдог' },
      { letter: 'I', text: 'Эхлээд дотроо бодож, дараа нь хэлдэг' },
    ],
  },
  {
    id: 'ei-5',
    text: 'Хичээл дээр ойлгоогүй зүйл гарвал:',
    options: [
      { letter: 'E', text: 'Шууд асуудаг' },
      { letter: 'I', text: 'Эхлээд өөрөө олж мэдэхийг хичээдэг' },
    ],
  },
  // S / N
  {
    id: 'sn-1',
    text: 'Шинэ зүйл сурахдаа танд аль нь илүү тохирдог вэ?',
    options: [
      { letter: 'S', text: 'Бодит жишээ, алхам алхмаар заавар' },
      { letter: 'N', text: 'Ерөнхий санаа, зарчмыг нь ойлгох' },
    ],
  },
  {
    id: 'sn-2',
    text: 'Та ихэвчлэн:',
    options: [
      { letter: 'S', text: 'Одоо байгаа бодит байдалд төвлөрдөг' },
      { letter: 'N', text: 'Ирээдүйн боломж, санаануудыг төсөөлдөг' },
    ],
  },
  {
    id: 'sn-3',
    text: 'Дүрмийн шинэ сэдэв сурахдаа:',
    options: [
      { letter: 'S', text: 'Тодорхой жишээгээр нэг нэгээр нь тогтоодог' },
      { letter: 'N', text: 'Ерөнхий хэв маягийг олж, өөрөө таамагладаг' },
    ],
  },
  {
    id: 'sn-4',
    text: 'Текст уншихдаа юунд анхаардаг вэ?',
    options: [
      { letter: 'S', text: 'Дэлгэрэнгүй баримт, мэдээлэлд' },
      { letter: 'N', text: 'Далд утга, ерөнхий санаанд' },
    ],
  },
  {
    id: 'sn-5',
    text: 'Даалгавар хийхдээ:',
    options: [
      { letter: 'S', text: 'Батлагдсан, найдвартай аргыг дагадаг' },
      { letter: 'N', text: 'Шинэ арга турших дуртай' },
    ],
  },
  // T / F
  {
    id: 'tf-1',
    text: 'Чухал шийдвэр гаргахдаа та:',
    options: [
      { letter: 'T', text: 'Логик, баримтад тулгуурладаг' },
      { letter: 'F', text: 'Хүмүүст хэрхэн нөлөөлөхийг харгалздаг' },
    ],
  },
  {
    id: 'tf-2',
    text: 'Найз тань асуудалтай тулгарвал:',
    options: [
      { letter: 'T', text: 'Шийдэл санал болгодог' },
      { letter: 'F', text: 'Эхлээд сонсож, дэмждэг' },
    ],
  },
  {
    id: 'tf-3',
    text: 'Шүүмжлэл хүлээж авахдаа:',
    options: [
      { letter: 'T', text: 'Үнэн зөв бол хүлээн авдаг' },
      { letter: 'F', text: 'Ямар байдлаар хэлсэн нь чухал байдаг' },
    ],
  },
  {
    id: 'tf-4',
    text: 'Багаар ажиллахдаа юуг илүү чухалчилдаг вэ?',
    options: [
      { letter: 'T', text: 'Үр дүн, үр ашгийг' },
      { letter: 'F', text: 'Эв найрамдал, харилцааг' },
    ],
  },
  {
    id: 'tf-5',
    text: 'Маргаан гарахад:',
    options: [
      { letter: 'T', text: 'Хэн зөв бэ гэдгийг тогтоохыг хүсдэг' },
      { letter: 'F', text: 'Бүгд сэтгэл хангалуун байхыг хүсдэг' },
    ],
  },
  // J / P
  {
    id: 'jp-1',
    text: 'Хичээлээ хэрхэн хийдэг вэ?',
    options: [
      { letter: 'J', text: 'Хуваарь гаргаж, түүнийгээ дагадаг' },
      { letter: 'P', text: 'Урам орсон үедээ хийдэг' },
    ],
  },
  {
    id: 'jp-2',
    text: 'Хугацаатай даалгаврыг:',
    options: [
      { letter: 'J', text: 'Эрт эхэлж, хугацаанаас нь өмнө дуусгадаг' },
      { letter: 'P', text: 'Сүүлийн мөчид эрч хүчтэй хийдэг' },
    ],
  },
  {
    id: 'jp-3',
    text: 'Аялалд гарахдаа:',
    options: [
      { letter: 'J', text: 'Урьдчилан бүх зүйлийг төлөвлөдөг' },
      { letter: 'P', text: 'Явж байгаад шийддэг' },
    ],
  },
  {
    id: 'jp-4',
    text: 'Таны ажлын ширээ ихэвчлэн:',
    options: [
      { letter: 'J', text: 'Эмх цэгцтэй' },
      { letter: 'P', text: 'Бүтээлч эмх замбараагүй' },
    ],
  },
  {
    id: 'jp-5',
    text: 'Төлөвлөгөө гэнэт өөрчлөгдвөл:',
    options: [
      { letter: 'J', text: 'Тавгүйрхдэг' },
      { letter: 'P', text: 'Уян хатан хүлээн авдаг' },
    ],
  },
];

export const MBTI_QUESTION_COUNT = MBTI_QUESTIONS.length;

export type MbtiTypeInfo = { name: string; emoji: string; desc: string };

export const MBTI_TYPES: Record<string, MbtiTypeInfo> = {
  INTJ: { name: 'Стратегич', emoji: '🧠', desc: 'Урт хугацааны төлөвлөгөөтэй, бие даасан, дүн шинжилгээнд дуртай.' },
  INTP: { name: 'Логикч', emoji: '🔬', desc: 'Сониуч, онолын мэдлэгт дуртай, зүйлсийн учир шалтгааныг тайлахыг хүсдэг.' },
  ENTJ: { name: 'Удирдагч', emoji: '👑', desc: 'Зорилготой, шийдэмгий, бусдыг зохион байгуулж үр дүнд хүрдэг.' },
  ENTP: { name: 'Мэтгэлцэгч', emoji: '💡', desc: 'Шинэ санаанд дуртай, хурц ухаантай, мэтгэлцэж сурах дуртай.' },
  INFJ: { name: 'Зөвлөгч', emoji: '🌙', desc: 'Гүн гүнзгий бодолтой, бусдыг ойлгодог, утга учиртай зүйлд тэмүүлдэг.' },
  INFP: { name: 'Зуучлагч', emoji: '🌸', desc: 'Үнэт зүйлдээ үнэнч, бүтээлч, төсөөлөл баялаг.' },
  ENFJ: { name: 'Гол дүр', emoji: '🌟', desc: 'Бусдад урам өгдөг, харилцааны чадвартай, багийг нэгтгэдэг.' },
  ENFP: { name: 'Урам зоригч', emoji: '🎉', desc: 'Эрч хүчтэй, бүтээлч, шинэ боломж бүрт догдолдог.' },
  ISTJ: { name: 'Логистикч', emoji: '📋', desc: 'Найдвартай, нарийн, дэг журам, батлагдсан аргыг эрхэмлэдэг.' },
  ISFJ: { name: 'Хамгаалагч', emoji: '🛡️', desc: 'Халамжтай, тууштай, бусдын хэрэгцээг анзаардаг.' },
  ESTJ: { name: 'Захирагч', emoji: '⚖️', desc: 'Зохион байгуулалт сайтай, шулуухан, үр дүнд төвлөрдөг.' },
  ESFJ: { name: 'Консул', emoji: '🤝', desc: 'Нийтэч, тусархаг, хамт олны уур амьсгалыг чухалчилдаг.' },
  ISTP: { name: 'Мастер', emoji: '🔧', desc: 'Практик, туршиж сурдаг, асуудлыг гараараа шийддэг.' },
  ISFP: { name: 'Уран бүтээлч', emoji: '🎨', desc: 'Мэдрэмжтэй, уян хатан, өөрийн хэмнэлээр сурах дуртай.' },
  ESTP: { name: 'Санаачлагч', emoji: '⚡', desc: 'Эрсдэлээс айдаггүй, бодит үйлдэлд дуртай, хурдан суралцдаг.' },
  ESFP: { name: 'Хөгжөөн дэмжигч', emoji: '🎭', desc: 'Хөгжилтэй, нийтэч, туршлагаар сурах дуртай.' },
};

/** Үсэг бүрд тохирсон англи хэл сурах зөвлөмж — төрлийн 4 үсгээс 4 зөвлөмж бүрддэг */
export const MBTI_LETTER_TIPS: Record<MbtiLetter, string> = {
  E: 'Ярианы дасгал, бүлгийн хичээл, чатаар хэрэглэх зэрэг хүнтэй харилцах хэлбэрээр сур.',
  I: 'Ганцаараа уншиж, сонсож бэлдээд дараа нь ярианы дасгалд орох нь илүү тохиромжтой.',
  S: 'Бодит жишээ, өдөр тутмын харилцан яриа, алхам алхмаар дасгалаас эхэл.',
  N: 'Дүрмийн ерөнхий хэв маягийг олж, контекстээс утгыг таамаглан унших дасгал хий.',
  T: 'Дүрмийн логик бүтэц, ахиц дэвшлийн статистикаа хянаж, зорилтот тоогоор сур.',
  F: 'Дуртай сэдэв, түүх, дуу, кино зэрэг сэтгэлд хүрдэг агуулгаар үгийн сангаа тэлээрэй.',
  J: 'Өдөр бүрийн тогтмол хуваарь, долоо хоногийн зорилго тавьж тууштай хий.',
  P: 'Богино, олон төрлийн дасгалыг ээлжлэн хийж, streak-ээ хадгалахад төвлөр.',
};

export function computeMbti(answers: MbtiLetter[]): { type: string; scores: MbtiScores } | null {
  const counts = Object.fromEntries(MBTI_LETTERS.map((l) => [l, 0])) as MbtiScores;
  for (const a of answers) counts[a] += 1;
  const scores = {} as MbtiScores;
  let type = '';
  for (const d of MBTI_DIMENSIONS) {
    const [a, b] = d.letters;
    const total = counts[a] + counts[b];
    if (total === 0) return null;
    scores[a] = Math.round((counts[a] / total) * 100);
    scores[b] = 100 - scores[a];
    type += counts[a] >= counts[b] ? a : b;
  }
  return { type, scores };
}

export function isMbtiLetter(v: unknown): v is MbtiLetter {
  return typeof v === 'string' && (MBTI_LETTERS as readonly string[]).includes(v);
}

/** API-аас ирсэн JSON-ийг баталгаажуулж MbtiScores болгоно */
export function parseMbtiScores(raw: unknown): MbtiScores | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const scores = {} as MbtiScores;
  for (const l of MBTI_LETTERS) {
    const v = obj[l];
    scores[l] = typeof v === 'number' && Number.isFinite(v) ? v : 0;
  }
  return scores;
}

export function isMbtiType(v: unknown): v is string {
  return typeof v === 'string' && v in MBTI_TYPES;
}
