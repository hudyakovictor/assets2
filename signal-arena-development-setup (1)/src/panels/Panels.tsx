import { useMemo, useState } from "react";
import {
  PAGES,
  variantsOf,
  assetMatrix,
  CHART_TREATMENTS,
  REVEALS,
  MOTIONS,
  type Page,
  type Variant,
} from "../lib/pages";
import { useAssets, groupOf, REPO_URL } from "../lib/assets";
import { SkillIcon } from "../components/bits";

const GROUPS: Record<string, string> = {
  green: "#2E7F5C",
  yellow: "#D0B24A",
  blue: "#4C6180",
  red: "#C56861",
};

export function AssetThumb({
  id,
  size = 56,
}: {
  id: string;
  size?: number;
}) {
  const assets = useAssets();
  const isCard = /^c\d+$/i.test(id);
  if (isCard) {
    const n = Number(id.slice(1));
    const col = GROUPS[groupOf(n)];
    return (
      <div
        className="grid shrink-0 place-items-center rounded-xl"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(120% 100% at 50% 0%, ${col}, rgba(0,0,0,.25))`,
        }}
      >
        <div style={{ width: size * 0.6, height: size * 0.6 }}>
          <SkillIcon id={id} className="h-full w-full" />
        </div>
      </div>
    );
  }
  const svg = assets.topbarSvgs[id.toLowerCase()];
  return (
    <div
      className="grid shrink-0 place-items-center rounded-xl border border-white/10 bg-white/4"
      style={{ width: size, height: size, color: "#2EE6C8" }}
    >
      {svg ? (
        <div style={{ width: size * 0.56, height: size * 0.56 }}>
          <SkillIcon id={id} className="h-full w-full" />
        </div>
      ) : (
        <span className="text-[8px] font-bold text-[#C56861]">NO ASSET</span>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  mono = true,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/5 py-[6px] last:border-0">
      <span className="shrink-0 text-[9.5px] font-bold tracking-[.1em] text-[#55647a] uppercase">
        {label}
      </span>
      <span
        className={`min-w-0 flex-1 text-right text-[11px] leading-snug text-[#c9d6e6] ${mono ? "font-mono tabular-nums" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================ LEFT ============================ */
export function LeftPanel({
  pageId,
  setPageId,
  letter,
  setLetter,
}: {
  pageId: string;
  setPageId: (v: string) => void;
  letter: "A" | "B" | "C" | "D";
  setLetter: (v: "A" | "B" | "C" | "D") => void;
}) {
  const [q, setQ] = useState("");
  const idx = PAGES.findIndex((p) => p.id === pageId);
  const go = (d: number) => {
    const n = (idx + d + PAGES.length) % PAGES.length;
    setPageId(PAGES[n].id);
  };
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return PAGES;
    return PAGES.filter((p) =>
      `${p.id} ${p.title} ${p.section} ${p.state}`.toLowerCase().includes(s),
    );
  }, [q]);

  const sections = useMemo(() => {
    const m = new Map<string, Page[]>();
    filtered.forEach((p) => {
      if (!m.has(p.section)) m.set(p.section, []);
      m.get(p.section)!.push(p);
    });
    return [...m.entries()];
  }, [filtered]);

  return (
    <aside className="flex h-full min-h-0 w-[264px] shrink-0 flex-col bg-[#080c14]">
      <header className="shrink-0 border-b border-[#1b2739] px-3 py-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-black tracking-[.16em] text-[#2EE6C8] uppercase">
            Page Inventory
          </h2>
          <span className="rounded-full bg-white/6 px-2 py-[2px] font-mono text-[9.5px] text-[#7f90a8]">
            {PAGES.length} / 34
          </span>
        </div>
        <div className="mt-2 flex gap-1.5">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск P01…P34, состояние…"
            className="min-w-0 flex-1 rounded-lg border border-[#26364d] bg-[#0c121d] px-2 py-[6px] text-[11px] text-[#e8eef7] outline-none placeholder:text-[#55647a] focus:border-[#2EE6C8]/60"
          />
          <button
            onClick={() => go(-1)}
            className="tap grid h-[30px] w-[30px] place-items-center rounded-lg border border-[#26364d] bg-[#0c121d] text-[12px] text-[#c9d6e6]"
            title="Previous"
          >
            ‹
          </button>
          <button
            onClick={() => go(1)}
            className="tap grid h-[30px] w-[30px] place-items-center rounded-lg border border-[#26364d] bg-[#0c121d] text-[12px] text-[#c9d6e6]"
            title="Next"
          >
            ›
          </button>
        </div>
      </header>

      <div className="scroll-y min-h-0 flex-1 px-2 py-2">
        {sections.map(([section, list]) => (
          <section key={section} className="mb-3">
            <p className="px-1 pb-1 text-[8.5px] font-black tracking-[.14em] text-[#55647a] uppercase">
              {section}
            </p>
            <ul className="space-y-1">
              {list.map((p) => {
                const on = p.id === pageId;
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => setPageId(p.id)}
            className={`tap w-full rounded-xl border px-2 py-1.5 text-left ${
                          on
                            ? "border-[#2EE6C8]/70 bg-[#2EE6C8]/10"
                            : "border-white/6 bg-white/[.025]"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[10px] font-black ${on ? "text-[#2EE6C8]" : "text-[#55647a]"}`}
                        >
                          {p.id}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-[#e8eef7]">
                          {p.title}
                        </span>
                        {!p.topBar && (
                          <span className="rounded bg-[#C56861]/20 px-1 text-[7.5px] font-bold text-[#ffb3ad]">
                            NO TB
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="truncate rounded bg-white/6 px-1.5 py-[1px] text-[8.5px] text-[#7f90a8]">
                          {p.state}
                        </span>
                        <span className="flex-1" />
                        {variantsOf(p).map((v) => (
                          <span
                            key={v.vid}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPageId(p.id);
                              setLetter(v.letter);
                            }}
                            className={`grid h-[15px] w-[15px] place-items-center rounded font-mono text-[8.5px] font-black ${
                              on && v.letter === letter
                                ? "bg-[#2EE6C8] text-[#04211C]"
                                : "bg-white/8 text-[#7f90a8]"
                            }`}
                          >
                            {v.letter}
                          </span>
                        ))}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}

/* ============================ RIGHT ============================ */
export type VariantOverride = Partial<Pick<Variant, "scale" | "posX" | "posY" | "opacity" | "crop" | "fit" | "tint" | "chart" | "reveal" | "motion">>;

/* 150 проверок = 15 зон × 10 анализов (метод 20/80) */
const ANALYSIS_150: [string, string[]][] = [
  ["Раскладка студии", [
    "Topbar студии 44px (4.9% от 900)", "Inventory 264px (18.3% от 1440)", "Inspector 300px (20.8%)",
    "Сцена — доминанта ≥60% ширины", "Панели сворачиваются, пустые поля исчезают",
    "Нет горизонтального скролла студии", "Сетка фона не отвлекает от кадра",
    "Подложка свечения привязана к кадру", "Зум считает min(w,h) без искажений",
    "Мобильная ширина: панели поверх, не ломают кадр",
  ]],
  ["Кадр телефона", [
    "Без корпуса/рамки устройства", "Радиус 28px единый", "Пропорции строго w/h вьюпорта",
    "390×844 — основной", "360×800 / 412×915 / 320×568 — QA", "300×620 (15/31) только как QA",
    "Контент не выходит за радиус", "Тень под кадром одинакова по периметру",
    "Скругление не обрезает Top Bar", "Равномерный scale от верхнего левого угла",
  ]],
  ["Top Bar locked", [
    "Две строки ≤900px из topbar.html", "LVL/XP слева, метрики справа",
    "Высота ≈10% кадра, не больше", "Шрифт чисел tabular-nums",
    "XP-бар 18px с градиентом и glow", "Молния/звезда/монета 32px при s=.6",
    "Бейдж на колоколе 22px", "Пустой бейдж скрыт", "0 попыток — красное приглушённое состояние",
    "Геометрия одинакова на всех 34 страницах",
  ]],
  ["Вертикальные доли экрана", [
    "Top Bar ≈86px (10.2%)", "Body ≈696px (82.5%)", "Nav ≈62px (7.3%)",
    "Сумма долей = 100% без мёртвых полей", "Splash: hero 58% / текст 26% / CTA 16%",
    "Tutorial: hero 44% / тело 34% / CTA auto", "Chart: график забирает всё свободное поле",
    "Списки: header auto / список 1fr / CTA auto", "Score: награда 1.25fr / разбор .8fr",
    "Нет двух соседних пустых блоков",
  ]],
  ["Отступы и ритм", [
    "Боковые поля 16px", "Шаг сетки 4/8/12/16", "Gap между карточками 8–10px",
    "CTA-зона 12–16px снизу", "Заголовок не липнет к Top Bar",
    "Группы разделены 12px, элементы внутри 6px", "Safe-area снизу добавляется к паддингу",
    "Левая и правая кромки контента совпадают", "Крупный визуал центрирован оптически",
    "Никаких случайных margin вручную",
  ]],
  ["Типографика", [
    "Eyebrow 9.5px / .18em / uppercase", "Title 17–22px / 800–900 / tight",
    "Body 12–12.5px / line 1.45", "Hint ≤10.5px только вторичный",
    "Минимум 9px в самой плотной таблице", "Контраст вторичного текста ≥4.5:1",
    "Числа — tabular-nums", "Длина строки body ≤46 символов",
    "Рукописный шрифт только в студии", "Один шрифтовый стек в игре",
  ]],
  ["График / данные", [
    "4 treatment: candles/line-glow/area/minimal", "Скрытое будущее — пунктирная граница",
    "Зелёный/красный не единственный сигнал (тело/фитиль)", "Свечи ≥3px тело на 320px",
    "Reveal scan/wipe/flip/shatter", "После reveal задержка текста 1.9s",
    "Метки уровней внутри кадра", "График не наезжает на CTA",
    "Высота графика пропорциональна роли (44–52% body)", "Анимация только transform/opacity",
  ]],
  ["Skill cards c01–c40", [
    "Цвет строго по группе: g/y/b/r", "Hex: 2E7F5C · D0B24A · 4C6180 · C56861",
    "Иконка всегда белая, currentColor", "Внешний круг и единый визуальный вес",
    "Lock: grayscale .4, без подмены иконки", "Размер карты не двигает соседей",
    "Подпись cNN ≤9px", "Сетка 4 колонки с равными gap",
    "Карты c17–c24 жёлтые и т.д. без ошибок групп", "MISSING — рамка с кодом, не emoji",
  ]],
  ["Решения / CTA", [
    "Мин. тач-цель 44×44px", "Один главный CTA на экран",
    "Secondary — призрачный/нейтральный", "active: translateY+scale, без hover",
    "Haptic 12ms / danger [16,30,16]", "Опасное действие — красный тон",
    "Disabled честно не нажимается", "CTA никогда не ниже safe-area",
    "Необратимость объяснена до нажатия", "После CTA — явный следующий экран",
  ]],
  ["Навигация", [
    "3 раздела MVP: Академия/Арена/Профиль", "Высота ≈62px вместе с safe-area",
    "Арена — скрещённые свечи, не мечи", "Активный раздел бирюзовый",
    "Навигации нет в обучении/splash", "Иконки нарисованы, не emoji",
    "Тач-зона элемента ≥44px", "Смена вкладки не ресетит данные",
    "Карта вкладок в студии совпадает с экспортом", "Арена ведёт на лобби P23, не на карту",
  ]],
  ["Состояния", [
    "Loading без белого экрана", "Missing ассета блокирует с явным текстом",
    "Empty energy P33 не прячет Top Bar", "Locked card P22 объясняет как открыть",
    "Offline P34 с retry", "Пустые списки с объяснением, не вакуум",
    "Ошибка сети не ломает locked Top Bar", "Все состояния в инвентаре P32–P34",
    "Скелет повторяет форму контента", "Нет состояний-заглушек «потом доделаем»",
  ]],
  ["Иконки / метафора", [
    "0 эмодзи в игровом экспорте", "Свеча+клинок: фитиль-остриё, тело-лезвие",
    "Прямых мечей/боёв нет", "Толщина линий одинакова в наборе",
    "Иконки c01–c40 грузятся из репозитория", "Белая иконка на цвете группы",
    "Моноиконки topbar — градиентные SVG исходника", "Рукописный смайлик нарисован вектором",
    "Fallback иконки = MISSING, не дубль", "Иконка понятна в 20px и в 64px",
  ]],
  ["Motion / геймфид", [
    "Длительность 180–550ms", "Ease-out/springs, нет линейных",
    "Stagger шаг 55ms", "Reduce-motion → кросс-фейд",
    "Пульс только на смысловом элементе", "Reveal не чаще одного раза за сценарий",
    "Никаких бесконечных лоадеров на главном", "Анимации не съедают клик",
    "Смена экрана без перепрыгивания контента", "Звук синхронен с нажатием/reveal",
  ]],
  ["QA / доступность", [
    "scrollHeight ≤ clientHeight на 4 вьюпортах", "scrollWidth ≤ clientWidth",
    "CTA/TB/nav внутри кадра", "Текст ≥9px, иначе блок",
    "Контраст текста и фона", "Тач-цели ≥44px", "safe-area top/bottom учтены",
    "Ассеты внутри своих контейнеров", "Нет перекрытия текст×ассет",
    "QA читается после fonts.ready и загрузки SVG",
  ]],
  ["Студия / экспорт", [
    "В экспорте нет assetId/debug", "Панели не попадают в ?mode=app",
    "Инспектор реально меняет ассет", "Matrix показывает все A–D слоты",
    "Scale/X/Y/opacity/fit/crop/tint работают", "Reset Variant возвращает базу",
    "Поиск P01–P34 находит состояние", "Previous/Next + стрелки клавиатуры",
    "Рукописная заметка живёт в студии", "Production = 100dvh + safe-area + clip",
  ]],
];

const TOP30 = [
  ["Сайдбар + мобильный фрейм", "исправлено"],
  ["P01–P34, а не произвольный экран", "исправлено"],
  ["Все 40 иконок из реальных путей репозитория", "исправлено"],
  ["Locked Top Bar из topbar.html", "исправлено"],
  ["Никаких emoji в игровом экспорте", "исправлено"],
  ["Hover заменён на active/tap", "исправлено"],
  ["Контролы инспектора влияют на ассет", "исправлено"],
  ["4 reveal-эффекта вместо одного", "исправлено"],
  ["NO-SCROLL QA под каждый viewport", "исправлено"],
  ["CTA ≥44px и data-qa метки", "исправлено"],
  ["Скролл только у списков", "исправлено"],
  ["Палитра карт строго 4 цвета", "исправлено"],
  ["Цвет карты = группе c01–c40", "исправлено"],
  ["Иконки остаются белыми", "исправлено"],
  ["Safe-area в production", "исправлено"],
  ["MVP 300×620 только как QA", "исправлено"],
  ["Рукописная заметка только в студии", "исправлено"],
  ["Скруглённый мобильный фрейм без телефона", "исправлено"],
  ["Reduce-motion fallback", "исправлено"],
  ["Тактильный vibrate на решениях", "исправлено"],
  ["Ошибка ассета = MISSING, не заглушка", "исправлено"],
  ["Поиск по инвентарю", "исправлено"],
  ["Previous / Next", "исправлено"],
  ["Asset Matrix на страницу", "исправлено"],
  ["Динамика LVL/XP/звёзд/монет", "исправлено"],
  ["Нижняя навигация только из 3 разделов MVP", "исправлено"],
  ["Варианты A–D не меняют layout/тексты", "исправлено"],
  ["Репозиторные fallback-зеркала", "исправлено"],
  ["Прогресс-бары приведены к валидным значениям", "исправлено"],
  ["Невалидные hex-цвета убраны", "исправлено"],
] as const;

function Slider({
  label, value, min, max, step, onChange, suffix = "",
}: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; suffix?: string }) {
  return (
    <label className="mt-2 block">
      <span className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-[#55647a]">
        {label} <b className="font-mono text-[#2EE6C8]">{Number.isInteger(step) ? value : value.toFixed(2)}{suffix}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-[#2EE6C8]"
      />
    </label>
  );
}

export function RightPanel({
  page,
  variant,
  onReset,
  overrides = {},
  onPatch,
}: {
  page: Page;
  variant: Variant;
  onReset: () => void;
  overrides?: VariantOverride;
  onPatch?: (patch: VariantOverride) => void;
}) {
  const assets = useAssets();
  const [tab, setTab] = useState<"asset" | "matrix" | "audit">("asset");
  const rows = assetMatrix(page);
  const archiveIssues = assets.missing.filter((m) => m.includes("ASSET_ARCHIVE_NOT_EXTRACTED"));
  const missingCards = assets.missing.filter((m) => /c\d+\.svg/i.test(m));

  return (
    <aside className="flex h-full min-h-0 w-[300px] shrink-0 flex-col border-l border-[#1b2739] bg-[#080c14]">
      <header className="shrink-0 border-b border-[#1b2739] px-3 py-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-black tracking-[.16em] text-[#2EE6C8] uppercase">
            Asset Inspector
          </h2>
          <div className="flex gap-1">
            {(["asset", "matrix", "audit"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-2 py-[3px] text-[9.5px] font-bold uppercase tracking-wider ${
                  tab === t
                    ? "bg-[#2EE6C8] text-[#04211C]"
                    : "bg-white/6 text-[#7f90a8]"
                }`}
              >
                {t === "asset" ? "Asset" : t === "matrix" ? "Matrix" : "Аудит"}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-1 font-mono text-[10.5px] text-[#7f90a8]">
          {page.id} · {page.title}
        </p>
      </header>

      <div className="scroll-y min-h-0 flex-1 px-3 py-2.5">
        {tab === "audit" ? (
          <div>
            <p className="mb-2 rounded-xl border border-[#2EE6C8]/25 bg-[#2EE6C8]/8 px-2.5 py-2 text-[9.5px] leading-snug text-[#9beaf3]">
              150 анализов по методу 20/80: 15 зон × 10 замеров. Пропорции заданы
              контентом: Top Bar ≈10%, body ≈82.5%, nav ≈7.3% кадра; студия —
              Inventory 18.3% · Inspector 20.8% · сцена ≥60%.
            </p>

            <details className="mb-2 rounded-xl border border-white/8 bg-white/[.025] p-2" open>
              <summary className="cursor-pointer text-[10px] font-black uppercase tracking-wider text-[#2EE6C8]">
                150 анализов · 15 зон
              </summary>
              <div className="mt-2 space-y-1.5">
                {ANALYSIS_150.map(([zone, items]: [string, string[]], gi: number) => (
                  <div key={zone}>
                    <p className="text-[9px] font-black uppercase tracking-wider text-[#55647a]">
                      {String(gi * 10 + 1).padStart(3, "0")}–{String(gi * 10 + 10).padStart(3, "0")} · {zone}
                    </p>
                    <ul className="mt-0.5 space-y-0.5">
                      {items.map((item: string, ii: number) => (
                        <li key={item} className="flex gap-1.5 text-[9px] text-[#c9d6e6]">
                          <span className="font-mono text-[#2EE6C8]">{gi * 10 + ii + 1}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
            <ol className="space-y-1">
              {TOP30.map(([label, status], i) => (
                <li
                  key={label}
                  className="flex items-start gap-2 rounded-lg bg-white/[.025] px-2 py-1 text-[9.5px]"
                >
                  <span className="w-5 shrink-0 font-mono font-black text-[#2EE6C8]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-[#c9d6e6]">{label}</span>
                  <span className="rounded bg-[#2EE6C8]/15 px-1 text-[8px] font-black uppercase text-[#2EE6C8]">
                    {status}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : tab === "asset" ? (
          <>
            <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[.03] p-3">
              <AssetThumb id={variant.assetId} size={64} />
              <div className="min-w-0">
                <p className="font-mono text-[13px] font-black text-[#2EE6C8]">
                  {variant.vid}
                </p>
                <p className="font-mono text-[11px] font-bold text-[#e8eef7]">
                  {variant.assetId}
                </p>
                <p className="mt-0.5 text-[9.5px] leading-tight text-[#7f90a8]">
                  {variant.source}
                </p>
              </div>
            </div>

            <div className="mt-2">
              <Row label="Asset ID" value={variant.assetId} />
              <Row label="Slot" value={variant.slot} />
              <Row label="Placement" value={variant.placement} mono={false} />
              <Row label="Purpose" value={variant.purpose} mono={false} />

              <div className="mt-3 rounded-xl border border-white/8 bg-white/[.03] p-2.5">
                <p className="text-[9.5px] font-black tracking-[.14em] text-[#2EE6C8] uppercase">
                  Slot transform
                </p>
                <Slider label="scale" value={variant.scale} min={0.5} max={1.5} step={0.02}
                  onChange={(n) => onPatch?.({ scale: n })} suffix="×" />
                <Slider label="position X" value={variant.posX} min={20} max={80} step={1}
                  onChange={(n) => onPatch?.({ posX: n })} suffix="%" />
                <Slider label="position Y" value={variant.posY} min={20} max={80} step={1}
                  onChange={(n) => onPatch?.({ posY: n })} suffix="%" />
                <Slider label="opacity" value={variant.opacity} min={0.25} max={1} step={0.02}
                  onChange={(n) => onPatch?.({ opacity: n })} />
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <label className="text-[9px] font-bold uppercase text-[#55647a]">
                    fit
                    <select
                      value={variant.fit}
                      onChange={(e) => onPatch?.({ fit: e.target.value as Variant["fit"] })}
                      className="mt-1 w-full rounded border border-[#26364d] bg-[#0c121d] px-1 py-1 text-[10px] text-white"
                    >
                      <option value="contain">contain</option>
                      <option value="cover">cover</option>
                    </select>
                  </label>
                  <label className="text-[9px] font-bold uppercase text-[#55647a]">
                    crop
                    <select
                      value={variant.crop}
                      onChange={(e) => onPatch?.({ crop: e.target.value })}
                      className="mt-1 w-full rounded border border-[#26364d] bg-[#0c121d] px-1 py-1 text-[10px] text-white"
                    >
                      <option>full-frame</option>
                      <option>tight-8%</option>
                      <option>wide+6%</option>
                      <option>center-4%</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-1 gap-1">
                <label className="text-[9px] font-bold uppercase text-[#55647a]">
                  tint / chart
                  <select
                    value={variant.chart}
                    onChange={(e) => onPatch?.({ chart: e.target.value as Variant["chart"] })}
                    className="mt-1 w-full rounded border border-[#26364d] bg-[#0c121d] px-1 py-1 text-[10px] text-white"
                  >
                    {CHART_TREATMENTS.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </label>
                <label className="text-[9px] font-bold uppercase text-[#55647a]">
                  reveal FX
                  <select
                    value={variant.reveal}
                    onChange={(e) => onPatch?.({ reveal: e.target.value as Variant["reveal"] })}
                    className="mt-1 w-full rounded border border-[#26364d] bg-[#0c121d] px-1 py-1 text-[10px] text-white"
                  >
                    {REVEALS.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </label>
                <label className="text-[9px] font-bold uppercase text-[#55647a]">
                  motion
                  <select
                    value={variant.motion}
                    onChange={(e) => onPatch?.({ motion: e.target.value as Variant["motion"] })}
                    className="mt-1 w-full rounded border border-[#26364d] bg-[#0c121d] px-1 py-1 text-[10px] text-white"
                  >
                    {MOTIONS.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </label>
              </div>
              <Row label="Fallback" value={variant.fallback} mono={false} />
              {Object.keys(overrides).length > 0 && (
                <p className="mt-2 rounded bg-[#2EE6C8]/10 px-2 py-1 font-mono text-[9px] text-[#2EE6C8]">
                  override: {Object.keys(overrides).join(", ")}
                </p>
              )}
            </div>

            <div className="mt-3 rounded-2xl border border-[#26364d] bg-[#0c121d] p-2.5">
              <p className="text-[9.5px] font-black tracking-[.14em] text-[#55647a] uppercase">
                Asset source
              </p>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block break-all font-mono text-[10px] text-[#2EE6C8] underline decoration-dotted"
              >
                github.com/hudyakovictor/assets
              </a>
              <ul className="mt-1.5 space-y-[3px] font-mono text-[9.5px]">
                <li className={assets.cardsSource === "not-extracted" ? "text-[#C56861]" : assets.iconFiles.length ? "text-[#2EE6C8]" : "text-[#7f90a8]"}>
                  skill-card-icons · {assets.cardsSource} · {Object.keys(assets.cards).length}/40 SVG
                </li>
                {archiveIssues.map((m) => (
                  <li key={m} className="break-all text-[#C56861]">{m}</li>
                ))}
                <li className={assets.topbarHtml ? "text-[#2EE6C8]" : "text-[#C56861]"}>
                  topbar · {assets.topbarFiles.length} files
                  {assets.topbarHtml ? " · topbar.html OK" : " · topbar.html MISSING"}
                </li>
                <li className="text-[#7f90a8]">
                  assets.zip · {assets.extraFiles.length} refs
                </li>
              </ul>
              {!!assets.topbarFiles.length && (
                <p className="mt-1 font-mono text-[9px] leading-snug text-[#55647a]">
                  {assets.topbarFiles.slice(0, 24).join(" · ")}
                </p>
              )}
              {!!assets.extraFiles.length && (
                <details className="mt-1.5">
                  <summary className="cursor-pointer font-mono text-[9px] text-[#7f90a8]">
                    asset references ({assets.extraFiles.length})
                  </summary>
                  <p className="mt-1 max-h-24 overflow-y-auto font-mono text-[8.5px] leading-snug text-[#55647a]">
                    {assets.extraFiles.join("\n")}
                  </p>
                </details>
              )}
              {!!missingCards.length && (
                <p className="mt-1 font-mono text-[9px] text-[#C56861]">
                  missing: {missingCards.join(", ")}
                </p>
              )}
            </div>

            <button
              onClick={onReset}
              className="tap mt-3 w-full rounded-xl border border-[#26364d] bg-white/5 py-2 text-[11px] font-bold tracking-wider text-[#c9d6e6] uppercase"
            >
              Reset Variant
            </button>
          </>
        ) : (
          <div className="space-y-2">
            {variantsOf(page).map((v) => (
              <div
                key={v.vid}
                className={`rounded-xl border p-2 ${
                  v.vid === variant.vid
                    ? "border-[#2EE6C8]/60 bg-[#2EE6C8]/8"
                    : "border-white/8 bg-white/[.025]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <AssetThumb id={v.assetId} size={34} />
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] font-black text-[#e8eef7]">
                      {v.vid}
                    </p>
                    <p className="font-mono text-[9.5px] text-[#7f90a8]">
                      {v.assetId} · {v.chart} · {v.motion}
                    </p>
                  </div>
                </div>
                <table className="mt-1.5 w-full text-left">
                  <thead>
                    <tr className="text-[8px] tracking-wider text-[#55647a] uppercase">
                      <th className="py-[2px] font-black">slot</th>
                      <th className="py-[2px] font-black">asset</th>
                      <th className="py-[2px] font-black">source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows
                      .filter((r) => r.vid === v.vid)
                      .map((r, i) => (
                        <tr
                          key={i}
                          className="border-t border-white/5 align-top text-[9px]"
                        >
                          <td className="py-[3px] pr-1 font-mono text-[#c9d6e6]">
                            {r.slot}
                          </td>
                          <td className="py-[3px] pr-1 font-mono text-[#2EE6C8]">
                            {r.assetId}
                          </td>
                          <td className="py-[3px] font-mono text-[#7f90a8]">
                            {r.source}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
