'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
  resetPasswordSchema,
  ResetPasswordFormValues,
} from '@/lib/auth-schemas';
import { requestPasswordReset, resetPassword } from '@/lib/services';
import { getApiErrorMessage } from '@/lib/api-error';
import { toast } from '@/store/toast-store';

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);

  const requestForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const [showPassword, setShowPassword] = useState(false);

  const onRequestSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    try {
      await requestPasswordReset(values.email);
      setEmail(values.email);
      setStep('reset');
      toast.info('И-мэйл хаяг бүртгэлтэй бол баталгаажуулах код илгээгдлээ');
    } catch (err) {
      setServerError(getApiErrorMessage(err, 'Код илгээхэд алдаа гарлаа. Дахин оролдоно уу.'));
    }
  };

  const onResendCode = async () => {
    setServerError(null);
    try {
      await requestPasswordReset(email);
      toast.info('Код дахин илгээгдлээ');
    } catch (err) {
      setServerError(getApiErrorMessage(err, 'Код илгээхэд алдаа гарлаа. Дахин оролдоно уу.'));
    }
  };

  const onResetSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    try {
      await resetPassword(email, values.code, values.newPassword);
      toast.success('Нууц үг амжилттай солигдлоо. Дахин нэвтэрнэ үү.');
      router.push('/login');
    } catch (err) {
      setServerError(getApiErrorMessage(err, 'Код буруу эсвэл хугацаа дууссан байна'));
    }
  };

  if (step === 'request') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h1 className="font-display text-2xl font-semibold text-mist-50">Нууц үгээ мартсан уу?</h1>
        <p className="mt-2 text-sm text-mist-300">
          И-мэйл хаягаа оруулбал баталгаажуулах код илгээнэ.
        </p>

        <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="mt-8 space-y-5">
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
            error={requestForm.formState.errors.email?.message}
            {...requestForm.register('email')}
          />

          <Button type="submit" isLoading={requestForm.formState.isSubmitting} className="w-full">
            Код авах
          </Button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <h1 className="font-display text-2xl font-semibold text-mist-50">Баталгаажуулах код</h1>
      <p className="mt-2 text-sm text-mist-300">
        <span className="text-mist-100">{email}</span> хаяг руу илгээсэн 6 оронтой кодоо болон шинэ
        нууц үгээ оруулна уу.
      </p>

      <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="mt-8 space-y-5">
        {serverError && (
          <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <Input
          label="Баталгаажуулах код"
          type="text"
          inputMode="numeric"
          placeholder="123456"
          maxLength={6}
          autoComplete="one-time-code"
          error={resetForm.formState.errors.code?.message}
          {...resetForm.register('code')}
        />

        <div className="relative">
          <Input
            label="Шинэ нууц үг"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            error={resetForm.formState.errors.newPassword?.message}
            {...resetForm.register('newPassword')}
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

        <Input
          label="Шинэ нууц үг давтах"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="new-password"
          error={resetForm.formState.errors.confirmPassword?.message}
          {...resetForm.register('confirmPassword')}
        />

        <Button type="submit" isLoading={resetForm.formState.isSubmitting} className="w-full">
          Нууц үг солих
        </Button>

        <div className="flex items-center justify-between text-xs text-mist-400">
          <button type="button" onClick={() => setStep('request')} className="hover:text-mist-200">
            ← И-мэйл хаяг солих
          </button>
          <button type="button" onClick={onResendCode} className="text-brand hover:text-brand-hover">
            Код дахин авах
          </button>
        </div>
      </form>
    </motion.div>
  );
}
