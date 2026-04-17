"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
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
import { useTranslations } from "next-intl";
import { MomentLogFormSchema, MomentLogFormValues } from "@/lib/zod.types";
import { SingleChoice } from "./Steps/SingleChoice";
import { createMomentLogEntry } from "@/lib/api";
import { MultipleChoice } from "./Steps/MultipleChoice";
import { FinishScreen } from "./Steps/FinishScreen";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export type StepId = Step["id"];

const STEPS_COMPONENTS: Record<
  StepId,
  React.ComponentType<{
    onNext(): void;
    onPrev(): void;
    option: OptionItem[];
    disableGoBack: boolean;
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

export default function MomentLogForm() {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const form = useForm<MomentLogFormValues>({
    resolver: zodResolver(MomentLogFormSchema),
    defaultValues: {
      location: undefined,
      symptoms: [],
      reasoningEn: undefined,
      reasoning: undefined,
      reasoningLocale: undefined,
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: z.infer<typeof MomentLogFormSchema>) => {
    try {
      await createMomentLogEntry({ data });
      router.replace("/momentLog");
    } catch (e) {
      console.error(e);
      toast.error(t("momentLog.momentLogQuestionnaire.errors.saveFailed"));
    }
  };

  const handleNext = () => {
    if (currentStepIndex >= FORM_STEPS.length - 1) {
      form.handleSubmit(onSubmit)();
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStepIndex <= 0) return;

    const currentField = FORM_STEPS[currentStepIndex].id;

    if (currentField === "symptoms") {
      form.setValue("symptoms", [], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }

    if (currentField === "location") {
      form.setValue("location", undefined as any, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }

    if (currentField === "reasoning") {
      form.setValue("reasoning", undefined as any, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      form.setValue("reasoningEn", undefined as any, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      form.setValue("reasoningLocale", undefined as any, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }

    setCurrentStepIndex((prev) => prev - 1);
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
  const progress = ((currentStepIndex + 1) / FORM_STEPS.length) * 100;

  return (
    <FormProvider {...form}>
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 pb-24">
        {stepId !== "reasoning" && (
          <Card className="border-border/60 rounded-3xl shadow-sm">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                {activeStep.titleKey && activeStep.subtitleKey && (
                  <div className="space-y-2 text-center">
                    <h1 className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
                      {t(activeStep.titleKey)}
                    </h1>
                    <p className="text-muted-foreground text-sm leading-6">
                      {t(activeStep.subtitleKey)}
                    </p>
                  </div>
                )}

                <Badge variant="secondary">
                  {t("momentLogShortcut.ctaSubtitle")}
                </Badge>
              </div>

              <div>
                <Progress value={progress} className="h-2" />
                <p className="text-muted-foreground mt-2 text-xs">
                  {t("anxietyScreening.header.stepProgress", {
                    current: currentStepIndex + 1,
                    total: FORM_STEPS.length - 1,
                  })}
                </p>
              </div>
            </CardHeader>
          </Card>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="min-h-64">
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
                  disableGoBack={currentStepIndex === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
