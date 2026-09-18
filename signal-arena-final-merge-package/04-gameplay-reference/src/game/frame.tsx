/* ============================================================================
   SHARED_TOP_BAR_LOCKED + navigation + shell primitives.
   Top Bar geometry/order/typography is fixed by topbar/topbar.html:
   LVL chip → XP bar → energy(bolt) → stars → coins → bell(+badge) → gear.
   Only dynamic values may change (LVL, XP, energy, stars, coins, badge, state).
   ========================================================================== */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Icon, IconBell, IconBolt, IconCoin, IconGear, IconStar, EmblemCompact } from "../icons/ui";
import { ScreenBackground } from "./art";
import { sfx, haptic } from "./sfx";

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export interface TopBarState {
  lvl: number;
  xp: number;
  xpMax: number;
  energy: number;
  energyMax: number;
  stars: number;
  coins: number;
  badge?: number | null;
  /** empty/disabled state — welcome screen shows zeros */
  empty?: boolean;
  /** MVP: false — только 5 иконок; true — расширенный вид из topbar.html (Профиль) */
  showLevel?: boolean;
  onBell?: () => void;
  onGear?: () => void;
}

export function TopBar(s: TopBarState) {
  const pct = Math.max(0, Math.min(1, s.xp / s.xpMax));
  const zero = s.empty;
  const badge = zero ? null : s.badge;
  return (
    <header
      className="tb-root px-2 pt-1.5"
      style={{ height: "var(--topbar-h)", flex: "none" }}
      aria-label="Top Bar"
      data-qa-critical="top-bar"
    >
      <div className="canonical-topbar">
        {/* game.html: «Верхняя панель — только пять иконок: попытки, звёзды, монеты, уведомления, настройки».
            LVL/XP из topbar.html — демонстрационные, в MVP их нет; прогресс живёт в Профиле. */}
        {s.showLevel && (
          <>
            <div className="canonical-lvl">
              <small>LVL</small>
              <strong>{zero ? "—" : String(s.lvl).padStart(2, "0")}</strong>
            </div>
            <div className="canonical-xp min-w-0">
              <div className="canonical-xp-text tabular">
                {zero ? "0" : fmt(s.xp)} <span>/ {zero ? "0" : fmt(s.xpMax)} XP</span>
              </div>
              <div className="canonical-xp-bar">
                <span style={{ width: `${zero ? 0 : pct * 100}%` }} />
              </div>
            </div>
          </>
        )}

        <div className="canonical-spacer" />
        <CanonicalStat icon={<IconBolt size={24} />} value={zero ? "0/0" : `${s.energy}/${s.energyMax}`} />
        <span className="canonical-divider" />
        <CanonicalStat icon={<IconStar size={24} />} value={zero ? "0" : fmt(s.stars)} />
        <span className="canonical-divider" />
        <CanonicalStat icon={<IconCoin size={24} />} value={zero ? "0" : fmt(s.coins)} />
        <button type="button" className="canonical-icon-btn" onClick={s.onBell} aria-label="Уведомления">
          <IconBell size={25} />
          {badge ? <span className="canonical-badge">{badge}</span> : null}
        </button>
        <button type="button" className="canonical-icon-btn" onClick={s.onGear} aria-label="Настройки">
          <IconGear size={25} />
        </button>
      </div>
    </header>
  );
}

function CanonicalStat({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="canonical-stat tabular">
      {icon}
      <span>{value}</span>
    </div>
  );
}

/* game.html: «Меню: Академия — Арена — Профиль». Коллекция карт живёт внутри Академии,
   служебные экраны — внутри Профиля. */
export type NavKey = "academy" | "arena" | "profile";

export function BottomNav({ active, onNav, advice }: { active: NavKey; onNav: (k: NavKey) => void; advice?: string }) {
  const items: { k: NavKey; label: string; icon: "navAcademy" | "navArena" | "user" }[] = [
    { k: "academy", label: "АКАДЕМИЯ", icon: "navAcademy" },
    { k: "arena", label: "АРЕНА", icon: "navArena" },
    { k: "profile", label: "ПРОФИЛЬ", icon: "user" },
  ];
  return (
    <nav className="dock" data-qa-critical="bottom-nav">
      {advice && <span className="sr-only">{advice}</span>}
      {items.map((it) => (
        <button
          key={it.k}
          type="button"
          onClick={() => { if (it.k !== active) sfx.tick(); onNav(it.k); }}
          className={`navitem ${it.k === active ? "is-active" : ""}`}
          aria-current={it.k === active}
        >
          <Icon name={it.icon} size={26} />
          <span className="navlabel">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

/** Screenshell: background art + locked Top Bar + content + bottom nav */
export function Shell({
  bg, top, nav, children, lockScroll = true, footer, className = "", bgStyle, bgPar,
}: {
  bg: string;
  top?: TopBarState | null;
  nav?: { active: NavKey; onNav: (k: NavKey) => void } | null;
  children: ReactNode;
  lockScroll?: boolean;
  footer?: ReactNode;
  className?: string;
  bgStyle?: React.CSSProperties;
  bgPar?: string;
}) {
  return (
    <div className={`screen ${className}`} data-screen>
      <ScreenBackground assetId={bg} style={bgStyle} par={bgPar} />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {top !== null && top !== undefined && <TopBar {...top} />}
        <main
          className="flex min-h-0 flex-1 flex-col gap-[var(--gap)] px-[var(--pad)] pb-2 pt-1"
          style={{ overflowY: lockScroll ? "hidden" : "auto" }}
          data-qa-critical="content"
        >
          {children}
        </main>
        {footer}
        {nav && <BottomNav active={nav.active} onNav={nav.onNav} />}
      </div>
    </div>
  );
}

/* ============================================================================
   COMPOSE — реальная система компоновок A/B/C/D.
   Слоты именованные, поэтому порядок и пропорции задаются явно, а не хрупким
   nth-child. Стиль, тексты, механика и данные одинаковы; отличаются верстка,
   пропорции зон, визуальные эффекты и характер подачи.
   CTA всегда последний и не сжимается. Top Bar и нижнее меню — вне Compose.
   ========================================================================== */
export type Composition = "A" | "B" | "C" | "D";

export const COMPOSITION_NAME: Record<Composition, string> = {
  A: "EDITORIAL STACK",
  B: "IMMERSIVE MEDIA",
  C: "EVIDENCE FIRST",
  D: "SPLIT TENSION",
};

export function Compose({
  composition = "A", head, media, body, cta, mediaMin = 108, interactiveMedia = false, mediaMax,
}: {
  composition?: Composition;
  head?: ReactNode;
  media?: ReactNode;
  body?: ReactNode;
  cta?: ReactNode;
  mediaMin?: number;
  /** интерактивный график: оверлеи поверх медиа запрещены, split идёт вертикально */
  interactiveMedia?: boolean;
  /** ограничение доли медиа (ТЗ tutorial: ≤42% высоты) */
  mediaMax?: string;
}) {
  const ctaNode = cta ? <div className="compose-cta" style={{ minHeight: 64 }}>{cta}</div> : null;
  const cap = mediaMax ? { maxHeight: mediaMax } : {};

  if (composition === "B") {
    return (
      <div className="compose compose-b">
        {interactiveMedia && head}
        {media && (
          <div className="compose-media-hero" style={{ flex: "1 1 50%", minHeight: Math.max(mediaMin, 150), ...cap }}>
            <div className="compose-media-fill">{media}</div>
            {/* заголовок поверх медиа только для неинтерактивного контента */}
            {head && !interactiveMedia && <div className="compose-head-overlay" style={{ pointerEvents: "none" }}>{head}</div>}
          </div>
        )}
        {!media && head}
        {body && <div className="compose-body compose-scrollable">{body}</div>}
        {ctaNode}
      </div>
    );
  }

  if (composition === "C") {
    /* evidence first: короткий текст сверху, ВИЗУАЛ занимает дыру, CTA снизу */
    return (
      <div className="compose compose-c">
        {head && <div className="compose-head-compact">{head}</div>}
        {body && <div className="compose-body compose-body-lead">{body}</div>}
        {media && (
          <div className="compose-media-strip" style={{ flex: "1 1 auto", minHeight: Math.max(mediaMin, 160), ...cap }}>
            {media}
          </div>
        )}
        {ctaNode}
      </div>
    );
  }

  if (composition === "D") {
    return (
      <div className="compose compose-d">
        {head}
        <div className={`compose-split ${interactiveMedia ? "is-vertical" : ""}`}>
          {media && <div className="compose-split-media" style={{ minHeight: mediaMin, ...cap }}>{media}</div>}
          {body && <div className="compose-split-body compose-scrollable">{body}</div>}
        </div>
        {ctaNode}
      </div>
    );
  }

  return (
    <div className="compose compose-a">
      {head}
      {media && <div className="compose-media" style={{ flex: "1 1 36%", minHeight: mediaMin, ...cap }}>{media}</div>}
      {body && <div className="compose-body compose-scrollable">{body}</div>}
      {ctaNode}
    </div>
  );
}

export function Panel({ children, className = "", inset = false, onClick, style }: {
  children: ReactNode; className?: string; inset?: boolean; onClick?: () => void; style?: React.CSSProperties;
}) {
  return (
    <section onClick={onClick} className={`${inset ? "panel-inset" : "panel"} ${className}`} style={style}>
      {children}
    </section>
  );
}

export function Chip({ children, tone, icon, solid }: { children: ReactNode; tone?: string; icon?: ReactNode; solid?: boolean }) {
  /* solid chip = плотная цветная плашка с белой каймой и белым текстом (как теги ПАНИКА/КИТ/ФУНДАМЕНТ) */
  return (
    <span
      className="chip"
      style={solid ? { borderColor: "rgba(255,255,255,.55)", background: tone, color: "#fff", textShadow: "0 1px 0 rgba(0,0,0,.35)" } : undefined}
    >
      {icon}
      {children}
    </span>
  );
}

export function Btn({
  children, tone = "primary", icon, sub, onClick, disabled, selected, className = "", style,
}: {
  children: ReactNode;
  tone?: "primary" | "green" | "blue" | "red" | "yellow" | "ghost";
  icon?: ReactNode;
  sub?: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const map = { primary: "btn-primary", green: "btn-green", blue: "btn-blue", red: "btn-red", yellow: "btn-yellow", ghost: "btn-ghost" } as const;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => { sfx.tick(); haptic("light"); onClick?.(); }}
      className={`btn ${map[tone]} ${selected ? "btn-selected" : ""} ${className}`}
      style={style}
    >
      {icon}
      <span className="flex min-w-0 flex-col">
        <span style={{ fontWeight: 700 }}>{children}</span>
        {sub && <span className="micro" style={{ color: "rgba(255,255,255,.72)", letterSpacing: ".08em" }}>{sub}</span>}
      </span>
    </button>
  );
}

export function Progress({ value, label, right }: { value: number; label?: string; right?: string }) {
  return (
    <div className="w-full">
      {(label || right) && (
        <div className="mb-1 flex items-center justify-between">
          <span className="micro">{label}</span>
          <span className="meta tabular">{right}</span>
        </div>
      )}
      <div className="meter">
        <span style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
      </div>
    </div>
  );
}

export function ScreenTitle({ kicker, title, right, tone = "var(--accent)" }: { kicker?: string; title: string; right?: ReactNode; tone?: string }) {
  const long = title.length > 18;
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        {kicker && <div className="micro truncate" style={{ color: tone }}>{kicker}</div>}
        <h1 className="h1" style={{ fontSize: long ? "calc(var(--type-h1) * 0.82)" : undefined, textWrap: "balance" }}>{title}</h1>
      </div>
      {right && <div style={{ flex: "none" }}>{right}</div>}
    </div>
  );
}

/** Терминальное окно из референса: три точки + вкладки инструментов + тело. */
export type TermTool = "candles" | "news" | "depth" | "whale" | "calendar" | "chat";
const TERM_TOOLS: { k: TermTool; icon: "chartLine" | "news" | "layers" | "whale" | "calendar" | "bubble" }[] = [
  { k: "candles", icon: "chartLine" },
  { k: "news", icon: "news" },
  { k: "depth", icon: "layers" },
  { k: "whale", icon: "whale" },
  { k: "calendar", icon: "calendar" },
  { k: "chat", icon: "bubble" },
];

export function Terminal({ active, onTool, children, tap }: {
  active: TermTool; onTool?: (t: TermTool) => void; children: ReactNode; tap?: boolean;
}) {
  return (
    <div className={`term ${tap ? "is-tap" : ""}`}>
      <div className="term-bar">
        <span className="term-dots"><i /><i /><i /></span>
        <div className="term-tabs">
          {TERM_TOOLS.map((t) => (
            <button key={t.k} type="button" className={`term-tab ${t.k === active ? "is-on" : ""}`}
              onClick={() => { sfx.tick(); onTool?.(t.k); }} aria-label={t.k}>
              <Icon name={t.icon} size={20} />
            </button>
          ))}
          <span className="term-tab is-plus"><Icon name="spark" size={16} /></span>
        </div>
      </div>
      <div className="term-body">{children}</div>
    </div>
  );
}

/** Ремарка рынка: одна строка сарказма с иконкой-реплики над контентом. */
export function MarketRemark({ children }: { children: ReactNode }) {
  /* референс: бирюзовое «облачко» + крупная жирная реплика рынка */
  return (
    <div className="flex items-center gap-2.5" style={{ minHeight: 30, padding: "0 2px" }}>
      <span className="grid h-8 w-8 flex-none place-items-center rounded-full" style={{ background: "linear-gradient(180deg,#46d3b1,var(--accent-deep))", border: "2px solid rgba(255,255,255,.55)", color: "#fff", boxShadow: "inset 0 1px 0 rgba(255,255,255,.35), 0 3px 0 rgba(0,0,0,.3)" }}>
        <Icon name="bubble" size={16} />
      </span>
      <span style={{ color: "#EAF3FF", fontWeight: 800, fontSize: "calc(var(--type-body) * 1.08)", lineHeight: 1.15, textShadow: "0 1px 0 rgba(0,0,0,.4)" }}>{children}</span>
    </div>
  );
}

/** Hold-to-seal control: springy press, hit-stop at completion */
export function HoldToSeal({ label = "УДЕРЖИВАЙ ПЕЧАТЬ", onSeal, ms = 1400, sealArt }: { label?: string; onSeal: () => void; ms?: number; sealArt?: ReactNode }) {
  const [p, setP] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number>(0);
  const holding = useRef(false);
  const done = useRef(false);

  const stop = () => {
    holding.current = false;
    if (raf.current) cancelAnimationFrame(raf.current);
    if (!done.current) setP(0);
  };
  useEffect(() => () => stop(), []);

  const loop = () => {
    const t = (performance.now() - start.current) / ms;
    const next = Math.min(1, t);
    setP(next);
    if (next >= 1 && !done.current) {
      done.current = true;
      holding.current = false;
      sfx.seal();
      onSeal();
      return;
    }
    if (holding.current) raf.current = requestAnimationFrame(loop);
  };

  const begin = () => {
    if (done.current) return;
    holding.current = true;
    start.current = performance.now();
    sfx.scrub();
    raf.current = requestAnimationFrame(loop);
  };

  const R2 = 26;
  const circ = 2 * Math.PI * R2;
  return (
    <button
      type="button"
      onPointerDown={begin}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      className="btn btn-primary w-full"
      style={{ minHeight: 62, justifyContent: "flex-start", paddingLeft: 6 }}
      aria-label={label}
    >
      <span className="grid place-items-center" style={{ width: 54, height: 54, position: "relative", flex: "none" }}>
        <svg width="58" height="58" viewBox="0 0 58 58" style={{ position: "absolute", inset: 0 }}>
          <circle cx="29" cy="29" r={R2} fill="rgba(4,20,16,.5)" stroke="rgba(255,255,255,.25)" strokeWidth="3" />
          <circle
            cx="29" cy="29" r={R2} fill="none" stroke="#EAFFF9" strokeWidth="3.4" strokeLinecap="round"
            strokeDasharray={`${circ * p} ${circ}`} transform="rotate(-90 29 29)"
          />
        </svg>
        <span className="grid place-items-center" style={{ width: 40, height: 40 }}>{sealArt ?? <EmblemCompact size={30} />}</span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start">
        <span style={{ fontWeight: 800, letterSpacing: ".02em" }}>{label}</span>
        <span className="micro" style={{ color: "rgba(255,255,255,.75)" }}>
          {p > 0 ? `${Math.round(p * 100)}% · решение фиксируется` : "переиграть решение нельзя"}
        </span>
      </span>
    </button>
  );
}

/** Density hook: scales type/spacing for small WebView heights (no scroll needed) */
export function useDensity(ref: React.RefObject<HTMLElement | null>, height: number) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compact = height <= 640;
    const tiny = height <= 580;
    el.style.setProperty("--density", tiny ? "0.82" : compact ? "0.88" : "1");
    el.dataset.compact = compact ? "true" : "false";
    el.dataset.tiny = tiny ? "true" : "false";
  }, [ref, height]);
}

export function Ticker({ items, cls = "" }: { items: string[]; cls?: string }) {
  const row = [...items, ...items];
  return (
    <div className={`relative overflow-hidden ${cls}`} style={{ height: 26, borderRadius: 10, border: "1px solid var(--stroke)", background: "rgba(6,15,27,.75)" }}>
      <div className="ticker-track absolute top-0 flex h-full items-center gap-6 pl-3" style={{ width: "max-content" }}>
        {row.map((t, i) => (
          <span key={i} className="micro whitespace-nowrap" style={{ color: "#CFE4FF" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
