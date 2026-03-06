"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  calculateEnrollmentProgress,
  formatDisplayDate,
  formatIntakeMonth,
  getEnrollmentConfigServerSnapshot,
  getEnrollmentConfigSnapshot,
  saveEnrollmentConfig,
  subscribeEnrollmentConfig,
  type EnrollmentConfig,
} from "@/lib/enrollment";

export default function DashboardPage() {
  const enrollmentConfig = useSyncExternalStore(
    subscribeEnrollmentConfig,
    getEnrollmentConfigSnapshot,
    getEnrollmentConfigServerSnapshot
  );
  const [draftForm, setDraftForm] = useState<EnrollmentConfig | null>(null);
  const [saved, setSaved] = useState(false);
  const form = draftForm ?? enrollmentConfig;

  const previewProgress = useMemo(
    () => calculateEnrollmentProgress(form.startDate, form.endDate),
    [form.startDate, form.endDate]
  );

  const onChange = (field: keyof EnrollmentConfig, value: string) => {
    setSaved(false);
    setDraftForm((prev) => ({ ...(prev ?? enrollmentConfig), [field]: value }));
  };

  const saveConfig = () => {
    saveEnrollmentConfig(form);
    setSaved(true);
    setDraftForm(null);
  };

  const resetDefault = () => {
    setDraftForm(getEnrollmentConfigServerSnapshot());
    setSaved(false);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-12 text-zinc-100">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-black">Enrollment Dashboard</h1>
          <Link
            href="/"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-bold transition hover:bg-zinc-700"
          >
            Landing руу буцах
          </Link>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-300">
              Intake сар
            </span>
            <input
              type="month"
              value={form.intakeMonth}
              onChange={(e) => onChange("intakeMonth", e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 font-semibold"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-300">
                Бүртгэл эхлэх огноо
              </span>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => onChange("startDate", e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 font-semibold"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-300">
                Бүртгэл хаагдах огноо
              </span>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => onChange("endDate", e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 font-semibold"
              />
            </label>
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 p-4">
          <p className="font-black text-cyan-200">
            Preview: {formatIntakeMonth(form.intakeMonth)}
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-300">
            Хаагдах огноо: {formatDisplayDate(form.endDate)}
          </p>
          <div className="mt-3 h-4 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-500"
              style={{ width: `${previewProgress}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-bold text-zinc-200">{previewProgress}%</p>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveConfig}
            className="rounded-xl bg-yellow-400 px-5 py-3 font-black text-zinc-900 transition hover:bg-yellow-300"
          >
            Хадгалах
          </button>
          <button
            type="button"
            onClick={resetDefault}
            className="rounded-xl bg-zinc-800 px-5 py-3 font-black text-zinc-100 transition hover:bg-zinc-700"
          >
            Default болгох
          </button>
        </div>

        {saved ? (
          <p className="mt-4 text-sm font-bold text-emerald-300">
            Амжилттай хадгалагдлаа. Landing page дээр шинэчлэгдэнэ.
          </p>
        ) : null}
      </div>
    </main>
  );
}
