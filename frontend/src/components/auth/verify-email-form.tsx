'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { AlertCircle, MailCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { verifyEmailSchema, VerifyEmailFormValues } from '@/lib/auth-schemas';
import { resendVerification, verifyEmail } from '@/lib/services';
import { getApiErrorMessage } from '@/lib/api-error';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/store/toast-store';

const RESEND_COOLDOWN_S = 60;

type VerifyEmailFormProps = {
  /** Query-гийн оронд ашиглах и-мэйл (onboarding дотор суулгахад) */
  email?: string;
  /** Өгвөл /onboarding руу шилжихгүй — session үүссэний дараа дуудагдана */
  onVerified?: () => void;
  /** Өгвөл "Бүртгэл рүү буцах" нь /register руу шилжихгүй */
  onBack?: () => void;
};

/** Бүртгүүлсний дараа и-мэйлээр ирсэн 6 оронтой кодыг оруулах алхам. */
export function VerifyEmailForm({ email, onVerified, onBack }: VerifyEmailFormProps = {}) {
  const router = useRouter();
  const params = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const emailFromQuery = email ?? params.get('email') ?? '';
  const [serverError, setServerError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: emailFromQuery, code: '' },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  const onSubmit = async (values: VerifyEmailFormValues) => {
    setServerError(null);
    try {
      const data = await verifyEmail(values.email, values.code);
      setSession(data.user, data.accessToken);
      toast.success('И-мэйл баталгаажлаа. Тавтай морил!');
      if (onVerified) onVerified();
      else router.push('/onboarding');
    } catch (err) {
      setServerError(getApiErrorMessage(err, 'Код буруу эсвэл хугацаа дууссан байна'));
    }
  };

  const onResend = async (email: string) => {
    if (!email) {
      setServerError('И-мэйл хаягаа оруулна уу');
      return;
    }
    setServerError(null);
    setResending(true);
    try {
      await resendVerification(email);
      toast.info('Код дахин илгээгдлээ. И-мэйлээ шалгаарай.');
      setCooldown(RESEND_COOLDOWN_S);
    } catch (err) {
      setServerError(getApiErrorMessage(err, 'Код илгээхэд алдаа гарлаа. Дахин оролдоно уу.'));
    } finally {
      setResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 text-brand">
        <MailCheck className="h-6 w-6" />
      </span>
      <h1 className="font-display text-2xl font-semibold text-mist-50">И-мэйлээ баталгаажуулна уу</h1>
      <p className="mt-2 text-sm text-mist-300">
        {emailFromQuery ? (
          <>
            <span className="text-mist-100">{emailFromQuery}</span> хаяг руу 6 оронтой код илгээлээ. Спам
            хавтсаа мөн шалгаарай.
          </>
        ) : (
          'Бүртгүүлсэн и-мэйл хаяг болон и-мэйлээр ирсэн 6 оронтой кодоо оруулна уу.'
        )}
      </p>

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
          readOnly={!!emailFromQuery}
          className={emailFromQuery ? 'opacity-70' : undefined}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Баталгаажуулах код"
          type="text"
          inputMode="numeric"
          placeholder="123456"
          maxLength={6}
          autoComplete="one-time-code"
          autoFocus
          className="text-center font-mono text-xl tracking-[0.4em]"
          error={errors.code?.message}
          {...register('code')}
        />

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Баталгаажуулах
        </Button>

        <div className="flex items-center justify-between text-xs text-mist-400">
          {onBack ? (
            <button type="button" onClick={onBack} className="hover:text-mist-200">
              ← Бүртгэл рүү буцах
            </button>
          ) : (
            <Link href="/register" className="hover:text-mist-200">
              ← Бүртгэл рүү буцах
            </Link>
          )}
          <button
            type="button"
            disabled={cooldown > 0 || resending}
            onClick={() => void onResend(getValues('email') || emailFromQuery)}
            className="text-brand hover:text-brand-hover disabled:cursor-not-allowed disabled:text-mist-500"
          >
            {cooldown > 0 ? `Код дахин авах (${cooldown}с)` : 'Код дахин авах'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
