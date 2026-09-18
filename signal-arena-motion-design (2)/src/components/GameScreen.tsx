import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconAlert,
  IconArrowUp,
  IconBars,
  IconBell,
  IconBolt,
  IconBubble,
  IconCalendar,
  IconCheck,
  IconCoin,
  IconCommons,
  IconCore,
  IconDots,
  IconFlame,
  IconGear,
  IconGraph,
  IconHand,
  IconHourglass,
  IconInfra,
  IconJournal,
  IconList,
  IconLock,
  IconNet,
  IconPool,
  IconRelay,
  IconRestart,
  IconRotate,
  IconShield,
  IconSignal,
  IconStack,
  IconStar,
  IconSwap,
  IconTarget,
  IconTrust,
  IconXp,
} from "./Icons";
import {
  ACTIONS,
  COMBO_WINDOW,
  NODES,
  QUESTS,
  TICKS_PER_DAY,
  type ActionId,
  type GameState,
  type NodeId,
  type Params,
  type Tone,
  canAct,
  costOf,
  denyReason,
  metricValue,
  rates,
  tapYieldOf,
  xpToNext,
} from "../game/engine";

const NODE_ICON: Record<NodeId, typeof IconRelay> = {
  relay: IconRelay,
  pool: IconPool,
  infra: IconInfra,
  commons: IconCommons,
};
const ACTION_ICON: Record<ActionId, typeof IconHand> = {
  collect: IconHand,
  convert: IconSwap,
  stabilize: IconShield,
  overclock: IconBolt,
};

export interface Visuals {
  grid: boolean;
  glow: boolean;
  gloss: boolean;
}
export type SfxName = "tap" | "crit" | "buy" | "deny" | "quest" | "unlock";

interface Props {
  state: GameState;
  params: Params;
  paused: boolean;
  visuals: Visuals;
  landscape?: boolean;
  onAct: (id: ActionId) => void;
  onBuy: (id: NodeId) => void;
  onResolve: (i: number) => void;
  onRestart: () => void;
  onClearToast: () => void;
  onMarkRead: () => void;
  onSfx: (n: SfxName) => void;
}

type Section = "arena" | "nodes" | "journal" | "more";
type Pop = { id: number; x: number; y: number; v: string; crit: boolean };

const fmt = (n: number) => (n >= 10000 ? `${(n / 1000).toFixed(1)}k` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : Math.floor(n).toString());
const TONE: Record<Tone, string> = { good: "#3ecf8e", bad: "#ef6b62", warn: "#e0b145", info: "#5b8fdb" };
const trustColor = (t: number) => (t < 25 ? "#ef6b62" : t < 50 ? "#e0b145" : "#2fd4c4");

export default function GameScreen({
  state,
  params,
  paused,
  visuals,
  landscape,
  onAct,
  onBuy,
  onResolve,
  onRestart,
  onClearToast,
  onMarkRead,
  onSfx,
}: Props) {
  const [section, setSection] = useState<Section>("arena");
  const [page, setPage] = useState(0);
  const [sheet, setSheet] = useState<null | "bell" | "gear">(null);
  const [pops, setPops] = useState<Pop[]>([]);
  const [holding, setHolding] = useState(false);
  const [lf, setLf] = useState(false);
  const holdRef = useRef<number | null>(null);
  const tapPoint = useRef<{ x: number; y: number }>({ x: 180, y: 200 });
  const gainRef = useRef(0);

  const r = rates(state, params);
  const over = state.status !== "live";
  const dayFill = ((state.tick % TICKS_PER_DAY) / TICKS_PER_DAY) * 100;
  const xpNeed = xpToNext(state.level);
  const xpFill = Math.min(100, (state.xp / xpNeed) * 100);
  const danger = state.trust < 25 && !over;
  const plate = visuals.gloss ? "plate" : "plate-flat";
  const quest = QUESTS[Math.min(state.quest, QUESTS.length - 1)];
  const questDone = state.quest >= QUESTS.length;
  const questVal = questDone ? quest.goal : metricValue(state, quest.metric);
  const questPct = Math.min(100, (questVal / quest.goal) * 100);
  const comboMul = 1 + Math.min(state.combo, 25) * 0.04;
  const comboFill = (state.comboTimer / COMBO_WINDOW) * 100;

  useEffect(() => {
    if (state.event) {
      setSection("arena");
      setPage(0);
      setSheet(null);
    }
  }, [state.event]);

  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(onClearToast, 2100);
    return () => clearTimeout(t);
  }, [state.toast, onClearToast]);

  // всплывашки по данным движка (одна точка правды для критов)
  useEffect(() => {
    const g = state.lastGain;
    if (!g || g.id === gainRef.current) return;
    gainRef.current = g.id;
    setPops((p) => [
      ...p.slice(-5),
      {
        id: g.id,
        x: tapPoint.current.x,
        y: tapPoint.current.y,
        v: `+${g.v.toFixed(1)}${g.crit ? " КРИТ" : ""}`,
        crit: g.crit,
      },
    ]);
    onSfx(g.crit ? "crit" : "tap");
    const t = setTimeout(() => setPops((p) => p.filter((q) => q.id !== g.id)), 900);
    return () => clearTimeout(t);
  }, [state.lastGain, onSfx]);

  const questRef = useRef(state.quest);
  useEffect(() => {
    if (state.quest === questRef.current) return;
    questRef.current = state.quest;
    onSfx("quest");
  }, [state.quest, onSfx]);

  useEffect(() => {
    if (state.status === "live") return;
    setLf(true);
    const t = setTimeout(() => setLf(false), 380);
    return () => clearTimeout(t);
  }, [state.status]);

  const doAct = useCallback(
    (id: ActionId, e?: React.PointerEvent<HTMLElement>) => {
      if (e) {
        const b = e.currentTarget.getBoundingClientRect();
        tapPoint.current = { x: e.clientX - b.left, y: e.clientY - b.top };
      }
      if (!canAct(state, id)) {
        setLf(true);
        setTimeout(() => setLf(false), 280);
        onSfx("deny");
      }
      onAct(id);
    },
    [state, onAct, onSfx],
  );

  const startHold = (e: React.PointerEvent<HTMLElement>) => {
    doAct("collect", e);
    setHolding(true);
    if (holdRef.current) window.clearInterval(holdRef.current);
    holdRef.current = window.setInterval(() => doAct("collect"), 190);
  };
  const endHold = () => {
    setHolding(false);
    if (holdRef.current) window.clearInterval(holdRef.current);
    holdRef.current = null;
  };
  useEffect(() => endHold, []);

  const openBell = () => {
    onSfx("unlock");
    setSheet(sheet === "bell" ? null : "bell");
    if (sheet !== "bell") onMarkRead();
  };

  /* свайп-пейджер */
  const drag = useRef<{ x: number; y: number } | null>(null);
  const onDragStart = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onDragEnd = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    setPage((p) => Math.max(0, Math.min(2, p + (dx < 0 ? 1 : -1))));
  };

  const tapsPerSec = tapYieldOf(state, params);

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden bg-ink-950 text-mist-300 ${lf ? "shake-hard" : ""}`}
      style={{
        boxShadow: visuals.glow ? "0 0 0 1px rgba(255,255,255,.08), 0 40px 100px -36px var(--accent-soft)" : "0 0 0 1px rgba(255,255,255,.08)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 stage-bg" />
      {visuals.grid && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            maskImage: "radial-gradient(70% 45% at 50% 26%, #000 0%, transparent 100%)",
          }}
        />
      )}
      {danger && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(80% 36% at 50% 100%, rgba(239,107,98,.2) 0%, transparent 70%)" }}
        />
      )}

      {/* TOP */}
      <div className="relative z-10 flex items-center gap-1.5 px-3 pt-3">
        <div className={`relative flex h-8 min-w-0 flex-1 items-center overflow-hidden rounded-full ${plate}`}>
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
            style={{ width: `${xpFill}%`, background: "linear-gradient(90deg,#2a9d6a,var(--accent))" }}
          />
          <div className="tick-marks pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative flex w-full items-center gap-1 px-1.5">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full" style={{ background: "rgba(0,0,0,.4)", color: "var(--accent)" }}>
              <IconXp className="h-3 w-3" />
            </span>
            <span className="truncate font-mono text-[11px] font-bold tabular-nums text-white">
              {Math.floor(state.xp)}
              <span className="text-white/55">/{xpNeed}</span>
            </span>
            <span
              className={`ml-auto shrink-0 rounded-full px-1.5 py-[1px] font-mono text-[9.5px] font-bold tracking-wider text-white ${state.flash?.leveled ? "lvl-pop" : ""}`}
              style={{ background: "rgba(0,0,0,.42)" }}
            >
              LVL {state.level}
            </span>
          </div>
        </div>

        <div
          className={`flex h-8 items-center gap-1 rounded-full px-2 ${plate} ${state.flash && state.flash.credits > 0.5 ? "flash-gain" : ""}`}
        >
          <span className="text-gold">
            <IconCoin className="h-3.5 w-3.5" />
          </span>
          <span className="font-mono text-[11.5px] font-bold tabular-nums text-white">{fmt(state.credits)}</span>
        </div>

        <TopBtn gloss={visuals.gloss} onPress={openBell} badge={state.unread > 0 ? Math.min(state.unread, 9) : 0}>
          <IconBell className="h-3.5 w-3.5" />
        </TopBtn>
        <TopBtn gloss={visuals.gloss} onPress={() => { onSfx("unlock"); setSheet(sheet === "gear" ? null : "gear"); }}>
          <IconGear className="h-3.5 w-3.5" />
        </TopBtn>
      </div>

      {/* МЕТРИКИ */}
      <div className="relative z-10 mt-2 grid grid-cols-3 gap-1.5 px-3">
        <Tile
          plate={plate}
          icon={<IconSignal className="h-3 w-3" />}
          color="#3ecf8e"
          label="СИГНАЛ"
          value={fmt(state.signal)}
          rate={`${r.signalGain - r.convert >= 0 ? "+" : ""}${(r.signalGain - r.convert).toFixed(1)}/т`}
          flash={state.flash?.signal}
        />
        <Tile
          plate={plate}
          icon={<IconTrust className="h-3 w-3" />}
          color={trustColor(state.trust)}
          label="ДОВЕРИЕ"
          value={String(Math.floor(state.trust))}
          rate={`${r.trustGain >= 0 ? "+" : ""}${r.trustGain.toFixed(2)}/т`}
          flash={state.flash?.trust}
          bar={state.trust}
          danger={danger}
        />
        <Tile
          plate={plate}
          icon={<IconCalendar className="h-3 w-3" />}
          color="var(--accent)"
          label="ДЕНЬ"
          value={`${state.day}/${params.goalDays}`}
          rate={over ? "забег окончен" : `−${Math.max(0, params.goalDays - state.day)} дн`}
          bar={dayFill}
        />
      </div>

      {/* ПОДСКАЗКА */}
      <div className="relative z-10 flex items-center gap-2 px-3.5 pb-0.5 pt-2">
        <span className="shrink-0" style={{ color: danger ? "#ef6b62" : "var(--accent)" }}>
          {danger ? <IconAlert className="h-3.5 w-3.5" /> : <IconBubble className="h-3.5 w-3.5" />}
        </span>
        <p key={state.hint} className="slide-in min-w-0 flex-1 truncate text-[12px] font-medium text-white/90">
          {state.hint}
        </p>
        {state.boost > 0 && (
          <span className="shrink-0 rounded-full bg-coral px-1.5 py-[1px] text-[9px] font-bold tracking-wider text-ink-990">
            ×2 · {state.boost}т
          </span>
        )}
      </div>

      {/* КОНТЕНТ */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-2 px-3 pb-1.5 pt-1.5">
        {section === "arena" && (
          <>
            {/* сцена + свайп-страницы */}
            <div className={`relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl ${plate}`}>
              <div className="flex items-center gap-1 px-2 pt-2">
                <span className="flex gap-[3px] px-0.5">
                  <span className="h-[5px] w-[5px] rounded-full bg-[#ef6b62]/70" />
                  <span className="h-[5px] w-[5px] rounded-full bg-[#e0b145]/70" />
                  <span className="h-[5px] w-[5px] rounded-full bg-[#3ecf8e]/70" />
                </span>
                {(
                  [
                    ["СЕТЬ", IconGraph],
                    ["ПОТОК", IconBars],
                    ["ЛЕНТА", IconList],
                  ] as const
                ).map(([label, Icon], i) => {
                  const on = page === i;
                  return (
                    <button
                      key={label}
                      onPointerDown={() => { onSfx("unlock"); setPage(i); }}
                      className="flex h-7 flex-1 items-center justify-center gap-1 rounded-t-xl text-[10.5px] font-bold tracking-wider transition-transform duration-75 active:scale-95"
                      style={{
                        background: on ? "rgba(7,11,20,.9)" : "transparent",
                        color: on ? "var(--accent)" : "#6a7ea3",
                        boxShadow: on ? "inset 0 1px 0 rgba(255,255,255,.07)" : "none",
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  );
                })}
              </div>

              <div
                className="swipe-track relative m-1.5 mt-0 min-h-0 flex-1 overflow-hidden rounded-xl plate-sunken"
                onPointerDown={onDragStart}
                onPointerUp={onDragEnd}
                onPointerCancel={() => (drag.current = null)}
              >
                {page === 0 && (
                  <NetView
                    state={state}
                    pops={pops}
                    holding={holding}
                    comboMul={comboMul}
                    comboFill={comboFill}
                    onCore={startHold}
                    onCoreEnd={endHold}
                    onNode={() => setSection("nodes")}
                  />
                )}
                {page === 1 && <FlowView state={state} r={r} tapsPerSec={tapsPerSec} />}
                {page === 2 && <FeedView state={state} compact />}
              </div>

              <div className="flex items-center justify-center gap-1.5 pb-1.5">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onPointerDown={() => setPage(i)}
                    className="pager-dot h-[5px] rounded-full"
                    style={{ width: page === i ? 16 : 5, background: page === i ? "var(--accent)" : "rgba(106,126,163,.4)" }}
                    aria-label={`Страница ${i + 1}`}
                  />
                ))}
                <span className="ml-2 text-[9px] tracking-wider text-mist-500">СВАЙП</span>
              </div>
            </div>

            {/* ЦЕЛЬ */}
            <div
              className={`quest-ping shrink-0 rounded-2xl px-2.5 py-2 ${plate}`}
              key={quest.id}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: questDone ? "#3ecf8e" : "var(--accent)" }}>
                  {questDone ? <IconTrophyIcon /> : <IconTarget className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11.5px] font-bold leading-tight text-white">
                    {questDone ? "Все цели цикла выполнены" : quest.text}
                  </span>
                  <span className="font-mono text-[9.5px] text-mist-500">
                    {questDone
                      ? `Выполнено ${state.questsDone.length}/${QUESTS.length}`
                      : `${Math.min(questVal, quest.goal)}/${quest.goal} · награда ${quest.credits} кр + ${quest.xp} xp`}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[10px] font-bold text-mist-400">
                  {state.questsDone.length}/{QUESTS.length}
                </span>
              </div>
              <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-black/45">
                <div
                  className="h-full rounded-full transition-[width] duration-400"
                  style={{ width: `${questPct}%`, background: questDone ? "#3ecf8e" : "var(--accent)" }}
                />
              </div>
            </div>

            {/* МОДУЛИ */}
            <div className="grid shrink-0 grid-cols-4 gap-1.5">
              {NODES.map((n) => (
                <ModuleCard
                  key={n.id}
                  def={n}
                  state={state}
                  params={params}
                  gloss={visuals.gloss}
                  onBuy={() => onBuy(n.id)}
                  onOpen={() => setSection("nodes")}
                />
              ))}
            </div>

            {/* ДЕЙСТВИЯ */}
            <div className="grid shrink-0 grid-cols-2 gap-1.5">
              {ACTIONS.map((a) => {
                const Icon = ACTION_ICON[a.id];
                const ready = canAct(state, a.id);
                const cd = state.cooldowns[a.id];
                const reason = denyReason(state, a.id);
                return (
                  <button
                    key={a.id}
                    onPointerDown={(e) => (a.hold ? startHold(e) : doAct(a.id, e))}
                    onPointerUp={a.hold ? endHold : undefined}
                    onPointerLeave={a.hold ? endHold : undefined}
                    onPointerCancel={a.hold ? endHold : undefined}
                    className="relative flex h-[52px] items-center gap-2 overflow-hidden rounded-2xl px-2.5 text-left transition-transform duration-75 active:scale-[0.96]"
                    style={{
                      background: ready ? `linear-gradient(180deg,${a.color},${a.color}cc)` : "linear-gradient(180deg,#1c2a44,#152238)",
                      border: `1px solid ${ready ? "rgba(255,255,255,.32)" : "rgba(255,255,255,.07)"}`,
                      boxShadow: ready ? "inset 0 1px 0 rgba(255,255,255,.35), 0 4px 12px -6px rgba(0,0,0,.5)" : "inset 0 1px 0 rgba(255,255,255,.05)",
                      color: ready ? "#071018" : "#6a7ea3",
                    }}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: ready ? "rgba(255,255,255,.28)" : "rgba(255,255,255,.05)" }}>
                      {cd > 0 ? <IconHourglass className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-bold leading-tight">{a.label}</span>
                      <span className="block truncate text-[10px] leading-tight opacity-85">
                        {cd > 0 ? `через ${cd} тик` : ready ? a.sub : reason ?? a.sub}
                      </span>
                    </span>
                    {a.cd > 0 && (
                      <span
                        className="absolute bottom-0 left-0 h-[3px] transition-[width] duration-300"
                        style={{ width: `${(cd / a.cd) * 100}%`, background: ready ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.2)" }}
                      />
                    )}
                    {a.hold && holding && (
                      <span className="absolute inset-0 rounded-2xl border-2 border-white/50 hold-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {section === "nodes" && (
          <div className="scroll-thin min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
            <div className={`flex items-center justify-between rounded-2xl px-3 py-2 ${plate}`}>
              <span className="text-[10px] font-bold tracking-[0.18em] text-mist-500">УЗЛЫ СЕТИ</span>
              <span className="flex items-center gap-1 font-mono text-[12px] font-bold text-gold">
                <IconCoin className="h-3.5 w-3.5" /> {fmt(state.credits)}
              </span>
            </div>
            {NODES.map((n) => {
              const Icon = NODE_ICON[n.id];
              const lvl = state.levels[n.id];
              const maxed = lvl >= n.max;
              const cost = costOf(n, lvl, params);
              const afford = state.credits >= cost && !maxed && !over;
              const gain =
                n.id === "relay"
                  ? `+${(0.9 * (1 + state.levels.infra * 0.12)).toFixed(2)} сиг/т`
                  : n.id === "pool"
                    ? `+${(1.7 * (1 + state.levels.infra * 0.12) * 1.15).toFixed(2)} кр/т`
                    : n.id === "infra"
                      ? `×${(1 + (lvl + 1) * 0.12).toFixed(2)} ко всем`
                      : `+0.62 дов/т`;
              return (
                <button
                  key={n.id}
                  onPointerDown={() => (afford ? onBuy(n.id) : onSfx("deny"))}
                  className={`w-full rounded-2xl p-2.5 text-left transition-transform duration-75 active:scale-[0.98] ${plate}`}
                  style={{ outline: afford ? `1px solid ${n.hue}99` : undefined, opacity: maxed ? 0.7 : 1 }}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border"
                      style={{
                        background: `linear-gradient(180deg,${n.hue}33,${n.hue}10)`,
                        borderColor: `${n.hue}66`,
                        color: n.hue,
                        boxShadow: state.pulse === n.id ? `0 0 16px ${n.hue}88` : "none",
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[13px] font-bold text-white">{n.name}</span>
                        <span className="ml-auto font-mono text-[10.5px] tabular-nums text-mist-400">
                          {lvl}/{n.max}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-snug text-mist-400">{n.desc}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex flex-1 gap-[3px]">
                          {Array.from({ length: n.max }).map((_, i) => (
                            <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i < lvl ? n.hue : "rgba(106,126,163,.2)" }} />
                          ))}
                        </div>
                        {!maxed && (
                          <span className="shrink-0 text-[10px] font-bold" style={{ color: n.hue }}>
                            {gain}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className="flex h-11 min-w-[62px] shrink-0 flex-col items-center justify-center rounded-xl px-2 font-mono text-[12px] font-bold"
                      style={{ background: afford ? n.hue : "rgba(106,126,163,.12)", color: afford ? "#071018" : "#6a7ea3" }}
                    >
                      {maxed ? (
                        <IconCheck className="h-4 w-4" />
                      ) : (
                        <>
                          <span className="flex items-center gap-0.5">
                            {afford ? <IconArrowUp className="h-3 w-3" /> : <IconLock className="h-3 w-3" />}
                            {cost}
                          </span>
                          <span className="text-[8.5px] font-bold opacity-70">КРЕДИТОВ</span>
                        </>
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
            <div className={`rounded-2xl p-3 ${plate}`}>
              <p className="text-[11.5px] leading-snug text-mist-400">
                Узлы жрут доверие. Инфрасеть снижает расход, коммуна возвращает. Без баланса сеть схлопнется.
              </p>
            </div>
          </div>
        )}

        {section === "journal" && (
          <div className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl ${plate}`}>
            <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
              <span className="text-[10px] font-bold tracking-[0.18em] text-mist-500">ЖУРНАЛ СЕТИ</span>
              <span className="font-mono text-[10px] text-mist-500">{state.log.length} записей</span>
            </div>
            <FeedView state={state} />
          </div>
        )}

        {section === "more" && <MoreView state={state} params={params} r={r} tapsPerSec={tapsPerSec} gloss={visuals.gloss} />}
      </div>

      {/* НИЖНЯЯ НАВИГАЦИЯ */}
      <div className="relative z-10 px-3 pb-3 pt-1">
        <div className="nav-island flex items-stretch gap-0.5 rounded-[18px] p-1">
          {(
            [
              ["arena", "АРЕНА", IconNet],
              ["nodes", "УЗЛЫ", IconStack],
              ["journal", "ЖУРНАЛ", IconJournal],
              ["more", "ЕЩЁ", IconDots],
            ] as const
          ).map(([id, label, Icon]) => {
            const on = section === id;
            return (
              <button
                key={id}
                onPointerDown={() => { onSfx("unlock"); setSection(id); }}
                className="relative flex flex-1 flex-col items-center gap-0.5 rounded-[14px] py-1.5 transition-transform duration-75 active:scale-95"
                style={{ background: on ? "var(--accent-soft)" : "transparent", color: on ? "var(--accent)" : "#6a7ea3" }}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span className="text-[9px] font-bold tracking-wider">{label}</span>
                {id === "journal" && state.unread > 0 && section !== "journal" && (
                  <span className="absolute right-3 top-1 h-1.5 w-1.5 rounded-full bg-coral" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TOAST */}
      {state.toast && !over && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[74px] z-50 flex justify-center px-4">
          <div
            key={state.toast}
            className="toast-in max-w-[92%] rounded-2xl px-3 py-2 text-center text-[12px] font-semibold text-white"
            style={{
              background: "rgba(10,16,28,.94)",
              border: `1px solid ${TONE[state.toastTone]}66`,
              boxShadow: "0 10px 30px -10px rgba(0,0,0,.85)",
              backdropFilter: "blur(10px)",
            }}
          >
            {state.toast}
          </div>
        </div>
      )}

      {/* ШТОРКИ */}
      {sheet && !state.event && !over && (
        <div className="absolute inset-0 z-40 flex items-start justify-end bg-black/50 p-3 pt-14 backdrop-blur-[2px]" onPointerDown={() => setSheet(null)}>
          <div className={`pop-in w-[88%] rounded-2xl p-3 ${plate}`} onPointerDown={(e) => e.stopPropagation()}>
            {sheet === "bell" ? (
              <>
                <Caption>ПОСЛЕДНИЕ СОБЫТИЯ</Caption>
                <div className="mt-2 max-h-[46vh] space-y-1.5 overflow-y-auto">
                  {state.log.slice(0, 8).map((l) => (
                    <div key={l.id} className="flex items-start gap-2 rounded-xl bg-black/25 px-2 py-1.5">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: TONE[l.tone] }} />
                      <div className="min-w-0">
                        <span className="block text-[11.5px] leading-snug text-mist-300">{l.text}</span>
                        <span className="font-mono text-[9px] text-mist-500">
                          Д{l.day} · {l.time} · {l.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <Caption>СОСТОЯНИЕ ЗАБЕГА</Caption>
                <div className="mt-2 space-y-1.5 font-mono text-[11.5px] text-mist-400">
                  <Row k="Скорость" v={`${params.speed.toFixed(1)}×`} />
                  <Row k="Отдача тапа" v={tapsPerSec.toFixed(1)} />
                  <Row k="Комбо" v={`×${state.combo} · макс ${state.comboBest}`} />
                  <Row k="Криты" v={String(state.crits)} />
                  <Row k="Расход" v={`−${r.drain.toFixed(2)}/т`} />
                  <Row k="Множитель" v={`×${r.infraBoost.toFixed(2)}${state.boost ? " · ×2" : ""}`} />
                  <Row k="Тапов" v={String(state.taps)} />
                  <Row k="Цели" v={`${state.questsDone.length}/${QUESTS.length}`} />
                </div>
                <button
                  onPointerDown={onRestart}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[12.5px] font-bold text-ink-990 transition-transform duration-75 active:scale-95"
                  style={{ background: "var(--accent)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.35)" }}
                >
                  <IconRestart className="h-4 w-4" /> Начать заново
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* СОБЫТИЕ */}
      {state.event && !over && (
        <div className="absolute inset-0 z-40 flex items-end bg-black/62 p-3 backdrop-blur-[3px]">
          <div className={`pop-in w-full rounded-3xl p-3.5 ${plate}`}>
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-10 w-10 place-items-center rounded-2xl border"
                style={{ background: `${TONE[state.event.tone]}22`, borderColor: `${TONE[state.event.tone]}66`, color: TONE[state.event.tone] }}
              >
                <IconAlert className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold tracking-wide text-white">{state.event.title}</span>
                <span className="text-[10px] text-mist-500">Выбор останавливает тик</span>
              </div>
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-bold tracking-wider" style={{ background: TONE[state.event.tone], color: "#071018" }}>
                {state.event.tag}
              </span>
            </div>
            <p className="mt-3 text-[13px] leading-snug text-mist-300">{state.event.body}</p>
            <div className="mt-3.5 space-y-2">
              {state.event.options.map((o, i) => (
                <button
                  key={o.label}
                  onPointerDown={() => onResolve(i)}
                  className="flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-3 text-left transition-transform duration-75 active:scale-[0.97]"
                  style={{
                    background: `linear-gradient(180deg,${o.color},${o.color}c8)`,
                    border: "1px solid rgba(255,255,255,.28)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,.35)",
                    color: "#071018",
                  }}
                >
                  <span className="text-[13px] font-bold">{o.label}</span>
                  <span className="shrink-0 font-mono text-[10.5px] opacity-85">{o.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ФИНАЛ */}
      {over && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-ink-990/94 px-7 text-center backdrop-blur-sm">
          <div
            className="grid h-[72px] w-[72px] place-items-center rounded-3xl border"
            style={{
              background: state.status === "complete" ? "var(--accent-soft)" : "rgba(239,107,98,.16)",
              borderColor: state.status === "complete" ? "var(--accent-line)" : "rgba(239,107,98,.5)",
              color: state.status === "complete" ? "var(--accent)" : "#ef6b62",
            }}
          >
            {state.status === "complete" ? <IconCheck className="h-8 w-8" /> : <IconAlert className="h-8 w-8" />}
          </div>
          <div>
            <h3 className="text-[18px] font-bold tracking-wide text-white">
              {state.status === "complete" ? "ПРОТОКОЛ УСТОЯЛ" : "КОЛЛАПС СЕТИ"}
            </h3>
            <p className="mt-2 text-[12.5px] leading-snug text-mist-400">
              {state.status === "complete" ? `Цикл ${params.goalDays} дней пройден.` : `Доверие кончилось на дне ${state.day}.`}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <EndStat label="УР." value={String(state.level)} />
              <EndStat label="ЦЕЛИ" value={`${state.questsDone.length}/${QUESTS.length}`} />
              <EndStat label="КРИТЫ" value={String(state.crits)} />
              <EndStat label="ТАПЫ" value={String(state.taps)} />
              <EndStat label="КРЕД" value={fmt(state.credits)} />
              <EndStat label="КОМБО" value={`×${state.comboBest}`} />
            </div>
          </div>
          <button
            onPointerDown={onRestart}
            className="flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[13px] font-bold text-ink-990 transition-transform duration-75 active:scale-90"
            style={{ background: "var(--accent)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.4)" }}
          >
            <IconRestart className="h-4 w-4" /> Новый забег
          </button>
        </div>
      )}

      {paused && !over && !state.event && (
        <div className="pointer-events-none absolute bottom-[78px] left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/65 px-3 py-1 backdrop-blur-sm">
          <span className="blink font-mono text-[10px] tracking-widest text-gold">ПАУЗА</span>
        </div>
      )}

      {/* ПОВОРОТ */}
      {landscape && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-ink-990/96 px-6 text-center">
          <span style={{ color: "var(--accent)" }}>
            <IconRotate className="h-10 w-10" />
          </span>
          <p className="text-[14px] font-bold text-white">Поверни телефон вертикально</p>
          <p className="text-[12px] leading-snug text-mist-400">
            Интерфейс спроектирован под портрет 9:19.5. В горизонтали тап-зоны становятся недостижимыми.
          </p>
        </div>
      )}
    </div>
  );
}

/* ——— вьюхи ——— */

function NetView({
  state,
  pops,
  holding,
  comboMul,
  comboFill,
  onCore,
  onCoreEnd,
  onNode,
}: {
  state: GameState;
  pops: Pop[];
  holding: boolean;
  comboMul: number;
  comboFill: number;
  onCore: (e: React.PointerEvent<HTMLElement>) => void;
  onCoreEnd: () => void;
  onNode: () => void;
}) {
  const R = 46;
  const circ = 2 * Math.PI * R;
  return (
    <div className="relative h-full w-full">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {NODES.map((n) => (
          <line
            key={n.id}
            x1="50"
            y1="50"
            x2={n.pos.x}
            y2={n.pos.y}
            stroke={state.levels[n.id] > 0 ? n.hue : "#2b3f63"}
            strokeWidth="1.4"
            className={state.levels[n.id] > 0 ? "flow-line" : ""}
            opacity={state.levels[n.id] > 0 ? 0.9 : 0.35}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <button
        onPointerDown={onCore}
        onPointerUp={onCoreEnd}
        onPointerLeave={onCoreEnd}
        onPointerCancel={onCoreEnd}
        className="absolute left-1/2 top-1/2 grid h-[168px] w-[168px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-transform duration-75 active:scale-[0.94]"
        aria-label="Тап или удержание — сбор сигнала"
      >
        <svg viewBox="0 0 104 104" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="52" cy="52" r={R} fill="none" stroke="rgba(106,126,163,.22)" strokeWidth="3" />
          <circle
            cx="52"
            cy="52"
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            className="combo-ring"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - comboFill / 100)}
            opacity={state.combo > 0 ? 0.95 : 0.25}
          />
        </svg>
        <span className="ring-pulse absolute inset-6 rounded-full border-2" style={{ borderColor: "var(--accent)" }} />
        <span className={`absolute inset-8 rounded-full border border-dashed border-ink-700 ${holding ? "spin-slow" : ""}`} />
        <span
          className="absolute inset-9 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(255,255,255,.18) 0%, transparent 52%), radial-gradient(circle, var(--accent-soft) 0%, transparent 72%)",
          }}
        />
        <span className={`relative flex flex-col items-center ${holding ? "soft-glow" : ""}`} style={{ color: "var(--accent)" }}>
          <IconCore className="h-10 w-10" />
          <span className="mt-0.5 text-[10px] font-bold tracking-[0.2em] text-mist-400">
            {holding ? "ПОТОК" : "ТАП"}
          </span>
        </span>
        {state.combo > 0 && (
          <span
            className="absolute -bottom-1 flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-bold"
            style={{ background: "var(--accent)", color: "#071018" }}
          >
            <IconFlame className="h-3 w-3" /> ×{state.combo} · {comboMul.toFixed(2)}
          </span>
        )}
        {pops.map((p) => (
          <span
            key={p.id}
            className={`${p.crit ? "crit-pop" : "float-up"} absolute font-mono text-[14px] font-bold`}
            style={{ left: p.x, top: p.y, color: p.crit ? "#e0b145" : "var(--accent)", fontSize: p.crit ? 16 : 14 }}
          >
            {p.v}
          </span>
        ))}
      </button>

      {NODES.map((n) => {
        const Icon = NODE_ICON[n.id];
        const lvl = state.levels[n.id];
        const on = lvl > 0;
        return (
          <button
            key={n.id}
            onPointerDown={onNode}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 active:scale-90"
            style={{ left: `${n.pos.x}%`, top: `${n.pos.y}%` }}
            aria-label={n.name}
          >
            <span
              className="relative grid h-12 w-12 place-items-center rounded-2xl border"
              style={{
                background: on ? `linear-gradient(180deg,${n.hue}55,${n.hue}18)` : "linear-gradient(180deg,#1c2a44,#152238)",
                borderColor: on ? `${n.hue}aa` : "rgba(255,255,255,.08)",
                color: on ? n.hue : "#6a7ea3",
                boxShadow: state.pulse === n.id ? `0 0 18px ${n.hue}` : on ? `0 0 10px ${n.hue}33` : "none",
              }}
            >
              <Icon className="h-[22px] w-[22px]" />
              <span
                className="absolute -right-1 -top-1 grid h-[15px] min-w-[15px] place-items-center rounded-full px-0.5 font-mono text-[9px] font-bold"
                style={{ background: on ? n.hue : "#2b3f63", color: on ? "#071018" : "#8da0c0" }}
              >
                {lvl}
              </span>
            </span>
            <span className="mt-1 block text-center text-[9px] font-bold tracking-wider text-mist-400">{n.short}</span>
          </button>
        );
      })}
    </div>
  );
}

function FlowView({ state, r, tapsPerSec }: { state: GameState; r: ReturnType<typeof rates>; tapsPerSec: number }) {
  const rows = [
    { name: "СИГНАЛ", icon: <IconSignal className="h-3.5 w-3.5" />, value: state.signal, pct: Math.min(100, (state.signal / 90) * 100), delta: r.signalGain - r.convert, color: "#3ecf8e", detail: `+${r.signalGain.toFixed(1)} добыча · −${r.convert.toFixed(1)} конверсия` },
    { name: "КРЕДИТЫ", icon: <IconCoin className="h-3.5 w-3.5" />, value: state.credits, pct: Math.min(100, (state.credits / 400) * 100), delta: r.creditGain, color: "#e0b145", detail: `курс ${(1.1 + state.levels.pool * 0.12).toFixed(2)}` },
    { name: "ДОВЕРИЕ", icon: <IconTrust className="h-3.5 w-3.5" />, value: state.trust, pct: state.trust, delta: r.trustGain, color: trustColor(state.trust), detail: `расход −${r.drain.toFixed(2)}/т` },
  ];
  const h = state.history;
  const w = 300;
  const hh = 54;
  const line = (pick: (p: { trust: number; credits: number }) => number, max: number) =>
    h
      .map((p, i) => `${(i / Math.max(1, h.length - 1)) * w},${hh - Math.min(1, pick(p) / max) * hh}`)
      .join(" ");
  return (
    <div className="flex h-full flex-col gap-2 p-2.5">
      <div className="grid grid-cols-2 gap-1.5">
        <MiniStat label="ТАП/СЕК" value={tapsPerSec.toFixed(1)} color="var(--accent)" />
        <MiniStat label="КОМБО" value={`×${state.combo} (макс ${state.comboBest})`} color="#ef6b62" />
      </div>
      {rows.map((row) => (
        <div key={row.name}>
          <div className="flex items-center gap-1.5">
            <span style={{ color: row.color }}>{row.icon}</span>
            <span className="text-[10px] font-bold tracking-wider text-mist-400">{row.name}</span>
            <span className="ml-auto font-mono text-[14px] font-bold tabular-nums text-white">{fmt(row.value)}</span>
            <span className="w-12 text-right font-mono text-[10px] tabular-nums" style={{ color: row.delta >= 0 ? "#3ecf8e" : "#ef6b62" }}>
              {row.delta >= 0 ? "+" : ""}
              {row.delta.toFixed(2)}/т
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/45">
            <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${Math.max(3, row.pct)}%`, background: `linear-gradient(90deg,${row.color},${row.color}99)` }} />
          </div>
          <div className="mt-0.5 font-mono text-[9px] text-mist-500">{row.detail}</div>
        </div>
      ))}
      <div className="mt-auto rounded-xl bg-black/30 p-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold tracking-wider text-mist-500">ГРАФИК ЗАБЕГА</span>
          <span className="flex items-center gap-2 text-[9px]">
            <span className="flex items-center gap-1" style={{ color: "#2fd4c4" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-aqua" /> доверие
            </span>
            <span className="flex items-center gap-1" style={{ color: "#e0b145" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> кредиты
            </span>
          </span>
        </div>
        <svg viewBox={`0 0 ${w} ${hh}`} className="mt-1 h-[46px] w-full" preserveAspectRatio="none">
          <polyline points={line((p) => p.trust, 100)} fill="none" stroke="#2fd4c4" strokeWidth="1.6" />
          <polyline points={line((p) => p.credits, Math.max(60, state.peak.credits))} fill="none" stroke="#e0b145" strokeWidth="1.6" opacity="0.9" />
        </svg>
      </div>
    </div>
  );
}

function FeedView({ state, compact }: { state: GameState; compact?: boolean }) {
  return (
    <div className="scroll-thin h-full space-y-1.5 overflow-y-auto p-2">
      {state.log.slice(0, compact ? 12 : 48).map((l) => (
        <div key={l.id} className="flex items-center gap-2 rounded-xl px-2 py-1.5" style={{ background: "rgba(0,0,0,.28)", borderLeft: `3px solid ${TONE[l.tone]}` }}>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-medium leading-tight text-white">{l.text}</span>
            <span className="font-mono text-[9.5px] text-mist-500">
              Д{String(l.day).padStart(2, "0")} · {l.time}
            </span>
          </span>
          <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wider" style={{ background: `${TONE[l.tone]}28`, color: TONE[l.tone] }}>
            {l.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

function MoreView({ state, params, r, tapsPerSec, gloss }: { state: GameState; params: Params; r: ReturnType<typeof rates>; tapsPerSec: number; gloss: boolean }) {
  const plate = gloss ? "plate" : "plate-flat";
  return (
    <div className="scroll-thin min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
      <div className={`rounded-2xl p-3 ${plate}`}>
        <Caption>СТАТИСТИКА ЗАБЕГА</Caption>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <Tile2 label="ДЕНЬ" value={`${state.day}`} />
          <Tile2 label="УРОВЕНЬ" value={String(state.level)} />
          <Tile2 label="ЦЕЛИ" value={`${state.questsDone.length}/${QUESTS.length}`} />
          <Tile2 label="ТАПЫ" value={String(state.taps)} />
          <Tile2 label="КРИТЫ" value={String(state.crits)} />
          <Tile2 label="КОМБО" value={`×${state.comboBest}`} />
          <Tile2 label="ПИК ДОВ" value={String(Math.floor(state.peak.trust))} />
          <Tile2 label="ПИК КРЕД" value={fmt(state.peak.credits)} />
          <Tile2 label="ПИК СИГ" value={fmt(state.peak.signal)} />
        </div>
      </div>
      <div className={`rounded-2xl p-3 ${plate}`}>
        <Caption>ЦЕПОЧКА ЦЕЛЕЙ</Caption>
        <div className="mt-2 space-y-1">
          {QUESTS.map((q, i) => {
            const done = i < state.quest;
            const current = i === state.quest;
            return (
              <div key={q.id} className="flex items-center gap-2 rounded-xl px-2 py-1.5" style={{ background: current ? "var(--accent-soft)" : "rgba(0,0,0,.25)" }}>
                <span style={{ color: done ? "#3ecf8e" : current ? "var(--accent)" : "#6a7ea3" }}>
                  {done ? <IconCheck className="h-3.5 w-3.5" /> : <IconTarget className="h-3.5 w-3.5" />}
                </span>
                <span className="min-w-0 flex-1 truncate text-[11px] font-medium" style={{ color: done ? "#8da0c0" : "#fff" }}>
                  {q.text}
                </span>
                <span className="shrink-0 font-mono text-[9.5px] text-mist-500">+{q.credits}кр</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className={`rounded-2xl p-3 ${plate}`}>
        <Caption>ЭКОНОМИКА</Caption>
        <div className="mt-2 space-y-1.5 font-mono text-[11.5px] text-mist-400">
          <Row k="Сигнал/тик" v={`+${r.signalGain.toFixed(2)}`} />
          <Row k="Конверсия/тик" v={r.convert.toFixed(2)} />
          <Row k="Кредиты/тик" v={`+${r.creditGain.toFixed(2)}`} />
          <Row k="Доверие/тик" v={`${r.trustGain >= 0 ? "+" : ""}${r.trustGain.toFixed(2)}`} />
          <Row k="Тап" v={tapsPerSec.toFixed(2)} />
          <Row k="Цель" v={`${params.goalDays} дней`} />
        </div>
      </div>
      <div className={`rounded-2xl p-3 ${plate}`}>
        <Caption>КАК ИГРАТЬ</Caption>
        <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-[11.5px] leading-snug text-mist-400">
          <li>Жми и удерживай ядро — сигнал течёт сам, копится комбо.</li>
          <li>Сливать сигнал в пул — по кнопке или через узлы.</li>
          <li>Качай узлы: реле, пул, инфра, коммуна.</li>
          <li>Следи за доверием: ноль — крах сети.</li>
          <li>Доживи до конца цикла и закрой все цели.</li>
        </ol>
      </div>
    </div>
  );
}

function Tile({
  plate,
  icon,
  color,
  label,
  value,
  rate,
  flash,
  bar,
  danger,
}: {
  plate: string;
  icon: React.ReactNode;
  color: string;
  label: string;
  value: string;
  rate: string;
  flash?: number;
  bar?: number;
  danger?: boolean;
}) {
  const cls = flash !== undefined && Math.abs(flash) > 0.05 ? (flash > 0 ? "flash-gain" : "flash-lose") : "";
  return (
    <div className={`rounded-xl px-2 py-1.5 ${plate} ${cls} ${danger ? "plate-danger danger-pulse" : ""}`}>
      <div className="flex items-center gap-1" style={{ color }}>
        {icon}
        <span className="text-[8.5px] font-bold tracking-wider text-mist-500">{label}</span>
      </div>
      <div className="mt-0.5 font-mono text-[15px] font-bold leading-none tabular-nums text-white">{value}</div>
      <div className="mt-0.5 truncate font-mono text-[9.5px] tabular-nums" style={{ color }}>
        {rate}
      </div>
      {bar !== undefined && (
        <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-black/45">
          <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${Math.max(2, bar)}%`, background: color }} />
        </div>
      )}
    </div>
  );
}

function ModuleCard({
  def,
  state,
  params,
  gloss,
  onBuy,
  onOpen,
}: {
  def: (typeof NODES)[number];
  state: GameState;
  params: Params;
  gloss: boolean;
  onBuy: () => void;
  onOpen: () => void;
}) {
  const Icon = NODE_ICON[def.id];
  const lvl = state.levels[def.id];
  const maxed = lvl >= def.max;
  const cost = costOf(def, lvl, params);
  const afford = state.credits >= cost && !maxed && state.status === "live";
  return (
    <button
      onPointerDown={() => (afford ? onBuy() : onOpen())}
      className={`relative flex flex-col items-center gap-1 overflow-hidden rounded-2xl px-1 pb-1.5 pt-2 transition-transform duration-75 active:scale-[0.94] ${gloss ? "plate" : "plate-flat"}`}
      style={{ outline: afford ? `1px solid ${def.hue}aa` : undefined }}
      aria-label={`${def.name}, уровень ${lvl} из ${def.max}`}
    >
      {maxed && (
        <span className="absolute right-1 top-1" style={{ color: def.hue }}>
          <IconStar className="h-3 w-3" />
        </span>
      )}
      <span
        className="grid h-10 w-10 place-items-center rounded-xl border"
        style={{
          background: lvl > 0 ? `linear-gradient(180deg,${def.hue}40,${def.hue}14)` : "rgba(255,255,255,.04)",
          borderColor: lvl > 0 ? `${def.hue}88` : "rgba(255,255,255,.08)",
          color: lvl > 0 ? def.hue : "#6a7ea3",
          boxShadow: state.pulse === def.id ? `0 0 14px ${def.hue}` : "none",
        }}
      >
        <Icon className="h-[19px] w-[19px]" />
      </span>
      <span className="text-[9.5px] font-bold tracking-wider text-white">{def.short}</span>
      <span className="font-mono text-[9px] text-mist-500">
        {lvl}/{def.max}
      </span>
      <span
        className="flex w-full items-center justify-center gap-0.5 rounded-lg py-[4px] font-mono text-[9.5px] font-bold"
        style={{ background: afford ? def.hue : "rgba(0,0,0,.35)", color: afford ? "#071018" : "#6a7ea3" }}
      >
        {maxed ? (
          "МАКС"
        ) : (
          <>
            {afford ? <IconArrowUp className="h-2.5 w-2.5" /> : <IconLock className="h-2.5 w-2.5" />}
            {cost}
          </>
        )}
      </span>
    </button>
  );
}

function TopBtn({ children, onPress, gloss, badge }: { children: React.ReactNode; onPress: () => void; gloss: boolean; badge?: number }) {
  return (
    <button
      onPointerDown={onPress}
      className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full text-mist-300 transition-transform duration-75 active:scale-90 ${gloss ? "plate" : "plate-flat"}`}
      aria-label="Кнопка"
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-coral px-0.5 text-[8.5px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

function IconTrophyIcon() {
  return (
    <span className="grid h-4 w-4 place-items-center" style={{ color: "#3ecf8e" }}>
      <IconStar className="h-4 w-4" />
    </span>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] font-bold tracking-[0.2em] text-mist-500">{children}</span>;
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span>{k}</span>
      <span className="font-bold tabular-nums text-white">{v}</span>
    </div>
  );
}
function Tile2({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/30 px-1.5 py-2 text-center">
      <div className="text-[8.5px] font-bold tracking-wider text-mist-500">{label}</div>
      <div className="font-mono text-[15px] font-bold leading-tight tabular-nums text-white">{value}</div>
    </div>
  );
}
function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl bg-black/30 px-2 py-1.5">
      <div className="text-[8.5px] font-bold tracking-wider text-mist-500">{label}</div>
      <div className="font-mono text-[12.5px] font-bold tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
function EndStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 px-2 py-2">
      <div className="text-[8.5px] font-bold tracking-wider text-mist-500">{label}</div>
      <div className="font-mono text-[15px] font-bold text-white">{value}</div>
    </div>
  );
}


