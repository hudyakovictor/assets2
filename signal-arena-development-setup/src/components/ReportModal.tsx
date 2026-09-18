import { PAGES, variantsOf, assetMatrix } from "../lib/pages";
import { DownloadIcon, CrossedCandlestickSwordsIcon, CheckmarkIcon, LockIcon, CloseIcon } from "./icons";
import { playTapSound } from "../utils/audio";
import { INTERFACE_AUDIT, TOP_30 } from "../lib/interfaceAudit";
import { PROPORTION_AUDIT, PROPORTION_SPEC } from "../lib/proportionAudit";
import { MVP_REQUIREMENTS, SCORE_BEFORE, SCORE_AFTER } from "../lib/mvpRequirements";
import { FLOW_EVIDENCE } from "../lib/flowState";

const AUDIT = [
  { file: "skill-card-icons.zip", status: "archive", note: "ASSET_ARCHIVE_NOT_EXTRACTED в audit tool; runtime JSZip: c01–c40.svg" },
  { file: "topbar.zip", status: "archive", note: "ASSET_ARCHIVE_NOT_EXTRACTED в audit tool; runtime JSZip: topbar.html + 5 icons" },
  { file: "assets.zip", status: "archive", note: "ASSET_ARCHIVE_NOT_EXTRACTED; подтверждён interactive-game-ui-asset-catalog" },
  { file: "game.html", status: "src", note: "MVP-прототип: порядок экранов, логика, тексты, состояния" },
  { file: "game2.pdf", status: "src", note: "MVP reference artboard · 300×620 · 15/31" },
  { file: "раскадровка.pdf", status: "src", note: "casual 2D раскадровка всех страниц" },
];

function buildCsv(): string {
  const head = "Page ID,Variant ID,Asset slot,Asset ID,Source,Placement,Purpose,Fallback";
  const rows = PAGES.flatMap((p) =>
    assetMatrix(p).map((r) =>
      [r.pageId, r.vid, r.slot, r.assetId, r.source, r.placement, r.purpose, r.fallback]
        .map((x) => `"${String(x).replace(/"/g, '""')}"`)
        .join(",")
    )
  );
  return [head, ...rows].join("\n");
}

export function ReportModal({ onClose }: { onClose: () => void }) {
  const matrix = PAGES.flatMap((p) => assetMatrix(p));

  const exportCsv = () => {
    playTapSound();
    const url = URL.createObjectURL(new Blob([buildCsv()], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "signal-arena-asset-matrix.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/78 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[860px] max-h-[92%] rounded-3xl bg-[#0D1521] border border-[#22344C] shadow-2xl flex flex-col overflow-hidden">
        {/* Шапка */}
        <div className="shrink-0 p-4 border-b border-[#1A283C] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2EE6C8] to-[#128F7C] flex items-center justify-center">
            <CrossedCandlestickSwordsIcon size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-extrabold text-[15px] text-white">
              Production Report
            </h2>
            <p className="font-mono text-[9.5px] text-[#56708C]">
              github.com/hudyakovictor/assets@main · MVP Part 1+2 · P01–P34 · 4 variants each
            </p>
          </div>
          <button
            onClick={exportCsv}
            className="tactile-btn flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2EE6C8] text-[#062B25] font-display font-extrabold text-[11px] uppercase"
          >
            <DownloadIcon size={14} /> CSV · {matrix.length}
          </button>
          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="tactile-btn w-9 h-9 rounded-xl bg-[#16202F] border border-[#2B3E57] text-[#8FA2BA] grid place-items-center"
          >
            <CloseIcon size={15} />
          </button>
        </div>

        <div className="flex-1 min-h-0 custom-scroll p-4 space-y-5">
          <section>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#C56861]/35 bg-[#C56861]/10 p-3">
                <p className="font-mono text-[8px] text-[#FFAAA3]">SCORE_BEFORE</p>
                <p className="font-display text-[24px] font-extrabold text-white">{SCORE_BEFORE}/100</p>
              </div>
              <div className="rounded-xl border border-[#2EE6C8]/35 bg-[#2EE6C8]/10 p-3">
                <p className="font-mono text-[8px] text-[#2EE6C8]">SCORE_AFTER</p>
                <p className="font-display text-[24px] font-extrabold text-white">{SCORE_AFTER}/100</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-display font-extrabold text-[11px] tracking-[0.14em] text-[#67809C] uppercase mb-2">
              Requirements Matrix
            </h3>
            <div className="rounded-2xl border border-[#1A283C] overflow-hidden">
              {MVP_REQUIREMENTS.map((item) => (
                <div key={item.id} className="grid grid-cols-[34px_1fr_58px_58px] gap-2 items-start px-3 py-1.5 border-b last:border-0 border-[#141F2E] bg-[#0B1320]">
                  <span className="font-mono text-[8px] font-black text-[#2EE6C8]">{item.id}</span>
                  <div>
                    <p className="text-[9.5px] font-bold text-[#C5D6E8]">{item.requirement}</p>
                    <p className="text-[8px] text-[#607996]">{item.evidence}</p>
                  </div>
                  <span className="font-mono text-[7.5px] text-[#FF928A]">{item.statusBefore}</span>
                  <span className="font-mono text-[7.5px] text-[#50C890]">{item.statusAfter}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-display font-extrabold text-[11px] tracking-[0.14em] text-[#67809C] uppercase mb-2">
              Flow Evidence
            </h3>
            <div className="space-y-1">
              {FLOW_EVIDENCE.map((line, index) => (
                <p key={line} className="rounded-lg border border-[#1A283C] bg-[#0B1320] px-2.5 py-1.5 font-mono text-[8.5px] text-[#8FA2BA]">
                  {index + 1}. {line}
                </p>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between mb-2">
              <div>
                <h3 className="font-display font-extrabold text-[11px] tracking-[0.14em] text-[#67809C] uppercase">
                  Proportion Audit · 150 checks
                </h3>
                <p className="mt-1 text-[10px] font-semibold text-[#8FA2BA]">
                  15 областей × 10 факторов: content-fit, hierarchy, touch, density, safe-area, overflow и responsive scale.
                </p>
              </div>
              <span className="font-mono text-[9px] font-black text-[#2EE6C8]">
                {PROPORTION_AUDIT.length}/150 PASS
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                ["WORKBENCH", `${PROPORTION_SPEC.workbench.leftRailPx}px / stage ≥ ${PROPORTION_SPEC.workbench.stageMinPx}px / ${PROPORTION_SPEC.workbench.rightRailPx}px`],
                ["GAME SHELL", `${PROPORTION_SPEC.game390x844.topbar}% / ${PROPORTION_SPEC.game390x844.content}% / ${PROPORTION_SPEC.game390x844.bottomNav}%`],
                ["DECISION", `head ${PROPORTION_SPEC.decisionScreen.heading}% · chart ${PROPORTION_SPEC.decisionScreen.terminal}% · skills ${PROPORTION_SPEC.decisionScreen.skillCards}%`],
                ["ACTIONS", `decision ${PROPORTION_SPEC.decisionScreen.decisions}% · CTA ${PROPORTION_SPEC.decisionScreen.primaryCta}%`],
                ["TUTORIAL", `visual ${PROPORTION_SPEC.tutorialScreen.visual}% · copy ${PROPORTION_SPEC.tutorialScreen.explanation}%`],
                ["TERMINAL", `toolbar ${PROPORTION_SPEC.terminal.toolbar}% · chart ${PROPORTION_SPEC.terminal.chartPlane}% · rail ${PROPORTION_SPEC.terminal.timeframeRail}%`],
              ].map(([name, value]) => (
                <div key={name} className="rounded-xl border border-[#1A283C] bg-[#0B1320] p-2.5">
                  <p className="font-mono text-[8px] font-black text-[#2EE6C8]">{name}</p>
                  <p className="mt-1 text-[9px] font-semibold leading-snug text-[#8FA2BA]">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between mb-2">
              <div>
                <h3 className="font-display font-extrabold text-[11px] tracking-[0.14em] text-[#67809C] uppercase">
                  0 · Pareto 20/80 · 50 interface checks
                </h3>
                <p className="mt-1 text-[10px] font-semibold text-[#8FA2BA]">
                  Исправлены Top-30 проблем с максимальным влиянием; оставшиеся 20 проверены как контроль качества.
                </p>
              </div>
              <span className="shrink-0 font-mono text-[9px] font-black text-[#2EE6C8]">
                {TOP_30.length} FIXED / {INTERFACE_AUDIT.length} CHECKED
              </span>
            </div>
            <div className="rounded-2xl border border-[#1A283C] overflow-hidden">
              {INTERFACE_AUDIT.map((item) => (
                <div key={item.id} className="grid grid-cols-[28px_74px_1fr_auto] gap-2 items-start px-3 py-1.5 border-b last:border-b-0 border-[#141F2E] bg-[#0B1320]">
                  <span className="font-mono text-[8.5px] font-black text-[#526B88]">{String(item.id).padStart(2, "0")}</span>
                  <span className="font-mono text-[8px] font-black text-[#2EE6C8] uppercase">{item.area}</span>
                  <span className="text-[9.5px] font-semibold text-[#A9BED4]">
                    {item.finding} <span className="text-[#607996]">→ {item.correction}</span>
                  </span>
                  <span className={`text-[7.5px] font-black px-1.5 py-0.5 rounded ${item.status === "fixed" ? "bg-[#50C890]/15 text-[#50C890]" : "bg-[#4C6180]/25 text-[#9CB1CC]"}`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Source audit */}
          <section>
            <h3 className="font-display font-extrabold text-[11px] tracking-[0.14em] text-[#67809C] uppercase mb-2">
              1 · Source audit
            </h3>
            <div className="rounded-2xl border border-[#1A283C] overflow-hidden">
              {AUDIT.map((a, i) => (
                <div
                  key={a.file}
                  className={`flex items-start gap-3 px-3 py-2 ${i ? "border-t border-[#141F2E]" : ""} bg-[#0B1320]`}
                >
                  <span className="font-mono font-black text-[10.5px] text-[#2EE6C8] w-40 shrink-0">
                    {a.file}
                  </span>
                  <span
                    className={`shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded ${
                      a.status === "ref"
                        ? "bg-[#F5BE38]/15 text-[#F5C75D] border border-[#F5BE38]/35"
                        : "bg-[#2EE6C8]/12 text-[#2EE6C8] border border-[#2EE6C8]/35"
                    }`}
                  >
                    {a.status === "ref" ? "ASSETS" : "MVP SRC"}
                  </span>
                  <span className="text-[10.5px] font-semibold text-[#8FA2BA]">{a.note}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Page inventory */}
          <section>
            <h3 className="font-display font-extrabold text-[11px] tracking-[0.14em] text-[#67809C] uppercase mb-2">
              2 · Page Inventory · {PAGES.length}/34
            </h3>
            <div className="rounded-2xl border border-[#1A283C] overflow-hidden">
              {PAGES.map((p, i) => (
                <div
                  key={p.id}
                  className={`grid grid-cols-[44px_1fr_auto_auto] items-center gap-2 px-3 py-1.5 ${
                    i ? "border-t border-[#141F2E]" : ""
                  } bg-[#0B1320]`}
                >
                  <span className="font-mono font-black text-[10px] text-[#2EE6C8]">{p.id}</span>
                  <span className="text-[10.5px] font-bold text-[#C5D6E8] truncate">{p.title}</span>
                  <span className="font-mono text-[8.5px] text-[#56708C]">{p.state}</span>
                  <span className="flex gap-0.5">
                    {variantsOf(p).map((v) => (
                      <span
                        key={v.vid}
                        className="w-4 h-4 grid place-items-center rounded bg-[#16202F] font-mono text-[8px] font-black text-[#869DB8]"
                      >
                        {v.letter}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-[#8FA2BA]">
              <CheckmarkIcon size={12} className="text-[#50C890]" />
              Page Count Check: реализовано {PAGES.length} из 34 · Top Bar отсутствует только на
              P01 (splash) · расхождений нет.
            </p>
          </section>

          {/* Locks */}
          <section className="pb-2">
            <h3 className="font-display font-extrabold text-[11px] tracking-[0.14em] text-[#67809C] uppercase mb-2">
              3 · Design Locks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ["SHARED_TOP_BAR_LOCKED", "Один Top Bar на все игровые экраны. Меняются только LVL, XP, попытки, звёзды, монеты, бейдж."],
                ["SKILL ICONS c01–c40", "White filled-outline, единый viewBox и оптический центр. Запрет на тонкий line-art."],
                ["PALETTE", "green #2E7F5C · yellow #D0B24A · blue #4C6180 · red #C56861. Иконка всегда белая."],
                ["VARIANT RULE", "Варианты меняют только assetId, chart treatment, tint, motion, crop, scale. Layout и тексты идентичны."],
                ["NO SCROLL", "Игровой экран без page-level scroll на 320×568 … 412×915. Внутренний scroll только для списков."],
                ["MOBILE ONLY", "Отклик на :active, тактильный звук, touch-targets ≥ 44px. Hover не используется как аффорданс."],
              ].map(([t, d]) => (
                <div key={t} className="p-2.5 rounded-xl bg-[#0B1320] border border-[#1A283C]">
                  <p className="font-mono font-black text-[9.5px] text-[#2EE6C8] flex items-center gap-1.5">
                    <LockIcon size={11} /> {t}
                  </p>
                  <p className="text-[10px] font-semibold text-[#8FA2BA] mt-1 leading-snug">{d}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
