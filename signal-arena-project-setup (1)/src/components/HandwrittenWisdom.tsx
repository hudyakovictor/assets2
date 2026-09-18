import { HanddrawnSmiley } from "./Icons";

/**
 * Handwritten Wisdom Banner:
 * "IF YOU'RE HERE, JUST FOR MONEY, YOU'RE EARLY. AND THAT'S BAD." + hand-drawn vector smiley.
 * Rendered WITHOUT STICKER (no paper background, no yellow square box),
 * directly in marker/chalk aesthetic with vivid turquoise glow on deep dark blue!
 */
export function HandwrittenWisdom({
  compact = false,
  className = "",
  glow = true,
}: {
  compact?: boolean;
  className?: string;
  glow?: boolean;
}) {
  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 select-none ${className}`}
        style={{
          textShadow: glow ? "0 0 12px rgba(45,212,191,0.5), 0 0 24px rgba(45,212,191,0.25)" : "none",
        }}
      >
        <span className="font-['Permanent_Marker',sans-serif] text-[13px] text-[#2dd4bf] tracking-wider uppercase leading-snug">
          "If you're here just for money, you're early. And that's bad."
        </span>
        <HanddrawnSmiley className="w-5 h-5 text-[#2dd4bf]" color="#2dd4bf" />
      </div>
    );
  }

  return (
    <div
      className={`relative p-3.5 rounded-[18px] bg-gradient-to-br from-[#0e1a2f]/90 via-[#0a1324]/80 to-[#12223f]/90 border border-[#2dd4bf]/35 shadow-[0_8px_24px_rgba(0,0,0,0.45),0_0_20px_rgba(45,212,191,0.15)] select-none overflow-hidden ${className}`}
    >
      {/* Ambient background glow orb */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#2dd4bf]/15 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-end justify-between gap-3">
        <div className="flex-1">
          <div className="text-[9px] font-black tracking-[0.2em] text-[#38bdf8] uppercase mb-1 opacity-80">
            ФИЛОСОФИЯ СВЕЧЕЙ-КЛИНКОВ
          </div>
          <div
            className="font-['Permanent_Marker',sans-serif] text-[14px] leading-[1.3] text-[#e0f2fe] tracking-wide"
            style={{
              textShadow: "0 0 10px rgba(56,189,248,0.4)",
            }}
          >
            IF YOU'RE HERE,
            <br />
            JUST FOR MONEY,
            <br />
            YOU'RE EARLY.
            <br />
            <span className="text-[#2dd4bf]">AND THAT'S BAD.</span>
          </div>
        </div>

        {/* The requested hand-drawn vector smiley next to the handwritten text */}
        <div className="flex flex-col items-center shrink-0">
          <HanddrawnSmiley className="w-9 h-9 text-[#2dd4bf]" color="#2dd4bf" />
          <span className="text-[9px] font-bold text-[#64748b] tracking-wider mt-0.5">SIGNAL</span>
        </div>
      </div>
    </div>
  );
}
