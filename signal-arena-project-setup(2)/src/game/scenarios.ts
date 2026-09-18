/**
 * Scenario engine — many distinct "analyses of data segments".
 * Each round: a chart that ends at t0 (future hidden), a coach hint, an order
 * book snapshot, the correct ACTION + the key LENS, and what really happened.
 *
 * Rounds are generated from archetypes × assets so there is a large, varied
 * library (dozens of unique setups) without hand-typing every candle.
 */

export type ActionKey = "enter" | "wait" | "htf" | "add";
export type LensKey = "trend" | "volume" | "risk" | "wait";

export interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
  vol: number;
}

export interface BookRow {
  price: number;
  size: number; // 0..1 depth
  whale?: boolean;
}
export interface OrderBook {
  asks: BookRow[];
  bids: BookRow[];
  spread: string;
  whaleSide: "ask" | "bid" | null;
}

export interface Round {
  id: string;
  n: number;
  asset: string;
  tf: string;
  coach: string;
  candles: Candle[];
  t0: number;
  setup: string;
  best: ActionKey;
  keyLens: LensKey;
  lockedLens: LensKey;
  score: Record<ActionKey, number>;
  lensInsight: Record<LensKey, string>;
  outcome: "up" | "down" | "chop";
  verdict: string;
  why: string;
  book: OrderBook;
}

/** Pre-computed dramatic-name + amplitude for the lobby display */
export interface LobbyMeta {
  title: string;
  tf: string;
  movePct: number;
}
const META: Record<string, { title: string; tf: string }> = {
  "breakout_no_volume": { title: "Сценарий «Плато»", tf: "BTC · 15M" },
  "breakout_volume": { title: "Сценарий «Сжатие»", tf: "ETH · 1H" },
  "trend_pullback": { title: "Сценарий «Откат»", tf: "SOL · 5M" },
  "climax_top": { title: "Сценарий «Вертикаль»", tf: "BNB · 4H" },
  "capitulation": { title: "Сценарий «Капитуляция»", tf: "TON · 1H" },
  "range_chop": { title: "Сценарий «Боковик»", tf: "AVAX · 30M" },
  "htf_conflict": { title: "Сценарий «Старший ТФ»", tf: "XRP · 15M" },
  "fakeout_reclaim": { title: "Сценарий «Ловушка»", tf: "NEAR · 1H" },
  "distribution": { title: "Сценарий «Распределение»", tf: "SUI · 15M" },
};

export function lobbyMetaFor(r: Round): LobbyMeta {
  const m = META[r.setup] ?? { title: "Сценарий", tf: r.asset + " · " + (r.tf || "15M") };
  // compute amplitude: % change from t0 close to last close
  const base = r.candles[r.t0]?.c ?? 0;
  const last = r.candles[r.candles.length - 1]?.c ?? 0;
  const pct = base ? Math.round(Math.abs((last - base) / base) * 100) : 10;
  return { ...m, movePct: pct };
}

const ACTIONS: ActionKey[] = ["enter", "wait", "htf", "add"];
void ACTIONS;

function rng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

interface Archetype {
  key: string;
  coach: string;
  best: ActionKey;
  keyLens: LensKey;
  lockedLens: LensKey;
  score: Record<ActionKey, number>;
  outcome: "up" | "down" | "chop";
  verdict: string;
  why: string;
  whaleSide: "ask" | "bid" | null;
  gen: (base: number, r: () => number) => { closes: number[]; vols: number[]; t0: number };
  lens: Record<LensKey, string>;
}

// ---- segment helpers (return arrays of prices) ----
function ramp(from: number, to: number, n: number, r: () => number, noise = 0.004) {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const base = from + (to - from) * t;
    out.push(base * (1 + (r() - 0.5) * noise));
  }
  return out;
}
function chop(center: number, amp: number, n: number, r: () => number) {
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(center * (1 + (r() - 0.5) * amp));
  return out;
}

const ARCHES: Archetype[] = [
  {
    key: "breakout_no_volume",
    coach: "Пробой без объёма. Объём молчит.",
    best: "wait",
    keyLens: "volume",
    lockedLens: "wait",
    score: { wait: 100, htf: 70, enter: 25, add: 5 },
    outcome: "down",
    verdict: "Ложный пробой — цена вернулась в диапазон",
    why: "Пробой уровня без роста объёма почти всегда выкупается обратно. Терпеливый ждёт ретеста с объёмом.",
    whaleSide: "ask",
    lens: {
      trend: "Локальный аптренд, но упирается в потолок диапазона.",
      volume: "⚠ Объём на пробое падает — покупателя нет.",
      risk: "Вход на хай диапазона — плохое соотношение риск/прибыль.",
      wait: "Дождись ретеста уровня с ростом объёма.",
    },
    gen: (base, r) => {
      const range = chop(base, 0.012, 16, r);
      const push = ramp(base, base * 1.02, 6, r, 0.003);
      const fut = ramp(base * 1.02, base * 0.985, 8, r);
      return { closes: [...range, ...push, ...fut], vols: [], t0: 16 + 6 - 1 };
    },
  },
  {
    key: "breakout_volume",
    coach: "Импульсный пробой на объёме. Спрос вошёл.",
    best: "enter",
    keyLens: "volume",
    lockedLens: "risk",
    score: { enter: 100, add: 75, wait: 45, htf: 40 },
    outcome: "up",
    verdict: "Пробой подтвердился — импульс вверх",
    why: "Широкая свеча на всплеске объёма пробила диапазон. Это подтверждение — вход по рынку оправдан.",
    whaleSide: "bid",
    lens: {
      trend: "Смена характера: пробит потолок диапазона.",
      volume: "✓ Объём на пробое вырос в 2–3 раза.",
      risk: "Стоп под уровнем пробоя — риск ограничен.",
      wait: "Ждать необязательно — импульс уже начался.",
    },
    gen: (base, r) => {
      const range = chop(base, 0.01, 16, r);
      const push = ramp(base, base * 1.035, 6, r, 0.003);
      const fut = ramp(base * 1.035, base * 1.09, 8, r, 0.004);
      return { closes: [...range, ...push, ...fut], vols: [], t0: 21 };
    },
  },
  {
    key: "retest_hold",
    coach: "Ретест уровня. Цена держит опору.",
    best: "enter",
    keyLens: "trend",
    lockedLens: "wait",
    score: { enter: 100, add: 65, wait: 55, htf: 35 },
    outcome: "up",
    verdict: "Ретест удержан — продолжение тренда",
    why: "Цена вернулась к пробитому уровню и оттолкнулась. Пробитое сопротивление стало поддержкой — классический вход.",
    whaleSide: "bid",
    lens: {
      trend: "✓ Пробитый уровень стал поддержкой.",
      volume: "Объём на откате снижается — здоровый ретест.",
      risk: "Чёткий стоп под уровнем ретеста.",
      wait: "Ретест уже идёт — можно действовать.",
    },
    gen: (base, r) => {
      const up = ramp(base, base * 1.04, 8, r);
      const dip = ramp(base * 1.04, base * 1.012, 6, r);
      const hold = ramp(base * 1.012, base * 1.02, 6, r, 0.002);
      const fut = ramp(base * 1.02, base * 1.075, 8, r);
      return { closes: [...up, ...dip, ...hold, ...fut], vols: [], t0: 19 };
    },
  },
  {
    key: "climax_top",
    coach: "Вертикальный разгон. Покупатели выдыхаются.",
    best: "wait",
    keyLens: "risk",
    lockedLens: "trend",
    score: { wait: 100, htf: 65, enter: 20, add: 0 },
    outcome: "down",
    verdict: "Кульминация покупок — резкий откат",
    why: "Параболический рост без откатов — это эйфория. Входить на вершине опасно: разворот приходит внезапно.",
    whaleSide: "ask",
    lens: {
      trend: "Тренд вверх, но угол слишком крутой.",
      volume: "Объём на пике — признак кульминации.",
      risk: "⚠ Вход здесь = покупка на максимуме.",
      wait: "Жди отката и стабилизации.",
    },
    gen: (base, r) => {
      const calm = ramp(base, base * 1.03, 8, r);
      const para = ramp(base * 1.03, base * 1.18, 8, r, 0.006);
      const fut = ramp(base * 1.18, base * 1.02, 8, r, 0.01);
      return { closes: [...calm, ...para, ...fut], vols: [], t0: 15 };
    },
  },
  {
    key: "capitulation",
    coach: "Паническая распродажа. Длинный нижний хвост.",
    best: "enter",
    keyLens: "risk",
    lockedLens: "volume",
    score: { enter: 100, add: 55, wait: 60, htf: 40 },
    outcome: "up",
    verdict: "Капитуляция выкуплена — отскок",
    why: "Резкий слив с длинным нижним хвостом на объёме — продавцы выдохлись. Умный капитал выкупает страх.",
    whaleSide: "bid",
    lens: {
      trend: "Даунтренд, но появился первый разворотный сигнал.",
      volume: "✓ Всплеск объёма на дне — капитуляция.",
      risk: "Стоп под хвостом — риск понятен.",
      wait: "Отскок может уйти без тебя.",
    },
    gen: (base, r) => {
      const down = ramp(base * 1.05, base * 0.9, 10, r);
      const flush = ramp(base * 0.9, base * 0.82, 4, r, 0.002);
      const wick = ramp(base * 0.82, base * 0.88, 4, r);
      const fut = ramp(base * 0.88, base * 0.98, 8, r);
      return { closes: [...down, ...flush, ...wick, ...fut], vols: [], t0: 17 };
    },
  },
  {
    key: "trend_pullback",
    coach: "Здоровый тренд. Откат к средней.",
    best: "add",
    keyLens: "trend",
    lockedLens: "risk",
    score: { add: 100, enter: 85, wait: 45, htf: 40 },
    outcome: "up",
    verdict: "Тренд продолжился — доливка сработала",
    why: "Сильный аптренд, неглубокий откат к средней и разворот. Идеальное место, чтобы добрать позицию по тренду.",
    whaleSide: "bid",
    lens: {
      trend: "✓ Аптренд с растущими минимумами.",
      volume: "Объём на откате низкий — коррекция, не разворот.",
      risk: "Откат даёт вход с близким стопом.",
      wait: "Откат уже выкуплен.",
    },
    gen: (base, r) => {
      const up1 = ramp(base, base * 1.05, 7, r);
      const pull = ramp(base * 1.05, base * 1.02, 5, r);
      const up2 = ramp(base * 1.02, base * 1.03, 5, r, 0.002);
      const fut = ramp(base * 1.03, base * 1.11, 8, r);
      return { closes: [...up1, ...pull, ...up2, ...fut], vols: [], t0: 16 };
    },
  },
  {
    key: "range_chop",
    coach: "Рынок в диапазоне. Ясного сигнала нет.",
    best: "wait",
    keyLens: "wait",
    lockedLens: "trend",
    score: { wait: 100, htf: 60, enter: 30, add: 15 },
    outcome: "chop",
    verdict: "Боковик продолжился — сделки не было",
    why: "В центре диапазона нет преимущества. Лучшее решение — пропустить и ждать края диапазона или пробоя.",
    whaleSide: null,
    lens: {
      trend: "Тренд отсутствует — плоская структура.",
      volume: "Объём ровный — интереса нет.",
      risk: "Вход в центре = случайный результат.",
      wait: "✓ Жди край диапазона или пробой.",
    },
    gen: (base, r) => {
      const c = chop(base, 0.02, 22, r);
      const fut = chop(base, 0.02, 8, r);
      return { closes: [...c, ...fut], vols: [], t0: 21 };
    },
  },
  {
    key: "htf_conflict",
    coach: "Локально вверх — но сверху крупный уровень.",
    best: "htf",
    keyLens: "trend",
    lockedLens: "wait",
    score: { htf: 100, wait: 75, enter: 35, add: 10 },
    outcome: "down",
    verdict: "Старший ТФ остановил рост — отбой от уровня",
    why: "На младшем ТФ импульс вверх, но на старшем — жирное сопротивление. Всегда сверяйся со старшим таймфреймом.",
    whaleSide: "ask",
    lens: {
      trend: "✓ Младший ТФ вверх, старший — в потолок.",
      volume: "Объём растёт, но упирается в оффер.",
      risk: "Риск отбоя от старшего уровня высок.",
      wait: "Проверь старший ТФ перед входом.",
    },
    gen: (base, r) => {
      const up = ramp(base * 0.9, base * 0.995, 14, r);
      const near = ramp(base * 0.995, base, 8, r, 0.002);
      const fut = ramp(base, base * 0.94, 8, r);
      return { closes: [...up, ...near, ...fut], vols: [], t0: 21 };
    },
  },
  {
    key: "fakeout_reclaim",
    coach: "Ложный слив и возврат в диапазон.",
    best: "enter",
    keyLens: "risk",
    lockedLens: "volume",
    score: { enter: 100, add: 60, wait: 55, htf: 35 },
    outcome: "up",
    verdict: "Пружина сработала — вынос стопов вверх",
    why: "Цена выбила стопы под поддержкой и тут же вернулась. Это ловушка для медведей — импульс идёт в обратную сторону.",
    whaleSide: "bid",
    lens: {
      trend: "Диапазон, ложный пробой вниз.",
      volume: "Объём на возврате выше, чем на сливе.",
      risk: "✓ Стоп под ложным минимумом — маленький риск.",
      wait: "Возврат уже подтверждён.",
    },
    gen: (base, r) => {
      const range = chop(base, 0.01, 12, r);
      const fake = ramp(base, base * 0.965, 5, r);
      const reclaim = ramp(base * 0.965, base * 1.012, 5, r);
      const fut = ramp(base * 1.012, base * 1.06, 8, r);
      return { closes: [...range, ...fake, ...reclaim, ...fut], vols: [], t0: 21 };
    },
  },
  {
    key: "distribution",
    coach: "Верхи слабеют. Ниже максимумы.",
    best: "wait",
    keyLens: "volume",
    lockedLens: "trend",
    score: { wait: 100, htf: 70, enter: 25, add: 0 },
    outcome: "down",
    verdict: "Распределение перешло в снижение",
    why: "Серия понижающихся максимумов на затухающем объёме — это распределение. Крупный игрок раздаёт, за ним пойдёт снижение.",
    whaleSide: "ask",
    lens: {
      trend: "Понижающиеся максимумы — слом структуры.",
      volume: "✓ Объём падает на каждом новом хае.",
      risk: "Покупка здесь = против крупного продавца.",
      wait: "Жди подтверждения слома вниз.",
    },
    gen: (base, r) => {
      const p1 = ramp(base, base * 1.05, 6, r);
      const p2 = ramp(base * 1.05, base * 1.03, 5, r);
      const p3 = ramp(base * 1.03, base * 1.045, 5, r);
      const p4 = ramp(base * 1.045, base * 1.02, 6, r);
      const fut = ramp(base * 1.02, base * 0.95, 8, r);
      return { closes: [...p1, ...p2, ...p3, ...p4, ...fut], vols: [], t0: 21 };
    },
  },
];

const ASSETS: { asset: string; tf: string; base: number }[] = [
  { asset: "BTC/USDT", tf: "15M", base: 67800 },
  { asset: "ETH/USDT", tf: "1H", base: 3520 },
  { asset: "SOL/USDT", tf: "5M", base: 178 },
  { asset: "BNB/USDT", tf: "4H", base: 604 },
  { asset: "TON/USDT", tf: "1H", base: 7.4 },
  { asset: "XRP/USDT", tf: "15M", base: 0.62 },
  { asset: "AVAX/USDT", tf: "30M", base: 32.5 },
  { asset: "NEAR/USDT", tf: "1H", base: 5.8 },
  { asset: "SUI/USDT", tf: "15M", base: 2.1 },
  { asset: "DOGE/USDT", tf: "5M", base: 0.16 },
];

function makeBook(lastPrice: number, whaleSide: "ask" | "bid" | null, r: () => number): OrderBook {
  const step = lastPrice * 0.0002;
  const asks: BookRow[] = [];
  const bids: BookRow[] = [];
  for (let i = 0; i < 3; i++) {
    asks.push({ price: lastPrice + step * (3 - i) + step, size: 0.3 + r() * 0.5, whale: whaleSide === "ask" && i === 1 });
    bids.push({ price: lastPrice - step * (i + 1), size: 0.3 + r() * 0.5, whale: whaleSide === "bid" && i === 1 });
  }
  return { asks, bids, spread: "0.02%", whaleSide };
}

export function toCandles(closes: number[], r: () => number): Candle[] {
  return closes.map((c, i) => {
    const o = i === 0 ? c * 0.998 : closes[i - 1];
    const spread = Math.abs(c - o);
    const wick = Math.max(spread * 0.5, c * 0.003);
    const seed = r();
    return {
      o,
      c,
      h: Math.max(o, c) + wick * (0.4 + seed),
      l: Math.min(o, c) - wick * (1.3 - seed),
      vol: 0.3 + r() * 0.7,
    };
  });
}

function fmtPrice(p: number): string {
  if (p >= 1000) return p.toLocaleString("ru-RU", { maximumFractionDigits: 0 });
  if (p >= 10) return p.toFixed(1);
  return p.toFixed(3);
}

export function buildRounds(): Round[] {
  const rounds: Round[] = [];
  let n = 0;
  ARCHES.forEach((a, ai) => {
    ASSETS.forEach((as, si) => {
      const r = rng((ai + 1) * 100003 + (si + 1) * 7919);
      const { closes, t0 } = a.gen(as.base, r);
      const candles = toCandles(closes, r);
      const last = closes[t0];
      rounds.push({
        id: `${a.key}-${as.asset.replace("/", "")}`,
        n: ++n,
        asset: as.asset,
        tf: as.tf,
        coach: a.coach,
        candles,
        t0,
        setup: a.key,
        best: a.best,
        keyLens: a.keyLens,
        lockedLens: a.lockedLens,
        score: a.score,
        lensInsight: a.lens,
        outcome: a.outcome,
        verdict: a.verdict,
        why: a.why,
        book: makeBook(last, a.whaleSide, r),
      });
    });
  });
  return rounds;
}

export const ROUNDS = buildRounds();
export const TOTAL_ANALYSES = 100; // curriculum size shown to the player

export { fmtPrice };

export const ACTION_META: Record<ActionKey, { label: string; icon: ActionKey; tone: string }> = {
  enter: { label: "Войти сразу", icon: "enter", tone: "green" },
  wait: { label: "Ждать ретест и объём", icon: "wait", tone: "teal" },
  htf: { label: "Старшие таймфреймы", icon: "htf", tone: "blue" },
  add: { label: "Увеличить позицию", icon: "add", tone: "red" },
};

export const LENS_META: Record<LensKey, { label: string; group: "green" | "yellow" | "blue" | "red" }> = {
  trend: { label: "ТРЕНД", group: "blue" },
  volume: { label: "ОБЪЁМ", group: "yellow" },
  risk: { label: "РИСК", group: "green" },
  wait: { label: "ЖДАТЬ", group: "red" },
};
