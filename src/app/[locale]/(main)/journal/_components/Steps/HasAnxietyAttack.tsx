"use client";

import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormJournalType } from "../helper";
import { useTranslations } from "next-intl";

export function HasAnxietyAttackStep({
  onNext,
}: {
  onNext(): void;
  onPrev?: () => void;
}) {
  const t = useTranslations("form");
  const { setValue } = useFormContext<FormJournalType>();

  return (
    <div className="space-y-6 text-center">
      <Image
        className="m-auto"
        alt="panic_attack_illustration"
        src="/illustration/compressed_journal_pa.webp"
        width={200}
        height={200}
      />
      <div className="flex w-full flex-row justify-between p-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValue("hasAnxietyAttack", true, { shouldDirty: true });
            onNext();
          }}
        >
          {t("yes")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValue("hasAnxietyAttack", false, { shouldDirty: true });
            onNext();
          }}
        >
          {t("no")}
        </Button>
      </div>
    </div>
  );
}
