import type { ReactNode, SVGProps } from "react";

type IP = SVGProps<SVGSVGElement>;

/* ============================================================
   CANONICAL TOP BAR ICONS (100% SVG, NO EMOJI)
   ============================================================ */

export function IconLightning(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M13 2 4.5 13.2c-.4.6 0 1.3.7 1.3H10l-1.2 7.1c-.1.8.9 1.2 1.4.6L20 10.9c.4-.6 0-1.3-.7-1.3H14l1.3-6.9c.1-.8-.9-1.2-1.3-.7Z" />
    </svg>
  );
}

export function IconStar(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function IconCoin(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <path
        d="M12 6.5v11M9.5 8.8c0-1.2 1.1-2 2.5-2s2.5.8 2.5 2-1 1.8-2.5 1.8-2.5.7-2.5 1.9 1.1 2 2.5 2 2.5-.8 2.5-2"
        stroke="#111827"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconBell(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  );
}

export function IconGear(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M19.4 13a7.8 7.8 0 0 0 0-2l2.1-1.6a.5.5 0 0 0 .1-.6l-2-3.5a.5.5 0 0 0-.6-.2l-2.5 1a7.6 7.6 0 0 0-1.7-1l-.4-2.6a.5.5 0 0 0-.5-.4h-4a.5.5 0 0 0-.5.4l-.4 2.6c-.6.3-1.2.6-1.7 1l-2.5-1a.5.5 0 0 0-.6.2l-2 3.5a.5.5 0 0 0 .1.6L4.6 11a7.8 7.8 0 0 0 0 2l-2.1 1.6a.5.5 0 0 0-.1.6l2 3.5a.5.5 0 0 0 .6.2l2.5-1c.5.4 1.1.7 1.7 1l.4 2.6c0 .3.2.4.5.4h4c.3 0 .5-.2.5-.4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.5 1a.5.5 0 0 0 .6-.2l2-3.5a.5.5 0 0 0-.1-.6L19.4 13ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
    </svg>
  );
}

/* ============================================================
   GAMEPLAY & HUD ICONS (100% SVG, NO EMOJI)
   ============================================================ */

export function IconWhale(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M19.5 9c-.5-1.5-1.8-2.6-3.5-2.8-.5-.8-1.5-1.2-2.5-1v1.2c.4 0 .9.3 1.1.7-1.8.2-3.3 1.5-3.8 3.3-1.6.2-3.3.9-4.5 2.1-1.3 1.3-2 3-1.8 4.8.2 1.3.9 2.4 2 3.1 1.1.7 2.4 1 3.7.8 2.3-.3 4.5-1.4 6.2-3 1.8-.2 3.4-1.2 4.2-2.8.5-1 .4-2.2-.1-3.2-.2-.4-.6-.8-1-1zm-11 5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm12.3-1.8c-.5 1-1.5 1.6-2.6 1.7.3-1.1.2-2.3-.3-3.3.8.3 1.4.9 1.8 1.6z" />
    </svg>
  );
}

export function IconSpeech(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
    </svg>
  );
}

export function IconPadlock(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

export function IconSwords(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
      <path d="M13 19l6-6" />
      <path d="M16 16l4 4" />
      <path d="M19 21l2-2" />
      <path d="M9.5 6.5L21 18v3h-3L6.5 9.5" />
      <path d="M5 8l6 6" />
    </svg>
  );
}

export function IconGraduationCap(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3Zm0 13.5L5 12.68V17c0 3.31 3.13 6 7 6s7-2.69 7-6v-4.32l-7 3.82Z" />
    </svg>
  );
}

export function IconCardDeck(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6Zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm0 14H8V4h12v12Z" />
    </svg>
  );
}

export function IconCrown(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M5 19h14v2H5v-2zm14.5-14L15 9.5 12 4 9 9.5 4.5 5 6 17h12l1.5-12z" />
    </svg>
  );
}

export function IconTrophy(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H8v2h8v-2h-3v-3.1c1.8-.3 3.3-1.6 3.61-3.41C19.08 12.18 21 10.1 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

export function IconBooster(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="5" y="3" width="14" height="18" rx="3" fill="currentColor" fillOpacity="0.2" />
      <path d="M5 7h14M5 17h14M12 9v6M9 12h6" />
    </svg>
  );
}

export function IconAvatarFrame(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="12" cy="12" r="9" strokeWidth="2.5" strokeDasharray="4 2" />
      <circle cx="12" cy="10" r="3" fill="currentColor" />
      <path d="M7 18c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" fill="currentColor" />
    </svg>
  );
}

export function IconTarget(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  );
}

export function IconCheckmark(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function IconShield(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

export function IconHourglass(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...p}>
      <path d="M5 22h14M5 2h14M17 22v-4.5a5 5 0 0 0-2.5-4.3L12 11.5l-2.5 1.7A5 5 0 0 0 7 17.5V22M7 2v4.5a5 5 0 0 0 2.5 4.3l2.5 1.7 2.5-1.7A5 5 0 0 0 17 6.5V2" />
    </svg>
  );
}

export function IconWarning(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2 1 21h22L12 2Zm0 4.5 7.5 13H4.5L12 6.5ZM11 10v4h2v-4h-2Zm0 6v2h2v-2h-2Z" />
    </svg>
  );
}

export function IconCandleChart(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M7 3v3H5v10h2v5h2V16h2V6H9V3H7Zm8 5v3h-2v6h2v4h2v-4h2v-6h-2V8h-2Z" />
    </svg>
  );
}

export function IconOrderBook(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
    </svg>
  );
}

export function IconCalendar(p: IP) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V9h14v11Z" />
    </svg>
  );
}

/* ============================================================
   AUTHENTIC HAND-DRAWN SMILEY 🙂 & GRAFFITI QUOTE
   Matching user reference photo: "IF YOU'RE HERE, JUST FOR MONEY..."
   ============================================================ */

export function HandDrawnSmiley({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M18 3.5C9.8 3.2 3.6 9.8 3.4 18c-.2 8.3 6.1 14.7 14.5 14.6 8.2-.1 14.7-6.5 14.6-14.8C32.4 9.6 26.2 3.7 18 3.5z" />
      <circle cx="12.5" cy="13.5" r="1.8" fill="currentColor" />
      <circle cx="23.5" cy="13.5" r="1.8" fill="currentColor" />
      <path d="M10.8 21.2c2.2 4.2 12.2 4.2 14.4 0" />
    </svg>
  );
}

export function TraderGraffitiQuote({ className }: { className?: string }) {
  return (
    <div
      className={`relative select-none ${className ?? ""}`}
      style={{
        fontFamily: "'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive",
        color: "#26e6c8",
        textShadow: "0 0 10px rgba(38,230,200,0.45)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="text-[14.5px] sm:text-[15.5px] font-bold leading-[1.12] tracking-wide">
          IF YOU'RE HERE, JUST FOR MONEY, YOU'RE EARLY. AND THAT'S BAD.
        </div>
        <HandDrawnSmiley className="h-7 w-7 shrink-0 text-[#26e6c8]" />
      </div>
    </div>
  );
}

/* ============================================================
   SKILL CARD SVG ICONS (c01–c40)
   ============================================================ */

const S = {
  fill: "#fff" as const,
  stroke: "#fff" as const,
};

const skillPaths: Record<string, ReactNode> = {
  c01: (
    <>
      <path d="M6 22 12 15l4 3 7-9" stroke={S.stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="23" cy="9" r="2.4" fill={S.fill} />
    </>
  ),
  c02: (
    <>
      <rect x="7" y="14" width="4" height="9" rx="1.2" fill={S.fill} />
      <rect x="14" y="9" width="4" height="14" rx="1.2" fill={S.fill} />
      <rect x="21" y="6" width="4" height="17" rx="1.2" fill={S.fill} />
    </>
  ),
  c03: (
    <>
      <rect x="13" y="8" width="6" height="16" rx="1.6" fill={S.fill} />
      <path d="M16 5v3M16 24v3" stroke={S.stroke} strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  c04: (
    <>
      <path d="M6 23h20" stroke={S.stroke} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9 20l4-6 4 3 6-9" stroke={S.stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  c05: (
    <>
      <circle cx="16" cy="16" r="9" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <path d="M16 16 16 9M16 16l5 3" stroke={S.stroke} strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  c06: (
    <>
      <path d="M7 16h5l2-6 4 12 2-6h5" stroke={S.stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  c07: (
    <>
      <path d="M6 20l6-4 5 3 9-8" stroke={S.stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 5" />
      <circle cx="26" cy="11" r="2.4" fill={S.fill} />
    </>
  ),
  c08: (
    <>
      <rect x="7" y="7" width="18" height="18" rx="3" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <path d="M11 18l4-4 3 2 4-5" stroke={S.stroke} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  c09: (
    <>
      <path d="M16 5v22M8 12l8-7 8 7" stroke={S.stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  c10: (
    <>
      <path d="M16 27V5M8 21l8 6 8-6" stroke={S.stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  c11: (
    <>
      <circle cx="16" cy="16" r="4" fill={S.fill} />
      <path d="M16 4v4M16 24v4M4 16h4M24 16h4" stroke={S.stroke} strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  c12: (
    <>
      <path d="M6 22h20M6 22V9M11 22v-6M16 22v-9M21 22V7M26 22V12" stroke={S.stroke} strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  c13: (
    <>
      <path d="M8 23l6-13 4 7 6-11" stroke={S.stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="23" r="2.2" fill={S.fill} />
    </>
  ),
  c14: (
    <>
      <rect x="6" y="13" width="20" height="6" rx="3" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <circle cx="12" cy="16" r="2.4" fill={S.fill} />
    </>
  ),
  c15: (
    <>
      <path d="M16 6a10 10 0 1 0 0.01 0Z" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <path d="M16 16l4-4" stroke={S.stroke} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="16" r="1.8" fill={S.fill} />
    </>
  ),
  c16: (
    <>
      <path d="M16 5 5 25h22L16 5Z" stroke={S.stroke} strokeWidth="2.2" fill="none" strokeLinejoin="round" />
      <path d="M16 13v5" stroke={S.stroke} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="21.5" r="1.4" fill={S.fill} />
    </>
  ),
  c17: (
    <>
      <circle cx="16" cy="16" r="10" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <path d="M16 10v6l4 3" stroke={S.stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  c18: (
    <>
      <rect x="8" y="12" width="16" height="12" rx="2.4" fill={S.fill} />
      <path d="M11 12v-2a5 5 0 0 1 10 0v2" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <circle cx="16" cy="18" r="1.8" fill="var(--card-yellow)" />
    </>
  ),
  c19: (
    <>
      <path d="M6 16h6l2-5 4 10 2-5h6" stroke={S.stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  c20: (
    <>
      <circle cx="16" cy="16" r="10" stroke={S.stroke} strokeWidth="2.2" fill="none" strokeDasharray="4 3" />
      <path d="M12 16l3 3 6-6" stroke={S.stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  c21: (
    <>
      <path d="M8 8v16M24 8v16" stroke={S.stroke} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M13 12l6 8M19 12l-6 8" stroke={S.stroke} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  c22: (
    <>
      <path d="M6 20h20l-4-6-4 3-3-6-5 9Z" fill={S.fill} />
      <circle cx="24" cy="9" r="2.4" fill={S.fill} />
    </>
  ),
  c23: (
    <>
      <rect x="9" y="6" width="14" height="20" rx="3" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <path d="M16 10v6M16 20h.01" stroke={S.stroke} strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  c24: (
    <>
      <circle cx="16" cy="16" r="10" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <path d="M16 16 22 12M16 16v7" stroke={S.stroke} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="1.6" fill={S.fill} />
    </>
  ),
  c25: (
    <>
      <circle cx="13" cy="13" r="6" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <path d="M17.5 17.5 25 25" stroke={S.stroke} strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  c26: (
    <>
      <path d="M16 6c5 4 6 8 6 12a6 6 0 0 1-12 0c0-4 1-8 6-12Z" fill={S.fill} />
      <circle cx="16" cy="18" r="2.4" fill="var(--card-blue)" />
    </>
  ),
  c27: (
    <>
      <circle cx="16" cy="16" r="10" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <path d="M6 16h20M16 6c3 3 3 17 0 20M16 6c-3 3-3 17 0 20" stroke={S.stroke} strokeWidth="1.6" fill="none" />
    </>
  ),
  c28: (
    <>
      <path d="M8 22V6l8 4 8-4v16l-8-4-8 4Z" stroke={S.stroke} strokeWidth="2.2" fill="none" strokeLinejoin="round" />
      <path d="M16 10v12" stroke={S.stroke} strokeWidth="1.6" strokeDasharray="3 3" />
    </>
  ),
  c29: (
    <>
      <circle cx="11" cy="12" r="4" fill={S.fill} />
      <circle cx="21" cy="12" r="4" fill={S.fill} />
      <path d="M5 25c0-4 2.6-6 6-6s6 2 6 6M15 25c0-4 2.6-6 6-6s6 2 6 6" stroke={S.stroke} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  c30: (
    <>
      <path d="M6 24l7-8 4 3 9-11" stroke={S.stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 8h6v6" stroke={S.stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  c31: (
    <>
      <rect x="6" y="9" width="20" height="14" rx="3" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <path d="M6 14h20M11 9V6M21 9V6" stroke={S.stroke} strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  c32: (
    <>
      <circle cx="16" cy="16" r="3" fill={S.fill} />
      <ellipse cx="16" cy="16" rx="11" ry="5" stroke={S.stroke} strokeWidth="1.8" fill="none" />
      <ellipse cx="16" cy="16" rx="5" ry="11" stroke={S.stroke} strokeWidth="1.8" fill="none" transform="rotate(60 16 16)" />
    </>
  ),
  c33: (
    <>
      <path d="M16 5l9 5v6c0 6-4 9-9 11-5-2-9-5-9-11v-6l9-5Z" stroke={S.stroke} strokeWidth="2.2" fill="none" strokeLinejoin="round" />
      <path d="M12 16l3 3 5-6" stroke={S.stroke} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  c34: (
    <>
      <circle cx="16" cy="16" r="10" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <path d="M11 11l10 10M21 11 11 21" stroke={S.stroke} strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  c35: (
    <>
      <path d="M6 9l6 5-6 5M26 9l-6 5 6 5" stroke={S.stroke} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 23l4-14" stroke={S.stroke} strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  c36: (
    <>
      <path d="M16 6 6 24h20L16 6Z" fill={S.fill} />
      <path d="M16 13v5" stroke="var(--card-red)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="16" cy="21" r="1.3" fill="var(--card-red)" />
    </>
  ),
  c37: (
    <>
      <path d="M8 8l6 8-6 8M24 8l-6 8 6 8" stroke={S.stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  c38: (
    <>
      <rect x="7" y="7" width="18" height="18" rx="4" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <path d="M16 8v16" stroke={S.stroke} strokeWidth="2" strokeDasharray="3 3" />
      <path d="M20 13l-4 5-4-3" stroke={S.stroke} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  c39: (
    <>
      <path d="M6 10l10 12L26 10" stroke={S.stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 22v4" stroke={S.stroke} strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  c40: (
    <>
      <circle cx="16" cy="16" r="10" stroke={S.stroke} strokeWidth="2.2" fill="none" />
      <path d="M12 20c1.5-2 6.5-2 8 0M12 13h.01M20 13h.01" stroke={S.stroke} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </>
  ),
};

export function SkillIcon({ id, className, style }: { id: string; className?: string; style?: React.CSSProperties }) {
  const path = skillPaths[id] ?? skillPaths.c01;
  return (
    <svg viewBox="0 0 32 32" className={className} style={style} aria-hidden>
      {path}
    </svg>
  );
}

export const SKILL_IDS = Object.keys(skillPaths);
