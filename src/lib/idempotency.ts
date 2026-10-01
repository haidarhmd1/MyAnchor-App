import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "../../lib/prisma";

const IDEMPOTENCY_TTL_HOURS = 24;
const KEY_PATTERN = /^[A-Za-z0-9._:-]{8,128}$/;

type JsonResult = {
  body: unknown;
  status?: number;
};

function normalizedJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function replayResponse(record: {
  response: unknown;
  statusCode: number | null;
}) {
  if (record.response === null || record.statusCode === null) {
    return NextResponse.json(
      { error: "A matching request is still being processed" },
      { status: 409, headers: { "retry-after": "1" } },
    );
  }

  return NextResponse.json(record.response, {
    status: record.statusCode,
    headers: { "idempotency-replayed": "true" },
  });
}

export async function idempotentJson(params: {
  request: Request;
  userId: string;
  route: string;
  execute: (tx: Prisma.TransactionClient) => Promise<JsonResult>;
}) {
  const key = params.request.headers.get("idempotency-key");

  if (!key) {
    const result = await prisma.$transaction(params.execute);
    return NextResponse.json(result.body, { status: result.status ?? 200 });
  }

  if (!KEY_PATTERN.test(key)) {
    return NextResponse.json(
      { error: "Invalid Idempotency-Key header" },
      { status: 400 },
    );
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.idempotencyRecord.findUnique({
        where: {
          userId_route_key: {
            userId: params.userId,
            route: params.route,
            key,
          },
        },
      });
      if (existing) return replayResponse(existing);

      const record = await tx.idempotencyRecord.create({
        data: {
          userId: params.userId,
          route: params.route,
          key,
          expiresAt: new Date(
            Date.now() + IDEMPOTENCY_TTL_HOURS * 60 * 60 * 1_000,
          ),
        },
      });

      const result = await params.execute(tx);
      const status = result.status ?? 200;
      const response = normalizedJson(result.body);

      await tx.idempotencyRecord.update({
        where: { id: record.id },
        data: { statusCode: status, response },
      });

      return NextResponse.json(response, { status });
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      const existing = await prisma.idempotencyRecord.findUnique({
        where: {
          userId_route_key: {
            userId: params.userId,
            route: params.route,
            key,
          },
        },
      });
      if (existing) return replayResponse(existing);
    }

    throw error;
  }
}
