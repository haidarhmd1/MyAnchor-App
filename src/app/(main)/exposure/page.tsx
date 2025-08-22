import { CardContainer } from "@/components/Card/Card";
import { whyThisFeelsHardAtFirst } from "@/const/content";
import { Metadata } from "next";
import { TabSwitcher } from "./_components/TabSwitcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

export default function Page() {
  return (
    <>
      <div
        className="h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url("/illustration/understanding-anxiety.png")`,
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      />
      <div className="p-4">
        <h5 className="font-light">Confrontation exposure therapy</h5>
        <h2>Take your Life and Freedom back</h2>
        <div className="mb-4">
          <p className="mt-4">
            Each day is an opportunity to grow stronger against anxiety. Here
            you can set your personal daily challenge — a step in exposure
            confrontation therapy. Choose a situation that triggers discomfort
            and commit to facing it today. You can start right away, or take the
            morning to prepare yourself and complete the challenge later in the
            day. What matters most is making the choice and giving yourself the
            chance to prove that you are safe, capable, and stronger than your
            fears.
          </p>
        </div>

        <Alert variant="default" className="mb-4 rounded-4xl">
          <Lightbulb />
          <AlertTitle>Why and for what is it good?</AlertTitle>
          <AlertDescription>
            Daily exposure challenges are a key part of confronting anxiety. By
            deliberately choosing a situation that triggers fear and committing
            to face it today, you teach your brain that these sensations and
            places are not dangerous. You may begin the challenge immediately or
            take time to prepare and carry it out later in the day. The
            important part is consistency: every exposure is a learning
            opportunity, and with each one, avoidance loses power and confidence
            grows.
          </AlertDescription>
        </Alert>
        <div className="py-8">
          <TabSwitcher />
        </div>
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Exposure",
};
