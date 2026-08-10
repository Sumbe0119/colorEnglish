'use client';

export type VoiceGender = 'female' | 'male';

export type SpeakOptions = {
  lang?: string;
  rate?: number;
  gender?: VoiceGender;
  onBoundary?: (charIndex: number, charLength: number) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
};

function genderScore(voice: SpeechSynthesisVoice, gender: VoiceGender): number {
  const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  const femaleHints = ['female', 'woman', 'zira', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'fiona', 'veena', 'susan', 'hazel', 'aria', 'jenny', 'sara', 'linda'];
  const maleHints = ['male', 'man', 'david', 'mark', 'daniel', 'thomas', 'james', 'george', 'alex', 'fred', 'ravi', 'matthew', 'guy', 'tony', 'richard'];

  if (gender === 'female') {
    if (femaleHints.some((h) => name.includes(h))) return 3;
    if (maleHints.some((h) => name.includes(h))) return 0;
    return 1;
  }

  if (maleHints.some((h) => name.includes(h))) return 3;
  if (femaleHints.some((h) => name.includes(h))) return 0;
  return 1;
}

export function pickEnglishVoice(gender: VoiceGender = 'female'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const english = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
  const pool = english.length > 0 ? english : voices;
  if (pool.length === 0) return null;

  return [...pool].sort((a, b) => {
    const scoreDiff = genderScore(b, gender) - genderScore(a, gender);
    if (scoreDiff !== 0) return scoreDiff;
    // Prefer US/GB
    const pref = (v: SpeechSynthesisVoice) =>
      v.lang.toLowerCase().includes('en-us') ? 2 : v.lang.toLowerCase().includes('en-gb') ? 1 : 0;
    return pref(b) - pref(a);
  })[0];
}

export function stopSpeech() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
}

export function speakEnglish(text: string, options: SpeakOptions = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang ?? 'en-US';
  utterance.rate = options.rate ?? 0.85;

  const voice = pickEnglishVoice(options.gender ?? 'female');
  if (voice) utterance.voice = voice;

  utterance.onboundary = (event) => {
    if (event.name === 'word' || event.name === undefined) {
      options.onBoundary?.(event.charIndex, event.charLength || 0);
    }
  };
  utterance.onstart = () => options.onStart?.();
  utterance.onend = () => options.onEnd?.();
  utterance.onerror = () => options.onError?.();

  // Chrome sometimes needs voices loaded first
  const speakNow = () => window.speechSynthesis.speak(utterance);
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const v = pickEnglishVoice(options.gender ?? 'female');
      if (v) utterance.voice = v;
      speakNow();
      window.speechSynthesis.onvoiceschanged = null;
    };
  } else {
    speakNow();
  }
}

/** Single-word / short phrase TTS. */
export function speakEnglishWord(text: string, options: SpeakOptions = {}) {
  speakEnglish(text, { rate: 0.9, ...options });
}

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
