export type PhraseOccurrence = {
  word: string;
  startOffset: number;
  endOffset: number;
  contextSentence: string;
};

type BodyToken = { raw: string; start: number; end: number; key: string };

function normalizeToken(raw: string) {
  return raw.toLowerCase().replace(/[^a-z'-]/g, '');
}

function tokenizeBody(body: string): BodyToken[] {
  const tokens: BodyToken[] = [];
  const regex = /[a-zA-Z]+(?:'[a-zA-Z]+)?/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(body)) !== null) {
    const key = normalizeToken(match[0]);
    if (!key) continue;
    tokens.push({
      raw: match[0],
      start: match.index,
      end: match.index + match[0].length,
      key,
    });
  }
  return tokens;
}

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

/** Every word occurrence in the body (one token each). */
export function extractOccurrencesFromBody(body: string): PhraseOccurrence[] {
  return tokenizeBody(body).map((token) => ({
    word: token.key,
    startOffset: token.start,
    endOffset: token.end,
    contextSentence: extractSentence(body, token.start, token.end),
  }));
}

/** Find occurrences of a word or multi-word phrase (admin-defined, e.g. "look up"). */
export function findOccurrencesOfPhrase(body: string, phrase: string): PhraseOccurrence[] {
  const target = normalizePhrase(phrase);
  if (!target) return [];

  const parts = target.split(' ');
  if (parts.length === 1) {
    return extractOccurrencesFromBody(body).filter((o) => o.word === target);
  }

  const tokens = tokenizeBody(body);
  const results: PhraseOccurrence[] = [];

  for (let i = 0; i <= tokens.length - parts.length; i++) {
    const slice = tokens.slice(i, i + parts.length);
    if (!slice.every((t, j) => t.key === parts[j])) continue;

    const start = slice[0].start;
    const end = slice[slice.length - 1].end;
    results.push({
      word: target,
      startOffset: start,
      endOffset: end,
      contextSentence: extractSentence(body, start, end),
    });
  }

  return results;
}

export function normalizePhrase(raw: string) {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ');
}
