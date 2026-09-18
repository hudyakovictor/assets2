import { haptic, sfx } from "../lib/feel";
import { RepoSvg } from "./RepoSvg";

export function CasualTopBar({
  xp = 680,
  xpMax = 1000,
  coins = 1240,
  attempts = 3,
  attemptsMax = 3,
  hasNotif = true,
  onNotif,
  onSettings,
}: {
  xp?: number;
  xpMax?: number;
  coins?: number;
  attempts?: number;
  attemptsMax?: number;
  hasNotif?: boolean;
  onNotif?: () => void;
  onSettings?: () => void;
}) {
  const pct = Math.max(4, Math.min(100, (xp / xpMax) * 100));
  return (
    <header className="shrink-0 flex items-center gap-1.5 px-2.5 h-12 pt-[env(safe-area-inset-top,0px)]">
      <div className="relative flex-1 min-w-0 h-9 rounded-full overflow-hidden border border-[#2dd4bf]/45 bg-[#0b1c22]">
        <i className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0f766e] to-[#2dd4bf]/50" style={{ width: `${pct}%` }} />
        <div className="relative z-10 h-full flex items-center gap-1.5 px-2">
          <span className="text-[9px] font-black bg-[#2dd4bf] text-[#042f2e] rounded-full px-1.5 py-0.5">XP</span>
          <span className="text-[11px] font-black text-white tabular-nums truncate">
            {xp}<span className="text-[#64748b]">/{xpMax}</span>
          </span>
        </div>
      </div>

      <div className="h-9 px-2 rounded-full bg-[#1c170a] border border-[#f59e0b]/50 flex items-center gap-1 shrink-0">
        <RepoSvg name="coin.svg" className="w-4 h-4" />
        <span className="text-[11px] font-black text-[#fde68a] tabular-nums">{coins.toLocaleString("ru-RU")}</span>
      </div>

      <div className={`h-9 px-2 rounded-full flex items-center gap-0.5 shrink-0 border ${attempts ? "bg-[#122833] border-[#2dd4bf]/30" : "bg-[#2a1216] border-rose-500/40"}`}>
        <RepoSvg name="lightning.svg" className="w-4 h-4" />
        <span className="text-[11px] font-black text-white tabular-nums">{attempts}/{attemptsMax}</span>
      </div>

      <button type="button" onClick={() => { haptic("tap"); sfx.tap(); onNotif?.(); }} className="relative w-11 h-11 rounded-full bg-[#1b253b] border border-[#2b3a59] grid place-items-center active:scale-95">
        <RepoSvg name="bell.svg" className="w-5 h-5" />
        {hasNotif && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f43f5e]" />}
      </button>
      <button type="button" onClick={() => { haptic("tap"); sfx.tap(); onSettings?.(); }} className="w-11 h-11 rounded-full bg-[#1b253b] border border-[#2b3a59] grid place-items-center active:scale-95">
        <RepoSvg name="gear.svg" className="w-5 h-5" />
      </button>
    </header>
  );
}
