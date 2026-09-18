import { IconAlertTrend, IconArrowEnter, IconHourglass, IconSliders } from "./Icons";
import { haptic, sfx } from "../lib/feel";

interface ActionGridProps {
  onEnterNow?: () => void;
  onWaitRetest?: () => void;
  onHigherTimeframe?: () => void;
  onScalePosition?: () => void;
  selectedAction?: string;
}

export function CasualActionGrid({
  onEnterNow,
  onWaitRetest,
  onHigherTimeframe,
  onScalePosition,
  selectedAction = "wait",
}: ActionGridProps) {
  const handleAction = (callback?: () => void) => {
    haptic("select");
    sfx.select();
    callback?.();
  };

  return (
    <div className="grid grid-cols-2 gap-2 shrink-0 select-none">
      {/* 1. [↑ Войти сразу] - Emerald Green 3D Tactile Button */}
      <button
        type="button"
        onClick={() => handleAction(onEnterNow)}
        className={`relative flex items-center gap-2 px-2.5 py-2 rounded-[16px] bg-gradient-to-b from-[#34d399] via-[#10b981] to-[#059669] border border-[#6ee7b7]/60 text-white font-black text-[12px] tracking-wide text-left transition-all duration-150 active:translate-y-1 active:shadow-none ${
          selectedAction === "enter"
            ? "shadow-[0_4px_0_#065f46,0_8px_16px_rgba(16,185,129,0.45)] ring-2 ring-[#a7f3d0]"
            : "shadow-[0_4px_0_#065f46,0_6px_12px_rgba(0,0,0,0.35)]"
        }`}
      >
        <div className="w-7 h-7 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0 shadow-inner">
          <IconArrowEnter className="w-4 h-4 text-white" />
        </div>
        <span className="leading-tight drop-shadow-sm font-['Sora',sans-serif]">Войти сразу</span>
      </button>

      {/* 2. [⏳ Ждать ретест и объём] - Cyan / Teal Glowing 3D Tactile Button */}
      <button
        type="button"
        onClick={() => handleAction(onWaitRetest)}
        className={`relative flex items-center gap-2 px-2.5 py-2 rounded-[16px] bg-gradient-to-b from-[#2dd4bf] via-[#14b8a6] to-[#0d9488] border border-[#5eead4]/60 text-white font-black text-[11px] tracking-wide text-left transition-all duration-150 active:translate-y-1 active:shadow-none ${
          selectedAction === "wait"
            ? "shadow-[0_4px_0_#115e59,0_8px_18px_rgba(45,212,191,0.55)] ring-2 ring-[#5eead4]"
            : "shadow-[0_4px_0_#115e59,0_6px_12px_rgba(0,0,0,0.35)]"
        }`}
      >
        <div className="w-7 h-7 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0 shadow-inner">
          <IconHourglass className="w-4 h-4 text-white" />
        </div>
        <span className="leading-tight drop-shadow-sm font-['Sora',sans-serif]">
          Ждать ретест<br />и объём
        </span>
      </button>

      {/* 3. [📊 Старшие таймфреймы] - Slate Blue 3D Tactile Button */}
      <button
        type="button"
        onClick={() => handleAction(onHigherTimeframe)}
        className={`relative flex items-center gap-2 px-2.5 py-2 rounded-[16px] bg-gradient-to-b from-[#475569] via-[#334155] to-[#1e293b] border border-[#64748b]/60 text-white font-black text-[11px] tracking-wide text-left transition-all duration-150 active:translate-y-1 active:shadow-none ${
          selectedAction === "htf"
            ? "shadow-[0_4px_0_#0f172a,0_8px_16px_rgba(100,116,139,0.45)] ring-2 ring-[#94a3b8]"
            : "shadow-[0_4px_0_#0f172a,0_6px_12px_rgba(0,0,0,0.35)]"
        }`}
      >
        <div className="w-7 h-7 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0 shadow-inner">
          <IconSliders className="w-4 h-4 text-white" />
        </div>
        <span className="leading-tight drop-shadow-sm font-['Sora',sans-serif]">
          Старшие<br />таймфреймы
        </span>
      </button>

      {/* 4. [📈 Увеличить позицию] - Coral Red 3D Tactile Button */}
      <button
        type="button"
        onClick={() => handleAction(onScalePosition)}
        className={`relative flex items-center gap-2 px-2.5 py-2 rounded-[16px] bg-gradient-to-b from-[#f87171] via-[#ef4444] to-[#dc2626] border border-[#fca5a5]/60 text-white font-black text-[11px] tracking-wide text-left transition-all duration-150 active:translate-y-1 active:shadow-none ${
          selectedAction === "scale"
            ? "shadow-[0_4px_0_#991b1b,0_8px_16px_rgba(239,68,68,0.45)] ring-2 ring-[#fca5a5]"
            : "shadow-[0_4px_0_#991b1b,0_6px_12px_rgba(0,0,0,0.35)]"
        }`}
      >
        <div className="w-7 h-7 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0 shadow-inner">
          <IconAlertTrend className="w-4 h-4 text-white" />
        </div>
        <span className="leading-tight drop-shadow-sm font-['Sora',sans-serif]">
          Увеличить<br />позицию
        </span>
      </button>
    </div>
  );
}
