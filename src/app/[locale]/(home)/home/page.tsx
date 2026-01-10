import { QuickTips } from "@/app/[locale]/(main)/_components/QuickTips";

import { Metadata } from "next";

import { CategoryLinks } from "../../(main)/_components/CategoryLinks";
import { DailyChallenge } from "../../(main)/_components/DailyChallenge";
import { Grounding } from "../../(main)/panic-emergency/_components/Grounding/Grounding";
import { BoxBreathing } from "../../(main)/panic-emergency/_components/BoxBreathing/BoxBreathing";
import { PositiveReminder } from "../../(main)/panic-emergency/_components/PositiveReminder/PositiveReminder";
import { getTranslations } from "next-intl/server";
import { JournalButton } from "../../(main)/_components/JournalButton";

export default async function Home() {
  const t = await getTranslations("home");
  return (
    <div className="space-y-6 px-3">
      <div className="pt-4">
        <JournalButton />
      </div>
      <div>
        <DailyChallenge />
      </div>
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
