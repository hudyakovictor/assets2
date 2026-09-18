import { useState } from "react";
import { TerminalWindow, type TerminalTab } from "../components/TerminalWindow";
import { SkillCardsRow, type SkillCardType } from "../components/SkillCardsRow";
import { DecisionButtonsGrid, type DecisionType } from "../components/DecisionButtonsGrid";
import { RevealModal } from "../components/RevealModal";
import { ChatBubbleIcon } from "../components/icons";

export type ArenaGameScreenProps = {
  scenarioPair?: string;
  variant?: "A" | "B" | "C" | "D";
  onReward?: (xp: number, coins: number) => void;
};

export function ArenaGameScreen({
  scenarioPair = "BTC/USDT",
  variant = "A",
  onReward,
}: ArenaGameScreenProps) {
  const [terminalTab, setTerminalTab] = useState<TerminalTab>("chart");
  const [activeCard, setActiveCard] = useState<SkillCardType>("volume");
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [currentDecision, setCurrentDecision] = useState<DecisionType>("wait_retest");

  // Подсказки в речевом пузыре трейдера
  const hints: Record<SkillCardType, string> = {
    volume: "Пробой без объёма. Объём молчит.",
    trend: "Нисходящий тренд давит на локальный отскок.",
    risk: "Стена в 1 850 BTC на $67 840. Стоп ставить некуда.",
    wait: "Жди закрытия 15M свечи и реакцию на ретест уровня.",
  };

  const handleDecision = (type: DecisionType) => {
    setCurrentDecision(type);
    setDecisionModalOpen(true);
    if (type === "wait_retest") {
      onReward?.(40, 120);
    } else {
      onReward?.(10, 20);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between px-3 py-1.5 gap-2.5 overflow-hidden">
      {/* ---------------- Речевой пузырь подсказки трейдера ---------------- */}
      <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#16212F]/90 border border-[#23354B] text-[13px] font-bold text-[#E3ECF7] shadow-sm">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[#2EE6C8] shrink-0">
            <ChatBubbleIcon size={16} />
          </span>
          <span className="truncate">{hints[activeCard]}</span>
        </div>
        <span className="shrink-0 font-mono text-[9.5px] font-black px-1.5 py-0.5 rounded bg-[#101925] text-[#2EE6C8] border border-[#2EE6C8]/30">
          VAR-{variant}
        </span>
      </div>

      {/* ---------------- Окно терминала macOS Style ---------------- */}
      <div className="flex-1 min-h-0 flex flex-col justify-center">
        <TerminalWindow
          currentTab={terminalTab}
          onTabChange={setTerminalTab}
          scenarioTitle={scenarioPair}
        />
      </div>

      {/* ---------------- Ряд 4 тактильных карт навыков ---------------- */}
      <div className="shrink-0">
        <SkillCardsRow
          selected={activeCard}
          onSelect={(c) => {
            setActiveCard(c);
            if (c === "volume") setTerminalTab("orderbook");
            if (c === "trend") setTerminalTab("chart");
            if (c === "risk") setTerminalTab("whale");
          }}
        />
      </div>

      {/* ---------------- 4 Кнопки решений игрока (2x2) ---------------- */}
      <div className="shrink-0 pb-1">
        <DecisionButtonsGrid onDecision={handleDecision} />
      </div>

      {/* ---------------- Модальное окно исхода с рассечением меча ---------------- */}
      <RevealModal
        isOpen={decisionModalOpen}
        decisionType={currentDecision}
        onClose={() => setDecisionModalOpen(false)}
      />
    </div>
  );
}
