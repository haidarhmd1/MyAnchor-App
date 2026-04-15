"use client";

import { Spinner } from "@/components/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { momentLogFormSchema } from "@/lib/zod.types";
import { getReasoningPreview } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import z from "zod";
import { toRenderSections } from "./FinishScreen.helper";
import {
  itemVariants,
  containerVariants,
  loadingPulse,
  stickyBarVariants,
} from "@/common/const/sharedFramerMotionAnimationVars";

type FormValues = z.infer<typeof momentLogFormSchema>;

export function sectionTone(type: string) {
  switch (type) {
    case "intro":
      return "bg-accent border-border";
    case "text":
      return "bg-card border-border";
    case "steps":
      return "bg-secondary border-border";
    case "red_flags":
      return "bg-destructive/10 border-destructive/25";
    case "affirmation":
      return "bg-accent border-primary/20";
    default:
      return "bg-card border-border";
  }
}

export function AnimatedPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={itemVariants}
      layout
      className={cn("rounded-3xl border p-4 shadow-sm", className)}
    >
      {children}
    </motion.section>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-foreground text-base font-semibold">{children}</h3>
  );
}

export function syncReasoningToForm(
  setValue: ReturnType<typeof useFormContext<FormValues>>["setValue"],
  data: {
    reasoningEn: string;
    reasoning: string;
    reasoningLocale: string;
  },
) {
  setValue("reasoningEn", JSON.parse(data.reasoningEn), {
    shouldDirty: false,
    shouldTouch: false,
    shouldValidate: false,
  });
  setValue("reasoning", JSON.parse(data.reasoning), {
    shouldDirty: false,
    shouldTouch: false,
    shouldValidate: false,
  });
  setValue("reasoningLocale", JSON.parse(data.reasoningLocale), {
    shouldDirty: false,
    shouldTouch: false,
    shouldValidate: false,
  });
}

export const FinishScreen = ({ onNext }: { onNext(): void }) => {
  const locale = useLocale() as "en" | "de" | "ar" | "ar-LB";
  const t = useTranslations();
  const reduceMotion = useReducedMotion();

  const { formState, watch, setValue } = useFormContext<FormValues>();

  const location = watch("location");
  const symptoms = watch("symptoms");

  const canFetchPreview = Boolean(location && symptoms?.length);

  const previewInputKey = useMemo(() => {
    const safeSymptoms = Array.isArray(symptoms) ? [...symptoms].sort() : [];
    return JSON.stringify({
      location: location ?? null,
      symptoms: safeSymptoms,
      locale,
    });
  }, [location, symptoms, locale]);

  const query = useQuery({
    queryKey: ["reasoningPreview", previewInputKey],
    queryFn: async () => {
      return getReasoningPreview({
        data: {
          location: location!,
          symptoms: symptoms!,
          locale,
        },
      });
    },
    enabled: canFetchPreview,
    staleTime: 0,
  });

  const { data, isLoading, isFetching, isError } = query;

  useEffect(() => {
    if (!data) return;
    syncReasoningToForm(setValue, {
      reasoningEn: JSON.stringify(data.reasoningEn),
      reasoning: JSON.stringify(data.reasoning),
      reasoningLocale: JSON.stringify(data.reasoningLocale),
    });
  }, [data, setValue]);

  const reasoning = data?.reasoning ?? "";
  const sections = useMemo(
    () => (reasoning ? toRenderSections(reasoning) : []),
    [reasoning],
  );

  if (isError) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="border-destructive/30 bg-destructive/10 rounded-3xl border p-4 shadow-sm">
          <p className="text-foreground text-sm font-medium">
            {t("deleteAccount.error")}
          </p>
        </div>
      </motion.div>
    );
  }

  if ((isLoading || isFetching) && !data) {
    return (
      <motion.div
        className="w-full space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="space-y-2 text-center">
          <motion.h3
            initial={reduceMotion ? false : { opacity: 0.4 }}
            animate={reduceMotion ? {} : { opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-foreground text-lg font-semibold"
          >
            {t("common.loading")}
          </motion.h3>
        </motion.div>

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
    );
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={previewInputKey}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="space-y-4"
        >
          {sections.map((section, index) => {
            const key = `${section.type}-${index}`;

            if (section.type === "title") {
              return (
                <motion.h3
                  key={key}
                  variants={itemVariants}
                  className="text-foreground text-xl font-semibold tracking-tight"
                >
                  {section.content}
                </motion.h3>
              );
            }

            if (section.type === "intro") {
              return (
                <AnimatedPanel key={key} className={sectionTone(section.type)}>
                  <p className="text-muted-foreground text-sm leading-6">
                    {section.content}
                  </p>
                </AnimatedPanel>
              );
            }

            if (section.type === "text") {
              return (
                <AnimatedPanel key={key} className={sectionTone(section.type)}>
                  <div className="space-y-2">
                    <SectionHeading>
                      {t(`aiResponseMomentLog.${section.id}`)}
                    </SectionHeading>
                    <p className="text-muted-foreground text-sm leading-6">
                      {section.content}
                    </p>
                  </div>
                </AnimatedPanel>
              );
            }

            if (section.type === "steps" || section.type === "red_flags") {
              return (
                <AnimatedPanel key={key} className={sectionTone(section.type)}>
                  <div className="space-y-3">
                    <SectionHeading>
                      {t(`aiResponseMomentLog.${section.id}`)}
                    </SectionHeading>

                    <motion.ul
                      className="space-y-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {section.items.map((item, i) => (
                        <motion.li
                          key={i}
                          variants={itemVariants}
                          className="bg-card/70 text-muted-foreground rounded-2xl px-3 py-2 text-sm leading-6"
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </AnimatedPanel>
              );
            }

            if (section.type === "symptoms") {
              return (
                <motion.section
                  key={key}
                  variants={itemVariants}
                  layout
                  className="space-y-3"
                >
                  <SectionHeading>
                    {t(`aiResponseMomentLog.${section.id}`)}
                  </SectionHeading>

                  <motion.div
                    className="space-y-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {section.items.map((item, i) => (
                      <motion.div
                        key={i}
                        variants={itemVariants}
                        className="border-border bg-card rounded-3xl border p-4 shadow-sm"
                      >
                        <div className="text-foreground text-sm font-semibold">
                          {t(`taxonomy.SYMPTOM.${item.symptom}.label`)}
                        </div>
                        <div className="text-muted-foreground mt-1 text-sm leading-6">
                          {item.explanation}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.section>
              );
            }

            if (section.type === "affirmation") {
              return (
                <AnimatedPanel key={key} className={sectionTone(section.type)}>
                  <div className="space-y-1">
                    <div className="text-foreground text-sm font-semibold">
                      {t(`aiResponseMomentLog.${section.id}`)}
                    </div>
                    <p className="text-muted-foreground text-sm leading-6">
                      {section.content}
                    </p>
                  </div>
                </AnimatedPanel>
              );
            }

            return null;
          })}
        </motion.div>
      </AnimatePresence>

      <motion.div
        variants={stickyBarVariants}
        initial="hidden"
        animate="visible"
        className="border-border bg-background/80 sticky bottom-0 z-10 mt-6 w-full rounded-3xl border px-4 py-4 text-center shadow-sm backdrop-blur-md"
      >
        {formState.isSubmitting ? (
          <Button
            disabled={isLoading || isFetching || formState.isSubmitting}
            className="bg-primary text-primary-foreground rounded-2xl hover:opacity-95"
          >
            <Spinner />
            <span>{t("form.submitting")}</span>
          </Button>
        ) : (
          <Button
            type="button"
            disabled={isLoading || isFetching || sections.length === 0}
            onClick={onNext}
            className="bg-primary text-primary-foreground rounded-2xl hover:opacity-95"
          >
            {t("form.log")}
          </Button>
        )}
      </motion.div>
    </div>
  );
};
