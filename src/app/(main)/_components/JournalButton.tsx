import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookOpenCheck } from "lucide-react";
import Link from "next/link";

export function JournalButton() {
  return (
    <Link
      href="/journal"
      style={{
        display: "contents",
      }}
    >
      <div className="mb-3 flex justify-center">
        <Card
          className={cn(
            "w-full cursor-pointer rounded-2xl border-blue-50 bg-blue-50 py-4 transition-all duration-300 hover:shadow-lg",
          )}
        >
          <CardContent>
            <div className="flex flex-row items-center gap-4">
              <div className="shrink-0">
                <BookOpenCheck className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h5 className="font-light text-blue-500">Your daily journal</h5>
                <h4 className="text-blue-700">Journal</h4>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
