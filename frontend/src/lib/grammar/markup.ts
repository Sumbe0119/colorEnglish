// frontend/src/lib/grammar/markup.ts
// `[She](s) [is](v) [tired](o).` хэлбэрийн markup-ийг өнгөт token болгон задална.

import type { SentencePart } from './types';

export type SentenceToken = {
  text: string;
  part: SentencePart | null;
};

const CODE_TO_PART: Record<string, SentencePart> = {
  s: 'subject',
  v: 'verb',
  o: 'object',
  m: 'modifier',
};

const MARKUP = /\[([^\[\]]+)\]\(([svom])\)/g;

/** Markup-тай мөрийг token-ууд болгоно. Markup-гүй хэсэг `part: null`. */
export function tokenize(en: string): SentenceToken[] {
  const tokens: SentenceToken[] = [];
  let cursor = 0;
  MARKUP.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = MARKUP.exec(en)) !== null) {
    if (match.index > cursor) tokens.push({ text: en.slice(cursor, match.index), part: null });
    tokens.push({ text: match[1], part: CODE_TO_PART[match[2]] });
    cursor = match.index + match[0].length;
  }
  if (cursor < en.length) tokens.push({ text: en.slice(cursor), part: null });
  return tokens;
}

/** Markup-ийг хасаад цэвэр англи өгүүлбэр буцаана (TTS, aria-label, хайлт). */
export function stripMarkup(en: string): string {
  return en.replace(MARKUP, '$1');
}

export function hasMarkup(en: string): boolean {
  MARKUP.lastIndex = 0;
  return MARKUP.test(en);
}

export const PART_LABEL: Record<SentencePart, string> = {
  subject: 'Эзэн',
  verb: 'Үйл үг',
  object: 'Тусагдахуун',
  modifier: 'Нөхцөл',
};

export const PART_HINT: Record<SentencePart, string> = {
  subject: 'Хэн / юу — үйлдлийг хийгч',
  verb: 'Юу хийж байна, ямар байна',
  object: 'Үйл үгийн дараах нэр үг, тэмдэг нэр',
  modifier: 'Хэзээ, хаана, яаж, хэр олон — мөн асуух үг',
};

export const PART_ORDER: SentencePart[] = ['subject', 'verb', 'object', 'modifier'];
