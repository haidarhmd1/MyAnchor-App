"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bubbles } from "lucide-react";
import { FormProvider, useForm, type UseWatchProps } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import AnxietyResult from "./_components/Steps/AnxietyResult";
import { type ScreenerStepId } from "./_components/helpers/questions";
import {
  anxietyScreeningDefaultValues,
  AnxietyScreeningSchema,
  type AnxietyScreeningInput,
} from "./_components/helpers/schema";
import { deriveAnxietyProfile } from "./_components/helpers/scoring";
import type { DerivedAnxietyProfile } from "./_components/helpers/types";
import { GadStep } from "./_components/Steps/GadStep";
import { ImpactStep } from "./_components/Steps/ImpactStep";
import { IntroStep } from "./_components/Steps/IntroStep";
import { MaintainersStep } from "./_components/Steps/MaintainersStep";
import { PanicStep } from "./_components/Steps/PanicStep";
import { ReviewStep } from "./_components/Steps/ReviewStep";
import { RuleoutsStep } from "./_components/Steps/RuleoutsStep";
import { useLocale, useTranslations } from "next-intl";
import { getAnxietyProfilePreview } from "@/lib/api";
import { AnxietyResultResponse } from "@/lib/ai/anxietyProfile/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getCanProceedForStep } from "./_components/helpers/fromProceed.helper";
import { AnxietyScreeningRequestInput } from "./_components/helpers/request.schema";
import {
  containerVariants,
  loadingPulse,
} from "@/common/const/sharedFramerMotionAnimationVars";

export type ActiveStepId = Exclude<ScreenerStepId, "results">;
export type FormFieldName = UseWatchProps<AnxietyScreeningInput>["name"];

const FORM_STEPS: ActiveStepId[] = [
  "intro",
  "gad",
  "panic",
  "maintainers",
  "impact",
  "ruleouts",
  "review",
];

export default function AnxietyScreenerForm({
  id,
  anxietyResult,
  input,
  profile,
  hasAlreadyFilledForm,
}: {
  id: string | null;
  anxietyResult: AnxietyResultResponse | null;
  input: AnxietyScreeningInput | null;
  profile: DerivedAnxietyProfile | null;
  hasAlreadyFilledForm: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale.startsWith("ar");

  const form = useForm<AnxietyScreeningInput>({
    resolver: zodResolver(AnxietyScreeningSchema),
    defaultValues: input ?? anxietyScreeningDefaultValues,
    mode: "onSubmit",
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [result, setResult] = useState<{
    input: AnxietyScreeningInput;
    profile: DerivedAnxietyProfile;
    anxietyResultResponse: AnxietyResultResponse;
  } | null>(
    input && profile && anxietyResult
      ? {
          input: input,
          profile: profile,
          anxietyResultResponse: anxietyResult,
        }
      : null,
  );
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [currentStepIndex, reduce]);

  const variants = {
    initial: { opacity: 0, y: 8, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -8, filter: "blur(4px)" },
  };

  const progress = ((currentStepIndex + 1) / FORM_STEPS.length) * 100;
  const currentStepId = FORM_STEPS[currentStepIndex];

  const watchedValues = form.watch();

  const canProceed = useMemo(() => {
    return getCanProceedForStep(currentStepId, watchedValues);
  }, [currentStepId, watchedValues]);

  const goNext = async () => {
    if (!canProceed) {
      return;
    }

    if (currentStepId === "review") {
      await form.handleSubmit(async (values) => {
        const profile = deriveAnxietyProfile(
          values as AnxietyScreeningRequestInput,
        );
        const response = await getAnxietyProfilePreview({
          profile,
          locale,
        });
        setResult({
          input: values,
          profile,
          anxietyResultResponse: response.reasoning,
        });
      })();
      return;
    }

    setCurrentStepIndex((value) => Math.min(value + 1, FORM_STEPS.length - 1));
  };

  const goBack = () => {
    setCurrentStepIndex((value) => Math.max(value - 1, 0));
  };

  if (form.formState.isSubmitting) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepId}
          variants={variants}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
        >
          <div className="mx-auto flex w-full max-w-md flex-col gap-4 pb-24">
            <Card className="border-border/60 rounded-3xl shadow-sm">
              <CardHeader>
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Bubbles className="h-5 w-5" />
                </div>

                <CardTitle className="text-2xl">
                  {t("anxietyScreening.analysis.title")}
                </CardTitle>

                <CardDescription>
                  {t("anxietyScreening.analysis.subtitle")}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-foreground/90 space-y-4 text-sm leading-6">
                <motion.div
                  className="w-full space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    variants={loadingPulse}
                    initial="initial"
                    animate="animate"
                    className="space-y-4"
                  >
                    <div className="surface-soft rounded-3xl p-4 shadow-sm">
                      <Skeleton className="bg-muted h-4 w-28" />
                      <Skeleton className="bg-muted mt-4 h-24 w-full rounded-2xl" />
                    </div>

                    <div className="border-border bg-card rounded-3xl border p-4 shadow-sm">
                      <Skeleton className="bg-muted h-5 w-40" />
                      <Skeleton className="bg-muted mt-3 h-4 w-full" />
                      <Skeleton className="bg-muted mt-2 h-4 w-11/12" />
                      <Skeleton className="bg-muted mt-2 h-4 w-9/12" />
                    </div>

                    <div className="border-border bg-secondary rounded-3xl border p-4 shadow-sm">
                      <Skeleton className="bg-muted h-5 w-36" />
                      <Skeleton className="bg-muted mt-3 h-4 w-full" />
                      <Skeleton className="bg-muted mt-2 h-4 w-10/12" />
                    </div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (result) {
    return (
      <AnxietyResult
        id={id}
        input={result.input}
        profile={result.profile}
        anxietyResultResponse={result.anxietyResultResponse}
        hasAlreadyFilledForm={hasAlreadyFilledForm}
      />
    );
  }

  return (
    <FormProvider {...form}>
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 pb-24">
        <Card className="border-border/60 rounded-3xl shadow-sm">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
                  {t("anxietyScreening.header.eyebrow")}
                </p>
              </div>
              <Badge variant="secondary">
                {t("anxietyScreening.header.badge")}
              </Badge>
            </div>

            <div>
              <Progress value={progress} className="h-2" />
              <p className="text-muted-foreground mt-2 text-xs">
                {t("anxietyScreening.header.stepProgress", {
                  current: currentStepIndex + 1,
                  total: FORM_STEPS.length,
                })}
              </p>
            </div>
          </CardHeader>
        </Card>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepId}
            variants={variants}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            <ScreenStepComponent stepId={currentStepId} />
          </motion.div>
        </AnimatePresence>

        <div className="bg-background/95 border-t px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-md items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-2xl"
              onClick={goBack}
              disabled={currentStepIndex === 0}
            >
              {isRtl ? (
                <ArrowRight className="ml-2 h-4 w-4" />
              ) : (
                <ArrowLeft className="mr-2 h-4 w-4" />
              )}

              {t("common.previous")}
            </Button>
            <Button
              type="button"
              className="flex-1 rounded-2xl"
              disabled={!canProceed}
              onClick={goNext}
            >
              {currentStepId === "review"
                ? t("common.analyzeAnswers")
                : t("common.continue")}
              {isRtl ? (
                <ArrowLeft className="mr-2 h-4 w-4" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

function ScreenStepComponent({ stepId }: { stepId: ActiveStepId }) {
  switch (stepId) {
    case "intro":
      return <IntroStep />;
    case "gad":
      return <GadStep />;
    case "panic":
      return <PanicStep />;
    case "maintainers":
      return <MaintainersStep />;
    case "impact":
      return <ImpactStep />;
    case "ruleouts":
      return <RuleoutsStep />;
    case "review":
      return <ReviewStep />;
    default:
      return null;
  }
}
