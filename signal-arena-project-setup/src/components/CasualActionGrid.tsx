import { IconArrowEnter, IconHourglass, IconSliders } from "./Icons";

interface ActionGridProps {
  onEnterNow?: () => void;
  onWaitRetest?: () => void;
  onHigherTimeframe?: () => void;
  onNoTrade?: () => void;
  selectedAction?: string;
  revealed?: boolean;
  /** действие заблокировано до сбора фактов (обоснование) */
  enterBlocked?: boolean;
  /** id действия, подсвеченного подсказкой обучения */
  hintAction?: string;
}

export function CasualActionGrid({
  onEnterNow,
  onWaitRetest,
  onHigherTimeframe,
  onNoTrade,
  selectedAction = "wait",
  revealed = false,
  enterBlocked = false,
  hintAction,
}: ActionGridProps) {
  // Только вызов callback: вся тактильная/звуковая логика — у родителя (раунд/Seal/разведка).
  const handleAction = (_actionId: string, callback?: () => void) => {
    callback?.();
  };
  const hint = (id: string) => (hintAction === id ? " hint-ring" : "");

  return (
    <div className="w-full grid grid-cols-2 gap-2.5 select-none">
      {/* 1. Войти сразу — требует фактов и плана (инвалидация) */}
      <button
        onClick={() => !enterBlocked && handleAction("enter", onEnterNow)}
        disabled={enterBlocked}
        aria-disabled={enterBlocked}
        className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-[18px] bg-gradient-to-b from-[#3f9c74] via-[#2E7F5C] to-[#226247] border border-[#6ee7b7]/45 text-white font-extrabold text-[13px] tracking-wide text-left transition-all duration-150 active:translate-y-1 active:shadow-none ${
          enterBlocked ? "opacity-45 saturate-50" : ""
        } ${
          selectedAction === "enter"
            ? "shadow-[0_5px_0_#1a4d37,0_10px_20px_rgba(46,127,92,0.5)] ring-2 ring-[#a7f3d0]"
            : "shadow-[0_5px_0_#1a4d37,0_8px_16px_rgba(0,0,0,0.35)]"
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0 active:scale-105 transition-transform">
          <IconArrowEnter className="w-5 h-5 text-white" />
        </div>
        <span className="leading-tight drop-shadow-sm">Войти сразу</span>
      </button>

      {/* 2. Ждать ретест (до Seal) / Следующий сценарий (после reveal) */}
      <button
        onClick={() => handleAction("wait", onWaitRetest)}
        className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-[18px] bg-gradient-to-b from-[#2dd4bf] via-[#14b8a6] to-[#0d9488] border border-[#5eead4]/60 text-white font-extrabold text-[12px] tracking-wide text-left transition-all duration-150 active:translate-y-1 active:shadow-none ${
          revealed ? "animate-pulse ring-2 ring-[#5eead4]" : selectedAction === "wait"
            ? "shadow-[0_5px_0_#115e59,0_10px_25px_rgba(45,212,191,0.6)] ring-2 ring-[#5eead4]"
            : "shadow-[0_5px_0_#115e59,0_8px_16px_rgba(0,0,0,0.35)]"
        }${hint("wait")}`}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0 active:scale-105 transition-transform">
          <IconHourglass className="w-5 h-5 text-white" />
        </div>
        <span className="leading-tight drop-shadow-sm">
          {revealed ? (
            <>Новый<br />сценарий →</>
          ) : (
            <>Ждать ретест<br />и объём</>
          )}
        </span>
      </button>

      {/* 3. Старшие таймфреймы — заблокированный синий группы blue */}
      <button
        onClick={() => handleAction("htf", onHigherTimeframe)}
        className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-[18px] bg-gradient-to-b from-[#5d769b] via-[#4C6180] to-[#3a4c64] border border-[#94a3b8]/45 text-white font-extrabold text-[12px] tracking-wide text-left transition-all duration-150 active:translate-y-1 active:shadow-none ${
          selectedAction === "htf"
            ? "shadow-[0_5px_0_#2b3849,0_10px_20px_rgba(76,97,128,0.5)] ring-2 ring-[#c3cede]"
            : "shadow-[0_5px_0_#2b3849,0_8px_16px_rgba(0,0,0,0.35)]"
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0 active:scale-105 transition-transform">
          <IconSliders className="w-5 h-5 text-white" />
        </div>
        <span className="leading-tight drop-shadow-sm">
          Старшие<br />таймфреймы
        </span>
      </button>

      {/* 4. Без сделки — c24_no_trade_is_a_decision (полноценное решение) */}
      <button
        onClick={() => handleAction("notrade", onNoTrade)}
        className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-[18px] bg-gradient-to-b from-[#e0c36a] via-[#D0B24A] to-[#a8892f] border border-[#f0d68a]/50 text-white font-extrabold text-[12px] tracking-wide text-left transition-all duration-150 active:translate-y-1 active:shadow-none ${
          selectedAction === "notrade"
            ? "shadow-[0_5px_0_#6e581c,0_10px_20px_rgba(208,178,74,0.5)] ring-2 ring-[#f3e2a3]"
            : "shadow-[0_5px_0_#6e581c,0_8px_16px_rgba(0,0,0,0.35)]"
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0 active:scale-105 transition-transform">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="2.2" />
            <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="leading-tight drop-shadow-sm">
          Без сделки<br />— это решение
        </span>
      </button>
    </div>
  );
}
