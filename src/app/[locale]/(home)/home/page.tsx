import { QuickTips } from "@/app/[locale]/(main)/_components/QuickTips";
import { Metadata } from "next";
import { CategoryLinks } from "../../(main)/_components/CategoryLinks";
import {
  DailyChallenge,
  UnauthenticatedDailyChallenge,
} from "../../(main)/_components/DailyChallenge";
import { Grounding } from "../../(main)/panic-emergency/_components/Grounding/Grounding";
import { BoxBreathing } from "../../(main)/panic-emergency/_components/BoxBreathing/BoxBreathing";
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
    <div className="text-foreground mt-8 space-y-8 px-3 pb-11">
      <div className="grid items-start gap-4">
        <Accordion
          type="single"
          collapsible
          className="surface-soft w-full rounded-2xl shadow-sm"
        >
          <AccordionItem value="disclaimer-1" className="border-none">
            <AccordionTrigger className="text-foreground px-4 py-4 text-left text-sm font-semibold hover:no-underline">
              {t("disclaimer.accordionTitle")}
            </AccordionTrigger>

            <AccordionContent className="text-foreground px-4 pb-4 text-balance">
              <div className="flex flex-col gap-4">
                <Alert className="border-destructive/20 bg-destructive/10 text-foreground">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertTitle className="text-sm font-semibold">
                    {t("disclaimer.alertTitle")}
                  </AlertTitle>
                  <AlertDescription>
                    <p className="text-muted-foreground text-sm leading-6">
                      {t("disclaimer.text")}
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {auth ? (
        <div className="space-y-8">
          <div>
            <DailyChallenge />
          </div>
          <div>
            <MomentLogButton />
          </div>
        </div>
      ) : (
        <SignInOverlayButton>
          <div className="space-y-8">
            <div>
              <UnauthenticatedDailyChallenge />
            </div>
            <div>
              <UnauthenticatedMomentLogButton />
            </div>
          </div>
        </SignInOverlayButton>
      )}

      <section className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-foreground text-base font-semibold tracking-tight">
            {t("quicktools.main.title")}
          </h4>
          <p className="text-muted-foreground text-sm">
            {t("quicktools.main.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <BoxBreathing />
          <Grounding />
        </div>
      </section>

      <section>
        <CategoryLinks />
      </section>

      <section>
        <QuickTips />
      </section>
    </div>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Home",
};
