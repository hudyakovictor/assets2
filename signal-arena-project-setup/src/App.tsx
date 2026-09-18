import { useEffect, useState } from "react";
import { AssetProvider } from "./components/AssetContext";
import { CasualArenaScreen } from "./components/CasualArenaScreen";
import { Workbench } from "./components/Workbench";
import "./lib/handwritten.css";

/** Масштабирует фиксированный мобильный кадр под окно десктопа (без скролла/обрезки). */
function useFitScale(w: number, h: number, pad = 28) {
  const [s, setS] = useState(1);
  useEffect(() => {
    const calc = () => setS(Math.min(1, (window.innerWidth - pad) / w, (window.innerHeight - pad) / h));
    calc();
    addEventListener("resize", calc);
    return () => removeEventListener("resize", calc);
  }, [w, h, pad]);
  return s;
}

function useHash() {
  const [h, setH] = useState(location.hash);
  useEffect(() => {
    const f = () => setH(location.hash);
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  return h;
}

type Route = { exportId: string | null; vp: string | null };

function parseHash(h: string): Route {
  const p = new URLSearchParams(h.replace(/^#/, ""));
  return { exportId: p.get("export"), vp: p.get("vp") };
}

export default function App() {
  const hash = useHash();
  const route = parseHash(hash);
  const [studio, setStudio] = useState(false);

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { expand: () => void; ready: () => void } } }).Telegram?.WebApp;
    tg?.ready?.();
    tg?.expand?.();
  }, []);

  /* Export route: ONLY the game screen — no work panels, no chrome. */
  if (route.exportId) {
    return (
      <AssetProvider>
        <ExportStage exportId={route.exportId} vp={route.vp} />
      </AssetProvider>
    );
  }

  return (
    <AssetProvider>
      {studio ? (
        <Workbench onExit={() => setStudio(false)} />
      ) : (
        <PlayStage onStudio={() => setStudio(true)} />
      )}
    </AssetProvider>
  );
}

/* ------------------------------------------------------------------ */
/* PLAY — production Telegram Mini App shell (responsive, safe-area)   */
/* ------------------------------------------------------------------ */
function PlayStage({ onStudio }: { onStudio: () => void }) {
  const [w, setW] = useState(window.innerWidth);
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const f = () => setW(window.innerWidth);
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    addEventListener("resize", f);
    addEventListener("online", on);
    addEventListener("offline", off);
    return () => {
      removeEventListener("resize", f);
      removeEventListener("online", on);
      removeEventListener("offline", off);
    };
  }, []);

  // On a phone the app is truly full-width. On a desktop preview we hold the
  // last QA viewport instead of stretching the game across the whole screen.
  const phone = w <= 520;
  const scale = useFitScale(390, 844);

  return (
    <div className="stage-backdrop">
      <div
        className={phone ? "stage-phone-full" : "stage-capture-wrap"}
        style={phone ? undefined : { width: 390 * scale, height: 844 * scale }}
      >
        <div
          className={phone ? "" : "stage-capture"}
          style={phone ? undefined : { width: 390, height: 844, transform: `scale(${scale})` }}
        >
          <div className="app">
            <div className="screen">
              <CasualArenaScreen onOpenWorkbench={onStudio} />
            </div>
          </div>
        </div>
      </div>

      {!phone && <button className="stage-btn handwritten" onClick={onStudio}>Workbench</button>}
      {offline && (
        <div className="stage-offline mono">
          архивы недоступны — иконки в FALLBACK
          <button onClick={() => location.reload()}>повторить</button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EXPORT — чистый игровой экран без рабочих панелей                   */
/* ------------------------------------------------------------------ */
function ExportStage({ exportId, vp }: { exportId: string; vp: string | null }) {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const f = () => setW(window.innerWidth);
    addEventListener("resize", f);
    return () => removeEventListener("resize", f);
  }, []);

  const [pid, vid] = exportId.split("-");
  const dims = vp?.match(/^(\d+)x(\d+)$/);
  const phone = w <= 520 || !dims;
  const cw = dims ? +dims[1] : 390;
  const ch = dims ? +dims[2] : 844;
  const scale = useFitScale(cw, ch);

  return (
    <div className="stage-backdrop">
      <div
        className={phone ? "stage-phone-full" : "stage-capture-wrap"}
        style={phone ? undefined : { width: cw * scale, height: ch * scale }}
      >
        <div
          className={phone ? "" : "stage-capture"}
          style={phone ? undefined : { width: cw, height: ch, transform: `scale(${scale})` }}
        >
          <Workbench exportPage={pid} exportVariant={(vid as "A" | "B" | "C" | "D") || "A"} />
        </div>
      </div>
      {!phone && (
        <div className="mono stage-caption">
          EXPORT · {exportId} · {cw}×{ch} CSS px · без рабочих панелей
        </div>
      )}
    </div>
  );
}
