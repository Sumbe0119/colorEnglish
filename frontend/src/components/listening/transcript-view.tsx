// frontend/src/components/listening/transcript-view.tsx
// CC (хадмал) харагдац: мөр бүр, сонгосон үгс тус бүрийн өнгөөр тодорсон; хэлэгдсэн мөч бүр дарсан (✓) / алдсан (✗).
// Мөр дээр дарвал видеог тэр мөч рүү гүйлгэж тоглуулна.
'use client';

import { Check, Play, X } from 'lucide-react';
import type { Segment } from '@/lib/listening-services';
import { formatTime, splitHighlight, WORD_COLORS, type WordOutcome } from '@/lib/listening';

export function TranscriptView({
  segments,
  outcomes,
  currentTime,
  onSeek,
}: {
  segments: Segment[];
  /** Сонгосон үг бүрийн үр дүн (дарааллаар — өнгө нь WORD_COLORS) */
  outcomes: WordOutcome[];
  currentTime?: number;
  onSeek: (sec: number) => void;
}) {
  const words = outcomes.map((o) => o.word);
  // [wordIdx][segIndex] → хэлэгдсэн мөч бүр дарсан эсэх (дарааллаар)
  const hitsBySeg = outcomes.map((o) => {
    const m = new Map<number, boolean[]>();
    for (const h of o.match.hits) {
      if (!m.has(h.occ.segIndex)) m.set(h.occ.segIndex, []);
      m.get(h.occ.segIndex)!.push(h.clickTime != null);
    }
    return m;
  });
  // Илүү дарсан мөчүүд → мөр
  const extraBySeg = new Map<number, { idx: number; n: number }[]>();
  outcomes.forEach((o, idx) => {
    for (const t of o.match.extras) {
      const i = segments.findIndex((s) => t >= s.start - 0.5 && t < s.end + 0.5);
      if (i < 0) continue;
      const list = extraBySeg.get(i) ?? [];
      const e = list.find((x) => x.idx === idx);
      if (e) e.n++;
      else list.push({ idx, n: 1 });
      extraBySeg.set(i, list);
    }
  });

  return (
    <ol className="ce-scroll max-h-80 space-y-1 overflow-y-auto rounded-xl border border-ink-600/80 bg-ink-950/60 p-2">
      {segments.map((s, i) => {
        const parts = splitHighlight(s.text, words);
        const counters = words.map(() => 0);
        const active = currentTime != null && currentTime >= s.start && currentTime < s.end;
        const has = parts.some((p) => p.idx >= 0);
        const extras = extraBySeg.get(i) ?? [];
        return (
          <li key={i}>
            <button
              type="button"
              onClick={() => onSeek(Math.max(0, s.start - 0.3))}
              className={`group flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-ink-800 ${
                active ? 'bg-brand/10' : has ? 'bg-ink-900/60' : ''
              }`}
            >
              <span className="mt-0.5 inline-flex w-12 shrink-0 items-center gap-1 font-mono text-[11px] text-mist-500">
                <Play className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                {formatTime(s.start)}
              </span>
              <span className="min-w-0 flex-1 leading-relaxed text-mist-200">
                {parts.map((p, j) => {
                  if (p.idx < 0) return <span key={j}>{p.text}</span>;
                  const hit = hitsBySeg[p.idx]?.get(i)?.[counters[p.idx]++];
                  const color = WORD_COLORS[p.idx % WORD_COLORS.length];
                  return (
                    <mark
                      key={j}
                      className="rounded px-1 font-semibold ring-1"
                      style={{ background: `${color}26`, color, boxShadow: `0 0 0 1px ${hit === false ? '#FF6B7A' : color}99` }}
                    >
                      {p.text}
                      {hit === true && <Check className="ml-0.5 inline h-3 w-3 text-success" />}
                      {hit === false && <X className="ml-0.5 inline h-3 w-3 text-danger" />}
                    </mark>
                  );
                })}
                {extras.map((e) => (
                  <span key={e.idx} className="ml-2 rounded bg-warning/20 px-1.5 py-0.5 text-[10px] font-semibold text-warning">
                    «{words[e.idx]}» илүү дарсан ×{e.n}
                  </span>
                ))}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
