"use client";

import { reassurances } from "@/common/const/reassurings";
import { useReducedMotion, motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";

import { useMemo, useState } from "react";

export const SoothingCircle = () => {
  const t = useTranslations();

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
    <>
      <motion.div
        animate={reduce ? {} : { scale: [1, 1.2, 1] }}
        transition={
          reduce
            ? undefined
            : { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
        className="m-auto flex h-64 w-64 items-center justify-center rounded-full bg-[#B5E2D3]"
        onClick={onClickHandler}
      >
        <h6 className="font-medium">{t("form.next")}</h6>
      </motion.div>

      <div className="mt-24 min-h-[2.5rem] text-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={index}
            variants={textVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.25, ease: "easeInOut" }}
            className="mx-auto max-w-xl px-4 text-3xl font-medium text-[#2E3D49]"
          >
            {current}
          </motion.h2>
        </AnimatePresence>
      </div>
    </>
  );
};
