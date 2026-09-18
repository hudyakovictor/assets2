import { useEffect, useRef, useState } from "react";

/** Animated tabular-number count-up used for XP / coins / score bars — pure motion, no assets. */
export function CountUp({ value, duration = 700, format }: { value: number; duration?: number; format?: (n: number) => string }) {
  const [v, setV] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const f0 = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const x = Math.min(1, (t - start) / duration);
      const e = 1 - Math.pow(1 - x, 3);
      setV(Math.round(f0 + (value - f0) * e));
      if (x < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span className="count">{format ? format(v) : v}</span>;
}
