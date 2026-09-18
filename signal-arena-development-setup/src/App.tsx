import { useState, useEffect, useRef, useCallback } from "react";
import { PAGES, findPage, variantsOf } from "./lib/pages";
import { StudioSidebar, GAME_VIEWPORTS, type ViewportMode } from "./components/StudioSidebar";
import { CanonicalTopBar } from "./components/CanonicalTopBar";
import { BottomNavBar, type NavTab } from "./components/BottomNavBar";
import { ReportModal } from "./components/ReportModal";
import { AssetInspector } from "./components/AssetInspector";
import { SlidersIcon } from "./components/icons";
import {
  SplashScreen,
  TutorialScreen,
  ScenarioScreen,
  ScoreScreen,
  BreakdownScreen,
  LobbyScreen,
  StateScreen,
  CardDetailScreen,
  PrerequisiteScreen,
  AssetLoadingState,
} from "./screens/FlowScreens";
import { AcademyScreen } from "./screens/AcademyScreen";
import { CollectionScreen } from "./screens/CollectionScreen";
import { MoreScreen } from "./screens/MoreScreen";
import { isSoundEnabled, toggleSound, playTapSound } from "./utils/audio";
import { useRepoAssets } from "./lib/repoAssets";
import {
  EMPTY_DRAFT,
  canSeal,
  type DecisionDraft,
  type SealedDecision,
} from "./lib/flowState";

function navOf(kind: string): NavTab {
  if (kind === "academy" || kind === "academyTopic" || kind === "lesson") return "academy";
  if (kind === "deck" || kind === "cardDetail") return "collection";
  if (kind === "profile") return "more";
  return "arena";
}

export default function App() {
  const [pageId, setPageId] = useState("P26");
  const [variant, setVariant] = useState<"A" | "B" | "C" | "D">("A");
  const [vp, setVp] = useState<ViewportMode>(GAME_VIEWPORTS[0]);
  const [scenarioPair, setScenarioPair] = useState("BTC/USDT");
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window === "undefined" ? true : window.innerWidth >= 900,
  );
  const [reportOpen, setReportOpen] = useState(false);

  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [draft, setDraft] = useState<DecisionDraft>(EMPTY_DRAFT);
  const [sealed, setSealed] = useState<SealedDecision | null>(null);
  const assets = useRepoAssets();

  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);
  const [qaOk, setQaOk] = useState(true);
  const [qaDetail, setQaDetail] = useState("0×0");

  const page = findPage(pageId) ?? PAGES[0];
  const v = variantsOf(page).find((x) => x.letter === variant) ?? variantsOf(page)[0];
  const pageNumber = Number(page.id.slice(1));
  const showGameNav = page.nav || (pageNumber >= 23 && pageNumber <= 31);

  useEffect(() => {
    const syncPanels = () => {
      if (window.innerWidth < 900) setSidebarOpen(false);
    };
    window.addEventListener("resize", syncPanels);
    return () => window.removeEventListener("resize", syncPanels);
  }, []);

  useEffect(() => {
    if (pageId === "P06" || pageId === "P25") {
      setDraft(EMPTY_DRAFT);
      setSealed(null);
    }
  }, [pageId]);

  /* Масштаб под высоту сцены */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const calc = () => {
      const w = el.clientWidth - 24;
      const h = el.clientHeight - 24;
      setFit(Math.min(1.12, Math.max(0.42, Math.min(w / vp.w, h / vp.h))));
    };
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    calc();
    return () => ro.disconnect();
  }, [vp]);

  /* NO-SCROLL QA */
  const runQa = useCallback(() => {
    const el = frameRef.current;
    if (!el) return;
    const dv = el.scrollHeight - el.clientHeight;
    const dh = el.scrollWidth - el.clientWidth;
    const frameBox = el.getBoundingClientRect();
    const watched = el.querySelectorAll<HTMLElement>("[data-qa='topbar'], [data-qa='primary-cta'], [data-qa='bottom-nav'], [data-qa='game-content']");
    let clipped = 0;
    watched.forEach((node) => {
      const box = node.getBoundingClientRect();
      if (
        box.left < frameBox.left - 1 ||
        box.right > frameBox.right + 1 ||
        box.top < frameBox.top - 1 ||
        box.bottom > frameBox.bottom + 1
      ) clipped += 1;
    });
    const ok = dv <= 1 && dh <= 1 && clipped === 0;
    setQaOk(ok);
    setQaDetail(`${vp.id} · Δv:${dv}px Δh:${dh}px clip:${clipped}`);
  }, [vp]);

  useEffect(() => {
    const t1 = setTimeout(runQa, 250);
    const t2 = setTimeout(runQa, 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pageId, variant, vp, runQa]);

  const next = () => {
    const routes: Record<string, string> = {
      P20: "P23",
      P21: "P23",
      P22: "P17",
      P31: "P23",
      P33: "P23",
    };
    if (routes[pageId]) {
      setPageId(routes[pageId]);
      return;
    }
    const i = PAGES.findIndex((p) => p.id === pageId);
    setPageId(PAGES[(i + 1) % PAGES.length].id);
  };

  const sealDecision = () => {
    if (!canSeal(draft) || !draft.decision || !draft.thesis || !draft.invalidation) return;
    setSealed({
      decision: draft.decision,
      thesis: draft.thesis,
      invalidation: draft.invalidation,
      sealedAt: Date.now(),
    });
  };

  const onNav = (tab: NavTab) => {
    const map: Record<NavTab, string> = {
      academy: "P15",
      arena: "P23",
      collection: "P19",
      more: "P32",
    };
    setPageId(map[tab]);
  };

  /* Роутер экранов */
  const screen = (() => {
    if (assets.status === "loading") return <AssetLoadingState />;
    if (
      !sealed &&
      ((pageNumber >= 9 && pageNumber <= 11) || (pageNumber >= 29 && pageNumber <= 31))
    ) {
      return (
        <PrerequisiteScreen
          onReturn={() => setPageId(pageNumber < 20 ? "P07" : "P26")}
        />
      );
    }
    switch (page.kind) {
      case "splash":
        return <SplashScreen page={page} onNext={next} />;
      case "tutorial":
      case "lesson":
        return <TutorialScreen page={page} v={v} onNext={next} />;
      case "chart":
      case "decision":
      case "confirm":
      case "waiting":
      case "reveal":
        return (
          <ScenarioScreen
            key={`${page.id}-${variant}`}
            page={page}
            v={v}
            onNext={next}
            scenarioPair={scenarioPair}
            draft={draft}
            onDraftChange={setDraft}
            sealed={sealed}
            onSeal={sealDecision}
          />
        );
      case "score":
        return (
          <ScoreScreen
            page={page}
            v={v}
            sealed={sealed}
            topicKnown={page.id !== "P13"}
            onNext={() => {
              if ((page.id === "P10" || page.id === "P30") && sealed) {
                setXp((value) => Math.min(1000, value + 40));
                setCoins((value) => value + 120);
              }
              next();
            }}
          />
        );
      case "breakdown":
        return <BreakdownScreen page={page} v={v} onNext={next} />;
      case "academy":
      case "academyTopic":
        return <AcademyScreen pageId={page.id as "P15" | "P16"} onNext={next} />;
      case "deck":
        return <CollectionScreen onOpenCard={(id) => setPageId(id <= 15 ? "P20" : "P21")} />;
      case "cardDetail":
        return <CardDetailScreen page={page} v={v} onNext={next} />;
      case "arenaLobby":
        return <LobbyScreen page={page} onNext={next} />;
      case "profile":
        return <MoreScreen coins={coins} xp={xp} onResetBalance={() => setCoins((c) => c + 500)} />;
      default:
        return (
          <StateScreen
            page={page}
            onNext={page.id === "P34" ? () => window.location.reload() : next}
            technicalStatus={assets.missing.join(" · ")}
          />
        );
    }
  })();

  return (
    <div className="w-full h-full min-h-screen studio-grid-bg flex flex-row overflow-hidden">
      {sidebarOpen && (
        <StudioSidebar
          pageId={pageId}
          onPageChange={setPageId}
          variant={variant}
          onVariantChange={setVariant}
          selectedVp={vp}
          onVpChange={setVp}
          scenarioPair={scenarioPair}
          onScenarioPairChange={setScenarioPair}
          soundOn={soundOn}
          onToggleSound={() => {
            toggleSound();
            setSoundOn((s) => !s);
          }}
          qaOk={qaOk}
          qaDetail={qaDetail}
          onOpenReport={() => setReportOpen(true)}
          onCloseMobile={() => setSidebarOpen(false)}
        />
      )}

      {/* ---------------- СЦЕНА С МОБИЛЬНЫМ ЭКРАНОМ ---------------- */}
      <main
        ref={stageRef}
        className="flex-1 min-w-0 h-full relative flex flex-col items-center justify-center p-3 overflow-hidden"
      >
        <button
          onClick={() => {
            playTapSound();
            setSidebarOpen((s) => !s);
          }}
          className="tactile-btn absolute top-3 left-3 z-30 px-3 py-2 rounded-xl bg-[#0D1521]/92 border border-[#22344C] shadow-lg flex items-center gap-1.5 text-[10.5px] font-display font-bold text-[#2EE6C8] backdrop-blur"
        >
          <SlidersIcon size={13} />
          {sidebarOpen ? "Скрыть" : "Параметры"}
        </button>

        {/* МОБИЛЬНЫЙ ЭКРАН: точные пропорции, не растянут */}
        <div
          className="relative shrink-0"
          style={{
            width: vp.w * fit,
            height: vp.h * fit,
          }}
        >
        <div
          className="mobile-game-container absolute left-0 top-0 rounded-[26px]"
          style={{
            width: vp.w,
            height: vp.h,
            transform: `scale(${fit})`,
            transformOrigin: "top left",
            ["--tb-scale" as string]: vp.w / 390,
          }}
          data-compact={vp.h <= 620 || vp.w <= 320}
        >
          <div ref={frameRef} className="app-shell">
            {page.topBar && (
              <CanonicalTopBar
                gameWidth={vp.w}
                xp={xp}
                coins={coins}
                badge={2}
              />
            )}
            <div key={`${page.id}-${variant}`} className="screen-enter flex-1 min-h-0 flex flex-col overflow-hidden">
              {screen}
            </div>

            {showGameNav && (
              <BottomNavBar activeTab={navOf(page.kind)} onTabChange={onNav} />
            )}
          </div>
        </div>
        </div>

      </main>

      <AssetInspector page={page} variant={v} onReset={() => setVariant("A")} />

      {reportOpen && <ReportModal onClose={() => setReportOpen(false)} />}

    </div>
  );
}
