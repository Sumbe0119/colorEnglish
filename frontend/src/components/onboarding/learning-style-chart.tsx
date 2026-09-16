'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import {
  LEARNING_STYLES,
  LEARNING_STYLE_LABELS,
  type LearningStyleScores,
} from '@/lib/learning-style';

type Props = {
  scores: LearningStyleScores;
  size?: number;
  className?: string;
};

const SIDE_PAD = 64; // зүүн/баруун шошгонд зориулсан нэмэлт зай

/** 4 тэнхлэгтэй радар диаграм — суралцах арга барилын хувийг харуулна */
export function LearningStyleChart({ scores, size = 260, className }: Props) {
  const gradId = useId();
  const c = size / 2;
  const r = size / 2 - 32; // дээд/доод label-д зай үлдээнэ
  const n = LEARNING_STYLES.length;
  // Хуваарийг хамгийн өндөр оноонд тааруулна (25-аар бүхэлчилж, доод тал нь 50%)
  const maxScore = Math.max(...LEARNING_STYLES.map((s) => scores[s]));
  const domain = Math.min(100, Math.max(50, Math.ceil(maxScore / 25) * 25));
  const rings = Array.from({ length: domain / 25 }, (_, i) => (i + 1) * 25);

  const point = (i: number, value: number) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const dist = (r * Math.min(value, domain)) / domain;
    return { x: c + dist * Math.cos(angle), y: c + dist * Math.sin(angle) };
  };

  const polygon = (value: number | ((i: number) => number)) =>
    LEARNING_STYLES.map((_, i) => {
      const p = point(i, typeof value === 'number' ? value : value(i));
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');

  const dataPoints = polygon((i) => scores[LEARNING_STYLES[i]]);
  const zeroPoints = polygon(0);

  return (
    <svg
      viewBox={`${-SIDE_PAD} 0 ${size + SIDE_PAD * 2} ${size}`}
      width="100%"
      style={{ maxWidth: size + SIDE_PAD * 2 }}
      className={className}
      role="img"
      aria-label={LEARNING_STYLES.map(
        (s) => `${LEARNING_STYLE_LABELS[s].short} ${scores[s]}%`,
      ).join(', ')}
    >
      <defs>
        <radialGradient id={gradId}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.12" />
        </radialGradient>
      </defs>

      {/* Grid */}
      {rings.map((v) => (
        <polygon
          key={v}
          points={polygon(v)}
          fill="none"
          className="stroke-ink-600"
          strokeWidth={1}
        />
      ))}
      {LEARNING_STYLES.map((_, i) => {
        const p = point(i, domain);
        return (
          <line
            key={i}
            x1={c}
            y1={c}
            x2={p.x}
            y2={p.y}
            className="stroke-ink-600"
            strokeWidth={1}
          />
        );
      })}

      {/* Data */}
      <g className="text-brand">
        <motion.polygon
          initial={{ points: zeroPoints, opacity: 0 }}
          animate={{ points: dataPoints, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          fill={`url(#${gradId})`}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {LEARNING_STYLES.map((s, i) => {
          const p = point(i, scores[s]);
          return (
            <motion.circle
              key={s}
              initial={{ cx: c, cy: c, opacity: 0 }}
              animate={{ cx: p.x, cy: p.y, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              r={4}
              fill="currentColor"
              className="stroke-ink-900"
              strokeWidth={2}
            />
          );
        })}
      </g>

      {/* Axis labels */}
      {LEARNING_STYLES.map((s, i) => {
        const p = point(i, domain);
        const dx = p.x - c;
        const dy = p.y - c;
        const anchor = Math.abs(dx) < 1 ? 'middle' : dx > 0 ? 'start' : 'end';
        const lx = p.x + (Math.abs(dx) < 1 ? 0 : dx > 0 ? 10 : -10);
        const ly = p.y + (Math.abs(dy) < 1 ? 4 : dy > 0 ? 18 : -10);
        return (
          <text key={s} x={lx} y={ly} textAnchor={anchor} className="fill-mist-300" fontSize={11}>
            <tspan fontWeight={600}>{LEARNING_STYLE_LABELS[s].short}</tspan>
            <tspan className="fill-mist-500"> {scores[s]}%</tspan>
          </text>
        );
      })}
    </svg>
  );
}
