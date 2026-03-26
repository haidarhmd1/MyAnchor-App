import { Spinner } from "@/components/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { momentLogFormSchema } from "@/lib/zod.types";
import { useLocale, useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import z from "zod";
import { toRenderSections } from "./FinishScreen.helper";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getReasoningPreview } from "@/lib/api";
import { useEffect } from "react";

export const FinishScreen = ({ onNext }: { onNext(): void }) => {
  const locale = useLocale() as "en" | "de" | "ar" | "ar-LB";
  const t = useTranslations();
  const { formState, getValues, setValue } =
    useFormContext<z.infer<typeof momentLogFormSchema>>();

  const location = getValues("location");
  const symptoms = getValues("symptoms");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reasoningPreview", location, symptoms, locale],
    queryFn: async () => {
      const response = await getReasoningPreview({
        data: {
          location,
          symptoms,
          locale,
        },
      });

      setValue("reasoningEn", response.reasoningEn);
      setValue("reasoning", response.reasoning);
      setValue("reasoningLocale", response.reasoningLocale);

      return response;
    },
    enabled: Boolean(location && symptoms?.length),
  });

  useEffect(() => {
    setValue("reasoningEn", undefined);
    setValue("reasoning", undefined);
    setValue("reasoningLocale", undefined);
  }, [location, symptoms, locale, setValue]);

  if (isError) {
    return (
      <div className="w-full">
        <div className="rounded-3xl border border-red-400 bg-red-100 p-4 shadow-md">
          <p className="text-sm font-medium">{t("deleteAccount.error")}</p>
        </div>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="w-full">
        <div className="space-y-4">
          <div className="space-y-6">
            <h5>{t("common.loading")}</h5>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-gray-200" />
              <Skeleton className="h-32 w-full bg-gray-200" />
              <Skeleton className="h-12 w-full bg-gray-200" />
              <Skeleton className="h-12 w-full bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const reasoning = data?.reasoning;
  const sections = reasoning ? toRenderSections(reasoning) : [];

  return (
    <div className="w-full">
      <div className="space-y-4">
        {sections.map((section, index) => {
          switch (section.type) {
            case "title":
              return (
                <h3 key={index} className="text-lg font-medium text-black">
                  {section.content}
                </h3>
              );

            case "intro":
              return (
                <div
                  key={index}
                  className="rounded-3xl border border-blue-400 bg-blue-100 p-4 shadow-md"
                >
                  <p className="text-sm leading-6">{section.content}</p>
                </div>
              );

            case "text":
              return (
                <section
                  key={index}
                  className="space-y-2 rounded-3xl border border-green-400 bg-green-100 p-4 shadow-md"
                >
                  <h3 className="text-md truncate font-medium text-black">
                    {t(`aiResponseMomentLog.${section.id}`)}
                  </h3>
                  <p className="text-sm leading-6">{section.content}</p>
                </section>
              );

            case "steps":
              return (
                <section
                  key={index}
                  className="space-y-2 rounded-3xl border border-yellow-400 bg-yellow-100 p-4 shadow-md"
                >
                  <h3 className="text-md truncate font-medium text-black">
                    {t(`aiResponseMomentLog.${section.id}`)}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-sm leading-6">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              );

            case "red_flags":
              return (
                <section
                  key={index}
                  className="space-y-2 rounded-3xl border border-red-400 bg-red-100 p-4 shadow-md"
                >
                  <h3 className="text-md truncate font-medium text-black">
                    {t(`aiResponseMomentLog.${section.id}`)}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-sm leading-6">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              );

            case "symptoms":
              return (
                <section key={index} className="space-y-2">
                  <h3 className="text-md truncate font-medium text-black">
                    {t(`aiResponseMomentLog.${section.id}`)}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item, i) => (
                      <div key={i} className="rounded-xl border p-3">
                        <div className="text-sm font-medium">
                          {t(`taxonomy.SYMPTOM.${item.symptom}.label`)}
                        </div>
                        <div className="text-sm leading-6 opacity-80">
                          {item.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "affirmation":
              return (
                <section
                  key={index}
                  className="mb-8 rounded-xl border border-green-400 bg-green-100 p-3 shadow-lg"
                >
                  <div className="text-sm font-medium">
                    {t(`aiResponseMomentLog.${section.id}`)}
                  </div>
                  <p className="text-sm leading-6">{section.content}</p>
                </section>
              );

            default:
              return null;
          }
        })}
      </div>

      <div className="sticky bottom-0 w-full rounded-lg bg-white/60 pt-4 pb-4 text-center">
        {formState.isSubmitting ? (
          <Button
            disabled={isLoading || formState.isSubmitting}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Spinner />
            <span>{t("form.submitting")}</span>
          </Button>
        ) : (
          <Button
            type="button"
            disabled={isLoading || sections.length === 0}
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
