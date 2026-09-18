/* ============================================================================
   GAME RUNTIME — state machine, screen routing, transitions, Telegram shell.
   Responsive: width 100%, min-height 100dvh, safe-area insets, no horizontal
   scroll, no page-level vertical scroll on game screens (only explicit lists).
   ========================================================================== */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildSeries, SCENARIOS, DECISIONS, type DecisionId } from "./content";
import type { MotionPresetId, PageDef } from "./catalog";
import { cueOf, treatmentOf } from "./chart";
import { ScreenBackground } from "./art";
import { MarketRemark, Shell, type NavKey, type TopBarState } from "./frame";

/* Ремарки рынка (style-tone.txt): официальный тон, неприятный вывод. */
/* Ремарка показывается там, где она не дублирует kicker экрана и есть запас высоты. */
const REMARK: Record<string, string> = {
  p10: "Пробой без объёма. Объём молчит.",
  p12: "Регуляторы снова обеспокоены.",
  p14: "Ты называешь это сигналом. Проверим.",
  p15: "План не найден. Выбери его.",
  p18: "Кит проснулся. Завтрак подан.",
  p20: "Не привыкай. Система заметила.",
  p22: "Карты помнят. Ты — нет.",
  p25: "Сезон идёт. Ликвидность уходит.",
  p28: "Учись. Система всё равно голодна.",
  p30: "Ты ради денег. Значит, уже в опасности.",
};
import { sfx, haptic } from "./sfx";
import type { GameCtx, GameState, ScoreState } from "./state";
import {
  ArenaHub, ChartStage, Debrief, Decision, Event, Feed, Hand, Reveal, Reward, Score, Seal, Splash, StageDensity, Tutorial, Welcome, Rules,
} from "./screens-core";
import { FactsStage } from "./facts";
import {
  Academy, CardDetail, Collection, Duel, Leaderboard, Lesson, More, Notifications, Profile, Ritual, SeriesRecap, Settings, Tournaments,
} from "./screens-meta";

export interface GameProps {
  page: PageDef;
  variantId: string;
  motion: MotionPresetId;
  /** resolved slot → assetId for the current page (variant + inspector swaps) */
  assign: Record<string, string>;
  onNavigate: (pageId: string) => void;
  width: number;
  height: number;
  /** stage scale applied by the host (device frame) */
  zoom: number;
  /** live preview of the Asset Inspector values for the background slot */
  bgOverride?: { scale: number; x: number; y: number; opacity: number; tint: number; fit: "cover" | "contain" };
  /** parameters pushed from the studio sidebar (game state + Top Bar values) */
  params?: Partial<GameState>;
  /** bump the nonce to re-apply params (state presets, shortcuts) */
  paramsNonce?: number;
}

const NAV_TARGET: Record<NavKey, string> = { academy: "p28", arena: "p10", profile: "p30" };
/* game.html: обучение — это первые заходы на Арену, поэтому P04–P09 принадлежат разделу Арена */
const NAV_OF_PAGE: Record<string, NavKey> = {
  p02: "arena", p03: "arena", p04: "arena", p05: "arena", p06: "arena", p07: "arena", p08: "arena", p09: "arena",
  p10: "arena", p11: "arena", p12: "arena", p13: "arena", p14: "arena", p15: "arena", p16: "arena",
  p17: "arena", p18: "arena", p19: "arena", p20: "arena", p21: "arena", p34: "arena",
  p22: "academy", p23: "academy", p28: "academy", p29: "academy",
  p24: "profile", p25: "profile", p26: "profile", p27: "profile", p30: "profile", p31: "profile", p32: "profile", p33: "profile",
};
/* экраны после Seal: назад к решению нельзя */
const LOCKED_AFTER_SEAL = new Set(["p13", "p14", "p15", "p16"]);

const TUTORIAL_KEYS: Record<string, number> = { p04: 0, p05: 1, p06: 2, p07: 3, p08: 4, p09: 5 };

export const EMPTY_SCORE: ScoreState = {
  stars: 0, xp: 0, coins: 0, correct: false, matched: [], missed: [],
  process: { facts: 0, reasoning: 0, risk: 0, discipline: 0 },
};

/* MVP: новый игрок ничего не знает; демо-значения topbar.html не являются игровыми данными */
const initialState: GameState = {
  energy: 3, energyMax: 3, stars: 0, coins: 0, xp: 0, xpMax: 300, lvl: 1, streak: 0,
  scenarioIndex: 0, tutorialStep: 0, tutorialFeedback: null,
  picked: [], decision: null, reasons: [], invalidation: null, unknownTopic: false, locked: false, noAttempts: false,
  tutorialDone: false, loading: false, error: null,
  sealed: false, revealed: 0, scrubbing: false,
  zonePicked: false, pickState: "idle", showEvent: false, showExplain: false, scored: false,
  score: EMPTY_SCORE,
  history: [],
  lessonQuiz: null, lessonFeedback: null, notificationsRead: false,
  motion: "cinematic", reduced: false, sound: true, haptics: true, reportOpen: false, toast: null, levelUp: false,
};

/** Оценка процесса (MVP): факты → обоснование → риск → дисциплина. Результат — лишь один из факторов. */
function scoreProcess(st: GameState, correct: boolean, matched: string[]) {
  const facts = Math.min(1, (st.zonePicked ? 0.5 : 0) + Math.min(0.5, st.picked.length * 0.25));
  const reasoning = st.unknownTopic ? 0.75 : Math.min(1, st.reasons.length * 0.4 + matched.length * 0.2);
  const d = st.decision;
  const needsInv = d === "enter" || d === "sizeUp";
  const risk = d === "noTrade" || d === "retest" || d === "higherTF" ? 1 : st.invalidation ? 1 : 0.2;
  const discipline = d === "sizeUp" && !st.invalidation ? 0.2 : correct ? 1 : st.unknownTopic ? 0.8 : 0.55;
  const process = { facts, reasoning, risk: needsInv ? risk : 1, discipline };
  const total = (process.facts + process.reasoning + process.risk + process.discipline) / 4;
  return { process, total };
}

export function Game({ page, variantId, motion, assign, onNavigate, width, height, zoom, bgOverride, params, paramsNonce }: GameProps) {
  const [st, setSt] = useState<GameState>(initialState);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const series = useMemo(() => buildSeries(SCENARIOS[st.scenarioIndex]), [st.scenarioIndex]);
  const rafRef = useRef<number | null>(null);
  const [fx, setFx] = useState<string | null>(null);

  const update = useCallback((patch: Partial<GameState>) => setSt((prev) => ({ ...prev, ...patch })), []);

  /* ---- studio parameters: Top Bar values и состояния раунда приходят извне ---- */
  useEffect(() => {
    if (!params) return;
    setSt((prev) => ({ ...prev, ...params }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsNonce]);

  /* ---- density for compact WebView heights (keeps one-screen layouts) ---- */
  const density = StageDensity({ refEl: rootRef, zoom });

  /* ---- Telegram shell hooks ---- */
  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: Record<string, (...a: unknown[]) => void> } }).Telegram?.WebApp;
    try {
      tg?.expand?.();
      tg?.setHeaderColor?.("#0A1322");
      tg?.setBackgroundColor?.("#070E1A");
    } catch { /* web preview */ }
  }, []);

  useEffect(() => {
    sfx.setEnabled(st.sound);
  }, [st.sound]);

  const go = useCallback((pageId: string) => {
    /* MVP: после Seal нельзя вернуться к решению. Переход ВПЕРЁД (p17+) всегда разрешён. */
    setSt((p) => {
      if (p.locked && LOCKED_AFTER_SEAL.has(pageId)) {
        onNavigate(p.sealed ? "p17" : pageId);
        return { ...p, toast: p.sealed ? "Печать поставлена. Решение уже нельзя изменить." : p.toast };
      }
      onNavigate(pageId);
      return { ...p, reportOpen: false, toast: null, error: null };
    });
  }, [onNavigate]);

  /* ---- post-Seal fast-forward scrub: draws the real historical path ---- */
  const seal = useCallback(() => {
    if (st.locked || st.sealed) return; // после Seal решение изменить нельзя
    const s = SCENARIOS[st.scenarioIndex];
    /* NO_TRADE и WAIT — полноценные решения: NO_TRADE засчитывается, если верный ответ — ожидание */
    const ok = st.decision === s.correct || (st.decision === "noTrade" && (s.correct === "retest" || s.correct === "higherTF"));
    const matched = st.picked.filter((c) => s.cards.includes(c));
    const missed = s.cards.filter((c) => !st.picked.includes(c));
    const { process, total } = scoreProcess(st, ok, matched);
    /* звёзды — за процесс; результат добавляет максимум одну */
    const stars = Math.max(0, Math.min(3, Math.round(total * 2) + (ok ? 1 : 0)));
    const xp = Math.round(s.xp * (0.4 + total * 0.6) + (ok ? 30 : 0));
    const coins = Math.round(s.coins * (0.3 + total * 0.7));
    const totalXp = st.xp + xp;
    const levelUp = totalXp >= st.xpMax;
    setSt((p) => ({
      ...p,
      sealed: true, locked: true, scrubbing: true, revealed: 0, scored: true, levelUp,
      xp: levelUp ? totalXp - p.xpMax : totalXp,
      lvl: levelUp ? p.lvl + 1 : p.lvl,
      stars: p.stars + stars,
      coins: p.coins + coins,
      score: { stars, xp, coins, correct: ok, matched, missed, process },
      history: [...p.history, { scenarioId: s.id, stars, decision: p.decision, correct: ok, pct: s.movePct, processScore: total }],
    }));
    setFx(ok ? "hit" : "miss");
    setTimeout(() => setFx(null), 900);
    haptic("heavy");
    go("p17");
  }, [st.scenarioIndex, st.decision, st.picked, st.zonePicked, st.xp, st.xpMax, st.energy, st.stars, st.coins, st.lvl, go]);

  useEffect(() => {
    if (!st.sealed || !st.scrubbing) return;
    let last = performance.now();
    let acc = 0;
    const step = (now: number) => {
      acc += now - last;
      last = now;
      if (acc >= 90) {
        acc = 0;
        setSt((p) => {
          if (p.revealed >= series.post.length) return { ...p, scrubbing: false };
          return { ...p, revealed: p.revealed + 1 };
        });
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [st.sealed, st.scrubbing, series.post.length]);

  /* ---- actions ---- */
  const pickZone = useCallback((_y: number, ok: boolean) => {
    setSt((p) => ({ ...p, zonePicked: true, pickState: ok ? "hit" : "miss" }));
    if (ok) { sfx.win(); haptic("success"); } else { sfx.lose(); haptic("error"); }
  }, []);

  const toggleCard = useCallback((id: string) => {
    setSt((p) => {
      if (p.locked) return p;
      if (p.picked.includes(id)) return { ...p, picked: p.picked.filter((x) => x !== id) };
      if (p.picked.length >= 2) return { ...p, picked: [...p.picked.slice(1), id] };
      return { ...p, picked: [...p.picked, id] };
    });
  }, []);

  const choose = useCallback((d: DecisionId) => {
    setSt((p) => (p.locked ? p : { ...p, decision: d, invalidation: d === "noTrade" || d === "retest" || d === "higherTF" ? p.invalidation : p.invalidation }));
    sfx.pick();
  }, []);

  const toggleReason = useCallback((id: string) => {
    setSt((p) => {
      if (p.locked) return p;
      const has = p.reasons.includes(id);
      const reasons = has ? p.reasons.filter((r) => r !== id) : [...p.reasons, id];
      return { ...p, reasons, unknownTopic: reasons.includes("unknown") };
    });
    sfx.tick();
  }, []);

  const setInvalidation = useCallback((id: string | null) => {
    setSt((p) => (p.locked ? p : { ...p, invalidation: id }));
    sfx.tick();
  }, []);

  const startRound = useCallback((index: number) => {
    if (st.energy <= 0) {
      /* состояние NO ATTEMPTS: попытки закончились — показываем отдельный экран */
      setSt((p) => ({ ...p, noAttempts: true }));
      go("p10");
      return;
    }
    setSt((p) => ({
      ...p,
      scenarioIndex: index,
      picked: [], decision: null, reasons: [], invalidation: null, unknownTopic: false, locked: false, noAttempts: false,
      sealed: false, revealed: 0, scrubbing: false,
      zonePicked: false, pickState: "idle", showEvent: false, showExplain: false, scored: false,
      score: EMPTY_SCORE,
      energy: Math.max(0, p.energy - 1),
      levelUp: false, loading: true, error: null, toast: null,
    }));
    sfx.tick();
    window.setTimeout(() => {
      setSt((p) => ({ ...p, loading: false }));
      go("p11");
    }, 450);
  }, [go, st.energy]);

  const restartSeries = useCallback(() => {
    setSt((p) => ({ ...initialState, motion: p.motion, reduced: p.reduced, sound: p.sound, haptics: p.haptics, history: [], streak: p.streak }));
    go("p10");
  }, [go]);

  const ctx: GameCtx = {
    page, variantId, assign, motion, st, series, update, go,
    nav: (k) => {
      const inTutorial = TUTORIAL_KEYS[page.key] !== undefined && !st.tutorialDone;
      if (inTutorial && k !== "arena") {
        update({ toast: "Сначала закончи урок. Шаг виден сверху — 6 всего." });
        return;
      }
      go(NAV_TARGET[k]);
    },
    pickZone, toggleCard, choose, toggleReason, setInvalidation, seal, startRound, restartSeries,
    resetVariant: () => { /* wired by the host studio */ },
    zoom, density,
  };

  /* ---- screen routing ---- */
  const body = renderScreen(page, ctx);
  const isSplash = page.key === "p01";
  // Основное меню закреплено на всех страницах, кроме splash.
  const navKey: NavKey = NAV_OF_PAGE[page.key]
    ?? (page.section === "ОБУЧЕНИЕ" || page.section === "АРЕНА" || page.section === "ИТОГ" ? "arena" : page.section === "МЕТА" && page.key.startsWith("p2") && page.key <= "p23" ? "academy" : "profile");
  const top: TopBarState = {
    lvl: st.lvl, xp: st.xp, xpMax: st.xpMax, energy: st.energy, energyMax: st.energyMax,
    stars: st.stars, coins: st.coins,
    badge: st.notificationsRead ? null : 3,
    empty: page.key === "p02",
    showLevel: page.key === "p30",
    onBell: () => go("p32"),
    onGear: () => go("p31"),
  };

  return (
    <div
      ref={rootRef}
      className="app no-select"
      data-motion={motion}
      data-reduced={st.reduced ? "true" : "false"}
      data-page={page.id}
      data-variant={variantId}
      data-motion-preset={page.variants.find((v) => v.id === variantId)?.motion ?? motion}
      style={{ width, height, minHeight: 0, overflow: "hidden", position: "relative" }}
    >
      {isSplash ? (
        <div className="screen" data-screen>
          <ScreenBackground
            assetId={assign.background}
            style={{
              transform: `translate3d(${bgOverride?.x ?? 0}px, ${bgOverride?.y ?? 0}px, 0) scale(${bgOverride?.scale ?? 1})`,
              opacity: bgOverride?.opacity ?? 1,
              filter: `hue-rotate(${bgOverride?.tint ?? 0}deg)`,
            }}
          />
          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            <SplashStub ctx={ctx} />
          </div>
        </div>
      ) : (
        <Shell
          bg={assign.background}
          top={top}
          nav={{ active: navKey, onNav: ctx.nav }}
          bgPar={bgOverride?.fit === "contain" ? "xMidYMid meet" : "xMidYMid slice"}
          bgStyle={{
            transform: `translate3d(${bgOverride?.x ?? 0}px, ${bgOverride?.y ?? 0}px, 0) scale(${bgOverride?.scale ?? 1})`,
            opacity: bgOverride?.opacity ?? 1,
            filter: `hue-rotate(${bgOverride?.tint ?? 0}deg)`,
          }}
        >
          <div
            key={page.id + variantId}
            className="flex min-h-0 flex-1 flex-col gap-[var(--gap)]"
            style={{ animation: "sa-rise var(--t-med) var(--ease-out) both" }}
          >
            {REMARK[page.key] && !density.tiny && <MarketRemark>{REMARK[page.key]}</MarketRemark>}
            {body}
          </div>
        </Shell>
      )}
      {fx && (
        <span
          className="flash-layer"
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: fx === "hit" ? "radial-gradient(60% 40% at 50% 45%, rgba(62,207,142,.5), transparent 70%)"
              : "radial-gradient(60% 40% at 50% 45%, rgba(226,96,92,.45), transparent 70%)",
          }}
        />
      )}
    </div>
  );
}

/** splash wrapper: no Top Bar, no bottom nav (MVP exception for the заставка) */
function SplashStub({ ctx }: { ctx: GameCtx }) {
  return (
    <>
      <Splash ctx={ctx} />
    </>
  );
}

function renderScreen(page: PageDef, ctx: GameCtx) {
  const t = TUTORIAL_KEYS[page.key];
  if (t !== undefined) return <Tutorial ctx={ctx} stepIndex={t} />;
  switch (page.key) {
    case "p01": return null;
    case "p02": return <Welcome ctx={ctx} />;
    case "p03": return <Rules ctx={ctx} />;
    case "p10": return <ArenaHub ctx={ctx} />;
    case "p11": return <FactsStage ctx={ctx} />;
    case "p12": return <Feed ctx={ctx} />;
    case "p13": return <ChartStage ctx={ctx} />;
    case "p14": return <Hand ctx={ctx} />;
    case "p15": return <Decision ctx={ctx} />;
    case "p16": return <Seal ctx={ctx} />;
    case "p17": return <Reveal ctx={ctx} />;
    case "p18": return <Event ctx={ctx} />;
    case "p19": return <Debrief ctx={ctx} />;
    case "p20": return <Score ctx={ctx} />;
    case "p21": return <Reward ctx={ctx} />;
    case "p22": return <Collection ctx={ctx} />;
    case "p23": return <CardDetail ctx={ctx} />;
    case "p24": return <Ritual ctx={ctx} />;
    case "p25": return <Tournaments ctx={ctx} />;
    case "p26": return <Duel ctx={ctx} />;
    case "p27": return <Leaderboard ctx={ctx} />;
    case "p28": return <Academy ctx={ctx} />;
    case "p29": return <Lesson ctx={ctx} />;
    case "p30": return <Profile ctx={ctx} />;
    case "p31": return <Settings ctx={ctx} />;
    case "p32": return <Notifications ctx={ctx} />;
    case "p33": return <More ctx={ctx} />;
    case "p34": return <SeriesRecap ctx={ctx} />;
    default: return <ArenaHub ctx={ctx} />;
  }
}

/* small helper used by screens to know the round expectation */
export function expectedActionOf(index: number) {
  return SCENARIOS[index]?.correct ?? DECISIONS[0].id;
}

export function useChartHints(assign: Record<string, string>) {
  return { treatment: treatmentOf(assign.chart), cue: cueOf(assign.cue) };
}
