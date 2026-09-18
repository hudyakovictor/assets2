import { useId, useMemo } from "react";

/**
 * Sparkline — super-light inline preview used in carousels, cards, summaries.
 * Renders ~24 stylized candles from a deterministic price series.
 * No interaction, no t0 marker, no chrome — just visual flavor.
 */
export function Sparkline({
  seed,
  w = 220,
  h = 90,
  move = "up",
}: {
  seed: number;
  w?: number;
  h?: number;
  move?: "up" | "down" | "range" | "vol";
}) {
  const uid = useId().replace(/:/g, "");
  const upId = `sp-up-${uid}`;
  const dnId = `sp-dn-${uid}`;

  const candles = useMemo(() => {
    let s = (seed >>> 0) || 1;
    const rnd = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    const n = 26;
    const out: { o: number; c: number; h: number; l: number }[] = [];
    let last = 50 + rnd() * 10;
    for (let i = 0; i < n; i++) {
      const drift = move === "up" ? 0.6 : move === "down" ? -0.5 : (rnd() - 0.5) * 0.7;
      const vol = move === "vol" ? 4 + rnd() * 3 : 1.5 + rnd() * 1.5;
      const o = last;
      const c = Math.max(8, o + drift + (rnd() - 0.5) * vol);
      const h = Math.max(o, c) + rnd() * 2;
      const l = Math.min(o, c) - rnd() * 2;
      out.push({ o, c, h, l });
      last = c;
    }
    return out;
  }, [seed, move]);

  const lo = Math.min(...candles.map((c) => c.l));
  const hi = Math.max(...candles.map((c) => c.h));
  const pad = (hi - lo) * 0.15 || 1;
  const yMin = lo - pad;
  const yMax = hi + pad;
  const slot = w / candles.length;
  const cw = Math.max(2.4, slot * 0.7);
  const y = (v: number) => h - ((v - yMin) / (yMax - yMin)) * h;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={upId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#48e39a" />
          <stop offset="1" stopColor="#2fae76" />
        </linearGradient>
        <linearGradient id={dnId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a6e" />
          <stop offset="1" stopColor="#d8544a" />
        </linearGradient>
      </defs>
      {candles.map((c, i) => {
        const up = c.c >= c.o;
        const x = i * slot + (slot - cw) / 2;
        const top = y(Math.max(c.o, c.c));
        const bh = Math.max(1.5, Math.abs(y(c.o) - y(c.c)));
        return (
          <g key={i}>
            <line x1={x + cw / 2} x2={x + cw / 2} y1={y(c.h)} y2={y(c.l)} stroke={up ? "#48e39a" : "#ff7a6e"} strokeWidth="0.9" />
            <rect x={x} y={top} width={cw} height={bh} rx="0.6" fill={up ? `url(#${upId})` : `url(#${dnId})`} />
          </g>
        );
      })}
    </svg>
  );
}
