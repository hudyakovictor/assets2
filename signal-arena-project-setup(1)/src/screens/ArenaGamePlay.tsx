import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Chart from "../components/Chart";
import { sound } from "../utils/sound";
import { scenarioOf, evaluate, VERDICT } from "../data/scenarios";
import { byId, GROUP_COLOR } from "../data/skills";
import { shade } from "../components/ui";
import { useFrameMetrics, useUi } from "../game/ui";
import {
  IconSpeech, IconPadlock, IconStar, IconCoin, IconTarget,
  IconCheckmark, SkillIcon,
} from "../components/icons";

type Phase = "read" | "decide" | "why" | "wrongIf" | "sealed" | "reveal" | "score";

interface Props {
  layoutMode?: "classic" | "split" | "cards-focus" | "tactical-grid";
  accentColor?: string;
  onReward?: (stars: number, coins: number) => void;
}

/**
 * АРЕНА — настоящий заход по ТЗ:
 * график со скрытой зоной → источники фактов → решение из двух →
 * почему → когда пойму что ошибся → фиксация → раскрытие → оценка строками.
 * Оценивается рассуждение, а не исход.
 */
export default function ArenaGamePlay({ layoutMode = "classic", accentColor = "#26e6c8", onReward }: Props) {
  const { proTerms } = useUi();
  const { chartH } = useFrameMetrics();

  const [run, setRun] = useState(4);
  const sc = useMemo(() => scenarioOf(run), [run]);

  const [phase, setPhase] = useState<Phase>("read");
  const [opened, setOpened] = useState<string[]>([]);
  const [sheet, setSheet] = useState<string | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [decisionId, setDecisionId] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [wrongIf, setWrongIf] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [rewarded, setRewarded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Always return to the top of the scroll area when the phase changes,
  // so a new step can never be hidden above the viewport (the "empty slab" bug).
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: 0 });
  }, [phase, run, layoutMode]);

  const hidden = sc.candles.length - sc.t0 - 1;
  const allOpened = sc.sources.length === 0 || sc.sources.every((s) => opened.includes(s.id));
  const card = byId(sc.cardHint ?? "c12");

  const res = useMemo(
    () => evaluate(sc, choice, reason, wrongIf, decisionId),
    [sc, choice, reason, wrongIf, decisionId],
  );
  const vd = VERDICT[res.verdict];

  // Reset when the composition version changes in the studio.
  useEffect(() => { reset(run); }, [layoutMode]); // eslint-disable-line

  function reset(nextRun: number) {
    setRun(nextRun);
    setPhase("read");
    setOpened([]); setSheet(null);
    setChoice(null); setDecisionId(null); setReason(null); setWrongIf(null);
    setRevealed(0); setRewarded(false);
  }

  function seal() {
    sound.stamp();
    setPhase("sealed");
    window.setTimeout(() => {
      setPhase("reveal");
      let i = 0;
      const t = window.setInterval(() => {
        i += 1; setRevealed(i); sound.click();
        if (i >= hidden) {
          window.clearInterval(t);
          window.setTimeout(() => {
            setPhase("score");
            if (res.stars >= 2) sound.success();
            if (!rewarded) { onReward?.(res.stars, 20 + res.stars * 40); setRewarded(true); }
          }, 480);
        }
      }, 150);
    }, 1500);
  }

  const coach =
    phase === "read"   ? (allOpened ? "Факты изучены. Что будет дальше?" : "Откройте источники — они важнее догадки.")
  : phase === "decide" ? "Выберите одно из двух. Без цифр и процентов."
  : phase === "why"    ? "Честный ответ важнее правильного."
  : phase === "wrongIf"? "Заранее решите, что вас переубедит."
  : phase === "sealed" ? "Решение принято. Изменить нельзя."
  : phase === "reveal" ? "Открываем, что было дальше…"
  :                      vd.title;

  const showChart = phase !== "score";

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Coach line — a playful speech bubble, not a flat line */}
      <div className="flex shrink-0 items-start gap-2 px-4 pt-2.5">
        <span
          className="grid h-7 w-7 shrink-0 place-items-center rounded-xl"
          style={{
            background: `linear-gradient(160deg, ${shade(accentColor, 12)}, ${shade(accentColor, -18)})`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,.35), inset 0 -2px 0 rgba(0,0,0,.25), 0 4px 10px -4px ${accentColor}`,
          }}
        >
          <IconSpeech className="h-4 w-4 text-[#04221a]" />
        </span>
        <motion.div
          key={coach}
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="relative rounded-2xl rounded-tl-md px-3 py-2"
          style={{
            background: "linear-gradient(180deg, rgba(30,44,68,.96), rgba(20,30,48,.96))",
            border: "1.5px solid rgba(96,126,170,.3)",
            boxShadow: "inset 0 1.5px 0 rgba(255,255,255,.12), inset 0 -2px 0 rgba(0,0,0,.3), 0 6px 14px -8px rgba(0,0,0,.7)",
          }}
        >
          <span className="text-[12.5px] font-black leading-snug text-white">{coach}</span>
        </motion.div>
      </div>

      {/* Step rail */}
      <div className="flex shrink-0 items-center gap-1.5 px-4 pt-2">
        {(["read", "decide", "why", "sealed", "score"] as const).map((p) => {
          const order: Phase[] = ["read", "decide", "why", "wrongIf", "sealed", "reveal", "score"];
          const done = order.indexOf(phase) >= order.indexOf(p);
          return <motion.span key={p} layout className="h-1.5 rounded-full"
            animate={{ width: phase === p ? 22 : 7, background: done ? accentColor : "#26354f" }} />;
        })}
        <span className="ml-auto text-[10px] font-black tabular-nums text-[#6d809e]">
          {sc.name} · заход {run}
        </span>
      </div>

      <div
        ref={scrollRef}
        key={`${run}-${layoutMode}`}
        className="no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 pb-2 pt-2"
      >
        {/* Chart with the closed future zone */}
        {showChart && (
          <div className="relative overflow-hidden rounded-[22px]"
            style={{
              background: "linear-gradient(165deg,#1a2a45 0%,#0e1728 100%)",
              border: `1.5px solid ${layoutMode === "tactical-grid" ? accentColor + "77" : "#2f4463"}`,
              boxShadow: "inset 0 1.5px 0 rgba(255,255,255,.14), inset 0 -3px 8px rgba(0,0,0,.4), 0 14px 30px -14px rgba(0,0,0,.7)",
              order: layoutMode === "cards-focus" && phase === "read" ? 2 : 0,
            }}>
            <Chart
              sc={sc}
              treatment={layoutMode === "split" ? "mono" : layoutMode === "cards-focus" ? "gold" : "teal"}
              revealed={revealed}
              showEvent={phase === "reveal" && revealed >= hidden}
              height={chartH(
                layoutMode === "cards-focus" ? 140
                : layoutMode === "split" ? 160
                : phase === "read" ? 188 : 168,
              )}
              compact={layoutMode === "cards-focus"}
            />
            {phase === "sealed" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 grid place-items-center" style={{ background: "rgba(7,12,20,.72)" }}>
                <motion.div initial={{ scale: 2, rotate: -18, opacity: 0 }} animate={{ scale: 1, rotate: -7, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 17 }}
                  className="grid h-24 w-24 place-items-center rounded-full"
                  style={{ border: `4px solid ${accentColor}`, boxShadow: `0 0 0 6px ${accentColor}22` }}>
                  <IconPadlock className="h-8 w-8" style={{ color: accentColor }} />
                </motion.div>
              </motion.div>
            )}
          </div>
        )}

        {/* PHASE: read facts */}
        {phase === "read" && (
          <>
            {sc.fact && (
              <div className="rounded-2xl px-3.5 py-2.5"
                style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}44` }}>
                <div className="text-[9.5px] font-black uppercase tracking-wider" style={{ color: accentColor }}>Один факт</div>
                <div className="mt-0.5 text-[13px] font-extrabold leading-snug text-white">{sc.fact}</div>
              </div>
            )}
            {sc.sources.length > 0 && (
              <div className={layoutMode === "split" ? "grid grid-cols-1 gap-2" : "grid grid-cols-2 gap-2"}>
                {sc.sources.map((s, i) => {
                  const isOpen = opened.includes(s.id);
                  return (
                    <motion.button
                      key={s.id}
                      whileTap={{ scale: 0.95, y: 2 }}
                      onClick={() => { sound.pop(); setOpened((o) => o.includes(s.id) ? o : [...o, s.id]); setSheet(s.id); }}
                      className="relative min-h-[72px] overflow-hidden rounded-[18px] p-2.5 text-left"
                      style={{
                        background: isOpen
                          ? "linear-gradient(180deg,#1a2740,#121c30)"
                          : `linear-gradient(180deg, ${accentColor}2e 0%, rgba(18,28,46,.96) 58%)`,
                        border: `1.5px solid ${isOpen ? "#33455f" : accentColor + "77"}`,
                        boxShadow: isOpen
                          ? "inset 0 1.5px 0 rgba(255,255,255,.10), inset 0 -2px 0 rgba(0,0,0,.35)"
                          : `inset 0 1.5px 0 rgba(255,255,255,.22), inset 0 -2px 0 rgba(0,0,0,.3), 0 6px 0 ${accentColor}2e, 0 10px 18px -8px rgba(0,0,0,.6)`,
                      }}>
                      {!isOpen && <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[18px] bg-gradient-to-b from-white/15 to-transparent" />}
                      {!isOpen && <span className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-white/15 shimmer" />}
                      <div className="relative text-[9px] font-black uppercase tracking-wider"
                        style={{ color: isOpen ? "#66799a" : accentColor }}>Источник {i + 1}</div>
                      <div className="relative mt-0.5 text-[12.5px] font-extrabold leading-tight text-white">{s.title}</div>
                      <div className="relative mt-1 flex items-center gap-1 text-[10px] font-black"
                        style={{ color: isOpen ? "#5f7391" : accentColor }}>
                        {isOpen && <IconCheckmark className="h-3 w-3" />}
                        {isOpen ? "прочитано" : "открыть"}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
            {run >= 4 && (
              <div className="flex items-center gap-2 rounded-2xl px-3 py-2"
                style={{ background: `${GROUP_COLOR[card.group]}1f`, border: `1px solid ${GROUP_COLOR[card.group]}55` }}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl" style={{ background: GROUP_COLOR[card.group] }}>
                  <SkillIcon id={card.id} className="h-5 w-5 text-white" />
                </span>
                <span className="text-[11.5px] font-extrabold text-white">
                  Приём в слоте: {proTerms ? card.pro : card.plain}
                </span>
              </div>
            )}

            {/* Explicit gate hint: never leave a disabled CTA unexplained. */}
            {!allOpened && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-2xl px-3 py-2.5"
                style={{ background: `${accentColor}10`, border: `1px dashed ${accentColor}66` }}
              >
                <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={accentColor} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7" />
                  </svg>
                </motion.span>
                <span className="text-[12px] font-bold" style={{ color: accentColor }}>
                  Откройте {sc.sources.length - opened.length === 0 ? "источники" : `источники: осталось ${sc.sources.length - opened.length}`} — без фактов решение принять нельзя
                </span>
              </motion.div>
            )}
          </>
        )}

        {/* PHASE: decision.
            Продуктовый заход — это ДЕЙСТВИЕ, включая WAIT и NO_TRADE как равноправные.
            Онбординг (без decisions) использует два направления. */}
        {phase === "decide" && (
          <div
            className={
              sc.decisions
                ? "grid grid-cols-1 gap-2.5"
                : layoutMode === "tactical-grid"
                  ? "grid grid-cols-1 gap-2.5"
                  : "grid grid-cols-2 gap-2.5"
            }
          >
            {(sc.decisions
                ? sc.decisions.map((d) => {
                  const on = decisionId === d.id;
                  const isDown = d.id === "sell";
                  const col = d.id === "buy" ? "#3fe0a5" : isDown ? "#f07a72" : "#26e6c8";
                  const dark = isDown ? "#7a2e2a" : "#115f4f";
                  return (
                    <motion.button key={d.id} whileTap={{ scale: 0.97, y: 3 }}
                      onClick={() => { sound.pop(); setDecisionId(d.id); }}
                      aria-pressed={on}
                      className="relative flex flex-row items-center justify-center gap-3 overflow-hidden rounded-[20px] px-4"
                      style={{
                        minHeight: 66,
                        paddingTop: 12, paddingBottom: 12,
                        color: on ? "#06120f" : col,
                        background: on
                          ? `linear-gradient(180deg, ${col}, ${shade(col, -16)})`
                          : `linear-gradient(180deg, ${col}26, ${col}10)`,
                        border: `1.5px solid ${on ? shade(col, 18) : col + "66"}`,
                        boxShadow: on
                          ? `inset 0 1.5px 0 rgba(255,255,255,.4), inset 0 -2px 0 rgba(0,0,0,.25), 0 6px 0 ${dark}, 0 14px 22px -10px ${col}`
                          : `inset 0 1.5px 0 rgba(255,255,255,.18), inset 0 -2px 0 rgba(0,0,0,.3), 0 5px 0 rgba(0,0,0,.35)`,
                      }}>
                      {on && <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />}
                      <DecisionGlyph id={d.id} />
                      <span className="relative text-[13.5px] font-black">{d.text}</span>
                    </motion.button>
                  );
                })
              : sc.choices.map((c, i) => {
                  const on = choice === i;
                  const col = i === 0 ? "#3fe0a5" : "#f07a72";
                  return (
                    <motion.button key={c} whileTap={{ scale: 0.95 }}
                      onClick={() => { sound.pop(); setChoice(i); }}
                      aria-pressed={on}
                      className={
                        layoutMode === "tactical-grid"
                          ? "flex flex-row items-center justify-center gap-3 rounded-[20px] py-4"
                          : "flex flex-col items-center justify-center gap-1.5 rounded-[20px] py-4"
                      }
                      style={{
                        minHeight: layoutMode === "tactical-grid" ? 62 : 92,
                        color: on ? "#06120f" : col,
                        background: on
                          ? `linear-gradient(180deg, ${col}, ${shade(col, -16)})`
                          : `linear-gradient(180deg, ${col}24, ${col}0f)`,
                        border: `1.5px solid ${on ? shade(col, 18) : col + "66"}`,
                        boxShadow: on
                          ? `inset 0 1.5px 0 rgba(255,255,255,.4), inset 0 -2px 0 rgba(0,0,0,.25), 0 6px 0 ${shade(col, -34)}, 0 14px 22px -10px ${col}`
                          : "inset 0 1.5px 0 rgba(255,255,255,.16), inset 0 -2px 0 rgba(0,0,0,.3), 0 5px 0 rgba(0,0,0,.35)",
                      }}>
                      {on && <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[20px] bg-gradient-to-b from-white/25 to-transparent" />}
                      <svg viewBox="0 0 24 24" className="relative h-7 w-7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        {i === 0 ? <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></> : <><path d="M7 7l10 10" /><path d="M17 8v9H8" /></>}
                      </svg>
                      <span className="relative text-[13px] font-black">{c}</span>
                    </motion.button>
                  );
                })
            )}
          </div>
        )}

        {/* PHASE: why / wrongIf */}
        {(phase === "why" || phase === "wrongIf") && (
          <div className="space-y-2">
            <div className="text-[15px] font-black text-white">
              {phase === "why" ? "На что вы опирались?" : "Я пойму, что ошибся, если…"}
            </div>
            {(phase === "why" ? sc.reasons : sc.wrongIf).map((o, i) => {
              const on = (phase === "why" ? reason : wrongIf) === o.id;
              return (
                <motion.button key={o.id} whileTap={{ scale: 0.98, y: 2 }}
                  onClick={() => { sound.pop(); phase === "why" ? setReason(o.id) : setWrongIf(o.id); }}
                  aria-pressed={on}
                  className="relative flex w-full items-center gap-3 overflow-hidden rounded-2xl p-3 text-left"
                  style={{
                    minHeight: 54,
                    background: on
                      ? `linear-gradient(180deg, ${accentColor}24, rgba(18,28,46,.95))`
                      : "linear-gradient(180deg, rgba(28,42,66,.9), rgba(16,25,42,.95))",
                    border: `1.5px solid ${on ? accentColor : "#32455f"}`,
                    boxShadow: on
                      ? `inset 0 1.5px 0 rgba(255,255,255,.2), 0 5px 0 ${accentColor}33, 0 10px 18px -12px ${accentColor}`
                      : "inset 0 1.5px 0 rgba(255,255,255,.12), inset 0 -2px 0 rgba(0,0,0,.3), 0 4px 0 rgba(0,0,0,.32)",
                  }}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-black"
                    style={{
                      background: on ? accentColor : "#0e1727",
                      color: on ? "#06231f" : "#7f94b4",
                      boxShadow: on ? "inset 0 1px 0 rgba(255,255,255,.4)" : "inset 0 1px 0 rgba(255,255,255,.1)",
                    }}>{i + 1}</span>
                  <span className="text-[13px] font-bold leading-snug text-white">
                    {phase === "wrongIf" ? `…${o.text}` : o.text}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* PHASE: score — lines one by one, then the verdict */}
        {phase === "score" && (
          <div className="space-y-2">
            {res.lines.map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.55 }}
                className="flex items-start gap-2.5 rounded-2xl px-3 py-2.5"
                style={{ background: "rgba(18,28,46,.9)", border: "1px solid #2a3a56" }}>
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-black"
                  style={{
                    background: `${l.good === null ? "#7f8db0" : l.good ? "#35e0c8" : "#5B8DEF"}22`,
                    color: l.good === null ? "#7f8db0" : l.good ? "#35e0c8" : "#5B8DEF",
                    border: `1.5px solid ${l.good === null ? "#7f8db0" : l.good ? "#35e0c8" : "#5B8DEF"}`,
                  }}>
                  {l.good === null ? "·" : l.good ? <IconCheckmark className="h-2.5 w-2.5" /> : "~"}
                </span>
                <span className="text-[12.5px] font-semibold leading-snug text-white">{l.text}</span>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + res.lines.length * 0.55, type: "spring", stiffness: 220, damping: 18 }}
              className="rounded-[20px] p-3.5"
              style={{ background: `linear-gradient(150deg, ${vd.color}2e, rgba(16,26,46,.95))`, border: `1.5px solid ${vd.color}88` }}>
              <div className="text-[9.5px] font-black uppercase tracking-wider" style={{ color: vd.color }}>
                Итог{vd.note ? ` · ${vd.note}` : ""}
              </div>
              <div className="text-[15px] font-black leading-tight text-white">{vd.title}</div>
              <p className="mt-1 text-[11.5px] font-semibold leading-snug text-[#9fb2cd]">{sc.eventText}</p>
              <div className="mt-2.5 flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <IconStar key={i} className="h-5 w-5" style={{ color: i < res.stars ? "#ffd15c" : "#33415c" }} />
                ))}
                <span className="ml-auto flex items-center gap-1 text-[11.5px] font-black text-[#ffcf5c]">
                  +{20 + res.stars * 40}<IconCoin className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.div>
          </div>
        )}

      </div>

      {/* Single primary action */}
      <div className="shrink-0 px-4 pb-3 pt-1.5">
        <PrimaryAction
          phase={phase}
          accent={accentColor}
          allOpened={allOpened}
          reason={reason}
          wrongIf={wrongIf}
          hasWrongIf={sc.wrongIf.length > 0}
          onGo={(p) => { sound.click(); setPhase(p); }}
          onSeal={seal}
          needsAction={(sc.decisions ? decisionId : choice) === null}
          onNext={() => { sound.click(); reset(run === 4 ? 1 : run + 1); }}
        />
      </div>

      {/* Source sheet */}
      <AnimatePresence>
        {sheet && (
          <motion.div className="absolute inset-0 z-40 flex flex-col justify-end"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: "rgba(5,9,16,.66)", backdropFilter: "blur(3px)" }}
            onClick={() => setSheet(null)}>
            <motion.div initial={{ y: 280 }} animate={{ y: 0 }} exit={{ y: 280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-t-[26px] px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-3"
              style={{ background: "linear-gradient(180deg,#17253d,#0e1728)", borderTop: "1.5px solid #2f4462" }}>
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#2a3a58]" />
              {(() => {
                const s = sc.sources.find((x) => x.id === sheet)!;
                return (
                  <>
                    <div className="text-[9.5px] font-black uppercase tracking-wider" style={{ color: accentColor }}>Лист источника</div>
                    <h3 className="mt-0.5 text-[18px] font-black text-white">{s.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-[#cfdcee]">{s.body}</p>
                    <button onClick={() => { sound.click(); setSheet(null); }}
                      className="btn-3d depth-mint mt-4 w-full rounded-2xl py-3 text-[13px] font-black uppercase text-[#06241c]">
                      Учту
                    </button>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Vector glyph for buy / wait / no-trade decisions. */
function DecisionGlyph({ id }: { id: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (id === "buy")
    return <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" {...common}><path d="M12 19V5M5 12l7-7 7 7" /></svg>;
  if (id === "sell")
    return <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" {...common}><path d="M12 5v14M5 12l7 7 7-7" /></svg>;
  if (id === "no-trade")
    return <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" {...common}><circle cx="12" cy="12" r="9" /><path d="M5 5l14 14" /></svg>;
  // wait — hourglass
  return <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" {...common}><path d="M5 22h14M5 2h14M17 22v-4.5a5 5 0 0 0-2.5-4.3L12 11.5l-2.5 1.7A5 5 0 0 0 7 17.5V22M17 2v4.5a5 5 0 0 1-2.5 4.3L12 12.5" /></svg>;
}

/* One main action per screen — never two. */
function PrimaryAction({
  phase, accent, allOpened, reason, wrongIf, hasWrongIf, needsAction, onGo, onSeal, onNext,
}: {
  phase: Phase; accent: string; allOpened: boolean;
  reason: string | null; wrongIf: string | null; hasWrongIf: boolean;
  needsAction: boolean;
  onGo: (p: Phase) => void; onSeal: () => void; onNext: () => void;
}) {
  const cfg: Record<Phase, { label: string; ok: boolean; act: () => void }> = {
    read:    { label: "Принять решение",        ok: allOpened,       act: () => onGo("decide") },
    decide:  { label: "Дальше",                 ok: !needsAction,     act: () => onGo("why") },
    why:     { label: hasWrongIf ? "Дальше" : "Зафиксировать", ok: !!reason, act: () => onGo(hasWrongIf ? "wrongIf" : "sealed") },
    wrongIf: { label: "Зафиксировать решение",  ok: !!wrongIf,       act: onSeal },
    sealed:  { label: "Изменить нельзя",        ok: false,           act: () => {} },
    reveal:  { label: "Смотрим историю…",       ok: false,           act: () => {} },
    score:   { label: "Следующий заход",        ok: true,            act: onNext },
  };
  const c = cfg[phase];
  if (phase === "wrongIf" && !hasWrongIf) c.act = onSeal;

  return (
    <motion.button
      whileTap={c.ok ? { scale: 0.96 } : {}}
      onClick={c.ok ? c.act : undefined}
      aria-disabled={!c.ok}
      className="btn-3d relative w-full overflow-hidden rounded-[18px] text-[14px] font-black uppercase tracking-wide"
      style={{
        minHeight: 56,
        color: c.ok ? "#06231f" : "#63779a",
        background: c.ok
          ? `linear-gradient(180deg, ${shade(accent, 10)}, ${shade(accent, -16)})`
          : "linear-gradient(180deg,#22304a,#182335)",
        border: c.ok ? `1.5px solid ${shade(accent, 22)}` : "1.5px solid #2a3a56",
        boxShadow: c.ok
          ? `inset 0 1.5px 0 rgba(255,255,255,.45), inset 0 -2px 0 rgba(0,0,0,.22), 0 6px 0 ${shade(accent, -34)}, 0 14px 24px -12px ${accent}`
          : "inset 0 1.5px 0 rgba(255,255,255,.10), inset 0 -2px 0 rgba(0,0,0,.3), 0 5px 0 rgba(0,0,0,.3)",
      }}
    >
      {c.ok && <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[18px] bg-gradient-to-b from-white/25 to-transparent" />}
      {c.ok && <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/20 shimmer" />}
      <span className="relative flex items-center justify-center gap-2">
        {phase === "wrongIf" && <IconPadlock className="h-4 w-4" />}
        {phase === "score" && <IconTarget className="h-4 w-4" />}
        {c.label}
      </span>
    </motion.button>
  );
}
