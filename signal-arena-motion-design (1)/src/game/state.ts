import type { DecisionId, Series } from "./content";
import type { MotionPresetId, PageDef } from "./catalog";
import type { NavKey } from "./frame";

export type PickState = "idle" | "hit" | "miss";

export interface ScoreState {
  stars: number;
  xp: number;
  coins: number;
  correct: boolean;
  matched: string[];
  missed: string[];
  /** оценка ПРОЦЕССА, а не только результата (MVP) */
  process: { facts: number; reasoning: number; risk: number; discipline: number };
}

export interface GameState {
  energy: number;
  energyMax: number;
  stars: number;
  coins: number;
  xp: number;
  xpMax: number;
  lvl: number;
  streak: number;
  scenarioIndex: number;
  tutorialStep: number;
  tutorialFeedback: { ok: boolean; text: string } | null;
  picked: string[];
  decision: DecisionId | null;
  /** обязательное обоснование (MVP): id из REASONS, минимум одно */
  reasons: string[];
  /** инвалидация (MVP): обязательна для enter/sizeUp */
  invalidation: string | null;
  /** «незнакомая тема» — процесс не штрафуется */
  unknownTopic: boolean;
  /** флаг блокировки после Seal: решение нельзя менять */
  locked: boolean;
  /** состояние без попыток */
  noAttempts: boolean;
  /** урок пройден — явный переход на Арену */
  tutorialDone: boolean;
  loading: boolean;
  error: string | null;
  sealed: boolean;
  revealed: number;
  scrubbing: boolean;
  zonePicked: boolean;
  pickState: PickState;
  showEvent: boolean;
  showExplain: boolean;
  scored: boolean;
  score: ScoreState;
  history: { scenarioId: string; stars: number; decision: DecisionId | null; correct: boolean; pct: number; processScore: number }[];
  lessonQuiz: number | null;
  lessonFeedback: string | null;
  notificationsRead: boolean;
  motion: MotionPresetId;
  reduced: boolean;
  sound: boolean;
  haptics: boolean;
  reportOpen: boolean;
  toast: string | null;
  levelUp: boolean;
}

export interface GameCtx {
  page: PageDef;
  variantId: string;
  /** resolved slot → assetId for the current page + variant + overrides */
  assign: Record<string, string>;
  motion: MotionPresetId;
  st: GameState;
  series: Series;
  update: (patch: Partial<GameState>) => void;
  go: (pageId: string) => void;
  nav: (k: NavKey) => void;
  pickZone: (y: number, ok: boolean) => void;
  toggleCard: (id: string) => void;
  choose: (d: DecisionId) => void;
  toggleReason: (id: string) => void;
  setInvalidation: (id: string | null) => void;
  seal: () => void;
  startRound: (index: number) => void;
  restartSeries: () => void;
  resetVariant: () => void;
  zoom: number;
  density: { compact: boolean; tiny: boolean };
}
