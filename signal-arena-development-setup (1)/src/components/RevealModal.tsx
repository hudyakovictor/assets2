import { useState, useEffect } from "react";
import { StarIcon, CoinIcon, CrossedCandlestickSwordsIcon } from "./icons";
import { playCoinSound, playTapSound } from "../utils/audio";

export type RevealModalProps = {
  isOpen: boolean;
  decisionType: string;
  onClose: () => void;
};

export function RevealModal({ isOpen, decisionType, onClose }: RevealModalProps) {
  const [slashed, setSlashed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSlashed(true);
      const timer = setTimeout(() => {
        playCoinSound();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSlashed(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isSuccess = decisionType === "wait_retest";

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      {/* Эффект рассечения меча-свечи */}
      {slashed && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="sword-slash-fx w-[160%] h-3 bg-gradient-to-r from-transparent via-[#67E6B2] to-transparent shadow-[0_0_24px_#67E6B2]" />
        </div>
      )}

      {/* Окно карточки исхода */}
      <div className="relative w-full max-w-[340px] rounded-3xl bg-[#141F2D] border-2 border-[#364B66] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] p-4 flex flex-col items-center text-center">
        {/* Иконка столкновения */}
        <div className="w-16 h-16 rounded-2xl bg-[#1D2C3F] border border-[#3A5373] flex items-center justify-center shadow-lg -mt-8 mb-2">
          <CrossedCandlestickSwordsIcon size={38} />
        </div>

        {/* Заголовок исхода */}
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-1.5 ${
            isSuccess
              ? "bg-[#50C890]/20 text-[#67E6B2] border border-[#50C890]/40 shadow-[0_0_12px_rgba(80,200,144,0.3)]"
              : "bg-[#EB635B]/20 text-[#FF8F87] border border-[#EB635B]/40 shadow-[0_0_12px_rgba(235,99,91,0.3)]"
          }`}
        >
          {isSuccess ? "ИДЕАЛЬНОЕ РЕШЕНИЕ!" : "ВЫНОС СТОПОВ!"}
        </span>

        <h3 className="font-black text-[20px] text-white tracking-tight leading-tight">
          {isSuccess ? "Ложный пробой поглощён" : "Ловушка покупателей"}
        </h3>

        {/* Звёзды */}
        <div className="flex items-center gap-1.5 my-3">
          <StarIcon size={26} />
          <StarIcon size={32} />
          <StarIcon size={26} />
        </div>

        {/* Награды: XP + Монеты */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#182828] border border-[#2B4E47]">
            <span className="text-[11px] font-black text-[#5DE2B5]">XP</span>
            <span className="font-extrabold text-[13px] text-white">+40</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#262016] border border-[#5E482B]">
            <CoinIcon size={18} />
            <span className="font-extrabold text-[13px] text-[#F8E39D]">+120</span>
          </div>
        </div>

        {/* Разбор ситуации */}
        <p className="text-[12px] leading-relaxed text-[#A9BED4] bg-[#0E1622] p-3 rounded-2xl border border-[#1F2E40] text-left mb-4">
          {isSuccess
            ? "Объём при пробое $67 840 упал на 44%. Стена кита в 1 850 BTC полностью поглотила покупки, и цена откатила на ретест поддержки. Вы не попали в ловушку!"
            : "Вход на вершине пробоя без объёма привёл к мгновенному откату от китовой стены. В таких сценариях всегда ждите ретест уровня!"}
        </p>

        {/* Кнопка продолжить */}
        <button
          onClick={() => {
            playTapSound();
            onClose();
          }}
          className="tactile-btn w-full py-3.5 rounded-2xl bg-[#3E9F73] border border-[#52BE8D] shadow-[0_4px_0_#236347,inset_0_1px_0_rgba(255,255,255,0.3)] font-black text-[14px] text-white uppercase tracking-wider"
        >
          СЛЕДУЮЩИЙ СЦЕНАРИЙ
        </button>
      </div>
    </div>
  );
}
