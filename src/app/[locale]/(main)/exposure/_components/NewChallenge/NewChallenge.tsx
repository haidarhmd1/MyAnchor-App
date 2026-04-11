import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Award, BadgePlus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { StartChallengeBtn } from "./StartChallengeBtn";
import { prisma } from "../../../../../../../lib/prisma";
import { ChallengeStatus } from "@/generated/prisma/enums";

const baseCardClassName = cn(
  "mt-4 border border-border shadow-sm transition-all",
  "hover:-translate-y-px",
  "focus-within:ring-2 focus-within:ring-ring/70",
  "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
);

export const NewChallenge = async () => {
  const t = await getTranslations("exposure.newChallenge");

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

  if (!latestChallenge) {
    return (
      <Link href="/exposure/challenge" className="block">
        <Card
          className={cn(
            baseCardClassName,
            "bg-card hover:bg-muted/50 border-dashed",
            "active:scale-[0.98]",
          )}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <div className="bg-accent text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
              <BadgePlus className="h-5 w-5" />
            </div>

            <p className="text-foreground text-sm font-medium">
              {t("start.cta")}
            </p>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (latestChallenge.status === ChallengeStatus.NOT_STARTED) {
    return (
      <StartChallengeBtn
        challengeId={latestChallenge.id}
        pathToRevalidate="/exposure"
      />
    );
  }

  if (latestChallenge.status === ChallengeStatus.STARTED) {
    return (
      <Link
        href={`/exposure/challenge/${latestChallenge.id}`}
        className="block focus:outline-none"
        aria-label={t("pending.aria")}
      >
        <Card
          className={cn(
            baseCardClassName,
            "bg-accent border-primary/20 active:scale-[0.98]",
          )}
          aria-label={t("pending.aria")}
        >
          <CardContent className="flex items-start gap-4 p-4 sm:p-5">
            <div className="text-primary shrink-0">
              <Award className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="space-y-1">
              <h5 className="text-muted-foreground text-sm leading-none font-medium">
                {t("pending.title")}
              </h5>
              <h4 className="text-foreground text-base font-semibold">
                {t("pending.subtitle")}
              </h4>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return null;
};

export const UnauthenticatedNewChallenge = async () => {
  const t = await getTranslations("exposure.newChallenge");

  return (
    <Card
      className={cn(
        baseCardClassName,
        "bg-card mt-4 border-dashed active:scale-[0.98]",
      )}
    >
      <CardContent className="flex items-center gap-3 p-4">
        <div className="bg-accent text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
          <BadgePlus className="h-5 w-5" />
        </div>

        <p className="text-foreground text-sm font-medium">{t("start.cta")}</p>
      </CardContent>
    </Card>
  );
};
