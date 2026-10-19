// frontend/src/lib/sentence-builder-sfx.ts
// Тоглоомын дуу чимээ — аудио файлгүй, WebAudio осциллятороор синтезлэнэ.
// Браузер хэрэглэгчийн үйлдлийн дараа л дуу гаргахыг зөвшөөрдөг тул "Эхлэх" дээр дарахад context үүснэ.

const MUTE_KEY = 'ce.sentence-builder.muted';

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
  /** Зөв хариулт — дээшлэх аккорд */
  correct() {
    tone(523, 0.12, { type: 'square', gain: 0.07 });
    tone(659, 0.12, { type: 'square', gain: 0.07, at: 0.09 });
    tone(784, 0.14, { type: 'square', gain: 0.07, at: 0.18 });
    tone(1046, 0.35, { type: 'triangle', gain: 0.1, at: 0.27 });
  },
  /** Буруу хариулт — богино бүдүүн дуу */
  wrong() {
    tone(220, 0.14, { type: 'sawtooth', gain: 0.06 });
    tone(165, 0.2, { type: 'sawtooth', gain: 0.06, at: 0.1 });
  },
  /** Цаг дууссан — доошилсон дуу */
  timeout() {
    tone(330, 0.55, { type: 'triangle', gain: 0.1, slideTo: 90 });
  },
  /** Сүүлийн секундүүдийн цаг тоолох */
  tick() {
    tone(1300, 0.045, { type: 'square', gain: 0.04 });
  },
  /** Баатар үсрэх */
  jump() {
    tone(280, 0.16, { type: 'triangle', gain: 0.07, slideTo: 620 });
  },
  /** Тавцан дээр буух */
  land() {
    tone(140, 0.08, { type: 'triangle', gain: 0.06, slideTo: 80 });
  },
  /** Tip нээх */
  tip() {
    tone(700, 0.07, { type: 'sine', gain: 0.06 });
    tone(900, 0.09, { type: 'sine', gain: 0.06, at: 0.08 });
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
};
