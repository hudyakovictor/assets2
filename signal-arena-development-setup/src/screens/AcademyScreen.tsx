import {
  GraduationCapIcon,
  CandlestickChartIcon,
  OrderBookIcon,
  ShieldIcon,
  CheckmarkIcon,
  LockIcon,
  ArrowRightIcon,
} from "../components/icons";
import { playTapSound } from "../utils/audio";

const TOPICS = [
  { num: "01", title: "Структура рынка", state: "4/4", Icon: CandlestickChartIcon, locked: false },
  { num: "02", title: "Уровни и ложные пробои", state: "3/4", Icon: ShieldIcon, locked: false },
  { num: "03", title: "Объём и подтверждение", state: "1/4", Icon: OrderBookIcon, locked: false },
  { num: "04", title: "Риск и инвалидация", state: "0/4", Icon: ShieldIcon, locked: true },
];
const LESSONS = [
  { num: "01", title: "Уровни как границы", state: "Пройден", locked: false },
  { num: "02", title: "Ретест", state: "Пройден", locked: false },
  { num: "03", title: "Ложный пробой", state: "Продолжить", locked: false },
  { num: "04", title: "Сжатие перед импульсом", state: "Закрыт", locked: true },
];

export function AcademyScreen({ pageId, onNext }: { pageId: "P15" | "P16"; onNext: () => void }) {
  const tree = pageId === "P15";
  const items = tree
    ? TOPICS
    : LESSONS.map((item) => ({ ...item, Icon: CandlestickChartIcon }));
  return (
    <div data-qa="game-content" className="flex-1 min-h-0 flex flex-col p-3 gap-2.5 overflow-hidden">
      <div className="shrink-0 flex items-center gap-2.5">
        <div className="h-10 w-10 rounded-xl border border-[#2EE6C8]/35 bg-[#2EE6C8]/10 grid place-items-center text-[#2EE6C8]">
          <GraduationCapIcon size={23} />
        </div>
        <div>
          <p className="font-mono text-[8px] font-black tracking-[0.2em] text-[#2EE6C8]">АКАДЕМИЯ</p>
          <h2 className="font-display text-[15px] font-extrabold text-white">{tree ? "Дерево тем" : "Уровни и ложные пробои"}</h2>
          <p className="text-[9.5px] font-semibold text-[#7188A3]">{tree ? "4 темы · 11 уроков" : "3 из 4 уроков пройдено"}</p>
        </div>
      </div>

      <div className="custom-scroll min-h-0 flex-1 space-y-2 pr-1">
        {items.map((item) => {
          const Icon = item.Icon;
          return (
            <button
              key={item.num}
              onClick={() => {
                if (item.locked) return;
                playTapSound();
                if ((tree && item.num === "02") || (!tree && item.num === "03")) onNext();
              }}
              disabled={item.locked}
              className={`c2d-panel tactile-btn min-h-[62px] w-full p-2.5 flex items-center gap-2.5 text-left ${item.locked ? "opacity-45 grayscale" : ""}`}
            >
              <div className="c2d-medallion h-10 w-10 shrink-0 text-[#CFE2F5]">
                {item.locked ? <LockIcon size={17} /> : <Icon size={19} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[8px] font-black text-[#2EE6C8]">{tree ? "ТЕМА" : "УРОК"} {item.num}</p>
                <p className="truncate font-display text-[10.5px] font-bold text-white">{item.title}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-[8px] font-black text-[#7188A3]">{item.state}</p>
                {!item.locked && (item.state === "4/4" || item.state === "Пройден") && <CheckmarkIcon size={12} className="ml-auto mt-1 text-[#50C890]" />}
              </div>
            </button>
          );
        })}
      </div>

      <button
        data-qa="primary-cta"
        onClick={() => { playTapSound(); onNext(); }}
        className="c2d-btn c2d-teal min-h-12 shrink-0 text-[11px] uppercase flex items-center justify-center gap-2"
      >
        {tree ? "Открыть тему 2" : "Начать урок 3"} <ArrowRightIcon size={14} />
      </button>
    </div>
  );
}