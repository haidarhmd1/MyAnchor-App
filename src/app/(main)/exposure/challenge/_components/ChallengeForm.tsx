"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { challenges } from "@/common/const/form/formStep";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createChallenge } from "@/lib/api";
import { ChallengeStatus, Company, Prisma } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Difficulty = "easy" | "medium" | "hard";

interface FormStep {
  id: string;
  label: string;
  description?: string;
  options: {
    id: string;
    label: string;
    description: string;
    isCustom?: boolean;
    difficulty?: Difficulty;
  }[];
}

const formSteps: FormStep[] = [
  {
    id: "location",
    label: "Where will you challenge yourself today?",
    options: challenges, // must include difficulty on each item
  },
  {
    id: "company",
    label: "Who will be with you?",
    options: [
      {
        id: Company.ALONE,
        label: "Alone",
        description: "Face it by yourself",
      },
      {
        id: Company.WITH_OTHERS,
        label: "With others",
        description: "Friends, family, or colleagues",
      },
    ],
  },
];

export default function ChallengeForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [customInput, setCustomInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dynamicSteps, setDynamicSteps] = useState<FormStep[]>(formSteps);

  // Difficulty tab state (only used on the "location" step)
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const currentStepData = dynamicSteps[currentStep];
  const currentStepId = currentStepData.id;
  const currentSelection = selectedOptions[currentStepId];
  const isLocationStep = currentStepId === "location";

  // For location step, filter by active tab; for others show all options
  const visibleOptions = useMemo(() => {
    if (!isLocationStep) return currentStepData.options;
    return currentStepData.options.filter(
      (o) => o.isCustom || o.difficulty === difficulty,
    );
  }, [currentStepData.options, isLocationStep, difficulty]);

  const handleSelect = (stepId: string, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [stepId]: optionId }));
  };

  const handleAddCustomOption = () => {
    const label = customInput.trim();
    if (!label) return;

    const trimmedLabel = label.replace(/\s+/g, "-");
    const newOption = {
      id: `custom-${trimmedLabel}`,
      label,
      description: "Custom option",
      isCustom: true,
      // attach current difficulty so it appears under the active tab
      ...(isLocationStep ? { difficulty } : {}),
    };

    setDynamicSteps((prev) =>
      prev.map((step) =>
        step.id === currentStepId
          ? { ...step, options: [...step.options, newOption] }
          : step,
      ),
    );

    // Auto-select the newly added option
    setSelectedOptions((prev) => ({ ...prev, [currentStepId]: newOption.id }));
    setCustomInput("");
  };

  const canGoNext = Boolean(currentSelection);

  const handleNext = () => {
    if (currentStep < dynamicSteps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    const option = dynamicSteps[0].options.filter(
      (d) => d.id === selectedOptions.location,
    );

    try {
      await createChallenge({
        data: {
          company: selectedOptions.company as Company,
          challengeOption: option[0] as Prisma.JsonObject,
          status: ChallengeStatus.NOT_STARTED,
        },
      });
      toast("challenge created", {
        position: "top-center",
        description: "Challenge ceated",
        action: {
          label: "Back to Challenge page",
          onClick: () => router.replace("/exposure"),
        },
      });
      setIsSubmitted(true);
    } catch {
      toast("something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center py-0">
      <div className="mx-auto w-full max-w-2xl">
        <div className="space-y-6">
          <div>
            <h5 className="font-light">{currentStepData.label}</h5>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Step {currentStep + 1} of {dynamicSteps.length}
              </span>
              <span className="text-muted-foreground text-sm">
                {Math.round(((currentStep + 1) / dynamicSteps.length) * 100)}%
              </span>
            </div>
            <div className="bg-muted h-2 w-full rounded-full">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / dynamicSteps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Difficulty Tabs (only on location step) */}
          {isLocationStep && (
            <div className="mb-4">
              <Tabs
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as Difficulty)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="easy">Easy</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                  <TabsTrigger value="hard">Hard</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Options (radio-style) */}
          <div
            className="space-y-3"
            role="radiogroup"
            aria-label={currentStepData.label}
          >
            {visibleOptions.map((option) => {
              const isSelected = currentSelection === option.id;
              return (
                <Card
                  key={option.id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(currentStepId, option.id);
                    }
                  }}
                  className={cn(
                    "cursor-pointer p-2 transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "hover:border-muted-foreground/50",
                  )}
                  onClick={() => handleSelect(currentStepId, option.id)}
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

            {isLocationStep && (
              // {/* Custom input (added under current difficulty on location step) */}
              <Card className="border-muted-foreground/30 border-2 border-dashed p-0">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <Input
                        placeholder={
                          isLocationStep
                            ? "Add your own challenge..."
                            : "Add your own option..."
                        }
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddCustomOption();
                        }}
                        className="placeholder:text-muted-foreground border-0 bg-transparent p-0 text-base focus-visible:ring-0"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={handleAddCustomOption}
                      disabled={!customInput.trim()}
                      className="h-8 w-8 bg-blue-500 p-0 hover:bg-blue-600"
                      aria-label="Add custom option"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            {currentStep === dynamicSteps.length - 1 && !isSubmitted && (
              <Button
                onClick={handleSubmit}
                disabled={!canGoNext}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
              >
                <span>Submit</span>
                <Check className="ml-1 h-4 w-4" />
              </Button>
            )}

            {currentStep !== dynamicSteps.length - 1 && (
              <Button
                onClick={handleNext}
                disabled={!canGoNext}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}

            {isSubmitted && (
              <Button
                onClick={() => router.replace("/")}
                className="flex items-center space-x-2 bg-black hover:bg-gray-700 disabled:opacity-50"
              >
                <span>Back Home</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
