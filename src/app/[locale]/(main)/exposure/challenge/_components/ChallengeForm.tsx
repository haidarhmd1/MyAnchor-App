"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createChallenge } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner/Spinner";
import { useForm } from "react-hook-form";
import { ChallengeSchema } from "@/lib/zod.types";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { mapChallengeOptionsToFormFields } from "@/i18n/challengeoptions-mapper";
import { Engagement, SocialContext } from "@/generated/prisma/enums";
import { ChallengeOption } from "@/generated/prisma/browser";
import { SingleChoiceGroup } from "@/components/Form/Choice";

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
  const isRtl = locale.startsWith("ar");

  const localizedChallenges = useMemo(() => {
    return mapChallengeOptionsToFormFields(challengesOptions);
  }, [challengesOptions]);

  const localizedSocialContextOptions = useMemo(() => {
    return socialContextOptions.map((socialContextOption) => ({
      id: socialContextOption.id,
      label: `taxonomy.COMPANY.${socialContextOption.slug}.label`,
      description: `taxonomy.COMPANY.${socialContextOption.slug}.description`,
    }));
  }, []);

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

    return (currentStep.options as typeof localizedChallenges).filter(
      (option) => option.engagement === engagementTab,
    );
  }, [
    currentStep.options,
    isChallengeOptionStep,
    engagementTab,
    localizedChallenges,
  ]);

  const singleChoiceOptions = useMemo(() => {
    return visibleOptions.map((option) => ({
      id: option.id,
      label: t(option.label),
      description: option.description ? t(option.description) : undefined,
    }));
  }, [visibleOptions, t]);

  const handleSelect = (optionId: string) => {
    form.setValue(currentStep.fieldName, optionId, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleNext = () => {
    if (currentStepIndex < formStep.length - 1) {
      setCurrentStepIndex((s) => s + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex <= 0) return;

    const currentField = formStep[currentStepIndex].fieldName;
    form.resetField(currentField, {
      defaultValue: undefined,
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

  const progress = ((currentStepIndex + 1) / formStep.length) * 100;

  return (
    <div className="flex items-center justify-center py-0">
      <div className="mx-auto w-full max-w-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium tracking-[0.16em] uppercase">
              {t("common.step")} {currentStepIndex + 1} {t("common.of")}{" "}
              {formStep.length}
            </p>

            <h2 className="text-foreground text-xl font-semibold tracking-tight">
              {t(currentStep.labelKey)}
            </h2>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                {t("common.step")} {currentStepIndex + 1} {t("common.of")}{" "}
                {formStep.length}
              </span>

              <span className="text-muted-foreground text-sm">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="bg-muted h-2 w-full rounded-full">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isChallengeOptionStep && (
              <div className="space-y-3">
                <Tabs
                  value={engagementTab}
                  onValueChange={(value) =>
                    setEngagementTab(value as Engagement)
                  }
                  className="w-full"
                >
                  <TabsList className="bg-muted grid h-auto w-full grid-cols-3 rounded-md p-1">
                    <TabsTrigger
                      value={Engagement.STAY}
                      className="data-[state=active]:bg-card data-[state=active]:text-foreground rounded-md px-4 py-3 text-sm font-medium data-[state=active]:shadow-sm"
                    >
                      {t(`common.engagement.${Engagement.STAY}.label`)}
                    </TabsTrigger>

                    <TabsTrigger
                      value={Engagement.PARTICIPATE}
                      className="data-[state=active]:bg-card data-[state=active]:text-foreground rounded-md px-4 py-3 text-sm font-medium data-[state=active]:shadow-sm"
                    >
                      {t(`common.engagement.${Engagement.PARTICIPATE}.label`)}
                    </TabsTrigger>

                    <TabsTrigger
                      value={Engagement.STRETCH}
                      className="data-[state=active]:bg-card data-[state=active]:text-foreground rounded-md px-4 py-3 text-sm font-medium data-[state=active]:shadow-sm"
                    >
                      {t(`common.engagement.${Engagement.STRETCH}.label`)}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="surface-soft rounded-xl p-4 shadow-sm">
                  <p className="text-foreground text-base font-semibold">
                    {t(`common.engagement.${engagementTab}.title`)}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm leading-6">
                    {t(`common.engagement.${engagementTab}.description`)}
                  </p>
                </div>
              </div>
            )}

            <SingleChoiceGroup
              options={singleChoiceOptions}
              value={selectedValue ?? null}
              onChange={handleSelect}
              className="space-y-3"
            />

            <div className="flex justify-between gap-3 pt-2">
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0 || form.formState.isSubmitting}
                className="flex items-center gap-2 rounded-2xl"
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
                    className="bg-primary text-primary-foreground flex items-center gap-2 rounded-2xl hover:opacity-95 disabled:opacity-50"
                  >
                    <Spinner />
                    <span>{t("common.submitting")}</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!canGoNext}
                    className="bg-primary text-primary-foreground flex items-center gap-2 rounded-2xl hover:opacity-95 disabled:opacity-50"
                  >
                    <span>{t("common.submit")}</span>
                    <Check className="h-4 w-4" />
                  </Button>
                )
              ) : (
                <Button
                  type="button"
                  size="lg"
                  onClick={handleNext}
                  disabled={!canGoNext || form.formState.isSubmitting}
                  className="bg-primary text-primary-foreground flex items-center gap-2 rounded-2xl hover:opacity-95 disabled:opacity-50"
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
