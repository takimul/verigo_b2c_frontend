import type { Variants } from "motion/react";

const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const revealUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: premiumEase,
    },
  },
};

export const revealFade: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const imageReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.04,
  },

  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.1,
      ease: premiumEase,
    },
  },
};

export const cardHover: Variants = {
  rest: {
    y: 0,
  },

  hover: {
    y: -4,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};
