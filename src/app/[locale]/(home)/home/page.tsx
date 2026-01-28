import { QuickTips } from "@/app/[locale]/(main)/_components/QuickTips";

import { Metadata } from "next";

import { CategoryLinks } from "../../(main)/_components/CategoryLinks";
import {
  DailyChallenge,
  UnauthenticatedDailyChallenge,
} from "../../(main)/_components/DailyChallenge";
import { Grounding } from "../../(main)/panic-emergency/_components/Grounding/Grounding";
import { BoxBreathing } from "../../(main)/panic-emergency/_components/BoxBreathing/BoxBreathing";
import { PositiveReminder } from "../../(main)/panic-emergency/_components/PositiveReminder/PositiveReminder";
import { getTranslations } from "next-intl/server";
import { SignInOverlayButton } from "@/components/SignInOverlayButton/SignInOverlayButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getUser } from "@/lib/auth/auth-helpers";
import {
  MomentLogButton,
  UnauthenticatedMomentLogButton,
} from "../../(main)/_components/MomentLogButton";

export default async function Home() {
  const auth = await getUser();
  const t = await getTranslations("home");
  return (
    <div className="space-y-6 px-3">
      <div className="grid items-start gap-4">
        <Accordion
          type="single"
          collapsible
          className="w-full rounded-3xl border-gray-400 bg-gray-200 px-4 shadow-md"
        >
          <AccordionItem value="disclaimer-1">
            <AccordionTrigger>
              {t("disclaimer.accordionTitle")}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>{t("disclaimer.alertTitle")}</AlertTitle>
                <AlertDescription>
                  <p className="text-sm font-light">{t("disclaimer.text")}</p>
                </AlertDescription>
              </Alert>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      {auth ? (
        <>
          <div>
            <DailyChallenge />
          </div>
          <div className="">
            <MomentLogButton />
          </div>
        </>
      ) : (
        <SignInOverlayButton>
          <div>
            <UnauthenticatedDailyChallenge />
          </div>
          <div className="">
            <UnauthenticatedMomentLogButton />
          </div>
        </SignInOverlayButton>
      )}
      <div>
        <div className="">
          <h4 className="text-md font-semibold">
            {t("quicktools.main.title")}
          </h4>
          <p className="text-xs font-thin">{t("quicktools.main.subtitle")}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <BoxBreathing />
          <Grounding />
          {/* <PositiveReminder /> */}
        </div>
      </div>
      <div>
        <CategoryLinks />
      </div>
      <div className="pb-11">
        <QuickTips />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Home",
};
