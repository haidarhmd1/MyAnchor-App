"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AudioWaveform,
  Book,
  House,
  SquareActivity,
  LucideIcon,
  BookA,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

type NavKey = "home" | "education" | "momentLog" | "exercises" | "exposure";

type NavLinkProps = {
  href: "/home" | "/education" | "/exercises" | "/exposure" | "/momentLog";
  labelKey: NavKey;
  icon: LucideIcon;
  partial?: boolean;
};

function stripLocale(pathname: string) {
  const locales = routing.locales as readonly string[];
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) return "/";

  const maybeLocale = parts[0];
  if (locales.includes(maybeLocale)) {
    const rest = parts.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }

  return pathname;
}

const NavLink = ({
  href,
  labelKey,
  icon: Icon,
  partial = true,
}: NavLinkProps) => {
  const t = useTranslations("bottomNav");
  const pathname = usePathname();

  const path = stripLocale(pathname);
  const isRoot = href === "/home";

  const active = isRoot
    ? path === "/" || path === "/home"
    : partial
      ? path === href || path.startsWith(`${href}/`)
      : path === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "m-2 flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-xs transition-colors outline-none",
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:text-foreground",
        "focus-visible:ring-ring/70 focus-visible:ring-2",
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5",
          active ? "text-primary stroke-[2.2]" : "stroke-[1.8]",
        )}
      />

      <span className={cn(active ? "font-medium" : "font-normal")}>
        {t(labelKey)}
      </span>

      <span
        className={cn(
          "block h-0.5 w-6 rounded-full transition-opacity",
          active ? "bg-primary opacity-100" : "opacity-0",
        )}
        aria-hidden
      />
    </Link>
  );
};

export const BottomNav = () => {
  return (
    <nav
      className="border-border bg-background/90 sticky bottom-0 z-50 grid h-16 w-full grid-cols-5 border-t backdrop-blur-md"
      aria-label="Primary"
    >
      <NavLink href="/home" labelKey="home" icon={House} partial={false} />
      <NavLink href="/education" labelKey="education" icon={Book} />
      <NavLink href="/momentLog" labelKey="momentLog" icon={BookA} />
      <NavLink href="/exercises" labelKey="exercises" icon={SquareActivity} />
      <NavLink href="/exposure" labelKey="exposure" icon={AudioWaveform} />
    </nav>
  );
};
