import { useEffect, useState, type ReactNode } from "react";
import type { Page, Variant } from "../lib/pages";
import { useAssets } from "../lib/assets";
import TopBar, { type TopBarValues } from "../components/TopBar";
import { SkillIcon, SkillCard, Chart, BottomNav, navActiveOf, Cta, Pill } from "../components/bits";
import {
  LightningZapIcon, GraduationCapIcon, StarIcon, BellIcon, GearIcon,
  CrossedCandlestickSwordsIcon, CheckmarkIcon, NewspaperIcon, ClockLockIcon,
  HourglassIcon, UpArrowIcon, AlertTriangleIcon,
  VolumeBarsIcon, MultiTimeframeIcon,
} from "../components/icons";

type Props = {
  page: Page;
  v: Variant;
  values: TopBarValues;
  onCta?: () => void;
  onNav?: (id: string) => void;
  onRestart?: () => void;
};

/* ===================== shared atoms ===================== */

function Eyebrow({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="text-[9.5px] font-extrabold tracking-[.18em] text-[#2EE6C8] uppercase">{text}</p>;
}

function Progress({ i, n }: { i: number; n: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold tabular-nums text-[#c9d6e6]">{i}/{n}</span>
      <div className="flex gap-[3px]">
        {Array.from({ length: n }).map((_, k) => (
          <span key={k} className="h-[3px] w-[14px] rounded-full" style={{ background: k < i ? "#2EE6C8" : "rgba(255,255,255,.14)" }} />
        ))}
      </div>
    </div>
  );
}

function Head({ page, right }: { page: Page; right?: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center justify-between px-4 pt-3">
      <Eyebrow text={page.copy.eyebrow} />
      {right ?? (page.copy.progress ? <Progress i={page.copy.progress[0]} n={page.copy.progress[1]} /> : null)}
    </div>
  );
}

function Title({ children, sub }: { children: ReactNode; sub?: boolean }) {
  return <h1 className={`shrink-0 px-4 pt-1 font-extrabold leading-tight tracking-tight ${sub ? "text-[15px]" : "text-[19px]"}`}>{children}</h1>;
}

const rowColor = (val: string) => {
  const n = Number(val);
  if (Number.isNaN(n)) return "#8fa0b8";
  if (n >= 70) return "#50C890";
  if (n >= 50) return "#F0A84D";
  return "#EB635B";
};

function ScoreRows({ rows, animate = true }: { rows: [string, string][]; animate?: boolean }) {
  return (
    <div className="space-y-1.5">
      {rows.map(([k, val], i) => (
        <div key={k} className={`flex items-center justify-between rounded-xl border border-white/8 bg-white/[.04] px-3 py-2 ${animate ? "mp-fade-rise" : ""}`} style={{ animationDelay: `${i * 70}ms` }}>
          <span className="text-[11.5px] text-[#c9d6e6]">{k}</span>
          <div className="flex items-center gap-2">
            <div className="h-[5px] w-20 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full" style={{ width: `${Number(val) || 0}%`, background: rowColor(val) }} />
            </div>
            <span className="w-7 text-right font-mono text-[12.5px] font-black tabular-nums" style={{ color: rowColor(val) }}>{val}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Continue({
  page, ready, onCta, onGhost, tone = "signal",
}: { page: Page; ready: boolean; onCta?: () => void; onGhost?: () => void; tone?: "signal" | "danger" }) {
  return (
    <div className="shrink-0 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-2">
      {!ready && page.gate !== "none" && (
        <p className="mb-1.5 flex items-center justify-center gap-1.5 text-center text-[10px] text-[#F0A84D]">
          <AlertTriangleIcon size={12} /> Сначала выполните действие на экране
        </p>
      )}
      <Cta onClick={ready ? onCta : undefined} tone={tone}>
        <span className={ready ? "" : "opacity-60"}>{page.copy.cta}</span>
      </Cta>
      {page.copy.ctaGhost && (
        <button
          onClick={onGhost ?? onCta}
          className="tap mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[.05] px-4 py-2.5 text-[12.5px] font-bold text-[#c9d6e6] active:scale-[.985]"
        >
          {page.copy.ctaGhost}
        </button>
      )}
      {page.copy.hint && <p className="mt-2 text-center text-[10px] leading-tight text-[#7f90a8]">{page.copy.hint}</p>}
    </div>
  );
}

/* Chart with the future sealed until reveal */
function SealedChart({ v, seed, revealed = false, h = "100%" }: { v: Variant; seed: number; revealed?: boolean; h?: number | string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden rounded-2xl border border-white/8 bg-[#0a1018] reveal-${v.reveal}`} style={{ height: h }}>
      <Chart treatment={revealed ? v.chart : "candles"} seed={seed} tint={v.tint} dashed={v.chart === "minimal"} />
      {!revealed && (
        <div className="absolute inset-y-0 right-0 w-[34%] border-l-2 border-dashed border-[#47627F]/80 bg-[#0a1018]/72 backdrop-blur-[1px]">
          <div className="flex h-full flex-col items-center justify-center gap-2 text-[#47627F]">
            {[0, 1, 2].map((i) => <span key={i} className="text-[15px] font-black">?</span>)}
          </div>
        </div>
      )}
      {revealed && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {v.reveal === "scan" && <div className="reveal-scan absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-[#2EE6C8]/25 to-transparent" />}
          {v.reveal === "wipe" && <div className="reveal-wipe absolute inset-0 border-l-2 border-[#2EE6C8] bg-[#0a1018]/90" />}
          {v.reveal === "flip" && (
            <div className="reveal-flip absolute inset-0 grid place-items-center">
              <span className="rounded-full bg-[#2EE6C8] px-4 py-1 text-[10px] font-black tracking-[.2em] text-[#04211C]">REVEAL</span>
            </div>
          )}
          {v.reveal === "shatter" && (
            <div className="absolute inset-0 reveal-shatter">
              {Array.from({ length: 10 }, (_, i) => (
                <i key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, background: i % 2 ? "#2EE6C8" : "#fff", ["--i" as string]: i }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChartZone({ v, seed, revealed, ring, onTap }: { v: Variant; seed: number; revealed?: boolean; ring?: boolean; onTap?: () => void }) {
  return (
    <div className="relative min-h-0 flex-1 px-4 pt-2">
      <SealedChart v={v} seed={seed} revealed={revealed} />
      {ring && (
        <button
          onClick={onTap}
          aria-label="Ткнуть в место падения"
          className="absolute h-12 w-12 rounded-full border-2 border-[#2EE6C8] shadow-[0_0_16px_rgba(46,230,200,.5)] mp-pulse-glow"
          style={{ right: "22%", top: "52%" }}
        />
      )}
    </div>
  );
}

/* Decision option button */
function Opt({
  label, sub, icon, active, color = "#2EE6C8", onClick,
}: { label: string; sub?: string; icon?: ReactNode; active: boolean; color?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-decision={label}
      className="tap-gum flex flex-col items-center justify-center gap-[3px] rounded-2xl border-[1.5px] px-2 py-3"
      style={{
        background: active
          ? `linear-gradient(180deg, ${color}33, ${color}14)`
          : "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))",
        borderColor: active ? color : "rgba(255,255,255,.12)",
        color: active ? color : "#8fa0b8",
        boxShadow: active
          ? `0 4px 0 ${color}55, inset 0 1px 0 rgba(255,255,255,.18)`
          : "0 3px 0 rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.06)",
      }}
    >
      {icon}
      <span className="text-[12.5px] font-extrabold">{label}</span>
      {sub && <span className="text-[8.5px] leading-tight opacity-80">{sub}</span>}
    </button>
  );
}

function InvalidationBox() {
  return (
    <div className="rounded-2xl border-2 border-[#F0C274]/60 bg-[#F0C274]/10 px-3 py-2.5">
      <p className="text-[9px] font-black uppercase tracking-wider text-[#F0C274]">Я пойму, что ошибся, если…</p>
      <p className="mt-0.5 text-[12px] font-bold text-[#ffe9c2]">цена уйдёт ниже вчерашнего низа</p>
    </div>
  );
}

function Body({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`min-h-0 flex-1 overflow-hidden px-4 pt-2 ${className}`}>{children}</div>;
}

/* Seal: crossed candlesticks in a circle = «печать решения» */
function SealMark({ size = 76 }: { size?: number }) {
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border-[3px] border-[#2EE6C8] shadow-[0_0_28px_rgba(46,230,200,.45)]" />
      <CrossedCandlestickSwordsIcon size={size * 0.62} />
    </div>
  );
}

/* ===================== page ===================== */
export default function Screen({ page, v, values, onCta, onNav, onRestart }: Props) {
  const seed = Number(page.id.slice(1)) * 13 + v.letter.charCodeAt(0);
  const [pick, setPick] = useState<string | null>(null);
  const [facts, setFacts] = useState<number[]>([0]);
  const [toggles, setToggles] = useState<Record<string, boolean>>({ sound: true, remind: true, terms: false, anim: false });
  const assetBundle = useAssets();
  useEffect(() => { setPick(null); setFacts([0]); }, [page.id]);

  const ready =
    page.gate === "none" || page.gate === "acknowledge"
      ? true
      : page.gate === "decision" || page.gate === "decisionFull"
        ? !!pick
        : page.gate === "reasoning"
          ? !!pick
          : page.gate === "fact"
            ? facts.length > 0
            : page.gate === "tapChart"
              ? false
              : true;

  let inner: ReactNode = null;

  switch (page.kind) {
    /* ---------- P01 splash ---------- */
    case "splash":
      inner = (
        <>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6">
            <SealMark size={92} />
            <div className="text-center">
              {page.copy.eyebrow && <Pill color="#2EE6C8">{page.copy.eyebrow}</Pill>}
              <h1 className="mt-2 text-[26px] font-black leading-none tracking-tight">{page.copy.title}</h1>
              <p className="mx-auto mt-2 max-w-[250px] text-[12px] leading-snug text-[#8fa0b8]">{page.copy.body}</p>
            </div>
          </div>
          <div className="shrink-0 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-2">
            <Cta onClick={onCta}>{page.copy.cta}</Cta>
            <p className="mt-2 text-center text-[10px] text-[#7f90a8]">{page.copy.hint}</p>
          </div>
        </>
      );
      break;

    /* ---------- P02 tutorial tap ---------- */
    case "tutorialTap":
      inner = (
        <>
          <Head page={page} />
          <Title>{page.copy.title}</Title>
          <div className="min-h-0 flex-1">
            <ChartZone v={v} seed={seed} ring onTap={onCta} />
          </div>
          <div className="shrink-0 px-4 pb-[max(14px,env(safe-area-inset-bottom))]">
            <div className="rounded-2xl border-2 border-dashed border-[#33465f] px-3 py-2.5 text-center text-[11.5px] text-[#93a5bd]">
              {page.copy.hint}
            </div>
          </div>
        </>
      );
      break;

    /* ---------- P03 one fact ---------- */
    case "fact":
      inner = (
        <>
          <Head page={page} />
          <Title>Один факт — одна опора</Title>
          <ChartZone v={v} seed={seed} />
          <div className="shrink-0 space-y-2 px-4 pt-2">
            <div className="flex items-center gap-2.5 rounded-2xl border-2 border-[#2EE6C8]/70 bg-[#2EE6C8]/8 px-3 py-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#2EE6C8]/15 text-[#2EE6C8]"><SkillIcon id="c25" className="h-5 w-5" /></span>
              <div>
                <p className="text-[12.5px] font-black">Как двигалась цена</p>
                <p className="text-[11px] text-[#a9bad0]">Три дня цена стояла на одном месте</p>
              </div>
            </div>
            <div className="rounded-xl bg-white/[.04] px-3 py-2 text-[11px] text-[#a9bad0]">
              Это факт. На факты можно опираться в решении.
            </div>
          </div>
          <Continue page={page} ready onCta={onCta} />
        </>
      );
      break;

    /* ---------- P04 binary decision ---------- */
    case "decision2":
      inner = (
        <>
          <Head page={page} />
          <Title>{page.copy.title}</Title>
          <ChartZone v={v} seed={seed} />
          <div className="shrink-0 px-4 pt-2">
            <div className="grid grid-cols-2 gap-2.5">
              <Opt label="Цена вырастет" icon={<UpArrowIcon size={18} className="rotate-0" />} active={pick === "up"} color="#50C890" onClick={() => setPick("up")} />
              <Opt label="Цена упадёт" icon={<UpArrowIcon size={18} className="rotate-180" />} active={pick === "down"} color="#EB635B" onClick={() => setPick("down")} />
            </div>
            <p className="mt-2 text-center text-[10px] text-[#7f90a8]">{page.copy.hint}</p>
          </div>
          <Continue page={page} ready={ready} onCta={onCta} />
        </>
      );
      break;

    /* ---------- P05 reasoning ---------- */
    case "reasoning": {
      const opts = [
        { id: "fact", t: "Цена долго стояла на месте", icon: <SkillIcon id="c25" className="h-5 w-5" /> },
        { id: "history", t: "Раньше после такого она падала", icon: <SkillIcon id="c28" className="h-5 w-5" /> },
        { id: "guess", t: "Просто кажется", icon: <HourglassIcon size={16} /> },
      ];
      inner = (
        <>
          <Head page={page} />
          <Title>{page.copy.title}</Title>
          <Body className="pt-3">
            <div className="space-y-2">
              {opts.map((o, i) => (
                <button key={o.id} onClick={() => setPick(o.id)}
                  className="tap flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left"
                  style={{
                    background: pick === o.id ? "rgba(46,230,200,.10)" : "rgba(255,255,255,.04)",
                    borderColor: pick === o.id ? "#2EE6C8" : "rgba(255,255,255,.1)",
                  }}>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-black/25 text-[#2EE6C8]">{o.icon}</span>
                  <span className="flex-1 text-[12.5px] font-bold">{o.t}</span>
                  {pick === o.id && <CheckmarkIcon size={16} className="text-[#2EE6C8]" />}
                  {i === 0}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10.5px] text-[#7f90a8]">{page.copy.hint}</p>
          </Body>
          <Continue page={page} ready={ready} onCta={onCta} />
        </>
      );
      break;
    }

    /* ---------- P06 seal ---------- */
    case "seal":
      inner = (
        <>
          <div className="min-h-0 flex-1 px-4">
            <SealedChart v={v} seed={seed} />
          </div>
          <div className="absolute inset-0 z-10 grid place-items-center bg-black/72 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-[#111a28] px-7 py-6 text-center shadow-2xl">
              <SealMark size={72} />
              <h2 className="text-[20px] font-black">{page.copy.title}</h2>
              <p className="text-[12px] text-[#a9bad0]">{page.copy.body}</p>
              <div className="mt-1 w-full"><Cta onClick={onCta}>{page.copy.cta}</Cta></div>
            </div>
          </div>
        </>
      );
      break;

    /* ---------- P07 reveal (first run) ---------- */
    case "reveal":
      inner = (
        <>
          <Head page={page} right={<Pill color="#2EE6C8">РАСКРЫТО</Pill>} />
          <Title>{page.copy.title}</Title>
          <ChartZone v={v} seed={seed} revealed />
          <div className="shrink-0 px-4 pt-2">
            <div className="rounded-2xl border border-white/8 bg-white/[.04] px-3 py-2.5 text-[12px] text-[#c9d6e6]">{page.copy.body}</div>
          </div>
          <Continue page={page} ready onCta={onCta} />
        </>
      );
      break;

    /* ---------- P08 first score ---------- */
    case "scoreFirst":
      inner = (
        <>
          <Head page={page} />
          <h1 className="shrink-0 px-4 pt-1 text-[19px] font-extrabold leading-tight tracking-tight text-[#2EE6C8]">{page.copy.title}</h1>
          <Body className="pt-3">
            <ScoreRows rows={page.copy.meta ?? []} />
            <div className="mt-2 rounded-2xl border-2 border-dashed border-[#33465f] px-3 py-2.5 text-[11px] text-[#93a5bd]">
              Остальные строки появятся, когда вы начнёте ими пользоваться.
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#5AA9FF]/40 bg-[#5AA9FF]/10 px-3 py-2.5">
              <Pill color="#5AA9FF">повезло</Pill>
              <span className="text-[11px] text-[#bcd4ff]">Такое совпадение может не повториться.</span>
            </div>
          </Body>
          <Continue page={page} ready onCta={onCta} />
        </>
      );
      break;

    /* ---------- P09 manifesto ---------- */
    case "manifesto":
      inner = (
        <>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 px-7 text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-[#2EE6C8]/10 border border-[#2EE6C8]/30 text-[#2EE6C8] mp-pulse-glow">
              <SkillIcon id="c31" className="h-14 w-14" />
            </div>
            <div>
              <Eyebrow text={page.copy.eyebrow} />
              <h1 className="mt-2 text-[21px] font-black leading-tight">{page.copy.title}</h1>
              <p className="mx-auto mt-2 max-w-[270px] text-[13px] leading-relaxed text-[#a9bad0]">{page.copy.body}</p>
            </div>
          </div>
          <div className="shrink-0 px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
            <Cta onClick={onCta}>{page.copy.cta}</Cta>
          </div>
        </>
      );
      break;

    /* ---------- P10 run 2: invalidation required ---------- */
    case "invalidation":
      inner = (
        <>
          <Head page={page} />
          <Title>Ваше решение</Title>
          <ChartZone v={v} seed={seed} />
          <div className="shrink-0 space-y-2 px-4 pt-2">
            <div className="grid grid-cols-2 gap-2.5">
              <Opt label="Цена вырастет" icon={<UpArrowIcon size={16} />} active={(pick ?? "up") === "up"} color="#50C890" onClick={() => setPick("up")} />
              <Opt label="Цена упадёт" icon={<UpArrowIcon size={16} className="rotate-180" />} active={pick === "down"} color="#EB635B" onClick={() => setPick("down")} />
            </div>
            <InvalidationBox />
          </div>
          <Continue page={page} ready={ready} onCta={onCta} />
        </>
      );
      break;

    /* ---------- P11 process over result ---------- */
    case "scoreProcess":
      inner = (
        <>
          <Head page={page} />
          <Title>{page.copy.title}</Title>
          <Body className="pt-3">
            <ScoreRows rows={page.copy.meta ?? []} />
            <div className="mt-3 rounded-2xl border-2 border-[#5AA9FF]/50 bg-[#5AA9FF]/10 px-4 py-3 text-center">
              <span className="font-mono text-[26px] font-black text-[#9cc6ff]">78</span>
              <div className="mt-1"><Pill color="#5AA9FF">думал + не повезло</Pill></div>
            </div>
            <p className="mt-2 text-[11.5px] leading-snug text-[#a9bad0]">{page.copy.body}</p>
          </Body>
          <Continue page={page} ready onCta={onCta} />
        </>
      );
      break;

    /* ---------- P12 contradicting facts ---------- */
    case "contradiction":
      inner = (
        <>
          <Head page={page} right={<Pill color="#F0A84D">факты спорят</Pill>} />
          <Title sub>{page.copy.title}</Title>
          <ChartZone v={v} seed={seed} />
          <div className="shrink-0 space-y-2 px-4 pt-2">
            <div className="flex items-center gap-2 rounded-2xl border border-[#2EE6C8]/60 bg-[#2EE6C8]/8 px-3 py-2">
              <TrendUpMini />
              <span className="text-[11.5px] font-bold">Цена росла три дня подряд</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[#F0A84D]/60 bg-[#F0A84D]/8 px-3 py-2">
              <VolumeBarsIcon size={18} className="text-[#F0A84D]" />
              <span className="text-[11.5px] font-bold">Покупки становятся всё слабее</span>
            </div>
            <div className="rounded-2xl border-2 border-dashed border-[#33465f] px-3 py-2.5 text-[11px] text-[#93a5bd]">{page.copy.body}</div>
          </div>
          <Continue page={page} ready onCta={onCta} onGhost={onCta} />
        </>
      );
      break;

    /* ---------- P13 lesson ---------- */
    case "lesson":
      inner = (
        <>
          <Head page={page} />
          <Title>{page.copy.title}</Title>
          <ChartZone v={v} seed={seed} />
          <div className="shrink-0 space-y-2 px-4 pt-2">
            <p className="text-[12.5px] leading-snug text-[#c9d6e6]">{page.copy.body}</p>
            <div className="flex items-center gap-2 text-[10.5px] text-[#7f90a8]">
              <HourglassIcon size={14} className="text-[#2EE6C8]" /> {page.copy.hint}
            </div>
          </div>
          <Continue page={page} ready onCta={onCta} />
        </>
      );
      break;

    /* ---------- P14 chapter done: 4 cards, 1 slot ---------- */
    case "chapterDone": {
      const ids = ["c01", "c03", "c02", "c28"];
      inner = (
        <>
          <Head page={page} right={<Pill color="#F0C274">4 карты</Pill>} />
          <Title>{page.copy.title}</Title>
          <Body className="pt-3">
            <div className="grid grid-cols-4 gap-2">
              {ids.map((id, i) => (
                <button key={id} onClick={() => setPick(id)} className="tap" style={{ transform: pick && pick !== id ? "scale(.94)" : "none", opacity: pick && pick !== id ? .6 : 1 }}>
                  <SkillCard id={id} locked={false} />
                  {i === 0 && <span className="sr-only">new</span>}
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-2xl border-2 border-[#F0C274]/60 bg-[#F0C274]/10 px-3 py-2.5 text-[11.5px] text-[#ffe9c2]">
              {page.copy.body}
            </div>
          </Body>
          <Continue page={page} ready={ready} onCta={onCta} />
        </>
      );
      break;
    }

    /* ---------- P15 apply card ---------- */
    case "applyCard":
      inner = (
        <>
          <Head page={page} />
          <Title sub>{page.copy.title}</Title>
          <ChartZone v={v} seed={seed} />
          <div className="shrink-0 flex items-center gap-2 px-4 pt-2">
            <div className="w-14 shrink-0"><SkillCard id="c26" /></div>
            <div className="rounded-2xl border border-[#2EE6C8]/50 bg-[#2EE6C8]/8 px-3 py-2 text-[11.5px] font-bold text-[#c9f6ee]">
              {page.copy.body}
            </div>
          </div>
          <Continue page={page} ready onCta={onCta} />
        </>
      );
      break;

    /* ---------- P16 academy tree ---------- */
    case "academy": {
      const topics: [string, string, string, string, boolean][] = [
        ["Тема 1", "Основы сценария", "4/4", "c03", true],
        ["Тема 2", "Структура и уровни", "3/4", "c28", true],
        ["Тема 3", "Режим рынка", "1/4", "c19", false],
        ["Тема 4", "Анти-паттерны", "0/4", "c36", false],
      ];
      inner = (
        <>
          <Head page={page} right={<Pill color="#2EE6C8">2 / 8 тем</Pill>} />
          <Title>Дерево тем</Title>
          <Body className="pt-2">
            <div className="space-y-2">
              {topics.map(([tag, name, prog, icon, done]) => (
                <button key={tag} onClick={onCta} className="tap flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-white/[.04] p-2 text-left">
                  <div className="h-11 w-11 shrink-0"><SkillCard id={icon} locked={!done} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[8.5px] uppercase tracking-wider" style={{ color: done ? "#2EE6C8" : "#7f90a8" }}>{tag}</p>
                    <p className="truncate text-[13px] font-bold">{name}</p>
                    <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full" style={{ width: `${Math.round(evalProg(prog))}%`, background: done ? "#2EE6C8" : "#F0A84D" }} />
                    </div>
                  </div>
                  <span className="shrink-0 text-[10.5px] font-bold tabular-nums text-[#7f90a8]">{prog}</span>
                </button>
              ))}
            </div>
          </Body>
          <div className="shrink-0 px-4 pb-[max(12px,env(safe-area-inset-bottom))]"><Cta onClick={onCta}>{page.copy.cta}</Cta></div>
        </>
      );
      break;
    }

    /* ---------- P17 topic lesson ---------- */
    case "academyTopic":
      inner = (
        <>
          <Head page={page} right={page.copy.progress ? <Progress i={page.copy.progress[0]} n={page.copy.progress[1]} /> : null} />
          <Title>Рост без покупателей</Title>
          <ChartZone v={v} seed={seed} />
          <div className="shrink-0 space-y-2 px-4 pt-2">
            <p className="text-[12.5px] leading-snug text-[#c9d6e6]">{page.copy.body}</p>
            <div className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-[#33465f] px-3 py-2 text-[11px] text-[#93a5bd]">
              <ClockLockIcon size={16} className="shrink-0 text-[#F0C274]" /> Карта этой темы откроется в конце главы
            </div>
          </div>
          <Continue page={page} ready onCta={onCta} />
        </>
      );
      break;

    /* ---------- P18 deck ---------- */
    case "deck": {
      const ids = ["c01", "c03", "c02", "c20", "c28", "c33"];
      inner = (
        <>
          <Head page={page} right={<Pill color="#2EE6C8">7 / 40</Pill>} />
          <Title>Мои приёмы</Title>
          <Body className="pt-2">
            <div className="grid grid-cols-4 gap-2">
              {ids.map((id, i) => (
                <div key={id} style={{ opacity: i === 5 ? .45 : 1 }}>
                  <SkillCard id={id} locked={i === 5} />
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-2xl border border-white/8 bg-white/[.04] p-3">
              <p className="text-[12.5px] font-black">Опора цены</p>
              <p className="mt-0.5 text-[11px] text-[#93a5bd]">Находить уровни, от которых цена уже отталкивалась.</p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-[#7f90a8]">
                <span>Освоение · применена 9 раз</span>
                <span className="font-black text-[#2EE6C8]">64%</span>
              </div>
              <div className="mt-1 h-[4px] overflow-hidden rounded-full bg-white/10"><div className="h-full w-[64%] rounded-full bg-[#2EE6C8]" /></div>
            </div>
          </Body>
          <div className="shrink-0 px-4 pb-[max(12px,env(safe-area-inset-bottom))]">
            <button onClick={onCta} className="tap w-full rounded-2xl border border-white/12 bg-white/[.05] py-3 text-[12.5px] font-bold text-[#c9d6e6]">{page.copy.cta}</button>
          </div>
        </>
      );
      break;
    }

    /* ---------- P19 loadout ---------- */
    case "loadout":
      inner = (
        <>
          <Head page={page} />
          <Title>{page.copy.title}</Title>
          <Body className="grid place-items-center pt-3">
            <div className="grid w-full grid-cols-3 gap-2.5">
              <div className="rounded-2xl border-2 border-[#2EE6C8] bg-[#2EE6C8]/8 p-2 shadow-[0_0_16px_-4px_rgba(46,230,200,.6)]">
                <SkillCard id="c03" />
              </div>
              {[0, 1].map((i) => (
                <div key={i} className="grid aspect-square place-items-center rounded-2xl border-2 border-dashed border-[#33465f] text-[#5a7characters]">
                  <ClockLockIcon size={26} className="text-[#556980]" />
                </div>
              ))}
            </div>
            <div className="mt-3 w-full rounded-2xl bg-[#0b1320] p-3">
              <div className="flex flex-wrap gap-1.5">
                {["Опора цены", "Кто покупает", "Общая картина"].map((t) => (
                  <span key={t} className="rounded-full bg-[#2EE6C8]/15 px-2.5 py-1 text-[10px] font-bold text-[#9beaf3]">{t}</span>
                ))}
                <span className="rounded-full bg-[#F0A84D]/15 px-2.5 py-1 text-[10px] font-bold text-[#ffd98f]">незнакомая тема · 1</span>
              </div>
              <p className="mt-2 text-[10.5px] text-[#7f90a8]">{page.copy.body}</p>
            </div>
          </Body>
          <div className="shrink-0 px-4 pb-[max(12px,env(safe-area-inset-bottom))]">
            <Cta onClick={onCta}>{page.copy.cta}</Cta>
          </div>
        </>
      );
      break;

    /* ---------- P20 arena hub ---------- */
    case "arenaHub":
      inner = (
        <>
          <Head page={page} right={<Pill color="#EB635B">серия 4 дня</Pill>} />
          <Title>Арена</Title>
          <Body className="space-y-2 pt-2">
            <button onClick={onCta} className="tap w-full rounded-2xl border-2 border-[#2EE6C8]/60 bg-[#2EE6C8]/8 p-3 text-left">
              <p className="text-[9.5px] text-[#9beaf3]">Не закончено</p>
              <p className="text-[13.5px] font-black">Заход · дневной график</p>
              <div className="mt-1.5 h-[5px] w-full overflow-hidden rounded-full bg-white/10"><div className="h-full w-[60%] rounded-full bg-[#2EE6C8]" /></div>
            </button>
            <button onClick={onCta} className="tap flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-white/[.04] p-3 text-left">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#2EE6C8]/12 text-[#2EE6C8]"><CrossedCandlestickSwordsIcon size={20} /></span>
              <div><p className="text-[13px] font-black">Заход дня</p><p className="text-[10px] text-[#7f90a8]">на то, что получается хуже всего</p></div>
            </button>
            <div className="rounded-2xl border-2 border-dashed border-[#33465f] p-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#7f90a8]">Что получается хуже всего</p>
              <p className="mt-1 text-[11px] text-[#93a5bd]">• часто решаете без факта<br />• редко решаете, когда остановиться</p>
            </div>
            <p className="text-center text-[10.5px] text-[#7f90a8]">{page.copy.hint}</p>
          </Body>
        </>
      );
      break;

    /* ---------- P21 full run chart + sources ---------- */
    case "runChart": {
      const chips: [string, ReactNode, boolean, boolean][] = [
        ["График", <SkillIcon id="c01" className="h-5 w-5" />, true, false],
        ["Старший ТФ", <MultiTimeframeIcon size={16} />, false, false],
        ["Сделки", <VolumeBarsIcon size={16} />, false, false],
        ["Новости", <NewspaperIcon size={16} />, false, true],
        ["Проект", <AlertTriangleIcon size={16} />, false, true],
      ];
      inner = (
        <>
          <Head page={page} />
          <ChartZone v={v} seed={seed} />
          <div className="shrink-0 px-4 pt-2">
            <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-[#7f90a8]">Где можно смотреть</p>
            <div className="flex gap-1.5 overflow-hidden">
              {chips.map(([label, icon, on, locked]) => (
                <div key={label as string}
                  className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1.5 text-[10.5px] font-bold ${locked ? "opacity-45" : ""}`}
                  style={{ borderColor: on ? "#2EE6C8" : "rgba(255,255,255,.12)", background: on ? "rgba(46,230,200,.1)" : "rgba(255,255,255,.04)", color: on ? "#9beaf3" : "#c9d6e6" }}>
                  {locked ? <ClockLockIcon size={13} /> : icon}
                  {label as string}
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-14 shrink-0"><SkillCard id="c03" /></div>
              <div className="grid h-[72px] flex-1 place-items-center rounded-2xl border-2 border-dashed border-[#33465f] text-[10px] text-[#556980]">пустой слот</div>
            </div>
          </div>
          <Continue page={page} ready onCta={onCta} />
        </>
      );
      break;
    }

    /* ---------- P22 facts bottom sheet ---------- */
    case "factsSheet": {
      const factList = [
        "Покупают всё меньше третий день",
        "Вчера был один крупный продавец",
        "Сделок меньше, чем обычно для этого дня",
      ];
      const toggle = (i: number) => setFacts((f) => f.includes(i) ? f.filter((x) => x !== i) : [...f, i]);
      inner = (
        <>
          <div className="min-h-0 flex-1 px-4"><SealedChart v={v} seed={seed} /></div>
          <div className="absolute inset-0 z-10 flex flex-col justify-end bg-black/60">
            <div className="rounded-t-3xl border-t border-white/10 bg-[#141e2c] p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
              <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/20" />
              <div className="mb-2 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2EE6C8]/12 text-[#2EE6C8]"><VolumeBarsIcon size={18} /></span>
                <h2 className="text-[14px] font-black">Сделки и объёмы</h2>
              </div>
              <div className="space-y-1.5">
                {factList.map((t, i) => {
                  const on = facts.includes(i);
                  return (
                    <button key={t} onClick={() => toggle(i)} className="tap flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left"
                      style={{ borderColor: on ? "#2EE6C8" : "rgba(255,255,255,.1)", background: on ? "rgba(46,230,200,.08)" : "rgba(255,255,255,.03)" }}>
                      <span className="grid h-5 w-5 place-items-center rounded-md border" style={{ borderColor: on ? "#2EE6C8" : "#3a4a60", background: on ? "#2EE6C8" : "transparent", color: "#06241f" }}>
                        {on && <CheckmarkIcon size={13} />}
                      </span>
                      <span className="flex-1 text-[12px] font-bold">{t}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[10.5px] text-[#7f90a8]">Выбрано фактов: {facts.length} · минимум для решения — 1</p>
              <div className="mt-2"><Continue page={page} ready={ready} onCta={onCta} /></div>
            </div>
          </div>
        </>
      );
      break;
    }

    /* ---------- P23 decision panel: 4 actions ---------- */
    case "decisionPanel":
      inner = (
        <>
          <Head page={page} />
          <Title>{page.copy.title}</Title>
          <div className="min-h-0 flex-1 overflow-hidden px-4 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <Opt label="Вырастет" sub="лонг" icon={<UpArrowIcon size={18} />} active={pick === "long"} color="#50C890" onClick={() => setPick("long")} />
              <Opt label="Упадёт" sub="шорт" icon={<UpArrowIcon size={18} className="rotate-180" />} active={pick === "short"} color="#EB635B" onClick={() => setPick("short")} />
              <Opt label="Подожду" sub="wait · ретест" icon={<HourglassIcon size={18} />} active={pick === "wait"} color="#5AA9FF" onClick={() => setPick("wait")} />
              <Opt label="Не войду" sub="no trade" icon={<AlertTriangleIcon size={18} />} active={pick === "notrade"} color="#F0A84D" onClick={() => setPick("notrade")} />
            </div>
            <div className="mt-2 rounded-xl bg-[#0b1320] px-3 py-2">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#7f90a8]">Опираюсь на</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {["цена стояла", "покупают меньше"].map((t) => (
                  <span key={t} className="rounded-full bg-[#2EE6C8]/15 px-2 py-1 text-[10px] font-bold text-[#9beaf3]">{t}</span>
                ))}
              </div>
            </div>
            <div className="mt-2"><InvalidationBox /></div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-[9.5px] text-[#7f90a8]"><span>Насколько уверены</span><span className="font-black text-[#c9d6e6]">70%</span></div>
              <div className="mt-1 h-[5px] overflow-hidden rounded-full bg-white/10"><div className="h-full w-[70%] rounded-full bg-[#2EE6C8]" /></div>
            </div>
          </div>
          <Continue page={page} ready={ready} onCta={onCta} />
        </>
      );
      break;

    /* ---------- P24 full reveal ---------- */
    case "revealFull":
      inner = (
        <>
          <Head page={page} right={<Pill color="#2EE6C8">РАСКРЫТО</Pill>} />
          <Title>{page.copy.title}</Title>
          <ChartZone v={v} seed={seed} revealed />
          <div className="shrink-0 space-y-1.5 px-4 pt-2">
            <div className="rounded-xl bg-white/[.04] px-3 py-2 text-[11.5px] text-[#c9d6e6]">Рост продолжился один день, затем цена вернулась ниже точки входа.</div>
            <div className="rounded-xl border border-[#5AA9FF]/40 bg-[#5AA9FF]/10 px-3 py-2 text-[11.5px] text-[#bcd4ff]">Ваша отметка «пойму, что ошибся» сработала бы вовремя.</div>
          </div>
          <Continue page={page} ready onCta={onCta} />
        </>
      );
      break;

    /* ---------- P25 full score ---------- */
    case "scoreFull":
      inner = (
        <>
          <Head page={page} />
          <Title sub>{page.copy.title}</Title>
          <Body className="pt-2">
            <ScoreRows rows={page.copy.meta ?? []} />
            <div className="mt-2 rounded-2xl border-2 border-[#5AA9FF]/50 bg-[#5AA9FF]/10 py-2 text-center">
              <span className="font-mono text-[24px] font-black text-[#9cc6ff]">74</span>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {[["думал+повезло", "#2EE6C8"], ["думал+не повезло", "#5AA9FF"], ["наугад+повезло", "#F0A84D"], ["наугад+не повезло", "#EB635B"]].map(([t, col]) => (
                <span key={t} className="rounded-full px-2 py-1 text-[8.5px] font-bold" style={{ background: `${col}22`, color: col }}>{t}</span>
              ))}
            </div>
          </Body>
          <Continue page={page} ready onCta={onCta} />
        </>
      );
      break;

    /* ---------- P26 debrief ---------- */
    case "debrief":
      inner = (
        <>
          <Head page={page} />
          <Title>Разбор</Title>
          <Body className="space-y-2 pt-2">
            <div className="rounded-xl bg-white/[.04] p-3">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#7f90a8]">Главное наблюдение</p>
              <p className="mt-1 text-[12px] text-[#c9d6e6]">Рост был, но покупателей становилось меньше. Вы это видели и всё равно вошли.</p>
            </div>
            <div className="rounded-xl border border-[#8B72D4]/50 bg-[#8B72D4]/10 p-3">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#b7a6ec]">Это повторяется</p>
              <p className="mt-1 text-[12px] text-[#d9d0f4]">4 раза из последних 6 вы входили, когда покупки слабели.</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border-2 border-dashed border-[#33465f] p-2.5">
              <div className="w-12 shrink-0"><SkillCard id="c26" /></div>
              <span className="text-[11px] text-[#93a5bd]">Этот приём как раз про такую ситуацию.</span>
            </div>
            <div className="rounded-xl border border-[#2EE6C8]/50 bg-[#2EE6C8]/8 p-3">
              <p className="text-[9px] text-[#9beaf3]">Через 3 дня</p>
              <p className="text-[12.5px] font-black">Похожая ситуация, другой актив</p>
            </div>
          </Body>
          <Continue page={page} ready onCta={onCta} />
        </>
      );
      break;

    /* ---------- P27 profile ---------- */
    case "profile":
      inner = (
        <>
          <Head page={page} />
          <Title>{page.copy.title}</Title>
          <Body className="space-y-2 pt-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[["Заходов", "63"], ["Приёмов", "7"], ["Серия", "4"]].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-white/8 bg-white/[.04] py-2.5">
                  <p className="font-mono text-[17px] font-black">{v}</p>
                  <p className="text-[8.5px] uppercase tracking-wider text-[#7f90a8]">{k}</p>
                </div>
              ))}
            </div>
            <p className="pt-1 text-[9px] font-black uppercase tracking-wider text-[#7f90a8]">За последние 10 заходов</p>
            <ScoreRows rows={[["На что опирались", "82"], ["Когда остановиться", "47"], ["Уверенность совпала", "35"]]} animate={false} />
            <div className="rounded-xl border-2 border-dashed border-[#33465f] p-3">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#7f90a8]">Ловушки, которые вы узнаёте</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {["ложный рост", "страх упустить"].map((t) => (
                  <span key={t} className="rounded-full bg-[#2EE6C8]/15 px-2 py-1 text-[10px] font-bold text-[#9beaf3]">{t}</span>
                ))}
                <span className="rounded-full bg-white/8 px-2 py-1 text-[10px] font-bold text-[#7f90a8]">ещё 2</span>
              </div>
            </div>
          </Body>
          <div className="shrink-0 px-4 pb-[max(12px,env(safe-area-inset-bottom))]"><Cta onClick={onCta}>{page.copy.cta}</Cta></div>
        </>
      );
      break;

    /* ---------- P28 notifications ---------- */
    case "notifications": {
      const items: [ReactNode, string, string][] = [
        [<LightningZapIcon size={16} className="text-[#2EE6C8]" />, "Попытки восстановились", "сейчас"],
        [<CrossedCandlestickSwordsIcon size={16} className="text-[#2EE6C8]" />, "Похожая ситуация готова", "2 часа назад"],
        [<GraduationCapIcon size={16} className="text-[#2EE6C8]" />, "Открыта тема «Новости»", "вчера"],
        [<StarIcon size={16} className="text-[#F0C274]" />, "Серия 4 дня — не прерывайте", "вчера"],
      ];
      inner = (
        <>
          <Head page={page} />
          <Title>Уведомления</Title>
          <Body className="space-y-1.5 pt-2">
            {items.map(([icon, t, s], i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[.04] p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/6">{icon}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-[12.5px] font-extrabold">{t}</p><p className="text-[10px] text-[#7f90a8]">{s}</p></div>
              </div>
            ))}
          </Body>
          <div className="shrink-0 px-4 pb-[max(14px,env(safe-area-inset-bottom))]"><Cta onClick={onCta}>{page.copy.cta}</Cta></div>
        </>
      );
      break;
    }

    /* ---------- P29 settings ---------- */
    case "settings": {
      const rows: [string, string, boolean, string][] = [
        ["Звук", "sound", toggles.sound, "ВКЛ"],
        ["Меньше анимации", "anim", toggles.anim, "ВЫКЛ"],
        ["Напоминать раз в день", "remind", toggles.remind, "ВКЛ"],
        ["Профессиональные термины", "terms", toggles.terms, "ВЫКЛ"],
      ];
      inner = (
        <>
          <Head page={page} />
          <Title>Настройки</Title>
          <Body className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[.04] px-3 py-2.5">
              <span className="text-[12.5px] font-bold">Язык</span>
              <span className="rounded-lg bg-white/8 px-2.5 py-1 text-[11px] font-bold">Русский</span>
            </div>
            {rows.map(([label, key, on]) => (
              <button key={key} onClick={() => setToggles((t) => ({ ...t, [key]: !on }))} className="tap flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/[.04] px-3 py-2.5">
                <span className="flex items-center gap-2 text-[12.5px] font-bold">
                  {key === "sound" && <BellIcon size={15} className="text-[#7f90a8]" />}
                  {key === "anim" && <GearIcon size={15} className="text-[#7f90a8]" />}
                  {label}
                </span>
                <span className="rounded-lg px-2.5 py-1 text-[11px] font-black" style={{ background: on ? "#2EE6C8" : "rgba(255,255,255,.08)", color: on ? "#04211C" : "#7f90a8" }}>
                  {on ? "ВКЛ" : "ВЫКЛ"}
                </span>
              </button>
            ))}
            <p className="px-1 pt-1 text-[10px] leading-snug text-[#7f90a8]">{page.copy.note}</p>
          </Body>
          <div className="shrink-0 px-4 pb-[max(14px,env(safe-area-inset-bottom))]"><Cta onClick={onCta}>{page.copy.cta}</Cta></div>
        </>
      );
      break;
    }

    /* ---------- P30 no attempts ---------- */
    case "noAttempts":
      inner = (
        <>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-7 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-[#F0A84D]/12 text-[#F0C274]"><LightningZapIcon size={40} /></span>
            <h1 className="text-[21px] font-black">{page.copy.title}</h1>
            <p className="max-w-[270px] text-[12.5px] leading-relaxed text-[#a9bad0]">{page.copy.body}</p>
          </div>
          <Continue page={page} ready onCta={onCta} />
        </>
      );
      break;

    /* ---------- P31 unknown topic, no penalty ---------- */
    case "unknownTopic":
      inner = (
        <>
          <Head page={page} />
          <ChartZone v={v} seed={seed} />
          <div className="shrink-0 space-y-2 px-4 pt-2">
            <div className="rounded-2xl border-2 border-[#F0C274]/60 bg-[#F0C274]/10 px-3 py-2.5">
              <span className="rounded-full bg-[#F0C274]/20 px-2 py-0.5 text-[9px] font-black uppercase text-[#ffd98f]">зона роста</span>
              <p className="mt-1 text-[12px] font-bold text-[#ffe9c2]">{page.copy.body}</p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-[#33465f] p-2.5">
              <div className="w-12 shrink-0" style={{ opacity: .5 }}><SkillCard id="c08" locked /></div>
              <span className="text-[11px] text-[#93a5bd]">Тема «Новости»: 3 урока, 4 минуты</span>
            </div>
          </div>
          <Continue page={page} ready onCta={onCta} onGhost={onCta} />
        </>
      );
      break;

    /* ---------- P32 loading ---------- */
    case "loading": {
      const cardCount = Object.keys(assetBundle.cards).length;
      const cardsLabel =
        assetBundle.status === "loading" ? "распаковка…"
          : cardCount === 40 ? "40/40 OK"
            : cardCount > 0 ? `${cardCount}/40 · частично`
              : "ASSET_ARCHIVE_NOT_EXTRACTED";
      const topbarLabel = assetBundle.topbarHtml ? "topbar.html OK" : "locked-порт геометрии";
      inner = (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-7 text-center">
          <SealMark size={64} />
          <h1 className="text-[16px] font-black">{page.copy.title}</h1>
          <div className="w-full max-w-[260px] space-y-2">
            {[100, 78, 60, 84].map((w, i) => (
              <div key={i} className="h-9 animate-pulse rounded-xl bg-white/[.05]" style={{ width: `${w}%` }} />
            ))}
          </div>
          <p className="font-mono text-[9.5px] text-[#556980]">
            skill-card-icons.zip: {cardsLabel} · topbar: {topbarLabel}
          </p>
        </div>
      );
      break;
    }

    /* ---------- P33 locked card ---------- */
    case "locked":
      inner = (
        <>
          <Head page={page} />
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-7 text-center">
            <div className="relative">
              <div className="opacity-50 grayscale"><SkillCard id="c38" /></div>
              <span className="absolute inset-0 grid place-items-center text-[#F0C274]"><ClockLockIcon size={40} /></span>
            </div>
            <h1 className="text-[18px] font-black">{page.copy.title}</h1>
            <p className="max-w-[280px] text-[12px] leading-relaxed text-[#a9bad0]">{page.copy.body}</p>
          </div>
          <Continue page={page} ready onCta={onCta} onGhost={onCta} />
        </>
      );
      break;

    /* ---------- P34 error ---------- */
    case "error":
      inner = (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-7 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#EB635B]/12 text-[#EB635B]"><AlertTriangleIcon size={34} /></span>
          <h1 className="text-[17px] font-black">{page.copy.title}</h1>
          <p className="max-w-[290px] text-[11.5px] leading-relaxed text-[#a9bad0]">{page.copy.body}</p>
          <code className="rounded-lg bg-black/30 px-2 py-1 text-[9.5px] text-[#ff9b94]">ASSET_ARCHIVE_NOT_EXTRACTED</code>
          <button onClick={onRestart} className="tap mt-1 rounded-2xl border border-[#EB635B]/60 bg-[#EB635B]/15 px-6 py-3 text-[13px] font-black text-[#ffb3ad] active:scale-[.98]">{page.copy.cta}</button>
        </div>
      );
      break;

    default:
      inner = <Body>{page.title}</Body>;
  }

  return (
    <div className="screen h-full">
      {page.topBar && <TopBar values={values} />}
      <div className={`screen-body kind-${page.kind}`}>{inner}</div>
      {page.nav && <BottomNav active={navActiveOf(page)} onNav={(x) => onNav?.(x)} />}
    </div>
  );
}

/* helpers */
function evalProg(p: string) {
  const [a, b] = p.split("/").map(Number);
  return b ? Math.round((a / b) * 100) : 0;
}
function TrendUpMini() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#2EE6C8]/15 text-[#2EE6C8]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 17L8.5 11.5L12.5 15.5L20.5 7.5M20.5 7.5H15.5M20.5 7.5V12.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}
