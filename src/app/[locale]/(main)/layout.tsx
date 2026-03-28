import { BottomNav } from "@/components/BottomNav/BottomNav";
import { Header } from "@/components/Header/Header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground m-auto flex min-h-dvh max-w-1150 flex-col">
      <Header />

      <main className="flex-1 px-4 pb-24">{children}</main>

      <BottomNav />
    </div>
  );
}
