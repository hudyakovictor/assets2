import { useState } from "react";
import {
  IconCandlesTab,
  IconNewsTab,
  IconOrderbookTab,
  IconWhale,
  IconCalendarTab,
  IconChatTab,
  IconXP,
  IconCoin,
  IconGear,
  IconCheck,
  IconCandleSword,
  IconLightning,
  IconShield,
} from "./Icons";
import { HandwrittenWisdom } from "./HandwrittenWisdom";
import { haptic, sfx } from "../lib/feel";
import type { TerminalTab } from "./TerminalCard";
import { PAGES, type VariantId } from "../data/pages";

export interface StudioParams {
  currentPageId: string;
  setCurrentPageId: (id: string) => void;
  currentVariantId: VariantId;
  setCurrentVariantId: (v: VariantId) => void;
  terminalTab: TerminalTab;
  setTerminalTab: (tab: TerminalTab) => void;
  xp: number;
  setXp: (v: number | ((prev: number) => number)) => void;
  coins: number;
  setCoins: (v: number | ((prev: number) => number)) => void;
  selectedCardId: string;
  setSelectedCardId: (id: string) => void;
  timeframe: "15M" | "1Ч" | "1Д";
  setTimeframe: (tf: "15M" | "1Ч" | "1Д") => void;
  viewportSize: { name: string; w: number; h: number };
  setViewportSize: (vp: { name: string; w: number; h: number }) => void;
  coachQuote: string;
  setCoachQuote: (q: string) => void;
  triggerReward: () => void;
  scenarioIndex: number;
  setScenarioIndex: (idx: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  hapticEnabled: boolean;
  setHapticEnabled: (v: boolean) => void;
  onOpenReportModal: () => void;
}

const VIEWPORTS = [
  { name: "390 × 844 (iPhone 14/15)", w: 390, h: 844 },
  { name: "360 × 800 (Android)", w: 360, h: 800 },
  { name: "412 × 915 (Galaxy)", w: 412, h: 915 },
  { name: "320 × 568 (SE Compact)", w: 320, h: 568 },
  { name: "300 × 620 (MVP Frame)", w: 300, h: 620 },
];

export function StudioSidebar({ params }: { params: StudioParams }) {
  const [activeSidebarTab, setActiveSidebarTab] = useState<"screens" | "params" | "qa">("screens");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sectionFilter, setSectionFilter] = useState<string>("all");

  const currentPage = PAGES.find((p) => p.id === params.currentPageId) ?? PAGES[0];
  const currentIndex = PAGES.findIndex((p) => p.id === params.currentPageId);

  const goNext = () => {
    if (currentIndex < PAGES.length - 1) {
      haptic("tap");
      sfx.tap();
      params.setCurrentPageId(PAGES[currentIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      haptic("tap");
      sfx.tap();
      params.setCurrentPageId(PAGES[currentIndex - 1].id);
    }
  };

  const filteredPages = PAGES.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = sectionFilter === "all" || p.section === sectionFilter;
    return matchesSearch && matchesSection;
  });

  return (
    <aside className="w-full lg:w-[400px] h-full bg-[#090e1a] border-r border-[#1a263d] flex flex-col justify-between overflow-y-auto select-none scrollbar-thin">
      <div className="flex flex-col">
        {/* Header Branding */}
        <div className="p-3.5 pb-2.5 border-b border-[#162238] flex items-center justify-between bg-[#070b16]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-[#14b8a6] to-[#0f766e] flex items-center justify-center border border-[#5eead4]/40 shadow-[0_0_12px_rgba(45,212,191,0.4)]">
              <IconCandleSword className="w-6 h-6" active={true} />
            </div>
            <div>
              <div className="text-[13px] font-black text-white tracking-wider flex items-center gap-1.5">
                SIGNAL ARENA <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#2dd4bf]/20 text-[#2dd4bf] border border-[#2dd4bf]/40 font-bold">AAA</span>
              </div>
              <div className="text-[10px] text-[#64748b] font-medium">
                Telegram Mini App • Управление игрой
              </div>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
        </div>

        {/* 1. THE REQUESTED HANDWRITTEN TRADING WISDOM (NO STICKER, TURQUOISE ON DARK BLUE) */}
        <div className="p-3">
          <HandwrittenWisdom />
        </div>

        {/* Main Sidebar Segmented Navigation */}
        <div className="px-3 pb-2">
          <div className="grid grid-cols-3 gap-1 bg-[#121c32] p-1 rounded-[12px] border border-[#1e2c47]">
            {[
              { id: "screens" as const, label: "ЭКРАНЫ P01-34" },
              { id: "params" as const, label: "ПАРАМЕТРЫ" },
              { id: "qa" as const, label: "QA И ОТЧЁТ" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  haptic("select");
                  sfx.select();
                  setActiveSidebarTab(tab.id);
                }}
                className={`py-1.5 text-[10px] font-black rounded-[9px] transition-all uppercase tracking-wide ${
                  activeSidebarTab === tab.id
                    ? "bg-[#25395c] text-[#38bdf8] border border-[#38bdf8]/50 shadow-[0_0_8px_rgba(56,189,248,0.3)]"
                    : "text-[#64748b] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= TAB 1: P01–P34 SCREEN EXPLORER ================= */}
        {activeSidebarTab === "screens" && (
          <div className="px-3 flex flex-col gap-2.5 pb-4">
            {/* Current Screen Status & Prev/Next */}
            <div className="p-3 rounded-[16px] bg-[#121c32] border border-[#223356] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#38bdf8] tracking-wider">
                  ТЕКУЩИЙ ЭКРАН ({currentIndex + 1}/34)
                </span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#1e2d47] text-[#94a3b8]">
                  {currentPage.section}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[14px] font-black text-white tracking-wide truncate">
                  <b className="text-[#2dd4bf] mr-1.5">{currentPage.id}</b> {currentPage.title}
                </span>
              </div>

              <div className="text-[10px] text-[#94a3b8] font-medium leading-snug">
                Состояние: <span className="text-white font-bold">{currentPage.state}</span>
              </div>

              {/* Prev / Next & Variant Pill */}
              <div className="flex items-center justify-between pt-1 gap-2 border-t border-[#1a2740]">
                <div className="flex items-center gap-1">
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="px-2.5 py-1 rounded-[8px] bg-[#1a2740] text-xs font-bold text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-[#25395c]"
                  >
                    ← Назад
                  </button>
                  <button
                    onClick={goNext}
                    disabled={currentIndex === PAGES.length - 1}
                    className="px-2.5 py-1 rounded-[8px] bg-[#1a2740] text-xs font-bold text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-[#25395c]"
                  >
                    Вперёд →
                  </button>
                </div>

                {/* Variant Switcher A/B/C/D */}
                <div className="flex items-center gap-1 bg-[#0d1424] p-0.5 rounded-[8px] border border-[#1e2a44]">
                  {(["A", "B", "C", "D"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        haptic("tap");
                        params.setCurrentVariantId(v);
                      }}
                      className={`w-5 h-5 rounded-[6px] text-[10px] font-black transition-all ${
                        params.currentVariantId === v
                          ? "bg-[#2dd4bf] text-[#042f2e] shadow-sm"
                          : "text-[#64748b] hover:text-white"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search and Section Filters */}
            <div className="flex flex-col gap-1.5">
              <input
                type="text"
                placeholder="Поиск по экранам P01-P34..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 rounded-[10px] bg-[#121c32] border border-[#1e2c47] text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#2dd4bf]"
              />

              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[9px] font-black uppercase text-[#94a3b8] scrollbar-none">
                {[
                  { id: "all", label: "ВСЕ (34)" },
                  { id: "Onboarding", label: "ОНБОРДИНГ" },
                  { id: "Арена", label: "АРЕНА" },
                  { id: "Академия", label: "АКАДЕМИЯ" },
                  { id: "Профиль", label: "ПРОФИЛЬ" },
                  { id: "Сервис", label: "СЕРВИС" },
                ].map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setSectionFilter(sec.id)}
                    className={`px-2 py-1 rounded-[6px] whitespace-nowrap transition-all ${
                      sectionFilter === sec.id
                        ? "bg-[#2dd4bf] text-[#042f2e]"
                        : "bg-[#111a2e] text-[#64748b] hover:text-white"
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable list of P01–P34 screens */}
            <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto pr-1">
              {filteredPages.map((p) => {
                const isCurrent = p.id === params.currentPageId;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      haptic("select");
                      sfx.select();
                      params.setCurrentPageId(p.id);
                    }}
                    className={`w-full text-left p-2 rounded-[10px] flex items-center justify-between transition-all border ${
                      isCurrent
                        ? "bg-[#1d2d4a] border-[#2dd4bf] shadow-[0_0_10px_rgba(45,212,191,0.3)]"
                        : "bg-[#0f172a] border-[#1a263d] hover:bg-[#162238]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[11px] font-black px-1.5 py-0.5 rounded ${isCurrent ? "bg-[#2dd4bf] text-[#042f2e]" : "bg-[#1e293b] text-[#38bdf8]"}`}>
                        {p.id}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[11.5px] font-bold text-white truncate">
                          {p.title}
                        </div>
                        <div className="text-[9px] text-[#64748b] font-medium truncate">
                          {p.state}
                        </div>
                      </div>
                    </div>

                    <span className="text-[9px] text-[#64748b] font-bold shrink-0 ml-1">
                      {p.section}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 2: LIVE GAME PARAMETERS ================= */}
        {activeSidebarTab === "params" && (
          <div className="px-3 flex flex-col gap-3 pb-4">
            {/* Terminal Tab Selector */}
            <div className="p-3 rounded-[16px] bg-[#121c32] border border-[#223356]">
              <div className="text-[11px] font-black text-[#38bdf8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <IconCandlesTab className="w-3.5 h-3.5" /> Экран терминала
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
                {[
                  { id: "candles" as const, label: "Свечи-клинки", icon: IconCandlesTab },
                  { id: "news" as const, label: "Новости / Паника", icon: IconNewsTab },
                  { id: "depth" as const, label: "Стакан / Стена", icon: IconOrderbookTab },
                  { id: "whale" as const, label: "Китовый радар", icon: IconWhale },
                  { id: "tournaments" as const, label: "Турнир / Подиум", icon: IconCalendarTab },
                  { id: "chat" as const, label: "Чат трейдеров", icon: IconChatTab },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = params.terminalTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        haptic("select");
                        sfx.select();
                        params.setTerminalTab(t.id);
                        params.setCurrentPageId("P24");
                      }}
                      className={`p-2 rounded-[10px] flex flex-col items-center gap-1 transition-all ${
                        isActive
                          ? "bg-[#25395c] text-[#38bdf8] border border-[#38bdf8]/60 shadow-[0_0_10px_rgba(56,189,248,0.35)] font-black"
                          : "bg-[#0d1526] text-[#94a3b8] hover:text-white border border-[#1a2640]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="leading-tight">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Economy balances */}
            <div className="p-3 rounded-[16px] bg-[#121c32] border border-[#223356] flex flex-col gap-2.5">
              <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <IconCoin className="w-4 h-4" /> Игровой баланс и награды
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <IconXP className="w-4 h-4" />
                  <span className="font-bold text-white">XP: {params.xp}/1000</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      haptic("tap");
                      sfx.tap();
                      params.setXp((x) => Math.max(0, x - 50));
                    }}
                    className="w-6 h-6 rounded bg-[#1c2944] text-white font-black text-xs hover:bg-[#25395c]"
                  >
                    -
                  </button>
                  <button
                    onClick={() => {
                      haptic("tap");
                      sfx.tap();
                      params.setXp((x) => Math.min(1000, x + 50));
                    }}
                    className="w-6 h-6 rounded bg-[#1c2944] text-white font-black text-xs hover:bg-[#25395c]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <IconCoin className="w-4 h-4" />
                  <span className="font-bold text-amber-200">Монеты: {params.coins}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      haptic("tap");
                      sfx.tap();
                      params.setCoins((c) => Math.max(0, c - 100));
                    }}
                    className="w-6 h-6 rounded bg-[#1c2944] text-white font-black text-xs hover:bg-[#25395c]"
                  >
                    -
                  </button>
                  <button
                    onClick={() => {
                      haptic("tap");
                      sfx.tap();
                      params.setCoins((c) => c + 250);
                    }}
                    className="w-6 h-6 rounded bg-[#1c2944] text-white font-black text-xs hover:bg-[#25395c]"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={params.triggerReward}
                className="w-full py-2.5 rounded-[12px] bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-amber-950 font-black text-xs uppercase tracking-wider shadow-[0_3px_0_#92400e] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <IconLightning className="w-4 h-4 text-amber-950" />
                <span>Запустить салют победы (+250 XP / Монет)</span>
              </button>
            </div>

            {/* Historical Scenario Switcher */}
            <div className="p-3 rounded-[16px] bg-[#121c32] border border-[#223356] flex flex-col gap-2">
              <div className="text-[11px] font-black text-[#a78bfa] uppercase tracking-wider flex items-center gap-1.5">
                <IconShield className="w-3.5 h-3.5" /> Исторический сценарий
              </div>
              {[
                { id: 0, pair: "BTC/USDT", name: "Вершина и обрыв (Май 2021)", tag: "ЛИКВИДАЦИИ" },
                { id: 1, pair: "ETH/USDT", name: "Ложный пробой (Июнь 2022)", tag: "ЛОВУШКА" },
                { id: 2, pair: "SOL/USDT", name: "Откат к поддержке (Окт 2023)", tag: "РАЗВОРОТ" },
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    haptic("select");
                    sfx.card();
                    params.setScenarioIndex(sc.id);
                    params.setCoachQuote(`Сценарий: ${sc.name}. Читаем свечи-клинки!`);
                  }}
                  className={`p-2 rounded-[10px] text-left text-xs transition-all border ${
                    params.scenarioIndex === sc.id
                      ? "bg-[#253352] border-[#a78bfa] shadow-[0_0_10px_rgba(167,139,250,0.3)]"
                      : "bg-[#0d1424] border-[#1d273e] opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white">{sc.pair}</span>
                    <span className="text-[9px] font-black text-[#a78bfa] bg-[#271d42] px-1.5 py-0.2 rounded">
                      {sc.tag}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#94a3b8] font-medium mt-0.5">{sc.name}</div>
                </button>
              ))}
            </div>

            {/* Audio & Haptic Toggles */}
            <div className="p-3 rounded-[16px] bg-[#121c32] border border-[#223356] flex items-center justify-between">
              <div className="text-xs font-bold text-white">Звуковые эффекты</div>
              <button
                onClick={() => {
                  haptic("tap");
                  params.setSoundEnabled(!params.soundEnabled);
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                  params.soundEnabled ? "bg-[#2dd4bf] text-[#042f2e]" : "bg-[#1e293b] text-[#64748b]"
                }`}
              >
                {params.soundEnabled ? "ВКЛ" : "ВЫКЛ"}
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 3: QA & REPORT ================= */}
        {activeSidebarTab === "qa" && (
          <div className="px-3 flex flex-col gap-3 pb-4">
            {/* Viewports */}
            <div className="p-3 rounded-[16px] bg-[#121c32] border border-[#223356] flex flex-col gap-2">
              <div className="text-[11px] font-black text-[#2dd4bf] uppercase tracking-wider flex items-center gap-1.5">
                <IconGear className="w-3.5 h-3.5" /> Мобильные пропорции экрана
              </div>
              <div className="flex flex-col gap-1.5">
                {VIEWPORTS.map((vp) => (
                  <button
                    key={vp.name}
                    onClick={() => {
                      haptic("tap");
                      params.setViewportSize(vp);
                    }}
                    className={`p-2 rounded-[8px] text-[11px] font-bold text-left border transition-all flex items-center justify-between ${
                      params.viewportSize.name === vp.name
                        ? "bg-[#133e3c] border-[#2dd4bf] text-[#2dd4bf]"
                        : "bg-[#0d1424] border-[#1d273e] text-[#64748b] hover:text-white"
                    }`}
                  >
                    <span>{vp.name}</span>
                    <span className="text-[10px] opacity-75">{vp.w} × {vp.h}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Full Report Modal trigger */}
            <button
              onClick={params.onOpenReportModal}
              className="w-full py-2.5 rounded-[12px] bg-gradient-to-r from-[#25395c] to-[#1e2d47] border border-[#38bdf8]/50 text-[#38bdf8] font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#2a4066] active:translate-y-1 transition-all"
            >
              ОТКРЫТЬ ФИНАЛЬНЫЙ ОТЧЁТ (P01–P34, МАТРИЦА АССЕТОВ)
            </button>

            {/* QA Checklist */}
            <div className="p-3 rounded-[16px] bg-[#0d1627] border border-[#1d2b47] text-[11px] flex flex-col gap-1.5">
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-1">
                КРИТЕРИИ АНАЛИЗА И QA
              </div>
              <div className="flex items-center gap-1.5 text-[#94a3b8]">
                <IconCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" color="#34d399" />
                <span>0% эмодзи — 100% отрисованный SVG вектор</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#94a3b8]">
                <IconCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" color="#34d399" />
                <span>Образ японской свечи + форма клинка</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#94a3b8]">
                <IconCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" color="#34d399" />
                <span>Рукописный стиль со смайликом без стикера</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#94a3b8]">
                <IconCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" color="#34d399" />
                <span>Фиксированные пропорции моб. экрана без корпуса</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#94a3b8]">
                <IconCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" color="#34d399" />
                <span>Touch-friendly нажатия с виброотдачей (без hover)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[#1a253c] text-center text-[10px] text-[#475569] font-medium bg-[#070b16]">
        Signal Arena • Telegram Mini App • Production Ready
      </div>
    </aside>
  );
}
