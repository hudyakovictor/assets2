import { useEffect, useState } from "react";
import { CARD_COLORS, CARD_NAMES, cardGroup, cardId, PAGES } from "../data/pages";
import { haptic, sfx } from "../lib/feel";
import { CasualActionGrid } from "./CasualActionGrid";
import { CasualBottomNav, type NavTabId } from "./CasualBottomNav";
import { CasualSkillDeck } from "./CasualSkillDeck";
import { CasualTopBar } from "./CasualTopBar";
import { Confetti } from "./Confetti";
import { HanddrawnSmiley, IconFlame, IconLightning, IconTrophy } from "./Icons";
import { SkillIcon } from "./RepoSvg";
import type { StudioParams } from "./StudioSidebar";
import { TerminalCard, type TerminalTab } from "./TerminalCard";

export function CasualArenaScreen({
  studioParams,
  onOpenSidebar,
}: {
  studioParams?: StudioParams;
  onOpenSidebar?: () => void;
}) {
  const pageId = studioParams?.currentPageId ?? "P24";
  const go = (id: string) => studioParams?.setCurrentPageId(id);

  const [nav, setNav] = useState<NavTabId>("arena");
  const [tab, setTab] = useState<TerminalTab>("news");
  const [selectedCardId, setSelectedCardId] = useState("c04");
  const [selectedAction, setSelectedAction] = useState("wait");
  const [coachQuote, setCoachQuote] = useState("Пробой без объёма. Объём молчит.");
  const [xp, setXp] = useState(680);
  const [coins, setCoins] = useState(1240);
  const [burst, setBurst] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [timeframe, setTimeframe] = useState<"15M" | "1Ч" | "1Д">("15M");
  const [notif, setNotif] = useState(true);
  const [wisdomMode, setWisdomMode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  // Sync with external studio params
  useEffect(() => {
    if (studioParams?.terminalTab) setTab(studioParams.terminalTab);
  }, [studioParams?.terminalTab]);
  useEffect(() => {
    if (studioParams?.coachQuote) setCoachQuote(studioParams.coachQuote);
  }, [studioParams?.coachQuote]);
  useEffect(() => {
    if (studioParams?.xp != null) setXp(studioParams.xp);
  }, [studioParams?.xp]);
  useEffect(() => {
    if (studioParams?.coins != null) setCoins(studioParams.coins);
  }, [studioParams?.coins]);

  // Sync nav tab with current screen section
  useEffect(() => {
    const p = PAGES.find((x) => x.id === pageId);
    if (!p) return;
    if (p.section === "Академия" || pageId === "P18" || pageId === "P19" || pageId === "P20") {
      setNav("academy");
    } else if (pageId === "P21" || pageId === "P22") {
      setNav("deck");
    } else if (pageId === "P29" || pageId === "P30" || pageId === "P31") {
      setNav("more");
    } else {
      setNav("arena");
    }
  }, [pageId]);

  // Action decision logic
  const handleDecision = (actId: string) => {
    setSelectedAction(actId);
    haptic("success");
    sfx.seal();

    if (actId === "wait") {
      setCoachQuote("Верно! Ждём ретест уровня $67,800 и подтверждения объёмом.");
      setRevealed(true);
      setTimeout(() => {
        setBurst((b) => b + 1);
        sfx.win();
        setXp((x) => Math.min(1000, x + 120));
        setCoins((c) => c + 250);
      }, 600);
    } else if (actId === "enter") {
      setCoachQuote("Опасно! Входить в пробой на падающем объёме — частая ловушка маркет-мейкера.");
      setRevealed(true);
    } else if (actId === "htf") {
      setTab("candles");
      setTimeframe("1Ч");
      setCoachQuote("На старшем таймфрейме 1Ч видна медвежья дивергенция.");
    } else if (actId === "scale") {
      setCoachQuote("Внимание: риск повышен! Требуется подтверждение китовой стены.");
      setTab("depth");
    }
  };

  const isSplash = pageId === "P01";
  const attempts = pageId === "P32" ? 0 : 3;

  return (
    <div className="w-full h-full bg-[#0a101d] flex flex-col justify-between overflow-hidden relative shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-[#1e2a44] rounded-[26px] font-['Sora',system-ui,sans-serif]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[320px] h-[320px] rounded-full bg-[#2dd4bf]/[0.08] blur-[80px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[280px] h-[280px] rounded-full bg-[#8b7bff]/[0.08] blur-[90px]" />
      </div>

      {/* Confetti Burst on Reward / Win */}
      <Confetti run={burst} burst={60} origin="top" />

      {/* 1. TOP BAR (Shown on all pages except P01 Splash) */}
      {!isSplash && (
        <CasualTopBar
          xp={xp}
          xpMax={1000}
          coins={coins}
          attempts={attempts}
          attemptsMax={3}
          hasNotif={notif}
          onNotif={() => {
            setNotif(false);
            go("P31");
          }}
          onSettings={onOpenSidebar ?? (() => go("P30"))}
        />
      )}

      {/* ================= MAIN CONTENT VIEWPORT ================= */}
      <div className="flex-1 min-h-0 flex flex-col justify-between px-3 py-2 z-10 overflow-hidden">
        {/* ================= SCREEN P01: WELCOME / SPLASH ================= */}
        {isSplash && (
          <div className="flex-1 flex flex-col justify-between py-2 text-center">
            <div className="relative rounded-[22px] overflow-hidden h-[330px] border border-[#223356] shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
              <img
                src="/images/hero-splash.jpg"
                alt="Signal Arena"
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a101d] via-transparent to-transparent opacity-90" />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#2dd4bf]/20 border border-[#2dd4bf]/50 text-[#2dd4bf] text-[10px] font-black uppercase tracking-wider">
                TELEGRAM MINI APP
              </div>
            </div>

            <div className="flex flex-col gap-1.5 my-2">
              <h1 className="text-3xl font-black tracking-tight text-white font-['Sora',sans-serif] drop-shadow-[0_2px_12px_rgba(45,212,191,0.35)]">
                SIGNAL ARENA
              </h1>
              <p className="text-xs text-[#94a3b8] leading-relaxed px-2 font-medium">
                Учись читать рынок на реальных исторических сценариях. Решай — и смотри, что было дальше.
              </p>
            </div>

            {/* Handwritten wisdom directly on dark blue (no yellow sticker) */}
            <div
              onClick={() => {
                haptic("tap");
                setWisdomMode(!wisdomMode);
              }}
              className="flex items-center justify-center gap-2 p-2 rounded-[14px] bg-[#141f36]/80 border border-[#2dd4bf]/30 cursor-pointer active:scale-98 transition-transform"
            >
              <span
                className="font-['Permanent_Marker',sans-serif] text-[12px] text-[#2dd4bf] tracking-wide"
                style={{ textShadow: "0 0 8px rgba(45,212,191,0.45)" }}
              >
                {wisdomMode ? "Пробой без объёма. Объём молчит." : "IF YOU'RE HERE JUST FOR MONEY, YOU'RE EARLY. AND THAT'S BAD."}
              </span>
              <HanddrawnSmiley className="w-5 h-5 text-[#2dd4bf]" color="#2dd4bf" />
            </div>

            <button
              type="button"
              onClick={() => {
                haptic("success");
                sfx.seal();
                go("P24");
              }}
              className="w-full py-3.5 rounded-[18px] bg-gradient-to-b from-[#2dd4bf] via-[#14b8a6] to-[#0f766e] text-[#042f2e] font-black text-sm uppercase tracking-wider shadow-[0_5px_0_#115e59,0_10px_20px_rgba(45,212,191,0.5)] active:translate-y-1 active:shadow-none transition-all mt-2"
            >
              Войти на Арену
            </button>
          </div>
        )}

        {/* ================= SCREEN P18 / ACADEMY VIEW ================= */}
        {!isSplash && (pageId === "P18" || pageId === "P19" || nav === "academy") && (
          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1e2a44]">
              <span className="text-xs font-black text-[#2dd4bf] uppercase tracking-wider">
                АКАДЕМИЯ СВЕЧЕЙ-КЛИНКОВ
              </span>
              <span className="text-[10px] text-slate-400 font-bold">12 / 40 УРОКОВ</span>
            </div>

            <div className="flex flex-col gap-2 my-auto">
              {[
                { name: "Чтение графика", progress: "3 / 4", color: "bg-[#2E7F5C]", w: "75%" },
                { name: "Контекст рынка", progress: "1 / 4", color: "bg-[#D0B24A]", w: "25%" },
                { name: "Управление риском", progress: "0 / 4", color: "bg-[#4C6180]", w: "0%" },
                { name: "Психология трейдера", progress: "0 / 4", color: "bg-[#C56861]", w: "0%" },
              ].map((t) => (
                <div key={t.name} className="p-2.5 rounded-[14px] bg-[#141f36] border border-[#223356] flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-white">
                    <span>{t.name}</span>
                    <span className="text-slate-400">{t.progress}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0d1424] overflow-hidden">
                    <div style={{ width: t.w }} className={`h-full rounded-full ${t.color}`} />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => go("P20")}
              className="w-full py-3 rounded-[16px] bg-[#2dd4bf] text-[#042f2e] font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#0f766e] active:translate-y-1 active:shadow-none"
            >
              Пройти квиз (P20) →
            </button>
          </div>
        )}

        {/* ================= SCREEN P20: QUIZ VIEW ================= */}
        {!isSplash && pageId === "P20" && (
          <div className="flex-1 flex flex-col justify-between py-1 text-left">
            <span className="text-xs font-black uppercase text-[#2dd4bf] pb-1 border-b border-[#1e2a44]">
              КВИЗ: ОБЪЁМ В ПРОБОЕ
            </span>
            <div className="p-3 rounded-[16px] bg-[#141f36] border border-[#223356] text-xs text-slate-200 leading-relaxed font-bold my-auto">
              Что говорит объём, если цена обновила максимум, а объём падает?
            </div>
            <div className="flex flex-col gap-2 my-auto">
              {[
                { text: "Покупателей меньше — рост слабеет", ok: true },
                { text: "Рынок набирает экспоненциальную силу", ok: false },
                { text: "Объём не имеет значения", ok: false },
              ].map((opt, i) => (
                <button
                  key={opt.text}
                  type="button"
                  onClick={() => {
                    haptic(opt.ok ? "success" : "warning");
                    sfx.tap();
                    setQuizAnswer(i);
                  }}
                  className={`p-3 rounded-[14px] text-xs font-bold text-left border transition-all ${
                    quizAnswer === i
                      ? opt.ok
                        ? "bg-[#143224] border-emerald-400 text-emerald-300"
                        : "bg-[#35191c] border-rose-400 text-rose-300"
                      : "bg-[#141f36] border-[#223356] text-slate-200"
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => go("P24")}
              className="w-full py-3 rounded-[16px] bg-[#2dd4bf] text-[#042f2e] font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#0f766e] active:translate-y-1"
            >
              Завершить квиз • На Арену →
            </button>
          </div>
        )}

        {/* ================= SCREEN P21: DECK COLLECTION (40 CARDS) ================= */}
        {!isSplash && (pageId === "P21" || nav === "deck") && (
          <div className="flex-1 min-h-0 flex flex-col justify-between py-1">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1e2a44]">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                КОЛОДА КАРТ НАВЫКОВ (40 КАРТ)
              </span>
              <span className="text-[10px] text-slate-400 font-bold">c01–c40</span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-5 gap-1.5 my-1 pr-1">
              {Array.from({ length: 40 }, (_, i) => {
                const id = cardId(i + 1);
                const grp = cardGroup(i + 1);
                const isUnlocked = i < 16;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      if (isUnlocked) {
                        haptic("select");
                        sfx.card();
                        setSelectedCardId(id);
                        go("P22");
                      }
                    }}
                    className={`aspect-[3/4] rounded-[12px] p-1 flex flex-col items-center justify-between border ${
                      isUnlocked ? "hover:scale-105 active:scale-95 transition-transform" : "opacity-40 grayscale"
                    }`}
                    style={{
                      backgroundColor: isUnlocked ? CARD_COLORS[grp] : "#334155",
                      borderColor: isUnlocked ? "rgba(255,255,255,0.4)" : "#1e293b",
                    }}
                  >
                    <SkillIcon id={id} className="w-6 h-6" />
                    <span className="text-[7.5px] font-black text-white truncate max-w-full">
                      {CARD_NAMES[id]}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => go("P24")}
              className="w-full py-2.5 rounded-[16px] bg-[#2dd4bf] text-[#042f2e] font-black text-xs uppercase tracking-wider"
            >
              Вернуться на Арену →
            </button>
          </div>
        )}

        {/* ================= SCREEN P22: CARD DETAILS ================= */}
        {!isSplash && pageId === "P22" && (
          <div className="flex-1 flex flex-col justify-between py-2 text-center">
            <span className="text-xs font-black uppercase text-[#38bdf8]">КАРТА НАВЫКА • {selectedCardId}</span>
            <div className="w-32 h-44 mx-auto rounded-[20px] bg-gradient-to-b from-[#38bdf8] to-[#0284c7] border-2 border-white shadow-[0_0_30px_rgba(56,189,248,0.5)] flex flex-col items-center justify-around p-3 my-auto">
              <span className="text-white text-xs font-black">{selectedCardId}</span>
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                <SkillIcon id={selectedCardId} className="w-10 h-10 text-[#0284c7]" />
              </div>
              <span className="text-white text-xs font-black tracking-wide">
                {CARD_NAMES[selectedCardId] ?? "КАРТА"}
              </span>
            </div>
            <p className="text-xs text-slate-300 px-3">
              Активируй эту карту навыка на Арене, чтобы подсветить ключевые уровни рынка до принятия решения!
            </p>
            <button
              type="button"
              onClick={() => go("P24")}
              className="w-full py-3 rounded-[16px] bg-[#2dd4bf] text-[#042f2e] font-black text-xs uppercase tracking-wider"
            >
              Взять в бой на Арену →
            </button>
          </div>
        )}

        {/* ================= SCREEN P07 / P27: SCORE SCREEN ================= */}
        {!isSplash && (pageId === "P07" || pageId === "P27") && (
          <div className="flex-1 flex flex-col justify-between text-center py-2">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-[20px] bg-gradient-to-b from-[#fde047] via-[#eab308] to-[#ca8a04] border-2 border-white flex items-center justify-center font-black text-3xl text-amber-950 shadow-[0_0_24px_rgba(250,204,21,0.6)] mb-2">
                S
              </div>
              <h2 className="text-xl font-black text-white tracking-wide">ОЦЕНКА ЗАХОДА</h2>
              <span className="text-xs text-emerald-400 font-bold">+120 XP • +250 Монет</span>
            </div>

            <div className="p-3 rounded-[18px] bg-[#141f36] border border-[#223356] flex flex-col gap-2.5 text-left text-xs font-bold my-auto">
              {[
                { name: "Направление", score: "100 / 100", bar: "100%", color: "bg-emerald-400" },
                { name: "Тайминг точки t0", score: "90 / 100", bar: "90%", color: "bg-[#38bdf8]" },
                { name: "Обоснование процесса", score: "85 / 100", bar: "85%", color: "bg-amber-400" },
                { name: "Управление риском", score: "95 / 100", bar: "95%", color: "bg-[#8b5cf6]" },
              ].map((s) => (
                <div key={s.name} className="flex flex-col gap-1">
                  <div className="flex justify-between text-slate-300 text-[11px]">
                    <span>{s.name}</span>
                    <span className="text-white font-black">{s.score}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0d1424] overflow-hidden">
                    <div style={{ width: s.bar }} className={`h-full rounded-full ${s.color}`} />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => go("P24")}
              className="w-full py-3 rounded-[16px] bg-gradient-to-b from-[#2dd4bf] to-[#0f766e] text-[#042f2e] font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#115e59] active:translate-y-1 active:shadow-none"
            >
              Следующий сценарий (P24) →
            </button>
          </div>
        )}

        {/* ================= SCREEN P29: PROFILE VIEW ================= */}
        {!isSplash && (pageId === "P29" || nav === "more") && pageId !== "P30" && pageId !== "P31" && (
          <div className="flex-1 flex flex-col justify-between py-2 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#2dd4bf] via-[#38bdf8] to-[#8b5cf6] mb-2 shadow-[0_0_20px_rgba(45,212,191,0.4)]">
                <div className="w-full h-full rounded-full bg-[#111a2e] flex items-center justify-center overflow-hidden">
                  <img src="/images/hero-profile.jpg" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              <h2 className="text-lg font-black text-white">КРИПТО-РЫЦАРЬ</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>LVL 3</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <IconFlame className="w-3.5 h-3.5" /> Серия 4
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">Точность 68%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 my-auto">
              {[
                { label: "ЗАХОДОВ", val: "14" },
                { label: "ТОЧНОСТЬ", val: "68%" },
                { label: "КАРТ В БОЮ", val: "16 / 40" },
              ].map((s) => (
                <div key={s.label} className="p-2.5 rounded-[14px] bg-[#141f36] border border-[#223356]">
                  <span className="text-sm font-black text-white block">{s.val}</span>
                  <span className="text-[9px] font-bold text-[#64748b]">{s.label}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => go("P24")}
              className="w-full py-3 rounded-[16px] bg-[#2dd4bf] text-[#042f2e] font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#0f766e] active:translate-y-1"
            >
              Вернуться на Арену →
            </button>
          </div>
        )}

        {/* ================= SCREEN P30: SETTINGS ================= */}
        {!isSplash && pageId === "P30" && (
          <div className="flex-1 flex flex-col justify-between py-2 text-left">
            <span className="text-xs font-black uppercase text-[#38bdf8] pb-1 border-b border-[#1e2a44]">
              НАСТРОЙКИ СИСТЕМЫ
            </span>
            <div className="flex flex-col gap-2 my-auto text-xs font-bold">
              {[
                { name: "Звуковые эффекты (WebAudio)", on: true },
                { name: "Тактильная отдача (Haptic)", on: true },
                { name: "Свечи-клинки (Neon Glow)", on: true },
                { name: "Подсказки в заходе", on: true },
              ].map((s) => (
                <div key={s.name} className="flex justify-between items-center p-3 rounded-[12px] bg-[#141f36] border border-[#223356]">
                  <span className="text-white">{s.name}</span>
                  <span className="text-emerald-400 font-black">ВКЛ</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => go("P24")}
              className="w-full py-3 rounded-[16px] bg-[#2dd4bf] text-[#042f2e] font-black text-xs uppercase tracking-wider"
            >
              Сохранить и вернуться →
            </button>
          </div>
        )}

        {/* ================= SCREEN P31: NOTIFICATIONS ================= */}
        {!isSplash && pageId === "P31" && (
          <div className="flex-1 flex flex-col justify-between py-2 text-left">
            <span className="text-xs font-black uppercase text-[#38bdf8] pb-1 border-b border-[#1e2a44]">
              ЦЕНТР УВЕДОМЛЕНИЙ
            </span>
            <div className="flex flex-col gap-2 my-auto text-xs">
              {[
                { title: "Попытка восстановлена", desc: "Энергия пополнена до 3/3", time: "2 мин назад" },
                { title: "Турнир Bull Run Blitz открыт", desc: "Призовой фонд 500 000 $SIG", time: "1 час назад" },
                { title: "Новая карта в Академии", desc: "Открыта тема «Управление риском»", time: "Вчера" },
              ].map((n) => (
                <div key={n.title} className="p-2.5 rounded-[12px] bg-[#141f36] border border-[#223356] flex flex-col gap-0.5">
                  <div className="flex justify-between font-bold text-white">
                    <span>{n.title}</span>
                    <span className="text-[10px] text-[#64748b]">{n.time}</span>
                  </div>
                  <span className="text-[11px] text-[#94a3b8]">{n.desc}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => go("P24")}
              className="w-full py-3 rounded-[16px] bg-[#2dd4bf] text-[#042f2e] font-black text-xs uppercase tracking-wider"
            >
              Прочитано • На Арену →
            </button>
          </div>
        )}

        {/* ================= SCREEN P32: EMPTY ATTEMPTS ================= */}
        {!isSplash && pageId === "P32" && (
          <div className="flex-1 flex flex-col justify-between py-2 text-center">
            <div className="my-auto flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-[#1e293b] border-2 border-slate-600 flex items-center justify-center">
                <IconLightning className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-black text-white">ПОПЫТКИ ЗАКОНЧИЛИСЬ</h2>
              <div className="text-2xl font-black text-[#facc15] font-mono tracking-wider">
                41:58
              </div>
              <p className="text-xs text-[#94a3b8] px-4 font-medium">
                Следующая попытка восстановится по таймеру. Или пройди урок в Академии, чтобы мгновенно получить +1!
              </p>
            </div>
            <button
              type="button"
              onClick={() => go("P18")}
              className="w-full py-3 rounded-[16px] bg-[#2dd4bf] text-[#042f2e] font-black text-xs uppercase tracking-wider"
            >
              Получить попытку в Академии →
            </button>
          </div>
        )}

        {/* ================= SCREEN P34: LEVEL UP CELEBRATION ================= */}
        {!isSplash && pageId === "P34" && (
          <div className="flex-1 flex flex-col justify-between py-2 text-center">
            <div className="my-auto flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-[22px] bg-gradient-to-b from-[#fde047] to-[#ca8a04] flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.6)]">
                <IconTrophy className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-wide">УРОВЕНЬ 4 ДОСТИГНУТ!</h2>
              <span className="text-sm font-bold text-emerald-400">+50 Монет • +1 Попытка • Тема «Риск»</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setBurst((b) => b + 1);
                go("P24");
              }}
              className="w-full py-3 rounded-[16px] bg-[#2dd4bf] text-[#042f2e] font-black text-xs uppercase tracking-wider"
            >
              Забрать награду и на Арену →
            </button>
          </div>
        )}

        {/* ================= MAIN DEFAULT SCREEN: P24 ARENA FULL TERMINAL ================= */}
        {/* Exact Layout from Screenshot 1, 2, 3: Speech bubble + TerminalCard + 4 Cards + 4 Actions */}
        {!isSplash &&
          pageId !== "P18" &&
          pageId !== "P19" &&
          pageId !== "P20" &&
          pageId !== "P21" &&
          pageId !== "P22" &&
          pageId !== "P07" &&
          pageId !== "P27" &&
          pageId !== "P29" &&
          pageId !== "P30" &&
          pageId !== "P31" &&
          pageId !== "P32" &&
          pageId !== "P34" && (
            <div className="flex-1 min-h-0 flex flex-col justify-between gap-1.5">
              {/* 1. Coach / Wisdom Speech Bubble (Turquoise on dark blue with hand-drawn smiley, NO STICKER) */}
              <div
                onClick={() => {
                  haptic("tap");
                  setWisdomMode(!wisdomMode);
                  setCoachQuote(
                    wisdomMode
                      ? "Пробой без объёма. Объём молчит."
                      : "IF YOU'RE HERE JUST FOR MONEY, YOU'RE EARLY. AND THAT'S BAD."
                  );
                }}
                className="w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-[16px] bg-[#141f36]/90 border border-[#2dd4bf]/40 shadow-sm cursor-pointer active:scale-[0.98] transition-transform shrink-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-[#0d2a2d] border border-[#2dd4bf]/50 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-[#2dd4bf]">
                      <path
                        d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V10C14 11.1046 13.1046 12 12 12H5L2 14V4Z"
                        fill="currentColor"
                      />
                      <circle cx="5" cy="7" r="1" fill="#0d1424" />
                      <circle cx="8" cy="7" r="1" fill="#0d1424" />
                      <circle cx="11" cy="7" r="1" fill="#0d1424" />
                    </svg>
                  </div>
                  <span
                    className="text-[11.5px] font-['Permanent_Marker',sans-serif] text-[#2dd4bf] leading-snug tracking-wide truncate"
                    style={{ textShadow: "0 0 8px rgba(45,212,191,0.45)" }}
                  >
                    {coachQuote}
                  </span>
                </div>
                <HanddrawnSmiley className="w-5 h-5 text-[#2dd4bf]" color="#2dd4bf" />
              </div>

              {/* 2. macOS Terminal Window (Candles / News / Depth / Whale / Tournaments / Chat) */}
              <div className="flex-1 min-h-0 flex flex-col">
                <TerminalCard
                  initialTab={tab}
                  revealed={revealed}
                  timeframe={timeframe}
                  onTimeframeChange={setTimeframe}
                  onTargetClick={() => {
                    haptic("success");
                    sfx.hit();
                    setCoachQuote("Целевой пробой зафиксирован! Проверь объём перед входом.");
                  }}
                />
              </div>

              {/* 3. 4 Skill Cards in a row (ТРЕНД, ОБЪЁМ, РИСК, ЖДАТЬ) */}
              <div className="shrink-0">
                <CasualSkillDeck
                  selectedId={selectedCardId}
                  onSelect={(id) => {
                    setSelectedCardId(id);
                    if (id === "c04") {
                      setTab("candles");
                      setCoachQuote("Карта «Объём»: сравни высоту свечи с объёмом внизу!");
                    } else if (id === "c01") {
                      setTab("candles");
                      setCoachQuote("Карта «Тренд»: восходящий тренд с локальными откатами.");
                    } else if (id === "c25") {
                      setTab("depth");
                      setCoachQuote("Карта «Риск»: защита депозита! Проверь китовую стену.");
                    } else if (id === "c33") {
                      setCoachQuote("Карта «Ждать»: не входи без подтверждения.");
                    }
                  }}
                />
              </div>

              {/* 4. 2x2 Action Buttons (Войти сразу, Ждать ретест и объём, Старшие таймфреймы, Увеличить позицию) */}
              <div className="shrink-0">
                <CasualActionGrid
                  selectedAction={selectedAction}
                  onEnterNow={() => handleDecision("enter")}
                  onWaitRetest={() => handleDecision("wait")}
                  onHigherTimeframe={() => handleDecision("htf")}
                  onScalePosition={() => handleDecision("scale")}
                />
              </div>
            </div>
          )}
      </div>

      {/* 5. BOTTOM DOCK NAVBAR (Академия, Арена, Коллекция, Ещё) */}
      {!isSplash && (
        <CasualBottomNav
          activeTab={nav}
          onTabChange={(t) => {
            setNav(t);
            if (t === "arena") go("P24");
            else if (t === "academy") go("P18");
            else if (t === "deck") go("P21");
            else if (t === "more") go("P29");
          }}
        />
      )}
    </div>
  );
}
