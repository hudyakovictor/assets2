/* =====================================================================
   SIGNAL ARENA — PAGE INVENTORY P01–P34 (source of truth)
   Источник: game.html (MVP-прототип) — Часть 1: кадры 01–15 раскадровки,
   Часть 2: экраны A–P. Плюс 3 сервисных состояния (loading/locked/error).
   Эта карта — структурная, без выдуманных экранов.
   ===================================================================== */

export type Kind =
  | "splash"
  | "tutorialTap"
  | "fact"
  | "decision2"
  | "reasoning"
  | "seal"
  | "reveal"
  | "scoreFirst"
  | "manifesto"
  | "invalidation"
  | "scoreProcess"
  | "contradiction"
  | "lesson"
  | "chapterDone"
  | "applyCard"
  | "academy"
  | "academyTopic"
  | "deck"
  | "loadout"
  | "arenaHub"
  | "runChart"
  | "factsSheet"
  | "decisionPanel"
  | "revealFull"
  | "scoreFull"
  | "debrief"
  | "profile"
  | "notifications"
  | "settings"
  | "noAttempts"
  | "unknownTopic"
  | "loading"
  | "locked"
  | "error";

export type ChartTreatment = "line-glow" | "area" | "candles" | "minimal";
export type Motion = "mp-fade-rise" | "mp-pop-in" | "mp-slide-in" | "mp-pulse-glow" | "mp-sweep" | "mp-none";
export type RevealFx = "scan" | "wipe" | "flip" | "shatter";
export type Fit = "cover" | "contain";

export const CHART_TREATMENTS: ChartTreatment[] = ["line-glow", "area", "candles", "minimal"];
export const MOTIONS: Motion[] = ["mp-fade-rise", "mp-pop-in", "mp-slide-in", "mp-pulse-glow"];
export const REVEALS: RevealFx[] = ["scan", "wipe", "flip", "shatter"];
export const TINTS = ["#2EE6C8", "#D0B24A", "#4C6180", "#C56861"];

/* Обязательное действие, без которого CTA не активен */
export type Gate =
  | "none"
  | "tapChart" // P02: тапнуть в место падения
  | "decision" // выбран вариант направления
  | "reasoning" // выбрано обоснование
  | "fact" // отмечен минимум 1 факт (G)
  | "decisionFull" // на панели решения выбран один из 4 вариантов
  | "acknowledge"; // просто кнопка

export type Variant = {
  vid: string;
  letter: "A" | "B" | "C" | "D";
  assetId: string;
  slot: string;
  source: string;
  placement: string;
  purpose: string;
  chart: ChartTreatment;
  reveal: RevealFx;
  motion: Motion;
  fit: Fit;
  scale: number;
  posX: number;
  posY: number;
  opacity: number;
  crop: string;
  tint: string;
  fallback: string;
};

export type Page = {
  id: string;
  title: string;
  section: string;
  state: string;
  source: string;
  kind: Kind;
  topBar: boolean;
  nav: boolean;
  gate: Gate;
  hasChart?: boolean;
  chartSealed?: boolean; // будущее скрыто до reveal
  hasReveal?: boolean;
  heroIds: string[];
  copy: {
    eyebrow?: string;
    title: string;
    body?: string;
    cta: string;
    ctaGhost?: string; // вторичное действие
    hint?: string;
    note?: string;
    progress?: [number, number];
    meta?: [string, string][];
  };
};

const SC = "skill-card-icons.zip";
const TB = "topbar.zip";
const PROC = "procedural (нет ассета в репо)";
const c = (n: number) => `c${String(n).padStart(2, "0")}`;

export const PAGES: Page[] = [
  /* =============== ЧАСТЬ 1 · ПЕРВОЕ ОТКРЫТИЕ (S01–S15) =============== */
  {
    id: "P01",
    title: "Первое открытие",
    section: "Раскадровка · первое открытие",
    state: "splash · без Top Bar и навигации",
    source: "game.html · кадр 01",
    kind: "splash",
    topBar: false,
    nav: false,
    gate: "acknowledge",
    heroIds: ["lightning", "star", "coin", "gear"],
    copy: {
      eyebrow: "ОБУЧЕНИЕ НА ИСТОРИИ",
      title: "Учись понимать графики",
      body: "Реальные ситуации из прошлого. Без денег и без риска.",
      cta: "Начать",
      hint: "Это займёт 2 минуты",
    },
  },
  {
    id: "P02",
    title: "Туториал 1/4 · первое действие",
    section: "Раскадровка · первое открытие",
    state: "tutorial · график, будущее скрыто",
    source: "game.html · кадр 02",
    kind: "tutorialTap",
    topBar: true,
    nav: false,
    gate: "tapChart",
    hasChart: true,
    chartSealed: true,
    heroIds: [c(1), c(2), c(29), c(5)],
    copy: {
      eyebrow: "ШАГ 1 ИЗ 4",
      title: "Ткни в то место, где цена падала",
      cta: "Дальше",
      hint: "Пока ничего решать не нужно — это не решение и не ставка",
      progress: [1, 4],
    },
  },
  {
    id: "P03",
    title: "Туториал 2/4 · один факт",
    section: "Раскадровка · первое открытие",
    state: "tutorial · факт до решения",
    source: "game.html · кадр 03",
    kind: "fact",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    hasChart: true,
    chartSealed: true,
    heroIds: [c(25), c(15), c(8), c(31)],
    copy: {
      eyebrow: "ШАГ 2 ИЗ 4",
      title: "Как двигалась цена",
      body: "Факт: три дня цена стояла на одном месте. На факты можно опираться в решении.",
      cta: "Дальше",
      progress: [2, 4],
    },
  },
  {
    id: "P04",
    title: "Туториал 3/4 · два варианта",
    section: "Раскадровка · первое открытие",
    state: "tutorial · бинарное решение",
    source: "game.html · кадр 04",
    kind: "decision2",
    topBar: true,
    nav: false,
    gate: "decision",
    hasChart: true,
    chartSealed: true,
    heroIds: [c(16), c(24), c(17), c(27)],
    copy: {
      eyebrow: "ШАГ 3 ИЗ 4",
      title: "Что будет дальше?",
      cta: "Дальше",
      hint: "Изменить решение после подтверждения будет нельзя",
      progress: [3, 4],
    },
  },
  {
    id: "P05",
    title: "Туториал 4/4 · обоснование",
    section: "Раскадровка · первое открытие",
    state: "tutorial · выбор обоснования",
    source: "game.html · кадр 05",
    kind: "reasoning",
    topBar: true,
    nav: false,
    gate: "reasoning",
    heroIds: [c(25), c(28), c(31), c(27)],
    copy: {
      eyebrow: "ШАГ 4 ИЗ 4",
      title: "На что вы опирались?",
      cta: "Подтвердить решение",
      hint: "Выберите то, что честно. Это влияет на оценку.",
      note: "Один из ответов — «Просто кажется»: пустое поле для ввода в MVP запрещено, честный пустой ответ — это отдельный вариант.",
      progress: [4, 4],
    },
  },
  {
    id: "P06",
    title: "Печать решения (Seal)",
    section: "Раскадровка · первое открытие",
    state: "seal · решение заблокировано",
    source: "game.html · кадр 06",
    kind: "seal",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    hasChart: true,
    chartSealed: true,
    heroIds: [c(19), c(20), c(22), c(24)],
    copy: {
      eyebrow: "РЕШЕНИЕ ЗАФИКСИРОВАНО",
      title: "Решение принято",
      body: "Изменить уже нельзя.",
      cta: "Смотреть, что было дальше",
    },
  },
  {
    id: "P07",
    title: "Reveal · что было дальше",
    section: "Раскадровка · первое открытие",
    state: "reveal · будущее раскрыто",
    source: "game.html · кадр 07",
    kind: "reveal",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    hasChart: true,
    hasReveal: true,
    heroIds: [c(1), c(10), c(3), c(6)],
    copy: {
      eyebrow: "ЧТО БЫЛО ДАЛЬШЕ",
      title: "Цена упала",
      body: "Вы выбрали «упадёт» — направление совпало.",
      cta: "Показать оценку",
    },
  },
  {
    id: "P08",
    title: "Оценка · две строки",
    section: "Раскадровка · первое открытие",
    state: "score · первые метрики процесса",
    source: "game.html · кадр 08",
    kind: "scoreFirst",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    heroIds: ["star", "coin", "lightning", "gear"],
    copy: {
      eyebrow: "ОЦЕНКА",
      title: "Направление угадано",
      body: "Но это совпадение, а не понимание. Остальные строки появятся, когда вы начнёте ими пользоваться.",
      cta: "Дальше",
      meta: [
        ["Направление", "95"],
        ["Обоснование", "18"],
      ],
      note: "Метка «повезло»: угадывать можно один раз — системно это не работает.",
    },
  },
  {
    id: "P09",
    title: "Главная мысль игры",
    section: "Раскадровка · первое открытие",
    state: "manifesto · без Top Bar и навигации",
    source: "game.html · кадр 09",
    kind: "manifesto",
    topBar: false,
    nav: false,
    gate: "acknowledge",
    heroIds: [c(31), c(25), c(33), c(40)],
    copy: {
      eyebrow: "ПРАВИЛО АРЕНЫ",
      title: "Вы угадали. Но объяснить не смогли.",
      body: "Здесь считается второе. Угадать можно один раз. Понимать — всегда.",
      cta: "Понял",
    },
  },
  {
    id: "P10",
    title: "Заход 2 · инвалидация обязательна",
    section: "Раскадровка · заход 2",
    state: "decision · поле «я пойму, что ошибся»",
    source: "game.html · кадр 10",
    kind: "invalidation",
    topBar: true,
    nav: false,
    gate: "decision",
    hasChart: true,
    chartSealed: true,
    heroIds: [c(19), c(20), c(21), c(22)],
    copy: {
      eyebrow: "ЗАХОД 2 · ДНЕВНОЙ ГРАФИК",
      title: "Ваше решение",
      body: "До подтверждения нужно указать, при каком условии идея признаётся неверной. Без инвалидации решения нет.",
      cta: "Подтвердить",
      hint: "Я пойму, что ошибся, если цена уйдёт ниже вчерашнего низа.",
    },
  },
  {
    id: "P11",
    title: "Заход 2 · процесс важнее результата",
    section: "Раскадровка · заход 2",
    state: "score · направление не угадано, процесс сильный",
    source: "game.html · кадр 11",
    kind: "scoreProcess",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    heroIds: [c(31), c(19), c(27), c(32)],
    copy: {
      eyebrow: "ОЦЕНКА",
      title: "Вы не угадали — и это нормально",
      body: "Решение было разумным. Оценивается то, как вы пришли к нему, а не только итог.",
      cta: "Дальше",
      meta: [
        ["Направление", "20"],
        ["Обоснование", "88"],
        ["Знали, когда остановиться", "90"],
      ],
      note: "Итог 78 · думал + не повезло.",
    },
  },
  {
    id: "P12",
    title: "Заход 3 · факты противоречат",
    section: "Раскадровка · заход 3",
    state: "gate · не хватает приёма → Академия",
    source: "game.html · кадр 12",
    kind: "contradiction",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    hasChart: true,
    chartSealed: true,
    heroIds: [c(3), c(11), c(26), c(7)],
    copy: {
      eyebrow: "ЗАХОД 3 · ФАКТЫ СПОРЯТ",
      title: "Один факт говорит вверх, другой — вниз",
      body: "Цена росла три дня, но покупки становятся всё слабее. Чтобы разобраться, нужен приём — он есть в Академии.",
      cta: "Открыть Академию",
      ctaGhost: "Решить наугад",
      note: "«Решить наугад» — это и есть ловушка: оно не штрафует жёстко, но и не даёт роста.",
    },
  },
  {
    id: "P13",
    title: "Академия · урок 60 секунд",
    section: "Раскадровка · заход 3 → Академия",
    state: "lesson · один приём",
    source: "game.html · кадр 13",
    kind: "lesson",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    hasChart: true,
    heroIds: [c(3), c(26), c(17), c(24)],
    copy: {
      eyebrow: "ГЛАВА 1 · УРОК 1 ИЗ 3",
      title: "Кто двигает цену",
      body: "Цена растёт, пока есть кому покупать. Смотрите не на высоту роста, а на то, кто его держит.",
      cta: "Дальше",
      hint: "60 секунд · Академия не расходует попытки",
      progress: [1, 3],
    },
  },
  {
    id: "P14",
    title: "Глава пройдена · 4 карты, 1 слот",
    section: "Раскадровка · Академия",
    state: "reward · выбрать одну карту в раунд",
    source: "game.html · кадр 14",
    kind: "chapterDone",
    topBar: true,
    nav: false,
    gate: "decision",
    heroIds: [c(1), c(3), c(2), c(28)],
    copy: {
      eyebrow: "ГЛАВА ПРОЙДЕНА",
      title: "В колоде прибавилось",
      body: "Слот на Арене пока один — выберите одну карту, которую возьмёте с собой.",
      cta: "Выбрать карту",
      note: "4 карты открыто · 1 слот в раунде.",
    },
  },
  {
    id: "P15",
    title: "Заход 4 · первое применение карты",
    section: "Раскадровка · заход 4",
    state: "run · карта применена до решения",
    source: "game.html · кадр 15",
    kind: "applyCard",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    hasChart: true,
    chartSealed: true,
    heroIds: [c(35), c(26), c(28), c(33)],
    copy: {
      eyebrow: "ЗАХОД 4 · АКТИВЕН ПРИЁМ",
      title: "Приём подсказывает",
      body: "Покупателей мало — рост ненадёжен. Карта применяется до решения, а не вместо него.",
      cta: "Принять решение",
    },
  },

  /* =============== ЧАСТЬ 2 · ПРОДУКТОВЫЕ ЭКРАНЫ (A–P) =============== */
  {
    id: "P16",
    title: "Академия · дерево тем",
    section: "Академия",
    state: "2 из 8 тем пройдено",
    source: "game.html · экран A",
    kind: "academy",
    topBar: true,
    nav: true,
    gate: "none",
    heroIds: [c(4), c(5), c(6), c(7)],
    copy: {
      eyebrow: "АКАДЕМИЯ",
      title: "Дерево тем",
      cta: "Продолжить тему",
      hint: "2 / 8 тем · уроки бесплатны и не тратят попытки",
    },
  },
  {
    id: "P17",
    title: "Тема · урок «Рост без покупателей»",
    section: "Академия",
    state: "урок 2 из 4 · прогресс 50%",
    source: "game.html · экран B",
    kind: "academyTopic",
    topBar: true,
    nav: true,
    gate: "acknowledge",
    hasChart: true,
    heroIds: [c(8), c(10), c(12), c(14)],
    copy: {
      eyebrow: "ТЕМА · РОСТ БЕЗ ПОКУПАТЕЛЕЙ",
      title: "Так выглядит ловушка",
      body: "Цена идёт вверх, но сделок всё меньше. Скоро поднимать цену будет некому.",
      cta: "Дальше",
      hint: "Карта этой темы откроется в конце главы",
      progress: [2, 4],
    },
  },
  {
    id: "P18",
    title: "Колода · карты навыков",
    section: "Колода навыков",
    state: "7 из 40 карт открыто",
    source: "game.html · экран C",
    kind: "deck",
    topBar: true,
    nav: true,
    gate: "none",
    heroIds: [c(1), c(16), c(25), c(34)],
    copy: {
      eyebrow: "МОИ ПРИЁМЫ",
      title: "Карты навыков",
      cta: "Открыть новые приёмы в Академии",
      ctaGhost: "Собрать в раунд",
      hint: "7 / 40",
    },
  },
  {
    id: "P19",
    title: "Сборка перед заходом",
    section: "Колода навыков",
    state: "loadout · 1 карта, 2 слота заперты",
    source: "game.html · экран D",
    kind: "loadout",
    topBar: true,
    nav: true,
    gate: "acknowledge",
    heroIds: [c(3), c(1), c(2), c(24)],
    copy: {
      eyebrow: "СБОРКА",
      title: "Что берёте с собой",
      body: "Незнакомая тема в заходе не портит статистику.",
      cta: "На Арену · 1 попытка",
      hint: "3 слота: один занят приёмом, два откроются позже",
    },
  },
  {
    id: "P20",
    title: "Арена · главный экран",
    section: "Арена",
    state: "lobby · незаконченный заход, серия 4 дня",
    source: "game.html · экран E",
    kind: "arenaHub",
    topBar: true,
    nav: true,
    gate: "none",
    heroIds: [c(13), c(14), c(18), c(20)],
    copy: {
      eyebrow: "АРЕНА · СЕРИЯ 4 ДНЯ",
      title: "Арена",
      cta: "Продолжить заход",
      ctaGhost: "Свободный заход",
      hint: "Попытки восстановятся через 24 минуты",
      note: "Слабые места: часто решаете без факта · редко решаете, когда остановиться.",
    },
  },
  {
    id: "P21",
    title: "Полный заход · зона графика и источников",
    section: "Арена · полный заход",
    state: "run · график со скрытым будущим + источники",
    source: "game.html · экран F",
    kind: "runChart",
    topBar: true,
    nav: true,
    gate: "acknowledge",
    hasChart: true,
    chartSealed: true,
    heroIds: [c(1), c(2), c(3), c(8)],
    copy: {
      eyebrow: "ДНЕВНОЙ ГРАФИК · СИТУАЦИЯ ИЗ ПРОШЛОГО",
      title: "Здесь цена долго стояла",
      cta: "Принять решение",
      hint: "Источники: график · старший таймфрейм · сделки · новости · проект",
      note: "В раунде одна карта приёма и один пустой слот.",
    },
  },
  {
    id: "P22",
    title: "Источник фактов · нижний лист",
    section: "Арена · полный заход",
    state: "bottom sheet · минимум 1 факт",
    source: "game.html · экран G",
    kind: "factsSheet",
    topBar: true,
    nav: false,
    gate: "fact",
    hasChart: true,
    chartSealed: true,
    heroIds: [c(3), c(11), c(7), c(1)],
    copy: {
      eyebrow: "СДЕЛКИ И ОБЪЁМЫ",
      title: "На что опереться",
      body: "Выберите как минимум один факт. Решение без факта невозможно.",
      cta: "Готово",
      hint: "Выбрано фактов: 0 · минимум для решения — 1",
    },
  },
  {
    id: "P23",
    title: "Панель решения · 4 действия",
    section: "Арена · полный заход",
    state: "decision · WAIT и NO_TRADE равноправны",
    source: "game.html · экран H",
    kind: "decisionPanel",
    topBar: true,
    nav: false,
    gate: "decisionFull",
    hasChart: true,
    chartSealed: true,
    heroIds: [c(16), c(17), c(19), c(24)],
    copy: {
      eyebrow: "ВАШЕ РЕШЕНИЕ",
      title: "Что делаете?",
      cta: "Подтвердить",
      hint: "Лонг, шорт, подождать или не входить — четыре равноправных действия.",
      note: "Обязательны: направление/действие, факты («опираюсь на»), инвалидация и уверенность.",
    },
  },
  {
    id: "P24",
    title: "Reveal полного захода",
    section: "Арена · полный заход",
    state: "reveal · результат и сработавшая инвалидация",
    source: "game.html · экран I",
    kind: "revealFull",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    hasChart: true,
    hasReveal: true,
    heroIds: [c(6), c(10), c(13), c(1)],
    copy: {
      eyebrow: "ЧТО БЫЛО ДАЛЬШЕ",
      title: "Развернулась",
      body: "Рост продолжился один день, затем цена вернулась ниже точки входа. Ваша отметка инвалидации сработала бы вовремя.",
      cta: "Оценка",
    },
  },
  {
    id: "P25",
    title: "Оценка по строкам · процесс",
    section: "Арена · полный заход",
    state: "score · 6 метрик, итог 74",
    source: "game.html · экран J",
    kind: "scoreFull",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    heroIds: ["star", "coin", "lightning", "gear"],
    copy: {
      eyebrow: "ОЦЕНКА",
      title: "Решение разумное · результат неудачный",
      body: "Итог 74. Оценивается мышление, а не совпадение с рынком.",
      cta: "Разбор",
      meta: [
        ["Учли общую картину", "72"],
        ["На что опирались", "85"],
        ["Знали, когда остановиться", "90"],
        ["Насколько рисковали", "58"],
        ["Следовали плану", "64"],
        ["Уверенность совпала", "40"],
      ],
      note: "Легенда: думал+повезло · думал+не повезло · наугад+повезло · наугад+не повезло.",
    },
  },
  {
    id: "P26",
    title: "Разбор и похожая ситуация",
    section: "Арена · полный заход",
    state: "debrief · повторяющаяся ошибка",
    source: "game.html · экран K",
    kind: "debrief",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    hasChart: true,
    heroIds: [c(26), c(35), c(33), c(32)],
    copy: {
      eyebrow: "РАЗБОР",
      title: "Почему это сработало",
      body: "Главное наблюдение: рост был, но покупателей становилось меньше, а вы всё равно вошли. Это повторяется уже 4 раза из 6 последних заходов.",
      cta: "Ещё заход · 1 попытка",
      note: "Через 3 дня придёт похожая ситуация на другом активе.",
    },
  },
  {
    id: "P27",
    title: "Профиль · как вы принимаете решения",
    section: "Профиль",
    state: "profile · картина мышления, не витрина",
    source: "game.html · экран L",
    kind: "profile",
    topBar: true,
    nav: true,
    gate: "none",
    heroIds: ["gear", "star", "coin", "lightning"],
    copy: {
      eyebrow: "ПРОФИЛЬ",
      title: "Как вы принимаете решения",
      cta: "Куда идти дальше",
      ctaGhost: "Выйти",
      hint: "63 захода · 7 приёмов · серия 4 дня",
      note: "Это не витрина достижений: здесь видны повторяющиеся ловушки.",
    },
  },
  {
    id: "P28",
    title: "Уведомления",
    section: "Сервисные экраны",
    state: "list · 4 уведомления",
    source: "game.html · экран M",
    kind: "notifications",
    topBar: true,
    nav: false,
    gate: "none",
    heroIds: ["bell", "lightning", c(8), "star"],
    copy: {
      eyebrow: "УВЕДОМЛЕНИЯ",
      title: "Что произошло",
      cta: "Понятно",
    },
  },
  {
    id: "P29",
    title: "Настройки",
    section: "Сервисные экраны",
    state: "settings · язык/звук/анимация/напоминания/термины",
    source: "game.html · экран N",
    kind: "settings",
    topBar: true,
    nav: false,
    gate: "none",
    heroIds: ["gear", "bell", "star", "coin"],
    copy: {
      eyebrow: "НАСТРОЙКИ",
      title: "Интерфейс и звук",
      cta: "Готово",
      ctaGhost: "Выйти",
      note: "Профессиональные термины выключены по умолчанию — режим для тех, кто уже торговал.",
    },
  },
  {
    id: "P30",
    title: "Попытки закончились",
    section: "Сервисные экраны",
    state: "no attempts · барьер ведёт в Академию",
    source: "game.html · экран O",
    kind: "noAttempts",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    heroIds: ["lightning", c(34), c(35), c(38)],
    copy: {
      eyebrow: "0 ПОПЫТОК",
      title: "Попытки закончились",
      body: "Следующая через 26 минут. Академия не расходует попытки и работает всегда.",
      cta: "Пройти тему в Академии",
      ctaGhost: "Восстановить за 10 монет",
      note: "Жёсткого paywall нет: учиться можно бесконечно и бесплатно.",
    },
  },
  {
    id: "P31",
    title: "Незнакомая тема в заходе",
    section: "Сервисные экраны",
    state: "growth zone · без штрафа",
    source: "game.html · экран P",
    kind: "unknownTopic",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    hasChart: true,
    heroIds: [c(33), c(8), c(26), c(15)],
    copy: {
      eyebrow: "ЗОНА РОСТА",
      title: "Здесь работал приём, которого вы ещё не знаете",
      body: "Это не считается ошибкой. Тема «Новости»: 3 урока, 4 минуты.",
      cta: "Пройти эту тему",
      ctaGhost: "Потом",
      note: "Незнакомая тема не штрафуется.",
    },
  },

  /* =============== СЕРВИСНЫЕ СОСТОЯНИЯ (32–34) =============== */
  {
    id: "P32",
    title: "Загрузка ассетов",
    section: "Состояния",
    state: "loading · скелет формы контента",
    source: "структурное требование · отдельного кадра в MVP нет",
    kind: "loading",
    topBar: false,
    nav: false,
    gate: "none",
    heroIds: ["gear", "lightning", "star", "coin"],
    copy: {
      eyebrow: "ЗАГРУЗКА",
      title: "Готовим сценарии и колоду",
      body: "Архивы репозитория проверяются: skill-card-icons.zip и topbar.zip.",
      cta: "Подготовка…",
    },
  },
  {
    id: "P33",
    title: "Карта навыка заблокирована",
    section: "Состояния",
    state: "locked · условие открытия",
    source: "структурное требование · состояние карты из экранов C/P",
    kind: "locked",
    topBar: true,
    nav: true,
    gate: "acknowledge",
    heroIds: [c(36), c(37), c(38), c(40)],
    copy: {
      eyebrow: "КАРТА ЗАКРЫТА",
      title: "Ещё не открыто",
      body: "Карта откроется после урока «Сжатие волатильности» в теме «Режим рынка». Иконка не подменяется заглушкой.",
      cta: "Открыть урок",
      ctaGhost: "Позже",
    },
  },
  {
    id: "P34",
    title: "Архив/ассеты недоступны",
    section: "Состояния",
    state: "error · ASSET_ARCHIVE_NOT_EXTRACTED",
    source: "структурное требование · отдельного кадра в MVP нет",
    kind: "error",
    topBar: true,
    nav: false,
    gate: "acknowledge",
    heroIds: ["bell", "gear", "coin", "star"],
    copy: {
      eyebrow: "ОШИБКА ЗАГРУЗКИ",
      title: "Не удалось распаковать архив",
      body: "Если среда не может распаковать архив — статус ASSET_ARCHIVE_NOT_EXTRACTED. Реальные ассеты не подменяются временными SVG.",
      cta: "Повторить загрузку",
      note: "Отсутствие одного файла — MISSING_ASSET с точным именем; недоступность всего архива — ASSET_ARCHIVE_NOT_EXTRACTED.",
    },
  },
];

export const LETTERS = ["A", "B", "C", "D"] as const;

export function variantsOf(page: Page): Variant[] {
  return page.heroIds.map((assetId, i) => {
    const letter = LETTERS[i];
    const chart = CHART_TREATMENTS[i % 4];
    const tint = TINTS[i % 4];
    return {
      vid: `${page.id}-${letter}`,
      letter,
      assetId,
      slot:
        page.hasChart && i === 0
          ? "chart"
          : page.kind === "deck" || page.kind === "chapterDone" || page.kind === "loadout"
            ? "skill-card"
            : page.topBar
              ? "hero-icon"
              : "brand-icon",
      source: assetId.startsWith("c")
        ? `${SC} → ${assetId}.svg`
        : assetId === "—"
          ? PROC
          : `${TB} → ${assetId}.svg`,
      placement:
        page.kind === "deck" || page.kind === "chapterDone" || page.kind === "loadout"
          ? "card artwork, центр карточки навыка"
          : page.hasChart && i < 2
            ? "chart area, основной визуал"
            : "hero slot, центр контента",
      purpose:
        page.kind === "lesson"
          ? "объяснить одну мысль шага"
          : page.kind === "scoreFirst" || page.kind === "scoreFull" || page.kind === "scoreProcess"
            ? "показать награду/разбор раунда"
            : "главный визуал экрана",
      chart,
      reveal: REVEALS[i % 4],
      motion: MOTIONS[i % 4],
      fit: i % 2 === 0 ? "contain" : "cover",
      scale: [1, 1.08, 0.94, 1.04][i % 4],
      posX: [50, 50, 46, 54][i % 4],
      posY: [50, 46, 52, 50][i % 4],
      opacity: [1, 0.96, 1, 0.9][i % 4],
      crop: ["full-frame", "tight-8%", "wide+6%", "center-4%"][i % 4],
      tint,
      fallback: assetId.startsWith("c")
        ? `если ${assetId}.svg отсутствует — MISSING_ASSET с точным именем файла`
        : assetId === "—"
          ? "график рендерится процедурно, fallback не требуется"
          : `если ${assetId}.svg отсутствует — MISSING_ASSET, замены нет`,
    };
  });
}

export function assetMatrix(page: Page) {
  return variantsOf(page).flatMap((v) => {
    const rows = [
      {
        pageId: page.id,
        vid: v.vid,
        slot: v.slot,
        assetId: v.assetId,
        source: v.source,
        placement: v.placement,
        purpose: v.purpose,
        fallback: v.fallback,
      },
    ];
    if (page.topBar)
      rows.push({
        pageId: page.id,
        vid: v.vid,
        slot: "topbar",
        assetId: "topbar.html",
        source: `${TB} → topbar.html + lightning/star/coin/bell/gear.svg`,
        placement: "top area, SHARED_TOP_BAR_LOCKED",
        purpose: "навигационный статус: попытки, звёзды, монеты, бейдж",
        fallback: "архив не распакован → ASSET_ARCHIVE_NOT_EXTRACTED; locked React-порт только для геометрии",
      });
    if (page.hasChart)
      rows.push({
        pageId: page.id,
        vid: v.vid,
        slot: "chart-treatment",
        assetId: `chart:${v.chart}`,
        source: PROC,
        placement: "chart area, адаптивная высота",
        purpose: "читаемость истории цены, будущее скрыто до reveal",
        fallback: "при 320px уменьшить сетку, не обрезать CTA",
      });
    if (page.hasReveal)
      rows.push({
        pageId: page.id,
        vid: v.vid,
        slot: "reveal-effect",
        assetId: `reveal:${v.reveal}`,
        source: PROC,
        placement: "overlay поверх chart area",
        purpose: "показать продолжение сценария после печати решения",
        fallback: "reduce-motion → fade",
      });
    return rows;
  });
}

export function findPage(id: string) {
  return PAGES.find((p) => p.id === id);
}
