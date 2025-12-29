"use client";

import { Anchor } from "lucide-react";
import { useState } from "react";
import { Sheet } from "react-modal-sheet";
import { useTranslations } from "next-intl";

export const PhysicalAnchor = () => {
  const t = useTranslations("panicEmergency.physicalAnchor");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => setIsOpen(true)}
        className="flex transform space-x-4 rounded-[22px] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition will-change-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 active:scale-[0.99]"
      >
        <div className="flex space-x-4">
          <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
            <Anchor className="self-center" />
          </div>
          <div className="flex flex-col text-left">
            <h4>{t("card.title")}</h4>
            <p className="text-sm font-extralight">{t("card.subtitle")}</p>
          </div>
        </div>
      </div>

      <Sheet detent="content" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content className="p-4">
            <div className="space-y-8">
              <section>
                <h2 className="my-4">{t("sections.meaning.title")}</h2>
                <p>{t("sections.meaning.p1")}</p>
              </section>

              <section>
                <h2 className="my-4">{t("sections.how.title")}</h2>
                <div className="space-y-3">
                  <p>{t("sections.how.steps.1")}</p>
                  <p>{t("sections.how.steps.2")}</p>
                  <p>{t("sections.how.steps.3")}</p>
                  <p>{t("sections.how.steps.4")}</p>
                  <p>{t("sections.how.steps.5")}</p>
                </div>
              </section>

              <section>
                <h2 className="my-4">{t("sections.why.title")}</h2>
                <div className="space-y-3">
                  <p>{t("sections.why.points.1")}</p>
                  <p>{t("sections.why.points.2")}</p>
                  <p>{t("sections.why.points.3")}</p>
                </div>
              </section>
            </div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </div>
  );
};
