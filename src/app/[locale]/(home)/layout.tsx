import { BottomNav } from "@/components/BottomNav/BottomNav";
import { SignInButton } from "@/components/SignInButton/SignInButton";
import { isUserAuthenticated } from "@/lib/auth/auth-helpers";
import { CircleUser } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "./profile/_components/LanguageSwitcher/LanguageSwitcher";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isUserAuth = await isUserAuthenticated();
  return (
    <div className="m-auto max-w-1150">
      <header className="flex min-h-16 items-center justify-between px-4 py-4">
        <h6 className="text-center font-bold">MyAnchor</h6>

        <div className="flex items-center">
          <LanguageSwitcher variant="xs" />
          {!isUserAuth ? (
            <SignInButton />
          ) : (
            <Link href="/profile">
              <CircleUser strokeWidth={1} />
            </Link>
          )}
        </div>
      </header>
      <div className="min-h-screen">{children}</div>
      <BottomNav />
    </div>
  );
}
