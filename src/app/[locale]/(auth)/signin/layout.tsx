import { BottomNav } from "@/components/BottomNav/BottomNav";
import { SignInHeader } from "@/components/Header/SignInHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="background-color: var(--color-background) m-auto max-w-115">
      <SignInHeader />
      <div className="flex min-h-screen grow flex-col bg-[#f6d298]">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
