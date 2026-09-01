import type { Metadata } from 'next';
import { IBM_Plex_Mono, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/components/providers/auth-provider';
import { GuestGate } from '@/components/providers/guest-gate';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-ibm-plex-mono',
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ColorEnglish — Монгол хэлнээс Англи хэл сур',
  description:
    'Үг бүрийг өнгөөр ялгаж, өгүүлбэрийг бүхлээр нь ойлгоход тань туслах AI дэмжлэгтэй сургалт. A1-ээс B2 хүртэл.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${ibmPlexMono.variable} ${jetbrainsMono.variable}`}>
      <body>
        <AuthProvider>
          <GuestGate>{children}</GuestGate>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
