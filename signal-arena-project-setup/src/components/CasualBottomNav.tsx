import { IconGradCap, IconDualSwords, IconDeckCards, IconDotsMore } from "./Icons";
import { haptic, sfx } from "../lib/feel";

export type NavTabId = "academy" | "arena" | "deck" | "more";

interface BottomNavProps {
  activeTab?: NavTabId;
  onTabChange?: (tab: NavTabId) => void;
}

export function CasualBottomNav({ activeTab = "arena", onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "academy" as const, label: "АКАДЕМИЯ", icon: IconGradCap },
    { id: "arena" as const, label: "АРЕНА", icon: IconDualSwords, isHero: true },
    { id: "deck" as const, label: "КОЛЛЕКЦИЯ", icon: IconDeckCards },
    { id: "more" as const, label: "ЕЩЁ", icon: IconDotsMore },
  ];

  const handleSelect = (id: NavTabId) => {
    haptic("select");
    sfx.nav();
    onTabChange?.(id);
  };

  return (
    <div className="casual-dock w-full bg-gradient-to-t from-[#0a0f1d] via-[#0d1424] to-[#121b2f] border-t border-[#1e2c47] px-3 pt-2 pb-3 flex items-center justify-around select-none z-30">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        const Icon = t.icon;

        if (t.isHero) {
          return (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className="flex flex-col items-center -mt-3 group cursor-pointer focus:outline-none active:scale-95 transition-transform"
            >
              {/* Active 3D Bubble for Arena */}
              <div
                className={`w-14 h-12 rounded-[18px] flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-b from-[#2dd4bf] to-[#0f766e] border border-[#5eead4] shadow-[0_6px_0_#115e59,0_10px_20px_rgba(45,212,191,0.5)] -translate-y-1"
                    : "bg-[#1e293b] border border-[#334155] shadow-md active:bg-[#253347]"
                }`}
              >
                <Icon className={`w-8 h-8 ${isActive ? "text-white" : "text-[#94a3b8]"}`} />
              </div>
              <span
                className={`text-[10px] font-black tracking-wider uppercase mt-1 transition-colors ${
                  isActive ? "text-[#2dd4bf]" : "text-[#64748b]"
                }`}
              >
                {t.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            className="flex flex-col items-center gap-1 py-2 px-3 min-h-[52px] min-w-[52px] cursor-pointer focus:outline-none active:scale-95 transition-transform"
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <Icon
                className={`w-6 h-6 transition-transform ${
                  isActive ? "text-[#2dd4bf] scale-110" : "text-[#64748b]"
                }`}
              />
            </div>
            <span
              className={`text-[10px] font-black tracking-wider uppercase transition-colors ${
                isActive ? "text-[#2dd4bf]" : "text-[#64748b]"
              }`}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
