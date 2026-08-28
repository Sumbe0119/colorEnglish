'use client';

export type { VoiceGender, SpeakOptions } from '@/components/reading/elevenlabs-speech';
export {
  pickEnglishVoice,
  stopAllSpeech as stopSpeech,
  speakWithElevenLabs as speakEnglish,
  speakWordWithElevenLabs as speakEnglishWord,
} from '@/components/reading/elevenlabs-speech';

export function normalizeWord(raw: string) {
  return raw.toLowerCase().replace(/[^a-z'-]/g, '');
}

export function normalizePhrase(raw: string) {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ');
}

export type PassageSegment =
  | { kind: 'text'; text: string }
  | {
      kind: 'word';
      text: string;
      key: string;
      startOffset: number;
      endOffset: number;
      meaningMn?: string;
      annotationId?: string;
      contextSentence?: string;
    };

type Annotation = {
  id: string;
  word: string;
  meaningMn: string;
  startOffset: number;
  endOffset: number;
};

export type TokenSpan = {
  key: string;
  start: number;
  end: number;
  contextSentence: string;
};

function extractSentence(body: string, start: number, end: number): string {
  const left = Math.max(
    0,
    body.lastIndexOf('.', start - 1) + 1,
    body.lastIndexOf('!', start - 1) + 1,
    body.lastIndexOf('?', start - 1) + 1,
    body.lastIndexOf('\n', start - 1) + 1,
  );
  let right = body.length;
  for (const ch of ['.', '!', '?', '\n']) {
    const idx = body.indexOf(ch, end);
    if (idx !== -1 && idx < right) right = idx + 1;
  }
  return body.slice(left, right).replace(/\s+/g, ' ').trim();
}

export function buildTokenSpans(body: string): TokenSpan[] {
  const tokens: TokenSpan[] = [];
  const regex = /[a-zA-Z]+(?:'[a-zA-Z]+)?/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(body)) !== null) {
    const key = normalizeWord(match[0]);
    if (!key) continue;
    const start = match.index;
    const end = start + match[0].length;
    tokens.push({
      key,
      start,
      end,
      contextSentence: extractSentence(body, start, end),
    });
  }
  return tokens;
}

/** Build passage using annotation offsets — only annotated spans are interactive. */
export function buildPassageSegments(body: string, annotations: Annotation[]): PassageSegment[] {
  const sorted = [...annotations]
    .filter((a) => a.startOffset >= 0 && a.endOffset > a.startOffset && a.endOffset <= body.length)
    .sort((a, b) => a.startOffset - b.startOffset || b.endOffset - a.endOffset);

  const segments: PassageSegment[] = [];
  let cursor = 0;

  for (const ann of sorted) {
    if (ann.startOffset < cursor) continue;
    if (cursor < ann.startOffset) {
      segments.push({ kind: 'text', text: body.slice(cursor, ann.startOffset) });
    }

    const text = body.slice(ann.startOffset, ann.endOffset);
    segments.push({
      kind: 'word',
      text,
      key: normalizePhrase(ann.word) || normalizePhrase(text),
      startOffset: ann.startOffset,
      endOffset: ann.endOffset,
      meaningMn: ann.meaningMn,
      annotationId: ann.id,
    });
    cursor = ann.endOffset;
  }

  if (cursor < body.length) {
    segments.push({ kind: 'text', text: body.slice(cursor) });
  }

  return segments;
}

/** All tokens + multi-word annotations for student view with speech highlight. */
export function buildReaderSegments(body: string, annotations: Annotation[]): PassageSegment[] {
  const bySpan = new Map(annotations.map((a) => [`${a.startOffset}:${a.endOffset}`, a] as const));
  const multiAnns = annotations
    .filter((a) => a.word.includes(' '))
    .sort((a, b) => a.startOffset - b.startOffset || b.endOffset - a.endOffset);

  const tokens = buildTokenSpans(body);
  const segments: PassageSegment[] = [];
  let cursor = 0;
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];
    if (cursor < token.start) {
      segments.push({ kind: 'text', text: body.slice(cursor, token.start) });
    }

    const multi = multiAnns.find((a) => a.startOffset === token.start);
    if (multi) {
      let j = i;
      while (j < tokens.length && tokens[j].end <= multi.endOffset) j += 1;
      segments.push({
        kind: 'word',
        text: body.slice(multi.startOffset, multi.endOffset),
        key: multi.word,
        startOffset: multi.startOffset,
        endOffset: multi.endOffset,
        meaningMn: multi.meaningMn,
        annotationId: multi.id,
        contextSentence: token.contextSentence,
      });
      cursor = multi.endOffset;
      i = j;
      continue;
    }

    const ann = bySpan.get(`${token.start}:${token.end}`);
    segments.push({
      kind: 'word',
      text: body.slice(token.start, token.end),
      key: token.key,
      startOffset: token.start,
      endOffset: token.end,
      meaningMn: ann?.meaningMn,
      annotationId: ann?.id,
      contextSentence: token.contextSentence,
    });
    cursor = token.end;
    i += 1;
  }

  if (cursor < body.length) {
    segments.push({ kind: 'text', text: body.slice(cursor) });
  }

  return segments;
}

/** Split chapter body into mobile-friendly pages at sentence boundaries. */
export function splitBodyIntoPages(
  body: string,
  maxChars = 420,
): { start: number; end: number; text: string }[] {
  const trimmed = body.trimEnd();
  if (!trimmed) return [{ start: 0, end: 0, text: '' }];

  const sentences: { start: number; end: number }[] = [];
  const re = /[^.!?\n]+[.!?]+(?:["')\]]+)?|\S[^\n]*(?:\n|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(trimmed)) !== null) {
    const start = m.index;
    const end = start + m[0].length;
    if (m[0].trim()) sentences.push({ start, end });
  }
  if (sentences.length === 0) {
    return [{ start: 0, end: trimmed.length, text: trimmed }];
  }

  const pages: { start: number; end: number; text: string }[] = [];
  let pageStart = sentences[0].start;
  let pageEnd = sentences[0].end;

  for (let i = 1; i < sentences.length; i++) {
    const next = sentences[i];
    if (next.end - pageStart <= maxChars) {
      pageEnd = next.end;
    } else {
      pages.push({ start: pageStart, end: pageEnd, text: trimmed.slice(pageStart, pageEnd) });
      pageStart = next.start;
      pageEnd = next.end;
    }
  }
  pages.push({ start: pageStart, end: pageEnd, text: trimmed.slice(pageStart, pageEnd) });
  return pages;
}

export function findNextSentenceStart(body: string, charIndex: number): number {
  const from = Math.max(0, charIndex);
  const re = /[.!?]["')\]]*\s+/g;
  re.lastIndex = from;
  const m = re.exec(body);
  if (!m) return body.length;
  return m.index + m[0].length;
}

export function findPrevSentenceStart(body: string, charIndex: number): number {
  if (charIndex <= 0) return 0;
  const before = body.slice(0, Math.max(0, charIndex - 1));
  const re = /[.!?]["')\]]*\s+/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(before)) !== null) {
    last = m.index + m[0].length;
  }
  return last;
}
