import { useEffect, useMemo, useState } from "react";
import { CARD_COLORS, CARD_NAMES, HERO_ART, NAV, SCENARIOS, cardId, navFor, type ArenaPhase, type Page, type Variant } from "../data/pages";
import { MissingSlot, useAssets } from "./AssetContext";
import { Chart } from "./Chart";
import { Confetti } from "./Confetti";
import { CountUp } from "./CountUp";
import { haptic, sfx } from "../lib/feel";
import { SkillCard } from "./SkillCard";
import { TopBar, type TopBarMode } from "./TopBar";

type Props = { page: Page; variant: Variant; onNext?: () => void; onNav?: (id: string) => void; topBarMode?: TopBarMode; slotOverrides?: Record<string, Partial<{ scale: number; opacity: number; position: string; fit: "contain" | "cover"; tint: string }>> };

const TINT: Record<string, string> = { none: "none", cool: "hue-rotate(-12deg) saturate(1.15) brightness(1.02)", warm: "sepia(.22) saturate(1.25) brightness(1.02)", mono: "grayscale(1)" };

function rank(total: number): { g: string; c: string } {
  if (total >= 260) return { g: "S", c: "linear-gradient(135deg,#ffe08a,#ffb02e)" };
  if (total >= 210) return { g: "A", c: "linear-gradient(135deg,#8effd0,#3ad9e6)" };
  if (total >= 150) return { g: "B", c: "linear-gradient(135deg,#9bb0ff,#8b7bff)" };
  return { g: "C", c: "linear-gradient(135deg,#8f9bc2,#6f7aa3)" };
}

function tap<T extends unknown[]>(fn?: (...a: T) => void, kind: "tap" | "select" | "success" | "error" = "tap") {
  return (...a: T) => { haptic(kind === "error" ? "error" : kind === "success" ? "success" : kind === "select" ? "select" : "tap"); if (kind === "select") sfx.select(); else if (kind === "success") sfx.hit(); else if (kind === "error") sfx.miss(); else sfx.tap(); fn?.(...a); };
}

export function GameScreen({ page, variant, onNext, onNav, topBarMode, slotOverrides }: Props) {
  const reg = useAssets();
  const sc = SCENARIOS[page.scenario ?? 0];
  const cards = variant.slots.filter((s) => s.slot.startsWith("skill-card")).map((s) => parseInt(s.assetId.slice(1, 3), 10));
  const heroSlot = variant.slots.find((s) => s.slot === "hero");
  const ov = (slot: string) => ({ ...(variant.slots.find((s) => s.slot === slot) || {}), ...(slotOverrides?.[slot] || {}) });

  // ----- interactive state (reset on page/variant change) -----
  const [phase, setPhase] = useState<ArenaPhase>(page.phase ?? "observe");
  const [fb, setFb] = useState<"hit" | "miss" | null>(null);
  const [dir, setDir] = useState<"long" | "short" | "skip" | null>(null);
  const [conf, setConf] = useState(60);
  const [pick, setPick] = useState<number | null>(null);
  const [revealDone, setRevealDone] = useState(false);
  const [shake, setShake] = useState(false);
  const [quiz, setQuiz] = useState<number | null>(null);
  const [burst, setBurst] = useState(0);
  useEffect(() => { setPhase(page.phase ?? "observe"); setFb(page.phase === "feedback" ? "hit" : null); setDir(page.phase === "score" || page.phase === "reveal" ? sc.correct : null); setPick(null); setRevealDone(page.phase === "score"); setQuiz(null); setBurst(0); }, [page, variant, sc]);

  const revealed = phase === "reveal" || phase === "score";
  const dirOk = dir === sc.correct;
  const score = useMemo(() => ({ dir: dirOk ? 100 : dir === "skip" ? 45 : 15, timing: dirOk ? 70 + Math.round(conf / 5) : 40, explain: pick ? 85 : 55 }), [dirOk, dir, conf, pick]);
  const total = score.dir + score.timing + score.explain;
  const stars = Math.max(0, Math.round((total / 300) * 3));
  const rk = rank(total);

  useEffect(() => {
    if (phase === "score") {
      const t = setTimeout(() => { setBurst((b) => b + 1); haptic(stars >= 2 ? "success" : "warning"); sfx.win(); }, 260);
      return () => clearTimeout(t);
    }
  }, [phase, stars]);

  const Hero = ({ h, ken = true }: { h: string; ken?: boolean }) => {
    const s = ov("hero");
    const file = HERO_ART[page.id];
    const idx = parseInt((heroSlot?.assetId.match(/\[(\d+)\]/) || [])[1] || "0", 10);
    const repoImg = reg?.images.length ? reg.images[idx % reg.images.length] : null;
    const src = file ? `/images/${file}` : repoImg?.url;
    return (
      <div className="in d1" style={{ flex: "0 1 auto", height: h, borderRadius: 22, overflow: "hidden", background: "var(--card)", position: "relative", display: "grid", placeItems: "center", boxShadow: "0 14px 34px rgba(0,0,0,.4), inset 0 0 0 1px rgba(255,255,255,.06)" }}>
        {src ? (
          <>
            <img src={src} alt="" className={ken ? "ken" : undefined} style={{ width: "100%", height: "100%", objectFit: s.fit as "cover", objectPosition: s.position, transform: `scale(${s.scale})`, opacity: s.opacity, filter: TINT[s.tint || "none"] }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,18,32,0) 45%, rgba(14,18,32,.55) 100%)" }} />
            <div className="bg-layer" style={{ mixBlendMode: "overlay", opacity: 0.5 }}><span className="orb" style={{ width: 140, height: 140, right: -20, top: -20, background: "var(--acc)" }} /></div>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--bad)", fontSize: 10.5, textAlign: "center", padding: 12 }}>
            <MissingSlot file={heroSlot?.assetId || "assets.zip#image"} size={36} label />
            <span>MISSING_ASSET<br />{heroSlot?.assetId}</span>
          </div>
        )}
      </div>
    );
  };

  const ChartBox = ({ h = "42cqh", p = phase, extra }: { h?: string; p?: ArenaPhase; extra?: React.ReactNode }) => (
    <div className={`in d1 chart-frame ${shake ? "shake" : ""}`} style={{ flex: "0 1 auto", height: h, minHeight: 120, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ink3)", fontWeight: 700, padding: "0 4px 4px" }}>
        <span>{sc.asset} <i className="dimdot" />{sc.period}</span>
        <span style={{ color: revealed ? "var(--warm)" : "var(--acc)", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: "currentColor", boxShadow: "0 0 6px currentColor" }} />
          {revealed ? "ИСТОРИЯ" : "ДО t0 · БУДУЩЕЕ СКРЫТО"}
        </span>
      </div>
      <div style={{ position: "absolute", inset: "22px 8px 8px" }}>
        <Chart sc={sc} phase={p} preset={variant.chart} reveal={variant.reveal} motion={variant.motion} revealed={revealed} onRevealDone={() => { setRevealDone(true); haptic("light"); }} feedback={fb}
          showZones={(p === "observe" && (page.id >= "P14" || page.id === "P09") && pick !== null) || p === "score" || page.template === "debrief" || page.template === "lesson"}
          zoneMode={page.id === "P09" ? "level" : "drop"} targetLabel={p === "target" ? (page.id === "P09" ? "Зона сопротивления" : "Зона падения") : undefined}
          onTargetTap={(hit) => { if (hit) { setFb("hit"); setPhase("feedback"); haptic("success"); sfx.hit(); } else { setFb("miss"); setShake(true); haptic("error"); sfx.miss(); setTimeout(() => setShake(false), 420); setTimeout(() => setFb(null), 900); } }} />
      </div>
      {extra}
    </div>
  );

  const Progress = () => page.tutorial ? (
    <div className="in" style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span className="chip on" style={{ fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: "0 1 auto" }}>{page.tutorial.lesson}</span>
      <div style={{ flex: 1 }} className="bar"><i style={{ width: `${(page.tutorial.step / page.tutorial.total) * 100}%` }} /></div>
      <span className="count" style={{ fontSize: 11, fontWeight: 700, color: "var(--ink2)" }}>{page.tutorial.step}/{page.tutorial.total}</span>
    </div>
  ) : null;

  const CTA = ({ label, disabled, onClick, secondary }: { label: string; disabled?: boolean; onClick?: () => void; secondary?: string }) => (
    <div className="in d3" style={{ marginTop: "auto", minHeight: 64, display: "flex", flexDirection: "column", gap: 8, justifyContent: "flex-end", paddingBottom: 4 }}>
      <button className="btn shine" disabled={disabled} onClick={tap(onClick ?? onNext, "select")}>{label}</button>
      {secondary && <button className="btn g" style={{ minHeight: 44, padding: 10 }} onClick={tap(onNext)}>{secondary}</button>}
    </div>
  );

  const Copy = ({ h, t }: { h: string; t?: string }) => (
    <div className="in d2" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div className="h">{h}</div>
      {t && <div className="t">{t}</div>}
    </div>
  );

  // ----- body by template -----
  let body: React.ReactNode = null;
  const tpl = page.template;

  if (tpl === "splash") {
    body = (
      <div className="gs-body" style={{ justifyContent: "flex-end", gap: 14, padding: 20 }}>
        <Hero h="42cqh" />
        <div className="in d2" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 11, letterSpacing: ".2em", color: "var(--acc)", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}><span className="livedot" />TELEGRAM MINI APP</div>
          <div className="brand-title">{page.copy.h}</div>
          <div className="t" style={{ fontSize: 13.5 }}>{page.copy.t}</div>
        </div>
        <CTA label={page.copy.cta} />
      </div>
    );
  } else if (tpl === "tutorial" || tpl === "lesson") {
    const hasChart = variant.slots.some((s) => s.slot === "chart");
    body = (
      <div className="gs-body">
        <Progress />
        {hasChart ? <ChartBox p="observe" /> : cards.length ? (
          <div className="in d1" style={{ height: "36cqh", display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
            {cards.map((n, i) => <SkillCard key={n} n={n} scale={ov(`skill-card-${i + 1}`).scale} state={i === 0 ? "new" : undefined} style={{ width: "26%", maxWidth: 96, transform: `rotate(${(i - 1) * 8}deg) translateY(${Math.abs(i - 1) * 6}px)` }} />)}
          </div>
        ) : <Hero h="38cqh" />}
        <Copy h={page.copy.h} t={page.copy.t} />
        {tpl === "lesson" && <div className="chip" style={{ alignSelf: "flex-start" }}><span style={{ width: 8, height: 8, borderRadius: 4, background: CARD_COLORS.green }} />Урок · {CARD_NAMES[cardId(cards[0] || 4)]}</div>}
        <CTA label={page.copy.cta} />
      </div>
    );
  } else if (tpl === "arena") {
    const showConf = page.id >= "P10";
    const decided = dir !== null;
    body = (
      <div className="gs-body">
        <Progress />
        <ChartBox />
        {phase === "target" && (
          <>
            <div className="tip in d2">{fb === "miss" ? "Мимо — ищи, где свечи стали красными и длинными" : "Коснись подсвеченной зоны — там цена резко упала"}</div>
            <Copy h={page.copy.h} t={page.copy.t} />
            <CTA label={page.copy.cta} disabled />
          </>
        )}
        {phase === "feedback" && (
          <>
            <div className="in d2 box glass-good" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span className="pop okc" style={{ display: "grid", placeItems: "center" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
                  <path d="M5 12.8l4.3 4.4L19 7.6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div><div style={{ fontWeight: 700, fontSize: 13 }}>{page.id === "P09" ? "Верно — уровень найден" : page.copy.h}</div><div className="t s">{page.copy.t}</div></div>
            </div>
            <CTA label="Дальше" />
          </>
        )}
        {phase === "observe" && (
          <>
            <Copy h={page.copy.h} t={page.copy.t} />
            {cards.length > 0 && (
              <div className="in d2" style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {cards.map((n, i) => <button key={n} onClick={tap(() => setPick(n), "select")} className="card-pick" style={{ width: "22%", maxWidth: 76, transform: pick === n ? "translateY(-8px) scale(1.08)" : undefined }}><SkillCard n={n} scale={ov(`skill-card-${i + 1}`).scale} style={pick === n ? { boxShadow: "inset 0 0 0 2px #fff, 0 0 22px rgba(58,217,230,.6)" } : undefined} /></button>)}
              </div>
            )}
            <CTA label={cards.length ? (pick ? `Применить «${CARD_NAMES[cardId(pick)]}»` : "Выбери карту") : page.copy.cta} disabled={cards.length > 0 && pick === null} onClick={() => (page.id === "P14" || page.id === "P24") && phase === "observe" ? setPhase("decision") : onNext?.()} />
          </>
        )}
        {phase === "decision" && (
          <>
            <Copy h={page.copy.h} t={page.copy.t} />
            <div className="in d2" style={{ display: "flex", gap: 8 }}>
              {(["long", "short", "skip"] as const).map((d) => (
                <button key={d} onClick={tap(() => setDir(d), "select")} className={`btn g dirbtn ${dir === d ? `on-${d}` : ""}`} style={{ minHeight: 48, padding: 8, fontSize: 13, flex: 1 }}>
                  {d === "long" ? "▲ Вверх" : d === "short" ? "▼ Вниз" : "— Пропуск"}
                </button>
              ))}
            </div>
            {showConf && (
              <div className="in d3 box" style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                <span className="t s" style={{ whiteSpace: "nowrap" }}>Уверенность</span>
                <input type="range" min={10} max={100} value={conf} onChange={(e) => { setConf(+e.target.value); haptic("light"); }} style={{ flex: 1, accentColor: "var(--acc)", minHeight: 44 }} />
                <span className="count" style={{ fontWeight: 700, width: 38, textAlign: "right" }}>{conf}%</span>
              </div>
            )}
            {cards.length > 0 && <div className="chip on in d3" style={{ alignSelf: "flex-start" }}><span style={{ width: 8, height: 8, borderRadius: 4, background: "var(--acc)" }} />Карта: {CARD_NAMES[cardId(pick ?? cards[0])]}</div>}
            <CTA label={decided ? "Seal — зафиксировать" : "Выбери направление"} disabled={!decided} onClick={() => { setRevealDone(false); setPhase("reveal"); haptic("warning"); sfx.seal(); }} />
          </>
        )}
        {phase === "reveal" && (
          <>
            {!revealDone ? (
              <div className="in d2 box" style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(58,217,230,.16),transparent)" }} className="scan" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--acc)", letterSpacing: ".1em" }}>FAST-FORWARD</span>
                <div className="t s">Решение запечатано: {dir === "long" ? "Вверх" : dir === "short" ? "Вниз" : "Пропуск"}. Дорисовываем историю…</div>
              </div>
            ) : (
              <div className="in box event-card">
                <div style={{ fontSize: 10.5, color: "var(--warm)", fontWeight: 700, letterSpacing: ".08em" }}>КЛЮЧЕВОЕ СОБЫТИЕ</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 2 }}>{sc.event}</div>
                <div className="t s" style={{ marginTop: 4 }}>{sc.explain}</div>
              </div>
            )}
            <CTA label={page.copy.cta} disabled={!revealDone} onClick={() => setPhase("score")} />
          </>
        )}
        {phase === "score" && (
          <>
            <div className="in d1" style={{ display: "flex", gap: 10, alignItems: "stretch", position: "relative" }}>
              <Confetti run={burst} />
              <div className="rank-badge pop" style={{ background: rk.c }}>{rk.g}</div>
              <div className="box" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
                {[["Направление", score.dir, dirOk ? "var(--good)" : "var(--bad)"], ["Тайминг", score.timing, "var(--acc)"], ["Объяснение", score.explain, "var(--star)"]].map(([nm, v, c]) => (
                  <div key={nm as string} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5 }}>
                    <span style={{ flex: 1, color: "#dfe5fb" }}>{nm}</span>
                    <span className="bar" style={{ width: 64 }}><i style={{ width: `${v}%`, background: c as string, boxShadow: `0 0 8px ${c as string}` }} /></span>
                    <span className="count" style={{ width: 26, textAlign: "right", fontWeight: 700 }}><CountUp value={v as number} /></span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 4, marginTop: 2, alignItems: "center" }}>{[0, 1, 2].map((i) => <span key={i} className="pop star-pip" style={{ animationDelay: `${.3 + i * .15}s`, background: i < stars ? "var(--warm)" : "#2b3559", boxShadow: i < stars ? "0 0 10px var(--warm)" : "none" }} />)}<span className="t s" style={{ marginLeft: 6 }}>+<CountUp value={stars * 15} /> XP · +<CountUp value={stars * 10} /> монет</span></div>
              </div>
              {cards.length > 0 && <div style={{ width: "24%", maxWidth: 84, display: "flex" }}><SkillCard n={cards[0]} scale={ov("skill-card-1").scale} state="new" /></div>}
            </div>
            <Copy h={page.copy.h} t={page.copy.t} />
            <CTA label={page.copy.cta} secondary={page.copy.secondary} />
          </>
        )}
      </div>
    );
  } else if (tpl === "academy") {
    const topics = [["Чтение графика", 1, 3, 4, "green"], ["Контекст рынка", 16, 1, 4, "yellow"], ["Риск", 25, 0, 4, "blue"], ["Психология", 34, 0, 4, "red"]] as const;
    body = (
      <div className="gs-body">
        <Copy h={page.copy.h} t={page.copy.t} />
        {topics.map(([nm, c, done, tot, col], i) => (
          <div key={nm} className={`in d${i + 1} box topic-row`} style={{ opacity: i > 1 ? 0.55 : 1 }}>
            <div style={{ width: 44 }}><SkillCard n={cards[i] ?? c} mini state={i > 1 ? "lock" : undefined} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{nm}</div>
              <div className="t s">{i > 1 ? "Откроется после заходов" : `${done}/${tot} уроков`}</div>
              <div className="bar" style={{ marginTop: 5 }}><i style={{ width: `${(done / tot) * 100}%`, background: CARD_COLORS[col], boxShadow: `0 0 8px ${CARD_COLORS[col]}` }} /></div>
            </div>
          </div>
        ))}
        <CTA label={page.copy.cta} />
      </div>
    );
  } else if (tpl === "quiz") {
    const opts = ["Покупателей меньше — рост слабеет", "Рынок набирает силу", "Объём не важен"];
    body = (
      <div className="gs-body">
        <ChartBox h="34cqh" p="observe" />
        <Copy h={page.copy.h} t={page.copy.t} />
        <div className="in d2" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {opts.map((o, i) => <button key={o} onClick={tap(() => setQuiz(i), quiz !== null ? "tap" : "select")} className="chip quiz-opt" style={{ background: quiz === i ? (i === 0 ? "rgba(95,211,154,.2)" : "rgba(232,112,95,.2)") : undefined, boxShadow: quiz === i ? `inset 0 0 0 2px ${i === 0 ? "var(--good)" : "var(--bad)"}` : undefined }}>{o}</button>)}
        </div>
        <CTA label={quiz === null ? "Выбери ответ" : quiz === 0 ? "Верно · дальше" : "Попробовать ещё"} disabled={quiz === null} onClick={() => quiz === 0 ? onNext?.() : setQuiz(null)} />
      </div>
    );
  } else if (tpl === "deck") {
    body = (
      <div className="gs-body">
        <div className="in" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <Copy h={page.copy.h} t={page.copy.t} />
          <div style={{ display: "flex", gap: 6 }}>{(Object.keys(CARD_COLORS) as (keyof typeof CARD_COLORS)[]).map((k) => <span key={k} style={{ width: 10, height: 10, borderRadius: 5, background: CARD_COLORS[k], boxShadow: `0 0 6px ${CARD_COLORS[k]}` }} />)}</div>
        </div>
        {/* явно определённый длинный список — внутренний scroll разрешён */}
        <div className="in d1" style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, paddingBottom: 4, alignContent: "start" }}>
          {Array.from({ length: 40 }, (_, i) => <SkillCard key={i} n={i + 1} mini state={i + 1 > 12 ? "lock" : undefined} />)}
        </div>
        <CTA label={page.copy.cta} />
      </div>
    );
  } else if (tpl === "card") {
    const n = cards[0] ?? 9;
    const grp = n <= 15 ? "green" : n <= 24 ? "yellow" : n <= 33 ? "blue" : "red";
    body = (
      <div className="gs-body" style={{ alignItems: "center" }}>
        <div className="in d1 card-stage" style={{ height: "40cqh" }}><SkillCard n={n} scale={ov("skill-card-1").scale} style={{ height: "100%", width: "auto", fontSize: 11, boxShadow: `0 24px 60px ${CARD_COLORS[grp]}77, 0 0 0 1px rgba(255,255,255,.15)` }} /></div>
        <div className="chip" style={{ background: CARD_COLORS[grp] + "33" }}>{cardId(n)} · группа {grp}</div>
        <div style={{ width: "100%" }}><Copy h={CARD_NAMES[cardId(n)]} t={page.copy.t} /></div>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1 }}><CTA label={page.copy.cta} /></div>
      </div>
    );
  } else if (tpl === "select") {
    body = (
      <div className="gs-body">
        <Copy h={page.copy.h} t={page.copy.t} />
        {SCENARIOS.map((s, i) => (
          <button key={s.name} onClick={tap(() => setPick(i), "select")} className={`in d${i + 1} box scenario-row`} style={{ boxShadow: pick === i ? "inset 0 0 0 2px var(--acc), 0 0 22px rgba(58,217,230,.25)" : undefined }}>
            <div className="scenario-thumb">
              {reg?.images.length ? <img src={reg.images[(i + (heroSlot ? parseInt((heroSlot.assetId.match(/\[(\d+)\]/) || ["", "0"])[1]) : 0)) % reg.images.length].url} alt="" /> : <MissingSlot file="assets.zip#image" size={20} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</div><div className="t s">{s.asset} · {s.period}</div></div>
            <div className="chip" style={{ minHeight: 26, padding: "4px 8px" }}>−1 попытка</div>
          </button>
        ))}
        <CTA label={page.copy.cta} disabled={pick === null} />
      </div>
    );
  } else if (tpl === "debrief") {
    body = (
      <div className="gs-body">
        <ChartBox h="32cqh" p="score" />
        <Copy h={page.copy.h} t={page.copy.t} />
        {[["Ты увидел", "Импульс вниз и уровень", cards[0]], ["Ты пропустил", "Падение объёма на максимумах", cards[1]], ["Что применить", "Уровень 50% как цель", cards[2]]].map(([a, b, c], i) => (
          <div key={a as string} className={`in d${i + 1} box`} style={{ display: "flex", gap: 10, alignItems: "center", padding: 8 }}>
            <div style={{ width: 36 }}><SkillCard n={(c as number) ?? 4} mini /></div>
            <div style={{ minWidth: 0 }}><div className="t s" style={{ textTransform: "uppercase", letterSpacing: ".06em" }}>{a}</div><div style={{ fontSize: 12.5, fontWeight: 700 }}>{b}</div></div>
          </div>
        ))}
        <CTA label={page.copy.cta} />
      </div>
    );
  } else if (tpl === "profile") {
    body = (
      <div className="gs-body">
        <div className="in" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="avatar-ring"><div className="avatar-inner">{HERO_ART[page.id] ? <img src={`/images/${HERO_ART[page.id]}`} alt="" /> : reg?.images.length ? <img src={reg.images[8 % reg.images.length].url} alt="" /> : <MissingSlot file="assets.zip#image[8]" size={28} />}</div></div>
          <div><div style={{ fontWeight: 700, fontSize: 17 }}>Игрок</div><div className="t s">LVL {page.topBarState.lvl} · серия ×4 · точность 68%</div></div>
        </div>
        <div className="in d1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[["Заходов", 12], ["Точность", "68%"], ["Карт", "12/40"]].map(([k, v]) => <div key={k as string} className="box stat-cell"><div style={{ fontWeight: 700, fontSize: 18 }} className="count">{v}</div><div className="t s">{k}</div></div>)}
        </div>
        <div className="t s in d2">Последние карты</div>
        <div className="in d2" style={{ display: "flex", gap: 8 }}>{cards.map((n, i) => <div key={n} style={{ width: "20%", maxWidth: 70 }}><SkillCard n={n} scale={ov(`skill-card-${i + 1}`).scale} /></div>)}</div>
        <CTA label={page.copy.cta} />
      </div>
    );
  } else if (tpl === "settings") {
    body = (
      <div className="gs-body">
        <Copy h={page.copy.h} t={page.copy.t} />
        {["Звук", "Вибрация", "Подсказки в заходе", "Тёмная тема"].map((s, i) => (
          <div key={s} className={`in d${i + 1} box`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 48 }}><span style={{ fontSize: 13 }}>{s}</span><span className={`toggle ${i !== 3 ? "on" : ""}`}><i /></span></div>
        ))}
        <div className="in d4 box" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 48 }}><span style={{ fontSize: 13 }}>Язык</span><span className="chip">Русский</span></div>
        <CTA label={page.copy.cta} />
      </div>
    );
  } else if (tpl === "notifications") {
    body = (
      <div className="gs-body">
        <Copy h={page.copy.h} />
        {[["Попытка восстановлена", "2 мин назад", true], ["Новая тема в Академии: Риск", "1 ч назад", true], ["Ты вошёл в топ-30% по точности", "вчера", false], ["Ежедневный заход доступен", "вчера", false]].map(([a, b, nw], i) => (
          <div key={a as string} className={`in d${i + 1} box`} style={{ display: "flex", gap: 10, alignItems: "center", padding: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: nw ? "#ff5c5c" : "#2b3559", flex: "0 0 auto", boxShadow: nw ? "0 0 8px #ff5c5c" : "none" }} />
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: nw ? 700 : 400 }}>{a}</div><div className="t s">{b}</div></div>
          </div>
        ))}
        <CTA label={page.copy.cta} />
      </div>
    );
  } else if (tpl === "state") {
    const loading = page.id === "P33";
    body = (
      <div className="gs-body" style={{ justifyContent: "center", alignItems: "center", textAlign: "center", gap: 14, position: "relative" }}>
        {page.id === "P34" && <Confetti run={1} burst={64} origin="top" />}
        {loading ? <div className="spinner" /> : <div style={{ width: "100%" }}><Hero h="34cqh" /></div>}
        {page.id === "P34" && cards.length > 0 && <div className="pop d2" style={{ width: 84 }}><SkillCard n={cards[0]} state="new" /></div>}
        <div><div style={{ fontSize: 22, fontWeight: 700 }} className="in d2">{page.copy.h}</div><div className="t in d2" style={{ marginTop: 4 }}>{page.copy.t}</div></div>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", flex: "0 0 auto", marginTop: "auto" }}><CTA label={page.copy.cta} secondary={page.copy.secondary} /></div>
      </div>
    );
  }

  const active = navFor(page);
  return (
    <div className={`gs m-${variant.motion}`} data-page={page.id} data-variant={variant.id}>
      <div className={`bg-layer bg-${variant.bg}`} style={{ opacity: ov("background").opacity }}>
        {variant.bg === "aurora" && <><span className="orb" style={{ width: 200, height: 200, left: -60, top: 60, background: "var(--acc)" }} /><span className="orb" style={{ width: 160, height: 160, right: -40, top: 260, background: "var(--star)", animationDelay: "-6s" }} /></>}
        {variant.bg === "nebula" && <span className="orb" style={{ width: 260, height: 160, left: "20%", bottom: 40, background: "var(--warm)", opacity: 0.25 }} />}
      </div>
      <div className="bg-particles" aria-hidden>{Array.from({ length: 14 }, (_, i) => <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i * 0.9) % 12}s`, animationDuration: `${9 + (i % 5) * 2}s` }} />)}</div>
      {page.topBar && <div style={{ position: "relative", zIndex: 2 }}><TopBar state={page.topBarState} mode={topBarMode} /></div>}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>{body}</div>
      {page.topBar && (
        <nav className="gs-nav" style={{ position: "relative", zIndex: 2 }}>
          {NAV.map((n) => <button key={n.id} className={n.id === active ? "on" : ""} onClick={tap(() => onNav?.(n.id), "select")}><span className="ni" />{n.label}</button>)}
        </nav>
      )}
    </div>
  );
}
