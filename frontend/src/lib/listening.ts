// frontend/src/lib/listening.ts
// "Сонсох" тоглоомын цэвэр логик: үг хайх (backend/src/listening/transcript.ts-ийн tokenize-тэй ижил),
// үгийн хэлэгдсэн мөчүүдийг тооцох, дарсан мөчүүдийг хэлэгдсэн мөчүүдтэй тулгах.
import type { Segment } from './listening-services';

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9'\s-]+/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^['-]+|['-]+$/g, ''))
    .filter((w) => w.length > 0);
}

export interface Occurrence {
  /** Мөрийн индекс */
  segIndex: number;
  /** Мөр дотор хэд дэх үг (0-based) */
  tokenIndex: number;
  /** Таамагласан хэлэгдсэн мөч (сек) — мөрийн дотор шугаман хуваарилалт */
  time: number;
}

/** Үгийн бүх хэлэгдсэн мөч */
export function occurrencesOf(segments: Segment[], word: string): Occurrence[] {
  const w = word.toLowerCase();
  const out: Occurrence[] = [];
  segments.forEach((s, segIndex) => {
    const tokens = tokenize(s.text);
    if (!tokens.length) return;
    const dur = Math.max(0.5, s.end - s.start);
    tokens.forEach((t, tokenIndex) => {
      if (t === w) out.push({ segIndex, tokenIndex, time: s.start + (dur * (tokenIndex + 0.5)) / tokens.length });
    });
  });
  return out;
}

/** Дарах цонх: хэлэгдэхээс өмнө / дараа хэдэн секундийг зөвшөөрөх (хадмалын цаг тодорхойгүй тул өргөн) */
export const CLICK_BEFORE_SEC = 1.5;
export const CLICK_AFTER_SEC = 3.0;

export interface MatchResult {
  /** Хэлэгдсэн мөч бүр: дарсан эсэх */
  hits: { occ: Occurrence; clickTime: number | null }[];
  /** Ямар ч хэлэгдсэн мөчтэй таараагүй дарсан мөчүүд */
  extras: number[];
  missed: number;
}

/** Дарсан мөчүүдийг хэлэгдсэн мөчүүдтэй greedy тулгана (хамгийн ойрын, нэг удаа) */
export function matchClicks(occs: Occurrence[], clicks: number[]): MatchResult {
  const sortedClicks = [...clicks].sort((a, b) => a - b);
  const used = new Set<number>();
  const hits = occs.map((occ) => ({ occ, clickTime: null as number | null }));
  for (const c of sortedClicks) {
    let best = -1;
    let bestDist = Infinity;
    hits.forEach((h, i) => {
      if (h.clickTime != null) return;
      const d = c - h.occ.time;
      if (d < -CLICK_BEFORE_SEC || d > CLICK_AFTER_SEC) return;
      const dist = Math.abs(d);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    if (best >= 0) {
      hits[best].clickTime = c;
      used.add(c);
    }
  }
  const extras = sortedClicks.filter((c) => !used.has(c));
  return { hits, extras, missed: hits.filter((h) => h.clickTime == null).length };
}

export function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export const LEVEL_LABELS: Record<string, string> = {
  A1: 'A1 · Анхан',
  A2: 'A2 · Суурь',
  B1: 'B1 · Дунд',
  B1_PLUS: 'B1+ · Дунд',
  B2: 'B2 · Ахисан',
  B2_PLUS: 'B2+ · Ахисан',
  C1: 'C1 · Гүнзгий',
  C2: 'C2 · Гүнзгий',
};

/** Мөрийн текстийг үгээр хувааж, сонгосон үгсийн алийг нь таарсныг (индекс, -1 = үгүй) тэмдэглэх (render-д) */
export function splitHighlight(text: string, words: string[]): { text: string; idx: number }[] {
  const ws = words.map((w) => w.toLowerCase());
  const parts = text.split(/(\s+)/);
  return parts.map((p) => {
    const tok = tokenize(p);
    const idx = tok.length === 1 ? ws.indexOf(tok[0]) : -1;
    return { text: p, idx };
  });
}

/** Нэг дор сонсож болох үгийн дээд тоо */
export const MAX_WORDS = 4;

/** Үгийн дарааллын өнгө (товч, CC тэмдэглэгээ) */
export const WORD_COLORS = ['#3DDC97', '#4F8CFF', '#FFD166', '#C58CFF'];

/** Үг бүрийн үр дүн */
export interface WordOutcome {
  word: string;
  expected: number;
  clicked: number;
  correct: boolean;
  match: MatchResult;
}
