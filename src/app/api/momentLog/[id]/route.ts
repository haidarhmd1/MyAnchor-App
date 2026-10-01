import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { apiErrorResponse } from "@/lib/api-errors";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { userId } = await getUserOrThrow();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing entry id" }, { status: 400 });
    }

    const existingEntry = await prisma.momentLog.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    await prisma.momentLog.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error, "moment_log_delete_failed", _);
  }
}
