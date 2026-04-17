import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { SignInOverlayButton } from "@/components/SignInOverlayButton/SignInOverlayButton";
import { getUser } from "@/lib/auth/auth-helpers";
import { Plus } from "lucide-react";
import MomentLogForm from "./_components/MomentLogForm";

export default async function Page() {
  const isUserAuth = await getUser();
  return isUserAuth ? (
    <section className="bg-background text-foreground py-4">
      <div className="mx-auto w-full max-w-2xl">
        <MomentLogForm />
      </div>
    </section>
  ) : (
    <section className="bg-background text-foreground py-4">
      <div className="mx-auto w-full max-w-2xl">
        <UnauthenticatedMomentLog />
      </div>
    </section>
  );
}

const UnauthenticatedMomentLog = async () => {
  const t = await getTranslations();

  return (
    <section className="bg-background text-foreground space-y-4 px-4 py-4">
      <Card className="border-border bg-card border shadow-sm active:scale-[0.98]">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-sm leading-6">
            {t("momentLog.noEntries")}
          </p>
        </CardContent>
      </Card>

      <SignInOverlayButton>
        <div className="h-96 w-full">
          <div className="border-border bg-card mt-6 rounded-4xl border border-dashed shadow-sm">
            <div className="flex items-center gap-3 p-4">
              <div className="bg-accent text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
                <Plus className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h3 className="text-foreground text-base font-semibold">
                  {t("momentLog.entry.title")}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </SignInOverlayButton>
    </section>
  );
};

export const metadata: Metadata = {
  title: "⚓ MyAnchor - New Moment Log",
};
