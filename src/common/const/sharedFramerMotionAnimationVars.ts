import { Variants } from "motion";

export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    filter: "blur(8px)",
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 190,
      damping: 22,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(6px)",
    transition: {
      duration: 0.18,
      ease: "easeOut",
    },
  },
};

export const loadingPulse: Variants = {
  initial: { opacity: 0.55, scale: 0.99 },
  animate: {
    opacity: [0.55, 0.9, 0.55],
    scale: [0.99, 1, 0.99],
    transition: {
      duration: 1.35,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const stickyBarVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.18,
      duration: 0.28,
      ease: "easeOut",
    },
  },
};
