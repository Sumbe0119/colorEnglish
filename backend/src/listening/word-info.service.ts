// backend/src/listening/word-info.service.ts
// Үгийн дэлгэрэнгүй тайлбар: орчуулга, үгсийн аймаг, хэлбэрүүд, жишээ, дүрмийн тэмдэглэл, холбоо үг.
// Claude-оор үүсгээд ListeningWordInfo хүснэгтэд кэшилнэ. API key байхгүй / алдаа гарвал
// MyMemory орчуулга дээр суурилсан энгийн (basic) тайлбар буцаана — дараа нь дахин үүсгэж болно.
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TranslationService } from '../translation/translation.service';

export interface WordInfo {
  word: string;
  ipa: string | null;
  /** noun, verb, adjective … (нэгээс олон байж болно) */
  pos: string[];
  /** Монгол утга (товч) */
  meaningMn: string;
  /** Англи тодорхойлолт (энгийн үгээр) */
  definitionEn: string;
  /** Үгийн хэлбэрүүд: go – went – gone / goes / going; child – children … */
  forms: string;
  /** Хэрэглээний дүрэм, монголоор (ямар бүтцэд ордог, ямар угтвар үгтэй, нийтлэг алдаа) */
  grammarMn: string;
  examples: { en: string; mn: string }[];
  collocations: string[];
  synonyms: string[];
  /** CEFR түвшин: A1..C2 */
  level: string | null;
  /** Энэ клипт ямар утгаар орсон (контекст өгүүлбэр өгсөн бол) */
  inContextMn: string | null;
}

/** basic кэшийг AI-аар дахин оролдох хоорондын хугацаа */
const RETRY_COOLDOWN_MS = 60 * 60 * 1000;

const SYSTEM_PROMPT = `You are an expert English teacher for Mongolian learners. For the given English word, return ONLY a JSON object (no markdown, no prose) with exactly these keys:
{
  "word": string,
  "ipa": string | null,
  "pos": string[],              // parts of speech it is used as, e.g. ["verb", "noun"]
  "meaningMn": string,          // concise Mongolian meaning(s), separated by ";" if several
  "definitionEn": string,       // simple English definition
  "forms": string,              // word forms: for verbs "base – past – past participle / 3rd person / -ing"; nouns plural; adjectives comparative/superlative; related derivations
  "grammarMn": string,          // 2-4 sentences in Mongolian: how it is used grammatically (transitive/intransitive, prepositions it takes, typical patterns, common mistakes Mongolian speakers make)
  "examples": [{"en": string, "mn": string}],   // 3 natural example sentences with accurate Mongolian translations
  "collocations": string[],     // 4-6 common collocations/phrases
  "synonyms": string[],         // 3-5 synonyms or near-synonyms
  "level": string | null,       // CEFR level A1..C2
  "inContextMn": string | null  // if a context sentence is given: what the word means in that sentence, in Mongolian
}
Mongolian text must be natural, grammatically correct Cyrillic Mongolian. Keep it accurate and learner-friendly.`;

@Injectable()
export class WordInfoService {
  private readonly logger = new Logger(WordInfoService.name);
  private client: Anthropic | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly translation: TranslationService,
  ) {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY')?.trim();
    if (apiKey) this.client = new Anthropic({ apiKey });
  }

  isAiConfigured() {
    return !!this.client;
  }

  /**
   * Кэшээс авна; байхгүй бол үүсгэж хадгална. Нэг үг = нэг удаа Claude (бүх клип, бүх хэрэглэгчид хуваалцана).
   * basic (AI-гүй үүссэн) кэш байхад AI бэлэн болсон бол дахин үүсгэнэ — гэхдээ RETRY_COOLDOWN_MS-ээс
   * ойрхон оролдоогүй үед л (Claude алдаа өгөөд байвал хүсэлт бүрт давтан дуудахгүй).
   */
  async getOrCreate(rawWord: string, context?: string, force = false): Promise<{ info: WordInfo; source: string }> {
    const word = rawWord.trim().toLowerCase();
    const cached = await this.prisma.listeningWordInfo.findUnique({ where: { word } });
    if (cached && !force) {
      const retryBasic = cached.source === 'basic' && this.client && Date.now() - cached.updatedAt.getTime() > RETRY_COOLDOWN_MS;
      if (!retryBasic) return { info: cached.info as unknown as WordInfo, source: cached.source };
    }
    let info: WordInfo | null = null;
    let source = 'basic';
    if (this.client) {
      try {
        info = await this.generateWithClaude(word, context);
        source = 'claude';
      } catch (err) {
        this.logger.warn(`Claude word info failed for "${word}": ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    if (!info) info = await this.basicInfo(word, context);
    const data = { info: info as unknown as Prisma.InputJsonValue, source };
    await this.prisma.listeningWordInfo.upsert({ where: { word }, create: { word, ...data }, update: data });
    return { info, source };
  }

  /**
   * Урьдчилан бэлтгэх: клипийн санал болгох үгсийн тайлбарыг сервер дээр нэг удаа үүсгэж кэшилнэ
   * (хэрэглэгч тоглох үед Claude дуудагдахгүй). Дараалан, нэг зэрэг нэгийг л — rate limit / зардал хэмнэнэ.
   * Аль хэдийн claude тайлбартай үгийг алгасна. Буцаах: шинээр үүсгэсэн тоо.
   */
  async warmMany(items: { word: string; context?: string }[]): Promise<{ generated: number; skipped: number; failed: number }> {
    const out = { generated: 0, skipped: 0, failed: 0 };
    if (!this.client) return out;
    const words = [...new Set(items.map((i) => i.word.trim().toLowerCase()).filter(Boolean))];
    if (!words.length) return out;
    const existing = await this.prisma.listeningWordInfo.findMany({ where: { word: { in: words } }, select: { word: true, source: true } });
    const done = new Set(existing.filter((e) => e.source === 'claude').map((e) => e.word));
    for (const item of items) {
      const word = item.word.trim().toLowerCase();
      if (done.has(word)) {
        out.skipped++;
        continue;
      }
      done.add(word);
      try {
        const r = await this.getOrCreate(word, item.context);
        if (r.source === 'claude') out.generated++;
        else out.failed++;
      } catch {
        out.failed++;
      }
    }
    return out;
  }

  private async generateWithClaude(word: string, context?: string): Promise<WordInfo> {
    const client = this.client!;
    const user = context ? `Word: "${word}"\nContext sentence from a video: "${context}"` : `Word: "${word}"`;
    const response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 4000,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: user }],
    });
    if (response.stop_reason === 'refusal') throw new Error('refused');
    const text = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start < 0 || end < 0) throw new Error('no JSON in response');
    const parsed = JSON.parse(text.slice(start, end + 1)) as Partial<WordInfo>;
    return this.normalize(word, parsed);
  }

  private normalize(word: string, p: Partial<WordInfo>): WordInfo {
    const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v.trim() : fallback);
    const arr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').map((x) => x.trim()).filter(Boolean) : []);
    return {
      word,
      ipa: str(p.ipa) || null,
      pos: arr(p.pos),
      meaningMn: str(p.meaningMn),
      definitionEn: str(p.definitionEn),
      forms: str(p.forms),
      grammarMn: str(p.grammarMn),
      examples: Array.isArray(p.examples)
        ? p.examples
            .filter((e): e is { en: string; mn: string } => !!e && typeof e === 'object' && typeof (e as { en?: unknown }).en === 'string')
            .map((e) => ({ en: e.en.trim(), mn: str(e.mn) }))
            .slice(0, 5)
        : [],
      collocations: arr(p.collocations).slice(0, 8),
      synonyms: arr(p.synonyms).slice(0, 8),
      level: str(p.level) || null,
      inContextMn: str(p.inContextMn) || null,
    };
  }

  /** AI байхгүй үеийн энгийн тайлбар: MyMemory орчуулга + контекст өгүүлбэр */
  private async basicInfo(word: string, context?: string): Promise<WordInfo> {
    const meaningMn = await this.translation.translateEnToMn(word);
    return {
      word,
      ipa: null,
      pos: [],
      meaningMn: meaningMn && meaningMn.toLowerCase() !== word ? meaningMn : '',
      definitionEn: '',
      forms: '',
      grammarMn: 'Дэлгэрэнгүй тайлбар бэлтгэгдээгүй байна (AI тохируулаагүй). Орчуулгыг автомат орчуулагчаас авлаа.',
      examples: context ? [{ en: context, mn: '' }] : [],
      collocations: [],
      synonyms: [],
      level: null,
      inContextMn: null,
    };
  }
}
