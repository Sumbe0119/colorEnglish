// frontend/src/components/reading/elevenlabs-speech.ts
'use client';

import { api } from '@/lib/api';

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

type TtsApiResponse = {
  audioBase64: string;
  contentType: string;
  alignment: {
    characters: string[];
    characterStartTimesSeconds: number[];
    characterEndTimesSeconds: number[];
  } | null;
};

let currentAudio: HTMLAudioElement | null = null;
let boundaryTimers: ReturnType<typeof setTimeout>[] = [];
let preferElevenLabs: boolean | null = null;

function clearBoundaryTimers() {
  boundaryTimers.forEach((t) => clearTimeout(t));
  boundaryTimers = [];
}

function stopBrowserSpeech() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
}

function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.removeAttribute('src');
    currentAudio.load();
    currentAudio = null;
  }
}

export function stopAllSpeech() {
  clearBoundaryTimers();
  stopAudio();
  stopBrowserSpeech();
}

function genderScore(voice: SpeechSynthesisVoice, gender: VoiceGender): number {
  const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  const femaleHints = [
    'female', 'woman', 'zira', 'samantha', 'victoria', 'karen', 'moira', 'tessa',
    'fiona', 'veena', 'susan', 'hazel', 'aria', 'jenny', 'sara', 'linda',
  ];
  const maleHints = [
    'male', 'man', 'david', 'mark', 'daniel', 'thomas', 'james', 'george',
    'alex', 'fred', 'ravi', 'matthew', 'guy', 'tony', 'richard',
  ];
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
    const pref = (v: SpeechSynthesisVoice) =>
      v.lang.toLowerCase().includes('en-us') ? 2 : v.lang.toLowerCase().includes('en-gb') ? 1 : 0;
    return pref(b) - pref(a);
  })[0];
}

async function ensureElevenLabsEnabled() {
  if (preferElevenLabs != null) return preferElevenLabs;
  try {
    const { data } = await api.get<{ enabled: boolean }>('/reading/tts/status');
    preferElevenLabs = Boolean(data.enabled);
  } catch {
    preferElevenLabs = false;
  }
  return preferElevenLabs;
}

function speakBrowser(text: string, options: SpeakOptions = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onError?.();
    return;
  }
  stopBrowserSpeech();

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

function scheduleAlignment(
  alignment: NonNullable<TtsApiResponse['alignment']>,
  onBoundary?: SpeakOptions['onBoundary'],
) {
  clearBoundaryTimers();
  if (!onBoundary) return;
  const starts = alignment.characterStartTimesSeconds;
  for (let i = 0; i < starts.length; i++) {
    const ch = alignment.characters[i];
    const isLetter = /[a-zA-Z]/.test(ch);
    const prev = i > 0 ? alignment.characters[i - 1] : ' ';
    if (!isLetter || /[a-zA-Z]/.test(prev)) continue;
    const delayMs = Math.max(0, starts[i] * 1000);
    boundaryTimers.push(setTimeout(() => onBoundary(i, 1), delayMs));
  }
}

async function speakElevenLabs(text: string, options: SpeakOptions = {}) {
  const { data } = await api.post<TtsApiResponse>('/reading/tts', {
    text,
    gender: options.gender ?? 'female',
    rate: options.rate ?? 0.85,
  });

  stopAllSpeech();

  const mime = data.contentType || 'audio/mpeg';
  const audio = new Audio(`data:${mime};base64,${data.audioBase64}`);
  currentAudio = audio;

  audio.onplay = () => {
    options.onStart?.();
    if (data.alignment) scheduleAlignment(data.alignment, options.onBoundary);
  };
  audio.onended = () => {
    clearBoundaryTimers();
    if (currentAudio === audio) currentAudio = null;
    options.onEnd?.();
  };
  audio.onerror = () => {
    clearBoundaryTimers();
    if (currentAudio === audio) currentAudio = null;
    options.onError?.();
  };

  await audio.play();
}

/** ElevenLabs education voice эхлээд; алдаатай бол browser TTS. */
export async function speakWithElevenLabs(text: string, options: SpeakOptions = {}) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    options.onError?.();
    return;
  }
  stopAllSpeech();
  const enabled = await ensureElevenLabsEnabled();
  if (enabled) {
    try {
      await speakElevenLabs(cleaned, options);
      return;
    } catch {
      // fallback
    }
  }
  speakBrowser(cleaned, options);
}

export async function speakWordWithElevenLabs(text: string, options: SpeakOptions = {}) {
  await speakWithElevenLabs(text, { rate: 0.9, ...options });
}
