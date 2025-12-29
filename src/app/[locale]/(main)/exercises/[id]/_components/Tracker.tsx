"use client";

import { Exercise } from "@/common/const/content";
import { useCountdown } from "@/hooks/useCountdown";
import { useTranslations } from "next-intl";
import { useState } from "react";

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

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="block overflow-hidden rounded-md border border-[#DBE5E0] bg-white p-4">
          <h3>{t("duration")}:</h3>
          <p>
            {exercise.duration} {t("seconds")}
          </p>
        </div>
        <div
          className={`block overflow-hidden rounded-md border ${
            finished
              ? "border-green-200 bg-green-50"
              : isRunning
                ? "border-yellow-200 bg-yellow-50"
                : "border-[#DBE5E0] bg-white"
          } p-4`}
        >
          <h3>{t("status")}:</h3>
          <p>
            {isRunning
              ? isPrecountdown
                ? t("timer.getReady")
                : t("timer.counting")
              : finished
                ? t("timer.finished")
                : t("timer.notStarted")}
          </p>
        </div>
      </div>

      <div className="mt-12 mb-12 flex flex-col items-center gap-6">
        <div
          onClick={!isRunning ? handleStart : undefined}
          className={`flex h-64 w-64 items-center justify-center rounded-full ${
            !isRunning ? "cursor-pointer bg-blue-100" : "bg-gray-200"
          }`}
        >
          <p className="text-2xl">
            {countdown !== null ? countdown : t("start")}
          </p>
        </div>

        {isRunning && (
          <button
            onClick={handleStop}
            className="rounded-md bg-red-500 px-6 py-2 text-white hover:bg-red-600"
          >
            {t("stop")}
          </button>
        )}
      </div>
    </>
  );
};
