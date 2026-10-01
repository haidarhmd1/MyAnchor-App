import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { pushTestMessageSchema } from "@/lib/zod.types";
import { sendPushToUser } from "@/lib/push/web-push";
import { apiErrorResponse } from "@/lib/api-errors";

/** Sends a notification to the caller's own devices, for verifying setup. */
export const POST = async (request: NextRequest) => {
  try {
    const { userId } = await getUserOrThrow();
    const body = await request.json().catch(() => ({}));
    const parsed = pushTestMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parsed.error) },
        { status: 400 },
      );
    }

    const result = await sendPushToUser(userId, {
      title: "MyAnchor",
      body: parsed.data.message,
      url: "/home",
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return apiErrorResponse(error, "push_test_failed", request);
  }
};
