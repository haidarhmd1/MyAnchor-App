import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { exerciseList } from "@/const/content";
import { Lightbulb } from "lucide-react";
import { notFound } from "next/navigation";
import { Tracker } from "./_components/Tracker";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exercise = exerciseList.find((e) => e.id === id);

  if (!exercise) return notFound();

  return (
    <>
      <Alert variant="default" className="mb-4">
        <Lightbulb />
        <AlertTitle>{exercise.title}</AlertTitle>
        <AlertDescription>{exercise.content}</AlertDescription>
      </Alert>
      <Tracker exercise={exercise} />
    </>
  );
}
