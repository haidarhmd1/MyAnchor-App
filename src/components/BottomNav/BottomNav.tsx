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
  /** If true, consider any deeper path under href as active (e.g. /education/*) */
  partial?: boolean;
};

function stripLocale(pathname: string) {
  // pathname could be: /en/education/slug or /education/slug (depending on setup)
  const locales = routing.locales as readonly string[];
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) return "/";

  const maybeLocale = parts[0];
  if (locales.includes(maybeLocale)) {
    const rest = parts.slice(1).join("/");
    return "/" + rest; // "/" if empty
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
        "flex flex-col items-center justify-center gap-0.5 text-sm transition-colors outline-none",
        active ? "text-[#2E3D49]" : "text-[#2E3D49]/55 hover:text-[#2E3D49]",
        "focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-[#8AB6A9] focus-visible:ring-offset-2",
      )}
    >
      <Icon
        className={cn(
          "mb-0.5 h-5 w-5",
          active ? "stroke-[2.25]" : "stroke-[1.5]",
        )}
      />
      <span className={cn(active ? "font-medium" : "font-normal")}>
        {t(labelKey)}
      </span>

      <span
        className={cn(
          "mt-0.5 block h-0.5 w-6 rounded-full transition-opacity",
          active ? "bg-[#8AB6A9] opacity-100" : "opacity-0",
        )}
        aria-hidden
      />
    </Link>
  );
};

export const BottomNav = () => {
  return (
    <nav
      className="sticky bottom-0 z-50 grid h-16 w-full grid-cols-5 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
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
