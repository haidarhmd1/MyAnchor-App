import {
  OPTION_PARTICIPATE,
  OPTION_STAY,
  OPTION_STRETCH,
  SafetyBehaviorOptionItem,
} from "@/common/const/SafetyBehavior";
import { Engagement } from "@prisma/client";

export const BASE_STEP = [
  {
    id: "hadCompletedChallenge",
    titleKey: "challengeSteps.hadCompletedChallenge.title",
    subtitleKey: "challengeSteps.hadCompletedChallenge.subtitle",
  },
] as const;

export const STOP_REASONS = [
  {
    id: "safetyBehavior",
    titleKey: "challengeSteps.safetyBehavior.title",
    subtitleKey: "challengeSteps.safetyBehavior.subtitle",
  },
] as const;

export const PARTIAL_NO_FINISH_SCREEN = [
  {
    id: "partialNoFinishScreen",
    titleKey: "challengeSteps.partialNoScreen.title",
    subtitleKey: "challengeSteps.partialNoScreen.subtitle",
  },
] as const;

export const YES_FINISH_SCREEN = [
  {
    id: "yesFinishScreen",
    titleKey: "challengeSteps.yesFinishScreen.title",
    subtitleKey: "challengeSteps.yesFinishScreen.subtitle",
  },
] as const;

type BaseStep = (typeof BASE_STEP)[number];
type safetyBehavior = (typeof STOP_REASONS)[number];
type partialNoFinishScreen = (typeof PARTIAL_NO_FINISH_SCREEN)[number];
type yesFinishScreen = (typeof YES_FINISH_SCREEN)[number];

export type Step =
  | BaseStep
  | safetyBehavior
  | partialNoFinishScreen
  | yesFinishScreen;

export const engagementsafetyBehaviorMapper = (
  engagement: Engagement,
): SafetyBehaviorOptionItem[] => {
  switch (engagement) {
    case Engagement.STAY:
      return OPTION_STAY.options;
    case Engagement.PARTICIPATE:
      return OPTION_PARTICIPATE.options;
    case Engagement.STRETCH:
      return OPTION_STRETCH.options;
    default:
      return OPTION_STAY.options;
  }
};
