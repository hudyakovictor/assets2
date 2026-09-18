import { useEffect, useState } from "react";
import { AssetProvider } from "./components/AssetContext";
import { CasualArenaScreen } from "./components/CasualArenaScreen";
import { Report } from "./components/Report";
import { StudioSidebar, type StudioParams } from "./components/StudioSidebar";
import type { TerminalTab } from "./components/TerminalCard";
import type { VariantId } from "./data/pages";
import { haptic, sfx } from "./lib/feel";
import "./lib/handwritten.css";
import type { QAResult } from "./components/QA";

export default function App() {
  const [currentPageId, setCurrentPageId] = useState("P24");
  const [currentVariantId, setCurrentVariantId] = useState<VariantId>("A");
  const [terminalTab, setTerminalTab] = useState<TerminalTab>("news");
  const [xp, setXp] = useState(680);
  const [coins, setCoins] = useState(1240);
  const [selectedCardId, setSelectedCardId] = useState("c04");
  const [timeframe, setTimeframe] = useState<"15M" | "1Ч" | "1Д">("15M");
  const [viewportSize, setViewportSize] = useState({ name: "390 × 844", w: 390, h: 844 });
  const [coachQuote, setCoachQuote] = useState("Пробой без объёма. Объём молчит.");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [drawer, setDrawer] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [report, setReport] = useState(false);

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { ready: () => void; expand: () => void } } }).Telegram?.WebApp;
    tg?.ready?.();
    tg?.expand?.();
  }, []);

  const params: StudioParams = {
    currentPageId, setCurrentPageId,
    currentVariantId, setCurrentVariantId,
    terminalTab, setTerminalTab,
    xp, setXp, coins, setCoins,
    selectedCardId, setSelectedCardId,
    timeframe, setTimeframe,
    viewportSize, setViewportSize,
    coachQuote, setCoachQuote,
    triggerReward: () => { sfx.win(); haptic("success"); setXp((x) => Math.min(1000, x + 150)); setCoins((c) => c + 300); setCoachQuote("Отличный сетап. Награда начислена."); },
    scenarioIndex, setScenarioIndex,
    soundEnabled, setSoundEnabled,
    hapticEnabled, setHapticEnabled,
    onOpenReportModal: () => setReport(true),
  };

  const qa: QAResult[] = [
    { page: currentPageId, variant: currentVariantId, viewport: "390x844", ok: true, issues: [] },
    { page: currentPageId, variant: currentVariantId, viewport: "360x800", ok: true, issues: [] },
  ];

  return (
    <AssetProvider>
      <div className="w-full h-[100dvh] bg-[#060a14] flex overflow-hidden">
        <div className="hidden lg:block h-full shrink-0">
          <StudioSidebar params={params} />
        </div>

        {drawer && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 flex" onClick={() => setDrawer(false)}>
            <div className="w-[86%] max-w-[380px] h-full bg-[#090e1a] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <StudioSidebar params={params} />
            </div>
          </div>
        )}

        <main className="flex-1 h-full flex flex-col items-center justify-center overflow-hidden">
          <div className="z-10 w-full h-full lg:w-[390px] lg:h-[min(844px,92dvh)] lg:max-h-[92dvh] shrink-0">
            <CasualArenaScreen studioParams={params} onOpenSidebar={() => setDrawer(true)} />
          </div>
        </main>

        {report && <Report qa={qa} onClose={() => setReport(false)} />}
      </div>
    </AssetProvider>
  );
}
