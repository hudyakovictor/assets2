/* ============================================================================
   SCREENS P01 — P21 · онбординг, обучение, полный цикл раунда арены.
   Каждая страница описывает ЧТО показать (head / media / body / cta),
   а компоновка A/B/C/D решает КАК это разложить. Стиль, тексты, механика,
   данные и состояния идентичны во всех компоновках.
   ========================================================================== */
import { useEffect, useMemo, useState } from "react";
import { SCENARIOS, TUTORIAL, DECISIONS, REASONS, INVALIDATIONS } from "./content";
import { ASSETS } from "./catalog";
import { Art, Motif } from "./art";
import { CandleChart, cueOf, treatmentOf, revealClass } from "./chart";
import {
  Btn, Chip, Compose, HoldToSeal, Panel, Progress, ScreenTitle, Terminal, useDensity, type Composition, type TermTool,
} from "./frame";
import { Note, NoteStrip } from "./note";
import { Icon, IconCoin, IconStar, ArenaEmblem, EmblemCompact } from "../icons/ui";
import { SkillCard, SKILL_MAP } from "../icons/skill";
import type { GameCtx } from "./state";
import { sfx, haptic } from "./sfx";

const comp = (ctx: GameCtx): Composition => (ctx.variantId as Composition) ?? "A";

function KV({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <Panel inset className="p-2">
      <div className="micro">{k}</div>
      <div className="tabular" style={{ color: tone ?? "var(--ink)", fontWeight: 700, fontSize: "var(--type-h3)" }}>{v}</div>
    </Panel>
  );
}

function MiniStat({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="text-center">
      <div className="micro">{k}</div>
      <div className="tabular" style={{ color: tone ?? "var(--ink)", fontWeight: 700 }}>{v}</div>
    </div>
  );
}

/* ============================== P01 · SPLASH ============================== */
export function Splash({ ctx }: { ctx: GameCtx }) {
  const v = comp(ctx);
  const emblem = <ArenaEmblem size={ctx.density.compact ? 124 : 152} />;
  const word = (
    <div style={{ textAlign: v === "C" ? "left" : "center" }}>
      <div className="h1 font-arena" style={{ fontSize: "calc(var(--type-h1) * 1.45)", letterSpacing: ".06em" }}>SIGNAL ARENA</div>
      <div className="micro mt-1" style={{ color: "var(--accent)", letterSpacing: ".28em" }}>АРЕНА СВЕЧЕЙ</div>
    </div>
  );
  const note = (
    <Note tone="cream" size={v === "B" ? "l" : "m"} rotate={v === "C" ? 1.6 : -2} doodle="smile" doodleSize={30}>
      IF YOU'RE HERE JUST FOR MONEY, YOU'RE EARLY. AND THAT'S BAD.
    </Note>
  );
  const cta = (
    <>
      <Btn tone="primary" icon={<Icon name="navArena" size={22} />} onClick={() => ctx.go("p02")} style={{ width: "100%", minHeight: 58 }}>
        ВОЙТИ НА АРЕНУ
      </Btn>
      <p className="micro text-center" style={{ opacity: 0.75 }}>реконструкции исторических участков · не финансовая рекомендация</p>
    </>
  );

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-5"
      data-qa-critical="splash"
      style={{ gap: 12 }}
    >
      {v === "B" ? (
        <>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4">
            {word}
            <div className="max-w-[300px]">{note}</div>
            <div className="anim-float mt-auto">{emblem}</div>
          </div>
          <div style={{ minHeight: 64 }}>{cta}</div>
        </>
      ) : v === "C" ? (
        <>
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-4">
            <div className="flex items-end justify-between gap-2">
              {word}
              <span className="anim-float" style={{ flex: "none" }}><ArenaEmblem size={92} /></span>
            </div>
            <div className="max-w-[290px]">{note}</div>
          </div>
          <div style={{ minHeight: 64 }}>{cta}</div>
        </>
      ) : (
        <>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4">
            <div className="anim-float">{emblem}</div>
            {word}
            <div className="max-w-[290px]">{note}</div>
          </div>
          <div style={{ minHeight: 64 }}>{cta}</div>
        </>
      )}
    </div>
  );
}

/* ============================== P02 · WELCOME ============================= */
export function Welcome({ ctx }: { ctx: GameCtx }) {
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={120}
      head={<ScreenTitle kicker="ВХОД В ПРОТОКОЛ" title="ТЫ ЗДЕСЬ РАДИ ДЕНЕГ" right={<Chip tone="#C56861" solid>РИСК</Chip>} />}
      media={
        <Panel className="relative h-full overflow-hidden">
          <div className="absolute inset-0 grid place-items-center"><Art assetId={ctx.assign.hero} size={190} /></div>
          <div className="absolute inset-x-0 bottom-0 p-2"><div className="micro">ПОЭТОМУ ТЫ УЖЕ В ОПАСНОСТИ</div></div>
          <Motif spec={ASSETS[ctx.assign.cue]?.spec ?? { motif: "cue/target-ring", tint: "teal" }} size={54} className="absolute right-2 top-2 anim-breathe" />
        </Panel>
      }
      body={
        <div className="stagger flex flex-col justify-center gap-2">
          <p className="body"><b style={{ color: "var(--ink)" }}>Правило арены:</b> будущее недоступно. Доступны структура, объём и контекст.</p>
          <NoteStrip tone="teal" doodle="wave">THE SEAL IS A PROMISE TO YOURSELF.</NoteStrip>
          <div className="flex flex-wrap gap-1.5">
            <Chip icon={<Icon name="check" size={12} />}>6 уроков</Chip>
            <Chip icon={<Icon name="check" size={12} />}>6 сценариев</Chip>
            <Chip icon={<Icon name="check" size={12} />}>40 карт</Chip>
          </div>
        </div>
      }
      cta={<Btn tone="primary" onClick={() => ctx.go("p03")} style={{ width: "100%", minHeight: 56 }}>ПРИНЯТЬ ПРАВИЛА АРЕНЫ</Btn>}
    />
  );
}

/* =============================== P03 · RULES ============================== */
export function Rules({ ctx }: { ctx: GameCtx }) {
  const rows = [
    { icon: "flame", t: "РИТУАЛ", d: "5 раундов подряд. Пропуск сбрасывает серию." },
    { icon: "shield", t: "СТАВКА", d: "1% капитала. Стоп ставится до входа." },
    { icon: "seal", t: "ПЕЧАТЬ", d: "Решение фиксируется. Оценка приходит без тебя." },
  ];
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={96}
      head={<ScreenTitle kicker="ПОСЛЕДОВАТЕЛЬНОСТЬ ОБУЧЕНИЯ" title="ПРАВИЛА АРЕНЫ" right={<Art assetId={ctx.assign.ornament} size={44} />} />}
      media={
        <Panel className="relative h-full overflow-hidden">
          <div className="absolute inset-0 grid place-items-center"><Art assetId={ctx.assign.hero} size={150} /></div>
        </Panel>
      }
      body={
        <div className="stagger flex flex-col justify-center gap-1.5">
          {rows.map((r) => (
            <Panel key={r.t} className="flex items-center gap-2.5 p-2">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-xl" style={{ background: "rgba(51,193,161,.14)", border: "1px solid var(--stroke)" }}>
                <Icon name={r.icon as "flame"} size={18} />
              </span>
              <span className="min-w-0">
                <span className="h3 block">{r.t}</span>
                <span className="body block" style={{ fontSize: "var(--type-meta)" }}>{r.d}</span>
              </span>
            </Panel>
          ))}
        </div>
      }
      cta={
        <Btn tone="primary" onClick={() => { ctx.update({ tutorialStep: 0 }); ctx.go("p04"); }} style={{ width: "100%", minHeight: 56 }}>
          НАЧАТЬ ОБУЧЕНИЕ · 6 ШАГОВ
        </Btn>
      }
    />
  );
}

/* ========================== P04–P09 · TUTORIAL ============================ */
export function Tutorial({ ctx, stepIndex }: { ctx: GameCtx; stepIndex: number }) {
  const step = TUTORIAL[stepIndex];
  const fb = ctx.st.tutorialFeedback;
  const [chosen, setChosen] = useState<number | null>(null);
  useEffect(() => { setChosen(null); }, [stepIndex]);

  const cueSpec = ASSETS[ctx.assign.cue]?.spec;

  const setFb = (ok: boolean, text: string) => {
    ctx.update({ tutorialFeedback: { ok, text } });
    if (ok) { sfx.win(); haptic("success"); } else { sfx.lose(); haptic("error"); }
  };

  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={120}
      mediaMax="42%"
      interactiveMedia
      head={
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <button type="button" className="chip" onClick={() => { sfx.tick(); ctx.go(stepIndex === 0 ? "p03" : `p0${3 + stepIndex}`); }} style={{ minHeight: 30 }}>
              <Icon name="chevron" size={12} /> {stepIndex === 0 ? "ПРАВИЛА" : `ШАГ ${stepIndex}`}
            </button>
            <div className="micro" style={{ color: "var(--accent)" }}>ШАГ {step.step}/{step.total}</div>
            <div className="flex items-center gap-1">
              {TUTORIAL.map((t, i) => (
                <span key={t.id} style={{
                  width: i === stepIndex ? 18 : 7, height: 5, borderRadius: 4,
                  background: i < stepIndex ? "var(--accent)" : i === stepIndex ? "#9FE8D3" : "var(--stroke)",
                  transition: "all var(--t-med) var(--ease-out)",
                }} />
              ))}
            </div>
          </div>
          <div className="h1" style={{ fontSize: "calc(var(--type-h2) * 1.02)" }}>{step.title}</div>
        </div>
      }
      media={
        <Panel className="relative h-full overflow-hidden">
          <div className="absolute inset-0 grid place-items-center">
            <Art assetId={ctx.assign.hero} size={ctx.density.compact ? 146 : 176} />
          </div>
          {cueSpec && <div className="absolute" style={{ right: 8, bottom: 6 }}><Motif spec={cueSpec} size={50} /></div>}
          <TutorialAction step={step.visual} chosen={chosen} cueCaption={step.cue}
            onChoose={(i, ok) => { setChosen(i); setFb(ok, step.feedback); }} />
        </Panel>
      }
      body={
        <div className="flex flex-col justify-center gap-1.5">
          <p className="body" style={{ color: "var(--ink)", fontSize: "var(--type-h3)" }}>{step.idea}</p>
          {fb && (
            <div className={fb.ok ? "anim-pop" : "anim-trauma"} style={{
              borderRadius: 12, padding: "7px 9px",
              border: `1px solid ${fb.ok ? "var(--accent)" : "#C56861"}`,
              background: fb.ok ? "rgba(51,193,161,.12)" : "rgba(197,104,97,.14)",
            }}>
              <div className="micro" style={{ color: fb.ok ? "#9FE8D3" : "#FFC7C3" }}>{fb.ok ? "ОТВЕТ ПРИНЯТ" : "ПОПРОБУЙ ЕЩЁ"}</div>
              <div className="body" style={{ fontSize: "var(--type-meta)" }}>{fb.text}</div>
            </div>
          )}
        </div>
      }
      cta={
        /* ТЗ: одна основная кнопка на карточку; «назад» — чип в шапке */
        step.visual === "seal" && !(fb && fb.ok) ? (
          <HoldToSeal
            label={step.cta}
            sealArt={<EmblemCompact size={30} />}
            onSeal={() => { ctx.update({ tutorialDone: true, tutorialFeedback: { ok: true, text: "Урок закончен. Теперь ты на Арене — каждое решение печатается." } }); }}
          />
        ) : step.visual === "seal" && fb && fb.ok ? (
          <Btn tone="primary" onClick={() => { ctx.update({ tutorialStep: 0, tutorialFeedback: null }); ctx.go("p10"); }} style={{ width: "100%", minHeight: 56 }}>
            УРОК ЗАВЕРШЁН · НА АРЕНУ
          </Btn>
        ) : (
          <Btn
            tone="primary"
            disabled={!(fb && fb.ok)}
            onClick={() => {
              ctx.update({ tutorialStep: ctx.st.tutorialStep + 1, tutorialFeedback: null });
              ctx.go(`p0${4 + stepIndex + 1}`);
            }}
            style={{ width: "100%", minHeight: 56 }}
          >
            {fb && fb.ok ? (stepIndex === 4 ? "ПОСЛЕДНИЙ ШАГ · ПЕЧАТЬ" : "СЛЕДУЮЩИЙ ШАГ") : "СНАЧАЛА НАЖМИ НА РИСУНОК"}
          </Btn>
        )
      }
    />
  );
}

function TutorialAction({
  step, chosen, onChoose, cueCaption,
}: { step: string; chosen: number | null; onChoose: (i: number, ok: boolean) => void; cueCaption: string }) {
  if (step === "seal") return null;
  const options: Record<string, { label: string; ok: boolean; x: number; y: number }[]> = {
    candle: [{ label: "ТЕЛО", ok: true, x: 44, y: 54 }, { label: "ТЕНЬ", ok: false, x: 50, y: 16 }],
    trend: [{ label: "МАКСИМУМ", ok: true, x: 74, y: 24 }, { label: "ПАУЗА", ok: false, x: 30, y: 66 }],
    volume: [{ label: "ОБЪЁМ", ok: true, x: 72, y: 40 }, { label: "ТИШИНА", ok: false, x: 28, y: 64 }],
    risk: [{ label: "1%", ok: true, x: 32, y: 58 }, { label: "5%", ok: false, x: 70, y: 58 }],
    tf: [{ label: "1Д", ok: true, x: 60, y: 58 }, { label: "15М", ok: false, x: 26, y: 28 }],
  };
  const list = options[step] ?? [];
  return (
    <div className="absolute inset-0">
      <div className="absolute left-2 top-2 micro" style={{ color: "#CFE4FF" }}>{cueCaption}</div>
      {list.map((o, i) => (
        <button
          key={o.label}
          type="button"
          onClick={() => onChoose(i, o.ok)}
          className={`tap-target ${chosen === i ? (o.ok ? "anim-pop" : "anim-trauma") : ""} ${chosen === null ? "is-hot" : ""}`}
          style={{
            position: "absolute", left: `${o.x}%`, top: `${o.y}%`, transform: "translate(-50%,-50%)",
            minWidth: 48, minHeight: 46, padding: "4px 10px", borderRadius: 12,
            border: `1.6px ${chosen === i && o.ok ? "solid" : "dashed"} ${chosen === null ? "rgba(234,243,255,.8)" : o.ok ? "var(--accent)" : "#C56861"}`,
            background: chosen === i ? (o.ok ? "rgba(51,193,161,.22)" : "rgba(197,104,97,.22)") : "rgba(8,17,31,.72)",
            color: "#EAF3FF", fontSize: "var(--type-micro)", fontWeight: 800, letterSpacing: ".08em",
          }}
        >
          {o.label}
          {chosen === null && <span className="pulse-ring absolute inset-0" style={{ borderRadius: 12, border: "1.6px solid var(--accent)" }} />}
        </button>
      ))}
    </div>
  );
}

/* ============================== P10 · ARENA =============================== */
/* Главный экран — 1:1 по референсу: терминал с вкладками → ряд из 4 skill-плашек
   → 2×2 действия. Компоновка меняет только положение терминала и плашек. */
export function ArenaHub({ ctx }: { ctx: GameCtx }) {
  const list = SCENARIOS;
  const idx = Math.min(ctx.st.history.length, list.length - 1);
  const s = list[idx];
  const [tool, setTool] = useState<TermTool>("candles");
  const v = comp(ctx);

  /* колода открывается по одной механике за заход (MVP: три захода — три механики) */
  const unlocked = Math.min(4, 1 + ctx.st.history.length);
  const skills = (
    <div className="card-row">
      {[["c01", "ТРЕНД"], ["c03", "ОБЪЁМ"], ["c27", "РИСК"], ["c17", "ЖДАТЬ"]].map(([id, label], i) => (
        <SkillCard key={id} id={id} compact label={label} showCornerStar={id === "c03" && i < unlocked}
          locked={i >= unlocked}
          picked={ctx.st.picked.includes(id)} onClick={() => { if (i < unlocked) { sfx.pick(); haptic("light"); ctx.toggleCard(id); } }} />
      ))}
    </div>
  );

  /* MVP: решение принимается только после фактов (P11–P14). На хабе — превью раунда и вход. */
  const attemptsLeft = ctx.st.energy;
  const first = ctx.st.history.length === 0;
  const actions = ctx.st.noAttempts || attemptsLeft <= 0 ? (
    /* STATE: NO ATTEMPTS */
    <Panel className="flex flex-col gap-1.5 p-2.5" style={{ borderColor: "#C56861" }}>
      <div className="h3">ПОПЫТКИ ЗАКОНЧИЛИСЬ</div>
      <p className="body" style={{ fontSize: "var(--type-meta)" }}>Паника бесплатна. Вход — нет. Новая попытка через 20 минут или после урока в Академии.</p>
      <div className="flex gap-2">
        <Btn tone="ghost" onClick={() => ctx.go("p28")} style={{ flex: 1, minHeight: 48 }}>В АКАДЕМИЮ</Btn>
        <Btn tone="primary" onClick={() => { ctx.update({ energy: ctx.st.energyMax, noAttempts: false }); }} style={{ flex: 1, minHeight: 48 }}>ВОССТАНОВИТЬ (ДЕМО)</Btn>
      </div>
    </Panel>
  ) : (
    <div className="flex flex-col gap-2">
      <Panel inset className="flex items-center gap-2 p-2">
        <Chip tone={s.difficulty === 3 ? "#C56861" : s.difficulty === 2 ? "#D0B24A" : "#2E7F5C"} solid>{first ? "ПЕРВЫЙ ЗАХОД" : `РАУНД ${idx + 1}`}</Chip>
        <span className="h3 min-w-0 flex-1 truncate" style={{ textTransform: "none" }}>{s.pair} · {s.tf}</span>
        <span className="micro">ПОПЫТОК {attemptsLeft}/{ctx.st.energyMax}</span>
      </Panel>
      <Btn tone="primary" icon={<Icon name="play" size={20} />} onClick={() => ctx.startRound(idx)} style={{ width: "100%", minHeight: 58 }}>
        {first ? "НАЧАТЬ · Я НИЧЕГО НЕ ЗНАЮ" : "СМОТРЕТЬ ФАКТЫ"}
      </Btn>
    </div>
  );

  const terminal = (
    <Terminal active={tool} onTool={setTool}>
      {tool === "candles" || tool === "depth" ? (
        <CandleChart series={ctx.series} treatment={tool === "depth" ? "depth" : "glow"} cue="ring"
          revealedCount={0} sealed={false} compact symbol={s.pair} tf={s.tf} />
      ) : (
        <div className="scroll-y flex min-h-0 flex-1 flex-col gap-1.5 p-2">
          {s.feed.filter((f) => tool === "news" || (tool === "whale" ? f.kind === "whale" : tool === "calendar" ? f.kind === "fund" : f.kind === "noise" || f.kind === "panic")).map((f) => (
            <Panel key={f.title} inset className="flex items-center gap-2 p-2">
              <span style={{ flex: "none", width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", background: TAG_TONE[f.kind], border: "2px solid rgba(255,255,255,.55)" }}>
                <Icon name={f.kind === "panic" ? "flame" : f.kind === "whale" ? "whale" : f.kind === "fund" ? "news" : "wave"} size={17} />
              </span>
              <span className="min-w-0 flex-1 h3" style={{ fontSize: "var(--type-meta)", lineHeight: 1.15 }}>{f.title} <span className="micro" style={{ fontWeight: 600 }}>{f.time}</span></span>
              <Chip tone={TAG_TONE[f.kind]} solid>{f.tag}</Chip>
            </Panel>
          ))}
        </div>
      )}
    </Terminal>
  );

  return (
    <Compose
      composition={v}
      mediaMin={168}
      interactiveMedia
      head={undefined}
      media={terminal}
      body={
        <>
          {skills}
          {actions}
        </>
      }
    />
  );
}

/* ============================= P11 · BRIEFING ============================= */
export function Briefing({ ctx }: { ctx: GameCtx }) {
  const s = SCENARIOS[ctx.st.scenarioIndex];
  return (
    <Compose
      composition={comp(ctx)}
      head={<ScreenTitle kicker={`${s.tone} · РАУНД ${s.round}`} title={`${s.asset} / ${s.tf}`} right={<Art assetId={ctx.assign.ornament} size={44} />} />}
      media={
        <CandleChart series={ctx.series} treatment={treatmentOf(ctx.assign.chart)} cue={cueOf(ctx.assign.cue)}
          revealedCount={0} sealed={false} compact symbol={s.pair} tf={s.tf} />
      }
      body={
        <div className="stagger flex flex-col gap-1.5">
          <p className="h3" style={{ textTransform: "none" }}>{s.headline}</p>
          <p className="body">{s.brief}</p>
          <div className="grid grid-cols-2 gap-1.5">
            <KV k="ЛИМИТ РИСКА" v={`${s.risk.toFixed(1)}%`} tone="#E98680" />
            <KV k="ОЖИД. ДВИЖЕНИЕ" v={`${s.movePct > 0 ? "+" : ""}${s.movePct}%`} tone="var(--accent)" />
          </div>
        </div>
      }
      cta={<Btn tone="primary" icon={<Icon name="news" size={18} />} onClick={() => ctx.go("p12")} style={{ width: "100%", minHeight: 56 }}>ОТКРЫТЬ ЛЕНТУ РАЗВЕДКИ</Btn>}
    />
  );
}

/* ============================== P12 · FEED =============================== */
const TAG_TONE: Record<string, string> = { panic: "#C56861", whale: "#7C6CD9", fund: "#D0B24A", noise: "#2E7F5C" };

export function Feed({ ctx }: { ctx: GameCtx }) {
  const s = SCENARIOS[ctx.st.scenarioIndex];
  const [tapped, setTapped] = useState<number | null>(null);
  const [tool, setTool] = useState<TermTool>("news");
  const rows = s.feed.map((f, i) => {
    const tone = TAG_TONE[f.kind];
    return (
      <Panel key={f.title} inset className="flex items-center gap-2 p-2"
        style={{ borderColor: tapped === i ? tone : undefined, boxShadow: tapped === i ? `0 0 0 3px ${tone}55` : undefined }}
        onClick={() => { sfx.tick(); setTapped(i); }}>
        <span style={{ flex: "none", width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", background: tone, border: "2px solid rgba(255,255,255,.55)" }}>
          <Icon name={f.kind === "panic" ? "flame" : f.kind === "whale" ? "whale" : f.kind === "fund" ? "news" : "wave"} size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="h3 block" style={{ fontSize: "var(--type-meta)", lineHeight: 1.15 }}>{f.title} <span className="micro" style={{ fontWeight: 600 }}>{f.time}</span></span>
        </span>
        <Chip tone={tone} solid>{f.tag}</Chip>
      </Panel>
    );
  });
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={220}
      head={<ScreenTitle kicker="ЛЕНТА РАЗВЕДКИ · 4 ИСТОЧНИКА" title="ЧТО ГОВОРЯТ ЛЕНТЫ" />}
      media={
        <Terminal active={tool} onTool={setTool}>
          {tool === "candles" || tool === "depth" ? (
            <CandleChart series={ctx.series} treatment={tool === "depth" ? "depth" : treatmentOf(ctx.assign.chart)} cue={cueOf(ctx.assign.cue)}
              revealedCount={0} sealed={false} compact symbol={s.pair} tf={s.tf} />
          ) : (
            <div className="scroll-y flex min-h-0 flex-1 flex-col gap-1.5 p-2">{rows}</div>
          )}
        </Terminal>
      }
      body={
        <div className="flex items-center gap-2">
          <Icon name="info" size={16} />
          <span className="body" style={{ fontSize: "var(--type-meta)" }}>Ленты объясняют, почему кто-то плачет. Торгует график.</span>
        </div>
      }
      cta={<Btn tone="primary" icon={<Icon name="chartLine" size={18} />} onClick={() => ctx.go("p13")} style={{ width: "100%", minHeight: 56 }}>К ГРАФИКУ · ДО t0</Btn>}
    />
  );
}

/* ============================= P13 · CHART ================================ */
export function ChartStage({ ctx }: { ctx: GameCtx }) {
  const s = SCENARIOS[ctx.st.scenarioIndex];
  const [tool, setTool] = useState<TermTool>("candles");
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={196}
      interactiveMedia
      head={
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="micro" style={{ color: "var(--accent)" }}>ГРАФИК ЗАКАНЧИВАЕТСЯ В t0</div>
            <div className="h2">{s.pair}</div>
          </div>
          <Chip tone="#4C6180" solid>{s.tf}</Chip>
        </div>
      }
      media={
        <Terminal active={tool} onTool={setTool} tap>
          {tool === "candles" || tool === "depth" ? (
            <CandleChart
              series={ctx.series} treatment={tool === "depth" ? "depth" : treatmentOf(ctx.assign.chart)} cue={cueOf(ctx.assign.cue)}
              revealedCount={0} sealed={false} onPick={ctx.pickZone} pickState={ctx.st.pickState}
              showPointer={!ctx.st.zonePicked} caption="НАЖМИ НА ЗОНУ ПАДЕНИЯ" symbol={s.pair} tf={s.tf}
            />
          ) : (
            <div className="scroll-y flex min-h-0 flex-1 flex-col gap-1.5 p-2">
              {s.feed.filter((f) => tool === "news" || (tool === "whale" ? f.kind === "whale" : tool === "calendar" ? f.kind === "fund" : f.kind === "noise" || f.kind === "panic")).map((f) => (
                <Panel key={f.title} inset className="flex items-center gap-2 p-2">
                  <span className="min-w-0 flex-1">
                    <span className="h3 block" style={{ fontSize: "var(--type-meta)" }}>{f.title}</span>
                    <span className="micro">{f.time}</span>
                  </span>
                  <Chip tone={TAG_TONE[f.kind]} solid>{f.tag}</Chip>
                </Panel>
              ))}
            </div>
          )}
        </Terminal>
      }
      body={
        <div className="flex items-center gap-2">
          <Icon name={ctx.st.pickState === "hit" ? "check" : ctx.st.pickState === "miss" ? "cross" : "hand"} size={18} />
          <span className="body" style={{ fontSize: "var(--type-meta)", color: ctx.st.pickState === "miss" ? "#FFC7C3" : undefined }}>
            {ctx.st.pickState === "hit"
              ? "Цель найдена: свеча закрылась в зоне, объём выше среднего."
              : ctx.st.pickState === "miss"
                ? "Мимо. Цель — нижняя зона, где стоит чужая ликвидность."
                : "Будущее закрыто до Печати. Отметь зону, где рынок заберёт ликвидность."}
          </span>
        </div>
      }
      cta={
        <div className="flex gap-2">
          <Btn tone="ghost" onClick={() => ctx.go("p12")} style={{ flex: "0 0 84px", minHeight: 56 }}>ЛЕНТА</Btn>
          <Btn tone="primary" disabled={!ctx.st.zonePicked} onClick={() => ctx.go("p14")} style={{ flex: 1, minHeight: 56 }}>
            {ctx.st.zonePicked ? "СОБРАТЬ СИГНАЛЫ" : ctx.st.pickState === "miss" ? "ЗОНА ПОДСВЕЧЕНА · НАЖМИ ЕЁ" : "СНАЧАЛА ОТМЕТЬ ЗОНУ ПАДЕНИЯ"}
          </Btn>
        </div>
      }
    />
  );
}

/* ============================== P14 · HAND ================================ */
export function Hand({ ctx }: { ctx: GameCtx }) {
  const s = SCENARIOS[ctx.st.scenarioIndex];
  const picked = ctx.st.picked;
  return (
    <Compose
      composition={comp(ctx) === "B" ? "A" : comp(ctx)}
      head={
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="micro" style={{ color: "var(--accent)" }}>НАБОР СИГНАЛОВ · ДО 2</div>
            <div className="h2">КАРТЫ РАУНДА</div>
          </div>
          <Chip tone="var(--accent)" solid>{picked.length}/2</Chip>
        </div>
      }
      body={
        <>
          {/* 3×2, карточки фиксированной пропорции; на низких экранах — прокрутка списка, а не сжатие */}
          <div className="grid grid-cols-3 gap-2" style={{ gridAutoRows: "var(--card-row-h)" }}>
            {s.hand.map((id) => (
              <SkillCard key={id} id={id} picked={picked.includes(id)} compact
                onClick={() => { sfx.pick(); haptic("light"); ctx.toggleCard(id); }} />
            ))}
          </div>
          <Panel inset className="p-2">
            <span className="micro" style={{ color: "var(--accent)" }}>
              {picked.length ? picked.map((p) => SKILL_MAP[p].en.toUpperCase()).join(" + ") : "КАРТЫ НЕ ВЫБРАНЫ"}
            </span>
          </Panel>
        </>
      }
      cta={<Btn tone="primary" disabled={picked.length === 0} onClick={() => ctx.go("p15")} style={{ width: "100%", minHeight: 56 }}>К РЕШЕНИЮ</Btn>}
    />
  );
}

/* ============================ P15 · DECISION ============================== */
/* MVP: решение → обязательное обоснование → инвалидация (для входа). WAIT и NO_TRADE — равноправны. */
export function Decision({ ctx }: { ctx: GameCtx }) {
  const s = SCENARIOS[ctx.st.scenarioIndex];
  const chosen = ctx.st.decision;
  const needsInv = chosen === "enter" || chosen === "sizeUp";
  const ready = !!chosen && ctx.st.reasons.length > 0 && (!needsInv || !!ctx.st.invalidation);
  const toneOf = (id: string) => id === "enter" ? "green" : id === "retest" ? "primary" : id === "higherTF" ? "blue" : id === "sizeUp" ? "red" : "ghost";
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={90}
      head={
        <div className="flex items-center justify-between gap-2">
          <div className="micro" style={{ color: "var(--accent)" }}>РЕШЕНИЕ · ОБОСНОВАНИЕ · ИНВАЛИДАЦИЯ</div>
          <Chip icon={<Icon name="clockLock" size={12} />}>РИСК {s.risk.toFixed(1)}%</Chip>
        </div>
      }
      media={
        <CandleChart series={ctx.series} treatment={treatmentOf(ctx.assign.chart)} cue={cueOf(ctx.assign.cue)}
          revealedCount={0} sealed={false} compact symbol={s.pair} tf={s.tf} />
      }
      body={
        <div className="scroll-y flex min-h-0 flex-col gap-2 pr-1">
          <div className="micro">1 · ЧТО ДЕЛАЕШЬ</div>
          <div className="grid grid-cols-2 gap-2">
            {DECISIONS.filter((d) => d.id !== "noTrade").map((d) => (
              <Btn key={d.id} tone={toneOf(d.id) as "green"} selected={chosen === d.id}
                icon={<span className="grid h-8 w-8 flex-none place-items-center rounded-full" style={{ background: "rgba(255,255,255,.16)", border: "2px solid rgba(255,255,255,.9)" }}><Icon name={d.icon as "enter"} size={17} /></span>}
                onClick={() => { ctx.choose(d.id); haptic("medium"); }} className="!items-center !justify-start !text-left" style={{ minHeight: 54 }}>
                {d.ru}
              </Btn>
            ))}
          </div>
          <Btn tone="ghost" selected={chosen === "noTrade"} icon={<Icon name="skip" size={18} />}
            onClick={() => { ctx.choose("noTrade"); haptic("medium"); }} style={{ minHeight: 48, justifyContent: "flex-start" }}>
            НЕ ТОРГОВАТЬ — тоже решение
          </Btn>

          <div className="micro mt-1">2 · ПОЧЕМУ (минимум одно)</div>
          <div className="flex flex-wrap gap-1.5">
            {REASONS.map((r) => {
              const on = ctx.st.reasons.includes(r.id);
              return (
                <button key={r.id} type="button" className="chip" onClick={() => ctx.toggleReason(r.id)}
                  style={{ minHeight: 36, ...(on ? { background: "linear-gradient(180deg,#46d3b1,var(--accent-deep))", color: "#fff", borderColor: "rgba(255,255,255,.6)" } : {}) }}>
                  {on && <Icon name="check" size={12} />}{r.ru}
                </button>
              );
            })}
          </div>

          {needsInv && (
            <>
              <div className="micro mt-1">3 · ГДЕ СЦЕНАРИЙ МЁРТВ (обязательно для входа)</div>
              <div className="flex flex-wrap gap-1.5">
                {INVALIDATIONS.map((iv) => {
                  const on = ctx.st.invalidation === iv.id;
                  return (
                    <button key={iv.id} type="button" className="chip" onClick={() => ctx.setInvalidation(on ? null : iv.id)}
                      style={{ minHeight: 36, ...(on ? { background: "#C56861", color: "#fff", borderColor: "rgba(255,255,255,.6)" } : {}) }}>
                      {on && <Icon name="check" size={12} />}{iv.ru}
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {ctx.st.unknownTopic && (
            <Panel inset className="p-2"><span className="micro" style={{ color: "#9FE8D3" }}>НЕЗНАКОМАЯ ТЕМА НЕ ШТРАФУЕТСЯ · оценивается честность процесса</span></Panel>
          )}
        </div>
      }
      cta={
        <Btn tone="primary" disabled={!ready} onClick={() => ctx.go("p16")} style={{ width: "100%", minHeight: 56 }}>
          {!chosen ? "ВЫБЕРИ РЕШЕНИЕ" : ctx.st.reasons.length === 0 ? "ДОБАВЬ ОБОСНОВАНИЕ" : needsInv && !ctx.st.invalidation ? "УКАЖИ ИНВАЛИДАЦИЮ" : "К ПЕЧАТИ РЕШЕНИЯ"}
        </Btn>
      }
    />
  );
}

/* ============================== P16 · SEAL ================================ */
export function Seal({ ctx }: { ctx: GameCtx }) {
  const s = SCENARIOS[ctx.st.scenarioIndex];
  const d = DECISIONS.find((x) => x.id === ctx.st.decision);
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={120}
      head={<ScreenTitle kicker="ФИКСАЦИЯ РЕШЕНИЯ" title="ПЕЧАТЬ" right={<Chip icon={<Icon name="lock" size={12} />}>ЗАКРЫТО</Chip>} />}
      media={
        <Panel className="relative h-full overflow-hidden">
          <div className="absolute inset-0 grid place-items-center anim-breathe"><Art assetId={ctx.assign.ornament} size={132} /></div>
        </Panel>
      }
      body={
        <div className="flex flex-col items-center gap-1.5">
          <div className="h3" style={{ textTransform: "none" }}>{d?.ru}</div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {ctx.st.picked.map((p) => <Chip key={p}>{SKILL_MAP[p].ru}</Chip>)}
          </div>
          <Panel inset className="grid w-full grid-cols-3 gap-1.5 p-2">
            <MiniStat k="РАУНД" v={String(s.round)} />
            <MiniStat k="ЛИМИТ" v={`${s.risk.toFixed(1)}%`} tone="#E98680" />
            <MiniStat k="ЦЕЛЬ" v="2R" tone="var(--accent)" />
          </Panel>
        </div>
      }
      cta={<HoldToSeal label="УДЕРЖИВАЙ ПЕЧАТЬ" sealArt={<EmblemCompact size={30} />} onSeal={() => { haptic("heavy"); ctx.seal(); }} />}
    />
  );
}

/* ============================ P17 · REVEAL =============================== */
export function Reveal({ ctx }: { ctx: GameCtx }) {
  const s = SCENARIOS[ctx.st.scenarioIndex];
  const done = ctx.st.revealed >= ctx.series.post.length;
  useEffect(() => {
    /* ТЗ: после Seal — fast-forward → дорисовка → событие. Переход к событию автоматический. */
    if (done && !ctx.st.scrubbing) {
      const id = setTimeout(() => { ctx.update({ showEvent: true }); ctx.go("p18"); }, 900);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [done, ctx.st.scrubbing]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={168}
      interactiveMedia
      head={
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="micro" style={{ color: "var(--accent)" }}>ПЕЧАТЬ ПОСТАВЛЕНА · РАЗВЁРТКА</div>
            <div className="h2">{s.tf} → ×120 ВРЕМЯ</div>
          </div>
          <Chip tone="#D0B24A" solid>{Math.round((ctx.st.revealed / ctx.series.post.length) * 100)}%</Chip>
        </div>
      }
      media={
        <div className={`h-full ${revealClass(ctx.assign.reveal)}`}>
          <CandleChart series={ctx.series} treatment={treatmentOf(ctx.assign.chart)} cue={cueOf(ctx.assign.cue)}
            revealedCount={ctx.st.revealed} sealed scrubbing={ctx.st.scrubbing} symbol={s.pair} tf={s.tf} />
        </div>
      }
      body={
        <Panel inset className="p-2">
          <Progress value={ctx.st.revealed / ctx.series.post.length} right={`${ctx.st.revealed}/${ctx.series.post.length}`} label="ДОРИСОВАНО СВЕЧЕЙ" />
        </Panel>
      }
      cta={
        <Btn tone={done ? "primary" : "ghost"} icon={<Icon name={done ? "spark" : "scrub"} size={18} />}
          disabled={done}
          onClick={() => ctx.update({ revealed: ctx.series.post.length, scrubbing: false })}
          style={{ width: "100%", minHeight: 56 }}>
          {done ? "ИСТОРИЯ ДОРИСОВАНА · СОБЫТИЕ…" : "ПРОПУСТИТЬ РАЗВЁРТКУ"}
        </Btn>
      }
    />
  );
}

/* ============================= P18 · EVENT ================================ */
export function Event({ ctx }: { ctx: GameCtx }) {
  const s = SCENARIOS[ctx.st.scenarioIndex];
  const correct = ctx.st.decision === s.correct;
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={150}
      interactiveMedia
      head={
        <div className="flex items-center justify-between gap-2">
          <div className="micro" style={{ color: correct ? "#9FE8D3" : "#FFC7C3" }}>КЛЮЧЕВОЕ СОБЫТИЕ · {s.key.tag}</div>
          <span className="anim-pop"><Art assetId={ctx.assign.event} size={40} /></span>
        </div>
      }
      media={
        <CandleChart series={ctx.series} treatment={treatmentOf(ctx.assign.chart)} cue={cueOf(ctx.assign.cue)}
          revealedCount={ctx.series.post.length} sealed eventIndex={1} symbol={s.pair} tf={s.tf} />
      }
      body={
        <Panel className={`p-2.5 ${correct ? "anim-pop" : "anim-trauma"}`} style={{ borderColor: correct ? "var(--accent)" : "#C56861" }}>
          <div className="h2" style={{ fontSize: "var(--type-h2)" }}>{s.key.title}</div>
          <p className="body mt-1" style={{ fontSize: "var(--type-meta)" }}>{s.key.line}</p>
        </Panel>
      }
      cta={<Btn tone="primary" icon={<Icon name="doc" size={18} />} onClick={() => ctx.go("p20")} style={{ width: "100%", minHeight: 56 }}>ОЦЕНКА ПРОЦЕССА</Btn>}
    />
  );
}

/* ============================= P19 · DEBRIEF ============================== */
export function Debrief({ ctx }: { ctx: GameCtx }) {
  const s = SCENARIOS[ctx.st.scenarioIndex];
  const correct = ctx.st.decision === s.correct;
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={96}
      head={
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="micro" style={{ color: "var(--accent)" }}>РАЗБОР</div>
            <div className="h2">{correct ? "РЕШЕНИЕ ПРИНЯТО" : "РЫНОК ПРИНЯЛ РИСК"}</div>
          </div>
          <Chip tone={correct ? "#2E7F5C" : "#C56861"} solid>{correct ? "ВЕРНО" : "ОШИБКА"}</Chip>
        </div>
      }
      media={
        <CandleChart series={ctx.series} treatment={treatmentOf(ctx.assign.chart)} cue={cueOf(ctx.assign.cue)}
          revealedCount={ctx.series.post.length} sealed compact symbol={s.pair} tf={s.tf} />
      }
      body={
        <div className="scroll-y flex min-h-0 flex-col gap-1.5">
          <Panel inset className="p-2.5">
            <p className="body" style={{ color: "var(--ink)", fontSize: "var(--type-meta)" }}>{correct ? s.debrief.win : s.debrief.lose}</p>
          </Panel>
          <Panel inset className="p-2.5" style={{ borderColor: "var(--accent)" }}>
            <div className="micro" style={{ color: "#9FE8D3" }}>НАВЫК РАУНДА</div>
            <p className="body" style={{ fontSize: "var(--type-meta)" }}>{s.debrief.lesson}</p>
          </Panel>
          <div className="flex flex-wrap gap-1.5">
            {ctx.st.score.matched.map((m) => <Chip key={m} tone="#2E7F5C" solid>{SKILL_MAP[m].ru}</Chip>)}
            {ctx.st.score.missed.map((m) => <Chip key={m} tone="#C56861" solid>{SKILL_MAP[m].ru}</Chip>)}
          </div>
          <Note tone="chalk" doodle={correct ? "smile" : "smile-wink"} doodleSize={22} rotate={1.2} size="s">
            {correct ? "THE SYSTEM ACCEPTED IT. DON'T GET USED TO IT." : "THE MARKET ACCEPTS EVERY DECISION. ESPECIALLY BAD ONES."}
          </Note>
        </div>
      }
      cta={<Btn tone="primary" onClick={() => ctx.go("p21")} style={{ width: "100%", minHeight: 56 }}>ЗАБРАТЬ НАГРАДУ</Btn>}
    />
  );
}

/* ============================== P20 · SCORE =============================== */
export function Score({ ctx }: { ctx: GameCtx }) {
  const s = SCENARIOS[ctx.st.scenarioIndex];
  const sc = ctx.st.score;
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={104}
      head={
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="micro" style={{ color: "var(--accent)" }}>ОЦЕНКА РАУНДА {s.round}</div>
            <div className="h2">{sc.correct ? "СЕРИЯ ПРОДОЛЖАЕТСЯ" : "СЕРИЯ ЗАМЕТИЛА ТЕБЯ"}</div>
          </div>
          <span className="anim-pop"><Art assetId={ctx.assign.ornament} size={42} /></span>
        </div>
      }
      media={
        <Panel className="flex h-full items-center justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < sc.stars ? "anim-pop" : ""}
              style={{ opacity: i < sc.stars ? 1 : 0.26, animationDelay: `${i * 120}ms`, filter: i < sc.stars ? "none" : "grayscale(1)" }}>
              <IconStar size={i === 1 ? 44 : 36} />
            </span>
          ))}
        </Panel>
      }
      body={
        <div className="scroll-y flex min-h-0 flex-col gap-1.5 pr-1">
          {/* MVP: оценка ПРОЦЕССА — четыре шкалы, результат отдельно */}
          <Panel inset className="flex flex-col gap-1 p-2">
            <div className="micro" style={{ color: "var(--accent)" }}>ОЦЕНКА ПРОЦЕССА</div>
            {[["ФАКТЫ ДО РЕШЕНИЯ", sc.process.facts], ["ОБОСНОВАНИЕ", sc.process.reasoning], ["РИСК И ИНВАЛИДАЦИЯ", sc.process.risk], ["ДИСЦИПЛИНА", sc.process.discipline]].map(([k, v]) => (
              <div key={k as string} className="flex items-center gap-2">
                <span className="micro" style={{ width: 118 }}>{k as string}</span>
                <div className="meter" style={{ flex: 1, height: 9 }}><span style={{ width: `${(v as number) * 100}%` }} /></div>
                <span className="micro tabular" style={{ width: 30, textAlign: "right", color: "#EAF3FF" }}>{Math.round((v as number) * 100)}</span>
              </div>
            ))}
          </Panel>
          <div className="grid grid-cols-2 gap-1.5">
            <KV k="ОПЫТ" v={`+${sc.xp}`} tone="var(--accent)" />
            <KV k="МОНЕТЫ" v={`+${sc.coins}`} tone="#FFE9A8" />
          </div>
          <Panel inset className="flex items-center justify-between gap-2 p-2">
            <span className="body" style={{ fontSize: "var(--type-meta)" }}>ТЫ: <b style={{ color: "var(--ink)" }}>{DECISIONS.find((d) => d.id === ctx.st.decision)?.ru}</b></span>
            <Icon name="chevron" size={14} />
            <span className="body" style={{ fontSize: "var(--type-meta)" }}>ИСТОРИЯ: <b style={{ color: "#9FE8D3" }}>{DECISIONS.find((d) => d.id === s.correct)?.ru}</b></span>
          </Panel>
          {ctx.st.unknownTopic && <Panel inset className="p-2"><span className="micro" style={{ color: "#9FE8D3" }}>НЕЗНАКОМАЯ ТЕМА · штраф не применён</span></Panel>}
          <Note tone={sc.correct ? "teal" : "ember"} doodle={sc.correct ? "smile" : "smile-wink"} doodleSize={24} rotate={sc.correct ? -1.6 : 1.8} size="s">
            {sc.correct ? "PROFIT LOCKED. DON'T GET USED TO IT." : "YOU BOUGHT AN ASSET. IT WAS THE WRONG ONE."}
          </Note>
        </div>
      }
      cta={<Btn tone="primary" onClick={() => ctx.go("p19")} style={{ width: "100%", minHeight: 56 }}>РАЗБОР · ПОЧЕМУ ТАК</Btn>}
    />
  );
}

/* ============================= P21 · REWARD =============================== */
export function Reward({ ctx }: { ctx: GameCtx }) {
  const s = SCENARIOS[ctx.st.scenarioIndex];
  const unlockedId = s.cards[ctx.st.history.length % s.cards.length];
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={128}
      head={<ScreenTitle kicker="НАГРАДА РАУНДА" title="ХРАНИЛИЩЕ ОТКРЫТО" right={<Chip icon={<Icon name="flame" size={12} />}>{ctx.st.streak}</Chip>} />}
      media={
        <Panel className="relative h-full overflow-hidden">
          <div className="absolute inset-0 grid place-items-center anim-float"><Art assetId={ctx.assign.ornament} size={150} /></div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 pb-2">
            <span className="tabular flex items-center gap-1" style={{ fontSize: "var(--type-h2)", fontWeight: 700, color: "#FFE9A8" }}>
              <IconCoin size={22} />+{ctx.st.score.coins}
            </span>
            <span className="tabular" style={{ fontSize: "var(--type-h2)", fontWeight: 700, color: "var(--accent)" }}>+{ctx.st.score.xp} XP</span>
          </div>
        </Panel>
      }
      body={
        <div className="flex items-center gap-2.5">
          <div style={{ width: 84, flex: "none" }}><SkillCard id={unlockedId} showCornerStar compact /></div>
          <div className="min-w-0">
            <div className="micro" style={{ color: "var(--accent)" }}>ОТКРЫТА КАРТА СИГНАЛА</div>
            <div className="h3" style={{ textTransform: "none" }}>{SKILL_MAP[unlockedId].en}</div>
            <p className="body" style={{ fontSize: "var(--type-meta)" }}>{SKILL_MAP[unlockedId].hint}</p>
          </div>
        </div>
      }
      cta={
        <div className="flex gap-2">
          <Btn tone="ghost" onClick={() => ctx.go("p22")} style={{ flex: "0 0 104px", minHeight: 56 }}>КОЛЛЕКЦИЯ</Btn>
          <Btn tone="primary" onClick={() => ctx.go("p10")} style={{ flex: 1, minHeight: 56 }}>СЛЕДУЮЩИЙ РАУНД</Btn>
        </div>
      }
    />
  );
}

/* ---------------- density binding for the preview stage ------------------- */
export function StageDensity({ refEl, zoom }: { refEl: React.RefObject<HTMLDivElement | null>; zoom: number }) {
  const [h, setH] = useState(844);
  useEffect(() => {
    const el = refEl.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.getBoundingClientRect().height / (zoom || 1)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [refEl, zoom]);
  useDensity(refEl, h);
  return useMemo(() => ({ compact: h <= 640, tiny: h <= 580 }), [h]);
}
