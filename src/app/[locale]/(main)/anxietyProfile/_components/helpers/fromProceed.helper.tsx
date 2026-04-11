import { ActiveStepId } from "../../AnxietyScreeningForm";
import { AnxietyScreeningInput } from "./schema";

function hasAnswer(value: unknown): boolean {
  return value !== undefined && value !== null;
}

export function getCanProceedForStep(
  stepId: ActiveStepId,
  values: AnxietyScreeningInput,
): boolean {
  switch (stepId) {
    case "intro":
    case "review":
      return true;

    case "gad":
      return (
        hasAnswer(values.gadDuration) &&
        hasAnswer(values.gad7.feelingNervousOrOnEdge) &&
        hasAnswer(values.gad7.difficultyControllingWorry) &&
        hasAnswer(values.gad7.worryingTooMuchAboutDifferentThings) &&
        hasAnswer(values.gad7.troubleRelaxing) &&
        hasAnswer(values.gad7.restlessness) &&
        hasAnswer(values.gad7.irritability) &&
        hasAnswer(values.gad7.fearThatSomethingAwfulMayHappen)
      );

    case "panic": {
      const hadSurges = values.panic.hadSuddenFearSurgesLastMonth;
      if (!hasAnswer(hadSurges)) {
        return false;
      }

      // if the user answered "no", we do not require the panic follow-up questions.
      if (hadSurges === false) {
        return true;
      }

      const symptomsAtWorstPoint = values.panic.symptomsAtWorstPoint;
      const hasAnswersSymptoms = Object.values(symptomsAtWorstPoint!).every(
        (e) => !e,
      );

      if (!hasAnswer(symptomsAtWorstPoint)) {
        return false;
      }

      return (
        hasAnswer(values.panic.surgesPeakWithinMinutes) &&
        hasAnswer(values.panic.attackFrequencyLastMonth) &&
        hasAnswer(values.panic.attacksSeemedUnexpected) &&
        !hasAnswersSymptoms &&
        hasAnswer(values.panic.persistentConcernMoreThanOneMonth) &&
        hasAnswer(values.panic.maladaptiveBehaviorChangeMoreThanOneMonth)
      );
    }

    case "maintainers":
      if (
        !values.maintainingFactors ||
        !values.maintainingFactors.worry ||
        !values.maintainingFactors.panic
      ) {
        return false;
      }
      return (
        hasAnswer(values.maintainingFactors.worry.reassuranceSeeking) &&
        hasAnswer(values.maintainingFactors.worry.checkingAndResearching) &&
        hasAnswer(values.maintainingFactors.worry.overPreparing) &&
        hasAnswer(values.maintainingFactors.worry.avoidingUncertainty) &&
        hasAnswer(values.maintainingFactors.worry.mentalReviewing) &&
        hasAnswer(values.maintainingFactors.panic.bodyScanning) &&
        hasAnswer(values.maintainingFactors.panic.carryingSafetyItems) &&
        hasAnswer(values.maintainingFactors.panic.escapePlanning) &&
        hasAnswer(values.maintainingFactors.panic.avoidingPhysicalExertion) &&
        hasAnswer(values.maintainingFactors.panic.needingSafePersonOrExit)
      );

    case "impact":
      return (
        hasAnswer(values.impairment.home) &&
        hasAnswer(values.impairment.workOrStudy) &&
        hasAnswer(values.impairment.social)
      );

    case "ruleouts":
      return (
        hasAnswer(values.ruleOutFlags.symptomsOnlyDuringSubstanceUse) &&
        hasAnswer(
          values.ruleOutFlags.symptomsBetterExplainedByMedicalProblem,
        ) &&
        hasAnswer(values.ruleOutFlags.recentTraumaCueDominant) &&
        hasAnswer(values.ruleOutFlags.recentManiaLikeState) &&
        hasAnswer(values.safety.currentlyFeelsUnsafe)
      );

    default:
      return false;
  }
}
