/* Evidence-based inventory. Exact PDF wording remains unverified because the
 * available reader exposes the PDFs as binary streams. */
export type PageId = `P${string}`;
export type VariantId = "A" | "B" | "C" | "D";
export type PageSource = "game.html" | "FLOW_SPEC" | "STATE_REQUIREMENT";
export type PageSection = "ONBOARDING" | "ARENA" | "ACADEMY" | "COLLECTION" | "PROFILE" | "SERVICE";
export type PageState = "default" | "loading" | "empty" | "locked" | "error" | "no-attempts" | "sealed" | "revealing";
export type AssetSlotId =
  | "chart-default" | "chart-reveal" | "chart-dense" | "chart-minimal"
  | "bg-arena" | "bg-deck" | "bg-cave" | "bg-volatility"
  | "sticker-warning" | "sticker-rule" | "sticker-pact" | "sticker-humor"
  | "c01" | "c02" | "c03" | "c04" | "c05" | "c06" | "c07" | "c08" | "c09" | "c10"
  | "c11" | "c12" | "c13" | "c14" | "c15" | "c16" | "c17" | "c18" | "c19" | "c20"
  | "c21" | "c22" | "c23" | "c24" | "c25" | "c26" | "c27" | "c28" | "c29" | "c30"
  | "c31" | "c32" | "c33" | "c34" | "c35" | "c36" | "c37" | "c38" | "c39" | "c40";

export type PageMeta = {
  id: PageId; no: string; title: string; chapter: PageSection; source: PageSource;
  purpose: string; state: PageState; cta: string; headline: string;
  slots: { chart?: AssetSlotId; primary?: AssetSlotId; secondary?: AssetSlotId; tertiary?: AssetSlotId; quaternary?: AssetSlotId; sticker?: AssetSlotId };
};

const p = (id: PageId, title: string, chapter: PageSection, source: PageSource, purpose: string, state: PageState, cta: string, headline: string, slots: PageMeta["slots"] = {}): PageMeta =>
  ({ id, no: id.slice(1), title, chapter, source, purpose, state, cta, headline, slots });

export const PAGES: PageMeta[] = [
  p("P01", "Первое открытие", "ONBOARDING", "game.html", "Начать первый заход на Арену", "default", "НАЧАТЬ", "Рынок не обещает прибыль. Он проверяет решения.", { sticker: "sticker-warning", primary: "c01" }),
  p("P02", "Вводная", "ONBOARDING", "FLOW_SPEC", "Объяснить исторический сценарий и скрытое будущее", "default", "ПОНЯТНО", "Перед тобой исторический участок. Будущее закрыто до решения.", { chart: "chart-minimal", primary: "c25" }),
  p("P03", "Арена: заход 1", "ARENA", "game.html", "Научить читать видимый участок свечей", "default", "ВЫБРАТЬ ЗОНУ", "Найди падение на видимом графике.", { chart: "chart-default", primary: "c01" }),
  p("P04", "Обратная связь 1", "ARENA", "FLOW_SPEC", "Объяснить первый выбор", "default", "ПРОДОЛЖИТЬ", "Цена падала. Это факт, не прогноз.", { chart: "chart-default", primary: "c01" }),
  p("P05", "Арена: заход 2", "ARENA", "game.html", "Добавить выбор решения", "default", "ВЫБРАТЬ РЕШЕНИЕ", "WAIT и NO TRADE равноправны входу.", { chart: "chart-default", primary: "c16", secondary: "c17", tertiary: "c24" }),
  p("P06", "Обратная связь 2", "ARENA", "FLOW_SPEC", "Объяснить влияние подтверждения", "default", "ПРОДОЛЖИТЬ", "Решение без причины считается догадкой.", { primary: "c25" }),
  p("P07", "Арена: заход 3", "ARENA", "game.html", "Добавить обоснование и инвалидацию", "default", "СОБРАТЬ ПЛАН", "Выбери факт и условие отмены идеи.", { chart: "chart-default", primary: "c25", secondary: "c19" }),
  p("P08", "Дефицит навыка", "ARENA", "game.html", "Сообщить о недостающем приёме и разблокировке Академии", "locked", "ПРОДОЛЖИТЬ", "Не хватает подтверждения объёмом. Академия теперь доступна.", { primary: "c03" }),
  p("P09", "Сценарий: факты", "ARENA", "FLOW_SPEC", "Показать только доступные до решения факты", "default", "К РЕШЕНИЮ", "Факты опубликованы. Будущее закрыто.", { chart: "chart-default", primary: "c08" }),
  p("P10", "Выбор решения", "ARENA", "FLOW_SPEC", "Выбрать ENTER, WAIT или NO TRADE", "default", "ПОДТВЕРДИТЬ", "Рынок ждёт решение, не предсказание.", { chart: "chart-default", primary: "c16", secondary: "c17", tertiary: "c24" }),
  p("P11", "Обоснование", "ARENA", "FLOW_SPEC", "Выбрать наблюдаемый факт", "default", "ПРИНЯТЬ ФАКТЫ", "Укажи, на чём держится решение.", { primary: "c25", secondary: "c03" }),
  p("P12", "Инвалидация", "ARENA", "FLOW_SPEC", "Задать условие отмены идеи", "default", "ЗАПИСАТЬ УСЛОВИЕ", "Хорошая идея знает, где она перестаёт работать.", { chart: "chart-default", primary: "c19", secondary: "c20" }),
  p("P13", "Seal", "ARENA", "FLOW_SPEC", "Необратимо зафиксировать план", "sealed", "SEAL РЕШЕНИЕ", "После Seal решение нельзя изменить.", { primary: "c39", secondary: "c40" }),
  p("P14", "Fast-forward", "ARENA", "FLOW_SPEC", "Дорисовать историческое продолжение", "revealing", "СМОТРЕТЬ", "История продолжает график. Данные те же, доступ изменился.", { chart: "chart-reveal" }),
  p("P15", "Ключевое событие", "ARENA", "FLOW_SPEC", "Показать событие, изменившее сценарий", "default", "К ОЦЕНКЕ", "Объём подтвердил движение после ретеста.", { chart: "chart-reveal", primary: "c03" }),
  p("P16", "Score: процесс", "ARENA", "FLOW_SPEC", "Оценить факты, риск и дисциплину", "default", "РЕЗУЛЬТАТ РЫНКА", "Сначала оценивается процесс. Прибыль не исправляет плохой план.", { primary: "c31" }),
  p("P17", "Score: исход", "ARENA", "FLOW_SPEC", "Отделить исход от качества решения", "default", "РАЗБОР", "Исход показан отдельно от качества процесса.", { primary: "c22" }),
  p("P18", "Debrief", "ARENA", "game.html", "Объяснить причинную связь и ошибку", "default", "В АКАДЕМИЮ", "Что сработало, что было шумом, что повторить.", { primary: "c03", secondary: "c26" }),
  p("P19", "Академия", "ACADEMY", "game.html", "Показать дерево тем после дефицита навыка", "default", "ОТКРЫТЬ ТЕМУ", "Учись тому, чего не хватило в решении.", { primary: "c03" }),
  p("P20", "Урок: объём", "ACADEMY", "game.html", "Объяснить подтверждение объёмом", "default", "ПРОВЕРИТЬ СЕБЯ", "Рост цены без объёма может быть пустым обещанием.", { chart: "chart-minimal", primary: "c03" }),
  p("P21", "Skill Card получена", "ACADEMY", "game.html", "Выдать карту освоенного навыка", "default", "ДОБАВИТЬ В КОЛОДУ", "Подтверждение объёмом разблокировано.", { primary: "c03" }),
  p("P22", "Колода навыков", "COLLECTION", "game.html", "Управлять доступными картами", "default", "В АРЕНУ", "Навык теперь доступен в сценарии.", { primary: "c03", secondary: "c01", tertiary: "c25", quaternary: "c34" }),
  p("P23", "Полная Арена: факты", "ARENA", "game.html", "Повторить сценарий с открытой картой", "default", "К РЕШЕНИЮ", "Новый сценарий. Будущее закрыто.", { chart: "chart-default", primary: "c03" }),
  p("P24", "Полная Арена: решение", "ARENA", "game.html", "Применить карту и выбрать действие", "default", "ПРОДОЛЖИТЬ", "Выбери решение и доказательство.", { chart: "chart-default", primary: "c16", secondary: "c17", tertiary: "c24" }),
  p("P25", "Полная Арена: Seal", "ARENA", "game.html", "Зафиксировать полный план", "sealed", "SEAL", "Решение, факты и инвалидация готовы.", { primary: "c39" }),
  p("P26", "Полная Арена: Reveal", "ARENA", "game.html", "Показать продолжение и оценку", "revealing", "ЗАВЕРШИТЬ", "История раскрыта. Рынок не обязан соглашаться.", { chart: "chart-reveal" }),
  p("P27", "Профиль", "PROFILE", "game.html", "Показать учебный прогресс", "default", "ПРОДОЛЖИТЬ", "Прогресс измеряет дисциплину и навыки.", { primary: "c40" }),
  p("P28", "Уведомления", "SERVICE", "game.html", "Показать уведомления", "default", "ГОТОВО", "Уведомления сообщают о занятиях, не о прибыли.", { primary: "c08" }),
  p("P29", "Настройки", "SERVICE", "game.html", "Настроить звук, haptics и доступность", "default", "СОХРАНИТЬ", "Настройки не меняют исторические данные.", { primary: "c40" }),
  p("P30", "Loading", "SERVICE", "STATE_REQUIREMENT", "Загрузить исторический сценарий", "loading", "НЕТ", "Загрузка исторических данных…", { chart: "chart-minimal" }),
  p("P31", "Empty", "SERVICE", "STATE_REQUIREMENT", "Объяснить отсутствие контента", "empty", "ОБНОВИТЬ", "Новых сценариев пока нет.", { primary: "c32" }),
  p("P32", "Locked", "SERVICE", "STATE_REQUIREMENT", "Объяснить условие разблокировки", "locked", "В АКАДЕМИЮ", "Сценарий закрыт до освоения нужной карты.", { primary: "c03" }),
  p("P33", "Error", "SERVICE", "STATE_REQUIREMENT", "Безопасно повторить загрузку", "error", "ПОВТОРИТЬ", "Данные не загрузились. Решение не потеряно.", { primary: "c15" }),
  p("P34", "Нет попыток", "SERVICE", "STATE_REQUIREMENT", "Заблокировать новый заход без gambling-подачи", "no-attempts", "В АКАДЕМИЮ", "Попытки закончились. Обучение доступно.", { primary: "c24" }),
];

export const PAGE_MAP = Object.fromEntries(PAGES.map((page) => [page.id, page])) as Record<string, PageMeta>;

export type VariantMeta = { variant: VariantId; bg: AssetSlotId; chart: AssetSlotId; motion: "expo" | "quint" | "back" | "circ"; tint: number; primary: AssetSlotId; secondary: AssetSlotId; tertiary: AssetSlotId; quaternary: AssetSlotId; sticker: AssetSlotId; fit: "cover" | "contain"; scale: number; opacity: number };
const variants: Record<VariantId, Pick<VariantMeta, "bg" | "chart" | "motion" | "tint" | "sticker" | "fit" | "scale" | "opacity">> = {
  A: { bg: "bg-arena", chart: "chart-default", motion: "expo", tint: .85, sticker: "sticker-warning", fit: "cover", scale: .94, opacity: .96 },
  B: { bg: "bg-deck", chart: "chart-reveal", motion: "quint", tint: .9, sticker: "sticker-rule", fit: "contain", scale: .98, opacity: .97 },
  C: { bg: "bg-cave", chart: "chart-dense", motion: "back", tint: .95, sticker: "sticker-pact", fit: "cover", scale: 1.02, opacity: .98 },
  D: { bg: "bg-volatility", chart: "chart-minimal", motion: "circ", tint: 1, sticker: "sticker-humor", fit: "contain", scale: 1.06, opacity: .99 },
};
export function variantOf(page: PageMeta, variant: VariantId): VariantMeta {
  const base = variants[variant];
  return { variant, ...base, chart: page.slots.chart ?? base.chart, primary: page.slots.primary ?? "c01", secondary: page.slots.secondary ?? "c17", tertiary: page.slots.tertiary ?? "c25", quaternary: page.slots.quaternary ?? "c34", sticker: page.slots.sticker ?? base.sticker };
}