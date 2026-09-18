import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MissingSlot, useAssets } from "./AssetContext";
import { normaliseSvg } from "../lib/assetLoader";
import type { TopBarState } from "../data/pages";

/**
 * SHARED_TOP_BAR_LOCKED
 * Visual source of truth: topbar.html из topbar.zip (рендерится в Shadow DOM со своими стилями).
 * Иконки: lightning.svg, star.svg, coin.svg, bell.svg, gear.svg — только из topbar.zip.
 * Меняются только динамические значения: LVL / XP / attempts / stars / coins / badge / disabled.
 */
export const TOPBAR_ICONS = ["lightning.svg", "star.svg", "coin.svg", "bell.svg", "gear.svg"] as const;

export type TopBarMode = "topbar.html" | "mvp-geometry";

export function TopBar({ state, mode = "topbar.html" }: { state: TopBarState; mode?: TopBarMode }) {
  const reg = useAssets();
  const canShadow = !!reg?.topbarHtml && mode === "topbar.html";
  if (!reg) return <div style={{ height: 52, background: "var(--bg2)", borderBottom: "1px solid var(--line)" }} />;
  return canShadow ? <ShadowTopBar html={reg.topbarHtml!} state={state} /> : <MvpTopBar state={state} />;
}

/* ---------- topbar.html in Shadow DOM ---------- */
function ShadowTopBar({ html, state }: { html: string; state: TopBarState }) {
  const host = useRef<HTMLDivElement>(null);
  const reg = useAssets()!;
  const [scale, setScale] = useState(1);
  const [natural, setNatural] = useState({ w: 0, h: 52 });

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const root = el.shadowRoot ?? el.attachShadow({ mode: "open" });
    const doc = new DOMParser().parseFromString(html, "text/html");

    // rewrite asset refs (img src / css url()) to blob urls from the archive
    const toBlob = (ref: string) => {
      const base = ref.split(/[?#]/)[0].split("/").pop()?.toLowerCase() || "";
      return reg.entries[base]?.url || null;
    };
    doc.querySelectorAll("img, image, use").forEach((n) => {
      const attr = n.hasAttribute("src") ? "src" : n.hasAttribute("href") ? "href" : "xlink:href";
      const v = n.getAttribute(attr);
      if (!v || v.startsWith("data:")) return;
      const b = toBlob(v);
      if (b) n.setAttribute(attr, b);
      else n.setAttribute("data-missing", v);
    });
    let css = Array.from(doc.querySelectorAll("style")).map((s) => s.textContent || "").join("\n");
    css = css.replace(/url\((['"]?)([^'")]+)\1\)/g, (m, q, ref) => {
      const b = toBlob(ref);
      return b ? `url(${q}${b}${q})` : m;
    });
    // neutralise page-level chrome from the demo document
    css += `\n:host{display:block;width:100%;} body,html{margin:0!important;padding:0!important;background:transparent!important;min-height:0!important;height:auto!important;display:block!important;} .tb-wrap{width:max-content;min-width:100%;transform-origin:0 0;}`;

    // choose the bar element: first descendant with role/class hinting at a top bar, else body
    const bar =
      doc.querySelector<HTMLElement>('[class*="topbar" i], [id*="topbar" i], [class*="top-bar" i], header, [class*="hud" i], [class*="tb" i]') ?? doc.body;

    // dynamic value substitution (demo numbers are not game data)
    const dyn = [state.attempts, state.stars, state.coins];
    const dynMax = state.attemptsMax;
    const walker = doc.createTreeWalker(bar, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    let k = 0;
    for (const n of nodes) {
      const raw = n.nodeValue || "";
      const s = raw.trim();
      if (!s) continue;
      if (/^lvl\s*\d+$/i.test(s)) n.nodeValue = raw.replace(/\d+/, String(state.lvl));
      else if (/^\d+\s*\/\s*\d+$/.test(s)) {
        n.nodeValue = k === 0 ? `${state.attempts}/${dynMax}` : `${state.xp}/${state.xpMax}`;
        k++;
      } else if (/^\d[\d\s.,]*[kKмM]?$/.test(s) && k < 3) {
        n.nodeValue = raw.replace(s, String(dyn[k]));
        k++;
      } else if (/^xp$/i.test(s)) {
        /* keep label */
      }
    }
    // badge: any small element with numeric text after icons
    bar.querySelectorAll<HTMLElement>('[class*="badge" i], [class*="dot" i], [class*="notif" i]').forEach((b) => {
      if (state.badge <= 0) b.style.display = "none";
      else if (/^\d+$/.test((b.textContent || "").trim())) b.textContent = String(state.badge);
    });
    if (state.disabled) bar.style.filter = "saturate(.35) opacity(.75)";

    root.innerHTML = `<style>${css}</style><div class="tb-wrap">${bar.outerHTML}</div>`;
    const wrap = root.querySelector<HTMLElement>(".tb-wrap")!;
    requestAnimationFrame(() => setNatural({ w: wrap.scrollWidth, h: wrap.offsetHeight || 52 }));
  }, [html, state, reg]);

  useLayoutEffect(() => {
    const el = host.current;
    if (!el || !natural.w) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setScale(natural.w > w ? w / natural.w : 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [natural.w]);

  useEffect(() => {
    const wrap = host.current?.shadowRoot?.querySelector<HTMLElement>(".tb-wrap");
    if (wrap) wrap.style.transform = `scale(${scale})`;
  }, [scale, natural]);

  return <div ref={host} style={{ flex: "0 0 auto", height: Math.round(natural.h * scale) || 52, overflow: "hidden" }} />;
}

/* ---------- MVP geometry (.tb / .pill from game.html) with real SVGs ---------- */
export function MvpTopBar({ state }: { state: TopBarState }) {
  const reg = useAssets()!;
  const Icon = ({ f, size = 13 }: { f: string; size?: number }) => {
    const e = reg.entries[f];
    if (!e?.text) return <MissingSlot file={`topbar.zip/${f}`} size={size} />;
    return <span style={{ width: size, height: size, display: "inline-flex", flex: "0 0 auto" }} dangerouslySetInnerHTML={{ __html: normaliseSvg(e.text) }} />;
  };
  const pill: React.CSSProperties = { display: "flex", alignItems: "center", gap: 4, background: "#222b4d", borderRadius: 20, padding: "4px 8px", fontSize: 11.5, fontWeight: 700, color: "#e8ecfb", minHeight: 24 };
  return (
    <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 6, padding: "12px 12px 10px", background: "var(--bg2)", borderBottom: "1px solid var(--line)", filter: state.disabled ? "saturate(.35) opacity(.75)" : undefined }}>
      <div style={{ ...pill, background: "linear-gradient(135deg,#2a3563,#1b2340)", gap: 6 }}>
        <span style={{ color: "var(--acc)" }}>LVL {state.lvl}</span>
        <span style={{ width: 34, height: 4, borderRadius: 4, background: "#0e1220", overflow: "hidden" }}>
          <i style={{ display: "block", height: "100%", width: `${Math.round((state.xp / state.xpMax) * 100)}%`, background: "var(--acc)" }} />
        </span>
      </div>
      <div style={{ ...pill, color: state.attempts === 0 ? "var(--bad)" : undefined }}><Icon f="lightning.svg" /> <span className="count">{state.attempts}/{state.attemptsMax}</span></div>
      <div style={pill}><Icon f="star.svg" /> <span className="count">{state.stars}</span></div>
      <div style={pill}><Icon f="coin.svg" /> <span className="count">{state.coins}</span></div>
      <div style={{ flex: 1 }} />
      <div style={{ position: "relative", padding: 3, opacity: 0.85, minWidth: 24, display: "flex" }}>
        <Icon f="bell.svg" size={16} />
        {state.badge > 0 && <span style={{ position: "absolute", top: 0, right: -1, width: 7, height: 7, borderRadius: "50%", background: "#ff5c5c" }} />}
      </div>
      <div style={{ padding: 3, opacity: 0.85, display: "flex" }}><Icon f="gear.svg" size={16} /></div>
    </div>
  );
}
