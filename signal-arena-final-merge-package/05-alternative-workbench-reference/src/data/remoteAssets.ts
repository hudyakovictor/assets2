import { useEffect, useState } from "react";

/* =====================================================================
   REPO ASSET LAYER
   Source of truth: https://github.com/hudyakovictor/assets/tree/main
   - topbar/topbar.html        → SHARED_TOP_BAR_LOCKED (inlined verbatim)
   - topbar/icons/*.svg        → lightning, star, coin, bell, gear
   - skill-card-icons/c01-c40  → skill card icons (fetched at runtime)
   - skill-card-icons/preview*.svg
   Missing files are NEVER invented: the UI shows MISSING_ASSET with the
   exact file name and continues with local drawn fallbacks.
   ===================================================================== */

const BASE = "https://raw.githubusercontent.com/hudyakovictor/assets/main/";

export type CardGroup = "green" | "yellow" | "blue" | "red";

export const CARD_PALETTE: Record<CardGroup, { color: string; label: string }> = {
  green: { color: "#2E7F5C", label: "Анализ рынка" },
  yellow: { color: "#D0B24A", label: "План сделки" },
  blue: { color: "#4C6180", label: "Дисциплина" },
  red: { color: "#C56861", label: "Защита капитала" },
};

const groupOf = (n: number): CardGroup =>
  n <= 15 ? "green" : n <= 24 ? "yellow" : n <= 33 ? "blue" : "red";

export interface SkillDef {
  id: string; // c01
  name: string; // market_structure
  label: string; // Market Structure
  group: CardGroup;
  file: string; // repo path
}

const NAMES: [number, string, string][] = [
  [1, "market_structure", "Market Structure"],
  [2, "higher_timeframe", "Higher Timeframe"],
  [3, "volume_confirmation", "Volume Confirmation"],
  [4, "liquidity_map", "Liquidity Map"],
  [5, "volatility_context", "Volatility Context"],
  [6, "correlation_check", "Correlation Check"],
  [7, "derivatives_pulse", "Derivatives Pulse"],
  [8, "news_context", "News Context"],
  [9, "social_sentiment", "Social Sentiment"],
  [10, "macro_context", "Macro Context"],
  [11, "onchain_flow", "Onchain Flow"],
  [12, "tokenomics_review", "Tokenomics Review"],
  [13, "unlock_calendar", "Unlock Calendar"],
  [14, "infrastructure_risk", "Infrastructure Risk"],
  [15, "source_quality", "Source Quality"],
  [16, "enter_now", "Enter Now"],
  [17, "wait_for_retest", "Wait For Retest"],
  [18, "define_entry_zone", "Define Entry Zone"],
  [19, "define_invalidation", "Define Invalidation"],
  [20, "set_structural_stop", "Set Structural Stop"],
  [21, "target_liquidity", "Target Liquidity"],
  [22, "minimum_r_multiple", "Minimum R-Multiple"],
  [23, "scale_out", "Scale Out"],
  [24, "no_trade_is_a_decision", "No Trade Is A Decision"],
  [25, "evidence_only", "Evidence Only"],
  [26, "noise_quarantine", "Noise Quarantine"],
  [27, "risk_first_mode", "Risk First Mode"],
  [28, "no_confirmation_no_trade", "No Confirmation No Trade"],
  [29, "higher_timeframe_check", "HTF Check"],
  [30, "after_a_loss", "After A Loss"],
  [31, "discipline_over_profit", "Discipline Over Profit"],
  [32, "out_of_market_is_normal", "Out Of Market Is Normal"],
  [33, "news_is_not_a_signal", "News Is Not A Signal"],
  [34, "wait_for_stabilization", "Wait For Stabilization"],
  [35, "do_not_chase", "Do Not Chase"],
  [36, "avoid_revenge_trading", "Avoid Revenge Trading"],
  [37, "no_averaging_without_a_plan", "No Averaging Without A Plan"],
  [38, "risk_cap", "Risk Cap"],
  [39, "confidence_check", "Confidence Check"],
  [40, "preserve_the_system", "Preserve The System"],
];

export const SKILLS: SkillDef[] = NAMES.map(([n, name, label]) => {
  const id = `c${String(n).padStart(2, "0")}`;
  return {
    id,
    name,
    label,
    group: groupOf(n),
    file: `skill-card-icons/${id}_${name}.svg`,
  };
});

export const TOPBAR_ICON_FILES = [
  "topbar/icons/lightning.svg",
  "topbar/icons/star.svg",
  "topbar/icons/coin.svg",
  "topbar/icons/bell.svg",
  "topbar/icons/gear.svg",
];

export const PREVIEW_FILES = [
  "skill-card-icons/preview.svg",
  "skill-card-icons/preview-24.svg",
  "skill-card-icons/preview-32.svg",
  "skill-card-icons/preview-48.svg",
  "skill-card-icons/preview-mobile.svg",
];

/* ---------------- provenance / missing report ---------------- */
export interface AssetStatus {
  file: string;
  found: boolean;
  note: string;
}

/** Files that the brief requires but the repo does NOT contain as such.
 *  Never invented — surfaced in the UI as MISSING_ASSET. */
export const ASSET_STATUS: AssetStatus[] = [
  { file: "skill-card-icons.zip", found: false, note: "В репозитории нет архива; файлы доступны как каталог skill-card-icons/ (c01–c40 + preview)" },
  { file: "topbar.zip", found: false, note: "В репозитории нет архива; файлы доступны как каталог topbar/ (topbar.html, icons/, topbar.png)" },
  { file: "topbar/topbar.html", found: true, note: "SHARED_TOP_BAR_LOCKED — использован как source of truth" },
  ...TOPBAR_ICON_FILES.map((f) => ({ file: f, found: true, note: "Вшиты верbatim в компонент TopBar" })),
  ...SKILLS.map((s) => ({ file: s.file, found: true, note: "Загружается в рантайме, fallback — отрисованная иконка" })),
  ...PREVIEW_FILES.map((f) => ({ file: f, found: true, note: "Доступен как reference" })),
];

/* ---------------- runtime svg loader with cache ---------------- */
const cache = new Map<string, string | null>();

export function loadSvg(path: string): Promise<string | null> {
  if (cache.has(path)) return Promise.resolve(cache.get(path) ?? null);
  const key = path;
  const p = fetch(`${BASE}${path}`)
    .then((r) => (r.ok ? r.text() : null))
    .then((t) => {
      const ok = t && t.includes("<svg");
      cache.set(key, ok ? t : null);
      return ok ? t : null;
    })
    .catch(() => {
      cache.set(key, null);
      return null;
    });
  return p;
}

/** Preload all 40 skill icons once on boot. */
export function preloadSkillIcons(): Promise<number> {
  return Promise.allSettled(SKILLS.map((s) => loadSvg(s.file))).then((r) => r.filter((x) => x.status === "fulfilled" && x.value).length);
}

export function useRemoteSvg(path: string): { svg: string | null; error: boolean } {
  const [svg, setSvg] = useState<string | null>(cache.get(path) ?? null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    if (!svg) {
      loadSvg(path).then((t) => {
        if (!alive) return;
        setSvg(t);
        setError(t === null);
      });
    }
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
  return { svg, error };
}

/** Inline an external SVG with a forced color (icons are monochrome currentColor).
 *  Repo SVGs have viewBox only — force 100% size so they fill their container. */
export function svgToInlineMarkup(svg: string, color?: string): string {
  let out = svg.replace(/<\?xml[^>]*>/, "");
  out = out.replace(/<svg([^>]*)>/, (_m, attrs) => {
    let a = attrs;
    a = a.replace(/ xmlns="[^"]*"/, "");
    a = a.replace(/ width="[^"]*"/, "");
    a = a.replace(/ height="[^"]*"/, "");
    a = a.replace(/ style="[^"]*"/, "");
    a += ` style="width:100%;height:100%;display:block${color ? `;color:${color}` : ""}"`;
    return `<svg${a}>`;
  });
  return out;
}
