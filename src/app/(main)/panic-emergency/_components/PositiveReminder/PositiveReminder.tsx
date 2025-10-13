"use client";
import { reassurences } from "@/common/const/reassurings";
import { Heart } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { Sheet } from "react-modal-sheet";

export const PositiveReminder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [counter, setCounter] = useState(0);
  const reduce = useReducedMotion();

  const messages = useMemo(() => reassurences ?? [], []);
  const index = messages.length ? counter % messages.length : 0;
  const current = messages.length ? messages[index] : "";

  const onClickHandler = () => {
    if (!messages.length) return;
    setCounter((c) => c + 1);
  };

  const textVariants = {
    initial: { opacity: 0, filter: "blur(6px)", y: 4 },
    enter: { opacity: 1, filter: "blur(0px)", y: 0 },
    exit: { opacity: 0, filter: "blur(6px)", y: -4 },
  };

  return (
    <div>
      <div
        onClick={() => setIsOpen(true)}
        className="flex transform space-x-4 rounded-[22px] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition will-change-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 active:scale-[0.99]"
      >
        <div className="flex space-x-4">
          <div className="flex h-14 w-14 shrink-0 justify-center rounded-2xl bg-gray-200">
            <Heart className="self-center" />
          </div>
          <div className="flex flex-col text-left">
            <h4>Positive Reminders</h4>
            <p className="text-sm font-extralight">
              Reinforce positive beliefs to counteract negative thinking.
            </p>
          </div>
        </div>
      </div>
      <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content className="p-4">
            <div className="mt-32">
              <motion.div
                animate={reduce ? {} : { scale: [1, 1.2, 1] }}
                transition={
                  reduce
                    ? undefined
                    : { duration: 8, repeat: Infinity, ease: "easeInOut" }
                }
                className="m-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-sky-500"
                onClick={onClickHandler}
              >
                <h3 className="font-medium text-white">Next</h3>
              </motion.div>

              <div className="mt-24 min-h-[2.5rem] text-center">
                <AnimatePresence mode="wait">
                  <motion.h4
                    key={index}
                    variants={textVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    transition={{
                      duration: reduce ? 0 : 0.25,
                      ease: "easeInOut",
                    }}
                    className="mx-auto max-w-xl px-4 text-3xl font-medium text-[#2E3D49]"
                  >
                    {current}
                  </motion.h4>
                </AnimatePresence>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </div>
  );
};
