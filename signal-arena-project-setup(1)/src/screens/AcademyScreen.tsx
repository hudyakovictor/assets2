import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "../utils/sound";
import { IconGraduationCap, IconPadlock, IconWhale } from "../components/icons";

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  iconComp: React.ReactNode;
  progress: number;
  total: number;
  status: "completed" | "current" | "locked";
  cards: string[];
}

export default function AcademyScreen() {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);

  const chapters: Chapter[] = [
    {
      id: 1,
      title: "Свечной анализ и сила движения",
      subtitle: "Как понять, кто побеждает в моменте",
      iconComp: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
          <path d="M7 3v3H5v10h2v5h2V16h2V6H9V3H7Zm8 5v3h-2v6h2v4h2v-4h2v-6h-2V8h-2Z" />
        </svg>
      ),
      progress: 4,
      total: 4,
      status: "completed",
      cards: ["c01", "c02", "c03", "c04"],
    },
    {
      id: 2,
      title: "Объёмы и ложные пробои",
      subtitle: "Главный фильтр манипуляций китов",
      iconComp: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
          <path d="M4 19h16v2H2V3h2v16Zm4-8h2v6H8v-6Zm4-4h2v10h-2V7Zm4-4h2v14h-2V3Z" />
        </svg>
      ),
      progress: 2,
      total: 4,
      status: "current",
      cards: ["c12", "c07", "c14", "c15"],
    },
    {
      id: 3,
      title: "Управление риском и стоп-лосс",
      subtitle: "Как сохранить депозит при ошибке",
      iconComp: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(255,255,255,0.2)" />
        </svg>
      ),
      progress: 0,
      total: 4,
      status: "locked",
      cards: ["c16", "c18", "c23", "c24"],
    },
    {
      id: 4,
      title: "Ликвидность и китовые ловушки",
      subtitle: "Где стоят заявки маркетмейкеров",
      iconComp: <IconWhale className="h-6 w-6 text-white" />,
      progress: 0,
      total: 5,
      status: "locked",
      cards: ["c25", "c26", "c34", "c39"],
    },
  ];

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto px-4 pb-4 pt-2 no-scrollbar">
      {/* Academy Banner */}
      <div
        className="clay-card relative mb-3.5 overflow-hidden p-4"
        style={{
          background: "linear-gradient(180deg, #1f2e44 0%, #162032 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="grid h-12 w-12 place-items-center rounded-2xl text-[#0c2e22]"
            style={{
              background: "linear-gradient(180deg, #3fe0a5 0%, #208763 100%)",
              boxShadow: "0 4px 12px rgba(63, 224, 165, 0.4)",
            }}
          >
            <IconGraduationCap className="h-7 w-7 text-[#0c2e22]" />
          </div>
          <div>
            <div className="text-[10px] font-black tracking-widest text-[#3fe0a5] uppercase">
              ПУТЬ ТРЕЙДЕРА
            </div>
            <h2 className="text-[16px] font-black text-white">Академия навыков</h2>
          </div>
        </div>
        <p className="mt-2 text-[12px] font-bold text-[#b0c5e2]">
          Проходи короткие уроки на минуту, собирай редкие карты навыков и применяй их на Арене.
        </p>
      </div>

      {/* Constellation Chapter Path */}
      <div className="space-y-3">
        {chapters.map((ch) => {
          const isDone = ch.status === "completed";
          const isCur = ch.status === "current";
          const isLocked = ch.status === "locked";

          return (
            <motion.div
              key={ch.id}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
              onClick={() => {
                if (!isLocked) {
                  sound.pop();
                  setActiveChapter(ch.id);
                } else {
                  sound.click();
                }
              }}
              className="clay-card relative flex items-center justify-between p-3.5 transition cursor-pointer"
              style={{
                border: isCur ? "2px solid #3fe0a5" : "1.5px solid #2e3e57",
                boxShadow: isCur
                  ? "0 0 20px rgba(63, 224, 165, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)"
                  : "0 8px 18px rgba(0,0,0,0.35)",
                opacity: isLocked ? 0.6 : 1,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-[22px]"
                  style={{
                    background: isDone
                      ? "linear-gradient(180deg, #37be8f 0%, #1e7555 100%)"
                      : isCur
                      ? "linear-gradient(180deg, #ffc94d 0%, #d88e14 100%)"
                      : "#243147",
                    boxShadow: isCur ? "0 4px 12px rgba(255, 201, 77, 0.4)" : "none",
                  }}
                >
                  {isLocked ? <IconPadlock className="h-5 w-5 text-[#8ca0c2]" /> : ch.iconComp}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-black uppercase tracking-wider"
                      style={{
                        color: isDone ? "#3fe0a5" : isCur ? "#ffc94d" : "#7187a7",
                      }}
                    >
                      ГЛАВА {ch.id} · {isDone ? "ПРОЙДЕНА" : isCur ? "АКТИВНА" : "ЗАКРЫТА"}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-black text-white leading-snug">{ch.title}</h3>
                  <div className="text-[11px] font-bold text-[#899fb9]">{ch.subtitle}</div>
                </div>
              </div>

              {/* Progress Circle or Badge */}
              <div className="text-right">
                <span className="text-[12px] font-black text-white tabular-nums">
                  {ch.progress}/{ch.total}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lesson View Modal */}
      <AnimatePresence>
        {activeChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm"
            onClick={() => setActiveChapter(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="clay-card flex flex-col p-5 max-w-[320px] w-full text-center"
              style={{ border: "2px solid #3fe0a5" }}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1d3532] text-[#3fe0a5]">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#3fe0a5]" fill="currentColor">
                  <path d="M7 3v3H5v10h2v5h2V16h2V6H9V3H7Zm8 5v3h-2v6h2v4h2v-4h2v-6h-2V8h-2Z" />
                </svg>
              </div>
              <div className="text-[10.5px] font-black uppercase tracking-widest text-[#3fe0a5] mt-2">
                УРОК НА 1 МИНУТУ
              </div>
              <h3 className="text-[18px] font-black text-white mt-1">
                Что говорит тело свечи?
              </h3>
              <p className="mt-2 text-[12.5px] font-bold text-[#b7cae4] leading-relaxed">
                Длинное зелёное тело без верхней тени — агрессивные покупатели забрали всё предложение. Если следующая свеча маленькая — силы иссякли.
              </p>
              <button
                onClick={() => {
                  sound.success();
                  setActiveChapter(null);
                }}
                className="btn-3d depth-mint mt-5 w-full rounded-xl py-2.5 text-[13px] font-black text-[#0c2e22]"
              >
                ЗАБРАТЬ +40 XP И КАРТУ
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
