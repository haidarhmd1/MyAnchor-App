import { TodaysFocus } from "@/app/[locale]/(main)/_components/TodaysFocus";

import { EmergencyButton } from "../_components/EmergencyButton";
import { QuickTips } from "@/app/[locale]/(main)/_components/QuickTips";

import { Metadata } from "next";

import { CategoryLinks } from "../_components/CategoryLinks";
import { QuickAnalytics } from "../_components/QuickAnalytics";

export default async function Home() {
  return (
    <div className="px-4">
      <QuickAnalytics />
      <div className="space-y-6">
        <div className="pt-4">
          <EmergencyButton />
        </div>
        {/* <div className="pt-6">
        <DailyChallenge />
      </div> */}
        <div>
          <TodaysFocus />
        </div>
        {/* <div>
        <JournalButton />
      </div> */}
        <div className="my-12">
          <CategoryLinks />
        </div>
        {/* <div>
        <InspirationForToday />
      </div> */}
        <div className="pb-11">
          <QuickTips />
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Home",
};
