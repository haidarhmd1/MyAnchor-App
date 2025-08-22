"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AudioWaveform,
  Book,
  House,
  SquareActivity,
  LucideIcon,
  BookA,
} from "lucide-react";

type NavLinkProps = {
  href: "/" | "/education" | "/exercises" | "/exposure" | "/journal";
  label: string;
  icon: LucideIcon;
  /** If true, consider any deeper path under href as active (e.g. /education/*) */
  partial?: boolean;
};

const NavLink = ({ href, label, icon: Icon, partial = true }: NavLinkProps) => {
  const segments = useSelectedLayoutSegments();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Derive current top-level segment ("" for root)
  const currentTop = segments[0] ?? "";
  const currentPath = `/${currentTop}`;

  // Determine active state
  const isRoot = href === "/";
  const isActive = isRoot
    ? currentTop === "" // only root is active
    : partial
      ? currentPath === href // top segment match -> active for all subroutes
      : currentPath === href && segments.length <= 1; // exact section only

  // Until mounted, render neutral styles to avoid SSR/CSR mismatches
  const active = mounted && isActive;

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
        {label}
      </span>
      {/* subtle underline for active */}
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
      <NavLink href="/" label="Home" icon={House} partial={false} />
      <NavLink href="/education" label="Education" icon={Book} />
      <NavLink href="/journal" label="Journal" icon={BookA} />
      <NavLink href="/exercises" label="Exercises" icon={SquareActivity} />
      <NavLink href="/exposure" label="Exposure" icon={AudioWaveform} />
    </nav>
  );
};
