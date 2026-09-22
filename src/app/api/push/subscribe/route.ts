import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { pushSubscriptionSchema, pushUnsubscribeSchema } from "@/lib/zod.types";
import { prisma } from "../../../../../lib/prisma";

export const POST = async (request: NextRequest) => {
  try {
    const { userId } = await getUserOrThrow();
    const body = await request.json();
    const parsed = pushSubscriptionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parsed.error) },
        { status: 400 },
      );
    }

    const { endpoint, keys } = parsed.data;

    // The same endpoint can move between accounts on a shared device, so the
    // upsert reassigns ownership rather than failing on the unique constraint.
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: {
        userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: request.headers.get("user-agent") ?? undefined,
      },
      update: {
        userId,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: request.headers.get("user-agent") ?? undefined,
      },
    });

    return NextResponse.json({ subscribed: true }, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) return error;

    console.error("Push subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to save push subscription" },
      { status: 500 },
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const { userId } = await getUserOrThrow();
    const body = await request.json();
    const parsed = pushUnsubscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parsed.error) },
        { status: 400 },
      );
    }

    await prisma.pushSubscription.deleteMany({
      where: { endpoint: parsed.data.endpoint, userId },
    });

    return NextResponse.json({ subscribed: false }, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) return error;

    console.error("Push unsubscribe error:", error);
    return NextResponse.json(
      { error: "Failed to remove push subscription" },
      { status: 500 },
    );
  }
};
