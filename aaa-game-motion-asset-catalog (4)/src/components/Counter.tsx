import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";

/* =====================================================================
   ODOMETER COUNTER — digits roll vertically; whole pill "pops" on change.
   Secret: direction of the roll follows the sign of the change, and the
   pop is fired through animation controls (no remount → rolls survive).
   ===================================================================== */

const Digit = ({ d, dir }: { d: string; dir: 1 | -1 }) => (
  <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-baseline">
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        key={d}
        className="absolute inset-0 flex items-center justify-center"
        initial={{ y: `${dir * 100}%`, opacity: 0, filter: "blur(2px)" }}
        animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
        exit={{ y: `${-dir * 100}%`, opacity: 0, filter: "blur(2px)" }}
        transition={{ type: "spring", stiffness: 520, damping: 32 }}
      >
        {d}
      </motion.span>
    </AnimatePresence>
  </span>
);

export const Counter = ({ value, className, color = "#fff" }: { value: number; className?: string; color?: string }) => {
  const prev = useRef(value);
  const [dir, setDir] = useState<1 | -1>(1);
  const ctl = useAnimationControls();

  useEffect(() => {
    if (value !== prev.current) {
      const up = value > prev.current;
      setDir(up ? 1 : -1);
      prev.current = value;
      ctl.start({
        scale: [1, up ? 1.28 : 0.85, 1],
        color: [color, up ? "#ffe08a" : "#ff8a7a", color],
        transition: { duration: 0.38, ease: [0.34, 1.56, 0.64, 1] },
      });
    }
  }, [value, color, ctl]);

  const str = String(value);
  return (
    <motion.span className={className} style={{ color, display: "inline-flex", lineHeight: 1 }} animate={ctl}>
      {str.split("").map((d, i) => (
        <Digit key={str.length - i} d={d} dir={dir} />
      ))}
    </motion.span>
  );
};

export default Counter;
