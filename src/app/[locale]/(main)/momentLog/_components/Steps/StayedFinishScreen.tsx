import { Spinner } from "@/components/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { momentLogFormSchema } from "@/lib/zod.types";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import z from "zod";

export const StayedFinishScreen = ({ onNext }: { onNext(): void }) => {
  const t = useTranslations();
  const { formState } = useFormContext<z.infer<typeof momentLogFormSchema>>();
  return (
    <div className="w-full space-y-4">
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
