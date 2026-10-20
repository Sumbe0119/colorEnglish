// frontend/src/components/type-rush/race-scene.tsx
// "Бичих уралдаан" тоглоомын 2D дүрслэл — canvas дээр rAF-аар зурна. Эцэг элементээ бүтнээр дүүргэнэ.
// Хажуу талаас харсан, гүйж буй уралдааны зам: камер тоглогчийн машиныг дагана; түвшнээс хамаарсан
// тэнгэр (өдөр / нар жаргах / шөнө), үүл, уулс, хот/мод (parallax), 5 замтай асфальт, гарааны гэрэл,
// барианы хаалга + үзэгчдийн индэр. Машинууд canvas-ийн primitive-ээр (дугуй эргэнэ, утаа, нитро дөл,
// сүүдэр, нэрийн пайз). HUD (цаг, WPM, нарийвчлал, түвшин, байр), 3-2-1-GO countdown, салют, popup,
// дэлгэц чичрэлт бүгд canvas дээр. React re-render-ээс хамаарахгүй: props-ийг ref-д хадгалаад кадр бүрт уншина.
// Машины байрлалыг imperative handle-аар (setProgress) шинэчилнэ — хуучин RaceTrack-тай ижил API.
'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { LANES, RACE_CARS, type RaceLevel } from '@/lib/type-rush';
import { sfx } from '@/lib/type-rush-sfx';

export type SceneLane = {
  name: string;
  /** 'ТА' | 'БОТ' | 'ТОГЛОГЧ' | '' */
  tag: string;
  isPlayer: boolean;
  sub?: string;
  /** Хоосон зам — машиныг бүдэг харуулна. */
  dim?: boolean;
};

export type HudState = {
  /** Цагийн текст, ж: "12.34" */
  timerText: string;
  /** Цагийн доорх бичиг: "СЕКУНД" / "ҮЛДСЭН" */
  timerLabel: string;
  /** Үлдсэн хугацааны хувь (цагийн хязгаартай үед), null бол зурвас зурахгүй */
  fraction: number | null;
  wpm: number;
  accuracy: number;
  urgent: boolean;
  /** Тоглогчийн байр; null бол машинуудын байрлалаас шууд тооцно */
  position: number | null;
  levelLabel: string;
};

/** 3 | 2 | 1 (гарааны гэрэл асна) | 'GO' | null. 3-аас их тоо ч зурагдана (гэрэл асахгүй). */
export type CountdownStep = number | 'GO' | null;

export type RaceSceneHandle = {
  /** Машины байрлал (0..1). */
  setProgress(lane: number, p: number): void;
  getProgress(lane: number): number;
  resetAll(): void;
  /** Машины одоогийн байрлалд утаа гаргана. */
  emitPuffs(lane: number, count: number, size: number): void;
  /** Нитро — дөл, хурдны зураас, чичрэлт (хурдан үг). */
  boost(lane: number): void;
  setHud(h: Partial<HudState>): void;
  /** 3 → 2 → 1 → GO. GO нь өөрөө ~0.7с-ийн дараа арилна; null шууд арилгана. */
  countdown(step: CountdownStep): void;
  /** Бариа хүрсэн — байрын popup, конфетти (1-р байр бол салют). */
  celebrate(lane: number, rank: number): void;
  /** Цаг дууссан — улаан vignette, popup, чичрэлт. */
  timeUp(): void;
};

export type RaceSceneProps = {
  lanes: SceneLane[];
  /** Камер дагах зам; null бол тэргүүлэгчийг дагана (үзэгч). */
  playerLane: number | null;
  /** Уралдаан явагдаж байна — дугуй эргэнэ, замын зураас гүйнэ. */
  running: boolean;
  /** Тэнгэрийн өнгө: A1 өдөр, A2 нар жаргах, B1 шөнө. */
  level: RaceLevel;
  showHud: boolean;
  /** Гарааны байрлал дээр зогсож буй preview (сонголтын дэлгэц, lobby) — камер гарааг харуулна. */
  preview?: boolean;
  onTap?: () => void;
};

// ─── Тогтмолууд ───
const START_X = 150;
const MAX_PUFFS = 90;
const BOOST_MS = 560;
const COUNT_POP_MS = 380;
const GO_MS = 750;

const C = {
  brand: '#4F8CFF',
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
  mist400: '#8B9BB5',
  mist500: '#6B7A94',
};

const CONFETTI_COLORS = [C.brand, C.verb, C.success, C.modifier, C.danger, '#C58CFF', '#FFFFFF'];
const CROWD_COLORS = ['#FF6B7A', '#4F8CFF', '#FFD166', '#3DDC97', '#C58CFF', '#FF9A6B', '#F5F8FC', '#6EA8FF'];

type Palette = {
  sky: [string, string, string];
  far: string;
  near: string;
  nearDetail: string;
  grass: string;
  grassDark: string;
  road: string;
  roadLight: string;
  night: boolean;
  sunset: boolean;
};

const PALETTES: Record<RaceLevel, Palette> = {
  A1: {
    sky: ['#3F9BEF', '#8FCBFF', '#D9EFFF'],
    far: '#7FAFD6',
    near: '#2F7A3E',
    nearDetail: '#246230',
    grass: '#4C9D4E',
    grassDark: '#3E8440',
    road: '#3A3F4B',
    roadLight: '#474D5A',
    night: false,
    sunset: false,
  },
  A2: {
    sky: ['#2B2A6B', '#C95B6A', '#FFC078'],
    far: '#5A3F6E',
    near: '#2E2347',
    nearDetail: '#1E1733',
    grass: '#5F7E3A',
    grassDark: '#4C6830',
    road: '#353846',
    roadLight: '#434757',
    night: false,
    sunset: true,
  },
  B1: {
    sky: ['#05070F', '#0B1327', '#1A2A4A'],
    far: '#121B30',
    near: '#141C2E',
    nearDetail: '#0C1220',
    grass: '#1E3A2A',
    grassDark: '#182E22',
    road: '#262B36',
    roadLight: '#30363F',
    night: true,
    sunset: false,
  },
};

type Puff = { x: number; y: number; vx: number; vy: number; size: number; life: number; max: number };
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
  g: number;
  rot: number;
  vr: number;
  rect: boolean;
};
type Rocket = { x: number; y: number; vy: number; targetY: number; color: string };
type Popup = { text: string; x: number; y: number; start: number; color: string; big?: boolean; screen?: boolean };
type SpeedLine = { y: number; x: number; len: number; start: number };

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

const rnd = mulberry32(20261020);
const STARS = Array.from({ length: 90 }, () => ({ x: rnd() * 3000, y: rnd() * 0.75, r: 0.6 + rnd() * 1.3, p: rnd() * Math.PI * 2, s: 1 + rnd() * 2 }));
const CLOUDS = Array.from({ length: 14 }, () => ({ x: rnd() * 3200, y: 0.08 + rnd() * 0.5, s: 0.7 + rnd() * 0.9 }));
const MOUNTAINS = Array.from({ length: 48 }, (_, i) => ({ x: i * 120, h: 0.35 + rnd() * 0.65 }));
const BUILDINGS = Array.from({ length: 90 }, (_, i) => ({
  x: i * 46 + rnd() * 10,
  w: 24 + rnd() * 24,
  h: 0.25 + rnd() * 0.75,
  win: Array.from({ length: 12 }, () => rnd() < 0.55),
}));
const TREES = Array.from({ length: 120 }, (_, i) => ({ x: i * 34 + rnd() * 20, s: 0.6 + rnd() * 0.7, kind: rnd() < 0.5 ? 0 : 1 }));
const CROWD = Array.from({ length: 160 }, (_, i) => ({ i, c: CROWD_COLORS[Math.floor(rnd() * CROWD_COLORS.length)], p: rnd() * Math.PI * 2 }));

function clamp01(v: number) {
  return Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0));
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

/**
 * Хажуу талаас харсан уралдааны машин. (x, y) = дугуйн газар хүрэх шугамын төв; баруун тийш харна.
 * s = масштаб (1 = 100×44 px). wheelRot радиан; boost 0..1 нитро дөл; dim бол бүдэг.
 */
export function drawCar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  color: string,
  dark: string,
  t: number,
  wheelRot: number,
  boost: number,
  dim: boolean,
  headlights: boolean,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  if (dim) ctx.globalAlpha = 0.35;

  // сүүдэр
  ctx.fillStyle = 'rgba(0,0,0,0.38)';
  ctx.beginPath();
  ctx.ellipse(0, 1.5, 52, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // нитро дөл (арын хэсэгт, их биеийн ард)
  if (boost > 0) {
    const fl = 18 + boost * 30 + Math.sin(t / 22) * 5;
    ctx.save();
    ctx.translate(-52, -15);
    const layers: [string, number][] = [
      ['rgba(79,140,255,0.85)', 1],
      ['rgba(255,154,107,0.9)', 0.72],
      ['rgba(255,241,160,0.95)', 0.42],
    ];
    for (const [col, k] of layers) {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, -7 * k);
      ctx.lineTo(-fl * k, Math.sin(t / 30) * 2);
      ctx.lineTo(0, 7 * k);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // арын далавч
  ctx.fillStyle = dark;
  rr(ctx, -54, -40, 12, 4, 1.5);
  ctx.fill();
  ctx.fillRect(-47, -36, 3, 10);

  // их бие (доод хэсэг)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-50, -26);
  ctx.lineTo(-50, -9);
  ctx.quadraticCurveTo(-50, -5, -46, -5);
  ctx.lineTo(46, -5);
  ctx.quadraticCurveTo(50, -5, 50, -9);
  ctx.lineTo(50, -17);
  ctx.quadraticCurveTo(50, -26, 40, -27);
  ctx.lineTo(-44, -27);
  ctx.quadraticCurveTo(-50, -27, -50, -26);
  ctx.closePath();
  ctx.fill();
  // бүхээг
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(-32, -27);
  ctx.lineTo(-22, -43);
  ctx.lineTo(16, -43);
  ctx.lineTo(32, -27);
  ctx.closePath();
  ctx.fill();
  // цонх
  ctx.fillStyle = '#A9DDFF';
  ctx.beginPath();
  ctx.moveTo(-27, -28);
  ctx.lineTo(-20, -40);
  ctx.lineTo(-4, -40);
  ctx.lineTo(-4, -28);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#C8ECFF';
  ctx.beginPath();
  ctx.moveTo(1, -28);
  ctx.lineTo(1, -40);
  ctx.lineTo(14, -40);
  ctx.lineTo(26, -28);
  ctx.closePath();
  ctx.fill();
  // гялбаа
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath();
  ctx.moveTo(-48, -26);
  ctx.lineTo(44, -26);
  ctx.lineTo(46, -20);
  ctx.lineTo(-49, -20);
  ctx.closePath();
  ctx.fill();
  // уралдааны зураас
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(-44, -16, 86, 2.5);
  // доод хар хэсэг
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(-48, -10, 96, 5);
  // гэрэл
  ctx.fillStyle = '#FFF4B0';
  rr(ctx, 44, -24, 6, 5, 1.5);
  ctx.fill();
  if (headlights) {
    const hg = ctx.createLinearGradient(50, 0, 110, 0);
    hg.addColorStop(0, 'rgba(255,244,176,0.45)');
    hg.addColorStop(1, 'rgba(255,244,176,0)');
    ctx.fillStyle = hg;
    ctx.beginPath();
    ctx.moveTo(50, -24);
    ctx.lineTo(110, -34);
    ctx.lineTo(110, -8);
    ctx.lineTo(50, -18);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = boost > 0 ? '#FF9A6B' : '#FF3B3B';
  rr(ctx, -50, -24, 4, 5, 1.2);
  ctx.fill();

  // дугуй
  for (const wx of [-30, 29]) {
    ctx.fillStyle = '#15181F';
    ctx.beginPath();
    ctx.arc(wx, -8, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9AA3B2';
    ctx.beginPath();
    ctx.arc(wx, -8, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2A2F39';
    ctx.lineWidth = 1.6;
    for (let k = 0; k < 3; k++) {
      const a = wheelRot + (k * Math.PI * 2) / 3;
      ctx.beginPath();
      ctx.moveTo(wx, -8);
      ctx.lineTo(wx + Math.cos(a) * 5, -8 + Math.sin(a) * 5);
      ctx.stroke();
    }
    ctx.fillStyle = '#E6ECF5';
    ctx.beginPath();
    ctx.arc(wx, -8, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/** Текстийг maxW өргөнд багтаах хүртэл тайрна. */
function fitText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(`${s}…`).width > maxW) s = s.slice(0, -1);
  return `${s}…`;
}

export const RaceScene = forwardRef<RaceSceneHandle, RaceSceneProps>(function RaceScene(props, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  // Анимацийн төлөв (React state биш)
  const progRef = useRef<number[]>(Array.from({ length: LANES }, () => 0));
  const wheelRef = useRef<number[]>(Array.from({ length: LANES }, () => 0));
  const lastXRef = useRef<number[]>(Array.from({ length: LANES }, () => 0));
  const boostAtRef = useRef<number[]>(Array.from({ length: LANES }, () => -1e9));
  const puffsRef = useRef<Puff[]>([]);
  /** emitPuffs-ийг rAF-аас гадуур дуудахад машины дэлгэц дээрх байрлал мэдэгдэхгүй тул дараагийн кадрт зурна */
  const pendingPuffsRef = useRef<{ lane: number; count: number; size: number }[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const popupsRef = useRef<Popup[]>([]);
  const speedLinesRef = useRef<SpeedLine[]>([]);
  const shakeRef = useRef<{ amp: number; start: number }>({ amp: 0, start: 0 });
  const camRef = useRef<number | null>(null);
  const fontRef = useRef('ui-monospace, monospace');
  const hudRef = useRef<HudState>({
    timerText: '0.00',
    timerLabel: 'СЕКУНД',
    fraction: null,
    wpm: 0,
    accuracy: 100,
    urgent: false,
    position: null,
    levelLabel: '',
  });
  const countRef = useRef<{ step: CountdownStep; at: number }>({ step: null, at: 0 });
  const celebRef = useRef<{ lane: number; rank: number; start: number; nextRocket: number } | null>(null);
  const timeUpRef = useRef<number | null>(null);
  const finishedRef = useRef<boolean[]>(Array.from({ length: LANES }, () => false));
  /** Кадр бүрт тооцсон замын геометр — handle-ийн функцүүд (emitPuffs) ашиглана */
  const geoRef = useRef({ w: 0, h: 0, trackLen: 1600, laneY: (lane: number) => lane * 60 + 60, carScale: 0.6 });

  useImperativeHandle(
    ref,
    () => ({
      setProgress(lane, p) {
        if (lane < 0 || lane >= LANES) return;
        progRef.current[lane] = clamp01(p);
      },
      getProgress(lane) {
        return progRef.current[lane] ?? 0;
      },
      resetAll() {
        for (let i = 0; i < LANES; i++) {
          progRef.current[i] = 0;
          wheelRef.current[i] = 0;
          lastXRef.current[i] = 0;
          boostAtRef.current[i] = -1e9;
          finishedRef.current[i] = false;
        }
        puffsRef.current = [];
        pendingPuffsRef.current = [];
        particlesRef.current = [];
        rocketsRef.current = [];
        popupsRef.current = [];
        speedLinesRef.current = [];
        celebRef.current = null;
        timeUpRef.current = null;
        countRef.current = { step: null, at: 0 };
        hudRef.current = { ...hudRef.current, position: null, urgent: false, fraction: null };
      },
      emitPuffs(lane, count, size) {
        if (lane < 0 || lane >= LANES) return;
        pendingPuffsRef.current.push({ lane, count, size });
      },
      boost(lane) {
        if (lane < 0 || lane >= LANES) return;
        const now = performance.now();
        boostAtRef.current[lane] = now;
        if (lane === propsRef.current.playerLane) {
          shakeRef.current = { amp: 2.5, start: now };
          const { w, h } = geoRef.current;
          for (let i = 0; i < 9; i++) {
            speedLinesRef.current.push({ y: Math.random() * h, x: Math.random() * w, len: 50 + Math.random() * 110, start: now + Math.random() * 120 });
          }
          sfx.boost();
        }
      },
      setHud(h) {
        hudRef.current = { ...hudRef.current, ...h };
      },
      countdown(step) {
        countRef.current = { step, at: performance.now() };
      },
      celebrate(lane, rank) {
        const now = performance.now();
        celebRef.current = { lane, rank, start: now, nextRocket: now };
        finishedRef.current[lane] = true;
        hudRef.current = { ...hudRef.current, position: rank };
        const color = rank === 1 ? C.modifier : rank === 2 ? C.mist300 : rank === 3 ? C.verb : C.mist50;
        popupsRef.current.push({ text: `${rank}-р байр!`, x: 0, y: 0, start: now, color, big: true, screen: true });
        if (rank === 1) popupsRef.current.push({ text: 'ТҮРҮҮЛЛЭЭ!', x: 0, y: 38, start: now + 300, color: C.success, screen: true });
        shakeRef.current = { amp: rank === 1 ? 5 : 3, start: now };
      },
      timeUp() {
        const now = performance.now();
        timeUpRef.current = now;
        shakeRef.current = { amp: 7, start: now };
        popupsRef.current.push({ text: 'Цаг дууслаа!', x: 0, y: 0, start: now, color: C.danger, big: true, screen: true });
        hudRef.current = { ...hudRef.current, urgent: false, fraction: 0 };
      },
    }),
    [],
  );

  // Дарахад (оролт руу фокуслах)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onDown = () => propsRef.current.onTap?.();
    canvas.addEventListener('pointerdown', onDown);
    return () => canvas.removeEventListener('pointerdown', onDown);
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
      h = Math.max(220, wrap.clientHeight);
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
      const t = performance.now();
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      const p = propsRef.current;
      const hud = hudRef.current;
      const pal = PALETTES[p.level] ?? PALETTES.A1;
      const font = fontRef.current;
      const compact = h < 360;
      const narrow = w < 560;

      // ── Геометр ──
      const horizonY = Math.round(compact ? h * 0.3 : h * 0.4);
      const roadTop = horizonY + (compact ? 10 : 22);
      const roadBottom = h - (compact ? 6 : 12);
      const laneH = (roadBottom - roadTop) / LANES;
      const carH = Math.max(15, Math.min(34, laneH * 0.56));
      const carScale = carH / 44;
      const carW = 104 * carScale;
      const trackLen = Math.max(1400, w * 2.6);
      const finishX = START_X + trackLen;
      const worldW = finishX + w * 0.65;
      const laneY = (lane: number) => roadTop + (lane + 1) * laneH - laneH * 0.14;
      const carX = (lane: number) => START_X + progRef.current[lane] * trackLen;
      geoRef.current = { w, h, trackLen, laneY, carScale };

      const celeb = celebRef.current;
      const timeUpAge = timeUpRef.current != null ? t - timeUpRef.current : -1;
      const count = countRef.current;
      const countAge = t - count.at;
      if (count.step === 'GO' && countAge > GO_MS) countRef.current = { step: null, at: 0 };

      // ── Хүлээгдэж буй утаа (машины ард, дэлхийн координатаар) ──
      for (const q of pendingPuffsRef.current) {
        const cx = carX(q.lane) - carW * 0.5;
        const cy = laneY(q.lane) - carH * 0.35;
        for (let i = 0; i < q.count; i++) {
          puffsRef.current.push({
            x: cx - i * 5,
            y: cy + (Math.random() - 0.5) * 6,
            vx: -40 - Math.random() * 50,
            vy: -12 - Math.random() * 18,
            size: (q.size + Math.random() * q.size * 0.6) * Math.max(0.5, carScale * 1.4),
            life: -i * 0.07,
            max: 0.8 + Math.random() * 0.3,
          });
        }
      }
      pendingPuffsRef.current = [];
      if (puffsRef.current.length > MAX_PUFFS) puffsRef.current.splice(0, puffsRef.current.length - MAX_PUFFS);

      // ── Дугуйн эргэлт (явсан зайгаар) ──
      for (let i = 0; i < LANES; i++) {
        const x = carX(i);
        const dx = x - lastXRef.current[i];
        lastXRef.current[i] = x;
        if (dx > 0) wheelRef.current[i] += dx / (10 * carScale);
        else if (p.running && !p.lanes[i]?.dim) wheelRef.current[i] += dt * 0.6;
      }

      // ── Камер ──
      let focusX: number;
      if (p.preview) focusX = START_X;
      else if (p.playerLane != null) focusX = carX(p.playerLane);
      else {
        let best = 0;
        for (let i = 0; i < LANES; i++) if (!p.lanes[i]?.dim) best = Math.max(best, progRef.current[i]);
        focusX = START_X + best * trackLen;
      }
      let targetCam = focusX - w * 0.35;
      targetCam = Math.max(0, Math.min(worldW - w, targetCam));
      if (camRef.current == null) camRef.current = targetCam;
      camRef.current += (targetCam - camRef.current) * Math.min(1, dt * 5);
      const cam = camRef.current;

      // ── Чичрэлт ──
      let sx = 0;
      let sy = 0;
      const sh = shakeRef.current;
      const shAge = t - sh.start;
      if (sh.amp > 0 && shAge < 420) {
        const k = 1 - shAge / 420;
        sx = (Math.random() - 0.5) * 2 * sh.amp * k;
        sy = (Math.random() - 0.5) * 2 * sh.amp * k;
      }
      if (hud.urgent && p.showHud && timeUpAge < 0) {
        sx += (Math.random() - 0.5) * 1.4;
        sy += (Math.random() - 0.5) * 1.4;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(sx, sy);

      // ── Тэнгэр ──
      const sky = ctx.createLinearGradient(0, 0, 0, horizonY + 10);
      sky.addColorStop(0, pal.sky[0]);
      sky.addColorStop(0.6, pal.sky[1]);
      sky.addColorStop(1, pal.sky[2]);
      ctx.fillStyle = sky;
      ctx.fillRect(-10, -10, w + 20, horizonY + 20);

      if (pal.night) {
        for (const s of STARS) {
          const x = ((s.x - cam * 0.06) % 3000 + 3000) % 3000 - 100;
          if (x < -5 || x > w + 5) continue;
          const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t / (380 * s.s) + s.p));
          ctx.globalAlpha = tw;
          ctx.fillStyle = '#E6ECF5';
          ctx.beginPath();
          ctx.arc(x, s.y * horizonY + 4, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        // сар
        const moonX = w * 0.78 - cam * 0.03;
        const moonY = horizonY * 0.3;
        ctx.shadowColor = 'rgba(255,241,200,0.55)';
        ctx.shadowBlur = 26;
        ctx.fillStyle = '#FFF1C8';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = pal.sky[1];
        ctx.beginPath();
        ctx.arc(moonX + 9, moonY - 7, 17, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // нар
        const sunX = (pal.sunset ? w * 0.6 : w * 0.8) - cam * 0.03;
        const sunY = pal.sunset ? horizonY * 0.82 : horizonY * 0.28;
        const sunR = pal.sunset ? 30 : 24;
        const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.6, sunX, sunY, sunR * 3.2);
        glow.addColorStop(0, pal.sunset ? 'rgba(255,180,90,0.55)' : 'rgba(255,240,170,0.5)');
        glow.addColorStop(1, 'rgba(255,240,170,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(sunX - sunR * 3.2, sunY - sunR * 3.2, sunR * 6.4, sunR * 6.4);
        ctx.fillStyle = pal.sunset ? '#FFB347' : '#FFE066';
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Үүл (parallax 0.1)
      ctx.fillStyle = pal.night ? 'rgba(120,140,180,0.16)' : pal.sunset ? 'rgba(255,220,200,0.75)' : 'rgba(255,255,255,0.92)';
      for (const c of CLOUDS) {
        const x = ((c.x - cam * 0.1 - t * 0.006) % 3200 + 3200) % 3200 - 160;
        if (x < -160 || x > w + 40) continue;
        const y = c.y * horizonY * 0.8 + 6;
        const s = c.s * (compact ? 0.7 : 1);
        ctx.beginPath();
        ctx.ellipse(x, y, 34 * s, 11 * s, 0, 0, Math.PI * 2);
        ctx.ellipse(x - 18 * s, y + 3 * s, 20 * s, 9 * s, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 20 * s, y + 2 * s, 22 * s, 10 * s, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 2 * s, y - 7 * s, 20 * s, 11 * s, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Уулс (parallax 0.25)
      const mountH = compact ? horizonY * 0.55 : horizonY * 0.5;
      ctx.fillStyle = pal.far;
      ctx.beginPath();
      ctx.moveTo(-10, horizonY + 2);
      for (const m of MOUNTAINS) {
        const x = ((m.x - cam * 0.25) % 5760 + 5760) % 5760 - 300;
        if (x < -200 || x > w + 200) continue;
        ctx.lineTo(x, horizonY - m.h * mountH);
        ctx.lineTo(x + 60, horizonY - m.h * mountH * 0.45);
      }
      ctx.lineTo(w + 10, horizonY + 2);
      ctx.closePath();
      ctx.fill();
      // Цасан орой (өдөр)
      if (!pal.night) {
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        for (const m of MOUNTAINS) {
          if (m.h < 0.7) continue;
          const x = ((m.x - cam * 0.25) % 5760 + 5760) % 5760 - 300;
          if (x < -200 || x > w + 200) continue;
          const top = horizonY - m.h * mountH;
          ctx.beginPath();
          ctx.moveTo(x, top);
          ctx.lineTo(x + 14, top + 11);
          ctx.lineTo(x + 6, top + 9);
          ctx.lineTo(x - 2, top + 13);
          ctx.lineTo(x - 11, top + 10);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Хот (шөнө / нар жаргах) эсвэл мод (өдөр) — parallax 0.5
      const nearH = compact ? 26 : 48;
      if (pal.night || pal.sunset) {
        for (const b of BUILDINGS) {
          const x = ((b.x - cam * 0.5) % 4140 + 4140) % 4140 - 200;
          if (x + b.w < -5 || x > w + 5) continue;
          const bh = 10 + b.h * nearH;
          ctx.fillStyle = pal.near;
          ctx.fillRect(x, horizonY - bh, b.w, bh + 2);
          ctx.fillStyle = pal.night ? 'rgba(255,209,102,0.6)' : 'rgba(255,230,150,0.35)';
          const cols = Math.max(1, Math.floor(b.w / 8));
          for (let i = 0; i < b.win.length; i++) {
            if (!b.win[i]) continue;
            const cx = x + 3 + (i % cols) * 8;
            const cy = horizonY - bh + 5 + Math.floor(i / cols) * 9;
            if (cx + 3 > x + b.w - 2 || cy + 4 > horizonY - 3) continue;
            ctx.fillRect(cx, cy, 3, 4);
          }
        }
      } else {
        for (const tr of TREES) {
          const x = ((tr.x - cam * 0.5) % 4080 + 4080) % 4080 - 200;
          if (x < -30 || x > w + 30) continue;
          const s = tr.s * (compact ? 0.6 : 1);
          ctx.fillStyle = '#5A3B1E';
          ctx.fillRect(x - 2 * s, horizonY - 14 * s, 4 * s, 14 * s);
          ctx.fillStyle = tr.kind ? pal.near : pal.nearDetail;
          if (tr.kind) {
            ctx.beginPath();
            ctx.arc(x, horizonY - 22 * s, 12 * s, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.moveTo(x, horizonY - 40 * s);
            ctx.lineTo(x + 12 * s, horizonY - 12 * s);
            ctx.lineTo(x - 12 * s, horizonY - 12 * s);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      // Өвс (замын дээд тал)
      ctx.fillStyle = pal.grass;
      ctx.fillRect(-10, horizonY, w + 20, roadTop - horizonY + 2);
      ctx.fillStyle = pal.grassDark;
      for (let x = -((cam * 1) % 24) - 24; x < w + 24; x += 24) ctx.fillRect(x, roadTop - 5, 12, 2);

      // ── Үзэгчдийн индэр (барианы ард, дэлхийн координат) ──
      {
        const sx0 = finishX - 40 - cam;
        const standW = Math.min(420, w * 0.7);
        if (sx0 + standW > -10 && sx0 < w + 10) {
          const standH = compact ? 26 : Math.min(62, horizonY * 0.4);
          const top = roadTop - 4 - standH;
          ctx.fillStyle = C.ink700;
          ctx.fillRect(sx0, top, standW, standH + 4);
          // дээвэр
          ctx.fillStyle = C.danger;
          ctx.fillRect(sx0 - 6, top - 7, standW + 12, 7);
          ctx.fillStyle = C.mist50;
          for (let x = sx0 - 6; x < sx0 + standW + 6; x += 24) ctx.fillRect(x, top - 7, 12, 7);
          // эгнээ + үзэгчид
          const rows = compact ? 2 : 3;
          const rowH = standH / rows;
          const cols = Math.floor(standW / 11);
          const wave = celeb ? 1 : 0;
          for (let r = 0; r < rows; r++) {
            ctx.fillStyle = r % 2 ? C.ink600 : C.ink500;
            ctx.fillRect(sx0, top + r * rowH, standW, rowH);
            for (let c = 0; c < cols; c++) {
              const cr = CROWD[(r * 53 + c) % CROWD.length];
              const bob = wave ? Math.abs(Math.sin(t / 130 + cr.p)) * 4 : Math.sin(t / 600 + cr.p) * 0.8;
              const hx = sx0 + 5 + c * 11;
              const hy = top + r * rowH + rowH * 0.55 - bob;
              ctx.fillStyle = cr.c;
              ctx.beginPath();
              ctx.arc(hx, hy, compact ? 2.4 : 3.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          // туг
          for (const fx of [sx0 + 20, sx0 + standW - 20]) {
            ctx.strokeStyle = C.mist300;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(fx, top - 7);
            ctx.lineTo(fx, top - 32);
            ctx.stroke();
            const wv = Math.sin(t / 200 + fx) * 3;
            ctx.fillStyle = fx === sx0 + 20 ? C.brand : C.modifier;
            ctx.beginPath();
            ctx.moveTo(fx, top - 32);
            ctx.lineTo(fx + 20, top - 27 + wv);
            ctx.lineTo(fx, top - 20);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      // ── Зам ──
      ctx.fillStyle = pal.road;
      ctx.fillRect(-10, roadTop, w + 20, roadBottom - roadTop);
      // бага зэрэг гэрэлтэй зурвас (замын бүтэц)
      ctx.fillStyle = pal.roadLight;
      ctx.globalAlpha = 0.25;
      for (let i = 0; i < LANES; i++) ctx.fillRect(-10, roadTop + i * laneH + laneH * 0.3, w + 20, laneH * 0.4);
      ctx.globalAlpha = 1;
      // хашлага (дээд/доод) — улаан цагаан
      const curbH = compact ? 4 : 6;
      for (const cy of [roadTop - curbH, roadBottom]) {
        for (let x = -((cam % 40) + 40); x < w + 40; x += 40) {
          ctx.fillStyle = '#E63946';
          ctx.fillRect(x, cy, 20, curbH);
          ctx.fillStyle = C.mist50;
          ctx.fillRect(x + 20, cy, 20, curbH);
        }
      }
      // замын зураас (дэлхийд бэхлэгдсэн — камер хөдлөхөд гүйнэ)
      ctx.fillStyle = 'rgba(230,236,245,0.55)';
      const dashOn = 26;
      const dashPeriod = 50;
      for (let i = 1; i < LANES; i++) {
        const y = Math.round(roadTop + i * laneH) - 1;
        for (let x = -((cam % dashPeriod) + dashPeriod); x < w + dashPeriod; x += dashPeriod) ctx.fillRect(x, y, dashOn, 2);
      }
      // замын дугаар (зүүн ирмэгт) — зөвхөн өргөн дэлгэцэд
      if (!narrow) {
        ctx.font = `700 10px ${font}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < LANES; i++) {
          ctx.fillStyle = 'rgba(245,248,252,0.28)';
          ctx.fillText(String(i + 1), 8, roadTop + i * laneH + laneH / 2);
        }
      }

      // ── Гараа (дэлхийн координат) ──
      {
        const gx = START_X - cam;
        if (gx > -80 && gx < w + 80) {
          // гарааны шугам (шатар)
          const cell = compact ? 5 : 7;
          for (let r = 0; r < 2; r++) {
            for (let y = roadTop, k = 0; y < roadBottom; y += cell, k++) {
              ctx.fillStyle = (k + r) % 2 ? C.mist50 : C.ink950;
              ctx.fillRect(gx - 8 + r * cell, y, cell, Math.min(cell, roadBottom - y));
            }
          }
          // гарааны хайрцаг (зам бүрт)
          ctx.strokeStyle = 'rgba(245,248,252,0.35)';
          ctx.lineWidth = 1.5;
          for (let i = 0; i < LANES; i++) {
            const y = laneY(i);
            ctx.strokeRect(gx - carW * 0.55, y - carH - 4, carW * 1.1, carH + 8);
          }
          // гэрлийн багана
          const poleTop = roadTop - (compact ? 30 : 48);
          ctx.fillStyle = C.ink600;
          ctx.fillRect(gx - 2, poleTop, 4, roadTop - poleTop);
          const lightsW = compact ? 44 : 64;
          ctx.fillStyle = C.ink900;
          rr(ctx, gx - lightsW / 2, poleTop - (compact ? 14 : 18), lightsW, compact ? 14 : 18, 4);
          ctx.fill();
          const lit = count.step === 3 ? 1 : count.step === 2 ? 2 : count.step === 1 ? 3 : 0;
          const green = count.step === 'GO' || (p.running && count.step == null);
          const lr = compact ? 3.5 : 5;
          for (let k = 0; k < 3; k++) {
            const lx = gx - lightsW / 2 + lightsW * ((k + 0.5) / 3);
            const ly = poleTop - (compact ? 7 : 9);
            const on = green || k < lit;
            ctx.fillStyle = green ? C.success : on ? C.danger : C.ink700;
            if (on) {
              ctx.shadowColor = ctx.fillStyle;
              ctx.shadowBlur = 10;
            }
            ctx.beginPath();
            ctx.arc(lx, ly, lr, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          if (!compact) {
            ctx.font = `800 9px ${font}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = C.mist300;
            ctx.fillText('START', gx, poleTop - 26);
          }
        }
      }

      // ── Бариа (дэлхийн координат) ──
      {
        const fx = finishX - cam;
        if (fx > -200 && fx < w + 200) {
          const cell = compact ? 5 : 7;
          const stripW = cell * 2;
          for (let r = 0; r < 2; r++) {
            for (let y = roadTop, k = 0; y < roadBottom; y += cell, k++) {
              ctx.fillStyle = (k + r) % 2 ? C.mist50 : C.ink950;
              ctx.fillRect(fx - stripW / 2 + r * cell, y, cell, Math.min(cell, roadBottom - y));
            }
          }
          // хаалга: хоёр багана + шатар хүрээтэй самбар
          const bannerH = compact ? 16 : 24;
          const bannerW = compact ? 80 : 120;
          const bannerTop = roadTop - (compact ? 34 : 60);
          ctx.fillStyle = C.ink600;
          ctx.fillRect(fx - bannerW / 2, bannerTop, 4, roadTop - bannerTop);
          ctx.fillRect(fx + bannerW / 2 - 4, bannerTop, 4, roadTop - bannerTop);
          ctx.fillStyle = C.mist50;
          rr(ctx, fx - bannerW / 2 - 4, bannerTop, bannerW + 8, bannerH, 4);
          ctx.fill();
          ctx.fillStyle = C.ink950;
          for (let x = 0, k = 0; x < bannerW + 8; x += 5, k++) {
            if (k % 2 === 0) ctx.fillRect(fx - bannerW / 2 - 4 + x, bannerTop, 5, 4);
            else ctx.fillRect(fx - bannerW / 2 - 4 + x, bannerTop + bannerH - 4, 5, 4);
          }
          ctx.font = `800 ${compact ? 8 : 11}px ${font}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = C.ink950;
          ctx.fillText('FINISH', fx, bannerTop + bannerH / 2 + 0.5);
          // туг
          const flagX = fx - bannerW / 2 + 2;
          ctx.strokeStyle = C.mist300;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(flagX, bannerTop);
          ctx.lineTo(flagX, bannerTop - 30);
          ctx.stroke();
          const wave = Math.sin(t / 180) * 3;
          const fw = compact ? 16 : 24;
          const fh = compact ? 11 : 16;
          for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 3; c++) {
              ctx.fillStyle = (r + c) % 2 ? C.ink950 : C.mist50;
              const cx = flagX + (c * fw) / 3;
              const cy = bannerTop - 30 + (r * fh) / 2 + (c / 3) * wave;
              ctx.fillRect(cx, cy, fw / 3 + 0.5, fh / 2 + 0.5);
            }
          }
        }
      }

      // ── Утаа ──
      const puffs = puffsRef.current;
      for (let i = puffs.length - 1; i >= 0; i--) {
        const q = puffs[i];
        q.life += dt;
        if (q.life < 0) continue;
        if (q.life >= q.max) {
          puffs.splice(i, 1);
          continue;
        }
        q.x += q.vx * dt;
        q.y += q.vy * dt;
        q.vx *= 1 - 1.5 * dt;
        const k = q.life / q.max;
        const r = q.size * (0.35 + k * 0.9) * 0.5;
        const g = ctx.createRadialGradient(q.x - cam, q.y, 0, q.x - cam, q.y, r);
        g.addColorStop(0, `rgba(236,240,248,${(0.8 * (1 - k)).toFixed(3)})`);
        g.addColorStop(0.5, `rgba(170,180,200,${(0.45 * (1 - k)).toFixed(3)})`);
        g.addColorStop(1, 'rgba(120,130,150,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(q.x - cam, q.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Машинууд ──
      // Тоглогчийн машиныг хамгийн сүүлд (дээр нь) зурна
      const order = Array.from({ length: LANES }, (_, i) => i).sort((a, b) => Number(a === p.playerLane) - Number(b === p.playerLane));
      ctx.textBaseline = 'middle';
      for (const lane of order) {
        const car = RACE_CARS[lane];
        const info = p.lanes[lane];
        const x = carX(lane) - cam;
        const y = laneY(lane);
        const boostK = Math.max(0, 1 - (t - boostAtRef.current[lane]) / BOOST_MS);
        const isPlayer = lane === p.playerLane;
        const stalled = isPlayer && timeUpAge >= 0;
        if (x < -carW || x > w + carW) continue;
        const bob = p.running && !info?.dim && !stalled ? Math.sin(t / 45 + lane * 1.7) * 0.6 : Math.sin(t / 500 + lane) * 0.4;
        drawCar(ctx, x, y + bob, carScale, car.color, car.dark, t, wheelRef.current[lane], boostK, !!info?.dim, pal.night && !info?.dim);
        // цаг дууссан — машин зогсоод хар утаа
        if (stalled && Math.random() < 0.25) {
          puffsRef.current.push({
            x: carX(lane) + carW * 0.3,
            y: y - carH * 0.8,
            vx: -10 + Math.random() * 10,
            vy: -25 - Math.random() * 20,
            size: 10 + Math.random() * 8,
            life: 0,
            max: 1.1,
          });
        }
        // нэрийн пайз
        if (info && (info.name || info.tag) && !info.dim) {
          const fs = compact ? 9 : 10;
          ctx.font = `700 ${fs}px ${font}`;
          const name = fitText(ctx, isPlayer ? `${info.name} (та)` : info.name, compact ? 70 : 110);
          const sub = !compact && info.sub ? ` · ${info.sub}` : '';
          ctx.font = `600 ${fs}px ${font}`;
          const subW = sub ? ctx.measureText(sub).width : 0;
          ctx.font = `700 ${fs}px ${font}`;
          const nameW = ctx.measureText(name).width;
          const pw = nameW + subW + 12;
          const ph = fs + 7;
          // Зам намхан бол пайзыг машины ард (зүүн талд) — дээрх замын машинтай давхцахгүй
          const beside = laneH < 48;
          const px = beside ? x - carW * 0.5 - 8 - pw : x - pw / 2;
          const py = beside ? y - carH * 0.5 - ph / 2 : y - carH - 14 - ph;
          ctx.fillStyle = isPlayer ? 'rgba(79,140,255,0.92)' : 'rgba(7,10,18,0.72)';
          rr(ctx, px, py, pw, ph, 5);
          ctx.fill();
          // жижиг сум (пайзнаас машин руу)
          ctx.beginPath();
          if (beside) {
            ctx.moveTo(px + pw, y - carH * 0.5 - 3);
            ctx.lineTo(px + pw, y - carH * 0.5 + 3);
            ctx.lineTo(px + pw + 3, y - carH * 0.5);
          } else {
            ctx.moveTo(x - 3, py + ph);
            ctx.lineTo(x + 3, py + ph);
            ctx.lineTo(x, py + ph + 3);
          }
          ctx.closePath();
          ctx.fill();
          ctx.textAlign = 'left';
          ctx.fillStyle = C.mist50;
          ctx.fillText(name, px + 6, py + ph / 2 + 0.5);
          if (sub) {
            ctx.font = `600 ${fs}px ${font}`;
            ctx.fillStyle = isPlayer ? 'rgba(245,248,252,0.8)' : C.mist400;
            ctx.fillText(sub, px + 6 + nameW, py + ph / 2 + 0.5);
          }
        }
        // бариа хүрсэн тэмдэг
        if (finishedRef.current[lane] || (progRef.current[lane] >= 1 && !info?.dim)) {
          ctx.font = `800 ${compact ? 10 : 12}px ${font}`;
          ctx.textAlign = 'center';
          ctx.fillStyle = C.success;
          ctx.fillText('✓', x + carW * 0.5 + 8, y - carH * 0.5);
        }
      }

      // ── Дэлгэцээс гадуурх машинууд: ирмэг дээрх сум ──
      for (let lane = 0; lane < LANES; lane++) {
        const info = p.lanes[lane];
        if (info?.dim) continue;
        const x = carX(lane) - cam;
        const y = laneY(lane) - carH * 0.5;
        const left = x < -carW * 0.5;
        const right = x > w + carW * 0.5;
        if (!left && !right) continue;
        const car = RACE_CARS[lane];
        const ax = left ? 14 : w - 14;
        const dir = left ? -1 : 1;
        ctx.fillStyle = car.color;
        ctx.beginPath();
        ctx.moveTo(ax + dir * 7, y);
        ctx.lineTo(ax - dir * 4, y - 6);
        ctx.lineTo(ax - dir * 4, y + 6);
        ctx.closePath();
        ctx.fill();
        if (!compact && info?.name) {
          ctx.font = `700 9px ${font}`;
          ctx.textAlign = left ? 'left' : 'right';
          ctx.fillStyle = 'rgba(245,248,252,0.85)';
          ctx.fillText(fitText(ctx, info.name, 70), ax - dir * 9, y);
        }
      }

      // ── Хурдны зураас (тоглогчийн нитро) ──
      const sl = speedLinesRef.current;
      for (let i = sl.length - 1; i >= 0; i--) {
        const line = sl[i];
        const age = t - line.start;
        if (age < 0) continue;
        if (age > 380) {
          sl.splice(i, 1);
          continue;
        }
        const k = age / 380;
        ctx.globalAlpha = 0.55 * (1 - k);
        ctx.strokeStyle = C.mist50;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const x = line.x - k * 420;
        ctx.moveTo(x, line.y);
        ctx.lineTo(x + line.len, line.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // ── Баяр: конфетти + салют ──
      if (celeb) {
        const age = t - celeb.start;
        if (age < 60) {
          // барианы хаалганаас конфетти
          for (let k = 0; k < (celeb.rank === 1 ? 80 : 45); k++) {
            particlesRef.current.push({
              x: finishX + (Math.random() - 0.5) * 160,
              y: roadTop - 40,
              vx: (Math.random() - 0.5) * 260,
              vy: -120 - Math.random() * 260,
              life: 0,
              max: 1.6 + Math.random() * 1.2,
              color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
              size: 2.5 + Math.random() * 3,
              g: 420,
              rot: Math.random() * Math.PI,
              vr: (Math.random() - 0.5) * 12,
              rect: true,
            });
          }
          celeb.start = t - 60; // нэг л удаа
        }
        if (celeb.rank === 1 && age < 4500 && t >= celeb.nextRocket) {
          celeb.nextRocket = t + 280 + Math.random() * 320;
          rocketsRef.current.push({
            x: cam + Math.random() * w,
            y: roadTop,
            vy: -(380 + Math.random() * 180),
            targetY: 20 + Math.random() * horizonY * 0.6,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          });
        }
      }
      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy * dt;
        r.vy += 600 * dt;
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
          const n = 40 + Math.floor(Math.random() * 30);
          const second = Math.random() < 0.5 ? CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] : r.color;
          for (let k = 0; k < n; k++) {
            const a = (Math.PI * 2 * k) / n + (Math.random() - 0.5) * 0.15;
            const sp = 50 + Math.random() * 170;
            particlesRef.current.push({
              x: r.x,
              y: r.y,
              vx: Math.cos(a) * sp,
              vy: Math.sin(a) * sp,
              life: 0,
              max: 0.8 + Math.random() * 0.7,
              color: k % 2 ? second : r.color,
              size: 1.4 + Math.random() * 1.6,
              g: 180,
              rot: 0,
              vr: 0,
              rect: false,
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
        q.vx *= 1 - 1.2 * dt;
        if (!q.rect) q.vy *= 1 - 0.9 * dt;
        else q.vy = Math.min(q.vy, 120);
        q.x += q.vx * dt;
        q.y += q.vy * dt;
        q.rot += q.vr * dt;
        const k = 1 - q.life / q.max;
        ctx.globalAlpha = Math.min(1, k * 1.5);
        ctx.fillStyle = q.color;
        if (q.rect) {
          ctx.save();
          ctx.translate(q.x - cam, q.y);
          ctx.rotate(q.rot);
          ctx.fillRect(-q.size, -q.size * 0.5, q.size * 2, q.size);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(q.x - cam, q.y, q.size * (0.6 + 0.4 * k), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      ctx.restore(); // чичрэлт

      // ── Vignette ──
      if (timeUpAge >= 0) {
        const a = Math.min(0.5, 0.2 + timeUpAge / 2500);
        const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.15, w / 2, h / 2, Math.max(w, h) * 0.75);
        vg.addColorStop(0, 'rgba(140,10,30,0)');
        vg.addColorStop(1, `rgba(140,10,30,${a.toFixed(3)})`);
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, w, h);
      } else if (hud.urgent && p.showHud) {
        const a = 0.22 + 0.12 * Math.sin(t / 110);
        const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.72);
        vg.addColorStop(0, 'rgba(255,70,90,0)');
        vg.addColorStop(1, `rgba(255,70,90,${a.toFixed(3)})`);
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, w, h);
      } else if (celeb && celeb.rank === 1) {
        const age = t - celeb.start;
        const a = Math.max(0, 0.22 - age / 3000);
        if (a > 0) {
          ctx.fillStyle = `rgba(255,209,102,${a.toFixed(3)})`;
          ctx.fillRect(0, 0, w, h);
        }
      }

      // ── Popup текст (дэлгэцийн координат: төв) ──
      const pops = popupsRef.current;
      for (let i = pops.length - 1; i >= 0; i--) {
        const pop = pops[i];
        const age = t - pop.start;
        if (age < 0) continue;
        const life = pop.big ? 2600 : 1600;
        if (age > life) {
          pops.splice(i, 1);
          continue;
        }
        const k = age / life;
        const size = pop.big ? (narrow ? 26 : 34) : narrow ? 15 : 18;
        ctx.font = `800 ${size}px ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3;
        const scale = k < 0.15 ? easeOutBack(k / 0.15) : 1;
        ctx.save();
        const cx = pop.screen ? w / 2 + pop.x : pop.x - cam;
        const cy = pop.screen ? h * 0.36 + pop.y - k * 30 : pop.y - k * 40;
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgba(7,10,18,0.75)';
        ctx.strokeText(pop.text, 0, 0);
        ctx.fillStyle = pop.color;
        ctx.fillText(pop.text, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      // ── Countdown 3-2-1-GO ──
      if (count.step != null) {
        const isGo = count.step === 'GO';
        if (!isGo) {
          ctx.fillStyle = 'rgba(7,10,18,0.42)';
          ctx.fillRect(0, 0, w, h);
        }
        const k = Math.min(1, countAge / COUNT_POP_MS);
        const scale = easeOutBack(k);
        let alpha = 1;
        if (isGo) alpha = countAge < GO_MS * 0.55 ? 1 : 1 - (countAge - GO_MS * 0.55) / (GO_MS * 0.45);
        else if (countAge > 560) alpha = Math.max(0.35, 1 - (countAge - 560) / 500);
        ctx.save();
        ctx.translate(w / 2, h * 0.42);
        ctx.scale(scale, scale);
        ctx.globalAlpha = Math.max(0, alpha);
        const size = narrow ? (isGo ? 56 : 72) : isGo ? 84 : 104;
        ctx.font = `800 ${size}px ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 8;
        ctx.strokeStyle = 'rgba(7,10,18,0.8)';
        const txt = isGo ? 'GO!' : String(count.step);
        ctx.strokeText(txt, 0, 0);
        ctx.shadowColor = isGo ? C.success : C.mist50;
        ctx.shadowBlur = 24;
        ctx.fillStyle = isGo ? C.success : C.mist50;
        ctx.fillText(txt, 0, 0);
        ctx.shadowBlur = 0;
        if (!isGo) {
          ctx.font = `700 ${narrow ? 11 : 13}px ${font}`;
          ctx.fillStyle = C.mist300;
          ctx.fillText('Бэлэн үү… GO гэмэгц бич', 0, size * 0.62);
        }
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      // ── HUD ──
      if (p.showHud) {
        const urgent = hud.urgent && timeUpAge < 0;
        const ended = timeUpAge >= 0 || celeb != null;
        // цаг (зүүн дээд)
        const hudW = narrow ? 118 : 150;
        const hudH = narrow ? 42 : 50;
        ctx.fillStyle = 'rgba(7,10,18,0.72)';
        rr(ctx, 12, 12, hudW, hudH, 12);
        ctx.fill();
        ctx.strokeStyle = timeUpAge >= 0 ? C.danger : urgent ? C.danger : celeb ? C.success : C.ink600;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        const pulse = urgent ? 1 + 0.07 * Math.abs(Math.sin(t / 120)) : 1;
        ctx.save();
        ctx.translate(12 + hudW * 0.36, 12 + hudH / 2);
        ctx.scale(pulse, pulse);
        ctx.font = `800 ${narrow ? 19 : 24}px ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const timerColor = timeUpAge >= 0 ? C.danger : urgent ? C.danger : celeb ? C.success : C.mist50;
        ctx.shadowColor = timerColor;
        ctx.shadowBlur = urgent ? 16 : 6;
        ctx.fillStyle = timerColor;
        ctx.fillText(hud.timerText, 0, 1);
        ctx.shadowBlur = 0;
        ctx.restore();
        ctx.font = `600 9px ${font}`;
        ctx.textAlign = 'left';
        ctx.fillStyle = C.mist300;
        const label = timeUpAge >= 0 ? 'ДУУСЛАА' : celeb ? 'БАРИА!' : urgent ? 'ЯАРААРАЙ!' : hud.timerLabel;
        const lx = 12 + hudW * 0.7;
        ctx.fillText(label, lx, hud.fraction != null ? 12 + hudH * 0.32 : 12 + hudH / 2);
        if (hud.fraction != null) {
          const bw = hudW - (lx - 12) - 10;
          ctx.fillStyle = 'rgba(255,255,255,0.08)';
          rr(ctx, lx, 12 + hudH * 0.58, bw, 7, 3.5);
          ctx.fill();
          ctx.fillStyle = urgent || timeUpAge >= 0 ? C.danger : C.brand;
          rr(ctx, lx, 12 + hudH * 0.58, bw * clamp01(hud.fraction), 7, 3.5);
          ctx.fill();
        }

        // түвшин + байр / WPM + нарийвчлал (баруун дээд)
        let position = hud.position;
        if (position == null && p.playerLane != null) {
          const mine = progRef.current[p.playerLane];
          let ahead = 0;
          for (let i = 0; i < LANES; i++) {
            if (i === p.playerLane || p.lanes[i]?.dim) continue;
            if (progRef.current[i] > mine + 1e-6) ahead++;
          }
          position = 1 + ahead;
        }
        const racers = p.lanes.filter((l) => l && !l.dim).length || LANES;
        ctx.font = `700 ${narrow ? 11 : 12}px ${font}`;
        ctx.textAlign = 'right';
        const line1 = position != null ? `${position} / ${racers}` : '';
        const lvl = hud.levelLabel;
        const line2 = `${hud.wpm} WPM · ${hud.accuracy}%`;
        const posW = line1 ? ctx.measureText(line1).width : 0;
        const lvlW = lvl ? ctx.measureText(lvl).width + 8 : 0;
        const boxW = Math.max(posW + lvlW, ctx.measureText(line2).width) + 22;
        ctx.fillStyle = 'rgba(7,10,18,0.72)';
        rr(ctx, w - 12 - boxW, 12, boxW, hudH, 12);
        ctx.fill();
        ctx.strokeStyle = position === 1 && !ended ? C.modifier : C.ink600;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        const y1 = 12 + hudH * 0.3;
        const y2 = 12 + hudH * 0.7;
        if (line1) {
          ctx.fillStyle = position === 1 ? C.modifier : position === 2 ? C.mist300 : position === 3 ? C.verb : C.mist50;
          ctx.fillText(line1, w - 23, y1);
        }
        if (lvl) {
          ctx.fillStyle = C.brand;
          ctx.fillText(lvl, w - 23 - posW - (line1 ? 8 : 0), y1);
        }
        ctx.fillStyle = C.mist50;
        ctx.fillText(line2, w - 23, y2);

        // мини-зураг: бүх машины байрлал (өргөн дэлгэцэд)
        if (!narrow) {
          const mmW = Math.min(260, w - hudW - boxW - 80);
          if (mmW > 100) {
            const mx = w / 2 - mmW / 2;
            const my = 20;
            ctx.fillStyle = 'rgba(7,10,18,0.55)';
            rr(ctx, mx - 10, my - 8, mmW + 20, 22, 11);
            ctx.fill();
            ctx.fillStyle = 'rgba(245,248,252,0.25)';
            ctx.fillRect(mx, my + 2, mmW, 2);
            ctx.fillStyle = C.mist50;
            ctx.fillRect(mx + mmW - 1, my - 3, 2, 12);
            for (let i = 0; i < LANES; i++) {
              if (p.lanes[i]?.dim) continue;
              const dx = mx + progRef.current[i] * mmW;
              const isPl = i === p.playerLane;
              ctx.fillStyle = RACE_CARS[i].color;
              ctx.beginPath();
              ctx.arc(dx, my + 3, isPl ? 4.5 : 3, 0, Math.PI * 2);
              ctx.fill();
              if (isPl) {
                ctx.strokeStyle = C.mist50;
                ctx.lineWidth = 1.5;
                ctx.stroke();
              }
            }
          }
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
});

/** Машины жижиг дүрс (сонголтын карт, lobby) — ижил drawCar-аар нэг удаа зурна. */
export function CarIcon({ color, dark, width = 72, className = '' }: { color: string; dark: string; width?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const height = Math.round(width * 0.5);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    drawCar(ctx, width / 2, height * 0.92, width / 112, color, dark, 0, 0.6, 0, false, false);
  }, [color, dark, width, height]);
  return <canvas ref={ref} className={className} style={{ width, height }} aria-hidden="true" />;
}
