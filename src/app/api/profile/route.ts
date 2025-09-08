// app/api/profile/route.ts
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { Gender } from "@prisma/client";
import prisma from "../../../../lib/prisma";

type ProfilePatch = Partial<{
  name: string | null;
  gender: Gender | null;
  dob: string | null; // ISO string | null to clear | omit to leave unchanged
  image: string | null;
}>;

type UpdateData = {
  name?: string | null;
  gender?: Gender | null;
  image?: string | null;
  dob?: Date | null;
};

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: ProfilePatch = await req.json();

  const data: UpdateData = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.gender !== undefined) data.gender = body.gender;
  if (body.image !== undefined) data.image = body.image;
  if (body.dob !== undefined) {
    data.dob = body.dob === null ? null : new Date(body.dob); // guarded -> no overload error
  }

  if (Object.keys(data).length === 0) {
    const current = await prisma.user.findUnique({
      where: { id: session.user!.id },
      select: { name: true, email: true, gender: true, image: true, dob: true },
    });
    return NextResponse.json({ user: current }, { status: 200 });
  }

  const user = await prisma.user.update({
    where: { id: session.user!.id }, // unique selector only
    data, // no `any`, all fields optional & typed
    select: { name: true, email: true, gender: true, image: true, dob: true },
  });

  return NextResponse.json({ user }, { status: 200 });
}
