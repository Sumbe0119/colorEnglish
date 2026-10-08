// frontend/src/components/type-rush/use-typing-race.ts
// Бичих логик: зөв prefix, алдаа, үгийн хил давах бүрт callback. Solo болон онлайн горим хоёулаа ашиглана.
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { computeAccuracy } from '@/lib/type-rush';

export function commonPrefixLength(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  let i = 0;
  while (i < n && a[i] === b[i]) i++;
  return i;
}

type Options = {
  text: string;
  active: boolean;
  /** Зөв бичсэн тэмдэгтийн тоо өөрчлөгдөх бүрт. */
  onProgress: (correct: number, total: number) => void;
  /** Үг дуусахад — cps: тэр үгийг бичсэн хурд (тэмдэгт/сек). */
  onWord: (cps: number, correct: number) => void;
  onFinish: () => void;
};

export function useTypingRace(opts: Options) {
  const [typed, setTyped] = useState('');
  const [keystrokes, setKeystrokes] = useState(0);
  const [errors, setErrors] = useState(0);

  const typedRef = useRef('');
  const maxBoundaryRef = useRef(0);
  const lastBoundaryAtRef = useRef(0);
  const finishedRef = useRef(false);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const boundaries = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < opts.text.length; i++) if (opts.text[i] === ' ') out.push(i);
    out.push(opts.text.length);
    return out;
  }, [opts.text]);

  const reset = useCallback(() => {
    typedRef.current = '';
    maxBoundaryRef.current = 0;
    finishedRef.current = false;
    lastBoundaryAtRef.current = performance.now();
    setTyped('');
    setKeystrokes(0);
    setErrors(0);
  }, []);

  useEffect(() => {
    reset();
  }, [opts.text, reset]);

  /** GO мөчид дуудна — эхний үгийн хурдыг зөв хэмжихэд. */
  const markStart = useCallback(() => {
    lastBoundaryAtRef.current = performance.now();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { text, active, onProgress, onWord, onFinish } = optsRef.current;
      if (!active || finishedRef.current) return;
      const prev = typedRef.current;
      let next = e.target.value;
      if (next.length > text.length + 8) next = next.slice(0, text.length + 8);

      if (next.length > prev.length) {
        setKeystrokes((k) => k + (next.length - prev.length));
        if (text.startsWith(prev) && !text.startsWith(next)) setErrors((x) => x + 1);
      }

      typedRef.current = next;
      setTyped(next);

      const correct = commonPrefixLength(next, text);
      onProgress(correct, text.length);

      const nowMs = performance.now();
      let crossed = false;
      let fastest = 0;
      for (const b of boundaries) {
        if (b <= maxBoundaryRef.current || correct < b) continue;
        const wordLen = b - maxBoundaryRef.current;
        const dt = Math.max(1, nowMs - lastBoundaryAtRef.current);
        fastest = Math.max(fastest, wordLen / (dt / 1000));
        maxBoundaryRef.current = b;
        lastBoundaryAtRef.current = nowMs;
        crossed = true;
      }
      if (crossed) onWord(fastest, correct);

      if (next === text) {
        finishedRef.current = true;
        onFinish();
      }
    },
    [boundaries],
  );

  const correctLen = commonPrefixLength(typed, opts.text);

  return {
    typed,
    correctLen,
    keystrokes,
    errors,
    accuracy: computeAccuracy(keystrokes, errors),
    hasError: typed.length > correctLen,
    handleChange,
    reset,
    markStart,
  };
}
