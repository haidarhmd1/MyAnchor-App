import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { getTranslations } from "next-intl/server";

export const SignInOverlayButton = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const t = await getTranslations("auth.required");

  return (
    <div className="grid">
      <div className="pointer-events-none col-start-1 row-start-1 w-full blur-[3px] saturate-75 select-none">
        {children}
      </div>

      <div className="z-10 col-start-1 row-start-1 m-auto w-11/12 max-w-md">
        <div className="border-border/70 bg-card/85 rounded-3xl border p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <p className="text-card-foreground text-sm leading-6 font-medium">
              {t("title")}
            </p>

            <Link href="/signin" className="ml-auto shrink-0">
              <Button
                type="button"
                className="bg-primary text-primary-foreground rounded-2xl hover:opacity-95"
              >
                {t("action")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
