import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Advent_Pro } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";

import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "../Provider";
import { Metadata, Viewport } from "next";

const adventPro = Advent_Pro({
  variable: "--font-advent_pro",
  subsets: ["latin"],
});

export const viewPort: Viewport = {
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export const metadata: Metadata = {
  title: "MyAnchor App",
  description:
    "MyAnchor helps you face fears with gentle, trackable exposures.",
  generator: "Next.js",
  // Next serves src/app/manifest.ts as /manifest.webmanifest
  manifest: "/manifest.webmanifest",
  keywords: [
    "mental health",
    "PTSD",
    "Anxiety",
    "Panic disorder",
    "CBT",
    "next-pwa",
  ],
  authors: [
    {
      name: "Haidar Hammoud",
      url: "https://www.linkedin.com/in/haidar-hammoud-775602124/",
    },
  ],
  icons: {
    icon: [
      { url: "/icons/favicon.ico" },
      { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
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
      className="m-auto max-w-115 overscroll-contain scroll-smooth bg-white"
    >
      <body
        className={`${adventPro.variable} bg-background font-inter text-foreground typography background-color: var(--color-background) min-h-dvh antialiased`}
      >
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
