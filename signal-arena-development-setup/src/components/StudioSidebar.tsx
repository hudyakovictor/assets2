import { useMemo, useState } from "react";
import { PAGES, variantsOf, findPage } from "../lib/pages";
import {
  HandDrawnSmileyIcon,
  SlidersIcon,
  CrossedCandlestickSwordsIcon,
  EyeIcon,
  WhaleIcon,
  GearIcon,
  SearchIcon,
  DownloadIcon,
  CheckmarkIcon,
  BoltIcon,
  CloseIcon,
} from "./icons";
import { playTapSound } from "../utils/audio";

export type ViewportMode = {
  id: string;
  name: string;
  w: number;
  h: number;
  tag: string;
};

export const GAME_VIEWPORTS: ViewportMode[] = [
  { id: "390x844", name: "390 × 844", w: 390, h: 844, tag: "MAIN" },
  { id: "360x800", name: "360 × 800", w: 360, h: 800, tag: "QA" },
  { id: "412x915", name: "412 × 915", w: 412, h: 915, tag: "QA" },
  { id: "320x568", name: "320 × 568", w: 320, h: 568, tag: "QA" },
  { id: "300x620", name: "300 × 620", w: 300, h: 620, tag: "MVP" },
];

export type StudioSidebarProps = {
  pageId: string;
  onPageChange: (id: string) => void;
  variant: "A" | "B" | "C" | "D";
  onVariantChange: (v: "A" | "B" | "C" | "D") => void;
  selectedVp: ViewportMode;
  onVpChange: (vp: ViewportMode) => void;
  scenarioPair: string;
  onScenarioPairChange: (p: string) => void;
  soundOn: boolean;
  onToggleSound: () => void;
  qaOk: boolean;
  qaDetail: string;
  onOpenReport: () => void;
  onCloseMobile?: () => void;
};

export function StudioSidebar(props: StudioSidebarProps) {
  const {
    pageId,
    onPageChange,
    variant,
    onVariantChange,
    selectedVp,
    onVpChange,
    scenarioPair,
    onScenarioPairChange,
    soundOn,
    onToggleSound,
    qaOk,
    qaDetail,
    onOpenReport,
    onCloseMobile,
  } = props;

  const [query, setQuery] = useState("");
  const page = findPage(pageId) ?? PAGES[0];
  const idx = PAGES.findIndex((p) => p.id === pageId);

  const step = (d: number) => {
    const n = PAGES[(idx + d + PAGES.length) % PAGES.length];
    onPageChange(n.id);
  };

  const sections = useMemo(() => {
    const s = query.trim().toLowerCase();
    const list = s
      ? PAGES.filter((p) =>
          `${p.id} ${p.title} ${p.section} ${p.state}`.toLowerCase().includes(s)
        )
      : PAGES;
    const m = new Map<string, typeof PAGES>();
    list.forEach((p) => {
      if (!m.has(p.section)) m.set(p.section, []);
      m.get(p.section)!.push(p);
    });
    return [...m.entries()];
  }, [query]);

  return (
    <aside className="w-[258px] shrink-0 h-full bg-[#0D1521]/97 border-r border-[#1D2C40] flex flex-col overflow-hidden backdrop-blur-md shadow-2xl">
      {/* ---------- Шапка ---------- */}
      <div className="shrink-0 p-3.5 border-b border-[#1A283C] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2EE6C8] to-[#128F7C] flex items-center justify-center shadow-[0_0_16px_rgba(46,230,200,0.45)]">
            <CrossedCandlestickSwordsIcon size={22} />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-[14px] text-white leading-tight">
              Signal Arena
            </h1>
            <p className="text-[9px] font-black tracking-[0.18em] text-[#2EE6C8] uppercase">
              Studio · Motion Board
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              playTapSound();
              onOpenReport();
            }}
            className="tactile-btn w-8 h-8 rounded-lg bg-[#16202F] border border-[#2B3E57] flex items-center justify-center text-[#8FA2BA]"
            title="Production Report · Asset Matrix CSV"
          >
            <DownloadIcon size={15} />
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="tactile-btn w-8 h-8 rounded-lg bg-[#16202F] border border-[#2B3E57] flex items-center justify-center text-[#8FA2BA] lg:hidden"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ---------- Контент ---------- */}
      <div className="flex-1 min-h-0 custom-scroll p-3.5 space-y-4">
        {/* Рукописная заметка трейдера + смайлик (без стикера) */}
        <div className="relative p-3.5 rounded-2xl bg-[#0A121D] border border-[#1D3249] overflow-hidden">
          <div className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#2EE6C8]/10 blur-2xl" />
          <p className="text-[8.5px] font-black tracking-[0.22em] text-[#4E6C8E] uppercase mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EE6C8]" />
            Memento Trader
          </p>
          <div className="flex items-end justify-between gap-2">
            <p className="handwritten-text text-[16.5px] font-bold text-[#2EE6C8] drop-shadow-[0_1px_8px_rgba(46,230,200,0.4)]">
              If you're here
              <br />
              just for money,
              <br />
              you're early.
              <br />
              <span className="text-[#6CF5E0]">And that's bad.</span>
            </p>
            <div className="shrink-0 text-[#2EE6C8] rotate-6 drop-shadow-[0_0_10px_rgba(46,230,200,0.5)]">
              <HandDrawnSmileyIcon size={40} />
            </div>
          </div>
        </div>

        {/* 1. Пропорции экрана */}
        <div className="space-y-1.5">
          <label className="text-[9.5px] font-black tracking-[0.16em] text-[#67809C] uppercase flex items-center gap-1.5">
            <EyeIcon size={13} className="text-[#2EE6C8]" /> Пропорции экрана
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {GAME_VIEWPORTS.map((vp) => (
              <button
                key={vp.id}
                onClick={() => {
                  playTapSound();
                  onVpChange(vp);
                }}
                className={`tactile-btn p-2 rounded-xl border text-left ${
                  selectedVp.id === vp.id
                    ? "bg-[#123B38] border-[#2EE6C8] shadow-[0_0_14px_rgba(46,230,200,0.25)]"
                    : "bg-[#111B29] border-[#1F2E42]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono font-black text-[11px] ${
                      selectedVp.id === vp.id ? "text-white" : "text-[#869DB8]"
                    }`}
                  >
                    {vp.name}
                  </span>
                  <span
                    className={`text-[7.5px] font-black px-1.5 py-0.5 rounded ${
                      selectedVp.id === vp.id
                        ? "bg-[#2EE6C8] text-[#062B25]"
                        : "bg-[#1A2637] text-[#5E7694]"
                    }`}
                  >
                    {vp.tag}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Варианты A–D */}
        <div className="space-y-1.5">
          <label className="text-[9.5px] font-black tracking-[0.16em] text-[#67809C] uppercase flex items-center justify-between">
            <span>Asset-вариант страницы</span>
            <span className="font-mono text-[#2EE6C8]">
              {page.id}-{variant}
            </span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(["A", "B", "C", "D"] as const).map((v) => {
              const vv = variantsOf(page).find((x) => x.letter === v);
              return (
                <button
                  key={v}
                  onClick={() => {
                    playTapSound();
                    onVariantChange(v);
                  }}
                  className={`tactile-btn py-2 rounded-xl border font-display font-extrabold text-[12px] ${
                    variant === v
                      ? "bg-[#2EE6C8] border-[#6CF5E0] text-[#062B25] shadow-[0_0_16px_rgba(46,230,200,0.45)]"
                      : "bg-[#111B29] border-[#1F2E42] text-[#869DB8]"
                  }`}
                  title={vv ? `${vv.assetId} · ${vv.chart} · ${vv.motion}` : ""}
                >
                  {v}
                </button>
              );
            })}
          </div>
          <p className="font-mono text-[9px] text-[#56708C] leading-snug">
            {(() => {
              const vv = variantsOf(page).find((x) => x.letter === variant);
              return vv
                ? `asset: ${vv.assetId} · chart: ${vv.chart} · motion: ${vv.motion} · tint ${vv.tint}`
                : "";
            })()}
          </p>
        </div>

        {/* 3. Сценарий */}
        <div className="space-y-1.5">
          <label className="text-[9.5px] font-black tracking-[0.16em] text-[#67809C] uppercase flex items-center gap-1.5">
            <WhaleIcon size={13} className="text-[#A58FF0]" /> Исторический сценарий
          </label>
          <div className="flex items-center gap-1.5">
            {["BTC/USDT", "SOL/USDT", "ETH/USDT"].map((p) => (
              <button
                key={p}
                onClick={() => {
                  playTapSound();
                  onScenarioPairChange(p);
                }}
                className={`tactile-btn flex-1 py-1.5 rounded-lg font-mono font-black text-[10px] ${
                  scenarioPair === p
                    ? "bg-[#2EE6C8] text-[#062B25]"
                    : "bg-[#111B29] text-[#869DB8] border border-[#1F2E42]"
                }`}
              >
                {p.split("/")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Page Inventory P01–P34 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[9.5px] font-black tracking-[0.16em] text-[#67809C] uppercase flex items-center gap-1.5">
              <SlidersIcon size={13} className="text-[#2EE6C8]" /> Page Inventory
            </label>
            <span className="font-mono text-[9px] font-black text-[#2EE6C8] bg-[#2EE6C8]/10 px-1.5 py-0.5 rounded border border-[#2EE6C8]/30">
              {PAGES.length}/34
            </span>
          </div>

          <div className="flex gap-1.5">
            <div className="flex-1 flex items-center gap-1.5 px-2 rounded-lg bg-[#0B1320] border border-[#1F2E42]">
              <SearchIcon size={13} className="text-[#56708C] shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск: P07, reveal, decision…"
                className="w-full bg-transparent py-1.5 text-[10.5px] font-semibold text-white placeholder:text-[#45607E] outline-none"
              />
            </div>
            <button
              onClick={() => {
                playTapSound();
                step(-1);
              }}
              className="tactile-btn w-8 rounded-lg bg-[#111B29] border border-[#1F2E42] text-[#869DB8] font-black text-[13px]"
            >
              ‹
            </button>
            <button
              onClick={() => {
                playTapSound();
                step(1);
              }}
              className="tactile-btn w-8 rounded-lg bg-[#111B29] border border-[#1F2E42] text-[#869DB8] font-black text-[13px]"
            >
              ›
            </button>
          </div>

          <div className="space-y-2.5">
            {sections.map(([section, list]) => (
              <div key={section}>
                <p className="text-[8px] font-black tracking-[0.18em] text-[#4E6C8E] uppercase pb-1">
                  {section}
                </p>
                <div className="space-y-1">
                  {list.map((p) => {
                    const on = p.id === pageId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          playTapSound();
                          onPageChange(p.id);
                        }}
                        className={`tactile-btn w-full px-2 py-1.5 rounded-xl border text-left flex items-center gap-2 ${
                          on
                            ? "bg-[#123B38] border-[#2EE6C8] shadow-[0_0_12px_rgba(46,230,200,0.22)]"
                            : "bg-[#0E1724] border-[#1A2838]"
                        }`}
                      >
                        <span
                          className={`font-mono font-black text-[9.5px] shrink-0 ${
                            on ? "text-[#2EE6C8]" : "text-[#56708C]"
                          }`}
                        >
                          {p.id}
                        </span>
                        <span
                          className={`flex-1 truncate text-[10.5px] font-bold ${
                            on ? "text-white" : "text-[#93A9C2]"
                          }`}
                        >
                          {p.title}
                        </span>
                        {!p.topBar && (
                          <span className="text-[7px] font-black px-1 py-0.5 rounded bg-[#D95D56]/20 text-[#FF8F87]">
                            NO TB
                          </span>
                        )}
                        {on && <CheckmarkIcon size={11} className="text-[#2EE6C8] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Звук */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B1320] border border-[#1A283C]">
          <div className="flex items-center gap-2">
            <GearIcon size={15} className="text-[#2EE6C8]" />
            <span className="text-[11px] font-bold text-white">Web Audio · мечи и монеты</span>
          </div>
          <button
            onClick={() => {
              onToggleSound();
              playTapSound();
            }}
            className={`tactile-btn px-2.5 py-1 rounded-lg text-[9.5px] font-black uppercase tracking-wider ${
              soundOn ? "bg-[#2EE6C8] text-[#062B25]" : "bg-[#1A2637] text-[#6E87A5]"
            }`}
          >
            {soundOn ? "Вкл" : "Выкл"}
          </button>
        </div>
      </div>

      {/* ---------- Подвал: QA ---------- */}
      <div className="shrink-0 p-2.5 bg-[#09101A] border-t border-[#182638]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                qaOk ? "bg-[#50C890] shadow-[0_0_8px_#50C890]" : "bg-[#EB635B] shadow-[0_0_8px_#EB635B]"
              }`}
            />
            <span className="font-mono text-[9px] font-black text-[#8FA2BA]">
              NO-SCROLL QA {qaOk ? "PASS" : "FAIL"}
            </span>
          </div>
          <span className="font-mono text-[8.5px] text-[#56708C]">{qaDetail}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <BoltIcon size={11} className="text-[#F5BE38]" />
          <span className="font-mono text-[8.5px] text-[#56708C]">
            TOUCH-ONLY · ZERO HOVER DEPENDENCY · P01–P34
          </span>
        </div>
      </div>
    </aside>
  );
}
