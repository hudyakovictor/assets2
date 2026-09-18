import { useEffect, useState } from "react";
import {
  AvatarDoge,
  AvatarKnight,
  AvatarQueen,
  AvatarWhale,
  IconCalendarTab,
  IconCandlesTab,
  IconChatTab,
  IconCrown,
  IconDualSwords,
  IconMedalBronze,
  IconMedalSilver,
  IconNewsTab,
  IconOrderbookTab,
  IconTrophy,
  IconWhale,
} from "./Icons";
import { haptic, sfx } from "../lib/feel";

export type TerminalTab = "candles" | "news" | "depth" | "whale" | "tournaments" | "calendar" | "chat";

// Mini Sparkline Generator for bottom of News tab (Reference 1)
function MiniSparkline({ color = "#22c55e" }: { color?: string }) {
  return (
    <svg viewBox="0 0 42 12" className="w-10 h-3 inline-block">
      <polyline
        points="0,8 6,9 12,4 18,7 24,3 30,6 36,2 42,4"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TerminalCard({
  initialTab = "news",
  revealed = false,
  timeframe = "15M",
  onTimeframeChange,
  onTargetClick,
}: {
  initialTab?: TerminalTab;
  revealed?: boolean;
  timeframe?: "15M" | "1Ч" | "1Д";
  onTimeframeChange?: (tf: "15M" | "1Ч" | "1Д") => void;
  onTargetClick?: () => void;
}) {
  const [tab, setTab] = useState<TerminalTab>(initialTab);
  const [selectedNews, setSelectedNews] = useState<number>(2); // 2 = Регулятор: новые правила
  useEffect(() => setTab(initialTab), [initialTab]);

  const tabs: { id: TerminalTab; Icon: typeof IconCandlesTab; label: string }[] = [
    { id: "candles", Icon: IconCandlesTab, label: "График" },
    { id: "news", Icon: IconNewsTab, label: "Новости" },
    { id: "depth", Icon: IconOrderbookTab, label: "Стакан" },
    { id: "whale", Icon: IconWhale, label: "Киты" },
    { id: "tournaments", Icon: IconCalendarTab, label: "Турниры" },
    { id: "chat", Icon: IconChatTab, label: "Чат" },
  ];

  const candles = [
    { h: 32, up: true, wickT: 10, wickB: 6 },
    { h: 42, up: true, wickT: 14, wickB: 8 },
    { h: 26, up: false, wickT: 8, wickB: 10 },
    { h: 36, up: false, wickT: 10, wickB: 8 },
    { h: 54, up: true, wickT: 16, wickB: 6 },
    { h: 64, up: true, wickT: 14, wickB: 8 },
    { h: 34, up: false, wickT: 8, wickB: 12 },
    { h: 44, up: false, wickT: 12, wickB: 10 },
    { h: 68, up: true, wickT: 18, wickB: 8 },
    { h: 52, up: false, wickT: 10, wickB: 14 },
    { h: 78, up: true, wickT: 22, wickB: 10, t: true },
    ...(revealed ? [{ h: 86, up: true, wickT: 16, wickB: 8 }, { h: 94, up: true, wickT: 14, wickB: 6 }] : []),
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col rounded-[22px] bg-[#141e34] border-[2px] border-[#223356] overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]">
      {/* Top macOS-style Terminal Bar with Traffic Lights */}
      <div className="shrink-0 flex items-center justify-between px-3 h-10 bg-[#10182b] border-b border-[#1c2944]">
        {/* Traffic Light Dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f87171] shadow-[0_0_5px_rgba(248,113,113,0.7)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shadow-[0_0_5px_rgba(251,191,36,0.7)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] shadow-[0_0_5px_rgba(74,222,128,0.7)]" />
        </div>

        {/* 6 Tabs as seen in Reference 1, 2, 3 */}
        <div className="flex items-center gap-1 bg-[#0b1220] p-0.5 rounded-[12px] border border-[#1a263d]">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                haptic("select");
                sfx.select();
                setTab(t.id);
              }}
              title={t.label}
              className={`w-7 h-7 flex items-center justify-center rounded-[8px] transition-all active:scale-95 ${
                tab === t.id
                  ? "bg-[#25395c] shadow-[inset_0_0_0_1.5px_#38bdf8,0_0_8px_rgba(56,189,248,0.4)]"
                  : "opacity-55 hover:opacity-100"
              }`}
            >
              <t.Icon className="w-4 h-4" />
            </button>
          ))}
          <span className="w-5 h-5 flex items-center justify-center text-[#64748b] font-bold text-xs">+</span>
        </div>
      </div>

      {/* Viewport Content */}
      <div className="flex-1 min-h-0 p-2.5 flex flex-col justify-between overflow-hidden">
        {/* ================= 1. NEWS / SENTIMENT (EXACT REFERENCE 1) ================= */}
        {tab === "news" && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col gap-1.5">
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
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-[12px] cursor-pointer transition-all border ${
                    selectedNews === n.id
                      ? "bg-[#1b2a47] border-[#2dd4bf] shadow-[0_0_12px_rgba(45,212,191,0.35)] relative overflow-hidden"
                      : "bg-[#10192e] border-[#1c2944] hover:bg-[#15223c]"
                  }`}
                >
                  {/* Bookmark ribbon on selected item like reference */}
                  {selectedNews === n.id && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#2dd4bf] [clip-path:polygon(0_0,100%_0,100%_100%)]" />
                  )}

                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-7 h-7 rounded-full ${n.iconBg} flex items-center justify-center border border-white/20 shrink-0`}>
                      {n.icon === "whale" ? (
                        <IconWhale className="w-4 h-4" color="#e9d5ff" />
                      ) : n.icon === "building" ? (
                        <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5 text-[#fde047]">
                          <path d="M10 2L2 6V7H18V6L10 2Z" fill="currentColor" />
                          <rect x="3" y="8" width="2" height="7" fill="currentColor" />
                          <rect x="7" y="8" width="2" height="7" fill="currentColor" />
                          <rect x="11" y="8" width="2" height="7" fill="currentColor" />
                          <rect x="15" y="8" width="2" height="7" fill="currentColor" />
                          <rect x="2" y="16" width="16" height="2" rx="0.5" fill="currentColor" />
                        </svg>
                      ) : n.icon === "refresh" ? (
                        <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5 text-[#fda4af]">
                          <path d="M4 10A6 6 0 1 1 10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <polyline points="10,13 10,16 7,16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <IconNewsTab className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-[11px] font-black text-white tracking-wide truncate">
                        {n.title}
                      </div>
                      <div className="text-[9px] text-[#94a3b8] font-medium">{n.time}</div>
                    </div>
                  </div>

                  <span className={`${n.tagBg} ${n.textColor} text-[9px] font-black px-2 py-0.5 rounded-full border border-white/20 shadow-sm shrink-0`}>
                    {n.tag}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Sparklines Row (Exact from Reference 1: 15M, 1Ч, 1Д) */}
            <div className="flex items-center justify-between pt-1.5 px-1 border-t border-[#1c2944] text-[10px] font-bold text-[#94a3b8]">
              <div className="flex items-center gap-1.5">
                <span className="text-white">15M</span>
                <MiniSparkline color="#4ade80" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white">1Ч</span>
                <MiniSparkline color="#38bdf8" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white">1Д</span>
                <MiniSparkline color="#f87171" />
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. ORDERBOOK / DEPTH (EXACT REFERENCE 2) ================= */}
        {tab === "depth" && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs px-1 pb-1">
              <span className="font-black text-white text-[12.5px] tracking-wide">BTC/USDT</span>
              <span className="text-[10px] font-extrabold text-[#94a3b8] bg-[#0d1424] px-2 py-0.5 rounded-full border border-[#22304d]">
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

            {/* WHALE WALL BANNER (Exact from Reference 2: КИТОВАЯ СТЕНА) */}
            <div
              onClick={() => {
                haptic("warning");
                sfx.hit();
              }}
              className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#6b21a8] to-[#9333ea] rounded-[10px] border border-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.5)] cursor-pointer active:scale-98 transition-transform"
            >
              <IconWhale className="w-4 h-4" color="#ffffff" />
              <span className="text-[10.5px] font-black text-white tracking-wider uppercase">
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
                <div key={bid.price} className="relative h-6 bg-[#163328] rounded-[8px] overflow-hidden flex items-center justify-center">
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

        {/* ================= 3. CANDLESTICK BLADES (EXACT REFERENCE 3) ================= */}
        {tab === "candles" && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold px-1 pb-1">
              <span className="text-[#94a3b8] tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <b className="text-white">BTC/USDT</b> • {timeframe}
              </span>
              <span className="text-emerald-400 font-bold bg-[#14322d] px-2 py-0.5 rounded-full border border-emerald-500/30 text-[10px]">
                +4.28% $67,812
              </span>
            </div>

            {/* Chart Area with Candlestick Swords */}
            <div className="relative flex-1 min-h-[125px] bg-[#0c1322] rounded-[16px] border border-[#1e2a44] p-2 flex items-end justify-between overflow-hidden">
              {/* Dotted t0 line */}
              <div className="absolute top-[44%] left-0 right-0 border-b border-dashed border-[#38bdf8]/50 flex justify-end pr-2 pointer-events-none">
                <span className="text-[8px] font-black text-[#38bdf8] bg-[#0c1322] px-1 rounded -translate-y-2">
                  t0 • $67,800
                </span>
              </div>

              {/* Candles */}
              {candles.map((c, i) => (
                <div
                  key={i}
                  onClick={() => c.t && onTargetClick?.()}
                  className={`flex flex-col items-center justify-end h-full pb-1 cursor-pointer transition-transform ${
                    c.t ? "scale-105" : ""
                  }`}
                >
                  <span style={{ height: c.wickT }} className={`w-0.5 rounded-t ${c.up ? "bg-[#4ade80]" : "bg-[#f87171]"}`} />
                  <div
                    style={{ height: c.h }}
                    className={`w-[11px] rounded-[4px] relative ${
                      c.up
                        ? "bg-gradient-to-t from-[#15803d] via-[#22c55e] to-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)]"
                        : "bg-gradient-to-t from-[#991b1b] via-[#ef4444] to-[#f87171] shadow-[0_0_10px_rgba(248,113,113,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)]"
                    } ${c.t ? "ring-2 ring-[#38bdf8] shadow-[0_0_14px_#38bdf8] animate-pulse" : ""}`}
                  >
                    {/* Ridge line */}
                    <div className="absolute inset-y-1 left-[4px] w-[1px] bg-white/40 rounded-full" />
                    {c.t && (
                      <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full border-2 border-[#38bdf8] bg-[#0c1322]/80 flex items-center justify-center shadow-md animate-spin">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                      </span>
                    )}
                  </div>
                  <span style={{ height: c.wickB }} className={`w-0.5 rounded-b ${c.up ? "bg-[#4ade80]" : "bg-[#f87171]"}`} />
                </div>
              ))}
            </div>

            {/* Timeframe switchers */}
            <div className="flex items-center justify-between pt-1 px-1 text-xs">
              <div className="flex items-center gap-1.5">
                {(["15M", "1Ч", "1Д"] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => {
                      haptic("tap");
                      onTimeframeChange?.(tf);
                    }}
                    className={`px-2 py-0.5 rounded-[6px] font-black text-[10px] ${
                      timeframe === tf
                        ? "bg-[#25395c] text-[#38bdf8] border border-[#38bdf8]/40"
                        : "text-[#64748b]"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-[#94a3b8] font-medium">Объём: <b className="text-white">12.4K BTC</b></span>
            </div>
          </div>
        )}

        {/* ================= 4. TOURNAMENTS & ARENA (EXACT REFERENCE 4) ================= */}
        {tab === "tournaments" && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Cup Banner */}
            <div className="flex items-center justify-between p-2 rounded-[14px] bg-gradient-to-r from-[#1e2c4a] via-[#1b3b3a] to-[#1e2c4a] border border-[#2dd4bf]/40">
              <div className="flex items-center gap-2">
                <IconTrophy className="w-8 h-8 drop-shadow-[0_0_8px_#fbbf24]" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">LIVE • 23:14:07</span>
                  </div>
                  <div className="text-[11px] font-black text-white">BULL RUN BLITZ</div>
                  <div className="text-[9px] text-[#2dd4bf] font-bold">500 000 $SIG</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  haptic("success");
                  sfx.win();
                }}
                className="px-2.5 py-1 rounded-[10px] bg-[#2dd4bf] text-[#042f2c] font-black text-[10px] uppercase shadow-sm active:translate-y-0.5"
              >
                УЧАСТВОВАТЬ
              </button>
            </div>

            {/* 3D Podium */}
            <div className="flex items-end justify-center gap-2 pt-1">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <AvatarDoge className="w-6 h-6 mb-0.5 ring-2 ring-slate-300 rounded-full" />
                  <div className="absolute -bottom-1 -right-1"><IconMedalSilver className="w-3.5 h-3.5" /></div>
                </div>
                <div className="w-14 h-8 bg-gradient-to-b from-[#94a3b8] to-[#475569] rounded-t-[8px] flex flex-col items-center justify-center border-t-2 border-slate-300">
                  <span className="text-[11px] font-black text-white">2</span>
                  <span className="text-[7.5px] font-bold text-slate-200">2 450</span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative">
                  <AvatarDoge className="w-7 h-7 mb-0.5 ring-2 ring-amber-400 rounded-full" />
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2"><IconCrown className="w-4 h-4" /></div>
                </div>
                <div className="w-16 h-11 bg-gradient-to-b from-[#f59e0b] to-[#b45309] rounded-t-[10px] flex flex-col items-center justify-center border-t-2 border-amber-300 shadow-md">
                  <span className="text-[13px] font-black text-white">1</span>
                  <span className="text-[8px] font-black text-amber-100">3 890</span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative">
                  <AvatarKnight className="w-6 h-6 mb-0.5 ring-2 ring-amber-700 rounded-full" />
                  <div className="absolute -bottom-1 -right-1"><IconMedalBronze className="w-3.5 h-3.5" /></div>
                </div>
                <div className="w-14 h-7 bg-gradient-to-b from-[#b45309] to-[#78350f] rounded-t-[8px] flex flex-col items-center justify-center border-t-2 border-amber-600">
                  <span className="text-[11px] font-black text-white">3</span>
                  <span className="text-[7.5px] font-bold text-amber-200">1 850</span>
                </div>
              </div>
            </div>

            {/* Duel 1 on 1 & League Row */}
            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex-1 bg-[#10182b] p-1.5 rounded-[10px] border border-[#1e2a44]">
                <div className="text-[8.5px] font-bold text-[#94a3b8]">ЕЖЕНЕДЕЛЬНАЯ ЛИГА</div>
                <div className="text-[10px] font-black text-white">Лига II → Лига I</div>
                <div className="w-full h-1 bg-[#1a263d] rounded-full mt-1 overflow-hidden">
                  <div className="w-[65%] h-full bg-[#2dd4bf] rounded-full" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  haptic("warning");
                  sfx.seal();
                }}
                className="flex items-center gap-1.5 p-1.5 bg-[#17223b] rounded-[10px] border border-[#25395c] active:scale-95"
              >
                <IconDualSwords className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-[8px] font-bold text-[#94a3b8] uppercase">ДУЭЛЬ 1 НА 1</div>
                  <span className="text-[10px] font-black text-[#38bdf8]">ВЫЗОВ</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ================= 5. WHALE RADAR ================= */}
        {tab === "whale" && (
          <div className="flex-1 flex flex-col gap-1.5 justify-center">
            <div className="text-[10px] font-black text-[#c084fc] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-ping" />
              РАДАР КРУПНЫХ ТРАНЗАКЦИЙ
            </div>
            {[
              { tx: "+2 800 BTC на Binance", time: "1 мин назад", size: "189M$" },
              { tx: "Вывод 4 200 ETH в холод", time: "8 мин назад", size: "15M$" },
              { tx: "+15 000 000 USDT на Bybit", time: "18 мин назад", size: "15M$" },
            ].map((w, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 rounded-[10px] bg-[#1a1738] border border-[#3b2d66]">
                <div className="flex items-center gap-1.5">
                  <IconWhale className="w-3.5 h-3.5" />
                  <div>
                    <div className="text-[10px] font-bold text-white">{w.tx}</div>
                    <div className="text-[8px] text-[#a78bfa]">{w.time}</div>
                  </div>
                </div>
                <span className="text-[9px] font-black text-[#facc15] bg-[#3b2b1a] px-1.5 py-0.5 rounded border border-[#eab308]/40">
                  {w.size}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ================= 6. CHAT / CALENDAR ================= */}
        {(tab === "chat" || tab === "calendar") && (
          <div className="flex-1 flex flex-col gap-1.5 justify-between">
            <div className="text-[10px] font-black text-[#38bdf8] uppercase">ЧАТ ТРЕЙДЕРОВ • LIVE</div>
            <div className="flex flex-col gap-1">
              {[
                { n: "@trader_pro", m: "Объём мёртвый. Не вхожу в пробой." },
                { n: "ВЫ", m: "Жду ретест $67,800 и подтверждения.", you: true },
                { n: "@whale_hunter", m: "Китовая стена на 67 810 стоит крепко." },
              ].map((c) => (
                <div key={c.n + c.m} className={`px-2 py-1 rounded-[10px] ${c.you ? "bg-[#133e3c] border border-[#2dd4bf]/40 self-end" : "bg-[#0b1220] border border-[#1a263d]"}`}>
                  <div className="text-[8px] font-black text-[#94a3b8]">{c.n}</div>
                  <div className="text-[10px] font-bold text-white">{c.m}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 text-[8.5px] text-[#64748b]">
              <AvatarWhale className="w-4 h-4" />
              <AvatarQueen className="w-4 h-4" />
              <span>18 трейдеров онлайн</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
