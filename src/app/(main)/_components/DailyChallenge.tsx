import { Card, CardContent } from "@/components/ui/card";
import { Award, BadgePlus, CheckCheck } from "lucide-react";
import Link from "next/link";

const isDailyChallengeDone: "pending" | "notStarted" | "finished" = "pending";

export const DailyChallenge = () => {
  switch (isDailyChallengeDone) {
    case "pending":
      return (
        <Link
          href="journal"
          style={{
            display: "contents",
          }}
        >
          <Card className="justify-start rounded-4xl border-2 border-dashed bg-amber-100 align-top shadow-md">
            <CardContent className="flex flex-row gap-4">
              <div className="shrink-0">
                <Award className="h-5 w-5 font-light" />
              </div>
              <div>
                <h5 className="font-light">
                  Did you complete your daily challenge?
                </h5>
                <h4>Daily Challenge Pending</h4>
              </div>
            </CardContent>
          </Card>
        </Link>
      );
    case "notStarted":
      return (
        <Link
          href="/exposure/planner"
          style={{
            display: "contents",
          }}
        >
          <Card className="justify-start rounded-4xl border-cyan-300 bg-cyan-100 align-top">
            <CardContent className="flex flex-row gap-4">
              <div className="shrink-0">
                <BadgePlus className="h-5 w-5 font-light" />
              </div>
              <div className="space-y-2">
                <h5 className="font-light">Start a new Challenge</h5>
                <h4>Still not set up a daily challenge?</h4>
              </div>
            </CardContent>
          </Card>
        </Link>
      );
    case "finished":
      return (
        <Card className="justify-start rounded-4xl border-2 border-green-300 bg-green-100 align-top shadow-md">
          <CardContent className="flex flex-row gap-4">
            <div className="shrink-0">
              <CheckCheck className="h-5 w-5 font-light" />
            </div>
            <div>
              <h5 className="font-light">Amazing!</h5>
              <h4>Daily Challenge Done</h4>
            </div>
          </CardContent>
        </Card>
      );
    default:
      return (
        <Link
          href="/exposure/planner"
          style={{
            display: "contents",
          }}
        >
          <Card className="justify-start rounded-4xl border-2 border-dashed bg-amber-100 align-top shadow-md">
            <CardContent className="flex flex-row gap-4">
              <div className="shrink-0">
                <Award className="h-5 w-5 font-light" />
              </div>
              <div>
                <h5 className="font-light">
                  Start a new Challenge either you can start right away or later
                  that day it.
                </h5>
                <h4>Still not set up a daily challenge?</h4>
              </div>
            </CardContent>
          </Card>
        </Link>
      );
  }
};
