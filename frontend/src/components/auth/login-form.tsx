"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, MonitorSmartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, LoginFormValues } from "@/lib/auth-schemas";
import { login, loginReplace, getMe, needsLearningStyleSurvey } from "@/lib/services";
import { useAuthStore } from "@/store/auth-store";
import {
  AuthResponse,
  EMAIL_NOT_VERIFIED,
  SESSION_LIMIT_REACHED,
  SessionLimitError,
} from "@/types/auth";
import { safeNextPath } from "@/lib/safe-next";
import { DeviceSessionList } from "@/components/auth/device-session-list";

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  // Төхөөрөмжийн лимит дүүрсэн — хэрэглэгч аль төхөөрөмжөөс гарахаа сонгоно
  const [limitError, setLimitError] = useState<SessionLimitError | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [replacing, setReplacing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const finishLogin = async (data: AuthResponse) => {
    setSession(data.user, data.accessToken);
    const me = await getMe();
    const profile = me.profile;
    const next = safeNextPath(new URLSearchParams(window.location.search).get("next"));
    // Onboarding-ийн судалгааг нэвтрэхээс өмнө бөглөсөн бол next=/onboarding ирж, хариулт тухайн хэрэглэгч дээр хадгалагдана
    if (!profile?.onboardingCompleted) router.push("/onboarding");
    else if (next) router.push(next);
    else if (needsLearningStyleSurvey(profile)) router.push("/learning-style?next=/reading");
    else router.push("/reading");
  };

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const data = await login(values.email, values.password);
      await finishLogin(data);
    } catch (err: any) {
      const status = err?.response?.status;
      const body = err?.response?.data as
        | { code?: string; email?: string; message?: string }
        | undefined;
      if (status === 403 && body?.code === EMAIL_NOT_VERIFIED) {
        // Нууц үг зөв, и-мэйл баталгаажаагүй — backend шинэ код илгээсэн.
        router.push(`/verify-email?email=${encodeURIComponent(body.email ?? values.email)}`);
        return;
      }
      if (status === 409 && body?.code === SESSION_LIMIT_REACHED) {
        setSelected(new Set());
        setLimitError(body as SessionLimitError);
        return;
      }
      setServerError(body?.message ?? "Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const onReplace = async () => {
    if (!limitError) return;
    setReplacing(true);
    setServerError(null);
    try {
      const data = await loginReplace(limitError.ticket, Array.from(selected));
      await finishLogin(data);
    } catch (err: any) {
      const status = err?.response?.status;
      const body = err?.response?.data as SessionLimitError | { message?: string } | undefined;
      if (status === 409 && body && "code" in body && body.code === SESSION_LIMIT_REACHED) {
        // Хангалттай төхөөрөмж хаагаагүй — шинэчлэгдсэн жагсаалт, шинэ ticket
        setSelected(new Set());
        setLimitError(body);
        setServerError(body.message);
      } else if (status === 401) {
        // Ticket-ийн хугацаа дууссан — эхнээс нь
        setLimitError(null);
        setServerError("Хугацаа дууссан байна. Дахин нэвтэрнэ үү.");
      } else {
        setServerError(body?.message ?? "Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
      }
    } finally {
      setReplacing(false);
    }
  };

  if (limitError) {
    // Хамгийн багадаа хэдийг хаах хэрэгтэйг тооцно (backend эцсийн шалгалтыг хийнэ)
    const needed = Math.max(1, limitError.sessions.length - limitError.limits.maxDevices + 1);
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/30 bg-brand/10 text-brand">
          <MonitorSmartphone className="h-5 w-5" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-mist-50">Төхөөрөмжийн лимит дүүрсэн</h1>
        <p className="mt-2 text-sm leading-6 text-mist-300">{limitError.message}</p>
        <p className="mt-1 text-xs text-mist-500">
          Хамгийн ихдээ {limitError.limits.maxDevices} төхөөрөмж · дор хаяж {needed} төхөөрөмжөөс гарна
        </p>

        {serverError && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <DeviceSessionList
          className="mt-5"
          sessions={limitError.sessions}
          selectedIds={selected}
          onSelect={toggle}
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            className="w-full"
            isLoading={replacing}
            disabled={selected.size < needed}
            onClick={onReplace}
          >
            Сонгосноос гараад нэвтрэх
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={replacing}
            onClick={() => {
              setLimitError(null);
              setServerError(null);
            }}
          >
            Болих
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
      <h1 className="font-display text-2xl font-semibold text-mist-50">Тавтай морил</h1>
      <p className="mt-2 text-sm text-mist-300">Сурах замаа үргэлжлүүлэхийн тулд нэвтэрнэ үү.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        {serverError && (
          <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <Input
          label="И-мэйл"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="relative">
          <Input
            label="Нууц үг"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-[34px] text-mist-400 hover:text-mist-200"
            tabIndex={-1}
            aria-label={showPassword ? "Нууц үг нуух" : "Нууц үг харуулах"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link href="/register" className="text-sm text-brand hover:text-brand-hover">
            Бүртгүүлэх
          </Link>
        </div>
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Нэвтрэх
        </Button>
      </form>
    </motion.div>
  );
}
