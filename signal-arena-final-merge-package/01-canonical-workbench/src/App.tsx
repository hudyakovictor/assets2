import { useCallback, useEffect, useRef, useState } from "react";
import { AssetsProvider, useAssets } from "./lib/assets";
import { PAGES, variantsOf, type Page, type Variant } from "./lib/pages";
import type { VariantOverride } from "./panels/Panels";
import Screen from "./screens/Screen";
import { DEFAULT_TB, type TopBarValues } from "./components/TopBar";
import { LeftPanel, RightPanel } from "./panels/Panels";
import { HandDrawnSmileyIcon } from "./components/icons";

type Vp = { id: string; w: number; h: number; label: string; tag: string };

const VIEWPORTS: Vp[] = [
  { id: "390", w: 390, h: 844, label: "390 × 844", tag: "MAIN" },
  { id: "360", w: 360, h: 800, label: "360 × 800", tag: "QA" },
  { id: "412", w: 412, h: 915, label: "412 × 915", tag: "QA" },
  { id: "320", w: 320, h: 568, label: "320 × 568", tag: "QA" },
  { id: "mvp", w: 300, h: 620, label: "300 × 620", tag: "MVP 15/31" },
];

type QaIssue = {
  page: string;
  variant: string;
  viewport: string;
  component: string;
  actual: string;
  overflow: string;
  fix: string;
};

function valuesFor(page: Page): TopBarValues {
  if (page.id === "P14" || page.id === "P33" || page.state.includes("empty"))
    return { ...DEFAULT_TB, attempts: 0, badge: 0 };
  if (page.kind === "splash") return { ...DEFAULT_TB, attempts: 5, stars: 0, coins: 0, badge: 0, level: 1, xp: 0 };
  if (page.id.startsWith("P0") || page.id === "P10" || page.id === "P11" || page.id === "P12" || page.id === "P13")
    return { ...DEFAULT_TB, level: 1, xp: 40, xpMax: 100, stars: 2, coins: 0, attempts: 4, badge: 0 };
  return DEFAULT_TB;
}

function runQA(el: HTMLElement, page: string, variant: string, vp: string): QaIssue[] {
  const out: QaIssue[] = [];
  const R = el.getBoundingClientRect();
  const push = (component: string, actual: string, overflow: string, fix: string) =>
    out.push({ page, variant, viewport: vp, component, actual, overflow, fix });
  if (el.scrollHeight > el.clientHeight + 2)
    push("screen", `${el.scrollHeight}>${el.clientHeight}`, "vertical overflow", "сократить второстепенный текст / уменьшить visual");
  if (el.scrollWidth > el.clientWidth + 2)
    push("screen", `${el.scrollWidth}>${el.clientWidth}`, "horizontal overflow", "убрать фиксированную ширину");
  const cta = el.querySelector("[data-cta], button.tap");
  const tb = el.querySelector("[data-topbar]");
  const nav = el.querySelector("nav");
  const within = (n: Element | null, name: string) => {
    if (!n) return;
    const r = n.getBoundingClientRect();
    if (r.width === 0) return;
    if (r.bottom > R.bottom + 2 || r.top < R.top - 2)
      push(name, `${Math.round(r.height)}px y=${Math.round(r.top - R.top)}`, "обрезан границей экрана", "зафиксировать высоту shell");
  };
  within(cta, "CTA");
  within(tb, "Top Bar");
  within(nav, "Bottom nav");
  return out;
}

function GameFrame({
  page,
  variant,
  onCta,
  onNav,
  onRestart,
  vp,
  onQa,
}: {
  page: Page;
  variant: Variant;
  onCta: () => void;
  onNav: (id: string) => void;
  onRestart: () => void;
  vp: Vp;
  onQa: (issues: QaIssue[]) => void;
}) {
  const v = variant;
  const values = valuesFor(page);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t: number;
    const kick = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => onQa(runQA(el, page.id, v.vid, vp.label)), 700);
    };
    document.fonts?.ready.then(kick);
    kick();
    const ro = new ResizeObserver(kick);
    ro.observe(el);
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
    };
  }, [page.id, v.vid, vp.label, onQa]);

  return (
    <div
      ref={ref}
      className={`app-shell arena-bg ${vp.id === "mvp" ? "mvp-frame" : ""}`}
      data-qa="screen"
      style={{ width: vp.w, height: vp.h }}
    >
      <Screen
        page={page}
        v={v}
        values={values}
        onCta={onCta}
        onNav={onNav}
        onRestart={onRestart}
      />
    </div>
  );
}

function Workbench() {
  const assets = useAssets();
  const [pageId, setPageId] = useState("P01");
  const [letter, setLetter] = useState<"A" | "B" | "C" | "D">("A");
  const [vp, setVp] = useState<Vp>(VIEWPORTS[0]);
  const [qa, setQa] = useState<QaIssue[]>([]);
  const [overrides, setOverrides] = useState<Record<string, VariantOverride>>({});
  const stageRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);
  const [leftOpen, setLeftOpen] = useState(() => typeof window !== "undefined" && window.innerWidth >= 1320);
  const [rightOpen, setRightOpen] = useState(() => typeof window !== "undefined" && window.innerWidth >= 1320);

  const page = PAGES.find((p) => p.id === pageId) ?? PAGES[0];
  const variants = variantsOf(page);
  const baseVariant = variants.find((x) => x.letter === letter) ?? variants[0];
  const variant: Variant = { ...baseVariant, ...(overrides[baseVariant.vid] ?? {}) };
  const patchVariant = (patch: VariantOverride) =>
    setOverrides((s) => ({ ...s, [baseVariant.vid]: { ...(s[baseVariant.vid] ?? {}), ...patch } }));
  const resetVariant = () =>
    setOverrides((s) => {
      const next = { ...s };
      delete next[baseVariant.vid];
      return next;
    });

  const idx = PAGES.findIndex((p) => p.id === pageId);
  const go = (d: number) => {
    const n = (idx + d + PAGES.length) % PAGES.length;
    setPageId(PAGES[n].id);
  };

  const onQa = useCallback((issues: QaIssue[]) => setQa(issues), []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const s = Math.min(1, (e.contentRect.width - 16) / vp.w, (e.contentRect.height - 64) / vp.h);
      setFit(Math.max(0.35, s));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [vp.w, vp.h]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (["1", "2", "3", "4"].includes(e.key)) setLetter((["A", "B", "C", "D"] as const)[Number(e.key) - 1]);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const onNav = (id: string) => {
    const map: Record<string, string> = { academy: "P16", arena: "P20", profile: "P27" };
    if (map[id]) setPageId(map[id]);
  };

  return (
    <div className="wb">
      <header className="wb-top">
        <div className="wb-brand">
          <button className={`rail-btn ${leftOpen ? "on" : ""}`} onClick={() => setLeftOpen((x) => !x)} title="Page Inventory">
            ☰ <span>Инвентарь</span>
          </button>
          <span className="dot" />
          Signal Arena <em>workbench</em>
        </div>
        <div className="wb-vps">
          {VIEWPORTS.map((v) => (
            <button
              key={v.id}
              className={`chipb ${v.id === vp.id ? "on" : ""}`}
              onClick={() => setVp(v)}
            >
              {v.label}
              <small>{v.tag}</small>
            </button>
          ))}
        </div>
        <div className="wb-tools">
          <span className="zoom">scale {Math.round(fit * 100)}%</span>
          <span className={qa.length ? "qa-fail" : "qa-ok"}>
            QA {qa.length ? `${qa.length} FAIL` : "PASS"}
          </span>
          <button className={`rail-btn ${rightOpen ? "on" : ""}`} onClick={() => setRightOpen((x) => !x)} title="Asset Inspector">
            <span>Инспектор</span> ◧
          </button>
        </div>
      </header>

      {assets.status === "loading" && (
        <div className="wb-banner">Загрузка ассетов из github.com/hudyakovictor/assets…</div>
      )}
      {assets.status === "missing" && (
        <div className="wb-banner err">
          MISSING: {assets.missing.join(" · ")}
          {assets.error ? ` · ${assets.error}` : ""}
        </div>
      )}

      <div className="wb-main">
        {leftOpen && (
        <div className="wb-left-col">
          <LeftPanel pageId={pageId} setPageId={setPageId} letter={letter} setLetter={setLetter} />
          <div className="memento">
            <p className="memento-kicker">MEMENTO TRADER</p>
            <div className="memento-row">
              <div className="handwritten-text memento-copy">
                IF YOU&apos;RE HERE,
                <br />
                JUST FOR MONEY,
                <br />
                YOU&apos;RE EARLY.
                <br />
                <span>AND THAT&apos;S BAD.</span>
              </div>
              <span className="memento-face">
                <HandDrawnSmileyIcon size={36} />
              </span>
            </div>
          </div>
        </div>
        )}

        <main className="wb-center" ref={stageRef}>
          <div className="stage-meta">
            {page.id}-{letter} · {vp.label} · без корпуса телефона
          </div>
          <div
            className="stage-wrap"
            style={{ width: vp.w * fit, height: vp.h * fit }}
          >
            <div style={{ transform: `scale(${fit})`, transformOrigin: "top left" }}>
              <GameFrame
                page={page}
                variant={variant}
                vp={vp}
                onCta={() => go(1)}
                onNav={onNav}
                onRestart={() => window.location.reload()}
                onQa={onQa}
              />
            </div>
          </div>
          {qa.length > 0 && (
            <div className="qa-dock">
              {qa.map((i, k) => (
                <div key={k}>
                  {i.page}-{i.variant} · {i.viewport} · {i.component} · {i.overflow} · {i.fix}
                </div>
              ))}
            </div>
          )}
        </main>

        {rightOpen && (
        <RightPanel
          page={page}
          variant={variant}
          overrides={overrides[baseVariant.vid] ?? {}}
          onPatch={patchVariant}
          onReset={() => {
            resetVariant();
            setLetter("A");
          }}
        />
        )}
      </div>
    </div>
  );
}

function ProductionApp() {
  const [pageId, setPageId] = useState("P01");
  const page = PAGES.find((p) => p.id === pageId) ?? PAGES[0];
  const v = variantsOf(page)[1] ?? variantsOf(page)[0];
  const idx = PAGES.findIndex((p) => p.id === pageId);
  const go = (d: number) => setPageId(PAGES[(idx + d + PAGES.length) % PAGES.length].id);
  const onNav = (id: string) => {
    const map: Record<string, string> = { academy: "P16", arena: "P20", profile: "P27" };
    if (map[id]) setPageId(map[id]);
  };
  return (
    <div className="app-prod arena-bg">
      <Screen
        page={page}
        v={v}
        values={valuesFor(page)}
        onCta={() => go(1)}
        onNav={onNav}
        onRestart={() => window.location.reload()}
      />
    </div>
  );
}

export default function App() {
  const mode = new URLSearchParams(window.location.search).get("mode");
  return (
    <AssetsProvider>
      {mode === "app" ? <ProductionApp /> : <Workbench />}
    </AssetsProvider>
  );
}
