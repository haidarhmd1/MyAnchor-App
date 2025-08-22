import { exercisesInteroceptiveContent } from "@/const/content";
import { Information } from "./_components/Information";
import { Exercises } from "./_components/Exercises";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageCircleWarningIcon } from "lucide-react";
import { Metadata } from "next";

export default async function Page() {
  return (
    <>
      <h5 className="font-light">{exercisesInteroceptiveContent.title}</h5>
      <h2>{exercisesInteroceptiveContent.subtitle}</h2>
      {/* <>
        <Alert variant="default" className="mt-4">
          <Lightbulb />
          <AlertTitle>Interoceptive Exposure Guide (Step-by-Step)</AlertTitle>
          <AlertDescription>
            The key: stay long enough to feel the wave rise and fall. If you
            always stop too early, your brain doesn’t learn safety.
          </AlertDescription>
        </Alert>
      </> */}

      <Alert variant="default" className="my-4 border-amber-200 bg-amber-50">
        <MessageCircleWarningIcon />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          Always remind yourself before starting — “This is practice. My body is
          safe. These are just sensations.”
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
    </>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Exercises",
};
