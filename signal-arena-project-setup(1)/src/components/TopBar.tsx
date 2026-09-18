import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconLightning, IconStar, IconCoin, IconBell, IconGear } from "./icons";
import { sound } from "../utils/sound";

export interface TopBarState {
  lvl?: number;
  xp?: number;
  xpMax?: number;
  attempts?: number;
  attemptsMax?: number;
  stars?: number;
  coins?: number;
  token?: number;
  tokenLabel?: string;
  notifications?: number;
  pulse?: null | "xp" | "coins" | "token" | "attempts" | "stars";
}

export interface TopBarProps {
  state?: TopBarState;
  lvl?: number;
  xp?: number;
  xpMax?: number;
  attempts?: number;
  attemptsMax?: number;
  stars?: number;
  coins?: number;
  token?: number;
  tokenLabel?: string;
  notifications?: number;
  pulse?: null | "xp" | "coins" | "token" | "attempts" | "stars";
  onBell?: () => void;
  onGear?: () => void;
  onTokenClick?: () => void;
}

export const DEFAULT_CANONICAL_TOPBAR: TopBarState = {
  attempts: 3,
  attemptsMax: 5,
  stars: 128,
  coins: 1240,
  notifications: 2,
};

/**
 * SHARED_TOP_BAR_LOCKED
 * The Canonical visual Top Bar:
 * - Fixed height: 54px
 * - Exactly five elements: attempts | stars | coins | bell | settings
 * - 100% pure SVG icons, zero emoji.
 */
export default function TopBar(props: TopBarProps) {
  const s = props.state;
  const attempts = s?.attempts ?? props.attempts ?? 3;
  const attemptsMax = s?.attemptsMax ?? props.attemptsMax ?? 5;
  const stars = s?.stars ?? s?.token ?? props.stars ?? props.token ?? 128;
  const coins = s?.coins ?? props.coins ?? 1240;
  const notifications = s?.notifications ?? props.notifications ?? 2;
  const pulse = s?.pulse ?? props.pulse;
  const { onBell, onGear } = props;

  return (
    <div
      className="relative z-30 flex shrink-0 items-center justify-between gap-1.5 px-3"
      style={{
        height: "54px",
        background: "linear-gradient(180deg, #182236 0%, #111827 100%)",
        borderBottom: "1.5px solid #233148",
        boxShadow: "0 6px 18px -4px rgba(0,0,0,0.6)",
      }}
    >
      <div className="flex w-full items-center justify-between gap-1.5">
        {/* Attempts / Energy */}
        <Pill
          pulse={pulse === "attempts"}
          icon={<IconLightning className="h-3.5 w-3.5 text-[#ffd15c]" />}
          value={`${attempts}/${attemptsMax}`}
        />

        {/* Stars (★) */}
        <Pill
          pulse={pulse === "stars"}
          icon={<IconStar className="h-3.5 w-3.5 text-[#ffbe3b]" />}
          value={<Ticker v={stars} />}
        />

        {/* Coins (₿) */}
        <Pill
          pulse={pulse === "coins"}
          icon={<IconCoin className="h-3.5 w-3.5 text-[#ffcf5c]" />}
          value={<Ticker v={coins} />}
        />

        {/* Bell with notification dot */}
        <IconButton badge={notifications} onClick={onBell} aria-label="Уведомления">
          <IconBell className="h-4 w-4 text-[#cfe0ff]" />
        </IconButton>

        {/* Settings Gear */}
        <IconButton onClick={onGear} aria-label="Настройки">
          <IconGear className="h-4 w-4 text-[#cfe0ff]" />
        </IconButton>
      </div>
    </div>
  );
}

function Pill({
  icon,
  value,
  pulse,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  pulse?: boolean;
}) {
  return (
    <motion.div
      animate={pulse ? { scale: [1, 1.14, 1] } : {}}
      className="flex h-8 items-center gap-1 rounded-full px-2"
      style={{
        background: "rgba(18, 26, 40, 0.75)",
        border: "1px solid rgba(86, 114, 158, 0.25)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      {icon}
      <span className="text-[11px] font-black tabular-nums text-white">{value}</span>
    </motion.div>
  );
}

function IconButton({
  children,
  badge,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  badge?: number;
  onClick?: () => void;
  "aria-label"?: string;
}) {
  return (
    <button
      onClick={() => {
        sound.click();
        onClick?.();
      }}
      aria-label={ariaLabel}
      className="btn-3d relative grid h-8 w-8 place-items-center rounded-xl transition"
      style={{
        background: "linear-gradient(180deg, #243247 0%, #1a2538 100%)",
        border: "1.5px solid #374966",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
      }}
    >
      {children}
      {badge && badge > 0 ? (
        <span
          className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ff5c65] ring-2 ring-[#111827]"
          style={{ boxShadow: "0 0 6px #ff5c65" }}
        />
      ) : null}
    </button>
  );
}

function Ticker({ v }: { v: number }) {
  const [val, setVal] = useState(v);
  const prev = useRef(v);
  useEffect(() => {
    const from = prev.current;
    prev.current = v;
    if (from === v) return;
    const dur = 400;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      setVal(Math.round(from + (v - from) * k));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [v]);
  return <>{val >= 1000 ? val.toLocaleString("ru-RU") : val}</>;
}
