import React, { useId } from "react";

/* =====================================================================
   CANONICAL TOP BAR ICONS — markup copied VERBATIM from
   repo: topbar/topbar.html (lightning, star, coin)
   repo: topbar/icons/bell.svg, topbar/icons/gear.svg
   Gradient ids are made unique per instance.
   ===================================================================== */

/* unique-ify gradient ids and rewrite url(#) references per instance */
function inlineSvg(svg: string, uid: string, className: string, size: number): React.ReactElement {
  const map = new Map<string, string>();
  let i = 0;
  const withIds = svg.replace(/id="([^"]+)"/g, (_m, id: string) => {
    const u = `${uid}${i++}`;
    map.set(id, u);
    return `id="${u}"`;
  });
  const withRefs = withIds.replace(/url\(#([^)]+)\)/g, (m, id: string) => {
    const u = map.get(id);
    return u ? `url(#${u})` : m;
  });
  // repo SVGs have no intrinsic width/height (viewBox only) → force fill the box
  const cleaned = withRefs
    .replace(/xmlns="[^"]*"/, "")
    .replace(/<svg([^>]*)>/, (m) => m.replace(">", ` style="width:100%;height:100%;display:block">`));
  return <span className={className} style={{ display: "inline-flex", width: size, height: size, lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: cleaned }} />;
}

/* --------------------------------- LIGHTNING (repo verbatim) */
const BOLT_SVG = `<svg viewBox="0 0 48 48"><defs><linearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFF59D"/><stop offset="35%" stop-color="#FFD54F"/><stop offset="70%" stop-color="#FFB300"/><stop offset="100%" stop-color="#FF8F00"/></linearGradient><linearGradient id="boltHi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF" stop-opacity=".9"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient></defs><path d="M27 3 L7 28.2c-.7.9-.1 2.3 1.1 2.3h8.6L14.5 43.6c-.4 1.3 1.1 2.3 2.2 1.5L39 20.9c.7-.6.4-1.9-.6-1.9h-9.2L33.4 5.1c.3-1.4-1.1-2.4-2.3-1.6L27 3z" fill="#B45309" opacity=".25" transform="translate(0,1.5)"/><path d="M27 2.5 L7 27.7c-.7.9-.1 2.3 1.1 2.3h8.6L14.5 43.1c-.4 1.3 1.1 2.3 2.2 1.5L39 20.4c.7-.6.4-1.9-.6-1.9h-9.2L33.4 4.6c.3-1.4-1.1-2.4-2.3-1.6L27 2.5z" fill="url(#boltGrad)" stroke="#9C5A00" stroke-opacity=".35" stroke-width="1" stroke-linejoin="round"/><path d="M27.5 6 L13.5 26.5h6.8c.8 0 1.4.7 1.2 1.5L19.5 38 32 18.5h-6c-.7 0-1.3-.6-1.1-1.3L27.5 6z" fill="url(#boltHi)" opacity=".55"/></svg>`;

/* --------------------------------- STAR (repo verbatim) */
const STAR_SVG = `<svg viewBox="0 0 48 48"><defs><linearGradient id="starGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFE082"/><stop offset="45%" stop-color="#FFC107"/><stop offset="100%" stop-color="#FF8F00"/></linearGradient><linearGradient id="starHi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF" stop-opacity=".85"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient></defs><path d="M24 3.8l5.9 11.3 12.7 2.1c1.2.2 1.7 1.7.8 2.6l-9 9.1 2 12.8c.2 1.2-1.1 2.1-2.1 1.5L24 37.7l-10.3 5.5c-1 .6-2.3-.3-2.1-1.5l2-12.8-9-9.1c-.9-.9-.4-2.4.8-2.6l12.7-2.1L24 3.8z" fill="url(#starGrad)" stroke="#9C5A00" stroke-opacity=".35" stroke-width="1" stroke-linejoin="round"/><ellipse cx="24" cy="14" rx="8.5" ry="5" fill="url(#starHi)" opacity=".5"/><circle cx="18.5" cy="18.5" r="2.2" fill="#FFF" opacity=".65"/></svg>`;

/* --------------------------------- COIN (repo verbatim) */
const COIN_SVG = `<svg viewBox="0 0 48 48"><defs><radialGradient id="coinFace" cx=".38" cy=".32" r=".9"><stop offset="0%" stop-color="#FFF8E1"/><stop offset="25%" stop-color="#FFECB3"/><stop offset="55%" stop-color="#FFC107"/><stop offset="85%" stop-color="#FF8F00"/><stop offset="100%" stop-color="#E65100"/></radialGradient><linearGradient id="coinRim" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFE082"/><stop offset="50%" stop-color="#FFB300"/><stop offset="100%" stop-color="#E65100"/></linearGradient><linearGradient id="coinInner" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF8F00"/><stop offset="15%" stop-color="#FFCA28"/><stop offset="85%" stop-color="#FFB300"/><stop offset="100%" stop-color="#E65100"/></linearGradient></defs><circle cx="24" cy="24" r="21" fill="url(#coinRim)" stroke="#9C4A00" stroke-opacity=".45" stroke-width="1"/><circle cx="24" cy="24" r="18.2" fill="none" stroke="#FFF8E1" stroke-opacity=".7" stroke-width="1.6" stroke-dasharray="2.5 2.2"/><circle cx="24" cy="24" r="15.5" fill="url(#coinFace)" stroke="url(#coinInner)" stroke-width="1.2"/><ellipse cx="19.5" cy="17.5" rx="7" ry="4.8" fill="#FFF" opacity=".45"/><path d="M24 15.5l2.4 4.6 5.2.8-3.7 3.7.8 5.2-4.7-2.4-4.7 2.4.8-5.2-3.7-3.7 5.2-.8 2.4-4.6z" fill="#FF8F00" opacity=".85"/><path d="M24 16.8l1.8 3.5 3.9.6-2.8 2.8.6 3.9-3.5-1.8-3.5 1.8.6-3.9-2.8-2.8 3.9-.6 1.8-3.5z" fill="#FFECB3"/></svg>`;

/* --------------------------------- BELL (repo topbar/icons/bell.svg verbatim) */
const BELL_SVG = `<svg viewBox="0 0 48 48"><defs><linearGradient id="bellGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="45%" stop-color="#E6F0FF"/><stop offset="100%" stop-color="#A9C3E8"/></linearGradient><linearGradient id="bellSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#7FA0CC" stop-opacity="0.55"/><stop offset="18%" stop-color="#7FA0CC" stop-opacity="0"/><stop offset="82%" stop-color="#5B7BA8" stop-opacity="0"/><stop offset="100%" stop-color="#5B7BA8" stop-opacity="0.5"/></linearGradient></defs><rect x="20.6" y="3" width="6.8" height="6" rx="3.4" fill="#A9C3E8" stroke="#6E8DB8" stroke-width="1"/><circle cx="24" cy="5.8" r="1.6" fill="#E6F0FF"/><path d="M24 8.5c-7.2 0-11.5 5.2-11.5 12.2 0 5.8-1.2 8.6-3.3 11.3-.5.7-.1 1.8.9 1.8h28.8c1 0 1.4-1.1.9-1.8-2.1-2.7-3.3-5.5-3.3-11.3 0-7-4.3-12.2-12.5-12.2z" fill="url(#bellGrad)" stroke="#6E8DB8" stroke-width="1.2" stroke-linejoin="round"/><path d="M24 8.5c-7.2 0-11.5 5.2-11.5 12.2 0 5.8-1.2 8.6-3.3 11.3-.5.7-.1 1.8.9 1.8h28.8c1 0 1.4-1.1.9-1.8-2.1-2.7-3.3-5.5-3.3-11.3 0-7-4.3-12.2-12.5-12.2z" fill="url(#bellSide)"/><path d="M16.5 17.5c-1 1.6-1.5 3.6-1.5 5.7 0 3.4-.5 5.7-1.4 7.6-.3.6.1 1.1.6.7 1.6-1.2 3.1-3.9 3.4-8.1.2-2.4-.1-4.4-1.1-5.9z" fill="#FFFFFF" opacity="0.9"/><path d="M9.4 33.8h29.2c1 0 1.6 1 1.1 1.9-.5.9-1.6 1.5-2.8 1.5H11.1c-1.2 0-2.3-.6-2.8-1.5-.5-.9.1-1.9 1.1-1.9z" fill="#C9DBF5" stroke="#6E8DB8" stroke-width="1" stroke-linejoin="round"/><ellipse cx="24" cy="40.2" rx="4.2" ry="3.8" fill="#A9C3E8" stroke="#6E8DB8" stroke-width="1"/><ellipse cx="22.8" cy="39.2" rx="1.5" ry="1.2" fill="#EAF2FF" opacity="0.9"/></svg>`;

/* --------------------------------- GEAR (repo topbar/icons/gear.svg verbatim) */
const GEAR_SVG = `<svg viewBox="0 0 48 48"><defs><linearGradient id="gearGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F4F8FF"/><stop offset="50%" stop-color="#C9DBF5"/><stop offset="100%" stop-color="#9AB6DC"/></linearGradient><linearGradient id="gearHi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs><path d="M 20.565 10.222 L 21.028 5.234 A 19 19 0 0 1 26.972 5.234 L 27.435 10.222 A 14.2 14.2 0 0 1 31.314 11.828 L 35.168 8.629 A 19 19 0 0 1 39.371 12.832 L 36.172 16.686 A 14.2 14.2 0 0 1 37.778 20.565 L 42.766 21.028 A 19 19 0 0 1 42.766 26.972 L 37.778 27.435 A 14.2 14.2 0 0 1 36.172 31.314 L 39.371 35.168 A 19 19 0 0 1 35.168 39.371 L 31.314 36.172 A 14.2 14.2 0 0 1 27.435 37.778 L 26.972 42.766 A 19 19 0 0 1 21.028 42.766 L 20.565 37.778 A 14.2 14.2 0 0 1 16.686 36.172 L 12.832 39.371 A 19 19 0 0 1 8.629 35.168 L 11.828 31.314 A 14.2 14.2 0 0 1 10.222 27.435 L 5.234 26.972 A 19 19 0 0 1 5.234 21.028 L 10.222 20.565 A 14.2 14.2 0 0 1 11.828 16.686 L 8.629 12.832 A 19 19 0 0 1 12.832 8.629 L 16.686 11.828 A 14.2 14.2 0 0 1 20.565 10.222 Z" fill="url(#gearGrad)" stroke="#6E8DB8" stroke-width="1.4" stroke-linejoin="round"/><ellipse cx="24" cy="13.5" rx="9" ry="3.6" fill="url(#gearHi)" opacity="0.55"/><circle cx="24" cy="24" r="8.2" fill="#0A2540" stroke="#6E8DB8" stroke-width="1.4"/></svg>`;

export const IconBolt = ({ size = 24, className = "" }: { size?: number; className?: string }) =>
  inlineSvg(BOLT_SVG, useId().replace(/[:]/g, ""), className, size);
export const IconStar = ({ size = 24, className = "" }: { size?: number; className?: string }) =>
  inlineSvg(STAR_SVG, useId().replace(/[:]/g, ""), className, size);
export const IconCoin = ({ size = 24, className = "" }: { size?: number; className?: string }) =>
  inlineSvg(COIN_SVG, useId().replace(/[:]/g, ""), className, size);
export const IconBell = ({ size = 24, className = "" }: { size?: number; className?: string }) =>
  inlineSvg(BELL_SVG, useId().replace(/[:]/g, ""), className, size);
export const IconGear = ({ size = 24, className = "" }: { size?: number; className?: string }) =>
  inlineSvg(GEAR_SVG, useId().replace(/[:]/g, ""), className, size);

/* =====================================================================
   UI ICONS — drawn in-repo (no emoji, no external libs),
   consistent 24×24, stroke 2, currentColor.
   ===================================================================== */
type P = { size?: number; className?: string; color?: string; stroke?: number };

const S = ({ size = 22, children, color = "currentColor", stroke = 2, className = "" }: P & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: "block", flexShrink: 0 }}>
    {children}
  </svg>
);

export const IBack = (p: P) => <S {...p}><path d="M14.5 5.5 8 12l6.5 6.5" /></S>;
export const IClose = (p: P) => <S {...p}><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /></S>;
export const ICheck = (p: P) => <S {...p} stroke={p.stroke ?? 2.4}><path d="M4.5 12.5l5 5 10-11" /></S>;
export const ISearch = (p: P) => <S {...p}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></S>;
export const IChevL = (p: P) => <S {...p}><path d="M14.5 5 8 12l6.5 7" /></S>;
export const IChevR = (p: P) => <S {...p}><path d="M9.5 5 16 12l-6.5 7" /></S>;
export const IPrev = (p: P) => <S {...p}><path d="M7 5v14M18 5l-8.5 7L18 19z" fill="currentColor" fillOpacity=".25" /></S>;
export const INext = (p: P) => <S {...p}><path d="M17 5v14M6 5l8.5 7L6 19z" fill="currentColor" fillOpacity=".25" /></S>;
export const IPlay = (p: P) => <S {...p}><path d="M8 5.5v13l11-6.5z" fill="currentColor" fillOpacity=".3" /></S>;
export const IPause = (p: P) => <S {...p}><path d="M8 5.5v13M16 5.5v13" stroke="3" /></S>;
export const IRetry = (p: P) => <S {...p}><path d="M20 12a8 8 0 1 1-2.34-5.66" /><path d="M20 4v4h-4" /></S>;
export const IWarn = (p: P) => <S {...p}><path d="M12 3.5 22 20H2z" /><path d="M12 9.5v5" /><circle cx="12" cy="17" r="0.6" fill="currentColor" /></S>;
export const ILock = (p: P) => <S {...p}><rect x="5.5" y="10.5" width="13" height="10" rx="2.5" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /><circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none" /></S>;
export const ISeal = (p: P) => <S {...p}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" /></S>;
export const IFF = (p: P) => <S {...p}><path d="M4 6v12l7-6z" fill="currentColor" fillOpacity=".3" /><path d="M13 6v12l7-6z" fill="currentColor" fillOpacity=".3" /></S>;
export const ITarget = (p: P) => <S {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.8" fill="currentColor" /></S>;
export const IHand = (p: P) => (
  <S {...p}>
    <path d="M9 11.5V4.8a1.6 1.6 0 0 1 3.2 0v5.4l.2-2a1.6 1.6 0 0 1 3.15.3l.1 3.5 1.6-1.2a1.7 1.7 0 0 1 2.2 2.6l-4.5 5.6a4.5 4.5 0 0 1-3.5 1.7H10a4 4 0 0 1-4-4v-5a1.5 1.5 0 0 1 3 0" />
  </S>
);
export const IBook = (p: P) => <S {...p}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" /><path d="M12 6.5v9" /></S>;
export const IDeck = (p: P) => <S {...p}><rect x="3.5" y="6" width="11" height="14" rx="2" transform="rotate(-8 3.5 6)" /><rect x="9.5" y="4" width="11" height="14" rx="2" transform="rotate(6 9.5 4)" /></S>;
export const IUser = (p: P) => <S {...p}><circle cx="12" cy="8.5" r="4" /><path d="M4.5 20.5c1.2-3.5 4-5 7.5-5s6.3 1.5 7.5 5" /></S>;
export const ITrophy = (p: P) => <S {...p}><path d="M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4" /><path d="M12 14v3M8.5 20.5h7M10 17h4v3.5h-4z" /></S>;
export const IFlame = (p: P) => <S {...p}><path d="M12 3s1 2.5-1 5c-1.4 1.7-3 3-3 5.5A4.6 4.6 0 0 0 12.5 18c2.8 0 4.5-2 4.5-4.5 0-2-1-3.5-1.8-4.5-.4 1-.9 1.6-1.7 2.1.3-2.6-.4-5.6-1.5-8.1z" fill="currentColor" fillOpacity=".2" /></S>;
export const ICloud = (p: P) => <S {...p}><path d="M7 18.5A4.5 4.5 0 0 1 6.3 9.6 6 6 0 0 1 18 8.5a4.8 4.8 0 0 1-.8 10z" /><path d="m4 21 16-17" strokeDasharray="2.5 3" /></S>;
export const IEmptyBox = (p: P) => <S {...p}><path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5z" /><path d="M4 8.5 12 13l8-4.5M12 13v7" /></S>;
export const IEye = (p: P) => <S {...p}><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.6" /></S>;
export const IReset = (p: P) => <S {...p}><path d="M4 12a8 8 0 1 0 2.34-5.66" /><path d="M4 4v4h4" /></S>;
export const IGrid = (p: P) => <S {...p}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></S>;
export const IList = (p: P) => <S {...p}><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="5" cy="6" r="1" fill="currentColor" /><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="5" cy="18" r="1" fill="currentColor" /></S>;
export const ICode = (p: P) => <S {...p}><path d="m8 8-4.5 4L8 16M16 8l4.5 4L16 16" /></S>;
export const ISliders = (p: P) => <S {...p}><path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h9M17 17h3" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="15" cy="17" r="2" /></S>;
export const IBoltLine = (p: P) => <S {...p}><path d="M13 2.5 5 13.5h5L9.5 21.5 19 9.5h-5.5z" fill="currentColor" fillOpacity=".25" /></S>;
export const IStarLine = (p: P) => <S {...p}><path d="m12 3.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.2l5.4-.8z" /></S>;
export const IMoon = (p: P) => <S {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" /></S>;
export const IPlus = (p: P) => <S {...p} stroke={2.4}><path d="M12 5v14M5 12h14" /></S>;
export const IMinus = (p: P) => <S {...p} stroke={2.4}><path d="M5 12h14" /></S>;
export const IDrop = (p: P) => <S {...p}><path d="M12 3.5S6 10 6 14.5a6 6 0 0 0 12 0C18 10 12 3.5 12 3.5z" fill="currentColor" fillOpacity=".15" /></S>;
export const IWave = (p: P) => <S {...p}><path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" /></S>;
export const IScan = (p: P) => <S {...p}><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" /><path d="M4 12h16" strokeDasharray="3 3" /></S>;
export const IChart = (p: P) => <S {...p}><path d="M7 5v14M12 5v14M17 5v14" /><rect x="5.5" y="9" width="3" height="6" rx="1" fill="currentColor" stroke="none" /><rect x="10.5" y="6.5" width="3" height="5" rx="1" fill="currentColor" stroke="none" /><rect x="15.5" y="11" width="3" height="5.5" rx="1" fill="currentColor" stroke="none" /></S>;
export const ISwords = (p: P) => (
  <S {...p} stroke={p.stroke ?? 2.2}>
    <path d="M4.5 19.5 19.5 4.5" /><path d="m16.6 4.6 2.8 2.8" /><path d="m2.8 17.8 3.4 3.4" /><path d="m2.2 21.8 2-2" />
    <path d="M19.5 19.5 4.5 4.5" /><path d="m4.6 4.6 2.8 2.8" /><path d="m17.8 17.8 3.4 3.4" /><path d="m19.8 21.8 2-2" />
  </S>
);

/* Brand emblem: two crossed Japanese candles on a shield (brand.md) */
export const Emblem = ({ size = 40, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} style={{ display: "block" }}>
    <path d="M24 3 42 9v12c0 10.5-7 18.5-18 24C13 39.5 6 31.5 6 21V9z" fill="#151F35" stroke="#35E0D0" strokeWidth="2" strokeLinejoin="round" />
    <path d="M17.5 12v4M17.5 32v4" stroke="#FF5B6A" strokeWidth="2" strokeLinecap="round" />
    <rect x="14.5" y="16" width="6" height="16" rx="1.6" fill="#FF5B6A" />
    <path d="M30.5 12v4M30.5 32v4" stroke="#3DDC97" strokeWidth="2" strokeLinecap="round" />
    <rect x="27.5" y="16" width="6" height="16" rx="1.6" fill="#3DDC97" />
  </svg>
);
