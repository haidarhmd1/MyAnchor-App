"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Import your step components:
import { HasAnxietyAttackStep } from "./Steps/HasAnxietyAttack";
import { HasAvoidedSituation } from "./Steps/HasAvoidedSituation";
import { SituationYouWereIn } from "./Steps/SituationYouWereIn";
import {
  avoidanceReasons,
  locationOptions,
  symptomOptions,
} from "@/const/form/formStep";
import { AnxietyLevelRating } from "./Steps/AnxietyRating";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface FormType {
  hasAnxietyAttack?: boolean;
  hasAvoidedSituations?: boolean;
  typesOfSituationYouAvoided?: string[];
  typesOfSituationYouWereIn?: string[];
  whyYourWhereAvoidingIt?: string[];
  typesOfBodySymptoms?: string[];
  anxietyLevelRating?: number;
}

const BASE_STEP = [
  {
    id: "hasAnxietyAttack",
    title: "Anxiety attack",
    subtitle: "Did you have had an anxiety attack today?",
  },
] as const;

const AVOIDANCE_STEPS = [
  {
    id: "hasAvoidedSituations",
    title: "Avoidance",
    subtitle: "Did you avoid any situations today?",
  },
  {
    id: "typesOfSituationYouAvoided",
    title: "Situations Avoided",
    subtitle: "Which ones did you avoid?",
  },
  {
    id: "whyYourWhereAvoidingIt",
    title: "Reasons why you avoided it",
    subtitle:
      "Tell me what where you afraid off ? Why you were trying to avoid it?",
  },
  {
    id: "anxietyLevelRating",
    title: "Rate Anxiety",
    subtitle: "How afraid where you that something would happen?",
  },
] as const;

const HAS_ANXIETY_STEPS = [
  {
    id: "typesOfSituationYouWereIn",
    title: "Situations Faced",
    subtitle: "Where were you / what was happening?",
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

type BaseStep = (typeof BASE_STEP)[number];
type AvoidanceStep = (typeof AVOIDANCE_STEPS)[number];
type AnxietyStep = (typeof HAS_ANXIETY_STEPS)[number];

type Step = BaseStep | AvoidanceStep | AnxietyStep;
export type StepId = Step["id"];

const StepRegistry: Record<
  StepId,
  React.ComponentType<{ onNext(): void; onPrev(): void }>
> = {
  hasAnxietyAttack: (props) => <HasAnxietyAttackStep {...props} />,
  hasAvoidedSituations: (props) => <HasAvoidedSituation {...props} />,
  typesOfSituationYouAvoided: (props) => (
    <SituationYouWereIn
      controlName="typesOfSituationYouAvoided"
      generalOptions={locationOptions}
      {...props}
    />
  ),
  typesOfSituationYouWereIn: (props) => (
    <SituationYouWereIn
      controlName="typesOfSituationYouWereIn"
      generalOptions={locationOptions}
      {...props}
    />
  ),
  whyYourWhereAvoidingIt: (props) => (
    <SituationYouWereIn
      controlName="whyYourWhereAvoidingIt"
      generalOptions={avoidanceReasons}
      {...props}
    />
  ),
  typesOfBodySymptoms: (props) => (
    <SituationYouWereIn
      controlName="typesOfBodySymptoms"
      generalOptions={symptomOptions}
      {...props}
    />
  ),
  anxietyLevelRating: (props) => <AnxietyLevelRating {...props} />,
};

export default function Journal() {
  const form = useForm<FormType>({
    defaultValues: {
      hasAnxietyAttack: undefined,
      hasAvoidedSituations: undefined,
      typesOfSituationYouAvoided: [],
      typesOfSituationYouWereIn: [],
      whyYourWhereAvoidingIt: [],
      typesOfBodySymptoms: [],
      anxietyLevelRating: undefined,
    },
    mode: "onChange",
  });

  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const reduce = useReducedMotion();

  const hasAnxietyAttack = form.watch("hasAnxietyAttack");
  const hasAvoidedSituations = form.watch("hasAvoidedSituations");

  const conditionSteps = useMemo<Step[]>(() => {
    // Not answered yet, wait for first answer
    if (typeof hasAnxietyAttack !== "boolean") return [...BASE_STEP];

    // full anxiety path
    if (hasAnxietyAttack === true) return [...BASE_STEP, ...HAS_ANXIETY_STEPS];

    // no attack bcz I avoided situation in general
    const steps: Step[] = [...BASE_STEP, AVOIDANCE_STEPS[0]];
    if (hasAvoidedSituations === true) {
      // list of avoidances and reasons
      steps.push(...AVOIDANCE_STEPS.slice(1));
    }
    // if i did not avoid anything and just out of own
    // personal reasons then just end it
    return steps;
  }, [hasAnxietyAttack, hasAvoidedSituations]);

  const handleNext = () => {
    const id = conditionSteps[currentStepIndex].id;

    if (id === "hasAnxietyAttack") {
      // const latest = form.getValues("hasAnxietyAttack");
      // if (typeof latest !== "boolean") return;
      setCurrentStepIndex(1);
      return;
    }
    if (id === "hasAvoidedSituations") {
      const latest = form.getValues("hasAvoidedSituations");
      // if (typeof latest !== "boolean") return;
      if (latest === false) {
        console.log("form submition");
        form.handleSubmit(onSubmit)();
        return;
      }
      setCurrentStepIndex(2);
      return;
    }

    const lastIndex = conditionSteps.length - 1;
    if (currentStepIndex >= lastIndex) {
      form.handleSubmit(onSubmit)();
      return;
    }
    setCurrentStepIndex((i) => Math.min(i + 1, lastIndex));
  };

  const handlePrevious = () => {
    setCurrentStepIndex(currentStepIndex - 1);
  };

  const onSubmit = (data: FormType) => {
    console.log("Submit:", data);
    setIsComplete(true);
    // …send to API, etc.
  };

  const active = conditionSteps[currentStepIndex];
  const ActiveStepComponent = useMemo(
    () => (active ? StepRegistry[active.id as StepId] : () => <div />),
    [active],
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
      <div className="mx-auto h-full max-w-2xl py-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          className="rounded-4xl bg-white p-8 text-center shadow-sm"
        >
          <h2 className="text-2xl font-semibold">Journal saved</h2>

          <Image
            className="m-auto mb-6"
            width={200}
            height={240}
            src="/illustration/journal_finished.webp"
            alt="Journal Finished"
          />
          <p className="text-muted-foreground mt-2">
            Thanks for checking in today. You’re building confidence one step at
            a time.
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
                <h5 className="font-light">{active.title}</h5>
                <h2 className="text-foreground text-2xl">{active.subtitle}</h2>
              </div>
              <div className="min-h-[260px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
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
