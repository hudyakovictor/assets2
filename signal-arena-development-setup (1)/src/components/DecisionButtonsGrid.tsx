import { UpArrowIcon, HourglassIcon, MultiTimeframeIcon, AlertTriangleIcon } from "./icons";
import { playTapSound, playSwordClashSound } from "../utils/audio";

export type DecisionType = "enter" | "wait_retest" | "htf" | "size_up";

export type DecisionButtonsGridProps = {
  onDecision: (type: DecisionType) => void;
  className?: string;
  disabled?: boolean;
};

export function DecisionButtonsGrid({
  onDecision,
  className = "",
  disabled = false,
}: DecisionButtonsGridProps) {
  const handleClick = (type: DecisionType) => {
    if (disabled) return;
    if (type === "wait_retest" || type === "enter") {
      playSwordClashSound();
    } else {
      playTapSound();
    }
    onDecision(type);
  };

  return (
    <div className={`w-full grid grid-cols-2 gap-2.5 ${className}`}>
      {/* ---------------- КНОПКА 1: Войти сразу ---------------- */}
      <button
        disabled={disabled}
        onClick={() => handleClick("enter")}
        className="tactile-btn flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-[#3E9F73] border border-[#52BE8D] shadow-[0_4px_0_#236347,inset_0_1px_0_rgba(255,255,255,0.3)] text-left"
        style={{ minHeight: "52px" }}
      >
        <div className="w-8 h-8 rounded-full bg-[#27664B] border border-[#54C592] flex items-center justify-center text-white shrink-0 shadow-inner">
          <UpArrowIcon size={16} />
        </div>
        <span className="font-extrabold text-[13.5px] leading-tight text-white tracking-tight">
          Войти сразу
        </span>
      </button>

      {/* ---------------- КНОПКА 2: Ждать ретест и объём (Неоновое свечение) ---------------- */}
      <button
        disabled={disabled}
        onClick={() => handleClick("wait_retest")}
        className="tactile-btn relative flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-[#318F84] border-2 border-[#6EEAD8] shadow-[0_4px_0_#1C5952,0_0_16px_rgba(110,234,216,0.45),inset_0_1px_0_rgba(255,255,255,0.4)] text-left"
        style={{ minHeight: "52px" }}
      >
        <div className="w-8 h-8 rounded-full bg-[#1C5952] border border-[#6EEAD8] flex items-center justify-center text-[#B2F8EF] shrink-0 shadow-inner">
          <HourglassIcon size={16} />
        </div>
        <span className="font-extrabold text-[13px] leading-tight text-white tracking-tight">
          Ждать ретест и объём
        </span>
      </button>

      {/* ---------------- КНОПКА 3: Старшие таймфреймы ---------------- */}
      <button
        disabled={disabled}
        onClick={() => handleClick("htf")}
        className="tactile-btn flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-[#41556E] border border-[#597496] shadow-[0_4px_0_#233040,inset_0_1px_0_rgba(255,255,255,0.2)] text-left"
        style={{ minHeight: "52px" }}
      >
        <div className="w-8 h-8 rounded-full bg-[#263546] border border-[#5A7494] flex items-center justify-center text-[#D6E3F2] shrink-0 shadow-inner">
          <MultiTimeframeIcon size={16} />
        </div>
        <span className="font-extrabold text-[13px] leading-tight text-white tracking-tight">
          Старшие таймфреймы
        </span>
      </button>

      {/* ---------------- КНОПКА 4: Увеличить позицию (Красная) ---------------- */}
      <button
        disabled={disabled}
        onClick={() => handleClick("size_up")}
        className="tactile-btn flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-[#D95D56] border border-[#EA7B75] shadow-[0_4px_0_#87342F,inset_0_1px_0_rgba(255,255,255,0.25)] text-left"
        style={{ minHeight: "52px" }}
      >
        <div className="w-8 h-8 rounded-full bg-[#913732] border border-[#EB7B75] flex items-center justify-center text-white shrink-0 shadow-inner">
          <AlertTriangleIcon size={16} />
        </div>
        <span className="font-extrabold text-[13px] leading-tight text-white tracking-tight">
          Увеличить позицию
        </span>
      </button>
    </div>
  );
}
