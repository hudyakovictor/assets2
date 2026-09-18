import { createContext, useContext, useReducer, type ReactNode } from "react";
import { CHAPTER_1_CARDS } from "../data/skills";

export interface RunState {
  run: number;
  choice: number | null; // 0 | 1
  reason: string | null;
  wrongIf: string | null;
  opened: string[]; // opened source ids
  tapped: "hit" | "miss" | null;
  equipped: string | null; // card id
}

export interface GameState {
  attempts: number;
  attemptsMax: number;
  stars: number;
  coins: number;
  notifications: number;
  academyUnlocked: boolean;
  cards: string[]; // owned skill cards
  proTerms: boolean;
  sound: boolean;
  animation: boolean;
  history: { run: number; name: string; verdict: string; stars: number }[];
  current: RunState;
  pulse: null | "stars" | "coins" | "attempts"; // topbar pulse hint
}

const freshRun = (run: number): RunState => ({ run, choice: null, reason: null, wrongIf: null, opened: [], tapped: null, equipped: null });

export const initialState: GameState = {
  attempts: 5,
  attemptsMax: 5,
  stars: 0,
  coins: 0,
  notifications: 0,
  academyUnlocked: false,
  cards: [],
  proTerms: false,
  sound: true,
  animation: true,
  history: [],
  current: freshRun(1),
  pulse: null,
};

/* Demo state for the Studio (screens A–P are shown mid-game) */
export const studioState: GameState = {
  ...initialState,
  attempts: 3,
  stars: 7,
  coins: 140,
  notifications: 2,
  academyUnlocked: true,
  cards: [...CHAPTER_1_CARDS, "c16", "c25", "c34"],
  history: [
    { run: 1, name: "Биткоин", verdict: "random-good", stars: 1 },
    { run: 2, name: "Эфир", verdict: "reasoned-bad", stars: 3 },
    { run: 3, name: "Солана", verdict: "reasoned-good", stars: 2 },
  ],
  current: { run: 4, choice: 1, reason: "r1", wrongIf: "w1", opened: ["src1"], tapped: "hit", equipped: "c12" },
};

/* Studio: each frame opens in its own true initial state */
export function studioStateFor(pageId: string): GameState {
  const n = Number(pageId.slice(1));
  if (n >= 16) return studioState;
  const early: GameState = { ...initialState, attempts: 4, stars: 0, coins: 0, notifications: 0, academyUnlocked: false, cards: [] };
  const cur = (o: Partial<RunState>): RunState => ({ ...freshRun(1), ...o });
  switch (pageId) {
    case "P01": return { ...early, attempts: 5 };
    case "P02": case "P03": return { ...early, current: cur({ tapped: pageId === "P03" ? "hit" : null }) };
    case "P04": return { ...early, current: cur({ tapped: "hit" }) };
    case "P05": return { ...early, current: cur({ tapped: "hit", choice: 0 }) };
    case "P06": case "P07": case "P08": case "P09": return { ...early, current: cur({ tapped: "hit", choice: 0, reason: "r3" }) };
    case "P10": return { ...early, stars: 1, coins: 35, current: cur({ run: 2 }) };
    case "P11": return { ...early, stars: 1, coins: 35, current: cur({ run: 2, choice: 1, reason: "r1", wrongIf: "w1" }) };
    case "P12": return { ...early, stars: 4, coins: 100, attempts: 3, current: cur({ run: 3 }) };
    case "P13": case "P14": return { ...early, stars: 4, coins: 100, attempts: 3, academyUnlocked: true, current: cur({ run: 3 }) };
    case "P15": return { ...early, stars: 4, coins: 100, attempts: 3, academyUnlocked: true, cards: [...CHAPTER_1_CARDS], notifications: 1, current: cur({ run: 4 }) };
    default: return early;
  }
}

export type Action =
  | { type: "startRun"; run: number }
  | { type: "tap"; result: "hit" | "miss" }
  | { type: "choose"; choice: number }
  | { type: "reason"; id: string }
  | { type: "wrongIf"; id: string }
  | { type: "openSource"; id: string }
  | { type: "equip"; id: string | null }
  | { type: "reward"; stars: number; coins: number; name: string; verdict: string }
  | { type: "unlockAcademy" }
  | { type: "grantCards"; ids: string[] }
  | { type: "toggle"; key: "proTerms" | "sound" | "animation" }
  | { type: "setProTerms"; value: boolean }
  | { type: "clearPulse" }
  | { type: "readNotifications" };

export function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case "startRun":
      return { ...s, attempts: Math.max(0, s.attempts - 1), current: freshRun(a.run), pulse: "attempts" };
    case "tap":
      return { ...s, current: { ...s.current, tapped: a.result } };
    case "choose":
      return { ...s, current: { ...s.current, choice: a.choice } };
    case "reason":
      return { ...s, current: { ...s.current, reason: a.id } };
    case "wrongIf":
      return { ...s, current: { ...s.current, wrongIf: a.id } };
    case "openSource":
      return s.current.opened.includes(a.id) ? s : { ...s, current: { ...s.current, opened: [...s.current.opened, a.id] } };
    case "equip":
      return { ...s, current: { ...s.current, equipped: a.id } };
    case "reward":
      return {
        ...s,
        stars: s.stars + a.stars,
        coins: s.coins + a.coins,
        history: [{ run: s.current.run, name: a.name, verdict: a.verdict, stars: a.stars }, ...s.history],
        pulse: a.stars > 0 ? "stars" : "coins",
      };
    case "unlockAcademy":
      return { ...s, academyUnlocked: true, notifications: s.notifications + 1 };
    case "grantCards":
      return { ...s, cards: Array.from(new Set([...s.cards, ...a.ids])), notifications: s.notifications + 1 };
    case "toggle":
      return { ...s, [a.key]: !s[a.key] };
    case "setProTerms":
      return s.proTerms === a.value ? s : { ...s, proTerms: a.value };
    case "clearPulse":
      return { ...s, pulse: null };
    case "readNotifications":
      return { ...s, notifications: 0 };
    default:
      return s;
  }
}

const Ctx = createContext<{ state: GameState; dispatch: (a: Action) => void } | null>(null);

export function GameProvider({ children, initial = initialState }: { children: ReactNode; initial?: GameState }) {
  const [state, dispatch] = useReducer(reducer, initial);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useGame() {
  const c = useContext(Ctx);
  if (!c) throw new Error("GameProvider missing");
  return c;
}
