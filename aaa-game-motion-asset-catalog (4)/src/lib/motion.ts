import type { Transition, Variants } from "framer-motion";

/* =====================================================================
   MOTION SECRETS — the physics vocabulary of the whole game.
   Rule #1: NEVER animate UI with linear durations. Use springs for
   anything the player touches, and bezier easings for choreography.
   ===================================================================== */

/** Springs — tuned by feel, not by numbers. */
export const spring = {
  /** Snappy tap response: buttons, toggles, chips. */
  tap: { type: "spring", stiffness: 700, damping: 30, mass: 0.6 } as Transition,
  /** Cards, tiles, sheets: soft overshoot ~6%. */
  soft: { type: "spring", stiffness: 340, damping: 26, mass: 0.9 } as Transition,
  /** Bouncy reward pop (coins, stars, badges). */
  pop: { type: "spring", stiffness: 520, damping: 16, mass: 0.7 } as Transition,
  /** Heavy sheets / modals sliding in. */
  sheet: { type: "spring", stiffness: 380, damping: 34, mass: 1 } as Transition,
  /** Shared-element travel between screens. */
  shared: { type: "spring", stiffness: 300, damping: 30, mass: 1 } as Transition,
  /** Wobbly jelly: the "juice" spring. */
  jelly: { type: "spring", stiffness: 420, damping: 10, mass: 0.8 } as Transition,
  /** Slow drift for idle/breathing loops. */
  lazy: { type: "spring", stiffness: 60, damping: 20 } as Transition,
};

/** Bezier easings — the "curves" of premium apps. */
export const ease = {
  out: [0.16, 1, 0.3, 1] as const, // expo-out: enter
  in: [0.7, 0, 0.84, 0] as const, // expo-in: exit
  inOut: [0.83, 0, 0.17, 1] as const, // page slides
  back: [0.34, 1.56, 0.64, 1] as const, // overshoot
  anticipate: [0.68, -0.6, 0.32, 1.6] as const, // wind-up then overshoot
};

/** Duration scale (ms→s). Exits are always ~30% faster than enters. */
export const dur = { xs: 0.12, sm: 0.2, md: 0.32, lg: 0.5, xl: 0.8 };

/* ---------------------------------------------------------------------
   Choreography presets
   --------------------------------------------------------------------- */

/** Parent container: stagger children in, reverse-stagger out. */
export const stagger = (gap = 0.06, delay = 0.05): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
  exit: { transition: { staggerChildren: gap * 0.5, staggerDirection: -1 } },
});

/** Child: rise + fade + subtle scale (never just fade!). */
export const rise: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring.soft },
  exit: { opacity: 0, y: 14, scale: 0.96, transition: { duration: dur.sm, ease: ease.in } },
};

/** Child: pop from zero (rewards, badges). */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1, transition: spring.pop },
  exit: { opacity: 0, scale: 0.6, transition: { duration: dur.xs } },
};

/** Child: slide from the side (list rows). */
export const slideX = (dir: 1 | -1 = 1): Variants => ({
  hidden: { opacity: 0, x: 40 * dir },
  show: { opacity: 1, x: 0, transition: spring.soft },
  exit: { opacity: 0, x: -20 * dir, transition: { duration: dur.sm } },
});

/** Screen-level transition: push/pop with depth (iOS + game hybrid). */
export const screen = {
  push: {
    initial: { x: "100%", opacity: 0.4 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.42, ease: ease.out } },
    exit: { x: "-22%", opacity: 0.35, scale: 0.98, transition: { duration: 0.32, ease: ease.inOut } },
  },
  pop: {
    initial: { x: "-22%", opacity: 0.35, scale: 0.98 },
    animate: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.42, ease: ease.out } },
    exit: { x: "100%", opacity: 0.4, transition: { duration: 0.32, ease: ease.inOut } },
  },
  /** Tab switch: crossfade + slight zoom-through. */
  tab: {
    initial: { opacity: 0, scale: 0.97, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: ease.out } },
    exit: { opacity: 0, scale: 1.02, y: -6, transition: { duration: 0.18, ease: ease.in } },
  },
};

/** Bottom sheet with backdrop. */
export const sheet = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: dur.md } },
    exit: { opacity: 0, transition: { duration: dur.sm } },
  },
  panel: {
    initial: { y: "100%" },
    animate: { y: 0, transition: spring.sheet },
    exit: { y: "100%", transition: { duration: 0.28, ease: ease.in } },
  },
};

/** Press feedback for interactive tiles: squash & stretch. */
export const press = {
  whileTap: { scale: 0.94, transition: spring.tap },
  whileHover: { scale: 1.02, transition: spring.tap },
};

/** Idle "breathing" loop: gives life to hero elements. */
export const breathe = {
  animate: { y: [0, -6, 0], rotate: [0, 1.2, 0, -1.2, 0] },
  transition: { duration: 4.2, repeat: Infinity, ease: "easeInOut" as const },
};

/** Utility: random in range. */
export const rnd = (a: number, b: number) => a + Math.random() * (b - a);
