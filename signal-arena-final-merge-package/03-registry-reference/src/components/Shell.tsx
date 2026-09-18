import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, SPRING, haptic } from "../motion/tokens";
import { cn } from "../utils/cn";
import { TopBar, type TopBarState } from "./TopBar";

/* ============================================================
   GAME SHELL — Telegram Mini App runtime container
   - width: 100% (Telegram controls viewport)
   - min-height: 100dvh
   - safe-area insets respected
   - no page-level vertical scroll
   - left/right "working panels" (Page Inventory, Asset
     Inspector) live OUTSIDE the game screen
   ============================================================ */

export const DEFAULT_TOP_BAR: TopBarState = {
  lvl: 7,
  xpCur: 420,
  xpMax: 600,
  lives: { cur: 5, max: 5 },
  stars: 48,
  coins: 1240,
  notif: 1,
};

export function GameShell({
  children, topBar = DEFAULT_TOP_BAR, bottomTab = "ARENA",
}: {
  children: ReactNode;
  topBar?: TopBarState;
  bottomTab?: "ACADEMY" | "ARENA" | "COLLECTION" | "MORE";
}) {
  return (
    <div
      className="relative mx-auto flex w-full max-w-[420px] flex-col bg-void-950 text-white"
      style={{
        minHeight: "100dvh",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Top bar locked */}
      <TopBar state={topBar} />

      {/* Game content — flex-1, no scroll on the screen level */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>

      {/* Bottom nav locked */}
      <BottomNav active={bottomTab} />
    </div>
  );
}

/* ============================================================
   BOTTOM NAV — 4 tabs, ALL CAPS, narrow letter-spacing.
   Locked: equal heights, equal gap, accent on selected.
   ============================================================ */
function BottomNav({ active }: { active: "ACADEMY" | "ARENA" | "COLLECTION" | "MORE" }) {
  const items: { id: typeof active; label: string; icon: ReactNode }[] = [
    { id: "ACADEMY", label: "АКАДЕМИЯ", icon: <AcademyIcon /> },
    { id: "ARENA", label: "АРЕНА", icon: <SwordsIcon /> },
    { id: "COLLECTION", label: "КОЛЛЕКЦИЯ", icon: <CardsIcon /> },
    { id: "MORE", label: "ЕЩЁ", icon: <DotsIcon /> },
  ];
  return (
    <div
      className="relative grid grid-cols-4 border-t border-white/8 bg-void-900"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {items.map((it) => {
        const on = active === it.id;
        return (
          <button
            key={it.id}
            onClick={() => haptic(6)}
            className="relative flex flex-col items-center gap-1 py-2.5"
          >
            {on && (
              <motion.span
                layoutId="dock-pill"
                transition={SPRING.panel}
                className="absolute inset-x-2 inset-y-1.5 rounded-xl"
                style={{
                  background: "linear-gradient(180deg, #1AB9B9, #0E6E6E)",
                  boxShadow: "0 0 24px -4px rgba(63,211,211,.7), inset 0 1px 0 rgba(255,255,255,.45), inset 0 -2px 0 rgba(0,40,40,.45)",
                }}
              />
            )}
            <span
              className={cn("relative", on ? "text-white" : "text-white/40")}
              style={{ filter: on ? "drop-shadow(0 1px 0 rgba(0,0,0,.4))" : undefined }}
            >
              {it.icon}
            </span>
            <span className={cn("relative font-display text-[9px] font-bold uppercase tracking-[0.12em]", on ? "text-white" : "text-white/40")}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ====== 4 nav icons drawn directly (no emoji) ====== */
function AcademyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10 12 5l10 5-10 5z" />
      <path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" />
      <path d="M22 10v6" />
    </svg>
  );
}
function SwordsIcon() {
  // сигнал на свечах — два скрещенных «меча» с телами-свечами
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l8 8" stroke="#26D67E" />
      <rect x="2" y="2" width="3" height="6" rx="0.5" fill="#26D67E" stroke="none" />
      <path d="M21 21l-8-8" stroke="#FF5050" />
      <rect x="19" y="16" width="3" height="6" rx="0.5" fill="#FF5050" stroke="none" />
      <path d="M11 11l2 2" />
    </svg>
  );
}
function CardsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="11" height="14" rx="2" />
      <path d="M14 10h6a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2h-5" />
      <path d="M7 11h3M7 14h3M7 17h2" />
    </svg>
  );
}
function DotsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="19" cy="12" r="1.7" />
    </svg>
  );
}

/* small helper for entrance choreography — uses motion preset index */
export function enter(motionPreset: "expo" | "quint" | "back" | "circ") {
  const ease = motionPreset === "expo" ? EASE.outExpo
    : motionPreset === "quint" ? EASE.outQuint
    : motionPreset === "back" ? EASE.outBack
    : EASE.inOutCirc;
  return { initial: { opacity: 0, y: 16, filter: "blur(8px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" }, exit: { opacity: 0, y: -10, filter: "blur(6px)" }, transition: { duration: 0.5, ease } };
}
