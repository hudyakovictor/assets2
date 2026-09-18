import { repoAsset } from '../data';

/* =========================================================================
   SHARED_TOP_BAR_LOCKED
   Source of truth: repo topbar/topbar.html  (+ topbar/icons/*.svg)
   Slot order fixed by source: LVL badge · XP bar · attempts · stars · coins
                               · bell(+badge) · gear
   Locked: height 52, order, icon set, spacing, radii, gradients, type scale,
           container shapes, active states.
   Dynamic only: lvl, xp/xpMax, attempts, stars, coins, notif, disabled.
   ========================================================================= */

export interface TopBarState {
  lvl: number; xp: number; xpMax: number;
  attempts: number; attemptsMax: number;
  stars: number; coins: number; notif: number;
  disabled?: boolean;
}

export const TOPBAR_DEFAULT: TopBarState = {
  lvl: 7, xp: 420, xpMax: 600, attempts: 5, attemptsMax: 5,
  stars: 48, coins: 320, notif: 2,
};

function Chip({ icon, value, tone, dim }: { icon: React.ReactNode; value: string; tone: string; dim?: boolean }) {
  return (
    <div
      className="g-inset flex h-[30px] min-w-0 items-center gap-1 rounded-[9px] px-[6px]"
      style={{ borderColor: dim ? 'rgba(120,190,210,.10)' : `${tone}38` }}
    >
      <span className="h-[13px] w-[13px] shrink-0" style={{ color: dim ? '#44586b' : tone }}>{icon}</span>
      <span className="tnum font-mono text-[11px] font-extrabold leading-none"
        style={{ color: dim ? '#44586b' : '#e8f1f5' }}>{value}</span>
    </div>
  );
}

export default function TopBar({ s }: { s: TopBarState }) {
  const pct = Math.max(0, Math.min(100, (s.xp / s.xpMax) * 100));
  const dim = !!s.disabled;

  return (
    <div className="w-full px-[10px] pt-[10px]" style={{ paddingTop: 'max(10px, env(safe-area-inset-top))' }}>
      <div className="hud-bar g-raise flex h-[52px] items-center gap-[6px] rounded-[15px] px-[8px]">

        {/* ---- LVL + XP (locked composite slot) ---- */}
        <div className="hud-xp flex h-[36px] min-w-0 flex-1 items-center gap-[7px] rounded-[11px] px-[5px]">
          <div className="relative grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px]"
            style={{
              background: dim ? 'linear-gradient(160deg,#16242f,#0d1720)' : 'linear-gradient(160deg,#17544a,#0d2f2b)',
              border: `1px solid ${dim ? 'rgba(120,190,210,.12)' : 'rgba(47,224,192,.32)'}`,
            }}>
            <span className="font-mono text-[7px] font-extrabold leading-none tracking-[.06em]"
              style={{ color: dim ? '#44586b' : '#7fe6d2' }}>LVL</span>
            <span className="tnum font-mono text-[12px] font-extrabold leading-none"
              style={{ color: dim ? '#5b6e7e' : '#fff', marginTop: 1 }}>{String(s.lvl).padStart(2, '0')}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-[3px] flex items-baseline justify-between gap-1">
              <span className="text-[8px] font-extrabold uppercase tracking-[.14em]" style={{ color: '#6a8296' }}>XP</span>
              <span className="tnum font-mono text-[9.5px] font-bold leading-none" style={{ color: dim ? '#44586b' : '#9fb4c4' }}>
                {s.xp}<span style={{ color: '#4e6377' }}>/{s.xpMax}</span>
              </span>
            </div>
            <div className="g-inset h-[7px] w-full overflow-hidden rounded-full p-0">
              <div className="relative h-full rounded-full transition-[width] duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  background: dim ? '#2a3a47' : 'linear-gradient(90deg,#1aa88f,#2fe0c0)',
                  boxShadow: dim ? 'none' : '0 0 10px rgba(47,224,192,.5)',
                }} />
            </div>
          </div>
        </div>

        {/* ---- stats: lightning · star · coin ---- */}
        <Chip dim={dim} tone="#2fe0c0" icon={<img src={repoAsset('topbar/icons/lightning.svg')} alt="" className="h-full w-full object-contain" />} value={`${s.attempts}/${s.attemptsMax}`} />
        <Chip dim={dim} tone="#e9c46a" icon={<img src={repoAsset('topbar/icons/star.svg')} alt="" className="h-full w-full object-contain" />} value={String(s.stars)} />
        <Chip dim={dim} tone="#D0B24A" icon={<img src={repoAsset('topbar/icons/coin.svg')} alt="" className="h-full w-full object-contain" />} value={String(s.coins)} />

        {/* ---- bell ---- */}
        <button aria-label="Уведомления"
          className="hud-hit press-sm focus-ring g-inset relative grid h-[32px] w-[32px] shrink-0 place-items-center rounded-[10px]">
          <img src={repoAsset('topbar/icons/bell.svg')} alt="" className="h-[17px] w-[17px] object-contain" />
          {s.notif > 0 && !dim && (
            <span className="tnum absolute -right-[3px] -top-[3px] grid h-[15px] min-w-[15px] place-items-center rounded-full px-[3px] font-mono text-[8px] font-extrabold text-[#0b0f14]"
              style={{ background: '#ff5a72', boxShadow: '0 0 0 2px #0b1a2c' }}>{s.notif > 9 ? '9+' : s.notif}</span>
          )}
        </button>

        {/* ---- gear ---- */}
        <button aria-label="Настройки"
          className="hud-hit press-sm focus-ring g-inset relative grid h-[32px] w-[32px] shrink-0 place-items-center rounded-[10px]">
          <img src={repoAsset('topbar/icons/gear.svg')} alt="" className="h-[17px] w-[17px] object-contain" />
        </button>
      </div>
    </div>
  );
}
