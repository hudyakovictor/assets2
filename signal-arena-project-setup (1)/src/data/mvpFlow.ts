/**
 * MVP flow source of truth (inferred from game.html Part 1+2 structure).
 * game.html screen bodies are script-generated — captions marked inferred.
 * PDFs are binary — ASSET_ARCHIVE / PDF_TEXT_NOT_EXTRACTED.
 */

export type Decision = "long" | "short" | "wait" | "no_trade";
export type Gate = "none" | "ack" | "target" | "dir" | "seal" | "card" | "rationale" | "quiz" | "scenario" | "reveal";

export const FLOW_NEXT: Record<string, string> = {
  P01: "P02", P02: "P03", P03: "P04", P04: "P05", P05: "P06", P06: "P07", P07: "P08",
  P08: "P09", P09: "P10", P10: "P11", P11: "P12", P12: "P13", P13: "P14", P14: "P15",
  P15: "P16", P16: "P17", P17: "P18", P18: "P19", P19: "P20", P20: "P21", P21: "P22",
  P22: "P23", P23: "P24", P24: "P25", P25: "P26", P26: "P27", P27: "P28", P28: "P29",
  P29: "P23", P30: "P24", P31: "P24", P32: "P18", P33: "P23", P34: "P23",
};

export const FLOW_GATE: Record<string, Gate> = {
  P01: "ack", P02: "ack", P03: "target", P04: "ack", P05: "seal", P06: "reveal", P07: "ack",
  P08: "ack", P09: "target", P10: "seal", P11: "reveal", P12: "ack", P13: "ack", P14: "card",
  P15: "seal", P16: "reveal", P17: "ack", P18: "ack", P19: "ack", P20: "quiz", P21: "ack",
  P22: "ack", P23: "scenario", P24: "ack", P25: "seal", P26: "reveal", P27: "ack", P28: "ack",
  P29: "ack", P30: "ack", P31: "ack", P32: "ack", P33: "ack", P34: "ack",
};

export const RATIONALE_FACTS = [
  { id: "volume", label: "Объём не подтверждает" },
  { id: "level", label: "Уровень уже держал цену" },
  { id: "news", label: "Факт до t0: новость известна" },
  { id: "none", label: "Нет подтверждения — WAIT" },
];

export const DECISIONS: { id: Decision; label: string }[] = [
  { id: "long", label: "Вверх" },
  { id: "short", label: "Вниз" },
  { id: "wait", label: "WAIT" },
  { id: "no_trade", label: "NO_TRADE" },
];

/** Scenario correct process answer — not PnL. */
export const CORRECT: Record<number, Decision> = { 0: "short", 1: "wait", 2: "long" };

export function processScore(dir: Decision | null, rationale: string | null, sealed: boolean, scenario: number, unknownTopic: boolean) {
  const correct = CORRECT[scenario] ?? "wait";
  const dirScore = !dir ? 0 : dir === correct ? 100 : dir === "wait" || dir === "no_trade" ? 55 : 20;
  const explain = unknownTopic ? 100 : rationale ? (rationale === "none" && correct === "wait" ? 100 : 75) : 40;
  const timing = sealed ? 80 : 0;
  const risk = dir === "no_trade" || dir === "wait" ? 90 : 60;
  return { dir: dirScore, timing, explain, risk, unknownTopic };
}
