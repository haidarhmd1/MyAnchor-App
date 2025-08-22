import { Card, CardContent } from "@/components/ui/card";
import { Link } from "lucide-react";

export const QuickJournal = () => {
  return (
    <Link
      href="/exposure/tracker"
      style={{
        display: "contents",
      }}
    >
      <Card className="border-none bg-linear-to-r/srgb from-indigo-500 to-teal-400 p-0">
        <CardContent className="p-6">
          <div className="space-y-3 pr-8">
            <p className="text-muted-foreground text-xs tracking-wider">
              Daily Journal
            </p>
            <p className="text-foreground leading-relaxed">
              Track your Exposure
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
