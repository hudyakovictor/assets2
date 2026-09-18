/**
 * Page Inventory P01–P34.
 * Источник структуры: game.html из репозитория (Часть 1 — раскадровка первого открытия:
 * три захода на Арену, каждый добавляет одну механику; Часть 2 — все экраны продукта:
 * Академия, колода карт, полный заход на Арену, раскрытие/оценка, разбор, профиль, сервисные состояния).
 * Тело экранов game.html рендерится скриптом и не читается как текст — тексты помечены как inferred.
 */

export type Section = "Onboarding" | "Арена" | "Академия" | "Профиль" | "Сервис";
export type Template =
  | "splash"
  | "tutorial"
  | "arena"
  | "academy"
  | "lesson"
  | "quiz"
  | "deck"
  | "card"
  | "select"
  | "debrief"
  | "profile"
  | "settings"
  | "notifications"
  | "state";
export type ArenaPhase = "observe" | "target" | "feedback" | "decision" | "reveal" | "score";
export type VariantId = "A" | "B" | "C" | "D";

export type Slot = {
  slot: string;
  assetId: string;
  source: string;
  placement: string;
  purpose: string;
  fallback: string;
  fit: "contain" | "cover";
  scale: number;
  position: string;
  opacity: number;
  tint: string;
  motion: string;
};

export type Variant = { id: VariantId; slots: Slot[]; bg: BgPreset; chart: ChartPreset; reveal: RevealPreset; motion: MotionPreset };
export type BgPreset = "aurora" | "grid" | "nebula" | "depth";
export type ChartPreset = "candles" | "candles-glow" | "line-area" | "candles-mono";
export type RevealPreset = "scrub" | "wipe" | "pulse" | "shutter";
export type MotionPreset = "calm" | "snappy" | "cinematic" | "arcade";

export type TopBarState = { lvl: number; xp: number; xpMax: number; attempts: number; attemptsMax: number; stars: number; coins: number; badge: number; disabled?: boolean };

export type Page = {
  id: string;
  title: string;
  section: Section;
  state: string;
  source: string;
  template: Template;
  topBar: boolean;
  phase?: ArenaPhase;
  tutorial?: { lesson: string; step: number; total: number };
  cardIds?: string[]; // skill icons in play c01..c40
  scenario?: number; // scenario index
  copy: { h: string; t: string; cta: string; secondary?: string };
  variants: Variant[];
  variantNote?: string; // reason for 3 variants
  topBarState: TopBarState;
};

// ---------- Skill card palette (locked) ----------
export const CARD_COLORS = { green: "#2E7F5C", yellow: "#D0B24A", blue: "#4C6180", red: "#C56861" } as const;
export function cardGroup(n: number): keyof typeof CARD_COLORS {
  if (n <= 15) return "green";
  if (n <= 24) return "yellow";
  if (n <= 33) return "blue";
  return "red";
}
export const cardId = (n: number) => `c${String(n).padStart(2, "0")}`;
export const CARD_NAMES: Record<string, string> = {
  c01: "Тренд", c02: "Поддержка", c03: "Сопротивление", c04: "Объём", c05: "Свеча-молот", c06: "Пробой", c07: "Ложный пробой",
  c08: "Откат", c09: "Дивергенция", c10: "Скользящая", c11: "Уровень 50%", c12: "Гэп", c13: "Консолидация", c14: "Импульс", c15: "Волатильность",
  c16: "Новость", c17: "Листинг", c18: "Халвинг", c19: "Ставка ФРС", c20: "Регулятор", c21: "Ликвидации", c22: "Фандинг", c23: "Открытый интерес", c24: "Доминация",
  c25: "Стоп-лосс", c26: "Тейк", c27: "Риск 1%", c28: "Размер позиции", c29: "R:R", c30: "Хедж", c31: "Усреднение", c32: "Частичный выход", c33: "Пауза",
  c34: "FOMO", c35: "Паника", c36: "Жадность", c37: "Тильт", c38: "Якорь", c39: "Подтверждение", c40: "Стадо",
};

// ---------- Scenario series (t0 cutoff + historical continuation) ----------
export type Candle = { o: number; h: number; l: number; c: number };
export type Scenario = { name: string; asset: string; period: string; t0: number; candles: Candle[]; event: string; explain: string; correct: "short" | "long" | "skip"; dropZone: [number, number] };

function series(seed: number, n: number, start: number, drift: number[], vol: number): Candle[] {
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296) - 0.5;
  const out: Candle[] = [];
  let p = start;
  for (let i = 0; i < n; i++) {
    const d = drift[Math.min(drift.length - 1, Math.floor((i / n) * drift.length))];
    const o = p;
    const c = o * (1 + d + rnd() * vol);
    const h = Math.max(o, c) * (1 + Math.abs(rnd()) * vol * 0.6);
    const l = Math.min(o, c) * (1 - Math.abs(rnd()) * vol * 0.6);
    out.push({ o, h, l, c });
    p = c;
  }
  return out;
}

export const SCENARIOS: Scenario[] = [
  {
    name: "Вершина и обрыв", asset: "BTC/USDT", period: "апрель–май 2021", t0: 30,
    candles: series(7, 44, 100, [0.012, 0.006, -0.004, -0.02, -0.045, -0.02], 0.03),
    event: "Массовые ликвидации: −30% за неделю после смены риторики регулятора",
    explain: "Импульс выдыхался: объём падал на новых максимумах, появилась дивергенция. Цена ушла под уровень 50% движения.",
    correct: "short", dropZone: [21, 29],
  },
  {
    name: "Ложный пробой", asset: "ETH/USDT", period: "июнь 2022", t0: 28,
    candles: series(21, 42, 100, [-0.01, 0.008, 0.02, -0.03, -0.05, 0.01], 0.035),
    event: "Пробой сопротивления не удержался: закрытие вернулось под уровень, каскад стопов",
    explain: "Свеча пробоя закрылась длинной тенью. Без подтверждения объёмом пробой — это ловушка.",
    correct: "skip", dropZone: [18, 27],
  },
  {
    name: "Откат к поддержке", asset: "SOL/USDT", period: "октябрь 2023", t0: 26,
    candles: series(33, 40, 100, [0.02, -0.012, -0.004, 0.025, 0.03, 0.01], 0.03),
    event: "Ретест поддержки на падающем объёме и разворот вверх",
    explain: "Продавцы иссякли у уровня: свечи с длинными нижними тенями, объём на снижении ушёл. Классический откат в тренде.",
    correct: "long", dropZone: [12, 20],
  },
];

// ---------- Variant presets ----------
const BG: BgPreset[] = ["aurora", "grid", "nebula", "depth"];
const CH: ChartPreset[] = ["candles", "candles-glow", "line-area", "candles-mono"];
const RV: RevealPreset[] = ["scrub", "wipe", "pulse", "shutter"];
const MO: MotionPreset[] = ["calm", "snappy", "cinematic", "arcade"];
const IDS: VariantId[] = ["A", "B", "C", "D"];

type Build = { hero?: (v: number) => string; chart?: boolean; cardOffset?: number; cards?: number[] };

/**
 * Generated key-art (motion designer decorative layer).
 * Не заменяет обязательные repo-ассеты (Top Bar, skill icons) — это иллюстрация hero-слота,
 * который в исходном MVP не имеет фиксированного файла (assets.zip содержит только превью/референсы).
 */
export const HERO_ART: Record<string, string> = {
  P01: "hero-splash.jpg",
  P23: "hero-arena.jpg",
  P29: "hero-profile.jpg",
  P32: "hero-empty.jpg",
  P34: "hero-reward.jpg",
};

function mkVariants(p: Omit<Page, "variants">, b: Build, count: 3 | 4 = 4): Variant[] {
  const heroFile = HERO_ART[p.id];
  return IDS.slice(0, count).map((id, v) => {
    const slots: Slot[] = [];
    if (p.topBar) {
      slots.push({ slot: "topbar", assetId: "topbar.html + lightning/star/coin/bell/gear.svg", source: "topbar.zip", placement: "top, locked", purpose: "SHARED_TOP_BAR_LOCKED", fallback: "MISSING_ASSET error", fit: "contain", scale: 1, position: "top", opacity: 1, tint: "none", motion: "none" });
    }
    if (b.hero) {
      slots.push({ slot: "hero", assetId: heroFile ?? b.hero(v), source: heroFile ? "generated-art/ (motion-designer key art, decorative — не repo-required asset)" : "assets.zip", placement: "main visual ≤42% h", purpose: "иллюстрация карточки", fallback: "MISSING_ASSET error", fit: v % 2 ? "cover" : "contain", scale: [1, 1.08, 0.94, 1.12][v], position: ["center", "center 40%", "center 60%", "center"][v], opacity: [1, 0.95, 1, 0.9][v], tint: ["none", "cool", "none", "warm"][v], motion: MO[v] });
    }
    slots.push({ slot: "background", assetId: `bg:${BG[v]}`, source: "css-treatment (repo tokens)", placement: "full-bleed layer", purpose: "background artwork", fallback: "flat --bg", fit: "cover", scale: 1, position: "center", opacity: [0.9, 0.7, 1, 0.8][v], tint: "none", motion: MO[v] });
    if (b.chart) {
      slots.push({ slot: "chart", assetId: `chart:${CH[v]}`, source: "SVG runtime", placement: "chart container", purpose: "chart treatment", fallback: "candles", fit: "contain", scale: 1, position: "center", opacity: 1, tint: v === 3 ? "mono" : "none", motion: MO[v] });
      slots.push({ slot: "reveal", assetId: `reveal:${RV[v]}`, source: "motion preset", placement: "chart overlay", purpose: "reveal effect", fallback: "scrub", fit: "cover", scale: 1, position: "t0→end", opacity: 1, tint: "none", motion: MO[v] });
    }
    if (b.cards) {
      b.cards.forEach((n, i) => {
        const nn = ((n - 1 + (b.cardOffset ?? 0) * v) % 40) + 1;
        slots.push({ slot: `skill-card-${i + 1}`, assetId: `${cardId(nn)}.svg`, source: "skill-card-icons.zip", placement: "card artwork", purpose: `skill card ${CARD_NAMES[cardId(nn)]}`, fallback: "MISSING_ASSET error", fit: "contain", scale: [1, 1.06, 0.96, 1.1][v], position: "optical center", opacity: 1, tint: "white (locked)", motion: MO[v] });
      });
    }
    return { id, slots, bg: BG[v], chart: CH[v], reveal: RV[v], motion: MO[v] };
  });
}

const heroFrom = (offset: number) => (v: number) => `assets.zip#image[${offset + v}]`;

const TB0: TopBarState = { lvl: 1, xp: 0, xpMax: 100, attempts: 3, attemptsMax: 3, stars: 0, coins: 0, badge: 0 };
const TB1: TopBarState = { lvl: 1, xp: 40, xpMax: 100, attempts: 2, attemptsMax: 3, stars: 1, coins: 25, badge: 0 };
const TB2: TopBarState = { lvl: 2, xp: 15, xpMax: 120, attempts: 1, attemptsMax: 3, stars: 3, coins: 70, badge: 1 };
const TB3: TopBarState = { lvl: 3, xp: 55, xpMax: 150, attempts: 3, attemptsMax: 3, stars: 7, coins: 180, badge: 2 };
const TBE: TopBarState = { ...TB3, attempts: 0, disabled: true };

const SRC1 = "game.html · Часть 1 (раскадровка первого открытия)";
const SRC2 = "game.html · Часть 2 (все экраны продукта)";

function page(p: Omit<Page, "variants">, b: Build, count: 3 | 4 = 4, note?: string): Page {
  return { ...p, variants: mkVariants(p, b, count), variantNote: note };
}

export const PAGES: Page[] = [
  page({ id: "P01", title: "Splash / Welcome", section: "Onboarding", state: "default", source: SRC1, template: "splash", topBar: false, topBarState: TB0, copy: { h: "Signal Arena", t: "Учись читать рынок на реальных исторических сценариях. Решай — и смотри, что было дальше.", cta: "Войти на Арену" } }, { hero: heroFrom(0) }),
  page({ id: "P02", title: "Заход 1 · Что перед тобой", section: "Арена", state: "tutorial 1/4", source: SRC1, template: "tutorial", topBar: true, topBarState: TB0, tutorial: { lesson: "Заход 1 · Читаем график", step: 1, total: 4 }, scenario: 0, copy: { h: "Это реальный график из прошлого", t: "Слева — то, что уже случилось. Справа, за линией t0, — будущее. Оно закрыто, пока ты не примешь решение.", cta: "Понятно" } }, { chart: true }),
  page({ id: "P03", title: "Заход 1 · Первое действие", section: "Арена", state: "tutorial 2/4 · target", source: SRC1, template: "arena", phase: "target", topBar: true, topBarState: TB0, tutorial: { lesson: "Заход 1 · Читаем график", step: 2, total: 4 }, scenario: 0, copy: { h: "Найди зону падения", t: "Коснись подсвеченного участка, где цена резко пошла вниз.", cta: "Коснись графика" } }, { chart: true }),
  page({ id: "P04", title: "Заход 1 · Обратная связь", section: "Арена", state: "tutorial 3/4 · feedback ok/miss", source: SRC1, template: "arena", phase: "feedback", topBar: true, topBarState: TB0, tutorial: { lesson: "Заход 1 · Читаем график", step: 3, total: 4 }, scenario: 0, copy: { h: "Верно — это импульс вниз", t: "Три красные свечи подряд с растущими телами. Запомни этот рисунок.", cta: "Дальше" } }, { chart: true }),
  page({ id: "P05", title: "Заход 1 · Первое решение", section: "Арена", state: "tutorial 4/4 · decision", source: SRC1, template: "arena", phase: "decision", topBar: true, topBarState: TB0, tutorial: { lesson: "Заход 1 · Читаем график", step: 4, total: 4 }, scenario: 0, copy: { h: "Что будет дальше?", t: "Выбери направление и запечатай решение. После Seal изменить нельзя.", cta: "Seal" } }, { chart: true }),
  page({ id: "P06", title: "Заход 1 · Reveal", section: "Арена", state: "reveal · fast-forward", source: SRC1, template: "arena", phase: "reveal", topBar: true, topBarState: TB0, scenario: 0, copy: { h: "Перематываем время", t: "Историческое продолжение дорисовывается до ключевого события.", cta: "К оценке" } }, { chart: true }),
  page({ id: "P07", title: "Заход 1 · Оценка", section: "Арена", state: "score · first", source: SRC1, template: "arena", phase: "score", topBar: true, topBarState: TB1, scenario: 0, copy: { h: "Первая оценка", t: "Направление, тайминг и объяснение оцениваются отдельно.", cta: "Следующий заход" } }, { chart: true, cards: [1] }),
  page({ id: "P08", title: "Заход 2 · Новая механика: зоны", section: "Арена", state: "tutorial 1/3", source: SRC1, template: "tutorial", topBar: true, topBarState: TB1, tutorial: { lesson: "Заход 2 · Уровни и зоны", step: 1, total: 3 }, scenario: 1, copy: { h: "Рынок помнит уровни", t: "Зона, где цена уже разворачивалась, чаще срабатывает снова. Отметь её перед решением.", cta: "Показать зоны" } }, { chart: true }),
  page({ id: "P09", title: "Заход 2 · Отметь уровень", section: "Арена", state: "tutorial 2/3 · target", source: SRC1, template: "arena", phase: "target", topBar: true, topBarState: TB1, tutorial: { lesson: "Заход 2 · Уровни и зоны", step: 2, total: 3 }, scenario: 1, copy: { h: "Коснись зоны сопротивления", t: "Область, где цена трижды упиралась и возвращалась.", cta: "Коснись графика" } }, { chart: true }),
  page({ id: "P10", title: "Заход 2 · Решение с уверенностью", section: "Арена", state: "tutorial 3/3 · decision + confidence", source: SRC1, template: "arena", phase: "decision", topBar: true, topBarState: TB1, tutorial: { lesson: "Заход 2 · Уровни и зоны", step: 3, total: 3 }, scenario: 1, copy: { h: "Насколько ты уверен?", t: "Уверенность влияет на множитель. Ошибка при 100% стоит дороже.", cta: "Seal" } }, { chart: true }),
  page({ id: "P11", title: "Заход 2 · Reveal", section: "Арена", state: "reveal", source: SRC1, template: "arena", phase: "reveal", topBar: true, topBarState: TB1, scenario: 1, copy: { h: "Перематываем время", t: "Пробой не удержался.", cta: "К оценке" } }, { chart: true }),
  page({ id: "P12", title: "Заход 2 · Оценка + первая карта", section: "Арена", state: "score · card unlocked", source: SRC1, template: "arena", phase: "score", topBar: true, topBarState: TB2, scenario: 1, copy: { h: "Новая карта навыка", t: "Ты распознал ловушку. Карта «Ложный пробой» добавлена в колоду.", cta: "Забрать карту" } }, { chart: true, cards: [7], cardOffset: 1 }),
  page({ id: "P13", title: "Заход 3 · Карты в бою", section: "Арена", state: "tutorial 1/3", source: SRC1, template: "tutorial", topBar: true, topBarState: TB2, tutorial: { lesson: "Заход 3 · Карты навыков", step: 1, total: 3 }, scenario: 2, copy: { h: "Карта — это приём", t: "Перед решением примени одну карту. Она подсветит, что искать на графике.", cta: "Открыть колоду" } }, { cards: [1, 2, 7], cardOffset: 3 }),
  page({ id: "P14", title: "Заход 3 · Выбери карту", section: "Арена", state: "tutorial 2/3 · pick card", source: SRC1, template: "arena", phase: "observe", topBar: true, topBarState: TB2, tutorial: { lesson: "Заход 3 · Карты навыков", step: 2, total: 3 }, scenario: 2, copy: { h: "Какой приём применить?", t: "Выбери карту — график подсветит её зону.", cta: "Применить" } }, { chart: true, cards: [2, 8, 25], cardOffset: 2 }),
  page({ id: "P15", title: "Заход 3 · Решение", section: "Арена", state: "tutorial 3/3 · decision", source: SRC1, template: "arena", phase: "decision", topBar: true, topBarState: TB2, tutorial: { lesson: "Заход 3 · Карты навыков", step: 3, total: 3 }, scenario: 2, copy: { h: "Решение с картой «Откат»", t: "Карта активна. Направление и уверенность — за тобой.", cta: "Seal" } }, { chart: true, cards: [8] }),
  page({ id: "P16", title: "Заход 3 · Reveal + событие", section: "Арена", state: "reveal · key event", source: SRC1, template: "arena", phase: "reveal", topBar: true, topBarState: TB2, scenario: 2, copy: { h: "Перематываем время", t: "Ретест поддержки — разворот.", cta: "К оценке" } }, { chart: true }),
  page({ id: "P17", title: "Заход 3 · Оценка → Академия", section: "Арена", state: "score · academy unlock", source: SRC1, template: "arena", phase: "score", topBar: true, topBarState: TB3, scenario: 2, copy: { h: "Не хватило приёма?", t: "Тайминг просел: нужен приём «Объём». Академия открыта — там его дают.", cta: "В Академию", secondary: "Ещё заход" } }, { chart: true, cards: [4] }),
  page({ id: "P18", title: "Академия · Дерево тем", section: "Академия", state: "default", source: SRC2, template: "academy", topBar: true, topBarState: TB3, copy: { h: "Академия", t: "Темы открываются по мере заходов на Арену.", cta: "Продолжить урок" } }, { cards: [1, 16, 25, 34] }),
  page({ id: "P19", title: "Академия · Урок", section: "Академия", state: "lesson 2/4", source: SRC2, template: "lesson", topBar: true, topBarState: TB3, tutorial: { lesson: "Объём подтверждает движение", step: 2, total: 4 }, scenario: 0, copy: { h: "Рост без объёма — подозрителен", t: "Если цена растёт, а столбики объёма уменьшаются, покупателей всё меньше. Такой рост легко ломается.", cta: "Дальше" } }, { chart: true, cards: [4] }),
  page({ id: "P20", title: "Академия · Проверка", section: "Академия", state: "quiz · unanswered", source: SRC2, template: "quiz", topBar: true, topBarState: TB3, scenario: 0, copy: { h: "Что говорит объём?", t: "Цена обновила максимум, объём — нет.", cta: "Ответить" } }, { chart: true }),
  page({ id: "P21", title: "Колода карт навыков", section: "Академия", state: "deck · 40 cards", source: SRC2, template: "deck", topBar: true, topBarState: TB3, copy: { h: "Колода", t: "c01–c40 · четыре группы", cta: "На Арену" } }, { cards: [1] }),
  page({ id: "P22", title: "Карта навыка · Детали", section: "Академия", state: "card detail", source: SRC2, template: "card", topBar: true, topBarState: TB3, copy: { h: "Дивергенция", t: "Цена делает новый максимум, а индикатор — нет. Сигнал слабости движения.", cta: "Взять в заход" } }, { cards: [9], cardOffset: 9 }),
  page({ id: "P23", title: "Арена · Выбор сценария", section: "Арена", state: "select", source: SRC2, template: "select", topBar: true, topBarState: TB3, copy: { h: "Арена", t: "Выбери исторический сценарий", cta: "Начать заход" } }, { hero: heroFrom(4) }),
  page({ id: "P24", title: "Арена · График со всеми зонами", section: "Арена", state: "observe · full", source: SRC2, template: "arena", phase: "observe", topBar: true, topBarState: TB3, scenario: 0, copy: { h: "Разметь график", t: "Уровни, объём, свечные сигналы — все зоны доступны.", cta: "К решению" } }, { chart: true, cards: [2, 4, 9, 27], cardOffset: 5 }),
  page({ id: "P25", title: "Арена · Решение", section: "Арена", state: "decision · full", source: SRC2, template: "arena", phase: "decision", topBar: true, topBarState: TB3, scenario: 0, copy: { h: "Твоё решение", t: "Направление · уверенность · карта · стоп.", cta: "Seal" } }, { chart: true, cards: [9, 25] }),
  page({ id: "P26", title: "Арена · Reveal", section: "Арена", state: "reveal", source: SRC2, template: "arena", phase: "reveal", topBar: true, topBarState: TB3, scenario: 0, copy: { h: "Перематываем время", t: "", cta: "К оценке" } }, { chart: true }),
  page({ id: "P27", title: "Арена · Оценка", section: "Арена", state: "score · full", source: SRC2, template: "arena", phase: "score", topBar: true, topBarState: TB3, scenario: 0, copy: { h: "Оценка захода", t: "Направление · тайминг · риск · объяснение", cta: "Разбор", secondary: "Ещё заход" } }, { chart: true, cards: [9] }),
  page({ id: "P28", title: "Разбор захода", section: "Арена", state: "debrief", source: SRC2, template: "debrief", topBar: true, topBarState: TB3, scenario: 0, copy: { h: "Разбор", t: "Что было на графике и что ты пропустил.", cta: "Готово" } }, { chart: true, cards: [4, 9, 11], cardOffset: 4 }),
  page({ id: "P29", title: "Профиль", section: "Профиль", state: "default", source: SRC2, template: "profile", topBar: true, topBarState: TB3, copy: { h: "Профиль", t: "Прогресс, точность, серия", cta: "Поделиться" } }, { hero: heroFrom(8), cards: [1, 7, 9] }),
  page({ id: "P30", title: "Настройки", section: "Сервис", state: "default", source: SRC2, template: "settings", topBar: true, topBarState: TB3, copy: { h: "Настройки", t: "Звук · вибрация · язык · тема", cta: "Сохранить" } }, {}, 3, "4-й вариант был бы дубликатом: экран без иллюстраций и графика, меняется только фон"),
  page({ id: "P31", title: "Уведомления", section: "Сервис", state: "list · 2 new", source: SRC2, template: "notifications", topBar: true, topBarState: TB3, copy: { h: "Уведомления", t: "", cta: "Прочитать все" } }, {}, 3, "4-й вариант был бы дубликатом: список без визуальных слотов кроме фона"),
  page({ id: "P32", title: "Состояние · Попытки закончились", section: "Сервис", state: "empty energy", source: SRC2, template: "state", topBar: true, topBarState: TBE, copy: { h: "Попытки закончились", t: "Следующая — через 42 мин. Или пройди урок в Академии и получи +1.", cta: "В Академию", secondary: "Подождать" } }, { hero: heroFrom(12) }),
  page({ id: "P33", title: "Состояние · Загрузка / ошибка", section: "Сервис", state: "loading · error", source: SRC2, template: "state", topBar: true, topBarState: TB3, copy: { h: "Загружаем сценарий", t: "Если сеть пропала — попробуем ещё раз.", cta: "Повторить" } }, {}, 3, "4-й вариант был бы дубликатом: только спиннер и фон"),
  page({ id: "P34", title: "Состояние · Новый уровень", section: "Сервис", state: "level up · reward", source: SRC2, template: "state", topBar: true, topBarState: { ...TB3, lvl: 4, xp: 0 }, copy: { h: "Уровень 4", t: "+50 монет · +1 попытка · открыта тема «Риск»", cta: "Забрать" } }, { hero: heroFrom(16), cards: [25], cardOffset: 1 }),
];

export const NAV = [
  { id: "academy", label: "Академия" },
  { id: "arena", label: "Арена" },
  { id: "profile", label: "Профиль" },
] as const;

export function navFor(p: Page): (typeof NAV)[number]["id"] {
  if (p.section === "Академия") return "academy";
  if (p.section === "Профиль") return "profile";
  return "arena";
}
