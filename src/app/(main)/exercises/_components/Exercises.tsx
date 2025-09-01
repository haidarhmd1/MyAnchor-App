import { CardContainer } from "@/components/Card/Card";
import { exerciseList } from "@/common/const/content";

export const Exercises = () => {
  return (
    <div className="mx-4">
      {exerciseList.map((exercise) => (
        <CardContainer
          className="mb-4"
          key={exercise.id}
          title={exercise.title}
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
          description={exercise.description}
          link={`/exercises/${exercise.id}`}
        />
      ))}
    </div>
  );
};
