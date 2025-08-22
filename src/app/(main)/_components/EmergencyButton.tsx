import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Link from "next/link";

export function EmergencyButton() {
  return (
    <Link
      href="panic-emergency"
      style={{
        display: "contents",
      }}
    >
      <div className="mb-3 flex justify-center">
        <Card
          className={cn(
            "w-full cursor-pointer border-red-50 bg-red-50 px-2 py-4 transition-all duration-300 hover:border-red-600 hover:bg-red-100 hover:shadow-lg active:scale-[0.99]",
          )}
        >
          <CardContent className="p-0">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 transition-transform duration-300 group-hover:scale-105">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-red-700">Having a Panic Attack?</h2>
                <p className="text-sm text-red-600">
                  Press the button and take a deep breaths, you are safe
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
