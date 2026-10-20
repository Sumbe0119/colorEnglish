// frontend/src/components/draw-guess/draw-canvas.tsx
// Зурах самбар. Дотоод нягтрал 800×600 тогтмол — бүх client дээр зураас, будалт ижил харагдана.
// Зурж буй тоглогч pointer-оор зурахад хэсэгчилсэн op (ижил id) гаргаж, бусад нь apply() хийж давтана.
'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Eraser, PaintBucket, Pen, Trash2, Undo2 } from 'lucide-react';
import type { DrawOp, DrawTool } from '@/lib/draw-guess-socket';
import { sfx } from '@/lib/draw-guess-sfx';

export const CANVAS_W = 800;
export const CANVAS_H = 600;

/** Стандарт өнгөний самбар (MS Paint маягийн 18 өнгө). */
export const PALETTE = [
  '#000000',
  '#7f7f7f',
  '#880015',
  '#ed1c24',
  '#ff7f27',
  '#fff200',
  '#22b14c',
  '#00a2e8',
  '#3f48cc',
  '#a349a4',
  '#ffffff',
  '#c3c3c3',
  '#b97a57',
  '#ffaec9',
  '#ffc90e',
  '#efe4b0',
  '#b5e61d',
  '#99d9ea',
  '#7092be',
  '#c8bfe7',
];

export const BRUSH_SIZES = [3, 6, 12, 22];

const EMIT_MS = 45;
const FILL_TOLERANCE = 60;

export interface CanvasHandle {
  apply(op: DrawOp): void;
  undo(id: string): void;
  clear(): void;
  replay(ops: DrawOp[]): void;
}

interface Props {
  canDraw: boolean;
  onOp?: (op: DrawOp) => void;
  onUndo?: () => void;
  onClear?: () => void;
  overlay?: React.ReactNode;
  /**
   * Хэрэгслийн самбарыг энэ элемент рүү portal-оор зурна (бүтэн хуудасны консол).
   * undefined → самбарын доор шууд; null → host mount болтол зурахгүй.
   */
  toolbarHost?: HTMLElement | null;
  /** Самбарын гадна хүрээний нэмэлт class (бүтэн хуудасны горимд easel дотор) */
  frameClassName?: string;
  /** Хэрэгслийн самбарын төгсгөлд нэмэх товчнууд (дуу, гарах) */
  toolbarExtra?: React.ReactNode;
}

interface Live {
  op: DrawOp;
  last: [number, number];
  pending: number[];
  lastEmit: number;
}

function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function strokeColor(op: DrawOp): string {
  return op.tool === 'eraser' ? '#ffffff' : op.color;
}

function paintDot(c: CanvasRenderingContext2D, op: DrawOp, x: number, y: number) {
  c.fillStyle = strokeColor(op);
  c.beginPath();
  c.arc(x * CANVAS_W, y * CANVAS_H, op.size / 2, 0, Math.PI * 2);
  c.fill();
}

function paintSegment(c: CanvasRenderingContext2D, op: DrawOp, from: [number, number], to: [number, number]) {
  c.strokeStyle = strokeColor(op);
  c.lineWidth = op.size;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(from[0] * CANVAS_W, from[1] * CANVAS_H);
  c.lineTo(to[0] * CANVAS_W, to[1] * CANVAS_H);
  c.stroke();
}

/** Scanline flood fill — ойролцоо өнгөтэй (anti-alias) хүрээг хамруулна. */
function floodFill(c: CanvasRenderingContext2D, nx: number, ny: number, hex: string) {
  const W = CANVAS_W;
  const H = CANVAS_H;
  const x0 = Math.min(W - 1, Math.max(0, Math.floor(nx * W)));
  const y0 = Math.min(H - 1, Math.max(0, Math.floor(ny * H)));
  const img = c.getImageData(0, 0, W, H);
  const d = img.data;
  const [tr, tg, tb] = hexToRgb(hex);
  const si = (y0 * W + x0) * 4;
  const sr = d[si];
  const sg = d[si + 1];
  const sb = d[si + 2];
  if (sr === tr && sg === tg && sb === tb) return;

  const match = (p: number) => {
    const i = p * 4;
    return Math.abs(d[i] - sr) + Math.abs(d[i + 1] - sg) + Math.abs(d[i + 2] - sb) <= FILL_TOLERANCE;
  };
  const visited = new Uint8Array(W * H);
  const stack: number[] = [y0 * W + x0];

  while (stack.length) {
    const p = stack.pop() as number;
    const y = (p / W) | 0;
    let x = p - y * W;
    while (x >= 0 && !visited[y * W + x] && match(y * W + x)) x--;
    x++;
    let spanUp = false;
    let spanDown = false;
    while (x < W && !visited[y * W + x] && match(y * W + x)) {
      const pi = y * W + x;
      visited[pi] = 1;
      d[pi * 4] = tr;
      d[pi * 4 + 1] = tg;
      d[pi * 4 + 2] = tb;
      d[pi * 4 + 3] = 255;
      if (y > 0) {
        const up = pi - W;
        const m = !visited[up] && match(up);
        if (m && !spanUp) {
          stack.push(up);
          spanUp = true;
        } else if (!m) spanUp = false;
      }
      if (y < H - 1) {
        const down = pi + W;
        const m = !visited[down] && match(down);
        if (m && !spanDown) {
          stack.push(down);
          spanDown = true;
        } else if (!m) spanDown = false;
      }
      x++;
    }
  }
  c.putImageData(img, 0, 0);
}

function renderOp(c: CanvasRenderingContext2D, op: DrawOp) {
  if (op.tool === 'fill') {
    floodFill(c, op.points[0], op.points[1], op.color);
    return;
  }
  const pts = op.points;
  if (pts.length < 2) return;
  if (pts.length === 2) {
    paintDot(c, op, pts[0], pts[1]);
    return;
  }
  c.strokeStyle = strokeColor(op);
  c.lineWidth = op.size;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(pts[0] * CANVAS_W, pts[1] * CANVAS_H);
  for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i] * CANVAS_W, pts[i + 1] * CANVAS_H);
  c.stroke();
}

export const DrawCanvas = forwardRef<CanvasHandle, Props>(function DrawCanvas(
  { canDraw, onOp, onUndo, onClear, overlay, toolbarHost, frameClassName, toolbarExtra },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const opsRef = useRef<DrawOp[]>([]);
  const liveRef = useRef<Live | null>(null);
  const [tool, setTool] = useState<DrawTool>('pen');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(6);

  const ctx = useCallback(() => canvasRef.current?.getContext('2d', { willReadFrequently: true }) ?? null, []);

  const redrawAll = useCallback(() => {
    const c = ctx();
    if (!c) return;
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, CANVAS_W, CANVAS_H);
    for (const op of opsRef.current) renderOp(c, op);
  }, [ctx]);

  useEffect(() => {
    redrawAll();
  }, [redrawAll]);

  useImperativeHandle(
    ref,
    () => ({
      apply(op) {
        const c = ctx();
        if (!c) return;
        const existing = op.tool !== 'fill' ? opsRef.current.find((o) => o.id === op.id) : undefined;
        if (existing && existing.points.length >= 2) {
          let from: [number, number] = [existing.points[existing.points.length - 2], existing.points[existing.points.length - 1]];
          for (let i = 0; i < op.points.length; i += 2) {
            const to: [number, number] = [op.points[i], op.points[i + 1]];
            paintSegment(c, existing, from, to);
            from = to;
          }
          existing.points.push(...op.points);
          return;
        }
        const copy: DrawOp = { ...op, points: [...op.points] };
        opsRef.current.push(copy);
        renderOp(c, copy);
      },
      undo(id) {
        opsRef.current = opsRef.current.filter((o) => o.id !== id);
        redrawAll();
      },
      clear() {
        opsRef.current = [];
        liveRef.current = null;
        redrawAll();
      },
      replay(ops) {
        opsRef.current = ops.map((o) => ({ ...o, points: [...o.points] }));
        redrawAll();
      },
    }),
    [ctx, redrawAll],
  );

  // ---------- Зурах (pointer) ----------
  const toLocal = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    return [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000];
  };

  const flush = useCallback(() => {
    const live = liveRef.current;
    if (!live || live.pending.length === 0) return;
    onOp?.({ id: live.op.id, tool: live.op.tool, color: live.op.color, size: live.op.size, points: live.pending });
    live.pending = [];
    live.lastEmit = performance.now();
  }, [onOp]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canDraw) return;
    e.preventDefault();
    const c = ctx();
    if (!c) return;
    const [x, y] = toLocal(e);

    if (tool === 'fill') {
      const op: DrawOp = { id: newId(), tool: 'fill', color, size: 1, points: [x, y] };
      opsRef.current.push(op);
      renderOp(c, op);
      onOp?.(op);
      return;
    }

    e.currentTarget.setPointerCapture(e.pointerId);
    const op: DrawOp = { id: newId(), tool, color, size, points: [x, y] };
    opsRef.current.push(op);
    paintDot(c, op, x, y);
    liveRef.current = { op, last: [x, y], pending: [x, y], lastEmit: 0 };
    sfx.brush();
    flush();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const live = liveRef.current;
    if (!live || !canDraw) return;
    e.preventDefault();
    const c = ctx();
    if (!c) return;
    const [x, y] = toLocal(e);
    const dx = x - live.last[0];
    const dy = y - live.last[1];
    if (dx * dx + dy * dy < 0.000004) return;
    paintSegment(c, live.op, live.last, [x, y]);
    live.op.points.push(x, y);
    live.pending.push(x, y);
    live.last = [x, y];
    if (performance.now() - live.lastEmit > EMIT_MS) flush();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!liveRef.current) return;
    e.preventDefault();
    flush();
    liveRef.current = null;
  };

  const undo = () => {
    if (!canDraw) return;
    const last = opsRef.current[opsRef.current.length - 1];
    if (!last) return;
    opsRef.current.pop();
    redrawAll();
    onUndo?.();
  };

  const clear = () => {
    if (!canDraw) return;
    opsRef.current = [];
    redrawAll();
    onClear?.();
  };

  const cursor = !canDraw ? 'default' : tool === 'fill' ? 'cell' : 'crosshair';

  const toolbar = canDraw ? (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      <div className="grid grid-cols-10 gap-[3px]">
        {PALETTE.map((p) => (
          <button
            key={p}
            type="button"
            aria-label={`Өнгө ${p}`}
            onClick={() => {
              setColor(p);
              if (tool === 'eraser') setTool('pen');
              sfx.tap();
            }}
            className={`h-5 w-5 rounded-md border transition-transform sm:h-6 sm:w-6 ${
              color === p && tool !== 'eraser' ? 'scale-110 border-mist-50 ring-2 ring-brand/60' : 'border-ink-950/60'
            }`}
            style={{ background: p }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-ink-600/80 bg-ink-950/70 p-0.5">
        {BRUSH_SIZES.map((s) => (
          <button
            key={s}
            type="button"
            aria-label={`Зузаан ${s}`}
            onClick={() => setSize(s)}
            className={`flex h-7 w-7 items-center justify-center rounded-md ${size === s ? 'bg-brand/25 ring-1 ring-brand' : 'hover:bg-ink-700'}`}
          >
            <span
              className="rounded-full"
              style={{
                width: Math.min(18, s + 2),
                height: Math.min(18, s + 2),
                background: tool === 'eraser' ? '#fff' : color,
                outline: '1px solid rgba(255,255,255,0.35)',
              }}
            />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-0.5 rounded-lg border border-ink-600/80 bg-ink-950/70 p-0.5">
        <ToolButton active={tool === 'pen'} onClick={() => setTool('pen')} label="Үзэг">
          <Pen className="h-4 w-4" />
        </ToolButton>
        <ToolButton active={tool === 'eraser'} onClick={() => setTool('eraser')} label="Баллуур">
          <Eraser className="h-4 w-4" />
        </ToolButton>
        <ToolButton active={tool === 'fill'} onClick={() => setTool('fill')} label="Будах">
          <PaintBucket className="h-4 w-4" />
        </ToolButton>
      </div>

      <div className="ml-auto flex items-center gap-0.5 rounded-lg border border-ink-600/80 bg-ink-950/70 p-0.5">
        <ToolButton onClick={undo} label="Буцаах">
          <Undo2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={clear} label="Цэвэрлэх" danger>
          <Trash2 className="h-4 w-4" />
        </ToolButton>
      </div>
      {toolbarExtra}
    </div>
  ) : null;

  const board = (
    <div className={`relative overflow-hidden bg-white ${frameClassName ?? 'rounded-2xl border border-ink-600/80 shadow-card'}`}>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="block w-full select-none"
        // Таагч дээр touch-action auto байх ёстой — үгүй бол утсан дээр самбарыг дарж хуудас гүйлгэж чадахгүй
        style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}`, touchAction: canDraw ? 'none' : 'auto', cursor }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={(e) => liveRef.current && onPointerUp(e)}
      />
      {overlay}
    </div>
  );

  if (toolbarHost !== undefined) {
    return (
      <>
        {board}
        {toolbar && toolbarHost ? createPortal(toolbar, toolbarHost) : null}
      </>
    );
  }

  return (
    <div className="space-y-3">
      {board}
      {toolbar && <div className="rounded-2xl border border-ink-600/80 bg-ink-900 p-2 sm:p-3">{toolbar}</div>}
    </div>
  );
});

function ToolButton({
  active,
  onClick,
  label,
  danger,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs transition-colors ${
        active
          ? 'bg-brand text-white shadow-[0_2px_0_#2A5BB8]'
          : danger
            ? 'text-danger hover:bg-danger/10'
            : 'text-mist-300 hover:bg-ink-700 hover:text-mist-50'
      }`}
    >
      {children}
      <span className="hidden 2xl:inline">{label}</span>
    </button>
  );
}
