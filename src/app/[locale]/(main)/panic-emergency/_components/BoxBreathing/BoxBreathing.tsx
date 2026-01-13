"use client";

import { easeInOut } from "motion";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Sheet } from "react-modal-sheet";
import { useTranslations } from "next-intl";

type Phase = "inhale" | "hold1" | "exhale" | "hold2";

const PHASES: Phase[] = ["inhale", "hold1", "exhale", "hold2"];

export const BoxBreathing = ({
  secondsPerSide = 4,
  rounds = 4,
}: {
  secondsPerSide?: number;
  rounds?: number;
}) => {
  const t = useTranslations("panicEmergency.boxBreathing");

  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [countdown, setCountdown] = useState(secondsPerSide);

  const phase = PHASES[phaseIndex];

  // Labels
  const phaseLabel =
    phase === "inhale"
      ? t("phases.inhale")
      : phase === "exhale"
        ? t("phases.exhale")
        : t("phases.hold");

  const phaseHint =
    phase === "inhale"
      ? t("hints.inhale")
      : phase === "hold1"
        ? t("hints.hold1")
        : phase === "exhale"
          ? t("hints.exhale")
          : t("hints.hold2");

  // Reset when opening / closing
  useEffect(() => {
    if (!open) {
      setStarted(false);
      return;
    }

    setPhaseIndex(0);
    setRoundIndex(0);
    setCountdown(secondsPerSide);
    setStarted(false);
  }, [open, secondsPerSide]);

  // Breathing loop (starts only after pressing Start)
  useEffect(() => {
    if (!open || !started || roundIndex >= rounds) return;

    let raf: number;
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
        if (completedCycle) setRoundIndex((r) => r + 1);

        start = null;
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [open, started, phaseIndex, secondsPerSide]);

  const done = roundIndex >= rounds;

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

  const totalForText = typeof rounds === "number" ? String(rounds) : "∞";
  const currentForText = String(Math.min(roundIndex + 1, rounds));

  return (
    <div>
      {/* Card */}
      <div
        onClick={() => setOpen(true)}
        className="h-28 min-h-24 transform rounded-2xl bg-white p-3 shadow-md transition will-change-transform active:scale-[0.98]"
      >
        <div className="text-left">
          <h4 className="text-sm font-medium">{t("card.title")}</h4>
          <p className="text-xs font-extralight">{t("card.subtitle")}</p>
        </div>
      </div>

      {/* Sheet */}
      <Sheet isOpen={open} onClose={() => setOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="mx-auto mt-4 flex max-w-sm flex-col items-center gap-6">
              {/* Animated box */}
              <motion.div
                key={`${phase}-${roundIndex}`}
                className="my-12 min-h-64 min-w-64 rounded-[22px] bg-linear-to-br from-sky-300 to-sky-500"
                animate={started ? scaleAnim : { scale: 0.7 }}
                transition={started ? scaleTransition : { duration: 0 }}
                style={{
                  boxShadow:
                    "0 8px 30px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.04)",
                }}
              />

              {/* Text */}
              <div className="flex flex-col items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phase}
                    className="text-2xl font-medium tracking-wide"
                  >
                    {phaseLabel}
                  </motion.div>
                </AnimatePresence>

                <div className="text-muted-foreground mt-2 text-sm">
                  {phaseHint}
                </div>

                <div className="mt-4 text-4xl tabular-nums">
                  {started ? Math.max(0, countdown) : secondsPerSide}
                </div>

                <div className="text-muted-foreground mt-2 text-xs">
                  {t("progress.round", {
                    current: currentForText,
                    total: totalForText,
                  })}
                </div>
              </div>
              <button
                onClick={() => setStarted(true)}
                disabled={started}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {t("actions.start")}
              </button>
              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-black px-4 py-2 text-sm text-white"
                >
                  {t("actions.done")}
                </button>

                <button
                  onClick={() => {
                    setPhaseIndex(0);
                    setRoundIndex(0);
                    setCountdown(secondsPerSide);
                    setStarted(true);
                  }}
                  className="rounded-xl border px-4 py-2 text-sm"
                >
                  {t("actions.restart")}
                </button>
              </div>

              {/* Completion */}
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
                    {t("completion")}
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
