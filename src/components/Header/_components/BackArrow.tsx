"use client";

import { MoveLeft, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export const BackArrow = () => {
  const locale = useLocale();
  const router = useRouter();

  const isRtl = locale.startsWith("ar");

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className={cn(
        "inline-flex items-center justify-center rounded-xl p-2 transition-colors",
        "text-muted-foreground hover:text-foreground hover:bg-muted",
        "focus-visible:ring-ring/70 focus-visible:ring-2 focus-visible:outline-none",
      )}
    >
      {isRtl ? (
        <MoveRight className="h-5 w-5" />
      ) : (
        <MoveLeft className="h-5 w-5" />
      )}
    </button>
  );
};
