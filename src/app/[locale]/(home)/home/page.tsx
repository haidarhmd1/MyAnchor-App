import { QuickTips } from "@/app/[locale]/(main)/_components/QuickTips";

import { Metadata } from "next";

import { CategoryLinks } from "../../(main)/_components/CategoryLinks";
import {
  DailyChallenge,
  UnAuthenticatedDailyChallenge,
} from "../../(main)/_components/DailyChallenge";
import { Grounding } from "../../(main)/panic-emergency/_components/Grounding/Grounding";
import { BoxBreathing } from "../../(main)/panic-emergency/_components/BoxBreathing/BoxBreathing";
import { PositiveReminder } from "../../(main)/panic-emergency/_components/PositiveReminder/PositiveReminder";
import { getTranslations } from "next-intl/server";
import {
  JournalButton,
  UnAuthenticatedJournalButton,
} from "../../(main)/_components/JournalButton";
import { SignInOverlayButton } from "@/components/SignInOverlayButton/SignInOverlayButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JournalAnalytics } from "../../(main)/_components/JournalAnalytics";
import { getUser } from "@/lib/auth/auth-helpers";

export default async function Home() {
  const auth = await getUser();
  const t = await getTranslations("home");
  return (
    <div className="space-y-6 px-3">
      <div className="grid w-full max-w-xl items-start gap-4">
        <Accordion
          type="single"
          collapsible
          className="w-full rounded-3xl border-red-400 bg-red-200 px-4 shadow-md"
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
          <div className="">
            {/* <JournalAnalytics /> */}
            <JournalButton />
          </div>
          <div>
            <DailyChallenge />
          </div>
        </>
      ) : (
        <SignInOverlayButton>
          <div className="">
            <UnAuthenticatedJournalButton />
          </div>
          <div>
            <UnAuthenticatedDailyChallenge />
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
          <PositiveReminder />
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
