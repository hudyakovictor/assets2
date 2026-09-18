/* Синтезированный звук без ассетов: WebAudio, включается по тапу */
type Ctx = AudioContext & { _unlocked?: boolean };

let ctx: Ctx | null = null;
let muted = false;

export function setMuted(v: boolean) {
  muted = v;
}

function ac(): Ctx | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const W = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
    const Ctor = W.AudioContext ?? W.webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor() as Ctx;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType = "triangle",
  gain = 0.05,
  slideTo?: number,
) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noise(dur = 0.18, gain = 0.04) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const frames = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, frames, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 2;
  const src = c.createBufferSource();
  const g = c.createGain();
  g.gain.value = gain;
  src.buffer = buf;
  src.connect(g).connect(c.destination);
  src.start();
}

export const sfx = {
  unlock() {
    const c = ac();
    if (c && !c._unlocked) {
      c._unlocked = true;
      tone(420, 0.05, "sine", 0.02);
    }
  },
  tap() {
    tone(520 + Math.random() * 60, 0.06, "triangle", 0.035);
  },
  crit() {
    tone(700, 0.09, "square", 0.03, 1200);
    tone(1100, 0.12, "triangle", 0.025);
  },
  buy() {
    tone(560, 0.09, "triangle", 0.045);
    setTimeout(() => tone(840, 0.14, "triangle", 0.04), 70);
  },
  deny() {
    tone(160, 0.14, "sawtooth", 0.03, 110);
  },
  event() {
    tone(300, 0.16, "sine", 0.045, 500);
    setTimeout(() => tone(430, 0.2, "triangle", 0.035), 130);
  },
  level() {
    [520, 660, 820, 990].forEach((f, i) => setTimeout(() => tone(f, 0.14, "triangle", 0.035), i * 70));
  },
  quest() {
    [620, 780, 940].forEach((f, i) => setTimeout(() => tone(f, 0.16, "sine", 0.04), i * 90));
  },
  warn() {
    tone(220, 0.22, "sawtooth", 0.03, 170);
  },
  collapse() {
    noise(0.5, 0.05);
    tone(200, 0.7, "sawtooth", 0.04, 60);
  },
  win() {
    [520, 700, 880, 1180].forEach((f, i) => setTimeout(() => tone(f, 0.28, "triangle", 0.04), i * 120));
  },
};

export function buzz(pattern: number | number[]) {
  if (muted) return;
  const nav = navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
  try {
    nav.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}
