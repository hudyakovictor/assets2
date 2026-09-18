import { useState } from "react";
import {
  TrophyIcon,
  CrownIcon,
  AvatarShibaIcon,
  AvatarKnightIcon,
  AvatarTraderIcon,
  CrossedCandlestickSwordsIcon,
  ShieldIcon,
  WhaleIcon,
  MedalBadgeIcon,
  SimpleClockIcon,
  CheckmarkIcon,
} from "../components/icons";
import { playSwordClashSound, playCoinSound } from "../utils/audio";

export function TournamentsScreen({
  onStartDuel,
}: {
  onStartDuel?: () => void;
}) {
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    playCoinSound();
    setJoined(true);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between p-3 gap-2.5 overflow-hidden">
      {/* ---------------- КАРТОЧКА ТУРНИРА BULL RUN BLITZ ---------------- */}
      <div className="shrink-0 p-3.5 rounded-2xl bg-[#16212F] border border-[#27384E] shadow-[0_6px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-3">
          {/* Трофей */}
          <div className="w-14 h-14 rounded-2xl bg-[#261E16] border border-[#59431A] flex items-center justify-center shrink-0 shadow-inner">
            <TrophyIcon size={34} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EB635B]/20 border border-[#EB635B]/50 text-[#EB635B] text-[9.5px] font-black uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EB635B] animate-pulse" />
                LIVE
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#899DB5]">
                <SimpleClockIcon size={12} /> 23:14:07
              </span>
            </div>
            <h2 className="font-black text-[16px] text-white tracking-tight leading-tight">
              BULL RUN BLITZ
            </h2>
            <p className="text-[11px] font-bold text-[#F5C75D] tracking-wide">
              ПРИЗОВОЙ ФОНД: 500 000 $SIG
            </p>
          </div>
        </div>

        {/* Кнопка УЧАСТВОВАТЬ */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[11px] font-bold text-[#7E91A6]">
            Ранг 45 · <span className="text-[#5DE2B5]">топ 10%</span>
          </span>
          <button
            onClick={handleJoin}
            className={`tactile-btn px-5 py-2 rounded-xl font-black text-[12.5px] tracking-wider uppercase transition-all flex items-center gap-1.5 ${
              joined
                ? "bg-[#254F42] border border-[#3E806D] text-[#86E4C4]"
                : "bg-[#3AA89B] border border-[#5CE2D4] shadow-[0_3px_0_#226960] text-[#0A2622] hover:brightness-110"
            }`}
          >
            {joined ? (
              <>
                <CheckmarkIcon size={13} />
                <span>В ТУРНИРЕ</span>
              </>
            ) : (
              <span>УЧАСТВОВАТЬ</span>
            )}
          </button>
        </div>
      </div>

      {/* ---------------- ЛИДЕРЫ СЕЗОНА & ПЬЕДЕСТАЛ ---------------- */}
      <div className="flex-1 min-h-0 p-3 rounded-2xl bg-[#16212F] border border-[#27384E] shadow-[0_6px_20px_rgba(0,0,0,0.35)] flex flex-col justify-between overflow-hidden">
        <h3 className="font-black text-[11px] tracking-wider text-[#8A9EB5] uppercase shrink-0">
          ЛИДЕРЫ СЕЗОНА
        </h3>

        {/* Пьедестал 3D */}
        <div className="flex items-end justify-center gap-2 py-1 shrink-0">
          {/* 2 МЕСТО (Серебро) */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#A8BACD] shadow-md mb-1 relative">
              <AvatarShibaIcon size={40} />
            </div>
            <div className="w-16 h-12 rounded-t-xl bg-gradient-to-b from-[#A8BACD] to-[#677A91] border-t border-[#D5E1EE] flex flex-col items-center justify-center text-[#1C2634] font-black shadow-md">
              <MedalBadgeIcon rank={2} size={15} />
              <span className="text-[13px] mt-0.5">2</span>
            </div>
          </div>

          {/* 1 МЕСТО (Золото) */}
          <div className="flex flex-col items-center relative -top-1.5">
            <div className="absolute -top-3 z-10">
              <CrownIcon size={20} />
            </div>
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#FFE082] shadow-[0_0_12px_rgba(255,224,130,0.6)] mb-1">
              <AvatarShibaIcon size={48} />
            </div>
            <div className="w-20 h-16 rounded-t-xl bg-gradient-to-b from-[#F5BE38] to-[#996D14] border-t border-[#FFF2A3] flex flex-col items-center justify-center text-[#3D2502] font-black shadow-lg">
              <CrownIcon size={16} />
              <span className="text-[17px] font-black mt-0.5">1</span>
            </div>
          </div>

          {/* 3 МЕСТО (Бронза) */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#D99A6C] shadow-md mb-1">
              <AvatarTraderIcon size={40} />
            </div>
            <div className="w-16 h-10 rounded-t-xl bg-gradient-to-b from-[#D99A6C] to-[#80502D] border-t border-[#F2C7A8] flex flex-col items-center justify-center text-[#2D1606] font-black shadow-md">
              <MedalBadgeIcon rank={3} size={15} />
              <span className="text-[13px] mt-0.5">3</span>
            </div>
          </div>
        </div>

        {/* Список лидеров */}
        <div className="space-y-1 pt-1 border-t border-[#1F2C3F] text-[11.5px]">
          {/* Игрок 1 */}
          <div className="p-1.5 rounded-xl bg-[#1A2636] border border-[#27384E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-[#5DE2B5] w-4 text-center">1</span>
              <div className="w-6 h-6 rounded-md overflow-hidden">
                <AvatarShibaIcon size={24} />
              </div>
              <span className="font-extrabold text-white">@trader_pro</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-[#F5C75D]">2 450</span>
              <ShieldIcon size={14} className="text-[#A8BACD]" />
            </div>
          </div>

          {/* Игрок 2 */}
          <div className="p-1.5 rounded-xl bg-[#1A2636] border border-[#27384E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-[#7E91A6] w-4 text-center">2</span>
              <div className="w-6 h-6 rounded-md overflow-hidden">
                <AvatarKnightIcon size={24} />
              </div>
              <span className="font-extrabold text-[#D5E1EE]">@crypto_knight</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-[#D5E1EE]">2 450</span>
              <ShieldIcon size={14} className="text-[#F5BE38]" />
            </div>
          </div>

          {/* Игрок 3 */}
          <div className="p-1.5 rounded-xl bg-[#1A2636] border border-[#27384E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-[#7E91A6] w-4 text-center">3</span>
              <div className="w-6 h-6 rounded-md overflow-hidden bg-[#322A45] flex items-center justify-center text-[#A58FF0]">
                <WhaleIcon size={18} />
              </div>
              <span className="font-extrabold text-[#D5E1EE]">@whale_hunter</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-[#D5E1EE]">1 350</span>
              <ShieldIcon size={14} className="text-[#D99A6C]" />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- НИЖНИЙ БЛОК: ЕЖЕНЕДЕЛЬНАЯ ЛИГА & ДУЭЛЬ 1 НА 1 ---------------- */}
      <div className="shrink-0 grid grid-cols-2 gap-2.5">
        {/* Еженедельная лига */}
        <div className="p-3 rounded-2xl bg-[#16212F] border border-[#27384E] flex flex-col justify-between">
          <div>
            <p className="font-black text-[10px] text-[#7E91A6] uppercase tracking-wider">
              ЕЖЕНЕДЕЛЬНАЯ ЛИГА
            </p>
            <p className="font-black text-[12px] text-white mt-0.5">
              Лига II → Лига I
            </p>
          </div>
          {/* Индикатор лиги */}
          <div className="w-full h-2 rounded-full bg-[#1C293A] overflow-hidden mt-2 border border-[#293B52]">
            <div className="h-full bg-gradient-to-r from-[#3AA89B] to-[#5DE2B5] rounded-full" style={{ width: "65%" }} />
          </div>
        </div>

        {/* Дуэль 1 на 1 со скрещёнными свечами-мечами */}
        <div className="p-3 rounded-2xl bg-[#16212F] border border-[#27384E] flex items-center justify-between gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#233549] border border-[#3A506C] flex items-center justify-center shrink-0">
            <CrossedCandlestickSwordsIcon size={24} />
          </div>
          <div className="flex flex-col items-end">
            <span className="font-black text-[10.5px] text-white uppercase tracking-wider">
              ДУЭЛЬ 1 НА 1
            </span>
            <button
              onClick={() => {
                playSwordClashSound();
                onStartDuel?.();
              }}
              className="tactile-btn mt-1 px-3 py-1 rounded-lg bg-[#3F5570] border border-[#597496] shadow-[0_2px_0_#212E3D] text-[10.5px] font-black text-white uppercase hover:brightness-110"
            >
              ВЫЗОВ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
