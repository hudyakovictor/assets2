/* ============================================================================
   SCREENS P22 — P34 · коллекция, ритуал, турниры, дуэль, лидерборд, академия,
   урок, профиль, настройки, уведомления, документы, итог серии.
   Все страницы описаны через слоты Compose (head / media / body / cta), поэтому
   компоновки A/B/C/D различаются версткой и эффектами, а не данными.
   ========================================================================== */
import { useEffect, useState } from "react";
import {
  LESSONS, PROFILE, LEADERBOARD, TOURNAMENT, NOTIFICATIONS, SERIES_ROUNDS, DECISIONS, SCENARIOS,
} from "./content";
import { ASSETS, MISSING_ASSETS, PAGE_COUNT_MISMATCH, PAGES, SKILL_ASSET_IDS, ASSET_MATRIX, THREE_VARIANT_PAGES } from "./catalog";
import { Art, Motif } from "./art";
import { Btn, Chip, Compose, Panel, Progress, ScreenTitle, type Composition } from "./frame";
import { Note, NoteStrip } from "./note";
import { Icon, IconCoin, IconStar } from "../icons/ui";
import { SkillCard, SKILL_MAP, SKILL_ICONS, CARD_PALETTE, SkillGlyph } from "../icons/skill";
import type { GameCtx } from "./state";
import { sfx } from "./sfx";

const comp = (ctx: GameCtx): Composition => (ctx.variantId as Composition) ?? "A";
const GROUP_RU: Record<string, string> = { green: "КОНТЕКСТ", yellow: "РЕШЕНИЕ", blue: "ДИСЦИПЛИНА", red: "СТОП-ЛИСТ" };

function Mini({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <Panel inset className="p-2">
      <div className="micro">{k}</div>
      <div className="tabular" style={{ fontWeight: 700, fontSize: "var(--type-h3)", color: tone ?? "var(--ink)" }}>{v}</div>
    </Panel>
  );
}

function MediaPanel({ assetId, size = 150, caption, children }: { assetId: string; size?: number; caption?: string; children?: React.ReactNode }) {
  return (
    <Panel className="relative h-full overflow-hidden">
      <div className="absolute inset-0 grid place-items-center"><Art assetId={assetId} size={size} /></div>
      {children}
      {caption && <div className="media-caption micro">{caption}</div>}
    </Panel>
  );
}

/* ============================ P22 · COLLECTION =========================== */
export function Collection({ ctx }: { ctx: GameCtx }) {
  const [group, setGroup] = useState<string>("all");
  const list = SKILL_ICONS.filter((s) => group === "all" || s.group === group);
  const owned = (i: number) => (i + 3) % 4 !== 0;
  const ownedCount = SKILL_ICONS.filter((_, i) => owned(i)).length;
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={84}
      head={<ScreenTitle kicker="КОЛЛЕКЦИЯ СИГНАЛОВ · c01…c40" title="КАРТЫ АРЕНЫ" right={<Chip tone="var(--accent)" solid>{ownedCount}/40</Chip>} />}
      media={
        <MediaPanel assetId={ctx.assign.frame ?? "ORN-FRAME-SIGIL"} size={120} caption="4 ГРУППЫ · ЦВЕТ КАРТЫ = ГРУППА, ИКОНКА ВСЕГДА БЕЛАЯ">
          <div className="absolute left-3 top-3 flex gap-1.5">
            {(["green", "yellow", "blue", "red"] as const).map((g) => (
              <span key={g} style={{ width: 14, height: 14, borderRadius: 5, background: CARD_PALETTE[g], border: "1px solid rgba(255,255,255,.5)" }} />
            ))}
          </div>
        </MediaPanel>
      }
      body={
        <>
          <div className="seg">
            {["all", "green", "yellow", "blue", "red"].map((g) => (
              <button key={g} type="button" className={group === g ? "is-on" : ""}
                data-tone={g === "all" ? undefined : g}
                style={g === "all" ? undefined : ({ "--seg-tone": CARD_PALETTE[g as "green"] } as React.CSSProperties)}
                onClick={() => { sfx.tick(); setGroup(g); }}>
                {g === "all" ? "ВСЕ" : GROUP_RU[g]}
              </button>
            ))}
          </div>
          <div className="scroll-y grid min-h-0 grid-cols-4 content-start gap-2 pr-1">
            {list.map((s) => {
              const i = SKILL_ICONS.indexOf(s);
              const has = owned(i);
              return (
                <button key={s.id} type="button"
                  onClick={() => { sfx.pick(); if (has) ctx.go("p23"); }}
                  className="flex flex-col items-center gap-1"
                  style={{ border: "none", background: "none", padding: "2px 0", minHeight: 78, opacity: has ? 1 : 0.4 }}>
                  <SkillGlyph id={s.id} size={50} ringColor={has ? undefined : "#2b3a52"} />
                  <span className="micro" style={{ color: has ? CARD_PALETTE[s.group] : "var(--ink-3)", textAlign: "center", lineHeight: 1.1, letterSpacing: ".04em" }}>
                    {has ? s.ru : "ЗАКРЫТО"}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      }
      cta={<Btn tone="primary" icon={<Icon name="navArena" size={18} />} onClick={() => ctx.go("p10")} style={{ width: "100%", minHeight: 56 }}>В АРЕНУ</Btn>}
    />
  );
}

/* =========================== P23 · CARD DETAIL =========================== */
export function CardDetail({ ctx }: { ctx: GameCtx }) {
  const meta = SKILL_MAP["c03"];
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={110}
      head={<ScreenTitle kicker={`${GROUP_RU[meta.group]} · КАРТА c03`} title={meta.ru} right={<Chip tone={CARD_PALETTE[meta.group]} solid>УРОВЕНЬ 2</Chip>} />}
      media={<MediaPanel assetId={ctx.assign.hero} size={170} caption="КАК СИГНАЛ ВЫГЛЯДИТ НА ГРАФИКЕ" />}
      body={
        <>
          <div className="flex items-center gap-2.5">
            <div style={{ width: 92, flex: "none" }}><SkillCard id="c03" showCornerStar compact /></div>
            <div className="min-w-0 flex-1">
              <div className="h3" style={{ textTransform: "none" }}>{meta.en}</div>
              <p className="body" style={{ fontSize: "var(--type-meta)" }}>{meta.hint}</p>
              <Progress value={0.66} label="ПРОГРЕСС НАВЫКА" right="66%" />
            </div>
          </div>
          <div className="scroll-y flex min-h-0 flex-col gap-1.5">
            {LESSONS[2].bullets.map((b) => (
              <Panel key={b} inset className="flex items-center gap-2 p-2">
                <Icon name="check" size={16} />
                <span className="body" style={{ fontSize: "var(--type-meta)" }}>{b}</span>
              </Panel>
            ))}
          </div>
        </>
      }
      cta={
        <div className="flex gap-2">
          <Btn tone="ghost" onClick={() => ctx.go("p22")} style={{ flex: "0 0 92px", minHeight: 56 }}>НАЗАД</Btn>
          <Btn tone="primary" onClick={() => ctx.startRound(0)} style={{ flex: 1, minHeight: 56 }}>ТРЕНИРОВКА НА СИГНАЛЕ</Btn>
        </div>
      }
    />
  );
}

/* ============================= P24 · RITUAL ============================== */
export function Ritual({ ctx }: { ctx: GameCtx }) {
  const days = Array.from({ length: 7 }, (_, i) => i < ctx.st.streak);
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={96}
      head={<ScreenTitle kicker="ЕЖЕДНЕВНЫЙ РИТУАЛ" title="ЛИНИЯ ДИСЦИПЛИНЫ" right={<Art assetId={ctx.assign.ornament} size={44} />} />}
      media={
        <Panel className="flex h-full flex-col justify-center gap-2 p-3">
          <div className="flex items-center justify-between gap-1">
            {days.map((on, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span style={{
                  width: 34, height: 34, borderRadius: 12, display: "grid", placeItems: "center",
                  background: on ? "linear-gradient(180deg,#56d6b4,var(--accent-deep))" : "rgba(10,22,40,.75)",
                  border: `1px solid ${on ? "#9FE8D3" : "var(--stroke)"}`,
                }}>
                  <Icon name={on ? "flame" : "lock"} size={16} />
                </span>
                <span className="micro">Д{i + 1}</span>
              </div>
            ))}
          </div>
          <Progress value={ctx.st.streak / 7} label="ДО НАГРАДЫ НЕДЕЛИ" right={`${ctx.st.streak}/7`} />
        </Panel>
      }
      body={
        <>
          <div className="grid grid-cols-2 gap-1.5">
            <Mini k="СЕРИЯ" v={`${ctx.st.streak} ДН.`} tone="var(--accent)" />
            <Mini k="НАГРАДА 7 ДНЕЙ" v="120 + КАРТА" tone="#FFE9A8" />
          </div>
          <Note tone="cream" doodle="smile-wink" size="s" rotate={-1.4} doodleSize={22}>
            SKIP A DAY AND THE STREAK FORGETS YOU. THE MARKET NEVER DOES.
          </Note>
        </>
      }
      cta={<Btn tone="primary" icon={<Icon name="flame" size={18} />} onClick={() => ctx.go("p10")} style={{ width: "100%", minHeight: 56 }}>ПРОДОЛЖИТЬ РИТУАЛ</Btn>}
    />
  );
}

/* =========================== P25 · TOURNAMENTS =========================== */
export function Tournaments({ ctx }: { ctx: GameCtx }) {
  const [clock, setClock] = useState(TOURNAMENT.ends);
  useEffect(() => {
    let t = 23 * 3600 + 14 * 60 + 7;
    const id = setInterval(() => {
      t = Math.max(0, t - 1);
      const h = String(Math.floor(t / 3600)).padStart(2, "0");
      const m = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
      const s = String(t % 60).padStart(2, "0");
      setClock(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={116}
      head={<ScreenTitle kicker="СЕЗОН 12 · АРЕНА" title="ТУРНИРЫ" right={<Art assetId={ctx.assign.ornament} size={46} />} />}
      media={
        <Panel className="relative flex h-full flex-col justify-between overflow-hidden p-2.5" style={{ borderColor: "#C56861" }}>
          <div className="flex items-center gap-1.5">
            <Chip tone="#C56861" solid icon={<span style={{ width: 6, height: 6, borderRadius: 99, background: "#fff" }} />}>LIVE</Chip>
            <Chip icon={<Icon name="clockLock" size={11} />}>{clock}</Chip>
            <span className="micro" style={{ marginLeft: "auto" }}>{TOURNAMENT.players.toLocaleString("ru-RU")} ИГРОКОВ</span>
          </div>
          <div>
            <div className="h2">{TOURNAMENT.title}</div>
            <div className="tabular body" style={{ fontSize: "var(--type-meta)" }}>ПРИЗОВОЙ ФОНД: <b style={{ color: "#FFE9A8" }}>{TOURNAMENT.fund}</b></div>
          </div>
          <div className="micro">РАНГ {TOURNAMENT.rank} · {TOURNAMENT.percentile}</div>
        </Panel>
      }
      body={
        <>
          <Panel inset className="flex flex-col gap-1.5 p-2.5">
            <div className="flex items-center justify-between">
              <span className="micro">ЕЖЕНЕДЕЛЬНАЯ ЛИГА</span>
              <span className="micro" style={{ color: "var(--accent)" }}>{TOURNAMENT.league.now} → {TOURNAMENT.league.next}</span>
            </div>
            <Progress value={TOURNAMENT.league.progress} right="62%" />
          </Panel>
          <Panel className="flex items-center gap-2.5 p-2.5" onClick={() => { sfx.tick(); ctx.go("p26"); }}>
            <Motif spec={{ motif: "orn/blades", tint: "ember" }} size={46} />
            <div className="min-w-0 flex-1">
              <div className="micro">ДУЭЛЬ 1 НА 1</div>
              <div className="h3" style={{ textTransform: "none" }}>{TOURNAMENT.duel.name}</div>
            </div>
            <Icon name="chevron" size={18} />
          </Panel>
        </>
      }
      cta={<Btn tone="primary" onClick={() => ctx.startRound(0)} style={{ width: "100%", minHeight: 56 }}>УЧАСТВОВАТЬ</Btn>}
    />
  );
}

/* ============================== P26 · DUEL =============================== */
export function Duel({ ctx }: { ctx: GameCtx }) {
  const me = PROFILE;
  const rows = [
    { k: "ТОЧНОСТЬ", a: me.accuracy, b: 0.71 },
    { k: "ДИСЦИПЛИНА", a: me.discipline, b: 0.64 },
    { k: "СРЕДНИЙ R", a: 0.62, b: 0.78 },
  ];
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={104}
      head={<ScreenTitle kicker="ВЫЗОВ · 1 РАУНД" title="ДУЭЛЬ 1 НА 1" right={<Art assetId={ctx.assign.ornament} size={46} />} />}
      media={
        <Panel className="flex h-full items-center justify-between gap-2 p-2.5">
          <div className="text-center" style={{ flex: 1 }}>
            <span className="ink-ring mx-auto" style={{ width: 44, height: 44 }}><Icon name="user" size={22} /></span>
            <div className="h3 mt-1" style={{ textTransform: "none" }}>ТЫ</div>
            <div className="micro">{me.rank}</div>
          </div>
          <div className="flex flex-col items-center">
            <span className="anim-breathe"><Icon name="navArena" size={22} /></span>
            <span className="h2" style={{ color: "#FFE9A8" }}>VS</span>
            <span className="micro">50 SIG</span>
          </div>
          <div className="text-center" style={{ flex: 1 }}>
            <span className="ink-ring mx-auto" style={{ width: 44, height: 44 }}><Icon name="brain" size={22} /></span>
            <div className="h3 mt-1" style={{ textTransform: "none" }}>{TOURNAMENT.duel.name}</div>
            <div className="micro">СЕРИЯ {TOURNAMENT.duel.streak}</div>
          </div>
        </Panel>
      }
      body={
        <div className="flex flex-col gap-1.5">
          {rows.map((r) => (
            <Panel key={r.k} inset className="p-2">
              <div className="flex items-center justify-between">
                <span className="micro">{r.k}</span>
                <span className="micro" style={{ color: r.a >= r.b ? "#9FE8D3" : "#FFC7C3" }}>{r.a >= r.b ? "ПЕРЕВЕС ТВОЙ" : "ПЕРЕВЕС ЕГО"}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="tabular" style={{ width: 34, color: "#9FE8D3", fontWeight: 700 }}>{Math.round(r.a * 100)}%</span>
                <div style={{ flex: 1, height: 10, borderRadius: 99, background: "rgba(4,12,24,.7)", border: "1px solid var(--stroke)", position: "relative", overflow: "hidden" }}>
                  <span style={{ position: "absolute", inset: "0 auto 0 0", width: `${r.a * 100}%`, background: "linear-gradient(90deg,#56d6b4,var(--accent-deep))" }} />
                  <span style={{ position: "absolute", inset: "0 0 0 auto", width: `${r.b * 100}%`, background: "linear-gradient(90deg,#c56861,#e2605c)" }} />
                </div>
                <span className="tabular" style={{ width: 34, textAlign: "right", color: "#FFC7C3", fontWeight: 700 }}>{Math.round(r.b * 100)}%</span>
              </div>
            </Panel>
          ))}
        </div>
      }
      cta={<Btn tone="red" icon={<Icon name="navArena" size={18} />} onClick={() => ctx.startRound(1)} style={{ width: "100%", minHeight: 56 }}>ОТПРАВИТЬ ВЫЗОВ · 50 SIG</Btn>}
    />
  );
}

/* =========================== P27 · LEADERBOARD =========================== */
export function Leaderboard({ ctx }: { ctx: GameCtx }) {
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={104}
      head={<ScreenTitle kicker="СЕЗОН 12 · ТОП 10%" title="ЛИДЕРБОРД" right={<Art assetId={ctx.assign.ornament} size={46} />} />}
      media={
        <Panel className="flex h-full items-end justify-center gap-2 p-2.5">
          {[1, 0, 2].map((idx) => {
            const row = LEADERBOARD[idx];
            const tall = idx === 0;
            return (
              <div key={row.rank} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                <Chip tone={row.crest === "gold" ? "#D0B24A" : row.crest === "silver" ? "#9DB3D3" : "#C56861"} solid>{row.rank}</Chip>
                <div style={{ width: "100%", height: tall ? 52 : 36, borderRadius: 10, background: tall ? "linear-gradient(180deg,#e0c463,#b8912a)" : "linear-gradient(180deg,#2c4467,#1a2c47)", border: "1px solid var(--stroke)", display: "grid", placeItems: "center" }}>
                  <Icon name={tall ? "crown" : row.rank === 2 ? "medal" : "trophy"} size={tall ? 26 : 20} />
                </div>
              </div>
            );
          })}
        </Panel>
      }
      body={
        <div className="scroll-y flex min-h-0 flex-col gap-1.5 pr-1">
          {LEADERBOARD.map((row) => (
            <Panel key={row.name} className="flex items-center gap-2 p-2" style={{ borderColor: row.me ? "var(--accent)" : undefined, boxShadow: row.me ? "0 0 0 3px rgba(51,193,161,.2)" : undefined }}>
              <span className="tabular" style={{ width: 18, fontWeight: 700, color: "#8FA6C6" }}>{row.rank}</span>
              <span className="ink-ring" style={{ width: 30, height: 30 }}><Icon name="user" size={16} /></span>
              <span className="min-w-0 flex-1">
                <span className="h3 block truncate" style={{ textTransform: "none", fontSize: "var(--type-body)" }}>{row.name}</span>
                <span className="micro">{row.me ? "ВЫ" : "ИГРОК АРЕНЫ"}</span>
              </span>
              <span className="tabular" style={{ fontWeight: 700, color: "#FFE9A8" }}>{row.score.toLocaleString("ru-RU")}</span>
            </Panel>
          ))}
        </div>
      }
      cta={<Btn tone="primary" onClick={() => ctx.go("p25")} style={{ width: "100%", minHeight: 56 }}>В ТУРНИР · СЕЗОН 12</Btn>}
    />
  );
}

/* ============================= P28 · ACADEMY ============================= */
export function Academy({ ctx }: { ctx: GameCtx }) {
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={90}
      head={<ScreenTitle kicker="6 УРОКОВ · 3 ПРОЙДЕНО" title="АКАДЕМИЯ АРЕНЫ" right={<Art assetId={ctx.assign.ornament} size={46} />} />}
      media={
        <MediaPanel assetId={ctx.assign.hero} size={140}>
          <div className="absolute left-2 top-2 right-2">
            <NoteStrip tone="feather" doodle="spark">IF IT FITS ON A MUG, IT ISN'T SPECIFIC ENOUGH.</NoteStrip>
          </div>
        </MediaPanel>
      }
      body={
        <div className="scroll-y flex min-h-0 flex-col gap-1.5 pr-1">
          {LESSONS.map((l, i) => {
            const done = i < 3;
            return (
              <Panel key={l.id} className="flex items-center gap-2.5 p-2" onClick={() => { sfx.tick(); ctx.go("p29"); }} style={{ opacity: i > 3 ? 0.6 : 1 }}>
                <span className="grid h-9 w-9 flex-none place-items-center rounded-xl" style={{ background: done ? "rgba(51,193,161,.16)" : "rgba(76,97,128,.25)", border: "1px solid var(--stroke)" }}>
                  <Icon name={l.visual === "candle" ? "chartLine" : l.visual === "trend" ? "pulse" : l.visual === "volume" ? "sizeUp" : l.visual === "risk" ? "shield" : l.visual === "tf" ? "tfStack" : "seal"} size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="micro" style={{ color: "var(--accent)" }}>{l.chapter} · {l.minutes} МИН</div>
                  <div className="h3 truncate" style={{ textTransform: "none" }}>{l.title}</div>
                </div>
                <Chip tone={done ? "#2E7F5C" : "#4C6180"} solid>{done ? "ГОТОВО" : i === 3 ? "СЕЙЧАС" : "ЗАКРЫТ"}</Chip>
              </Panel>
            );
          })}
        </div>
      }
      cta={<Btn tone="primary" onClick={() => ctx.go("p29")} style={{ width: "100%", minHeight: 56 }}>ОТКРЫТЬ УРОК 4</Btn>}
    />
  );
}

/* ============================== P29 · LESSON ============================= */
export function Lesson({ ctx }: { ctx: GameCtx }) {
  const l = LESSONS[2];
  const answers = ["Пробой с объёмом выше среднего", "Длинная тень снизу", "Ровная белая свеча"];
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={100}
      head={<ScreenTitle kicker={`${l.chapter} · ${l.minutes} МИН`} title={l.title} right={<Art assetId={ctx.assign.ornament} size={44} />} />}
      media={
        <MediaPanel assetId={ctx.assign.hero} size={160}>
          <div className="absolute right-2 top-2"><Chip tone="#D0B24A" solid>ПРАКТИКА</Chip></div>
        </MediaPanel>
      }
      body={
        <>
          <p className="body" style={{ color: "var(--ink)", fontSize: "var(--type-meta)" }}>{l.idea}</p>
          <NoteStrip tone="cream" doodle="smile">THE BODY IS THE DECISION. THE WICK IS DOUBT.</NoteStrip>
          <div className="micro">КВИЗ · Какой признак подтверждает истинный пробой?</div>
          <div className="flex flex-col gap-1.5">
            {answers.map((a, i) => (
              <button key={a} type="button"
                onClick={() => {
                  const ok = i === 0;
                  ctx.update({ lessonQuiz: i, lessonFeedback: ok ? "Верно: объём подтверждает намерение." : "Нет. Тень говорит о попытке, а не о результате." });
                  if (ok) sfx.win(); else sfx.lose();
                }}
                className={`btn ${ctx.st.lessonQuiz === i ? (i === 0 ? "btn-primary" : "btn-red") : "btn-ghost"}`}
                style={{ minHeight: 44, justifyContent: "flex-start", paddingLeft: 12 }}>
                {a}
              </button>
            ))}
          </div>
          {ctx.st.lessonFeedback && <span className="body anim-rise" style={{ fontSize: "var(--type-micro)" }}>{ctx.st.lessonFeedback}</span>}
        </>
      }
      cta={
        <Btn tone="primary" disabled={ctx.st.lessonQuiz !== 0} onClick={() => { ctx.update({ lessonQuiz: null, lessonFeedback: null }); ctx.go("p28"); }} style={{ width: "100%", minHeight: 56 }}>
          ЗАВЕРШИТЬ УРОК · +40 XP
        </Btn>
      }
    />
  );
}

/* ============================= P30 · PROFILE ============================= */
export function Profile({ ctx }: { ctx: GameCtx }) {
  const p = PROFILE;
  const R = 46;
  const pt = (i: number, k: number) => {
    const ang = (i / p.axes.length) * Math.PI * 2 - Math.PI / 2;
    return `${50 + Math.cos(ang) * R * k},${50 + Math.sin(ang) * R * k}`;
  };
  const pts = p.axes.map((a, i) => pt(i, a.v)).join(" ");
  const web = [0.4, 0.7, 1].map((k) => p.axes.map((_, i) => pt(i, k)).join(" "));
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={120}
      head={<ScreenTitle kicker="ПРОФИЛЬ ИГРОКА" title={p.handle} right={<Chip tone="#D0B24A" solid>{p.rank}</Chip>} />}
      media={
        <Panel className="flex h-full items-center justify-center gap-3 p-2">
          <svg width="128" height="128" viewBox="0 0 100 100" aria-hidden="true">
            {web.map((w, i) => <polygon key={i} points={w} fill="none" stroke="#4E7BB0" strokeWidth=".5" opacity=".5" />)}
            {p.axes.map((a, i) => <line key={a.k} x1="50" y1="50" x2={pt(i, 1).split(",")[0]} y2={pt(i, 1).split(",")[1]} stroke="#4E7BB0" strokeWidth=".5" opacity=".45" />)}
            <polygon points={pts} fill="rgba(51,193,161,.35)" stroke="#46d3b1" strokeWidth="1.6" />
            {p.axes.map((a, i) => { const [x, y] = pt(i, a.v).split(","); return <circle key={a.k} cx={x} cy={y} r="1.8" fill="#EAFFF9" />; })}
          </svg>
          <div className="flex flex-col gap-1">
            {p.axes.map((a) => (
              <span key={a.k} className="micro" style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span>{a.k}</span><span className="tabular" style={{ color: "var(--accent)" }}>{Math.round(a.v * 100)}</span>
              </span>
            ))}
          </div>
        </Panel>
      }
      body={
        <>
          <Progress value={p.xp / p.xpMax} label={`УРОВЕНЬ ${p.lvl}`} right={`${p.xp}/${p.xpMax} XP`} />
          <div className="grid grid-cols-2 gap-1.5">
            <Mini k="РАУНДОВ" v={String(p.rounds)} />
            <Mini k="ТОЧНОСТЬ" v={`${Math.round(p.accuracy * 100)}%`} />
            <Mini k="ЛУЧШИЙ R" v={p.bestR.toFixed(1)} />
            <Mini k="ДИСЦИПЛИНА" v={`${Math.round(p.discipline * 100)}%`} />
          </div>
        </>
      }
      cta={
        <div className="flex gap-2">
          <Btn tone="ghost" onClick={() => ctx.go("p31")} style={{ flex: "0 0 108px", minHeight: 56 }}>НАСТРОЙКИ</Btn>
          <Btn tone="primary" onClick={() => ctx.go("p34")} style={{ flex: 1, minHeight: 56 }}>ИТОГ СЕРИИ</Btn>
        </div>
      }
    />
  );
}

/* ============================ P31 · SETTINGS ============================= */
export function Settings({ ctx }: { ctx: GameCtx }) {
  const motions: ("subtle" | "punchy" | "cinematic")[] = ["subtle", "punchy", "cinematic"];
  const toggles: { k: "reduced" | "sound" | "haptics"; t: string; d: string }[] = [
    { k: "reduced", t: "REDUCE MOTION", d: "движение заменяется кросс-фейдом" },
    { k: "sound", t: "ЗВУК АРЕНЫ", d: "синтез WebAudio, без внешних файлов" },
    { k: "haptics", t: "ВИБРО ОТВЕТ", d: "Telegram HapticFeedback" },
  ];
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={84}
      head={<ScreenTitle kicker="СИСТЕМА · ДОСТУПНОСТЬ" title="НАСТРОЙКИ" right={<Art assetId={ctx.assign.emblem} size={44} />} />}
      media={
        <Panel className="flex h-full flex-col justify-center gap-1.5 p-2.5">
          <div className="micro">MOTION PRESET</div>
          <div className="seg">
            {motions.map((m) => (
              <button key={m} type="button" className={ctx.st.motion === m ? "is-on" : ""} onClick={() => { sfx.tick(); ctx.update({ motion: m }); }}>
                {m === "subtle" ? "ТИХИЙ" : m === "punchy" ? "УДАРНЫЙ" : "КИНО"}
              </button>
            ))}
          </div>
        </Panel>
      }
      body={
        <div className="flex flex-col gap-1.5">
          {toggles.map((tg) => (
            <Panel key={tg.k} className="flex items-center gap-3 p-2.5">
              <span className="min-w-0 flex-1">
                <span className="h3 block">{tg.t}</span>
                <span className="micro">{tg.d}</span>
              </span>
              <button type="button" aria-pressed={ctx.st[tg.k]}
                onClick={() => { sfx.tick(); const next = !ctx.st[tg.k]; ctx.update({ [tg.k]: next } as never); }}
                style={{
                  width: 54, height: 30, borderRadius: 99, border: "1px solid var(--stroke)", position: "relative", flex: "none",
                  background: ctx.st[tg.k] ? "linear-gradient(180deg,#56d6b4,var(--accent-deep))" : "rgba(8,17,31,.9)",
                  transition: "background var(--t-fast) linear",
                }}>
                <span style={{ position: "absolute", top: 3, left: ctx.st[tg.k] ? 27 : 3, width: 22, height: 22, borderRadius: 99, background: "#EAF3FF", transition: "left var(--t-med) var(--ease-spring)" }} />
              </button>
            </Panel>
          ))}
        </div>
      }
      cta={
        <div className="flex gap-2">
          <Btn tone="ghost" onClick={() => ctx.go("p30")} style={{ flex: 1, minHeight: 56 }}>К ПРОФИЛЮ</Btn>
          <Btn tone="red" onClick={() => ctx.restartSeries()} style={{ flex: 1, minHeight: 56 }}>СБРОСИТЬ СЕРИЮ</Btn>
        </div>
      }
    />
  );
}

/* ======================= P32 · NOTIFICATIONS ============================= */
export function Notifications({ ctx }: { ctx: GameCtx }) {
  const unread = ctx.st.notificationsRead ? 0 : 3;
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={84}
      head={<ScreenTitle kicker={`НЕПРОЧИТАННЫХ: ${unread}`} title="СИГНАЛЫ АРЕНЫ" right={<Art assetId={ctx.assign.ornament} size={44} />} />}
      media={<MediaPanel assetId={ctx.assign.ornament} size={110} caption={unread ? "СИСТЕМА ХОЧЕТ ТВОЕГО ВНИМАНИЯ" : "ТИШИНА. ЭТО ПОДОЗРИТЕЛЬНО"} />}
      body={
        <div className="scroll-y flex min-h-0 flex-col gap-1.5 pr-1">
          {NOTIFICATIONS.map((n, i) => (
            <Panel key={n.title} className="flex items-start gap-2 p-2" style={{ opacity: ctx.st.notificationsRead || i > 2 ? 0.6 : 1 }}>
              <span style={{ flex: "none" }}><Icon name="spark" size={18} /></span>
              <span className="min-w-0 flex-1">
                <span className="micro" style={{ color: "var(--accent)" }}>{n.tag} · {n.time}</span>
                <span className="h3 block" style={{ textTransform: "none", fontSize: "var(--type-body)" }}>{n.title}</span>
              </span>
            </Panel>
          ))}
        </div>
      }
      cta={
        <div className="flex gap-2">
          <Btn tone="ghost" onClick={() => ctx.go("p10")} style={{ flex: "0 0 100px", minHeight: 56 }}>В АРЕНУ</Btn>
          <Btn tone="primary" onClick={() => { sfx.tick(); ctx.update({ notificationsRead: true }); }} style={{ flex: 1, minHeight: 56 }}>
            {ctx.st.notificationsRead ? "ВСЁ ПРОЧИТАНО" : "ОТМЕТИТЬ ПРОЧИТАННЫМ"}
          </Btn>
        </div>
      }
    />
  );
}

/* ========================== P33 · MORE / DOCS =========================== */
export function More({ ctx }: { ctx: GameCtx }) {
  const docs = [
    { t: "brand.md", d: "эмблема: скрещённые свечи над щитом арены" },
    { t: "style-tone.txt", d: "голос: панк-таблоидная криптосатира" },
    { t: "topbar/topbar.html", d: "канонический Top Bar (locked)" },
    { t: "skill-card-icons/", d: "c01…c40 · точные вектора" },
  ];
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={84}
      head={<ScreenTitle kicker="СЛУЖЕБНЫЕ РАЗДЕЛЫ" title="ЕЩЁ" right={<Art assetId={ctx.assign.emblem} size={44} />} />}
      media={
        <Panel className="grid h-full grid-cols-3 content-center gap-1.5 p-2">
          <Mini k="СТРАНИЦ" v={String(PAGES.length)} />
          <Mini k="ВАРИАНТОВ" v={String(PAGES.reduce((a, p) => a + p.variants.length, 0))} />
          <Mini k="КАРТ" v={String(SKILL_ASSET_IDS.length)} />
        </Panel>
      }
      body={
        <div className="scroll-y flex min-h-0 flex-col gap-1.5 pr-1">
          {[
            { k: "p25", t: "ТУРНИРЫ", icon: "trophy" },
            { k: "p27", t: "ЛИДЕРБОРД", icon: "crown" },
            { k: "p24", t: "РИТУАЛ", icon: "flame" },
            { k: "p30", t: "ПРОФИЛЬ", icon: "user" },
          ].map((r) => (
            <Panel key={r.k} className="flex items-center gap-2 p-2" onClick={() => { sfx.tick(); ctx.go(r.k); }}>
              <Icon name={r.icon as "trophy"} size={18} />
              <span className="h3 flex-1">{r.t}</span>
              <Icon name="chevron" size={16} />
            </Panel>
          ))}
          {docs.map((d) => (
            <Panel key={d.t} inset className="flex items-center gap-2 p-2">
              <Icon name="doc" size={16} />
              <span className="min-w-0">
                <span className="h3 block" style={{ textTransform: "none", fontSize: "var(--type-meta)" }}>{d.t}</span>
                <span className="micro">{d.d}</span>
              </span>
            </Panel>
          ))}
          <Panel inset className="p-2">
            <div className="micro mb-1">MISSING ASSET · {MISSING_ASSETS.length} · ЯЧЕЕК МАТРИЦЫ {ASSET_MATRIX.length} · 3-ВАРИАНТНЫХ {THREE_VARIANT_PAGES.length}</div>
            <p className="body" style={{ fontSize: "var(--type-micro)" }}>{PAGE_COUNT_MISMATCH.action}</p>
          </Panel>
        </div>
      }
      cta={<Btn tone="primary" icon={<Icon name="archive" size={18} />} onClick={() => ctx.resetVariant()} style={{ width: "100%", minHeight: 56 }}>СБРОСИТЬ КАСТОМИЗАЦИЮ</Btn>}
    />
  );
}

/* ========================= P34 · SERIES RECAP ============================ */
export function SeriesRecap({ ctx }: { ctx: GameCtx }) {
  const total = SERIES_ROUNDS.length;
  const wins = SERIES_ROUNDS.filter((r) => r.result === "win").length;
  const stars = SERIES_ROUNDS.reduce((a, r) => a + r.stars, 0);
  return (
    <Compose
      composition={comp(ctx)}
      mediaMin={96}
      head={<ScreenTitle kicker={`СЕРИЯ · ${total} РАУНДОВ ЗАКРЫТО`} title="ИТОГ СЕРИИ" right={<Art assetId={ctx.assign.ornament} size={46} />} />}
      media={
        <Panel className="grid h-full grid-cols-3 content-center gap-1.5 p-2">
          <Mini k="ЗАЧЁТОВ" v={`${wins}/${total}`} tone="var(--accent)" />
          <Mini k="ЗВЁЗД" v={`${stars}/${total * 3}`} tone="#FFE9A8" />
          <Mini k="ТОЧНОСТЬ" v="62%" />
        </Panel>
      }
      body={
        <div className="scroll-y flex min-h-0 flex-col gap-1.5 pr-1">
          {SERIES_ROUNDS.map((r) => {
            const s = SCENARIOS[r.round - 1];
            const d = DECISIONS.find((x) => x.id === r.decision);
            return (
              <Panel key={r.round} inset className="flex items-center gap-2 p-2">
                <span className="tabular" style={{ width: 18, color: "#8FA6C6", fontWeight: 700 }}>{r.round}</span>
                <span className="min-w-0 flex-1">
                  <span className="h3 block truncate" style={{ textTransform: "none", fontSize: "var(--type-meta)" }}>{s.asset} · {s.tf} · {d?.ru}</span>
                  <span className="micro">движение {r.pct > 0 ? "+" : ""}{r.pct}%</span>
                </span>
                <span className="flex items-center gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ opacity: i < r.stars ? 1 : 0.25, filter: i < r.stars ? "none" : "grayscale(1)" }}><IconStar size={14} /></span>
                  ))}
                </span>
              </Panel>
            );
          })}
        </div>
      }
      cta={
        <div className="flex gap-2">
          <Btn tone="ghost" onClick={() => ctx.go("p10")} style={{ flex: "0 0 100px", minHeight: 56 }}>В АРЕНУ</Btn>
          <Btn tone="primary" onClick={() => ctx.restartSeries()} style={{ flex: 1, minHeight: 56 }}>НОВАЯ СЕРИЯ</Btn>
        </div>
      }
    />
  );
}

export { IconCoin, ASSETS };
