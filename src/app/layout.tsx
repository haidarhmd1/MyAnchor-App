import { Lexend } from "next/font/google";
import "./globals.css";
import TanstackQueryProviders from "./providers";
import { Toaster } from "sonner";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
