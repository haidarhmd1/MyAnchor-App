import { CardContainer } from "@/components/Card/Card";
import { exerciseList } from "@/common/const/content";
import { getTranslations } from "next-intl/server";

export const Exercises = async () => {
  const t = await getTranslations();
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
              className="mr-2 h-16 w-16 rounded-md"
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
};
