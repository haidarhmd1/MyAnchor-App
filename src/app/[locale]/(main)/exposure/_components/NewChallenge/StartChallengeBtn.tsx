// components/StartChallengeCard.client.tsx
"use client";

import { useTransition } from "react";
import { startChallengeAction } from "../../challenge/action";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Award } from "lucide-react";
import { useTranslations } from "next-intl";

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
    <Card
      onClick={() =>
        startTransition(async () => {
          await startChallengeAction(challengeId, pathToRevalidate);
        })
      }
      className={cn(
        "group mt-4 border-2 border-dashed border-blue-300 bg-linear-to-br from-blue-100 to-blue-200",
        "shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition-all",
        "focus-within:ring-2 hover:-translate-y-px hover:border-blue-400",
        "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
      )}
      aria-label={t("notStarted.aria")}
    >
      <CardContent className="flex items-start gap-4 p-4 sm:p-5">
        <div className="text-foreground/80 shrink-0">
          <Award className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h5 className="text-foreground/80 text-sm leading-none font-light">
            {t("notStarted.title")}
          </h5>
          <h4 className="text-base font-semibold">
            {t("notStarted.subtitle")}
          </h4>
        </div>
      </CardContent>
    </Card>
  );
}
