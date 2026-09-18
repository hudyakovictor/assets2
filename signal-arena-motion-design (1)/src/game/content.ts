/* ============================================================================
   SIGNAL ARENA — CONTENT LAYER
   MVP source of truth for order of screens, logic, texts, states, training
   sequence, chart behaviour, player decisions, Reveal and scoring.
   Copy voice: repo file style-tone.txt (punk-tabloid crypto satire).
   Historical scenarios are RECONSTRUCTIONS: paths are generated deterministically
   from real event parameters. No fake future data is invented for effect —
   the future of every chart literally does not exist until the Seal.
   ========================================================================== */

export type Candle = {
  o: number; h: number; l: number; c: number; v: number;
  /** bar offset from t0: negative = past (visible), positive = future (locked) */
  b: number;
};

export type SegKind = "up" | "down" | "range" | "spikeUp" | "spikeDown";
export interface Seg { n: number; kind: SegKind; amp: number; vol?: number }

/* MVP: WAIT и NO_TRADE — полноценные решения, не «пропуск». */
export type DecisionId = "enter" | "retest" | "higherTF" | "sizeUp" | "noTrade";

export const DECISIONS: {
  id: DecisionId; ru: string; sub: string; icon: string; tone: string; hero: string; kind: "act" | "wait" | "noTrade";
}[] = [
  { id: "enter", ru: "ВОЙТИ СРАЗУ", sub: "по рынку", icon: "enter", tone: "var(--card-green)", hero: "btn-green", kind: "act" },
  { id: "retest", ru: "ЖДАТЬ РЕТЕСТ И ОБЪЁМ", sub: "WAIT — это решение", icon: "wait", tone: "var(--accent-deep)", hero: "btn-primary", kind: "wait" },
  { id: "higherTF", ru: "СТАРШИЕ ТАЙМФРЕЙМЫ", sub: "свериться с картой", icon: "tfStack", tone: "var(--card-blue)", hero: "btn-blue", kind: "wait" },
  { id: "sizeUp", ru: "УВЕЛИЧИТЬ ПОЗИЦИЮ", sub: "усилить риск", icon: "sizeUp", tone: "var(--card-red)", hero: "btn-red", kind: "act" },
  { id: "noTrade", ru: "НЕ ТОРГОВАТЬ", sub: "NO_TRADE — полноценное решение", icon: "skip", tone: "var(--card-blue)", hero: "btn-ghost", kind: "noTrade" },
];

/* Обязательное обоснование решения (MVP). Выбирается минимум одно. */
export const REASONS: { id: string; ru: string; skill: string }[] = [
  { id: "structure", ru: "Структура за меня", skill: "c01" },
  { id: "volume", ru: "Объём подтверждает", skill: "c03" },
  { id: "liquidity", ru: "Ликвидность собрана", skill: "c04" },
  { id: "htf", ru: "Старший ТФ согласен", skill: "c02" },
  { id: "news", ru: "Новость — контекст, не сигнал", skill: "c33" },
  { id: "risk", ru: "Риск посчитан заранее", skill: "c27" },
  { id: "unknown", ru: "Не знаю эту тему", skill: "c39" },
];

/* Инвалидация: где сценарий мёртв. Обязательна для входа/усиления. */
export const INVALIDATIONS: { id: string; ru: string }[] = [
  { id: "belowZone", ru: "Закрытие ниже зоны" },
  { id: "levelLost", ru: "Потеря уровня на объёме" },
  { id: "timeStop", ru: "Нет движения за 3 свечи" },
  { id: "htfFlip", ru: "Слом структуры на старшем ТФ" },
];

export interface Scenario {
  id: string;
  code: string;
  round: number;
  asset: string;
  pair: string;
  tf: string;
  headline: string;
  brief: string;
  history: string;
  difficulty: 1 | 2 | 3;
  risk: number;
  xp: number;
  coins: number;
  price0: number;
  tick: number;
  pre: Seg[];
  post: Seg[];
  levelFactor: number;
  zoneFactor: number;
  movePct: number;
  correct: DecisionId;
  hand: string[];
  cards: string[];
  trap: string;
  key: { title: string; line: string; tag: string };
  debrief: { win: string; lose: string; lesson: string; system: string };
  feed: { tag: string; title: string; time: string; kind: "panic" | "whale" | "fund" | "noise" }[];
  tone: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "S01", code: "HALVING_WAKE", round: 1, asset: "BTC", pair: "BTC/USDT", tf: "4H",
    headline: "ПОСЛЕ ХАЛВИНГА ЭМИССИЯ УПАЛА. ЦЕНА НЕ ЗАМЕТИЛА",
    brief: "Диапазон 3 недели. Тонкий рынок. Объём приходит только на пробое границы.",
    history: "Реконструкция: неделя после третьего халвинга BTC",
    difficulty: 1, risk: 1, xp: 120, coins: 45,
    price0: 8900, tick: 25,
    pre: [
      { n: 10, kind: "range", amp: 0.035, vol: 0.6 },
      { n: 7, kind: "up", amp: 0.075, vol: 1.1 },
      { n: 4, kind: "down", amp: 0.022, vol: 0.8 },
    ],
    post: [
      { n: 5, kind: "up", amp: 0.075, vol: 1.8 },
      { n: 6, kind: "up", amp: 0.055, vol: 1.2 },
    ],
    levelFactor: 1.045, zoneFactor: 0.014, movePct: 12.4,
    correct: "retest",
    hand: ["c01", "c03", "c17", "c29", "c28", "c26"],
    cards: ["c03", "c17"], trap: "c28",
    key: { title: "ПРОБОЙ ПОДТВЕРЖДЁН ОБЪЁМОМ", line: "Рынок вернулся к границе и ушёл. Классика: ретест держит.", tag: "СТРУКТУРА" },
    debrief: {
      win: "Ты не погнался за первой свечой. Ты дал рынку вернуться и спросил объём.",
      lose: "Ты вошёл на первой свече. Рынок вернулся за твоими стопами — по расписанию.",
      lesson: "Пробой без ретеста — это обещание. Ретест с объёмом — это факт.",
      system: "Система приняла твоё решение. Прогноз ей не нужен.",
    },
    feed: [
      { tag: "ФУНДАМЕНТ", title: "ЭМИССИЯ УРЕЗАНА ВДВОЕ. ОБЪЁМЫ НА БИРЖАХ МОЛЧАТ", time: "09:12", kind: "fund" },
      { tag: "КИТ", title: "АДРЕС ИЗ 2017-ГО ПЕРЕВЁЛ 1 200 BTC НА БИРЖУ", time: "11:40", kind: "whale" },
      { tag: "ШУМ", title: "DEVELOPER ВЫЛОЖИЛ ФОТО КОТА. ВЫ ЗНАЕТЕ КАКОГО", time: "13:05", kind: "noise" },
      { tag: "ПАНИКА", title: "АНАЛИТИК ВИДИТО-ИЗВЕСТНОГО ФОНДОВОГО ДОМА ПРЕДУПРЕДИЛ ОБО ВСЁМ", time: "15:22", kind: "panic" },
    ],
    tone: "ДЕПАРТАМЕНТ УПРАВЛЯЕМОЙ ПАНИКИ",
  },
  {
    id: "S02", code: "TWEET_FLUSH", round: 2, asset: "BTC", pair: "BTC/USDT", tf: "15М",
    headline: "ОДИН ПОСТ — И ЛИКВИДНОСТЬ УШЛА ДОМОЙ",
    brief: "Импульс вниз идёт без пауз. Свечи длинные, тела красные, отскоки мгновенно продаются.",
    history: "Реконструкция: день энергетического скандала в майском цикле",
    difficulty: 2, risk: 1.4, xp: 170, coins: 60,
    price0: 52000, tick: 50,
    pre: [
      { n: 8, kind: "spikeUp", amp: 0.05, vol: 1.6 },
      { n: 9, kind: "range", amp: 0.03, vol: 0.7 },
      { n: 3, kind: "down", amp: 0.02, vol: 1.1 },
    ],
    post: [
      { n: 6, kind: "spikeDown", amp: 0.14, vol: 2.4 },
      { n: 8, kind: "down", amp: 0.05, vol: 1.3 },
    ],
    levelFactor: 0.985, zoneFactor: 0.012, movePct: -19.8,
    correct: "higherTF",
    hand: ["c08", "c29", "c02", "c16", "c21", "c35"],
    cards: ["c08", "c29"], trap: "c16",
    key: { title: "ЭФФЕКТ НОВОСТИ ЗАКОНЧИЛСЯ. ТРЕНД ПРОДОЛЖИЛСЯ", line: "Старший таймфрейм всё это время был медвежьим. Твит был лишь ускорителем.", tag: "НОВОСТЬ" },
    debrief: {
      win: "Ты не стал спорить с ножом. Ты поднялся на старший таймфрейм и увидел, кто здесь главный.",
      lose: "Ты купил падение, потому что «уже дёшево». Дёшево — это не аргумент.",
      lesson: "Новость ускоряет существующий тренд. Она не меняет его направление.",
      system: "Рынок принял твоё решение. Он всегда принимает.",
    },
    feed: [
      { tag: "ПАНИКА", title: "ИНФЛЮЕНСЕР ОТКАЗАЛСЯ ОТ БИТКОИНА. АКТИВ ОТКАЗАЛСЯ ОТ ВАС", time: "14:02", kind: "panic" },
      { tag: "КИТ", title: "В СТАКАНЕ ПОЯВИЛАСЬ СТЕНА НА ПРОДАЖУ", time: "14:11", kind: "whale" },
      { tag: "ШУМ", title: "КАЖДЫЙ ВТОРОЙ ТЕЛЕГРАМ-КАНАЛ ЗНАЛ ЗАРАНЕЕ. ВСЕГДА ЗНАЛИ", time: "14:20", kind: "noise" },
      { tag: "ФУНДАМЕНТ", title: "РЕГУЛЯТОРЫ СНОВА ОБЕСПОКОЕНЫ. ЭТО ИХ РАБОЧЕЕ СОСТОЯНИЕ", time: "14:35", kind: "fund" },
    ],
    tone: "СЛУЖБА ПО ПЕРЕРАСПРЕДЕЛЕНИЮ ЧУЖИХ ДЕНЕГ",
  },
  {
    id: "S03", code: "LUNA_BREAK", round: 3, asset: "LUNA", pair: "LUNA/USDT", tf: "1Ч",
    headline: "ОТВЯЗКА. СЕТЬ ПЕЧАТАЕТ, РЫНОК ЧИТАЕТ",
    brief: "Монета ушла от привязки. Эмиссия растёт. Продавцы не заканчиваются.",
    history: "Реконструкция: начало коллапса алгоритмического стейблкоина",
    difficulty: 3, risk: 1.8, xp: 230, coins: 90,
    price0: 62, tick: 0.1,
    pre: [
      { n: 7, kind: "range", amp: 0.05, vol: 0.8 },
      { n: 5, kind: "down", amp: 0.075, vol: 1.5 },
      { n: 4, kind: "spikeDown", amp: 0.08, vol: 2 },
    ],
    post: [
      { n: 8, kind: "spikeDown", amp: 0.2, vol: 2.6 },
      { n: 7, kind: "down", amp: 0.09, vol: 1.6 },
    ],
    levelFactor: 0.94, zoneFactor: 0.02, movePct: -63.5,
    correct: "higherTF",
    hand: ["c14", "c34", "c27", "c16", "c23", "c04"],
    cards: ["c14", "c34"], trap: "c23",
    key: { title: "ПРОТОКОЛ ПЕЧАТАЕТ. ПРЕДЛОЖЕНИЕ МЕНЯЕТСЯ ЕЖЕЧАСНО", line: "Когда механика протокола ломается, анализ свечей отменяется. Это риск инфраструктуры.", tag: "ИНФРАСТРУКТУРА" },
    debrief: {
      win: "Ты прочитал не свечу, а систему. Так делают те, кто выживает сезон.",
      lose: "Ты купил «дно цены», имея дело с поломкой механики. Дна у поломки нет.",
      lesson: "Сначала проверяй инфраструктуру, потом структуру. Поломанный протокол рисует что угодно.",
      system: "Твой стоп был красивым. Рынок его не оценил.",
    },
    feed: [
      { tag: "ФУНДАМЕНТ", title: "ПРИВЯЗКА УШЛА. АЛГОРИТМ ОБЕЩАЕТ СПРАВИТЬСЯ САМ", time: "02:14", kind: "fund" },
      { tag: "КИТ", title: "КРУПНЫЙ ДЕРЖАТЕЛЬ ВЫШЕЛ ЧЕРЕЗ МОСТ. МОСТ ЗАКРЫЛСЯ", time: "02:40", kind: "whale" },
      { tag: "ПАНИКА", title: "ВЫВОДЫ ЗАМОРОЖЕНЫ. ПАНИКА ИДЁТ ПЕШКОМ", time: "03:05", kind: "panic" },
      { tag: "ШУМ", title: "КАНАЛ ПООБЕЩАЛ «ВСЁ ВЕРНЁТСЯ К НОРМЕ». ОН УЖЕ ОБЕЩАЛ", time: "03:31", kind: "noise" },
    ],
    tone: "ПРОТОКОЛ КОЛЛЕКТИВНОГО ОТРИЦАНИЯ",
  },
  {
    id: "S04", code: "FTX_GAP", round: 4, asset: "BTC", pair: "BTC/USDT", tf: "1Ч",
    headline: "БИРЖА ПРЕКРАТИЛА ВЫВОДЫ. БАЛАНСЫ ОКАЗАЛИСЬ МНЕНИЕМ",
    brief: "Гэп вниз, широкие спреды, тонкая книга. Ты не знаешь, где твои деньги.",
    history: "Реконструкция: неделя краха биржи из топ-3",
    difficulty: 3, risk: 1.6, xp: 210, coins: 80,
    price0: 17600, tick: 10,
    pre: [
      { n: 9, kind: "up", amp: 0.05, vol: 1 },
      { n: 6, kind: "range", amp: 0.035, vol: 0.7 },
    ],
    post: [
      { n: 5, kind: "spikeDown", amp: 0.13, vol: 2.8 },
      { n: 9, kind: "down", amp: 0.045, vol: 1.4 },
    ],
    levelFactor: 1.03, zoneFactor: 0.011, movePct: -15.2,
    correct: "retest",
    hand: ["c15", "c28", "c04", "c14", "c39", "c09"],
    cards: ["c15", "c28"], trap: "c09",
    key: { title: "ПЕРВАЯ СВЕЧА БЫЛА ЛОВУШКОЙ НАД ОБЪЁМОМ", line: "Подтверждения не было ни одного. Уровень был пробит с первого удара.", tag: "ИСТОЧНИК" },
    debrief: {
      win: "Ты требовал подтверждения, пока остальные требовали чуда.",
      lose: "Ты принял сигнал без подтверждения. Сигналом была только новостная лента, а она не торгует.",
      lesson: "Проверяй источник до цены. Источник оказался декорацией.",
      system: "Ликвидация завершена успешно. Виноват пользователь — так записано в отчёте.",
    },
    feed: [
      { tag: "ПАНИКА", title: "ВЫВОДЫ ПРИОСТАНОВЛЕНЫ. ЛИКВИДНОСТЬ ПОКИНУЛА ЗДАНИЕ", time: "08:02", kind: "panic" },
      { tag: "КИТ", title: "КОНКУРЕНТ ПРОСМОТРЕЛ БАЛАНС. БАЛАНСА НЕТ", time: "08:20", kind: "whale" },
      { tag: "ШУМ", title: "ИНСАЙДЕР УВЕРЕН: «ВСЁ ХОРОШО». ИНСАЙДЕР ПРОДАЁТ", time: "08:44", kind: "noise" },
      { tag: "ФУНДАМЕНТ", title: "РЕГУЛЯТОРЫ ОБЕСПОКОЕНЫ ОФИЦИАЛЬНО. ЭТО ИХ ФОРМАТ", time: "09:10", kind: "fund" },
    ],
    tone: "ИНДЕКС ВЕРЫ В ГРАФИК",
  },
  {
    id: "S05", code: "COVID_FLUSH", round: 5, asset: "BTC", pair: "BTC/USDT", tf: "1Ч",
    headline: "ВСЁ ПРОДАНО. ОСОБЕННО ТО, ЧТО НЕЛЬЗЯ ПРОДАТЬ",
    brief: "Каскад ликвидаций заканчивается за одну свечу. Объём — рекордный. Дальше тишина.",
    history: "Реконструкция: глобальная ликвидационная пятница марта 2020",
    difficulty: 2, risk: 1.5, xp: 190, coins: 70,
    price0: 5600, tick: 10,
    pre: [
      { n: 9, kind: "range", amp: 0.04, vol: 0.7 },
      { n: 6, kind: "spikeDown", amp: 0.12, vol: 2.6 },
    ],
    post: [
      { n: 4, kind: "spikeUp", amp: 0.16, vol: 3 },
      { n: 10, kind: "up", amp: 0.055, vol: 1.4 },
    ],
    levelFactor: 0.93, zoneFactor: 0.02, movePct: 21.7,
    correct: "enter",
    hand: ["c04", "c16", "c23", "c05", "c30", "c26"],
    cards: ["c04", "c16"], trap: "c26",
    key: { title: "ЛИКВИДНОСТЬ СОБРАНА. ПРОДАВЦОВ БОЛЬШЕ НЕТ", line: "Свеча выкупила нижнюю зону за минуты. Дальше рынок просто шёл вверх.", tag: "ЛИКВИДНОСТЬ" },
    debrief: {
      win: "Ты купил там, где стояли чужие стопы. Это и есть навык.",
      lose: "Ты ждал подтверждения в ситуации, где подтверждением был сам факт выкупа зоны.",
      lesson: "После настоящей капитуляции вход по зоне даёт лучший R. Ждать идеала здесь дороже.",
      system: "Прибыль зафиксирована. Не привыкай.",
    },
    feed: [
      { tag: "ПАНИКА", title: "ВСЕ АКТИВЫ ПАДАЮТ ВМЕСТЕ. ДИВЕРСИФИКАЦИЯ УВОЛИЛАСЬ", time: "12:04", kind: "panic" },
      { tag: "КИТ", title: "ЗОНА НИЖЕ РЫНКА СЪЕДЕНА ЗА ОДНУ СВЕЧУ", time: "12:26", kind: "whale" },
      { tag: "ФУНДАМЕНТ", title: "ЦЕНТРАЛЬНЫЕ БАНКИ ГОТОВЯТ КАПИТАЛ. ОЧЕРЕДЬ НЕ ВИДНА", time: "12:40", kind: "fund" },
      { tag: "ШУМ", title: "ПРОГНОЗ: «ДАЛЬШЕ ТОЛЬКО НИЖЕ». ПРОГНОЗ БЕСПЛАТНЫЙ", time: "12:52", kind: "noise" },
    ],
    tone: "ПУБЛИЧНЫЙ КОМИТЕТ ПО СПАСЕНИЮ ЛИКВИДНОСТИ",
  },
  {
    id: "S06", code: "ETF_GRIND", round: 6, asset: "BTC", pair: "BTC/USDT", tf: "1Ч",
    headline: "ОДОБРЕНО. НОВОСТЬ ПРОДАЛИ ЗА ДЕВЯТЬ МИНУТ",
    brief: "Новость на всех лентах. Цена уже отработала движение. Открытие — гэп вверх.",
    history: "Реконструкция: день запуска спотового ETF",
    difficulty: 2, risk: 1.3, xp: 160, coins: 55,
    price0: 44500, tick: 25,
    pre: [
      { n: 8, kind: "up", amp: 0.045, vol: 1.2 },
      { n: 6, kind: "spikeUp", amp: 0.05, vol: 2 },
      { n: 3, kind: "down", amp: 0.02, vol: 1.1 },
    ],
    post: [
      { n: 5, kind: "down", amp: 0.06, vol: 1.6 },
      { n: 9, kind: "range", amp: 0.05, vol: 0.9 },
    ],
    levelFactor: 1.01, zoneFactor: 0.009, movePct: -7.8,
    correct: "retest",
    hand: ["c33", "c17", "c08", "c21", "c35", "c38"],
    cards: ["c33", "c17"], trap: "c21",
    key: { title: "КУПИЛ НА НОВОСТИ — ЖДИ РЕТЕСТ", line: "Сообщение было настоящим. Вход на новости — нет.", tag: "НОВОСТЬ" },
    debrief: {
      win: "Ты отделил информацию от сигнала. Это самый дорогой навык в этой игре.",
      lose: "Ты купил заголовок. Заголовок уже куплен кем-то раньше, и он был быстрее.",
      lesson: "Новость — это контекст. Сигнал — это цена, объём и уровень.",
      system: "Налог на надежду уплачен.",
    },
    feed: [
      { tag: "ФУНДАМЕНТ", title: "СПОТОВЫЙ ETF ОДОБРЕН. ЛЕНТЫ ОДНОВРЕМЕННО РАДУЮТСЯ", time: "16:00", kind: "fund" },
      { tag: "КИТ", title: "ПЕРВЫЙ ЧАС ПРИТОКА ЗАПИСАН. ВЫХОД УЖЕ ЗАПИСАН ТОЖЕ", time: "16:22", kind: "whale" },
      { tag: "ПАНИКА", title: "«ПОЕЗД УШЁЛ». ПОЕЗД НЕ ОТПРАВЛЯЛСЯ", time: "16:40", kind: "panic" },
      { tag: "ШУМ", title: "ИНФЛЮЕНСЕР НАЗВАЛ ТАРГЕТ ИЗ БУДУЩЕГО СЕЗОНА", time: "17:05", kind: "noise" },
    ],
    tone: "СЕЗОН ПЕРЕСМОТРА РЕАЛЬНОСТИ",
  },
];

/* ------------------------------- generator -------------------------------- */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedOf(code: string) {
  let h = 2166136261;
  for (let i = 0; i < code.length; i += 1) {
    h ^= code.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function biasOf(kind: SegKind) {
  if (kind === "up" || kind === "spikeUp") return 1;
  if (kind === "down" || kind === "spikeDown") return -1;
  return 0;
}

function digest(segs: Seg[], start: number, rnd: () => number, tick: number, offset: number) {
  const out: Candle[] = [];
  let price = start;
  segs.forEach((seg, si) => {
    const step = (seg.amp / Math.max(1, seg.n)) * price;
    const bias = biasOf(seg.kind);
    for (let i = 0; i < seg.n; i += 1) {
      const noise = (rnd() - 0.5) * step * (bias === 0 ? 2.2 : 1.1);
      const o = price;
      let move = bias === 0 ? noise : step * bias * (0.45 + rnd() * 1.25) + noise * 0.35;
      if (seg.kind === "spikeUp") move = Math.abs(move) * (1 + rnd() * 0.4);
      if (seg.kind === "spikeDown") move = -Math.abs(move) * (1 + rnd() * 0.4);
      const c = Math.max(tick * 4, o + move);
      const bodyAbs = Math.abs(c - o);
      const wickK = seg.kind.startsWith("spike") ? 1.5 + rnd() : 0.5 + rnd();
      const hi = Math.max(o, c) + bodyAbs * 0.18 + wickK * bodyAbs * 0.75 + step * 0.06;
      const lo = Math.min(o, c) - bodyAbs * 0.18 - wickK * bodyAbs * 0.75 - step * 0.06;
      const vol = (0.35 + rnd() * 0.7) * (seg.vol ?? 1) * (1 + Math.min(1.6, bodyAbs / (step || 1)) * 0.7);
      out.push({
        o: +o.toFixed(4), h: +hi.toFixed(4), l: +lo.toFixed(4), c: +c.toFixed(4),
        v: +vol.toFixed(3), b: offset + out.length,
      });
      price = c;
    }
    if (si >= 0) price = +(price * (1 + (rnd() - 0.5) * 0.004)).toFixed(4);
  });
  return out;
}

export interface Series {
  pre: Candle[];
  post: Candle[];
  level: number;
  zone: [number, number];
  target: [number, number];
  t0Price: number;
  lo: number;
  hi: number;
  tick: number;
}

export function buildSeries(s: Scenario): Series {
  const rnd = mulberry32(seedOf(s.code));
  const pre = digest(s.pre, s.price0, rnd, s.tick, 0).map((c, i, arr) => ({ ...c, b: i - arr.length }));
  const t0Price = pre[pre.length - 1].c;
  const post = digest(s.post, t0Price, rnd, s.tick, 1);
  const round = (v: number) => Math.round(v / s.tick) * s.tick;
  const level = round(s.price0 * s.levelFactor);
  const zSpan = s.price0 * s.zoneFactor;
  const rawZone: [number, number] = s.price0 < 100 ? [level, level * 0.965] : [level + zSpan, level - zSpan * 2.2];
  const zone: [number, number] = [Math.max(...rawZone), Math.min(...rawZone)];
  const all = [...pre, ...post];
  const target: [number, number] = [
    post.reduce((m, c) => Math.max(m, c.h), -Infinity),
    post.reduce((m, c) => Math.min(m, c.l), Infinity),
  ];
  return {
    pre, post, level, zone, target, t0Price, tick: s.tick,
    lo: Math.min(...all.map((c) => c.l)) * 0.995,
    hi: Math.max(...all.map((c) => c.h)) * 1.005,
  };
}

/* --------------------------- tutorial sequence ---------------------------- */
export interface TutorialStep {
  id: string;
  step: number;
  total: number;
  title: string;
  idea: string;
  cta: string;
  visual: "candle" | "trend" | "volume" | "risk" | "tf" | "seal";
  cue: string;
  feedback: string;
}

export const TUTORIAL: TutorialStep[] = [
  {
    id: "T1", step: 1, total: 6,
    title: "СВЕЧА КАК КЛИНОК",
    idea: "Тело — решение рынка. Тень — сомнение. Читай оба: один без другого врёт.",
    cta: "НАЙТИ ТЕЛО И ТЕНЬ", visual: "candle",
    cue: "Нажми на тело свечи", feedback: "Верно. Тело — это диапазон между входом и выходом за период.",
  },
  {
    id: "T2", step: 2, total: 6,
    title: "ТРЕНД — ЭТО ПОСЛЕДОВАТЕЛЬНОСТЬ",
    idea: "Рынок не падает. Он пересматривает твою реальность по расписанию. Смотри максимумы и минимумы.",
    cta: "ОТМЕТИТЬ СТРУКТУРУ", visual: "trend",
    cue: "Нажми на последний высший максимум", feedback: "Так читается структура. Пока максимумы растут — рынок на твоей стороне.",
  },
  {
    id: "T3", step: 3, total: 6,
    title: "ОБЪЁМ ГОЛОСУЕТ",
    idea: "Пробой без объёма. Объём молчит. Значит, это была репетиция, а не событие.",
    cta: "ОТЛИЧИТЬ ПРОБОЙ", visual: "volume",
    cue: "Выбери свечу с настоящим объёмом", feedback: "Верно: у настоящего пробоя объём выше среднего минимум в полтора раза.",
  },
  {
    id: "T4", step: 4, total: 6,
    title: "РИСК РАНЬШЕ ЦЕЛИ",
    idea: "Сначала ставка, потом надежда. Один процент капитала — всё, что рынок получает за раунд.",
    cta: "ВЫСТАВИТЬ РИСК", visual: "risk",
    cue: "Выбери зону риска до 1%", feedback: "Правильно. Стоп, который не болит, переживает любую свечу.",
  },
  {
    id: "T5", step: 5, total: 6,
    title: "СТАРШИЙ ТАЙМФРЕЙМ ГЛАВНЫЙ",
    idea: "Старший таймфрейм — начальник младшего. Начальник не в отпуске и не в телеграме.",
    cta: "СВЕРИТЬСЯ С 1Д", visual: "tf",
    cue: "Переключись на 1Д", feedback: "Верно. Младший таймфрейм даёт вход, старший — разрешение на вход.",
  },
  {
    id: "T6", step: 6, total: 6,
    title: "РЕШЕНИЕ И ПЕЧАТЬ",
    idea: "Решение нельзя переиграть. Печать — это признание. Рынок шепнул — ты ответил.",
    cta: "ЗАПЕЧАТАТЬ ВЫБОР", visual: "seal",
    cue: "Удерживай печать", feedback: "Печать поставлена. Дальше рынок говорит без тебя.",
  },
];

/* ------------------------------- academy ---------------------------------- */
export interface Lesson {
  id: string;
  code: string;
  chapter: string;
  title: string;
  minutes: number;
  idea: string;
  bullets: string[];
  visual: "candle" | "trend" | "volume" | "risk" | "tf" | "seal";
  cards: string[];
}

export const LESSONS: Lesson[] = [
  {
    id: "L1", code: "L01", chapter: "АНАТОМИЯ СВЕЧИ", title: "ЧТО РЫНОК ГОВОРИТ ЗА ОДИН БАР", minutes: 4,
    idea: "Свеча — это спор за период. Тело показывает результат, тени — упорство проигравшего.",
    bullets: [
      "Длинное тело без теней: одна из сторон уступила без борьбы.",
      "Длинная тень сверху: покупатели пытались. Попытка записана и проигнорирована.",
      "Тихий бар меньше среднего: рынок не определился — не решение, а пауза.",
    ],
    visual: "candle", cards: ["c01", "c05"],
  },
  {
    id: "L2", code: "L02", chapter: "СТРУКТУРА", title: "ТРЕНД КАК ПОСЛЕДОВАТЕЛЬНОСТЬ АДРЕСОВ", minutes: 5,
    idea: "Тренд — это не цвет. Это адреса, где цена останавливалась и разворачивалась.",
    bullets: [
      "Высшие максимумы и высшие минимумы: рынок идёт по лестнице." ,
      "Слом структуры — первый признак смены власти, а не шума.",
      "Коррекция без объёма живёт дольше, чем кажется.",
    ],
    visual: "trend", cards: ["c01", "c02"],
  },
  {
    id: "L3", code: "L03", chapter: "ОБЪЁМ", title: "ОБЪЁМ — ЭТО ФАКТ", minutes: 5,
    idea: "Большая свеча без объёма — приглашение. Большая свеча с объёмом — решение.",
    bullets: [
      "Импульс на объёме хочет продолжения.",
      "Пробой уровня в тишине обычно возвращается домой.",
      "Объём проверяем на выбранной свече, а не на каждой.",
    ],
    visual: "volume", cards: ["c03", "c33"],
  },
  {
    id: "L4", code: "L04", chapter: "РИСК", title: "ЛИМИТ И ДИСТАНЦИЯ", minutes: 6,
    idea: "Риск считают заранее, чтобы не считать его на свече паники.",
    bullets: [
      "Риск на раунд: не более 1% капитала.",
      "Стоп ставится за структурой, а не за круглым числом.",
      "Сделка имеет смысл от 2R: иначе цена риска не оправдана.",
    ],
    visual: "risk", cards: ["c20", "c22", "c38"],
  },
  {
    id: "L5", code: "L05", chapter: "ТАЙМФРЕЙМЫ", title: "ИЕРАРХИЯ РЕШЕНИЙ", minutes: 5,
    idea: "Старший таймфрейм задаёт ветер. Младший показывает парус.",
    bullets: [
      "Сначала контекст 1Д, потом вход 15М.",
      "Конфликт таймфреймов — это сигнал воздержания.",
      "Смена старшего таймфрейма меняет смысл всей сделки.",
    ],
    visual: "tf", cards: ["c02", "c29"],
  },
  {
    id: "L6", code: "L06", chapter: "ПСИХОЛОГИЯ", title: "ДИСЦИПЛИНА ДОРОЖЕ ОДНОЙ СДЕЛКИ", minutes: 7,
    idea: "Рынок принял твоё решение. Он всегда принимает. Твоя задача — пережить счёт.",
    bullets: [
      "После убытка — только наблюдение и дневник.",
      "Отсутствие сделки — тоже сделка, только бесплатная.",
      "Система должна выжить: капитал — топливо, а не ставка.",
    ],
    visual: "seal", cards: ["c30", "c31", "c40"],
  },
];

/* ------------------------------- meta data -------------------------------- */
export const NOTIFICATIONS = [
  { tag: "ТУРНИР", title: "СЕЗОН ПЕРЕСМОТРА РЕАЛЬНОСТИ: ФИНАЛ ЧЕРЕЗ 23:14", time: "сейчас" },
  { tag: "РАЗБОР", title: "НОВЫЙ РАЗБОР: ПРОБОЙ БЕЗ ОБЪЁМА. ОБЪЁМ МОЛЧИТ", time: "40 мин" },
  { tag: "ЛИГА", title: "ТЫ ПОДНЯЛСЯ В ЛИГУ II. КОНКУРЕНТЫ ПРЕДУПРЕЖДЕНЫ", time: "3 ч" },
  { tag: "СЕРИЯ", title: "РИТУАЛ СОХРАНЁН: 6 ДНЕЙ ПОДРЯД", time: "вчера" },
  { tag: "КАРТА", title: "ОТКРЫТА КАРТА c03 · ПОДТВЕРЖДЕНИЕ ОБЪЁМОМ", time: "2 дня" },
];

export const LEADERBOARD = [
  { rank: 1, name: "@structure_only", score: 2480, crest: "gold", me: false },
  { rank: 2, name: "@retest_waitress", score: 2415, crest: "silver", me: false },
  { rank: 3, name: "@whale_watcher", score: 2320, crest: "bronze", me: false },
  { rank: 4, name: "@liquidity_dpt", score: 2190, crest: "steel", me: false },
  { rank: 5, name: "@tradex_dvor", score: 2044, crest: "steel", me: true },
];

export const TOURNAMENT = {
  title: "SEASON: ПЕРЕСМОТР РЕАЛЬНОСТИ",
  fund: "500 000 SIG",
  ends: "23:14:07",
  players: 12480,
  rank: 45,
  percentile: "топ 10%",
  league: { now: "ЛИГА II", next: "ЛИГА I", progress: 0.62 },
  duel: { name: "@structure_only", streak: 5, accuracy: "71%", edge: "ждёт ретест" },
};

export const PROFILE = {
  handle: "@tradex_dvor",
  rank: "АНАЛИТИК III",
  lvl: 7,
  xp: 420,
  xpMax: 600,
  coins: 320,
  stars: 48,
  energy: 5,
  energyMax: 5,
  streak: 6,
  rounds: 24,
  accuracy: 0.62,
  bestR: 3.4,
  discipline: 0.81,
  axes: [
    { k: "СТРУКТУРА", v: 0.72 },
    { k: "ОБЪЁМ", v: 0.64 },
    { k: "РИСК", v: 0.81 },
    { k: "КОНТЕКСТ", v: 0.55 },
    { k: "ДИСЦИПЛИНА", v: 0.78 },
    { k: "ПСИХОЛОГИЯ", v: 0.6 },
  ],
  badges: [
    { title: "РИТУАЛ 6 ДНЕЙ", icon: "flame", note: "дисциплина" },
    { title: "ПЕЧАТЬ БЕЗ ПАНИКИ", icon: "seal", note: "5 раундов" },
    { title: "ОТКАЗ ОТ ВХОДА", icon: "ban", note: "3 сетапа" },
    { title: "СТАРШИЙ ТФ", icon: "tfStack", note: "10 раз" },
  ],
};

export const SERIES_ROUNDS = [
  { round: 1, result: "win", decision: "retest", pct: 12.4, stars: 3 },
  { round: 2, result: "win", decision: "higherTF", pct: -19.8, stars: 2 },
  { round: 3, result: "lose", decision: "sizeUp", pct: -63.5, stars: 0 },
  { round: 4, result: "win", decision: "retest", pct: -15.2, stars: 2 },
  { round: 5, result: "win", decision: "enter", pct: 21.7, stars: 3 },
];
