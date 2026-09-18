import { createContext, useContext, useSyncExternalStore } from "react";

/** Height of the virtual game frame, so screens can size visuals proportionally. */
export const FrameCtx = createContext(844);

export function useFrameMetrics() {
  const h = useContext(FrameCtx);
  return {
    frameH: h,
    /** Chart height that always leaves room for TopBar, steps, sources and CTA. */
    chartH: (max = 270) => Math.round(Math.min(max, Math.max(132, h * 0.28))),
  };
}

/**
 * Tiny reactive UI store.
 * Sidebar controls must really affect the game — no decorative controls.
 */
interface UiState {
  pair: string;
  timeframe: string;
  proTerms: boolean;
}

let state: UiState = {
  pair: "BTC/USDT",
  timeframe: "15M",
  proTerms: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const ui = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get(): UiState {
    return state;
  },
  set(patch: Partial<UiState>) {
    state = { ...state, ...patch };
    emit();
  },
};

export function useUi(): UiState {
  return useSyncExternalStore(ui.subscribe, ui.get, ui.get);
}

export function useTerminology() {
  const { proTerms } = useUi();
  return (plain: string, pro: string) => (proTerms ? pro : plain);
}
