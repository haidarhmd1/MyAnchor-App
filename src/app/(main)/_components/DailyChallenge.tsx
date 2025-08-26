import { Card, CardContent } from "@/components/ui/card";
import { Award, BadgePlus, CheckCheck } from "lucide-react";
import Link from "next/link";

export enum DailyChallengeStatus {
  Pending = "Pending",
  NotStarted = "NotStarted",
  Finished = "Finished",
}

type Props = {
  status?: DailyChallengeStatus; // optional: defaults to NotStarted
};

export const DailyChallenge = ({
  status = DailyChallengeStatus.Pending,
}: Props) => {
  const variants = {
    [DailyChallengeStatus.Pending]: {
      href: "/exposure/planner/result",
      icon: <Award className="h-5 w-5" aria-hidden="true" />,
      title: "Daily Challenge Pending",
      subtitle: "Did you complete your daily challenge?",
      cardClass:
        "border-2 border-dashed border-amber-300 bg-amber-100 hover:border-amber-400",
      linkable: true,
    },
    [DailyChallengeStatus.NotStarted]: {
      href: "/exposure/planner",
      icon: <BadgePlus className="h-5 w-5" aria-hidden="true" />,
      title: "Still not set up a daily challenge?",
      subtitle: "Start a new Challenge",
      cardClass: "border-2 border-cyan-300 bg-cyan-100 hover:border-cyan-400",
      linkable: true,
    },
    [DailyChallengeStatus.Finished]: {
      href: undefined,
      icon: <CheckCheck className="h-5 w-5" aria-hidden="true" />,
      title: "Daily Challenge Done",
      subtitle: "Amazing!",
      cardClass: "border-2 border-green-300 bg-green-100",
      linkable: false,
    },
  } as const;

  const v = variants[status] ?? variants[DailyChallengeStatus.NotStarted];

  const Inner = (
    <Card
      className={[
        "group rounded-3xl shadow-sm transition-colors focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2",
        v.cardClass,
      ].join(" ")}
      role={v.linkable ? "link" : undefined}
      aria-label={v.title}
    >
      <CardContent className="flex items-start gap-4 p-4 sm:p-5">
        <div className="text-foreground/80 shrink-0">{v.icon}</div>
        <div className="space-y-1">
          <h5 className="text-foreground/80 text-sm leading-none font-light">
            {v.subtitle}
          </h5>
          <h4 className="text-base font-semibold">{v.title}</h4>
        </div>
      </CardContent>
    </Card>
  );

  if (v.linkable && v.href) {
    return (
      <Link
        href={v.href}
        className="block focus:outline-none"
        aria-label={v.title}
      >
        {Inner}
      </Link>
    );
  }

  return Inner;
};
