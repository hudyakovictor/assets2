/* ============================================================================
   FACT STAGE — заполняет «дыру» между заголовком и CTA.
   Каждый факт = одна мысль + один большой визуал + один CTA.
   Визуал занимает ВСЁ свободное место. Пустых flex-дыр нет.
   ============================================================================ */
import { useState } from "react";
import { Btn, Chip, Panel } from "./frame";
import { Icon } from "../icons/ui";
import type { GameCtx } from "./state";
import { SCENARIOS } from "./content";
import { sfx, haptic } from "./sfx";

export interface Fact {
  id: string;
  title: string;
  line: string;
  kind: "volume" | "level" | "news" | "risk";
}

export const ROUND_FACTS: Fact[] = [
  {
    id: "f1",
    title: "Пробой без объёма",
    line: "Объём на пробое ниже средних 20 баров на 38%.",
    kind: "volume",
  },
  {
    id: "f2",
    title: "Уровень не подтверждён",
    line: "Цена вышла за границу и сразу вернулась. Это не удержание.",
    kind: "level",
  },
  {
    id: "f3",
    title: "Новость уже в цене",
    line: "Заголовок настоящий. Вход на заголовке — нет.",
    kind: "news",
  },
];

/** Столбцы объёма: среднее + пробой ниже среднего. Заполняет весь слот. */
export function VolumeFactVisual({ dropPct = 38 }: { dropPct?: number }) {
  const avg = 52;
  const bars = [34, 41, 38, 55, 48, 62, 44, 50, 47, 58, 40, 53, 49, 61, 45, 52, 43, 56, 48, 32];
  const last = Math.round(avg * (1 - dropPct / 100));
  const data = [...bars.slice(0, 19), last];
  const max = Math.max(...data, avg) * 1.08;
  return (
    <div className="relative flex h-full min-h-[220px] w-full flex-col justify-end overflow-hidden px-3 pb-3 pt-8">
      <div className="absolute left-3 top-3 micro" style={{ color: "#9FE8D3" }}>ОБЪЁМ · 20 БАРОВ</div>
      <div className="absolute right-3 top-3 tabular" style={{ color: "#E98680", fontWeight: 800, fontSize: "var(--type-h3)" }}>−{dropPct}%</div>
      {/* average line */}
      <div className="absolute left-3 right-3" style={{ bottom: `${(avg / max) * 100}%`, height: 2, background: "transparent", borderTop: "2px dashed #46D3B1", opacity: 0.9 }} />
      <div className="absolute left-3 micro" style={{ bottom: `calc(${(avg / max) * 100}% + 4px)`, color: "#9FE8D3" }}>СРЕДНЕЕ</div>
      <div className="flex h-full items-end gap-[3px]">
        {data.map((v, i) => {
          const isLast = i === data.length - 1;
          const h = Math.max(8, (v / max) * 100);
          return (
            <div key={i} className="relative flex-1" style={{ height: `${h}%`, minHeight: 8 }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: "6px 6px 2px 2px",
                  background: isLast
                    ? "linear-gradient(180deg,#e98680,#c56861)"
                    : v > avg
                      ? "linear-gradient(180deg,#56d6b4,#1f8f78)"
                      : "linear-gradient(180deg,#4c6180,#2b3d5e)",
                  border: isLast ? "2px solid #fff" : "1.5px solid rgba(255,255,255,.2)",
                  boxShadow: isLast ? "0 0 16px rgba(197,104,97,.55)" : "inset 0 2px 0 rgba(255,255,255,.2)",
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="chip" style={{ background: "#C56861", color: "#fff", borderColor: "rgba(255,255,255,.5)" }}>ПРОБОЙ</span>
        <span className="body" style={{ fontSize: "var(--type-meta)", color: "#CFE4FF" }}>тишина на выходе · объём не подтвердил</span>
      </div>
    </div>
  );
}

export function LevelFactVisual() {
  return (
    <div className="relative flex h-full min-h-[220px] w-full flex-col justify-center overflow-hidden p-3">
      <svg viewBox="0 0 320 180" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <line x1="16" x2="304" y1="110" y2="110" stroke="#46D3B1" strokeWidth="2.4" strokeDasharray="10 8" />
        <text x="16" y="102" fill="#9FE8D3" fontSize="11" fontWeight="800" fontFamily="Nunito, sans-serif">УРОВЕНЬ</text>
        {([
          { x: 24, y: 130, w: 18, h: 40, up: true },
          { x: 52, y: 118, w: 18, h: 36, up: true },
          { x: 80, y: 108, w: 18, h: 42, up: true },
          { x: 108, y: 96, w: 18, h: 38, up: true },
          { x: 136, y: 78, w: 22, h: 52, up: true },
          { x: 168, y: 88, w: 18, h: 44, up: false },
          { x: 196, y: 104, w: 18, h: 36, up: false },
          { x: 224, y: 118, w: 18, h: 32, up: false },
          { x: 252, y: 126, w: 18, h: 28, up: false },
        ] as const).map((c, i) => (
          <g key={i}>
            <line x1={c.x + c.w / 2} x2={c.x + c.w / 2} y1={c.y - 10} y2={c.y + c.h + 10} stroke={c.up ? "#3ECF8E" : "#E2605C"} strokeWidth="2" />
            <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="4" fill={c.up ? "#3ECF8E" : "#E2605C"} />
            <rect x={c.x} y={c.y} width={c.w * 0.32} height={c.h} rx="3" fill="#fff" opacity=".28" />
          </g>
        ))}
        <circle cx="147" cy="78" r="16" fill="none" stroke="#46D3B1" strokeWidth="3" />
      </svg>
      <div className="mt-1 flex items-center gap-2">
        <span className="chip" style={{ background: "#4C6180", color: "#fff", borderColor: "rgba(255,255,255,.5)" }}>ВЫХОД</span>
        <span className="body" style={{ fontSize: "var(--type-meta)", color: "#CFE4FF" }}>вышли и вернулись · удержания нет</span>
      </div>
    </div>
  );
}

export function NewsFactVisual() {
  return (
    <div className="relative flex h-full min-h-[220px] w-full flex-col justify-center gap-2 overflow-hidden p-3">
      {[
        { tag: "ФУНДАМЕНТ", t: "СПОТОВЫЙ ETF ОДОБРЕН", tone: "#D0B24A" },
        { tag: "КИТ", t: "ПЕРВЫЙ ЧАС ПРИТОКА УЖЕ ЗАПИСАН", tone: "#7C6CD9" },
        { tag: "ШУМ", t: "«ПОЕЗД УШЁЛ». ПОЕЗД НЕ ОТПРАВЛЯЛСЯ", tone: "#2E7F5C" },
      ].map((r) => (
        <Panel key={r.t} inset className="flex items-center gap-2 p-2.5">
          <span style={{ width: 10, height: 36, borderRadius: 6, background: r.tone, flex: "none" }} />
          <span className="min-w-0 flex-1">
            <span className="micro" style={{ color: r.tone }}>{r.tag}</span>
            <span className="h3 block" style={{ textTransform: "none", fontSize: "var(--type-body)" }}>{r.t}</span>
          </span>
        </Panel>
      ))}
    </div>
  );
}

export function FactVisual({ kind }: { kind: Fact["kind"] }) {
  if (kind === "volume") return <VolumeFactVisual />;
  if (kind === "level") return <LevelFactVisual />;
  return <NewsFactVisual />;
}

/** Экран фактов раунда: заполняет дыру большим визуалом. Одна мысль, один CTA. */
export function FactsStage({ ctx }: { ctx: GameCtx }) {
  const [i, setI] = useState(0);
  const facts = ROUND_FACTS;
  const f = facts[i];
  const last = i === facts.length - 1;
  const s = SCENARIOS[ctx.st.scenarioIndex];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[var(--gap)]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <button type="button" className="chip" style={{ minHeight: 32 }} onClick={() => { if (i === 0) ctx.go("p10"); else setI(i - 1); }}>
              {i === 0 ? "ХАБ" : `ФАКТ ${i}`}
            </button>
            <div className="micro" style={{ color: "var(--accent)" }}>ФАКТ {i + 1} / {facts.length} · {s.pair}</div>
          </div>
          <div className="h1" style={{ fontSize: "calc(var(--type-h1) * 0.92)" }}>{f.title}</div>
          <p className="body mt-1" style={{ color: "#CFE4FF" }}>{f.line}</p>
        </div>
        <Chip tone="var(--accent)" solid>{i + 1}/{facts.length}</Chip>
      </div>

      <div className="flex items-center gap-1.5">
        {facts.map((x, n) => (
          <span key={x.id} style={{
            flex: n === i ? 1.6 : 1, height: 6, borderRadius: 99,
            background: n < i ? "var(--accent)" : n === i ? "#9FE8D3" : "var(--stroke)",
            transition: "all var(--t-med) var(--ease-out)",
          }} />
        ))}
      </div>

      {/* ЭТО место, которое было дырой: визуал растягивается на всё оставшееся */}
      <Panel className="relative min-h-0 flex-1 overflow-hidden" style={{ minHeight: 220 }}>
        <FactVisual kind={f.kind} />
      </Panel>

      <div style={{ minHeight: 64 }}>
        <Btn
          tone="primary"
          icon={<Icon name="chevron" size={18} />}
          onClick={() => {
            sfx.tick(); haptic("light");
            if (last) ctx.go("p13");
            else setI(i + 1);
          }}
          style={{ width: "100%", minHeight: 56 }}
        >
          {last ? "Дальше: график до t0. Будущее закрыто." : "Следующий факт"}
        </Btn>
      </div>
    </div>
  );
}
