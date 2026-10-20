// frontend/src/lib/type-rush-sfx.ts
// "Бичих уралдаан" тоглоомын дуу чимээ — аудио файлгүй, WebAudio осциллятороор синтезлэнэ.
// Браузер хэрэглэгчийн үйлдлийн дараа л дуу гаргахыг зөвшөөрдөг тул "Эхлэх" дээр дарахад context үүснэ.

const MUTE_KEY = 'ce.type-rush.muted';

let ctx: AudioContext | null = null;
let muted: boolean | null = null;

type Wave = OscillatorType;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur: number, opts: { type?: Wave; gain?: number; at?: number; slideTo?: number } = {}) {
  if (isMuted()) return;
  const ac = audio();
  if (!ac) return;
  const { type = 'sine', gain = 0.12, at = 0, slideTo } = opts;
  const t0 = ac.currentTime + at;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo != null) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Цагаан шуугиан (утаа, шуугих, мөргөлдөх) */
function noise(dur: number, opts: { gain?: number; at?: number; lowpass?: number; slideTo?: number } = {}) {
  if (isMuted()) return;
  const ac = audio();
  if (!ac) return;
  const { gain = 0.08, at = 0, lowpass = 1200, slideTo } = opts;
  const t0 = ac.currentTime + at;
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(lowpass, t0);
  if (slideTo != null) filter.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t0 + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter).connect(g).connect(ac.destination);
  src.start(t0);
  src.stop(t0 + dur + 0.02);
}

export function isMuted(): boolean {
  if (muted == null) {
    try {
      muted = typeof window !== 'undefined' && window.localStorage.getItem(MUTE_KEY) === '1';
    } catch {
      muted = false;
    }
  }
  return muted;
}

export function setMuted(v: boolean) {
  muted = v;
  try {
    window.localStorage.setItem(MUTE_KEY, v ? '1' : '0');
  } catch {
    /* ignore */
  }
}

/** Хэрэглэгчийн эхний үйлдэл дээр дуудна — audio context-ийг "сэрээнэ". */
export function unlockAudio() {
  audio();
}

export const sfx = {
  /** Хөдөлгүүр асаах — доороос дээш гүрвэлзэх */
  rev() {
    tone(70, 0.55, { type: 'sawtooth', gain: 0.06, slideTo: 230 });
    tone(140, 0.55, { type: 'square', gain: 0.025, slideTo: 460 });
    noise(0.5, { gain: 0.03, lowpass: 600, slideTo: 1800 });
  },
  /** Үг дуусах — араа солих богино "тик" */
  tick() {
    tone(900, 0.04, { type: 'square', gain: 0.035 });
    tone(1350, 0.05, { type: 'square', gain: 0.03, at: 0.03 });
  },
  /** Хурдасгуур — исгэрэх шуугиан */
  boost() {
    noise(0.28, { gain: 0.07, lowpass: 500, slideTo: 4000 });
    tone(320, 0.26, { type: 'triangle', gain: 0.05, slideTo: 980 });
  },
  /** Цаг тоолох 3-2-1 */
  count() {
    tone(440, 0.14, { type: 'square', gain: 0.07 });
  },
  /** GO! */
  go() {
    tone(880, 0.1, { type: 'square', gain: 0.08 });
    tone(1320, 0.4, { type: 'square', gain: 0.08, at: 0.08 });
    tone(90, 0.5, { type: 'sawtooth', gain: 0.05, at: 0.05, slideTo: 260 });
  },
  /** Бариа хүрэх — богино фанфар */
  finish() {
    const notes = [523, 659, 784, 1046];
    notes.forEach((f, i) => tone(f, i === notes.length - 1 ? 0.45 : 0.13, { type: 'square', gain: 0.07, at: i * 0.11 }));
  },
  /** 1-р байр — урт фанфар */
  win() {
    const notes = [523, 659, 784, 1046, 784, 1046, 1318];
    notes.forEach((f, i) => tone(f, i === notes.length - 1 ? 0.6 : 0.14, { type: 'square', gain: 0.07, at: i * 0.12 }));
    tone(262, 0.9, { type: 'triangle', gain: 0.05, at: 0.3 });
  },
  /** Сүүлийн секундүүдийн тик */
  urgent() {
    tone(1200, 0.04, { type: 'square', gain: 0.04 });
  },
  /** Цаг дууссан — хөдөлгүүр унтарч мөргөлдөх */
  timeout() {
    tone(260, 0.6, { type: 'sawtooth', gain: 0.07, slideTo: 40 });
    noise(0.45, { gain: 0.09, lowpass: 900, slideTo: 120, at: 0.05 });
    tone(110, 0.25, { type: 'square', gain: 0.05, at: 0.08, slideTo: 50 });
  },
  /** Салютын дэлбэрэлт */
  boom() {
    tone(90, 0.3, { type: 'sawtooth', gain: 0.05, slideTo: 40 });
    noise(0.25, { gain: 0.03, lowpass: 700, slideTo: 150 });
  },
  /** UI товч / сонголт */
  ui() {
    tone(700, 0.06, { type: 'sine', gain: 0.05 });
    tone(900, 0.07, { type: 'sine', gain: 0.05, at: 0.06 });
  },
  /** Бусад тоглогч бариа хүрэх */
  rivalFinish() {
    tone(520, 0.08, { type: 'triangle', gain: 0.04 });
    tone(390, 0.12, { type: 'triangle', gain: 0.04, at: 0.07 });
  },
};
