import { Suspense } from 'react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { VerifyEmailForm } from '@/components/auth/verify-email-form';

export default function VerifyEmailPage() {
  return (
    <AuthLayout footerText="Бүртгэлтэй юу?" footerLinkText="Нэвтрэх" footerLinkHref="/login">
      {/* useSearchParams тул Suspense шаардлагатай */}
      <Suspense fallback={null}>
        <VerifyEmailForm />
      </Suspense>
    </AuthLayout>
  );
}
