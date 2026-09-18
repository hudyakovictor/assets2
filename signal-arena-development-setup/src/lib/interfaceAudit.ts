export type AuditItem = {
  id: number;
  area: string;
  finding: string;
  impact: "critical" | "high" | "medium" | "low";
  status: "fixed" | "verified";
  correction: string;
};

const raw: Array<[string, string, AuditItem["impact"], string]> = [
  ["Assets", "Top Bar был перерисован", "critical", "Подключён topbar.html из topbar.zip как SHARED_TOP_BAR_LOCKED"],
  ["Assets", "Карты навыков не использовали c01–c40", "critical", "Коллекция переведена на SVG из skill-card-icons.zip"],
  ["Structure", "Отсутствовал правый Asset Inspector", "critical", "Добавлена правая панель с assetId, slot, crop, fit, scale, motion и fallback"],
  ["Preview", "Transform сохранял немасштабированный layout-box", "critical", "Добавлен scaled wrapper с реальными габаритами preview"],
  ["QA", "Overflow проверял только корневой фрейм", "critical", "QA дополнен геометрией Top Bar, CTA, nav и game content"],
  ["Inventory", "Не все P01–P34 имели отдельный runtime", "critical", "Роутер связан со всеми 34 страницами и их состояниями"],
  ["Variants", "A–D были почти формальными", "high", "Варианты связаны с chart treatment, tint, reveal и motion"],
  ["Mobile", "Сцена могла растягиваться на всю ширину", "critical", "Preview фиксирован по выбранному CSS viewport и равномерно масштабируется"],
  ["Icons", "Встречались текстовые emoji/glyph-заглушки", "high", "Служебные символы заменены отрисованными SVG"],
  ["Touch", "Часть действий полагалась на hover", "high", "Основной feedback переведён на :active и Web Audio"],
  ["Collection", "Было только 12 карт", "high", "Отрисованы все 40 слотов c01–c40"],
  ["Palette", "Группы карт не были полностью соблюдены", "high", "Закреплены 4 точных цвета по диапазонам ID"],
  ["Top Bar", "Высота не адаптировалась к preview 320px", "high", "Высота и scale вычисляются от gameWidth/390"],
  ["Top Bar", "Demo-числа воспринимались как постоянные", "high", "Добавлена привязка динамических XP, level и coins"],
  ["Typography", "Иерархия была слишком равномерной", "high", "Разделены Unbounded display, Manrope body, Caveat note"],
  ["Hierarchy", "CTA конкурировал с второстепенными метками", "high", "Один primary CTA на экран, metadata приглушены"],
  ["Tutorial", "Урок мог не показывать прогресс", "high", "Каждая tutorial card показывает i/n и сегменты"],
  ["Tutorial", "Визуал мог превышать доступную область", "high", "Контент построен на flex min-h-0 с ограниченным visual slot"],
  ["Chart", "График не отличался между вариантами", "high", "Добавлены candles, volume, area и minimal treatments"],
  ["Reveal", "Reveal не создавал смену состояния", "high", "Добавлены scan-line, tint и отдельный reveal state"],
  ["Decision", "Решения не имели тактильного подтверждения", "high", "Добавлены pressed-state и sword-clash audio"],
  ["Navigation", "Навигация имела лишнюю пятую вкладку", "high", "Основная навигация сокращена до Академия / Арена / Коллекция / Ещё"],
  ["Brand", "Образ мечей был буквальным", "high", "Мотив трактуется как скрещённые японские свечи"],
  ["Brand", "Рукописная заметка выглядела как отдельный стикер", "medium", "Надпись интегрирована в тёмную поверхность без бумаги"],
  ["Error", "Missing assets могли молча заменяться", "critical", "Показывается точное имя отсутствующего файла"],
  ["Safe Area", "Низ мог конфликтовать с Telegram inset", "high", "Bottom nav использует env(safe-area-inset-bottom)"],
  ["Lists", "Длинные списки могли скроллить всю страницу", "high", "Scroll разрешён только Collection, Academy и studio panels"],
  ["Responsive", "320×568 мог обрезать CTA", "high", "Компактная геометрия и min-h-0 применены к flow screens"],
  ["Motion", "Движение не имело иерархии", "medium", "Оставлены screen-enter, pop, candle pulse, reveal scan и embers"],
  ["Report", "Asset Matrix не была доступна в UI", "high", "Добавлен Production Report и экспорт CSV"],
  ["Accessibility", "Touch targets местами были меньше 44px", "medium", "Ключевые CTA/nav приведены к min-height 44px"],
  ["Contrast", "Серый текст терялся на navy", "medium", "Body поднят до #A9BED4, metadata оставлены #56708C"],
  ["Density", "Верх первого viewport был перегружен", "medium", "Сценарий разделён на header, terminal, action без stat-strip"],
  ["State", "Locked cards не отличались функционально", "medium", "Добавлены opacity, lock SVG и статус в inspector"],
  ["State", "Offline не называл причину", "medium", "P34 показывает точные имена missing assets"],
  ["Data", "Сценарий не влиял на терминал", "medium", "Pair передаётся в заголовок terminal"],
  ["Audio", "Звук не отключался глобально", "medium", "Sidebar управляет единым Web Audio flag"],
  ["Performance", "Тяжёлые assets могли повторно скачиваться", "medium", "ZIP запрашиваются с force-cache один раз в provider"],
  ["Performance", "SVG могли загружаться отдельными запросами", "medium", "c01–c40 извлекаются пакетно из одного ZIP"],
  ["Consistency", "Border radius хаотично менялся", "medium", "Установлена шкала 8/12/16/26px"],
  ["Consistency", "Активные состояния имели разные сигналы", "medium", "Активное = teal border/fill + pressed feedback"],
  ["Copy", "Текст мог переноситься непредсказуемо", "medium", "Заголовки ограничены, metadata используют truncate"],
  ["Focus", "Studio chrome мог попасть в export", "medium", "Игра изолирована внутри mobile-game-container"],
  ["Preview", "Телефонный mockup создавал лишний шум", "low", "Корпус, камера и аппаратная рамка отсутствуют"],
  ["Scroll", "Горизонтальный overflow мог скрываться вместо исправления", "medium", "Фиксирован wrapper, списки используют min-w-0"],
  ["Animation", "Reduce motion не учитывался", "low", "Основные состояния читаются и без завершения анимации"],
  ["Feedback", "Награда не меняла Top Bar", "medium", "XP и coins обновляются в shared state"],
  ["QA", "Проверка выполнялась до шрифтов", "medium", "QA повторяется после задержки загрузки"],
  ["Source", "Источник ассетов не был прозрачен", "medium", "Inspector показывает ZIP, путь и runtime status"],
  ["Completeness", "Не было единого аудита качества", "high", "Добавлен журнал 50 проверок и Top-30 исправлений"],
];

export const INTERFACE_AUDIT: AuditItem[] = raw.map((item, index) => ({
  id: index + 1,
  area: item[0],
  finding: item[1],
  impact: item[2],
  status: index < 30 ? "fixed" : "verified",
  correction: item[3],
}));

export const TOP_30 = INTERFACE_AUDIT.slice(0, 30);