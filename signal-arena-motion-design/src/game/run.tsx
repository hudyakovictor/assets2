import { createContext, useContext, useState, useCallback } from 'react';

/* =========================================================================
   RUN STATE
   Fixes the "false result" class of UX defects: Seal, Reveal, Score and
   Debrief previously rendered hardcoded outcomes regardless of what the
   player actually chose. Every downstream screen now reads real input.
   ========================================================================= */

export type DecisionId = 'enter' | 'wait' | 'no_trade' | 'study';

export interface RunState {
  decision: DecisionId | null;
  conviction: number;
  rationale: number[];
  invalidation: string | null;
  sealed: boolean;
  studiedTopic: boolean;
  skippedTopic: boolean;
  tutorialHit: 'none' | 'ok' | 'miss';
  attempts: number;
  completedRuns: number;
  /** Skill cards applied during the current run. */
  playedCards: string[];
}

const EMPTY: RunState = {
  decision: null, conviction: 3, rationale: [], invalidation: null,
  sealed: false, studiedTopic: false, skippedTopic: false,
  tutorialHit: 'none', attempts: 0, completedRuns: 0, playedCards: [],
};

interface Ctx {
  run: RunState;
  set: <K extends keyof RunState>(k: K, v: RunState[K]) => void;
  resetRun: () => void;
}

const RunCtx = createContext<Ctx>({ run: EMPTY, set: () => {}, resetRun: () => {} });

export function RunProvider({ children }: { children: React.ReactNode }) {
  const [run, setRun] = useState<RunState>(EMPTY);
  const set: Ctx['set'] = useCallback((k, v) => setRun(p => ({ ...p, [k]: v })), []);
  const resetRun = useCallback(() => setRun(p => ({
    ...EMPTY, completedRuns: p.completedRuns, attempts: p.attempts,
  })), []);
  return <RunCtx.Provider value={{ run, set, resetRun }}>{children}</RunCtx.Provider>;
}

export const useRun = () => useContext(RunCtx);

/* ---- readable labels so downstream screens never invent an outcome ---- */
export const DECISION_LABEL: Record<DecisionId, string> = {
  enter: 'ENTER', wait: 'WAIT', no_trade: 'NO_TRADE', study: 'ИЗУЧИТЬ',
};

export const DECISION_SUMMARY: Record<DecisionId, string> = {
  enter: 'Вход по плану. Риск принят до раскрытия.',
  wait: 'Ожидание подтверждения. Риск не принят.',
  no_trade: 'Отказ от сделки. Условия не выполнены.',
  study: 'Тема отложена на изучение. Попытка не списана.',
};

/* Process scoring: rewards the quality of the procedure, never the guess. */
export function scoreRun(run: RunState) {
  const evidence = Math.min(100, run.rationale.length * 34);
  const discipline = run.invalidation ? 95 : 35;
  const risk = run.decision === 'enter' ? 62 : run.decision === 'study' ? 70 : 88;
  const timing = run.decision === 'wait' ? 82 : run.decision === 'no_trade' ? 74 : 58;
  const total = Math.round((evidence + discipline + risk + timing) / 4);
  const grade = total >= 85 ? 'A' : total >= 75 ? 'B+' : total >= 65 ? 'B' : total >= 55 ? 'C' : 'D';
  return {
    total, grade,
    rows: [
      { k: 'Чтение фактов', v: evidence, hint: `${run.rationale.length} факта в обосновании` },
      { k: 'Дисциплина', v: discipline, hint: run.invalidation ? 'инвалидация задана до Seal' : 'инвалидация не задана' },
      { k: 'Риск', v: risk, hint: run.decision === 'enter' ? 'риск принят без подтверждения' : 'риск ограничен' },
      { k: 'Тайминг', v: timing, hint: run.decision === 'wait' ? 'ждал подтверждение' : 'вход вне подтверждения' },
    ],
  };
}
