import { QuickTips } from "@/app/[locale]/(home)/home/_components/QuickTips";
import { Metadata } from "next";
import { CategoryLinks } from "./_components/CategoryLinks";
import {
  DailyChallenge,
  UnauthenticatedDailyChallenge,
} from "./_components/DailyChallenge";
import { Grounding } from "../../(main)/panic-emergency/_components/Grounding/Grounding";
import { BoxBreathing } from "../../(main)/panic-emergency/_components/BoxBreathing/BoxBreathing";
import { getTranslations } from "next-intl/server";
import { SignInOverlayButton } from "@/components/SignInOverlayButton/SignInOverlayButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Brain, Info } from "lucide-react";
import { getUser } from "@/lib/auth/auth-helpers";
import {
  MomentLogButton,
  UnauthenticatedMomentLogButton,
} from "./_components/MomentLogButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AnxietyProfileButtonCard } from "./_components/AnxietyProfileCardButton";

export default async function Home() {
  const auth = await getUser();
  const t = await getTranslations();

  return (
    <div className="text-foreground mt-3 space-y-2 px-3 pb-11">
      <div className="space-y-4">
        <div className="w-full">
          <Dialog>
            <DialogTrigger
              className="border-destructive w-full justify-between rounded-md border"
              asChild
            >
              <Button variant="ghost" className="bg-destructive/10 h-full">
                <p>{t("home.disclaimer.accordionTitle")}</p>
                <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-2xl">
                  <Info className="h-8 w-8" />
                </div>
              </Button>
            </DialogTrigger>

            <DialogContent className="text-foreground px-4 pb-4 text-balance sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>{t("home.disclaimer.accordionTitle")}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Alert className="border-destructive/20 bg-destructive/10 text-foreground">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertTitle className="text-sm font-semibold">
                    {t("home.disclaimer.alertTitle")}
                  </AlertTitle>
                  <AlertDescription>
                    <p className="text-muted-foreground text-sm leading-6">
                      {t("home.disclaimer.text")}
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <AnxietyProfileButtonCard />
      </div>
      <section className="mt-6 space-y-2">
        {auth ? (
          <>
            <div className="mx-2 p-2">
              <MomentLogButton />
            </div>
            <div>
              <DailyChallenge />
            </div>
          </>
        ) : (
          <SignInOverlayButton>
            <div className="space-y-2">
              <div className="mx-2 p-2">
                <UnauthenticatedMomentLogButton />
              </div>
              <div>
                <UnauthenticatedDailyChallenge />
              </div>
            </div>
          </SignInOverlayButton>
        )}
      </section>

      <section className="mt-8 space-y-4">
        <div className="space-y-1">
          <h4 className="text-foreground text-base font-semibold tracking-tight">
            {t("home.quicktools.main.title")}
          </h4>
          {/* <p className="text-muted-foreground text-sm">
            {t("home.quicktools.main.subtitle")}
          </p> */}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <BoxBreathing />
          <Grounding />
        </div>
      </section>

      <section className="mt-8">
        <CategoryLinks />
      </section>

      <section className="mt-8">
        <QuickTips />
      </section>
    </div>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Home",
};
