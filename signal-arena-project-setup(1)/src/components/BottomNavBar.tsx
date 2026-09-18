import { motion } from "framer-motion";
import { sound } from "../utils/sound";
import { IconGraduationCap, IconSwords, IconPadlock } from "./icons";

export type NavTab = "academy" | "arena" | "profile";

interface Props {
  active?: NavTab;
  onChange?: (t: NavTab) => void;
  /** Tabs the player has not unlocked yet (Академия до кадра 12). */
  lockedTabs?: NavTab[];
}

const TABS: { id: NavTab; label: string; icon: React.ReactNode; isCenter?: boolean }[] = [
  { id: "academy", label: "АКАДЕМИЯ", icon: <IconGraduationCap className="h-5 w-5" /> },
  { id: "arena", label: "АРЕНА", icon: <IconSwords className="h-6 w-6" />, isCenter: true },
  {
    id: "profile",
    label: "ПРОФИЛЬ",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7H4z" />
      </svg>
    ),
  },
];

export default function BottomNavBar({ active = "arena", onChange, lockedTabs = [] }: Props) {
  return (
    <nav
      className="relative z-30 flex shrink-0 items-end justify-around px-2 pt-1.5"
      style={{
        minHeight: 66,
        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        background: "linear-gradient(180deg,#182335 0%,#0e1522 100%)",
        borderTop: "1.5px solid #28374e",
        boxShadow: "0 -4px 20px rgba(0,0,0,.5)",
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const isLocked = lockedTabs.includes(tab.id);

        return (
          <button
            key={tab.id}
            onClick={() => {
              sound.click();
              if (!isLocked) onChange?.(tab.id);
            }}
            aria-current={isActive ? "page" : undefined}
            aria-disabled={isLocked}
            title={isLocked ? "Откроется после третьего захода" : undefined}
            className="flex min-h-12 flex-1 flex-col items-center justify-end py-1 select-none"
            style={{ opacity: isLocked ? 0.42 : 1 }}
          >
            <motion.div
              animate={isActive ? { y: tab.isCenter ? -6 : -2, scale: 1 } : { y: 0, scale: 0.95 }}
              whileTap={{ scale: 0.86 }}
              className="relative grid place-items-center rounded-[18px]"
              style={{
                width: tab.isCenter ? 54 : 42,
                height: tab.isCenter ? 46 : 36,
                background: isActive ? "linear-gradient(180deg,#45ead0,#1da994)" : "transparent",
                color: isActive ? "#04221a" : "#748ba9",
                border: isActive ? "1.5px solid #75f4e0" : "1.5px solid transparent",
                boxShadow: isActive
                  ? "0 8px 18px -8px rgba(38,230,200,.85), inset 0 1px 0 rgba(255,255,255,.4)"
                  : "none",
              }}
            >
              {tab.icon}
              {isLocked && (
                <span
                  className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full"
                  style={{ background: "#141d2c", border: "1px solid #3d5074" }}
                >
                  <IconPadlock className="h-2.5 w-2.5 text-[#93a8c6]" />
                </span>
              )}
            </motion.div>

            <span
              className="mt-1 text-[9.5px] font-black tracking-[.06em]"
              style={{ color: isActive ? "#26e6c8" : "#6d809e" }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
