"use client";

import { Exercise } from "@/common/const/content";
import { useCountdown } from "@/hooks/useCountdown";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Tracker = ({ exercise }: { exercise: Exercise }) => {
  const t = useTranslations("tracker");
  const [finished, setFinished] = useState(false);

  const { countdown, isRunning, isPrecountdown, start, stop } = useCountdown(
    exercise.duration,
    3,
    { onFinish: () => setFinished(true) },
  );

  const handleStart = () => {
    setFinished(false);
    start();
  };

  const handleStop = () => {
    stop();
    setFinished(false);
  };

  const statusLabel = isRunning
    ? isPrecountdown
      ? t("timer.getReady")
      : t("timer.counting")
    : finished
      ? t("timer.finished")
      : t("timer.notStarted");

  return (
    <section className="space-y-10">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border-border rounded-2xl border p-4 shadow-sm">
          <h3 className="text-foreground text-sm font-semibold">
            {t("duration")}:
          </h3>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            {exercise.duration} {t("seconds")}
          </p>
        </div>

        <div
          className={cn(
            "rounded-2xl border p-4 shadow-sm",
            finished
              ? "border-primary/20 bg-accent"
              : isRunning
                ? "border-border bg-secondary"
                : "border-border bg-card",
          )}
        >
          <h3 className="text-foreground text-sm font-semibold">
            {t("status")}:
          </h3>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            {statusLabel}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 py-4">
        <button
          type="button"
          onClick={!isRunning ? handleStart : undefined}
          disabled={isRunning}
          className={cn(
            "flex h-64 w-64 items-center justify-center rounded-full border shadow-sm transition",
            "focus-visible:ring-ring/70 focus:outline-none focus-visible:ring-2",
            !isRunning
              ? "border-border bg-accent text-foreground active:scale-[0.98]"
              : "border-border bg-muted text-muted-foreground cursor-default",
          )}
          aria-label={!isRunning ? t("start") : statusLabel}
        >
          <p className="text-2xl font-semibold tabular-nums">
            {countdown !== null ? countdown : t("start")}
          </p>
        </button>

        {isRunning && (
          <Button
            type="button"
            onClick={handleStop}
            variant="outline"
            className="border-destructive/30 bg-destructive/10 text-foreground hover:bg-destructive/15 rounded-2xl"
          >
            {t("stop")}
          </Button>
        )}
      </div>
    </section>
  );
};
