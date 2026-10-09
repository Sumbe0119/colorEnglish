// frontend/src/lib/type-rush.ts
// Тоглоом — бичих уралдааны өгөгдөл: өгүүлбэрийн сан, машинууд, бот хурд, цагийн хязгаар.
import { A1_RULES } from '@/lib/grammar/a1';
import { A2_RULES } from '@/lib/grammar/a2';
import { B1_RULES } from '@/lib/grammar/b1';
import { stripMarkup } from '@/lib/grammar/markup';
import type { GrammarRule } from '@/lib/grammar/types';

export type RaceLevel = 'A1' | 'A2' | 'B1';

export type RaceLevelConfig = {
  code: RaceLevel;
  label: string;
  hint: string;
  /** Уралдааны текстийн доод урт (тэмдэгт). Богино өгүүлбэрүүдийг нийлүүлж энэ уртад хүргэнэ. */
  minChars: number;
  /** Ботуудын WPM хязгаар [min, max]. */
  botWpm: [number, number];
};

export const RACE_LEVELS: RaceLevelConfig[] = [
  { code: 'A1', label: 'A1 · Хялбар', hint: 'Богино, энгийн өгүүлбэрүүд', minChars: 55, botWpm: [14, 30] },
  { code: 'A2', label: 'A2 · Дунд', hint: 'Арай урт өгүүлбэрүүд', minChars: 70, botWpm: [20, 38] },
  { code: 'B1', label: 'B1 · Хүнд', hint: 'Урт, нийлмэл өгүүлбэрүүд', minChars: 85, botWpm: [26, 46] },
];

export const LANES = 5;

/** Цагийн хязгаар (секунд). 0 = хязгааргүй (өгүүлбэр дуустал). */
export type TimeLimit = 0 | 15 | 30 | 60 | 120;

export type TimeLimitOption = {
  value: TimeLimit;
  label: string;
  hint: string;
};

export const TIME_LIMITS: TimeLimitOption[] = [
  { value: 0, label: 'Хязгааргүй', hint: 'Дуустал бич' },
  { value: 15, label: '15 сек', hint: 'Богино текст' },
  { value: 30, label: '30 сек', hint: 'Дунд текст' },
  { value: 60, label: '60 сек', hint: 'Бүтэн текст' },
  { value: 120, label: '120 сек', hint: 'Тайван, бүтэн' },
];

export function getTimeLimitOption(limit: TimeLimit): TimeLimitOption {
  return TIME_LIMITS.find((t) => t.value === limit) ?? TIME_LIMITS[0];
}

/** Өөрийн өгүүлбэрийн урт — backend-ийн MIN_TEXT_LEN/MAX_TEXT_LEN-тэй нийцүүлсэн. */
export const CUSTOM_TEXT_MIN = 10;
export const CUSTOM_TEXT_MAX = 300;

/** Мөр дамжилт, давхар зай, тусгай хашилтыг цэвэрлэж, дээд уртад хүртэл тайрна. */
export function sanitizeCustomText(raw: string): string {
  return raw
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[\u0000-\u001f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, CUSTOM_TEXT_MAX);
}

/** Өөрийн өгүүлбэрийг шалгана. ok=false бол error-т монгол тайлбар байна. */
export function validateCustomText(raw: string): { ok: boolean; text: string; error?: string } {
  const text = sanitizeCustomText(raw);
  if (text.length === 0) return { ok: false, text, error: 'Өгүүлбэрээ бичнэ үү.' };
  if (text.length < CUSTOM_TEXT_MIN) return { ok: false, text, error: `Дор хаяж ${CUSTOM_TEXT_MIN} тэмдэгт байх ёстой.` };
  return { ok: true, text };
}

const CUSTOM_KEY = 'ce-type-rush-custom';

export function loadCustomText(): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(CUSTOM_KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveCustomText(text: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (text.trim()) window.localStorage.setItem(CUSTOM_KEY, text);
    else window.localStorage.removeItem(CUSTOM_KEY);
  } catch {
    /* localStorage хаалттай байж болно */
  }
}

export type RaceCar = {
  id: string;
  /** Монгол нэр (өнгө). */
  name: string;
  /** Англи хоч. */
  nick: string;
  color: string;
  dark: string;
};

export const RACE_CARS: RaceCar[] = [
  { id: 'red', name: 'Улаан', nick: 'Comet', color: '#FF4D4D', dark: '#9E1F1F' },
  { id: 'blue', name: 'Цэнхэр', nick: 'Bolt', color: '#4F8CFF', dark: '#1E3F8A' },
  { id: 'green', name: 'Ногоон', nick: 'Viper', color: '#3DDC97', dark: '#176B48' },
  { id: 'yellow', name: 'Шар', nick: 'Flash', color: '#FFD166', dark: '#8A6A1A' },
  { id: 'purple', name: 'Ягаан', nick: 'Ghost', color: '#B388FF', dark: '#5A3A9E' },
];

export const BOT_NAMES = ['Бат', 'Сараа', 'Тэмүүлэн', 'Номин', 'Анар', 'Хулан', 'Ганаа', 'Долгор', 'Мишээл', 'Отгоо'];

const FALLBACK_SENTENCES = [
  'I am a student.',
  'She is tired today.',
  'They are at school.',
  'My phone is on the table.',
  'We are ready for the test.',
  'He plays football every weekend.',
  'The weather is cold in winter.',
  'I usually drink tea in the morning.',
];

// Зөвхөн англи тэмдэгт, цэг таслал. (’ -> ' болгож хувиргасны дараа шалгана.)
const ENGLISH_ONLY = /^[A-Za-z0-9 ,.'!?;:()-]+$/;

function collectSentences(rules: GrammarRule[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (en: string) => {
    const s = stripMarkup(en).replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
    if (s.length < 12 || s.length > 90) return;
    if (!ENGLISH_ONLY.test(s)) return;
    const key = s.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(s);
  };
  for (const rule of rules) {
    rule.examples.forEach((e) => push(e.en));
    rule.useCases.forEach((u) => u.examples.forEach((e) => push(e.en)));
    rule.forms.forEach((f) => f.examples.forEach((e) => push(e.en)));
    rule.dialogue.forEach((d) => push(d.en));
  }
  return out;
}

let poolCache: Record<RaceLevel, string[]> | null = null;

function getPools(): Record<RaceLevel, string[]> {
  if (!poolCache) {
    poolCache = {
      A1: collectSentences(A1_RULES),
      A2: collectSentences(A2_RULES),
      B1: collectSentences(B1_RULES),
    };
  }
  return poolCache;
}

export function getLevelConfig(level: RaceLevel): RaceLevelConfig {
  return RACE_LEVELS.find((l) => l.code === level) ?? RACE_LEVELS[0];
}

/** Цагийн хязгаартай үед биелүүлж болохуйц бичих хурд (тэмдэгт/сек ≈ 26 WPM). */
const TARGET_CPS = 2.2;

/**
 * Түвшний санд байгаа өгүүлбэрүүдээс санамсаргүй сонгож, доод уртад хүртэл нийлүүлнэ.
 * Хамгийн ихдээ 3 өгүүлбэр. Цагийн хязгаартай бол тухайн хугацаанд дуусгах боломжтой
 * урттай текст гаргана (жишээ нь 15 сек → ~33 тэмдэгт).
 */
export function buildRaceText(level: RaceLevel, avoid?: string, limit: TimeLimit = 0): string {
  const cfg = getLevelConfig(level);
  const base = getPools()[level];
  const basePool = base.length >= 3 ? base : FALLBACK_SENTENCES;
  const minChars = limit > 0 ? Math.min(cfg.minChars, Math.round(limit * TARGET_CPS)) : cfg.minChars;
  // Цагтай үед дээд урт ч бий — өөрөөр бол 15 сек-д 110 тэмдэгт гарч, биелэшгүй болно.
  const maxChars = limit > 0 ? Math.max(minChars, Math.round(limit * TARGET_CPS * 1.2)) : Infinity;

  let pool = basePool;
  if (limit > 0) {
    const fits = basePool.filter((s) => s.length <= maxChars);
    // Нэг ч өгүүлбэр багтахгүй бол хамгийн богиныг авна.
    pool = fits.length ? fits : [[...basePool].sort((a, b) => a.length - b.length)[0]];
  }

  const compose = () => {
    const parts: string[] = [];
    let len = 0;
    let guard = 0;
    while (len < minChars && parts.length < 3 && guard++ < 40) {
      const s = pool[Math.floor(Math.random() * pool.length)];
      if (parts.includes(s)) continue;
      if (len + s.length + (parts.length ? 1 : 0) > maxChars) continue;
      parts.push(s);
      len += s.length + (parts.length > 1 ? 1 : 0);
    }
    return parts.join(' ');
  };

  let text = compose();
  if (avoid && text === avoid) text = compose();
  return text;
}

/** Стандарт WPM: 5 тэмдэгт = 1 үг. */
export function computeWpm(chars: number, ms: number): number {
  if (ms <= 0) return 0;
  return Math.round((chars / 5) / (ms / 60000));
}

export function computeAccuracy(keystrokes: number, errors: number): number {
  if (keystrokes <= 0) return 100;
  return Math.max(0, Math.round(((keystrokes - errors) / keystrokes) * 100));
}

export type BotProfile = {
  wpm: number;
  /** Эхлэх хоцролт (мс) — GO дарсны дараа жаахан хоцорч хөдөлнө. */
  delay: number;
  /** Хурдны долгионы фаз. */
  phase: number;
};

/** 4 ботод тархсан (бага → их) хурд өгнө, бага зэрэг санамсаргүй. */
export function buildBotProfiles(level: RaceLevel, count: number): BotProfile[] {
  const [min, max] = getLevelConfig(level).botWpm;
  const profiles: BotProfile[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const wpm = Math.round(min + (max - min) * t + (Math.random() * 6 - 3));
    profiles.push({
      wpm: Math.max(8, wpm),
      delay: 200 + Math.random() * 500,
      phase: Math.random() * Math.PI * 2,
    });
  }
  // Хурдыг замуудад санамсаргүй тарааж өгнө
  for (let i = profiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [profiles[i], profiles[j]] = [profiles[j], profiles[i]];
  }
  return profiles;
}

const WAVE_FREQ = 0.9; // rad/s
const WAVE_AMP = 0.1; // backend type-rush.service.ts-тэй ижил байх ёстой

/**
 * Ботын бичсэн тэмдэгтийн тоо (цаг хугацааны функц).
 * Хурд нь 1 ± 15% долгионтой боловч интеграл хэлбэрээр тооцсон тул хэзээ ч ухрахгүй.
 */
export function botCharsAt(bot: BotProfile, elapsedMs: number): number {
  const t = Math.max(0, (elapsedMs - bot.delay) / 1000);
  const cps = (bot.wpm * 5) / 60;
  const wave = (WAVE_AMP / WAVE_FREQ) * (Math.cos(bot.phase) - Math.cos(WAVE_FREQ * t + bot.phase));
  return cps * (t + wave);
}

const BEST_KEY = 'ce-type-rush-best';

export type BestRecord = { ms: number; wpm: number };

/** Рекордыг түвшин + цагийн хязгаар тус бүрээр хадгална (хязгааргүй = хуучин түлхүүр). */
function bestKey(level: RaceLevel, limit: TimeLimit): string {
  return limit > 0 ? `${BEST_KEY}:${level}:${limit}` : `${BEST_KEY}:${level}`;
}

export function loadBest(level: RaceLevel, limit: TimeLimit = 0): BestRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(bestKey(level, limit));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BestRecord;
    if (typeof parsed.ms !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Шинэ рекорд бол хадгалаад true буцаана. */
export function saveBestIfBetter(level: RaceLevel, record: BestRecord, limit: TimeLimit = 0): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const prev = loadBest(level, limit);
    if (prev && prev.ms <= record.ms) return false;
    window.localStorage.setItem(bestKey(level, limit), JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}
