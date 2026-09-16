// frontend/src/components/layout/learning-style-reminder.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, ChevronRight, X } from "lucide-react";
import { getProfile, needsLearningStyleSurvey } from "@/lib/services";

const DISMISS_KEY = "ce:learning-style-reminder-dismissed";

/** Суралцах арга барилын судалгааг дутуу бөглөсөн / бөглөөгүй хэрэглэгчдэд сануулна */
export function LearningStyleReminder() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const hidden = pathname.startsWith("/learning-style") || pathname.startsWith("/admin");

  useEffect(() => {
    if (hidden) return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {
      /* storage боломжгүй бол үргэлж шалгана */
    }
    let cancelled = false;
    getProfile()
      .then((p) => !cancelled && setShow(needsLearningStyleSurvey(p)))
      .catch(() => !cancelled && setShow(false));
    return () => {
      cancelled = true;
    };
  }, [hidden]);

  if (hidden || !show) return null;

  const dismiss = () => {
    setShow(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="border-t border-brand/20 bg-brand/10">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6 md:px-10 lg:px-10">
        <BrainCircuit className="h-4 w-4 shrink-0 text-brand" />
        <p className="min-w-0 flex-1 text-xs leading-5 text-mist-200 sm:text-sm">
          Суралцах арга барилаа бүрэн тодорхойлоогүй байна. 5 минут зарцуулаад танд тохирох зөвлөмжийг аваарай.
        </p>
        <Link
          href={`/learning-style?next=${encodeURIComponent(pathname)}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-hover"
        >
          Тодорхойлох <ChevronRight className="h-3.5 w-3.5" />
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-md p-1 text-mist-400 hover:bg-ink-800 hover:text-mist-50"
          aria-label="Хаах"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
