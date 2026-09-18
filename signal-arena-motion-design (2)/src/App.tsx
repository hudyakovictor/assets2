import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FlowScreen, { PAGE_INVENTORY, type FlowApi, type PageId } from "./components/FlowScreens";
import Sidebar from "./components/Sidebar";
import GameScreen from "./components/GameScreen";
import {
  CASES,
  CARDS,
  TOPICS,
  buildCandles,
  rewardFromLesson,
  scoreRun,
  type Decision,
  type RunResult,
} from "./game/mvp";
import { DEFAULT_PARAMS, PRESETS, createGame, step, type GameState, type Params } from "./game/engine";
import { buzz, sfx } from "./game/audio";

const EMPTY_DECISION: Decision = {
  side: null,
  factsRead: 0,
  factsTotal: 4,
  reasons: [],
  own: "",
  invalidation: "",
  conviction: 0.3,
};

interface Persisted {
  results: Record<string, number>;
  cards: string[];
  doneLessons: string[];
  attempts: number;
  stars: number;
  coins: number;
  introSeen: boolean;
}

const STORE = "signal_arena_mvp_v1";

function loadPersisted(): Persisted {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) return { ...defaults(), ...(JSON.parse(raw) as Persisted) };
  } catch {
    /* ignore */
  }
  return defaults();
}
function defaults(): Persisted {
  return { results: {}, cards: [], doneLessons: [], attempts: 3, stars: 0, coins: 0, introSeen: false };
}

export default function App() {
  const store = useRef<Persisted>(loadPersisted());
  const [screen, setScreen] = useState<PageId>(() => (store.current.introSeen ? "P14" : "P01"));
  const [forced, setForced] = useState<PageId | null>(null);
  const [visited, setVisited] = useState<PageId[]>(["P01"]);
  const [results, setResults] = useState<Record<string, number>>(store.current.results);
  const [cards, setCards] = useState<string[]>(store.current.cards);
  const [doneLessons, setDoneLessons] = useState<string[]>(store.current.doneLessons);
  const [attempts, setAttempts] = useState(store.current.attempts);
  const [stars, setStars] = useState(store.current.stars);
  const [coins, setCoins] = useState(store.current.coins);
  const [caseIdx, setCaseIdx] = useState(0);
  const [decision, setDecisionState] = useState<Decision>(EMPTY_DECISION);
  const [markIndex, setMarkIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [scrub, setScrub] = useState(0);
  const [score, setScore] = useState<RunResult | null>(null);
  const [runIndex, setRunIndex] = useState(1);
  const [runStep, setRunStep] = useState(0);
  const [sealed, setSealed] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [sound, setSound] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [sandbox, setSandbox] = useState(false);
  const [device, setDevice] = useState("standard");
  const [fit, setFit] = useState(true);
  const [userScale, setUserScale] = useState(1);
  const [landscape, setLandscape] = useState(false);
  const [avail, setAvail] = useState({ w: 390, h: 760 });
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);
  const [preset, setPreset] = useState("standard");
  const [sim, setSim] = useState<GameState>(createGame);
  const [paused, setPaused] = useState(false);

  const caseDef = CASES[caseIdx % CASES.length];
  const sfxRef = useRef({ sound, haptics });
  sfxRef.current = { sound, haptics };

  useEffect(() => {
    try {
      localStorage.setItem(
        STORE,
        JSON.stringify({ results, cards, doneLessons, attempts, stars, coins, introSeen: true }),
      );
    } catch {
      /* ignore */
    }
  }, [results, cards, doneLessons, attempts, stars, coins]);

  useEffect(() => {
    if (!reduced && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setReduced(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("reduced", reduced);
  }, [reduced]);

  const ping = useCallback((kind: "tap" | "ok" | "bad" | "seal" | "reward") => {
    if (sfxRef.current.sound) {
      if (kind === "tap") sfx.tap();
      else if (kind === "ok") sfx.buy();
      else if (kind === "bad") sfx.deny();
      else if (kind === "seal") sfx.quest();
      else sfx.level();
    }
    if (sfxRef.current.haptics) {
      if (kind === "tap") buzz(8);
      else if (kind === "bad") buzz(40);
      else buzz([14, 26, 14]);
    }
  }, []);

  const go = useCallback((page: PageId) => {
    setScreen(page);
    setVisited((v) => (v.includes(page) ? v : [...v, page]));
  }, []);

  /* переход из инвентаря: состояния P29–P33 — это инжектор, а не страницы */
  const jumpTo = useCallback(
    (page: PageId) => {
      if (page === "P29" || page === "P30" || page === "P31" || page === "P32" || page === "P33") {
        setForced(page);
        return;
      }
      if (page === "P05" || page === "P06" || page === "P07" || page === "P08") {
        setRunIndex(1);
        setRunStep(parseInt(page.slice(2), 10) - 5);
      }
      if (page === "P12") {
        setRunIndex(2);
        setRunStep(0);
      }
      if (page === "P13") {
        setRunIndex(3);
        setRunStep(0);
      }
      setForced(null);
      go(page);
    },
    [go],
  );

  /* симулятор в песочнице */
  useEffect(() => {
    if (!sandbox || paused || sim.status !== "live" || sim.event) return;
    const t = setInterval(() => setSim((s) => step(s, params)), Math.max(200, 1000 / params.speed));
    return () => clearInterval(t);
  }, [sandbox, paused, sim.status, sim.event, params]);

  /* viewport */
  useEffect(() => {
    const measure = () => {
      const isDesktop = window.innerWidth >= 1024;
      setAvail(
        isDesktop
          ? { w: Math.min(430, window.innerWidth - 430), h: Math.min(window.innerHeight - 90, 900) }
          : { w: window.innerWidth - 24, h: window.innerHeight - 110 },
      );
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);
  const dev = { compact: { w: 360, h: 780 }, standard: { w: 390, h: 844 }, pixel: { w: 412, h: 915 } }[device] ?? { w: 390, h: 844 };
  const scale = fit ? Math.max(0.45, Math.min(1.6, Math.min(avail.w / dev.w, avail.h / dev.h))) : userScale;

  /* —— действия потока —— */
  const setDecision = useCallback((patch: Partial<Decision>) => {
    setDecisionState((d) => ({ ...d, ...patch }));
    setScreen((s) => s);
  }, []);

  const placeMark = useCallback(
    (i: number) => {
      const { past } = buildCandles(caseDef);
      const zoneFrom = past.length - 6;
      if (i < zoneFrom) {
        setFeedback("ПРОМАХ: точка решения ставится в подсвеченной зоне у правого края. Попробуй снова — штрафа нет.");
        setMarkIndex(null);
        ping("bad");
        return;
      }
      setMarkIndex(i);
      setFeedback("ТОЧКА РЕШЕНИЯ ЗАФИКСИРОВАНА. Дальше — факты и печать.");
      ping("ok");
    },
    [caseDef, ping],
  );

  const nextRunStep = useCallback(() => {
    setFeedback(null);
    setRunStep((s) => {
      const next = Math.min(3, s + 1);
      if (next === 3) setSealed(false);
      return next;
    });
    ping("tap");
  }, [ping]);

  const startCase = useCallback(
    (i: number) => {
      if (attempts <= 0) {
        setForced("P29");
        return;
      }
      setCaseIdx(i);
      setDecisionState(EMPTY_DECISION);
      setMarkIndex(null);
      setScrub(0);
      setScore(null);
      setSealed(false);
      setAttemptsUsed(0);
      setRunIndex(i + 1);
      setRunStep(3);
      go("P15");
      ping("tap");
    },
    [attempts, go, ping],
  );

  const seal = useCallback(() => {
    const result = scoreRun(caseDef, decision, Math.max(1, attemptsUsed));
    setScore(result);
    setSealed(true);
    setAttempts((a) => Math.max(0, a - 1));
    setStars((s) => Math.max(s, Object.values({ ...results, [caseDef.id]: result.total }).reduce((x, v) => x + (v >= 78 ? 3 : v >= 55 ? 2 : 1), 0)));
    setResults((r) => ({ ...r, [caseDef.id]: Math.max(r[caseDef.id] ?? 0, result.total) }));
    setCoins((c) => c + 20 + Math.round(result.total / 5));
    if (runIndex === 1) setDoneLessons((d) => (d.includes("l1") ? d : [...d, "l1"]));
    setScrub(0);
    setScreen(runIndex <= 1 ? "P09" : "P20");
    setVisited((v) => (v.includes(runIndex <= 1 ? "P09" : "P20") ? v : [...v, runIndex <= 1 ? "P09" : "P20"]));
    ping("seal");
  }, [caseDef, decision, attemptsUsed, results, runIndex, ping]);

  const setScrubV = useCallback((v: number) => setScrub(v), []);

  const finish = useCallback(() => {
    setScreen(runIndex <= 1 ? "P10" : "P22");
    setVisited((v) => {
      const p = runIndex <= 1 ? "P10" : "P22";
      return v.includes(p) ? v : [...v, p];
    });
  }, [runIndex]);

  const retry = useCallback(() => {
    setAttempts((a) => Math.max(1, a - 1));
    setAttemptsUsed((n) => n + 1);
    setDecisionState(EMPTY_DECISION);
    setMarkIndex(null);
    setScrub(0);
    setScore(null);
    setSealed(false);
    setFeedback(null);
    go("P15");
  }, [go]);

  const completeLesson = useCallback(
    (id: string) => {
      const lesson = TOPICS.flatMap((t) => t.lessons).find((l) => l.id === id);
      if (!lesson) return;
      setDoneLessons((d) => (d.includes(id) ? d : [...d, id]));
      const cardIdx = rewardFromLesson(lesson);
      const card = CARDS[cardIdx] ?? CARDS[0];
      setCards((c) => (c.includes(card.id) ? c : [...c, card.id]));
      setAttempts((a) => Math.min(9, a + 1));
      setCoins((c) => c + 15);
      ping("reward");
    },
    [ping],
  );

  const openCard = useCallback(
    (id: string) => {
      setSelectedCard(id);
      go("P27");
    },
    [go],
  );

  const api: FlowApi = useMemo(
    () => ({
      screen,
      attempts,
      attemptsMax: 9,
      stars,
      coins,
      unread: 0,
      results,
      cards,
      doneLessons,
      caseIdx,
      caseDef,
      decision,
      sealed,
      scrub,
      score,
      runIndex,
      runStep,
      markIndex,
      feedback,
      reduced,
      sound,
      haptics,
      forced,
      selectedCard,
      setDecision,
      go,
      nextRunStep,
      placeMark,
      seal,
      setScrub: setScrubV,
      finish,
      retry,
      startCase,
      completeLesson,
      openCard,
      clearForced: () => setForced(null),
      toggle: (k) => {
        if (k === "sound") setSound((s) => !s);
        else if (k === "haptics") setHaptics((h) => !h);
        else setReduced((r) => !r);
        ping("tap");
      },
    }),
    [
      screen, attempts, stars, coins, results, cards, doneLessons, caseIdx, caseDef, decision, sealed, scrub, score,
      runIndex, runStep, markIndex, feedback, reduced, sound, haptics, forced, selectedCard, setDecision, go,
      nextRunStep, placeMark, seal, setScrubV, finish, retry, startCase, completeLesson, openCard, ping,
    ],
  );

  /* шорткат: обязательные переходы P09/P20 и P10/P22 идут через finish/reveal */
  useEffect(() => {
    if (screen === "P20" && scrub >= CASES[caseIdx % CASES.length].futureBars) {
      // готово к оценке, но ждём явного тапа — без автоперехода
    }
  }, [screen, scrub, caseIdx]);

  const frameW = Math.round(dev.w * scale);
  const frameH = Math.round(dev.h * scale);

  return (
    <div className="min-h-screen w-full bg-ink-990 text-mist-300">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(90% 45% at 50% -10%, rgba(30,45,75,.75) 0%, transparent 58%), radial-gradient(50% 35% at 82% 102%, var(--accent-soft) 0%, transparent 70%)",
        }}
      />
      <main className="relative mx-auto flex min-h-screen w-full max-w-[1180px] flex-col-reverse items-center justify-center gap-5 px-3 py-5 sm:px-5 lg:flex-row lg:items-start lg:justify-center lg:gap-7">
        <div className="w-full max-w-[400px] shrink-0 lg:h-[min(92vh,900px)] lg:w-[356px]">
          <Sidebar
            screen={screen}
            forced={forced}
            visited={visited}
            onJump={jumpTo}
            onForce={(p) => setForced(p)}
            attempts={attempts}
            attemptsMax={9}
            setAttempts={setAttempts}
            stars={stars}
            coins={coins}
            casesDone={Object.keys(results).length}
            reduced={reduced}
            sound={sound}
            haptics={haptics}
            toggle={(k) => api.toggle(k)}
            device={device}
            setDevice={setDevice}
            scale={scale}
            setScale={(v) => {
              setFit(false);
              setUserScale(v);
            }}
            fit={fit}
            setFit={setFit}
            landscape={landscape}
            setLandscape={setLandscape}
            sandbox={sandbox}
            setSandbox={setSandbox}
            params={params}
            setParams={(patch) => {
              setPreset("custom");
              setParams((s) => ({ ...s, ...patch }));
            }}
            preset={preset}
            applyPreset={(k) => {
              setPreset(k);
              setParams((s) => ({ ...s, ...PRESETS[k].p }));
            }}
            paused={paused}
            togglePause={() => setPaused((p) => !p)}
            restart={() => {
              setSim(createGame(params));
              setPaused(false);
            }}
            sim={sim}
            resetProgress={() => {
              setResults({});
              setCards([]);
              setDoneLessons([]);
              setStars(0);
              setCoins(0);
              setAttempts(3);
              go("P14");
            }}
          />
          <div className="mt-2 rounded-xl border border-white/8 p-2">
            <p className="font-mono text-[9px] leading-snug text-mist-500">
              Проверка: {PAGE_INVENTORY.length} экранов в инвентаре · посещено {visited.length} · режим{" "}
              {sandbox ? "САНДБОКС" : "MVP-ПОТОК"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2 lg:sticky lg:top-5">
          <div className="relative" style={{ width: frameW, height: frameH }}>
            <div
              className="absolute left-0 top-0 origin-top-left overflow-hidden rounded-[26px]"
              style={{ width: dev.w, height: dev.h, transform: `scale(${scale})` }}
            >
              {sandbox ? (
                <GameScreen
                  state={sim}
                  params={params}
                  paused={paused}
                  visuals={{ grid: true, glow: true, gloss: true }}
                  landscape={landscape}
                  onAct={() => undefined}
                  onBuy={() => undefined}
                  onResolve={() => undefined}
                  onRestart={() => setSim(createGame(params))}
                  onClearToast={() => undefined}
                  onMarkRead={() => undefined}
                  onSfx={() => ping("tap")}
                />
              ) : (
                <FlowScreen {...api} />
              )}
            </div>
          </div>
          <span className="font-mono text-[9px] tracking-[0.2em] text-mist-500/70">
            {dev.w}×{dev.h} · МАСШТАБ {Math.round(scale * 100)}% · {sandbox ? "САНДБОКС" : "MVP-ПОТОК"} · {screen}
          </span>
        </div>
      </main>
      <div style={{ height: 1 }} aria-hidden />
      <span data-qa-landscape={landscape ? "on" : "off"} />
    </div>
  );
}
