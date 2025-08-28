"use client";

import Image from "next/image";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormChallengeOutcomeType } from "../helper";

export const StoppedEarly = ({
  onNext,
}: {
  onNext(): void;
  onPrev?: () => void;
}) => {
  const { setValue } = useFormContext<FormChallengeOutcomeType>();

  return (
    <div className="space-y-6 text-center">
      <Image
        className="m-auto"
        alt="avoidance_illustration"
        src="/illustration/avoidance.webp"
        width={200}
        height={200}
      />

      <div className="flex w-full flex-row justify-between p-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValue("stoppedEarly", true, { shouldDirty: true });
            onNext();
          }}
        >
          Yes
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValue("stoppedEarly", false, { shouldDirty: true });
            onNext();
          }}
        >
          No
        </Button>
      </div>
    </div>
  );
};
