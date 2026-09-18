import { useState } from "react";
import {
  IconCandlesTab,
  IconNewsTab,
  IconOrderbookTab,
  IconWhale,
  IconCalendarTab,
  IconChatTab,
  IconTrophy,
  AvatarDoge,
  AvatarKnight,
  AvatarWhale,
  AvatarQueen,
  IconDualSwords,
} from "./Icons";
import { haptic, sfx } from "../lib/feel";

export type TerminalTab = "candles" | "news" | "depth" | "whale" | "tournaments" | "calendar" | "chat";

interface TerminalCardProps {
  initialTab?: TerminalTab;
  onAction?: (actionId: string) => void;
  targetHit?: boolean;
  onTargetClick?: () => void;
  /** Тап по графику мимо цели — нужен мягкий feedback без наказания */
  onChartMiss?: () => void;
  revealed?: boolean;

  /** Незнакомый актив: пропуск не штрафуется */
  unfamiliar?: boolean;
  timeframe?: "15M" | "1Ч" | "1Д";
  onTimeframeChange?: (tf: "15M" | "1Ч" | "1Д") => void;
}

export function TerminalCard({
  initialTab = "candles",
  onTargetClick,
  onChartMiss,
  revealed = false,
  unfamiliar = false,
  timeframe = "15M",
  onTimeframeChange,
}: TerminalCardProps) {
  const [activeTab, setActiveTab] = useState<TerminalTab>(initialTab);
  const [selectedNews, setSelectedNews] = useState<number>(2); // 2 = Регулятор: новые правила
  const [, setOrderbookDepth] = useState<number>(67810);

  const selectTab = (tab: TerminalTab) => {
    haptic("select");
    sfx.select();
    setActiveTab(tab);
  };

  return (
    <div className="w-full h-full min-h-0 rounded-[24px] bg-[#162036] border-[2px] border-[#253352] shadow-[0_12px_28px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col overflow-hidden transition-all duration-300">
      {/* Top macOS-style Terminal Bar */}
      <div className="flex items-center justify-between px-3.5 pt-2.5 pb-2 bg-[#121b2f] border-b border-[#22304d]">
        {/* Traffic Light Dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f87171] shadow-[0_0_5px_rgba(248,113,113,0.7)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shadow-[0_0_5px_rgba(251,191,36,0.7)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] shadow-[0_0_5px_rgba(74,222,128,0.7)]" />
        </div>

        {/* Terminal Header Tabs — горизонтальный скролл на узких экранах; во время урока заблокированы */}
        <div
          className="flex items-center gap-1 bg-[#0d1424] p-0.5 rounded-[12px] border border-[#1e2c47] overflow-x-auto thin-scroll"
          style={{ scrollbarWidth: "none" }}
        >
          {/* 1. Candles tab */}
          <button
            onClick={() => selectTab("candles")}
            className={`term-tab p-1.5 rounded-[9px] transition-all ${
              activeTab === "candles"
                ? "bg-[#25395c] shadow-[inset_0_0_0_1.5px_#38bdf8,0_0_10px_rgba(56,189,248,0.4)]"
                : "opacity-55 active:opacity-100"
            }`}
            title="График свечей"
          >
            <IconCandlesTab className="w-4 h-4" />
          </button>

          {/* 2. News tab */}
          <button
            onClick={() => selectTab("news")}
            className={`term-tab p-1.5 rounded-[9px] transition-all ${
              activeTab === "news"
                ? "bg-[#25395c] shadow-[inset_0_0_0_1.5px_#38bdf8,0_0_10px_rgba(56,189,248,0.4)]"
                : "opacity-55 active:opacity-100"
            }`}
            title="Новости и сантимент"
          >
            <IconNewsTab className="w-4 h-4" />
          </button>

          {/* 3. Orderbook depth tab */}
          <button
            onClick={() => selectTab("depth")}
            className={`term-tab p-1.5 rounded-[9px] transition-all ${
              activeTab === "depth"
                ? "bg-[#25395c] shadow-[inset_0_0_0_1.5px_#38bdf8,0_0_10px_rgba(56,189,248,0.4)]"
                : "opacity-55 active:opacity-100"
            }`}
            title="Стакан ордеров"
          >
            <IconOrderbookTab className="w-4 h-4" />
          </button>

          {/* 4. Whale tab */}
          <button
            onClick={() => selectTab("whale")}
            className={`term-tab p-1.5 rounded-[9px] transition-all ${
              activeTab === "whale"
                ? "bg-[#25395c] shadow-[inset_0_0_0_1.5px_#c084fc,0_0_10px_rgba(192,132,252,0.4)]"
                : "opacity-55 active:opacity-100"
            }`}
            title="Китовый радар"
          >
            <IconWhale className="w-4 h-4" />
          </button>

          {/* 5. Calendar tab */}
          <button
            onClick={() => selectTab("tournaments")}
            className={`term-tab p-1.5 rounded-[9px] transition-all ${
              activeTab === "tournaments"
                ? "bg-[#25395c] shadow-[inset_0_0_0_1.5px_#fbbf24,0_0_10px_rgba(251,191,36,0.4)]"
                : "opacity-55 active:opacity-100"
            }`}
            title="Турниры и арена"
          >
            <IconCalendarTab className="w-4 h-4" />
          </button>

          {/* 6. Chat tab */}
          <button
            onClick={() => selectTab("chat")}
            className={`term-tab p-1.5 rounded-[9px] transition-all ${
              activeTab === "chat"
                ? "bg-[#25395c] shadow-[inset_0_0_0_1.5px_#38bdf8,0_0_10px_rgba(56,189,248,0.4)]"
                : "opacity-55 active:opacity-100"
            }`}
            title="Чат трейдеров"
          >
            <IconChatTab className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Viewport Content Area */}
      <div className="p-3 flex-1 min-h-0 flex flex-col justify-between overflow-y-auto thin-scroll">
        {/* ================= VIEW 1: CANDLES (SWORD-CANDLE AESTHETIC) ================= */}
        {activeTab === "candles" && (
          <div className="flex flex-col h-full justify-between">
            {/* Header info */}
            <div className="flex items-center justify-between text-xs font-semibold px-1 pb-1.5">
              <span className="text-[#94a3b8] tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <b className="text-white">BTC/USDT</b> • {timeframe}
                <span className="text-[7.5px] font-bold text-[#5eead4]/90 border border-[#5eead4]/30 rounded px-1 py-[1px] uppercase whitespace-nowrap">
                  история · не финсовет
                </span>
              </span>
              <span className="flex items-center gap-1">
                {unfamiliar && (
                  <span className="text-[7.5px] font-black text-[#E7D18C] bg-[#3b2f10] px-1.5 py-0.5 rounded-full border border-[#D0B24A]/50 uppercase whitespace-nowrap">
                    незнакомый · пропуск без штрафа
                  </span>
                )}
                <span className="text-emerald-400 font-bold bg-[#14322d] px-2 py-0.5 rounded-full border border-emerald-500/30 text-[10px] whitespace-nowrap">
                  +4.28% $67,812
                </span>
              </span>
            </div>

            {/* Candle Blade Chart Graphic */}
            <div
              onClick={() => onChartMiss?.()}
              className="relative w-full flex-1 min-h-[96px] my-1 bg-[#0d1424] rounded-[16px] border border-[#22304d] p-2 overflow-hidden flex items-end justify-between"
            >
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
                <div className="w-full border-b border-dashed border-[#64748b]" />
                <div className="w-full border-b border-dashed border-[#64748b]" />
                <div className="w-full border-b border-dashed border-[#64748b]" />
              </div>

              {/* Price level line at t0 */}
              <div className="absolute top-[52px] left-0 right-0 border-b-2 border-dashed border-[#38bdf8]/50 flex justify-end pr-2 pointer-events-none">
                <span className="text-[9px] font-bold text-[#38bdf8] bg-[#0d1424] px-1 rounded -translate-y-2">
                  t0 • $67,800
                </span>
              </div>

              {/* Граница t0: будущее дорисовывается только после Seal */}
              {revealed && (
                <div className="absolute bottom-2 top-2 z-20 border-l-[2px] border-dashed border-[#fbbf24]/80" style={{ right: "15.5%" }}>
                  <span className="mono absolute -top-0.5 -left-3 text-[8px] font-black text-[#fbbf24] bg-[#0d1424] px-0.5">SEAL</span>
                </div>
              )}
              {/* STYLIZED CANDLE-BLADES (Образ японской свечи + меча с гранями и неоновым свечением) */}
              <div className="relative w-full h-full flex items-end justify-between px-2 z-10">
                {[
                  { h: 48, bull: true, wickT: 14, wickB: 8, label: "65.2k" },
                  { h: 62, bull: true, wickT: 18, wickB: 6, label: "65.8k" },
                  { h: 35, bull: false, wickT: 8, wickB: 12, label: "65.4k" },
                  { h: 50, bull: false, wickT: 12, wickB: 10, label: "65.1k" },
                  { h: 75, bull: true, wickT: 22, wickB: 8, label: "66.4k" },
                  { h: 88, bull: true, wickT: 15, wickB: 10, label: "67.2k" },
                  { h: 45, bull: false, wickT: 10, wickB: 16, label: "66.7k" },
                  { h: 60, bull: false, wickT: 16, wickB: 14, label: "66.2k" },
                  { h: 95, bull: true, wickT: 24, wickB: 10, label: "67.4k" },
                  { h: 78, bull: false, wickT: 12, wickB: 18, label: "67.0k" },
                  { h: 104, bull: true, wickT: 28, wickB: 14, target: true, label: "67.8k" },
                  ...(revealed
                    ? [
                        { h: 118, bull: true, wickT: 20, wickB: 10, future: true },
                        { h: 126, bull: true, wickT: 15, wickB: 8, future: true },
                      ]
                    : []),
                ].map((c, i) => (
                  <div key={i} className="flex flex-col items-center justify-end h-full min-h-0 relative group">
                    {/* Top Wick / Sword Blade Point */}
                    <div
                      style={{ height: `${Math.round(c.wickT * 0.62)}px`, flex: "0 0 auto" }}
                      className={`w-[2.5px] rounded-t-full transition-all ${
                        c.bull ? "bg-[#4ade80]" : "bg-[#f87171]"
                      }`}
                    />

                    {/* Пропорциональный распор — сохраняет относительную высоту тел на любом вьюпорте */}
                    <div style={{ flex: 130 - c.h, flexBasis: 0, minHeight: 0 }} />

                    {/* Blade Body: Faceted Candlestick with Glowing Bevel */}
                    <div
                      onClick={
                        c.target
                          ? (e) => {
                              e.stopPropagation();
                              onTargetClick?.();
                            }
                          : undefined
                      }
                      style={{ flex: c.h, flexBasis: 0, minHeight: 5 }}
                      className={`w-[13px] rounded-[5px] relative transition-transform cursor-pointer ${
                        c.bull
                          ? "bg-gradient-to-t from-[#15803d] via-[#22c55e] to-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.55),inset_0_1px_1px_rgba(255,255,255,0.6)]"
                          : "bg-gradient-to-t from-[#991b1b] via-[#ef4444] to-[#f87171] shadow-[0_0_12px_rgba(248,113,113,0.55),inset_0_1px_1px_rgba(255,255,255,0.6)]"
                      } ${c.target ? "ring-2 ring-[#38bdf8] ring-offset-2 ring-offset-[#0d1424] scale-105 animate-pulse" : ""} ${
                        c.future ? "candle-reveal" : ""
                      }`}
                    >
                      {/* Central facet highlight of the sword */}
                      <div className="absolute top-1 bottom-1 left-[5px] w-[2px] bg-white/40 rounded-full" />

                      {/* Target crosshair emblem on the breakthrough candle */}
                      {c.target && (
                        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full border-2 border-[#38bdf8] flex items-center justify-center bg-[#0d1424]/80 shadow-[0_0_10px_#38bdf8] animate-spin">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                        </div>
                      )}
                    </div>

                    {/* Bottom Wick / Sword Pommel */}
                    <div
                      style={{ height: `${Math.round(c.wickB * 0.62)}px`, flex: "0 0 auto" }}
                      className={`w-[2.5px] rounded-b-full transition-all ${
                        c.bull ? "bg-[#4ade80]" : "bg-[#f87171]"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Timeframe switchers (15M, 1Ч, 1Д) */}
            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <div className="flex items-center gap-2">
                {(["15M", "1Ч", "1Д"] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      haptic("tap");
                      sfx.tap();
                      onTimeframeChange?.(tf);
                    }}
                    className={`min-w-[40px] min-h-[36px] px-2.5 rounded-[10px] font-bold transition-all ${
                      timeframe === tf
                        ? "bg-[#25395c] text-[#38bdf8] border border-[#38bdf8]/50 shadow-[0_0_8px_rgba(56,189,248,0.3)]"
                        : "text-[#94a3b8] active:text-white"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium flex items-center gap-1">
                Объём: <b className="text-white">12.4K BTC</b>
              </span>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: NEWS / SENTIMENT (Exact from reference 1) ================= */}
        {activeTab === "news" && (
          <div className="flex flex-col gap-1.5 h-full">
            {[
              {
                id: 0,
                icon: "refresh",
                title: "БИРЖА ЗАМОРОЗИЛА ВЫВОДЫ",
                time: "14:32",
                tag: "ПАНИКА",
                tagBg: "bg-[#e11d48]",
                textColor: "text-[#fda4af]",
                iconBg: "bg-[#881337]",
              },
              {
                id: 1,
                icon: "whale",
                title: "КИТ ПЕРЕВЁЛ 800 BTC",
                time: "14:32",
                tag: "КИТ",
                tagBg: "bg-[#7e22ce]",
                textColor: "text-[#d8b4fe]",
                iconBg: "bg-[#581c87]",
              },
              {
                id: 2,
                icon: "building",
                title: "РЕГУЛЯТОР: НОВЫЕ ПРАВИЛА",
                time: "14:32",
                tag: "ФУНДАМЕНТ",
                tagBg: "bg-[#d97706]",
                textColor: "text-[#fef08a]",
                iconBg: "bg-[#78350f]",
                selected: true,
              },
              {
                id: 3,
                icon: "news",
                title: "ФЕД: ВСЁ ПОД КОНТРОЛЕМ",
                time: "14:32",
                tag: "ШУМ",
                tagBg: "bg-[#475569]",
                textColor: "text-[#cbd5e1]",
                iconBg: "bg-[#1e293b]",
              },
            ].map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  haptic("select");
                  sfx.select();
                  setSelectedNews(n.id);
                }}
                className={`min-h-[52px] flex items-center justify-between p-2.5 rounded-[14px] cursor-pointer transition-all border active:scale-[.99] ${
                  selectedNews === n.id
                    ? "bg-[#1b2a47] border-[#2dd4bf] shadow-[0_0_14px_rgba(45,212,191,0.35)]"
                    : "bg-[#131c31] border-[#1e2a44] active:bg-[#18233c]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Category icon capsule */}
                  <div className={`w-8 h-8 rounded-full ${n.iconBg} flex items-center justify-center border border-white/20 shrink-0`}>
                    {n.icon === "whale" ? (
                      <IconWhale className="w-5 h-5" color="#e9d5ff" />
                    ) : n.icon === "building" ? (
                      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-[#fde047]">
                        <path d="M10 2L2 6V7H18V6L10 2Z" fill="currentColor" />
                        <rect x="3" y="8" width="2" height="7" fill="currentColor" />
                        <rect x="7" y="8" width="2" height="7" fill="currentColor" />
                        <rect x="11" y="8" width="2" height="7" fill="currentColor" />
                        <rect x="15" y="8" width="2" height="7" fill="currentColor" />
                        <rect x="2" y="16" width="16" height="2" rx="0.5" fill="currentColor" />
                      </svg>
                    ) : n.icon === "refresh" ? (
                      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-[#fda4af]">
                        <path d="M4 10A6 6 0 1 1 10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <polyline points="10,13 10,16 7,16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <IconNewsTab className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-[12px] font-bold text-white tracking-wide truncate">
                      {n.title}
                    </div>
                    <div className="text-[10px] text-[#94a3b8] font-medium">{n.time}</div>
                  </div>
                </div>

                {/* Badge */}
                <span
                  className={`${n.tagBg} ${n.textColor} text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-white/20 shadow-sm shrink-0`}
                >
                  {n.tag}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ================= VIEW 3: ORDERBOOK / DEPTH (Exact from reference 2) ================= */}
        {activeTab === "depth" && (
          <div className="flex flex-col gap-1.5 h-full">
            {/* Pair Header */}
            <div className="flex items-center justify-between text-xs px-2 pb-1">
              <span className="font-bold text-white text-[13px]">BTC/USDT</span>
              <span className="text-[11px] font-bold text-[#94a3b8] bg-[#0d1424] px-2.5 py-0.5 rounded-full border border-[#22304d]">
                СПРЕД 0.02%
              </span>
            </div>

            {/* Asks (Red Seller Bars) */}
            <div className="flex flex-col gap-1">
              {[
                { price: "67 840", width: "88%" },
                { price: "67 832", width: "70%" },
                { price: "67 825", width: "52%" },
              ].map((ask) => (
                <div key={ask.price} className="relative h-6 bg-[#2d1b22] rounded-[8px] overflow-hidden flex items-center justify-center">
                  <div
                    style={{ width: ask.width }}
                    className="absolute inset-y-0 bg-gradient-to-r from-[#ef4444] to-[#f87171] opacity-75 rounded-[8px]"
                  />
                  <span className="relative z-10 text-[11px] font-extrabold text-white tracking-wider">
                    {ask.price}
                  </span>
                </div>
              ))}
            </div>

            {/* WHALE WALL BANNER (Exact from Reference 2: Китовая стена) */}
            <div
              onClick={() => {
                haptic("warning");
                sfx.hit();
              }}
              className="min-h-[40px] flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#6b21a8] to-[#9333ea] rounded-[10px] border border-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.5)] cursor-pointer active:scale-[.98] transition-transform"
            >
              <IconWhale className="w-5 h-5" color="#ffffff" />
              <span className="text-[11px] font-black text-white tracking-wider uppercase">
                КИТОВАЯ СТЕНА (1 420 BTC)
              </span>
            </div>

            {/* Bids (Green Buyer Bars) */}
            <div className="flex flex-col gap-1">
              {[
                { price: "67 810", width: "48%" },
                { price: "67 802", width: "65%" },
                { price: "67 795", width: "85%" },
              ].map((bid) => (
                <div
                  key={bid.price}
                  onClick={() => {
                    haptic("tap");
                    sfx.tap();
                    setOrderbookDepth(parseInt(bid.price.replace(" ", "")));
                  }}
                  className="relative h-6 bg-[#163328] rounded-[8px] overflow-hidden flex items-center justify-center cursor-pointer"
                >
                  <div
                    style={{ width: bid.width }}
                    className="absolute inset-y-0 bg-gradient-to-r from-[#22c55e] to-[#4ade80] opacity-75 rounded-[8px]"
                  />
                  <span className="relative z-10 text-[11px] font-extrabold text-white tracking-wider">
                    {bid.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 4: WHALE RADAR ================= */}
        {activeTab === "whale" && (
          <div className="flex flex-col gap-2 h-full justify-between">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-bold text-[#c084fc] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#c084fc] animate-ping" />
                РАДАР КРУПНЫХ ТРАНЗАКЦИЙ
              </span>
              <span className="text-[10px] text-[#94a3b8] font-bold">ТОП 24Ч</span>
            </div>

            <div className="flex flex-col gap-1.5">
              {[
                { tx: "+2 800 BTC на Binance", time: "1 мин назад", size: "189M$", alert: true },
                { tx: "Вывод 4 200 ETH в холод", time: "8 мин назад", size: "15M$", alert: false },
                { tx: "+15 000 000 USDT на Bybit", time: "18 мин назад", size: "15M$", alert: true },
              ].map((w, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-[12px] bg-[#1a1738] border border-[#3b2d66]">
                  <div className="flex items-center gap-2">
                    <IconWhale className="w-4 h-4" />
                    <div>
                      <div className="text-[11px] font-bold text-white">{w.tx}</div>
                      <div className="text-[9px] text-[#a78bfa]">{w.time}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#facc15] bg-[#3b2b1a] px-2 py-0.5 rounded-full border border-[#eab308]/40">
                    {w.size}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 4.5: TRADER CHAT ================= */}
        {activeTab === "chat" && (
          <div className="flex flex-col gap-1.5 h-full">
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-[12px] font-black text-white">ЧАТ СИГНАЛОВ</span>
              <span className="text-[10px] font-bold text-[#5eead4] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4] animate-ping" /> 1 240 онлайн
              </span>
            </div>
            {[
              { who: "k0vаl", c: "#4C6180", text: "Пробой без объёма — не вхожу, жду ретест.", mine: false },
              { who: "сигнал", c: "#2E7F5C", text: "Китовая стена 1 420 BTC в стакане держит цену.", mine: false },
              { who: "ты", c: "#0d9488", text: "Объём молчит. Жду подтверждения у 67 800.", mine: true },
              { who: "marat", c: "#C56861", text: "Фандинг разогнали — возможен каскад ликвидаций.", mine: false },
              { who: "сигнал", c: "#D0B24A", text: "Новость в 15:00 — не открывай плечо заранее.", mine: false },
            ].map((m, i) => (
              <div key={i} className={`flex items-start gap-2 p-2 rounded-[12px] ${m.mine ? "bg-[#113536] border border-[#2dd4bf]/30" : "bg-[#131c31] border border-[#1e2a44]"}`}>
                <span className="w-7 h-7 shrink-0 rounded-full grid place-items-center text-[10px] font-black text-white" style={{ background: m.c }}>
                  {m.who.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className={`block text-[10px] font-black ${m.mine ? "text-[#5eead4]" : "text-[#94a3b8]"}`}>{m.who}</span>
                  <span className="block text-[11px] font-bold text-slate-100 leading-snug">{m.text}</span>
                </span>
              </div>
            ))}
            <div className="mt-auto flex items-center gap-2 pt-1">
              <span className="flex-1 min-h-[40px] flex items-center px-3 rounded-full bg-[#0d1424] border border-[#22304d] text-[11px] text-[#64748b]">
                Анализ виден всем…
              </span>
              <button
                onClick={() => { haptic("tap"); sfx.tap(); }}
                className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-b from-[#2dd4bf] to-[#0d9488] grid place-items-center active:scale-95 transition-transform"
                aria-label="Отправить"
              >
                <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
                  <path d="M3 10l14-6-5 14-3-5-6-3z" fill="#042f2c" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ================= VIEW 5: TOURNAMENTS & ARENA (Exact from Reference 4) ================= */}
        {activeTab === "tournaments" && (
          <div className="flex flex-col gap-2 h-full">
            {/* Tournament Cup Banner */}
            <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-[#1e2c4a] via-[#1b3b3a] to-[#1e2c4a] rounded-[16px] border border-[#2dd4bf]/40 shadow-[0_0_16px_rgba(45,212,191,0.2)]">
              <div className="flex items-center gap-2.5">
                <IconTrophy className="w-10 h-10 drop-shadow-[0_0_8px_#fbbf24]" />
                <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">УЧЕБНАЯ ЛИГА</span>
                </div>
                  <div className="text-[13px] font-black text-white tracking-wide">НЕДЕЛЬНЫЙ РАЗБОР</div>
                  <div className="text-[10px] text-[#2dd4bf] font-bold">без ставок и призовых денег</div>
                </div>
              </div>

              <button
                onClick={() => {
                  haptic("success");
                  sfx.win();
                }}
                className="px-3 py-1.5 rounded-[12px] bg-gradient-to-b from-[#2dd4bf] to-[#0d9488] text-[#042f2c] font-black text-[11px] uppercase tracking-wider shadow-[0_4px_0_#115e59] active:translate-y-1 active:shadow-none transition-all"
              >
                РАЗОБРАТЬ
              </button>
            </div>

            {/* Podium Top 3 (Exact from Reference 4) */}
            <div className="flex items-end justify-center gap-2 pt-1 px-2">
              {/* Rank 2 (Silver) */}
              <div className="flex flex-col items-center">
                <AvatarDoge className="w-7 h-7 mb-1 ring-2 ring-slate-300 rounded-full" />
                <div className="w-16 h-10 bg-gradient-to-b from-[#94a3b8] to-[#475569] rounded-t-[10px] flex flex-col items-center justify-center border-t-2 border-slate-300">
                  <span className="text-[12px] font-black text-white">2</span>
                  <span className="text-[8px] font-bold text-slate-200">2 450</span>
                </div>
              </div>

              {/* Rank 1 (Gold) */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <AvatarDoge className="w-8 h-8 mb-1 ring-2 ring-amber-400 rounded-full" />
                  <span className="absolute -top-1.5 right-0 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-white" />
                </div>
                <div className="w-20 h-14 bg-gradient-to-b from-[#f59e0b] to-[#b45309] rounded-t-[12px] flex flex-col items-center justify-center border-t-2 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  <span className="text-[14px] font-black text-white">1</span>
                  <span className="text-[9px] font-black text-amber-100">3 890</span>
                </div>
              </div>

              {/* Rank 3 (Bronze) */}
              <div className="flex flex-col items-center">
                <AvatarKnight className="w-7 h-7 mb-1 ring-2 ring-amber-700 rounded-full" />
                <div className="w-16 h-8 bg-gradient-to-b from-[#b45309] to-[#78350f] rounded-t-[10px] flex flex-col items-center justify-center border-t-2 border-amber-600">
                  <span className="text-[12px] font-black text-white">3</span>
                  <span className="text-[8px] font-bold text-amber-200">1 850</span>
                </div>
              </div>
            </div>

            {/* Duel 1 on 1 & League Row (Exact from Reference 4) */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 bg-[#131b2e] p-2 rounded-[12px] border border-[#22304d]">
                <div className="text-[10px] font-bold text-[#94a3b8]">ЕЖЕНЕДЕЛЬНАЯ ЛИГА</div>
                <div className="text-[11px] font-black text-white">Лига II → Лига I</div>
                <div className="w-full h-1.5 bg-[#1e2c47] rounded-full mt-1 overflow-hidden">
                  <div className="w-[65%] h-full bg-[#2dd4bf] rounded-full" />
                </div>
              </div>

              <button
                onClick={() => {
                  haptic("warning");
                  sfx.seal();
                }}
                className="min-h-[52px] flex items-center gap-2 p-2 bg-[#1b253d] active:bg-[#22304d] rounded-[12px] border border-[#3b4d75] transition-all"
              >
                <IconDualSwords className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-[9px] font-bold text-[#94a3b8] uppercase">СОВМЕСТНЫЙ РАЗБОР</div>
                  <span className="text-[11px] font-black text-[#38bdf8]">ОТКРЫТЬ</span>
                </div>
              </button>
            </div>

            {/* Top Players Table */}
            <div className="flex flex-col gap-1 max-h-16 overflow-y-auto pr-1">
              {[
                { name: "@whale_hunter", pts: "1 350", av: AvatarWhale },
                { name: "@fomo_queen", pts: "1 600", av: AvatarQueen },
              ].map((p, i) => {
                const Av = p.av;
                return (
                  <div key={i} className="flex items-center justify-between text-[11px] px-2 py-1 bg-[#0d1424] rounded-[8px]">
                    <div className="flex items-center gap-1.5">
                      <Av className="w-5 h-5" />
                      <span className="font-bold text-white">{p.name}</span>
                    </div>
                    <span className="font-black text-[#facc15]">{p.pts}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
