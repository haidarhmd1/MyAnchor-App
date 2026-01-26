"use client";

import { Sheet } from "react-modal-sheet";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import MomentLogForm from "./MomentLogForm";

export const NewMomentLogEntryButton = ({}: {}) => {
  const t = useTranslations("momentLog.newEntry");
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(true);
        }}
        className={cn("mt-4 border border-dashed shadow-sm")}
        aria-label={t("ariaOpen")}
      >
        <CardContent className="flex flex-row px-0">
          <div className="relative h-full w-full p-3.5 sm:p-4">
            <div className="flex items-center">
              <h3 className="text-md truncate font-medium text-black">
                {t("title")}
              </h3>

              <div
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/35 shadow-inner backdrop-blur-[2px]"
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
            <MomentLogForm callback={() => setOpen(false)} />
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
};
