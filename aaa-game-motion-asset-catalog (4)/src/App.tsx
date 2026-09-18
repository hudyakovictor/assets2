import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GameProvider, useGame } from "./store";
import { AssetProvider, useAsset } from "./lib/assetCtx";
import { PAGES, VARIANTS, MISSING_ASSETS, type PageDef, type VariantDef } from "./data/pages";
import { IPrev, INext, ISearch, IGrid, IEye, IReset, IWarn, Emblem } from "./components/RepoIcons";
import { FxLayer } from "./components/FxLayer";
import { spring } from "./lib/motion";
import { sfx } from "./lib/feedback";
import {
  P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12, P13, P14, P15, P16, P17,
} from "./screens/pages1";
import {
  P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29, P30, P31, P32, P33, P34,
} from "./screens/pages2";
import Report from "./screens/Report";

const REG: Record<string, React.ComponentType<{ page: PageDef; v: VariantDef; vnum: number }>> = {
  P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12, P13, P14, P15, P16, P17,
  P18, P19, P20, P21, P22, P23, P24, P25, P26, P27, P28, P29, P30, P31, P32, P33, P34,
};

const VIEWPORTS = [
  { w: 390, h: 844, l: "390×844", main: true },
  { w: 360, h: 800, l: "360×800" },
  { w: 412, h: 915, l: "412×915" },
  { w: 320, h: 568, l: "320×568" },
];

const SECTIONS = ["Onboarding", "Arena", "Academy", "Deck", "Profile", "Service", "States"];

/* ============================== left panel ============================== */
const LeftPanel = ({
  pageIdx,
  setPageIdx,
  vIdx,
  setVIdx,
  vpIdx,
  setVpIdx,
  onReport,
}: {
  pageIdx: number;
  setPageIdx: (i: number) => void;
  vIdx: number;
  setVIdx: (i: number) => void;
  vpIdx: number;
  setVpIdx: (i: number) => void;
  onReport: () => void;
}) => {
  const [q, setQ] = useState("");
  const filtered = PAGES.filter((p) => (p.id + p.name + p.section).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex h-full w-full flex-col">
      {/* viewport */}
      <div className="px-3 pt-3">
        <div className="mb-1.5 text-[9px] font-extrabold tracking-[0.16em] text-ink3 uppercase">Viewport</div>
        <div className="grid grid-cols-4 gap-1">
          {VIEWPORTS.map((vp, i) => (
            <button
              key={vp.l}
              className="rounded-[10px] py-1.5 text-[9.5px] font-extrabold"
              style={{ background: vpIdx === i ? "#35e0d0" : "#151f35", color: vpIdx === i ? "#04211e" : "#6b7a9c", boxShadow: vpIdx === i ? "0 0 14px rgba(53,224,208,.35)" : "none" }}
              onClick={() => setVpIdx(i)}
            >
              {vp.l}
            </button>
          ))}
        </div>
      </div>

      {/* variants */}
      <div className="px-3 pt-3">
        <div className="mb-1.5 text-[9px] font-extrabold tracking-[0.16em] text-ink3 uppercase">Variant · {VARIANTS[vIdx].label}</div>
        <div className="grid grid-cols-4 gap-1">
          {VARIANTS.map((vv, i) => (
            <button
              key={vv.id}
              className="relative rounded-[10px] py-2 text-[12px] font-extrabold"
              style={{ background: vIdx === i ? vv.glow : "#151f35", color: vIdx === i ? "#04211e" : "#6b7a9c", boxShadow: vIdx === i ? `0 0 16px ${vv.glowSoft}` : "none" }}
              onClick={() => {
                setVIdx(i);
                sfx.tick();
              }}
            >
              {vv.id}
            </button>
          ))}
        </div>
      </div>

      {/* search */}
      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 rounded-[12px] border border-line bg-[#0c1526] px-2.5 py-2">
          <ISearch size={14} color="#6b7a9c" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск P01–P34, раздел…"
            className="w-full bg-transparent text-[11px] font-bold text-white outline-none placeholder:text-[#3a4a70]"
          />
        </div>
      </div>

      {/* keyboard hint (desktop) */}
      <div className="hidden px-3 pt-2 font-mono text-[8.5px] font-bold text-[#3a4a70] lg:block">
        hotkeys: ↑↓ page · 1–4 variant · R reset · M report
      </div>

      {/* page list */}
      <div className="no-scrollbar mt-1 min-h-0 flex-1 overflow-y-auto px-3 pb-2">
        {SECTIONS.map((sec) => {
          const items = filtered.filter((p) => p.section === sec);
          if (!items.length) return null;
          return (
            <div key={sec} className="mb-2">
              <div className="px-1 pb-1 pt-1.5 text-[8.5px] font-extrabold tracking-[0.18em] text-[#3a4a70] uppercase">{sec}</div>
              {items.map((p) => {
                const on = PAGES.indexOf(p) === pageIdx;
                return (
                  <button
                    key={p.id}
                    className="mb-0.5 flex w-full items-center gap-2 rounded-[10px] px-2 py-[7px] text-left"
                    style={{
                      background: on ? "rgba(53,224,208,.12)" : "transparent",
                      boxShadow: on ? "inset 0 0 0 1px rgba(53,224,208,.4)" : "none",
                    }}
                    onClick={() => {
                      setPageIdx(PAGES.indexOf(p));
                      sfx.tick();
                    }}
                  >
                    <span className={`w-8 font-mono text-[10px] font-extrabold ${on ? "text-acc" : "text-[#3a4a70]"}`}>{p.id}</span>
                    <span className={`min-w-0 flex-1 truncate text-[11px] font-bold ${on ? "text-white" : "text-ink3"}`}>{p.name}</span>
                    {p.topbar && <span className="text-[7.5px] font-extrabold text-[#3a4a70]">TB</span>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* prev/next + missing + report */}
      <div className="border-t border-line p-3">
        <div className="flex gap-1.5">
          <button
            className="flex flex-1 items-center justify-center gap-1 rounded-[12px] border border-line bg-[#151f35] py-2.5 text-[11px] font-extrabold text-ink2"
            onClick={() => {
              setPageIdx(Math.max(0, pageIdx - 1));
              sfx.tick();
            }}
          >
            <IPrev size={13} /> Пред.
          </button>
          <button
            className="flex flex-1 items-center justify-center gap-1 rounded-[12px] border border-line bg-[#151f35] py-2.5 text-[11px] font-extrabold text-ink2"
            onClick={() => {
              setPageIdx(Math.min(PAGES.length - 1, pageIdx + 1));
              sfx.tick();
            }}
          >
            След. <INext size={13} />
          </button>
        </div>
        <button
          className="mt-1.5 flex w-full items-center gap-2 rounded-[12px] border border-[#6e3430] bg-[#241518]/40 px-2.5 py-2 text-left"
          onClick={onReport}
        >
          <IWarn size={14} color="#ff8a94" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-extrabold text-[#ff8a94]">
              MISSING_ASSET: {MISSING_ASSETS.length}
            </span>
            <span className="block truncate text-[9px] font-bold text-ink3">{MISSING_ASSETS.map((m) => m.file).join(", ")}</span>
          </span>
        </button>
        <button
          className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-[12px] bg-[#35e0d0] py-2.5 text-[11px] font-extrabold text-[#04211e]"
          style={{ boxShadow: "0 3px 0 #0d7f74" }}
          onClick={onReport}
        >
          <IGrid size={13} color="#04211e" /> FINAL CHECK / REPORT
        </button>
      </div>
    </div>
  );
};

/* ============================== inspector ============================== */
const TINTS = [null, "#35e0d0", "#8b7bff", "#ffb84d", "#3ddc97", "#ff5b6a"];

const Inspector = ({ page, v }: { page: PageDef; v: VariantDef }) => {
  const { get, set, reset } = useAsset();
  const [slot, setSlot] = useState(page.assetId.split("/")[1]);
  const s = page.slots.includes(slot) ? slot : page.assetId.split("/")[1];
  const a = get(s);
  const isTopbar = s === "topbar";
  const assetInfo =
    s === "topbar"
      ? { id: "SHARED_TOP_BAR_LOCKED", src: "topbar/topbar.html + topbar/icons/*.svg", purpose: "общий Top Bar (locked)", fb: "inlined verbatim" }
      : { id: `${page.id}/${s}`, src: s.startsWith("card-c") ? `skill-card-icons/${s.replace("card-", "")}.svg` : "inline-drawn (repo art direction)", purpose: s, fb: "inline SVG" };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="px-3 pt-3">
        <div className="text-[9px] font-extrabold tracking-[0.16em] text-ink3 uppercase">Asset Inspector</div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] font-extrabold text-white">
          <IEye size={13} color="#35e0d0" />
          {page.id}-{v.id} · {assetInfo.id}
        </div>
        <div className="mt-1.5 grid grid-cols-[60px_1fr] gap-x-2 gap-y-0.5 rounded-[12px] border border-line bg-[#0c1526] p-2.5 text-[9px] font-bold">
          <span className="text-ink3">SOURCE</span>
          <span className="truncate pr-1 text-ink2">{assetInfo.src}</span>
          <span className="text-ink3">PLACEMENT</span>
          <span className="pr-1 text-ink2">{page.id}</span>
          <span className="text-ink3">PURPOSE</span>
          <span className="pr-1 text-ink2">{assetInfo.purpose}</span>
          <span className="text-ink3">FALLBACK</span>
          <span className="pr-1 text-ink2">{assetInfo.fb}</span>
          <span className="text-ink3">MOTION</span>
          <span className="pr-1" style={{ color: v.glow }}>{v.label} · {v.motion}</span>
        </div>
      </div>

      <div className="px-3 pt-3">
        <div className="mb-1.5 text-[9px] font-extrabold tracking-[0.16em] text-ink3 uppercase">Slots · {page.id}</div>
        <div className="no-scrollbar flex gap-1 overflow-x-auto pb-1">
          {page.slots.map((sl) => (
            <button
              key={sl}
              className="shrink-0 rounded-[9px] px-2 py-1.5 font-mono text-[9px] font-bold"
              style={{ background: s === sl ? "rgba(53,224,208,.14)" : "#151f35", color: s === sl ? "#35e0d0" : "#6b7a9c", boxShadow: s === sl ? "inset 0 0 0 1px rgba(53,224,208,.5)" : "none" }}
              onClick={() => setSlot(sl)}
            >
              {sl}
            </button>
          ))}
        </div>
      </div>

      {isTopbar ? (
        <div className="mx-3 mt-3 rounded-[14px] border border-[#1f5e58] bg-[#10241f]/40 p-3">
          <div className="text-[10.5px] font-extrabold text-[#9ff3e8]">SHARED_TOP_BAR_LOCKED</div>
          <p className="mt-1 text-[9.5px] font-semibold leading-relaxed text-ink3">
            Геометрия, порядок, иконки и spacing заморожены (topbar.html). Меняются только динамические значения: LVL, XP, attempts, stars, coins, badge.
            Трансформации слота разрешены (scale/opacity) — layout не трогаем.
          </p>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pt-3">
        <div>
          <div className="mb-1 flex justify-between text-[9px] font-extrabold text-ink3 uppercase">
            <span>Scale</span>
            <span className="text-ink2">{a.scale.toFixed(2)}×</span>
          </div>
          <input type="range" min={0.5} max={1.5} step={0.01} value={a.scale} onChange={(e) => set(s, { scale: Number(e.target.value) })} className="w-full accent-[#35e0d0]" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[9px] font-extrabold text-ink3 uppercase">
            <span>Opacity</span>
            <span className="text-ink2">{Math.round(a.opacity * 100)}%</span>
          </div>
          <input type="range" min={0} max={1} step={0.01} value={a.opacity} onChange={(e) => set(s, { opacity: Number(e.target.value) })} className="w-full accent-[#35e0d0]" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="mb-1 flex justify-between text-[9px] font-extrabold text-ink3 uppercase">
              <span>Pos X</span>
              <span className="text-ink2">{a.x}px</span>
            </div>
            <input type="range" min={-50} max={50} step={1} value={a.x} onChange={(e) => set(s, { x: Number(e.target.value) })} className="w-full accent-[#35e0d0]" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[9px] font-extrabold text-ink3 uppercase">
              <span>Pos Y</span>
              <span className="text-ink2">{a.y}px</span>
            </div>
            <input type="range" min={-50} max={50} step={1} value={a.y} onChange={(e) => set(s, { y: Number(e.target.value) })} className="w-full accent-[#35e0d0]" />
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-[9px] font-extrabold text-ink3 uppercase">Tint</div>
          <div className="flex gap-1.5">
            {TINTS.map((t) => (
              <button
                key={t ?? "none"}
                className="h-7 w-7 rounded-full border-2"
                style={{
                  background: t ?? "#0c1526",
                  borderColor: a.tint === t ? "#fff" : "rgba(255,255,255,.15)",
                  transform: a.tint === t ? "scale(1.12)" : "scale(1)",
                }}
                onClick={() => set(s, { tint: t })}
              >
                {!t && <span className="block h-full w-full rounded-full text-[8px] font-extrabold leading-7 text-ink3">—</span>}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-[9px] font-extrabold text-ink3 uppercase">Motion preset (read-only)</div>
          <div className="flex gap-1">
            {(["spring", "stagger", "pop", "antic"] as const).map((m) => (
              <span
                key={m}
                className="flex-1 rounded-[9px] py-1.5 text-center text-[9px] font-extrabold"
                style={{ background: m === v.motion ? "rgba(53,224,208,.14)" : "#151f35", color: m === v.motion ? "#35e0d0" : "#6b7a9c", boxShadow: m === v.motion ? "inset 0 0 0 1px rgba(53,224,208,.5)" : "none" }}
              >
                {m}
              </span>
            ))}
          </div>
          <p className="mt-1 text-[8.5px] font-bold leading-relaxed text-ink3">
            Пресет закреплён за вариантом {v.id} (так задумано: вариант = motion preset + art). {v.note}
          </p>
        </div>
      </div>

      <div className="border-t border-line p-3">
        <button
          className="flex w-full items-center justify-center gap-1.5 rounded-[12px] border border-line bg-[#151f35] py-2.5 text-[11px] font-extrabold text-ink2"
          style={{ boxShadow: "0 2px 0 #0c1526" }}
          onClick={() => {
            reset();
            sfx.tick();
          }}
        >
          <IReset size={13} /> Reset Variant
        </button>
      </div>
    </div>
  );
};

/* ============================== center stage ============================== */
const Stage = ({ pageIdx, vIdx, vpIdx, setQa }: { pageIdx: number; vIdx: number; vpIdx: number; setQa: (q: { pass: boolean; note: string; measured: string }) => void }) => {
  const page = PAGES[pageIdx];
  const v = VARIANTS[vIdx];
  const vp = VIEWPORTS[vpIdx];
  const wrapRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<HTMLDivElement>(null);
  const { frameRef } = useGame();
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      setScale(Math.min((r.width - 24) / vp.w, (r.height - 24) / vp.h, 1));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [vp]);

  useLayoutEffect(() => {
    frameRef.current = localRef.current;
    const t = setTimeout(() => {
      const f = localRef.current;
      if (!f) return;
      const sh = f.scrollHeight;
      const ch = f.clientHeight;
      const sw = f.scrollWidth;
      const cw = f.clientWidth;
      const pass = sh <= ch + 2 && sw <= cw + 2;
      setQa({
        pass,
        measured: `${sw}×${sh} в контейнере ${cw}×${ch}`,
        note: pass
          ? "scrollHeight ≤ clientHeight и scrollWidth ≤ clientWidth. CTA, Top Bar и нижняя зона не обрезаны: флекс-минимумы удерживают layout в 320–412px по ширине."
          : `Переполнение: scroll ${sw}×${sh} при контейнере ${cw}×${ch}. Проверить: ${page.id}, variant ${v.id}, ${vp.l}. Требуется: сократить вторичный текст или вынести в отдельное состояние.`,
      });
    }, 700);
    return () => clearTimeout(t);
  }, [pageIdx, vIdx, vpIdx]);

  const Cmp = REG[page.id];

  return (
    <div ref={wrapRef} className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* frame glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: v.glowSoft }} />
      </div>
      <motion.div
        key={`${page.id}-${v.id}-${vpIdx}`}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={spring.soft}
        className="relative"
        style={{ width: vp.w * scale, height: vp.h * scale }}
      >
        <div
          ref={localRef}
          className="game-root relative h-full w-full origin-top-left overflow-hidden bg-bg"
          style={{
            width: vp.w,
            height: vp.h,
            transform: `scale(${scale})`,
            borderRadius: 26,
            border: "1px solid rgba(255,255,255,.09)",
            boxShadow: `0 40px 110px rgba(0,0,0,.75), 0 0 60px ${v.glowSoft}, inset 0 0 0 1px rgba(0,0,0,.4)`,
          }}
        >
          <Cmp key={`${page.id}-${v.id}`} page={page} v={v} vnum={vIdx} />
          <FxLayer />
        </div>
      </motion.div>
    </div>
  );
};

/* ============================== workbench ============================== */
const Workbench = ({ qa, setQa }: { qa: { pass: boolean; note: string; measured: string }; setQa: (q: { pass: boolean; note: string; measured: string }) => void }) => {
  const [pageIdx, setPageIdx] = useState(5); // start on Arena Setup P06
  const [vIdx, setVIdx] = useState(0);
  const [vpIdx, setVpIdx] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [sheet, setSheet] = useState<null | "left" | "right">(null);
  const { reset } = useAsset();

  const page = PAGES[pageIdx];
  const v = VARIANTS[vIdx];

  const goTo = (i: number) => {
    setPageIdx(i);
    reset();
  };
  const changeV = (i: number) => {
    setVIdx(i);
    reset();
  };
  const onReport = () => setShowReport(true);

  /* keyboard: ↑↓ pages · 1–4 variants · R reset · M report */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        goTo(Math.min(PAGES.length - 1, pageIdx + 1));
        sfx.tick();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        goTo(Math.max(0, pageIdx - 1));
        sfx.tick();
      } else if (["1", "2", "3", "4"].includes(e.key)) {
        changeV(Number(e.key) - 1);
      } else if (e.key.toLowerCase() === "r" || e.key.toLowerCase() === "к") {
        reset();
        sfx.tick();
      } else if (e.key.toLowerCase() === "m" || e.key.toLowerCase() === "ь") {
        onReport();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIdx, vIdx]);

  return (
    <div className="relative flex h-full w-full flex-col bg-[#070b14]">
      {/* header */}
      <div className="flex h-[52px] shrink-0 items-center gap-3 border-b border-line px-4">
        <Emblem size={30} />
        <div>
          <div className="text-[13px] font-extrabold leading-none tracking-wide text-white">
            SIGNAL ARENA <span className="text-acc">· ASSET WORKBENCH</span>
          </div>
          <div className="mt-0.5 text-[9px] font-bold text-ink3">
            {page.id} · {page.name} · variant {v.id} «{v.label}» · {VIEWPORTS[vpIdx].l}
          </div>
        </div>
        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <span className="rounded-full border border-line bg-[#0c1526] px-2.5 py-1 text-[9px] font-extrabold text-ink3">
            34 pages · 4 variants · 40 skill icons · TopBar locked
          </span>
          <span
            className="rounded-full border px-2.5 py-1 text-[9px] font-extrabold"
            style={{
              borderColor: qa.pass ? "#1f5e58" : "#6e3430",
              background: qa.pass ? "rgba(16,36,31,.5)" : "rgba(36,21,24,.5)",
              color: qa.pass ? "#3ddc97" : "#ff8a94",
            }}
          >
            NO-SCROLL QA: {qa.pass ? "PASS" : "REVIEW"}
          </span>
          <button
            className="rounded-full border border-[#6e3430] bg-[#241518]/40 px-2.5 py-1 text-[9px] font-extrabold text-[#ff8a94]"
            onClick={onReport}
            title="Открыть provenance-отчёт"
          >
            MISSING: {MISSING_ASSETS.length}
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* left */}
        <div className="hidden w-[280px] shrink-0 border-r border-line bg-[#0a0f1c] lg:block">
          <LeftPanel pageIdx={pageIdx} setPageIdx={goTo} vIdx={vIdx} setVIdx={changeV} vpIdx={vpIdx} setVpIdx={(i) => setVpIdx(i)} onReport={() => setShowReport(true)} />
        </div>

        {/* stage */}
        <div className="min-w-0 flex-1 bg-[radial-gradient(ellipse_at_center,#0d1526_0%,#070b14_75%)]">
          <Stage pageIdx={pageIdx} vIdx={vIdx} vpIdx={vpIdx} setQa={setQa} />
        </div>

      {/* right */}
      <div className="hidden w-[300px] shrink-0 border-l border-line bg-[#0a0f1c] xl:block">
          <Inspector key={page.id} page={page} v={v} />
        </div>
      </div>

      {/* bottom tab bar: visible until the right panel appears */}
      <div className="flex h-[52px] shrink-0 items-center justify-around border-t border-line bg-[#0a0f1c] xl:hidden">
        <button
          className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 text-[9px] font-extrabold"
          style={{ color: sheet === "left" ? "#35e0d0" : "#6b7a9c" }}
          onClick={() => {
            setSheet((s) => (s === "left" ? null : "left"));
            sfx.tick();
          }}
        >
          <IPrev size={14} color={sheet === "left" ? "#35e0d0" : "#9fb0d0"} />
          Страницы
        </button>
        <div className="flex-1 text-center text-[9px] font-extrabold text-[#3a4a70]">
          {page.id}-{v.id}
        </div>
        <button
          className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 text-[9px] font-extrabold"
          style={{ color: sheet === "right" ? "#35e0d0" : "#6b7a9c" }}
          onClick={() => {
            setSheet((s) => (s === "right" ? null : "right"));
            sfx.tick();
          }}
        >
          <IEye size={14} color={sheet === "right" ? "#35e0d0" : "#9fb0d0"} />
          Inspector
        </button>
      </div>

      {/* mobile sheets */}
      <AnimatePresence>
        {sheet && (
          <motion.div className="fixed inset-0 z-[100] flex items-end xl:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60" onClick={() => setSheet(null)} />
            <motion.div
              className="relative h-[72%] w-full overflow-hidden rounded-t-[24px] border-t border-line bg-[#0a0f1c]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={spring.sheet}
            >
              <div className="flex items-center justify-between px-4 pt-3">
                <span className="text-[12px] font-extrabold text-white">{sheet === "left" ? "Page Inventory" : "Asset Inspector"}</span>
                <button className="text-[11px] font-extrabold text-ink3" onClick={() => setSheet(null)}>
                  Закрыть
                </button>
              </div>
              <div className="h-[calc(100%-44px)]">
                {sheet === "left" ? (
                  <LeftPanel pageIdx={pageIdx} setPageIdx={(i) => { goTo(i); setSheet(null); }} vIdx={vIdx} setVIdx={changeV} vpIdx={vpIdx} setVpIdx={(i) => setVpIdx(i)} onReport={() => { setSheet(null); setShowReport(true); }} />
                ) : (
                  <Inspector key={page.id} page={page} v={v} />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{showReport && <Report onClose={() => setShowReport(false)} qa={qa} />}</AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <AssetProvider>
        <WorkbenchRoot />
      </AssetProvider>
    </GameProvider>
  );
}

/* Workbench root: owns the no-scroll QA measurement state shared with Report */
const WorkbenchRoot = () => {
  const [qa, setQa] = useState({ pass: true, note: "Замер выполняется после загрузки шрифта и ассетов (700 мс).", measured: "—" });
  return <Workbench qa={qa} setQa={setQa} />;
};
