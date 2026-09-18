import { useLayoutEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useGame } from "../store";
import { spring } from "../lib/motion";
import { sfx } from "../lib/feedback";
import { IconBell, IconBolt, IconCoin, IconGear, IconStar } from "./RepoIcons";
import Counter from "./Counter";

/* =====================================================================
   SHARED_TOP_BAR_LOCKED
   Geometry, order and iconography taken 1:1 from repo topbar/topbar.html:
   [LVL 07] [420 / 600 XP ▬▬]  …  [bolt 5/5] [star 48] [coin 320] (bell) (gear)
   Only dynamic values change (LVL, XP, attempts, stars, coins, badge).
   Touch feedback: bolt squash, star pop, coin 3D flip, bell swing,
   gear +90° per tap (mechanical, additive).
   ===================================================================== */

const Pill = ({ children, onTap }: { children: React.ReactNode; onTap?: () => void }) => (
  <motion.div
    whileTap={onTap ? { scale: 0.92 } : undefined}
    transition={spring.tap}
    onTap={onTap}
    role={onTap ? "button" : undefined}
    className="flex h-10 items-center gap-1.5 rounded-full border border-[#2a3a5e] bg-[#222b4d] px-2.5"
    style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.1), 0 2px 0 #141b31" }}
  >
    {children}
  </motion.div>
);

const RoundBtn = ({ children, onTap, badge }: { children: React.ReactNode; onTap: () => void; badge?: boolean }) => (
  <motion.button
    whileTap={{ scale: 0.88, y: 1 }}
    transition={spring.tap}
    onTap={onTap}
    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#2a3a5e] bg-[#222b4d]"
    style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.1), 0 2px 0 #141b31" }}
  >
    {children}
    {badge && (
      <motion.span
        className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-[#222b4d] bg-[#ff5b6a]"
        animate={{ scale: [1, 1.35, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
    )}
  </motion.button>
);

export const TopBar = ({ onBell, onGear }: { onBell?: () => void; onGear?: () => void }) => {
  const { level, xp, attempts, stars, coins, anchors, toPt } = useGame();
  const xpRef = useRef<HTMLDivElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);

  // dynamic-value feedback (state-driven, not mount-driven)
  const boltCtl = useAnimationControls();
  const starCtl = useAnimationControls();
  const coinCtl = useAnimationControls();
  const bellCtl = useAnimationControls();
  const [gearRot, setGearRot] = useState(0);
  const [hasNotif, setHasNotif] = useState(true);

  useLayoutEffect(() => {
    const measure = () => {
      if (coinRef.current) anchors.current.coins = toPt(coinRef.current);
      const starEl = xpRef.current?.parentElement?.querySelector("[data-star]");
      if (starEl) anchors.current.stars = toPt(starEl);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  });

  const xpMax = 600;

  return (
    <div className="relative z-40 flex shrink-0 items-center gap-1.5 px-3 pb-2 pt-2.5">
      {/* LVL badge */}
      <div
        className="flex h-10 items-center gap-1 rounded-full border border-[#3a5175] bg-gradient-to-b from-[#24345a] to-[#1a2745] px-2.5"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.12), 0 2px 0 #141b31" }}
      >
        <span className="text-[8px] font-bold tracking-widest text-ink3">LVL</span>
        <motion.span
          key={level}
          className="text-[15px] font-extrabold leading-none text-acc"
          style={{ fontVariantNumeric: "tabular-nums" }}
          initial={{ scale: 1.5, color: "#8ff3e8" }}
          animate={{ scale: 1, color: "#35e0d0" }}
          transition={spring.pop}
        >
          {String(level).padStart(2, "0")}
        </motion.span>
      </div>

      {/* XP pill */}
      <div
        ref={xpRef}
        className="relative flex h-10 min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-full border border-[#2a3a5e] bg-[#182240] px-2.5"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.08), 0 2px 0 #141b31" }}
      >
        <motion.span
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0e7c72]/50 to-[#35e0d0]/40"
          animate={{ width: `${Math.min(100, (xp / xpMax) * 100)}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ boxShadow: "inset 0 -1px 0 rgba(53,224,208,.5)" }}
        />
        <span className="relative text-[12px] font-bold leading-none text-ink" style={{ fontVariantNumeric: "tabular-nums" }}>
          <Counter value={xp} color="#eaf2ff" />
          <span className="ml-0.5 text-[9px] font-semibold text-ink3">/ {xpMax} XP</span>
        </span>
      </div>

      {/* Attempts — squash on tap, like spending energy */}
      <Pill
        onTap={() => {
          sfx.tick();
          boltCtl.start({ scaleX: [1, 0.78, 1.12, 1], scaleY: [1, 1.2, 0.92, 1], transition: { duration: 0.4, times: [0, 0.35, 0.7, 1] } });
        }}
      >
        <motion.span animate={boltCtl} style={{ transformOrigin: "50% 60%" }}>
          <IconBolt size={19} />
        </motion.span>
        <Counter value={attempts} className="text-[12px] font-bold" color={attempts === 0 ? "#ff8a94" : "#eaf2ff"} />
        <span className="-ml-0.5 text-[9px] font-bold text-ink3">/5</span>
      </Pill>

      {/* Stars — pop on tap */}
      <Pill
        onTap={() => {
          sfx.tick();
          starCtl.start({ rotate: [0, -18, 12, 0], scale: [1, 1.35, 1], transition: { duration: 0.5 } });
        }}
      >
        <motion.span data-star animate={starCtl}>
          <IconStar size={19} />
        </motion.span>
        <Counter value={stars} className="text-[12px] font-bold" color="#ffe082" />
      </Pill>

      {/* Coins — 3D flip on tap */}
      <Pill
        onTap={() => {
          sfx.tick();
          coinCtl.start({ rotateY: [0, 360], scale: [1, 1.2, 1], transition: { duration: 0.55 } });
        }}
      >
        <div ref={coinRef} className="flex items-center" style={{ transformStyle: "preserve-3d" }}>
          <motion.span animate={coinCtl}>
            <IconCoin size={19} />
          </motion.span>
        </div>
        <Counter value={coins} className="text-[12px] font-bold" color="#ffe9b0" />
      </Pill>

      {/* Bell — physical swing from the top pivot */}
      <RoundBtn
        badge={hasNotif}
        onTap={() => {
          sfx.tick();
          setHasNotif(false);
          bellCtl.start({ rotate: [0, -20, 14, -8, 4, 0], transition: { duration: 0.8, ease: "easeInOut" } });
          onBell?.();
        }}
      >
        <motion.span animate={bellCtl} style={{ transformOrigin: "50% 10%" }}>
          <IconBell size={20} />
        </motion.span>
      </RoundBtn>

      {/* Gear — additive +90° per tap */}
      <RoundBtn
        onTap={() => {
          sfx.tick();
          setGearRot((r) => r + 90);
          onGear?.();
        }}
      >
        <motion.span animate={{ rotate: gearRot }} transition={spring.soft}>
          <IconGear size={20} />
        </motion.span>
      </RoundBtn>
    </div>
  );
};

export default TopBar;
