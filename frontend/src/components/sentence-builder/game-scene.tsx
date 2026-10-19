// frontend/src/components/sentence-builder/game-scene.tsx
// "Өгүүлбэр бүтээх" тоглоомын 2D дүрслэл — canvas дээр rAF-аар зурна.
// Шөнийн тэнгэр, од, сар, уулс, хотын дүрс (parallax), 10 тавцан, робот баатар,
// тэнгэрт хөвөх үгийн блокууд, цагийн HUD, салют, оноо хөөрөх popup, дэлгэц чичрэлт.
// React re-render-ээс хамаарахгүй: props-ийг ref-д хадгалаад кадр бүрт шууд уншина.
'use client';

import { useEffect, useRef } from 'react';
import { timerColor } from '@/lib/sentence-builder';
import { sfx } from '@/lib/sentence-builder-sfx';

export type SceneStatus = 'typing' | 'correct' | 'timeout';
export type PlatformResult = 'correct' | 'timeout';

export type GameSceneProps = {
  /** Нийт тавцангийн тоо (раундын тоо) */
  total: number;
  /** Одоогийн раунд (0-based) — баатар энэ тавцан дээр зогсоно */
  idx: number;
  /** Дууссан раундуудын үр дүн */
  results: PlatformResult[];
  status: SceneStatus;
  /** Үлдсэн хугацааны хувь 1 → 0 */
  fraction: number;
  remainSec: number;
  words: string[];
  streak: number;
  /** Сүүлийн зөв хариултын оноо — popup-д */
  lastPoints: number;
  /** false бол HUD-ийн цаг харагдахгүй (эхлэх дэлгэцийн preview) */
  playing: boolean;
};

// ─── Тогтмолууд ───
const SPACING = 180;
const FIRST_X = 200;
const PLAT_W = 116;
const PLAT_H = 18;
const JUMP_MS = 620;

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

type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number };
type Rocket = { x: number; y: number; vy: number; targetY: number; color: string };
type Popup = { text: string; x: number; y: number; start: number; color: string };

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
const STARS = Array.from({ length: 90 }, () => ({ x: rnd() * 2600, y: rnd() * 0.6, r: 0.6 + rnd() * 1.4, p: rnd() * Math.PI * 2, s: 1 + rnd() * 2 }));
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

type Mood = 'idle' | 'happy' | 'sad' | 'jump';

/** Робот баатар. (x, y) = хөлийн суурь. squash: 1 = энгийн, <1 = хавтгай, >1 = сунасан. */
function drawHero(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, mood: Mood, squash: number, antenna: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1 / squash, squash);
  const bob = mood === 'jump' ? 0 : Math.sin(t / 420) * 1.6;
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
  ctx.fillStyle = C.success;
  ctx.beginPath();
  ctx.arc(-3, bodyY + 12.5, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.modifier;
  ctx.beginPath();
  ctx.arc(3, bodyY + 12.5, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // гар
  ctx.fillStyle = C.brandHi;
  const armLift = mood === 'happy' ? -14 : mood === 'jump' ? -8 : 0;
  const armSwing = mood === 'idle' ? Math.sin(t / 500) * 2 : 0;
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

export function GameScene(props: GameSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  // Анимацийн төлөв (React state биш)
  const heroXRef = useRef(platformX(props.idx));
  const jumpRef = useRef<{ from: number; to: number; start: number; landed: boolean } | null>(null);
  const feedbackRef = useRef<{ status: SceneStatus; start: number }>({ status: 'typing', start: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const popupsRef = useRef<Popup[]>([]);
  const shakeRef = useRef<{ amp: number; start: number }>({ amp: 0, start: 0 });
  const prevIdxRef = useRef(props.idx);
  const prevStatusRef = useRef<SceneStatus>(props.status);
  const camRef = useRef<number | null>(null);
  const fontRef = useRef('ui-monospace, monospace');

  // Раунд солигдоход үсрэлт
  useEffect(() => {
    const prev = prevIdxRef.current;
    if (props.idx !== prev) {
      const now = performance.now();
      if (props.idx === prev + 1 && props.playing) {
        jumpRef.current = { from: platformX(prev), to: platformX(props.idx), start: now, landed: false };
        sfx.jump();
      } else {
        jumpRef.current = null;
        heroXRef.current = platformX(props.idx);
      }
      prevIdxRef.current = props.idx;
    }
  }, [props.idx, props.playing]);

  // Хариултын үр дүн: баяр / гуниг, салют, popup, чичрэлт
  useEffect(() => {
    const prev = prevStatusRef.current;
    if (props.status === prev) return;
    prevStatusRef.current = props.status;
    const now = performance.now();
    feedbackRef.current = { status: props.status, start: now };
    if (props.status === 'correct') {
      const hx = heroXRef.current;
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
    } else if (props.status === 'timeout') {
      shakeRef.current = { amp: 7, start: now };
      popupsRef.current.push({ text: 'Цаг дууслаа', x: heroXRef.current + 90, y: -60, start: now, color: C.danger });
    }
  }, [props.status]);

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
      h = Math.round(Math.max(300, Math.min(340, w * 0.42)));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let raf = 0;
    let last = 0;
    let lastRocketCheck = 0;

    const draw = () => {
      // rAF-ийн timestamp performance.now()-оос хоцорч болох тул нэг л цагийн эх үүсвэр хэрэглэнэ
      const t = performance.now();
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      const p = propsRef.current;
      const groundY = h - 34;
      const platY = h - 78;
      const timer = timerColor(p.fraction);
      const typing = p.status === 'typing' && p.playing;
      const urgent = typing && p.fraction <= 5 / 30;

      // ── Баатрын байрлал (үсрэлт) ──
      let heroY = platY;
      let squash = 1;
      let mood: Mood = 'idle';
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
      } else {
        const fb = feedbackRef.current;
        const age = Math.max(0, t - fb.start);
        if (fb.status === 'correct' && age < 1800) {
          mood = 'happy';
          const hop = Math.abs(Math.sin(age / 180)) * Math.max(0, 1 - age / 1800) * 26;
          heroY = platY - hop;
          squash = 1 + hop / 120;
        } else if (fb.status === 'timeout' && age < 2200) {
          mood = 'sad';
          squash = 0.93;
        }
      }
      const heroX = heroXRef.current;

      // ── Камер ──
      const worldW = platformX(p.total - 1) + PLAT_W / 2 + 140;
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
      if (urgent) {
        sx += (Math.random() - 0.5) * 1.6;
        sy += (Math.random() - 0.5) * 1.6;
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

      // Сар
      const moonX = w - 70 - cam * 0.04;
      ctx.shadowColor = 'rgba(255,241,200,0.55)';
      ctx.shadowBlur = 26;
      ctx.fillStyle = '#FFF1C8';
      ctx.beginPath();
      ctx.arc(moonX, 52, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#0B1327';
      ctx.beginPath();
      ctx.arc(moonX + 9, 46, 17, 0, Math.PI * 2);
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

      // Газар
      ctx.fillStyle = C.ink900;
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
        const res = p.results[i];
        const isCur = i === p.idx;
        let fill = C.ink600;
        let stroke = C.ink500;
        if (res === 'correct') {
          fill = '#1F5C45';
          stroke = C.success;
        } else if (res === 'timeout') {
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
        // тавцан
        if (isCur && p.playing) {
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
        // цаг дууссан тавцан: ан цав
        if (res === 'timeout') {
          ctx.strokeStyle = C.danger;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x - 20, platY + 2);
          ctx.lineTo(x - 8, platY + 10);
          ctx.lineTo(x - 14, platY + PLAT_H - 2);
          ctx.moveTo(x + 18, platY + 1);
          ctx.lineTo(x + 10, platY + 9);
          ctx.lineTo(x + 20, platY + PLAT_H - 1);
          ctx.stroke();
        }
        // дугаар / тэмдэг
        ctx.fillStyle = res === 'correct' ? C.success : res === 'timeout' ? C.danger : isCur ? C.mist50 : C.mist500;
        ctx.fillText(res === 'correct' ? '✓' : res === 'timeout' ? '✗' : String(i + 1), x, platY + PLAT_H / 2 + 0.5);
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
        ctx.lineTo(fx, platY - 44);
        ctx.stroke();
        const wave = Math.sin(t / 220) * 3;
        ctx.fillStyle = C.modifier;
        ctx.beginPath();
        ctx.moveTo(fx, platY - 44);
        ctx.lineTo(fx + 26, platY - 38 + wave);
        ctx.lineTo(fx, platY - 30);
        ctx.closePath();
        ctx.fill();
      }

      // ── Үгийн блокууд (одоогийн раунд) ──
      if (p.playing || p.words.length) {
        const fb = feedbackRef.current;
        const age = Math.max(0, t - fb.start);
        const dropping = fb.status === 'correct' && age < 700;
        const gone = fb.status === 'correct' && age >= 700;
        if (!gone || jumpRef.current) {
          ctx.font = `700 15px ${fontRef.current}`;
          const pad = 18;
          const widths = p.words.map((wd) => Math.max(56, ctx.measureText(wd).width + pad * 2));
          const gap = 10;
          const totalW = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1);
          let bx = platformX(p.idx) - cam - totalW / 2;
          const baseY = platY - 140;
          p.words.forEach((wd, i) => {
            const bob = Math.sin(t / 520 + i * 1.3) * 5;
            let y = baseY + bob;
            let alpha = 1;
            if (dropping) {
              const k = easeOutCubic(age / 700);
              y = baseY + (platY - 10 - baseY) * k;
              alpha = 1 - k;
            }
            if (jumpRef.current) alpha = Math.min(alpha, Math.max(0, Math.min(1, (t - jumpRef.current.start) / JUMP_MS)));
            ctx.globalAlpha = alpha;
            ctx.shadowColor = 'rgba(110,168,255,0.5)';
            ctx.shadowBlur = 14;
            ctx.fillStyle = C.subjectDim;
            rr(ctx, bx, y, widths[i], 34, 9);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = C.subject;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.fillStyle = C.mist50;
            ctx.fillText(wd, bx + widths[i] / 2, y + 17.5);
            // доош чиглэсэн "утас" — хөвж буй мэт
            ctx.globalAlpha = alpha * 0.25;
            ctx.strokeStyle = C.subject;
            ctx.beginPath();
            ctx.moveTo(bx + widths[i] / 2, y + 34);
            ctx.lineTo(bx + widths[i] / 2, y + 48);
            ctx.stroke();
            ctx.globalAlpha = 1;
            bx += widths[i] + gap;
          });
        }
      }

      // ── Баатар ──
      const hx = heroX - cam;
      // сүүдэр
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      const shadowK = Math.max(0.35, 1 - (platY - heroY) / 120);
      ctx.ellipse(hx, platY + 2, 16 * shadowK, 4 * shadowK, 0, 0, Math.PI * 2);
      ctx.fill();
      const jitterX = urgent && mood === 'idle' ? (Math.random() - 0.5) * 2 : 0;
      drawHero(ctx, hx + jitterX, heroY, t, mood, squash, p.playing ? timer : C.success);
      // сандарсан хөлсний дусал
      if (urgent && mood === 'idle') {
        ctx.fillStyle = '#7CF5FF';
        ctx.beginPath();
        const dy = (t / 6) % 40;
        ctx.ellipse(hx + 20, heroY - 70 + dy, 2.2, 3.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      if (mood === 'sad') {
        ctx.font = `700 16px ${fontRef.current}`;
        ctx.fillStyle = C.danger;
        ctx.fillText('!', hx + 22, heroY - 74);
      }

      // ── Салют (дэлгэцийн координатаар) ──
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
            });
          }
          if (t - lastRocketCheck > 120) {
            lastRocketCheck = t;
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
        q.vy += 200 * dt;
        q.vx *= 1 - 1.3 * dt;
        q.vy *= 1 - 0.9 * dt;
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
      ctx.font = `800 18px ${fontRef.current}`;
      const pops = popupsRef.current;
      for (let i = pops.length - 1; i >= 0; i--) {
        const pop = pops[i];
        const age = t - pop.start;
        if (age < 0) continue;
        if (age > 1400) {
          pops.splice(i, 1);
          continue;
        }
        const k = age / 1400;
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

      // ── Улаан vignette: цаг багасах тусам ирмэг улайна ──
      if (typing) {
        const a = 0.55 * Math.pow(1 - p.fraction, 2) + (urgent ? 0.12 + 0.1 * Math.sin(t / 110) : 0);
        const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.72);
        vg.addColorStop(0, 'rgba(255,70,90,0)');
        vg.addColorStop(1, `rgba(255,70,90,${a.toFixed(3)})`);
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
        ctx.fillStyle = typing ? timer : p.status === 'correct' ? C.success : C.danger;
        ctx.fillText(String(p.status === 'timeout' ? 0 : p.remainSec), 0, 1);
        ctx.shadowBlur = 0;
        ctx.restore();
        ctx.font = `600 10px ${fontRef.current}`;
        ctx.textAlign = 'left';
        ctx.fillStyle = C.mist300;
        ctx.fillText(typing ? (urgent ? 'ЯАРААРАЙ!' : 'СЕКУНД') : p.status === 'correct' ? 'АМЖИЛТТАЙ' : 'ЦАГ ДУУСЛАА', 74, 27);
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        rr(ctx, 74, 36, hudW - 86, 8, 4);
        ctx.fill();
        ctx.fillStyle = typing ? timer : p.status === 'correct' ? C.success : C.danger;
        rr(ctx, 74, 36, (hudW - 86) * (typing ? p.fraction : p.status === 'correct' ? 1 : 0), 8, 4);
        ctx.fill();

        // раунд (баруун дээд)
        ctx.font = `700 12px ${fontRef.current}`;
        ctx.textAlign = 'right';
        const label = `${p.idx + 1} / ${p.total}`;
        const lw = ctx.measureText(label).width + 22;
        ctx.fillStyle = 'rgba(7,10,18,0.72)';
        rr(ctx, w - 12 - lw, 12, lw, 26, 9);
        ctx.fill();
        ctx.fillStyle = C.mist50;
        ctx.fillText(label, w - 23, 25.5);
        if (p.streak >= 2) {
          const s = `🔥 ${p.streak}`;
          const sw = ctx.measureText(s).width + 22;
          ctx.fillStyle = 'rgba(255,154,107,0.18)';
          rr(ctx, w - 12 - sw, 44, sw, 26, 9);
          ctx.fill();
          ctx.fillStyle = C.verb;
          ctx.fillText(s, w - 23, 57.5);
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
    <div ref={wrapRef} className="relative w-full overflow-hidden rounded-2xl border border-ink-600/80 bg-ink-950 shadow-card">
      <canvas ref={canvasRef} className="block w-full font-body" aria-hidden="true" />
    </div>
  );
}
