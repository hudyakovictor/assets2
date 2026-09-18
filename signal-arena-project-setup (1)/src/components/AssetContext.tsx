import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loadRegistry, type AssetRegistry } from "../lib/assetLoader";

const Ctx = createContext<AssetRegistry | null>(null);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [reg, setReg] = useState<AssetRegistry | null>(null);
  useEffect(() => {
    let alive = true;
    loadRegistry().then((r) => alive && setReg(r));
    return () => {
      alive = false;
    };
  }, []);
  return <Ctx.Provider value={reg}>{children}</Ctx.Provider>;
}

export function useAssets() {
  return useContext(Ctx);
}

/** Missing asset marker: no emoji, no invented artwork; exact filename in title. */
export function MissingSlot({ file, size = 16, label }: { file: string; size?: number; label?: boolean }) {
  return (
    <span
      title={`MISSING_ASSET: ${file}`}
      aria-label={`MISSING_ASSET: ${file}`}
      style={{ width: size, height: size, borderRadius: "50%", border: "1.5px dashed rgba(232,112,95,.8)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", color: "#e8705f", fontSize: Math.max(7, size * 0.4), fontWeight: 700 }}
    >
      {label ? "!" : ""}
    </span>
  );
}
