// frontend/src/lib/sentence-builder.ts
// "Өгүүлбэр бүтээх" тоглоомын өгөгдөл ба туслах функцууд.
// Тоглогчид 3 түлхүүр үг + монгол орчуулга өгнө, тэр бүтэн англи өгүүлбэрээ өөрөө бичнэ.

export type SentencePuzzle = {
  /** Өгөгдөх 3 түлхүүр үг (дэлгэц дээр холиод харуулна). */
  words: [string, string, string];
  /** Зорилтот өгүүлбэрийн монгол утга — аль өгүүлбэр бүтээхийг ойлгуулна. */
  mn: string;
  /** Зөв гэж тооцох хувилбарууд. Эхнийх нь Tip-д харагдана. */
  answers: string[];
};

export const ROUND_SECONDS = 30;
export const ROUNDS_PER_GAME = 10;
/** Зөв хариултын үндсэн оноо, Tip ашигласан бол бага оноо. */
export const POINTS_CORRECT = 10;
export const POINTS_WITH_TIP = 4;
/** Үлдсэн секунд тутамд нэмэгдэх урамшуулал (дээд тал нь BONUS_MAX). */
export const BONUS_MAX = 10;

export const SENTENCE_PUZZLES: SentencePuzzle[] = [
  { words: ['I', 'go', 'school'], mn: 'Би сургуульд явдаг.', answers: ['I go to school'] },
  { words: ['I', 'went', 'work'], mn: 'Би ажилдаа явсан.', answers: ['I went to work'] },
  { words: ['I', 'study', 'English'], mn: 'Би англи хэл сурдаг.', answers: ['I study English'] },
  { words: ['she', 'likes', 'cats'], mn: 'Тэр муурт дуртай.', answers: ['She likes cats'] },
  { words: ['he', 'is', 'doctor'], mn: 'Тэр эмч.', answers: ['He is a doctor', "He's a doctor"] },
  { words: ['we', 'live', 'Ulaanbaatar'], mn: 'Бид Улаанбаатарт амьдардаг.', answers: ['We live in Ulaanbaatar'] },
  { words: ['they', 'play', 'football'], mn: 'Тэд хөлбөмбөг тоглодог.', answers: ['They play football'] },
  { words: ['I', 'have', 'dog'], mn: 'Надад нохой бий.', answers: ['I have a dog'] },
  { words: ['she', 'drinks', 'coffee'], mn: 'Тэр кофе уудаг.', answers: ['She drinks coffee'] },
  { words: ['he', 'reads', 'book'], mn: 'Тэр ном уншдаг.', answers: ['He reads a book', 'He reads the book'] },
  { words: ['I', 'am', 'student'], mn: 'Би оюутан.', answers: ['I am a student', "I'm a student"] },
  { words: ['it', 'is', 'cold'], mn: 'Хүйтэн байна.', answers: ['It is cold', "It's cold"] },
  { words: ['we', 'eat', 'breakfast'], mn: 'Бид өглөөний цай уудаг.', answers: ['We eat breakfast'] },
  {
    words: ['she', 'works', 'hospital'],
    mn: 'Тэр эмнэлэгт ажилладаг.',
    answers: ['She works in a hospital', 'She works at a hospital', 'She works at the hospital', 'She works in the hospital'],
  },
  { words: ['I', 'listen', 'music'], mn: 'Би хөгжим сонсдог.', answers: ['I listen to music'] },
  { words: ['he', 'goes', 'bed'], mn: 'Тэр орондоо ордог.', answers: ['He goes to bed'] },
  { words: ['they', 'are', 'teachers'], mn: 'Тэд багш нар.', answers: ['They are teachers', "They're teachers"] },
  { words: ['I', 'like', 'apples'], mn: 'Би алимд дуртай.', answers: ['I like apples'] },
  { words: ['she', 'speaks', 'English'], mn: 'Тэр англиар ярьдаг.', answers: ['She speaks English'] },
  { words: ['we', 'watch', 'TV'], mn: 'Бид зурагт үздэг.', answers: ['We watch TV'] },
  { words: ['I', 'wake', 'seven'], mn: 'Би долоон цагт босдог.', answers: ['I wake up at seven', 'I wake at seven'] },
  { words: ['he', 'plays', 'guitar'], mn: 'Тэр гитар тоглодог.', answers: ['He plays the guitar', 'He plays guitar'] },
  { words: ['I', 'am', 'hungry'], mn: 'Би өлсөж байна.', answers: ['I am hungry', "I'm hungry"] },
  { words: ['she', 'has', 'car'], mn: 'Тэр машинтай.', answers: ['She has a car'] },
  { words: ['they', 'went', 'park'], mn: 'Тэд цэцэрлэгт хүрээлэнд явсан.', answers: ['They went to the park', 'They went to a park'] },
  { words: ['I', 'love', 'mother'], mn: 'Би ээждээ хайртай.', answers: ['I love my mother'] },
  { words: ['he', 'is', 'home'], mn: 'Тэр гэртээ байна.', answers: ['He is at home', "He's at home", 'He is home', "He's home"] },
  { words: ['we', 'are', 'friends'], mn: 'Бид найзууд.', answers: ['We are friends', "We're friends"] },
  { words: ['she', 'cooks', 'dinner'], mn: 'Тэр оройн хоол хийдэг.', answers: ['She cooks dinner'] },
  { words: ['I', 'need', 'water'], mn: 'Надад ус хэрэгтэй.', answers: ['I need water', 'I need some water'] },
  { words: ['it', 'is', 'raining'], mn: 'Бороо орж байна.', answers: ['It is raining', "It's raining"] },
  { words: ['they', 'live', 'city'], mn: 'Тэд хотод амьдардаг.', answers: ['They live in the city', 'They live in a city'] },
  { words: ['I', 'want', 'tea'], mn: 'Би цай уухыг хүсч байна.', answers: ['I want tea', 'I want some tea'] },
  {
    words: ['he', 'works', 'bank'],
    mn: 'Тэр банкинд ажилладаг.',
    answers: ['He works in a bank', 'He works at a bank', 'He works at the bank', 'He works in the bank'],
  },
  { words: ['she', 'is', 'nurse'], mn: 'Тэр сувилагч.', answers: ['She is a nurse', "She's a nurse"] },
  { words: ['we', 'go', 'cinema'], mn: 'Бид кино театрт явдаг.', answers: ['We go to the cinema'] },
  { words: ['I', 'open', 'door'], mn: 'Би хаалга онгойлгодог.', answers: ['I open the door'] },
  { words: ['he', 'likes', 'dogs'], mn: 'Тэр нохойд дуртай.', answers: ['He likes dogs'] },
  { words: ['they', 'speak', 'Mongolian'], mn: 'Тэд монголоор ярьдаг.', answers: ['They speak Mongolian'] },
  { words: ['I', 'am', 'tired'], mn: 'Би ядарч байна.', answers: ['I am tired', "I'm tired"] },
  { words: ['she', 'goes', 'work'], mn: 'Тэр ажилдаа явдаг.', answers: ['She goes to work'] },
  { words: ['we', 'have', 'lunch'], mn: 'Бид өдрийн хоол иддэг.', answers: ['We have lunch'] },
  { words: ['he', 'is', 'teacher'], mn: 'Тэр багш.', answers: ['He is a teacher', "He's a teacher"] },
  { words: ['I', 'play', 'basketball'], mn: 'Би сагсан бөмбөг тоглодог.', answers: ['I play basketball'] },
  { words: ['she', 'lives', 'Darkhan'], mn: 'Тэр Дарханд амьдардаг.', answers: ['She lives in Darkhan'] },
  { words: ['they', 'drink', 'milk'], mn: 'Тэд сүү уудаг.', answers: ['They drink milk'] },
  { words: ['I', 'read', 'newspaper'], mn: 'Би сонин уншдаг.', answers: ['I read the newspaper', 'I read a newspaper'] },
  { words: ['he', 'went', 'shop'], mn: 'Тэр дэлгүүр явсан.', answers: ['He went to the shop', 'He went to a shop'] },
  { words: ['we', 'are', 'happy'], mn: 'Бид баяртай байна.', answers: ['We are happy', "We're happy"] },
  { words: ['I', 'sit', 'chair'], mn: 'Би сандал дээр суудаг.', answers: ['I sit on the chair', 'I sit on a chair'] },
  { words: ['she', 'writes', 'letter'], mn: 'Тэр захиа бичдэг.', answers: ['She writes a letter', 'She writes the letter'] },
  { words: ['it', 'is', 'hot'], mn: 'Халуун байна.', answers: ['It is hot', "It's hot"] },
  { words: ['they', 'are', 'students'], mn: 'Тэд оюутнууд.', answers: ['They are students', "They're students"] },
  { words: ['I', 'call', 'father'], mn: 'Би аавдаа залгадаг.', answers: ['I call my father'] },
  { words: ['he', 'drives', 'bus'], mn: 'Тэр автобус жолооддог.', answers: ['He drives a bus', 'He drives the bus'] },
  { words: ['we', 'swim', 'summer'], mn: 'Бид зун сэлдэг.', answers: ['We swim in summer', 'We swim in the summer'] },
  { words: ['she', 'is', 'kitchen'], mn: 'Тэр гал тогоонд байна.', answers: ['She is in the kitchen', "She's in the kitchen"] },
  { words: ['I', 'go', 'bed'], mn: 'Би орондоо ордог.', answers: ['I go to bed'] },
  { words: ['they', 'eat', 'rice'], mn: 'Тэд будаа иддэг.', answers: ['They eat rice'] },
  { words: ['he', 'went', 'school'], mn: 'Тэр сургуульд явсан.', answers: ['He went to school'] },
];

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
  return puzzle.answers.some((a) => normalizeSentence(a) === n);
}

/** Tip-д харуулах жишээ өгүүлбэр (цэгтэй). */
export function exampleSentence(puzzle: SentencePuzzle): string {
  const s = puzzle.answers[0];
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

/** Нэг тоглолтын оноонууд: давтагдахгүй санамсаргүй N өгүүлбэр. */
export function pickRoundPuzzles(count = ROUNDS_PER_GAME): SentencePuzzle[] {
  return shuffle(SENTENCE_PUZZLES).slice(0, Math.min(count, SENTENCE_PUZZLES.length));
}

/** Түлхүүр үгсийг холиод харуулна — дараалал нь өөр байж болно. */
export function shuffledWords(puzzle: SentencePuzzle): string[] {
  const w = shuffle(puzzle.words);
  // Яг адилхан дарааллаар буувал нэг удаа дахин холино (гурван үгтэй тул ихэвчлэн өөрчлөгдөнө).
  return w.every((x, i) => x === puzzle.words[i]) ? shuffle(puzzle.words) : w;
}

/** Хариултын оноо: зөв + үлдсэн хугацааны урамшуулал. Tip ашигласан бол урамшуулалгүй бага оноо. */
export function scoreFor(remainMs: number, usedTip: boolean): number {
  if (usedTip) return POINTS_WITH_TIP;
  const bonus = Math.min(BONUS_MAX, Math.round((remainMs / 1000) / ROUND_SECONDS * BONUS_MAX));
  return POINTS_CORRECT + bonus;
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
