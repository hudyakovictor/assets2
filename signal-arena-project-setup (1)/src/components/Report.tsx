import { PAGES, cardId } from "../data/pages";
import { REQUIRED } from "../lib/assetLoader";
import { useAssets } from "./AssetContext";
import type { QAResult } from "./QA";
import { TOPBAR_ICONS } from "./TopBar";

const th: React.CSSProperties = { textAlign: "left", padding: "4px 8px", color: "var(--ink3)", fontWeight: 400, borderBottom: "1px solid var(--line)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "3px 8px", borderBottom: "1px solid rgba(255,255,255,.04)", verticalAlign: "top" };

export function Report({ qa, onClose }: { qa: QAResult[]; onClose: () => void }) {
  const reg = useAssets();
  const usedCards = new Set<string>();
  PAGES.forEach((p) => p.variants.forEach((v) => v.slots.forEach((s) => { const m = s.assetId.match(/^(c\d{2})\.svg$/); if (m) usedCards.add(m[1]); })));
  for (let i = 1; i <= 40; i++) usedCards.add(cardId(i)); // P21 deck renders all 40
  const three = PAGES.filter((p) => p.variants.length === 3);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(3,5,10,.85)", zIndex: 50, overflow: "auto", padding: 24, fontSize: 11.5 }} onClick={onClose}>
      <div style={{ maxWidth: 1200, margin: "0 auto", background: "#0b0f1c", borderRadius: 16, padding: 20, border: "1px solid var(--line)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h2 style={{ fontSize: 18, fontWeight: 700 }}>Final Report · Signal Arena</h2><button className="wbtn" onClick={onClose}>Закрыть</button></div>

        <div className="box" style={{ margin: "12px 0", background: "rgba(240,168,77,.1)", border: "1px solid rgba(240,168,77,.35)" }}>
          <b>Source Fidelity Notice.</b> Репозиторий содержит game.html (MVP), game2.pdf, PDF-раскадровку и 3 архива. Тело экранов game.html рендерится скриптом и недоступно как текст, PDF — бинарный. Инвентарь P01–P34 собран из описания разделов game.html (Часть 1: три захода на Арену по одной механике; Часть 2: Академия, колода, полный заход, раскрытие/оценка, разбор, профиль, сервисные состояния). Тексты помечены как inferred — подтвердите или пришлите оригинальные подписи страниц. <b>Page Count Mismatch:</b> число страниц в исходнике не верифицировано машинно.
        </div>

        <h3>1 · Page Inventory</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr>{["Page ID", "Название", "Раздел", "Состояние", "Источник", "Варианты"].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>{PAGES.map((p) => <tr key={p.id}><td style={{ ...td, color: "var(--acc)", fontWeight: 700 }}>{p.id}</td><td style={td}>{p.title}</td><td style={td}>{p.section}</td><td style={td}>{p.state}</td><td style={td}>{p.source}</td><td style={td}>{p.variants.map((v) => `${p.id}-${v.id}`).join(" ")}</td></tr>)}</tbody></table>

        <h3 style={{ marginTop: 18 }}>2 · Asset Matrix</h3>
        <div style={{ maxHeight: 360, overflow: "auto", border: "1px solid var(--line)", borderRadius: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr>{["Page ID", "Variant ID", "Asset slot", "Asset ID", "Source", "Placement", "Purpose", "Fallback"].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>{PAGES.flatMap((p) => p.variants.flatMap((v) => v.slots.map((s) => <tr key={`${p.id}${v.id}${s.slot}`}><td style={td}>{p.id}</td><td style={td}>{v.id}</td><td style={td}>{s.slot}</td><td style={{ ...td, fontFamily: "monospace" }}>{s.assetId}</td><td style={td}>{s.source}</td><td style={td}>{s.placement}</td><td style={td}>{s.purpose}</td><td style={td}>{s.fallback}</td></tr>)))}</tbody></table>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
          <div>
            <h3>3–4 · P01–P34 и варианты</h3>
            <div className="mono" style={{ lineHeight: 1.7 }}>{PAGES.map((p) => <div key={p.id}>{p.variants.map((v) => `${p.id}-${v.id}`).join("  ")}</div>)}</div>
          </div>
          <div>
            <h3>5 · Skill-card SVG</h3>
            <div className="mono">{Array.from(usedCards).sort().map((c) => <span key={c} className={reg?.skillIcons[c] ? "ok" : "bad"} style={{ marginRight: 6 }}>{c}.svg</span>)}</div>
            <h3>6 · Top Bar assets</h3>
            <div className="mono">{["topbar.html", ...TOPBAR_ICONS].map((f) => <div key={f} className={reg?.entries[f] ? "ok" : "bad"}>{reg?.entries[f] ? "PASS" : "FAIL (MISSING)"} topbar.zip/{f}</div>)}</div>
            <h3>9 · MISSING_ASSET</h3>
            <div className="mono">{reg ? (reg.missing.length ? reg.missing.map((m) => <div key={m.file} className="bad">{m.expectedIn}/{m.file} — {m.reason}</div>) : <span className="ok">нет · {REQUIRED.length}/{REQUIRED.length} обязательных файлов найдены</span>) : "loading…"}{reg?.errors.map((e) => <div key={e} className="bad">{e}</div>)}</div>
            <h3>10 · Страницы с 3 вариантами</h3>
            <div className="mono">{three.map((p) => <div key={p.id}>{p.id} — {p.variantNote}</div>)}</div>
          </div>
        </div>

        <h3 style={{ marginTop: 18 }}>7–8 · Viewport / No-scroll QA (текущая страница)</h3>
        <div className="mono">{qa.length ? qa.map((r) => <div key={r.viewport} className={r.ok ? "ok" : "bad"}>{r.page}-{r.variant} · {r.viewport} · {r.ok ? "PASS" : r.issues.map((i) => `${i.component}: ${i.actual} (${i.type}) → ${i.fix}`).join("; ")}</div>) : "QA не запускался"}</div>
        <div className="t s" style={{ marginTop: 8 }}>Проверки: scrollHeight ≤ clientHeight, scrollWidth ≤ clientWidth, CTA / Top Bar / bottom nav не обрезаны, карточки в границах, отсутствие перекрытий детей gs-body, текст ≥ 10.5px, touch target ≥ 44px. Панели стенда имеют собственный scroll; игровой экран — нет.</div>

        <h3 style={{ marginTop: 18 }}>11 · Экспорт игрового экрана</h3>
        <div className="t s">Кнопка «Export ↗» в центре открывает <span className="mono">#export=PXX-Y&amp;vp=WxH</span> — только экран Signal Arena, без панелей, без корпуса телефона, без debug-подписей.</div>
      </div>
    </div>
  );
}
