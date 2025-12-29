import { exercisesInteroceptiveContent } from "@/common/const/content";
import { Information } from "./_components/Information";
import { Exercises } from "./_components/Exercises";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageCircleWarningIcon } from "lucide-react";
import { Metadata } from "next";

export default function Page() {
  return (
    <>
      <div
        className="h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url(/illustration/exercises.png)`,
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      />
      <div className="p-4">
        <h5 className="font-light">{exercisesInteroceptiveContent.title}</h5>
        <h2>{exercisesInteroceptiveContent.subtitle}</h2>

        <Alert
          variant="default"
          className="border-muted my-4 rounded-4xl bg-amber-50 shadow-none"
        >
          <MessageCircleWarningIcon />
          <AlertTitle>Tip</AlertTitle>
          <AlertDescription>
            Always remind yourself before starting — “This is practice. My body
            is safe. These are just sensations.”
          </AlertDescription>
        </Alert>
        <div className="mb-4">
          {exercisesInteroceptiveContent.content.map((content) => (
            <p key={content.id} className="mt-4">
              {content.text}
            </p>
          ))}
        </div>
        <Exercises />
        <>
          <Information />
        </>
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Exercises",
};
