import { TodaysFocus } from "@/app/(main)/_components/TodaysFocus";

import { EmergencyButton } from "./_components/EmergencyButton";
import { QuickTips } from "@/app/(main)/_components/QuickTips";

import { Metadata } from "next";

import { CategoryLinks } from "./_components/CategoryLinks";

export default async function Home() {
  return (
    <div className="space-y-6 px-4">
      <div className="pt-6">
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
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Home",
};
