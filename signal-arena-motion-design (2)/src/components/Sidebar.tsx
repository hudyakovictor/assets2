import { IconCheck, IconGauge, IconInfo, IconList, IconRotate, IconSliders, IconSmiley, IconTarget } from "./Icons";
import { DEVICES } from "../game/engine";
import type { GameState, Params } from "../game/engine";
import { PRESETS } from "../game/engine";
import { PAGE_INVENTORY, type PageId } from "./FlowScreens";

const GROUP_LABEL: Record<string, string> = {
  "first-run": "ПЕРВЫЙ ЗАПУСК",
  arena: "АРЕНА",
  academy: "АКАДЕМИЯ",
  profile: "ПРОФИЛЬ",
  service: "СОСТОЯНИЯ",
};

interface Props {
  screen: PageId;
  forced: PageId | null;
  visited: PageId[];
  onJump: (p: PageId) => void;
  onForce: (p: PageId | null) => void;
  attempts: number;
  attemptsMax: number;
  setAttempts: (n: number) => void;
  stars: number;
  coins: number;
  casesDone: number;
  reduced: boolean;
  sound: boolean;
  haptics: boolean;
  toggle: (k: "sound" | "haptics" | "reduced") => void;
  device: string;
  setDevice: (id: string) => void;
  scale: number;
  setScale: (v: number) => void;
  fit: boolean;
  setFit: (v: boolean) => void;
  landscape: boolean;
  setLandscape: (v: boolean) => void;
  sandbox: boolean;
  setSandbox: (v: boolean) => void;
  params: Params;
  setParams: (p: Partial<Params>) => void;
  preset: string;
  applyPreset: (k: string) => void;
  paused: boolean;
  togglePause: () => void;
  restart: () => void;
  sim: GameState;
  resetProgress: () => void;
}

export default function Sidebar(p: Props) {
  return (
    <aside className="scroll-thin flex h-full w-full flex-col gap-3 overflow-y-auto pr-1">
      <header className="flex items-center gap-3">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border"
          style={{ borderColor: "var(--accent-line)", color: "var(--accent)", background: "var(--accent-soft)" }}
        >
          <IconSliders className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[16px] font-bold tracking-[0.1em] text-white">АУДИТ СООТВЕТСТВИЯ MVP</h1>
          <p className="font-mono text-[10px] tracking-widest text-mist-500">
            ЭКРАН {p.screen} · ПОСЕЩЕНО {p.visited.length}/34
          </p>
        </div>
      </header>

      {/* карта экранов */}
      <Section title="PAGE INVENTORY P01–P34" icon={<IconList className="h-3.5 w-3.5" />}>
        {["first-run", "arena", "academy", "profile", "service"].map((g) => (
          <div key={g} className="mb-2 last:mb-0">
            <p className="mb-1 font-mono text-[9px] tracking-widest text-mist-500">{GROUP_LABEL[g]}</p>
            <div className="space-y-1">
              {PAGE_INVENTORY.filter((r) => r.group === g).map((r) => {
                const on = p.screen === r.id;
                const seen = p.visited.includes(r.id);
                return (
                  <button
                    key={r.id}
                    onPointerDown={() => p.onJump(r.id)}
                    className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-transform duration-75 active:scale-[0.98]"
                    style={{ background: on ? "var(--accent-soft)" : "rgba(0,0,0,.25)" }}
                  >
                    <span className="w-7 shrink-0 font-mono text-[9.5px] font-bold" style={{ color: on ? "var(--accent)" : "#6a7ea3" }}>
                      {r.id}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[10.5px] font-bold text-white">{r.title}</span>
                      <span className="block truncate font-mono text-[8.5px] text-mist-500">
                        {r.states} · CTA: {r.cta}
                      </span>
                    </span>
                    <span className="shrink-0" style={{ color: seen ? "#3ecf8e" : "#2b3f63" }}>
                      <IconCheck className="h-3 w-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </Section>

      {/* инжектор состояний */}
      <Section title="ИНЖЕКТОР СОСТОЯНИЙ" icon={<IconInfo className="h-3.5 w-3.5" />}>
        <div className="grid grid-cols-2 gap-1.5">
          {(["P29", "P30", "P31", "P32", "P33"] as PageId[]).map((id) => (
            <button
              key={id}
              onPointerDown={() => p.onForce(id)}
              className="rounded-xl py-2 text-[10px] font-bold tracking-wider transition-transform duration-75 active:scale-95"
              style={{
                background: p.forced === id ? "var(--accent)" : "rgba(0,0,0,.3)",
                color: p.forced === id ? "#071018" : "#8da0c0",
                border: "1px solid rgba(255,255,255,.08)",
              }}
            >
              {PAGE_INVENTORY.find((r) => r.id === id)?.title.replace("Состояние: ", "") ?? id}
            </button>
          ))}
          <button
            onPointerDown={() => p.onForce(null)}
            className="rounded-xl py-2 text-[10px] font-bold tracking-wider text-mist-400 transition-transform duration-75 active:scale-95"
            style={{ background: "rgba(0,0,0,.3)", border: "1px solid rgba(255,255,255,.08)" }}
          >
            СБРОСИТЬ
          </button>
        </div>
        <p className="mt-2 font-mono text-[9.5px] leading-snug text-mist-500">
          Каждое состояние содержит причину, следующее действие и CTA — тупика нет.
        </p>
      </Section>

      {/* прогресс / сопр. данные */}
      <Section title="ДАННЫЕ ВЕРХНЕЙ ПАНЕЛИ" icon={<IconTarget className="h-3.5 w-3.5" />}>
        <div className="grid grid-cols-3 gap-1.5">
          <Readout label="ПОПЫТКИ" value={`${p.attempts}/${p.attemptsMax}`} />
          <Readout label="ЗВЁЗДЫ" value={String(p.stars)} />
          <Readout label="МОНЕТЫ" value={String(p.coins)} />
        </div>
        <div className="mt-2">
          <input
            type="range"
            min={0}
            max={p.attemptsMax}
            step={1}
            value={p.attempts}
            onChange={(e) => p.setAttempts(parseInt(e.target.value, 10))}
            style={{ ["--fill" as string]: `${(p.attempts / p.attemptsMax) * 100}%` }}
            aria-label="Попытки"
          />
        </div>
        <p className="font-mono text-[9.5px] text-mist-500">
          Кейсов закрыто: {p.casesDone}/4. Значения — реальный прогресс, не подставные.
        </p>
        <button
          onPointerDown={p.resetProgress}
          className="mt-2 w-full rounded-xl py-2 text-[10px] font-bold tracking-wider text-mist-400 transition-transform duration-75 active:scale-95"
          style={{ background: "rgba(0,0,0,.3)", border: "1px solid rgba(255,255,255,.08)" }}
        >
          СБРОСИТЬ ПРОГРЕСС
        </button>
      </Section>

      {/* viewport QA */}
      <Section title="QA VIEWPORT" icon={<IconGauge className="h-3.5 w-3.5" />}>
        <div className="grid grid-cols-3 gap-1.5">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              onPointerDown={() => p.setDevice(d.id)}
              className="rounded-xl py-2 text-[10px] font-bold transition-transform duration-75 active:scale-90"
              style={{
                background: p.device === d.id ? "var(--accent)" : "rgba(0,0,0,.3)",
                color: p.device === d.id ? "#071018" : "#8da0c0",
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
        <Slider label="МАСШТАБ" unit="%" value={p.scale * 100} min={40} max={110} step={1} onChange={(v) => p.setScale(v / 100)} />
        <div className="grid grid-cols-3 gap-1.5">
          <Chip on={p.fit} label="ВПИСАТЬ" onPress={() => p.setFit(true)} />
          <Chip on={!p.fit} label="1:1" onPress={() => p.setFit(false)} />
          <Chip on={p.landscape} label="ПОВОРОТ" onPress={() => p.setLandscape(!p.landscape)} />
        </div>
        <p className="mt-2 flex items-start gap-1.5 font-mono text-[9.5px] leading-snug text-mist-500">
          <IconRotate className="mt-0.5 h-3 w-3 shrink-0" />
          Экран — логическая сетка телефона (360×780 / 390×844 / 412×915), масштабируется целиком.
        </p>
      </Section>

      {/* отклик */}
      <Section title="ОТКЛИК И ДОСТУПНОСТЬ" icon={<IconSliders className="h-3.5 w-3.5" />}>
        <Toggle label="ЗВУК" on={p.sound} onChange={() => p.toggle("sound")} />
        <Toggle label="ВИБРАЦИЯ" on={p.haptics} onChange={() => p.toggle("haptics")} />
        <Toggle label="МЕНЬШЕ ДВИЖЕНИЯ" on={p.reduced} onChange={() => p.toggle("reduced")} />
      </Section>

      {/* сандбокс */}
      <Section title="САНДБОКС (ВНЕ MVP)" icon={<IconGauge className="h-3.5 w-3.5" />}>
        <Toggle label="СИМУЛЯТОР ЭКОНОМИКИ" on={p.sandbox} onChange={() => p.setSandbox(!p.sandbox)} />
        {p.sandbox && (
          <div className="mt-2 space-y-1">
            <div className="mb-2 grid grid-cols-3 gap-1.5">
              {Object.entries(PRESETS).map(([k, v]) => (
                <button
                  key={k}
                  onPointerDown={() => p.applyPreset(k)}
                  className="rounded-xl py-1.5 text-[9.5px] font-bold transition-transform duration-75 active:scale-90"
                  style={{
                    background: p.preset === k ? "var(--accent)" : "rgba(0,0,0,.3)",
                    color: p.preset === k ? "#071018" : "#8da0c0",
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <Slider label="СКОРОСТЬ" unit="×" value={p.params.speed} min={0.5} max={2.5} step={0.1} onChange={(v) => p.setParams({ speed: v })} />
            <Slider label="ТАП" unit="" value={p.params.tapYield} min={1} max={8} step={0.5} onChange={(v) => p.setParams({ tapYield: v })} />
            <Slider label="РАСХОД" unit="×" value={p.params.upkeep} min={0} max={2.5} step={0.1} onChange={(v) => p.setParams({ upkeep: v })} />
            <Slider label="СОБЫТИЯ" unit="×" value={p.params.eventRate} min={0} max={2.5} step={0.1} onChange={(v) => p.setParams({ eventRate: v })} />
            <Slider label="ЦИКЛ" unit="д" value={p.params.goalDays} min={10} max={60} step={5} onChange={(v) => p.setParams({ goalDays: v })} />
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <Chip on={!p.paused} label={p.paused ? "ПУСК" : "ПАУЗА"} onPress={p.togglePause} />
              <Chip on={false} label="ЗАНОВО" onPress={p.restart} />
            </div>
            <p className="font-mono text-[9.5px] text-mist-500">
              день {p.sim.day} · доверие {Math.floor(p.sim.trust)} · кр {Math.floor(p.sim.credits)}
            </p>
          </div>
        )}
      </Section>

      {/* журнал посещений */}
      <Section title="ДОКАЗАТЕЛЬСТВА ПРОХОДА" icon={<IconCheck className="h-3.5 w-3.5" />}>
        <div className="flex flex-wrap gap-1">
          {PAGE_INVENTORY.map((r) => (
            <span
              key={r.id}
              className="rounded-md px-1.5 py-0.5 font-mono text-[9px] font-bold"
              style={{
                background: p.visited.includes(r.id) ? "var(--accent-soft)" : "rgba(0,0,0,.3)",
                color: p.visited.includes(r.id) ? "var(--accent)" : "#4a5d80",
              }}
            >
              {r.id}
            </span>
          ))}
        </div>
        <p className="mt-2 font-mono text-[9.5px] text-mist-500">
          Последний экран: {p.visited[p.visited.length - 1] ?? "—"}
        </p>
      </Section>

      <div className="mt-1 flex items-start gap-2 pb-3 pl-1">
        <p className="font-hand text-[26px] leading-[1.05] text-mist-300" style={{ transform: "rotate(-3.2deg)", transformOrigin: "left center" }}>
          if you're here
          <br />
          just for money,
          <br />
          <span style={{ color: "var(--accent)" }}>you're early.</span>
          <br />
          and that's bad.
        </p>
        <span className="mt-5 shrink-0" style={{ color: "var(--accent)", transform: "rotate(8deg)", display: "inline-block" }}>
          <IconSmiley className="h-8 w-8" strokeWidth={1.6} />
        </span>
      </div>
    </aside>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl plate p-3">
      <div className="mb-2 flex items-center gap-2 text-mist-500">
        {icon}
        <h2 className="text-[9.5px] font-bold tracking-[0.16em]">{title}</h2>
        <span className="ml-auto h-px flex-1 bg-white/8" />
      </div>
      {children}
    </section>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/30 px-1 py-2 text-center">
      <div className="text-[8px] font-bold tracking-wider text-mist-500">{label}</div>
      <div className="font-mono text-[14px] font-bold leading-tight tabular-nums text-white">{value}</div>
    </div>
  );
}

function Chip({ on, label, onPress }: { on: boolean; label: string; onPress: () => void }) {
  return (
    <button
      onPointerDown={onPress}
      className="rounded-xl py-2 text-[9.5px] font-bold tracking-wider transition-transform duration-75 active:scale-95"
      style={{
        background: on ? "var(--accent-soft)" : "rgba(0,0,0,.3)",
        border: `1px solid ${on ? "var(--accent-line)" : "rgba(255,255,255,.08)"}`,
        color: on ? "var(--accent)" : "#8da0c0",
      }}
    >
      {label}
    </button>
  );
}

function Slider({ label, unit, value, min, max, step, onChange }: { label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[9.5px] font-bold tracking-wider text-mist-500">{label}</span>
        <span className="font-mono text-[11px] font-bold tabular-nums" style={{ color: "var(--accent)" }}>
          {value.toFixed(step < 1 ? 1 : 0)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ ["--fill" as string]: `${fill}%` }}
      />
    </div>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: () => void }) {
  return (
    <button onPointerDown={onChange} className="flex w-full items-center justify-between rounded-xl px-1 py-1.5 transition-transform duration-75 active:scale-[0.98]">
      <span className="text-[9.5px] font-bold tracking-wider text-mist-500">{label}</span>
      <span className="relative h-5 w-9 rounded-full transition-colors" style={{ background: on ? "var(--accent-soft)" : "rgba(0,0,0,.4)", border: `1px solid ${on ? "var(--accent)" : "rgba(255,255,255,.1)"}` }}>
        <span className="absolute top-[2px] h-[14px] w-[14px] rounded-full transition-all" style={{ left: on ? 18 : 3, background: on ? "var(--accent)" : "#6a7ea3" }} />
      </span>
    </button>
  );
}
