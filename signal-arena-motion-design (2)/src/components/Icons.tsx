type P = { className?: string; strokeWidth?: number };

const base = (className = "h-4 w-4") => ({
  className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/* ——— ресурсы ——— */
export const IconSignal = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M13 2.5 5.5 13.2h5.2L10 21.5 18.5 10h-5.6z" />
  </svg>
);

export const IconCoin = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <circle cx="12" cy="12" r="8.6" />
    <circle cx="12" cy="12" r="5.8" />
    <path d="M12 8.9v6.2M10.3 10.6h2.9a1.5 1.5 0 0 1 0 3h-2.4a1.5 1.5 0 0 0 0 3h3" />
  </svg>
);

export const IconTrust = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 2.8 4.8 5.9v5.7c0 4.3 3 8.1 7.2 9.6 4.2-1.5 7.2-5.3 7.2-9.6V5.9z" />
    <path d="m8.9 11.9 2.2 2.3 4-4.4" />
  </svg>
);

export const IconXp = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="m12 2.9 2.7 5.8 6.3.8-4.6 4.4 1.2 6.3-5.6-3.1-5.6 3.1L7.6 13.9 3 9.5l6.3-.8z" />
  </svg>
);

/* ——— узлы ——— */
export const IconRelay = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 11v10.2M8.6 21.2h6.8" />
    <circle cx="12" cy="8.4" r="1.8" />
    <path d="M8.2 12.2a5.5 5.5 0 0 1 0-7.7M15.8 4.5a5.5 5.5 0 0 1 0 7.7M5.6 14.7a9.2 9.2 0 0 1 0-12.8M18.4 1.9a9.2 9.2 0 0 1 0 12.8" />
  </svg>
);

export const IconPool = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 2.9c3.6 4 5.6 6.8 5.6 9.5A5.6 5.6 0 0 1 12 18a5.6 5.6 0 0 1-5.6-5.6c0-2.7 2-5.5 5.6-9.5Z" />
    <path d="M3.4 20.6c1.6 0 1.6 1.2 3.2 1.2s1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2" />
  </svg>
);

export const IconInfra = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <rect x="3" y="3" width="7" height="7" rx="1.6" />
    <rect x="14" y="3" width="7" height="7" rx="1.6" />
    <rect x="3" y="14" width="7" height="7" rx="1.6" />
    <path d="M14 17.5h7M17.5 14v7" />
  </svg>
);

export const IconCommons = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <circle cx="9" cy="8.2" r="3.2" />
    <path d="M2.9 20c0-3.4 2.7-5.6 6.1-5.6s6.1 2.2 6.1 5.6" />
    <path d="M16.2 5.4a3.2 3.2 0 0 1 0 6M18 14.9c2 .8 3.3 2.6 3.3 5.1" />
  </svg>
);

export const IconCore = ({ className, strokeWidth = 1.5 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6z" />
    <path d="M12 8.2 15.6 10v4L12 15.8 8.4 14v-4z" />
  </svg>
);

/* ——— вкладки окна ——— */
export const IconGraph = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <circle cx="5.5" cy="6.5" r="2.4" />
    <circle cx="18" cy="9" r="2.2" />
    <circle cx="11" cy="18.2" r="2.4" />
    <path d="M7.8 7.7 15.8 8.7M16.7 11 12.4 15.9M8.7 16.7 6.6 8.8" />
  </svg>
);

export const IconBars = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M5 20V12M10 20V4.6M15 20v-6.4M20 20V8.6" />
  </svg>
);

export const IconList = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M9 6.4h11M9 12h11M9 17.6h11" />
    <path d="M4.4 6.4h.01M4.4 12h.01M4.4 17.6h.01" />
  </svg>
);

export const IconCalendar = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <rect x="3.4" y="5" width="17.2" height="16" rx="2.4" />
    <path d="M3.4 9.8h17.2M8.2 3v4M15.8 3v4" />
    <path d="M7.6 13.6h2M7.6 17.2h2M14.4 13.6h2" />
  </svg>
);

export const IconBubble = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M20.6 12.2c0 4-3.9 7.2-8.6 7.2a10 10 0 0 1-2.6-.3l-5 2 1.5-3.7a6.8 6.8 0 0 1-2.5-5.2C3.4 8.2 7.3 5 12 5s8.6 3.2 8.6 7.2Z" />
    <path d="M8.6 12.2h.01M12 12.2h.01M15.4 12.2h.01" />
  </svg>
);

/* ——— системные ——— */
export const IconBell = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M6.2 10.4a5.8 5.8 0 0 1 11.6 0c0 4 1.6 5.6 1.6 5.6H4.6s1.6-1.6 1.6-5.6Z" />
    <path d="M10.2 19.2a2 2 0 0 0 3.6 0" />
  </svg>
);

export const IconGear = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.6v2.6M12 18.8v2.6M21.4 12h-2.6M5.2 12H2.6M18.6 5.4l-1.9 1.9M7.3 16.7l-1.9 1.9M18.6 18.6l-1.9-1.9M7.3 7.3 5.4 5.4" />
  </svg>
);

export const IconPlus = ({ className, strokeWidth = 1.8 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 5.2v13.6M5.2 12h13.6" />
  </svg>
);

export const IconStar = ({ className, strokeWidth = 1.6 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth} fill="currentColor">
    <path d="m12 3.4 2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16l-5.1 2.8 1.1-5.6-4.2-3.9 5.7-.7z" />
  </svg>
);

export const IconLock = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <rect x="4.6" y="10.2" width="14.8" height="10.2" rx="2.4" />
    <path d="M8.3 10.2V7.6a3.7 3.7 0 0 1 7.4 0v2.6" />
  </svg>
);

export const IconCheck = ({ className, strokeWidth = 2.1 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="m4.6 12.4 5 5 9.8-11" />
  </svg>
);

export const IconAlert = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 3.6 2.2 20.4h19.6z" />
    <path d="M12 9.6v4.6M12 17.5h.01" />
  </svg>
);

export const IconBolt = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M13.4 2.6 4.8 13.6h5.6l-.8 7.8 9-11.2h-5.9z" />
  </svg>
);

export const IconShield = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 2.8 4.8 5.9v5.7c0 4.3 3 8.1 7.2 9.6 4.2-1.5 7.2-5.3 7.2-9.6V5.9z" />
  </svg>
);

export const IconSwap = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M3.6 8.4h13.2l-3.4-3.6M20.4 15.6H7.2l3.4 3.6" />
  </svg>
);

export const IconHand = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 21.2c-3.9 0-6.4-2.5-6.4-6.3v-3.6a1.5 1.5 0 0 1 3 0V8a1.5 1.5 0 0 1 3 0v-.9a1.5 1.5 0 0 1 3 0V9a1.5 1.5 0 0 1 3 0v5.4c0 3.9-2.4 6.8-5.6 6.8Z" />
    <path d="M5.2 6 3.6 4.1M9.6 4.2 9.2 2M14.8 4.6l1.1-2" />
  </svg>
);

export const IconHourglass = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M6.4 3h11.2M6.4 21h11.2" />
    <path d="M7.6 3v3.4c0 2.4 4.4 3.5 4.4 5.6s-4.4 3.2-4.4 5.6V21M16.4 3v3.4c0 2.4-4.4 3.5-4.4 5.6s4.4 3.2 4.4 5.6V21" />
  </svg>
);

export const IconRestart = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M20 12a8 8 0 1 1-2.6-5.9" />
    <path d="M20.4 3.6v4.8h-4.8" />
  </svg>
);

export const IconPlay = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M7.6 4.8 19 12 7.6 19.2z" />
  </svg>
);

export const IconPause = ({ className, strokeWidth = 1.8 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M8.8 4.6v14.8M15.2 4.6v14.8" />
  </svg>
);

export const IconArrowUp = ({ className, strokeWidth = 1.9 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 19.6V5M6 10.8 12 4.7l6 6.1" />
  </svg>
);

export const IconSmiley = ({ className, strokeWidth = 1.8 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 2.6c5.3 0 9.5 4.1 9.4 9.5 0 5.2-4.3 9.3-9.5 9.3-5.3 0-9.4-4.3-9.3-9.5C2.7 6.7 6.8 2.6 12 2.6Z" />
    <path d="M8.6 9.4v1.3M15.3 9.2v1.4" />
    <path d="M7.9 14.4c1.2 1.7 2.6 2.5 4.2 2.5 1.6 0 3-.8 4-2.6" />
  </svg>
);

/* ——— нижняя навигация ——— */
export const IconNet = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="3.6" r="1.7" />
    <circle cx="4.6" cy="18" r="1.7" />
    <circle cx="19.4" cy="18" r="1.7" />
    <path d="M12 5.3V9M9.6 13.7 6 16.9M14.4 13.7l3.6 3.2" />
  </svg>
);

export const IconStack = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="m12 3.2 8.4 4.2L12 11.6 3.6 7.4z" />
    <path d="m4 12 8 4 8-4M4 16.6l8 4 8-4" />
  </svg>
);

export const IconJournal = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M5 4.4A1.8 1.8 0 0 1 6.8 2.6h11.4a1 1 0 0 1 1 1v16.8a1 1 0 0 1-1 1H6.8A1.8 1.8 0 0 1 5 19.6z" />
    <path d="M5 17.4h13" />
    <path d="M8.6 6.8h6.8M8.6 10.4h6.8" />
  </svg>
);

export const IconDots = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth} fill="currentColor" stroke="none">
    <circle cx="5.4" cy="12" r="1.9" />
    <circle cx="12" cy="12" r="1.9" />
    <circle cx="18.6" cy="12" r="1.9" />
  </svg>
);

export const IconSliders = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M5 21v-6.6M5 10.2V3M12 21v-9.6M12 7.4V3M19 21v-3.8M19 13V3" />
    <path d="M2.7 13.6h4.6M9.7 7.6h4.6M16.7 16.6h4.6" />
  </svg>
);

export const IconPalette = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 3a9 9 0 0 0 0 18c1.3 0 2-.9 2-1.9 0-1.4-1.1-1.8-1.1-3 0-.9.7-1.6 1.7-1.6h1.8A4.6 4.6 0 0 0 21 9.9C21 6.1 16.9 3 12 3Z" />
    <circle cx="7.9" cy="11.6" r="1.1" />
    <circle cx="10.4" cy="7.5" r="1.1" />
    <circle cx="15.6" cy="7.9" r="1.1" />
  </svg>
);

export const IconGauge = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M3.6 17.6a9 9 0 1 1 16.8 0" />
    <path d="m12 13.6 4-4.3" />
    <circle cx="12" cy="15.3" r="1.7" />
  </svg>
);

export const IconChip = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <rect x="6.4" y="6.4" width="11.2" height="11.2" rx="2.2" />
    <path d="M10 3v3.4M14 3v3.4M10 17.6V21M14 17.6V21M3 10h3.4M3 14h3.4M17.6 10H21M17.6 14H21" />
  </svg>
);

/* ——— прототип / настройки / звук ——— */
export const IconRotate = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <rect x="8.2" y="2.6" width="7.6" height="12.4" rx="2" />
    <path d="M12 12.4h.01" />
    <path d="M4.4 19.4a8.4 8.4 0 0 0 13.4 1.2M19.6 19.4l-1.9 1.4M19.6 19.4l-.4-2.4" />
  </svg>
);

export const IconTarget = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <circle cx="12" cy="12" r="8.6" />
    <circle cx="12" cy="12" r="4.4" />
    <circle cx="12" cy="12" r="1.1" />
  </svg>
);

export const IconSound = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M4.2 9.4h3.2L12 5.2v13.6L7.4 14.6H4.2z" />
    <path d="M15.4 9a4.2 4.2 0 0 1 0 6M18.2 6.4a8 8 0 0 1 0 11.2" />
  </svg>
);

export const IconMute = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M4.2 9.4h3.2L12 5.2v13.6L7.4 14.6H4.2z" />
    <path d="m15.4 9.4 4.6 5.2M20 9.4l-4.6 5.2" />
  </svg>
);

export const IconFlame = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 2.8c3 4 5 6.6 5 9.6A5 5 0 0 1 12 17.4a5 5 0 0 1-5-5c0-2.1 1-3.6 2.4-5.4.4 1.3 1.1 2.1 2 2.4 0-2.2.4-4.2.6-6.6Z" />
    <path d="M9.2 19.4c.9 1.1 1.8 1.7 2.8 1.7s1.9-.6 2.8-1.7" />
  </svg>
);

export const IconChevron = ({ className, strokeWidth = 2 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="m9.4 5.6 6.6 6.4-6.6 6.4" />
  </svg>
);

export const IconSeal = ({ className, strokeWidth = 1.6 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 22.4l-2.2-1.6-2.7.3-1-2.6-2.5-1.1.6-2.7-1.3-2.4 2-1.9-.2-2.7 2.7-.6 1.5-2.3 2.7.8 2.7-.8 1.5 2.3 2.7.6-.2 2.7 2 1.9-1.3 2.4.6 2.7-2.5 1.1-1 2.6-2.7-.3z" />
    <path d="m9.2 12.2 2 2 3.6-4.2" />
  </svg>
);

export const IconScrub = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M3.4 12h17.2" />
    <circle cx="9" cy="12" r="2.4" />
    <path d="M3.4 7.4v9.2M20.6 7.4v9.2" />
    <path d="M12.4 7.6h4.6M14.6 17h3.2" />
  </svg>
);

export const IconBook = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M4.4 4.6A2.2 2.2 0 0 1 6.6 2.4H20v18H6.6a2.2 2.2 0 0 1-2.2-2.2z" />
    <path d="M4.4 17.2h15.2M8.6 6.8h7M8.6 10.2h4.6" />
  </svg>
);

export const IconCard = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <rect x="3" y="4.6" width="18" height="14.8" rx="2.4" />
    <path d="M3 9.4h18M7 13.6h5M7 16h3" />
  </svg>
);

export const IconInfo = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M12 11v5.2M12 8h.01" />
  </svg>
);

export const IconCross = ({ className, strokeWidth = 2 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconSpinner = ({ className, strokeWidth = 1.8 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M12 3.2a8.8 8.8 0 1 0 8.8 8.8" />
    <path d="M20.8 12A8.8 8.8 0 0 0 12 3.2" opacity="0.35" />
  </svg>
);

export const IconProfile = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.8 20.4c0-3.8 3.2-6.4 7.2-6.4s7.2 2.6 7.2 6.4" />
  </svg>
);

export const IconTrophy = ({ className, strokeWidth = 1.7 }: P) => (
  <svg {...base(className)} strokeWidth={strokeWidth}>
    <path d="M7.4 3.8h9.2v4.6a4.6 4.6 0 0 1-9.2 0z" />
    <path d="M7.4 5.2H4.6v1.6a3 3 0 0 0 3 3M16.6 5.2h2.8v1.6a3 3 0 0 1-3 3" />
    <path d="M12 13v3.4M8.6 20.4h6.8l-.8-2.6H9.4z" />
  </svg>
);
