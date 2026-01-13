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
import { isUserAuthenticated } from "@/lib/auth/auth-helpers";
import { SignInOverlayButton } from "@/components/SignInOverlayButton/SignInOverlayButton";

export default async function Home() {
  const isUserAuth = await isUserAuthenticated();
  const t = await getTranslations("home");
  return (
    <div className="space-y-6 px-3">
      {isUserAuth ? (
        <>
          <div className="pt-4">
            <JournalButton />
          </div>
          <div>
            <DailyChallenge />
          </div>
        </>
      ) : (
        <SignInOverlayButton>
          <div className="pt-4">
            <UnAuthenticatedJournalButton />
          </div>
          <div>
            <UnAuthenticatedDailyChallenge />
          </div>
        </SignInOverlayButton>
      )}
      <div>
        <div className="">
          <h4 className="text-md font-bold">{t("quicktools.main.title")}</h4>
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
