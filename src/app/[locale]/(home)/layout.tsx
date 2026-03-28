import { BottomNav } from "@/components/BottomNav/BottomNav";
import { SignInButton } from "@/components/SignInButton/SignInButton";
import { getUser } from "@/lib/auth/auth-helpers";
import { CircleUser } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "./profile/_components/LanguageSwitcher/LanguageSwitcher";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getUser();

  return (
    <div className="bg-background text-foreground mx-auto min-h-screen max-w-287.5">
      <header className="border-border/60 bg-background/85 sticky top-0 z-30 border-b backdrop-blur-md">
        <div className="flex min-h-16 items-center justify-between px-4 py-4">
          <h6 className="text-foreground text-lg font-semibold tracking-tight">
            MyAnchor
          </h6>

          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="xs" />

            {!auth ? (
              <SignInButton />
            ) : (
              <Link
                href="/profile"
                className="border-border bg-card text-card-foreground hover:bg-muted focus-visible:ring-ring/70 flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm transition focus:outline-none focus-visible:ring-2"
                aria-label="Profile"
              >
                <CircleUser size={22} strokeWidth={1.25} />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-4rem)]">{children}</main>

      <BottomNav />
    </div>
  );
}
