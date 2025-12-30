import { BottomNav } from "@/components/BottomNav/BottomNav";
import { Header } from "@/components/Header/Header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto max-w-[4600px]">
      <Header />
      <div className="min-h-screen">{children}</div>
      <BottomNav />
    </div>
  );
}
