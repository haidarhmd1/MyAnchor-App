"use client";

import { LogIn } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function SignInButton({ className }: { className?: string }) {
  return (
    <Link
      href="/signin"
      aria-label="Sign in"
      className={cn(
        "border-border bg-card text-card-foreground flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm transition",
        "hover:bg-muted focus-visible:ring-ring/70 focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
    >
      <LogIn className="h-5 w-5" strokeWidth={1.5} />
    </Link>
  );
}
