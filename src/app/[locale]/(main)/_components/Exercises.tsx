import { CardContainer } from "@/components/Card/Card";
import { getTranslations } from "next-intl/server";

type ExerciseItem = {
  id: number;
  titleKey: string;
  descriptionKey: string;
  link: string;
};

const exercises: ExerciseItem[] = [
  {
    id: 1,
    titleKey: "items.deepBreathing.title",
    descriptionKey: "items.deepBreathing.description",
    link: "",
  },
  {
    id: 2,
    titleKey: "items.copingStrategies.title",
    descriptionKey: "items.copingStrategies.description",
    link: "",
  },
  {
    id: 3,
    titleKey: "items.relaxationTechniques.title",
    descriptionKey: "items.relaxationTechniques.description",
    link: "",
  },
  {
    id: 4,
    titleKey: "items.cognitiveTechniques.title",
    descriptionKey: "items.cognitiveTechniques.description",
    link: "",
  },
  {
    id: 5,
    titleKey: "items.behavioralTechniques.title",
    descriptionKey: "items.behavioralTechniques.description",
    link: "",
  },
];

export const Exercises = async () => {
  const t = await getTranslations("exercisesPage");

  return (
    <section className="space-y-4">
      <div className="space-y-1 pt-2">
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">
          {t("title")}
        </h2>
      </div>

      <div className="space-y-4">
        {exercises.map((exercise) => (
          <CardContainer
            key={exercise.id}
            title={t(exercise.titleKey)}
            description={t(exercise.descriptionKey)}
            link={exercise.link}
          />
        ))}
      </div>
    </section>
  );
};
