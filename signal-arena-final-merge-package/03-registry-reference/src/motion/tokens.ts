import type { Transition } from "framer-motion";

/* ============================================================
   motion tokens — единая система для всех 136 вариантов
   ============================================================ */

export const EASE = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  outQuint: [0.22, 1, 0.36, 1] as const,
  outBack: [0.34, 1.56, 0.64, 1] as const,
  inOutCirc: [0.85, 0, 0.15, 1] as const,
  anticipate: [0.68, -0.6, 0.32, 1.6] as const,
  snap: [0.2, 0.9, 0.1, 1] as const,
};

export const SPRING = {
  micro: { type: "spring", stiffness: 700, damping: 32, mass: 0.7 } as Transition,
  panel: { type: "spring", stiffness: 260, damping: 28, mass: 1 } as Transition,
  bouncy: { type: "spring", stiffness: 420, damping: 16, mass: 1 } as Transition,
  soft: { type: "spring", stiffness: 180, damping: 22, mass: 1.4 } as Transition,
};

export const DUR = {
  instant: 0.12, fast: 0.22, base: 0.34, slow: 0.52, scene: 0.78, cine: 1.2,
};

export const STAGGER = {
  tight: 0.028, base: 0.042, loose: 0.065,
};

export const haptic = (ms: number | number[] = 8) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { navigator.vibrate(ms as number); } catch { /* noop */ }
  }
};

export const rand = (min: number, max: number) => min + Math.random() * (max - min);
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
