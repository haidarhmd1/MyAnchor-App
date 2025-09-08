import { auth } from "@/lib/auth";
import { DateTime } from "luxon";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function authCheck() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const expires = DateTime.fromISO(session.expires);
  if (!expires.isValid || expires <= DateTime.now()) {
    redirect("/");
  }

  const userId = session.user?.id;
  if (!userId) {
    redirect("/");
  }
}

export async function apiReqAuthCheck() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const expires = DateTime.fromISO(session.expires);
  if (!expires.isValid || expires <= DateTime.now()) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  const userId = session.user?.id;
  if (!userId) {
    // Ensure you add user.id to the session in your NextAuth callbacks
    return NextResponse.json(
      { error: "Session missing user id" },
      { status: 400 },
    );
  }
  return userId;
}
