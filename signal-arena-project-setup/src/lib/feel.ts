/**
 * "Game feel" layer: haptics + synthesized SFX (WebAudio, no external audio assets)
 * + tiny helpers for count-up numbers. Pure runtime, no repo-asset substitution.
 */

type TG = { HapticFeedback?: { impactOccurred: (s: string) => void; notificationOccurred: (s: string) => void; selectionChanged: () => void } };
function tg(): TG | undefined {
  return (window as unknown as { Telegram?: { WebApp?: TG } }).Telegram?.WebApp;
}

let soundEnabled = true;
let hapticEnabledLocal = true;
export const setSoundEnabled = (v: boolean) => { soundEnabled = v; };
export const setHapticEnabled = (v: boolean) => { hapticEnabledLocal = v; };
export const isSoundEnabled = () => soundEnabled;

export function haptic(kind: "tap" | "light" | "success" | "warning" | "error" | "select" = "tap") {
  if (!hapticEnabledLocal) return;
  const h = tg()?.HapticFeedback;
  try {
    if (h) {
      if (kind === "success" || kind === "warning" || kind === "error") h.notificationOccurred(kind);
      else if (kind === "select") h.selectionChanged();
      else h.impactOccurred(kind === "light" ? "light" : "medium");
      return;
    }
  } catch { /* ignore */ }
  if (navigator.vibrate) navigator.vibrate(kind === "error" ? [16, 40, 16] : kind === "success" ? [10, 30, 10, 30, 18] : 10);
}

let actx: AudioContext | null = null;
function ctx() {
  if (!actx) actx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  if (actx.state === "suspended") actx.resume();
  return actx;
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, delay = 0, glideTo?: number) {
  if (!soundEnabled) return;
  try {
    const c = ctx();
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  } catch { /* audio unavailable */ }
}

export const sfx = {
  tap: () => tone(660, 0.06, "triangle", 0.05),
  select: () => tone(520, 0.08, "sine", 0.05, 0, 640),
  hit: () => { tone(880, 0.1, "triangle", 0.06); tone(1320, 0.12, "sine", 0.04, 0.03); },
  miss: () => tone(160, 0.22, "sawtooth", 0.05, 0, 90),
  seal: () => { tone(220, 0.16, "sine", 0.06); tone(440, 0.18, "sine", 0.05, 0.07); tone(660, 0.22, "sine", 0.045, 0.14); },
  reveal: () => tone(140, 0.9, "sine", 0.03, 0, 60),
  win: () => { [0, 4, 7, 12].forEach((n, i) => tone(220 * Math.pow(2, n / 12), 0.4, "sine", 0.045, i * 0.07)); },
  card: () => { tone(700, 0.14, "triangle", 0.05); tone(1050, 0.16, "sine", 0.04, 0.05); },
  nav: () => tone(340, 0.05, "square", 0.02),
};

export function withFeel<T extends (...a: never[]) => void>(fn: T | undefined, kind: "tap" | "select" | "nav" = "tap") {
  return (...a: Parameters<T>) => {
    haptic(kind === "nav" ? "light" : "tap");
    if (kind === "nav") sfx.nav(); else sfx.tap();
    fn?.(...a);
  };
}
