import { useEffect, useRef, useState } from "react";
import type { Candle } from "../game/mvp";

type Mode = "hidden" | "sealed" | "reveal";

interface Props {
  past: Candle[];
  future: Candle[];
  mode: Mode;
  marker?: { index: number; side: string } | null;
  scrub?: number;
  onScrub?: (v: number) => void;
  keyEventIndex?: number;
  invalidationLevel?: number | null;
  interactive?: boolean;
  zoneHighlight?: boolean;
  caption?: string;
  feedback?: string | null;
  onPick?: (index: number) => void;
  reduced?: boolean;
}

const W = 300;
const H = 168;
const PAD = 10;

export default function Chart({
  past,
  future,
  mode,
  marker,
  scrub = 0,
  onScrub,
  keyEventIndex,
  invalidationLevel,
  interactive,
  zoneHighlight,
  caption,
  feedback,
  onPick,
  reduced,
}: Props) {
  const all = mode === "reveal" ? [...past, ...future.slice(0, scrub)] : past;
  const lows = all.map((c) => c.l);
  const highs = all.map((c) => c.h);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const span = max - min || 1;
  const total = Math.max(past.length + (mode === "reveal" ? future.length : 0), past.length);
  const stepX = (W - PAD * 2) / total;
  const y = (v: number) => PAD + (1 - (v - min) / span) * (H - PAD * 2);
  const x = (i: number) => PAD + i * stepX + stepX / 2;
  const bodyW = Math.max(3, stepX * 0.58);
  const t0 = past.length - 1;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [pulseRing, setPulseRing] = useState(true);
  useEffect(() => {
    if (!reduced) return;
    setPulseRing(false);
  }, [reduced]);

  const pick = (e: React.PointerEvent<SVGRectElement>) => {
    if (!interactive || !onPick) return;
    const b = (wrapRef.current ?? e.currentTarget).getBoundingClientRect();
    const ratio = (e.clientX - b.left) / b.width;
    const i = Math.max(0, Math.min(t0, Math.round(ratio * total - 0.5)));
    onPick(i);
  };

  const zoneFrom = Math.max(0, past.length - 6);

  return (
    <div className="relative" ref={wrapRef}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="none">
        {/* линии сетки */}
        {[0.25, 0.5, 0.75].map((p) => (
          <line
            key={p}
            x1={PAD}
            x2={W - PAD}
            y1={PAD + p * (H - PAD * 2)}
            y2={PAD + p * (H - PAD * 2)}
            stroke="rgba(106,126,163,.18)"
            strokeWidth="0.6"
            strokeDasharray="2 6"
          />
        ))}

        {/* зона взаимодействия (tutorial) */}
        {zoneHighlight && (
          <g>
            <rect
              x={x(zoneFrom) - bodyW}
              y={PAD}
              width={x(t0) - x(zoneFrom) + bodyW * 2}
              height={H - PAD * 2}
              fill="var(--accent)"
              opacity="0.1"
            />
            <rect
              x={x(zoneFrom) - bodyW}
              y={PAD}
              width={x(t0) - x(zoneFrom) + bodyW * 2}
              height={H - PAD * 2}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.8"
            />
          </g>
        )}

        {/* фон под свечами */}
        <rect x="0" y="0" width={W} height={H} fill="none" />

        {/* свечи */}
        {all.map((c, i) => {
          const up = c.c >= c.o;
          const col = up ? "#3ecf8e" : "#ef6b62";
          return (
            <g key={i}>
              <line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth="1" opacity="0.85" />
              <rect
                x={x(i) - bodyW / 2}
                y={Math.min(y(c.o), y(c.c))}
                width={bodyW}
                height={Math.max(1.4, Math.abs(y(c.o) - y(c.c)))}
                fill={col}
                opacity="0.95"
                rx="0.6"
              />
            </g>
          );
        })}

        {/* линия печати t0 — график заканчивается в точке решения */}
        <line x1={x(t0)} x2={x(t0)} y1={PAD} y2={H - PAD} stroke="#e0b145" strokeWidth="1" strokeDasharray="3 3" opacity="0.9" />

        {/* маркер решения */}
        {marker && (
          <g>
            <circle cx={x(marker.index)} cy={y(past[marker.index]?.c ?? min)} r="4" fill="#e0b145" stroke="#071018" strokeWidth="1" />
            <path
              d={
                marker.side === "LONG" || marker.side === "SHORT"
                  ? marker.side === "LONG"
                    ? `M${x(marker.index) - 5} ${y(past[marker.index]?.c ?? min) + 14} l5 -7 l5 7 z`
                    : `M${x(marker.index) - 5} ${y(past[marker.index]?.c ?? min) - 14} l5 7 l5 -7 z`
                  : ""
              }
              fill="#e0b145"
            />
          </g>
        )}

        {/* зона инвалидации */}
        {invalidationLevel != null && (
          <g>
            <line x1={PAD} x2={W - PAD} y1={y(invalidationLevel)} y2={y(invalidationLevel)} stroke="#ef6b62" strokeWidth="1" strokeDasharray="5 4" />
            <text x={W - PAD} y={y(invalidationLevel) - 3} textAnchor="end" fontSize="7" fill="#ef6b62">
              СЛОМ
            </text>
          </g>
        )}

        {/* ключевое событие */}
        {mode === "reveal" && keyEventIndex != null && scrub >= keyEventIndex && (
          <g>
            <line x1={x(keyEventIndex)} x2={x(keyEventIndex)} y1={PAD} y2={H - PAD} stroke="#e0b145" strokeWidth="1" opacity="0.8" />
            <circle cx={x(keyEventIndex)} cy={PAD + 6} r="3" fill="#e0b145" />
          </g>
        )}

        {/* фокус-кольцо для первого действия */}
        {interactive && pulseRing && (
          <g>
            <circle cx={x(t0) - 14} cy={y(past[t0].c)} r="9" fill="none" stroke="var(--accent)" strokeWidth="1.4" opacity="0.9">
              {!reduced && <animate attributeName="r" values="9;14;9" dur="2s" repeatCount="indefinite" />}
              {!reduced && <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2s" repeatCount="indefinite" />}
            </circle>
          </g>
        )}

        {/* активная область тапа */}
        {interactive && <rect x="0" y="0" width={W} height={H} fill="transparent" onPointerDown={pick} />}
      </svg>

      {/* подпись области */}
      {caption && (
        <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[9.5px] font-bold tracking-wider text-white">
          {caption}
        </span>
      )}
      {mode === "hidden" && (
        <span className="pointer-events-none absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9.5px] font-bold tracking-wider" style={{ background: "#e0b145", color: "#071018" }}>
          ПЕЧАТЬ · t0
        </span>
      )}
      {mode === "reveal" && (
        <span className="pointer-events-none absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9.5px] font-bold tracking-wider" style={{ background: "var(--accent)", color: "#071018" }}>
          ПЕЧАТЬ СНЯТА · {scrub}/{future.length}
        </span>
      )}

      {/* скраббу времени */}
      {mode === "reveal" && onScrub && (
        <div className="absolute inset-x-2 bottom-1.5">
          <input
            type="range"
            min={0}
            max={future.length}
            step={1}
            value={scrub}
            onChange={(e) => onScrub(parseInt(e.target.value, 10))}
            style={{ ["--fill" as string]: `${(scrub / future.length) * 100}%` }}
            aria-label="Протяжка времени после печати"
          />
        </div>
      )}

      {feedback && (
        <div className="absolute inset-x-2 bottom-2 rounded-xl px-2 py-1.5 text-center text-[10.5px] font-bold" style={{ background: "rgba(10,16,28,.94)", color: "#fff", border: "1px solid var(--accent-line)" }}>
          {feedback}
        </div>
      )}
    </div>
  );
}
