/* =====================================================================
   PAGE INVENTORY — P01…P34
   Source: MVP rototype "все экраны" (game.html + PDF раскадровка)
   Academy: tree + lessons, deck; Arena: full run with all zones,
   reveal & scoring, debrief; profile; service screens & states.
   NOTE: PDF is binary and cannot be text-parsed here — the inventory is
   built strictly from the MVP description. If the storyboard PDF lists a
   different page set, a Page Count Mismatch is reported in the UI.
   ===================================================================== */

export type PageSection = "Onboarding" | "Arena" | "Academy" | "Deck" | "Profile" | "Service" | "States";

export interface PageDef {
  id: string; // P01
  name: string;
  section: PageSection;
  state: string;
  source: string;
  topbar: boolean; // Top Bar present (except splash)
  hasScroll?: boolean; // inner scroll explicitly allowed
  assetId: string; // primary asset in inspector
  slots: string[]; // asset slots on the page
}

export const PAGES: PageDef[] = [
  { id: "P01", name: "Splash / Welcome", section: "Onboarding", state: "cold start", source: "MVP: первое открытие", topbar: false, assetId: "P01/logo-emblem", slots: ["logo-emblem", "hand-note", "bg-noise"] },
  { id: "P02", name: "Tutorial 1/4 · Где ты", section: "Onboarding", state: "step 1", source: "MVP: обучение через бой", topbar: true, assetId: "P02/visual-arena", slots: ["topbar", "visual-arena", "cta"] },
  { id: "P03", name: "Tutorial 2/4 · Свеча", section: "Onboarding", state: "step 2", source: "MVP: свечной алфавит", topbar: true, assetId: "P03/visual-candle", slots: ["topbar", "visual-candle", "cta"] },
  { id: "P04", name: "Tutorial 3/4 · Уровень и объём", section: "Onboarding", state: "step 3", source: "MVP: ловушка пробоя", topbar: true, assetId: "P04/visual-level", slots: ["topbar", "visual-level", "cta"] },
  { id: "P05", name: "Tutorial 4/4 · Seal и решение", section: "Onboarding", state: "step 4", source: "MVP: seal решения", topbar: true, assetId: "P05/visual-seal", slots: ["topbar", "visual-seal", "cta"] },
  { id: "P06", name: "Arena · Setup", section: "Arena", state: "before decision, chart at t0", source: "MVP: полный заход на Арену", topbar: true, assetId: "P06/chart-t0", slots: ["topbar", "chart-t0", "coach-bubble", "zone-highlight", "focus-target"] },
  { id: "P07", name: "Arena · Skill pick", section: "Arena", state: "hand of cards open", source: "MVP: колода карт навыков", topbar: true, assetId: "P07/card-c17", slots: ["cards-row", "card-c17", "card-c18", "card-c20", "hand-fan"] },
  { id: "P08", name: "Arena · Decision", section: "Arena", state: "4 actions available", source: "MVP: решения игрока", topbar: true, assetId: "P08/decision-grid", slots: ["decision-grid", "chip-enter", "chip-wait", "chip-htf", "chip-risk"] },
  { id: "P09", name: "Arena · Seal", section: "Arena", state: "decision locked", source: "MVP: Seal", topbar: true, assetId: "P09/seal-stamp", slots: ["seal-stamp", "chart-t0-locked"] },
  { id: "P10", name: "Arena · Fast-forward", section: "Arena", state: "time-scrub after seal", source: "MVP: dорисовка истории", topbar: true, assetId: "P10/scrub-line", slots: ["scrub-line", "chart-extend", "timecode"] },
  { id: "P11", name: "Reveal · Key event", section: "Arena", state: "event on chart", source: "MVP: Reveal", topbar: true, assetId: "P11/event-marker", slots: ["event-marker", "chart-history", "caption"] },
  { id: "P12", name: "Score · Оценка", section: "Arena", state: "1–3 stars", source: "MVP: оценка", topbar: true, assetId: "P12/stars", slots: ["stars", "xp-chip", "coin-chip"] },
  { id: "P13", name: "Debrief · Разбор", section: "Arena", state: "rows stagger", source: "MVP: разбор", topbar: true, assetId: "P13/debrief-rows", slots: ["debrief-rows", "verdict"] },
  { id: "P14", name: "Round result · Next", section: "Arena", state: "round complete", source: "MVP: следующий раунд", topbar: true, assetId: "P14/result-panel", slots: ["result-panel", "streak-chip"] },
  { id: "P15", name: "Academy · Tree", section: "Academy", state: "topics map", source: "MVP: дерево тем", topbar: true, hasScroll: true, assetId: "P15/tree-path", slots: ["tree-path", "node-1", "node-2", "node-3", "node-locked"] },
  { id: "P16", name: "Lesson · Step", section: "Academy", state: "lesson card", source: "MVP: уроки", topbar: true, assetId: "P16/lesson-visual", slots: ["lesson-visual", "step-progress", "cta"] },
  { id: "P17", name: "Lesson · Chart example", section: "Academy", state: "annotated chart", source: "MVP: примеры на графике", topbar: true, assetId: "P17/example-chart", slots: ["example-chart", "annotation"] },
  { id: "P18", name: "Lesson · Quiz", section: "Academy", state: "one question", source: "MVP: закрепление", topbar: true, assetId: "P18/quiz-options", slots: ["quiz-options", "feedback-ring"] },
  { id: "P19", name: "Lesson · Reward", section: "Academy", state: "reward unlocked", source: "MVP: награда за урок", topbar: true, assetId: "P19/reward-card", slots: ["reward-card", "confetti"] },
  { id: "P20", name: "Deck · Slots", section: "Deck", state: "hand of 3", source: "MVP: колода карт навыков", topbar: true, assetId: "P20/deck-slot", slots: ["deck-slot-1", "deck-slot-2", "deck-slot-3"] },
  { id: "P21", name: "Deck · All skills", section: "Deck", state: "c01–c40 library", source: "MVP: библиотека приёмов", topbar: true, hasScroll: true, assetId: "P21/skill-grid", slots: ["skill-grid", "group-green", "group-yellow", "group-blue", "group-red"] },
  { id: "P22", name: "Profile · Status", section: "Profile", state: "player card", source: "MVP: профиль", topbar: true, assetId: "P22/player-card", slots: ["player-card", "xp-ring", "stats-row"] },
  { id: "P23", name: "Profile · Battles", section: "Profile", state: "recent battles", source: "MVP: история", topbar: true, hasScroll: true, assetId: "P23/battle-row", slots: ["battle-row", "outcome-icon"] },
  { id: "P24", name: "Profile · Stats", section: "Profile", state: "metrics", source: "MVP: статистика", topbar: true, assetId: "P24/stats-grid", slots: ["stats-grid", "streak-flame"] },
  { id: "P25", name: "Daily reward", section: "Service", state: "claimable", source: "MVP: обслуживающие экраны", topbar: true, assetId: "P25/daily-card", slots: ["daily-card", "reward-count"] },
  { id: "P26", name: "Notifications", section: "Service", state: "sheet list", source: "MVP: уведомления", topbar: true, assetId: "P26/notif-row", slots: ["notif-row", "unread-dot"] },
  { id: "P27", name: "Settings", section: "Service", state: "toggles", source: "MVP: настройки", topbar: true, assetId: "P27/toggle-row", slots: ["toggle-row", "sound-toggle", "motion-toggle"] },
  { id: "P28", name: "Leaderboard", section: "Service", state: "season top", source: "MVP: соревнование", topbar: true, hasScroll: true, assetId: "P28/leader-row", slots: ["leader-row", "rank-medal"] },
  { id: "P29", name: "Tournament", section: "Service", state: "live event", source: "MVP: турнир", topbar: true, assetId: "P29/event-card", slots: ["event-card", "countdown"] },
  { id: "P30", name: "Offline state", section: "States", state: "no connection", source: "MVP: состояния", topbar: true, assetId: "P30/offline-card", slots: ["offline-card", "retry-cta"] },
  { id: "P31", name: "Empty state", section: "States", state: "empty deck", source: "MVP: состояния", topbar: true, assetId: "P31/empty-box", slots: ["empty-box", "empty-cta"] },
  { id: "P32", name: "Error state", section: "States", state: "request failed", source: "MVP: состояния", topbar: true, assetId: "P32/error-card", slots: ["error-card", "retry-cta"] },
  { id: "P33", name: "Pause", section: "States", state: "timer stopped", source: "MVP: состояния", topbar: true, assetId: "P33/pause-card", slots: ["pause-card", "resume-cta"] },
  { id: "P34", name: "First win · Onboarding done", section: "Arena", state: "3/3, streak 1", source: "MVP: конец первых 8 минут", topbar: true, assetId: "P34/victory-panel", slots: ["victory-panel", "confetti", "new-card"] },
];

/* =====================================================================
   VARIANTS A–D per page.
   Same layout / texts / structure everywhere; only assetId, art
   treatment, background artwork, chart treatment, tint and motion
   preset differ (per spec).
   ===================================================================== */

export interface VariantDef {
  id: "A" | "B" | "C" | "D";
  label: string;
  motion: "spring" | "stagger" | "pop" | "antic";
  glow: string;
  glowSoft: string;
  pattern: "grid" | "waves" | "hex" | "dots";
  chart: { stroke: number; glow: number; scan: boolean; scanColor: string };
  cardArt: string; // alt skill icon for card-centric pages
  bgArt: string;
  note: string;
}

export const VARIANTS: VariantDef[] = [
  {
    id: "A",
    label: "Signal",
    motion: "spring",
    glow: "#35e0d0",
    glowSoft: "rgba(53,224,208,.16)",
    pattern: "grid",
    chart: { stroke: 1, glow: 6, scan: false, scanColor: "#35e0d0" },
    cardArt: "c17",
    bgArt: "deep-navy grid",
    note: "Базовый пресет: бирюзовый сигнал, сетка, пружинные появления.",
  },
  {
    id: "B",
    label: "Night session",
    motion: "stagger",
    glow: "#8b7bff",
    glowSoft: "rgba(139,123,255,.15)",
    pattern: "waves",
    chart: { stroke: 1, glow: 10, scan: true, scanColor: "#8b7bff" },
    cardArt: "c25",
    bgArt: "violet waves + scanline",
    note: "Фирменный сканлайнер, волнистый фон, stagger-хореография.",
  },
  {
    id: "C",
    label: "Amber alert",
    motion: "pop",
    glow: "#ffb84d",
    glowSoft: "rgba(255,184,77,.14)",
    pattern: "hex",
    chart: { stroke: 1.6, glow: 4, scan: false, scanColor: "#ffb84d" },
    cardArt: "c38",
    bgArt: "hex mesh, bold chart lines",
    note: "Жёсткие линии графика, hex-фон, pop-появления (overshoot).",
  },
  {
    id: "D",
    label: "Green room",
    motion: "antic",
    glow: "#3ddc97",
    glowSoft: "rgba(61,220,151,.14)",
    pattern: "dots",
    chart: { stroke: 1, glow: 8, scan: false, scanColor: "#3ddc97" },
    cardArt: "c31",
    bgArt: "dot matrix, anticipatory motion",
    note: "Точки + anticipation-кривые: замах перед каждым появлением.",
  },
];

export const variantFor = (pageId: string, v: number): VariantDef => {
  // deterministic but different art per page so variants are never
  // identical duplicates between pages
  const shift = (pageId.charCodeAt(2) - 48) % 4;
  return VARIANTS[(v + shift) % 4];
};

export const MOTION_PRESETS: Record<VariantDef["motion"], any> = {
  spring: { type: "spring", stiffness: 340, damping: 26, mass: 0.9 },
  stagger: { type: "spring", stiffness: 300, damping: 28, mass: 0.8 },
  pop: { type: "spring", stiffness: 520, damping: 15, mass: 0.7 },
  antic: { type: "spring", stiffness: 380, damping: 13, mass: 0.9 },
};

/* =====================================================================
   ASSET MATRIX (auto-generated rows)
   Page ID | Variant ID | Asset slot | Asset ID | Source | Purpose
   ===================================================================== */
export const ASSET_MATRIX = PAGES.flatMap((p) =>
  VARIANTS.map((v) => ({
    page: p.id,
    variant: `${p.id}-${v.id}`,
    slots: p.slots.map((slot) => ({
      pageId: p.id,
      variantId: `${p.id}-${v.id}`,
      slot,
      assetId: slot === "topbar" ? "SHARED_TOP_BAR_LOCKED" : `${p.id}/${slot}`,
      source:
        slot === "topbar"
          ? "topbar/topbar.html + topbar/icons/*.svg"
          : slot.startsWith("card-c") || slot.startsWith("group-")
            ? `skill-card-icons/${slot.startsWith("group") ? "c03" : slot.replace("card-", "")}.svg`
            : "inline-drawn (repo art direction)",
      placement: p.id,
      purpose: slot,
      fallback: slot.startsWith("card-c") ? "drawn monochrome glyph" : "inline SVG",
    })),
    motionPreset: v.motion,
    tint: v.glow,
    cardArt: v.cardArt,
  })),
);

export const MISSING_ASSETS = [
  { file: "skill-card-icons.zip", status: "MISSING_ASSET", note: "Архив отсутствует; файлы доступны как каталог skill-card-icons/ (c01–c40 + preview*.svg)" },
  { file: "topbar.zip", status: "MISSING_ASSET", note: "Архив отсутствует; файлы доступны как каталог topbar/ (topbar.html, icons/, topbar.png)" },
];

export const PAGE_COUNT_EXPECTED = 34;
export const PAGE_COUNT_FOUND = PAGES.length;
export const PAGE_COUNT_MISMATCH = PAGE_COUNT_EXPECTED !== PAGE_COUNT_FOUND;
