// backend/src/listening/transcript.ts
// YouTube transcript татах, клипийн хүрээгээр тайрах, үгийн давтамж тоолох туслах функцууд.
// Frontend (lib/listening.ts) яг ижил tokenize дүрэм ашиглана — өөрчилбөл хоёуланг нь өөрчил.
import { YoutubeTranscript } from 'youtube-transcript';

export interface Segment {
  /** Секунд (видеоны абсолют цаг) */
  start: number;
  end: number;
  text: string;
}

/** Тоглоомд санал болгохгүй түгээмэл үгс (article, pronoun, preposition, auxiliary …) */
export const STOPWORDS = new Set(
  (
    'a an the and or but so if then than that this these those there here it its i me my mine you your yours he him his she her hers we us our ours they them their theirs ' +
    'is am are was were be been being do does did done have has had having will would shall should can could may might must ' +
    'to of in on at by for from with without about into onto over under up down out off as not no nor yes ' +
    'what which who whom whose when where why how all any both each few more most other some such only own same too very just also ' +
    'because while until before after again further once ever never always ' +
    "don't doesn't didn't isn't aren't wasn't weren't can't couldn't won't wouldn't shouldn't i'm i've i'll i'd you're you've you'll you'd he's she's it's we're we've we'll they're they've they'll that's there's here's what's who's let's " +
    'im ive ill id youre youve youll youd hes shes its were weve well theyre theyve theyll thats theres heres whats whos lets dont doesnt didnt isnt arent wasnt werent cant couldnt wont wouldnt shouldnt ' +
    'um uh oh ah yeah okay ok like really actually kind sort thing things lot lots get got gets going go went gonna wanna gotta know think mean say said says see look right now one two three way much many something anything nothing everything someone anyone everyone ' +
    'music applause laughter'
  ).split(/\s+/),
);

const ENTITY_MAP: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

export function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&([a-z]+);/gi, (m, name: string) => ENTITY_MAP[name.toLowerCase()] ?? m)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** YouTube URL эсвэл ID → 11 тэмдэгттэй video ID */
export function parseYoutubeId(input: string): string | null {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.slice(1).split('/')[0];
      return /^[\w-]{11}$/.test(id) ? id : null;
    }
    const v = u.searchParams.get('v');
    if (v && /^[\w-]{11}$/.test(v)) return v;
    const m = u.pathname.match(/\/(embed|shorts|live)\/([\w-]{11})/);
    if (m) return m[2];
  } catch {
    /* URL биш */
  }
  return null;
}

/** Transcript-ийн бүх мөр (секундээр). Хэл олдохгүй бол ямар ч хэлийг авна. */
export async function fetchTranscript(youtubeId: string): Promise<Segment[]> {
  let raw: { text: string; duration: number; offset: number }[];
  try {
    raw = await YoutubeTranscript.fetchTranscript(youtubeId, { lang: 'en' });
  } catch {
    raw = await YoutubeTranscript.fetchTranscript(youtubeId);
  }
  if (!raw.length) return [];
  // Хувилбараас хамаарч offset нь мс эсвэл секунд байж болно: 5.5 цагаас их "секунд" байх боломжгүй → мс
  const maxOffset = Math.max(...raw.map((r) => r.offset));
  const k = maxOffset > 20_000 ? 1000 : 1;
  return raw
    .map((r) => ({ start: r.offset / k, end: (r.offset + r.duration) / k, text: decodeEntities(r.text) }))
    .filter((r) => r.text && !/^\[.*\]$/.test(r.text) && !/^Translator:|^Reviewer:/i.test(r.text));
}

/** Клипийн хүрээнд (start..end) орох мөрүүд — хагас орсон мөрийг оруулна */
export function sliceSegments(all: Segment[], startSec: number, endSec: number): Segment[] {
  return all.filter((s) => s.end > startSec + 0.2 && s.start < endSec - 0.2);
}

/** Үг болгон хуваана (жижиг үсэг, апостроф хадгална, бусад цэг таслал хасна) */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9'\s-]+/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^['-]+|['-]+$/g, ''))
    .filter((w) => w.length > 0);
}

export function countWords(segments: Segment[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const s of segments) for (const w of tokenize(s.text)) counts[w] = (counts[w] ?? 0) + 1;
  const out: Record<string, number> = {};
  for (const [w, n] of Object.entries(counts)) {
    if (n >= 2 && w.length >= 3 && !STOPWORDS.has(w) && !/^\d+$/.test(w)) out[w] = n;
  }
  return out;
}

/** Тоглоомд санал болгох үгс: давтамжаар, 3+ удаа (цөөн бол 2+) */
export function candidateWords(wordCounts: Record<string, number>, limit = 12): { word: string; count: number }[] {
  const entries = Object.entries(wordCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const strong = entries.filter(([, n]) => n >= 3);
  const list = strong.length >= 4 ? strong : entries;
  return list.slice(0, limit).map(([word, count]) => ({ word, count }));
}

/** Тухайн үг клипт хэдэн удаа хэлэгдсэн */
export function countOf(segments: Segment[], word: string): number {
  const w = word.toLowerCase();
  let n = 0;
  for (const s of segments) for (const t of tokenize(s.text)) if (t === w) n++;
  return n;
}
