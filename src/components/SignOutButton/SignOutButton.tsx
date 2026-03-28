"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTransition } from "react";
import { Spinner } from "../Spinner/Spinner";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
  callbackUrl?: string;
  className?: string;
  showLabel?: boolean;
};

export function SignOutButton({
  callbackUrl = "/home",
  className,
  showLabel = false,
}: Props) {
  const t = useTranslations("auth");
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={() => startTransition(() => signOut({ callbackUrl }))}
      className={cn(
        "border-border bg-card text-card-foreground hover:bg-muted rounded-2xl shadow-sm",
        "inline-flex items-center justify-center gap-2",
        showLabel ? "px-4 py-2" : "h-10 w-10 p-0",
        className,
      )}
    >
      {pending ? <Spinner /> : <LogOut className="h-4 w-4" />}

      {showLabel ? (
        <span>{pending ? t("signingOut") : t("signOut")}</span>
      ) : null}
    </Button>
  );
}
