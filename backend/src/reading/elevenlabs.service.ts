// backend/src/reading/elevenlabs.service.ts
import { BadRequestException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type TtsGender = 'female' | 'male';

export type TtsAlignment = {
  characters: string[];
  characterStartTimesSeconds: number[];
  characterEndTimesSeconds: number[];
};

export type TtsResult = {
  audioBase64: string;
  contentType: string;
  alignment: TtsAlignment | null;
  provider: 'elevenlabs';
  voiceId: string;
};

@Injectable()
export class ElevenLabsService {
  private readonly logger = new Logger(ElevenLabsService.name);

  constructor(private config: ConfigService) {}

  isConfigured() {
    return Boolean(this.config.get<string>('ELEVENLABS_API_KEY')?.trim());
  }

  private voiceId(gender: TtsGender) {
    if (gender === 'male') {
      return (
        this.config.get<string>('ELEVENLABS_VOICE_MALE')?.trim() ||
        // Adam — clear educational / narrative male
        'pNInz6obpgDQGcFmaJgB'
      );
    }
    return (
      this.config.get<string>('ELEVENLABS_VOICE_FEMALE')?.trim() ||
      // Rachel — clear educational female
      '21m00Tcm4TlvDq8ikWAM'
    );
  }

  private mapSpeed(rate?: number) {
    // Frontend rate ~0.7–1.15 → ElevenLabs speed ~0.7–1.2
    if (rate == null || Number.isNaN(rate)) return 1;
    return Math.min(1.2, Math.max(0.7, rate));
  }

  async synthesize(text: string, opts: { gender?: TtsGender; rate?: number } = {}): Promise<TtsResult> {
    const apiKey = this.config.get<string>('ELEVENLABS_API_KEY')?.trim();
    if (!apiKey) {
      throw new ServiceUnavailableException('ElevenLabs API key тохируулаагүй байна');
    }

    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (!cleaned) throw new BadRequestException('Текст хоосон байна');
    if (cleaned.length > 4500) {
      throw new BadRequestException('Текст хэт урт байна (макс ~4500 тэмдэгт). Хуудас/өгүүлбэрээр уншина уу.');
    }

    const gender = opts.gender ?? 'female';
    const voiceId = this.voiceId(gender);
    const modelId =
      this.config.get<string>('ELEVENLABS_MODEL_ID')?.trim() || 'eleven_multilingual_v2';

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        text: cleaned,
        model_id: modelId,
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.75,
          style: 0.15,
          use_speaker_boost: true,
          speed: this.mapSpeed(opts.rate),
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      this.logger.error(`ElevenLabs TTS failed ${res.status}: ${errText.slice(0, 400)}`);
      throw new ServiceUnavailableException('ElevenLabs TTS амжилтгүй боллоо');
    }

    const data = (await res.json()) as {
      audio_base64?: string;
      alignment?: {
        characters?: string[];
        character_start_times_seconds?: number[];
        character_end_times_seconds?: number[];
      } | null;
      normalized_alignment?: {
        characters?: string[];
        character_start_times_seconds?: number[];
        character_end_times_seconds?: number[];
      } | null;
    };

    if (!data.audio_base64) {
      throw new ServiceUnavailableException('ElevenLabs аудио буцаасангүй');
    }

    const raw = data.alignment ?? data.normalized_alignment ?? null;
    const alignment: TtsAlignment | null =
      raw?.characters &&
      raw.character_start_times_seconds &&
      raw.character_end_times_seconds
        ? {
            characters: raw.characters,
            characterStartTimesSeconds: raw.character_start_times_seconds,
            characterEndTimesSeconds: raw.character_end_times_seconds,
          }
        : null;

    return {
      audioBase64: data.audio_base64,
      contentType: 'audio/mpeg',
      alignment,
      provider: 'elevenlabs',
      voiceId,
    };
  }
}
