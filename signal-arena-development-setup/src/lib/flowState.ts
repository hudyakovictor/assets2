export type Decision = "LONG" | "SHORT" | "WAIT" | "NO_TRADE";

export type DecisionDraft = {
  decision: Decision | null;
  thesis: string | null;
  invalidation: string | null;
};

export type SealedDecision = Required<DecisionDraft> & {
  sealedAt: number;
};

export const EMPTY_DRAFT: DecisionDraft = {
  decision: null,
  thesis: null,
  invalidation: null,
};

export function canSeal(draft: DecisionDraft) {
  return Boolean(draft.decision && draft.thesis && draft.invalidation);
}

export function scoreProcess(sealed: SealedDecision | null, topicKnown = true) {
  if (!sealed) return null;
  if (!topicKnown) {
    return { total: null, label: "Тема ещё не изучена", noPenalty: true };
  }
  const decisionScore = sealed.decision === "WAIT" || sealed.decision === "NO_TRADE" ? 30 : 22;
  return {
    total: decisionScore + 25 + 25 + 20,
    label: "Оценка процесса",
    noPenalty: false,
  };
}

export const FLOW_EVIDENCE = [
  "P01 Splash → P02 Intro",
  "P02–P05 Intro/Tutorial 1/4…4/4 → P06 Chart",
  "P06 Chart → P07 Decision draft → P08 Seal → P09 Reveal → P10 Score",
  "P10 Score → P11 Debrief → P12 Skill Practice → P13 completion → P14 no attempts gate",
  "P14 gate → P15 Topic Tree → P16 Lesson List → P17 Lesson → P18 reward",
  "P18 reward → P19 Deck → P20/P21 Skill Card → P23 Arena",
  "P23 Arena → P24 Brief → P25 Chart → P26 Decision → P27 Seal → P28 Sealed",
  "P28 Sealed → P29 Reveal → P30 Score → P31 Debrief → P23 Arena",
];