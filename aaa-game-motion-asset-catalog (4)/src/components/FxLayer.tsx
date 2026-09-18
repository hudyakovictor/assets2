import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useGame, type FxEvent, type Pt } from "../store";
import { IconCoin, IconStar } from "./RepoIcons";
import { rnd } from "../lib/motion";

/* =====================================================================
   FX LAYER — every reward particle in the game lives here.
   Coordinates are frame-relative so it works inside the phone frame.
   ===================================================================== */

const CoinFlight = ({ e, to, done }: { e: FxEvent; to: Pt; done: () => void }) => {
  const n = e.count ?? 6;
  const coins = useMemo(
    () =>
      Array.from({ length: n }).map((_, i) => {
        const a = rnd(0, Math.PI * 2);
        const r = rnd(28, 70);
        return { i, dx: Math.cos(a) * r, dy: Math.sin(a) * r - 20, delay: i * 0.045 };
      }),
    [n],
  );
  useEffect(() => {
    const t = setTimeout(done, 1400 + n * 45);
    return () => clearTimeout(t);
  }, [done, n]);

  return (
    <>
      {coins.map((c) => {
        const midX = (e.from.x + c.dx + to.x) / 2 + rnd(-40, 40);
        const midY = Math.min(e.from.y + c.dy, to.y) - rnd(40, 90);
        return (
          <motion.div
            key={c.i}
            className="absolute left-0 top-0"
            style={{ x: e.from.x - 12, y: e.from.y - 12 }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              x: [e.from.x - 12, e.from.x + c.dx - 12, e.from.x + c.dx - 12, midX - 12, to.x - 12],
              y: [e.from.y - 12, e.from.y + c.dy - 12, e.from.y + c.dy - 12, midY - 12, to.y - 12],
              scale: [0, 1.15, 1, 1, 0.5],
              opacity: [1, 1, 1, 1, 0],
            }}
            transition={{
              duration: 0.95,
              delay: c.delay,
              times: [0, 0.22, 0.38, 0.7, 1],
              ease: ["backOut", "linear", "easeIn", "easeIn"],
            }}
          >
            <IconCoin size={24} />
          </motion.div>
        );
      })}
    </>
  );
};

const StarFlight = ({ e, to, done }: { e: FxEvent; to: Pt; done: () => void }) => {
  useEffect(() => {
    const t = setTimeout(done, 1100);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <>
      {/* ring flash at origin */}
      <motion.div
        className="absolute rounded-full border-2 border-star"
        style={{ left: e.from.x - 20, top: e.from.y - 20, width: 40, height: 40 }}
        initial={{ scale: 0.4, opacity: 1 }}
        animate={{ scale: 2.4, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="absolute left-0 top-0"
        initial={{ x: e.from.x - 16, y: e.from.y - 16, scale: 0, rotate: -40 }}
        animate={{
          x: [e.from.x - 16, (e.from.x + to.x) / 2 + 30, to.x - 16],
          y: [e.from.y - 16, Math.min(e.from.y, to.y) - 110, to.y - 16],
          scale: [0, 1.5, 0.6],
          rotate: [-40, 20, 0],
        }}
        transition={{ duration: 0.7, times: [0, 0.5, 1], ease: ["backOut", "easeIn"] }}
      >
        <IconStar size={32} />
      </motion.div>
    </>
  );
};

const COLORS = ["#ffc94d", "#3ad9e6", "#8b7bff", "#ff7ad9", "#5fd39a", "#fff"];

const Confetti = ({ e, done }: { e: FxEvent; done: () => void }) => {
  const parts = useMemo(
    () =>
      Array.from({ length: e.count ?? 40 }).map((_, i) => ({
        i,
        x: rnd(-140, 140),
        y: rnd(-220, -60),
        fall: rnd(260, 420),
        rz: rnd(0, 360),
        rx: rnd(360, 1080),
        w: rnd(6, 11),
        h: rnd(8, 16),
        c: COLORS[i % COLORS.length],
        d: rnd(1.4, 2.2),
        delay: rnd(0, 0.15),
      })),
    [e.count],
  );
  useEffect(() => {
    const t = setTimeout(done, 2500);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <>
      {parts.map((p) => (
        <motion.div
          key={p.i}
          className="absolute"
          style={{ left: e.from.x, top: e.from.y, width: p.w, height: p.h, background: p.c, borderRadius: 2 }}
          initial={{ x: 0, y: 0, opacity: 1, rotateZ: 0, rotateX: 0 }}
          animate={{
            x: [0, p.x, p.x * 1.15],
            y: [0, p.y, p.y + p.fall],
            rotateZ: [0, p.rz, p.rz * 2],
            rotateX: [0, p.rx],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: p.d, delay: p.delay, times: [0, 0.3, 1], ease: ["circOut", "easeIn"] }}
        />
      ))}
    </>
  );
};

const Burst = ({ e, done }: { e: FxEvent; done: () => void }) => {
  const parts = useMemo(
    () =>
      Array.from({ length: e.count ?? 14 }).map((_, i) => {
        const a = (i / (e.count ?? 14)) * Math.PI * 2 + rnd(-0.2, 0.2);
        const r = rnd(40, 90);
        return { i, x: Math.cos(a) * r, y: Math.sin(a) * r, s: rnd(4, 9) };
      }),
    [e.count],
  );
  useEffect(() => {
    const t = setTimeout(done, 800);
    return () => clearTimeout(t);
  }, [done]);
  const c = e.color ?? "#ffc94d";
  return (
    <>
      {parts.map((p) => (
        <motion.div
          key={p.i}
          className="absolute rounded-full"
          style={{ left: e.from.x - p.s / 2, top: e.from.y - p.s / 2, width: p.s, height: p.s, background: c, boxShadow: `0 0 8px ${c}` }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: p.x, y: p.y + 30, scale: 0, opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </>
  );
};

const Shock = ({ e, done }: { e: FxEvent; done: () => void }) => {
  useEffect(() => {
    const t = setTimeout(done, 700);
    return () => clearTimeout(t);
  }, [done]);
  const c = e.color ?? "#3ad9e6";
  return (
    <>
      {[
        { d: 0.32, w: 2, s: 3.2 },
        { d: 0.6, w: 7, s: 2.4 },
      ].map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: e.from.x - 30, top: e.from.y - 30, width: 60, height: 60, border: `${r.w}px solid ${c}` }}
          initial={{ scale: 0.3, opacity: 0.9 }}
          animate={{ scale: r.s, opacity: 0 }}
          transition={{ duration: r.d, ease: "circOut" }}
        />
      ))}
    </>
  );
};

const Flash = ({ done }: { e: FxEvent; done: () => void }) => {
  useEffect(() => {
    const t = setTimeout(done, 400);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <motion.div
      className="absolute inset-0 bg-white"
      initial={{ opacity: 0.85 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: "easeOut", delay: 0.08 }}
    />
  );
};

export const FxLayer = () => {
  const { fx, doneFx, anchors } = useGame();
  return (
    <div className="pointer-events-none absolute inset-0 z-[90] overflow-hidden">
      {fx.map((e) => {
        const done = () => doneFx(e.id);
        switch (e.type) {
          case "coins":
            return <CoinFlight key={e.id} e={e} to={anchors.current.coins ?? { x: 200, y: 30 }} done={done} />;
          case "stars":
            return <StarFlight key={e.id} e={e} to={anchors.current.stars ?? { x: 120, y: 30 }} done={done} />;
          case "confetti":
            return <Confetti key={e.id} e={e} done={done} />;
          case "burst":
            return <Burst key={e.id} e={e} done={done} />;
          case "shock":
            return <Shock key={e.id} e={e} done={done} />;
          case "flash":
            return <Flash key={e.id} e={e} done={done} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default React.memo(FxLayer);
