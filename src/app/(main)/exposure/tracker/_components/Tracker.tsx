"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormStep {
  id: string;
  title: string;
  subtitle: string;
  options: {
    id: string;
    label: string;
    description: string;
    isCustom?: boolean;
  }[];
}

const formSteps: FormStep[] = [
  {
    id: "snapshot",
    title: "Snapshot",
    subtitle: "Where were you and what was happening?",
    options: [
      {
        id: "loc_home",
        label: "Home",
        description: "At home / familiar place",
      },
      {
        id: "loc_outside",
        label: "Outside",
        description: "Street, park, errands",
      },
      {
        id: "loc_work",
        label: "Work/School",
        description: "Tasks, meetings, classes",
      },
      {
        id: "loc_transport",
        label: "Transport",
        description: "Bus, train, car",
      },
      {
        id: "ctx_crowd",
        label: "Crowd/Queue",
        description: "Busy place or waiting",
      },
      {
        id: "ctx_quiet",
        label: "Quiet Moment",
        description: "No clear trigger",
      },
      { id: "with_alone", label: "Alone", description: "No one with me" },
      {
        id: "with_people",
        label: "With Others",
        description: "Friends/family/colleagues",
      },
    ],
  },
  {
    id: "body",
    title: "Body Sensations",
    subtitle: "What did you feel in your body?",
    options: [
      {
        id: "sens_heart",
        label: "Racing heart",
        description: "Fast/strong heartbeat",
      },
      {
        id: "sens_breath",
        label: "Breath felt tight",
        description: "Air hunger/short breath",
      },
      {
        id: "sens_dizzy",
        label: "Dizzy/unsteady",
        description: "Lightheaded/spinning",
      },
      {
        id: "sens_chest",
        label: "Chest tightness",
        description: "Pressure/tension",
      },
      {
        id: "sens_heat",
        label: "Warm flush",
        description: "Sudden heat/sweat",
      },
      {
        id: "sens_tingle",
        label: "Tingling",
        description: "Face/hands tingling",
      },
    ],
  },
  {
    id: "mind",
    title: "Thoughts in the Moment",
    subtitle: "What worries showed up?",
    options: [
      {
        id: "th_heart",
        label: "Heart problem",
        description: "“This is dangerous”",
      },
      {
        id: "th_breath",
        label: "Can’t breathe",
        description: "“I’ll suffocate/faint”",
      },
      {
        id: "th_control",
        label: "Lose control",
        description: "“I’ll go crazy/black out”",
      },
      {
        id: "th_escape",
        label: "Need to escape",
        description: "“I must get out”",
      },
      {
        id: "th_look",
        label: "People will notice",
        description: "Embarrassment/judgment",
      },
      {
        id: "th_unknown",
        label: "No clear thought",
        description: "Just strong fear",
      },
    ],
  },
  {
    id: "actions",
    title: "What Did You Do?",
    subtitle: "Be honest and kind to yourself",
    options: [
      {
        id: "act_stayed",
        label: "Stayed put",
        description: "Rode the wave in place",
      },
      {
        id: "act_allowed",
        label: "Allowed sensations",
        description: "Did nothing, observed",
      },
      {
        id: "act_left",
        label: "Left the situation",
        description: "Escaped to feel safe",
      },
      {
        id: "act_reassure",
        label: "Sought reassurance",
        description: "Called/texted/Googled",
      },
      {
        id: "act_checked",
        label: "Checked body",
        description: "Pulse/O2 monitoring",
      },
      {
        id: "act_breath_ctrl",
        label: "Controlled breathing",
        description: "Used as rescue",
      },
    ],
  },
  {
    id: "learning_plan",
    title: "What I Learned & Next Step",
    subtitle: "Keep it small and doable",
    options: [
      {
        id: "learn_passes",
        label: "It passed by itself",
        description: "Wave rose and fell",
      },
      {
        id: "learn_safe",
        label: "Uncomfortable ≠ danger",
        description: "Body can handle it",
      },
      {
        id: "learn_stay_helped",
        label: "Staying helped",
        description: "Fear dropped when I stayed",
      },
      {
        id: "plan_repeat",
        label: "Repeat here",
        description: "Practice same context",
      },
      {
        id: "plan_longer",
        label: "Stay longer",
        description: "Ride full peak next time",
      },
      {
        id: "plan_drop",
        label: "Drop one safety",
        description: "Pick one to let go",
      },
    ],
  },
];

export default function Tracker() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});
  const [customInput, setCustomInput] = useState("");
  const [dynamicSteps, setDynamicSteps] = useState<FormStep[]>(formSteps);

  const handleOptionToggle = (stepId: string, optionId: string) => {
    setSelectedOptions((prev) => {
      const stepSelections = prev[stepId] || [];
      const isSelected = stepSelections.includes(optionId);

      return {
        ...prev,
        [stepId]: isSelected
          ? stepSelections.filter((id) => id !== optionId)
          : [...stepSelections, optionId],
      };
    });
  };

  const handleAddCustomOption = () => {
    if (!customInput.trim()) return;

    const currentStepId = dynamicSteps[currentStep].id;
    const newOptionId = `custom-${Date.now()}`;

    setDynamicSteps((prev) =>
      prev.map((step) =>
        step.id === currentStepId
          ? {
              ...step,
              options: [
                ...step.options,
                {
                  id: newOptionId,
                  label: customInput.trim(),
                  description: "Custom option",
                  isCustom: true,
                },
              ],
            }
          : step,
      ),
    );

    setSelectedOptions((prev) => ({
      ...prev,
      [currentStepId]: [...(prev[currentStepId] || []), newOptionId],
    }));

    setCustomInput("");
  };

  const canGoNext = () => {
    const currentStepId = dynamicSteps[currentStep].id;
    return selectedOptions[currentStepId]?.length > 0;
  };

  const handleNext = () => {
    if (currentStep < dynamicSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", selectedOptions);
    alert("Form submitted successfully!");
  };

  const currentStepData = dynamicSteps[currentStep];
  const currentSelections = selectedOptions[currentStepData.id] || [];

  return (
    <div className="flex items-center justify-center py-0">
      <div className="mx-auto w-full max-w-2xl">
        {/* Form content */}
        <div className="space-y-6">
          <div>
            <h5 className="font-light">{currentStepData.subtitle}</h5>
            <h2 className="text-foreground text-2xl">
              {currentStepData.title}
            </h2>
          </div>

          {/* Progress indicator */}
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
          {/* Options */}
          <div className="space-y-3">
            {currentStepData.options.map((option) => {
              const isSelected = currentSelections.includes(option.id);

              return (
                <Card
                  key={option.id}
                  className={cn(
                    "cursor-pointer p-2 transition-all duration-200 hover:shadow-md",
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "hover:border-muted-foreground/50",
                  )}
                  onClick={() =>
                    handleOptionToggle(currentStepData.id, option.id)
                  }
                >
                  <CardContent className="p-2">
                    <div className="flex items-start space-x-3">
                      <div
                        className={cn(
                          "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors",
                          isSelected
                            ? "border-blue-500 bg-blue-500"
                            : "border-muted-foreground/30",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
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

            {/* Custom input section */}
            <Card className="border-muted-foreground/30 border-2 border-dashed p-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Add your own option..."
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddCustomOption();
                        }
                      }}
                      className="placeholder:text-muted-foreground border-0 bg-transparent p-0 text-base focus-visible:ring-0"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddCustomOption}
                    disabled={!customInput.trim()}
                    className="h-8 w-8 bg-blue-500 p-0 hover:bg-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
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

            {currentStep === dynamicSteps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!canGoNext()}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600"
              >
                <span>Submit</span>
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
