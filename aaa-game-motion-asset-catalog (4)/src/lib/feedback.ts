/* =====================================================================
   FEEDBACK — sound + haptics synthesized on the fly (no audio files).
   Secret: a 40ms click + 8ms vibration makes any UI feel 2x more solid.
   ===================================================================== */

let ctx: AudioContext | null = null;
let muted = false;
let hapticsOn = true;

export const setMuted = (m: boolean) => (muted = m);
export const isMuted = () => muted;
export const setHaptics = (v: boolean) => (hapticsOn = v);
export const isHaptics = () => hapticsOn;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

type Tone = {
  f: number; // frequency
  f2?: number; // glide target
  t?: number; // duration
  type?: OscillatorType;
  v?: number; // volume
  at?: number; // delay
};

function tone({ f, f2, t = 0.08, type = "sine", v = 0.18, at = 0 }: Tone) {
  const c = ac();
  if (!c || muted) return;
  const o = c.createOscillator();
  const g = c.createGain();
  const now = c.currentTime + at;
  o.type = type;
  o.frequency.setValueAtTime(f, now);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, now + t);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(v, now + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, now + t);
  o.connect(g).connect(c.destination);
  o.start(now);
  o.stop(now + t + 0.02);
}

function noise(t = 0.12, v = 0.08, at = 0) {
  const c = ac();
  if (!c || muted) return;
  const buf = c.createBuffer(1, c.sampleRate * t, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = c.createBufferSource();
  s.buffer = buf;
  const g = c.createGain();
  const now = c.currentTime + at;
  g.gain.setValueAtTime(v, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + t);
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 1800;
  s.connect(f).connect(g).connect(c.destination);
  s.start(now);
}

export const sfx = {
  tap: () => tone({ f: 520, f2: 380, t: 0.06, type: "triangle", v: 0.12 }),
  tick: () => tone({ f: 900, f2: 700, t: 0.035, type: "square", v: 0.05 }),
  open: () => {
    tone({ f: 340, f2: 620, t: 0.14, type: "sine", v: 0.12 });
    noise(0.1, 0.03);
  },
  close: () => tone({ f: 620, f2: 300, t: 0.12, type: "sine", v: 0.1 }),
  whoosh: () => noise(0.22, 0.06),
  coin: () => {
    tone({ f: 1320, t: 0.09, type: "square", v: 0.06 });
    tone({ f: 1760, t: 0.2, type: "square", v: 0.06, at: 0.07 });
  },
  star: () => {
    [880, 1109, 1319, 1760].forEach((f, i) => tone({ f, t: 0.14, type: "sine", v: 0.09, at: i * 0.055 }));
  },
  pop: () => tone({ f: 260, f2: 760, t: 0.1, type: "sine", v: 0.16 }),
  error: () => {
    tone({ f: 220, f2: 160, t: 0.16, type: "sawtooth", v: 0.08 });
    tone({ f: 200, f2: 140, t: 0.18, type: "sawtooth", v: 0.08, at: 0.12 });
  },
  success: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone({ f, t: 0.18, type: "triangle", v: 0.1, at: i * 0.08 }));
  },
  lock: () => tone({ f: 140, f2: 90, t: 0.12, type: "square", v: 0.06 }),
  swipe: () => noise(0.14, 0.04),
};

export const haptic = {
  light: () => hapticsOn && navigator.vibrate?.(6),
  medium: () => hapticsOn && navigator.vibrate?.(14),
  heavy: () => hapticsOn && navigator.vibrate?.([18, 20, 26]),
  success: () => hapticsOn && navigator.vibrate?.([10, 30, 10, 30, 20]),
  error: () => hapticsOn && navigator.vibrate?.([40, 40, 40]),
};

/** One-liner used by most interactive elements. */
export const feel = {
  tap: () => {
    sfx.tap();
    haptic.light();
  },
  open: () => {
    sfx.open();
    haptic.medium();
  },
  close: () => {
    sfx.close();
    haptic.light();
  },
  reward: () => {
    sfx.coin();
    haptic.success();
  },
  deny: () => {
    sfx.error();
    haptic.error();
  },
};
