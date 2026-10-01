import { NextRequest, NextResponse } from "next/server";
import { UserSchema } from "@/lib/zod.types";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import z from "zod";
import { prisma } from "../../../../lib/prisma";
import { apiErrorResponse } from "@/lib/api-errors";

export const PATCH = async (request: NextRequest) => {
  try {
    const { userId } = await getUserOrThrow();
    const body = await request.json();

    const parsed = UserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parsed.error) },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        name: true,
        email: true,
        gender: true,
        dob: true,
      },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return apiErrorResponse(error, "profile_update_failed", request);
  }
};
