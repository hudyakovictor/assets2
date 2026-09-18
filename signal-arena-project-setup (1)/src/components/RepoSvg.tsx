import { normaliseSvg } from "../lib/assetLoader";
import { MissingSlot, useAssets } from "./AssetContext";

/** Renders an SVG from the GitHub archives only. No invented replacements. */
export function RepoSvg({ name, className = "w-5 h-5", title }: { name: string; className?: string; title?: string }) {
  const reg = useAssets();
  const e = reg?.entries[name.toLowerCase()];
  if (!e?.text) return <MissingSlot file={name} size={18} />;
  return (
    <span
      title={title ?? `${e.archive}/${e.path}`}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      dangerouslySetInnerHTML={{ __html: normaliseSvg(e.text) }}
    />
  );
}

export function SkillIcon({ id, className = "w-7 h-7" }: { id: string; className?: string }) {
  const reg = useAssets();
  const e = reg?.skillIcons[id];
  if (!e?.text) return <MissingSlot file={`skill-card-icons.zip/${id}.svg`} size={16} />;
  return (
    <span className={`inline-flex items-center justify-center ${className}`} dangerouslySetInnerHTML={{ __html: normaliseSvg(e.text) }} />
  );
}
