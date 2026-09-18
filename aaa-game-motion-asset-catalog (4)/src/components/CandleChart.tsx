import { motion } from "framer-motion";
import type { VariantDef } from "../data/pages";
import { MOTION_PRESETS } from "../data/pages";

/* =====================================================================
   CANDLE CHART — MVP behavior:
   • header: pair · timeframe + LIVE dot (product authenticity)
   • price scale on the right edge
   • before decision: chart ends at t0; future zone = fog + thin SEALED tag
   • after Seal: fast-forward/time-scrub draws historical continuation
   • key event marker, entry-zone highlight, focus pointer
   ===================================================================== */

export interface Candle {
  o: number;
  c: number;
  h: number;
  l: number;
}

const up = (c: Candle) => c.c < c.o;
const UP = "#3ddc97";
const DOWN = "#ff5b6a";

export const CandleChart = ({
  history,
  future = [],
  level,
  sealed = true,
  scrub = 0,
  event,
  zone,
  focus,
  v,
  height = 200,
  pair = "BTC/USDT · 15M",
  prices = ["67 900", "67 800", "67 700"],
  showVolume = true,
}: {
  history: Candle[];
  future?: Candle[];
  level?: number;
  sealed?: boolean;
  scrub?: number; // 0..1 portion of `future` drawn after seal
  event?: { at: number; label: string };
  zone?: { from: number; to: number; color: string; label?: string };
  focus?: { at: number; label: string };
  v: VariantDef;
  height?: number | "100%";
  pair?: string;
  prices?: [string, string, string];
  showVolume?: boolean;
}) => {
  const total = history.length + future.length;
  const pad = 4;
  const step = (100 - pad * 2) / (total + 0.5);
  const xOf = (i: number) => pad + step * (i + 0.5);
  const iw = step * 0.52;
  const pres = MOTION_PRESETS[v.motion];
  const shownFuture = Math.floor(future.length * scrub);
  const futureStart = history.length;
  const t0x = xOf(futureStart - 1) + step * 0.8;

  const gridLines = v.pattern === "grid" ? [25, 50, 75] : v.pattern === "dots" ? [] : [33, 66];
  const priceY = [18, 50, 82];

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[18px] border border-line bg-[#0c1526]" style={{ height, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.03), inset 0 14px 40px rgba(0,0,0,.35)" }}>
      {/* header */}
      <div className="flex shrink-0 items-center justify-between px-3 pt-2 pb-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-extrabold text-ink">{pair}</span>
        </div>
        <span className="flex items-center gap-1 text-[8.5px] font-extrabold tracking-wider" style={{ color: v.glow }}>
          <motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: v.glow }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
          LIVE
        </span>
      </div>

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="block w-full min-h-0 flex-1">
        {/* grid */}
        {gridLines.map((y, i) => (
          <g key={y}>
            <line x1={pad} x2={100 - pad} y1={y} y2={y} stroke="rgba(255,255,255,.05)" strokeWidth="0.3" />
            <text x={100 - pad} y={priceY[i] - 1.5} textAnchor="end" fontSize="3.6" fontWeight="700" fill="#3a4a70">
              {prices[i]}
            </text>
          </g>
        ))}
        {v.pattern === "dots" &&
          Array.from({ length: 24 }).map((_, i) => (
            <circle key={i} cx={8 + (i % 8) * 12} cy={14 + Math.floor(i / 8) * 30} r="0.5" fill="rgba(255,255,255,.08)" />
          ))}
        {v.pattern === "hex" &&
          Array.from({ length: 8 }).map((_, i) => (
            <path key={i} d={`M${12 + i * 11} 20 l4 -7 h8 l4 7 -4 7 h-8 z`} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="0.4" />
          ))}
        {v.pattern === "waves" &&
          [30, 55, 80].map((y, i) => (
            <path key={i} d={`M4 ${y} q 8 -5 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0`} fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="0.5" />
          ))}

        {/* entry zone */}
        {zone && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...pres, delay: 0.5 }}>
            <rect x={xOf(zone.from) - step} y={0} width={(zone.to - zone.from + 1.6) * step} height={100} fill={zone.color} opacity="0.1" />
            <line x1={xOf(zone.from) - step} x2={xOf(zone.from) - step} y1={0} y2={100} stroke={zone.color} strokeWidth="0.4" strokeDasharray="2 1.6" />
            <line x1={xOf(zone.to) + step * 0.6} x2={xOf(zone.to) + step * 0.6} y1={0} y2={100} stroke={zone.color} strokeWidth="0.4" strokeDasharray="2 1.6" />
          </motion.g>
        )}

        {/* level line + tag */}
        {level !== undefined && (
          <>
            <motion.line
              x1={pad}
              x2={100 - pad}
              y1={level}
              y2={level}
              stroke={v.glow}
              strokeWidth="0.5"
              strokeDasharray="2.2 1.6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.85 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, ...pres }}>
              <rect x={pad} y={level - 5} width={13.5} height={6} rx={1.2} fill={v.glow} />
              <text x={pad + 6.7} y={level - 0.6} textAnchor="middle" fontSize="4" fontWeight="800" fill="#0a1120">
                LVL
              </text>
            </motion.g>
          </>
        )}

        {/* volume */}
        {showVolume &&
          history.map((c, i) => {
            const vol = 4 + ((i * 37) % 9);
            return (
              <motion.rect
                key={`v${i}`}
                x={xOf(i) - iw / 2}
                y={96.5 - vol}
                width={iw}
                height={vol}
                rx="0.6"
                fill={up(c) ? "rgba(61,220,151,.28)" : "rgba(255,91,106,.28)"}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.045, ...pres }}
                style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
              />
            );
          })}

        {/* history candles */}
        {history.map((c, i) => (
          <g key={`h${i}`}>
            <motion.line
              x1={xOf(i)}
              x2={xOf(i)}
              y1={c.h}
              y2={c.l}
              stroke={up(c) ? UP : DOWN}
              strokeWidth="0.7"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.2 + i * 0.05, ...pres }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <motion.rect
              x={xOf(i) - iw / 2}
              y={Math.min(c.o, c.c)}
              width={iw}
              height={Math.max(2, Math.abs(c.o - c.c))}
              rx="0.8"
              fill={up(c) ? UP : DOWN}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.22 + i * 0.05, ...pres }}
              style={{
                transformBox: "fill-box",
                transformOrigin: up(c) ? "bottom" : "top",
                filter: `drop-shadow(0 0 ${v.chart.glow * 0.4}px ${up(c) ? UP : DOWN})`,
              }}
            />
          </g>
        ))}

        {/* t0 line */}
        <motion.line
          x1={t0x}
          x2={t0x}
          y1={3}
          y2={97}
          stroke="#eaf2ff"
          strokeWidth="0.5"
          strokeDasharray="1.6 1.4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.9 }}
        />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          <rect x={t0x - 4.5} y={4.5} width={9} height={6} rx={1.2} fill="#eaf2ff" />
          <text x={t0x} y={8.8} textAnchor="middle" fontSize="4" fontWeight="800" fill="#0a1120">
            t0
          </text>
        </motion.g>

        {/* future: fog while sealed */}
        {sealed && (
          <g>
            <defs>
              <linearGradient id="fogGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(12,21,38,0.2)" />
                <stop offset="100%" stopColor="rgba(12,21,38,0.96)" />
              </linearGradient>
            </defs>
            <rect x={t0x} y={2} width={100 - t0x - pad} height={96} fill="url(#fogGrad)" opacity="0.9" />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              <rect x={58} y={8} width={26} height={7} rx={1.4} fill="#151f35" stroke="#2a3a5e" strokeWidth="0.4" />
              <text x={71} y={12.7} textAnchor="middle" fontSize="3.8" fontWeight="800" fill="#6b7a9c" letterSpacing="0.4">
                SEALED · t0+
              </text>
            </motion.g>
          </g>
        )}

        {/* future candles revealed by scrub */}
        {!sealed &&
          future.slice(0, shownFuture).map((c, i) => {
            const gi = futureStart + i;
            return (
              <g key={`f${i}`}>
                <motion.line
                  x1={xOf(gi)}
                  x2={xOf(gi)}
                  y1={c.h}
                  y2={c.l}
                  stroke={up(c) ? UP : DOWN}
                  strokeWidth="0.7"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.12 }}
                />
                <motion.rect
                  x={xOf(gi) - iw / 2}
                  y={Math.min(c.o, c.c)}
                  width={iw}
                  height={Math.max(2, Math.abs(c.o - c.c))}
                  rx="0.8"
                  fill={up(c) ? UP : DOWN}
                  initial={{ opacity: 0, scaleY: 0.4 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.16 }}
                  style={{ transformBox: "fill-box", transformOrigin: up(c) ? "bottom" : "top" }}
                />
              </g>
            );
          })}

        {/* key event */}
        {event && !sealed && scrub > (event.at + 1) / Math.max(1, future.length) && (
          <g>
            <motion.circle
              cx={xOf(futureStart + event.at)}
              cy={(future[event.at].h + future[event.at].l) / 2}
              r="5"
              fill="none"
              stroke={v.glow}
              strokeWidth="0.7"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={pres}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <motion.circle
              cx={xOf(futureStart + event.at)}
              cy={(future[event.at].h + future[event.at].l) / 2}
              r="5"
              fill="none"
              stroke={v.glow}
              strokeWidth="0.5"
              initial={{ opacity: 0.9 }}
              animate={{ scale: [1, 2], opacity: [0.9, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <rect x={xOf(futureStart + event.at) - 12} y={14} width={24} height={6.4} rx={1.4} fill={v.glow} />
              <text x={xOf(futureStart + event.at)} y={18.6} textAnchor="middle" fontSize="3.8" fontWeight="800" fill="#0a1120">
                {event.label}
              </text>
            </motion.g>
          </g>
        )}

        {/* focus target (first action) */}
        {focus && sealed && (
          <g>
            <motion.circle
              cx={xOf(focus.at)}
              cy={(history[focus.at].h + history[focus.at].l) / 2}
              r="6"
              fill="none"
              stroke={v.glow}
              strokeWidth="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.9, 0.3, 0.9], scale: [1, 1.15, 1] }}
              transition={{ opacity: { duration: 1.2, repeat: Infinity }, scale: { duration: 1.2, repeat: Infinity }, delay: 1.3 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, ...pres }}>
              <rect x={Math.min(78, xOf(focus.at) - 12)} y={14} width={24} height={7} rx={1.4} fill={v.glow} />
              <text x={Math.min(78, xOf(focus.at) - 12) + 12} y={18.8} textAnchor="middle" fontSize="3.8" fontWeight="800" fill="#0a1120">
                {focus.label}
              </text>
              <line x1={xOf(focus.at)} x2={xOf(focus.at)} y1={21} y2={(history[focus.at].h + history[focus.at].l) / 2 - 7} stroke={v.glow} strokeWidth="0.4" strokeDasharray="1.4 1.2" />
            </motion.g>
          </g>
        )}

        {/* scan line (variant B) */}
        {v.chart.scan && (
          <motion.line
            x1={pad}
            x2={100 - pad}
            y1={0}
            y2={0}
            stroke={v.chart.scanColor}
            strokeWidth="0.5"
            opacity="0.35"
            animate={{ y1: [4, 92, 4], y2: [4, 92, 4] }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          />
        )}
      </svg>
    </div>
  );
};

export default CandleChart;
