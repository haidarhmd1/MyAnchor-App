import { CardContainer } from "@/components/Card/Card";

const exercises: {
  id: number;
  title: string;
  description: string;
  link: string;
}[] = [
  {
    id: 1,
    title: "Deep Breathing",
    description: "",
    link: "",
  },
  {
    id: 2,
    title: "Coping Strategies",
    description: "",
    link: "",
  },
  {
    id: 3,
    title: "Relaxation Techniques",
    description: "",
    link: "",
  },
  {
    id: 4,
    title: "Cognitive Techniques",
    description: "",
    link: "",
  },
  {
    id: 5,
    title: "Behavioral Techniques",
    description: "",
    link: "",
  },
];

export const Exercises = () => {
  return (
    <>
      <div className="flex h-[60px] flex-col items-start self-stretch pt-5 pb-3">
        <h2>Exercises</h2>
      </div>
      {exercises.map((e) => (
        <div key={e.id} className="mb-4">
          <CardContainer
            title={e.title}
            description={e.description}
            link={e.link}
          />
        </div>
      ))}
    </>
  );
};
