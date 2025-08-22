import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const PastChallenges = () => {
  return (
    <Card className={cn("mt-4 border-2 bg-white")}>
      <CardContent className="flex flex-row gap-2">
        <p>No Daily challenges yet done.</p>
      </CardContent>
    </Card>
  );
};
