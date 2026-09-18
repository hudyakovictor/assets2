import { useMemo, useState } from "react";
import { SkillAsset, SKILL_COLORS, skillGroup, useRepoAssets } from "../lib/repoAssets";
import { LockIcon, CheckmarkIcon } from "../components/icons";
import { playTapSound } from "../utils/audio";

const NAMES = [
  "Стоп до входа", "Замок прибыли", "Половина сайза", "Фильтр шума", "Отказ от FOMO",
  "Лимит риска", "Холодная голова", "Пауза после стопа", "План отмены", "Защита капитала",
  "Безубыток", "Контроль плеча", "Дневной лимит", "Серия стопов", "Выход частями",
  "Режим рынка", "Сжатие диапазона", "Объёмный всплеск", "Китовая плотность", "Фаза импульса",
  "Новостной шум", "Ликвидность", "Контекст сессии", "Смена режима", "Зеркальный уровень",
  "Ложный закол", "Нисходящий клин", "Ретест", "Снятие ликвидности", "Смена структуры",
  "Диапазон", "Импульс", "Подтверждение", "Ловушка быков", "Тильт", "Усреднение",
  "Погоня за ценой", "Поздний вход", "Месть рынку", "Слепой пробой",
];

const GROUP_LABEL = {
  green: "Защита / Риск",
  yellow: "Контекст / Режим",
  blue: "Структура / Уровни",
  red: "Ошибки / Анти-паттерны",
};
type Filter = "all" | keyof typeof SKILL_COLORS;

export function CollectionScreen({ onOpenCard }: { onOpenCard?: (id: number) => void }) {
  const assets = useRepoAssets();
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState(1);
  const ids = useMemo(
    () => Array.from({ length: 40 }, (_, i) => i + 1).filter((id) => filter === "all" || skillGroup(id) === filter),
    [filter],
  );
  const group = skillGroup(active);
  const unlocked = active <= 33;

  return (
    <div className="flex-1 min-h-0 flex flex-col p-3 gap-2 overflow-hidden">
      <div className="shrink-0 flex items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[8.5px] font-black tracking-[0.2em] text-[#2EE6C8] uppercase">Коллекция</p>
          <h2 className="font-display font-extrabold text-[15px] text-white">Колода навыков</h2>
        </div>
        <span className="font-mono text-[9px] font-black text-[#8FA2BA]">33 / 40 открыто</span>
      </div>

      <div className="shrink-0 grid grid-cols-5 gap-1">
        {(["all", "green", "yellow", "blue", "red"] as Filter[]).map((key) => (
          <button
            key={key}
            onClick={() => { playTapSound(); setFilter(key); }}
            className={`c2d-chip min-h-11 font-mono text-[8.5px] uppercase ${
              filter === key ? "c2d-chip-on" : ""
            }`}
          >
            {key === "all" ? "Все" : key[0]}
          </button>
        ))}
      </div>

      <div className="custom-scroll min-h-0 flex-1 pr-1">
        <div className="grid grid-cols-4 gap-2 pb-1">
          {ids.map((id) => {
            const g = skillGroup(id);
            const color = SKILL_COLORS[g];
            const locked = id > 33;
            return (
              <button
                key={id}
                onClick={() => { playTapSound(); setActive(id); }}
                className={`c2d-skill relative aspect-[4/5] flex flex-col items-center justify-center gap-1 overflow-hidden ${active === id ? "c2d-skill-on" : ""}`}
                style={{
                  background: `radial-gradient(110% 85% at 50% 4%, ${color} 0%, ${color} 48%, rgba(0,0,0,.42) 110%)`,
                  opacity: locked ? 0.45 : 1,
                  filter: locked ? "grayscale(0.7)" : "none",
                }}
              >
                <SkillAsset id={id} className="h-[52%] w-[52%]" />
                <span className="font-mono text-[7.5px] font-black tracking-widest text-white/85">c{String(id).padStart(2, "0")}</span>
                {locked && <span className="absolute right-1 top-1 text-white"><LockIcon size={10} /></span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="c2d-panel shrink-0 p-2.5 flex items-center gap-2.5">
        <div
          className="c2d-medallion h-12 w-12 shrink-0"
          style={{ background: `radial-gradient(110% 90% at 50% 0%, ${SKILL_COLORS[group]} 0%, ${SKILL_COLORS[group]} 55%, rgba(0,0,0,.4) 100%)` }}
        >
          <SkillAsset id={active} className="h-9 w-9" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[8px] font-black text-[#2EE6C8]">c{String(active).padStart(2, "0")}</span>
            <span className="text-[8px] font-bold text-[#6F87A2]">{GROUP_LABEL[group]}</span>
          </div>
          <p className="truncate font-display text-[10.5px] font-bold text-white">{NAMES[active - 1]}</p>
          <p className="truncate text-[8.5px] font-semibold text-[#7C93AC]">
            {assets.cards[active] ? "SVG из skill-card-icons.zip" : `MISSING ASSET: c${String(active).padStart(2, "0")}.svg`}
          </p>
        </div>
        <span className={unlocked ? "text-[#50C890]" : "text-[#7C93AC]"}>
          {unlocked ? <CheckmarkIcon size={15} /> : <LockIcon size={15} />}
        </span>
      </div>
      <button
        data-qa="primary-cta"
        disabled={!unlocked}
        onClick={() => { playTapSound(); onOpenCard?.(active); }}
        className="c2d-btn c2d-teal min-h-12 shrink-0 text-[11px] uppercase"
      >
        Открыть карту навыка
      </button>
    </div>
  );
}