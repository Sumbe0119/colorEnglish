// frontend/src/components/sentence-builder/fireworks.tsx
// Зөв хариулахад бүтэн дэлгэцээр салют буудах canvas давхарга.
// `burst` утга өөрчлөгдөх бүрт шинэ салют хөөрнө. Хулганы үйлдлийг хаахгүй (pointer-events: none).
'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

type Rocket = {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
};

const COLORS = ['#4F8CFF', '#FF9A6B', '#3DDC97', '#FFD166', '#FF6B7A', '#C58CFF', '#6EA8FF', '#FFFFFF'];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function Fireworks({ burst }: { burst: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const lastRef = useRef(0);

  useEffect(() => {
    if (burst <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    // 5–6 пуужин: доороос дээш хөөрөөд дэлбэрнэ. Хоорондоо бага зэрэг зөрүүтэй хугацаанд.
    const startAt = performance.now();
    const count = 5 + Math.floor(Math.random() * 2);
    const timers: number[] = [];
    for (let i = 0; i < count; i++) {
      timers.push(window.setTimeout(() => {
        rocketsRef.current.push({
          x: rand(w() * 0.15, w() * 0.85),
          y: h() + 10,
          vy: -rand(h() * 0.95, h() * 1.25),
          targetY: rand(h() * 0.18, h() * 0.45),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }, i * 160));
    }

    const explode = (r: Rocket) => {
      const n = 70 + Math.floor(Math.random() * 40);
      const second = Math.random() < 0.5 ? COLORS[Math.floor(Math.random() * COLORS.length)] : r.color;
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + rand(-0.08, 0.08);
        const speed = rand(60, 260);
        particlesRef.current.push({
          x: r.x,
          y: r.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: rand(0.9, 1.6),
          color: i % 2 === 0 ? r.color : second,
          size: rand(1.6, 3.2),
        });
      }
    };

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const step = (t: number) => {
      const dt = Math.min(0.05, (t - (lastRef.current || t)) / 1000);
      lastRef.current = t;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w(), h());

      // Пуужин
      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy * dt;
        r.vy += 900 * dt; // хөөрөх хурд аажмаар буурна
        ctx.beginPath();
        ctx.fillStyle = r.color;
        ctx.globalAlpha = 0.95;
        ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        // сүүл
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x, r.y + 14);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r);
          rockets.splice(i, 1);
        }
      }

      // Дэлбэрэлтийн хэсгүүд
      const ps = particlesRef.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          ps.splice(i, 1);
          continue;
        }
        p.vy += 220 * dt; // таталцал
        p.vx *= 1 - 1.4 * dt;
        p.vy *= 1 - 1.0 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const k = 1 - p.life / p.maxLife;
        ctx.globalAlpha = Math.max(0, k);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.6 + 0.4 * k), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (rockets.length || ps.length || t - startAt < count * 160 + 50) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        runningRef.current = false;
        ctx.clearRect(0, 0, w(), h());
      }
    };

    window.addEventListener('resize', resize);
    if (!runningRef.current) {
      runningRef.current = true;
      lastRef.current = 0;
      rafRef.current = requestAnimationFrame(step);
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('resize', resize);
    };
  }, [burst]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80]"
      style={{ display: burst > 0 ? 'block' : 'none' }}
    />
  );
}
