/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, User } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "./auth";

const prisma = new PrismaClient();

export async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw NextResponse.json({ error: "Unautharized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user || user.deletedAt) {
    throw NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { userId: user.id, user };
}

export function withAuth<
  T extends (
    req: Request,
    ctx: any,
    auth: { userId: string; user: User },
  ) => Promise<Response>,
>(handler: T) {
  return async (req: Request, ctx: any) => {
    try {
      const { userId, user } = await requireUser();
      return await handler(req, ctx, { userId, user });
    } catch (resp) {
      if (resp instanceof Response) return resp;
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  };
}
