/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createChallenge } from "@/lib/api";
import { ChallengeOption, Engagement, SocialContext } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner/Spinner";
import { useForm } from "react-hook-form";
import { ChallengeSchema } from "@/lib/zod.types";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { mapChallengeOptionsToFormFields } from "@/i18n/challengeoptions-mapper";

enum STEP_ID {
  CHALLENGE_OPTION = "CHALLENGE_OPTION",
  SOCIAL_CONTEXT = "SOCIAL_CONTEXT",
}

type SocialContextOption = {
  id: SocialContext;
  slug: "alone" | "with_others";
  description: string;
};

type FormValues = z.infer<typeof ChallengeSchema>;

const socialContextOptions: SocialContextOption[] = [
  {
    id: SocialContext.ALONE,
    slug: "alone",
    description: "Face it by yourself",
  },
  {
    id: SocialContext.WITH_OTHERS,
    slug: "with_others",
    description: "Friends, family, or colleagues",
  },
];

export default function ChallengeForm({
  challengesOptions,
}: {
  challengesOptions: Pick<
    ChallengeOption,
    "id" | "slug" | "label" | "description" | "engagement"
  >[];
}) {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale.includes("ar");

  const localizedChallenges = useMemo(() => {
    return mapChallengeOptionsToFormFields(challengesOptions);
  }, [challengesOptions]);

  const localizedSocialContextOptions = useMemo(() => {
    return socialContextOptions.map((socialContextOption) => ({
      id: socialContextOption.id,
      label: `taxonomy.COMPANY.${socialContextOption.slug}.label`,
      description: `taxonomy.COMPANY.${socialContextOption.slug}.description`,
    }));
  }, [t, socialContextOptions]);

  const formStep = useMemo(() => {
    return [
      {
        id: STEP_ID.CHALLENGE_OPTION,
        fieldName: "challengeOptionId" as const,
        labelKey: "exposure.challengeForm.steps.location.label",
        options: localizedChallenges,
      },
      {
        id: STEP_ID.SOCIAL_CONTEXT,
        fieldName: "socialContext" as const,
        labelKey: "exposure.challengeForm.steps.company.label",
        options: localizedSocialContextOptions,
      },
    ];
  }, [localizedChallenges, localizedSocialContextOptions]);

  const form = useForm<FormValues>({
    defaultValues: {
      challengeOptionId: undefined,
      socialContext: undefined,
    },
    mode: "onChange",
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [engagementTab, setEngagementTab] = useState<Engagement>(
    Engagement.STAY,
  );

  const currentStep = formStep[currentStepIndex];
  const isChallengeOptionStep = currentStep.id === STEP_ID.CHALLENGE_OPTION;

  const selectedValue = form.watch(currentStep.fieldName);
  const canGoNext = Boolean(selectedValue);

  const visibleOptions = useMemo(() => {
    if (!isChallengeOptionStep) return currentStep.options;
    return (currentStep.options as unknown as ChallengeOption[]).filter(
      (o) => o.engagement === engagementTab,
    );
  }, [currentStep.options, isChallengeOptionStep, engagementTab]);

  const handleSelect = (optionId: string) => {
    form.setValue(currentStep.fieldName, optionId, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleNext = () => {
    if (currentStepIndex < formStep.length - 1)
      setCurrentStepIndex((s) => s + 1);
  };

  const handlePrevious = () => {
    if (currentStepIndex <= 0) return;

    // if previous clear the current selection in the form
    const currentField = formStep[currentStepIndex].fieldName;
    form.setValue(currentField, "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setCurrentStepIndex((s) => s - 1);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await createChallenge({
        data: {
          socialContext: data.socialContext,
          challengeOptionId: data.challengeOptionId,
        },
      });
      router.refresh();
      router.replace("/exposure");
    } catch (e) {
      console.error(e);
      toast.error(t("exposure.challengeForm.errors.createFailed"));
    }
  };

  return (
    <div className="flex items-center justify-center py-0">
      <div className="mx-auto w-full max-w-2xl">
        <div className="space-y-6">
          <div>
            <h5 className="font-light">{t(currentStep.labelKey)}</h5>
          </div>

          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                {t("common.step")} {currentStepIndex + 1} {t("common.of")}{" "}
                {formStep.length}
              </span>
              <span className="text-muted-foreground text-sm">
                {Math.round(((currentStepIndex + 1) / formStep.length) * 100)}%
              </span>
            </div>
            <div className="bg-muted h-2 w-full rounded-full">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / formStep.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            {isChallengeOptionStep && (
              <>
                <div className="mb-4">
                  <Tabs
                    value={engagementTab}
                    onValueChange={(value) =>
                      setEngagementTab(value as Engagement)
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value={Engagement.STAY}>
                        {t(`common.engagement.${Engagement.STAY}.label`)}
                      </TabsTrigger>
                      <TabsTrigger value={Engagement.PARTICIPATE}>
                        {t(`common.engagement.${Engagement.PARTICIPATE}.label`)}
                      </TabsTrigger>
                      <TabsTrigger value={Engagement.STRETCH}>
                        {t(`common.engagement.${Engagement.STRETCH}.label`)}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="mt-2 rounded-xl border-0 bg-white p-4 shadow-md">
                    <p className="text-md font-medium">
                      {t(`common.engagement.${engagementTab}.title`)}
                    </p>
                    <p className="text-sm font-light">
                      {t(`common.engagement.${engagementTab}.description`)}
                    </p>
                  </div>
                </div>
              </>
            )}

            <div
              className="space-y-3"
              role="radiogroup"
              aria-label={t(currentStep.labelKey)}
            >
              {visibleOptions.map((option) => {
                const isSelected = selectedValue === option.id;

                return (
                  <Card
                    key={option.id}
                    role="radio"
                    aria-checked={isSelected}
                    className={cn(
                      "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
                      "cursor-pointer p-2 transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "hover:border-muted-foreground/50",
                    )}
                    onClick={() => handleSelect(option.id)}
                  >
                    <CardContent className="p-2">
                      <div className="flex items-start space-x-3">
                        <div
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                            isSelected
                              ? "border-blue-500"
                              : "border-muted-foreground/30",
                          )}
                        >
                          <div
                            className={cn(
                              "h-2.5 w-2.5 rounded-full transition-colors",
                              isSelected ? "bg-blue-500" : "bg-transparent",
                            )}
                          />
                        </div>

                        <div className="flex-1">
                          <h3
                            className={cn(
                              "text-base",
                              isSelected ? "text-blue-700" : "text-foreground",
                            )}
                          >
                            {t(option.label)}
                          </h3>

                          {option.description ? (
                            <p
                              className={cn(
                                "mt-1 text-sm",
                                isSelected
                                  ? "text-blue-600"
                                  : "text-muted-foreground",
                              )}
                            >
                              {t(option.description)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0 || form.formState.isSubmitting}
                className="flex items-center space-x-2 bg-transparent"
              >
                {isRtl ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
                <span>{t("common.previous")}</span>
              </Button>

              {currentStepIndex === formStep.length - 1 ? (
                form.formState.isSubmitting ? (
                  <Button
                    disabled
                    size="lg"
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                  >
                    <Spinner />
                    <span>{t("common.submitting")}</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!canGoNext}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                  >
                    <span>{t("common.submit")}</span>
                    <Check className="ml-1 h-4 w-4" />
                  </Button>
                )
              ) : (
                <Button
                  type="button"
                  size="lg"
                  onClick={handleNext}
                  disabled={!canGoNext || form.formState.isSubmitting}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                >
                  <span>{t("common.next")}</span>
                  {isRtl ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
