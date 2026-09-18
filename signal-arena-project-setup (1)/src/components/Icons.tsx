// Casual AAA Mobile Game Vector Icon Suite (Pure SVG, 100% NO EMOJI)
// Designed in the exact bubbly, juicy vector style of reference screens

export function IconXP({ className = "w-4 h-4", glow = true }: { className?: string; glow?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#46e3d2" />
          <stop offset="100%" stopColor="#1ca394" />
        </linearGradient>
        {glow && (
          <filter id="xpGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#2dd4bf" floodOpacity="0.6" />
          </filter>
        )}
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#xpGrad)" filter={glow ? "url(#xpGlow)" : undefined} />
      <circle cx="12" cy="12" r="8" fill="#134e48" />
      <path
        d="M8.5 8.5L10.5 12L8.5 15.5M15.5 8.5L13.5 12L15.5 15.5M11.5 8.5H13M11.5 15.5H13"
        stroke="#5eead4"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCoin({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className}>
      <defs>
        <linearGradient id="coinRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe66d" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="coinBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="coinInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="15" r="11" fill="#78350f" />
      <circle cx="14" cy="13.5" r="11" fill="url(#coinRim)" />
      <circle cx="14" cy="13.5" r="9.5" fill="url(#coinBody)" />
      <circle cx="14" cy="13.5" r="8.2" fill="url(#coinInner)" />
      <path
        d="M12 9.5V17.5M14 9.5C15.5 9.5 16.5 10.3 16.5 11.5C16.5 12.5 15.8 13.2 14.8 13.4C16 13.6 17 14.4 17 15.7C17 17 15.8 17.5 14.2 17.5H11.5V9.5H14Z"
        fill="#fef3c7"
      />
      <path d="M13 8V9.5M15 8V9.5M13 17.5V19M15 17.5V19" stroke="#fef3c7" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="11" cy="9.5" rx="3.5" ry="1.5" fill="#fff" opacity="0.45" transform="rotate(-30 11 9.5)" />
    </svg>
  );
}

export function IconBell({ className = "w-5 h-5", hasBadge = true }: { className?: string; hasBadge?: boolean }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="bellGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <path
          d="M12 3C9.8 3 8 4.8 8 7V10.2C8 11.1 7.6 12 7 12.6L5.5 14.1C4.7 14.9 5.3 16.3 6.4 16.3H17.6C18.7 16.3 19.3 14.9 18.5 14.1L17 12.6C16.4 12 16 11.1 16 10.2V7C16 4.8 14.2 3 12 3Z"
          fill="url(#bellGrad)"
        />
        <path d="M10 18C10.5 19.2 11.2 19.8 12 19.8C12.8 19.8 13.5 19.2 14 18" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="10" cy="6" rx="2" ry="1" fill="#fff" opacity="0.6" />
      </svg>
      {hasBadge && (
        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border border-[#0d1424] rounded-full shadow-[0_0_6px_#f43f5e] animate-pulse" />
      )}
    </div>
  );
}

export function IconGear({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="gearGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="3.2" fill="#1e293b" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C11.4 2 11 2.4 10.9 3L10.6 4.1C10.1 4.3 9.6 4.6 9.1 5L8.1 4.5C7.5 4.2 6.8 4.4 6.5 5L5 7.6C4.7 8.2 4.9 8.9 5.4 9.3L6.3 10C6.2 10.5 6.2 11.1 6.3 11.6L5.4 12.3C4.9 12.7 4.7 13.4 5 14L6.5 16.6C6.8 17.2 7.5 17.4 8.1 17.1L9.1 16.6C9.6 17 10.1 17.3 10.6 17.5L10.9 18.6C11 19.2 11.4 19.6 12 19.6H15C15.6 19.6 16 19.2 16.1 16.6L16.4 15.5C16.9 15.3 17.4 15 17.9 14.6L18.9 15.1C19.5 15.4 20.2 15.2 20.5 14.6L22 12C22.3 11.4 22.1 10.7 21.6 10.3L20.7 9.6C20.8 9.1 20.8 8.5 20.7 8L21.6 7.3C22.1 6.9 22.3 6.2 22 5.6L20.5 3C20.2 2.4 19.5 2.2 18.9 2.5L17.9 3C17.4 2.6 16.9 2.3 16.4 2.1L16.1 1C16 0.4 15.6 0 15 0H12Z"
        fill="url(#gearGrad)"
        transform="scale(0.85) translate(2, 2)"
      />
    </svg>
  );
}

// THE SIGNATURE "CANDLE-SWORD" BLADE ICON (Образ японской свечи + клинка)
export function IconCandleSword({ className = "w-6 h-6", active = false }: { className?: string; active?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <defs>
        <linearGradient id="bladeBull" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="bladeBear" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="goldHilt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        {active && (
          <filter id="swordGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#2dd4bf" floodOpacity="0.8" />
          </filter>
        )}
      </defs>

      <g filter={active ? "url(#swordGlow)" : undefined}>
        {/* Sword 1: Bullish Green Blade (angled -45deg) */}
        <g transform="rotate(-45 16 16)">
          <line x1="16" y1="3" x2="16" y2="8" stroke="#86efac" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M13.5 8H18.5L17.8 21H14.2L13.5 8Z" fill="url(#bladeBull)" />
          <line x1="16" y1="8" x2="16" y2="21" stroke="#bbf7d0" strokeWidth="1" opacity="0.6" />
          <rect x="11.5" y="21" width="9" height="2.2" rx="1" fill="url(#goldHilt)" />
          <rect x="14.8" y="23.2" width="2.4" height="4.5" rx="0.8" fill="#78350f" />
          <circle cx="16" cy="28.8" r="1.4" fill="url(#goldHilt)" />
        </g>

        {/* Sword 2: Bearish Red Blade (angled +45deg) */}
        <g transform="rotate(45 16 16)">
          <line x1="16" y1="3" x2="16" y2="8" stroke="#fca5a5" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M13.5 8H18.5L17.8 21H14.2L13.5 8Z" fill="url(#bladeBear)" />
          <line x1="16" y1="8" x2="16" y2="21" stroke="#fecaca" strokeWidth="1" opacity="0.6" />
          <rect x="11.5" y="21" width="9" height="2.2" rx="1" fill="url(#goldHilt)" />
          <rect x="14.8" y="23.2" width="2.4" height="4.5" rx="0.8" fill="#78350f" />
          <circle cx="16" cy="28.8" r="1.4" fill="url(#goldHilt)" />
        </g>
      </g>
    </svg>
  );
}

export function IconDualSwords({ className = "w-7 h-7" }: { className?: string }) {
  return <IconCandleSword className={className} active={true} />;
}

// HAND-DRAWN MARKER SMILEY (Handwritten circle + eyes + curve smile, pure SVG, NO EMOJI)
export function HanddrawnSmiley({ className = "w-6 h-6", color = "#2dd4bf" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={`inline-block shrink-0 ${className}`}>
      {/* Hand-drawn slightly irregular outer circle */}
      <path
        d="M13.8 2.5C8.2 2.3 3.1 7.1 2.6 12.8C2.1 18.9 6.8 24.6 12.9 25.3C19.2 26 24.9 21.2 25.4 14.9C25.9 8.8 20.8 2.7 14.6 2.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hand-drawn marker left eye */}
      <path d="M9.5 10.2C9.4 10.8 9.8 11.4 10.4 11.3C10.9 11.2 11.1 10.5 10.8 10C10.5 9.5 9.6 9.6 9.5 10.2Z" fill={color} />
      {/* Hand-drawn marker right eye */}
      <path d="M17.5 10.2C17.4 10.8 17.8 11.4 18.4 11.3C18.9 11.2 19.1 10.5 18.8 10C18.5 9.5 17.6 9.6 17.5 10.2Z" fill={color} />
      {/* Hand-drawn wide curved smile */}
      <path
        d="M7.8 16.2C9.5 20.1 18.2 20.2 20.1 16.4"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// CROWN ICON (Vector gold crown with 3 points, jewel insets - NO EMOJI)
export function IconCrown({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="crownGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      <path
        d="M3 18L5 8L9.5 13L12 5L14.5 13L19 8L21 18H3Z"
        fill="url(#crownGold)"
        stroke="#fef08a"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="5" cy="8" r="1.5" fill="#fef9c3" />
      <circle cx="12" cy="5" r="1.8" fill="#fef9c3" />
      <circle cx="19" cy="8" r="1.5" fill="#fef9c3" />
      <rect x="4" y="18" width="16" height="3" rx="1" fill="#a16207" stroke="#eab308" strokeWidth="0.8" />
      <circle cx="8" cy="19.5" r="0.8" fill="#38bdf8" />
      <circle cx="12" cy="19.5" r="0.8" fill="#f43f5e" />
      <circle cx="16" cy="19.5" r="0.8" fill="#4ade80" />
    </svg>
  );
}

// GOLD STAR (Beveled 5-point star - NO EMOJI)
export function IconStarGold({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="starGoldG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <polygon
        points="12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3"
        fill="url(#starGoldG)"
        stroke="#fef08a"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// SILVER MEDAL
export function IconMedalSilver({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <polygon points="8,2 12,8 10,2" fill="#ef4444" />
      <polygon points="16,2 12,8 14,2" fill="#3b82f6" />
      <circle cx="12" cy="14" r="7.5" fill="#cbd5e1" stroke="#f1f5f9" strokeWidth="1.2" />
      <circle cx="12" cy="14" r="5.5" fill="#94a3b8" />
      <text x="12" y="17" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">2</text>
    </svg>
  );
}

// BRONZE MEDAL
export function IconMedalBronze({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <polygon points="8,2 12,8 10,2" fill="#8b5cf6" />
      <polygon points="16,2 12,8 14,2" fill="#6366f1" />
      <circle cx="12" cy="14" r="7.5" fill="#b45309" stroke="#d97706" strokeWidth="1.2" />
      <circle cx="12" cy="14" r="5.5" fill="#78350f" />
      <text x="12" y="17" fill="#fef3c7" fontSize="8" fontWeight="bold" textAnchor="middle">3</text>
    </svg>
  );
}

// CHECKMARK ICON
export function IconCheck({ className = "w-4 h-4", color = "#4ade80" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 10.5L8 14.5L16 5.5" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// FLAME STREAK ICON
export function IconFlame({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 2C10 2 6 6 6 10.5C6 13.5 7.8 16 10 16C12.2 16 14 13.5 14 10.5C14 6 10 2 10 2Z"
        fill="#f97316"
      />
      <path
        d="M10 6C10 6 7.5 8.5 7.5 11C7.5 12.8 8.6 14.2 10 14.2C11.4 14.2 12.5 12.8 12.5 11C12.5 8.5 10 6 10 6Z"
        fill="#fde047"
      />
    </svg>
  );
}

// LIGHTNING BOLT
export function IconLightning({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <polygon points="11,2 4,11 10,11 9,18 16,9 10,9" fill="#facc15" stroke="#ca8a04" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

// ARROW UP (Bullish)
export function IconArrowUp({ className = "w-4 h-4", color = "#4ade80" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 16V4M10 4L5 9M10 4L15 9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ARROW DOWN (Bearish)
export function IconArrowDown({ className = "w-4 h-4", color = "#f87171" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 4V16M10 16L5 11M10 16L15 11" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// WHALE ICON (Кит терминала)
export function IconWhale({ className = "w-5 h-5", color = "#c084fc" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className}>
      <defs>
        <linearGradient id="whaleGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
      </defs>
      <path
        d="M21 11C21 7.5 17.5 6 13 6C7.5 6 3 9.5 3 14C3 17 5 18.5 7.5 18.5C10 18.5 11 17.5 13 17.5C15.5 17.5 17.5 19 20 19C20.5 19 21.5 18 21.5 17L24 19V14L21.5 16C21.5 14.5 21 12.5 21 11Z"
        fill="url(#whaleGrad)"
        stroke="#e9d5ff"
        strokeWidth="1.2"
      />
      <circle cx="7.5" cy="11.5" r="1.2" fill="#fff" />
      <circle cx="7.8" cy="11.5" r="0.6" fill="#1e1b4b" />
      <path d="M12 4.5C12 3 10.5 2 10.5 2M13.5 4C14 2.5 15.5 2 15.5 2" stroke="#67e8f9" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// CANDLES TAB ICON
export function IconCandlesTab({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="8" y1="4" x2="8" y2="20" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="6" y="8" width="4" height="8" rx="1.5" fill="#22c55e" stroke="#86efac" strokeWidth="1" />
      <line x1="16" y1="5" x2="16" y2="19" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="14" y="9" width="4" height="7" rx="1.5" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" />
    </svg>
  );
}

// NEWS TAB ICON
export function IconNewsTab({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="7" y="7" width="5" height="4" rx="1" fill="#64748b" />
      <line x1="14" y1="8" x2="17" y2="8" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="10" x2="17" y2="10" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="13.5" x2="17" y2="13.5" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="16.5" x2="14" y2="16.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ORDERBOOK / DEPTH TAB ICON
export function IconOrderbookTab({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="6" cy="7" r="1.5" fill="#f87171" />
      <rect x="10" y="6" width="9" height="2" rx="1" fill="#f87171" />
      <circle cx="6" cy="12" r="1.5" fill="#cbd5e1" />
      <rect x="10" y="11" width="11" height="2" rx="1" fill="#cbd5e1" />
      <circle cx="6" cy="17" r="1.5" fill="#4ade80" />
      <rect x="10" y="16" width="7" height="2" rx="1" fill="#4ade80" />
    </svg>
  );
}

// CALENDAR TAB ICON
export function IconCalendarTab({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="5" width="16" height="15" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="8" y1="3" x2="8" y2="6" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="3" x2="16" y2="6" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="9" x2="20" y2="9" stroke="#64748b" strokeWidth="1.2" />
      <circle cx="8" cy="13" r="1" fill="#67e8f9" />
      <circle cx="12" cy="13" r="1" fill="#cbd5e1" />
      <circle cx="16" cy="13" r="1" fill="#cbd5e1" />
      <circle cx="8" cy="16.5" r="1" fill="#cbd5e1" />
      <circle cx="12" cy="16.5" r="1" fill="#cbd5e1" />
    </svg>
  );
}

// CHAT TAB ICON
export function IconChatTab({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 17L4 20V6C4 4.9 4.9 4 6 4H18C19.1 4 20 4.9 20 6V14C20 15.1 19.1 16 18 16H8L6 17Z"
        fill="#334155"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="10" r="1" fill="#cbd5e1" />
      <circle cx="12" cy="10" r="1" fill="#cbd5e1" />
      <circle cx="16" cy="10" r="1" fill="#cbd5e1" />
    </svg>
  );
}

// SKILL ICONS
export function IconTrend({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className}>
      <path
        d="M5 19L11.5 12.5L16 17L23 9M23 9H17.5M23 9V14.5"
        stroke="#ffffff"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconVolumeBars({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className}>
      <rect x="5.5" y="11" width="4.5" height="12" rx="2" fill="#22c55e" stroke="#14532d" strokeWidth="1.2" />
      <rect x="11.8" y="5" width="4.5" height="18" rx="2" fill="#eab308" stroke="#713f12" strokeWidth="1.2" />
      <rect x="18" y="8" width="4.5" height="15" rx="2" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.2" />
    </svg>
  );
}

export function IconShield({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className}>
      <path
        d="M14 4L6 7.5V14C6 19.5 9.5 24.2 14 25.5C18.5 24.2 22 19.5 22 14V7.5L14 4Z"
        fill="#f1f5f9"
        stroke="#475569"
        strokeWidth="1.5"
      />
      <path d="M14 7V22C17 21 19.5 17.5 19.5 14V9.5L14 7Z" fill="#94a3b8" />
    </svg>
  );
}

export function IconClockLock({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className}>
      <circle cx="14" cy="14" r="10" stroke="#cbd5e1" strokeWidth="2.5" />
      <polyline points="14,8 14,14 18,16" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <g transform="translate(13, 13)">
        <rect x="0" y="3" width="7" height="6" rx="1.5" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
        <path d="M1.8 3V1.8C1.8 0.8 2.5 0 3.5 0C4.5 0 5.2 0.8 5.2 1.8V3" stroke="#475569" strokeWidth="1.2" fill="none" />
      </g>
    </svg>
  );
}

// ACTION BUTTON ICONS
export function IconArrowEnter({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
      <path d="M12 16V8M12 8L8.5 11.5M12 8L15.5 11.5" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconHourglass({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7 4H17M7 20H17M8 4V8C8 10 10 11.5 12 12C14 11.5 16 10 16 8V4M8 20V16C8 14 10 12.5 12 12C14 12.5 16 14 16 16V20"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="16.5" r="1.5" fill="#ffffff" />
    </svg>
  );
}

export function IconSliders({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="6" y1="4" x2="6" y2="20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="4" x2="12" y2="20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="4" x2="18" y2="20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="6" cy="14" r="2.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="12" cy="8" r="2.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="18" cy="16" r="2.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

export function IconAlertTrend({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 17L10 11L14 15L20 9" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 9H20V14" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// BOTTOM NAV ICONS
export function IconGradCap({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3L2 8L12 13L22 8L12 3Z" fill="#94a3b8" />
      <path d="M6 10.5V15.5C6 18 8.7 20 12 20C15.3 20 18 18 18 15.5V10.5" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 8V15" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconDeckCards({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="4" width="11" height="15" rx="2" fill="#64748b" transform="rotate(-8 5 4)" />
      <rect x="8" y="5" width="11" height="15" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.2" />
    </svg>
  );
}

export function IconDotsMore({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="6" cy="12" r="2" fill="#94a3b8" />
      <circle cx="12" cy="12" r="2" fill="#94a3b8" />
      <circle cx="18" cy="12" r="2" fill="#94a3b8" />
    </svg>
  );
}

// TOURNAMENT TROPHY
export function IconTrophy({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className}>
      <defs>
        <linearGradient id="cupGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
      </defs>
      <path d="M8 10C5 10 4 13 4 16C4 19 7 21 11 21M28 10C31 10 32 13 32 16C32 19 29 21 25 21" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
      <path d="M9 7H27V16C27 21 23 25 18 25C13 25 9 21 9 16V7Z" fill="url(#cupGold)" stroke="#fef08a" strokeWidth="1.5" />
      <path d="M18 11.5L19.2 14.5H22.5L19.8 16.3L20.8 19.5L18 17.5L15.2 19.5L16.2 16.3L13.5 14.5H16.8L18 11.5Z" fill="#ffffff" />
      <rect x="16" y="25" width="4" height="4" fill="#a16207" />
      <rect x="11" y="29" width="14" height="4" rx="2" fill="#78350f" stroke="#ca8a04" strokeWidth="1.2" />
    </svg>
  );
}

// AVATARS (Doge / Knight / Whale / Queen) - pure vector, no emoji!
export function AvatarDoge({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className}>
      <circle cx="14" cy="14" r="13" fill="#fed7aa" />
      <polygon points="5,7 9,2 12,6" fill="#f97316" />
      <polygon points="23,7 19,2 16,6" fill="#f97316" />
      <ellipse cx="14" cy="16" rx="9" ry="7.5" fill="#ffedd5" />
      <circle cx="10" cy="13" r="1.5" fill="#1c1917" />
      <circle cx="18" cy="13" r="1.5" fill="#1c1917" />
      <ellipse cx="14" cy="16.5" rx="3.5" ry="2.2" fill="#fed7aa" />
      <circle cx="14" cy="16" r="1.2" fill="#1c1917" />
      <circle cx="8" cy="16" r="1.5" fill="#fda4af" opacity="0.6" />
      <circle cx="20" cy="16" r="1.5" fill="#fda4af" opacity="0.6" />
    </svg>
  );
}

export function AvatarKnight({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className}>
      <circle cx="14" cy="14" r="13" fill="#cbd5e1" />
      <path d="M7 14C7 8.5 10 5 14 5C18 5 21 8.5 21 14V21H7V14Z" fill="#64748b" />
      <rect x="9" y="12" width="10" height="2.5" rx="1" fill="#0f172a" />
      <line x1="14" y1="14.5" x2="14" y2="20" stroke="#0f172a" strokeWidth="1.5" />
      <path d="M14 2C14 2 11 3 11 5H17C17 3 14 2 14 2Z" fill="#38bdf8" />
    </svg>
  );
}

export function AvatarWhale({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className={`rounded-full bg-[#312e81] p-1 flex items-center justify-center ${className}`}>
      <IconWhale className="w-full h-full" color="#a78bfa" />
    </div>
  );
}

export function AvatarQueen({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className}>
      <circle cx="14" cy="14" r="13" fill="#fbcfe8" />
      <circle cx="14" cy="13" r="8" fill="#b45309" />
      <circle cx="14" cy="15" r="6" fill="#fde047" />
      <polygon points="10,8 11.5,5 14,7 16.5,5 18,8" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
      <circle cx="14" cy="16" r="5" fill="#fdf2f8" />
      <circle cx="12" cy="15.5" r="1" fill="#1e1b4b" />
      <circle cx="16" cy="15.5" r="1" fill="#1e1b4b" />
      <path d="M12.5 18C13 19 15 19 15.5 18" stroke="#e11d48" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}
