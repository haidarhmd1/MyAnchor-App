"use client";

import { useEffect, useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export const BackArrow = () => {
  const locale = useLocale();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isRtl = locale.includes("ar");

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1 text-[#2E3D49]/80 hover:bg-black/5 hover:text-[#2E3D49] focus:ring-2 focus:ring-[#8AB6A9] focus:outline-none",
        isRtl ? "pl-4" : "pr-4",
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
