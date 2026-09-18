/* ============================================================================
   UI ICON SYSTEM — Signal Arena
   Canonical Top Bar art reproduced from the repository sources:
   topbar/topbar.html plus exact raw SVG geometry for bolt, star, coin, bell,
   and gear from topbar/icons. No substitute library is used.
   Zero emoji. Every pictogram below is drawn in SVG in this file.
   ========================================================================== */
import type { ReactNode } from "react";

/* ----------------------- canonical topbar art (repo) ---------------------- */
export function IconBolt({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF59D" /><stop offset="35%" stopColor="#FFD54F" />
          <stop offset="70%" stopColor="#FFB300" /><stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
        <linearGradient id="boltHi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF" stopOpacity=".9" /><stop offset="100%" stopColor="#FFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M27 3 L7 28.2c-.7.9-.1 2.3 1.1 2.3h8.6L14.5 43.6c-.4 1.3 1.1 2.3 2.2 1.5L39 20.9c.7-.6.4-1.9-.6-1.9h-9.2L33.4 5.1c.3-1.4-1.1-2.4-2.3-1.6L27 3z" fill="#B45309" opacity=".25" transform="translate(0,1.5)" />
      <path d="M27 2.5 L7 27.7c-.7.9-.1 2.3 1.1 2.3h8.6L14.5 43.1c-.4 1.3 1.1 2.3 2.2 1.5L39 20.4c.7-.6.4-1.9-.6-1.9h-9.2L33.4 4.6c.3-1.4-1.1-2.4-2.3-1.6L27 2.5z" fill="url(#boltGrad)" stroke="#9C5A00" strokeOpacity=".35" strokeWidth="1" strokeLinejoin="round" />
      <path d="M27.5 6 L13.5 26.5h6.8c.8 0 1.4.7 1.2 1.5L19.5 38 32 18.5h-6c-.7 0-1.3-.6-1.1-1.3L27.5 6z" fill="url(#boltHi)" opacity=".55" />
    </svg>
  );
}

export function IconStar({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="starGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE082" /><stop offset="45%" stopColor="#FFC107" /><stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
        <linearGradient id="starHi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF" stopOpacity=".85" /><stop offset="100%" stopColor="#FFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M24 3.8l5.9 11.3 12.7 2.1c1.2.2 1.7 1.7.8 2.6l-9 9.1 2 12.8c.2 1.2-1.1 2.1-2.1 1.5L24 37.7l-10.3 5.5c-1 .6-2.3-.3-2.1-1.5l2-12.8-9-9.1c-.9-.9-.4-2.4.8-2.6l12.7-2.1L24 3.8z" fill="url(#starGrad)" stroke="#9C5A00" strokeOpacity=".35" strokeWidth="1" strokeLinejoin="round" />
      <ellipse cx="24" cy="14" rx="8.5" ry="5" fill="url(#starHi)" opacity=".5" />
      <circle cx="18.5" cy="18.5" r="2.2" fill="#FFF" opacity=".65" />
    </svg>
  );
}

export function IconCoin({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <radialGradient id="coinFace" cx=".38" cy=".32" r=".9">
          <stop offset="0%" stopColor="#FFF8E1" /><stop offset="25%" stopColor="#FFECB3" />
          <stop offset="55%" stopColor="#FFC107" /><stop offset="85%" stopColor="#FF8F00" /><stop offset="100%" stopColor="#E65100" />
        </radialGradient>
        <linearGradient id="coinRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE082" /><stop offset="50%" stopColor="#FFB300" /><stop offset="100%" stopColor="#E65100" />
        </linearGradient>
        <linearGradient id="coinInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF8F00" /><stop offset="15%" stopColor="#FFCA28" />
          <stop offset="85%" stopColor="#FFB300" /><stop offset="100%" stopColor="#E65100" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill="url(#coinRim)" stroke="#9C4A00" strokeOpacity=".45" strokeWidth="1" />
      <circle cx="24" cy="24" r="18.2" fill="none" stroke="#FFF8E1" strokeOpacity=".7" strokeWidth="1.6" strokeDasharray="2.5 2.2" />
      <circle cx="24" cy="24" r="15.5" fill="url(#coinFace)" stroke="url(#coinInner)" strokeWidth="1.2" />
      <ellipse cx="19.5" cy="17.5" rx="7" ry="4.8" fill="#FFF" opacity=".45" />
      <path d="M24 15.5l2.4 4.6 5.2.8-3.7 3.7.8 5.2-4.7-2.4-4.7 2.4.8-5.2-3.7-3.7 5.2-.8 2.4-4.6z" fill="#FF8F00" opacity=".85" />
      <path d="M24 16.8l1.8 3.5 3.9.6-2.8 2.8.6 3.9-3.5-1.8-3.5 1.8.6-3.9-2.8-2.8 3.9-.6 1.8-3.5z" fill="#FFECB3" />
    </svg>
  );
}

export function IconBell({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="bellGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF"/><stop offset="45%" stopColor="#E6F0FF"/><stop offset="100%" stopColor="#A9C3E8"/>
        </linearGradient>
        <linearGradient id="bellSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7FA0CC" stopOpacity=".55"/><stop offset="18%" stopColor="#7FA0CC" stopOpacity="0"/>
          <stop offset="82%" stopColor="#5B7BA8" stopOpacity="0"/><stop offset="100%" stopColor="#5B7BA8" stopOpacity=".5"/>
        </linearGradient>
      </defs>
      <rect x="20.6" y="3" width="6.8" height="6" rx="3.4" fill="#A9C3E8" stroke="#6E8DB8" strokeWidth="1"/>
      <circle cx="24" cy="5.8" r="1.6" fill="#E6F0FF"/>
      <path d="M24 8.5c-7.2 0-11.5 5.2-11.5 12.2 0 5.8-1.2 8.6-3.3 11.3-.5.7-.1 1.8.9 1.8h28.8c1 0 1.4-1.1.9-1.8-2.1-2.7-3.3-5.5-3.3-11.3 0-7-4.3-12.2-12.5-12.2z" fill="url(#bellGrad)" stroke="#6E8DB8" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M24 8.5c-7.2 0-11.5 5.2-11.5 12.2 0 5.8-1.2 8.6-3.3 11.3-.5.7-.1 1.8.9 1.8h28.8c1 0 1.4-1.1.9-1.8-2.1-2.7-3.3-5.5-3.3-11.3 0-7-4.3-12.2-12.5-12.2z" fill="url(#bellSide)"/>
      <path d="M16.5 17.5c-1 1.6-1.5 3.6-1.5 5.7 0 3.4-.5 5.7-1.4 7.6-.3.6.1 1.1.6.7 1.6-1.2 3.1-3.9 3.4-8.1.2-2.4-.1-4.4-1.1-5.9z" fill="#FFFFFF" opacity=".9"/>
      <path d="M9.4 33.8h29.2c1 0 1.6 1 1.1 1.9-.5.9-1.6 1.5-2.8 1.5H11.1c-1.2 0-2.3-.6-2.8-1.5-.5-.9.1-1.9 1.1-1.9z" fill="#C9DBF5" stroke="#6E8DB8" strokeWidth="1" strokeLinejoin="round"/>
      <ellipse cx="24" cy="40.2" rx="4.2" ry="3.8" fill="#A9C3E8" stroke="#6E8DB8" strokeWidth="1"/>
      <ellipse cx="22.8" cy="39.2" rx="1.5" ry="1.2" fill="#EAF2FF" opacity=".9"/>
    </svg>
  );
}

export function IconGear({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="gearGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F4F8FF"/><stop offset="50%" stopColor="#C9DBF5"/><stop offset="100%" stopColor="#9AB6DC"/></linearGradient>
        <linearGradient id="gearHi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFFFFF" stopOpacity=".9"/><stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/></linearGradient>
      </defs>
      <path d="M20.565 10.222 21.028 5.234A19 19 0 0 1 26.972 5.234L27.435 10.222A14.2 14.2 0 0 1 31.314 11.828L35.168 8.629A19 19 0 0 1 39.371 12.832L36.172 16.686A14.2 14.2 0 0 1 37.778 20.565L42.766 21.028A19 19 0 0 1 42.766 26.972L37.778 27.435A14.2 14.2 0 0 1 36.172 31.314L39.371 35.168A19 19 0 0 1 35.168 39.371L31.314 36.172A14.2 14.2 0 0 1 27.435 37.778L26.972 42.766A19 19 0 0 1 21.028 42.766L20.565 37.778A14.2 14.2 0 0 1 16.686 36.172L12.832 39.371A19 19 0 0 1 8.629 35.168L11.828 31.314A14.2 14.2 0 0 1 10.222 27.435L5.234 26.972A19 19 0 0 1 5.234 21.028L10.222 20.565A14.2 14.2 0 0 1 11.828 16.686L8.629 12.832A19 19 0 0 1 12.832 8.629L16.686 11.828A14.2 14.2 0 0 1 20.565 10.222Z" fill="url(#gearGrad)" stroke="#6E8DB8" strokeWidth="1.4" strokeLinejoin="round"/>
      <ellipse cx="24" cy="13.5" rx="9" ry="3.6" fill="url(#gearHi)" opacity=".55"/>
      <circle cx="24" cy="24" r="8.2" fill="#0A2540" stroke="#6E8DB8" strokeWidth="1.4"/>
      <circle cx="24" cy="24" r="8.2" fill="none" stroke="#FFFFFF" strokeOpacity=".35" strokeWidth=".8"/>
    </svg>
  );
}

/* ------------------------------ ARENA EMBLEM ------------------------------ */
/* Two crossed Japanese candles (green growth / red drawdown) crossing over an
   arena shield. Candle bodies carry a hilt and a shadow-shaped tip — the sword
   silhouette lives inside the candle form. No literal combat imagery. */
function CandleBlade({ up, id }: { up: boolean; id: string }) {
  const body = up ? "#3ECF8E" : "#E2605C";
  const deep = up ? "#1E7C53" : "#A03A38";
  return (
    <g>
      <defs>
        <linearGradient id={`bl-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={up ? ".55" : ".45"} />
          <stop offset="45%" stopColor={body} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
      </defs>
      {/* tip (candle shadow shaped, not a thread) */}
      <path d="M0 -78 l5.6 12 h-11.2z" fill={body} stroke="#08131f" strokeOpacity=".35" strokeWidth="1.2" />
      {/* upper shadow of the candle = blade spine */}
      <rect x="-2.1" y="-66" width="4.2" height="14" rx="2.1" fill="#E8F2FF" opacity=".85" />
      {/* blade body */}
      <path d="M-8 -52 h16 v30 a8 8 0 0 1 -16 0z" fill={`url(#bl-${id})`} stroke="#08131f" strokeOpacity=".4" strokeWidth="1.4" />
      <rect x="-8" y="-48" width="4" height="22" rx="2" fill="#ffffff" opacity=".35" />
      {/* hilt: ricasso + guard + grip + pommel */}
      <rect x="-6.4" y="-22" width="12.8" height="5" rx="1.6" fill="#C9A15B" />
      <rect x="-15" y="-19" width="30" height="4.4" rx="2.2" fill="#E4C57F" />
      <rect x="-3.4" y="-15" width="6.8" height="18" rx="3" fill="#8A6A3A" />
      <rect x="-3.4" y="-15" width="2.4" height="18" rx="1.2" fill="#D6B576" />
      <circle cx="0" cy="5.4" r="4.4" fill="#E4C57F" />
      <circle cx="0" cy="5.4" r="2" fill="#02502F" />
    </g>
  );
}

export function ArenaEmblem({
  size = 96,
  light = false,
  withShield = true,
  withWordmark = false,
}: { size?: number; light?: boolean; withShield?: boolean; withWordmark?: boolean }) {
  const vw = withWordmark ? 150 : 112;
  return (
    <svg width={size} height={withWordmark ? (size * 74) / vw : size} viewBox={`0 0 ${vw} 74`} aria-hidden="true">
      <defs>
        <linearGradient id="shieldShell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light ? "#233E63" : "#16294A"} />
          <stop offset="100%" stopColor={light ? "#101E36" : "#08131F"} />
        </linearGradient>
        <radialGradient id="arenaHalo" cx=".5" cy=".35" r=".75">
          <stop offset="0%" stopColor="#33C1A1" stopOpacity=".45" />
          <stop offset="100%" stopColor="#33C1A1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="37" cy="34" r="36" fill="url(#arenaHalo)" />
      {withShield && (
        <path d="M37 6 66 15.4v16.9C66 46 55.6 55.5 37 63.6 18.4 55.5 8 46 8 32.3V15.4z"
          fill="url(#shieldShell)" stroke="#4E7BB0" strokeWidth="1.8" />
      )}
      <g transform="translate(37,40)">
        <g transform="rotate(-24)"><CandleBlade up id="up" /></g>
        <g transform="rotate(24) scale(-1,1)"><CandleBlade up={false} id="dn" /></g>
      </g>
      {withWordmark && (
        <text x="76" y="30" fill={light ? "#0B1727" : "#EAF3FF"} fontFamily="Oswald, sans-serif" fontSize="19" fontWeight="600" letterSpacing="1.2">
          SIGNAL
        </text>
      )}
      {withWordmark && (
        <text x="76" y="47" fill="#33C1A1" fontFamily="Oswald, sans-serif" fontSize="14" fontWeight="600" letterSpacing="4.4">
          ARENA
        </text>
      )}
    </svg>
  );
}

export function EmblemCompact({ size = 24, tone = "brand" }: { size?: number; tone?: "brand" | "ghost" }) {
  const a = tone === "brand" ? "#3ECF8E" : "#BFD3EC";
  const b = tone === "brand" ? "#E2605C" : "#8FA6C6";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <g transform="translate(16,17)">
        <g transform="rotate(-26)">
          <path d="M0 -14 l2.6 5.4h-5.2z" fill={a} />
          <rect x="-1" y="-9.4" width="2" height="4" rx="1" fill="#E8F2FF" />
          <rect x="-3.6" y="-5.8" width="7.2" height="10.4" rx="2" fill={a} />
          <rect x="-7" y="5" width="14" height="2" rx="1" fill="#E4C57F" />
          <rect x="-1.4" y="7" width="2.8" height="5" rx="1.4" fill="#C9A15B" />
        </g>
        <g transform="rotate(26) scale(-1,1)">
          <path d="M0 -14 l2.6 5.4h-5.2z" fill={b} />
          <rect x="-1" y="-9.4" width="2" height="4" rx="1" fill="#E8F2FF" />
          <rect x="-3.6" y="-5.8" width="7.2" height="10.4" rx="2" fill={b} />
          <rect x="-7" y="5" width="14" height="2" rx="1" fill="#E4C57F" />
          <rect x="-1.4" y="7" width="2.8" height="5" rx="1.4" fill="#C9A15B" />
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------- ICON TABLE ------------------------------- */
const k = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const k2 = { ...k, strokeWidth: 2.6 };
const f = { fill: "currentColor" };

export const UI_ICONS: Record<string, ReactNode> = {
  /* navigation */
  navAcademy: (<>
    <path d="M4 6.4c2.4-1.1 5-1.6 8-1.6v13c-3 0-5.6.5-8 1.6z" {...f} />
    <path d="M20 6.4c-2.4-1.1-5-1.6-8-1.6v13c3 0 5.6.5 8 1.6z" {...f} opacity=".55" />
    <path d="M12 19.4v1.8" {...k} />
  </>),
  navArena: (<>
    <g transform="translate(12,12.5) rotate(-25)"><rect x="-1.6" y="-9.6" width="3.2" height="6.2" rx="1.6" {...f} /><path d="M-2.6 -3.4h5.2l-1 6.4h-3.2z" {...f} /><path d="M-4.8 3h9.6v1.8h-9.6z" {...f} /></g>
    <g transform="translate(12,12.5) rotate(25)"><rect x="-1.6" y="-9.6" width="3.2" height="6.2" rx="1.6" {...f} opacity=".62" /><path d="M-2.6 -3.4h5.2l-1 6.4h-3.2z" {...f} opacity=".62" /><path d="M-4.8 3h9.6v1.8h-9.6z" {...f} opacity=".62" /></g>
  </>),
  navCollection: (<>
    <rect x="4.6" y="7.4" width="11" height="13.2" rx="2.2" {...f} opacity=".55" transform="rotate(-9 10 14)" />
    <rect x="8.4" y="5" width="11" height="15" rx="2.2" {...f} />
    <path d="M11.4 10.4h5.2M11.4 13.6h3.4" stroke="#16233A" strokeWidth="1.5" strokeLinecap="round" />
  </>),
  navMore: (<>
    <circle cx="5.6" cy="12" r="2.2" {...f} /><circle cx="12" cy="12" r="2.2" {...f} /><circle cx="18.4" cy="12" r="2.2" {...f} />
  </>),
  /* decisions */
  enter: (<>
    <rect x="4" y="3.6" width="15.6" height="16.8" rx="3" {...k} />
    <path d="M11.8 17V7.4" {...k2} /><path d="M8.2 11.6l3.6-4.2 3.6 4.2" {...k2} />
  </>),
  wait: (<>
    <path d="M6.6 4h10.8M6.6 20h10.8" {...k} />
    <path d="M7.6 4c0 5.4 8.8 5.6 8.8 0" {...k} opacity=".85" />
    <path d="M16.4 20c0-5.4-8.8-5.6-8.8 0" {...f} />
    <path d="M4.4 21.8h15.2" {...k} opacity=".6" />
  </>),
  tfStack: (<>
    <rect x="7.2" y="4.4" width="12.4" height="7.4" rx="2" {...k} />
    <rect x="4.4" y="9.6" width="15.2" height="10" rx="2.4" {...f} />
    <path d="M7.6 19.6h5" stroke="#16233A" strokeWidth="1.5" strokeLinecap="round" />
  </>),
  sizeUp: (<>
    <rect x="4.4" y="13" width="3.6" height="7" rx="1.2" {...f} opacity=".7" />
    <rect x="10.2" y="9" width="3.6" height="11" rx="1.2" {...f} />
    <rect x="16" y="5.4" width="3.6" height="14.6" rx="1.2" {...f} />
    <path d="M4.6 19.6h14.6" {...k} opacity=".5" />
  </>),
  skip: (<>
    <path d="M12 3.4 20.6 12 12 20.6 3.4 12z" {...k} />
    <path d="M7.6 7.6l8.8 8.8" {...k2} />
  </>),
  /* flares */
  target: (<><circle cx="12" cy="12" r="8.4" {...k} /><circle cx="12" cy="12" r="4.2" {...k} opacity=".7" /><circle cx="12" cy="12" r="1.6" {...f} /></>),
  glasses: (<><circle cx="10.4" cy="10.4" r="6.2" {...k} /><path d="M15 15l5 5" {...k2} /></>),
  shield: (<><path d="M12 3.4l8 3.2v5.8c0 4.4-3.2 7.6-8 9.8-4.8-2.2-8-5.4-8-9.8V6.6z" {...k} /><path d="M9 12.4l2.4 2.6 4-5.2" {...k2} /></>),
  clockLock: (<><circle cx="11" cy="10.6" r="7.6" {...k} /><path d="M11 6.4v4.6l3.2 2" {...k} /><rect x="14.6" y="14.6" width="6.6" height="6" rx="1.6" {...f} /><path d="M16.2 14.4v-1.4a1.7 1.7 0 0 1 3.4 0v1.4" {...k} /></>),
  flame: (<><path d="M12 3.2c3.4 3.4 6 6 6 9.6a6 6 0 0 1-12 0c0-2.2 1-4 2.6-5.6.6 1.6 1.6 2.4 2.6 2.6-.8-2.4-.6-4.6.8-6.6z" {...f} /></>),
  crown: (<><path d="M3.6 8.2l3.6 8h9.6l3.6-8-5 3.4L12 5.6 8.6 11.6z" {...f} /><rect x="4.6" y="17.4" width="14.8" height="2.6" rx="1.3" {...f} /></>),
  trophy: (<><path d="M7.4 4.6h9.2v5.6a4.6 4.6 0 0 1-9.2 0z" {...f} /><path d="M7.4 6H5a3.2 3.2 0 0 0 3 3.4M16.6 6H19a3.2 3.2 0 0 1-3 3.4" {...k} /><path d="M10.6 14.6h2.8v3h-2.8z" {...f} /><rect x="7.4" y="17.6" width="9.2" height="2.6" rx="1.3" {...f} /></>),
  medal: (<><circle cx="12" cy="14.4" r="5.6" {...f} /><path d="M8.6 3.6l3 6M15.4 3.6l-3 6" {...k2} /><path d="M12 12l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" fill="#16233A" /></>),
  calendar: (<><rect x="3.8" y="6" width="16.4" height="14" rx="2.6" {...k} /><path d="M3.8 10.4h16.4" {...k} /><path d="M8 3.6v4M16 3.6v4" {...k2} /></>),
  news: (<><rect x="4.6" y="4.6" width="14.8" height="14.8" rx="2.4" {...k} /><path d="M8 9h8M8 12.4h8M8 15.8h4.6" {...k} /></>),
  whale: (<>
    <path d="M4.2 15.6c0-4.6 4-8 8.8-8 3.6 0 5.8 1.6 7 3.6 1.4 2.4-0.2 3.4 1.4 2.6l1.6-1.8v5.6c0 3.2-3.2 5.6-7.4 5.6-3 0-5-1-6.4-2.6" {...f} />
    <path d="M20 11.2c1.8-.2 3.2.6 3.6 2.2" {...k} />
    <path d="M8.6 9.4c0 1.4.4 2.6 1.2 3.6" stroke="#16233A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M6.6 20c1.8 1 3.8 1.4 6.2 1.2" {...k} opacity=".55" />
  </>),
  chain: (<><circle cx="8" cy="16" r="3.6" {...k} /><circle cx="16" cy="8" r="3.6" {...k} /><path d="M10.4 13.6l3.2-3.2" {...k2} /></>),
  globe: (<><circle cx="12" cy="12" r="8.4" {...k} /><path d="M3.6 12h16.8" {...k} /><path d="M12 3.6c3.2 2.6 3.2 14.2 0 16.8-3.2-2.6-3.2-14.2 0-16.8z" {...k} /></>),
  layers: (<><path d="M12 3.6l8 4-8 4-8-4z" {...f} /><path d="M4 12l8 4 8-4" {...k} /><path d="M4 16.2l8 4 8-4" {...k} opacity=".6" /></>),
  ruler: (<><rect x="2.8" y="8.4" width="18.4" height="7.2" rx="2" {...f} /><path d="M7 8.6v3M10.4 8.6v4.4M13.8 8.6v3M17.2 8.6v4.4" stroke="#16233A" strokeWidth="1.5" strokeLinecap="round" /></>),
  scale: (<><path d="M12 4.6v14" {...k} /><path d="M5 9.4h14" {...k} /><path d="M5 9.4l-2.6 5h5.2z" {...f} /><path d="M19 9.4l2.6 5h-5.2z" {...f} /><rect x="8.4" y="18.4" width="7.2" height="2.4" rx="1.2" {...f} /></>),
  brain: (<><path d="M12 4.6c2.6 0 4.4 1.6 4.6 3.6 2 .4 3.4 2 3.4 4s-1 3.2-2.4 3.8c0 2.4-2 4.4-5.6 4.4s-5.6-2-5.6-4.4C5 15.4 4 13.8 4 11.8s1.4-3.6 3.4-4C7.6 6.2 9.4 4.6 12 4.6z" {...k} /><path d="M12 6v13" {...k} opacity=".6" /></>),
  eye: (<><path d="M12 5.6c4.6 0 8.2 3 9.4 6.4-1.2 3.4-4.8 6.4-9.4 6.4S3.8 15.4 2.6 12C3.8 8.6 7.4 5.6 12 5.6z" {...f} /><circle cx="12" cy="12" r="2.6" fill="#16233A" /></>),
  magnet: (<><path d="M6 12a6 6 0 0 1 12 0v6h-4v-6a2 2 0 0 0-4 0v6H6z" {...f} /><rect x="6" y="15.4" width="4" height="2.6" fill="#16233A" /><rect x="14" y="15.4" width="4" height="2.6" fill="#16233A" /></>),
  filter: (<><path d="M3.6 5.4h16.8l-6.4 7.4v5.6l-4-2.4V12.8z" {...f} /></>),
  key: (<><circle cx="8.6" cy="12" r="4" {...k} /><path d="M12.4 12H21M18 12v3.4M15.4 12v2.4" {...k2} /></>),
  snow: (<><path d="M12 3.4v17.2M5 7.8l14 8.4M19 7.8L5 16.2" {...k} /><circle cx="12" cy="12" r="2" {...f} /></>),
  spark: (<><path d="M12 3l2.2 6.2L20.4 12l-6.2 2.8L12 21l-2.2-6.2L3.6 12l6.2-2.8z" {...f} /></>),
  doc: (<><path d="M6.4 3.8h7l4.2 4.2v12.2H6.4z" {...k} /><path d="M13.2 3.8v4.4h4.4" {...k} /><path d="M9 12h6M9 15.4h4" {...k} opacity=".7" /></>),
  chartLine: (<><path d="M3.6 20.4V3.6" {...k} opacity=".5" /><path d="M3.6 20.4h16.8" {...k} opacity=".5" /><path d="M6 16.6l3.6-4.4 3 2.4 5.4-7" {...k2} /><path d="M15.6 7.4h3.4V11" {...k2} /></>),
  pulse: (<><path d="M2.6 12h4l2-5 3 11 2.6-7 1.6 3h5.6" {...k2} /></>),
  gauge: (<><path d="M4 16.6a8 8 0 0 1 16 0" {...k} /><path d="M12 16.6l4.6-5.2" {...k2} /><path d="M6.4 18.6h11.2" {...k} opacity=".6" /></>),
  bubble: (<><path d="M4.4 6.4A2.4 2.4 0 0 1 6.8 4h10.4a2.4 2.4 0 0 1 2.4 2.4v6.4a2.4 2.4 0 0 1-2.4 2.4H10l-5.6 4z" {...f} /><circle cx="8.6" cy="9.6" r="1.1" fill="#16233A" /><circle cx="12" cy="9.6" r="1.1" fill="#16233A" /><circle cx="15.4" cy="9.6" r="1.1" fill="#16233A" /></>),
  ban: (<><circle cx="12" cy="12" r="8.4" {...k} /><path d="M6.4 6.4l11.2 11.2" {...k2} /></>),
  check: (<><path d="M5 12.8l4.6 4.6L19.4 7" {...k2} /></>),
  cross: (<><path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" {...k2} /></>),
  chevron: (<><path d="M9 5.6l6 6.4-6 6.4" {...k2} /></>),
  lock: (<><rect x="5" y="10.4" width="14" height="9.4" rx="2.4" {...f} /><path d="M8.4 10.2V8a3.6 3.6 0 0 1 7.2 0v2.2" {...k} /></>),
  play: (<><path d="M7 4.6l12 7.4-12 7.4z" {...f} /></>),
  scrub: (<><rect x="4.6" y="8.6" width="3" height="6.8" rx="1.2" {...f} /><rect x="9.4" y="5.6" width="3" height="12.8" rx="1.2" {...f} /><rect x="14.2" y="7.6" width="3" height="8.8" rx="1.2" {...f} /><path d="M4 19.4h15.6" {...k} opacity=".5" /></>),
  wave: (<><path d="M2.8 15c2 0 2.6-6 4.6-6s2.6 6 4.6 6 2.6-6 4.6-6 2.6 6 4.6 6" {...k2} /></>),
  box: (<><path d="M4 7.6L12 4l8 3.6v8.8L12 20l-8-3.6z" {...k} /><path d="M4 7.6l8 3.6 8-3.6M12 11.2V20" {...k} opacity=".7" /></>),
  hand: (<><path d="M9 11.4V5.6a1.6 1.6 0 0 1 3.2 0v5.2" {...k} /><path d="M12.2 10.8V4.8a1.6 1.6 0 0 1 3.2 0v6.6" {...k} /><path d="M15.4 11.6V7.6a1.6 1.6 0 0 1 3.2 0v9.4a4.6 4.6 0 0 1-4.6 4.6h-2.4l-4-3.4a1.7 1.7 0 0 1 2.4-2.4l1.6 1.4" {...k} /></>),
  info: (<><circle cx="12" cy="12" r="8.4" {...k} /><path d="M12 10.6V16.4" {...k2} /><circle cx="12" cy="7.8" r="1.2" {...f} /></>),
  sound: (<><path d="M4.4 9.6h3.2L12 5.6v12.8L7.6 14H4.4z" {...f} /><path d="M15 9c1.8 1.8 1.8 4.4 0 6.2M17.6 6.4c3 3 3 7.6 0 10.6" {...k} /></>),
  vibrate: (<><rect x="8.4" y="4.4" width="7.2" height="15.2" rx="2.2" {...f} /><path d="M4.6 9v6M2.4 10.6v2.8M19.4 9v6M21.6 10.6v2.8" {...k} /></>),
  palette: (<><path d="M12 3.6c4.8 0 8.4 3.4 8.4 7.6 0 2.8-2.2 4-4.4 4h-1.6c-1.2 0-2.2 1-2.2 2.2 0 .6.2 1 .2 1.6 0 1-.8 1.8-1.8 1.8C6 20.8 3.6 16.8 3.6 12.4 3.6 7.6 7.2 3.6 12 3.6z" {...k} /><circle cx="8.4" cy="10" r="1.6" {...f} /><circle cx="12" cy="7.6" r="1.6" {...f} /><circle cx="15.6" cy="10" r="1.6" {...f} /></>),
  user: (<><circle cx="12" cy="8.4" r="4" {...f} /><path d="M4.6 20.4c1.4-3.6 4-5.4 7.4-5.4s6 1.8 7.4 5.4z" {...f} /></>),
  boltSmall: (<><path d="M13.6 3.4L6.4 13.2h4.4l-1.2 7.4 7.4-10h-4.4z" {...f} /></>),
  seal: (<><circle cx="12" cy="10" r="6" {...k} /><path d="M8.6 9.6l2.4 2.6 4-4.6" {...k2} /><path d="M9 15.6L7.4 21l4.6-2.4L16.6 21 15 15.6" {...k} /></>),
  archive: (<><rect x="3.6" y="4.6" width="16.8" height="4.6" rx="1.6" {...f} /><rect x="5.4" y="10" width="13.2" height="9.6" rx="1.8" {...k} /><path d="M9.4 13.4h5.2M9.4 16h3.2" {...k} opacity=".7" /></>),
  radar: (<><path d="M12 3.6a8.4 8.4 0 1 0 8.4 8.4" {...k} /><path d="M12 12l6-6" {...k2} /><path d="M12 12a4 4 0 1 0 4 4" {...k} opacity=".7" /></>),
  chains: (<><rect x="3.8" y="9" width="7" height="6" rx="3" {...k} /><rect x="13.2" y="9" width="7" height="6" rx="3" {...k} /><path d="M10.8 12h2.4" {...k2} /></>),
  gate: (<><path d="M4.6 19.6V6.4L12 3.6l7.4 2.8v13.2" {...k} /><path d="M4.6 12h14.8" {...k} opacity=".6" /><rect x="10.6" y="9.4" width="3" height="5.2" rx="1.2" {...f} /></>),
};

export type IconName = keyof typeof UI_ICONS;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: "none" }}>
      {UI_ICONS[name]}
    </svg>
  );
}
