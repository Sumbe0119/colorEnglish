// frontend/src/lib/sentence-builder.ts
// "Өгүүлбэр бүтээх" тоглоомын өгөгдөл ба туслах функцууд.
// Өгүүлбэрийн БҮХ үг (a / the / to / in зэрэг жижиг үг орсон) холигдож өгөгдөнө,
// тоглогч тэдгээрийг зөв дарааллаар бичнэ. Раунд ахих тусам өгүүлбэр 5 → 8 үг болж хүндэрнэ.
// Цаг дуусвал робот тавцангаас унаж тоглоом дуусна (game over).

export type SentencePuzzle = {
  /** Зөв өгүүлбэр (эхний хувилбар — үгсийг эндээс гаргана, Tip-д харуулна). */
  answer: string;
  /** Зорилтот өгүүлбэрийн монгол утга. */
  mn: string;
  /** Мөн зөв гэж тооцох бусад дараалал. */
  alt?: string[];
};

export const ROUNDS_PER_GAME = 10;
/** 5 үгтэй өгүүлбэрийн хугацаа; нэмэлт үг бүрт SECONDS_PER_EXTRA_WORD нэмэгдэнэ (8 үг = 60с). */
export const BASE_ROUND_SECONDS = 30;
export const SECONDS_PER_EXTRA_WORD = 10;
export const MIN_WORDS = 5;
export const MAX_WORDS = 8;
/** Tip ашигласан раундын тогтмол оноо. */
export const POINTS_WITH_TIP = 4;
/** Үг тутмын үндсэн оноо (5 үг = 10, 8 үг = 16). */
export const POINTS_PER_WORD = 2;
/** Үлдсэн хугацааны урамшуулал (дээд тал нь). */
export const BONUS_MAX = 10;

type Pool = Record<number, SentencePuzzle[]>;

/** Үгийн тоогоор бүлэглэсэн өгүүлбэрийн сан. Үгийн тоо яг таарч байх ёстой (тестээр шалгана). */
export const SENTENCE_POOL: Pool = {
  5: [
    { answer: 'I go to school today', mn: 'Би өнөөдөр сургуульд явна.', alt: ['Today I go to school'] },
    { answer: 'She likes to read books', mn: 'Тэр ном уншихдаа дуртай.' },
    { answer: 'We live in a city', mn: 'Бид хотод амьдардаг.' },
    { answer: 'He is a good doctor', mn: 'Тэр сайн эмч.' },
    { answer: 'They play football on Sundays', mn: 'Тэд ням гарагт хөлбөмбөг тоглодог.', alt: ['On Sundays they play football'] },
    { answer: 'I have a black dog', mn: 'Надад хар нохой бий.' },
    { answer: 'She drinks coffee every morning', mn: 'Тэр өглөө бүр кофе уудаг.', alt: ['Every morning she drinks coffee'] },
    { answer: 'My mother is cooking dinner', mn: 'Ээж маань оройн хоол хийж байна.' },
    { answer: 'The cat is sleeping now', mn: 'Муур одоо унтаж байна.', alt: ['Now the cat is sleeping'] },
    { answer: 'We eat breakfast at seven', mn: 'Бид долоон цагт өглөөний цай уудаг.', alt: ['At seven we eat breakfast'] },
    { answer: 'I want some hot tea', mn: 'Би халуун цай уумаар байна.' },
    { answer: 'He works in a bank', mn: 'Тэр банкинд ажилладаг.' },
    { answer: 'It is very cold today', mn: 'Өнөөдөр маш хүйтэн байна.', alt: ['Today it is very cold'] },
    { answer: 'They are my best friends', mn: 'Тэд миний хамгийн сайн найзууд.' },
    { answer: 'She speaks English very well', mn: 'Тэр англиар маш сайн ярьдаг.' },
    { answer: 'I love my little sister', mn: 'Би бяцхан дүүдээ хайртай.' },
    { answer: 'We watch TV after dinner', mn: 'Бид оройн хоолны дараа зурагт үздэг.', alt: ['After dinner we watch TV'] },
    { answer: 'He plays the guitar well', mn: 'Тэр гитар сайн тоглодог.' },
    { answer: 'I am very hungry now', mn: 'Би одоо маш их өлсөж байна.', alt: ['Now I am very hungry'] },
    { answer: 'She has a new car', mn: 'Тэр шинэ машинтай.' },
    { answer: 'They went to the park', mn: 'Тэд цэцэрлэгт хүрээлэн рүү явсан.' },
    { answer: 'The children are playing outside', mn: 'Хүүхдүүд гадаа тоглож байна.' },
    { answer: 'I need some cold water', mn: 'Надад хүйтэн ус хэрэгтэй.' },
    { answer: 'It is raining in Ulaanbaatar', mn: 'Улаанбаатарт бороо орж байна.' },
    { answer: 'He reads books at night', mn: 'Тэр шөнө ном уншдаг.', alt: ['At night he reads books'] },
    { answer: 'My father drives a bus', mn: 'Аав маань автобус жолооддог.' },
    { answer: 'We swim in the summer', mn: 'Бид зун сэлдэг.' },
    { answer: 'She is in the kitchen', mn: 'Тэр гал тогоонд байна.' },
  ],
  6: [
    { answer: 'I go to school every day', mn: 'Би өдөр бүр сургуульд явдаг.', alt: ['Every day I go to school'] },
    { answer: 'She likes cats and small dogs', mn: 'Тэр муур болон жижиг нохойд дуртай.' },
    { answer: 'We live in a big city', mn: 'Бид том хотод амьдардаг.' },
    { answer: 'He is a doctor in Darkhan', mn: 'Тэр Дарханд эмч хийдэг.' },
    { answer: 'They play football in the park', mn: 'Тэд цэцэрлэгт хүрээлэнд хөлбөмбөг тоглодог.' },
    { answer: 'She drinks coffee in the morning', mn: 'Тэр өглөө кофе уудаг.', alt: ['In the morning she drinks coffee'] },
    { answer: 'My brother works in a hospital', mn: 'Ах маань эмнэлэгт ажилладаг.' },
    { answer: 'The cat sleeps on the bed', mn: 'Муур орон дээр унтдаг.' },
    { answer: "We eat breakfast at seven o'clock", mn: 'Бид долоон цагт өглөөний цай уудаг.', alt: ["At seven o'clock we eat breakfast"] },
    { answer: 'I want a cup of tea', mn: 'Би нэг аяга цай уумаар байна.' },
    { answer: 'It is very hot in summer', mn: 'Зун маш халуун байдаг.', alt: ['In summer it is very hot'] },
    { answer: 'They are students at this school', mn: 'Тэд энэ сургуульд сурдаг оюутнууд.' },
    { answer: 'She speaks English and Mongolian well', mn: 'Тэр англи, монголоор сайн ярьдаг.' },
    { answer: 'I listen to music every evening', mn: 'Би орой бүр хөгжим сонсдог.', alt: ['Every evening I listen to music'] },
    { answer: 'He goes to bed at ten', mn: 'Тэр арван цагт унтдаг.', alt: ['At ten he goes to bed'] },
    { answer: 'We watch a movie every Friday', mn: 'Бид баасан гараг бүр кино үздэг.', alt: ['Every Friday we watch a movie'] },
    { answer: "I wake up at seven o'clock", mn: 'Би долоон цагт босдог.', alt: ["At seven o'clock I wake up"] },
    { answer: 'She has a small red car', mn: 'Тэр жижиг улаан машинтай.' },
    { answer: 'They went to the park yesterday', mn: 'Тэд өчигдөр цэцэрлэгт хүрээлэн рүү явсан.', alt: ['Yesterday they went to the park'] },
    { answer: 'I call my father every Sunday', mn: 'Би ням гараг бүр аавдаа залгадаг.', alt: ['Every Sunday I call my father'] },
    { answer: 'My mother is cooking dinner now', mn: 'Ээж маань одоо оройн хоол хийж байна.', alt: ['Now my mother is cooking dinner'] },
    { answer: 'We are happy to see you', mn: 'Бид тантай уулзахдаа баяртай байна.' },
    { answer: 'I open the window every morning', mn: 'Би өглөө бүр цонх онгойлгодог.', alt: ['Every morning I open the window'] },
    { answer: 'She is reading a new book', mn: 'Тэр шинэ ном уншиж байна.' },
    { answer: "The bus comes at eight o'clock", mn: 'Автобус найман цагт ирдэг.', alt: ["At eight o'clock the bus comes"] },
    { answer: 'It is snowing in the mountains', mn: 'Ууланд цас орж байна.', alt: ['In the mountains it is snowing'] },
    { answer: 'We need some bread and milk', mn: 'Бидэнд талх, сүү хэрэгтэй.' },
  ],
  7: [
    { answer: 'I have a dog and a cat', mn: 'Надад нохой, муур хоёр бий.' },
    { answer: 'The children are playing in the garden', mn: 'Хүүхдүүд цэцэрлэгт тоглож байна.' },
    { answer: 'He writes a letter to his friend', mn: 'Тэр найздаа захиа бичдэг.' },
    { answer: "We usually have lunch at twelve o'clock", mn: 'Бид ихэвчлэн арван хоёр цагт өдрийн хоол иддэг.' },
    { answer: 'My sister lives in a small town', mn: 'Эгч маань жижиг хотод амьдардаг.' },
    { answer: 'I like to play basketball with friends', mn: 'Би найзуудтайгаа сагсан бөмбөг тоглох дуртай.' },
    { answer: 'They are watching TV in the room', mn: 'Тэд өрөөнд зурагт үзэж байна.' },
    { answer: 'He drinks a glass of milk daily', mn: 'Тэр өдөр бүр нэг аяга сүү уудаг.', alt: ['Daily he drinks a glass of milk'] },
    { answer: 'She is cooking rice for her family', mn: 'Тэр гэр бүлдээ будаа чанаж байна.' },
    { answer: 'I went to the shop with Bat', mn: 'Би Баттай хамт дэлгүүр явсан.' },
    { answer: 'We go to the cinema on Saturdays', mn: 'Бид бямба гарагт кино театрт явдаг.', alt: ['On Saturdays we go to the cinema'] },
    { answer: 'The weather is very nice in spring', mn: 'Хавар цаг агаар маш сайхан байдаг.', alt: ['In spring the weather is very nice'] },
    { answer: 'My father reads the newspaper every morning', mn: 'Аав маань өглөө бүр сонин уншдаг.', alt: ['Every morning my father reads the newspaper'] },
    { answer: 'I am learning English at this school', mn: 'Би энэ сургуульд англи хэл сурч байна.' },
    { answer: 'They live in a big house now', mn: 'Тэд одоо том байшинд амьдардаг.', alt: ['Now they live in a big house'] },
    { answer: 'She wants to buy a new phone', mn: 'Тэр шинэ утас авахыг хүсч байна.' },
    { answer: 'He plays the piano in the evening', mn: 'Тэр орой төгөлдөр хуур тоглодог.', alt: ['In the evening he plays the piano'] },
    { answer: 'We are going to the park tomorrow', mn: 'Бид маргааш цэцэрлэгт хүрээлэн рүү явна.', alt: ['Tomorrow we are going to the park'] },
    { answer: 'I drink a cup of coffee daily', mn: 'Би өдөр бүр нэг аяга кофе уудаг.', alt: ['Daily I drink a cup of coffee'] },
    { answer: 'The students are listening to the teacher', mn: 'Оюутнууд багшийгаа сонсож байна.' },
    { answer: 'My friend works at a small bank', mn: 'Найз маань жижиг банкинд ажилладаг.' },
    { answer: 'It is cold and windy in winter', mn: 'Өвөл хүйтэн, салхитай байдаг.', alt: ['In winter it is cold and windy'] },
    { answer: 'She calls her mother every Sunday evening', mn: 'Тэр ням гараг бүрийн орой ээждээ залгадаг.', alt: ['Every Sunday evening she calls her mother'] },
  ],
  8: [
    { answer: 'She goes to work by bus every day', mn: 'Тэр өдөр бүр автобусаар ажилдаа явдаг.', alt: ['Every day she goes to work by bus'] },
    { answer: 'I get up at six in the morning', mn: 'Би өглөө зургаан цагт босдог.', alt: ['In the morning I get up at six'] },
    { answer: 'My brother and I play football after school', mn: 'Ах бид хоёр хичээлийн дараа хөлбөмбөг тоглодог.', alt: ['After school my brother and I play football'] },
    { answer: 'We are going to visit our grandmother tomorrow', mn: 'Бид маргааш эмээ дээрээ очно.', alt: ['Tomorrow we are going to visit our grandmother'] },
    { answer: 'The teacher gives us a lot of homework', mn: 'Багш бидэнд маш их гэрийн даалгавар өгдөг.' },
    { answer: 'He is reading a book in the library', mn: 'Тэр номын санд ном уншиж байна.' },
    { answer: 'I want to learn English in one year', mn: 'Би нэг жилийн дотор англи хэл сурахыг хүсч байна.' },
    { answer: 'They have dinner with their family every evening', mn: 'Тэд орой бүр гэр бүлтэйгээ оройн хоол иддэг.', alt: ['Every evening they have dinner with their family'] },
    { answer: 'She is wearing a beautiful red dress today', mn: 'Тэр өнөөдөр сайхан улаан даашинз өмссөн байна.', alt: ['Today she is wearing a beautiful red dress'] },
    { answer: 'My mother makes tea for us every morning', mn: 'Ээж маань өглөө бүр бидэнд цай хийж өгдөг.', alt: ['Every morning my mother makes tea for us'] },
    { answer: 'We watched a very good movie last night', mn: 'Бид өчигдөр орой маш сайн кино үзсэн.', alt: ['Last night we watched a very good movie'] },
    { answer: 'I go to the gym twice a week', mn: 'Би долоо хоногт хоёр удаа фитнесс явдаг.', alt: ['Twice a week I go to the gym'] },
    { answer: 'The children are swimming in the lake now', mn: 'Хүүхдүүд одоо нууранд сэлж байна.', alt: ['Now the children are swimming in the lake'] },
    { answer: 'He works in a big hospital in Ulaanbaatar', mn: 'Тэр Улаанбаатарын том эмнэлэгт ажилладаг.' },
    { answer: 'My sister is studying at the university now', mn: 'Эгч маань одоо их сургуульд сурч байна.', alt: ['Now my sister is studying at the university'] },
    { answer: 'We like to eat ice cream in summer', mn: 'Бид зун зайрмаг идэх дуртай.', alt: ['In summer we like to eat ice cream'] },
    { answer: 'I am waiting for my friend at home', mn: 'Би гэртээ найзаа хүлээж байна.', alt: ['At home I am waiting for my friend'] },
    { answer: 'She bought some apples at the market yesterday', mn: 'Тэр өчигдөр захаас алим авсан.', alt: ['Yesterday she bought some apples at the market'] },
    { answer: 'They are building a new school in Darkhan', mn: 'Тэд Дарханд шинэ сургууль барьж байна.' },
    { answer: 'The dog is sleeping under the table now', mn: 'Нохой одоо ширээний доор унтаж байна.', alt: ['Now the dog is sleeping under the table'] },
    { answer: 'I drink a glass of water before breakfast', mn: 'Би өглөөний цайны өмнө нэг аяга ус уудаг.', alt: ['Before breakfast I drink a glass of water'] },
    { answer: 'We are very happy to see you again', mn: 'Бид тантай дахин уулзахдаа маш баяртай байна.' },
    { answer: 'He does not like to get up early', mn: 'Тэр эрт босох дургүй.' },
    { answer: 'Please close the door when you go out', mn: 'Гарахдаа хаалгаа хаагаарай.' },
  ],
};

/** Бүх өгүүлбэр нэг жагсаалтаар (тест, статистик). */
export const SENTENCE_PUZZLES: SentencePuzzle[] = Object.values(SENTENCE_POOL).flat();

/** Өгүүлбэрийн үгс (цэг таслалгүй). Эхний үгийг жижиг үсгээр — зөв дарааллыг үсгээр таахгүй. */
export function wordsOf(puzzle: SentencePuzzle): string[] {
  return tokenize(puzzle.answer).map((w, i) => (i === 0 && !/^I($|')/.test(w) ? w.toLowerCase() : w));
}

function tokenize(s: string): string[] {
  return s
    .replace(/[’‘`]/g, "'")
    .replace(/[.!?,;:]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function wordCount(puzzle: SentencePuzzle): number {
  return tokenize(puzzle.answer).length;
}

/** Раунд ахих тусам үгийн тоо: 10 раунд → 5,5,5,6,6,6,7,7,8,8. */
export function wordCountForRound(round: number, total = ROUNDS_PER_GAME): number {
  const k = total <= 1 ? 1 : round / (total - 1); // 0 → 1
  const n = MIN_WORDS + Math.floor(k * (MAX_WORDS - MIN_WORDS + 1) * 0.999);
  return Math.max(MIN_WORDS, Math.min(MAX_WORDS, n));
}

/** Тухайн өгүүлбэрт өгөх секунд: 5 үг = 30с, нэмэлт үг бүрт +10с (8 үг = 60с). */
export function roundSeconds(puzzle: SentencePuzzle): number {
  return BASE_ROUND_SECONDS + (wordCount(puzzle) - MIN_WORDS) * SECONDS_PER_EXTRA_WORD;
}

/** Том/жижиг үсэг, цэг таслал, давхар зайг үл тооцон харьцуулахад бэлтгэнэ. */
export function normalizeSentence(input: string): string {
  return input
    .replace(/[’‘`]/g, "'")
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isCorrectAnswer(puzzle: SentencePuzzle, input: string): boolean {
  const n = normalizeSentence(input);
  if (!n) return false;
  if (normalizeSentence(puzzle.answer) === n) return true;
  return (puzzle.alt ?? []).some((a) => normalizeSentence(a) === n);
}

/**
 * Буруу хариултын зөвлөмж: дутуу үг, илүү үг, эсвэл дараалал буруу.
 * Бүх үг өгөгдсөн тул тоглогчид яг юу нь буруу байгааг хэлж болно.
 */
export function answerHint(puzzle: SentencePuzzle, input: string): string {
  const want = wordsOf(puzzle).map((w) => normalizeSentence(w));
  const got = normalizeSentence(input).split(' ').filter(Boolean);
  const pool = [...want];
  const extra: string[] = [];
  for (const g of got) {
    const i = pool.indexOf(g);
    if (i >= 0) pool.splice(i, 1);
    else extra.push(g);
  }
  const parts: string[] = [];
  if (pool.length) parts.push(`дутуу: ${pool.join(', ')}`);
  if (extra.length) parts.push(`илүү: ${extra.join(', ')}`);
  if (!parts.length) return 'Бүх үг зөв, харин дараалал буруу байна. Дахин оролд!';
  return `Буруу байна — ${parts.join(' · ')}.`;
}

/** Tip-д харуулах жишээ өгүүлбэр (цэгтэй). */
export function exampleSentence(puzzle: SentencePuzzle): string {
  const s = puzzle.answer;
  return /[.!?]$/.test(s) ? s : `${s}.`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Нэг тоглолтын өгүүлбэрүүд: раунд бүрт хүндрэлд тохирох урттай, давтагдахгүй санамсаргүй өгүүлбэр.
 * Тухайн урттай сан дуусвал хамгийн ойр урттайгаас авна.
 */
export function pickRoundPuzzles(count = ROUNDS_PER_GAME): SentencePuzzle[] {
  const pools: Pool = {};
  for (const [len, list] of Object.entries(SENTENCE_POOL)) pools[Number(len)] = shuffle(list);
  const out: SentencePuzzle[] = [];
  for (let i = 0; i < count; i++) {
    const want = wordCountForRound(i, count);
    let picked: SentencePuzzle | undefined;
    for (let d = 0; d <= MAX_WORDS - MIN_WORDS && !picked; d++) {
      for (const len of [want + d, want - d]) {
        const pool = pools[len];
        if (pool && pool.length) {
          picked = pool.pop();
          break;
        }
      }
    }
    if (!picked) break;
    out.push(picked);
  }
  return out;
}

/** Үгсийг холино — анхны дараалалтай яг адил бол дахин холино. */
export function shuffledWords(puzzle: SentencePuzzle): string[] {
  const base = wordsOf(puzzle);
  let w = shuffle(base);
  for (let tries = 0; tries < 5 && w.every((x, i) => x === base[i]); tries++) w = shuffle(base);
  return w;
}

/** Хариултын оноо: үгийн тоо × 2 + үлдсэн хугацааны урамшуулал. Tip ашигласан бол тогтмол бага оноо. */
export function scoreFor(puzzle: SentencePuzzle, remainMs: number, usedTip: boolean): number {
  if (usedTip) return POINTS_WITH_TIP;
  const total = roundSeconds(puzzle) * 1000;
  const bonus = Math.min(BONUS_MAX, Math.round((remainMs / total) * BONUS_MAX));
  return wordCount(puzzle) * POINTS_PER_WORD + bonus;
}

/**
 * Цаг багасах тусам ногооноос шар, улаан руу шилжих өнгө.
 * fraction = үлдсэн хугацаа / нийт хугацаа (1 → 0).
 */
export function timerColor(fraction: number): string {
  const f = Math.max(0, Math.min(1, fraction));
  const hue = Math.round(130 * f); // 130 = ногоон, 0 = улаан
  const light = 58 + Math.round((1 - f) * 6);
  return `hsl(${hue} 90% ${light}%)`;
}

const BEST_KEY = 'ce.sentence-builder.best';

export type BestScore = { score: number; correct: number; at: string };

export function loadBest(): BestScore | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(BEST_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<BestScore>;
    if (typeof v.score !== 'number' || typeof v.correct !== 'number') return null;
    return { score: v.score, correct: v.correct, at: typeof v.at === 'string' ? v.at : '' };
  } catch {
    return null;
  }
}

export function saveBestIfBetter(result: { score: number; correct: number }): boolean {
  if (typeof window === 'undefined') return false;
  const prev = loadBest();
  if (prev && prev.score >= result.score) return false;
  try {
    window.localStorage.setItem(BEST_KEY, JSON.stringify({ ...result, at: new Date().toISOString() }));
  } catch {
    return false;
  }
  return true;
}
