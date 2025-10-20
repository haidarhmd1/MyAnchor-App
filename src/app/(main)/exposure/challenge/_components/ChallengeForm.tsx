"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createChallenge } from "@/lib/api";
import { ChallengeStatus, Company, Difficulty } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner/Spinner";
import { useForm } from "react-hook-form";
import { ChallengeSchema } from "@/lib/zod.types";
import { z } from "zod";

enum STEP_ID {
  LOCATION = "LOCATION",
  COMPANY = "COMPANY",
}

type ChallengeOptions = {
  id: string;
  label: string;
  description: string | null;
  difficulty: Difficulty | null;
};

type FormValues = z.infer<typeof ChallengeSchema>;

export default function ChallengeForm({
  challenges,
}: {
  challenges: ChallengeOptions[];
}) {
  const router = useRouter();

  const formStep = useMemo(() => {
    return [
      {
        id: STEP_ID.LOCATION,
        fieldName: "challengeOptionId" as const,
        label: "Where will you challenge yourself today?",
        options: challenges,
      },
      {
        id: STEP_ID.COMPANY,
        fieldName: "company" as const,
        label: "Who will be with you?",
        options: [
          {
            id: Company.ALONE,
            label: "Alone",
            description: "Face it by yourself",
            difficulty: null,
          },
          {
            id: Company.WITH_OTHERS,
            label: "With others",
            description: "Friends, family, or colleagues",
            difficulty: null,
          },
        ],
      },
    ];
  }, [challenges]);

  const form = useForm<FormValues>({
    defaultValues: {
      challengeOptionId: undefined,
      company: undefined,
      status: ChallengeStatus.NOT_STARTED,
    },
    mode: "onChange",
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [difficultyTab, setDifficultyTab] = useState<Difficulty>(
    Difficulty.EASY,
  );

  const currentStep = formStep[currentStepIndex];
  const isLocationStep = currentStep.id === STEP_ID.LOCATION;
  const selectedValue = form.watch(currentStep.fieldName);
  const canGoNext = Boolean(selectedValue);

  const visibleOptions = useMemo(() => {
    if (!isLocationStep) return currentStep.options;
    return currentStep.options.filter((o) => o.difficulty === difficultyTab);
  }, [currentStep.options, isLocationStep, difficultyTab]);

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
    if (currentStepIndex > 0) {
      // Clear the selection of the current step before going back
      const currentField = formStep[currentStepIndex].fieldName;
      form.setValue(currentField, "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setCurrentStepIndex((s) => s - 1);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await createChallenge({
        data: {
          company: data.company as Company,
          challengeOptionId: data.challengeOptionId,
          status: ChallengeStatus.NOT_STARTED,
        },
      });
      router.refresh();
      router.replace("/exposure");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong while creating the challenge.");
    }
  };

  return (
    <div className="flex items-center justify-center py-0">
      <div className="mx-auto w-full max-w-2xl">
        <div className="space-y-6">
          <div>
            <h5 className="font-light">{currentStep.label}</h5>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Step {currentStepIndex + 1} of {formStep.length}
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
            {/* Difficulty Tabs (only on location step) */}
            {isLocationStep && (
              <div className="mb-4">
                <Tabs
                  value={difficultyTab}
                  onValueChange={(value) =>
                    setDifficultyTab(value as Difficulty)
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value={Difficulty.EASY}>Easy</TabsTrigger>
                    <TabsTrigger value={Difficulty.MEDIUM}>Medium</TabsTrigger>
                    <TabsTrigger value={Difficulty.HARD}>Hard</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* Options (radio-style) */}
            <div
              className="space-y-3"
              role="radiogroup"
              aria-label={currentStep.label}
            >
              {visibleOptions.map((option) => {
                const isSelected = selectedValue === option.id;

                return (
                  <Card
                    key={option.id}
                    role="radio"
                    aria-checked={isSelected}
                    className={cn(
                      "cursor-pointer p-2 transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "hover:border-muted-foreground/50",
                    )}
                    onClick={() => handleSelect(option.id)}
                  >
                    <CardContent className="p-2">
                      <div className="flex items-start space-x-3">
                        {/* Radio visual */}
                        <div
                          className={cn(
                            "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
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
                            {option.label}
                          </h3>
                          <p
                            className={cn(
                              "mt-1 text-sm",
                              isSelected
                                ? "text-blue-600"
                                : "text-muted-foreground",
                            )}
                          >
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0 || form.formState.isSubmitting}
                className="flex items-center space-x-2 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              {currentStepIndex === formStep.length - 1 ? (
                form.formState.isSubmitting ? (
                  <Button
                    disabled
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                  >
                    <Spinner />
                    <span>Submitting</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!canGoNext}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                  >
                    <span>Submit</span>
                    <Check className="ml-1 h-4 w-4" />
                  </Button>
                )
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canGoNext || form.formState.isSubmitting}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
