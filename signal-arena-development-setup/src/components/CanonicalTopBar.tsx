import { useEffect, useMemo, useRef } from "react";
import { useRepoAssets } from "../lib/repoAssets";

export type CanonicalTopBarProps = {
  gameWidth?: number;
  level?: number;
  xp?: number;
  xpMax?: number;
  attempts?: number;
  stars?: number;
  coins?: number;
  badge?: number;
};

function bindValues(
  doc: Document,
  values: Required<Omit<CanonicalTopBarProps, "gameWidth">>,
  urls: Record<string, string>,
) {
  const textNodes: Text[] = [];
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  for (const node of textNodes) {
    const source = node.nodeValue ?? "";
    let next = source;
    if (/\bLVL\s*\d+/i.test(next)) next = next.replace(/(LVL\s*)\d+/i, `$1${values.level}`);
    if (/\d+\s*\/\s*\d+/.test(next))
      next = next.replace(/\d+\s*\/\s*\d+/, `${values.xp}/${values.xpMax}`);
    if (/^\s*\d[\d\s]{2,}\s*$/.test(next) && Number(next.replace(/\s/g, "")) > 99)
      next = next.replace(/[\d\s]+/, values.coins.toLocaleString("ru-RU"));
    node.nodeValue = next;
  }

  const progress = Math.max(0, Math.min(100, (values.xp / values.xpMax) * 100));
  doc.querySelectorAll<HTMLElement>("[data-xp-fill], .xp-fill, .progress-fill").forEach((el) => {
    el.style.width = `${progress}%`;
  });

  const metric: Record<string, number> = {
    lightning: values.attempts,
    star: values.stars,
    coin: values.coins,
  };
  for (const [name, value] of Object.entries(metric)) {
    const url = urls[name];
    if (!url) continue;
    const image = Array.from(doc.querySelectorAll<HTMLImageElement>("img")).find((img) => img.src === url || img.getAttribute("src") === url);
    let root = image?.parentElement ?? null;
    for (let depth = 0; root && depth < 4; depth++, root = root.parentElement) {
      if (/\d/.test(root.textContent ?? "") && (root.textContent ?? "").length < 40) {
        const w = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        while (w.nextNode()) {
          const node = w.currentNode as Text;
          if (/\d/.test(node.nodeValue ?? "")) {
            node.nodeValue = (node.nodeValue ?? "").replace(/[\d\s]+/, value.toLocaleString("ru-RU"));
            break;
          }
        }
        break;
      }
    }
  }

  if (values.badge === 0) {
    doc.querySelectorAll<HTMLElement>(".badge, [data-badge], .notification-badge").forEach((el) => {
      el.style.display = "none";
    });
  }
}

export function CanonicalTopBar({
  gameWidth = 390,
  level = 7,
  xp = 680,
  xpMax = 1000,
  attempts = 3,
  stars = 18,
  coins = 1240,
  badge = 2,
}: CanonicalTopBarProps) {
  const assets = useRepoAssets();
  const frame = useRef<HTMLIFrameElement>(null);
  const values = useMemo(
    () => ({ level, xp, xpMax, attempts, stars, coins, badge }),
    [level, xp, xpMax, attempts, stars, coins, badge],
  );

  const srcDoc = useMemo(() => {
    if (!assets.topbarHtml) return "";
    let html = assets.topbarHtml;
    for (const [name, url] of Object.entries(assets.topbarUrls)) {
      html = html
        .split(`${name}.svg`)
        .join(url);
    }
    const css = `<style>html,body{margin:0!important;padding:0!important;background:transparent!important;overflow:hidden!important}body{width:390px!important}*{box-sizing:border-box}</style>`;
    return /<\/head>/i.test(html) ? html.replace(/<\/head>/i, `${css}</head>`) : `${css}${html}`;
  }, [assets.topbarHtml, assets.topbarUrls]);

  useEffect(() => {
    const apply = () => {
      const doc = frame.current?.contentDocument;
      if (doc?.body) bindValues(doc, values, assets.topbarUrls);
    };
    const a = window.setTimeout(apply, 80);
    const b = window.setTimeout(apply, 360);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [srcDoc, values, assets.topbarUrls]);

  if (assets.status === "loading") {
    return (
      <div className="flex h-[54px] shrink-0 items-center px-3 border-b border-[#2EE6C8]/20 bg-[#2EE6C8]/5 font-mono text-[9px] text-[#6FB8AD]">
        LOADING: topbar.zip → topbar.html
      </div>
    );
  }

  if (!assets.topbarHtml) {
    return (
      <div className="flex h-[54px] shrink-0 items-center px-3 border-b border-[#C56861]/40 bg-[#C56861]/10 font-mono text-[9px] text-[#FFAAA3]">
        {assets.missing.find((item) => item.includes("topbar")) ?? "ASSET_ARCHIVE_NOT_EXTRACTED: topbar.zip"}
      </div>
    );
  }

  return (
    <div
      data-qa="topbar"
      data-lock="SHARED_TOP_BAR_LOCKED"
      className="relative w-full shrink-0 overflow-hidden"
      style={{ height: 56 * (gameWidth / 390) }}
    >
      <iframe
        ref={frame}
        title="SHARED_TOP_BAR_LOCKED"
        srcDoc={srcDoc}
        scrolling="no"
        tabIndex={-1}
        className="pointer-events-none absolute left-0 top-0 h-[82px] w-[390px] origin-top-left border-0 bg-transparent"
        style={{ transform: "scale(var(--tb-scale, 1))" }}
      />
    </div>
  );
}