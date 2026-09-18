/* ============================================================================
   ART ENGINE — every non-repo visual is generated as SVG (no emoji, no random
   external assets). Motifs are driven by the asset registry in catalog.ts, so a
   variant can only change: assetId, motif, tint, treatment, crop, fit, scale,
   position, opacity, motion.
   ========================================================================== */
import type { CSSProperties, ReactNode } from "react";
import { ASSETS, type ArtSpec } from "./catalog";
import { ArenaEmblem, EmblemCompact } from "../icons/ui";
import { SkillGlyph } from "../icons/skill";

const TINT: Record<string, [string, string, string]> = {
  teal: ["#46d3b1", "#1f8f78", "#0b2a2a"],
  gold: ["#ffd76b", "#e08700", "#3a2704"],
  steel: ["#9db3d3", "#4c6180", "#141f36"],
  ember: ["#e98680", "#c56861", "#3a1414"],
  ice: ["#8fd8ff", "#3f7fae", "#10233f"],
  neutral: ["#cfe0f5", "#54718f", "#101c30"],
};

const R = (x: number, y: number, w: number, h: number, rx: number, fill: string, o = 1) => (
  <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} opacity={o} />
);
const C = (cx: number, cy: number, r: number, fill: string, o = 1) => (
  <circle cx={cx} cy={cy} r={r} fill={fill} opacity={o} />
);
const L = (x1: number, y1: number, x2: number, y2: number, s: string, w = 2, op = 1, dash?: string) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={s} strokeWidth={w} opacity={op} strokeDasharray={dash} strokeLinecap="round" />
);

function candle(x: number, y: number, w: number, h: number, up: boolean, tint: [string, string, string], wick = 0.6) {
  const col = up ? "#3ECF8E" : "#E2605C";
  const deep = up ? "#1E7C53" : "#A03A38";
  const top = up ? y : y + h * 0.2;
  return (
    <g>
      {L(x + w / 2, y - h * wick, x + w / 2, y + h + h * wick * 0.7, col, 2.2, 0.85)}
      <rect x={x} y={top} width={w} height={h * (up ? 1 : 0.8)} rx={Math.min(3, w / 2)} fill={col} />
      <rect x={x} y={top} width={w * 0.34} height={h * (up ? 1 : 0.8)} rx={Math.min(2, w / 4)} fill="#ffffff" opacity={0.3} />
      <rect x={x} y={top + h * (up ? 1 : 0.8) - 2} width={w} height={2} fill={deep} opacity={0.8} />
      <rect x={x - 1} y={top + h * (up ? 1 : 0.8) + 3} width={w + 2} height={5} rx={2} fill={tint[0]} opacity={0.8} />
    </g>
  );
}

/* --------------------------------- HEROES -------------------------------- */
const HEROES: Record<string, (t: [string, string, string]) => ReactNode> = {
  "hero/candle-anatomy": (t) => (<>
    <rect x="6" y="6" width="108" height="108" rx="20" fill={t[2]} opacity=".5" />
    {candle(48, 30, 22, 56, true, t, 0.9)}
    {L(24, 46, 44, 46, t[0], 1.6, 0.9, "5 4")}
    {L(24, 78, 44, 78, t[0], 1.6, 0.9, "5 4")}
    {L(74, 22, 96, 22, t[0], 1.6, 0.9, "5 4")}
    {L(74, 100, 96, 100, t[0], 1.6, 0.9, "5 4")}
    {C(24, 46, 3, t[0])}{C(24, 78, 3, t[0])}{C(96, 22, 3, t[0])}{C(96, 100, 3, t[0])}
    <rect x="44" y="34" width="30" height="48" rx="4" fill="none" stroke="#fff" strokeWidth="1.6" opacity=".65" />
  </>),
  "hero/candle-duel": (t) => (<>
    <rect x="6" y="6" width="108" height="108" rx="20" fill={t[2]} opacity=".5" />
    <g transform="translate(60,64) rotate(-26)">{candle(-9, -46, 18, 46, true, t, 0.7)}</g>
    <g transform="translate(60,64) rotate(26)">{candle(-9, -46, 18, 46, false, t, 0.7)}</g>
    {C(60, 64, 6, t[0])}
  </>),
  "hero/trend-ladder": (t) => (<>
    <rect x="6" y="6" width="108" height="108" rx="20" fill={t[2]} opacity=".5" />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect x={12 + i * 26} y={20 + i * 8} width={26} height={86 - i * 8} rx="6" fill={t[1]} opacity={0.22 + i * 0.1} />
        <path d={`M${14 + i * 26} ${96 - i * 8} l13 ${-14 - i * 4} l13 ${14 + i * 4}`} fill="none" stroke={t[0]} strokeWidth="2.4" opacity=".9" />
      </g>
    ))}
    {L(10, 100, 112, 100, "#fff", 1.4, 0.35, "4 5")}
  </>),
  "hero/trend-ribbon": (t) => (<>
    <rect x="6" y="6" width="108" height="108" rx="20" fill={t[2]} opacity=".5" />
    <path d="M10 92 C34 92 34 60 56 52 C80 43 82 24 110 20" fill="none" stroke={t[1]} strokeWidth="9" opacity=".55" strokeLinecap="round" />
    <path d="M10 92 C34 92 34 60 56 52 C80 43 82 24 110 20" fill="none" stroke={t[0]} strokeWidth="3" strokeLinecap="round" />
    <path d="M100 12 l14 8 -14 9z" fill={t[0]} />
    {[0, 1, 2, 3, 4].map((i) => C(20 + i * 20, 84 - i * 15, 3.4, "#fff", 0.8))}
  </>),
  "hero/volume-bars": (t) => (<>
    <rect x="6" y="6" width="108" height="108" rx="20" fill={t[2]} opacity=".5" />
    {[18, 38, 30, 62, 46, 88, 70].map((h, i) => (
      <g key={i}>
        {R(14 + i * 14, 100 - h, 10, h, 3, i === 5 ? "#3ECF8E" : t[1], i === 5 ? 1 : 0.65)}
      </g>
    ))}
    {L(10, 100, 112, 100, "#fff", 1.4, 0.3)}
    <path d="M14 78 L42 62 L60 48 L74 30" fill="none" stroke={t[0]} strokeWidth="2.6" strokeLinecap="round" />
    {C(74, 28, 4, t[0])}
  </>),
  "hero/volume-stair": (t) => (<>
    <rect x="6" y="6" width="108" height="108" rx="20" fill={t[2]} opacity=".5" />
    {[0, 1, 2, 3].map((i) => (<g key={i}>{R(16 + i * 22, 74 - i * 18, 20, 26, 5, i > 1 ? t[0] : t[1], 0.7 + i * 0.08)}</g>))}
    {L(12, 100, 110, 100, "#fff", 1.4, 0.3)}
  </>),
  "hero/risk-ruler": (t) => (<>
    <rect x="6" y="6" width="108" height="108" rx="20" fill={t[2]} opacity=".5" />
    {R(14, 66, 92, 18, 6, t[1], 0.8)}
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => L(18 + i * 12, 66, 18 + i * 12, 74, "#fff", 2, 0.65))}
    {R(14, 66, 34, 18, 6, "#3ECF8E", 0.9)}
    {R(60, 66, 46, 18, 6, "#E2605C", 0.85)}
    <path d="M18 52 h80" stroke="#fff" strokeWidth="1.6" opacity=".5" strokeDasharray="5 4" />
    {C(18, 52, 3.6, "#3ECF8E")}{C(98, 52, 3.6, "#E2605C")}
    {R(30, 26, 60, 14, 7, t[0], 0.9)}
  </>),
  "hero/risk-shield": (t) => (<>
    <rect x="6" y="6" width="108" height="108" rx="20" fill={t[2]} opacity=".5" />
    <path d="M60 12 L102 28 v34 c0 26 -18 40 -42 50 -24-10-42-24-42-50V28z" fill={t[1]} opacity=".55" stroke="#fff" strokeWidth="1.6" />
    {C(48, 48, 11, "#fff", 0.9)}{C(74, 74, 11, "#fff", 0.9)}
    {L(38, 80, 84, 38, t[2], 4)}
  </>),
  "hero/tf-stack": (t) => (<>
    <rect x="6" y="6" width="108" height="108" rx="20" fill={t[2]} opacity=".5" />
    {[0, 1, 2].map((i) => (
      <g key={i} opacity={1 - i * 0.22}>
        {R(18 + i * 10, 16 + i * 24, 80, 30, 8, t[2], 0.9)}
        <rect x={18 + i * 10} y={16 + i * 24} width={80} height={30} rx={8} fill="none" stroke={t[0]} strokeWidth="1.6" />
        {C(34 + i * 10, 31 + i * 24, 5, i === 0 ? "#E2605C" : "#3ECF8E")}
        {L(46 + i * 10, 31 + i * 24, 90 + i * 8, 31 + i * 24, "#fff", 1.6, 0.5, "4 4")}
      </g>
    ))}
  </>),
  "hero/tf-clock": (t) => (<>
    <rect x="6" y="6" width="108" height="108" rx="20" fill={t[2]} opacity=".5" />
    <circle cx="60" cy="60" r="42" fill="none" stroke={t[1]} strokeWidth="9" opacity=".5" />
    <circle cx="60" cy="60" r="42" fill="none" stroke="#fff" strokeWidth="1.6" opacity=".55" />
    <path d="M60 60 L60 18 A42 42 0 0 0 22 72z" fill={t[0]} opacity=".5" />
    {L(60, 60, 60, 24, "#fff", 3)}{L(60, 60, 88, 74, "#fff", 2.4)}
    {C(60, 60, 5, "#fff")}
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const a = (i / 8) * Math.PI * 2;
      return (
        <line key={`t${i}`} x1={60 + Math.cos(a) * 34} y1={60 + Math.sin(a) * 34}
          x2={60 + Math.cos(a) * 40} y2={60 + Math.sin(a) * 40} stroke="#fff" strokeWidth="2.2" opacity=".7" />
      );
    })}
    {R(8, 104, 26, 8, 4, "#3ECF8E", 0.8)}{R(38, 104, 26, 8, 4, t[0], 0.8)}{R(68, 104, 26, 8, 4, t[1], 0.8)}
  </>),
  "hero/seal-press": (t) => (<>
    <rect x="6" y="6" width="108" height="108" rx="20" fill={t[2]} opacity=".5" />
    {C(60, 60, 38, t[1], 0.35)}
    <circle cx="60" cy="60" r="30" fill="none" stroke="#fff" strokeWidth="2.4" />
    <circle cx="60" cy="60" r="23" fill="none" stroke={t[0]} strokeWidth="1.6" strokeDasharray="4 4" />
    <g transform="translate(60,62) scale(.42)">
      <g transform="rotate(-26)">{candle(-9, -46, 18, 46, true, t, 0.7)}</g>
      <g transform="rotate(26)">{candle(-9, -46, 18, 46, false, t, 0.7)}</g>
    </g>
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <line key={i} x1={60 + Math.cos((i / 8) * 6.28) * 38} y1={60 + Math.sin((i / 8) * 6.28) * 38}
        x2={60 + Math.cos((i / 8) * 6.28) * 48} y2={60 + Math.sin((i / 8) * 6.28) * 48} stroke={t[0]} strokeWidth="3" opacity=".8" />
    ))}
  </>),
  "hero/seal-oath": (t) => (<>
    <rect x="6" y="6" width="108" height="108" rx="20" fill={t[2]} opacity=".5" />
    {R(20, 20, 80, 56, 10, "#0b1727", 0.9)}
    <rect x="20" y="20" width="80" height="56" rx="10" fill="none" stroke={t[0]} strokeWidth="1.8" />
    {[0, 1, 2].map((i) => L(30, 34 + i * 12, 90, 34 + i * 12, "#fff", 2, 0.35 - i * 0.06))}
    {C(50, 92, 16, t[1])}{C(50, 92, 11, t[0], 0.9)}{C(50, 92, 4.4, t[2])}
    {L(64, 92, 96, 92, t[0], 3, 0.8)}
  </>),
};

/* ------------------------------- ORNAMENTS ------------------------------- */
const ORNAMENTS: Record<string, (t: [string, string, string]) => ReactNode> = {
  "orn/crest": (t) => (<>
    <path d="M60 8 L106 26 v30 c0 28 -20 44 -46 56 -26-12-46-28-46-56V26z" fill={t[2]} opacity=".85" stroke={t[1]} strokeWidth="2.4" />
    <g transform="translate(60,60) scale(.5)">
      <g transform="rotate(-24)">{candle(-9, -44, 18, 44, true, t, 0.7)}</g>
      <g transform="rotate(24)">{candle(-9, -44, 18, 44, false, t, 0.7)}</g>
    </g>
    {R(34, 96, 52, 8, 4, t[0], 0.85)}
    {[0, 1, 2].map((i) => L(46 + i * 14, 92, 46 + i * 14, 98, "#fff", 2, 0.5))}
  </>),
  "orn/vault": (t) => (<>
    <rect x="12" y="24" width="96" height="76" rx="12" fill={t[2]} opacity=".9" stroke={t[1]} strokeWidth="2.2" />
    <rect x="12" y="24" width="96" height="20" rx="12" fill={t[1]} opacity=".55" />
    <circle cx="60" cy="66" r="20" fill="none" stroke={t[0]} strokeWidth="3" />
    <circle cx="60" cy="66" r="7" fill={t[0]} />
    {L(60, 66, 74, 52, "#fff", 3)}
    {R(24, 34, 10, 4, 2, "#fff", 0.5)}{R(40, 34, 10, 4, 2, "#fff", 0.35)}
    <path d="M12 24 L108 100" stroke="#fff" strokeWidth="1.4" opacity=".16" />
  </>),
  "orn/frame": (t) => (<>
    <path d="M20 44 V20 h24" fill="none" stroke={t[0]} strokeWidth="3.4" />
    <path d="M100 44 V20 h-24" fill="none" stroke={t[0]} strokeWidth="3.4" />
    <path d="M20 76 v24 h24" fill="none" stroke={t[0]} strokeWidth="3.4" />
    <path d="M100 76 v24 h-24" fill="none" stroke={t[0]} strokeWidth="3.4" />
    <path d="M30 30 q30 -14 60 0" fill="none" stroke={t[1]} strokeWidth="1.8" opacity=".7" />
    <path d="M30 90 q30 14 60 0" fill="none" stroke={t[1]} strokeWidth="1.8" opacity=".7" />
    {C(60, 60, 10, t[0], 0.35)}{C(60, 60, 4.4, t[0])}
  </>),
  "orn/chain": (t) => (<>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${30 + i * 30},${60 - i * 14})`}>
        <path d="M0 -13 L13 0 L0 13 L-13 0z" fill={t[2]} stroke={t[0]} strokeWidth="2.4" />
        <circle r="4" fill={t[0]} />
      </g>
    ))}
    {L(18, 74, 102, 46, "#fff", 1.6, 0.22, "6 5")}
  </>),
  "orn/cup": (t) => (<>
    <path d="M38 20 h44 v26 a22 22 0 0 1 -44 0z" fill={t[0]} opacity=".92" />
    <path d="M38 26 h-12 a14 14 0 0 0 14 16 M82 26 h12 a14 14 0 0 1 -14 16" fill="none" stroke={t[0]} strokeWidth="3.4" />
    {R(52, 68, 16, 14, 3, t[1])}
    {R(36, 84, 48, 9, 4, t[1])}
    {C(60, 33, 8, t[2], 0.9)}
    <g transform="translate(60,33) scale(.22)">
      <g transform="rotate(-24)">{candle(-9, -40, 18, 40, true, t, 0.6)}</g>
      <g transform="rotate(24)">{candle(-9, -40, 18, 40, false, t, 0.6)}</g>
    </g>
  </>),
  "orn/blades": (t) => (<>
    <g transform="translate(60,62) rotate(-30)">{candle(-10, -48, 20, 48, true, t, 0.7)}</g>
    <g transform="translate(60,62) rotate(30)">{candle(-10, -48, 20, 48, false, t, 0.7)}</g>
    {C(60, 62, 5, t[0])}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <line key={i} x1={60 + Math.cos((i / 6) * 6.28) * 30} y1={62 + Math.sin((i / 6) * 6.28) * 30}
        x2={60 + Math.cos((i / 6) * 6.28) * 40} y2={62 + Math.sin((i / 6) * 6.28) * 40} stroke={t[0]} strokeWidth="2.6" opacity=".55" />
    ))}
  </>),
  "orn/podium": (t) => (<>
    {R(18, 54, 28, 46, 5, t[1], 0.75)}
    {R(46, 38, 28, 62, 5, t[0], 0.95)}
    {R(74, 62, 28, 38, 5, t[1], 0.6)}
    {[1, 2, 3].map((n, i) => (<g key={n}>{C(32 + i * 28, 46 - (i === 1 ? 0 : 8), 9, t[2], 0.85)}</g>))}
    {R(38, 20, 44, 8, 4, t[0], 0.85)}
    {[0, 1, 2].map((i) => L(30 + i * 30, 100, 30 + i * 30, 96, "#fff", 2, 0.3))}
  </>),
  "orn/archive": (t) => (<>
    {R(14, 20, 92, 76, 8, t[2], 0.9)}
    {[0, 1, 2, 3].map((i) => (<g key={i}>{R(22 + i * 22, 30, 16, 56, 3, i % 2 ? t[1] : t[0], 0.5 + i * 0.12)}</g>))}
    {[0, 1, 2].map((i) => L(22, 36 + i * 18, 98, 36 + i * 18, "#fff", 1.6, 0.22))}
    {C(60, 96, 4, t[0])}
  </>),
  "orn/chalk": (t) => (<>
    {R(16, 22, 88, 66, 8, "#0c1b2b", 0.95)}
    <rect x="16" y="22" width="88" height="66" rx="8" fill="none" stroke={t[1]} strokeWidth="2.2" />
    <path d="M26 74 q10 -30 20 -14 t20 -22 t22 0" fill="none" stroke="#fff" strokeWidth="2.6" opacity=".8" />
    {[0, 1, 2].map((i) => L(28, 34 + i * 8, 74 - i * 14, 34 + i * 8, t[0], 2.4, 0.6))}
    {R(30, 92, 60, 6, 3, t[0], 0.5)}
  </>),
  "orn/radar": (t) => (<>
    <path d="M60 16 L98 38 v40 L60 100 L22 78 V38z" fill={t[2]} opacity=".8" stroke={t[1]} strokeWidth="2" />
    {[0.35, 0.62, 0.9].map((s, i) => (
      <path key={i} d={`M60 16 L98 38 v40 L60 100 L22 78 V38z`} transform={`translate(60 60) scale(${s}) translate(-60 -60)`}
        fill="none" stroke={t[0]} strokeWidth="1.4" opacity=".7" />
    ))}
    {L(60, 60, 92, 36, "#fff", 2.6)}
    {C(78, 66, 3.6, t[0])}{C(44, 46, 3, "#3ECF8E")}{C(66, 84, 3, "#E2605C")}
    {C(60, 60, 4, "#fff")}
  </>),
  "orn/bells": (t) => (<>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${60 - 22 + i * 22},${50 - i * 6})`}>
        <path d="M0 -14 c9 0 14 6 14 14 0 6 2 9 4 11 v3 h-36 v-3 c2-2 4-5 4-11 0-8 5-14 14-14z" fill={i === 1 ? t[0] : t[1]} opacity={i === 1 ? 0.95 : 0.6} />
        <path d="M-5 16 a5 5 0 0 0 10 0" fill="none" stroke={t[0]} strokeWidth="2.4" />
      </g>
    ))}
    {L(34, 90, 86, 90, "#fff", 2, 0.3)}
    {C(80, 34, 5, "#E2605C")}
  </>),
  "orn/scroll": (t) => (<>
    {R(18, 26, 84, 68, 8, "#12304a", 0.92)}
    <rect x="18" y="26" width="84" height="68" rx="8" fill="none" stroke={t[1]} strokeWidth="2.2" />
    {[0, 1, 2, 3].map((i) => L(28, 42 + i * 13, 92 - (i % 2) * 18, 42 + i * 13, "#fff", 2.4, 0.4 - i * 0.05))}
    {C(78, 84, 12, t[0])}{C(78, 84, 6, t[2])}
    {R(14, 18, 92, 10, 5, t[1], 0.9)}{R(14, 92, 92, 10, 5, t[1], 0.9)}
  </>),
  "orn/stamp": (t) => (<>
    {R(28, 22, 64, 40, 8, t[1], 0.9)}
    <rect x="28" y="22" width="64" height="40" rx="8" fill="none" stroke="#fff" strokeWidth="1.6" opacity=".5" />
    {R(52, 62, 16, 20, 4, t[1])}
    {R(24, 82, 72, 12, 6, t[0], 0.95)}
    <g transform="translate(60,42) scale(.36)">
      <g transform="rotate(-26)">{candle(-9, -40, 18, 40, true, t, 0.6)}</g>
      <g transform="rotate(26)">{candle(-9, -40, 18, 40, false, t, 0.6)}</g>
    </g>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <line key={i} x1={60 + Math.cos((i / 6) * 6.28 + 0.4) * 40} y1={66 + Math.sin((i / 6) * 6.28 + 0.4) * 26}
        x2={60 + Math.cos((i / 6) * 6.28 + 0.4) * 50} y2={66 + Math.sin((i / 6) * 6.28 + 0.4) * 34} stroke={t[0]} strokeWidth="2.4" opacity=".5" />
    ))}
  </>),
  "orn/strike": (t) => (<>
    {R(46, 46, 28, 52, 4, "#E2605C", 0.95)}
    {L(60, 26, 60, 46, "#E2605C", 3, 0.9)}
    <path d="M74 14 L40 58 h16 l-8 30 34-46h-16z" fill={t[0]} stroke={t[1]} strokeWidth="2" strokeLinejoin="round" />
    {R(12, 98, 96, 6, 3, "#fff", 0.18)}
    {[0, 1, 2].map((i) => L(20 + i * 14, 30 + i * 6, 44, 30 + i * 6, "#fff", 2, 0.25, "4 4"))}
  </>),
  "orn/strike-gap": (t) => (<>
    {candle(16, 40, 16, 26, true, t, 0.6)}
    {candle(88, 52, 16, 24, false, t, 0.6)}
    {L(36, 62, 84, 62, t[0], 2.4, 0.8, "6 5")}
    <path d="M56 18 L34 58 h14 l-6 26 26-40h-14z" fill={t[0]} opacity=".9" stroke={t[1]} strokeWidth="1.8" />
    {R(12, 96, 96, 6, 3, "#fff", 0.16)}
  </>),
};

/* --------------------------------- CUES ---------------------------------- */
const CUES: Record<string, (t: [string, string, string]) => ReactNode> = {
  "cue/target-ring": (t) => (<>
    <circle cx="60" cy="60" r="34" fill="none" stroke={t[0]} strokeWidth="3" opacity=".9" />
    <circle cx="60" cy="60" r="46" fill="none" stroke={t[0]} strokeWidth="1.6" opacity=".45" strokeDasharray="6 6" />
    <circle cx="60" cy="60" r="52" fill="none" stroke="#fff" strokeWidth="1.4" opacity=".25" />
    {C(60, 60, 5, "#fff")}
    {L(60, 60, 92, 34, t[0], 3)}
  </>),
  "cue/level-dash": (t) => (<>
    {R(14, 52, 92, 18, 5, "#3ECF8E", 0.28)}
    {L(14, 52, 106, 52, t[0], 2.6, 0.95, "8 6")}
    {L(14, 70, 106, 70, t[1], 2, 0.6, "8 6")}
    {C(106, 52, 4, t[0])}
  </>),
  "cue/whale-band": (t) => (<>
    {R(12, 44, 96, 32, 7, t[1], 0.35)}
    {L(12, 44, 108, 44, "#fff", 1.8, 0.55)}
    {L(12, 76, 108, 76, "#fff", 1.8, 0.55)}
    {R(30, 56, 60, 10, 5, t[0], 0.9)}
    C(24, 60, 6, t[0]) C(96, 60, 6, t[0]) C(24, 60, 2.4, t[2]) C(96, 60, 2.4, t[2])
  </>),
  "cue/retest-tray": (t) => (<>
    <path d="M20 44 h80 l-10 32 h-60z" fill={t[1]} opacity=".35" stroke={t[0]} strokeWidth="2.2" />
    {L(20, 44, 100, 44, "#fff", 3)}
    {L(30, 76, 90, 76, "#fff", 2, 0.6, "6 5")}
    {C(60, 60, 4.6, t[0])}
  </>),
};

/* --------------------------------- FEEDS --------------------------------- */
const FEEDS: Record<string, (t: [string, string, string]) => ReactNode> = {
  immersive: (t) => (<>
    {[0, 1, 2].map((i) => (<g key={i}>{R(10, 14 + i * 32, 100, 26, 8, i === 0 ? t[1] : "#16294a", i === 0 ? 0.75 : 0.95)}{C(26, 27 + i * 32, 8, t[i % 3], 0.9)}</g>))}
  </>),
  tablet: (t) => (<>
    {R(10, 14, 100, 26, 8, "#16294a", 0.95)}{R(66, 19, 36, 15, 7, t[0], 0.7)}
    {R(10, 46, 100, 26, 8, "#16294a", 0.95)}{R(66, 51, 36, 15, 7, "#E2605C", 0.65)}
    {R(10, 78, 100, 26, 8, "#16294a", 0.95)}{R(66, 83, 36, 15, 7, t[1], 0.7)}
    {C(24, 27, 8, t[0], 0.8)}{C(24, 59, 8, "#E2605C", 0.8)}{C(24, 91, 8, t[1], 0.8)}
  </>),
  "lower-third": (t) => (<>
    {R(10, 60, 100, 44, 8, "#0d1e33", 0.95)}
    {R(10, 60, 4, 44, 2, t[0])}
    {R(22, 70, 78, 6, 3, "#fff", 0.35)}{R(22, 82, 60, 6, 3, "#fff", 0.22)}
    {R(60, 20, 50, 22, 6, t[0], 0.85)}
    {C(24, 26, 9, t[1])}
  </>),
  ticker: (t) => (<>
    <g className="ticker-track-holder">
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${k * 120},0)`}>
          {[0, 1, 2, 3].map((i) => (<g key={i}>{R(12 + i * 26, 20, 20, 34, 5, i % 2 ? "#E2605C" : "#3ECF8E", 0.85)}</g>))}
        </g>
      ))}
    </g>
    {R(0, 66, 240, 22, 4, t[2], 0.9)}
    {R(8, 72, 26, 10, 5, t[0], 0.9)}{R(40, 72, 22, 10, 5, "#E2605C", 0.8)}{R(70, 72, 30, 10, 5, t[0], 0.7)}
  </>),
};

/* --------------------------- BACKGROUNDS (slice) -------------------------- */
const BACKGROUNDS: Record<string, (t: [string, string, string]) => ReactNode> = {
  "arena-radial": (t) => (<>
    {/* чистый тёмно-синий фон референса: мягкое пятно света сверху, без шума */}
    <defs>
      <radialGradient id="bgArena" cx=".5" cy=".12" r="1">
        <stop offset="0%" stopColor={t[1]} stopOpacity=".22" />
        <stop offset="45%" stopColor="#152036" />
        <stop offset="100%" stopColor="#0d1526" />
      </radialGradient>
    </defs>
    <rect width="100" height="100" fill="url(#bgArena)" />
  </>),
  "aurora-grid": (t) => (<>
    <defs>
      <linearGradient id="bgAur" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={t[1]} stopOpacity=".38" />
        <stop offset="50%" stopColor="#0d1a2c" stopOpacity=".85" />
        <stop offset="100%" stopColor="#070e1a" />
      </linearGradient>
      <linearGradient id="bgAur2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={t[0]} stopOpacity="0" />
        <stop offset="50%" stopColor={t[0]} stopOpacity=".35" />
        <stop offset="100%" stopColor={t[0]} stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#bgAur)" />
    {[14, 26, 38].map((y, i) => (<rect key={y} x="0" y={y} width="100" height={6 - i} fill="url(#bgAur2)" opacity={0.8 - i * 0.18} />))}
    {Array.from({ length: 9 }, (_, i) => (<line key={i} x1={i * 12} y1="0" x2={i * 12} y2="100" stroke={t[0]} strokeWidth=".22" opacity=".28" />))}
    {Array.from({ length: 7 }, (_, i) => (<line key={`h${i}`} x1="0" y1={i * 15} x2="100" y2={i * 15} stroke={t[0]} strokeWidth=".22" opacity=".22" />))}
  </>),
  "tape-market": (t) => (<>
    <rect width="100" height="100" fill="#08111f" />
    {Array.from({ length: 7 }, (_, r) => (
      <g key={r} transform={`translate(0,${6 + r * 14})`} opacity=".22">
        {Array.from({ length: 14 }, (_, i) => (
          <g key={i}>{candle(2 + i * 7, (r % 2) * 2, 3.2, 5 + ((i * (r + 3)) % 9), (i + r) % 2 === 0, t, 0.4)}</g>
        ))}
      </g>
    ))}
    <rect width="100" height="100" fill={t[2]} opacity=".55" />
  </>),
  "scanline-deck": (t) => (<>
    <rect width="100" height="100" fill="#0a1526" />
    {Array.from({ length: 40 }, (_, i) => (<rect key={i} y={i * 2.5} width="100" height=".8" fill={t[0]} opacity={i % 5 === 0 ? 0.1 : 0.045} />))}
    <rect x="0" y="34" width="100" height="12" fill={t[0]} opacity=".14" />
    <rect x="0" y="40" width="100" height="1.6" fill={t[0]} opacity=".8" />
    {[10, 24, 38, 52, 66, 80, 94].map((x, i) => (<g key={x} opacity=".3">{candle(x - 3, 20 + (i % 3) * 8, 6, 14 + (i % 4) * 9, i % 2 === 0, t, 0.5)}</g>))}
  </>),
  "depth-wall": (t) => (<>
    <rect width="100" height="100" fill="#0a1526" />
    {Array.from({ length: 16 }, (_, i) => {
      const h = 8 + ((i * 17) % 26);
      const up = i % 2 === 0;
      return <rect key={i} x={i * 6.4} y={up ? 62 - h : 62} width="5" height={h} fill={up ? "#3ECF8E" : "#E2605C"} opacity=".16" />;
    })}
    {Array.from({ length: 16 }, (_, i) => {
      const h = 8 + ((i * 23) % 26);
      return <rect key={`b${i}`} x={i * 6.4} y={62} width="5" height={h} fill={i % 2 ? "#E2605C" : "#3ECF8E"} opacity=".12" />;
    })}
    <rect y="30" width="100" height="30" fill={t[0]} opacity=".1" />
    <rect y="44" width="100" height="2" fill={t[0]} opacity=".55" />
  </>),
};

/* --------------------------------- API ----------------------------------- */
function motifFor(spec: ArtSpec): ReactNode | null {
  const t = TINT[spec.tint] ?? TINT.neutral;
  return (
    HEROES[spec.motif]?.(t) ??
    ORNAMENTS[spec.motif]?.(t) ??
    CUES[spec.motif]?.(t) ??
    FEEDS[spec.motif]?.(t) ??
    BACKGROUNDS[spec.motif]?.(t) ??
    null
  );
}

export function Motif({ spec, size = 120, className, style }: { spec: ArtSpec; size?: number; className?: string; style?: CSSProperties }) {
  const body = motifFor(spec);
  if (!body) return null;
  return (
    <svg
      width={size} height={size} viewBox="0 0 120 120" className={className} aria-hidden="true"
      style={{
        transform: "translate3d(var(--art-x, 0px), var(--art-y, 0px), 0) scale(var(--art-scale, 1))",
        opacity: "var(--art-opacity, 1)",
        filter: "hue-rotate(var(--art-tint, 0deg))",
        ...style,
      }}
    >
      {body}
    </svg>
  );
}

export function Art({ assetId, size = 120, className, style }: { assetId: string; size?: number; className?: string; style?: CSSProperties }) {
  const def = ASSETS[assetId];
  if (!def) {
    return (
      <div className={className} style={{ ...style, display: "grid", placeItems: "center", fontSize: 9, color: "#ff8f88" }}>
        MISSING_ASSET {assetId}
      </div>
    );
  }
  if (def.spec.motif === "emblem-full") return <ArenaEmblem size={size} />;
  if (def.spec.motif === "emblem-inverse") return <ArenaEmblem size={size} light />;
  if (def.spec.motif === "emblem-compact") return <EmblemCompact size={size} />;
  return <Motif spec={def.spec} size={size} className={className} style={style} />;
}

/** Full-bleed background layer behind a screen (always clipped, never scrolls) */
export function ScreenBackground({ assetId, className = "", style, par }: {
  assetId: string; className?: string; style?: CSSProperties; par?: string;
}) {
  const def = ASSETS[assetId];
  const spec: ArtSpec = def?.spec ?? { motif: "arena-radial", tint: "teal" };
  const body = BACKGROUNDS[spec.motif]?.(TINT[spec.tint] ?? TINT.neutral) ?? BACKGROUNDS["arena-radial"](TINT.teal);
  return (
    <svg
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio={par ?? "xMidYMid slice"}
      aria-hidden="true"
      style={{ zIndex: 0, pointerEvents: "none", ...style }}
    >
      {body}
    </svg>
  );
}

/** Procedural art inventory (no external sources) */
export const ART_STATIC = {
  count: Object.keys({ ...BACKGROUNDS, ...HEROES, ...ORNAMENTS, ...CUES, ...FEEDS }).length,
  backgrounds: Object.keys(BACKGROUNDS),
  heroes: Object.keys(HEROES),
  ornaments: Object.keys(ORNAMENTS),
  cues: Object.keys(CUES),
  feeds: Object.keys(FEEDS),
};

export function AssetThumb({ assetId, size = 46 }: { assetId: string; size?: number }) {
  const def = ASSETS[assetId];
  if (!def) return <div className="stu-chip" style={{ borderColor: "#a13b35", color: "#ff8f88" }}>{assetId}: MISSING</div>;
  const isBg = def.kind === "background";
  const isIcon = def.kind === "icon";
  return (
    <div
      style={{
        width: size, height: size, borderRadius: 10, overflow: "hidden", flex: "none",
        border: "1px solid var(--stroke-soft)", display: "grid", placeItems: "center",
        background: "radial-gradient(120% 90% at 50% 10%, #16294a, #08111f)",
      }}
      title={`${def.id} — ${def.label}`}
    >
      {isBg ? (
        <svg width={size} height={size} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {BACKGROUNDS[def.spec.motif]?.(TINT[def.spec.tint] ?? TINT.neutral) ?? null}
        </svg>
      ) : isIcon ? (
        def.id.startsWith("SKL-") ? (
          <SkillIconThumb id={def.id} />
        ) : (
          <Motif spec={def.spec} size={size - 6} />
        )
      ) : (
        <Motif spec={def.spec} size={size - 2} />
      )}
    </div>
  );
}

function SkillIconThumb({ id }: { id: string }) {
  return <SkillGlyph id={id.replace("SKL-", "").toLowerCase()} size={38} />;
}
