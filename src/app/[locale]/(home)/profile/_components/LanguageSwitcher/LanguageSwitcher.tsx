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

  return (
    <Select value={locale} onValueChange={onChange}>
      <SelectTrigger className={variant === "normal" ? "w-40" : "mr-2"}>
        <Languages />
        {variant === "normal" && <SelectValue />}
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
