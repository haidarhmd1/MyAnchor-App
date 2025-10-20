"use client";

import React from "react";
import { Sparkles } from "lucide-react";

/**
 * iOS Shortcuts-style Card
 * ------------------------------------------------------
 * TailwindCSS + React component that mimics the look/feel
 * of the iOS Shortcuts app tiles.
 *
 * Props
 * - title: string (required)
 * - subtitle?: string
 * - gradient?: { from: string; to: string } (Tailwind color classes)
 * - icon?: React.ReactNode (defaults to <Sparkles />)
 * - size?: "sm" | "md" | "lg" (default: "md")
 * - onOpen?: () => void (tap/click on the card)
 * - onPlay?: () => void (primary action, bottom-left)
 * - onOptions?: () => void (ellipsis/menu, bottom-right)
 * - onShare?: () => void (optional secondary control)
 * - className?: string
 *
 * Accessibility
 * - Entire card is a button with role and keyboard handlers
 * - Focus ring adapted for keyboard users
 */

export type ShortcutsCardProps = {
  title?: string;
  subtitle?: string;
  gradient?: { from: string; to: string };
  icon?: React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  onOpen?: () => void;
  className?: string;
};

const sizeStyles = {
  sm: {
    container: "h-28",
    title: "text-base",
    subtitle: "text-xs",
    toolbarGap: "gap-1.5",
    iconWrap: "h-8 w-8",
    iconSize: 16,
    btn: "h-8 w-8",
  },
  md: {
    container: "h-36",
    title: "text-lg",
    subtitle: "text-sm",
    toolbarGap: "gap-2",
    iconWrap: "h-9 w-9",
    iconSize: 18,
    btn: "h-9 w-9",
  },
  lg: {
    container: "h-44",
    title: "text-xl",
    subtitle: "text-base",
    toolbarGap: "gap-2.5",
    iconWrap: "h-10 w-10",
    iconSize: 20,
    btn: "h-10 w-10",
  },
} as const;

export default function ShortcutsCard({
  title,
  subtitle,
  children,
  gradient = { from: "from-indigo-500", to: "to-violet-500" },
  icon,
  size = "md",
  onOpen,
  className = "",
}: ShortcutsCardProps) {
  const S = sizeStyles[size];

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${title}${subtitle ? ", " + subtitle : ""}`}
      onClick={() => onOpen?.()}
      onKeyDown={handleKeyDown}
      className={[
        // Shape & surface
        "group relative w-full overflow-hidden select-none",
        "rounded-[22px] shadow-[0_6px_18px_rgba(0,0,0,0.15)]",
        "bg-gradient-to-br",
        gradient.from,
        gradient.to,
        // Sizing
        S.container,
        // Interactions
        "transform transition will-change-transform",
        "active:scale-[0.99]",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40",
        className,
      ].join(" ")}
    >
      {/* Subtle noise & glossy overlay */}
      <div className="pointer-events-none absolute inset-0 [background-size:8px_8px] opacity-[0.15] mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />

      {/* Content */}
      <div className="relative h-full p-3.5 sm:p-4">
        {/* Top Row: Title + Glyph */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 pr-2">
            <h3
              className={`truncate leading-snug font-semibold text-white drop-shadow ${S.title}`}
            >
              {title}
            </h3>
            {subtitle && (
              <p className={`mt-0.5 text-white/80 drop-shadow ${S.subtitle}`}>
                {subtitle}
              </p>
            )}
          </div>

          <div
            className={`shrink-0 ${S.iconWrap} flex items-center justify-center rounded-xl bg-white/35 shadow-inner backdrop-blur-[2px]`}
            aria-hidden
          >
            <div className="text-white drop-shadow">
              {icon ?? <Sparkles size={S.iconSize} strokeWidth={2.25} />}
            </div>
          </div>
        </div>
        {children && children}
      </div>

      {/* Pressed sheen */}
      <div className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity duration-200 group-active:opacity-10" />
    </div>
  );
}
