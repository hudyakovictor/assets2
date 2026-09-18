import { useEffect, useRef, useState, type ReactNode } from "react";
import { sfx } from "./fx";

/** Tactile button: scales on press, plays sound + haptic. */
export function PressButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  sound = "tap",
  className = "",
  style,
  full = true,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "gold";
  disabled?: boolean;
  sound?: keyof typeof sfx | null;
  className?: string;
  style?: React.CSSProperties;
  full?: boolean;
}) {
  return (
    <button
      className={`press-btn press-${variant} ${full ? "w-full" : ""} ${className}`}
      disabled={disabled}
      style={style}
      onClick={() => {
        if (disabled) return;
        if (sound) sfx[sound]();
        onClick?.();
      }}
    >
      <span className="press-btn-label">{children}</span>
    </button>
  );
}

/** Number that ticks up with sound. */
export function CountUp({ to, dur = 900, prefix = "", className = "", onEach }: { to: number; dur?: number; prefix?: string; className?: string; onEach?: () => void }) {
  const [v, setV] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const nv = Math.round(from + (to - from) * e);
      setV((prev) => {
        if (nv !== prev) onEach?.();
        return nv;
      });
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);
  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {v}
    </span>
  );
}

/** Confetti / particle burst overlay. */
export function Burst({ x = 50, y = 40, colors, count = 26, run }: { x?: number; y?: number; colors?: string[]; count?: number; run: number }) {
  const cs = colors ?? ["#3ad9e6", "#ffc94d", "#5fd39a", "#8b7bff", "#ffffff"];
  const parts = Array.from({ length: count }, (_, i) => {
    const ang = (Math.PI * 2 * i) / count + (run % 7) * 0.3;
    const dist = 60 + ((i * 37) % 90);
    return {
      dx: Math.cos(ang) * dist,
      dy: Math.sin(ang) * dist - 20,
      c: cs[i % cs.length],
      s: 4 + ((i * 13) % 6),
      r: (i * 47) % 360,
    };
  });
  return (
    <div key={run} className="burst" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden>
      {parts.map((p, i) => (
        <span
          key={i}
          style={
            {
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--r": `${p.r}deg`,
              width: p.s,
              height: p.s * 1.6,
              background: p.c,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Toast that slides down from top. */
export function Toast({ msg, run }: { msg: string; run: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!msg) return;
    setShow(true);
    const id = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(id);
  }, [run, msg]);
  if (!msg) return null;
  return <div className={`toast ${show ? "toast-in" : "toast-out"}`}>{msg}</div>;
}
