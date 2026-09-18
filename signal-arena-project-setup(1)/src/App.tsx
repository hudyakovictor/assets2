import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import GameScreen, { Inner, nextPageId, resolvePage } from "./screens/GameScreen";
import MainGame from "./screens/MainGame";
import GameSidebar from "./components/GameSidebar";
import { PageInventory, AssetInspector } from "./components/Panels";
import { PAGES } from "./data/pages";
import { GameProvider, initialState, studioStateFor, useGame } from "./game/store";
import { FrameCtx, useUi } from "./game/ui";
import { sound } from "./utils/sound";

export interface VP { id: string; w: number; h: number; tag: string }

export const VIEWPORTS: VP[] = [
  { id: "390×844", w: 390, h: 844, tag: "Primary" },
  { id: "360×800", w: 360, h: 800, tag: "Android" },
  { id: "412×915", w: 412, h: 915, tag: "Large" },
  { id: "320×568", w: 320, h: 568, tag: "Compact" },
  { id: "300×620", w: 300, h: 620, tag: "MVP ref" },
];

type AppMode = "game" | "onboarding" | "studio" | "export";

export default function App() {
  const [mode, setMode] = useState<AppMode>("game");
  const [pageIndex, setPageIndex] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [vp, setVp] = useState(VIEWPORTS[0]);
  const [onboardingKey, setOnboardingKey] = useState(0);

  const page = PAGES[pageIndex];
  const variant = page.variants[Math.min(variantIndex, page.variants.length - 1)];

  const selectPage = useCallback((i: number) => {
    const safe = Math.max(0, Math.min(PAGES.length - 1, i));
    setPageIndex(safe);
    setVariantIndex((v) => Math.min(v, PAGES[safe].variants.length - 1));
  }, []);

  const stepPage = useCallback(
    (delta: number) => selectPage(pageIndex + delta),
    [pageIndex, selectPage],
  );

  function handleViewport(vpId: string) {
    const found = VIEWPORTS.find((v) => v.id === vpId);
    if (found) setVp(found);
  }

  const screen = (
    <GameProvider key={page.id} initial={studioStateFor(page.id)}>
      <SyncTerms />
      <GameScreen
        key={`${page.id}-${variant.id}`}
        page={page}
        variant={variant}
        onNext={() => stepPage(1)}
      />
    </GameProvider>
  );

  /* ---------- EXPORT: clean screen only, always with a way out ---------- */
  if (mode === "export") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#070b13]">
        <div
          className="relative max-h-[92dvh] max-w-[94vw] overflow-hidden"
          style={{ width: vp.w, height: vp.h, borderRadius: 24, outline: "1px solid rgba(86,114,158,.28)" }}
        >
          {screen}
        </div>
        <div className="mt-3 flex items-center gap-2 pb-[max(12px,env(safe-area-inset-bottom))]">
          <span className="text-[11px] font-bold text-[#647a9a]">
            {page.id} · {variant.id} · {vp.id}
          </span>
          <button
            onClick={() => { sound.click(); setMode("studio"); }}
            className="rounded-full bg-[#26e6c8] px-3 py-1.5 text-[11px] font-black uppercase text-[#04221c]"
          >
            Выход
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col md:h-[100dvh] md:overflow-hidden">
      {/* Top workbench strip */}
      <WorkbenchHeader
        mode={mode}
        onMode={(m) => { sound.click(); setMode(m); }}
        pageLabel={`${page.id} · ${page.frame}`}
        variantLabel={variant.label}
      />

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* SIDEBAR — on desktop it is a fixed column, on phones it sits under the frame */}
        <aside className="order-2 shrink-0 border-[#22314a] md:order-1 md:h-full md:w-[320px] md:overflow-y-auto md:border-r lg:w-[340px]">
          {mode === "studio" ? (
            <div className="flex h-full flex-col bg-[#0b111d]">
              <div className="flex items-center justify-between border-b border-[#22314a] px-3 py-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#26e6c8]">
                  Инвентарь · {pageIndex + 1}/{PAGES.length}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => { sound.click(); stepPage(-1); }}
                    className="btn-3d grid h-7 w-7 place-items-center rounded-lg bg-[#1b2537] text-[12px] font-black text-white"
                  >‹</button>
                  <button
                    onClick={() => { sound.click(); stepPage(1); }}
                    className="btn-3d grid h-7 w-7 place-items-center rounded-lg bg-[#1b2537] text-[12px] font-black text-white"
                  >›</button>
                </div>
              </div>
              <div className="min-h-[320px] flex-1">
                <PageInventory
                  pageIndex={pageIndex}
                  variantIndex={variantIndex}
                  onSelectPage={selectPage}
                  onSelectVariant={setVariantIndex}
                />
              </div>
            </div>
          ) : (
            <GameSidebar
              mode={mode}
              onModeChange={(m) => setMode(m)}
              pageIndex={pageIndex}
              onSelectPage={selectPage}
              variantIndex={variantIndex}
              onSelectVariant={setVariantIndex}
              viewportId={vp.id}
              onViewportChange={handleViewport}
            />
          )}
        </aside>

        {/* CENTER STAGE — fills the full height so no empty slab remains */}
        <main className="order-1 relative flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-hidden px-2 py-2 md:order-2 md:px-5 md:py-4">
          {/* Stage backdrop, fully covers the area behind the frame (never a blank void) */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0" style={{ background: "radial-gradient(110% 80% at 50% 0%, #12203a 0%, #0a1120 58%, #070c16 100%)" }} />
            <div className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]" style={{ background: "rgba(38,230,200,.08)" }} />
            <div className="grid-lines absolute inset-0 opacity-[.18]" />
          </div>

          <div className="relative z-10 flex min-h-0 w-full flex-1 items-center justify-center">
            <FitFrame vp={vp}>
              {mode === "game" && (
                <MainGame
                  layoutMode={variant.layoutMode}
                  accentColor={variant.accent}
                  onOpenStudio={() => setMode("studio")}
                />
              )}

              {mode === "onboarding" && (
                <div className="relative h-full w-full">
                  <GameProvider key={onboardingKey} initial={initialState}>
                    <SyncTerms />
                    <PlaySession variantIndex={variantIndex} />
                  </GameProvider>
                  <button
                    onClick={() => { sound.click(); setOnboardingKey((k) => k + 1); }}
                    className="absolute right-2.5 top-2.5 z-[60] rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur"
                  >
                    Начать заново
                  </button>
                </div>
              )}

              {mode === "studio" && screen}
            </FitFrame>
          </div>

          <div className="relative z-10 flex shrink-0 items-center gap-2 rounded-full bg-[#0d1728]/80 px-3 py-1 text-[10.5px] font-bold text-[#5f748f]">
            <span>{vp.id} · {vp.tag}</span>
            <span className="text-[#33445e]">|</span>
            <span className="text-[#26e6c8]">{variant.layoutMode}</span>
          </div>
        </main>

        {/* RIGHT: inspector only in studio on very wide screens */}
        {mode === "studio" && (
          <aside className="hidden w-[250px] shrink-0 overflow-y-auto border-l border-[#22314a] bg-[#0d131f] xl:block">
            <AssetInspector page={page} variant={variant} onReset={() => setVariantIndex(0)} />
          </aside>
        )}
      </div>
    </div>
  );
}

/* ---------------- Workbench header: mode switch is never hidden ---------------- */
function WorkbenchHeader({
  mode,
  onMode,
  pageLabel,
  variantLabel,
}: {
  mode: AppMode;
  onMode: (m: AppMode) => void;
  pageLabel: string;
  variantLabel: string;
}) {
  const items: { id: AppMode; label: string }[] = [
    { id: "game", label: "Игра" },
    { id: "onboarding", label: "Кадры 1–15" },
    { id: "studio", label: "Студия" },
    { id: "export", label: "Экспорт" },
  ];
  return (
    <header className="z-20 flex shrink-0 items-center gap-2 border-b border-[#22314a] bg-[#0b111d] px-2.5 py-2">
      <span className="hidden text-[12px] font-black tracking-tight text-white sm:block">
        Signal Arena <span className="text-[#5f748f]">· bench</span>
      </span>
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onMode(it.id)}
            className="btn-3d shrink-0 rounded-lg px-2.5 py-1.5 text-[10.5px] font-black uppercase transition"
            style={{
              minHeight: 32,
              background: mode === it.id ? "linear-gradient(180deg,#45ead0,#1da994)" : "#182335",
              color: mode === it.id ? "#04221c" : "#8ca0bd",
              border: mode === it.id ? "1px solid #75f4e0" : "1px solid #26364e",
            }}
          >
            {it.label}
          </button>
        ))}
      </div>
      <span className="ml-auto hidden truncate text-[10.5px] font-bold text-[#5f748f] lg:block">
        {pageLabel} · {variantLabel}
      </span>
    </header>
  );
}

/* ---------------- Frame: virtual viewport scaled to fit available box ----------------
   Guarantees the game screen is never clipped and keeps its declared proportions.  */
function FitFrame({ vp, children }: { vp: VP; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const rect = el.getBoundingClientRect();
      const padX = window.innerWidth < 768 ? 6 : 20;
      const padY = window.innerWidth < 768 ? 6 : 20;
      // Contain on BOTH axes — the frame never leaves an empty slab.
      const s = Math.min(
        (rect.width - padX * 2) / vp.w,
        (rect.height - padY * 2) / vp.h,
        1,
      );
      setScale(Math.max(0.2, s));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("orientationchange", fit);
    return () => { ro.disconnect(); window.removeEventListener("orientationchange", fit); };
  }, [vp]);

  return (
    <div ref={box} className="relative grid h-full w-full place-items-center overflow-hidden">
      {/* Scaled wrapper occupies exactly the frame box; centred on both axes */}
      <div
        className="relative shrink-0"
        style={{ width: vp.w * scale, height: vp.h * scale }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left overflow-hidden"
          style={{
            width: vp.w,
            height: vp.h,
            transform: `scale(${scale})`,
            borderRadius: vp.w <= 300 ? 10 : 26,
            outline: `${vp.w <= 300 ? 3 : 1}px solid ${vp.w <= 300 ? "#2d3f5b" : "rgba(96,126,170,.32)"}`,
            boxShadow: "0 30px 80px -20px rgba(0,0,0,.85), 0 0 0 8px rgba(38,230,200,.04)",
            background: "#0d121c",
          }}
        >
          <FrameCtx.Provider value={vp.h}>{children}</FrameCtx.Provider>
        </div>
      </div>
    </div>
  );
}

/* Single source of truth for terminology: sidebar → game store → screens. */
function SyncTerms() {
  const { state, dispatch } = useGame();
  const { proTerms } = useUi();
  useEffect(() => {
    if (state.proTerms !== proTerms) dispatch({ type: "setProTerms", value: proTerms });
  }, [proTerms, state.proTerms, dispatch]);
  return null;
}

function PlaySession({ variantIndex }: { variantIndex: number }) {
  const { state, dispatch } = useGame();
  const [id, setId] = useState("P01");
  const { page, extra } = resolvePage(id);
  const variant = page.variants[Math.min(variantIndex, page.variants.length - 1)];

  const next = useCallback(() => {
    const n = nextPageId(id, { academyUnlocked: state.academyUnlocked });
    if (id === "P01" || id === "P09" || id === "P11" || id === "P15" || id === "P19") {
      dispatch({ type: "startRun", run: id === "P01" ? 1 : id === "P09" ? 2 : id === "P11" ? 3 : 4 });
    }
    if (id === "P12") dispatch({ type: "unlockAcademy" });
    setId(n);
  }, [id, state.academyUnlocked, dispatch]);

  const nav = (k: "academy" | "arena" | "profile") =>
    setId(k === "academy" ? "P16" : k === "profile" ? "P27" : "P20");

  return (
    <Inner page={page} variant={variant} extra={extra} onNext={next} onNav={nav} onBell={() => setId("P28")} onGear={() => setId("P29")} />
  );
}
