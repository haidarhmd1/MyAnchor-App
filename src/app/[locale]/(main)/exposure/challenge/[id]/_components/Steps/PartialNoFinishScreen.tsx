import { Spinner } from "@/components/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { ChallengeOutcomeSchema } from "@/lib/zod.types";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import z from "zod";

export const PartialNoFinishScreen = ({ onNext }: { onNext(): void }) => {
  const t = useTranslations();
  const { getValues, formState } =
    useFormContext<z.infer<typeof ChallengeOutcomeSchema>>();

  const partialNoReason = getValues("safetyBehavior");
  const answer = t(`safetyBehavior.options.${partialNoReason}.answer`);

  return (
    <div className="w-full space-y-4">
      <div className="surface-soft w-full space-y-4 rounded-3xl p-4 shadow-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {t("safetyBehavior.label")}
          </p>

          <p className="text-foreground text-base font-medium">
            {t(`safetyBehavior.options.${partialNoReason}.title`)}
          </p>
        </div>

        <div className="bg-border h-px w-full" />

        <div className="space-y-1">
          <p className="text-primary text-sm font-semibold">
            {t("safetyBehavior.nextTimeTitle")}
          </p>

          <p className="text-muted-foreground text-sm leading-6">{answer}</p>
        </div>
      </div>

      <div className="pt-2 text-center">
        {formState.isSubmitting ? (
          <Button
            disabled
            className="bg-primary text-primary-foreground rounded-2xl hover:opacity-95"
          >
            <Spinner />
            <span>{t("form.submitting")}</span>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            className="bg-primary text-primary-foreground rounded-2xl hover:opacity-95"
          >
            {t("form.done")}
          </Button>
        )}
      </div>
    </div>
  );
};
