import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Inter, Lexend } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";

import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "../Provider";
import { Viewport } from "next";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const viewPort: Viewport = {
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;

  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // const isRtl = locale === "ar";

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    // <html lang={locale} dir={isRtl ? "rtl" : "ltr"}>
    <html
      lang={locale}
      className="m-auto max-w-[460px] overscroll-contain scroll-smooth bg-white"
    >
      <body
        className={`${lexend.variable} bg-background font-inter text-foreground typography background-color: var(--color-background) min-h-dvh antialiased`}
      >
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
