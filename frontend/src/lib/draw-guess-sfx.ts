// frontend/src/lib/draw-guess-sfx.ts
// "Зураг таах" тоглоомын дуу чимээ — аудио файлгүй, WebAudio осциллятороор синтезлэнэ.
// Браузер хэрэглэгчийн үйлдлийн дараа л дуу гаргахыг зөвшөөрдөг тул эхний товч дээр unlockAudio() дуудна.

const MUTE_KEY = 'ce.draw-guess.muted';

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

/** Шуугиан (noise) — бийрний зураас, бөмбөр мэт дуунд */
function noise(dur: number, opts: { gain?: number; at?: number; lowpass?: number } = {}) {
  if (isMuted()) return;
  const ac = audio();
  if (!ac) return;
  const { gain = 0.05, at = 0, lowpass = 1200 } = opts;
  const t0 = ac.currentTime + at;
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = lowpass;
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, t0);
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

let lastBrush = 0;

export const sfx = {
  /** Сүүлийн секундүүдийн цаг тоолох */
  tick() {
    tone(1300, 0.045, { type: 'square', gain: 0.04 });
  },
  /** Үсэг тип болж нээгдэх — гялалзсан дуу */
  hint() {
    tone(880, 0.07, { type: 'sine', gain: 0.06 });
    tone(1320, 0.1, { type: 'sine', gain: 0.06, at: 0.07 });
    tone(1760, 0.16, { type: 'triangle', gain: 0.05, at: 0.14 });
  },
  /** Зөв таалт — дээшлэх аккорд */
  correct() {
    tone(523, 0.12, { type: 'square', gain: 0.07 });
    tone(659, 0.12, { type: 'square', gain: 0.07, at: 0.09 });
    tone(784, 0.14, { type: 'square', gain: 0.07, at: 0.18 });
    tone(1046, 0.35, { type: 'triangle', gain: 0.1, at: 0.27 });
  },
  /** Бусад тоглогч зөв таасан — богино хонх */
  otherCorrect() {
    tone(988, 0.09, { type: 'triangle', gain: 0.06 });
    tone(1318, 0.2, { type: 'triangle', gain: 0.06, at: 0.08 });
  },
  /** Буруу таалт — бүдүүн дуу */
  wrong() {
    tone(220, 0.14, { type: 'sawtooth', gain: 0.06 });
    tone(165, 0.2, { type: 'sawtooth', gain: 0.06, at: 0.1 });
  },
  /** Ойрхон таалт — хоёр давтсан анхааруулга */
  close() {
    tone(440, 0.08, { type: 'square', gain: 0.05 });
    tone(440, 0.08, { type: 'square', gain: 0.05, at: 0.12 });
    tone(554, 0.14, { type: 'triangle', gain: 0.06, at: 0.24 });
  },
  /** Ээлж эхлэх — богино дуудлага */
  turnStart() {
    tone(392, 0.1, { type: 'square', gain: 0.06 });
    tone(523, 0.1, { type: 'square', gain: 0.06, at: 0.1 });
    tone(659, 0.22, { type: 'square', gain: 0.07, at: 0.2 });
  },
  /** Үг сонгох хүлээлт — зөөлөн хоёр нот */
  choose() {
    tone(660, 0.08, { type: 'sine', gain: 0.05 });
    tone(880, 0.12, { type: 'sine', gain: 0.05, at: 0.1 });
  },
  /** Үг илчлэх — бөмбөрийн цохилт + цан */
  reveal() {
    for (let i = 0; i < 8; i++) noise(0.06, { gain: 0.05, at: i * 0.07, lowpass: 500 + i * 90 });
    tone(196, 0.3, { type: 'triangle', gain: 0.08, at: 0.6, slideTo: 98 });
    tone(1568, 0.5, { type: 'sine', gain: 0.05, at: 0.62 });
  },
  /** Салютын дэлбэрэлт */
  boom() {
    tone(90, 0.3, { type: 'sawtooth', gain: 0.05, slideTo: 40 });
  },
  /** Тоглоом дууссаны фанфар */
  fanfare() {
    const notes = [523, 659, 784, 1046, 784, 1046];
    notes.forEach((f, i) => tone(f, i === notes.length - 1 ? 0.5 : 0.14, { type: 'square', gain: 0.07, at: i * 0.12 }));
  },
  /** Цаг дууссан — доошилсон дуу */
  timeout() {
    tone(330, 0.5, { type: 'triangle', gain: 0.09, slideTo: 90 });
  },
  /** Бийрний зураас — зөөлөн шуугиан (хэт ойрхон давтахгүй) */
  brush() {
    const now = performance.now();
    if (now - lastBrush < 140) return;
    lastBrush = now;
    noise(0.09, { gain: 0.025, lowpass: 900 });
  },
  /** Товч / сонголт */
  tap() {
    tone(700, 0.06, { type: 'sine', gain: 0.05 });
  },
};
