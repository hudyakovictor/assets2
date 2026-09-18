import React from "react";
import { motion } from "framer-motion";
import { spring } from "../lib/motion";
import { feel } from "../lib/feedback";
import { cn } from "../utils/cn";

/* =====================================================================
   Shared game UI primitives. Touch-first: no hover, 44px+ targets,
   3D press = translateY + edge shadow collapse.
   ===================================================================== */

type BtnVariant = "acc" | "dark" | "gold" | "danger" | "ghost";

const STYLES: Record<BtnVariant, { bg: string; edge: string; ink: string; glow?: string }> = {
  acc: { bg: "linear-gradient(180deg,#5fe9dc 0%,#35e0d0 45%,#1cb5a6 100%)", edge: "#0d7f74", ink: "#04211e", glow: "rgba(53,224,208,.4)" },
  gold: { bg: "linear-gradient(180deg,#ffe08a 0%,#d0b24a 50%,#a8842c 100%)", edge: "#7a5f1c", ink: "#2e2405", glow: "rgba(208,178,74,.35)" },
  danger: { bg: "linear-gradient(180deg,#f0908a 0%,#c56861 55%,#a44f49 100%)", edge: "#6e3430", ink: "#2b0f0d", glow: "rgba(197,104,97,.35)" },
  dark: { bg: "linear-gradient(180deg,#2c3c63 0%,#1d2a47 100%)", edge: "#121b31", ink: "#eaf2ff" },
  ghost: { bg: "rgba(29,42,71,.6)", edge: "#121b31", ink: "#9fb0d0" },
};

interface BtnProps extends Omit<React.ComponentProps<typeof motion.button>, "children"> {
  variant?: BtnVariant;
  size?: "sm" | "md" | "lg";
  block?: boolean;
  shine?: boolean;
  children: React.ReactNode;
}

export const GButton = ({ variant = "acc", size = "md", block, shine = true, className, children, onTap, disabled, ...rest }: BtnProps) => {
  const s = STYLES[variant];
  const edge = size === "sm" ? 3 : 4;
  const sizes = {
    sm: "min-h-[44px] px-4 py-2 text-[13px] rounded-[16px]",
    md: "min-h-[52px] px-5 py-3 text-[15px] rounded-[20px]",
    lg: "min-h-[58px] px-6 py-3.5 text-[16px] rounded-[22px]",
  }[size];
  return (
    <motion.button
      {...rest}
      disabled={disabled}
      onTap={(e, i) => {
        if (disabled) return;
        feel.tap();
        onTap?.(e, i);
      }}
      className={cn("glossy relative w-full overflow-hidden font-bold tracking-wide", sizes, block && "w-full", shine && variant !== "ghost" && "shine", className)}
      style={{ ...rest.style, background: s.bg, color: s.ink, opacity: disabled ? 0.55 : 1, boxShadow: `0 ${edge}px 0 ${s.edge}${s.glow ? `, 0 10px 26px ${s.glow}` : ""}` }}
      whileTap={{ y: edge - 1, boxShadow: `0 1px 0 ${s.edge}`, scale: 0.985 }}
      transition={spring.tap}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
};

/* Handwritten note (sticker style, no emoji glyphs in copy — smiley drawn) */
export const HandNote = ({ lines, className = "", rotate = -2.5, size = 21 }: { lines: string[]; className?: string; rotate?: number; size?: number }) => (
  <motion.div
    className={cn("hand inline-block px-2 leading-[1.15] text-[#f4e9c8]", className)}
    style={{ transform: `rotate(${rotate}deg)`, fontSize: size, textShadow: "0 1px 0 rgba(0,0,0,.4)" }}
    initial={{ opacity: 0, scale: 0.8, rotate: rotate - 8 }}
    animate={{ opacity: 1, scale: 1, rotate }}
    transition={spring.pop}
  >
    {lines.map((l) => (
      <div key={l}>{l}</div>
    ))}
    <span className="mt-0.5 flex items-center gap-1">
      <span className="text-[0.85em]">:</span>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f4e9c8" strokeWidth="1.8" strokeLinecap="round" style={{ transform: `rotate(${rotate * 2}deg)` }}>
        <circle cx="12" cy="12" r="9.2" />
        <circle cx="8.6" cy="10" r="0.9" fill="#f4e9c8" stroke="none" />
        <circle cx="15.4" cy="10" r="0.9" fill="#f4e9c8" stroke="none" />
        <path d="M7.6 14.5c1.2 1.6 2.6 2.4 4.4 2.4s3.2-.8 4.4-2.4" />
      </svg>
    </span>
  </motion.div>
);

/* Progress pips (tutorial 2/4 etc.) */
export const Pips = ({ n, total, color = "#35e0d0" }: { n: number; total: number; color?: string }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <motion.span
        key={i}
        className="h-1.5 rounded-full"
        style={{ width: i < n ? 18 : 8, background: i < n ? color : "#2c3c63" }}
        initial={false}
        animate={{ width: i < n ? 18 : 8, background: i < n ? color : "#2c3c63" }}
        transition={spring.soft}
      />
    ))}
  </div>
);

/* Section label for game pages */
export const Kicker = ({ children, color = "#35e0d0" }: { children: React.ReactNode; color?: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9.5px] font-bold tracking-[0.14em] uppercase" style={{ borderColor: `${color}55`, color, background: `${color}14` }}>
    {children}
  </span>
);

/* 3D press chip (skill pick rows, tabs) */
export const Chip = ({ active, onTap, children, color = "#35e0d0", className }: { active?: boolean; onTap?: () => void; children: React.ReactNode; color?: string; className?: string }) => (
  <motion.button
    onTap={onTap}
    whileTap={{ scale: 0.94 }}
    transition={spring.tap}
    className={cn("relative flex min-h-[44px] items-center justify-center gap-1.5 rounded-[14px] border px-3.5 py-2 text-[12.5px] font-bold", className)}
    animate={{
      borderColor: active ? color : "#2a3a5e",
      background: active ? `${color}22` : "#1d2a47",
      color: active ? color : "#9fb0d0",
      boxShadow: active ? `inset 0 0 0 1px ${color}66, 0 0 18px ${color}22` : "0 2px 0 #121b31",
    }}
  >
    {children}
  </motion.button>
);
