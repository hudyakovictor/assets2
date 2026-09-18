/** Crisp casual-game SVG icons. White/stroke style, colored by `currentColor`. */
import type { ReactNode } from "react";

const S = (extra?: object) => ({ fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, ...extra });

function I({ children, size = 24, vb = 24 }: { children: ReactNode; size?: number; vb?: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} style={{ display: "block" }}>
      {children}
    </svg>
  );
}

/* ---- lens icons ---- */
export const IcTrend = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S()} d="M4 16l5-5 3 3 8-8" />
    <path {...S()} d="M16 6h5v5" />
  </I>
);
export const IcVolume = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2.6 })} d="M6 20V11M12 20V5M18 20v-6" />
  </I>
);
export const IcRisk = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S()} d="M12 3l7 3v5c0 4.4-3 7.3-7 8.6C8 18.3 5 15.4 5 11V6z" />
  </I>
);
export const IcWait = (p: { size?: number }) => (
  <I size={p.size}>
    <circle {...S()} cx="12" cy="12" r="8" />
    <path {...S()} d="M12 8v4.5l3 2" />
  </I>
);

/* ---- action icons ---- */
export const IcEnter = (p: { size?: number }) => (
  <I size={p.size}>
    <circle {...S({ strokeWidth: 2.2 })} cx="12" cy="12" r="9" />
    <path {...S()} d="M12 16V8M8.5 11.5L12 8l3.5 3.5" />
  </I>
);
export const IcHourglass = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S()} d="M7 4h10M7 20h10" />
    <path {...S()} d="M7 4c0 4 5 5 5 8s-5 4-5 8M17 4c0 4-5 5-5 8s5 4 5 8" />
  </I>
);
export const IcHtf = (p: { size?: number }) => (
  <I size={p.size}>
    <circle {...S({ strokeWidth: 2 })} cx="9" cy="10" r="5" />
    <path {...S({ strokeWidth: 2 })} d="M9 7.5v2.5l2 1" />
    <circle {...S({ strokeWidth: 1.8 })} cx="16" cy="16" r="4" />
    <path {...S({ strokeWidth: 1.8 })} d="M16 14v2l1.5 1" />
    <path {...S({ strokeWidth: 1.8 })} d="M13 6a7 7 0 016 6" />
  </I>
);
export const IcAdd = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2.4 })} d="M7 19V11M12 19V6M17 19v-7" />
  </I>
);
export const IcWarn = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S()} d="M12 4l9 15H3z" />
    <path {...S()} d="M12 10v4" />
    <circle cx="12" cy="16.5" r="1.1" fill="currentColor" stroke="none" />
  </I>
);

/* ---- chart window tabs ---- */
export const IcCandles = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2 })} d="M8 4v3M8 14v6M16 8v2M16 17v3" />
    <rect {...S({ strokeWidth: 2 })} x="6" y="7" width="4" height="7" rx="1" />
    <rect {...S({ strokeWidth: 2 })} x="14" y="10" width="4" height="7" rx="1" />
  </I>
);
export const IcNews = (p: { size?: number }) => (
  <I size={p.size}>
    <rect {...S({ strokeWidth: 2 })} x="4" y="5" width="16" height="14" rx="2" />
    <path {...S({ strokeWidth: 2 })} d="M7 9h6M7 12h10M7 15h10" />
  </I>
);
export const IcBook = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2 })} d="M5 7h6M5 12h6M5 17h6M15 7h4M15 12h4M15 17h4" />
  </I>
);
export const IcWhale = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2 })} d="M3 11c3 0 4 4 8 4s5-4 5-7c0 3 2 4 5 4-1 4-5 7-10 7-5 0-8-3-8-8z" />
    <circle cx="8" cy="12" r="0.9" fill="currentColor" stroke="none" />
  </I>
);
export const IcCalendar = (p: { size?: number }) => (
  <I size={p.size}>
    <rect {...S({ strokeWidth: 2 })} x="4" y="5" width="16" height="15" rx="2" />
    <path {...S({ strokeWidth: 2 })} d="M4 9h16M8 3v4M16 3v4" />
  </I>
);
export const IcChat = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2 })} d="M5 6h14v9H9l-4 4z" />
  </I>
);
export const IcPlus = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S()} d="M12 6v12M6 12h12" />
  </I>
);

/* ---- bottom nav ---- */
export const IcAcademy = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2.2 })} d="M3 8l9-4 9 4-9 4-9-4z" />
    <path {...S({ strokeWidth: 2.2 })} d="M7 10v5c0 1.4 2.5 3 5 3s5-1.6 5-3v-5" />
  </I>
);
export const IcArena = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2.4 })} d="M14.5 4L20 9.5l-9.5 9.5-2.5-2.5L14.5 4zM4 20l3.5-3.5" />
    <path {...S({ strokeWidth: 2.4 })} d="M9.5 4L4 9.5l9.5 9.5 2.5-2.5L9.5 4zM20 20l-3.5-3.5" />
  </I>
);
export const IcCollection = (p: { size?: number }) => (
  <I size={p.size}>
    <rect {...S({ strokeWidth: 2.2 })} x="4" y="6" width="10" height="13" rx="2" />
    <path {...S({ strokeWidth: 2.2 })} d="M9 6l7 1v11" />
  </I>
);
export const IcMore = (p: { size?: number }) => (
  <I size={p.size}>
    <circle cx="6" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="18" cy="12" r="1.6" fill="currentColor" />
  </I>
);

/* ---- topbar ---- */
export const IcStar = (p: { size?: number }) => (
  <I size={p.size}>
    <path fill="currentColor" stroke="none" d="M12 3l2.6 5.6 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6L3.4 9.3l6-.7z" />
  </I>
);
export const IcCoin = (p: { size?: number }) => (
  <I size={p.size}>
    <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
    <circle {...S({ strokeWidth: 2, stroke: "rgba(0,0,0,.35)" })} cx="12" cy="12" r="6" />
    <path {...S({ strokeWidth: 2, stroke: "rgba(0,0,0,.45)" })} d="M12 9v6M10.5 10.5h2.2a1.4 1.4 0 010 2.8h-2.2" />
  </I>
);
export const IcBell = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2.2 })} d="M6 16V11a6 6 0 1112 0v5l2 2H4z" />
    <path {...S({ strokeWidth: 2.2 })} d="M10 20a2 2 0 004 0" />
  </I>
);
export const IcGear = (p: { size?: number }) => (
  <I size={p.size}>
    <circle {...S({ strokeWidth: 2.2 })} cx="12" cy="12" r="3.2" />
    <path {...S({ strokeWidth: 2.2 })} d="M12 3.5v2.5M12 18v2.5M4.7 7l2.1 1.3M17.2 15.7l2.1 1.3M4.7 17l2.1-1.3M17.2 8.3l2.1-1.3" />
  </I>
);
export const IcCoach = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2.2 })} d="M5 5h14v10H10l-4 4v-4H5z" />
    <path {...S({ strokeWidth: 2, stroke: "currentColor" })} d="M9 10h.01M12.5 10h.01M16 10h.01" />
  </I>
);
export const IcLock = (p: { size?: number }) => (
  <I size={p.size}>
    <rect {...S({ strokeWidth: 2.2 })} x="5" y="11" width="14" height="9" rx="2" />
    <path {...S({ strokeWidth: 2.2 })} d="M8 11V8a4 4 0 018 0v3" />
  </I>
);
export const IcCrown = (p: { size?: number }) => (
  <I size={p.size}>
    <path fill="currentColor" stroke="none" d="M4 8l4 4 4-6 4 6 4-4v9H4z" />
  </I>
);
export const IcCheck = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 3 })} d="M5 12.5l4.5 4.5L19 7" />
  </I>
);
export const IcFire = (p: { size?: number }) => (
  <I size={p.size}>
    <path fill="currentColor" stroke="none" d="M13 3c1 3-1 4-1 6 2 0 3-1 3-3 2 2 3 4 3 7a6 6 0 11-12 0c0-3 2-5 3-7 1 2 2 2 2 0 0-3-1-4-1-6 0 0 4 1 4 3z" />
  </I>
);

export const IcMedal = (p: { size?: number }) => (
  <I size={p.size}>
    <circle {...S({ strokeWidth: 2.2 })} cx="12" cy="14" r="6" />
    <path {...S({ strokeWidth: 2.2 })} d="M9 8L6 3M15 8l3-5" />
    <path fill="currentColor" stroke="none" d="M12 11.2l1 2 2.2.2-1.7 1.5.5 2.1-2-1.1-2 1.1.5-2.1L8.8 13.4l2.2-.2z" />
  </I>
);
export const IcCardStack = (p: { size?: number }) => (
  <I size={p.size}>
    <rect {...S({ strokeWidth: 2 })} x="7" y="4" width="11" height="15" rx="2" transform="rotate(8 12 12)" />
    <rect {...S({ strokeWidth: 2, fill: "currentColor", stroke: "currentColor" })} x="6" y="6" width="10" height="14" rx="2" opacity="0.15" />
    <rect {...S({ strokeWidth: 2 })} x="6" y="6" width="10" height="14" rx="2" />
  </I>
);
export const IcSig = (p: { size?: number }) => (
  <I size={p.size}>
    <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
    <path {...S({ strokeWidth: 2.2, stroke: "rgba(0,0,0,.4)" })} d="M14.5 9.2a3 3 0 00-4.5.3c-.8 1 .1 2.2 2 2.6s2.9 1.6 2.1 2.6a3 3 0 01-4.6.2M12 7.4v9.2" />
  </I>
);
export const IcSmiley = (p: { size?: number; color?: string }) => (
  <svg width={p.size ?? 30} height={p.size ?? 30} viewBox="0 0 40 40" style={{ display: "block" }}>
    <circle cx="20" cy="20" r="16.5" fill="none" stroke={p.color ?? "currentColor"} strokeWidth="2.4" />
    <circle cx="14" cy="16" r="1.9" fill={p.color ?? "currentColor"} />
    <circle cx="26" cy="16" r="1.9" fill={p.color ?? "currentColor"} />
    <path d="M12 24c2.6 3.4 13.4 3.4 16 0" fill="none" stroke={p.color ?? "currentColor"} strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);
export const IcRocket = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2.2 })} d="M12 3c3 1.5 5 4.5 5 8l-2.5 2.5h-5L7 11c0-3.5 2-6.5 5-8z" />
    <circle {...S({ strokeWidth: 2 })} cx="12" cy="9.5" r="1.6" />
    <path {...S({ strokeWidth: 2.2 })} d="M9.5 16c-1 1.5-1 3.5-1 5 1.5 0 3.5 0 5-1M7 13l-2 1c-1 .5-1.5 1.5-1.5 3 1.5 0 2.5-.5 3-1.5" />
  </I>
);

export const IcLightning = (p: { size?: number }) => (
  <I size={p.size}>
    <path fill="currentColor" stroke="none" d="M13 2L5 13h5l-1 9 8-12h-5z" />
  </I>
);

export const IcSearch = (p: { size?: number }) => (
  <I size={p.size}>
    <circle {...S({ strokeWidth: 2.2 })} cx="11" cy="11" r="7" />
    <path {...S({ strokeWidth: 2.2 })} d="M16 16l5 5" />
  </I>
);

export const IcChevronLeft = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2.4 })} d="M15 18l-6-6 6-6" />
  </I>
);

export const IcChevronRight = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2.4 })} d="M9 18l6-6-6-6" />
  </I>
);

export const IcFilter = (p: { size?: number }) => (
  <I size={p.size}>
    <path {...S({ strokeWidth: 2 })} d="M4 6h16M6 12h12M9 18h6" />
  </I>
);

export const IcPlay = (p: { size?: number }) => (
  <I size={p.size}>
    <path fill="currentColor" stroke="none" d="M7 5l12 7-12 7z" />
  </I>
);

export const LENS_ICON = { trend: IcTrend, volume: IcVolume, risk: IcRisk, wait: IcWait };
export const ACTION_ICON = { enter: IcEnter, wait: IcHourglass, htf: IcHtf, add: IcAdd };
