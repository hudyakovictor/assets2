import { motion, AnimatePresence } from "framer-motion";
import { EASE, SPRING } from "../motion/tokens";

/* ============================================================
   SHARED_TOP_BAR_LOCKED — visual source of truth: topbar.html
   All dimensions and ordering are FIXED. Only dynamic state
   values may change (LVL, XP, attempts, coins, badge, etc.)
   ============================================================ */

export type TopBarState = {
  lvl: number;
  xpCur: number;
  xpMax: number;
  lives: { cur: number; max: number };
  stars: number;
  coins: number;
  notif: number;
};

export function TopBar({ state }: { state: TopBarState }) {
  const xpPct = Math.max(0, Math.min(1, state.xpCur / state.xpMax));
  return (
    <div className="relative w-full select-none" style={{ padding: "8px 10px 6px" }}>
      <div className="flex items-center justify-between gap-1.5">
        {/* LVL block — leftmost */}
        <div className="flex items-center gap-1.5">
          <div className="grid size-[26px] place-items-center rounded-full border border-white/20 bg-void-800">
            <span className="font-display text-[10px] font-black tracking-[0.04em] text-white">L{state.lvl.toString().padStart(2, "0")}</span>
          </div>
        </div>

        {/* XP pill */}
        <Pill color="cyan" glow>
          <span className="font-display text-[11px] font-black tracking-[0.02em] text-white tabular-nums">
            {state.xpCur} <span className="text-white/40">/</span> {state.xpMax}
          </span>
          {/* progress bar inside pill */}
          <span className="pointer-events-none absolute inset-x-1.5 bottom-[3px] h-[2px] overflow-hidden rounded-full bg-black/40">
            <motion.span
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: "linear-gradient(90deg, #6FF0F0, #2A8F8F)" }}
              initial={{ width: 0 }}
              animate={{ width: `${xpPct * 100}%` }}
              transition={{ duration: 0.5, ease: EASE.outExpo }}
            />
          </span>
        </Pill>

        {/* lives */}
        <Pill color="muted">
          <img src="/icons/lightning.svg" className="size-[16px]" alt="" />
          <span className="font-display text-[11px] font-black tabular-nums text-amber-50">
            {state.lives.cur}<span className="text-white/35">/</span>{state.lives.max}
          </span>
        </Pill>

        {/* stars */}
        <Pill color="muted">
          <img src="/icons/star.svg" className="size-[16px]" alt="" />
          <span className="font-display text-[11px] font-black tabular-nums text-amber-100">{state.stars}</span>
        </Pill>

        {/* coins */}
        <Pill color="muted">
          <img src="/icons/coin.svg" className="size-[16px]" alt="" />
          <span className="font-display text-[11px] font-black tabular-nums text-amber-50">
            {state.coins.toLocaleString("ru-RU")}
          </span>
        </Pill>

        {/* bell + badge */}
        <Pill color="muted" circle>
          <span className="relative inline-grid size-[20px] place-items-center">
            <img src="/icons/bell.svg" className="size-[18px]" alt="" />
            <AnimatePresence>
              {state.notif > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: [0.4, 1.18, 1], opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={SPRING.bouncy}
                  className="absolute -right-1.5 -top-1 grid min-w-[14px] place-items-center rounded-full bg-rose-500 px-[3px] text-[8px] font-display font-black text-white"
                  style={{ boxShadow: "0 0 0 1.5px #0A1024" }}
                >
                  {state.notif}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </Pill>

        {/* gear */}
        <Pill color="muted" circle>
          <img src="/icons/gear.svg" className="size-[18px]" alt="" />
        </Pill>
      </div>
    </div>
  );
}

function Pill({
  children, color, glow, circle,
}: {
  children: React.ReactNode;
  color: "cyan" | "muted";
  glow?: boolean;
  circle?: boolean;
}) {
  const isCyan = color === "cyan";
  return (
    <span
      className="relative isolate inline-flex items-center gap-1.5 px-2.5"
      style={{
        height: 30,
        borderRadius: circle ? 999 : 16,
        background: isCyan
          ? "linear-gradient(180deg, #1AB9B9 0%, #107A7A 100%)"
          : "linear-gradient(180deg, #1F2A4A 0%, #11183A 100%)",
        border: `1px solid ${isCyan ? "rgba(63,211,211,.65)" : "rgba(120,160,200,.18)"}`,
        boxShadow: isCyan
          ? `inset 0 1px 0 rgba(255,255,255,.35), inset 0 -2px 0 rgba(0,40,40,.35), 0 0 ${glow ? "14px" : "0"} ${glow ? "rgba(63,211,211,.5)" : "transparent"}`
          : "inset 0 1px 0 rgba(255,255,255,.06), inset 0 -2px 0 rgba(0,0,0,.35)",
        paddingBottom: isCyan ? 8 : 0,
      }}
    >
      {children}
    </span>
  );
}
