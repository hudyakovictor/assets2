/**
 * Asset registry — ONLY assets from github.com/hudyakovictor/assets (branch main).
 *
 * Repo tree (verified via fetch):
 *   assets.zip
 *   game.html                      ← MVP storyboard (source of truth)
 *   game2.pdf
 *   skill-card-icons.zip           ← c01–c40.svg (inside archive)
 *   topbar.zip                     ← topbar.html + lightning/star/coin/bell/gear.svg (inside archive)
 *   рототипы_экранов__casual_2D_(раскадровка__все_страницы).pdf
 *
 * The archives cannot be extracted in this build environment, so the expected
 * extracted files are referenced by their exact names under /public/assets/…
 * At runtime every file is probed; anything that fails to load is reported as
 * MISSING_ASSET with its exact filename. Nothing is replaced by emoji or by
 * assets from other libraries.
 */

export const REPO = "https://github.com/hudyakovictor/assets/tree/main";

export type AssetSource = "topbar.zip" | "skill-card-icons.zip" | "assets.zip" | "css-treatment";

export interface AssetRef {
  id: string;
  file: string; // exact filename inside the archive
  source: AssetSource;
  url: string; // expected extracted location served by the app
  kind: "svg" | "html";
}

export const TOPBAR_ASSETS: AssetRef[] = [
  { id: "topbar.html", file: "topbar.html", source: "topbar.zip", url: "/assets/topbar/topbar.html", kind: "html" },
  { id: "lightning.svg", file: "lightning.svg", source: "topbar.zip", url: "/assets/topbar/lightning.svg", kind: "svg" },
  { id: "star.svg", file: "star.svg", source: "topbar.zip", url: "/assets/topbar/star.svg", kind: "svg" },
  { id: "coin.svg", file: "coin.svg", source: "topbar.zip", url: "/assets/topbar/coin.svg", kind: "svg" },
  { id: "bell.svg", file: "bell.svg", source: "topbar.zip", url: "/assets/topbar/bell.svg", kind: "svg" },
  { id: "gear.svg", file: "gear.svg", source: "topbar.zip", url: "/assets/topbar/gear.svg", kind: "svg" },
];

export const SKILL_CARD_IDS = Array.from({ length: 40 }, (_, i) => `c${String(i + 1).padStart(2, "0")}`);

export const SKILL_CARD_ASSETS: AssetRef[] = SKILL_CARD_IDS.map((id) => ({
  id: `${id}.svg`,
  file: `${id}.svg`,
  source: "skill-card-icons.zip",
  url: `/assets/skill-cards/${id}.svg`,
  kind: "svg",
}));

export const ALL_REPO_ASSETS = [...TOPBAR_ASSETS, ...SKILL_CARD_ASSETS];

export type CardGroup = "green" | "yellow" | "blue" | "red";

export function cardGroup(id: string): CardGroup {
  const n = Number(id.replace("c", ""));
  if (n <= 15) return "green";
  if (n <= 24) return "yellow";
  if (n <= 33) return "blue";
  return "red";
}

export const CARD_COLORS: Record<CardGroup, string> = {
  green: "#2E7F5C",
  yellow: "#D0B24A",
  blue: "#4C6180",
  red: "#C56861",
};

export const CARD_GROUP_LABEL: Record<CardGroup, string> = {
  green: "Структура",
  yellow: "Импульс",
  blue: "Контекст",
  red: "Риск",
};

/** Skill card names (MVP deck — 40 приёмов). */
export const CARD_NAMES: string[] = [
  "Уровень поддержки", "Уровень сопротивления", "Ретест", "Ложный пробой", "Диапазон",
  "Тренд-линия", "Старший таймфрейм", "Свинг-хай", "Свинг-лоу", "Пробой структуры",
  "Смена характера", "Зона спроса", "Зона предложения", "Круглое число", "Гэп",
  "Импульс объёма", "Кульминация", "Затухание", "Дивергенция", "Поглощение",
  "Пин-бар", "Внутренний бар", "Ускорение", "Вертикальный выброс",
  "Новостной фон", "Фандинг", "Открытый интерес", "Ликвидации", "Корреляция с BTC",
  "Сессия", "Выходные", "Доминация", "Стейблкоин-приток",
  "Стоп за уровнем", "Размер позиции", "Частичная фиксация", "Пропуск сделки",
  "Серия убытков", "Переворот", "Максимальная просадка",
];

/* ---------------- runtime probe ---------------- */

export type AssetStatus = "pending" | "ok" | "missing";

export function probeAsset(ref: AssetRef): Promise<AssetStatus> {
  if (ref.kind === "svg") {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve("ok");
      img.onerror = () => resolve("missing");
      img.src = ref.url;
    });
  }
  return fetch(ref.url, { cache: "no-store" })
    .then(async (r) => {
      if (!r.ok) return "missing" as const;
      const ct = r.headers.get("content-type") || "";
      const txt = await r.text();
      // Vite SPA fallback returns index.html — detect it.
      if (ct.includes("html") && txt.includes('id="root"')) return "missing" as const;
      return "ok" as const;
    })
    .catch(() => "missing" as const);
}
