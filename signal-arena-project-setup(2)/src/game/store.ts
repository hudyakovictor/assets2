import { useSyncExternalStore } from "react";

export interface Progress {
  lvl: number;
  xp: number;
  coins: number;
  sig: number; // premium currency $SIG
  energy: number;
  energyMax: number;
  streak: number;
  bestStreak: number;
  wins: number;
  rounds: number;
  analysesDone: number;
  ownedCards: string[];
  passTier: number;
  seenOnboarding: boolean;
  sound: boolean;
}

const KEY = "signal-arena-v3";

const DEFAULT: Progress = {
  lvl: 7,
  xp: 680,
  coins: 1240,
  sig: 128,
  energy: 5,
  energyMax: 5,
  streak: 0,
  bestStreak: 0,
  wins: 0,
  rounds: 0,
  analysesDone: 0,
  ownedCards: ["c01", "c03", "c07", "c12", "c19", "c22", "c27", "c31", "c35", "c38"],
  passTier: 12,
  seenOnboarding: false,
  sound: true,
};

export function xpForLevel(lvl: number) {
  return 1000 + (lvl - 1) * 250;
}

function load(): Progress {
  if (typeof localStorage === "undefined") return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
}

let state: Progress = load();
const listeners = new Set<() => void>();

function emit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* noop */
  }
  listeners.forEach((l) => l());
}

export const store = {
  get: () => state,
  set: (patch: Partial<Progress>) => {
    state = { ...state, ...patch };
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  reset: () => {
    state = { ...DEFAULT, seenOnboarding: true };
    emit();
  },
};

export function useProgress(): Progress {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

export function awardRound(scorePct: number, correct: boolean): { leveledUp: boolean; xp: number; coins: number; sig: number } {
  const s = state;
  const gxp = Math.round(scorePct * 1.4) + (correct ? 40 : 8);
  const gcoins = Math.round(scorePct / 3) + (correct ? 15 : 0);
  const gsig = scorePct >= 85 ? 2 : 0;
  let xp = s.xp + gxp;
  let lvl = s.lvl;
  let leveledUp = false;
  while (xp >= xpForLevel(lvl)) {
    xp -= xpForLevel(lvl);
    lvl += 1;
    leveledUp = true;
  }
  const streak = correct ? s.streak + 1 : 0;
  store.set({
    xp,
    lvl,
    coins: s.coins + gcoins,
    sig: s.sig + gsig,
    streak,
    bestStreak: Math.max(s.bestStreak, streak),
    wins: s.wins + (correct ? 1 : 0),
    rounds: s.rounds + 1,
    analysesDone: s.analysesDone + 1,
    passTier: Math.min(30, s.passTier + (correct ? 1 : 0)),
  });
  return { leveledUp, xp: gxp, coins: gcoins, sig: gsig };
}

export function spendEnergy(): boolean {
  if (state.energy <= 0) return false;
  store.set({ energy: state.energy - 1 });
  return true;
}
export function refillEnergy() {
  store.set({ energy: state.energyMax });
}
