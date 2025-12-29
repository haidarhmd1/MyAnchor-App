import createMiddleware from "next-intl/middleware";
import { auth } from "@/lib/auth/auth";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  // Run next-intl first so locale routing/redirects happen
  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
