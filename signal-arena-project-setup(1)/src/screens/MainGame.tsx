import { useState } from "react";
import TopBar from "../components/TopBar";
import BottomNavBar, { type NavTab } from "../components/BottomNavBar";
import ArenaGamePlay from "./ArenaGamePlay";
import AcademyScreen from "./AcademyScreen";
import { IconTarget, SkillIcon } from "../components/icons";

export default function MainGame({ layoutMode = "classic", accentColor = "#26e6c8", onOpenStudio }: {
  layoutMode?: "classic" | "split" | "cards-focus" | "tactical-grid";
  accentColor?: string;
  onOpenStudio?: () => void;
  onOpenOnboarding?: () => void;
}) {
  const [tab, setTab] = useState<NavTab>("arena");
  const [xp, setXp] = useState(680);
  const [coins, setCoins] = useState(1240);
  const [pulse, setPulse] = useState<null | "xp" | "coins">(null);

  function reward(stars: number, amount: number) {
    setXp((value) => Math.min(1000, value + stars * 40));
    setCoins((value) => value + amount);
    setPulse("coins");
    window.setTimeout(() => setPulse(null), 900);
  }

  return (
    <div className="arena-bg app-shell relative flex h-full flex-col overflow-hidden">
      <TopBar lvl={4} xp={xp} xpMax={1000} attempts={3} attemptsMax={5} stars={128} coins={coins} notifications={2} pulse={pulse} onBell={() => setTab("profile")} onGear={onOpenStudio} />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {tab === "arena" && <ArenaGamePlay layoutMode={layoutMode} accentColor={accentColor} onReward={reward} />}
        {tab === "academy" && <AcademyScreen />}
        {tab === "profile" && <Profile />}
      </div>
      <BottomNavBar active={tab} onChange={setTab} />
    </div>
  );
}

function Profile() {
  return (
    <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#20334a] text-[#26e6c8]">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7H4z" /></svg>
        </div>
        <div><div className="text-lg font-black">Аналитик</div><div className="text-xs font-bold text-[var(--ink-dim)]">4 уровень · 47 заходов</div></div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[["Точность","71%"],["Серия","5"],["Карты","18/40"]].map(([k,v]) => <div key={k} className="clay-card px-2 py-3 text-center"><div className="text-lg font-black">{v}</div><div className="text-[9px] font-black text-[var(--ink-mute)]">{k}</div></div>)}
      </div>
      <div className="mt-5 text-[11px] font-black tracking-wider text-[var(--ink-mute)]">СИЛЬНЫЕ СТОРОНЫ</div>
      {[["c12","Читаете число сделок"],["c01","Видите общее направление"]].map(([id,text]) => <div key={id} className="mt-2 flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[#152137] p-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#2E7F5C]"><SkillIcon id={id} className="h-6 w-6" /></span><span className="text-[13px] font-bold">{text}</span><IconTarget className="ml-auto h-4 w-4 text-[#26e6c8]" /></div>)}
    </div>
  );
}