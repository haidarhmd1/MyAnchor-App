import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { interoceptiveExposureGuide } from "@/common/const/content";
import { getTranslations } from "next-intl/server";

export const Information = async () => {
  const t = await getTranslations();
  return (
    <div className="mt-4">
      <Accordion
        type="single"
        collapsible
        className="rounded-4xl border bg-white p-2 px-6"
      >
        {interoceptiveExposureGuide.map((guide) => (
          <AccordionItem key={guide.id} value={`item-${guide.id}`}>
            <AccordionTrigger>{t(guide.titleKey)}</AccordionTrigger>
            <AccordionContent>
              {t(guide.descriptionKey) && <div>{t(guide.descriptionKey)}</div>}
              <ul>
                {guide.content.map((content) => (
                  <li key={content.id} className="mb-2 list-disc">
                    {t(content.textKey)}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
