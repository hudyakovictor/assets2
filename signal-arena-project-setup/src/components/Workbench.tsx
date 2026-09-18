import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PAGES, type Page, type Slot, type Variant, type VariantId } from "../data/pages";
import { REQUIRED, normaliseSvg } from "../lib/assetLoader";
import { useAssets } from "./AssetContext";
import { GameScreen } from "./GameScreen";
import { QARunner, VIEWPORTS, type QAResult } from "./QA";
import { TOPBAR_ICONS, type TopBarMode } from "./TopBar";
import { Report } from "./Report";
import { IconClose, IconList, IconInspector } from "./StudioIcons";

type Override = Partial<{ scale: number; opacity: number; position: string; fit: "contain" | "cover"; tint: string }>;

type Props = {
  onExit?: () => void;
  /** export mode: render exactly one page/variant and nothing else */
  exportPage?: string;
  exportVariant?: VariantId;
};

export function Workbench({ onExit, exportPage, exportVariant }: Props) {
  const reg = useAssets();
  const exportMode = !!exportPage;

  const startIdx = exportMode ? Math.max(0, PAGES.findIndex((p) => p.id === exportPage)) : 0;
  const [pi, setPi] = useState(startIdx);
  const [vid, setVid] = useState<VariantId>(exportVariant ?? "A");
  const [q, setQ] = useState("");
  const [vp, setVp] = useState(VIEWPORTS[1]);
  const [mvp, setMvp] = useState(false);
  const [slotSel, setSlotSel] = useState(0);
  const [ov, setOv] = useState<Record<string, Record<string, Override>>>({});
  const [qa, setQa] = useState<QAResult[]>([]);
  const [qaAll, setQaAll] = useState(false);
  const [topBarMode, setTopBarMode] = useState<TopBarMode>("topbar.html");
  const [report, setReport] = useState(false);
  const [gen, setGen] = useState(0);
  const [drawer, setDrawer] = useState<"none" | "inv" | "ins">("none");

  const page: Page = PAGES[pi] ?? PAGES[0];
  const variant: Variant = page.variants.find((v) => v.id === vid) ?? page.variants[0];
  const key = `${page.id}-${variant.id}`;
  const slot: Slot | undefined = variant.slots[slotSel] ?? variant.slots[0];
  const list = useMemo(
    () => PAGES.filter((p) => (p.id + p.title + p.section + p.state).toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  useEffect(() => {
    if (!page.variants.some((v) => v.id === vid)) setVid("A");
    setSlotSel(0);
  }, [pi, vid, page.variants]);
  useEffect(() => setGen((g) => g + 1), [pi, vid]);

  const go = (d: number) => setPi((i) => Math.min(PAGES.length - 1, Math.max(0, i + d)));
  const onNav = (id: string) =>
    setPi(PAGES.findIndex((p) => (id === "academy" ? p.id === "P18" : id === "profile" ? p.id === "P29" : p.id === "P23")));
  const onQa = useCallback((r: QAResult[]) => setQa(r), []);
  const setO = (patch: Override) =>
    slot && setOv((o) => ({ ...o, [key]: { ...(o[key] || {}), [slot.slot]: { ...(o[key]?.[slot.slot] || {}), ...patch } } }));
  const cur = { ...slot, ...(ov[key]?.[slot?.slot || ""] || {}) } as Slot;

  /* ---- correct, never-negative fit-to-stage scale (measured, not window) ---- */
  const stageRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    setBox({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const frameW = mvp ? 300 : vp.w;
  const frameH = mvp ? 620 : vp.h;
  const chromeH = exportMode ? 0 : 96;
  const chromeW = exportMode ? 0 : 48;
  const scale = Math.max(
    0.25,
    Math.min(1, (box.w - chromeW) / frameW || 1, (box.h - chromeH) / frameH || 1),
  );

  const okAll = qa.length > 0 && qa.every((r) => r.ok);
  const exportUrl = `${location.pathname}#export=${page.id}-${variant.id}&vp=${vp.id}`;
  const bad = qa.flatMap((r) => r.issues.map((i) => ({ vp: r.viewport, ...i })));

  /* ============================ EXPORT MODE ============================ */
  if (exportMode) {
    return (
      <div className="app">
        <div className="screen">
          <GameScreen
            key={key}
            page={page}
            variant={variant}
            topBarMode={topBarMode}
            slotOverrides={ov[key]}
          />
        </div>
      </div>
    );
  }

  /* ============================ STUDIO MODE ============================ */
  return (
    <div className="wb">
      {/* ---------------- LEFT: Page Inventory ---------------- */}
      <aside className={`wb-panel ${drawer === "inv" ? "open" : ""}`}>
        <div className="wb-head">
          <span className="dot" />
          <div style={{ fontWeight: 700, fontSize: 13 }}>Signal Arena · Workbench</div>
          <button className="icon-btn only-mobile" onClick={() => setDrawer("none")} aria-label="Закрыть">
            <IconClose className="w-5 h-5" />
          </button>
        </div>
        <div className="pad-x"><input placeholder="Поиск P01–P34…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="pad-x row-gap">
          <button className="wbtn" onClick={() => go(-1)} style={{ flex: 1, minHeight: 44 }}>← Previous</button>
          <button className="wbtn" onClick={() => go(1)} style={{ flex: 1, minHeight: 44 }}>Next →</button>
        </div>
        <div className="pad-x row-gap wrap">
          <span className="t s">Вариант</span>
          <div className="seg">
            {page.variants.map((v) => (
              <button key={v.id} className={v.id === variant.id ? "on" : ""} onClick={() => setVid(v.id)}>{v.id}</button>
            ))}
          </div>
          {page.variants.length === 3 && <span className="tag warn" title={page.variantNote}>3 варианта</span>}
        </div>
        <h3>Page Inventory</h3>
        {(["Onboarding", "Арена", "Академия", "Профиль", "Сервис"] as const).map((sec) => {
          const items = list.filter((p) => p.section === sec);
          if (!items.length) return null;
          return (
            <div key={sec}>
              <div className="t s" style={{ padding: "8px 14px 2px", letterSpacing: ".08em" }}>{sec.toUpperCase()}</div>
              {items.map((p) => (
                <button
                  key={p.id}
                  className={`row-item ${p.id === page.id ? "sel" : ""}`}
                  onClick={() => { setPi(PAGES.indexOf(p)); setDrawer("none"); }}
                >
                  <span className="pid">{p.id}</span>
                  <span style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <span className="ellip">{p.title}</span>
                    <span className="t s" style={{ fontSize: 10, display: "block" }}>
                      {p.state} · {p.variants.map((v) => v.id).join("/")}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          );
        })}
        <div className="pad-x col-gap">
          <button className="wbtn" style={{ width: "100%", minHeight: 44 }} onClick={() => setReport(true)}>Final Report</button>
          {onExit && <button className="wbtn" style={{ width: "100%", minHeight: 44 }} onClick={onExit}>← К игре</button>}
        </div>
      </aside>

      {/* ---------------- CENTER: game screen only ---------------- */}
      <main className="wb-center">
        <div className="center-top">
          <button className="icon-btn only-mobile" onClick={() => setDrawer("inv")} aria-label="Page Inventory">
            <IconList className="w-5 h-5" />
          </button>
          <div className="seg scroll-x">
            {VIEWPORTS.map((v) => (
              <button key={v.id} className={v.id === vp.id && !mvp ? "on" : ""} onClick={() => { setVp(v); setMvp(false); }}>
                {v.id}
              </button>
            ))}
            <button className={mvp ? "on" : ""} onClick={() => setMvp(true)} title="MVP reference artboard 300×620 (15/31) — только для сравнения">
              MVP 300×620
            </button>
          </div>
          <button className="icon-btn only-mobile" onClick={() => setDrawer("ins")} aria-label="Asset Inspector">
            <IconInspector className="w-5 h-5" />
          </button>
        </div>

        <div className="qa-badge">
          <span className={`tag ${qa.length ? (okAll ? "ok" : "bad") : ""}`}>
            {qa.length ? (okAll ? "NO-SCROLL QA ✓" : `QA: ${qa.filter((r) => !r.ok).length} issue(s)`) : "QA…"}
          </span>
          <a className="tag" href={exportUrl} target="_blank" rel="noreferrer" title="Экспорт игрового экрана без рабочих панелей">Export ↗</a>
        </div>

        <div className="stage" ref={stageRef}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
            <div className={`frame ${mvp ? "mvp" : ""}`} style={{ width: frameW, height: frameH, aspectRatio: mvp ? "15 / 31" : undefined }}>
              <div className="app" style={{ height: "100%", minHeight: 0 }}>
                <div className="screen" style={{ height: "100%" }}>
                  <GameScreen key={key + gen} page={page} variant={variant} onNext={() => go(1)} onNav={onNav} topBarMode={topBarMode} slotOverrides={ov[key]} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="t s center-caption">
          {mvp
            ? "MVP reference artboard · 300×620 · border 3px · inner 294×614 — не production-размер"
            : `${vp.w}×${vp.h} CSS px · Telegram WebView · production responsive · scale ${scale.toFixed(2)}`}
        </div>

        {!!bad.length && (
          <div className="qa-report">
            <div className="t s" style={{ marginBottom: 4 }}>NO-SCROLL QA · требуется исправление</div>
            {bad.slice(0, 4).map((i, k) => (
              <div key={k} className="mono bad">
                {page.id}-{variant.id} · {i.vp} · {i.component} · {i.actual} · {i.type} → {i.fix}
              </div>
            ))}
          </div>
        )}

        <QARunner key={key} page={page} variant={variant} viewports={qaAll ? VIEWPORTS : VIEWPORTS.filter((v) => v.req)} onDone={onQa} />
      </main>

      {/* ---------------- RIGHT: Asset Inspector ---------------- */}
      <aside className={`wb-panel right ${drawer === "ins" ? "open" : ""}`}>
        <div className="wb-head">
          <h3 style={{ padding: 0 }}>Asset Inspector · {page.id}-{variant.id}</h3>
          <button className="icon-btn only-mobile" onClick={() => setDrawer("none")} aria-label="Закрыть">
            <IconClose className="w-5 h-5" />
          </button>
        </div>
        <div className="pad-x row-gap wrap">
          {variant.slots.map((s, i) => (
            <button
              key={s.slot}
              className="wbtn"
              style={{ padding: "6px 9px", fontSize: 11, minHeight: 36, background: i === slotSel ? "var(--acc)" : undefined, color: i === slotSel ? "#04222a" : undefined }}
              onClick={() => setSlotSel(i)}
            >
              {s.slot}
            </button>
          ))}
        </div>
        {slot && (
          <>
            <div className="slot-preview"><SlotPreview slot={cur} /></div>
            <div className="kv">
              <b>assetId</b><span className="mono">{slot.assetId}</span>
              <b>source</b><span>{slot.source}</span>
              <b>slot</b><span>{slot.slot}</span>
              <b>placement</b><span>{slot.placement}</span>
              <b>purpose</b><span>{slot.purpose}</span>
              <b>fallback</b><span>{slot.fallback}</span>
              <b>motion</b><span>{slot.motion}</span>
            </div>
            <div className="kv">
              <b>fit</b><span><div className="seg">{(["contain", "cover"] as const).map((f) => <button key={f} className={cur.fit === f ? "on" : ""} onClick={() => setO({ fit: f })}>{f}</button>)}</div></span>
              <b>crop / position</b><span><select value={cur.position} onChange={(e) => setO({ position: e.target.value })}>{["center", "center 40%", "center 60%", "top", "bottom", "optical center", "t0→end"].map((p) => <option key={p}>{p}</option>)}</select></span>
              <b>scale {cur.scale.toFixed(2)}</b><span><input type="range" min={0.8} max={1.3} step={0.01} value={cur.scale} onChange={(e) => setO({ scale: +e.target.value })} /></span>
              <b>opacity {cur.opacity.toFixed(2)}</b><span><input type="range" min={0.3} max={1} step={0.01} value={cur.opacity} onChange={(e) => setO({ opacity: +e.target.value })} /></span>
              <b>tint</b><span><select value={cur.tint} onChange={(e) => setO({ tint: e.target.value })}>{["none", "cool", "warm", "mono", "white (locked)"].map((p) => <option key={p}>{p}</option>)}</select></span>
            </div>
            <div className="pad-x row-gap">
              <button className="wbtn" style={{ minHeight: 44 }} onClick={() => setOv((o) => ({ ...o, [key]: {} }))}>Reset Variant</button>
              <span className="t s" style={{ alignSelf: "center" }}>layout locked · только asset-параметры</span>
            </div>
          </>
        )}

        <h3>Top Bar · SHARED_TOP_BAR_LOCKED</h3>
        <div className="kv">
          <b>source</b><span>{reg?.topbarHtml ? <span className="ok">topbar.zip/topbar.html ✓</span> : <span className="bad">MISSING_ASSET: topbar.zip/topbar.html</span>}</span>
          <b>render</b><span><div className="seg"><button className={topBarMode === "topbar.html" ? "on" : ""} onClick={() => setTopBarMode("topbar.html")} disabled={!reg?.topbarHtml}>topbar.html</button><button className={topBarMode === "mvp-geometry" ? "on" : ""} onClick={() => setTopBarMode("mvp-geometry")}>MVP .tb</button></div></span>
          {TOPBAR_ICONS.map((f) => (
            <span key={f} style={{ display: "contents" }}>
              <b>{f}</b>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {reg?.entries[f]?.text ? <><span style={{ width: 16, height: 16, display: "inline-flex" }} dangerouslySetInnerHTML={{ __html: normaliseSvg(reg.entries[f].text!) }} /><span className="ok mono">{reg.entries[f].path}</span></> : <span className="bad">MISSING_ASSET: topbar.zip/{f}</span>}
              </span>
            </span>
          ))}
        </div>

        <h3>Viewport / No-scroll QA</h3>
        <div className="pad-x row-gap">
          <label className="t s" style={{ display: "flex", gap: 6, alignItems: "center", minHeight: 44 }}>
            <input type="checkbox" checked={qaAll} onChange={(e) => setQaAll(e.target.checked)} style={{ width: "auto" }} /> + доп. viewports
          </label>
          <button className="wbtn" style={{ minHeight: 44 }} onClick={() => setGen((g) => g + 1)}>Re-run</button>
        </div>
        {qa.map((r) => (
          <div key={r.viewport} style={{ padding: "3px 14px" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span className={r.ok ? "ok" : "bad"}>{r.ok ? "✓" : "✗"}</span>
              <span className="mono">{r.page}-{r.variant} · {r.viewport}</span>
            </div>
            {r.issues.map((i, k) => (
              <div key={k} className="mono bad" style={{ paddingLeft: 18 }}>{i.component} · {i.actual} · {i.type} → {i.fix}</div>
            ))}
          </div>
        ))}

        <h3>Asset registry</h3>
        <div className="kv">
          <b>status</b><span>{reg ? (reg.errors.length ? <span className="warn">ready with errors</span> : <span className="ok">ready</span>) : "loading archives…"}</span>
          {reg && Object.entries(reg.byArchive).map(([a, es]) => (
            <span key={a} style={{ display: "contents" }}><b>{a}</b><span>{es.length} files</span></span>
          ))}
          <b>required</b><span>{REQUIRED.length - (reg?.missing.length ?? REQUIRED.length)}/{REQUIRED.length} found</span>
        </div>
        {reg?.errors.map((e) => <div key={e} className="bad mono" style={{ padding: "2px 14px" }}>{e}</div>)}
        {reg?.missing.length ? (
          <>
            <h3 className="bad">MISSING_ASSET ({reg.missing.length})</h3>
            {reg.missing.map((m) => (
              <div key={m.file} className="bad mono" style={{ padding: "1px 14px" }}>{m.expectedIn}/{m.file} — {m.reason}</div>
            ))}
          </>
        ) : null}
        {reg && (
          <>
            <h3>Skill icons c01–c40</h3>
            <div style={{ padding: "0 14px 14px", display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 4 }}>
              {Array.from({ length: 40 }, (_, i) => {
                const id = `c${String(i + 1).padStart(2, "0")}`;
                const e = reg.skillIcons[id];
                return (
                  <div key={id} title={`${id}.svg`} style={{ aspectRatio: "1", borderRadius: 6, background: e ? "#2E7F5C" : "rgba(232,112,95,.2)", padding: 3, display: "grid", placeItems: "center" }}>
                    {e?.text ? <span style={{ width: "100%", height: "100%", display: "inline-flex" }} dangerouslySetInnerHTML={{ __html: normaliseSvg(e.text) }} /> : <span className="bad" style={{ fontSize: 8 }}>{id}</span>}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </aside>

      {/* scrim for mobile drawers */}
      {drawer !== "none" && <div className="wb-scrim only-mobile" onClick={() => setDrawer("none")} />}
      {report && <Report qa={qa} onClose={() => setReport(false)} />}
    </div>
  );
}

function SlotPreview({ slot }: { slot: Slot }) {
  const reg = useAssets();
  if (!reg) return <span className="t s">loading…</span>;
  const m = slot.assetId.match(/^(c\d{2})(?:_[a-z0-9_]+)?\.svg$/);
  if (m) {
    const e = reg.skillIcons[m[1]];
    return e?.text ? (
      <span style={{ width: 80, height: 80, display: "inline-flex", background: "#2E7F5C", borderRadius: 12, padding: 8, transform: `scale(${slot.scale})` }} dangerouslySetInnerHTML={{ __html: normaliseSvg(e.text) }} />
    ) : (
      <span className="bad mono">MISSING_ASSET skill-card-icons.zip/{m[1]}_*.svg</span>
    );
  }
  if (slot.slot === "hero") {
    // assets.zip содержит только сторонние референс-каталоги — игровых артов нет.
    return (
      <span className="warn mono" style={{ textAlign: "center", padding: 12 }}>
        assets.zip = сторонние UI-каталоги; игровых hero-артов в репозитории нет
      </span>
    );
  }
  if (slot.slot === "topbar") return <span className="t s" style={{ textAlign: "center" }}>{reg.topbarHtml ? "topbar.html + 5 SVG" : "MISSING_ASSET topbar.zip/topbar.html"}</span>;
  return <span className="mono t s">{slot.assetId}</span>;
}

export type { Page, Variant };
