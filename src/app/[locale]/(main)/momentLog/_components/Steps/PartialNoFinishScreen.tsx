import { Spinner } from "@/components/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { momentLogFormSchema } from "@/lib/zod.types";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import z from "zod";

export const PartialNoFinishScreen = ({ onNext }: { onNext(): void }) => {
  const t = useTranslations();
  const { getValues, formState } =
    useFormContext<z.infer<typeof momentLogFormSchema>>();

  const partialNoReason = getValues("actionTaken");
  const answer = t(`safetyBehavior.options.${partialNoReason}.answer`);
  return (
    <div className="w-full space-y-4">
      <div className="min-h-28 w-full space-y-2 rounded-2xl border-0 bg-white p-4 shadow-md">
        <div>
          <h3>
            {t(`safetyBehavior.label`)}:{" "}
            <i>{t(`safetyBehavior.options.${partialNoReason}.title`)}</i>
          </h3>
          <p className="text-xs font-extralight">
            {t(`safetyBehavior.options.${partialNoReason}.description`)}
          </p>
        </div>
        <div className="h-px w-3/4 bg-gray-200" />

        <p>
          {t("safetyBehavior.nextTime", {
            answer,
          })}
        </p>
      </div>
      <div className="w-auto pt-2 text-center">
        {formState.isSubmitting ? (
          <Button disabled className="bg-blue-500 hover:bg-blue-600">
            <Spinner />
            <span>{t("form.submitting")}</span>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {t("form.log")}
          </Button>
        )}
      </div>
    </div>
  );
};
