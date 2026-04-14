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

  if (!exercise) {
    notFound();
  }

  return (
    <article className="bg-background text-foreground pb-8">
      <div
        className="bg-muted h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url(${exercise.imgSrc})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="space-y-6 px-4 py-4">
        <Alert
          variant="default"
          className="bg-accent text-accent-foreground rounded-2xl border-none shadow-sm"
        >
          <Lightbulb className="text-primary h-4 w-4" />
          <AlertTitle className="text-foreground text-sm font-semibold">
            {t(exercise.titleKey)}
          </AlertTitle>
          <AlertDescription className="text-muted-foreground text-sm leading-6">
            {t(exercise.contentKey)}
          </AlertDescription>
        </Alert>

        <Tracker exercise={exercise} />
      </div>
    </article>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();
  const { id } = await params;

  const exercise = exerciseList.find((e) => e.id === id);

  if (!exercise) {
    notFound();
  }

  return {
    title: `⚓ MyAnchor - Exercises - ${t(exercise.titleKey)}`,
  };
}
