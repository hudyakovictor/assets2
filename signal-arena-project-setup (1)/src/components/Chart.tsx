import { useEffect, useMemo, useRef, useState } from "react";
import type { ArenaPhase, ChartPreset, MotionPreset, RevealPreset, Scenario } from "../data/pages";

type Props = {
  sc: Scenario;
  phase: ArenaPhase;
  preset: ChartPreset;
  reveal: RevealPreset;
  motion: MotionPreset;
  revealed: boolean; // after Seal
  onRevealDone?: () => void;
  onTargetTap?: (hit: boolean) => void;
  targetLabel?: string;
  feedback?: "hit" | "miss" | null;
  showZones?: boolean;
  zoneMode?: "drop" | "level";
};

const DUR: Record<MotionPreset, number> = { calm: 2600, snappy: 1400, cinematic: 3600, arcade: 1800 };

export function Chart(p: Props) {
  const { sc, phase, preset, reveal, motion, revealed } = p;
  const W = 320, H = 180, padL = 6, padR = 30, padT = 10, padB = 18;
  const n = sc.candles.length;
  const [prog, setProg] = useState(0); // 0..1 across future candles
  const raf = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    if (!revealed) { setProg(0); return; }
    const start = performance.now();
    const dur = DUR[motion];
    const tick = (t: number) => {
      const x = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - x, 3);
      setProg(e);
      if (x < 1) raf.current = requestAnimationFrame(tick);
      else p.onRevealDone?.();
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, motion, sc]);

  const visibleCount = revealed ? sc.t0 + Math.round(prog * (n - sc.t0)) : sc.t0;
  const dom = useMemo(() => {
    const all = sc.candles.slice(0, revealed ? n : sc.t0);
    const lo = Math.min(...all.map((c) => c.l)), hi = Math.max(...all.map((c) => c.h));
    return { lo: lo - (hi - lo) * 0.08, hi: hi + (hi - lo) * 0.08 };
  }, [sc, revealed, n]);
  const x = (i: number) => padL + ((W - padL - padR) * (i + 0.5)) / n;
  const y = (v: number) => padT + ((dom.hi - v) / (dom.hi - dom.lo)) * (H - padT - padB);
  const cw = ((W - padL - padR) / n) * 0.62;
  const mono = preset === "candles-mono";
  const up = mono ? "#9beaf3" : "var(--good)", dn = mono ? "#5a6fa3" : "var(--bad)";
  const tx = x(sc.t0 - 0.5);

  const [z0, z1] = p.zoneMode === "level" ? [Math.max(0, sc.dropZone[0] - 4), sc.dropZone[1]] : sc.dropZone;
  const zoneCandles = sc.candles.slice(z0, z1 + 1);
  const zTop = Math.max(...zoneCandles.map((c) => c.h)), zBot = Math.min(...zoneCandles.map((c) => c.l));
  const isTarget = phase === "target" || (phase === "feedback" && !!p.feedback);
  const lastVisible = sc.candles[visibleCount - 1];
  const eventIdx = n - 1;

  const linePath = () => sc.candles.slice(0, visibleCount).map((c, i) => `${i ? "L" : "M"}${x(i)},${y(c.c)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block", overflow: "hidden" }} onClick={(e) => {
      if (phase !== "target" || !p.onTargetTap) return;
      const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * W;
      const hit = px >= x(z0) - cw && px <= x(z1) + cw;
      p.onTargetTap(hit);
    }}>
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--acc)" stopOpacity=".45" /><stop offset="1" stopColor="var(--acc)" stopOpacity="0" /></linearGradient>
        <linearGradient id="fut" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity=".05" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <clipPath id="wipe"><rect x="0" y="0" width={revealed && reveal === "wipe" ? tx + (W - tx) * prog : W} height={H} /></clipPath>
      </defs>
      {/* grid */}
      {[0.2, 0.4, 0.6, 0.8].map((g) => <line key={g} x1={padL} x2={W - padR} y1={padT + g * (H - padT - padB)} y2={padT + g * (H - padT - padB)} stroke="rgba(255,255,255,.06)" />)}
      {/* future timeline ticks only — no closed block */}
      {!revealed && Array.from({ length: n - sc.t0 }, (_, i) => <line key={i} x1={x(sc.t0 + i)} x2={x(sc.t0 + i)} y1={H - padB + 4} y2={H - padB + 8} stroke="rgba(255,255,255,.14)" />)}
      {/* zones */}
      {(p.showZones || isTarget) && (
        <g className={isTarget ? "" : ""}>
          <rect x={x(z0) - cw} y={y(zTop) - 4} width={x(z1) - x(z0) + cw * 2} height={y(zBot) - y(zTop) + 8} rx={8}
            fill={p.feedback === "miss" ? "rgba(232,112,95,.16)" : p.feedback === "hit" ? "rgba(95,211,154,.22)" : "rgba(255,201,77,.14)"}
            stroke={p.feedback === "miss" ? "var(--bad)" : p.feedback === "hit" ? "var(--good)" : "var(--warm)"} strokeWidth={1.5} strokeDasharray={p.feedback ? undefined : "4 3"} />
          {phase === "target" && (
            <>
              <circle cx={x((z0 + z1) / 2)} cy={(y(zTop) + y(zBot)) / 2} r={16} fill="none" stroke="var(--warm)" strokeWidth={2} className="pulse-ring" style={{ transformOrigin: `${x((z0 + z1) / 2)}px ${(y(zTop) + y(zBot)) / 2}px`, transformBox: "view-box" }} />
              <g className="pointer" style={{ transformBox: "view-box" }}>
                <path d={`M${x((z0 + z1) / 2) + 10},${(y(zTop) + y(zBot)) / 2 + 12} l0,18 l5,-4 l4,8 l4,-2 l-4,-8 l6,-1 z`} fill="#fff" stroke="#12182c" strokeWidth={1.2} />
              </g>
            </>
          )}
          {p.targetLabel && (
            <g>
              <rect x={Math.min(x(z0) - cw, W - 130)} y={Math.max(2, y(zTop) - 22)} width={126} height={16} rx={8} fill="#fff" />
              <text x={Math.min(x(z0) - cw, W - 130) + 63} y={Math.max(2, y(zTop) - 22) + 11} fontSize={8.5} fontWeight={700} fill="#12182c" textAnchor="middle">{p.targetLabel}</text>
            </g>
          )}
        </g>
      )}
      {/* candles */}
      <g clipPath="url(#wipe)" filter={preset === "candles-glow" ? "url(#glow)" : undefined}>
        {preset === "line-area" ? (
          <>
            <path d={`${linePath()} L${x(visibleCount - 1)},${H - padB} L${x(0)},${H - padB} Z`} fill="url(#area)" />
            <path d={linePath()} fill="none" stroke="var(--acc)" strokeWidth={2} strokeLinejoin="round" />
          </>
        ) : (
          sc.candles.slice(0, visibleCount).map((c, i) => {
            const bull = c.c >= c.o;
            const col = bull ? up : dn;
            const inZone = isTarget && i >= z0 && i <= z1;
            const future = i >= sc.t0;
            const k = i - sc.t0;
            const delay = reveal === "pulse" ? `${k * 40}ms` : reveal === "shutter" ? `${Math.floor(k / 3) * 120}ms` : "0ms";
            return (
              <g key={i} className={future && (reveal === "pulse" || reveal === "shutter") ? "pop" : undefined} style={{ animationDelay: delay, transformOrigin: `${x(i)}px ${y(c.c)}px`, transformBox: "view-box", "--dur": ".35s" } as React.CSSProperties} opacity={isTarget && !inZone ? 0.45 : 1}>
                <line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth={1.2} />
                <rect x={x(i) - cw / 2} y={y(Math.max(c.o, c.c))} width={cw} height={Math.max(1.5, Math.abs(y(c.o) - y(c.c)))} rx={1.2} fill={col} />
              </g>
            );
          })
        )}
      </g>
      {/* t0 line */}
      <line x1={tx} x2={tx} y1={padT - 4} y2={H - padB + 2} stroke="var(--acc)" strokeWidth={1.2} strokeDasharray="3 3" opacity={revealed ? 0.5 : 1} />
      <rect x={tx - 10} y={H - padB + 3} width={20} height={12} rx={6} fill="var(--acc)" />
      <text x={tx} y={H - padB + 12} fontSize={8} fontWeight={700} fill="#04222a" textAnchor="middle">t0</text>
      {/* scrub head */}
      {revealed && reveal === "scrub" && prog < 1 && lastVisible && (
        <g>
          <line x1={x(visibleCount - 1)} x2={x(visibleCount - 1)} y1={padT} y2={H - padB} stroke="#fff" strokeWidth={1} opacity={0.6} />
          <circle cx={x(visibleCount - 1)} cy={y(lastVisible.c)} r={4} fill="#fff" />
        </g>
      )}
      {/* current price tag */}
      {lastVisible && (
        <g>
          <rect x={W - padR + 2} y={y(lastVisible.c) - 7} width={padR - 4} height={14} rx={4} fill={lastVisible.c >= lastVisible.o ? up : dn} />
          <text x={W - padR / 2} y={y(lastVisible.c) + 3.5} fontSize={7.5} fontWeight={700} fill="#04222a" textAnchor="middle">{lastVisible.c.toFixed(0)}</text>
        </g>
      )}
      {/* key event marker */}
      {revealed && prog >= 1 && (
        <g style={{ transformBox: "view-box", transformOrigin: `${x(eventIdx)}px ${y(sc.candles[eventIdx].c)}px` }}>
          <circle cx={x(eventIdx)} cy={y(sc.candles[eventIdx].c)} r={9} fill="none" stroke="var(--warm)" strokeWidth={2} className="pulse-ring" />
          <circle cx={x(eventIdx)} cy={y(sc.candles[eventIdx].c)} r={3} fill="var(--warm)" className="pop" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2;
            return <circle key={i} className="pop" style={{ animationDelay: `${i * 30}ms`, transformBox: "view-box", transformOrigin: `${x(eventIdx)}px ${y(sc.candles[eventIdx].c)}px` }} cx={x(eventIdx) + Math.cos(a) * 14} cy={y(sc.candles[eventIdx].c) + Math.sin(a) * 14} r={1.4} fill="#fff" opacity={0.85} />;
          })}
        </g>
      )}
    </svg>
  );
}
