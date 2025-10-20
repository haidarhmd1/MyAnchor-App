import { Lexend } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./Provider";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${lexend.variable} typography background-color: var(--color-background) antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
