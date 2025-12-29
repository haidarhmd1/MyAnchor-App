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
import { useTranslations } from "next-intl";
import { mapTaxonomiesToFormFields } from "@/i18n/taxonomy-mapper";

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
  whyYouWereAvoidingIt: (props) => (
    <MultipleChoice
      fieldName="whyYouWereAvoidingIt"
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
  callback,
  locationOptions,
  avoidanceReasons,
  symptomOptions,
}: {
  callback?: VoidFunction;
  locationOptions: Taxonomy[];
  avoidanceReasons: Taxonomy[];
  symptomOptions: Taxonomy[];
}) {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const form = useForm<z.infer<typeof JournalFormSchema>>({
    defaultValues: {
      hasAnxietyAttack: undefined,
      hasAvoidedSituations: undefined,
      whenDidItHappen: undefined,
      typesOfSituationYouAvoided: [],
      typesOfSituationYouWereIn: undefined,
      whyYouWereAvoidingIt: [],
      typesOfBodySymptoms: [],
      anxietyLevelRating: undefined,
    },
    mode: "onChange",
  });

  const hasAnxietyAttack = form.watch("hasAnxietyAttack");
  const hasAvoidedSituations = form.watch("hasAvoidedSituations");

  const formStep = useMemo<Step[]>(() => {
    if (typeof hasAnxietyAttack !== "boolean") return [...BASE_STEP];
    if (hasAnxietyAttack === true) return [...BASE_STEP, ...HAS_ANXIETY_STEPS];

    const steps: Step[] = [...BASE_STEP, AVOIDANCE_STEPS[0]];
    if (hasAvoidedSituations === true) steps.push(...AVOIDANCE_STEPS.slice(1));
    return steps;
  }, [hasAnxietyAttack, hasAvoidedSituations]);

  const optionByStep: Partial<Record<StepId, FormFieldType[]>> = useMemo(
    () => ({
      typesOfSituationYouWereIn: mapTaxonomiesToFormFields(locationOptions, t),
      typesOfSituationYouAvoided: mapTaxonomiesToFormFields(locationOptions, t),
      whyYouWereAvoidingIt: mapTaxonomiesToFormFields(avoidanceReasons, t),
      typesOfBodySymptoms: mapTaxonomiesToFormFields(symptomOptions, t),
      whenDidItHappen: whenDidItHappenConst, // this one is already local consts
    }),
    [locationOptions, avoidanceReasons, symptomOptions, t],
  );

  const handleNext = () => {
    const id = formStep[currentStepIndex].id;

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

    const lastIndex = formStep.length - 1;
    if (currentStepIndex >= lastIndex) {
      form.handleSubmit(onSubmit)();
      return;
    }

    setCurrentStepIndex((i) => Math.min(i + 1, lastIndex));
  };

  const handlePrevious = () => {
    if (currentStepIndex <= 0) return;

    const currentField = formStep[currentStepIndex].id;
    form.setValue(currentField, undefined, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    setCurrentStepIndex((s) => s - 1);
  };

  const onSubmit = async (data: z.infer<typeof JournalFormSchema>) => {
    try {
      await createJournalEntry({ data });
      router.refresh();
      callback?.();
    } catch (e) {
      console.error(e);
      toast.error(t("journal.journalQuestionnaire.errors.saveFailed"));
    }
  };

  const active = formStep[currentStepIndex];
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
          <span>{t("common.previous")}</span>
        </Button>
      </div>

      <div className="flex items-center justify-center py-0">
        <div className="mx-auto w-full max-w-2xl">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-6 text-center">
                <h5 className="font-light">{t(active.titleKey)}</h5>
                <h2 className="text-foreground text-2xl">
                  {t(active.subtitleKey)}
                </h2>
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
