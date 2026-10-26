// frontend/src/components/teacher/birth-date-picker.tsx
// Төрсөн огнын календарь — он/сар сонгогч select + өдрийн тор. Утга нь YYYY-MM-DD.
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTHS = ['1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар', '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар'];
const WEEKDAYS = ['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня'];

const pad = (n: number) => String(n).padStart(2, '0');
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

function parseIso(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? { y: Number(m[1]), m: Number(m[2]) - 1, d: Number(m[3]) } : null;
}

export function BirthDatePicker({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (iso: string) => void;
  error?: string;
}) {
  const now = new Date();
  const thisYear = now.getFullYear();
  const selected = parseIso(value);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selected?.y ?? thisYear - 28);
  const [viewMonth, setViewMonth] = useState(selected?.m ?? 0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = thisYear - 16; y >= thisYear - 80; y--) list.push(y);
    return list;
  }, [thisYear]);

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const offset = (first.getDay() + 6) % 7; // Даваа гараг эхэлнэ
    const days = new Date(viewYear, viewMonth + 1, 0).getDate();
    return [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)] as (number | null)[];
  }, [viewYear, viewMonth]);

  const shift = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    if (y > thisYear - 16 || y < thisYear - 80) return;
    setViewMonth(m);
    setViewYear(y);
  };

  const selectClass =
    'rounded-lg border border-ink-500 bg-ink-800 px-2 py-1.5 text-sm text-mist-50 focus:border-brand focus:outline-none';

  return (
    <div className="space-y-1.5" ref={rootRef}>
      <p className="block text-sm font-medium text-mist-200">{label}</p>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            'flex w-full items-center justify-between rounded-xl border bg-ink-800 px-4 py-3 text-left text-base transition-colors focus:outline-none focus:ring-2 focus:ring-brand/40',
            error ? 'border-danger' : 'border-ink-500 hover:border-brand/40',
            selected ? 'text-mist-50' : 'text-mist-500',
          )}
        >
          {selected ? `${selected.y} оны ${selected.m + 1}-р сарын ${selected.d}` : 'Огноо сонгох'}
          <CalendarDays className="h-4 w-4 text-brand" />
        </button>

        {open && (
          <div
            role="dialog"
            aria-label="Төрсөн огноо сонгох"
            className="absolute left-0 z-30 mt-2 w-[300px] rounded-2xl border border-ink-600 bg-ink-900 p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-center gap-1.5">
              <button type="button" onClick={() => shift(-1)} className="rounded-lg p-1.5 text-mist-300 hover:bg-ink-800" aria-label="Өмнөх сар">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <select value={viewMonth} onChange={(e) => setViewMonth(Number(e.target.value))} className={cn(selectClass, 'flex-1')} aria-label="Сар">
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
              <select value={viewYear} onChange={(e) => setViewYear(Number(e.target.value))} className={selectClass} aria-label="Он">
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button type="button" onClick={() => shift(1)} className="rounded-lg p-1.5 text-mist-300 hover:bg-ink-800" aria-label="Дараагийн сар">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase text-mist-500">
              {WEEKDAYS.map((w) => (
                <span key={w} className="py-1">{w}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map((d, i) =>
                d === null ? (
                  <span key={`e${i}`} />
                ) : (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      onChange(toIso(viewYear, viewMonth, d));
                      setOpen(false);
                    }}
                    className={cn(
                      'h-9 rounded-lg text-sm transition-colors',
                      selected && selected.y === viewYear && selected.m === viewMonth && selected.d === d
                        ? 'bg-brand font-semibold text-ink-950'
                        : 'text-mist-200 hover:bg-brand/15 hover:text-brand',
                    )}
                  >
                    {d}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
