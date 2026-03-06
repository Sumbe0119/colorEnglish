import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-app-sans",
  subsets: ["latin", "cyrillic"],
});

const notoSansMono = Noto_Sans_Mono({
  variable: "--font-app-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Color English",
  description: "Color English англи хэлний сургалтын landing page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body
        className={`${notoSans.variable} ${notoSansMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
