"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { useRouter } from "next/navigation";
import {
  actionTakenOptions,
  BASE_STEP,
  locationOptions,
  OptionItem,
  PARTIALY_NO,
  STAYED_BEHAVIOR,
  Step,
  urgeOptions,
} from "./helper";
import { toast } from "sonner";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { momentLogFormSchema } from "@/lib/zod.types";
import { SingleChoice } from "./Steps/SingleChoice";
import { PartialNoFinishScreen } from "./Steps/PartialNoFinishScreen";
import { StayedFinishScreen } from "./Steps/StayedFinishScreen";
import { createMomentLogEntry } from "@/lib/api";

export type StepId = Step["id"];

const BASE_FORM_STEP_ARR = [...BASE_STEP];

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
  urge: (props) => (
    <SingleChoice fieldName="urge" options={props.option} {...props} />
  ),
  actionTaken: (props) => (
    <SingleChoice fieldName="actionTaken" options={props.option} {...props} />
  ),
  outcomePartialNo: (props) => <PartialNoFinishScreen {...props} />,
  outcomeStayed: (props) => <StayedFinishScreen {...props} />,
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
      location: "",
      urge: "",
      actionTaken: "",
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

  const handleNext = () => {
    if (currentStepIndex >= formStep.length - 1) {
      form.handleSubmit(onSubmit)();
      return;
    }
    setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const currentField = formStep[currentStepIndex].id;
      if (
        currentField === "outcomePartialNo" ||
        currentField === "outcomeStayed"
      ) {
        setCurrentStepIndex(currentStepIndex - 1);
        return;
      }

      form.setValue(currentField, "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

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

  const formStep =
    form.watch("actionTaken") === "stayed" ||
    form.watch("actionTaken") === "stayed-and-participated"
      ? [...BASE_FORM_STEP_ARR, ...STAYED_BEHAVIOR]
      : [...BASE_FORM_STEP_ARR, ...PARTIALY_NO];

  const stepId = formStep[currentStepIndex].id as StepId;
  const activeStep = formStep[currentStepIndex];
  const ActiveStepComponent = formStep[currentStepIndex]
    ? STEPS_COMPONENTS[stepId]
    : () => <div />;

  const optionsInStep: Partial<Record<StepId, OptionItem[]>> = {
    location: locationOptions,
    urge: urgeOptions,
    actionTaken: actionTakenOptions,
  };

  const option = optionsInStep[activeStep.id as StepId] ?? [];

  return (
    <>
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

      <div className="flex items-center justify-center py-0">
        <div className="mx-auto w-full max-w-2xl">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-6 text-center">
                <h5 className="text-2xl font-light">
                  {t(activeStep.titleKey)}
                </h5>
                <h2 className="text-xs font-light">
                  {t(activeStep.subtitleKey)}
                </h2>
              </div>

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
