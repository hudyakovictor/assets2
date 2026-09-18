/* ============================================================================
   STUDIO — working shell around the live Mini App:
     LEFT  : Page Inventory P01…P34 · состояния · варианты A/B/C/D · поиск
     CENTER: настоящий экран Signal Arena (без корпуса телефона, без debug-подписей)
     RIGHT : Asset Inspector + QA + Docs
   Panels are studio chrome: they never render inside the exported game screen.
   ========================================================================== */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ASSETS, ASSET_MATRIX, DEFAULT_OVERRIDE, MISSING_ASSETS, overrideKey, PAGE_COUNT_MISMATCH,
  PAGES, QA_VIEWPORTS, SECTIONS, THREE_VARIANT_PAGES, type AssetDef, type MotionPresetId, type Override, type SlotKind,
} from "../game/catalog";
import { ART_STATIC } from "../game/art";
import { AssetThumb } from "../game/art";
import { SKILL_ICONS } from "../icons/skill";
import { Game } from "../game/Game";
import { sfx } from "../game/sfx";
import type { GameState } from "../game/state";
import { EMPTY_SCORE } from "../game/Game";

type Tab = "inspector" | "qa" | "docs";
const PROC = { facts: 1, reasoning: 0.8, risk: 1, discipline: 1 };

/* Пресеты состояний раунда — для проверки Seal / Reveal / Оценки без прокликивания */
const ROUND_PRESETS: { t: string; page: string; patch: Partial<GameState> }[] = [
  {
    t: "ДО t0", page: "p13",
    patch: {
      decision: null, picked: [], reasons: [], invalidation: null, locked: false, sealed: false, revealed: 0, scrubbing: false, zonePicked: false,
      pickState: "idle", showEvent: false, scored: false,
      score: EMPTY_SCORE,
    },
  },
  {
    t: "СИГНАЛЫ", page: "p14",
    patch: { picked: ["c03", "c17"], sealed: false, zonePicked: true, pickState: "hit" },
  },
  {
    t: "ПЕЧАТЬ", page: "p16",
    patch: { decision: "retest", picked: ["c03", "c17"], reasons: ["volume"], sealed: false, locked: false, zonePicked: true, pickState: "hit" },
  },
  {
    t: "НЕТ ПОПЫТОК", page: "p10",
    patch: { energy: 0, noAttempts: true },
  },
  {
    t: "РАЗВЁРТКА 40%", page: "p17",
    patch: {
      decision: "retest", picked: ["c03", "c17"], reasons: ["volume", "structure"], locked: true, sealed: true, revealed: 12, scrubbing: true,
      zonePicked: true, pickState: "hit", showEvent: false, scored: true,
      score: { stars: 3, xp: 180, coins: 66, correct: true, matched: ["c03", "c17"], missed: [], process: PROC },
    },
  },
  {
    t: "ИСТОРИЯ 100%", page: "p17",
    patch: { sealed: true, revealed: 99, scrubbing: false, showEvent: false },
  },
  {
    t: "СОБЫТИЕ", page: "p18",
    patch: { sealed: true, revealed: 99, scrubbing: false, showEvent: true, scored: true },
  },
  {
    t: "РАЗБОР", page: "p19",
    patch: { sealed: true, revealed: 99, showEvent: true, scored: true, picked: ["c03", "c17"] },
  },
  {
    t: "ОЦЕНКА 0★", page: "p20",
    patch: {
      sealed: true, locked: true, revealed: 99, decision: "sizeUp", picked: ["c09"], reasons: [], invalidation: null, scored: true,
      score: { stars: 0, xp: 38, coins: 14, correct: false, matched: [], missed: ["c03", "c17"], process: { facts: 0.25, reasoning: 0, risk: 0.2, discipline: 0.2 } },
    },
  },
];

interface QAResult {
  viewport: string;
  page: string;
  variant: string;
  vScroll: number;
  hScroll: number;
  clipped: string[];
  pass: boolean;
  detail: string;
}

export default function Studio() {
  const [pageId, setPageId] = useState("p10");
  const [variantId, setVariantId] = useState("A");
  const [tab, setTab] = useState<Tab>("inspector");
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<string>("ВСЕ");
  const [vpIndex, setVpIndex] = useState(0);
  const [exportMode, setExportMode] = useState(false);
  const [showMvp, setShowMvp] = useState(true);
  const [slot, setSlot] = useState<SlotKind>("background");
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [swaps, setSwaps] = useState<Record<string, string>>({});
  const [qa, setQa] = useState<QAResult[]>([]);
  const [qaRunning, setQaRunning] = useState(false);
  const [, setMotion] = useState<MotionPresetId>("cinematic");
  const stageRef = useRef<HTMLDivElement | null>(null);
  const deviceRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [sideTab, setSideTab] = useState<"pages" | "params">("pages");
  const [gp, setGp] = useState<Partial<GameState>>({});
  const [nonce, setNonce] = useState(0);
  const [noteTone, setNoteTone] = useState<"auto" | "cream" | "teal">("auto");
  const [accent, setAccent] = useState<"teal" | "ice">("teal");

  const setParam = (patch: Partial<GameState>) => {
    setGp((p) => ({ ...p, ...patch }));
    setNonce((n) => n + 1);
  };
  const applyPreset = (patch: Partial<GameState>) => setParam(patch);

  const page = useMemo(() => PAGES.find((p) => p.id === pageId) ?? PAGES[0], [pageId]);
  const variant = useMemo(
    () => page.variants.find((v) => v.id === variantId) ?? page.variants[0],
    [page, variantId],
  );
  const vp = QA_VIEWPORTS[vpIndex];

  useEffect(() => {
    if (!page.variants.some((v) => v.id === variantId)) setVariantId(page.variants[0].id);
  }, [page, variantId]);

  const assign = useMemo(() => {
    const out: Record<string, string> = {};
    page.slots.forEach((s) => {
      const swapped = swaps[`${page.id}|${s.slot}`];
      out[s.slot] = swapped ?? variant.assign[s.slot] ?? s.fallback;
    });
    return out;
  }, [page, variant, swaps]);

  const slotKey = overrideKey(page.id, variant.id, slot);
  const ov: Override = { ...DEFAULT_OVERRIDE, ...(overrides[slotKey] ?? {}) };
  const patchOv = (patch: Partial<Override>) => setOverrides((p) => ({ ...p, [slotKey]: { ...ov, ...patch } }));

  /* --------- fit the real viewport into the available studio space --------- */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const compute = () => {
      const pad = 12;
      const availH = el.clientHeight > 100 ? el.clientHeight : window.innerHeight - 70;
      const rawW = el.clientWidth > 100 ? el.clientWidth : window.innerWidth - 680;
      // если рядом стоит MVP-референс, отдаём ему ~300px ширины
      const availW = showMvp && !exportMode && rawW > 760 ? rawW - 330 : rawW;
      // uniform-масштаб с сохранением пропорций; выше 1.0 экран не растягивается никогда
      const z = Math.min((availW - pad) / vp.w, (availH - pad) / vp.h, 1);
      setZoom(Math.max(0.3, z));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [vp, exportMode, showMvp]);

  /* ------------------------------- QA runner ------------------------------ */
  const measure = (label: string): QAResult => {
    const dev = deviceRef.current;
    const screen = dev?.querySelector<HTMLElement>("[data-screen]") ?? dev;
    if (!dev || !screen) return { viewport: label, page: page.id, variant: variant.id, vScroll: 0, hScroll: 0, clipped: [], pass: false, detail: "экран не найден" };
    // проверяем и сам экран, и контейнеры с overflow: hidden внутри него —
    // скрытое переполнение всё равно считается дефектом (обрезанный CTA/Top Bar)
    let v = screen.scrollHeight - screen.clientHeight;
    let h = screen.scrollWidth - screen.clientWidth;
    const probes: HTMLElement[] = [screen, ...screen.querySelectorAll<HTMLElement>("[data-qa-critical]")];
    probes.forEach((el) => {
      if (el.closest(".scroll-y")) return; // внутренний scroll разрешён только длинным спискам
      v = Math.max(v, el.scrollHeight - el.clientHeight);
      h = Math.max(h, el.scrollWidth - el.clientWidth);
    });
    const frame = dev.getBoundingClientRect();
    const clipped: string[] = [];
    // critical chrome, CTA buttons and nav items must never be cut by the viewport
    screen.querySelectorAll<HTMLElement>("[data-qa-critical], .btn, .navitem, .skillcard").forEach((el) => {
      const r = el.getBoundingClientRect();
      const insideScreen = r.bottom > frame.bottom + 1 || r.top < frame.top - 1 || r.right > frame.right + 1 || r.left < frame.left - 1;
      const insideScrollHost = (() => {
        const host = el.closest<HTMLElement>(".scroll-y");
        if (!host) return false;
        const hr = host.getBoundingClientRect();
        return r.bottom > hr.bottom + 1 || r.top < hr.top - 1 || r.right > hr.right + 1 || r.left < hr.left - 1;
      })();
      if (insideScreen && !insideScrollHost) {
        clipped.push(el.dataset.qaCritical ?? el.className.split(" ").slice(0, 2).join("."));
      }
    });
    const pass = v <= 1 && h <= 1 && clipped.length === 0;
    return {
      viewport: label, page: page.id, variant: variant.id, vScroll: Math.max(0, v), hScroll: Math.max(0, h), clipped, pass,
      detail: pass
        ? "чисто: scrollHeight ≤ clientHeight, все CTA/Top Bar/навигация внутри кадра"
        : `ПРОБЛЕМА · вертикаль ${Math.max(0, v)}px, горизонталь ${Math.max(0, h)}px${clipped.length ? ` · обрезано: ${clipped.join(", ")}` : ""} · компонент: ${clipped[0] ?? "content"} · исправление: сократить второстепенный текст, убрать декор, разделить экран на состояние`,
    };
  };

  useEffect(() => {
    if (!qaRunning) return;
    const label = `${vp.w} × ${vp.h}`;
    const id = setTimeout(() => {
      setQa((p) => [...p.filter((r) => !(r.viewport === label && r.page === page.id && r.variant === variant.id)), measure(label)]);
      if (vpIndex + 1 < QA_VIEWPORTS.length) setVpIndex(vpIndex + 1);
      else { setQaRunning(false); setVpIndex(0); }
    }, 320);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qaRunning, vpIndex, vp.w, vp.h]);

  const runAll = () => { setQa([]); setVpIndex(0); setQaRunning(true); sfx.seal(); };

  /* --------------------------------- data -------------------------------- */
  const filtered = PAGES.filter((p) => {
    const q = query.trim().toLowerCase();
    const okQ = !q || p.id.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.state.toLowerCase().includes(q) || p.section.toLowerCase().includes(q);
    const okS = section === "ВСЕ" || p.section === section;
    return okQ && okS;
  });
  const pageRows = ASSET_MATRIX.filter((r) => r.page === page.id);
  const slotKindMap: Record<string, AssetDef["kind"][]> = {
    background: ["background"], chart: ["chart"], reveal: ["reveal"], cue: ["cue"], hero: ["hero"],
    ornament: ["ornament"], frame: ["ornament"], event: ["ornament"], feed: ["feed"], hand: ["hand"], emblem: ["emblem"],
  };
  const slotAssets = Object.values(ASSETS).filter((a) => (slotKindMap[slot] ?? [slot]).includes(a.kind));
  const currentSlotDef = page.slots.find((s) => s.slot === slot);
  const currentAsset: AssetDef | undefined = ASSETS[assign[slot] ?? ""];

  const motionToUse: MotionPresetId = ov.motion !== "inherit" ? ov.motion : variant.motion;
  const motionNow: MotionPresetId = (gp.motion as MotionPresetId | undefined) ?? motionToUse;
  const keyFor = (s: SlotKind) => overrideKey(page.id, variant.id, s);
  const bgOv: Override = { ...DEFAULT_OVERRIDE, ...(overrides[keyFor("background")] ?? {}) };
  const chOv: Override = { ...DEFAULT_OVERRIDE, ...(overrides[keyFor("chart")] ?? {}) };
  const artOv: Override = { ...DEFAULT_OVERRIDE, ...(overrides[keyFor("hero")] ?? overrides[keyFor("ornament")] ?? {}) };
  const deviceVars = {
    "--accent": accent === "teal" ? "#33c1a1" : "#8FD8FF",
    "--accent-deep": accent === "teal" ? "#1f8f78" : "#3F7FAE",
    "--accent-glow": accent === "teal" ? "rgba(51,193,161,.45)" : "rgba(143,216,255,.42)",
    ...(noteTone === "auto" ? {} : { "--note-ink": noteTone === "cream" ? "#E9D9A6" : "#8FE9D2" }),
    "--bg-scale": bgOv.scale,
    "--bg-x": `${bgOv.x}px`,
    "--bg-y": `${bgOv.y}px`,
    "--bg-opacity": bgOv.opacity,
    "--bg-tint": `${bgOv.tint}deg`,
    "--ch-scale": chOv.scale,
    "--ch-x": `${chOv.x}px`,
    "--ch-y": `${chOv.y}px`,
    "--ch-opacity": chOv.opacity,
    "--ch-tint": `${chOv.tint}deg`,
    "--art-scale": artOv.scale,
    "--art-x": `${artOv.x}px`,
    "--art-y": `${artOv.y}px`,
    "--art-opacity": artOv.opacity,
    "--art-tint": `${artOv.tint}deg`,
  } as React.CSSProperties;

  const idx = PAGES.findIndex((p) => p.id === page.id);
  const goto = (delta: number) => {
    const next = PAGES[Math.max(0, Math.min(PAGES.length - 1, idx + delta))];
    setPageId(next.id);
  };

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(120% 90% at 20% 0%, #0f1d31 0%, #070e1a 60%)" }}>
      {/* ------------------------------- topbar ------------------------------ */}
      <header className="flex h-12 items-center gap-2 px-3" style={{ borderBottom: "1px solid var(--stroke-soft)", overflowX: "auto", whiteSpace: "nowrap" }}>
        <span className="h3 font-arena" style={{ letterSpacing: ".1em", flex: "none" }}>SIGNAL ARENA</span>
        <span className="micro" style={{ flex: "none" }}>{page.id} · {variant.label}</span>
        <div className="ml-auto flex items-center gap-1.5" style={{ flex: "none" }}>
          <button type="button" className={`stu-chip ${sideTab === "pages" ? "is-active" : ""}`} onClick={() => setSideTab("pages")}>PAGES</button>
          <button type="button" className={`stu-chip ${sideTab === "params" ? "is-active" : ""}`} onClick={() => setSideTab("params")}>PARAMS</button>
          <select className="stu-input" style={{ width: 150, padding: "4px 8px" }} value={vpIndex} onChange={(e) => setVpIndex(+e.target.value)}>
            {QA_VIEWPORTS.map((v, i) => <option key={v.w} value={i}>{v.w} × {v.h}{v.primary ? " ·" : ""}</option>)}
          </select>
          <button type="button" className={`stu-chip ${showMvp ? "is-active" : ""}`} onClick={() => setShowMvp(!showMvp)}>
            MVP 300×620
          </button>
          <button type="button" className={`stu-chip ${exportMode ? "is-active" : ""}`} onClick={() => setExportMode(!exportMode)}>
            EXPORT
          </button>
        </div>
      </header>

      <div className={`stu ${exportMode ? "is-export" : ""}`}>
        {/* ------------------------------ left panel ------------------------- */}
        {!exportMode && (
          <aside className="stu-panel stu-side">
            {/* ------------------------- САЙДБАР ПАРАМЕТРОВ ------------------------ */}
            <div className="flex gap-1 p-2" style={{ borderBottom: "1px solid var(--stroke-soft)" }}>
              <button type="button" className={`stu-chip ${sideTab === "params" ? "is-active" : ""}`} onClick={() => setSideTab("params")}>ПАРАМЕТРЫ</button>
              <button type="button" className={`stu-chip ${sideTab === "pages" ? "is-active" : ""}`} onClick={() => setSideTab("pages")}>СТРАНИЦЫ P01–P34</button>
            </div>

            {sideTab === "params" ? (
              <div className="scroll-y flex-1 p-2">
                <div className="micro mb-1">КОМПОНОВКА ЭКРАНА · {page.id}</div>
                <div className="grid grid-cols-2 gap-1">
                  {page.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`stu-chip ${variant.id === v.id ? "is-active" : ""}`}
                      style={{ minHeight: 42, padding: "6px", textAlign: "left" }}
                      onClick={() => { sfx.pick(); setVariantId(v.id); }}
                    >
                      <span className="block">{v.label} · {v.motion.toUpperCase()}</span>
                      <span className="block" style={{ fontSize: 8, opacity: .74 }}>
                        {v.id === "A" ? "EDITORIAL STACK" : v.id === "B" ? "VISUAL FIRST" : v.id === "C" ? "EVIDENCE FIRST" : "TENSION CUT"}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="micro mt-1.5 mb-3">
                  Один стиль и данные; разные компоновка, artwork, effects, motion и touch-feedback.
                </div>

                <div className="micro mb-1">TOP BAR · ДИНАМИЧЕСКИЕ ЗНАЧЕНИЯ (только они)</div>
                <Param label="LVL" v={gp.lvl ?? 7} min={1} max={60} step={1} on={(v) => setParam({ lvl: v })} />
                <Param label="XP" v={gp.xp ?? 420} min={0} max={2000} step={10} on={(v) => setParam({ xp: v })} />
                <Param label="XP MAX" v={gp.xpMax ?? 600} min={200} max={3000} step={50} on={(v) => setParam({ xpMax: v })} />
                <Param label="ЭНЕРГИЯ / ПОПЫТКИ" v={gp.energy ?? 5} min={0} max={10} step={1} on={(v) => setParam({ energy: v })} />
                <Param label="ЗВЁЗДЫ" v={gp.stars ?? 48} min={0} max={500} step={1} on={(v) => setParam({ stars: v })} />
                <Param label="МОНЕТЫ" v={gp.coins ?? 320} min={0} max={9000} step={20} on={(v) => setParam({ coins: v })} />
                <Param label="СЕРИЯ ДНЕЙ" v={gp.streak ?? 6} min={0} max={30} step={1} on={(v) => setParam({ streak: v })} />
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <button type="button" className={`stu-chip ${gp.notificationsRead ? "" : "is-active"}`} onClick={() => setParam({ notificationsRead: !gp.notificationsRead })}>
                    BADGE {gp.notificationsRead ? "OFF" : "3"}
                  </button>
                  <button type="button" className="stu-chip" onClick={() => setParam({ lvl: 1, xp: 0, xpMax: 400, energy: 3, stars: 0, coins: 0, streak: 0 })}>НОВИЧОК</button>
                  <button type="button" className="stu-chip" onClick={() => setParam({ lvl: 7, xp: 420, xpMax: 600, energy: 5, stars: 48, coins: 320, streak: 6 })}>ДЕФОЛТ</button>
                </div>

                <div className="micro mt-3 mb-1">MOTION И ДОСТУПНОСТЬ</div>
                <div className="flex flex-wrap gap-1">
                  {(["subtle", "punchy", "cinematic"] as MotionPresetId[]).map((m) => (
                    <button key={m} type="button" className={`stu-chip ${motionNow === m ? "is-active" : ""}`} onClick={() => { setMotion(m); patchOv({ motion: m }); setParam({ motion: m }); }}>
                      {m}
                    </button>
                  ))}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <button type="button" className={`stu-chip ${gp.reduced ? "is-active" : ""}`} onClick={() => setParam({ reduced: !gp.reduced })}>REDUCE MOTION</button>
                  <button type="button" className={`stu-chip ${gp.sound === false ? "" : "is-active"}`} onClick={() => setParam({ sound: !(gp.sound ?? true) })}>ЗВУК</button>
                  <button type="button" className={`stu-chip ${gp.haptics === false ? "" : "is-active"}`} onClick={() => setParam({ haptics: !(gp.haptics ?? true) })}>ХАПТИКА</button>
                </div>

                <div className="micro mt-3 mb-1">СОСТОЯНИЯ РАУНДА</div>
                <div className="grid grid-cols-2 gap-1">
                  {ROUND_PRESETS.map((r) => (
                    <button key={r.t} type="button" className="stu-chip" style={{ padding: "7px 6px", textAlign: "center" }}
                      onClick={() => { setPageId(r.page); applyPreset(r.patch); }}>
                      {r.t}
                    </button>
                  ))}
                </div>
                <div className="micro mt-3 mb-1">РУКОПИСНЫЕ ЗАМЕТКИ И АКЦЕНТ</div>
                <div className="flex flex-wrap gap-1">
                  <button type="button" className={`stu-chip ${noteTone === "auto" ? "is-active" : ""}`} onClick={() => setNoteTone("auto")}>ЧЕРНИЛА АВТО</button>
                  <button type="button" className={`stu-chip ${noteTone === "cream" ? "is-active" : ""}`} onClick={() => setNoteTone("cream")}>ТЁПЛЫЕ</button>
                  <button type="button" className={`stu-chip ${noteTone === "teal" ? "is-active" : ""}`} onClick={() => setNoteTone("teal")}>БИРЮЗА</button>
                  <button type="button" className={`stu-chip ${accent === "teal" ? "is-active" : ""}`} onClick={() => setAccent(accent === "teal" ? "ice" : "teal")}>
                    АКЦЕНТ {accent === "teal" ? "БИРЮЗОВЫЙ" : "ЛЕДЯНОЙ"}
                  </button>
                </div>
                <div className="micro mt-2">
                  Акцент применяется ко всем системным элементам арены (CTA, прогресс, активная вкладка, фокус-ринги), но никогда не меняет палитру skill cards.
                </div>
              </div>
            ) : (
              <>
                {/* Текущая страница: крупный переключатель компоновок A/B/C/D всегда сверху */}
                <div className="p-2" style={{ borderBottom: "1px solid var(--stroke-soft)", background: "rgba(51,193,161,.06)" }}>
                  <div className="flex items-center justify-between">
                    <span className="micro" style={{ color: "#9FE8D3" }}>{page.id} · {page.section}</span>
                    <span className="micro">{page.state}</span>
                  </div>
                  <div className="h3 mt-0.5" style={{ fontSize: 13 }}>{page.title}</div>
                  <div className="mt-2 grid gap-1" style={{ gridTemplateColumns: `repeat(${page.variants.length}, 1fr)` }}>
                    {page.variants.map((v) => (
                      <button key={v.id} type="button"
                        className={`stu-chip ${variant.id === v.id ? "is-active" : ""}`}
                        style={{ minHeight: 50, padding: "5px 4px", textAlign: "center", lineHeight: 1.1 }}
                        onClick={() => { sfx.pick(); setVariantId(v.id); }}>
                        <span className="block" style={{ fontSize: 15, fontWeight: 900 }}>{v.id}</span>
                        <span className="block" style={{ fontSize: 7.5, opacity: .8, letterSpacing: ".04em" }}>
                          {v.id === "A" ? "STACK" : v.id === "B" ? "IMMERSIVE" : v.id === "C" ? "EVIDENCE" : "SPLIT"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-2" style={{ borderBottom: "1px solid var(--stroke-soft)" }}>
                  <input className="stu-input" placeholder="поиск: p13, график, seal, arena…" value={query} onChange={(e) => setQuery(e.target.value)} />
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {["ВСЕ", ...SECTIONS].map((s) => (
                      <button key={s} type="button" className={`stu-chip ${section === s ? "is-active" : ""}`} onClick={() => setSection(s)}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="scroll-y flex-1 p-1.5">
                  {filtered.map((p) => (
                    <div key={p.id} className={`stu-row ${p.id === page.id ? "is-current" : ""}`} onClick={() => { sfx.tick(); setPageId(p.id); }}>
                      <span className="tabular" style={{ width: 26, fontWeight: 700, color: p.id === page.id ? "#9FE8D3" : "#8FA6C6" }}>{p.id}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate" style={{ fontSize: 11.5, fontWeight: 600 }}>{p.title}</span>
                        <span className="block truncate micro" style={{ fontSize: 9 }}>{p.section} · {p.state}</span>
                      </span>
                      <span className="flex gap-0.5">
                        {p.variants.map((v) => (
                          <span key={v.id} className="stu-chip" style={{ padding: "0 4px", fontSize: 8.5, opacity: p.id === page.id && v.id === variant.id ? 1 : 0.6 }}
                            onClick={(e) => { e.stopPropagation(); setPageId(p.id); setVariantId(v.id); }}>
                            {v.id}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex items-center gap-1.5 p-2" style={{ borderTop: "1px solid var(--stroke-soft)" }}>
              <button type="button" className="stu-chip" onClick={() => goto(-1)}>← PREV</button>
              <span className="micro">{page.id} · {variant.id} · {page.variants.length} варианта</span>
              <button type="button" className="stu-chip" style={{ marginLeft: "auto" }} onClick={() => goto(1)}>NEXT →</button>
            </div>
          </aside>
        )}

        {/* ------------------------------- stage ---------------------------- */}
        <div className="stu-panel stu-stage">
          <div className="stage-wrap" ref={stageRef}>
            {/* MVP reference artboard 300×620 (15/31) — только для сравнения композиции, не production-размер */}
            {!exportMode && showMvp && (
              <div className="mvp-ref" style={{ transform: `scale(${Math.min(1, zoom * 1.05)})`, transformOrigin: "right center" }}>
                <div className="mvp-frame">
                  <div className="screen" style={{ padding: 10, gap: 8 }}>
                    <div className="micro" style={{ color: "#9FE8D3" }}>MVP REFERENCE · {page.id}</div>
                    <div className="h3" style={{ fontSize: 13 }}>{page.title}</div>
                    <div className="micro">{page.state}</div>
                    <div style={{ flex: 1, border: "2px dashed var(--stroke)", borderRadius: 14, display: "grid", placeItems: "center" }}>
                      <span className="micro" style={{ textAlign: "center", padding: 8 }}>{page.source}</span>
                    </div>
                    <div style={{ height: 56, border: "2px dashed var(--stroke)", borderRadius: 14 }} />
                  </div>
                </div>
                <div className="micro" style={{ textAlign: "center", marginTop: 6 }}>300 × 620 · 15/31 · inner 294 × 614</div>
              </div>
            )}
            {/* внешний бокс занимает масштабированный размер, чтобы grid центрировал корректно */}
            <div style={{ width: vp.w * zoom, height: vp.h * zoom, position: "relative", flex: "none" }}>
            <div
              className={`device ${exportMode ? "is-export" : ""}`}
              ref={deviceRef}
              style={{ ...deviceVars, width: vp.w, height: vp.h, transform: `scale(${zoom})`, transformOrigin: "top left", position: "absolute", left: 0, top: 0 }}
            >
              <Game
                page={page}
                variantId={variant.id}
                motion={motionToUse}
                assign={assign}
                onNavigate={setPageId}
                width={vp.w}
                height={vp.h}
                zoom={zoom}
                bgOverride={{ scale: bgOv.scale, x: bgOv.x, y: bgOv.y, opacity: bgOv.opacity, tint: bgOv.tint, fit: bgOv.fit }}
                params={gp}
                paramsNonce={nonce}
              />
            </div>
            </div>
          </div>
        </div>

        {/* ----------------------------- right panel ------------------------ */}
        {!exportMode && (
          <aside className="stu-panel stu-inspect">
            <div className="flex gap-1 p-2" style={{ borderBottom: "1px solid var(--stroke-soft)" }}>
              {(["inspector", "qa", "docs"] as Tab[]).map((t) => (
                <button key={t} type="button" className={`stu-chip ${tab === t ? "is-active" : ""}`} onClick={() => setTab(t)}>
                  {t === "inspector" ? "ASSET INSPECTOR" : t === "qa" ? "QA" : "DOCS"}
                </button>
              ))}
            </div>

            {tab === "inspector" && (
              <div className="scroll-y flex-1 p-2">
                <div className="micro mb-1">СЛОТЫ СТРАНИЦЫ (одинаковы во всех вариантах)</div>
                <div className="flex flex-wrap gap-1">
                  {page.slots.map((s) => (
                    <button key={s.slot} type="button" className={`stu-chip ${s.slot === slot ? "is-active" : ""}`} onClick={() => setSlot(s.slot)}>{s.slot}</button>
                  ))}
                </div>
                <div className="mt-2 flex items-start gap-2">
                  <AssetThumb assetId={assign[slot] ?? ""} size={62} />
                  <div className="min-w-0">
                    <div className="h3" style={{ fontSize: 12 }}>{assign[slot]}</div>
                    <div className="micro">{currentAsset?.label ?? "—"}</div>
                    <div className="micro" style={{ color: "#9FE8D3" }}>SOURCE: {currentAsset?.source ?? "MISSING"}</div>
                  </div>
                </div>
                <Field label="ASSET (переопределение варианта)">
                  <select className="stu-input" value={assign[slot] ?? ""} onChange={(e) => setSwaps((p) => ({ ...p, [`${page.id}|${slot}`]: e.target.value }))}>
                    {slotAssets.map((a) => <option key={a.id} value={a.id}>{a.id} — {a.label}</option>)}
                  </select>
                </Field>
                <Field label={slot === "background" ? "CROP X / Y (фон)" : slot === "chart" ? "CROP X / Y (график)" : "OFFSET X / Y (art)"}>
                  <div className="flex items-center gap-2">
                    <input type="range" min={0} max={100} value={ov.cropX} onChange={(e) => patchOv({ cropX: +e.target.value })} style={{ flex: 1 }} />
                    <span className="micro tabular">{ov.cropX}</span>
                    <input type="range" min={0} max={100} value={ov.cropY} onChange={(e) => patchOv({ cropY: +e.target.value })} style={{ flex: 1 }} />
                    <span className="micro tabular">{ov.cropY}</span>
                  </div>
                </Field>
                <Field label="FIT">
                  <div className="flex gap-1">
                    {(["cover", "contain"] as const).map((f) => (
                      <button key={f} type="button" className={`stu-chip ${ov.fit === f ? "is-active" : ""}`} onClick={() => patchOv({ fit: f })}>{f}</button>
                    ))}
                  </div>
                </Field>
                <Field label={`SCALE ${ov.scale.toFixed(2)}`}>
                  <input type="range" min={0.6} max={1.6} step={0.02} value={ov.scale} onChange={(e) => patchOv({ scale: +e.target.value })} style={{ width: "100%" }} />
                </Field>
                <Field label={`POSITION X ${ov.x} · Y ${ov.y}`}>
                  <input type="range" min={-40} max={40} value={ov.x} onChange={(e) => patchOv({ x: +e.target.value })} style={{ width: "100%" }} />
                  <input type="range" min={-40} max={40} value={ov.y} onChange={(e) => patchOv({ y: +e.target.value })} style={{ width: "100%" }} />
                </Field>
                <Field label={`OPACITY ${ov.opacity.toFixed(2)}`}>
                  <input type="range" min={0.2} max={1} step={0.02} value={ov.opacity} onChange={(e) => patchOv({ opacity: +e.target.value })} style={{ width: "100%" }} />
                </Field>
                <Field label={`TINT ${ov.tint}° (без изменения палитры карточек)`}>
                  <input type="range" min={-40} max={40} value={ov.tint} onChange={(e) => patchOv({ tint: +e.target.value })} style={{ width: "100%" }} />
                </Field>
                <Field label="MOTION PRESET">
                  <div className="flex flex-wrap gap-1">
                    {(["inherit", "subtle", "punchy", "cinematic"] as const).map((m) => (
                      <button key={m} type="button" className={`stu-chip ${ov.motion === m ? "is-active" : ""}`} onClick={() => { patchOv({ motion: m }); if (m !== "inherit") setMotion(m); }}>{m}</button>
                    ))}
                  </div>
                </Field>
                <div className="mt-2 rounded-lg p-2" style={{ background: "rgba(6,14,26,.7)", border: "1px solid var(--stroke-soft)" }}>
                  <div className="micro">SLOT {slot} · {currentSlotDef?.purpose}</div>
                  <div className="micro">PLACEMENT: {currentSlotDef?.placement}</div>
                  <div className="micro">FALLBACK: {currentSlotDef?.fallback}</div>
                </div>
                <div className="mt-2 flex gap-1.5">
                  <button type="button" className="stu-chip" onClick={() => setOverrides((p) => { const c = { ...p }; delete c[slotKey]; return c; })}>RESET SLOT</button>
                  <button type="button" className="stu-chip" onClick={() => { setOverrides({}); setSwaps({}); setMotion(variant.motion); }}>RESET VARIANT</button>
                </div>
                <div className="mt-2 micro">
                  Варианты сохраняют бренд, текст, типографическую систему, SHARED_TOP_BAR_LOCKED, нижнее меню, механику и смысл состояния. Отличаются компоновкой крупных зон, assetId, chart treatment, background/reveal, motion choreography и touch-feedback.
                </div>
              </div>
            )}

            {tab === "qa" && (
              <div className="scroll-y flex-1 p-2">
                <div className="flex items-center gap-1.5">
                  <button type="button" className={`stu-chip ${qaRunning ? "is-active" : ""}`} onClick={runAll} disabled={qaRunning}>
                    {qaRunning ? "ИДЁТ ПРОГОН…" : "RUN QA · ВСЕ VIEWPORT"}
                  </button>
                  <span className="micro">{vp.w} × {vp.h} {QA_VIEWPORTS[vpIndex].primary ? "· обязательный" : "· дополнительный"}</span>
                </div>
                <div className="mt-2 flex flex-col gap-1.5">
                  {qa.length === 0 && (
                    <div className="micro">
                      Прогон проверяет: scrollHeight ≤ clientHeight, scrollWidth ≤ clientWidth, отсутствие обрезанных CTA, Top Bar и нижней навигации.
                    </div>
                  )}
                  {qa.map((r) => (
                    <div key={`${r.viewport}-${r.page}-${r.variant}`} className="rounded-lg p-2" style={{ border: `1px solid ${r.pass ? "#2E7F5C" : "#C56861"}`, background: r.pass ? "rgba(46,127,92,.12)" : "rgba(197,104,97,.14)" }}>
                      <div className="flex items-center gap-1.5">
                        <span className="micro" style={{ color: r.pass ? "#9FE8D3" : "#FFC7C3" }}>{r.pass ? "PASS" : "FAIL"}</span>
                        <span className="micro">{r.viewport}</span>
                        <span className="micro" style={{ marginLeft: "auto" }}>{r.page} · {r.variant}</span>
                      </div>
                      <div className="micro tabular">vertical overflow {r.vScroll}px · horizontal overflow {r.hScroll}px</div>
                      {!r.pass && <div className="micro">{r.detail}</div>}
                    </div>
                  ))}
                </div>
                <div className="mt-2 micro">
                  Рабочие панели каталога имеют собственный scroll. Игровой экран автоскроллом не исправляется: сначала сокращается второстепенный текст, затем убирается декор, затем экран делится на отдельное состояние.
                </div>
              </div>
            )}

            {tab === "docs" && (
              <div className="scroll-y flex-1 p-2">
                <div className="micro mb-1">PAGE INVENTORY (финальный список)</div>
                <table className="stu-table">
                  <thead><tr><th>ID</th><th>Название</th><th>Раздел</th><th>Варианты</th></tr></thead>
                  <tbody>
                    {PAGES.map((p) => (
                      <tr key={p.id} className={p.id === page.id ? "is-hit" : ""}>
                        <td className="tabular">{p.id}</td>
                        <td>{p.title}</td>
                        <td>{p.section}</td>
                        <td className="tabular">{p.variants.map((v) => v.id).join("/")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="micro mt-3 mb-1">ASSET MATRIX · {page.id} ({pageRows.length} строк из {ASSET_MATRIX.length})</div>
                <table className="stu-table">
                  <thead><tr><th>Page</th><th>Variant</th><th>Slot</th><th>Asset ID</th><th>Source</th><th>Placement</th><th>Fallback</th></tr></thead>
                  <tbody>
                    {pageRows.map((r, i) => (
                      <tr key={i}>
                        <td>{r.page}</td><td>{r.variant}</td><td>{r.slot}</td><td style={{ color: "#9FE8D3" }}>{r.assetId}</td>
                        <td>{r.source}</td><td>{r.placement}</td><td>{r.fallback}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="micro mt-3 mb-1">MISSING ASSET</div>
                <table className="stu-table">
                  <thead><tr><th>Файл</th><th>Статус</th><th>Действие</th></tr></thead>
                  <tbody>
                    {MISSING_ASSETS.map((m) => (
                      <tr key={m.name}><td>{m.name}</td><td style={{ color: "#FFC7C3" }}>{m.status}</td><td>{m.action}</td></tr>
                    ))}
                  </tbody>
                </table>
                <div className="micro mt-3">PAGE COUNT MISMATCH: запрошено {PAGE_COUNT_MISMATCH.requested} · машинночитаемая нумерация: {PAGE_COUNT_MISMATCH.machineReadableSources} · {PAGE_COUNT_MISMATCH.action}</div>
                <div className="micro mt-2">СТРАНИЦЫ С 3 ВАРИАНТАМИ (4-й был бы дубликатом): {THREE_VARIANT_PAGES.join(", ")}</div>
                <div className="micro mt-2">TOP BAR ASSETS: ICO-BOLT · ICO-STAR · ICO-COIN · ICO-BELL · ICO-GEAR (REPO_FILE: topbar/icons/*.svg, формат из topbar.html)</div>
                <div className="micro mt-2">SKILL ICONS: {SKILL_ICONS.length} файлов c01…c40 · группа green {SKILL_ICONS.filter((s) => s.group === "green").length} · yellow {SKILL_ICONS.filter((s) => s.group === "yellow").length} · blue {SKILL_ICONS.filter((s) => s.group === "blue").length} · red {SKILL_ICONS.filter((s) => s.group === "red").length} · палитра #2E7F5C / #D0B24A / #4C6180 / #C56861</div>
                <div className="micro mt-2">ART MODULES: {ART_STATIC.count} процедурных ассетов без внешних источников</div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-2">
      <div className="micro mb-1">{label}</div>
      {children}
    </div>
  );
}

function Param({ label, v, min, max, step, on }: {
  label: string; v: number; min: number; max: number; step: number; on: (v: number) => void;
}) {
  return (
    <div className="mb-1.5">
      <div className="flex items-center justify-between">
        <span className="micro">{label}</span>
        <span className="micro tabular" style={{ color: "#9FE8D3" }}>{v}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={v}
        onChange={(e) => on(+e.target.value)}
        style={{ width: "100%" }}
      />
    </div>
  );
}
