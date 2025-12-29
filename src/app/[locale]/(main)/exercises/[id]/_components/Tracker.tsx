"use client";

import { Exercise } from "@/common/const/content";
import { useCountdown } from "@/hooks/useCountdown";
import { useState } from "react";

export const Tracker = ({ exercise }: { exercise: Exercise }) => {
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
          <h3>Duration:</h3>
          <p>{exercise.duration} seconds</p>
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
          <h3>Status:</h3>
          <p>
            {isRunning
              ? isPrecountdown
                ? "Get ready…"
                : "Counting…"
              : finished
                ? "Finished"
                : "Not started"}
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
          <p className="text-2xl">{countdown !== null ? countdown : "Start"}</p>
        </div>

        {isRunning && (
          <button
            onClick={handleStop}
            className="rounded-md bg-red-500 px-6 py-2 text-white hover:bg-red-600"
          >
            Stop
          </button>
        )}
      </div>
    </>
  );
};
