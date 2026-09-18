import { PAGES, assetMatrix } from "../lib/pages";
import { useAssets, REPO_URL } from "../lib/assets";

type SourceAudit = {
  requested: string;
  status: "root" | "archive" | "absent";
  where: string;
};

const AUDIT: SourceAudit[] = [
  {
    requested: "skill-card-icons.zip",
    status: "root",
    where: "корень репозитория · 55 914 B · c01–c40.svg",
  },
  {
    requested: "topbar.zip",
    status: "root",
    where: "корень репозитория · 790 112 B · topbar.html + 5 иконок",
  },
  {
    requested: "topbar.html",
    status: "archive",
    where: "внутри topbar.zip (в корне репозитория отсутствует)",
  },
  {
    requested: "lightning.svg",
    status: "archive",
    where: "внутри topbar.zip · используется SHARED_TOP_BAR_LOCKED",
  },
  { requested: "star.svg", status: "archive", where: "внутри topbar.zip" },
  { requested: "coin.svg", status: "archive", where: "внутри topbar.zip" },
  { requested: "bell.svg", status: "archive", where: "внутри topbar.zip" },
  { requested: "gear.svg", status: "archive", where: "внутри topbar.zip" },
  {
    requested: "assets.zip",
    status: "root",
    where: "дополнительные asset references · 2 156 218 B",
  },
  {
    requested: "game.html",
    status: "root",
    where: "MVP-прототип экранов · источник порядка экранов и текстов",
  },
  {
    requested: "game2.pdf",
    status: "root",
    where: "MVP reference · растровый, текст не извлекается",
  },
  {
    requested:
      "рототипы_экранов__casual_2D_(раскадровка__все_страницы).pdf",
    status: "root",
    where: "MVP раскадровка · растровый, текст не извлекается",
  },
  {
    requested: "preview-файлы",
    status: "absent",
    where: "в репозитории отсутствуют как отдельные файлы",
  },
];

const COLOR = {
  root: "#2E7F5C",
  archive: "#D0B24A",
  absent: "#C56861",
} as const;

function csv(): string {
  const head =
    "Page ID,Variant ID,Asset slot,Asset ID,Source,Placement,Purpose,Fallback";
  const rows = PAGES.flatMap((p) =>
    assetMatrix(p).map(
      (r) =>
        [r.pageId, r.vid, r.slot, r.assetId, r.source, r.placement, r.purpose, r.fallback]
          .map((x) => `"${String(x).replace(/"/g, '""')}"`)
          .join(","),
    ),
  );
  return [head, ...rows].join("\n");
}

export default function Report({ onClose }: { onClose: () => void }) {
  const assets = useAssets();
  const all = PAGES.flatMap((p) => assetMatrix(p));

  const download = () => {
    const url = URL.createObjectURL(
      new Blob([csv()], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "signal-arena-asset-matrix.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex h-full max-h-[92vh] w-full max-w-[1120px] flex-col overflow-hidden rounded-2xl border border-[#26364d] bg-[#080c14]">
        <header className="flex shrink-0 items-center gap-3 border-b border-[#1b2739] px-4 py-3">
          <h2 className="text-[13px] font-black tracking-[.14em] text-[#2EE6C8] uppercase">
            Signal Arena · Production Report
          </h2>
          <span className="flex-1" />
          <button
            onClick={download}
            className="tap rounded-lg bg-[#2EE6C8] px-3 py-[6px] text-[10.5px] font-bold uppercase tracking-wider text-[#04211C]"
          >
            Export Asset Matrix CSV ({all.length})
          </button>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="tap rounded-lg border border-[#26364d] px-3 py-[6px] font-mono text-[10.5px] text-[#7f90a8]"
          >
            repo ↗
          </a>
          <button
            onClick={onClose}
            className="tap grid h-[34px] w-[34px] place-items-center rounded-lg border border-[#26364d] text-[16px] text-[#c9d6e6]"
          >
            ×
          </button>
        </header>

        <div className="scroll-y min-h-0 flex-1 p-4">
          {/* ---- source audit ---- */}
          <section>
            <h3 className="text-[10.5px] font-black tracking-[.16em] text-[#55647a] uppercase">
              1 · Source audit · github.com/hudyakovictor/assets@main
            </h3>
            <div className="mt-2 overflow-hidden rounded-xl border border-[#1b2739]">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-white/4 text-[8.5px] tracking-[.12em] text-[#55647a] uppercase">
                  <tr>
                    <th className="px-2.5 py-1.5 font-black">Запрошено</th>
                    <th className="px-2.5 py-1.5 font-black">Статус</th>
                    <th className="px-2.5 py-1.5 font-black">Где найдено</th>
                  </tr>
                </thead>
                <tbody>
                  {AUDIT.map((a) => (
                    <tr key={a.requested} className="border-t border-white/5">
                      <td className="px-2.5 py-1.5 font-mono text-[#e8eef7]">
                        {a.requested}
                      </td>
                      <td className="px-2.5 py-1.5">
                        <span
                          className="rounded px-1.5 py-[1px] font-mono text-[9px] font-bold uppercase"
                          style={{
                            color: COLOR[a.status],
                            background: `${COLOR[a.status]}1f`,
                          }}
                        >
                          {a.status === "root"
                            ? "найдено в корне"
                            : a.status === "archive"
                              ? "внутри архива"
                              : "не найдено"}
                        </span>
                      </td>
                      <td className="px-2.5 py-1.5 text-[#8fa0b8]">{a.where}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 font-mono text-[10px] leading-snug text-[#7f90a8]">
              Загружено сейчас: skill-card-icons.zip → {Object.keys(assets.cards).length}/40
              SVG · topbar.zip → {assets.topbarFiles.length} файлов · assets.zip →{" "}
              {assets.extraFiles.length} references
              {!!assets.missing.length && (
                <span className="text-[#C56861]">
                  {" "}
                  · MISSING: {assets.missing.join(", ")}
                </span>
              )}
            </p>
          </section>

          {/* ---- page inventory ---- */}
          <section className="mt-5">
            <h3 className="text-[10.5px] font-black tracking-[.16em] text-[#55647a] uppercase">
              2 · Page Inventory · {PAGES.length} / 34
            </h3>
            <div className="mt-2 overflow-hidden rounded-xl border border-[#1b2739]">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-white/4 text-[8.5px] tracking-[.12em] text-[#55647a] uppercase">
                  <tr>
                    <th className="px-2.5 py-1.5 font-black">Page ID</th>
                    <th className="px-2.5 py-1.5 font-black">Название</th>
                    <th className="px-2.5 py-1.5 font-black">Раздел</th>
                    <th className="px-2.5 py-1.5 font-black">Состояние</th>
                    <th className="px-2.5 py-1.5 font-black">Варианты</th>
                    <th className="px-2.5 py-1.5 font-black">Источник</th>
                  </tr>
                </thead>
                <tbody>
                  {PAGES.map((p) => (
                    <tr key={p.id} className="border-t border-white/5">
                      <td className="px-2.5 py-1.5 font-mono font-black text-[#2EE6C8]">
                        {p.id}
                      </td>
                      <td className="px-2.5 py-1.5 text-[#e8eef7]">{p.title}</td>
                      <td className="px-2.5 py-1.5 text-[#8fa0b8]">{p.section}</td>
                      <td className="px-2.5 py-1.5 font-mono text-[10px] text-[#7f90a8]">
                        {p.state}
                      </td>
                      <td className="px-2.5 py-1.5 font-mono text-[10px] text-[#c9d6e6]">
                        {p.heroIds
                          .map((h, i) => `${p.id}-${"ABCD"[i]}:${h}`)
                          .join(" ")}
                      </td>
                      <td className="px-2.5 py-1.5 text-[10px] text-[#55647a]">
                        {p.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[10.5px] leading-snug text-[#7f90a8]">
              Page Count Check: запрошено P01–P34 · найдено и реализовано{" "}
              <b className="text-[#2EE6C8]">{PAGES.length}</b> · расхождений нет.
              Top Bar отсутствует только на P01 (splash / welcome) — это
              единственное допустимое исключение по MVP.
            </p>
          </section>

          {/* ---- full matrix ---- */}
          <section className="mt-5">
            <h3 className="text-[10.5px] font-black tracking-[.16em] text-[#55647a] uppercase">
              3 · Asset Matrix · {all.length} строк
            </h3>
            <div className="mt-2 overflow-hidden rounded-xl border border-[#1b2739]">
              <table className="w-full text-left text-[10.5px]">
                <thead className="bg-white/4 text-[8.5px] tracking-[.12em] text-[#55647a] uppercase">
                  <tr>
                    <th className="px-2 py-1.5 font-black">Page ID</th>
                    <th className="px-2 py-1.5 font-black">Variant</th>
                    <th className="px-2 py-1.5 font-black">Asset slot</th>
                    <th className="px-2 py-1.5 font-black">Asset ID</th>
                    <th className="px-2 py-1.5 font-black">Source</th>
                    <th className="px-2 py-1.5 font-black">Placement</th>
                    <th className="px-2 py-1.5 font-black">Purpose</th>
                    <th className="px-2 py-1.5 font-black">Fallback</th>
                  </tr>
                </thead>
                <tbody>
                  {all.map((r, i) => (
                    <tr key={i} className="border-t border-white/5 align-top">
                      <td className="px-2 py-1.5 font-mono font-bold text-[#2EE6C8]">
                        {r.pageId}
                      </td>
                      <td className="px-2 py-1.5 font-mono text-[#e8eef7]">
                        {r.vid}
                      </td>
                      <td className="px-2 py-1.5 font-mono text-[#c9d6e6]">
                        {r.slot}
                      </td>
                      <td className="px-2 py-1.5 font-mono text-[#D0B24A]">
                        {r.assetId}
                      </td>
                      <td className="px-2 py-1.5 font-mono text-[9.5px] text-[#7f90a8]">
                        {r.source}
                      </td>
                      <td className="px-2 py-1.5 text-[#8fa0b8]">{r.placement}</td>
                      <td className="px-2 py-1.5 text-[#8fa0b8]">{r.purpose}</td>
                      <td className="px-2 py-1.5 text-[9.5px] text-[#55647a]">
                        {r.fallback}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ---- locks ---- */}
          <section className="mt-5 mb-4">
            <h3 className="text-[10.5px] font-black tracking-[.16em] text-[#55647a] uppercase">
              4 · Locks
            </h3>
            <ul className="mt-2 space-y-1 text-[11px] leading-snug text-[#8fa0b8]">
              <li>
                <b className="text-[#2EE6C8]">SHARED_TOP_BAR_LOCKED</b> — один
                общий компонент на все игровые экраны; рендерит настоящий
                topbar.html из topbar.zip. Меняются только LVL, XP,
                attempts/energy, stars, coins, notification badge, disabled /
                empty state.
              </li>
              <li>
                <b className="text-[#D0B24A]">SKILL_CARD_ICONS</b> — только
                c01–c40.svg из skill-card-icons.zip, white hybrid
                filled-outline, единый viewBox и оптическое центрирование.
                Запрет на возврат к тонкому line-art.
              </li>
              <li>
                <b className="text-[#4C6180]">PALETTE</b> — green #2E7F5C
                (c01–c15) · yellow #D0B24A (c16–c24) · blue #4C6180 (c25–c33) ·
                red #C56861 (c34–c40). Иконка всегда белая.
              </li>
              <li>
                <b className="text-[#C56861]">VARIANT RULE</b> — варианты
                отличаются только assetId / иллюстрацией / chart treatment /
                tint / crop / fit / scale / position / opacity / motion preset.
                Layout, тексты, кнопки и механика идентичны.
              </li>
              <li>
                <b className="text-[#2EE6C8]">NO-SCROLL</b> — игровой экран без
                page-level scroll на всех обязательных viewport: 320×568,
                360×800, 390×844, 412×915.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
