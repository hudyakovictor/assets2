/* ============================================================================
   SFX — synthesized in-browser (no external audio assets used or invented).
   Every sound is generated with WebAudio oscillators + envelopes.
   ========================================================================== */
import { useRef } from "react";

let ctx: AudioContext | null = null;
let enabled = true;

export const sfx = {
  setEnabled(v: boolean) {
    enabled = v;
  },
  get enabled() {
    return enabled;
  },
  ctx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  },
  blip(freq = 440, dur = 0.07, type: OscillatorType = "triangle", gain = 0.05, slide = 0) {
    if (!enabled) return;
    const ac = sfx.ctx();
    if (!ac) return;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(60, freq + slide), ac.currentTime + dur);
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(gain, ac.currentTime + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    osc.connect(g).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + dur + 0.02);
  },
  tick() {
    sfx.blip(1180, 0.035, "square", 0.028);
  },
  pick() {
    sfx.blip(560, 0.06, "triangle", 0.045, 180);
  },
  seal() {
    sfx.blip(180, 0.16, "sawtooth", 0.06, -40);
    setTimeout(() => sfx.blip(96, 0.3, "sine", 0.07, -30), 70);
  },
  win() {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => sfx.blip(f, 0.14, "triangle", 0.05), i * 85));
  },
  lose() {
    [392, 330, 262, 196].forEach((f, i) => setTimeout(() => sfx.blip(f, 0.2, "sine", 0.055, -30), i * 110));
  },
  scrub() {
    for (let i = 0; i < 9; i += 1) setTimeout(() => sfx.blip(320 + i * 90, 0.03, "square", 0.02), i * 55);
  },
  level() {
    [440, 554, 659, 880, 1108].forEach((f, i) => setTimeout(() => sfx.blip(f, 0.18, "triangle", 0.05), i * 70));
  },
};

export function haptic(pattern: "light" | "medium" | "heavy" | "success" | "error") {
  const tg = (window as unknown as { Telegram?: { WebApp?: { HapticFeedback?: Record<string, (t?: string) => void> } } })
    .Telegram?.WebApp?.HapticFeedback;
  if (!tg) return;
  if (pattern === "success" || pattern === "error") tg.notificationOccurred?.(pattern);
  else tg.impactOccurred?.(pattern);
}

export function useSfx() {
  return useRef(sfx).current;
}
