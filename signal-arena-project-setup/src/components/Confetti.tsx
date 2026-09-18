import { useEffect, useRef } from "react";

/**
 * Lightweight canvas confetti/spark burst for reveal & reward moments.
 * No external assets — pure procedural particles matching the locked palette.
 */
const COLORS = ["#2BD6C4", "#2E7F5C", "#D0B24A", "#4C6180", "#C56861"];

type P = { x: number; y: number; vx: number; vy: number; g: number; life: number; maxLife: number; size: number; color: string; rot: number; vr: number; shape: 0 | 1 };

export function Confetti({ run, burst = 46, origin = "center" }: { run: number; burst?: number; origin?: "center" | "top" }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const parent = canvas.parentElement!;
    const w = parent.clientWidth, h = parent.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const ox = w / 2, oy = origin === "top" ? h * 0.18 : h * 0.42;
    const parts: P[] = Array.from({ length: burst }, () => {
      const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 5;
      return { x: ox, y: oy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, g: 0.13, life: 0, maxLife: 55 + Math.random() * 35, size: 3 + Math.random() * 4, color: COLORS[(Math.random() * COLORS.length) | 0], rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.5, shape: Math.random() > 0.5 ? 1 : 0 };
    });
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of parts) {
        p.life++;
        if (p.life > p.maxLife) continue;
        alive = true;
        p.vy += p.g; p.vx *= 0.988; p.vy *= 0.994;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        const a = 1 - p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = Math.max(0, a);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        if (p.shape) ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, burst, origin]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 30 }} />;
}
