import { redirect } from "next/navigation";
import { auth } from "./auth";
import prisma from "../../../lib/prisma";

export async function requireAuth(callbackUrl?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      callbackUrl
        ? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : "/signin",
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.deletedAt) {
    redirect("/signin");
  }

  return { session, user };
}
