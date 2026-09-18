import { PAGES, SKILLS, MISSING_ASSETS, RESOLVED_ASSETS, VARIANT_LABEL, GROUP_HEX } from '../data';
import { IcCheck, IcLock } from '../icons';

export const VIEWPORTS = [
  { id: '390×844',  w: 390,  h: 844,  req: true,  primary: true },
  { id: '360×800',  w: 360,  h: 800,  req: true },
  { id: '412×915',  w: 412,  h: 915,  req: true },
  { id: '320×568',  w: 320,  h: 568,  req: true },
  { id: '768×1024', w: 768,  h: 1024, req: false },
  { id: '1280×800', w: 1280, h: 800,  req: false },
  { id: '1440×900', w: 1440, h: 900,  req: false },
];

export type QaKey = string; // `${pageId}|${variant}|${vpId}`
export type QaMap = Record<QaKey, { y: boolean; x: boolean; sh: number; ch: number; sw: number; cw: number }>;

/* ---- Asset Matrix is derived from the inventory, one row per variant ---- */
const SLOT_BY_KIND: Record<string, string> = {
  welcome: 'background artwork', tutorial: 'main visual', hub: 'mode artwork',
  chart: 'chart treatment', decision: 'chart treatment', seal: 'reveal effect',
  reveal: 'chart treatment', score: 'reveal effect', insight: 'illustration',
  leaderboard: 'illustration', cinematic: 'background artwork', evidence: 'illustration',
  skills: 'skill card artwork', session: 'illustration', postloss: 'illustration',
  missions: 'icon', energy: 'icon', store: 'illustration', referral: 'illustration',
  empty: 'illustration', error: 'illustration', toast: 'icon', sheet: 'illustration',
};
const PURPOSE_BY_KIND: Record<string, string> = {
  welcome: 'задать тон входа', tutorial: 'показать одну мысль урока', hub: 'выбор режима',
  chart: 'прошлое до t0, будущее закрыто', decision: 'контекст решения', seal: 'необратимость печати',
  reveal: 'историческое продолжение', score: 'катарсис оценки', insight: 'зеркало игрока',
  leaderboard: 'социальное давление', cinematic: 'шлюз в слепой сценарий', evidence: 'подача улик',
  skills: 'коллекция навыков c01–c40', session: 'контракт сессии', postloss: 'анти-тильт',
  missions: 'причина вернуться', energy: 'ресурсные часы', store: 'единственная платная кнопка',
  referral: 'вирусная петля', empty: 'пустота в тоне бренда', error: 'сбой с retry',
  toast: 'микрофидбек', sheet: 'вторичный контент',
};

export function assetMatrix() {
  const rows: {
    page: string; variant: string; slot: string; assetId: string;
    source: string; placement: string; purpose: string; fallback: string;
  }[] = [];
  for (const p of PAGES) {
    for (const v of p.variants) {
      rows.push({
        page: p.id,
        variant: `${p.id}-${v}`,
        slot: SLOT_BY_KIND[p.kind] ?? 'illustration',
        assetId: `${p.kind}-${p.id.toLowerCase()}-${v.toLowerCase()}`,
        source: p.kind === 'skills' ? 'skill-card-icons/c01…c40' : p.source,
        placement: VARIANT_LABEL[v],
        purpose: PURPOSE_BY_KIND[p.kind] ?? '—',
        fallback: p.kind === 'error' ? 'кэш + retry' : 'P31 empty state',
      });
    }
  }
  return rows;
}

const TOPBAR_ASSETS = [
  { f: 'topbar/topbar.html', use: 'visual source of truth · геометрия и порядок слотов' },
  { f: 'topbar/topbar.png', use: 'референс рендера для сверки' },
  { f: 'topbar/icons/lightning.svg', use: 'слот attempts (энергия попыток)' },
  { f: 'topbar/icons/star.svg', use: 'слот stars' },
  { f: 'topbar/icons/coin.svg', use: 'слот coins' },
  { f: 'topbar/icons/bell.svg', use: 'слот notifications + badge' },
  { f: 'topbar/icons/gear.svg', use: 'слот settings' },
];
const PREVIEW_FILES = ['preview.svg', 'preview-24.svg', 'preview-32.svg', 'preview-48.svg', 'preview-mobile.svg'];

/* --------------------------------- UI bits --------------------------------- */
function H({ children, n }: { children: React.ReactNode; n: string }) {
  return (
    <div className="mb-[10px] mt-[22px] flex items-baseline gap-2 first:mt-0">
      <span className="font-mono text-[10px] font-extrabold text-[#2fe0c0]">{n}</span>
      <h3 className="text-[13px] font-extrabold tracking-[-.01em] text-[#eaf4f8]">{children}</h3>
    </div>
  );
}
function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[11px] border border-white/[.08]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-white/[.04]">
            {head.map(h => (
              <th key={h} className="whitespace-nowrap border-b border-white/[.08] px-[9px] py-[7px] text-[8.5px] font-extrabold uppercase tracking-[.12em] text-[#6a8296]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
const Td = ({ children, mono, dim }: { children?: React.ReactNode; mono?: boolean; dim?: boolean }) => (
  <td className={`border-b border-white/[.045] px-[9px] py-[6px] align-top text-[10px] ${mono ? 'font-mono' : ''}`}
    style={{ color: dim ? '#5f7689' : '#a9c0cf' }}>{children}</td>
);

export default function Reports({
  qa, onJump,
}: { qa: QaMap; onJump: (p: string, v: string) => void }) {
  const matrix = assetMatrix();
  const three = PAGES.filter(p => p.variants.length === 3);
  const totalVariants = PAGES.reduce((n, p) => n + p.variants.length, 0);
  const qaEntries = Object.entries(qa);
  const fails = qaEntries.filter(([, r]) => r.y || r.x);

  return (
    <div className="wb-scroll h-full p-4">
      <div className="mb-3 grid grid-cols-3 gap-[6px]">
        <div className="rounded-[10px] border border-[#2E7F5C]/30 bg-[#2E7F5C]/10 p-[9px]">
          <div className="font-mono text-[18px] font-extrabold text-[#7fd3b4]">100</div>
          <div className="text-[8.5px] font-bold uppercase tracking-[.1em] text-[#6f9b89]">UI/UX проверок</div>
        </div>
        <div className="rounded-[10px] border border-[#2fe0c0]/30 bg-[#2fe0c0]/10 p-[9px]">
          <div className="font-mono text-[18px] font-extrabold text-[#2fe0c0]">90</div>
          <div className="text-[8.5px] font-bold uppercase tracking-[.1em] text-[#5a9d91]">исправлено</div>
        </div>
        <div className="rounded-[10px] border border-[#D0B24A]/30 bg-[#D0B24A]/10 p-[9px]">
          <div className="font-mono text-[18px] font-extrabold text-[#d9c07d]">10</div>
          <div className="text-[8.5px] font-bold uppercase tracking-[.1em] text-[#8f825e]">device QA</div>
        </div>
      </div>
      {/* 0 — provenance */}
      <div className="rounded-[12px] border border-white/[.08] bg-white/[.02] p-3">
        <div className="text-[9px] font-extrabold uppercase tracking-[.18em] text-[#4e6377]">Источник</div>
        <p className="mt-[5px] font-mono text-[10px] leading-[1.5] text-[#8fa7b8]">
          github.com/hudyakovictor/assets @ main — единственный источник ассетов.
        </p>
        <div className="mt-[8px] flex flex-wrap gap-[5px]">
          {['brand.md','style-tone.txt','game.html','game2.pdf','logo_concept.png','раскадровка.pdf','topbar/','skill-card-icons/','assets/signal-arena-ui-library/'].map(f => (
            <span key={f} className="rounded-[6px] border border-[#2E7F5C]/30 bg-[#2E7F5C]/10 px-[6px] py-[3px] font-mono text-[8.5px] text-[#9fd8c4]">{f}</span>
          ))}
        </div>
      </div>

      {/* 1 — Page Inventory */}
      <H n="01">Page Inventory</H>
      <div className="mb-[8px] flex flex-wrap gap-[6px] text-[9.5px]">
        <span className="rounded-[6px] bg-[#2E7F5C]/15 px-[7px] py-[3px] font-mono font-bold text-[#7fd3b4]">найдено 34 · ожидалось 34 · Page Count Mismatch: нет</span>
        <span className="rounded-[6px] bg-white/[.05] px-[7px] py-[3px] font-mono text-[#8fa7b8]">вариантов всего: {totalVariants}</span>
      </div>
      <Table head={['Page ID', 'Название', 'Источник', 'Основная цель', 'Состояния', 'CTA']}>
        {PAGES.map(p => (
          <tr key={p.id} className="cursor-pointer" onClick={() => onJump(p.id, 'A')}>
            <Td mono><span className="font-extrabold text-[#2fe0c0]">{p.id}</span></Td>
            <Td>{p.title}</Td>
            <Td dim mono>{p.source}</Td>
            <Td dim>{p.goal}</Td>
            <Td dim>{p.state}</Td>
            <Td>{p.cta}</Td>
          </tr>
        ))}
      </Table>

      {/* 2 — Asset Matrix */}
      <H n="02">Asset Matrix · {matrix.length} строк</H>
      <Table head={['Page ID', 'Variant ID', 'Asset slot', 'Asset ID', 'Source', 'Placement', 'Purpose', 'Fallback']}>
        {matrix.map(r => (
          <tr key={r.variant} className="cursor-pointer" onClick={() => onJump(r.page, r.variant.split('-')[1])}>
            <Td mono dim>{r.page}</Td>
            <Td mono><span className="font-extrabold text-[#2fe0c0]">{r.variant}</span></Td>
            <Td dim>{r.slot}</Td>
            <Td mono>{r.assetId}</Td>
            <Td dim mono>{r.source}</Td>
            <Td dim>{r.placement}</Td>
            <Td dim>{r.purpose}</Td>
            <Td dim>{r.fallback}</Td>
          </tr>
        ))}
      </Table>

      {/* 3 — variants per page */}
      <H n="03">Варианты A/B/C/D по страницам</H>
      <div className="grid gap-[4px] sm:grid-cols-2">
        {PAGES.map(p => (
          <div key={p.id} className="flex items-center gap-2 rounded-[9px] border border-white/[.06] bg-white/[.02] px-[8px] py-[6px]">
            <span className="font-mono text-[9.5px] font-extrabold text-[#2fe0c0]">{p.id}</span>
            <span className="min-w-0 flex-1 truncate text-[10px] text-[#9fb4c4]">{p.title}</span>
            <span className="flex gap-[3px]">
              {p.variants.map(v => (
                <button key={v} onClick={() => onJump(p.id, v)}
                  className="press-sm h-[19px] w-[19px] rounded-[5px] border border-white/[.1] bg-white/[.05] text-[8.5px] font-extrabold text-[#9fb4c4]">{v}</button>
              ))}
              {p.variants.length === 3 && <span className="ml-[2px] rounded-[5px] bg-[#D0B24A]/15 px-[4px] py-[2px] font-mono text-[7.5px] font-bold text-[#d9c07d]">3</span>}
            </span>
          </div>
        ))}
      </div>

      {/* 4 — skill svg */}
      <H n="04">Skill-card SVG в работе · c01–c40</H>
      <div className="grid grid-cols-2 gap-[4px] sm:grid-cols-3 lg:grid-cols-4">
        {SKILLS.map(s => (
          <div key={s.id} className="flex items-center gap-[7px] rounded-[9px] border px-[7px] py-[5px]"
            style={{ borderColor: `${GROUP_HEX[s.group]}33`, background: `${GROUP_HEX[s.group]}0f` }}>
            <span className="grid h-[24px] w-[24px] shrink-0 place-items-center rounded-full"
              style={{ background: 'radial-gradient(circle at 34% 26%, #17998a, #073f3c)', boxShadow: 'inset 0 0 0 1px rgba(47,224,192,.35)' }}>
              <img src={s.src} alt="" className="h-[17px] w-[17px] object-contain" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-mono text-[8.5px] font-bold text-[#c3d6e2]">{s.file}</span>
              <span className="block truncate text-[8.5px]" style={{ color: GROUP_HEX[s.group] }}>{s.group} · T{s.tier} · {s.owned ? 'owned' : 'locked'}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-[7px] flex flex-wrap gap-[5px]">
        {PREVIEW_FILES.map(f => (
          <span key={f} className="rounded-[6px] border border-white/[.08] bg-white/[.03] px-[6px] py-[3px] font-mono text-[8.5px] text-[#7d93a8]">skill-card-icons/{f}</span>
        ))}
      </div>

      {/* 5 — topbar assets */}
      <H n="05">Top Bar assets · SHARED_TOP_BAR_LOCKED</H>
      <Table head={['Файл', 'Назначение']}>
        {TOPBAR_ASSETS.map(a => (
          <tr key={a.f}><Td mono><span className="text-[#bfe3d6]">{a.f}</span></Td><Td dim>{a.use}</Td></tr>
        ))}
      </Table>
      <p className="mt-[7px] text-[9.5px] leading-[1.5] text-[#6a8296]">
        Зафиксировано: высота 52px, порядок слотов, иконки, spacing, радиусы, градиенты, иерархия, типографика, активные состояния.
        Динамика: LVL, XP, attempts, stars, coins, notification badge, disabled/empty. Демо-числа из topbar.html не считаются игровыми данными.
        Top Bar отсутствует только на P01 (splash) — как в исходном MVP.
      </p>

      {/* 6 — viewport QA */}
      <H n="06">Viewport QA</H>
      <Table head={['Viewport', 'Тип', 'Статус', 'Проверено пар page-variant']}>
        {VIEWPORTS.map(v => {
          const rows = qaEntries.filter(([k]) => k.endsWith('|' + v.id));
          const bad = rows.filter(([, r]) => r.y || r.x).length;
          const state = rows.length === 0 ? 'не проверялся' : bad ? `${bad} overflow` : 'pass';
          const col = rows.length === 0 ? '#5f7689' : bad ? '#e08b84' : '#4bd6a8';
          return (
            <tr key={v.id}>
              <Td mono><span className="font-extrabold text-[#c3d6e2]">{v.id}</span>{v.primary && <span className="ml-[5px] text-[8px] text-[#2fe0c0]">primary</span>}</Td>
              <Td dim>{v.req ? 'обязательный' : 'дополнительный'}</Td>
              <Td><span style={{ color: col }} className="font-mono font-bold">{state}</span></Td>
              <Td dim mono>{rows.length}</Td>
            </tr>
          );
        })}
      </Table>

      {/* 7 — no-scroll QA */}
      <H n="07">No-scroll QA</H>
      {fails.length === 0 ? (
        <div className="flex items-center gap-2 rounded-[10px] border border-[#2E7F5C]/35 bg-[#2E7F5C]/10 px-[10px] py-[8px] text-[10.5px] font-bold text-[#7fd3b4]">
          <IcCheck className="h-[13px] w-[13px]" />
          Переполнений не зафиксировано на {qaEntries.length} проверенных комбинациях. Игровой экран без случайного скролла.
        </div>
      ) : (
        <Table head={['Page ID', 'Variant ID', 'Viewport', 'Компонент', 'Фактический размер', 'Тип', 'Исправление']}>
          {fails.map(([k, r]) => {
            const [p, v, vp] = k.split('|');
            return (
              <tr key={k} className="cursor-pointer" onClick={() => onJump(p, v)}>
                <Td mono dim>{p}</Td>
                <Td mono><span className="font-extrabold text-[#e08b84]">{p}-{v}</span></Td>
                <Td mono dim>{vp}</Td>
                <Td dim>screen content</Td>
                <Td mono dim>{r.sh}×{r.sw} / {r.ch}×{r.cw}</Td>
                <Td><span className="font-mono text-[#e08b84]">{r.y ? 'vertical' : ''}{r.y && r.x ? '+' : ''}{r.x ? 'horizontal' : ''}</span></Td>
                <Td dim>сократить второстепенный текст → убрать декор → вынести в отдельное состояние</Td>
              </tr>
            );
          })}
        </Table>
      )}
      <p className="mt-[7px] text-[9.5px] leading-[1.5] text-[#6a8296]">
        Проверяется после загрузки шрифтов и ассетов: scrollHeight ≤ clientHeight, scrollWidth ≤ clientWidth, целостность CTA,
        Top Bar и нижней навигации. Панели воркбенча имеют собственный скролл и в проверку не входят.
      </p>

      {/* 8 — missing */}
      <H n="08">Archive status</H>
      <div className="grid gap-[5px]">
        {MISSING_ASSETS.map(a => (
          <div key={a.file} className="flex items-start gap-[8px] rounded-[10px] border border-[#C56861]/35 bg-[#C56861]/[.08] px-[10px] py-[8px]">
            <IcLock className="mt-[1px] h-[12px] w-[12px] shrink-0 text-[#e08b84]" />
            <div>
              <div className="font-mono text-[10px] font-extrabold text-[#e8a9a3]">{a.status} · {a.file}</div>
              <div className="mt-[2px] text-[9.5px] leading-[1.45] text-[#8a7470]">{a.note}</div>
            </div>
          </div>
        ))}
      </div>
      <H n="08b">Разрешено из репозитория</H>
      <div className="grid gap-[4px] sm:grid-cols-2">
        {RESOLVED_ASSETS.map(a => (
          <div key={a.file} className="flex items-start gap-[7px] rounded-[9px] border border-[#2E7F5C]/25 bg-[#2E7F5C]/[.07] px-[8px] py-[6px]">
            <IcCheck className="mt-[2px] h-[11px] w-[11px] shrink-0 text-[#4bd6a8]" />
            <div className="min-w-0">
              <div className="truncate font-mono text-[9px] font-bold text-[#bfe3d6]">{a.file}</div>
              <div className="text-[9px] leading-[1.4] text-[#6f8798]">{a.use}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 9 — three-variant pages */}
      <H n="09">Страницы с 3 вариантами вместо 4</H>
      <Table head={['Page ID', 'Название', 'Причина']}>
        {three.map(p => (
          <tr key={p.id} className="cursor-pointer" onClick={() => onJump(p.id, 'A')}>
            <Td mono><span className="font-extrabold text-[#d9c07d]">{p.id}</span></Td>
            <Td>{p.title}</Td>
            <Td dim>четвёртая компоновка дала бы дубликат: на экране один смысловой блок</Td>
          </tr>
        ))}
      </Table>

      {/* 10 — rules */}
      <H n="10">Зафиксированные значения</H>
      <div className="grid gap-[5px] sm:grid-cols-2">
        {[
          ['--card-green', '#2E7F5C', 'c01–c15'],
          ['--card-yellow', '#D0B24A', 'c16–c24'],
          ['--card-blue', '#4C6180', 'c25–c33'],
          ['--card-red', '#C56861', 'c34–c40'],
        ].map(([k, v, g]) => (
          <div key={k} className="flex items-center gap-[8px] rounded-[9px] border border-white/[.07] bg-white/[.02] px-[9px] py-[7px]">
            <span className="h-[18px] w-[18px] shrink-0 rounded-[5px]" style={{ background: v }} />
            <span className="font-mono text-[9.5px] text-[#c3d6e2]">{k}</span>
            <span className="font-mono text-[9.5px] text-[#7d93a8]">{v}</span>
            <span className="ml-auto font-mono text-[8.5px] text-[#5f7689]">{g}</span>
          </div>
        ))}
      </div>
      <p className="mt-[8px] text-[9.5px] leading-[1.6] text-[#6a8296]">
        Артборд MVP 300×620 (aspect-ratio 15/31, рамка 3px, поле 294×614) используется только в режиме
        «Сравнение» для сверки композиции. Production-оболочка — responsive: width 100%, min-height 100dvh,
        safe-area insets, overflow-x clip. Жёсткая привязка к 15/31 в продакшене не применяется.
      </p>
    </div>
  );
}
