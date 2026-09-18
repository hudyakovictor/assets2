import { useMemo, useState } from "react";
import { PAGES, SECTIONS, PAGE_COUNT_NOTE, type PageDef, type VariantTreatment } from "../data/pages";

/* ---------------- LEFT: PAGE INVENTORY ---------------- */
export function PageInventory({
  pageIndex,
  variantIndex,
  onSelectPage,
  onSelectVariant,
}: {
  pageIndex: number;
  variantIndex: number;
  onSelectPage: (i: number) => void;
  onSelectVariant: (i: number) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return PAGES.map((p, i) => ({ p, i })).filter(
      ({ p }) => !s || p.title.toLowerCase().includes(s) || p.id.toLowerCase().includes(s) || p.state.toLowerCase().includes(s),
    );
  }, [q]);
  const current = PAGES[pageIndex];

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--line)] p-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-black uppercase tracking-wide text-white">Page Inventory</span>
          <span className="rounded-full bg-[#0c1424] px-2 py-0.5 text-[10px] font-bold text-[var(--ink-dim)]">P01–P34</span>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск страницы…"
          className="mt-2.5 w-full rounded-xl border border-[var(--line)] bg-[#0c1424] px-3 py-2 text-[12px] text-white outline-none placeholder:text-[var(--ink-mute)] focus:border-[#35e0c855]"
        />
        <div className="mt-2 rounded-lg px-2 py-1.5 text-[9.5px] leading-snug text-[#D0A24A]" style={{ background: "rgba(208,162,74,0.1)", border: "1px solid rgba(208,162,74,0.3)" }}>
          <b>Page Count Mismatch · 31 → 34.</b> {PAGE_COUNT_NOTE}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto thin-scroll p-2">
        {SECTIONS.map((sec) => {
          const items = filtered.filter(({ p }) => p.section === sec);
          if (!items.length) return null;
          return (
            <div key={sec} className="mb-3">
              <div className="px-2 pb-1 text-[10px] font-black uppercase tracking-wider text-[var(--ink-mute)]">{sec}</div>
              <div className="space-y-1">
                {items.map(({ p, i }) => {
                  const on = i === pageIndex;
                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectPage(i)}
                      className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition"
                      style={{ background: on ? "#13233d" : "transparent", boxShadow: on ? "inset 0 0 0 1px #35e0c855" : "none" }}
                    >
                      <span className="grid h-8 w-9 shrink-0 place-items-center rounded-lg text-[10px] font-black" style={{ background: on ? "#35e0c8" : "#0c1424", color: on ? "#06231f" : "var(--ink-dim)" }}>{p.id}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] font-bold text-white">{p.title}</span>
                        <span className="block truncate text-[10px] text-[var(--ink-mute)]">{p.frame} · {p.state}</span>
                      </span>
                      <span className="rounded-md bg-[#0c1424] px-1.5 py-0.5 text-[9px] font-bold text-[var(--ink-dim)]">{p.variants.length}×</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Variant switch + prev/next */}
      <div className="border-t border-[var(--line)] p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wide text-[var(--ink-mute)]">Варианты</span>
          <span className="text-[10px] font-bold text-white">{current.variants[variantIndex]?.id}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {["A", "B", "C", "D"].map((L, i) => {
            const exists = i < current.variants.length;
            const on = i === variantIndex;
            return (
              <button
                key={L}
                disabled={!exists}
                onClick={() => onSelectVariant(i)}
                className="rounded-lg py-2 text-[12px] font-black transition disabled:opacity-25"
                style={{ background: on ? "#35e0c8" : "#0c1424", color: on ? "#06231f" : "var(--ink-dim)", border: "1px solid var(--line)" }}
              >
                {L}
              </button>
            );
          })}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <button onClick={() => onSelectPage(Math.max(0, pageIndex - 1))} className="rounded-lg border border-[var(--line)] bg-[#0c1424] py-2 text-[11px] font-bold text-[var(--ink-dim)]">‹ Prev</button>
          <button onClick={() => onSelectPage(Math.min(PAGES.length - 1, pageIndex + 1))} className="rounded-lg border border-[var(--line)] bg-[#0c1424] py-2 text-[11px] font-bold text-[var(--ink-dim)]">Next ›</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- RIGHT: ASSET INSPECTOR ---------------- */
export function AssetInspector({
  page,
  variant,
  onReset,
}: {
  page: PageDef;
  variant: VariantTreatment;
  onReset: () => void;
}) {
  const slot = slotForScreen(page.screen);
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--line)] p-3">
        <span className="text-[12px] font-black uppercase tracking-wide text-white">Asset Inspector</span>
        <div className="mt-1 text-[10px] text-[var(--ink-mute)]">{page.id} · {variant.id}</div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto thin-scroll p-3">
        {/* preview swatch */}
        <div className="overflow-hidden rounded-2xl border border-[var(--line)]">
          <div className="relative grid h-28 place-items-center" style={{ background: `linear-gradient(150deg, ${variant.accent}, #0d1524)` }}>
            <div className="grid-lines absolute inset-0 opacity-30" />
            <span className="relative rounded-full bg-black/30 px-3 py-1 text-[11px] font-black text-white">{variant.label}</span>
            <span className="absolute inset-0" style={{ background: `rgba(10,15,25,${variant.tint})` }} />
          </div>
        </div>

        <Field k="Asset ID" v={variant.id} mono />
        <Field k="Компоновка" v={variant.label} />
        <Field k="Layout Mode" v={variant.layoutMode} mono />
        <Field k="Source" v={page.source} />
        <Field k="Slot" v={slot} />
        <Field k="Purpose" v={purposeForScreen(page.screen)} />

        <div className="my-3 h-px bg-[var(--line)]" />

        <Field k="Crop" v={variant.crop} />
        <Field k="Fit" v={variant.fit} />
        <Slider k="Scale" v={variant.scale} min={1} max={1.2} />
        <Slider k="Opacity" v={variant.opacity} min={0.8} max={1} />
        <Slider k="Tint" v={variant.tint} min={0} max={0.3} />
        <Field k="Motion preset" v={variant.motion} />
        <Field k="Chart treatment" v={variant.chart} />
        <Field k="Reveal effect" v={variant.reveal} />
        <Field k="Fallback" v="solid accent + label" />
      </div>

      <div className="border-t border-[var(--line)] p-3">
        <button onClick={onReset} className="w-full rounded-xl border border-[#f0655f55] bg-[#f0655f18] py-2.5 text-[12px] font-black text-[#f0655f]">Reset Variant</button>
      </div>
    </div>
  );
}

function Field({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="mt-2.5 flex items-start justify-between gap-3">
      <span className="text-[11px] font-bold text-[var(--ink-mute)]">{k}</span>
      <span className={`text-right text-[11px] font-bold text-white ${mono ? "font-mono" : ""}`}>{v}</span>
    </div>
  );
}
function Slider({ k, v, min, max }: { k: string; v: number; min: number; max: number }) {
  const pct = ((v - min) / (max - min)) * 100;
  return (
    <div className="mt-2.5">
      <div className="flex justify-between text-[11px] font-bold"><span className="text-[var(--ink-mute)]">{k}</span><span className="text-white tabular-nums">{v.toFixed(2)}</span></div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-[#0c1424]"><div className="h-full rounded-full bg-[#35e0c8]" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function slotForScreen(s: PageDef["screen"]): string {
  if (s === "f01-welcome") return "splash.signal-mark (SVG)";
  if (s === "f13-lesson" || s === "B-lesson") return "lesson.skill-artwork (c01-c40 SVG)";
  if (s === "A-academy") return "academy.topic-path (c01-c40 SVG)";
  if (/f0[2-4]|f10|f12|f15|F-run|E-arena|D-assembly/.test(s)) return "chart.treatment";
  if (/f07|I-reveal/.test(s)) return "reveal.effect";
  if (/f08|f11|J-score/.test(s)) return "score.verdict";
  if (/f14|C-deck|P-unknown/.test(s)) return "skill.artwork (icons c01–c40)";
  if (s === "f06-sealed") return "seal.stamp";
  return "background.ambient";
}
function purposeForScreen(s: PageDef["screen"]): string {
  if (/f02/.test(s)) return "Узнавание · первое касание";
  if (/f04|H-decision/.test(s)) return "Решение из двух";
  if (/f05/.test(s)) return "Обоснование";
  if (/f07|I-reveal/.test(s)) return "Открытие скрытой зоны";
  if (/f08|f11|J-score/.test(s)) return "Оценка строками";
  if (/f13|B-lesson/.test(s)) return "Одна мысль + картинка";
  return "Артворк экрана";
}
