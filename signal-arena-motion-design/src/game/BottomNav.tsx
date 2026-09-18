import { NavAcademy, NavArena, NavMore } from '../icons';
import type { Section } from '../data';

const TABS: { id: Section; label: string; Icon: React.FC<{ className?: string }>; badge?: number }[] = [
  { id: 'ACADEMY',    label: 'АКАДЕМИЯ',  Icon: NavAcademy },
  { id: 'ARENA',      label: 'АРЕНА',     Icon: NavArena },
  { id: 'PROFILE',    label: 'ПРОФИЛЬ',   Icon: NavMore },
];

export default function BottomNav({
  active, onChange,
}: { active: Section; onChange: (s: Section) => void }) {
  return (
    <nav
      className="relative shrink-0 select-none"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
      aria-label="Основная навигация"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-5 h-5 bg-gradient-to-t from-[#050a12] to-transparent" />
      <div className="bottom-rail g-raise mx-[10px] flex h-[66px] items-stretch gap-[4px] rounded-[17px] px-[6px]">
        {TABS.map((t) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              aria-current={on ? 'page' : undefined}
              className="press-sm focus-ring relative flex min-w-0 flex-1 flex-col items-center justify-center gap-[3px] rounded-[13px]"
              aria-label={`Открыть раздел ${t.label}`}
              style={{
                background: on ? 'linear-gradient(180deg, rgba(75,235,207,.32), rgba(19,145,123,.25))' : 'transparent',
                border: `1px solid ${on ? 'rgba(89,241,214,.52)' : 'transparent'}`,
                boxShadow: on ? 'inset 0 2px 0 rgba(255,255,255,.12), inset 0 -2px 0 rgba(0,64,55,.25), 0 6px 14px -9px rgba(47,224,192,.9)' : 'none',
                minHeight: 46,
              }}
            >
              {on && (
                <span className="absolute -top-[1px] left-1/2 h-[2px] w-7 -translate-x-1/2 rounded-full"
                  style={{ background: '#2fe0c0', boxShadow: '0 0 10px rgba(47,224,192,.85)' }} />
              )}
              <span className="relative grid h-[21px] w-[21px] place-items-center"
                style={{ color: on ? '#eafffa' : '#7890a4' }}>
                <t.Icon className="h-full w-full" />
                {t.badge && !on && (
                  <span className="tnum absolute -right-[6px] -top-[4px] grid h-[13px] min-w-[13px] place-items-center rounded-full px-[3px] font-mono text-[7.5px] font-extrabold text-[#08121c]"
                    style={{ background: '#e9c46a' }}>{t.badge}</span>
                )}
              </span>
              <span className="text-[9.5px] font-extrabold tracking-[.045em]"
                style={{ color: on ? '#effcf9' : '#7890a4', textShadow: on ? '0 1px 4px rgba(0,0,0,.4)' : 'none' }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
