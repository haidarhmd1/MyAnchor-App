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
    <section className="space-y-4">
      <Accordion
        type="single"
        collapsible
        className="surface-soft rounded-2xl border-none px-4 shadow-sm"
      >
        {interoceptiveExposureGuide.map((guide) => {
          const description = t(guide.descriptionKey);

          return (
            <AccordionItem
              key={guide.id}
              value={`item-${guide.id}`}
              className="border-border"
            >
              <AccordionTrigger className="text-foreground text-left text-sm font-semibold hover:no-underline">
                {t(guide.titleKey)}
              </AccordionTrigger>

              <AccordionContent className="text-muted-foreground space-y-4 pb-4 text-sm leading-6">
                {description ? <div>{description}</div> : null}

                <ul className="space-y-2 ps-5">
                  {guide.content.map((content) => (
                    <li key={content.id} className="list-disc">
                      {t(content.textKey)}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
};
