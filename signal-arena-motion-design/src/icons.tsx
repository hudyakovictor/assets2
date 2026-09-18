/* =========================================================================
   SIGNAL ARENA — ICON SYSTEM
   All icons hand-drawn as SVG. No emoji. No external icon library.
   Motif (brand.md): japanese candle body + blade silhouette, arena shield.
   Skill icons: viewBox 48x48, outer ring, hybrid filled-outline,
   white semantic masses + white outline details, teal negative space.
   ========================================================================= */

type P = { className?: string };
const S = 'currentColor';

/* ---------- shared skill-icon frame ---------- */
function Glyph({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke={S}
      strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="24" cy="24" r="20.5" strokeWidth={1.6} opacity={0.55} />
      {children}
    </svg>
  );
}

/* ================= GREEN c01–c15 — ANALYSIS ================= */
export const C01 = (p: P) => (<Glyph {...p}><path d="M13 31l6-7 5 4 5-8 6 6" /><circle cx="19" cy="24" r="2.2" fill={S} stroke="none" /><circle cx="34" cy="26" r="2.2" fill={S} stroke="none" /><path d="M13 36h22" opacity={0.5} /></Glyph>);
export const C02 = (p: P) => (<Glyph {...p}><rect x="12" y="20" width="7" height="12" rx="1.6" fill={S} stroke="none" /><rect x="22" y="15" width="7" height="17" rx="1.6" fill={S} stroke="none" opacity={0.85} /><rect x="32" y="11" width="7" height="21" rx="1.6" fill="none" /><path d="M12 36h27" opacity={0.5} /></Glyph>);
export const C03 = (p: P) => (<Glyph {...p}><rect x="13" y="26" width="5" height="10" rx="1.3" fill={S} stroke="none" /><rect x="21" y="20" width="5" height="16" rx="1.3" fill={S} stroke="none" /><rect x="29" y="24" width="5" height="12" rx="1.3" fill="none" /><path d="M13 16l8-4 7 5 6-4" /></Glyph>);
export const C04 = (p: P) => (<Glyph {...p}><path d="M12 18h24M12 24h24M12 30h24" opacity={0.45} /><rect x="14" y="15" width="12" height="6" rx="1.4" fill={S} stroke="none" /><rect x="24" y="27" width="11" height="6" rx="1.4" fill={S} stroke="none" opacity={0.8} /></Glyph>);
export const C05 = (p: P) => (<Glyph {...p}><path d="M12 30c3-10 5 8 8-4s5 10 8-2 4 6 8 0" /><circle cx="36" cy="24" r="2" fill={S} stroke="none" /></Glyph>);
export const C06 = (p: P) => (<Glyph {...p}><path d="M12 32l7-9 5 5 6-11" /><path d="M12 26l7 6 5-4 6 7" opacity={0.45} /><circle cx="33" cy="18" r="2.4" fill={S} stroke="none" /></Glyph>);
export const C07 = (p: P) => (<Glyph {...p}><path d="M11 24h6l3-8 4 16 4-11 3 3h6" /><circle cx="24" cy="24" r="14" opacity={0.3} strokeWidth={1.4} /></Glyph>);
export const C08 = (p: P) => (<Glyph {...p}><rect x="12" y="14" width="20" height="20" rx="2.4" fill="none" /><path d="M16 20h9M16 25h9M16 30h6" opacity={0.75} /><path d="M32 20h4v12a2 2 0 01-4 0z" fill={S} stroke="none" opacity={0.9} /></Glyph>);
export const C09 = (p: P) => (<Glyph {...p}><path d="M13 16h16a3 3 0 013 3v8a3 3 0 01-3 3H21l-6 5v-5h-2a3 3 0 01-3-3v-8a3 3 0 013-3z" fill={S} stroke="none" opacity={0.92} /><circle cx="18" cy="23" r="1.5" fill="#06090f" stroke="none" /><circle cx="23" cy="23" r="1.5" fill="#06090f" stroke="none" /><circle cx="28" cy="23" r="1.5" fill="#06090f" stroke="none" /></Glyph>);
export const C10 = (p: P) => (<Glyph {...p}><circle cx="24" cy="24" r="12" strokeWidth={1.8} /><path d="M12 24h24M24 12c4 5 4 19 0 24M24 12c-4 5-4 19 0 24" opacity={0.6} /><circle cx="30" cy="18" r="2.4" fill={S} stroke="none" /></Glyph>);
export const C11 = (p: P) => (<Glyph {...p}><path d="M13 30c6 0 6-12 11-12s5 12 11 12" /><circle cx="13" cy="30" r="2.6" fill={S} stroke="none" /><circle cx="35" cy="30" r="2.6" fill={S} stroke="none" /><circle cx="24" cy="18" r="2.6" fill={S} stroke="none" /></Glyph>);
export const C12 = (p: P) => (<Glyph {...p}><circle cx="24" cy="24" r="11" strokeWidth={1.8} /><path d="M24 13a11 11 0 0110.4 7.4L24 24z" fill={S} stroke="none" opacity={0.9} /><path d="M24 24l-9.5 5.6" opacity={0.6} /></Glyph>);
export const C13 = (p: P) => (<Glyph {...p}><rect x="12" y="15" width="24" height="20" rx="2.6" /><path d="M12 21h24" /><rect x="16" y="25" width="5" height="5" rx="1" fill={S} stroke="none" /><rect x="25" y="25" width="5" height="5" rx="1" fill={S} stroke="none" opacity={0.6} /><path d="M17 12v5M31 12v5" /></Glyph>);
export const C14 = (p: P) => (<Glyph {...p}><path d="M24 12l11 5v8c0 6-4.6 10-11 12-6.4-2-11-6-11-12v-8z" /><path d="M24 19v7" strokeWidth={2.6} /><circle cx="24" cy="30" r="1.8" fill={S} stroke="none" /></Glyph>);
export const C15 = (p: P) => (<Glyph {...p}><circle cx="21" cy="21" r="8" strokeWidth={2} /><path d="M27 27l7 7" strokeWidth={2.6} /><path d="M18 21l2.4 2.6L25 18" strokeWidth={2.2} /></Glyph>);

/* ================= YELLOW c16–c24 — EXECUTION ================= */
export const C16 = (p: P) => (<Glyph {...p}><path d="M24 34V15" strokeWidth={2.8} /><path d="M17 22l7-7 7 7" strokeWidth={2.8} /><path d="M15 37h18" opacity={0.5} /></Glyph>);
export const C17 = (p: P) => (<Glyph {...p}><circle cx="24" cy="24" r="11" strokeWidth={1.9} /><path d="M24 17v7l5 3" strokeWidth={2.4} /><path d="M33 13l3-3M15 13l-3-3" opacity={0.5} /></Glyph>);
export const C18 = (p: P) => (<Glyph {...p}><rect x="12" y="20" width="24" height="9" rx="2" fill={S} stroke="none" opacity={0.25} /><path d="M12 20h24M12 29h24" strokeWidth={2.4} /><path d="M24 14v4M24 31v4" /><circle cx="24" cy="24.5" r="2.4" fill={S} stroke="none" /></Glyph>);
export const C19 = (p: P) => (<Glyph {...p}><path d="M16 16l16 16M32 16L16 32" strokeWidth={2.8} /><circle cx="24" cy="24" r="13" opacity={0.35} strokeWidth={1.5} /></Glyph>);
export const C20 = (p: P) => (<Glyph {...p}><path d="M11 28h26" strokeWidth={2.8} /><rect x="19" y="14" width="10" height="11" rx="2" fill={S} stroke="none" opacity={0.9} /><path d="M15 33l4 4M33 33l-4 4" opacity={0.5} /></Glyph>);
export const C21 = (p: P) => (<Glyph {...p}><circle cx="24" cy="24" r="11" strokeWidth={1.8} /><circle cx="24" cy="24" r="6" strokeWidth={1.8} /><circle cx="24" cy="24" r="2.4" fill={S} stroke="none" /><path d="M24 9v5M24 34v5M9 24h5M34 24h5" /></Glyph>);
export const C22 = (p: P) => (<Glyph {...p}><path d="M14 33V20M24 33V14M34 33V24" strokeWidth={2.8} /><path d="M11 36h26" opacity={0.5} /><circle cx="24" cy="14" r="2.6" fill={S} stroke="none" /></Glyph>);
export const C23 = (p: P) => (<Glyph {...p}><rect x="13" y="26" width="6" height="8" rx="1.4" fill={S} stroke="none" /><rect x="21" y="21" width="6" height="13" rx="1.4" fill={S} stroke="none" opacity={0.7} /><rect x="29" y="16" width="6" height="18" rx="1.4" fill="none" /><path d="M13 13l8 4 8-3" opacity={0.6} /></Glyph>);
export const C24 = (p: P) => (<Glyph {...p}><circle cx="24" cy="24" r="12" strokeWidth={2} /><path d="M16 16l16 16" strokeWidth={2.8} /><path d="M20 24h8" opacity={0.4} /></Glyph>);

/* ================= BLUE c25–c33 — PRINCIPLES ================= */
export const C25 = (p: P) => (<Glyph {...p}><path d="M24 12l10 4.5v9c0 5.8-4.2 9.8-10 11.5-5.8-1.7-10-5.7-10-11.5v-9z" fill={S} stroke="none" opacity={0.92} /><path d="M19.5 24l3.2 3.4L29 20" stroke="#06090f" strokeWidth={2.6} /></Glyph>);
export const C26 = (p: P) => (<Glyph {...p}><path d="M12 19c4 0 4 10 8 10s4-10 8-10 4 10 8 10" opacity={0.4} /><rect x="16" y="16" width="16" height="16" rx="3" strokeWidth={2.2} /><path d="M20 24h8" strokeWidth={2.6} /></Glyph>);
export const C27 = (p: P) => (<Glyph {...p}><path d="M24 12l11 5v8c0 6-4.6 10.4-11 12.4C17.6 35.4 13 31 13 25v-8z" /><path d="M24 20v6" strokeWidth={2.8} /><circle cx="24" cy="30" r="1.9" fill={S} stroke="none" /></Glyph>);
export const C28 = (p: P) => (<Glyph {...p}><rect x="13" y="22" width="22" height="13" rx="2.6" fill={S} stroke="none" opacity={0.9} /><path d="M18 22v-4a6 6 0 0112 0v4" strokeWidth={2.2} /><circle cx="24" cy="28.5" r="2" fill="#06090f" stroke="none" /></Glyph>);
export const C29 = (p: P) => (<Glyph {...p}><rect x="12" y="24" width="6" height="10" rx="1.4" fill={S} stroke="none" /><rect x="21" y="18" width="6" height="16" rx="1.4" fill={S} stroke="none" opacity={0.8} /><rect x="30" y="13" width="6" height="21" rx="1.4" /><path d="M31 8l2.4 2.6L38 5" strokeWidth={2.2} /></Glyph>);
export const C30 = (p: P) => (<Glyph {...p}><path d="M13 20l7 7 6-8 9 9" /><path d="M35 22v6h-6" strokeWidth={2.2} /><circle cx="20" cy="27" r="2.2" fill={S} stroke="none" /></Glyph>);
export const C31 = (p: P) => (<Glyph {...p}><path d="M24 11l3.6 7.6 8.4 1.1-6.1 5.8 1.5 8.3L24 29.9l-7.4 3.9 1.5-8.3-6.1-5.8 8.4-1.1z" fill={S} stroke="none" opacity={0.92} /></Glyph>);
export const C32 = (p: P) => (<Glyph {...p}><circle cx="24" cy="24" r="11" strokeWidth={1.9} /><path d="M24 18v6l4 3" strokeWidth={2.4} /><path d="M13 13l22 22" opacity={0.35} /></Glyph>);
export const C33 = (p: P) => (<Glyph {...p}><rect x="11" y="15" width="18" height="18" rx="2.4" /><path d="M15 21h10M15 26h7" opacity={0.7} /><path d="M31 21l7 7M38 21l-7 7" strokeWidth={2.4} /></Glyph>);

/* ================= RED c34–c40 — DISCIPLINE ================= */
export const C34 = (p: P) => (<Glyph {...p}><path d="M13 30c4-2 5-12 11-12s7 10 11 12" /><path d="M11 34h26" strokeWidth={2.4} /><circle cx="24" cy="18" r="2.6" fill={S} stroke="none" /></Glyph>);
export const C35 = (p: P) => (<Glyph {...p}><path d="M12 32l8-10 5 5 7-13" /><path d="M32 14h5v5" strokeWidth={2.2} /><path d="M14 14l20 20" strokeWidth={2.6} opacity={0.85} /></Glyph>);
export const C36 = (p: P) => (<Glyph {...p}><path d="M17 14l14 20M31 14L17 34" strokeWidth={2.8} /><circle cx="24" cy="24" r="13" opacity={0.3} strokeWidth={1.5} /></Glyph>);
export const C37 = (p: P) => (<Glyph {...p}><rect x="12" y="19" width="7" height="12" rx="1.5" fill={S} stroke="none" /><rect x="22" y="19" width="7" height="12" rx="1.5" fill={S} stroke="none" opacity={0.6} /><rect x="32" y="19" width="5" height="12" rx="1.5" opacity={0.5} /><path d="M13 13l22 24" strokeWidth={2.6} /></Glyph>);
export const C38 = (p: P) => (<Glyph {...p}><path d="M12 30h24" strokeWidth={2.8} /><rect x="16" y="18" width="16" height="9" rx="2" fill={S} stroke="none" opacity={0.85} /><path d="M24 12v5" strokeWidth={2.4} /><path d="M19 35l5 4 5-4" opacity={0.5} /></Glyph>);
export const C39 = (p: P) => (<Glyph {...p}><circle cx="24" cy="24" r="11" strokeWidth={1.9} /><path d="M20 21a4 4 0 117 2.6c-1.6 1.4-3 2-3 4" strokeWidth={2.2} /><circle cx="24" cy="32" r="1.8" fill={S} stroke="none" /></Glyph>);
export const C40 = (p: P) => (<Glyph {...p}><path d="M24 12l10 4.5v9c0 5.8-4.2 9.8-10 11.5-5.8-1.7-10-5.7-10-11.5v-9z" /><rect x="20" y="22" width="8" height="7" rx="1.6" fill={S} stroke="none" /><path d="M21.5 22v-2.4a2.5 2.5 0 015 0V22" strokeWidth={1.8} /></Glyph>);

export const SKILL_GLYPHS = [C01,C02,C03,C04,C05,C06,C07,C08,C09,C10,C11,C12,C13,C14,C15,
  C16,C17,C18,C19,C20,C21,C22,C23,C24,
  C25,C26,C27,C28,C29,C30,C31,C32,C33,
  C34,C35,C36,C37,C38,C39,C40];

/* ================= TOP BAR ICONS (topbar.html asset set) ================= */
export const IcLightning = (p: P) => (
  <svg viewBox="0 0 24 24" className={p.className} fill="none" aria-hidden>
    <path d="M13.2 2.5L5.6 13.2a.6.6 0 00.5.95h4.3l-1.6 7.3a.6.6 0 001.07.47l7.6-10.7a.6.6 0 00-.5-.95h-4.3l1.6-7.3a.6.6 0 00-1.07-.47z" fill={S} />
  </svg>
);
export const IcStar = (p: P) => (
  <svg viewBox="0 0 24 24" className={p.className} fill="none" aria-hidden>
    <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5-5.8-3.05-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z" fill={S} />
  </svg>
);
export const IcCoin = (p: P) => (
  <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.8} aria-hidden>
    <circle cx="12" cy="12" r="9" fill={S} opacity={0.95} stroke="none" />
    <circle cx="12" cy="12" r="6.4" stroke="#06090f" strokeWidth={1.4} opacity={0.45} fill="none" />
    <path d="M12 7.4v9.2M9.6 9.6h4.1a1.9 1.9 0 010 3.8H9.6" stroke="#06090f" strokeWidth={1.7} strokeLinecap="round" fill="none" />
  </svg>
);
export const IcBell = (p: P) => (
  <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 8.6A6 6 0 106 8.6c0 5-2 6.4-2 6.4h16s-2-1.4-2-6.4z" fill={S} opacity={0.9} stroke="none" />
    <path d="M18 8.6A6 6 0 106 8.6c0 5-2 6.4-2 6.4h16s-2-1.4-2-6.4z" />
    <path d="M10.3 18.5a2 2 0 003.4 0" />
  </svg>
);
export const IcGear = (p: P) => (
  <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3.2l1.5 2.1 2.5-.5.4 2.5 2.3 1.1-1.2 2.3 1.2 2.3-2.3 1.1-.4 2.5-2.5-.5L12 20.2l-1.5-2.1-2.5.5-.4-2.5-2.3-1.1L6.5 12 5.3 9.7l2.3-1.1.4-2.5 2.5.5z" />
    <circle cx="12" cy="12" r="3.1" fill={S} stroke="none" />
  </svg>
);

/* ================= BOTTOM NAV ICONS ================= */
export const NavAcademy = (p: P) => (
  <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3.6L2.5 8.2 12 12.8l9.5-4.6z" fill={S} stroke="none" />
    <path d="M6.2 10.8v5c0 1.6 2.6 3 5.8 3s5.8-1.4 5.8-3v-5" />
    <path d="M21.5 8.2v6.2" />
  </svg>
);
/* Arena — crossed candles (brand.md emblem, not literal swords) */
export const NavArena = (p: P) => (
  <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <g transform="rotate(-30 12 12)">
      <rect x="10.3" y="5.5" width="3.4" height="10" rx="1.1" fill={S} stroke="none" />
      <path d="M12 2.6v2.9M12 15.5v3.1" />
    </g>
    <g transform="rotate(30 12 12)">
      <rect x="10.3" y="5.5" width="3.4" height="10" rx="1.1" fill="none" />
      <path d="M12 2.6v2.9M12 15.5v3.1" />
    </g>
    <path d="M5 21h14" opacity={0.55} />
  </svg>
);
export const NavCollection = (p: P) => (
  <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="7.5" y="4" width="12" height="15" rx="2.2" fill={S} stroke="none" opacity={0.92} />
    <rect x="4.5" y="6.6" width="12" height="15" rx="2.2" />
  </svg>
);
export const NavMore = (p: P) => (
  <svg viewBox="0 0 24 24" className={p.className} fill="none" aria-hidden>
    <circle cx="5.5" cy="12" r="2.1" fill={S} /><circle cx="12" cy="12" r="2.1" fill={S} /><circle cx="18.5" cy="12" r="2.1" fill={S} />
  </svg>
);

/* ================= UI / UTILITY ICONS ================= */
export const IcSearch = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={2} strokeLinecap="round" aria-hidden><circle cx="10.6" cy="10.6" r="6.6" /><path d="M15.6 15.6L20.5 20.5" /></svg>);
export const IcChevL = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M14.5 5.5L8 12l6.5 6.5" /></svg>);
export const IcChevR = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9.5 5.5L16 12l-6.5 6.5" /></svg>);
export const IcLock = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="4.6" y="10.4" width="14.8" height="9.6" rx="2.4" fill={S} stroke="none" opacity={0.92} /><path d="M8 10.4V7.6a4 4 0 018 0v2.8" /></svg>);
export const IcSeal = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="9.6" r="5.6" fill={S} stroke="none" opacity={0.92} /><path d="M8.6 14.4L7.2 21l4.8-2.3L16.8 21l-1.4-6.6" /></svg>);
export const IcCheck = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.6l4.6 4.6L19 7" /></svg>);
export const IcCross = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={2.6} strokeLinecap="round" aria-hidden><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /></svg>);
export const IcClock = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="8.4" /><path d="M12 7.4V12l3.2 2" /></svg>);
export const IcTrend = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3.5 16.5l5.5-6 3.5 3.2L20.5 6" /><path d="M15.5 6h5v5" /></svg>);
export const IcVolume = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={2} strokeLinecap="round" aria-hidden><path d="M5 20V12M10 20V6M15 20v-9M20 20v-5" /></svg>);
export const IcShield = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3l7.5 3.2v5.4c0 4.4-3.1 7.6-7.5 9.4-4.4-1.8-7.5-5-7.5-9.4V6.2z" /></svg>);
export const IcEye = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.9" fill={S} stroke="none" /></svg>);
export const IcFlame = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.8} strokeLinejoin="round" aria-hidden><path d="M12 2.8s5.4 4.2 5.4 9.4A5.4 5.4 0 0112 17.6a5.4 5.4 0 01-5.4-5.4c0-2.2 1-4 1-4s.8 1.6 2 1.6c0-3.6 4.4-7 4.4-7z" fill={S} opacity={0.9} stroke="none" /><path d="M12 21.2c-3.4 0-6-1.6-6-1.6" /></svg>);
export const IcTarget = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.9} aria-hidden><circle cx="12" cy="12" r="8.4" /><circle cx="12" cy="12" r="4.4" /><circle cx="12" cy="12" r="1.5" fill={S} stroke="none" /></svg>);
export const IcGrid = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.9} strokeLinejoin="round" aria-hidden><rect x="3.6" y="3.6" width="7" height="7" rx="1.6" fill={S} stroke="none" /><rect x="13.4" y="3.6" width="7" height="7" rx="1.6" /><rect x="3.6" y="13.4" width="7" height="7" rx="1.6" /><rect x="13.4" y="13.4" width="7" height="7" rx="1.6" fill={S} stroke="none" opacity={0.5} /></svg>);
export const IcLayers = (p: P) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.8} strokeLinejoin="round" aria-hidden><path d="M12 3.2l8.6 4.3-8.6 4.3-8.6-4.3z" fill={S} stroke="none" opacity={0.9} /><path d="M3.4 12.2l8.6 4.3 8.6-4.3" /><path d="M3.4 16.6l8.6 4.3 8.6-4.3" opacity={0.6} /></svg>);
export const IcSmiley = (p: P) => (
  <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke={S} strokeWidth={1.7} strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="9.2" />
    <circle cx="8.9" cy="10" r="1.15" fill={S} stroke="none" />
    <circle cx="15.1" cy="10" r="1.15" fill={S} stroke="none" />
    <path d="M7.9 14.4c1.1 1.9 2.6 2.8 4.1 2.8s3-.9 4.1-2.8" />
  </svg>
);
/* Signal Arena emblem — crossed candles on shield */
export const Emblem = (p: P) => (
  <svg viewBox="0 0 64 64" className={p.className} fill="none" aria-hidden>
    <path d="M32 5l22 8.4v15.8C54 42 45 51.4 32 56 19 51.4 10 42 10 29.2V13.4z"
      fill="url(#eg)" stroke="#00dcb0" strokeWidth={1.8} strokeLinejoin="round" opacity={0.95} />
    <defs>
      <linearGradient id="eg" x1="10" y1="5" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0d2a2a" /><stop offset="1" stopColor="#071018" />
      </linearGradient>
    </defs>
    <g transform="rotate(-27 32 32)">
      <rect x="28.4" y="17" width="7.2" height="24" rx="2.4" fill="#2E7F5C" />
      <path d="M32 11v6M32 41v8" stroke="#2E7F5C" strokeWidth={2.6} strokeLinecap="round" />
    </g>
    <g transform="rotate(27 32 32)">
      <rect x="28.4" y="17" width="7.2" height="24" rx="2.4" fill="#C56861" />
      <path d="M32 11v6M32 41v8" stroke="#C56861" strokeWidth={2.6} strokeLinecap="round" />
    </g>
  </svg>
);
