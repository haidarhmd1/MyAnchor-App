import { CardContainer } from "@/components/Card/Card";
import { exerciseList } from "@/common/const/content";
import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

export async function Exercises() {
  const locale = await getLocale();
  const t = await getTranslations();
  const isRtl = locale.startsWith("ar");

  return (
    <section className="space-y-6">
      {exerciseList.map((exercise) => (
        <CardContainer
          key={exercise.id}
          link={`/exercises/${exercise.id}`}
          className="mb-4 animate-[fadeUp_.35s_ease-out_both] border-none shadow-sm will-change-transform active:scale-[0.98] motion-reduce:animate-none"
          title={t(exercise.titleKey)}
          description={t(exercise.descriptionKey)}
          icon={
            <div
              className={cn(
                "bg-card h-16 w-16 shrink-0 rounded-2xl",
                isRtl ? "ml-2" : "mr-2",
              )}
              style={{
                backgroundImage: `url(${exercise.imgSrc})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            />
          }
        />
      ))}
    </section>
  );
}
