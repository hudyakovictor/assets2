import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import type { Scenario } from "../data/scenarios";

export type ChartTreatment = "teal" | "mono" | "gold" | "coral";

interface Props {
  sc: Scenario;
  revealed?: number; // how many hidden candles are drawn
  treatment?: ChartTreatment;
  height?: number;
  /* frame 2: tap recognition */
  tapMode?: boolean;
  tapResult?: "hit" | "miss" | null;
  onTap?: (index: number) => void;
  /* misc */
  showLabels?: boolean;
  showEvent?: boolean;
  hideVeil?: boolean;
  compact?: boolean;
}

const W = 340;

const PALETTE: Record<ChartTreatment, { up: string; down: string; glow: string }> = {
  teal: { up: "#3fe0a5", down: "#f07a72", glow: "#35e0c8" },
  mono: { up: "#dbe6ff", down: "#7f8db0", glow: "#9fb4ff" },
  gold: { up: "#ffd15c", down: "#d17a6d", glow: "#ffcf5c" },
  coral: { up: "#5be0c8", down: "#e8655f", glow: "#e8655f" },
};

export default function Chart({
  sc, revealed = 0, treatment = "teal", height = 250, tapMode, tapResult, onTap,
  showLabels = true, showEvent = false, hideVeil = false, compact,
}: Props) {
  const H = height;
  const pal = PALETTE[treatment];
  const total = sc.candles.length;
  const visibleCount = sc.t0 + 1 + revealed;
  const padX = 12;
  const padTop = compact ? 12 : 30;
  const padBot = compact ? 12 : 26;
  const step = (W - padX * 2) / total;
  const cw = step * 0.62;

  const lo = Math.min(...sc.candles.map((c) => c.l));
  const hi = Math.max(...sc.candles.map((c) => c.h));
  const y = (v: number) => padTop + (1 - (v - lo) / (hi - lo)) * (H - padTop - padBot);
  const x = (i: number) => padX + i * step + step / 2;

  const veilX = x(sc.t0) + step / 2 + 2;
  const veilW = W - padX - veilX;
  const svgRef = useRef<SVGSVGElement>(null);

  const eventIdx = useMemo(() => {
    // biggest move in hidden part
    let best = sc.t0 + 1, m = 0;
    for (let i = sc.t0 + 1; i < total; i++) {
      const d = Math.abs(sc.candles[i].c - sc.candles[i].o);
      if (d > m) { m = d; best = i; }
    }
    return best;
  }, [sc, total]);

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (!tapMode || !onTap || !svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const idx = Math.round((px - padX - step / 2) / step);
    onTap(Math.max(0, Math.min(sc.t0, idx)));
  }

  const [fz0, fz1] = sc.fallZone;
  const revealPct = revealed / (total - sc.t0 - 1);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="block w-full select-none"
      style={{ cursor: tapMode ? "pointer" : "default", touchAction: "manipulation" }}
      onClick={handleClick}
    >
      <defs>
        <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a1220" stopOpacity="0.2" />
          <stop offset="0.25" stopColor="#0a1220" stopOpacity="0.9" />
          <stop offset="1" stopColor="#0a1220" stopOpacity="0.97" />
        </linearGradient>
        <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pal.glow} stopOpacity="0.0" />
          <stop offset="0.5" stopColor={pal.glow} stopOpacity="0.10" />
          <stop offset="1" stopColor={pal.glow} stopOpacity="0.0" />
        </linearGradient>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke={pal.glow} strokeOpacity="0.10" strokeWidth="2" />
        </pattern>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        {/* Casual candy glow: soft halo on every candle body */}
        <filter id="candleGlowUp" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.1" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="candleGlowDown" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.1" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="candleUp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pal.up} stopOpacity="1" />
          <stop offset="1" stopColor={pal.up} stopOpacity="0.72" />
        </linearGradient>
        <linearGradient id="candleDown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pal.down} stopOpacity="1" />
          <stop offset="1" stopColor={pal.down} stopOpacity="0.72" />
        </linearGradient>
        <radialGradient id="beacon"><stop offset="0" stopColor={pal.glow} stopOpacity="0.9" /><stop offset="1" stopColor={pal.glow} stopOpacity="0" /></radialGradient>
      </defs>

      {/* ambient floor glow */}
      <ellipse cx={W / 2} cy={H} rx={W * 0.6} ry={H * 0.25} fill={pal.glow} opacity="0.06" />

      {/* fall-zone recognition highlight */}
      {tapMode && (
        <>
          {/* Idle hint: the tappable area is softly shown BEFORE any press,
              so the player is never asked to tap an invisible/empty spot. */}
          {!tapResult && (
            <motion.rect
              x={x(fz0) - step / 2} y={padTop - 6} width={x(fz1) - x(fz0) + step} height={H - padTop - padBot + 12} rx={12}
              fill="rgba(255,209,92,0.07)" stroke="#ffd15c" strokeWidth="2" strokeDasharray="7 6"
              animate={{ opacity: [0.45, 0.95, 0.45] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          {(tapResult === "miss" || tapResult === "hit") && (
            <motion.rect
              initial={{ opacity: 0 }} animate={{ opacity: tapResult === "hit" ? 1 : [0.3, 1, 0.3] }}
              transition={tapResult === "hit" ? { duration: 0.3 } : { duration: 1.2, repeat: Infinity }}
              x={x(fz0) - step / 2} y={padTop - 6} width={x(fz1) - x(fz0) + step} height={H - padTop - padBot + 12} rx={12}
              fill={tapResult === "hit" ? "rgba(63,224,165,0.10)" : "rgba(255,209,92,0.10)"}
              stroke={tapResult === "hit" ? pal.up : "#ffd15c"} strokeWidth="2" strokeDasharray={tapResult === "hit" ? "0" : "6 5"}
            />
          )}
        </>
      )}

      {/* candles */}
      {sc.candles.slice(0, visibleCount).map((c, i) => {
        const up = c.c >= c.o;
        const col = up ? pal.up : pal.down;
        const top = y(Math.max(c.o, c.c));
        const bh = Math.max(2.5, Math.abs(y(c.o) - y(c.c)));
        const isHidden = i > sc.t0;
        const isEvent = showEvent && i === eventIdx;
        return (
          <motion.g
            key={i}
            initial={isHidden ? { opacity: 0, scale: 0.6 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            style={{ transformOrigin: `${x(i)}px ${y(c.o)}px` }}
          >
            <line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth={2} strokeLinecap="round" opacity={isEvent ? 1 : 0.75} />
            <rect
              x={x(i) - cw / 2} y={top} width={cw} height={bh} rx={cw * 0.32}
              fill={up ? "url(#candleUp)" : "url(#candleDown)"}
              filter={isEvent ? "url(#glow)" : up ? "url(#candleGlowUp)" : "url(#candleGlowDown)"}
            />
            {/* candy glass highlight */}
            <rect x={x(i) - cw / 2 + 1.2} y={top + 1.4} width={cw * 0.34} height={Math.max(1.5, bh - 2.8)} rx={cw * 0.2} fill="#fff" opacity={0.32} />
          </motion.g>
        );
      })}

      {/* "now" beacon at t0 */}
      {revealed === 0 && !hideVeil && (
        <g>
          <circle cx={x(sc.t0)} cy={y(sc.candles[sc.t0].c)} r="14" fill="url(#beacon)" className="pulse-ring" style={{ transformOrigin: `${x(sc.t0)}px ${y(sc.candles[sc.t0].c)}px` }} />
          <circle cx={x(sc.t0)} cy={y(sc.candles[sc.t0].c)} r="3.5" fill="#fff" />
        </g>
      )}

      {/* hidden zone veil — main visual image */}
      {!hideVeil && revealPct < 1 && (
        <g>
          <motion.g animate={{ x: revealPct * veilW }} transition={{ type: "tween", duration: 0.12 }}>
            <rect x={veilX} y={0} width={veilW} height={H} fill="url(#veil)" />
            <rect x={veilX} y={0} width={veilW} height={H} fill="url(#hatch)" />
            <motion.rect x={veilX} y={0} width={veilW} height={H} fill="url(#fog)" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
            <line x1={veilX} x2={veilX} y1={padTop - 8} y2={H - padBot + 8} stroke={pal.glow} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="3 5" />
          </motion.g>
          {revealed === 0 && !compact && (
            <g>
              <foreignObject x={veilX + 6} y={H / 2 - 30} width={veilW - 10} height={64}>
                <div style={{ fontFamily: "inherit", color: "#c7d3ea", fontSize: 11, fontWeight: 800, lineHeight: 1.25, textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: "#3fe0a5", opacity: 0.9 }}>
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  </div>
                  что было дальше — скрыто
                </div>
              </foreignObject>
            </g>
          )}
        </g>
      )}

      {/* everyday captions on the field */}
      {showLabels && !compact && sc.labels.map((l, i) => {
        const cx = (x(l.from) + x(l.to)) / 2;
        const isTop = (l.side ?? "top") === "top";
        const ty = isTop ? padTop - 12 : H - padBot + 16;
        const extreme = isTop
          ? Math.min(...sc.candles.slice(l.from, l.to + 1).map((c) => c.h))
          : Math.max(...sc.candles.slice(l.from, l.to + 1).map((c) => c.l));
        return (
          <motion.g key={i} initial={{ opacity: 0, y: isTop ? -6 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.25 }}>
            <line x1={x(l.from)} x2={x(l.to)} y1={ty + (isTop ? 4 : -8)} y2={ty + (isTop ? 4 : -8)} stroke="#8fa3c8" strokeOpacity="0.55" strokeWidth="1" />
            <line x1={cx} x2={cx} y1={ty + (isTop ? 4 : -8)} y2={y(extreme) + (isTop ? -3 : 3)} stroke="#8fa3c8" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 3" />
            <text x={cx} y={ty} fill="#c7d3ea" fontSize="10.5" fontWeight="700" textAnchor="middle" style={{ fontStyle: "italic" }}>{l.text}</text>
          </motion.g>
        );
      })}

      {/* event marker after reveal */}
      {showEvent && visibleCount > eventIdx && (
        <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} style={{ transformOrigin: `${x(eventIdx)}px ${y(sc.candles[eventIdx].c)}px` }}>
          <circle cx={x(eventIdx)} cy={y(sc.candles[eventIdx].c)} r="20" fill="none" stroke={pal.glow} strokeOpacity="0.5" strokeWidth="1.5" className="pulse-ring" style={{ transformOrigin: `${x(eventIdx)}px ${y(sc.candles[eventIdx].c)}px` }} />
          <text x={x(eventIdx)} y={padTop - 12} fill="#fff" fontSize="10.5" fontWeight="800" textAnchor={eventIdx > total - 5 ? "end" : "middle"} style={{ fontStyle: "italic" }}>
            вот что было дальше
          </text>
        </motion.g>
      )}
    </svg>
  );
}
