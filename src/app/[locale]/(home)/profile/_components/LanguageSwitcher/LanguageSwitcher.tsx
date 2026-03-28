"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCALES = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "ar", label: "العربية" },
  { value: "ar-LB", label: "لبناني (عربي)" },
] as const;

export function LanguageSwitcher({
  variant = "normal",
}: {
  variant?: "xs" | "normal";
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (nextLocale: string) => {
    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    router.replace(href, { locale: nextLocale });
  };

  const isCompact = variant === "xs";

  return (
    <Select value={locale} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "bg-card text-card-foreground border-border rounded-md shadow-sm",
          "data-placeholder:text-muted-foreground",
          isCompact ? "h-9 min-w-9 gap-2 px-3 text-sm" : "h-10 w-40 gap-2 px-4",
        )}
        aria-label="Language switcher"
      >
        <Languages
          className={cn(
            "text-muted-foreground shrink-0",
            isCompact ? "h-4 w-4" : "h-4 w-4",
          )}
        />
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="bg-popover text-popover-foreground border-border rounded-2xl border shadow-lg">
        {LOCALES.map((l) => (
          <SelectItem key={l.value} value={l.value}>
            {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
