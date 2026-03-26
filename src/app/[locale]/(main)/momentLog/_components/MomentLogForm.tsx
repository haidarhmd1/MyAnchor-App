"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { useRouter } from "next/navigation";
import {
  FORM_STEPS,
  locationOptions,
  OptionItem,
  Step,
  feelingOptions,
} from "./helper";
import { toast } from "sonner";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { momentLogFormSchema } from "@/lib/zod.types";
import { SingleChoice } from "./Steps/SingleChoice";
import { createMomentLogEntry } from "@/lib/api";
import { MultipleChoice } from "./Steps/MultipleChoice";
import { FinishScreen } from "./Steps/FinishScreen";
import { useMutation } from "@tanstack/react-query";

export type StepId = Step["id"];

const STEPS_COMPONENTS: Record<
  StepId,
  React.ComponentType<{
    onNext(): void;
    onPrev(): void;
    option: OptionItem[];
  }>
> = {
  location: (props) => (
    <SingleChoice fieldName="location" options={props.option} {...props} />
  ),
  symptoms: (props) => (
    <MultipleChoice fieldName="symptoms" options={props.option} {...props} />
  ),
  reasoning: (props) => <FinishScreen {...props} />,
};

export default function MomentLogForm({
  callback,
}: {
  callback?: VoidFunction;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const reduce = useReducedMotion();
  const router = useRouter();
  const isRtl = locale.includes("ar");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const form = useForm<z.infer<typeof momentLogFormSchema>>({
    defaultValues: {
      location: undefined,
      symptoms: [],
      reasoningEn: undefined,
      reasoning: undefined,
      reasoningLocale: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof momentLogFormSchema>) => {
    try {
      await createMomentLogEntry({ data });
      router.refresh();
      callback?.();
    } catch (e) {
      console.error(e);
      toast.error(t("momentLog.momentLogQuestionnaire.errors.saveFailed"));
    }
  };

  const handleNext = async () => {
    if (currentStepIndex >= FORM_STEPS.length - 1) {
      form.handleSubmit(onSubmit)();
      return;
    }
    setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const currentField = FORM_STEPS[currentStepIndex].id;
      form.setValue(
        currentField as any,
        currentField === "symptoms" ? [] : undefined,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        },
      );

      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [currentStepIndex, reduce]);

  const variants = {
    initial: { opacity: 0, y: 8, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -8, filter: "blur(4px)" },
  };

  const stepId = FORM_STEPS[currentStepIndex].id as StepId;
  const activeStep = FORM_STEPS[currentStepIndex];
  const ActiveStepComponent = FORM_STEPS[currentStepIndex]
    ? STEPS_COMPONENTS[stepId]
    : () => <div />;

  const optionsInStep: Partial<Record<StepId, OptionItem[]>> = {
    location: locationOptions,
    symptoms: feelingOptions,
  };
  const option = optionsInStep[activeStep.id as StepId] ?? [];

  return (
    <>
      {currentStepIndex < FORM_STEPS.length - 1 && (
        <div className="mb-8 flex justify-between">
          <Button
            variant="secondary"
            disabled={currentStepIndex === 0}
            onClick={handlePrevious}
          >
            {isRtl ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span>{t("common.previous")}</span>
          </Button>
        </div>
      )}

      <div className="flex items-center justify-center py-0">
        <div className="mx-auto w-full max-w-2xl">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {activeStep.titleKey && activeStep.subtitleKey && (
                <div className="mb-6 text-center">
                  <h5 className="text-2xl font-light">
                    {t(activeStep.titleKey)}
                  </h5>
                  <h2 className="text-xs font-light">
                    {t(activeStep.subtitleKey)}
                  </h2>
                </div>
              )}

              <div className="min-h-65">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep.id}
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
