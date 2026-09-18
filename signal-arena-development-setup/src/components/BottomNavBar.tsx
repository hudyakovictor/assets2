import {
  GraduationCapIcon,
  CrossedCandlestickSwordsIcon,
  CardsDeckIcon,
  ThreeDotsIcon,
} from "./icons";
import { playTabSound } from "../utils/audio";

export type NavTab = "academy" | "arena" | "collection" | "more";

export type BottomNavBarProps = {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  className?: string;
};

export function BottomNavBar({
  activeTab = "arena",
  onTabChange,
  className = "",
}: BottomNavBarProps) {
  const handleNav = (tab: NavTab) => {
    playTabSound();
    onTabChange(tab);
  };

  return (
    <nav
      data-qa="bottom-nav"
      className={`shrink-0 w-full border-t-2 border-[#0E1723] px-3 pt-2 pb-[max(10px,env(safe-area-inset-bottom))] flex items-end justify-around gap-1 ${className}`}
      style={{
        background: "linear-gradient(180deg,#22334A 0%,#141E2C 100%)",
        boxShadow: "inset 0 2px 0 rgba(255,255,255,.14)",
      }}
    >
      {/* 1. АКАДЕМИЯ */}
      <button
        onClick={() => handleNav("academy")}
        className={`tactile-btn min-h-12 flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors ${
          activeTab === "academy" ? "text-[#5DE2B5]" : "text-[#6E8199]"
        }`}
      >
        <GraduationCapIcon size={22} />
        <span className="font-display font-bold text-[9px] tracking-[0.12em] uppercase">
          АКАДЕМИЯ
        </span>
      </button>

      {/* 2. АРЕНА — центральная приподнятая кнопка со скрещёнными свечами-мечами */}
      <button
        onClick={() => handleNav("arena")}
        className={`c2d-btn min-h-16 flex-1 -mt-6 flex flex-col items-center justify-center gap-0.5 py-2.5 px-2 ${
          activeTab === "arena" ? "c2d-teal" : "c2d-slate opacity-80"
        }`}
      >
        <CrossedCandlestickSwordsIcon size={24} />
        <span
          className={`font-display font-extrabold text-[9.5px] tracking-[0.12em] uppercase ${
            activeTab === "arena" ? "text-[#062B25]" : "text-[#8FA2BA]"
          }`}
        >
          АРЕНА
        </span>
      </button>

      {/* 3. КОЛЛЕКЦИЯ */}
      <button
        onClick={() => handleNav("collection")}
        className={`tactile-btn min-h-12 flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors ${
          activeTab === "collection" ? "text-[#5DE2B5]" : "text-[#6E8199]"
        }`}
      >
        <CardsDeckIcon size={22} />
        <span className="font-display font-bold text-[9px] tracking-[0.12em] uppercase">
          КОЛЛЕКЦИЯ
        </span>
      </button>

      {/* 4. ЕЩЁ */}
      <button
        onClick={() => handleNav("more")}
        className={`tactile-btn min-h-12 flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors ${
          activeTab === "more" ? "text-[#5DE2B5]" : "text-[#6E8199]"
        }`}
      >
        <ThreeDotsIcon size={22} />
        <span className="font-display font-bold text-[9px] tracking-[0.12em] uppercase">
          ЕЩЁ
        </span>
      </button>
    </nav>
  );
}
