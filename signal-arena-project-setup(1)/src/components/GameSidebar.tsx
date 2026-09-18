import { useState } from "react";
import { TraderGraffitiQuote, IconWhale, IconWarning } from "./icons";
import { sound } from "../utils/sound";
import { PAGES } from "../data/pages";
import { ui, useUi } from "../game/ui";

interface Props {
  mode: "game" | "onboarding" | "studio" | "export";
  onModeChange: (m: "game" | "onboarding" | "studio" | "export") => void;
  pageIndex: number;
  onSelectPage: (idx: number) => void;
  variantIndex: number;
  onSelectVariant: (vIdx: number) => void;
  viewportId: string;
  onViewportChange: (vpId: string) => void;
}

const PAIRS = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "LUNA/2022"];

const VARIANT_HINTS = [
  "Базовый HUD: терминал, карты, решения",
  "Сплит-режим: график и стакан вместе",
  "Фокус на колоде приёмов",
  "Тактический грид: решения в центре",
];

// ASSET_ARCHIVE_NOT_EXTRACTED — архивы есть в репозитории, но среда не распаковала бинарные zip.
// Это НЕ MISSING_ASSET: перечислены архивы, чьё содержимое не проверено попиксельно.
const MISSING = [
  "ASSET_ARCHIVE_NOT_EXTRACTED: topbar.zip",
  "ASSET_ARCHIVE_NOT_EXTRACTED: skill-card-icons.zip",
  "ASSET_ARCHIVE_NOT_EXTRACTED: assets.zip",
  "— внутри ожидаются: topbar.html",
  "lightning.svg",
  "star.svg",
  "coin.svg",
  "bell.svg",
  "gear.svg",
  "skill-card-icons.zip → c01–c40.svg",
];

export default function GameSidebar({
  mode,
  onModeChange,
  pageIndex,
  onSelectPage,
  variantIndex,
  onSelectVariant,
  viewportId,
  onViewportChange,
}: Props) {
  const [soundOn, setSoundOn] = useState(true);
  const [showMissing, setShowMissing] = useState(false);
  // Real, connected controls — they drive the game, not decoration.
  const { pair, proTerms, timeframe } = useUi();
  const setPair = (p: string) => ui.set({ pair: p });

  const page = PAGES[pageIndex] ?? PAGES[0];
  const variants = page.variants;

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    sound.enabled = next;
    if (next) sound.coin();
  }

  return (
    <div
      className="flex h-full w-full flex-col gap-3 overflow-y-auto p-3.5 text-white no-scrollbar md:select-none"
      style={{ background: "linear-gradient(180deg,#131b29 0%,#0d121c 100%)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div
          className="grid h-8 w-8 place-items-center rounded-xl"
          style={{ background: "linear-gradient(145deg,#26e6c8,#189e87)", boxShadow: "0 4px 12px rgba(38,230,200,.35)" }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#04221c]" fill="currentColor">
            <path d="M4 17l4-6 3 3 4-8 3 5" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-[13.5px] font-black">SIGNAL ARENA</div>
          <div className="text-[9.5px] font-extrabold uppercase tracking-widest text-[#26e6c8]">
            Telegram Mini App · MVP
          </div>
        </div>
      </div>

      {/* Handwritten English note, no sticker, with hand-drawn smiley */}
      <div className="rounded-2xl p-3" style={{ background: "rgba(38,230,200,.04)", border: "1.5px dashed rgba(38,230,200,.28)" }}>
        <div className="mb-1 text-[9.5px] font-black uppercase tracking-wider text-[#6d8fae]">
          TRADER NOTE
        </div>
        <TraderGraffitiQuote />
      </div>

      {/* Pages */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10.5px] font-black uppercase tracking-wider text-[#7999b8]">
          <span>Страницы P01–P34</span>
          <span className="text-[#26e6c8] tabular-nums">{pageIndex + 1}/{PAGES.length}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { sound.click(); onSelectPage(pageIndex - 1); }}
            disabled={pageIndex === 0}
            className="btn-3d grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#1b2537] text-[14px] font-black text-white disabled:opacity-30"
            style={{ border: "1px solid #26364e" }}
          >
            ‹
          </button>
          <select
            value={pageIndex}
            onChange={(e) => { sound.click(); onSelectPage(Number(e.target.value)); }}
            className="h-9 min-w-0 flex-1 rounded-xl border border-[#2f425e] bg-[#1a2538] px-2 text-[12px] font-bold text-white outline-none"
          >
            {PAGES.map((p, idx) => (
              <option key={p.id} value={idx}>
                {p.id} · {p.frame} · {p.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => { sound.click(); onSelectPage(pageIndex + 1); }}
            disabled={pageIndex === PAGES.length - 1}
            className="btn-3d grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#1b2537] text-[14px] font-black text-white disabled:opacity-30"
            style={{ border: "1px solid #26364e" }}
          >
            ›
          </button>
        </div>

        <div className="rounded-xl border border-[#26364e] bg-[#151f30] px-2.5 py-2 text-[11px] leading-snug">
          <div className="font-black text-white">{page.title}</div>
          <div className="text-[#7f95b5]">{page.state}</div>
          <div className="mt-0.5 text-[10px] text-[#5f748f]">{page.source}</div>
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-2">
        <div className="text-[10.5px] font-black uppercase tracking-wider text-[#7999b8]">
          Версии компоновки
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {variants.map((vr, i) => {
            const on = i === variantIndex;
            return (
              <button
                key={vr.id}
                onClick={() => { sound.pop(); onSelectVariant(i); }}
                className="btn-3d rounded-xl px-2 py-2 text-left"
                style={{
                  background: on ? "linear-gradient(180deg,#2ea398,#1e756c)" : "#182335",
                  border: on ? "1.5px solid #43ded0" : "1px solid #26364e",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="grid h-5 w-5 place-items-center rounded-md text-[10px] font-black"
                    style={{ background: on ? "#fff" : "#111824", color: on ? "#0c2e22" : "#8ca0bd" }}
                  >
                    {"ABCD"[i]}
                  </span>
                  <span className="text-[10.5px] font-black uppercase" style={{ color: on ? "#fff" : "#8ca0bd" }}>
                    {vr.layoutMode}
                  </span>
                </div>
                <div className="mt-1 text-[9.5px] leading-snug" style={{ color: on ? "#d6fff5" : "#66799a" }}>
                  {VARIANT_HINTS[i]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario */}
      <div className="space-y-2">
        <div className="text-[10.5px] font-black uppercase tracking-wider text-[#7999b8]">
          Параметры сценария
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {PAIRS.map((p) => (
            <button
              key={p}
              onClick={() => { sound.click(); setPair(p); }}
              className="btn-3d rounded-xl py-1.5 text-[10.5px] font-black uppercase"
              style={{
                background: pair === p ? "#2ea398" : "#182335",
                color: pair === p ? "#fff" : "#7f94b4",
                border: pair === p ? "1.5px solid #43ded0" : "1px solid #26364e",
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-1.5 rounded-xl border border-[#26364e] bg-[#151f30] p-2.5 text-[11px]">
          <Row k="Таймфрейм" v={timeframe} />
          <Row k="Китовая стена" v="$67 820" accent="#ab7eff" whale />
          <Row k="Событие" v="Ложный пробой" accent="#ffbe3b" />
        </div>
      </div>

      {/* Viewports */}
      <div className="space-y-2">
        <div className="text-[10.5px] font-black uppercase tracking-wider text-[#7999b8]">
          Пропорции экрана игры
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "390×844", label: "390×844" },
            { id: "360×800", label: "360×800" },
            { id: "412×915", label: "412×915" },
            { id: "320×568", label: "320×568" },
            { id: "300×620", label: "300×620 MVP" },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => { sound.click(); onViewportChange(v.id); }}
              className="btn-3d rounded-xl py-1.5 text-[10px] font-extrabold uppercase"
              style={{
                background: viewportId === v.id ? "#2ea398" : "#172233",
                color: viewportId === v.id ? "#fff" : "#748ca8",
                border: viewportId === v.id ? "1.5px solid #43ded0" : "1px solid #26364e",
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Asset status — mandatory disclosure */}
      <div className="rounded-2xl border border-[#5a4520] bg-[#241d0f]">
        <button
          onClick={() => { sound.click(); setShowMissing((s) => !s); }}
          className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
        >
          <IconWarning className="h-4 w-4 shrink-0 text-[#ffbe3b]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#ffbe3b]">
            ASSET_ARCHIVE_NOT_EXTRACTED
          </span>
          <span className="ml-auto text-[11px] text-[#8a7a58]">{showMissing ? "▲" : "▼"}</span>
        </button>
        {showMissing && (
          <div className="border-t border-[#5a4520] px-3 py-2.5">
            <p className="text-[10.5px] leading-relaxed text-[#c8b78d]">
              Архивы присутствуют в репозитории, но среда не извлекла их содержимое (бинарные zip).
              Это статус ASSET_ARCHIVE_NOT_EXTRACTED, а не MISSING_ASSET. Текущие иконки —
              явные временные векторные заглушки; они не выдаются за оригиналы.
            </p>
            <ul className="mt-2 space-y-1">
              {MISSING.map((m) => (
                <li key={m} className="rounded-md bg-[#1a150b] px-2 py-1 font-mono text-[9.5px] text-[#e3cf9f]">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer toggles */}
      <div className="mt-auto space-y-2 border-t border-[#22314a] pt-3">
        <ToggleRow label="Звуковые эффекты" on={soundOn} onToggle={toggleSound} />
        <ToggleRow
          label="Язык терминов"
          on={proTerms}
          onToggle={() => { sound.click(); ui.set({ proTerms: !proTerms }); }}
          onText="ПРО"
          offText="БЫТОВОЙ"
        />
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {(["game", "onboarding", "studio", "export"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { sound.click(); onModeChange(m); }}
              className="btn-3d rounded-xl py-2 text-[10px] font-black uppercase"
              style={{
                background: mode === m ? "linear-gradient(180deg,#45ead0,#1da994)" : "#1b2537",
                color: mode === m ? "#04221c" : "#899eb9",
                border: mode === m ? "1.5px solid #75f4e0" : "1px solid #26364e",
              }}
            >
              {{ game: "Арена", onboarding: "Кадры 1–15", studio: "Студия", export: "Экспорт" }[m]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, accent, whale }: { k: string; v: string; accent?: string; whale?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-bold text-[#748ca8]">{k}</span>
      <span className="flex items-center gap-1 font-black" style={{ color: accent ?? "#fff" }}>
        {whale && <IconWhale className="h-3 w-3" />}
        {v}
      </span>
    </div>
  );
}

function ToggleRow({
  label, on, onToggle, onText = "ВКЛ", offText = "ВЫКЛ",
}: { label: string; on: boolean; onToggle: () => void; onText?: string; offText?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11.5px] font-bold text-[#899fb9]">{label}</span>
      <button
        onClick={onToggle}
        aria-pressed={on}
        className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase"
        style={{
          background: on ? "#1a3a34" : "#242d3c",
          color: on ? "#3fe0a5" : "#6c809e",
          border: on ? "1px solid #3fe0a5" : "1px solid #3a475d",
        }}
      >
        {on ? onText : offText}
      </button>
    </div>
  );
}
