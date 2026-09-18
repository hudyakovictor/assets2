import { IconDeckCards, IconDotsMore, IconDualSwords, IconGradCap } from "./Icons";
import { haptic, sfx } from "../lib/feel";

export type NavTabId = "academy" | "arena" | "deck" | "more";

export function CasualBottomNav({ activeTab = "arena", onTabChange }: { activeTab?: NavTabId; onTabChange?: (t: NavTabId) => void }) {
  const tabs = [
    { id: "academy" as const, label: "АКАДЕМИЯ", Icon: IconGradCap },
    { id: "arena" as const, label: "АРЕНА", Icon: IconDualSwords, hero: true },
    { id: "deck" as const, label: "КОЛЛЕКЦИЯ", Icon: IconDeckCards },
    { id: "more" as const, label: "ЕЩЁ", Icon: IconDotsMore },
  ];
  return (
    <nav className="shrink-0 flex items-end justify-around px-1 pt-1 pb-[max(8px,env(safe-area-inset-bottom,0px))] border-t border-[#1e2c47] bg-[#0a101c]">
      {tabs.map((t) => {
        const on = activeTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => { haptic("select"); sfx.nav(); onTabChange?.(t.id); }}
            className="flex flex-col items-center justify-end min-w-[68px] min-h-[48px] active:scale-95"
          >
            {t.hero ? (
              <span className={`w-12 h-9 rounded-2xl grid place-items-center border ${on ? "bg-gradient-to-b from-[#2dd4bf] to-[#0f766e] border-[#5eead4] shadow-[0_4px_0_#115e59]" : "bg-[#1e293b] border-[#334155]"}`}>
                <t.Icon className="w-7 h-7" />
              </span>
            ) : (
              <t.Icon className={`w-6 h-6 ${on ? "text-[#2dd4bf]" : "text-[#64748b]"}`} />
            )}
            <span className={`text-[9px] font-black tracking-wide mt-0.5 ${on ? "text-[#2dd4bf]" : "text-[#64748b]"}`}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
