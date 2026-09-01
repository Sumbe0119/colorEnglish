import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <AuthLayout footerText="Нууц үг мартсан уу?" footerLinkText="Сэргээх" footerLinkHref="/forgot-password">
      <LoginForm />
    </AuthLayout>
  );
}
