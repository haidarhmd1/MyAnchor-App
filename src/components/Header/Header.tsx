import { CircleUserRound } from "lucide-react";
import { BackArrow } from "./_components/BackArrow";
import { Link } from "@/i18n/navigation";

export function Header({
  title = "MyAnchor App",
  // right,
}: {
  title?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b bg-white/95 px-4 py-4 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="flex items-center">
        <BackArrow />
      </div>

      <h6 className="absolute left-1/2 -translate-x-1/2 text-center font-medium">
        {title}
      </h6>

      <div className="flex items-center">
        {/* {right ?? <div className="w-6" />} */}
        <Link href="/profile">
          <CircleUserRound />
        </Link>
        {/* <SignOutButton /> */}
      </div>
    </header>
  );
}
