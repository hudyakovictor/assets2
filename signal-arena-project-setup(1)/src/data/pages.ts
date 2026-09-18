export type ScreenType =
  | "f01-welcome" | "f02-recognize" | "f03-fact" | "f04-decision" | "f05-why" | "f06-sealed"
  | "f07-reveal" | "f08-score" | "f09-insight" | "f10-run2" | "f11-score2" | "f12-conflict"
  | "f13-lesson" | "f14-cards" | "f15-run4"
  | "A-academy" | "B-lesson" | "C-deck" | "D-assembly" | "E-arena" | "F-run" | "G-source"
  | "H-decision" | "I-reveal" | "J-score" | "K-breakdown" | "L-profile" | "M-notify" | "N-settings"
  | "O-noattempts" | "P-unknown";

export interface VariantTreatment {
  id: string;
  label: string;
  layoutMode: "classic" | "split" | "cards-focus" | "tactical-grid";
  accent: string;
  motion: "rise" | "fade" | "slide" | "pop";
  chart: "teal" | "mono" | "gold" | "coral";
  reveal: "scrub" | "dissolve" | "wipe" | "bloom";
  tint: number;
  opacity: number;
  crop: string;
  fit: "cover" | "contain";
  scale: number;
}

export interface PageDef {
  id: string;
  frame: string; // "Кадр 1" | "Экран A"
  title: string;
  section: string;
  state: string;
  source: string;
  screen: ScreenType;
  hasTopBar: boolean;
  hasNav: boolean;
  props?: Record<string, unknown>;
  variants: VariantTreatment[];
}

const ACC = ["#26e6c8", "#ffbe3b", "#3fe0a5", "#4d8df7"];
const LABELS = [
  "Версия A · Стандартный HUD",
  "Версия B · Сплит-терминал",
  "Версия C · Фокус на картах",
  "Версия D · Тактический грид",
];
const LAYOUTS = ["classic", "split", "cards-focus", "tactical-grid"] as const;
const MOT = ["rise", "fade", "slide", "pop"] as const;
const CH = ["teal", "mono", "gold", "coral"] as const;
const RV = ["scrub", "dissolve", "wipe", "bloom"] as const;

function mk(pid: string, n = 4): VariantTreatment[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `${pid}-${"ABCD"[i]}`,
    label: LABELS[i],
    layoutMode: LAYOUTS[i % LAYOUTS.length],
    accent: ACC[i],
    motion: MOT[i],
    chart: CH[i],
    reveal: RV[i],
    tint: [0, 0.1, 0.16, 0.22][i],
    opacity: [1, 0.96, 0.92, 0.9][i],
    crop: ["center", "top", "bottom", "focus"][i],
    fit: "cover",
    scale: [1, 1.04, 1.08, 1.06][i],
  }));
}

interface Raw { id: string; frame: string; title: string; section: string; state: string; screen: ScreenType; topbar?: boolean; nav?: boolean; variants?: number; bg?: string; props?: Record<string, unknown> }

const F = "game2.pdf · §5 кадры 1–15";
const S = "game2.pdf · §6 экраны A–P";

const RAW: Raw[] = [
  { id: "P01", frame: "Кадр 1", title: "Первый экран", section: "Первое открытие · Заход 1", state: "одна фраза, одна кнопка", screen: "f01-welcome", topbar: false, variants: 3 },
  { id: "P02", frame: "Кадр 2", title: "Ткните, где цена падала", section: "Первое открытие · Заход 1", state: "узнавание · промах подсвечивает", screen: "f02-recognize" },
  { id: "P03", frame: "Кадр 3", title: "Один факт", section: "Первое открытие · Заход 1", state: "одна строка", screen: "f03-fact" },
  { id: "P04", frame: "Кадр 4", title: "Решение из двух", section: "Первое открытие · Заход 1", state: "без третьего, без цифр", screen: "f04-decision" },
  { id: "P05", frame: "Кадр 5", title: "На что вы опирались", section: "Первое открытие · Заход 1", state: "три ответа · «просто кажется»", screen: "f05-why" },
  { id: "P06", frame: "Кадр 6", title: "Решение принято", section: "Первое открытие · Заход 1", state: "изменить нельзя", screen: "f06-sealed" },
  { id: "P07", frame: "Кадр 7", title: "Закрытая зона открывается", section: "Первое открытие · Заход 1", state: "достройка графика", screen: "f07-reveal" },
  { id: "P08", frame: "Кадр 8", title: "Первая оценка", section: "Первое открытие · Заход 1", state: "две строки · результат случайный", screen: "f08-score" },
  { id: "P09", frame: "Кадр 9", title: "Угадали, но не объяснили", section: "Первое открытие · Заход 1", state: "главная мысль", screen: "f09-insight" },
  { id: "P10", frame: "Кадр 10", title: "Заход 2 · обоснование", section: "Первое открытие · Заход 2", state: "+ «пойму, что ошибся, если…»", screen: "f10-run2" },
  { id: "P11", frame: "Кадр 11", title: "Оценка захода 2", section: "Первое открытие · Заход 2", state: "не угадал · высокая оценка", screen: "f11-score2" },
  { id: "P12", frame: "Кадр 12", title: "Заход 3 · факты спорят", section: "Первое открытие · Заход 3", state: "«показать, как это разбирают»", screen: "f12-conflict" },
  { id: "P13", frame: "Кадр 13", title: "Глава 1 · урок на минуту", section: "Первое открытие · Академия", state: "одна мысль, картинка", screen: "f13-lesson" },
  { id: "P14", frame: "Кадр 14", title: "Четыре карты, один слот", section: "Первое открытие · Академия", state: "выдача карт", screen: "f14-cards" },
  { id: "P15", frame: "Кадр 15", title: "Заход 4 · первая карта", section: "Первое открытие · Заход 4", state: "без подсказок", screen: "f15-run4" },

  { id: "P16", frame: "Экран A", title: "Академия · дерево тем", section: "Академия", state: "закрыта / доступна / пройдена", screen: "A-academy", nav: true },
  { id: "P17", frame: "Экран B", title: "Урок", section: "Академия", state: "середина главы", screen: "B-lesson", props: { last: false } },
  { id: "P18", frame: "Экран C", title: "Мои приёмы", section: "Карты", state: "новая карта / закрытая", screen: "C-deck", nav: true },
  { id: "P19", frame: "Экран D", title: "Сборка перед заходом", section: "Арена", state: "один слот", screen: "D-assembly", props: { slots: 1 } },
  { id: "P20", frame: "Экран E", title: "Арена · главный", section: "Арена", state: "есть попытки", screen: "E-arena", nav: true },
  { id: "P21", frame: "Экран F", title: "Заход", section: "Арена", state: "факты не открыты", screen: "F-run", props: { opened: 0 } },
  { id: "P22", frame: "Экран G", title: "Лист источника", section: "Арена", state: "открыт", screen: "G-source" },
  { id: "P23", frame: "Экран H", title: "Решение", section: "Арена", state: "не заполнено → готово", screen: "H-decision" },
  { id: "P24", frame: "Экран I", title: "Раскрытие", section: "Арена", state: "достройка → к оценке", screen: "I-reveal" },
  { id: "P25", frame: "Экран J", title: "Оценка", section: "Арена", state: "короткая из 2 строк", screen: "J-score", props: { full: false } },
  { id: "P26", frame: "Экран K", title: "Разбор", section: "Арена", state: "что учтено, что нет", screen: "K-breakdown" },
  { id: "P27", frame: "Экран L", title: "Профиль", section: "Профиль", state: "есть история", screen: "L-profile", nav: true },
  { id: "P28", frame: "Экран M", title: "Уведомления", section: "Служебные", state: "есть новые", screen: "M-notify", nav: true },
  { id: "P29", frame: "Экран N", title: "Настройки", section: "Служебные", state: "термины выкл", screen: "N-settings", nav: true },
  { id: "P30", frame: "Экран O", title: "Попытки закончились", section: "Служебные", state: "ожидание", screen: "O-noattempts", nav: true },
  { id: "P31", frame: "Экран P", title: "Незнакомая тема", section: "Служебные", state: "во время захода", screen: "P-unknown" },

  // Documented states from the §6 table (not new screens)
  { id: "P32", frame: "Экран F·2", title: "Заход · часть фактов открыта", section: "Состояния из таблицы", state: "часть открыта", screen: "F-run", props: { opened: 1 } },
  { id: "P33", frame: "Экран J·2", title: "Оценка · полная из 6 строк", section: "Состояния из таблицы", state: "полная из 6", screen: "J-score", props: { full: true } },
  { id: "P34", frame: "Экран D·2", title: "Сборка · несколько слотов", section: "Состояния из таблицы", state: "несколько слотов", screen: "D-assembly", props: { slots: 3 }, variants: 3 },
];

export const PAGES: PageDef[] = RAW.map((r) => ({
  id: r.id,
  frame: r.frame,
  title: r.title,
  section: r.section,
  state: r.state,
  source: r.id <= "P15" ? F : S,
  screen: r.screen,
  hasTopBar: r.topbar ?? true,
  hasNav: r.nav ?? false,
  props: r.props,
  variants: mk(r.id, r.variants ?? 4),
}));

export const SECTIONS = Array.from(new Set(PAGES.map((p) => p.section)));

export const PAGE_COUNT_NOTE =
  "В источнике найдено 31 страница: кадры 1–15 и экраны A–P. P32–P34 — задокументированные состояния из таблицы §6 (F·часть открыта, J·полная, D·несколько слотов), новых экранов не добавлено.";
