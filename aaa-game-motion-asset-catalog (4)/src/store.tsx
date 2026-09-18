import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { feel, setMuted, sfx } from "./lib/feedback";

export type Pt = { x: number; y: number };

export interface FxEvent {
  id: number;
  type: "coins" | "stars" | "burst" | "confetti" | "shock" | "flash";
  from: Pt;
  count?: number;
  color?: string;
}

interface GameState {
  coins: number;
  xp: number;
  level: number;
  stars: number;
  attempts: number;
  collected: string[];
  favorites: string[];
  muted: boolean;
  fx: FxEvent[];
  shake: number;
  /** HUD anchors (frame-relative coordinates) */
  anchors: React.MutableRefObject<Record<string, Pt>>;
  frameRef: React.RefObject<HTMLDivElement | null>;
  toPt: (el: Element | null) => Pt;
  collect: (id: string, from: Pt, rarity: string) => boolean;
  toggleFav: (id: string) => void;
  spawn: (e: Omit<FxEvent, "id">) => void;
  doneFx: (id: number) => void;
  addCoins: (n: number) => void;
  addStars: (n: number) => void;
  spendAttempt: () => boolean;
  toggleMute: () => void;
  bump: (k: "coins" | "stars" | "attempts" | "xp") => void;
  bumped: Record<string, number>;
  screenShake: () => void;
  grant: (g: { coins?: number; xp?: number; from: Pt; confetti?: boolean; stars?: boolean }) => void;
  levelUp: number;
}

const Ctx = createContext<GameState | null>(null);

let fxId = 1;

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [coins, setCoins] = useState(1240);
  const [xp, setXp] = useState(680);
  const [level, setLevel] = useState(7);
  const [levelUp, setLevelUp] = useState(0);
  const [stars, setStars] = useState(3);
  const [attempts, setAttempts] = useState(5);
  const [collected, setCollected] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [muted, setMutedState] = useState(false);
  const [fx, setFx] = useState<FxEvent[]>([]);
  const [shake, setShake] = useState(0);
  const [bumped, setBumped] = useState<Record<string, number>>({});
  const anchors = useRef<Record<string, Pt>>({});
  const frameRef = useRef<HTMLDivElement | null>(null);

  const toPt = useCallback((el: Element | null): Pt => {
    const frame = frameRef.current;
    const f = frame?.getBoundingClientRect();
    if (!el || !f || !frame) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    // SECRET: compensate the frame's own scale (entrance animation / shake)
    const s = f.width / (frame.offsetWidth || f.width) || 1;
    return { x: (r.left + r.width / 2 - f.left) / s, y: (r.top + r.height / 2 - f.top) / s };
  }, []);

  const spawn = useCallback((e: Omit<FxEvent, "id">) => {
    setFx((s) => [...s, { ...e, id: fxId++ }]);
  }, []);
  const doneFx = useCallback((id: number) => setFx((s) => s.filter((e) => e.id !== id)), []);

  const bump = useCallback((k: "coins" | "stars" | "attempts" | "xp") => {
    setBumped((b) => ({ ...b, [k]: (b[k] || 0) + 1 }));
  }, []);

  /** Cinematic reward: coins burst → fly to HUD with stagger → XP + confetti. */
  const grant = useCallback(
    (g: { coins?: number; xp?: number; from: Pt; confetti?: boolean; stars?: boolean }) => {
      const coinN = g.coins ? Math.min(14, Math.max(5, Math.round(g.coins / 12))) : 0;
      if (coinN) {
        const base = Math.floor((g.coins || 0) / coinN);
        spawn({ type: "coins", from: g.from, count: coinN });
        for (let i = 0; i < coinN; i++) {
          setTimeout(() => {
            // last coin carries the remainder → total is exact
            setCoins((c) => c + (i === coinN - 1 ? (g.coins || 0) - base * (coinN - 1) : base));
            bump("coins");
            sfx.coin();
          }, 480 + i * 55);
        }
      }
      if (g.stars) {
        setTimeout(() => {
          spawn({ type: "stars", from: g.from, count: 1 });
          setTimeout(() => { setStars((s) => s + 1); bump("stars"); sfx.star(); }, 620);
        }, 180);
      }
      if (g.confetti) {
        setTimeout(() => spawn({ type: "confetti", from: g.from, count: 46 }), 300);
      }
      if (g.xp) {
        setTimeout(() => {
          setXp((x) => {
            const nx = x + (g.xp || 0);
            if (nx >= 1000) {
              setLevel((l) => l + 1);
              setLevelUp((n) => n + 1);
              sfx.success();
              return nx - 1000;
            }
            return nx;
          });
          bump("xp");
        }, coinN ? 700 : 200);
      }
    },
    [spawn, bump],
  );

  const addCoins = useCallback((n: number) => {
    setCoins((c) => c + n);
    bump("coins");
  }, [bump]);
  const addStars = useCallback((n: number) => {
    setStars((c) => c + n);
    bump("stars");
  }, [bump]);

  const spendAttempt = useCallback(() => {
    let ok = false;
    setAttempts((a) => {
      if (a > 0) {
        ok = true;
        return a - 1;
      }
      return a;
    });
    bump("attempts");
    return ok;
  }, [bump]);

  const collect = useCallback(
    (id: string, from: Pt, rarity: string) => {
      if (collected.includes(id)) {
        feel.deny();
        return false;
      }
      setCollected((c) => [...c, id]);
      const reward = { common: 5, rare: 10, epic: 20, legendary: 40 }[rarity] ?? 5;
      const n = Math.min(12, Math.max(4, Math.round(reward / 3)));
      spawn({ type: "coins", from, count: n });
      // coins arrive staggered → counter bumps as they land
      for (let i = 0; i < n; i++) {
        setTimeout(() => {
          setCoins((c) => c + Math.round(reward / n));
          bump("coins");
          sfx.coin();
        }, 520 + i * 45);
      }
      if (rarity === "legendary" || rarity === "epic") {
        setTimeout(() => {
          spawn({ type: "stars", from, count: 1 });
          setTimeout(() => {
            setStars((s) => s + 1);
            bump("stars");
            sfx.star();
          }, 650);
        }, 200);
      }
      return true;
    },
    [collected, spawn, bump],
  );

  const toggleFav = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }, []);

  const toggleMute = useCallback(() => {
    setMutedState((m) => {
      setMuted(!m);
      return !m;
    });
  }, []);

  const screenShake = useCallback(() => setShake((s) => s + 1), []);

  const value = useMemo<GameState>(
    () => ({
      coins,
      xp,
      level,
      levelUp,
      stars,
      attempts,
      collected,
      favorites,
      muted,
      fx,
      shake,
      anchors,
      frameRef,
      toPt,
      collect,
      toggleFav,
      spawn,
      doneFx,
      addCoins,
      addStars,
      spendAttempt,
      toggleMute,
      bump,
      bumped,
      screenShake,
      grant,
    }),
    [coins, xp, level, levelUp, stars, attempts, collected, favorites, muted, fx, shake, toPt, collect, toggleFav, spawn, doneFx, addCoins, addStars, spendAttempt, toggleMute, bump, bumped, screenShake, grant],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useGame = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useGame outside provider");
  return v;
};
