import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Chart from "../components/Chart";
import { CTA, Chip, Panel, SkillCardTile, shade } from "../components/ui";
import { SkillIcon, IconStar, IconPadlock, IconCardDeck, IconGraduationCap, IconLightning, IconBell } from "../components/icons";
import { scenarioOf, evaluate, VERDICT, type Verdict } from "../data/scenarios";
import { SKILLS, GROUP_COLOR, GROUP_NAME, byId, type CardGroup } from "../data/skills";
import { useGame } from "../game/store";
import { ui, useUi } from "../game/ui";
import { sound } from "../utils/sound";
import { Body, Foot, type SP } from "./Onboarding";

const Title = ({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) => (
  <div className="flex items-center justify-between px-4 pt-3">
    <span className="text-[17px] font-black text-white">{children}</span>
    {right}
  </div>
);
const Scroll = ({ children }: { children: React.ReactNode }) => (
  <div className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto px-4 pb-3 pt-3">{children}</div>
);

/* ===== A · Академия, дерево тем ===== */
export function AAcademy({ v, next }: SP) {
  const chapters = [
    { n: 1, title: "Сколько сделок", state: "done", cards: ["c01", "c03", "c12", "c09"], progress: 4 },
    { n: 2, title: "Куда шла цена", state: "open", cards: ["c02", "c04", "c13", "c07"], progress: 1 },
    { n: 3, title: "Сколько можно потерять", state: "locked", cards: ["c16", "c23", "c24", "c18"], progress: 0 },
    { n: 4, title: "Что вокруг", state: "locked", cards: ["c25", "c29", "c31", "c32"], progress: 0 },
  ];
  return (
    <>
      <div className="relative h-[108px] shrink-0 overflow-hidden" style={{ background: `linear-gradient(160deg, ${v.accent}26, #0d1728)` }}>
        <div className="grid-lines absolute inset-0 opacity-35" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(10,15,25,${0.1 + v.tint}) 0%, #0a0f19 100%)` }} />
        <div className="absolute bottom-3 left-4">
          <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: v.accent }}>Академия</div>
          <div className="text-[22px] font-black text-white">Главы</div>
        </div>
      </div>
      <Scroll>
        <div className="relative pl-6">
          <span className="absolute bottom-4 left-[11px] top-2 w-0.5 bg-[#22314f]" />
          {chapters.map((ch, i) => {
            const locked = ch.state === "locked";
            const done = ch.state === "done";
            const col = done ? "#35e0c8" : ch.state === "open" ? v.accent : "#3a4a6a";
            return (
              <motion.button key={ch.n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} onClick={() => !locked && next()}
                className="relative mb-3 flex w-full items-center gap-3 rounded-2xl p-3 text-left" style={{ background: "rgba(16,26,46,0.9)", border: `1px solid ${locked ? "rgba(90,120,170,0.14)" : col + "55"}`, opacity: locked ? 0.55 : 1 }}>
                <span className="absolute -left-6 grid h-6 w-6 place-items-center rounded-full text-[10px] font-black" style={{ background: col, color: "#06231f", boxShadow: `0 0 0 4px #0a0f19` }}>{done ? "✓" : locked ? <IconPadlock className="h-3 w-3" /> : ch.n}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[10.5px] font-black uppercase tracking-wider" style={{ color: col }}>Глава {ch.n} · {done ? "пройдена" : locked ? "закрыта" : "доступна"}</div>
                  <div className="text-[15px] font-black text-white">{ch.title}</div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#1c2b47]"><div className="h-full rounded-full" style={{ width: `${(ch.progress / 4) * 100}%`, background: col }} /></div>
                </div>
                <div className="flex -space-x-2">
                  {ch.cards.slice(0, 3).map((id) => { const c = byId(id); return <span key={id} className="grid h-7 w-7 place-items-center rounded-lg ring-2 ring-[#0e1628]" style={{ background: GROUP_COLOR[c.group], filter: locked ? "grayscale(1)" : "none" }}><SkillIcon id={id} className="h-4 w-4 text-white" /></span>; })}
                </div>
              </motion.button>
            );
          })}
        </div>
      </Scroll>
    </>
  );
}

/* ===== C · Мои приёмы ===== */
export function CDeck({ v, next }: SP) {
  const { state } = useGame();
  const owned = new Set(state.cards.length ? state.cards : ["c01", "c03", "c12", "c09", "c16", "c25", "c34"]);
  const groups: CardGroup[] = ["green", "yellow", "blue", "red"];
  return (
    <>
      <Title right={<Chip color={v.accent}>{owned.size} из 40</Chip>}>Мои приёмы</Title>
      <Scroll>
        {groups.map((g) => (
          <div key={g} className="mb-4">
            <div className="mb-2 flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: GROUP_COLOR[g] }} /><span className="text-[11px] font-black uppercase tracking-wide text-[var(--ink-dim)]">{GROUP_NAME[g]}</span></div>
            <div className="grid grid-cols-4 gap-x-1 gap-y-3">
              {SKILLS.filter((c) => c.group === g).slice(0, 8).map((c, i) => <SkillCardTile key={c.id} card={c} size={62} pro={state.proTerms} locked={!owned.has(c.id)} isNew={owned.has(c.id) && i === 0 && g === "green"} onClick={owned.has(c.id) ? next : undefined} />)}
            </div>
          </div>
        ))}
      </Scroll>
    </>
  );
}

/* ===== E · Арена, главный ===== */
export function EArena({ v, next }: SP) {
  const { state } = useGame();
  const empty = state.attempts <= 0;
  const sc = scenarioOf(4);
  return (
    <>
      <Body className="justify-center">
        <div className="text-center">
          <div className="text-[11px] font-black uppercase tracking-wider" style={{ color: v.accent }}>Арена</div>
          <h2 className="mt-1 text-[26px] font-black leading-tight text-white">Следующий заход</h2>
        </div>
        <Panel className="mt-4" glow={v.accent}>
          <div className="relative">
            <Chart sc={sc} treatment={v.chart} height={170} showLabels={false} />
            <div className="absolute left-3 top-3 flex gap-1.5"><Chip color={v.accent}>{sc.name}</Chip><Chip color="#97a6c4">{sc.period}</Chip></div>
          </div>
        </Panel>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[["Свечей", "24"], ["Источника", "2"], ["Слот", "1"]].map(([k, n]) => (
            <div key={k} className="rounded-2xl py-3" style={{ background: "rgba(16,26,46,0.9)", border: "1px solid rgba(90,120,170,0.16)" }}>
              <div className="text-[18px] font-black text-white">{n}</div><div className="text-[10px] font-bold uppercase tracking-wide text-[var(--ink-mute)]">{k}</div>
            </div>
          ))}
        </div>
        {empty && <p className="mt-4 text-center text-[13px] font-semibold text-[#D0A24A]">Попытки закончились. Новая — через 18 минут.</p>}
      </Body>
      <Foot>
        <motion.div animate={empty ? {} : { scale: [1, 1.015, 1] }} transition={{ duration: 2.4, repeat: Infinity }}>
          <CTA big accent={v.accent} disabled={empty} onClick={next}>{empty ? "Ждём попытку" : "Войти в заход"}</CTA>
        </motion.div>
      </Foot>
    </>
  );
}

/* ===== G · Лист источника (standalone state) ===== */
export function GSource({ v, next }: SP) {
  const sc = scenarioOf(4);
  const s = sc.sources[0];
  return (
    <>
      <Title right={<Chip color={v.accent}>открыт</Chip>}>Источник</Title>
      <Body className="justify-center">
        <Panel glow={v.accent}>
          <div className="p-5">
            <div className="grid h-14 w-14 place-items-center rounded-2xl text-[26px]" style={{ background: `${v.accent}22` }}>📄</div>
            <h3 className="mt-4 text-[22px] font-black text-white">{s.title}</h3>
            <p className="mt-2 text-[16px] leading-relaxed text-[var(--ink)]">{s.body}</p>
            <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-[var(--ink-mute)]"><span>⏱</span> После прочтения источник считается использованным</div>
          </div>
        </Panel>
      </Body>
      <Foot><CTA accent={v.accent} onClick={next}>Учту</CTA></Foot>
    </>
  );
}

/* ===== H · Решение (действие · почему · когда пойму) — одна карточка со статусом ===== */
export function HDecision({ v, next }: SP) {
  const { state, dispatch } = useGame();
  const sc = scenarioOf(4);
  const cur = state.current;
  const [part, setPart] = useState<0 | 1 | 2>(cur.choice === null ? 0 : cur.reason === null ? 1 : 2);
  const ready = cur.choice !== null && cur.reason && cur.wrongIf;
  const parts = [
    { k: "Действие", val: cur.choice !== null ? sc.choices[cur.choice] : null },
    { k: "Почему", val: sc.reasons.find((r) => r.id === cur.reason)?.text ?? null },
    { k: "Пойму, что ошибся, если", val: sc.wrongIf.find((r) => r.id === cur.wrongIf)?.text ?? null },
  ];
  return (
    <>
      <Title right={<Chip color={ready ? "#35e0c8" : "#97a6c4"}>{ready ? "готово к фиксации" : "не заполнено"}</Chip>}>Решение</Title>
      <Body>
        <div className="mt-2 space-y-2">
          {parts.map((p, i) => (
            <button key={p.k} onClick={() => setPart(i as 0 | 1 | 2)} className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left" style={{ background: part === i ? `${v.accent}14` : "rgba(16,26,46,0.9)", border: `1.5px solid ${part === i ? v.accent : p.val ? "#35e0c855" : "rgba(90,120,170,0.18)"}` }}>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-black" style={{ background: p.val ? "#35e0c8" : "#0c1424", color: p.val ? "#06231f" : "var(--ink-mute)" }}>{p.val ? "✓" : i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10.5px] font-black uppercase tracking-wider text-[var(--ink-mute)]">{p.k}</span>
                <span className="block truncate text-[13.5px] font-bold text-white">{p.val ?? "—"}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="mt-3 grid gap-2">
          {part === 0 && sc.choices.map((c, i) => <Opt key={c} on={cur.choice === i} text={c} color={v.accent} onClick={() => { dispatch({ type: "choose", choice: i }); setPart(1); }} />)}
          {part === 1 && sc.reasons.map((r) => <Opt key={r.id} on={cur.reason === r.id} text={r.text} color={v.accent} onClick={() => { dispatch({ type: "reason", id: r.id }); setPart(2); }} />)}
          {part === 2 && sc.wrongIf.map((r) => <Opt key={r.id} on={cur.wrongIf === r.id} text={`…${r.text}`} color={v.accent} onClick={() => dispatch({ type: "wrongIf", id: r.id })} />)}
        </div>
      </Body>
      <Foot><CTA accent={v.accent} disabled={!ready} onClick={next}>Зафиксировать</CTA></Foot>
    </>
  );
}
function Opt({ on, text, color, onClick }: { on: boolean; text: string; color: string; onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={onClick} className="rounded-2xl px-4 py-3 text-left text-[14px] font-bold text-white" style={{ minHeight: 48, background: on ? `${color}22` : "rgba(16,26,46,0.9)", border: `1.5px solid ${on ? color : "rgba(90,120,170,0.18)"}` }}>{text}</motion.button>
  );
}

/* ===== K · Разбор ===== */
export function KBreakdown({ v, next }: SP) {
  const { state } = useGame();
  const sc = scenarioOf(4);
  const res = useMemo(() => evaluate(sc, state.current.choice ?? 1, state.current.reason ?? "r1", state.current.wrongIf ?? "w1"), [sc, state.current]);
  const considered = [
    { id: "c12", ok: true, t: "Сколько сделок: заметили, что покупателей стало меньше" },
    { id: "c29", ok: true, t: "Что делают все: разговоры везде — сигнал осторожности" },
    { id: "c09", ok: false, t: "Где цена останавливалась: не посмотрели, где был прошлый пол" },
  ];
  return (
    <>
      <Title right={<Chip color={VERDICT[res.verdict].color}>{VERDICT[res.verdict].title}</Chip>}>Разбор</Title>
      <Scroll>
        <Panel><Chart sc={sc} treatment={v.chart} revealed={99} hideVeil showEvent height={150} compact /></Panel>
        <div className="mt-3 text-[11px] font-black uppercase tracking-wide text-[var(--ink-dim)]">Что учтено, что нет</div>
        <div className="mt-2 space-y-2">
          {considered.map((r) => { const c = byId(r.id); const col = GROUP_COLOR[c.group]; return (
            <div key={r.id} className="flex items-center gap-3 rounded-2xl p-2.5" style={{ background: "rgba(16,26,46,0.9)", border: `1px solid ${r.ok ? "rgba(90,120,170,0.18)" : "#D0A24A55"}` }}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: `linear-gradient(150deg, ${shade(col, 12)}, ${shade(col, -16)})` }}><SkillIcon id={c.id} className="h-6 w-6 text-white" /></span>
              <span className="flex-1 text-[12.5px] font-semibold leading-snug text-[var(--ink)]">{r.t}</span>
              <span className="text-[11px] font-black" style={{ color: r.ok ? "#35e0c8" : "#D0A24A" }}>{r.ok ? "учтено" : "не учтено"}</span>
            </div>
          ); })}
        </div>
        <div className="mt-3 rounded-2xl p-3.5" style={{ background: `${v.accent}12`, border: `1px solid ${v.accent}44` }}>
          <div className="text-[10.5px] font-black uppercase tracking-wider" style={{ color: v.accent }}>Похожая ситуация</div>
          <div className="mt-0.5 text-[14px] font-extrabold text-white">Биткоин · весна — быстрый рост и остановка</div>
          <div className="text-[12px] text-[var(--ink-dim)]">Можно повторить заход с этим приёмом</div>
        </div>
      </Scroll>
      <Foot><CTA accent={v.accent} onClick={next}>Повторить похожий заход</CTA></Foot>
    </>
  );
}

/* ===== L · Профиль ===== */
export function LProfile({ v, next }: SP) {
  const { state } = useGame();
  const hist = state.history.length ? state.history : [];
  const strong = ["c12", "c01"], weak = ["c09", "c16"];
  return (
    <>
      <Title right={<Chip color={v.accent}>{hist.length ? "есть история" : "новичок"}</Chip>}>Профиль</Title>
      <Scroll>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[["Заходов", String(hist.length)], ["Звёзд", String(state.stars)], ["Рассуждал верно", hist.length ? `${Math.round((hist.filter((h) => h.verdict.startsWith("reasoned")).length / hist.length) * 100)}%` : "—"]].map(([k, n]) => (
            <div key={k} className="rounded-2xl px-1 py-3" style={{ background: "rgba(16,26,46,0.9)", border: "1px solid rgba(90,120,170,0.16)" }}>
              <div className="text-[18px] font-black text-white">{n}</div><div className="text-[9.5px] font-bold uppercase leading-tight tracking-wide text-[var(--ink-mute)]">{k}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl p-3" style={{ background: "rgba(53,224,200,0.08)", border: "1px solid rgba(53,224,200,0.3)" }}>
            <div className="text-[10.5px] font-black uppercase tracking-wider text-[#35e0c8]">Сильные стороны</div>
            <div className="mt-2 space-y-1.5">{strong.map((id) => <Row key={id} id={id} pro={state.proTerms} />)}</div>
          </div>
          <div className="rounded-2xl p-3" style={{ background: "rgba(208,162,74,0.08)", border: "1px solid rgba(208,162,74,0.3)" }}>
            <div className="text-[10.5px] font-black uppercase tracking-wider text-[#D0A24A]">Зоны роста</div>
            <div className="mt-2 space-y-1.5">{weak.map((id) => <Row key={id} id={id} pro={state.proTerms} />)}</div>
          </div>
        </div>
        <div className="mt-4 text-[11px] font-black uppercase tracking-wide text-[var(--ink-dim)]">Последние заходы</div>
        <div className="mt-2 space-y-2">
          {(hist.length ? hist : [{ run: 0, name: "Пока пусто", verdict: "reasoned-good", stars: 0 }]).slice(0, 4).map((h, i) => {
            const vd = VERDICT[h.verdict as Verdict];
            return (
              <button key={i} onClick={next} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left" style={{ background: "rgba(16,26,46,0.9)", border: "1px solid rgba(90,120,170,0.16)" }}>
                <span className="h-9 w-1.5 rounded-full" style={{ background: vd.color }} />
                <span className="min-w-0 flex-1"><span className="block text-[13px] font-extrabold text-white">{h.name}</span><span className="block truncate text-[11px] text-[var(--ink-dim)]">{h.run ? vd.title : "Сыграйте первый заход"}</span></span>
                <span className="flex gap-0.5">{Array.from({ length: h.stars }, (_, n) => <IconStar key={n} className="h-3.5 w-3.5 text-[#ffd15c]" />)}</span>
              </button>
            );
          })}
        </div>
      </Scroll>
    </>
  );
}
function Row({ id, pro }: { id: string; pro: boolean }) {
  const c = byId(id);
  return <div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-md" style={{ background: GROUP_COLOR[c.group] }}><SkillIcon id={id} className="h-3.5 w-3.5 text-white" /></span><span className="text-[11.5px] font-bold text-white">{pro ? c.pro : c.plain}</span></div>;
}

/* ===== M · Уведомления (state: есть новые / пусто) ===== */
export function MNotify({ v }: SP) {
  const empty = false; // переключатель empty-состояния для QA состояний
  const items = empty
    ? []
    : ([
      ["star", "Заход по Солане оценён: рассуждали верно", "только что", true],
      ["cards", "Открыт приём «Сколько сделок»", "5 минут назад", true],
      ["academy", "Открыта глава 2 · Куда шла цена", "вчера", false],
      ["energy", "Попытки восстановлены", "вчера", false],
    ] as const);
  return (
    <>
      <Title right={<Chip color={v.accent}>{empty ? "пусто" : "2 новых"}</Chip>}>Уведомления</Title>
      <Scroll>
        {empty ? (
          <div className="grid h-full place-items-center py-16 text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#141f32] text-[#5d7493]">
                <IconBell className="h-7 w-7" />
              </div>
              <p className="mt-3 text-[14px] font-black text-white">Пока нет уведомлений</p>
              <p className="mt-1 text-[12px] text-[var(--ink-mute)]">Здесь появятся оценки заходов и новые приёмы</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(([e, t, w, isNew], i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: isNew ? `${v.accent}10` : "rgba(16,26,46,0.9)", border: `1px solid ${isNew ? v.accent + "44" : "rgba(90,120,170,0.16)"}` }}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: "rgba(12,20,36,0.8)" }}>
                  {e === "star" ? <IconStar className="h-5 w-5 text-[#ffd15c]" /> : e === "cards" ? <IconCardDeck className="h-5 w-5 text-[#26e6c8]" /> : e === "academy" ? <IconGraduationCap className="h-5 w-5 text-[#8baeff]" /> : <IconLightning className="h-5 w-5 text-[#ffd15c]" />}
                </span>
                <div className="min-w-0 flex-1"><div className="text-[13px] font-bold text-white">{t}</div><div className="text-[11px] text-[var(--ink-mute)]">{w}</div></div>
                {isNew && <span className="h-2 w-2 rounded-full" style={{ background: v.accent }} />}
              </motion.div>
            ))}
          </div>
        )}
      </Scroll>
    </>
  );
}

/* ===== N · Настройки ===== */
export function NSettings({ v }: SP) {
  const { state, dispatch } = useGame();
  const { proTerms } = useUi();
  const soundOn = sound.enabled;
  const rows: { k: "proTerms" | "sound" | "animation"; t: string; d: string; on: boolean; act: () => void }[] = [
    {
      k: "proTerms",
      t: "Профессиональные термины",
      d: proTerms ? "Показываем термины" : "Выключено — бытовой язык",
      on: proTerms,
      act: () => ui.set({ proTerms: !proTerms }),
    },
    {
      k: "sound",
      t: "Звук",
      d: "Короткие отклики",
      on: soundOn,
      act: () => { sound.enabled = !soundOn; if (!soundOn) sound.coin(); dispatch({ type: "toggle", key: "sound" }); },
    },
    {
      k: "animation",
      t: "Анимация",
      d: "Плавные переходы",
      on: state.animation,
      act: () => dispatch({ type: "toggle", key: "animation" }),
    },
  ];
  return (
    <>
      <Title>Настройки</Title>
      <Scroll>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-2xl px-4 py-3.5" style={{ background: "rgba(16,26,46,0.9)", border: "1px solid rgba(90,120,170,0.16)" }}>
            <div><div className="text-[14px] font-bold text-white">Язык</div><div className="text-[11px] text-[var(--ink-mute)]">Русский</div></div><span className="text-[var(--ink-mute)]">›</span>
          </div>
          {rows.map((r) => (
            <button key={r.k} onClick={() => { sound.click(); r.act(); }} aria-pressed={r.on} className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left" style={{ background: "rgba(16,26,46,0.9)", border: "1px solid rgba(90,120,170,0.16)" }}>
              <div><div className="text-[14px] font-bold text-white">{r.t}</div><div className="text-[11px] text-[var(--ink-mute)]">{r.d}</div></div>
              <Toggle on={r.on} accent={v.accent} />
            </button>
          ))}
        </div>
        <p className="mt-4 px-1 text-[11.5px] leading-relaxed text-[var(--ink-mute)]">Термины выключены по умолчанию: вместо них — «цена росла», «сделок стало меньше». Включите, когда будете готовы.</p>
      </Scroll>
    </>
  );
}
function Toggle({ on, accent }: { on: boolean; accent: string }) {
  return <span className="relative block h-7 w-12 rounded-full transition" style={{ background: on ? accent : "#26354f" }}><motion.span layout className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow" animate={{ left: on ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} /></span>;
}

/* ===== O · Попытки закончились ===== */
export function ONoAttempts({ v, next }: SP) {
  return (
    <>
      <Body className="items-center justify-center text-center">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2.4 }} className="grid h-28 w-28 place-items-center rounded-full" style={{ background: "rgba(208,162,74,0.12)", border: "1px solid rgba(208,162,74,0.4)" }}>
          <svg viewBox="0 0 48 48" className="h-14 w-14"><circle cx="24" cy="26" r="15" fill="none" stroke="#D0A24A" strokeWidth="3" /><path d="M24 16v10l6 4" fill="none" stroke="#D0A24A" strokeWidth="3" strokeLinecap="round" /><path d="M19 7h10" stroke="#D0A24A" strokeWidth="3" strokeLinecap="round" /></svg>
        </motion.div>
        <h2 className="mt-6 text-[24px] font-black text-white">Попытки закончились</h2>
        <p className="mt-2 text-[15px] font-semibold text-[var(--ink-dim)]">Новая попытка — через</p>
        <div className="mt-1 text-[36px] font-black tabular-nums text-white">18:24</div>
        <div className="mt-2 flex gap-1.5">{[0, 1, 2, 3, 4].map((i) => <span key={i} className="h-2 w-6 rounded-full" style={{ background: "#26354f" }} />)}</div>
        <div className="mt-6 w-full rounded-2xl p-4 text-left" style={{ background: `${v.accent}10`, border: `1px solid ${v.accent}44` }}>
          <div className="text-[10.5px] font-black uppercase tracking-wider" style={{ color: v.accent }}>Пока ждёте</div>
          <div className="mt-0.5 text-[14px] font-extrabold text-white">Глава 2 · Куда шла цена</div>
          <div className="text-[12px] text-[var(--ink-dim)]">Урок на минуту — и новый приём к следующему заходу</div>
        </div>
      </Body>
      <Foot><CTA accent={v.accent} onClick={next}>В Академию</CTA></Foot>
    </>
  );
}

/* ===== P · Незнакомая тема ===== */
export function PUnknown({ v, next }: SP) {
  const c = byId("c25");
  const col = v.chart === "mono" ? "#4C6180" : GROUP_COLOR[c.group];
  return (
    <>
      <Title right={<Chip color="#D0A24A">во время захода</Chip>}>Незнакомая тема</Title>
      <Body className="justify-center">
        <Panel glow="#D0A24A">
          <div className="p-5 text-center">
            <motion.div initial={{ rotate: -10, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="mx-auto grid h-24 w-24 place-items-center rounded-[26px]" style={{ background: `linear-gradient(150deg, ${shade(col, 16)}, ${shade(col, -16)})`, boxShadow: `0 24px 50px -20px ${col}` }}>
              <SkillIcon id={c.id} className="h-12 w-12 text-white" />
            </motion.div>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black" style={{ background: "rgba(208,162,74,0.15)", color: "#D0A24A" }}>⚑ зона роста</div>
            <h3 className="mt-2 text-[22px] font-black text-white">{c.plain}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-dim)]">Этой темы ещё не было в Академии. Штрафа нет — но именно она решает в этом заходе.</p>
          </div>
        </Panel>
        <p className="mt-3 text-center text-[12px] font-bold text-[var(--ink-mute)]">Не больше одной незнакомой темы в заходе</p>
      </Body>
      <Foot><CTA accent={col} onClick={next}>Открыть урок на минуту</CTA></Foot>
    </>
  );
}
