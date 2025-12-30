"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { z } from "zod";

import { MultipleChoice } from "./Steps/MultipleChoice";

import { SingleChoice } from "./Steps/SingleChoice";
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
import { ChallengeOutcomeSchema } from "@/lib/zod.types";
import { Taxonomy } from "@prisma/client";
import { anxietyLevelOptions } from "@/common/const/anxietyRating";
import { exposureRatingOptions } from "@/common/const/exposureRatingOptions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { mapTaxonomiesToFormFields } from "@/i18n/taxonomy-mapper";

export type StepId = Step["id"];

export type FormFieldType = {
  id: string;
  label: string;
  description: string | null;
};

type StepComponentProps = {
  onNext(): void;
  onPrev(): void;
  option: FormFieldType[];
};

const STEPS_COMPONENTS: Record<
  StepId,
  React.ComponentType<StepComponentProps>
> = {
  hadCompletedChallenge: (props) => <HadCompletedChallenge {...props} />,
  reasonsNotDone: (props) => (
    <MultipleChoice
      fieldName="reasonsNotDone"
      options={props.option} // skippedChallengeReasonsOptions
      {...props}
    />
  ),
  hadAnxietyAttack: (props) => <HadAnxietyAttackStep {...props} />,
  stoppedEarly: (props) => <StoppedEarly {...props} />,
  stopReasons: (props) => (
    <MultipleChoice
      fieldName="stopReasons"
      options={props.option} // stopReasonsOptions
      {...props}
    />
  ),
  actionsTaken: (props) => (
    <MultipleChoice
      fieldName="actionsTaken"
      options={props.option} // afterAttackActionsOptions
      {...props}
    />
  ),
  typesOfBodySymptoms: (props) => (
    <MultipleChoice
      fieldName="typesOfBodySymptoms"
      options={props.option} // symptomOptions
      {...props}
    />
  ),
  copingStrategies: (props) => (
    <MultipleChoice
      fieldName="copingStrategies"
      options={props.option} // keptGoingReasonsOptions
      {...props}
    />
  ),
  anxietyLevelRating: (props) => (
    <SingleChoice
      fieldName="anxietyLevelRating"
      options={props.option} // anxietyLevelOptions
      {...props}
    />
  ),
  challengeRating: (props) => (
    <SingleChoice
      fieldName="challengeRating"
      options={props.option} // exposureRatingOptions
      {...props}
    />
  ),
};

export function ResultForm({
  challengeId,
  skippedChallengeReasonsOptions,
  stopReasonsOptions,
  afterAttackActionsOptions,
  symptomOptions,
  keptGoingReasonsOptions,
}: {
  challengeId: string;
  skippedChallengeReasonsOptions: Taxonomy[];
  stopReasonsOptions: Taxonomy[];
  afterAttackActionsOptions: Taxonomy[];
  symptomOptions: Taxonomy[];
  keptGoingReasonsOptions: Taxonomy[];
}) {
  const t = useTranslations();
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

  const router = useRouter();
  const reduce = useReducedMotion();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const hadCompletedChallenge = form.watch("hadCompletedChallenge");
  const hadAnxietyAttack = form.watch("hadAnxietyAttack");
  const stoppedEarly = form.watch("stoppedEarly");

  const formStep = useMemo<Step[]>(() => {
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

  const optionByStep: Partial<Record<StepId, FormFieldType[]>> = useMemo(
    () => ({
      reasonsNotDone: mapTaxonomiesToFormFields(skippedChallengeReasonsOptions),
      stopReasons: mapTaxonomiesToFormFields(stopReasonsOptions),
      actionsTaken: mapTaxonomiesToFormFields(afterAttackActionsOptions),
      typesOfBodySymptoms: mapTaxonomiesToFormFields(symptomOptions),
      copingStrategies: mapTaxonomiesToFormFields(keptGoingReasonsOptions),
      anxietyLevelRating: anxietyLevelOptions,
      challengeRating: exposureRatingOptions,
    }),
    [
      skippedChallengeReasonsOptions,
      stopReasonsOptions,
      afterAttackActionsOptions,
      symptomOptions,
      keptGoingReasonsOptions,
    ],
  );

  const handleNext = () => {
    // race condition, it keeps on finishing the step after
    if (formStep[currentStepIndex].id === "hadCompletedChallenge") {
      setCurrentStepIndex(1);
      return;
    }
    if (formStep[currentStepIndex].id === "hadAnxietyAttack") {
      setCurrentStepIndex(2);
      return;
    }

    if (currentStepIndex >= formStep.length - 1) {
      form.handleSubmit(onSubmit)();
      return;
    }
    setCurrentStepIndex(currentStepIndex + 1);
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const currentField = formStep[currentStepIndex].id;
      form.setValue(currentField, undefined, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      setCurrentStepIndex(currentStepIndex - 1);
    }
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
      toast.error("something went wrong");
    }
  };

  const active = formStep[currentStepIndex];
  const ActiveStepComponent = useMemo(() => {
    const stepId = formStep[currentStepIndex].id as StepId;
    return formStep[currentStepIndex]
      ? STEPS_COMPONENTS[stepId]
      : () => <div />;
  }, [formStep, currentStepIndex]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [currentStepIndex, reduce]);

  const variants = {
    initial: { opacity: 0, y: 8, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -8, filter: "blur(4px)" },
  };

  const option = optionByStep[active.id as StepId] ?? [];

  return (
    <>
      <div className="mb-8 flex justify-between">
        <Button
          variant="secondary"
          disabled={currentStepIndex === 0}
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{t("form.previous")}</span>
        </Button>
      </div>
      <div className="flex items-center justify-center py-0">
        <div className="mx-auto w-full max-w-2xl">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-6 text-center">
                <h5 className="font-light">
                  {t(formStep[currentStepIndex].titleKey)}
                </h5>
                <h2 className="text-foreground text-2xl">
                  {t(formStep[currentStepIndex].subtitleKey)}
                </h2>
              </div>
              <div className="min-h-[260px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={formStep[currentStepIndex].id}
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
    </>
  );
}
