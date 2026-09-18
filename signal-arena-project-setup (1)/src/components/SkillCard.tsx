import { CARD_COLORS, CARD_NAMES, cardGroup } from "../data/pages";
import { normaliseSvg } from "../lib/assetLoader";
import { useAssets } from "./AssetContext";

export function SkillCard({ n, scale = 1, state, style, mini }: { n: number; scale?: number; state?: "new" | "lock"; style?: React.CSSProperties; mini?: boolean }) {
  const reg = useAssets();
  const id = `c${String(n).padStart(2, "0")}`;
  const e = reg?.skillIcons[id];
  const color = CARD_COLORS[cardGroup(n)];
  return (
    <div
      className={`sc ${state ?? ""}`}
      style={{ background: `linear-gradient(155deg, ${color}, ${color}cc 60%, #0e1220 130%)`, fontSize: mini ? 7.5 : undefined, ...style }}
      title={`${id}.svg · ${CARD_NAMES[id]}`}
    >
      {state === "new" && <span className="sc-ring" />}
      <span className="sc-sheen" />
      <span style={{ opacity: 0.85, position: "relative" }}>{id}</span>
      <div className="ic" style={{ transform: `scale(${scale})`, position: "relative" }}>
        {e?.text ? <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: normaliseSvg(e.text) }} /> : <span className="miss">MISSING_ASSET skill-card-icons.zip/{id}.svg</span>}
      </div>
      <span style={{ textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", position: "relative" }}>{CARD_NAMES[id]}</span>
    </div>
  );
}
