"use client";

import { Heart } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { Sheet } from "react-modal-sheet";
import { useTranslations } from "next-intl";
import { reassurances } from "@/common/const/reassurings";

export const PositiveReminder = () => {
  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(false);
  const [counter, setCounter] = useState(0);
  const reduce = useReducedMotion();

  const messages = useMemo(() => reassurances, []);
  const index = messages.length ? counter % messages.length : 0;
  const current = messages.length ? t(messages[index].textKey) : "";

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
        className="h-28 min-h-24 transform rounded-2xl bg-white p-3 shadow-md transition will-change-transform active:scale-[0.98]"
      >
        <div className="space-x-4">
          {/* <div className="flex h-8 w-8 shrink-0 justify-center rounded-md bg-gray-200">
            <Heart className="self-center" />
          </div> */}
          <div className="flex flex-col text-left">
            <h4 className="text-sm font-medium">
              {t("positiveReminder.card.title")}
            </h4>
            <p className="text-xs font-extralight">
              {t("positiveReminder.card.subtitle")}
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
                <h3 className="font-medium text-white">
                  {t("positiveReminder.actions.next")}
                </h3>
              </motion.div>

              <div className="mt-24 min-h-10 text-center">
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
