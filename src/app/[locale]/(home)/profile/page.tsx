import { SettingsRowInput } from "./_components/General/SettingsRowInput";
import { Dob } from "./_components/Input/Dob/Dob";
import { Name } from "./_components/Input/Name/Name";
import { GenderPicker } from "./_components/Input/Gender/Gender";
import { requireAuth } from "@/lib/auth/require-auth";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "./_components/LanguageSwitcher/LanguageSwitcher";

import { DeleteAccountButton } from "@/components/DeleteAccountButton/DeleteAccountButton";
import { SignOutButton } from "@/components/SignOutButton/SignOutButton";
import { Appearance } from "./_components/Appearance/Appearance";
import { prisma } from "../../../../../lib/prisma";
import { AnxietyProfileCard } from "./_components/AnxietyProfileCard";
import { DerivedAnxietyProfile } from "../../(main)/anxietyProfile/_components/helpers/types";
import { AnxietyResultResponse } from "@/lib/ai/anxietyProfile/types";

export async function getServerAnxietyProfileEntry(userId: string): Promise<{
  id: string;
  result: AnxietyResultResponse;
  derivedProfile: DerivedAnxietyProfile;
} | null> {
  const entryResult = await prisma.anxietyProfileEntry.findFirst({
    where: {
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
      result: true,
      derivedProfile: true,
    },
  });

  if (!entryResult) {
    return null;
  }

  return {
    id: entryResult.id,
    result: entryResult.result as AnxietyResultResponse,
    derivedProfile: entryResult.derivedProfile as DerivedAnxietyProfile,
  };
}

export default async function Page() {
  const user = await requireAuth();
  const t = await getTranslations("account");
  const anxietyProfile = await getServerAnxietyProfileEntry(user.id);

  return (
    <div className="text-foreground space-y-6 p-4">
      <section className="surface-soft rounded-xl p-6 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <div>
            <h1 className="text-foreground text-xl font-semibold tracking-tight">
              {user.name || t("notSet")}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              {user.email}
            </p>
          </div>
        </div>
      </section>

      {anxietyProfile && <AnxietyProfileCard anxietyProfile={anxietyProfile} />}

      <div className="bg-border h-px w-full" />

      <section className="surface-soft rounded-xl p-4 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-foreground text-base font-semibold tracking-tight">
              {t("title")}
            </h4>
          </div>

          <div className="space-y-3">
            <Name label={user.name || t("notSet")} name={user.name ?? ""} />

            <SettingsRowInput
              label={t("email")}
              value={user.email || t("notSet")}
            />

            <Dob dob={user.dob} />

            <GenderPicker gender={user.gender ?? ""} />
            <Appearance />
          </div>

          <div className="bg-border h-px w-full" />

          <div className="flex items-center justify-between gap-3">
            <LanguageSwitcher />
            <SignOutButton />
          </div>

          <div className="pt-2">
            <DeleteAccountButton />
          </div>
        </div>
      </section>
    </div>
  );
}
