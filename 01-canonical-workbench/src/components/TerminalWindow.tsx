import { useState, useEffect } from "react";
import {
  CandlestickChartIcon,
  NewspaperIcon,
  OrderBookIcon,
  WhaleIcon,
  CalendarIcon,
  ChatBubbleIcon,
  PlusIcon,
  LightningZapIcon,
  BankPillarsIcon,
} from "./icons";
import { playTabSound } from "../utils/audio";

export type TerminalTab = "chart" | "news" | "orderbook" | "whale" | "calendar" | "chat";

export type TerminalWindowProps = {
  currentTab?: TerminalTab;
  onTabChange?: (tab: TerminalTab) => void;
  selectedTimeframe?: string;
  onTimeframeChange?: (tf: string) => void;
  scenarioTitle?: string;
  className?: string;
};

export function TerminalWindow({
  currentTab = "chart",
  onTabChange,
  selectedTimeframe = "15M",
  onTimeframeChange,
  scenarioTitle = "BTC/USDT",
  className = "",
}: TerminalWindowProps) {
  const [activeTab, setActiveTab] = useState<TerminalTab>(currentTab);
  const [activeTf, setActiveTf] = useState(selectedTimeframe);
  const [whaleFlicker, setWhaleFlicker] = useState(false);

  // Синхронизация при внешнем изменении
  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  // Небольшая живая анимация стакана
  useEffect(() => {
    const timer = setInterval(() => {
      setWhaleFlicker((prev) => !prev);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleTabClick = (tab: TerminalTab) => {
    playTabSound();
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const handleTfClick = (tf: string) => {
    playTabSound();
    setActiveTf(tf);
    onTimeframeChange?.(tf);
  };

  return (
    <div
      className={`w-full rounded-2xl bg-[#141E2C] border border-[#27384E] shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden flex flex-col ${className}`}
    >
      {/* ---------------- Верхняя панель окна macOS Style ---------------- */}
      <div className="shrink-0 h-10 px-3 bg-[#111A26] border-b border-[#1F2C3F] flex items-center justify-between gap-2">
        {/* 3 цветные точки macOS */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EB635B] shadow-[0_0_4px_#EB635B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F5BE38] shadow-[0_0_4px_#F5BE38]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#50C890] shadow-[0_0_4px_#50C890]" />
        </div>

        {/* Набор вкладок */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {/* Вкладка 1: Свечи */}
          <button
            onClick={() => handleTabClick("chart")}
            className={`tactile-btn flex items-center justify-center w-8 h-7 rounded-lg transition-all ${
              activeTab === "chart"
                ? "bg-[#23433C] text-[#5DE2B5] border border-[#3A7566] shadow-[0_0_10px_rgba(80,200,144,0.3)]"
                : "text-[#7B8EA6] hover:text-[#C5D3E3]"
            }`}
            title="График японских свечей"
          >
            <CandlestickChartIcon size={18} />
          </button>

          {/* Вкладка 2: Новости */}
          <button
            onClick={() => handleTabClick("news")}
            className={`tactile-btn flex items-center justify-center w-8 h-7 rounded-lg transition-all ${
              activeTab === "news"
                ? "bg-[#23433C] text-[#5DE2B5] border border-[#3A7566] shadow-[0_0_10px_rgba(80,200,144,0.3)]"
                : "text-[#7B8EA6] hover:text-[#C5D3E3]"
            }`}
            title="Лента новостей и нарративы"
          >
            <NewspaperIcon size={17} />
          </button>

          {/* Вкладка 3: Стакан ордеров (DOM) */}
          <button
            onClick={() => handleTabClick("orderbook")}
            className={`tactile-btn flex items-center justify-center w-8 h-7 rounded-lg transition-all ${
              activeTab === "orderbook"
                ? "bg-[#23433C] text-[#5DE2B5] border border-[#3A7566] shadow-[0_0_10px_rgba(80,200,144,0.3)]"
                : "text-[#7B8EA6] hover:text-[#C5D3E3]"
            }`}
            title="Биржевой стакан и плотности"
          >
            <OrderBookIcon size={17} />
          </button>

          {/* Вкладка 4: Кит / On-chain */}
          <button
            onClick={() => handleTabClick("whale")}
            className={`tactile-btn flex items-center justify-center w-8 h-7 rounded-lg transition-all ${
              activeTab === "whale"
                ? "bg-[#23433C] text-[#5DE2B5] border border-[#3A7566] shadow-[0_0_10px_rgba(80,200,144,0.3)]"
                : "text-[#7B8EA6] hover:text-[#C5D3E3]"
            }`}
            title="Китовый радар крупных кошельков"
          >
            <WhaleIcon size={17} />
          </button>

          {/* Вкладка 5: Календарь */}
          <button
            onClick={() => handleTabClick("calendar")}
            className={`tactile-btn flex items-center justify-center w-8 h-7 rounded-lg transition-all ${
              activeTab === "calendar"
                ? "bg-[#23433C] text-[#5DE2B5] border border-[#3A7566] shadow-[0_0_10px_rgba(80,200,144,0.3)]"
                : "text-[#7B8EA6] hover:text-[#C5D3E3]"
            }`}
            title="Экономический календарь"
          >
            <CalendarIcon size={17} />
          </button>

          {/* Вкладка 6: Чат */}
          <button
            onClick={() => handleTabClick("chat")}
            className={`tactile-btn flex items-center justify-center w-8 h-7 rounded-lg transition-all ${
              activeTab === "chat"
                ? "bg-[#23433C] text-[#5DE2B5] border border-[#3A7566] shadow-[0_0_10px_rgba(80,200,144,0.3)]"
                : "text-[#7B8EA6] hover:text-[#C5D3E3]"
            }`}
            title="Чат арены и настроения"
          >
            <ChatBubbleIcon size={16} />
          </button>

          {/* Дополнительная иконка плюс */}
          <button
            onClick={() => handleTabClick("chart")}
            className="w-6 h-6 flex items-center justify-center text-[#556980] hover:text-white"
          >
            <PlusIcon size={14} />
          </button>
        </div>
      </div>

      {/* ---------------- Содержимое терминала ---------------- */}
      <div className="p-3 min-h-[178px] flex flex-col justify-between">
        {/* ================= 1. ГРАФИК СВЕЧЕЙ (Скриншот 3) ================= */}
        {activeTab === "chart" && (
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between text-[13px] font-black text-[#8FA2BA] mb-2 px-1">
              <span>{scenarioTitle} · {activeTf}</span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#50C890] bg-[#163327] px-2.5 py-0.5 rounded-full border border-[#235841]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#50C890] animate-pulse" />
                LIVE ТЕСТ
              </span>
            </div>

            {/* Японские свечи с неоновым свечением и прицелом */}
            <div className="relative w-full h-[105px] flex items-center justify-center">
              <svg
                viewBox="0 0 320 100"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                {/* Горизонтальная линия поддержки / уровня пробоя */}
                <line
                  x1="10"
                  y1="68"
                  x2="310"
                  y2="68"
                  stroke="#47627F"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />

                {/* Свеча 1: зелёная */}
                <line x1="30" y1="45" x2="30" y2="85" stroke="#50C890" strokeWidth="1.6" />
                <rect x="25" y="52" width="10" height="28" rx="2.5" fill="#50C890" className="candle-glow-green" />

                {/* Свеча 2: зелёная */}
                <line x1="55" y1="35" x2="55" y2="78" stroke="#50C890" strokeWidth="1.6" />
                <rect x="50" y="42" width="10" height="32" rx="2.5" fill="#50C890" className="candle-glow-green" />

                {/* Свеча 3: красная откат */}
                <line x1="80" y1="46" x2="80" y2="72" stroke="#EB635B" strokeWidth="1.6" />
                <rect x="75" y="50" width="10" height="18" rx="2.5" fill="#EB635B" className="candle-glow-red" />

                {/* Свеча 4: зелёная импульс */}
                <line x1="105" y1="28" x2="105" y2="65" stroke="#50C890" strokeWidth="1.6" />
                <rect x="100" y="32" width="10" height="28" rx="2.5" fill="#50C890" className="candle-glow-green" />

                {/* Свеча 5: красная */}
                <line x1="130" y1="36" x2="130" y2="62" stroke="#EB635B" strokeWidth="1.6" />
                <rect x="125" y="40" width="10" height="18" rx="2.5" fill="#EB635B" className="candle-glow-red" />

                {/* Свеча 6: красная возврат */}
                <line x1="155" y1="42" x2="155" y2="76" stroke="#EB635B" strokeWidth="1.6" />
                <rect x="150" y="46" width="10" height="24" rx="2.5" fill="#EB635B" className="candle-glow-red" />

                {/* Свеча 7: зелёная разворотная */}
                <line x1="180" y1="32" x2="180" y2="68" stroke="#50C890" strokeWidth="1.6" />
                <rect x="175" y="36" width="10" height="26" rx="2.5" fill="#50C890" className="candle-glow-green" />

                {/* Свеча 8: красная локальная вершина */}
                <line x1="205" y1="26" x2="205" y2="58" stroke="#EB635B" strokeWidth="1.6" />
                <rect x="200" y="30" width="10" height="22" rx="2.5" fill="#EB635B" className="candle-glow-red" />

                {/* Свеча 9: красная большая свеча вниз */}
                <line x1="230" y1="32" x2="230" y2="75" stroke="#EB635B" strokeWidth="1.6" />
                <rect x="225" y="38" width="10" height="32" rx="2.5" fill="#EB635B" className="candle-glow-red" />

                {/* Свеча 10: зелёная свеча попытки пробоя */}
                <line x1="255" y1="20" x2="255" y2="65" stroke="#50C890" strokeWidth="1.6" />
                <rect x="250" y="24" width="10" height="32" rx="2.5" fill="#50C890" className="candle-glow-green" />

                {/* Свеча 11: красная свеча пробоя уровня БЕЗ ОБЪЁМА */}
                <line x1="280" y1="24" x2="280" y2="70" stroke="#EB635B" strokeWidth="1.6" />
                <rect x="275" y="28" width="10" height="34" rx="2.5" fill="#EB635B" className="candle-glow-red" />

                {/* Прицел / Таргет Арены на ключевой точке */}
                <g transform="translate(295, 64)">
                  <circle cx="0" cy="0" r="8" fill="none" stroke="#45A577" strokeWidth="2" opacity="0.9" />
                  <circle cx="0" cy="0" r="3.5" fill="#45A577" />
                  <line x1="-11" y1="0" x2="11" y2="0" stroke="#45A577" strokeWidth="1.4" />
                  <line x1="0" y1="-11" x2="0" y2="11" stroke="#45A577" strokeWidth="1.4" />
                </g>
              </svg>
            </div>

            {/* Таймфреймы внизу окна */}
            <div className="flex items-center justify-between pt-1 border-t border-[#1C2839] px-1 text-[11px] font-bold text-[#7B8EA6]">
              <div className="flex items-center gap-2">
                {["15M", "1Ч", "4Ч", "1Д"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => handleTfClick(tf)}
                    className={`px-2 py-0.5 rounded-md transition ${
                      activeTf === tf
                        ? "bg-[#25394E] text-[#67E6B2] font-black"
                        : "hover:text-white"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-[#556980]">Vol: 1.48M (НИЗКИЙ)</span>
            </div>
          </div>
        )}

        {/* ================= 2. СТАКАН ОРДЕРОВ / DOM (Скриншот 1 & 5) ================= */}
        {activeTab === "orderbook" && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[13px] font-black text-[#A0B2C6] mb-1">
              <span>{scenarioTitle}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1A2636] border border-[#27384E] text-[#8BA0B8]">
                СПРЕД 0.02%
              </span>
            </div>

            {/* Красные бары продавцов (Asks) */}
            <div className="flex flex-col gap-1">
              <div className="relative w-full h-5 rounded-md overflow-hidden bg-[#221B24] flex items-center justify-center">
                <div className="absolute inset-y-0 right-0 bg-[#D95D56] opacity-90 rounded-md" style={{ width: "90%" }} />
                <span className="relative z-10 text-[11px] font-black text-white tracking-wider">67 840</span>
              </div>
              <div className="relative w-full h-5 rounded-md overflow-hidden bg-[#221B24] flex items-center justify-center">
                <div className="absolute inset-y-0 right-0 bg-[#D95D56] opacity-90 rounded-md" style={{ width: "70%" }} />
                <span className="relative z-10 text-[11px] font-black text-white tracking-wider">67 832</span>
              </div>
              <div className="relative w-full h-5 rounded-md overflow-hidden bg-[#221B24] flex items-center justify-center">
                <div className="absolute inset-y-0 right-0 bg-[#D95D56] opacity-90 rounded-md" style={{ width: "55%" }} />
                <span className="relative z-10 text-[11px] font-black text-white tracking-wider">67 825</span>
              </div>
            </div>

            {/* Фиолетовая полоса: КИТОВАЯ СТЕНА */}
            <div
              className={`w-full py-1.5 px-3 rounded-md bg-[#7D64B5] flex items-center gap-2 text-white font-black text-[12px] tracking-wide transition-all ${
                whaleFlicker ? "brightness-110 shadow-[0_0_12px_rgba(125,100,181,0.6)]" : ""
              }`}
            >
              <WhaleIcon size={16} />
              <span>КИТОВАЯ СТЕНА (1 850 BTC)</span>
            </div>

            {/* Зелёные бары покупателей (Bids) */}
            <div className="flex flex-col gap-1">
              <div className="relative w-full h-5 rounded-md overflow-hidden bg-[#152324] flex items-center justify-center">
                <div className="absolute inset-y-0 left-0 bg-[#359B6A] opacity-90 rounded-md" style={{ width: "58%" }} />
                <span className="relative z-10 text-[11px] font-black text-white tracking-wider">67 810</span>
              </div>
              <div className="relative w-full h-5 rounded-md overflow-hidden bg-[#152324] flex items-center justify-center">
                <div className="absolute inset-y-0 left-0 bg-[#359B6A] opacity-90 rounded-md" style={{ width: "42%" }} />
                <span className="relative z-10 text-[11px] font-black text-white tracking-wider">67 802</span>
              </div>
              <div className="relative w-full h-5 rounded-md overflow-hidden bg-[#152324] flex items-center justify-center">
                <div className="absolute inset-y-0 left-0 bg-[#359B6A] opacity-90 rounded-md" style={{ width: "80%" }} />
                <span className="relative z-10 text-[11px] font-black text-white tracking-wider">67 795</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. ЛЕНТА НОВОСТЕЙ (Скриншот 2) ================= */}
        {activeTab === "news" && (
          <div className="flex flex-col gap-2">
            {/* Новость 1: Паника */}
            <div className="p-2 rounded-xl bg-[#182332] border border-[#25364B] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#3F2B32] border border-[#6B373A] flex items-center justify-center text-[#EB635B] shrink-0">
                  <LightningZapIcon size={16} />
                </div>
                <div className="truncate">
                  <p className="font-extrabold text-[11.5px] text-[#F0F4F8] leading-tight truncate">
                    БИРЖА ЗАМОРОЗИЛА ВЫВОДЫ
                  </p>
                  <span className="text-[9.5px] font-bold text-[#7E91A6]">14:32 · On-chain panic</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#EB635B]/20 border border-[#EB635B]/50 text-[#EB635B] text-[9.5px] font-black uppercase shrink-0">
                ПАНИКА
              </span>
            </div>

            {/* Новость 2: Кит */}
            <div className="p-2 rounded-xl bg-[#182332] border border-[#25364B] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#312B45] border border-[#524177] flex items-center justify-center text-[#A58FF0] shrink-0">
                  <WhaleIcon size={16} />
                </div>
                <div className="truncate">
                  <p className="font-extrabold text-[11.5px] text-[#F0F4F8] leading-tight truncate">
                    КИТ ПЕРЕВЁЛ 800 BTC
                  </p>
                  <span className="text-[9.5px] font-bold text-[#7E91A6]">14:32 · Wallet to Binance</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#8B72D4]/20 border border-[#8B72D4]/50 text-[#A58FF0] text-[9.5px] font-black uppercase shrink-0">
                КИТ
              </span>
            </div>

            {/* Новость 3: Фундамент */}
            <div className="p-2 rounded-xl bg-[#182332] border border-[#25364B] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#3B3423] border border-[#6B5B2E] flex items-center justify-center text-[#F5C75D] shrink-0">
                  <BankPillarsIcon size={16} />
                </div>
                <div className="truncate">
                  <p className="font-extrabold text-[11.5px] text-[#F0F4F8] leading-tight truncate">
                    РЕГУЛЯТОР: НОВЫЕ ПРАВИЛА
                  </p>
                  <span className="text-[9.5px] font-bold text-[#7E91A6]">14:32 · SEC Statement</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#E2A93B]/20 border border-[#E2A93B]/50 text-[#F5C75D] text-[9.5px] font-black uppercase shrink-0">
                ФУНДАМЕНТ
              </span>
            </div>
          </div>
        )}

        {/* ================= 4. КИТОВЫЙ РАДАР (On-chain) ================= */}
        {activeTab === "whale" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-black text-[#A0B2C6] px-1">
              <span>ON-CHAIN АКТИВНОСТЬ</span>
              <span className="text-[#A58FF0] font-bold">ПОСЛЕДНИЕ 10 МИНУТ</span>
            </div>
            <div className="space-y-1.5">
              <div className="p-2 rounded-xl bg-[#1A2536] border border-[#2B3E57] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#EB635B]" />
                  <span className="font-bold text-white">1,420 BTC → Binance</span>
                </div>
                <span className="font-mono text-[#D95D56] font-bold">ДАВЛЕНИЕ ПРОДАЖ</span>
              </div>
              <div className="p-2 rounded-xl bg-[#1A2536] border border-[#2B3E57] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#50C890]" />
                  <span className="font-bold text-white">Cold Storage ← 3,100 BTC</span>
                </div>
                <span className="font-mono text-[#50C890] font-bold">НАКОПЛЕНИЕ</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. КАЛЕНДАРЬ ================= */}
        {activeTab === "calendar" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-black text-[#A0B2C6] px-1">
              <span>МАКРО-СОБЫТИЯ СЕГОДНЯ</span>
              <span className="text-[#F5BE38]">ВЫСОКАЯ ВОЛАТИЛЬНОСТЬ</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="p-2 rounded-xl bg-[#1A2536] border border-[#2B3E57] flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-white">Решение по ставке ФРС (FOMC)</p>
                  <span className="text-[10px] text-[#7E91A6]">Через 2 часа 14 минут</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#EB635B]/20 text-[#EB635B] font-black text-[10px]">
                  CRITICAL
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. ЧАТ АРЕНЫ ================= */}
        {activeTab === "chat" && (
          <div className="flex flex-col gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-[#1A2536] border border-[#2B3E57]">
              <span className="font-black text-[#5DE2B5]">@crypto_knight:</span>{" "}
              <span className="text-[#C5D3E3]">Пробой без объёма в стену 67.8k! Не вздумайте лонговать на хаях!</span>
            </div>
            <div className="p-2 rounded-xl bg-[#1A2536] border border-[#2B3E57]">
              <span className="font-black text-[#F5C75D]">@whale_hunter:</span>{" "}
              <span className="text-[#C5D3E3]">Жду ретест и поглощение. Стену кита не снимут без объема.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
