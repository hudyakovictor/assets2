/**
 * Lightweight audio + haptics engine (WebAudio, no assets).
 * Award-winning games live and die on tactile feedback — every tap, seal,
 * reveal and score tick gets sound + vibration.
 */
let ctx: AudioContext | null = null;
let enabled = true;
let master = 0.5;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function setSound(on: boolean) {
  enabled = on;
}
export function setVolume(v: number) {
  master = v;
}

type Wave = OscillatorType;

function tone(freq: number, dur: number, opts: { type?: Wave; vol?: number; slideTo?: number; delay?: number } = {}) {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + (opts.delay ?? 0);
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(freq, t0);
  if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + dur);
  const v = (opts.vol ?? 0.3) * master;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(v, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise(dur: number, vol = 0.2, hp = 400) {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  const frames = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, frames, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = hp;
  const gain = c.createGain();
  gain.gain.value = vol * master;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
}

export function vibe(ms: number | number[]) {
  if (!enabled) return;
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* noop */
  }
}

export const sfx = {
  tap: () => {
    tone(520, 0.06, { type: "triangle", vol: 0.18 });
    vibe(8);
  },
  select: () => {
    tone(680, 0.08, { type: "triangle", vol: 0.22 });
    tone(920, 0.07, { type: "sine", vol: 0.14, delay: 0.03 });
    vibe(12);
  },
  back: () => {
    tone(360, 0.07, { type: "triangle", vol: 0.16, slideTo: 240 });
    vibe(6);
  },
  card: () => {
    noise(0.14, 0.14, 1200);
    tone(760, 0.1, { type: "sine", vol: 0.16, delay: 0.02 });
    vibe([6, 20, 10]);
  },
  seal: () => {
    tone(180, 0.28, { type: "sawtooth", vol: 0.28, slideTo: 90 });
    noise(0.2, 0.2, 300);
    tone(520, 0.18, { type: "sine", vol: 0.2, delay: 0.05 });
    vibe([40, 30, 60]);
  },
  scrub: () => {
    tone(1200, 0.05, { type: "sine", vol: 0.08 });
  },
  win: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, { type: "triangle", vol: 0.24, delay: i * 0.09 }));
    vibe([0, 40, 40, 40, 40, 80]);
  },
  lose: () => {
    [392, 330, 262].forEach((f, i) => tone(f, 0.26, { type: "sawtooth", vol: 0.2, delay: i * 0.12 }));
    vibe([0, 80, 40, 120]);
  },
  count: () => {
    tone(880, 0.03, { type: "square", vol: 0.06 });
  },
  reward: () => {
    tone(1047, 0.1, { type: "triangle", vol: 0.18 });
    tone(1319, 0.12, { type: "sine", vol: 0.14, delay: 0.05 });
    vibe(15);
  },
  levelup: () => {
    [659, 784, 988, 1319].forEach((f, i) => tone(f, 0.3, { type: "triangle", vol: 0.26, delay: i * 0.1 }));
    vibe([0, 30, 30, 30, 30, 30, 100]);
  },
  error: () => {
    tone(200, 0.18, { type: "square", vol: 0.16 });
    vibe([0, 60, 40, 60]);
  },
};
