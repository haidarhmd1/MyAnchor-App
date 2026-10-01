import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { apiErrorResponse } from "@/lib/api-errors";
import { prisma } from "../../../../lib/prisma";
import { createAnxietyProfilePost } from "./handler";

export const GET = async (request: Request) => {
  try {
    const { userId } = await getUserOrThrow();

    const anxietyProfile = await prisma.anxietyProfileEntry.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ anxietyProfile }, { status: 200 });
  } catch (error) {
    return apiErrorResponse(error, "anxiety_profile_read_failed", request);
  }
};

export const POST = createAnxietyProfilePost();
