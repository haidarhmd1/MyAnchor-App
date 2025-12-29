import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Lexend } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";

import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "../Provider";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;

  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const isRtl = locale === "ar";

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <body
        className={`${lexend.variable} typography background-color: var(--color-background) antialiased`}
      >
        <NextIntlClientProvider>
          {children}
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
