import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Award, BadgePlus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import prisma from "../../../../../../../lib/prisma";
import { ChallengeStatus } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";
import { StartChallengeBtn } from "./StartChallengeBtn";

export const NewChallenge = async () => {
  const t = await getTranslations("exposure.newChallenge");
  const locale = await getLocale();
  const latestChallenge = await prisma.challenge.findFirst({
    where: {
      deletedAt: null,
      status: { not: ChallengeStatus.FINISHED },
    },
    select: {
      id: true,
      status: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const isRtl = locale.includes("ar");

  if (!latestChallenge) {
    return (
      <Link href="/exposure/challenge" style={{ display: "contents" }}>
        <Card
          className={cn(
            "mt-4 border-2 border-dashed",
            "focus-within:ring-2 hover:-translate-y-px hover:border-gray-200",
            "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
          )}
        >
          <CardContent className="flex flex-row gap-2">
            {!isRtl && (
              <div className="shrink-0">
                <BadgePlus />
              </div>
            )}
            <p>{t("start.cta")}</p>
            {isRtl && (
              <div className="shrink-0">
                <BadgePlus />
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (latestChallenge.status === "NOT_STARTED") {
    return (
      <StartChallengeBtn
        challengeId={latestChallenge.id}
        pathToRevalidate="/exposure"
      />
    );
  }

  if (latestChallenge.status === "STARTED") {
    return (
      <Link
        href={`/exposure/challenge/${latestChallenge.id}`}
        className="focus:outline-none"
        style={{ display: "contents" }}
        aria-label={t("pending.aria")}
      >
        <Card
          className={cn(
            "group mt-4 border-2 border-dashed border-amber-300 bg-linear-to-br from-amber-100 to-amber-200",
            "shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition-all",
            "focus-within:ring-2 hover:-translate-y-px hover:border-amber-400",
            "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
          )}
          aria-label={t("pending.aria")}
        >
          <CardContent className="flex items-start gap-4 p-4 sm:p-5">
            <div className="text-foreground/80 shrink-0">
              <Award className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h5 className="text-foreground/80 text-sm leading-none font-light">
                {t("pending.title")}
              </h5>
              <h4 className="text-base font-semibold">
                {t("pending.subtitle")}
              </h4>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }
};

export const UnauthenticatedNewChallenge = async () => {
  const t = await getTranslations("exposure.newChallenge");
  return (
    <Card
      className={cn(
        "mt-4 border-2 border-dashed",
        "focus-within:ring-2 hover:-translate-y-px hover:border-gray-200",
        "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
      )}
    >
      <CardContent className="flex flex-row gap-2">
        <div className="shrink-0">
          <BadgePlus />
        </div>
        <p>{t("start.cta")}</p>
      </CardContent>
    </Card>
  );
};
