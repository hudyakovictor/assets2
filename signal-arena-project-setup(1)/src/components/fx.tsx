import { motion } from "framer-motion";

/* Ambient aurora + grain, sits behind every screen. Pure CSS/SVG — no bitmap assets. */
export function Ambient({ accent = "#35e0c8" }: { accent?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-1/4 -top-1/4 h-[70%] w-[90%] rounded-full blur-3xl"
        style={{ background: accent, opacity: 0.12 }}
        animate={{ x: [0, 30, -10, 0], y: [0, 20, 40, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/3 h-[60%] w-[80%] rounded-full blur-3xl"
        style={{ background: "#4C6180", opacity: 0.18 }}
        animate={{ x: [0, -30, 10, 0], y: [0, -20, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <Particles accent={accent} />
      <div className="absolute inset-0 grain" />
    </div>
  );
}

function Particles({ accent, n = 14 }: { accent: string; n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const left = (i * 37) % 100;
        const size = 2 + ((i * 7) % 4);
        const dur = 9 + ((i * 5) % 9);
        const delay = (i * 1.3) % 8;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ left: `${left}%`, bottom: -10, width: size, height: size, background: accent, opacity: 0 }}
            animate={{ y: [-0, -700], opacity: [0, 0.6, 0.6, 0], x: [0, (i % 2 ? 1 : -1) * 30] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </>
  );
}

/* Particle burst on reward */
export function Burst({ color = "#35e0c8", n = 18 }: { color?: string; n?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-visible">
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const d = 70 + (i % 3) * 30;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ width: 6 + (i % 3) * 3, height: 6 + (i % 3) * 3, background: i % 4 === 0 ? "#ffd15c" : color }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.9 + (i % 3) * 0.15, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

/* Seal stamp: «Решение принято» */
export function SealStamp({ color = "#35e0c8" }: { color?: string }) {
  return (
    <div className="relative grid h-44 w-44 place-items-center">
      <motion.span className="absolute inset-0 rounded-full" style={{ border: `2px solid ${color}` }} initial={{ scale: 0.6, opacity: 0.9 }} animate={{ scale: 1.7, opacity: 0 }} transition={{ duration: 1.1, delay: 0.35, ease: "easeOut" }} />
      <motion.span className="absolute inset-0 rounded-full" style={{ border: `2px solid ${color}` }} initial={{ scale: 0.6, opacity: 0.9 }} animate={{ scale: 1.4, opacity: 0 }} transition={{ duration: 1.1, delay: 0.55, ease: "easeOut" }} />
      <motion.div
        initial={{ scale: 2.4, rotate: -22, opacity: 0 }}
        animate={{ scale: 1, rotate: -8, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.15 }}
        className="grid h-36 w-36 place-items-center rounded-full"
        style={{ border: `5px solid ${color}`, boxShadow: `0 0 0 6px ${color}22, 0 30px 60px -20px ${color}` }}
      >
        <div className="grid h-[112px] w-[112px] place-items-center rounded-full" style={{ border: `2px dashed ${color}88` }}>
          <div className="flex flex-col items-center justify-center text-center leading-none">
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill={color}>
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            <div className="mt-1.5 text-[10.5px] font-black uppercase tracking-[0.18em]" style={{ color }}>принято</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
