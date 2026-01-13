"use client";

import { Ear, Eye, Hand, HandFist, IceCream, Smile } from "lucide-react";
import { useState } from "react";
import { Sheet } from "react-modal-sheet";
import { useTranslations } from "next-intl";

export const Grounding = () => {
  const t = useTranslations("panicEmergency.grounding");
  const [isOpen, setOpen] = useState(false);

  return (
    <div>
      <div
        className="h-28 min-h-24 transform rounded-2xl bg-white p-3 shadow-md transition will-change-transform active:scale-[0.98]"
        onClick={() => setOpen(true)}
      >
        {/* <div className="flex h-8 w-8 shrink-0 justify-center rounded-md bg-gray-200">
          <HandFist className="self-center" />
        </div> */}
        <div className="flex flex-col text-left">
          <h4 className="text-sm font-medium">{t("card.title")}</h4>
          <p className="text-xs font-extralight">{t("card.subtitle")}</p>
        </div>
      </div>

      <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content className="p-4">
            <div className="space-y-8">
              <div className="mb-8">{t("sheet.intro")}</div>

              <div className="flex space-x-4">
                <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
                  <Eye className="self-center" />
                </div>
                <div className="flex flex-col text-left">
                  <h4>{t("steps.see.title")}</h4>
                  <p className="text-sm font-extralight">
                    {t("steps.see.subtitle")}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
                  <Hand className="self-center" />
                </div>
                <div className="flex flex-col text-left">
                  <h4>{t("steps.touch.title")}</h4>
                  <p className="text-sm font-extralight">
                    {t("steps.touch.subtitle")}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
                  <Ear className="self-center" />
                </div>
                <div className="flex flex-col text-left">
                  <h4>{t("steps.hear.title")}</h4>
                  <p className="text-sm font-extralight">
                    {t("steps.hear.subtitle")}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
                  <Smile className="self-center" />
                </div>
                <div className="flex flex-col text-left">
                  <h4>{t("steps.smell.title")}</h4>
                  <p className="text-sm font-extralight">
                    {t("steps.smell.subtitle")}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
                  <IceCream className="self-center" />
                </div>
                <div className="flex flex-col text-left">
                  <h4>{t("steps.taste.title")}</h4>
                  <p className="text-sm font-extralight">
                    {t("steps.taste.subtitle")}
                  </p>
                </div>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </div>
  );
};
