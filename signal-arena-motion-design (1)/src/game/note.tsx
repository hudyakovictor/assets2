/* ============================================================================
   NOTE — рукописная надпись «как на стикере», но без стикера.
   Стикер, бумага и рамки не используются: только рукописный шрифт, лёгкий
   наклон, тёплый чернильный тон и НАРИСОВАННЫЙ от руки смайлик/дудл (SVG).
   Ни одного emoji — все дудлы отрисованы здесь кодом.
   ========================================================================== */
import type { ReactNode } from "react";

type Doodle = "smile" | "smile-wink" | "arrow" | "spark" | "wave" | "none";

const INK: Record<string, string> = {
  cream: "#E9D9A6",
  chalk: "#DCEFFB",
  teal: "#8FE9D2",
  ember: "#F3C0BB",
  feather: "#BFD3EC",
};

export function HandDoodle({ kind, size = 26, color = "currentColor" }: { kind: Doodle; size?: number; color?: string }) {
  const s = { fill: "none", stroke: color, strokeWidth: 2.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "smile":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
          {/* hand-drawn circle: slightly wobbly, open ends overlap like a pen loop */}
          <path d="M20.5 4.6c8.2-.5 15 5.6 15.2 14.6.2 8.6-6.4 15.4-15 15.6C12 35 5.4 28.7 5 20.1 4.7 12 11 4.9 19.6 4.6" {...s} />
          <path d="M13.6 15.2c.9-1 2.4-1 3.3 0" {...s} strokeWidth="2.6" />
          <path d="M23.6 15.2c.9-1 2.4-1 3.3 0" {...s} strokeWidth="2.6" />
          <path d="M12.6 23.6c2.4 3.4 6 5 9.8 4.2 2.6-.6 4.6-2.2 5.8-4.6" {...s} />
        </svg>
      );
    case "smile-wink":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
          <path d="M20.5 4.6c8.2-.5 15 5.6 15.2 14.6.2 8.6-6.4 15.4-15 15.6C12 35 5.4 28.7 5 20.1 4.7 12 11 4.9 19.6 4.6" {...s} />
          <path d="M13.6 15.4l3.4 1.2" {...s} strokeWidth="2.6" />
          <path d="M23.6 15.2c.9-1 2.4-1 3.3 0" {...s} strokeWidth="2.6" />
          <path d="M13 23.4c2.4 3.6 6 5.2 9.8 4.4 2.6-.6 4.6-2.2 5.8-4.8" {...s} />
        </svg>
      );
    case "arrow":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
          <path d="M6 30c6-2 9-7 10.6-14" {...s} />
          <path d="M12.4 19.6l4.2-4.2 3.4 5" {...s} />
          <path d="M24 12.6c4-.6 7 1 9.4 4.6" {...s} strokeDasharray="5 4" />
        </svg>
      );
    case "spark":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
          <path d="M20 5.4l2.6 9.4 9.4 2.6-9.4 2.6-2.6 9.4-2.6-9.4L8 17.4l9.4-2.6z" {...s} />
          <path d="M31.6 26.4l1.2 3.6 3.6 1.2-3.6 1.2-1.2 3.6-1.2-3.6-3.6-1.2 3.6-1.2z" {...s} strokeWidth="1.9" />
        </svg>
      );
    case "wave":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
          <path d="M4.5 25c4-.4 4-9 8-9s4 9 8 9 4-9 8-9 4 8.6 7 9" {...s} />
        </svg>
      );
    default:
      return null;
  }
}

export function Note({
  children,
  tone = "cream",
  rotate = -1.4,
  doodle = "smile",
  doodleSize = 26,
  size = "m",
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof INK;
  rotate?: number;
  doodle?: Doodle;
  doodleSize?: number;
  size?: "s" | "m" | "l";
  className?: string;
}) {
  const fs = size === "s" ? "calc(var(--type-h3) * 1.02)" : size === "l" ? "calc(var(--type-h3) * 1.62)" : "calc(var(--type-h3) * 1.28)";
  return (
    <div
      className={`note ${className}`}
      style={{
        color: `var(--note-ink, ${INK[tone] ?? INK.cream})`,
        fontSize: fs,
        transform: `rotate(${rotate}deg)`,
        ["--note-rot" as string]: `${rotate}deg`,
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
      }}
    >
      <span className="note-text">{children}</span>
      {doodle !== "none" && (
        <span className="note-doodle" style={{ transform: "rotate(3deg)", flex: "none", marginBottom: 2 }}>
          <HandDoodle kind={doodle} size={doodleSize} />
        </span>
      )}
    </div>
  );
}

/** Компактная записка-обманка: кладётся рядом с CTA, не ломает сетку экрана */
export function NoteStrip({ children, tone = "cream", doodle = "smile" }: { children: ReactNode; tone?: keyof typeof INK; doodle?: Doodle }) {
  return (
    <div className="note-strip">
      <Note tone={tone} doodle={doodle} doodleSize={20} size="s" rotate={-1.8}>{children}</Note>
    </div>
  );
}
