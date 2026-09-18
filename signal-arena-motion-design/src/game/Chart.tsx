import { useMemo } from 'react';
import { CANDLES, T0, type Candle } from '../data';

/* =========================================================================
   SINGLE CHART PROPORTION STANDARD
   One fixed height for every decision-bearing chart across the whole game and
   the terminal. Previously 26 different heights (96–286) were in use, so the
   chart resized between steps of the same run.

   Height is deliberately small: the decision needs structure, the last swing
   and t0 — not vertical size. Anything larger only pushes the action layer
   (skill cards + decisions) off screen.
   ========================================================================= */
export const CHART_H = 146;       // universal — every decision chart
export const CHART_H_MINI = 78;   // non-decision, decorative context only

export interface ChartProps {
  /** Decorative context strip. Never used for decisions. */
  mini?: boolean;
  revealed?: number;        // how many candles past T0 are drawn
  target?: number | null;   // tutorial: index to highlight
  hit?: 'none' | 'ok' | 'miss';
  onPick?: (i: number) => void;
  sealLine?: boolean;
  grid?: 'full' | 'soft' | 'none';
  label?: string;
}

export default function Chart({
  mini = false,
  revealed = 0,
  target = null, hit = 'none', onPick, sealLine = true, grid = 'soft', label,
}: ChartProps) {
  const W = 360;
  const h = mini ? CHART_H_MINI : CHART_H;
  const count = T0 + Math.min(revealed, CANDLES.length - T0);
  const data: Candle[] = CANDLES.slice(0, count);
  /* No volume pane: volume is delivered as a fact card, not as a second chart. */
  const priceH = h;

  const { hi, lo } = useMemo(() => {
    let hi = -Infinity, lo = Infinity;
    for (const c of data) { if (c.h > hi) hi = c.h; if (c.l < lo) lo = c.l; }
    const pad = (hi - lo) * 0.10;
    return { hi: hi + pad, lo: lo - pad };
  }, [count]);


  /* Before Seal the historical series physically ends at t0. We do not reserve,
     mask or hint at a rectangular "future" area. Reveal reflows the timeline. */
  const slot = W / (revealed > 0 ? CANDLES.length + 1 : T0 + 1);
  /* Narrower bodies: readability comes from structure, not from bulk. */
  const bw = Math.max(3.2, slot * 0.42);
  const y = (p: number) => ((hi - p) / (hi - lo)) * priceH;
  const x = (i: number) => slot * (i + 1);

  const t0x = x(T0 - 1) + slot / 2;
  const lastVisible = data[Math.max(0, data.length - 1)];

  return (
    <div className="chart-frame relative w-full shrink-0 overflow-hidden rounded-[15px] g-inset"
      style={{ height: h }}>
      {/* grid */}
      {grid !== 'none' && (
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none" aria-hidden>
          {[0.2, 0.4, 0.6, 0.8].map(f => (
            <line key={f} x1={0} x2={W} y1={priceH * f} y2={priceH * f}
              stroke="rgba(120,190,210,1)" strokeOpacity={grid === 'full' ? 0.1 : 0.055} strokeWidth={0.7} />
          ))}
          {grid === 'full' && [0.25, 0.5, 0.75].map(f => (
            <line key={'v' + f} y1={0} y2={priceH} x1={W * f} x2={W * f}
              stroke="rgba(120,190,210,1)" strokeOpacity={0.055} strokeWidth={0.7} />
          ))}
        </svg>
      )}

      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none">
        {/* candles */}
        {data.map((c, i) => {
          const up = c.c >= c.o;
          const col = up ? '#2E7F5C' : '#C56861';
          const cx = x(i);
          const bodyTop = y(Math.max(c.o, c.c));
          const bodyH = Math.max(1.6, Math.abs(y(c.o) - y(c.c)));
          const isFut = i >= T0;
          const isTgt = target === i;
          return (
            <g key={i} opacity={isFut ? 1 : 0.98}
              className={isFut ? 'a-pop' : undefined}
              style={isFut ? { animationDelay: `${(i - T0) * 55}ms` } : undefined}>
              <line x1={cx} x2={cx} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth={1.3} strokeLinecap="round"
                opacity={isTgt ? 1 : 0.85} />
              <rect x={cx - bw / 2} y={bodyTop} width={bw} height={bodyH} rx={1.6}
                fill={up ? col : 'none'} stroke={col} strokeWidth={up ? 0 : 1.5}
                opacity={isTgt ? 1 : 0.95} />
              {!up && <rect x={cx - bw / 2} y={bodyTop} width={bw} height={bodyH} rx={1.6} fill={col} opacity={0.3} />}
            </g>
          );
        })}



        {/* decision line at t0 */}
        {sealLine && (
          <>
            <line x1={t0x} x2={t0x} y1={4} y2={priceH} stroke="#2fe0c0" strokeWidth={1.4}
              strokeDasharray="5 4" opacity={0.85} />
            <circle cx={t0x} cy={y(CANDLES[T0 - 1].c)} r={3.6} fill="#2fe0c0" />
            <circle cx={t0x} cy={y(CANDLES[T0 - 1].c)} r={7} fill="none" stroke="#2fe0c0" strokeWidth={1} opacity={0.4} className="a-breathe" />
          </>
        )}

        {/* Key historical event appears only after the relevant candles exist. */}
        {revealed >= 7 && (
          <g className="a-pop">
            <line x1={x(T0 + 3)} x2={x(T0 + 3)} y1={18} y2={priceH - 8}
              stroke="#C56861" strokeWidth={1} strokeDasharray="3 3" opacity={0.65} />
            <circle cx={x(T0 + 3)} cy={22} r={3.2} fill="#C56861" />
          </g>
        )}

        {/* tutorial target focus ring */}
        {target !== null && target < count && (
          <g className="a-breathe">
            <rect x={x(target) - bw / 2 - 5} y={y(CANDLES[target].h) - 6}
              width={bw + 10} height={y(CANDLES[target].l) - y(CANDLES[target].h) + 12} rx={5}
              fill="none"
              stroke={hit === 'ok' ? '#2fe0c0' : hit === 'miss' ? '#ff5a72' : '#e9c46a'}
              strokeWidth={1.8} />
            <path d={`M${x(target) + 18} ${Math.max(24, y(CANDLES[target].h) - 14)} L${x(target) + 5} ${y(CANDLES[target].h) - 3}`}
              stroke={hit === 'ok' ? '#2fe0c0' : hit === 'miss' ? '#ff5a72' : '#e9c46a'} strokeWidth={1.4} />
            <rect x={x(target) + 18} y={Math.max(10, y(CANDLES[target].h) - 24)} width={35} height={14} rx={4}
              fill="rgba(5,10,18,.92)" stroke={hit === 'ok' ? '#2fe0c0' : hit === 'miss' ? '#ff5a72' : '#e9c46a'} strokeWidth={0.8} />
            <text x={x(target) + 35.5} y={Math.max(20, y(CANDLES[target].h) - 14)} textAnchor="middle"
              fontSize={6.5} fontWeight={800} fill={hit === 'ok' ? '#2fe0c0' : hit === 'miss' ? '#ff7a8e' : '#e9c46a'}>
              {hit === 'ok' ? 'ВЕРНО' : hit === 'miss' ? 'ЕЩЁ РАЗ' : 'ЦЕЛЬ'}
            </text>
          </g>
        )}
      </svg>

      {/* tap layer for tutorial */}
      {onPick && (
        <div className="absolute inset-0 flex">
          {CANDLES.slice(0, count).map((_, i) => (
            <button key={i} onClick={() => onPick(i)} aria-label={`Свеча ${i + 1}`}
              className="h-full focus-ring" style={{ width: `${100 / count}%` }} />
          ))}
        </div>
      )}

      {/* header overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-[7px]">
        <span className="font-mono text-[8.5px] font-extrabold tracking-wide text-[#8fa7b8]">
          {label ?? 'BTC/USDT · 15M'}
        </span>
        <span className="tnum rounded-[6px] bg-[#0a1724]/80 px-[5px] py-[2px] font-mono text-[9px] font-extrabold"
          style={{ color: lastVisible && lastVisible.c >= lastVisible.o ? '#4bd6a8' : '#e08b84' }}>
          {lastVisible ? lastVisible.c.toFixed(0) : '—'}
        </span>
      </div>

      {revealed === 0 && (
        <span className="pointer-events-none absolute bottom-[6px] right-[8px] font-mono text-[7.5px] font-extrabold uppercase tracking-[.16em] text-[#2fe0c0]/50">
          t0 · решение здесь
        </span>
      )}

      {revealed > 0 && revealed < CANDLES.length - T0 && (
        <span className="pointer-events-none absolute inset-y-0 w-[2px] bg-[#2fe0c0]/55 shadow-[0_0_12px_#2fe0c0]"
          style={{ left: `${(x(T0 + revealed - 1) / W) * 100}%`, transition: 'left 90ms linear' }} />
      )}
    </div>
  );
}
