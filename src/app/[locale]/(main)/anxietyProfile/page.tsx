import { Metadata } from "next";
import AnxietyScreenerForm from "./AnxietyScreeningForm";
import { prisma } from "../../../../../lib/prisma";
import { DerivedAnxietyProfile } from "./_components/helpers/types";
import { AnxietyResultResponse } from "@/lib/ai/anxietyProfile/types";
import { AnxietyScreeningInput } from "./_components/helpers/schema";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInOverlayButton } from "@/components/SignInOverlayButton/SignInOverlayButton";
import { HeartHandshake } from "lucide-react";
import { getUser } from "@/lib/auth/auth-helpers";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

async function getServerAnxietyProfileEntry(userId: string): Promise<{
  id: string | null;
  input: AnxietyScreeningInput | null;
  result: AnxietyResultResponse | null;
  profile: DerivedAnxietyProfile | null;
}> {
  const res = await prisma.anxietyProfileEntry.findFirst({
    where: {
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
      input: true,
      result: true,
      derivedProfile: true,
    },
  });

  return {
    id: res ? (res.id as string) : null,
    input: res ? (res.input as AnxietyScreeningInput) : null,
    profile: res ? (res.derivedProfile as DerivedAnxietyProfile) : null,
    result: res ? (res.result as AnxietyResultResponse) : null,
  };
}

const UnauthenticatedAnxietyProfile = async () => {
  const t = await getTranslations("anxietyScreening");

  return (
    <section className="bg-background text-foreground space-y-4 px-4 py-4">
      <Card className="border-border/60 rounded-3xl shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
                {t("header.eyebrow")}
              </p>
            </div>
            <Badge variant="secondary">{t("header.badge")}</Badge>
          </div>

          <div>
            <Progress value={14} className="h-2" />
            <p className="text-muted-foreground mt-2 text-xs">
              {t("header.stepProgress", {
                current: 1,
                total: 7,
              })}
            </p>
          </div>
        </CardHeader>
      </Card>
      <Card className="border-border/60 rounded-3xl shadow-sm">
        <CardHeader>
          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
            <HeartHandshake className="h-5 w-5" />
          </div>

          <CardTitle className="text-2xl">{t("intro.title")}</CardTitle>

          <CardDescription>{t("intro.description")}</CardDescription>
        </CardHeader>
        <SignInOverlayButton>
          <CardContent className="text-foreground/90 space-y-4 text-sm leading-6">
            <div className="rounded-2xl border p-4">
              {t("intro.points.honestAnswers")}
            </div>

            <div className="rounded-2xl border p-4">
              {t("intro.points.safety")}
            </div>

            <div className="rounded-2xl border p-4">
              {t("intro.points.result")}
            </div>
          </CardContent>
        </SignInOverlayButton>
      </Card>
    </section>
  );
};

export default async function Page() {
  const user = await getUser();

  if (!user) {
    return <UnauthenticatedAnxietyProfile />;
  }

  const anxietyProfileEntry = await getServerAnxietyProfileEntry(user.userId);

  const hasAlreadyFilledForm =
    anxietyProfileEntry.id !== null &&
    anxietyProfileEntry.input !== null &&
    anxietyProfileEntry.profile !== null &&
    anxietyProfileEntry.result !== null;

  return (
    <section className="bg-background text-foreground py-4">
      <div className="mx-auto w-full max-w-2xl">
        <AnxietyScreenerForm
          id={anxietyProfileEntry.id}
          anxietyResult={anxietyProfileEntry.result}
          input={anxietyProfileEntry.input}
          profile={anxietyProfileEntry.profile}
          hasAlreadyFilledForm={hasAlreadyFilledForm}
        />
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Moment Log",
};
