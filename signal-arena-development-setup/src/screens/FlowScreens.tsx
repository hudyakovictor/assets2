import { useState } from "react";
import type { Page, Variant, ChartTreatment } from "../lib/pages";
import { TerminalWindow, type ChartStyle } from "../components/TerminalWindow";
import {
  CrossedCandlestickSwordsIcon,
  BoltIcon,
  StarIcon,
  ArrowRightIcon,
  LockIcon,
  RefreshIcon,
  CrosshairIcon,
  WhaleIcon,
  ShieldIcon,
  TrendUpIcon,
  VolumeBarsIcon,
  HourglassIcon,
  AlertTriangleIcon,
  CheckmarkIcon,
} from "../components/icons";
import { playTapSound, playSwordClashSound } from "../utils/audio";
import { SkillAsset, SKILL_COLORS, skillGroup } from "../lib/repoAssets";
import {
  canSeal,
  type DecisionDraft,
  type SealedDecision,
  type Decision,
  scoreProcess,
} from "../lib/flowState";

/* Соответствие chart-treatment варианта и отрисовки графика */
export function chartStyleOf(t: ChartTreatment): ChartStyle {
  if (t === "candles") return "candles";
  if (t === "area") return "area";
  if (t === "minimal") return "minimal";
  return "volume"; // line-glow → свечи с объёмом
}

/* ---------- Общая тактильная CTA ---------- */
function Cta({
  label,
  onClick,
  tone = "teal",
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  tone?: "teal" | "green" | "red" | "ghost";
  disabled?: boolean;
}) {
  const styles: Record<string, string> = {
    teal: "c2d-teal",
    green: "c2d-green",
    red: "c2d-red",
    ghost: "c2d-slate",
  };
  return (
    <button
      data-qa="primary-cta"
      onClick={() => {
        if (disabled) return;
        playTapSound();
        onClick?.();
      }}
      disabled={disabled}
      className={`c2d-btn min-h-12 w-full px-4 py-3 text-[13px] tracking-[0.06em] uppercase flex items-center justify-center gap-2 ${styles[tone]}`}
    >
      {label}
      <ArrowRightIcon size={15} />
    </button>
  );
}

function ProgressDots({ i, n }: { i: number; n: number }) {
  return (
      <div className="flex items-center gap-1.5">
        <span className="rounded-full border border-[#2EE6C8]/40 bg-[#0C1A22] px-2 py-0.5 font-mono text-[10px] font-black text-[#2EE6C8]">
          {i}/{n}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: n }).map((_, k) => (
            <span
              key={k}
              className="h-[6px] w-5 rounded-full"
              style={{
                background: k < i ? "#2EE6C8" : "#24344A",
                boxShadow: k < i
                  ? "0 0 8px rgba(46,230,200,.6), inset 0 1px 0 rgba(255,255,255,.45)"
                  : "inset 0 1px 2px rgba(0,0,0,.5)",
              }}
            />
          ))}
        </div>
      </div>
  );
}

/* ================= P01 · SPLASH ================= */
export function SplashScreen({ page, onNext }: { page: Page; onNext: () => void }) {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 gap-5 relative">
      {/* живые искры */}
      {[12, 30, 55, 74, 88].map((left, i) => (
        <span
          key={left}
          className="ember"
          style={{ left: `${left}%`, animationDuration: `${4 + i}s`, animationDelay: `${i * 0.7}s` }}
        />
      ))}

      <div className="pop-in w-24 h-24 rounded-[28px] bg-gradient-to-br from-[#1B3A47] to-[#0E1B29] border border-[#2EE6C8]/40 shadow-[0_0_40px_rgba(46,230,200,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center">
        <CrossedCandlestickSwordsIcon size={56} />
      </div>

      <div className="text-center">
        <p className="font-mono text-[10px] font-black tracking-[0.3em] text-[#2EE6C8] uppercase">
          Telegram Mini App
        </p>
        <h1 className="font-display font-black text-[30px] leading-tight text-white mt-1.5">
          SIGNAL<br />ARENA
        </h1>
        <p className="text-[12.5px] font-semibold text-[#8FA2BA] mt-2 max-w-[240px]">
          {page.copy.body}
        </p>
      </div>

      <div className="w-full max-w-[280px] flex flex-col gap-3">
        <Cta label={page.copy.cta} onClick={onNext} />
        <div className="flex items-center justify-center gap-1.5 text-[#F5BE38]">
          <BoltIcon size={14} />
          <BoltIcon size={14} />
          <BoltIcon size={14} />
          <span className="text-[10.5px] font-bold text-[#8FA2BA] ml-1">
            {page.copy.hint}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ================= TUTORIAL / LESSON ================= */
const TUTORIAL_ICONS = [CrosshairIcon, VolumeBarsIcon, ShieldIcon, HourglassIcon];

export function TutorialScreen({
  page,
  v,
  onNext,
}: {
  page: Page;
  v: Variant;
  onNext: () => void;
}) {
  const prog = page.copy.progress ?? [1, 4];
  const Icon = TUTORIAL_ICONS[(prog[0] - 1) % TUTORIAL_ICONS.length];
  const cardId = /^c\d+$/i.test(v.assetId) ? Number(v.assetId.slice(1)) : 0;

  return (
    <div data-qa="game-content" className={`tutorial-layout flex-1 min-h-0 flex flex-col ${v.motion}`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9.5px] font-black tracking-[0.2em] text-[#2EE6C8] uppercase">
          {page.copy.eyebrow}
        </span>
        <ProgressDots i={prog[0]} n={prog[1]} />
      </div>

      <h2 className="font-display font-extrabold text-[19px] leading-tight text-white">
        {page.copy.title}
      </h2>

      {/* Главный визуал урока */}
      <div className="tutorial-visual c2d-panel relative overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: `radial-gradient(70% 60% at 50% 45%, ${v.tint}22, transparent 70%)` }}
        />
        <div className="pop-in bob w-24 h-24 rounded-[26px] border-[3px] flex items-center justify-center"
          style={{
            borderColor: "rgba(255,255,255,.55)",
            color: "#fff",
            background: `radial-gradient(110% 90% at 50% 0%, ${v.tint} 0%, ${v.tint} 48%, rgba(0,0,0,.4) 100%)`,
            boxShadow: `inset 0 3px 0 rgba(255,255,255,.35), inset 0 -5px 0 rgba(0,0,0,.3), 0 8px 0 rgba(0,0,0,.4), 0 16px 26px -12px ${v.tint}`,
          }}
        >
          {cardId ? <SkillAsset id={cardId} className="h-14 w-14" /> : <Icon size={38} />}
        </div>
      </div>

      <p className="text-[12.5px] font-semibold leading-relaxed text-[#A9BED4]">
        {page.copy.body}
      </p>

      <Cta label={page.copy.cta} onClick={onNext} />
    </div>
  );
}

/* ================= CHART / DECISION / WAITING / REVEAL / CONFIRM ================= */
export function ScenarioScreen({
  page,
  v,
  onNext,
  scenarioPair = "BTC/USDT",
  draft,
  onDraftChange,
  sealed,
  onSeal,
}: {
  page: Page;
  v: Variant;
  onNext: () => void;
  scenarioPair?: string;
  draft: DecisionDraft;
  onDraftChange: (next: DecisionDraft) => void;
  sealed: SealedDecision | null;
  onSeal: () => void;
}) {
  const style = chartStyleOf(v.chart);
  const isReveal = page.kind === "reveal";
  const isDecision = page.kind === "decision";
  const isWaiting = page.kind === "waiting";
  const isConfirm = page.kind === "confirm";
  const [skill, setSkill] = useState(18);

  return (
    <div data-qa="game-content" className={`scenario-layout flex-1 min-h-0 flex flex-col ${v.motion}`}>
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-[9.5px] font-black tracking-[0.18em] text-[#2EE6C8] uppercase">
          {page.copy.eyebrow}
        </span>
        {isReveal && (
          <span className="font-mono text-[9px] font-black px-2 py-0.5 rounded-full bg-[#2EE6C8] text-[#062B25]">
            REVEAL · {v.reveal.toUpperCase()}
          </span>
        )}
        {isWaiting && (
          <span className="flex items-center gap-1 font-mono text-[9px] font-black px-2 py-0.5 rounded-full bg-[#F5BE38]/20 text-[#F5C75D] border border-[#F5BE38]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5BE38] animate-pulse" /> LIVE
          </span>
        )}
      </div>

      <h2 className="font-display font-extrabold text-[17px] leading-tight text-white px-1">
        {page.copy.title}
      </h2>

      <TerminalWindow
        currentTab="chart"
        chartStyle={style}
        tint={v.tint}
        showReveal={isReveal}
        scenarioTitle={scenarioPair}
        className={isDecision ? "scenario-terminal-decision" : "flex-1 min-h-0"}
      />

      {isDecision && (
        <div className="c2d-panel-sunken flex items-center justify-between px-2.5 py-1.5 font-mono text-[8px] text-[#8FA2BA]">
          <span className="font-black tracking-[0.14em] text-[#2EE6C8]">ФАКТЫ ДО РЕШЕНИЯ</span>
          <span className="font-black text-white">15M · объём падает · ATR высокий</span>
        </div>
      )}

      {isDecision && (
        <div className="scenario-skill-row grid grid-cols-4 gap-2">
          {[1, 18, 25, 34].map((id) => {
            const color = SKILL_COLORS[skillGroup(id)];
            const active = skill === id;
            return (
              <button
                key={id}
                onClick={() => { playTapSound(); setSkill(id); }}
                className={`c2d-skill h-full min-h-0 flex flex-col items-center justify-center gap-0.5 ${active ? "c2d-skill-on" : ""}`}
                style={{
                  background: active
                    ? `radial-gradient(110% 90% at 50% 0%, ${color} 0%, ${color} 52%, rgba(0,0,0,.34) 100%)`
                    : "linear-gradient(180deg, #24344A 0%, #16212F 100%)",
                  borderColor: active ? "rgba(255,255,255,.62)" : "#33496A",
                }}
              >
                <SkillAsset id={id} className="h-7 w-7" />
                <span className="font-mono text-[7px] font-black text-white/80">c{String(id).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>
      )}

      {isDecision && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="mb-1 font-mono text-[7.5px] font-black tracking-widest text-[#6E87A5] uppercase">Обоснование</p>
            <div className="grid grid-cols-2 gap-1">
              {["Нет объёма", "Уровень удержан"].map((thesis) => (
                <button
                  key={thesis}
                  onClick={() => onDraftChange({ ...draft, thesis })}
                  className={`c2d-chip min-h-11 px-1 text-[8px] ${draft.thesis === thesis ? "c2d-chip-on" : ""}`}
                >
                  {thesis}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 font-mono text-[7.5px] font-black tracking-widest text-[#6E87A5] uppercase">Инвалидация</p>
            <div className="grid grid-cols-2 gap-1">
              {["Закрепление выше", "Рост объёма"].map((invalidation) => (
                <button
                  key={invalidation}
                  onClick={() => onDraftChange({ ...draft, invalidation })}
                  className={`c2d-chip min-h-11 px-1 text-[8px] ${draft.invalidation === invalidation ? "c2d-chip-on-amber" : ""}`}
                >
                  {invalidation}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {page.copy.meta && (
        <div className="grid grid-cols-2 gap-2">
          {page.copy.meta.map(([k, val]) => (
            <div key={k} className="c2d-panel-sunken px-2.5 py-1.5">
              <p className="text-[8.5px] font-black tracking-widest text-[#6E8BAC] uppercase">{k}</p>
              <p className="font-mono font-black text-[12.5px] text-white">{val}</p>
            </div>
          ))}
        </div>
      )}

      {page.copy.body && (
        <p className="text-[12px] font-semibold leading-snug text-[#A9BED4] px-1">
          {page.copy.body}
        </p>
      )}

      <div className="scenario-decision-zone shrink-0">
        {isDecision ? (
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              {([
                ["LONG", "Войти в лонг", "c2d-green", TrendUpIcon],
                ["SHORT", "Войти в шорт", "c2d-red", AlertTriangleIcon],
                ["WAIT", "Ждать ретест", "c2d-amber", HourglassIcon],
                ["NO_TRADE", "Нет сделки", "c2d-slate", ShieldIcon],
              ] as const).map(([id, label, tone, Icon]) => {
                const on = draft.decision === id;
                return (
                  <button
                    key={id}
                    onClick={() => { playTapSound(); onDraftChange({ ...draft, decision: id as Decision }); }}
                    className={`c2d-btn ${tone} min-h-[50px] flex items-center gap-2 px-2.5 py-2 text-left ${on ? "" : "opacity-[0.62] saturate-[0.72]"}`}
                    style={on ? { outline: "3px solid rgba(255,255,255,.9)", outlineOffset: "-2px" } : undefined}
                  >
                    <span className="c2d-medallion h-8 w-8 shrink-0">
                      <Icon size={17} />
                    </span>
                    <span className="font-display text-[11px] leading-tight">{label}</span>
                  </button>
                );
              })}
            </div>
            <Cta
              label={page.copy.cta}
              disabled={!canSeal(draft)}
              onClick={() => {
                playSwordClashSound();
                onNext();
              }}
            />
          </div>
        ) : isConfirm ? (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-[#263A52] bg-[#101A28] p-2 text-center">
              <div><p className="text-[7px] text-[#607996]">Решение</p><p className="text-[9px] font-black text-white">{draft.decision ?? "—"}</p></div>
              <div><p className="text-[7px] text-[#607996]">Тезис</p><p className="truncate text-[8px] font-black text-white">{draft.thesis ?? "—"}</p></div>
              <div><p className="text-[7px] text-[#607996]">Инвалидация</p><p className="truncate text-[8px] font-black text-white">{draft.invalidation ?? "—"}</p></div>
            </div>
            <Cta
              label={page.copy.cta}
              tone="red"
              disabled={!canSeal(draft)}
              onClick={() => { onSeal(); onNext(); }}
            />
          </div>
        ) : (
          <Cta label={page.copy.cta} onClick={onNext} tone={isReveal ? "teal" : "green"} />
        )}
        {page.copy.hint && (
          <p className="text-center text-[10px] font-bold text-[#67809C] mt-1.5">
            {page.copy.hint}
          </p>
        )}
      </div>
      {isWaiting && sealed && (
        <div className="shrink-0 rounded-xl border border-[#2EE6C8]/30 bg-[#2EE6C8]/8 px-3 py-2 font-mono text-[9px] text-[#A9BED4]">
          SEALED: {sealed.decision} · {sealed.thesis} · invalidation: {sealed.invalidation}
        </div>
      )}
    </div>
  );
}

/* ================= SCORE ================= */
export function ScoreScreen({
  page,
  v,
  onNext,
  sealed,
  topicKnown = true,
}: {
  page: Page;
  v: Variant;
  onNext: () => void;
  sealed: SealedDecision | null;
  topicKnown?: boolean;
}) {
  const process = scoreProcess(sealed, topicKnown);
  return (
    <div className={`score-layout flex-1 min-h-0 relative ${v.motion}`}>
      {[20, 45, 70, 90].map((left, i) => (
        <span key={left} className="ember" style={{ left: `${left}%`, animationDuration: `${3.5 + i}s`, animationDelay: `${i * 0.5}s` }} />
      ))}

      <div className="text-center pt-2">
        <p className="font-mono text-[9.5px] font-black tracking-[0.22em] text-[#2EE6C8] uppercase">
          {page.copy.eyebrow}
        </p>
        <h2 className="font-display font-black text-[22px] text-white mt-1.5 leading-tight">
          {page.copy.title}
        </h2>
      </div>

      {/* Звёзды */}
      <div className="flex items-end gap-2">
        <div className="pop-in" style={{ animationDelay: "0.05s" }}>
          <StarIcon size={34} />
        </div>
        <div className="pop-in -translate-y-2" style={{ animationDelay: "0.18s" }}>
          <StarIcon size={48} />
        </div>
        <div className="pop-in" style={{ animationDelay: "0.3s" }}>
          <StarIcon size={34} />
        </div>
      </div>

      <p className="text-[12.5px] font-semibold text-center leading-relaxed text-[#A9BED4]">
        {process?.noPenalty
          ? "Эта тема ещё не изучена. Раунд разобран без штрафа к рейтингу."
          : page.copy.body}
      </p>

      {page.copy.meta && (
        <div className="w-full grid grid-cols-3 gap-2">
          {page.copy.meta.map(([k, val]) => (
            <div key={k} className="c2d-panel-sunken px-2 py-2 text-center">
              <p className="text-[8px] font-black tracking-widest text-[#6E8BAC] uppercase">{k}</p>
              <p className="font-mono font-black text-[13.5px]" style={{ color: v.tint }}>{val}</p>
            </div>
          ))}
        </div>
      )}

      {sealed && (
        <div className="w-full rounded-xl border border-[#263A52] bg-[#101A28] px-3 py-2 text-[9px] text-[#8FA2BA]">
          <div className="flex justify-between"><span>Тезис сформулирован</span><b className="text-[#50C890]">25</b></div>
          <div className="flex justify-between"><span>Инвалидация задана</span><b className="text-[#50C890]">25</b></div>
          <div className="flex justify-between"><span>Решение: {sealed.decision}</span><b className="text-[#F5C75D]">{process?.total ?? "без штрафа"}</b></div>
        </div>
      )}

      <div className="w-full flex flex-col gap-2">
        <Cta label={page.copy.cta} onClick={onNext} />
      </div>
    </div>
  );
}

export function PrerequisiteScreen({ onReturn }: { onReturn: () => void }) {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center gap-4">
      <LockIcon size={42} className="text-[#F5BE38]" />
      <div>
        <p className="font-mono text-[9px] font-black tracking-[0.2em] text-[#F5BE38]">FLOW_GUARD</p>
        <h2 className="mt-1 font-display text-[17px] font-extrabold text-white">Сначала зафиксируй решение</h2>
        <p className="mt-2 text-[11.5px] leading-relaxed text-[#8FA2BA]">
          Reveal, Score и Debrief недоступны до обязательных решения, обоснования, инвалидации и Seal.
        </p>
      </div>
      <div className="w-full"><Cta label="Вернуться к решению" onClick={onReturn} tone="ghost" /></div>
    </div>
  );
}

export function AssetLoadingState() {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center gap-4">
      <div className="h-12 w-12 rounded-full border-2 border-[#2EE6C8] border-t-transparent animate-spin" />
      <div>
        <p className="font-mono text-[9px] font-black tracking-[0.2em] text-[#2EE6C8]">LOADING_ASSETS</p>
        <h2 className="mt-1 font-display text-[16px] font-extrabold text-white">Загрузка интерфейса</h2>
        <p className="mt-2 text-[11px] leading-relaxed text-[#8FA2BA]">
          Распаковываются topbar.zip и skill-card-icons.zip. Игровой flow заблокирован до завершения.
        </p>
      </div>
    </div>
  );
}

/* ================= BREAKDOWN ================= */
export function BreakdownScreen({
  page,
  v,
  onNext,
}: {
  page: Page;
  v: Variant;
  onNext: () => void;
}) {
  return (
    <div className={`flex-1 min-h-0 flex flex-col px-4 py-2.5 gap-2.5 ${v.motion}`}>
      <span className="font-mono text-[9.5px] font-black tracking-[0.2em] text-[#F5C75D] uppercase">
        {page.copy.eyebrow}
      </span>
      <h2 className="font-display font-extrabold text-[18px] leading-tight text-white">
        {page.copy.title}
      </h2>

      <TerminalWindow currentTab="chart" chartStyle={chartStyleOf(v.chart)} tint={v.tint} showReveal />

      <div className="flex-1 min-h-0 c2d-panel p-3 space-y-2 custom-scroll">
        <p className="text-[12.5px] font-semibold leading-relaxed text-[#C5D6E8]">
          {page.copy.body}
        </p>
        {page.copy.meta?.map(([k, val]) => (
          <div key={k} className="flex items-start gap-2 text-[11.5px]">
            <span className="mt-0.5 text-[#2EE6C8]"><CheckmarkIcon size={13} /></span>
            <span className="text-[#8FA2BA]">
              <b className="text-white">{k}:</b> {val}
            </span>
          </div>
        ))}
      </div>

      <Cta label={page.copy.cta} onClick={onNext} tone="green" />
    </div>
  );
}

/* ================= ARENA LOBBY ================= */
const LOBBY = [
  { pair: "BTC/USDT", desc: "2021-04 · ложный пробой ATH", tag: "НОВЫЙ", col: "#2EE6C8", Icon: TrendUpIcon },
  { pair: "SOL/USDT", desc: "2021-05 · первый импульс", tag: "НОВЫЙ", col: "#F5BE38", Icon: VolumeBarsIcon },
  { pair: "ETH/USDT", desc: "2021-09 · сжатие диапазона", tag: "СКОРО", col: "#6E8199", Icon: WhaleIcon },
];

export function LobbyScreen({ page, onNext }: { page: Page; onNext: () => void }) {
  return (
    <div className="flex-1 min-h-0 flex flex-col px-4 py-2.5 gap-2.5">
      <span className="font-mono text-[9.5px] font-black tracking-[0.2em] text-[#2EE6C8] uppercase">
        {page.copy.eyebrow}
      </span>
      <h2 className="font-display font-extrabold text-[19px] text-white">{page.copy.title}</h2>
      <p className="text-[11px] font-bold text-[#67809C] -mt-1">{page.copy.hint}</p>

      <div className="flex-1 min-h-0 space-y-2 custom-scroll">
        {LOBBY.map((s) => (
          <button
            key={s.pair}
            onClick={() => {
              playTapSound();
              onNext();
            }}
            className="c2d-panel tactile-btn w-full p-2.5 flex items-center gap-3 text-left"
          >
            <div
              className="c2d-medallion h-11 w-11 shrink-0"
              style={{ background: `radial-gradient(110% 90% at 50% 0%, ${s.col} 0%, ${s.col} 55%, rgba(0,0,0,.4) 100%)` }}
            >
              <s.Icon size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-extrabold text-[13.5px] text-white">{s.pair}</p>
              <p className="text-[10px] font-semibold text-[#67809C] truncate">{s.desc}</p>
            </div>
            <span
              className="shrink-0 px-2 py-0.5 rounded-md text-[8.5px] font-black"
              style={{ background: `${s.col}1f`, color: s.col, border: `1px solid ${s.col}44` }}
            >
              {s.tag}
            </span>
          </button>
        ))}
      </div>

      <Cta label={page.copy.cta} onClick={onNext} />
    </div>
  );
}

/* ================= EMPTY / ERROR STATE ================= */
export function StateScreen({
  page,
  onNext,
  technicalStatus,
}: {
  page: Page;
  onNext: () => void;
  technicalStatus?: string;
}) {
  const isError = page.id === "P34";
  const isLocked = page.state === "locked";

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 gap-4 text-center">
      <div
        className={`pop-in w-20 h-20 rounded-3xl border-2 flex items-center justify-center ${
          isError
            ? "border-[#D95D56] text-[#FF8F87] bg-[#D95D56]/10"
            : isLocked
              ? "border-[#6E8199] text-[#A9BED4] bg-[#6E8199]/10"
              : "border-[#F5BE38] text-[#F5C75D] bg-[#F5BE38]/10"
        }`}
      >
        {isError ? <RefreshIcon size={36} /> : isLocked ? <LockIcon size={36} /> : <BoltIcon size={36} />}
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-black tracking-[0.22em] text-[#67809C] uppercase">
          {page.copy.eyebrow}
        </p>
        <h2 className="font-display font-extrabold text-[19px] text-white mt-1.5 leading-tight">
          {page.copy.title}
        </h2>
        <p className="text-[12.5px] font-semibold text-[#8FA2BA] mt-2 leading-relaxed">
          {page.copy.body}
        </p>
        {isError && technicalStatus && (
          <p className="mt-2 rounded-lg border border-[#C56861]/35 bg-[#C56861]/10 px-2 py-1.5 font-mono text-[8.5px] text-[#FFAAA3]">
            {technicalStatus}
          </p>
        )}
      </div>

      {page.copy.note && (
        <p className="text-[10px] font-semibold italic text-[#56708C] max-w-[240px]">
          {page.copy.note}
        </p>
      )}

      <div className="w-full max-w-[280px]">
        <Cta label={page.copy.cta} onClick={onNext} tone={isError ? "red" : "teal"} />
      </div>
    </div>
  );
}

/* ================= CARD DETAIL ================= */
const CARD_COLORS: Record<string, string> = {
  green: "#2E7F5C",
  yellow: "#D0B24A",
  blue: "#4C6180",
  red: "#C56861",
};

export function CardDetailScreen({
  page,
  v,
  onNext,
}: {
  page: Page;
  v: Variant;
  onNext: () => void;
}) {
  const n = Number(v.assetId.replace(/^c/i, ""));
  const group = n <= 15 ? "green" : n <= 24 ? "yellow" : n <= 33 ? "blue" : "red";
  const col = CARD_COLORS[group];
  const locked = page.state === "locked";

  return (
    <div className={`flex-1 min-h-0 flex flex-col items-center justify-between px-5 py-3 gap-3 ${v.motion}`}>
      <span className="font-mono text-[9.5px] font-black tracking-[0.2em] uppercase" style={{ color: col }}>
        {page.copy.eyebrow}
      </span>

      {/* Карточка навыка */}
      <div
        className="pop-in relative w-[168px] aspect-[3/4] rounded-[26px] flex flex-col items-center justify-center gap-3 overflow-hidden"
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, ${col} 0%, ${col} 55%, rgba(0,0,0,0.35) 100%)`,
          boxShadow: `0 18px 40px -16px ${col}, inset 0 1px 0 rgba(255,255,255,0.25)`,
          opacity: locked ? 0.5 : 1,
          filter: locked ? "grayscale(0.6)" : "none",
        }}
      >
        <div className="absolute inset-[8px] rounded-[20px] border border-white/25" />
        <div className="w-[88px] h-[88px] rounded-full bg-black/25 border border-white/30 flex items-center justify-center text-white shadow-inner">
          {locked ? <LockIcon size={40} /> : <SkillAsset id={n} className="h-[68px] w-[68px]" />}
        </div>
        <span className="font-mono text-[11px] font-black tracking-[0.2em] text-white/90">
          {v.assetId.toUpperCase()}
        </span>
      </div>

      <div className="text-center">
        <h2 className="font-display font-extrabold text-[18px] text-white">{page.copy.title}</h2>
        <p className="text-[12px] font-semibold text-[#A9BED4] mt-1.5 leading-relaxed max-w-[260px]">
          {page.copy.body}
        </p>
        {page.copy.hint && (
          <p className="text-[9.5px] font-bold text-[#67809C] mt-1.5">{page.copy.hint}</p>
        )}
      </div>

      <div className="w-full">
        <Cta label={page.copy.cta} onClick={onNext} tone={locked ? "ghost" : "teal"} />
      </div>
    </div>
  );
}
