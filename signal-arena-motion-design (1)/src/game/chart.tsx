/* ============================================================================
   CHART ENGINE
   Hard rules encoded here:
     · before the Seal the chart ENDS at t0 — the future does not exist yet
       (no big closed block, no giant question-mark panel, no fake future data)
     · after the Seal: fix decision → fast-forward time-scrub → draw the rest of
       the historical path → mark the key event → explanation → grade
   ========================================================================== */
import { useEffect, useRef, useState } from "react";
import type { Candle, Series } from "./content";
import type { MotionPresetId } from "./catalog";

function useSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ w: 320, h: 190 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

export type ChartTreatment = "glow" | "hollow" | "depth" | "impulse";
export type CueKind = "ring" | "dash" | "whale" | "tray";

export interface ChartProps {
  series: Series;
  treatment: ChartTreatment;
  cue: CueKind;
  /** candles of the future drawn so far (post-Seal scrub) */
  revealedCount: number;
  sealed: boolean;
  scrubbing?: boolean;
  eventIndex?: number;
  onPick?: (yPx: number, correct: boolean) => void;
  pickState?: "idle" | "hit" | "miss";
  showPointer?: boolean;
  caption?: string;
  symbol?: string;
  tf?: string;
  compact?: boolean;
  motion?: MotionPresetId;
  chartAssetId?: string;
}

const UP = "#3ECF8E";
const DOWN = "#E2605C";

export function CandleChart({
  series, treatment, cue, revealedCount, sealed, scrubbing, eventIndex,
  onPick, pickState = "idle", showPointer, caption, symbol = "BTC/USDT", tf = "4H",
  compact, chartAssetId,
}: ChartProps) {
  const [ref, size] = useSize<HTMLDivElement>();
  const w = Math.max(120, size.w);
  const h = Math.max(compact ? 84 : 140, size.h);
  const padTop = 14;
  const padBottom = 12;
  const padLeft = 8;
  const padRight = treatment === "depth" ? Math.max(48, w * 0.28) : 10;

  const visible: Candle[] = [...series.pre, ...series.post.slice(0, revealedCount)];
  const total = series.pre.length + series.post.length;
  const plotW = Math.max(40, w - padLeft - padRight);
  const plotH = Math.max(40, h - padTop - padBottom);
  const barW = plotW / total;
  /* толстые тела как в референсе: до 72% шага, минимум 5px */
  const bodyW = Math.max(7, Math.min(26, barW * 0.86));

  const yOf = (p: number) => padTop + ((series.hi - p) / (series.hi - series.lo)) * plotH;
  const xOf = (c: Candle) => padLeft + (c.b + series.pre.length) * barW + barW / 2;

  const t0x = padLeft + series.pre.length * barW;
  const levelY = yOf(series.level);
  const zoneTop = yOf(series.zone[0]);
  const zoneBot = yOf(series.zone[1]);
  const zoneH = Math.max(10, zoneBot - zoneTop);

  /* pointerup: без 300ms-задержки в WebView; хит-зона расширена до 44px по вертикали */
  const handlePick = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!onPick || sealed) return;
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * h;
    const slack = Math.max(8, (44 - zoneH) / 2);
    const correct = y >= zoneTop - slack && y <= zoneBot + slack;
    onPick(y, correct);
  };

  const hollow = treatment === "hollow";
  const impulse = treatment === "impulse";
  const gridOk = !compact;

  const closes = visible.map((c) => `${xOf(c)},${yOf(c.c)}`).join(" L");
  const prePath = visible.filter((c) => c.b < 0).map((c) => `${xOf(c)},${yOf(c.c)}`).join(" L");
  const postPath = visible.filter((c) => c.b >= 0).map((c) => `${xOf(c)},${yOf(c.c)}`).join(" L");

  return (
    <div
      ref={ref}
      className={`chart-frame ${treatment === "glow" ? "vignette" : ""} ${compact ? "" : "scanlines"}`}
      data-chart-asset={chartAssetId}
      style={{
        position: "relative", width: "100%", height: "100%", minHeight: compact ? 84 : 140, flex: "1 1 auto",
        transform: "translate3d(var(--ch-x, 0px), var(--ch-y, 0px), 0) scale(var(--ch-scale, 1))",
        opacity: "var(--ch-opacity, 1)",
        filter: "hue-rotate(var(--ch-tint, 0deg))",
      }}
    >
      <svg width={w} height={h} style={{ display: "block", touchAction: "manipulation" }} onPointerUp={handlePick}>
        <defs>
          <linearGradient id="impFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#33C1A1" stopOpacity=".34" />
            <stop offset="100%" stopColor="#33C1A1" stopOpacity="0" />
          </linearGradient>
          <filter id="chGlowUp" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="chGlowDown" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* grid + price scale */}
        {gridOk && [0.2, 0.45, 0.7].map((k) => (
          <g key={k}>
            <line x1={padLeft} x2={padLeft + plotW} y1={padTop + plotH * k} y2={padTop + plotH * k}
              stroke="#4E7BB0" strokeWidth="1" strokeDasharray="3 6" opacity=".35" />
            <text x={padLeft + plotW + 6} y={padTop + plotH * k + 3} fill="#8FA6C6" fontSize="9" fontFamily="Inter, sans-serif">
              {formatPrice(series.hi - (series.hi - series.lo) * k, series.tick)}
            </text>
          </g>
        ))}

        {/* targeted zone — the visible drop area, highlighted and tappable */}
        <g style={{ cursor: sealed ? "default" : "pointer" }}>
          <rect x={t0x - barW * 3.6} y={zoneTop} width={barW * 3.4} height={zoneH} rx="6"
            fill={pickState === "hit" ? "rgba(62,207,142,.36)" : pickState === "miss" ? "rgba(226,96,92,.3)" : "rgba(62,207,142,.2)"}
            stroke={pickState === "miss" ? DOWN : UP} strokeWidth="1.4" strokeDasharray="5 4" />
          {!compact && (
            <text x={t0x - barW * 3.4} y={zoneTop - 6} fill={pickState === "miss" ? DOWN : UP} fontSize="11" fontWeight="800" fontFamily="Nunito, Inter, sans-serif" letterSpacing=".04em">
              ЗОНА ПАДЕНИЯ
            </text>
          )}
        </g>

        {/* level line */}
        <line x1={padLeft} x2={padLeft + plotW} y1={levelY} y2={levelY} stroke="#46D3B1" strokeWidth="2.4" strokeDasharray="10 8" strokeLinecap="round" opacity=".95" />
        {!compact && (
          <text x={padLeft + 4} y={levelY - 5} fill="#9FE8D3" fontSize="10.5" fontWeight="800" fontFamily="Nunito, Inter, sans-serif">
            {formatPrice(series.level, series.tick)}
          </text>
        )}

        {/* depth ladder treatment */}
        {treatment === "depth" && <DepthLadder series={series} yOf={yOf} x0={padLeft + plotW + 4} wdt={padRight - 14} cue={cue} up={UP} down={DOWN} />}

        {/* impulse line treatment */}
        {impulse && visible.length > 1 && (
          <>
            <path d={`M${closes}`} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="1.2" />
            {prePath && <path d={`M${prePath}`} fill="none" stroke="#9FD9F5" strokeWidth="1.8" opacity=".85" />}
            {postPath && (
              <>
                <path d={`M${postPath}`} fill="none" stroke="#33C1A1" strokeWidth="3" />
                <path d={`M${postPath} L${xOf(visible[visible.length - 1])},${padTop + plotH} L${xOf(visible[0])},${padTop + plotH} Z`} fill="url(#impFill)" opacity=".8" />
              </>
            )}
            {visible.map((c) => (
              <circle key={c.b} cx={xOf(c)} cy={yOf(c.c)} r={c.b >= 0 ? 2.6 : 1.8} fill={c.b >= 0 ? "#BFF7E6" : "#CFE8FF"} />
            ))}
          </>
        )}

        {/* candles */}
        {!impulse && visible.map((c) => {
          const x = xOf(c);
          const up = c.c >= c.o;
          const yA = yOf(Math.max(c.o, c.c));
          const yB = yOf(Math.min(c.o, c.c));
          const bh = Math.max(1.8, yB - yA);
          const future = c.b >= 0;
          const isEvent = eventIndex !== undefined && c.b === eventIndex;
          const stroke = up ? UP : DOWN;
          const fillC = hollow && up ? "rgba(62,207,142,.12)" : stroke;
          return (
            <g key={c.b} className={future ? "candle-in" : undefined} style={future ? { animationDelay: `${(c.b - 1) * 42}ms` } : undefined}>
              <line x1={x} x2={x} y1={yOf(c.h)} y2={yOf(c.l)} stroke={stroke} strokeWidth={Math.max(2, bodyW * 0.22)} strokeLinecap="round" opacity={0.95} />
              <rect
                x={x - bodyW / 2} y={yA} width={bodyW} height={Math.max(bh, 3)} rx={Math.min(4, bodyW / 2.6)}
                fill={fillC} stroke={hollow && up ? UP : "rgba(0,0,0,.35)"} strokeWidth={hollow && up ? 2 : 1}
                filter={treatment === "glow" ? (up ? "url(#chGlowUp)" : "url(#chGlowDown)") : undefined}
                opacity={scrubbing && future ? 0.95 : 1}
              />
              {/* мягкий верхний блик тела — пластиковый объём */}
              <rect x={x - bodyW / 2 + 1.5} y={yA + 1.5} width={Math.max(1, bodyW * 0.3)} height={Math.max(1, Math.max(bh, 3) - 3)} rx="1.5" fill="#ffffff" opacity=".28" />
              {isEvent && <circle cx={x} cy={yOf(c.c)} r={bodyW * 0.6 + 3} fill="none" stroke="#FFD76B" strokeWidth="2" />}
            </g>
          );
        })}

        {/* t0 seal line — the border between decision and history */}
        <line x1={t0x} x2={t0x} y1={padTop - 6} y2={padTop + plotH} stroke="#EAF3FF" strokeWidth="1.4" opacity=".55" strokeDasharray="4 5" />
        <text x={t0x + 4} y={padTop - 10} fill="#EAF3FF" fontSize="9.5" fontWeight="700" letterSpacing=".1em" fontFamily="Inter, sans-serif">
          t0 · РЕШЕНИЕ
        </text>

        {/* last-candle pulse ring + pointer cue (first action teach) */}
        {!sealed && (
          <>
            <circle cx={t0x - barW / 2} cy={yOf(series.pre[series.pre.length - 1].c)} r={bodyW * 0.9 + 9}
              fill="none" stroke="#46D3B1" strokeWidth="3"
              style={{ animation: "sa-pulse-ring 2.1s var(--ease-out) infinite", transformBox: "fill-box", transformOrigin: "center" }} />
            <circle cx={t0x - barW / 2} cy={yOf(series.pre[series.pre.length - 1].c)} r={bodyW * 0.9 + 7}
              fill="rgba(70,211,177,.14)" stroke="#46D3B1" strokeWidth="3.2" />
            <circle cx={t0x - barW / 2} cy={yOf(series.pre[series.pre.length - 1].c)} r={bodyW * 0.9 + 3}
              fill="none" stroke="#EAFFF9" strokeWidth="1.6" opacity=".9" />
          </>
        )}
        {showPointer && !sealed && (
          <g style={{ animation: "sa-float 3.4s var(--ease-in-out) infinite" }}>
            <path d={`M${t0x - barW * 2.2} ${zoneTop - 26} L${t0x - barW * 2.2} ${zoneTop - 8}`} stroke="#EAFFF9" strokeWidth="2" strokeLinecap="round" />
            <path d={`M${t0x - barW * 2.2 - 5} ${zoneTop - 14} L${t0x - barW * 2.2} ${zoneTop - 7} L${t0x - barW * 2.2 + 5} ${zoneTop - 14}`} fill="none" stroke="#EAFFF9" strokeWidth="2" strokeLinecap="round" />
            <rect x={t0x - barW * 2.2 - 68} y={zoneTop - 48} width="136" height="20" rx="10" fill="rgba(10,22,40,.92)" stroke="#33C1A1" strokeWidth="1.2" />
            <text x={t0x - barW * 2.2} y={zoneTop - 34} textAnchor="middle" fill="#DFFFF4" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">
              {caption ?? "НАЖМИ НА ЗОНУ ПАДЕНИЯ"}
            </text>
          </g>
        )}
        {pickState === "hit" && (
          <g className="anim-pop">
            <circle cx={t0x - barW * 2} cy={(zoneTop + zoneBot) / 2} r="12" fill="rgba(62,207,142,.22)" stroke={UP} strokeWidth="2" />
            <path d={`M${t0x - barW * 2 - 5} ${(zoneTop + zoneBot) / 2} l3.4 4 6-8`} stroke={UP} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          </g>
        )}
        {pickState === "miss" && (
          <g className="anim-pop">
            {/* ТЗ: после неправильного нажатия показываем цель — стрелка к верной зоне */}
            <circle cx={t0x - barW * 1.2} cy={zoneTop - 34} r="12" fill="rgba(226,96,92,.24)" stroke={DOWN} strokeWidth="2" />
            <path d={`M${t0x - barW * 1.2 - 5} ${zoneTop - 39} l10 10 M${t0x - barW * 1.2 + 5} ${zoneTop - 39} l-10 10`} stroke={DOWN} strokeWidth="2.4" />
            <path d={`M${t0x - barW * 1.2} ${zoneTop - 20} L${t0x - barW * 1.9} ${zoneTop + zoneH / 2}`} stroke="#EAFFF9" strokeWidth="2" strokeDasharray="4 3" />
            <rect x={t0x - barW * 3.6} y={zoneTop} width={barW * 3.4} height={zoneH} rx="6" fill="none" stroke="#46D3B1" strokeWidth="2.6"
              style={{ animation: "sa-pulse-ring 1.6s var(--ease-out) 3", transformBox: "fill-box", transformOrigin: "center" }} />
          </g>
        )}

        {/* baseline time axis */}
        <line x1={padLeft} x2={padLeft + plotW} y1={padTop + plotH + 8} y2={padTop + plotH + 8} stroke="#4E7BB0" strokeWidth="1" opacity=".4" />
      </svg>

      {/* scrubbing overlay: speed streaks over the drawing future */}
      {scrubbing && (
        <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: "none" }}>
          {[18, 34, 52, 68, 84].map((top, i) => (
            <span key={top} className="streak absolute" style={{ top: `${top}%`, left: 0, width: "38%", height: 2, background: "linear-gradient(90deg, transparent, #9FF3DC, transparent)", animationDelay: `${i * 90}ms` }} />
          ))}
        </div>
      )}

      {/* market header only — no assetId, no debug labels inside the game screen */}
      <div className="absolute left-2 top-1.5 micro" style={{ opacity: 0.55 }}>
        {symbol} · {tf}
      </div>
    </div>
  );
}

function DepthLadder({
  series, yOf, x0, wdt, cue, up, down,
}: { series: Series; yOf: (p: number) => number; x0: number; wdt: number; cue: CueKind; up: string; down: string }) {
  const rows = Array.from({ length: 12 }, (_, i) => i / 11);
  const whaleAt = 0.34;
  return (
    <g>
      {rows.map((k) => {
        const p = series.hi - (series.hi - series.lo) * k;
        const y = yOf(p);
        const isAsk = k < 0.5;
        const depth = 0.25 + ((Math.sin(k * 9.1) + 1) / 2) * 0.7;
        const isWhale = Math.abs(k - whaleAt) < 0.05 && cue === "whale";
        return (
          <g key={k}>
            <rect x={x0 + (isWhale ? 0 : wdt * (1 - depth))} y={y - 3.6} width={isWhale ? wdt : wdt * depth} height="7" rx="2"
              fill={isWhale ? "#9F8CFF" : isAsk ? down : up} opacity={isWhale ? 0.85 : 0.5} />
            <text x={x0 + wdt / 2} y={y + 3} textAnchor="middle" fill="#EAF3FF" fontSize="7.5" fontFamily="Inter, sans-serif" opacity=".8">
              {formatPrice(p, series.tick)}
            </text>
          </g>
        );
      })}
      {cue === "whale" && (
        <text x={x0 + wdt / 2} y={yOf(series.hi - (series.hi - series.lo) * whaleAt) - 7} textAnchor="middle" fill="#CFC4FF" fontSize="8" fontWeight="700" fontFamily="Inter, sans-serif">
          КИТОВАЯ СТЕНА
        </text>
      )}
      <text x={x0 + 2} y={yOf(series.hi) - 10} fill="#8FA6C6" fontSize="8" fontFamily="Inter, sans-serif">ЗАЯВКИ / СПРОС</text>
    </g>
  );
}

export function formatPrice(p: number, tick: number) {
  if (p >= 1000) return p.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  if (p >= 10) return p.toFixed(tick < 1 ? 1 : 0);
  return p.toFixed(2);
}

export function treatmentOf(assetId: string | undefined): ChartTreatment {
  const t = assetId?.replace("CHT-", "").toLowerCase();
  if (t === "hollow") return "hollow";
  if (t === "depth") return "depth";
  if (t === "impulse") return "impulse";
  return "glow";
}

export function cueOf(assetId: string | undefined): CueKind {
  const c = assetId?.replace("CUE-", "").toLowerCase();
  if (c === "level-dash") return "dash";
  if (c === "whale-band") return "whale";
  if (c === "retest-tray") return "tray";
  return "ring";
}

export function revealClass(assetId: string | undefined) {
  const r = assetId?.replace("REV-", "").toLowerCase();
  if (r === "blinds") return "tr-blinds";
  if (r === "tape") return "tr-tape";
  if (r === "bloom") return "tr-bloom";
  return "tr-iris";
}
