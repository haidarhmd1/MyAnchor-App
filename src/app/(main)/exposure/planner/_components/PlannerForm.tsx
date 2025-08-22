"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormStep {
  id: string;
  label: string;
  description?: string;
  options: {
    id: string;
    label: string;
    description: string;
    isCustom?: boolean;
    difficulty?: "easy" | "medium" | "hard";
  }[];
}

const formSteps: FormStep[] = [
  {
    id: "location",
    label: "Where will you challenge yourself today?",
    options: [
      {
        id: "home",
        label: "Home",
        description: "Familiar place, low difficulty",
        difficulty: "easy",
      },
      {
        id: "outside",
        label: "Outside",
        description: "Street, park, small errands",
        difficulty: "medium",
      },
      {
        id: "work",
        label: "Work/School",
        description: "Tasks, meetings, classes",
        difficulty: "medium",
      },
      {
        id: "transport",
        label: "Transport",
        description: "Bus, train, car rides",
        difficulty: "hard",
      },
      {
        id: "crowd",
        label: "Crowd/Queue",
        description: "Busy shops, waiting in line",
        difficulty: "hard",
      },

      // Social & events
      {
        id: "event_birthday",
        label: "Birthday",
        description: "Attend a birthday gathering",
        difficulty: "medium",
      },
      {
        id: "event_company",
        label: "Company Event",
        description: "Work social, offsite, party",
        difficulty: "hard",
      },
      {
        id: "event_gathering",
        label: "Friends Gathering",
        description: "Small/medium social meetup",
        difficulty: "medium",
      },
      {
        id: "event_festival",
        label: "Festival/Concert",
        description: "Large crowd, loud music",
        difficulty: "hard",
      },

      // Travel specifics
      {
        id: "travel_airport",
        label: "Airport",
        description: "Check-in, security, gate",
        difficulty: "hard",
      },
      {
        id: "travel_flight",
        label: "Flight",
        description: "Short- or long-haul flight",
        difficulty: "hard",
      },
      {
        id: "transport_rideshare",
        label: "Ride Share/Taxi",
        description: "Uber/Taxi alone",
        difficulty: "medium",
      },

      // Everyday public places
      {
        id: "shopping_supermarket",
        label: "Supermarket",
        description: "Aisles, checkout line",
        difficulty: "medium",
      },
      {
        id: "mall",
        label: "Shopping Mall",
        description: "Enclosed, busy space",
        difficulty: "medium",
      },
      {
        id: "dining_restaurant",
        label: "Restaurant/Café",
        description: "Stay through full meal",
        difficulty: "medium",
      },
      {
        id: "cinema",
        label: "Cinema/Theater",
        description: "Sit through screening/show",
        difficulty: "medium",
      },
      {
        id: "gym",
        label: "Gym/Class",
        description: "Tolerate heartbeat sensations",
        difficulty: "medium",
      },
      {
        id: "religious_service",
        label: "Religious Service",
        description: "Stay for full service",
        difficulty: "medium",
      },

      // Performance/interaction
      {
        id: "presentation",
        label: "Presentation/Meeting",
        description: "Speak or stay present",
        difficulty: "hard",
      },
      {
        id: "interview",
        label: "Interview",
        description: "Job/School interview",
        difficulty: "hard",
      },
      {
        id: "phone_call",
        label: "Phone Call",
        description: "Make/receive & stay on call",
        difficulty: "easy",
      },
      {
        id: "video_call",
        label: "Video Call",
        description: "Camera on, stay engaged",
        difficulty: "medium",
      },

      // Movement & confined spaces
      {
        id: "elevator",
        label: "Elevator",
        description: "Ride and remain inside",
        difficulty: "medium",
      },
      {
        id: "bridge_tunnel",
        label: "Bridge/Tunnel",
        description: "Cross or drive through",
        difficulty: "hard",
      },
      {
        id: "highway_driving",
        label: "Highway Driving",
        description: "Sustained speed traffic",
        difficulty: "hard",
      },

      // Medical contexts
      {
        id: "medical_dentist",
        label: "Dentist",
        description: "Sit through appointment",
        difficulty: "hard",
      },
      {
        id: "medical_hospital",
        label: "Hospital/Clinic",
        description: "Waiting room, procedures",
        difficulty: "hard",
      },

      // Gentle starters
      {
        id: "night_walk",
        label: "Night Walk",
        description: "Short evening neighborhood walk",
        difficulty: "easy",
      },

      // Custom
      {
        id: "custom_location",
        label: "Custom Location",
        description: "Write your own",
        isCustom: true,
      },
    ],
  },
  {
    id: "company",
    label: "Who will be with you?",
    options: [
      {
        id: "alone",
        label: "Alone",
        description: "Face it by yourself",
        difficulty: "hard",
      },
      {
        id: "with_others",
        label: "With others",
        description: "Friends, family, or colleagues",
        difficulty: "medium",
      },
    ],
  },
];

export default function PlannerForm() {
  const [currentStep, setCurrentStep] = useState(0);

  // One selection per step: { [stepId]: optionId }
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const [customInput, setCustomInput] = useState("");
  const [dynamicSteps, setDynamicSteps] = useState<FormStep[]>(formSteps);

  const handleSelect = (stepId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [stepId]: optionId, // single-select: replace any previous selection
    }));
  };

  const handleAddCustomOption = () => {
    if (!customInput.trim()) return;

    const currentStepId = dynamicSteps[currentStep].id;
    const newOptionId = `custom-${Date.now()}`;
    const newOption = {
      id: newOptionId,
      label: customInput.trim(),
      description: "Custom option",
      isCustom: true,
    };

    setDynamicSteps((prev) =>
      prev.map((step) =>
        step.id === currentStepId
          ? { ...step, options: [...step.options, newOption] }
          : step,
      ),
    );

    // Auto-select the newly added option
    setSelectedOptions((prev) => ({ ...prev, [currentStepId]: newOptionId }));
    setCustomInput("");
  };

  const canGoNext = () => {
    const currentStepId = dynamicSteps[currentStep].id;
    return Boolean(selectedOptions[currentStepId]);
  };

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

  const handleSubmit = () => {
    console.log("Form submitted:", selectedOptions);
    alert("Form submitted successfully!");
  };

  const currentStepData = dynamicSteps[currentStep];
  const currentSelection = selectedOptions[currentStepData.id];

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

          {/* Options (radiogroup) */}
          <div
            className="space-y-3"
            role="radiogroup"
            aria-label={currentStepData.label}
          >
            {currentStepData.options.map((option) => {
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
                      handleSelect(currentStepData.id, option.id);
                    }
                  }}
                  className={cn(
                    "cursor-pointer p-2 transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "hover:border-muted-foreground/50",
                  )}
                  onClick={() => handleSelect(currentStepData.id, option.id)}
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

            {/* Custom input */}
            <Card className="border-muted-foreground/30 border-2 border-dashed p-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Add your own option..."
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
                <Check className="ml-1 h-4 w-4" />
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
