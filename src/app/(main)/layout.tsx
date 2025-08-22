import { BottomNav } from "@/components/BottomNav/BottomNav";
import { Header } from "@/components/Header/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="min-h-screen">{children}</div>
      <BottomNav />
    </>
  );
}
