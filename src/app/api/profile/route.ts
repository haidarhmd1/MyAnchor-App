import { NextResponse } from "next/server";

import prisma from "../../../../lib/prisma";
import { UserSchema } from "@/lib/zod.types";
import { withAuth } from "@/lib/auth/auth-helpers";

export const PATCH = withAuth(async (request, _ctx, { userId }) => {
  const body = await request.json();

  const parsed = UserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
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
});
