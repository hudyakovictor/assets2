import { motion } from "framer-motion";
import { SkillIcon } from "./icons";
import BottomNavBar from "./BottomNavBar";
import { GROUP_COLOR, type SkillCard } from "../data/skills";

/* ---------- hex shade ---------- */
export function shade(hex: string, pct: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = pct / 100;
  const cl = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  r = cl(r + (f < 0 ? r : 255 - r) * f);
  g = cl(g + (f < 0 ? g : 255 - g) * f);
  b = cl(b + (f < 0 ? b : 255 - b) * f);
  return `rgb(${r},${g},${b})`;
}

/* ---------- The ONE main action per screen ---------- */
export function CTA({
  children, onClick, accent = "#35e0c8", variant = "solid", disabled, big,
}: { children: React.ReactNode; onClick?: () => void; accent?: string; variant?: "solid" | "ghost" | "quiet"; disabled?: boolean; big?: boolean }) {
  const solid = variant === "solid";
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.96 }}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
      className="relative w-full overflow-hidden rounded-[18px] px-5 font-extrabold tracking-tight transition"
      style={{
        minHeight: big ? 64 : 56,
        fontSize: big ? 17 : 15.5,
        color: solid ? "#06231f" : variant === "quiet" ? "var(--ink-dim)" : accent,
        background: solid ? `linear-gradient(140deg, ${shade(accent, 8)}, ${shade(accent, -16)})` : variant === "ghost" ? "rgba(255,255,255,0.04)" : "transparent",
        border: solid ? "none" : variant === "ghost" ? `1.5px solid ${accent}55` : "none",
        boxShadow: solid && !disabled ? `0 14px 30px -14px ${accent}dd, inset 0 1px 0 rgba(255,255,255,0.35)` : "none",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {solid && !disabled && <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 skew-x-12 bg-white/25 shimmer" />}
      <span className="relative">{children}</span>
    </motion.button>
  );
}

export function Chip({ children, color = "#35e0c8" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold" style={{ background: `${color}1f`, color, border: `1px solid ${color}44` }}>
      {children}
    </span>
  );
}

/* Step position in a run: где я · какой шаг · сколько всего */
export function Steps({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <div className="flex items-center justify-between px-4 pt-2.5">
      <span className="text-[12px] font-extrabold text-[var(--ink-dim)]">{label}</span>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <motion.span key={i} layout className="h-1.5 rounded-full" animate={{ width: i + 1 === step ? 20 : 6, background: i + 1 <= step ? "#35e0c8" : "#26354f" }} />
        ))}
        <span className="ml-1 text-[11px] font-extrabold tabular-nums text-[var(--ink-mute)]">{step}/{total}</span>
      </div>
    </div>
  );
}

/* Option card for «почему» / «пойму, что ошибся» */
export function OptionRow({ text, selected, onClick, index, color = "#35e0c8" }: { text: string; selected: boolean; onClick: () => void; index: number; color?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      aria-pressed={selected}
      className="flex w-full items-center gap-3 rounded-2xl p-3.5 text-left"
      style={{
        minHeight: 56,
        background: selected ? `${color}1a` : "rgba(16,26,46,0.85)",
        border: `1.5px solid ${selected ? color : "rgba(90,120,170,0.18)"}`,
        boxShadow: selected ? `0 10px 24px -14px ${color}` : "none",
      }}
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-black" style={{ background: selected ? color : "#0c1424", color: selected ? "#06231f" : "var(--ink-dim)" }}>
        {index + 1}
      </span>
      <span className="text-[14px] font-bold leading-snug text-[var(--ink)]">{text}</span>
    </motion.button>
  );
}

/* One score line — appear one at a time */
export function ScoreLine({ text, good, delay }: { text: string; good: boolean | null; delay: number }) {
  const col = good === null ? "#7f8db0" : good ? "#35e0c8" : "#5B8DEF";
  return (
    <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, type: "spring", stiffness: 260, damping: 24 }}
      className="flex items-start gap-3 rounded-2xl px-3.5 py-3" style={{ background: "rgba(16,26,46,0.85)", border: "1px solid rgba(90,120,170,0.16)" }}>
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay + 0.15, type: "spring", stiffness: 500 }}
        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-black" style={{ background: `${col}22`, color: col, border: `1.5px solid ${col}` }}>
        {good === null ? "·" : good ? "✓" : "~"}
      </motion.span>
      <span className="text-[13.5px] font-semibold leading-snug text-[var(--ink)]">{text}</span>
    </motion.div>
  );
}

/* Skill card (locked palette, white icon) */
export function SkillCardTile({ card, size = 72, locked, isNew, selected, onClick, pro }: { card: SkillCard; size?: number; locked?: boolean; isNew?: boolean; selected?: boolean; onClick?: () => void; pro?: boolean }) {
  const color = GROUP_COLOR[card.group];
  return (
    <motion.button
      whileTap={onClick ? { scale: 0.94 } : {}}
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${pro ? card.pro : card.plain}${locked ? " (закрыта)" : ""}`}
      className="relative flex flex-col items-center gap-1.5"
      style={{ width: size + 8 }}
    >
      <div className="relative grid place-items-center rounded-[20px]"
        style={{
          width: size, height: size,
          background: `linear-gradient(150deg, ${shade(color, 16)}, ${shade(color, -16)})`,
          boxShadow: selected ? `0 0 0 3px #fff, 0 16px 30px -12px ${color}` : `0 12px 24px -14px ${color}, inset 0 1px 0 rgba(255,255,255,0.22)`,
          filter: locked ? "grayscale(0.85) brightness(0.55)" : "none",
        }}>
        <div className="grid place-items-center rounded-full" style={{ width: size * 0.64, height: size * 0.64, background: shade(color, -24), boxShadow: "inset 0 2px 6px rgba(0,0,0,.35)" }}>
          <SkillIcon id={card.id} className="text-white" style={{ width: size * 0.42, height: size * 0.42 }} />
        </div>
        {isNew && <span className="absolute -right-1 -top-1 rounded-full bg-[#ffd15c] px-1.5 py-0.5 text-[8px] font-black text-[#3a2a00]">новая</span>}
        {locked && (
          <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-[#0d1526]">
            <svg viewBox="0 0 24 24" className="h-3 w-3 text-[#a0b2ce]" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
          </span>
        )}
      </div>
      <span className="line-clamp-2 text-center text-[10px] font-bold leading-tight text-[var(--ink-dim)]">{pro ? card.pro : card.plain}</span>
    </motion.button>
  );
}

/* Bottom nav — single source of truth for every screen (see BottomNavBar). */
export function BottomNav({
  active,
  academyLocked,
  onGo,
}: {
  active: "academy" | "arena" | "profile";
  academyLocked?: boolean;
  onGo?: (k: "academy" | "arena" | "profile") => void;
}) {
  return <BottomNavBar active={active} lockedTabs={academyLocked ? ["academy"] : []} onChange={onGo} />;
}

export function Panel({ children, className = "", glow }: { children: React.ReactNode; className?: string; glow?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[22px] ${className}`} style={{ background: "linear-gradient(165deg, rgba(20,31,54,0.92), rgba(11,18,32,0.92))", border: "1px solid rgba(90,120,170,0.18)", boxShadow: glow ? `0 30px 60px -30px ${glow}` : "0 20px 40px -30px rgba(0,0,0,.8)" }}>
      {children}
    </div>
  );
}
