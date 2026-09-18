import JSZip from "jszip";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const REPO = "hudyakovictor/assets";
const REF = "main";
const raw = (name: string) =>
  `https://cdn.jsdelivr.net/gh/${REPO}@${REF}/${encodeURIComponent(name)}`;

export type RepoAssets = {
  status: "loading" | "ready" | "error";
  cards: Record<number, string>;
  topbarHtml: string | null;
  topbarUrls: Record<string, string>;
  topbarFiles: string[];
  missing: string[];
  error?: string;
};

const EMPTY: RepoAssets = {
  status: "loading",
  cards: {},
  topbarHtml: null,
  topbarUrls: {},
  topbarFiles: [],
  missing: [],
};

const Ctx = createContext<RepoAssets>(EMPTY);
const base = (path: string) => path.split("/").pop() ?? path;

async function getZip(name: string) {
  const sources = [
    raw(name),
    `https://raw.githubusercontent.com/${REPO}/${REF}/${encodeURIComponent(name)}`,
  ];
  let last: unknown;
  for (const url of sources) {
    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return JSZip.loadAsync(await res.arrayBuffer());
    } catch (err) {
      last = err;
    }
  }
  throw last;
}

function cleanSvg(source: string) {
  return source
    .replace(/<\?xml[^>]*\?>/gi, "")
    .replace(/<!doctype[^>]*>/gi, "")
    .trim();
}

async function loadAssets(): Promise<RepoAssets> {
  const result: RepoAssets = {
    ...EMPTY,
    status: "ready",
    cards: {},
    topbarUrls: {},
    topbarFiles: [],
    missing: [],
  };

  try {
    const cardsZip = await getZip("skill-card-icons.zip");
    const jobs: Promise<void>[] = [];
    cardsZip.forEach((path, entry) => {
      const match = /(?:^|\/)c(\d{1,2})\.svg$/i.exec(path);
      if (!entry.dir && match) {
        jobs.push(
          entry.async("string").then((svg) => {
            result.cards[Number(match[1])] = cleanSvg(svg);
          }),
        );
      }
    });
    await Promise.all(jobs);
    for (let i = 1; i <= 40; i++) {
      if (!result.cards[i]) result.missing.push(`c${String(i).padStart(2, "0")}.svg`);
    }
  } catch (err) {
    result.missing.push("ASSET_ARCHIVE_NOT_EXTRACTED: skill-card-icons.zip");
    result.error = String(err);
  }

  try {
    const topZip = await getZip("topbar.zip");
    const paths: Record<string, string> = {};
    topZip.forEach((path, entry) => {
      if (!entry.dir) {
        const file = base(path).toLowerCase();
        result.topbarFiles.push(base(path));
        paths[file] = path;
      }
    });

    const required = [
      "topbar.html",
      "lightning.svg",
      "star.svg",
      "coin.svg",
      "bell.svg",
      "gear.svg",
    ];
    for (const file of required) {
      if (!paths[file]) result.missing.push(`topbar.zip → ${file}`);
    }

    if (paths["topbar.html"])
      result.topbarHtml = await topZip.file(paths["topbar.html"])!.async("string");

    for (const name of ["lightning", "star", "coin", "bell", "gear"]) {
      const path = paths[`${name}.svg`];
      if (!path) continue;
      const svg = cleanSvg(await topZip.file(path)!.async("string"));
      result.topbarUrls[name] = URL.createObjectURL(
        new Blob([svg], { type: "image/svg+xml" }),
      );
    }
  } catch (err) {
    result.missing.push("ASSET_ARCHIVE_NOT_EXTRACTED: topbar.zip");
    result.error = String(err);
  }

  if (
    result.missing.some((item) => item.includes("skill-card-icons.zip")) &&
    result.missing.some((item) => item.includes("topbar.zip"))
  )
    result.status = "error";
  return result;
}

export function RepoAssetsProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState(EMPTY);
  useEffect(() => {
    let alive = true;
    loadAssets().then((next) => alive && setValue(next));
    return () => {
      alive = false;
    };
  }, []);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRepoAssets() {
  return useContext(Ctx);
}

export function SkillAsset({
  id,
  className = "",
}: {
  id: number;
  className?: string;
}) {
  const { cards } = useRepoAssets();
  const svg = cards[id];
  if (!svg)
    return (
      <span className={`grid place-items-center rounded-full border border-dashed border-[#C56861] font-mono text-[8px] text-[#FF9C94] ${className}`}>
        c{String(id).padStart(2, "0")}
      </span>
    );
  return (
    <span
      className={`block text-white [&_svg]:block [&_svg]:h-full [&_svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export const SKILL_COLORS = {
  green: "#2E7F5C",
  yellow: "#D0B24A",
  blue: "#4C6180",
  red: "#C56861",
} as const;

export function skillGroup(id: number): keyof typeof SKILL_COLORS {
  if (id <= 15) return "green";
  if (id <= 24) return "yellow";
  if (id <= 33) return "blue";
  return "red";
}