"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { inspirationQuotes } from "@/const/inspirationalQuotes";
import { RefreshCcw } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export const InspirationForToday = () => {
  const hasData = inspirationQuotes.length > 0;
  const [index, setIndex] = useState(0); // SSR-stable
  const [ready, setReady] = useState(false); // show after effect
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!hasData) return;
    const initial = Math.floor(Math.random() * inspirationQuotes.length);
    setIndex(initial);
    setReady(true);
  }, [hasData]);

  const nextRandom = () => {
    if (!hasData) return;
    if (inspirationQuotes.length === 1) return; // nothing to change
    let next = index;
    while (next === index) {
      next = Math.floor(Math.random() * inspirationQuotes.length);
    }
    setReady(false); // trigger exit anim
    // Wait for exit, then swap & enter
    setTimeout(
      () => {
        setIndex(next);
        setReady(true);
      },
      reduce ? 0 : 180,
    );
  };

  const quote = hasData ? inspirationQuotes[index] : null;

  const variants = {
    initial: { opacity: 0, filter: "blur(6px)", y: 4 },
    enter: { opacity: 1, filter: "blur(0px)", y: 0 },
    exit: { opacity: 0, filter: "blur(6px)", y: -4 },
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <h2>Inspiration for today</h2>

      <Card className="border-none bg-[#B5E2D3] p-0 shadow-none">
        <CardContent className="relative p-6">
          <button
            type="button"
            onClick={nextRandom}
            aria-label="Show another inspirational quote"
            className="absolute top-4 right-4 z-50 inline-flex items-center justify-center rounded-md p-2 text-[#2E3D49]/70 transition hover:bg-white/30 hover:text-[#2E3D49] focus:ring-2 focus:ring-[#8AB6A9] focus:outline-none"
          >
            <RefreshCcw className="h-5 w-5 stroke-1" />
          </button>

          <div className="min-h-[88px] space-y-3 pr-8">
            <AnimatePresence mode="wait">
              {ready && quote ? (
                <motion.div
                  key={index}
                  variants={variants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  transition={{
                    duration: reduce ? 0 : 0.35,
                    ease: "easeInOut",
                  }}
                  className="space-y-3"
                >
                  <p className="text-xs tracking-wider text-[#4F6B75]">
                    {quote.author}
                  </p>
                  <p className="leading-relaxed text-[#2E3D49]">{quote.text}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div className="h-3 w-24 rounded bg-white/60" />
                  <div className="h-4 w-3/4 rounded bg-white/70" />
                  <div className="h-4 w-2/3 rounded bg-white/60" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
