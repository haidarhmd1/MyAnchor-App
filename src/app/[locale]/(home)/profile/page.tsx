import { SettingsRowInput } from "./_components/General/SettingsRowInput";
import { Dob } from "./_components/Input/Dob/Dob";
import { Name } from "./_components/Input/Name/Name";
import { GenderPicker } from "./_components/Input/Gender/Gender";
import { requireAuth } from "@/lib/auth/require-auth";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "./_components/LanguageSwitcher/LanguageSwitcher";
import { SignOutButton } from "@/components/SignOutButton/SignOutButton";
import { DeleteAccountButton } from "@/components/DeleteAccountButton/DeleteAccountButton";

export default async function Page() {
  const { user } = await requireAuth();
  const t = await getTranslations("account");

  return (
    <div>
      <div className="p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-7 flex-col items-center justify-start">
              <div className="justify-start text-center text-xl leading-7 font-bold text-neutral-900">
                {user.name || null}
              </div>
            </div>
            <div className="flex flex-col items-center justify-start">
              <div className="justify-start text-center text-base leading-normal font-normal text-slate-500">
                {user.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-4">
        <h4>{t("title")}</h4>

        <Name label={user.name || t("notSet")} name={user.name ?? ""} />

        <SettingsRowInput
          label={t("email")}
          value={user.email || t("notSet")}
        />

        <Dob dob={user.dob} />

        <GenderPicker
          label={user.gender || t("notSet")}
          gender={user.gender ?? ""}
        />
        <div className="my-4 h-px w-full bg-gray-300" />
        <div className="flex justify-between">
          <LanguageSwitcher />
          <SignOutButton />
        </div>
        <div className="mt-4 flex w-full">
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
