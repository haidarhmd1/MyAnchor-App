import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compareSync } from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const PUBLIC_ROUTES = new Set<string>([
  "/signin",
  "/error",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
]);

// Public prefixes for assets/framework internals
const PUBLIC_PREFIXES = ["/_next", "/assets", "/images", "/api/auth"];

/** Return true if this pathname is public (no auth required) */
function isPublicPath(pathname: string) {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

/** Return true if this pathname must be protected */
function isProtectedPath(pathname: string) {
  return !isPublicPath(pathname);
}

export const authConfig = {
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  pages: {
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
        console.log("creds", creds);
        const email = String(creds?.email ?? "")
          .trim()
          .toLowerCase();
        const code = String(creds?.code ?? "").trim();
        if (!email || !code) return null;

        // --- DEV MASTER CODE BYPASS (non-production only) ---
        if (process.env.NODE_ENV !== "production") {
          const master = process.env.DEV_MASTER_OTP?.trim();
          const allow = true;
          // e.g. restrict to certain domains:
          // const allow = email.endsWith("@example.test") || email.endsWith("@localhost")

          if (master && code === master && allow) {
            let user = await prisma.user.findUnique({ where: { email } });
            console.log("user", user);
            if (!user) {
              user = await prisma.user.create({
                data: { email, emailVerified: new Date() },
              });
              await prisma.consent
                .create({
                  data: {
                    userId: user.id,
                    policy: "privacy_policy",
                    version: "v1.0",
                  },
                })
                .catch(() => {});
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
          where: { email, consumedAt: null, expiresAt: { gt: new Date() } },
          orderBy: { createdAt: "desc" },
        });
        if (!record) return null;

        const ok = compareSync(code, record.tokenHash);
        if (!ok) {
          await prisma.emailOTP.update({
            where: { id: record.id },
            data: { attempts: { increment: 1 } },
          });
          // audit failure without user
          await prisma.signInAudit
            .create({
              data: {
                userId: "anon",
                email,
                method: "email-otp",
                outcome: "failure",
                ip: req?.headers?.get("x-forwarded-for") ?? undefined,
                userAgent: req?.headers?.get("user-agent") ?? undefined,
              },
            })
            .catch(() => {});
          return null;
        }

        await prisma.emailOTP.update({
          where: { id: record.id },
          data: { consumedAt: new Date() },
        });

        // Upsert or get user
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email, emailVerified: new Date() },
          });
          // Record default consent version on first sign-in
          await prisma.consent
            .create({
              data: {
                userId: user.id,
                policy: "privacy_policy",
                version: "v1.0",
              },
            })
            .catch(() => {});
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
              ip: req?.headers?.get("x-forwarded-for") ?? undefined,
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
      const isLoggedIn = !!auth?.user;

      // Public paths always allowed
      if (!isProtectedPath(pathname)) return true;

      // Protected:
      if (!isLoggedIn) {
        const url = new URL("/signin", nextUrl);
        url.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
        return NextResponse.redirect(url);
      }

      // If logged in but session was nulled by callbacks (e.g., soft-deleted),
      // auth?.user will be undefined on subsequent requests and hit the branch above.
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
