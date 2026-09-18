import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useAssets } from "../lib/assets";

/* =====================================================================
   SHARED_TOP_BAR_LOCKED — faithful React port of topbar/topbar.html
   (hudyakovictor/assets@main). Order, radii, gradients, typography and
   the five icon SVG paths are preserved. Only values are dynamic:
   LVL, XP, attempts, stars, coins, notification badge, empty state.
   Direct DOM port (no iframe) → топбар никогда не остаётся пустым.
   ===================================================================== */

export type TopBarValues = {
  level: number;
  xp: number;
  xpMax: number;
  attempts: number;
  attemptsMax: number;
  stars: number;
  coins: number;
  badge: number;
};

export const DEFAULT_TB: TopBarValues = {
  level: 7,
  xp: 240,
  xpMax: 400,
  attempts: 3,
  attemptsMax: 5,
  stars: 18,
  coins: 1240,
  badge: 2,
};

function Bolt({ className, style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 48 48" className={className} style={style} aria-label="attempts">
      <defs>
        <linearGradient id={`bg${u}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF59D" /><stop offset="35%" stopColor="#FFD54F" /><stop offset="70%" stopColor="#FFB300" /><stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
        <linearGradient id={`bh${u}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF" stopOpacity=".9" /><stop offset="100%" stopColor="#FFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M27 3 L7 28.2c-.7.9-.1 2.3 1.1 2.3h8.6L14.5 43.6c-.4 1.3 1.1 2.3 2.2 1.5L39 20.9c.7-.6.4-1.9-.6-1.9h-9.2L33.4 5.1c.3-1.4-1.1-2.4-2.3-1.6L27 3z" fill="#B45309" opacity=".25" transform="translate(0,1.5)" />
      <path d="M27 2.5 L7 27.7c-.7.9-.1 2.3 1.1 2.3h8.6L14.5 43.1c-.4 1.3 1.1 2.3 2.2 1.5L39 20.4c.7-.6.4-1.9-.6-1.9h-9.2L33.4 4.6c.3-1.4-1.1-2.4-2.3-1.6L27 2.5z" fill={`url(#bg${u})`} stroke="#9C5A00" strokeOpacity=".35" strokeWidth="1" strokeLinejoin="round" />
      <path d="M27.5 6 L13.5 26.5h6.8c.8 0 1.4.7 1.2 1.5L19.5 38 32 18.5h-6c-.7 0-1.3-.6-1.1-1.3L27.5 6z" fill={`url(#bh${u})`} opacity=".55" />
    </svg>
  );
}
function StarI({ className, style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 48 48" className={className} style={style} aria-label="stars">
      <defs>
        <linearGradient id={`sg${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFE082" /><stop offset="45%" stopColor="#FFC107" /><stop offset="100%" stopColor="#FF8F00" /></linearGradient>
        <linearGradient id={`sh${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF" stopOpacity=".85" /><stop offset="100%" stopColor="#FFF" stopOpacity="0" /></linearGradient>
      </defs>
      <path d="M24 3.8l5.9 11.3 12.7 2.1c1.2.2 1.7 1.7.8 2.6l-9 9.1 2 12.8c.2 1.2-1.1 2.1-2.1 1.5L24 37.7l-10.3 5.5c-1 .6-2.3-.3-2.1-1.5l2-12.8-9-9.1c-.9-.9-.4-2.4.8-2.6l12.7-2.1L24 3.8z" fill={`url(#sg${u})`} stroke="#9C5A00" strokeOpacity=".35" strokeWidth="1" strokeLinejoin="round" />
      <ellipse cx="24" cy="14" rx="8.5" ry="5" fill={`url(#sh${u})`} opacity=".5" />
      <circle cx="18.5" cy="18.5" r="2.2" fill="#FFF" opacity=".65" />
    </svg>
  );
}
function Coin({ className, style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 48 48" className={className} style={style} aria-label="coins">
      <defs>
        <radialGradient id={`cf${u}`} cx=".38" cy=".32" r=".9"><stop offset="0%" stopColor="#FFF8E1" /><stop offset="25%" stopColor="#FFECB3" /><stop offset="55%" stopColor="#FFC107" /><stop offset="85%" stopColor="#FF8F00" /><stop offset="100%" stopColor="#E65100" /></radialGradient>
        <linearGradient id={`cr${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFE082" /><stop offset="50%" stopColor="#FFB300" /><stop offset="100%" stopColor="#E65100" /></linearGradient>
        <linearGradient id={`ci${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF8F00" /><stop offset="15%" stopColor="#FFCA28" /><stop offset="85%" stopColor="#FFB300" /><stop offset="100%" stopColor="#E65100" /></linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill={`url(#cr${u})`} stroke="#9C4A00" strokeOpacity=".45" strokeWidth="1" />
      <circle cx="24" cy="24" r="18.2" fill="none" stroke="#FFF8E1" strokeOpacity=".7" strokeWidth="1.6" strokeDasharray="2.5 2.2" />
      <circle cx="24" cy="24" r="15.5" fill={`url(#cf${u})`} stroke={`url(#ci${u})`} strokeWidth="1.2" />
      <ellipse cx="19.5" cy="17.5" rx="7" ry="4.8" fill="#FFF" opacity=".45" />
      <path d="M24 15.5l2.4 4.6 5.2.8-3.7 3.7.8 5.2-4.7-2.4-4.7 2.4.8-5.2-3.7-3.7 5.2-.8L24 15.5z" fill="#FF8F00" opacity=".85" />
      <path d="M24 16.8l1.8 3.5 3.9.6-2.8 2.8.6 3.9-3.5-1.8-3.5 1.8.6-3.9-2.8-2.8 3.9-.6L24 16.8z" fill="#FFECB3" />
    </svg>
  );
}
function Bell({ className, style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 48 48" className={className} style={style} aria-label="notifications">
      <defs>
        <linearGradient id={`bg2${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF" /><stop offset="45%" stopColor="#E6F0FF" /><stop offset="100%" stopColor="#A9C3E8" /></linearGradient>
        <linearGradient id={`bs${u}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7FA0CC" stopOpacity=".55" /><stop offset="18%" stopColor="#7FA0CC" stopOpacity="0" /><stop offset="82%" stopColor="#5B7BA8" stopOpacity="0" /><stop offset="100%" stopColor="#5B7BA8" stopOpacity=".5" /></linearGradient>
      </defs>
      <rect x="20.6" y="3" width="6.8" height="6" rx="3.4" fill="#A9C3E8" stroke="#6E8DB8" strokeWidth="1" />
      <circle cx="24" cy="5.8" r="1.6" fill="#E6F0FF" />
      <path d="M24 8.5c-7.2 0-11.5 5.2-11.5 12.2 0 5.8-1.2 8.6-3.3 11.3-.5.7-.1 1.8.9 1.8h28.8c1 0 1.4-1.1.9-1.8-2.1-2.7-3.3-5.5-3.3-11.3 0-7-4.3-12.2-12.5-12.2z" fill={`url(#bg2${u})`} stroke="#6E8DB8" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M24 8.5c-7.2 0-11.5 5.2-11.5 12.2 0 5.8-1.2 8.6-3.3 11.3-.5.7-.1 1.8.9 1.8h28.8c1 0 1.4-1.1.9-1.8-2.1-2.7-3.3-5.5-3.3-11.3 0-7-4.3-12.2-12.5-12.2z" fill={`url(#bs${u})`} />
      <path d="M16.5 17.5c-1 1.6-1.5 3.6-1.5 5.7 0 3.4-.5 5.7-1.4 7.6-.3.6.1 1.1.6.7 1.6-1.2 3.1-3.9 3.4-8.1.2-2.4-.1-4.4-1.1-5.9z" fill="#FFF" opacity=".9" />
      <path d="M9.4 33.8h29.2c1 0 1.6 1 1.1 1.9-.5.9-1.6 1.5-2.8 1.5H11.1c-1.2 0-2.3-.6-2.8-1.5-.5-.9.1-1.9 1.1-1.9z" fill="#C9DBF5" stroke="#6E8DB8" strokeWidth="1" strokeLinejoin="round" />
      <ellipse cx="24" cy="40.2" rx="4.2" ry="3.8" fill="#A9C3E8" stroke="#6E8DB8" strokeWidth="1" />
      <ellipse cx="22.8" cy="39.2" rx="1.5" ry="1.2" fill="#EAF2FF" opacity=".9" />
    </svg>
  );
}
function Gear({ className, style }: { className?: string; style?: CSSProperties }) {
  const u = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 48 48" className={className} style={style} aria-label="settings">
      <defs>
        <linearGradient id={`gg${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F4F8FF" /><stop offset="50%" stopColor="#C9DBF5" /><stop offset="100%" stopColor="#9AB6DC" /></linearGradient>
        <linearGradient id={`gh${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF" stopOpacity=".9" /><stop offset="100%" stopColor="#FFF" stopOpacity="0" /></linearGradient>
      </defs>
      <path d="M20.6 10.2l.4-5c0-1.3 1-2.2 2.4-2.2h1.2c1.4 0 2.4.9 2.4 2.2l.4 5 4.4 1.9 3.8-3.3c.9-.9 2.4-.8 3.2.2l.9 1c.8 1 .7 2.4-.2 3.2l-3.3 3.8 1.9 4.4 5 .7c1.3.2 2.2 1.2 2.2 2.5v1.4c0 1.3-.9 2.3-2.2 2.5l-5 .7-1.9 4.4 3.3 3.8c.9.8 1 2.2.2 3.2l-.9 1c-.8 1-2.3 1.1-3.2.2l-3.8-3.3-4.4 1.9-.4 5c0 1.3-1 2.2-2.4 2.2h-1.2c-1.4 0-2.4-.9-2.4-2.2l-.4-5-4.4-1.9-3.8 3.3c-.9.9-2.4.8-3.2-.2l-.9-1c-.8-1-.7-2.4.2-3.2l3.3-3.8-1.9-4.4-5-.7C4 31.7 3.1 30.7 3.1 29.4v-1.4c0-1.3.9-2.3 2.2-2.5l5-.7 1.9-4.4-3.3-3.8c-.9-.8-1-2.2-.2-3.2l.9-1c.8-1 2.3-1.1 3.2-.2l3.8 3.3 4.4-1.9z" fill={`url(#gg${u})`} stroke="#6E8DB8" strokeWidth="1.4" />
      <ellipse cx="24" cy="13.5" rx="9" ry="3.6" fill={`url(#gh${u})`} opacity=".55" />
      <circle cx="24" cy="24" r="8.2" fill="#0A2540" stroke="#6E8DB8" strokeWidth="1.4" />
    </svg>
  );
}

export default function TopBar({ values = DEFAULT_TB }: { values?: TopBarValues; transparent?: boolean }) {
  const assets = useAssets();
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.62);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setS(Math.max(0.5, Math.min(0.72, e.contentRect.width / 620))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pct = Math.max(0, Math.min(100, Math.round((values.xp / values.xpMax) * 100)));
  const empty = values.attempts <= 0;

  return (
    <div
      ref={ref}
      data-topbar="SHARED_TOP_BAR_LOCKED"
      className="tb-lock-wrap"
      style={{ "--s": s } as CSSProperties}
    >
      <div className={`tb-lock ${empty ? "tb-empty" : ""}`}>
        {/* Row 1: LVL + XP */}
        <div className="tb-row tb-row-a">
          <div className="tb-lvl">
            <small>LVL</small>
            <strong>{String(values.level).padStart(2, "0")}</strong>
          </div>
          <div className="tb-xp">
            <div className="tb-xp-text">
              {values.xp} <span className="blue">/ {values.xpMax} XP</span>
            </div>
            <div className="tb-xp-bar">
              <div className="tb-xp-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Row 2: attempts · stars · coins · bell · gear */}
        <div className="tb-row tb-row-b">
          <span className="tb-stat tb-stat-tries tb-pill">
            <Bolt />
            <span>
              {values.attempts}/{values.attemptsMax}
            </span>
          </span>
          <span className="tb-stat tb-pill">
            <StarI />
            <span>{values.stars}</span>
          </span>
          <span className="tb-stat tb-pill">
            <Coin />
            <span>{values.coins.toLocaleString("ru-RU")}</span>
          </span>
          <span className="tb-spacer" />
          <button type="button" className="tb-btn" aria-label="Уведомления">
            <Bell />
            {values.badge > 0 && <span className="tb-badge">{values.badge}</span>}
          </button>
          <button type="button" className="tb-btn" aria-label="Настройки">
            <Gear />
          </button>
        </div>
      </div>
      {assets.status === "missing" && (
        <div className="tb-assetwarn" title={assets.missing.join(", ")}>
          {Object.keys(assets.cards).length}/40 карт · topbar {assets.topbarHtml ? "OK" : "fallback port"}
        </div>
      )}
    </div>
  );
}
