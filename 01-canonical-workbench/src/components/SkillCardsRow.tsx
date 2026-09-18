import { useState } from "react";
import { TrendUpIcon, VolumeBarsIcon, ShieldIcon, ClockLockIcon, StarIcon } from "./icons";
import { playTapSound } from "../utils/audio";

export type SkillCardType = "trend" | "volume" | "risk" | "wait";

export type SkillCardsRowProps = {
  selected?: SkillCardType;
  onSelect?: (type: SkillCardType) => void;
  className?: string;
};

export function SkillCardsRow({
  selected = "volume",
  onSelect,
  className = "",
}: SkillCardsRowProps) {
  const [active, setActive] = useState<SkillCardType>(selected);

  const handleCardClick = (type: SkillCardType) => {
    playTapSound();
    setActive(type);
    onSelect?.(type);
  };

  return (
    <div className={`w-full grid grid-cols-4 gap-2.5 ${className}`}>
      {/* ---------------- КАРТА 1: ТРЕНД ---------------- */}
      <button
        onClick={() => handleCardClick("trend")}
        className={`tactile-btn relative flex flex-col items-center justify-between p-2 rounded-2xl transition-all ${
          active === "trend"
            ? "bg-gradient-to-b from-[#327068] to-[#1E433E] border-2 border-[#54C7B5] glow-teal-box"
            : "bg-gradient-to-b from-[#243345] to-[#1A2534] border border-[#344860] shadow-[0_4px_0_#131B26,inset_0_1px_0_rgba(255,255,255,0.15)]"
        }`}
        style={{ minHeight: "88px" }}
      >
        <div className="w-10 h-10 rounded-full bg-[#182330] border border-[#2E4259] flex items-center justify-center text-[#54C7B5] shadow-inner mt-0.5">
          <TrendUpIcon size={20} />
        </div>
        <span className="font-black text-[12px] tracking-wider text-white uppercase mt-1">
          ТРЕНД
        </span>
      </button>

      {/* ---------------- КАРТА 2: ОБЪЁМ (Активная с золотой звездой) ---------------- */}
      <button
        onClick={() => handleCardClick("volume")}
        className={`tactile-btn relative flex flex-col items-center justify-between p-2 rounded-2xl transition-all ${
          active === "volume"
            ? "bg-gradient-to-b from-[#DE9F35] to-[#996515] border-2 border-[#FFE082] glow-gold-box"
            : "bg-gradient-to-b from-[#362A1F] to-[#251D16] border border-[#5E482B] shadow-[0_4px_0_#19130E,inset_0_1px_0_rgba(255,255,255,0.15)]"
        }`}
        style={{ minHeight: "88px" }}
      >
        {/* Золотая ленточка со звездой в правом верхнем углу */}
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FFE082] border border-[#B37B15] shadow-md flex items-center justify-center">
          <StarIcon size={13} />
        </div>

        <div className="w-10 h-10 rounded-full bg-[#63400D] border border-[#FFE082] flex items-center justify-center text-[#FFE98A] shadow-inner mt-0.5">
          <VolumeBarsIcon size={20} />
        </div>
        <span className="font-black text-[12px] tracking-wider text-white uppercase mt-1">
          ОБЪЁМ
        </span>
      </button>

      {/* ---------------- КАРТА 3: РИСК ---------------- */}
      <button
        onClick={() => handleCardClick("risk")}
        className={`tactile-btn relative flex flex-col items-center justify-between p-2 rounded-2xl transition-all ${
          active === "risk"
            ? "bg-gradient-to-b from-[#358A63] to-[#1F543C] border-2 border-[#5CE0A0] glow-teal-box"
            : "bg-gradient-to-b from-[#243345] to-[#1A2534] border border-[#344860] shadow-[0_4px_0_#131B26,inset_0_1px_0_rgba(255,255,255,0.15)]"
        }`}
        style={{ minHeight: "88px" }}
      >
        <div className="w-10 h-10 rounded-full bg-[#182330] border border-[#2E4259] flex items-center justify-center text-[#5CE0A0] shadow-inner mt-0.5">
          <ShieldIcon size={20} />
        </div>
        <span className="font-black text-[12px] tracking-wider text-white uppercase mt-1">
          РИСК
        </span>
      </button>

      {/* ---------------- КАРТА 4: ЖДАТЬ ---------------- */}
      <button
        onClick={() => handleCardClick("wait")}
        className={`tactile-btn relative flex flex-col items-center justify-between p-2 rounded-2xl transition-all ${
          active === "wait"
            ? "bg-gradient-to-b from-[#4A5D75] to-[#2E3C4E] border-2 border-[#8AA7CB] shadow-[0_0_12px_rgba(138,167,203,0.4)]"
            : "bg-gradient-to-b from-[#243345] to-[#1A2534] border border-[#344860] shadow-[0_4px_0_#131B26,inset_0_1px_0_rgba(255,255,255,0.15)]"
        }`}
        style={{ minHeight: "88px" }}
      >
        <div className="w-10 h-10 rounded-full bg-[#182330] border border-[#2E4259] flex items-center justify-center text-[#95A7BD] shadow-inner mt-0.5">
          <ClockLockIcon size={20} />
        </div>
        <span className="font-black text-[12px] tracking-wider text-[#A2B4C8] uppercase mt-1">
          ЖДАТЬ
        </span>
      </button>
    </div>
  );
}
