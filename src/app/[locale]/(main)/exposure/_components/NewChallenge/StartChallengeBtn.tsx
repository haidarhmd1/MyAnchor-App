"use client";

import { useTransition } from "react";
import { startChallengeAction } from "../../challenge/action";
import { Award } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function StartChallengeBtn({
  challengeId,
  pathToRevalidate,
}: {
  challengeId: string;
  pathToRevalidate: string;
}) {
  const t = useTranslations("exposure.newChallenge");
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await startChallengeAction(challengeId, pathToRevalidate);
        })
      }
      disabled={isPending}
      aria-label={t("notStarted.aria")}
      className={cn(
        "group border-primary/20 bg-accent mt-4 w-full rounded-4xl border text-left shadow-sm transition-all",
        "hover:-translate-y-px hover:shadow-md",
        "focus-visible:ring-ring/70 focus:outline-none focus-visible:ring-2",
        "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
        "disabled:cursor-not-allowed disabled:opacity-70",
      )}
    >
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <div className="text-primary shrink-0">
          <Award className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <h5 className="text-muted-foreground text-sm leading-none font-medium">
            {t("notStarted.title")}
          </h5>
          <h4 className="text-foreground text-base font-semibold">
            {isPending ? t("actions.saving") : t("notStarted.subtitle")}
          </h4>
        </div>
      </div>
    </button>
  );
}
