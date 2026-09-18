/* ============================================================================
   CATALOG — Page Inventory (P01…P34), Asset Variants (A/B/C/D), Asset Matrix
   Variant contract (updated after art-direction review):
     · invariant: brand language, copy, typography system, canonical Top Bar,
       bottom navigation, mechanics, meaning and state data;
     · variable: composition of major zones, assetId, chart treatment, reveal,
       visual effects, motion choreography and touch-feedback preset.
   ========================================================================== */

export type SourceKind =
  | "REPO_FILE"          // file exists in the asset repository
  | "REPO_NAMES"         // names/semantics from the repo, geometry authored in spec style
  | "AUTHORED_IN_SPEC_STYLE"
  | "PROCEDURAL"
  | "MISSING";

export type SlotKind =
  | "background" | "emblem" | "chart" | "reveal" | "cue"
  | "hero" | "ornament" | "feed" | "hand" | "frame" | "event";

export type MotionPresetId = "subtle" | "punchy" | "cinematic";

export interface AssetDef {
  id: string;
  kind: SlotKind | "icon" | "set";
  source: SourceKind;
  label: string;
  repoPath?: string;
  note: string;
  fallback: string;
  spec: ArtSpec;
}

export interface ArtSpec {
  motif: string;
  tint: "teal" | "gold" | "steel" | "ember" | "ice" | "neutral";
  treatment?: string;
}

export interface SlotDef {
  slot: SlotKind;
  purpose: string;
  fallback: string;
  placement: string;
}

export interface VariantDef {
  id: string;
  label: string;
  motion: MotionPresetId;
  assign: Record<string, string>;
  note: string;
}

export interface PageDef {
  id: string;
  key: string;
  title: string;
  section: PageSection;
  state: string;
  source: string;
  slots: SlotDef[];
  variants: VariantDef[];
  locks: string;
}

export type PageSection = "ОНБОРДИНГ" | "ОБУЧЕНИЕ" | "АРЕНА" | "МЕТА" | "ИТОГ";

export const SECTIONS: PageSection[] = ["ОНБОРДИНГ", "ОБУЧЕНИЕ", "АРЕНА", "МЕТА", "ИТОГ"];

/* =============================== ASSET POOLS ============================== */
export const BG_POOL = ["BG-ARENA-RADIAL", "BG-AURORA-GRID", "BG-TAPE-MARKET", "BG-SCANLINE-DECK", "BG-DEPTH-WALL"];
export const CHART_POOL = ["CHT-GLOW", "CHT-HOLLOW", "CHT-DEPTH", "CHT-IMPULSE"];
export const REVEAL_POOL = ["REV-IRIS", "REV-BLINDS", "REV-TAPE", "REV-BLOOM"];
export const CUE_POOL = ["CUE-TARGET-RING", "CUE-LEVEL-DASH", "CUE-WHALE-BAND", "CUE-RETEST-TRAY"];
export const HAND_POOL = ["HAND-CORE-30", "HAND-MACRO-24", "HAND-RISK-30", "HAND-DISCIPLINE-24"];
export const FEED_POOL = ["FEED-IMMERSIVE", "FEED-TABLET", "FEED-LOWER-THIRD", "FEED-TICKER"];

const P = (motif: string, tint: ArtSpec["tint"], treatment = "base") => ({ motif, tint, treatment });

/* ============================ ASSET REGISTRY ============================== */
function mk(
  id: string, kind: AssetDef["kind"], source: SourceKind, label: string, note: string,
  spec: ArtSpec, fallback = "procedural:motif", repoPath?: string,
): AssetDef {
  return { id, kind, source, label, note, spec, fallback, repoPath };
}

export const ASSETS: Record<string, AssetDef> = {};

const add = (a: AssetDef) => { ASSETS[a.id] = a; return a; };

/* --- canonical Top Bar icons (files confirmed in topbar/icons) --- */
add(mk("ICO-BOLT", "icon", "REPO_FILE", "lightning.svg", "Энергия/попытки в Top Bar", P("bolt", "gold"), "draw-inline:IO_BOLT", "topbar/icons/lightning.svg"));
add(mk("ICO-STAR", "icon", "REPO_FILE", "star.svg", "Звёзды оценки раунда", P("star", "gold"), "draw-inline:IO_STAR", "topbar/icons/star.svg"));
add(mk("ICO-COIN", "icon", "REPO_FILE", "coin.svg", "Монеты сезона", P("coin", "gold"), "draw-inline:IO_COIN", "topbar/icons/coin.svg"));
add(mk("ICO-BELL", "icon", "REPO_FILE", "bell.svg", "Уведомления + badge", P("bell", "steel"), "draw-inline:IO_BELL", "topbar/icons/bell.svg"));
add(mk("ICO-GEAR", "icon", "REPO_FILE", "gear.svg", "Настройки", P("gear", "steel"), "draw-inline:IO_GEAR", "topbar/icons/gear.svg"));
add(mk("UI-NAV-ACADEMY", "icon", "AUTHORED_IN_SPEC_STYLE", "nav/academy", "Раздел Академии", P("navAcademy", "neutral"), "draw-inline:UI_ICONS"));
add(mk("UI-NAV-ARENA", "icon", "AUTHORED_IN_SPEC_STYLE", "nav/arena", "Раздел Арены — скрещённые свечи", P("navArena", "neutral"), "draw-inline:UI_ICONS"));
add(mk("UI-NAV-COLLECTION", "icon", "AUTHORED_IN_SPEC_STYLE", "nav/collection", "Раздел Коллекции карт", P("navCollection", "neutral"), "draw-inline:UI_ICONS"));
add(mk("UI-NAV-MORE", "icon", "AUTHORED_IN_SPEC_STYLE", "nav/more", "Раздел «Ещё»", P("navMore", "neutral"), "draw-inline:UI_ICONS"));

/* --- emblem system (brand.md: crossed candles over arena shield) --- */
add(mk("EMB-FULL", "emblem", "AUTHORED_IN_SPEC_STYLE", "emblem/full", "Эмблема: щит арены + две скрещённые свечи", P("emblem-full", "teal")));
add(mk("EMB-INVERSE", "emblem", "AUTHORED_IN_SPEC_STYLE", "emblem/inverse", "Инверсия для светлых подложек", P("emblem-inverse", "neutral")));
add(mk("EMB-COMPACT", "emblem", "AUTHORED_IN_SPEC_STYLE", "emblem/compact", "Компактная версия (сечение клинка в свече)", P("emblem-compact", "teal")));

/* --- backgrounds --- */
add(mk("BG-ARENA-RADIAL", "background", "PROCEDURAL", "bg/arena-radial", "Радиальная арена, тёплое пятно на t0", P("arena-radial", "teal")));
add(mk("BG-AURORA-GRID", "background", "PROCEDURAL", "bg/aurora-grid", "Сетка с аврора-градиентом", P("aurora-grid", "ice")));
add(mk("BG-TAPE-MARKET", "background", "PROCEDURAL", "bg/tape-market", "Лента котировок как фон", P("tape-market", "neutral")));
add(mk("BG-SCANLINE-DECK", "background", "PROCEDURAL", "bg/scanline-deck", "Сканирующая палуба со свечами", P("scanline-deck", "steel")));
add(mk("BG-DEPTH-WALL", "background", "PROCEDURAL", "bg/depth-wall", "Стены стакана на фоне", P("depth-wall", "ember")));

/* --- chart treatments --- */
add(mk("CHT-GLOW", "chart", "PROCEDURAL", "chart/glow-candles", "Свечи с неоновым свечением (neo-arcade)", P("chart-glow", "teal")));
add(mk("CHT-HOLLOW", "chart", "AUTHORED_IN_SPEC_STYLE", "chart/hollow-candles", "Растущие свечи пустые — падающие залитые", P("chart-hollow", "steel")));
add(mk("CHT-DEPTH", "chart", "PROCEDURAL", "chart/depth-ladder", "Свечи + лестница стакана и китовая стена", P("chart-depth", "ice")));
add(mk("CHT-IMPULSE", "chart", "PROCEDURAL", "chart/impulse-tape", "Импульсная кривая с фазовым разрывом в t0", P("chart-impulse", "ember")));

/* --- reveal effects --- */
add(mk("REV-IRIS", "reveal", "PROCEDURAL", "reveal/iris", "Диафрагма раскрывается из t0", P("reveal-iris", "teal")));
add(mk("REV-BLINDS", "reveal", "PROCEDURAL", "reveal/blinds", "Жалюзи дорисовывают продолжение", P("reveal-blinds", "steel")));
add(mk("REV-TAPE", "reveal", "PROCEDURAL", "reveal/tape-rewind", "Перемотка ленты со скоростными штрихами", P("reveal-tape", "ember")));
add(mk("REV-BLOOM", "reveal", "PROCEDURAL", "reveal/bloom", "Вспышка и частицы от свечи события", P("reveal-bloom", "gold")));

/* --- cues (target highlight, pointer, focus ring) --- */
add(mk("CUE-TARGET-RING", "cue", "PROCEDURAL", "cue/target-ring", "Пульсирующее кольцо цели + подпись", P("cue-target-ring", "teal")));
add(mk("CUE-LEVEL-DASH", "cue", "PROCEDURAL", "cue/level-dash", "Пунктир уровня с подсветкой зоны падения", P("cue-level-dash", "gold")));
add(mk("CUE-WHALE-BAND", "cue", "PROCEDURAL", "cue/whale-band", "Полоса китовой стены как цель", P("cue-whale-band", "ice")));
add(mk("CUE-RETEST-TRAY", "cue", "PROCEDURAL", "cue/retest-tray", "Лоток ретеста с двумя краями зоны", P("cue-retest-tray", "ember")));

/* --- hero visuals for tutorial / academy --- */
const heroSpecs: [string, string, ArtSpec["tint"]][] = [
  ["VIS-CANDLE-ANATOMY", "hero/candle-anatomy", "teal"],
  ["VIS-CANDLE-DUEL", "hero/candle-duel", "ember"],
  ["VIS-TREND-LADDER", "hero/trend-ladder", "teal"],
  ["VIS-TREND-RIBBON", "hero/trend-ribbon", "ice"],
  ["VIS-VOLUME-BARS", "hero/volume-bars", "gold"],
  ["VIS-VOLUME-STAIR", "hero/volume-stair", "teal"],
  ["VIS-RISK-RULER", "hero/risk-ruler", "ember"],
  ["VIS-RISK-SHIELD", "hero/risk-shield", "gold"],
  ["VIS-TF-STACK", "hero/tf-stack", "ice"],
  ["VIS-TF-CLOCK", "hero/tf-clock", "steel"],
  ["VIS-SEAL-PRESS", "hero/seal-press", "teal"],
  ["VIS-SEAL-OATH", "hero/seal-oath", "gold"],
];
heroSpecs.forEach(([id, motif, tint]) => add(mk(id, "hero", "PROCEDURAL", motif, "Учебная иллюстрация шага", P(motif, tint))));

/* --- ornaments --- */
const ornSpecs: [string, string, ArtSpec["tint"]][] = [
  ["ORN-CREST-GOLD", "orn/crest", "gold"],
  ["ORN-CREST-STEEL", "orn/crest", "steel"],
  ["ORN-CREST-EMBER", "orn/crest", "ember"],
  ["ORN-VAULT", "orn/vault", "teal"],
  ["ORN-VAULT-LEDGER", "orn/vault", "gold"],
  ["ORN-VAULT-ICE", "orn/vault", "ice"],
  ["ORN-FRAME-ARC", "orn/frame", "steel"],
  ["ORN-FRAME-SIGIL", "orn/frame", "gold"],
  ["ORN-CHAIN", "orn/chain", "ember"],
  ["ORN-CHAIN-HEX", "orn/chain", "teal"],
  ["ORN-CUP", "orn/cup", "gold"],
  ["ORN-CUP-BANNER", "orn/cup", "ember"],
  ["ORN-BLADES", "orn/blades", "teal"],
  ["ORN-BLADES-CROSS", "orn/blades", "ember"],
  ["ORN-PODIUM", "orn/podium", "gold"],
  ["ORN-PODIUM-RING", "orn/podium", "ice"],
  ["ORN-ARCHIVE", "orn/archive", "steel"],
  ["ORN-ARCHIVE-COVERS", "orn/archive", "teal"],
  ["ORN-CHALK", "orn/chalk", "ice"],
  ["ORN-CHALK-PROJ", "orn/chalk", "steel"],
  ["ORN-RADAR", "orn/radar", "teal"],
  ["ORN-RADAR-WEB", "orn/radar", "ember"],
  ["ORN-BELLS", "orn/bells", "steel"],
  ["ORN-BELLS-TAPE", "orn/bells", "gold"],
  ["ORN-SCROLL", "orn/scroll", "teal"],
  ["ORN-SCROLL-SEAL", "orn/scroll", "gold"],
  ["ORN-STAMP", "orn/stamp", "ember"],
  ["ORN-STAMP-LIGHT", "orn/stamp", "teal"],
  ["ORN-STRIKE", "orn/strike", "ember"],
  ["ORN-STRIKE-GAP", "orn/strike", "ice"],
];
ornSpecs.forEach(([id, motif, tint]) => add(mk(id, "ornament", "PROCEDURAL", motif, "Декор экрана", P(motif, tint))));

/* --- feed treatments --- */
add(mk("FEED-IMMERSIVE", "feed", "PROCEDURAL", "feed/immersive", "Крупные новостные карточки с тегами", P("immersive", "teal")));
add(mk("FEED-TABLET", "feed", "PROCEDURAL", "feed/tablet", "Планшет новостей с иконками", P("tablet", "steel")));
add(mk("FEED-LOWER-THIRD", "feed", "PROCEDURAL", "feed/lower-third", "Нижняя треть эфира: одна новость крупно", P("lower-third", "ember")));
add(mk("FEED-TICKER", "feed", "PROCEDURAL", "feed/ticker", "Бегущая строка плюс лента", P("ticker", "gold")));

/* --- skill hand sets --- */
add(mk("HAND-CORE-30", "hand", "PROCEDURAL", "hand/core", "Базовая рука: структура, объём, ретест", P("hand-core", "teal")));
add(mk("HAND-MACRO-24", "hand", "PROCEDURAL", "hand/macro", "Рука контекста: macro, news, source", P("hand-macro", "ice")));
add(mk("HAND-RISK-30", "hand", "PROCEDURAL", "hand/risk", "Рука риска: R, стоп, лимит", P("hand-risk", "ember")));
add(mk("HAND-DISCIPLINE-24", "hand", "PROCEDURAL", "hand/discipline", "Рука дисциплины: правила и отказы", P("hand-discipline", "steel")));

/* --- skill card icons c01…c40 (names from repo) --- */
export const SKILL_ASSET_IDS = Array.from({ length: 40 }, (_, i) => `SKL-C${String(i + 1).padStart(2, "0")}`);
SKILL_ASSET_IDS.forEach((id, i) => {
  const code = `c${String(i + 1).padStart(2, "0")}`;
  add(mk(id, "icon", "REPO_FILE", `skill-card-icons/${code}`, "Канонический SVG из GitHub: белая hybrid filled-outline иконка", P(`skill-${code}`, "neutral"), "local-authored-fallback", `skill-card-icons/${code}_*.svg`));
});

/* ========================= MISSING ASSET REPORT =========================== */
export interface MissingAsset {
  name: string;
  requestedAs: string;
  status: "NOT_FOUND" | "NOT_RETRIEVABLE" | "NOT_ENUMERABLE";
  detail: string;
  action: string;
}

export const MISSING_ASSETS: MissingAsset[] = [
  { name: "skill-card-icons.zip", requestedAs: "архив обязательных SVG-иконок skill cards", status: "NOT_FOUND", detail: "В репозитории архива нет — есть распакованная директория skill-card-icons/ с c01…c40 и preview-24/32/48/mobile/preview.svg.", action: "Используются точные raw SVG c01…c40 непосредственно из этой директории GitHub (REPO_FILE)." },
  { name: "topbar.zip", requestedAs: "архив настоящего Top Bar", status: "NOT_FOUND", detail: "Архива нет — есть директория topbar/ c topbar.html, topbar.png и icons/.", action: "Top Bar собран как SHARED_TOP_BAR_LOCKED по topbar.html (формат LVL/XP/энергия/звёзды/монеты/колокол/шестерня)." },
  { name: "topbar/topbar.png", requestedAs: "визуальный эталон топбара", status: "NOT_RETRIEVABLE", detail: "Бинарный PNG недоступен как ассет сборки.", action: "Эталоном остаётся topbar.html; PNG не подменяется." },
  { name: "logo_concept.png", requestedAs: "концепт эмблемы", status: "NOT_RETRIEVABLE", detail: "Бинарный PNG недоступен.", action: "Эмблема построена по текстовому описанию brand.md: две скрещённые свечи (рост/падение) на щите арены." },
  { name: "game2.pdf", requestedAs: "MVP-спека", status: "NOT_RETRIEVABLE", detail: "PDF не читается как текст — порядок экранов в машиночитаемом виде недоступен.", action: "Page Inventory P01…P34 построен по спецификации промпта; случайные страницы не добавлены, существующие не удалены. См. PAGE_COUNT_MISMATCH." },
  { name: "рототипы_экранов__casual_2D_(раскадровка_все_страницы).pdf", requestedAs: "раскадровка всех страниц", status: "NOT_RETRIEVABLE", detail: "PDF-раскадровка недоступна.", action: "Экраны реализованы по порядку из промпта; сравнение возможно только визуально." },
  { name: "fTWMzMdLqp9JKcqNJUnALPFUgeG81ecd0OjIECQ2Jn0.png", requestedAs: "preview asset reference", status: "NOT_RETRIEVABLE", detail: "Имя без расширения семантики, бинарный PNG недоступен.", action: "Не подменяется случайным ассетом; слот остаётся на процедурном artwork." },
  { name: "assets/interactive-mobile-ui-catalog (3)", requestedAs: "catalog-архив UI", status: "NOT_ENUMERABLE", detail: "Каталог описан, но файлы внутри недоступны для сборки.", action: "Использованы только доступные источники: brand.md, style-tone.txt, topbar.html, имена skill-card-icons." },
  { name: "assets/premium-mobile-motion-asset-catalog", requestedAs: "каталог motion-ассетов", status: "NOT_ENUMERABLE", detail: "Файлы каталога недоступны.", action: "Motion собран собственными токенами (assets/motion99 — доступный README с перечнем приёмов)." },
];

export const PAGE_COUNT_MISMATCH = {
  requested: 34,
  machineReadableSources: 1,
  found: "game.html (48 КБ, 662 строки) — единственный машиночитаемый MVP. Доступна только шапка: «Часть 1: раскадровка первых 8 минут, три захода на Арену, каждый добавляет одну механику; обучения как раздела нет. Часть 2: Академия (дерево тем, уроки), колода карт, полный заход на Арену со всеми зонами, раскрытие и оценка, разбор, профиль, обслуживающие экраны и состояния. Меню: Академия — Арена — Профиль. Top Bar: 5 иконок». Тело слотов (.grid) обрезается всеми доступными прокси.",
  missingPages: "Точная нумерация и подписи слотов game.html не извлечены; game2.pdf и PDF-раскадровка не читаются как текст.",
  action: "P01…P34 сверены с шапкой game.html: меню сведено к 3 пунктам, Top Bar — к 5 иконкам, обучение перенесено в первые заходы Арены. Точное соответствие номеров слотов требует ручной сверки владельца.",
};

export const ARCHIVE_STATUS = [
  { name: "assets.zip", status: "ASSET_ARCHIVE_NOT_EXTRACTED", detail: "В дереве репозитория zip отсутствует; есть распакованный каталог assets/ (index.html 81 КБ, 4 подпроекта). Содержимое каталогов недоступно как ассеты сборки." },
  { name: "skill-card-icons.zip", status: "ASSET_ARCHIVE_NOT_EXTRACTED", detail: "Zip отсутствует; распакованная папка skill-card-icons/ прочитана полностью — все 40 векторов c01…c40 использованы дословно." },
  { name: "topbar.zip", status: "ASSET_ARCHIVE_NOT_EXTRACTED", detail: "Zip отсутствует; распакованная папка topbar/ прочитана — topbar.html и 5 SVG использованы дословно." },
];

/* ================================= PAGES ================================== */
const bgSlot: SlotDef = { slot: "background", purpose: "Фон арены — задаёт настроение экрана", fallback: "BG-ARENA-RADIAL", placement: "full-bleed · cover · scale 1.00 · pos 50% 50%" };
const LOCK_TEXT = "бренд-язык · тексты · типографическая система · SHARED_TOP_BAR_LOCKED · нижнее меню · механика · смысл состояний";

function slots(list: [SlotKind, string, string, string][]): SlotDef[] {
  return [bgSlot, ...list.map(([slot, purpose, fallback, placement]) => ({ slot, purpose, fallback, placement }))];
}

type Picks = Partial<Record<SlotKind, string[]>>;

function bg(i: number) {
  return BG_POOL[i % BG_POOL.length];
}

function four(
  pageIndex: number,
  extra: [SlotKind, string, string, string][],
  picks: Picks,
  notes: string[],
): VariantDef[] {
  const ids = ["A", "B", "C", "D"];
  const motions: MotionPresetId[] = ["cinematic", "punchy", "subtle", "cinematic"];
  return ids.map((id, i) => {
    const assign: Record<string, string> = { background: bg(pageIndex + i) };
    (Object.keys(picks) as SlotKind[]).forEach((slot) => {
      const pool = picks[slot];
      if (!pool || pool.length === 0) return;
      assign[slot] = pool[i % pool.length];
    });
    const list = extra.map(([slot, , fallback]) => `${slot}:${assign[slot] ?? fallback}`).join(" · ");
    return {
      id,
      label: `P${String(pageIndex + 1).padStart(2, "0")}-${id}`,
      motion: motions[i],
      assign,
      note: `${list} — ${notes[i]}`,
    };
  });
}

function three(pageIndex: number, extra: [SlotKind, string, string, string][], picks: Picks, notes: string[]): VariantDef[] {
  const all = four(pageIndex, extra, picks, [...notes, notes[0]]);
  return all.slice(0, 3).map((v, i) => ({ ...v, label: `P${String(pageIndex + 1).padStart(2, "0")}-${["A", "B", "C"][i]}`, note: v.note }));
}

function page(
  no: number, key: string, title: string, section: PageSection, state: string, source: string,
  extra: [SlotKind, string, string, string][],
  picks: Picks,
  notes: string[],
  threeVariants = false,
): PageDef {
  const i = no - 1;
  return {
    id: `P${String(no).padStart(2, "0")}`,
    key, title, section, state, source,
    slots: slots(extra),
    variants: threeVariants ? three(i, extra, picks, notes) : four(i, extra, picks, notes),
    locks: LOCK_TEXT,
  };
}

const BG_VARIANTS_NOTE = [
  "насыщенный кинематографичный фон, реверс-градиент к нижнему CTA",
  "ускоренный ритм, плотная сетка, усиленная подсветка активных зон",
  "тихий фон, минимум декора, акцент уходит на типографику",
  "ленточный декор и мягкое движение слоёв, длинная раскрывающая анимация",
];

export const PAGES: PageDef[] = [
  /* ---------- ОНБОРДИНГ ---------- */
  page(1, "p01", "СПЛЭШ АРЕНЫ", "ОНБОРДИНГ", "splash · loading · Top Bar отсутствует", "game.html Часть 1: первое открытие", [
    ["emblem", "Эмблема арены на старте", "EMB-FULL", "center · contain · scale 1.00"],
  ], { emblem: ["EMB-FULL", "EMB-COMPACT", "EMB-INVERSE", "EMB-FULL"] }, BG_VARIANTS_NOTE, true),
  page(2, "p02", "ДОКЛАД: ЗАЧЕМ ТЫ ЗДЕСЬ", "ОНБОРДИНГ", "welcome · Top Bar в пустом/disabled состоянии", "Промпт: welcome + голос style-tone.txt", [
    ["hero", "Главная мысль экрана", "VIS-CANDLE-DUEL", "content · cover · scale 1.00"],
    ["cue", "Подсветка главного действия", "CUE-TARGET-RING", "overlay · scale 1.00"],
  ], { hero: ["VIS-CANDLE-DUEL", "VIS-CANDLE-ANATOMY", "VIS-SEAL-OATH"], cue: ["CUE-TARGET-RING", "CUE-LEVEL-DASH", "CUE-WHALE-BAND"] }, BG_VARIANTS_NOTE, true),
  page(3, "p03", "ПРАВИЛА АРЕНЫ", "ОНБОРДИНГ", "intro · обучение не начато", "Промпт: правила и последовательность обучения", [
    ["hero", "Схема правил", "VIS-RISK-SHIELD", "content · contain · scale 1.00"],
    ["ornament", "Декор ранга", "ORN-CREST-GOLD", "side · contain · scale 0.92"],
  ], { hero: ["VIS-RISK-SHIELD", "VIS-RISK-RULER", "VIS-TF-STACK"], ornament: ["ORN-CREST-GOLD", "ORN-CREST-STEEL", "ORN-CREST-EMBER"] }, BG_VARIANTS_NOTE, true),

  /* ---------- ОБУЧЕНИЕ: 6 последовательных карточек ---------- */
  page(4, "p04", "ЗАХОД 1 · СВЕЧА КАК КЛИНОК", "ОБУЧЕНИЕ", "первый заход на Арену · механика 1 · прогресс 1/6", "game.html: «обучение и есть первые заходы на Арену»", [
    ["hero", "Анатомия свечи", "VIS-CANDLE-ANATOMY", "visual · contain · scale 1.00"],
    ["cue", "Куда нажать (тело свечи)", "CUE-TARGET-RING", "overlay · scale 1.00"],
  ], { hero: ["VIS-CANDLE-ANATOMY", "VIS-CANDLE-DUEL", "VIS-CANDLE-ANATOMY", "VIS-CANDLE-DUEL"], cue: CUE_POOL.slice(0, 4) }, BG_VARIANTS_NOTE),
  page(5, "p05", "ШАГ 2/6 · ТРЕНД", "ОБУЧЕНИЕ", "tutorial 2 из 6 · прогресс 2/6", "Промпт: tutorial cards", [
    ["hero", "Лестница структуры", "VIS-TREND-LADDER", "visual · contain · scale 1.00"],
    ["cue", "Фокус-ринг на максимуме", "CUE-TARGET-RING", "overlay · scale 1.00"],
  ], { hero: ["VIS-TREND-LADDER", "VIS-TREND-RIBBON", "VIS-TREND-LADDER", "VIS-TREND-RIBBON"], cue: [CUE_POOL[0], CUE_POOL[1], CUE_POOL[3], CUE_POOL[2]] }, BG_VARIANTS_NOTE),
  page(6, "p06", "ШАГ 3/6 · ОБЪЁМ", "ОБУЧЕНИЕ", "tutorial 3 из 6 · прогресс 3/6", "Промпт: tutorial cards + c03", [
    ["hero", "Столбцы объёма", "VIS-VOLUME-BARS", "visual · contain · scale 1.00"],
    ["cue", "Отметка настоящего пробоя", "CUE-LEVEL-DASH", "overlay · scale 1.00"],
  ], { hero: ["VIS-VOLUME-BARS", "VIS-VOLUME-STAIR", "VIS-VOLUME-BARS", "VIS-VOLUME-STAIR"], cue: [CUE_POOL[1], CUE_POOL[0], CUE_POOL[2], CUE_POOL[3]] }, BG_VARIANTS_NOTE),
  page(7, "p07", "ШАГ 4/6 · РИСК", "ОБУЧЕНИЕ", "tutorial 4 из 6 · прогресс 4/6", "Промпт: tutorial cards + c38/c20", [
    ["hero", "Линейка риска", "VIS-RISK-RULER", "visual · contain · scale 1.00"],
    ["cue", "Зона допустимого риска", "CUE-RETEST-TRAY", "overlay · scale 1.00"],
  ], { hero: ["VIS-RISK-RULER", "VIS-RISK-SHIELD", "VIS-RISK-RULER", "VIS-RISK-SHIELD"], cue: [CUE_POOL[3], CUE_POOL[0], CUE_POOL[1], CUE_POOL[2]] }, BG_VARIANTS_NOTE),
  page(8, "p08", "ШАГ 5/6 · ТАЙМФРЕЙМЫ", "ОБУЧЕНИЕ", "tutorial 5 из 6 · прогресс 5/6", "Промпт: tutorial cards + c02/c29", [
    ["hero", "Стек таймфреймов", "VIS-TF-STACK", "visual · contain · scale 1.00"],
    ["cue", "Фокус на старшем ТФ", "CUE-WHALE-BAND", "overlay · scale 1.00"],
  ], { hero: ["VIS-TF-STACK", "VIS-TF-CLOCK", "VIS-TF-STACK", "VIS-TF-CLOCK"], cue: [CUE_POOL[2], CUE_POOL[1], CUE_POOL[0], CUE_POOL[3]] }, BG_VARIANTS_NOTE),
  page(9, "p09", "ШАГ 6/6 · РЕШЕНИЕ И ПЕЧАТЬ", "ОБУЧЕНИЕ", "tutorial 6 из 6 · прогресс 6/6 · завершение урока", "Промпт: tutorial cards + Seal", [
    ["hero", "Печать решения", "VIS-SEAL-PRESS", "visual · contain · scale 1.00"],
    ["cue", "Hold-ринг на печати", "CUE-TARGET-RING", "overlay · scale 1.00"],
  ], { hero: ["VIS-SEAL-PRESS", "VIS-SEAL-OATH", "VIS-SEAL-PRESS", "VIS-SEAL-OATH"], cue: CUE_POOL.slice(0, 4) }, BG_VARIANTS_NOTE),

  /* ---------- АРЕНА: вход и раунд ---------- */
  page(10, "p10", "АРЕНА · ХАБ", "АРЕНА", "default · first-visit · no-attempts · locked-cards", "game.html Часть 2: полный заход на Арену", [
    ["ornament", "Знак сценария/раунда", "ORN-CREST-GOLD", "card corner · contain · scale 0.9"],
    ["hand", "Состав колоды карт раунда", "HAND-CORE-30", "row · contain · scale 1.00"],
  ], { ornament: ["ORN-CREST-GOLD", "ORN-CREST-STEEL", "ORN-CREST-EMBER", "ORN-CREST-GOLD"], hand: [HAND_POOL[0], HAND_POOL[1], HAND_POOL[2], HAND_POOL[3]] }, BG_VARIANTS_NOTE),
  page(11, "p11", "БРИФИНГ РАУНДА", "АРЕНА", "раунд начат · решение не принято", "Промпт: очерёдность экранов раунда", [
    ["ornament", "Герб сценария", "ORN-CREST-GOLD", "header · contain · scale 0.88"],
    ["chart", "Мини-превью прошлого участка", "CHT-GLOW", "panel · cover · scale 1.00"],
  ], { ornament: ["ORN-CREST-GOLD", "ORN-CREST-EMBER", "ORN-CREST-STEEL", "ORN-CREST-GOLD"], chart: CHART_POOL.slice() }, BG_VARIANTS_NOTE),
  page(12, "p12", "ЛЕНТА РАЗВЕДКИ", "АРЕНА", "новостной контекст показан · решение не принято", "SCENARIOS[].feed + style-tone.txt", [
    ["feed", "Тип подачи новостей", "FEED-IMMERSIVE", "list · contain · scale 1.00"],
    ["cue", "Метка шума/паники", "CUE-LEVEL-DASH", "overlay · scale 1.00"],
  ], { feed: FEED_POOL.slice(), cue: CUE_POOL.slice(0, 4) }, BG_VARIANTS_NOTE),
  page(13, "p13", "ГРАФИК ДО t0", "АРЕНА", "будущее закрыто · график заканчивается в t0", "Промпт: до решения будущее недоступно", [
    ["chart", "Обработка свечей до Печати", "CHT-GLOW", "panel · cover · scale 1.00"],
    ["cue", "Подсветка цели + узор фокуса", "CUE-TARGET-RING", "overlay · scale 1.00"],
  ], { chart: CHART_POOL.slice(), cue: CUE_POOL.slice(0, 4) }, BG_VARIANTS_NOTE),
  page(14, "p14", "НАБОР СИГНАЛОВ", "АРЕНА", "выбор карт раунда (до 2 из 6)", "Промпт: skill cards + c01…c40", [
    ["hand", "Колода карт раунда", "HAND-CORE-30", "grid 3×2 · contain · scale 1.00"],
    ["frame", "Арт рамки карточки", "ORN-FRAME-ARC", "behind cards · cover · scale 1.02"],
  ], { hand: HAND_POOL.slice(), frame: ["ORN-FRAME-ARC", "ORN-FRAME-SIGIL", "ORN-FRAME-ARC", "ORN-FRAME-SIGIL"] }, BG_VARIANTS_NOTE),
  page(15, "p15", "РЕШЕНИЕ · ОБОСНОВАНИЕ · ИНВАЛИДАЦИЯ", "АРЕНА", "empty · decision-picked · reason-missing · invalidation-missing · ready", "MVP: WAIT/NO_TRADE полноценны, обоснование обязательно", [
    ["chart", "Мини-график решения", "CHT-GLOW", "panel · cover · scale 1.00"],
    ["cue", "Фокус-ринг на выбранном действии", "CUE-TARGET-RING", "overlay · scale 1.00"],
  ], { chart: CHART_POOL.slice(), cue: CUE_POOL.slice(0, 4) }, BG_VARIANTS_NOTE),
  page(16, "p16", "ПЕЧАТЬ РЕШЕНИЯ", "АРЕНА", "раунд зафиксирован (переиграть нельзя)", "Промпт: Seal — фиксация решения", [
    ["ornament", "Печать арены", "ORN-STAMP", "cta · contain · scale 1.00"],
    ["cue", "Hold-ринг удержания", "CUE-TARGET-RING", "overlay · scale 1.00"],
  ], { ornament: ["ORN-STAMP", "ORN-STAMP-LIGHT", "ORN-STAMP", "ORN-STAMP-LIGHT"], cue: CUE_POOL.slice(0, 4) }, BG_VARIANTS_NOTE),
  page(17, "p17", "ПЕЧАТЬ · РАЗВЁРТКА", "АРЕНА", "fast-forward: дорисовка истории после t0", "Промпт: time-scrub + дорисовать продолжение", [
    ["chart", "Дорисовка продолжения", "CHT-GLOW", "panel · cover · scale 1.00"],
    ["reveal", "Эффект раскрытия", "REV-IRIS", "overlay · cover · scale 1.04"],
  ], { chart: CHART_POOL.slice(), reveal: REVEAL_POOL.slice() }, BG_VARIANTS_NOTE),
  page(18, "p18", "КЛЮЧЕВОЕ СОБЫТИЕ", "АРЕНА", "событие показано · оценка не выставлена", "Промпт: ключевое событие сценария", [
    ["event", "Клеймо события на графике", "ORN-STRIKE", "chart overlay · contain · scale 1.00"],
    ["chart", "Обработка свечей события", "CHT-GLOW", "panel · cover · scale 1.00"],
  ], { event: ["ORN-STRIKE", "ORN-STRIKE-GAP", "ORN-STRIKE", "ORN-STRIKE-GAP"], chart: CHART_POOL.slice() }, BG_VARIANTS_NOTE),
  page(19, "p19", "РАЗБОР", "АРЕНА", "объяснение показано · оценка не выставлена", "SCENARIOS[].debrief + c-карты", [
    ["chart", "График в режиме разбора", "CHT-HOLLOW", "panel · cover · scale 1.00"],
    ["cue", "Отметка правильной реакции", "CUE-RETEST-TRAY", "overlay · scale 1.00"],
  ], { chart: [CHART_POOL[1], CHART_POOL[0], CHART_POOL[2], CHART_POOL[3]], cue: [CUE_POOL[3], CUE_POOL[0], CUE_POOL[1], CUE_POOL[2]] }, BG_VARIANTS_NOTE),
  page(20, "p20", "ОЦЕНКА ПРОЦЕССА", "АРЕНА", "process 4 шкалы · result · unknown-topic-no-penalty", "MVP: оценка процесса, а не только результата", [
    ["ornament", "Клеймо результата", "ORN-CREST-GOLD", "header · contain · scale 0.9"],
    ["chart", "Итоговый график-свидетель", "CHT-GLOW", "panel · cover · scale 1.00"],
  ], { ornament: ["ORN-CREST-GOLD", "ORN-CREST-EMBER", "ORN-CREST-STEEL", "ORN-CREST-GOLD"], chart: CHART_POOL.slice() }, BG_VARIANTS_NOTE),
  page(21, "p21", "НАГРАДА РАУНДА", "АРЕНА", "награда получена · переход в мету", "Промпт: награды, монеты, XP", [
    ["ornament", "Хранилище награды", "ORN-VAULT", "hero · contain · scale 1.00"],
    ["hand", "Карта, открытая раундом", "HAND-CORE-30", "row · contain · scale 1.00"],
  ], { ornament: ["ORN-VAULT", "ORN-VAULT-LEDGER", "ORN-VAULT-ICE", "ORN-VAULT"], hand: HAND_POOL.slice() }, BG_VARIANTS_NOTE),

  /* ---------- МЕТА ---------- */
  page(22, "p22", "КОЛЛЕКЦИЯ КАРТ", "МЕТА", "40 карт: 24 открыто, 16 закрыто", "Промпт: коллекция + c01…c40", [
    ["hand", "Колода коллекции", "HAND-CORE-30", "grid · contain · scale 1.00"],
    ["frame", "Рамка карты коллекции", "ORN-FRAME-SIGIL", "behind card · cover · scale 1.02"],
  ], { hand: HAND_POOL.slice(), frame: ["ORN-FRAME-SIGIL", "ORN-FRAME-ARC", "ORN-FRAME-SIGIL", "ORN-FRAME-ARC"] }, BG_VARIANTS_NOTE),
  page(23, "p23", "КАРТА РАЗБОРА", "МЕТА", "деталь карты c03 · уровень 2", "Промпт: skill card detail + c-семантика", [
    ["hero", "Как сигнал выглядит на графике", "VIS-VOLUME-BARS", "content · cover · scale 1.00"],
    ["hand", "Сама карта крупно", "HAND-CORE-30", "hero row · contain · scale 1.00"],
  ], { hero: ["VIS-VOLUME-BARS", "VIS-VOLUME-STAIR", "VIS-CANDLE-ANATOMY", "VIS-CANDLE-DUEL"], hand: [HAND_POOL[0], HAND_POOL[2], HAND_POOL[1], HAND_POOL[3]] }, BG_VARIANTS_NOTE),
  page(24, "p24", "РИТУАЛ (СЕРИЯ ДНЕЙ)", "МЕТА", "серия 6 дней · следующая награда не получена", "Промпт: streak/ритуал", [
    ["ornament", "Цепь ритуала", "ORN-CHAIN", "header · contain · scale 0.95"],
    ["cue", "Отметка сегодняшнего дня", "CUE-LEVEL-DASH", "overlay · scale 1.00"],
  ], { ornament: ["ORN-CHAIN", "ORN-CHAIN-HEX", "ORN-CHAIN", "ORN-CHAIN-HEX"], cue: CUE_POOL.slice(0, 4) }, BG_VARIANTS_NOTE),
  page(25, "p25", "ТУРНИРЫ", "МЕТА", "сезон идёт · 23:14:07 до конца", "TOURNAMENT + style-tone.txt", [
    ["ornament", "Кубок сезона", "ORN-CUP", "header · contain · scale 0.96"],
    ["cue", "Отметка LIVE", "CUE-WHALE-BAND", "badge overlay · scale 1.00"],
  ], { ornament: ["ORN-CUP", "ORN-CUP-BANNER", "ORN-CUP", "ORN-CUP-BANNER"], cue: CUE_POOL.slice(0, 4) }, BG_VARIANTS_NOTE),
  page(26, "p26", "ДУЭЛЬ 1 НА 1", "МЕТА", "вызов не отправлен", "TOURNAMENT.duel", [
    ["ornament", "Знак дуэли — скрещённые свечи", "ORN-BLADES", "header · contain · scale 0.96"],
    ["cue", "Фокус на вызове", "CUE-TARGET-RING", "overlay · scale 1.00"],
  ], { ornament: ["ORN-BLADES", "ORN-BLADES-CROSS", "ORN-BLADES", "ORN-BLADES-CROSS"], cue: CUE_POOL.slice(0, 4) }, BG_VARIANTS_NOTE),
  page(27, "p27", "ЛИДЕРБОРД СЕЗОНА", "МЕТА", "ты на 45 месте · топ 10%", "LEADERBOARD", [
    ["ornament", "Подиум сезона", "ORN-PODIUM", "header · contain · scale 0.94"],
  ], { ornament: ["ORN-PODIUM", "ORN-PODIUM-RING", "ORN-PODIUM", "ORN-PODIUM-RING"] }, BG_VARIANTS_NOTE),
  page(28, "p28", "АКАДЕМИЯ", "МЕТА", "6 уроков · 3 пройдено", "LESSONS", [
    ["ornament", "Архив уроков", "ORN-ARCHIVE", "header · contain · scale 0.94"],
    ["hero", "Обложка урока", "VIS-TREND-LADDER", "card art · cover · scale 1.00"],
  ], { ornament: ["ORN-ARCHIVE", "ORN-ARCHIVE-COVERS", "ORN-ARCHIVE", "ORN-ARCHIVE-COVERS"], hero: ["VIS-TREND-LADDER", "VIS-CANDLE-ANATOMY", "VIS-VOLUME-BARS", "VIS-TF-STACK"] }, BG_VARIANTS_NOTE),
  page(29, "p29", "УРОК АКАДЕМИИ", "МЕТА", "урок L03 открыт · квиз не сдан", "LESSONS[2]", [
    ["hero", "Визуал урока", "VIS-VOLUME-BARS", "content · cover · scale 1.00"],
    ["ornament", "Доска и мел", "ORN-CHALK", "side · contain · scale 0.9"],
  ], { hero: ["VIS-VOLUME-BARS", "VIS-VOLUME-STAIR", "VIS-SEAL-PRESS", "VIS-SEAL-OATH"], ornament: ["ORN-CHALK", "ORN-CHALK-PROJ", "ORN-CHALK", "ORN-CHALK-PROJ"] }, BG_VARIANTS_NOTE),
  page(30, "p30", "ПРОФИЛЬ", "МЕТА", "ранг АНАЛИТИК III · 24 раунда", "PROFILE", [
    ["ornament", "Радар навыков", "ORN-RADAR", "hero · contain · scale 1.00"],
  ], { ornament: ["ORN-RADAR", "ORN-RADAR-WEB", "ORN-RADAR", "ORN-RADAR-WEB"] }, BG_VARIANTS_NOTE),
  page(31, "p31", "НАСТРОЙКИ", "МЕТА", "motion preset выбран · reduce motion выключен", "Промпт: motion preset / reduсed motion", [
    ["emblem", "Отметка темы интерфейса", "EMB-COMPACT", "header · contain · scale 0.92"],
  ], { emblem: ["EMB-COMPACT", "EMB-INVERSE", "EMB-FULL"] }, BG_VARIANTS_NOTE, true),
  page(32, "p32", "УВЕДОМЛЕНИЯ", "МЕТА", "непрочитанных: 3", "NOTIFICATIONS", [
    ["ornament", "Стопка сигналов", "ORN-BELLS", "header · contain · scale 0.94"],
  ], { ornament: ["ORN-BELLS", "ORN-BELLS-TAPE", "ORN-BELLS", "ORN-BELLS-TAPE"] }, BG_VARIANTS_NOTE),
  page(33, "p33", "ЕЩЁ · ДОКУМЕНТЫ АРЕНЫ", "МЕТА", "служебные разделы и provenance", "Промпт: additional references / provenance", [
    ["emblem", "Логотип проекта", "EMB-FULL", "header · contain · scale 0.9"],
  ], { emblem: ["EMB-FULL", "EMB-COMPACT", "EMB-INVERSE"] }, BG_VARIANTS_NOTE, true),

  /* ---------- ИТОГ ---------- */
  page(34, "p34", "ИТОГ СЕРИИ", "ИТОГ", "5 раундов закрыто · точность 62%", "SERIES_ROUNDS + PROFILE", [
    ["ornament", "Свиток отчёта", "ORN-SCROLL", "header · contain · scale 0.94"],
    ["chart", "Сводный график серии", "CHT-HOLLOW", "panel · cover · scale 1.00"],
  ], { ornament: ["ORN-SCROLL", "ORN-SCROLL-SEAL", "ORN-SCROLL", "ORN-SCROLL-SEAL"], chart: [CHART_POOL[1], CHART_POOL[0], CHART_POOL[2], CHART_POOL[3]] }, BG_VARIANTS_NOTE),
];

/* ============================== ASSET MATRIX ============================== */
export interface MatrixRow {
  page: string;
  variant: string;
  slot: string;
  assetId: string;
  source: SourceKind;
  placement: string;
  purpose: string;
  fallback: string;
  motion: MotionPresetId;
}

export const ASSET_MATRIX: MatrixRow[] = PAGES.flatMap((p) => {
  const rows: MatrixRow[] = [];
  p.variants.forEach((v) => {
    p.slots.forEach((s) => {
      const assetId = v.assign[s.slot] ?? s.fallback;
      rows.push({
        page: p.id,
        variant: v.label,
        slot: s.slot,
        assetId,
        source: ASSETS[assetId]?.source ?? "MISSING",
        placement: s.placement,
        purpose: s.purpose,
        fallback: s.fallback,
        motion: v.motion,
      });
    });
  });
  return rows;
});

export const THREE_VARIANT_PAGES = PAGES.filter((p) => p.variants.length === 3).map((p) => p.id);

/* =============================== STUDIO QA ================================ */
export const QA_VIEWPORTS = [
  { w: 390, h: 844, label: "390 × 844 — iPhone 14 (основной)", primary: true },
  { w: 360, h: 800, label: "360 × 800 — Android base", primary: true },
  { w: 412, h: 915, label: "412 × 915 — Pixel 7", primary: true },
  { w: 320, h: 568, label: "320 × 568 — самый узкий", primary: true },
  { w: 768, h: 1024, label: "768 × 1024 — планшет", primary: false },
  { w: 1280, h: 800, label: "1280 × 800 — ноутбук", primary: false },
  { w: 1440, h: 900, label: "1440 × 900 — десктоп", primary: false },
];

export const DEFAULT_OVERRIDE = {
  cropX: 50,
  cropY: 50,
  fit: "cover" as "cover" | "contain",
  scale: 1,
  x: 0,
  y: 0,
  opacity: 1,
  tint: 0,
  motion: "inherit" as "inherit" | MotionPresetId,
};

export type Override = typeof DEFAULT_OVERRIDE;
export const overrideKey = (page: string, variant: string, slot: string) => `${page}|${variant}|${slot}`;
