import { BottomNav } from "@/components/BottomNav/BottomNav";
import { Header } from "@/components/Header/Header";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <div className="m-auto max-w-[4600px]">
      <Header />
      <div className="min-h-screen">{children}</div>
      <BottomNav />
    </div>
  );
}
