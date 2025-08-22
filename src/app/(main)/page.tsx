import { CardContainer } from "@/components/Card/Card";
import { TodaysFocus } from "@/app/(main)/_components/TodaysFocus";
import { categories } from "@/const/links";
import { EmergencyButton } from "./_components/EmergencyButton";
import { QuickTips } from "@/app/(main)/_components/QuickTips";
import { InspirationForToday } from "./_components/InspirationForToday";
import { Metadata } from "next";

export default function Home() {
  return (
    <div className="space-y-9 px-4">
      <div>
        <TodaysFocus />
      </div>
      <div>
        <EmergencyButton />
      </div>
      <div className="grid grid-cols-1 gap-2">
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
