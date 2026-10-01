import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { OTP_MAX_ATTEMPTS } from "./otp";
import { getClientAddress } from "@/lib/rate-limit";

// Keep in sync with your next-intl locales:
const LOCALES = ["en", "de", "ar", "ar-LB"] as const;
type AppLocale = (typeof LOCALES)[number];

function getLocaleFromPath(pathname: string): AppLocale | null {
  const first = pathname.split("/")[1];
  return (LOCALES as readonly string[]).includes(first)
    ? (first as AppLocale)
    : null;
}

function stripLocale(pathname: string) {
  const locale = getLocaleFromPath(pathname);
  if (!locale) return { locale: null as AppLocale | null, path: pathname };
  const path =
    pathname === `/${locale}` ? "/" : pathname.replace(`/${locale}`, "");
  return { locale, path };
}

const PUBLIC_ROUTES = new Set<string>([
  "/signin",
  "/error",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/manifest.webmanifest",
  "/sw.js",
  "/home",
  "/education",
  "/exercises",
  "/exposure",
  "/momentLog",
  "/tip",
]);

const PUBLIC_PREFIXES = [
  "/_next",
  "/assets",
  "/images",
  "/icons",
  "/api/auth",
  "/home",
  "/education",
  "/exercises",
  "/tip",
];

function isPublicPath(pathname: string) {
  const { path } = stripLocale(pathname);

  if (PUBLIC_ROUTES.has(path)) return true;
  return PUBLIC_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}

function isProtectedPath(pathname: string) {
  return !isPublicPath(pathname);
}

export const authConfig = {
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    // keep these “base” (without locale) — we’ll localize in authorized()
    signIn: "/signin",
    error: "/error",
  },
  providers: [
    Credentials({
      id: "otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        code: { label: "Code", type: "text" },
      },
      authorize: async (creds, req) => {
        const email = String(creds?.email ?? "")
          .trim()
          .toLowerCase();
        const code = String(creds?.code ?? "").trim();
        if (!email || !code) return null;

        // --- DEV MASTER CODE BYPASS (non-production only) ---
        if (process.env.NODE_ENV !== "production") {
          const master = process.env.DEV_MASTER_OTP?.trim();
          const allowedEmails = (process.env.DEV_MASTER_OTP_EMAILS ?? "")
            .split(",")
            .map((value) => value.trim().toLowerCase())
            .filter(Boolean);
          const allow = allowedEmails.includes(email);

          if (master && code === master && allow) {
            let user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
              user = await prisma.user.create({
                data: { email, emailVerified: new Date() },
              });
            }
            if (user.deletedAt) {
              return null;
            }

            await prisma.signInAudit
              .create({
                data: {
                  userId: user.id,
                  email,
                  method: "email-otp(master)",
                  outcome: "success",
                  ip: "dev-master",
                  userAgent: "dev-master",
                },
              })
              .catch(() => {});

            return {
              id: user.id,
              email: user.email ?? undefined,
              name: user.name ?? undefined,
            };
          }
        }
        // --- END DEV MASTER CODE BYPASS ---

        const record = await prisma.emailOTP.findFirst({
          where: {
            email,
            consumedAt: null,
            expiresAt: { gt: new Date() },
            attempts: { lt: OTP_MAX_ATTEMPTS },
          },
          orderBy: { createdAt: "desc" },
        });
        if (!record) return null;

        const ok = await compare(code, record.tokenHash);
        if (!ok) {
          await prisma.emailOTP.updateMany({
            where: {
              id: record.id,
              consumedAt: null,
              attempts: { lt: OTP_MAX_ATTEMPTS },
            },
            data: { attempts: { increment: 1 } },
          });

          await prisma.signInAudit
            .create({
              data: {
                email,
                method: "email-otp",
                outcome: "failure",
                ip: req ? (getClientAddress(req) ?? undefined) : undefined,
                userAgent: req?.headers?.get("user-agent") ?? undefined,
              },
            })
            .catch(() => {});
          return null;
        }

        // updateMany makes one-time consumption atomic: if a concurrent request
        // consumed the same code first, this request is rejected.
        const consumed = await prisma.emailOTP.updateMany({
          where: {
            id: record.id,
            consumedAt: null,
            expiresAt: { gt: new Date() },
            attempts: { lt: OTP_MAX_ATTEMPTS },
          },
          data: { consumedAt: new Date() },
        });
        if (consumed.count !== 1) return null;

        // Upsert or get user
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email, emailVerified: new Date() },
          });
        }

        // Prevent sign-in if soft-deleted
        if (user.deletedAt) {
          // Optional: return null to block with a generic message
          return null;
        }

        await prisma.signInAudit
          .create({
            data: {
              userId: user.id,
              email,
              method: "email-otp",
              outcome: "success",
              ip: req ? (getClientAddress(req) ?? undefined) : undefined,
              userAgent: req?.headers?.get("user-agent") ?? undefined,
            },
          })
          .catch(() => {});

        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.uid) {
        // @ts-expect-error add id to session.user
        session.user.id = token.uid;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const pathname = nextUrl.pathname;

      // Public paths always allowed (locale-aware)
      if (!isProtectedPath(pathname)) return true;

      const isLoggedIn = !!auth?.user;

      if (!isLoggedIn) {
        // Redirect to localized signin (if locale exists in current URL)
        const locale = getLocaleFromPath(pathname);
        const signinPath = locale ? `/${locale}/home` : "/home";

        // Avoid redirect loops: if we are already on signin, allow
        const { path } = stripLocale(pathname);
        if (path === "/signin") return true;

        const url = new URL(signinPath, nextUrl);
        // url.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
        return NextResponse.redirect(url);
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth(authConfig);
