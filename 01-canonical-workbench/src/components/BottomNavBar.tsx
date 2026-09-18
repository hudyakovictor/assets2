import { GraduationCapIcon, CrossedCandlestickSwordsIcon, CardsDeckIcon, TrophyIcon, ThreeDotsIcon } from "./icons";
import { playTabSound } from "../utils/audio";

export type NavTab = "academy" | "arena" | "collection" | "tournaments" | "more";

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
      className={`shrink-0 w-full bg-[#121A26]/95 border-t border-[#223145] backdrop-blur-md px-3 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] flex items-center justify-around gap-1 ${className}`}
    >
      {/* 1. АКАДЕМИЯ */}
      <button
        onClick={() => handleNav("academy")}
        className={`tactile-btn flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all ${
          activeTab === "academy"
            ? "text-[#5DE2B5]"
            : "text-[#7B8EA6] hover:text-[#C5D3E3]"
        }`}
      >
        <GraduationCapIcon size={22} />
        <span className="font-extrabold text-[10px] tracking-wider uppercase">
          АКАДЕМИЯ
        </span>
      </button>

      {/* 2. АРЕНА (Центральная приподнятая кнопка со скрещёнными свечами-мечами) */}
      <button
        onClick={() => handleNav("arena")}
        className={`tactile-btn flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all ${
          activeTab === "arena"
            ? "bg-[#3AA89B] border border-[#5CE2D4] shadow-[0_4px_0_#226960,0_0_16px_rgba(92,226,212,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] text-[#0C2420]"
            : "text-[#7B8EA6] hover:text-[#C5D3E3]"
        }`}
      >
        <CrossedCandlestickSwordsIcon size={22} />
        <span className={`font-black text-[10.5px] tracking-wider uppercase ${activeTab === "arena" ? "text-white" : ""}`}>
          АРЕНА
        </span>
      </button>

      {/* 3. КОЛЛЕКЦИЯ */}
      <button
        onClick={() => handleNav("collection")}
        className={`tactile-btn flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all ${
          activeTab === "collection"
            ? "text-[#5DE2B5]"
            : "text-[#7B8EA6] hover:text-[#C5D3E3]"
        }`}
      >
        <CardsDeckIcon size={22} />
        <span className="font-extrabold text-[10px] tracking-wider uppercase">
          КОЛЛЕКЦИЯ
        </span>
      </button>

      {/* 4. ТУРНИРЫ */}
      <button
        onClick={() => handleNav("tournaments")}
        className={`tactile-btn flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all ${
          activeTab === "tournaments"
            ? "text-[#F5BE38]"
            : "text-[#7B8EA6] hover:text-[#C5D3E3]"
        }`}
      >
        <TrophyIcon size={22} />
        <span className="font-extrabold text-[10px] tracking-wider uppercase">
          ТУРНИРЫ
        </span>
      </button>

      {/* 5. ЕЩЁ */}
      <button
        onClick={() => handleNav("more")}
        className={`tactile-btn flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-all ${
          activeTab === "more"
            ? "text-[#5DE2B5]"
            : "text-[#7B8EA6] hover:text-[#C5D3E3]"
        }`}
      >
        <ThreeDotsIcon size={22} />
        <span className="font-extrabold text-[10px] tracking-wider uppercase">
          ЕЩЁ
        </span>
      </button>
    </nav>
  );
}
