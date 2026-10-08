// frontend/src/lib/type-rush.ts
// Type Rush — бичих уралдааны өгөгдөл: өгүүлбэрийн сан, машинууд, бот хурд.
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

/**
 * Түвшний санд байгаа өгүүлбэрүүдээс санамсаргүй сонгож, доод уртад хүртэл нийлүүлнэ.
 * Хамгийн ихдээ 3 өгүүлбэр.
 */
export function buildRaceText(level: RaceLevel, avoid?: string): string {
  const cfg = getLevelConfig(level);
  const base = getPools()[level];
  const pool = base.length >= 3 ? base : FALLBACK_SENTENCES;

  const compose = () => {
    const parts: string[] = [];
    let len = 0;
    let guard = 0;
    while (len < cfg.minChars && parts.length < 3 && guard++ < 30) {
      const s = pool[Math.floor(Math.random() * pool.length)];
      if (parts.includes(s)) continue;
      parts.push(s);
      len += s.length + 1;
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

export function loadBest(level: RaceLevel): BestRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`${BEST_KEY}:${level}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BestRecord;
    if (typeof parsed.ms !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Шинэ рекорд бол хадгалаад true буцаана. */
export function saveBestIfBetter(level: RaceLevel, record: BestRecord): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const prev = loadBest(level);
    if (prev && prev.ms <= record.ms) return false;
    window.localStorage.setItem(`${BEST_KEY}:${level}`, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}
