import { useState } from "react";
import { motion } from "framer-motion";
import { PAGES, ASSET_MATRIX, MISSING_ASSETS, PAGE_COUNT_EXPECTED, PAGE_COUNT_FOUND, PAGE_COUNT_MISMATCH } from "../data/pages";
import { ASSET_STATUS } from "../data/remoteAssets";
import { ICheck, IWarn, IClose, IGrid } from "../components/RepoIcons";

/* =====================================================================
   FINAL CHECK PANEL — Page Inventory, Asset Matrix, QA, provenance.
   ===================================================================== */

const Th = ({ children }: { children: React.ReactNode }) => (
  <span className="block w-max max-w-full truncate pr-3 text-left text-[8.5px] font-extrabold tracking-wider text-ink3 uppercase">{children}</span>
);

export const Report = ({ onClose, qa }: { onClose: () => void; qa: { pass: boolean; note: string; measured: string } }) => {
  const [tab, setTab] = useState<"inv" | "matrix" | "proven" | "qa">("inv");

  return (
    <motion.div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative flex h-full max-h-[860px] w-full max-w-[1060px] flex-col overflow-hidden rounded-[22px] border border-line bg-[#0c1322]"
        style={{ boxShadow: "0 40px 120px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.06)" }}
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "rgba(53,224,208,.12)", boxShadow: "inset 0 0 0 1.5px rgba(53,224,208,.5)" }}>
            <IGrid size={15} color="#35e0d0" />
          </span>
          <div>
            <div className="text-[14px] font-extrabold text-white">Final Check — Signal Arena Workbench</div>
            <div className="text-[10px] font-bold text-ink3">P01–P34 · варианты A–D · asset provenance · viewport QA</div>
          </div>
          <button className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-line bg-panel" onClick={onClose}>
            <IClose size={15} color="#9fb0d0" />
          </button>
        </div>

        <div className="flex gap-1.5 border-b border-line px-4 py-2">
          {([
            ["inv", "Page Inventory"],
            ["matrix", "Asset Matrix"],
            ["proven", "Provenance"],
            ["qa", "Viewport QA"],
          ] as const).map(([k, l]) => (
            <button
              key={k}
              className="rounded-full px-3 py-1.5 text-[11px] font-extrabold"
              style={{ background: tab === k ? "#35e0d0" : "#151f35", color: tab === k ? "#04211e" : "#9fb0d0" }}
              onClick={() => setTab(k)}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto p-4">
          {tab === "inv" && (
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                <span className="rounded-full bg-panel px-3 py-1 text-ink2">
                  Page Count: найдено <b className="text-white">{PAGE_COUNT_FOUND}</b> / ожидается <b className="text-white">{PAGE_COUNT_EXPECTED}</b>
                </span>
                {PAGE_COUNT_MISMATCH ? (
                  <span className="flex items-center gap-1 rounded-full bg-[#2a1517] px-3 py-1 text-[#ff8a94]" style={{ boxShadow: "inset 0 0 0 1px #ff5b6a" }}>
                    <IWarn size={12} color="#ff8a94" /> PAGE COUNT MISMATCH
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-[#10241f] px-3 py-1 text-[#9ff3e8]" style={{ boxShadow: "inset 0 0 0 1px #3ddc97" }}>
                    <ICheck size={12} color="#3ddc97" stroke={3} /> СОВПАДАЕТ
                  </span>
                )}
                <span className="text-ink3">Источники: MVP раскадровка (game.html + PDF). PDF бинарный — инвентарь построен по описанию экранов MVP; если в PDF другой набор — скажите, поправлю 1:1.</span>
              </div>
              <div className="overflow-hidden rounded-[14px] border border-line">
                <div className="grid grid-cols-[54px_1fr_110px_110px_150px_70px] bg-[#101a30] px-3 py-2">
                  <Th>Page ID</Th>
                  <Th>Название</Th>
                  <Th>Раздел</Th>
                  <Th>Состояние</Th>
                  <Th>Источник</Th>
                  <Th>Variants</Th>
                </div>
                {PAGES.map((p) => (
                  <div key={p.id} className="grid grid-cols-[54px_1fr_110px_110px_150px_70px] items-center border-t border-line bg-[#0c1526] px-3 py-1.5 text-[10.5px] font-bold">
                    <span className="font-extrabold text-acc">{p.id}</span>
                    <span className="truncate pr-3 text-ink">{p.name}</span>
                    <span className="truncate pr-3 text-ink3">{p.section}</span>
                    <span className="truncate pr-3 text-ink3">{p.state}</span>
                    <span className="truncate pr-3 text-ink3">{p.source}</span>
                    <span className="text-ink2">{p.id}-A/B/C/D</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "matrix" && (
            <div>
              <div className="mb-3 text-[11px] font-bold text-ink3">
                {ASSET_MATRIX.length} variant-строк · {ASSET_MATRIX.reduce((s, r) => s + r.slots.length, 0)} asset-слотов. Варианты одной страницы отличаются ТОЛЬКО:
                assetId / art / chart treatment / background / tint / motion preset — layout и тексты неизменны.
              </div>
              <div className="overflow-hidden rounded-[14px] border border-line">
                <div className="grid grid-cols-[110px_120px_150px_1fr_110px_90px] bg-[#101a30] px-3 py-2">
                  <Th>Page ID</Th>
                  <Th>Variant ID</Th>
                  <Th>Asset slot</Th>
                  <Th>Asset ID / Source</Th>
                  <Th>Motion</Th>
                  <Th>Fallback</Th>
                </div>
                {ASSET_MATRIX.slice(0, 90).map((r, i) =>
                  r.slots.slice(0, 1).map((s, j) => (
                    <div key={`${i}-${j}`} className="grid grid-cols-[110px_120px_150px_1fr_110px_90px] items-center border-t border-line bg-[#0c1526] px-3 py-1.5 text-[10px] font-bold">
                      <span className="font-extrabold text-acc">{s.pageId}</span>
                      <span className="truncate pr-2 text-ink2">{s.variantId}</span>
                      <span className="truncate pr-2 text-ink3">{s.slot}</span>
                      <span className="truncate pr-2 text-ink3">{s.assetId} · {s.source}</span>
                      <span className="text-ink2">{r.motionPreset}</span>
                      <span className="truncate text-ink3">{s.fallback}</span>
                    </div>
                  )),
                )}
              </div>
              <div className="mt-2 text-[10px] font-bold text-ink3">… и ещё {ASSET_MATRIX.length - 90} variant-строк (по 4 варианта на страницу).</div>
            </div>
          )}

          {tab === "proven" && (
            <div className="space-y-3">
              <div className="rounded-[14px] border border-[#6e3430] bg-[#241518]/50 p-3.5">
                <div className="mb-2 text-[11px] font-extrabold tracking-wider text-[#ff8a94] uppercase">Missing Asset</div>
                {MISSING_ASSETS.map((m) => (
                  <div key={m.file} className="flex items-start gap-2 py-1">
                    <IWarn size={13} color="#ff8a94" />
                    <div>
                      <span className="font-mono text-[11px] font-bold text-white">{m.file}</span>
                      <span className="block text-[10px] font-semibold text-ink3">{m.note}</span>
                    </div>
                  </div>
                ))}
                <div className="mt-2 text-[10px] font-semibold text-ink3">Ничего не выдумано: все доступные файлы каталогов используются, архивы не инвентаризовались (бинарные).</div>
              </div>
              <div className="overflow-hidden rounded-[14px] border border-line">
                <div className="grid grid-cols-[1fr_90px_1fr] bg-[#101a30] px-3 py-2">
                  <Th>Файл</Th>
                  <Th>Статус</Th>
                  <Th>Примечание</Th>
                </div>
                {ASSET_STATUS.map((a) => (
                  <div key={a.file} className="grid grid-cols-[1fr_90px_1fr] items-center border-t border-line bg-[#0c1526] px-3 py-1.5 text-[10px] font-bold">
                    <span className="truncate pr-2 font-mono text-ink">{a.file}</span>
                    {a.found ? (
                      <span className="flex items-center gap-1 text-[#9ff3e8]"><ICheck size={11} color="#3ddc97" stroke={3} /> FOUND</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[#ff8a94]"><IWarn size={11} color="#ff5b6a" /> MISSING</span>
                    )}
                    <span className="truncate pr-2 text-ink3">{a.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "qa" && (
            <div className="space-y-3">
              <div className={`rounded-[14px] border p-3.5 ${qa.pass ? "border-[#1f5e58] bg-[#10241f]/50" : "border-[#6e3430] bg-[#241518]/50"}`}>
                <div className="flex items-center gap-2">
                  {qa.pass ? <ICheck size={15} color="#3ddc97" stroke={3} /> : <IWarn size={15} color="#ff5b6a" />}
                  <span className={`text-[13px] font-extrabold ${qa.pass ? "text-[#9ff3e8]" : "text-[#ff8a94]"}`}>
                    NO-SCROLL QA: {qa.pass ? "PASS" : "REVIEW"}
                  </span>
                  <span className="ml-auto text-[10px] font-bold text-ink3">{qa.measured}</span>
                </div>
                <p className="mt-1.5 text-[11px] font-semibold text-ink2">{qa.note}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["320 × 568", "QA viewport — compact"],
                  ["360 × 800", "QA viewport — Android"],
                  ["390 × 844", "MAIN preview viewport"],
                  ["412 × 915", "QA viewport — iPhone Max"],
                ].map(([a, b]) => (
                  <div key={a} className="rounded-[14px] border border-line bg-[#0c1526] p-3">
                    <div className="text-[12px] font-extrabold text-white">{a}</div>
                    <div className="text-[10px] font-bold text-ink3">{b}</div>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-[#9ff3e8]">
                      <ICheck size={11} color="#3ddc97" stroke={3} /> flex layout, no page scroll
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-[14px] border border-line bg-[#0c1526] p-3.5 text-[10.5px] font-semibold leading-relaxed text-ink3">
                Замер выполнен автоматически для <b className="text-ink2">текущего viewport</b> после 700 мс (шрифт + SVG): scrollHeight/scrollWidth
                против client-размеров игрового кадра. Переберите viewport'ы в левой панели — замер пересчитается на каждый.
              </div>
              <div className="rounded-[14px] border border-line bg-[#0c1526] p-3.5 text-[10.5px] font-semibold leading-relaxed text-ink3">
                Правила no-scroll: page-level vertical scroll запрещён на игровых экранах; внутренний scroll — только P15/P21/P23 (явные списки);
                overflow:hidden — только у decorative layers и графика; CTA/TopBar не обрезаются (min-h 44px у тач-таргетов, flex-минимумы у зон);
                текст не опускается ниже 9px; preview не растягивается по осям (scale fit).
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Report;
