import { useState } from "react";
import { CasualTopBar } from "./CasualTopBar";
import { TerminalCard, type TerminalTab } from "./TerminalCard";
import { CasualSkillDeck } from "./CasualSkillDeck";
import { CasualActionGrid } from "./CasualActionGrid";
import { CasualBottomNav, type NavTabId } from "./CasualBottomNav";
import { IconSmiley, IconCheck } from "./StudioIcons";
import { RepoSkillIcon } from "./RepoAssets";
import { useAssets } from "./AssetContext";
import { Confetti } from "./Confetti";
import { RevealPanel } from "./RevealPanel";
import { haptic, sfx, setSoundEnabled, setHapticEnabled } from "../lib/feel";
import { CARD_COLORS, CARD_NAMES, cardGroup, cardId } from "../data/pages";

export function CasualArenaScreen({
  onOpenWorkbench,
}: {
  onOpenWorkbench?: () => void;
}) {
  const assets = useAssets();
  const [navTab, setNavTab] = useState<NavTabId>("arena");
  const [terminalTab, setTerminalTab] = useState<TerminalTab>("candles");
  const [selectedCardId, setSelectedCardId] = useState<string>("c17");
  const [selectedAction, setSelectedAction] = useState<string>("wait");
  const [coachQuote, setCoachQuote] = useState<string>("Пробой без объёма. Объём молчит — собери факты до решения.");
  const [revealed, setRevealed] = useState<boolean>(false);
  const [burstCount, setBurstCount] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [verdict, setVerdict] = useState<"none" | "wait" | "notrade" | "wrong">("none");
  const [xp, setXp] = useState<number>(680);
  const [coins, setCoins] = useState<number>(1240);
  const [attempts, setAttempts] = useState<number>(3);
  const [stars, setStars] = useState<number>(24);
  const [hasNotif, setHasNotif] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<"15M" | "1Ч" | "1Д">("15M");
  const [soundOn, setSoundOn] = useState(true);
  const [hapticOn, setHapticOn] = useState(true);
  const [doneLessons, setDoneLessons] = useState<number[]>([0, 1]);

  // --- MVP-правила состояния захода ---
  const [facts, setFacts] = useState<boolean>(false); // c25 evidence_only / c28 no_confirmation_no_trade
  const [planOpen, setPlanOpen] = useState<boolean>(false); // c18/c19/c20/c21/c22 план сделки
  const [planDefined, setPlanDefined] = useState<boolean>(false);
  const [noAttemptsOpen, setNoAttemptsOpen] = useState<boolean>(false);
  const [tutStep, setTutStep] = useState<number>(() => {
    try {
      return localStorage.getItem("sa_tut_done") === "1" ? 5 : 0;
    } catch {
      return 0;
    }
  });
  // Стадии раскрытия после Seal: time-scrub → ключевое событие → оценка → разбор
  const [revealStage, setRevealStage] = useState<"none" | "scrub" | "event" | "score" | "debrief">("none");
  const [rewarded, setRewarded] = useState<boolean>(false);
  const [missHint, setMissHint] = useState<number>(0);

  // Каждый третий раунд — незнакомый актив: незнание не штрафуется (c32/c33).
  const unknownAsset = round % 3 === 0;
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const advanceTut = (s: number) => {
    setTutStep(s);
    if (s >= 5) {
      try {
        localStorage.setItem("sa_tut_done", "1");
      } catch {
        /* приватный режим */
      }
    }
  };

  // Факт собран (тап по подсвеченной свече-пробою)
  const collectFact = () => {
    if (tutStep < 1 && tutStep !== 5) {
      setCoachQuote("Сначала нажми «Понятно» на карточке урока — один шаг за раз.");
      haptic("light");
      return;
    }
    if (!facts) {
      setFacts(true);
      haptic("success");
      sfx.hit();
      setCoachQuote("Факт зафиксирован: пробой есть, но объём не подтверждён. Теперь выбери обоснование.");
      if (tutStep === 1) advanceTut(2);
    } else {
      haptic("success");
      sfx.hit();
      setCoachQuote("Целевой пробой уже отмечен. Факт — это твоё обоснование, переходи к решению.");
    }
  };

  // Тап мимо цели: мягкая подсказка, попытка не тратится, можно повторить
  const chartMiss = () => {
    if (revealed) return;
    if (facts) return;
    setMissHint((n) => n + 1);
    haptic("light");
    sfx.tap();
    setCoachQuote(
      missHint === 0
        ? "Не сюда. Ищи подсвеченную пульсирующую свечу-пробой с прицелом — это зона падения."
        : "Посмотри на свечу, обведённую кольцом. Нажми точно на неё. Попытка за промах не тратится.",
    );
  };

  const nextRound = () => {
    haptic("select");
    sfx.select();
    setRevealed(false);
    setRevealStage("none");
    setVerdict("none");
    setFacts(false);
    setPlanDefined(false);
    setPlanOpen(false);
    setRewarded(false);
    setSelectedAction("wait");
    const next = round + 1;
    setRound(next);
    setTerminalTab("candles");
    setCoachQuote(
      next % 3 === 0
        ? `Раунд ${next}: незнакомый актив. Не уверен — пропускай без штрафа (c32).`
        : `Раунд ${next}: новый исторический сценарий. Сначала факт — потом решение.`,
    );
  };

  // Фиксация решения: единая точка Seal + запуск стадий раскрытия
  const seal = (action: "enter" | "wait" | "notrade") => {
    haptic("success");
    sfx.seal();
    setAttempts((a) => Math.max(0, a - 1));
    setRevealed(true);
    setRevealStage("scrub");
    setPlanOpen(false);
    setRewarded(false);
    if (tutStep === 3) advanceTut(4);

    if (action === "wait") {
      setVerdict("wait");
      setCoachQuote("Решение запечатано: ждём ретест и подтверждение объёмом (c17).");
    } else if (action === "notrade") {
      setVerdict("notrade");
      setCoachQuote(
        unknownAsset
          ? "Решение запечатано: незнакомый актив — пропуск без штрафа (c32)."
          : "Решение запечатано: нет подтверждения — нет сделки (c24).",
      );
    } else {
      setVerdict("wrong");
      setCoachQuote("План с инвалидацией зафиксирован. Смотрим, что было дальше.");
    }
    setTerminalTab("candles");

    // time-scrub: в reduced-motion сразу к событию, иначе короткая перемотка
    window.setTimeout(
      () => setRevealStage("event"),
      prefersReducedMotion ? 120 : 1100,
    );
  };

  // Решение игрока:
  // htf — разведка, НЕ Seal; enter — факт+план; wait/notrade — Seal; reveal — только через панель раскрытия
  const handleDecision = (action: string) => {
    setSelectedAction(action);

    if (revealed) return; // во время раскрытия кнопки решений не действуют

    // --- Разведка: старший таймфрейм, без Seal ---
    if (action === "htf") {
      haptic("light");
      sfx.select();
      setTerminalTab("candles");
      setTimeframe("1Ч");
      setCoachQuote("Разведка 1Ч: медвежья дивергенция. Попытка не потрачена — это не сделка.");
      return;
    }

    // --- Вход: сначала факт (обоснование), затем план с инвалидацией ---
    if (action === "enter") {
      if (attempts === 0) {
        setNoAttemptsOpen(true);
        haptic("warning");
        return;
      }
      if (!facts) {
        haptic("warning");
        sfx.miss();
        setCoachQuote("Нельзя Seal без факта (c25). Нажми подсвеченную свечу-пробой — это обоснование.");
        return;
      }
      if (unknownAsset) {
        // Незнакомая тема не штрафуется: мягко уводим в пропуск, попытку не трогаем
        haptic("warning");
        setCoachQuote("Тема незнакома — вход не засчитывается и не штрафует (c33). Лучше выбери «Без сделки» или изучи урок.");
        return;
      }
      if (!planDefined) {
        setPlanOpen(true);
        haptic("select");
        sfx.select();
        return;
      }
      seal("enter");
      return;
    }

    if (attempts === 0) {
      setNoAttemptsOpen(true);
      haptic("warning");
      return;
    }
    if (action === "wait") seal("wait");
    else if (action === "notrade") seal("notrade");
  };

  const confirmPlan = () => {
    setPlanDefined(true);
    setPlanOpen(false);
    seal("enter");
  };

  // Движение по стадиям раскрытия после нажатия CTA
  const advanceReveal = () => {
    haptic("select");
    if (revealStage === "event") {
      setRevealStage("score");
      sfx.hit();
      if (!rewarded) {
        setRewarded(true);
        // --- Оценка ПРОЦЕССА, а не только результата ---
        const sFact = facts ? 1 : 0;
        const sPlan = planDefined ? 1 : 0;
        const sDiscipline = verdict === "wrong" ? 0 : 1;
        const total = sFact + sPlan + sDiscipline;
        setStars((s) => s + total);
        setCoins((c) => c + (verdict === "wait" ? 250 : 120) * Math.max(1, total));
        setXp((x) => Math.min(1000, x + 60 + total * 30));
        if (verdict === "wait" && !prefersReducedMotion) setBurstCount((b) => b + 1);
        if (verdict === "wait") sfx.win();
      }
    } else if (revealStage === "score") {
      setRevealStage("debrief"); // баннер завершения покажется на экране разбора
    } else if (revealStage === "debrief") {
      if (tutStep === 4) advanceTut(5);
      nextRound();
    }
  };

  // Сводка оценки процесса для экрана score
  const scoreRows: { label: string; ok: boolean; note: string }[] = [
    { label: "Факт до решения (c25)", ok: facts, note: facts ? "обоснование собрано" : "Seal без факта" },
    { label: "План и инвалидация (c19)", ok: planDefined, note: planDefined ? "стоп и R≥2 заданы" : "план не оформлен" },
    {
      label: "Дисциплина решения",
      ok: verdict !== "wrong",
      note: verdict === "wait" ? "ожидание ретеста" : verdict === "notrade" ? "пропуск без сигнала" : "вход без подтверждения",
    },
  ];

  return (
    <div className="w-full h-full bg-[#0d1424] flex flex-col overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[320px] h-[320px] rounded-full bg-[#2dd4bf]/10 blur-[80px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[280px] h-[280px] rounded-full bg-[#8b7bff]/10 blur-[90px]" />
      </div>

      {/* Confetti Burst on Reward / Win */}
      <Confetti run={burstCount} burst={60} origin="top" />

      {/* 1. TOP BAR */}
      <CasualTopBar
        lvl={7}
        xp={xp}
        xpMax={1000}
        attempts={attempts}
        attemptsMax={5}
        stars={stars}
        coins={coins}
        hasNotif={hasNotif}
        onAttemptsClick={() => {
          setCoachQuote(
            attempts === 0
              ? "Попытки кончились. Восстановление — 40 минут, или обменяй 120 монет."
              : `Осталось попыток: ${attempts} из 5.`,
          );
        }}
        onNotifClick={() => {
          setHasNotif(false);
          setCoachQuote("Уведомление: началась новая лига трейдеров!");
        }}
        onSettingsClick={onOpenWorkbench}
      />

      {/* Состояние загрузки/ошибки ассетов: причина + retry, без тупика */}
      {assets.status === "loading" && (
        <div className="z-20 mx-3 mt-2 rounded-[12px] bg-[#0f2e2e] border border-[#2dd4bf]/40 px-3 py-1.5 text-[10.5px] font-bold text-[#5eead4] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#5eead4] animate-pulse" />
          Загружаем карты и иконки захода…
        </div>
      )}
      {assets.status === "error" && (
        <button
          onClick={() => location.reload()}
          className="z-20 mx-3 mt-2 min-h-[40px] rounded-[12px] bg-[#3a1d24] border border-[#C56861]/60 px-3 text-left text-[10.5px] font-bold text-[#ffb9b3] active:scale-[.99]"
        >
          Часть ассетов не загрузилась (ASSET_ARCHIVE_NOT_EXTRACTED) · нажми, чтобы повторить
        </button>
      )}

      {/* MAIN GAMEPLAY CONTENT CONTAINER */}
      <div className="flex-1 min-h-0 flex flex-col justify-between gap-2 px-3.5 py-2 z-10 overflow-hidden">
        {/* 2. COACH / NARRATOR SPEECH BUBBLE (Exact from reference screens) */}
        <div className="w-full flex items-center gap-2.5 px-3 py-3 rounded-[16px] sticky-note handwritten shadow-[0_4px_14px_rgba(0,0,0,0.35)] rotate-[-0.5deg]">
          <div className="w-6 h-6 rounded-full bg-[#0f2e2e] border border-[#2dd4bf]/40 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(45,212,191,0.4)]">
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-[#2dd4bf]">
              <path d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V10C14 11.1046 13.1046 12 12 12H5L2 14V4Z" fill="currentColor" />
              <circle cx="5" cy="7" r="1" fill="#0d1424" />
              <circle cx="8" cy="7" r="1" fill="#0d1424" />
              <circle cx="11" cy="7" r="1" fill="#0d1424" />
            </svg>
          </div>
          <span className="flex-1 flex items-start gap-1.5">
            <span className="text-[13px] font-normal text-[#3e2b1a] leading-snug tracking-wide handwritten flex-1">
              {coachQuote}
            </span>
            <IconSmiley className="w-[18px] h-[18px] shrink-0 text-[#3e2b1a] opacity-80 mt-0.5" />
          </span>
          <span className="mono shrink-0 self-start text-[9px] font-bold bg-[#0f2e2e] text-[#5eead4] border border-[#2dd4bf]/40 rounded-full px-1.5 py-0.5">
            #{round}
          </span>
        </div>

        {/* Онбординг: карточка урока — одна мысль, один объект, одно действие, одна CTA */}
        {tutStep < 5 && navTab === "arena" && !revealed && (
          <div className="rounded-[14px] border border-[#2dd4bf]/50 bg-[#0f2e2e]/90 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#5eead4]/80">
                Заход 1 · Читаем график
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-[#5eead4]">{Math.min(tutStep + 1, 4)}/4</span>
                <span className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i <= Math.min(tutStep, 3) ? "#5eead4" : "#22444a" }} />
                  ))}
                </span>
              </span>
            </div>
            <p className="text-[11.5px] text-[#c8f5ec] leading-snug mt-1">
              {[
                "График обрывается на отметке t0. Будущее закрыто — ты видишь только прошлое.",
                "Нажми на пульсирующую свечу с прицелом — это зона слома. Промах попытку не тратит.",
                "Выбери карту «Ждать» (c17) — она станет обоснованием твоего решения.",
                "Сигнала на вход нет. Верный ход — «Ждать ретест и объём» или «Без сделки».",
              ][Math.min(tutStep, 3)]}
            </p>
            {tutStep === 0 && (
              <button
                onClick={() => advanceTut(1)}
                className="mt-1.5 min-h-[40px] w-full rounded-[10px] bg-[#2dd4bf] text-[#042f2c] text-[12px] font-black active:scale-[.98]"
              >
                Понятно, дальше
              </button>
            )}
            {tutStep === 1 && <div className="mt-1 text-[10px] font-bold text-[#5eead4]/90">Действие: коснись подсвеченной свечи на графике</div>}
            {tutStep === 2 && <div className="mt-1 text-[10px] font-bold text-[#5eead4]/90">Действие: выбери карту «Ждать» в колоде ниже</div>}
            {tutStep === 3 && <div className="mt-1 text-[10px] font-bold text-[#5eead4]/90">Действие: нажми «Ждать ретест и объём»</div>}
          </div>
        )}

        {/* 3. TERMINAL CARD (Graph / News / Depth / Whale / Tournaments) */}
        <div className="my-1 flex-1 min-h-0 flex flex-col">
          {navTab === "arena" && (
            <TerminalCard
              key={`round-${round}`}
              initialTab={terminalTab}
              revealed={revealed}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              onTargetClick={collectFact}
              onChartMiss={chartMiss}
              unfamiliar={unknownAsset && !revealed}
            />
          )}

          {/* ACADEMY VIEW (When Academy tab clicked) */}
          {navTab === "academy" && (
            <div className="w-full flex-1 min-h-0 rounded-[24px] bg-[#162036] border-[2px] border-[#253352] p-3 text-white flex flex-col gap-2.5 overflow-y-auto thin-scroll">
              <div className="flex items-center justify-between border-b border-[#22304d] pb-2">
                <span className="text-sm font-black text-[#2dd4bf] tracking-wide">АКАДЕМИЯ СВЕЧЕЙ-КЛИНКОВ</span>
                <span className="text-xs bg-[#1f2d47] px-2 py-0.5 rounded-full font-bold">12/40 УРОКОВ</span>
              </div>
              <div className="flex flex-col gap-2 max-h-[230px] overflow-y-auto pr-1 thin-scroll">
                {[
                  { title: "Импульс и форма свечи-клинка", xp: 80 },
                  { title: "Чтение китовой стены в стакане", xp: 100 },
                  { title: "Ложный пробой без подтверждения", xp: 120 },
                  { title: "Управление риском и стоп-лосс", xp: 150 },
                ].map((l, idx) => {
                  const ok = doneLessons.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        haptic("select");
                        sfx.select();
                        if (!ok) {
                          setDoneLessons((d) => [...d, idx]);
                          setXp((v) => v + l.xp);
                          setCoachQuote(`Урок пройден: +${l.xp} XP. Приём добавлен в колоду.`);
                        } else {
                          setCoachQuote(`Урок «${l.title}» уже пройден.`);
                        }
                      }}
                      className="min-h-[48px] flex items-center justify-between gap-2 p-2.5 rounded-[12px] bg-[#111a2e] border border-[#1e2a44] active:scale-[.99] transition-transform text-left"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black"
                          style={{ background: ok ? "#2E7F5C" : "#334155", color: ok ? "#fff" : "#94a3b8" }}
                        >
                          {ok ? <IconCheck className="w-3 h-3" /> : idx + 1}
                        </span>
                        <span className="text-[11.5px] font-bold text-slate-200 leading-tight">
                          {l.title}
                        </span>
                      </span>
                      <span
                        className="shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(208,178,74,.16)", color: "#E7D18C" }}
                      >
                        +{l.xp} XP
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* COLLECTION VIEW (All 40 Cards) */}
          {navTab === "deck" && (
            <div className="w-full flex-1 min-h-0 rounded-[24px] bg-[#162036] border-[2px] border-[#253352] p-3 text-white flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-[#22304d] pb-1.5 shrink-0">
                <span className="text-sm font-black text-[#E7D18C] tracking-wide">КОЛОДА КАРТ НАВЫКОВ</span>
                <span className="mono text-xs text-slate-400 font-bold">c01–c40</span>
              </div>
              <div className="grid grid-cols-5 gap-2 flex-1 min-h-0 overflow-y-auto pr-1 py-1 thin-scroll">
                {Array.from({ length: 40 }, (_, i) => {
                  const id = cardId(i + 1);
                  const isUnlocked = i < 16;
                  const active = selectedCardId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        if (isUnlocked) {
                          haptic("select");
                          sfx.card();
                          setSelectedCardId(id);
                          setCoachQuote(`Карта «${CARD_NAMES[id]}» активирована!`);
                        } else {
                          haptic("warning");
                          sfx.miss();
                          setCoachQuote("Этот приём ещё не открыт. Пройди урок в Академии.");
                        }
                      }}
                      className="min-h-[58px] rounded-[12px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
                      style={{
                        background: isUnlocked ? `${CARD_COLORS[cardGroup(i + 1)]}22` : "rgba(148,163,184,.08)",
                        border: active
                          ? "2px solid #5eead4"
                          : `1px solid ${isUnlocked ? "rgba(255,255,255,.22)" : "rgba(148,163,184,.18)"}`,
                        opacity: isUnlocked ? 1 : 0.55,
                      }}
                    >
                      <RepoSkillIcon id={id} size={34} />
                      <span className="mono text-[9px] font-bold text-slate-200 leading-none">{id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MORE / SETTINGS VIEW */}
          {navTab === "more" && (
            <div className="w-full flex-1 min-h-0 rounded-[24px] bg-[#162036] border-[2px] border-[#253352] p-3 text-white flex flex-col gap-2 overflow-y-auto thin-scroll">
              <span className="text-sm font-black text-[#5eead4] tracking-wide">СИСТЕМА И НАСТРОЙКИ</span>
              <div className="flex flex-col gap-1.5 text-xs font-bold">
                <Toggle
                  label="Звуковые эффекты (WebAudio)"
                  on={soundOn}
                  onToggle={() => {
                    const v = !soundOn;
                    setSoundOn(v);
                    setSoundEnabled(v);
                    if (v) sfx.tap();
                  }}
                />
                <Toggle
                  label="Тактильная отдача (Haptic)"
                  on={hapticOn}
                  onToggle={() => {
                    const v = !hapticOn;
                    setHapticOn(v);
                    setHapticEnabled(v);
                    if (!v) haptic("tap");
                  }}
                />
                <div className="flex justify-between items-center min-h-[44px] p-2.5 rounded-[10px] bg-[#111a2e]">
                  <span>Свечи-клинки · мотив бренда</span>
                  <span className="text-[10px] font-black px-2 py-1 rounded-full bg-[#2dd4bf]/15 text-[#5eead4]">
                    АКТИВНО
                  </span>
                </div>
                <button
                  onClick={onOpenWorkbench}
                  className="mt-1 min-h-[48px] w-full py-2 bg-[#25395c] rounded-[10px] border border-[#2dd4bf]/40 text-[#5eead4] font-black uppercase text-[11px] active:scale-[.99] transition-transform"
                >
                  Открыть Workbench · P01–P34
                </button>
              </div>
            </div>
          )}
        </div>

        {/* === Вкладка «Арена»: колода видна всегда; блок решений ↔ панель раскрытия === */}
        {navTab === "arena" && (
        <>
        <div className="my-1">
          <CasualSkillDeck
            selectedId={selectedCardId}
            hintId={tutStep === 2 ? "c17" : undefined}
            onSelect={(id) => {
              setSelectedCardId(id);
              if (tutStep === 2 && id === "c17") advanceTut(3);
              if (id === "c16") {
                setCoachQuote("c16 «Войти сейчас»: вход разрешён только после факта и плана с инвалидацией.");
              } else if (id === "c17") {
                setTerminalTab("candles");
                setCoachQuote("c17 «Ждать ретест»: дождись ретеста уровня и подтверждения объёмом.");
                if (tutStep === 2) advanceTut(3);
              } else if (id === "c02") {
                setCoachQuote("c02 «Старший ТФ»: это разведка, а не сделка — попытка не тратится.");
              } else if (id === "c24") {
                setCoachQuote("c24 «Без сделки»: отсутствие позиции — полноценное и часто лучшее решение.");
                if (tutStep === 2) advanceTut(3);
              }
            }}
          />
        </div>

        {/* 5. Блок решений (до Seal) ↔ панель раскрытия (после Seal) — одно и то же место */}
        <div className="my-1">
          {!revealed ? (
            <CasualActionGrid
              selectedAction={selectedAction}
              revealed={false}
              hintAction={tutStep === 3 ? "wait" : undefined}
              enterBlocked={!facts}
              onEnterNow={() => handleDecision("enter")}
              onWaitRetest={() => handleDecision("wait")}
              onHigherTimeframe={() => handleDecision("htf")}
              onNoTrade={() => handleDecision("notrade")}
            />
          ) : (
            <RevealPanel
              stage={revealStage === "none" ? "scrub" : revealStage}
              verdict={verdict === "none" ? "wrong" : verdict}
              scoreRows={scoreRows}
              unknownAsset={unknownAsset}
              tutorialDone={tutStep >= 5}
              onAdvance={advanceReveal}
            />
          )}
        </div>
        </>
        )}
      </div>

      {/* Модальное окно: план сделки с инвалидацией (c18–c22) */}
      {planOpen && (
        <div className="absolute inset-0 z-40 bg-black/60 flex items-end" onClick={() => setPlanOpen(false)}>
          <div
            className="w-full rounded-t-[22px] bg-[#162036] border-t-2 border-[#2dd4bf]/60 p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-black text-white">План сделки · до Seal</span>
              <span className="mono text-[10px] text-[#5eead4]">c18–c22</span>
            </div>
            {[
              ["c18 Зона входа", "$67 800 — лимит у ретеста"],
              ["c19 Инвалидация", "$67 400 — за структурным минимумом"],
              ["c20 Структурный стоп", "стоп-лосс за уровень, не по ощущению"],
              ["c21 Цель по ликвидности", "$68 300 — китовая ликвидность"],
              ["c22 R-кратность", "потенциал R ≥ 2"],
            ].map(([t, v]) => (
              <div key={t} className="flex items-center gap-2 py-1.5 border-b border-white/5">
                <IconCheck className="w-4 h-4 text-[#5eead4] shrink-0" />
                <span className="text-[12px] font-black text-white w-36 shrink-0">{t}</span>
                <span className="text-[11px] text-slate-300 text-right flex-1">{v}</span>
              </div>
            ))}
            <button
              onClick={confirmPlan}
              className="mt-3 w-full min-h-[48px] rounded-[14px] bg-gradient-to-b from-[#3f9c74] via-[#2E7F5C] to-[#226247] text-white text-[13px] font-black active:scale-[.99]"
            >
              Определить план и Seal
            </button>
            <button
              onClick={() => setPlanOpen(false)}
              className="mt-2 w-full min-h-[44px] rounded-[14px] bg-[#0d1424] text-slate-300 text-[12px] font-bold active:scale-[.99]"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Модальное окно: закончились попытки (P32 no-attempts state) */}
      {noAttemptsOpen && (
        <div className="absolute inset-0 z-40 bg-black/60 flex items-center px-6" onClick={() => setNoAttemptsOpen(false)}>
          <div
            className="w-full rounded-[20px] bg-[#162036] border-2 border-[#C56861]/60 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[13px] font-black text-[#ffb9b3]">Попытки закончились</span>
            <p className="text-[12px] text-slate-300 mt-1.5 leading-snug">
              Восстановление через 40 минут, либо обмен 120 монет на одну попытку. Это не проигрыш —
              пауза защищает от импульсивных сделок (c36).
            </p>
            <button
              onClick={() => {
                if (coins >= 120) {
                  setCoins((c) => c - 120);
                  setAttempts((a) => a + 1);
                  sfx.card();
                } else {
                  haptic("error");
                  sfx.miss();
                  setCoachQuote("Недостаточно монет для обмена. Загляни в Академию.");
                }
                setNoAttemptsOpen(false);
              }}
              className="mt-3 w-full min-h-[48px] rounded-[14px] bg-gradient-to-b from-[#e0c36a] via-[#D0B24A] to-[#a8892f] text-white text-[13px] font-black active:scale-[.99]"
            >
              Обменять 120 монет
            </button>
            <button
              onClick={() => {
                setNoAttemptsOpen(false);
                setNavTab("academy");
              }}
              className="mt-2 w-full min-h-[44px] rounded-[14px] bg-[#0d1424] text-[#5eead4] text-[12px] font-bold active:scale-[.99]"
            >
              Пройти урок в Академии
            </button>
          </div>
        </div>
      )}

      {/* 6. BOTTOM DOCK NAVBAR (Academy, Arena, Deck, More) */}
      <CasualBottomNav
        activeTab={navTab}
        onTabChange={(tab) => {
          setNavTab(tab);
          if (tab === "arena") {
            setCoachQuote("Ты на Арене! Анализируй исторический сценарий BTC/USDT.");
          }
        }}
      />
    </div>
  );
}

/** Доступный переключатель 48px высотой, без зависимости от hover. */
function Toggle({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="min-h-[48px] flex justify-between items-center gap-2 p-2.5 rounded-[10px] bg-[#111a2e] active:scale-[.99] transition-transform text-left"
      role="switch"
      aria-checked={on}
    >
      <span>{label}</span>
      <span
        className="relative w-11 h-6 rounded-full transition-colors shrink-0"
        style={{ background: on ? "#2E7F5C" : "#334155" }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
          style={{ left: on ? "22px" : "2px" }}
        />
      </span>
    </button>
  );
}
