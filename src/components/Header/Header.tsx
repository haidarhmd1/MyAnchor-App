import { CircleUser, CircleUserRound } from "lucide-react";
import { BackArrow } from "./_components/BackArrow";
import { Link } from "@/i18n/navigation";
import { isUserAuthenticated } from "@/lib/auth/auth-helpers";
import { SignInButton } from "../SignInButton/SignInButton";
import { LanguageSwitcher } from "@/app/[locale]/(home)/profile/_components/LanguageSwitcher/LanguageSwitcher";

export async function Header({
  title = "MyAnchor App",
  // right,
}: {
  title?: string;
  right?: React.ReactNode;
}) {
  const isUserAuth = await isUserAuthenticated();
  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b bg-white/95 px-4 py-4 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="flex items-center">
        <BackArrow />
      </div>

      <h6 className="absolute left-1/2 -translate-x-1/2 text-center font-medium">
        {title}
      </h6>

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
  );
}
