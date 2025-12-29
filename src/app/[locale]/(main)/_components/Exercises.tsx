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
    <>
      <div className="flex h-[60px] flex-col items-start self-stretch pt-5 pb-3">
        <h2>{t("title")}</h2>
      </div>

      {exercises.map((e) => (
        <div key={e.id} className="mb-4">
          <CardContainer
            title={t(e.titleKey)}
            description={t(e.descriptionKey)}
            link={e.link}
          />
        </div>
      ))}
    </>
  );
};
