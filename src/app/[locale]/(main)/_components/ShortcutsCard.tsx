"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type ShortcutsCardTone = "primary" | "secondary" | "accent";

export type ShortcutsCardProps = {
  title?: string;
  subtitle?: string;
  tone?: ShortcutsCardTone;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  onOpen?: () => void;
  className?: string;
};

const sizeStyles = {
  xs: {
    container: "min-h-[4.5rem]",
    title: "text-base",
    subtitle: "text-xs",
    iconWrap: "h-8 w-8",
    iconSize: 16,
    rounded: "rounded-3xl",
    padding: "p-3",
  },
  sm: {
    container: "min-h-28",
    title: "text-base",
    subtitle: "text-xs",
    iconWrap: "h-8 w-8",
    iconSize: 16,
    rounded: "rounded-3xl",
    padding: "p-3.5",
  },
  md: {
    container: "min-h-36",
    title: "text-lg",
    subtitle: "text-sm",
    iconWrap: "h-9 w-9",
    iconSize: 18,
    rounded: "rounded-3xl",
    padding: "p-4",
  },
  lg: {
    container: "min-h-44",
    title: "text-xl",
    subtitle: "text-base",
    iconWrap: "h-10 w-10",
    iconSize: 20,
    rounded: "rounded-3xl",
    padding: "p-4",
  },
} as const;

const toneStyles: Record<ShortcutsCardTone, string> = {
  primary: "from-primary to-accent",
  secondary: "from-secondary to-muted",
  accent: "from-accent to-secondary",
};

export default function ShortcutsCard({
  title,
  subtitle,
  children,
  tone = "primary",
  icon,
  size = "md",
  onOpen,
  className,
}: ShortcutsCardProps) {
  const S = sizeStyles[size];
  const Comp = onOpen ? "button" : "div";

  return (
    <Comp
      {...(onOpen
        ? {
            type: "button" as const,
            onClick: onOpen,
            "aria-label": `${title ?? ""}${subtitle ? `, ${subtitle}` : ""}`,
          }
        : {})}
      className={cn(
        "group text-foreground relative w-full overflow-hidden bg-linear-to-br shadow-sm select-none",
        "transition will-change-transform active:scale-[0.98]",
        "focus-visible:ring-ring/70 focus:outline-none focus-visible:ring-2",
        S.rounded,
        S.container,
        S.padding,
        toneStyles[tone],
        className,
      )}
    >
      <div className="relative flex h-full items-start justify-between gap-3">
        <div className="min-w-0 pr-2 text-left">
          <h3
            className={cn(
              "text-foreground truncate leading-snug font-semibold",
              S.title,
            )}
          >
            {title}
          </h3>

          {subtitle && (
            <p
              className={cn(
                "text-muted-foreground mt-1 line-clamp-2",
                S.subtitle,
              )}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={cn(
            "bg-card/65 text-primary border-border/50 shrink-0 rounded-2xl border shadow-sm backdrop-blur-sm",
            "flex items-center justify-center",
            S.iconWrap,
          )}
          aria-hidden
        >
          {icon ?? <Sparkles size={S.iconSize} strokeWidth={2.1} />}
        </div>
      </div>

      {children ? <div className="relative mt-3">{children}</div> : null}
    </Comp>
  );
}
