import { useState } from "react";
import {
  GraduationCapIcon,
  CandlestickChartIcon,
  OrderBookIcon,
  ShieldIcon,
  StarIcon,
  CheckmarkIcon,
} from "../components/icons";
import { playTapSound, playCoinSound } from "../utils/audio";

export type AcademyLesson = {
  id: string;
  chapter: string;
  title: string;
  xp: number;
  completed: boolean;
  desc: string;
};

const LESSONS: AcademyLesson[] = [
  {
    id: "l1",
    chapter: "ГЛАВА 1",
    title: "Анатомия свечи: клинок и остриё",
    xp: 50,
    completed: true,
    desc: "Тело свечи — это диапазон уверенности рынка. Длинный фитиль (остриё) показывает отторжение цены крупным игроком.",
  },
  {
    id: "l2",
    chapter: "ГЛАВА 2",
    title: "Ложный пробой: ловушка без объёма",
    xp: 75,
    completed: true,
    desc: "Когда цена обновляет хай, но объём падает — это не пробой, а сбор стопов розничных трейдеров. Всегда жди ретест.",
  },
  {
    id: "l3",
    chapter: "ГЛАВА 3",
    title: "Китовые стены и поглощение в стакане",
    xp: 100,
    completed: false,
    desc: "Лимитные плотности от 1 000 BTC выступают непреодолимым барьером, пока маркет-мейкер не проведёт спуфинг.",
  },
  {
    id: "l4",
    chapter: "ГЛАВА 4",
    title: "Дисциплина самурая: защита депозита",
    xp: 120,
    completed: false,
    desc: "Лучшая сделка — та, в которую ты не вошёл при сомнительном сетапе. Риск на сделку не более 1-2%.",
  },
];

export function AcademyScreen({ onGainXp }: { onGainXp?: (amt: number) => void }) {
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(LESSONS[1]);
  const [completedIds, setCompletedIds] = useState<string[]>(["l1", "l2"]);

  const handleComplete = (lesson: AcademyLesson) => {
    playCoinSound();
    if (!completedIds.includes(lesson.id)) {
      setCompletedIds((prev) => [...prev, lesson.id]);
      onGainXp?.(lesson.xp);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between p-3 gap-2.5 overflow-hidden">
      {/* Шапка академии */}
      <div className="shrink-0 p-3 rounded-2xl bg-[#16212F] border border-[#27384E] flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#233549] border border-[#3A506C] flex items-center justify-center text-[#5DE2B5]">
            <GraduationCapIcon size={24} />
          </div>
          <div>
            <h2 className="font-black text-[15px] text-white tracking-tight leading-tight">
              Академия Арены
            </h2>
            <p className="text-[11px] font-bold text-[#7E91A6]">
              Пройдено: {completedIds.length} из {LESSONS.length} уроков
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#1C2C3E] border border-[#2E435C] text-[#F5C75D] font-mono font-black text-[12px]">
          <StarIcon size={14} />
          <span>{completedIds.length * 3}</span>
        </div>
      </div>

      {/* Список уроков */}
      <div className="flex-1 min-h-0 custom-scroll space-y-2 pr-1">
        {LESSONS.map((l, idx) => {
          const isDone = completedIds.includes(l.id);
          const isCurrent = selectedLesson?.id === l.id;

          return (
            <div
              key={l.id}
              onClick={() => {
                playTapSound();
                setSelectedLesson(l);
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isCurrent
                  ? "bg-[#1B293A] border-[#5DE2B5] shadow-[0_4px_16px_rgba(93,226,181,0.25)]"
                  : "bg-[#141E2C] border-[#223145] hover:border-[#33465F]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-[#5DE2B5]">
                  {l.chapter}
                </span>
                <span
                  className={`flex items-center gap-1 text-[9.5px] font-black px-2 py-0.5 rounded-full ${
                    isDone
                      ? "bg-[#50C890]/20 text-[#50C890] border border-[#50C890]/40"
                      : "bg-[#7E91A6]/20 text-[#7E91A6]"
                  }`}
                >
                  {isDone && <CheckmarkIcon size={11} />}
                  <span>{isDone ? "ПРОЙДЕНО" : `+${l.xp} XP`}</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1A2636] border border-[#2A3C52] flex items-center justify-center shrink-0 text-[#9BB1CA]">
                  {idx === 0 && <CandlestickChartIcon size={18} />}
                  {idx === 1 && <CandlestickChartIcon size={18} />}
                  {idx === 2 && <OrderBookIcon size={18} />}
                  {idx === 3 && <ShieldIcon size={18} />}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-[13px] text-white leading-tight">
                    {l.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Окно выбранного урока */}
      {selectedLesson && (
        <div className="shrink-0 p-3 rounded-2xl bg-[#182435] border border-[#2E425B] shadow-lg flex flex-col gap-2">
          <p className="text-[12px] leading-relaxed text-[#C5D6E8]">
            {selectedLesson.desc}
          </p>
          <button
            onClick={() => handleComplete(selectedLesson)}
            className="tactile-btn w-full py-2.5 rounded-xl bg-[#3E9F73] border border-[#52BE8D] shadow-[0_3px_0_#236347] font-black text-[12.5px] text-white uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            {completedIds.includes(selectedLesson.id) ? (
              <>
                <CheckmarkIcon size={14} />
                <span>УРОК ЗАКРЕПЛЁН</span>
              </>
            ) : (
              <span>СДАТЬ ТЕСТ (+{selectedLesson.xp} XP)</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
