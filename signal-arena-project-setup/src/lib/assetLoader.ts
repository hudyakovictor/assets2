import { unzipSync } from "fflate";

/**
 * Единственный разрешённый источник ассетов:
 * https://github.com/hudyakovictor/assets/tree/main
 * Архивы распаковываются в браузере; ничего не подменяется.
 */
export const REPO = "hudyakovictor/assets";
export const CDN = `https://cdn.jsdelivr.net/gh/${REPO}@main/`;
export const RAW = `https://raw.githubusercontent.com/${REPO}/main/`;

export type AssetEntry = {
  id: string; // basename, e.g. "lightning.svg"
  path: string; // path inside archive
  archive: string; // "topbar.zip"
  kind: "svg" | "html" | "image" | "css" | "other";
  bytes: number;
  url?: string; // blob url
  text?: string; // for svg/html/css
};

export type AssetRegistry = {
  status: "loading" | "ready" | "error";
  entries: Record<string, AssetEntry>; // by lowercase basename
  byArchive: Record<string, AssetEntry[]>;
  missing: MissingAsset[];
  errors: string[];
  topbarHtml?: string;
  skillIcons: Record<string, AssetEntry>; // ключ cNN -> файл cNN_<semantic>.svg
  images: AssetEntry[]; // только референс-каталоги, НЕ игровые арты
  /** assets.zip содержит сторонние UI-каталоги, а не ассеты игры */
  assetsZipIsReferenceLibrary: boolean;
  archivesExtracted: Record<string, boolean>;
};

export type MissingAsset = { file: string; expectedIn: string; reason: string };

const ARCHIVES = ["topbar.zip", "skill-card-icons.zip", "assets.zip"];

export const TOPBAR_FILES = ["topbar.html", "lightning.svg", "star.svg", "coin.svg", "bell.svg", "gear.svg"];

export const REQUIRED: { file: string; expectedIn: string }[] = [
  ...TOPBAR_FILES.map((file) => ({ file, expectedIn: "topbar.zip" })),
  // В архиве файлы называются cNN_<семантика>.svg — точный список имён
  // неизвестен до распаковки, поэтому для карт обязательны префиксы c01..c40.
  ...Array.from({ length: 40 }, (_, i) => ({
    file: `c${String(i + 1).padStart(2, "0")}_*.svg`,
    expectedIn: "skill-card-icons.zip",
  })),
];

/** Папки сторонних референс-каталогов внутри assets.zip — это НЕ игровые ассеты. */
const REFERENCE_LIBRARY_MARKERS = [
  "interactive-game-ui-asset-catalog/",
  "premium-mobile-motion-asset-catalog/",
  "signal-arena-ui-library/",
  "motion99/",
];

function kindOf(name: string): AssetEntry["kind"] {
  const n = name.toLowerCase();
  if (n.endsWith(".svg")) return "svg";
  if (n.endsWith(".html") || n.endsWith(".htm")) return "html";
  if (n.endsWith(".css")) return "css";
  if (/\.(png|jpe?g|webp|gif|avif)$/.test(n)) return "image";
  return "other";
}

const mime: Record<string, string> = {
  svg: "image/svg+xml",
  html: "text/html",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

async function fetchArchive(name: string): Promise<Uint8Array> {
  const urls = [CDN + name, RAW + name];
  let lastErr: unknown;
  for (const u of urls) {
    try {
      const r = await fetch(u, { cache: "force-cache" });
      if (!r.ok) throw new Error(`${r.status} ${u}`);
      return new Uint8Array(await r.arrayBuffer());
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export async function loadRegistry(): Promise<AssetRegistry> {
  const reg: AssetRegistry = {
    status: "loading",
    entries: {},
    byArchive: {},
    missing: [],
    errors: [],
    skillIcons: {},
    images: [],
    assetsZipIsReferenceLibrary: false,
    archivesExtracted: {},
  };
  const td = new TextDecoder();

  await Promise.all(
    ARCHIVES.map(async (archive) => {
      try {
        const buf = await fetchArchive(archive);
        const files = unzipSync(buf);
        reg.archivesExtracted[archive] = true;
        reg.byArchive[archive] = [];
        let refHits = 0;
        let refTotal = 0;
        for (const [path, data] of Object.entries(files)) {
          if (path.endsWith("/") || path.includes("__MACOSX") || /\/\._/.test(path) || /^\._/.test(path)) continue;
          const base = path.split("/").pop() || path;
          if (base === ".DS_Store") continue;
          const kind = kindOf(base);
          const ext = base.split(".").pop()!.toLowerCase();
          const entry: AssetEntry = { id: base, path, archive, kind, bytes: data.length };
          const blob = new Blob([data as BlobPart], { type: mime[ext] || "application/octet-stream" });
          entry.url = URL.createObjectURL(blob);
          if (kind === "svg" || kind === "html" || kind === "css") entry.text = td.decode(data);
          const key = base.toLowerCase();
          // topbar.zip has priority for name collisions
          if (!reg.entries[key] || archive === "topbar.zip") reg.entries[key] = entry;
          reg.byArchive[archive].push(entry);

          // assets.zip: это сторонние референс-каталоги, а не арты игры.
          const isReference = REFERENCE_LIBRARY_MARKERS.some((m) => path.includes(m));
          if (archive === "assets.zip") {
            refTotal++;
            if (isReference) refHits++;
          }
          if (kind === "image" && !isReference) reg.images.push(entry);

          // skill icons: файлы вида c01_market_structure.svg → ключ c01
          const m = key.match(/^(c\d{2})(?:_[a-z0-9_]+)?\.svg$/);
          if (m && archive === "skill-card-icons.zip") {
            // если будет дубль префикса — приоритет более короткому (канону)
            if (!reg.skillIcons[m[1]] || base.length < reg.skillIcons[m[1]].id.length) {
              reg.skillIcons[m[1]] = entry;
            }
          }
        }
        if (archive === "assets.zip" && refTotal > 0 && refHits / refTotal > 0.8) {
          reg.assetsZipIsReferenceLibrary = true;
        }
      } catch (e) {
        // Среда не распаковала архив — это ASSET_ARCHIVE_NOT_EXTRACTED, не MISSING_ASSET.
        reg.errors.push(`ASSET_ARCHIVE_NOT_EXTRACTED: ${archive} — ${(e as Error).message}`);
      }
    }),
  );

  for (const req of REQUIRED) {
    if (req.expectedIn === "skill-card-icons.zip") {
      const prefix = req.file.slice(0, 3); // cNN
      const e = reg.skillIcons[prefix];
      if (!e) {
        reg.missing.push({
          file: req.file,
          expectedIn: req.expectedIn,
          reason: reg.archivesExtracted[req.expectedIn]
            ? "cNN_*.svg not found inside extracted archive"
            : "ASSET_ARCHIVE_NOT_EXTRACTED",
        });
      }
      continue;
    }
    const e = reg.entries[req.file.toLowerCase()];
    if (!e) {
      reg.missing.push({
        file: req.file,
        expectedIn: req.expectedIn,
        reason: reg.archivesExtracted[req.expectedIn]
          ? "not found inside extracted archive"
          : "ASSET_ARCHIVE_NOT_EXTRACTED",
      });
    }
  }
  reg.topbarHtml = reg.entries["topbar.html"]?.text;
  reg.images.sort((a, b) => a.path.localeCompare(b.path));
  reg.status = "ready";
  return reg;
}

/** Inline SVG text with sizing attributes normalised; keeps original geometry & viewBox. */
export function normaliseSvg(text: string): string {
  return text
    .replace(/<\?xml[^>]*>/g, "")
    .replace(/<!DOCTYPE[^>]*>/g, "")
    .replace(/<svg([^>]*)>/, (_m, attrs: string) => {
      const cleaned = attrs.replace(/\s(width|height)="[^"]*"/g, "");
      return `<svg${cleaned} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">`;
    });
}
