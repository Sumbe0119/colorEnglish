'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerSchema, RegisterFormValues } from '@/lib/auth-schemas';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { AuthResponse } from '@/types/auth';

export function RegisterForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const password = watch('password') ?? '';
  const checks = [
    { label: 'Доод тал нь 8 тэмдэгт', valid: password.length >= 8 },
    { label: 'Том ба жижиг үсэг', valid: /(?=.*[a-z])(?=.*[A-Z])/.test(password) },
    { label: 'Дор хаяж 1 тоо', valid: /\d/.test(password) },
  ];

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', {
        firstName: values.firstName,
        email: values.email,
        password: values.password,
      });
      setSession(data.user, data.accessToken);
      router.push('/onboarding');
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message ?? 'Бүртгүүлэхэд алдаа гарлаа. Дахин оролдоно уу.',
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <h1 className="font-display text-2xl font-semibold text-mist-50">Бүртгэл үүсгэх</h1>
      <p className="mt-2 text-sm text-mist-300">
        2 минутын дотор бүртгүүлээд, өөрт тохирсон хичээлээ олоорой.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        {serverError && (
          <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <Input
          label="Нэр"
          type="text"
          placeholder="Болд"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register('firstName')}
        />

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
            autoComplete="new-password"
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

        {password.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {checks.map((c) => (
              <span
                key={c.label}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                  c.valid ? 'bg-success/10 text-success' : 'bg-ink-700 text-mist-400'
                }`}
              >
                {c.valid && <Check className="h-3 w-3" />}
                {c.label}
              </span>
            ))}
          </div>
        )}

        <Input
          label="Нууц үг давтах"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Бүртгүүлэх
        </Button>

        <p className="text-center text-xs text-mist-400">
          Бүртгүүлснээр та манай{' '}
          <a href="#" className="text-mist-300 underline hover:text-mist-100">
            үйлчилгээний нөхцөл
          </a>
          -ийг хүлээн зөвшөөрч байна.
        </p>
      </form>
    </motion.div>
  );
}
