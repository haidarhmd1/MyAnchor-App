import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function requireAuth(callbackUrl?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      callbackUrl
        ? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : "/signin",
    );
  }
  return session.user; // guaranteed to have user.id
}
