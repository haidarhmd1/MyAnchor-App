import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { SearchCheckIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { AnxietyProfileCardHeader } from "./AnxietyProfileCardHeader";
import { Badge } from "@/components/ui/badge";
import { getLocale, getTranslations } from "next-intl/server";
import { AnxietyResultResponse } from "@/lib/ai/anxietyProfile/types";
import { DerivedAnxietyProfile } from "@/app/[locale]/(main)/anxietyProfile/_components/helpers/types";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export const AnxietyProfileCard = async ({
  anxietyProfile,
}: {
  anxietyProfile: {
    id: string;
    result: AnxietyResultResponse;
    derivedProfile: DerivedAnxietyProfile;
  };
}) => {
  const locale = await getLocale();
  const isRtl = locale.startsWith("ar");
  const t = await getTranslations();

  const focusLabel = anxietyProfile.derivedProfile.cbtFormulation.focus.replace(
    /_/g,
    " ",
  );
  return (
    <>
      <div className="bg-border h-px w-full" />
      <div className="space-y-4">
        <Card className="border-border/60 rounded-3xl shadow-sm">
          <AnxietyProfileCardHeader id={anxietyProfile.id!} />
          <CardHeader>
            <div className="flex flex-row justify-between self-center">
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
                <SearchCheckIcon className="h-5 w-5" />
              </div>
              <div className="space-x-4">
                {anxietyProfile.derivedProfile.impairment
                  .clinicallyMeaningful ? (
                  <Badge variant="outline">
                    {t(
                      "anxietyScreening.anxietyResult.actions.badges.meaningfulImpact",
                    )}
                  </Badge>
                ) : null}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-md font-bold">
              {t(
                "anxietyScreening.anxietyResult.actions.badges.possiblePattern",
                {
                  pattern: focusLabel ?? "",
                },
              )}
            </p>
            <p className="text-sm font-light">
              {anxietyProfile.result?.big_picture}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={"/anxietyProfile"} className="ml-auto">
              <Button>
                {t("common.viewInsights")}
                {isRtl ? (
                  <ArrowLeft className="mr-2 h-4 w-4" />
                ) : (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
