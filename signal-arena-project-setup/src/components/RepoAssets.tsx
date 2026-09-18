import { useAssets } from "./AssetContext";
import { normaliseSvg } from "../lib/assetLoader";

/* ------------------------------------------------------------------ *
 * REPO ASSET BINDINGS
 * Единственный источник истины — архивы из репозитория.
 * Если файл недоступен (нет сети), рисуется собственный SVG-фоллбэк,
 * который помечен как FALLBACK, а не подменяет ассет молча.
 * ------------------------------------------------------------------ */

export type TopbarIconFile = "lightning.svg" | "star.svg" | "coin.svg" | "bell.svg" | "gear.svg";

/** Собственные отрисованные фоллбэки (не emoji, не сторонние библиотеки). */
function FallbackGlyph({ file, className = "" }: { file: string; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const body: Record<string, React.ReactNode> = {
    "lightning.svg": <path d="M13.2 2.6L6.6 13.4h4.3l-1.3 8 6.9-10.9h-4.3l1-7.9z" {...common} />,
    "star.svg": <path d="M12 3.4l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.7l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.4z" {...common} />,
    "coin.svg": (
      <g {...common}>
        <circle cx="12" cy="12" r="8.6" />
        <path d="M12 7.4v9.2M14.6 9.3c-.5-.8-1.5-1.3-2.6-1.3-1.6 0-2.9.9-2.9 2s1.2 1.7 2.9 2 2.9.9 2.9 2-1.3 2-2.9 2c-1.1 0-2.1-.5-2.6-1.3" strokeWidth={1.6} />
      </g>
    ),
    "bell.svg": (
      <g {...common}>
        <path d="M6.4 16.2c1.1-1 1.7-2.4 1.7-3.9V10a3.9 3.9 0 017.8 0v2.3c0 1.5.6 2.9 1.7 3.9H6.4z" />
        <path d="M10.3 19a1.9 1.9 0 003.4 0" />
      </g>
    ),
    "gear.svg": (
      <g {...common}>
        <circle cx="12" cy="12" r="3.1" />
        <path d="M12 3.2v2.4M12 18.4v2.4M20.8 12h-2.4M5.6 12H3.2M18.2 5.8l-1.7 1.7M7.5 16.5l-1.7 1.7M7.5 7.5L5.8 5.8M18.2 18.2l-1.7-1.7" />
      </g>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {body[file]}
    </svg>
  );
}

/** Иконка Top Bar из topbar.zip. Цвет наследуется через currentColor. */
export function RepoIcon({
  file,
  className = "w-4 h-4",
  title,
}: {
  file: TopbarIconFile;
  className?: string;
  title?: string;
}) {
  const reg = useAssets();
  const entry = reg?.entries[file];

  if (entry?.text) {
    return (
      <span
        className={`inline-flex ${className}`}
        style={{ color: "inherit" }}
        title={title ?? `topbar.zip/${file}`}
        dangerouslySetInnerHTML={{ __html: normaliseSvg(entry.text) }}
      />
    );
  }
  // FALLBACK — собственная отрисовка, НЕ подмена ассета
  return (
    <span title={`FALLBACK · topbar.zip/${file}`} className={`inline-flex ${className}`}>
      <FallbackGlyph file={file} className={className} />
    </span>
  );
}

/* --------------------- skill cards c01–c40 --------------------- */

/** Заблокированная палитра групп (ТЗ, менять запрещено). */
export const CARD_PALETTE = {
  green: "#2E7F5C",
  yellow: "#D0B24A",
  blue: "#4C6180",
  red: "#C56861",
} as const;

export type CardGroup = keyof typeof CARD_PALETTE;

export function groupOf(n: number): CardGroup {
  if (n <= 15) return "green";
  if (n <= 24) return "yellow";
  if (n <= 33) return "blue";
  return "red";
}

export function cardGroupOf(id: string): CardGroup {
  const n = parseInt(id.replace(/\D/g, ""), 10);
  return groupOf(Number.isFinite(n) ? n : 1);
}

/** Иконка карты навыка из skill-card-icons.zip. Иконка всегда белая, фон — цвет группы. */
export function RepoSkillIcon({
  id,
  size = 44,
  className = "",
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  const reg = useAssets();
  const entry = reg?.skillIcons[id];
  const group = cardGroupOf(id);
  const bg = CARD_PALETTE[group];

  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(158deg, ${bg}, ${bg}c4)`,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.30), inset 0 -2px 4px rgba(0,0,0,.22), 0 6px 14px -8px rgba(0,0,0,.85)",
        border: "1px solid rgba(255,255,255,.16)",
      }}
      title={`skill-card-icons.zip/${id}.svg · группа ${group} · ${bg}`}
    >
      {entry?.text ? (
        <span
          style={{ width: size * 0.66, height: size * 0.66, color: "#fff", display: "inline-flex" }}
          dangerouslySetInnerHTML={{ __html: normaliseSvg(entry.text) }}
        />
      ) : (
        /* FALLBACK: гибридный filled-outline силуэт в белом, teal negative space */
        <svg viewBox="0 0 40 40" width={size * 0.66} height={size * 0.66} aria-hidden>
          <circle cx="20" cy="20" r="14" fill="none" stroke="#fff" strokeWidth="2.1" />
          <path d="M13 26.5l5.4-8.4 3.7 3.4 4.9-7" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="20" r="3.1" fill="#fff" />
        </svg>
      )}
    </span>
  );
}
