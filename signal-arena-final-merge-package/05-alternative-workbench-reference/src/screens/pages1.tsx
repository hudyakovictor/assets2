import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { GButton, HandNote, Pips, Kicker } from "../components/ui";
import { CandleChart, type Candle } from "../components/CandleChart";
import { SkillIcon } from "../components/SkillIcon";
import { SKILLS, CARD_PALETTE, type SkillDef } from "../data/remoteAssets";
import type { PageDef, VariantDef } from "../data/pages";
import { MOTION_PRESETS } from "../data/pages";
import { ease, spring } from "../lib/motion";
import { feel, sfx } from "../lib/feedback";
import { useAsset } from "../lib/assetCtx";
import { Emblem, ICheck, ISeal, IFF, IHand, IBook, ITarget, ILock, IStarLine, IBoltLine, IChevR } from "../components/RepoIcons";
import { IconStar } from "../components/RepoIcons";

/* ============================================================ shared */
const skill = (id: string) => SKILLS.find((s) => s.id === id)!;

export const BG = ({ v }: { v: VariantDef }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {v.pattern === "grid" && (
      <div className="absolute inset-0" style={{ background: "linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
    )}
    {v.pattern === "dots" && (
      <div className="absolute inset-0" style={{ background: "radial-gradient(rgba(255,255,255,.05) 1px, transparent 1.4px)", backgroundSize: "20px 20px" }} />
    )}
    {v.pattern === "waves" && (
      <div className="absolute inset-0 opacity-[0.05]" style={{ background: `repeating-linear-gradient(-8deg, transparent 0 26px, ${v.glow} 26px 27px)` }} />
    )}
    {v.pattern === "hex" && (
      <div className="absolute inset-0 opacity-[0.05]" style={{ background: `repeating-linear-gradient(60deg, transparent 0 30px, ${v.glow} 30px 31px), repeating-linear-gradient(-60deg, transparent 0 30px, ${v.glow} 30px 31px)` }} />
    )}
    <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl" style={{ background: v.glowSoft }} />
  </div>
);

export const Frame = ({ page, v, children }: { page: PageDef; v: VariantDef; children: React.ReactNode }) => (
  <div className="game-root relative flex h-full flex-col overflow-hidden bg-bg">
    <BG v={v} />
    <div className="noise pointer-events-none absolute inset-0" />
    {page.topbar && (
      <div style={useAsset().st("topbar")}>
        <TopBar />
      </div>
    )}
    <div className={`relative z-10 flex min-h-0 flex-1 flex-col ${page.hasScroll ? "no-scrollbar overflow-y-auto" : "overflow-hidden"} px-3.5 pb-3`}>
      {children}
    </div>
  </div>
);

const usePres = (v: VariantDef) => MOTION_PRESETS[v.motion];

/* typed coach bubble */
export const Coach = ({ text, v, sub }: { text: string; v: VariantDef; sub?: string }) => {
  const pres = usePres(v);
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const t = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, 14);
    return () => clearInterval(t);
  }, [text]);
  return (
    <motion.div
      className="relative flex items-center gap-2.5 rounded-[18px] border border-line bg-panel px-3.5 py-2.5"
      style={{ boxShadow: "0 8px 24px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.05)" }}
      initial={{ opacity: 0, y: -10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={pres}
    >
      <motion.span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: `${v.glow}1f`, boxShadow: `inset 0 0 0 1.5px ${v.glow}66` }}
        animate={{ rotate: [0, -8, 6, 0] }}
        transition={{ duration: 0.7, delay: 0.4, repeat: Infinity, repeatDelay: 2.4 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={v.glow} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H10l-5 4v-4H6.5A2.5 2.5 0 0 1 4 12.5z" />
        </svg>
      </motion.span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-bold leading-snug text-ink">
          {out}
          {out.length < text.length && <span className="caret" />}
        </div>
        {sub && <div className="text-[10.5px] font-semibold leading-snug text-ink3">{sub}</div>}
      </div>
    </motion.div>
  );
};

/* skill card — repo palette, white hybrid icon */
export const SkillCardV = ({
  s,
  state = "open",
  selected,
  onTap,
  size = "md",
}: {
  s: SkillDef;
  state?: "open" | "new" | "locked";
  selected?: boolean;
  onTap?: () => void;
  size?: "sm" | "md";
}) => {
  const c = CARD_PALETTE[s.group].color;
  const pres = spring.soft;
  return (
    <motion.button
      className="relative flex w-full flex-col items-center rounded-[18px] border-2 pb-2.5 pt-3"
      style={{
        background: `linear-gradient(180deg, ${c} 0%, ${c} 55%, ${c} 100%)`,
        backgroundBlendMode: "normal",
        borderColor: selected ? "#ffffff" : "rgba(255,255,255,.32)",
        boxShadow: selected
          ? `0 0 0 2px rgba(255,255,255,.5), 0 12px 26px ${c}88, inset 0 2px 0 rgba(255,255,255,.35)`
          : `0 5px 0 rgba(0,0,0,.32), 0 12px 22px rgba(0,0,0,.35), inset 0 2px 0 rgba(255,255,255,.3)`,
        filter: state === "locked" ? "grayscale(.75) brightness(.72)" : "none",
        aspectRatio: "1 / 1.16",
      }}
      animate={selected ? { y: -8, scale: 1.05 } : { y: 0, scale: 1 }}
      whileTap={{ y: 4, scale: 0.96, boxShadow: `0 1px 0 rgba(0,0,0,.3), inset 0 2px 0 rgba(255,255,255,.3)` }}
      transition={pres}
      onTap={() => {
        if (state === "locked") {
          sfx.lock();
          feel.deny();
          return;
        }
        feel.tap();
        onTap?.();
      }}
    >
      <span
        className="glossy absolute inset-0 rounded-[16px]"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,.34), rgba(255,255,255,.05) 40%, rgba(0,0,0,.18))" }}
      />
      {state === "new" && (
        <span className="absolute -right-0.5 -top-0.5 z-10 flex h-6 w-9 items-center overflow-hidden rounded-bl-[10px] rounded-tr-[16px] bg-[#d0b24a]" style={{ boxShadow: "0 2px 0 #7a5f1c" }}>
          <span className="ml-1 text-[8px] font-extrabold tracking-wider text-[#2e2405]">NEW</span>
        </span>
      )}
      <motion.span
        className="relative z-[1] mt-1 flex items-center justify-center rounded-full"
        style={{ width: size === "sm" ? 42 : 52, aspectRatio: "1", border: "2.5px solid rgba(255,255,255,.92)", background: "rgba(255,255,255,.1)", color: "#fff" }}
        animate={selected ? { rotate: [0, -8, 8, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <SkillIcon skill={s} size={size === "sm" ? 28 : 34} />
      </motion.span>
      <span
        className="relative z-[1] mt-auto max-w-full truncate rounded-[7px] bg-white/95 px-1.5 py-[3px] text-[8.5px] font-extrabold uppercase tracking-wide text-[#14213a]"
        style={{ boxShadow: "0 2px 0 rgba(0,0,0,.18)" }}
      >
        {s.label}
      </span>
      {state === "locked" && (
        <span className="absolute inset-0 z-[2] flex items-center justify-center rounded-[16px] bg-[#0a1120]/35">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a1120]/75">
            <ILock size={18} color="#eaf2ff" />
          </span>
        </span>
      )}
    </motion.button>
  );
};

/* decision action button (arena 4 actions) */
const DECISIONS: { id: string; label: string; sub: string; grad: [string, string]; edge: string; icon: "enter" | "wait" | "htf" | "risk" }[] = [
  { id: "enter", label: "Войти сейчас", sub: "t0 · рыночный ордер", grad: ["#4bc27f", "#2b8a54"], edge: "#1c6139", icon: "enter" },
  { id: "wait", label: "Ждать ретест и объём", sub: "подтверждение уровня", grad: ["#3fb5a8", "#257e74"], edge: "#185c54", icon: "wait" },
  { id: "htf", label: "Старшие таймфреймы", sub: "сначала контекст", grad: ["#566c8c", "#37475f"], edge: "#25324a", icon: "htf" },
  { id: "risk", label: "Увеличить позицию", sub: "риск ×2", grad: ["#e8837a", "#c56861"], edge: "#8f362c", icon: "risk" },
];

const DecIcon = ({ k, color = "#fff" }: { k: string; color?: string }) => {
  const st = { stroke: color, strokeWidth: 2.2, fill: "none" as const, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (k) {
    case "enter":
      return (<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...st} /><path d="M12 16V7M8.5 10.5 12 7l3.5 3.5" {...st} /></svg>);
    case "wait":
      return (<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...st} /><path d="M12 7.5v4.5l3 2" {...st} /></svg>);
    case "htf":
      return (<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...st} /><rect x="7.5" y="11" width="2.6" height="5" rx="0.7" fill={color} stroke="none" /><rect x="11" y="8" width="2.6" height="8" rx="0.7" fill={color} stroke="none" /><rect x="14.5" y="10" width="2.6" height="6" rx="0.7" fill={color} stroke="none" /></svg>);
    default:
      return (<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...st} /><path d="M12 7.5v5" {...st} /><circle cx="12" cy="16" r="1" fill={color} stroke="none" /></svg>);
  }
};

export const DecisionBtn = ({ k, state, onTap }: { k: number; state: "idle" | "right" | "wrong" | "dim"; onTap?: () => void }) => {
  const d = DECISIONS[k];
  return (
    <motion.button
      className="glossy relative flex min-h-[52px] items-center gap-2.5 overflow-hidden rounded-[18px] border px-3 py-2 text-left"
      style={{
        background: `linear-gradient(180deg, ${d.grad[0]}, ${d.grad[1]})`,
        borderColor: state === "right" ? "#fff" : "rgba(255,255,255,.22)",
        boxShadow: state === "right" ? `0 0 0 2px rgba(255,255,255,.6), 0 0 24px ${d.grad[0]}` : `0 5px 0 ${d.edge}, 0 10px 18px rgba(0,0,0,.35)`,
        opacity: state === "dim" ? 0.45 : 1,
      }}
      animate={state === "wrong" ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      whileTap={state === "dim" ? undefined : { y: 4, boxShadow: `0 1px 0 ${d.edge}` }}
      onTap={state === "dim" ? undefined : onTap}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white/90 bg-black/15">
        <DecIcon k={d.icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-bold leading-tight text-white">{d.label}</span>
        <span className="block text-[9.5px] font-semibold text-white/60">{d.sub}</span>
      </span>
      {state === "right" && <ICheck size={18} color="#eafff5" stroke={3} />}
      {state === "wrong" && <span className="text-white" style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,.5))" }}>✕</span>}
    </motion.button>
  );
};

/* chart data for arena rounds */
export const HIST: Candle[] = [
  { o: 62, c: 55, h: 52, l: 66 },
  { o: 55, c: 60, h: 52, l: 64 },
  { o: 60, c: 50, h: 46, l: 63 },
  { o: 50, c: 54, h: 47, l: 58 },
  { o: 54, c: 44, h: 40, l: 57 },
  { o: 44, c: 48, h: 41, l: 52 },
  { o: 48, c: 38, h: 34, l: 51 },
  { o: 38, c: 42, h: 35, l: 46 },
  { o: 42, c: 33, h: 28, l: 45 },
  { o: 33, c: 37, h: 30, l: 41 },
];
export const FUT: Candle[] = [
  { o: 37, c: 52, h: 33, l: 56 },
  { o: 52, c: 47, h: 44, l: 55 },
  { o: 47, c: 43, h: 41, l: 50 },
  { o: 43, c: 45, h: 40, l: 48 },
  { o: 45, c: 44, h: 42, l: 49 },
];

const PageKicker = ({ children, v }: { children: React.ReactNode; v: VariantDef }) => (
  <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={usePres(v)} className="mb-2 mt-1">
    <Kicker color={v.glow}>{children}</Kicker>
  </motion.div>
);

/* ============================================================ P01 SPLASH */
export const P01 = ({ v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const pres = usePres(v);
  const { st } = useAsset();
  return (
    <div className="game-root relative flex h-full flex-col items-center justify-center overflow-hidden bg-bg px-6">
      <BG v={v} />
      <div className="noise pointer-events-none absolute inset-0" />
      <motion.div style={st("logo-emblem")} className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...pres, delay: 0.15 }}
          style={{ filter: `drop-shadow(0 0 30px ${v.glowSoft})` }}
        >
          <Emblem size={96} />
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, letterSpacing: "0.5em" }} animate={{ opacity: 1, letterSpacing: "0.18em" }} transition={{ delay: 0.45, duration: 0.7, ease: ease.out }} className="mt-5 text-[30px] font-extrabold tracking-[0.18em] text-white">
        SIGNAL
      </motion.div>
      <motion.div initial={{ opacity: 0, letterSpacing: "0.5em" }} animate={{ opacity: 1, letterSpacing: "0.18em" }} transition={{ delay: 0.6, duration: 0.7, ease: ease.out }} className="text-[30px] font-extrabold tracking-[0.18em] grad-acc">
        ARENA
      </motion.div>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-3 max-w-[260px] text-center text-[11.5px] font-semibold leading-relaxed text-ink2">
        Рынок хочет, чтобы ты гадал.
        <br />
        Здесь учат читать.
      </motion.p>

      <motion.div style={st("hand-note")} initial={{ opacity: 0, scale: 0.7, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: -2.5 }} transition={{ ...pres, delay: 1.1 }} className="mt-5">
        <HandNote lines={["IF YOU'RE HERE JUST", "FOR MONEY, YOU'RE", "EARLY. AND THAT'S BAD."]} rotate={-2.5} size={19} />
      </motion.div>

      <motion.div className="mt-8 w-full max-w-[260px]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, ...pres }}>
        <GButton variant="acc" size="lg" block onTap={() => feel.open()}>
          ENTER THE ARENA <IChevR size={16} color="#04211e" />
        </GButton>
        <p className="mt-3 text-center text-[9.5px] font-semibold tracking-wide text-ink3">Telegram Mini App · 15s до первой сделки</p>
      </motion.div>
    </div>
  );
};

/* ======================================================== TUTORIAL P02-05 */
const TutorialShell = ({ page, v, n, title, idea, action, visual }: { page: PageDef; v: VariantDef; n: number; title: string; idea: string; action: string; visual: React.ReactNode }) => {
  const pres = usePres(v);
  const { st } = useAsset();
  return (
    <Frame page={page} v={v}>
      <PageKicker v={v}>Обучение через бой</PageKicker>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[19px] font-extrabold leading-tight text-white">{title}</div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold text-ink3">
            урок {n}/4
          </span>
          <Pips n={n} total={4} color={v.glow} />
        </div>
      </div>
      <motion.div className="relative mx-auto w-full max-w-[320px]" initial={{ opacity: 0, scale: 0.94, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.15, ...pres }} style={st(page.assetId.split("/")[1])}>
        {visual}
      </motion.div>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, ...pres }} className="mx-auto mt-4 max-w-[300px] text-center text-[12.5px] font-semibold leading-relaxed text-ink2">
        {idea}
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mx-auto mt-2 flex max-w-[300px] items-center justify-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1.5">
        <IHand size={14} color={v.glow} />
        <span className="text-[10.5px] font-bold text-ink2">{action}</span>
      </motion.div>
      <div className="flex-1" />
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, ...pres }} className="mx-auto w-full max-w-[300px]">
        <GButton variant="acc" block size="md">
          {n < 4 ? "Дальше" : "К первому бою"} <IChevR size={15} color="#04211e" />
        </GButton>
      </motion.div>
    </Frame>
  );
};

const VisFrame = ({ v, children, h = 190 }: { v: VariantDef; children: React.ReactNode; h?: number }) => (
  <div className="relative overflow-hidden rounded-[20px] border border-line bg-[#0c1526]" style={{ height: h, boxShadow: `inset 0 0 0 1px rgba(255,255,255,.03), 0 14px 34px ${v.glowSoft}` }}>
    {children}
  </div>
);

export const P02 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => (
  <TutorialShell
    page={page}
    v={v}
    n={1}
    title="Это Арена"
    idea="Сюда приходят «ради денег». Поэтому здесь сразу опасно. Мы учим на настоящих исторических сценариях — граф отыграет то, что уже случилось."
    action="Смотри на график. Выбери ход."
    visual={
      <VisFrame v={v}>
        <CandleChart history={HIST.slice(0, 7)} future={HIST.slice(7)} sealed level={30} v={v} height={150} pair="SOL/USDT · 15M" prices={["9.42", "9.30", "9.18"]} />
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span key={i} className="h-4 w-6 rounded-md border border-white/30" style={{ background: ["#2E7F5C", "#4C6180", "#C56861"][i] }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.12, ...spring.pop }} />
          ))}
        </div>
      </VisFrame>
    }
  />
);

export const P03 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const pres = usePres(v);
  const [tapped, setTapped] = useState(false);
  return (
    <TutorialShell
      page={page}
      v={v}
      n={2}
      title="Свеча — единственный честный язык"
      idea="Тело — цена за период: зелёная выше открытия, красная ниже. Тени — как далеко цена заходила. Большой тенью рынок говорит: «тут был спор»."
      action={tapped ? "Верно: open 67 812 → close 67 851." : "Нажми на тело свечи."}
      visual={
        <VisFrame v={v} h={210}>
          <svg viewBox="0 0 100 70" className="h-full w-full">
            <motion.line x1="50" x2="50" y1="8" y2="62" stroke={UPC} strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
            <motion.rect
              x="38"
              y="22"
              width="24"
              height="26"
              rx="3"
              fill={UPC}
              initial={{ scaleY: 0 }}
              animate={tapped ? { scaleY: [1, 0.86, 1.06, 1], scaleX: [1, 1.1, 0.95, 1] } : { scaleY: 1 }}
              whileTap={{ scale: 1.06 }}
              style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
              transition={tapped ? { duration: 0.45 } : { delay: 0.2, ...pres }}
              onTap={() => {
                if (!tapped) {
                  setTapped(true);
                  sfx.pop();
                }
              }}
            />
            <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, ...pres }}>
              <line x1="66" x2="82" y1="35" y2="24" stroke="#eaf2ff" strokeWidth="1" />
              <text x="84" y="22" fontSize="7" fontWeight="700" fill="#eaf2ff" textAnchor="start">ТЕЛО</text>
              <text x="84" y="30" fontSize="5.5" fontWeight="600" fill="#6b7a9c">open → close</text>
            </motion.g>
            <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.95, ...pres }}>
              <line x1="66" x2="82" y1="12" y2="10" stroke="#eaf2ff" strokeWidth="1" />
              <text x="84" y="9" fontSize="7" fontWeight="700" fill="#eaf2ff" textAnchor="start">ТЕНЬ</text>
              <text x="84" y="17" fontSize="5.5" fontWeight="600" fill="#6b7a9c">max / min</text>
            </motion.g>
            <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, ...pres }}>
              <line x1="34" x2="20" y1="52" y2="56" stroke="#eaf2ff" strokeWidth="1" />
              <text x="18" y="58" fontSize="6" fontWeight="700" fill="#3ddc97" textAnchor="end">+3.2%</text>
            </motion.g>
            {tapped && (
              <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={spring.pop}>
                <rect x="24" y="52" width="52" height="13" rx="2.5" fill="#10241f" stroke="#3ddc97" strokeWidth="0.6" />
                <text x="50" y="60.5" textAnchor="middle" fontSize="5.6" fontWeight="800" fill="#9ff3e8">open 67 812 → close 67 851</text>
              </motion.g>
            )}
          </svg>
        </VisFrame>
      }
    />
  );
};

const UPC = "#3ddc97";

export const P04 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => (
  <TutorialShell
    page={page}
    v={v}
    n={3}
    title="Тихий объём — ложь"
    idea="Пробой уровня без зелёных объёмных баров — это не сигнал, это приглашение в ловушку. Объём должен подтвердить цену. Всегда."
    action="Сравни два пробоя: с объёмом и без."
    visual={
      <VisFrame v={v} h={200}>
        <svg viewBox="0 0 100 66" className="h-full w-full">
          <line x1="4" x2="96" y1="22" y2="22" stroke={v.glow} strokeWidth="0.8" strokeDasharray="3 2.4" opacity="0.7" />
          <text x="6" y="18" fontSize="5.5" fontWeight="700" fill={v.glow}>УРОВЕНЬ</text>
          {[10, 18, 26, 34].map((x, i) => (
            <g key={i}>
              <line x1={x + 4} x2={x + 4} y1={i % 2 ? 12 : 26} y2={i % 2 ? 26 : 12} stroke={i % 2 ? "#ff5b6a" : "#3ddc97"} strokeWidth="1" />
              <rect x={x + 2.5} y={i % 2 ? 14 : 16} width="3" height={i % 2 ? 9 : 8} rx="0.8" fill={i % 2 ? "#ff5b6a" : "#3ddc97"} />
            </g>
          ))}
          <motion.rect x="42" y="10" width="10" height="14" rx="1.5" fill="rgba(61,220,151,.14)" stroke="#3ddc97" strokeWidth="0.7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
          <text x="47" y="8.5" fontSize="5" fontWeight="700" fill="#3ddc97" textAnchor="middle">ОБЪЁМ</text>
          {[52, 60, 68, 76].map((x, i) => (
            <g key={i}>
              <line x1={x + 4} x2={x + 4} y1={i % 2 ? 12 : 26} y2={i % 2 ? 26 : 12} stroke={i % 2 ? "#ff5b6a" : "#3ddc97"} strokeWidth="1" />
              <rect x={x + 2.5} y={i % 2 ? 14 : 16} width="3" height={i % 2 ? 9 : 8} rx="0.8" fill={i % 2 ? "#ff5b6a" : "#3ddc97"} />
            </g>
          ))}
          <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, ...spring.pop }}>
            <rect x="52" y="10" width="24" height="14" rx="1.5" fill="rgba(255,91,106,.1)" stroke="#ff5b6a" strokeWidth="0.7" />
            <text x="64" y="20" fontSize="5.5" fontWeight="800" fill="#ff8a94" textAnchor="middle">ЛОВУШКА</text>
          </motion.g>
          <text x="47" y="58" fontSize="5.5" fontWeight="700" fill="#3ddc97" textAnchor="middle">пробой подтверждён</text>
          <text x="70" y="58" fontSize="5.5" fontWeight="700" fill="#ff8a94" textAnchor="middle">объём молчит</text>
        </svg>
      </VisFrame>
    }
  />
);

export const P05 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const [sealed, setSealed] = useState(false);
  return (
    <TutorialShell
      page={page}
      v={v}
      n={4}
      title="Seal: решение запечатывается"
      idea="До Seal будущее скрыто — ты видишь рынок только до t0. Запечатал решение — граф прокручивает историю и честно показывает, что было дальше."
      action={sealed ? "Seal выполнен. История прокрутится на экране P10." : "Нажми SEAL, чтобы прогнать историю."}
      visual={
        <VisFrame v={v}>
          <CandleChart history={HIST} future={FUT} sealed level={30} v={v} height={150} focus={{ at: 8, label: sealed ? "ЗАПЕЧАТАНО" : "ТВОЙ ВХОД" }} />
          {sealed && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 1.5, opacity: 0, rotate: -14 }}
              animate={{ scale: 1, opacity: 1, rotate: -8 }}
              transition={spring.pop}
            >
              <span className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-[3px] border-white/80 bg-[#0a1120]/70 backdrop-blur-sm" style={{ boxShadow: `0 0 34px ${v.glowSoft}, inset 0 0 16px rgba(0,0,0,.6)` }}>
                <ISeal size={24} color={v.glow} />
                <span className="mt-0.5 text-[7.5px] font-extrabold tracking-[0.2em] text-white">SEALED</span>
              </span>
            </motion.div>
          )}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <motion.button
              className="glossy flex min-h-[40px] items-center gap-1.5 rounded-full border px-4 text-[10px] font-extrabold tracking-wider"
              style={{
                borderColor: sealed ? "#2a3a5e" : "rgba(255,255,255,.3)",
                background: sealed ? "#151f35" : "linear-gradient(180deg,#24345a,#1a2745)",
                color: sealed ? "#6b7a9c" : "#ffffff",
                boxShadow: sealed ? "none" : `0 3px 0 rgba(0,0,0,.35)`,
              }}
              whileTap={sealed ? undefined : { y: 3 }}
              onTap={() => {
                if (!sealed) {
                  setSealed(true);
                  sfx.success();
                  feel.open();
                }
              }}
            >
              <ISeal size={13} color={sealed ? "#6b7a9c" : v.glow} /> {sealed ? "SEAL ВЫПОЛНЕН" : "SEAL"}
            </motion.button>
          </div>
        </VisFrame>
      }
    />
  );
};

/* ============================================================ ARENA */
const ArenaShell = ({ page, v, kicker, children }: { page: PageDef; v: VariantDef; kicker: string; children: React.ReactNode }) => (
  <Frame page={page} v={v}>
    <div className="flex items-center justify-between">
      <PageKicker v={v}>{kicker}</PageKicker>
      <span className="mt-1 flex items-center gap-1 text-[10px] font-extrabold tracking-wider text-ink3">
        <IBoltLine size={13} color={v.glow} /> RAUND 01
      </span>
    </div>
    <div className="flex min-h-0 flex-1 flex-col gap-2.5">{children}</div>
  </Frame>
);

export const P06 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const { st } = useAsset();
  const [picked, setPicked] = useState(false);
  return (
    <ArenaShell page={page} v={v} kicker="Заход на Арену · зона сетапа">
      <Coach text="Пробой без объёма. Объём молчит." v={v} sub="Система не даст войти вслепую. Выбери приём." />
      <motion.div style={st("chart-t0")} className="min-h-[140px] flex-1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={usePres(v)}>
        <CandleChart history={HIST} future={FUT} sealed level={30} v={v} height="100%" zone={{ from: 7, to: 9, color: v.glow }} focus={{ at: 8, label: "ЗОНА РЕТЕСТА" }} />
      </motion.div>

      <motion.div style={st("hand-fan")} className="grid grid-cols-4 gap-1.5" initial="hidden" animate="show" transition={{ staggerChildren: 0.07, delayChildren: 0.5 }}>
        {[skill("c17"), skill("c18"), skill("c20"), skill("c34")].map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 24, rotate: -6 + i * 4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={usePres(v)}>
            <SkillCardV s={s} state={s.id === "c34" ? "locked" : "open"} selected={picked && i === 0} onTap={() => { if (i === 0) setPicked(true); }} />
          </motion.div>
        ))}
      </motion.div>

      <div className="flex-1" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <GButton variant={picked ? "gold" : "acc"} block size="md" onTap={() => sfx.whoosh()}>
          {picked ? "К решениям" : "Выбери приём"} <IChevR size={15} color={picked ? "#2e2405" : "#04211e"} />
        </GButton>
      </motion.div>
    </ArenaShell>
  );
};

export const P07 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const { st } = useAsset();
  const [sel, setSel] = useState(0);
  return (
    <ArenaShell page={page} v={v} kicker="Колода открыта · зона выбора">
      <Coach text="Один приём на сделку. Двойной клик — рынок заметит." v={v} />
      <motion.div style={st("cards-row")} className="relative rounded-[22px] border border-line bg-panel/60 p-3" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={usePres(v)}>
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[10px] font-extrabold tracking-wider text-ink3">TWO MOVES AVAILABLE</span>
          <span className="text-[9px] font-bold text-ink3">4 in hand</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[skill("c17"), skill("c18"), skill("c20"), skill("c34")].map((s, i) => (
            <div key={s.id} style={st(`card-${s.id}`)}>
              <SkillCardV s={s} state={s.id === "c34" ? "locked" : i === 1 ? "new" : "open"} selected={sel === i} onTap={() => { if (s.id !== "c34") setSel(i); }} />
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mx-auto flex max-w-[300px] items-center justify-center gap-2 rounded-[14px] border border-line bg-[#0c1526] px-3 py-2">
        <ITarget size={15} color={v.glow} />
        <span className="text-[11px] font-bold text-ink2">
          «{[skill("c17"), skill("c18"), skill("c20"), skill("c34")][sel].label}» выбран для сделки
        </span>
      </motion.div>
      <div className="flex-1" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <GButton variant="acc" block>
          Запечатать и решать <IChevR size={15} color="#04211e" />
        </GButton>
      </motion.div>
    </ArenaShell>
  );
};

export const P08 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const { st } = useAsset();
  const [state, setState] = useState<Record<number, "idle" | "right" | "wrong" | "dim">>({ 0: "idle", 1: "idle", 2: "idle", 3: "idle" });
  const pick = (i: number) => {
    if (state[i] === "dim") return;
    if (i === 1) {
      setState({ 0: "dim", 1: "right", 2: "dim", 3: "dim" });
      sfx.success();
    } else {
      const next = { ...state, [i]: "wrong" as const };
      setState(next);
      sfx.error();
      setTimeout(() => setState((s) => ({ ...s, [i]: s[i] === "wrong" ? "idle" : s[i] })), 650);
    }
  };
  return (
    <ArenaShell page={page} v={v} kicker="Зона решений · выбор одного хода">
      <Coach text="Пробой без объёма. Объём молчит." v={v} sub={state[1] === "right" ? "Рынок принимает твой план. Seal." : "Четыре хода. Один честный."} />
      <div className="relative" style={st("chart-t0")}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={usePres(v)}>
          <CandleChart history={HIST} future={FUT} sealed level={30} v={v} height={150} zone={{ from: 7, to: 9, color: v.glow }} />
        </motion.div>
        {state[1] === "right" && (
          <motion.span
            className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full border border-white/30 bg-[#0a1120]/85 px-2.5 py-1 text-[8.5px] font-extrabold tracking-wider text-white"
            initial={{ scale: 1.4, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: -4 }}
            transition={spring.pop}
            style={{ boxShadow: `0 0 20px ${v.glowSoft}` }}
          >
            <ISeal size={11} color={v.glow} /> SEAL t0
          </motion.span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {DECISIONS.map((_, i) => (
          <div key={i} style={st(`chip-${DECISIONS[i].id}`)}>
            <DecisionBtn k={i} state={state[i]} onTap={() => pick(i)} />
          </div>
        ))}
      </div>
    </ArenaShell>
  );
};

export const P09 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => (
  <ArenaShell page={page} v={v} kicker="Seal · решение зафиксировано">
    <Coach text="Seal нажат. Будущее откроется честно." v={v} />
    <motion.div className="relative" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={usePres(v)}>
      <CandleChart history={HIST} future={FUT} sealed level={30} v={v} height={196} />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 1.6, opacity: 0, rotate: -14 }}
        animate={{ scale: 1, opacity: 1, rotate: -8 }}
        transition={{ delay: 0.5, ...spring.pop }}
      >
        <span className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-[3px] border-white/80 bg-[#0a1120]/70 backdrop-blur-sm" style={{ boxShadow: `0 0 40px ${v.glowSoft}, inset 0 0 20px rgba(0,0,0,.6)` }}>
          <ISeal size={30} color={v.glow} />
          <span className="mt-0.5 text-[9px] font-extrabold tracking-[0.2em] text-white">SEALED</span>
        </span>
      </motion.div>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mx-auto flex max-w-[300px] items-center justify-center gap-2 rounded-[14px] border border-line bg-panel px-3 py-2">
      <IStarLine size={14} color={v.glow} />
      <span className="text-[10.5px] font-bold text-ink2">Движок зафиксировал сценарий. Фальшивых данных не существует — только история.</span>
    </motion.div>
    <div className="flex-1" />
    <GButton variant="gold" block onTap={() => sfx.whoosh()}>
      <IFF size={16} color="#2e2405" /> Запустить историю
    </GButton>
  </ArenaShell>
);

export const P10 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const { st } = useAsset();
  const [scrub, setScrub] = useState(0);
  useEffect(() => {
    const t0 = setTimeout(() => sfx.whoosh(), 300);
    // time-scrub: future candles draw one by one
    const t1 = setTimeout(() => {
      const iv = setInterval(() => {
        setScrub((s) => {
          if (s >= 1) {
            clearInterval(iv);
            return 1;
          }
          return s + 0.2;
        });
      }, 340);
      cleanup = () => clearInterval(iv);
    }, 600);
    let cleanup: () => void = () => {};
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      cleanup();
    };
  }, []);
  return (
    <ArenaShell page={page} v={v} kicker="Fast-forward · time-scrub">
      <Coach text="История прокручивается. Не моргай." v={v} />
      <div style={st("chart-extend")}>
        <CandleChart history={HIST} future={FUT} sealed={false} scrub={scrub} level={30} v={v} height={196} />
      </div>
      {/* scrub bar driven by the same state as the candles — always in sync */}
      <div className="relative mx-auto mt-1 h-1.5 w-[85%] overflow-hidden rounded-full bg-[#1d2a47]">
        <div className="h-full rounded-full" style={{ background: v.glow, width: `${scrub * 100}%`, transition: "width .3s cubic-bezier(.16,1,.3,1)" }} />
      </div>
      <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-ink3">
        <span>t0</span>
        <motion.span key="tc" className="rounded-full border border-line bg-panel px-2 py-0.5 font-extrabold" animate={{ color: v.glow }}>
          <Timecode running={scrub < 1} />
        </motion.span>
        <span>t0+60m</span>
      </div>
      <div className="flex-1" />
    </ArenaShell>
  );
};

const Timecode = ({ running }: { running: boolean }) => {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setS((x) => (x < 60 ? x + 5 : x)), 130);
    return () => clearInterval(t);
  }, [running]);
  return <span>t0+{s}m</span>;
};

export const P11 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const { st } = useAsset();
  const [scrub] = useState(1);
  return (
    <ArenaShell page={page} v={v} kicker="Reveal · ключевое событие">
      <Coach text="Ложный пробой. Объём не подтвердил." v={v} />
      <motion.div style={st("chart-history")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={usePres(v)}>
        <CandleChart history={HIST} future={FUT} sealed={false} scrub={scrub} level={30} v={v} height={180} event={{ at: 0, label: "FAKEOUT" }} />
      </motion.div>
      <motion.div style={st("caption")} className="mx-auto w-full max-w-[320px] rounded-[18px] border border-line bg-panel p-3.5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, ...usePres(v) }}>
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-full px-2 py-0.5 text-[9px] font-extrabold tracking-wider" style={{ background: `${v.glow}1f`, color: v.glow }}>
            WHAT HAPPENED
          </span>
          <span className="text-[9px] font-bold text-ink3">t0+15m</span>
        </div>
        <p className="text-[12.5px] font-bold leading-relaxed text-ink">
          Цена пробила уровень и развернулась на 4.2%. Объёмные бары остались серыми — за пробоем не было покупателей.
        </p>
      </motion.div>
      <div className="flex-1" />
      <GButton variant="acc" block>
        Оценка <IChevR size={15} color="#04211e" />
      </GButton>
    </ArenaShell>
  );
};

export const P12 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => (
  <ArenaShell page={page} v={v} kicker="Оценка · 3 звезды">
    <div className="flex flex-1 flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={usePres(v)} className="mb-1 text-[24px] font-extrabold tracking-wide text-white">
        РЫНОК ПРИНЯЛ ТВОЁ РЕШЕНИЕ
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6 text-[11.5px] font-semibold text-ink2">
        Ждали. Объём подтвердил. Идеальная сделка.
      </motion.p>
      <div className="flex items-center gap-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -50, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], rotate: [-50, 10, 0], opacity: 1 }}
            transition={{ delay: 0.35 + i * 0.34, ...spring.pop }}
            onAnimationComplete={() => sfx.star()}
          >
            <IconStar size={i === 1 ? 64 : 50} className="drop-shadow-[0_8px_20px_rgba(255,193,7,.4)]" />
          </motion.div>
        ))}
      </div>
      <div className="mt-7 flex gap-2.5">
        <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3, ...spring.pop }} className="flex items-center gap-1.5 rounded-full border border-[#6b5a2e] bg-[#241f12] px-3.5 py-1.5 text-[13px] font-extrabold text-[#ffe9b0]">
          <svg width="15" height="15" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#ffc107" strokeWidth="2.4" strokeDasharray="3 2.4" /><circle cx="12" cy="12" r="5.5" fill="#ffc107" /></svg>
          +120
        </motion.span>
        <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5, ...spring.pop }} className="flex items-center gap-1.5 rounded-full border border-[#1f5e58] bg-[#10241f] px-3.5 py-1.5 text-[13px] font-extrabold text-[#9ff3e8]">
          +90 XP
        </motion.span>
      </div>
    </div>
    <div className="flex-1" />
    <GButton variant="gold" block>
      Разбор сделки <IChevR size={15} color="#2e2405" />
    </GButton>
  </ArenaShell>
);

const DebriefRow = ({ label, value, ok, delay, v }: { label: string; value: string; ok: boolean; delay: number; v: VariantDef }) => (
  <motion.div
    className="flex items-center gap-3 rounded-[16px] border border-line bg-[#0c1526] p-3"
    initial={{ opacity: 0, x: -24 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, ...usePres(v) }}
  >
    <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: ok ? "rgba(61,220,151,.12)" : "rgba(255,91,106,.12)" }}>
      {ok ? <ICheck size={15} color="#3ddc97" stroke={3} /> : <span className="text-[13px] font-extrabold text-[#ff8a94]">✕</span>}
    </span>
    <div className="min-w-0 flex-1">
      <div className="text-[9.5px] font-extrabold tracking-wider text-ink3 uppercase">{label}</div>
      <div className="truncate text-[12.5px] font-bold text-ink">{value}</div>
    </div>
  </motion.div>
);

export const P13 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => (
  <ArenaShell page={page} v={v} kicker="Разбор · что было верно">
    <div className="flex flex-1 flex-col gap-2">
      <DebriefRow v={v} delay={0.15} label="Приём" value="Wait For Retest" ok />
      <DebriefRow v={v} delay={0.3} label="Решение" value="Ждать ретест и объём" ok />
      <DebriefRow v={v} delay={0.45} label="Точность" value="С первого раза" ok />
      <DebriefRow v={v} delay={0.6} label="Главный урок" value="Серые бары — не сигнал" ok />
    </div>
    <div className="flex-1" />
    <GButton variant="acc" block>
      Следующий заход <IChevR size={15} color="#04211e" />
    </GButton>
  </ArenaShell>
);

export const P14 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const { st } = useAsset();
  return (
    <ArenaShell page={page} v={v} kicker="Раунд завершён">
      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.div style={st("result-panel")} className="w-full max-w-[300px] rounded-[24px] border border-line bg-panel p-5 text-center" initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={usePres(v)}>
          <div className="text-[11px] font-extrabold tracking-[0.2em] text-ink3">RAUND 01 · COMPLETE</div>
          <div className="mt-2 text-[26px] font-extrabold text-white">3 / 3 звезды</div>
          <div className="mt-1 text-[11.5px] font-semibold text-ink2">Серию можно держать. Пока.</div>
          <div className="mt-4 flex justify-center gap-2">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, ...spring.pop }} className="flex items-center gap-1.5 rounded-full bg-[#241f12] px-3 py-1.5 text-[12px] font-extrabold text-[#ffe9b0]" style={{ boxShadow: "inset 0 0 0 1px #6b5a2e" }}>
              +120 монет
            </motion.span>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.65, ...spring.pop }} className="flex items-center gap-1.5 rounded-full bg-[#10241f] px-3 py-1.5 text-[12px] font-extrabold text-[#9ff3e8]" style={{ boxShadow: "inset 0 0 0 1px #1f5e58" }}>
              +90 XP
            </motion.span>
          </div>
        </motion.div>
        <motion.div style={st("streak-chip")} className="mt-3 flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <span className="text-[11px] font-extrabold text-ink2">STREAK</span>
          <span className="text-[13px] font-extrabold" style={{ color: v.glow }}>×1</span>
        </motion.div>
      </div>
      <div className="flex-1" />
      <GButton variant="acc" block>
        Заход 02 — новый сценарий <IChevR size={15} color="#04211e" />
      </GButton>
    </ArenaShell>
  );
};

/* ======================================================== ACADEMY */
export const P15 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const { st } = useAsset();
  const nodes = [
    { t: "Свечной алфавит", state: "done" as const, y: 4 },
    { t: "Уровень и объём", state: "active" as const, y: 4 },
    { t: "Старшие таймфреймы", state: "next" as const, y: 4 },
    { t: "Защита капитала", state: "locked" as const, y: 4 },
  ];
  return (
    <Frame page={page} v={v}>
      <PageKicker v={v}>Академия · дерево тем</PageKicker>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[19px] font-extrabold text-white">База знаний</div>
        <span className="text-[10px] font-bold text-ink3">2/6 пройдено</span>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden" style={st("tree-path")}>
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <motion.path d="M50 6 C 20 22, 80 38, 50 54 S 20 82, 50 94" fill="none" stroke="#2a3a5e" strokeWidth="1.6" strokeDasharray="3 2.6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.2, ease: ease.inOut }} />
        </svg>
        <div className="relative flex h-full flex-col justify-between py-1">
          {nodes.map((n, i) => {
            const left = i % 2 === 0;
            return (
              <div key={i} className={`flex items-center ${left ? "" : "flex-row-reverse"}`}>
                <div className="w-1/2 px-2">
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.14, ...usePres(v) }}
                    whileTap={{ scale: 0.96 }}
                    className="w-full rounded-[16px] border border-line bg-panel p-3"
                    style={{ opacity: n.state === "locked" ? 0.55 : 1, boxShadow: n.state === "active" ? `0 0 0 1.5px ${v.glow}, 0 10px 24px ${v.glowSoft}` : "0 8px 20px rgba(0,0,0,.3)" }}
                  >
                    <div className="text-[12.5px] font-extrabold leading-tight text-white">{n.t}</div>
                    <div className="mt-0.5 text-[9.5px] font-bold text-ink3">
                      {n.state === "done" ? "Пройдено · 100%" : n.state === "active" ? "Доступно · 3 шага" : n.state === "next" ? "Откроется после урока" : "Rank 3+ required"}
                    </div>
                  </motion.div>
                </div>
                <div className="relative flex w-14 justify-center">
                  <motion.button
                    className={`glossy flex h-12 w-12 items-center justify-center rounded-full border-[2.5px] ${n.state === "locked" ? "" : ""}`}
                    style={{
                      borderColor: n.state === "locked" ? "#2a3a5e" : v.glow,
                      background: n.state === "done" ? "linear-gradient(180deg,#2E7F5C,#1f5c42)" : n.state === "locked" ? "#151f35" : `linear-gradient(180deg, ${v.glow}, ${v.glow}88)`,
                      boxShadow: n.state === "active" ? `0 0 26px ${v.glowSoft}, 0 4px 0 rgba(0,0,0,.35)` : "0 4px 0 rgba(0,0,0,.35)",
                    }}
                    animate={n.state === "active" ? { y: [0, -6, 0] } : {}}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  >
                    {n.state === "done" ? <ICheck size={18} color="#eafff5" stroke={3} /> : n.state === "locked" ? <ILock size={16} color="#6b7a9c" /> : <IBook size={18} color={n.state === "active" ? "#0a1120" : v.glow} />}
                  </motion.button>
                </div>
                <div className="w-1/2" />
              </div>
            );
          })}
        </div>
      </div>
      <GButton variant="acc" block>
        Продолжить: «Уровень и объём» <IChevR size={15} color="#04211e" />
      </GButton>
    </Frame>
  );
};

export const P16 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => (
  <Frame page={page} v={v}>
    <PageKicker v={v}>Урок · шаг 2 из 3</PageKicker>
    <div className="mb-3 flex items-center justify-between">
      <div className="text-[18px] font-extrabold leading-tight text-white">Серые бары у пробоя</div>
      <Pips n={2} total={3} color={v.glow} />
    </div>
    <motion.div style={useAsset().st("lesson-visual")} className="relative overflow-hidden rounded-[20px] border border-line bg-[#0c1526]" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={usePres(v)}>
      <svg viewBox="0 0 100 60" className="w-full" style={{ height: 170 }}>
        <line x1="4" x2="96" y1="24" y2="24" stroke={v.glow} strokeWidth="0.7" strokeDasharray="2.6 2" opacity="0.8" />
        {[
          [10, 30, 22], [20, 26, 18], [30, 32, 24], [40, 24, 16], [50, 28, 20], [60, 20, 14],
        ].map(([x, y1, y2], i) => (
          <g key={i}>
            <line x1={x} x2={x} y1={Math.min(y1, y2) - 4} y2={Math.max(y1, y2) + 4} stroke={y2 < y1 ? "#3ddc97" : "#ff5b6a"} strokeWidth="1" />
            <rect x={x - 2.5} y={Math.min(y1, y2)} width="5" height={Math.abs(y2 - y1)} rx="1" fill={y2 < y1 ? "#3ddc97" : "#ff5b6a"} />
          </g>
        ))}
        <motion.rect x="66" y="12" width="22" height="24" rx="2" fill="none" stroke="#ff5b6a" strokeWidth="1" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        <text x="77" y="44" fontSize="5.5" fontWeight="800" fill="#ff8a94" textAnchor="middle">0 ОБЪЁМА</text>
      </svg>
    </motion.div>
    <p className="mx-auto mt-3 max-w-[300px] text-center text-[12px] font-semibold leading-relaxed text-ink2">
      Если пробой прошёл, а объём не вырос — это не пробой. Это проверка, насколько тебе хочется.
    </p>
    <div className="flex-1" />
    <GButton variant="acc" block>
      Шаг 3 <IChevR size={15} color="#04211e" />
    </GButton>
  </Frame>
);

export const P17 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const { st } = useAsset();
  return (
    <Frame page={page} v={v}>
      <PageKicker v={v}>Урок · пример на графике</PageKicker>
      <div className="mb-2 text-[18px] font-extrabold text-white">Читаем реальный сетап</div>
      <motion.div style={st("example-chart")} className="min-h-[150px] flex-1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={usePres(v)}>
        <CandleChart history={HIST} future={FUT} level={30} v={v} height="100%" pair="ETH/USDT · 1H" prices={["3 480", "3 410", "3 340"]} />
      </motion.div>
      <motion.div style={st("annotation")} className="mx-auto mt-3 w-full max-w-[320px] rounded-[16px] border border-line bg-panel p-3.5" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, ...usePres(v) }}>
        <div className="mb-1 flex items-center gap-2">
          <ITarget size={14} color="#3ddc97" />
          <span className="text-[10px] font-extrabold tracking-wider text-[#3ddc97]">АНОТАЦИЯ</span>
        </div>
        <p className="text-[12px] font-bold leading-relaxed text-ink">
          Три касания уровня вниз → отскок на объёме → ретест. Чек-лист пройден: вход разрешён, стоп за минимумом.
        </p>
      </motion.div>
      <div className="flex-1" />
      <GButton variant="acc" block>
        Проверить знание <IChevR size={15} color="#04211e" />
      </GButton>
    </Frame>
  );
};
