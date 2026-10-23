"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock3, ListChecks, Lock, ShieldCheck } from "lucide-react";
import { formatMnt } from "@/lib/billing-services";
import { getPlacementConfig, type PlacementConfig } from "@/lib/placement-services";

/** Нүүр хуудасны "Түвшин тогтоох тест" хэсэг — үнэ, асуултын тоо API-аас */
export function PlacementTestSection() {
  const [config, setConfig] = useState<PlacementConfig | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPlacementConfig()
      .then((c) => {
        if (!cancelled) setConfig(c);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const count = config?.questionCount ?? 40;
  const minutes = config?.estimatedMinutes ?? 15;
  const price = config ? formatMnt(config.priceMnt) : null;

  return (
    <section id="placement-test" className="border-t border-ink-700 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs uppercase tracking-widest text-brand">Түвшин тогтоох тест</p>
        <h2 className="mb-4 font-display text-3xl font-semibold text-mist-50">Та яг ямар түвшинд байгаагаа мэдэх үү?</h2>
        <p className="mb-12 max-w-2xl text-mist-300">
          Бүртгүүлэлгүй {count} асуулттай тест өгөөд A1-ээс C1 хүртэлх түвшингээ тогтоо. Үр дүнд нь дүрэм, үгийн сан, унших
          чадварын задаргаа, асуулт бүрийн тайлбар, яг хаанаас эхлэх зөвлөмж багтана.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-ink-700 bg-ink-800 p-6 sm:p-8">
            <ul className="space-y-4">
              {[
                { icon: ListChecks, title: `${count} асуулт · 5 түвшин`, desc: "Дүрэм, үгийн сан, унших даалгавар шатлан хэцүүснэ" },
                { icon: Clock3, title: `${minutes} орчим минут`, desc: "Хугацааны хязгааргүй — зогсоогоод дараа үргэлжлүүлж болно" },
                { icon: ShieldCheck, title: "Нэвтрэх шаардлагагүй", desc: "Шууд эхэлнэ, хариулт таны төхөөрөмж дээр хадгалагдана" },
                {
                  icon: Lock,
                  title: price ? `Үр дүн нээх — ${price}` : "Үр дүнг QPay-ээр нээнэ",
                  desc: "QPay-ээр төлөөд түвшин, задаргаа, тайлбарыг шууд харна",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/15">
                    <Icon className="h-4 w-4 text-brand" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-mist-50">{title}</p>
                    <p className="mt-0.5 text-sm text-mist-400">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/placement-test"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-hover"
            >
              Тест эхлүүлэх <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Үр дүнгийн жишээ харагдац */}
          <div className="rounded-2xl border border-ink-700 bg-ink-800 p-6 sm:p-8">
            <p className="mb-1 text-xs uppercase tracking-widest text-mist-500">Жишээ үр дүн</p>
            <h3 className="mb-5 font-display text-lg font-semibold text-mist-50">Төлсний дараа ийм үр дүн гарна</h3>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-brand/40 bg-brand/15 font-display text-2xl font-semibold text-brand">
                B1
              </div>
              <div>
                <p className="font-display text-base font-semibold text-mist-50">B1 — Дунд шат</p>
                <p className="text-xs text-mist-400">Intermediate · 26/40 (65%)</p>
              </div>
            </div>
            <ul className="mt-5 space-y-2">
              {[
                { band: "A1", correct: 8, passed: true },
                { band: "A2", correct: 7, passed: true },
                { band: "B1", correct: 6, passed: true },
                { band: "B2", correct: 3, passed: false },
                { band: "C1", correct: 2, passed: false },
              ].map((b) => (
                <li key={b.band} className="flex items-center gap-3 text-xs">
                  <span className={`w-7 font-display font-semibold ${b.band === "B1" ? "text-brand" : "text-mist-300"}`}>{b.band}</span>
                  <span className="flex flex-1 gap-1">
                    {Array.from({ length: 8 }, (_, i) => (
                      <span key={i} className={`h-2 flex-1 rounded-sm ${i < b.correct ? "bg-brand" : "bg-ink-600"}`} />
                    ))}
                  </span>
                  <span className="w-12 text-right tabular-nums text-mist-400">
                    {b.correct}/8 {b.passed && <Check className="inline h-3 w-3 text-success" />}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 text-xs">
              {[
                ["Дүрэм", 70],
                ["Үгийн сан", 60],
                ["Унших", 60],
              ].map(([label, pct]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-20 text-mist-300">{label}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700">
                    <span className="block h-full rounded-full bg-success" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="w-9 text-right tabular-nums text-mist-400">{pct}%</span>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-xl border border-brand/20 bg-brand/5 p-3 text-xs leading-5 text-mist-300">
              + 40 асуулт бүрийн зөв хариулт, монгол тайлбар, суралцах зөвлөмж
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
