"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Import your step components:
import { HasAnxietyAttackStep } from "./Steps/HasAnxietyAttack";
import { HasStoppedTheChallenge } from "./Steps/HasStoppedTheChallenge";
import { MultipleChoice } from "./Steps/MultipleChoice";
import {
  afterAttackActionsOptions,
  anxietyLevelOptions,
  exposureRatingOptions,
  keptGoingReasonsOptions,
  skippedChallengeReasonsOptions,
  stopReasonsOptions,
  symptomOptions,
} from "@/const/form/formStep";
import { SingleChoice } from "./Steps/SingleChoice";
import { DidYouDoTheChallenge } from "./Steps/DidYouDoTheChallenge";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface FormType {
  hasDoneTheChallenge: boolean;
  whyDidntYouDoTheChallenge: string[];
  hadAnxietyAttack: boolean;
  hasStoppedTheChallenge: boolean;
  whyDidYouStoppedTheChallenge?: string[];
  whatDidYouDo?: string[];
  typesOfBodySymptoms?: string[];
  anxietyLevelRating?: number;
  howDidYouFindThisChallenge?: number;
  keepOnGoingThoughPanicArises?: string[];
}

const BASE_STEP = [
  {
    id: "hasDoneTheChallenge",
    title: "",
    subtitle: "Did you do the challenge?",
  },
] as const;

const ANXIETY_CHECK = [
  {
    id: "hadAnxietyAttack",
    title: "Did you had an Anxiety attack",
    subtitle: "Did you have had an anxiety attack during this challenge?",
  },
] as const;

const REASONS_FOR_SKIPPING_CHALLENGE = [
  {
    id: "reasonsWhyYouDidNotDoTheChallenge",
    title: "Why did not you do the challenge?",
    subtitle: "Reasons on why you did not it",
  },
] as const;

const AVOIDANCE_STEPS = [
  {
    id: "hasStoppedTheChallenge",
    title: "Stopped the Challenge",
    subtitle: "Did you stopped the challenge though?",
  },
] as const;

const CONTINUED_CHALLENGE = [
  {
    id: "typesOfBodySymptoms",
    title: "Body Sensations while continuing the challenge",
    subtitle:
      "Though you had an anxiety/panic attack what were the symptoms you had?",
  },
  {
    id: "keepOnGoingThoughPanicArises",
    title: "You kept going though you had an attack!",
    subtitle: "Tell me about your motivations on why?",
  },
  {
    id: "anxietyLevelRating",
    title: "Rate Anxiety",
    subtitle: "How intense was your anxiety?",
  },
] as const;

const STOPPED_CHALLENGE = [
  {
    id: "whyDidYouStoppedTheChallenge",
    title: "Reasons why you stopped the challenge",
    subtitle: "Tell me why you stopped the challenge?",
  },
  {
    id: "whatDidYouDo",
    title: "",
    subtitle: "What did you ?",
  },
  {
    id: "typesOfBodySymptoms",
    title: "Body Sensations",
    subtitle: "What did you feel in your body?",
  },
  {
    id: "anxietyLevelRating",
    title: "Rate Anxiety",
    subtitle: "How intense was your anxiety?",
  },
] as const;

const NO_ANXIETY_STEPS = [
  {
    id: "howDidYouFindThisChallenge",
    title: "How did you find this challenge?",
    subtitle: "Rate how did you find this challenge",
  },
] as const;

type BaseStep = (typeof BASE_STEP)[number];
type DidTheChallenge = (typeof ANXIETY_CHECK)[number];
type ReasonsWhyYouDidNotDoTheChallenge =
  (typeof REASONS_FOR_SKIPPING_CHALLENGE)[number];
type AvoidanceStep = (typeof AVOIDANCE_STEPS)[number];
type AnxietyStep = (typeof NO_ANXIETY_STEPS)[number];
type StoppedChallengeStep = (typeof STOPPED_CHALLENGE)[number];
type ContinuedChallengeThoughAnxiety = (typeof CONTINUED_CHALLENGE)[number];

type Step =
  | BaseStep
  | AvoidanceStep
  | AnxietyStep
  | StoppedChallengeStep
  | ContinuedChallengeThoughAnxiety
  | DidTheChallenge
  | ReasonsWhyYouDidNotDoTheChallenge;
export type StepId = Step["id"];

const StepRegistry: Record<
  StepId,
  React.ComponentType<{ onNext(): void; onPrev(): void }>
> = {
  hasDoneTheChallenge: (props) => <DidYouDoTheChallenge {...props} />,
  reasonsWhyYouDidNotDoTheChallenge: (props) => (
    <MultipleChoice
      generalOptions={skippedChallengeReasonsOptions}
      controlName="whyDidYouStoppedTheChallenge"
      {...props}
    />
  ),
  hadAnxietyAttack: (props) => <HasAnxietyAttackStep {...props} />,
  hasStoppedTheChallenge: (props) => <HasStoppedTheChallenge {...props} />,
  whyDidYouStoppedTheChallenge: (props) => (
    <MultipleChoice
      controlName="whyDidYouStoppedTheChallenge"
      generalOptions={stopReasonsOptions}
      {...props}
    />
  ),
  whatDidYouDo: (props) => (
    <MultipleChoice
      controlName="whatDidYouDo"
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
  keepOnGoingThoughPanicArises: (props) => (
    <MultipleChoice
      controlName="keepOnGoingThoughPanicArises"
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
  howDidYouFindThisChallenge: (props) => (
    <SingleChoice
      options={exposureRatingOptions}
      fieldName="howDidYouFindThisChallenge"
      {...props}
    />
  ),
};

export const ResultForm = () => {
  const router = useRouter();
  const form = useForm<FormType>({
    defaultValues: {
      hadAnxietyAttack: undefined,
      hasDoneTheChallenge: undefined,
      whyDidntYouDoTheChallenge: [],
      hasStoppedTheChallenge: undefined,
      whyDidYouStoppedTheChallenge: [],
      whatDidYouDo: [],
      typesOfBodySymptoms: [],
      anxietyLevelRating: undefined,
      howDidYouFindThisChallenge: 0,
    },
    mode: "onChange",
  });

  const [isComplete, setIsComplete] = useState(false);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const reduce = useReducedMotion();

  const hasDoneTheChallenge = form.watch("hasDoneTheChallenge");
  const hadAnxietyAttack = form.watch("hadAnxietyAttack");
  const hasStoppedTheChallenge = form.watch("hasStoppedTheChallenge");

  const conditionSteps = useMemo<Step[]>(() => {
    // Not answered yet, wait for first answer
    if (typeof hasDoneTheChallenge !== "boolean") return [...BASE_STEP];

    if (hasDoneTheChallenge === false)
      return [...BASE_STEP, ...REASONS_FOR_SKIPPING_CHALLENGE];

    if (typeof hadAnxietyAttack !== "boolean")
      return [...BASE_STEP, ...ANXIETY_CHECK];

    // No anxiety today -> simple path
    if (hadAnxietyAttack === false) {
      return [...BASE_STEP, ...ANXIETY_CHECK, ...NO_ANXIETY_STEPS];
    }
    const steps: Step[] = [...BASE_STEP, ...ANXIETY_CHECK, AVOIDANCE_STEPS[0]];
    if (hasStoppedTheChallenge === true) {
      steps.push(...STOPPED_CHALLENGE);
    } else {
      steps.push(...CONTINUED_CHALLENGE);
    }

    return steps;
  }, [hadAnxietyAttack, hasStoppedTheChallenge, hasDoneTheChallenge]);

  const handleNext = () => {
    // race condition, it keeps on finishing the step after
    const id = conditionSteps[currentStepIndex].id;
    if (id === "hasDoneTheChallenge") {
      setCurrentStepIndex(1);
      return;
    }
    if (id === "hadAnxietyAttack") {
      setCurrentStepIndex(2);
      return;
    }

    if (currentStepIndex >= conditionSteps.length - 1) {
      form.handleSubmit(onSubmit)();
      return;
    }
    setCurrentStepIndex(currentStepIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentStepIndex(currentStepIndex - 1);
  };

  const onSubmit = (data: FormType) => {
    console.log("Submit:", data);
    setIsComplete(true);
    // …send to API, etc.
  };

  const ActiveStepComponent = useMemo(
    () =>
      conditionSteps[currentStepIndex]
        ? StepRegistry[conditionSteps[currentStepIndex].id as StepId]
        : () => <div />,
    [conditionSteps, currentStepIndex],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [currentStepIndex, reduce]);
  const variants = {
    initial: { opacity: 0, y: 8, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -8, filter: "blur(4px)" },
  };

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
                <h5 className="font-light">
                  {conditionSteps[currentStepIndex].title}
                </h5>
                <h2 className="text-foreground text-2xl">
                  {conditionSteps[currentStepIndex].subtitle}
                </h2>
              </div>
              <div className="min-h-[260px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={conditionSteps[currentStepIndex].id}
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
};
