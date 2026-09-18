import { useRemoteSvg, svgToInlineMarkup, type SkillDef } from "../data/remoteAssets";

/* =====================================================================
   SKILL ICON (c01–c40)
   Primary source: repo skill-card-icons/*.svg (monochrome, white,
   hybrid filled-outline). Loaded at runtime; if the file is missing
   or the network is offline a drawn fallback (same style, same
   viewBox 48×48, white hybrid) is shown — and the inspector reports
   the exact file as FALLBACK.
   ===================================================================== */

/* fallback glyph set — white filled + white outline, viewBox 0 0 48 48 */
const GLYPHS: React.FC<{ k: number }> = ({ k }) => {
  const st = { stroke: "#fff", strokeWidth: 3, fill: "none" as const, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const sw = { stroke: "#fff", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (k % 12) {
    case 0: // structure arrows
      return (<g><path d="M6 34h30" {...st} /><path d="M12 30l8-8 6 5 10-11" {...st} /><path d="M30 16h6v6" {...st} /><path d="M10 26l6 4" fill="#fff" stroke="none" /></g>);
    case 1: // timeframe nested
      return (<g><rect x="6" y="12" width="24" height="24" rx="4" {...st} /><rect x="18" y="18" width="24" height="24" rx="4" fill="#ffffff" fillOpacity={0.22} {...sw} /></g>);
    case 2: // volume bars
      return (<g><rect x="8" y="24" width="7" height="14" rx="2" fill="#fff" /><rect x="20" y="16" width="7" height="22" rx="2" fill="#fff" /><rect x="32" y="20" width="7" height="18" rx="2" {...st} /></g>);
    case 3: // map dots
      return (<g><circle cx="14" cy="14" r="5" fill="#fff" /><circle cx="34" cy="22" r="5" fill="#fff" /><circle cx="18" cy="34" r="5" {...st} /><path d="M18 17l11 3M29 26l-8 5" {...st} /></g>);
    case 4: // wave
      return (<g><path d="M6 30c4-12 8-12 12 0s8 12 12 0 8-12 12 0" {...st} /></g>);
    case 5: // link/correlation
      return (<g><circle cx="17" cy="19" r="9" {...st} /><circle cx="31" cy="29" r="9" {...st} /></g>);
    case 6: // pulse
      return (<g><path d="M6 24h10l4-10 6 20 4-10h12" {...st} /></g>);
    case 7: // news
      return (<g><rect x="8" y="8" width="32" height="32" rx="4" {...st} /><path d="M14 16h20M14 23h20M14 30h12" {...st} /></g>);
    case 8: // chat/sentiment
      return (<g><path d="M10 10h28v20H20l-10 8z" fill="#ffffff" fillOpacity={0.22} {...sw} /><circle cx="18" cy="20" r="2" fill="#fff" /><circle cx="26" cy="20" r="2" fill="#fff" /><circle cx="34" cy="20" r="2" fill="#fff" /></g>);
    case 9: // globe/macro
      return (<g><circle cx="24" cy="24" r="16" {...st} /><path d="M8 24h32M24 8c-6 5-6 27 0 32M24 8c6 5 6 27 0 32" stroke="#fff" strokeWidth={2.4} fill="none" /></g>);
    case 10: // chain/onchain
      return (<g><rect x="8" y="16" width="14" height="16" rx="3" fill="#fff" /><rect x="26" y="16" width="14" height="16" rx="3" {...st} /><path d="M22 24h4" {...st} /></g>);
    default: // shield/check
      return (<g><path d="M24 6l14 5v10c0 9-6 15-14 21-8-6-14-12-14-21V11z" fill="#ffffff" fillOpacity={0.22} {...sw} /><path d="M17 24l5 5 9-10" {...st} /></g>);
  }
};

export const SkillIcon = ({ skill, size = 48, className = "", tint }: { skill: SkillDef; size?: number; className?: string; tint?: string }) => {
  const { svg } = useRemoteSvg(skill.file);

  if (svg) {
    const inner = svgToInlineMarkup(svg, tint ?? "#ffffff");
    return (
      <span
        className={className}
        style={{ display: "inline-flex", width: size, height: size, lineHeight: 0 }}
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} style={{ display: "block" }}>
      <title>{`${skill.id} fallback`}</title>
      <GLYPHS k={parseInt(skill.id.slice(1), 10)} />
    </svg>
  );
};

export default SkillIcon;
