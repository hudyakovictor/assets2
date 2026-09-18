import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Chart from "../components/Chart";
import { CTA, Chip, OptionRow, Panel, ScoreLine, SkillCardTile, Steps, shade } from "../components/ui";
import { Burst, SealStamp } from "../components/fx";
import { SkillIcon, IconSpeech, IconStar, IconTarget } from "../components/icons";
import { scenarioOf, evaluate, VERDICT } from "../data/scenarios";
import { CHAPTER_1_CARDS, GROUP_COLOR, byId } from "../data/skills";
import { useGame } from "../game/store";
import { useFrameMetrics } from "../game/ui";
import type { VariantTreatment } from "../data/pages";

export interface SP { v: VariantTreatment; next: () => void; props?: Record<string, unknown> }

export const Body = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative flex min-h-0 flex-1 flex-col px-4 ${className}`}>{children}</div>
);
export const Foot = ({ children }: { children: React.ReactNode }) => (
  <div className="relative z-10 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">{children}</div>
);

const RUN1_STEPS = 6; // узнать → факт → решение → почему → фиксация → открытие
/* runs 2+: источники → решение → почему → открытие */
const stepOf = (run: number, k: "decision" | "why" | "seal" | "reveal") =>
  run === 1 ? { decision: 3, why: 4, seal: 5, reveal: 6 }[k] : { decision: 2, why: 3, seal: 3, reveal: 4 }[k];
const totalOf = (run: number) => (run === 1 ? RUN1_STEPS : 4);

/* ===== Кадр 1 · Первый экран ===== */
export function F01Welcome({ v, next }: SP) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-end px-6 pb-[max(22px,env(safe-area-inset-bottom))] text-center">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="mb-auto mt-[18%]">
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-[26px]" style={{ background: `linear-gradient(145deg, ${v.accent}, ${shade(v.accent, -25)})`, boxShadow: `0 24px 60px -18px ${v.accent}` }}>
          <svg viewBox="0 0 48 48" className="h-11 w-11"><path d="M8 34l8-12 6 6 8-16 6 10" fill="none" stroke="#06231f" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.div>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }} className="text-[30px] font-black leading-[1.08] tracking-tight text-white text-balance">
        Посмотрите на график<br />и скажите, что будет дальше
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-3 text-[14px] text-[var(--ink-dim)]">Без регистрации. Минута времени.</motion.p>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-8 w-full max-w-[320px]">
        <CTA big accent={v.accent} onClick={next}>Попробовать</CTA>
      </motion.div>
    </div>
  );
}

/* ===== Кадр 2 · Узнавание: ткните, где цена падала ===== */
export function F02Recognize({ v, next }: SP) {
  const { state, dispatch } = useGame();
  const { chartH } = useFrameMetrics();
  const sc = scenarioOf(1);
  const tapped = state.current.tapped;
  const [burst, setBurst] = useState(false);

  function onTap(i: number) {
    if (tapped === "hit") return;
    const [a, b] = sc.fallZone;
    const hit = i >= a && i <= b;
    dispatch({ type: "tap", result: hit ? "hit" : "miss" });
    // No auto-navigation: the player stays in control and continues with the CTA.
    if (hit) setBurst(true);
  }

  return (
    <>
      <Steps step={1} total={RUN1_STEPS} label={`Заход 1 · ${sc.name}`} />
      <Body className="justify-center">
        <motion.h2 key={tapped ?? "q"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center text-[21px] font-black leading-tight text-white text-balance">
          {tapped === "hit" ? "Да, вот здесь цена падала" : tapped === "miss" ? "Почти. Посмотрите на подсвеченный участок" : "Ткните туда, где цена падала"}
        </motion.h2>
        <p className="mt-1.5 text-center text-[13px] text-[var(--ink-dim)]">{tapped === "hit" ? "Вы уже умеете читать график" : "Ошибиться невозможно — это просто чтобы освоиться"}</p>
        <Panel className="relative mt-4" glow={v.accent}>
          <Chart sc={sc} treatment={v.chart} tapMode tapResult={tapped} onTap={onTap} showLabels={tapped === "hit"} height={chartH(270)} />
          {/* Field label pointing at the highlighted fall zone */}
          {!tapped && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-[#0c1424]/90 px-2.5 py-1 text-[10.5px] font-black text-[#ffd15c]"
              style={{ border: "1px solid rgba(255,209,92,.45)" }}
            >
              зона, где цена падала ↓
            </motion.div>
          )}
          {burst && <Burst color="#3fe0a5" />}
          {!tapped && (
            <motion.div animate={{ x: [0, 0, 0], y: [0, -6, 0], opacity: [0.9, 1, 0.9] }} transition={{ duration: 1.6, repeat: Infinity }} className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-[#0c1424]/90 px-3 py-1.5 text-[12px] font-bold text-[#ffd15c]" style={{ border: "1px solid #ffd15c44" }}>
              <IconTarget className="h-4 w-4 text-[#ffd15c]" />
              <span>нажмите на график</span>
            </motion.div>
          )}
        </Panel>
      </Body>
      <Foot><CTA accent={v.accent} disabled={tapped !== "hit"} onClick={next}>Дальше</CTA></Foot>
    </>
  );
}

/* ===== Кадр 3 · Один факт ===== */
export function F03Fact({ v, next }: SP) {
  const { chartH } = useFrameMetrics();
  const sc = scenarioOf(1);
  return (
    <>
      <Steps step={2} total={RUN1_STEPS} label={`Заход 1 · ${sc.name}`} />
      <Body className="justify-center">
        <Panel glow={v.accent}><Chart sc={sc} treatment={v.chart} height={chartH(230)} /></Panel>
        <motion.div initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
          className="mt-4 flex items-start gap-3 rounded-2xl p-4" style={{ background: `linear-gradient(140deg, ${v.accent}22, rgba(16,26,46,0.9))`, border: `1px solid ${v.accent}55` }}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: `${v.accent}33` }}>
            <IconSpeech className="h-5 w-5" style={{ color: v.accent }} />
          </span>
          <div>
            <div className="text-[10.5px] font-black uppercase tracking-wider" style={{ color: v.accent }}>Один факт</div>
            <div className="mt-0.5 text-[16px] font-extrabold leading-snug text-white">{sc.fact}</div>
          </div>
        </motion.div>
      </Body>
      <Foot><CTA accent={v.accent} onClick={next}>Понятно</CTA></Foot>
    </>
  );
}

/* ===== Кадр 4 · Решение из двух ===== */
export function F04Decision({ v, next, props }: SP) {
  const { state, dispatch } = useGame();
  const { chartH } = useFrameMetrics();
  const run = (props?.run as number) ?? 1;
  const sc = scenarioOf(run);
  const choice = state.current.choice;
  return (
    <>
      <Steps step={stepOf(run, "decision")} total={totalOf(run)} label={`Заход ${run} · ${sc.name}`} />
      <Body className="justify-center">
        <Panel glow={v.accent}><Chart sc={sc} treatment={v.chart} height={chartH(220)} /></Panel>
        <h2 className="mt-4 text-center text-[20px] font-black text-white">Что будет дальше?</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {sc.choices.map((c, i) => {
            const on = choice === i;
            const col = i === 0 ? "#3fe0a5" : "#f07a72";
            return (
              <motion.button key={c} whileTap={{ scale: 0.95 }} onClick={() => dispatch({ type: "choose", choice: i })}
                className="flex flex-col items-center justify-center gap-1 rounded-[20px] py-4"
                style={{ minHeight: 84, background: on ? col : `${col}14`, border: `1.5px solid ${on ? col : col + "55"}`, color: on ? "#06120f" : col, boxShadow: on ? `0 16px 30px -14px ${col}` : "none" }}>
                <motion.span animate={on ? { y: [0, i === 0 ? -4 : 4, 0] } : {}} transition={{ repeat: Infinity, duration: 1 }} className="leading-none">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    {i === 0 ? <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></> : <><path d="M7 7l10 10" /><path d="M17 8v9H8" /></>}
                  </svg>
                </motion.span>
                <span className="text-[13.5px] font-black">{c}</span>
              </motion.button>
            );
          })}
        </div>
      </Body>
      <Foot><CTA accent={v.accent} disabled={choice === null} onClick={next}>Дальше</CTA></Foot>
    </>
  );
}

/* ===== Кадр 5 · На что вы опирались ===== */
export function F05Why({ v, next, props }: SP) {
  const { state, dispatch } = useGame();
  const run = (props?.run as number) ?? 1;
  const sc = scenarioOf(run);
  const withWrongIf = sc.wrongIf.length > 0 && run >= 2;
  const [stage, setStage] = useState<0 | 1>(0);
  const cur = state.current;
  return (
    <>
      <Steps step={stepOf(run, "why")} total={totalOf(run)} label={`Заход ${run} · ${sc.name}`} />
      <Body className="justify-center">
        <Chip color={v.accent}>{cur.choice !== null ? sc.choices[cur.choice] : ""}</Chip>
        <AnimatePresence mode="wait">
          {stage === 0 ? (
            <motion.div key="why" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="mt-2 text-[22px] font-black leading-tight text-white">На что вы опирались?</h2>
              <p className="mt-1 text-[13px] text-[var(--ink-dim)]">Честный ответ важнее правильного.</p>
              <div className="mt-4 space-y-2.5">
                {sc.reasons.map((r, i) => <OptionRow key={r.id} index={i} text={r.text} selected={cur.reason === r.id} color={v.accent} onClick={() => dispatch({ type: "reason", id: r.id })} />)}
              </div>
            </motion.div>
          ) : (
            <motion.div key="wrong" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="mt-2 text-[22px] font-black leading-tight text-white">Я пойму, что ошибся, если…</h2>
              <p className="mt-1 text-[13px] text-[var(--ink-dim)]">Новое поле. Заранее решите, что вас переубедит.</p>
              <div className="mt-4 space-y-2.5">
                {sc.wrongIf.map((r, i) => <OptionRow key={r.id} index={i} text={`…${r.text}`} selected={cur.wrongIf === r.id} color={v.accent} onClick={() => dispatch({ type: "wrongIf", id: r.id })} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Body>
      <Foot>
        {stage === 0 && withWrongIf ? (
          <CTA accent={v.accent} disabled={!cur.reason} onClick={() => setStage(1)}>Дальше</CTA>
        ) : (
          <CTA accent={v.accent} disabled={!cur.reason || (withWrongIf && !cur.wrongIf)} onClick={next}>Зафиксировать решение</CTA>
        )}
      </Foot>
    </>
  );
}

/* ===== Кадр 6 · Решение принято. Изменить нельзя ===== */
export function F06Sealed({ v, next, props }: SP) {
  const run = (props?.run as number) ?? 1;
  const sc = scenarioOf(run);
  useEffect(() => { const t = setTimeout(next, 2400); return () => clearTimeout(t); }, [next]);
  return (
    <>
      <Steps step={stepOf(run, "seal")} total={totalOf(run)} label={`Заход ${run} · ${sc.name}`} />
      <Body className="items-center justify-center text-center">
        <SealStamp color={v.accent} />
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-6 text-[24px] font-black text-white">Решение принято</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-1 text-[14px] font-bold text-[var(--ink-dim)]">Изменить нельзя</motion.p>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="mt-5 flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[12.5px] font-bold"
          style={{ background: `${v.accent}14`, border: `1px solid ${v.accent}44`, color: "var(--ink)" }}
        >
          <motion.span animate={{ rotate: 360 }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={v.accent} strokeWidth="2.4" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" /></svg>
          </motion.span>
          Сейчас откроем, что было дальше — кнопки заблокированы, как в реальной сделке
        </motion.div>
      </Body>
      <Foot><div className="h-14" /></Foot>
    </>
  );
}

/* ===== Кадр 7 · Закрытая зона открывается ===== */
export function F07Reveal({ v, next, props }: SP) {
  const { chartH } = useFrameMetrics();
  const run = (props?.run as number) ?? 1;
  const sc = scenarioOf(run);
  const hidden = sc.candles.length - sc.t0 - 1;
  const [revealed, setRevealed] = useState(0);
  const done = revealed >= hidden;
  useEffect(() => {
    setRevealed(0);
    let i = 0;
    const start = setTimeout(() => {
      const t = setInterval(() => { i += 1; setRevealed(i); if (i >= hidden) clearInterval(t); }, 260);
    }, 700);
    return () => clearTimeout(start);
  }, [run, hidden]);
  return (
    <>
      <Steps step={stepOf(run, "reveal")} total={totalOf(run)} label={`Заход ${run} · ${sc.name}`} />
      <Body className="justify-center">
        <h2 className="text-center text-[20px] font-black text-white">{done ? "Вот что было дальше" : "Открываем, что было дальше…"}</h2>
        <div className="mx-auto mt-2 h-1 w-40 overflow-hidden rounded-full bg-[#1c2b47]"><motion.div className="h-full rounded-full" style={{ background: v.accent }} animate={{ width: `${(revealed / hidden) * 100}%` }} /></div>
        <Panel className="mt-4" glow={v.accent}><Chart sc={sc} treatment={v.chart} revealed={revealed} showEvent={done} height={chartH(250)} /></Panel>
        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl p-4" style={{ background: "rgba(16,26,46,0.9)", border: "1px solid rgba(90,120,170,0.2)" }}>
              <div className="text-[10.5px] font-black uppercase tracking-wider text-[var(--ink-mute)]">Что произошло</div>
              <p className="mt-1 text-[14px] font-semibold leading-snug text-white">{sc.eventText}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Body>
      <Foot><CTA accent={v.accent} disabled={!done} onClick={next}>К оценке</CTA></Foot>
    </>
  );
}

/* ===== Кадр 8 / 11 · Оценка строками ===== */
export function ScoreScreen({ v, next, props }: SP) {
  const { state, dispatch } = useGame();
  const run = (props?.run as number) ?? 1;
  const sc = scenarioOf(run);
  const cur = state.current;
  const res = useMemo(() => evaluate(sc, cur.choice, cur.reason, cur.wrongIf), [sc, cur.choice, cur.reason, cur.wrongIf]);
  const lines = run === 1 ? res.lines.slice(0, 2) : res.lines;
  const vd = VERDICT[res.verdict];
  const totalDelay = 0.4 + lines.length * 0.8;
  const [showTotal, setShowTotal] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowTotal(true);
      if (!rewarded) { dispatch({ type: "reward", stars: res.stars, coins: 20 + res.stars * 15, name: sc.name, verdict: res.verdict }); setRewarded(true); }
    }, totalDelay * 1000);
    return () => clearTimeout(t);
  }, [totalDelay]); // eslint-disable-line

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="text-[13px] font-extrabold text-[var(--ink-dim)]">Оценка · заход {run}</span>
        <Chip color={v.accent}>{sc.name}</Chip>
      </div>
      <Body className="pt-3">
        <div className="no-scrollbar min-h-0 shrink overflow-y-auto space-y-2">
          {lines.map((l, i) => <ScoreLine key={i} text={l.text} good={l.good} delay={0.4 + i * 0.8} />)}
        </div>
        <AnimatePresence>
          {showTotal && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 240, damping: 18 }}
              className="relative mt-4 overflow-hidden rounded-[22px] p-4" style={{ background: `linear-gradient(150deg, ${vd.color}33, rgba(16,26,46,0.95))`, border: `1.5px solid ${vd.color}88`, boxShadow: `0 24px 50px -24px ${vd.color}` }}>
              {res.stars > 0 && <Burst color={vd.color} />}
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: `${vd.color}33` }}>
                  <IconTarget className="h-6 w-6" style={{ color: vd.color }} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10.5px] font-black uppercase tracking-wider" style={{ color: vd.color }}>Итог {vd.note ? `· ${vd.note}` : ""}</div>
                  <div className="text-[16px] font-black leading-tight text-white">{vd.title}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 300 }}>
                    <IconStar className="h-5 w-5" style={{ color: i < res.stars ? "#ffd15c" : "#3e4d66" }} />
                  </motion.span>
                ))}
                <span className="ml-auto text-[12px] font-bold text-[var(--ink-dim)]">+{20 + res.stars * 15} монет</span>
              </div>
              {run === 1 && <p className="mt-3 text-[12px] font-semibold text-[var(--ink-dim)]">Первый результат — случайный. Это нормально: вы ещё ничего не знаете.</p>}
              {vd.note && run > 1 && <p className="mt-3 text-[12px] font-semibold text-[var(--ink-dim)]">{VERDICT[res.verdict].note}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </Body>
      <Foot><CTA accent={v.accent} disabled={!showTotal} onClick={next}>Дальше</CTA></Foot>
    </>
  );
}

/* ===== Кадр 9 · Главная мысль ===== */
export function F09Insight({ v, next }: SP) {
  const { state } = useGame();
  const sc = scenarioOf(1);
  const res = evaluate(sc, state.current.choice, state.current.reason, null);
  const title = res.hit
    ? res.reasoned ? "Вы угадали. И смогли объяснить." : "Вы угадали. Но объяснить не смогли."
    : res.reasoned ? "Вы не угадали. Но рассуждали верно." : "Вы не угадали. И объяснения не было.";
  return (
    <>
      <Body className="items-center justify-center text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 14 }} className="relative mb-8 grid h-36 w-36 place-items-center">
          <motion.span className="absolute inset-0 rounded-full" style={{ background: `${v.accent}22` }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity }} />
          <div className="grid h-24 w-24 place-items-center rounded-full" style={{ background: `linear-gradient(145deg, ${v.accent}, ${shade(v.accent, -25)})`, boxShadow: `0 24px 60px -18px ${v.accent}` }}>
            <svg viewBox="0 0 24 24" className="h-12 w-12 text-[#06231f]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
            </svg>
          </div>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-[26px] font-black leading-tight text-white text-balance">{title}</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-4 max-w-[300px] text-[15px] leading-relaxed text-[var(--ink-dim)] text-balance">
          Здесь оценивают рассуждение, а не исход. Можно угадать и получить низкую оценку. Можно не угадать — и получить высокую.
        </motion.p>
      </Body>
      <Foot><CTA accent={v.accent} onClick={next}>Попробовать ещё раз</CTA></Foot>
    </>
  );
}

/* ===== Кадр 10 / 12 / 15 · Заход с источниками фактов ===== */
export function RunWithSources({ v, next, props }: SP) {
  const { state, dispatch } = useGame();
  const run = (props?.run as number) ?? 2;
  const sc = scenarioOf(run);
  const cur = state.current;
  const conflict = run === 3;
  const [open, setOpen] = useState<string | null>(null);
  const allOpened = sc.sources.every((s) => cur.opened.includes(s.id));
  const equipped = cur.equipped ? byId(cur.equipped) : null;

  return (
    <>
      <Steps step={1} total={conflict ? 2 : 4} label={`Заход ${run} · ${sc.name}`} />
      <Body>
        <Panel className="mt-2" glow={v.accent}><Chart sc={sc} treatment={v.chart} height={210} /></Panel>

        {equipped && (
          <div className="mt-3 flex items-center gap-2 rounded-2xl px-3 py-2" style={{ background: `${GROUP_COLOR[equipped.group]}22`, border: `1px solid ${GROUP_COLOR[equipped.group]}66` }}>
            <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: GROUP_COLOR[equipped.group] }}><SkillIcon id={equipped.id} className="h-4 w-4 text-white" /></span>
            <span className="text-[12px] font-extrabold text-white">Приём в слоте: {state.proTerms ? equipped.pro : equipped.plain}</span>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12px] font-extrabold text-[var(--ink-dim)]">Источники фактов</span>
          <span className="text-[11px] font-bold text-[var(--ink-mute)]">{cur.opened.length}/{sc.sources.length} открыто</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2.5">
          {sc.sources.map((s, i) => {
            const opened = cur.opened.includes(s.id);
            return (
              <motion.button key={s.id} whileTap={{ scale: 0.96 }} onClick={() => { dispatch({ type: "openSource", id: s.id }); setOpen(s.id); }}
                className="relative flex min-h-[72px] flex-col justify-between overflow-hidden rounded-2xl p-3 text-left"
                style={{ background: opened ? "rgba(16,26,46,0.9)" : `linear-gradient(150deg, ${v.accent}2a, rgba(16,26,46,0.9))`, border: `1.5px solid ${opened ? "rgba(90,120,170,0.25)" : v.accent + "66"}` }}>
                {!opened && <span className="pointer-events-none absolute inset-0 shimmer" />}
                <span className="text-[10.5px] font-black uppercase tracking-wider" style={{ color: opened ? "var(--ink-mute)" : v.accent }}>Источник {i + 1}</span>
                <span className="text-[13.5px] font-extrabold leading-tight text-white">{s.title}</span>
                <span className="mt-1 text-[11px] font-bold" style={{ color: opened ? "#7f8db0" : v.accent }}>{opened ? "прочитано" : "открыть →"}</span>
              </motion.button>
            );
          })}
        </div>

        {conflict && allOpened && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-2xl p-3.5" style={{ background: "rgba(208,162,74,0.12)", border: "1px solid rgba(208,162,74,0.5)" }}>
            <div className="text-[12px] font-black text-[#D0A24A]">Факты спорят друг с другом</div>
            <p className="mt-0.5 text-[13px] font-semibold leading-snug text-white">Один говорит «выше», другой — «ниже». Как выбрать, какой важнее?</p>
          </motion.div>
        )}
      </Body>
      <Foot>
        {conflict ? (
          <CTA accent="#D0A24A" disabled={!allOpened} onClick={next}>Показать, как это разбирают</CTA>
        ) : (
          <CTA accent={v.accent} disabled={!allOpened} onClick={next}>Принять решение</CTA>
        )}
      </Foot>

      {/* Лист источника (экран G) */}
      <AnimatePresence>
        {open && (
          <motion.div className="absolute inset-0 z-40 flex flex-col justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: "rgba(5,9,16,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setOpen(null)}>
            <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()}
              className="rounded-t-[28px] px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3" style={{ background: "linear-gradient(180deg,#16233d,#0e1628)", borderTop: "1px solid rgba(90,120,170,0.3)" }}>
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#2a3a58]" />
              {(() => { const s = sc.sources.find((x) => x.id === open)!; return (
                <>
                  <Chip color={v.accent}>Источник</Chip>
                  <h3 className="mt-2 text-[20px] font-black text-white">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink)]">{s.body}</p>
                  <div className="mt-5"><CTA accent={v.accent} onClick={() => setOpen(null)}>Учту</CTA></div>
                </>
              ); })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ===== Кадр 13 · Глава 1, урок на минуту ===== */
export function F13Lesson({ v, next, props }: SP) {
  const { state } = useGame();
  const card = byId((props?.cardId as string) ?? "c12");
  const col = GROUP_COLOR[card.group];
  const step = (props?.step as number) ?? 1;
  const total = (props?.total as number) ?? 4;
  return (
    <>
      <Steps step={step} total={total} label="Глава 1 · Сколько сделок" />
      <Body className="justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="relative mx-auto w-full overflow-hidden rounded-[26px]" style={{ maxHeight: "40%", aspectRatio: "4/3", border: `1px solid ${col}66`, background: `linear-gradient(165deg, ${shade(col, 6)}, #0d1728)`, boxShadow: `0 30px 60px -28px ${col}` }}>
          <div className="grid-lines absolute inset-0 opacity-40" />
          {/* Lesson visual: bars = number of trades, drawn as pure SVG */}
          <svg viewBox="0 0 120 90" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
            {[
              { x: 22, h: 30 }, { x: 38, h: 44 }, { x: 54, h: 52 },
              { x: 70, h: 20 }, { x: 86, h: 12 },
            ].map((b, i) => (
              <motion.rect
                key={i}
                x={b.x} width="10" rx="3" fill="#fff"
                initial={{ height: 0, y: 70 }}
                animate={{ height: b.h, y: 70 - b.h }}
                transition={{ delay: 0.2 + i * 0.09, type: "spring", stiffness: 180, damping: 18 }}
                opacity={i > 2 ? 0.35 : 0.9}
              />
            ))}
            <line x1="16" y1="71" x2="100" y2="71" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
          </svg>
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(10,15,25,${v.tint}) 0%, rgba(10,15,25,0.72) 100%)` }} />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: col }}><SkillIcon id={card.id} className="h-5 w-5 text-white" /></span>
            <span className="text-[12px] font-black text-white">{state.proTerms ? card.pro : card.plain}</span>
          </div>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-5 text-center text-[22px] font-black leading-tight text-white text-balance">
          {card.idea}
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mx-auto mt-2 max-w-[300px] text-center text-[14px] leading-relaxed text-[var(--ink-dim)] text-balance">
          Когда два факта спорят, спросите: за каким из них стоит больше сделок? Обычно он и решает.
        </motion.p>
      </Body>
      <Foot><CTA accent={col} onClick={next}>{step === total ? "Закрыть главу" : "Дальше"}</CTA></Foot>
    </>
  );
}

/* ===== Кадр 14 · Четыре карты, один слот ===== */
export function F14Cards({ v, next }: SP) {
  const { state, dispatch } = useGame();
  useEffect(() => { dispatch({ type: "grantCards", ids: CHAPTER_1_CARDS }); }, []); // eslint-disable-line
  const [showBurst, setShowBurst] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShowBurst(true), 1200); return () => clearTimeout(t); }, []);
  return (
    <>
      <Body className="items-center justify-center text-center">
        <Chip color={v.accent}>Глава 1 закрыта</Chip>
        <h2 className="mt-3 text-[24px] font-black leading-tight text-white">Вам выданы четыре приёма</h2>
        <p className="mt-1 text-[13.5px] text-[var(--ink-dim)]">В заход можно взять только один. Выбирайте с умом.</p>
        <div className="relative mt-6 grid grid-cols-2 gap-4">
          {showBurst && <Burst color={v.accent} n={24} />}
          {CHAPTER_1_CARDS.map((id, i) => {
            const c = byId(id);
            return (
              <motion.div key={id} initial={{ rotateY: 180, opacity: 0, y: 40 }} animate={{ rotateY: 0, opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.22, type: "spring", stiffness: 200, damping: 18 }} style={{ perspective: 800 }}>
                <SkillCardTile card={c} size={92} isNew pro={state.proTerms} />
              </motion.div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold text-[var(--ink-dim)]" style={{ background: "rgba(16,26,46,0.9)", border: "1px solid rgba(90,120,170,0.2)" }}>
          <span className="grid h-5 w-5 place-items-center rounded-md" style={{ background: v.accent, color: "#06231f", fontSize: 10, fontWeight: 900 }}>1</span> слот в заходе
        </div>
      </Body>
      <Foot><CTA accent={v.accent} onClick={next}>Собрать заход</CTA></Foot>
    </>
  );
}

/* ===== Экран D / кадр 15 · Сборка перед заходом ===== */
export function Assembly({ v, next, props }: SP) {
  const { state, dispatch } = useGame();
  const slots = (props?.slots as number) ?? 1;
  const owned = state.cards.length ? state.cards : CHAPTER_1_CARDS;
  const eq = state.current.equipped;
  const pool = ["Куда шла цена", "Сколько сделок", "Где цена останавливалась", "Что вокруг"];
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="text-[15px] font-black text-white">Сборка перед заходом</span>
        <Chip color={v.accent}>{slots === 1 ? "1 слот" : `${slots} слота`}</Chip>
      </div>
      <Body>
        <div className="mt-3 flex justify-center gap-3">
          {Array.from({ length: slots }, (_, i) => {
            const id = i === 0 ? eq : null;
            const c = id ? byId(id) : null;
            return (
              <motion.div key={i} animate={c ? {} : { boxShadow: ["0 0 0 0 rgba(53,224,200,0)", `0 0 0 8px ${v.accent}22`, "0 0 0 0 rgba(53,224,200,0)"] }} transition={{ duration: 1.8, repeat: Infinity }}
                className="grid h-24 w-24 place-items-center rounded-[22px]" style={{ background: c ? `linear-gradient(150deg, ${shade(GROUP_COLOR[c.group], 16)}, ${shade(GROUP_COLOR[c.group], -16)})` : "rgba(16,26,46,0.9)", border: c ? "none" : `2px dashed ${v.accent}77` }}>
                {c ? <SkillIcon id={c.id} className="h-11 w-11 text-white" /> : <span className="text-[11px] font-extrabold" style={{ color: v.accent }}>слот {i + 1}</span>}
              </motion.div>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[13px] text-[var(--ink-dim)]">{eq ? `Взяли: ${state.proTerms ? byId(eq).pro : byId(eq).plain}` : "Выберите приём, который возьмёте с собой"}</p>

        <div className="mt-4 text-[12px] font-extrabold text-[var(--ink-dim)]">Мои приёмы</div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {owned.slice(0, 8).map((id) => <SkillCardTile key={id} card={byId(id)} size={64} selected={eq === id} pro={state.proTerms} onClick={() => dispatch({ type: "equip", id: eq === id ? null : id })} />)}
        </div>

        <div className="mt-4 text-[12px] font-extrabold text-[var(--ink-dim)]">Темы в этом заходе</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {pool.map((t, i) => {
            const unknown = i === 3;
            return (
              <span key={t} className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: unknown ? "rgba(208,162,74,0.15)" : "rgba(16,26,46,0.9)", color: unknown ? "#D0A24A" : "var(--ink)", border: `1px solid ${unknown ? "#D0A24A66" : "rgba(90,120,170,0.2)"}` }}>
                {unknown && (
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M6 2a1 1 0 0 0-1 1v19a1 1 0 1 0 2 0v-7h11l-2-4 2-4H7V3a1 1 0 0 0-1-1Z" /></svg>
                )}
                {t}{unknown ? " · незнакомая" : ""}
              </span>
            );
          })}
        </div>
      </Body>
      <Foot><CTA accent={v.accent} disabled={!eq} onClick={next}>Начать заход</CTA></Foot>
    </>
  );
}
