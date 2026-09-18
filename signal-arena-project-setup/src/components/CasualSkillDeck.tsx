import { RepoSkillIcon, CARD_PALETTE, cardGroupOf, type CardGroup } from "./RepoAssets";
import { haptic, sfx } from "../lib/feel";

/*
 * КОЛОДА КАРТ НАВЫКОВ
 * Иконки — только из skill-card-icons.zip (c01–c40).
 * Цвет карточки = цвет группы по ТЗ, менять запрещено:
 *   green #2E7F5C · yellow #D0B24A · blue #4C6180 · red #C56861
 * Иконка всегда белая.
 */

export interface SkillCardItem {
  id: string;
  name: string;
  star?: boolean;
  locked?: boolean;
}

// Карты = реальные файлы skill-card-icons.zip (cNN_<семантика>.svg)
const DEFAULT_CARDS: SkillCardItem[] = [
  { id: "c16", name: "ВОЙТИ" },
  { id: "c17", name: "ЖДАТЬ", star: true },
  { id: "c02", name: "СТ. ТФ" },
  { id: "c24", name: "БЕЗ СДЕЛКИ" },
];

/** Стили каркаса карточки — только форма/блики. Цвет заливки берётся из CARD_PALETTE. */
function shell(isSelected: boolean, group: CardGroup) {
  const c = CARD_PALETTE[group];
  return {
    background: `linear-gradient(180deg, ${c} 0%, ${c}e6 52%, ${c}b3 100%)`,
    borderColor: isSelected ? "rgba(255,255,255,.75)" : `${c}dd`,
    boxShadow: isSelected
      ? `0 0 18px ${c}88, 0 10px 22px rgba(0,0,0,.55), inset 0 2px 2px rgba(255,255,255,.42)`
      : `0 5px 12px rgba(0,0,0,.45), inset 0 1px 1px rgba(255,255,255,.28)`,
  };
}

export function CasualSkillDeck({
  cards = DEFAULT_CARDS,
  selectedId = "c17",
  onSelect,
  /** id карты, которую подсвечиваем в обучении (не гасим остальные) */
  hintId,
}: {
  cards?: SkillCardItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  hintId?: string;
}) {
  return (
    <div className="w-full grid grid-cols-4 gap-2 select-none">
      {cards.map((c) => {
        const isSelected = selectedId === c.id;
        const group = cardGroupOf(c.id);

        return (
          <button
            key={c.id}
            onClick={() => {
              if (c.locked) {
                haptic("warning");
                sfx.miss();
              } else {
                haptic("select");
                sfx.card();
                onSelect?.(c.id);
              }
            }}
            className={`relative flex flex-col justify-between p-1.5 rounded-[18px] cursor-pointer transition-all duration-200 border-2 ${
              isSelected ? "-translate-y-1 scale-[1.02]" : "active:-translate-y-0.5 active:scale-[1.01]"
            } ${c.locked ? "opacity-55 cursor-not-allowed grayscale-[.35]" : ""} ${
              hintId === c.id && !isSelected ? "hint-ring" : ""
            }`}
            style={shell(isSelected, group)}
            title={`skill-card-icons.zip/${c.id}.svg`}
          >
            {/* Спекулярный блик */}
            <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/22 to-transparent rounded-t-[16px] pointer-events-none" />

            {/* Выбранная карта — угловой маркер (рисован, не символ) */}
            {c.star && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#f0d68a] grid place-items-center shadow-md border border-white/90">
                <svg viewBox="0 0 24 24" className="w-3 h-3" aria-hidden>
                  <path
                    d="M12 4.2l2.2 4.5 5 .7-3.6 3.5.9 4.9-4.5-2.4-4.5 2.4.9-4.9L4.8 9.4l5-.7L12 4.2z"
                    fill="#7a5c12"
                  />
                </svg>
              </span>
            )}

            {/* Иконка из архива — белая, поверх цвета группы */}
            <span className="my-1.5 mx-auto grid place-items-center">
              <RepoSkillIcon id={c.id} size={48} />
            </span>

            {/* Нижняя белая плашка с названием */}
            <span className="w-full py-1 bg-white rounded-[10px] shadow-sm flex items-center justify-center">
              <span className="text-[10.5px] font-black text-[#0f172a] tracking-wider uppercase leading-none">
                {c.name}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
