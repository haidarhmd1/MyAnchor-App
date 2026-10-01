type LogContext = Record<string, boolean | number | string | null | undefined>;

function serializeError(error: unknown) {
  if (!(error instanceof Error)) {
    return { errorType: "UnknownError" };
  }

  const code =
    "code" in error && typeof error.code === "string" ? error.code : undefined;

  return {
    errorType: error.name,
    errorCode: code,
    ...(process.env.NODE_ENV === "development"
      ? { errorMessage: error.message }
      : {}),
  };
}

function write(
  level: "error" | "info" | "warn",
  event: string,
  context: LogContext,
) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...context,
  });

  const stream = level === "info" ? process.stdout : process.stderr;
  stream.write(`${entry}\n`);
}

export function logError(
  event: string,
  error: unknown,
  context: LogContext = {},
) {
  write("error", event, { ...context, ...serializeError(error) });
}

export function logInfo(event: string, context: LogContext = {}) {
  write("info", event, context);
}

export function logWarn(event: string, context: LogContext = {}) {
  write("warn", event, context);
}
