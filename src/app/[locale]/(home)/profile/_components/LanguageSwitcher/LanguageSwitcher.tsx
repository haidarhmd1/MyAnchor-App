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
];

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

    // sets cookie + updates URL
    router.replace(href, { locale: nextLocale });
  };
  const isRtl = locale.includes("ar");
  return (
    <Select value={locale} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          variant === "normal" ? "w-40" : isRtl ? "ml-2" : "mr-2",
          "rounded-full",
        )}
      >
        <Languages />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map((l) => (
          <SelectItem key={l.value} value={l.value}>
            {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
