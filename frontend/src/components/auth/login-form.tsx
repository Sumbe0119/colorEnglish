'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginSchema, LoginFormValues } from '@/lib/auth-schemas';
import { login, getMe } from '@/lib/services';
import { useAuthStore } from '@/store/auth-store';

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const data = await login(values.email, values.password);
      setSession(data.user, data.accessToken);
      const me = await getMe();
      const completed = (me as { profile?: { onboardingCompleted?: boolean } }).profile?.onboardingCompleted;
      router.push(completed ? '/reading' : '/onboarding');
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? 'Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
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
          {...register('email')}
        />

        <div className="relative">
          <Input
            label="Нууц үг"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-[34px] text-mist-400 hover:text-mist-200"
            tabIndex={-1}
            aria-label={showPassword ? 'Нууц үг нуух' : 'Нууц үг харуулах'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex justify-end">
          <a href="#" className="text-sm text-brand hover:text-brand-hover">
            Нууц үгээ мартсан уу?
          </a>
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Нэвтрэх
        </Button>
      </form>
    </motion.div>
  );
}
