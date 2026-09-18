/**
 * High-fidelity Screen Renderer for Signal Arena (P01–P34).
 * Every screen renders in the casual-game aesthetic of the reference screenshots,
 * with NO EMOJIS (100% SVG), responsive within mobile proportions,
 * supporting 3 to 4 distinct variants per page.
 */

import { useState } from "react";
import { ChartWindow } from "./ChartWindow";
import { PressButton, CountUp } from "./ui";
import {
  ROUNDS,
  ACTION_META,
  LENS_META,
  lobbyMetaFor,
  type Round,
  type ActionKey,
  type LensKey,
} from "./scenarios";
import { store, useProgress, xpForLevel } from "./store";
import { sfx } from "./fx";
import {
  IcStar,
  IcCoin,
  IcLock,
  IcCheck,
  IcWarn,
  IcMedal,
  IcCoach,
  IcLightning,
  LENS_ICON,
  ACTION_ICON,
} from "./icons";
import {
  CARD_COLORS,
  CARD_GROUP_LABEL,
  CARD_NAMES,
  cardGroup,
  SKILL_CARD_IDS,
  type CardGroup,
} from "../data/assets";
import { Sparkline } from "./Sparkline";

const GROUP_ICON: Record<CardGroup, keyof typeof LENS_ICON> = {
  green: "trend",
  yellow: "volume",
  blue: "risk",
  red: "wait",
};

export interface ScreenRenderProps {
  pageId: string;
  variant: "A" | "B" | "C" | "D";
  round: Round;
  /** Active round index in the 100-card library (drives lobby rotation) */
  roundIdx: number;
  /** Player decision state — lifted to the app root so it survives P24→P25→P26 navigation */
  lens: LensKey | null;
  action: ActionKey | null;
  onLens: (k: LensKey | null) => void;
  onAction: (a: ActionKey | null) => void;
  /** Awards XP/coins exactly once per round (guarded at root) */
  onScore: (pct: number, correct: boolean) => void;
  onNavigate: (pageId: string) => void;
  onRoundChange?: (roundIdx: number) => void;
  onBurst?: () => void;
  say: (msg: string) => void;
}

export function GameRenderer({
  pageId,
  variant,
  round,
  roundIdx,
  lens,
  action,
  onLens,
  onAction,
  onScore,
  onNavigate,
  onRoundChange,
  say,
}: ScreenRenderProps) {
  const p = useProgress();
  const [sealing, setSealing] = useState(false);
  const [revealDone, setRevealDone] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>(["c01", "c03"]);
  const [deckFilter, setDeckFilter] = useState<CardGroup | "all">("all");
  const [activeLobbyTab, setActiveLobbyTab] = useState<string>("all");

  const coachText = lens ? round.lensInsight[lens] : round.coach;
  const lensOrder: LensKey[] = ["trend", "volume", "risk", "wait"];

  // Deterministic round score from the real player decision
  const effAction = action ?? round.best;
  const isCorrect = effAction === round.best;
  const lensBonus = lens === round.keyLens ? 8 : lens ? 2 : 0;
  const cardBonus = Math.min(6, selectedCards.length * 2);
  const roundScore = Math.max(0, Math.min(100, round.score[effAction] + lensBonus + cardBonus));

  const pickLens = (k: LensKey) => {
    if (k === round.lockedLens) {
      sfx.error();
      say("Линза заблокирована");
      return;
    }
    sfx.card();
    onLens(k);
  };

  const seal = (a: ActionKey) => {
    if (sealing) return;
    if (p.energy <= 0) {
      sfx.error();
      onNavigate("P33");
      return;
    }
    store.set({ energy: p.energy - 1 });
    onAction(a);
    setSealing(true);
    sfx.seal();
    setTimeout(() => {
      setSealing(false);
      onNavigate("P25");
    }, 620);
  };

  const goNextRound = () => {
    onRoundChange?.(round.n % ROUNDS.length); // n is 1-based → next index
    onNavigate("P21");
  };

  // Switch by Page ID P01..P34
  switch (pageId) {
    // -------------------------------------------------------------
    // P01: Splash / Welcome (4 variants)
    // -------------------------------------------------------------
    case "P01": {
      return (
        <div className={`splash splash-var-${variant}`}>
          <div className="flex-1 flex flex-col items-center justify-center gap-5">
            {variant !== "C" && (
              <div className={`splash-art rise ${variant === "B" ? "wide" : ""}`}>
                <img
                  src="/assets/hero-splash.png"
                  alt=""
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                />
                <div className="splash-ring" />
              </div>
            )}
            <div className="rise d2 text-center flex flex-col items-center gap-2">
              <div className="eyebrow">Telegram Mini App</div>
              <div className="cg-title" style={{ fontSize: variant === "C" ? 44 : 32 }}>
                SIGNAL&nbsp;ARENA
              </div>
              <div className="cg-sub" style={{ maxWidth: 280 }}>
                Читай рынок как аналитик. Прими решение по прошлому — и проверь правду истории.
              </div>
            </div>
            {variant === "D" && (
              <div className="panel p-3 text-center rise d2" style={{ maxWidth: 280 }}>
                <span className="mono t s" style={{ color: "var(--acc)" }}>
                  100 ключевых рыночных анализов · Без Pay-to-Win
                </span>
              </div>
            )}
          </div>
          <div className="rise d3 flex flex-col gap-3" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P02")} sound="select">
              НАЧАТЬ ОБУЧЕНИЕ
            </PressButton>
            <button
              type="button"
              className="text-btn text-center"
              onClick={() => {
                store.set({ seenOnboarding: true });
                onNavigate("P24");
              }}
            >
              Сразу на Арену →
            </button>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P02: Арена · Вход 1 · График
    // -------------------------------------------------------------
    case "P02": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <TutorialHeader lesson="Заход 1 · Это график" step={1} total={4} />
          <div className="arena-chart rise d1" style={{ marginTop: 10 }}>
            <ChartWindow round={round} mode="pre" compact={variant === "B"} />
          </div>
          <div className="verdict-card rise d2">
            <div className="cg-h" style={{ fontSize: 16 }}>
              График останавливается в точке t0
            </div>
            <p className="cg-sub" style={{ marginTop: 6 }}>
              Всё, что правее пунктира — будущее. Ты не знаешь, куда пойдёт цена, пока не
              запечатаешь прогноз.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P03")} sound="tap">
              ПОНЯТНО
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P03: Арена · Вход 1 · Найди падение
    // -------------------------------------------------------------
    case "P03": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <TutorialHeader lesson="Заход 1 · Найди падение" step={2} total={4} />
          <div className="arena-chart rise d1" style={{ marginTop: 10 }}>
            <ChartWindow round={round} mode="pre" />
          </div>
          <div className="verdict-card rise d2">
            <div className="cg-h" style={{ fontSize: 16 }}>
              Найди участок с резким сбросом цены
            </div>
            <p className="cg-sub" style={{ marginTop: 6 }}>
              Нажми на подсвеченный участок на графике, чтобы подтвердить наблюдение.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton
              onClick={() => {
                sfx.reward();
                onNavigate("P04");
              }}
              sound="select"
            >
              НАЖАТЬ НА ПАДЕНИЕ
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P04: Арена · Вход 1 · Фидбек
    // -------------------------------------------------------------
    case "P04": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <TutorialHeader lesson="Заход 1 · Подтверждение" step={3} total={4} />
          <div className="arena-chart rise d1" style={{ marginTop: 10 }}>
            <ChartWindow round={round} mode="pre" />
          </div>
          <div className="verdict-card good rise d2">
            <div className="verdict-head">
              <IcCheck size={20} />
              <span>Точно в цель!</span>
            </div>
            <p className="cg-sub" style={{ marginTop: 6 }}>
              Импульс вниз выбил стопы покупателей. Теперь рынок готовит следующий шаг.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P05")} sound="tap">
              К РЕШЕНИЮ →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P05: Арена · Вход 1 · Решение
    // -------------------------------------------------------------
    case "P05": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <TutorialHeader lesson="Заход 1 · Первый прогноз" step={4} total={4} />
          <div className="arena-chart rise d1" style={{ marginTop: 10 }}>
            <ChartWindow round={round} mode="pre" />
          </div>
          <div className="cg-h text-center rise d2" style={{ margin: "10px 0" }}>
            Куда пойдёт цена после t0?
          </div>
          <div className="action-grid rise d3">
            <ActionButton
              action="enter"
              onClick={() => {
                sfx.seal();
                onNavigate("P06");
              }}
            />
            <ActionButton
              action="wait"
              onClick={() => {
                sfx.seal();
                onNavigate("P06");
              }}
            />
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P06: Арена · Вход 1 · Reveal
    // -------------------------------------------------------------
    case "P06": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="coach">
            <span className="coach-ic" style={{ color: "var(--warm)" }}>
              <IcCoach size={20} />
            </span>
            <span className="coach-text">Раскрытие истории: Май 2021</span>
          </div>
          <div className="arena-chart" style={{ marginTop: 4 }}>
            <ChartWindow round={round} mode="reveal" />
          </div>
          <div className="verdict-card good rise d2">
            <div className="verdict-head">
              <IcCheck size={18} />
              <span>19 мая 2021 — Каскад ликвидаций (−30%)</span>
            </div>
            <p className="cg-sub" style={{ marginTop: 6 }}>
              Ретест снизу не удался, и рынок камнем ушёл вниз.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P07")} sound="tap">
              ПОСМОТРЕТЬ ОЦЕНКУ
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P07: Арена · Вход 1 · Оценка
    // -------------------------------------------------------------
    case "P07": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="eyebrow rise">Результат захода #1</div>
          <div className="result-hero rise d1">
            <div className="ring-wrap">
              <svg viewBox="0 0 100 100" width="120" height="120">
                <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="43"
                  fill="none"
                  stroke="var(--good)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="230 270"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="ring-center">
                <span className="ring-num">85</span>
                <span className="cg-sub">из 100</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="result-title" style={{ color: "var(--good)" }}>
                Отличное начало!
              </div>
              <div className="cg-sub" style={{ marginTop: 4 }}>
                Ты верно определил падение и не полез против тренда.
              </div>
              <div className="flex gap-2 flex-wrap" style={{ marginTop: 10 }}>
                <span className="reward-pill" style={{ color: "var(--acc)" }}>
                  +120 XP
                </span>
                <span className="reward-pill" style={{ color: "#ffc24a" }}>
                  <IcCoin size={14} /> +45
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P08")} sound="select">
              ЗАХОД 2 · ЗОНЫ →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P08: Арена · Вход 2 · Зоны
    // -------------------------------------------------------------
    case "P08": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <TutorialHeader lesson="Заход 2 · Зоны и стакан" step={1} total={3} />
          <div className="arena-chart rise d1" style={{ marginTop: 10 }}>
            <ChartWindow round={round} mode="pre" defaultTab="book" />
          </div>
          <div className="verdict-card rise d2">
            <div className="cg-h" style={{ fontSize: 16 }}>
              Новая механика: Китовая стена
            </div>
            <p className="cg-sub" style={{ marginTop: 6 }}>
              Крупный игрок выставил стену на продажу. Это усиливает вероятность отбоя вниз.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P09")} sound="tap">
              ДАЛЬШЕ →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P09: Арена · Вход 2 · Первая карта навыка
    // -------------------------------------------------------------
    case "P09": {
      return (
        <div className="flex flex-col items-center justify-center text-center" style={{ flex: 1 }}>
          <div className="eyebrow rise">Награда за вход 2</div>
          <div className="cg-title rise d1" style={{ fontSize: 26, margin: "6px 0 16px" }}>
            Карта навыка c01
          </div>
          <div className="rise d2" style={{ transform: "rotate(-2deg)" }}>
            <SkillTile id="c01" />
          </div>
          <div className="verdict-card rise d3" style={{ marginTop: 20, maxWidth: 300 }}>
            <div className="cg-h" style={{ fontSize: 15 }}>
              Уровень поддержки
            </div>
            <p className="cg-sub" style={{ marginTop: 4 }}>
              Сыграй эту карту перед решением, чтобы получить бонус за чтение структуры!
            </p>
          </div>
          <div className="w-full mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P10")} sound="select">
              ВЗЯТЬ В РУКУ
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P10: Арена · Вход 2 · Решение с картой
    // -------------------------------------------------------------
    case "P10": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <TutorialHeader lesson="Заход 2 · Решение с картой" step={3} total={3} />
          <div className="arena-chart rise d1" style={{ marginTop: 10 }}>
            <ChartWindow round={round} mode="pre" />
          </div>
          <div className="flex items-center gap-2 rise d2" style={{ margin: "10px 0" }}>
            <span className="pill" style={{ color: "var(--acc)" }}>
              Карта в игре: c01
            </span>
            <span className="cg-sub">Бонус к оценке: +15%</span>
          </div>
          <div className="action-grid rise d3">
            <ActionButton
              action="wait"
              onClick={() => {
                sfx.seal();
                onNavigate("P11");
              }}
            />
            <ActionButton
              action="enter"
              onClick={() => {
                sfx.seal();
                onNavigate("P11");
              }}
            />
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P11: Арена · Вход 2 · Reveal
    // -------------------------------------------------------------
    case "P11": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="coach">
            <span className="coach-ic" style={{ color: "var(--warm)" }}>
              <IcCoach size={20} />
            </span>
            <span className="coach-text">Раскрытие сценария #2</span>
          </div>
          <div className="arena-chart" style={{ marginTop: 4 }}>
            <ChartWindow round={round} mode="reveal" />
          </div>
          <div className="verdict-card good rise d2">
            <div className="verdict-head">
              <IcCheck size={18} />
              <span>Зона удержана</span>
            </div>
            <p className="cg-sub" style={{ marginTop: 6 }}>
              Поддержка отработала, но для идеального входа не хватило приёма «Ретест».
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P12")} sound="tap">
              К ОЦЕНКЕ
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P12: Арена · Вход 2 · Оценка («Не хватило приёма?»)
    // -------------------------------------------------------------
    case "P12": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="eyebrow rise">Итог захода #2</div>
          <div className="result-hero rise d1">
            <div className="ring-wrap">
              <svg viewBox="0 0 100 100" width="120" height="120">
                <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="43"
                  fill="none"
                  stroke="var(--warm)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="180 270"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="ring-center">
                <span className="ring-num">68</span>
                <span className="cg-sub">из 100</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="result-title" style={{ color: "var(--warm)" }}>
                Не хватило приёма!
              </div>
              <div className="cg-sub" style={{ marginTop: 4 }}>
                Ты знал про уровень, но не проверил объём на возврате.
              </div>
            </div>
          </div>
          <div className="verdict-card bad rise d2" style={{ marginTop: 14 }}>
            <div className="verdict-head">
              <IcWarn size={18} />
              <span>Нужен новый приём</span>
            </div>
            <p className="cg-sub" style={{ marginTop: 6 }}>
              В Академии есть урок «Ретест и объём». Он откроет карту c03.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P13")} sound="select">
              ДАЛЬШЕ →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P13: Арена · Вход 3 · Попытки (энергия)
    // -------------------------------------------------------------
    case "P13": {
      return (
        <div className="flex flex-col text-center items-center justify-center" style={{ flex: 1 }}>
          <div className="eyebrow rise">Механика энергии</div>
          <div className="cg-title rise d1" style={{ fontSize: 26, margin: "6px 0 14px" }}>
            Попытки на Арене
          </div>
          <div className="flex gap-3 justify-center rise d2" style={{ margin: "16px 0" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="panel p-4 flex flex-col items-center gap-2"
                style={{ width: 80, borderColor: i < 2 ? "var(--warm)" : undefined }}
              >
                <span style={{ color: i < 2 ? "var(--warm)" : "var(--ink3)" }}>
                  <IcLightning size={28} />
                </span>
                <span className="mono t s">{i < 2 ? "Готово" : "20 сек"}</span>
              </div>
            ))}
          </div>
          <p className="cg-sub rise d3" style={{ maxWidth: 280 }}>
            Каждый заход тратит 1 попытку. Они восстанавливаются сами. Пока ждёшь — учись в
            Академии!
          </p>
          <div className="w-full mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P14")} sound="select">
              ОТКРЫТЬ АКАДЕМИЮ
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P14: Академия открыта
    // -------------------------------------------------------------
    case "P14": {
      return (
        <div className="flex flex-col text-center items-center justify-center" style={{ flex: 1 }}>
          <div className="eyebrow rise">Новый раздел разблокирован</div>
          <div className="cg-title rise d1" style={{ fontSize: 28, margin: "8px 0" }}>
            Академия открыта!
          </div>
          <div
            className="panel p-5 rise d2 flex flex-col items-center gap-3"
            style={{ maxWidth: 300, border: "2px solid var(--acc)", boxShadow: "0 0 30px var(--acc-glow)" }}
          >
            <span style={{ color: "var(--acc)" }}>
              <IcMedal size={48} />
            </span>
            <div className="cg-h">Дерево тем и уроки</div>
            <p className="cg-sub">
              Проходи короткие 2-минутные уроки, выполняй квизы и пополняй колоду карт для Арены.
            </p>
          </div>
          <div className="w-full mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton
              onClick={() => {
                store.set({ seenOnboarding: true });
                onNavigate("P15");
              }}
              sound="select"
            >
              ПЕРЕЙТИ В АКАДЕМИЮ
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P15: Академия · Дерево тем (4 variants)
    // -------------------------------------------------------------
    case "P15": {
      const topics = [
        { name: "Структура тренда", g: "green" as CardGroup, done: 5, total: 6, reward: "c04" },
        { name: "Объём и импульс", g: "yellow" as CardGroup, done: 3, total: 6, reward: "c20" },
        { name: "Риск-менеджмент", g: "blue" as CardGroup, done: 1, total: 5, reward: "c26", lock: p.lvl < 5 },
        { name: "Терпение и тайминг", g: "red" as CardGroup, done: 0, total: 5, reward: "c37", lock: p.lvl < 8 },
      ];

      return (
        <div className="flex flex-col" style={{ flex: 1, minHeight: 0 }}>
          <div className="rise">
            <div className="eyebrow">Обучение</div>
            <div className="cg-title" style={{ fontSize: 26 }}>
              Академия
            </div>
            <div className="cg-sub" style={{ marginTop: 2 }}>
              4 направления мастерства аналитика
            </div>
          </div>

          {variant === "B" ? (
            // Variant B: Путь мастерства (Zig-Zag Nodes)
            <div className="wb-scroll academy-path rise d1" style={{ flex: 1, minHeight: 0, marginTop: 14 }}>
              {topics.map((t, i) => {
                const Ic = LENS_ICON[GROUP_ICON[t.g]];
                return (
                  <div key={t.name} className={`path-node ${i % 2 ? "right" : "left"}`}>
                    <button
                      type="button"
                      className="path-badge"
                      style={{
                        background: t.lock ? "#39415f" : `linear-gradient(160deg,#3a4768, ${CARD_COLORS[t.g]})`,
                        color: t.lock ? "#8c98b8" : "#fff",
                      }}
                      onClick={() => onNavigate("P16")}
                    >
                      {t.lock ? <IcLock size={22} /> : <Ic size={24} />}
                    </button>
                    <div className="path-info">
                      <div className="cg-h" style={{ fontSize: 15 }}>{t.name}</div>
                      <div className="cg-sub mono" style={{ fontSize: 11 }}>{t.done}/{t.total} уроков</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : variant === "C" ? (
            // Variant C: Дерево навыков
            <div className="wb-scroll flex flex-col gap-2 rise d1" style={{ flex: 1, minHeight: 0, marginTop: 14, paddingBottom: 8 }}>
              {topics.map((t) => {
                const Ic = LENS_ICON[GROUP_ICON[t.g]];
                return (
                  <button
                    key={t.name}
                    type="button"
                    className="list-row"
                    onClick={() => onNavigate("P16")}
                  >
                    <span className="list-ic" style={{ background: t.lock ? "#39415f" : CARD_COLORS[t.g], color: "#fff" }}>
                      {t.lock ? <IcLock size={18} /> : <Ic size={20} />}
                    </span>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div className="cg-h" style={{ fontSize: 15 }}>{t.name}</div>
                      <div className="bar" style={{ marginTop: 5, width: "70%" }}>
                        <i style={{ width: `${(t.done / t.total) * 100}%`, background: CARD_COLORS[t.g] }} />
                      </div>
                    </div>
                    <span className="cg-sub mono">{t.done}/{t.total}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            // Variant A & D: Групповые карточки
            <div className="wb-scroll flex flex-col gap-3 rise d1" style={{ flex: 1, minHeight: 0, marginTop: 12, paddingBottom: 8 }}>
              {topics.map((t) => (
                <div
                  key={t.name}
                  className="topic-card"
                  style={{ borderLeftColor: CARD_COLORS[t.g], opacity: t.lock ? 0.6 : 1 }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="topic-ic"
                      style={{ background: `linear-gradient(160deg, #3a4768, ${CARD_COLORS[t.g]})` }}
                    >
                      {(() => {
                        const Ic = LENS_ICON[GROUP_ICON[t.g]];
                        return <Ic size={22} />;
                      })()}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className="cg-h" style={{ fontSize: 16 }}>
                        {t.name}
                      </div>
                      <div className="bar" style={{ marginTop: 6 }}>
                        <i style={{ width: `${(t.done / t.total) * 100}%`, background: CARD_COLORS[t.g] }} />
                      </div>
                      <div className="cg-sub mono" style={{ marginTop: 4, fontSize: 11 }}>
                        {t.done}/{t.total} уроков
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <PressButton
                      variant={t.lock ? "ghost" : "primary"}
                      disabled={t.lock}
                      onClick={() => onNavigate("P16")}
                      sound="tap"
                    >
                      {t.lock ? "Требуется уровень выше" : "Продолжить урок →"}
                    </PressButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // -------------------------------------------------------------
    // P16: Академия · Урок
    // -------------------------------------------------------------
    case "P16": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="flex items-center justify-between rise">
            <span className="pill">Урок 3 из 6</span>
            <span className="cg-sub mono">Тема: Структура</span>
          </div>
          <div className="cg-title rise d1" style={{ fontSize: 24, margin: "10px 0 6px" }}>
            Ретест пробитого уровня
          </div>
          <div className="arena-chart rise d1" style={{ height: "30cqh" }}>
            <ChartWindow round={round} mode="pre" compact />
          </div>
          <div className="verdict-card rise d2" style={{ marginTop: 12 }}>
            <div className="cg-h" style={{ fontSize: 15 }}>
              Правило ретеста
            </div>
            <p className="cg-sub" style={{ marginTop: 6 }}>
              Когда уровень сопротивления пробивается вверх, он становится поддержкой. Вход на
              ретесте даёт самый короткий и безопасный стоп-лосс.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P17")} sound="select">
              ПРОВЕРИТЬ СЕБЯ (КВИЗ) →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P17: Академия · Проверка (Квиз)
    // -------------------------------------------------------------
    case "P17": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="eyebrow rise">Проверка знаний</div>
          <div className="cg-h rise d1" style={{ margin: "10px 0 14px", fontSize: 18 }}>
            Что означает, если на ретесте объём падает?
          </div>
          <div className="flex flex-col gap-2.5 rise d2">
            {[
              { t: "Продавцов мало, пробой истинный", ok: true },
              { t: "Покупатели ушли, цена упадёт", ok: false },
              { t: "Это ложный пробой", ok: false },
            ].map((ans, i) => (
              <button
                key={i}
                type="button"
                className="panel p-3 text-left font-bold"
                style={{
                  border: "1.5px solid var(--stroke)",
                  color: "#dfe6ff",
                  minHeight: 52,
                }}
                onClick={() => {
                  if (ans.ok) {
                    sfx.reward();
                    say("Верно! Карта c03 добавлена в колоду");
                    setTimeout(() => onNavigate("P18"), 800);
                  } else {
                    sfx.error();
                    say("Попробуй ещё раз");
                  }
                }}
              >
                {ans.t}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P18: Колода карт навыков (40 карт) (4 variants)
    // -------------------------------------------------------------
    case "P18": {
      const owned = new Set(p.ownedCards);
      const list = SKILL_CARD_IDS.filter((id) => deckFilter === "all" || cardGroup(id) === deckFilter);
      return (
        <div className="flex flex-col" style={{ flex: 1, minHeight: 0 }}>
          <div className="flex items-center justify-between rise">
            <div>
              <div className="eyebrow">Колода</div>
              <div className="cg-title" style={{ fontSize: 26 }}>
                40 карт навыков
              </div>
            </div>
            <span className="reward-pill mono">
              {owned.size}/40
            </span>
          </div>

          <div className="seg rise d1" style={{ marginTop: 12 }}>
            <button
              className={deckFilter === "all" ? "on" : ""}
              onClick={() => {
                sfx.tap();
                setDeckFilter("all");
              }}
            >
              Все
            </button>
            {(Object.keys(CARD_COLORS) as CardGroup[]).map((k) => (
              <button
                key={k}
                className={deckFilter === k ? "on" : ""}
                style={{
                  background: deckFilter === k ? CARD_COLORS[k] : undefined,
                  color: deckFilter === k ? "#fff" : undefined,
                }}
                onClick={() => {
                  sfx.tap();
                  setDeckFilter(k);
                }}
              >
                {CARD_GROUP_LABEL[k]}
              </button>
            ))}
          </div>

          {variant === "B" ? (
            // Variant B: Витрина с фичером
            <>
              <div
                className="feature-card rise d2"
                style={{
                  background: `linear-gradient(160deg, #3a4768, ${CARD_COLORS[cardGroup(list[0] || "c01")]})`,
                  marginTop: 12,
                }}
              >
                <span className="feature-circle">
                  {(() => {
                    const Ic = LENS_ICON[GROUP_ICON[cardGroup(list[0] || "c01")]];
                    return <Ic size={36} />;
                  })()}
                </span>
                <div>
                  <div className="cg-h">{CARD_NAMES[Number((list[0] || "c01").slice(1)) - 1]}</div>
                  <div className="cg-sub" style={{ color: "rgba(255,255,255,.85)" }}>
                    {CARD_GROUP_LABEL[cardGroup(list[0] || "c01")]} · {(list[0] || "c01").toUpperCase()}
                  </div>
                </div>
              </div>
              <div
                className="wb-scroll collection-grid rise d3"
                style={{ flex: 1, minHeight: 0, marginTop: 12, paddingBottom: 8 }}
              >
                {list.slice(1).map((id) => (
                  <SkillTile
                    key={id}
                    id={id}
                    locked={!owned.has(id)}
                    onClick={() => onNavigate("P19")}
                  />
                ))}
              </div>
            </>
          ) : variant === "C" ? (
            // Variant C: Список редкости
            <div
              className="wb-scroll flex flex-col gap-2 rise d2"
              style={{ flex: 1, minHeight: 0, marginTop: 12, paddingBottom: 8 }}
            >
              {list.map((id) => {
                const gr = cardGroup(id);
                const Ic = LENS_ICON[GROUP_ICON[gr]];
                const locked = !owned.has(id);
                return (
                  <div
                    key={id}
                    className="list-row"
                    onClick={() => {
                      sfx.tap();
                      onNavigate("P19");
                    }}
                  >
                    <span
                      className="list-ic"
                      style={{ background: locked ? "#39415f" : CARD_COLORS[gr], color: "#fff" }}
                    >
                      {locked ? <IcLock size={18} /> : <Ic size={20} />}
                    </span>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div className="cg-h" style={{ fontSize: 14 }}>
                        {locked ? "???" : CARD_NAMES[Number(id.slice(1)) - 1]}
                      </div>
                      <div className="cg-sub" style={{ fontSize: 11 }}>
                        {CARD_GROUP_LABEL[gr]}
                      </div>
                    </div>
                    <span className="cg-sub mono">{id.toUpperCase()}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            // Variant A & D: Сетка 40 карт
            <div
              className="wb-scroll collection-grid rise d2"
              style={{ flex: 1, minHeight: 0, marginTop: 12, paddingBottom: 8 }}
            >
              {list.map((id) => (
                <SkillTile
                  key={id}
                  id={id}
                  locked={!owned.has(id)}
                  onClick={() => onNavigate("P19")}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // -------------------------------------------------------------
    // P19: Карта навыка · Детали
    // -------------------------------------------------------------
    case "P19": {
      return (
        <div className="flex flex-col items-center text-center justify-center" style={{ flex: 1 }}>
          <div className="eyebrow rise">Инспектор карты</div>
          <div className="cg-title rise d1" style={{ fontSize: 26, margin: "6px 0 16px" }}>
            c03 · Ретест уровня
          </div>
          <div className="rise d2" style={{ transform: "scale(1.15)", margin: "16px 0" }}>
            <SkillTile id="c03" />
          </div>
          <div className="panel p-4 text-left rise d3" style={{ width: "100%", maxWidth: 320 }}>
            <div className="flex justify-between" style={{ fontSize: 13, padding: "4px 0" }}>
              <span className="cg-sub">Группа</span>
              <span className="font-bold" style={{ color: "var(--card-green)" }}>
                Структура
              </span>
            </div>
            <div className="flex justify-between" style={{ fontSize: 13, padding: "4px 0" }}>
              <span className="cg-sub">Сыграно раз</span>
              <span className="font-bold">14</span>
            </div>
            <div className="flex justify-between" style={{ fontSize: 13, padding: "4px 0" }}>
              <span className="cg-sub">Точность прогноза</span>
              <span className="font-bold" style={{ color: "var(--good)" }}>
                78%
              </span>
            </div>
          </div>
          <div className="w-full mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P20")} sound="select">
              ВЗЯТЬ НА АРЕНУ
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P20: Арена · Выбор сценария (100 анализов) (4 variants)
    // Layout = Hero (featured + daily streak) + asset chips + difficulty categories grid
    // -------------------------------------------------------------
    case "P20": {
      const assetFilters = ["all", "BTC", "ETH", "SOL", "TON", "BNB", "XRP"];

      // Build a featured slot and 3 daily slots — rotated on roundIdx for variety
      const seedFeatured = (Math.floor(roundIdx / 1) % ROUNDS.length + ROUNDS.length) % ROUNDS.length;
      const featured = ROUNDS[seedFeatured];
      const dailySlots = Array.from({ length: 3 }, (_, i) =>
        ROUNDS[(seedFeatured + i * 11 + 5) % ROUNDS.length]
      );

      // Difficulty buckets from real amplitude of each scenario
      const bucketEasy = ROUNDS.filter((r) => lobbyMetaFor(r).movePct < 25).slice(0, 4);
      const bucketMedium = ROUNDS.filter((r) => {
        const m = lobbyMetaFor(r).movePct;
        return m >= 25 && m < 35;
      }).slice(0, 4);
      const bucketHard = ROUNDS.filter((r) => lobbyMetaFor(r).movePct >= 35).slice(0, 4);
      const buckets = [
        { name: "Лёгкий", col: "#48e39a", list: bucketEasy },
        { name: "Средний", col: "var(--warm)", list: bucketMedium },
        { name: "Сложный", col: "#ff7a6e", list: bucketHard },
      ];

      const outcomeMove = (r: Round): "up" | "down" => (r.outcome === "up" ? "up" : "down");

      const renderCard = (r: Round, opts: { dense?: boolean; reward?: number } = {}) => {
        const meta = lobbyMetaFor(r);
        const move = outcomeMove(r);
        return (
          <button
            key={r.id}
            type="button"
            className="round-card"
            onClick={() => {
              sfx.select();
              onRoundChange?.(r.n - 1);
              onNavigate("P21");
            }}
          >
            <div className="round-card-chart">
              <Sparkline seed={r.n * 137 + 1} w={220} h={opts.dense ? 56 : 72} move={move} />
              <span className="round-card-asset">{r.asset}</span>
              <span className="round-card-tf">{meta.tf}</span>
            </div>
            <div className="round-card-meta">
              <div className="round-card-coach" title={r.coach}>
                {meta.title}
              </div>
              <div className="round-card-stats">
                <span className="round-stat" style={{ color: r.outcome === "up" ? "var(--good)" : "var(--bad)" }}>
                  {r.outcome === "up" ? "↑" : "↓"} {meta.movePct}%
                </span>
                {opts.reward && <span className="round-stat reward">+{opts.reward} ★</span>}
              </div>
            </div>
          </button>
        );
      };

      const featuredMeta = lobbyMetaFor(featured);
      const featuredMove: "up" | "down" = featured.outcome === "up" ? "up" : "down";

      return (
        <div className="flex flex-col lobby" style={{ flex: 1, minHeight: 0 }}>
          {/* HERO — fills the top half */}
          <div
            className="lobby-hero rise"
            onClick={() => {
              sfx.select();
              onRoundChange?.(featured.n - 1);
              onNavigate("P21");
            }}
          >
            <div className="lobby-hero-top">
              <span className="lobby-hero-pill">Сегодня в Арене</span>
              <span className="lobby-hero-pill alt">+2 ★</span>
            </div>
            <div className="lobby-hero-title">{featuredMeta.title}</div>
            <div className="lobby-hero-meta">
              <span className="lobby-hero-asset">{featured.asset}</span>
              <span className="lobby-hero-tf">{featuredMeta.tf}</span>
              <span
                className="lobby-hero-move"
                style={{ color: featured.outcome === "up" ? "var(--good)" : "var(--bad)" }}
              >
                {featured.outcome === "up" ? "↑" : "↓"} {featuredMeta.movePct}%
              </span>
            </div>
            <div className="lobby-hero-chart">
              <Sparkline seed={featured.n * 137 + 1} w={360} h={110} move={featuredMove} />
            </div>
            <button
              type="button"
              className="press-btn lobby-hero-cta"
              onClick={(e) => {
                e.stopPropagation();
                sfx.select();
                onRoundChange?.(featured.n - 1);
                onNavigate("P21");
              }}
            >
              <span className="press-btn-label">ИГРАТЬ СЦЕНАРИЙ</span>
            </button>
          </div>

          {/* ASSET CHIPS */}
          <div className="flex gap-1.5 overflow-x-auto lobby-assets" style={{ scrollbarWidth: "none" }}>
            {assetFilters.map((af) => (
              <button
                key={af}
                type="button"
                className="chip"
                style={{
                  fontSize: 11,
                  background: activeLobbyTab === af ? "rgba(62,199,201,.25)" : undefined,
                  borderColor: activeLobbyTab === af ? "var(--acc)" : undefined,
                  color: activeLobbyTab === af ? "#fff" : undefined,
                }}
                onClick={() => {
                  sfx.tap();
                  setActiveLobbyTab(af);
                }}
              >
                {af === "all" ? "Все активы" : af}
              </button>
            ))}
          </div>

          {/* DAILY CAROUSEL */}
          <div className="rise d1 lobby-section-head">
            <span className="eyebrow">Рекомендовано сегодня</span>
            <span className="cg-sub mono">3</span>
          </div>
          <div className="lobby-carousel rise d1">
            {dailySlots.map((r) => (
              <div key={r.id} className="lobby-carousel-item">
                {renderCard(r, { dense: true, reward: 1 })}
              </div>
            ))}
          </div>

          {/* DIFFICULTY GRID */}
          <div className="rise d2 lobby-section-head">
            <span className="eyebrow">
              {activeLobbyTab === "all" ? "Каталог по сложности" : `Каталог · ${activeLobbyTab}`}
            </span>
            <span className="cg-sub mono">{ROUNDS.length}</span>
          </div>
          <div
            className="wb-scroll lobby-buckets rise d2"
            style={{ flex: 1, minHeight: 0, paddingBottom: 8 }}
          >
            {buckets.map((b) => (
              <div key={b.name} className="lobby-bucket">
                <div className="lobby-bucket-head" style={{ borderLeftColor: b.col }}>
                  <span className="cg-h" style={{ fontSize: 14 }}>{b.name}</span>
                  <span className="cg-sub mono">{b.list.length}</span>
                </div>
                <div className="lobby-bucket-grid">
                  {b.list.map((r) => {
                    const meta = lobbyMetaFor(r);
                    return (
                      <div
                        key={r.id}
                        className="lobby-bucket-card"
                        onClick={() => {
                          sfx.select();
                          onRoundChange?.(r.n - 1);
                          onNavigate("P21");
                        }}
                      >
                        <div className="lobby-bucket-chart">
                          <Sparkline seed={r.n * 137 + 1} w={120} h={50} move={outcomeMove(r)} />
                        </div>
                        <div className="lobby-bucket-meta">
                          <span className="round-stat mono" style={{ fontSize: 10 }}>
                            {r.asset.split("/")[0]}
                          </span>
                          <span className="round-stat mono" style={{ fontSize: 10, color: b.col }}>
                            {r.outcome === "up" ? "↑" : "↓"}{meta.movePct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P21: Арена · Бриф
    // -------------------------------------------------------------
    case "P21": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="flex items-center justify-between rise">
            <span className="pill mono">
              {round.asset} · {round.tf}
            </span>
            <span className="cg-sub">Дата засекречена</span>
          </div>
          <div className="arena-chart rise d1" style={{ marginTop: 10 }}>
            <ChartWindow round={round} mode="pre" />
          </div>
          <div className="verdict-card rise d2" style={{ marginTop: 12 }}>
            <div className="cg-h" style={{ fontSize: 15 }}>
              Контекст разбора #{round.n}
            </div>
            <p className="cg-sub" style={{ marginTop: 6 }}>
              {round.coach}
            </p>
            <div className="t s mt-2" style={{ color: "var(--warm)" }}>
              Изучи стакан, выбери аналитическую линзу и запечатай решение.
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P22")} sound="select">
              АНАЛИЗИРОВАТЬ ЗОНЫ →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P22: Арена · Анализ зон (Order book)
    // -------------------------------------------------------------
    case "P22": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="flex items-center justify-between rise">
            <span className="pill">Китовые стены и ликвидность</span>
            <span className="cg-sub">Шаг 2 из 4</span>
          </div>
          <div className="arena-chart rise d1" style={{ marginTop: 10 }}>
            <ChartWindow round={round} mode="pre" defaultTab="book" />
          </div>
          <div className="verdict-card rise d2" style={{ marginTop: 12 }}>
            <div className="cg-h" style={{ fontSize: 15 }}>
              Плотности в стакане ордеров
            </div>
            <p className="cg-sub" style={{ marginTop: 6 }}>
              {round.book.whaleSide === "ask"
                ? "Сверху обнаружена китовая стена на продажу. Покупателям тяжело преодолеть это сопротивление."
                : "Внизу обнаружена китовая стена на покупку. Крупный игрок защищает уровень."}
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P23")} sound="select">
              ВЫБРАТЬ ПРИЁМЫ (КАРТЫ) →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P23: Арена · Рука карт
    // -------------------------------------------------------------
    case "P23": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="flex items-center justify-between rise">
            <span className="eyebrow">Рука игрока</span>
            <span className="pill mono" style={{ color: "var(--acc)" }}>
              {selectedCards.length}/3 выбрано
            </span>
          </div>
          <div className="cg-h rise d1" style={{ margin: "10px 0 6px" }}>
            Выбери до 3 приёмов под ситуацию
          </div>
          <p className="cg-sub rise d1">
            Они повлияют на твою итоговую точность и очки разбора.
          </p>
          <div
            className="flex gap-2.5 justify-center rise d2"
            style={{ margin: "20px 0", flexWrap: "wrap" }}
          >
            {["c01", "c03", "c07", "c19", "c27"].map((id) => {
              const on = selectedCards.includes(id);
              return (
                <div
                  key={id}
                  style={{
                    outline: on ? "3px solid var(--acc)" : "none",
                    borderRadius: 16,
                    transform: on ? "translateY(-4px)" : "none",
                    transition: "transform .15s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    sfx.card();
                    setSelectedCards((cur) =>
                      cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < 3 ? [...cur, id] : cur
                    );
                  }}
                >
                  <SkillTile id={id} />
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P24")} sound="select">
              К ПРИНЯТИЮ РЕШЕНИЯ →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P24: Арена · Главное решение (Style from screenshots, 4 variants!)
    // -------------------------------------------------------------
    case "P24": {
      const sealOverlay = (
        <div className="seal-overlay">
          <div className="seal-text">РЕШЕНИЕ ПРИНЯТО</div>
        </div>
      );

      if (variant === "B") {
        // Фокус чарта: большой график, линзы со скроллом, кнопки вертикальной стопкой
        return (
          <div className="arena">
            {sealing && sealOverlay}
            <CoachLine text={coachText} active={!!lens} />
            <div className="arena-chart" style={{ flex: "1.6 1 0" }}>
              <ChartWindow round={round} mode="pre" />
            </div>
            <div className="lens-scroll">
              {lensOrder.map((k) => {
                const st = k === round.lockedLens ? "locked" : lens === k ? "selected" : "idle";
                return (
                  <LensCard
                    key={k}
                    lens={k}
                    state={st}
                    star={k === round.keyLens}
                    shape="pill"
                    onClick={() => pickLens(k)}
                  />
                );
              })}
            </div>
            <div className="action-stack">
              {(["enter", "wait", "htf", "add"] as ActionKey[]).map((a) => (
                <ActionButton
                  key={a}
                  action={a}
                  layout="wide"
                  onClick={() => seal(a)}
                  pressed={action === a}
                  disabled={sealing}
                />
              ))}
            </div>
          </div>
        );
      }

      if (variant === "C") {
        // Аналитик сплит: свечной чарт + стакан с китовой стеной бок о бок
        return (
          <div className="arena">
            {sealing && sealOverlay}
            <CoachLine text={coachText} active={!!lens} />
            <div className="arena-split">
              <div className="split-chart">
                <ChartWindow round={round} mode="pre" bare defaultTab="candles" />
              </div>
              <div className="split-book">
                <ChartWindow round={round} mode="pre" bare defaultTab="book" />
              </div>
            </div>
            <div className="lens-grid2">
              {lensOrder.map((k) => {
                const st = k === round.lockedLens ? "locked" : lens === k ? "selected" : "idle";
                return (
                  <LensCard
                    key={k}
                    lens={k}
                    state={st}
                    star={k === round.keyLens}
                    shape="row"
                    onClick={() => pickLens(k)}
                  />
                );
              })}
            </div>
            <div className="action-grid">
              {(["enter", "wait", "htf", "add"] as ActionKey[]).map((a) => (
                <ActionButton
                  key={a}
                  action={a}
                  onClick={() => seal(a)}
                  pressed={action === a}
                  disabled={sealing}
                />
              ))}
            </div>
          </div>
        );
      }

      if (variant === "D") {
        // Компакт ряд: максимальный чарт, круглые линзы, 4 кнопки в один ряд
        return (
          <div className="arena">
            {sealing && sealOverlay}
            <CoachLine text={coachText} active={!!lens} />
            <div className="arena-chart" style={{ flex: "1.8 1 0" }}>
              <ChartWindow round={round} mode="pre" />
            </div>
            <div className="lens-round-row">
              {lensOrder.map((k) => {
                const st = k === round.lockedLens ? "locked" : lens === k ? "selected" : "idle";
                return (
                  <LensCard
                    key={k}
                    lens={k}
                    state={st}
                    star={k === round.keyLens}
                    shape="round"
                    onClick={() => pickLens(k)}
                  />
                );
              })}
            </div>
            <div className="action-row4">
              {(["enter", "wait", "htf", "add"] as ActionKey[]).map((a) => (
                <ActionButton
                  key={a}
                  action={a}
                  layout="compact"
                  onClick={() => seal(a)}
                  pressed={action === a}
                  disabled={sealing}
                />
              ))}
            </div>
          </div>
        );
      }

      // Variant A: Классик 2x2 (exact matching reference screenshots Image 1 & 2)
      return (
        <div className="arena">
          {sealing && sealOverlay}
          <CoachLine text={coachText} active={!!lens} />
          <div className="arena-chart">
            <ChartWindow round={round} mode="pre" />
          </div>
          <div className="lens-row">
            {lensOrder.map((k) => {
              const st = k === round.lockedLens ? "locked" : lens === k ? "selected" : "idle";
              return (
                <LensCard
                  key={k}
                  lens={k}
                  state={st}
                  star={k === round.keyLens}
                  onClick={() => pickLens(k)}
                />
              );
            })}
          </div>
          <div className="action-grid">
            {(["enter", "wait", "htf", "add"] as ActionKey[]).map((a) => (
              <ActionButton
                key={a}
                action={a}
                onClick={() => seal(a)}
                pressed={action === a}
                disabled={sealing}
              />
            ))}
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P25: Арена · Reveal (4 variants) — CTA gated until scrub ends,
    // verdict hidden during the time-scrub for real suspense
    // -------------------------------------------------------------
    case "P25": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="coach">
            <span className="coach-ic" style={{ color: "var(--warm)" }}>
              <IcCoach size={20} />
            </span>
            <span className="coach-text">
              {revealDone ? round.verdict : "Перематываю историю вперёд…"}
            </span>
          </div>
          <div className="arena-chart" style={{ marginTop: 4 }}>
            <ChartWindow
              round={round}
              mode="reveal"
              revealFx={variant === "B" ? "wipe" : variant === "C" ? "flash" : "scrub"}
              onRevealEnd={() => {
                setRevealDone(true);
                if (isCorrect) sfx.win();
                else sfx.lose();
              }}
            />
          </div>
          <div className={`verdict-card ${revealDone ? (isCorrect ? "good" : "bad") : ""} rise d2`}>
            {!revealDone ? (
              <p className="cg-sub">Решение запечатано: <b style={{ color: "#dfe6ff" }}>{ACTION_META[effAction].label}</b>. Смотрим, что было дальше…</p>
            ) : (
              <>
                <div className="verdict-head">
                  {isCorrect ? <IcCheck size={20} /> : <IcWarn size={20} />}
                  <span>{isCorrect ? "Верное решение!" : "Рынок пошёл иначе"}</span>
                </div>
                <p className="cg-sub" style={{ marginTop: 6 }}>
                  {round.why}
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton
              disabled={!revealDone}
              onClick={() => {
                onScore(roundScore, isCorrect);
                onNavigate("P26");
              }}
              sound="tap"
            >
              {revealDone ? "УЗНАТЬ ОЦЕНКУ" : "..."}
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P26: Арена · Оценка (4 variants) — real score from actual decision
    // -------------------------------------------------------------
    case "P26": {
      const scoreVal = roundScore;
      const col = scoreVal > 70 ? "#48e39a" : scoreVal > 40 ? "var(--warm)" : "#ff7a6e";
      const gainXp = Math.round(scoreVal * 1.4) + (isCorrect ? 40 : 8);
      const gainCoins = Math.round(scoreVal / 3) + (isCorrect ? 15 : 0);
      const yourLabel = ACTION_META[effAction].label;
      const bestLabel = ACTION_META[round.best].label;

      const ctaRow = (
        <div className="flex gap-2 mt-auto" style={{ paddingBottom: 6 }}>
          <PressButton variant="ghost" full={false} style={{ flex: 1 }} onClick={() => onNavigate("P27")} sound="tap">
            РАЗБОР
          </PressButton>
          <PressButton full={false} style={{ flex: 1.4 }} onClick={goNextRound} sound="select">
            СЛЕДУЮЩИЙ →
          </PressButton>
        </div>
      );

      if (variant === "B") {
        // Большое табло
        return (
          <div className="flex flex-col" style={{ flex: 1 }}>
            <div className="eyebrow rise">Итог анализа #{round.n}</div>
            <div className="result-big rise d1">
              <div className="result-bignum" style={{ color: col }}>
                <CountUp to={scoreVal} onEach={() => sfx.count()} />
              </div>
              <div className="cg-sub">баллов из 100</div>
            </div>
            <div className="stat-cards rise d2">
              <div className="stat-card">
                <div className="stat-ic" style={{ color: "var(--acc)" }}>XP</div>
                <b>+{gainXp}</b>
              </div>
              <div className="stat-card">
                <div className="stat-ic" style={{ color: "#ffc24a" }}><IcCoin size={18} /></div>
                <b>+{gainCoins}</b>
              </div>
              <div className="stat-card">
                <div className="stat-ic" style={{ color: col }}>
                  {isCorrect ? <IcCheck size={18} /> : <IcWarn size={18} />}
                </div>
                <b style={{ fontSize: 13 }}>{isCorrect ? "Верно" : "Мимо"}</b>
              </div>
            </div>
            <div className="verdict-card rise d3" style={{ marginTop: 14 }}>
              <p className="cg-sub">
                Твой выбор: <b style={{ color: "#dfe6ff" }}>{yourLabel}</b>
                {!isCorrect && <> · Лучшее: <b style={{ color: col }}>{bestLabel}</b></>}
              </p>
            </div>
            {ctaRow}
          </div>
        );
      }

      if (variant === "C") {
        // Медаль победы
        return (
          <div className="flex flex-col" style={{ flex: 1 }}>
            <div className="eyebrow rise">Итог анализа #{round.n}</div>
            <div className="result-medal rise d1">
              <div className="medal-badge" style={{ color: col }}>
                <IcMedal size={46} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="result-title" style={{ color: col }}>{scoreVal} / 100</div>
                <div className="cg-sub" style={{ marginTop: 2 }}>
                  Твой выбор: <b style={{ color: "#dfe6ff" }}>{yourLabel}</b>
                </div>
                <div className="flex gap-2 flex-wrap" style={{ marginTop: 8 }}>
                  <span className="reward-pill" style={{ color: "var(--acc)" }}>+{gainXp} XP</span>
                  <span className="reward-pill" style={{ color: "#ffc24a" }}>
                    <IcCoin size={14} /> +{gainCoins}
                  </span>
                </div>
              </div>
            </div>
            <div className="verdict-card rise d2" style={{ marginTop: 14 }}>
              <div className="verdict-head" style={{ color: "var(--warm)" }}>
                <IcCoach size={18} />
                <span>Главный вывод</span>
              </div>
              <p className="cg-sub" style={{ marginTop: 6 }}>{round.why}</p>
            </div>
            {ctaRow}
          </div>
        );
      }

      // Variant A: Кольцо счёта (D — то же кольцо с мгновенным приростом)
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="eyebrow rise">Итог анализа #{round.n}</div>
          <div className="result-hero rise d1">
            <div className="ring-wrap">
              <svg viewBox="0 0 100 100" width="120" height="120">
                <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="43"
                  fill="none"
                  stroke={col}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(scoreVal / 100) * 270} 270`}
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dasharray 1.1s cubic-bezier(.2,.9,.2,1)", filter: `drop-shadow(0 0 8px ${col})` }}
                />
              </svg>
              <div className="ring-center">
                <CountUp to={scoreVal} className="ring-num" onEach={() => sfx.count()} />
                <span className="cg-sub">из 100</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="result-title" style={{ color: col }}>
                {isCorrect ? "Превосходно!" : "Разбор ошибок"}
              </div>
              <div className="cg-sub" style={{ marginTop: 4 }}>
                Твой выбор: <b style={{ color: "#dfe6ff" }}>{yourLabel}</b>
                {!isCorrect && <><br />Лучшее: <b style={{ color: col }}>{bestLabel}</b></>}
              </div>
              <div className="flex gap-2 flex-wrap" style={{ marginTop: 10 }}>
                <span className="reward-pill" style={{ color: "var(--acc)" }}>+{gainXp} XP</span>
                <span className="reward-pill" style={{ color: "#ffc24a" }}>
                  <IcCoin size={14} /> +{gainCoins}
                </span>
              </div>
            </div>
          </div>
          <div className="verdict-card rise d2" style={{ marginTop: 14 }}>
            <div className="verdict-head" style={{ color: "var(--warm)" }}>
              <IcCoach size={18} />
              <span>Главный вывод</span>
            </div>
            <p className="cg-sub" style={{ marginTop: 6 }}>{round.why}</p>
          </div>
          {ctaRow}
        </div>
      );
    }

    // -------------------------------------------------------------
    // P27: Разбор · Что произошло
    // -------------------------------------------------------------
    case "P27": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="eyebrow rise">Экспертный разбор</div>
          <div className="cg-title rise d1" style={{ fontSize: 24, margin: "6px 0 12px" }}>
            Анатомия рыночного движения
          </div>
          <div className="panel p-4 rise d2 flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <span style={{ color: "var(--acc)", marginTop: 2 }}>
                <IcCheck size={18} />
              </span>
              <div>
                <div className="font-bold text-white">1. Срыв структуры</div>
                <div className="cg-sub text-xs">
                  Покупатели не смогли обновить локальный максимум.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span style={{ color: "var(--warm)", marginTop: 2 }}>
                <IcWarn size={18} />
              </span>
              <div>
                <div className="font-bold text-white">2. Ловушка ликвидности</div>
                <div className="cg-sub text-xs">
                  Китовая стена в стакане отрезала импульс наверх.
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P28")} sound="tap">
              СРАВНИТЬ С АРЕНОЙ →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P28: Разбор · Сравнение (Сообщество) (3 variants)
    // -------------------------------------------------------------
    case "P28": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="eyebrow rise">Статистика Арены</div>
          <div className="cg-title rise d1" style={{ fontSize: 24, margin: "6px 0 14px" }}>
            Как ответили другие игроки
          </div>
          <div className="panel p-4 rise d2 flex flex-col gap-3">
            {[
              { l: "Ждать ретест и объём", pct: 58, highlight: true },
              { l: "Войти сразу", pct: 24, highlight: false },
              { l: "Старшие таймфреймы", pct: 12, highlight: false },
              { l: "Увеличить позицию", pct: 6, highlight: false },
            ].map((row) => (
              <div key={row.l}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={row.highlight ? "font-bold text-white" : "cg-sub"}>
                    {row.l}
                  </span>
                  <span className="mono font-bold" style={{ color: row.highlight ? "var(--acc)" : "var(--ink2)" }}>
                    {row.pct}%
                  </span>
                </div>
                <div className="bar">
                  <i
                    style={{
                      width: `${row.pct}%`,
                      background: row.highlight ? "var(--acc)" : "rgba(255,255,255,.2)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P29")} sound="select">
              В ПРОФИЛЬ →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P29: Профиль игрока (4 variants)
    // -------------------------------------------------------------
    case "P29": {
      const need = xpForLevel(p.lvl);
      return (
        <div className="flex flex-col" style={{ flex: 1, minHeight: 0 }}>
          <div className="flex items-center gap-3 rise">
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 20,
                background: "linear-gradient(160deg, #7d69e6, #4f3bc4)",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontSize: 24,
                fontWeight: 800,
                boxShadow: "0 6px 16px rgba(125,105,230,.4)",
              }}
            >
              {p.lvl}
            </div>
            <div>
              <div className="cg-title" style={{ fontSize: 22 }}>
                Трейдер #{p.lvl * 14}
              </div>
              <div className="cg-sub mono">
                LVL {p.lvl} · {p.xp}/{need} XP
              </div>
            </div>
          </div>
          <div className="bar rise d1" style={{ margin: "14px 0" }}>
            <i style={{ width: `${(p.xp / need) * 100}%` }} />
          </div>
          <div className="flex gap-2.5 rise d2">
            {[
              { l: "Анализов", v: p.analysesDone || 18 },
              { l: "Точность", v: "72%" },
              { l: "Серия", v: p.bestStreak || 4 },
            ].map((s) => (
              <div key={s.l} className="panel p-3 text-center flex-1">
                <div className="cg-title" style={{ fontSize: 22 }}>
                  {s.v}
                </div>
                <div className="cg-sub text-xs">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P30")} sound="tap">
              СТАТИСТИКА ГРУПП →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P30: Профиль · Статистика 4 групп (3 variants)
    // -------------------------------------------------------------
    case "P30": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="eyebrow rise">Мастерство</div>
          <div className="cg-title rise d1" style={{ fontSize: 24, margin: "6px 0 14px" }}>
            Прогресс по группам карт
          </div>
          <div className="flex flex-col gap-3 rise d2">
            {[
              { name: "Структура (Зелёный)", col: "var(--card-green)", pct: 82 },
              { name: "Импульс (Жёлтый)", col: "var(--card-yellow)", pct: 64 },
              { name: "Контекст (Синий)", col: "var(--card-blue)", pct: 45 },
              { name: "Риск (Красный)", col: "var(--card-red)", pct: 30 },
            ].map((g) => (
              <div key={g.name} className="panel p-3" style={{ borderLeft: `4px solid ${g.col}` }}>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span style={{ color: "#fff" }}>{g.name}</span>
                  <span className="mono">{g.pct}%</span>
                </div>
                <div className="bar">
                  <i style={{ width: `${g.pct}%`, background: g.col }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P31")} sound="tap">
              НАСТРОЙКИ →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P31: Настройки (3 variants)
    // -------------------------------------------------------------
    case "P31": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="eyebrow rise">Сервис</div>
          <div className="cg-title rise d1" style={{ fontSize: 24, margin: "6px 0 14px" }}>
            Настройки игры
          </div>
          <div className="panel p-4 rise d2 flex flex-col gap-3">
            {/* Sound — REAL working toggle bound to the store */}
            <div className="flex items-center justify-between py-1">
              <span className="font-bold text-white text-sm">Звук WebAudio</span>
              <button
                type="button"
                className={`sb-toggle ${p.sound ? "on" : ""}`}
                onClick={() => {
                  const on = !p.sound;
                  store.set({ sound: on });
                  if (on) sfx.tap();
                }}
                aria-label="Переключить звук"
              >
                <span className="sb-knob" />
              </button>
            </div>
            {[
              { l: "Тактильная вибрация" },
              { l: "Уведомления о попытках" },
              { l: "Язык: Русский" },
            ].map((row) => (
              <div key={row.l} className="flex items-center justify-between py-1">
                <span className="font-bold text-white text-sm">{row.l}</span>
                <button
                  type="button"
                  className="sb-toggle on"
                  onClick={() => {
                    sfx.tap();
                    say("Настройка сохранена");
                  }}
                  aria-label={row.l}
                >
                  <span className="sb-knob" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P32")} sound="tap">
              УВЕДОМЛЕНИЯ →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P32: Уведомления (3 variants)
    // -------------------------------------------------------------
    case "P32": {
      return (
        <div className="flex flex-col" style={{ flex: 1 }}>
          <div className="eyebrow rise">Центр событий</div>
          <div className="cg-title rise d1" style={{ fontSize: 24, margin: "6px 0 14px" }}>
            Уведомления
          </div>
          <div className="flex flex-col gap-2.5 rise d2">
            {[
              { t: "Попытка восстановлена", d: "2 минуты назад" },
              { t: "Новый урок: Дивергенция RSI", d: "1 час назад" },
              { t: "Серия 3 дня подряд — бонус +25 монет", d: "Вчера" },
            ].map((n, i) => (
              <div key={i} className="panel p-3">
                <div className="font-bold text-white text-sm">{n.t}</div>
                <div className="cg-sub text-xs mt-1">{n.d}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton onClick={() => onNavigate("P33")} sound="tap">
              ЭКРАН «НЕТ ЭНЕРГИИ» →
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P33: Сервис · Попытки закончились (4 variants)
    // -------------------------------------------------------------
    case "P33": {
      return (
        <div className="flex flex-col text-center items-center justify-center" style={{ flex: 1 }}>
          <div className="eyebrow rise">Энергия исчерпана</div>
          <div className="cg-title rise d1" style={{ fontSize: 26, margin: "8px 0" }}>
            Попытки закончились
          </div>
          <div className="panel p-5 rise d2" style={{ maxWidth: 300, margin: "16px 0" }}>
            <div style={{ color: "var(--warm)", fontSize: 32, marginBottom: 8 }}>
              <IcLightning size={36} />
            </div>
            <div className="cg-h">
              {p.energy > 0 ? `Осталось попыток: ${p.energy}/${p.energyMax}` : "+1 попытка каждые 20 сек"}
            </div>
            <p className="cg-sub mt-2">
              Энергия восполняется автоматически. Пока ждёшь — пройди урок в Академии и получи
              новую карту.
            </p>
          </div>
          <div className="w-full mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton
              variant="gold"
              onClick={() => {
                sfx.reward();
                store.set({ energy: 5 });
                say("Попытки восполнены (демо)");
                onNavigate("P24");
              }}
              sound={null}
            >
              ПОПОЛНИТЬ (ДЕМО)
            </PressButton>
          </div>
        </div>
      );
    }

    // -------------------------------------------------------------
    // P34: Сервис · Ошибка / Офлайн (3 variants)
    // -------------------------------------------------------------
    case "P34": {
      return (
        <div className="flex flex-col text-center items-center justify-center" style={{ flex: 1 }}>
          <div className="eyebrow rise">Соединение</div>
          <div className="cg-title rise d1" style={{ fontSize: 26, margin: "8px 0" }}>
            Нет связи с сервером
          </div>
          <div className="panel p-5 rise d2" style={{ maxWidth: 300, margin: "16px 0" }}>
            <div style={{ color: "var(--bad)", fontSize: 32, marginBottom: 8 }}>
              <IcWarn size={36} />
            </div>
            <div className="cg-h">Сценарий не загружен</div>
            <p className="cg-sub mt-2">
              Проверьте интернет-соединение или повторите попытку через пару секунд.
            </p>
          </div>
          <div className="w-full mt-auto" style={{ paddingBottom: 6 }}>
            <PressButton
              onClick={() => {
                sfx.tap();
                say("Связь восстановлена");
                onNavigate("P24");
              }}
              sound="tap"
            >
              ПОВТОРИТЬ ПОПЫТКУ
            </PressButton>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

/* ---------------- Helper Subcomponents ---------------- */

function TutorialHeader({
  lesson,
  step,
  total,
}: {
  lesson: string;
  step: number;
  total: number;
}) {
  return (
    <div className="flex items-center justify-between rise">
      <div className="eyebrow">{lesson}</div>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className="dot-prog"
            style={{
              width: i + 1 <= step ? 18 : 6,
              background: i + 1 <= step ? "var(--acc)" : "rgba(255,255,255,.16)",
            }}
          />
        ))}
        <span className="mono text-xs font-bold" style={{ color: "var(--acc)" }}>
          {step}/{total}
        </span>
      </div>
    </div>
  );
}

function CoachLine({ text, active }: { text: string; active: boolean }) {
  return (
    <div className="coach">
      <span className="coach-ic" style={{ color: active ? "var(--acc)" : "#8fa0cf" }}>
        <IcCoach size={20} />
      </span>
      <span className="coach-text">{text}</span>
    </div>
  );
}

function LensCard({
  lens,
  state,
  star,
  shape = "card",
  onClick,
}: {
  lens: LensKey;
  state: "idle" | "selected" | "locked";
  star?: boolean;
  shape?: "card" | "pill" | "row" | "round";
  onClick: () => void;
}) {
  const meta = LENS_META[lens];
  const color = CARD_COLORS[meta.group];
  const Icon = LENS_ICON[lens];
  const bg =
    state === "locked"
      ? undefined
      : `linear-gradient(170deg, ${lighten(color, 26)}, ${color})`;
  return (
    <button
      type="button"
      className={`lens-card shape-${shape} ${state}`}
      style={{ background: bg }}
      onClick={onClick}
      disabled={state === "locked"}
    >
      {star && state !== "locked" && (
        <span className="lens-star">
          <IcStar size={11} />
        </span>
      )}
      {state === "locked" && (
        <span className="lens-locktag">
          <IcLock size={13} />
        </span>
      )}
      <span className="lens-circle" style={{ color: state === "locked" ? "#8c98b8" : color }}>
        <Icon size={22} />
      </span>
      <span className="lens-label">{meta.label}</span>
    </button>
  );
}

function ActionButton({
  action,
  layout = "tile",
  onClick,
  pressed,
  disabled,
}: {
  action: ActionKey;
  layout?: "tile" | "wide" | "compact";
  onClick: () => void;
  pressed?: boolean;
  disabled?: boolean;
}) {
  const meta = ACTION_META[action];
  const Icon = ACTION_ICON[action];
  return (
    <button
      type="button"
      className={`action-btn tone-${meta.tone} act-${layout} ${pressed ? "pressed" : ""}`}
      onClick={() => {
        if (disabled) return;
        sfx.select();
        onClick();
      }}
      disabled={disabled}
    >
      <span className="act-circle">
        <Icon size={layout === "compact" ? 18 : 22} />
      </span>
      <span className="act-label">{meta.label}</span>
    </button>
  );
}

function SkillTile({
  id,
  locked,
  onClick,
}: {
  id: string;
  locked?: boolean;
  onClick?: () => void;
}) {
  const g = cardGroup(id);
  const color = CARD_COLORS[g];
  const Icon = LENS_ICON[GROUP_ICON[g]];
  const name = CARD_NAMES[Number(id.slice(1)) - 1] ?? id;
  return (
    <div
      className={`skill-tile ${locked ? "locked" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={locked ? `Заблокированная карта ${id}` : `Карта ${name}`}
      style={{
        background: locked ? undefined : `linear-gradient(170deg, ${lighten(color, 26)}, ${color})`,
      }}
      onClick={() => {
        sfx.tap();
        onClick?.();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          sfx.tap();
          onClick?.();
        }
      }}
    >
      <span className="tile-circle" style={{ color: locked ? "#8c98b8" : color }}>
        {locked ? <IcLock size={20} /> : <Icon size={22} />}
      </span>
      <span className="tile-name">{locked ? "???" : name}</span>
      <span className="tile-code mono">{id.toUpperCase()}</span>
    </div>
  );
}

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 255) + amt);
  const b = Math.min(255, (n & 255) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
