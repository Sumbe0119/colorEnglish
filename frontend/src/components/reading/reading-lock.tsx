// frontend/src/components/reading/reading-lock.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { BookOpen, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSubscriptionMe } from "@/lib/billing-services";

/** Өгүүллэгүүд дахин нээгдэх мөч: 2026-09-14 15:00 (Улаанбаатар, UTC+8). */
export const READING_UNLOCK_AT = new Date("2026-09-14T15:00:00+08:00");

export const isReadingLocked = () => Date.now() < READING_UNLOCK_AT.getTime();

const AUTO_SHOWN_KEY = "reading-unlock-notice-shown";

type ReadingLockValue = {
  /** Хаалтын хугацаа дуусаагүй эсэх (hydration-ы дараа л true болно). */
  locked: boolean;
  /** Админ/эдитор — хаалт хамаарахгүй. */
  staff: boolean;
  /**
   * VIP эрхтэй эсэх. VIP-д л нээгдэх огноог хэлнэ; VIP биш хүнд огноо
   * биш, эхлээд VIP авах саналыг харуулна.
   */
  isPro: boolean;
  /** Анхааруулах цонхыг гараар нээх. */
  showNotice: () => void;
};

const ReadingLockContext = createContext<ReadingLockValue>({
  locked: false,
  staff: false,
  isPro: false,
  showNotice: () => {},
});

export const useReadingLock = () => useContext(ReadingLockContext);

export function ReadingLockProvider({ children }: { children: React.ReactNode }) {
  const [locked, setLocked] = useState(false);
  const [staff, setStaff] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isReadingLocked()) return;
    setLocked(true);

    let cancelled = false;
    getSubscriptionMe()
      .then((sub) => {
        if (cancelled) return;
        if (sub.staffAccess) {
          // Админ/эдитор хэвийн уншина — хаалт ч, анхааруулга ч байхгүй.
          setStaff(true);
          setLocked(false);
          return;
        }
        setIsPro(sub.isPro);
        // VIP хэрэглэгчид session-д нэг удаа автоматаар сануулна.
        if (sub.isPro && sessionStorage.getItem(AUTO_SHOWN_KEY) !== "1") {
          sessionStorage.setItem(AUTO_SHOWN_KEY, "1");
          setOpen(true);
        }
      })
      .catch(() => {
        /* төлөв тодорхойгүй бол чимээгүй өнгөрнө */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const showNotice = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const value = useMemo(
    () => ({ locked, staff, isPro, showNotice }),
    [locked, staff, isPro, showNotice],
  );

  return (
    <ReadingLockContext.Provider value={value}>
      {children}
      {open && typeof document !== "undefined" ? createPortal(<NoticeDialog isPro={isPro} onClose={close} />, document.body) : null}
    </ReadingLockContext.Provider>
  );
}

function NoticeDialog({ isPro, onClose }: { isPro: boolean; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reading-unlock-title"
    >
      <div
        className={`w-full max-w-md rounded-2xl border bg-ink-900 p-5 shadow-2xl ${
          isPro ? 'border-amber-500/40' : 'border-brand/40'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isPro ? 'bg-amber-500/15 text-amber-300' : 'bg-brand/15 text-brand'
              }`}
            >
              {isPro ? <BookOpen className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
            </span>
            <div>
              <h2
                id="reading-unlock-title"
                className="font-display text-lg font-semibold text-mist-50"
              >
                {isPro ? 'Өгүүллэгүүд түр хаалттай байна' : 'Унших эрх VIP багцад багтана'}
              </h2>
              {isPro ? (
                <p className="mt-2 text-sm leading-relaxed text-mist-400">
                  Бүх өгүүллэгийг бэлтгэж байгаа тул одоогоор уншиж болохгүй.
                  <span className="font-semibold text-amber-300">
                    {' '}
                    9 сарын 14-ний 15:00 цагт
                  </span>{' '}
                  унших эрх нээгдэнэ. Таны VIP эрх энэ хугацаанд хэвийн хадгалагдана.
                </p>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-mist-400">
                  Өгүүллэгүүдийг унших эрх зөвхөн VIP багцтай хэрэглэгчдэд нээлттэй.
                  VIP багцаа аваад бүх өгүүллэг, бүлгийг бүрэн ашиглаарай.
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-mist-400 hover:bg-ink-800 hover:text-mist-50"
            aria-label="Хаах"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          {isPro ? (
            <Button type="button" className="w-full py-2.5" onClick={onClose}>
              Ойлголоо
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                className="flex-1 py-2.5"
                onClick={onClose}
              >
                Болих
              </Button>
              <Link
                href="/billing"
                onClick={onClose}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
              >
                <Sparkles className="h-4 w-4" />
                VIP авах
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
