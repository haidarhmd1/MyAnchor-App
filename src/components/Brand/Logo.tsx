import Image from "next/image";
import { cn } from "@/lib/utils";

/** App-icon tile: the MyAnchor logo as provided (public/icons/original.png). */
export const LogoTile = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "relative inline-flex size-10 shrink-0 overflow-hidden rounded-[22%] shadow-sm ring-1 ring-white/10",
      className,
    )}
  >
    <Image
      src="/icons/original.png"
      alt=""
      fill
      sizes="96px"
      unoptimized
      priority
    />
  </span>
);

export const Logo = ({ className }: { className?: string }) => (
  <span
    className={cn("inline-flex items-center gap-2.5", className)}
    aria-label="MyAnchor"
    role="img"
  >
    <LogoTile className="size-9" />
    <span
      aria-hidden
      className="font-(family-name:--font-advent_pro) text-foreground text-2xl leading-none tracking-tight"
    >
      <span className="font-normal opacity-70">My</span>
      <span className="font-semibold">Anchor</span>
    </span>
  </span>
);
