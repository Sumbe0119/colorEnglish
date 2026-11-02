// frontend/src/components/tug-of-war/tug-scene.tsx
// "Олс татах" тоглоомын 2D дүрслэл — canvas дээр rAF-аар зурна. Эцэг элементээ бүтнээр дүүргэнэ.
// Хажуугаас харсан талбай: тэнгэр, үүл, толгод, өвс. Голд нь олс, олсны голд улаан тууз; зүүн/баруун талд
// багийн шугам (улаан / цэнхэр). Зүүн талд улаан багийн 3 дүр, баруун талд цэнхэр багийн 3 дүр олсыг татна.
// Туузны байрлал (-1..+1) imperative handle-аар (setPos) шинэчлэгдэж гөлгөр (lerp) хөдөлнө; pull() нь
// тухайн багт татах импульс (хойш налах, тоос, олс чичрэх) өгнө. HUD: цаг, хоёр багийн нэр / оноо.
'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { TEAM_INFO, type Team } from '@/lib/tug-of-war';

export type TugHud = {
  timerText: string;
  /** Үлдсэн хугацааны хувь (1 → 0) */
  fraction: number;
  urgent: boolean;
  redName: string;
  blueName: string;
  redScore: number;
  blueScore: number;
  /** 'ТА' гэж тэмдэглэх баг */
  myTeam: Team | null;
};

export type TugSceneHandle = {
  setPos(pos: number): void;
  /** Байрлалыг анимацигүй шууд тавина (шинэ тоглолт). */
  resetPos(pos?: number): void;
  pull(team: Team): void;
  /** Буруу хариулт — тухайн баг гулсаж бүдэрнэ (жижиг анимаци). */
  stumble(team: Team): void;
  setHud(h: Partial<TugHud>): void;
  /** 3 → 2 → 1 → GO; null арилгана. */
  countdown(step: number | 'GO' | null): void;
  /** Тоглолт дууслаа: хожсон баг (эсвэл тэнцээ). */
  finish(winner: Team | 'draw'): void;
  /** Үр дүнгийн давхаргыг арилгана (lobby руу буцах). */
  clearFinish(): void;
};

export type TugSceneProps = {
  /** Тоглолт явагдаж байна — дүрүүд хүчлэн татна. */
  running: boolean;
  showHud: boolean;
  onTap?: () => void;
};

const C = {
  ink950: '#070A12',
  ink900: '#0C1220',
  mist50: '#F5F8FC',
  mist300: '#A8B6CC',
  mist500: '#6B7A94',
  success: '#3DDC97',
  danger: '#FF6B7A',
  modifier: '#FFD166',
};

const PULL_MS = 520;
const STUMBLE_MS = 600;
const GO_MS = 800;
const COUNT_POP_MS = 380;
const MAX_DUST = 80;
const CONFETTI_COLORS = ['#FF4D4D', '#4F8CFF', '#FFD166', '#3DDC97', '#C58CFF', '#FFFFFF'];

type Dust = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number };
type Confetti = { x: number; y: number; vx: number; vy: number; rot: number; vr: number; color: string; life: number };

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - clamp(t, 0, 1), 3);
}

export const TugScene = forwardRef<TugSceneHandle, TugSceneProps>(function TugScene({ running, showHud, onTap }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef({ running, showHud });
  propsRef.current = { running, showHud };

  const targetRef = useRef(0);
  const posRef = useRef(0);
  const hudRef = useRef<TugHud>({
    timerText: '3:00',
    fraction: 1,
    urgent: false,
    redName: 'Улаан',
    blueName: 'Цэнхэр',
    redScore: 0,
    blueScore: 0,
    myTeam: null,
  });
  const pullRef = useRef<{ red: number; blue: number }>({ red: -1e9, blue: -1e9 });
  const stumbleRef = useRef<{ red: number; blue: number }>({ red: -1e9, blue: -1e9 });
  const countRef = useRef<{ step: number | 'GO' | null; at: number }>({ step: null, at: 0 });
  const finishRef = useRef<{ winner: Team | 'draw'; at: number } | null>(null);
  const dustRef = useRef<Dust[]>([]);
  const confettiRef = useRef<Confetti[]>([]);
  const shakeRef = useRef(0);
  const cloudsRef = useRef<{ x: number; y: number; s: number; v: number }[]>([]);

  useImperativeHandle(
    ref,
    () => ({
      setPos(p) {
        targetRef.current = clamp(p, -1, 1);
      },
      resetPos(p = 0) {
        targetRef.current = clamp(p, -1, 1);
        posRef.current = targetRef.current;
        finishRef.current = null;
        confettiRef.current = [];
        dustRef.current = [];
      },
      pull(team) {
        pullRef.current[team] = performance.now();
        shakeRef.current = 5;
      },
      stumble(team) {
        stumbleRef.current[team] = performance.now();
      },
      setHud(h) {
        hudRef.current = { ...hudRef.current, ...h };
      },
      countdown(step) {
        countRef.current = { step, at: performance.now() };
      },
      finish(winner) {
        finishRef.current = { winner, at: performance.now() };
        if (winner !== 'draw') {
          shakeRef.current = 10;
          const c = confettiRef.current;
          for (let i = 0; i < 90; i++) {
            c.push({
              x: Math.random(),
              y: -0.1 - Math.random() * 0.3,
              vx: (Math.random() - 0.5) * 0.12,
              vy: 0.15 + Math.random() * 0.25,
              rot: Math.random() * Math.PI * 2,
              vr: (Math.random() - 0.5) * 6,
              color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
              life: 3.2 + Math.random() * 1.5,
            });
          }
        }
      },
      clearFinish() {
        finishRef.current = null;
        confettiRef.current = [];
      },
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.floor(r.width));
      h = Math.max(1, Math.floor(r.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (cloudsRef.current.length === 0) {
      for (let i = 0; i < 6; i++) {
        cloudsRef.current.push({ x: Math.random(), y: 0.08 + Math.random() * 0.22, s: 0.6 + Math.random() * 0.8, v: 0.004 + Math.random() * 0.008 });
      }
    }

    let raf = 0;
    let last = performance.now();

    const addDust = (x: number, y: number, dir: number, n: number) => {
      const d = dustRef.current;
      for (let i = 0; i < n; i++) {
        if (d.length >= MAX_DUST) d.shift();
        d.push({
          x,
          y,
          vx: dir * (20 + Math.random() * 60) + (Math.random() - 0.5) * 30,
          vy: -(10 + Math.random() * 40),
          life: 0,
          max: 0.5 + Math.random() * 0.4,
          r: 2 + Math.random() * 4,
        });
      }
    };

    // ── Дүр зурах: хажуугаас харсан, олс татаж буй хүн ──
    const drawPuller = (x: number, groundY: number, facing: 1 | -1, team: Team, lean: number, scale: number, bob: number, idx: number) => {
      const info = TEAM_INFO[team];
      const s = scale;
      ctx.save();
      ctx.translate(x, groundY);
      ctx.scale(facing, 1);
      // Сүүдэр
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 2, 20 * s, 5 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      // Хойш налах (facing чиглэлд олс байна; хойш = -x)
      ctx.rotate(-lean);
      ctx.translate(0, bob);
      // Хөл
      ctx.strokeStyle = '#1E2A40';
      ctx.lineWidth = 6 * s;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-4 * s, -30 * s);
      ctx.lineTo(14 * s, -2 * s);
      ctx.moveTo(-4 * s, -30 * s);
      ctx.lineTo(-16 * s, -2 * s);
      ctx.stroke();
      // Гутал
      ctx.fillStyle = '#0C1220';
      ctx.fillRect(10 * s, -5 * s, 11 * s, 5 * s);
      ctx.fillRect(-22 * s, -5 * s, 11 * s, 5 * s);
      // Бие (цамц)
      ctx.fillStyle = info.color;
      ctx.beginPath();
      ctx.roundRect(-11 * s, -62 * s, 22 * s, 34 * s, 6 * s);
      ctx.fill();
      // Тоо (цамцан дээр)
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = `bold ${10 * s}px ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.save();
      ctx.scale(facing, 1);
      ctx.fillText(String(idx + 1), 0, -40 * s);
      ctx.restore();
      // Гар — олс руу урагш сунгасан
      ctx.strokeStyle = '#F2C9A0';
      ctx.lineWidth = 5 * s;
      ctx.beginPath();
      ctx.moveTo(6 * s, -54 * s);
      ctx.lineTo(26 * s, -44 * s);
      ctx.moveTo(6 * s, -46 * s);
      ctx.lineTo(26 * s, -40 * s);
      ctx.stroke();
      // Толгой
      ctx.fillStyle = '#F2C9A0';
      ctx.beginPath();
      ctx.arc(0, -74 * s, 11 * s, 0, Math.PI * 2);
      ctx.fill();
      // Үс / малгай багийн өнгөөр
      ctx.fillStyle = info.dark;
      ctx.beginPath();
      ctx.arc(0, -77 * s, 11 * s, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-11 * s, -78 * s, 22 * s, 3 * s);
      // Нүд
      ctx.fillStyle = '#0C1220';
      ctx.beginPath();
      ctx.arc(5 * s, -73 * s, 1.6 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      // performance.now() — handle-ийн (pull / countdown / finish) цагтай нэг эх үүсвэр
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { running: isRunning, showHud: hud } = propsRef.current;
      const H = hudRef.current;

      // Байрлалыг гөлгөр ойртуулна
      const diff = targetRef.current - posRef.current;
      posRef.current += diff * Math.min(1, dt * 7);
      if (Math.abs(diff) < 0.0005) posRef.current = targetRef.current;
      const pos = posRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Чичрэлт
      if (shakeRef.current > 0.2) {
        ctx.translate((Math.random() - 0.5) * shakeRef.current, (Math.random() - 0.5) * shakeRef.current);
        shakeRef.current *= 0.86;
      }

      const groundY = h * 0.78;
      const cx = w / 2;
      // Шугам хоорондын зай: хоёр шугам голоос ±lineHalf зайд
      const lineHalf = Math.min(w * 0.3, 260);
      const ribbonX = cx + pos * lineHalf;

      // ── Тэнгэр ──
      const sky = ctx.createLinearGradient(0, 0, 0, groundY);
      sky.addColorStop(0, '#2F7FD9');
      sky.addColorStop(0.6, '#8FCBFF');
      sky.addColorStop(1, '#D9EFFF');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, groundY);
      // Нар
      ctx.fillStyle = 'rgba(255,230,140,0.9)';
      ctx.beginPath();
      ctx.arc(w * 0.82, h * 0.14, 26, 0, Math.PI * 2);
      ctx.fill();
      // Үүл
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      for (const c of cloudsRef.current) {
        c.x += c.v * dt;
        if (c.x > 1.15) c.x = -0.15;
        const x = c.x * w;
        const y = c.y * h;
        const s = c.s * Math.min(1, w / 700);
        ctx.beginPath();
        ctx.ellipse(x, y, 34 * s, 14 * s, 0, 0, Math.PI * 2);
        ctx.ellipse(x - 22 * s, y + 4 * s, 22 * s, 11 * s, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 24 * s, y + 5 * s, 24 * s, 12 * s, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Толгод
      ctx.fillStyle = '#5FA85F';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      for (let x = 0; x <= w; x += 8) {
        const y = groundY - 30 - Math.sin(x / 140) * 22 - Math.sin(x / 57 + 2) * 8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, groundY);
      ctx.fill();
      ctx.fillStyle = '#4A8F4A';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      for (let x = 0; x <= w; x += 8) {
        const y = groundY - 14 - Math.sin(x / 90 + 1) * 10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, groundY);
      ctx.fill();
      // Газар
      const ground = ctx.createLinearGradient(0, groundY, 0, h);
      ground.addColorStop(0, '#7BC96F');
      ground.addColorStop(0.18, '#5FAE55');
      ground.addColorStop(0.2, '#A87B4F');
      ground.addColorStop(1, '#6E4B2E');
      ctx.fillStyle = ground;
      ctx.fillRect(0, groundY, w, h - groundY);

      // ── Багийн бүс (талбайн будаг) ──
      const redZoneX = cx - lineHalf;
      const blueZoneX = cx + lineHalf;
      ctx.fillStyle = 'rgba(255,77,77,0.10)';
      ctx.fillRect(0, groundY, redZoneX, h - groundY);
      ctx.fillStyle = 'rgba(79,140,255,0.10)';
      ctx.fillRect(blueZoneX, groundY, w - blueZoneX, h - groundY);
      // Шугамууд
      const drawLine = (x: number, color: string, label: string) => {
        ctx.fillStyle = color;
        ctx.fillRect(x - 3, groundY - 2, 6, h - groundY + 2);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillRect(x - 1, groundY - 2, 2, h - groundY + 2);
        ctx.fillStyle = color;
        ctx.font = 'bold 10px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, h - 8);
      };
      drawLine(redZoneX, TEAM_INFO.red.color, 'УЛААН ШУГАМ');
      drawLine(blueZoneX, TEAM_INFO.blue.color, 'ЦЭНХЭР ШУГАМ');
      // Голын тэмдэг
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillRect(cx - 1, groundY, 2, h - groundY);

      // ── Татах импульс ──
      const pullT = (team: Team) => clamp((now - pullRef.current[team]) / PULL_MS, 0, 1);
      const stumbleT = (team: Team) => clamp((now - stumbleRef.current[team]) / STUMBLE_MS, 0, 1);
      const pullStrength = (team: Team) => {
        const t = pullT(team);
        return t < 1 ? Math.sin(t * Math.PI) : 0;
      };
      const red = pullStrength('red');
      const blue = pullStrength('blue');

      // ── Дүрүүд ──
      const scale = clamp(Math.min(w / 760, h / 420), 0.55, 1.15);
      const gap = 44 * scale;
      const handOffset = 26 * scale;
      // Хамгийн ойрын дүрийн гар олсны туузнаас тодорхой зайд байна; тууз хөдлөхөд баг бүхэлдээ хөдөлнө
      const redFront = ribbonX - 70 * scale;
      const blueFront = ribbonX + 70 * scale;
      const breathe = isRunning ? Math.sin(now / 160) * 1.2 : Math.sin(now / 600) * 0.6;
      const drawTeam = (team: Team, frontX: number) => {
        const facing: 1 | -1 = team === 'red' ? 1 : -1;
        const str = team === 'red' ? red : blue;
        const st = stumbleT(team);
        const stumble = st < 1 ? Math.sin(st * Math.PI) : 0;
        for (let i = 2; i >= 0; i--) {
          const x = frontX - facing * (i * gap + handOffset);
          const baseLean = isRunning ? 0.28 : 0.12;
          const lean = baseLean + str * 0.22 - stumble * 0.3 + (isRunning ? Math.sin(now / 230 + i) * 0.03 : 0);
          const bob = breathe + (isRunning ? Math.sin(now / 200 + i * 1.3) * 1.5 : 0);
          drawPuller(x, groundY - 2, facing, team, lean, scale * (0.95 + i * 0.03), bob, i);
          if (str > 0.5 && Math.random() < 0.35) addDust(x + facing * 8, groundY, -facing, 1);
          if (stumble > 0.5 && Math.random() < 0.3) addDust(x, groundY, facing, 1);
        }
      };
      drawTeam('red', redFront);
      drawTeam('blue', blueFront);

      // ── Олс ──
      const ropeY = groundY - 46 * scale;
      const sag = 6 + Math.abs(Math.sin(now / 90)) * (red + blue) * 3;
      const ropeL = redFront - (2 * gap + handOffset + 30 * scale);
      const ropeR = blueFront + (2 * gap + handOffset + 30 * scale);
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#5A3C1E';
      ctx.lineWidth = 9 * scale;
      ctx.beginPath();
      ctx.moveTo(ropeL, ropeY + 4);
      ctx.quadraticCurveTo(ribbonX, ropeY + sag + 4, ropeR, ropeY + 4);
      ctx.stroke();
      ctx.strokeStyle = '#C9955A';
      ctx.lineWidth = 7 * scale;
      ctx.beginPath();
      ctx.moveTo(ropeL, ropeY);
      ctx.quadraticCurveTo(ribbonX, ropeY + sag, ropeR, ropeY);
      ctx.stroke();
      // Олсны ширхэг
      ctx.strokeStyle = 'rgba(90,60,30,0.5)';
      ctx.lineWidth = 1.2;
      for (let x = ropeL + 8; x < ropeR - 8; x += 9 * scale) {
        const t = (x - ropeL) / (ropeR - ropeL);
        const y = (1 - t) * (1 - t) * ropeY + 2 * (1 - t) * t * (ropeY + sag) + t * t * ropeY;
        ctx.beginPath();
        ctx.moveTo(x - 2, y - 3 * scale);
        ctx.lineTo(x + 2, y + 3 * scale);
        ctx.stroke();
      }
      // Улаан тууз
      const ribbonY = ropeY + sag * 0.5;
      const flutter = Math.sin(now / 120) * 3;
      ctx.fillStyle = '#E8202E';
      ctx.beginPath();
      ctx.moveTo(ribbonX - 3, ribbonY - 6);
      ctx.lineTo(ribbonX + 3, ribbonY - 6);
      ctx.lineTo(ribbonX + 3, ribbonY + 6);
      ctx.lineTo(ribbonX - 3, ribbonY + 6);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(ribbonX, ribbonY + 4);
      ctx.lineTo(ribbonX + 10 + flutter, ribbonY + 20);
      ctx.lineTo(ribbonX + 2, ribbonY + 28 + flutter * 0.5);
      ctx.lineTo(ribbonX - 2, ribbonY + 28 - flutter * 0.5);
      ctx.lineTo(ribbonX - 10 - flutter, ribbonY + 20);
      ctx.closePath();
      ctx.fill();
      // Туузны сум (дээр нь хувь)
      ctx.fillStyle = 'rgba(12,18,32,0.75)';
      ctx.beginPath();
      ctx.roundRect(ribbonX - 22, ropeY - 40 * scale - 10, 44, 18, 6);
      ctx.fill();
      ctx.fillStyle = C.mist50;
      ctx.font = `bold ${11}px ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${pos > 0 ? '+' : ''}${Math.round(pos * 100)}`, ribbonX, ropeY - 40 * scale - 1);
      ctx.textBaseline = 'alphabetic';

      // ── Тоос ──
      const dust = dustRef.current;
      for (let i = dust.length - 1; i >= 0; i--) {
        const d = dust[i];
        d.life += dt;
        if (d.life >= d.max) {
          dust.splice(i, 1);
          continue;
        }
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.vy += 60 * dt;
        const a = 1 - d.life / d.max;
        ctx.fillStyle = `rgba(200,170,120,${0.5 * a})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * (1 + d.life), 0, Math.PI * 2);
        ctx.fill();
      }

      // ── HUD ──
      if (hud) {
        // Цаг
        const tw = 92;
        ctx.fillStyle = 'rgba(12,18,32,0.82)';
        ctx.beginPath();
        ctx.roundRect(cx - tw / 2, 10, tw, 38, 10);
        ctx.fill();
        ctx.fillStyle = H.urgent ? C.danger : C.mist50;
        ctx.font = 'bold 20px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(H.timerText, cx, 36);
        // Үлдсэн хугацааны зурвас
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(cx - tw / 2 + 8, 43, tw - 16, 3);
        ctx.fillStyle = H.urgent ? C.danger : C.success;
        ctx.fillRect(cx - tw / 2 + 8, 43, (tw - 16) * clamp(H.fraction, 0, 1), 3);

        // Багийн пайз
        const badge = (team: Team, name: string, score: number, left: boolean) => {
          const info = TEAM_INFO[team];
          // Цагны хайрцагтай (92px) давхцахгүй өргөн
          const bw = Math.max(90, Math.min(190, (w - 92 - 44) / 2));
          const x = left ? 10 : w - 10 - bw;
          ctx.fillStyle = 'rgba(12,18,32,0.82)';
          ctx.beginPath();
          ctx.roundRect(x, 10, bw, 38, 10);
          ctx.fill();
          ctx.fillStyle = info.color;
          ctx.fillRect(left ? x : x + bw - 5, 10, 5, 38);
          ctx.textAlign = left ? 'left' : 'right';
          const tx = left ? x + 14 : x + bw - 14;
          ctx.fillStyle = C.mist50;
          ctx.font = 'bold 12px ui-sans-serif, system-ui, sans-serif';
          const mine = H.myTeam === team ? (left ? `${name} · ТА` : `ТА · ${name}`) : name;
          ctx.fillText(mine.length > 22 ? mine.slice(0, 21) + '…' : mine, tx, 26);
          ctx.fillStyle = info.light;
          ctx.font = '11px ui-monospace, monospace';
          ctx.fillText(`зөв: ${score}`, tx, 41);
        };
        badge('red', H.redName, H.redScore, true);
        badge('blue', H.blueName, H.blueScore, false);
      }

      // ── Countdown ──
      const cd = countRef.current;
      if (cd.step != null) {
        const age = now - cd.at;
        const isGo = cd.step === 'GO';
        if (!isGo || age < GO_MS) {
          const t = clamp(age / COUNT_POP_MS, 0, 1);
          const sc = 0.6 + easeOut(t) * 0.4;
          const alpha = isGo ? 1 - clamp((age - GO_MS * 0.5) / (GO_MS * 0.5), 0, 1) : 1;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(cx, h * 0.4);
          ctx.scale(sc, sc);
          ctx.fillStyle = isGo ? C.success : C.modifier;
          ctx.strokeStyle = C.ink950;
          ctx.lineWidth = 8;
          ctx.font = `900 ${isGo ? 72 : 96}px ui-sans-serif, system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const txt = isGo ? 'ТАТ!' : String(cd.step);
          ctx.strokeText(txt, 0, 0);
          ctx.fillText(txt, 0, 0);
          ctx.restore();
          ctx.textBaseline = 'alphabetic';
        } else {
          countRef.current = { step: null, at: 0 };
        }
      }

      // ── Конфетти + үр дүн ──
      const fin = finishRef.current;
      const conf = confettiRef.current;
      for (let i = conf.length - 1; i >= 0; i--) {
        const p = conf[i];
        p.life -= dt;
        if (p.life <= 0) {
          conf.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.12 * dt;
        p.rot += p.vr * dt;
        ctx.save();
        ctx.translate(p.x * w, p.y * h);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = clamp(p.life, 0, 1);
        ctx.fillRect(-4, -2.5, 8, 5);
        ctx.restore();
      }
      if (fin) {
        const age = now - fin.at;
        const t = clamp(age / 420, 0, 1);
        const sc = 0.7 + easeOut(t) * 0.3;
        ctx.save();
        ctx.translate(cx, h * 0.38);
        ctx.scale(sc, sc);
        const color = fin.winner === 'draw' ? C.modifier : TEAM_INFO[fin.winner].color;
        const txt = fin.winner === 'draw' ? 'ТЭНЦЭЭ' : fin.winner === 'red' ? 'УЛААН ХОЖЛОО' : 'ЦЭНХЭР ХОЖЛОО';
        ctx.fillStyle = 'rgba(7,10,18,0.55)';
        ctx.beginPath();
        ctx.roundRect(-Math.min(w * 0.45, 230), -34, Math.min(w * 0.9, 460), 68, 14);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.strokeStyle = C.ink950;
        ctx.lineWidth = 6;
        ctx.font = `900 ${Math.min(40, w / 12)}px ui-sans-serif, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(txt, 0, 0);
        ctx.fillText(txt, 0, 0);
        ctx.restore();
        ctx.textBaseline = 'alphabetic';
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 select-none" onPointerDown={onTap}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-label="Олс татах тоглоомын талбай" />
    </div>
  );
});
