"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BrainCircuit, X } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

const DISMISS_KEY = "ce:home-learning-style-bar-dismissed";

/** Нүүр хуудасны доод талд наалттай "Суралцах арга барил тодорхойлох" урилга */
export function LearningStyleStickyBar() {
  const user = useAuthStore((s) => s.user);
  const [dismissed, setDismissed] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    try {
      setDismissed(Boolean(sessionStorage.getItem(DISMISS_KEY)));
    } catch {
      setDismissed(false);
    }

    const onScroll = () => setScrolled(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Арга барилын хэсэг дэлгэцэнд харагдаж байхад давхардуулж харуулахгүй
    const section = document.getElementById("learning-style");
    const observer = section ? new IntersectionObserver(([entry]) => setSectionVisible(entry.isIntersecting), { threshold: 0.2 }) : null;
    if (section && observer) observer.observe(section);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const show = scrolled && !dismissed && !sectionVisible;
  // Зочин эхлээд onboarding-ийн судалгааг бөглөж, үр дүнгээ харахдаа бүртгүүлнэ
  const href = user ? "/learning-style?next=/" : "/onboarding";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-brand/30 bg-ink-900/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-md sm:gap-4 sm:p-4">
            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 sm:flex">
              <BrainCircuit className="h-5 w-5 text-brand" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-mist-50">5 минут зарцуулаад суралцах арга барилаа тодорхойл</p>
              <p className="mt-0.5 hidden text-xs text-mist-400 sm:block">
                Өөрт тохирох арга барилаа мэдэж авснаас суралцах явц чинь илүү үр дүнтэй болно шүү.
              </p>
            </div>
            <Link
              href={href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-ink-950 transition-colors hover:bg-brand-hover sm:px-4 sm:text-sm"
            >
              Тодорхойлох <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Хаах"
              className="shrink-0 rounded-lg p-1.5 text-mist-400 transition-colors hover:bg-ink-800 hover:text-mist-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
