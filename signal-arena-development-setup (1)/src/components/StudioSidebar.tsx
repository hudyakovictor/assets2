import {
  HandDrawnSmileyIcon,
  SlidersIcon,
  CrossedCandlestickSwordsIcon,
  EyeIcon,
  WhaleIcon,
  GearIcon,
} from "./icons";
import { playTapSound, toggleSound } from "../utils/audio";

export type ViewportMode = {
  id: string;
  name: string;
  w: number;
  h: number;
  tag: string;
};

export const GAME_VIEWPORTS: ViewportMode[] = [
  { id: "390x844", name: "390 × 844", w: 390, h: 844, tag: "MAIN" },
  { id: "360x800", name: "360 × 800", w: 360, h: 800, tag: "ANDROID" },
  { id: "412x915", name: "412 × 915", w: 412, h: 915, tag: "PIXEL" },
  { id: "320x568", name: "320 × 568", w: 320, h: 568, tag: "COMPACT" },
  { id: "300x620", name: "300 × 620", w: 300, h: 620, tag: "MVP 15/31" },
];

export type StudioSidebarProps = {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
  selectedVp: ViewportMode;
  onVpChange: (vp: ViewportMode) => void;
  currentVariant: "A" | "B" | "C" | "D";
  onVariantChange: (v: "A" | "B" | "C" | "D") => void;
  scenarioPair: string;
  onScenarioPairChange: (pair: string) => void;
  soundOn: boolean;
  onToggleSound: () => void;
  className?: string;
  onCloseMobile?: () => void;
};

export function StudioSidebar({
  activeScreen,
  onScreenChange,
  selectedVp,
  onVpChange,
  currentVariant,
  onVariantChange,
  scenarioPair,
  onScenarioPairChange,
  soundOn,
  onToggleSound,
  className = "",
  onCloseMobile,
}: StudioSidebarProps) {
  return (
    <aside
      className={`w-[320px] shrink-0 bg-[#0E1624]/95 border-r border-[#1D2C40] flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-md ${className}`}
    >
      {/* ---------------- Шапка сайдбара ---------------- */}
      <div className="shrink-0 p-3.5 border-b border-[#1A283C] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2EE6C8] to-[#128F7C] flex items-center justify-center text-[#06241F] shadow-[0_0_12px_rgba(46,230,200,0.4)]">
            <CrossedCandlestickSwordsIcon size={20} />
          </div>
          <div>
            <h1 className="font-black text-[13.5px] text-white tracking-tight leading-tight">
              Signal Arena
            </h1>
            <p className="text-[10px] font-bold text-[#2EE6C8] tracking-wider uppercase">
              Game Dev Motion Board
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="w-7 h-7 rounded-lg bg-[#182436] border border-[#2B3E57] flex items-center justify-center text-white text-[14px] lg:hidden"
          >
            ✕
          </button>
        )}
      </div>

      {/* ---------------- Прокручиваемый контент параметров ---------------- */}
      <div className="flex-1 min-h-0 custom-scroll p-3.5 space-y-4">
        {/* ================= РУКОПИСНАЯ ЗАМЕТКА ТРЕЙДЕРА (БЕЗ СТИКЕРА) ================= */}
        <div className="relative p-3.5 rounded-2xl bg-[#09111C]/80 border border-[#1D3249] shadow-[inset_0_1px_0_rgba(46,230,200,0.15)] overflow-hidden">
          {/* Декоративное мягкое бирюзовое свечение */}
          <div className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#2EE6C8]/10 blur-xl" />

          <p className="text-[9px] font-black tracking-widest text-[#567496] uppercase mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EE6C8]" />
            MEMENTO TRADER · РУКОПИСНАЯ ЗАМЕТКА
          </p>

          <div className="flex items-end justify-between gap-2 mt-1">
            {/* Тот самый рукописный текст с прикрепленного референса */}
            <div className="handwritten-text text-[15px] font-extrabold text-[#2EE6C8] leading-snug drop-shadow-[0_1px_6px_rgba(46,230,200,0.35)]">
              <div>IF YOU'RE HERE,</div>
              <div>JUST FOR MONEY,</div>
              <div>YOU'RE EARLY.</div>
              <div className="text-[#65F2DA]">AND THAT'S BAD.</div>
            </div>

            {/* Рукописный смайлик от руки */}
            <div className="shrink-0 text-[#2EE6C8] transform rotate-3 drop-shadow-[0_0_8px_rgba(46,230,200,0.4)]">
              <HandDrawnSmileyIcon size={38} />
            </div>
          </div>
        </div>

        {/* ================= 1. ПРОПОРЦИИ И ВЬЮПОРТЫ МОБИЛЬНОЙ ИГРЫ ================= */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black tracking-wider text-[#7992AF] uppercase flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <EyeIcon size={13} className="text-[#2EE6C8]" />
              ПРОПОРЦИИ ЭКРАНА ИГРЫ
            </span>
            <span className="text-[9px] font-mono text-[#2EE6C8] font-bold">
              НЕ РАСТЯГИВАТЬ
            </span>
          </label>

          <div className="grid grid-cols-2 gap-1.5">
            {GAME_VIEWPORTS.map((vp) => (
              <button
                key={vp.id}
                onClick={() => {
                  playTapSound();
                  onVpChange(vp);
                }}
                className={`tactile-btn p-2 rounded-xl text-left border transition-all ${
                  selectedVp.id === vp.id
                    ? "bg-[#183636] border-[#2EE6C8] text-white shadow-[0_0_12px_rgba(46,230,200,0.25)]"
                    : "bg-[#121B28] border-[#202E42] text-[#869DB8] hover:border-[#2C405B]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-[11.5px] leading-tight">
                    {vp.name}
                  </span>
                  <span
                    className={`text-[8px] font-black px-1.5 py-0.2 rounded ${
                      selectedVp.id === vp.id
                        ? "bg-[#2EE6C8] text-[#0A2622]"
                        : "bg-[#1C2838] text-[#69829E]"
                    }`}
                  >
                    {vp.tag}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ================= 2. ВАРИАНТЫ ДИЗАЙНА (A / B / C / D) ================= */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black tracking-wider text-[#7992AF] uppercase flex items-center justify-between">
            <span>ВАРИАНТ СЕТАПА</span>
            <span className="text-[9px] font-mono text-[#2EE6C8]">
              {currentVariant} · PRESET
            </span>
          </label>

          <div className="grid grid-cols-4 gap-1.5">
            {(["A", "B", "C", "D"] as const).map((v) => (
              <button
                key={v}
                onClick={() => {
                  playTapSound();
                  onVariantChange(v);
                }}
                className={`tactile-btn py-2 rounded-xl font-black text-[13px] border transition-all ${
                  currentVariant === v
                    ? "bg-[#2EE6C8] border-[#4BF3D8] text-[#05231E] shadow-[0_0_14px_rgba(46,230,200,0.4)]"
                    : "bg-[#121B28] border-[#202E42] text-[#869DB8] hover:border-[#2C405B]"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* ================= 3. БЫСТРЫЙ ПЕРЕХОД ПО ЭКРАНАМ ИГРЫ ================= */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black tracking-wider text-[#7992AF] uppercase flex items-center gap-1.5">
            <SlidersIcon size={13} className="text-[#2EE6C8]" />
            ЭКРАНЫ TELEGRAM MINI APP
          </label>

          <div className="space-y-1">
            {[
              { id: "arena", label: "Арена · Боевой терминал", badge: "CORE" },
              { id: "tournaments", label: "Турниры · Bull Run Blitz", badge: "PVP" },
              { id: "academy", label: "Академия · Мечи-свечи", badge: "XP" },
              { id: "collection", label: "Колода · 40 карт навыков", badge: "DECK" },
              { id: "more", label: "Профиль · Статистика и звук", badge: "USER" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  playTapSound();
                  onScreenChange(s.id);
                }}
                className={`tactile-btn w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                  activeScreen === s.id
                    ? "bg-[#183636] border-[#2EE6C8] text-[#E7FFF9] shadow-[0_0_12px_rgba(46,230,200,0.2)]"
                    : "bg-[#121B28] border-[#202E42] text-[#89A1BD] hover:border-[#2C405B]"
                }`}
              >
                <span className="font-extrabold text-[12px]">{s.label}</span>
                <span
                  className={`text-[8.5px] font-mono font-black px-1.5 py-0.5 rounded ${
                    activeScreen === s.id
                      ? "bg-[#2EE6C8] text-[#0A2622]"
                      : "bg-[#1B2738] text-[#69829E]"
                  }`}
                >
                  {s.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ================= 4. ПАРАМЕТРЫ СЦЕНАРИЯ И СТАКАНА ================= */}
        <div className="space-y-2 p-3 rounded-2xl bg-[#0B1320] border border-[#1A283C]">
          <p className="text-[9.5px] font-black tracking-wider text-[#7E96B3] uppercase">
            ДАННЫЕ ИСТОРИЧЕСКОГО РАУНДА
          </p>

          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-[#849DB8] font-bold">Сценарий:</span>
            <div className="flex items-center gap-1">
              {["BTC/USDT", "SOL/USDT", "ETH/USDT"].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    playTapSound();
                    onScenarioPairChange(p);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                    scenarioPair === p
                      ? "bg-[#2EE6C8] text-[#072520]"
                      : "bg-[#172334] text-[#849DB8]"
                  }`}
                >
                  {p.split("/")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-[#849DB8] font-bold">Китовая стена:</span>
            <span className="font-mono text-[#A58FF0] font-black flex items-center gap-1">
              <WhaleIcon size={14} /> 1 850 BTC
            </span>
          </div>

          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-[#849DB8] font-bold">Спред стакана:</span>
            <span className="font-mono text-[#50C890] font-black">0.02%</span>
          </div>

          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-[#849DB8] font-bold">Объём сессии:</span>
            <span className="font-mono text-[#D95D56] font-black">ВЫГАС (LOW)</span>
          </div>
        </div>

        {/* ================= 5. АУДИО И ИНСПЕКТОР ================= */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B1320] border border-[#1A283C]">
          <div className="flex items-center gap-2">
            <GearIcon size={16} className="text-[#2EE6C8]" />
            <span className="text-[11.5px] font-bold text-white">
              Звуки мечей и монет
            </span>
          </div>
          <button
            onClick={() => {
              toggleSound();
              onToggleSound();
              playTapSound();
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
              soundOn ? "bg-[#2EE6C8] text-[#05231E]" : "bg-[#1E2C3E] text-[#6E87A5]"
            }`}
          >
            {soundOn ? "ВКЛ" : "ВЫКЛ"}
          </button>
        </div>
      </div>

      {/* ---------------- Подвал сайдбара ---------------- */}
      <div className="shrink-0 p-3 bg-[#09101A] border-t border-[#182638] flex items-center justify-between text-[10px] font-mono text-[#5A7492]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#50C890] shadow-[0_0_6px_#50C890]" />
          <span>NO-SCROLL QA 100%</span>
        </div>
        <span className="text-[#2EE6C8]">P01–P34 READY</span>
      </div>
    </aside>
  );
}
