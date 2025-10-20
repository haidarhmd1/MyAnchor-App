"use client";

import { Wind } from "lucide-react";
import { easeInOut } from "motion";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { Sheet } from "react-modal-sheet";

type Phase = "inhale" | "hold1" | "exhale" | "hold2";

const PHASES: Phase[] = ["inhale", "hold1", "exhale", "hold2"];

const phaseLabel = {
  inhale: "Inhale",
  hold1: "Hold",
  exhale: "Exhale",
  hold2: "Hold",
};

const phaseHint = {
  inhale: "Breathe in slowly through your nose.",
  hold1: "Gently hold. Stay soft in the shoulders.",
  exhale: "Breathe out slowly through your mouth.",
  hold2: "Hold. Notice the calm between breaths.",
};

export const BoxBreathing = ({
  secondsPerSide = 4,
  rounds = 4,
}: {
  secondsPerSide?: number;
  rounds?: number | "infinite";
}) => {
  const [open, setOpen] = useState(false);

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [countdown, setCountdown] = useState(secondsPerSide);

  const phase = PHASES[phaseIndex];

  useEffect(() => {
    if (!open) return;
    setPhaseIndex(0);
    setRoundIndex(0);
    setCountdown(secondsPerSide);
  }, [open, secondsPerSide]);

  useEffect(() => {
    if (!open) return;
    let raf: number; // requestAnimationFrame
    let start: number | null = null;
    const durationMs = secondsPerSide * 1000;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const remaining = Math.max(0, durationMs - elapsed);
      setCountdown(Math.ceil(remaining / 1000));

      if (elapsed >= durationMs) {
        const nextPhaseIndex = (phaseIndex + 1) % PHASES.length;
        const completedCycle = nextPhaseIndex === 0;

        setPhaseIndex(nextPhaseIndex);

        if (completedCycle) {
          setRoundIndex((r) => r + 1);
        }
        start = null;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [open, phaseIndex, secondsPerSide]);

  const isFinite = rounds !== "infinite";
  const done = isFinite && roundIndex >= (rounds as number);

  const scaleAnim = {
    scale:
      phase === "inhale"
        ? [0.7, 1.08]
        : phase === "hold1"
          ? [1.08]
          : phase === "exhale"
            ? [1.08, 0.7]
            : phase === "hold2"
              ? [0.7]
              : [1.08],
  };

  const scaleTransition = { duration: secondsPerSide, ease: easeInOut };

  return (
    <div>
      <div
        onClick={() => setOpen(true)}
        className="flex transform space-x-4 rounded-[22px] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition will-change-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 active:scale-[0.99]"
      >
        <div className="flex space-x-4">
          <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200 align-middle">
            <Wind className="self-center" />
          </div>
          <div className="text-left">
            <h4 className="font-medium">Box Breathing</h4>
            <p className="text-sm font-extralight">
              Regulate your breathing to calm your nervous system.
            </p>
          </div>
        </div>
      </div>

      <Sheet isOpen={open} onClose={() => setOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="mx-auto mt-4 flex max-w-sm flex-col items-center gap-6">
              <motion.div
                key={`${phase}-${roundIndex}`}
                className={`my-12 min-h-64 min-w-64 rounded-[22px] bg-gradient-to-br from-sky-300 to-sky-500`}
                animate={scaleAnim}
                transition={scaleTransition}
                style={{
                  boxShadow:
                    "0 8px 30px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.04)",
                }}
              />

              <div className="inset-0 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phase}
                    className="text-2xl font-medium tracking-wide"
                  >
                    {phaseLabel[phase]}
                  </motion.div>
                </AnimatePresence>

                <div className="text-muted-foreground mt-2 text-sm">
                  {phaseHint[phase]}
                </div>

                {/* countdown */}
                <div className="mt-4 text-4xl tabular-nums">
                  {Math.max(0, countdown)}
                </div>

                {/* round progress */}
                <div className="text-muted-foreground mt-2 text-xs">
                  Round{" "}
                  {Math.min(
                    roundIndex + 1,
                    rounds === "infinite" ? Infinity : (rounds as number),
                  )}
                  {isFinite && typeof rounds === "number" ? ` / ${rounds}` : ""}
                </div>
              </div>

              {/* controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-black px-4 py-2 text-sm text-white"
                >
                  Done
                </button>

                <button
                  onClick={() => {
                    // restart
                    setPhaseIndex(0);
                    setRoundIndex(0);
                    setCountdown(secondsPerSide);
                  }}
                  className="rounded-xl border px-4 py-2 text-sm"
                >
                  Restart
                </button>
              </div>

              {/* completion banner */}
              <AnimatePresence>
                {done && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="w-full rounded-xl bg-emerald-50 p-3 text-center text-emerald-700"
                    role="status"
                    aria-live="polite"
                  >
                    Nice work. Notice how your body feels now.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </div>
  );
};
