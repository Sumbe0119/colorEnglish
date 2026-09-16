'use client';

import { useEffect, useState, type RefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/** Элементийг агуулж буй хамгийн ойрын гүйдэг эцэг (AppShell-д <main>); байхгүй бол window */
function getScrollParent(el: HTMLElement | null): HTMLElement | null {
  for (let node = el?.parentElement ?? null; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
  }
  return null;
}

type Props = {
  /** Дээш гүйлгэхэд харагдуулах элемент (хуудасны эхлэл) */
  targetRef: RefObject<HTMLElement>;
  /** Хэдэн px доош гүйлгэсний дараа товч гарч ирэх */
  threshold?: number;
};

export function ScrollToTopButton({ targetRef, threshold = 600 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scroller = getScrollParent(targetRef.current);
    const read = () => (scroller ? scroller.scrollTop : window.scrollY);
    const onScroll = () => setVisible(read() > threshold);

    onScroll();
    const source: HTMLElement | Window = scroller ?? window;
    source.addEventListener('scroll', onScroll, { passive: true });
    return () => source.removeEventListener('scroll', onScroll);
  }, [targetRef, threshold]);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    targetRef.current?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Дээш буцах"
          title="Дээш буцах"
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-brand/40 bg-ink-900/95 text-brand shadow-lg shadow-black/40 backdrop-blur-md transition-colors hover:bg-brand hover:text-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 sm:right-6 md:bottom-8 md:right-8"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
