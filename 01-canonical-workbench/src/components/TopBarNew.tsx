import { CoinIcon, BellIcon, GearIcon } from "./icons";
import { playTapSound } from "../utils/audio";

export type TopBarProps = {
  xp?: number;
  xpMax?: number;
  coins?: number;
  hasUnread?: boolean;
  onBellClick?: () => void;
  onGearClick?: () => void;
  onXpClick?: () => void;
};

export function TopBarNew({
  xp = 680,
  xpMax = 1000,
  coins = 1240,
  hasUnread = true,
  onBellClick,
  onGearClick,
  onXpClick,
}: TopBarProps) {
  return (
    <header className="shrink-0 w-full px-3 pt-2.5 pb-2 flex items-center justify-between gap-2">
      {/* Левая плашка: XP 680/1000 */}
      <button
        onClick={() => {
          playTapSound();
          onXpClick?.();
        }}
        className="tactile-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#182828] border border-[#2B4E47] shadow-[0_3px_0_#132420,inset_0_1px_0_rgba(255,255,255,0.15)] text-left"
        title="Текущий опыт и уровень"
      >
        <span className="w-5 h-5 rounded-full bg-[#357563] flex items-center justify-center text-[10px] font-black text-[#D7F7EB]">
          XP
        </span>
        <span className="font-extrabold text-[13px] tracking-tight text-[#E1F3ED]">
          {xp}/{xpMax}
        </span>
      </button>

      {/* Центральная плашка: Монеты 1 240 */}
      <div
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#182230] border border-[#27384E] shadow-[0_3px_0_#121A25,inset_0_1px_0_rgba(255,255,255,0.15)]"
        title="Баланс турнирных монет"
      >
        <CoinIcon size={20} />
        <span className="font-black text-[14px] tracking-wide text-[#F8E39D]">
          {coins.toLocaleString("ru-RU")}
        </span>
      </div>

      {/* Правая секция: Колокольчик с бейджем и Настройки */}
      <div className="flex items-center gap-2">
        {/* Кнопка уведомлений */}
        <button
          onClick={() => {
            playTapSound();
            onBellClick?.();
          }}
          className="tactile-btn relative w-9 h-9 rounded-full bg-[#182230] border border-[#27384E] shadow-[0_3px_0_#121A25,inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center text-[#95A7BD] hover:text-white"
          title="Уведомления"
        >
          <BellIcon size={18} />
          {hasUnread && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#EB635B] border-2 border-[#182230] shadow-[0_0_6px_#EB635B]" />
          )}
        </button>

        {/* Кнопка настроек */}
        <button
          onClick={() => {
            playTapSound();
            onGearClick?.();
          }}
          className="tactile-btn w-9 h-9 rounded-full bg-[#182230] border border-[#27384E] shadow-[0_3px_0_#121A25,inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center text-[#95A7BD] hover:text-white"
          title="Настройки звука и интерфейса"
        >
          <GearIcon size={18} />
        </button>
      </div>
    </header>
  );
}
