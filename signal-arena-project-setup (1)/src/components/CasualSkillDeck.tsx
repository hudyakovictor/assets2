import { IconClockLock, IconShield, IconStarGold, IconTrend, IconVolumeBars } from "./Icons";
import { haptic, sfx } from "../lib/feel";

export interface SkillCardItem {
  id: string;
  name: string;
  theme: "green" | "yellow" | "steel" | "lock";
  icon: "trend" | "volume" | "risk" | "wait";
  star?: boolean;
}

const DEFAULT_CARDS: SkillCardItem[] = [
  { id: "c01", name: "ТРЕНД", theme: "green", icon: "trend" },
  { id: "c04", name: "ОБЪЁМ", theme: "yellow", icon: "volume", star: true },
  { id: "c25", name: "РИСК", theme: "steel", icon: "risk" },
  { id: "c33", name: "ЖДАТЬ", theme: "lock", icon: "wait" },
];

export function CasualSkillDeck({
  selectedId = "c04",
  onSelect,
}: {
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  const getThemeStyles = (theme: SkillCardItem["theme"], isSelected: boolean) => {
    switch (theme) {
      case "yellow":
        return {
          bg: "bg-gradient-to-b from-[#f59e0b] via-[#d97706] to-[#b45309]",
          border: isSelected ? "border-[#fde047] shadow-[0_0_16px_rgba(251,191,36,0.65)]" : "border-[#b45309]",
          glow: "from-[#fde047]/30 to-transparent",
        };
      case "green":
        return {
          bg: "bg-gradient-to-b from-[#14b8a6] via-[#0d9488] to-[#0f766e]",
          border: isSelected ? "border-[#5eead4] shadow-[0_0_16px_rgba(45,212,191,0.65)]" : "border-[#0f766e]",
          glow: "from-[#5eead4]/30 to-transparent",
        };
      case "steel":
        return {
          bg: "bg-gradient-to-b from-[#2563eb]/80 via-[#1d4ed8] to-[#1e3a8a]",
          border: isSelected ? "border-[#93c5fd] shadow-[0_0_16px_rgba(147,197,253,0.65)]" : "border-[#1e3a8a]",
          glow: "from-[#93c5fd]/30 to-transparent",
        };
      case "lock":
      default:
        return {
          bg: "bg-gradient-to-b from-[#475569] via-[#334155] to-[#1e293b]",
          border: isSelected ? "border-[#94a3b8] shadow-[0_0_14px_rgba(148,163,184,0.65)]" : "border-[#1e293b]",
          glow: "from-white/15 to-transparent",
        };
    }
  };

  const renderIcon = (icon: SkillCardItem["icon"]) => {
    switch (icon) {
      case "trend":
        return <IconTrend className="w-6 h-6" />;
      case "volume":
        return <IconVolumeBars className="w-6 h-6" />;
      case "risk":
        return <IconShield className="w-6 h-6" />;
      case "wait":
      default:
        return <IconClockLock className="w-6 h-6" />;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-1.5 shrink-0 select-none">
      {DEFAULT_CARDS.map((c) => {
        const isSelected = selectedId === c.id;
        const styles = getThemeStyles(c.theme, isSelected);

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              haptic("select");
              sfx.card();
              onSelect?.(c.id);
            }}
            className={`relative flex flex-col justify-between items-center p-1 rounded-[16px] min-h-[82px] cursor-pointer transition-all duration-150 border-[2px] active:scale-95 ${
              styles.bg
            } ${styles.border} ${
              isSelected ? "-translate-y-0.5 scale-[1.02] ring-2 ring-white/60" : "opacity-95"
            }`}
            style={{
              boxShadow: isSelected
                ? "0 6px 16px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.4)"
                : "0 3px 8px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.2)",
            }}
          >
            {/* Star badge in top-right corner if featured */}
            {c.star && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 p-0.5 flex items-center justify-center shadow-md border border-white">
                <IconStarGold className="w-3.5 h-3.5" />
              </span>
            )}

            {/* Specular sheen layer */}
            <div className={`absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b ${styles.glow} rounded-t-[14px] pointer-events-none`} />

            {/* Center Circular Medallion */}
            <div className="my-1 w-9 h-9 rounded-full bg-gradient-to-b from-white/30 to-black/20 p-0.5 flex items-center justify-center shadow-inner">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-sm">
                {renderIcon(c.icon)}
              </div>
            </div>

            {/* Bottom White Label Plate (Exact from Reference) */}
            <div className="w-full py-0.5 bg-white rounded-[8px] shadow-sm flex items-center justify-center">
              <span className="text-[10px] font-black text-[#1e293b] tracking-wider uppercase truncate px-1">
                {c.name}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
