
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

export const staggerChildren = (staggerTime = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: staggerTime
    }
  }
});

export const slideInFromLeft = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: "spring", stiffness: 100, damping: 10 }
};

export const slideInFromRight = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: "spring", stiffness: 100, damping: 10 }
};

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: "spring", stiffness: 200, damping: 20 }
};

export const getStaggeredChildren = (index: number, delay = 0.05) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: index * delay, duration: 0.3 }
});
