import { useState } from "react";
import { AvatarShibaIcon, StarIcon, CoinIcon, GearIcon } from "../components/icons";
import { toggleSound, isSoundEnabled, playTapSound } from "../utils/audio";

export function MoreScreen({
  coins = 1240,
  xp = 680,
  onResetBalance,
}: {
  coins?: number;
  xp?: number;
  onResetBalance?: () => void;
}) {
  void xp;
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
    playTapSound();
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between p-3 gap-2.5 overflow-hidden">
      {/* Карточка профиля */}
      <div className="shrink-0 p-3.5 rounded-2xl bg-[#16212F] border border-[#27384E] flex items-center gap-3.5 shadow-md">
        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#5DE2B5] shadow-[0_0_12px_rgba(93,226,181,0.3)] shrink-0">
          <AvatarShibaIcon size={56} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-black text-[16px] text-white tracking-tight">
              @trader_pro
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#3AA89B]/20 text-[#5DE2B5] border border-[#3AA89B]/40 text-[9.5px] font-black uppercase">
              PRO ТРЕЙДЕР
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#7E91A6] mt-0.5">
            Уровень 7 · Ранг 45 Арены
          </p>
        </div>
      </div>

      {/* Метрики */}
      <div className="shrink-0 grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-2xl bg-[#16212F] border border-[#27384E]">
          <p className="text-[10px] font-bold text-[#7E91A6] uppercase">Винрейт</p>
          <p className="font-mono font-black text-[17px] text-[#5DE2B5]">71.4%</p>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#16212F] border border-[#27384E]">
          <p className="text-[10px] font-bold text-[#7E91A6] uppercase">Сценариев</p>
          <p className="font-mono font-black text-[17px] text-white">46</p>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#16212F] border border-[#27384E]">
          <p className="text-[10px] font-bold text-[#7E91A6] uppercase">Стрик побед</p>
          <p className="font-mono font-black text-[17px] text-[#F5C75D]">5 раундов</p>
        </div>
      </div>

      {/* Настройки и опции */}
      <div className="flex-1 min-h-0 p-3 rounded-2xl bg-[#16212F] border border-[#27384E] space-y-2.5 custom-scroll">
        <h3 className="font-black text-[11px] text-[#7E91A6] uppercase tracking-wider">
          НАСТРОЙКИ СЕССИИ
        </h3>

        {/* Переключатель звука */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A2636] border border-[#27384E]">
          <div className="flex items-center gap-2">
            <GearIcon size={18} className="text-[#9BB1CA]" />
            <span className="font-bold text-[13px] text-white">Звуковые эффекты (Web Audio)</span>
          </div>
          <button
            onClick={handleSoundToggle}
            className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase transition ${
              soundOn ? "bg-[#3AA89B] text-white" : "bg-[#27384E] text-[#7E91A6]"
            }`}
          >
            {soundOn ? "ВКЛ" : "ВЫКЛ"}
          </button>
        </div>

        {/* Баланс и прогресс */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A2636] border border-[#27384E]">
          <div className="flex items-center gap-2">
            <CoinIcon size={18} />
            <span className="font-bold text-[13px] text-white">Баланс монет: {coins}</span>
          </div>
          <button
            onClick={() => {
              playTapSound();
              onResetBalance?.();
            }}
            className="text-[11px] font-extrabold text-[#5DE2B5] hover:underline"
          >
            ПОПОЛНИТЬ +500
          </button>
        </div>

        {/* Достижения */}
        <div className="p-2.5 rounded-xl bg-[#1A2636] border border-[#27384E]">
          <p className="font-bold text-[12px] text-white mb-1.5 flex items-center gap-1.5">
            <StarIcon size={15} /> Достижение: «Акула стакана»
          </p>
          <p className="text-[11px] text-[#7E91A6]">
            Успешно распознано 10 китовых стен перед разворотом рынка.
          </p>
        </div>
      </div>
    </div>
  );
}
