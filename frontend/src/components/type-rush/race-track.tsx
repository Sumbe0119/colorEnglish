// frontend/src/components/type-rush/race-track.tsx
// 5 замтай зам. Машины байрлалыг React re-render биш, imperative handle-аар кадр бүрт шууд DOM дээр
// шинэчилнэ — ингэснээр бот болон өрсөлдөгчийн хөдөлгөөн гөлгөр явна.
'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import { Flag } from 'lucide-react';
import { LANES, RACE_CARS } from '@/lib/type-rush';
import { CAR_W, CarSprite } from './car-sprite';

export const LANE_H = 58;
/** Багтаамж багатай (нарийн) дэлгэц дээрх замын өндөр ба машины өргөн. */
export const LANE_H_SM = 42;
export const CAR_W_SM = 42;
/** Үүнээс нарийн дэлгэц дээр зам, машиныг багасгана. */
const COMPACT_W = 520;
export const CURB_H = 12;
export const TRACK_START = 5; // %
export const TRACK_END = 90; // % — бариа
const MAX_PUFFS = 60;

export const TYPE_RUSH_STYLES = `
@keyframes tr-dash { from { background-position: 0 0; } to { background-position: -64px 0; } }
.tr-dash { animation: tr-dash 0.45s linear infinite; }
@keyframes tr-puff {
  0%   { transform: translate(-50%, -50%) scale(0.35); opacity: 0.9; }
  100% { transform: translate(calc(-50% - 46px), calc(-50% - 10px)) scale(1.9); opacity: 0; }
}
.tr-puff {
  pointer-events: none;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(236,240,248,0.92) 0%, rgba(170,180,200,0.55) 48%, rgba(120,130,150,0) 72%);
  animation: tr-puff 0.85s ease-out both;
}
@keyframes tr-boost { 0%,100% { filter: drop-shadow(0 0 0 rgba(255,209,102,0)); } 50% { filter: drop-shadow(0 0 10px rgba(255,209,102,0.95)); } }
.tr-boost { animation: tr-boost 0.5s ease-out; }
@keyframes tr-count { 0% { transform: scale(0.5); opacity: 0; } 30% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
.tr-count { animation: tr-count 0.5s ease-out both; }
@keyframes tr-caret { 0%,100% { opacity: 1; } 50% { opacity: 0.15; } }
.tr-caret { animation: tr-caret 0.9s steps(1) infinite; }
`;

export type TrackLane = {
  name: string;
  /** 'ТА' | 'БОТ' | 'ТОГЛОГЧ' | '' */
  tag: string;
  isPlayer: boolean;
  sub?: string;
  /** Хоосон зам — машиныг бүдэг харуулна. */
  dim?: boolean;
};

export type TrackHandle = {
  /** Машины байрлал (0..1) — шууд DOM дээр. */
  setProgress(lane: number, p: number): void;
  getProgress(lane: number): number;
  resetAll(): void;
  /** Машины одоогийн байрлалд утаа гаргана. */
  emitPuffs(lane: number, count: number, size: number): void;
  /** Машиныг гялалзуулна (хурдан үг). */
  boost(lane: number): void;
};

type Puff = { id: number; lane: number; x: number; size: number; delay: number };

function clamp01(v: number) {
  return Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0));
}

export function carLeft(p: number): string {
  return `${TRACK_START + clamp01(p) * (TRACK_END - TRACK_START)}%`;
}

export const RaceTrack = forwardRef<
  TrackHandle,
  {
    lanes: TrackLane[];
    running: boolean;
    overlay?: ReactNode;
    onClick?: () => void;
  }
>(function RaceTrack({ lanes, running, overlay, onClick }, ref) {
  const carRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progRef = useRef<number[]>(Array.from({ length: LANES }, () => 0));
  const boostTimers = useRef<Record<number, number>>({});
  const puffIdRef = useRef(0);
  const [puffs, setPuffs] = useState<Puff[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Замын өндөр/машины хэмжээг эзэмшигч элементийн өргөнөөс тохируулна.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const compact = width > 0 && width < COMPACT_W;
  const laneH = compact ? LANE_H_SM : LANE_H;
  const carW = compact ? CAR_W_SM : CAR_W;

  const emitPuffs = useCallback((lane: number, count: number, size: number) => {
    const x = TRACK_START + clamp01(progRef.current[lane] ?? 0) * (TRACK_END - TRACK_START);
    const fresh: Puff[] = [];
    for (let i = 0; i < count; i++) {
      fresh.push({
        id: ++puffIdRef.current,
        lane,
        x,
        size: size + Math.random() * size * 0.6,
        delay: i * 70,
      });
    }
    setPuffs((prev) => {
      const merged = [...prev, ...fresh];
      return merged.length > MAX_PUFFS ? merged.slice(merged.length - MAX_PUFFS) : merged;
    });
    const ids = new Set(fresh.map((p) => p.id));
    window.setTimeout(() => setPuffs((prev) => prev.filter((p) => !ids.has(p.id))), 950 + count * 70);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setProgress(lane, p) {
        const c = clamp01(p);
        progRef.current[lane] = c;
        const el = carRefs.current[lane];
        if (el) el.style.left = carLeft(c);
      },
      getProgress(lane) {
        return progRef.current[lane] ?? 0;
      },
      resetAll() {
        for (let i = 0; i < LANES; i++) {
          progRef.current[i] = 0;
          const el = carRefs.current[i];
          if (el) el.style.left = carLeft(0);
        }
        setPuffs([]);
      },
      emitPuffs,
      boost(lane) {
        const el = carRefs.current[lane]?.firstElementChild as HTMLElement | null;
        if (!el) return;
        el.classList.remove('tr-boost');
        void el.offsetWidth; // анимацийг дахин эхлүүлэх reflow
        el.classList.add('tr-boost');
        if (boostTimers.current[lane]) window.clearTimeout(boostTimers.current[lane]);
        boostTimers.current[lane] = window.setTimeout(() => el.classList.remove('tr-boost'), 520);
      },
    }),
    [emitPuffs],
  );

  return (
    <div
      ref={wrapRef}
      onClick={onClick}
      className="relative w-full select-none overflow-hidden rounded-2xl border border-ink-600 shadow-card"
      style={{ height: LANES * laneH + CURB_H * 2, background: '#1F6B3A' }}
    >
      {/* Хашлага */}
      <div
        className="absolute inset-x-0 top-0"
        style={{ height: CURB_H, backgroundImage: 'repeating-linear-gradient(to right, #E63946 0 20px, #F5F8FC 20px 40px)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: CURB_H, backgroundImage: 'repeating-linear-gradient(to right, #F5F8FC 0 20px, #E63946 20px 40px)' }}
      />

      {/* Асфальт */}
      <div
        className="absolute inset-x-0"
        style={{
          top: CURB_H,
          bottom: CURB_H,
          background: 'linear-gradient(to bottom, #343943 0%, #2A2F39 50%, #343943 100%), #2E333D',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.9) 0.6px, transparent 0.7px), radial-gradient(rgba(0,0,0,0.9) 0.6px, transparent 0.7px)',
            backgroundSize: '7px 7px, 11px 11px',
            backgroundPosition: '0 0, 3px 5px',
          }}
        />

        {Array.from({ length: LANES - 1 }, (_, i) => (
          <div
            key={i}
            className="tr-dash absolute inset-x-0"
            style={{
              top: (i + 1) * laneH - 1,
              height: 2,
              backgroundImage: 'repeating-linear-gradient(to right, #E6ECF5 0 30px, transparent 30px 64px)',
              opacity: 0.6,
              animationPlayState: running ? 'running' : 'paused',
            }}
          />
        ))}

        {/* Гараа */}
        <div className="absolute bottom-0 top-0" style={{ left: `${TRACK_START}%`, width: 3, background: 'rgba(245,248,252,0.55)' }} />

        {/* Бариа */}
        <div
          className="absolute bottom-0 top-0"
          style={{
            left: `${TRACK_END}%`,
            width: 24,
            backgroundColor: '#F5F8FC',
            backgroundImage:
              'linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%)',
            backgroundSize: '12px 12px',
            backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0',
          }}
        />
        {!compact && (
          <div
            className="absolute flex items-center gap-1 rounded-md bg-ink-950/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-mist-100"
            style={{ left: `calc(${TRACK_END}% - 70px)`, top: 6 }}
          >
            <Flag className="h-3 w-3" /> Бариа
          </div>
        )}

        {/* Замын нэр */}
        {lanes.map((lane, i) => (
          <div
            key={i}
            className={`absolute left-1.5 flex max-w-[62%] items-center gap-1 font-medium sm:left-2 sm:gap-1.5 ${
              compact ? 'text-[9px]' : 'text-[10px]'
            }`}
            style={{ top: i * laneH + (compact ? 3 : 5) }}
          >
            {lane.tag && (
              <span
                className={`shrink-0 rounded px-1 py-0.5 sm:px-1.5 ${
                  lane.isPlayer ? 'bg-brand text-white' : 'bg-ink-950/60 text-mist-300'
                }`}
              >
                {lane.tag}
              </span>
            )}
            <span className={`min-w-0 truncate drop-shadow ${lane.dim ? 'text-mist-500' : 'text-mist-200'}`}>{lane.name}</span>
            {lane.sub && <span className="shrink-0 text-mist-500">{lane.sub}</span>}
          </div>
        ))}

        {/* Утаа */}
        {puffs.map((p) => (
          <div
            key={p.id}
            className="tr-puff absolute"
            style={{
              left: `calc(${p.x}% - ${carW / 2 + 2}px)`,
              top: p.lane * laneH + laneH * 0.62,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}ms`,
            }}
          />
        ))}

        {/* Машинууд */}
        {Array.from({ length: LANES }, (_, lane) => {
          const car = RACE_CARS[lane];
          const info = lanes[lane];
          return (
            <div
              key={lane}
              ref={(el) => {
                carRefs.current[lane] = el;
              }}
              className="absolute"
              style={{
                left: carLeft(progRef.current[lane] ?? 0),
                top: lane * laneH + laneH * 0.62,
                transform: 'translate(-50%, -50%)',
                zIndex: info?.isPlayer ? 3 : 2,
                opacity: info?.dim ? 0.35 : 1,
                willChange: 'left',
              }}
            >
              <CarSprite color={car.color} dark={car.dark} width={carW} />
            </div>
          );
        })}
      </div>

      {overlay}
    </div>
  );
});
