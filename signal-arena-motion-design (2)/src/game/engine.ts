export type NodeId = "relay" | "pool" | "infra" | "commons";
export type ActionId = "collect" | "convert" | "stabilize" | "overclock";

export interface NodeDef {
  id: NodeId;
  name: string;
  short: string;
  desc: string;
  baseCost: number;
  max: number;
  hue: string;
  pos: { x: number; y: number };
}

export const NODES: NodeDef[] = [
  { id: "relay", name: "РЕТРАНСЛЯТОР", short: "РЕЛЕ", desc: "Добывает сигнал каждый тик", baseCost: 18, max: 8, hue: "#3ecf8e", pos: { x: 25, y: 26 } },
  { id: "pool", name: "ПУЛ ЛИКВИДНОСТИ", short: "ПУЛ", desc: "Переводит сигнал в кредиты", baseCost: 26, max: 8, hue: "#e0b145", pos: { x: 76, y: 27 } },
  { id: "infra", name: "ИНФРАСЕТЬ", short: "ИНФРА", desc: "Ускоряет узлы, гасит расход", baseCost: 40, max: 6, hue: "#5b8fdb", pos: { x: 24, y: 76 } },
  { id: "commons", name: "КОММУНА", short: "ЛЮДИ", desc: "Возвращает доверие колонии", baseCost: 34, max: 6, hue: "#8f7ee0", pos: { x: 77, y: 73 } },
];

export interface ActionDef {
  id: ActionId;
  label: string;
  sub: string;
  color: string;
  cd: number;
  hold: boolean;
}

export const ACTIONS: ActionDef[] = [
  { id: "collect", label: "Сбор сигнала", sub: "удерживай для потока", color: "#3ecf8e", cd: 0, hold: true },
  { id: "convert", label: "Слить в пул", sub: "80% сигнала → кредиты", color: "#2fd4c4", cd: 6, hold: false },
  { id: "stabilize", label: "Стабилизация", sub: "40 кр → +11 доверия", color: "#5b8fdb", cd: 10, hold: false },
  { id: "overclock", label: "Разгон сети", sub: "×2 на 8 тик, −8 доверия", color: "#ef6b62", cd: 18, hold: false },
];

export interface Device {
  id: string;
  label: string;
  w: number;
  h: number;
  note: string;
}

export const DEVICES: Device[] = [
  { id: "compact", label: "360×780", w: 360, h: 780, note: "Android компакт" },
  { id: "standard", label: "390×844", w: 390, h: 844, note: "iPhone 14/15 · 9:19.5" },
  { id: "pixel", label: "412×915", w: 412, h: 915, note: "Pixel · 9:20" },
];

export interface Params {
  speed: number;
  tapYield: number;
  upkeep: number;
  eventRate: number;
  goalDays: number;
  startSignal: number;
  startCredits: number;
  startTrust: number;
  costMul: number;
  drainCurve: number;
}

export const DEFAULT_PARAMS: Params = {
  speed: 1,
  tapYield: 3,
  upkeep: 1,
  eventRate: 1,
  goalDays: 30,
  startSignal: 14,
  startCredits: 42,
  startTrust: 62,
  costMul: 1,
  drainCurve: 1,
};

export const PRESETS: Record<string, { label: string; p: Partial<Params> }> = {
  calm: { label: "СПОКОЙНО", p: { speed: 1.4, tapYield: 4, upkeep: 0.6, eventRate: 0.6, goalDays: 20, startTrust: 72, costMul: 0.85, drainCurve: 0.7 } },
  standard: { label: "БАЗА", p: { speed: 1, tapYield: 3, upkeep: 1, eventRate: 1, goalDays: 30, startTrust: 62, costMul: 1, drainCurve: 1 } },
  brutal: { label: "ЖЁСТКО", p: { speed: 0.8, tapYield: 2, upkeep: 1.7, eventRate: 1.7, goalDays: 40, startTrust: 48, costMul: 1.25, drainCurve: 1.35 } },
};

export type Tone = "good" | "bad" | "info" | "warn";

export interface LogEntry {
  id: number;
  day: number;
  time: string;
  text: string;
  tag: string;
  tone: Tone;
}

export interface GameEvent {
  id: string;
  title: string;
  body: string;
  tag: string;
  tone: Tone;
  options: { label: string; hint: string; color: string; apply: (s: GameState) => { s: GameState; log: string; tone: Tone } }[];
}

export type QuestMetric = "taps" | "signal" | "credits" | "trust" | "pool" | "maxLevel" | "day" | "level" | "crits";

export interface QuestDef {
  id: string;
  text: string;
  metric: QuestMetric;
  goal: number;
  xp: number;
  credits: number;
}

export const QUESTS: QuestDef[] = [
  { id: "q1", text: "Добудь сигнал 14 тапами", metric: "taps", goal: 14, xp: 60, credits: 25 },
  { id: "q2", text: "Построй РЕЛЕ и накопи 60 сигнала", metric: "signal", goal: 60, xp: 90, credits: 40 },
  { id: "q3", text: "Открой ПУЛ ликвидности", metric: "pool", goal: 1, xp: 120, credits: 60 },
  { id: "q4", text: "Поймай 5 крит-тапов", metric: "crits", goal: 5, xp: 150, credits: 80 },
  { id: "q5", text: "Доведи доверие до 78", metric: "trust", goal: 78, xp: 180, credits: 110 },
  { id: "q6", text: "Любой узел до 3 уровня", metric: "maxLevel", goal: 3, xp: 220, credits: 150 },
  { id: "q7", text: "Продержись 12 дней", metric: "day", goal: 12, xp: 260, credits: 200 },
  { id: "q8", text: "Уровень сети 5", metric: "level", goal: 5, xp: 320, credits: 260 },
];

export interface FlashDelta {
  signal: number;
  credits: number;
  trust: number;
  xp: number;
  leveled: boolean;
}

export interface HistoryPoint {
  trust: number;
  credits: number;
}

export interface GameState {
  status: "live" | "collapsed" | "complete";
  tick: number;
  day: number;
  signal: number;
  credits: number;
  trust: number;
  xp: number;
  level: number;
  levels: Record<NodeId, number>;
  cooldowns: Record<ActionId, number>;
  boost: number;
  combo: number;
  comboTimer: number;
  comboBest: number;
  crits: number;
  quest: number;
  questsDone: string[];
  log: LogEntry[];
  event: GameEvent | null;
  taps: number;
  logSeq: number;
  gainSeq: number;
  hint: string;
  pulse: NodeId | "core" | null;
  flash: FlashDelta | null;
  toast: string | null;
  toastTone: Tone;
  unread: number;
  lastGain: { id: number; v: number; crit: boolean } | null;
  history: HistoryPoint[];
  peak: { trust: number; credits: number; signal: number };
}

export const TICKS_PER_DAY = 8;
export const xpToNext = (level: number) => 320 + (level - 1) * 220;
export const COMBO_WINDOW = 14;
export const CRIT_CHANCE = 0.16;
export const CRIT_MULT = 3;

export function costOf(def: NodeDef, level: number, p: Params) {
  return Math.round(def.baseCost * Math.pow(1.55 * p.costMul, level));
}

const clockOf = (tick: number) => {
  const total = 8 * 60 + tick * 7;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

export function createGame(p: Params = DEFAULT_PARAMS): GameState {
  return {
    status: "live",
    tick: 0,
    day: 1,
    signal: p.startSignal,
    credits: p.startCredits,
    trust: p.startTrust,
    xp: 0,
    level: 1,
    levels: { relay: 0, pool: 0, infra: 0, commons: 0 },
    cooldowns: { collect: 0, convert: 0, stabilize: 0, overclock: 0 },
    boost: 0,
    combo: 0,
    comboTimer: 0,
    comboBest: 0,
    crits: 0,
    quest: 0,
    questsDone: [],
    log: [
      { id: 2, day: 1, time: "08:00", text: "Узел пробуждён, сеть слушает эфир", tag: "СТАРТ", tone: "info" },
      { id: 1, day: 1, time: "07:58", text: "Жми и удерживай ядро — пойдёт поток", tag: "ПОДСКАЗКА", tone: "info" },
    ],
    event: null,
    taps: 0,
    logSeq: 3,
    gainSeq: 1,
    hint: "Жми и удерживай ядро — пойдёт поток",
    pulse: null,
    flash: null,
    toast: null,
    toastTone: "info",
    unread: 0,
    lastGain: null,
    history: [{ trust: p.startTrust, credits: p.startCredits }],
    peak: { trust: p.startTrust, credits: p.startCredits, signal: p.startSignal },
  };
}

function pushLog(s: GameState, text: string, tag: string, tone: Tone): GameState {
  return {
    ...s,
    logSeq: s.logSeq + 1,
    log: [{ id: s.logSeq, day: s.day, time: clockOf(s.tick), text, tag, tone }, ...s.log].slice(0, 48),
    hint: text,
    toast: text,
    toastTone: tone,
    unread: s.unread + 1,
  };
}

function addXp(s: GameState, amount: number): GameState {
  let xp = s.xp + amount;
  let level = s.level;
  let leveled = false;
  while (xp >= xpToNext(level)) {
    xp -= xpToNext(level);
    level += 1;
    leveled = true;
  }
  const bonus = leveled ? level * 20 : 0;
  return {
    ...s,
    xp,
    level,
    credits: s.credits + bonus,
    flash: {
      signal: s.flash?.signal ?? 0,
      credits: (s.flash?.credits ?? 0) + bonus,
      trust: s.flash?.trust ?? 0,
      xp: (s.flash?.xp ?? 0) + amount,
      leveled: leveled || Boolean(s.flash?.leveled),
    },
  };
}

function withDelta(s: GameState, prev: GameState): GameState {
  return {
    ...s,
    flash: {
      signal: s.signal - prev.signal + (s.flash?.signal ?? 0),
      credits: s.credits - prev.credits + (s.flash?.credits ?? 0),
      trust: s.trust - prev.trust + (s.flash?.trust ?? 0),
      xp: s.flash?.xp ?? 0,
      leveled: Boolean(s.flash?.leveled),
    },
  };
}

export function metricValue(s: GameState, m: QuestMetric): number {
  switch (m) {
    case "taps":
      return s.taps;
    case "signal":
      return s.peak.signal;
    case "credits":
      return s.peak.credits;
    case "trust":
      return s.peak.trust;
    case "pool":
      return s.levels.pool;
    case "maxLevel":
      return Math.max(...Object.values(s.levels));
    case "day":
      return s.day;
    case "level":
      return s.level;
    case "crits":
      return s.crits;
    default:
      return 0;
  }
}

function checkQuests(s: GameState): GameState {
  let n = s;
  let guard = 0;
  while (n.quest < QUESTS.length && guard++ < 12) {
    const q = QUESTS[n.quest];
    if (metricValue(n, q.metric) < q.goal) break;
    n = {
      ...n,
      quest: n.quest + 1,
      questsDone: [...n.questsDone, q.id],
      credits: n.credits + q.credits,
    };
    n = addXp(n, q.xp);
    n = pushLog(n, `ЦЕЛЬ ВЫПОЛНЕНА: ${q.text} (+${q.credits} кр, +${q.xp} xp)`, "ЦЕЛЬ", "good");
  }
  return n;
}

function settle(s: GameState, prev: GameState): GameState {
  let n = withDelta(s, prev);
  n = {
    ...n,
    peak: {
      trust: Math.max(n.peak.trust, n.trust),
      credits: Math.max(n.peak.credits, n.credits),
      signal: Math.max(n.peak.signal, n.signal),
    },
  };
  if (n.tick % 2 === 0) {
    n = { ...n, history: [...n.history, { trust: n.trust, credits: n.credits }].slice(-44) };
  }
  if (n.comboTimer > 0 && n.combo > 0) {
    const timer = n.comboTimer - 1;
    n = { ...n, comboTimer: timer, combo: timer <= 0 ? 0 : n.combo };
  }
  return checkQuests(n);
}

export function rates(s: GameState, p: Params) {
  const infraBoost = 1 + s.levels.infra * 0.12;
  const oc = s.boost > 0 ? 2 : 1;
  const comboMul = 1 + Math.min(s.combo, 25) * 0.04;
  const signalGain = s.levels.relay * 0.9 * infraBoost * oc;
  const convert = Math.min(s.signal, s.levels.pool * 1.7 * infraBoost * oc);
  const creditGain = convert * 1.15;
  const total = s.levels.relay + s.levels.pool + s.levels.infra + s.levels.commons;
  const drain = (0.5 + Math.pow(total, p.drainCurve) * 0.2) * p.upkeep * (1 - s.levels.infra * 0.09);
  const trustGain = s.levels.commons * 0.62 - drain;
  return { signalGain, convert, creditGain, trustGain, drain, infraBoost, oc, comboMul };
}

export function tapYieldOf(s: GameState, p: Params) {
  const r = rates(s, p);
  return p.tapYield * (1 + s.levels.relay * 0.09) * (1 + (s.level - 1) * 0.02) * r.comboMul * r.oc;
}

export function step(s: GameState, p: Params): GameState {
  if (s.status !== "live" || s.event) return s;
  const r = rates(s, p);
  const prev = s;
  let n: GameState = {
    ...s,
    tick: s.tick + 1,
    signal: Math.max(0, s.signal + r.signalGain - r.convert),
    credits: s.credits + r.creditGain,
    trust: Math.min(100, s.trust + r.trustGain),
    boost: Math.max(0, s.boost - 1),
    cooldowns: {
      collect: 0,
      convert: Math.max(0, s.cooldowns.convert - 1),
      stabilize: Math.max(0, s.cooldowns.stabilize - 1),
      overclock: Math.max(0, s.cooldowns.overclock - 1),
    },
    pulse: null,
    flash: null,
    toast: null,
  };
  n = addXp(n, 2 + r.creditGain * 0.3);

  if (n.tick % TICKS_PER_DAY === 0) {
    n = { ...n, day: n.day + 1 };
    if (n.day % 5 === 0) n = pushLog(n, `Цикл ${n.day}: сеть держится`, "ЦИКЛ", "info");
  }

  if (n.trust <= 0) {
    n = { ...n, trust: 0, status: "collapsed", event: null };
    return settle(pushLog(n, "Доверие обнулено. Колония ушла оффлайн", "КРАХ", "bad"), prev);
  }
  if (n.day > p.goalDays) {
    n = { ...n, status: "complete", event: null };
    return settle(pushLog(n, "Цикл завершён. Протокол устойчив", "ФИНАЛ", "good"), prev);
  }

  const chance = 0.03 * p.eventRate * (1 + n.day * 0.01);
  if (n.tick > 5 && Math.random() < chance) n = { ...n, event: rollEvent(n) };

  if (!n.toast) {
    if (n.trust < 25) n = { ...n, hint: "Доверие падает. Стабилизация или коммуна." };
    else if (n.combo > 3) n = { ...n, hint: `Комбо ×${n.combo} — не отпускай!` };
    else if (n.boost > 0) n = { ...n, hint: `Разгон активен · ${n.boost} тик.` };
    else if (n.tick % 9 === 0) {
      n = {
        ...n,
        hint:
          n.levels.relay === 0
            ? "Первое: построй РЕЛЕ — сигнал пойдёт сам."
            : n.levels.pool === 0
              ? "Построй ПУЛ, чтобы превратить сигнал в кредиты."
              : n.levels.commons === 0
                ? "Коммуна держит доверие. Без неё сеть схлопнется."
                : "Держи баланс: сигнал → кредиты → узлы → доверие.",
      };
    }
  }
  return settle(n, prev);
}

export function denyReason(s: GameState, id: ActionId): string | null {
  if (s.status !== "live") return "Забег завершён";
  if (s.event) return "Сначала ответь на событие";
  if (s.cooldowns[id] > 0) return `Перезарядка ${s.cooldowns[id]} тик`;
  if (id === "convert" && s.signal < 5) return "Нужно 5+ сигнала";
  if (id === "stabilize" && s.credits < 40) return "Нужно 40 кредитов";
  if (id === "overclock" && s.trust <= 12) return "Доверие слишком низкое";
  return null;
}

export function canAct(s: GameState, id: ActionId): boolean {
  return denyReason(s, id) === null;
}

export function setToast(s: GameState, text: string, tone: Tone = "warn"): GameState {
  return { ...s, toast: text, toastTone: tone };
}

export function act(s: GameState, id: ActionId, p: Params): GameState {
  if (!canAct(s, id)) return setToast(s, denyReason(s, id) ?? "");
  const def = ACTIONS.find((a) => a.id === id)!;
  const prev = s;
  let n: GameState = { ...s, cooldowns: { ...s.cooldowns, [id]: def.cd }, flash: null, toast: null };

  if (id === "collect") {
    const crit = Math.random() < CRIT_CHANCE;
    const gain = tapYieldOf(s, p) * (crit ? CRIT_MULT : 1);
    n = {
      ...n,
      signal: n.signal + gain,
      taps: n.taps + 1,
      crits: n.crits + (crit ? 1 : 0),
      combo: n.combo + 1,
      comboTimer: COMBO_WINDOW,
      comboBest: Math.max(n.comboBest, n.combo + 1),
      pulse: "core",
      gainSeq: n.gainSeq + 1,
      lastGain: { id: n.gainSeq, v: gain, crit },
    };
    n = addXp(n, crit ? 6 : 2);
    return settle(n, prev);
  }
  if (id === "convert") {
    const amount = n.signal * 0.8;
    const rate = 1.1 + n.levels.pool * 0.12;
    n = { ...n, signal: n.signal - amount, credits: n.credits + amount * rate, pulse: "pool" };
    n = addXp(n, 14);
    n = settle(n, prev);
    return pushLog(n, `Слито ${Math.round(amount)} сигнала · курс ${rate.toFixed(2)}`, "ПУЛ", "good");
  }
  if (id === "stabilize") {
    n = { ...n, credits: n.credits - 40, trust: Math.min(100, n.trust + 11), pulse: "commons" };
    n = addXp(n, 18);
    n = settle(n, prev);
    return pushLog(n, "Выплата колонии: доверие +11", "ЛЮДИ", "good");
  }
  n = { ...n, trust: Math.max(1, n.trust - 8), boost: 8, pulse: "infra" };
  n = addXp(n, 22);
  n = settle(n, prev);
  return pushLog(n, "Разгон сети: ×2 на 8 тиков", "РАЗГОН", "warn");
}

export function buy(s: GameState, id: NodeId, p: Params): GameState {
  if (s.status !== "live") return s;
  const def = NODES.find((d) => d.id === id)!;
  const lvl = s.levels[id];
  if (lvl >= def.max) return setToast(s, `${def.name}: максимум`, "info");
  const cost = costOf(def, lvl, p);
  if (s.credits < cost) return setToast(s, `Не хватает ${Math.ceil(cost - s.credits)} кр`);
  const prev = s;
  let n: GameState = { ...s, credits: s.credits - cost, levels: { ...s.levels, [id]: lvl + 1 }, pulse: id, flash: null, toast: null };
  n = addXp(n, 30 + lvl * 8);
  n = settle(n, prev);
  return pushLog(n, `${def.name} → уровень ${lvl + 1}`, "АПГРЕЙД", "good");
}

export function resolve(s: GameState, index: number): GameState {
  if (!s.event) return s;
  const ev = s.event;
  const opt = ev.options[index];
  const res = opt.apply({ ...s, event: null });
  const prev = s;
  const settled = settle(res.s as GameState, prev);
  return pushLog(settled, res.log, ev.tag, res.tone);
}

export function clearToast(s: GameState): GameState {
  return s.toast === null ? s : { ...s, toast: null };
}

export function markRead(s: GameState): GameState {
  return s.unread === 0 ? s : { ...s, unread: 0 };
}

const clampState = (s: GameState): GameState => ({
  ...s,
  signal: Math.max(0, s.signal),
  credits: Math.max(0, s.credits),
  trust: Math.max(0, Math.min(100, s.trust)),
});

const EVENTS: GameEvent[] = [
  {
    id: "whale",
    title: "КИТ НА ПОРОГЕ",
    tag: "КИТ",
    tone: "warn",
    body: "Анонимный кошелёк вливает 90 кредитов в обмен на контроль над пулом.",
    options: [
      { label: "Взять кредиты", hint: "+90 кр · −14 дов", color: "#e0b145", apply: (s) => ({ s: clampState({ ...s, credits: s.credits + 90, trust: s.trust - 14 }), log: "Кит вошёл в пул, люди шепчутся", tone: "bad" }) },
      { label: "Отказать", hint: "+9 дов", color: "#3ecf8e", apply: (s) => ({ s: clampState({ ...s, trust: s.trust + 9 }), log: "Кит отвергнут, колония выдохнула", tone: "good" }) },
    ],
  },
  {
    id: "outage",
    title: "ОБРЫВ ПИТАНИЯ",
    tag: "АВАРИЯ",
    tone: "bad",
    body: "Ретрансляторы перегрелись. Ремонт стоит 45 кредитов, иначе сгорит половина сигнала.",
    options: [
      { label: "Чинить", hint: "−45 кр", color: "#5b8fdb", apply: (s) => ({ s: clampState({ ...s, credits: s.credits - 45 }), log: "Ремонт оплачен, массив гудит ровно", tone: "info" }) },
      { label: "Пусть горит", hint: "−50% сиг · −3 дов", color: "#ef6b62", apply: (s) => ({ s: clampState({ ...s, signal: s.signal * 0.5, trust: s.trust - 3 }), log: "Половина сигнала ушла в тепло", tone: "bad" }) },
    ],
  },
  {
    id: "migrants",
    title: "ПРИШЛИ ЛЮДИ",
    tag: "ЛЮДИ",
    tone: "info",
    body: "Двенадцать человек просят место в сети. Они едят ресурс, но верят в протокол.",
    options: [
      { label: "Впустить", hint: "+16 дов · −30 сиг", color: "#3ecf8e", apply: (s) => ({ s: clampState({ ...s, trust: s.trust + 16, signal: s.signal - 30 }), log: "Двенадцать новых голосов в сети", tone: "good" }) },
      { label: "Закрыть шлюз", hint: "−10 дов", color: "#ef6b62", apply: (s) => ({ s: clampState({ ...s, trust: s.trust - 10 }), log: "Шлюз закрыт, об этом напишут в логе", tone: "bad" }) },
    ],
  },
  {
    id: "audit",
    title: "АУДИТ КАЗНЫ",
    tag: "АУДИТ",
    tone: "warn",
    body: "Комиссия требует прозрачности. Раскрытие книги стоит четверти кредитов.",
    options: [
      { label: "Раскрыть", hint: "−25% кр · +12 дов", color: "#3ecf8e", apply: (s) => ({ s: clampState({ ...s, credits: s.credits * 0.75, trust: s.trust + 12 }), log: "Книга открыта, доверие подросло", tone: "good" }) },
      { label: "Молчать", hint: "−8 дов", color: "#ef6b62", apply: (s) => ({ s: clampState({ ...s, trust: s.trust - 8 }), log: "Тишина в ответ на аудит", tone: "bad" }) },
    ],
  },
  {
    id: "spike",
    title: "ВСПЛЕСК СПРОСА",
    tag: "РЫНОК",
    tone: "good",
    body: "Внешний рынок жадно берёт сигнал. Можно распродать запас прямо сейчас.",
    options: [
      { label: "Продать всё", hint: "сиг → ×1.6 кр", color: "#e0b145", apply: (s) => ({ s: clampState({ ...s, credits: s.credits + s.signal * 1.6, signal: 0, trust: s.trust - 4 }), log: "Запас сигнала распродан на пике", tone: "info" }) },
      { label: "Держать", hint: "+6 дов", color: "#3ecf8e", apply: (s) => ({ s: clampState({ ...s, trust: s.trust + 6 }), log: "Ничего не продано, держим позицию", tone: "good" }) },
    ],
  },
  {
    id: "fork",
    title: "ФОРК КОЛОНИИ",
    tag: "ФОРК",
    tone: "warn",
    body: "Часть колонии хочет отделиться и унести половину инфраструктуры.",
    options: [
      { label: "Отпустить", hint: "−1 инфра · +11 дов", color: "#5b8fdb", apply: (s) => ({ s: clampState({ ...s, levels: { ...s.levels, infra: Math.max(0, s.levels.infra - 1) }, trust: s.trust + 11 }), log: "Форк ушёл с миром, мы стали меньше", tone: "info" }) },
      { label: "Блокировать", hint: "−15 дов · +40 кр", color: "#ef6b62", apply: (s) => ({ s: clampState({ ...s, trust: s.trust - 15, credits: s.credits + 40 }), log: "Форк заблокирован силой", tone: "bad" }) },
    ],
  },
];

function rollEvent(s: GameState): GameEvent {
  const pool = EVENTS.filter((e) => !(e.id === "fork" && s.levels.infra === 0));
  return pool[Math.floor(Math.random() * pool.length)];
}
