/* MVP-домен Арены: кейсы со скрытым будущим, факты до решения,
   обязательное обоснование, invalidation, оценка процесса. */

export type Side = "LONG" | "SHORT" | "WAIT" | "NO_TRADE";

export interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
}

export interface FactItem {
  label: string;
  value: string;
  tone: "neutral" | "warn" | "good";
}

export interface CaseDef {
  id: string;
  code: string;
  topic: string;
  familiar: boolean;
  seed: number;
  base: number;
  vol: number;
  visible: number;
  futureBars: number;
  facts: FactItem[];
  outcome: { dir: number; pct: number };
  keyEvent: { title: string; text: string; abstract: string };
  explanation: string;
  lesson: string;
  reasons: string[];
  invalidations: string[];
}

export const SIDES: { id: Side; label: string; sub: string; color: string }[] = [
  { id: "LONG", label: "ВЗЯТЬ ВВЕРХ", sub: "ставка на рост", color: "#3ecf8e" },
  { id: "SHORT", label: "ВЗЯТЬ ВНИЗ", sub: "ставка на падение", color: "#ef6b62" },
  { id: "WAIT", label: "ПОДОЖДАТЬ", sub: "полноценное решение", color: "#5b8fdb" },
  { id: "NO_TRADE", label: "НЕ ВХОДИТЬ", sub: "система не даёт края", color: "#8f7ee0" },
];

/* ——— генерация свечей: детерминированная, без обращения к реальным данным ——— */
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildCandles(c: CaseDef): { past: Candle[]; future: Candle[] } {
  const rnd = mulberry(c.seed);
  const past: Candle[] = [];
  let price = c.base;
  for (let i = 0; i < c.visible; i++) {
    const drift = (rnd() - 0.5) * c.vol;
    const o = price;
    const cl = o + drift;
    past.push({ o, c: cl, h: Math.max(o, cl) + rnd() * c.vol * 0.5, l: Math.min(o, cl) - rnd() * c.vol * 0.5 });
    price = cl;
  }
  const future: Candle[] = [];
  const target = price * (1 + c.outcome.pct / 100);
  const step = (target - price) / c.futureBars;
  const rnd2 = mulberry(c.seed + 991);
  for (let i = 0; i < c.futureBars; i++) {
    const o = price;
    const cl = o + step + (rnd2() - 0.5) * c.vol * 1.1;
    future.push({ o, c: cl, h: Math.max(o, cl) + rnd2() * c.vol * 0.6, l: Math.min(o, cl) - rnd2() * c.vol * 0.6 });
    price = cl;
  }
  return { past, future };
}

/* ——— кейсы: учебные, вымышленные, без обещаний доходности ——— */
export const CASES: CaseDef[] = [
  {
    id: "c1",
    code: "УЧЕБНЫЙ КЕЙС · 001",
    topic: "ОСНОВЫ: ЗОНА ВНИМАНИЯ",
    familiar: true,
    seed: 7,
    base: 100,
    vol: 2.6,
    visible: 26,
    futureBars: 10,
    facts: [
      { label: "Диапазон 20 свечей", value: "98.4 — 104.2", tone: "neutral" },
      { label: "Последняя свеча", value: "закрылась в середине диапазона", tone: "neutral" },
      { label: "Тренд старшего фрейма", value: "боковой, 4 цикла подряд", tone: "warn" },
      { label: "Поток объёма", value: "тонкий, покупатель не подтверждает", tone: "warn" },
    ],
    outcome: { dir: 0, pct: 1.2 },
    keyEvent: {
      title: "СОБЫТИЕ ТИК-ЗОНЫ",
      text: "Движения не случилось. Рынок простоял 10 свечей и вернулся в ту же середину.",
      abstract: "Внутри диапазона без потока объёма рынок перемалывает попытки входа.",
    },
    explanation:
      "Здесь не было края. Ни одного факта в пользу направления: тренд боковой, объём тонкий. Верное действие — не входить или ждать. Это не пассивность, а решение.",
    lesson: "Факты важнее предчувствия",
    reasons: [
      "Тренд боковой, нет направления",
      "Объём не подтверждает движение",
      "Жду выхода из диапазона",
      "Слишком мало фактов для входа",
    ],
    invalidations: ["Закрытие за 104.2", "Закрытие ниже 98.4", "Резкий рост объёма", "Слом идеи не нужен, я вне рынка"],
  },
  {
    id: "c2",
    code: "УЧЕБНЫЙ КЕЙС · 002",
    topic: "КИТ ПРОСНУЛСЯ",
    familiar: true,
    seed: 21,
    base: 240,
    vol: 4.2,
    visible: 26,
    futureBars: 12,
    facts: [
      { label: "Накопление", value: "18 свечей у сопротивления", tone: "neutral" },
      { label: "Резкий всплеск объёма", value: "в 4.7 раза выше среднего", tone: "warn" },
      { label: "Заявки над ценой", value: "стена продавца на 3% выше", tone: "warn" },
      { label: "Новостной фон", value: "стадо обсуждает «прорыв»", tone: "warn" },
    ],
    outcome: { dir: -1, pct: -6.4 },
    keyEvent: {
      title: "ЛОВУШКА ПОДТВЕРДИЛАСЬ",
      text: "Пробой выкупили два тика, затем цена ушла вниз на 6%.",
      abstract: "Стена заявок может быть приманкой: объём вырос, но покупатель не удержал.",
    },
    explanation:
      "Объём без последующего удержания — типичная ловушка. Правильных ответов два: подождать подтверждения или взять вниз. Оба получают очки процесса, если обоснование опирается на факты.",
    lesson: "Объём ≠ подтверждение",
    reasons: [
      "Стена продавца сильнее покупателя",
      "Пробой без удержания — ловушка",
      "Риск покупателя выше риска входа",
      "Жду ретест, а не первый импульс",
    ],
    invalidations: ["Удержание над уровнем 3 свечи", "Уход ниже 228", "Снятие стены продавца", "Я жду подтверждения, слома нет"],
  },
  {
    id: "c3",
    code: "УЧЕБНЫЙ КЕЙС · 003",
    topic: "УРОЖАЙ КАКАО НА ОРБИТЕ",
    familiar: false,
    seed: 88,
    base: 62,
    vol: 1.9,
    visible: 26,
    futureBars: 11,
    facts: [
      { label: "Тема", value: "орбитальные плантации какао", tone: "neutral" },
      { label: "Сезонность", value: "начало сбора, 6 циклов подряд", tone: "neutral" },
      { label: "Логистика", value: "поставки ускорились на 18%", tone: "good" },
      { label: "Спрос колоний", value: "стабилен 12 циклов, без рывков", tone: "neutral" },
    ],
    outcome: { dir: 1, pct: 4.1 },
    keyEvent: {
      title: "МЕХАНИКА ПОВТОРИЛАСЬ",
      text: "Начало сбора сыграло как всегда: плавный рост на 4% за 11 свечей.",
      abstract: "Первые циклы сбора повторяются. Незнакомая тема — не приговор, если механика читается.",
    },
    explanation:
      "Ровный ускоряющийся тренд при стабильном спросе — редкий честный край. Здесь уместен вход вверх с заранее объявленным сломом. Незнакомая тема не штрафуется: важна работа с фактами, а не знание легенды.",
    lesson: "Незнакомая тема не наказывается",
    reasons: [
      "Поставки ускоряются, спрос ровный",
      "Тренд плавный и повторяемый",
      "Риск ломается на потере темпа",
      "Факты есть, легенда вторична",
    ],
    invalidations: ["Уход ниже 60.2", "Спрос падает два цикла подряд", "Провал ускорения поставок", "Вне рынка, слом не требуется"],
  },
  {
    id: "c4",
    code: "УЧЕБНЫЙ КЕЙС · 004",
    topic: "ПАНИКА РЕГУЛЯТОРА",
    familiar: true,
    seed: 133,
    base: 410,
    vol: 7.4,
    visible: 26,
    futureBars: 9,
    facts: [
      { label: "Новость", value: "«регуляторы снова обеспокоены»", tone: "warn" },
      { label: "Реакция цены", value: "свеча вниз 5.8%, вечер", tone: "bad" as "warn" },
      { label: "Ликвидность", value: "спред расширен втрое", tone: "warn" },
      { label: "Позиция колонии", value: "треть входа прошла, остаток ждёт", tone: "neutral" },
    ],
    outcome: { dir: 0, pct: -0.8 },
    keyEvent: {
      title: "ПАНИКА КАК ПРОЦЕДУРА",
      text: "Паника не переросла в обвал: рынок просто пересмотрел реальность и встал.",
      abstract: "Расширенный спред истерит быстрее, чем цена успевает измениться.",
    },
    explanation:
      "После новости без структуры лучший ход — подождать, пока спред сожмётся. Вход в такую панику — не план, а рефлекс. Обоснование по фактам даёт процессные очки даже при отказе от сделки.",
    lesson: "Паника — не сигнал",
    reasons: [
      "Спред расширен, вход дорогой",
      "Новость не даёт структуры",
      "Жду сжатия спреда",
      "Есть остаток позиции, вход не нужен",
    ],
    invalidations: ["Спред возвращается к норме", "Цена уходит ниже 396", "Возврат над 424", "Я вне входа, слом не нужен"],
  },
];

/* ——— процессная оценка ——— */
export interface ScoreAxis {
  key: string;
  label: string;
  points: number;
  max: number;
  note: string;
}

export interface RunResult {
  axes: ScoreAxis[];
  process: number;
  outcome: number;
  total: number;
  stars: number;
  verdict: string;
  processFirst: string;
  outcomeText: string;
  debrief: string[];
  sideValid: boolean;
  retryable: boolean;
}

export interface Decision {
  side: Side | null;
  factsRead: number;
  factsTotal: number;
  reasons: string[];
  own: string;
  invalidation: string;
  conviction: number;
}

export function sideIsValid(c: CaseDef, d: Decision): boolean {
  if (d.side === "WAIT" || d.side === "NO_TRADE") return Math.abs(c.outcome.pct) <= 1.5;
  if (d.side === "LONG") return c.outcome.pct >= 1.5;
  if (d.side === "SHORT") return c.outcome.pct <= -1.5;
  return false;
}

export function scoreRun(c: CaseDef, d: Decision, attempts: number): RunResult {
  const factsPts = Math.round((d.factsRead / d.factsTotal) * 16);
  const reasonPts = Math.min(14, d.reasons.length * 5);
  const ownPts = d.own.trim().length >= 12 ? 10 : d.own.trim().length > 0 ? 4 : 0;
  const invalPts = d.invalidation ? 12 : 0;
  const riskPts = Math.round(d.conviction * 10);
  const absent = d.side === "WAIT" || d.side === "NO_TRADE";
  const disciplinePts = absent ? 12 : 8;

  const axes: ScoreAxis[] = [
    { key: "facts", label: "РАБОТА С ФАКТАМИ", points: factsPts, max: 16, note: `Открыто фактов: ${d.factsRead} из ${d.factsTotal}` },
    { key: "reason", label: "ОБОСНОВАНИЕ", points: reasonPts + ownPts, max: 24, note: d.own.trim().length >= 12 ? "Своя формулировка есть" : "Своя формулировка короткая или отсутствует" },
    { key: "risk", label: "УПРАВЛЕНИЕ РИСКОМ", points: riskPts + disciplinePts, max: 22, note: absent ? "Отказ от входа засчитан как решение" : `Заявленный размер риска: ${Math.round(d.conviction * 100)}%` },
    { key: "inval", label: "СЛОМ ИДЕИ", points: invalPts, max: 12, note: d.invalidation ? `Зафиксировано: ${d.invalidation}` : "Условие слома не задано" },
  ];
  const process = axes.reduce((s, a) => s + a.points, 0);
  const valid = sideIsValid(c, d);
  const unfamiliarGrace = c.familiar ? 0 : 4;
  const outcome = valid ? 24 + unfamiliarGrace : c.familiar ? 6 : 10;
  const attemptPenalty = Math.max(0, attempts - 1) * 4;
  const total = Math.max(0, Math.min(100, process + outcome - attemptPenalty));
  const stars = total >= 78 ? 3 : total >= 55 ? 2 : 1;

  const verdict =
    valid && process >= 55
      ? "РЫНОК ПРИНЯЛ ТВОЁ РЕШЕНИЕ"
      : valid
        ? "НАПРАВЛЕНИЕ ВЕРНОЕ. ПРОЦЕСС ТОНКИЙ"
        : process >= 55
          ? "ПРОЦЕСС ЧИСТЫЙ. ИСХОД ПРОТИВ ТЕБЯ"
          : "РЫНОК ПЕРЕСМОТРЕЛ ТВОЮ УВЕРЕННОСТЬ";

  const debrief = [
    absent
      ? `Ты выбрал ${d.side === "WAIT" ? "ждать" : "не входить"}. Это решение, а не пропуск хода: ${valid ? "края действительно не было" : "движение было, но без обоснования вход — рефлекс"}.`
      : `Ты вошёл ${d.side === "LONG" ? "вверх" : "вниз"} с риском ${Math.round(d.conviction * 100)}%. ${valid ? "Направление совпало с механикой." : "Механика пошла против направления."}`,
    d.invalidation ? `Слом идеи был задан заранее: «${d.invalidation}». Это то, что превращает ставку в план.` : "Слом идеи не был задан. Без него любое движение рынка приходится объяснять задним числом.",
    d.own.trim().length >= 12 ? "Обоснование записано до Seal — оценка процесса опирается на него, а не на исход." : "Записанное обоснование слишком короткое: процесс не проверяем.",
    c.lesson ? `Урок кейса: ${c.lesson}.` : "",
  ].filter(Boolean);

  return {
    axes,
    process,
    outcome,
    total,
    stars,
    verdict,
    processFirst: `Процесс ${process} из 74 · исход ${outcome} из 24`,
    outcomeText: `${c.outcome.pct > 0 ? "+" : ""}${c.outcome.pct}% за ${c.futureBars} свечей`,
    debrief,
    sideValid: valid,
    retryable: true,
  };
}

/* ——— Академия: дерево тем, уроки, карты навыков ——— */
export interface Lesson {
  id: string;
  title: string;
  hook: string;
  body: string;
  practice: string;
  reward: string;
}

export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  opensAfter: string | null;
  lessons: Lesson[];
}

export const TOPICS: Topic[] = [
  {
    id: "t1",
    title: "ЧТЕНИЕ ГРАФИКА",
    subtitle: "где сейчас t0 и что уже случилось",
    opensAfter: null,
    lessons: [
      { id: "l1", title: "Точка решения", hook: "График заканчивается там, где начинается твоя ответственность.", body: "Арена показывает только историю. Будущее закрыто печатью до момента, когда ты объявишь решение и обоснование.", practice: "Открыть кейс 001 и дойти до Seal без входа", reward: "Карта: ТОЧКА РЕШЕНИЯ" },
      { id: "l2", title: "Диапазон и объём", hook: "Диапазон — это когда рынок обещает движение и не приходит.", body: "Внутри диапазона без подтверждения объёма у входа нет края. Это не трусость, это чтение структуры.", practice: "Отказаться от входа в боковике", reward: "Карта: ТИХИЙ ДИАПАЗОН" },
    ],
  },
  {
    id: "t2",
    title: "РАЗМЕР И СЛОМ",
    subtitle: "риск, который можно объявить заранее",
    opensAfter: "ЗАКРЫТЬ ПЕРВЫЙ КЕЙС",
    lessons: [
      { id: "l3", title: "Объявленный риск", hook: "Паника бесплатна. Вход — нет.", body: "Размер риска фиксируется до Seal. После печати цифру не подкрутить.", practice: "Войти с риском не больше 30%", reward: "Карта: ХОЛОДНЫЙ РАЗМЕР" },
      { id: "l4", title: "Слом идеи", hook: "Если идею нельзя сломать одной ценой — это не идея.", body: "Слом задаётся до входа. Он превращает ставку в план и снимает споры задним числом.", practice: "Задать слом и дойти до разбора", reward: "Карта: ПРОТОКОЛ СЛОМА" },
    ],
  },
  {
    id: "t3",
    title: "ПАНИКА И НАРРАТИВ",
    subtitle: "новости, киты и стадо",
    opensAfter: "ЗАКРЫТЬ 2 КЕЙСА",
    lessons: [
      { id: "l5", title: "Новость без структуры", hook: "Регуляторы обеспокоены. Рынок делает вид, что удивлён.", body: "Новость расширяет спред, но не создаёт край. Сначала сжатие, потом решение.", practice: "Пропустить панический вход", reward: "Карта: УПРАВЛЯЕМАЯ ПАНИКА" },
      { id: "l6", title: "Кит как процедура", hook: "Киты не двигают рынок. Они просто нажимают кнопку.", body: "Объём без удержания — приманка. Ждать подтверждения — тоже решение.", practice: "Взять вниз или дождаться ретеста", reward: "Карта: ЛОВУШКА ОБЪЁМА" },
    ],
  },
];

export const CARDS = [
  { id: "k0", title: "ТОЧКА РЕШЕНИЯ", text: "Будущее закрыто печатью. Объявишь план — печать снимется." },
  { id: "k1", title: "ТИХИЙ ДИАПАЗОН", text: "Нет потока — нет края. Отказ от входа это ход." },
  { id: "k2", title: "ХОЛОДНЫЙ РАЗМЕР", text: "Риск объявлен до печати. После — не подкрутить." },
  { id: "k3", title: "ПРОТОКОЛ СЛОМА", text: "Идея без слома — это надежда в графическом виде." },
  { id: "k4", title: "УПРАВЛЯЕМАЯ ПАНИКА", text: "Спред истерит быстрее, чем цена успевает измениться." },
  { id: "k5", title: "ЛОВУШКА ОБЪЁМА", text: "Объём без удержания — приманка, а не подтверждение." },
];

export function rewardFromLesson(lesson: Lesson): number {
  const i = CARDS.findIndex((c) => c.title === lesson.reward.replace("Карта: ", ""));
  return i < 0 ? 0 : i;
}

export function starsForCase(results: Record<string, number>): number {
  return Object.values(results).reduce((s, v) => s + (v >= 78 ? 3 : v >= 55 ? 2 : 1), 0);
}
