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
      <div className="pointer-events-none col-start-1 row-start-1 w-full blur-sm">
        {children}
      </div>

      <div className="z-10 col-start-1 row-start-1 m-auto flex w-11/12 items-center gap-3 rounded-3xl bg-black/40 p-4">
        <p className="text-sm text-white">{t("title")}</p>

        <Link href="/signin" className="ml-auto">
          <Button type="button">{t("action")}</Button>
        </Link>
      </div>
    </div>
  );
};
