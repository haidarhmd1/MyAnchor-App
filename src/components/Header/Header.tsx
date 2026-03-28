import { CircleUser } from "lucide-react";
import { BackArrow } from "./_components/BackArrow";
import { Link } from "@/i18n/navigation";
import { getUser } from "@/lib/auth/auth-helpers";
import { SignInButton } from "../SignInButton/SignInButton";
import { LanguageSwitcher } from "@/app/[locale]/(home)/profile/_components/LanguageSwitcher/LanguageSwitcher";

export async function Header({
  title = "MyAnchor",
}: {
  title?: string;
  right?: React.ReactNode;
}) {
  const isUserAuth = await getUser();

  return (
    <header className="bg-background/85 border-border sticky top-0 z-20 border-b px-4 py-1 backdrop-blur-md">
      <div className="flex min-h-16 items-center justify-between">
        <div className="flex items-center">
          <BackArrow />
        </div>

        {/* <h6 className="text-foreground text-center text-lg font-semibold tracking-tight">
          {title}
        </h6> */}

        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="xs" />

          {!isUserAuth ? (
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
  );
}
