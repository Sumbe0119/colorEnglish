// frontend/src/components/draw-guess/studio-scene.tsx
// "Зураг таах" тоглоомын 2D дүрслэл — шөнийн урлагийн студи, canvas дээр rAF-аар зурна. Эцэг элементээ бүтнээр дүүргэнэ.
// Хана, цонх (од, сар), тавиур, модон шал, том easel (зурах самбар DOM-оор дээр нь давхарлагдана),
// тоглогч бүр өөрийн өнгөтэй робот: зурж буй хүн easel-ийн доор бийртэй зогсоно, бусад нь ширээний ард сууна.
// Зөв таасан хүнд ногоон ✓ бөмбөлөг + баяр, эзэнд титэм, салсан хүн бүдгэрнэ.
// HUD (цаг, тойрог/ээлж, өрөөний код, холболт), үгийн зурвас (далдалсан үсгүүд / өөрийн үг / илчлэлт),
// оноо popup, конфетти, салют, дэлгэц чичрэлт, vignette; тоглоом дуусахад подиум + салют.
// React re-render-ээс хамаарахгүй: props-ийг ref-д хадгалаад кадр бүрт шууд уншина.
'use client';

import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import type { RoomStatus, WordEntry } from '@/lib/draw-guess-socket';
import { sfx } from '@/lib/draw-guess-sfx';

export type Conn = 'connecting' | 'online' | 'offline';

export type ScenePlayer = {
  userId: string;
  name: string;
  score: number;
  turnPoints: number;
  isHost: boolean;
  connected: boolean;
  guessed: boolean;
  /** Өнгөний индекс — өрөөнд орсон дараалал */
  colorIdx: number;
};

export type StudioSceneProps = {
  /** Өрөөнд орсон эсэх (false → хоосон студи, lobby давхарга) */
  inRoom: boolean;
  status: RoomStatus;
  players: ScenePlayer[];
  drawerUserId: string | null;
  meUserId: string;
  round: number;
  totalRounds: number;
  turn: number;
  totalTurns: number;
  /** Үлдсэн секунд (drawing: ээлжийн, choosing: сонголтын) */
  remainSec: number | null;
  /** Үлдсэн хугацааны хувь 1 → 0 */
  fraction: number;
  masked: string | null;
  /** Зурж буй хүний өөрийн үг (зөвхөн drawer-т ирнэ) */
  secret: WordEntry | null;
  revealed: WordEntry | null;
  nextHintIn: number | null;
  roomCode: string | null;
  conn: Conn;
  /** Самбар DOM элемент дүрслэл дээр давхарлагдсан эсэх — easel хүрээ зурна */
  hasBoard: boolean;
  /** Хэмжээ өөрчлөгдөх бүрт байрлалын тооцоог буцаана — DOM самбарыг easel дээр яг давхарлахад */
  onLayout?: (layout: SceneLayout) => void;
};

export type Rect = { x: number; y: number; w: number; h: number };

export type SceneLayout = {
  /** Зурах самбарын байрлал (DOM элемент энд давхарлагдана) */
  board: Rect;
  hudH: number;
  /** Үгийн зурвасын дээд ирмэг, өндөр */
  wordY: number;
  wordH: number;
  /** Роботуудын хөлийн суурь */
  rowY: number;
  /** Шалны дээд ирмэг */
  floorY: number;
  /** Самбарын доорх роботуудад нөөцөлсөн өндөр */
  reserve: number;
  narrow: boolean;
};

/**
 * Дүрслэлийн хэмжээнээс самбар, HUD, роботуудын байрлалыг тооцно.
 * Scene болон DOM давхарга хоёулаа энэ функцийг хэрэглэнэ — самбар easel-тэйгээ яг давхцана.
 */
export function sceneLayout(w: number, h: number): SceneLayout {
  const narrow = w < 560;
  const hudH = narrow ? 44 : 52;
  const wordH = narrow ? 36 : 44;
  const reserve = Math.max(92, Math.min(124, h * 0.19));
  const top = hudH + wordH + 4;
  const pad = narrow ? 8 : 24;
  const maxW = w - pad * 2;
  const maxH = h - top - reserve - 4;
  const bw = Math.max(120, Math.min(maxW, (maxH * 4) / 3));
  const bh = (bw * 3) / 4;
  const x = Math.round((w - bw) / 2);
  const y = Math.round(top + Math.min(14, Math.max(0, (maxH - bh) / 2)));
  return {
    board: { x, y, w: Math.round(bw), h: Math.round(bh) },
    hudH,
    wordY: hudH,
    wordH,
    rowY: h - 10,
    floorY: Math.round(h - reserve * 0.6),
    reserve,
    narrow,
  };
}

const C = {
  brand: '#4F8CFF',
  brandHi: '#6BA0FF',
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

/** Тоглогчдын робот өнгө — өрөөнд орсон дарааллаар */
export const PLAYER_COLORS = [C.brand, C.verb, C.success, C.modifier, '#C58CFF', C.danger, '#7CF5FF', '#F5F8FC'];
const FIREWORK_COLORS = [C.brand, C.verb, C.success, C.modifier, C.danger, '#C58CFF', '#FFFFFF'];

type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number; g: number; rect?: boolean };
type Rocket = { x: number; y: number; vy: number; targetY: number; color: string };
type Popup = { text: string; userId: string | null; x: number; y: number; start: number; color: string; big?: boolean };
type BotPos = { x: number; y: number; vx: number };

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
const STARS = Array.from({ length: 26 }, () => ({ x: rnd(), y: rnd(), r: 0.5 + rnd() * 1.2, p: rnd() * Math.PI * 2, s: 1 + rnd() * 2 }));
const PLANKS = Array.from({ length: 60 }, () => rnd());

function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** HEX өнгийг цайруулна (0..1) */
function lighten(hex: string, k: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const f = (c: number) => Math.round(c + (255 - c) * k);
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
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

function truncate(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(`${s}…`).width > maxW) s = s.slice(0, -1);
  return `${s}…`;
}

type Mood = 'idle' | 'happy' | 'paint' | 'think';

type BotOpts = {
  color: string;
  mood: Mood;
  scale: number;
  alpha: number;
  crown: boolean;
  antenna: string;
  /** Бийрний үзүүрийн өнгө (paint горимд) */
  brushColor?: string;
  hop?: number;
};

/**
 * Робот тоглогч (sentence-builder-ийн drawHero-г өнгө, хэмжээ, бийртэй болгож өргөтгөв).
 * (x, y) = хөлийн суурь.
 */
function drawBot(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, o: BotOpts) {
  ctx.save();
  ctx.globalAlpha = o.alpha;
  ctx.translate(x, y - (o.hop ?? 0));
  const squash = o.hop ? 1 + o.hop / 140 : 1;
  ctx.scale(o.scale / squash, o.scale * squash);
  const bob = o.mood === 'happy' ? 0 : Math.sin(t / 420) * 1.4;
  ctx.translate(0, bob);
  const hi = lighten(o.color, 0.22);

  // хөл
  ctx.fillStyle = C.ink600;
  rr(ctx, -11, -9, 8, 9, 3);
  ctx.fill();
  rr(ctx, 3, -9, 8, 9, 3);
  ctx.fill();

  // бие
  const bodyY = -9 - 24;
  ctx.fillStyle = o.color;
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
  ctx.fillStyle = hi;
  if (o.mood === 'paint') {
    // зүүн гарт палитр
    rr(ctx, -23, bodyY + 2, 7, 15, 3.5);
    ctx.fill();
    ctx.save();
    ctx.translate(-26, bodyY + 4);
    ctx.rotate(-0.4);
    ctx.fillStyle = '#C9A36B';
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();
    [C.danger, C.brand, C.modifier, C.success].forEach((pc, i) => {
      ctx.fillStyle = pc;
      ctx.beginPath();
      ctx.arc(-5 + i * 3.4, (i % 2 ? 2 : -2), 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
    // баруун гар — дээш чиглэж бийрээр зурна
    const ang = -2.25 + Math.sin(t / 170) * 0.28;
    ctx.save();
    ctx.translate(18, bodyY + 6);
    ctx.rotate(ang);
    ctx.fillStyle = hi;
    rr(ctx, -3.5, -2, 7, 18, 3.5);
    ctx.fill();
    // бийр
    ctx.fillStyle = '#8A5A3C';
    rr(ctx, -1.5, 12, 3, 20, 1.5);
    ctx.fill();
    ctx.fillStyle = C.mist300;
    rr(ctx, -2, 31, 4, 4, 1);
    ctx.fill();
    ctx.fillStyle = o.brushColor ?? C.danger;
    ctx.beginPath();
    ctx.moveTo(-2.5, 35);
    ctx.lineTo(2.5, 35);
    ctx.lineTo(0, 42);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else {
    const armLift = o.mood === 'happy' ? -14 : o.mood === 'think' ? -6 : 0;
    const armSwing = o.mood === 'idle' ? Math.sin(t / 500) * 2 : 0;
    rr(ctx, -23, bodyY + 4 + armLift + armSwing, 7, 16, 3.5);
    ctx.fill();
    if (o.mood === 'think') {
      // баруун гар эрүү дээр
      ctx.save();
      ctx.translate(18, bodyY + 8);
      ctx.rotate(-1.9);
      rr(ctx, -3.5, -2, 7, 16, 3.5);
      ctx.fill();
      ctx.restore();
    } else {
      rr(ctx, 16, bodyY + 4 + armLift - armSwing, 7, 16, 3.5);
      ctx.fill();
    }
  }

  // толгой
  const headY = bodyY - 28;
  ctx.fillStyle = hi;
  rr(ctx, -17, headY, 34, 26, 9);
  ctx.fill();
  ctx.fillStyle = C.ink950;
  rr(ctx, -13, headY + 6, 26, 14, 5);
  ctx.fill();
  const eyeY = headY + 13;
  if (o.mood === 'happy') {
    ctx.strokeStyle = '#7CF5FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-6, eyeY + 1, 3, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(6, eyeY + 1, 3, Math.PI, 0);
    ctx.stroke();
  } else {
    const blink = Math.sin(t / 1900 + o.color.length) > 0.985 ? 0.25 : 1;
    const look = o.mood === 'paint' ? -1.5 : o.mood === 'think' ? 1.5 : 0;
    const lookY = o.mood === 'paint' ? -1.5 : o.mood === 'think' ? -1 : 0;
    ctx.fillStyle = '#7CF5FF';
    ctx.beginPath();
    ctx.ellipse(-6 + look, eyeY + lookY, 3, 3 * blink, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(6 + look, eyeY + lookY, 3, 3 * blink, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // антенн
  ctx.strokeStyle = C.ink500;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, headY);
  ctx.lineTo(0, headY - 11);
  ctx.stroke();
  ctx.shadowColor = o.antenna;
  ctx.shadowBlur = 10;
  ctx.fillStyle = o.antenna;
  ctx.beginPath();
  ctx.arc(0, headY - 13, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // титэм (эзэн)
  if (o.crown) {
    ctx.fillStyle = C.modifier;
    ctx.beginPath();
    ctx.moveTo(-11, headY + 1);
    ctx.lineTo(-11, headY - 7);
    ctx.lineTo(-6, headY - 3);
    ctx.lineTo(-2.5, headY - 9);
    ctx.lineTo(2.5, headY - 9);
    ctx.lineTo(6, headY - 3);
    ctx.lineTo(11, headY - 7);
    ctx.lineTo(11, headY + 1);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = C.danger;
    ctx.beginPath();
    ctx.arc(0, headY - 3, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/** Роботын толгойн дээд ирмэг (scale-тэй) — хөлийн сууриас дээш */
const BOT_H = 9 + 24 + 28 + 13;

function wrapLine(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  return truncate(ctx, text, maxW);
}

export function StudioScene(props: StudioSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  const posRef = useRef<Map<string, BotPos>>(new Map());
  const guessedAtRef = useRef<Map<string, number>>(new Map());
  const particlesRef = useRef<Particle[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const popupsRef = useRef<Popup[]>([]);
  const shakeRef = useRef<{ amp: number; start: number }>({ amp: 0, start: 0 });
  const fontRef = useRef('ui-monospace, monospace');
  const statusAtRef = useRef<{ status: RoomStatus; start: number }>({ status: props.status, start: 0 });
  const finishedUntilRef = useRef(0);
  const nextRocketRef = useRef(0);
  const hintFlashRef = useRef(0);
  const prevPlayersRef = useRef<Map<string, ScenePlayer>>(new Map());
  const prevMaskedRef = useRef<{ letters: number; status: RoomStatus }>({ letters: 0, status: props.status });
  const prevSecRef = useRef<number | null>(null);
  const prevStatusRef = useRef<RoomStatus>(props.status);
  const prevInRoomRef = useRef(props.inRoom);

  // ── Төлөвийн өөрчлөлт → дуу, popup, салют ──
  useEffect(() => {
    const now = performance.now();
    const p = props;
    if (!p.inRoom || !prevInRoomRef.current) {
      // Өрөөнөөс гарсан / анх орсон — бүх анимацийн төлөв цэвэрлэнэ
      if (p.inRoom !== prevInRoomRef.current) {
        posRef.current.clear();
        guessedAtRef.current.clear();
        popupsRef.current = [];
        particlesRef.current = [];
        rocketsRef.current = [];
        prevPlayersRef.current = new Map(p.players.map((pl) => [pl.userId, pl]));
        prevStatusRef.current = p.status;
        statusAtRef.current = { status: p.status, start: now };
      }
      prevInRoomRef.current = p.inRoom;
      if (!p.inRoom) return;
    }
    if (p.status !== prevStatusRef.current) {
      prevStatusRef.current = p.status;
      statusAtRef.current = { status: p.status, start: now };
      if (p.status === 'drawing') sfx.turnStart();
      else if (p.status === 'choosing') {
        guessedAtRef.current.clear();
        sfx.choose();
      } else if (p.status === 'reveal') {
        sfx.reveal();
        shakeRef.current = { amp: 3, start: now + 600 };
      } else if (p.status === 'finished') {
        sfx.fanfare();
        finishedUntilRef.current = now + 6500;
        nextRocketRef.current = now + 300;
        guessedAtRef.current.clear();
        const top = [...p.players].sort((a, b) => b.score - a.score)[0];
        if (top) popupsRef.current.push({ text: 'ЯЛАГЧ!', userId: top.userId, x: 0, y: -40, start: now + 900, color: C.modifier, big: true });
      } else if (p.status === 'lobby') {
        guessedAtRef.current.clear();
      }
    }
    // Тоглогчдын өөрчлөлт: зөв таасан → ✓ + popup + конфетти; зурсан хүний оноо нэмэгдэх → popup
    const prev = prevPlayersRef.current;
    for (const pl of p.players) {
      const old = prev.get(pl.userId);
      if (pl.guessed && !(old?.guessed) && p.status === 'drawing') {
        guessedAtRef.current.set(pl.userId, now);
        popupsRef.current.push({ text: `+${pl.turnPoints}`, userId: pl.userId, x: 0, y: -30, start: now, color: C.success });
        if (pl.userId !== p.meUserId) sfx.otherCorrect();
        const pos = posRef.current.get(pl.userId);
        if (pos) burstConfetti(particlesRef.current, pos.x, pos.y - 60);
      }
      if (old && pl.userId === p.drawerUserId && pl.turnPoints > old.turnPoints && p.status === 'drawing') {
        popupsRef.current.push({ text: `+${pl.turnPoints - old.turnPoints}`, userId: pl.userId, x: 0, y: -30, start: now + 150, color: C.brand });
      }
    }
    prevPlayersRef.current = new Map(p.players.map((pl) => [pl.userId, pl]));

    // Тип нээгдэх: далдалсан үгэнд нээлттэй үсэг нэмэгдвэл
    const letters = p.masked ? [...p.masked].filter((ch) => ch !== '_' && ch !== ' ').length : 0;
    const pm = prevMaskedRef.current;
    if (p.status === 'drawing' && pm.status === 'drawing' && letters > pm.letters) {
      sfx.hint();
      hintFlashRef.current = now;
    }
    prevMaskedRef.current = { letters, status: p.status };

    // Сүүлийн 10 секундийн тик
    if (p.status === 'drawing' && p.remainSec != null && p.remainSec !== prevSecRef.current && p.remainSec <= 10 && p.remainSec > 0) sfx.tick();
    prevSecRef.current = p.remainSec;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    fontRef.current = getComputedStyle(canvas).fontFamily || fontRef.current;

    let w = 0;
    let h = 0;
    let rawW = -1;
    let rawH = -1;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    /** sync=true: DOM самбар яг энэ кадрт easel-тэй хамт шинэчлэгдэнэ (effect дотроос дуудахад async) */
    const resize = (sync: boolean) => {
      rawW = wrap.clientWidth;
      rawH = wrap.clientHeight;
      w = Math.max(280, rawW);
      h = Math.max(300, rawH);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const onLayout = propsRef.current.onLayout;
      if (!onLayout) return;
      const L = sceneLayout(w, h);
      if (sync) flushSync(() => onLayout(L));
      else onLayout(L);
    };
    resize(false);
    const ro = new ResizeObserver(() => resize(true));
    ro.observe(wrap);

    let raf = 0;
    let last = 0;
    let lastBoom = 0;
    let brushTick = 0;

    const draw = () => {
      // ResizeObserver зарим үед хоцордог (давхаргын CSS дараа ачаалагдах г.м.) — кадр бүрт хэмжээг баталгаажуулна
      if (wrap.clientWidth !== rawW || wrap.clientHeight !== rawH) resize(true);
      const t = performance.now();
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      const p = propsRef.current;
      const L = sceneLayout(w, h);
      const font = fontRef.current;
      const drawing = p.status === 'drawing' && p.inRoom;
      const urgent = drawing && p.remainSec != null && p.remainSec <= 10;
      const finished = p.status === 'finished' && p.inRoom;
      const statusAge = t - statusAtRef.current.start;
      const timerColor = !drawing ? C.brand : p.fraction > 0.5 ? C.success : p.fraction > 0.25 ? C.modifier : C.danger;

      // ── Роботуудын зорилтот байрлал (өрөөгүй үед демо робот) ──
      const players = p.players;
      const drawer = p.inRoom && (p.status === 'drawing' || p.status === 'choosing' || p.status === 'reveal') ? p.drawerUserId : null;
      const targets = new Map<string, { x: number; y: number; slot: number }>();
      const ranked = [...players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
      const podiumW = L.narrow ? 52 : 72;
      const podiumH = [Math.min(70, L.reserve * 0.5), Math.min(50, L.reserve * 0.36), Math.min(34, L.reserve * 0.25)];
      const podiumX = [w / 2, w / 2 - podiumW - 4, w / 2 + podiumW + 4];
      const podiumRise = finished ? easeOutBack(clamp(statusAge / 900, 0, 1)) : 0;
      let slotW = w;
      if (finished) {
        const rest = ranked.slice(3);
        const half = Math.ceil(rest.length / 2);
        const leftW = w / 2 - podiumW * 1.5 - 24;
        slotW = rest.length ? Math.min(90, leftW / Math.max(1, half)) : 90;
        ranked.forEach((pl, i) => {
          if (i < 3) targets.set(pl.userId, { x: podiumX[i], y: L.rowY - podiumH[i] * podiumRise, slot: 90 });
          else {
            const k = i - 3;
            const side = k < half ? -1 : 1;
            const j = side < 0 ? k : k - half;
            const n = side < 0 ? half : rest.length - half;
            const span = leftW;
            const start = side < 0 ? 12 : w - 12 - span;
            targets.set(pl.userId, { x: start + (span / n) * (j + 0.5), y: L.rowY, slot: slotW });
          }
        });
      } else if (drawer) {
        const others = players.filter((pl) => pl.userId !== drawer);
        const half = Math.ceil(others.length / 2);
        const gap = L.narrow ? 46 : 60;
        const sideW = w / 2 - gap - 10;
        slotW = others.length ? Math.min(110, sideW / Math.max(1, half)) : 110;
        others.forEach((pl, k) => {
          const side = k < half ? -1 : 1;
          const j = side < 0 ? k : k - half;
          const n = side < 0 ? half : others.length - half;
          const start = side < 0 ? 10 : w / 2 + gap;
          targets.set(pl.userId, { x: start + (sideW / n) * (j + 0.5), y: L.rowY, slot: sideW / n });
        });
        targets.set(drawer, { x: w / 2, y: L.rowY - 8, slot: gap * 2 });
      } else {
        const n = Math.max(1, players.length);
        slotW = Math.min(120, (w - 24) / n);
        const total = slotW * n;
        players.forEach((pl, i) => targets.set(pl.userId, { x: w / 2 - total / 2 + slotW * (i + 0.5), y: L.rowY, slot: slotW }));
      }
      const botScale = clamp(Math.min(L.reserve / 128, slotW / 72), 0.55, 0.95);

      // байрлал руу зөөлөн шилжинэ (анхны бүрэлдэхүүн шууд байрандаа; дараа нэгдсэн тоглогч хажуугаас орж ирнэ)
      const spawnInPlace = posRef.current.size === 0;
      for (const [id, tg] of targets) {
        let pos = posRef.current.get(id);
        if (!pos) {
          pos = { x: spawnInPlace ? tg.x : tg.x < w / 2 ? -40 : w + 40, y: tg.y, vx: 0 };
          posRef.current.set(id, pos);
        }
        const k = Math.min(1, dt * 5);
        pos.vx = (tg.x - pos.x) * k;
        pos.x += pos.vx;
        // y нь зөвхөн layout-аас хамаарна (подиумын өндөр нь зорилтод аль хэдийн анимацитай) — шууд байрлуулна
        pos.y = tg.y;
      }
      for (const id of [...posRef.current.keys()]) if (!targets.has(id)) posRef.current.delete(id);

      // ── Салют (тоглоом дуусахад) ──
      if (finished && t < finishedUntilRef.current && t >= nextRocketRef.current) {
        nextRocketRef.current = t + 280 + Math.random() * 320;
        rocketsRef.current.push({
          x: w * 0.15 + Math.random() * w * 0.7,
          y: h + 6,
          vy: -(Math.max(380, h * 0.9) + Math.random() * 160),
          targetY: 40 + Math.random() * h * 0.35,
          color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
        });
      }

      // ── Чичрэлт ──
      let sx = 0;
      let sy = 0;
      const sh = shakeRef.current;
      const shAge = t - sh.start;
      if (sh.amp > 0 && shAge >= 0 && shAge < 420) {
        const k = 1 - shAge / 420;
        sx = (Math.random() - 0.5) * 2 * sh.amp * k;
        sy = (Math.random() - 0.5) * 2 * sh.amp * k;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(sx, sy);

      // ── Хана ──
      const wall = ctx.createLinearGradient(0, 0, 0, L.floorY);
      wall.addColorStop(0, '#080C18');
      wall.addColorStop(1, '#131B30');
      ctx.fillStyle = wall;
      ctx.fillRect(-10, -10, w + 20, L.floorY + 10);
      // гэрэл: easel-ийн ард бүдэг прожектор
      const spot = ctx.createRadialGradient(w / 2, L.board.y + L.board.h * 0.4, 20, w / 2, L.board.y + L.board.h * 0.4, Math.max(w, h) * 0.6);
      spot.addColorStop(0, 'rgba(79,140,255,0.16)');
      spot.addColorStop(1, 'rgba(79,140,255,0)');
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, w, L.floorY);
      // хананы хавтангийн шугам
      ctx.strokeStyle = 'rgba(255,255,255,0.035)';
      ctx.lineWidth = 1;
      for (let y = L.hudH + 20; y < L.floorY; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Цонх (баруун дээд) — шөнийн тэнгэр, од, сар (нарийн дэлгэцэд үгийн зурвастай давхцах тул зурахгүй)
      if (!L.narrow) {
        const ww = L.narrow ? 84 : 120;
        const wh = L.narrow ? 70 : 96;
        const wx = w - ww - (L.narrow ? 10 : 22);
        const wy = L.hudH + 6;
        ctx.save();
        rr(ctx, wx, wy, ww, wh, 8);
        ctx.clip();
        const sky = ctx.createLinearGradient(0, wy, 0, wy + wh);
        sky.addColorStop(0, '#05070F');
        sky.addColorStop(1, '#1A2A4A');
        ctx.fillStyle = sky;
        ctx.fillRect(wx, wy, ww, wh);
        for (const s of STARS) {
          const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t / (380 * s.s) + s.p));
          ctx.globalAlpha = tw;
          ctx.fillStyle = '#E6ECF5';
          ctx.beginPath();
          ctx.arc(wx + s.x * ww, wy + s.y * wh, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowColor = 'rgba(255,241,200,0.55)';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#FFF1C8';
        ctx.beginPath();
        ctx.arc(wx + ww * 0.68, wy + wh * 0.36, L.narrow ? 10 : 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0B1327';
        ctx.beginPath();
        ctx.arc(wx + ww * 0.68 + 6, wy + wh * 0.36 - 5, L.narrow ? 8.5 : 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = C.ink500;
        ctx.lineWidth = 3;
        rr(ctx, wx, wy, ww, wh, 8);
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(wx + ww / 2, wy);
        ctx.lineTo(wx + ww / 2, wy + wh);
        ctx.moveTo(wx, wy + wh / 2);
        ctx.lineTo(wx + ww, wy + wh / 2);
        ctx.stroke();
      }

      // Тавиур (зүүн дээд) — будгийн лааз, бийр
      {
        const sxp = L.narrow ? 10 : 22;
        const sy0 = L.hudH + 46;
        const sw = L.narrow ? 76 : 110;
        ctx.fillStyle = C.ink700;
        rr(ctx, sxp, sy0, sw, 6, 2);
        ctx.fill();
        const cans = [C.danger, C.modifier, C.success, C.brand, '#C58CFF'];
        cans.slice(0, L.narrow ? 3 : 5).forEach((cc, i) => {
          const cx = sxp + 8 + i * (L.narrow ? 22 : 20);
          ctx.fillStyle = C.ink600;
          rr(ctx, cx, sy0 - 18, 14, 18, 2);
          ctx.fill();
          ctx.fillStyle = cc;
          rr(ctx, cx + 2, sy0 - 12, 10, 7, 1.5);
          ctx.fill();
        });
        // жааз
        const fy = L.hudH + 66;
        ctx.strokeStyle = '#8A5A3C';
        ctx.lineWidth = 3;
        ctx.strokeRect(sxp + 8, fy, 44, 34);
        ctx.fillStyle = '#1A2742';
        ctx.fillRect(sxp + 9.5, fy + 1.5, 41, 31);
        ctx.fillStyle = C.modifier;
        ctx.beginPath();
        ctx.arc(sxp + 22, fy + 12, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2E4B7A';
        ctx.beginPath();
        ctx.moveTo(sxp + 9.5, fy + 32.5);
        ctx.lineTo(sxp + 22, fy + 16);
        ctx.lineTo(sxp + 34, fy + 26);
        ctx.lineTo(sxp + 42, fy + 20);
        ctx.lineTo(sxp + 50.5, fy + 32.5);
        ctx.closePath();
        ctx.fill();
      }

      // ── Шал (модон банз) ──
      const floor = ctx.createLinearGradient(0, L.floorY, 0, h);
      floor.addColorStop(0, '#1C2238');
      floor.addColorStop(1, '#0E1322');
      ctx.fillStyle = floor;
      ctx.fillRect(-10, L.floorY, w + 20, h - L.floorY + 10);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let y = L.floorY + 10; y < h; y += 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      PLANKS.forEach((k, i) => {
        const y = L.floorY + 10 + (i % 5) * 12;
        const x = (k * w + i * 37) % w;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 12);
        ctx.stroke();
      });
      ctx.fillStyle = C.ink500;
      ctx.fillRect(-10, L.floorY, w + 20, 2);

      // ── Easel ──
      {
        const b = L.board;
        const show = !finished;
        if (show) {
          // хөл — ледж-ээс шал руу
          ctx.strokeStyle = '#4A3526';
          ctx.lineWidth = L.narrow ? 5 : 7;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(b.x + 24, b.y + b.h + 6);
          ctx.lineTo(b.x + 6, L.floorY + 14);
          ctx.moveTo(b.x + b.w - 24, b.y + b.h + 6);
          ctx.lineTo(b.x + b.w - 6, L.floorY + 14);
          ctx.stroke();
          ctx.lineCap = 'butt';
          // хүрээ
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 24;
          ctx.shadowOffsetY = 8;
          ctx.fillStyle = '#5B4030';
          rr(ctx, b.x - 9, b.y - 9, b.w + 18, b.h + 18, 10);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;
          ctx.strokeStyle = '#7A5A42';
          ctx.lineWidth = 2;
          rr(ctx, b.x - 9, b.y - 9, b.w + 18, b.h + 18, 10);
          ctx.stroke();
          // ледж
          ctx.fillStyle = '#4A3526';
          rr(ctx, b.x - 18, b.y + b.h + 4, b.w + 36, 10, 3);
          ctx.fill();
          ctx.fillStyle = '#6A4C38';
          rr(ctx, b.x - 18, b.y + b.h + 4, b.w + 36, 3, 2);
          ctx.fill();
          if (!p.hasBoard) {
            // хоосон цаас — lobby
            ctx.fillStyle = '#F5F2EA';
            ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.fillStyle = 'rgba(12,18,32,0.08)';
            ctx.font = `800 ${Math.max(18, Math.min(44, b.w / 9))}px ${font}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('ЗУРАГ ТААХ', b.x + b.w / 2, b.y + b.h / 2 - 10);
            ctx.strokeStyle = 'rgba(12,18,32,0.12)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(b.x + b.w / 2, b.y + b.h / 2 + 34, 14, 0.15 * Math.PI, 0.85 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(b.x + b.w / 2 - 7, b.y + b.h / 2 + 22, 2, 0, Math.PI * 2);
            ctx.arc(b.x + b.w / 2 + 7, b.y + b.h / 2 + 22, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(12,18,32,0.14)';
            ctx.fill();
          }
          // зурж буй үед хүрээ гэрэлтэнэ
          if (drawing) {
            ctx.strokeStyle = timerColor;
            ctx.lineWidth = 2;
            ctx.globalAlpha = urgent ? 0.55 + 0.35 * Math.abs(Math.sin(t / 110)) : 0.5;
            ctx.shadowColor = timerColor;
            ctx.shadowBlur = urgent ? 22 : 12;
            rr(ctx, b.x - 9, b.y - 9, b.w + 18, b.h + 18, 10);
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
          }
        }
      }

      // ── Подиум ──
      if (finished) {
        const labels = ['1', '2', '3'];
        const fills = ['#6B5A2C', '#3A4457', '#5A3E2E'];
        const strokes = [C.modifier, C.mist300, '#C97C4F'];
        [1, 2, 0].forEach((i) => {
          const ph = podiumH[i] * podiumRise;
          const px = podiumX[i] - podiumW / 2;
          ctx.fillStyle = fills[i];
          rr(ctx, px, L.rowY - ph, podiumW, ph + 4, 6);
          ctx.fill();
          ctx.strokeStyle = strokes[i];
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = strokes[i];
          ctx.font = `800 ${L.narrow ? 14 : 18}px ${font}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          if (ph > 18) ctx.fillText(labels[i], podiumX[i], L.rowY - ph / 2 + 2);
        });
      }

      // ── Роботууд ──
      const pillH = 18;
      const sorted = [...players].sort((a, b) => (a.userId === drawer ? 1 : 0) - (b.userId === drawer ? 1 : 0));
      let drawerPaintTarget: { x: number; y: number } | null = null;
      for (const pl of sorted) {
        const pos = posRef.current.get(pl.userId);
        const tg = targets.get(pl.userId);
        if (!pos || !tg) continue;
        const isDrawer = pl.userId === drawer;
        const color = PLAYER_COLORS[pl.colorIdx % PLAYER_COLORS.length];
        const scale = isDrawer ? Math.min(1, botScale + 0.05) : botScale;
        const rank = finished ? ranked.findIndex((r) => r.userId === pl.userId) : -1;
        let mood: Mood = 'idle';
        let hop = 0;
        if (isDrawer && p.status === 'drawing') mood = 'paint';
        else if (isDrawer && p.status === 'choosing') mood = 'think';
        const gAt = guessedAtRef.current.get(pl.userId);
        if (pl.guessed && gAt != null && !isDrawer) {
          mood = 'happy';
          const age = t - gAt;
          if (age < 1600) hop = Math.abs(Math.sin(age / 170)) * Math.max(0, 1 - age / 1600) * 22;
        }
        if (finished && rank >= 0 && rank < 3 && podiumRise > 0.9) {
          mood = 'happy';
          if (rank === 0) hop = Math.abs(Math.sin(t / 210)) * 16;
        }
        const alpha = pl.connected ? 1 : 0.32;
        const walking = Math.abs(pos.vx) > 0.25;
        const walkHop = walking ? Math.abs(Math.sin(t / 90)) * 4 : 0;

        // ширээ (таагчид) / сандал (зурагч)
        if (!finished) {
          if (isDrawer) {
            ctx.fillStyle = C.ink700;
            rr(ctx, pos.x - 18 * scale, L.rowY - 8, 36 * scale, 8, 3);
            ctx.fill();
            ctx.strokeStyle = C.ink500;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            // будгийн толбо шалан дээр
            ctx.globalAlpha = 0.5;
            [C.danger, C.brand, C.modifier].forEach((cc, i) => {
              ctx.fillStyle = cc;
              ctx.beginPath();
              ctx.ellipse(pos.x + (i - 1) * 22 * scale, L.rowY - 2 + (i % 2) * 3, 6, 2.5, 0, 0, Math.PI * 2);
              ctx.fill();
            });
            ctx.globalAlpha = 1;
          }
        }

        // сүүдэр
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y + 2, 16 * scale, 4 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        const jitter = isDrawer && urgent ? (Math.random() - 0.5) * 2 : 0;
        const antenna = isDrawer ? (p.status === 'drawing' ? timerColor : C.brand) : pl.guessed ? C.success : rgba(color, 0.9);
        const brushColor = PLAYER_COLORS[Math.floor(t / 900 + pl.colorIdx) % PLAYER_COLORS.length];
        drawBot(ctx, pos.x + jitter, pos.y - walkHop, t, { color, mood, scale, alpha, crown: pl.isHost, antenna, brushColor, hop });
        if (isDrawer && mood === 'paint') drawerPaintTarget = { x: pos.x, y: pos.y - BOT_H * scale };

        // ширээ — роботын урд (хөлийг халхална)
        if (!finished && !isDrawer) {
          const dw = Math.min(54, Math.max(34, tg.slot - 8));
          ctx.fillStyle = C.ink700;
          rr(ctx, pos.x - dw / 2, L.rowY - 18, dw, 16, 4);
          ctx.fill();
          ctx.strokeStyle = C.ink500;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = C.ink500;
          ctx.fillRect(pos.x - dw / 2 + 4, L.rowY - 2, 3, 2);
          ctx.fillRect(pos.x + dw / 2 - 7, L.rowY - 2, 3, 2);
          // цаас + харандаа
          ctx.fillStyle = '#F5F2EA';
          rr(ctx, pos.x - 8, L.rowY - 16, 12, 9, 1.5);
          ctx.fill();
          ctx.strokeStyle = C.modifier;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(pos.x + 6, L.rowY - 14);
          ctx.lineTo(pos.x + 13, L.rowY - 9);
          ctx.stroke();
        }

        // нэр + оноо pill (толгойн дээр)
        const headTop = pos.y - hop - walkHop - BOT_H * scale;
        const stagger = tg.slot < 58 && !isDrawer ? (players.indexOf(pl) % 2) * 14 : 0;
        const pillY = headTop - 8 - pillH - stagger;
        ctx.font = `700 10px ${font}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const maxName = Math.max(28, Math.min(tg.slot - 30, 90));
        const isMe = pl.userId === p.meUserId;
        const nameText = wrapLine(ctx, isMe ? 'Та' : pl.name, maxName);
        const scoreText = String(pl.score);
        const nw = ctx.measureText(nameText).width;
        const sw = ctx.measureText(scoreText).width;
        const pw = nw + sw + 20;
        const px = pos.x - pw / 2;
        ctx.globalAlpha = pl.connected ? 1 : 0.5;
        ctx.fillStyle = 'rgba(7,10,18,0.78)';
        rr(ctx, px, pillY, pw, pillH, 7);
        ctx.fill();
        ctx.strokeStyle = isMe ? C.mist50 : rgba(color, 0.7);
        ctx.lineWidth = isMe ? 1.5 : 1;
        ctx.stroke();
        ctx.fillStyle = isMe ? C.mist50 : C.mist300;
        ctx.fillText(nameText, px + 7, pillY + pillH / 2 + 0.5);
        ctx.fillStyle = C.modifier;
        ctx.fillText(scoreText, px + 7 + nw + 6, pillY + pillH / 2 + 0.5);
        ctx.globalAlpha = 1;
        // ээлжийн оноо (reveal)
        if (p.status === 'reveal' && pl.turnPoints > 0) {
          ctx.font = `800 11px ${font}`;
          ctx.textAlign = 'center';
          ctx.fillStyle = isDrawer ? C.brand : C.success;
          ctx.fillText(`+${pl.turnPoints}`, pos.x, pillY - 9);
        }

        // ✓ бөмбөлөг — зөв таасан
        if (pl.guessed && !isDrawer && p.status !== 'finished') {
          const age = gAt != null ? t - gAt : 9999;
          const k = age < 350 ? easeOutBack(age / 350) : 1;
          const bx = pos.x + 19 * scale;
          const by = headTop + 6;
          ctx.save();
          ctx.translate(bx, by);
          ctx.scale(k, k);
          ctx.fillStyle = C.success;
          ctx.shadowColor = C.success;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = C.ink950;
          ctx.lineWidth = 2.2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(-3.5, 0.5);
          ctx.lineTo(-1, 3);
          ctx.lineTo(4, -3);
          ctx.stroke();
          ctx.lineCap = 'butt';
          ctx.restore();
        }
        // салсан
        if (!pl.connected) {
          const bx = pos.x + 19 * scale;
          const by = headTop + 6;
          ctx.fillStyle = C.ink600;
          ctx.beginPath();
          ctx.arc(bx, by, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = C.danger;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(bx - 3, by - 3);
          ctx.lineTo(bx + 3, by + 3);
          ctx.moveTo(bx + 3, by - 3);
          ctx.lineTo(bx - 3, by + 3);
          ctx.stroke();
        }
        // «?» бодлын бөмбөлөг — үг сонгож байна
        if (isDrawer && p.status === 'choosing') {
          const bx = pos.x + 24 * scale;
          const by = headTop - 2 + Math.sin(t / 300) * 2;
          ctx.fillStyle = C.mist50;
          rr(ctx, bx - 9, by - 18, 20, 18, 7);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(bx - 8, by + 3, 2.2, 0, Math.PI * 2);
          ctx.arc(bx - 12, by + 7, 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = C.ink950;
          ctx.font = `800 13px ${font}`;
          ctx.textAlign = 'center';
          ctx.fillText('?', bx + 1, by - 8.5);
        }
      }

      // бийрний үзүүрээс будаг үсэрнэ (зурагч зурж байх үед, бага зэрэг)
      if (drawerPaintTarget && t - brushTick > 420) {
        brushTick = t;
        const tgt: { x: number; y: number } = drawerPaintTarget;
        for (let k = 0; k < 3; k++) {
          particlesRef.current.push({
            x: tgt.x + 20 + (Math.random() - 0.5) * 10,
            y: tgt.y - 10 + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 60,
            vy: -30 - Math.random() * 60,
            life: 0,
            max: 0.5 + Math.random() * 0.4,
            color: PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)],
            size: 1.2 + Math.random() * 1.4,
            g: 400,
          });
        }
      }

      // ── Пуужин / хэсгүүд ──
      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy * dt;
        r.vy += 700 * dt;
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x, r.y + 12);
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
        if (q.rect) {
          ctx.save();
          ctx.translate(q.x, q.y);
          ctx.rotate(q.life * 6 + q.size);
          ctx.fillRect(-q.size, -q.size * 0.6, q.size * 2, q.size * 1.2);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(q.x, q.y, q.size * (0.6 + 0.4 * k), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // ── Popup текст ──
      const pops = popupsRef.current;
      for (let i = pops.length - 1; i >= 0; i--) {
        const pop = pops[i];
        const age = t - pop.start;
        if (age < 0) continue;
        const life = pop.big ? 2600 : 1500;
        if (age > life) {
          pops.splice(i, 1);
          continue;
        }
        const k = age / life;
        let ox = pop.x;
        let oy = pop.y;
        if (pop.userId) {
          const pos = posRef.current.get(pop.userId);
          if (!pos) {
            pops.splice(i, 1);
            continue;
          }
          ox += pos.x;
          oy += pos.y - BOT_H * botScale - 24;
        }
        ctx.font = `800 ${pop.big ? (L.narrow ? 20 : 26) : 17}px ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3;
        const scale = k < 0.15 ? easeOutBack(k / 0.15) : 1;
        ctx.save();
        ctx.translate(ox, oy - k * 36);
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

      // ── Vignette: цаг багасах тусам ирмэг улайна ──
      if (drawing) {
        const a = 0.5 * Math.pow(1 - p.fraction, 2) + (urgent ? 0.1 + 0.08 * Math.sin(t / 110) : 0);
        const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.74);
        vg.addColorStop(0, 'rgba(255,70,90,0)');
        vg.addColorStop(1, `rgba(255,70,90,${a.toFixed(3)})`);
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, w, h);
      }

      // ── Үгийн зурвас ──
      {
        const cy = L.wordY + L.wordH / 2 + 1;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const meIsDrawer = p.drawerUserId === p.meUserId;
        const drawerName = players.find((pl) => pl.userId === p.drawerUserId)?.name ?? '…';
        if (!p.inRoom || p.status === 'lobby' || finished) {
          // студийн неон самбар
          const label = finished ? 'ТОГЛООМ ДУУСЛАА' : 'ЗУРАГ ТААХ';
          ctx.font = `800 ${L.narrow ? 15 : 19}px ${font}`;
          ctx.shadowColor = finished ? C.modifier : C.brand;
          ctx.shadowBlur = 16 + Math.sin(t / 600) * 4;
          ctx.fillStyle = finished ? C.modifier : C.brandHi;
          ctx.fillText(label, w / 2, cy);
          ctx.shadowBlur = 0;
        } else if (p.status === 'reveal' && p.revealed) {
          const age = Math.max(0, statusAge - 650);
          const k = age < 420 ? easeOutBack(Math.min(1, age / 420)) : 1;
          if (age > 0) {
            ctx.font = `800 ${L.narrow ? 15 : 19}px ${font}`;
            const wordText = p.revealed.word;
            ctx.font = `600 ${L.narrow ? 11 : 13}px ${font}`;
            const meaning = p.revealed.meaning ? wrapLine(ctx, `— ${p.revealed.meaning}`, Math.max(60, w * 0.5)) : '';
            const mw = meaning ? ctx.measureText(meaning).width : 0;
            ctx.font = `800 ${L.narrow ? 15 : 19}px ${font}`;
            const ww2 = ctx.measureText(wordText).width;
            ctx.font = `700 10px ${font}`;
            const lw = ctx.measureText('ҮГ:').width;
            const totalW = Math.min(w - 16, lw + 8 + ww2 + (mw ? 10 + mw : 0) + 32);
            ctx.save();
            ctx.translate(w / 2, cy);
            ctx.scale(k, k);
            ctx.fillStyle = 'rgba(7,10,18,0.85)';
            ctx.shadowColor = C.modifier;
            ctx.shadowBlur = 16;
            rr(ctx, -totalW / 2, -L.wordH / 2 + 3, totalW, L.wordH - 6, 12);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = C.modifier;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            let x = -totalW / 2 + 16;
            ctx.textAlign = 'left';
            ctx.font = `700 10px ${font}`;
            ctx.fillStyle = C.modifier;
            ctx.fillText('ҮГ:', x, 0.5);
            x += lw + 8;
            ctx.font = `800 ${L.narrow ? 15 : 19}px ${font}`;
            ctx.fillStyle = C.mist50;
            ctx.fillText(wordText, x, 0.5);
            x += ww2 + 10;
            if (meaning) {
              ctx.font = `600 ${L.narrow ? 11 : 13}px ${font}`;
              ctx.fillStyle = C.mist300;
              ctx.fillText(meaning, x, 1);
            }
            ctx.restore();
          }
        } else if (p.status === 'choosing') {
          ctx.font = `600 ${L.narrow ? 12 : 14}px ${font}`;
          ctx.fillStyle = C.mist300;
          const dots = '.'.repeat(1 + (Math.floor(t / 400) % 3));
          ctx.fillText(meIsDrawer ? 'Зурах үгээ сонго' : wrapLine(ctx, `${drawerName} үг сонгож байна${dots}`, w - 24), w / 2, cy);
        } else if (p.status === 'drawing' && meIsDrawer && p.secret) {
          ctx.font = `700 9px ${font}`;
          const lw = ctx.measureText('ТАНЫ ҮГ').width;
          ctx.font = `800 ${L.narrow ? 16 : 20}px ${font}`;
          const ww2 = ctx.measureText(p.secret.word).width;
          ctx.font = `600 ${L.narrow ? 11 : 12}px ${font}`;
          let meaning = p.secret.meaning ? `— ${p.secret.meaning}` : '';
          let mw = meaning ? ctx.measureText(meaning).width : 0;
          if (lw + ww2 + mw + 40 > w - 16) {
            meaning = wrapLine(ctx, meaning, Math.max(40, w - 56 - lw - ww2));
            mw = ctx.measureText(meaning).width;
          }
          const totalW = lw + 10 + ww2 + (mw ? 8 + mw : 0);
          let x = w / 2 - totalW / 2;
          ctx.textAlign = 'left';
          ctx.font = `700 9px ${font}`;
          ctx.fillStyle = C.brand;
          ctx.fillText('ТАНЫ ҮГ', x, cy + 1);
          x += lw + 10;
          ctx.font = `800 ${L.narrow ? 16 : 20}px ${font}`;
          ctx.fillStyle = C.mist50;
          ctx.shadowColor = C.brand;
          ctx.shadowBlur = 10;
          ctx.fillText(p.secret.word, x, cy + 1);
          ctx.shadowBlur = 0;
          x += ww2 + 8;
          if (meaning) {
            ctx.font = `600 ${L.narrow ? 11 : 12}px ${font}`;
            ctx.fillStyle = C.mist300;
            ctx.fillText(meaning, x, cy + 1.5);
          }
        } else if (p.status === 'drawing' && p.masked) {
          const chars = [...p.masked];
          const tw = L.narrow ? 15 : 19;
          const th = L.narrow ? 22 : 27;
          const gap = 3;
          const space = L.narrow ? 8 : 12;
          const totalW = chars.reduce((a, ch) => a + (ch === ' ' ? space : tw + gap), 0) - gap;
          let x = w / 2 - totalW / 2;
          const flash = t - hintFlashRef.current;
          ctx.font = `700 ${L.narrow ? 13 : 16}px ${font}`;
          for (const ch of chars) {
            if (ch === ' ') {
              x += space;
              continue;
            }
            const known = ch !== '_';
            if (known && flash < 600) {
              ctx.shadowColor = C.modifier;
              ctx.shadowBlur = 14 * (1 - flash / 600);
            }
            ctx.fillStyle = known ? rgba(C.brand, 0.3) : C.ink800;
            rr(ctx, x, cy - th / 2, tw, th, 5);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = known ? C.brand : C.ink500;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x + 3, cy + th / 2 - 1);
            ctx.lineTo(x + tw - 3, cy + th / 2 - 1);
            ctx.stroke();
            ctx.fillStyle = known ? C.mist50 : C.mist500;
            ctx.fillText(known ? ch : '·', x + tw / 2, cy + 1);
            x += tw + gap;
          }
          const side = (w - totalW) / 2;
          const letters = chars.filter((ch) => ch !== ' ').length;
          ctx.font = `600 10px ${font}`;
          if (side > 70) {
            ctx.textAlign = 'right';
            ctx.fillStyle = C.mist500;
            ctx.fillText(`${letters} үсэг`, w / 2 - totalW / 2 - 12, cy + 1);
          }
          const me = players.find((pl) => pl.userId === p.meUserId);
          if (p.nextHintIn != null && !me?.guessed && side > 70) {
            ctx.textAlign = 'left';
            ctx.fillStyle = C.modifier;
            ctx.fillText(`✦ тип ${p.nextHintIn}с`, w / 2 + totalW / 2 + 12, cy + 1);
          }
        }
      }

      // ── HUD ──
      if (p.inRoom) {
        const hy = 8;
        const hh = L.hudH - 16;
        // цаг (зүүн дээд)
        const showTimer = p.status === 'drawing' || p.status === 'choosing';
        const clockW = L.narrow ? 108 : 132;
        ctx.fillStyle = 'rgba(7,10,18,0.72)';
        rr(ctx, 8, hy, clockW, hh, 11);
        ctx.fill();
        ctx.strokeStyle = drawing ? timerColor : C.ink600;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        const cr = hh / 2 - 5;
        const ccx = 8 + 6 + cr;
        const ccy = hy + hh / 2;
        const pulse = urgent ? 1 + 0.08 * Math.abs(Math.sin(t / 120)) : 1;
        const jx = urgent ? (Math.random() - 0.5) * 2.4 : 0;
        const jy = urgent ? (Math.random() - 0.5) * 2.4 : 0;
        ctx.save();
        ctx.translate(ccx + jx, ccy + jy);
        ctx.scale(pulse, pulse);
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, cr, 0, Math.PI * 2);
        ctx.stroke();
        if (showTimer) {
          ctx.strokeStyle = timerColor;
          ctx.shadowColor = timerColor;
          ctx.shadowBlur = urgent ? 14 : 6;
          ctx.beginPath();
          ctx.arc(0, 0, cr, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(p.fraction, 0, 1));
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
        ctx.font = `800 ${cr > 12 ? 13 : 11}px ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = showTimer ? timerColor : p.status === 'reveal' ? C.modifier : C.mist300;
        ctx.fillText(showTimer && p.remainSec != null ? String(p.remainSec) : '–', 0, 1);
        ctx.restore();
        ctx.font = `700 9px ${font}`;
        ctx.textAlign = 'left';
        ctx.fillStyle = C.mist300;
        const label =
          p.status === 'drawing'
            ? urgent
              ? 'ЯАРААРАЙ!'
              : 'СЕКУНД'
            : p.status === 'choosing'
              ? 'СОНГОЛТ'
              : p.status === 'reveal'
                ? 'ИЛЧЛЭЛ'
                : finished
                  ? 'ДУУСЛАА'
                  : 'ХҮЛЭЭЛТ';
        const lx = ccx + cr + 8;
        ctx.fillText(label, lx, hy + hh * 0.34);
        const barW = 8 + clockW - lx - 10;
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        rr(ctx, lx, hy + hh * 0.58, barW, 6, 3);
        ctx.fill();
        ctx.fillStyle = showTimer ? timerColor : finished ? C.modifier : C.ink500;
        rr(ctx, lx, hy + hh * 0.58, barW * (showTimer ? clamp(p.fraction, 0, 1) : 1), 6, 3);
        ctx.fill();

        // холболт (баруун дээд)
        const connColor = p.conn === 'online' ? C.success : p.conn === 'connecting' ? C.modifier : C.danger;
        const connText = p.conn === 'online' ? 'Холбогдсон' : p.conn === 'connecting' ? 'Холбогдож байна…' : 'Холболтгүй';
        ctx.font = `600 10px ${font}`;
        const ctw = L.narrow ? 0 : ctx.measureText(connText).width;
        const cw = ctw + (L.narrow ? 22 : 34);
        ctx.fillStyle = 'rgba(7,10,18,0.72)';
        rr(ctx, w - 8 - cw, hy, cw, hh, 11);
        ctx.fill();
        ctx.strokeStyle = p.conn === 'online' ? C.ink600 : connColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = connColor;
        ctx.shadowColor = connColor;
        ctx.shadowBlur = p.conn === 'online' ? 8 : 12 * (0.5 + 0.5 * Math.sin(t / 200));
        ctx.beginPath();
        ctx.arc(w - 8 - cw + 11, hy + hh / 2, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (!L.narrow) {
          ctx.textAlign = 'left';
          ctx.fillStyle = p.conn === 'online' ? C.mist300 : connColor;
          ctx.fillText(connText, w - 8 - cw + 21, hy + hh / 2 + 0.5);
        }

        // тойрог / ээлж / код (төв)
        const midText = p.status === 'lobby' ? `${players.length} тоглогч` : L.narrow ? `Т ${p.round}/${p.totalRounds} · Э ${p.turn}/${p.totalTurns}` : `Тойрог ${p.round}/${p.totalRounds} · Ээлж ${p.turn}/${p.totalTurns}`;
        ctx.font = `700 11px ${font}`;
        const mw = ctx.measureText(midText).width;
        ctx.font = `700 11px ${font}`;
        const code = p.roomCode ?? '';
        const codeW = code && !L.narrow ? ctx.measureText(code).width + 14 : 0;
        const pw = mw + codeW + 24;
        const px = w / 2 - pw / 2;
        const leftEdge = 8 + clockW + 6;
        const rightEdge = w - 8 - cw - 6;
        if (pw <= rightEdge - leftEdge) {
          ctx.fillStyle = 'rgba(7,10,18,0.72)';
          rr(ctx, px, hy, pw, hh, 11);
          ctx.fill();
          ctx.strokeStyle = C.ink600;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.textAlign = 'left';
          ctx.fillStyle = C.mist50;
          ctx.fillText(midText, px + 12, hy + hh / 2 + 0.5);
          if (codeW) {
            ctx.fillStyle = C.ink600;
            ctx.fillRect(px + 12 + mw + 7, hy + 8, 1, hh - 16);
            ctx.fillStyle = C.brandHi;
            ctx.fillText(code, px + 12 + mw + 14, hy + hh / 2 + 0.5);
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
      <canvas ref={canvasRef} className="block font-body" aria-hidden="true" />
    </div>
  );
}

/** Зөв таасан тоглогчийн толгойноос конфетти */
function burstConfetti(list: Particle[], x: number, y: number) {
  for (let k = 0; k < 34; k++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
    const sp = 90 + Math.random() * 190;
    list.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life: 0,
      max: 0.9 + Math.random() * 0.6,
      color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
      size: 2 + Math.random() * 2,
      g: 520,
      rect: true,
    });
  }
}
