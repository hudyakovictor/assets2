import { useMemo } from "react";
import { useAssets, cardColor } from "../lib/assets";
import type { ChartTreatment, Page } from "../lib/pages";

/* ---------------- Skill card icon (real SVG from skill-card-icons.zip) ---------------- */
export function SkillIcon({
  id,
  className = "",
  style,
}: {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const assets = useAssets();
  const isCard = /^c\d+$/i.test(id);
  const num = Number(id.replace(/^c/i, ""));
  const svg = isCard ? assets.cards[num] : assets.topbarSvgs[id.toLowerCase()];
  if (!svg)
    return (
      <div
        className={`grid place-items-center rounded-full border border-dashed border-[#C56861] text-[9px] font-bold text-[#C56861] ${className}`}
        style={style}
      >
        {id}
      </div>
    );
  return (
    <div
      className={`skill-icon ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/* ---------------- Skill card ---------------- */
export function SkillCard({
  id,
  size = 1,
  locked = false,
  className = "",
}: {
  id: string;
  size?: number;
  locked?: boolean;
  className?: string;
}) {
  const col = cardColor(Number(id.replace(/^c/i, "")));
  return (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-[22px] mp-pop-in ${className}`}
      style={{
        aspectRatio: "1 / 1",
        width: `${size * 100}%`,
        background: `radial-gradient(120% 100% at 50% 0%, ${col} 0%, ${col} 62%, rgba(0,0,0,.28) 100%)`,
        border: "1.5px solid rgba(255,255,255,.22)",
        boxShadow: locked
          ? "inset 0 1px 0 rgba(255,255,255,.12)"
          : `0 4px 0 rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.28), 0 12px 26px -14px ${col}`,
        opacity: locked ? 0.42 : 1,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 42%, rgba(255,255,255,.16), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-[7px] rounded-[17px] border border-white/20"
        aria-hidden
      />
      <div className="relative w-[62%]" style={{ aspectRatio: "1 / 1" }}>
        <SkillIcon id={id} className="h-full w-full" />
      </div>
      <span className="absolute bottom-[9px] left-0 right-0 text-center text-[9px] font-bold tracking-[.14em] text-white/85">
        {id.toUpperCase()}
      </span>
    </div>
  );
}

/* ---------------- deterministic series ---------------- */
function series(seed: number, n = 48) {
  let s = seed || 7;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const r = (s / 0x7fffffff) * 2 - 1;
    out.push(r);
  }
  return out;
}

function buildPath(vals: number[], w: number, h: number, pad = 6) {
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = pad + (1 - (v - min) / span) * (h - pad * 2);
    return [x, y] as [number, number];
  });
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx.toFixed(1)} ${y0.toFixed(1)}, ${cx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return { d, pts };
}

/* ---------------- Chart ---------------- */
export function Chart({
  treatment,
  seed,
  tint = "#2EE6C8",
  up = true,
  dashed = false,
  className = "",
}: {
  treatment: ChartTreatment;
  seed: number;
  tint?: string;
  up?: boolean;
  dashed?: boolean;
  className?: string;
}) {
  const W = 300;
  const H = 150;
  const vals = useMemo(() => {
    const raw = series(seed, 52);
    const drift = raw.map((v, i) => v * 0.5 + Math.sin(i / 7) * 0.7 + i / 46);
    return drift;
  }, [seed]);
  const { d, pts } = useMemo(() => buildPath(vals, W, H, 8), [vals]);
  const gid = `g${seed}${treatment}`;

  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label="Исторический сценарий цены"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tint} stopOpacity="0.42" />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </linearGradient>
        <filter id={`f${gid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1="0"
          x2={W}
          y1={H * p}
          y2={H * p}
          stroke="#ffffff"
          strokeOpacity="0.06"
          strokeWidth="1"
        />
      ))}

      {treatment === "area" && (
        <path
          d={`${d} L ${W} ${H} L 0 ${H} Z`}
          fill={`url(#${gid})`}
          stroke="none"
        />
      )}

      {treatment === "candles" ? (
        vals.map((v, i) => {
          if (i % 3) return null;
          const x = (i / (vals.length - 1)) * W;
          const o = vals[Math.max(0, i - 1)];
          const hi = Math.max(v, o) + 0.06;
          const lo = Math.min(v, o) - 0.06;
          const min = Math.min(...vals);
          const max = Math.max(...vals);
          const span = max - min || 1;
          const y = (n: number) => 8 + (1 - (n - min) / span) * (H - 16);
          const green = v >= o;
          const col = green ? "#2EE6A8" : "#FF6B6B";
          return (
            <g key={i}>
              <line
                x1={x}
                x2={x}
                y1={y(hi)}
                y2={y(lo)}
                stroke={col}
                strokeOpacity=".65"
                strokeWidth="1"
              />
              <rect
                x={x - 2}
                width="4"
                y={Math.min(y(v), y(o))}
                height={Math.max(1.6, Math.abs(y(v) - y(o)))}
                fill={col}
                rx="1"
              />
            </g>
          );
        })
      ) : (
        <path
          d={d}
          fill="none"
          stroke={up ? "#2EE6A8" : "#FF6B6B"}
          strokeWidth={treatment === "minimal" ? 1.4 : 2}
          strokeOpacity={treatment === "minimal" ? 0.9 : 1}
          strokeDasharray={dashed ? "4 4" : undefined}
          strokeLinecap="round"
          filter={treatment === "line-glow" ? `url(#f${gid})` : undefined}
          className={dashed ? "" : "chart-draw"}
          style={{ ["--dash" as string]: "1400" }}
        />
      )}

      {treatment !== "candles" && treatment !== "minimal" && (
        <>
          <circle cx={last[0]} cy={last[1]} r="3" fill={tint} />
          <circle cx={last[0]} cy={last[1]} r="6.5" fill={tint} opacity=".22" />
        </>
      )}
    </svg>
  );
}

/* ---------------- Bottom navigation (locked) ---------------- */
export const NAV = [
  { id: "academy", label: "Академия" },
  { id: "arena", label: "Арена" },
  { id: "profile", label: "Профиль" },
] as const;

export function navActiveOf(page: Page): string {
  if (page.kind === "academy" || page.kind === "academyTopic" || page.kind === "deck") return "academy";
  if (page.kind === "loadout" || page.kind === "arenaHub" || page.kind === "runChart") return "arena";
  if (page.kind === "profile") return "profile";
  return "arena";
}

function NavAcademyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L2 9L12 15L22 9L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 12.5V17C6 19.2 8.7 21 12 21C15.3 21 18 19.2 18 17V12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function NavArenaIcon() {
  /* Скрещённые японские свечи: тело = клинок, фитиль = остриё. Не средневековые мечи. */
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <g transform="rotate(-40 12 12)">
        <line x1="12" y1="3" x2="12" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="10" y="7" width="4" height="8" rx="1" fill="currentColor" />
        <line x1="12" y1="15" x2="12" y2="20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <g transform="rotate(40 12 12)">
        <line x1="12" y1="3" x2="12" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="10" y="7" width="4" height="8" rx="1" fill="currentColor" opacity=".85" />
        <line x1="12" y1="15" x2="12" y2="20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}
function NavProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19C5.8 15.8 8.4 14 12 14C15.6 14 18.2 15.8 19 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const NAV_COLOR: Record<string, string> = {
  academy: "#FFC94D",
  arena: "#2EE6C8",
  profile: "#8B72D4",
};

export function BottomNav({
  active,
  onNav,
}: {
  active: string;
  onNav: (id: string) => void;
}) {
  return (
    <nav className="shrink-0 border-t border-white/10 bg-[#0a1120]/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-[7px] backdrop-blur">
      <ul className="flex items-stretch justify-around gap-1.5">
        {NAV.map((n) => {
          const on = n.id === active;
          const col = NAV_COLOR[n.id] ?? "#2EE6C8";
          return (
            <li key={n.id} className="flex-1">
              <button
                onClick={() => onNav(n.id)}
                className="tap-soft relative flex w-full flex-col items-center justify-center gap-[2px] rounded-2xl py-[7px]"
                style={{
                  color: on ? col : "#7f90a8",
                  background: on ? `${col}1F` : "transparent",
                  border: on ? `1.5px solid ${col}55` : "1.5px solid transparent",
                  boxShadow: on ? `inset 0 1px 0 ${col}33` : "none",
                }}
              >
                {n.id === "academy" && <NavAcademyIcon />}
                {n.id === "arena" && <NavArenaIcon />}
                {n.id === "profile" && <NavProfileIcon />}
                <span className="text-[10.5px] font-bold tracking-tight">
                  {n.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------------- Buttons ---------------- */
function haptic(pattern: number | number[] = 12) {
  try { navigator.vibrate?.(pattern as VibratePattern); } catch { /* noop */ }
}

/* Casual-2D "gummy" button: чуть выпуклый градиент + плотная нижняя грань,
   которая проседает при нажатии — тактильный отклик как в казуальных играх. */
export function Cta({
  children,
  onClick,
  tone = "signal",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "signal" | "ghost" | "danger";
}) {
  const styles =
    tone === "signal"
      ? {
          background: "linear-gradient(180deg,#5CF7DD 0%,#1FCBAE 46%,#0FA88E 100%)",
          color: "#04241F",
          boxShadow: "0 5px 0 #0C7E6B, 0 10px 20px -6px rgba(15,168,142,.55), inset 0 1px 0 rgba(255,255,255,.55)",
          border: "1.5px solid rgba(255,255,255,.35)",
        }
      : tone === "danger"
        ? {
            background: "linear-gradient(180deg,#FF9187 0%,#EB635B 46%,#C8453E 100%)",
            color: "#320705",
            boxShadow: "0 5px 0 #8E2E28, 0 10px 20px -6px rgba(200,69,62,.55), inset 0 1px 0 rgba(255,255,255,.45)",
            border: "1.5px solid rgba(255,255,255,.3)",
          }
        : {
            background: "linear-gradient(180deg,#2B3A50 0%,#1B2636 100%)",
            color: "#dbe6f5",
            boxShadow: "0 4px 0 #0F1622, inset 0 1px 0 rgba(255,255,255,.08)",
            border: "1.5px solid rgba(255,255,255,.08)",
          };
  return (
    <button
      onClick={() => { haptic(tone === "danger" ? [16, 30, 16] : 12); onClick?.(); }}
      data-cta="cta"
      className="tap-gum flex w-full items-center justify-center gap-2 rounded-[20px] px-4 py-[14px] text-[14.5px] font-black tracking-tight"
      style={styles}
    >
      {children}
    </button>
  );
}

export function Pill({
  children,
  color = "#7f90a8",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-[4px] text-[9.5px] font-black tracking-[.1em] uppercase"
      style={{
        color,
        background: `${color}26`,
        border: `1.5px solid ${color}55`,
        boxShadow: `inset 0 1px 0 ${color}22`,
      }}
    >
      {children}
    </span>
  );
}

/* Плотная «плитка» с лёгкой 3D-гранью — базовый строительный блок вместо
   плоского bg-white/[.04], который делал весь экран монотонным. */
export function Tile({
  children,
  accent,
  active = false,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  accent?: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const col = accent ?? "#2EE6C8";
  const Comp: "button" | "div" = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={`${onClick ? "tap-soft text-left" : ""} block w-full rounded-2xl px-3 py-2.5 ${className}`}
      style={{
        background: active ? `${col}1A` : "linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02))",
        border: `1.5px solid ${active ? `${col}80` : "rgba(255,255,255,.09)"}`,
        boxShadow: active
          ? `0 3px 0 ${col}33, inset 0 1px 0 rgba(255,255,255,.08)`
          : "0 3px 0 rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.06)",
      }}
    >
      {children}
    </Comp>
  );
}
