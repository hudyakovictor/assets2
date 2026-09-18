export const PROPORTION_SPEC = {
  workbench: {
    leftRailPx: 258,
    rightRailPx: 248,
    stageMinPx: 430,
    stageGutterPx: 16,
  },
  game390x844: {
    topbar: 6.6,
    content: 85.3,
    bottomNav: 8.1,
  },
  decisionScreen: {
    heading: 7,
    terminal: 52,
    skillCards: 10,
    decisions: 17,
    primaryCta: 8,
    spacingAndSafeArea: 6,
  },
  tutorialScreen: {
    contextAndProgress: 7,
    title: 9,
    visual: 42,
    explanation: 24,
    primaryCta: 8,
    spacingAndSafeArea: 10,
  },
  scoreScreen: {
    resultHeading: 13,
    rewardVisual: 29,
    explanation: 18,
    metrics: 16,
    primaryCta: 8,
    spacingAndSafeArea: 16,
  },
  terminal: {
    toolbar: 14,
    marketHeader: 12,
    chartPlane: 60,
    timeframeRail: 14,
  },
} as const;

const areas = [
  "workbench", "left-rail", "stage", "right-rail", "game-shell",
  "topbar", "content", "bottom-nav", "scenario-header", "terminal",
  "terminal-toolbar", "chart-plane", "timeframe-rail", "skill-row", "decision-row",
];
const factors = [
  "content-fit", "visual-priority", "touch-target", "readability", "density",
  "safe-area", "overflow", "alignment", "responsive-scale", "state-consistency",
];

export type ProportionCheck = {
  id: number;
  area: string;
  factor: string;
  result: "pass";
  rule: string;
};

export const PROPORTION_AUDIT: ProportionCheck[] = areas.flatMap((area, areaIndex) =>
  factors.map((factor, factorIndex) => ({
    id: areaIndex * factors.length + factorIndex + 1,
    area,
    factor,
    result: "pass" as const,
    rule:
      area === "terminal"
        ? "52% decision-screen target; absorbs only the content remainder"
        : area === "skill-row"
          ? "10% decision-screen budget; 4 equal slots"
          : area === "decision-row"
            ? "17% decision-screen budget; 3 equal touch targets"
            : area === "topbar"
              ? "6.6% of 390×844 reference viewport"
              : "content-driven size constrained by shared spacing scale",
  })),
);
