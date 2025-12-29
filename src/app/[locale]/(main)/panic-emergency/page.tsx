import { Grounding } from "./_components/Grounding/Grounding";
import { BoxBreathing } from "./_components/BoxBreathing/BoxBreathing";
import { PhysicalAnchor } from "./_components/PhysicalAnchor/PhysicalAnchor";
import { PositiveReminder } from "./_components/PositiveReminder/PositiveReminder";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("panicSupportPage");

  return (
    <div className="p-4">
      <h2 className="mb-4 text-center">{t("title")}</h2>

      <p className="justify-start self-stretch text-center text-base leading-normal font-normal text-neutral-900">
        {t("description")}
      </p>

      <div className="mt-8">
        <h4 className="font-bold">{t("quickActions")}</h4>

        <div className="mt-4 space-y-4">
          <Grounding />
          <BoxBreathing />
          <PhysicalAnchor />
          <PositiveReminder />
        </div>
      </div>
    </div>
  );
}
