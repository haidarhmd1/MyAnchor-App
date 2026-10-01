import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { logError } from "@/lib/logger";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export class RateLimitError extends Error {
  constructor() {
    super("Too many requests");
    this.name = "RateLimitError";
  }
}

export function getRequestId(request?: Request) {
  return request?.headers.get("x-request-id") ?? randomUUID();
}

export function apiErrorResponse(
  error: unknown,
  event: string,
  request?: Request,
) {
  const requestId = getRequestId(request);

  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      { error: "Unauthorized", requestId },
      { status: 401, headers: { "x-request-id": requestId } },
    );
  }

  if (error instanceof RateLimitError) {
    return NextResponse.json(
      { error: "Too many requests. Try again later.", requestId },
      {
        status: 429,
        headers: { "retry-after": "60", "x-request-id": requestId },
      },
    );
  }

  logError(event, error, { requestId });
  return NextResponse.json(
    { error: "Internal server error", requestId },
    { status: 500, headers: { "x-request-id": requestId } },
  );
}
