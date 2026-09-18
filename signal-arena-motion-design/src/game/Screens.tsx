import { useEffect, useState } from 'react';
import Chart from './Chart';
import { Btn, Tile, Bar, Tag, Head, HandNote, SkillTile, Row, Stars, BrandMark, RunRail, SkillHand, CardReading, type HandCard } from './ui';
import {
  SKILLS, CHOICES, EVIDENCE, LEADERS, MISSIONS, LESSONS, TOASTS, HAND_SLOTS,
  GROUP_HEX, TUTORIAL_TARGET, CANDLES, T0, type PageDef, type Group,
} from '../data';
import {
  IcSeal, IcCheck, IcCross, IcClock, IcTrend, IcShield, IcEye,
  IcFlame, IcTarget, IcLayers, IcLock, IcChevR, IcStar, IcCoin, IcLightning,
} from '../icons';

import { useRun, DECISION_LABEL, DECISION_SUMMARY, scoreRun, type DecisionId } from './run';

export interface ScreenProps { page: PageDef; v: string; onNext?: () => void; onBack?: () => void }
const V = (v: string) => ({ A: v === 'A', B: v === 'B', C: v === 'C', D: v === 'D' });

/* Builds the run hand from real repository SVGs. */
function useHand(): HandCard[] {
  return HAND_SLOTS.map(slot => {
    const sk = SKILLS.find(k => k.id === slot.skill)!;
    return { id: slot.id, label: slot.label, src: sk.src, group: sk.group, reading: slot.reading, locked: !sk.owned };
  });
}

/* ============================ P01 WELCOME ============================ */
function Welcome({ v, onNext }: ScreenProps) {
  const s = V(v);
  return (
    <div className="flex h-full flex-col">
      <div className={`relative flex flex-1 flex-col ${s.C ? 'justify-center' : 'justify-end'} ${s.D ? 'pt-2' : 'pt-4'}`}>
        <div className="pointer-events-none absolute inset-0 grain opacity-40" />
        <div className={`relative flex ${s.B ? 'flex-row items-center gap-4' : 'flex-col items-center'} ${s.D ? 'gap-2' : 'gap-3'}`}>
          <BrandMark className={s.D ? 'h-[78px] w-[78px]' : s.B ? 'h-[92px] w-[92px] shrink-0' : 'h-[120px] w-[120px] a-pop'} />
          <div className={s.B ? 'text-left' : 'text-center'}>
            <h1 className={`font-extrabold leading-[.95] tracking-[-.03em] text-white ${s.D ? 'text-[26px]' : 'text-[34px]'}`}>
              SIGNAL<br /><span style={{ color: '#2fe0c0' }}>ARENA</span>
            </h1>
            <p className="mt-[8px] text-[11px] leading-[1.45] text-[#7d93a8]">
              {s.D ? 'Тренажёр решений на исторических данных.'
                   : 'Не прогноз. Тренажёр решений на исторических сценариях крипторынка.'}
            </p>
          </div>
        </div>
        {!s.D && <div className={`relative mt-5 ${s.B ? 'pl-1' : 'flex justify-center'}`}><HandNote align={s.B ? 'left' : 'center'} /></div>}
      </div>

      {s.D ? (
        <div className="grid grid-cols-3 gap-[7px] pb-2">
          <Tile k="сценариев" v="240" /><Tile k="навыков" v="40" tone="#D0B24A" /><Tile k="сезон" v="II" tone="#4C6180" />
        </div>
      ) : (
        <Row gap={8}>
          <Tile k="сценариев" v="240" /><Tile k="навыков" v="40" tone="#D0B24A" />
        </Row>
      )}

      <div className={`mt-3 flex gap-2 ${s.B ? 'flex-row' : 'flex-col'}`}>
        <Btn full size="lg" onClick={onNext} icon={<IcSeal className="h-full w-full" />}>Продолжить</Btn>
        {!s.C && <Btn full tone="ghost" size={s.B ? 'lg' : 'md'}>Как это работает</Btn>}
      </div>
    </div>
  );
}

/* ============================ TUTORIAL / LESSON ============================ */
function Tutorial({ page, v, onNext, onBack }: ScreenProps) {
  const s = V(v);
  const { run, set } = useRun();
  /* Step is derived from the page itself, never from a stale lookup table,
     so the progress indicator can no longer contradict the screen. */
  const L = LESSONS[0];
  const step = 1, steps = 4;
  const [hit, setHit] = useState<'none' | 'ok' | 'miss'>('none');
  const [tries, setTries] = useState(0);
  const skill = SKILLS.find(k => k.id === L.skill)!;
  useEffect(() => { setHit('none'); setTries(0); }, [page.id, v]);
  const pick = (i: number) => {
    const ok = i === TUTORIAL_TARGET;
    setHit(ok ? 'ok' : 'miss');
    setTries(t => t + 1);
    set('tutorialHit', ok ? 'ok' : 'miss');
  };
  void run;

  const visual = (
    <Chart grid={s.D ? 'full' : 'soft'} target={TUTORIAL_TARGET} hit={hit} sealLine={false} onPick={pick} />
  );
  const text = (
    <>
      <Head over={`Заход 1 · шаг ${step}/${steps}`} title={L.title} sub={s.D ? undefined : L.idea} />
      <div className="flex items-center gap-[7px]">
        <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full"
          style={{ background: GROUP_HEX[skill.group] }}>
          <img src={skill.src} alt="" className="h-[22px] w-[22px] object-contain" />
        </span>
        <div className="min-w-0">
          <div className="text-[10px] font-extrabold text-[#dceaf1]">{skill.name}</div>
          <div className="font-mono text-[8px] tracking-wider text-[#6a8296]">{skill.id.toUpperCase()} · навык урока</div>
        </div>
      </div>
    </>
  );
  const feedback = (
    <div className="g-card flex items-center gap-[8px] rounded-[12px] px-[10px] py-[8px]">
      <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full"
        style={{ background: hit === 'ok' ? '#2E7F5C' : hit === 'miss' ? '#C56861' : 'rgba(233,196,106,.18)', color: hit === 'none' ? '#e9c46a' : '#fff' }}>
        {hit === 'ok' ? <IcCheck className="h-[12px] w-[12px]" /> : hit === 'miss' ? <IcCross className="h-[12px] w-[12px]" /> : <IcTarget className="h-[13px] w-[13px]" />}
      </span>
      <p className="text-[10px] leading-[1.35] text-[#a9c0cf]">
        {hit === 'ok' ? 'Верно. Эта свеча сломала структуру: тело расширилось, объём вырос.'
          : hit === 'miss' ? `Мимо. Попытка ${tries} — штрафа нет. Подсветка показывает зону, нажми ещё раз.`
            : L.action + '. Нажми по подсвеченной свече на графике.'}
      </p>
    </div>
  );

  return (
    <div className="flex h-full flex-col gap-[10px]">
      <RunRail step={step} steps={steps} label="Заход 1 из 3" />

      {s.A && (<>{text}<div className="flex min-h-0 flex-1 flex-col">{visual}</div>{feedback}</>)}
      {s.B && (<>
        <div className="flex min-h-0 flex-1 gap-[9px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[8px]">{text}{feedback}</div>
          <div className="flex w-[46%] shrink-0 flex-col">{visual}</div>
        </div>
      </>)}
      {s.C && (<>
        <div className="flex min-h-0 flex-1 flex-col">{visual}</div>
        <Head over={`шаг ${step}/${steps}`} title={L.title} />
        {feedback}
      </>)}
      {s.D && (<>
        {text}
        <div className="flex min-h-0 flex-1 flex-col">{visual}</div>
        <div className="grid grid-cols-2 gap-[7px]">
          <Tile k="навык" v={skill.id.toUpperCase()} tone={GROUP_HEX[skill.group]} />
          <Tile k="попыток" v={String(tries)} />
        </div>
        {feedback}
      </>)}

      {/* CTA area ≥64px incl. spacing, bottom safe-area handled by BottomNav */}
      <div className="min-h-[64px] pt-[6px]">
        <Row gap={8}>
          <Btn tone="ghost" size="lg" onClick={onBack}>Назад</Btn>
          <div className="flex-1"><Btn full size="lg" onClick={onNext} disabled={hit !== 'ok'} icon={<IcChevR className="h-full w-full" />}>{page.cta}</Btn></div>
        </Row>
      </div>
    </div>
  );
}

/* ============================ P06 HUB ============================ */
function Hub({ v, onNext }: ScreenProps) {
  const s = V(v);
  const { resetRun } = useRun();
  const [note, setNote] = useState<string | null>(null);
  const modes = [
    { t: 'Дневная арена', d: 'сценарий дня · 1 энергия', Icon: IcFlame, tone: '#2fe0c0', live: true },
    { t: 'Спидран', d: '5 решений · 90 секунд', Icon: IcClock, tone: '#D0B24A', lock: 'LVL 5' },
    { t: 'Слепой сценарий', d: 'без улик · x2 очки', Icon: IcEye, tone: '#4C6180' },
    { t: 'Дуэль 1 на 1', d: 'вызов игроку', Icon: IcShield, tone: '#C56861' },
  ];
  const start = () => { resetRun(); onNext?.(); };
  const tap = (m: typeof modes[0]) => {
    if (m.lock) { setNote(`«${m.t}» откроется на ${m.lock}. Сейчас доступна дневная арена.`); return; }
    start();
  };
  const card = (m: typeof modes[0], big?: boolean) => (
    <button key={m.t} onClick={() => tap(m)} aria-disabled={!!m.lock}
      className="press focus-ring g-card relative flex items-center gap-[10px] overflow-hidden rounded-[14px] p-[10px] text-left"
      style={{ borderColor: `${m.tone}33`, opacity: m.lock ? .6 : 1 }}>
      <span className="grid shrink-0 place-items-center rounded-[11px]"
        style={{ width: big ? 46 : 38, height: big ? 46 : 38, background: `linear-gradient(165deg, ${m.tone}33, ${m.tone}12)`, border: `1px solid ${m.tone}44`, color: m.tone }}>
        <m.Icon className={big ? 'h-[24px] w-[24px]' : 'h-[20px] w-[20px]'} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-[5px]">
          <span className={`truncate font-extrabold text-[#eaf4f8] ${big ? 'text-[13px]' : 'text-[11.5px]'}`}>{m.t}</span>
          {m.live && <Tag tone="#ff5a72">live</Tag>}
        </span>
        <span className="mt-[2px] block truncate text-[9.5px] text-[#7d93a8]">{m.d}</span>
      </span>
      {m.lock
        ? <span className="flex shrink-0 items-center gap-[3px] font-mono text-[8.5px] font-extrabold text-[#6a8296]"><IcLock className="h-[11px] w-[11px]" />{m.lock}</span>
        : <IcChevR className="h-[15px] w-[15px] shrink-0 text-[#4e6377]" />}
    </button>
  );

  return (
    <div className="flex h-full flex-col gap-[10px]">
      <div className="flex items-end justify-between">
        <Head over="хаб арены" title="Сезон II · Лига Серебро" />
        <span className="tnum mb-[10px] font-mono text-[10px] font-extrabold text-[#e9c46a]">23:14:07</span>
      </div>

      {s.A && (<>
        {card(modes[0], true)}
        <div className="grid gap-[8px]">{modes.slice(1).map(m => card(m))}</div>
        <div className="flex-1" />
        <HandNote text="ONE SEALED DECISION BEATS TEN OPINIONS." size={14} />
      </>)}
      {s.B && (<>
        <div className="grid grid-cols-2 gap-[8px]">{modes.map(m => (
          <div key={m.t} className="[&>button]:h-full [&>button]:flex-col [&>button]:items-start">{card(m)}</div>
        ))}</div>
        <div className="flex-1" />
        <Chart mini grid="none" sealLine={false} label="ритм сезона" />
      </>)}
      {s.C && (<>
        <div className="flex-1">{card(modes[0], true)}</div>
        <Chart grid="soft" />
        <Row gap={8}><Tile k="стрик" v="6 дн" /><Tile k="ранг" v="#45" tone="#e9c46a" /><Tile k="точность" v="71%" tone="#4C6180" /></Row>
      </>)}
      {s.D && (<>
        <div className="grid grid-cols-3 gap-[7px]">
          <Tile k="энергия" v="5/5" /><Tile k="стрик" v="6" tone="#e9c46a" /><Tile k="ранг" v="#45" tone="#4C6180" />
        </div>
        <div className="grid gap-[6px]">{modes.map(m => card(m))}</div>
        <div className="flex-1" />
      </>)}

      {note && (
        <div className="shrink-0 rounded-[11px] px-[10px] py-[8px]"
          style={{ background: 'rgba(208,178,74,.12)', border: '1px solid rgba(208,178,74,.35)' }}>
          <p className="text-[10px] leading-[1.4] text-[#e7d7a4]">{note}</p>
        </div>
      )}
      <Btn full size="lg" onClick={start} icon={<IcFlame className="h-full w-full" />}>Начать сценарий дня</Btn>
    </div>
  );
}

/* ============================ P07 CHART (pre-decision) ============================ */
function ChartScreen({ page, v, onNext }: ScreenProps) {
  const s = V(v);
  const { run, set } = useRun();
  /* Timeframe switcher removed: no question in the scenario depends on it, so
     it was chrome that consumed height without affecting the decision. */
  const hand = useHand();
  const playCard = (id: string) =>
    set('playedCards', run.playedCards.includes(id) ? run.playedCards : [...run.playedCards, id]);
  const lastCard = hand.find(c => c.id === run.playedCards[run.playedCards.length - 1]) ?? null;
  const facts = (
    <div className="grid gap-[6px]">
      {EVIDENCE.slice(0, s.D ? 4 : 2).map(e => (
        <div key={e.tag} className="g-card flex items-center gap-[8px] rounded-[11px] px-[9px] py-[7px]">
          <Tag tone={GROUP_HEX[e.tone]}>{e.tag}</Tag>
          <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-[#c3d6e2]">{e.title}</span>
          <span className="font-mono text-[8px] uppercase text-[#6a8296]">{e.weight}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-full flex-col gap-[9px]">
      <Head over="сценарий 2021-05-19" title="Пробой уровня без объёма" sub={s.D ? undefined : 'График остановлен в точке t0. Применяй карты, чтобы прочитать сетап.'} />
      <Chart grid={s.C || s.D ? 'full' : 'soft'} label="BTC/USDT" />
      <SkillHand cards={hand} played={run.playedCards} onPlay={playCard} dense={s.D} />
      <CardReading card={lastCard} />
      {s.A && facts}
      {s.B && (
        <div className="flex min-h-0 flex-1 gap-[8px]">
          <div className="min-w-0 flex-1">{facts}</div>
          <div className="flex w-[100px] shrink-0 flex-col gap-[6px]">
            <Tile k="спред" v="0.02%" /><Tile k="ATR" v="312" tone="#D0B24A" />
          </div>
        </div>
      )}
      {s.C && <div className="min-h-0 flex-1" />}
      {s.D && (<>
        <div className="grid grid-cols-4 gap-[6px]">
          <Tile k="спред" v=".02%" /><Tile k="ATR" v="312" tone="#D0B24A" /><Tile k="OI" v="+8%" tone="#4C6180" /><Tile k="fund" v=".09%" tone="#C56861" />
        </div>
        {facts}
      </>)}
      <Btn full size="lg" onClick={onNext} disabled={run.playedCards.length === 0}
        sub={run.playedCards.length === 0 ? 'примени хотя бы одну карту' : undefined}
        icon={<IcChevR className="h-full w-full" />}>{page.cta}</Btn>
    </div>
  );
}

/* ============================ P08 DECISION ============================ */
function Decision({ page, v, onNext }: ScreenProps) {
  const s = V(v);
  const { run, set } = useRun();
  const pick = run.decision;
  const setPick = (id: string) => set('decision', id as DecisionId);
  const conv = run.conviction;
  const setConv = (n: number) => set('conviction', n);
  const hand = useHand();
  const playCard = (id: string) =>
    set('playedCards', run.playedCards.includes(id) ? run.playedCards : [...run.playedCards, id]);
  const choice = (c: typeof CHOICES[0]) => {
    const on = pick === c.id; const hex = GROUP_HEX[c.tone];
    return (
      <button key={c.id} onClick={() => setPick(c.id)}
        className="press focus-ring relative flex items-center gap-[9px] overflow-hidden rounded-[13px] p-[10px] text-left"
        style={{
          background: on ? `linear-gradient(165deg, ${hex}3d, ${hex}14)` : 'linear-gradient(170deg, rgba(20,38,58,.7), rgba(10,22,38,.8))',
          border: `1px solid ${on ? hex : 'rgba(120,190,210,.10)'}`,
          boxShadow: on ? `0 0 22px -10px ${hex}` : 'none',
        }}>
        <span className="grid h-[17px] w-[17px] shrink-0 place-items-center rounded-full"
          style={{ border: `1.6px solid ${on ? hex : '#3d5266'}`, background: on ? hex : 'transparent' }}>
          {on && <IcCheck className="h-[10px] w-[10px] text-[#04120f]" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11.5px] font-extrabold text-[#eaf4f8]">{c.label}</span>
          <span className="block truncate text-[9.5px] text-[#7d93a8]">{c.sub}</span>
        </span>
      </button>
    );
  };
  const conviction = (
    <div className="decision-conviction g-card rounded-[13px] p-[10px]">
      <div className="mb-[7px] flex items-center justify-between">
        <span className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#6a8296]">Убеждение</span>
        <span className="tnum font-mono text-[11px] font-extrabold text-[#2fe0c0]">{conv}/5</span>
      </div>
      <div className="flex gap-[5px]">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => setConv(n)}
            className="press-sm focus-ring h-[26px] flex-1 rounded-[7px]"
            style={{
              background: n <= conv ? 'linear-gradient(170deg,#3df0ce,#14a68c)' : 'rgba(120,190,210,.07)',
              border: `1px solid ${n <= conv ? 'rgba(47,224,192,.5)' : 'rgba(120,190,210,.12)'}`,
            }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col gap-[9px]">
      <Head over="панель решения" title="Что делаешь на t0?" sub={s.D ? undefined : 'После печати изменить нельзя.'} />
      <Chart grid={s.C || s.D ? 'full' : 'soft'} />
      {/* Cards stay visible at the decision: they are the reason behind the choice. */}
      <SkillHand cards={hand} played={run.playedCards} onPlay={playCard} dense />
      {s.A && (<><div className="decision-choices grid gap-[7px]">{CHOICES.map(choice)}</div>{conviction}</>)}
      {s.B && (
        <div className="flex min-h-0 flex-1 gap-[8px]">
          <div className="decision-choices grid min-w-0 flex-1 content-start gap-[7px]">{CHOICES.map(choice)}</div>
          <div className="flex w-[118px] shrink-0 flex-col gap-[7px]">{conviction}</div>
        </div>
      )}
      {s.C && <div className="decision-choices grid grid-cols-2 gap-[7px]">{CHOICES.map(choice)}</div>}
      {s.D && (<>
        <div className="decision-choices grid grid-cols-2 gap-[6px]">{CHOICES.map(choice)}</div>
        {conviction}
        <div className="grid grid-cols-3 gap-[6px]">
          <Tile k="риск" v="1R" tone="#C56861" /><Tile k="цель" v="3.2R" /><Tile k="стоп" v="66 840" tone="#D0B24A" />
        </div>
      </>)}
      <Btn full size="lg" disabled={!pick} onClick={onNext} icon={<IcChevR className="h-full w-full" />}
        sub={!pick ? 'выбери ENTER, WAIT или NO_TRADE' : undefined}>{page.cta}</Btn>
    </div>
  );
}

/* ============================ P09 SEAL ============================ */
function Seal({ v, onNext }: ScreenProps) {
  const s = V(v);
  const { run, set } = useRun();
  const [p, setP] = useState(0);
  const [holding, setHolding] = useState(false);
  /* Seal must be a deliberate, explicit act. Previously it auto-completed on
     mount, so the irreversible step happened without player intent. */
  useEffect(() => {
    if (!holding) { if (p < 100) setP(0); return; }
    const t = setInterval(() => setP(x => {
      if (x >= 100) return 100;
      const n = x + 4;
      if (n >= 100) {
        const tg = (window as unknown as { Telegram?: { WebApp?: { HapticFeedback?: { impactOccurred?: (s: string) => void } } } }).Telegram;
        tg?.WebApp?.HapticFeedback?.impactOccurred?.('heavy');
        set('sealed', true);
      }
      return n;
    }), 24);
    return () => clearInterval(t);
  }, [holding]);
  const decision = run.decision;
  const summary = decision
    ? `${DECISION_LABEL[decision]} · убеждение ${run.conviction}/5`
    : 'Решение не выбрано';
  const ring = (
    <div className="relative grid place-items-center" style={{ width: s.C ? 168 : 132, height: s.C ? 168 : 132 }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(120,190,210,.12)" strokeWidth="5" />
        <circle cx="50" cy="50" r="44" fill="none" stroke="#2fe0c0" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={276} strokeDashoffset={276 - (276 * p) / 100}
          style={{ transition: 'stroke-dashoffset .2s linear', filter: 'drop-shadow(0 0 6px rgba(47,224,192,.75))' }} />
      </svg>
      <div className="text-center">
        <IcSeal className={`mx-auto ${s.C ? 'h-[44px] w-[44px]' : 'h-[34px] w-[34px]'} text-[#2fe0c0]`} />
        <div className="tnum mt-[4px] font-mono text-[15px] font-extrabold text-white">{p}%</div>
      </div>
    </div>
  );
  const sealed = p >= 100;
  const title = sealed ? 'Решение запечатано' : holding ? 'Удерживай…' : 'Подтверди решение';
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[13px]">
      {s.B ? (
        <div className="flex w-full items-center gap-[14px]">
          {ring}
          <div className="min-w-0 flex-1 text-left">
            <Head over="печать" title={title} sub={summary} />
            <Bar v={p} />
          </div>
        </div>
      ) : (<>
        {ring}
        <div className="text-center">
          <h2 className="text-[19px] font-extrabold tracking-[-.02em] text-white">{title}</h2>
          <p className="mt-[5px] text-[11px] text-[#7d93a8]">{summary}</p>
          {run.invalidation && <p className="mt-[3px] text-[10px] text-[#6a8296]">Отмена: {run.invalidation}</p>}
        </div>
      </>)}
      {s.C && <div className="w-full"><Chart grid="none" sealLine /></div>}

      {!sealed && (
        <div className="w-full">
          <button
            onPointerDown={() => setHolding(true)}
            onPointerUp={() => setHolding(false)}
            onPointerLeave={() => setHolding(false)}
            onPointerCancel={() => setHolding(false)}
            disabled={!decision}
            className="press focus-ring relative flex h-[56px] w-full items-center justify-center gap-2 overflow-hidden rounded-[13px] text-[13px] font-extrabold"
            style={{
              background: 'linear-gradient(180deg,#6af1d8 0%,#35d4b7 48%,#16977f 100%)',
              color: '#031410', opacity: decision ? 1 : .4,
              border: '1px solid rgba(118,255,225,.72)',
            }}>
            <IcSeal className="h-[17px] w-[17px]" />
            {decision ? 'Удерживай, чтобы запечатать' : 'Решение не выбрано'}
          </button>
          <p className="mt-[6px] text-center text-[10px] text-[#7d93a8]">После печати решение изменить нельзя.</p>
        </div>
      )}

      {sealed && (
        <div className="w-full">
          <Btn full size="lg" onClick={onNext} icon={<IcEye className="h-full w-full" />}>Раскрыть будущее</Btn>
          <p className="mt-[6px] text-center text-[10px] text-[#7d93a8]">Дальше график дорисует реальную историю.</p>
        </div>
      )}
    </div>
  );
}

/* ============================ P10 REVEAL ============================ */
function Reveal({ page, v, onNext }: ScreenProps) {
  const s = V(v);
  const { run } = useRun();
  const total = CANDLES.length - T0;
  const [n, setN] = useState(0);
  useEffect(() => { setN(0); const t = setInterval(() => setN(x => (x >= total ? total : x + 1)), 95); return () => clearInterval(t); }, [v, total]);
  const done = n >= total;
  const delta = -3.8;
  /* Carries the sealed decision into Reveal so the screen reads as a
     continuation of the player's act, not an unrelated screen swap. */
  const carry = run.decision && (
    <div className="flex shrink-0 items-center gap-[7px] rounded-[11px] px-[9px] py-[7px]"
      style={{ background: 'rgba(47,224,192,.10)', border: '1px solid rgba(47,224,192,.28)' }}>
      <IcSeal className="h-[13px] w-[13px] shrink-0 text-[#2fe0c0]" />
      <span className="min-w-0 flex-1 truncate text-[10px] text-[#bfe3d6]">
        Запечатано: <b>{DECISION_LABEL[run.decision]}</b>{run.invalidation ? ` · отмена: ${run.invalidation}` : ''}
      </span>
    </div>
  );
  const summary = (
    <div className="g-card rounded-[13px] p-[10px]">
      <div className="flex items-center gap-[7px]">
        <span className="grid h-[26px] w-[26px] place-items-center rounded-[8px]" style={{ background: '#C5686122', color: '#C56861' }}>
          <IcTrend className="h-[15px] w-[15px] rotate-90" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[10.5px] font-extrabold text-[#eaf4f8]">Пробой оказался ложным</div>
          <div className="text-[9.5px] text-[#7d93a8]">Объём не подтвердил · возврат под уровень за 4 бара</div>
        </div>
        <span className="tnum font-mono text-[13px] font-extrabold text-[#e08b84]">{delta}%</span>
      </div>
    </div>
  );
  return (
    <div className="flex h-full flex-col gap-[9px]">
      {carry}
      <div className="flex items-center justify-between">
        <Head over={done ? 'ключевое событие' : 'перемотка времени'}
          title={done ? 'Историческое продолжение' : `Дорисовываем историю · ${n}/${total}`} />
        {!done && <span className="a-spin h-[14px] w-[14px] rounded-full border-2 border-[#2fe0c0] border-t-transparent" />}
      </div>
      {s.A && (<><Chart revealed={n} grid="soft" />{done && summary}</>)}
      {s.B && (<>
        <div className="flex gap-[8px]">
          <div className="min-w-0 flex-1"><Chart revealed={n} grid="soft" /></div>
          <div className="flex w-[100px] shrink-0 flex-col gap-[6px]">
            <Tile k="итог" v={`${delta}%`} tone="#C56861" /><Tile k="макс" v="-5.1%" tone="#C56861" /><Tile k="баров" v={String(n)} />
          </div>
        </div>{done && summary}<div className="flex-1" />
      </>)}
      {s.C && (<><Chart revealed={n} grid="full" /><div className="min-h-0 flex-1" />{done && summary}</>)}
      {s.D && (<>
        <Chart revealed={n} grid="full" />
        <div className="grid grid-cols-4 gap-[6px]">
          <Tile k="итог" v={`${delta}%`} tone="#C56861" /><Tile k="макс" v="-5.1" tone="#C56861" /><Tile k="баров" v={String(n)} /><Tile k="R" v="-1.0" tone="#D0B24A" />
        </div>
        {summary}
        <div className="grid gap-[6px]">
          {EVIDENCE.map(e => (
            <div key={e.tag} className="g-card flex items-center gap-[7px] rounded-[10px] px-[8px] py-[6px]">
              <Tag tone={GROUP_HEX[e.tone]}>{e.tag}</Tag>
              <span className="min-w-0 flex-1 truncate text-[9.5px] text-[#a9c0cf]">{e.body}</span>
            </div>
          ))}
        </div><div className="flex-1" />
      </>)}
      <Btn full size="lg" onClick={onNext} disabled={!done}
        sub={!done ? 'ждём завершения перемотки' : undefined}>{page.cta}</Btn>
    </div>
  );
}

/* ============================ P11 SCORE ============================ */
function Score({ page, v, onNext }: ScreenProps) {
  const s = V(v);
  const { run } = useRun();
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(false); const t = setTimeout(() => setOn(true), 90); return () => clearTimeout(t); }, [v]);
  /* Score is computed from the actual process, so it can never contradict
     what the player did, and it never rewards a lucky guess. */
  const { grade, total, rows: SCORE_ROWS } = scoreRun(run);
  const ring = (size: number) => (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(120,190,210,.12)" strokeWidth="6" />
        <circle cx="50" cy="50" r="43" fill="none" stroke="#2fe0c0" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={270} strokeDashoffset={on ? 270 - (270 * total) / 100 : 270}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.2,.9,.3,1)', filter: 'drop-shadow(0 0 7px rgba(47,224,192,.7))' }} />
      </svg>
      <div className="text-center">
        <div className="text-[26px] font-extrabold leading-none text-white">{grade}</div>
        <div className="tnum font-mono text-[10px] font-extrabold text-[#2fe0c0]">{total}/100</div>
      </div>
    </div>
  );
  const rows = (dense?: boolean) => (
    <div className={`grid ${dense ? 'grid-cols-2' : ''} gap-[7px]`}>
      {SCORE_ROWS.map((r, i) => (
        <div key={r.k} className="g-card rounded-[11px] px-[10px] py-[8px] a-rise" style={{ animationDelay: `${i * 70}ms` }}>
          <div className="mb-[5px] flex items-baseline justify-between">
            <span className="text-[10px] font-extrabold text-[#dceaf1]">{r.k}</span>
            <span className="tnum font-mono text-[11px] font-extrabold text-[#2fe0c0]">{on ? r.v : 0}</span>
          </div>
          <Bar v={on ? r.v : 0} tone={r.v >= 80 ? '#2E7F5C' : r.v >= 65 ? '#D0B24A' : '#C56861'} />
          {!dense && <div className="mt-[4px] text-[8.5px] text-[#6a8296]">{r.hint}</div>}
        </div>
      ))}
    </div>
  );
  return (
    <div className="flex h-full flex-col gap-[10px]">
      <Head over="разбор" title="Оценка решения" />
      {s.A && (<><div className="flex justify-center">{ring(126)}</div>{rows()}<div className="flex-1" /></>)}
      {s.B && (<><div className="flex items-center gap-[12px]">{ring(104)}<div className="min-w-0 flex-1">{rows(true)}</div></div><div className="flex-1" /><HandNote text="THE MARKET PAID YOU IN LESSONS. TAKE THEM." size={13} /></>)}
      {s.C && (<><div className="flex flex-1 items-center justify-center">{ring(168)}</div>{rows(true)}</>)}
      {s.D && (<>
        <div className="flex items-center gap-[10px]">{ring(84)}
          <div className="grid flex-1 grid-cols-2 gap-[6px]">
            <Tile k="ранг" v="#45" tone="#e9c46a" /><Tile k="+XP" v="120" /><Tile k="+звёзд" v="8" tone="#D0B24A" /><Tile k="стрик" v="6" tone="#4C6180" />
          </div>
        </div>
        {rows(true)}<div className="flex-1" />
      </>)}
      <Row gap={8}><Btn tone="ghost">Детали</Btn><div className="flex-1"><Btn full onClick={onNext}>{page.cta}</Btn></div></Row>
    </div>
  );
}

/* ============================ P12 INSIGHT ============================ */
function Insight({ v, onNext }: ScreenProps) {
  const s = V(v);
  const traits = [['Терпение', 82], ['Риск', 58], ['Чтение улик', 67], ['Дисциплина', 91], ['Скорость', 44]] as [string, number][];
  const radar = (size: number) => {
    const cx = 50, cy = 50, R = 38;
    const pts = traits.map((t, i) => {
      const a = (Math.PI * 2 * i) / traits.length - Math.PI / 2;
      const r = (t[1] / 100) * R;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(' ');
    const web = traits.map((_, i) => {
      const a = (Math.PI * 2 * i) / traits.length - Math.PI / 2;
      return `${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`;
    }).join(' ');
    return (
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="shrink-0">
        {[0.33, 0.66, 1].map(f => (
          <polygon key={f} points={traits.map((_, i) => {
            const a = (Math.PI * 2 * i) / traits.length - Math.PI / 2;
            return `${cx + R * f * Math.cos(a)},${cy + R * f * Math.sin(a)}`;
          }).join(' ')} fill="none" stroke="rgba(120,190,210,.14)" strokeWidth={0.7} />
        ))}
        <polygon points={web} fill="none" stroke="rgba(120,190,210,.2)" strokeWidth={0.8} />
        <polygon points={pts} fill="rgba(47,224,192,.22)" stroke="#2fe0c0" strokeWidth={1.6} />
      </svg>
    );
  };
  const list = (
    <div className="grid gap-[6px]">
      {traits.map(([k, val]) => (
        <div key={k} className="g-card rounded-[10px] px-[9px] py-[7px]">
          <div className="mb-[4px] flex justify-between"><span className="text-[10px] font-bold text-[#dceaf1]">{k}</span>
            <span className="tnum font-mono text-[10px] font-extrabold text-[#2fe0c0]">{val}</span></div>
          <Bar v={val} h={5} tone={val >= 75 ? '#2E7F5C' : val >= 55 ? '#D0B24A' : '#C56861'} />
        </div>
      ))}
    </div>
  );
  const verdict = (
    <div className="g-card rounded-[13px] p-[10px]" style={{ borderColor: 'rgba(233,196,106,.28)' }}>
      <Tag tone="#e9c46a">вердикт недели</Tag>
      <p className="mt-[6px] text-[11px] leading-[1.4] text-[#dceaf1]">
        Ты режешь победителей на 68% сделок. Дисциплина высокая, но выходишь до цели — работай с c23.
      </p>
    </div>
  );
  return (
    <div className="flex h-full flex-col gap-[9px]">
      <Head over="личный инсайт" title="Профиль за неделю" />
      {s.A && (<><div className="flex justify-center">{radar(184)}</div>{list}<div className="flex-1" />{verdict}</>)}
      {s.B && (<><div className="flex items-center gap-[10px]">{radar(140)}<div className="min-w-0 flex-1">{list}</div></div><div className="flex-1" />{verdict}</>)}
      {s.C && (<><div className="flex flex-1 items-center justify-center">{radar(218)}</div>{verdict}</>)}
      {s.D && (<>
        <div className="flex items-start gap-[10px]">{radar(112)}
          <div className="grid flex-1 grid-cols-2 gap-[6px]">
            <Tile k="сделок" v="34" /><Tile k="точность" v="71%" tone="#2E7F5C" /><Tile k="ср. R" v="1.8" tone="#D0B24A" /><Tile k="тильт" v="2" tone="#C56861" />
          </div>
        </div>
        {list}{verdict}<div className="flex-1" />
      </>)}
      <Btn full size="lg" onClick={onNext} icon={<IcLayers className="h-full w-full" />}>Открыть журнал решений</Btn>
    </div>
  );
}

/* ============================ P13/P14 LEADERBOARD ============================ */
function Leaderboard({ page, v }: ScreenProps) {
  const s = V(v);
  const friends = page.id === 'P14';
  const data = friends ? LEADERS.slice(1) : LEADERS;
  const row = (l: typeof LEADERS[0], dense?: boolean) => (
    <div key={l.name} className="g-card flex items-center gap-[8px] rounded-[11px] px-[9px] py-[7px]"
      style={l.you ? { borderColor: 'rgba(47,224,192,.45)', background: 'linear-gradient(170deg, rgba(47,224,192,.14), rgba(10,22,38,.8))' } : undefined}>
      <span className="tnum w-[16px] shrink-0 font-mono text-[11px] font-extrabold" style={{ color: l.rank <= 3 ? '#e9c46a' : '#5f7689' }}>{l.rank}</span>
      <span className="grid h-[24px] w-[24px] shrink-0 place-items-center rounded-full font-mono text-[9px] font-extrabold text-[#04120f]"
        style={{ background: l.you ? '#2fe0c0' : 'linear-gradient(160deg,#3a5468,#22323f)', color: l.you ? '#04120f' : '#9fb4c4' }}>
        {l.name.slice(1, 3).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1 truncate text-[10.5px] font-bold text-[#dceaf1]">{l.name}{l.you && <span className="ml-[4px] text-[8.5px] font-extrabold text-[#2fe0c0]">ВЫ</span>}</span>
      {!dense && <span className="font-mono text-[9px] font-extrabold" style={{ color: l.delta > 0 ? '#4bd6a8' : l.delta < 0 ? '#e08b84' : '#5f7689' }}>{l.delta > 0 ? `+${l.delta}` : l.delta || '—'}</span>}
      <span className="tnum font-mono text-[11px] font-extrabold text-[#eaf4f8]">{l.pts}</span>
    </div>
  );
  const podium = (
    <div className="flex items-end justify-center gap-[7px]">
      {[data[1], data[0], data[2]].filter(Boolean).map((l, i) => (
        <div key={l.name} className="flex flex-col items-center">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full font-mono text-[10px] font-extrabold text-[#9fb4c4]"
            style={{ background: 'linear-gradient(160deg,#3a5468,#22323f)', border: `1.5px solid ${i === 1 ? '#e9c46a' : 'rgba(120,190,210,.2)'}` }}>
            {l.name.slice(1, 3).toUpperCase()}
          </span>
          <div className="mt-[5px] w-[54px] rounded-t-[8px] text-center"
            style={{ height: i === 1 ? 48 : i === 0 ? 34 : 26, background: `linear-gradient(180deg, ${i === 1 ? 'rgba(233,196,106,.28)' : 'rgba(120,190,210,.12)'}, transparent)`, border: '1px solid rgba(120,190,210,.14)', borderBottom: 'none' }}>
            <span className="tnum font-mono text-[13px] font-extrabold text-white">{i === 1 ? 1 : i === 0 ? 2 : 3}</span>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <div className="flex h-full flex-col gap-[9px]">
      <Head over={friends ? 'друзья' : 'глобальный'} title="Лидеры сезона" />
      {s.A && (<>{podium}<div className="grid gap-[6px]">{data.map(l => row(l))}</div><div className="flex-1" /></>)}
      {s.B && (<><div className="flex gap-[9px]"><div className="shrink-0">{podium}</div><div className="grid min-w-0 flex-1 gap-[5px]">{data.slice(0, 4).map(l => row(l, true))}</div></div><div className="flex-1" /></>)}
      {s.C && (<><div className="flex-1 pt-3">{podium}</div><div className="grid gap-[6px]">{data.slice(0, 3).map(l => row(l))}</div></>)}
      {s.D && (<>
        <div className="grid grid-cols-3 gap-[6px]"><Tile k="ваш ранг" v="#3" tone="#2fe0c0" /><Tile k="очки" v="2180" /><Tile k="до топ-1" v="270" tone="#e9c46a" /></div>
        <div className="grid gap-[5px]">{data.map(l => row(l, true))}</div><div className="flex-1" />
      </>)}
      <Btn full tone="ghost">{friends ? 'Пригласить друга' : 'Показать друзей'}</Btn>
    </div>
  );
}

/* ============================ P19 CINEMATIC ============================ */
function Cinematic({ page, v, onNext }: ScreenProps) {
  const s = V(v);
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); const t = setTimeout(() => setOpen(true), 260); return () => clearTimeout(t); }, [v]);
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 bg-[#050a12] transition-[height] duration-[900ms] ease-[cubic-bezier(.7,0,.2,1)]" style={{ height: open ? 0 : '50%' }} />
        <div className="absolute inset-x-0 bottom-0 bg-[#050a12] transition-[height] duration-[900ms] ease-[cubic-bezier(.7,0,.2,1)]" style={{ height: open ? 0 : '50%' }} />
        <div className="absolute inset-x-0 h-[2px] bg-[#2fe0c0]/30" style={{ animation: 'scan 3.2s linear infinite' }} />
      </div>
      <div className="relative w-full text-center">
        <Tag tone="#C56861">blind scenario</Tag>
        <h2 className="mt-[8px] text-[24px] font-extrabold leading-[1.02] tracking-[-.03em] text-white">
          19 МАЯ 2021<br /><span className="text-[#2fe0c0]">СЕРИЯ ЛИКВИДАЦИЙ</span>
        </h2>
        <p className="mx-auto mt-[7px] max-w-[250px] text-[11px] leading-[1.42] text-[#7d93a8]">
          Улики скрыты. Только график и время. Решение стоит двойных очков.
        </p>
        {(s.A || s.D) && <div className="mt-3 w-full"><Chart grid="none" sealLine /></div>}
        {s.B && <div className="mt-3 grid grid-cols-3 gap-[6px]"><Tile k="множитель" v="x2" /><Tile k="улик" v="0" tone="#C56861" /><Tile k="время" v="90с" tone="#D0B24A" /></div>}
      </div>
      <div className="relative mt-4 w-full"><Btn full size="lg" onClick={onNext} icon={<IcEye className="h-full w-full" />}>{page.cta}</Btn></div>
      {s.C && <div className="relative mt-3"><HandNote text="NO EVIDENCE. NO EXCUSES." align="center" size={14} /></div>}
    </div>
  );
}

/* ============================ P20 EVIDENCE ============================ */
function Evidence({ page, v, onNext, onBack }: ScreenProps) {
  const s = V(v);
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState<number[]>([0]);
  const open = (k: number) => { setI(k); setSeen(p => p.includes(k) ? p : [...p, k]); };
  const e = EVIDENCE[i]; const hex = GROUP_HEX[e.tone];
  const last = i === EVIDENCE.length - 1;

  /* Focus card — the fact under inspection. Grows to fill its track. */
  const card = (
    <div className="g-card relative flex min-h-0 flex-col overflow-hidden rounded-[15px] p-[12px]" style={{ borderColor: `${hex}55` }}>
      <div className="flex items-center justify-between">
        <Tag tone={hex}>{e.tag}</Tag>
        <span className="rounded-[6px] px-[6px] py-[2px] font-mono text-[8.5px] font-extrabold uppercase"
          style={{ background: e.weight === 'ложная' ? 'rgba(197,104,97,.18)' : 'rgba(47,224,192,.14)', color: e.weight === 'ложная' ? '#e08b84' : '#51e5c8' }}>
          вес: {e.weight}
        </span>
      </div>
      <h3 className="mt-[9px] text-[15px] font-extrabold leading-[1.2] text-[#eaf4f8]">{e.title}</h3>
      <p className="mt-[6px] text-[12px] leading-[1.45] text-[#9db3c4]">{e.body}</p>
      <div className="mt-auto pt-[10px]">
        <div className="mb-[5px] flex items-center justify-between font-mono text-[8.5px] text-[#6a8296]">
          <span>изучено {seen.length}/{EVIDENCE.length}</span><span>{i + 1} / {EVIDENCE.length}</span>
        </div>
        <div className="flex gap-[4px]">{EVIDENCE.map((_, k) => (
          <span key={k} className="h-[3px] flex-1 rounded-full"
            style={{ background: k === i ? hex : seen.includes(k) ? 'rgba(47,224,192,.45)' : 'rgba(120,190,210,.14)' }} />
        ))}</div>
      </div>
    </div>
  );

  /* Dossier — every fact stays reachable, so no column is ever empty. */
  const dossier = (dense?: boolean) => (
    <div className="internal-list grid min-h-0 flex-1 content-start gap-[6px] overflow-y-auto pr-[2px]">
      {EVIDENCE.map((x, k) => {
        const on = k === i; const c = GROUP_HEX[x.tone];
        return (
          <button key={x.tag} onClick={() => open(k)}
            className="press-sm focus-ring g-card flex min-h-[46px] items-center gap-[8px] rounded-[11px] px-[9px] py-[7px] text-left"
            style={{ borderColor: on ? c : undefined, background: on ? `linear-gradient(170deg, ${c}26, transparent)` : undefined }}>
            <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full"
              style={{ background: seen.includes(k) ? c : 'rgba(120,190,210,.1)' }}>
              {seen.includes(k) && <IcCheck className="h-[10px] w-[10px] text-white" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[10.5px] font-bold text-[#dceaf1]">{x.title}</span>
              {!dense && <span className="block truncate text-[9px] text-[#7d93a8]">{x.tag} · вес {x.weight}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );

  /* Reading — converts a fact into a testable statement before the decision. */
  const reading = (
    <div className="g-inset rounded-[12px] px-[10px] py-[8px]">
      <div className="text-[8.5px] font-extrabold uppercase tracking-[.14em] text-[#6a8296]">что это значит</div>
      <p className="mt-[4px] text-[10.5px] leading-[1.4] text-[#b5c8d6]">
        {e.weight === 'ложная'
          ? 'Заголовок без реакции цены. В обосновании такой факт не засчитывается.'
          : 'Факт проверяется на графике. Его можно использовать в обосновании.'}
      </p>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-[9px]">
      <Head over="досье фактов" title="Отдели сигнал от шума" sub={s.D ? undefined : 'Один факт ложный. Он не должен попасть в обоснование.'} />

      {s.A && (<>
        <div className="flex min-h-0 flex-[1.15] flex-col">{card}</div>
        {reading}
        <div className="flex min-h-0 flex-1 flex-col">{dossier()}</div>
      </>)}

      {s.B && (
        <div className="flex min-h-0 flex-1 gap-[8px]">
          <div className="flex min-w-0 flex-[1.25] flex-col gap-[8px]">
            <div className="flex min-h-0 flex-1 flex-col">{card}</div>
            {reading}
          </div>
          <div className="flex w-[126px] min-w-0 shrink-0 flex-col">{dossier(true)}</div>
        </div>
      )}

      {s.C && (<>
        <div className="flex min-h-0 flex-1 flex-col">{card}</div>
        <Chart grid="soft" sealLine />
        {reading}
      </>)}

      {s.D && (<>
        <Chart grid="full" sealLine />
        <div className="flex min-h-0 flex-[0.9] flex-col">{card}</div>
        <div className="flex min-h-0 flex-1 flex-col">{dossier(true)}</div>
      </>)}

      <Row gap={8}>
        <Btn tone="ghost" onClick={() => i > 0 ? setI(i - 1) : onBack?.()}>Назад</Btn>
        <div className="flex-1">
          <Btn full onClick={() => last ? onNext?.() : open(i + 1)}
            sub={last && seen.length < EVIDENCE.length ? 'остались неизученные факты' : undefined}>
            {last ? page.cta : 'Следующий факт'}
          </Btn>
        </div>
      </Row>
    </div>
  );
}

/* ============================ P21–P24 SKILLS ============================ */
function Skills({ page, v, onNext }: ScreenProps) {
  const s = V(v);
  if (page.id === 'P29') {
    const skill = SKILLS[32];
    return (
      <div className="flex h-full flex-col gap-[10px]">
        <Head over="skill card · c33" title="Новость — не сигнал" sub="Карта открыта после разбора. Она меняет следующий процесс, а не обещает прибыль." />
        <div className="g-card flex flex-1 flex-col items-center justify-center rounded-[20px] p-[18px] text-center" style={{ borderColor: GROUP_HEX[skill.group] }}>
          <span className="grid h-[112px] w-[112px] place-items-center rounded-full bg-[#0c5f58] shadow-[inset_0_2px_0_rgba(255,255,255,.18)]">
            <img src={skill.src} alt="" className="h-[82px] w-[82px] object-contain" />
          </span>
          <h3 className="mt-[16px] text-[18px] font-extrabold text-white">{skill.name}</h3>
          <p className="mt-[7px] text-[12px] leading-[1.45] text-[#91a7ba]">Проверяй реакцию цены и объёма. Заголовок без реакции остаётся шумом.</p>
          <div className="mt-[12px] grid w-full grid-cols-2 gap-[7px]"><Tile k="группа" v="BLUE" tone="#4C6180" /><Tile k="уровень" v="T4" /></div>
        </div>
        <Btn full size="lg" onClick={onNext}>Добавить в колоду</Btn>
      </div>
    );
  }
  const group: Group = page.id === 'P21' ? 'green' : page.id === 'P22' ? 'yellow' : page.id === 'P23' ? 'blue' : 'red';
  const list = SKILLS.filter(k => k.group === group);
  const hex = GROUP_HEX[group];
  const owned = list.filter(k => k.owned).length;
  const header = (
    <div className="g-card flex items-center gap-[9px] rounded-[13px] p-[10px]" style={{ borderColor: `${hex}44` }}>
      <span className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-full" style={{ background: hex }}>
        <img src={list[0].src} alt="" className="h-[26px] w-[26px] object-contain" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[11.5px] font-extrabold text-[#eaf4f8]">{page.title}</div>
        <div className="mt-[3px] flex items-center gap-[6px]">
          <Bar v={(owned / list.length) * 100} tone={hex} h={5} />
          <span className="tnum shrink-0 font-mono text-[9px] font-extrabold" style={{ color: hex }}>{owned}/{list.length}</span>
        </div>
      </div>
    </div>
  );
  return (
    <div className="flex h-full flex-col gap-[9px]">
      {header}
      {s.A && <div className="internal-list grid min-h-0 flex-1 grid-cols-3 gap-[7px] overflow-y-auto pr-[2px]">{list.map(k => <SkillTile key={k.id} {...k} />)}</div>}
      {s.B && <div className="internal-list grid min-h-0 flex-1 grid-cols-2 gap-[7px] overflow-y-auto pr-[2px]">{list.map(k => <SkillTile key={k.id} {...k} />)}</div>}
      {s.C && (<>
        <div className="grid grid-cols-2 gap-[8px]">{list.slice(0, 2).map(k => <SkillTile key={k.id} {...k} />)}</div>
        <div className="internal-list grid min-h-0 flex-1 grid-cols-4 gap-[6px] overflow-y-auto pr-[2px]">{list.slice(2).map(k => <SkillTile key={k.id} {...k} dense />)}</div>
      </>)}
      {s.D && <div className="internal-list grid min-h-0 flex-1 grid-cols-5 gap-[5px] overflow-y-auto pr-[2px]">{list.map(k => <SkillTile key={k.id} {...k} dense />)}</div>}
      <div className="flex-1" />
      <Btn full tone={group} icon={<IcStar className="h-full w-full" />}>Прокачать группу</Btn>
    </div>
  );
}

/* ============================ P25 SESSION / P05 CONTRACT ============================ */
function Session({ v }: ScreenProps) {
  const s = V(v);
  const [ok, setOk] = useState(false);
  const rules = [
    'Я принимаю решения на исторических данных.',
    'Я определяю инвалидацию до входа.',
    'Я не меняю решение после печати.',
  ];
  const check = (
    <button onClick={() => setOk(!ok)} className="press focus-ring g-card flex items-start gap-[9px] rounded-[13px] p-[10px] text-left"
      style={{ borderColor: ok ? 'rgba(47,224,192,.5)' : undefined }}>
      <span className="mt-[1px] grid h-[19px] w-[19px] shrink-0 place-items-center rounded-[6px]"
        style={{ background: ok ? '#2fe0c0' : 'transparent', border: `1.6px solid ${ok ? '#2fe0c0' : '#3d5266'}` }}>
        {ok && <IcCheck className="h-[11px] w-[11px] text-[#04120f]" />}
      </span>
      <span className="text-[10.5px] leading-[1.4] text-[#c3d6e2]">Прочитал и согласен. Результат — следствие решения, а не удачи.</span>
    </button>
  );
  const listEl = (
    <div className="grid gap-[6px]">{rules.map((r, i) => (
      <div key={r} className="g-card flex items-start gap-[8px] rounded-[11px] px-[9px] py-[8px]">
        <span className="tnum mt-[1px] font-mono text-[10px] font-extrabold text-[#2fe0c0]">0{i + 1}</span>
        <span className="text-[10.5px] leading-[1.4] text-[#c3d6e2]">{r}</span>
      </div>
    ))}</div>
  );
  return (
    <div className="flex h-full flex-col gap-[10px]">
      <Head over="контракт сессии" title="Правила арены" sub={s.D ? undefined : 'Подпись обновляется каждое воскресенье.'} />
      {s.A && (<>{listEl}<div className="flex-1" />{check}</>)}
      {s.B && (<><div className="flex gap-[9px]"><div className="min-w-0 flex-1">{listEl}</div><BrandMark className="h-[86px] w-[86px] shrink-0" /></div><div className="flex-1" />{check}</>)}
      {s.C && (<><div className="flex flex-1 flex-col items-center justify-center gap-3"><BrandMark className="h-[112px] w-[112px]" /><HandNote align="center" size={14} /></div>{check}</>)}
      {s.D && (<>{listEl}<div className="grid grid-cols-3 gap-[6px]"><Tile k="сессий" v="34" /><Tile k="печатей" v="121" tone="#D0B24A" /><Tile k="отказов" v="19" tone="#4C6180" /></div><div className="flex-1" />{check}</>)}
      <Btn full size="lg" disabled={!ok} icon={<IcSeal className="h-full w-full" />}>Подписать и войти</Btn>
    </div>
  );
}

/* ============================ P26 POST-LOSS ============================ */
function PostLoss({ v }: ScreenProps) {
  const s = V(v);
  const [step, setStep] = useState(0);
  const steps = [
    { t: 'Дыши', d: 'Четыре секунды вдох, шесть выдох. Пульс решает хуже головы.', Icon: IcClock },
    { t: 'Назови ошибку', d: 'Вход без подтверждения объёмом. Инвалидация была, стоп сдвинут.', Icon: IcEye },
    { t: 'Кулдаун', d: 'Следующий сценарий через 12 минут. Это правило, не наказание.', Icon: IcShield },
  ];
  const S0 = steps[step];
  const breathe = (size: number) => (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <span className="a-breathe absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(197,104,97,.3), transparent 70%)' }} />
      <span className="absolute inset-[14%] rounded-full border border-[#C56861]/40" />
      <S0.Icon className="h-[28px] w-[28px] text-[#e08b84]" />
    </div>
  );
  return (
    <div className="flex h-full flex-col gap-[10px]">
      <div className="flex items-center gap-[4px]">
        {steps.map((_, n) => <span key={n} className="h-[3px] flex-1 rounded-full" style={{ background: n <= step ? '#C56861' : 'rgba(120,190,210,.14)' }} />)}
        <span className="tnum ml-[5px] font-mono text-[9px] font-extrabold text-[#e08b84]">{step + 1}/3</span>
      </div>
      <Head over="протокол после убытка" title={S0.t} sub={S0.d} />
      {s.A && (<><div className="flex flex-1 items-center justify-center">{breathe(150)}</div></>)}
      {s.B && (<><div className="flex items-center gap-[12px]">{breathe(104)}<div className="grid flex-1 gap-[6px]"><Tile k="просадка" v="-2.4R" tone="#C56861" /><Tile k="кулдаун" v="12:00" tone="#D0B24A" /></div></div><div className="flex-1" /></>)}
      {s.C && (<><div className="flex flex-1 items-center justify-center">{breathe(190)}</div><HandNote text="TILT IS A POSITION YOU NEVER OPENED ON PURPOSE." size={13} align="center" /></>)}
      {s.D && (<><div className="flex items-center gap-[10px]">{breathe(88)}
        <div className="grid flex-1 grid-cols-2 gap-[6px]"><Tile k="просадка" v="-2.4R" tone="#C56861" /><Tile k="серия" v="2" tone="#D0B24A" /><Tile k="кулдаун" v="12:00" /><Tile k="утешение" v={<Stars n="+10" size={15} tone="#4C6180" />} tone="#4C6180" /></div></div>
        <Chart revealed={16} grid="full" sealLine={false} /><div className="flex-1" /></>)}
      <Btn full size="lg" tone={step === 2 ? 'teal' : 'red'} onClick={() => setStep(Math.min(2, step + 1))}>
        {step === 2 ? 'Принять и выйти в хаб' : 'Дальше'}
      </Btn>
    </div>
  );
}

/* ============================ P27 MISSIONS ============================ */
function Missions({ v }: ScreenProps) {
  const s = V(v);
  const row = (m: typeof MISSIONS[0], dense?: boolean) => {
    const done = m.cur >= m.max;
    return (
      <div key={m.t} className="g-card rounded-[12px] px-[10px] py-[9px]">
        <div className="flex items-center gap-[8px]">
          <span className="min-w-0 flex-1 truncate text-[10.5px] font-bold text-[#dceaf1]">{m.t}</span>
          <Stars n={`+${m.reward}`} size={9.5} />
        </div>
        {!dense && <div className="mt-[7px] flex items-center gap-[7px]">
          <Bar v={(m.cur / m.max) * 100} tone={done ? '#2E7F5C' : '#2fe0c0'} h={5} />
          <span className="tnum shrink-0 font-mono text-[9px] font-extrabold text-[#7d93a8]">{m.cur}/{m.max}</span>
        </div>}
        {done && <div className="mt-[8px]"><Btn size="sm" full icon={<IcStar className="h-full w-full" />}>Забрать</Btn></div>}
      </div>
    );
  };
  return (
    <div className="flex h-full flex-col gap-[9px]">
      <div className="flex items-end justify-between">
        <Head over="ежедневно" title="Миссии дня" />
        <span className="tnum mb-[10px] font-mono text-[10px] font-extrabold text-[#e9c46a]">08:24:10</span>
      </div>
      {s.A && (<><div className="grid gap-[7px]">{MISSIONS.map(m => row(m))}</div><div className="flex-1" /><HandNote text="SHOW UP DAILY. THE EDGE IS BORING." size={13} /></>)}
      {s.B && (<><div className="grid grid-cols-2 gap-[7px]">{MISSIONS.map(m => row(m))}<div className="g-card grid place-items-center rounded-[12px] p-[10px] text-center">
        <IcCoin className="h-[24px] w-[24px] text-[#e9c46a]" /><span className="mt-[5px] flex items-center gap-[4px] text-[9.5px] font-bold text-[#a9c0cf]">Все три — бонус <Stars n="+50" size={10} /></span></div></div><div className="flex-1" /></>)}
      {s.C && (<><div className="flex flex-1 flex-col justify-center gap-[8px]">{MISSIONS.map(m => row(m))}</div></>)}
      {s.D && (<><div className="grid grid-cols-3 gap-[6px]"><Tile k="выполнено" v="1/3" /><Tile k="звёзд" v="48" tone="#e9c46a" /><Tile k="стрик" v="6" tone="#4C6180" /></div>
        <div className="grid gap-[5px]">{MISSIONS.map(m => row(m, true))}</div><div className="flex-1" /></>)}
      <Btn full tone="ghost">История наград</Btn>
    </div>
  );
}

/* ============================ P28 ENERGY ============================ */
function Energy({ v }: ScreenProps) {
  const s = V(v);
  const segs = [1, 1, 1, 0, 0];
  const meter = (big?: boolean) => (
    <div className="g-card rounded-[14px] p-[11px]">
      <div className="mb-[8px] flex items-center justify-between">
        <span className="flex items-center gap-[5px] text-[9px] font-extrabold uppercase tracking-[.15em] text-[#6a8296]">
          <IcLightning className="h-[12px] w-[12px] text-[#2fe0c0]" />энергия</span>
        <span className="tnum font-mono text-[11px] font-extrabold text-[#2fe0c0]">3/5</span>
      </div>
      <div className="flex gap-[5px]">{segs.map((f, i) => (
        <div key={i} className="flex-1 rounded-[6px]" style={{
          height: big ? 28 : 18,
          background: f ? 'linear-gradient(180deg,#3df0ce,#14a68c)' : 'rgba(120,190,210,.08)',
          border: `1px solid ${f ? 'rgba(47,224,192,.5)' : 'rgba(120,190,210,.12)'}`,
          boxShadow: f ? '0 0 10px -3px rgba(47,224,192,.8)' : 'none',
        }} />
      ))}</div>
      <div className="mt-[7px] text-[9px] text-[#6a8296]">Следующая единица через 18:42</div>
    </div>
  );
  const xp = (
    <div className="g-card rounded-[14px] p-[11px]">
      <div className="mb-[7px] flex items-center justify-between">
        <span className="text-[9px] font-extrabold uppercase tracking-[.15em] text-[#6a8296]">опыт до LVL 08</span>
        <span className="tnum font-mono text-[11px] font-extrabold text-[#e9c46a]">420/600</span>
      </div>
      <Bar v={70} tone="#e9c46a" h={9} />
    </div>
  );
  return (
    <div className="flex h-full flex-col gap-[9px]">
      <Head over="ресурсы" title="Энергия и прогресс" />
      {s.A && (<>{meter(true)}{xp}<div className="flex-1" /></>)}
      {s.B && (<><div className="grid grid-cols-2 gap-[8px]"><div>{meter()}</div><div>{xp}</div></div>
        <div className="grid grid-cols-2 gap-[6px]"><Tile k="сессий сегодня" v="2" /><Tile k="до бонуса" v="1" tone="#D0B24A" /></div><div className="flex-1" /></>)}
      {s.C && (<><div className="flex flex-1 flex-col justify-center gap-[9px]">{meter(true)}{xp}</div></>)}
      <Btn full icon={<IcCoin className="h-full w-full" />}>Пополнить энергию · 20 звёзд</Btn>
    </div>
  );
}

/* ============================ P29 STORE ============================ */
function Store({ v }: ScreenProps) {
  const s = V(v);
  const perks = ['Верифицированный founder-знак', 'Ранний доступ к режимам', 'Двойной стрик-бонус', 'Эксклюзивная рамка профиля'];
  const pack = (big?: boolean) => (
    <div className="g-card relative overflow-hidden rounded-[15px] p-[12px]" style={{ borderColor: 'rgba(233,196,106,.35)' }}>
      <div className="a-sweep absolute inset-0" />
      <div className="relative flex items-center gap-[9px]">
        <BrandMark className={big ? 'h-[58px] w-[58px]' : 'h-[42px] w-[42px]'} />
        <div className="min-w-0 flex-1">
          <Tag tone="#e9c46a">founder pack</Tag>
          <div className="mt-[5px] text-[13px] font-extrabold text-[#eaf4f8]">Основатель арены</div>
          <Stars n="1 499" size={11} />
        </div>
      </div>
      {big && <div className="relative mt-[10px] grid gap-[5px]">{perks.map(p => (
        <div key={p} className="flex items-center gap-[6px]"><IcCheck className="h-[11px] w-[11px] shrink-0 text-[#2fe0c0]" />
          <span className="text-[10px] text-[#a9c0cf]">{p}</span></div>
      ))}</div>}
    </div>
  );
  return (
    <div className="flex h-full flex-col gap-[9px]">
      <Head over="магазин" title="Founder Pack" sub={s.D ? undefined : 'Единственная платная кнопка в игре.'} />
      {s.A && (<>{pack(true)}<div className="flex-1" /></>)}
      {s.B && (<><div className="flex gap-[8px]"><div className="min-w-0 flex-1">{pack()}</div>
        <div className="grid w-[112px] shrink-0 gap-[5px]">{perks.slice(0, 3).map(p => (
          <div key={p} className="g-card rounded-[9px] px-[7px] py-[6px] text-[8.5px] leading-tight text-[#a9c0cf]">{p}</div>))}</div>
      </div><div className="flex-1" /></>)}
      {s.C && (<><div className="flex flex-1 items-center">{pack(true)}</div></>)}
      {s.D && (<>{pack()}<div className="grid gap-[5px]">{perks.map(p => (
        <div key={p} className="g-card flex items-center gap-[7px] rounded-[10px] px-[9px] py-[7px]">
          <IcCheck className="h-[11px] w-[11px] shrink-0 text-[#2fe0c0]" /><span className="text-[10px] text-[#a9c0cf]">{p}</span></div>))}</div>
        <div className="flex-1" /></>)}
      <Btn full size="lg" icon={<IcStar className="h-full w-full" />}>Купить за 1 499 звёзд</Btn>
    </div>
  );
}

/* ============================ P30 REFERRAL ============================ */
function Referral({ v }: ScreenProps) {
  const s = V(v);
  const [copied, setCopied] = useState(false);
  const link = (
    <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      className="press focus-ring g-inset flex w-full items-center gap-[8px] rounded-[12px] px-[10px] py-[10px]">
      <span className="min-w-0 flex-1 truncate text-left font-mono text-[10px] text-[#9fb4c4]">t.me/signalarena?start=ref_7Kq2</span>
      <span className="shrink-0 font-mono text-[9px] font-extrabold" style={{ color: copied ? '#2fe0c0' : '#6a8296' }}>{copied ? 'СКОПИРОВАНО' : 'КОПИРОВАТЬ'}</span>
    </button>
  );
  const avatars = (
    <div className="flex items-center gap-[-6px]">
      {[0, 1, 2, 3, 4].map(i => (
        <span key={i} className="grid h-[30px] w-[30px] place-items-center rounded-full font-mono text-[9px] font-extrabold"
          style={{
            marginLeft: i ? -8 : 0, zIndex: 5 - i,
            background: i < 3 ? 'linear-gradient(160deg,#2fe0c0,#14a68c)' : 'rgba(120,190,210,.08)',
            color: i < 3 ? '#04120f' : '#4e6377', border: '2px solid #0b1a2c',
          }}>{i < 3 ? 'OK' : '+'}</span>
      ))}
      <span className="tnum ml-[8px] font-mono text-[11px] font-extrabold text-[#2fe0c0]">3/5</span>
    </div>
  );
  return (
    <div className="flex h-full flex-col gap-[10px]">
      <Head over="реферальная программа" title="Снабди своих сигналом" sub="Пять приглашений — стикер-пак и 50 звёзд." />
      {s.A && (<>{link}<div className="g-card rounded-[13px] p-[11px]">{avatars}<div className="mt-[9px]"><Bar v={60} /></div></div><div className="flex-1" /><HandNote text="BRING SOMEONE WHO ARGUES WITH YOU." size={13} /></>)}
      {s.B && (<><div className="flex items-center gap-[10px]"><div className="min-w-0 flex-1">{link}</div></div>
        <div className="g-card rounded-[13px] p-[11px]">{avatars}<div className="mt-[9px]"><Bar v={60} /></div></div>
        <div className="grid grid-cols-2 gap-[6px]"><Tile k="приглашено" v="3" /><Tile k="награда" v={<Stars n="50" size={15} />} tone="#e9c46a" /></div><div className="flex-1" /></>)}
      {s.C && (<><div className="flex flex-1 flex-col items-center justify-center gap-3">{avatars}<Bar v={60} /></div>{link}</>)}
      <Btn full size="lg">Поделиться в Telegram</Btn>
    </div>
  );
}

/* ============================ P31/P32 EMPTY & ERROR ============================ */
function EmptyErr({ page, v, onNext }: ScreenProps) {
  const s = V(v); const err = page.kind === 'error';
  const hex = err ? '#C56861' : '#4C6180';
  /* retry must actually retry: idle → loading → resolved, never a silent jump */
  const [phase, setPhase] = useState<'idle' | 'loading' | 'ok'>('idle');
  const retry = () => {
    setPhase('loading');
    setTimeout(() => setPhase('ok'), 1100);
  };
  const art = (size: number) => (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <polyline points="8,72 24,52 38,62 52,34 68,46 92,20" fill="none" stroke={hex} strokeWidth="2.4"
          strokeLinecap="round" strokeLinejoin="round" opacity={err ? 0.5 : 0.35}
          strokeDasharray={err ? '7 6' : undefined} />
        {err && <g stroke={hex} strokeWidth="3" strokeLinecap="round"><path d="M40 82h20" /><path d="M50 74v-6" /></g>}
      </svg>
    </div>
  );
  const body = (
    <div className={s.B ? 'text-left' : 'text-center'}>
      <Tag tone={hex}>{err ? 'ошибка сети' : 'пусто'}</Tag>
      <h2 className="mt-[8px] text-[16px] font-extrabold text-[#eaf4f8]">{err ? 'Данные не пришли' : 'Журнал пуст'}</h2>
      <p className="mt-[5px] text-[11px] leading-[1.42] text-[#7d93a8]">
        {err
          ? (phase === 'loading' ? 'Повторный запрос выполняется…'
            : phase === 'ok' ? 'Соединение восстановлено. Данные сценария получены.'
              : 'Показываем кэш от 4 минут назад. Проверь соединение и повтори запрос.')
          : 'Ни одного запечатанного решения. Первый сценарий занимает три минуты.'}
      </p>
    </div>
  );
  return (
    <div className="flex h-full flex-col">
      {s.B ? (<div className="flex flex-1 items-center gap-[12px]">{art(112)}<div className="min-w-0 flex-1">{body}</div></div>)
        : (<div className="flex flex-1 flex-col items-center justify-center gap-[10px]">{art(s.C ? 168 : 128)}{body}
          {s.C && <HandNote text={err ? 'NETWORKS FAIL. PLANS SHOULD NOT.' : 'AN EMPTY JOURNAL IS AN HONEST ONE.'} align="center" size={13} />}</div>)}
      {err ? (
        phase === 'ok'
          ? <Btn full size="lg" onClick={onNext}>Продолжить сценарий</Btn>
          : <Btn full size="lg" tone="red" onClick={retry} disabled={phase === 'loading'}
              sub={phase === 'loading' ? 'ждём ответ сети' : 'запрос будет повторён'}>
              {phase === 'loading' ? 'Повторяем…' : 'Повторить запрос'}
            </Btn>
      ) : (
        <Btn full size="lg" onClick={onNext}>Начать сценарий</Btn>
      )}
    </div>
  );
}

/* ============================ P33 TOASTS ============================ */
function Toasts({ v }: ScreenProps) {
  const s = V(v);
  const tone = (k: string) => k === 'success' ? '#2E7F5C' : k === 'error' ? '#C56861' : '#4C6180';
  const item = (t: typeof TOASTS[0], i: number) => (
    <div key={t.title} className="g-raise flex items-center gap-[9px] overflow-hidden rounded-[13px] px-[10px] py-[9px] a-rise"
      style={{ borderColor: `${tone(t.kind)}55`, animationDelay: `${i * 90}ms` }}>
      <span className="grid h-[24px] w-[24px] shrink-0 place-items-center rounded-full" style={{ background: tone(t.kind) }}>
        {t.kind === 'success' ? <IcCheck className="h-[12px] w-[12px] text-white" />
          : t.kind === 'error' ? <IcCross className="h-[12px] w-[12px] text-white" />
            : <IcLayers className="h-[12px] w-[12px] text-white" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[10.5px] font-extrabold text-[#eaf4f8]">{t.title}</span>
        <span className="block truncate text-[9.5px] text-[#8fa7b8]">{t.body}</span>
      </span>
      <span className="h-[3px] w-[26px] overflow-hidden rounded-full bg-white/10">
        <span className="block h-full rounded-full" style={{ width: '60%', background: tone(t.kind) }} />
      </span>
    </div>
  );
  return (
    <div className="flex h-full flex-col gap-[9px]">
      <Head over="системный слой" title="Стек уведомлений" sub={s.D ? undefined : 'Максимум три, вытеснение снизу.'} />
      {s.A && (<><div className="grid gap-[7px]">{TOASTS.map(item)}</div><div className="flex-1" /></>)}
      {s.B && (<><div className="flex gap-[8px]"><div className="grid min-w-0 flex-1 gap-[6px]">{TOASTS.map(item)}</div>
        <div className="grid w-[86px] shrink-0 gap-[6px]"><Tile k="в очереди" v="3" /><Tile k="TTL" v="4с" tone="#D0B24A" /></div></div><div className="flex-1" /></>)}
      {s.C && (<><div className="flex flex-1 flex-col justify-center gap-[8px]">{TOASTS.map(item)}</div></>)}
      {s.D && (<><div className="grid gap-[5px]">{[...TOASTS, ...TOASTS].map((t, i) => item(t, i))}</div><div className="flex-1" /></>)}
      <Btn full tone="ghost">Показать тестовый тост</Btn>
    </div>
  );
}

/* ============================ P34 BOTTOM SHEET ============================ */
function Sheet({ v }: ScreenProps) {
  const s = V(v);
  const [open, setOpen] = useState(true);
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1">
        <Head over="нижний шит" title="Правила сценария" sub="Шит закрывает часть экрана, а не весь кадр." />
        <Chart grid="soft" />
      </div>
      {open && <div className="absolute inset-0 rounded-[16px] bg-black/55" onClick={() => setOpen(false)} />}
      <div className="g-raise relative rounded-t-[20px] p-[12px] transition-transform duration-300"
        style={{ transform: open ? 'translateY(0)' : 'translateY(78%)' }}>
        <span className="mx-auto mb-[10px] block h-[4px] w-[38px] rounded-full bg-white/18" />
        {s.B ? (
          <div className="flex gap-[9px]">
            <div className="min-w-0 flex-1"><div className="text-[12px] font-extrabold text-[#eaf4f8]">Дневная арена</div>
              <p className="mt-[4px] text-[10px] leading-[1.42] text-[#8fa7b8]">Один сценарий, до 7 решений, энергия списывается на входе.</p></div>
            <div className="grid w-[96px] shrink-0 gap-[5px]"><Tile k="энергия" v="1" /><Tile k="очки" v="x1" tone="#D0B24A" /></div>
          </div>
        ) : (<>
          <div className="text-[12px] font-extrabold text-[#eaf4f8]">Дневная арена</div>
          <p className="mt-[4px] text-[10px] leading-[1.42] text-[#8fa7b8]">Один сценарий, до 7 решений, энергия списывается на входе. Печать необратима.</p>
          {(s.C || s.D) && <div className="mt-[9px] grid grid-cols-3 gap-[6px]">
            <Tile k="энергия" v="1" /><Tile k="решений" v="7" tone="#4C6180" /><Tile k="очки" v="x1" tone="#D0B24A" /></div>}
        </>)}
        <div className="mt-[11px]"><Btn full size="lg" onClick={() => setOpen(!open)}>{open ? 'Понятно, начать' : 'Открыть правила'}</Btn></div>
      </div>
    </div>
  );
}

/* ============================ MVP REQUIRED STATES ============================ */
function Rationale({ page, onNext }: ScreenProps) {
  const { run, set } = useRun();
  const selected = run.rationale;
  const toggle = (i: number) => set('rationale', selected.includes(i) ? selected.filter(x => x !== i) : [...selected, i]);
  const falseIdx = EVIDENCE.findIndex(e => e.weight === 'ложная');
  const usedFalse = selected.includes(falseIdx);
  return (
    <div className="flex h-full flex-col gap-[9px]">
      <RunRail step={2} steps={4} label="Заход · обоснование" />
      <Head over="обязательный шаг"
        title={run.decision ? `Чем подкреплён ${DECISION_LABEL[run.decision]}?` : 'На чём держится решение?'}
        sub="Выбери минимум два факта. Мнение без доказательств не принимается." />
      <div className="grid gap-[7px]">
        {EVIDENCE.map((e, i) => {
          const on = selected.includes(i); const hex = GROUP_HEX[e.tone];
          return (
            <button key={e.title} onClick={() => toggle(i)} className="press focus-ring g-card flex min-h-[52px] items-center gap-[9px] rounded-[13px] p-[9px] text-left"
              style={{ borderColor: on ? hex : undefined }}>
              <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[7px]" style={{ background: on ? hex : 'rgba(120,190,210,.08)' }}>
                {on && <IcCheck className="h-[12px] w-[12px] text-white" />}
              </span>
              <span className="min-w-0 flex-1"><span className="block text-[11px] font-extrabold text-[#eaf4f8]">{e.title}</span>
                <span className="block text-[9.5px] text-[#8fa7b8]">{e.body}</span></span>
            </button>
          );
        })}
      </div>
      {usedFalse && (
        <div className="g-inset rounded-[11px] px-[10px] py-[8px]" style={{ borderColor: 'rgba(197,104,97,.45)' }}>
          <p className="text-[10px] leading-[1.4] text-[#e8a9a3]">
            В обосновании есть факт без реакции цены. Решение примут, но чтение фактов будет оценено ниже.
          </p>
        </div>
      )}
      <Btn full size="lg" onClick={onNext} disabled={selected.length < 2}
        sub={selected.length < 2 ? `выбрано ${selected.length} из 2 минимум` : undefined}>{page.cta}</Btn>
    </div>
  );
}

function TutorialFeedback({ page, onNext }: ScreenProps) {
  return (
    <div className="flex h-full flex-col gap-[10px]">
      <Head over="заход 1 · feedback" title="Слом структуры найден" sub="Расширенное тело закрылось ниже уровня. Это наблюдение, ещё не прогноз." />
      <Chart target={TUTORIAL_TARGET} hit="ok" sealLine={false} />
      <div className="g-card rounded-[14px] p-[11px]"><Tag tone="#2E7F5C">почему верно</Tag><p className="mt-[6px] text-[11px] leading-[1.45] text-[#c3d6e2]">Свеча поглотила предыдущую и изменила последовательность минимумов. Ты отметил факт, а не угадал будущее.</p></div>
      <div className="flex-1" />
      <Btn full size="lg" onClick={onNext}>{page.cta}</Btn>
    </div>
  );
}

function Invalidation({ page, onNext }: ScreenProps) {
  const { run, set } = useRun();
  const level = run.invalidation;
  const setLevel = (l: string) => set('invalidation', l);
  const levels = ['Возврат ниже 67 810', 'Закрепление выше 68 040', 'Нет объёма на ретесте', 'Структура 1H сломана'];
  return (
    <div className="flex h-full flex-col gap-[9px]">
      <RunRail step={3} steps={4} label="Заход · инвалидация" />
      <Head over="обязательный шаг" title="Что отменит идею?" sub="Инвалидация задаётся до Seal. После результата она бесполезна." />
      <Chart grid="soft" sealLine />
      <div className="grid grid-cols-2 gap-[7px]">
        {levels.map(l => <button key={l} onClick={() => setLevel(l)} className="press focus-ring g-card min-h-[54px] rounded-[12px] p-[8px] text-left text-[10.5px] font-bold text-[#c3d6e2]"
          style={{ borderColor: level === l ? '#D0B24A' : undefined, background: level === l ? 'rgba(208,178,74,.16)' : undefined }}>{l}</button>)}
      </div>
      <Btn full size="lg" onClick={onNext} disabled={!level} tone="yellow"
        sub={!level ? 'выбери условие отмены' : undefined}>{page.cta}</Btn>
    </div>
  );
}

function Unfamiliar({ page, onNext }: ScreenProps) {
  const { run, set } = useRun();
  const [mode, setMode] = useState<'ask' | 'study'>('ask');
  void page;
  if (mode === 'study') {
    return (
      <div className="flex h-full flex-col gap-[10px]">
        <Head over="мини-урок · без штрафа" title="Funding простыми словами"
          sub="Funding — плата между лонгами и шортами. Высокий положительный funding означает, что за удержание лонгов платят, а толпа уже в позиции." />
        <div className="g-card flex min-h-0 flex-1 flex-col justify-center gap-[8px] rounded-[15px] p-[12px]">
          <div className="flex items-center gap-[8px]"><Tag tone="#2E7F5C">норма</Tag><span className="text-[11px] text-[#c3d6e2]">0.01% — баланс сторон</span></div>
          <div className="flex items-center gap-[8px]"><Tag tone="#D0B24A">внимание</Tag><span className="text-[11px] text-[#c3d6e2]">0.05% — перекос в лонги</span></div>
          <div className="flex items-center gap-[8px]"><Tag tone="#C56861">перегрет</Tag><span className="text-[11px] text-[#c3d6e2]">0.09% — текущее значение сценария</span></div>
        </div>
        <div className="g-inset rounded-[11px] px-[10px] py-[8px]">
          <p className="text-[10.5px] leading-[1.4] text-[#b5c8d6]">Попытка не списана, очки не уменьшены. Навык отмечен как изученный.</p>
        </div>
        <Btn full size="lg" onClick={() => { set('studiedTopic', true); onNext?.(); }}>Вернуться к фактам</Btn>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col justify-center gap-[12px]">
      <div className="g-card rounded-[18px] p-[15px] text-center">
        <span className="mx-auto grid h-[58px] w-[58px] place-items-center rounded-full bg-[#4C6180]/30 text-[#9fb4c4]"><IcEye className="h-[28px] w-[28px]" /></span>
        <h2 className="mt-[12px] text-[19px] font-extrabold text-white">Термин «funding» незнаком?</h2>
        <p className="mt-[6px] text-[12px] leading-[1.45] text-[#91a7ba]">За незнание штрафа нет. Можно открыть короткое объяснение или пропустить факт: попытка и очки сохранятся.</p>
      </div>
      <Btn full size="lg" onClick={() => setMode('study')}>Изучить за 40 секунд</Btn>
      <Btn full size="lg" tone="ghost" onClick={() => { set('skippedTopic', true); onNext?.(); }}>Пропустить без штрафа</Btn>
      {(run.studiedTopic || run.skippedTopic) && (
        <p className="text-center text-[10px] text-[#6a8296]">
          {run.studiedTopic ? 'Тема изучена.' : 'Тема пропущена. Штраф не применён.'}
        </p>
      )}
    </div>
  );
}

function Debrief({ page, onNext }: ScreenProps) {
  const { run } = useRun();
  const d = run.decision;
  const falseIdx = EVIDENCE.findIndex(e => e.weight === 'ложная');
  const usedFalse = run.rationale.includes(falseIdx);
  /* Every line below is derived from the actual run. */
  const worked = run.invalidation
    ? `Инвалидация задана до Seal: ${run.invalidation}.`
    : 'Решение доведено до Seal без изменений после фиксации.';
  const improve = usedFalse
    ? 'В обоснование попал заголовок без реакции цены. Это шум, а не факт.'
    : d === 'enter'
      ? 'Вход состоялся без подтверждения объёмом. Проверяй объём до входа.'
      : 'Добавь ещё один независимый факт, чтобы обоснование не держалось на одном сигнале.';
  return (
    <div className="flex h-full flex-col gap-[9px]">
      <Head over="разбор завершён"
        title={d === 'enter' ? 'Результат наказал вход' : 'Решение оказалось дороже результата'}
        sub={d ? `${DECISION_SUMMARY[d]} История пошла вниз. Оценка дана за процесс, а не за угаданное направление.` : 'Решение не было зафиксировано.'} />
      <div className="g-card rounded-[15px] p-[11px]"><Tag tone="#2E7F5C">сработало</Tag><p className="mt-[6px] text-[11px] text-[#c3d6e2]">{worked}</p></div>
      <div className="g-card rounded-[15px] p-[11px]"><Tag tone="#D0B24A">улучшить</Tag><p className="mt-[6px] text-[11px] text-[#c3d6e2]">{improve}</p></div>
      <div className="g-card flex items-center gap-[10px] rounded-[15px] p-[11px]">
        <img src={SKILLS[32].src} alt="" className="h-[42px] w-[42px] object-contain" />
        <div><div className="text-[12px] font-extrabold text-white">Новость — не сигнал</div><div className="text-[10px] text-[#8fa7b8]">Рекомендуемый урок Академии</div></div>
      </div>
      <div className="flex-1" />
      <Btn full size="lg" onClick={onNext}>{page.cta}</Btn>
    </div>
  );
}

function Academy({ page, onNext, onBack }: ScreenProps) {
  const { run } = useRun();
  /* Locked is a real state of this screen, driven by progress, not a separate page. */
  const locked = run.completedRuns === 0;
  const topics = SKILLS.slice(0, 6);
  const [pickTopic, setPickTopic] = useState<string | null>(null);
  void page;
  return (
    <div className="flex h-full flex-col gap-[9px]">
      <Head over={locked ? 'академия · закрыта' : 'академия · открыта'}
        title={locked ? 'Сначала упрись в пробел' : 'Что подвело в разборе'}
        sub={locked
          ? 'Академия откроется после первого полного разбора. Теория появляется тогда, когда она нужна.'
          : 'Выбери навык, который назвал разбор. Один навык — один короткий урок.'} />
      {locked ? <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[12px]">
        <span className="grid h-[110px] w-[110px] place-items-center rounded-full border border-[#4C6180]/40 bg-[#4C6180]/15"><IcLock className="h-[42px] w-[42px] text-[#7d93a8]" /></span>
        <div className="g-inset rounded-[11px] px-[10px] py-[8px] text-center">
          <p className="text-[10.5px] leading-[1.4] text-[#b5c8d6]">Условие: пройти один полный заход и открыть разбор.</p>
        </div>
      </div>
        : <div className="grid grid-cols-2 gap-[7px]">{topics.map((sk, i) => {
          const avail = i < 3; const on = pickTopic === sk.id;
          return (
            <button key={sk.id} onClick={() => avail && setPickTopic(sk.id)} aria-disabled={!avail}
              className="press focus-ring g-card flex min-h-[68px] items-center gap-[8px] rounded-[13px] p-[8px] text-left"
              style={{ borderColor: on ? GROUP_HEX[sk.group] : undefined, opacity: avail ? 1 : .5 }}>
              <img src={sk.src} alt="" className="h-[38px] w-[38px] object-contain" />
              <span><span className="block text-[10.5px] font-extrabold text-white">{sk.name}</span>
                <span className="text-[9px] text-[#7d93a8]">{avail ? (on ? 'выбрано' : 'доступно') : 'после урока'}</span></span>
            </button>
          );
        })}</div>}
      <Btn full size="lg" onClick={locked ? onBack : onNext} tone={locked ? 'ghost' : 'teal'}
        disabled={!locked && !pickTopic}
        sub={!locked && !pickTopic ? 'выбери тему' : undefined}>
        {locked ? 'Вернуться на Арену' : 'Открыть тему'}
      </Btn>
    </div>
  );
}

function Profile({ page, onNext }: ScreenProps) {
  return <Insight page={page} v="D" onNext={onNext} />;
}

function NoAttempts({ onBack }: ScreenProps) {
  return (
    <div className="flex h-full flex-col justify-center gap-[12px] text-center">
      <span className="mx-auto grid h-[92px] w-[92px] place-items-center rounded-full border border-[#C56861]/35 bg-[#C56861]/12"><IcClock className="h-[38px] w-[38px] text-[#e08b84]" /></span>
      <Head over="0/5 попыток" title="Арена закрыта на паузу" sub="Следующая попытка через 18:42. Прогресс и запечатанные решения сохранены." />
      <div className="g-inset rounded-[11px] px-[10px] py-[8px] text-left">
        <p className="text-[10.5px] leading-[1.4] text-[#b5c8d6]">Доступно без попыток: разбор прошлых решений, Академия и профиль.</p>
      </div>
      <Btn full size="lg" onClick={onBack}>Открыть Академию</Btn>
      <Btn full size="lg" tone="ghost" onClick={onBack}>Вернуться в профиль</Btn>
    </div>
  );
}

/* Run completed: closes the loop so the player is never left without a next step. */
function Completed({ onNext }: ScreenProps) {
  const { run, set } = useRun();
  const { grade, total } = scoreRun(run);
  /* Marks the run as finished so Academy can legitimately unlock. */
  useEffect(() => {
    if (run.completedRuns === 0) set('completedRuns', 1);
  }, []);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[13px] text-center">
      <span className="grid h-[96px] w-[96px] place-items-center rounded-full"
        style={{ background: 'radial-gradient(circle at 34% 26%, #17998a, #073f3c)', boxShadow: 'inset 0 0 0 1px rgba(47,224,192,.4)' }}>
        <IcCheck className="h-[42px] w-[42px] text-white" />
      </span>
      <Head over="заход завершён" title={`Сценарий закрыт · ${grade}`}
        sub={`Процесс оценён на ${total} из 100. Решение зафиксировано и записано в журнал.`} />
      <div className="grid w-full grid-cols-2 gap-[7px]">
        <Tile k="решение" v={run.decision ? DECISION_LABEL[run.decision] : '—'} />
        <Tile k="фактов" v={String(run.rationale.length)} tone="#D0B24A" />
      </div>
      <div className="w-full">
        <Btn full size="lg" onClick={onNext}>Открыть Академию</Btn>
        <p className="mt-[6px] text-[10px] text-[#7d93a8]">Разбор назвал пробел — Академия теперь открыта.</p>
      </div>
    </div>
  );
}

/* ============================ ROUTER ============================ */
export default function Screen(p: ScreenProps) {
  switch (p.page.kind) {
    case 'welcome': return <Welcome {...p} />;
    case 'tutorial': return <Tutorial {...p} />;
    case 'hub': return <Hub {...p} />;
    case 'chart': return <ChartScreen {...p} />;
    case 'decision': return <Decision {...p} />;
    case 'seal': return <Seal {...p} />;
    case 'reveal': return <Reveal {...p} />;
    case 'score': return <Score {...p} />;
    case 'insight': return <Insight {...p} />;
    case 'leaderboard': return <Leaderboard {...p} />;
    case 'cinematic': return <Cinematic {...p} />;
    case 'evidence': return <Evidence {...p} />;
    case 'skills': return <Skills {...p} />;
    case 'session': return <Session {...p} />;
    case 'postloss': return <PostLoss {...p} />;
    case 'missions': return <Missions {...p} />;
    case 'energy': return <Energy {...p} />;
    case 'store': return <Store {...p} />;
    case 'referral': return <Referral {...p} />;
    case 'empty': case 'error': return <EmptyErr {...p} />;
    case 'toast': return <Toasts {...p} />;
    case 'sheet': return <Sheet {...p} />;
    case 'rationale': return <Rationale {...p} />;
    case 'invalidation': return <Invalidation {...p} />;
    case 'unfamiliar': return <Unfamiliar {...p} />;
    case 'debrief': return <Debrief {...p} />;
    case 'academy': return <Academy {...p} />;
    case 'profile': return <Profile {...p} />;
    case 'noattempts': return <NoAttempts {...p} />;
    case 'feedback': return <TutorialFeedback {...p} />;
    case 'completed': return <Completed {...p} />;
    default: return null;
  }
}
