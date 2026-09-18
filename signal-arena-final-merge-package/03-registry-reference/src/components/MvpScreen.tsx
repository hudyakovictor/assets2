import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PAGE_MAP, type PageId, type VariantId } from "../data/pages";
import { canAdvance, nextPage, type Decision, type Evidence, type GameProgress } from "../data/flow";
import { GameShell, DEFAULT_TOP_BAR } from "./Shell";
import { CandleChart, SkillIcon } from "./Icons";
import { EASE, haptic } from "../motion/tokens";

type Props = {
  pageId: PageId;
  variant: VariantId;
  progress: GameProgress;
  setProgress: React.Dispatch<React.SetStateAction<GameProgress>>;
  onPage: (page: PageId) => void;
};

const decisions: { id: Decision; label: string; icon: "c16" | "c17" | "c24" }[] = [
  { id: "ENTER", label: "Войти", icon: "c16" },
  { id: "WAIT", label: "Ждать", icon: "c17" },
  { id: "NO_TRADE", label: "Не торговать", icon: "c24" },
];
const evidence: { id: Evidence; label: string; icon: "c01" | "c03" | "c02" }[] = [
  { id: "STRUCTURE", label: "Структура", icon: "c01" },
  { id: "VOLUME", label: "Объём", icon: "c03" },
  { id: "TIMEFRAME", label: "Старший ТФ", icon: "c02" },
];

export function MvpScreen({ pageId, variant, progress, setProgress, onPage }: Props) {
  const page = PAGE_MAP[pageId];
  const [message, setMessage] = useState<string | null>(null);
  const isReveal = pageId === "P14" || pageId === "P26";

  useEffect(() => {
    setMessage(null);
    if (!isReveal || progress.revealed) return;
    const id = window.setTimeout(() => setProgress((s) => ({ ...s, revealed: true })), 1250);
    return () => window.clearTimeout(id);
  }, [isReveal, pageId, progress.revealed, setProgress]);

  const advance = () => {
    if (pageId === "P31") { setMessage("Список обновлён. Новых сценариев пока нет."); return; }
    if (pageId === "P32" || pageId === "P34") { setProgress((s) => ({ ...s, page: "P19" })); onPage("P19"); return; }
    if (pageId === "P33") { setProgress((s) => ({ ...s, page: "P30" })); onPage("P30"); return; }
    const gate = canAdvance({ ...progress, page: pageId });
    if (!gate.ok) { setMessage(gate.reason ?? "Действие не завершено."); haptic(12); return; }
    const next = nextPage(pageId);
    setProgress((s) => {
      const resetPlan = pageId === "P08" || pageId === "P22";
      return { ...s, page: next, ...(resetPlan ? { selectedDecision: null, evidence: [], invalidation: null, sealed: false, revealed: false } : {}) };
    });
    onPage(next);
    haptic(7);
  };

  const tab = page.chapter === "ACADEMY" ? "ACADEMY" : page.chapter === "COLLECTION" ? "COLLECTION" : page.chapter === "ARENA" || page.chapter === "ONBOARDING" ? "ARENA" : "MORE";
  return (
    <GameShell bottomTab={tab} topBar={{ ...DEFAULT_TOP_BAR, lives: { cur: progress.attempts, max: 5 } }}>
      <motion.section
        key={`${pageId}-${variant}`}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .38, ease: EASE.outExpo }}
        className="relative flex h-full min-h-0 flex-col gap-3 px-3.5 pb-3 pt-2"
      >
        <header className="shrink-0">
          <div className="font-mono text-[9px] uppercase tracking-[.2em] text-white/40">{page.id} · {page.chapter} · {page.state}</div>
          <h1 className="mt-1 font-display text-[15px] font-bold leading-tight text-white">{page.title}</h1>
          <p className="mt-1 text-[11px] leading-snug text-white/58">{page.headline}</p>
        </header>

        <div className="min-h-0 flex-1">{renderBody(pageId, progress, setProgress)}</div>

        {message && <div role="alert" className="shrink-0 rounded-lg border border-[#C56861]/60 bg-[#C56861]/15 px-3 py-2 text-[11px] text-white">{message}</div>}
        {!isNonAdvanceState(pageId) && (
          <button onClick={advance} className="press-scale h-12 shrink-0 rounded-xl bg-accent font-display text-[12px] font-bold uppercase tracking-[.12em] text-void-950 disabled:opacity-40">
            {page.cta}
          </button>
        )}
      </motion.section>
    </GameShell>
  );
}

function renderBody(page: PageId, s: GameProgress, set: React.Dispatch<React.SetStateAction<GameProgress>>) {
  if (page === "P03") return <TargetTask found={s.firstTargetFound} onFound={() => set((v) => ({ ...v, firstTargetFound: true }))} />;
  if (page === "P05" || page === "P10") return <DecisionTask selected={s.selectedDecision} sealed={s.sealed} onSelect={(d) => set((v) => ({ ...v, selectedDecision: d }))} />;
  if (page === "P07") return <PlanTask state={s} set={set} compact />;
  if (page === "P11") return <EvidenceTask selected={s.evidence} sealed={s.sealed} onToggle={(e) => set((v) => ({ ...v, evidence: toggle(v.evidence, e) }))} />;
  if (page === "P12") return <InvalidationTask value={s.invalidation} sealed={s.sealed} onSelect={(x) => set((v) => ({ ...v, invalidation: x }))} />;
  if (page === "P13" || page === "P25") return <SealTask state={s} onSeal={() => set((v) => ({ ...v, sealed: true }))} />;
  if (page === "P14" || page === "P26") return <RevealTask revealed={s.revealed} />;
  if (page === "P16") return <ProcessScore state={s} />;
  if (page === "P17") return <Outcome />;
  if (page === "P18") return <Debrief />;
  if (page === "P24") return <PlanTask state={s} set={set} />;
  if (page === "P30") return <Status title="Исторические данные проверяются" detail="Решение пока недоступно." busy />;
  if (page === "P31") return <Status title="Сценариев нет" detail="Обновление не тратит попытку." />;
  if (page === "P32") return <Status title="Нужна карта объёма" detail="Открой урок в Академии." icon="c03" />;
  if (page === "P33") return <Status title="Ошибка загрузки" detail="Сохранённый план не изменён." icon="c15" />;
  if (page === "P34") return <Status title="Попытки закончились" detail="Академия и колода остаются доступны." icon="c24" />;
  if (["P02","P04","P09","P15","P20","P23"].includes(page)) return <ChartPanel reveal={page === "P15"} />;
  if (["P19","P21","P22"].includes(page)) return <LearningPanel page={page} />;
  return <SummaryPanel page={page} />;
}

function ChartPanel({ reveal = false }: { reveal?: boolean }) {
  return <div className="panel-flat relative h-full overflow-hidden rounded-2xl p-3"><div className="font-mono text-[9px] tracking-[.16em] text-white/45">BTC/USDT · 15M · HISTORICAL</div><div className="mt-4"><CandleChart treatment="chart-default" revealFuture={reveal} targetIdx={9} /></div>{!reveal && <div className="absolute bottom-3 right-3 rounded bg-void-950/80 px-2 py-1 font-mono text-[8px] text-accent">FUTURE SEALED</div>}</div>;
}

function TargetTask({ found, onFound }: { found: boolean; onFound: () => void }) {
  return <div className="panel-flat relative h-full overflow-hidden rounded-2xl p-3"><div className="font-mono text-[9px] text-white/45">НАЖМИ НА ВИДИМУЮ ЗОНУ ПАДЕНИЯ</div><CandleChart treatment="chart-default" revealFuture={false} targetIdx={9} /><button aria-label="Зона падения" onClick={() => { onFound(); haptic(8); }} className={`absolute left-[47%] top-[44%] size-12 rounded-full border-2 ${found ? "border-[#26D67E] bg-[#26D67E]/20" : "border-accent bg-accent/10 animate-pulse"}`}><span className="sr-only">Выбрать зону падения</span></button><p className="absolute inset-x-3 bottom-3 text-[10px] text-white/45">{found ? "Зона отмечена. Это наблюдение, не прогноз." : "Кольцо показывает цель первого действия."}</p></div>;
}

function DecisionTask({ selected, sealed, onSelect }: { selected: Decision | null; sealed: boolean; onSelect: (d: Decision) => void }) {
  return <div className="grid h-full content-center gap-2">{decisions.map((d) => <Choice key={d.id} active={selected === d.id} disabled={sealed} onClick={() => onSelect(d.id)} icon={d.icon} label={d.label} />)}{sealed && <p className="text-center text-[10px] text-white/45">Seal активен: изменение запрещено.</p>}</div>;
}
function EvidenceTask({ selected, sealed, onToggle }: { selected: Evidence[]; sealed: boolean; onToggle: (e: Evidence) => void }) {
  return <div className="grid h-full content-center gap-2"><p className="text-[11px] text-white/55">Выбирай только то, что видно до t0.</p>{evidence.map((e) => <Choice key={e.id} active={selected.includes(e.id)} disabled={sealed} onClick={() => onToggle(e.id)} icon={e.icon} label={e.label} />)}</div>;
}
function InvalidationTask({ value, sealed, onSelect }: { value: string | null; sealed: boolean; onSelect: (x: string) => void }) {
  const options = ["Закрытие ниже 67 795", "Объём не подтверждает ретест", "Старший таймфрейм ломает структуру"];
  return <div className="grid h-full content-center gap-2">{options.map((x, i) => <Choice key={x} active={value === x} disabled={sealed} onClick={() => onSelect(x)} icon={(["c19","c20","c29"] as const)[i]} label={x} />)}</div>;
}
function PlanTask({ state, set, compact }: { state: GameProgress; set: React.Dispatch<React.SetStateAction<GameProgress>>; compact?: boolean }) {
  return <div className="grid h-full content-center gap-2"><div className="grid grid-cols-3 gap-2">{decisions.map((d) => <Choice key={d.id} active={state.selectedDecision === d.id} disabled={state.sealed} onClick={() => set((s) => ({ ...s, selectedDecision: d.id }))} icon={d.icon} label={d.label} compact />)}</div><div className="grid grid-cols-3 gap-2">{evidence.map((e) => <Choice key={e.id} active={state.evidence.includes(e.id)} disabled={state.sealed} onClick={() => set((s) => ({ ...s, evidence: toggle(s.evidence, e.id) }))} icon={e.icon} label={e.label} compact />)}</div><InvalidationTask value={state.invalidation} sealed={state.sealed} onSelect={(x) => set((s) => ({ ...s, invalidation: x }))} />{compact && <p className="text-[9px] text-white/40">Один факт и одно условие отмены обязательны.</p>}</div>;
}

function Choice({ active, disabled, onClick, icon, label, compact }: { active: boolean; disabled: boolean; onClick: () => void; icon: string; label: string; compact?: boolean }) {
  return <button disabled={disabled} onClick={() => { onClick(); haptic(6); }} className={`press-scale flex min-h-11 items-center gap-2 rounded-xl border px-3 text-left ${active ? "border-accent bg-accent/15 text-white" : "border-white/10 bg-void-800 text-white/65"} disabled:opacity-45`}><SkillIcon id={icon as never} size={compact ? 24 : 30} /><span className={`font-display font-bold ${compact ? "text-[9px]" : "text-[11px]"}`}>{label}</span></button>;
}

function SealTask({ state, onSeal }: { state: GameProgress; onSeal: () => void }) {
  const complete = !!state.selectedDecision && state.evidence.length > 0 && !!state.invalidation;
  return <div className="flex h-full flex-col justify-center gap-3"><div className="panel-flat rounded-2xl p-3 text-[11px]"><Row k="Решение" v={state.selectedDecision ?? "не выбрано"} /><Row k="Факты" v={state.evidence.join(", ") || "не выбраны"} /><Row k="Инвалидация" v={state.invalidation ?? "не задана"} /></div><button disabled={!complete || state.sealed} onClick={() => { onSeal(); haptic([8, 20, 12]); }} className="h-14 rounded-xl border border-accent bg-accent/15 font-display text-[12px] font-bold uppercase text-accent disabled:opacity-35">{state.sealed ? "РЕШЕНИЕ ЗАФИКСИРОВАНО" : "SEAL · ЗАФИКСИРОВАТЬ"}</button></div>;
}
function RevealTask({ revealed }: { revealed: boolean }) { return <div className="panel-flat relative h-full overflow-hidden rounded-2xl p-3"><CandleChart treatment="chart-reveal" revealFuture={revealed} targetIdx={9} />{!revealed && <motion.div className="absolute inset-y-0 left-0 w-1 bg-accent" animate={{ x: [0, 330] }} transition={{ duration: 1.2, ease: "linear" }} />}{!revealed && <div className="absolute inset-x-0 bottom-4 text-center font-mono text-[9px] text-accent">HISTORICAL FAST-FORWARD</div>}</div>; }
function ProcessScore({ state }: { state: GameProgress }) { const score = Math.min(100, (state.selectedDecision ? 25 : 0) + state.evidence.length * 20 + (state.invalidation ? 20 : 0) + (state.sealed ? 15 : 0)); return <div className="flex h-full flex-col justify-center gap-3"><div className="text-center font-display text-5xl font-bold text-accent">{score}</div><Row k="Решение сформулировано" v={state.selectedDecision ? "+25" : "0"} /><Row k="Наблюдаемые факты" v={`+${state.evidence.length * 20}`} /><Row k="Инвалидация" v={state.invalidation ? "+20" : "0"} /><Row k="Дисциплина Seal" v={state.sealed ? "+15" : "0"} /></div>; }
function Outcome() { return <Status title="Исторический исход: ретест подтвердился" detail="Это не прибыль игрока и не обещание будущего результата." icon="c17" />; }
function Debrief() { return <div className="grid h-full content-center gap-2"><Row k="Сработало" v="WAIT + подтверждение объёмом" /><Row k="Шум" v="первый импульс без объёма" /><Row k="Повторить" v="инвалидацию до входа" /><p className="mt-2 text-[10px] text-white/45">Незнакомая тема не штрафуется: она открывает рекомендованный урок.</p></div>; }
function LearningPanel({ page }: { page: PageId }) { return <div className="flex h-full flex-col items-center justify-center gap-4 text-center"><SkillIcon id="c03" size={88} cardColor="green" /><h2 className="font-display text-lg font-bold">Подтверждение объёмом</h2><p className="max-w-[270px] text-[11px] text-white/50">{page === "P19" ? "Рекомендовано после разбора." : page === "P21" ? "Карта разблокирована и готова для колоды." : "Карта добавлена в активную колоду."}</p></div>; }
function SummaryPanel({ page }: { page: PageId }) { const icon = page === "P01" ? "c01" : page === "P08" ? "c03" : "c25"; return <div className="flex h-full flex-col items-center justify-center gap-4 text-center"><SkillIcon id={icon} size={86} cardColor="green" /><p className="max-w-[280px] text-[11px] leading-relaxed text-white/52">Каждый следующий шаг открывается только после обязательного действия.</p></div>; }
function Status({ title, detail, icon, busy }: { title: string; detail: string; icon?: string; busy?: boolean }) { return <div className="flex h-full flex-col items-center justify-center gap-3 text-center">{busy ? <motion.div className="size-10 rounded-full border-2 border-white/15 border-t-accent" animate={{ rotate: 360 }} transition={{ duration: .8, repeat: Infinity, ease: "linear" }} /> : icon ? <SkillIcon id={icon as never} size={70} cardColor="blue" /> : null}<h2 className="font-display text-lg font-bold">{title}</h2><p className="max-w-[270px] text-[11px] text-white/50">{detail}</p></div>; }
function Row({ k, v }: { k: string; v: string }) { return <div className="flex items-start justify-between gap-3 border-b border-white/7 py-2 last:border-0"><span className="text-white/42">{k}</span><span className="max-w-[62%] text-right font-medium text-white/82">{v}</span></div>; }
function toggle<T>(items: T[], item: T) { return items.includes(item) ? items.filter((x) => x !== item) : [...items, item]; }
function isNonAdvanceState(page: PageId) { return page === "P30"; }