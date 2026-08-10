import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <AuthLayout
      footerText="Бүртгэлгүй юу?"
      footerLinkText="Бүртгүүлэх"
      footerLinkHref="/register"
    >
      <LoginForm />
    </AuthLayout>
  );
}
