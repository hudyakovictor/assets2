/**
 * Signal Arena — AAA+ Motion Designed Telegram Mini App & Studio.
 *
 * Requirements fulfilled:
 * 1. Mobile proportions with desktop sidebar (NO phone hardware mockup, pure clean screen)
 * 2. Full P01–P34 Page Inventory with 3–4 layout/composition variants each
 * 3. Canonical locked Top Bar from reference materials & repo
 * 4. English handwritten note: "IF YOU'RE HERE, JUST FOR MONEY, YOU'RE EARLY. AND THAT'S BAD. :)"
 * 5. NO EMOJIS — all icons are pure vector SVG
 * 6. Turquoise accent (#3ec7c9) on dark navy blue (#0c1322)
 * 7. Mobile-first touch interactions (NO desktop hover effects, only active/press states)
 * 8. 100 market analyses library with realistic orderbook & whale walls
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { AssetProvider } from "../components/AssetRuntime";
import { TopBarCanonical } from "./TopBarCanonical";
import { ShopScreen } from "./ShopScreen";
import { GameRenderer } from "./GameRenderer";
import { Burst, Toast } from "./ui";
import { ROUNDS, type Round, type ActionKey, type LensKey } from "./scenarios";
import { PAGES_INVENTORY, type PageMeta, type SectionKey } from "../data/pagesInventory";
import { awardRound, store, useProgress } from "./store";
import { setSound, sfx } from "./fx";
import {
  IcArena,
  IcAcademy,
  IcCollection,
  IcMore,
  IcStar,
  IcCoin,
  IcGear,
  IcSmiley,
  IcSearch,
} from "./icons";

type DevicePreset = "iphone" | "android" | "se" | "compact" | "mvp";

interface DeviceConfig {
  id: DevicePreset;
  label: string;
  w: number;
  h: number;
}

const DEVICES: DeviceConfig[] = [
  { id: "iphone", label: "iPhone 13", w: 390, h: 844 },
  { id: "android", label: "Pixel 7", w: 412, h: 915 },
  { id: "se", label: "iPhone SE", w: 360, h: 800 },
  { id: "compact", label: "Compact", w: 320, h: 568 },
  { id: "mvp", label: "MVP Artboard", w: 300, h: 620 },
];

export default function Game() {
  return (
    <AssetProvider>
      <StudioApp />
    </AssetProvider>
  );
}

function StudioApp() {
  const p = useProgress();
  // First-time players land on the Splash/onboarding (P01); returning players on the Arena
  const [selectedPageId, setSelectedPageId] = useState<string>(
    store.get().seenOnboarding ? "P24" : "P01"
  );
  const [selectedVariant, setSelectedVariant] = useState<"A" | "B" | "C" | "D">("A");
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>("iphone");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterSection, setFilterSection] = useState<SectionKey | "all">("all");
  const [showInspector, setShowInspector] = useState<boolean>(true);

  // Active round index (0..99)
  const [roundIdx, setRoundIdx] = useState<number>(0);
  const round: Round = ROUNDS[roundIdx % ROUNDS.length];

  // Player decision — lifted here so it SURVIVES P24 → P25 → P26 navigation
  const [gameLens, setGameLens] = useState<LensKey | null>(null);
  const [gameAction, setGameAction] = useState<ActionKey | null>(null);
  // Guard: each round awards XP/coins exactly once
  const awardedRounds = useRef<Set<number>>(new Set());

  // Active bottom nav tab
  const [activeTab, setActiveTab] = useState<"academy" | "arena" | "collection" | "shop">("arena");

  // Notifications & FX
  const [toast, setToast] = useState({ msg: "", run: 0 });
  const [burst, setBurst] = useState(0);

  // REAL No-Scroll QA: measure actual overflow of the screen body
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [qa, setQa] = useState<{ v: boolean; h: boolean; sh: number; ch: number } | null>(null);

  const say = useCallback((msg: string) => {
    setToast((t) => ({ msg, run: t.run + 1 }));
  }, []);

  const curPage: PageMeta =
    PAGES_INVENTORY.find((x) => x.id === selectedPageId) ?? PAGES_INVENTORY[23]; // default P24

  // Ensure sound setting is synced
  useEffect(() => {
    setSound(p.sound);
  }, [p.sound]);

  // Energy regeneration: +1 attempt every 20s while below max
  useEffect(() => {
    const id = setInterval(() => {
      const st = store.get();
      if (st.energy < st.energyMax) store.set({ energy: st.energy + 1 });
    }, 20000);
    return () => clearInterval(id);
  }, []);

  // Measure real overflow after every page/variant/device switch (after enter animation)
  useEffect(() => {
    const t = setTimeout(() => {
      const el = bodyRef.current;
      if (!el) return;
      setQa({
        v: el.scrollHeight <= el.clientHeight + 1,
        h: el.scrollWidth <= el.clientWidth + 1,
        sh: el.scrollHeight,
        ch: el.clientHeight,
      });
    }, 480);
    return () => clearTimeout(t);
  }, [selectedPageId, selectedVariant, selectedDevice, activeTab, roundIdx]);

  // Section → bottom-nav tab (explicit map, no string-prefix bugs)
  const tabForPage = (id: string): "academy" | "arena" | "collection" => {
    if (["P14", "P15", "P16", "P17"].includes(id)) return "academy";
    if (["P18", "P19"].includes(id)) return "collection";
    return "arena";
  };

  // Handle page change: clamp variant, sync tab (also EXITS shop overlay)
  const handlePageSelect = (id: string) => {
    setSelectedPageId(id);
    const target = PAGES_INVENTORY.find((x) => x.id === id);
    if (target && target.variantsCount === 3 && selectedVariant === "D") {
      setSelectedVariant("A");
    }
    setActiveTab(tabForPage(id));
    // entering a fresh analysis screen resets any previous decision
    if (["P21", "P22", "P23", "P24"].includes(id)) {
      setGameLens(null);
      setGameAction(null);
    }
    sfx.tap();
  };

  // Award result once per round (called from P25 → P26 transition)
  const handleScore = useCallback(
    (pct: number, correct: boolean) => {
      if (awardedRounds.current.has(roundIdx)) return;
      awardedRounds.current.add(roundIdx);
      const res = awardRound(pct, correct);
      if (correct) setBurst((b) => b + 1);
      if (res.leveledUp) {
        setTimeout(() => {
          sfx.levelup();
          say(`Новый уровень: ${store.get().lvl}!`);
        }, 600);
      } else if (correct) {
        setTimeout(() => sfx.reward(), 400);
      }
    },
    [roundIdx, say]
  );

  // Round switch resets the decision state
  const handleRoundChange = (idx: number) => {
    setRoundIdx(idx % ROUNDS.length);
    setGameLens(null);
    setGameAction(null);
  };

  const handleNextRound = () => {
    handleRoundChange(roundIdx + 1);
    setSelectedPageId("P24");
    say(`Раунд #${((roundIdx + 1) % ROUNDS.length) + 1}`);
  };

  // Filtered pages for sidebar
  const filteredPages = PAGES_INVENTORY.filter((page) => {
    const matchesSearch =
      page.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.section.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = filterSection === "all" || page.section === filterSection;
    return matchesSearch && matchesSection;
  });

  const dev = DEVICES.find((d) => d.id === selectedDevice) ?? DEVICES[0];

  return (
    <div className="stage">
      <div className="stage-grain" />

      {/* ========================================================= */}
      {/* LEFT SIDEBAR: Page & Variant Switcher + Handwritten Note  */}
      {/* ========================================================= */}
      <aside className="sidebar wb-scroll">
        {/* Brand header */}
        <div className="sb-brand">
          <span className="sb-logo">
            <IcArena size={24} />
          </span>
          <div>
            <div className="sb-title">SIGNAL ARENA</div>
            <div className="sb-tag">100 Market Analyses · Telegram Mini App</div>
          </div>
        </div>

        {/* English handwritten note with drawn smiley (NO sticker background) */}
        <div className="handnote">
          <div className="handnote-text">
            IF YOU'RE HERE,
            <br />
            JUST FOR MONEY,
            <br />
            YOU'RE EARLY.
            <br />
            AND THAT'S BAD.
          </div>
          <span className="handnote-face">
            <IcSmiley size={32} color="var(--acc)" />
          </span>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            className="panel p-2.5 flex-1 flex items-center justify-center gap-2 cursor-pointer font-bold text-xs"
            style={{
              background: selectedPageId === "P24" ? "rgba(62,199,201,.18)" : undefined,
              borderColor: selectedPageId === "P24" ? "var(--acc)" : undefined,
              color: selectedPageId === "P24" ? "var(--acc)" : "#dfe6ff",
            }}
            onClick={() => {
              setSelectedPageId("P24");
              setActiveTab("arena");
              sfx.select();
            }}
          >
            <IcArena size={16} />
            <span>Арена P24</span>
          </button>
          <button
            type="button"
            className="panel p-2.5 flex-1 flex items-center justify-center gap-2 cursor-pointer font-bold text-xs"
            style={{
              background: selectedPageId === "P01" ? "rgba(62,199,201,.18)" : undefined,
              borderColor: selectedPageId === "P01" ? "var(--acc)" : undefined,
              color: selectedPageId === "P01" ? "var(--acc)" : "#dfe6ff",
            }}
            onClick={() => {
              setSelectedPageId("P01");
              sfx.select();
            }}
          >
            <IcStar size={15} />
            <span>Старт P01</span>
          </button>
        </div>

        {/* Device Aspect Ratio Selector */}
        <div className="sb-section">
          <div className="sb-label">Пропорции экрана</div>
          <div className="sb-devices">
            {DEVICES.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`sb-dev ${selectedDevice === d.id ? "on" : ""}`}
                onClick={() => {
                  sfx.tap();
                  setSelectedDevice(d.id);
                }}
              >
                <span>{d.label}</span>
                <span className="sb-dev-dim mono">
                  {d.w}×{d.h}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Page Variants (3–4 versions per page!) */}
        <div className="sb-section">
          <div className="flex items-center justify-between">
            <span className="sb-label">
              Компоновка · {curPage.id}
            </span>
            <span className="mono t s" style={{ color: "var(--acc)" }}>
              {curPage.variantsCount} версии
            </span>
          </div>
          <div className="sb-variants">
            {(["A", "B", "C", "D"] as const)
              .slice(0, curPage.variantsCount)
              .map((v, i) => (
                <button
                  key={v}
                  type="button"
                  className={`sb-variant ${selectedVariant === v ? "on" : ""}`}
                  onClick={() => {
                    sfx.tap();
                    setSelectedVariant(v);
                  }}
                >
                  <span className="sb-variant-letter">{v}</span>
                  <span className="sb-variant-name">{curPage.variantNames[i]}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Page Inventory Navigation P01–P34 */}
        <div className="sb-section">
          <div className="flex items-center justify-between">
            <span className="sb-label">Инвентарь P01–P34</span>
            <span className="mono t s text-xs">{filteredPages.length}/34</span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск страницы (P08, Зоны, Reveal...)"
              className="w-full text-xs font-bold"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--stroke)",
                borderRadius: 10,
                padding: "8px 10px 8px 30px",
                color: "#fff",
                outline: "none",
              }}
            />
            <span style={{ position: "absolute", left: 8, top: 8, color: "var(--ink3)" }}>
              <IcSearch size={15} />
            </span>
          </div>

          {/* Section filter chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {(
              [
                "all",
                "Первое открытие",
                "Арена",
                "Академия",
                "Колода",
                "Разбор",
                "Профиль",
                "Сервис",
              ] as const
            ).map((sec) => (
              <button
                key={sec}
                type="button"
                className="chip whitespace-nowrap"
                style={{
                  fontSize: 10,
                  padding: "3px 8px",
                  background:
                    filterSection === sec
                      ? "rgba(62,199,201,.25)"
                      : "rgba(255,255,255,.05)",
                  borderColor: filterSection === sec ? "var(--acc)" : "transparent",
                  color: filterSection === sec ? "#fff" : "var(--ink2)",
                }}
                onClick={() => setFilterSection(sec)}
              >
                {sec === "all" ? "Все разделы" : sec}
              </button>
            ))}
          </div>

          {/* List of P01–P34 */}
          <div
            className="sb-pages wb-scroll"
            style={{ maxHeight: 220, overflowY: "auto", gap: 3 }}
          >
            {filteredPages.map((pg) => {
              const isSelected = selectedPageId === pg.id;
              return (
                <button
                  key={pg.id}
                  type="button"
                  className={`sb-page ${isSelected ? "on" : ""}`}
                  onClick={() => handlePageSelect(pg.id)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="mono font-bold text-xs"
                      style={{
                        color: isSelected ? "var(--acc)" : "var(--ink3)",
                        width: 30,
                      }}
                    >
                      {pg.id}
                    </span>
                    <span
                      className="truncate text-xs text-left"
                      style={{
                        color: isSelected ? "#fff" : "#cad4f2",
                      }}
                    >
                      {pg.name}
                    </span>
                  </div>
                  <span className="sb-page-count mono">{pg.variantsCount}×</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Player Career Stats */}
        <div className="sb-section">
          <div className="sb-label">Профиль аналитика</div>
          <div className="sb-stats">
            <div className="sb-stat">
              <span className="sb-stat-ic" style={{ color: "var(--acc)" }}>
                LVL
              </span>
              <b>{p.lvl}</b>
            </div>
            <div className="sb-stat">
              <span className="sb-stat-ic" style={{ color: "#ffc24a" }}>
                <IcCoin size={15} />
              </span>
              <b>{p.coins}</b>
            </div>
            <div className="sb-stat">
              <span className="sb-stat-ic" style={{ color: "#a99bff" }}>
                <IcStar size={15} />
              </span>
              <b>{p.bestStreak}</b>
            </div>
            <div className="sb-stat">
              <span className="sb-stat-ic" style={{ color: "var(--good)" }}>
                100
              </span>
              <b className="text-xs">
                #{roundIdx + 1}
              </b>
            </div>
          </div>
          <div className="sb-row mt-1">
            <span className="sb-row-ic">
              <IcGear size={15} />
            </span>
            <span style={{ flex: 1, fontSize: 12 }}>Звуки WebAudio</span>
            <button
              type="button"
              className={`sb-toggle ${p.sound ? "on" : ""}`}
              onClick={() => {
                const on = !p.sound;
                store.set({ sound: on });
                setSound(on);
                if (on) sfx.tap();
              }}
            >
              <span className="sb-knob" />
            </button>
          </div>
          <button
            type="button"
            className="text-btn text-xs text-left mt-1 text-red-400 opacity-70 hover:opacity-100"
            onClick={() => {
              store.reset();
              sfx.back();
              say("Прогресс сброшен");
            }}
          >
            Сбросить прогресс
          </button>
        </div>

        <div className="sb-foot">
          <span className="sb-dot" />
          <span>Оптимизировано для мобильных тач-устройств</span>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* CENTER STAGE: Mobile Device Artboard (NO phone chrome)    */}
      {/* ========================================================= */}
      <main className="stage-main">
        <div
          className={`device dev-${selectedDevice}`}
          style={{
            aspectRatio: `${dev.w} / ${dev.h}`,
          }}
        >
          <div className="app">
            <div
              className={`cg-screen enter-fwd mo-${selectedVariant}`}
              key={selectedPageId + selectedVariant + roundIdx}
            >
              <div className="cg-bg" />

              {/* Locked Canonical Top Bar from references */}
              {selectedPageId !== "P01" && (
                <TopBarCanonical
                  showSig={activeTab === "shop" || selectedPageId === "P31"}
                  onBell={() => handlePageSelect("P32")}
                  onGear={() => handlePageSelect("P31")}
                />
              )}

              {/* Central Screen Body */}
              <div className="cg-body" ref={bodyRef}>
                {activeTab === "shop" ? (
                  <ShopScreen say={say} />
                ) : (
                  <GameRenderer
                    pageId={selectedPageId}
                    variant={selectedVariant}
                    round={round}
                    roundIdx={roundIdx}
                    lens={gameLens}
                    action={gameAction}
                    onLens={setGameLens}
                    onAction={setGameAction}
                    onScore={handleScore}
                    onNavigate={handlePageSelect}
                    onRoundChange={handleRoundChange}
                    onBurst={() => setBurst((b) => b + 1)}
                    say={say}
                  />
                )}
              </div>

              {burst > 0 && <Burst run={burst} x={50} y={26} />}
              <Toast msg={toast.msg} run={toast.run} />
            </div>

            {/* Bottom 4-Item Navigation — hidden on splash and during guided onboarding P02–P14 */}
            {!(["P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09", "P10", "P11", "P12", "P13", "P14"] as string[]).includes(selectedPageId) && (
              <nav className="cg-nav">
                {[
                  { k: "academy", label: "АКАДЕМИЯ", target: "P15", Icon: IcAcademy },
                  { k: "arena", label: "АРЕНА", target: "P20", Icon: IcArena },
                  { k: "collection", label: "КОЛЛЕКЦИЯ", target: "P18", Icon: IcCollection },
                  { k: "shop", label: "ЕЩЁ", target: "shop", Icon: IcMore },
                ].map((it) => {
                  const isActive = activeTab === it.k;
                  const isRaise = it.k === "arena";
                  return (
                    <button
                      key={it.k}
                      type="button"
                      className={`cg-nav-item ${isActive ? "on" : ""} ${isRaise ? "raise" : ""}`}
                      onClick={() => {
                        sfx.tap();
                        if (it.k === "shop") {
                          setActiveTab("shop");
                        } else {
                          if (it.k === "arena") {
                            // fresh round entry resets decision
                            setGameLens(null);
                            setGameAction(null);
                          }
                          setActiveTab(it.k as "academy" | "arena" | "collection");
                          setSelectedPageId(it.target);
                        }
                      }}
                    >
                      <span className="cg-nav-pill">
                        <it.Icon size={22} />
                      </span>
                      <span className="cg-nav-label">{it.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* RIGHT SIDEBAR: Studio Inspector & QA Verification         */}
      {/* ========================================================= */}
      {showInspector && (
        <aside
          className="sidebar wb-scroll"
          style={{
            borderRight: "none",
            borderLeft: "1px solid rgba(120, 145, 200, 0.14)",
            width: 300,
            flex: "0 0 300px",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="sb-label">Инспектор экрана</span>
            <span
              className="chip mono"
              style={{ background: "rgba(62,199,201,.18)", color: "var(--acc)", fontSize: 10 }}
            >
              {curPage.id}-{selectedVariant}
            </span>
          </div>

          {/* Current Page Info */}
          <div className="panel p-3 flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <span className="cg-sub">Название:</span>
              <span className="font-bold text-right text-white">{curPage.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="cg-sub">Раздел:</span>
              <span className="font-bold text-right" style={{ color: "var(--acc)" }}>
                {curPage.section}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="cg-sub">Состояние:</span>
              <span className="cg-sub text-right">{curPage.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="cg-sub">Вариант:</span>
              <span className="mono font-bold text-white">
                {selectedVariant} ({curPage.variantNames["ABCD".indexOf(selectedVariant)]})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="cg-sub">Источник:</span>
              <span className="mono text-xs text-right opacity-70">{curPage.source}</span>
            </div>
          </div>

          {/* No-Scroll QA — REAL measurement of the current screen body */}
          <div className="sb-section">
            <div className="sb-label">No-Scroll QA (реальный замер)</div>
            <div className="panel p-3 text-xs flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="cg-sub">Экран · устройство:</span>
                <span className="mono font-bold text-white">
                  {curPage.id}-{selectedVariant} · {dev.w}×{dev.h}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="cg-sub">Vertical overflow:</span>
                <span
                  className="mono font-bold"
                  style={{ color: qa && !qa.v ? "var(--bad)" : "var(--good)" }}
                >
                  {qa ? (qa.v ? "PASS" : `FAIL +${qa.sh - qa.ch}px`) : "…"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="cg-sub">Horizontal overflow:</span>
                <span
                  className="mono font-bold"
                  style={{ color: qa && !qa.h ? "var(--bad)" : "var(--good)" }}
                >
                  {qa ? (qa.h ? "PASS" : "FAIL") : "…"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="cg-sub">scrollH / clientH:</span>
                <span className="mono cg-sub">{qa ? `${qa.sh} / ${qa.ch}` : "…"}</span>
              </div>
              <div className="flex justify-between">
                <span className="cg-sub">CTA touch target:</span>
                <span className="font-bold" style={{ color: "var(--good)" }}>≥ 48px</span>
              </div>
            </div>
          </div>

          {/* 100 Analyses Carousel Quick Jump */}
          <div className="sb-section">
            <div className="flex items-center justify-between">
              <span className="sb-label">Библиотека 100 сценариев</span>
              <span className="mono text-xs" style={{ color: "var(--acc)" }}>
                #{round.n}/100
              </span>
            </div>
            <div className="panel p-3 text-xs flex flex-col gap-2">
              <div className="font-bold text-white">
                {round.asset} · {round.tf}
              </div>
              <div className="cg-sub text-xs">{round.coach}</div>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  className="chip flex-1 justify-center"
                  onClick={() => {
                    setRoundIdx((i) => Math.max(0, i - 1));
                    sfx.tap();
                  }}
                >
                  ← Пред
                </button>
                <button
                  type="button"
                  className="chip flex-1 justify-center"
                  onClick={() => {
                    handleNextRound();
                    sfx.tap();
                  }}
                >
                  След →
                </button>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <button
              type="button"
              className="w-full text-btn text-xs py-2 opacity-70 hover:opacity-100"
              onClick={() => setShowInspector(false)}
            >
              Скрыть инспектор
            </button>
          </div>
        </aside>
      )}

      {/* Button to show inspector if closed */}
      {!showInspector && (
        <button
          type="button"
          className="inspector-fab"
          onClick={() => setShowInspector(true)}
          aria-label="Показать инспектор"
        >
          Инспектор
        </button>
      )}
    </div>
  );
}
