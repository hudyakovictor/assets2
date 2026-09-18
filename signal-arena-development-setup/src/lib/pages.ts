export type Kind =
  | "splash"
  | "tutorial"
  | "chart"
  | "decision"
  | "confirm"
  | "waiting"
  | "reveal"
  | "score"
  | "breakdown"
  | "academy"
  | "academyTopic"
  | "lesson"
  | "deck"
  | "cardDetail"
  | "arenaLobby"
  | "profile"
  | "state";

export type ChartTreatment = "line-glow" | "area" | "candles" | "minimal";
export type Motion =
  | "mp-fade-rise"
  | "mp-pop-in"
  | "mp-slide-in"
  | "mp-pulse-glow"
  | "mp-sweep"
  | "mp-none";
export type RevealFx = "scan" | "wipe" | "flip" | "shatter";
export type Fit = "cover" | "contain";

export const CHART_TREATMENTS: ChartTreatment[] = [
  "line-glow",
  "area",
  "candles",
  "minimal",
];
export const MOTIONS: Motion[] = [
  "mp-fade-rise",
  "mp-pop-in",
  "mp-slide-in",
  "mp-pulse-glow",
];
export const REVEALS: RevealFx[] = ["scan", "wipe", "flip", "shatter"];
export const TINTS = ["#2EE6C8", "#D0B24A", "#4C6180", "#C56861"];

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
  hasChart?: boolean;
  hasReveal?: boolean;
  heroIds: string[];
  copy: {
    eyebrow?: string;
    title: string;
    body?: string;
    cta: string;
    hint?: string;
    progress?: [number, number];
    meta?: [string, string][];
    note?: string;
  };
};

const TB = "topbar.zip";
const SC = "skill-card-icons.zip";
const PROC = "procedural (нет ассета в репо)";

const c = (n: number) => `c${String(n).padStart(2, "0")}`;

export const PAGES: Page[] = [
  /* ============ ЧАСТЬ 1 · РАСКАДРОВКА: ПЕРВОЕ ОТКРЫТИЕ ============ */
  {
    id: "P01",
    title: "Splash / Welcome",
    section: "Раскадровка · первое открытие",
    state: "first-launch",
    source: "MVP Часть 1 — самое первое открытие",
    kind: "splash",
    topBar: false,
    nav: false,
    heroIds: ["lightning", "star", "coin", "gear"],
    copy: {
      eyebrow: "TELEGRAM MINI APP",
      title: "Signal Arena",
      body: "Разбирай исторические крипто-сценарии. Один сценарий — одно решение.",
      cta: "Начать",
      hint: "3 свободных захода на Арену",
    },
  },
  {
    id: "P02",
    title: "Intro · Ты на Арене",
    section: "Раскадровка · первое открытие",
    state: "tutorial-step",
    source: "MVP Часть 1 — заход 1, новая механика",
    kind: "tutorial",
    topBar: true,
    nav: false,
    heroIds: [c(1), c(7), c(13), c(5)],
    copy: {
      eyebrow: "УРОК · ГДЕ ТЫ",
      title: "Ты на Арене",
      body: "Каждый раунд — реальный кусок истории цены. Ты видишь только то, что видел трейдер в тот момент.",
      cta: "Понятно",
      progress: [1, 4],
    },
  },
  {
    id: "P03",
    title: "Обучение · шаг 2/4 «Сценарий»",
    section: "Раскадровка · первое открытие",
    state: "tutorial-step",
    source: "MVP Часть 1 — заход 1, новая механика",
    kind: "tutorial",
    topBar: true,
    nav: false,
    heroIds: [c(25), c(27), c(31), c(28)],
    copy: {
      eyebrow: "УРОК · СЦЕНАРИЙ",
      title: "Сценарий = история цены",
      body: "График уже идёт. Твоя задача — понять, что происходит прямо сейчас, а не угадать будущее.",
      cta: "Дальше",
      progress: [2, 4],
    },
  },
  {
    id: "P04",
    title: "Обучение · шаг 3/4 «Одно решение»",
    section: "Раскадровка · первое открытие",
    state: "tutorial-step",
    source: "MVP Часть 1 — заход 1, новая механика",
    kind: "tutorial",
    topBar: true,
    nav: false,
    heroIds: [c(16), c(19), c(22), c(24)],
    copy: {
      eyebrow: "УРОК · РЕШЕНИЕ",
      title: "Одно решение на раунд",
      body: "Лонг, шорт или вне рынка. Отменить нельзя — как в реальной торговле.",
      cta: "Дальше",
      progress: [3, 4],
    },
  },
  {
    id: "P05",
    title: "Обучение · шаг 4/4 «Reveal»",
    section: "Раскадровка · первое открытие",
    state: "tutorial-step",
    source: "MVP Часть 1 — заход 1, новая механика",
    kind: "tutorial",
    topBar: true,
    nav: false,
    heroIds: [c(34), c(36), c(38), c(40)],
    copy: {
      eyebrow: "УРОК · ИТОГ",
      title: "Reveal и оценка",
      body: "После решения раскрывается продолжение сценария и выставляется оценка. Урок заканчивается здесь.",
      cta: "На Арену",
      progress: [4, 4],
    },
  },
  {
    id: "P06",
    title: "Заход 1 · График",
    section: "Раскадровка · первое открытие",
    state: "chart-idle",
    source: "MVP Часть 1 — заход 1",
    kind: "chart",
    topBar: true,
    nav: false,
    hasChart: true,
    heroIds: [c(3), c(9), c(11), c(14)],
    copy: {
      eyebrow: "ЗАХОД 1 · BTC/USDT · 2021",
      title: "Что происходит на графике?",
      cta: "К решению",
      hint: "Сценарий скрыт до Reveal",
      meta: [
        ["Таймфрейм", "4H"],
        ["Шагов до исхода", "6"],
      ],
    },
  },
  {
    id: "P07",
    title: "Заход 1 · Решение",
    section: "Раскадровка · первое открытие",
    state: "decision-open",
    source: "MVP Часть 1 — заход 1",
    kind: "decision",
    topBar: true,
    nav: false,
    hasChart: true,
    heroIds: [c(2), c(8), c(12), c(15)],
    copy: {
      eyebrow: "ЗАХОД 1 · РЕШЕНИЕ",
      title: "Твоё решение",
      cta: "Подтвердить",
      hint: "Одно решение на раунд · отменить нельзя",
    },
  },
  {
    id: "P08",
    title: "Заход 1 · Seal",
    section: "Раскадровка · первое открытие",
    state: "seal-confirm",
    source: "MVP Часть 1 — заход 1",
    kind: "confirm",
    topBar: true,
    nav: false,
    hasChart: false,
    heroIds: [c(6), c(10), c(13), c(1)],
    copy: {
      eyebrow: "SEAL · ФИКСАЦИЯ",
      title: "Зафиксировать решение?",
      body: "После Seal изменить решение, обоснование и инвалидацию нельзя.",
      cta: "Seal решение",
    },
  },
  {
    id: "P09",
    title: "Заход 1 · Reveal",
    section: "Раскадровка · первое открытие",
    state: "revealing",
    source: "MVP Часть 1 — заход 1",
    kind: "reveal",
    topBar: true,
    nav: false,
    hasChart: true,
    hasReveal: true,
    heroIds: [c(6), c(10), c(13), c(1)],
    copy: {
      eyebrow: "REVEAL",
      title: "Сценарий раскрыт",
      body: "Продолжение истории: цена не удержала уровень и вернулась в диапазон.",
      cta: "Смотреть оценку",
    },
  },
  {
    id: "P10",
    title: "Заход 1 · Score",
    section: "Раскадровка · первое открытие",
    state: "score-process",
    source: "MVP Часть 1 — заход 2, новая механика",
    kind: "score",
    topBar: true,
    nav: false,
    heroIds: ["star", "coin", "lightning", "gear"],
    copy: {
      eyebrow: "ОЦЕНКА ПРОЦЕССА",
      title: "Решение разобрано",
      body: "Оценены тезис, инвалидация, риск и дисциплина — не только направление цены.",
      cta: "К разбору",
      meta: [["Тезис", "25"], ["Инвалидация", "25"], ["Риск", "20"]],
    },
  },
  {
    id: "P11",
    title: "Заход 1 · Debrief",
    section: "Раскадровка · первое открытие",
    state: "breakdown",
    source: "MVP Часть 1 — заход 2, новая механика",
    kind: "breakdown",
    topBar: true,
    nav: false,
    heroIds: [c(17), c(19), c(21), c(24)],
    copy: {
      eyebrow: "DEBRIEF",
      title: "Почему решение сработало",
      body: "Цена не удержала пробой, а объём не подтвердил продолжение. Инвалидация была определена заранее.",
      cta: "Следующий заход",
      meta: [["Ключ", "нет объёма"], ["Ошибка", "не зафиксирована"]],
    },
  },
  {
    id: "P12",
    title: "Заход 2 · Практика приёма (3/3)",
    section: "Раскадровка · первое открытие",
    state: "skill-practice",
    source: "MVP Часть 1 — заход 2",
    kind: "tutorial",
    topBar: true,
    nav: false,
    heroIds: [c(26), c(29), c(32), c(25)],
    copy: {
      eyebrow: "ЗАХОД 2 · ПРИЁМ",
      title: "Приём применён",
      body: "Карта помогает сформулировать тезис, но решение, обоснование и инвалидацию всё равно задаёт игрок.",
      cta: "Завершить практику",
      progress: [3, 3],
    },
  },
  {
    id: "P13",
    title: "Заход 2 · Практика завершена",
    section: "Раскадровка · первое открытие",
    state: "practice-complete",
    source: "MVP Часть 1 — заход 2",
    kind: "score",
    topBar: true,
    nav: false,
    heroIds: ["star", "coin", "lightning", "gear"],
    copy: {
      eyebrow: "ОЦЕНКА РАУНДА",
      title: "+2 звезды",
      body: "Приём сработал: ты не стал покупать затухающий импульс.",
      cta: "Следующий заход",
      meta: [
        ["Точность входа", "81"],
        ["Дисциплина", "94"],
      ],
    },
  },
  {
    id: "P14",
    title: "Попытки кончились → Академия",
    section: "Раскадровка · первое открытие",
    state: "empty-gate",
    source: "MVP Часть 1 — Академия открывается по нехватке приёма",
    kind: "state",
    topBar: true,
    nav: false,
    heroIds: [c(34), c(35), c(37), c(39)],
    copy: {
      eyebrow: "ПОПЫТКИ ЗАКОНЧИЛИСЬ",
      title: "Нужен новый приём",
      body: "Заходы на Арену восстановятся позже. Но раунд можно пройти сильнее — если открыть новую карту навыка.",
      cta: "Перейти в Академию",
      note: "Академия открывается только когда игрок сам упёрся в нехватку приёма.",
    },
  },

  /* ============ ЧАСТЬ 2 · АКАДЕМИЯ ============ */
  {
    id: "P15",
    title: "Академия · дерево тем",
    section: "Академия",
    state: "default",
    source: "MVP Часть 2 — Академия с деревом тем и уроками",
    kind: "academy",
    topBar: true,
    nav: true,
    heroIds: [c(4), c(5), c(6), c(7)],
    copy: {
      eyebrow: "АКАДЕМИЯ",
      title: "Дерево тем",
      cta: "Продолжить урок",
      hint: "4 темы · 11 уроков",
    },
  },
  {
    id: "P16",
    title: "Академия · тема и уроки",
    section: "Академия",
    state: "topic-open",
    source: "MVP Часть 2 — Академия с деревом тем и уроками",
    kind: "academyTopic",
    topBar: true,
    nav: true,
    heroIds: [c(8), c(10), c(12), c(14)],
    copy: {
      eyebrow: "ТЕМА 2 · СТРУКТУРА",
      title: "Уровни и ложные пробои",
      cta: "Начать урок 3",
      hint: "3 из 4 уроков пройдено",
    },
  },
  {
    id: "P17",
    title: "Урок · теория",
    section: "Академия",
    state: "lesson-card",
    source: "MVP Часть 2 — уроки Академии",
    kind: "lesson",
    topBar: true,
    nav: false,
    heroIds: [c(30), c(31), c(32), c(33)],
    copy: {
      eyebrow: "УРОК 3 · ТЕОРИЯ",
      title: "Ложный пробой",
      body: "Пробой без объёма и ретеста — это вынос стопов. Смотри не на свечу, а на реакцию после неё.",
      cta: "Я понял",
      progress: [2, 3],
    },
  },
  {
    id: "P18",
    title: "Урок завершён · награда",
    section: "Академия",
    state: "reward",
    source: "MVP Часть 2 — уроки Академии",
    kind: "score",
    topBar: true,
    nav: false,
    heroIds: ["star", "coin", "lightning", "gear"],
    copy: {
      eyebrow: "УРОК ЗАВЕРШЁН",
      title: "Новая карта навыка",
      body: "«Ложный пробой» добавлена в колоду. +40 XP, +1 попытка.",
      cta: "В колоду",
      meta: [
        ["XP", "+40"],
        ["Попытки", "+1"],
      ],
    },
  },

  /* ============ КОЛОДА КАРТ НАВЫКОВ ============ */
  {
    id: "P19",
    title: "Колода карт навыков",
    section: "Колода навыков",
    state: "grid",
    source: "MVP Часть 2 — колода карт навыков",
    kind: "deck",
    topBar: true,
    nav: true,
    heroIds: [c(1), c(16), c(25), c(34)],
    copy: {
      eyebrow: "КОЛОДА",
      title: "Карты навыков",
      cta: "Собрать в раунд",
      hint: "40 карт · 33 открыто",
    },
  },
  {
    id: "P20",
    title: "Карта навыка · green",
    section: "Колода навыков",
    state: "detail",
    source: "MVP Часть 2 — колода карт навыков",
    kind: "cardDetail",
    topBar: true,
    nav: true,
    heroIds: [c(1), c(5), c(9), c(13)],
    copy: {
      eyebrow: "КАРТА 01 · GREEN",
      title: "Стоп до входа",
      body: "Риск считается до входа, а не после. Если стоп неочевиден — сделки нет.",
      cta: "Взять в раунд",
      hint: "Группа c01–c15 · green",
    },
  },
  {
    id: "P21",
    title: "Карта навыка · yellow",
    section: "Колода навыков",
    state: "detail",
    source: "MVP Часть 2 — колода карт навыков",
    kind: "cardDetail",
    topBar: true,
    nav: true,
    heroIds: [c(16), c(19), c(22), c(24)],
    copy: {
      eyebrow: "КАРТА 19 · YELLOW",
      title: "Режим рынка",
      body: "Определи фазу: тренд, диапазон, сжатие. Приём меняет интерпретацию графика.",
      cta: "Взять в раунд",
      hint: "Группа c16–c24 · yellow",
    },
  },
  {
    id: "P22",
    title: "Карта навыка · locked",
    section: "Колода навыков",
    state: "locked",
    source: "MVP Часть 2 — обслуживающие состояния",
    kind: "state",
    topBar: true,
    nav: true,
    heroIds: [c(36), c(37), c(38), c(40)],
    copy: {
      eyebrow: "КАРТА ЗАКРЫТА",
      title: "Ещё не открыто",
      body: "Карта откроется после урока «Сжатие волатильности» в теме «Режим рынка».",
      cta: "Открыть урок",
      note: "Empty / locked state — без замены иконки-заглушки.",
    },
  },

  /* ============ ПОЛНЫЙ ЗАХОД НА АРЕНУ ============ */
  {
    id: "P23",
    title: "Арена · выбор сценария",
    section: "Арена · полный заход",
    state: "lobby",
    source: "MVP Часть 2 — полный заход на Арену со всеми зонами",
    kind: "arenaLobby",
    topBar: true,
    nav: true,
    heroIds: [c(2), c(3), c(4), c(6)],
    copy: {
      eyebrow: "АРЕНА",
      title: "Выбери сценарий",
      cta: "Войти в раунд",
      hint: "3 попытки · сценарии исторические",
    },
  },
  {
    id: "P24",
    title: "Арена · бриф сценария",
    section: "Арена · полный заход",
    state: "brief",
    source: "MVP Часть 2 — полный заход на Арену со всеми зонами",
    kind: "lesson",
    topBar: true,
    nav: false,
    heroIds: [c(27), c(28), c(30), c(31)],
    copy: {
      eyebrow: "СЦЕНАРИЙ · SOL/USDT · 2021-05",
      title: "После первого импульса",
      body: "Актив прошёл вертикальный рост и остановился под старым максимумом. Тебе покажут 6 шагов вперед.",
      cta: "Открыть график",
    },
  },
  {
    id: "P25",
    title: "Арена · зона графика",
    section: "Арена · полный заход",
    state: "chart-live",
    source: "MVP Часть 2 — зона графика",
    kind: "chart",
    topBar: true,
    nav: false,
    hasChart: true,
    heroIds: [c(11), c(12), c(13), c(15)],
    copy: {
      eyebrow: "ШАГ 4 / 6",
      title: "Зона графика",
      cta: "К решению",
      hint: "Индикаторы: объём, ATR",
      meta: [
        ["ATR", "высокий"],
        ["Объём", "падает"],
      ],
    },
  },
  {
    id: "P26",
    title: "Арена · зона решения",
    section: "Арена · полный заход",
    state: "decision-open",
    source: "MVP Часть 2 — зона решения игрока",
    kind: "decision",
    topBar: true,
    nav: false,
    hasChart: true,
    heroIds: [c(18), c(20), c(22), c(23)],
    copy: {
      eyebrow: "ЗОНА РЕШЕНИЯ",
      title: "Что делаешь?",
      cta: "Подтвердить",
      hint: "Приём применён · отменить нельзя",
    },
  },
  {
    id: "P27",
    title: "Арена · Seal",
    section: "Арена · полный заход",
    state: "seal-confirm",
    source: "MVP Часть 2 — полный заход на Арену со всеми зонами",
    kind: "confirm",
    topBar: true,
    nav: false,
    heroIds: [c(7), c(8), c(9), c(10)],
    copy: {
      eyebrow: "SEAL · ФИКСАЦИЯ",
      title: "Зафиксировать решение?",
      body: "Проверь решение, тезис и инвалидацию. После Seal изменить их нельзя.",
      cta: "Seal решение",
    },
  },
  {
    id: "P28",
    title: "Арена · решение запечатано",
    section: "Арена · полный заход",
    state: "sealed-waiting",
    source: "MVP Часть 2 — полный заход на Арену со всеми зонами",
    kind: "waiting",
    topBar: true,
    nav: false,
    heroIds: ["gear", "lightning", "coin", "star"],
    copy: {
      eyebrow: "SEALED",
      title: "Решение зафиксировано",
      body: "Изменение заблокировано. Будущее остаётся скрытым до Reveal.",
      cta: "Перейти к Reveal",
    },
  },
  {
    id: "P29",
    title: "Арена · раскрытие",
    section: "Арена · полный заход",
    state: "revealing",
    source: "MVP Часть 2 — раскрытие",
    kind: "reveal",
    topBar: true,
    nav: false,
    hasChart: true,
    hasReveal: true,
    heroIds: [c(35), c(36), c(38), c(39)],
    copy: {
      eyebrow: "REVEAL",
      title: "История продолжилась",
      body: "Ретест не удержался — сценарий ушёл вниз на 14% за 5 свечей.",
      cta: "К оценке",
    },
  },
  {
    id: "P30",
    title: "Арена · оценка",
    section: "Арена · полный заход",
    state: "score",
    source: "MVP Часть 2 — оценка",
    kind: "score",
    topBar: true,
    nav: false,
    heroIds: ["star", "coin", "lightning", "gear"],
    copy: {
      eyebrow: "ОЦЕНКА РАУНДА",
      title: "+2 звезды · +120 монет",
      body: "Вход по структуре, стоп на месте. Приём не понадобился.",
      cta: "К разбору",
      meta: [
        ["Точность входа", "86"],
        ["Риск", "92"],
        ["Дисциплина", "90"],
      ],
    },
  },
  {
    id: "P31",
    title: "Арена · разбор",
    section: "Арена · полный заход",
    state: "breakdown",
    source: "MVP Часть 2 — разбор",
    kind: "breakdown",
    topBar: true,
    nav: false,
    hasChart: true,
    heroIds: [c(33), c(32), c(31), c(30)],
    copy: {
      eyebrow: "РАЗБОР",
      title: "Почему это сработало",
      body: "Объём падал на каждом касании — продавец выдохся. Ретест дал точку с коротким стопом.",
      cta: "Следующий сценарий",
      meta: [
        ["Ключ", "затухание объёма"],
        ["Ошибка", "нет"],
      ],
    },
  },

  /* ============ ПРОФИЛЬ ============ */
  {
    id: "P32",
    title: "Профиль",
    section: "Профиль",
    state: "default",
    source: "MVP Часть 2 — профиль",
    kind: "profile",
    topBar: true,
    nav: true,
    heroIds: ["gear", "star", "coin", "lightning"],
    copy: {
      eyebrow: "ПРОФИЛЬ",
      title: "LVL 7 · 240 / 400 XP",
      cta: "История раундов",
      hint: "Раундов: 46 · точность: 71%",
      meta: [
        ["Звёзды", "18"],
        ["Монеты", "1240"],
      ],
    },
  },

  /* ============ ОБСЛУЖИВАЮЩИЕ ЭКРАНЫ И СОСТОЯНИЯ ============ */
  {
    id: "P33",
    title: "Нет попыток · восстановление",
    section: "Состояния",
    state: "empty-energy",
    source: "MVP Часть 2 — обслуживающие состояния",
    kind: "state",
    topBar: true,
    nav: true,
    heroIds: [c(34), c(35), c(36), c(37)],
    copy: {
      eyebrow: "0 ПОПЫТОК",
      title: "Попытки восстановятся",
      body: "Следующая попытка через 24 минуты. Или возьми раунд за монеты.",
      cta: "Разменять 200 монет",
      note: "Пустое состояние — без блокировки Top Bar.",
    },
  },
  {
    id: "P34",
    title: "Ассеты недоступны / Offline",
    section: "Состояния",
    state: "error",
    source: "MVP Часть 2 — обслуживающие состояния",
    kind: "state",
    topBar: true,
    nav: false,
    heroIds: ["bell", "gear", "coin", "star"],
    copy: {
      eyebrow: "ОШИБКА ЗАГРУЗКИ",
      title: "Ассеты недоступны",
      body: "Не удалось получить архивы из репозитория. Проверь соединение и повтори.",
      cta: "Повторить загрузку",
      note: "Никаких замен и emoji-заглушек.",
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
      slot: page.hasChart
        ? i === 0
          ? "chart"
          : i === 1
            ? "chart"
            : "support-icon"
        : page.kind === "deck" || page.kind === "cardDetail"
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
        page.kind === "deck" || page.kind === "cardDetail"
          ? "card artwork, центр карточки навыка"
          : page.hasChart && i < 2
            ? "chart area, основной визуал"
            : "hero slot, центр контента",
      purpose:
        page.kind === "tutorial"
          ? "объяснить одну мысль шага"
          : page.kind === "score"
            ? "показать награду раунда"
            : page.kind === "state"
              ? "объяснить состояние без заглушек"
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
      fallback:
        assetId.startsWith("c")
          ? `если ${assetId}.svg отсутствует — показать MISSING и соседнюю карту группы`
          : assetId === "—"
            ? "график рендерится процедурно, fallback не требуется"
            : `если ${assetId}.svg отсутствует — блокировать экран с ошибкой`,
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
        placement: "top area, 48–56px, SHARED_TOP_BAR_LOCKED",
        purpose: "навигационный статус: попытки, звёзды, монеты",
        fallback: "если topbar.html отсутствует — экран блокируется с ошибкой",
      });
    if (page.hasChart)
      rows.push({
        pageId: page.id,
        vid: v.vid,
        slot: "chart-treatment",
        assetId: `chart:${v.chart}`,
        source: PROC,
        placement: "chart area, адаптивная высота",
        purpose: "читаемость истории цены",
        fallback: "при 320px — уменьшить сетку, не обрезать CTA",
      });
    if (page.hasReveal)
      rows.push({
        pageId: page.id,
        vid: v.vid,
        slot: "reveal-effect",
        assetId: `reveal:${v.reveal}`,
        source: PROC,
        placement: "overlay поверх chart area",
        purpose: "показать продолжение сценария",
        fallback: "reduce-motion → fade",
      });
    return rows;
  });
}

export function findPage(id: string) {
  return PAGES.find((p) => p.id === id);
}
