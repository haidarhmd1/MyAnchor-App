"use client";

import { easeInOut } from "motion";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Sheet } from "react-modal-sheet";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Phase = "inhale" | "hold1" | "exhale" | "hold2";
type BreathingType = "boxBreathing" | "relaxingBreath";

const PHASES: Phase[] = ["inhale", "hold1", "exhale", "hold2"];

const BREATHING_CONFIG: Record<
  BreathingType,
  Partial<Record<Phase, number>>
> = {
  boxBreathing: {
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
  },
  relaxingBreath: {
    inhale: 4,
    hold1: 7,
    exhale: 8,
  },
};

const DEFAULT_SECONDS = 4;

export const BoxBreathing = ({ rounds = 4 }: { rounds?: number }) => {
  const t = useTranslations("panicEmergency.boxBreathing");

  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [breathingType, setBreathingType] =
    useState<BreathingType>("boxBreathing");

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [countdown, setCountdown] = useState(DEFAULT_SECONDS);

  const config = BREATHING_CONFIG[breathingType];

  const phases = (Object.keys(config) as Phase[]).filter(
    (p) => config[p] != null,
  );

  const phase = phases[phaseIndex];
  const secondsForPhase = config[phase] ?? DEFAULT_SECONDS;
  const done = roundIndex >= rounds;

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

  useEffect(() => {
    if (!open) {
      setStarted(false);
      return;
    }

    setPhaseIndex(0);
    setRoundIndex(0);
    setCountdown(config.inhale ?? DEFAULT_SECONDS);
    setStarted(false);
  }, [open, breathingType, config.inhale]);

  useEffect(() => {
    if (!open || !started || done) return;

    let raf = 0;
    let start: number | null = null;
    const durationMs = secondsForPhase * 1000;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;

      const elapsed = timestamp - start;
      const remaining = Math.max(0, durationMs - elapsed);
      setCountdown(Math.ceil(remaining / 1000));

      if (elapsed >= durationMs) {
        const nextPhaseIndex = (phaseIndex + 1) % phases.length;
        const completedCycle = nextPhaseIndex === 0;

        setPhaseIndex(nextPhaseIndex);

        if (completedCycle) {
          setRoundIndex((prev) => prev + 1);
        }

        start = null;
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [open, started, done, secondsForPhase, phaseIndex, phases.length]);

  const scaleAnim = {
    scale:
      phase === "inhale"
        ? [0.72, 1.04]
        : phase === "hold1"
          ? [1.04]
          : phase === "exhale"
            ? [1.04, 0.72]
            : [0.72],
  };

  const scaleTransition = {
    duration: secondsForPhase,
    ease: easeInOut,
  };

  const totalForText = String(rounds);
  const currentForText = String(Math.min(roundIndex + 1, rounds));

  const handleRestart = () => {
    setPhaseIndex(0);
    setRoundIndex(0);
    setCountdown(config.inhale ?? DEFAULT_SECONDS);
    setStarted(true);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="surface-soft h-28 min-h-24 w-full rounded-2xl p-3 text-left shadow-sm transition will-change-transform active:scale-[0.98]"
      >
        <div>
          <h4 className="text-foreground text-sm font-medium">
            {t("card.title")}
          </h4>
          <p className="text-muted-foreground text-xs font-light">
            {t("card.subtitle")}
          </p>
        </div>
      </button>

      <Sheet isOpen={open} onClose={() => setOpen(false)}>
        <Sheet.Container className="!bg-background !text-foreground">
          <Sheet.Header />
          <Sheet.Content>
            <div className="space-y-6 px-4 pb-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBreathingType("boxBreathing")}
                  className={cn(
                    "rounded-2xl border p-4 text-left shadow-sm transition-all",
                    breathingType === "boxBreathing"
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-card text-card-foreground",
                  )}
                >
                  <p className="text-sm font-semibold">4-4-4-4</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {t("breathing.box.title")}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setBreathingType("relaxingBreath")}
                  className={cn(
                    "rounded-2xl border p-4 text-left shadow-sm transition-all",
                    breathingType === "relaxingBreath"
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-card text-card-foreground",
                  )}
                >
                  <p className="text-sm font-semibold">4-7-8</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {t("breathing.relaxed.title")}
                  </p>
                </button>
              </div>

              <div className="mx-auto flex max-w-sm flex-col items-center">
                <h4 className="text-foreground mt-2 text-2xl font-semibold tracking-tight">
                  {breathingType === "boxBreathing"
                    ? t("breathing.box.title")
                    : t("breathing.relaxed.title")}
                </h4>

                <p className="text-muted-foreground mt-2 text-center text-sm leading-6">
                  {breathingType === "boxBreathing"
                    ? t("breathing.box.description")
                    : t("breathing.relaxed.description")}
                </p>

                <div className="mt-4 flex w-full flex-col items-center gap-2">
                  <motion.div
                    key={`${phase}-${roundIndex}`}
                    className="from-primary to-accent my-10 min-h-64 min-w-64 rounded-[28px] bg-linear-to-br"
                    animate={started ? scaleAnim : { scale: 0.72 }}
                    transition={started ? scaleTransition : { duration: 0 }}
                    style={{
                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  />

                  <div className="flex flex-col items-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={phase}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-foreground text-2xl font-medium tracking-wide"
                      >
                        {phaseLabel}
                      </motion.div>
                    </AnimatePresence>

                    <div className="text-muted-foreground mt-2 text-sm">
                      {phaseHint}
                    </div>

                    <div className="text-foreground mt-4 text-4xl font-semibold tabular-nums">
                      {started ? Math.max(0, countdown) : secondsForPhase}
                    </div>

                    <div className="text-muted-foreground mt-2 text-xs">
                      {t("progress.round", {
                        current: currentForText,
                        total: totalForText,
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStarted(true)}
                    disabled={started || done}
                    className="bg-primary text-primary-foreground mt-4 rounded-2xl px-4 py-2 text-sm font-medium transition hover:opacity-95 disabled:opacity-50"
                  >
                    {t("actions.start")}
                  </button>

                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-2 text-sm font-medium transition hover:opacity-95"
                    >
                      {t("actions.done")}
                    </button>

                    <button
                      type="button"
                      onClick={handleRestart}
                      className="border-border bg-card text-card-foreground hover:bg-muted rounded-2xl border px-4 py-2 text-sm font-medium transition"
                    >
                      {t("actions.restart")}
                    </button>
                  </div>

                  <AnimatePresence>
                    {done && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="border-primary/20 bg-accent text-accent-foreground mt-4 w-full rounded-2xl border p-3 text-center text-sm"
                        role="status"
                        aria-live="polite"
                      >
                        {t("completion")}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>

        <Sheet.Backdrop className="bg-foreground/20! backdrop-blur-sm!" />
      </Sheet>
    </div>
  );
};
