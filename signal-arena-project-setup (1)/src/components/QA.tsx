import { useEffect, useRef, useState } from "react";
import type { Page, Variant } from "../data/pages";
import { GameScreen } from "./GameScreen";

export const VIEWPORTS = [
  { id: "360x800", w: 360, h: 800, req: true },
  { id: "390x844", w: 390, h: 844, req: true },
  { id: "412x915", w: 412, h: 915, req: true },
  { id: "320x568", w: 320, h: 568, req: true },
  { id: "768x1024", w: 768, h: 1024, req: false },
  { id: "1280x800", w: 1280, h: 800, req: false },
  { id: "1440x900", w: 1440, h: 900, req: false },
];

export type QAResult = { page: string; variant: string; viewport: string; ok: boolean; issues: { component: string; actual: string; type: string; fix: string }[] };

/** Измеряет уже отрендеренный игровой экран. */
export function measure(root: HTMLElement, page: string, variant: string, viewport: string): QAResult {
  const issues: QAResult["issues"] = [];
  const gs = root.querySelector<HTMLElement>(".gs");
  if (!gs) return { page, variant, viewport, ok: false, issues: [{ component: ".gs", actual: "not rendered", type: "missing", fix: "render" }] };
  const R = gs.getBoundingClientRect();
  if (gs.scrollHeight > gs.clientHeight + 1) issues.push({ component: ".gs", actual: `${gs.scrollHeight}px > ${gs.clientHeight}px`, type: "vertical overflow", fix: "сократить второстепенный текст / уменьшить main visual" });
  if (gs.scrollWidth > gs.clientWidth + 1) issues.push({ component: ".gs", actual: `${gs.scrollWidth}px > ${gs.clientWidth}px`, type: "horizontal overflow", fix: "ограничить ширину компонента" });
  const check = (sel: string, name: string) => {
    gs.querySelectorAll<HTMLElement>(sel).forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.height === 0) return;
      if (b.bottom > R.bottom + 1 || b.top < R.top - 1) issues.push({ component: name, actual: `bottom ${Math.round(b.bottom - R.top)}px / frame ${Math.round(R.height)}px`, type: "clipped", fix: "уменьшить блок над CTA или разделить карточку" });
      if (b.right > R.right + 1 || b.left < R.left - 1) issues.push({ component: name, actual: `right ${Math.round(b.right - R.left)}px / frame ${Math.round(R.width)}px`, type: "h-clipped", fix: "ограничить ширину" });
    });
  };
  check(".btn", "CTA");
  check(".gs-nav", "bottom nav");
  check(".gs > div:nth-child(2)", "Top Bar");
  check(".sc", "skill card");
  // text/asset overlap: body children must not overlap each other
  const body = gs.querySelector<HTMLElement>(".gs-body");
  if (body) {
    const kids = Array.from(body.children).map((c) => c.getBoundingClientRect()).filter((b) => b.height > 0);
    for (let i = 1; i < kids.length; i++) if (kids[i].top < kids[i - 1].bottom - 2) issues.push({ component: `gs-body child ${i}`, actual: `overlap ${Math.round(kids[i - 1].bottom - kids[i].top)}px`, type: "overlap", fix: "сократить контент" });
    // font legibility
    body.querySelectorAll<HTMLElement>(".t, .h, .btn").forEach((el) => {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 10.5) issues.push({ component: el.className, actual: `${fs}px`, type: "unreadable text", fix: "не уменьшать текст; сократить" });
    });
  }
  // touch targets
  gs.querySelectorAll<HTMLElement>("button").forEach((b) => {
    const r = b.getBoundingClientRect();
    if (r.height > 0 && (r.height < 44 || r.width < 44) && !b.closest(".gs-nav")) issues.push({ component: `button "${(b.textContent || "").slice(0, 16)}"`, actual: `${Math.round(r.width)}×${Math.round(r.height)}`, type: "touch target < 44", fix: "min 44×44" });
  });
  return { page, variant, viewport, ok: issues.length === 0, issues };
}

/** Offscreen runner: рендерит страницу в каждом viewport и измеряет. */
export function QARunner({ page, variant, viewports, onDone }: { page: Page; variant: Variant; viewports: typeof VIEWPORTS; onDone: (r: QAResult[]) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let t = 0;
    const run = async () => {
      await (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready;
      t = window.setTimeout(() => {
        const root = ref.current;
        if (!root) return;
        const res = viewports.map((vp) => measure(root.querySelector<HTMLElement>(`[data-vp="${vp.id}"]`)!, page.id, variant.id, vp.id));
        onDone(res);
      }, 700);
    };
    run();
    return () => clearTimeout(t);
  }, [page, variant, viewports, onDone, tick]);
  useEffect(() => setTick((x) => x + 1), [page, variant]);
  return (
    <div ref={ref} aria-hidden style={{ position: "fixed", left: -20000, top: 0, pointerEvents: "none" }}>
      {viewports.map((vp) => (
        <div key={vp.id} data-vp={vp.id} style={{ width: vp.w, height: vp.h, position: "absolute", left: 0, top: 0 }}>
          <GameScreen page={page} variant={variant} />
        </div>
      ))}
    </div>
  );
}
