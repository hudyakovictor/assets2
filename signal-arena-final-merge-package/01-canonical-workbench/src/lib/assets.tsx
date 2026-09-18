import JSZip from "jszip";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ *
 * ASSET SOURCE OF TRUTH — github.com/hudyakovictor/assets (branch: main)
 * Только эти файлы. Никаких внешних/случайных ассетов.
 * ------------------------------------------------------------------ */
export const REPO = "hudyakovictor/assets";
export const REPO_REF = "main";
export const REPO_URL = `https://github.com/${REPO}/tree/${REPO_REF}`;

export const REQUIRED_ZIPS = {
  skillCards: "skill-card-icons.zip",
  topbar: "topbar.zip",
} as const;

export const REQUIRED_TOPBAR_FILES = [
  "topbar.html",
  "lightning.svg",
  "star.svg",
  "coin.svg",
  "bell.svg",
  "gear.svg",
] as const;

export const REQUIRED_ICON_IDS = Array.from({ length: 40 }, (_, i) => i + 1);

/** Актуальные имена из skill-card-icons/ (после распаковки zip в репозитории) */
export const SKILL_FILES: [number, string][] = [
  [1, "c01_market_structure.svg"],
  [2, "c02_higher_timeframe.svg"],
  [3, "c03_volume_confirmation.svg"],
  [4, "c04_liquidity_map.svg"],
  [5, "c05_volatility_context.svg"],
  [6, "c06_correlation_check.svg"],
  [7, "c07_derivatives_pulse.svg"],
  [8, "c08_news_context.svg"],
  [9, "c09_social_sentiment.svg"],
  [10, "c10_macro_context.svg"],
  [11, "c11_onchain_flow.svg"],
  [12, "c12_tokenomics_review.svg"],
  [13, "c13_unlock_calendar.svg"],
  [14, "c14_infrastructure_risk.svg"],
  [15, "c15_source_quality.svg"],
  [16, "c16_enter_now.svg"],
  [17, "c17_wait_for_retest.svg"],
  [18, "c18_define_entry_zone.svg"],
  [19, "c19_define_invalidation.svg"],
  [20, "c20_set_structural_stop.svg"],
  [21, "c21_target_liquidity.svg"],
  [22, "c22_minimum_r_multiple.svg"],
  [23, "c23_scale_out.svg"],
  [24, "c24_no_trade_is_a_decision.svg"],
  [25, "c25_evidence_only.svg"],
  [26, "c26_noise_quarantine.svg"],
  [27, "c27_risk_first_mode.svg"],
  [28, "c28_no_confirmation_no_trade.svg"],
  [29, "c29_higher_timeframe_check.svg"],
  [30, "c30_after_a_loss.svg"],
  [31, "c31_discipline_over_profit.svg"],
  [32, "c32_out_of_market_is_normal.svg"],
  [33, "c33_news_is_not_a_signal.svg"],
  [34, "c34_wait_for_stabilization.svg"],
  [35, "c35_do_not_chase.svg"],
  [36, "c36_avoid_revenge_trading.svg"],
  [37, "c37_no_averaging_without_a_plan.svg"],
  [38, "c38_risk_cap.svg"],
  [39, "c39_confidence_check.svg"],
  [40, "c40_preserve_the_system.svg"],
];

const MIRRORS: ((p: string) => string)[] = [
  (p) =>
    `https://cdn.jsdelivr.net/gh/${REPO}@${REPO_REF}/${p
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`,
  (p) =>
    `https://raw.githubusercontent.com/${REPO}/${REPO_REF}/${p
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`,
];

export const BLOB_SHA: Record<string, string> = {
  "skill-card-icons.zip": "453d0613b11589be6acbb563d4b0e127f84f037f",
  "topbar.zip": "3cbb63145930d41af67d42f63b946fb0703bf079",
};

async function viaApi(name: string): Promise<ArrayBuffer> {
  const sha = BLOB_SHA[name];
  if (!sha) throw new Error("no blob sha");
  const res = await fetch(`https://api.github.com/repos/${REPO}/git/blobs/${sha}`);
  if (!res.ok) throw new Error(`api ${res.status}`);
  const j = (await res.json()) as { content: string; encoding: string };
  if (j.encoding !== "base64") throw new Error("unexpected encoding");
  const bin = atob(j.content.replace(/\n/g, ""));
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

async function fetchBuf(path: string): Promise<ArrayBuffer> {
  let lastErr: unknown = null;
  for (const m of MIRRORS) {
    try {
      const res = await fetch(m(path), { cache: "force-cache" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 8) throw new Error("empty");
      return buf;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error(path);
}

async function fetchText(path: string): Promise<string> {
  const buf = await fetchBuf(path);
  return new TextDecoder("utf-8").decode(buf);
}

const base = (p: string) => p.split("/").pop() ?? p;

function prepSvg(raw: string): string {
  let s = raw
    .replace(/<\?xml[^>]*\?>/gi, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .trim();
  if (!/\bfill\s*=/i.test(s)) s = s.replace(/<svg/i, '<svg fill="#FFFFFF"');
  return s;
}

export type AssetBundle = {
  status: "loading" | "ok" | "missing" | "error";
  cards: Record<number, string>;
  iconFiles: string[];
  topbarHtml: string | null;
  topbarIconMap: Map<string, string>;
  topbarSvgs: Record<string, string>;
  topbarFiles: string[];
  extraFiles: string[];
  missing: string[];
  /** "folder" — взято из папки репозитория; "zip" — распакован архив;
   *  "not-extracted" — среда не смогла распаковать архив (ASSET_ARCHIVE_NOT_EXTRACTED);
   *  "none" — нет ничего */
  cardsSource: "folder" | "zip" | "not-extracted" | "none";
  topbarSource: "folder" | "zip" | "port" | "none";
  error?: string;
};

function emptyBundle(): AssetBundle {
  return {
    status: "ok",
    cards: {},
    iconFiles: [],
    topbarHtml: null,
    topbarIconMap: new Map(),
    topbarSvgs: {},
    topbarFiles: [],
    extraFiles: [],
    missing: [],
    cardsSource: "none",
    topbarSource: "none",
  };
}

async function loadCardsFromFolder(out: AssetBundle) {
  const loaded = await Promise.all(
    SKILL_FILES.map(async ([id, file]) => {
      try {
        const svg = prepSvg(await fetchText(`skill-card-icons/${file}`));
        return { id, file, svg };
      } catch {
        return null;
      }
    }),
  );
  for (const item of loaded) {
    if (!item) continue;
    out.cards[item.id] = item.svg;
    out.iconFiles.push(item.file);
  }
}

async function loadCardsFromZip(out: AssetBundle) {
  const zip = await JSZip.loadAsync(
    await fetchBuf(REQUIRED_ZIPS.skillCards).catch(() => viaApi(REQUIRED_ZIPS.skillCards)),
  );
  const names: string[] = [];
  zip.forEach((path, f) => {
    if (!f.dir && /\.svg$/i.test(path)) names.push(path);
  });
  out.iconFiles = [...new Set([...out.iconFiles, ...names.map(base)])].sort();
  await Promise.all(
    names.map(async (path) => {
      const m = /(?:^|\/)c(\d{1,2})(?:[._-]|\.svg$)/i.exec(base(path));
      if (!m) return;
      const id = Number(m[1]);
      if (id < 1 || id > 40 || out.cards[id]) return;
      out.cards[id] = prepSvg(await zip.file(path)!.async("string"));
    }),
  );
}

async function loadTopbarFromFolder(out: AssetBundle) {
  const html = await fetchText("topbar/topbar.html");
  out.topbarHtml = html;
  out.topbarFiles.push("topbar.html");
  for (const icon of ["lightning", "star", "coin", "bell", "gear"] as const) {
    try {
      const svg = prepSvg(await fetchText(`topbar/icons/${icon}.svg`));
      out.topbarSvgs[icon] = svg;
      out.topbarFiles.push(`${icon}.svg`);
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      out.topbarIconMap.set(url, icon);
      out.topbarHtml = out.topbarHtml
        .split(`"${icon}.svg"`)
        .join(`"${url}"`)
        .split(`'${icon}.svg'`)
        .join(`'${url}'`);
    } catch {
      /* topbar.html already has inline SVG — file is optional */
    }
  }
}

async function loadTopbarFromZip(out: AssetBundle) {
  const zip = await JSZip.loadAsync(
    await fetchBuf(REQUIRED_ZIPS.topbar).catch(() => viaApi(REQUIRED_ZIPS.topbar)),
  );
  const names: string[] = [];
  zip.forEach((path, f) => {
    if (!f.dir) names.push(path);
  });
  out.topbarFiles = [...new Set([...out.topbarFiles, ...names.map(base)])].sort();
  const wanted = new Map<string, string>();
  for (const p of names) {
    const b = base(p).toLowerCase();
    if (b === "topbar.html") wanted.set(b, p);
    for (const icon of ["lightning", "star", "coin", "bell", "gear"])
      if (b === `${icon}.svg`) wanted.set(b, p);
  }
  const hp = wanted.get("topbar.html");
  if (hp && !out.topbarHtml) out.topbarHtml = await zip.file(hp)!.async("string");
  if (!out.topbarHtml) return;
  for (const icon of ["lightning", "star", "coin", "bell", "gear"]) {
    if (out.topbarSvgs[icon]) continue;
    const p = wanted.get(`${icon}.svg`);
    if (!p) continue;
    const ready = prepSvg(await zip.file(p)!.async("string"));
    out.topbarSvgs[icon] = ready;
    const url = URL.createObjectURL(new Blob([ready], { type: "image/svg+xml" }));
    out.topbarIconMap.set(url, icon);
    out.topbarHtml = out.topbarHtml
      .split(`"${icon}.svg"`)
      .join(`"${url}"`)
      .split(`'${icon}.svg'`)
      .join(`'${url}'`);
  }
}

async function load(): Promise<AssetBundle> {
  const out = emptyBundle();

  /* ---------- skill cards ---------- */
  let folderCards = 0;
  try {
    await loadCardsFromFolder(out);
    folderCards = Object.keys(out.cards).length;
    if (folderCards > 0) out.cardsSource = "folder";
  } catch {
    /* folder may be absent */
  }

  if (Object.keys(out.cards).length < 40) {
    try {
      await loadCardsFromZip(out);
      out.cardsSource = folderCards > 0 ? "folder" : "zip";
    } catch (e) {
      if (!Object.keys(out.cards).length) {
        // архив не найден/не распакован — это НЕ 40 отдельных MISSING_ASSET
        out.cardsSource = "not-extracted";
        out.missing.push(`ASSET_ARCHIVE_NOT_EXTRACTED: ${REQUIRED_ZIPS.skillCards}`);
        out.error = String((e as Error)?.message ?? e);
      }
    }
  }
  // перечисляем отдельные файлы только если источник частично доступен
  if (out.cardsSource !== "not-extracted") {
    for (const id of REQUIRED_ICON_IDS)
      if (!out.cards[id]) out.missing.push(`MISSING_ASSET: c${String(id).padStart(2, "0")}.svg`);
  }

  /* ---------- top bar ---------- */
  try {
    await loadTopbarFromFolder(out);
    if (out.topbarHtml) out.topbarSource = "folder";
  } catch {
    /* folder may be absent */
  }
  if (!out.topbarHtml) {
    try {
      await loadTopbarFromZip(out);
      if (out.topbarHtml) out.topbarSource = "zip";
    } catch (e) {
      out.missing.push(`ASSET_ARCHIVE_NOT_EXTRACTED: ${REQUIRED_ZIPS.topbar}`);
      out.error = String((e as Error)?.message ?? e);
    }
  }
  /* У нас всегда есть точный locked React-порт геометрии topbar.html —
     недоступность архива не оставляет экран пустым. */
  if (!out.topbarHtml) {
    out.topbarSource = "port";
    out.extraFiles.push("topbar.html → SHARED_TOP_BAR_LOCKED React port");
  }

  if (out.missing.length) out.status = "missing";
  return out;
}

const Ctx = createContext<AssetBundle | null>(null);

export function AssetsProvider({ children }: { children: ReactNode }) {
  const [bundle, setBundle] = useState<AssetBundle>({
    ...emptyBundle(),
    status: "loading",
  });
  useEffect(() => {
    let alive = true;
    load().then((b) => {
      if (!alive) return;
      setBundle(b);
    });
    return () => {
      alive = false;
    };
  }, []);
  return <Ctx.Provider value={bundle}>{children}</Ctx.Provider>;
}

export function useAssets() {
  return useContext(Ctx)!;
}

export const CARD_COLORS = {
  green: "#2E7F5C",
  yellow: "#D0B24A",
  blue: "#4C6180",
  red: "#C56861",
} as const;

export type CardGroup = keyof typeof CARD_COLORS;

export function groupOf(id: number): CardGroup {
  if (id <= 15) return "green";
  if (id <= 24) return "yellow";
  if (id <= 33) return "blue";
  return "red";
}

export const GROUP_LABEL: Record<CardGroup, string> = {
  green: "Защита / риск",
  yellow: "Контекст / режим",
  blue: "Структура / уровни",
  red: "Ошибка / анти-паттерн",
};

export function cardColor(id: number): string {
  return CARD_COLORS[groupOf(id)];
}
