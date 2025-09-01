import { CardContainer } from "@/components/Card/Card";
import { TodaysFocus } from "@/app/(main)/_components/TodaysFocus";
import { categories } from "@/common/const/links";
import { EmergencyButton } from "./_components/EmergencyButton";
import { QuickTips } from "@/app/(main)/_components/QuickTips";
import { InspirationForToday } from "./_components/InspirationForToday";
import { Metadata } from "next";
import { JournalButton } from "./_components/JournalButton";
import { DailyChallenge } from "./_components/DailyChallenge";

export default async function Home() {
  return (
    <div className="space-y-6 px-4">
      <div className="pt-6">
        <DailyChallenge />
      </div>
      <div className="">
        <EmergencyButton />
      </div>
      <div>
        <TodaysFocus />
      </div>
      <div>
        <JournalButton />
      </div>
      <div className="grid grid-cols-1 gap-0">
        {categories.map((c) => (
          <CardContainer
            key={c.id}
            title={c.title}
            description={c.description}
            link={c.link}
            className="mb-2 min-h-[92px]"
          />
        ))}
      </div>
      <div>
        <InspirationForToday />
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
