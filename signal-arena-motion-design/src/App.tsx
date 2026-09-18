import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import TopBar, { TOPBAR_DEFAULT, type TopBarState } from './game/TopBar';
import { RunProvider } from './game/run';
import BottomNav from './game/BottomNav';
import Screen from './game/Screens';
import Reports, { VIEWPORTS, type QaMap } from './workbench/Reports';
import {
  Emblem, IcSearch, IcChevL, IcChevR, IcCheck, IcCross, IcLayers, IcTarget, IcEye, IcGrid,
} from './icons';
import {
  PAGES, VARIANT_LABEL, VARIANT_NOTE, MISSING_ASSETS,
  SKILLS, GROUP_HEX, type Section, type PageDef,
} from './data';

const SECTION_ORDER: Section[] = ['ONBOARDING', 'ARENA', 'ACADEMY', 'PROFILE', 'SYSTEM'];
const SECTION_LABEL: Record<Section, string> = {
  ONBOARDING: 'Онбординг', ACADEMY: 'Академия', ARENA: 'Арена',
  PROFILE: 'Профиль', SYSTEM: 'Система',
};

const MOTION = ['rise', 'pop', 'sweep', 'none'] as const;
const FITS = ['contain', 'cover', 'fill'] as const;
const TINTS: { id: string; hex: string | null }[] = [
  { id: 'none', hex: null }, { id: 'teal', hex: '#2fe0c0' },
  { id: 'green', hex: '#2E7F5C' }, { id: 'yellow', hex: '#D0B24A' },
  { id: 'blue', hex: '#4C6180' }, { id: 'red', hex: '#C56861' },
];

interface Treat {
  fit: typeof FITS[number]; scale: number; x: number; y: number;
  opacity: number; tint: string; motion: typeof MOTION[number]; crop: number;
}
const DEFAULT_TREAT: Treat = { fit: 'contain', scale: 1, x: 0, y: 0, opacity: 1, tint: 'none', motion: 'rise', crop: 0 };

function topbarFor(p: PageDef): TopBarState {
  if (p.kind === 'welcome') return { ...TOPBAR_DEFAULT, lvl: 1, xp: 0, stars: 0, coins: 0, notif: 0, disabled: true };
  if (p.kind === 'seal' || p.kind === 'cinematic') return { ...TOPBAR_DEFAULT, attempts: 4 };
  if (p.kind === 'reveal' || p.kind === 'score') return { ...TOPBAR_DEFAULT, xp: 540, stars: 56, attempts: 4 };
  if (p.kind === 'postloss') return { ...TOPBAR_DEFAULT, attempts: 2, notif: 0 };
  if (p.kind === 'noattempts') return { ...TOPBAR_DEFAULT, attempts: 0, notif: 0 };
  if (p.kind === 'error') return { ...TOPBAR_DEFAULT, disabled: true, notif: 0 };
  if (p.kind === 'empty') return { ...TOPBAR_DEFAULT, lvl: 1, xp: 40, stars: 0, coins: 0, notif: 0 };
  return TOPBAR_DEFAULT;
}

export default function App() {
  const [pageId, setPageId] = useState('P07');
  const [variant, setVariant] = useState('A');
  const [q, setQ] = useState('');
  const [vpId, setVpId] = useState('390×844');
  const [nav, setNav] = useState<Section>('ARENA');
  const [drawer, setDrawer] = useState<'none' | 'pages' | 'assets'>('none');
  const [view, setView] = useState<'design' | 'compare' | 'docs' | 'export'>('design');
  const [treat, setTreat] = useState<Treat>(DEFAULT_TREAT);
  const [qa, setQa] = useState<QaMap>({});
  const stageRef = useRef<HTMLDivElement>(null);

  const page = useMemo(() => PAGES.find(p => p.id === pageId)!, [pageId]);
  const vp = useMemo(() => VIEWPORTS.find(v => v.id === vpId)!, [vpId]);
  const idx = PAGES.findIndex(p => p.id === pageId);
  const qaKey = `${pageId}|${variant}|${vpId}`;
  const cur = qa[qaKey];

  useEffect(() => { if (!page.variants.includes(variant)) setVariant('A'); }, [pageId]);
  useEffect(() => { setTreat(DEFAULT_TREAT); }, [pageId, variant]);
  useEffect(() => { setNav(page.section === 'SYSTEM' || page.section === 'ONBOARDING' ? 'ARENA' : page.section); }, [pageId]);

  /* no-scroll QA — measured after fonts + assets settle */
  useEffect(() => {
    let raf = 0;
    const t = setTimeout(() => {
      raf = requestAnimationFrame(() => {
        const el = stageRef.current; if (!el) return;
        const r = {
          y: el.scrollHeight > el.clientHeight + 1, x: el.scrollWidth > el.clientWidth + 1,
          sh: el.scrollHeight, ch: el.clientHeight, sw: el.scrollWidth, cw: el.clientWidth,
        };
        setQa(m => (m[qaKey] && m[qaKey].sh === r.sh && m[qaKey].sw === r.sw ? m : { ...m, [qaKey]: r }));
      });
    }, 480);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [qaKey, treat]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return PAGES.filter(p => !s || p.id.toLowerCase().includes(s) || p.title.toLowerCase().includes(s) || p.state.includes(s));
  }, [q]);

  const go = useCallback((d: number) => {
    const n = PAGES[(idx + d + PAGES.length) % PAGES.length];
    setPageId(n.id); setVariant('A'); setView(v => (v === 'docs' ? 'design' : v));
  }, [idx]);

  const jump = (p: string, v: string) => { setPageId(p); setVariant(v); setView('design'); };

  /* Canonical forward flow. Every terminal screen names its own next step,
     so no screen can leave the player without an action. */
  const NEXT: Record<string, string> = {
    P29: 'P30',  // skill card → arena hub
    P30: 'P02',  // hub → start next scenario
    P31: 'P30',  // profile → arena hub
    P32: 'P28',  // no attempts → academy is still available
    P33: 'P30',  // empty → arena hub
    P34: 'P19',  // error resolved → back into the scenario
  };
  const advance = () => {
    const target = NEXT[pageId] ?? PAGES[Math.min(PAGES.length - 1, idx + 1)].id;
    setPageId(target); setVariant('A');
  };
  const retreat = () => {
    /* Locked Academy and no-attempts must return somewhere useful. */
    const BACK: Record<string, string> = { P28: 'P30', P32: 'P31' };
    const target = BACK[pageId] ?? PAGES[Math.max(0, idx - 1)].id;
    setPageId(target); setVariant('A');
  };

  const sectionPage: Record<Section, string> = {
    ONBOARDING: 'P01', ACADEMY: 'P28', ARENA: 'P30', PROFILE: 'P31', SYSTEM: 'P32',
  };
  const changeSection = (s: Section) => {
    setNav(s);
    setPageId(sectionPage[s]);
    setVariant('A');
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'Escape') setView('design');
      const i = ['a', 'b', 'c', 'd'].indexOf(e.key.toLowerCase());
      if (i >= 0 && page.variants[i]) setVariant(page.variants[i]);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [go, page]);

  const tintHex = TINTS.find(t => t.id === treat.tint)?.hex ?? null;

  /* -------------------- the game device (no phone chrome) -------------------- */
  const device = (w: number, h: number, interactive = true, ref?: React.Ref<HTMLDivElement>, production = false) => (
    <div className="game-device relative shrink-0 overflow-hidden rounded-[26px]"
      data-short={h <= 620 ? 'true' : 'false'}
      data-narrow={w <= 340 ? 'true' : 'false'}
      style={{
        width: production ? 'min(100vw, 520px)' : `min(${w}px, 100%)`,
        height: production ? '100dvh' : 'auto',
        aspectRatio: production ? undefined : `${w} / ${h}`,
        minHeight: production ? '100dvh' : undefined,
        background: 'radial-gradient(120% 90% at 50% -10%, #0d2233 0%, #050a12 62%)',
        border: production ? 'none' : '1px solid rgba(120,190,210,.14)',
        borderRadius: production ? 0 : 26,
        boxShadow: '0 40px 90px -40px #000, 0 0 0 1px rgba(47,224,192,.06), inset 0 1px 0 rgba(255,255,255,.05)',
      }}>
      <div className="pointer-events-none absolute inset-0 grain opacity-[.5]" />
      <div className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-[#2fe0c0]/[.10] blur-[70px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#4C6180]/[.12] blur-[70px]" />

      <div className="relative flex h-full flex-col" style={{ pointerEvents: interactive ? 'auto' : 'none' }}>
        {page.kind !== 'welcome' && <TopBar s={topbarFor(page)} />}

        <div ref={ref} className="game-content min-h-0 flex-1 overflow-hidden px-[12px] pb-[8px] pt-[10px]">
          <RunProvider key="run-scope">
          <div
            key={pageId + variant + treat.motion}
            className={`h-full ${treat.motion === 'rise' ? 'a-rise' : treat.motion === 'pop' ? 'a-pop' : ''} ${treat.motion === 'sweep' ? 'relative a-sweep' : ''}`}
            style={{
              opacity: treat.opacity,
              transform: `translate(${treat.x}px, ${treat.y}px) scale(${treat.scale})`,
              transformOrigin: 'center top',
              clipPath: treat.crop ? `inset(${treat.crop}px round 10px)` : undefined,
              objectFit: treat.fit,
            }}>
            <Screen page={page} v={variant} onNext={advance} onBack={retreat} />
          </div>
          </RunProvider>
        </div>

        {page.kind !== 'welcome' && page.kind !== 'cinematic' && page.kind !== 'seal' && (
            <BottomNav active={nav} onChange={changeSection} />
        )}
      </div>

      {tintHex && <div className="pointer-events-none absolute inset-0 mix-blend-color" style={{ background: tintHex, opacity: .22 }} />}
    </div>
  );

  const stageH = Math.min(vp.h, 860);
  const stage = (
    <div className="flex flex-col items-center gap-3">
      {device(Math.min(vp.w, 520), stageH, true, stageRef)}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] text-[#5f7689]">
        <span className="font-mono font-bold text-[#8fa7b8]">{page.id}-{variant}</span>
        <span>·</span><span>{VARIANT_LABEL[variant]}</span>
        <span>·</span><span className="font-mono">{vp.id}</span>
        {cur && (<><span>·</span>
          <span className="inline-flex items-center gap-1 font-mono" style={{ color: cur.y || cur.x ? '#e08b84' : '#4bd6a8' }}>
            {cur.y || cur.x ? <><IcCross className="h-[10px] w-[10px]" />overflow {cur.sh}/{cur.ch}</> : <><IcCheck className="h-[10px] w-[10px]" />no-scroll ok</>}
          </span></>)}
      </div>
    </div>
  );

  /* -------------------- compare: MVP artboard 300×620 vs new -------------------- */
  const compare = (
    <div className="flex flex-wrap items-start justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-[9px] font-extrabold uppercase tracking-[.16em] text-[#6a8296]">MVP reference artboard</span>
      <div style={{ width: 300, height: 620, border: '3px solid rgba(120,190,210,.35)', borderRadius: 18, padding: 0, background: '#050a12' }}>
          <div style={{ width: 294, height: 614, overflow: 'hidden', borderRadius: 15 }}>
            <div style={{ width: 390, height: 844, transform: 'scale(.7538)', transformOrigin: 'top left' }}>
              {device(390, 844, false)}
            </div>
          </div>
        </div>
        <span className="font-mono text-[9px] text-[#4e6377]">300×620 · 15/31 · рамка 3px · поле 294×614</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-[9px] font-extrabold uppercase tracking-[.16em] text-[#2fe0c0]">production · responsive</span>
        {device(390, 700, true)}
        <span className="font-mono text-[9px] text-[#4e6377]">width 100% · min-height 100dvh · safe-area · overflow-x clip</span>
      </div>
    </div>
  );

  /* -------------------- left: page catalog -------------------- */
  const pagesPanel = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-white/[.06] p-3">
        <div className="mb-2 flex items-center gap-2">
          <Emblem className="h-[26px] w-[26px]" />
          <div className="min-w-0">
            <div className="text-[11px] font-extrabold leading-none text-[#eaf4f8]">Signal Arena</div>
            <div className="mt-[3px] font-mono text-[8.5px] text-[#5f7689]">P01–P34 · {PAGES.reduce((n, p) => n + p.variants.length, 0)} вариантов</div>
          </div>
        </div>
        <div className="relative">
          <IcSearch className="pointer-events-none absolute left-[9px] top-1/2 h-[13px] w-[13px] -translate-y-1/2 text-[#4e6377]" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="P07, график, reveal…"
            className="focus-ring w-full rounded-[10px] border border-white/[.08] bg-black/25 py-[8px] pl-[28px] pr-[9px] text-[11px] text-white outline-none placeholder:text-[#4e6377]" />
        </div>
        <div className="mt-2 flex gap-1.5">
          <button onClick={() => go(-1)} className="press-sm focus-ring flex h-[30px] flex-1 items-center justify-center gap-1 rounded-[9px] border border-white/[.08] bg-white/[.03] text-[10px] font-bold text-[#9fb4c4]">
            <IcChevL className="h-[12px] w-[12px]" />Previous
          </button>
          <button onClick={() => go(1)} className="press-sm focus-ring flex h-[30px] flex-1 items-center justify-center gap-1 rounded-[9px] border border-white/[.08] bg-white/[.03] text-[10px] font-bold text-[#9fb4c4]">
            Next<IcChevR className="h-[12px] w-[12px]" />
          </button>
        </div>
      </div>
      <div className="wb-scroll min-h-0 flex-1 p-2">
        {SECTION_ORDER.map(sec => {
          const items = filtered.filter(p => p.section === sec);
          if (!items.length) return null;
          return (
            <div key={sec} className="mb-2">
              <div className="px-2 py-1 text-[8.5px] font-extrabold uppercase tracking-[.18em] text-[#4e6377]">{SECTION_LABEL[sec]}</div>
              {items.map(p => {
                const on = p.id === pageId;
                return (
                  <div key={p.id} className="mb-[3px]">
                    <button onClick={() => { setPageId(p.id); setVariant('A'); setDrawer('none'); setView(v => v === 'docs' ? 'design' : v); }}
                      className="press-sm focus-ring w-full rounded-[10px] px-2 py-[7px] text-left"
                      style={on ? { background: 'linear-gradient(170deg, rgba(47,224,192,.16), rgba(47,224,192,.05))', border: '1px solid rgba(47,224,192,.3)' } : { border: '1px solid transparent' }}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] font-extrabold" style={{ color: on ? '#2fe0c0' : '#5f7689' }}>{p.id}</span>
                        <span className="min-w-0 flex-1 truncate text-[11px] font-semibold" style={{ color: on ? '#eaf4f8' : '#9fb4c4' }}>{p.title}</span>
                        <span className="font-mono text-[8px]" style={{ color: p.variants.length === 3 ? '#d9c07d' : '#41576a' }}>×{p.variants.length}</span>
                      </div>
                      <div className="mt-[2px] pl-[26px] font-mono text-[8px] text-[#41576a]">{p.state}</div>
                    </button>
                    {on && (
                      <div className="mt-[4px] flex gap-[4px] pl-[26px]">
                        {p.variants.map(vv => (
                          <button key={vv} onClick={() => setVariant(vv)}
                            className="press-sm focus-ring h-[26px] flex-1 rounded-[7px] text-[9px] font-extrabold"
                            style={vv === variant
                              ? { background: '#2fe0c0', color: '#04120f', boxShadow: '0 0 12px -3px rgba(47,224,192,.9)' }
                              : { background: 'rgba(255,255,255,.05)', color: '#7d93a8', border: '1px solid rgba(255,255,255,.08)' }}>
                            {vv}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  /* -------------------- right: asset inspector with live controls -------------------- */
  const Slider = ({ label, val, min, max, step, fmt, on }: {
    label: string; val: number; min: number; max: number; step: number; fmt: string; on: (n: number) => void;
  }) => (
    <div className="mb-[9px]">
      <div className="mb-[4px] flex justify-between">
        <span className="text-[9px] font-bold uppercase tracking-[.1em] text-[#6a8296]">{label}</span>
        <span className="font-mono text-[9px] font-extrabold text-[#9fb4c4]">{fmt}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} onChange={e => on(+e.target.value)}
        className="h-[4px] w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#2fe0c0]" />
    </div>
  );
  const Seg = ({ label, opts, val, on }: { label: string; opts: readonly string[]; val: string; on: (s: string) => void }) => (
    <div className="mb-[9px]">
      <div className="mb-[4px] text-[9px] font-bold uppercase tracking-[.1em] text-[#6a8296]">{label}</div>
      <div className="flex gap-[3px]">
        {opts.map(o => (
          <button key={o} onClick={() => on(o)}
            className="press-sm focus-ring flex-1 rounded-[7px] py-[6px] text-[8.5px] font-extrabold capitalize"
            style={o === val
              ? { background: 'rgba(47,224,192,.18)', color: '#2fe0c0', border: '1px solid rgba(47,224,192,.4)' }
              : { background: 'rgba(255,255,255,.04)', color: '#7d93a8', border: '1px solid rgba(255,255,255,.07)' }}>{o}</button>
        ))}
      </div>
    </div>
  );

  const usedSkills = page.kind === 'skills'
    ? SKILLS.filter(s => s.group === (page.id === 'P21' ? 'green' : page.id === 'P22' ? 'yellow' : page.id === 'P23' ? 'blue' : 'red')).slice(0, 10)
    : SKILLS.slice(0, 5);

  const assetsPanel = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-white/[.06] p-3">
        <div className="text-[9px] font-extrabold uppercase tracking-[.18em] text-[#4e6377]">Asset Inspector</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-mono text-[13px] font-extrabold text-[#2fe0c0]">{page.id}-{variant}</span>
          <span className="text-[10px] text-[#7d93a8]">{VARIANT_LABEL[variant]}</span>
        </div>
        <p className="mt-1 text-[10px] leading-[1.4] text-[#5f7689]">{VARIANT_NOTE[variant]}</p>
      </div>

      <div className="wb-scroll min-h-0 flex-1 p-3">
        {/* identity */}
        <div className="mb-3 grid gap-[3px] rounded-[10px] border border-white/[.07] bg-white/[.02] p-[9px] font-mono text-[8.5px]">
          {[['assetId', `${page.kind}-${page.id.toLowerCase()}-${variant.toLowerCase()}`],
            ['slot', `${page.kind}_stage`], ['source', page.source],
            ['fallback', page.kind === 'error' ? 'кэш + retry' : 'P31 empty']].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2">
              <span className="text-[#5f7689]">{k}</span><span className="truncate text-[#9fb4c4]">{v}</span>
            </div>
          ))}
        </div>

        {/* live treatment controls */}
        <div className="mb-3 rounded-[10px] border border-white/[.07] bg-white/[.02] p-[10px]">
          <Seg label="fit" opts={FITS} val={treat.fit} on={v => setTreat(t => ({ ...t, fit: v as Treat['fit'] }))} />
          <Slider label="scale" val={treat.scale} min={.8} max={1.2} step={.01} fmt={treat.scale.toFixed(2)} on={n => setTreat(t => ({ ...t, scale: n }))} />
          <Slider label="position x" val={treat.x} min={-24} max={24} step={1} fmt={`${treat.x}px`} on={n => setTreat(t => ({ ...t, x: n }))} />
          <Slider label="position y" val={treat.y} min={-24} max={24} step={1} fmt={`${treat.y}px`} on={n => setTreat(t => ({ ...t, y: n }))} />
          <Slider label="opacity" val={treat.opacity} min={.3} max={1} step={.01} fmt={treat.opacity.toFixed(2)} on={n => setTreat(t => ({ ...t, opacity: n }))} />
          <Slider label="crop" val={treat.crop} min={0} max={24} step={1} fmt={`${treat.crop}px`} on={n => setTreat(t => ({ ...t, crop: n }))} />
          <div className="mb-[9px]">
            <div className="mb-[4px] text-[9px] font-bold uppercase tracking-[.1em] text-[#6a8296]">tint</div>
            <div className="flex gap-[4px]">
              {TINTS.map(t => (
                <button key={t.id} onClick={() => setTreat(s => ({ ...s, tint: t.id }))}
                  title={t.id}
                  className="press-sm focus-ring h-[22px] flex-1 rounded-[6px]"
                  style={{
                    background: t.hex ?? 'transparent',
                    border: `1px solid ${treat.tint === t.id ? '#2fe0c0' : 'rgba(255,255,255,.12)'}`,
                    boxShadow: treat.tint === t.id ? '0 0 0 1px rgba(47,224,192,.5)' : 'none',
                  }}>
                  {!t.hex && <span className="text-[8px] text-[#7d93a8]">off</span>}
                </button>
              ))}
            </div>
          </div>
          <Seg label="motion preset" opts={MOTION} val={treat.motion} on={v => setTreat(t => ({ ...t, motion: v as Treat['motion'] }))} />
          <button onClick={() => setTreat(DEFAULT_TREAT)}
            className="press-sm focus-ring mt-[2px] w-full rounded-[9px] border border-white/[.1] bg-white/[.04] py-[8px] text-[10px] font-extrabold text-[#9fb4c4]">
            Reset Variant
          </button>
        </div>

        {/* viewports */}
        <div className="mb-3">
          <div className="mb-[6px] text-[8.5px] font-extrabold uppercase tracking-[.16em] text-[#4e6377]">Viewport QA</div>
          <div className="grid grid-cols-2 gap-[4px]">
            {VIEWPORTS.map(v => (
              <button key={v.id} onClick={() => setVpId(v.id)}
                className="press-sm focus-ring rounded-[8px] py-[6px] font-mono text-[9px] font-extrabold"
                style={v.id === vpId
                  ? { background: 'rgba(47,224,192,.16)', color: '#2fe0c0', border: '1px solid rgba(47,224,192,.35)' }
                  : { background: 'rgba(255,255,255,.03)', color: v.req ? '#7d93a8' : '#54697c', border: '1px solid rgba(255,255,255,.07)' }}>
                {v.id}
              </button>
            ))}
          </div>
          <div className="mt-[6px] flex items-center gap-[6px] rounded-[8px] px-[8px] py-[6px] text-[9.5px] font-bold"
            style={{
              background: cur && (cur.y || cur.x) ? 'rgba(197,104,97,.12)' : 'rgba(46,127,92,.12)',
              border: `1px solid ${cur && (cur.y || cur.x) ? 'rgba(197,104,97,.35)' : 'rgba(46,127,92,.35)'}`,
              color: cur && (cur.y || cur.x) ? '#e08b84' : '#4bd6a8',
            }}>
            {cur && (cur.y || cur.x)
              ? <><IcCross className="h-[11px] w-[11px]" />{cur.y ? 'vertical ' : ''}{cur.x ? 'horizontal ' : ''}overflow</>
              : <><IcCheck className="h-[11px] w-[11px]" />no-scroll passed · {Object.keys(qa).length} проверок</>}
          </div>
        </div>

        {/* preview of icons in use */}
        <div className="mb-3">
          <div className="mb-[6px] text-[8.5px] font-extrabold uppercase tracking-[.16em] text-[#4e6377]">Preview · SVG в слоте</div>
          <div className="grid grid-cols-5 gap-[4px]">
            {usedSkills.map(s => (
              <div key={s.id} className="grid place-items-center rounded-[8px] p-[4px]" title={s.file}
                style={{ background: `${GROUP_HEX[s.group]}1a`, border: `1px solid ${GROUP_HEX[s.group]}38` }}>
                <span className="grid h-[24px] w-[24px] place-items-center rounded-full"
                  style={{ background: 'radial-gradient(circle at 34% 26%, #17998a, #073f3c)', boxShadow: 'inset 0 0 0 1px rgba(47,224,192,.35)' }}>
                  <img src={s.src} alt="" className="h-[17px] w-[17px] object-contain" />
                </span>
                <span className="mt-[2px] font-mono text-[7px] text-[#8fa7b8]">{s.id}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[9px] border border-[#C56861]/30 bg-[#C56861]/[.07] px-[8px] py-[6px]">
          <div className="font-mono text-[8.5px] font-extrabold text-[#e8a9a3]">MISSING_ASSET · {MISSING_ASSETS.length}</div>
          {MISSING_ASSETS.map(a => <div key={a.file} className="mt-[2px] font-mono text-[8px] text-[#8a7470]">{a.file}</div>)}
          <button onClick={() => setView('docs')} className="press-sm mt-[5px] text-[8.5px] font-bold text-[#2fe0c0] underline">полный отчёт</button>
        </div>
      </div>
    </div>
  );

  /* -------------------- export overlay: game only -------------------- */
  if (view === 'export') {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-[#050a12]" onDoubleClick={() => setView('design')}>
        {device(Math.min(vp.w, 520), Math.min(vp.h, 860), true, undefined, true)}
      </div>
    );
  }

  const TABS = [
    { id: 'design', label: 'Дизайн', Icon: IcGrid },
    { id: 'compare', label: 'Сравнение', Icon: IcLayers },
    { id: 'docs', label: 'Отчёты', Icon: IcTarget },
  ] as const;

  return (
    <div className="min-h-[100dvh] w-full bg-[#050a12]">
      <div className="sticky top-0 z-30 border-b border-white/[.06] bg-[#050a12]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[46px] max-w-[1560px] items-center gap-2 px-3">
          <button onClick={() => setDrawer(drawer === 'pages' ? 'none' : 'pages')}
            className="press-sm focus-ring flex h-[30px] items-center gap-1.5 rounded-[9px] border border-white/[.08] bg-white/[.03] px-2.5 text-[10px] font-bold text-[#9fb4c4] xl:hidden">
            <IcLayers className="h-[13px] w-[13px] " />Страницы
          </button>
          <div className="hidden items-center gap-2 xl:flex">
            <Emblem className="h-[22px] w-[22px]" />
            <span className="text-[11px] font-extrabold text-[#eaf4f8]">Signal Arena</span>
          </div>

          <div className="mx-auto flex items-center gap-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setView(t.id)}
                className="press-sm focus-ring flex h-[28px] items-center gap-1.5 rounded-[8px] px-2.5 text-[10px] font-extrabold"
                style={view === t.id
                  ? { background: 'rgba(47,224,192,.16)', color: '#2fe0c0', border: '1px solid rgba(47,224,192,.35)' }
                  : { background: 'transparent', color: '#7d93a8', border: '1px solid transparent' }}>
                <t.Icon className="h-[12px] w-[12px]" />{t.label}
              </button>
            ))}
            <span className="mx-1 h-[16px] w-px bg-white/10" />
            <button onClick={() => go(-1)} className="press-sm focus-ring grid h-[28px] w-[28px] place-items-center rounded-[8px] border border-white/[.08] bg-white/[.03] text-[#9fb4c4]"><IcChevL className="h-[13px] w-[13px]" /></button>
            <span className="font-mono text-[11px] font-extrabold text-[#2fe0c0]">{page.id}</span>
            <button onClick={() => go(1)} className="press-sm focus-ring grid h-[28px] w-[28px] place-items-center rounded-[8px] border border-white/[.08] bg-white/[.03] text-[#9fb4c4]"><IcChevR className="h-[13px] w-[13px]" /></button>
            <span className="mx-1 h-[16px] w-px bg-white/10" />
            <div className="hidden gap-1 md:flex">
              {page.variants.map(vv => (
                <button key={vv} onClick={() => setVariant(vv)}
                  className="press-sm focus-ring h-[28px] w-[28px] rounded-[8px] text-[10px] font-extrabold"
                  style={vv === variant ? { background: '#2fe0c0', color: '#04120f' } : { background: 'rgba(255,255,255,.05)', color: '#7d93a8', border: '1px solid rgba(255,255,255,.08)' }}>
                  {vv}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setView('export')}
            className="press-sm focus-ring hidden h-[30px] items-center gap-1.5 rounded-[9px] border border-[#2fe0c0]/35 bg-[#2fe0c0]/10 px-2.5 text-[10px] font-extrabold text-[#2fe0c0] sm:flex">
            <IcEye className="h-[13px] w-[13px]" />Экспорт экрана
          </button>
          <button onClick={() => setDrawer(drawer === 'assets' ? 'none' : 'assets')}
            className="press-sm focus-ring flex h-[30px] items-center gap-1.5 rounded-[9px] border border-white/[.08] bg-white/[.03] px-2.5 text-[10px] font-bold text-[#9fb4c4] xl:hidden">
            <IcTarget className="h-[13px] w-[13px]" />Ассеты
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1560px] p-3">
        <div className="hidden xl:grid xl:gap-3" style={{ gridTemplateColumns: '286px minmax(0,1fr) 308px' }}>
          <aside className="wb-panel sticky top-[58px] h-[calc(100dvh-70px)] overflow-hidden">{pagesPanel}</aside>
          <section className="min-w-0">
            {view === 'docs'
              ? <div className="wb-panel h-[calc(100dvh-70px)] overflow-hidden"><Reports qa={qa} onJump={jump} /></div>
              : <div className="flex justify-center pt-1">{view === 'compare' ? compare : stage}</div>}
          </section>
          <aside className="wb-panel sticky top-[58px] h-[calc(100dvh-70px)] overflow-hidden">{assetsPanel}</aside>
        </div>

        <section className="xl:hidden">
          {view === 'docs'
            ? <div className="wb-panel h-[calc(100dvh-80px)] overflow-hidden"><Reports qa={qa} onJump={jump} /></div>
            : <div className="flex justify-center pt-1">{view === 'compare' ? compare : stage}</div>}
        </section>
      </div>

      {drawer !== 'none' && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <div className="absolute inset-0 bg-black/65" onClick={() => setDrawer('none')} />
          <div className={`wb-panel absolute bottom-0 top-0 w-[300px] max-w-[88vw] ${drawer === 'pages' ? 'left-0' : 'right-0'}`}
            style={{ borderRadius: drawer === 'pages' ? '0 18px 18px 0' : '18px 0 0 18px' }}>
            {drawer === 'pages' ? pagesPanel : assetsPanel}
          </div>
        </div>
      )}
    </div>
  );
}
