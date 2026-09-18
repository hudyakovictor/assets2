import type { PageId } from "./pages";
export type Decision = "ENTER" | "WAIT" | "NO_TRADE";
export type Evidence = "STRUCTURE" | "VOLUME" | "TIMEFRAME";
export type GameProgress = { page: PageId; selectedDecision: Decision | null; evidence: Evidence[]; invalidation: string | null; sealed: boolean; revealed: boolean; firstTargetFound: boolean; attempts: number };
export const INITIAL_PROGRESS: GameProgress = { page: "P01", selectedDecision: null, evidence: [], invalidation: null, sealed: false, revealed: false, firstTargetFound: false, attempts: 5 };
export const MAIN_FLOW: PageId[] = ["P01","P02","P03","P04","P05","P06","P07","P08","P09","P10","P11","P12","P13","P14","P15","P16","P17","P18","P19","P20","P21","P22","P23","P24","P25","P26"];
export const nextPage = (page: PageId): PageId => { const i = MAIN_FLOW.indexOf(page); return i < 0 || i === MAIN_FLOW.length - 1 ? page : MAIN_FLOW[i + 1]; };
export function canAdvance(s: GameProgress): { ok: boolean; reason?: string } {
  if (s.page === "P03" && !s.firstTargetFound) return { ok: false, reason: "Сначала отметь видимую зону падения." };
  if (s.page === "P05" && !s.selectedDecision) return { ok: false, reason: "Выбери первое решение." };
  if (s.page === "P07" && (s.evidence.length === 0 || !s.invalidation)) return { ok: false, reason: "Добавь факт и условие отмены идеи." };
  if (s.page === "P10" && !s.selectedDecision) return { ok: false, reason: "Выбери ENTER, WAIT или NO TRADE." };
  if (s.page === "P11" && s.evidence.length === 0) return { ok: false, reason: "Выбери хотя бы один наблюдаемый факт." };
  if (s.page === "P12" && !s.invalidation) return { ok: false, reason: "Задай условие инвалидации." };
  if (s.page === "P13" && !s.sealed) return { ok: false, reason: "Зафиксируй решение через Seal." };
  if (s.page === "P14" && !s.revealed) return { ok: false, reason: "Дождись завершения Reveal." };
  if (s.page === "P24" && (!s.selectedDecision || s.evidence.length === 0 || !s.invalidation)) return { ok: false, reason: "Полный план требует решения, факта и инвалидации." };
  if (s.page === "P25" && !s.sealed) return { ok: false, reason: "Зафиксируй полный план через Seal." };
  if (s.page === "P26" && !s.revealed) return { ok: false, reason: "Дождись завершения Reveal." };
  return { ok: true };
}