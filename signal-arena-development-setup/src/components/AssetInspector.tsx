import { assetMatrix, variantsOf, type Page, type Variant } from "../lib/pages";
import { useRepoAssets, SkillAsset } from "../lib/repoAssets";
import { RefreshIcon, CheckmarkIcon } from "./icons";
import { playTapSound } from "../utils/audio";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/5 py-2 last:border-0">
      <span className="shrink-0 text-[8px] font-black tracking-[0.14em] text-[#526B88] uppercase">{label}</span>
      <span className="min-w-0 text-right font-mono text-[9px] leading-snug text-[#A9BED4] break-words">{value}</span>
    </div>
  );
}

export function AssetInspector({
  page,
  variant,
  onReset,
}: {
  page: Page;
  variant: Variant;
  onReset: () => void;
}) {
  const assets = useRepoAssets();
  const cardId = /^c\d+$/i.test(variant.assetId) ? Number(variant.assetId.slice(1)) : 0;
  const rows = assetMatrix(page).filter((r) => r.vid === variant.vid);

  return (
    <aside className="hidden lg:flex w-[248px] shrink-0 h-full flex-col border-l border-[#1D2C40] bg-[#0D1521]/97 backdrop-blur-md">
      <div className="shrink-0 p-3.5 border-b border-[#1A283C]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-[11px] font-extrabold text-white">Asset Inspector</p>
            <p className="font-mono text-[8.5px] text-[#2EE6C8]">{page.id} · {variant.vid}</p>
          </div>
          <span className={`w-2.5 h-2.5 rounded-full ${assets.status === "ready" ? "bg-[#50C890]" : assets.status === "error" ? "bg-[#EB635B]" : "bg-[#F5BE38] animate-pulse"}`} />
        </div>
      </div>

      <div className="custom-scroll min-h-0 flex-1 p-3">
        <div className="rounded-xl border border-[#243750] bg-[#101A28] p-2.5">
          <div className="h-[76px] rounded-lg bg-[#0A121D] border border-[#1D2C40] grid place-items-center overflow-hidden">
            {cardId ? (
              <SkillAsset id={cardId} className="w-14 h-14" />
            ) : (
              <span className="font-display text-[12px] font-extrabold" style={{ color: variant.tint }}>
                {variant.assetId.toUpperCase()}
              </span>
            )}
          </div>
          <div className="mt-2">
            <Row label="Asset ID" value={variant.assetId} />
            <Row label="Source" value={variant.source} />
            <Row label="Slot" value={variant.slot} />
            <Row label="Crop" value={variant.crop} />
            <Row label="Fit" value={variant.fit} />
            <Row label="Scale" value={`${variant.scale.toFixed(2)}×`} />
            <Row label="Position" value={`${variant.posX}% / ${variant.posY}%`} />
            <Row label="Opacity" value={variant.opacity.toFixed(2)} />
            <Row label="Tint" value={variant.tint} />
            <Row label="Motion" value={variant.motion} />
            <Row label="Fallback" value={variant.fallback} />
          </div>
        </div>

        <div className="mt-3">
          <p className="text-[8.5px] font-black tracking-[0.16em] text-[#526B88] uppercase mb-1.5">Asset Matrix · текущая страница</p>
          <div className="space-y-1.5">
            {variantsOf(page).map((item) => (
              <div key={item.vid} className={`rounded-xl border p-2 ${item.vid === variant.vid ? "border-[#2EE6C8] bg-[#2EE6C8]/8" : "border-[#1D2C40] bg-[#0F1825]"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-black text-[#C5D6E8]">{item.vid}</span>
                  <span className="font-mono text-[8px] text-[#67809C]">{item.assetId} · {item.chart}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-[#1D2C40] bg-[#0F1825] p-2.5">
          <p className="flex items-center gap-1.5 text-[8.5px] font-black tracking-[0.13em] text-[#526B88] uppercase">
            <CheckmarkIcon size={11} className="text-[#50C890]" /> Runtime assets
          </p>
          <p className="mt-1 font-mono text-[8.5px] leading-relaxed text-[#7890AA]">
            skill-card-icons.zip: {Object.keys(assets.cards).length}/40 SVG<br />
            topbar.zip: {assets.topbarFiles.length} files<br />
            topbar.html: {assets.topbarHtml ? "READY" : "MISSING"}
          </p>
          {!!assets.missing.length && (
            <p className="mt-1 font-mono text-[8px] text-[#FF928A]">MISSING: {assets.missing.join(", ")}</p>
          )}
        </div>

        <div className="mt-3 space-y-1">
          {rows.map((row, i) => (
            <div key={i} className="rounded-lg bg-[#0A121D] border border-[#182638] px-2 py-1.5">
              <p className="font-mono text-[8px] text-[#2EE6C8]">{row.slot} · {row.assetId}</p>
              <p className="text-[8px] leading-snug text-[#607996]">{row.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 p-3 border-t border-[#1A283C]">
        <button
          onClick={() => { playTapSound(); onReset(); }}
          className="tactile-btn min-h-11 w-full rounded-xl border border-[#2B3E57] bg-[#111B29] text-[#A9BED4] font-display text-[9px] font-bold uppercase flex items-center justify-center gap-1.5"
        >
          <RefreshIcon size={13} /> Reset Variant
        </button>
      </div>
    </aside>
  );
}