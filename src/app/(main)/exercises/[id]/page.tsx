import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { exerciseList } from "@/const/content";
import { Lightbulb } from "lucide-react";
import { notFound } from "next/navigation";
import { Tracker } from "./_components/Tracker";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const exercise = exerciseList.find((e) => e.id === id);

  if (!exercise) return notFound();

  return (
    <>
      <div
        className="h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url(${exercise.imgSrc})`,
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      />
      <div className="p-4">
        <Alert variant="default" className="mb-4 rounded-4xl">
          <Lightbulb />
          <AlertTitle>{exercise.title}</AlertTitle>
          <AlertDescription>{exercise.content}</AlertDescription>
        </Alert>
        <Tracker exercise={exercise} />
      </div>
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const exercise = exerciseList.find((e) => e.id === id);

  if (!exercise) return notFound();

  return {
    title: `⚓ MyAnchor - Exercises - ${exercise.title}`,
  };
}
