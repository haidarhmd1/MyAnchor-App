import { CardContainer } from "@/components/Card/Card";
import { exerciseList } from "@/common/const/content";
import { getLocale, getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";

export async function Exercises() {
  const locale = await getLocale();
  const t = await getTranslations();
  const isRtl = locale.includes("ar");
  return (
    <div className="my-4">
      {exerciseList.map((exercise) => (
        <CardContainer
          link={`/exercises/${exercise.id}`}
          className="mb-4 animate-[fadeUp_.35s_ease-out_both] shadow-md will-change-transform motion-reduce:animate-none"
          key={exercise.id}
          title={t(exercise.titleKey)}
          icon={
            <div
              className={cn("h-16 w-16 rounded-md", isRtl ? "ml-2" : "mr-2")}
              style={{
                backgroundImage: `url(${exercise.imgSrc})`,
                backgroundPosition: "center",
                backgroundSize: "contain",
              }}
            />
          }
          description={t(exercise.descriptionKey)}
        />
      ))}
    </div>
  );
}
