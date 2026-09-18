import React, { createContext, useContext, useState, useCallback } from "react";

/* =====================================================================
   ASSET INSPECTOR CONTEXT
   The right panel edits these per-slot parameters live; the central
   game screen applies them inside the existing containers.
   Only allowed transforms: scale / position / opacity / tint / motion
   preset — layout is never changed.
   ===================================================================== */

export interface AssetState {
  scale: number;
  opacity: number;
  x: number;
  y: number;
  tint: string | null;
  motion: string;
}

export const DEFAULT_ASSET: AssetState = { scale: 1, opacity: 1, x: 0, y: 0, tint: null, motion: "" };

interface Ctx {
  st: (slot: string) => React.CSSProperties;
  get: (slot: string) => AssetState;
  set: (slot: string, patch: Partial<AssetState>) => void;
  reset: () => void;
}

const AssetCtx = createContext<Ctx>({
  st: () => ({}),
  get: () => DEFAULT_ASSET,
  set: () => {},
  reset: () => {},
});

export const AssetProvider = ({ children }: { children: React.ReactNode }) => {
  const [states, setStates] = useState<Record<string, AssetState>>({});

  const get = useCallback((slot: string) => states[slot] ?? DEFAULT_ASSET, [states]);

  const set = useCallback((slot: string, patch: Partial<AssetState>) => {
    setStates((s) => ({ ...s, [slot]: { ...(s[slot] ?? DEFAULT_ASSET), ...patch } }));
  }, []);

  const reset = useCallback(() => setStates({}), []);

  const st = useCallback(
    (slot: string): React.CSSProperties => {
      const a = states[slot] ?? DEFAULT_ASSET;
      const style: React.CSSProperties = {
        transform: `translate(${a.x}px, ${a.y}px) scale(${a.scale})`,
        opacity: a.opacity,
      };
      if (a.tint) {
        style.filter = `drop-shadow(0 0 10px ${a.tint}) drop-shadow(0 0 22px ${a.tint}66)`;
      }
      return style;
    },
    [states],
  );

  return <AssetCtx.Provider value={{ st, get, set, reset }}>{children}</AssetCtx.Provider>;
};

export const useAsset = () => useContext(AssetCtx);
