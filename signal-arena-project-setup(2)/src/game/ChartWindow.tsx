import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Round, Candle } from "./scenarios";
import { fmtPrice } from "./scenarios";
import { IcCandles, IcNews, IcBook, IcWhale, IcCalendar, IcChat, IcPlus } from "./icons";
import { sfx } from "./fx";

type Tab = "candles" | "book" | "news" | "whale" | "calendar" | "chat";
type Mode = "pre" | "reveal" | "full";
export type RevealFx = "scrub" | "wipe" | "flash";

export function ChartWindow({
  round,
  mode,
  onRevealEnd,
  height,
  revealFx = "scrub",
  compact,
  bare = false,
  defaultTab = "candles",
}: {
  round: Round;
  mode: Mode;
  onRevealEnd?: () => void;
  height?: number | string;
  revealFx?: RevealFx;
  compact?: boolean;
  bare?: boolean;
  defaultTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  // bare = single fixed view without the macOS tab strip (for split layouts)
  if (bare) {
    return (
      <div className="chart-card bare">
        <div className="chart-body" style={{ height, margin: 0, borderRadius: 18 }}>
          {defaultTab === "book" ? (
            <BookView round={round} />
          ) : defaultTab === "whale" ? (
            <BookView round={round} whaleFocus />
          ) : (
            <Candles round={round} mode={mode} onRevealEnd={onRevealEnd} revealFx={revealFx} />
          )}
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="chart-card compact">
        <div className="chart-body" style={{ height, margin: 6 }}>
          <Candles round={round} mode={mode} onRevealEnd={onRevealEnd} revealFx={revealFx} />
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-tabs">
        <div className="traffic">
          <span style={{ background: "#ff5f57" }} />
          <span style={{ background: "#febc2e" }} />
          <span style={{ background: "#28c840" }} />
        </div>
        <div className="tab-strip">
          <TabBtn on={tab === "candles"} onClick={() => setTab("candles")} title="Свечной график">
            <IcCandles size={16} />
          </TabBtn>
          <TabBtn on={tab === "news"} onClick={() => setTab("news")} title="Новости">
            <IcNews size={16} />
          </TabBtn>
          <TabBtn on={tab === "book"} onClick={() => setTab("book")} title="Стакан ордеров">
            <IcBook size={16} />
          </TabBtn>
          <TabBtn on={tab === "whale"} onClick={() => setTab("whale")} title="Китовая активность">
            <IcWhale size={16} />
          </TabBtn>
          <TabBtn on={tab === "calendar"} onClick={() => setTab("calendar")} title="Календарь">
            <IcCalendar size={16} />
          </TabBtn>
          <TabBtn on={tab === "chat"} onClick={() => setTab("chat")} title="Чат трейдеров">
            <IcChat size={16} />
          </TabBtn>
          <TabBtn on={false} onClick={() => sfx.tap()} plus title="Добавить индикатор">
            <IcPlus size={16} />
          </TabBtn>
        </div>
      </div>
      <div className="chart-body" style={{ height }}>
        {tab === "candles" && (
          <Candles round={round} mode={mode} onRevealEnd={onRevealEnd} revealFx={revealFx} />
        )}
        {tab === "book" && <BookView round={round} />}
        {tab === "whale" && <BookView round={round} whaleFocus />}
        {(tab === "news" || tab === "calendar" || tab === "chat") && (
          <Placeholder tab={tab} round={round} />
        )}
      </div>
    </div>
  );
}

function TabBtn({
  on,
  onClick,
  children,
  plus,
  title,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  plus?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      className={`tab-btn ${on ? "on" : ""} ${plus ? "plus" : ""}`}
      onClick={() => {
        sfx.tap();
        onClick();
      }}
      title={title}
    >
      {children}
    </button>
  );
}

/* ---------------- CANDLES (With Volume & Interactive Crosshair) ---------------- */
function Candles({
  round,
  mode,
  onRevealEnd,
  revealFx = "scrub",
}: {
  round: Round;
  mode: Mode;
  onRevealEnd?: () => void;
  revealFx?: RevealFx;
}) {
  // unique id namespace so two charts on screen don't collide on gradient/filter refs
  const uid = useId().replace(/[:]/g, "");
  const upId = `up-${uid}`;
  const dnId = `dn-${uid}`;
  const cgId = `cg-${uid}`;
  const all = round.candles;
  const t0 = round.t0;
  const total = all.length;
  const [shown, setShown] = useState(mode === "full" ? total : t0 + 1);
  const [scrub, setScrub] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const raf = useRef(0);
  const ended = useRef(false);
  const lastBeep = useRef(0);

  useEffect(() => {
    if (mode !== "reveal") {
      setShown(mode === "full" ? total : t0 + 1);
      return;
    }
    const dur = 2200;
    const start = performance.now() + 350;
    setScrub(true);
    ended.current = false;
    const step = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / dur));
      const e = 1 - Math.pow(1 - p, 3);
      setShown(t0 + 1 + Math.round(e * (total - t0 - 1)));
      if (now - lastBeep.current > 95 && p > 0 && p < 1) {
        sfx.scrub();
        lastBeep.current = now;
      }
      if (p < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        setScrub(false);
        if (!ended.current) {
          ended.current = true;
          onRevealEnd?.();
        }
      }
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line
  }, [mode]);

  const W = 320;
  const H = 150;
  const priceH = 115; // reserved top for candles
  const volH = 30; // reserved bottom for volume bars

  const nVis = mode === "pre" ? t0 + 1 : total;
  const range = useMemo(() => {
    const vis = all.slice(0, nVis);
    const lo = Math.min(...vis.map((c) => c.l));
    const hi = Math.max(...vis.map((c) => c.h));
    const pad = (hi - lo) * 0.12 || hi * 0.02;
    return { lo: lo - pad, hi: hi + pad };
  }, [all, nVis]);

  const maxVol = useMemo(() => {
    const vis = all.slice(0, nVis);
    return Math.max(...vis.map((c) => c.vol)) * 1.2 || 1;
  }, [all, nVis]);

  const slot = W / (nVis + 1);
  const x = (i: number) => slot * (i + 0.7);
  const y = (v: number) => priceH - ((v - range.lo) / (range.hi - range.lo)) * priceH;
  const yVol = (vol: number) => H - (vol / maxVol) * volH;

  const vis = all.slice(0, shown);
  const activeCandle = hoverIndex !== null && hoverIndex < vis.length ? vis[hoverIndex] : vis[vis.length - 1];
  const t0x = x(t0);
  const supportY = y(Math.min(...all.slice(Math.max(0, t0 - 8), t0 + 1).map((c) => c.l)) * 1.001);

  const handlePointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.max(0, Math.min(vis.length - 1, Math.round(px / slot - 0.7)));
    setHoverIndex(idx);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", touchAction: "none" }}>
      {/* Chart Header */}
      <div className="chart-head">
        <span className="chart-sym">{round.asset}</span>
        <span className="chart-tf">· {round.tf}</span>
        {activeCandle && (
          <span className="mono text-xs font-bold ml-2" style={{ color: activeCandle.c >= activeCandle.o ? "#48e39a" : "#ff7a6e" }}>
            {fmtPrice(activeCandle.c)}
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        style={{ display: "block" }}
        onPointerDown={handlePointer}
        onPointerMove={handlePointer}
        onPointerUp={() => setHoverIndex(null)}
        onPointerLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={upId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#48e39a" />
            <stop offset="1" stopColor="#2fae76" />
          </linearGradient>
          <linearGradient id={dnId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff7a6e" />
            <stop offset="1" stopColor="#d8544a" />
          </linearGradient>
          <filter id={cgId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((p) => (
          <line
            key={p}
            x1="0"
            x2={W}
            y1={priceH * p}
            y2={priceH * p}
            stroke="rgba(255,255,255,.05)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Support Level Line */}
        <line
          x1="0"
          x2={W}
          y1={supportY}
          y2={supportY}
          stroke="rgba(62,199,201,.55)"
          strokeWidth="1.4"
          strokeDasharray="5 4"
          vectorEffect="non-scaling-stroke"
        />

        {/* Shaded future zone before reveal */}
        {mode !== "full" && (
          <rect x={t0x + slot / 2} y="0" width={W - t0x} height={H} fill="rgba(8,12,24,.55)" />
        )}

        {/* Candles & Volume bars */}
        {vis.map((c: Candle, i) => {
          const up = c.c >= c.o;
          const bw = Math.max(3.2, slot * 0.65);
          const future = i > t0;
          const delay = mode !== "full" && !future ? Math.min(i * 10, 260) : 0;
          const volTop = yVol(c.vol);

          return (
            <g
              key={i}
              filter={future ? `url(#${cgId})` : undefined}
              style={{
                transformOrigin: `${x(i)}px ${H}px`,
                animation: mode !== "full" && !future ? `growUp .4s ease ${delay}ms both` : undefined,
              }}
            >
              {/* Volume Bar */}
              <rect
                x={x(i) - bw / 2}
                y={volTop}
                width={bw}
                height={H - volTop}
                fill={up ? "rgba(72, 227, 154, 0.35)" : "rgba(255, 122, 110, 0.35)"}
                rx="1"
              />

              {/* Candle Wick */}
              <line
                x1={x(i)}
                x2={x(i)}
                y1={y(c.h)}
                y2={y(c.l)}
                stroke={up ? "#48e39a" : "#ff7a6e"}
                strokeWidth="1.3"
                vectorEffect="non-scaling-stroke"
              />

              {/* Candle Body */}
              <rect
                x={x(i) - bw / 2}
                y={y(Math.max(c.o, c.c))}
                width={bw}
                height={Math.max(2, Math.abs(y(c.o) - y(c.c)))}
                rx="1.5"
                fill={up ? `url(#${upId})` : `url(#${dnId})`}
              />
            </g>
          );
        })}

        {/* Crosshair when hovering / touching */}
        {hoverIndex !== null && hoverIndex < vis.length && (
          <g pointerEvents="none">
            <line
              x1={x(hoverIndex)}
              x2={x(hoverIndex)}
              y1="0"
              y2={H}
              stroke="rgba(62,199,201,.7)"
              strokeWidth="1"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={x(hoverIndex)}
              cy={y(vis[hoverIndex].c)}
              r="4"
              fill="#3ec7c9"
            />
          </g>
        )}

        {/* t0 Line */}
        <line
          x1={t0x}
          x2={t0x}
          y1="0"
          y2={priceH}
          stroke="#3ec7c9"
          strokeWidth="1.6"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />

        {/* Current price reticle on last candle */}
        <circle
          cx={x(shown - 1)}
          cy={y(vis[vis.length - 1].c)}
          r="9"
          fill="none"
          stroke="#3ec7c9"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={x(shown - 1)}
          cy={y(vis[vis.length - 1].c)}
          r="14"
          fill="none"
          stroke="#3ec7c9"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          opacity="0.5"
          style={{ animation: "pulseRing 1.8s ease-out infinite" }}
        />
      </svg>

      {/* Reveal FX overlays */}
      {scrub && (
        <>
          {revealFx === "scrub" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg,transparent 42%,rgba(62,199,201,.28) 50%,transparent 58%)",
                animation: "scan .9s linear infinite",
                mixBlendMode: "screen",
                pointerEvents: "none",
              }}
            />
          )}
          {revealFx === "wipe" && (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: 3,
                left: `${((shown - 1) / (total - 1)) * 100}%`,
                background: "#3ec7c9",
                boxShadow: "0 0 16px #3ec7c9",
                pointerEvents: "none",
              }}
            />
          )}
          {revealFx === "flash" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#3ec7c9",
                opacity: 0.1,
                animation: "t0flash .4s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
          )}
          <div style={{ position: "absolute", right: 10, bottom: 8, color: "#3ec7c9" }}>
            <svg width="20" height="12" viewBox="0 0 20 12">
              <path fill="currentColor" d="M0 1l7 5-7 5zM9 1l7 5-7 5z" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- ORDER BOOK (Pixel Perfect Matching Image 1 & 2) ---------------- */
function BookView({ round }: { round: Round; whaleFocus?: boolean }) {
  const { book } = round;
  return (
    <div className="book">
      <div className="book-head">
        <span className="chart-sym">{round.asset}</span>
        <span className="spread-pill">СПРЕД {book.spread}</span>
      </div>
      <div className="book-rows">
        {book.asks.map((a, i) => (
          <div key={`a${i}`} className="book-bar-container">
            <div
              className="book-bar ask"
              style={{
                width: `${Math.min(96, 52 + (3 - i) * 15)}%`,
              }}
            >
              <span className="book-bar-label">{fmtPrice(a.price)}</span>
            </div>
          </div>
        ))}

        {/* Whale Wall Strip — only when a whale is actually present in the scenario */}
        {book.whaleSide ? (
          <div className="whale-wall">
            <IcWhale size={16} />
            <span>КИТОВАЯ СТЕНА · {book.whaleSide === "ask" ? "ПРОДАЖА" : "ПОКУПКА"}</span>
          </div>
        ) : (
          <div className="book-bar-container" style={{ opacity: 0.5 }}>
            <span className="spread-pill">крупных стен нет</span>
          </div>
        )}

        {book.bids.map((b, i) => (
          <div key={`b${i}`} className="book-bar-container">
            <div
              className="book-bar bid"
              style={{
                width: `${Math.min(96, 52 + (3 - i) * 15)}%`,
              }}
            >
              <span className="book-bar-label">{fmtPrice(b.price)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- PLACEHOLDER TABS ---------------- */
function Placeholder({ tab, round }: { tab: Tab; round: Round }) {
  const map: Record<string, { title: string; lines: string[] }> = {
    news: {
      title: "Лента новостей",
      lines: [
        round.coach,
        "Нет крупных макро-событий в ближайшие 2 часа.",
        "Фандинг нейтральный (0.01%), открытый интерес стабилен.",
      ],
    },
    calendar: {
      title: "Экономический календарь",
      lines: [
        "Сегодня: данных по инфляции нет.",
        "Четверг 15:30 — заседание ФРС и решение по ставке.",
      ],
    },
    chat: {
      title: "Чат трейдеров Арены",
      lines: [
        "— Смотрите на сопротивление 67 840, там сильный продавец.",
        "— Жду ретест снизу, без объёма не вхожу.",
        "— Китовая стена держит цену уже третий час.",
      ],
    },
  };
  const d = map[tab];
  return (
    <div className="placeholder">
      <div className="chart-sym" style={{ marginBottom: 8 }}>
        {d.title}
      </div>
      {d.lines.map((l, i) => (
        <div key={i} className="ph-line">
          {l}
        </div>
      ))}
    </div>
  );
}
