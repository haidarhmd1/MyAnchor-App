import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BadgePlus } from "lucide-react";
import Link from "next/link";

export const NewChallenge = () => {
  return (
    <Link
      href="/exposure/planner"
      style={{
        display: "contents",
      }}
    >
      <Card className={cn("mt-4 border-2 border-dashed")}>
        <CardContent className="flex flex-row gap-2">
          <div className="shrink-0">
            <BadgePlus />
          </div>
          <p>
            Start a new Challenge either you can start right away or later that
            day it.
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
