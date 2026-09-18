import { useState } from "react";
import { ShieldIcon, TrendUpIcon, VolumeBarsIcon, AlertTriangleIcon, StarIcon } from "../components/icons";
import { playTapSound } from "../utils/audio";

export type CardItem = {
  id: number;
  code: string;
  name: string;
  group: "green" | "yellow" | "blue" | "red";
  desc: string;
  boost: string;
  unlocked: boolean;
};

const CARDS_DATA: CardItem[] = [
  // Green 1..15
  { id: 1, code: "c01", name: "Стоп до входа", group: "green", desc: "Рассчитывает допустимый риск до открытия позиции.", boost: "+15% к защите от ликвидаций", unlocked: true },
  { id: 2, code: "c02", name: "Замок прибыли", group: "green", desc: "Перевод стоп-лосса в безубыток после первого импульса.", boost: "0 риска после 1R", unlocked: true },
  { id: 3, code: "c03", name: "Половина сайза", group: "green", desc: "Снижает объем позиции в сомнительных боковиках.", boost: "-50% просадки при ошибке", unlocked: true },
  { id: 4, code: "c04", name: "Фильтр шума", group: "green", desc: "Отсекает ложные импульсы на младших минутах.", boost: "+20% к винрейту в тренде", unlocked: true },
  { id: 5, code: "c05", name: "Отказ от FOMO", group: "green", desc: "Блокирует маркет-ордера на свечах длиннее 3x ATR.", boost: "Защита от покупки хая", unlocked: true },

  // Yellow 16..24
  { id: 16, code: "c16", name: "Режим рынка", group: "yellow", desc: "Определяет фазу: аккумуляция, импульс или дистрибуция.", boost: "+25% к точности направления", unlocked: true },
  { id: 17, code: "c17", name: "Сжатие диапазона", group: "yellow", desc: "Подсвечивает накопление энергии перед взрывом волатильности.", boost: "Ранний сигнал на 2 свечи раньше", unlocked: true },
  { id: 18, code: "c18", name: "Объёмный всплеск", group: "yellow", desc: "Сравнивает текущий объём со средней 20-периодной SMA.", boost: "Маркер истинного пробоя", unlocked: true },
  { id: 19, code: "c19", name: "Китовая плотность", group: "yellow", desc: "Показывает невидимые лимитные айсберг-ордера.", boost: "Подсветка стены сопротивления", unlocked: true },

  // Blue 25..33
  { id: 25, code: "c25", name: "Зеркальный уровень", group: "blue", desc: "Уровень сопротивления становится поддержкой.", boost: "Идеальная точка входа на ретесте", unlocked: true },
  { id: 26, code: "c26", name: "Ложный закол", group: "blue", desc: "Фиксирует вынос ликвидности и мгновенный возврат в канал.", boost: "Контртрендовый сигнал 1:4 RR", unlocked: true },
  { id: 27, code: "c27", name: "Нисходящий клин", group: "blue", desc: "Бычья фигура разворота нисходящего движения.", boost: "+30% к шансу на отскок", unlocked: false },

  // Red 34..40
  { id: 34, code: "c34", name: "Ловушка быков", group: "red", desc: "Паттерн быстрого сквиза вверх без продолжения.", boost: "Анти-сигнал на немедленный шорт", unlocked: true },
  { id: 35, code: "c35", name: "Тильт-перегрузка", group: "red", desc: "Блокирует терминал после 3 убыточных сделок подряд.", boost: "Спасение депозита от эмоций", unlocked: false },
  { id: 36, code: "c36", name: "Усреднение в просадку", group: "red", desc: "Анти-паттерн, приводящий к ликвидации.", boost: "Предупреждение о токсичном риске", unlocked: false },
];

const GROUP_COLORS = {
  green: { bg: "#2E7F5C", border: "#46A77C", title: "Защита / Риск" },
  yellow: { bg: "#D0B24A", border: "#F0D268", title: "Контекст / Режим" },
  blue: { bg: "#4C6180", border: "#6D87AB", title: "Структура / Уровни" },
  red: { bg: "#C56861", border: "#EB8881", title: "Ошибки / Анти-паттерны" },
};

export function CollectionScreen() {
  const [filter, setFilter] = useState<"all" | "green" | "yellow" | "blue" | "red">("all");
  const [activeCard, setActiveCard] = useState<CardItem | null>(CARDS_DATA[1]);

  const filtered = CARDS_DATA.filter(
    (c) => filter === "all" || c.group === filter
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between p-3 gap-2.5 overflow-hidden">
      {/* Шапка коллекции */}
      <div className="shrink-0 flex items-center justify-between gap-2">
        <h2 className="font-black text-[16px] text-white tracking-tight">
          Колода навыков ({CARDS_DATA.filter((c) => c.unlocked).length}/{CARDS_DATA.length})
        </h2>
        {/* Фильтры по группам */}
        <div className="flex items-center gap-1">
          {(["all", "green", "yellow", "blue", "red"] as const).map((g) => (
            <button
              key={g}
              onClick={() => {
                playTapSound();
                setFilter(g);
              }}
              className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                filter === g
                  ? "bg-[#3AA89B] text-white shadow-sm"
                  : "bg-[#182332] text-[#7E91A6] hover:text-white"
              }`}
            >
              {g === "all" ? "ВСЕ" : g[0].toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Сетка карт */}
      <div className="flex-1 min-h-0 custom-scroll pr-1">
        <div className="grid grid-cols-3 gap-2.5">
          {filtered.map((card) => {
            const conf = GROUP_COLORS[card.group];
            const isSelected = activeCard?.id === card.id;

            return (
              <div
                key={card.id}
                onClick={() => {
                  playTapSound();
                  setActiveCard(card);
                }}
                className={`tactile-btn p-2 rounded-2xl flex flex-col items-center justify-between text-center cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-white shadow-[0_0_16px_rgba(255,255,255,0.4)]"
                    : "shadow-[0_4px_0_#111923]"
                } ${card.unlocked ? "" : "opacity-45 grayscale"}`}
                style={{
                  background: `linear-gradient(180deg, ${conf.bg} 0%, #151D28 100%)`,
                  border: `1.5px solid ${conf.border}`,
                  minHeight: "105px",
                }}
              >
                <div className="w-10 h-10 rounded-full bg-black/30 border border-white/20 flex items-center justify-center text-white mt-1 shadow-inner">
                  {card.group === "green" && <ShieldIcon size={18} />}
                  {card.group === "yellow" && <VolumeBarsIcon size={18} />}
                  {card.group === "blue" && <TrendUpIcon size={18} />}
                  {card.group === "red" && <AlertTriangleIcon size={18} />}
                </div>

                <div>
                  <span className="font-mono text-[9px] font-black tracking-widest text-white/70 uppercase">
                    {card.code}
                  </span>
                  <p className="font-extrabold text-[11px] text-white leading-tight mt-0.5 line-clamp-1">
                    {card.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Карточка инспектора выбранного навыка */}
      {activeCard && (
        <div className="shrink-0 p-3 rounded-2xl bg-[#16212F] border border-[#27384E] shadow-lg flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-mono font-black text-[10px] text-[#5DE2B5]">
                {activeCard.code.toUpperCase()}
              </span>
              <span className="text-[10px] font-bold text-[#F5C75D]">
                · {GROUP_COLORS[activeCard.group].title}
              </span>
            </div>
            <h4 className="font-black text-[13.5px] text-white leading-tight">
              {activeCard.name}
            </h4>
            <p className="text-[11px] text-[#93A7BD] mt-0.5 line-clamp-1">
              {activeCard.desc}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#233549] text-[#5DE2B5] font-black text-[11px]">
            <StarIcon size={14} />
            <span>АКТИВНА</span>
          </div>
        </div>
      )}
    </div>
  );
}
