import { AuthLayout } from '@/components/auth/auth-layout';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout footerText="Санаанд орлоо оо?" footerLinkText="Нэвтрэх" footerLinkHref="/login">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
