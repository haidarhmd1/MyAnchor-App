import { Lexend } from "next/font/google";
import "./globals.css";
import TanstackQueryProviders from "./providers";
import { Toaster } from "sonner";
import { authCheck } from "@/lib/auth/auth-helpers";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await authCheck();

  return (
    <html lang="en">
      <body
        className={`${lexend.variable} typography background-color: var(--color-background) antialiased`}
      >
        <TanstackQueryProviders>{children}</TanstackQueryProviders>
        <Toaster />
      </body>
    </html>
  );
}
