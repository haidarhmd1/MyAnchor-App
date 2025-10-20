"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { HasAnxietyAttackStep } from "./Steps/HasAnxietyAttack";
import { HasAvoidedSituation } from "./Steps/HasAvoidedSituation";
import { MultipleChoice } from "./Steps/MultipleChoice";
import { AnxietyLevelRating } from "./Steps/AnxietyRating";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AVOIDANCE_STEPS,
  BASE_STEP,
  FormFieldType,
  HAS_ANXIETY_STEPS,
  Step,
  whenDidItHappenConst,
} from "./helper";
import { createJournalEntry } from "@/lib/api";
import { toast } from "sonner";
import { z } from "zod";
import { JournalFormSchema } from "@/lib/zod.types";
import type { Taxonomy } from "@prisma/client";
import { SingleChoice } from "./Steps/SingleChoice";

export type StepId = Step["id"];

const STEPS_COMPONENTS: Record<
  StepId,
  React.ComponentType<{
    onNext(): void;
    onPrev(): void;
    option: FormFieldType[];
  }>
> = {
  hasAnxietyAttack: (props) => <HasAnxietyAttackStep {...props} />,
  hasAvoidedSituations: (props) => <HasAvoidedSituation {...props} />,
  typesOfSituationYouAvoided: (props) => (
    <MultipleChoice
      fieldName="typesOfSituationYouAvoided"
      options={props.option}
      {...props}
    />
  ),
  whenDidItHappen: (props) => (
    <SingleChoice
      fieldName="whenDidItHappen"
      options={props.option}
      {...props}
    />
  ),
  typesOfSituationYouWereIn: (props) => (
    <SingleChoice
      fieldName="typesOfSituationYouWereIn"
      options={props.option}
      {...props}
    />
  ),
  whyYourWhereAvoidingIt: (props) => (
    <MultipleChoice
      fieldName="whyYourWhereAvoidingIt"
      options={props.option}
      {...props}
    />
  ),
  typesOfBodySymptoms: (props) => (
    <MultipleChoice
      fieldName="typesOfBodySymptoms"
      options={props.option}
      {...props}
    />
  ),
  anxietyLevelRating: (props) => <AnxietyLevelRating {...props} />,
};

export default function Journal({
  locationOptions,
  avoidanceReasons,
  symptomOptions,
}: {
  locationOptions: Taxonomy[];
  avoidanceReasons: Taxonomy[];
  symptomOptions: Taxonomy[];
}) {
  const form = useForm<z.infer<typeof JournalFormSchema>>({
    defaultValues: {
      hasAnxietyAttack: undefined,
      hasAvoidedSituations: undefined,
      whenDidItHappen: undefined,
      typesOfSituationYouAvoided: [],
      typesOfSituationYouWereIn: [],
      whyYourWhereAvoidingIt: [],
      typesOfBodySymptoms: [],
      anxietyLevelRating: undefined,
    },
    mode: "onChange",
  });

  const router = useRouter();
  const reduce = useReducedMotion();

  const [isComplete, setIsComplete] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const hasAnxietyAttack = form.watch("hasAnxietyAttack");
  const hasAvoidedSituations = form.watch("hasAvoidedSituations");

  const conditionSteps = useMemo<Step[]>(() => {
    if (typeof hasAnxietyAttack !== "boolean") return [...BASE_STEP];
    if (hasAnxietyAttack === true) return [...BASE_STEP, ...HAS_ANXIETY_STEPS];

    // no attack -> ask if avoided
    const steps: Step[] = [...BASE_STEP, AVOIDANCE_STEPS[0]];
    if (hasAvoidedSituations === true) steps.push(...AVOIDANCE_STEPS.slice(1));
    return steps;
  }, [hasAnxietyAttack, hasAvoidedSituations]);

  const optionByStep: Partial<Record<StepId, FormFieldType[]>> = useMemo(
    () => ({
      typesOfSituationYouWereIn: locationOptions,
      typesOfSituationYouAvoided: locationOptions,
      whyYourWhereAvoidingIt: avoidanceReasons,
      typesOfBodySymptoms: symptomOptions,
      whenDidItHappen: whenDidItHappenConst,
    }),
    [locationOptions, avoidanceReasons, symptomOptions],
  );

  const handleNext = () => {
    const id = conditionSteps[currentStepIndex].id;

    if (id === "hasAnxietyAttack") {
      setCurrentStepIndex(1);
      return;
    }
    if (id === "hasAvoidedSituations") {
      const latest = form.getValues("hasAvoidedSituations");
      if (latest === false) {
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
    setCurrentStepIndex((i) => Math.max(0, i - 1));
  };

  const onSubmit = async (data: z.infer<typeof JournalFormSchema>) => {
    try {
      await createJournalEntry({ data });
      toast("Journal entry has been saved!", {
        action: { label: "Go back home", onClick: () => router.replace("/") },
      });
    } catch {
      setIsComplete(false);
    } finally {
      setIsComplete(true);
    }
  };

  const active = conditionSteps[currentStepIndex];
  const ActiveStepComponent = useMemo(
    () => (active ? STEPS_COMPONENTS[active.id as StepId] : () => <div />),
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
          <Button className="mt-6" onClick={() => router.replace("/")}>
            Back to home
          </Button>
        </motion.div>
      </div>
    );
  }

  const option = optionByStep[active.id as StepId] ?? [];

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
