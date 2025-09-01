import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { interoceptiveExposureGuide } from "@/common/const/content";

export const Information = () => {
  return (
    <div className="mt-4">
      <Accordion
        type="single"
        collapsible
        className="rounded-md border-1 bg-white p-2 px-6"
      >
        {interoceptiveExposureGuide.map((guide) => (
          <AccordionItem key={guide.id} value={`item-${guide.id}`}>
            <AccordionTrigger>{guide.title}</AccordionTrigger>
            <AccordionContent>
              {guide.description && <div>{guide.description}</div>}
              <ul>
                {guide.content.map((content) => (
                  <li key={content.id} className="mb-2 list-disc">
                    {content.text}
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
