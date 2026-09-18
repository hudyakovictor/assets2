import Chart from "./Chart";
import TopBar, { TopBarSkeleton } from "./TopBar";
import {
  IconAlert,
  IconArrowUp,
  IconBook,
  IconCard,
  IconCheck,
  IconCross,
  IconGear,
  IconHourglass,
  IconInfo,
  IconLock,
  IconNet,
  IconProfile,
  IconRestart,
  IconScrub,
  IconSeal,
  IconShield,
  IconSignal,
  IconSpinner,
  IconStar,
  IconTarget,
  IconTrophy,
} from "./Icons";
import {
  CARDS,
  CASES,
  SIDES,
  TOPICS,
  buildCandles,
  rewardFromLesson,
  scoreRun,
  type CaseDef,
  type Decision,
  type RunResult,
  type Side,
} from "../game/mvp";

export type PageId =
  | "P01" | "P02" | "P03" | "P04" | "P05" | "P06" | "P07" | "P08" | "P09" | "P10" | "P11" | "P12" | "P13"
  | "P14" | "P15" | "P16" | "P17" | "P18" | "P19" | "P20" | "P21" | "P22" | "P23" | "P24" | "P25" | "P26"
  | "P27" | "P28" | "P29" | "P30" | "P31" | "P32" | "P33" | "P34";

export interface InventoryRow {
  id: PageId;
  title: string;
  source: string;
  goal: string;
  states: string;
  cta: string;
  group: "first-run" | "arena" | "academy" | "profile" | "service";
}

export const PAGE_INVENTORY: InventoryRow[] = [
  { id: "P01", title: "Splash", source: "game.html", goal: "вход в продукт", states: "loading", cta: "НАЧАТЬ", group: "first-run" },
  { id: "P02", title: "Intro 1/3", source: "game.html", goal: "объяснить, что такое Арена", states: "default", cta: "ДАЛЬШЕ", group: "first-run" },
  { id: "P03", title: "Intro 2/3", source: "game.html", goal: "объяснить закрытое будущее", states: "default", cta: "ДАЛЬШЕ", group: "first-run" },
  { id: "P04", title: "Intro 3/3", source: "game.html", goal: "условия захода и дисклеймер", states: "default", cta: "В ПЕРВЫЙ ЗАХОД", group: "first-run" },
  { id: "P05", title: "Заход 1 · урок 1/4", source: "раскадровка, часть 1", goal: "где график и точка t0", states: "tutorial", cta: "ДАЛЬШЕ", group: "first-run" },
  { id: "P06", title: "Заход 1 · урок 2/4", source: "раскадровка, часть 1", goal: "первое действие в зоне", states: "correct / miss / retry", cta: "ДАЛЬШЕ", group: "first-run" },
  { id: "P07", title: "Заход 1 · урок 3/4", source: "раскадровка, часть 1", goal: "факты до решения", states: "empty facts / read", cta: "ДАЛЬШЕ", group: "first-run" },
  { id: "P08", title: "Заход 1 · урок 4/4", source: "раскадровка, часть 1", goal: "печать решения", states: "locked", cta: "ЗАПЕЧАТАТЬ", group: "first-run" },
  { id: "P09", title: "Reveal (первый)", source: "раскадровка, часть 1", goal: "показать историю и объяснение", states: "scrub", cta: "К ОЦЕНКЕ", group: "first-run" },
  { id: "P10", title: "Score", source: "раскадровка, часть 1", goal: "оценка процесса", states: "scored", cta: "РАЗБОР", group: "first-run" },
  { id: "P11", title: "Debrief", source: "раскадровка, часть 1", goal: "объяснить, чему учит кейс", states: "completed", cta: "В АКАДЕМИЮ", group: "first-run" },
  { id: "P12", title: "Заход 2 · урок WAIT", source: "раскадровка, часть 1", goal: "ждать как решение", states: "tutorial", cta: "К РЕШЕНИЮ", group: "arena" },
  { id: "P13", title: "Заход 3 · урок NO_TRADE", source: "раскадровка, часть 1", goal: "отказ и слом идеи", states: "tutorial", cta: "К РЕШЕНИЮ", group: "arena" },
  { id: "P14", title: "Хаб Арены", source: "раскадровка, часть 2", goal: "выбор кейса, попытки, звёзды", states: "no attempts / empty", cta: "ЗАХОД", group: "arena" },
  { id: "P15", title: "Арена · график", source: "раскадровка, часть 2", goal: "все зоны: график, факты, печать", states: "loading / unfamiliar", cta: "К РЕШЕНИЮ", group: "arena" },
  { id: "P16", title: "Решение", source: "раскадровка, часть 2", goal: "4 стороны: вверх/вниз/ждать/не входить", states: "disabled", cta: "ОБОСНОВАТЬ", group: "arena" },
  { id: "P17", title: "Обоснование", source: "требования MVP", goal: "обязательное объяснение выбора", states: "too short / ok", cta: "СЛОМ ИДЕИ", group: "arena" },
  { id: "P18", title: "Слом идеи", source: "требования MVP", goal: "invalidation до печати", states: "invalid", cta: "К ПЕЧАТИ", group: "arena" },
  { id: "P19", title: "Seal · подтверждение", source: "требования MVP", goal: "зафиксировать решение", states: "sealed", cta: "ЗАПЕЧАТАТЬ", group: "arena" },
  { id: "P20", title: "Reveal · протяжка", source: "требования MVP", goal: "fast-forward истории", states: "scrub running", cta: "КЛЮЧЕВОЕ СОБЫТИЕ", group: "arena" },
  { id: "P21", title: "Ключевое событие", source: "требования MVP", goal: "объяснить механику", states: "revealed", cta: "ОБЪЯСНЕНИЕ", group: "arena" },
  { id: "P22", title: "Score · разбивка", source: "требования MVP", goal: "процесс против исхода", states: "scored", cta: "РАЗБОР", group: "arena" },
  { id: "P23", title: "Debrief", source: "требования MVP", goal: "вывод и следующий шаг", states: "completed / retry", cta: "СЛЕДУЮЩИЙ КЕЙС", group: "arena" },
  { id: "P24", title: "Академия · дерево", source: "game.html, часть 2", goal: "темы, уроки, замки", states: "locked / unlocked / completed", cta: "УРОК", group: "academy" },
  { id: "P25", title: "Урок", source: "game.html, часть 2", goal: "одна механика, одна практика", states: "lesson", cta: "ПРАКТИКА", group: "academy" },
  { id: "P26", title: "Колода карт", source: "game.html, часть 2", goal: "навыки игрока", states: "empty / filled", cta: "КАРТА", group: "academy" },
  { id: "P27", title: "Карта навыка", source: "game.html, часть 2", goal: "деталь и источник получения", states: "card", cta: "К КОЛОДЕ", group: "academy" },
  { id: "P28", title: "Профиль", source: "game.html, часть 2", goal: "статистика процесса", states: "profile", cta: "АРЕНА", group: "profile" },
  { id: "P29", title: "Состояние: нет попыток", source: "serviced states", goal: "объяснить и дать выход", states: "no attempts", cta: "АКАДЕМИЯ", group: "service" },
  { id: "P30", title: "Состояние: Академия закрыта", source: "serviced states", goal: "условие открытия", states: "locked", cta: "НА АРЕНУ", group: "service" },
  { id: "P31", title: "Состояние: пусто", source: "serviced states", goal: "пустая тема или колода", states: "empty", cta: "ОБНОВИТЬ", group: "service" },
  { id: "P32", title: "Состояние: ошибка", source: "serviced states", goal: "retry без тупика", states: "error / retry", cta: "ПОВТОРИТЬ", group: "service" },
  { id: "P33", title: "Состояние: загрузка", source: "serviced states", goal: "честный лоадер", states: "loading", cta: "—", group: "service" },
  { id: "P34", title: "Настройки", source: "serviced states", goal: "звук, вибро, reduced motion", states: "settings", cta: "ЗАКРЫТЬ", group: "service" },
];

export interface FlowApi {
  screen: PageId;
  attempts: number;
  attemptsMax: number;
  stars: number;
  coins: number;
  unread: number;
  results: Record<string, number>;
  cards: string[];
  doneLessons: string[];
  caseIdx: number;
  caseDef: CaseDef;
  decision: Decision;
  sealed: boolean;
  scrub: number;
  score: RunResult | null;
  runIndex: number;
  runStep: number;
  markIndex: number | null;
  feedback: string | null;
  reduced: boolean;
  sound: boolean;
  haptics: boolean;
  forced: PageId | null;
  selectedCard: string | null;
  setDecision: (p: Partial<Decision>) => void;
  go: (p: PageId) => void;
  nextRunStep: () => void;
  placeMark: (i: number) => void;
  seal: () => void;
  setScrub: (v: number) => void;
  finish: () => void;
  retry: () => void;
  startCase: (i: number) => void;
  completeLesson: (id: string) => void;
  openCard: (id: string) => void;
  clearForced: () => void;
  toggle: (k: "sound" | "haptics" | "reduced") => void;
}

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : Math.floor(n).toString());

export default function FlowScreen(api: FlowApi) {
  if (api.forced) return <ForcedState api={api} />;

  switch (api.screen) {
    case "P01":
      return <Splash api={api} />;
    case "P02":
      return <Intro api={api} step={0} />;
    case "P03":
      return <Intro api={api} step={1} />;
    case "P04":
      return <Intro api={api} step={2} />;
    case "P05":
      return <TutorialStep api={api} run={1} step={0} />;
    case "P06":
      return <TutorialStep api={api} run={1} step={1} />;
    case "P07":
      return <TutorialStep api={api} run={1} step={2} />;
    case "P08":
      return <TutorialStep api={api} run={1} step={3} />;
    case "P12":
      return <TutorialStep api={api} run={2} step={0} />;
    case "P13":
      return <TutorialStep api={api} run={3} step={0} />;
    case "P09":
    case "P20":
      return <RevealScreen api={api} />;
    case "P10":
    case "P22":
      return <ScoreScreen api={api} />;
    case "P11":
    case "P23":
      return <Debrief api={api} />;
    case "P14":
      return <ArenaHub api={api} />;
    case "P15":
      return <ArenaChart api={api} />;
    case "P16":
      return <DecisionScreen api={api} />;
    case "P17":
      return <ReasoningScreen api={api} />;
    case "P18":
      return <InvalidationScreen api={api} />;
    case "P19":
      return <SealScreen api={api} />;
    case "P21":
      return <KeyEventScreen api={api} />;
    case "P24":
      return <AcademyScreen api={api} />;
    case "P25":
      return <LessonScreen api={api} />;
    case "P26":
      return <DeckScreen api={api} />;
    case "P27":
      return <CardScreen api={api} />;
    case "P28":
      return <ProfileScreen api={api} />;
    case "P34":
      return <SettingsScreen api={api} />;
    default:
      return <Splash api={api} />;
  }
}

export function current_page(api: FlowApi): PageId {
  return api.screen;
}

/* ——— оболочка: настоящий Top Bar + нижняя навигация ——— */
function Shell({
  api,
  children,
  activeNav,
  showTop = true,
}: {
  api: FlowApi;
  children: React.ReactNode;
  activeNav?: "АКАДЕМИЯ" | "АРЕНА" | "ПРОФИЛЬ";
  showTop?: boolean;
}) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-ink-950 text-mist-300 stage-bg select-none">
      {showTop && (
        <TopBar
          attempts={api.attempts}
          attemptsMax={api.attemptsMax}
          stars={api.stars}
          coins={api.coins}
          unread={api.unread}
          onBell={() => api.go("P28")}
          onGear={() => api.go("P34")}
          onAttempts={() => api.go("P29")}
          onStars={() => api.go("P26")}
        />
      )}
      <div className="scroll-thin relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-3 pt-2.5">{children}</div>
      <nav className="relative z-10 px-3 pb-3 pt-1">
        <div className="nav-island flex items-stretch gap-0.5 rounded-[18px] p-1">
          {(
            [
              ["АКАДЕМИЯ", "P24", IconBook],
              ["АРЕНА", "P14", IconNet],
              ["ПРОФИЛЬ", "P28", IconProfile],
            ] as const
          ).map(([label, page, Icon]) => {
            const on = activeNav === label;
            return (
              <button
                key={label}
                onPointerDown={() => api.go(page)}
                className="flex flex-1 flex-col items-center gap-0.5 rounded-[14px] py-1.5 transition-transform duration-75 active:scale-95"
                style={{ background: on ? "var(--accent-soft)" : "transparent", color: on ? "var(--accent)" : "#6a7ea3" }}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span className="text-[9px] font-bold tracking-wider">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl plate p-3 ${className}`}>{children}</div>;
}

function Primary({ label, onPress, disabled, icon }: { label: string; onPress: () => void; disabled?: boolean; icon?: React.ReactNode }) {
  return (
    <button
      onPointerDown={() => !disabled && onPress()}
      className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[13px] font-bold tracking-wide transition-transform duration-75 active:scale-[0.97]"
      style={{
        background: disabled ? "rgba(106,126,163,.16)" : "var(--accent)",
        color: disabled ? "#6a7ea3" : "#071018",
        boxShadow: disabled ? "none" : "inset 0 1px 0 rgba(255,255,255,.38)",
      }}
      aria-disabled={disabled}
    >
      {icon}
      {label}
    </button>
  );
}

function Ghost({ label, onPress, icon }: { label: string; onPress: () => void; icon?: React.ReactNode }) {
  return (
    <button
      onPointerDown={onPress}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 py-3 text-[12.5px] font-bold tracking-wide text-mist-400 transition-transform duration-75 active:scale-[0.97]"
    >
      {icon}
      {label}
    </button>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] font-bold tracking-[0.22em] text-mist-500">{children}</span>;
}

/* ——— P01 ——— */
function Splash({ api }: { api: FlowApi }) {
  return (
    <Shell api={api} showTop={false}>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-3xl border" style={{ borderColor: "var(--accent-line)", background: "var(--accent-soft)", color: "var(--accent)" }}>
          <IconSignal className="h-9 w-9" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold tracking-[0.18em] text-white">SIGNAL ARENA</h1>
          <p className="mt-2 max-w-[260px] text-[12px] leading-snug text-mist-400">
            Тренажёр решений. График закрыт печатью: сначала план, потом история.
          </p>
        </div>
        <div className="w-full max-w-[260px] space-y-2">
          <Primary label="НАЧАТЬ" onPress={() => api.go("P02")} icon={<IconArrowUp className="h-4 w-4" />} />
          <p className="text-[10px] leading-snug text-mist-500">
            Все кейсы вымышленные и учебные. Доходность не обещается нигде и никогда.
          </p>
        </div>
      </div>
    </Shell>
  );
}

/* ——— P02–P04: intro ——— */
function Intro({ api, step }: { api: FlowApi; step: number }) {
  const slides = [
    {
      title: "ЧТО ЭТО",
      lead: "Ты не угадываешь цену. Ты принимаешь решение и защищаешь его планом.",
      bullets: ["Один заход — один кейс", "Факты открываются до решения", "Будущее закрыто печатью"],
    },
    {
      title: "ПОЧЕМУ ПЕЧАТЬ",
      lead: "График заканчивается в точке t0. Дальше — только после печати решения.",
      bullets: ["Ребёнок не подглядывает вперёд", "Точка решения ставится на зоне t0", "История открывается протяжкой"],
    },
    {
      title: "ПРАВИЛА ЗАХОДА",
      lead: "Ждать и не входить — полноправные решения. Паника бесплатна, вход — нет.",
      bullets: [`Попыток на заход: ${api.attempts}/${api.attemptsMax}`, "Обоснование обязательно", "Оценивают процесс, а не только исход"],
    },
  ];
  const s = slides[step];
  const next: PageId = step === 0 ? "P03" : step === 1 ? "P04" : "P05";
  return (
    <Shell api={api}>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-2">
          <Kicker>ПЕРВЫЙ ЗАПУСК</Kicker>
          <span className="ml-auto font-mono text-[10px] text-mist-500">{step + 1}/3</span>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? "var(--accent)" : "rgba(106,126,163,.25)" }} />
          ))}
        </div>
        <Card className="flex flex-1 flex-col justify-center gap-3">
          <h2 className="text-[17px] font-bold tracking-wide text-white">{s.title}</h2>
          <p className="text-[13px] leading-snug text-mist-300">{s.lead}</p>
          <div className="space-y-2">
            {s.bullets.map((b) => (
              <div key={b} className="flex items-start gap-2">
                <span style={{ color: "var(--accent)" }}>
                  <IconCheck className="h-3.5 w-3.5" />
                </span>
                <span className="text-[12px] leading-snug text-mist-400">{b}</span>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-2">
          <Primary label={step === 2 ? "В ПЕРВЫЙ ЗАХОД" : "ДАЛЬШЕ"} onPress={() => api.go(next)} />
          {step > 0 && <Ghost label="НАЗАД" onPress={() => api.go(step === 2 ? "P03" : "P02")} />}
        </div>
      </div>
    </Shell>
  );
}

/* ——— P05–P08 + P12–P13: уроки внутри Арены ——— */
function TutorialStep({ api, run, step }: { api: FlowApi; run: number; step: number }) {
  const { past, future } = buildCandles(api.caseDef);
  const firstRun = run === 1;
  const open = step === 2;
  const factsOk = open && api.decision.factsRead >= api.decision.factsTotal;

  return (
    <Shell api={api} activeNav="АРЕНА">
      <div className="flex flex-1 flex-col gap-2.5">
        {/* шапка урока */}
        <Card className="!p-2.5">
          <div className="flex items-center gap-2">
            <span className="grid h-3.5 w-3.5 place-items-center">{firstRun ? <IconInfo className="h-3.5 w-3.5" /> : <IconShield className="h-3.5 w-3.5" />}</span>
            <Kicker>{firstRun ? "УРОК" : `ЗАХОД ${api.runIndex}`}</Kicker>
            <span className="ml-auto font-mono text-[10px] font-bold text-mist-400">{step + 1}/4</span>
          </div>
          <div className="mt-2 flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? "var(--accent)" : "rgba(106,126,163,.25)" }} />
            ))}
          </div>
          <h2 className="mt-2 text-[14.5px] font-bold leading-tight text-white">{lessonTitle(api, step)}</h2>
          <p className="mt-1 text-[11.5px] leading-snug text-mist-400">{lessonBody(api, step)}</p>
        </Card>

        {/* главный визуальный объект */}
        <div className="min-h-[168px] flex-1 overflow-hidden rounded-2xl plate-sunken p-1">
          <Chart
            past={past}
            future={future}
            mode="hidden"
            interactive={step === 1}
            zoneHighlight={step === 1}
            reduced={api.reduced}
            marker={api.markIndex != null ? { index: api.markIndex, side: "WAIT" } : null}
            caption={step === 1 ? "ЗОНА t0 — ЖМИ СЮДА" : api.caseDef.code}
            feedback={step === 1 ? api.feedback : null}
            onPick={(i) => api.placeMark(i)}
          />
        </div>

        {step === 2 && (
          <Card className="!p-2.5">
            <div className="flex items-center gap-2">
              <Kicker>ФАКТЫ ДО РЕШЕНИЯ</Kicker>
              <span className="ml-auto font-mono text-[10px] text-mist-500">
                {api.decision.factsRead}/{api.decision.factsTotal}
              </span>
            </div>
            <div className="mt-2 space-y-1.5">
              {api.caseDef.facts.slice(0, api.decision.factsRead).map((f) => (
                <div key={f.label} className="flex items-center gap-2 rounded-xl bg-black/25 px-2 py-1.5">
                  <span className="min-w-0 flex-1 truncate text-[11px] text-mist-300">{f.label}</span>
                  <span className="shrink-0 font-mono text-[10px] font-bold" style={{ color: f.tone === "warn" ? "#e0b145" : "#8da0c0" }}>
                    {f.value}
                  </span>
                </div>
              ))}
              {api.decision.factsRead === 0 && <p className="text-[11.5px] text-mist-500">Факты пока закрыты. Открой — без них решение будет ставкой.</p>}
            </div>
            {!factsOk && <Primary label="ОТКРЫТЬ ФАКТ" onPress={() => api.setDecision({ factsRead: api.decision.factsRead + 1 })} icon={<IconInfo className="h-4 w-4" />} />}
          </Card>
        )}

        {step === 3 && (
          <Card className="!p-2.5">
            <div className="flex items-center gap-2">
              <span style={{ color: "#e0b145" }}>
                <IconSeal className="h-4 w-4" />
              </span>
              <Kicker>ПЕЧАТЬ</Kicker>
            </div>
            <p className="mt-2 text-[11.5px] leading-snug text-mist-400">
              Печать закрывает решение и открывает историю. Подкрутить размер или сторону после печати нельзя — так и на рынке.
            </p>
          </Card>
        )}

        {step === 3 ? (
          <Primary label="ЗАПЕЧАТАТЬ И ОТКРЫТЬ ИСТОРИЮ" onPress={() => api.seal()} icon={<IconSeal className="h-4 w-4" />} />
        ) : (
          <Primary
            label={step === 1 && api.markIndex == null ? "ПОСТАВЬ ТОЧКУ РЕШЕНИЯ" : "ДАЛЬШЕ"}
            disabled={step === 1 ? api.markIndex == null : step === 2 ? !factsOk : false}
            onPress={() => (step === 1 && api.markIndex == null ? undefined : api.nextRunStep())}
          />
        )}
      </div>
    </Shell>
  );
}

function lessonTitle(api: FlowApi, step: number) {
  if (api.runIndex === 1) return ["Где ты находишься", "Первое действие: точка решения", "Факты до решения", "Печать решения"][step];
  if (api.runIndex === 2) return ["Второй заход: рынок не обязан двигаться", "Точка t0 снова твоя", "Факты без края", "Печать: решение ждать"][step];
  return ["Третий заход: отказ — тоже решение", "Точка t0", "Факты истерики", "Печать и слом идеи"][step];
}

function lessonBody(api: FlowApi, step: number) {
  if (api.runIndex === 1)
    return [
      `График ${api.caseDef.topic}. Свечи заканчиваются там, где начинается твоя ответственность.`,
      "Нажми внутри подсвеченной зоны у правого края графика. Промах не наказывается — попробуй снова.",
      "Один факт за другим. Пока не открыты все — решение будет ставкой, а не планом.",
      "Печать фиксирует то, что ты решил, и только после неё открывается история.",
    ][step];
  if (api.runIndex === 2)
    return [
      "Прошлый раз ты видел боковик. Теперь рынок молчит громче: движения нет, и это законный ответ.",
      "Поставь точку решения в зоне t0 — то же действие, другой смысл.",
      "Факты дадут понять, есть ли край вообще.",
      "Если края нет, решение «ждать» закрывается печатью так же честно, как вход.",
    ][step];
  return [
    "Паника — это процедура. Твоя задача решить, есть ли вход, когда все кричат.",
    "Зона t0 та же. Смотри на спред, а не на заголовки.",
    "Истерика не даёт структуры. Проверь факты.",
    "Печатаем решение вместе со сломом: если идея сломается, ты узнаешь цену заранее.",
  ][step];
}

/* ——— P14: хаб ——— */
function ArenaHub({ api }: { api: FlowApi }) {
  return (
    <Shell api={api} activeNav="АРЕНА">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-2.5">
          <div className="flex items-center gap-2">
            <Kicker>АРЕНА</Kicker>
            <span className="ml-auto flex items-center gap-1 font-mono text-[10.5px] text-mist-400">
              <IconTarget className="h-3.5 w-3.5" /> {api.attempts} попыток
            </span>
          </div>
          <p className="mt-1.5 text-[11.5px] leading-snug text-mist-400">
            Тишина тоже ответ. Вход не обязателен — обязателен план.
          </p>
        </Card>

        {api.attempts <= 0 ? (
          <Card className="!p-3">
            <div className="flex items-center gap-2" style={{ color: "#ef6b62" }}>
              <IconHourglass className="h-4 w-4" />
              <span className="text-[12.5px] font-bold">ПОПЫТКИ КОНЧИЛИСЬ</span>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-snug text-mist-400">
              Попытки восполняются в Академии: урок выдаёт карту навыка и одну попытку. Это не блокировка, а смена режима.
            </p>
            <div className="mt-2.5 space-y-2">
              <Primary label="В АКАДЕМИЮ ЗА ПОПЫТКОЙ" onPress={() => api.go("P29")} />
              <Ghost label="ПОСМОТРЕТЬ КОЛОДУ" onPress={() => api.go("P26")} />
            </div>
          </Card>
        ) : (
          CASES.map((c, i) => {
            const total = api.results[c.id];
            return (
              <button
                key={c.id}
                onPointerDown={() => api.startCase(i)}
                className="rounded-2xl plate p-2.5 text-left transition-transform duration-75 active:scale-[0.98]"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border" style={{ borderColor: "var(--accent-line)", background: "var(--accent-soft)", color: "var(--accent)" }}>
                    <IconSignal className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-bold text-white">{c.topic}</span>
                    <span className="font-mono text-[9.5px] text-mist-500">
                      {c.code} · {c.visible} свечей · {c.familiar ? "знакомая механика" : "незнакомая тема · без штрафа"}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    {total != null ? (
                      <span className="flex items-center gap-1 font-mono text-[12px] font-bold text-gold">
                        <IconStar className="h-3 w-3" />
                        {total}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-mist-500">
                        <IconInfo className="h-3 w-3" /> не пройден
                      </span>
                    )}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </Shell>
  );
}

/* ——— P15: арена с графиком ——— */
function ArenaChart({ api }: { api: FlowApi }) {
  const { past, future } = buildCandles(api.caseDef);
  const factsOk = api.decision.factsRead >= api.decision.factsTotal;
  const loading = api.forced === "P33";
  return (
    <Shell api={api} activeNav="АРЕНА">
      <div className="flex flex-1 flex-col gap-2.5">
        {loading ? (
          <Card className="flex flex-1 items-center justify-center gap-2">
            <span className="spin-slow" style={{ color: "var(--accent)" }}>
              <IconSpinner className="h-5 w-5" />
            </span>
            <span className="text-[12px] text-mist-400">Загружаем свечи кейса…</span>
          </Card>
        ) : (
          <>
            <Card className="!p-2.5">
              <div className="flex items-center gap-2">
                <Kicker>ЗАХОД · {api.caseDef.code}</Kicker>
                <span className="ml-auto font-mono text-[10px] text-mist-500">
                  <IconSeal className="inline h-3 w-3" /> t0
                </span>
              </div>
              <h2 className="mt-1.5 text-[13.5px] font-bold text-white">{api.caseDef.topic}</h2>
              {!api.caseDef.familiar && (
                <p className="mt-1 rounded-xl px-2 py-1.5 text-[10.5px] leading-snug" style={{ background: "rgba(224,177,69,.14)", color: "#e0b145" }}>
                  Незнакомая тема. Штрафа нет: оценивается работа с фактами, а не знание мира.
                </p>
              )}
            </Card>
            <div className="min-h-[170px] flex-1 overflow-hidden rounded-2xl plate-sunken p-1">
              <Chart past={past} future={future} mode="hidden" caption="ИСТОРИЯ ДО t0" reduced={api.reduced} />
            </div>
            <Card className="!p-2.5">
              <div className="flex items-center gap-2">
                <Kicker>ФАКТЫ</Kicker>
                <span className="ml-auto font-mono text-[10px] text-mist-500">
                  {api.decision.factsRead}/{api.decision.factsTotal}
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                {api.caseDef.facts.slice(0, api.decision.factsRead).map((f) => (
                  <div key={f.label} className="flex items-start gap-2 rounded-xl bg-black/25 px-2 py-1.5">
                    <span className="min-w-0 flex-1 text-[11px] leading-snug text-mist-300">{f.label}</span>
                    <span className="shrink-0 font-mono text-[10px] font-bold text-right" style={{ color: f.tone === "good" ? "#3ecf8e" : f.tone === "warn" ? "#e0b145" : "#8da0c0" }}>
                      {f.value}
                    </span>
                  </div>
                ))}
                {api.decision.factsRead === 0 && <p className="text-[11.5px] text-mist-500">Факты закрыты. Открой их — иначе решение будет рефлексом.</p>}
              </div>
            </Card>
            {factsOk ? (
              <Primary label="ПЕРЕЙТИ К РЕШЕНИЮ" onPress={() => api.go("P16")} />
            ) : (
              <>
                <Primary label="ОТКРЫТЬ ФАКТ" onPress={() => api.setDecision({ factsRead: api.decision.factsRead + 1 })} icon={<IconInfo className="h-4 w-4" />} />
                <p className="text-center text-[10.5px] text-mist-500">
                  К решению пустят, когда факты увидены целиком.
                </p>
              </>
            )}
          </>
        )}
      </div>
    </Shell>
  );
}

/* ——— P16 ——— */
function DecisionScreen({ api }: { api: FlowApi }) {
  const d = api.decision;
  return (
    <Shell api={api} activeNav="АРЕНА">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-2.5">
          <Kicker>РЕШЕНИЕ</Kicker>
          <h2 className="mt-1 text-[14px] font-bold text-white">Что делает рынок дальше — реши сам</h2>
          <p className="mt-1 text-[11.5px] leading-snug text-mist-400">
            Все четыре ответа законны. Ждать и не входить — не пропуск хода, а решение.
          </p>
        </Card>
        <div className="grid grid-cols-2 gap-2">
          {SIDES.map((s) => {
            const on = d.side === s.id;
            return (
              <button
                key={s.id}
                onPointerDown={() => api.setDecision({ side: s.id as Side })}
                className="rounded-2xl plate p-2.5 text-left transition-transform duration-75 active:scale-[0.96]"
                style={{ outline: on ? `2px solid ${s.color}` : undefined, background: on ? `${s.color}1f` : undefined }}
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-[12px] font-bold text-white">{s.label}</span>
                </span>
                <span className="mt-1 block text-[10.5px] leading-snug text-mist-400">{s.sub}</span>
              </button>
            );
          })}
        </div>
        {d.side && (
          <Card className="!p-2.5">
            <Kicker>РАЗМЕР РИСКА</Kicker>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={d.conviction * 100}
                onChange={(e) => api.setDecision({ conviction: parseInt(e.target.value, 10) / 100 })}
                style={{ ["--fill" as string]: `${d.conviction * 100}%` }}
                aria-label="Размер риска"
              />
              <span className="w-10 shrink-0 text-right font-mono text-[12px] font-bold text-white">{Math.round(d.conviction * 100)}%</span>
            </div>
            <p className="mt-1 text-[10.5px] leading-snug text-mist-500">
              {d.side === "WAIT" || d.side === "NO_TRADE" ? "Ты вне входа: риск должен быть нулевым, иначе это скрытый вход." : "Риск фиксируется до печати и не подкручивается после."}
            </p>
          </Card>
        )}
        <div className="mt-auto space-y-2">
          <Primary label="ОБОСНОВАТЬ РЕШЕНИЕ" disabled={!d.side} onPress={() => api.go("P17")} />
          {!d.side && <p className="text-center text-[10.5px] text-mist-500">Выбери одну из четырёх сторон.</p>}
        </div>
      </div>
    </Shell>
  );
}

/* ——— P17 ——— */
function ReasoningScreen({ api }: { api: FlowApi }) {
  const d = api.decision;
  const enough = d.reasons.length > 0 && d.own.trim().length >= 12;
  return (
    <Shell api={api} activeNav="АРЕНА">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-2.5">
          <Kicker>ОБОСНОВАНИЕ · ОБЯЗАТЕЛЬНО</Kicker>
          <p className="mt-1 text-[11.5px] leading-snug text-mist-400">
            Оценка процесса опирается на это. Формулировки оставляем себе, красивые — рынку.
          </p>
        </Card>
        <Card className="!p-2.5">
          <Kicker>ОПОРА ИЗ ФАКТОВ</Kicker>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {api.caseDef.reasons.map((r) => {
              const on = d.reasons.includes(r);
              return (
                <button
                  key={r}
                  onPointerDown={() => api.setDecision({ reasons: on ? d.reasons.filter((x) => x !== r) : [...d.reasons, r] })}
                  className="rounded-full px-2.5 py-1.5 text-[10.5px] font-bold transition-transform duration-75 active:scale-95"
                  style={{ background: on ? "var(--accent)" : "rgba(0,0,0,.3)", color: on ? "#071018" : "#8da0c0", border: `1px solid ${on ? "transparent" : "rgba(255,255,255,.08)"}` }}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </Card>
        <Card className="!p-2.5">
          <Kicker>СВОЯ ФОРМУЛИРОВКА</Kicker>
          <textarea
            value={d.own}
            onChange={(e) => api.setDecision({ own: e.target.value })}
            rows={4}
            placeholder="Почему именно так и что должно подтвердиться…"
            className="mt-2 w-full resize-none rounded-xl bg-black/35 p-2.5 text-[12px] leading-snug text-white outline-none placeholder:text-mist-500"
          />
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-[10px] text-mist-500">{d.own.trim().length}/12 минимум</span>
            {d.own.trim().length >= 12 && (
              <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#3ecf8e" }}>
                <IconCheck className="h-3 w-3" /> хватает
              </span>
            )}
          </div>
        </Card>
        <div className="mt-auto space-y-2">
          <Primary label="СЛОМ ИДЕИ" disabled={!enough} onPress={() => api.go("P18")} />
          {!enough && <p className="text-center text-[10.5px] text-mist-500">Нужна хотя бы одна опора и 12 символов своей мысли.</p>}
          <Ghost label="НАЗАД К РЕШЕНИЮ" onPress={() => api.go("P16")} />
        </div>
      </div>
    </Shell>
  );
}

/* ——— P18 ——— */
function InvalidationScreen({ api }: { api: FlowApi }) {
  const d = api.decision;
  const none = d.side === "WAIT" || d.side === "NO_TRADE";
  return (
    <Shell api={api} activeNav="АРЕНА">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-2.5">
          <Kicker>СЛОМ ИДЕИ</Kicker>
          <p className="mt-1 text-[11.5px] leading-snug text-mist-400">
            {none
              ? "Ты вне входа: слом не обязателен, но полезно сказать, какой факт вернёт тебя в рынок."
              : "Цена или факт, после которых идея считается сломанной. Это и есть план вместо надежды."}
          </p>
        </Card>
        <div className="space-y-1.5">
          {api.caseDef.invalidations.map((v) => {
            const on = d.invalidation === v;
            return (
              <button
                key={v}
                onPointerDown={() => api.setDecision({ invalidation: on ? "" : v })}
                className="flex w-full items-center gap-2 rounded-xl plate px-2.5 py-2 text-left transition-transform duration-75 active:scale-[0.98]"
                style={{ outline: on ? "1.5px solid var(--accent)" : undefined }}
              >
                <span style={{ color: on ? "var(--accent)" : "#6a7ea3" }}>{on ? <IconCheck className="h-3.5 w-3.5" /> : <IconCross className="h-3.5 w-3.5" />}</span>
                <span className="text-[11.5px] text-mist-300">{v}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-auto space-y-2">
          <Primary label="К ПЕЧАТИ" disabled={!none && !d.invalidation} onPress={() => api.go("P19")} />
          {!none && !d.invalidation && <p className="text-center text-[10.5px] text-mist-500">Выбери условие слома — иначе решение не защищено.</p>}
          <Ghost label="НАЗАД К ОБОСНОВАНИЮ" onPress={() => api.go("P17")} />
        </div>
      </div>
    </Shell>
  );
}

/* ——— P19 ——— */
function SealScreen({ api }: { api: FlowApi }) {
  const d = api.decision;
  const side = SIDES.find((s) => s.id === d.side);
  return (
    <Shell api={api} activeNav="АРЕНА">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-3">
          <div className="flex items-center gap-2">
            <span style={{ color: "#e0b145" }}>
              <IconSeal className="h-5 w-5" />
            </span>
            <span className="text-[13px] font-bold text-white">ПОДТВЕРДИ ПЕЧАТЬ</span>
          </div>
          <div className="mt-2.5 space-y-1.5 font-mono text-[11.5px]">
            <Line k="Решение" v={side?.label ?? "—"} />
            <Line k="Риск" v={`${Math.round(d.conviction * 100)}%`} />
            <Line k="Опора" v={`${d.reasons.length} пункт(ов)`} />
            <Line k="Слом" v={d.invalidation || "не задан"} />
          </div>
          <p className="mt-2.5 rounded-xl px-2 py-1.5 text-[11px] leading-snug" style={{ background: "rgba(224,177,69,.14)", color: "#e0b145" }}>
            После печати решение не меняется. Печать снимается только вместе с историей.
          </p>
        </Card>
        <div className="mt-auto space-y-2">
          <Primary label="ЗАПЕЧАТАТЬ" onPress={() => api.seal()} icon={<IconSeal className="h-4 w-4" />} />
          <Ghost label="ВЕРНУТЬСЯ И ПРАВИТЬ" onPress={() => api.go("P17")} />
        </div>
      </div>
    </Shell>
  );
}

/* ——— P20 / P09 / P21 ——— */
function RevealScreen({ api }: { api: FlowApi }) {
  const { past, future } = buildCandles(api.caseDef);
  const keyIdx = Math.max(1, Math.round(future.length * 0.55));
  return (
    <Shell api={api} activeNav="АРЕНА">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-2.5">
          <div className="flex items-center gap-2">
            <span style={{ color: "var(--accent)" }}>
              <IconScrub className="h-4 w-4" />
            </span>
            <Kicker>ИСТОРИЯ ОТКРЫВАЕТСЯ</Kicker>
            <span className="ml-auto font-mono text-[10px] text-mist-500">
              {api.scrub}/{future.length}
            </span>
          </div>
          <p className="mt-1 text-[11.5px] leading-snug text-mist-400">
            Протяни время вправо. Решение уже зафиксировано — теперь рынок говорит.
          </p>
        </Card>
        <div className="min-h-[180px] flex-1 overflow-hidden rounded-2xl plate-sunken p-1">
          <Chart
            past={past}
            future={future}
            mode="reveal"
            scrub={api.scrub}
            onScrub={api.setScrub}
            keyEventIndex={keyIdx}
            marker={api.markIndex != null ? { index: api.markIndex, side: api.decision.side ?? "WAIT" } : { index: past.length - 1, side: api.decision.side ?? "WAIT" }}
            invalidationLevel={
              api.decision.invalidation && /9\s?[\d.]+/.test(api.decision.invalidation)
                ? Math.min(...past.map((c) => c.l)) - 1
                : null
            }
            reduced={api.reduced}
          />
        </div>
        <Card className="!p-2.5">
          <Kicker>ЧТО ПРОИЗОШЛО</Kicker>
          <p className="mt-1.5 text-[12px] font-bold text-white">{api.caseDef.keyEvent.title}</p>
          <p className="mt-1 text-[11.5px] leading-snug text-mist-400">{api.caseDef.keyEvent.text}</p>
        </Card>
          <div className="mt-auto space-y-2">
          <Primary label="К ОЦЕНКЕ" onPress={api.finish} disabled={api.scrub < future.length} />
          {api.scrub < future.length && <p className="text-center text-[10.5px] text-mist-500">Дотяни протяжку до конца — история должна быть увидена целиком.</p>}
        </div>
      </div>
    </Shell>
  );
}

function KeyEventScreen({ api }: { api: FlowApi }) {
  return (
    <Shell api={api} activeNav="АРЕНА">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-3">
          <div className="flex items-center gap-2" style={{ color: "#e0b145" }}>
            <IconAlert className="h-4 w-4" />
            <Kicker>КЛЮЧЕВОЕ СОБЫТИЕ</Kicker>
          </div>
          <h2 className="mt-2 text-[14.5px] font-bold text-white">{api.caseDef.keyEvent.title}</h2>
          <p className="mt-1.5 text-[12px] leading-snug text-mist-300">{api.caseDef.keyEvent.text}</p>
        </Card>
        <Card className="!p-3">
          <Kicker>ОБЪЯСНЕНИЕ МЕХАНИКИ</Kicker>
          <p className="mt-1.5 text-[12px] leading-snug text-mist-300">{api.caseDef.keyEvent.abstract}</p>
          <p className="mt-2 text-[11.5px] leading-snug text-mist-400">{api.caseDef.explanation}</p>
        </Card>
        <div className="mt-auto">
          <Primary label="К РАЗБОРУ" onPress={() => api.go("P11")} />
        </div>
      </div>
    </Shell>
  );
}

/* ——— P22 / P10 ——— */
function ScoreScreen({ api }: { api: FlowApi }) {
  const sc = api.score;
  if (!sc) return <ForcedState api={{ ...api, forced: "P33" }} />;
  return (
    <Shell api={api} activeNav="АРЕНА">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border" style={{ borderColor: "var(--accent-line)", background: "var(--accent-soft)" }}>
              <span className="font-mono text-[19px] font-bold text-white">{sc.total}</span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12.5px] font-bold text-white">{sc.verdict}</span>
              <span className="font-mono text-[10px] text-mist-500">{sc.outcomeText} · исход рынка</span>
            </span>
            <span className="flex shrink-0 gap-0.5">
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ color: i < sc.stars ? "#e0b145" : "#2b3f63" }}>
                  <IconStar className="h-4 w-4" />
                </span>
              ))}
            </span>
          </div>
          <p className="mt-2 rounded-xl bg-black/25 px-2 py-1.5 text-[11px] leading-snug text-mist-400">
            {sc.processFirst}. Процесс весит больше исхода — рынок может наградить плохой план, но тренажёр нет.
          </p>
        </Card>
        <Card className="!p-2.5">
          <Kicker>ОСИ ПРОЦЕССА</Kicker>
          <div className="mt-2 space-y-2">
            {sc.axes.map((a) => (
              <div key={a.key}>
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] font-bold tracking-wider text-mist-400">{a.label}</span>
                  <span className="ml-auto font-mono text-[10.5px] font-bold text-white">
                    {a.points}/{a.max}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/45">
                  <div className="h-full rounded-full" style={{ width: `${(a.points / a.max) * 100}%`, background: a.points / a.max > 0.6 ? "#3ecf8e" : a.points / a.max > 0.3 ? "#e0b145" : "#ef6b62" }} />
                </div>
                <p className="mt-0.5 text-[10px] leading-snug text-mist-500">{a.note}</p>
              </div>
            ))}
          </div>
        </Card>
        <div className="mt-auto">
          <Primary label="РАЗБОР" onPress={() => api.go("P11")} />
        </div>
      </div>
    </Shell>
  );
}

/* ——— P23 / P11 ——— */
function Debrief({ api }: { api: FlowApi }) {
  const sc = api.score;
  const hasLesson = api.doneLessons.length === 0;
  return (
    <Shell api={api} activeNav="АРЕНА">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-3">
          <Kicker>РАЗБОР</Kicker>
          <h2 className="mt-1 text-[14px] font-bold text-white">{api.caseDef.lesson}</h2>
          <div className="mt-2 space-y-1.5">
            {(sc?.debrief ?? []).map((b, i) => (
              <p key={i} className="rounded-xl bg-black/25 px-2 py-1.5 text-[11.5px] leading-snug text-mist-300">
                {b}
              </p>
            ))}
          </div>
        </Card>
        <Card className="!p-2.5">
          <div className="flex items-center gap-2">
            <span style={{ color: "var(--accent)" }}>
              <IconBook className="h-4 w-4" />
            </span>
            <Kicker>СЛЕДУЮЩИЙ ШАГ</Kicker>
          </div>
          <p className="mt-1.5 text-[11.5px] leading-snug text-mist-400">
            {hasLesson
              ? "Ты упёрся в механику, которой нет в колоде. Академия открывается именно здесь — когда не хватает приёма."
              : "Кейс закрыт. Следующий заход даст другой рынок и другой набор фактов."}
          </p>
        </Card>
        <div className="mt-auto space-y-2">
          <Primary label="В АКАДЕМИЮ" onPress={() => api.go("P24")} icon={<IconBook className="h-4 w-4" />} />
          <Ghost label="ПОВТОРИТЬ ЗАХОД (−попытка)" onPress={api.retry} icon={<IconRestart className="h-4 w-4" />} />
        </div>
      </div>
    </Shell>
  );
}

/* ——— P24–P25 ——— */
function AcademyScreen({ api }: { api: FlowApi }) {
  const done = Object.keys(api.results).length;
  return (
    <Shell api={api} activeNav="АКАДЕМИЯ">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-2.5">
          <Kicker>АКАДЕМИЯ</Kicker>
          <p className="mt-1 text-[11.5px] leading-snug text-mist-400">
            Темы открываются практикой, а не временем. Закрыто {done} кейс(ов).
          </p>
        </Card>
        {TOPICS.map((t) => {
          const locked = t.opensAfter != null && done < (t.id === "t2" ? 1 : 2);
          return (
            <Card key={t.id} className="!p-2.5" >
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl border" style={{ borderColor: locked ? "rgba(106,126,163,.3)" : "var(--accent-line)", background: locked ? "rgba(0,0,0,.3)" : "var(--accent-soft)", color: locked ? "#6a7ea3" : "var(--accent)" }}>
                  {locked ? <IconLock className="h-4 w-4" /> : <IconBook className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-bold text-white">{t.title}</span>
                  <span className="font-mono text-[9.5px] text-mist-500">
                    {locked ? `откроется: ${t.opensAfter}` : t.subtitle}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[10px] text-mist-500">
                  {t.lessons.filter((l) => api.doneLessons.includes(l.id)).length}/{t.lessons.length}
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                {t.lessons.map((l) => {
                  const doneLesson = api.doneLessons.includes(l.id);
                  return (
                    <button
                      key={l.id}
                      onPointerDown={() => api.go("P25")}
                      disabled={locked}
                      className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition-transform duration-75 active:scale-[0.98]"
                      style={{ background: "rgba(0,0,0,.28)", opacity: locked ? 0.55 : 1 }}
                    >
                      <span style={{ color: doneLesson ? "#3ecf8e" : "var(--accent)" }}>
                        {doneLesson ? <IconCheck className="h-3.5 w-3.5" /> : <IconCard className="h-3.5 w-3.5" />}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[11.5px] text-white">{l.title}</span>
                      <span className="shrink-0 font-mono text-[9.5px] text-mist-500">{locked ? "ЗАКРЫТО" : doneLesson ? "ПРОЙДЕН" : "УРОК"}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
        <Card className="!p-2.5">
          <p className="text-[11px] leading-snug text-mist-500">
            Замок — это не наказание, а порядок: пока механику не потребовал заход, урок нечего объяснять.
          </p>
        </Card>
      </div>
    </Shell>
  );
}

function LessonScreen({ api }: { api: FlowApi }) {
  const [topic, lesson] = findLesson(api);
  if (!topic || !lesson) return <ForcedState api={{ ...api, forced: "P31" }} />;
  const doneLesson = api.doneLessons.includes(lesson.id);
  return (
    <Shell api={api} activeNav="АКАДЕМИЯ">
      <div className="flex flex-1 flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <Kicker>УРОК · {api.doneLessons.length + 1}/{TOPICS.reduce((s, t) => s + t.lessons.length, 0)}</Kicker>
          <span className="ml-auto font-mono text-[10px] text-mist-500">{topic.title}</span>
        </div>
        <Card className="!p-3">
          <h2 className="text-[16px] font-bold text-white">{lesson.hook}</h2>
          <p className="mt-2 text-[12px] leading-snug text-mist-300">{lesson.body}</p>
        </Card>
        <Card className="!p-2.5">
          <Kicker>ПРАКТИКА</Kicker>
          <p className="mt-1.5 text-[11.5px] leading-snug text-mist-400">{lesson.practice}</p>
          <p className="mt-2 text-[10.5px] text-mist-500">Награда: {lesson.reward} + 1 попытка</p>
        </Card>
        <div className="mt-auto space-y-2">
          <Primary
            label={doneLesson ? "ПРОЙДЕНО · УЧИТЬСЯ ДАЛЬШЕ" : "НАЧАТЬ ПРАКТИКУ"}
            onPress={() => {
              api.completeLesson(lesson.id);
              api.go("P14");
            }}
            icon={<IconBook className="h-4 w-4" />}
          />
          <Ghost label="НАЗАД К ДЕРЕВУ" onPress={() => api.go("P24")} />
        </div>
      </div>
    </Shell>
  );
}

function findLesson(api: FlowApi): [ReturnType<typeof TOPICS.find>, (typeof TOPICS)[number]["lessons"][number] | undefined] {
  const pending = TOPICS.flatMap((t) => t.lessons.map((l) => ({ t, l }))).find((x) => !api.doneLessons.includes(x.l.id));
  const pick = pending ?? { t: TOPICS[0], l: TOPICS[0].lessons[0] };
  return [pick.t, pick.l];
}

/* ——— P26–P27 ——— */
function DeckScreen({ api }: { api: FlowApi }) {
  return (
    <Shell api={api} activeNav="АКАДЕМИЯ">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-2.5">
          <div className="flex items-center gap-2">
            <Kicker>КОЛОДА КАРТ НАВЫКОВ</Kicker>
            <span className="ml-auto font-mono text-[10px] text-mist-500">
              {api.cards.length}/{CARDS.length}
            </span>
          </div>
        </Card>
        {api.cards.length === 0 ? (
          <Card className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <span style={{ color: "var(--accent)" }}>
              <IconCard className="h-7 w-7" />
            </span>
            <p className="text-[12.5px] font-bold text-white">Колода пуста</p>
            <p className="max-w-[240px] text-[11.5px] leading-snug text-mist-400">
              Карты выдаются за уроки Академии. Пока навыков нет — Арена будет давать те же кейсы без продвижения.
            </p>
            <div className="w-full max-w-[240px]">
              <Primary label="ОТКРЫТЬ ПЕРВЫЙ УРОК" onPress={() => api.go("P25")} />
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {CARDS.filter((c) => api.cards.includes(c.id)).map((c) => (
              <button
                key={c.id}
                onPointerDown={() => api.openCard(c.id)}
                className="rounded-2xl plate p-2.5 text-left transition-transform duration-75 active:scale-[0.96]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg border" style={{ borderColor: "var(--accent-line)", color: "var(--accent)" }}>
                  <IconCard className="h-4 w-4" />
                </span>
                <span className="mt-1.5 block text-[11.5px] font-bold leading-tight text-white">{c.title}</span>
                <span className="mt-1 block line-clamp-3 text-[10px] leading-snug text-mist-400">{c.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}

function CardScreen({ api }: { api: FlowApi }) {
  const card = CARDS.find((c) => c.id === api.selectedCard) ?? CARDS.find((c) => api.cards.includes(c.id));
  if (!card) return <ForcedState api={{ ...api, forced: "P31" }} />;
  return (
    <Shell api={api} activeNav="АКАДЕМИЯ">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border" style={{ borderColor: "var(--accent-line)", background: "var(--accent-soft)", color: "var(--accent)" }}>
            <IconCard className="h-5 w-5" />
          </span>
          <h2 className="mt-2 text-[15px] font-bold text-white">{card.title}</h2>
          <p className="mt-2 text-[12.5px] leading-snug text-mist-300">{card.text}</p>
          <p className="mt-2.5 rounded-xl bg-black/25 px-2 py-1.5 text-[11px] leading-snug text-mist-500">
            Карта получена за урок Академии. Она не даёт «сигналов» и не предсказывает рынок — только фиксирует приём.
          </p>
        </Card>
        <div className="mt-auto space-y-2">
          <Primary label="К КОЛОДЕ" onPress={() => api.go("P26")} />
          <Ghost label="НА АРЕНУ" onPress={() => api.go("P14")} />
        </div>
      </div>
    </Shell>
  );
}

/* ——— P28 / P34 ——— */
function ProfileScreen({ api }: { api: FlowApi }) {
  const scores = Object.values(api.results);
  const avg = scores.length ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
  return (
    <Shell api={api} activeNav="ПРОФИЛЬ">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border" style={{ borderColor: "var(--accent-line)", background: "var(--accent-soft)", color: "var(--accent)" }}>
              <IconProfile className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[14px] font-bold text-white">ПРОЦЕССНЫЙ ПРОФИЛЬ</span>
              <span className="font-mono text-[10px] text-mist-500">средний процесс {avg} · кейсов {scores.length}</span>
            </span>
            <span className="ml-auto flex items-center gap-1 font-mono text-[13px] font-bold text-gold">
              <IconTrophy className="h-4 w-4" />
              {api.stars}
            </span>
          </div>
        </Card>
        <Card className="!p-2.5">
          <Kicker>ПО КЕЙСАМ</Kicker>
          <div className="mt-2 space-y-1.5">
            {CASES.map((c) => {
              const r = api.results[c.id];
              return (
                <div key={c.id} className="flex items-center gap-2 rounded-xl bg-black/25 px-2 py-1.5">
                  <span className="min-w-0 flex-1 truncate text-[11px] text-mist-300">{c.topic}</span>
                  <span className="shrink-0 font-mono text-[10.5px] font-bold text-white">{r != null ? `${r} / 100` : "—"}</span>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="!p-2.5">
          <Kicker>КАРТЫ И ПОПЫТКИ</Kicker>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 font-mono text-[11.5px] text-white">
              <IconCard className="h-3.5 w-3.5" /> {api.cards.length}/{CARDS.length}
            </span>
            <span className="ml-auto flex items-center gap-1 font-mono text-[11.5px] text-white">
              <IconTarget className="h-3.5 w-3.5" /> {api.attempts}/{api.attemptsMax}
            </span>
          </div>
          <p className="mt-2 text-[10.5px] leading-snug text-mist-500">
            Все кейсы учебные и вымышленные. Монеты — внутриигровая единица прогресса, к реальным деньгам отношения не имеют.
          </p>
        </Card>
        <div className="mt-auto space-y-2">
          <Primary label="АРЕНА" onPress={() => api.go("P14")} />
          <Ghost label="НАСТРОЙКИ" onPress={() => api.go("P34")} icon={<IconGear className="h-4 w-4" />} />
        </div>
      </div>
    </Shell>
  );
}

function SettingsScreen({ api }: { api: FlowApi }) {
  return (
    <Shell api={api} activeNav="ПРОФИЛЬ">
      <div className="flex flex-1 flex-col gap-2.5">
        <Card className="!p-2.5">
          <Kicker>НАСТРОЙКИ ЗАХОДА</Kicker>
          <div className="mt-2 space-y-1.5">
            <Row toggle value={api.sound} label="ЗВУК" onPress={() => api.toggle("sound")} />
            <Row toggle value={api.haptics} label="ВИБРАЦИЯ" onPress={() => api.toggle("haptics")} />
            <Row toggle value={api.reduced} label="МЕНЬШЕ ДВИЖЕНИЯ" onPress={() => api.toggle("reduced")} />
          </div>
          <p className="mt-2 text-[10.5px] leading-snug text-mist-500">
            «Меньше движения» убирает пульсацию и анимации; свечи, рейтинг и тексты не меняются.
          </p>
        </Card>
        <Card className="!p-2.5">
          <Kicker>УВЕДОМЛЕНИЯ</Kicker>
          <p className="mt-1.5 text-[11.5px] leading-snug text-mist-400">
            Колокольчик в верхней панели показывает только служебные записи захода: печать, открытие истории, выданные карты.
          </p>
        </Card>
        <div className="mt-auto">
          <Primary label="ЗАКРЫТЬ" onPress={() => api.go("P28")} />
        </div>
      </div>
    </Shell>
  );
}

/* ——— состояния P29–P33 ——— */
function ForcedState({ api }: { api: FlowApi }) {
  const id = api.forced;
  const map: Record<string, { title: string; reason: string; next: string; cta: string; to: PageId; icon: React.ReactNode; tone: string }> = {
    P29: { title: "ПОПЫТКИ КОНЧИЛИСЬ", reason: "Попытки выдаются за уроки Академии: одна карта — одна попытка.", next: "Открой урок и вернись в Арену.", cta: "В АКАДЕМИЮ", to: "P24", icon: <IconHourglass className="h-5 w-5" />, tone: "#ef6b62" },
    P30: { title: "АКАДЕМИЯ ЗАКРЫТА", reason: "Темы открываются практикой. Пока ни один заход не закрыт — учить нечего.", next: "Сделай один заход до печати и разбора.", cta: "НА АРЕНУ", to: "P14", icon: <IconLock className="h-5 w-5" />, tone: "#e0b145" },
    P31: { title: "ПУСТО", reason: "По этой теме кейсов нет: список формируется из пройденных механик.", next: "Вернись в хаб или открой колоду.", cta: "ОБНОВИТЬ СПИСОК", to: "P14", icon: <IconInfo className="h-5 w-5" />, tone: "#5b8fdb" },
    P32: { title: "ОШИБКА ЗАГРУЗКИ КЕЙСА", reason: "Свечи кейса не пришли. Решение не потеряно и не оценено.", next: "Повторить загрузку — попытка не списывается.", cta: "ПОВТОРИТЬ", to: "P15", icon: <IconAlert className="h-5 w-5" />, tone: "#ef6b62" },
    P33: { title: "ЗАГРУЗКА", reason: "Собираем свечи и факты кейса.", next: "Это на несколько мгновений.", cta: "—", to: "P15", icon: <IconSpinner className="h-5 w-5" />, tone: "#2fd4c4" },
  };
  const s = map[id ?? "P33"];
  return (
    <div className="relative flex h-full w-full flex-col bg-ink-950 stage-bg">
      {id === "P33" ? <TopBarSkeleton /> : (
        <TopBar attempts={api.attempts} attemptsMax={api.attemptsMax} stars={api.stars} coins={api.coins} unread={api.unread} onBell={() => api.go("P28")} onGear={() => api.go("P34")} />
      )}
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-3xl border" style={{ borderColor: `${s.tone}88`, background: `${s.tone}22`, color: s.tone }}>
          <span className={id === "P33" && !api.reduced ? "spin-slow" : ""}>{s.icon}</span>
        </span>
        <h2 className="text-[15px] font-bold text-white">{s.title}</h2>
        <p className="text-[12px] leading-snug text-mist-400">{s.reason}</p>
        <p className="text-[12px] leading-snug text-mist-300">{s.next}</p>
        <div className="w-full max-w-[250px] space-y-2">
          {s.cta !== "—" && <Primary label={s.cta} onPress={() => { api.clearForced(); api.go(s.to); }} />}
          <Ghost label="ЗАКРЫТЬ СОСТОЯНИЕ" onPress={api.clearForced} />
        </div>
      </div>
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-mist-500">{k}</span>
      <span className="text-right font-bold text-white">{v}</span>
    </div>
  );
}

function Row({ label, value, onPress, toggle }: { label: string; value: boolean; onPress: () => void; toggle?: boolean }) {
  return (
    <button onPointerDown={onPress} className="flex w-full items-center justify-between rounded-xl bg-black/25 px-2.5 py-2 transition-transform duration-75 active:scale-[0.98]">
      <span className="text-[11px] font-bold tracking-wider text-mist-400">{label}</span>
      {toggle && (
        <span className="relative h-5 w-9 rounded-full border transition-colors" style={{ background: value ? "var(--accent-soft)" : "rgba(0,0,0,.4)", borderColor: value ? "var(--accent)" : "rgba(255,255,255,.1)" }}>
          <span className="absolute top-[2px] h-[14px] w-[14px] rounded-full transition-all" style={{ left: value ? 18 : 3, background: value ? "var(--accent)" : "#6a7ea3" }} />
        </span>
      )}
    </button>
  );
}

export { Card as FlowCard, Primary as FlowPrimary, Ghost as FlowGhost, Shell as FlowShell, fmt as flowFmt, rewardFromLesson, scoreRun };
