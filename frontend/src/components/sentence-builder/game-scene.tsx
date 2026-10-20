// frontend/src/components/sentence-builder/game-scene.tsx
// "Өгүүлбэр бүтээх" тоглоомын 2D дүрслэл — canvas дээр rAF-аар зурна. Эцэг элементээ бүтнээр дүүргэнэ.
// Шөнийн тэнгэр, од, сар, уулс, хотын дүрс (parallax), тавцангууд, робот баатар,
// тэнгэрт хөвөх үгийн блокууд (дарж болно), цаг/оноо HUD, салют, popup, дэлгэц чичрэлт.
// Цаг дуусвал тавцан хагарч робот ангал руу унана (game over); туганд хүрвэл ялалтын салют.
// React re-render-ээс хамаарахгүй: props-ийг ref-д хадгалаад кадр бүрт шууд уншина.
'use client';

import { useEffect, useRef } from 'react';
import { normalizeSentence, timerColor } from '@/lib/sentence-builder';
import { sfx } from '@/lib/sentence-builder-sfx';

export type SceneStatus = 'typing' | 'correct' | 'fall' | 'win';

export type GameSceneProps = {
  /** Нийт тавцангийн тоо (раундын тоо) */
  total: number;
  /** Одоогийн раунд (0-based) — баатар энэ тавцан дээр зогсоно */
  idx: number;
  /** Амжилттай давсан раундын тоо (0..idx) */
  passed: number;
  status: SceneStatus;
  /** Үлдсэн хугацааны хувь 1 → 0 */
  fraction: number;
  remainSec: number;
  words: string[];
  streak: number;
  score: number;
  /** Сүүлийн зөв хариултын оноо — popup-д */
  lastPoints: number;
  /** false бол HUD харагдахгүй (эхлэх дэлгэцийн preview) */
  playing: boolean;
  /** Оролтын одоогийн текст — ашигласан үгийн блокуудыг бүдэгрүүлнэ */
  getTyped?: () => string;
  /** Үгийн блок дээр дарахад (used = аль хэдийн бичсэн үг) */
  onWordTap?: (word: string, used: boolean, pointerType: string) => void;
};

// ─── Тогтмолууд ───
const SPACING = 190;
const FIRST_X = 200;
const PLAT_W = 120;
const PLAT_H = 18;
const JUMP_MS = 620;
/** Цаг дууссанаас хойш тавцан хагарч эхлэх хүртэлх хугацаа */
const CRACK_MS = 450;
const WORD_ROW_H = 40;
const WORD_H = 32;
const WORDS_TOP = 86;

const C = {
  brand: '#4F8CFF',
  brandHi: '#6BA0FF',
  subject: '#6EA8FF',
  subjectDim: '#2A4A7A',
  success: '#3DDC97',
  danger: '#FF6B7A',
  modifier: '#FFD166',
  verb: '#FF9A6B',
  ink950: '#070A12',
  ink900: '#0C1220',
  ink800: '#141C2E',
  ink700: '#1E2A40',
  ink600: '#2A3A55',
  ink500: '#3D5070',
  mist50: '#F5F8FC',
  mist300: '#A8B6CC',
  mist500: '#6B7A94',
};

const FIREWORK_COLORS = [C.brand, C.verb, C.success, C.modifier, C.danger, '#C58CFF', '#FFFFFF'];

type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number; g: number };
type Rocket = { x: number; y: number; vy: number; targetY: number; color: string };
type Popup = { text: string; x: number; y: number; start: number; color: string; big?: boolean };
type Block = { x: number; y: number; w: number; h: number; word: string; used: boolean };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(20261019);
const STARS = Array.from({ length: 110 }, () => ({ x: rnd() * 2600, y: rnd() * 0.6, r: 0.6 + rnd() * 1.4, p: rnd() * Math.PI * 2, s: 1 + rnd() * 2 }));
const MOUNTAINS = Array.from({ length: 40 }, (_, i) => ({ x: i * 110, h: 40 + rnd() * 70 }));
const BUILDINGS = Array.from({ length: 70 }, (_, i) => ({
  x: i * 52 + rnd() * 14,
  w: 28 + rnd() * 26,
  h: 36 + rnd() * 110,
  win: Array.from({ length: 14 }, () => rnd() < 0.55),
}));

function platformX(i: number) {
  return FIRST_X + i * SPACING;
}

function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

type Mood = 'idle' | 'happy' | 'sad' | 'jump' | 'scared';

/** Робот баатар. (x, y) = хөлийн суурь. squash: 1 = энгийн, <1 = хавтгай, >1 = сунасан. rot = радиан (унахад эргэнэ). */
function drawHero(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, mood: Mood, squash: number, antenna: string, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  if (rot) {
    ctx.translate(0, -30);
    ctx.rotate(rot);
    ctx.translate(0, 30);
  }
  ctx.scale(1 / squash, squash);
  const bob = mood === 'jump' || mood === 'scared' ? 0 : Math.sin(t / 420) * 1.6;
  ctx.translate(0, bob);

  // хөл
  ctx.fillStyle = C.ink600;
  const legSpread = mood === 'jump' ? 4 : 7;
  const legLen = mood === 'jump' ? 6 : 9;
  rr(ctx, -legSpread - 4, -legLen, 8, legLen, 3);
  ctx.fill();
  rr(ctx, legSpread - 4, -legLen, 8, legLen, 3);
  ctx.fill();

  // бие
  const bodyY = -legLen - 24;
  ctx.fillStyle = C.brand;
  rr(ctx, -15, bodyY, 30, 26, 8);
  ctx.fill();
  ctx.fillStyle = C.ink900;
  rr(ctx, -8, bodyY + 7, 16, 11, 4);
  ctx.fill();
  ctx.fillStyle = mood === 'sad' || mood === 'scared' ? C.danger : C.success;
  ctx.beginPath();
  ctx.arc(-3, bodyY + 12.5, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.modifier;
  ctx.beginPath();
  ctx.arc(3, bodyY + 12.5, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // гар
  ctx.fillStyle = C.brandHi;
  const armLift = mood === 'happy' ? -14 : mood === 'jump' ? -8 : mood === 'scared' ? -18 : 0;
  const armSwing = mood === 'idle' ? Math.sin(t / 500) * 2 : mood === 'scared' ? Math.sin(t / 60) * 3 : 0;
  rr(ctx, -23, bodyY + 4 + armLift + armSwing, 7, 16, 3.5);
  ctx.fill();
  rr(ctx, 16, bodyY + 4 + armLift - armSwing, 7, 16, 3.5);
  ctx.fill();

  // толгой
  const headY = bodyY - 28;
  ctx.fillStyle = C.brandHi;
  rr(ctx, -17, headY, 34, 26, 9);
  ctx.fill();
  // нүүрний дэлгэц
  ctx.fillStyle = C.ink950;
  rr(ctx, -13, headY + 6, 26, 14, 5);
  ctx.fill();
  // нүд
  const eyeY = headY + 13;
  if (mood === 'happy') {
    ctx.strokeStyle = '#7CF5FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-6, eyeY + 1, 3, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(6, eyeY + 1, 3, Math.PI, 0);
    ctx.stroke();
  } else if (mood === 'sad') {
    ctx.strokeStyle = C.danger;
    ctx.lineWidth = 2;
    for (const ex of [-6, 6]) {
      ctx.beginPath();
      ctx.moveTo(ex - 3, eyeY - 3);
      ctx.lineTo(ex + 3, eyeY + 3);
      ctx.moveTo(ex + 3, eyeY - 3);
      ctx.lineTo(ex - 3, eyeY + 3);
      ctx.stroke();
    }
  } else if (mood === 'scared') {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(-6, eyeY, 3.6, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(6, eyeY, 3.6, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.ink950;
    ctx.beginPath();
    ctx.arc(-6, eyeY, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, eyeY, 1.4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const blink = Math.sin(t / 1900) > 0.985 ? 0.25 : 1;
    ctx.fillStyle = '#7CF5FF';
    ctx.beginPath();
    ctx.ellipse(-6, eyeY, 3, 3 * blink, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(6, eyeY, 3, 3 * blink, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // антенн — өнгө нь цагийг дагана
  ctx.strokeStyle = C.ink500;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, headY);
  ctx.lineTo(0, headY - 11);
  ctx.stroke();
  ctx.shadowColor = antenna;
  ctx.shadowBlur = 12;
  ctx.fillStyle = antenna;
  ctx.beginPath();
  ctx.arc(0, headY - 13, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

/** Тавцангийн нэг хагас (хагарсан хэсэг) */
function drawPlatformPiece(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, rot: number, fill: string, stroke: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.fillStyle = fill;
  rr(ctx, -w / 2, 0, w, PLAT_H, 6);
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

/** Бичсэн үгсийг блокуудтай олон-тооны (multiset) байдлаар тааруулж "ашигласан" тэмдэглэнэ */
function usedFlags(words: string[], typed: string): boolean[] {
  const used = words.map(() => false);
  if (!typed) return used;
  const norm = words.map((w) => normalizeSentence(w));
  for (const tok of normalizeSentence(typed).split(' ')) {
    if (!tok) continue;
    const i = norm.findIndex((n, k) => !used[k] && n === tok);
    if (i >= 0) used[i] = true;
  }
  return used;
}

export function GameScene(props: GameSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  // Анимацийн төлөв (React state биш)
  const heroXRef = useRef(platformX(props.idx));
  const jumpRef = useRef<{ from: number; to: number; start: number } | null>(null);
  const feedbackRef = useRef<{ status: SceneStatus; start: number }>({ status: 'typing', start: 0 });
  const fallRef = useRef<{ start: number; cracked: boolean; fell: boolean } | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const popupsRef = useRef<Popup[]>([]);
  const shakeRef = useRef<{ amp: number; start: number }>({ amp: 0, start: 0 });
  const prevIdxRef = useRef(props.idx);
  const prevStatusRef = useRef<SceneStatus>(props.status);
  const camRef = useRef<number | null>(null);
  const fontRef = useRef('ui-monospace, monospace');
  const blocksRef = useRef<Block[]>([]);
  const winUntilRef = useRef(0);
  const nextWinRocketRef = useRef(0);

  // Раунд солигдоход үсрэлт
  useEffect(() => {
    const prev = prevIdxRef.current;
    if (props.idx !== prev) {
      const now = performance.now();
      if (props.idx === prev + 1 && props.playing) {
        jumpRef.current = { from: platformX(prev), to: platformX(props.idx), start: now };
        sfx.jump();
      } else {
        jumpRef.current = null;
        heroXRef.current = platformX(props.idx);
      }
      prevIdxRef.current = props.idx;
    }
  }, [props.idx, props.playing]);

  // Шинэ тоглоом / preview руу буцахад унасан төлөвийг цэвэрлэнэ
  useEffect(() => {
    if (!props.playing) {
      fallRef.current = null;
      feedbackRef.current = { status: 'typing', start: 0 };
      prevStatusRef.current = props.status;
      heroXRef.current = platformX(props.idx);
      jumpRef.current = null;
    }
  }, [props.playing, props.status, props.idx]);

  // Хариултын үр дүн: баяр / унах / ялалт, салют, popup, чичрэлт
  useEffect(() => {
    const prev = prevStatusRef.current;
    if (props.status === prev) return;
    prevStatusRef.current = props.status;
    const now = performance.now();
    feedbackRef.current = { status: props.status, start: now };
    const hx = heroXRef.current;
    if (props.status === 'correct') {
      const n = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++) {
        rocketsRef.current.push({
          x: hx + (Math.random() - 0.5) * 260,
          y: 9999, // кадр дээр тавцангийн өндрөөр солигдоно
          vy: -(520 + Math.random() * 180),
          targetY: 40 + Math.random() * 70,
          color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
        });
      }
      popupsRef.current.push({ text: `+${propsRef.current.lastPoints}`, x: hx + 70, y: -60, start: now, color: C.success });
      if (propsRef.current.streak >= 2) {
        popupsRef.current.push({ text: `${propsRef.current.streak}x COMBO`, x: hx + 70, y: -84, start: now + 250, color: C.verb });
      }
    } else if (props.status === 'fall') {
      fallRef.current = { start: now, cracked: false, fell: false };
      shakeRef.current = { amp: 5, start: now };
      popupsRef.current.push({ text: 'Цаг дууслаа!', x: hx + 90, y: -70, start: now, color: C.danger });
    } else if (props.status === 'win') {
      winUntilRef.current = now + 5000;
      nextWinRocketRef.current = now;
      popupsRef.current.push({ text: 'ТУГАНД ХҮРЛЭЭ!', x: hx, y: -110, start: now, color: C.modifier, big: true });
    } else if (props.status === 'typing') {
      fallRef.current = null;
    }
  }, [props.status]);

  // Үгийн блок дээр дарах
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const hit = (e: PointerEvent): Block | null => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (const b of blocksRef.current) {
        if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b;
      }
      return null;
    };
    const onDown = (e: PointerEvent) => {
      const p = propsRef.current;
      if (!p.playing || p.status !== 'typing' || !p.onWordTap) return;
      const b = hit(e);
      if (!b) return;
      e.preventDefault();
      p.onWordTap(b.word, b.used, e.pointerType);
    };
    const onMove = (e: PointerEvent) => {
      const p = propsRef.current;
      canvas.style.cursor = p.playing && p.status === 'typing' && hit(e) ? 'pointer' : 'default';
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    fontRef.current = getComputedStyle(canvas).fontFamily || fontRef.current;

    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      w = Math.max(280, wrap.clientWidth);
      h = Math.max(320, wrap.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let raf = 0;
    let last = 0;
    let lastBoom = 0;

    const draw = () => {
      // rAF-ийн timestamp performance.now()-оос хоцорч болох тул нэг л цагийн эх үүсвэр хэрэглэнэ
      const t = performance.now();
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      const p = propsRef.current;
      const groundY = Math.round(h * 0.91);
      const platY = Math.round(h * 0.74);
      const timer = timerColor(p.fraction);
      const typing = p.status === 'typing' && p.playing;
      const urgent = typing && p.remainSec <= 5;

      // ── Унах дараалал ──
      const fall = p.status === 'fall' ? fallRef.current : null;
      const fallAge = fall ? t - fall.start : 0;
      if (fall && !fall.cracked && fallAge >= CRACK_MS * 0.4) {
        fall.cracked = true;
        sfx.crack();
      }
      if (fall && !fall.fell && fallAge >= CRACK_MS) {
        fall.fell = true;
        shakeRef.current = { amp: 9, start: t };
        sfx.fall();
        // хагархай
        for (let k = 0; k < 18; k++) {
          particlesRef.current.push({
            x: heroXRef.current + (Math.random() - 0.5) * PLAT_W,
            y: platY + Math.random() * PLAT_H,
            vx: (Math.random() - 0.5) * 160,
            vy: -40 - Math.random() * 160,
            life: 0,
            max: 0.9 + Math.random() * 0.6,
            color: k % 3 ? C.ink500 : C.danger,
            size: 1.5 + Math.random() * 2.5,
            g: 900,
          });
        }
      }
      const fallS = fall && fall.fell ? (fallAge - CRACK_MS) / 1000 : 0;

      // ── Баатрын байрлал (үсрэлт / унах / баяр) ──
      let heroY = platY;
      let squash = 1;
      let mood: Mood = 'idle';
      let heroRot = 0;
      const jump = jumpRef.current;
      if (jump) {
        const k = Math.max(0, Math.min(1, (t - jump.start) / JUMP_MS));
        heroXRef.current = jump.from + (jump.to - jump.from) * easeOutCubic(k);
        const arc = Math.sin(k * Math.PI);
        heroY = platY - arc * 92;
        mood = 'jump';
        squash = k < 0.12 ? 0.8 + (k / 0.12) * 0.35 : k > 0.88 ? 1 - ((k - 0.88) / 0.12) * 0.25 : 1.08;
        if (k >= 1) {
          jumpRef.current = null;
          heroXRef.current = jump.to;
          sfx.land();
          shakeRef.current = { amp: 3, start: t };
          squash = 0.8;
        }
      } else if (fall) {
        if (!fall.fell) {
          mood = 'scared';
          squash = 0.95;
        } else {
          mood = 'sad';
          heroY = platY + 0.5 * 1500 * fallS * fallS + 60 * fallS;
          heroRot = Math.min(2.4, fallS * 2.2);
        }
      } else {
        const fb = feedbackRef.current;
        const age = Math.max(0, t - fb.start);
        if (fb.status === 'correct' && age < 1800) {
          mood = 'happy';
          const hop = Math.abs(Math.sin(age / 180)) * Math.max(0, 1 - age / 1800) * 26;
          heroY = platY - hop;
          squash = 1 + hop / 120;
        } else if (fb.status === 'win') {
          mood = 'happy';
          const hop = Math.abs(Math.sin(age / 200)) * 30;
          heroY = platY - hop;
          squash = 1 + hop / 140;
        }
      }
      const heroX = heroXRef.current;

      // ── Ялалтын салют (тасралтгүй, 5 секунд) ──
      if (p.status === 'win' && t < winUntilRef.current && t >= nextWinRocketRef.current) {
        nextWinRocketRef.current = t + 260 + Math.random() * 300;
        rocketsRef.current.push({
          x: heroX + (Math.random() - 0.5) * Math.min(w, 700),
          y: 9999,
          vy: -(520 + Math.random() * 200),
          targetY: 30 + Math.random() * 90,
          color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
        });
      }

      // ── Камер ──
      const worldW = platformX(p.total - 1) + PLAT_W / 2 + 160;
      let targetCam = heroX - w * 0.4;
      targetCam = Math.max(Math.min(0, (worldW - w) / 2), Math.min(worldW - w, targetCam));
      if (worldW <= w) targetCam = (worldW - w) / 2;
      // Эхний кадрт камерыг шууд байрлуулна, дараа нь зөөлөн дагана
      if (camRef.current == null) camRef.current = targetCam;
      camRef.current += (targetCam - camRef.current) * Math.min(1, dt * 6);
      const cam = camRef.current;

      // ── Чичрэлт ──
      let sx = 0;
      let sy = 0;
      const sh = shakeRef.current;
      const shAge = t - sh.start;
      if (sh.amp > 0 && shAge < 450) {
        const k = 1 - shAge / 450;
        sx = (Math.random() - 0.5) * 2 * sh.amp * k;
        sy = (Math.random() - 0.5) * 2 * sh.amp * k;
      }
      if (urgent || (fall && !fall.fell)) {
        sx += (Math.random() - 0.5) * 1.8;
        sy += (Math.random() - 0.5) * 1.8;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(sx, sy);

      // ── Тэнгэр ──
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#05070F');
      sky.addColorStop(0.55, '#0B1327');
      sky.addColorStop(1, '#1A2A4A');
      ctx.fillStyle = sky;
      ctx.fillRect(-10, -10, w + 20, h + 20);

      // Од
      for (const s of STARS) {
        const x = ((s.x - cam * 0.08) % 2600 + 2600) % 2600 - 100;
        if (x < -5 || x > w + 5) continue;
        const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t / (380 * s.s) + s.p));
        ctx.globalAlpha = tw;
        ctx.fillStyle = '#E6ECF5';
        ctx.beginPath();
        ctx.arc(x, s.y * h + 6, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Сар — нарийн дэлгэцэд HUD-ийн ард нуугдахгүйн тулд тэнгэрийн дунд
      const narrowSky = w < 640;
      const moonX = (narrowSky ? w * 0.5 : w - 70) - cam * 0.04;
      const moonY = narrowSky ? Math.round(h * 0.45) : 56;
      ctx.shadowColor = 'rgba(255,241,200,0.55)';
      ctx.shadowBlur = 26;
      ctx.fillStyle = '#FFF1C8';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#0B1327';
      ctx.beginPath();
      ctx.arc(moonX + 10, moonY - 7, 19, 0, Math.PI * 2);
      ctx.fill();

      // Уулс (алс)
      ctx.fillStyle = '#121B30';
      ctx.beginPath();
      ctx.moveTo(-10, groundY);
      for (const m of MOUNTAINS) {
        const x = m.x - cam * 0.25 - 200;
        ctx.lineTo(x, groundY - m.h - 30);
        ctx.lineTo(x + 55, groundY - m.h * 0.5 - 30);
      }
      ctx.lineTo(w + 10, groundY);
      ctx.closePath();
      ctx.fill();

      // Хотын дүрс
      for (const b of BUILDINGS) {
        const x = b.x - cam * 0.5 - 300;
        if (x + b.w < -5 || x > w + 5) continue;
        ctx.fillStyle = C.ink800;
        ctx.fillRect(x, groundY - b.h, b.w, b.h + 2);
        ctx.fillStyle = 'rgba(255,209,102,0.55)';
        const cols = Math.floor(b.w / 9);
        for (let i = 0; i < b.win.length; i++) {
          if (!b.win[i]) continue;
          const cx = x + 4 + (i % cols) * 9;
          const cy = groundY - b.h + 6 + Math.floor(i / cols) * 11;
          if (cx + 4 > x + b.w - 2 || cy + 5 > groundY - 4) continue;
          ctx.fillRect(cx, cy, 4, 5);
        }
      }

      // Газар — ангал: тавцангийн доор харанхуй
      const ground = ctx.createLinearGradient(0, groundY, 0, h);
      ground.addColorStop(0, C.ink900);
      ground.addColorStop(1, '#03050A');
      ctx.fillStyle = ground;
      ctx.fillRect(-10, groundY, w + 20, h - groundY + 10);
      ctx.fillStyle = C.ink700;
      ctx.fillRect(-10, groundY, w + 20, 2);

      // ── Тавцангууд ──
      ctx.font = `600 11px ${fontRef.current}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < p.total; i++) {
        const x = platformX(i) - cam;
        if (x + PLAT_W < -20 || x - PLAT_W > w + 20) continue;
        const done = i < p.passed;
        const isCur = i === p.idx;
        const isFalling = isCur && fall != null;
        let fill = C.ink600;
        let stroke = C.ink500;
        if (done) {
          fill = '#1F5C45';
          stroke = C.success;
        } else if (isFalling) {
          fill = '#5C2A33';
          stroke = C.danger;
        } else if (isCur && p.playing) {
          fill = C.ink700;
          stroke = timer;
        }
        // тулгуур
        ctx.strokeStyle = C.ink600;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, platY + PLAT_H);
        ctx.lineTo(x, groundY);
        ctx.stroke();

        if (isFalling && fall.fell) {
          // хоёр хагас болж унана
          const dy = 0.5 * 1200 * fallS * fallS;
          drawPlatformPiece(ctx, x - PLAT_W / 4, platY + dy, PLAT_W / 2, -fallS * 1.4, fill, stroke);
          drawPlatformPiece(ctx, x + PLAT_W / 4, platY + dy * 0.8, PLAT_W / 2, fallS * 1.1, fill, stroke);
          continue;
        }

        // тавцан
        if (isCur && p.playing && !fall) {
          ctx.shadowColor = timer;
          ctx.shadowBlur = urgent ? 22 + Math.sin(t / 80) * 6 : 14;
        }
        ctx.fillStyle = fill;
        rr(ctx, x - PLAT_W / 2, platY, PLAT_W, PLAT_H, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = isCur ? 2 : 1.5;
        ctx.stroke();
        // хагарч буй тавцан: ан цав
        if (isFalling || (urgent && isCur)) {
          const k = isFalling ? Math.min(1, fallAge / CRACK_MS) : 0.4 * (1 - p.remainSec / 5);
          ctx.strokeStyle = C.danger;
          ctx.lineWidth = 1 + k;
          ctx.globalAlpha = 0.5 + k * 0.5;
          ctx.beginPath();
          ctx.moveTo(x - 4, platY);
          ctx.lineTo(x + 2, platY + 7);
          ctx.lineTo(x - 3, platY + PLAT_H);
          if (k > 0.5) {
            ctx.moveTo(x - 24, platY + 2);
            ctx.lineTo(x - 14, platY + 10);
            ctx.lineTo(x - 18, platY + PLAT_H - 2);
            ctx.moveTo(x + 22, platY + 1);
            ctx.lineTo(x + 14, platY + 9);
            ctx.lineTo(x + 24, platY + PLAT_H - 1);
          }
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        // дугаар / тэмдэг
        ctx.fillStyle = done ? C.success : isFalling ? C.danger : isCur ? C.mist50 : C.mist500;
        ctx.fillText(done ? '✓' : String(i + 1), x, platY + PLAT_H / 2 + 0.5);
        // одоогийн тавцангийн цагийн зурвас
        if (isCur && typing) {
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          rr(ctx, x - PLAT_W / 2 + 6, platY - 7, PLAT_W - 12, 4, 2);
          ctx.fill();
          ctx.fillStyle = timer;
          rr(ctx, x - PLAT_W / 2 + 6, platY - 7, (PLAT_W - 12) * p.fraction, 4, 2);
          ctx.fill();
        }
      }
      // Бариа — сүүлийн тавцан дээрх туг
      {
        const fx = platformX(p.total - 1) - cam + PLAT_W / 2 - 10;
        ctx.strokeStyle = C.mist300;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fx, platY);
        ctx.lineTo(fx, platY - 48);
        ctx.stroke();
        const wave = Math.sin(t / 220) * 3;
        ctx.fillStyle = C.modifier;
        ctx.beginPath();
        ctx.moveTo(fx, platY - 48);
        ctx.lineTo(fx + 28, platY - 41 + wave);
        ctx.lineTo(fx, platY - 32);
        ctx.closePath();
        ctx.fill();
      }

      // ── Үгийн блокууд (одоогийн раунд) — дэлгэцийн дээд хэсэгт олон мөрөөр ──
      blocksRef.current = [];
      if ((p.playing || p.words.length) && p.status !== 'win' && !fall) {
        const fb = feedbackRef.current;
        const age = Math.max(0, t - fb.start);
        const dropping = fb.status === 'correct' && age < 700;
        const gone = fb.status === 'correct' && age >= 700;
        if (!gone || jumpRef.current) {
          const narrow = w < 480;
          ctx.font = `700 ${narrow ? 13 : 15}px ${fontRef.current}`;
          const pad = narrow ? 12 : 16;
          const gap = 8;
          const maxRowW = Math.min(w - 28, 640);
          const widths = p.words.map((wd) => Math.max(narrow ? 44 : 52, ctx.measureText(wd).width + pad * 2));
          // мөр болгон хуваах
          const rows: number[][] = [[]];
          let rowW = 0;
          widths.forEach((bw, i) => {
            const need = rowW === 0 ? bw : rowW + gap + bw;
            if (need > maxRowW && rows[rows.length - 1].length) {
              rows.push([i]);
              rowW = bw;
            } else {
              rows[rows.length - 1].push(i);
              rowW = need;
            }
          });
          const used = usedFlags(p.words, p.getTyped ? p.getTyped() : '');
          let alphaAll = 1;
          if (jumpRef.current) alphaAll = Math.max(0, Math.min(1, (t - jumpRef.current.start) / JUMP_MS));
          rows.forEach((row, r) => {
            const totalW = row.reduce((a, i) => a + widths[i], 0) + gap * (row.length - 1);
            let bx = w / 2 - totalW / 2;
            const rowY = WORDS_TOP + r * WORD_ROW_H;
            for (const i of row) {
              const wd = p.words[i];
              const bob = Math.sin(t / 520 + i * 1.3) * 4;
              let y = rowY + bob;
              let alpha = alphaAll;
              if (dropping) {
                const k = easeOutCubic(age / 700);
                y = rowY + (platY - 10 - rowY) * k;
                alpha *= 1 - k;
              }
              const isUsed = used[i];
              ctx.globalAlpha = alpha * (isUsed ? 0.38 : 1);
              ctx.shadowColor = isUsed ? 'transparent' : 'rgba(110,168,255,0.5)';
              ctx.shadowBlur = isUsed ? 0 : 14;
              ctx.fillStyle = isUsed ? C.ink800 : C.subjectDim;
              rr(ctx, bx, y, widths[i], WORD_H, 9);
              ctx.fill();
              ctx.shadowBlur = 0;
              ctx.strokeStyle = isUsed ? C.ink500 : C.subject;
              ctx.lineWidth = 1.5;
              ctx.stroke();
              ctx.fillStyle = isUsed ? C.mist500 : C.mist50;
              ctx.fillText(wd, bx + widths[i] / 2, y + WORD_H / 2 + 0.5);
              if (isUsed) {
                ctx.strokeStyle = C.mist500;
                ctx.lineWidth = 1.5;
                const tw = ctx.measureText(wd).width;
                ctx.beginPath();
                ctx.moveTo(bx + widths[i] / 2 - tw / 2, y + WORD_H / 2);
                ctx.lineTo(bx + widths[i] / 2 + tw / 2, y + WORD_H / 2);
                ctx.stroke();
              }
              ctx.globalAlpha = 1;
              if (!dropping && !jumpRef.current) blocksRef.current.push({ x: bx, y, w: widths[i], h: WORD_H, word: wd, used: isUsed });
              bx += widths[i] + gap;
            }
          });
        }
      }

      // ── Баатар ──
      const hx = heroX - cam;
      if (!(fall && fall.fell)) {
        // сүүдэр
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        const shadowK = Math.max(0.35, 1 - (platY - heroY) / 120);
        ctx.ellipse(hx, platY + 2, 16 * shadowK, 4 * shadowK, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      if (heroY < h + 90) {
        const jitterX = (urgent && mood === 'idle') || mood === 'scared' ? (Math.random() - 0.5) * 2.4 : 0;
        drawHero(ctx, hx + jitterX, heroY, t, mood, squash, p.playing ? (fall ? C.danger : timer) : C.success, heroRot);
      }
      // сандарсан хөлсний дусал
      if ((urgent && mood === 'idle') || mood === 'scared') {
        ctx.fillStyle = '#7CF5FF';
        ctx.beginPath();
        const dy = (t / 6) % 40;
        ctx.ellipse(hx + 20, heroY - 70 + dy, 2.2, 3.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      if (mood === 'scared') {
        ctx.font = `800 18px ${fontRef.current}`;
        ctx.fillStyle = C.danger;
        ctx.fillText('!', hx + 24, heroY - 78);
      }

      // ── Салют / хагархай (дэлгэцийн координатаар) ──
      for (const r of rocketsRef.current) if (r.y === 9999) r.y = platY;
      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy * dt;
        r.vy += 700 * dt;
        const rx = r.x - cam;
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(rx, r.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(rx, r.y);
        ctx.lineTo(rx, r.y + 12);
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (r.y <= r.targetY || r.vy >= 0) {
          const n = 50 + Math.floor(Math.random() * 30);
          const second = Math.random() < 0.5 ? FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)] : r.color;
          for (let k = 0; k < n; k++) {
            const a = (Math.PI * 2 * k) / n + (Math.random() - 0.5) * 0.15;
            const sp = 50 + Math.random() * 190;
            particlesRef.current.push({
              x: r.x,
              y: r.y,
              vx: Math.cos(a) * sp,
              vy: Math.sin(a) * sp,
              life: 0,
              max: 0.8 + Math.random() * 0.7,
              color: k % 2 ? second : r.color,
              size: 1.4 + Math.random() * 1.6,
              g: 200,
            });
          }
          if (t - lastBoom > 120) {
            lastBoom = t;
            sfx.boom();
          }
          rockets.splice(i, 1);
        }
      }
      const ps = particlesRef.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        const q = ps[i];
        q.life += dt;
        if (q.life >= q.max) {
          ps.splice(i, 1);
          continue;
        }
        q.vy += q.g * dt;
        q.vx *= 1 - 1.3 * dt;
        if (q.g < 500) q.vy *= 1 - 0.9 * dt;
        q.x += q.vx * dt;
        q.y += q.vy * dt;
        const k = 1 - q.life / q.max;
        ctx.globalAlpha = k;
        ctx.fillStyle = q.color;
        ctx.beginPath();
        ctx.arc(q.x - cam, q.y, q.size * (0.6 + 0.4 * k), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ── Popup текст ──
      const pops = popupsRef.current;
      for (let i = pops.length - 1; i >= 0; i--) {
        const pop = pops[i];
        const age = t - pop.start;
        if (age < 0) continue;
        const life = pop.big ? 2600 : 1400;
        if (age > life) {
          pops.splice(i, 1);
          continue;
        }
        const k = age / life;
        ctx.font = `800 ${pop.big ? 26 : 18}px ${fontRef.current}`;
        ctx.globalAlpha = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3;
        const scale = k < 0.15 ? easeOutBack(k / 0.15) : 1;
        ctx.save();
        ctx.translate(pop.x - cam, platY + pop.y - k * 40);
        ctx.scale(scale, scale);
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
        ctx.strokeText(pop.text, 0, 0);
        ctx.fillStyle = pop.color;
        ctx.fillText(pop.text, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      ctx.restore(); // чичрэлт

      // ── Vignette: цаг багасах тусам ирмэг улайна; унахад бүхэлдээ улаан ──
      if (typing) {
        const a = 0.55 * Math.pow(1 - p.fraction, 2) + (urgent ? 0.12 + 0.1 * Math.sin(t / 110) : 0);
        const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.72);
        vg.addColorStop(0, 'rgba(255,70,90,0)');
        vg.addColorStop(1, `rgba(255,70,90,${a.toFixed(3)})`);
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, w, h);
      } else if (fall) {
        const a = Math.min(0.45, 0.15 + fallAge / 3000);
        const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.15, w / 2, h / 2, Math.max(w, h) * 0.75);
        vg.addColorStop(0, 'rgba(120,10,30,0)');
        vg.addColorStop(1, `rgba(120,10,30,${a.toFixed(3)})`);
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, w, h);
      } else if (p.playing && p.status === 'correct') {
        const age = Math.max(0, t - feedbackRef.current.start);
        const a = Math.max(0, 0.3 - age / 2500);
        if (a > 0) {
          ctx.fillStyle = `rgba(61,220,151,${a.toFixed(3)})`;
          ctx.fillRect(0, 0, w, h);
        }
      }

      // ── HUD ──
      if (p.playing) {
        const ended = p.status === 'fall' || p.status === 'win';
        // цаг (зүүн дээд)
        const hudW = 150;
        ctx.fillStyle = 'rgba(7,10,18,0.72)';
        rr(ctx, 12, 12, hudW, 50, 12);
        ctx.fill();
        ctx.strokeStyle = typing ? timer : C.ink600;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        const pulse = urgent ? 1 + 0.08 * Math.abs(Math.sin(t / 120)) : 1;
        ctx.save();
        ctx.translate(44, 37);
        ctx.scale(pulse, pulse);
        ctx.font = `800 28px ${fontRef.current}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = timer;
        ctx.shadowBlur = urgent ? 18 : 8;
        const statusColor = typing ? timer : p.status === 'correct' || p.status === 'win' ? C.success : C.danger;
        ctx.fillStyle = statusColor;
        ctx.fillText(String(p.status === 'fall' ? 0 : p.remainSec), 0, 1);
        ctx.shadowBlur = 0;
        ctx.restore();
        ctx.font = `600 10px ${fontRef.current}`;
        ctx.textAlign = 'left';
        ctx.fillStyle = C.mist300;
        const label =
          p.status === 'fall' ? 'GAME OVER' : p.status === 'win' ? 'ЯЛАЛТ!' : p.status === 'correct' ? 'АМЖИЛТТАЙ' : urgent ? 'ЯАРААРАЙ!' : 'СЕКУНД';
        ctx.fillText(label, 74, 27);
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        rr(ctx, 74, 36, hudW - 86, 8, 4);
        ctx.fill();
        ctx.fillStyle = statusColor;
        rr(ctx, 74, 36, (hudW - 86) * (typing ? p.fraction : p.status === 'fall' ? 0 : 1), 8, 4);
        ctx.fill();

        // раунд + оноо (баруун дээд)
        ctx.font = `700 12px ${fontRef.current}`;
        ctx.textAlign = 'right';
        const roundLabel = `${Math.min(p.idx + 1, p.total)} / ${p.total}`;
        const scoreLabel = `★ ${p.score}`;
        const lw = Math.max(ctx.measureText(roundLabel).width, ctx.measureText(scoreLabel).width) + 22;
        ctx.fillStyle = 'rgba(7,10,18,0.72)';
        rr(ctx, w - 12 - lw, 12, lw, 50, 12);
        ctx.fill();
        ctx.strokeStyle = C.ink600;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = C.mist50;
        ctx.fillText(roundLabel, w - 23, 26);
        ctx.fillStyle = C.modifier;
        ctx.fillText(scoreLabel, w - 23, 47);
        if (p.streak >= 2 && !ended) {
          const s = `🔥 ${p.streak}x`;
          const sw = ctx.measureText(s).width + 22;
          ctx.fillStyle = 'rgba(255,154,107,0.18)';
          rr(ctx, w - 12 - sw, 68, sw, 26, 9);
          ctx.fill();
          ctx.fillStyle = C.verb;
          ctx.fillText(s, w - 23, 81.5);
        }
        // Санамж: блок дээр дарж болно
        if (typing && !blocksRef.current.some((b) => b.used)) {
          ctx.font = `500 10px ${fontRef.current}`;
          ctx.textAlign = 'center';
          ctx.fillStyle = 'rgba(168,182,204,0.7)';
          ctx.fillText('Үгийн блок дээр дарж нэмж болно', w / 2, WORDS_TOP - 14);
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 bg-ink-950">
      <canvas ref={canvasRef} className="block touch-manipulation font-body" aria-hidden="true" />
    </div>
  );
}
