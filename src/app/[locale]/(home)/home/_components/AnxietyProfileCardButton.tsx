import { SignInOverlayButton } from "@/components/SignInOverlayButton/SignInOverlayButton";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getUser } from "@/lib/auth/auth-helpers";
import { Brain } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getServerAnxietyProfileEntry } from "../../profile/page";

export const AnxietyProfileButtonCard = async () => {
  const auth = await getUser();
  const t = await getTranslations();

  if (!auth) {
    return <UnauthenticatedAnxietyProfileCard />;
  }

  const hasAnxietyProfile = await getServerAnxietyProfileEntry(auth.userId);

  return (
    <Link
      href="/anxietyProfile"
      className="basis-2/3"
      style={{ display: "contents" }}
    >
      <Card className="h-full w-full rounded-lg p-4 transition will-change-transform active:scale-[0.98]">
        <div className="flex gap-2">
          <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
            <Brain className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold">
            {t(hasAnxietyProfile ? "insightsDone" : "insightsPending")}
          </p>
        </div>
      </Card>
    </Link>
  );
};

export async function UnauthenticatedAnxietyProfileCard() {
  const t = await getTranslations();

  return (
    <SignInOverlayButton>
      <Card className="h-full w-full rounded-lg p-4 transition will-change-transform active:scale-[0.98]">
        <div className="flex gap-2">
          <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
            <Brain className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold">{t("insightsPending")}</p>
        </div>
      </Card>
    </SignInOverlayButton>
  );
}
