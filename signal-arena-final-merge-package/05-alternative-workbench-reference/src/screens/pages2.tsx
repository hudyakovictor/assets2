import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Frame, SkillCardV } from "./pages1";
import { Kicker, GButton } from "../components/ui";
import { SkillIcon } from "../components/SkillIcon";
import { SKILLS, CARD_PALETTE } from "../data/remoteAssets";
import type { PageDef, VariantDef } from "../data/pages";
import { MOTION_PRESETS } from "../data/pages";
import { ease, spring } from "../lib/motion";
import { feel, sfx } from "../lib/feedback";
import { useAsset } from "../lib/assetCtx";
import { useGame } from "../store";
import { setMuted, setHaptics } from "../lib/feedback";
import { Emblem, ICheck, IWarn, ICloud, IEmptyBox, IPause, IRetry, IPlay, IFlame, ITrophy, IUser, IStarLine, IDeck } from "../components/RepoIcons";
import { IconCoin, IconStar, IconBolt } from "../components/RepoIcons";
import Counter from "../components/Counter";

const skill = (id: string) => SKILLS.find((s) => s.id === id)!;
const pres = (v: VariantDef) => MOTION_PRESETS[v.motion];

const Kicker2 = ({ children, v }: { children: React.ReactNode; v: VariantDef }) => (
  <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={pres(v)} className="mb-2 mt-1">
    <Kicker color={v.glow}>{children}</Kicker>
  </motion.div>
);

/* ============================================================ P18 QUIZ */
export const P18 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const [state, setState] = useState<Record<number, "idle" | "right" | "wrong" | "dim">>({ 0: "idle", 1: "idle", 2: "idle" });
  const opts = [
    "Сразу покупать на пробое",
    "Ждать объём и ретест",
    "Продать, всё равно пойдёт вниз",
  ];
  const pick = (i: number) => {
    if (state[i] !== "idle") return;
    if (i === 1) {
      setState({ 0: "dim", 1: "right", 2: "dim" });
      sfx.success();
    } else {
      setState({ ...state, [i]: "wrong" });
      sfx.error();
      setTimeout(() => setState((s) => ({ ...s, [i]: "idle" })), 700);
    }
  };
  return (
    <Frame page={page} v={v}>
      <Kicker2 v={v}>Урок · закрепление</Kicker2>
      <div className="text-[18px] font-extrabold text-white">Пробой. Объём серый. Что делаешь?</div>
      <div className="mt-4 flex flex-col gap-2.5">
        {opts.map((o, i) => (
          <motion.button
            key={i}
            className="glossy flex min-h-[54px] items-center gap-3 rounded-[18px] border px-4 py-3 text-left"
            style={{
              background: state[i] === "right" ? "linear-gradient(180deg,#2E7F5C,#1f5c42)" : state[i] === "wrong" ? "linear-gradient(180deg,#C56861,#a44f49)" : "#1d2a47",
              borderColor: state[i] === "right" ? "#fff" : "rgba(255,255,255,.14)",
              opacity: state[i] === "dim" ? 0.4 : 1,
              boxShadow: state[i] === "right" ? "0 0 0 2px rgba(255,255,255,.5), 0 0 24px rgba(46,127,92,.5)" : "0 4px 0 rgba(0,0,0,.3)",
            }}
            animate={state[i] === "wrong" ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            whileTap={{ y: 3, scale: 0.98 }}
            onTap={() => pick(i)}
          >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${state[i] === "right" ? "bg-white text-[#1f5c42]" : "bg-[#151f35] text-ink2"}`}>
              {state[i] === "right" ? <ICheck size={14} color="#1f5c42" stroke={3} /> : "0" + (i + 1)}
            </span>
            <span className="text-[13px] font-bold text-white">{o}</span>
          </motion.button>
        ))}
      </div>
      <div className="flex-1" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: state[1] === "right" ? 1 : 0 }} transition={{ delay: 0.4 }} className="mx-auto mb-3 w-full max-w-[300px]">
        <GButton variant="acc" block>
          Забрать награду <ICheck size={15} color="#04211e" />
        </GButton>
      </motion.div>
    </Frame>
  );
};

/* ========================================================== P19 REWARD */
export const P19 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => (
  <Frame page={page} v={v}>
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="text-[11px] font-extrabold tracking-[0.25em] text-ink3">LESSON COMPLETE</div>
      <motion.div
        className="mt-2 text-[26px] font-extrabold text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={pres(v)}
      >
        Приём разблокирован
      </motion.div>
      <motion.div
        className="mt-6 w-[112px]"
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6, ...spring.pop }}
        style={{ perspective: 800 }}
      >
        <SkillCardV s={skill("c03")} state="new" size="md" />
      </motion.div>
      <div className="mt-5 flex gap-2">
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, ...spring.pop }} className="flex items-center gap-1.5 rounded-full bg-[#241f12] px-3.5 py-1.5 text-[13px] font-extrabold text-[#ffe9b0]" style={{ boxShadow: "inset 0 0 0 1px #6b5a2e" }}>
          <IconCoin size={15} /> +60
        </motion.span>
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.05, ...spring.pop }} className="flex items-center gap-1.5 rounded-full bg-[#10241f] px-3.5 py-1.5 text-[13px] font-extrabold text-[#9ff3e8]" style={{ boxShadow: "inset 0 0 0 1px #1f5e58" }}>
          +50 XP
        </motion.span>
      </div>
      <p className="mt-5 max-w-[260px] text-center text-[11px] font-semibold text-ink2">
        Теперь он в колоде. На Арене приём работает только если лежит в руке.
      </p>
    </div>
    <div className="px-4 pb-2">
      <GButton variant="gold" block>
        В колоду
      </GButton>
    </div>
  </Frame>
);

/* ============================================================= P20 DECK */
export const P20 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const { st } = useAsset();
  const deck = [skill("c17"), skill("c03"), null];
  return (
    <Frame page={page} v={v}>
      <Kicker2 v={v}>Колода · рука на бой</Kicker2>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-[19px] font-extrabold text-white">Рука: 2/3 приёма</div>
        <span className="text-[10px] font-bold text-ink3">3 слота · 40 приёмов</span>
      </div>
      <motion.div className="mx-auto mt-3 grid w-full max-w-[300px] grid-cols-3 gap-2.5" initial="hidden" animate="show" transition={{ staggerChildren: 0.1 }}>
        {deck.map((s, i) => (
          <motion.div key={i} style={st(`deck-slot-${i + 1}`)} initial={{ opacity: 0, y: 26, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={pres(v)}>
            {s ? (
              <SkillCardV s={s} size="md" />
            ) : (
              <motion.div
                className="flex aspect-[1/1.16] w-full flex-col items-center justify-center gap-1.5 rounded-[18px] border-2 border-dashed border-[#2a3a5e] bg-[#0c1526]/60"
                animate={{ borderColor: ["#2a3a5e", "#35e0d0", "#2a3a5e"] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                <span className="text-[22px] font-bold text-[#2a3a5e]">+</span>
                <span className="px-2 text-center text-[8px] font-extrabold tracking-wider text-ink3">ПУСТОЙ СЛОТ</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
      <div className="mx-auto mt-4 w-full max-w-[300px] rounded-[14px] border border-line bg-panel px-3 py-2.5">
        <div className="flex items-center gap-2 text-[10.5px] font-bold text-ink2">
          <IDeck size={15} color={v.glow} />
          Пустой слот дышит. Рынок не ждёт тех, кто собрал колоду наполовину.
        </div>
      </div>
      <div className="flex-1" />
      <GButton variant="acc" block>
        Открыть библиотеку приёмов
      </GButton>
    </Frame>
  );
};

/* ========================================================== P21 SKILLS */
export const P21 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const groups: { g: "green" | "yellow" | "blue" | "red"; range: [number, number] }[] = [
    { g: "green", range: [0, 15] },
    { g: "yellow", range: [15, 24] },
    { g: "blue", range: [24, 33] },
    { g: "red", range: [33, 40] },
  ];
  return (
    <Frame page={page} v={v}>
      <Kicker2 v={v}>Библиотека · c01–c40</Kicker2>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[19px] font-extrabold text-white">Все приёмы</div>
        <div className="flex gap-1">
          {(["green", "yellow", "blue", "red"] as const).map((g) => (
            <span key={g} className="h-2.5 w-2.5 rounded-full" style={{ background: CARD_PALETTE[g].color }} />
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1">
        {groups.map((grp) => (
          <div key={grp.g} className="mb-3">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="rounded-full px-2 py-0.5 text-[8.5px] font-extrabold tracking-wider text-white" style={{ background: CARD_PALETTE[grp.g].color }}>
                {CARD_PALETTE[grp.g].label.toUpperCase()} · c{String(grp.range[0] + 1).padStart(2, "0")}–c{String(grp.range[1]).padStart(2, "0")}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SKILLS.slice(grp.range[0], grp.range[1]).map((s, i) => (
                <motion.button
                  key={s.id}
                  className="relative flex min-h-[44px] items-center gap-1.5 rounded-[12px] border px-2 py-1.5"
                  style={{ background: "#151f35", borderColor: "rgba(255,255,255,.1)", boxShadow: `inset 0 0 0 1.5px ${CARD_PALETTE[grp.g].color}` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 6) * 0.05, ...pres(v) }}
                  whileTap={{ scale: 0.92 }}
                  onTap={() => sfx.tick()}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-[8px]" style={{ background: CARD_PALETTE[grp.g].color }}>
                    <SkillIcon skill={s} size={20} />
                  </span>
                  <span className="pr-1 text-[9.5px] font-bold leading-tight text-ink">{s.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

/* =========================================================== P22-24 PROFILE */
export const P22 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const { st } = useAsset();
  const bars = [
    { l: "Чтение рынка", p: 85, c: "#35e0d0" },
    { l: "Риск", p: 72, c: "#3ddc97" },
    { l: "Дисциплина", p: 90, c: "#8b7bff" },
    { l: "Защита", p: 60, c: "#ffb84d" },
  ];
  return (
    <Frame page={page} v={v}>
      <Kicker2 v={v}>Профиль · статус игрока</Kicker2>
      <motion.div style={st("player-card")} className="flex items-center gap-3 rounded-[20px] border border-line bg-panel p-3.5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={pres(v)}>
        <motion.div className="glossy relative flex h-16 w-16 items-center justify-center rounded-[18px] border-2" style={{ borderColor: v.glow, background: "#0c1526", boxShadow: `0 0 24px ${v.glowSoft}` }} animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <Emblem size={44} />
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-extrabold text-white">Trend Hunter</span>
            <span className="rounded-full px-2 py-0.5 text-[8.5px] font-extrabold tracking-wider" style={{ background: `${v.glow}1f`, color: v.glow }}>
              LVL 07
            </span>
          </div>
          <div className="mt-1 text-[10.5px] font-bold text-ink3">сезон «Короткий фонд» · 212-е место</div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#0c1526]">
              <motion.div className="h-full rounded-full" style={{ background: v.glow }} initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ delay: 0.4, duration: 0.9, ease: ease.out }} />
            </div>
            <span className="text-[9.5px] font-extrabold text-ink2">420/600 XP</span>
          </div>
        </div>
      </motion.div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { ic: <IconBolt size={16} />, v: 5, l: "попытки" },
          { ic: <IconStar size={16} />, v: 48, l: "звёзды" },
          { ic: <IconCoin size={16} />, v: 320, l: "монеты" },
        ].map((x, i) => (
          <motion.div key={i} className="flex items-center justify-center gap-1.5 rounded-[16px] border border-line bg-[#0c1526] py-2.5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.1, ...pres(v) }}>
          {x.ic}
          <span className="text-[13px] font-extrabold text-white"><Counter value={x.v} /></span>
          <span className="text-[8.5px] font-bold text-ink3">{x.l}</span>
          </motion.div>
        ))}
      </div>

      <div style={st("stats-row")} className="mt-3 rounded-[20px] border border-line bg-panel p-3.5">
        <div className="mb-2.5 text-[10px] font-extrabold tracking-wider text-ink3">SKILL RADAR</div>
        <div className="space-y-2.5">
          {bars.map((b, i) => (
            <div key={b.l}>
              <div className="mb-1 flex justify-between text-[10.5px] font-bold">
                <span className="text-ink2">{b.l}</span>
                <span style={{ color: b.c }}>{b.p}/100</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#0c1526]">
                <motion.div className="h-full rounded-full" style={{ background: b.c }} initial={{ width: 0 }} animate={{ width: `${b.p}%` }} transition={{ delay: 0.4 + i * 0.12, duration: 0.8, ease: ease.out }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
};

export const P23 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const rows = [
    { t: "BTC/USDT · fakeout", r: "win", pts: 2450, d: "сегодня" },
    { t: "SOL/USDT · liquidity sweep", r: "win", pts: 1980, d: "вчера" },
    { t: "ETH/USDT · MTF trap", r: "loss", pts: -1120, d: "вчера" },
    { t: "BTC/USDT · retest play", r: "win", pts: 1640, d: "2 дна" },
  ];
  return (
    <Frame page={page} v={v}>
      <Kicker2 v={v}>Профиль · история боёв</Kicker2>
      <div className="mb-2 text-[19px] font-extrabold text-white">Последние заходы</div>
      <div className="min-h-0 flex-1">
        <div className="space-y-2">
          {rows.map((r, i) => (
            <motion.div
              key={i}
              className={`flex items-center gap-3 rounded-[16px] border p-3 ${r.r === "win" ? "border-line bg-panel" : "border-line bg-[#241a1c]"}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1, ...pres(v) }}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${r.r === "win" ? "bg-[#10241f]" : "bg-[#2a1517]"}`} style={{ boxShadow: `inset 0 0 0 1.5px ${r.r === "win" ? "#3ddc97" : "#ff5b6a"}` }}>
                {r.r === "win" ? <ICheck size={16} color="#3ddc97" stroke={3} /> : <span className="text-[13px] font-extrabold text-[#ff8a94]">✕</span>}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-bold text-white">{r.t}</div>
                <div className="text-[9.5px] font-bold text-ink3">{r.d}</div>
              </div>
              <span className={`text-[13px] font-extrabold ${r.r === "win" ? "text-[#3ddc97]" : "text-[#ff8a94]"}`}>
                {r.r === "win" ? "+" : ""}{r.pts} pts
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Frame>
  );
};

export const P24 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => (
  <Frame page={page} v={v}>
    <Kicker2 v={v}>Профиль · метрики</Kicker2>
    <div className="mb-2 text-[19px] font-extrabold text-white">Твои цифры. Честные.</div>
    <div className="grid grid-cols-2 gap-2.5">
      {[
        { l: "Win rate", v: "62%", c: "#3ddc97" },
        { l: "Средний R", v: "2.4R", c: "#35e0d0" },
        { l: "Лучшая серия", v: "5 боёв", c: "#8b7bff" },
        { l: "Дней в строю", v: "12", c: "#ffb84d" },
      ].map((x, i) => (
        <motion.div key={x.l} className="rounded-[18px] border border-line bg-panel p-3.5" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.1, ...pres(v) }}>
          <div className="text-[9.5px] font-extrabold tracking-wider text-ink3 uppercase">{x.l}</div>
          <div className="mt-1 text-[22px] font-extrabold" style={{ color: x.c }}>{x.v}</div>
        </motion.div>
      ))}
    </div>
    <motion.div className="mt-3 flex items-center gap-3 rounded-[18px] border border-line bg-panel p-3.5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, ...pres(v) }}>
      <motion.span animate={{ scale: [1, 1.15, 1], rotate: [0, -4, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
        <IFlame size={26} color="#ffb84d" />
      </motion.span>
      <div className="flex-1">
        <div className="text-[13px] font-extrabold text-white">12-дневная серия</div>
        <div className="text-[10px] font-bold text-ink3">Пропуск дня обнулит огонь. Система не злится. Система просто обнуляет.</div>
      </div>
    </motion.div>
    <div className="flex-1" />
    <GButton variant="ghost" block>
      Скрыть цифры от других
    </GButton>
  </Frame>
);

/* ========================================================= P25-29 SERVICE */
export const P25 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const [opened, setOpened] = useState(false);
  const { grant, toPt } = useGame();
  const boxRef = useRef<HTMLButtonElement>(null);
  return (
    <Frame page={page} v={v}>
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <Kicker color={v.glow}>Ежедневная выдача</Kicker>
        <div className="mt-2 text-[22px] font-extrabold text-white">Рынок платит за приход. Снова.</div>
        <motion.button
          ref={boxRef}
          className="glossy relative mt-7 flex h-36 w-36 items-center justify-center rounded-[30px] border-[3px] border-[#e3b54e]"
          style={{ background: "linear-gradient(180deg,#ffe08a,#d0b24a 60%,#a8842c)", boxShadow: "0 10px 0 #7a5f1c, 0 26px 50px rgba(208,178,74,.35)" }}
          animate={opened ? { scale: [1, 1.12, 1], rotate: [0, -3, 3, 0] } : { y: [0, -7, 0] }}
          transition={opened ? { duration: 0.5, ...spring.pop } : { y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }}
          whileTap={{ scale: 0.94, y: 4 }}
          onTap={() => {
            if (!opened) {
              setOpened(true);
              sfx.success();
              feel.reward();
              grant({ coins: 150, xp: 40, from: toPt(boxRef.current), confetti: true });
            }
          }}
        >
          <motion.span animate={opened ? { scale: [1, 0, 1], rotate: [0, 60, 0] } : {}} transition={{ duration: 0.5 }} className="flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 48 48" fill="none" stroke="#5a3d08" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="7" y="16" width="34" height="26" rx="4" />
              <path d="M4 16h40v8H4zM24 16v26" />
              <path d="M24 16c-6 0-9-3-9-6s4-4 6 1zM24 16c6 0 9-3 9-6s-4-4-6 1z" />
            </svg>
          </motion.span>
        </motion.button>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={opened ? { opacity: 1, y: 0 } : { opacity: 0 }} transition={{ delay: 0.5 }}>
          <div className="mt-6 flex gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[#241f12] px-3.5 py-1.5 text-[13px] font-extrabold text-[#ffe9b0]" style={{ boxShadow: "inset 0 0 0 1px #6b5a2e" }}>
              <IconCoin size={15} /> +150
            </span>
            <span className="rounded-full bg-[#10241f] px-3.5 py-1.5 text-[13px] font-extrabold text-[#9ff3e8]" style={{ boxShadow: "inset 0 0 0 1px #1f5e58" }}>
              +40 XP
            </span>
          </div>
          <p className="mt-4 text-center text-[10.5px] font-semibold text-ink3">Паника бесплатна. Приход — тоже, сегодня.</p>
        </motion.div>
      </div>
    </Frame>
  );
};

export const P26 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const [readAll, setReadAll] = useState(false);
  const notifs = [
    { t: "Новый урок: «Старшие таймфреймы»", s: "Академия · 5 минут", unread: true, c: "#35e0d0" },
    { t: "Вызов на дуэль от @whale_alert", s: "Ставка 120 монет", unread: true, c: "#ffb84d" },
    { t: "Турнир «Короткий фонд» завтра", s: "Призовой фонд 50 000", unread: false, c: "#8b7bff" },
  ];
  const unreadCount = readAll ? 0 : notifs.filter((n) => n.unread).length;
  return (
    <Frame page={page} v={v}>
      <Kicker2 v={v}>Уведомления</Kicker2>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[19px] font-extrabold text-white">Входящие сигналы</div>
        <motion.span
          key={unreadCount}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="rounded-full px-2 py-0.5 text-[9px] font-extrabold"
          style={{
            background: unreadCount ? "#2a1517" : "#10241f",
            color: unreadCount ? "#ff8a94" : "#9ff3e8",
            boxShadow: `inset 0 0 0 1px ${unreadCount ? "#ff5b6a" : "#1f5e58"}`,
          }}
        >
          {unreadCount ? `${unreadCount} новых` : "всё прочитано"}
        </motion.span>
      </div>
      <div className="flex flex-col gap-2">
        {notifs.map((n, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3 rounded-[16px] border border-line bg-panel p-3"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, ...pres(v) }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]" style={{ background: `${n.c}1a`, boxShadow: `inset 0 0 0 1.5px ${n.c}66` }}>
              <IStarLine size={15} color={n.c} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-bold text-white">{n.t}</div>
              <div className="text-[9.5px] font-bold text-ink3">{n.s}</div>
            </div>
            {n.unread && !readAll && (
              <motion.span className="h-2.5 w-2.5 rounded-full bg-[#ff5b6a]" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.3, repeat: Infinity }} />
            )}
          </motion.div>
        ))}
      </div>
      <div className="flex-1" />
      <GButton variant="ghost" block onTap={() => { setReadAll(true); sfx.tick(); }}>
        {readAll ? "Все сигналы обработаны" : "Отметить всё прочитанным"}
      </GButton>
    </Frame>
  );
};

export const P27 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const [t, setT] = useState({ sound: true, haptics: true, motion: true });
  const rows = [
    { k: "sound" as const, l: "Звуки", s: "синтез в рантайме" },
    { k: "haptics" as const, l: "Вибрация", s: "импульсы на события" },
    { k: "motion" as const, l: "Полный моушен", s: "idle-петли и партиклы" },
  ];
  const flip = (k: "sound" | "haptics" | "motion") => {
    const next = !t[k];
    setT((x) => ({ ...x, [k]: next }));
    // real effect, not just the toggle:
    if (k === "sound") setMuted(!next);
    if (k === "haptics") setHaptics(next);
    if (k === "motion") document.documentElement.classList.toggle("lite", !next);
    sfx.tick();
  };
  return (
    <Frame page={page} v={v}>
      <Kicker2 v={v}>Настройки</Kicker2>
      <div className="mb-3 text-[19px] font-extrabold text-white">Система под контролем. Пока.</div>
      <div className="flex flex-col gap-2">
        {rows.map((r, i) => (
          <motion.div key={r.k} className="flex items-center gap-3 rounded-[16px] border border-line bg-panel p-3.5" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.1, ...pres(v) }}>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-white">{r.l}</div>
              <div className="text-[10px] font-bold text-ink3">{r.s}</div>
            </div>
            <motion.button
              className="relative h-8 w-14 rounded-full p-1"
              animate={{ background: t[r.k] ? "#2e7f5c" : "#2a3a5e" }}
              whileTap={{ scale: 0.94 }}
              onTap={() => flip(r.k)}
            >
              <motion.span layout className="block h-6 w-6 rounded-full bg-white" transition={spring.soft} style={{ marginLeft: t[r.k] ? 24 : 0, boxShadow: "0 2px 4px rgba(0,0,0,.35)" }} />
            </motion.button>
          </motion.div>
        ))}
      </div>
      <div className="flex-1" />
      <div className="mx-auto w-full max-w-[300px] rounded-[14px] border border-line bg-[#0c1526] px-3 py-2.5 text-[10px] font-semibold leading-relaxed text-ink3">
        «Полный моушен» уважает системный prefers-reduced-motion. Отклики на тапы остаются всегда — иначе игра кажется сломанной.
      </div>
    </Frame>
  );
};

export const P28 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const rows = [
    { n: "0.1", tag: "base_trader", pts: 48200, me: false },
    { n: "0.2", tag: "liquidity_golem", pts: 41900, me: false },
    { n: "0.3", tag: "you_maybe", pts: 33400, me: true },
    { n: "0.4", tag: "wick_whisperer", pts: 29800, me: false },
  ];
  return (
    <Frame page={page} v={v}>
      <Kicker2 v={v}>Лидерборд · сезон</Kicker2>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[19px] font-extrabold text-white">Департамент лучших</div>
        <span className="text-[10px] font-bold text-ink3">сезон 4</span>
      </div>
      <div className="min-h-0 flex-1">
        <div className="space-y-2">
          {rows.map((r, i) => (
            <motion.div
              key={i}
              className={`flex items-center gap-3 rounded-[16px] border p-3 ${r.me ? "border-transparent bg-panel" : "border-line bg-[#0c1526]"}`}
              style={r.me ? { boxShadow: `0 0 0 1.5px ${v.glow}, 0 0 24px ${v.glowSoft}` } : undefined}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.12, ...pres(v) }}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-extrabold ${i === 0 ? "bg-[#241f12] text-[#ffe08a]" : i === 1 ? "bg-[#1a2033] text-[#cfd8ea]" : i === 2 ? "bg-[#2a1c10] text-[#ffb84d]" : "bg-[#151f35] text-ink3"}`} style={i < 3 ? { boxShadow: "inset 0 1px 0 rgba(255,255,255,.15)" } : undefined}>
                {i + 1}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#151f35]">
                <IUser size={15} color={r.me ? v.glow : "#6b7a9c"} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-bold text-white">{r.tag}</div>
                {r.me && <div className="text-[9px] font-extrabold" style={{ color: v.glow }}>ТЫ · 212-е место выше</div>}
              </div>
              <span className="text-[13px] font-extrabold text-white">{r.pts.toLocaleString("ru")}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Frame>
  );
};

export const P29 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => (
  <Frame page={page} v={v}>
    <Kicker2 v={v}>Турнир · live</Kicker2>
    <motion.div className="relative overflow-hidden rounded-[22px] border border-line bg-panel p-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={pres(v)}>
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl" style={{ background: v.glowSoft }} />
      <div className="flex items-center gap-2">
        <span className="rounded-full px-2 py-0.5 text-[8.5px] font-extrabold tracking-wider text-white" style={{ background: v.glow }}>
          LIVE
        </span>
        <span className="text-[10px] font-bold text-ink3">заканчивается через 2ч 14м</span>
      </div>
      <div className="mt-2 text-[20px] font-extrabold text-white">«Короткий фонд»</div>
      <div className="text-[11px] font-bold text-ink2">Призовой фонд 50 000 · 128 мест · ты — 45-й</div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#0c1526]">
        <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${v.glow}, #3ddc97)` }} initial={{ width: 0 }} animate={{ width: "35%" }} transition={{ delay: 0.5, duration: 1, ease: ease.out }} />
      </div>
      <div className="mt-1 text-[9.5px] font-bold text-ink3">35% игроков вылетели. Дверь уже закрылась.</div>
      <div className="mt-4">
        <GButton variant="acc" block>
          Войти в турнир
        </GButton>
      </div>
    </motion.div>
    <div className="flex-1" />
  </Frame>
);

/* =========================================================== P30-33 STATES */
const StateShell = ({ page, icon, title, text, v, children, iconColor }: { page: PageDef; icon: React.ReactNode; title: string; text: string; v: VariantDef; children?: React.ReactNode; iconColor: string }) => (
  <Frame page={page} v={v}>
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <motion.div className="flex h-24 w-24 items-center justify-center rounded-full" style={{ background: `${iconColor}14`, boxShadow: `inset 0 0 0 2px ${iconColor}55` }} animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
        {icon}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ...pres(v)}} className="mt-5 text-[22px] font-extrabold text-white">
        {title}
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-2 max-w-[250px] text-[12px] font-semibold leading-relaxed text-ink2">
        {text}
      </motion.p>
      {children}
    </div>
  </Frame>
);

export const P30 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const [st, setSt] = useState<"idle" | "loading" | "ok">("idle");
  const retry = () => {
    if (st !== "idle") return;
    setSt("loading");
    sfx.whoosh();
    setTimeout(() => {
      setSt("ok");
      sfx.success();
    }, 1400);
  };
  return (
    <StateShell
      page={page}
      icon={st === "ok" ? <ICheck size={38} color="#3ddc97" stroke={2.4} /> : <ICloud size={40} color="#5aa9ff" />}
      iconColor={st === "ok" ? "#3ddc97" : "#5aa9ff"}
      v={v}
      title={st === "ok" ? "Связь восстановлена" : "Связь потеряна"}
      text={st === "ok" ? "График обновлён. Рынок простил ровно на 1,4 секунды." : "График не обновляется. Рынок, между прочим, обновляется. Разница между вами теперь 100%."}
    >
      <div className="mt-6 w-full max-w-[240px]">
        <GButton variant={st === "ok" ? "ghost" : "acc"} block onTap={retry} disabled={st === "loading"}>
          {st === "ok" ? (
            "Свежие свечи на P06"
          ) : st === "loading" ? (
            <span className="flex items-center gap-2">
              <motion.span className="h-3.5 w-3.5 rounded-full border-2 border-[#04211e]/40 border-t-[#04211e]" animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
              Переподключаемся…
            </span>
          ) : (
            <>
              <IRetry size={15} color="#04211e" /> Попробовать снова
            </>
          )}
        </GButton>
      </div>
    </StateShell>
  );
};

export const P31 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => (
  <StateShell page={page} icon={<IEmptyBox size={40} color="#8b7bff" />} iconColor="#8b7bff" v={v} title="Рука пуста" text="Бой без приёмов — это не стратегия, это медитация с потерей капитала.">
    <div className="mt-6 w-full max-w-[240px]">
      <GButton variant="acc" block>
        Собрать колоду
      </GButton>
    </div>
  </StateShell>
);

export const P32 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => {
  const [st, setSt] = useState<"idle" | "loading" | "ok">("idle");
  const retry = () => {
    if (st !== "idle") return;
    setSt("loading");
    sfx.whoosh();
    setTimeout(() => {
      setSt("ok");
      sfx.success();
    }, 1300);
  };
  return (
    <StateShell
      page={page}
      icon={st === "ok" ? <ICheck size={38} color="#3ddc97" stroke={2.4} /> : <IWarn size={40} color="#ff5b6a" />}
      iconColor={st === "ok" ? "#3ddc97" : "#ff5b6a"}
      v={v}
      title={st === "ok" ? "Сделка отправлена" : "Сделка не ушла"}
      text={st === "ok" ? "Ордер ушёл с первого дубля. Такое у нас раз в квартал." : "Ордер упал в пустоту между серверами. Деньги на месте. Убеждения — проверь."}
    >
      <div className="mt-6 w-full max-w-[240px]">
        <GButton variant={st === "ok" ? "ghost" : "danger"} block onTap={retry} disabled={st === "loading"}>
          {st === "ok" ? (
            "Смотреть сделку в истории"
          ) : st === "loading" ? (
            <span className="flex items-center gap-2">
              <motion.span className="h-3.5 w-3.5 rounded-full border-2 border-[#2b0f0d]/40 border-t-[#2b0f0d]" animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
              Пересылаем…
            </span>
          ) : (
            <>
              <IRetry size={15} color="#2b0f0d" /> Повторить отправку
            </>
          )}
        </GButton>
      </div>
    </StateShell>
  );
};

export const P33 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => (
  <StateShell page={page} icon={<IPause size={40} color="#ffb84d" />} iconColor="#ffb84d" v={v} title="Пауза" text="Таймер раунда заморожен. Думай сколько нужно — рынок подождёт. В этот раз.">
    <div className="mt-6 flex w-full max-w-[240px] gap-2">
      <GButton variant="ghost" block>
        Выйти
      </GButton>
      <GButton variant="acc" block>
        <IPlay size={15} color="#04211e" /> Дальше
      </GButton>
    </div>
  </StateShell>
);

/* =========================================================== P34 VICTORY */
export const P34 = ({ page, v }: { page: PageDef; v: VariantDef; vnum: number }) => (
  <Frame page={page} v={v}>
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...pres(v) }} className="flex items-center gap-2">
        <ITrophy size={26} color="#ffb84d" />
        <span className="text-[26px] font-extrabold text-white">3/3 ЧИСТО</span>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-1 text-[12px] font-semibold text-ink2">
        Первые 8 минут завершены. Ты умеешь читать рынок.
      </motion.p>

      <motion.div
        className="mt-6 w-[118px]"
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: [90, -8, 0], opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7, ...spring.pop }}
        style={{ perspective: 800 }}
      >
        <SkillCardV s={skill("c38")} state="new" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-3 text-[13px] font-extrabold text-white">
        «Risk Cap» разблокирован
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-1 text-[10.5px] font-bold text-ink3">
        +200 монет · +120 XP · streak ×1
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="mt-7 flex w-full max-w-[300px] gap-2">
        <GButton variant="ghost" block onTap={() => sfx.whoosh()}>
          Заново
        </GButton>
        <GButton variant="gold" block onTap={() => sfx.whoosh()}>
          В Академию
        </GButton>
      </motion.div>
    </div>
    <div className="px-4 pb-2" />
  </Frame>
);
