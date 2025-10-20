"use client";

import { Sheet } from "react-modal-sheet";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Journal from "./Journal";
import { Taxonomy } from "@prisma/client";

export const NewJournalEntryButton = ({
  locationOptions,
  avoidanceReasons,
  symptomOptions,
}: {
  locationOptions: Taxonomy[];
  avoidanceReasons: Taxonomy[];
  symptomOptions: Taxonomy[];
}) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className={cn(
          "mt-8 border-2 border-dashed p-0 shadow-[0_6px_18px_rgba(0,0,0,0.15)]",
        )}
      >
        <CardContent className="flex flex-row px-0">
          {/* Content */}
          <div className="relative h-full w-full p-3.5 sm:p-4">
            {/* Top Row: Title + Glyph */}
            <div className="flex items-center">
              <h3
                className={`truncate align-middle leading-snug font-medium text-black drop-shadow`}
              >
                Create a new Journal Entry
              </h3>

              <div
                className={`ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/35 shadow-inner backdrop-blur-[2px]`}
                aria-hidden
              >
                <div className="text-black drop-shadow">
                  <Plus size={16} strokeWidth={2.25} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <Sheet.Container>
          <Sheet.Header className="bg-gray-50" />
          <Sheet.Content className="bg-gray-50 p-4">
            <Journal
              callback={() => setOpen(false)}
              locationOptions={locationOptions}
              avoidanceReasons={avoidanceReasons}
              symptomOptions={symptomOptions}
            />
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
};
