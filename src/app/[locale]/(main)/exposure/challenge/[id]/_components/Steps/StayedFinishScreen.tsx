import { Spinner } from "@/components/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { ChallengeOutcomeSchema } from "@/lib/zod.types";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import z from "zod";

export const StayedFinishScreen = ({ onNext }: { onNext(): void }) => {
  const t = useTranslations();
  const { formState } =
    useFormContext<z.infer<typeof ChallengeOutcomeSchema>>();

  return (
    <div className="w-full pt-2 text-center">
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
          {t("form.submit")}
        </Button>
      )}
    </div>
  );
};
