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
export type ChartStyle = "candles" | "volume" | "area" | "minimal";

export type TerminalWindowProps = {
  currentTab?: TerminalTab;
  onTabChange?: (tab: TerminalTab) => void;
  selectedTimeframe?: string;
  onTimeframeChange?: (tf: string) => void;
  scenarioTitle?: string;
  chartStyle?: ChartStyle;
  tint?: string;
  showReveal?: boolean;
  className?: string;
};

export function TerminalWindow({
  currentTab = "chart",
  onTabChange,
  selectedTimeframe = "15M",
  onTimeframeChange,
  scenarioTitle = "BTC/USDT",
  chartStyle = "candles",
  tint = "#2EE6C8",
  showReveal = false,
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
      className={`c2d-panel w-full overflow-hidden flex flex-col ${className}`}
    >
      {/* ---------------- Верхняя панель окна macOS Style ---------------- */}
      <div
        className="terminal-toolbar shrink-0 px-3 border-b-2 border-[#0E1723] flex items-center justify-between gap-2"
        style={{
          background: "linear-gradient(180deg,#2C3F5A 0%,#1B2839 100%)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,.16)",
        }}
      >
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
            className={`tactile-btn flex items-center justify-center w-9 h-11 rounded-lg transition-all ${
              activeTab === "chart"
                ? "bg-[#23433C] text-[#5DE2B5] border border-[#3A7566] shadow-[0_0_10px_rgba(80,200,144,0.3)]"
                : "text-[#7B8EA6] active:text-[#C5D3E3]"
            }`}
            title="График японских свечей"
          >
            <CandlestickChartIcon size={18} />
          </button>

          {/* Вкладка 2: Новости */}
          <button
            onClick={() => handleTabClick("news")}
            className={`tactile-btn flex items-center justify-center w-9 h-11 rounded-lg transition-all ${
              activeTab === "news"
                ? "bg-[#23433C] text-[#5DE2B5] border border-[#3A7566] shadow-[0_0_10px_rgba(80,200,144,0.3)]"
                : "text-[#7B8EA6] active:text-[#C5D3E3]"
            }`}
            title="Лента новостей и нарративы"
          >
            <NewspaperIcon size={17} />
          </button>

          {/* Вкладка 3: Стакан ордеров (DOM) */}
          <button
            onClick={() => handleTabClick("orderbook")}
            className={`tactile-btn flex items-center justify-center w-9 h-11 rounded-lg transition-all ${
              activeTab === "orderbook"
                ? "bg-[#23433C] text-[#5DE2B5] border border-[#3A7566] shadow-[0_0_10px_rgba(80,200,144,0.3)]"
                : "text-[#7B8EA6] active:text-[#C5D3E3]"
            }`}
            title="Биржевой стакан и плотности"
          >
            <OrderBookIcon size={17} />
          </button>

          {/* Вкладка 4: Кит / On-chain */}
          <button
            onClick={() => handleTabClick("whale")}
            className={`tactile-btn flex items-center justify-center w-9 h-11 rounded-lg transition-all ${
              activeTab === "whale"
                ? "bg-[#23433C] text-[#5DE2B5] border border-[#3A7566] shadow-[0_0_10px_rgba(80,200,144,0.3)]"
                : "text-[#7B8EA6] active:text-[#C5D3E3]"
            }`}
            title="Китовый радар крупных кошельков"
          >
            <WhaleIcon size={17} />
          </button>

          {/* Вкладка 5: Календарь */}
          <button
            onClick={() => handleTabClick("calendar")}
            className={`tactile-btn flex items-center justify-center w-9 h-11 rounded-lg transition-all ${
              activeTab === "calendar"
                ? "bg-[#23433C] text-[#5DE2B5] border border-[#3A7566] shadow-[0_0_10px_rgba(80,200,144,0.3)]"
                : "text-[#7B8EA6] active:text-[#C5D3E3]"
            }`}
            title="Экономический календарь"
          >
            <CalendarIcon size={17} />
          </button>

          {/* Вкладка 6: Чат */}
          <button
            onClick={() => handleTabClick("chat")}
            className={`tactile-btn flex items-center justify-center w-9 h-11 rounded-lg transition-all ${
              activeTab === "chat"
                ? "bg-[#23433C] text-[#5DE2B5] border border-[#3A7566] shadow-[0_0_10px_rgba(80,200,144,0.3)]"
                : "text-[#7B8EA6] active:text-[#C5D3E3]"
            }`}
            title="Чат арены и настроения"
          >
            <ChatBubbleIcon size={16} />
          </button>

          {/* Дополнительная иконка плюс */}
          <button
            onClick={() => handleTabClick("chart")}
            className="hidden tactile-btn w-11 h-11 items-center justify-center text-[#556980] active:text-white"
          >
            <PlusIcon size={14} />
          </button>
        </div>
      </div>

      {/* ---------------- Содержимое терминала ---------------- */}
      <div className="terminal-body min-h-[178px] flex-1 flex flex-col justify-between">
        {/* ================= 1. ГРАФИК СВЕЧЕЙ (Скриншот 3) ================= */}
        {activeTab === "chart" && (
          <div className="flex flex-col h-full min-h-0 justify-between">
            <div className="flex items-center justify-between text-[13px] font-black text-[#8FA2BA] mb-2 px-1">
              <span>{scenarioTitle} · {activeTf}</span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#50C890] bg-[#163327] px-2.5 py-0.5 rounded-full border border-[#235841]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#50C890] animate-pulse" />
                LIVE ТЕСТ
              </span>
            </div>

            {/* Японские свечи с неоновым свечением, объёмом, шкалой и прицелом */}
            <div className="terminal-chart-plane relative w-full flex-1">
              <svg
                viewBox="0 0 320 100"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tint} stopOpacity="0.38" />
                    <stop offset="100%" stopColor={tint} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Сетка */}
                {[25, 50, 75].map((y) => (
                  <line key={y} x1="10" y1={y} x2="310" y2={y} stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1" />
                ))}

                {/* Горизонтальная линия уровня пробоя */}
                <line x1="10" y1="68" x2="310" y2="68" stroke="#47627F" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.8" />

                {/* Данные свечи: [x, o, c, h, l] */}
                {(() => {
                  const C = [
                    [30, 80, 52, 45, 85],
                    [55, 74, 42, 35, 78],
                    [80, 50, 68, 46, 72],
                    [105, 60, 32, 28, 65],
                    [130, 40, 58, 36, 62],
                    [155, 46, 70, 42, 76],
                    [180, 62, 36, 32, 68],
                    [205, 30, 52, 26, 58],
                    [230, 38, 70, 32, 75],
                    [255, 56, 24, 20, 65],
                    [280, 28, 62, 24, 70],
                  ];
                  return C.map(([x, o, c, h, l], i) => {
                    const up = c <= o;
                    const col = up ? "#50C890" : "#EB635B";
                    const glow = up ? "candle-glow-green" : "candle-glow-red";
                    const isLast = i === C.length - 1;

                    // Future candles do not exist in the pre-decision DOM.
                    if (!showReveal && i >= 8) return null;

                    if (chartStyle === "area" || chartStyle === "minimal") {
                      return null; // линия рисуется отдельно ниже
                    }
                    return (
                      <g key={i}>
                        <line x1={x} y1={h} x2={x} y2={l} stroke={col} strokeWidth="1.6" />
                        <rect x={x - 5} y={Math.min(o, c)} width="10" height={Math.max(3, Math.abs(o - c))} rx="2.5" fill={col} className={glow} />
                        {/* Объёмный бар под свечой */}
                        {chartStyle === "volume" && (
                          <rect
                            x={x - 4}
                            y={96 - (up ? 8 : 5) - (i % 3) * 2}
                            width="8"
                            height={(up ? 8 : 5) + (i % 3) * 2}
                            rx="1.5"
                            fill={col}
                            opacity="0.5"
                          />
                        )}
                        {isLast && showReveal && (
                          <g transform={`translate(${x}, ${c})`}>
                            <circle r="8" fill="none" stroke={tint} strokeWidth="2" opacity="0.9" />
                            <circle r="3.5" fill={tint} />
                            <line x1="-11" x2="11" y1="0" y2="0" stroke={tint} strokeWidth="1.4" />
                            <line y1="-11" y2="11" x1="0" x2="0" stroke={tint} strokeWidth="1.4" />
                          </g>
                        )}
                      </g>
                    );
                  });
                })()}

                {/* Линейные режимы area / minimal */}
                {(chartStyle === "area" || chartStyle === "minimal") && (
                  <>
                    <path
                      d={showReveal
                        ? "M30 66 L55 58 L80 64 L105 47 L130 55 L155 62 L180 49 L205 41 L230 54 L255 40 L280 45"
                        : "M30 66 L55 58 L80 64 L105 47 L130 55 L155 62 L180 49 L205 41"}
                      fill="none"
                      stroke={tint}
                      strokeWidth={chartStyle === "minimal" ? "1.4" : "2.2"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={chartStyle === "minimal" ? "3 4" : undefined}
                      style={{ filter: `drop-shadow(0 0 5px ${tint})` }}
                    />
                    {chartStyle === "area" && showReveal && (
                      <path
                        d="M30 66 L55 58 L80 64 L105 47 L130 55 L155 62 L180 49 L205 41 L230 54 L255 40 L280 45 L280 96 L30 96 Z"
                        fill="url(#area-fill)"
                      />
                    )}
                    <g transform={showReveal ? "translate(280, 45)" : "translate(205, 41)"}>
                      <circle r="4" fill={tint} />
                      <circle r="7.5" fill="none" stroke={tint} strokeWidth="1.6" opacity="0.8" />
                    </g>
                  </>
                )}
              </svg>

              {!showReveal && (
                <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[30%] border-l border-dashed border-[#405A76] bg-[#0B131F]/90 grid place-items-center">
                  <span className="font-mono text-[7px] font-black tracking-[0.16em] text-[#536D89] -rotate-90 whitespace-nowrap">
                    БУДУЩЕЕ СКРЫТО
                  </span>
                </div>
              )}

              {/* Reveal scan-линия поверх графика */}
              {showReveal && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div
                    className="reveal-scanline absolute inset-x-0 h-1/3"
                    style={{ background: `linear-gradient(to bottom, transparent, ${tint}33, transparent)` }}
                  />
                </div>
              )}

              {/* Ценовые метки справа */}
              <div className="pointer-events-none absolute right-0 top-0 flex h-full flex-col justify-between py-0.5 font-mono text-[8px] font-bold text-[#5F7792]">
                <span>67.9K</span>
                <span>67.8K</span>
                <span>67.7K</span>
              </div>
            </div>

            {/* Таймфреймы внизу окна */}
            <div className="flex items-center justify-between pt-1 border-t border-[#1C2839] px-1 text-[11px] font-bold text-[#7B8EA6]">
              <div className="flex items-center gap-2">
                {["15M", "1Ч", "4Ч", "1Д"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => handleTfClick(tf)}
                    className={`tactile-btn min-h-11 px-2 rounded-md transition ${
                      activeTf === tf
                        ? "bg-[#25394E] text-[#67E6B2] font-black"
                        : "text-[#7B8EA6] active:text-white"
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
