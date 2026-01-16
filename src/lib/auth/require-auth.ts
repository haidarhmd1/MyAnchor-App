import { redirect } from "next/navigation";
import { getUser } from "./auth-helpers";
import { Locale } from "next-intl";

export async function requireAuth(callbackUrl?: string, locale: Locale = "en") {
  const auth = await getUser();
  if (!auth) {
    const signin = callbackUrl
      ? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/signin";

    redirect(locale ? `/${locale}${signin}` : signin);
  }
  return auth.user;
}
