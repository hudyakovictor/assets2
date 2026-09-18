/* Studio chrome icons — hand-drawn inline SVG. No emoji, no glyph characters. */

export function IconClose({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconList({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 6.5h2M4 12h2M4 17.5h2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9.5 6.5H20M9.5 12H20M9.5 17.5H20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function IconInspector({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.2" stroke="currentColor" strokeWidth="2.2" />
      <path d="M15.2 15.2L20 20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M8 10.5h5M10.5 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".85" />
    </svg>
  );
}

/* Hand-drawn smiley — рисован от руки (штрих неровный), не эмодзи. */
export function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M5 12.8l4.3 4.4L19 7.6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSmiley({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeDasharray="54 3.4" />
      <path d="M8.1 9.6c.5-.9 1.7-.9 2.2 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M13.7 9.6c.5-.9 1.7-.9 2.2 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M7.6 14.2c1.1 1.9 2.6 2.7 4.4 2.6 1.8-.1 3.2-1 4.2-2.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function IconPlay({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M8 5.5l11 6.5-11 6.5v-13z" fill="currentColor" />
    </svg>
  );
}
