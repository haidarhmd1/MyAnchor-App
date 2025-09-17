"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { z } from "zod";

import { MultipleChoice } from "./Steps/MultipleChoice";
import {
  afterAttackActionsOptions,
  anxietyLevelOptions,
  exposureRatingOptions,
  keptGoingReasonsOptions,
  skippedChallengeReasonsOptions,
  stopReasonsOptions,
  symptomOptions,
} from "@/common/const/form/formStep";
import { SingleChoice } from "./Steps/SingleChoice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ANXIETY_CHECK,
  AVOIDANCE_STEPS,
  BASE_STEP,
  CONTINUED_CHALLENGE,
  NO_ANXIETY_STEPS,
  REASONS_FOR_SKIPPING_CHALLENGE,
  Step,
  STOPPED_CHALLENGE,
} from "./helper";
import { HadCompletedChallenge } from "./Steps/HadCompletedChallenge";
import { HadAnxietyAttackStep } from "./Steps/HadAnxietyAttack";
import { StoppedEarly } from "./Steps/StoppedEarly";
import { createChallengeOutcome } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ChallengeOutcomeSchema } from "@/lib/zod.types";

export type StepId = Step["id"];

const STEPS_COMPONENTS: Record<
  StepId,
  React.ComponentType<{ onNext(): void; onPrev(): void }>
> = {
  hadCompletedChallenge: (props) => <HadCompletedChallenge {...props} />,
  reasonsWhyYouDidNotDoTheChallenge: (props) => (
    <MultipleChoice
      generalOptions={skippedChallengeReasonsOptions}
      controlName="stopReasons"
      {...props}
    />
  ),
  hadAnxietyAttack: (props) => <HadAnxietyAttackStep {...props} />,
  stoppedEarly: (props) => <StoppedEarly {...props} />,
  stopReasons: (props) => (
    <MultipleChoice
      controlName="stopReasons"
      generalOptions={stopReasonsOptions}
      {...props}
    />
  ),
  actionsTaken: (props) => (
    <MultipleChoice
      controlName="actionsTaken"
      generalOptions={afterAttackActionsOptions}
      {...props}
    />
  ),
  typesOfBodySymptoms: (props) => (
    <MultipleChoice
      controlName="typesOfBodySymptoms"
      generalOptions={symptomOptions}
      {...props}
    />
  ),
  copingStrategies: (props) => (
    <MultipleChoice
      controlName="copingStrategies"
      generalOptions={keptGoingReasonsOptions}
      {...props}
    />
  ),
  anxietyLevelRating: (props) => (
    <SingleChoice
      options={anxietyLevelOptions}
      fieldName="anxietyLevelRating"
      {...props}
    />
  ),
  challengeRating: (props) => (
    <SingleChoice
      options={exposureRatingOptions}
      fieldName="challengeRating"
      {...props}
    />
  ),
};

export function ResultForm({ challengeId }: { challengeId: string }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const form = useForm<z.infer<typeof ChallengeOutcomeSchema>>({
    defaultValues: {
      hadAnxietyAttack: undefined,
      hadCompletedChallenge: undefined,
      reasonsNotDone: [],
      stoppedEarly: undefined,
      stopReasons: [],
      actionsTaken: [],
      typesOfBodySymptoms: [],
      anxietyLevelRating: undefined,
      challengeRating: undefined,
    },
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const hadCompletedChallenge = form.watch("hadCompletedChallenge");
  const hadAnxietyAttack = form.watch("hadAnxietyAttack");
  const stoppedEarly = form.watch("stoppedEarly");

  const steps = useMemo<Step[]>(() => {
    // Not answered yet, wait for first answer
    if (typeof hadCompletedChallenge !== "boolean") {
      return [...BASE_STEP];
    }
    if (hadCompletedChallenge === false) {
      return [...BASE_STEP, ...REASONS_FOR_SKIPPING_CHALLENGE];
    }

    if (typeof hadAnxietyAttack !== "boolean") {
      return [...BASE_STEP, ...ANXIETY_CHECK];
    }
    // No anxiety today -> simple path
    if (hadAnxietyAttack === false) {
      return [...BASE_STEP, ...ANXIETY_CHECK, ...NO_ANXIETY_STEPS];
    }

    const steps: Step[] = [...BASE_STEP, ...ANXIETY_CHECK, AVOIDANCE_STEPS[0]];
    if (stoppedEarly === true) {
      steps.push(...STOPPED_CHALLENGE);
    } else {
      steps.push(...CONTINUED_CHALLENGE);
    }
    return steps;
  }, [hadAnxietyAttack, stoppedEarly, hadCompletedChallenge]);

  const handleNext = () => {
    // race condition, it keeps on finishing the step after
    if (steps[currentStepIndex].id === "hadCompletedChallenge") {
      setCurrentStepIndex(1);
      return;
    }
    if (steps[currentStepIndex].id === "hadAnxietyAttack") {
      setCurrentStepIndex(2);
      return;
    }

    if (currentStepIndex >= steps.length - 1) {
      form.handleSubmit(onSubmit)();
      return;
    }
    setCurrentStepIndex(currentStepIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentStepIndex(currentStepIndex - 1);
  };

  const onSubmit = async (data: z.infer<typeof ChallengeOutcomeSchema>) => {
    setIsLoading(true);
    try {
      await createChallengeOutcome({
        id: challengeId,
        data,
      });
      setIsComplete(true);
      toast("Your progress has been save!", {
        action: {
          label: "Go back home",
          onClick: () => {
            router.replace("/");
          },
        },
      });
    } catch {
      setIsComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const ActiveStepComponent = useMemo(() => {
    const stepId = steps[currentStepIndex].id as StepId;
    return steps[currentStepIndex] ? STEPS_COMPONENTS[stepId] : () => <div />;
  }, [steps, currentStepIndex]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [currentStepIndex, reduce]);
  const variants = {
    initial: { opacity: 0, y: 8, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -8, filter: "blur(4px)" },
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          className="mt-8 rounded-4xl bg-white p-8 text-center shadow-sm"
        >
          <h2 className="text-2xl font-semibold">Saving data</h2>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </motion.div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          className="mt-8 rounded-4xl bg-white p-8 text-center shadow-sm"
        >
          <h2 className="text-2xl font-semibold">Challenge done!</h2>

          <Image
            className="m-auto mb-6"
            width={200}
            height={240}
            src="/illustration/journal_finished.webp"
            alt="Journal Finished"
          />
          <p className="text-muted-foreground mt-2">
            Thank yourself for trying to do that challenge, no matter if you did
            it or not, even thinking about doing one is a step towards feeling
            better!
          </p>
          <Button
            className="mt-6"
            onClick={() => {
              router.replace("/");
            }}
          >
            Back to home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {currentStepIndex !== 0 ? (
        <div className="mb-8 flex justify-between">
          <Button variant="secondary" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
        </div>
      ) : (
        <div className="h-[69px]" />
      )}
      <div className="flex items-center justify-center py-0">
        <div className="mx-auto w-full max-w-2xl">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-6 text-center">
                <h5 className="font-light">{steps[currentStepIndex].title}</h5>
                <h2 className="text-foreground text-2xl">
                  {steps[currentStepIndex].subtitle}
                </h2>
              </div>
              <div className="min-h-[260px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={steps[currentStepIndex].id}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{
                      duration: reduce ? 0 : 0.28,
                      ease: "easeInOut",
                    }}
                  >
                    <ActiveStepComponent
                      onNext={handleNext}
                      onPrev={handlePrevious}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
