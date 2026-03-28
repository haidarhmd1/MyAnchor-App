"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  BASE_STEP,
  PARTIAL_NO_FINISH_SCREEN,
  Step,
  STOP_REASONS,
  YES_FINISH_SCREEN,
} from "./helper";
import { HadCompletedChallenge } from "./Steps/HadCompletedChallenge";
import { createChallengeOutcome } from "@/lib/api";
import { ChallengeOutcomeSchema } from "@/lib/zod.types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { SingleChoice } from "./Steps/SingleChoice";
import { PartialNoFinishScreen } from "./Steps/PartialNoFinishScreen";
import {
  SafetyBehaviorOptionItem,
  PARTIAL_NO_REASONS,
} from "@/common/const/SafetyBehavior";
import { StayedFinishScreen } from "./Steps/StayedFinishScreen";

export type StepId = Step["id"];

type StepComponentProps = {
  onNext(): void;
  onPrev(): void;
  option: SafetyBehaviorOptionItem[];
};

const STEPS_COMPONENTS: Record<
  StepId,
  React.ComponentType<StepComponentProps>
> = {
  hadCompletedChallenge: (props) => <HadCompletedChallenge {...props} />,
  safetyBehavior: (props) => (
    <SingleChoice
      fieldName="safetyBehavior"
      options={props.option}
      {...props}
    />
  ),
  partialNoFinishScreen: (props) => <PartialNoFinishScreen {...props} />,
  yesFinishScreen: (props) => <StayedFinishScreen {...props} />,
};

export function ResultForm({ challengeId }: { challengeId: string }) {
  const t = useTranslations();
  const router = useRouter();
  const reduce = useReducedMotion();

  const form = useForm<z.infer<typeof ChallengeOutcomeSchema>>({
    defaultValues: {
      hadCompletedChallenge: undefined,
      safetyBehavior: "",
    },
    mode: "onChange",
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const hadCompletedChallenge = form.watch("hadCompletedChallenge");

  const formStep = useMemo(() => {
    return !hadCompletedChallenge
      ? [...BASE_STEP, ...STOP_REASONS, ...PARTIAL_NO_FINISH_SCREEN]
      : [...BASE_STEP, ...YES_FINISH_SCREEN];
  }, [hadCompletedChallenge]);

  const optionByStep: Partial<Record<StepId, SafetyBehaviorOptionItem[]>> = {
    safetyBehavior: PARTIAL_NO_REASONS,
  };

  const handleNext = () => {
    if (currentStepIndex >= formStep.length - 1) {
      form.handleSubmit(onSubmit)();
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStepIndex <= 0) return;

    const currentField = formStep[currentStepIndex].id;

    if (
      currentField === "partialNoFinishScreen" ||
      currentField === "yesFinishScreen"
    ) {
      setCurrentStepIndex((prev) => prev - 1);
      return;
    }

    if (currentField === "hadCompletedChallenge") {
      form.setValue("hadCompletedChallenge", undefined as any, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }

    if (currentField === "safetyBehavior") {
      form.setValue("safetyBehavior", "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }

    setCurrentStepIndex((prev) => prev - 1);
  };

  const onSubmit = async (data: z.infer<typeof ChallengeOutcomeSchema>) => {
    try {
      await createChallengeOutcome({
        id: challengeId,
        data,
      });

      router.refresh();
      router.replace("/exposure");
    } catch (e) {
      console.error(e);
      toast.error(t("common.error"));
    }
  };

  const currentStep = formStep[currentStepIndex];
  const stepId = currentStep.id as StepId;
  const ActiveStepComponent = currentStep
    ? STEPS_COMPONENTS[stepId]
    : () => <div />;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [currentStepIndex, reduce]);

  const variants = {
    initial: { opacity: 0, y: 8, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -8, filter: "blur(4px)" },
  };

  const active = formStep[currentStepIndex];
  const option = optionByStep[active.id as StepId] ?? [];
  const progress = ((currentStepIndex + 1) / formStep.length) * 100;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={currentStepIndex === 0}
          onClick={handlePrevious}
          className="rounded-2xl"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{t("form.previous")}</span>
        </Button>

        <span className="text-muted-foreground text-sm">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="bg-muted h-2 w-full rounded-full">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <div className="surface-soft rounded-4xl p-5 shadow-sm sm:p-6">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                  {t(currentStep.titleKey)}
                </h1>
                <p className="text-muted-foreground text-sm leading-6">
                  {t(currentStep.subtitleKey)}
                </p>
              </div>

              <div className="min-h-64">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep.id}
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
                      option={option}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </section>
  );
}
