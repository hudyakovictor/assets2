import { IcSmiley, IcCheck, IcLock } from '../icons';
import { GROUP_HEX, repoAsset, type Group } from '../data';

/* Shared game primitives — identical across every page variant.
   Variants may re-arrange these, never restyle them. */

export function Btn({
  children, tone = 'teal', size = 'md', full, onClick, disabled, icon, sub,
}: {
  children: React.ReactNode; tone?: 'teal' | 'ghost' | Group; size?: 'sm' | 'md' | 'lg';
  full?: boolean; onClick?: () => void; disabled?: boolean;
  icon?: React.ReactNode; sub?: string;
}) {
  const hex = tone === 'teal' ? '#2fe0c0' : tone === 'ghost' ? '#8fa7b8' : GROUP_HEX[tone as Group];
  const solid = tone === 'teal';
  /* touch targets: lg 52 · md 44 · sm 36 — never below 44 for primary actions */
  const pad = size === 'lg' ? 'h-[52px] px-5 text-[13px]' : size === 'sm' ? 'h-[36px] px-3 text-[11px]' : 'h-[44px] px-4 text-[12px]';
  return (
    <button onClick={onClick} disabled={disabled}
      className={`press focus-ring relative flex items-center justify-center gap-2 overflow-hidden rounded-[13px] font-extrabold tracking-[.01em] ${pad} ${full ? 'w-full' : ''} ${disabled ? 'opacity-40' : ''}`}
      style={solid ? {
        background: 'linear-gradient(180deg,#6af1d8 0%,#35d4b7 48%,#16977f 100%)', color: '#031410',
        border: '1px solid rgba(118,255,225,.72)',
        textShadow: '0 1px 0 rgba(255,255,255,.25)',
        boxShadow: '0 8px 20px -9px rgba(47,224,192,.95), inset 0 2px 0 rgba(255,255,255,.38), inset 0 -3px 0 rgba(1,79,66,.45)',
      } : {
        background: tone === 'ghost' ? 'linear-gradient(180deg,#29445f,#182f49)' : `linear-gradient(180deg, ${hex}66, ${hex}2e)`,
        border: `1px solid ${tone === 'ghost' ? 'rgba(159,197,217,.3)' : hex + '8c'}`, color: tone === 'ghost' ? '#e0edf4' : '#f7fbfc',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,.12), inset 0 -2px 0 rgba(0,0,0,.24), 0 7px 15px -11px #000',
      }}>
      {icon && <span className="grid h-[16px] w-[16px] shrink-0 place-items-center">{icon}</span>}
      <span className="flex min-w-0 flex-col items-start leading-tight">
        <span className="truncate">{children}</span>
        {sub && <span className="text-[9px] font-semibold opacity-70">{sub}</span>}
      </span>
    </button>
  );
}

export function Tile({ k, v, tone = '#2fe0c0', foot }: { k: string; v: React.ReactNode; tone?: string; foot?: string }) {
  return (
    <div className="g-card min-w-0 rounded-[13px] px-[10px] py-[9px]">
      <div className="truncate text-[9px] font-extrabold uppercase tracking-[.10em] text-[#8298aa]">{k}</div>
      <div className="tnum mt-[3px] font-mono text-[17px] font-extrabold leading-none" style={{ color: tone }}>{v}</div>
      {foot && <div className="mt-[3px] text-[8.5px] text-[#6a8296]">{foot}</div>}
    </div>
  );
}

export function Bar({ v, tone = '#2fe0c0', h = 6 }: { v: number; tone?: string; h?: number }) {
  return (
    <div className="g-inset w-full overflow-hidden rounded-full" style={{ height: h }}>
      <div className="h-full rounded-full transition-[width] duration-[900ms] ease-out"
        style={{ width: `${v}%`, background: `linear-gradient(90deg,${tone}99,${tone})`, boxShadow: `0 0 8px ${tone}66` }} />
    </div>
  );
}

export function Tag({ children, tone = '#2fe0c0' }: { children: React.ReactNode; tone?: string }) {
  return (
    <span className="rounded-[6px] px-[6px] py-[2px] text-[8.5px] font-extrabold uppercase tracking-[.1em]"
      style={{ background: `${tone}1f`, color: tone, border: `1px solid ${tone}33` }}>{children}</span>
  );
}

export function Head({ over, title, sub }: { over?: string; title: string; sub?: string }) {
  return (
    <div className="mb-[10px]">
      {over && <div className="mb-[4px] text-[9px] font-extrabold uppercase tracking-[.17em] text-[#51e5c8]">{over}</div>}
      <h2 className="text-[19px] font-extrabold leading-[1.12] tracking-[-.02em] text-[#f2f8fb]">{title}</h2>
      {sub && <p className="mt-[5px] text-[12px] leading-[1.42] text-[#91a7ba]">{sub}</p>}
    </div>
  );
}

/* Handwritten note — brand voice accent. Text in English, smiley is drawn, never emoji. */
export function HandNote({
  text = "IF YOU'RE HERE JUST FOR MONEY, YOU'RE EARLY. AND THAT'S BAD.",
  align = 'left', size = 15,
}: { text?: string; align?: 'left' | 'center'; size?: number }) {
  return (
    <div className={`a-wob flex items-end gap-[7px] ${align === 'center' ? 'justify-center' : ''}`}>
      <p className="hand hand-underline max-w-[250px] font-semibold" style={{ fontSize: size }}>{text}</p>
      <span className="mb-[2px] h-[17px] w-[17px] shrink-0 text-[#2fe0c0]/80"><IcSmiley className="h-full w-full" /></span>
    </div>
  );
}

export function SkillTile({
  name, id, group, tier, owned, src, dense,
}: { name: string; id: string; group: Group; tier: number; owned: boolean; src: string; dense?: boolean }) {
  const hex = GROUP_HEX[group];
  return (
    <button className="press-sm focus-ring relative flex flex-col items-center overflow-hidden rounded-[13px] p-[8px] text-center"
      style={{
        background: `linear-gradient(170deg, ${hex}24, ${hex}0a)`,
        border: `1px solid ${hex}${owned ? '59' : '26'}`,
        boxShadow: owned ? `0 0 18px -8px ${hex}` : 'none',
        opacity: owned ? 1 : 0.55,
      }}>
      {/* medallion: TURQUOISE negative space + WHITE glyph (icon never takes card colour) */}
      <div className="relative grid place-items-center rounded-full"
        style={{
          width: dense ? 36 : 44, height: dense ? 36 : 44,
          background: 'radial-gradient(circle at 34% 26%, #17998a 0%, #0c5f58 58%, #073f3c 100%)',
          boxShadow: `inset 0 1px 0 rgba(255,255,255,.28), inset 0 0 0 1px rgba(47,224,192,.35), 0 3px 10px -5px ${hex}`,
        }}>
        <img src={src} alt="" className={dense ? 'h-[26px] w-[26px] object-contain' : 'h-[32px] w-[32px] object-contain'} />
        {!owned && (
          <span className="absolute -bottom-[2px] -right-[2px] grid h-[15px] w-[15px] place-items-center rounded-full bg-[#0b1a2c] text-[#7d93a8]"
            style={{ border: '1px solid rgba(120,190,210,.2)' }}>
            <IcLock className="h-[9px] w-[9px]" />
          </span>
        )}
        {owned && tier >= 5 && (
          <span className="absolute -right-[3px] -top-[3px] grid h-[14px] w-[14px] place-items-center rounded-full bg-[#e9c46a] text-[#08121c]">
            <IcCheck className="h-[8px] w-[8px]" />
          </span>
        )}
      </div>
      {!dense && <span className="mt-[6px] line-clamp-2 text-[9.5px] font-bold leading-[1.2] text-[#dceaf1]">{name}</span>}
      <span className="mt-[3px] font-mono text-[7.5px] font-extrabold tracking-wider" style={{ color: hex }}>
        {id.toUpperCase()} · T{tier}
      </span>
    </button>
  );
}

export function Row({ children, gap = 8 }: { children: React.ReactNode; gap?: number }) {
  return <div className="flex items-stretch" style={{ gap }}>{children}</div>;
}

/* =========================================================================
   SKILL HAND — the action layer that was missing from every run screen.
   The deck (c01–c40) existed only in the collection, so during a scenario the
   player had no way to apply a skill. Four slots are drawn from the real
   repository SVGs and each one reads one dimension of the current setup.
   ========================================================================= */
export interface HandCard {
  id: string; label: string; src: string; group: Group; reading: string; locked?: boolean;
}

export function SkillHand({
  cards, played, onPlay, dense,
}: { cards: HandCard[]; played: string[]; onPlay: (id: string) => void; dense?: boolean }) {
  return (
    <div className="grid shrink-0 grid-cols-4 gap-[6px]">
      {cards.map(c => {
        const on = played.includes(c.id);
        const hex = GROUP_HEX[c.group];
        return (
          <button key={c.id} onClick={() => !c.locked && onPlay(c.id)} aria-disabled={c.locked}
            className="press focus-ring relative flex flex-col items-center justify-center overflow-hidden rounded-[12px] px-[4px] pb-[6px] pt-[7px]"
            style={{
              minHeight: dense ? 58 : 66,
              background: on ? `linear-gradient(175deg, ${hex}4d, ${hex}18)` : `linear-gradient(175deg, ${hex}22, ${hex}0a)`,
              border: `1px solid ${on ? hex : `${hex}45`}`,
              boxShadow: on ? `0 0 16px -6px ${hex}, inset 0 1px 0 rgba(255,255,255,.14)` : 'inset 0 1px 0 rgba(255,255,255,.07)',
              opacity: c.locked ? .45 : 1,
            }}>
            <span className="grid place-items-center rounded-full"
              style={{
                width: dense ? 26 : 30, height: dense ? 26 : 30,
                background: 'radial-gradient(circle at 34% 26%, #17998a, #073f3c)',
                boxShadow: 'inset 0 0 0 1px rgba(47,224,192,.35)',
              }}>
              <img src={c.src} alt="" className={dense ? 'h-[18px] w-[18px]' : 'h-[21px] w-[21px]'} />
            </span>
            <span className="mt-[5px] text-[8.5px] font-extrabold tracking-[.04em]"
              style={{ color: on ? '#eaf8f4' : '#a9c0cf' }}>{c.label}</span>
            {c.locked && (
              <span className="absolute right-[4px] top-[4px] grid h-[13px] w-[13px] place-items-center rounded-full bg-[#0b1a2c]">
                <IcLock className="h-[8px] w-[8px] text-[#7d93a8]" />
              </span>
            )}
            {on && (
              <span className="absolute right-[4px] top-[4px] grid h-[13px] w-[13px] place-items-center rounded-full" style={{ background: hex }}>
                <IcCheck className="h-[8px] w-[8px] text-white" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* Output of a played card. Keeps the read visible next to the decision. */
export function CardReading({ card }: { card: HandCard | null }) {
  if (!card) {
    return (
      <div className="g-inset shrink-0 rounded-[11px] px-[10px] py-[8px]">
        <p className="text-[10.5px] leading-[1.4] text-[#7d93a8]">
          Примени карту навыка, чтобы прочитать сетап. Карты не дают ответ — они дают факт.
        </p>
      </div>
    );
  }
  return (
    <div className="shrink-0 rounded-[11px] px-[10px] py-[8px]"
      style={{ background: `${GROUP_HEX[card.group]}1f`, border: `1px solid ${GROUP_HEX[card.group]}4d` }}>
      <div className="text-[8.5px] font-extrabold uppercase tracking-[.14em]" style={{ color: GROUP_HEX[card.group] }}>{card.label}</div>
      <p className="mt-[3px] text-[10.5px] leading-[1.4] text-[#cfe0ea]">{card.reading}</p>
    </div>
  );
}

/* Orientation rail: answers "where am I", "which step", "how many total".
   Required on every Arena run screen, not only inside tutorial cards. */
export function RunRail({ step, steps, label }: { step: number; steps: number; label: string }) {
  return (
    <div className="flex shrink-0 items-center gap-[7px]">
      <span className="shrink-0 text-[9px] font-extrabold uppercase tracking-[.12em] text-[#6a8296]">{label}</span>
      <span className="flex min-w-0 flex-1 gap-[4px]">
        {Array.from({ length: steps }, (_, i) => i + 1).map(n => (
          <span key={n} className="h-[3px] flex-1 rounded-full"
            style={{
              background: n <= step ? '#2fe0c0' : 'rgba(120,190,210,.16)',
              boxShadow: n === step ? '0 0 8px rgba(47,224,192,.6)' : 'none',
            }} />
        ))}
      </span>
      <span className="tnum shrink-0 font-mono text-[9px] font-extrabold text-[#2fe0c0]">{step}/{steps}</span>
    </div>
  );
}

/* Star value — drawn glyph, never a text symbol or emoji */
export function Stars({ n, size = 11, tone = '#e9c46a' }: { n: number | string; size?: number; tone?: string }) {
  return (
    <span className="inline-flex items-center gap-[3px] align-middle" style={{ color: tone }}>
      <span className="tnum font-mono font-extrabold" style={{ fontSize: size }}>{n}</span>
      <svg viewBox="0 0 24 24" style={{ width: size, height: size }} aria-label="звёзд">
        <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5-5.8-3.05-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z" fill="currentColor" />
      </svg>
    </span>
  );
}

/* Existing repository brand asset. No recreated logo is used inside the game. */
export function BrandMark({ className = '' }: { className?: string }) {
  return <img src={repoAsset('logo_concept.png')} alt="Signal Arena" className={`object-contain ${className}`} />;
}
