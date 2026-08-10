import { Injectable, Logger } from '@nestjs/common';

const LOCAL_EN_MN: Record<string, string> = {
  a: 'нэг (тодорхойгүй)',
  an: 'нэг (тодорхойгүй)',
  the: 'тухайлсан',
};

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  async translateEnToMn(text: string, contextSentence?: string): Promise<string> {
    const trimmed = text.trim();
    if (!trimmed) return '';

    const key = trimmed.toLowerCase();
    if (LOCAL_EN_MN[key] && !contextSentence) return LOCAL_EN_MN[key];
    if (LOCAL_EN_MN[key] && ARTICLES.has(key)) return LOCAL_EN_MN[key];

    // Prefer contextual gloss when sentence differs — MyMemory gets a short prompt.
    const query =
      contextSentence && contextSentence.trim().length > 0
        ? `${trimmed} (as in: ${contextSentence.trim()})`
        : trimmed;

    const q = encodeURIComponent(query);
    const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=en|mn`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as {
        responseStatus: number;
        responseData?: { translatedText?: string };
      };

      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return cleanupGloss(data.responseData.translatedText.trim(), trimmed);
      }
    } catch (err) {
      this.logger.warn(`MyMemory translation failed for "${trimmed}": ${err}`);
    }

    if (LOCAL_EN_MN[key]) return LOCAL_EN_MN[key];
    return trimmed;
  }
}

const ARTICLES = new Set(['a', 'an', 'the']);

function cleanupGloss(raw: string, original: string) {
  // If API echoed the whole prompt, fall back to plain phrase translation leftovers.
  const withoutParen = raw.replace(/\s*\(as in:.*?\)\s*/gi, '').trim();
  if (withoutParen && withoutParen.toLowerCase() !== original.toLowerCase()) {
    return withoutParen;
  }
  return raw;
}
