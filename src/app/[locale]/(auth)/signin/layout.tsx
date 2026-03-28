import { BottomNav } from "@/components/BottomNav/BottomNav";
import { SignInHeader } from "@/components/Header/SignInHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground mx-auto min-h-screen max-w-287.5">
      <SignInHeader />

      <main className="min-h-[calc(100vh-4rem)] pb-24">
        <div className="bg-card mx-3 mt-3 flex min-h-full flex-col rounded-4xl shadow-sm">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
