/* ------------------------------------------------------------------ *
 * AAA+ Web Audio Synthesizer for tactile casual mobile game feel.
 * Zero external audio files required, instant feedback.
 * ------------------------------------------------------------------ */

let ctx: AudioContext | null = null;
let soundEnabled = true;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      ctx = new AudioCtx();
    }
  }
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/** Мягкий тактильный клик при нажатии кнопки или карточки */
export function playTapSound() {
  if (!soundEnabled) return;
  const c = getCtx();
  if (!c) return;

  try {
    const osc = c.createOscillator();
    const gain = c.createGain();
    const now = c.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    /* ignore */
  }
}

/** Звук смены вкладки */
export function playTabSound() {
  if (!soundEnabled) return;
  const c = getCtx();
  if (!c) return;

  try {
    const osc = c.createOscillator();
    const gain = c.createGain();
    const now = c.currentTime;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    /* ignore */
  }
}

/** Звон золотых монет при награде / победе */
export function playCoinSound() {
  if (!soundEnabled) return;
  const c = getCtx();
  if (!c) return;

  try {
    const now = c.currentTime;
    [987, 1318].forEach((freq, idx) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      const start = now + idx * 0.07;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.16, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start(start);
      osc.stop(start + 0.22);
    });
  } catch {
    /* ignore */
  }
}

/** Звук рассечения меча-свечи при Reveal или входе в раунд */
export function playSwordClashSound() {
  if (!soundEnabled) return;
  const c = getCtx();
  if (!c) return;

  try {
    const now = c.currentTime;

    // Свист клинка (фильтрованный шум)
    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(840, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.16);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start(now);
    osc.stop(now + 0.16);

    // Металлический звон удара (две свечи скрестились)
    setTimeout(() => {
      if (!c) return;
      const t = c.currentTime;
      const bell = c.createOscillator();
      const bellGain = c.createGain();

      bell.type = "sine";
      bell.frequency.setValueAtTime(1760, t);
      bell.frequency.exponentialRampToValueAtTime(880, t + 0.35);

      bellGain.gain.setValueAtTime(0.22, t);
      bellGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      bell.connect(bellGain);
      bellGain.connect(c.destination);

      bell.start(t);
      bell.stop(t + 0.35);
    }, 40);
  } catch {
    /* ignore */
  }
}
