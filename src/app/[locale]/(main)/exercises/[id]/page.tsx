import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { exerciseList } from "@/common/const/content";
import { Lightbulb } from "lucide-react";
import { notFound } from "next/navigation";
import { Tracker } from "./_components/Tracker";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const t = await getTranslations();
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
          <AlertTitle>{t(exercise.titleKey)}</AlertTitle>
          <AlertDescription>{t(exercise.contentKey)}</AlertDescription>
        </Alert>
        <Tracker exercise={exercise} />
      </div>
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();
  const { id } = await params;
  const exercise = exerciseList.find((e) => e.id === id);

  if (!exercise) return notFound();

  return {
    title: `⚓ MyAnchor - Exercises - ${t(exercise.titleKey)}`,
  };
}
