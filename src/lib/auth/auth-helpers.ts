/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "./auth";
import prisma from "../../../lib/prisma";
import { redirect } from "@/i18n/navigation";
import { Locale } from "next-intl";

export async function getUser() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user || user.deletedAt) return null;

  return { userId: user.id, user };
}

export async function getUserOrThrow() {
  const auth = await getUser();

  if (!auth) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { userId: auth.user.id, user: auth.user };
}
